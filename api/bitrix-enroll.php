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
$required = $payload['required'] ?? null;

if ($formId <= 0 || $sec === '' || !is_array($values)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите formId, sec и values'], JSON_UNESCAPED_UNICODE);
    exit;
}

$filtered = [];
foreach ($values as $field => $value) {
    $field = (string)$field;
    if (!preg_match('/^[A-Z][A-Z0-9_]+$/', $field)) {
        continue;
    }
    $value = trim((string)$value);
    if ($value !== '') {
        $filtered[$field] = $value;
    }
}

$requiredFields = is_array($required) ? $required : [];
if (!$requiredFields) {
    $requiredFields = [];
    foreach (['LEAD_NAME', 'CONTACT_NAME'] as $nameField) {
        if (array_key_exists($nameField, $values)) {
            $requiredFields[] = $nameField;
            break;
        }
    }
    foreach (['LEAD_PHONE', 'CONTACT_PHONE'] as $phoneField) {
        if (array_key_exists($phoneField, $values)) {
            $requiredFields[] = $phoneField;
            break;
        }
    }
    foreach (['LEAD_EMAIL', 'CONTACT_EMAIL'] as $emailField) {
        if (array_key_exists($emailField, $values)) {
            $requiredFields[] = $emailField;
            break;
        }
    }
    foreach (['LEAD_UF_CRM_1669365821', 'DEAL_UF_CRM_1668275563824'] as $sourceField) {
        if (array_key_exists($sourceField, $values)) {
            $requiredFields[] = $sourceField;
            break;
        }
    }
}

foreach ($requiredFields as $field) {
    if (empty($filtered[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Заполните все обязательные поля формы'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

if (array_key_exists('AGREEMENT_24', $values)) {
    $filtered['AGREEMENT_24'] = 'Y';
}

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
$bitrixMessage = trim((string)($result['result']['message'] ?? $result['error_description'] ?? ''));

if ($resultId > 0) {
    echo json_encode([
        'success' => true,
        'resultId' => $resultId,
        'message' => $bitrixMessage ?: 'Заявка принята',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$errorMessage = 'Bitrix24 не принял заявку';
if ($bitrixMessage !== '') {
    $errorMessage = $bitrixMessage;
} elseif (!empty($result['error_description'])) {
    $errorMessage = (string)$result['error_description'];
}

http_response_code(422);
echo json_encode([
    'success' => false,
    'error' => $errorMessage,
    'details' => $result,
    'formId' => $formId,
    'sec' => $sec,
], JSON_UNESCAPED_UNICODE);
