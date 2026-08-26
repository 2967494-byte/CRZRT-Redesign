<?php
declare(strict_types=1);

require_once __DIR__ . '/../public/api/bootstrap.php';

use Asmt\AttemptService;
use Asmt\Db;

$pdo = Db::pdo();

echo "Running orphan expired attempts cleanup...\n";

// Find in_progress attempts that expired more than 5 minutes ago
$stmt = $pdo->prepare(
    "SELECT * FROM asmt_attempts
     WHERE status = 'in_progress' AND expires_at < NOW() - INTERVAL '5 minutes'
     ORDER BY id ASC
     LIMIT 500"
);
$stmt->execute();
$expiredRows = $stmt->fetchAll();

$count = 0;
foreach ($expiredRows as $row) {
    AttemptService::finalizeAttempt($pdo, $row, 'expired');
    $count++;
}

echo "FINISHED: Closed {$count} expired orphan attempts.\n";
