import glob
import re

files = glob.glob('courses/*.html')
count = 0

old_fragment = '<span>Я соглашаюсь с <a href="https://zakupki.tatar/privacy.html" target="_blank" rel="noopener">политикой в отношении обработки персональных данных</a></span>'
new_fragment = '<span>Я даю своё согласие акционерному обществу «Центр развития закупок Республики Татарстан» на обработку моих персональных данных в соответствии с Федеральным законом от 27.07.2006 г. №152-ФЗ «О персональных данных» на условиях и для целей, определенных <a href="https://zakupki.tatar/privacy.html" target="_blank" rel="noopener">Политикой акционерного общества «Центр развития закупок Республики Татарстан» в отношении обработки персональных данных</a>.</span>'

for f in files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    if old_fragment in content:
        new_content = content.replace(old_fragment, new_fragment)
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(new_content)
        count += 1
        print(f'Updated {f}')

print(f'Done! Updated {count} course files.')
