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
    "SELECT id, status, expires_at
     FROM asmt_attempts
     WHERE id = ? AND user_id = ?"
);
$stmt->execute([$attemptId, $userId]);
$attempt = $stmt->fetch();

if (!$attempt) {
    Http::json(['success' => false, 'error' => 'Попытка не найдена'], 404);
}

if ($attempt['status'] !== 'in_progress') {
    Http::json([
        'success' => true,
        'status' => $attempt['status'],
        'isFinished' => true,
    ]);
}

$addDisconnects = 0;
$addOfflineSec = 0;
$addTabHiddenSec = 0;
$telemetryEvents = [];

if (!empty($events)) {
    foreach ($events as $ev) {
        if (!is_array($ev)) continue;
        $type = (string)($ev['type'] ?? 'unknown');
        $duration = max(0, (int)($ev['duration_seconds'] ?? $ev['durationSec'] ?? 0));
        $timestamp = (string)($ev['timestamp'] ?? date('c'));
        $detail = (string)($ev['detail'] ?? '');

        if ($type === 'network_drop') {
            $addDisconnects++;
            $addOfflineSec += $duration;
        } elseif ($type === 'tab_hidden') {
            $addTabHiddenSec += $duration;
        }

        $telemetryEvents[] = [
            'type' => $type,
            'duration' => $duration,
            'ts' => $timestamp,
            'detail' => $detail,
        ];
    }
}

// Atomic update with native PostgreSQL JSONB concatenation
if (!empty($telemetryEvents)) {
    $eventsJson = json_encode($telemetryEvents, JSON_UNESCAPED_UNICODE);
    $upd = $pdo->prepare(
        "UPDATE asmt_attempts
         SET last_ping_at = NOW(),
             disconnect_count = disconnect_count + ?,
             total_offline_seconds = total_offline_seconds + ?,
             tab_hidden_seconds = tab_hidden_seconds + ?,
             telemetry_json = telemetry_json || ?::jsonb
         WHERE id = ?"
    );
    $upd->execute([
        $addDisconnects,
        $addOfflineSec,
        $addTabHiddenSec,
        $eventsJson,
        $attemptId,
    ]);
} else {
    $pdo->prepare("UPDATE asmt_attempts SET last_ping_at = NOW() WHERE id = ?")->execute([$attemptId]);
}

$expiresAtTs = !empty($attempt['expires_at']) ? strtotime((string)$attempt['expires_at']) : 0;
$remainingSec = max(0, $expiresAtTs - time());

Http::json([
    'success' => true,
    'status' => 'in_progress',
    'serverTs' => time(),
    'remainingSeconds' => $remainingSec,
]);
