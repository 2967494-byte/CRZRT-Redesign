import glob

files = glob.glob('**/*.html', recursive=True)
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    changed = False
    if 'landing.css?v=26' in content:
        content = content.replace('landing.css?v=26', 'landing.css?v=27')
        changed = True
    if 'obuchenie.css?v=58' in content:
        content = content.replace('obuchenie.css?v=58', 'obuchenie.css?v=59')
        changed = True
    if changed:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        count += 1
        print(f'Updated {f}')

print(f'Done! Bumped CSS versions in {count} HTML files.')
