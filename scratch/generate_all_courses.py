import json
import os
import re

with open('restored_settings.json', 'r', encoding='utf-8') as f:
    restored = json.load(f)

course_registry = restored.get('crzrt_obuchenie_page_data', {}).get('courseRegistry', [])

with open('course-template.html', 'r', encoding='utf-8') as f:
    template = f.read()

courses_dir = 'courses'
os.makedirs(courses_dir, exist_ok=True)

months = {
    1: 'января', 2: 'февраля', 3: 'марта', 4: 'апреля',
    5: 'мая', 6: 'июня', 7: 'июля', 8: 'августа',
    9: 'сентября', 10: 'октября', 11: 'ноября', 12: 'декабря'
}

count = 0
for course in course_registry:
    if not course.get('active', True):
        continue
    
    html = template
    title = course.get('title', 'Курс')
    
    # 1. SEO
    html = re.sub(r'<title>.*?</title>', f'<title>{title}. Центр развития закупок</title>', html)
    html = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="Программа обучения: {title}">', html)

    # 2. Breadcrumbs
    html = re.sub(r'<span class="current">.*?</span>', f'<span class="current">{title}</span>', html, flags=re.DOTALL)

    # 3. Title & Desc
    html = re.sub(r'<h1 class="course-hero__title">.*?</h1>', f'<h1 class="course-hero__title">{title}</h1>', html, flags=re.DOTALL)
    desc = course.get('description', '')
    if isinstance(desc, list):
        desc = '<br>'.join(desc)
    html = re.sub(r'<p class="course-hero__desc">.*?</p>', f'<p class="course-hero__desc">{desc}</p>', html, flags=re.DOTALL)

    # 4. Duration
    dur_days = int(course.get('durationDays', 1) or 1)
    mod100 = dur_days % 100
    mod10 = dur_days % 10
    if 11 <= mod100 <= 19:
        unit = 'дней'
    elif mod10 == 1:
        unit = 'день'
    elif 2 <= mod10 <= 4:
        unit = 'дня'
    else:
        unit = 'дней'
    duration_str = f"{dur_days} {unit}"
    html = re.sub(r'<span class="course-widget-item__label">Длительность</span>.*?<span class="course-widget-item__val">.*?</span>',
                  f'<span class="course-widget-item__label">Длительность</span><span class="course-widget-item__val">{duration_str}</span>', html, flags=re.DOTALL)

    # 5. Price
    price = course.get('price', '')
    html = re.sub(r'<span class="course-widget-item__label">Стоимость</span>.*?<span class="course-widget-item__val course-widget-item__price">.*?</span>',
                  f'<span class="course-widget-item__label">Стоимость</span><span class="course-widget-item__val course-widget-item__price">{price}</span>', html, flags=re.DOTALL)

    # 6. Save HTML file
    file_id = course.get('id')
    if file_id:
        file_path = os.path.join(courses_dir, f"{file_id}.html")
        with open(file_path, 'w', encoding='utf-8') as out:
            out.write(html)
        count += 1

print(f"Generated {count} static course HTML files in courses/ directory!")
