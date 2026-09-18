<?php
/**
 * Лёгкая метаданные одного курса для страницы записи.
 * GET ?id=slug-or-course-id
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Метод не поддерживается'], JSON_UNESCAPED_UNICODE);
    exit;
}

$id = trim((string)($_GET['id'] ?? ''));
if ($id === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите id'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    require_once __DIR__ . '/db.php';
    $stmt = $pdo->prepare('SELECT setting_value FROM settings WHERE setting_key = ?');
    $stmt->execute(['crzrt_obuchenie_page_data']);
    $row = $stmt->fetch();
    $pageData = $row ? json_decode($row['setting_value'], true) : null;
    $registry = (is_array($pageData) && isset($pageData['courseRegistry']) && is_array($pageData['courseRegistry']))
        ? $pageData['courseRegistry']
        : [];

    $key = mb_strtolower($id, 'UTF-8');
    $decoded = $key;
    try {
        $decoded = mb_strtolower(rawurldecode($id), 'UTF-8');
    } catch (Throwable $e) {
    }

    $matched = null;
    foreach ($registry as $item) {
        if (!is_array($item)) {
            continue;
        }
        $itemId = mb_strtolower(trim((string)($item['id'] ?? '')), 'UTF-8');
        $slug = mb_strtolower(trim((string)($item['slug'] ?? '')), 'UTF-8');
        if ($itemId === $key || $itemId === $decoded || ($slug !== '' && ($slug === $key || $slug === $decoded))) {
            $matched = $item;
            break;
        }
    }

    if (!$matched) {
        echo json_encode([
            'success' => true,
            'found' => false,
            'enrollClosed' => true,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    require_once __DIR__ . '/course-enroll-helpers.php';
    $enrollUntil = trim((string)($matched['enrollUntil'] ?? ''));
    $active = !isset($matched['active']) || $matched['active'] !== false;

    echo json_encode([
        'success' => true,
        'found' => true,
        'course' => [
            'id' => $matched['id'] ?? '',
            'slug' => $matched['slug'] ?? '',
            'title' => $matched['title'] ?? '',
            'btnText' => $matched['btnText'] ?? '',
            'eventType' => (($matched['eventType'] ?? '') === 'event') ? 'event' : 'course',
            'format' => (($matched['format'] ?? '') === 'dist') ? 'dist' : 'och',
            'dateFrom' => $matched['dateFrom'] ?? '',
            'dateTo' => $matched['dateTo'] ?? '',
            'durationDays' => (int)($matched['durationDays'] ?? 1),
            'enrollUntil' => $enrollUntil,
            'price' => $matched['price'] ?? '',
            'bitrixCourseElementId' => isset($matched['bitrixCourseElementId']) ? (int)$matched['bitrixCourseElementId'] : null,
            'forCustomers' => !empty($matched['forCustomers']),
            'forSuppliers' => !empty($matched['forSuppliers']),
            'forIndividuals' => !isset($matched['forIndividuals']) || $matched['forIndividuals'] !== false,
            'forLegalEntities' => !isset($matched['forLegalEntities']) || $matched['forLegalEntities'] !== false,
            'is44fz' => !empty($matched['is44fz']),
            'is223fz' => !empty($matched['is223fz']),
            'requireDistrict' => !empty($matched['requireDistrict']),
            'options' => is_array($matched['options'] ?? null) ? $matched['options'] : [],
            'active' => $active,
            'enrollOpen' => $active && crzrt_is_enroll_open($enrollUntil),
        ],
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    error_log('course-enroll-meta: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Ошибка сервера'], JSON_UNESCAPED_UNICODE);
}
