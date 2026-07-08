<?php
require 'api/db.php';
$stmt = $pdo->query('SELECT setting_value FROM settings WHERE setting_key = "crzrt_main_page_data"');
$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo strlen($row['setting_value']) . " bytes\n";
echo substr($row['setting_value'], 0, 500);
