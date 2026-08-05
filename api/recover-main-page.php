<?php
/**
 * Восстановление ТОЛЬКО главной страницы (crzrt_main_page_data)
 * из restored_settings.json — баннеры, партнёры, отзывы, промо и т.д.
 *
 * Не трогает курсы и другие ключи.
 *
 * GET  — dry-run (что будет восстановлено)
 * POST {"apply":true} — записать в БД
 * POST {"apply":true,"fields":["heroSlides","partners","reviews","promoBanner"]}
 *      — восстановить только указанные поля, остальное оставить как сейчас
 */
session_start();
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Несанкционированный доступ'], JSON_UNESCAPED_UNICODE);
    exit;
}

$payload = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw ?: '{}', true);
    if (is_array($decoded)) {
        $payload = $decoded;
    }
}

$apply = !empty($payload['apply']) && $_SERVER['REQUEST_METHOD'] === 'POST';
$defaultFields = ['heroSlides', 'partners', 'reviews', 'promoBanner', 'logo', 'serviceCards', 'socialLinks', 'consultation'];
$fields = $defaultFields;
if (!empty($payload['fields']) && is_array($payload['fields'])) {
    $fields = array_values(array_filter(array_map('strval', $payload['fields'])));
}
if (isset($_GET['fields']) && is_string($_GET['fields']) && $_GET['fields'] !== '') {
    $fields = array_values(array_filter(array_map('trim', explode(',', $_GET['fields']))));
}

$candidates = [
    __DIR__ . '/backups/main_page.json',
    __DIR__ . '/../restored_settings.json',
    __DIR__ . '/../assets/js/restored_landing.json',
];
$jsonFile = null;
$backupMain = null;
$backupSource = null;
foreach ($candidates as $candidate) {
    if (!is_file($candidate)) {
        continue;
    }
    $decoded = json_decode((string)file_get_contents($candidate), true);
    if (!is_array($decoded)) {
        continue;
    }
    if (!empty($decoded['crzrt_main_page_data']) && is_array($decoded['crzrt_main_page_data'])) {
        $backupMain = $decoded['crzrt_main_page_data'];
        $jsonFile = $candidate;
        $backupSource = basename($candidate) . ' → crzrt_main_page_data';
        break;
    }
    // restored_landing.json — сам объект главной страницы
    if (!empty($decoded['heroSlides']) || !empty($decoded['partners']) || !empty($decoded['reviews'])) {
        $backupMain = $decoded;
        $jsonFile = $candidate;
        $backupSource = basename($candidate);
        break;
    }
}
if (!$backupMain) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error' => 'Не найден бэкап: положите restored_settings.json в корень или assets/js/restored_landing.json',
        'looked_for' => array_map('basename', $candidates),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
$STORAGE_KEY = 'crzrt_main_page_data';

$stmt = $pdo->prepare('SELECT setting_value FROM settings WHERE setting_key = ?');
$stmt->execute([$STORAGE_KEY]);
$row = $stmt->fetch();
$current = $row ? json_decode($row['setting_value'], true) : null;
if (!is_array($current)) {
    $current = [];
}

function summarize_main(array $data): array {
    $promo = is_array($data['promoBanner'] ?? null) ? $data['promoBanner'] : [];
    return [
        'logo' => $data['logo'] ?? '',
        'heroSlides' => is_array($data['heroSlides'] ?? null) ? count($data['heroSlides']) : 0,
        'partners' => is_array($data['partners'] ?? null) ? count($data['partners']) : 0,
        'reviews' => is_array($data['reviews'] ?? null) ? count($data['reviews']) : 0,
        'socialLinks' => is_array($data['socialLinks'] ?? null) ? count($data['socialLinks']) : 0,
        'serviceCards' => is_array($data['serviceCards'] ?? null) ? count($data['serviceCards']) : 0,
        'promoTitle' => is_string($promo['title'] ?? null) ? mb_substr($promo['title'], 0, 80) : '',
        'promoImage' => $promo['image'] ?? '',
    ];
}

$merged = $current;
$restoredFields = [];
foreach ($fields as $field) {
    if (!array_key_exists($field, $backupMain)) {
        continue;
    }
    $merged[$field] = $backupMain[$field];
    $restoredFields[] = $field;
}

if (!$apply) {
    echo json_encode([
        'success' => true,
        'dry_run' => true,
        'source' => $backupSource,
        'fields' => $restoredFields,
        'current' => summarize_main($current),
        'backup' => summarize_main($backupMain),
        'after' => summarize_main($merged),
        'hint' => 'Применить из admin.html: fetch("/api/recover-main-page.php",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({apply:true,fields:["heroSlides","partners","reviews","promoBanner","logo","serviceCards","socialLinks","consultation"]})}).then(r=>r.json()).then(console.log)',
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$jsonStr = json_encode($merged, JSON_UNESCAPED_UNICODE);
$upsert = $pdo->prepare('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?');
$upsert->execute([$STORAGE_KEY, $jsonStr, $jsonStr]);

echo json_encode([
    'success' => true,
    'dry_run' => false,
    'source' => $backupSource,
    'fields' => $restoredFields,
    'before' => summarize_main($current),
    'after' => summarize_main($merged),
    'message' => 'Главная страница восстановлена. Сделайте Ctrl+F5 и очистите localStorage ключ crzrt_main_page_data.',
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
