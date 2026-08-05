<?php
/**
 * Восстановление «осиротевших» курсов из HTML в /courses/
 * (файлы есть, а в courseRegistry в БД их нет).
 *
 * Только для авторизованного админа.
 *
 * GET  ?date=2026-07-29           — dry-run: список кандидатов за дату
 * GET  ?date=2026-07-29&mode=mtime — фильтр по дате изменения файла (по умолчанию)
 * GET  ?date=2026-07-29&mode=id    — фильтр по дате в id (course_{timestamp}_…)
 * GET  ?all=1                      — все orphans без фильтра по дате
 * POST {"date":"2026-07-29","mode":"mtime","apply":true}
 *      — записать найденные курсы в БД и перегенерировать страницы
 */
session_start();
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Несанкционированный доступ'], JSON_UNESCAPED_UNICODE);
    exit;
}

$payload = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw ?: '{}', true);
    if (is_array($decoded)) {
        $payload = $decoded;
    }
}

$date = trim((string)($payload['date'] ?? $_GET['date'] ?? '2026-07-29'));
$mode = trim((string)($payload['mode'] ?? $_GET['mode'] ?? 'mtime')); // mtime | id
$all = !empty($payload['all']) || (isset($_GET['all']) && $_GET['all'] === '1');
$apply = !empty($payload['apply']) && $_SERVER['REQUEST_METHOD'] === 'POST';
$doGenerate = array_key_exists('regenerate', $payload)
    ? !empty($payload['regenerate'])
    : false; // по умолчанию только БД, без тяжёлой генерации всех HTML
$skipDrafts = array_key_exists('skip_drafts', $payload)
    ? !empty($payload['skip_drafts'])
    : (!isset($_GET['skip_drafts']) || $_GET['skip_drafts'] !== '0');
$onlyIds = [];
if (!empty($payload['ids']) && is_array($payload['ids'])) {
    foreach ($payload['ids'] as $id) {
        $id = trim((string)$id);
        if ($id !== '') {
            $onlyIds[$id] = true;
        }
    }
}

if (!$all && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите date=YYYY-MM-DD или all=1'], JSON_UNESCAPED_UNICODE);
    exit;
}

$STORAGE_KEY = 'crzrt_obuchenie_page_data';
$coursesDir = realpath(__DIR__ . '/../courses');
if ($coursesDir === false || !is_dir($coursesDir)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Папка courses/ не найдена'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $pdo->prepare('SELECT setting_value FROM settings WHERE setting_key = ?');
$stmt->execute([$STORAGE_KEY]);
$row = $stmt->fetch();
$data = $row ? json_decode($row['setting_value'], true) : null;
if (!is_array($data)) {
    $data = [];
}
$registry = isset($data['courseRegistry']) && is_array($data['courseRegistry']) ? $data['courseRegistry'] : [];
$knownIds = [];
foreach ($registry as $course) {
    if (!empty($course['id'])) {
        $knownIds[(string)$course['id']] = true;
    }
}

$monthMap = [
    'января' => 1, 'февраля' => 2, 'марта' => 3, 'апреля' => 4,
    'мая' => 5, 'июня' => 6, 'июля' => 7, 'августа' => 8,
    'сентября' => 9, 'октября' => 10, 'ноября' => 11, 'декабря' => 12,
];

function recover_strip_html($html) {
    $text = html_entity_decode(strip_tags((string)$html), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return trim(preg_replace('/\s+/u', ' ', $text));
}

function recover_match($html, $pattern) {
    if (!preg_match($pattern, $html, $m)) {
        return '';
    }
    return recover_strip_html($m[1]);
}

function recover_parse_human_date($text, $monthMap) {
    $text = mb_strtolower(trim((string)$text), 'UTF-8');
    if ($text === '') {
        return '';
    }
    if (preg_match('/^(\d{1,2})\s+([а-яё]+)(?:\s+(\d{4}))?/u', $text, $m)) {
        $day = (int)$m[1];
        $monthName = $m[2];
        $year = isset($m[3]) ? (int)$m[3] : (int)date('Y');
        $month = $monthMap[$monthName] ?? 0;
        if ($month > 0 && checkdate($month, $day, $year)) {
            return sprintf('%04d-%02d-%02d', $year, $month, $day);
        }
    }
    return '';
}

function recover_parse_duration_days($text) {
    if (preg_match('/(\d+)/u', (string)$text, $m)) {
        return max(1, (int)$m[1]);
    }
    return 1;
}

function recover_course_id_timestamp($id) {
    if (preg_match('/^course_(\d{10,16})_/', (string)$id, $m)) {
        $ts = $m[1];
        // ms timestamps are 13 digits typically
        if (strlen($ts) >= 13) {
            return (int)floor(((float)$ts) / 1000);
        }
        return (int)$ts;
    }
    return null;
}

function recover_parse_course_html($id, $html, $monthMap) {
    $title = recover_match($html, '/<h1 class="course-hero__title">(.*?)<\/h1>/su');
    if ($title === '') {
        $title = recover_match($html, '/<title>(.*?)<\/title>/su');
        $title = preg_replace('/\.\s*Центр развития закупок.*$/u', '', $title);
        $title = trim($title);
    }

    $desc = '';
    if (preg_match('/<p class="course-hero__desc">(.*?)<\/p>/su', $html, $m)) {
        $desc = trim($m[1]);
    }

    $about = '';
    if (preg_match('/<div class="course-about__text">(.*?)<\/div>/su', $html, $m)) {
        $about = trim($m[1]);
    }

    $durationText = '';
    $startText = '';
    $price = '';
    if (preg_match('/course-widget-item__label">Длительность<\/span>\s*<span class="course-widget-item__val">(.*?)<\/span>/su', $html, $m)) {
        $durationText = recover_strip_html($m[1]);
    }
    if (preg_match('/course-widget-item__label">Ближайший старт<\/span>\s*<span class="course-widget-item__val">(.*?)<\/span>/su', $html, $m)) {
        $startText = recover_strip_html($m[1]);
    }
    if (preg_match('/course-widget-item__label">Стоимость<\/span>\s*<span class="course-widget-item__val[^"]*">(.*?)<\/span>/su', $html, $m)) {
        $price = recover_strip_html($m[1]);
    }

    $format = 'och';
    if (preg_match_all('/class="course-tag[^"]*">(.*?)<\/span>/su', $html, $tagMatches)) {
        foreach ($tagMatches[1] as $tagHtml) {
            $tag = mb_strtolower(recover_strip_html($tagHtml), 'UTF-8');
            if (strpos($tag, 'дистан') !== false) {
                $format = 'dist';
            }
        }
    }

    $law = '';
    if (preg_match('/class="course-tag[^"]*">\s*(44-ФЗ|223-ФЗ)\s*<\/span>/su', $html, $m)) {
        $law = recover_strip_html($m[1]);
    }

    $programPdf = '';
    if (preg_match('/class="[^"]*course-hero__download[^"]*"[^>]*href="([^"]+)"/su', $html, $m)) {
        $programPdf = html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
    } elseif (preg_match('/class="course-program__download"[^>]*href="([^"]+)"/su', $html, $m)) {
        $programPdf = html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }
    $programPdf = preg_replace('#^\.\./#', '', $programPdf);
    if ($programPdf === '#' || $programPdf === '') {
        $programPdf = '';
    }

    $targetAudience = [];
    if (preg_match_all('/class="audience-card__title">(.*?)<\/h3>/su', $html, $audMatches)) {
        foreach ($audMatches[1] as $audHtml) {
            $name = recover_strip_html($audHtml);
            if ($name !== '') {
                $targetAudience[] = $name;
            }
        }
    }

    $program = [];
    if (preg_match_all('/<div class="course-accordion__item">(.*?)<\/div>\s*(?=<div class="course-accordion__item"|<\/div>\s*<\/div>\s*<\/section>)/su', $html, $itemMatches)) {
        foreach ($itemMatches[1] as $itemHtml) {
            $moduleTitle = recover_match($itemHtml, '/class="course-accordion__title">(.*?)<\/span>/su');
            $items = [];
            if (preg_match_all('/<li>(.*?)<\/li>/su', $itemHtml, $liMatches)) {
                foreach ($liMatches[1] as $li) {
                    $text = recover_strip_html($li);
                    if ($text !== '') {
                        $items[] = $text;
                    }
                }
            }
            if ($moduleTitle !== '' || $items) {
                $program[] = [
                    'title' => $moduleTitle,
                    'items' => $items,
                ];
            }
        }
    }

    $speakers = [];
    if (preg_match_all('/<div class="expert-card">(.*?)<\/div>\s*(?=<div class="expert-card"|<\/div>\s*<\/div>\s*<\/section>)/su', $html, $spMatches)) {
        foreach ($spMatches[1] as $spHtml) {
            $name = recover_match($spHtml, '/class="expert-card__name">(.*?)<\/h3>/su');
            $role = recover_match($spHtml, '/class="expert-card__role">(.*?)<\/p>/su');
            $spDesc = recover_match($spHtml, '/class="expert-card__desc">(.*?)<\/p>/su');
            $img = '';
            if (preg_match('/<img[^>]+src="([^"]+)"/su', $spHtml, $imgMatch)) {
                $img = preg_replace('#^\.\./#', '', html_entity_decode($imgMatch[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
            }
            if ($name !== '') {
                $speakers[] = [
                    'name' => $name,
                    'role' => $role,
                    'desc' => $spDesc,
                    'img' => $img,
                ];
            }
        }
    }

    $documentImage = '';
    if (preg_match('/id="document"[\s\S]*?<img[^>]+src="([^"]+)"/su', $html, $docMatch)) {
        $documentImage = preg_replace('#^\.\./#', '', html_entity_decode($docMatch[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    }

    $dateFrom = recover_parse_human_date($startText, $monthMap);
    $durationDays = recover_parse_duration_days($durationText);

    return [
        'id' => $id,
        'active' => true,
        'title' => $title !== '' ? $title : $id,
        'format' => $format,
        'law' => $law,
        'dateFrom' => $dateFrom,
        'dateTo' => '',
        'durationDays' => $durationDays,
        'price' => $price,
        'description' => $about !== '' ? $about : $desc,
        'outcomes' => [],
        'targetAudience' => $targetAudience,
        'program' => $program,
        'programPdf' => $programPdf,
        'speakers' => $speakers,
        'documentType' => 'Удостоверение о повышении квалификации',
        'documentImage' => $documentImage,
        'forIndividuals' => true,
        'forLegalEntities' => true,
        'forCustomers' => false,
        'forSuppliers' => false,
        'is44fz' => ($law === '44-ФЗ'),
        'is223fz' => ($law === '223-ФЗ'),
        'options' => [],
        'bitrixFormFl' => null,
        'bitrixFormUr' => null,
        'bitrixCourseElementId' => null,
    ];
}

$candidates = [];
$skippedKnown = 0;
$files = glob($coursesDir . DIRECTORY_SEPARATOR . 'course_*.html') ?: [];

foreach ($files as $filePath) {
    $base = basename($filePath, '.html');
    if (isset($knownIds[$base])) {
        $skippedKnown++;
        continue;
    }

    $mtime = filemtime($filePath) ?: 0;
    $mtimeDate = $mtime ? date('Y-m-d', $mtime) : '';
    $idTs = recover_course_id_timestamp($base);
    $idDate = $idTs ? date('Y-m-d', $idTs) : '';

    if (!$all) {
        if ($mode === 'id') {
            if ($idDate !== $date) {
                continue;
            }
        } else {
            // mtime: дата изменения файла
            if ($mtimeDate !== $date) {
                continue;
            }
        }
    }

    $html = file_get_contents($filePath);
    if ($html === false || $html === '') {
        continue;
    }

    $course = recover_parse_course_html($base, $html, $monthMap);
    $candidates[] = [
        'id' => $base,
        'title' => $course['title'],
        'dateFrom' => $course['dateFrom'],
        'price' => $course['price'],
        'format' => $course['format'],
        'file_mtime' => $mtime ? date('Y-m-d H:i:s', $mtime) : null,
        'id_created' => $idDate,
        'program_modules' => count($course['program']),
        'speakers' => count($course['speakers']),
        'programPdf' => $course['programPdf'],
        'course' => $course,
    ];
}

usort($candidates, function ($a, $b) {
    return strcmp($a['id'], $b['id']);
});

if ($onlyIds) {
    $candidates = array_values(array_filter($candidates, function ($item) use ($onlyIds) {
        return isset($onlyIds[$item['id']]);
    }));
}

$skippedDrafts = [];
if ($skipDrafts && $candidates) {
    $byTitle = [];
    foreach ($candidates as $item) {
        $key = mb_strtolower(trim((string)$item['title']), 'UTF-8');
        $byTitle[$key][] = $item;
    }
    $filtered = [];
    foreach ($byTitle as $group) {
        if (count($group) === 1) {
            $filtered[] = $group[0];
            continue;
        }
        usort($group, function ($a, $b) {
            $scoreA = ((int)$a['speakers'] * 10) + ((int)$a['program_modules'] * 5) + ($a['programPdf'] ? 1 : 0);
            $scoreB = ((int)$b['speakers'] * 10) + ((int)$b['program_modules'] * 5) + ($b['programPdf'] ? 1 : 0);
            if ($scoreA === $scoreB) {
                return strcmp($b['file_mtime'] ?? '', $a['file_mtime'] ?? '');
            }
            return $scoreB <=> $scoreA;
        });
        $filtered[] = $group[0];
        for ($i = 1; $i < count($group); $i++) {
            $skippedDrafts[] = [
                'id' => $group[$i]['id'],
                'title' => $group[$i]['title'],
                'reason' => 'дубликат/черновик (есть более полная версия ' . $group[0]['id'] . ')',
            ];
        }
    }
    $candidates = $filtered;
    usort($candidates, function ($a, $b) {
        return strcmp($a['id'], $b['id']);
    });
}

if (!$apply) {
    echo json_encode([
        'success' => true,
        'dry_run' => true,
        'date' => $all ? null : $date,
        'mode' => $all ? 'all_orphans' : $mode,
        'skip_drafts' => $skipDrafts,
        'known_in_registry' => count($knownIds),
        'html_files_total' => count($files),
        'skipped_already_in_registry' => $skippedKnown,
        'skipped_drafts_count' => count($skippedDrafts),
        'skipped_drafts' => $skippedDrafts,
        'candidates_count' => count($candidates),
        'candidates' => array_map(function ($item) {
            $copy = $item;
            unset($copy['course']);
            return $copy;
        }, $candidates),
        'hint' => 'Запускайте из admin.html. URL обязательно: /api/recover-orphan-courses.php. Применить: POST {"date":"2026-07-29","mode":"mtime","apply":true,"skip_drafts":true}. Перегенерация HTML опционально: "regenerate":true',
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if (!$candidates) {
    echo json_encode([
        'success' => false,
        'error' => 'Нет курсов-кандидатов для выбранной даты/режима',
        'date' => $all ? null : $date,
        'mode' => $all ? 'all_orphans' : $mode,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$added = [];
foreach ($candidates as $item) {
    $registry[] = $item['course'];
    $added[] = [
        'id' => $item['id'],
        'title' => $item['title'],
        'dateFrom' => $item['dateFrom'],
        'file_mtime' => $item['file_mtime'],
        'id_created' => $item['id_created'],
    ];
}

$data['courseRegistry'] = $registry;
$jsonStr = json_encode($data, JSON_UNESCAPED_UNICODE);
$upsert = $pdo->prepare('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?');
$upsert->execute([$STORAGE_KEY, $jsonStr, $jsonStr]);

$genResult = null;
if ($doGenerate) {
    @set_time_limit(300);
    require_once __DIR__ . '/generate_courses.php';
    if (function_exists('generate_static_courses')) {
        $genResult = generate_static_courses($registry);
    }
}

echo json_encode([
    'success' => true,
    'dry_run' => false,
    'date' => $all ? null : $date,
    'mode' => $all ? 'all_orphans' : $mode,
    'skip_drafts' => $skipDrafts,
    'regenerated' => (bool)$doGenerate,
    'added_count' => count($added),
    'added' => $added,
    'skipped_drafts_count' => count($skippedDrafts),
    'skipped_drafts' => $skippedDrafts,
    'registry_total' => count($registry),
    'generated_pages' => $genResult,
    'next' => $doGenerate
        ? 'Готово.'
        : 'Курсы записаны в БД. HTML уже есть в /courses/. При необходимости пересохраните курс в админке или вызовите с "regenerate":true',
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
