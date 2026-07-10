import re

with open('assets/js/testing.js', 'r', encoding='utf-8') as f:
    text = f.read()

def uncorrupt(s):
    # Try to encode as cp1251 and decode as utf-8
    try:
        return s.encode('cp1251').decode('utf-8')
    except:
        pass
    
    # Also, some strings might have \u escapes and \x escapes
    unescaped = s
    unescaped = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), unescaped)
    unescaped = re.sub(r'\\x([0-9a-fA-F]{2})', lambda m: chr(int(m.group(1), 16)), unescaped)
    
    try:
        # Check if unescaped is different from s, else don't corrupt it
        if unescaped != s:
            return unescaped.encode('cp1251').decode('utf-8')
    except:
        pass
    
    return s

def fix_match(m):
    s = m.group(1)
    fixed = uncorrupt(s)
    return '"' + fixed + '"'

text = re.sub(r'"([^"]*?)"', fix_match, text)

# Now single quotes
def fix_match_sq(m):
    s = m.group(1)
    fixed = uncorrupt(s)
    return "'" + fixed + "'"

text = re.sub(r"'([^']*?)'", fix_match_sq, text)

with open('assets/js/testing-final.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Done!')
