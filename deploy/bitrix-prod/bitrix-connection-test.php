<?php
/**
 * Проверка webhook Bitrix24 после деплоя. Только для авторизованных в CMS.
 *
 * GET                          — конфиг (webhook замаскирован), без вызовов API
 * GET ?run=1                   — crm.lead.fields + lists.field.get (без создания сущностей)
 * GET ?run=1&catalog=1         — то же + тестовый элемент в каталоге курсов (удалить вручную в Bitrix)
 */
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Войдите в админку сайта'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

require_once __DIR__ . '/bitrix-lead-lib.php';

function bitrix_test_mask_url(?string $url): string
{
    $url = trim((string)$url);
    if ($url === '') {
        return '(не задан)';
    }
    if (preg_match('#^(https://[^/]+/rest/\d+/)([^/]+)(/.*)$#', $url, $m)) {
        return $m[1] . str_repeat('*', min(strlen($m[2]), 12)) . $m[3];
    }
    return '(скрыт)';
}

$run = isset($_GET['run']) && $_GET['run'] === '1';
$addCatalogTest = isset($_GET['catalog']) && $_GET['catalog'] === '1';

$config = bitrix_load_config();
$webhook = trim((string)($config['webhook_lead_add'] ?? ''));
$catalog = bitrix_catalog_config();

$report = [
    'success' => true,
    'config' => [
        'config_file' => is_file(__DIR__ . '/bitrix-config.local.php') ? 'найден' : 'не найден',
        'webhook_set' => $webhook !== '',
        'webhook_masked' => bitrix_test_mask_url($webhook),
        'crm_lead_add' => bitrix_test_mask_url(bitrix_webhook_url_for_method('crm.lead.add')),
        'lists_element_add' => bitrix_test_mask_url(bitrix_webhook_url_for_method('lists.element.add')),
        'course_catalog_iblock_id' => $catalog['iblock_id'],
        'course_catalog_iblock_type' => $catalog['iblock_type_id'],
    ],
    'tests' => [],
];

if ($webhook === '') {
    $report['success'] = false;
    $report['error'] = 'Создайте api/bitrix-config.local.php на сервере (см. bitrix-config.example.php)';
    echo json_encode($report, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if (!$run) {
    $report['hint'] = 'Добавьте ?run=1 для проверки API. ?run=1&catalog=1 — создать тестовый элемент каталога в Bitrix24.';
    echo json_encode($report, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$crmFields = bitrix_rest_call('crm.lead.fields', []);
$report['tests']['crm_lead_fields'] = [
    'ok' => $crmFields['success'],
    'message' => $crmFields['success']
        ? 'CRM webhook: чтение полей лидов OK'
        : (string)($crmFields['error'] ?? 'ошибка'),
    'details' => $crmFields['success'] ? null : ($crmFields['details'] ?? null),
];

$listsRead = bitrix_rest_call('lists.field.get', [
    'IBLOCK_TYPE_ID' => $catalog['iblock_type_id'],
    'IBLOCK_ID' => $catalog['iblock_id'],
]);
$listsReadDenied = !$listsRead['success']
    && (($listsRead['details']['error'] ?? '') === 'ACCESS_DENIED'
        || stripos((string)($listsRead['error'] ?? ''), 'extended plans') !== false);
$report['tests']['lists_field_get'] = [
    'ok' => $listsRead['success'],
    'optional' => $listsReadDenied,
    'message' => $listsRead['success']
        ? 'Lists: чтение каталога #' . $catalog['iblock_id'] . ' OK'
        : ($listsReadDenied
            ? 'Lists: чтение недоступно на тарифе (не критично) — проверьте ?catalog=1'
            : (string)($listsRead['error'] ?? 'ошибка')),
    'details' => $listsRead['success'] ? null : ($listsRead['details'] ?? null),
];

if ($addCatalogTest) {
    $label = 'ТЕСТ zakupki.tatar ' . date('d.m.Y H:i') . ' — удалить';
    $catalogAdd = bitrix_catalog_add_course_element($label);
    $report['tests']['lists_element_add'] = [
        'ok' => $catalogAdd['success'],
        'message' => $catalogAdd['success']
            ? 'Элемент каталога #' . $catalogAdd['elementId'] . ' создан — удалите вручную в Bitrix24'
            : (string)($catalogAdd['error'] ?? 'ошибка'),
        'elementId' => $catalogAdd['elementId'] ?? null,
        'label' => $label,
        'details' => $catalogAdd['success'] ? null : ($catalogAdd['details'] ?? null),
    ];
}

foreach ($report['tests'] as $test) {
    if (empty($test['ok']) && empty($test['optional'])) {
        $report['success'] = false;
        break;
    }
}

echo json_encode($report, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
