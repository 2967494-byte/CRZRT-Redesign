<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = Db::pdo();

// Автоматическое гарантирование наличия поля difficulty в БД
try {
    $pdo->exec('ALTER TABLE asmt_questions ADD COLUMN IF NOT EXISTS difficulty INT NULL CHECK (difficulty BETWEEN 1 AND 10)');
} catch (\Throwable $e) {}

if ($method === 'GET') {
    $user = Auth::requireRole(['superadmin', 'region_admin', 'moderator', 'analyst']);
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    $q = trim((string)($_GET['q'] ?? ''));
    $limit = min(500, max(1, (int)($_GET['limit'] ?? 100)));
    $offset = max(0, (int)($_GET['offset'] ?? 0));

    if ($id > 0) {
        $stmt = $pdo->prepare(
            'SELECT id, external_id, text, correct_letter, difficulty, is_active, updated_at
             FROM asmt_questions WHERE id = ?'
        );
        $stmt->execute([$id]);
        $question = $stmt->fetch();
        if (!$question) {
            Http::json(['success' => false, 'error' => 'Вопрос не найден'], 404);
        }
        $forms = $pdo->prepare(
            'SELECT id, text, sort_order, is_active
             FROM asmt_question_formulations
             WHERE question_id = ?
             ORDER BY sort_order, id'
        );
        $forms->execute([$id]);
        $opts = $pdo->prepare(
            'SELECT id, letter, text, sort_order
             FROM asmt_question_options
             WHERE question_id = ?
             ORDER BY sort_order, letter, id'
        );
        $opts->execute([$id]);
        Http::json([
            'success' => true,
            'canEdit' => in_array($user['role'], ['superadmin', 'region_admin'], true),
            'question' => [
                'id' => (int)$question['id'],
                'externalId' => (int)$question['external_id'],
                'text' => $question['text'],
                'correctLetter' => $question['correct_letter'],
                'difficulty' => $question['difficulty'] !== null ? (int)$question['difficulty'] : null,
                'isActive' => (bool)$question['is_active'],
                'updatedAt' => $question['updated_at'],
                'formulations' => array_map(static function ($f) {
                    return [
                        'id' => (int)$f['id'],
                        'text' => $f['text'],
                        'sortOrder' => (int)$f['sort_order'],
                        'isActive' => (bool)$f['is_active'],
                    ];
                }, $forms->fetchAll()),
                'options' => array_map(static function ($o) {
                    return [
                        'id' => (int)$o['id'],
                        'letter' => $o['letter'],
                        'text' => $o['text'],
                        'sortOrder' => (int)$o['sort_order'],
                    ];
                }, $opts->fetchAll()),
            ],
        ]);
    }

    $where = ['1=1'];
    $params = [];
    if ($q !== '') {
        $where[] = '(q.text ILIKE ? OR CAST(q.external_id AS TEXT) ILIKE ?)';
        $like = '%' . $q . '%';
        array_push($params, $like, $like);
    }
    $sqlWhere = implode(' AND ', $where);

    $count = $pdo->prepare("SELECT COUNT(*) FROM asmt_questions q WHERE {$sqlWhere}");
    $count->execute($params);
    $total = (int)$count->fetchColumn();

    $stmt = $pdo->prepare(
        "SELECT q.id, q.external_id, q.text, q.correct_letter, q.difficulty, q.is_active,
                (SELECT COUNT(*) FROM asmt_question_formulations f WHERE f.question_id = q.id AND f.is_active) AS formulations_count
         FROM asmt_questions q
         WHERE {$sqlWhere}
         ORDER BY q.external_id NULLS LAST, q.id
         LIMIT {$limit} OFFSET {$offset}"
    );
    $stmt->execute($params);

    Http::json([
        'success' => true,
        'total' => $total,
        'canEdit' => in_array($user['role'], ['superadmin', 'region_admin'], true),
        'items' => array_map(static function ($r) {
            return [
                'id' => (int)$r['id'],
                'externalId' => (int)$r['external_id'],
                'text' => $r['text'],
                'correctLetter' => $r['correct_letter'],
                'difficulty' => $r['difficulty'] !== null ? (int)$r['difficulty'] : null,
                'isActive' => (bool)$r['is_active'],
                'formulationsCount' => (int)$r['formulations_count'],
            ];
        }, $stmt->fetchAll()),
    ]);
}

if ($method === 'POST') {
    $user = Auth::requireRole(['superadmin', 'region_admin']);
    $payload = Http::readJson();
    $action = trim((string)($payload['action'] ?? ''));

    if ($action === 'save-formulation') {
        $questionId = (int)($payload['questionId'] ?? 0);
        $formulationId = (int)($payload['formulationId'] ?? 0);
        $text = trim((string)($payload['text'] ?? ''));
        $sortOrder = (int)($payload['sortOrder'] ?? 0);
        $isActive = !isset($payload['isActive']) || (bool)$payload['isActive'];
        if ($questionId <= 0 || $text === '') {
            Http::json(['success' => false, 'error' => 'Укажите questionId и text'], 400);
        }
        $cnt = $pdo->prepare(
            'SELECT COUNT(*) FROM asmt_question_formulations WHERE question_id = ? AND is_active = TRUE'
        );
        $cnt->execute([$questionId]);
        $activeCount = (int)$cnt->fetchColumn();

        if ($formulationId > 0) {
            $pdo->prepare(
                'UPDATE asmt_question_formulations
                 SET text = ?, sort_order = ?, is_active = ?
                 WHERE id = ? AND question_id = ?'
            )->execute([$text, $sortOrder, $isActive ? 'true' : 'false', $formulationId, $questionId]);
        } else {
            if ($isActive && $activeCount >= 10) {
                Http::json(['success' => false, 'error' => 'Не более 10 активных формулировок на вопрос'], 400);
            }
            $ins = $pdo->prepare(
                'INSERT INTO asmt_question_formulations (question_id, text, sort_order, is_active)
                 VALUES (?, ?, ?, ?) RETURNING id'
            );
            $ins->execute([$questionId, $text, $sortOrder, $isActive ? 'true' : 'false']);
            $formulationId = (int)$ins->fetchColumn();
        }

        Http::json(['success' => true, 'formulationId' => $formulationId]);
    }

    if ($action === 'delete-formulation') {
        $formulationId = (int)($payload['formulationId'] ?? 0);
        $questionId = (int)($payload['questionId'] ?? 0);
        if ($formulationId <= 0 || $questionId <= 0) {
            Http::json(['success' => false, 'error' => 'Укажите formulationId и questionId'], 400);
        }
        $active = $pdo->prepare(
            'SELECT COUNT(*) FROM asmt_question_formulations
             WHERE question_id = ? AND is_active = TRUE AND id <> ?'
        );
        $active->execute([$questionId, $formulationId]);
        if ((int)$active->fetchColumn() < 1) {
            Http::json(['success' => false, 'error' => 'Нельзя удалить последнюю активную формулировку'], 400);
        }
        $pdo->prepare(
            'UPDATE asmt_question_formulations SET is_active = FALSE WHERE id = ? AND question_id = ?'
        )->execute([$formulationId, $questionId]);
        Http::json(['success' => true]);
    }

    if ($action === 'save-question') {
        $questionId = (int)($payload['questionId'] ?? 0);
        $text = trim((string)($payload['text'] ?? ''));
        $correct = strtoupper(trim((string)($payload['correctLetter'] ?? '')));
        $difficulty = (isset($payload['difficulty']) && $payload['difficulty'] !== '' && $payload['difficulty'] !== null)
            ? (int)$payload['difficulty']
            : null;
        $isActive = !isset($payload['isActive']) || (bool)$payload['isActive'];
        $options = $payload['options'] ?? null;

        if ($text === '' || $correct === '') {
            Http::json(['success' => false, 'error' => 'Заполните вопрос и выберите правильный вариант ответа'], 400);
        }

        if ($questionId > 0) {
            $pdo->prepare(
                'UPDATE asmt_questions
                 SET text = ?, correct_letter = ?, difficulty = ?, is_active = ?, updated_at = NOW()
                 WHERE id = ?'
            )->execute([$text, $correct, $difficulty, $isActive ? 'true' : 'false', $questionId]);
        } else {
            $extStmt = $pdo->query('SELECT COALESCE(MAX(external_id), 0) + 1 FROM asmt_questions');
            $nextExtId = (int)$extStmt->fetchColumn();

            $ins = $pdo->prepare('
                INSERT INTO asmt_questions (external_id, text, correct_letter, difficulty, is_active)
                VALUES (?, ?, ?, ?, ?) RETURNING id
            ');
            $ins->execute([$nextExtId, $text, $correct, $difficulty, $isActive ? 'true' : 'false']);
            $questionId = (int)$ins->fetchColumn();

            // Авто-добавление базовой формулировки
            $pdo->prepare('
                INSERT INTO asmt_question_formulations (question_id, text, sort_order, is_active)
                VALUES (?, ?, 0, TRUE)
            ')->execute([$questionId, $text]);
        }

        if (is_array($options)) {
            $updOpt = $pdo->prepare('
                INSERT INTO asmt_question_options (question_id, letter, text, sort_order)
                VALUES (?, ?, ?, ?)
                ON CONFLICT (question_id, letter) 
                DO UPDATE SET text = EXCLUDED.text
            ');
            $sort = 0;
            foreach ($options as $opt) {
                $letter = strtoupper(trim((string)($opt['letter'] ?? '')));
                $optText = trim((string)($opt['text'] ?? ''));
                if ($letter !== '' && $optText !== '') {
                    $updOpt->execute([$questionId, $letter, $optText, $sort]);
                    $sort++;
                }
            }
        }

        Http::json(['success' => true, 'questionId' => $questionId]);
    }

    Http::json(['success' => false, 'error' => 'Неизвестное действие'], 400);
}

Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
