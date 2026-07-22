import json

with open('restored_settings.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

obuchenie = data.get('crzrt_obuchenie_page_data', {})
courses = obuchenie.get('courseRegistry', [])

print(f"Total courses in restored obuchenie data: {len(courses)}")
for c in courses:
    print(f" - ID: {c.get('id'):30s} | Title: {c.get('title')} | DateFrom: {c.get('dateFrom')}")

main_hero = data.get('crzrt_main_page_data', {}).get('heroSlides', [])
print(f"\nTotal hero slides in restored main page data: {len(main_hero)}")
for s in main_hero:
    print(f" - Title: {s.get('title')} | BG: {s.get('background')}")
