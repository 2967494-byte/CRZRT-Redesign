<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$user = Auth::requireRole(['superadmin', 'region_admin', 'moderator', 'analyst']);
$pdo = Db::pdo();

// --------------------------------------------------------------------------
// 1. Системные ресурсы сервера (System Resources)
// --------------------------------------------------------------------------
function getServerResources(PDO $pdo): array
{
    // Дисковое пространство
    $dir = __DIR__;
    $diskTotal = @disk_total_space($dir) ?: 0;
    $diskFree = @disk_free_space($dir) ?: 0;
    $diskUsed = max(0, $diskTotal - $diskFree);
    $diskPercent = $diskTotal > 0 ? round(($diskUsed / $diskTotal) * 100, 1) : 0;

    // Оперативная память (RAM)
    $memTotal = 0;
    $memFree = 0;
    $memAvailable = 0;
    $memUsed = 0;
    $memPercent = 0;

    if (@is_readable('/proc/meminfo')) {
        $memInfo = @file_get_contents('/proc/meminfo') ?: '';
        if (preg_match('/MemTotal:\s+(\d+)\s+kB/i', $memInfo, $mTotal)) {
            $memTotal = (int)$mTotal[1] * 1024;
        }
        if (preg_match('/MemAvailable:\s+(\d+)\s+kB/i', $memInfo, $mAvail)) {
            $memAvailable = (int)$mAvail[1] * 1024;
        } elseif (preg_match('/MemFree:\s+(\d+)\s+kB/i', $memInfo, $mFree)) {
            $memAvailable = (int)$mFree[1] * 1024;
        }
        if ($memTotal > 0) {
            $memUsed = max(0, $memTotal - $memAvailable);
            $memPercent = round(($memUsed / $memTotal) * 100, 1);
        }
    } else {
        // Fallback (Windows / restricted env)
        $memUsed = memory_get_usage(true);
        $memTotal = 4 * 1024 * 1024 * 1024; // 4 GB fallback
        $memPercent = round(($memUsed / $memTotal) * 100, 1);
    }

    // Процессор (CPU)
    $cpuCores = 1;
    if (@is_readable('/proc/cpuinfo')) {
        $cpuInfo = @file_get_contents('/proc/cpuinfo') ?: '';
        $matches = [];
        preg_match_all('/^processor\s*:\s*\d+/m', $cpuInfo, $matches);
        if (!empty($matches[0])) {
            $cpuCores = count($matches[0]);
        }
    } elseif (getenv('NUMBER_OF_PROCESSORS')) {
        $cpuCores = max(1, (int)getenv('NUMBER_OF_PROCESSORS'));
    }

    $cpuLoad = [0.0, 0.0, 0.0];
    if (function_exists('sys_getloadavg')) {
        $load = sys_getloadavg();
        if (is_array($load) && count($load) >= 3) {
            $cpuLoad = [
                round((float)$load[0], 2),
                round((float)$load[1], 2),
                round((float)$load[2], 2),
            ];
        }
    }

    $cpuPercent = round(min(100.0, ($cpuLoad[0] / max(1, $cpuCores)) * 100), 1);

    // Uptime
    $uptimeSec = 0;
    if (@is_readable('/proc/uptime')) {
        $up = @file_get_contents('/proc/uptime') ?: '';
        $parts = explode(' ', trim($up));
        $uptimeSec = (int)floatval($parts[0] ?? 0);
    }

    // Информация о БД
    $dbSize = '—';
    $dbVersion = 'PostgreSQL';
    $dbConnections = 0;
    try {
        $dbSize = (string)$pdo->query("SELECT pg_size_pretty(pg_database_size(current_database()))")->fetchColumn();
        $dbVersionRaw = (string)$pdo->query("SHOW server_version")->fetchColumn();
        if ($dbVersionRaw) {
            $dbVersion = 'PostgreSQL ' . $dbVersionRaw;
        }
        $dbConnections = (int)$pdo->query("SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()")->fetchColumn();
    } catch (\Throwable $_) {}

    return [
        'cpu' => [
            'cores' => $cpuCores,
            'percent' => $cpuPercent,
            'load1' => $cpuLoad[0],
            'load5' => $cpuLoad[1],
            'load15' => $cpuLoad[2],
        ],
        'ram' => [
            'totalBytes' => $memTotal,
            'usedBytes' => $memUsed,
            'freeBytes' => max(0, $memTotal - $memUsed),
            'percent' => $memPercent,
            'phpUsageBytes' => memory_get_usage(true),
        ],
        'disk' => [
            'totalBytes' => $diskTotal,
            'usedBytes' => $diskUsed,
            'freeBytes' => $diskFree,
            'percent' => $diskPercent,
        ],
        'env' => [
            'phpVersion' => PHP_VERSION,
            'os' => PHP_OS_FAMILY . ' (' . php_uname('s') . ')',
            'serverSoftware' => $_SERVER['SERVER_SOFTWARE'] ?? 'Nginx / PHP-FPM',
            'uptimeSeconds' => $uptimeSec,
            'dbSize' => $dbSize,
            'dbVersion' => $dbVersion,
            'dbConnections' => $dbConnections,
            'serverTime' => date('Y-m-d H:i:s'),
        ],
    ];
}

// --------------------------------------------------------------------------
// 2. Сессии тестирования в реальном времени (Active Live Sessions)
// --------------------------------------------------------------------------
function getLiveSessions(PDO $pdo, ?int $regionId = null): array
{
    $where = ["a.status = 'in_progress'", "a.expires_at > NOW()"];
    $params = [];
    if ($regionId === -1) {
        $where[] = "1=0";
    } elseif ($regionId !== null) {
        $where[] = "u.region_id = ?";
        $params[] = $regionId;
    }
    $whereSql = implode(' AND ', $where);

    $sql = "SELECT a.id, a.user_id, a.campaign_id, a.started_at, a.expires_at, a.total_questions,
                   a.disconnect_count, a.last_ping_at,
                   u.last_name, u.first_name, u.middle_name, u.email_normalized, u.phone_normalized,
                   o.name AS org_name, o.inn AS org_inn,
                   c.name AS campaign_name,
                   reg.name AS region_name,
                   (SELECT COUNT(*) FROM asmt_attempt_answers aa WHERE aa.attempt_id = a.id AND aa.option_letter_chosen IS NOT NULL) AS answered_count
            FROM asmt_attempts a
            JOIN asmt_users u ON u.id = a.user_id
            JOIN asmt_campaigns c ON c.id = a.campaign_id
            LEFT JOIN asmt_user_organizations uo ON uo.id = (
                SELECT id FROM asmt_user_organizations sub WHERE sub.user_id = u.id ORDER BY requested_at DESC LIMIT 1
            )
            LEFT JOIN asmt_organizations o ON o.id = uo.organization_id
            LEFT JOIN asmt_regions reg ON reg.id = u.region_id
            WHERE {$whereSql}
            ORDER BY a.started_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $now = time();
    $sessions = [];
    foreach ($rows as $r) {
        $expTs = strtotime((string)$r['expires_at']);
        $remainSec = max(0, $expTs - $now);
        $totalQ = max(1, (int)$r['total_questions']);
        $ansQ = (int)$r['answered_count'];
        $progressPct = round(($ansQ / $totalQ) * 100, 1);

        $lastPingTs = $r['last_ping_at'] ? strtotime((string)$r['last_ping_at']) : null;
        $isOnline = $lastPingTs ? (($now - $lastPingTs) <= 75) : true;

        $sessions[] = [
            'attemptId' => (int)$r['id'],
            'userId' => (int)$r['user_id'],
            'userName' => trim(($r['last_name'] ?? '') . ' ' . ($r['first_name'] ?? '') . ' ' . ($r['middle_name'] ?? '')),
            'email' => $r['email_normalized'],
            'phone' => $r['phone_normalized'],
            'orgName' => $r['org_name'] ?: 'Без организации',
            'orgInn' => $r['org_inn'],
            'campaignName' => $r['campaign_name'],
            'regionName' => $r['region_name'] ?: '—',
            'startedAt' => $r['started_at'],
            'expiresAt' => $r['expires_at'],
            'remainingSeconds' => $remainSec,
            'totalQuestions' => $totalQ,
            'answeredCount' => $ansQ,
            'progressPercent' => $progressPct,
            'disconnectCount' => (int)$r['disconnect_count'],
            'lastPingAt' => $r['last_ping_at'],
            'isOnline' => $isOnline,
        ];
    }

    return $sessions;
}

// --------------------------------------------------------------------------
// 3. Бизнес-показатели и сводная статистика (KPIs & Totals)
// --------------------------------------------------------------------------
function getPlatformKPIs(PDO $pdo, ?int $regionId = null): array
{
    if ($regionId === -1) {
        $regionFilterUsers = " WHERE 1=0";
        $regionFilterUserAnd = " AND 1=0";
    } elseif ($regionId !== null) {
        $regionFilterUsers = " WHERE region_id = " . (int)$regionId;
        $regionFilterUserAnd = " AND u.region_id = " . (int)$regionId;
    } else {
        $regionFilterUsers = "";
        $regionFilterUserAnd = "";
    }

    // Пользователи
    $uRow = $pdo->query("SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'active') AS active,
        COUNT(*) FILTER (WHERE status = 'blocked') AS blocked,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') AS new_24h,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS new_7d
    FROM asmt_users{$regionFilterUsers}")->fetch() ?: [];

    // Организации
    $oRow = $pdo->query("SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'approved') AS approved,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
        COUNT(*) FILTER (WHERE status = 'needs_info') AS needs_info
    FROM asmt_organizations")->fetch() ?: [];

    // Тестирования
    $aRow = $pdo->query("SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE a.status = 'in_progress' AND a.expires_at > NOW()) AS in_progress,
        COUNT(*) FILTER (WHERE a.status = 'finished') AS finished,
        COUNT(*) FILTER (WHERE a.status = 'expired') AS expired,
        COUNT(*) FILTER (WHERE a.status = 'abandoned') AS abandoned,
        COUNT(*) FILTER (WHERE a.percent_correct >= 70.0 AND a.status IN ('finished', 'abandoned', 'expired')) AS passed,
        COUNT(*) FILTER (WHERE a.percent_correct < 70.0 AND a.status IN ('finished', 'abandoned', 'expired')) AS failed,
        AVG(a.percent_correct) FILTER (WHERE a.status IN ('finished', 'abandoned', 'expired')) AS avg_percent,
        AVG(a.duration_seconds) FILTER (WHERE a.status = 'finished' AND a.duration_seconds > 0) AS avg_duration_sec
    FROM asmt_attempts a
    JOIN asmt_users u ON u.id = a.user_id
    WHERE 1=1{$regionFilterUserAnd}")->fetch() ?: [];

    $finishedTotal = ((int)($aRow['passed'] ?? 0)) + ((int)($aRow['failed'] ?? 0));
    $passRate = $finishedTotal > 0 ? round((((int)$aRow['passed']) / $finishedTotal) * 100, 1) : 0;

    // Очереди заявок
    $pendingModeration = (int)$pdo->query("SELECT COUNT(*) FROM asmt_user_organizations uo JOIN asmt_users u ON u.id = uo.user_id WHERE uo.status = 'pending'{$regionFilterUserAnd}")->fetchColumn();
    $pendingRetakes = (int)$pdo->query("SELECT COUNT(*) FROM asmt_retake_requests r JOIN asmt_users u ON u.id = r.user_id WHERE r.status = 'pending'{$regionFilterUserAnd}")->fetchColumn();

    $mailSent24h = 0;
    try {
        $mailSent24h = (int)$pdo->query(
            "SELECT COUNT(*) FROM asmt_mail_queue WHERE status = 'sent' AND (sent_at >= NOW() - INTERVAL '24 hours' OR (sent_at IS NULL AND created_at >= NOW() - INTERVAL '24 hours'))"
        )->fetchColumn();
    } catch (\Throwable $_) {}

    return [
        'users' => [
            'total' => (int)($uRow['total'] ?? 0),
            'active' => (int)($uRow['active'] ?? 0),
            'blocked' => (int)($uRow['blocked'] ?? 0),
            'new24h' => (int)($uRow['new_24h'] ?? 0),
            'new7d' => (int)($uRow['new_7d'] ?? 0),
        ],
        'organizations' => [
            'total' => (int)($oRow['total'] ?? 0),
            'approved' => (int)($oRow['approved'] ?? 0),
            'pending' => (int)($oRow['pending'] ?? 0),
            'rejected' => (int)($oRow['rejected'] ?? 0),
            'needsInfo' => (int)($oRow['needs_info'] ?? 0),
        ],
        'attempts' => [
            'total' => (int)($aRow['total'] ?? 0),
            'inProgress' => (int)($aRow['in_progress'] ?? 0),
            'finished' => (int)($aRow['finished'] ?? 0),
            'expired' => (int)($aRow['expired'] ?? 0),
            'abandoned' => (int)($aRow['abandoned'] ?? 0),
            'passed' => (int)($aRow['passed'] ?? 0),
            'failed' => (int)($aRow['failed'] ?? 0),
            'passRate' => $passRate,
            'avgPercent' => round((float)($aRow['avg_percent'] ?? 0), 1),
            'avgDurationSeconds' => (int)round((float)($aRow['avg_duration_sec'] ?? 0)),
        ],
        'queues' => [
            'pendingModeration' => $pendingModeration,
            'pendingRetakes' => $pendingRetakes,
            'mailSent24h' => $mailSent24h,
        ],
    ];
}

// --------------------------------------------------------------------------
// 4. Динамика тестов по дням за последние 14 дней (Daily Trends)
// --------------------------------------------------------------------------
function getDailyTrends(PDO $pdo, ?int $regionId = null): array
{
    if ($regionId === -1) {
        $regionFilter = " AND 1=0";
    } elseif ($regionId !== null) {
        $regionFilter = " AND u.region_id = " . (int)$regionId;
    } else {
        $regionFilter = "";
    }

    $sql = "SELECT date_trunc('day', a.finished_at)::date AS day,
                   COUNT(*) AS total_finished,
                   COUNT(*) FILTER (WHERE a.percent_correct >= 70.0) AS passed,
                   COUNT(*) FILTER (WHERE a.percent_correct < 70.0) AS failed,
                   ROUND(AVG(a.percent_correct)::numeric, 1) AS avg_percent,
                   ROUND(AVG(a.duration_seconds)::numeric, 0) AS avg_duration_sec
            FROM asmt_attempts a
            JOIN asmt_users u ON u.id = a.user_id
            WHERE a.status IN ('finished', 'abandoned', 'expired')
              AND a.finished_at >= NOW() - INTERVAL '14 days'{$regionFilter}
            GROUP BY 1
            ORDER BY 1 ASC";

    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll();

    // Также соберем регистрации новых участников по дням
    $uSql = "SELECT date_trunc('day', created_at)::date AS day, COUNT(*) AS count
             FROM asmt_users
             WHERE created_at >= NOW() - INTERVAL '14 days'
             GROUP BY 1 ORDER BY 1 ASC";
    $uStmt = $pdo->query($uSql);
    $uMap = [];
    foreach ($uStmt->fetchAll() as $ur) {
        $uMap[$ur['day']] = (int)$ur['count'];
    }

    $days = [];
    foreach ($rows as $r) {
        $d = (string)$r['day'];
        $days[] = [
            'date' => $d,
            'total' => (int)$r['total_finished'],
            'passed' => (int)$r['passed'],
            'failed' => (int)$r['failed'],
            'avgPercent' => (float)$r['avg_percent'],
            'avgDurationSec' => (int)$r['avg_duration_sec'],
            'newUsers' => $uMap[$d] ?? 0,
        ];
    }

    return $days;
}

// --------------------------------------------------------------------------
// 5. Топ кампаний и региональный срез
// --------------------------------------------------------------------------
function getCampaignsAndRegions(PDO $pdo, ?int $regionId = null): array
{
    $cSql = "SELECT c.id, c.name,
                    COUNT(a.id) AS total_attempts,
                    COUNT(a.id) FILTER (WHERE a.percent_correct >= 70.0 AND a.status IN ('finished', 'abandoned', 'expired')) AS passed,
                    ROUND(AVG(a.percent_correct)::numeric, 1) AS avg_percent
             FROM asmt_campaigns c
             LEFT JOIN asmt_attempts a ON a.campaign_id = c.id
             GROUP BY c.id, c.name
             ORDER BY total_attempts DESC";
    $campaigns = $pdo->query($cSql)->fetchAll();

    $rSql = "SELECT reg.id, reg.name,
                    COUNT(DISTINCT u.id) AS users_count,
                    COUNT(a.id) AS attempts_count,
                    COUNT(a.id) FILTER (WHERE a.percent_correct >= 70.0 AND a.status IN ('finished', 'abandoned', 'expired')) AS passed,
                    ROUND(AVG(a.percent_correct)::numeric, 1) AS avg_percent
             FROM asmt_regions reg
             LEFT JOIN asmt_users u ON u.region_id = reg.id
             LEFT JOIN asmt_attempts a ON a.user_id = u.id
             GROUP BY reg.id, reg.name
             HAVING COUNT(DISTINCT u.id) > 0
             ORDER BY attempts_count DESC, users_count DESC
             LIMIT 6";
    $regions = $pdo->query($rSql)->fetchAll();

    return [
        'campaigns' => array_map(static fn($c) => [
            'id' => (int)$c['id'],
            'name' => $c['name'],
            'total' => (int)$c['total_attempts'],
            'passed' => (int)$c['passed'],
            'avgPercent' => (float)($c['avg_percent'] ?? 0),
        ], $campaigns),
        'topRegions' => array_map(static fn($r) => [
            'id' => (int)$r['id'],
            'name' => $r['name'],
            'users' => (int)$r['users_count'],
            'attempts' => (int)$r['attempts_count'],
            'passed' => (int)$r['passed'],
            'avgPercent' => (float)($r['avg_percent'] ?? 0),
        ], $regions),
    ];
}

// --------------------------------------------------------------------------
// Ответ контроллера
// --------------------------------------------------------------------------
$regionFilterId = null;
if ($user['role'] === 'region_admin') {
    $regionFilterId = !empty($user['region_id']) ? (int)$user['region_id'] : -1;
}

$isSuperAdmin = ($user['role'] === 'superadmin');
$serverResources = $isSuperAdmin ? getServerResources($pdo) : null;
$liveSessions = getLiveSessions($pdo, $regionFilterId);
$kpis = getPlatformKPIs($pdo, $regionFilterId);
$dailyTrends = getDailyTrends($pdo, $regionFilterId);
$extraStats = getCampaignsAndRegions($pdo, $regionFilterId);

$regruBalance = null;
if ($isSuperAdmin && class_exists('Asmt\RegRuService')) {
    $forceRegru = isset($_GET['refresh_regru']);
    $regruBalance = \Asmt\RegRuService::getBalance($forceRegru);
}

Http::json([
    'success' => true,
    'server' => $serverResources,
    'live' => [
        'count' => count($liveSessions),
        'sessions' => $liveSessions,
    ],
    'kpis' => $kpis,
    'dailyTrends' => $dailyTrends,
    'extra' => $extraStats,
    'regru' => $regruBalance,
    'userRole' => $user['role'],
    'timestamp' => date('c'),
]);

