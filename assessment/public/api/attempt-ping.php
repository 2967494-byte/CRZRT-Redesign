<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
}

$user = Auth::requireUser();
$pdo = Db::pdo();
$userId = (int)$user['id'];

$payload = Http::readJson();
$attemptId = (int)($payload['attemptId'] ?? 0);
$events = (array)($payload['events'] ?? []);

if ($attemptId <= 0) {
    Http::json(['success' => false, 'error' => 'Не указан attemptId'], 400);
}

// Fetch active attempt
$stmt = $pdo->prepare(
    "SELECT id, user_id, status, expires_at, disconnect_count, total_offline_seconds, tab_hidden_seconds, telemetry_json
     FROM asmt_attempts
     WHERE id = ?"
);
$stmt->execute([$attemptId]);
$attempt = $stmt->fetch();

if (!$attempt) {
    Http::json(['success' => false, 'error' => 'Попытка не найдена'], 404);
}

if ((int)$attempt['user_id'] !== $userId) {
    Http::json(['success' => false, 'error' => 'Доступ запрещён'], 403);
}

// If attempt is already finished/superseded, return its status
if ($attempt['status'] !== 'in_progress') {
    Http::json([
        'success' => true,
        'status' => $attempt['status'],
        'isFinished' => true,
    ]);
}

$disconnectCount = (int)$attempt['disconnect_count'];
$totalOfflineSec = (int)$attempt['total_offline_seconds'];
$tabHiddenSec = (int)$attempt['tab_hidden_seconds'];
$telemetryLog = json_decode((string)$attempt['telemetry_json'], true) ?: [];

// Process new events if sent
if (!empty($events)) {
    foreach ($events as $ev) {
        if (!is_array($ev)) continue;
        $type = (string)($ev['type'] ?? 'unknown');
        $duration = max(0, (int)($ev['duration_seconds'] ?? $ev['durationSec'] ?? 0));
        $timestamp = (string)($ev['timestamp'] ?? date('c'));
        $detail = (string)($ev['detail'] ?? '');

        if ($type === 'network_drop') {
            $disconnectCount++;
            $totalOfflineSec += $duration;
        } elseif ($type === 'tab_hidden') {
            $tabHiddenSec += $duration;
        }

        $telemetryLog[] = [
            'type' => $type,
            'duration' => $duration,
            'ts' => $timestamp,
            'detail' => $detail,
        ];
    }
}

// Update attempt heartbeat & telemetry
$upd = $pdo->prepare(
    "UPDATE asmt_attempts
     SET last_ping_at = NOW(),
         disconnect_count = ?,
         total_offline_seconds = ?,
         tab_hidden_seconds = ?,
         telemetry_json = ?::jsonb
     WHERE id = ?"
);
$upd->execute([
    $disconnectCount,
    $totalOfflineSec,
    $tabHiddenSec,
    json_encode($telemetryLog, JSON_UNESCAPED_UNICODE),
    $attemptId,
]);

$expiresAtTs = !empty($attempt['expires_at']) ? strtotime((string)$attempt['expires_at']) : 0;
$remainingSec = max(0, $expiresAtTs - time());

Http::json([
    'success' => true,
    'status' => 'in_progress',
    'serverTs' => time(),
    'remainingSeconds' => $remainingSec,
]);
