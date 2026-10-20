<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = Db::pdo();

if ($method === 'GET') {
    $admin = Auth::requireRole(['superadmin', 'region_admin', 'moderator', 'analyst']);
    
    $q = trim((string)($_GET['q'] ?? ''));
    $status = trim((string)($_GET['status'] ?? 'all'));
    $orgStatus = trim((string)($_GET['orgStatus'] ?? 'all'));
    $role = trim((string)($_GET['role'] ?? 'all'));
    $limit = min(200, max(1, (int)($_GET['limit'] ?? 50)));
    $offset = max(0, (int)($_GET['offset'] ?? 0));

    $where = ['1=1'];
    $params = [];

    if ($admin['role'] === 'region_admin') {
        if (!empty($admin['region_id'])) {
            $where[] = 'u.region_id = ?';
            $params[] = (int)$admin['region_id'];
        } else {
            $where[] = '1=0';
        }
    }

    if ($status !== '' && $status !== 'all') {
        $where[] = 'u.status = ?';
        $params[] = $status;
    }

    if ($role !== '' && $role !== 'all') {
        $where[] = 'u.role = ?';
        $params[] = $role;
    }

    if ($orgStatus !== '' && $orgStatus !== 'all') {
        if ($orgStatus === 'none') {
            $where[] = 'uo.id IS NULL';
        } else {
            $where[] = 'uo.status = ?';
            $params[] = $orgStatus;
        }
    }

    if ($q !== '') {
        $like = '%' . $q . '%';
        $where[] = '(u.last_name ILIKE ? OR u.first_name ILIKE ? OR u.middle_name ILIKE ? OR u.email_normalized ILIKE ? OR u.phone_normalized ILIKE ? OR o.name ILIKE ? OR o.inn ILIKE ?)';
        array_push($params, $like, $like, $like, $like, $like, $like, $like);
    }

    $sqlWhere = implode(' AND ', $where);

    // Total count
    $cntStmt = $pdo->prepare(
        "SELECT COUNT(DISTINCT u.id)
         FROM asmt_users u
         LEFT JOIN asmt_user_organizations uo ON uo.user_id = u.id
         LEFT JOIN asmt_organizations o ON o.id = uo.organization_id
         WHERE {$sqlWhere}"
    );
    $cntStmt->execute($params);
    $total = (int)$cntStmt->fetchColumn();

    // Fetch items with full registration details
    $itemsStmt = $pdo->prepare(
        "SELECT u.id, u.email_normalized, u.phone_normalized, u.last_name, u.first_name, u.middle_name,
                u.position, u.experience_level, u.education, u.specialty, u.customer_level AS user_customer_level,
                u.district_other_text, u.consent_pd_at, u.consent_privacy_at,
                u.role, u.status, u.created_at, u.last_login_at,
                reg.name AS region_name,
                d.name AS district_name,
                uo.id AS uo_id, uo.status AS user_org_status,
                uo.requested_at AS org_requested_at, uo.moderated_at, uo.moderator_comment,
                o.id AS org_id, o.name AS org_name, o.inn AS org_inn, o.customer_level AS org_customer_level,
                p2.name AS level2_name, p1.name AS level1_name,
                (SELECT COUNT(*) FROM asmt_attempts a WHERE a.user_id = u.id) AS attempts_count,
                (SELECT COUNT(*) FROM asmt_attempts a WHERE a.user_id = u.id AND a.percent_correct >= 70.0 AND a.status IN ('finished','abandoned','expired')) AS passed_count
         FROM asmt_users u
         LEFT JOIN asmt_user_organizations uo ON uo.id = (
             SELECT id FROM asmt_user_organizations sub WHERE sub.user_id = u.id ORDER BY requested_at DESC LIMIT 1
         )
         LEFT JOIN asmt_organizations o ON o.id = uo.organization_id
         LEFT JOIN asmt_organizations p2 ON p2.id = o.parent_id
         LEFT JOIN asmt_organizations p1 ON p1.id = p2.parent_id
         LEFT JOIN asmt_regions reg ON reg.id = u.region_id
         LEFT JOIN asmt_districts d ON d.id = u.district_id
         WHERE {$sqlWhere}
         ORDER BY u.id DESC
         LIMIT ? OFFSET ?"
    );
    $itemsParams = $params;
    $itemsParams[] = $limit;
    $itemsParams[] = $offset;
    $itemsStmt->execute($itemsParams);
    $rows = $itemsStmt->fetchAll();

    $canManage = in_array($admin['role'], ['superadmin', 'region_admin'], true);

    Http::json([
        'success' => true,
        'total' => $total,
        'canManage' => $canManage,
        'currentUserRole' => $admin['role'],
        'currentUserId' => (int)$admin['id'],
        'items' => array_map(static function($r) {
            return [
                'id' => (int)$r['id'],
                'email' => $r['email_normalized'],
                'phone' => $r['phone_normalized'],
                'lastName' => $r['last_name'],
                'firstName' => $r['first_name'],
                'middleName' => $r['middle_name'],
                'position' => $r['position'],
                'experienceLevel' => $r['experience_level'],
                'education' => $r['education'],
                'specialty' => $r['specialty'],
                'customerLevel' => $r['user_customer_level'],
                'districtOther' => $r['district_other_text'],
                'consentPdAt' => $r['consent_pd_at'],
                'consentPrivacyAt' => $r['consent_privacy_at'],
                'role' => $r['role'],
                'status' => $r['status'],
                'createdAt' => $r['created_at'],
                'lastLoginAt' => $r['last_login_at'],
                'regionName' => $r['region_name'],
                'districtName' => $r['district_name'],
                'organization' => !empty($r['org_id']) ? [
                    'id' => (int)$r['org_id'],
                    'name' => $r['org_name'],
                    'inn' => $r['org_inn'],
                    'status' => $r['user_org_status'],
                    'customerLevel' => $r['org_customer_level'],
                    'level1' => $r['level1_name'],
                    'level2' => $r['level2_name'],
                    'requestedAt' => $r['org_requested_at'],
                    'moderatedAt' => $r['moderated_at'],
                    'comment' => $r['moderator_comment'],
                ] : null,
                'attemptsCount' => (int)$r['attempts_count'],
                'passedCount' => (int)$r['passed_count'],
            ];
        }, $rows),
    ]);
}

if ($method === 'POST') {
    $admin = Auth::requireRole(['superadmin', 'region_admin', 'moderator']);
    $payload = Http::readJson();
    $action = trim((string)($payload['action'] ?? ''));
    $userId = (int)($payload['userId'] ?? 0);

    if ($userId <= 0) {
        Http::json(['success' => false, 'error' => 'Укажите userId'], 400);
    }

    $uStmt = $pdo->prepare('SELECT * FROM asmt_users WHERE id = ?');
    $uStmt->execute([$userId]);
    $targetUser = $uStmt->fetch();
    if (!$targetUser) {
        Http::json(['success' => false, 'error' => 'Пользователь не найден'], 404);
    }

    // Security checks:
    // 1. Не-суперадминам категорически запрещено управлять суперадминами
    if ($admin['role'] !== 'superadmin' && $targetUser['role'] === 'superadmin') {
        Http::json(['success' => false, 'error' => 'Запрещено управление главным администратором'], 403);
    }

    // 2. Ограничения для регионального администратора
    if ($admin['role'] === 'region_admin') {
        // Региональный админ может управлять только пользователями своего региона
        if (empty($admin['region_id']) || empty($targetUser['region_id']) || (int)$targetUser['region_id'] !== (int)$admin['region_id']) {
            Http::json(['success' => false, 'error' => 'Пользователь не относится к вашему региону'], 403);
        }

        // Региональный админ может управлять ТОЛЬКО обычными участниками (все, кто не participant, кроме себя, закрыты)
        if ($targetUser['role'] !== 'participant' && (int)$admin['id'] !== $userId) {
            Http::json(['success' => false, 'error' => 'Управление сотрудниками доступно только главному администратору'], 403);
        }
    }

    if ($action === 'toggle-block') {
        if (!in_array($admin['role'], ['superadmin', 'region_admin'], true)) {
            Http::json(['success' => false, 'error' => 'Недостаточно прав для блокировки пользователей'], 403);
        }

        if ((int)$admin['id'] === $userId) {
            Http::json(['success' => false, 'error' => 'Нельзя заблокировать свою учётную запись'], 400);
        }

        $newStatus = ($targetUser['status'] === 'active') ? 'blocked' : 'active';
        $pdo->prepare('UPDATE asmt_users SET status = ? WHERE id = ?')->execute([$newStatus, $userId]);

        $pdo->prepare(
            "INSERT INTO asmt_admin_audit (admin_user_id, action, entity, entity_id, meta_json)
             VALUES (?, ?, 'user', ?, ?::jsonb)"
        )->execute([
            (int)$admin['id'],
            'user_' . $newStatus,
            $userId,
            json_encode(['status' => $newStatus], JSON_UNESCAPED_UNICODE),
        ]);

        Http::json([
            'success' => true,
            'status' => $newStatus,
            'message' => ($newStatus === 'blocked') ? 'Пользователь заблокирован' : 'Пользователь разблокирован'
        ]);
    }

    if ($action === 'impersonate') {
        if (!in_array($admin['role'], ['superadmin', 'region_admin', 'moderator'], true)) {
            Http::json(['success' => false, 'error' => 'Недостаточно прав для входа под пользователем'], 403);
        }

        // КРИТИЧНО: Всем, кроме суперадмина, разрешен вход ТОЛЬКО под обычными участниками!
        if ($admin['role'] !== 'superadmin' && $targetUser['role'] !== 'participant') {
            Http::json(['success' => false, 'error' => 'Входить можно только под участниками'], 403);
        }

        if ($targetUser['status'] !== 'active') {
            Http::json(['success' => false, 'error' => 'Пользователь заблокирован. Разблокируйте перед входом.'], 400);
        }

        $adminId = (int)$admin['id'];
        $adminName = trim(($admin['last_name'] ?? '') . ' ' . ($admin['first_name'] ?? '')) ?: 'Администратор';

        Auth::login($targetUser);

        $_SESSION['asmt_impersonator_admin_id'] = $adminId;
        $_SESSION['asmt_impersonator_admin_name'] = $adminName;

        $pdo->prepare(
            "INSERT INTO asmt_admin_audit (admin_user_id, action, entity, entity_id, meta_json)
             VALUES (?, 'impersonate_login', 'user', ?, ?::jsonb)"
        )->execute([
            $adminId,
            $userId,
            json_encode(['target_user_email' => $targetUser['email_normalized']], JSON_UNESCAPED_UNICODE),
        ]);

        Http::json([
            'success' => true,
            'redirect' => 'cabinet.html',
            'message' => 'Вход под пользователем выполнен'
        ]);
    }

    if ($action === 'update') {
        if (!in_array($admin['role'], ['superadmin', 'region_admin'], true)) {
            Http::json(['success' => false, 'error' => 'Недостаточно прав для редактирования пользователей'], 403);
        }

        $lastName = trim((string)($payload['lastName'] ?? ''));
        $firstName = trim((string)($payload['firstName'] ?? ''));
        $middleName = trim((string)($payload['middleName'] ?? ''));
        $email = Auth::normalizeEmail((string)($payload['email'] ?? ''));
        $phone = Auth::normalizePhone((string)($payload['phone'] ?? ''));

        // Валидация обязательных полей и их длины
        if ($lastName === '' || $firstName === '') {
            Http::json(['success' => false, 'error' => 'Укажите фамилию и имя пользователя'], 400);
        }
        if (mb_strlen($lastName) > 120) {
            Http::json(['success' => false, 'error' => 'Фамилия не может быть длиннее 120 символов'], 400);
        }
        if (mb_strlen($firstName) > 120) {
            Http::json(['success' => false, 'error' => 'Имя не может быть длиннее 120 символов'], 400);
        }
        if (mb_strlen($middleName) > 120) {
            Http::json(['success' => false, 'error' => 'Отчество не может быть длиннее 120 символов'], 400);
        }
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Http::json(['success' => false, 'error' => 'Укажите корректный адрес электронной почты'], 400);
        }
        if (mb_strlen($email) > 255) {
            Http::json(['success' => false, 'error' => 'Email не может быть длиннее 255 символов'], 400);
        }
        if (strlen($phone) !== 11 || $phone[0] !== '7') {
            Http::json(['success' => false, 'error' => 'Укажите корректный номер телефона (10 или 11 цифр)'], 400);
        }

        // Проверка уникальности email среди других пользователей
        $chkEmail = $pdo->prepare('SELECT id FROM asmt_users WHERE email_normalized = ? AND id <> ? LIMIT 1');
        $chkEmail->execute([$email, $userId]);
        if ($chkEmail->fetch()) {
            Http::json(['success' => false, 'error' => 'Пользователь с таким email уже существует в системе'], 409);
        }

        // Проверка уникальности телефона среди других пользователей
        $chkPhone = $pdo->prepare('SELECT id FROM asmt_users WHERE phone_normalized = ? AND id <> ? LIMIT 1');
        $chkPhone->execute([$phone, $userId]);
        if ($chkPhone->fetch()) {
            Http::json(['success' => false, 'error' => 'Пользователь с таким номером телефона уже существует в системе'], 409);
        }

        $position = trim((string)($payload['position'] ?? ''));
        $experienceLevel = trim((string)($payload['experienceLevel'] ?? ''));
        $education = trim((string)($payload['education'] ?? ''));
        $specialty = trim((string)($payload['specialty'] ?? ''));
        $customerLevel = trim((string)($payload['customerLevel'] ?? ''));

        if (mb_strlen($position) > 255) {
            Http::json(['success' => false, 'error' => 'Должность не может быть длиннее 255 символов'], 400);
        }
        if (mb_strlen($experienceLevel) > 64) {
            Http::json(['success' => false, 'error' => 'Опыт работы не может быть длиннее 64 символов'], 400);
        }
        if (mb_strlen($education) > 255) {
            Http::json(['success' => false, 'error' => 'Образование не может быть длиннее 255 символов'], 400);
        }
        if (mb_strlen($specialty) > 255) {
            Http::json(['success' => false, 'error' => 'Специальность не может быть длиннее 255 символов'], 400);
        }
        if (mb_strlen($customerLevel) > 64) {
            Http::json(['success' => false, 'error' => 'Уровень заказчика не может быть длиннее 64 символов'], 400);
        }

        // Роль
        $role = trim((string)($payload['role'] ?? ''));
        $allowedRoles = ['participant', 'moderator', 'region_admin', 'analyst', 'superadmin'];
        if ($role === '' || !in_array($role, $allowedRoles, true)) {
            $role = (string)$targetUser['role'];
        }

        // Ограничения по ролям:
        // Только суперадмин может создавать и редактировать администраторов и персонал (superadmin, region_admin, moderator, analyst)
        if ($admin['role'] !== 'superadmin') {
            if ($role !== 'participant' && $targetUser['role'] !== $role) {
                Http::json(['success' => false, 'error' => 'Региональный администратор может назначать только роль участника'], 403);
            }
            if ($targetUser['role'] !== 'participant' && (int)$admin['id'] !== $userId) {
                Http::json(['success' => false, 'error' => 'Редактировать персонал может только главный администратор'], 403);
            }
        }
        if ((int)$admin['id'] === $userId && $role !== $admin['role']) {
            Http::json(['success' => false, 'error' => 'Вы не можете изменить свою собственную роль'], 400);
        }

        // Статус
        $status = trim((string)($payload['status'] ?? ''));
        if (!in_array($status, ['active', 'blocked'], true)) {
            $status = (string)$targetUser['status'];
        }
        if ((int)$admin['id'] === $userId && $status === 'blocked') {
            Http::json(['success' => false, 'error' => 'Вы не можете заблокировать свою учётную запись'], 400);
        }

        // Новый пароль (если передан)
        $newPassword = trim((string)($payload['newPassword'] ?? ''));
        $passwordUpdateSql = '';
        $updateParams = [
            $lastName,
            $firstName,
            $middleName,
            $email,
            $phone,
            $position,
            $experienceLevel,
            $education,
            $specialty,
            $customerLevel,
            $role,
            $status,
        ];

        if ($newPassword !== '') {
            if (mb_strlen($newPassword) < 6) {
                Http::json(['success' => false, 'error' => 'Новый пароль должен содержать минимум 6 символов'], 400);
            }
            $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);
            $passwordUpdateSql = ', password_hash = ?';
            $updateParams[] = $passwordHash;
        }

        $updateParams[] = $userId;

        // Фиксация старых и новых значений для журнала аудита
        $changes = [];
        $fieldsToTrack = [
            'last_name' => [$targetUser['last_name'], $lastName],
            'first_name' => [$targetUser['first_name'], $firstName],
            'middle_name' => [$targetUser['middle_name'], $middleName],
            'email_normalized' => [$targetUser['email_normalized'], $email],
            'phone_normalized' => [$targetUser['phone_normalized'], $phone],
            'position' => [$targetUser['position'], $position],
            'experience_level' => [$targetUser['experience_level'], $experienceLevel],
            'education' => [$targetUser['education'], $education],
            'specialty' => [$targetUser['specialty'], $specialty],
            'customer_level' => [$targetUser['customer_level'], $customerLevel],
            'role' => [$targetUser['role'], $role],
            'status' => [$targetUser['status'], $status],
        ];

        foreach ($fieldsToTrack as $field => [$oldVal, $newVal]) {
            if ((string)$oldVal !== (string)$newVal) {
                $changes[$field] = ['old' => (string)$oldVal, 'new' => (string)$newVal];
            }
        }
        if ($newPassword !== '') {
            $changes['password'] = ['changed' => true];
        }

        // Выполняем обновление в транзакции
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare(
                "UPDATE asmt_users
                 SET last_name = ?,
                     first_name = ?,
                     middle_name = ?,
                     email_normalized = ?,
                     phone_normalized = ?,
                     position = ?,
                     experience_level = ?,
                     education = ?,
                     specialty = ?,
                     customer_level = ?,
                     role = ?,
                     status = ?
                     {$passwordUpdateSql}
                 WHERE id = ?"
            );
            $stmt->execute($updateParams);

            // Если пароль изменен — отзываем все активные одноразовые токены пользователя
            if ($newPassword !== '') {
                $pdo->prepare('UPDATE asmt_auth_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL')
                    ->execute([$userId]);
            }

            // Аудит с детальным логом изменений
            $pdo->prepare(
                "INSERT INTO asmt_admin_audit (admin_user_id, action, entity, entity_id, meta_json)
                 VALUES (?, 'user_update', 'user', ?, ?::jsonb)"
            )->execute([
                (int)$admin['id'],
                $userId,
                json_encode([
                    'changes' => $changes,
                    'target_email' => $email,
                ], JSON_UNESCAPED_UNICODE),
            ]);

            $pdo->commit();

            // Если администратор изменил пароль своей собственной учетной записи —
            // обновляем отпечаток в текущей сессии, чтобы его не выкинуло из системы
            if ((int)$admin['id'] === $userId && $newPassword !== '') {
                Auth::updateSessionPasswordHash($passwordHash);
            }
        } catch (\Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }

        Http::json([
            'success' => true,
            'message' => 'Данные пользователя успешно обновлены',
        ]);
    }

    if ($action === 'retake-info') {
        if (!in_array($admin['role'], ['superadmin', 'region_admin', 'moderator'], true)) {
            Http::json(['success' => false, 'error' => 'Недостаточно прав'], 403);
        }

        $stmt = $pdo->prepare(
            "SELECT DISTINCT ON (a.campaign_id)
                    a.campaign_id,
                    c.name AS campaign_name,
                    a.id AS attempt_id,
                    a.status AS attempt_status,
                    a.score,
                    a.total_questions,
                    a.percent_correct,
                    a.finished_at,
                    a.started_at,
                    r.id AS retake_id,
                    r.status AS retake_status,
                    r.reason AS retake_reason,
                    r.admin_comment,
                    r.created_at AS retake_created_at
             FROM asmt_attempts a
             JOIN asmt_campaigns c ON c.id = a.campaign_id
             LEFT JOIN LATERAL (
                 SELECT rr.*
                 FROM asmt_retake_requests rr
                 WHERE rr.user_id = a.user_id AND rr.campaign_id = a.campaign_id
                   AND rr.status IN ('pending', 'approved', 'rejected')
                 ORDER BY rr.id DESC
                 LIMIT 1
             ) r ON TRUE
             WHERE a.user_id = ?
               AND a.status IN ('finished', 'abandoned', 'expired')
             ORDER BY a.campaign_id, a.id DESC"
        );
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll();

        Http::json([
            'success' => true,
            'items' => array_map(static function ($r) {
                $retakeStatus = $r['retake_status'] ?? null;
                $canGrant = !in_array($retakeStatus, ['pending', 'approved'], true);
                return [
                    'campaignId' => (int)$r['campaign_id'],
                    'campaignName' => $r['campaign_name'],
                    'attemptId' => (int)$r['attempt_id'],
                    'attemptStatus' => $r['attempt_status'],
                    'score' => $r['score'] !== null ? (int)$r['score'] : null,
                    'totalQuestions' => $r['total_questions'] !== null ? (int)$r['total_questions'] : null,
                    'percentCorrect' => $r['percent_correct'] !== null ? (float)$r['percent_correct'] : null,
                    'finishedAt' => $r['finished_at'],
                    'startedAt' => $r['started_at'],
                    'retakeId' => $r['retake_id'] !== null ? (int)$r['retake_id'] : null,
                    'retakeStatus' => $retakeStatus,
                    'retakeReason' => $r['retake_reason'],
                    'adminComment' => $r['admin_comment'],
                    'retakeCreatedAt' => $r['retake_created_at'],
                    'canGrant' => $canGrant,
                ];
            }, $rows),
        ]);
    }

    if ($action === 'grant-retake') {
        if (!in_array($admin['role'], ['superadmin', 'region_admin', 'moderator'], true)) {
            Http::json(['success' => false, 'error' => 'Недостаточно прав'], 403);
        }

        $campaignId = (int)($payload['campaignId'] ?? 0);
        $comment = trim((string)($payload['comment'] ?? ''));
        if ($campaignId <= 0) {
            Http::json(['success' => false, 'error' => 'Укажите campaignId'], 400);
        }

        $camp = $pdo->prepare('SELECT id, name FROM asmt_campaigns WHERE id = ?');
        $camp->execute([$campaignId]);
        if (!$camp->fetch()) {
            Http::json(['success' => false, 'error' => 'Кампания не найдена'], 404);
        }

        $att = $pdo->prepare(
            "SELECT id FROM asmt_attempts
             WHERE user_id = ? AND campaign_id = ?
               AND status IN ('finished', 'abandoned', 'expired')
             ORDER BY id DESC LIMIT 1"
        );
        $att->execute([$userId, $campaignId]);
        $lastAttempt = $att->fetch();
        if (!$lastAttempt) {
            Http::json(['success' => false, 'error' => 'Нет завершённой попытки по этой кампании'], 400);
        }

        $existing = $pdo->prepare(
            "SELECT id, status FROM asmt_retake_requests
             WHERE user_id = ? AND campaign_id = ?
               AND status IN ('pending', 'approved', 'rejected')
             ORDER BY id DESC LIMIT 1"
        );
        $existing->execute([$userId, $campaignId]);
        $existRow = $existing->fetch();

        if ($existRow && $existRow['status'] === 'approved') {
            Http::json([
                'success' => true,
                'alreadyGranted' => true,
                'id' => (int)$existRow['id'],
                'status' => 'approved',
                'message' => 'Повторное прохождение уже разрешено',
            ]);
        }

        if ($existRow && $existRow['status'] === 'pending') {
            Http::json([
                'success' => false,
                'error' => 'У участника уже есть заявка на рассмотрении. Одобрите её в разделе «Запросы».',
            ], 409);
        }

        $adminComment = $comment !== ''
            ? $comment
            : 'Разрешено администратором из реестра пользователей';

        try {
            $pdo->beginTransaction();

            // Clear rejected blocker (and any stale pending) so a fresh approved row can exist
            $pdo->prepare(
                "UPDATE asmt_retake_requests
                 SET status = 'voided',
                     admin_comment = COALESCE(NULLIF(?, ''), admin_comment),
                     reviewed_by = ?,
                     reviewed_at = NOW()
                 WHERE user_id = ? AND campaign_id = ?
                   AND status IN ('pending', 'rejected')"
            )->execute([$adminComment, (int)$admin['id'], $userId, $campaignId]);

            $ins = $pdo->prepare(
                "INSERT INTO asmt_retake_requests
                    (user_id, campaign_id, attempt_id, reason, status, admin_comment, reviewed_by, reviewed_at)
                 VALUES (?, ?, ?, ?, 'approved', ?, ?, NOW())
                 RETURNING id"
            );
            $ins->execute([
                $userId,
                $campaignId,
                (int)$lastAttempt['id'],
                'Разрешение выдано администратором (без повторной заявки участника)',
                $adminComment,
                (int)$admin['id'],
            ]);
            $newId = (int)$ins->fetchColumn();

            $pdo->prepare(
                "INSERT INTO asmt_admin_audit (admin_user_id, action, entity, entity_id, meta_json)
                 VALUES (?, 'grant_retake', 'user', ?, ?::jsonb)"
            )->execute([
                (int)$admin['id'],
                $userId,
                json_encode([
                    'campaign_id' => $campaignId,
                    'retake_id' => $newId,
                    'attempt_id' => (int)$lastAttempt['id'],
                ], JSON_UNESCAPED_UNICODE),
            ]);

            $pdo->commit();
        } catch (\Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            Http::logError('admin_users_grant_retake_failed', $e, (int)$admin['id']);
            Http::json(['success' => false, 'error' => 'Не удалось выдать повторный доступ'], 500);
        }

        Http::json([
            'success' => true,
            'id' => $newId,
            'status' => 'approved',
            'message' => 'Повторное прохождение разрешено. Участник может начать тест в кабинете.',
        ]);
    }

    Http::json(['success' => false, 'error' => 'Неизвестное действие'], 400);
}

Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
