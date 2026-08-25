import glob

files = glob.glob('**/*.html', recursive=True)
count = 0

old_str = '>Политика конфиденциальности</a>'
new_str = '>Политика в отношении обработки персональных данных</a>'

for f in files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    if old_str in content:
        new_content = content.replace(old_str, new_str)
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(new_content)
        count += 1
        print(f'Updated {f}')

print(f'Done! Replaced footer policy text in {count} HTML files.')
