<?php
session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Несанкционированный доступ']);
    exit;
}

$allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar', 'rtf', 'txt', 'odt', 'ods'];
$maxBytes = 20 * 1024 * 1024;

if (!isset($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Файл не передан']);
    exit;
}

$file = $_FILES['file'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Ошибка загрузки файла']);
    exit;
}

if ($file['size'] > $maxBytes) {
    http_response_code(413);
    echo json_encode(['success' => false, 'error' => 'Файл больше 20 МБ']);
    exit;
}

$originalName = basename((string)$file['name']);
$extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
if (!in_array($extension, $allowedExtensions, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Недопустимый тип файла']);
    exit;
}

$slot = preg_replace('/[^a-z0-9_-]+/i', '_', (string)($_POST['slot'] ?? 'document'));
$uploadDir = dirname(__DIR__) . '/uploads/files';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0775, true) && !is_dir($uploadDir)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Не удалось создать директорию uploads/files']);
    exit;
}

$safeBase = preg_replace('/[^a-zA-Z0-9._-]+/u', '_', pathinfo($originalName, PATHINFO_FILENAME));
$safeBase = trim($safeBase, '._');
if ($safeBase === '') {
    $safeBase = 'document';
}

$filename = sprintf('%s_%s_%s.%s', $slot, date('YmdHis'), bin2hex(random_bytes(3)), $extension);
$targetPath = $uploadDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Не удалось сохранить файл']);
    exit;
}

echo json_encode([
    'success' => true,
    'url' => 'uploads/files/' . $filename,
    'name' => $originalName,
    'size' => filesize($targetPath)
], JSON_UNESCAPED_UNICODE);
