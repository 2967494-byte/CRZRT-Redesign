<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/api/bootstrap.php';

use Asmt\Db;

$pdo = Db::pdo();
$qid = (int)$pdo->query('SELECT id FROM asmt_questions ORDER BY id LIMIT 1')->fetchColumn();
$seen = [];
for ($i = 0; $i < 40; $i++) {
    $st = $pdo->prepare(
        'SELECT id FROM asmt_question_formulations
         WHERE question_id = ? AND is_active = TRUE
         ORDER BY random() LIMIT 1'
    );
    $st->execute([$qid]);
    $seen[(string)$st->fetchColumn()] = true;
}
echo "qid={$qid} unique_in_40_draws=" . count($seen) . "\n";
