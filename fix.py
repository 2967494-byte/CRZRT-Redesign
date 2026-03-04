import os
import glob

def fix_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()
        
        # If it doesn't contain 'Р', it might not be corrupted or already fixed
        if 'Р' not in text and 'С' not in text:
            print(f"Skipping {filepath} (no krakozyabry detected)")
            return

        # Attempt to reverse the corruption
        original_bytes = text.replace('\ufeff', '').encode("windows-1251", errors='ignore')
        fixed_text = original_bytes.decode("utf-8")
        
        # Also fix the weird newlines inserted by the script incorrectly
        fixed_text = fixed_text.replace('</div>`n    <script', '</div>\n    <script')
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(fixed_text)
            
        print(f"Fixed {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

html_files = glob.glob("*.html")
for file in html_files:
    if file != "admin.html":
        fix_file(file)
