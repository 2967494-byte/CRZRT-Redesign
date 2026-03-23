<?php
// Файл: api/install.php

require_once 'db.php';

try {
    // 1. Таблица пользователей (администраторов)
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // 2. Таблица настроек
    $pdo->exec("CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    // Создаем первого админа (если база пустая)
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    if ($stmt->fetchColumn() == 0) {
        // Пароль по умолчанию: crzrt_2026 
        // (Обязательно поменяем его потом из админки!)
        $hash = password_hash('crzrt_2026', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)");
        $stmt->execute(['Главный Админ', 'admin@crzrt.ru', $hash, 'superadmin']);
        echo "✅ База данных успешно инициализирована! Создан пользователь admin@crzrt.ru с паролем crzrt_2026.";
    } else {
        echo "✅ Таблицы уже существуют. Админ уже создан.";
    }

} catch (\PDOException $e) {
    echo "❌ Ошибка при создании таблиц: " . $e->getMessage();
}
?>
