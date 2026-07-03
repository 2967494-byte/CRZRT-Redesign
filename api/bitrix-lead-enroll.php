<?php
/**
 * Заявка на курс → лид в Bitrix24 (crm.lead.add через webhook).
 */
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Метод не поддерживается'], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/bitrix-lead-lib.php';

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректный JSON'], JSON_UNESCAPED_UNICODE);
    exit;
}

$name = trim((string)($payload['name'] ?? ''));
$phone = trim((string)($payload['phone'] ?? ''));
$email = trim((string)($payload['email'] ?? ''));
$company = trim((string)($payload['company'] ?? ''));
$courseTitle = trim((string)($payload['courseTitle'] ?? ''));
$sourceId = trim((string)($payload['source'] ?? ''));

if ($name === '' || $phone === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите имя и телефон'], JSON_UNESCAPED_UNICODE);
    exit;
}

$commentParts = ['Заявка на обучение с сайта zakupki.tatar'];
if ($company !== '') {
    $commentParts[] = 'Компания: ' . $company;
}

$fields = bitrix_build_enroll_lead_fields([
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'company' => $company,
    'courseTitle' => $courseTitle,
    'sourceId' => $sourceId,
    'audienceType' => ($payload['audienceType'] ?? '') === 'legal' ? 'legal' : 'individual',
    'dateFrom' => $payload['dateFrom'] ?? '',
    'dateTo' => $payload['dateTo'] ?? '',
    'durationDays' => (int)($payload['durationDays'] ?? 1),
    'format' => ($payload['format'] ?? '') === 'dist' ? 'dist' : 'och',
    'price' => $payload['price'] ?? '',
    'courseElementId' => (int)($payload['bitrixCourseElementId'] ?? 0),
    'forCustomers' => !empty($payload['forCustomers']),
    'forSuppliers' => !empty($payload['forSuppliers']),
    'is44fz' => !empty($payload['is44fz']),
    'is223fz' => !empty($payload['is223fz']),
    'options' => is_array($payload['options'] ?? null) ? $payload['options'] : [],
    'comments' => implode("\n", $commentParts),
]);

$result = bitrix_lead_add($fields);
if (!$result['success']) {
    http_response_code(422);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'success' => true,
    'leadId' => $result['leadId'],
    'message' => 'Заявка принята',
], JSON_UNESCAPED_UNICODE);
