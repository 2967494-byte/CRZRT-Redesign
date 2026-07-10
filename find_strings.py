import re

with open('assets/js/testing.js', 'r', encoding='utf-8') as f:
    text = f.read()

# find all strings with \u0420
strings = re.findall(r'"([^"]*?\\u0420[^"]*?)"', text)
for s in strings:
    print(s)
