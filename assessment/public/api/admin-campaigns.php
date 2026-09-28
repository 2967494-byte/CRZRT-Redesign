<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$user = Auth::requireRole(['superadmin', 'region_admin']);
$pdo = Db::pdo();

if ($method === 'GET') {
    $stmt = $pdo->query('
        SELECT c.*, r.name AS region_name,
               to_char(c.starts_at AT TIME ZONE \'Europe/Moscow\', \'YYYY-MM-DD"T"HH24:MI\') AS starts_at_msk,
               to_char(c.ends_at AT TIME ZONE \'Europe/Moscow\', \'YYYY-MM-DD"T"HH24:MI\') AS ends_at_msk,
               (SELECT COUNT(*) FROM asmt_attempts a WHERE a.campaign_id = c.id) AS total_attempts
        FROM asmt_campaigns c
        LEFT JOIN asmt_regions r ON r.id = c.region_id
        ORDER BY c.created_at DESC
    ');
    $campaigns = $stmt->fetchAll();

    $regStmt = $pdo->query('SELECT id, code, name FROM asmt_regions WHERE is_active = TRUE ORDER BY name');
    $regions = $regStmt->fetchAll();

    Http::json([
        'success' => true,
        'regions' => array_map(static function ($r) {
            return [
                'id' => (int)$r['id'],
                'code' => $r['code'],
                'name' => $r['name'],
            ];
        }, $regions),
        'campaigns' => array_map(static function ($c) {
            return [
                'id' => (int)$c['id'],
                'code' => $c['code'],
                'name' => $c['name'],
                'regionId' => $c['region_id'] ? (int)$c['region_id'] : null,
                'regionName' => $c['region_name'] ?? 'Все регионы',
                'startsAt' => $c['starts_at_msk'],
                'endsAt' => $c['ends_at_msk'],
                'timeLimitMinutes' => (int)$c['time_limit_minutes'],
                'questionsPerAttempt' => (int)$c['questions_per_attempt'],
                'poolSize' => (int)$c['pool_size'],
                'isActive' => (bool)$c['is_active'],
                'totalAttempts' => (int)$c['total_attempts'],
                'createdAt' => $c['created_at'],
            ];
        }, $campaigns),
    ]);
}

if ($method === 'POST') {
    $payload = Http::readJson();
    $id = isset($payload['id']) ? (int)$payload['id'] : 0;
    $code = trim((string)($payload['code'] ?? ''));
    $name = trim((string)($payload['name'] ?? ''));
    $regionId = isset($payload['regionId']) && (int)$payload['regionId'] > 0 ? (int)$payload['regionId'] : null;
    $timeLimit = max(1, (int)($payload['timeLimitMinutes'] ?? 90));
    $questionsPerAttempt = max(1, (int)($payload['questionsPerAttempt'] ?? 40));
    $poolSize = max(1, (int)($payload['poolSize'] ?? 100));
    $isActive = !empty($payload['isActive']);
    $startsAt = !empty($payload['startsAt']) ? $payload['startsAt'] : null;
    $endsAt = !empty($payload['endsAt']) ? $payload['endsAt'] : null;

    if ($code === '' || $name === '') {
        Http::json(['success' => false, 'error' => 'Заполните код и наименование кампании'], 400);
    }

    $dtPattern = '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/';
    foreach ([$startsAt, $endsAt] as $dt) {
        if ($dt !== null && !preg_match($dtPattern, (string)$dt)) {
            Http::json(['success' => false, 'error' => 'Некорректный формат даты проведения'], 400);
        }
    }
    if ($startsAt !== null && $endsAt !== null && strcmp((string)$startsAt, (string)$endsAt) >= 0) {
        Http::json(['success' => false, 'error' => 'Дата окончания должна быть позже даты начала'], 400);
    }

    if ($id > 0) {
        $stmt = $pdo->prepare('
            UPDATE asmt_campaigns SET
                code = ?,
                name = ?,
                region_id = ?,
                time_limit_minutes = ?,
                questions_per_attempt = ?,
                pool_size = ?,
                is_active = ?,
                starts_at = CAST(? AS timestamp) AT TIME ZONE \'Europe/Moscow\',
                ends_at = CAST(? AS timestamp) AT TIME ZONE \'Europe/Moscow\'
            WHERE id = ?
        ');
        $stmt->execute([
            $code,
            $name,
            $regionId,
            $timeLimit,
            $questionsPerAttempt,
            $poolSize,
            $isActive ? 'true' : 'false',
            $startsAt,
            $endsAt,
            $id,
        ]);
    } else {
        $stmt = $pdo->prepare('
            INSERT INTO asmt_campaigns (code, name, region_id, time_limit_minutes, questions_per_attempt, pool_size, is_active, starts_at, ends_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, CAST(? AS timestamp) AT TIME ZONE \'Europe/Moscow\', CAST(? AS timestamp) AT TIME ZONE \'Europe/Moscow\')
        ');
        $stmt->execute([
            $code,
            $name,
            $regionId,
            $timeLimit,
            $questionsPerAttempt,
            $poolSize,
            $isActive ? 'true' : 'false',
            $startsAt,
            $endsAt,
        ]);
    }

    Http::json(['success' => true]);
}

Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
