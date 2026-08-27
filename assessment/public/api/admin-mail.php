<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
}

Auth::requireRole(['superadmin', 'region_admin', 'moderator', 'analyst']);
$pdo = Db::pdo();

// Journal retention: 30 days
try {
    $pdo->exec("DELETE FROM asmt_mail_queue WHERE created_at < NOW() - INTERVAL '30 days'");
} catch (\Throwable $e) {
    // Cleanup is best-effort; listing must still work
}

$q = trim((string)($_GET['q'] ?? ''));
$type = trim((string)($_GET['type'] ?? 'all'));
$status = trim((string)($_GET['status'] ?? 'all'));
$perPage = min(100, max(10, (int)($_GET['perPage'] ?? 25)));
$page = max(1, (int)($_GET['page'] ?? 1));

$where = ['1=1'];
$params = [];

if ($type !== '' && $type !== 'all') {
    $where[] = 'mail_type = ?';
    $params[] = $type;
}
if ($status !== '' && $status !== 'all') {
    $where[] = 'status = ?';
    $params[] = $status;
}
if ($q !== '') {
    $where[] = '(to_email ILIKE ? OR subject ILIKE ?)';
    $like = '%' . $q . '%';
    array_push($params, $like, $like);
}

$sqlWhere = implode(' AND ', $where);

$cnt = $pdo->prepare("SELECT COUNT(*) FROM asmt_mail_queue WHERE {$sqlWhere}");
$cnt->execute($params);
$total = (int)$cnt->fetchColumn();

$totalPages = $total > 0 ? (int)ceil($total / $perPage) : 1;
if ($page > $totalPages) {
    $page = $totalPages;
}
$offset = ($page - 1) * $perPage;

$stmt = $pdo->prepare(
    "SELECT id, to_email, subject, mail_type, status, attempts_count, last_error, created_at, sent_at
     FROM asmt_mail_queue
     WHERE {$sqlWhere}
     ORDER BY COALESCE(sent_at, created_at) DESC, id DESC
     LIMIT ? OFFSET ?"
);
$listParams = $params;
$listParams[] = $perPage;
$listParams[] = $offset;
$stmt->execute($listParams);
$rows = $stmt->fetchAll();

$statsStmt = $pdo->query(
    "SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'sent') AS sent,
        COUNT(*) FILTER (WHERE status = 'failed') AS failed,
        COUNT(*) FILTER (WHERE status IN ('new', 'processing')) AS pending
     FROM asmt_mail_queue"
);
$stats = $statsStmt->fetch() ?: [];

Http::json([
    'success' => true,
    'total' => $total,
    'page' => $page,
    'perPage' => $perPage,
    'totalPages' => $totalPages,
    'retentionDays' => 30,
    'stats' => [
        'total' => (int)($stats['total'] ?? 0),
        'sent' => (int)($stats['sent'] ?? 0),
        'failed' => (int)($stats['failed'] ?? 0),
        'pending' => (int)($stats['pending'] ?? 0),
    ],
    'items' => array_map(static function ($r) {
        return [
            'id' => (int)$r['id'],
            'to' => $r['to_email'],
            'subject' => $r['subject'],
            'type' => $r['mail_type'] ?: 'other',
            'status' => $r['status'],
            'attempts' => (int)$r['attempts_count'],
            'lastError' => $r['last_error'],
            'createdAt' => $r['created_at'],
            'sentAt' => $r['sent_at'],
        ];
    }, $rows),
]);
