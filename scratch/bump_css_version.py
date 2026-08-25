import glob

files = glob.glob('**/*.html', recursive=True)
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    if 'landing.css?v=24' in content:
        new_content = content.replace('landing.css?v=24', 'landing.css?v=25')
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(new_content)
        count += 1
        print(f'Updated {f}')

print(f'Updated {count} HTML files to landing.css?v=25')
