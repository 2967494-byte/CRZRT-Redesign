<?php
/**
 * Заявка на курс → лид в Bitrix24 (crm.lead.add через webhook).
 */
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Метод не поддерживается'], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/bitrix-lead-lib.php';
require_once __DIR__ . '/course-enroll-helpers.php';

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректный JSON'], JSON_UNESCAPED_UNICODE);
    exit;
}

$name = trim((string)($payload['name'] ?? ''));
$phone = trim((string)($payload['phone'] ?? ''));
$email = trim((string)($payload['email'] ?? ''));
$company = trim((string)($payload['organization'] ?? $payload['company'] ?? ''));
$position = trim((string)($payload['position'] ?? $payload['post'] ?? ''));
$district = trim((string)($payload['district'] ?? ''));
$courseTitle = trim((string)($payload['courseTitle'] ?? ''));
$courseId = trim((string)($payload['courseId'] ?? ''));
$sourceId = trim((string)($payload['source'] ?? ''));
$audienceType = ($payload['audienceType'] ?? '') === 'individual' ? 'individual' : 'legal';

if ($name === '' || $phone === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите имя и телефон'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($audienceType === 'legal') {
    if ($company === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Укажите организацию'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if ($position === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Укажите должность'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

$matchedCourse = null;

try {
    require_once __DIR__ . '/db.php';
    $stmt = $pdo->prepare('SELECT setting_value FROM settings WHERE setting_key = ?');
    $stmt->execute(['crzrt_obuchenie_page_data']);
    $row = $stmt->fetch();
    $pageData = $row ? json_decode($row['setting_value'], true) : null;
    $registry = (is_array($pageData) && isset($pageData['courseRegistry']) && is_array($pageData['courseRegistry']))
        ? $pageData['courseRegistry']
        : [];

    if ($courseId !== '') {
        $key = mb_strtolower($courseId, 'UTF-8');
        foreach ($registry as $item) {
            if (!is_array($item)) {
                continue;
            }
            $id = mb_strtolower(trim((string)($item['id'] ?? '')), 'UTF-8');
            $slug = mb_strtolower(trim((string)($item['slug'] ?? '')), 'UTF-8');
            if ($id === $key || ($slug !== '' && $slug === $key)) {
                $matchedCourse = $item;
                break;
            }
        }
    }

    // Мягкий fallback по заголовку (только если id не нашли)
    if (!$matchedCourse && $courseTitle !== '') {
        $want = crzrt_normalize_course_title($courseTitle);
        if ($want !== '') {
            foreach ($registry as $item) {
                if (!is_array($item)) {
                    continue;
                }
                $have = crzrt_normalize_course_title($item['title'] ?? '');
                if ($have !== '' && $have === $want) {
                    $matchedCourse = $item;
                    break;
                }
            }
        }
    }

    // Жёсткий отказ только когда известен courseId, но курса в реестре нет (сирота)
    if ($courseId !== '' && !$matchedCourse) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Приём заявок на это мероприятие завершён'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($matchedCourse) {
        if (isset($matchedCourse['active']) && $matchedCourse['active'] === false) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Приём заявок на это мероприятие завершён'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $enrollUntil = trim((string)($matchedCourse['enrollUntil'] ?? ''));
        if (!crzrt_is_enroll_open($enrollUntil)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Приём заявок на это мероприятие завершён'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $selectedDate = trim((string)($payload['selectedDate'] ?? $payload['dateFrom'] ?? ''));
        if (!crzrt_is_valid_course_start_date($matchedCourse['dateFrom'] ?? '', $selectedDate)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Выбранная дата не относится к этому курсу'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        if ($courseTitle === '' && !empty($matchedCourse['title'])) {
            $courseTitle = trim((string)$matchedCourse['title']);
        }
    }
} catch (Throwable $e) {
    error_log('bitrix-lead-enroll settings check failed: ' . $e->getMessage());
    // Если передан courseId — без проверки реестра заявку не принимаем
    if ($courseId !== '') {
        http_response_code(503);
        echo json_encode(['success' => false, 'error' => 'Временно невозможно проверить приём заявок. Попробуйте позже.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

$commentParts = ['Заявка на обучение с сайта zakupki.tatar'];

$fields = bitrix_build_enroll_lead_fields([
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'company' => $company,
    'organization' => $company,
    'position' => $position,
    'district' => $district,
    'courseTitle' => $courseTitle,
    'sourceId' => $sourceId,
    'audienceType' => $audienceType,
    'selectedDate' => $payload['selectedDate'] ?? '',
    'dateFrom' => $payload['dateFrom'] ?? '',
    'dateTo' => $payload['dateTo'] ?? '',
    'durationDays' => (int)($payload['durationDays'] ?? 1),
    'format' => ($payload['format'] ?? '') === 'dist' ? 'dist' : 'och',
    'price' => $payload['price'] ?? '',
    'courseElementId' => (int)($payload['bitrixCourseElementId'] ?? 0),
    'forCustomers' => !empty($payload['forCustomers']),
    'forSuppliers' => !empty($payload['forSuppliers']),
    'is44fz' => !empty($payload['is44fz']),
    'is223fz' => !empty($payload['is223fz']),
    'options' => is_array($payload['options'] ?? null) ? $payload['options'] : [],
    'comments' => implode("\n", $commentParts),
]);

$result = bitrix_lead_add($fields);
if (!$result['success']) {
    http_response_code(422);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'success' => true,
    'leadId' => $result['leadId'],
    'message' => 'Заявка принята',
], JSON_UNESCAPED_UNICODE);
