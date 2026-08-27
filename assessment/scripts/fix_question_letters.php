<?php
declare(strict_types=1);

/**
 * CLI: php scripts/fix_question_letters.php [--apply]
 *
 * The question bank uses cyrillic option letters (А, Б, В, Г). An earlier version of
 * the admin editor wrote latin A/B/C/D, which breaks scoring because a chosen option
 * никогда не совпадает с correct_letter. Script reports and optionally repairs those rows.
 */

require_once dirname(__DIR__) . '/api/bootstrap.php';

use Asmt\Db;

$apply = in_array('--apply', $argv, true);
$pdo = Db::pdo();

$latinToCyrillic = ['A' => 'А', 'B' => 'Б', 'C' => 'В', 'D' => 'Г'];

$rows = $pdo->query(
    "SELECT q.id, q.external_id, q.correct_letter,
            ARRAY_TO_STRING(ARRAY(
                SELECT o.letter FROM asmt_question_options o
                WHERE o.question_id = q.id ORDER BY o.sort_order, o.letter
            ), ',') AS letters
     FROM asmt_questions q
     ORDER BY q.external_id NULLS LAST, q.id"
)->fetchAll();

$brokenCorrect = [];
$latinOptions = [];

foreach ($rows as $r) {
    $letters = $r['letters'] === '' ? [] : explode(',', (string)$r['letters']);
    if ($letters && !in_array((string)$r['correct_letter'], $letters, true)) {
        $brokenCorrect[] = $r;
    }
    foreach ($letters as $letter) {
        if (isset($latinToCyrillic[$letter])) {
            $latinOptions[] = $r;
            break;
        }
    }
}

echo 'Всего вопросов: ' . count($rows) . "\n";
echo 'Правильный вариант отсутствует среди вариантов: ' . count($brokenCorrect) . "\n";
echo 'Вопросы с латинскими буквами вариантов: ' . count($latinOptions) . "\n";

foreach ($brokenCorrect as $r) {
    echo "  №{$r['external_id']}: correct_letter='{$r['correct_letter']}', варианты: {$r['letters']}\n";
}

if (!$apply) {
    echo "\nЗапустите с --apply, чтобы исправить (латиница A/B/C/D → А/Б/В/Г).\n";
    exit(0);
}

$pdo->beginTransaction();
try {
    $updOpt = $pdo->prepare('UPDATE asmt_question_options SET letter = ? WHERE question_id = ? AND letter = ?');
    $updQ = $pdo->prepare('UPDATE asmt_questions SET correct_letter = ?, updated_at = NOW() WHERE id = ?');
    $fixed = 0;

    foreach ($latinOptions as $r) {
        foreach ($latinToCyrillic as $latin => $cyr) {
            $updOpt->execute([$cyr, (int)$r['id'], $latin]);
        }
        $fixed++;
    }

    foreach ($rows as $r) {
        $correct = (string)$r['correct_letter'];
        if (isset($latinToCyrillic[$correct])) {
            $updQ->execute([$latinToCyrillic[$correct], (int)$r['id']]);
            $fixed++;
        }
    }

    $pdo->commit();
    echo "Исправлено записей: {$fixed}\n";
} catch (\Throwable $e) {
    $pdo->rollBack();
    fwrite(STDERR, $e->getMessage() . "\n");
    exit(1);
}
