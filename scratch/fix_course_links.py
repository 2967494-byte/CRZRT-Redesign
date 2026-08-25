import glob

files = glob.glob('courses/*.html')
print(f'Found {len(files)} course files')
for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    changed = False
    if 'href="privacy.html"' in content:
        content = content.replace('href="privacy.html"', 'href="../privacy.html"')
        changed = True
    if 'href="consent.html"' in content:
        content = content.replace('href="consent.html"', 'href="../consent.html"')
        changed = True
    if 'href="index.html"' in content:
        content = content.replace('href="index.html"', 'href="../index.html"')
        changed = True
    if 'href="news.html"' in content:
        content = content.replace('href="news.html"', 'href="../news.html"')
        changed = True
    if 'href="knowledge.html"' in content:
        content = content.replace('href="knowledge.html"', 'href="../knowledge.html"')
        changed = True
    if 'href="team.html"' in content:
        content = content.replace('href="team.html"', 'href="../team.html"')
        changed = True
    if changed:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        print('Updated', f)
print('Done checking course files!')
