import re

with open('assets/js/testing.js', 'r', encoding='utf-8') as f:
    text = f.read()

def unescape_unicode(match):
    return chr(int(match.group(1), 16))

def fix_string(match):
    s = match.group(0)
    unescaped = re.sub(r'\\u([0-9a-fA-F]{4})', unescape_unicode, s)
    try:
        # We need to drop the surrounding quotes to decode properly, but here we matched them so we should just decode the inner content.
        # Actually match.group(0) includes the quotes.
        inner = unescaped[1:-1]
        fixed_inner = inner.encode('cp1251').decode('utf-8')
        return s[0] + fixed_inner + s[-1]
    except Exception as e:
        return s

# Find all double-quoted and single-quoted strings containing \u
text = re.sub(r'"([^"]*?\\u[^"]*?)"', fix_string, text)
text = re.sub(r"'([^']*?\\u[^']*?)'", fix_string, text)

with open('assets/js/testing-fixed3.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Done!')
