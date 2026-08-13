<?php
require_once __DIR__ . '/bootstrap.php';
use Asmt\Db;

$pdo = Db::pdo();

$answers = $pdo->query('
    SELECT aa.attempt_id, aa.question_id, aa.option_letter_chosen, aa.is_correct, q.correct_letter
    FROM asmt_attempt_answers aa
    JOIN asmt_questions q ON q.id = aa.question_id
    WHERE aa.option_letter_chosen IS NOT NULL AND aa.option_letter_chosen != \'\'
    ORDER BY aa.attempt_id DESC, aa.question_id ASC
')->fetchAll();

echo "--- ANSWERS ---\n";
foreach ($answers as $a) {
    echo "Attempt: {$a['attempt_id']} | Q: {$a['question_id']} | Chosen: " . json_encode($a['option_letter_chosen']) . " (" . bin2hex($a['option_letter_chosen']) . ") | Correct: " . json_encode($a['correct_letter']) . " (" . bin2hex($a['correct_letter']) . ") | is_correct: " . var_export($a['is_correct'], true) . "\n";
}
