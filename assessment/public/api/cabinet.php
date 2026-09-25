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
$regionId = !empty($user['region_id']) ? (int)$user['region_id'] : null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $payload = Http::readJson();
    $action = trim((string)($payload['action'] ?? $_GET['action'] ?? 'resubmit_profile'));

    if ($action === 'resubmit_profile') {
        $findLink = $pdo->prepare('SELECT id, status, moderator_comment, previous_moderator_comment, organization_id FROM asmt_user_organizations WHERE user_id = ? ORDER BY requested_at DESC LIMIT 1');
        $findLink->execute([$userId]);
        $link = $findLink->fetch();

        if (!$link || !in_array($link['status'], ['rejected', 'needs_info'], true)) {
            Http::json(['success' => false, 'error' => 'Повторная отправка на модерацию доступна только для отклонённых заявок или требующих уточнения'], 400);
        }

        $position = trim((string)($payload['position'] ?? ''));
        $experienceLevel = trim((string)($payload['experienceLevel'] ?? ''));
        $education = trim((string)($payload['education'] ?? ''));
        $specialty = trim((string)($payload['specialty'] ?? ''));
        $customerLevel = trim((string)($payload['customerLevel'] ?? ''));
        $organizationName = trim((string)($payload['organizationName'] ?? ''));
        $inn = preg_replace('/\D+/', '', (string)($payload['inn'] ?? '')) ?? '';
        $newRegionId = !empty($payload['regionId']) ? (int)$payload['regionId'] : null;
        $districtId = !empty($payload['districtId']) ? (int)$payload['districtId'] : null;
        $districtOtherText = trim((string)($payload['districtOtherText'] ?? ''));

        if ($position === '') {
            Http::json(['success' => false, 'error' => 'Укажите занимаемую должность'], 400);
        }
        if ($organizationName === '' || !in_array(strlen($inn), [10, 12], true)) {
            Http::json(['success' => false, 'error' => 'Укажите корректный ИНН и наименование организации'], 400);
        }

        $pdo->beginTransaction();
        try {
            // 1. Update user profile
            $updUser = $pdo->prepare('
                UPDATE asmt_users
                SET position = ?,
                    experience_level = COALESCE(NULLIF(?, \'\'), experience_level),
                    education = COALESCE(NULLIF(?, \'\'), education),
                    specialty = COALESCE(NULLIF(?, \'\'), specialty),
                    customer_level = COALESCE(NULLIF(?, \'\'), customer_level),
                    region_id = COALESCE(?, region_id),
                    district_id = ?,
                    district_other_text = ?
                WHERE id = ?
            ');
            $updUser->execute([
                $position,
                $experienceLevel,
                $education,
                $specialty,
                $customerLevel,
                $newRegionId,
                $districtId,
                $districtOtherText,
                $userId
            ]);

            // 2. Resolve organization by INN and update name if needed
            $findOrg = $pdo->prepare('SELECT id, name, customer_level, status FROM asmt_organizations WHERE inn = ? AND level = 3 LIMIT 1');
            $findOrg->execute([$inn]);
            $existingOrg = $findOrg->fetch();
            if ($existingOrg) {
                $orgId = (int)$existingOrg['id'];
                $pdo->prepare('UPDATE asmt_organizations SET name = ?, customer_level = COALESCE(NULLIF(?, \'\'), customer_level) WHERE id = ?')
                    ->execute([$organizationName, $customerLevel ?: 'state', $orgId]);
            } else {
                $insOrg = $pdo->prepare(
                    'INSERT INTO asmt_organizations (parent_id, level, name, inn, customer_level, status)
                     VALUES (NULL, 3, ?, ?, ?, \'pending\') RETURNING id'
                );
                $insOrg->execute([$organizationName, $inn, $customerLevel ?: 'state']);
                $orgId = (int)$insOrg->fetchColumn();
            }

            // 3. Update user organization link to pending with is_resubmitted = TRUE
            $prevComment = !empty($link['moderator_comment'])
                ? $link['moderator_comment']
                : ($link['previous_moderator_comment'] ?? null);

            $updLink = $pdo->prepare('
                UPDATE asmt_user_organizations
                SET organization_id = ?,
                    status = \'pending\',
                    is_resubmitted = TRUE,
                    resubmitted_at = NOW(),
                    requested_at = NOW(),
                    previous_moderator_comment = ?,
                    moderator_comment = \'\'
                WHERE id = ?
            ');
            $updLink->execute([$orgId, $prevComment, (int)$link['id']]);

            // 4. Audit entry (admin_user_id = NULL for specialist self-action)
            $pdo->prepare('
                INSERT INTO asmt_admin_audit (admin_user_id, action, entity, entity_id, meta_json)
                VALUES (NULL, \'user_profile_resubmit\', \'asmt_users\', ?, ?::jsonb)
            ')->execute([
                $userId,
                json_encode([
                    'actor' => 'specialist',
                    'user_id' => $userId,
                    'position' => $position,
                    'inn' => $inn,
                    'organization' => $organizationName,
                    'district_id' => $districtId,
                    'district_other' => $districtOtherText,
                ], JSON_UNESCAPED_UNICODE)
            ]);

            $pdo->commit();
            Http::json(['success' => true, 'message' => 'Данные успешно сохранены и отправлены на повторную модерацию']);
        } catch (\Throwable $e) {
            $pdo->rollBack();
            Http::json(['success' => false, 'error' => 'Ошибка сохранения данных: ' . $e->getMessage()], 500);
        }
    } elseif ($action === 'update_profile') {
        $position = trim((string)($payload['position'] ?? ''));
        $experienceLevel = trim((string)($payload['experienceLevel'] ?? ''));
        $education = trim((string)($payload['education'] ?? ''));
        $specialty = trim((string)($payload['specialty'] ?? ''));
        $districtId = !empty($payload['districtId']) ? (int)$payload['districtId'] : null;
        $districtOtherText = trim((string)($payload['districtOtherText'] ?? ''));

        if ($position === '') {
            Http::json(['success' => false, 'error' => 'Укажите занимаемую должность'], 400);
        }

        try {
            $updUser = $pdo->prepare('
                UPDATE asmt_users
                SET position = ?,
                    experience_level = COALESCE(NULLIF(?, \'\'), experience_level),
                    education = COALESCE(NULLIF(?, \'\'), education),
                    specialty = COALESCE(NULLIF(?, \'\'), specialty),
                    district_id = ?,
                    district_other_text = ?
                WHERE id = ?
            ');
            $updUser->execute([
                $position,
                $experienceLevel,
                $education,
                $specialty,
                $districtId,
                $districtOtherText,
                $userId
            ]);

            $pdo->prepare('
                INSERT INTO asmt_admin_audit (admin_user_id, action, entity, entity_id, meta_json)
                VALUES (NULL, \'user_profile_update\', \'asmt_users\', ?, ?::jsonb)
            ')->execute([
                $userId,
                json_encode([
                    'actor' => 'specialist',
                    'user_id' => $userId,
                    'position' => $position,
                    'district_id' => $districtId,
                    'district_other' => $districtOtherText,
                ], JSON_UNESCAPED_UNICODE)
            ]);

            Http::json(['success' => true, 'message' => 'Данные профиля успешно обновлены']);
        } catch (\Throwable $e) {
            Http::json(['success' => false, 'error' => 'Ошибка обновления профиля: ' . $e->getMessage()], 500);
        }
    }

    Http::json(['success' => false, 'error' => 'Неизвестное действие'], 400);
}

// Leaving the test without finish = results are recorded; no Continue.
AttemptService::finalizeOpenAttemptsForUser($pdo, $userId);

$org = $pdo->prepare(
    'SELECT o.id, o.name, o.inn, uo.status, uo.moderator_comment,
            uo.is_resubmitted, uo.resubmitted_at, uo.previous_moderator_comment,
            p2.name AS level2_name, p1.name AS level1_name
     FROM asmt_user_organizations uo
     JOIN asmt_organizations o ON o.id = uo.organization_id
     LEFT JOIN asmt_organizations p2 ON p2.id = o.parent_id
     LEFT JOIN asmt_organizations p1 ON p1.id = p2.parent_id
     WHERE uo.user_id = ?
     ORDER BY uo.requested_at DESC
     LIMIT 1'
);
$org->execute([$userId]);
$organization = $org->fetch() ?: null;

if ($regionId) {
    $campStmt = $pdo->prepare(
        'SELECT id, code, name, time_limit_minutes, questions_per_attempt, starts_at, ends_at
         FROM asmt_campaigns
         WHERE is_active = TRUE 
           AND (region_id IS NULL OR region_id = ?)
           AND (starts_at IS NULL OR starts_at <= NOW())
           AND (ends_at IS NULL OR ends_at >= NOW())
         ORDER BY id DESC'
    );
    $campStmt->execute([$regionId]);
    $campaignRows = $campStmt->fetchAll();
} else {
    $campaignRows = $pdo->query(
        'SELECT id, code, name, time_limit_minutes, questions_per_attempt, starts_at, ends_at
         FROM asmt_campaigns
         WHERE is_active = TRUE
           AND (starts_at IS NULL OR starts_at <= NOW())
           AND (ends_at IS NULL OR ends_at >= NOW())
         ORDER BY id DESC'
    )->fetchAll();
}

$doneStmt = $pdo->prepare(
    "SELECT id, score, percent_correct, total_questions, finished_at FROM asmt_attempts
     WHERE user_id = ? AND campaign_id = ?
       AND status IN ('finished', 'abandoned', 'expired')
     ORDER BY id DESC
     LIMIT 1"
);
$rqStmt = $pdo->prepare(
    "SELECT id, status, reason, created_at, admin_comment
     FROM asmt_retake_requests
     WHERE user_id = ? AND campaign_id = ?
       AND status IN ('pending', 'approved', 'rejected')
     ORDER BY id DESC LIMIT 1"
);

$activeCampaigns = [];
foreach ($campaignRows as $campaign) {
    $campId = (int)$campaign['id'];
    $canAttempt = false;
    $attemptBlockReason = null;
    $retakeRequest = null;
    $canRequestRetake = false;
    $lastResult = null;

    $doneStmt->execute([$userId, $campId]);
    $finishedRow = $doneStmt->fetch() ?: null;

    if ($finishedRow) {
        $lastResult = [
            'attemptId' => (int)$finishedRow['id'],
            'score' => (int)$finishedRow['score'],
            'totalQuestions' => (int)$finishedRow['total_questions'],
            'percentCorrect' => (int)round((float)$finishedRow['percent_correct']),
            'isPassed' => (float)$finishedRow['percent_correct'] >= 70.0,
            'finishedAt' => $finishedRow['finished_at'],
        ];
    }

    try {
        $rqStmt->execute([$userId, $campId]);
        $retakeRow = $rqStmt->fetch() ?: null;
    } catch (Throwable $e) {
        $retakeRow = null;
    }

    if ($retakeRow) {
        $retakeRequest = [
            'id' => (int)$retakeRow['id'],
            'status' => $retakeRow['status'],
            'reason' => $retakeRow['reason'],
            'createdAt' => $retakeRow['created_at'],
            'adminComment' => $retakeRow['admin_comment'],
        ];
    }

    if ($finishedRow && $retakeRow && $retakeRow['status'] === 'approved') {
        $canAttempt = true;
        $attemptBlockReason = null;
        $canRequestRetake = false;
    } elseif ($finishedRow) {
        $attemptBlockReason = 'Вы уже завершили тест в этой кампании';
        $canRequestRetake = false;
        if ($retakeRow && $retakeRow['status'] === 'pending') {
            $attemptBlockReason = 'Запрос на повторное прохождение отправлен и ожидает решения администратора';
        } elseif ($retakeRow && $retakeRow['status'] === 'rejected') {
            $attemptBlockReason = 'Запрос на повторное прохождение отклонён';
        } else {
            $canRequestRetake = true;
        }
    } else {
        $canAttempt = true;
    }

    if ($organization && $organization['status'] === 'pending') {
        $canAttempt = false;
        $attemptBlockReason = !empty($organization['is_resubmitted'])
            ? 'Повторная заявка находится на рассмотрении модератора. Доступ к тестированию откроется после подтверждения.'
            : 'Регистрация ожидает подтверждения модератором. Доступ к тестированию откроется после проверки.';
    } elseif ($organization && $organization['status'] === 'rejected') {
        $canAttempt = false;
        $attemptBlockReason = 'Заявка отклонена модератором. Исправьте данные в профиле для допуска к тестированию.';
    } elseif ($organization && $organization['status'] === 'needs_info') {
        $canAttempt = false;
        $attemptBlockReason = 'Требуется уточнение данных по замечанию модератора.';
    } elseif (!$organization || $organization['status'] !== 'approved') {
        $canAttempt = false;
        $attemptBlockReason = 'Для прохождения тестирования необходимо подтверждение организации модератором.';
    }

    $activeCampaigns[] = [
        'id' => $campId,
        'code' => $campaign['code'],
        'name' => $campaign['name'],
        'questionsPerAttempt' => (int)$campaign['questions_per_attempt'],
        'timeLimitMinutes' => (int)$campaign['time_limit_minutes'],
        'startsAt' => $campaign['starts_at'] ?? null,
        'endsAt' => $campaign['ends_at'] ?? null,
        'questions_per_attempt' => (int)$campaign['questions_per_attempt'],
        'time_limit_minutes' => (int)$campaign['time_limit_minutes'],
        'starts_at' => $campaign['starts_at'] ?? null,
        'ends_at' => $campaign['ends_at'] ?? null,
        'canAttempt' => $canAttempt,
        'attemptBlockReason' => $attemptBlockReason,
        'canRequestRetake' => $canRequestRetake,
        'retakeRequest' => $retakeRequest,
        'lastResult' => $lastResult,
    ];
}

// Backward-compatible single-campaign fields (первая / новейшая)
$primary = $activeCampaigns[0] ?? null;
$mappedCampaign = $primary;
$canAttempt = $primary['canAttempt'] ?? false;
$attemptBlockReason = $primary['attemptBlockReason']
    ?? (empty($activeCampaigns) ? 'В данный момент нет активных кампаний для вашего региона' : null);
$canRequestRetake = $primary['canRequestRetake'] ?? false;
$retakeRequest = $primary['retakeRequest'] ?? null;
$lastResult = $primary['lastResult'] ?? null;

$history = $pdo->prepare(
    'SELECT a.id, a.status, a.started_at, a.finished_at, a.score, a.percent_correct,
            a.correct_count, a.incorrect_count, a.answered_count, a.total_questions, a.duration_seconds,
            c.name AS campaign_name, c.code AS campaign_code
     FROM asmt_attempts a
     JOIN asmt_campaigns c ON c.id = a.campaign_id
     WHERE a.user_id = ?
     ORDER BY a.started_at DESC
     LIMIT 50'
);
$history->execute([$userId]);

$banners = [];
if ($regionId) {
    $bStmt = $pdo->prepare(
        'SELECT id, title, body, link_url
         FROM asmt_region_banners
         WHERE region_id = ? AND is_active = TRUE
         ORDER BY sort_order, id'
    );
    $bStmt->execute([$regionId]);
    $banners = $bStmt->fetchAll();
}

$regionName = null;
if ($regionId) {
    $rStmt = $pdo->prepare('SELECT name FROM asmt_regions WHERE id = ?');
    $rStmt->execute([$regionId]);
    $regionName = $rStmt->fetchColumn() ?: null;
}

$districtName = null;
if (!empty($user['district_id'])) {
    $dStmt = $pdo->prepare('SELECT name FROM asmt_districts WHERE id = ?');
    $dStmt->execute([(int)$user['district_id']]);
    $districtName = $dStmt->fetchColumn() ?: null;
}

$recalculatedHistory = $history->fetchAll();

$mappedBanners = array_map(static function ($b) {
    return [
        'id' => (int)$b['id'],
        'title' => $b['title'],
        'body' => $b['body'],
        'linkUrl' => $b['link_url'],
    ];
}, $banners);

$mappedHistory = array_map(static function ($h) {
    return [
        'id' => (int)$h['id'],
        'status' => $h['status'],
        'campaignName' => $h['campaign_name'] ?? '',
        'campaignCode' => $h['campaign_code'] ?? '',
        'startedAt' => $h['started_at'] ?? null,
        'finishedAt' => $h['finished_at'] ?? null,
        'score' => (int)($h['score'] ?? 0),
        'percentCorrect' => (float)($h['percent_correct'] ?? 0),
        'totalQuestions' => (int)($h['total_questions'] ?? 0),
        'correctCount' => (int)($h['correct_count'] ?? 0),
        'incorrectCount' => (int)($h['incorrect_count'] ?? 0),
        'answeredCount' => (int)($h['answered_count'] ?? 0),
        'durationSeconds' => isset($h['duration_seconds']) ? (int)$h['duration_seconds'] : null,
        // snake_case aliases
        'campaign_name' => $h['campaign_name'] ?? '',
        'campaign_code' => $h['campaign_code'] ?? '',
        'started_at' => $h['started_at'] ?? null,
        'finished_at' => $h['finished_at'] ?? null,
        'percent_correct' => (float)($h['percent_correct'] ?? 0),
        'total_questions' => (int)($h['total_questions'] ?? 0),
    ];
}, $recalculatedHistory);

$orgPayload = $organization ? [
    'id' => (int)$organization['id'],
    'name' => $organization['name'],
    'inn' => $organization['inn'],
    'moderationStatus' => $organization['status'],
    'moderatorComment' => $organization['moderator_comment'],
    'isResubmitted' => !empty($organization['is_resubmitted']),
    'resubmittedAt' => $organization['resubmitted_at'] ?? null,
    'previousModeratorComment' => $organization['previous_moderator_comment'] ?? null,
    'level1' => $organization['level1_name'],
    'level2' => $organization['level2_name'],
] : null;

Http::json([
    'success' => true,
    'user' => [
        'id' => $userId,
        'email' => $user['email_normalized'] ?? '',
        'phone' => $user['phone_normalized'] ?? '',
        'lastName' => $user['last_name'] ?? '',
        'firstName' => $user['first_name'] ?? '',
        'middleName' => $user['middle_name'] ?? '',
        'position' => $user['position'] ?? '',
        'experienceLevel' => $user['experience_level'] ?? '',
        'education' => $user['education'] ?? '',
        'specialty' => $user['specialty'] ?? '',
        'customerLevel' => $user['customer_level'] ?? '',
        'districtId' => $user['district_id'] ?? null,
        'districtName' => $districtName,
        'districtOtherText' => $user['district_other_text'] ?? '',
        'role' => $user['role'] ?? 'participant',
        'regionId' => $regionId,
        'regionName' => $regionName,
        'authProvider' => $user['auth_provider'] ?? 'local',
        'pdpConsentAt' => $user['pdp_consent_at'] ?? null,
        'privacyPolicyConsentAt' => $user['privacy_policy_consent_at'] ?? null,
        'createdAt' => $user['created_at'] ?? null,
    ],
    'organization' => $orgPayload,
    'userOrgStatus' => $orgPayload['moderationStatus'] ?? null,
    'moderatorComment' => $orgPayload['moderatorComment'] ?? null,
    'previousModeratorComment' => $orgPayload['previousModeratorComment'] ?? null,
    'isResubmitted' => $orgPayload['isResubmitted'] ?? false,
    'resubmittedAt' => $orgPayload['resubmittedAt'] ?? null,
    'banners' => $mappedBanners,
    'regionBanners' => $mappedBanners,
    'campaign' => $mappedCampaign,
    'activeCampaign' => $mappedCampaign,
    'activeCampaigns' => $activeCampaigns,
    'canAttempt' => $canAttempt,
    'attemptBlockReason' => $attemptBlockReason,
    'canRequestRetake' => $canRequestRetake,
    'retakeRequest' => $retakeRequest,
    'lastResult' => $lastResult,
    'history' => $mappedHistory,
    'attemptsHistory' => $mappedHistory,
]);
