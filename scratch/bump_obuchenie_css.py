import glob

files = glob.glob('**/*.html', recursive=True)
count = 0

for f in files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    changed = False
    if 'obuchenie.css?v=56' in content:
        content = content.replace('obuchenie.css?v=56', 'obuchenie.css?v=58')
        changed = True
    if 'obuchenie.css?v=57' in content:
        content = content.replace('obuchenie.css?v=57', 'obuchenie.css?v=58')
        changed = True
    if changed:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        count += 1
        print(f'Updated {f}')

print(f'Done! Bumped obuchenie.css version to v=58 in {count} HTML files.')
