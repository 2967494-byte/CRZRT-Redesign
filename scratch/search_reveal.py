import os

css_path = r"C:\Users\Matvey\Documents\Projects\CRZRT-Site\assets\css\landing.css"
with open(css_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "reveal" in line:
        print(f"Line {i+1}: {line.strip()}")
