import json
import re
import subprocess

subprocess.run(['git', 'checkout', 'assets/js/landing-content.js'])

with open('restored_settings.json', 'r', encoding='utf-8') as f:
    restored = json.load(f)

landing_data = restored.get('crzrt_main_page_data', {})
hero_slides = landing_data.get('heroSlides', [])

for s in hero_slides:
    for k, v in list(s.items()):
        if isinstance(v, str):
            s[k] = v.replace('\r', '').replace('\n', '\\n')

hero_slides_json = json.dumps(hero_slides, ensure_ascii=False)

with open('assets/js/landing-content.js', 'r', encoding='utf-8') as f:
    landing_js = f.read()

landing_js = re.sub(
    r'heroSlides: \[[\s\S]*?\],',
    f'heroSlides: {hero_slides_json},',
    landing_js,
    count=1
)

with open('assets/js/landing-content.js', 'w', encoding='utf-8') as f:
    f.write(landing_js)

print("Embedded clean heroSlides in landing-content.js!")
