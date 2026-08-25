import glob
import re

files = glob.glob('courses/*.html')
print(f'Found {len(files)} course files')

target_pattern = re.compile(r'<span>(Согласен с|Я соглашаюсь с)\s*<a\s+[^>]*>.*?<\/a><\/span>', re.IGNORECASE | re.DOTALL)
replacement = '<span>Я соглашаюсь с <a href="https://zakupki.tatar/privacy.html" target="_blank" rel="noopener">политикой в отношении обработки персональных данных</a></span>'

for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    new_content, count = target_pattern.subn(replacement, content)
    if count > 0:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(new_content)
        print(f'Updated {f} ({count} replacements)')
    else:
        print(f'No match in {f}')

print('Done updating all course files!')
