import os
import glob
import re

html_files = glob.glob("*.html")

for file in html_files:
    if file == "admin.html" or file == "header.html":
        continue
        
    try:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
        
        # 1. Replace nav-legal # with consulting.html
        content = re.sub(
            r'(<div class="nav-bar-item nav-legal">\s*<a href=")("#)(" class="nav-item-link">)', 
            r'\1consulting.html\3', 
            content
        )
        
        # 2. Extract header and insert global header js
        content = re.sub(
            r'(?s)<header class="header">.*?</header>', 
            '<div id="global-header"></div>\n    <script src="header.js"></script>', 
            content
        )
        
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
            
        print(f"Updated {file}")
    except Exception as e:
        print(f"Failed to update {file}: {e}")
