import re
import json

with open('uploads/u998823_crzrt_db.sql', 'r', encoding='utf-8', errors='ignore') as f:
    sql_text = f.read()

# Pattern for INSERT INTO `settings` VALUES (id, 'key', 'value', 'updated_at');
pattern = r"INSERT INTO `settings` VALUES \(\d+,'([^']+)',('(?:[^'\\]|\\.)*')"

matches = re.findall(pattern, sql_text)
print(f"Found {len(matches)} settings keys in SQL dump:")

extracted = {}
for key, raw_val in matches:
    # Remove surrounding quotes
    if raw_val.startswith("'") and raw_val.endswith("'"):
        val_str = raw_val[1:-1]
    else:
        val_str = raw_val
    # Unescape escaped single quotes and backslashes in SQL
    val_str = val_str.replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')
    print(f"  - Key: {key} (length: {len(val_str)} chars)")
    extracted[key] = val_str

# Save extracted keys into a clean JSON file
with open('restored_settings.json', 'w', encoding='utf-8') as out:
    out.write(json.dumps(extracted, ensure_ascii=False, indent=2))

print("\nSuccessfully extracted all settings into restored_settings.json!")
