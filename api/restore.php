<?php
/**
 * Восстановление settings из restored_settings.json.
 * БЕЗОПАСНОСТЬ: только POST + авторизованная сессия админа.
 * Старый вариант выполнялся на любой GET — это опасно.
 */
session_start();
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Метод не поддерживается. Используйте POST после входа в админку.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Несанкционированный доступ',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$jsonFile = __DIR__ . '/../restored_settings.json';
if (!is_file($jsonFile)) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error' => 'Файл restored_settings.json не найден',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$content = file_get_contents($jsonFile);
$data = json_decode($content, true);
if (!is_array($data) || !$data) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Некорректный JSON в restored_settings.json',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$onlyKey = null;
$raw = file_get_contents('php://input');
$payload = json_decode($raw ?: '{}', true);
if (is_array($payload) && !empty($payload['key'])) {
    $onlyKey = (string)$payload['key'];
}

$restoredKeys = [];
try {
    $stmt = $pdo->prepare('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?');
    foreach ($data as $key => $value) {
        if ($onlyKey !== null && $key !== $onlyKey) {
            continue;
        }
        $jsonStr = is_string($value) ? $value : json_encode($value, JSON_UNESCAPED_UNICODE);
        $stmt->execute([$key, $jsonStr, $jsonStr]);
        $restoredKeys[] = $key;
    }
    echo json_encode([
        'success' => true,
        'message' => 'Восстановлено ключей: ' . count($restoredKeys),
        'restored_keys' => $restoredKeys,
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
}
