import json

with open('restored_settings.json', 'r', encoding='utf-8') as f:
    restored = json.load(f)

obuchenie_data = restored.get('crzrt_obuchenie_page_data', {})
landing_data = restored.get('crzrt_main_page_data', {})

# Save cleaned defaults to JSON assets for fallback
with open('assets/js/restored_obuchenie.json', 'w', encoding='utf-8') as out:
    json.dump(obuchenie_data, out, ensure_ascii=False, indent=2)

with open('assets/js/restored_landing.json', 'w', encoding='utf-8') as out:
    json.dump(landing_data, out, ensure_ascii=False, indent=2)

print("Saved restored_obuchenie.json and restored_landing.json!")
