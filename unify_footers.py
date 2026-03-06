import os
import glob
import re

footer_html = """    <footer class="footer">
        <div class="container footer-content">
            <div class="footer-col">
                <h4>Центр развития закупок</h4>
                <p>© 2026 АО «Центр развития закупок РТ»</p>
            </div>
            <div class="footer-col">
                <h4>Обучение</h4>
                <a href="courses.html">Заказчикам</a>
                <a href="courses.html">Поставщикам</a>
                <a href="calendar.html">Календарь</a>
            </div>
            <div class="footer-col">
                <h4>Компания</h4>
                <a href="about.html">О нас</a>
                <a href="contacts.html">Контакты</a>
                <a href="knowledge.html">База знаний</a>
            </div>
            <div class="footer-col">
                <h4>Связаться</h4>
                <a href="tel:88001017892">8 (800) 101-78-92</a>
                <div class="socials">
                    <a href="https://t.me/crzrt">TG</a>
                    <a href="https://vk.com/aocrz">VK</a>
                </div>
            </div>
        </div>
    </footer>"""

html_files = glob.glob("*.html")

for file in html_files:
    if file == "admin.html":
        continue
        
    try:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace the entire footer block
        new_content = re.sub(r'(?s)<footer class="footer">.*?</footer>', footer_html, content)
        
        if new_content != content:
            with open(file, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated footer in {file}")
        else:
            print(f"No footer change for {file}")
            
    except Exception as e:
        print(f"Failed to update {file}: {e}")
