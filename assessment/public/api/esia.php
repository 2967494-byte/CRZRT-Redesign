<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Config;
use Asmt\Http;

Config::load();
$enabled = strtolower((string)(Config::get('ASMT_ESIA_ENABLED', '0') ?? '0'));
$enabled = in_array($enabled, ['1', 'true', 'yes', 'on'], true);

if (!$enabled) {
    Http::json([
        'success' => false,
        'enabled' => false,
        'error' => 'Вход через Госуслуги (ЕСИА) будет доступен после выдачи ключей Заказчиком. Используйте регистрацию по email.',
        'status' => 'deferred',
    ], 503);
}

// Scaffold for future OAuth/ESIA integration (keys not yet provided).
$action = $_GET['action'] ?? 'start';
if ($action === 'start') {
    Http::json([
        'success' => false,
        'enabled' => true,
        'error' => 'ЕСИА включена в конфиге, но OAuth-эндпоинты ещё не настроены (client_id / redirect_uri).',
    ], 501);
}

if ($action === 'callback') {
    Http::json([
        'success' => false,
        'error' => 'Callback ЕСИА не реализован до выдачи доступов.',
    ], 501);
}

Http::json(['success' => false, 'error' => 'Неизвестное действие'], 400);
