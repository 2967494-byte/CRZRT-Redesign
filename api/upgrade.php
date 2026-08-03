<?php
/**
 * Миграции схемы БД. Только для авторизованного пользователя CMS.
 */
session_start();
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Несанкционированный доступ',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $pdo->exec('ALTER TABLE settings MODIFY setting_value LONGTEXT');
    echo json_encode([
        'success' => true,
        'message' => 'База данных обновлена (LONGTEXT)',
    ], JSON_UNESCAPED_UNICODE);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка БД',
    ], JSON_UNESCAPED_UNICODE);
}
