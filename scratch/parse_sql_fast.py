import json
import re

with open('uploads/u998823_crzrt_db.sql', 'r', encoding='utf-8', errors='ignore') as f:
    sql = f.read()

# Find the long INSERT INTO `settings` VALUES line
insert_start = sql.find("INSERT INTO `settings` VALUES ")
if insert_start != -1:
    line = sql[insert_start:]
    semi = line.find(";\n")
    if semi != -1:
        line = line[:semi]
    
    results = {}
    for m in re.finditer(r"\((\d+),'([^']+)','((?:[^'\\]|\\.)*)'", line):
        row_id = m.group(1)
        key = m.group(2)
        val = m.group(3)
        val_clean = val.replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')
        
        try:
            val_json = json.loads(val_clean)
            results[key] = val_json
            print(f"Extracted JSON key: {key:30s} | Type: {type(val_json).__name__:10s} | Fields/Len: {len(val_json)}")
        except Exception as e:
            results[key] = val_clean
            print(f"Raw string key: {key:30s} | Len: {len(val_clean)} | Parse note: {e}")

    with open('restored_settings.json', 'w', encoding='utf-8') as out:
        json.dump(results, out, ensure_ascii=False, indent=2)

    print(f"\nSuccessfully saved {len(results)} restored keys to restored_settings.json!")
