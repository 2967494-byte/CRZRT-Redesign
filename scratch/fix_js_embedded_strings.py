import json
import re
import subprocess

# 1. Restore clean files from git
subprocess.run(['git', 'checkout', 'assets/js/obuchenie-content.js', 'assets/js/landing-content.js'])

with open('restored_settings.json', 'r', encoding='utf-8') as f:
    restored = json.load(f)

obuchenie_data = restored.get('crzrt_obuchenie_page_data', {})
landing_data = restored.get('crzrt_main_page_data', {})

courses = obuchenie_data.get('courseRegistry', [])

# Serialize JSON and escape unescaped literal newlines for JS source code
courses_json_js = json.dumps(courses, ensure_ascii=False).replace('\n', '\\n').replace('\r', '\\r')

# Update obuchenie-content.js
with open('assets/js/obuchenie-content.js', 'r', encoding='utf-8') as f:
    obuchenie_js = f.read()

obuchenie_js = re.sub(
    r'var DEFAULT_COURSE_REGISTRY = \[[\s\S]*?\];',
    f'var DEFAULT_COURSE_REGISTRY = {courses_json_js};',
    obuchenie_js,
    count=1
)

# Add getCourseDateRange fix
get_ranges_pos = obuchenie_js.find("function getCourseDateRanges(course) {")
if get_ranges_pos != -1:
    end_of_func = obuchenie_js.find("  function normalizeSpeaker", get_ranges_pos)
    fix_code = "\n  function getCourseDateRange(course) {\n    var ranges = getCourseDateRanges(course);\n    return ranges.length ? ranges[0] : null;\n  }\n"
    obuchenie_js = obuchenie_js[:end_of_func] + fix_code + obuchenie_js[end_of_func:]

# Export getCourseDateRanges & getCourseDateRange
export_pos = obuchenie_js.find("getCourseDateRange: getCourseDateRange,")
if export_pos != -1:
    obuchenie_js = obuchenie_js[:export_pos] + "getCourseDateRange: getCourseDateRange,\n    getCourseDateRanges: getCourseDateRanges,\n" + obuchenie_js[export_pos + len("getCourseDateRange: getCourseDateRange,"):]

with open('assets/js/obuchenie-content.js', 'w', encoding='utf-8') as f:
    f.write(obuchenie_js)

print("Updated obuchenie-content.js cleanly!")

# Update landing-content.js
with open('assets/js/landing-content.js', 'r', encoding='utf-8') as f:
    landing_js = f.read()

hero_slides = landing_data.get('heroSlides', [])
hero_slides_json = json.dumps(hero_slides, ensure_ascii=False).replace('\n', '\\n').replace('\r', '\\r')

landing_js = re.sub(
    r'heroSlides: \[[\s\S]*?\],',
    f'heroSlides: {hero_slides_json},',
    landing_js,
    count=1
)

with open('assets/js/landing-content.js', 'w', encoding='utf-8') as f:
    f.write(landing_js)

print("Updated landing-content.js cleanly!")
