<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Db;
use Asmt\Http;

$pdo = Db::pdo();

$regionId = !empty($_GET['region_id']) ? (int)$_GET['region_id'] : (!empty($_GET['regionId']) ? (int)$_GET['regionId'] : 0);
$regionCode = trim((string)($_GET['region_code'] ?? $_GET['regionCode'] ?? ''));

if ($regionId <= 0 && $regionCode !== '') {
    $stmt = $pdo->prepare('SELECT id FROM asmt_regions WHERE code = ? LIMIT 1');
    $stmt->execute([$regionCode]);
    $val = $stmt->fetchColumn();
    if ($val !== false) {
        $regionId = (int)$val;
    }
}

// If no region specified and not explicitly requesting all, default to Tatarstan (code 16)
if ($regionId <= 0 && !isset($_GET['all'])) {
    $stmt = $pdo->query("SELECT id FROM asmt_regions WHERE code = '16' LIMIT 1");
    $val = $stmt->fetchColumn();
    $regionId = $val !== false ? (int)$val : 1;
}

if ($regionId > 0) {
    // Return districts for the specified region
    $stmt = $pdo->prepare("
        SELECT id, name, is_separate_city, region_id
        FROM asmt_districts
        WHERE is_active = TRUE AND region_id = ?
        ORDER BY (name = 'Иное')::int ASC, is_separate_city DESC, sort_order ASC, name ASC
    ");
    $stmt->execute([$regionId]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // If this region doesn't have an 'Иное' in DB, append the global fallback
    $hasOther = false;
    foreach ($rows as $r) {
        if ($r['name'] === 'Иное') {
            $hasOther = true;
            break;
        }
    }
    if (!$hasOther) {
        $otherStmt = $pdo->query("SELECT id, name, is_separate_city, region_id FROM asmt_districts WHERE is_active = TRUE AND region_id IS NULL AND name = 'Иное' LIMIT 1");
        $other = $otherStmt->fetch(PDO::FETCH_ASSOC);
        if ($other) {
            $rows[] = $other;
        }
    }
} else {
    $stmt = $pdo->query("
        SELECT id, name, is_separate_city, region_id
        FROM asmt_districts
        WHERE is_active = TRUE
        ORDER BY sort_order ASC, name ASC
        LIMIT 200
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

Http::json([
    'success' => true,
    'regionId' => $regionId > 0 ? $regionId : null,
    'districts' => array_map(static function ($r) {
        return [
            'id' => (int)$r['id'],
            'name' => $r['name'],
            'isSeparateCity' => (bool)$r['is_separate_city'],
            'regionId' => isset($r['region_id']) && $r['region_id'] !== null ? (int)$r['region_id'] : null,
        ];
    }, $rows),
]);
