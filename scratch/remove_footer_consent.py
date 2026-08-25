import glob
import re

files = glob.glob('**/*.html', recursive=True)
count = 0

consent_link_regex = re.compile(r'\s*<a\s+href="[^"]*consent\.html"\s+class="footer__bottom-link footer__bottom-link--consent">Согласие на обработку персональных данных</a>', re.IGNORECASE)

for f in files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    
    new_content, n = consent_link_regex.subn('', content)
    if n > 0:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(new_content)
        count += 1
        print(f'Removed consent footer link in {f}')

print(f'Done! Removed consent link from footers in {count} HTML files.')
