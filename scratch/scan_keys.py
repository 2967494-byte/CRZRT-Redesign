import re

with open('uploads/u998823_crzrt_db.sql', 'r', encoding='utf-8', errors='ignore') as f:
    sql = f.read()

keys = re.findall(r"crzrt_[a-z0-9_]+", sql)
print("All crzrt_ keys in SQL dump:", set(keys))
