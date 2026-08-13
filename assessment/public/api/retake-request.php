<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$user = Auth::requireUser();
$pdo = Db::pdo();
$userId = (int)$user['id'];
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $stmt = $pdo->prepare(
        'SELECT r.id, r.campaign_id, r.attempt_id, r.reason, r.status, r.admin_comment,
                r.created_at, r.reviewed_at, c.name AS campaign_name
         FROM asmt_retake_requests r
         JOIN asmt_campaigns c ON c.id = r.campaign_id
         WHERE r.user_id = ?
         ORDER BY r.created_at DESC
         LIMIT 50'
    );
    $stmt->execute([$userId]);
    Http::json([
        'success' => true,
        'items' => array_map(static function ($r) {
            return [
                'id' => (int)$r['id'],
                'campaignId' => (int)$r['campaign_id'],
                'campaignName' => $r['campaign_name'],
                'attemptId' => $r['attempt_id'] ? (int)$r['attempt_id'] : null,
                'reason' => $r['reason'],
                'status' => $r['status'],
                'adminComment' => $r['admin_comment'],
                'createdAt' => $r['created_at'],
                'reviewedAt' => $r['reviewed_at'],
            ];
        }, $stmt->fetchAll()),
    ]);
}

if ($method !== 'POST') {
    Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
}

$payload = Http::readJson();
$campaignId = (int)($payload['campaignId'] ?? 0);
$reason = trim((string)($payload['reason'] ?? ''));
if ($campaignId <= 0) {
    Http::json(['success' => false, 'error' => 'Не указана кампания'], 400);
}
if (mb_strlen($reason) < 5) {
    Http::json(['success' => false, 'error' => 'Укажите причину (не менее 5 символов)'], 400);
}
if (mb_strlen($reason) > 2000) {
    Http::json(['success' => false, 'error' => 'Слишком длинный текст причины'], 400);
}

$camp = $pdo->prepare('SELECT id, name FROM asmt_campaigns WHERE id = ?');
$camp->execute([$campaignId]);
if (!$camp->fetch()) {
    Http::json(['success' => false, 'error' => 'Кампания не найдена'], 404);
}

$finished = $pdo->prepare(
    "SELECT id FROM asmt_attempts
     WHERE user_id = ? AND campaign_id = ?
       AND status IN ('finished', 'abandoned', 'expired')
     ORDER BY CASE status WHEN 'finished' THEN 0 ELSE 1 END, id DESC
     LIMIT 1"
);
$finished->execute([$userId, $campaignId]);
$fin = $finished->fetch();
if (!$fin) {
    Http::json(['success' => false, 'error' => 'Нет завершённой попытки — можно просто начать тест'], 400);
}

$existing = $pdo->prepare(
    "SELECT id, status FROM asmt_retake_requests
     WHERE user_id = ? AND campaign_id = ?
       AND status IN ('pending', 'approved', 'rejected')
     ORDER BY id DESC
     LIMIT 1"
);
$existing->execute([$userId, $campaignId]);
$existRow = $existing->fetch();
if ($existRow) {
    if ($existRow['status'] === 'rejected') {
        Http::json([
            'success' => false,
            'error' => 'Запрос на повторное прохождение по этому тесту уже отклонён. Повторная подача недоступна.',
        ], 409);
    }
    Http::json(['success' => false, 'error' => 'У вас уже есть активный запрос на эту кампанию'], 409);
}

$ins = $pdo->prepare(
    'INSERT INTO asmt_retake_requests (user_id, campaign_id, attempt_id, reason, status)
     VALUES (?, ?, ?, ?, \'pending\')
     RETURNING id, created_at'
);
$ins->execute([$userId, $campaignId, (int)$fin['id'], $reason]);
$row = $ins->fetch();

Http::json([
    'success' => true,
    'id' => (int)$row['id'],
    'createdAt' => $row['created_at'],
    'message' => 'Запрос отправлен администратору',
]);
