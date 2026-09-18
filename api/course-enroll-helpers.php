<?php
/**
 * Общие хелперы приёма заявок на курсы.
 */

/** Приём заявок открыт, если enrollUntil пуст или сегодня (Москва) <= enrollUntil. */
function crzrt_is_enroll_open($enrollUntil) {
    $until = trim((string)$enrollUntil);
    if ($until === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $until)) {
        return true;
    }
    try {
        $tz = new DateTimeZone('Europe/Moscow');
        $today = (new DateTime('now', $tz))->format('Y-m-d');
    } catch (Exception $e) {
        $today = date('Y-m-d');
    }
    return $today <= $until;
}

/** Список дат старта курса из dateFrom (YYYY-MM-DD). */
function crzrt_course_start_dates($dateFrom) {
    $out = [];
    foreach (explode(',', (string)$dateFrom) as $part) {
        $iso = trim($part);
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $iso)) {
            $out[] = $iso;
        }
    }
    return $out;
}

/** selectedDate допустим, если пуст или совпадает с одной из дат старта. */
function crzrt_is_valid_course_start_date($dateFrom, $selectedDate) {
    $selected = trim((string)$selectedDate);
    if ($selected === '') {
        return true;
    }
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $selected)) {
        return false;
    }
    $starts = crzrt_course_start_dates($dateFrom);
    if (!$starts) {
        return true;
    }
    return in_array($selected, $starts, true);
}

/** Нормализация заголовка для мягкого сравнения. */
function crzrt_normalize_course_title($title) {
    $t = html_entity_decode((string)$title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $t = strip_tags($t);
    $t = str_replace(["\xC2\xA0", '&nbsp;', '«', '»', '“', '”', '„', '‟'], [' ', ' ', '"', '"', '"', '"', '"', '"'], $t);
    $t = preg_replace('/\s+/u', ' ', $t);
    return mb_strtolower(trim((string)$t), 'UTF-8');
}
