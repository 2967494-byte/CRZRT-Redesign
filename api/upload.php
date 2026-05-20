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

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

$dataUrl = $data['dataUrl'] ?? '';
$slot = preg_replace('/[^a-z0-9_-]+/i', '_', (string)($data['slot'] ?? 'image'));
$maxWidth = (int)($data['maxWidth'] ?? 1920);
$maxHeight = (int)($data['maxHeight'] ?? 1080);
$targetMaxBytes = 300 * 1024;

if (!is_string($dataUrl) || strpos($dataUrl, 'data:image/') !== 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректный data URL']);
    exit;
}

if (!preg_match('/^data:image\/[a-zA-Z0-9.+-]+;base64,/', $dataUrl)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Поддерживается только base64 image']);
    exit;
}

$base64 = substr($dataUrl, strpos($dataUrl, ',') + 1);
$binary = base64_decode($base64, true);
if ($binary === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Не удалось декодировать изображение']);
    exit;
}

if (!function_exists('imagecreatefromstring') || !function_exists('imagewebp')) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'GD/WebP недоступны на сервере']);
    exit;
}

$src = @imagecreatefromstring($binary);
if (!$src) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Файл не является валидным изображением']);
    exit;
}

$srcW = imagesx($src);
$srcH = imagesy($src);
if ($srcW <= 0 || $srcH <= 0) {
    imagedestroy($src);
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректные размеры изображения']);
    exit;
}

$maxWidth = max(1, min($maxWidth, 3840));
$maxHeight = max(1, min($maxHeight, 3840));

$ratio = min($maxWidth / $srcW, $maxHeight / $srcH, 1.0);
$dstW = max(1, (int)round($srcW * $ratio));
$dstH = max(1, (int)round($srcH * $ratio));

$work = imagecreatetruecolor($dstW, $dstH);
imagealphablending($work, false);
imagesavealpha($work, true);
$transparent = imagecolorallocatealpha($work, 0, 0, 0, 127);
imagefilledrectangle($work, 0, 0, $dstW, $dstH, $transparent);
imagecopyresampled($work, $src, 0, 0, 0, 0, $dstW, $dstH, $srcW, $srcH);
imagedestroy($src);

$uploadDir = dirname(__DIR__) . '/uploads/landing';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0775, true) && !is_dir($uploadDir)) {
    imagedestroy($work);
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Не удалось создать директорию uploads']);
    exit;
}

$quality = 82;
$tries = 0;
$savedPath = null;
$filename = '';
$publicUrl = '';
$currentW = $dstW;
$currentH = $dstH;

while ($tries < 10) {
    $tries++;
    $filename = sprintf('%s_%s_%s.webp', $slot, date('YmdHis'), bin2hex(random_bytes(3)));
    $savedPath = $uploadDir . '/' . $filename;

    if (!imagewebp($work, $savedPath, $quality)) {
        imagedestroy($work);
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Ошибка сохранения WebP']);
        exit;
    }

    clearstatcache(true, $savedPath);
    $size = @filesize($savedPath);
    if ($size !== false && $size <= $targetMaxBytes) {
        $publicUrl = 'uploads/landing/' . $filename;
        break;
    }

    @unlink($savedPath);
    if ($quality > 52) {
        $quality = max(52, $quality - 8);
        continue;
    }

    $nextW = max(1, (int)round($currentW * 0.88));
    $nextH = max(1, (int)round($currentH * 0.88));
    if ($nextW === $currentW && $nextH === $currentH) {
        break;
    }
    $next = imagecreatetruecolor($nextW, $nextH);
    imagealphablending($next, false);
    imagesavealpha($next, true);
    $fill = imagecolorallocatealpha($next, 0, 0, 0, 127);
    imagefilledrectangle($next, 0, 0, $nextW, $nextH, $fill);
    imagecopyresampled($next, $work, 0, 0, 0, 0, $nextW, $nextH, $currentW, $currentH);
    imagedestroy($work);
    $work = $next;
    $currentW = $nextW;
    $currentH = $nextH;
}

imagedestroy($work);

if (!$publicUrl) {
    http_response_code(413);
    echo json_encode(['success' => false, 'error' => 'Не удалось ужать изображение до 300 КБ']);
    exit;
}

echo json_encode([
    'success' => true,
    'url' => $publicUrl,
    'size' => filesize($uploadDir . '/' . basename($publicUrl)),
    'width' => $currentW,
    'height' => $currentH
], JSON_UNESCAPED_UNICODE);

