import os
import re
import json
import glob

print("======================================================================")
print("LACEYAAN COMPREHENSIVE MOBILE RESPONSIVENESS AUDIT")
print("======================================================================")

# 1. TEMPLATES & SECTION MAPPING
print("\n[1] TEMPLATE TO SECTION MAPPING AUDIT")
template_files = glob.glob('templates/*.json')
template_map = {}
all_referenced_sections = set()

for tpath in sorted(template_files):
    tname = os.path.basename(tpath)
    with open(tpath, 'r', encoding='utf-8') as f:
        raw = f.read()
        clean = re.sub(r'/\*.*?\*/', '', raw, flags=re.DOTALL)
        try:
            data = json.loads(clean)
            sections = data.get('sections', {})
            order = data.get('order', list(sections.keys()))
            sec_types = [sections[s].get('type') for s in order if s in sections]
            template_map[tname] = sec_types
            for st in sec_types:
                if st: all_referenced_sections.add(st)
            print(f"  {tname:<32} -> {len(sec_types)} sections: {', '.join(filter(None, sec_types))}")
        except Exception as e:
            print(f"  ERROR parsing {tname}: {e}")

# Also check layout files
layouts = glob.glob('layout/*.liquid')
print(f"\n  Layouts: {[os.path.basename(l) for l in layouts]}")

# 2. SECTIONS AUDIT
print(f"\n[2] SECTIONS INVENTORY & SIZING INSPECTION")
all_section_files = glob.glob('sections/*.liquid')
print(f"  Total Liquid sections: {len(all_section_files)}")

section_findings = {}

for sfile in sorted(all_section_files):
    sname = os.path.basename(sfile).replace('.liquid', '')
    with open(sfile, 'r', encoding='utf-8') as f:
        content = f.read()

    issues = []
    # Check for inline width or min-width > 300px
    inline_widths = re.findall(r'style=[\'"][^\'"]*?(?:min-)?width:\s*([0-9]+)px', content)
    for w in inline_widths:
        if int(w) > 300:
            issues.append(f"Inline style with width: {w}px")

    # Check for fixed table layout without responsive wrapper
    if '<table' in content and 'overflow-x' not in content and 'cart-table' not in content:
        issues.append("Raw <table> found without explicit responsive wrapper")

    # Check for hardcoded column definitions in style
    if 'grid-template-columns:' in content:
        cols = re.findall(r'grid-template-columns:\s*([^;]+);', content)
        for c in cols:
            if 'repeat(' not in c and '1fr' not in c and 'px' in c:
                issues.append(f"Fixed px in inline grid: {c.strip()}")

    # Check for touch target concerns on buttons
    buttons = re.findall(r'<button[^>]*class=[\'"]([^\'"]+)[\'"]', content)

    section_findings[sname] = issues
    status = "OK" if not issues else f"FINDINGS ({len(issues)})"
    print(f"  {sname:<30}: {status}")
    for iss in issues:
        print(f"    - {iss}")

# 3. CSS AUDIT FOR MOBILE VIEWPORTS
print("\n[3] CSS STYLESHEET RESPONSIVE RULES AUDIT")
with open('assets/theme.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Check font-size < 16px on form inputs (causes iOS Safari automatic zoom)
input_font_rules = re.findall(r'(input\[type=[^\]]+\][^{]*\{[^}]*font-size:\s*([^;]+);)', css)
ios_zoom_risks = []
for rule, fsize in input_font_rules:
    if 'rem' in fsize:
        try:
            val = float(re.search(r'([0-9.]+)', fsize).group(1))
            if val < 1.0: # < 16px
                ios_zoom_risks.append((rule.strip(), fsize.strip()))
        except: pass
    elif 'px' in fsize:
        try:
            val = int(re.search(r'([0-9]+)', fsize).group(1))
            if val < 16:
                ios_zoom_risks.append((rule.strip(), fsize.strip()))
        except: pass

print(f"  iOS Safari zoom risk rules (< 16px font-size): {len(ios_zoom_risks)}")

# Check overflow-x protection
print(f"  Has global overflow-x: hidden on body/html: {'overflow-x: hidden' in css}")

# Check touch target minimums
print(f"  Has touch target overrides: {'min-height: 44px' in css or 'min-height: 48px' in css}")

print("\nAudit scan complete.")
