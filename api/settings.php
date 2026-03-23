<?php
// Файл: api/settings.php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

// ==== 1. ЧТЕНИЕ НАСТРОЕК (GET запрос) ====
// Публично: сайт или админка будет запрашивать данные отсюда
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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
        
        echo json_encode(['success' => true]);
    } catch (\PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Ошибка базы данных: ' . $e->getMessage()]);
    }
    exit;
}
?>
