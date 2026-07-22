import re
import json

with open('uploads/u998823_crzrt_db.sql', 'r', encoding='utf-8', errors='ignore') as f:
    sql_text = f.read()

# In MySQL dump, multiple rows are inserted in:
# INSERT INTO `settings` VALUES (1,'crzrt_main_page_data','...'),(2,'crzrt_obuchenie_page_data','...'),...;

# Let's find all tuples: (\d+,'crzrt_[^']+\','(?:[^'\\]|\\.)*')
pattern = r"\(\d+,'(crzrt_[a-z0-9_]+)','((?:[^'\\]|\\.)*)'\)"

matches = re.findall(pattern, sql_text)

print(f"Extracted {len(matches)} keys from SQL dump:\n")

restored_data = {}
for key, raw_val in matches:
    # Unescape SQL escapes
    val_str = raw_val.replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')
    print(f"  - Key: {key:30s} | Length: {len(val_str):7d} chars")
    
    # Try parsing JSON to verify valid structure
    try:
        parsed = json.loads(val_str)
        restored_data[key] = parsed
    except Exception as e:
        print(f"    Warning: JSON parse error for {key}: {e}")
        restored_data[key] = val_str

# Save into restored_settings.json
with open('restored_settings.json', 'w', encoding='utf-8') as out:
    json.dump(restored_data, out, ensure_ascii=False, indent=2)

print("\nSaved all restored keys into restored_settings.json successfully!")
