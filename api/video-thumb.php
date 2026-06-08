<?php
/**
 * Превью VK Video: парсит страницу VK и отдаёт URL (JSON) или само изображение (?proxy=1).
 */
header('Content-Type: application/json; charset=utf-8');

$url = isset($_GET['url']) ? trim((string)$_GET['url']) : '';
$proxy = isset($_GET['proxy']) && $_GET['proxy'] !== '0' && $_GET['proxy'] !== 'false';

if ($url === '' || !filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректный URL'], JSON_UNESCAPED_UNICODE);
    exit;
}

$video = parseVkVideoUrl($url);
if ($video === null) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Поддерживаются только ссылки VK Video'], JSON_UNESCAPED_UNICODE);
    exit;
}

$cacheDir = dirname(__DIR__) . '/uploads/cache/vk-thumbs';
$cacheKey = preg_replace('/[^a-zA-Z0-9_-]/', '_', $video['owner'] . '_' . $video['id']);
$cacheMetaFile = $cacheDir . '/' . $cacheKey . '.json';
$cacheImageFile = $cacheDir . '/' . $cacheKey . '.jpg';

$thumbnail = '';
$cached = readVkThumbCache($cacheMetaFile, $cacheImageFile);
if ($cached) {
    $thumbnail = $cached['thumbnail'];
}

if ($thumbnail === '') {
    $html = fetchVkVideoHtml($video);
    if ($html === '') {
        http_response_code(502);
        echo json_encode(['success' => false, 'error' => 'Не удалось получить страницу VK'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $thumbnail = extractVkThumbnail($html);
    if ($thumbnail === '') {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Превью не найдено'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    writeVkThumbCache($cacheDir, $cacheMetaFile, $cacheImageFile, $thumbnail);
}

if ($proxy) {
    serveVkThumbnailImage($thumbnail, $cacheImageFile);
    exit;
}

echo json_encode([
    'success' => true,
    'thumbnail' => $thumbnail,
    'proxyUrl' => 'api/video-thumb.php?url=' . rawurlencode($url) . '&proxy=1',
    'provider' => 'vk'
], JSON_UNESCAPED_UNICODE);

function parseVkVideoUrl($url)
{
    $patterns = [
        '#/video(-?\d+)_(\d+)#i',
        '#[?&]z=video(-?\d+)_(\d+)#i',
        '#[?&]vid=(-?\d+)_(\d+)#i',
    ];

    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $url, $matches)) {
            return ['owner' => $matches[1], 'id' => $matches[2]];
        }
    }

    if (preg_match('#[?&]oid=(-?\d+)#i', $url, $ownerMatch) && preg_match('#[?&]id=(\d+)#i', $url, $idMatch)) {
        return ['owner' => $ownerMatch[1], 'id' => $idMatch[1]];
    }

    $host = strtolower((string)parse_url($url, PHP_URL_HOST));
    $isVk = in_array($host, ['vk.com', 'www.vk.com', 'm.vk.com', 'vk.ru', 'www.vk.ru', 'vkvideo.ru', 'www.vkvideo.ru'], true);
    if (!$isVk) {
        return null;
    }

    return null;
}

function fetchVkVideoHtml(array $video)
{
    $owner = $video['owner'];
    $id = $video['id'];
    $urls = [
        'https://vk.com/video' . $owner . '_' . $id,
        'https://vkvideo.ru/video' . $owner . '_' . $id,
        'https://vk.com/video_ext.php?oid=' . rawurlencode($owner) . '&id=' . rawurlencode($id) . '&hd=2',
        'https://m.vk.com/video' . $owner . '_' . $id,
    ];

    foreach ($urls as $fetchUrl) {
        $html = httpGet($fetchUrl);
        if ($html !== '' && extractVkThumbnail($html) !== '') {
            return $html;
        }
    }

    return httpGet($urls[0]);
}

function httpGet($url)
{
    $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 5,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_CONNECTTIMEOUT => 8,
            CURLOPT_USERAGENT => $userAgent,
            CURLOPT_HTTPHEADER => [
                'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language: ru-RU,ru;q=0.9,en;q=0.8',
            ],
            CURLOPT_ENCODING => '',
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $body = curl_exec($ch);
        $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if (is_string($body) && $body !== '' && $status > 0 && $status < 400) {
            return $body;
        }
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 15,
            'header' => "User-Agent: {$userAgent}\r\nAccept-Language: ru-RU,ru;q=0.9\r\n",
        ],
    ]);
    $body = @file_get_contents($url, false, $context);
    return is_string($body) ? $body : '';
}

function httpGetImage($url)
{
    $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 5,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_CONNECTTIMEOUT => 8,
            CURLOPT_USERAGENT => $userAgent,
            CURLOPT_HTTPHEADER => [
                'Accept: image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Language: ru-RU,ru;q=0.9',
                'Referer: https://vk.com/',
            ],
            CURLOPT_ENCODING => '',
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $body = curl_exec($ch);
        $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $type = (string)curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        curl_close($ch);
        if (is_string($body) && $body !== '' && $status > 0 && $status < 400) {
            if ($type === '' || stripos($type, 'image/') !== false || stripos($type, 'octet-stream') !== false) {
                return $body;
            }
        }
    }

    return httpGet($url);
}

function decodeVkJsonString($value)
{
    $value = html_entity_decode((string)$value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $value = stripcslashes($value);
    $value = str_replace('\\/', '/', $value);
    if ($value !== '' && $value[0] !== 'h') {
        $value = 'https:' . ltrim($value, ':');
    }
    return $value;
}

function extractVkThumbnail($html)
{
    $candidates = [];

    $patterns = [
        '/<meta[^>]+property=["\']og:image:secure_url["\'][^>]+content=["\']([^"\']+)["\']/i',
        '/<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image:secure_url["\']/i',
        '/<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']/i',
        '/<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']/i',
        '/"preview"\s*:\s*"((?:\\\\\/|[^"\\\\])+)"/i',
        '/"thumb"\s*:\s*"((?:\\\\\/|[^"\\\\])+)"/i',
        '/"first_frame(?:_\d+)?"\s*:\s*"((?:\\\\\/|[^"\\\\])+)"/i',
        '/"photo_(?:320|640|800|1280)"\s*:\s*"((?:\\\\\/|[^"\\\\])+)"/i',
        '/"url"\s*:\s*"((?:https?:)?(?:\\\\\/)+[^"]*(?:userapi\.com|mycdn\.me|vk\.com\/cdn)[^"]*)"/i',
    ];

    foreach ($patterns as $pattern) {
        if (preg_match_all($pattern, $html, $matches)) {
            foreach ($matches[1] as $raw) {
                $candidate = decodeVkJsonString($raw);
                if (isVkImageUrl($candidate)) {
                    $candidates[] = $candidate;
                }
            }
        }
    }

    if (preg_match_all('#https?://[^\s"\'<>]+(?:userapi\.com|mycdn\.me|vk\.com/cdn)[^\s"\'<>]*#i', $html, $matches)) {
        foreach ($matches[0] as $raw) {
            $candidate = decodeVkJsonString($raw);
            if (isVkImageUrl($candidate)) {
                $candidates[] = $candidate;
            }
        }
    }

    $candidates = array_values(array_unique(array_filter($candidates, 'isVkImageUrl')));
    if (!$candidates) {
        return '';
    }

    usort($candidates, function ($a, $b) {
        return estimateVkImageSize($b) <=> estimateVkImageSize($a);
    });

    return $candidates[0];
}

function isVkImageUrl($url)
{
    if ($url === '' || !preg_match('#^https?://#i', $url)) {
        return false;
    }
    return (bool)preg_match('#(?:userapi\.com|mycdn\.me|vk\.com/cdn)#i', $url);
}

function estimateVkImageSize($url)
{
    if (preg_match('/[?&](?:width|w)=(\d+)/i', $url, $match)) {
        return (int)$match[1];
    }
    if (preg_match('/(\d{3,4})x(\d{3,4})/', $url, $match)) {
        return (int)$match[1] * (int)$match[2];
    }
    if (preg_match('/fn=vid_([a-z])/i', $url, $match)) {
        $sizes = ['s' => 1, 'm' => 2, 'l' => 3, 'x' => 4, 'y' => 5, 'z' => 6, 'w' => 7, 'u' => 8, 'h' => 9];
        return $sizes[strtolower($match[1])] ?? 0;
    }
    return strlen($url);
}

function readVkThumbCache($metaFile, $imageFile)
{
    if (!is_file($metaFile)) {
        return null;
    }
    $meta = json_decode((string)file_get_contents($metaFile), true);
    if (!is_array($meta) || empty($meta['thumbnail']) || empty($meta['expires'])) {
        return null;
    }
    if ((int)$meta['expires'] < time()) {
        return null;
    }
    return ['thumbnail' => (string)$meta['thumbnail'], 'image' => is_file($imageFile) ? $imageFile : ''];
}

function writeVkThumbCache($cacheDir, $metaFile, $imageFile, $thumbnail)
{
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0755, true);
    }
    $meta = [
        'thumbnail' => $thumbnail,
        'expires' => time() + 86400,
    ];
    @file_put_contents($metaFile, json_encode($meta, JSON_UNESCAPED_UNICODE));
    $imageData = httpGetImage($thumbnail);
    if ($imageData !== '') {
        @file_put_contents($imageFile, $imageData);
    }
}

function serveVkThumbnailImage($thumbnail, $cacheImageFile)
{
    if (is_file($cacheImageFile) && filesize($cacheImageFile) > 0) {
        header('Content-Type: image/jpeg');
        header('Cache-Control: public, max-age=86400, stale-while-revalidate=604800');
        readfile($cacheImageFile);
        return;
    }

    $imageData = httpGetImage($thumbnail);
    if ($imageData === '') {
        http_response_code(502);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'error' => 'Не удалось загрузить превью'], JSON_UNESCAPED_UNICODE);
        return;
    }

    if (is_string($cacheImageFile) && dirname($cacheImageFile) && !is_dir(dirname($cacheImageFile))) {
        @mkdir(dirname($cacheImageFile), 0755, true);
    }
    if (is_string($cacheImageFile)) {
        @file_put_contents($cacheImageFile, $imageData);
    }

    header('Content-Type: image/jpeg');
    header('Cache-Control: public, max-age=86400, stale-while-revalidate=604800');
    echo $imageData;
}
