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

try {
    // Any open attempt is closed (no resume / Continue)
    AttemptService::finalizeOpenAttemptsForUser($pdo, $userId);
} catch (Throwable $e) {
    Http::json([
        'success' => false,
        'error' => 'Не удалось закрыть предыдущую попытку: ' . $e->getMessage(),
    ], 500);
}

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

$done = $pdo->prepare(
    "SELECT id FROM asmt_attempts
     WHERE user_id = ? AND campaign_id = ?
       AND status IN ('finished', 'abandoned', 'expired')
     LIMIT 1"
);
$done->execute([$userId, $campaignId]);
$finished = $done->fetch();

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

if ($finished && $approvedRetake) {
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
        $ip, // null is fine for CAST(? AS inet)
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
        if (!empty($campaign['shuffle_options'])) {
            shuffle($letters);
        }
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
    Http::json(['success' => false, 'error' => 'Не удалось начать попытку: ' . $e->getMessage()], 500);
}

try {
    $questions = loadAttemptQuestions($pdo, $attemptId);
} catch (Throwable $e) {
    Http::json([
        'success' => false,
        'error' => 'Попытка создана, но не удалось загрузить вопросы: ' . $e->getMessage(),
        'attemptId' => $attemptId,
    ], 500);
}

Http::json([
    'success' => true,
    'resumed' => false,
    'attemptId' => $attemptId,
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
    $out = [];
    foreach ($rows as $row) {
        $order = json_decode((string)$row['options_order_json'], true) ?: [];
        $optStmt = $pdo->prepare(
            'SELECT letter, text FROM asmt_question_options WHERE question_id = ?'
        );
        $optStmt->execute([(int)$row['question_id']]);
        $byLetter = [];
        foreach ($optStmt->fetchAll() as $opt) {
            $byLetter[$opt['letter']] = $opt['text'];
        }
        $options = [];
        foreach ($order as $letter) {
            if (isset($byLetter[$letter])) {
                $options[] = ['letter' => $letter, 'text' => $byLetter[$letter]];
            }
        }
        $out[] = [
            'questionId' => (int)$row['question_id'],
            'externalId' => (int)$row['external_id'],
            'formulationId' => $row['formulation_id'] ? (int)$row['formulation_id'] : null,
            'text' => $row['text'],
            'options' => $options,
            'chosen' => $row['option_letter_chosen'],
        ];
    }
    return $out;
}
