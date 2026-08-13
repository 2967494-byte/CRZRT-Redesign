<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\AttemptService;
use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
}

$user = Auth::requireUser();
$payload = Http::readJson();
$attemptId = (int)($payload['attemptId'] ?? 0);
if ($attemptId <= 0) {
    Http::json(['success' => false, 'error' => 'Не указана попытка'], 400);
}

$pdo = Db::pdo();
$att = $pdo->prepare('SELECT * FROM asmt_attempts WHERE id = ? AND user_id = ?');
$att->execute([$attemptId, (int)$user['id']]);
$attempt = $att->fetch();
if (!$attempt) {
    Http::json(['success' => false, 'error' => 'Попытка не найдена'], 404);
}

$answers = $payload['answers'] ?? null;
if (!is_array($answers)) {
    $answers = null;
}

if ($attempt['status'] === 'finished' || $attempt['status'] === 'superseded') {
    $camp = $pdo->prepare('SELECT name FROM asmt_campaigns WHERE id = ?');
    $camp->execute([(int)$attempt['campaign_id']]);
    $attempt['campaign_name'] = $camp->fetchColumn() ?: null;
    Http::json([
        'success' => true,
        'alreadyFinished' => true,
        'result' => summarize($attempt),
    ]);
}

if (!in_array($attempt['status'], ['in_progress', 'expired', 'abandoned'], true)) {
    Http::json(['success' => false, 'error' => 'Попытка уже закрыта'], 400);
}

// If another finished exists for this campaign, close as abandoned to respect unique index
$hasFinished = $pdo->prepare(
    "SELECT 1 FROM asmt_attempts
     WHERE user_id = ? AND campaign_id = ? AND status = 'finished' AND id <> ?
     LIMIT 1"
);
$hasFinished->execute([(int)$user['id'], (int)$attempt['campaign_id'], $attemptId]);
$status = $hasFinished->fetch() ? 'abandoned' : 'finished';

$attempt = AttemptService::finalizeAttempt($pdo, $attempt, $status, $answers);

$fresh = $pdo->prepare(
    'SELECT a.*, c.name AS campaign_name
     FROM asmt_attempts a
     JOIN asmt_campaigns c ON c.id = a.campaign_id
     WHERE a.id = ?'
);
$fresh->execute([$attemptId]);
$attempt = $fresh->fetch();

Http::json([
    'success' => true,
    'result' => summarize($attempt),
]);

function summarize(array $attempt): array
{
    return [
        'attemptId' => (int)$attempt['id'],
        'status' => $attempt['status'],
        'startedAt' => $attempt['started_at'],
        'finishedAt' => $attempt['finished_at'],
        'durationSeconds' => (int)($attempt['duration_seconds'] ?? 0),
        'totalQuestions' => (int)$attempt['total_questions'],
        'answeredCount' => (int)$attempt['answered_count'],
        'correctCount' => (int)$attempt['correct_count'],
        'incorrectCount' => (int)$attempt['incorrect_count'],
        'score' => (int)$attempt['score'],
        'percentCorrect' => (float)$attempt['percent_correct'],
        'campaignName' => $attempt['campaign_name'] ?? null,
    ];
}
