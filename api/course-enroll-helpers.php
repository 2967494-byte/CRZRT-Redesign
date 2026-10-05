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

/** selectedDate допустим, если пуст, совпадает со стартом или входит в availableDays (при записи по дням). */
function crzrt_is_valid_course_date($course, $selectedDate) {
    $selected = trim((string)$selectedDate);
    if ($selected === '') {
        return true;
    }
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $selected)) {
        return false;
    }
    if (!empty($course['enrollByDays'])) {
        try {
            $tz = new DateTimeZone('Europe/Moscow');
            $today = (new DateTime('now', $tz))->format('Y-m-d');
        } catch (Exception $e) {
            $today = date('Y-m-d');
        }
        if ($selected < $today) {
            return false;
        }
        $availableDays = is_array($course['availableDays'] ?? null) ? $course['availableDays'] : [];
        $starts = crzrt_course_start_dates($course['dateFrom'] ?? '');
        $duration = max(1, (int)($course['durationDays'] ?? 1));
        $firstStart = $starts[0] ?? null;

        $allowedOffsets = [];
        if (!empty($availableDays) && $firstStart) {
            try {
                $dtFirst = new DateTimeImmutable($firstStart);
                foreach ($availableDays as $ad) {
                    $dtAd = new DateTimeImmutable($ad);
                    $diff = (int)$dtFirst->diff($dtAd)->format('%r%a');
                    if ($diff >= 0 && $diff < $duration) {
                        $allowedOffsets[$diff] = true;
                    }
                }
            } catch (Throwable $e) {}
        }

        foreach ($starts as $start) {
            try {
                $dtStart = new DateTimeImmutable($start);
                for ($i = 0; $i < $duration; $i++) {
                    if (!empty($allowedOffsets) && !isset($allowedOffsets[$i])) {
                        continue;
                    }
                    if ($dtStart->modify("+{$i} days")->format('Y-m-d') === $selected) {
                        return true;
                    }
                }
            } catch (Throwable $e) {}
        }
        return false;
    }
    return crzrt_is_valid_course_start_date($course['dateFrom'] ?? '', $selected);
}

/** Нормализация заголовка для мягкого сравнения. */
function crzrt_normalize_course_title($title) {
    $t = html_entity_decode((string)$title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $t = strip_tags($t);
    $t = str_replace(["\xC2\xA0", '&nbsp;', '«', '»', '“', '”', '„', '‟'], [' ', ' ', '"', '"', '"', '"', '"', '"'], $t);
    $t = preg_replace('/\s+/u', ' ', $t);
    return mb_strtolower(trim((string)$t), 'UTF-8');
}
