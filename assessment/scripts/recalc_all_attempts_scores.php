<?php
declare(strict_types=1);

require_once __DIR__ . '/../public/api/bootstrap.php';

use Asmt\AttemptService;
use Asmt\Db;

$pdo = Db::pdo();

echo "Starting historical attempts score recalculation...\n";

$stmt = $pdo->query("SELECT id FROM asmt_attempts WHERE status IN ('finished', 'abandoned', 'expired', 'superseded') ORDER BY id ASC");
$attemptIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

$total = count($attemptIds);
echo "Found {$total} attempts to verify.\n";

$recalculated = 0;
foreach ($attemptIds as $id) {
    $id = (int)$id;
    $stats = AttemptService::scoreAttempt($pdo, $id);
    $pdo->prepare(
        "UPDATE asmt_attempts 
         SET score = ?, percent_correct = ?, answered_count = ?, correct_count = ?, incorrect_count = ?
         WHERE id = ?"
    )->execute([
        $stats['correct'],
        $stats['percent'],
        $stats['answered'],
        $stats['correct'],
        $stats['incorrect'],
        $id
    ]);
    $recalculated++;
    if ($recalculated % 100 === 0) {
        echo "Processed {$recalculated}/{$total}...\n";
    }
}

echo "FINISHED: {$recalculated} attempts successfully recalculated.\n";
