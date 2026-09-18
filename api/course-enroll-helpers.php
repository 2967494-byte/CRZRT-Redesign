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

/** Нормализация заголовка для мягкого сравнения. */
function crzrt_normalize_course_title($title) {
    $t = html_entity_decode((string)$title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $t = strip_tags($t);
    $t = str_replace(["\xC2\xA0", '&nbsp;', '«', '»', '“', '”', '„', '‟'], [' ', ' ', '"', '"', '"', '"', '"', '"'], $t);
    $t = preg_replace('/\s+/u', ' ', $t);
    return mb_strtolower(trim((string)$t), 'UTF-8');
}
