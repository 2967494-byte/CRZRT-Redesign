<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$user = Auth::requireRole(['superadmin', 'region_admin', 'moderator', 'analyst']);
$pdo = Db::pdo();

$campaignId = isset($_GET['campaignId']) && $_GET['campaignId'] !== '' ? (int)$_GET['campaignId'] : null;
$rating = trim((string)($_GET['rating'] ?? ''));
$q = trim((string)($_GET['q'] ?? ''));
$limit = min(500, max(1, (int)($_GET['limit'] ?? 200)));

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
if ($q !== '') {
    $where[] = '(qq.text ILIKE ? OR CAST(qq.external_id AS TEXT) ILIKE ?)';
    $like = '%' . $q . '%';
    array_push($params, $like, $like);
}
$sqlWhere = implode(' AND ', $where);

$sql = "SELECT
            qq.id AS question_id,
            qq.external_id,
            qq.text AS question_text,
            qq.correct_letter,
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
        ORDER BY qq.external_id NULLS LAST, qq.id
        LIMIT {$limit}";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$items = [];
foreach ($rows as $r) {
    $answered = (int)$r['answered'];
    $correct = (int)$r['correct'];
    $incorrect = (int)$r['incorrect'];
    $percent = $answered > 0 ? round(($correct / $answered) * 100, 2) : null;
    $failRate = $answered > 0 ? round(($incorrect / $answered) * 100, 2) : null;

    if ($answered === 0) {
        $rate = 'no_data';
    } elseif ($failRate !== null && $failRate >= $threshold) {
        $rate = 'needs_correction';
    } elseif ($percent !== null && $percent >= 70) {
        $rate = 'easy';
    } else {
        $rate = 'hard';
    }

    if ($rating !== '' && $rating !== 'all' && $rate !== $rating) {
        continue;
    }

    // Formulation breakdown for this question
    $fParams = [(int)$r['question_id']];
    $fWhere = ["a.status = 'finished'", 'aa.question_id = ?'];
    if ($campaignId) {
        $fWhere[] = 'a.campaign_id = ?';
        $fParams[] = $campaignId;
    }
    if ($user['role'] === 'region_admin' && !empty($user['region_id'])) {
        $fWhere[] = 'u.region_id = ?';
        $fParams[] = (int)$user['region_id'];
    }
    $fSql = 'SELECT f.id, f.text,
                    COUNT(aa.id) FILTER (WHERE aa.option_letter_chosen IS NOT NULL AND aa.option_letter_chosen <> \'\') AS answered,
                    COUNT(aa.id) FILTER (WHERE aa.is_correct IS TRUE) AS correct
             FROM asmt_attempt_answers aa
             JOIN asmt_attempts a ON a.id = aa.attempt_id
             JOIN asmt_users u ON u.id = a.user_id
             LEFT JOIN asmt_question_formulations f ON f.id = aa.formulation_id
             WHERE ' . implode(' AND ', $fWhere) . '
             GROUP BY f.id, f.text
             ORDER BY answered DESC';
    $fStmt = $pdo->prepare($fSql);
    $fStmt->execute($fParams);
    $formulations = array_map(static function ($f) {
        $ans = (int)$f['answered'];
        $cor = (int)$f['correct'];
        return [
            'id' => $f['id'] ? (int)$f['id'] : null,
            'text' => $f['text'] ?: '—',
            'answered' => $ans,
            'correct' => $cor,
            'percentCorrect' => $ans > 0 ? round(($cor / $ans) * 100, 2) : null,
        ];
    }, $fStmt->fetchAll());

    $items[] = [
        'questionId' => (int)$r['question_id'],
        'externalId' => (int)$r['external_id'],
        'text' => $r['question_text'],
        'correctLetter' => $r['correct_letter'],
        'answered' => $answered,
        'correct' => $correct,
        'incorrect' => $incorrect,
        'percentCorrect' => $percent,
        'failRate' => $failRate,
        'rating' => $rate,
        'formulationsUsed' => (int)$r['formulations_used'],
        'formulations' => $formulations,
    ];
}

$campaignsSql = 'SELECT id, code, name, error_threshold_percent FROM asmt_campaigns ORDER BY id DESC';
if ($user['role'] === 'region_admin' && !empty($user['region_id'])) {
    $cStmt = $pdo->prepare(
        'SELECT id, code, name, error_threshold_percent FROM asmt_campaigns
         WHERE region_id IS NULL OR region_id = ? ORDER BY id DESC'
    );
    $cStmt->execute([(int)$user['region_id']]);
    $campaigns = $cStmt->fetchAll();
} else {
    $campaigns = $pdo->query($campaignsSql)->fetchAll();
}

Http::json([
    'success' => true,
    'thresholdPercent' => $threshold,
    'note' => 'needs_correction: доля ошибок ≥ порога кампании; easy ≥70% верных; иначе hard',
    'campaigns' => array_map(static function ($c) {
        return [
            'id' => (int)$c['id'],
            'code' => $c['code'],
            'name' => $c['name'],
            'errorThresholdPercent' => (int)$c['error_threshold_percent'],
        ];
    }, $campaigns),
    'total' => count($items),
    'items' => $items,
]);
