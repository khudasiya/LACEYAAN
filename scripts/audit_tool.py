import os
import re
import json
import glob

def run_audit():
    print("=" * 60)
    print("LACEYAAN DEEP SYSTEM AUDIT")
    print("=" * 60)

    # 1. Assets Check
    assets_dir = 'assets'
    available_assets = set(os.listdir(assets_dir)) if os.path.exists(assets_dir) else set()
    liquid_files = glob.glob('sections/*.liquid') + glob.glob('snippets/*.liquid') + glob.glob('layout/*.liquid')

    asset_pattern = re.compile(r"['\"]([^'\"]+\.(?:jpg|jpeg|png|svg|webp|gif|mp4|webm|css|js|woff|woff2))['\"]\s*\|\s*asset_url")
    missing_assets = []
    found_asset_count = 0

    for lf in liquid_files:
        with open(lf, 'r', encoding='utf-8') as f:
            content = f.read()
        for match in asset_pattern.findall(content):
            found_asset_count += 1
            if match not in available_assets:
                missing_assets.append((lf, match))

    print(f"\n1. ASSETS CHECK (Checked {found_asset_count} asset references)")
    if missing_assets:
        print(f"Found {len(missing_assets)} missing asset references:")
        for lf, asset in missing_assets:
            print(f"  [MISSING] {lf} -> '{asset}'")
    else:
        print("  [OK] All referenced assets exist in assets/ directory.")

    # 2. Render / Snippets Check
    render_pattern = re.compile(r"\{%\s*(?:render|include)\s+['\"]([^'\"]+)['\"]")
    missing_snippets = []
    snippets_dir = 'snippets'
    available_snippets = {os.path.splitext(f)[0] for f in os.listdir(snippets_dir)} if os.path.exists(snippets_dir) else set()

    for lf in liquid_files:
        with open(lf, 'r', encoding='utf-8') as f:
            content = f.read()
        for snippet in render_pattern.findall(content):
            if snippet not in available_snippets:
                missing_snippets.append((lf, snippet))

    print(f"\n2. SNIPPET / RENDER CHECK")
    if missing_snippets:
        print(f"Found {len(missing_snippets)} missing snippets:")
        for lf, snip in missing_snippets:
            print(f"  [MISSING] {lf} renders '{snip}' (file snippets/{snip}.liquid not found)")
    else:
        print("  [OK] All rendered snippets exist in snippets/ directory.")

    # 3. JSON Validity Check
    print(f"\n3. JSON SCHEMA & TEMPLATE VALIDITY")
    json_files = glob.glob('templates/*.json') + glob.glob('sections/*.json') + glob.glob('config/*.json') + glob.glob('locales/*.json')
    invalid_json = []
    for jf in json_files:
        try:
            with open(jf, 'r', encoding='utf-8') as f:
                raw = f.read()
            # Strip Shopify JSON comment header if present
            cleaned = re.sub(r'/\*.*?\*/', '', raw, flags=re.DOTALL).strip()
            json.loads(cleaned)
        except Exception as e:
            invalid_json.append((jf, str(e)))

    if invalid_json:
        print(f"Found {len(invalid_json)} invalid JSON files:")
        for jf, err in invalid_json:
            print(f"  [INVALID] {jf}: {err}")
    else:
        print(f"  [OK] All {len(json_files)} JSON files are valid and well-formed.")

    # 4. Liquid Tag Balance Check
    print(f"\n4. LIQUID TAGS BALANCE CHECK")
    unbalanced_tags = []
    for lf in liquid_files:
        with open(lf, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check standard paired tags
        pairs = [
            ('if', 'endif'),
            ('unless', 'endunless'),
            ('for', 'endfor'),
            ('case', 'endcase'),
            ('form', 'endform'),
            ('paginate', 'endpaginate'),
            ('capture', 'endcapture'),
            ('schema', 'endschema'),
            ('style', 'endstyle'),
            ('javascript', 'endjavascript'),
            ('comment', 'endcomment')
        ]
        for open_t, close_t in pairs:
            opens = len(re.findall(r"\{%[-]?\s*" + open_t + r"\b", content))
            closes = len(re.findall(r"\{%[-]?\s*" + close_t + r"\b", content))
            if opens != closes:
                unbalanced_tags.append((lf, open_t, opens, close_t, closes))

    if unbalanced_tags:
        print(f"Found {len(unbalanced_tags)} unbalanced Liquid tags:")
        for lf, open_t, opens, close_t, closes in unbalanced_tags:
            print(f"  [UNBALANCED] {lf}: {open_t} ({opens}) vs {close_t} ({closes})")
    else:
        print(f"  [OK] All {len(liquid_files)} Liquid files have 100% balanced tags.")

    # 5. Broken Navigation Links & Routes Check
    print(f"\n5. NAVIGATION & ROUTES AUDIT")
    href_pattern = re.compile(r"href=['\"]([^'\"]+)['\"]")
    links = set()
    for lf in liquid_files:
        with open(lf, 'r', encoding='utf-8') as f:
            content = f.read()
        for h in href_pattern.findall(content):
            links.add((lf, h))

    # Known routes in this Shopify store
    valid_prefixes = [
        '/', '#', 'http://', 'https://', 'mailto:', 'tel:', 'javascript:', '{{',
        '/pages/', '/collections/', '/products/', '/cart', '/search', '/account', '/challenge'
    ]
    suspicious_links = []
    for lf, h in links:
        if not any(h.startswith(p) for p in valid_prefixes):
            suspicious_links.append((lf, h))

    if suspicious_links:
        print(f"Found {len(suspicious_links)} potentially broken/relative link paths:")
        for lf, h in suspicious_links:
            print(f"  [WARN] {lf} -> href='{h}'")
    else:
        print(f"  [OK] All {len(links)} audited href links match valid route conventions.")

    # 6. Accessibility & Form Labels Audit
    print(f"\n6. ACCESSIBILITY & FORM AUDIT")
    a11y_issues = []
    for lf in liquid_files:
        with open(lf, 'r', encoding='utf-8') as f:
            content = f.read()

        # Missing alt on img
        imgs_without_alt = re.findall(r"<img(?![^>]*\balt=)[^>]*>", content, re.IGNORECASE)
        if imgs_without_alt:
            a11y_issues.append((lf, f"Missing alt attribute on {len(imgs_without_alt)} <img> tags"))

        # Empty buttons without aria-label or text
        empty_buttons = re.findall(r"<button[^>]*>\s*(?:<svg[^>]*>.*?</svg>)?\s*</button>", content, re.DOTALL | re.IGNORECASE)
        for btn in empty_buttons:
            if 'aria-label' not in btn and 'title' not in btn:
                a11y_issues.append((lf, f"Button with only icon/no text missing aria-label: {btn[:60]}..."))

        # Target _blank without rel="noopener"
        blank_targets = re.findall(r"<a[^>]*target=['\"]_blank['\"][^>]*>", content, re.IGNORECASE)
        for a_tag in blank_targets:
            if 'rel=' not in a_tag or 'noopener' not in a_tag:
                a11y_issues.append((lf, f"target='_blank' missing rel='noopener noreferrer': {a_tag[:60]}..."))

    if a11y_issues:
        print(f"Found {len(a11y_issues)} accessibility/security warnings:")
        for lf, w in a11y_issues:
            print(f"  [A11Y/SEC] {lf}: {w}")
    else:
        print("  [OK] No missing alt, unlabeled buttons, or unpadded blank targets found.")

    # 7. JavaScript Syntax & Diagnostics
    print(f"\n7. JAVASCRIPT CODEBASE AUDIT")
    js_files = glob.glob('assets/*.js')
    for jf in js_files:
        # Check size and basic patterns
        size = os.path.getsize(jf)
        with open(jf, 'r', encoding='utf-8') as f:
            js_code = f.read()
        # Look for obvious syntax dangers like console.log or debugger or unfinished TODOs
        todo_matches = re.findall(r"(?:TODO|FIXME|HACK):?\s*(.+)", js_code)
        print(f"  {jf}: {size:,} bytes")
        if todo_matches:
            print(f"    Pending notes: {todo_matches[:3]}")

    # 8. CSS Audit (Brace Balance & Media Queries)
    print(f"\n8. CSS STYLESHEET AUDIT")
    css_files = glob.glob('assets/*.css')
    for cf in css_files:
        with open(cf, 'r', encoding='utf-8') as f:
            css_code = f.read()
        opens = css_code.count('{')
        closes = css_code.count('}')
        status = "BALANCED" if opens == closes else "MISMATCH!"
        print(f"  {cf}: {len(css_code):,} chars, {opens} blocks ({status})")

if __name__ == '__main__':
    run_audit()
