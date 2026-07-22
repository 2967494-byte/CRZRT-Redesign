with open('uploads/u998823_crzrt_db.sql', 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if 'INSERT INTO `settings` VALUES' in line or 'crzrt_main_page_data' in line:
            print(f"Line starts with: {line[:100]}")
            print(f"Line total length: {len(line)}")
