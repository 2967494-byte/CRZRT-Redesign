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

    /** Score answers for attempt with bulk single UPDATE; returns stats array. */
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
        $updates = [];

        foreach ($all as $row) {
            $qid = (int)$row['question_id'];
            $chosenRaw = trim((string)($row['option_letter_chosen'] ?? ''));
            $expectedRaw = trim((string)($row['correct_letter'] ?? ''));
            if ($chosenRaw === '') {
                $updates[] = [$qid, 0];
                continue;
            }
            $answered++;
            $chosenNorm = self::normalizeOptionLetter($chosenRaw);
            $expectedNorm = self::normalizeOptionLetter($expectedRaw);
            $isCorrect = ($chosenNorm !== '' && $chosenNorm === $expectedNorm);
            if ($isCorrect) {
                $correct++;
            }
            $updates[] = [$qid, $isCorrect ? 1 : 0];
        }

        if (!empty($updates)) {
            $valuesParts = [];
            $params = [];
            foreach ($updates as $u) {
                $valuesParts[] = '(?::bigint, ?::int)';
                $params[] = $u[0];
                $params[] = $u[1];
            }
            $params[] = $attemptId;
            $sql = 'UPDATE asmt_attempt_answers aa
                    SET is_correct = v.is_correct::boolean
                    FROM (VALUES ' . implode(',', $valuesParts) . ') AS v(question_id, is_correct)
                    WHERE aa.attempt_id = ? AND aa.question_id = v.question_id';
            $pdo->prepare($sql)->execute($params);
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

        if (is_array($batchAnswers) && !empty($batchAnswers)) {
            $updValues = [];
            $updParams = [];
            foreach ($batchAnswers as $qid => $letter) {
                $qid = (int)$qid;
                $letter = trim((string)$letter);
                if ($qid > 0 && $letter !== '') {
                    $updValues[] = '(?::bigint, ?::varchar)';
                    $updParams[] = $qid;
                    $updParams[] = $letter;
                }
            }
            if (!empty($updValues)) {
                $updParams[] = $attemptId;
                $sql = 'UPDATE asmt_attempt_answers aa
                        SET option_letter_chosen = v.letter, answered_at = COALESCE(aa.answered_at, NOW())
                        FROM (VALUES ' . implode(',', $updValues) . ') AS v(question_id, letter)
                        WHERE aa.attempt_id = ? AND aa.question_id = v.question_id';
                $pdo->prepare($sql)->execute($updParams);
            }
        }

        $stats = self::scoreAttempt($pdo, $attemptId);
        $startedTs = self::parseTs((string)$attempt['started_at']) ?? time();
        $duration = max(0, time() - $startedTs);

        $params = [
            $status,
            $duration,
            $stats['answered'],
            $stats['correct'],
            $stats['incorrect'],
            $stats['correct'],
            $stats['percent'],
            $attemptId,
        ];
        try {
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
            )->execute($params);
        } catch (\PDOException $e) {
            // Unique partial index: one finished per user+campaign
            if ($status === 'finished') {
                $params[0] = 'abandoned';
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
                )->execute($params);
            } else {
                throw $e;
            }
        }

        $fresh = $pdo->prepare('SELECT * FROM asmt_attempts WHERE id = ?');
        $fresh->execute([$attemptId]);
        return $fresh->fetch() ?: $attempt;
    }

    /**
     * Close all in_progress attempts for user without N+1 queries.
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
        if (empty($rows)) {
            return 0;
        }

        // Fetch campaigns that already have finished attempts
        $finStmt = $pdo->prepare(
            "SELECT DISTINCT campaign_id FROM asmt_attempts WHERE user_id = ? AND status = 'finished'"
        );
        $finStmt->execute([$userId]);
        $finishedCampaigns = array_flip($finStmt->fetchAll(PDO::FETCH_COLUMN));

        $seenCampaign = [];
        $n = 0;
        foreach ($rows as $attempt) {
            $cid = (int)$attempt['campaign_id'];
            if (isset($finishedCampaigns[$cid])) {
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
}
