<?php
declare(strict_types=1);

/**
 * CLI: php scripts/seed_formulations.php
 * Adds alternate formulations (up to 3 total) for each question without wiping the base text.
 */

require_once dirname(__DIR__) . '/api/bootstrap.php';

use Asmt\Db;

$pdo = Db::pdo();
$questions = $pdo->query(
    'SELECT id, text FROM asmt_questions WHERE is_active = TRUE ORDER BY id'
)->fetchAll();

$prefixes = [
    'Укажите правильный ответ. ',
    'Согласно законодательству о контрактной системе: ',
    'Выберите верный вариант. ',
];

$added = 0;
$skipped = 0;

foreach ($questions as $q) {
    $qid = (int)$q['id'];
    $base = trim((string)$q['text']);
    $countStmt = $pdo->prepare(
        'SELECT COUNT(*) FROM asmt_question_formulations WHERE question_id = ? AND is_active = TRUE'
    );
    $countStmt->execute([$qid]);
    $count = (int)$countStmt->fetchColumn();

    // Ensure base formulation exists
    if ($count === 0) {
        $pdo->prepare(
            'INSERT INTO asmt_question_formulations (question_id, text, sort_order) VALUES (?, ?, 0)'
        )->execute([$qid, $base]);
        $count = 1;
        $added++;
    }

    $existing = $pdo->prepare(
        'SELECT text FROM asmt_question_formulations WHERE question_id = ?'
    );
    $existing->execute([$qid]);
    $texts = array_map('strval', array_column($existing->fetchAll(), 'text'));

    $max = 3; // demo: up to 3; schema allows 10
    $pi = 0;
    while ($count < $max && $pi < count($prefixes)) {
        $variant = $prefixes[$pi++] . $base;
        if (in_array($variant, $texts, true)) {
            continue;
        }
        // Cap length a bit for UI
        if (mb_strlen($variant) > 2000) {
            $variant = mb_substr($variant, 0, 2000);
        }
        $pdo->prepare(
            'INSERT INTO asmt_question_formulations (question_id, text, sort_order, is_active)
             VALUES (?, ?, ?, TRUE)'
        )->execute([$qid, $variant, $count]);
        $texts[] = $variant;
        $count++;
        $added++;
    }
    if ($count >= $max) {
        $skipped++;
    }
}

echo "Formulations added/ensured: {$added}; questions at cap: {$skipped}\n";
$stats = $pdo->query(
    'SELECT COUNT(*) AS formulations,
            COUNT(DISTINCT question_id) AS questions,
            ROUND(AVG(c), 2) AS avg_per_q
     FROM (
        SELECT question_id, COUNT(*) AS c
        FROM asmt_question_formulations
        WHERE is_active = TRUE
        GROUP BY question_id
     ) t'
)->fetch();
echo "Active formulations: {$stats['formulations']} across {$stats['questions']} questions (avg {$stats['avg_per_q']})\n";
