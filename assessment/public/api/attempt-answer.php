<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
}

$user = Auth::requireUser();
$payload = Http::readJson();
$attemptId = (int)($payload['attemptId'] ?? 0);
$questionId = (int)($payload['questionId'] ?? 0);
$letter = trim((string)($payload['letter'] ?? ''));

if ($attemptId <= 0 || $questionId <= 0 || $letter === '') {
    Http::json(['success' => false, 'error' => 'Некорректные данные ответа'], 400);
}

$pdo = Db::pdo();
$att = $pdo->prepare('SELECT * FROM asmt_attempts WHERE id = ? AND user_id = ?');
$att->execute([$attemptId, (int)$user['id']]);
$attempt = $att->fetch();
if (!$attempt || $attempt['status'] !== 'in_progress') {
    Http::json(['success' => false, 'error' => 'Попытка недоступна'], 400);
}
if (strtotime((string)$attempt['expires_at']) <= time()) {
    $pdo->prepare("UPDATE asmt_attempts SET status = 'expired', finished_at = NOW() WHERE id = ?")
        ->execute([$attemptId]);
    Http::json(['success' => false, 'error' => 'Время истекло', 'expired' => true], 409);
}

$upd = $pdo->prepare(
    'UPDATE asmt_attempt_answers
     SET option_letter_chosen = ?, answered_at = NOW()
     WHERE attempt_id = ? AND question_id = ?'
);
$upd->execute([$letter, $attemptId, $questionId]);
if ($upd->rowCount() === 0) {
    Http::json(['success' => false, 'error' => 'Вопрос не входит в попытку'], 400);
}

Http::json(['success' => true]);
