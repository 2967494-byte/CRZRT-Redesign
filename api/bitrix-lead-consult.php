<?php
/**
 * Форма «Получить консультацию» → лид в Bitrix24 (crm.lead.add через webhook).
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
$interest = trim((string)($payload['interest'] ?? ''));

if ($name === '' || $phone === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите имя и телефон'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($interest === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Выберите направление в поле «Мне интересно»'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (empty($payload['agreePolicy'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Необходимо согласие на обработку персональных данных'], JSON_UNESCAPED_UNICODE);
    exit;
}

$fields = bitrix_build_consult_lead_fields([
    'name' => $name,
    'lastName' => trim((string)($payload['lastName'] ?? '')),
    'phone' => $phone,
    'email' => trim((string)($payload['email'] ?? '')),
    'interest' => $interest,
    'pageUrl' => trim((string)($payload['pageUrl'] ?? '')),
    'pageLabel' => trim((string)($payload['pageLabel'] ?? '')),
    'agreePolicy' => !empty($payload['agreePolicy']),
    'agreeNews' => !empty($payload['agreeNews']),
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
