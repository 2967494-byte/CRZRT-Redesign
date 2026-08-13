<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Db;
use Asmt\Http;

$rows = Db::pdo()->query(
    'SELECT id, name, is_separate_city FROM asmt_districts WHERE is_active = TRUE ORDER BY sort_order, name'
)->fetchAll();

Http::json([
    'success' => true,
    'districts' => array_map(static function ($r) {
        return [
            'id' => (int)$r['id'],
            'name' => $r['name'],
            'isSeparateCity' => (bool)$r['is_separate_city'],
        ];
    }, $rows),
]);
