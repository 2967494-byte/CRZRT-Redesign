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
    $q = trim((string)($_GET['q'] ?? ''));
    $limit = min(200, max(1, (int)($_GET['limit'] ?? 50)));
    $offset = max(0, (int)($_GET['offset'] ?? 0));

    $where = ['1=1'];
    $params = [];
    if ($status !== '' && $status !== 'all') {
        $where[] = 'uo.status = ?';
        $params[] = $status;
    }
    if ($q !== '') {
        $where[] = '(u.last_name ILIKE ? OR u.first_name ILIKE ? OR u.email_normalized ILIKE ? OR o.name ILIKE ? OR o.inn ILIKE ?)';
        $like = '%' . $q . '%';
        array_push($params, $like, $like, $like, $like, $like);
    }
    if ($user['role'] === 'region_admin' && !empty($user['region_id'])) {
        $where[] = 'u.region_id = ?';
        $params[] = (int)$user['region_id'];
    }

    $sqlWhere = implode(' AND ', $where);
    $count = $pdo->prepare(
        "SELECT COUNT(*) FROM asmt_user_organizations uo
         JOIN asmt_users u ON u.id = uo.user_id
         JOIN asmt_organizations o ON o.id = uo.organization_id
         WHERE {$sqlWhere}"
    );
    $count->execute($params);
    $total = (int)$count->fetchColumn();

    $stmt = $pdo->prepare(
        "SELECT uo.id, uo.status, uo.requested_at, uo.moderated_at, uo.moderator_comment,
                u.id AS user_id, u.last_name, u.first_name, u.middle_name,
                u.email_normalized, u.phone_normalized, u.position,
                u.experience_level, u.education, u.specialty, u.customer_level,
                u.district_other_text, u.consent_pd_at, u.consent_privacy_at, u.created_at,
                d.name AS district_name,
                reg.name AS region_name,
                o.id AS org_id, o.name AS org_name, o.inn AS org_inn, o.level AS org_level,
                o.customer_level AS org_customer_level, o.status AS org_status,
                p2.name AS level2_name, p1.name AS level1_name
         FROM asmt_user_organizations uo
         JOIN asmt_users u ON u.id = uo.user_id
         JOIN asmt_organizations o ON o.id = uo.organization_id
         LEFT JOIN asmt_organizations p2 ON p2.id = o.parent_id
         LEFT JOIN asmt_organizations p1 ON p1.id = p2.parent_id
         LEFT JOIN asmt_districts d ON d.id = u.district_id
         LEFT JOIN asmt_regions reg ON reg.id = u.region_id
         WHERE {$sqlWhere}
         ORDER BY
            CASE uo.status WHEN 'pending' THEN 0 WHEN 'needs_info' THEN 1 ELSE 2 END,
            uo.requested_at ASC
         LIMIT {$limit} OFFSET {$offset}"
    );
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $canModerate = in_array($user['role'], ['superadmin', 'region_admin', 'moderator'], true);

    Http::json([
        'success' => true,
        'total' => $total,
        'canModerate' => $canModerate,
        'items' => array_map(static function ($r) {
            return [
                'id' => (int)$r['id'],
                'status' => $r['status'],
                'requestedAt' => $r['requested_at'],
                'moderatedAt' => $r['moderated_at'],
                'comment' => $r['moderator_comment'],
                'user' => [
                    'id' => (int)$r['user_id'],
                    'lastName' => $r['last_name'],
                    'firstName' => $r['first_name'],
                    'middleName' => $r['middle_name'],
                    'email' => $r['email_normalized'],
                    'phone' => $r['phone_normalized'],
                    'position' => $r['position'],
                    'experienceLevel' => $r['experience_level'],
                    'education' => $r['education'],
                    'specialty' => $r['specialty'],
                    'customerLevel' => $r['customer_level'],
                    'district' => $r['district_name'],
                    'districtOther' => $r['district_other_text'],
                    'region' => $r['region_name'],
                    'consentPdAt' => $r['consent_pd_at'],
                    'consentPrivacyAt' => $r['consent_privacy_at'],
                    'createdAt' => $r['created_at'],
                ],
                'organization' => [
                    'id' => (int)$r['org_id'],
                    'name' => $r['org_name'],
                    'inn' => $r['org_inn'],
                    'customerLevel' => $r['org_customer_level'],
                    'status' => $r['org_status'],
                    'level1' => $r['level1_name'],
                    'level2' => $r['level2_name'],
                ],
            ];
        }, $rows),
    ]);
}

if ($method === 'POST') {
    $user = Auth::requireRole(['superadmin', 'region_admin', 'moderator']);
    $payload = Http::readJson();
    $id = (int)($payload['id'] ?? 0);
    $action = trim((string)($payload['action'] ?? ''));
    $comment = trim((string)($payload['comment'] ?? ''));
    $map = [
        'approve' => 'approved',
        'reject' => 'rejected',
        'needs_info' => 'needs_info',
    ];
    if ($id <= 0 || !isset($map[$action])) {
        Http::json(['success' => false, 'error' => 'Укажите id и action (approve|reject|needs_info)'], 400);
    }
    if ($action !== 'approve' && $comment === '') {
        Http::json(['success' => false, 'error' => 'Для отклонения / уточнения укажите комментарий'], 400);
    }

    $rowStmt = $pdo->prepare(
        'SELECT uo.*, u.region_id AS user_region_id
         FROM asmt_user_organizations uo
         JOIN asmt_users u ON u.id = uo.user_id
         WHERE uo.id = ?'
    );
    $rowStmt->execute([$id]);
    $row = $rowStmt->fetch();
    if (!$row) {
        Http::json(['success' => false, 'error' => 'Заявка не найдена'], 404);
    }
    if ($user['role'] === 'region_admin' && !empty($user['region_id'])
        && (int)$row['user_region_id'] !== (int)$user['region_id']) {
        Http::json(['success' => false, 'error' => 'Чужой регион'], 403);
    }

    $newStatus = $map[$action];
    $pdo->prepare(
        'UPDATE asmt_user_organizations
         SET status = ?, moderated_at = NOW(), moderated_by = ?, moderator_comment = ?
         WHERE id = ?'
    )->execute([$newStatus, (int)$user['id'], $comment, $id]);

    if ($newStatus === 'approved') {
        $pdo->prepare(
            "UPDATE asmt_organizations SET status = 'approved'
             WHERE id = ? AND status = 'pending'"
        )->execute([(int)$row['organization_id']]);
    }

    $pdo->prepare(
        'UPDATE asmt_attempts
         SET user_org_status_at_attempt = ?
         WHERE user_id = ? AND organization_id_at_attempt = ?'
    )->execute([$newStatus, (int)$row['user_id'], (int)$row['organization_id']]);

    $pdo->prepare(
        'INSERT INTO asmt_admin_audit (admin_user_id, action, entity, entity_id, meta_json)
         VALUES (?, ?, \'user_organization\', ?, ?::jsonb)'
    )->execute([
        (int)$user['id'],
        'moderation_' . $action,
        $id,
        json_encode(['status' => $newStatus, 'comment' => $comment], JSON_UNESCAPED_UNICODE),
    ]);

    Http::json(['success' => true, 'status' => $newStatus]);
}

Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
