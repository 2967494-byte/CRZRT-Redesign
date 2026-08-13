<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Db;
use Asmt\Http;

$inn = preg_replace('/\D+/', '', (string)($_GET['inn'] ?? '')) ?? '';
if (!in_array(strlen($inn), [10, 12], true)) {
    Http::json([
        'success' => true,
        'found' => false,
        'error' => 'ИНН должен содержать 10 или 12 цифр',
    ]);
}

$pdo = Db::pdo();
$stmt = $pdo->prepare(
    'SELECT id, parent_id, level, name, inn, customer_level, status
     FROM asmt_organizations
     WHERE inn = ? AND level = 3
     LIMIT 1'
);
$stmt->execute([$inn]);
$org = $stmt->fetch();
if (!$org) {
    Http::json(['success' => true, 'found' => false]);
}

$level2 = null;
$level1 = null;
if (!empty($org['parent_id'])) {
    $p2 = $pdo->prepare('SELECT id, parent_id, name, level FROM asmt_organizations WHERE id = ?');
    $p2->execute([(int)$org['parent_id']]);
    $level2 = $p2->fetch() ?: null;
    if ($level2 && !empty($level2['parent_id'])) {
        $p1 = $pdo->prepare('SELECT id, name, level FROM asmt_organizations WHERE id = ?');
        $p1->execute([(int)$level2['parent_id']]);
        $level1 = $p1->fetch() ?: null;
    }
}

Http::json([
    'success' => true,
    'found' => true,
    'organization' => [
        'id' => (int)$org['id'],
        'name' => $org['name'],
        'inn' => $org['inn'],
        'level' => (int)$org['level'],
        'customerLevel' => $org['customer_level'],
        'status' => $org['status'],
        'hierarchy' => [
            'level1' => $level1 ? ['id' => (int)$level1['id'], 'name' => $level1['name']] : null,
            'level2' => $level2 ? ['id' => (int)$level2['id'], 'name' => $level2['name']] : null,
            'level3' => ['id' => (int)$org['id'], 'name' => $org['name'], 'inn' => $org['inn']],
        ],
    ],
]);
