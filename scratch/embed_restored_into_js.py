import json
import re

with open('restored_settings.json', 'r', encoding='utf-8') as f:
    restored = json.load(f)

obuchenie_data = restored.get('crzrt_obuchenie_page_data', {})
landing_data = restored.get('crzrt_main_page_data', {})

# Git checkout obuchenie-content.js and landing-content.js first to get clean versions
import subprocess
subprocess.run(['git', 'checkout', 'assets/js/obuchenie-content.js', 'assets/js/landing-content.js'])

with open('assets/js/obuchenie-content.js', 'r', encoding='utf-8') as f:
    obuchenie_js = f.read()

courses = obuchenie_data.get('courseRegistry', [])
# Ensure courses JSON has no raw unescaped newlines in strings
courses_json = json.dumps(courses, ensure_ascii=False)

# Replace DEFAULT_COURSE_REGISTRY in obuchenie-content.js
obuchenie_js = re.sub(
    r'var DEFAULT_COURSE_REGISTRY = \[[\s\S]*?\];',
    f'var DEFAULT_COURSE_REGISTRY = {courses_json};',
    obuchenie_js,
    count=1
)

with open('assets/js/obuchenie-content.js', 'w', encoding='utf-8') as f:
    f.write(obuchenie_js)

print("Updated obuchenie-content.js DEFAULT_COURSE_REGISTRY safely!")

with open('assets/js/landing-content.js', 'r', encoding='utf-8') as f:
    landing_js = f.read()

hero_slides = landing_data.get('heroSlides', [])
hero_slides_json = json.dumps(hero_slides, ensure_ascii=False)

landing_js = re.sub(
    r'heroSlides: \[[\s\S]*?\],',
    f'heroSlides: {hero_slides_json},',
    landing_js,
    count=1
)

with open('assets/js/landing-content.js', 'w', encoding='utf-8') as f:
    f.write(landing_js)

print("Updated landing-content.js heroSlides safely!")
