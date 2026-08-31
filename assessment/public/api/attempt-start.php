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
$pdo = Db::pdo();
$userId = (int)$user['id'];
$regionId = !empty($user['region_id']) ? (int)$user['region_id'] : null;

$payload = Http::readJson();
$requestedCampaignId = isset($payload['campaignId']) ? (int)$payload['campaignId'] : 0;
$requestedAttemptId = isset($payload['attemptId']) ? (int)$payload['attemptId'] : 0;

// 1. First, check if there is an active, unexpired in_progress attempt for this user
$activeSql = "SELECT a.*, c.time_limit_minutes
              FROM asmt_attempts a
              JOIN asmt_campaigns c ON c.id = a.campaign_id
              WHERE a.user_id = ? AND a.status = 'in_progress' AND a.expires_at > NOW()";
$activeParams = [$userId];

if ($requestedAttemptId > 0) {
    $activeSql .= " AND a.id = ?";
    $activeParams[] = $requestedAttemptId;
} elseif ($requestedCampaignId > 0) {
    $activeSql .= " AND a.campaign_id = ?";
    $activeParams[] = $requestedCampaignId;
}
$activeSql .= " ORDER BY a.id DESC LIMIT 1";

$activeStmt = $pdo->prepare($activeSql);
$activeStmt->execute($activeParams);
$activeAttempt = $activeStmt->fetch();

if ($activeAttempt) {
    $attemptId = (int)$activeAttempt['id'];
    $questions = loadAttemptQuestions($pdo, $attemptId);
    Http::json([
        'success' => true,
        'resumed' => true,
        'attemptId' => $attemptId,
        'attempt' => [
            'id' => $attemptId,
            'campaignId' => (int)$activeAttempt['campaign_id'],
            'expiresAt' => $activeAttempt['expires_at'],
            'startedAt' => $activeAttempt['started_at'],
        ],
        'campaignId' => (int)$activeAttempt['campaign_id'],
        'expiresAt' => $activeAttempt['expires_at'],
        'startedAt' => $activeAttempt['started_at'],
        'serverNow' => gmdate('c'),
        'timeLimitMinutes' => (int)$activeAttempt['time_limit_minutes'],
        'questions' => $questions,
    ]);
}

// 2. Finalize any expired/abandoned open attempts
try {
    AttemptService::finalizeOpenAttemptsForUser($pdo, $userId);
} catch (Throwable $e) {
    // ignore
}

// 3. Find active campaign
if ($requestedCampaignId > 0) {
    if ($regionId) {
        $campStmt = $pdo->prepare(
            'SELECT * FROM asmt_campaigns
             WHERE id = ? AND is_active = TRUE
               AND (region_id IS NULL OR region_id = ?)
               AND (starts_at IS NULL OR starts_at <= NOW())
               AND (ends_at IS NULL OR ends_at >= NOW())
             LIMIT 1'
        );
        $campStmt->execute([$requestedCampaignId, $regionId]);
    } else {
        $campStmt = $pdo->prepare(
            'SELECT * FROM asmt_campaigns
             WHERE id = ? AND is_active = TRUE
               AND (starts_at IS NULL OR starts_at <= NOW())
               AND (ends_at IS NULL OR ends_at >= NOW())
             LIMIT 1'
        );
        $campStmt->execute([$requestedCampaignId]);
    }
    $campaign = $campStmt->fetch();
} elseif ($regionId) {
    $campStmt = $pdo->prepare(
        'SELECT * FROM asmt_campaigns
         WHERE is_active = TRUE AND (region_id IS NULL OR region_id = ?)
           AND (starts_at IS NULL OR starts_at <= NOW())
           AND (ends_at IS NULL OR ends_at >= NOW())
         ORDER BY id DESC LIMIT 1'
    );
    $campStmt->execute([$regionId]);
    $campaign = $campStmt->fetch();
} else {
    $campaign = $pdo->query(
        'SELECT * FROM asmt_campaigns WHERE is_active = TRUE
           AND (starts_at IS NULL OR starts_at <= NOW())
           AND (ends_at IS NULL OR ends_at >= NOW())
         ORDER BY id DESC LIMIT 1'
    )->fetch();
}
if (!$campaign) {
    Http::json(['success' => false, 'error' => 'Нет активной кампании'], 400);
}

$campaignId = (int)$campaign['id'];

// 4. Check if user already finished this campaign
$done = $pdo->prepare(
    "SELECT id FROM asmt_attempts
     WHERE user_id = ? AND campaign_id = ?
       AND status IN ('finished', 'abandoned', 'expired')
     LIMIT 1"
);
$done->execute([$userId, $campaignId]);
$finished = $done->fetch();

// Check if retake was approved
$retake = $pdo->prepare(
    "SELECT id FROM asmt_retake_requests
     WHERE user_id = ? AND campaign_id = ? AND status = 'approved'
     ORDER BY id DESC LIMIT 1"
);
$retake->execute([$userId, $campaignId]);
$approvedRetake = $retake->fetch();

if ($finished && !$approvedRetake) {
    Http::json(['success' => false, 'error' => 'Тест в этой кампании уже пройден. Можно отправить запрос на повторное прохождение.'], 409);
}

if ($approvedRetake) {
    AttemptService::supersedeFinished($pdo, $userId, $campaignId);
    $pdo->prepare(
        "UPDATE asmt_retake_requests SET status = 'used', reviewed_at = COALESCE(reviewed_at, NOW()) WHERE id = ?"
    )->execute([(int)$approvedRetake['id']]);
}

$limit = max(1, (int)$campaign['questions_per_attempt']);
$qStmt = $pdo->query(
    'SELECT id, external_id, text, correct_letter
     FROM asmt_questions
     WHERE is_active = TRUE
     ORDER BY id'
);
$all = $qStmt->fetchAll();
if (count($all) < $limit) {
    Http::json(['success' => false, 'error' => 'В банке недостаточно вопросов. Запустите импорт seed.'], 500);
}

shuffle($all);
$picked = array_slice($all, 0, $limit);
$order = array_map(static fn($q) => (int)$q['id'], $picked);

$org = $pdo->prepare(
    'SELECT organization_id, status FROM asmt_user_organizations WHERE user_id = ? ORDER BY requested_at DESC LIMIT 1'
);
$org->execute([$userId]);
$orgRow = $org->fetch() ?: null;

$minutes = max(1, (int)$campaign['time_limit_minutes']);
$ua = Http::userAgent();
$device = Http::deviceType($ua);
$ip = Http::clientIp();

$pdo->beginTransaction();
try {
    $ins = $pdo->prepare(
        'INSERT INTO asmt_attempts (
            user_id, campaign_id, organization_id_at_attempt, user_org_status_at_attempt,
            status, started_at, expires_at, total_questions, question_order_json,
            ip_address, user_agent, device_type
         ) VALUES (
            ?, ?, ?, ?, \'in_progress\', NOW(), NOW() + (? || \' minutes\')::interval, ?, ?::jsonb,
            CAST(? AS inet), ?, ?
         ) RETURNING id, expires_at, started_at'
    );
    $ins->execute([
        $userId,
        $campaignId,
        $orgRow ? (int)$orgRow['organization_id'] : null,
        $orgRow ? $orgRow['status'] : 'pending',
        (string)$minutes,
        $limit,
        json_encode($order, JSON_UNESCAPED_UNICODE),
        $ip,
        $ua,
        $device,
    ]);
    $attempt = $ins->fetch();
    $attemptId = (int)$attempt['id'];

    $ansIns = $pdo->prepare(
        'INSERT INTO asmt_attempt_answers (attempt_id, question_id, formulation_id, options_order_json)
         VALUES (?, ?, ?, ?::jsonb)'
    );

    foreach ($picked as $q) {
        $qid = (int)$q['id'];
        $form = $pdo->prepare(
            'SELECT id FROM asmt_question_formulations
             WHERE question_id = ? AND is_active = TRUE
             ORDER BY random()
             LIMIT 1'
        );
        $form->execute([$qid]);
        $formulationId = $form->fetchColumn();
        if (!$formulationId) {
            $insF = $pdo->prepare(
                'INSERT INTO asmt_question_formulations (question_id, text, sort_order) VALUES (?, ?, 0) RETURNING id'
            );
            $insF->execute([$qid, $q['text']]);
            $formulationId = $insF->fetchColumn();
        }

        $opts = $pdo->prepare(
            'SELECT letter FROM asmt_question_options WHERE question_id = ? ORDER BY sort_order, id'
        );
        $opts->execute([$qid]);
        $letters = array_column($opts->fetchAll(), 'letter');
        // Do not shuffle option choices, because questions often contain references like "верны варианты А и Г"
        $ansIns->execute([
            $attemptId,
            $qid,
            (int)$formulationId,
            json_encode($letters, JSON_UNESCAPED_UNICODE),
        ]);
    }

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    Http::logError("attempt_start_failed", $e, (int)$user["id"]);
    Http::json(["success" => false, "error" => "Не удалось сформировать билет. Пожалуйста, попробуйте позже."], 500);
}

try {
    $questions = loadAttemptQuestions($pdo, $attemptId);
} catch (Throwable $e) {
    Http::json([
        'success' => false,
        'error' => 'Билет создан, но не удалось загрузить вопросы: ' . $e->getMessage(),
        'attemptId' => $attemptId,
    ], 500);
}

Http::json([
    'success' => true,
    'resumed' => false,
    'attemptId' => $attemptId,
    'attempt' => [
        'id' => $attemptId,
        'expiresAt' => $attempt['expires_at'],
        'startedAt' => $attempt['started_at'],
    ],
    'expiresAt' => $attempt['expires_at'],
    'startedAt' => $attempt['started_at'],
    'serverNow' => gmdate('c'),
    'timeLimitMinutes' => $minutes,
    'questions' => $questions,
]);

function loadAttemptQuestions(PDO $pdo, int $attemptId): array
{
    $stmt = $pdo->prepare(
        'SELECT aa.question_id, aa.formulation_id, aa.options_order_json, aa.option_letter_chosen,
                q.external_id,
                COALESCE(f.text, q.text) AS text
         FROM asmt_attempt_answers aa
         JOIN asmt_questions q ON q.id = aa.question_id
         LEFT JOIN asmt_question_formulations f ON f.id = aa.formulation_id
         WHERE aa.attempt_id = ?
         ORDER BY aa.id'
    );
    $stmt->execute([$attemptId]);
    $rows = $stmt->fetchAll();
    if (empty($rows)) {
        return [];
    }

    $qids = array_map(static fn($r) => (int)$r['question_id'], $rows);
    $inClause = implode(',', array_fill(0, count($qids), '?'));

    $optStmt = $pdo->prepare(
        "SELECT question_id, letter, text 
         FROM asmt_question_options 
         WHERE question_id IN ({$inClause})
         ORDER BY question_id, sort_order, id"
    );
    $optStmt->execute($qids);
    $allOpts = $optStmt->fetchAll();

    $byQid = [];
    foreach ($allOpts as $o) {
        $byQid[(int)$o['question_id']][$o['letter']] = $o['text'];
    }

    $out = [];
    foreach ($rows as $row) {
        $qid = (int)$row['question_id'];
        $byLetter = $byQid[$qid] ?? [];
        $options = [];
        foreach ($byLetter as $letter => $text) {
            $options[] = ['letter' => $letter, 'text' => $text];
        }
        $out[] = [
            'id' => $qid,
            'questionId' => $qid,
            'externalId' => (int)$row['external_id'],
            'formulationId' => $row['formulation_id'] ? (int)$row['formulation_id'] : null,
            'text' => $row['text'],
            'options' => $options,
            'chosen' => $row['option_letter_chosen'],
        ];
    }
    return $out;
}
