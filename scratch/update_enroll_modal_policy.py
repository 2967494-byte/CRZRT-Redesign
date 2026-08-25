import glob

files = glob.glob('**/*.html', recursive=True)
count = 0

old_str = '<span class="enroll-modal__checkbox-text">Нажимая на кнопку, я принимаю <a href="#">условия соглашения</a>. *</span>'
new_str = '<span class="enroll-modal__checkbox-text">Я соглашаюсь с <a href="https://zakupki.tatar/privacy.html" target="_blank" rel="noopener">политикой в отношении обработки персональных данных</a> *</span>'

for f in files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    if 'условия соглашения' in content:
        new_content = content.replace(old_str, new_str)
        # fallback in case of minor whitespace difference
        if 'условия соглашения' in new_content:
            import re
            new_content = re.sub(
                r'<span class="enroll-modal__checkbox-text">.*?условия соглашения.*?<\/span>',
                new_str,
                new_content,
                flags=re.DOTALL
            )
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(new_content)
        count += 1
        print(f'Updated enroll modal in {f}')

print(f'Done! Updated {count} HTML files.')
