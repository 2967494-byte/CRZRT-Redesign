import os
import glob
import re

html_files = glob.glob('*.html')

pattern2 = re.compile(
    r'(\.subnav\s*\{\s*background:[^;]+;\s*border-bottom:[^;]+;\s*position:\s*sticky;\s*)top:\s*108px;\s*margin-top:\s*108px;(\s*z-index:\s*100;)',
    re.MULTILINE
)

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content, count = pattern2.subn(r'\1top: 125px;\n            margin-top: 125px;\2', content)
    
    if count > 0:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated {f}")
