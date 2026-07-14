<?php
// Файл: api/settings.php
session_start();
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

// ==== 1. ЧТЕНИЕ НАСТРОЕК (GET запрос) ====
// Публично: сайт или админка будет запрашивать данные отсюда
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');
    $key = $_GET['key'] ?? '';
    
    try {
        if ($key) {
            $stmt = $pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = ?");
            $stmt->execute([$key]);
            $row = $stmt->fetch();
            // Если данных нет, отдаём пустой JSON-объект, чтобы скриптам на сайте было не больно
            echo $row ? $row['setting_value'] : '{}';
        } else {
            // Если запросили все настройки (без ключа), отдаем массив
            $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
            $settings = [];
            while ($row = $stmt->fetch()) {
                $settings[$row['setting_key']] = json_decode($row['setting_value'], true) ?: $row['setting_value'];
            }
            echo json_encode($settings);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'DB error']);
    }
    exit;
}

// ==== ЗАЩИТА ====
// К сохранению текстов допускаем только тех, кто авторизовался (есть сессия)
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Несанкционированный доступ :(']);
    exit;
}

// ==== 2. СОХРАНЕНИЕ НАСТРОЕК (POST запрос) ====
// Сюда стучится админка по кнопке "Сохранить изменения"
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    $key = $data['key'] ?? '';
    // Превращаем массив данных обратно в строку JSON перед записью в MySQL
    $value = isset($data['value']) ? json_encode($data['value'], JSON_UNESCAPED_UNICODE) : '';
    
    if (!$key) {
        echo json_encode(['success' => false, 'error' => 'Ключ не указан']);
        exit;
    }
    
    try {
        // UPSERT: Если настройки не было - создаём, если была - обновляем (ON DUPLICATE KEY UPDATE)
        $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
        $stmt->execute([$key, $value, $value]);
        
        $response = ['success' => true, 'key' => $key, 'size' => strlen($value)];

        // Если обновили курсы, перегенерируем статические HTML страницы
        if ($key === 'crzrt_obuchenie_page_data' && isset($data['value']['courseRegistry'])) {
            require_once 'generate_courses.php';
            $genResult = generate_static_courses($data['value']['courseRegistry']);
            $response['generated_pages'] = $genResult;
        }

        echo json_encode($response);
    } catch (\PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Ошибка базы данных: ' . $e->getMessage()]);
    }
    exit;
}
?>
