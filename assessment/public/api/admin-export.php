<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$user = Auth::requireRole(['superadmin', 'region_admin', 'moderator', 'analyst']);
$pdo = Db::pdo();

$campaignId = isset($_GET['campaignId']) && $_GET['campaignId'] !== '' ? (int)$_GET['campaignId'] : null;
$status = trim((string)($_GET['status'] ?? 'finished'));
$dateFrom = trim((string)($_GET['dateFrom'] ?? ''));
$dateTo = trim((string)($_GET['dateTo'] ?? ''));
$q = trim((string)($_GET['q'] ?? ''));
$format = strtolower(trim((string)($_GET['format'] ?? 'csv')));

$where = ['1=1'];
$params = [];

if ($campaignId) {
    $where[] = 'a.campaign_id = ?';
    $params[] = $campaignId;
}
if ($status !== '' && $status !== 'all') {
    $where[] = 'a.status = ?';
    $params[] = $status;
}
if ($dateFrom !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateFrom)) {
    $where[] = 'a.started_at::date >= ?::date';
    $params[] = $dateFrom;
}
if ($dateTo !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateTo)) {
    $where[] = 'a.started_at::date <= ?::date';
    $params[] = $dateTo;
}
if ($q !== '') {
    $where[] = '(u.last_name ILIKE ? OR u.first_name ILIKE ? OR u.email_normalized ILIKE ? OR o.name ILIKE ? OR o.inn ILIKE ?)';
    $like = '%' . $q . '%';
    array_push($params, $like, $like, $like, $like, $like);
}
$approvedOnly = isset($_GET['approvedOnly']) && $_GET['approvedOnly'] === '1';
if ($approvedOnly) {
    $where[] = "a.user_org_status_at_attempt = 'approved'";
}

if ($user['role'] === 'region_admin' && !empty($user['region_id'])) {
    $where[] = 'u.region_id = ?';
    $params[] = (int)$user['region_id'];
}

$sqlWhere = implode(' AND ', $where);
$showIp = in_array($user['role'], ['superadmin', 'region_admin'], true);

$sql = "SELECT
            u.last_name, u.first_name, u.middle_name, u.email_normalized, u.phone_normalized,
            u.position, u.experience_level, u.education, u.specialty, u.customer_level,
            o.name AS organization_name, o.inn AS organization_inn,
            a.user_org_status_at_attempt,
            d.name AS district_name, u.district_other_text,
            c.code AS campaign_code, c.name AS campaign_name,
            a.started_at, a.finished_at, a.duration_seconds,
            a.correct_count, a.incorrect_count, a.score, a.percent_correct,
            a.total_questions, a.answered_count, a.status, a.device_type,
            host(a.ip_address) AS ip_address, a.user_agent
        FROM asmt_attempts a
        JOIN asmt_users u ON u.id = a.user_id
        JOIN asmt_campaigns c ON c.id = a.campaign_id
        LEFT JOIN asmt_organizations o ON o.id = a.organization_id_at_attempt
        LEFT JOIN asmt_districts d ON d.id = u.district_id
        WHERE {$sqlWhere}
        ORDER BY a.started_at DESC
        LIMIT 5000";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$headers = [
    'Фамилия', 'Имя', 'Отчество', 'Email (логин)', 'Телефон',
    'Организация', 'ИНН', 'Должность', 'Опыт работы', 'Образование', 'Специальность',
    'Уровень заказчика', 'Муниципальный район', 'Статус модерации',
    'Кампания', 'Дата начала', 'Время начала', 'Время окончания', 'Продолжительность (сек)',
    'Правильных', 'Неправильных', 'Итоговый балл', '% правильных',
    'Всего вопросов', 'Отвечено', 'Статус попытки', 'Тип устройства',
];
if ($showIp) {
    $headers[] = 'IP-адрес';
    $headers[] = 'User-Agent';
}

$filename = 'assessment-results-' . date('Ymd-His') . '.csv';
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Cache-Control: no-store');

$out = fopen('php://output', 'w');
// UTF-8 BOM for Excel
fwrite($out, "\xEF\xBB\xBF");
fputcsv($out, $headers, ';');

foreach ($rows as $r) {
    $district = $r['district_name'] ?: $r['district_other_text'] ?: '';
    $started = $r['started_at'] ? substr((string)$r['started_at'], 0, 19) : '';
    $finished = $r['finished_at'] ? substr((string)$r['finished_at'], 0, 19) : '';
    $line = [
        $r['last_name'],
        $r['first_name'],
        $r['middle_name'],
        $r['email_normalized'],
        $r['phone_normalized'],
        $r['organization_name'],
        $r['organization_inn'],
        $r['position'],
        $r['experience_level'],
        $r['education'],
        $r['specialty'],
        $r['customer_level'],
        $district,
        $r['user_org_status_at_attempt'],
        $r['campaign_name'] . ' (' . $r['campaign_code'] . ')',
        $started ? substr($started, 0, 10) : '',
        $started ? substr($started, 11) : '',
        $finished ? substr($finished, 11) : '',
        $r['duration_seconds'],
        $r['correct_count'],
        $r['incorrect_count'],
        $r['score'],
        $r['percent_correct'],
        $r['total_questions'],
        $r['answered_count'],
        $r['status'],
        $r['device_type'],
    ];
    if ($showIp) {
        $line[] = $r['ip_address'];
        $line[] = $r['user_agent'];
    }
    fputcsv($out, $line, ';');
}

fclose($out);

$pdo->prepare(
    'INSERT INTO asmt_admin_audit (admin_user_id, action, entity, meta_json)
     VALUES (?, \'export_results\', \'attempts\', ?::jsonb)'
)->execute([
    (int)$user['id'],
    json_encode(['rows' => count($rows), 'format' => $format], JSON_UNESCAPED_UNICODE),
]);
exit;
