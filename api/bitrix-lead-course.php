<?php
/**
 * Новый курс в админке → элемент каталога + лид-мероприятие в Bitrix24.
 */
session_start();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Метод не поддерживается'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Несанкционированный доступ'], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/bitrix-lead-lib.php';

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректный JSON'], JSON_UNESCAPED_UNICODE);
    exit;
}

$title = trim((string)($payload['title'] ?? ''));
$dateFrom = trim((string)($payload['dateFrom'] ?? ''));

if ($title === '' || $dateFrom === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите название и дату начала курса'], JSON_UNESCAPED_UNICODE);
    exit;
}

$format = ($payload['format'] ?? '') === 'dist' ? 'dist' : 'och';
$formatLabel = $format === 'dist' ? 'Дистанционно' : 'Очно';
$price = trim((string)($payload['price'] ?? ''));
$courseLabel = bitrix_format_course_application_label([
    'title' => $title,
    'dateFrom' => $dateFrom,
    'dateTo' => $payload['dateTo'] ?? '',
    'durationDays' => (int)($payload['durationDays'] ?? 1),
    'format' => $format,
]);

$catalogElementId = (int)($payload['bitrixCourseElementId'] ?? 0);
$catalogWarning = null;

if ($catalogElementId <= 0) {
    $catalogResult = bitrix_catalog_add_course_element($courseLabel !== '' ? $courseLabel : $title);
    if ($catalogResult['success']) {
        $catalogElementId = (int)$catalogResult['elementId'];
    } else {
        $catalogWarning = (string)($catalogResult['error'] ?? 'Не удалось добавить курс в каталог Bitrix24');
    }
}

$commentParts = ['Курс создан в админке сайта zakupki.tatar', 'Формат: ' . $formatLabel];
if ($price !== '') {
    $commentParts[] = 'Стоимость: ' . $price;
}
if ($catalogElementId > 0) {
    $commentParts[] = 'Каталог курсов Bitrix24: #' . $catalogElementId;
}

$fields = bitrix_build_event_lead_fields([
    'title' => 'Мероприятие: ' . $title,
    'eventTitle' => $title,
    'dateFrom' => $dateFrom,
    'dateTo' => $payload['dateTo'] ?? '',
    'durationDays' => (int)($payload['durationDays'] ?? 1),
    'price' => $price,
    'catalogElementId' => $catalogElementId,
    'courseLabel' => $courseLabel,
    'comments' => implode("\n", $commentParts),
]);

$result = bitrix_lead_add($fields);
if (!$result['success']) {
    http_response_code(422);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    exit;
}

$response = [
    'success' => true,
    'leadId' => $result['leadId'],
    'message' => 'Лид в Bitrix24 создан',
];

if ($catalogElementId > 0) {
    $response['catalogElementId'] = $catalogElementId;
    $response['message'] = 'Курс добавлен в Bitrix24 (каталог и лид)';
}

if ($catalogWarning !== null) {
    $response['catalogWarning'] = $catalogWarning;
    $response['message'] = 'Лид в Bitrix24 создан, каталог не обновлён';
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
