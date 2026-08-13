<?php
declare(strict_types=1);

namespace Asmt;

use PDO;

final class AttemptService
{
    public static function normalizeOptionLetter(string $str): string
    {
        $str = mb_strtoupper(trim($str), 'UTF-8');
        if ($str === '') {
            return '';
        }
        $map = [
            'A' => 'A', 'А' => 'A', '1' => 'A',
            'B' => 'B', 'Б' => 'B', '2' => 'B',
            'C' => 'C', 'В' => 'C', '3' => 'C',
            'D' => 'D', 'Г' => 'D', '4' => 'D',
        ];
        return $map[$str] ?? $str;
    }

    public static function parseTs(string $value): ?int
    {
        $value = trim($value);
        if ($value === '') {
            return null;
        }
        $value = preg_replace('/\.\d+(?=[+-]\d{2})/', '', $value) ?? $value;
        if (preg_match('/([+-]\d{2})$/', $value, $m)) {
            $value = substr($value, 0, -strlen($m[1])) . $m[1] . ':00';
        }
        $value = str_replace(' ', 'T', $value);
        try {
            return (new \DateTimeImmutable($value))->getTimestamp();
        } catch (\Throwable $e) {
            $ts = strtotime($value);
            return $ts !== false ? $ts : null;
        }
    }

    /** Score answers for attempt; returns stats array. */
    public static function scoreAttempt(PDO $pdo, int $attemptId): array
    {
        $rows = $pdo->prepare(
            'SELECT aa.question_id, aa.option_letter_chosen, q.correct_letter
             FROM asmt_attempt_answers aa
             JOIN asmt_questions q ON q.id = aa.question_id
             WHERE aa.attempt_id = ?'
        );
        $rows->execute([$attemptId]);
        $all = $rows->fetchAll();
        $total = count($all);
        $answered = 0;
        $correct = 0;
        $mark = $pdo->prepare(
            'UPDATE asmt_attempt_answers SET is_correct = ? WHERE attempt_id = ? AND question_id = ?'
        );
        foreach ($all as $row) {
            $chosenRaw = trim((string)($row['option_letter_chosen'] ?? ''));
            $expectedRaw = trim((string)($row['correct_letter'] ?? ''));
            if ($chosenRaw === '') {
                $mark->execute([false, $attemptId, (int)$row['question_id']]);
                continue;
            }
            $answered++;
            $chosenNorm = self::normalizeOptionLetter($chosenRaw);
            $expectedNorm = self::normalizeOptionLetter($expectedRaw);
            $isCorrect = ($chosenNorm !== '' && $chosenNorm === $expectedNorm);
            if ($isCorrect) {
                $correct++;
            }
            $mark->execute([$isCorrect, $attemptId, (int)$row['question_id']]);
        }
        $incorrect = max(0, $total - $correct);
        $percent = $total > 0 ? round(($correct / $total) * 100, 2) : 0.0;
        return [
            'total' => $total,
            'answered' => $answered,
            'correct' => $correct,
            'incorrect' => $incorrect,
            'percent' => $percent,
        ];
    }

    /**
     * Finalize a single open attempt.
     * @param 'finished'|'abandoned'|'expired' $status
     */
    public static function finalizeAttempt(PDO $pdo, array $attempt, string $status = 'finished', ?array $batchAnswers = null): array
    {
        $attemptId = (int)$attempt['id'];
        if (in_array($attempt['status'], ['finished', 'superseded'], true)) {
            return $attempt;
        }

        if (is_array($batchAnswers)) {
            $upd = $pdo->prepare(
                'UPDATE asmt_attempt_answers
                 SET option_letter_chosen = ?, answered_at = COALESCE(answered_at, NOW())
                 WHERE attempt_id = ? AND question_id = ?'
            );
            foreach ($batchAnswers as $qid => $letter) {
                $qid = (int)$qid;
                $letter = trim((string)$letter);
                if ($qid > 0 && $letter !== '') {
                    $upd->execute([$letter, $attemptId, $qid]);
                }
            }
        }

        $stats = self::scoreAttempt($pdo, $attemptId);
        $startedTs = self::parseTs((string)$attempt['started_at']) ?? time();
        $duration = max(0, time() - $startedTs);

        $pdo->prepare(
            'UPDATE asmt_attempts SET
                status = ?,
                finished_at = NOW(),
                duration_seconds = ?,
                answered_count = ?,
                correct_count = ?,
                incorrect_count = ?,
                score = ?,
                percent_correct = ?
             WHERE id = ?'
        )->execute([
            $status,
            $duration,
            $stats['answered'],
            $stats['correct'],
            $stats['incorrect'],
            $stats['correct'],
            $stats['percent'],
            $attemptId,
        ]);

        $fresh = $pdo->prepare('SELECT * FROM asmt_attempts WHERE id = ?');
        $fresh->execute([$attemptId]);
        return $fresh->fetch() ?: $attempt;
    }

    /**
     * Close all in_progress attempts for user.
     * Latest per campaign → finished; older open ones → abandoned.
     */
    public static function finalizeOpenAttemptsForUser(PDO $pdo, int $userId): int
    {
        $stmt = $pdo->prepare(
            "SELECT * FROM asmt_attempts
             WHERE user_id = ? AND status = 'in_progress'
             ORDER BY campaign_id ASC, id DESC"
        );
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll();
        $seenCampaign = [];
        $n = 0;
        foreach ($rows as $attempt) {
            $cid = (int)$attempt['campaign_id'];
            $hasFinished = $pdo->prepare(
                "SELECT 1 FROM asmt_attempts
                 WHERE user_id = ? AND campaign_id = ? AND status = 'finished' LIMIT 1"
            );
            $hasFinished->execute([$userId, $cid]);
            if ($hasFinished->fetch()) {
                self::finalizeAttempt($pdo, $attempt, 'abandoned');
            } elseif (!isset($seenCampaign[$cid])) {
                $seenCampaign[$cid] = true;
                self::finalizeAttempt($pdo, $attempt, 'finished');
            } else {
                self::finalizeAttempt($pdo, $attempt, 'abandoned');
            }
            $n++;
        }
        return $n;
    }

    public static function supersedeFinished(PDO $pdo, int $userId, int $campaignId): void
    {
        $pdo->prepare(
            "UPDATE asmt_attempts SET status = 'superseded'
             WHERE user_id = ? AND campaign_id = ?
               AND status IN ('finished', 'abandoned', 'expired')"
        )->execute([$userId, $campaignId]);
    }
}
