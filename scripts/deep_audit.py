import os
import re
import json
import glob

def deep_audit():
    print("=" * 70)
    print("LACEYAAN DEEP COMPREHENSIVE AUDIT & BUG HUNTER")
    print("=" * 70)

    findings = []

    # ----------------------------------------------------
    # A. Check assets/coming-soon.css brace mismatch
    # ----------------------------------------------------
    if os.path.exists('assets/coming-soon.css'):
        with open('assets/coming-soon.css', 'r', encoding='utf-8') as f:
            css = f.read()
        o = css.count('{')
        c = css.count('}')
        if o != c:
            findings.append({
                'category': 'CSS & Responsive',
                'severity': 'High',
                'file': 'assets/coming-soon.css',
                'issue': f'Brace mismatch in coming-soon.css: {o} open vs {c} close. Can break styles on password/coming-soon page.'
            })

    # ----------------------------------------------------
    # B. Liquid & HTML Quality Audit across all sections/snippets/layouts
    # ----------------------------------------------------
    all_liquid = glob.glob('sections/*.liquid') + glob.glob('snippets/*.liquid') + glob.glob('layout/*.liquid')

    for path in all_liquid:
        with open(path, 'r', encoding='utf-8') as f:
            code = f.read()

        # Check for images missing width or height (causes CLS - Cumulative Layout Shift)
        imgs = re.findall(r'<img\s+([^>]+)>', code, re.IGNORECASE)
        for img_attrs in imgs:
            has_w = 'width=' in img_attrs
            has_h = 'height=' in img_attrs
            has_alt = 'alt=' in img_attrs
            if not has_w or not has_h:
                findings.append({
                    'category': 'Performance & CLS',
                    'severity': 'Medium',
                    'file': path,
                    'issue': f'<img> tag missing width or height attribute: <img {img_attrs[:50]}...>'
                })
            if not has_alt:
                findings.append({
                    'category': 'SEO & Accessibility',
                    'severity': 'Medium',
                    'file': path,
                    'issue': f'<img> tag missing alt attribute: <img {img_attrs[:50]}...>'
                })

        # Check for unescaped user or query inputs in search/templates (XSS prevention)
        if 'search.terms' in code and 'escape' not in code:
            # check specific usage
            if re.search(r'\{\{\s*search\.terms\s*\}\}', code):
                findings.append({
                    'category': 'Security',
                    'severity': 'High',
                    'file': path,
                    'issue': 'Unescaped {{ search.terms }} output found. Should use {{ search.terms | escape }} to prevent XSS.'
                })

        # Check target="_blank" without rel="noopener noreferrer"
        for a_match in re.finditer(r'<a\s+([^>]*target=["\']_blank["\'][^>]*)>', code, re.IGNORECASE):
            attrs = a_match.group(1)
            if 'rel=' not in attrs or 'noopener' not in attrs:
                findings.append({
                    'category': 'Security & Best Practice',
                    'severity': 'Low',
                    'file': path,
                    'issue': f'target="_blank" link missing rel="noopener noreferrer": <a {attrs[:60]}...>'
                })

        # Check buttons without accessible name or type
        btns = re.findall(r'<button\s+([^>]*?)>(.*?)</button>', code, re.DOTALL | re.IGNORECASE)
        for b_attrs, b_body in btns:
            b_text = re.sub(r'<[^>]+>', '', b_body).strip()
            if not b_text and 'aria-label' not in b_attrs and 'title' not in b_attrs:
                findings.append({
                    'category': 'Accessibility',
                    'severity': 'Medium',
                    'file': path,
                    'issue': f'Button with only icon/empty content lacks aria-label: <button {b_attrs[:50]}>'
                })
            if 'type=' not in b_attrs:
                findings.append({
                    'category': 'Standards & Forms',
                    'severity': 'Low',
                    'file': path,
                    'issue': f'Button element missing explicit type attribute (defaults to submit): <button {b_attrs[:50]}>'
                })

    # ----------------------------------------------------
    # C. SEO Meta Tags & Structured Data in layout/theme.liquid
    # ----------------------------------------------------
    with open('layout/theme.liquid', 'r', encoding='utf-8') as f:
        theme_liquid = f.read()

    if '<link rel="canonical"' not in theme_liquid:
        findings.append({
            'category': 'SEO',
            'severity': 'High',
            'file': 'layout/theme.liquid',
            'issue': 'Missing canonical URL link tag (<link rel="canonical" href="{{ canonical_url }}">).'
        })

    if 'social-meta-tags' not in theme_liquid:
        findings.append({
            'category': 'SEO & Social',
            'severity': 'Medium',
            'file': 'layout/theme.liquid',
            'issue': 'snippets/social-meta-tags.liquid exists but is not rendered in layout/theme.liquid.'
        })

    if 'application/ld+json' not in theme_liquid and 'structured-data' not in theme_liquid:
        findings.append({
            'category': 'SEO & Rich Snippets',
            'severity': 'Medium',
            'file': 'layout/theme.liquid',
            'issue': 'Missing JSON-LD structured data (Organization, WebSite) for rich Google search results.'
        })

    # ----------------------------------------------------
    # D. JavaScript Diagnostics in assets/theme.js
    # ----------------------------------------------------
    with open('assets/theme.js', 'r', encoding='utf-8') as f:
        theme_js = f.read()

    # Check for potential null dereferences in event listeners or DOM lookups
    # Look for querySelector results that are used immediately without check
    dom_matches = re.findall(r'document\.(?:getElementById|querySelector)\([\'"][^\'"]+[\'"]\)\.(?:addEventListener|classList|style|setAttribute)', theme_js)
    for dm in dom_matches[:10]:
        findings.append({
            'category': 'JavaScript Reliability',
            'severity': 'Medium',
            'file': 'assets/theme.js',
            'issue': f'Direct property access without null guard: {dm}'
        })

    # ----------------------------------------------------
    # E. Print Categorized Summary
    # ----------------------------------------------------
    print(f"\nTotal findings discovered: {len(findings)}\n")

    by_sev = {'Critical': [], 'High': [], 'Medium': [], 'Low': []}
    for item in findings:
        by_sev[item['severity']].append(item)

    for sev in ['Critical', 'High', 'Medium', 'Low']:
        items = by_sev[sev]
        print(f"\n--- {sev.upper()} SEVERITY ({len(items)}) ---")
        for i, item in enumerate(items, 1):
            print(f"{i}. [{item['category']}] {item['file']}")
            print(f"   {item['issue']}")

    # Save findings to json
    with open('scripts/audit_findings.json', 'w', encoding='utf-8') as f:
        json.dump(findings, f, indent=2)

if __name__ == '__main__':
    deep_audit()
