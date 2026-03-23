<?php
require_once 'db.php';

try {
    $pdo->exec("ALTER TABLE settings MODIFY setting_value LONGTEXT");
    echo "✅ База данных успешно обновлена (LONGTEXT установлен). Теперь можно загружать большие фото!";
} catch (\PDOException $e) {
    if (strpos($e->getMessage(), 'Table') !== false) {
        echo "❌ Ошибка: Таблица еще не создана.";
    } else {
        echo "❌ Ошибка БД: " . $e->getMessage();
    }
}
?>
