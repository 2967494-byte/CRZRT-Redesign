<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$user = Auth::requireRole(['superadmin', 'region_admin', 'moderator', 'analyst']);
$pdo = Db::pdo();

$regionFilterUser = '';
$regionFilterRetake = '';
$paramsUser = [];
$paramsRetake = [];

if ($user['role'] === 'region_admin' && !empty($user['region_id'])) {
    $regionFilterUser = ' AND u.region_id = ?';
    $paramsUser[] = (int)$user['region_id'];

    $regionFilterRetake = ' AND u.region_id = ?';
    $paramsRetake[] = (int)$user['region_id'];
}

// 1. Pending moderation requests
$modStmt = $pdo->prepare(
    "SELECT COUNT(*) FROM asmt_user_organizations uo
     JOIN asmt_users u ON u.id = uo.user_id
     WHERE uo.status = 'pending'{$regionFilterUser}"
);
$modStmt->execute($paramsUser);
$moderationCount = (int)$modStmt->fetchColumn();

// 2. Pending retake requests
$retakeStmt = $pdo->prepare(
    "SELECT COUNT(*) FROM asmt_retake_requests r
     JOIN asmt_users u ON u.id = r.user_id
     WHERE r.status = 'pending'{$regionFilterRetake}"
);
$retakeStmt->execute($paramsRetake);
$retakeCount = (int)$retakeStmt->fetchColumn();

Http::json([
    'success' => true,
    'moderation' => $moderationCount,
    'requests' => $retakeCount,
]);
