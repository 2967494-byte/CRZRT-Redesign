<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$user = Auth::requireRole(['superadmin', 'region_admin', 'moderator', 'analyst']);
$pdo = Db::pdo();

$campaignId = isset($_GET['campaignId']) && $_GET['campaignId'] !== '' ? (int)$_GET['campaignId'] : null;
$orgId = isset($_GET['organizationId']) && $_GET['organizationId'] !== '' ? (int)$_GET['organizationId'] : null;
$inn = preg_replace('/\D+/', '', (string)($_GET['inn'] ?? '')) ?? '';

$where = [
    "a.status = 'finished'",
    "uo.status = 'approved'",
];
$params = [];

if ($campaignId) {
    $where[] = 'a.campaign_id = ?';
    $params[] = $campaignId;
}
if ($orgId) {
    $where[] = 'a.organization_id_at_attempt = ?';
    $params[] = $orgId;
}
if ($inn !== '') {
    $where[] = 'o.inn = ?';
    $params[] = $inn;
}
if ($user['role'] === 'region_admin' && !empty($user['region_id'])) {
    $where[] = 'u.region_id = ?';
    $params[] = (int)$user['region_id'];
}

$sqlWhere = implode(' AND ', $where);

$sql = "SELECT
            o.id AS org_id, o.name AS org_name, o.inn AS org_inn,
            c.id AS campaign_id, c.code AS campaign_code, c.name AS campaign_name,
            COUNT(a.id) AS attempts,
            ROUND(AVG(a.score)::numeric, 2) AS avg_score,
            ROUND(AVG(a.percent_correct)::numeric, 2) AS avg_percent,
            MIN(a.score) AS min_score,
            MAX(a.score) AS max_score
        FROM asmt_attempts a
        JOIN asmt_users u ON u.id = a.user_id
        JOIN asmt_user_organizations uo ON uo.user_id = a.user_id AND uo.organization_id = a.organization_id_at_attempt
        JOIN asmt_organizations o ON o.id = a.organization_id_at_attempt
        JOIN asmt_campaigns c ON c.id = a.campaign_id
        WHERE {$sqlWhere}
        GROUP BY o.id, o.name, o.inn, c.id, c.code, c.name
        ORDER BY o.name, c.code";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$campaignsSql = 'SELECT id, code, name, region_id FROM asmt_campaigns ORDER BY id DESC';
if ($user['role'] === 'region_admin' && !empty($user['region_id'])) {
    $cStmt = $pdo->prepare(
        'SELECT id, code, name, region_id FROM asmt_campaigns
         WHERE region_id IS NULL OR region_id = ?
         ORDER BY id DESC'
    );
    $cStmt->execute([(int)$user['region_id']]);
    $campaigns = $cStmt->fetchAll();
} else {
    $campaigns = $pdo->query($campaignsSql)->fetchAll();
}

Http::json([
    'success' => true,
    'note' => 'В свод попадают только участники со статусом модерации approved',
    'campaigns' => array_map(static function ($c) {
        return ['id' => (int)$c['id'], 'code' => $c['code'], 'name' => $c['name']];
    }, $campaigns),
    'items' => array_map(static function ($r) {
        return [
            'organization' => [
                'id' => (int)$r['org_id'],
                'name' => $r['org_name'],
                'inn' => $r['org_inn'],
            ],
            'campaign' => [
                'id' => (int)$r['campaign_id'],
                'code' => $r['campaign_code'],
                'name' => $r['campaign_name'],
            ],
            'attempts' => (int)$r['attempts'],
            'avgScore' => (float)$r['avg_score'],
            'avgPercent' => (float)$r['avg_percent'],
            'minScore' => (int)$r['min_score'],
            'maxScore' => (int)$r['max_score'],
        ];
    }, $rows),
]);
