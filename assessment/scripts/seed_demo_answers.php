<?php
declare(strict_types=1);

/**
 * CLI: php scripts/seed_demo_answers.php
 * Fills attempt_answers for the first finished attempt (analytics smoke).
 */

require_once dirname(__DIR__) . '/api/bootstrap.php';

use Asmt\Db;

$pdo = Db::pdo();
$att = $pdo->query("SELECT id FROM asmt_attempts WHERE status = 'finished' ORDER BY id LIMIT 1")->fetchColumn();
if (!$att) {
    fwrite(STDERR, "No finished attempt\n");
    exit(1);
}
$att = (int)$att;

$qs = $pdo->query(
    'SELECT id, correct_letter FROM asmt_questions WHERE is_active = TRUE ORDER BY id LIMIT 40'
)->fetchAll();

$pdo->prepare('DELETE FROM asmt_attempt_answers WHERE attempt_id = ?')->execute([$att]);
$ins = $pdo->prepare(
    'INSERT INTO asmt_attempt_answers
        (attempt_id, question_id, formulation_id, option_letter_chosen, is_correct, options_order_json, answered_at)
     VALUES (?, ?, ?, ?, ?, ?::jsonb, NOW())'
);

foreach ($qs as $i => $q) {
    $forms = $pdo->prepare(
        'SELECT id FROM asmt_question_formulations WHERE question_id = ? AND is_active = TRUE'
    );
    $forms->execute([(int)$q['id']]);
    $fids = array_column($forms->fetchAll(), 'id');
    if (!$fids) {
        continue;
    }
    $fid = (int)$fids[array_rand($fids)];
    $correct = ($i % 3 !== 0);
    $letter = $q['correct_letter'];
    if (!$correct) {
        $opts = $pdo->prepare(
            'SELECT letter FROM asmt_question_options WHERE question_id = ? AND letter <> ? LIMIT 1'
        );
        $opts->execute([(int)$q['id'], $q['correct_letter']]);
        $letter = (string)($opts->fetchColumn() ?: 'А');
    }
    $ins->execute([
        $att,
        (int)$q['id'],
        $fid,
        $letter,
        $correct ? 'true' : 'false',
        '[]',
    ]);
}

echo "Seeded answers for attempt {$att} (" . count($qs) . " questions)\n";
