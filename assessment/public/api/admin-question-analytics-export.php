<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;

$user = Auth::requireRole(['superadmin', 'region_admin', 'moderator', 'analyst']);
$pdo = Db::pdo();

$campaignId = isset($_GET['campaignId']) && $_GET['campaignId'] !== '' ? (int)$_GET['campaignId'] : null;
$ratingFilter = trim((string)($_GET['rating'] ?? ''));

$threshold = 60;
if ($campaignId) {
    $tStmt = $pdo->prepare('SELECT error_threshold_percent FROM asmt_campaigns WHERE id = ?');
    $tStmt->execute([$campaignId]);
    $t = $tStmt->fetchColumn();
    if ($t !== false) {
        $threshold = (int)$t;
    }
} else {
    $t = $pdo->query(
        'SELECT error_threshold_percent FROM asmt_campaigns WHERE is_active = TRUE ORDER BY id DESC LIMIT 1'
    )->fetchColumn();
    if ($t !== false) {
        $threshold = (int)$t;
    }
}

$where = ["a.status = 'finished'"];
$params = [];
if ($campaignId) {
    $where[] = 'a.campaign_id = ?';
    $params[] = $campaignId;
}
if ($user['role'] === 'region_admin' && !empty($user['region_id'])) {
    $where[] = 'u.region_id = ?';
    $params[] = (int)$user['region_id'];
}
$sqlWhere = implode(' AND ', $where);

$sql = "SELECT
            qq.external_id, qq.text AS question_text, qq.correct_letter,
            COUNT(aa.id) FILTER (WHERE aa.option_letter_chosen IS NOT NULL AND aa.option_letter_chosen <> '') AS answered,
            COUNT(aa.id) FILTER (WHERE aa.is_correct IS TRUE) AS correct,
            COUNT(aa.id) FILTER (WHERE aa.is_correct IS FALSE) AS incorrect,
            COUNT(DISTINCT aa.formulation_id) AS formulations_used
        FROM asmt_attempt_answers aa
        JOIN asmt_attempts a ON a.id = aa.attempt_id
        JOIN asmt_users u ON u.id = a.user_id
        JOIN asmt_questions qq ON qq.id = aa.question_id
        WHERE {$sqlWhere}
        GROUP BY qq.id, qq.external_id, qq.text, qq.correct_letter
        ORDER BY qq.external_id NULLS LAST, qq.id";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$filename = 'assessment-question-analytics-' . date('Ymd-His') . '.csv';
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Cache-Control: no-store');

$out = fopen('php://output', 'w');
fwrite($out, "\xEF\xBB\xBF");
fputcsv($out, [
    '№ вопроса', 'Текст', 'Правильный ответ',
    'Ответивших', 'Верных', 'Неверных', '% верных', '% ошибок',
    'Рейтинг', 'Формулировок использовано', 'Порог ошибок %',
], ';');

$exported = 0;
foreach ($rows as $r) {
    $answered = (int)$r['answered'];
    $correct = (int)$r['correct'];
    $incorrect = (int)$r['incorrect'];
    $percent = $answered > 0 ? round(($correct / $answered) * 100, 2) : '';
    $failRate = $answered > 0 ? round(($incorrect / $answered) * 100, 2) : '';
    if ($answered === 0) {
        $rate = 'no_data';
    } elseif ($failRate !== '' && $failRate >= $threshold) {
        $rate = 'needs_correction';
    } elseif ($percent !== '' && $percent >= 70) {
        $rate = 'easy';
    } else {
        $rate = 'hard';
    }
    if ($ratingFilter !== '' && $ratingFilter !== 'all' && $rate !== $ratingFilter) {
        continue;
    }
    fputcsv($out, [
        $r['external_id'],
        $r['question_text'],
        $r['correct_letter'],
        $answered,
        $correct,
        $incorrect,
        $percent,
        $failRate,
        $rate,
        (int)$r['formulations_used'],
        $threshold,
    ], ';');
    $exported++;
}

fclose($out);

$pdo->prepare(
    'INSERT INTO asmt_admin_audit (admin_user_id, action, entity, meta_json)
     VALUES (?, \'export_question_analytics\', \'questions\', ?::jsonb)'
)->execute([
    (int)$user['id'],
    json_encode(['rows' => $exported, 'threshold' => $threshold], JSON_UNESCAPED_UNICODE),
]);
exit;
