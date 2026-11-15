import os
import subprocess
import json
import time
import http.server
import threading
import re
import html

PORT = 8780
server = http.server.HTTPServer(('127.0.0.1', PORT), http.server.SimpleHTTPRequestHandler)
t = threading.Thread(target=server.serve_forever, daemon=True)
t.start()
print(f"HTTP Server started on 127.0.0.1:{PORT}")

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
out_dir = os.path.abspath('viewport_reports')
os.makedirs(out_dir, exist_ok=True)

# Required viewports according to Phase 3:
viewports = [
    (320, 640, "320px - Small mobile (iPhone SE 1st gen / Folded)"),
    (360, 740, "360px - Standard Android (Galaxy A/S)"),
    (375, 812, "375px - iPhone (iPhone SE / mini / 6/7/8)"),
    (390, 844, "390px - Modern iPhone (iPhone 12/13/14)"),
    (414, 896, "414px - Large mobile (iPhone 11 Pro Max / Plus)"),
    (430, 932, "430px - Large mobile (iPhone 14/15 Pro Max)"),
    (768, 1024, "768px - Tablet (iPad mini / tablet portrait)"),
    (1024, 768, "1024px - Small laptop / Tablet landscape"),
    (1440, 900, "1440px - Desktop")
]

# We will inject a JavaScript snippet into preview_public_store.html or run it via chrome evaluate
# Let's create an evaluation script that checks the DOM
eval_js = """
(() => {
    const docWidth = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const bodyScrollWidth = document.body.scrollWidth;
    const hasHorizontalOverflow = (scrollWidth > docWidth) || (bodyScrollWidth > docWidth);

    const overflowingElements = [];
    const smallTouchTargets = [];

    // Scan all visible elements
    const all = document.querySelectorAll('*');
    all.forEach(el => {
        const rect = el.getBoundingClientRect();
        // check overflow
        if (rect.width > 0 && rect.height > 0) {
            if (rect.right > docWidth + 1.5) {
                const tag = el.tagName.toLowerCase();
                const cls = (el.className && typeof el.className === 'string') ? el.className.trim() : '';
                const id = el.id ? '#' + el.id : '';
                overflowingElements.push({
                    selector: `${tag}${id}.${cls.split(' ').slice(0, 2).join('.')}`,
                    right: Math.round(rect.right),
                    docWidth: docWidth,
                    overflow: Math.round(rect.right - docWidth)
                });
            }
        }

        // check interactive touch targets
        if (el.matches('button, a, input, select, textarea, [role=\"button\"]')) {
            const style = window.getComputedStyle(el);
            if (style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0) {
                if (rect.width < 40 || rect.height < 40) {
                    const tag = el.tagName.toLowerCase();
                    const cls = (el.className && typeof el.className === 'string') ? el.className.trim() : '';
                    smallTouchTargets.push({
                        element: `${tag}.${cls.split(' ').slice(0, 2).join('.')}`,
                        width: Math.round(rect.width),
                        height: Math.round(rect.height)
                    });
                }
            }
        }
    });

    return {
        viewportWidth: docWidth,
        scrollWidth: scrollWidth,
        bodyScrollWidth: bodyScrollWidth,
        hasHorizontalOverflow: hasHorizontalOverflow,
        overflowDelta: Math.max(0, scrollWidth - docWidth, bodyScrollWidth - docWidth),
        totalOverflowingElements: overflowingElements.length,
        topOverflowing: overflowingElements.slice(0, 5),
        totalSmallTouchTargets: smallTouchTargets.length,
        sampleSmallTouchTargets: smallTouchTargets.slice(0, 5)
    };
})()
"""

# To evaluate JS in headless chrome without puppeteer, we can use a test wrapper HTML file that runs the audit
# and writes the result to a meta tag or window title or document.body, then we dump it via --dump-dom!
print("\nPreparing headless test harness with --dump-dom...")

with open('preview_public_store.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

# Inject audit runner script before </body>
injected_script = f"""
<script>
(() => {{
    const report = {eval_js};
    const el = document.createElement('div');
    el.id = '__AUDIT_RESULT__';
    el.setAttribute('data-report', JSON.stringify(report));
    document.body.appendChild(el);
}})();
</script>
"""

test_html_path = 'preview_test_runner.html'
with open(test_html_path, 'w', encoding='utf-8') as f:
    f.write(orig_html.replace('</body>', injected_script + '\n</body>'))

print(f"Created {test_html_path}. Running tests across all {len(viewports)} viewports...")

results = {}

for w, h, label in viewports:
    screenshot_path = os.path.join(out_dir, f"vp_{w}x{h}.png")
    cmd = [
        chrome_path,
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        f'--window-size={w},{h}',
        f'--screenshot={screenshot_path}',
        f'--dump-dom',
        f'http://127.0.0.1:{PORT}/{test_html_path}'
    ]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=12)
        dom = proc.stdout
        m = re.search(r'id=\"__AUDIT_RESULT__\"\s+data-report=\"([^\"]+)\"', dom)
        if m:
            import html
            raw_json = html.unescape(m.group(1))
            report = json.loads(raw_json)
            results[w] = report
            status = "[PASS]" if not report['hasHorizontalOverflow'] else f"[OVERFLOW +{report['overflowDelta']}px]"
            print(f"  {w}px ({label.split(' - ')[0]}): {status} (scrollWidth: {report['scrollWidth']} vs clientWidth: {report['viewportWidth']}, small targets: {report['totalSmallTouchTargets']})")
            if report['overflowDelta'] > 0:
                print(f"     Top overflowing elements: {report['topOverflowing']}")
        else:
            print(f"  {w}px: Could not extract audit result tag (DOM length {len(dom)})")
    except Exception as e:
        print(f"  {w}px ERROR: {e}")

# Save full results
with open(os.path.join(out_dir, 'viewport_audit_results.json'), 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print("\nAudit run complete. Results saved to viewport_reports/viewport_audit_results.json")
