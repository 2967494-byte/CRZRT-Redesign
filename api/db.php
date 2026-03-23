<?php
// Файл: api/db.php

$host = 'localhost'; // В ISPmanager обычно используется localhost
$db   = 'u998823_crzrt_db';
$user = 'u998823_crzrt_user';
$pass = 'qpx-hNb-5yJ-sbi';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    exit;
}
?>
