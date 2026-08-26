<?php
declare(strict_types=1);

require_once __DIR__ . '/../public/api/bootstrap.php';

use Asmt\Db;
use Asmt\Mailer;
use Asmt\Http;

$pdo = Db::pdo();

// Fetch up to 50 pending emails ordered by priority (10=urgent, 90=low) and retry time
$stmt = $pdo->prepare(
    "SELECT id, to_email, subject, body_html, attempts_count
     FROM asmt_mail_queue
     WHERE status IN ('new', 'processing')
       AND next_retry_at <= NOW()
       AND attempts_count < 5
     ORDER BY priority ASC, next_retry_at ASC, id ASC
     LIMIT 50
     FOR UPDATE SKIP LOCKED"
);

$stmt->execute();
$items = $stmt->fetchAll();

if (empty($items)) {
    exit(0);
}

// Backoff delays in seconds per attempt: 30s, 120s (2m), 600s (10m), 3600s (1h)
$backoff = [1 => 30, 2 => 120, 3 => 600, 4 => 3600];

foreach ($items as $row) {
    $id = (int)$row['id'];
    $attempts = (int)$row['attempts_count'] + 1;
    $err = null;

    $success = Mailer::sendSync($row['to_email'], $row['subject'], $row['body_html']);

    if ($success) {
        $pdo->prepare(
            "UPDATE asmt_mail_queue 
             SET status = 'sent', sent_at = NOW(), attempts_count = ?, last_error = NULL 
             WHERE id = ?"
        )->execute([$attempts, $id]);
    } else {
        $nextDelay = $backoff[$attempts] ?? 3600;
        $newStatus = $attempts >= 5 ? 'failed' : 'processing';
        $pdo->prepare(
            "UPDATE asmt_mail_queue 
             SET status = ?, attempts_count = ?, last_error = 'SMTP delivery failed', next_retry_at = NOW() + (? || ' seconds')::interval
             WHERE id = ?"
        )->execute([$newStatus, $attempts, (string)$nextDelay, $id]);
    }
}
