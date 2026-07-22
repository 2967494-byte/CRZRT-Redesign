import json

with open('restored_settings.json', 'r', encoding='utf-8') as f:
    restored_data = json.load(f)

json_str = json.dumps(restored_data, ensure_ascii=False)

php_content = f"""<?php
// Файл: api/restore.php
// Скрипт полного восстановления всех 11 наборов данных в MySQL базу

require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

$jsonFile = __DIR__ . '/../restored_settings.json';
$data = null;

if (file_exists($jsonFile)) {{
    $content = file_get_contents($jsonFile);
    $data = json_decode($content, true);
}}

if (!is_array($data) || empty($data)) {{
    // Встроенный резервный JSON прямо в PHP файле
    $embeddedJson = <<<'JSONDATA'
{json_str}
JSONDATA;
    $data = json_decode($embeddedJson, true);
}}

if (!is_array($data) || empty($data)) {{
    echo json_encode(['success' => false, 'error' => 'Неудачная расшифровка JSON']);
    exit;
}}

$restoredKeys = [];

try {{
    $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
    
    foreach ($data as $key => $value) {{
        $jsonStr = is_string($value) ? $value : json_encode($value, JSON_UNESCAPED_UNICODE);
        $stmt->execute([$key, $jsonStr, $jsonStr]);
        $restoredKeys[] = $key;
    }}

    if (isset($data['crzrt_obuchenie_page_data']['courseRegistry'])) {{
        require_once 'generate_courses.php';
        generate_static_courses($data['crzrt_obuchenie_page_data']['courseRegistry']);
    }}

    echo json_encode([
        'success' => true,
        'message' => 'Все 11 наборов данных заказчика успешно восстановлены в базе данных MySQL!',
        'restored_keys' => $restoredKeys
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

}} catch (\\PDOException $e) {{
    echo json_encode(['success' => false, 'error' => 'Ошибка БД: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}}
?>
"""

with open('api/restore.php', 'w', encoding='utf-8') as f:
    f.write(php_content)

print("Baked restored_settings.json directly inside api/restore.php!")
