<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$user = Auth::requireRole(['superadmin', 'region_admin', 'moderator', 'analyst']);
$pdo = Db::pdo();

$campaignId = isset($_GET['campaignId']) && $_GET['campaignId'] !== '' ? (int)$_GET['campaignId'] : null;
$status = trim((string)($_GET['status'] ?? ''));
$dateFrom = trim((string)($_GET['dateFrom'] ?? ''));
$dateTo = trim((string)($_GET['dateTo'] ?? ''));
$q = trim((string)($_GET['q'] ?? ''));
$limit = min(500, max(1, (int)($_GET['limit'] ?? 100)));
$offset = max(0, (int)($_GET['offset'] ?? 0));

$where = ['1=1'];
$params = [];

if ($campaignId) {
    $where[] = 'a.campaign_id = ?';
    $params[] = $campaignId;
}
if ($status !== '' && in_array($status, ['in_progress', 'finished', 'expired', 'abandoned'], true)) {
    $where[] = 'a.status = ?';
    $params[] = $status;
}
if ($dateFrom !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateFrom)) {
    $where[] = 'a.started_at::date >= ?::date';
    $params[] = $dateFrom;
}
if ($dateTo !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateTo)) {
    $where[] = 'a.started_at::date <= ?::date';
    $params[] = $dateTo;
}
if ($q !== '') {
    $where[] = '(u.last_name ILIKE ? OR u.first_name ILIKE ? OR u.email_normalized ILIKE ? OR o.name ILIKE ? OR o.inn ILIKE ?)';
    $like = '%' . $q . '%';
    array_push($params, $like, $like, $like, $like, $like);
}

$approvedOnly = isset($_GET['approvedOnly']) && $_GET['approvedOnly'] === '1';
if ($approvedOnly) {
    $where[] = "a.user_org_status_at_attempt = 'approved'";
}

if ($user['role'] === 'region_admin' && !empty($user['region_id'])) {
    $where[] = 'u.region_id = ?';
    $params[] = (int)$user['region_id'];
}

$sqlWhere = implode(' AND ', $where);

$countStmt = $pdo->prepare(
    "SELECT COUNT(*) FROM asmt_attempts a
     JOIN asmt_users u ON u.id = a.user_id
     LEFT JOIN asmt_organizations o ON o.id = a.organization_id_at_attempt
     WHERE {$sqlWhere}"
);
$countStmt->execute($params);
$total = (int)$countStmt->fetchColumn();

$sql = "SELECT
            a.id, a.status, a.started_at, a.finished_at, a.duration_seconds,
            a.total_questions, a.answered_count, a.correct_count, a.incorrect_count,
            a.score, a.percent_correct, a.device_type, a.user_agent,
            a.user_org_status_at_attempt,
            host(a.ip_address) AS ip_address,
            u.id AS user_id, u.last_name, u.first_name, u.middle_name,
            u.email_normalized, u.phone_normalized, u.position,
            c.id AS campaign_id, c.code AS campaign_code, c.name AS campaign_name,
            o.name AS organization_name, o.inn AS organization_inn
        FROM asmt_attempts a
        JOIN asmt_users u ON u.id = a.user_id
        JOIN asmt_campaigns c ON c.id = a.campaign_id
        LEFT JOIN asmt_organizations o ON o.id = a.organization_id_at_attempt
        WHERE {$sqlWhere}
        ORDER BY a.started_at DESC
        LIMIT {$limit} OFFSET {$offset}";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$showIp = in_array($user['role'], ['superadmin', 'region_admin'], true);

if ($user['role'] === 'region_admin' && !empty($user['region_id'])) {
    $cStmt = $pdo->prepare(
        'SELECT id, code, name FROM asmt_campaigns
         WHERE region_id IS NULL OR region_id = ?
         ORDER BY id DESC'
    );
    $cStmt->execute([(int)$user['region_id']]);
    $campaigns = $cStmt->fetchAll();
} else {
    $campaigns = $pdo->query('SELECT id, code, name FROM asmt_campaigns ORDER BY id DESC')->fetchAll();
}

Http::json([
    'success' => true,
    'total' => $total,
    'limit' => $limit,
    'offset' => $offset,
    'showIp' => $showIp,
    'campaigns' => array_map(static function ($c) {
        return [
            'id' => (int)$c['id'],
            'code' => $c['code'],
            'name' => $c['name'],
        ];
    }, $campaigns),
    'items' => array_map(static function ($r) use ($showIp) {
        return [
            'id' => (int)$r['id'],
            'status' => $r['status'],
            'startedAt' => $r['started_at'],
            'finishedAt' => $r['finished_at'],
            'durationSeconds' => $r['duration_seconds'] !== null ? (int)$r['duration_seconds'] : null,
            'totalQuestions' => (int)$r['total_questions'],
            'answeredCount' => (int)$r['answered_count'],
            'correctCount' => (int)$r['correct_count'],
            'incorrectCount' => (int)$r['incorrect_count'],
            'score' => (int)$r['score'],
            'percentCorrect' => (float)$r['percent_correct'],
            'deviceType' => $r['device_type'],
            'ipAddress' => $showIp ? $r['ip_address'] : null,
            'moderationStatus' => $r['user_org_status_at_attempt'],
            'user' => [
                'id' => (int)$r['user_id'],
                'lastName' => $r['last_name'],
                'firstName' => $r['first_name'],
                'middleName' => $r['middle_name'],
                'email' => $r['email_normalized'],
                'phone' => $r['phone_normalized'],
                'position' => $r['position'],
            ],
            'campaign' => [
                'id' => (int)$r['campaign_id'],
                'code' => $r['campaign_code'],
                'name' => $r['campaign_name'],
            ],
            'organization' => [
                'name' => $r['organization_name'],
                'inn' => $r['organization_inn'],
            ],
        ];
    }, $rows),
]);
