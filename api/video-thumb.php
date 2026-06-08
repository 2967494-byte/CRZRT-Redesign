<?php
header('Content-Type: application/json; charset=utf-8');

$url = isset($_GET['url']) ? trim((string)$_GET['url']) : '';
if ($url === '' || !filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректный URL'], JSON_UNESCAPED_UNICODE);
    exit;
}

$host = parse_url($url, PHP_URL_HOST);
$host = strtolower((string)$host);
$isVk = $host === 'vk.com'
    || $host === 'www.vk.com'
    || $host === 'm.vk.com'
    || $host === 'vkvideo.ru'
    || $host === 'www.vkvideo.ru';

if (!$isVk || !preg_match('#/video(-?\d+)_(\d+)#i', $url, $matches)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Поддерживаются только ссылки VK Video'], JSON_UNESCAPED_UNICODE);
    exit;
}

$fetchUrl = 'https://vk.com/video' . $matches[1] . '_' . $matches[2];
$userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

$html = false;
if (function_exists('curl_init')) {
    $ch = curl_init($fetchUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 12,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_USERAGENT => $userAgent,
        CURLOPT_HTTPHEADER => ['Accept-Language: ru-RU,ru;q=0.9,en;q=0.8'],
    ]);
    $html = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($html === false || $status >= 400) {
        $html = false;
    }
}

if ($html === false) {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 12,
            'header' => "User-Agent: {$userAgent}\r\nAccept-Language: ru-RU,ru;q=0.9\r\n",
        ],
    ]);
    $html = @file_get_contents($fetchUrl, false, $context);
}

if (!is_string($html) || $html === '') {
    http_response_code(502);
    echo json_encode(['success' => false, 'error' => 'Не удалось получить страницу VK'], JSON_UNESCAPED_UNICODE);
    exit;
}

$thumbnail = '';
$patterns = [
    '/<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']/i',
    '/<meta\s+content=["\']([^"\']+)["\']\s+property=["\']og:image["\']/i',
    '/"preview":"([^"]+)"/i',
    '/"image":"([^"]+userapi\.com[^"]+)"/i',
];

foreach ($patterns as $pattern) {
    if (preg_match($pattern, $html, $thumbMatch)) {
        $thumbnail = html_entity_decode($thumbMatch[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $thumbnail = str_replace('\\/', '/', $thumbnail);
        break;
    }
}

if ($thumbnail === '') {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Превью не найдено'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'success' => true,
    'thumbnail' => $thumbnail,
    'provider' => 'vk'
], JSON_UNESCAPED_UNICODE);
