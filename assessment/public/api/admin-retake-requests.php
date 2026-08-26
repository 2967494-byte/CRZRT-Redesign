<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = Db::pdo();

if ($method === 'GET') {
    $user = Auth::requireRole(['superadmin', 'region_admin', 'moderator', 'analyst']);
    $status = trim((string)($_GET['status'] ?? 'pending'));
    $limit = min(200, max(1, (int)($_GET['limit'] ?? 50)));
    $offset = max(0, (int)($_GET['offset'] ?? 0));

    $where = ['1=1'];
    $params = [];
    if ($status !== '' && $status !== 'all') {
        $where[] = 'r.status = ?';
        $params[] = $status;
    }
    if ($user['role'] === 'region_admin' && !empty($user['region_id'])) {
        $where[] = 'u.region_id = ?';
        $params[] = (int)$user['region_id'];
    }
    $sqlWhere = implode(' AND ', $where);

    $count = $pdo->prepare(
        "SELECT COUNT(*) FROM asmt_retake_requests r
         JOIN asmt_users u ON u.id = r.user_id
         WHERE {$sqlWhere}"
    );
    $count->execute($params);
    $total = (int)$count->fetchColumn();

    $stmt = $pdo->prepare(
        "SELECT r.id, r.status, r.reason, r.admin_comment, r.created_at, r.reviewed_at,
                r.campaign_id, r.attempt_id,
                c.name AS campaign_name,
                u.id AS user_id, u.last_name, u.first_name, u.middle_name, u.email_normalized, u.phone_normalized,
                a.score, a.percent_correct, a.total_questions, a.finished_at AS attempt_finished_at,
                a.disconnect_count, a.total_offline_seconds, a.tab_hidden_seconds, a.telemetry_json
         FROM asmt_retake_requests r
         JOIN asmt_users u ON u.id = r.user_id
         JOIN asmt_campaigns c ON c.id = r.campaign_id
         LEFT JOIN asmt_attempts a ON a.id = r.attempt_id
         WHERE {$sqlWhere}
         ORDER BY
            CASE r.status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
            r.created_at ASC
         LIMIT ? OFFSET ?"
    );
    $params[] = $limit;
    $params[] = $offset;
    $stmt->execute($params);

    Http::json([
        'success' => true,
        'total' => $total,
        'canModerate' => in_array($user['role'], ['superadmin', 'region_admin', 'moderator'], true),
        'items' => array_map(static function ($r) {
            $telemetryLog = json_decode((string)($r['telemetry_json'] ?? '[]'), true) ?: [];
            return [
                'id' => (int)$r['id'],
                'status' => $r['status'],
                'reason' => $r['reason'],
                'adminComment' => $r['admin_comment'],
                'createdAt' => $r['created_at'],
                'reviewedAt' => $r['reviewed_at'],
                'campaignId' => (int)$r['campaign_id'],
                'campaignName' => $r['campaign_name'],
                'attemptId' => $r['attempt_id'] ? (int)$r['attempt_id'] : null,
                'attemptScore' => $r['score'] !== null ? (int)$r['score'] : null,
                'attemptPercent' => $r['percent_correct'] !== null ? (float)$r['percent_correct'] : null,
                'attemptTotal' => $r['total_questions'] !== null ? (int)$r['total_questions'] : null,
                'attemptFinishedAt' => $r['attempt_finished_at'],
                'disconnectCount' => (int)($r['disconnect_count'] ?? 0),
                'totalOfflineSeconds' => (int)($r['total_offline_seconds'] ?? 0),
                'tabHiddenSeconds' => (int)($r['tab_hidden_seconds'] ?? 0),
                'telemetryLog' => $telemetryLog,
                'user' => [
                    'id' => (int)$r['user_id'],
                    'lastName' => $r['last_name'],
                    'firstName' => $r['first_name'],
                    'middleName' => $r['middle_name'],
                    'email' => $r['email_normalized'],
                    'phone' => $r['phone_normalized'],
                ],
            ];
        }, $stmt->fetchAll()),
    ]);
}

if ($method !== 'POST') {
    Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
}

$user = Auth::requireRole(['superadmin', 'region_admin', 'moderator']);
$payload = Http::readJson();
$id = (int)($payload['id'] ?? 0);
$action = trim((string)($payload['action'] ?? ''));
$comment = trim((string)($payload['comment'] ?? ''));

if ($id <= 0 || !in_array($action, ['approve', 'reject'], true)) {
    Http::json(['success' => false, 'error' => 'Некорректные параметры'], 400);
}

$row = $pdo->prepare('SELECT * FROM asmt_retake_requests WHERE id = ?');
$row->execute([$id]);
$req = $row->fetch();
if (!$req) {
    Http::json(['success' => false, 'error' => 'Запрос не найден'], 404);
}
if ($req['status'] !== 'pending') {
    Http::json(['success' => false, 'error' => 'Запрос уже обработан'], 400);
}

$newStatus = $action === 'approve' ? 'approved' : 'rejected';
$pdo->prepare(
    'UPDATE asmt_retake_requests
     SET status = ?, admin_comment = ?, reviewed_by = ?, reviewed_at = NOW()
     WHERE id = ?'
)->execute([
    $newStatus,
    $comment !== '' ? $comment : null,
    (int)$user['id'],
    $id,
]);

Http::json([
    'success' => true,
    'id' => $id,
    'status' => $newStatus,
    'message' => $action === 'approve' ? 'Запрос одобрен' : 'Запрос отклонён',
]);
