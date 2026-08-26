<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\AttemptService;
use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$user = Auth::requireUser();
$pdo = Db::pdo();
$userId = (int)$user['id'];
$isAdmin = in_array($user['role'], ['superadmin', 'region_admin', 'moderator', 'analyst'], true);

$attemptId = (int)($_GET['attemptId'] ?? $_GET['attempt'] ?? 0);
if ($attemptId <= 0) {
    $latestStmt = $pdo->prepare(
        "SELECT id FROM asmt_attempts WHERE user_id = ? ORDER BY id DESC LIMIT 1"
    );
    $latestStmt->execute([$userId]);
    $attemptId = (int)$latestStmt->fetchColumn();
}

if ($attemptId <= 0) {
    Http::json(['success' => false, 'error' => 'Попытка не найдена'], 404);
}

// Fetch attempt
$attStmt = $pdo->prepare(
    "SELECT a.*, c.name AS campaign_name, c.code AS campaign_code,
            u.last_name, u.first_name, u.middle_name, u.email_normalized, u.phone_normalized
     FROM asmt_attempts a
     JOIN asmt_campaigns c ON c.id = a.campaign_id
     JOIN asmt_users u ON u.id = a.user_id
     WHERE a.id = ?"
);
$attStmt->execute([$attemptId]);
$attempt = $attStmt->fetch();

if (!$attempt) {
    Http::json(['success' => false, 'error' => 'Попытка не найдена'], 404);
}

if (!$isAdmin && (int)$attempt['user_id'] !== $userId) {
    Http::json(['success' => false, 'error' => 'Доступ запрещён'], 403);
}

$isSuperseded = ($attempt['status'] === 'superseded');

// Fetch review questions only if NOT superseded (or if admin)
$reviewQuestions = [];
if (!$isSuperseded || $isAdmin) {
    $qStmt = $pdo->prepare(
        "SELECT aa.id AS answer_id, aa.question_id, aa.option_letter_chosen, aa.is_correct,
                aa.options_order_json, aa.answered_at,
                q.text AS base_question_text, q.correct_letter,
                COALESCE(f.text, q.text) AS question_text
         FROM asmt_attempt_answers aa
         JOIN asmt_questions q ON q.id = aa.question_id
         LEFT JOIN asmt_question_formulations f ON f.id = aa.formulation_id
         WHERE aa.attempt_id = ?
         ORDER BY aa.id ASC"
    );
    $qStmt->execute([$attemptId]);
    $rows = $qStmt->fetchAll();

    foreach ($rows as $idx => $r) {
        $qid = (int)$r['question_id'];
        $optionsOrder = json_decode((string)$r['options_order_json'], true) ?: [];

        $optsStmt = $pdo->prepare(
            "SELECT letter, text FROM asmt_question_options WHERE question_id = ? ORDER BY sort_order, id"
        );
        $optsStmt->execute([$qid]);
        $allOpts = $optsStmt->fetchAll();
        $byLetter = [];
        foreach ($allOpts as $o) {
            $byLetter[$o['letter']] = $o['text'];
        }

        $orderedOptions = [];
        if (!empty($optionsOrder)) {
            foreach ($optionsOrder as $letter) {
                if (isset($byLetter[$letter])) {
                    $orderedOptions[] = [
                        'letter' => $letter,
                        'text' => $byLetter[$letter],
                    ];
                }
            }
        }
        if (empty($orderedOptions)) {
            foreach ($allOpts as $o) {
                $orderedOptions[] = [
                    'letter' => $o['letter'],
                    'text' => $o['text'],
                ];
            }
        }

        $chosenLetter = trim((string)($r['option_letter_chosen'] ?? ''));
        $correctLetter = trim((string)($r['correct_letter'] ?? ''));

        $isCorrect = false;
        if ($r['is_correct'] !== null) {
            $isCorrect = (bool)$r['is_correct'];
        } elseif ($chosenLetter !== '') {
            $isCorrect = (AttemptService::normalizeOptionLetter($chosenLetter) === AttemptService::normalizeOptionLetter($correctLetter));
        }

        $reviewQuestions[] = [
            'number' => $idx + 1,
            'questionId' => $qid,
            'text' => $r['question_text'],
            'options' => $orderedOptions,
            'chosenLetter' => $chosenLetter !== '' ? $chosenLetter : null,
            'correctLetter' => $correctLetter,
            'isCorrect' => $isCorrect,
            'answeredAt' => $r['answered_at'],
        ];
    }
}

$telemetryLog = json_decode((string)($attempt['telemetry_json'] ?? '[]'), true) ?: [];

Http::json([
    'success' => true,
    'isAdmin' => $isAdmin,
    'attempt' => [
        'id' => (int)$attempt['id'],
        'userId' => (int)$attempt['user_id'],
        'userName' => trim(($attempt['last_name'] ?? '') . ' ' . ($attempt['first_name'] ?? '') . ' ' . ($attempt['middle_name'] ?? '')),
        'userEmail' => $attempt['email_normalized'],
        'campaignId' => (int)$attempt['campaign_id'],
        'campaignName' => $attempt['campaign_name'],
        'status' => $attempt['status'],
        'score' => (int)$attempt['score'],
        'percentCorrect' => (float)$attempt['percent_correct'],
        'totalQuestions' => (int)$attempt['total_questions'],
        'correctCount' => (int)$attempt['correct_count'],
        'incorrectCount' => (int)$attempt['incorrect_count'],
        'answeredCount' => (int)$attempt['answered_count'],
        'durationSeconds' => (int)$attempt['duration_seconds'],
        'startedAt' => $attempt['started_at'],
        'finishedAt' => $attempt['finished_at'],
        'lastPingAt' => $attempt['last_ping_at'],
        'disconnectCount' => (int)($attempt['disconnect_count'] ?? 0),
        'totalOfflineSeconds' => (int)($attempt['total_offline_seconds'] ?? 0),
        'tabHiddenSeconds' => (int)($attempt['tab_hidden_seconds'] ?? 0),
        'telemetryLog' => $telemetryLog,
        'isPassed' => (float)$attempt['percent_correct'] >= 70.0,
    ],
    'isSuperseded' => $isSuperseded,
    'questions' => $reviewQuestions,
]);
