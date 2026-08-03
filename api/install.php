<?php
/**
 * Первичная установка таблиц CMS.
 * Только для авторизованного superadmin.
 * НЕ сбрасывает пароль существующих пользователей.
 */
session_start();
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id']) || (($_SESSION['user_role'] ?? '') !== 'superadmin')) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Несанкционированный доступ',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    $stmt = $pdo->query('SELECT COUNT(*) AS cnt FROM users');
    $count = (int)($stmt->fetch()['cnt'] ?? 0);

    echo json_encode([
        'success' => true,
        'message' => 'Таблицы проверены',
        'users_count' => $count,
    ], JSON_UNESCAPED_UNICODE);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка при создании таблиц',
    ], JSON_UNESCAPED_UNICODE);
}
