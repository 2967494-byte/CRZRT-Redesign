<?php
declare(strict_types=1);

/**
 * CLI: php scripts/seed_questions.php
 * Imports assessment/sql/questions_seed.json into PostgreSQL.
 */

require_once dirname(__DIR__) . '/api/bootstrap.php';

use Asmt\Db;

$jsonPath = dirname(__DIR__) . '/sql/questions_seed.json';
if (!is_file($jsonPath)) {
    fwrite(STDERR, "Missing {$jsonPath}\n");
    exit(1);
}

$data = json_decode((string)file_get_contents($jsonPath), true);
if (!is_array($data) || !$data) {
    fwrite(STDERR, "Invalid seed JSON\n");
    exit(1);
}

$pdo = Db::pdo();
$pdo->beginTransaction();
try {
    $upsertQ = $pdo->prepare(
        'INSERT INTO asmt_questions (external_id, text, correct_letter, is_active, updated_at)
         VALUES (?, ?, ?, TRUE, NOW())
         ON CONFLICT (external_id) DO UPDATE SET
            text = EXCLUDED.text,
            correct_letter = EXCLUDED.correct_letter,
            updated_at = NOW()
         RETURNING id'
    );
    $delOpts = $pdo->prepare('DELETE FROM asmt_question_options WHERE question_id = ?');
    $insOpt = $pdo->prepare(
        'INSERT INTO asmt_question_options (question_id, letter, text, sort_order) VALUES (?, ?, ?, ?)'
    );
    $delForm = $pdo->prepare('DELETE FROM asmt_question_formulations WHERE question_id = ?');
    $insForm = $pdo->prepare(
        'INSERT INTO asmt_question_formulations (question_id, text, sort_order) VALUES (?, ?, 0)'
    );

    $n = 0;
    foreach ($data as $item) {
        $upsertQ->execute([
            (int)$item['external_id'],
            (string)$item['text'],
            (string)$item['correct_letter'],
        ]);
        $qid = (int)$upsertQ->fetchColumn();
        $delOpts->execute([$qid]);
        $delForm->execute([$qid]);
        $insForm->execute([$qid, (string)$item['text']]);
        $i = 0;
        foreach ($item['options'] as $opt) {
            $insOpt->execute([$qid, (string)$opt['letter'], (string)$opt['text'], $i++]);
        }
        $n++;
    }
    $pdo->commit();
    echo "Imported {$n} questions\n";
} catch (Throwable $e) {
    $pdo->rollBack();
    fwrite(STDERR, $e->getMessage() . "\n");
    exit(1);
}
