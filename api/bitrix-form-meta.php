<?php
/**
 * Метаданные CRM-формы Bitrix24 из loader_{id}.js (поля, источники, капча).
 */
header('Content-Type: application/json; charset=utf-8');

$formId = (int)($_GET['id'] ?? 0);
if ($formId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите id формы'], JSON_UNESCAPED_UNICODE);
    exit;
}

$loaderUrl = "https://cdn-ru.bitrix24.ru/b12905608/crm/form/loader_{$formId}.js";

$ch = curl_init($loaderUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_FOLLOWLOCATION => true,
]);
$text = curl_exec($ch);
$curlError = curl_error($ch);
curl_close($ch);

if ($text === false || $text === '') {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'error' => 'Не удалось загрузить описание формы из Bitrix24',
        'details' => $curlError,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function bitrix_pick_field_name(string $text, string $type): ?string
{
    if (!preg_match('/"type":"' . preg_quote($type, '/') . '"[^}]*"name":"([^"]+)"/', $text, $match)) {
        return null;
    }
    return $match[1];
}

$fieldMap = [
    'name' => bitrix_pick_field_name($text, 'name'),
    'phone' => bitrix_pick_field_name($text, 'phone'),
    'email' => bitrix_pick_field_name($text, 'email'),
    'company' => null,
    'source' => null,
    'agreement' => 'AGREEMENT_24',
];

if (preg_match('/"type":"list"[^}]*"label":"[^"]*Откуда узнали[^"]*"[^}]*"name":"([^"]+)"/u', $text, $sourceMatch)) {
    $fieldMap['source'] = $sourceMatch[1];
}

$sourceOptions = [];
if (preg_match('/"label":"[^"]*Откуда узнали[^"]*"[^}]*"items":\[([^\]]+)\]/u', $text, $itemsChunk)) {
    preg_match_all('/"label":"((?:[^"\\\\]|\\\\.)*)","value":"([^"]+)"/u', $itemsChunk[1], $optionMatches, PREG_SET_ORDER);
    foreach ($optionMatches as $option) {
        $sourceOptions[] = [
            'label' => stripcslashes($option[1]),
            'value' => $option[2],
        ];
    }
}

$emailRequired = false;
if ($fieldMap['email'] && preg_match(
    '/"name":"' . preg_quote($fieldMap['email'], '/') . '"[^}]*"required":true/',
    $text
)) {
    $emailRequired = true;
}

$captchaEnabled = strpos($text, '"recaptcha":{"use":true}') !== false
    || strpos($text, '"yandexCaptcha":{"use":true}') !== false;

$title = null;
if (preg_match('/"title":"((?:[^"\\\\]|\\\\.)*)"/u', $text, $titleMatch)) {
    $title = stripcslashes($titleMatch[1]);
}

echo json_encode([
    'success' => true,
    'formId' => $formId,
    'title' => $title,
    'fieldMap' => $fieldMap,
    'sourceOptions' => $sourceOptions,
    'emailRequired' => $emailRequired,
    'captchaEnabled' => $captchaEnabled,
], JSON_UNESCAPED_UNICODE);
