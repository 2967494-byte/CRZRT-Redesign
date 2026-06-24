<?php
/**
 * Прокси отправки заявки в CRM-форму Bitrix24 (crm.site.form.fill).
 * form id и sec публичны — они же в loader_XXX.js на старом сайте.
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

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректный JSON'], JSON_UNESCAPED_UNICODE);
    exit;
}

$formId = (int)($payload['formId'] ?? 0);
$sec = preg_replace('/[^a-z0-9]/i', '', (string)($payload['sec'] ?? ''));
$values = $payload['values'] ?? null;

if ($formId <= 0 || $sec === '' || !is_array($values)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите formId, sec и values'], JSON_UNESCAPED_UNICODE);
    exit;
}

$allowedFields = [
    'LEAD_NAME',
    'LEAD_LAST_NAME',
    'LEAD_SECOND_NAME',
    'LEAD_PHONE',
    'LEAD_EMAIL',
    'LEAD_COMPANY_TITLE',
    'LEAD_UF_CRM_1669365821',
    'AGREEMENT_24',
];

$filtered = [];
foreach ($allowedFields as $field) {
    if (!array_key_exists($field, $values)) {
        continue;
    }
    $value = trim((string)$values[$field]);
    if ($value !== '') {
        $filtered[$field] = $value;
    }
}

if (empty($filtered['LEAD_NAME']) || empty($filtered['LEAD_PHONE']) || empty($filtered['LEAD_EMAIL'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Заполните имя, телефон и e-mail'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (empty($filtered['LEAD_UF_CRM_1669365821'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите источник заявки'], JSON_UNESCAPED_UNICODE);
    exit;
}

$filtered['AGREEMENT_24'] = 'Y';

$portal = 'aotsentrrazvitiyazakupokrt.bitrix24.ru';
$url = "https://{$portal}/bitrix/services/main/ajax.php?action=crm.site.form.fill";
$postBody = http_build_query([
    'id' => $formId,
    'sec' => $sec,
    'values' => json_encode($filtered, JSON_UNESCAPED_UNICODE),
]);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $postBody,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
]);

$response = curl_exec($ch);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'error' => 'Не удалось связаться с Bitrix24',
        'details' => $curlError,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$result = json_decode($response, true);
$resultId = (int)($result['result']['resultId'] ?? 0);

if ($resultId > 0) {
    echo json_encode([
        'success' => true,
        'resultId' => $resultId,
        'message' => $result['result']['message'] ?? 'Заявка принята',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(422);
echo json_encode([
    'success' => false,
    'error' => 'Bitrix24 не принял заявку',
    'details' => $result,
], JSON_UNESCAPED_UNICODE);
