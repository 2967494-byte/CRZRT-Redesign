<?php

/** Даты мероприятия (лиды «Мероприятие» из админки). */
const BITRIX_UF_EVENT_START = 'UF_CRM_1782988591057';
const BITRIX_UF_EVENT_END = 'UF_CRM_1782988606167';
const BITRIX_UF_EVENT_TITLE = 'UF_CRM_1782988621676';

/** Поля заявки на курс (как в CRM-форме Bitrix24). */
const BITRIX_UF_COURSE_CATALOG = 'UF_CRM_1668839163';
const BITRIX_UF_COURSE_TEXT = 'UF_CRM_1674827363';
const BITRIX_UF_SOURCE = 'UF_CRM_1669365821';
const BITRIX_UF_LEAD_TYPE = 'UF_CRM_1675160062565';
const BITRIX_UF_AUDIENCE = 'UF_CRM_62CFF6610395E';
const BITRIX_UF_CUSTOMER_TYPE = 'UF_CRM_1657263972340';
const BITRIX_UF_CUSTOMER_LAW = 'UF_CRM_1657264015040';

const BITRIX_ENUM_LEAD_APPLICATION = '1808';
const BITRIX_ENUM_AUDIENCE_INDIVIDUAL = '398';
const BITRIX_ENUM_AUDIENCE_LEGAL = '400';
const BITRIX_ENUM_CUSTOMER_BUYER = '362';
const BITRIX_ENUM_CUSTOMER_SUPPLIER = '364';
const BITRIX_ENUM_LAW_44 = '366';
const BITRIX_ENUM_LAW_223 = '368';

function bitrix_load_config(): array
{
    $config = [];
    $local = __DIR__ . '/bitrix-config.local.php';
    if (is_file($local)) {
        $loaded = require $local;
        if (is_array($loaded)) {
            $config = $loaded;
        }
    }

    $env = getenv('BITRIX_WEBHOOK_LEAD_ADD');
    if (is_string($env) && $env !== '') {
        $config['webhook_lead_add'] = $env;
    }

    return $config;
}

function bitrix_format_date_dmY(?string $iso): string
{
    if (!$iso || !preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', trim($iso), $m)) {
        return '';
    }
    return sprintf('%02d.%02d.%04d', (int)$m[3], (int)$m[2], (int)$m[1]);
}

function bitrix_month_name_ru(int $month): string
{
    static $months = [
        1 => 'января', 2 => 'февраля', 3 => 'марта', 4 => 'апреля',
        5 => 'мая', 6 => 'июня', 7 => 'июля', 8 => 'августа',
        9 => 'сентября', 10 => 'октября', 11 => 'ноября', 12 => 'декабря',
    ];
    return $months[$month] ?? '';
}

function bitrix_format_date_human_ru(?string $iso): string
{
    if (!$iso || !preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', trim($iso), $m)) {
        return '';
    }
    return sprintf('%d %s %d', (int)$m[3], bitrix_month_name_ru((int)$m[2]), (int)$m[1]);
}

function bitrix_format_date_range_ru(?string $dateFrom, ?string $dateTo): string
{
    $from = trim((string)$dateFrom);
    $to = trim((string)$dateTo);
    if ($from === '' || !preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $from, $fm)) {
        return '';
    }
    $fromDay = (int)$fm[3];
    $fromMonth = (int)$fm[2];
    $fromYear = (int)$fm[1];

    if ($to === '' || $to === $from || !preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $to, $tm)) {
        return bitrix_format_date_human_ru($from);
    }

    $toDay = (int)$tm[3];
    $toMonth = (int)$tm[2];
    $toYear = (int)$tm[1];

    if ($fromYear === $toYear && $fromMonth === $toMonth) {
        return sprintf('%d-%d %s %d', $fromDay, $toDay, bitrix_month_name_ru($fromMonth), $fromYear);
    }

    return bitrix_format_date_human_ru($from) . ' - ' . bitrix_format_date_human_ru($to);
}

function bitrix_course_end_iso(?string $dateFrom, ?string $dateTo, int $durationDays = 1): string
{
    $from = trim((string)$dateFrom);
    $explicitTo = trim((string)$dateTo);
    if ($explicitTo !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $explicitTo)) {
        return $explicitTo;
    }
    if ($from === '' || !preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $from, $m)) {
        return '';
    }
    $days = max(1, $durationDays);
    $dt = new DateTimeImmutable(sprintf('%04d-%02d-%02d', (int)$m[1], (int)$m[2], (int)$m[3]));
    if ($days > 1) {
        $dt = $dt->modify('+' . ($days - 1) . ' days');
    }
    return $dt->format('Y-m-d');
}

function bitrix_parse_opportunity(?string $price): ?float
{
    $digits = preg_replace('/[^\d]/', '', (string)$price);
    if ($digits === '') {
        return null;
    }
    return round((float)$digits, 2);
}

function bitrix_format_course_application_label(array $input): string
{
    $title = trim((string)($input['title'] ?? ''));
    $dateFrom = trim((string)($input['dateFrom'] ?? ''));
    $dateTo = bitrix_course_end_iso(
        $dateFrom,
        $input['dateTo'] ?? '',
        (int)($input['durationDays'] ?? 1)
    );
    $formatLabel = (($input['format'] ?? '') === 'dist') ? 'Дист.' : 'Оч.';
    $range = bitrix_format_date_range_ru($dateFrom, $dateTo);

    $parts = [];
    if ($range !== '') {
        $parts[] = $range;
    }
    if ($title !== '') {
        $parts[] = $formatLabel . ' курс ' . $title;
    }

    return trim(implode(' ', $parts));
}

function bitrix_pick_customer_type_enum(array $input): ?string
{
    $options = $input['options'] ?? [];
    if (!is_array($options)) {
        $options = [];
    }
    $hasCustomer = !empty($input['forCustomers']) || in_array('Заказчик', $options, true);
    $hasSupplier = !empty($input['forSuppliers']) || in_array('Поставщик', $options, true);

    if ($hasCustomer && !$hasSupplier) {
        return BITRIX_ENUM_CUSTOMER_BUYER;
    }
    if ($hasSupplier && !$hasCustomer) {
        return BITRIX_ENUM_CUSTOMER_SUPPLIER;
    }
    return null;
}

function bitrix_pick_customer_law_enum(array $input): ?string
{
    $options = $input['options'] ?? [];
    if (!is_array($options)) {
        $options = [];
    }
    $has44 = !empty($input['is44fz']) || in_array('44-ФЗ', $options, true);
    $has223 = !empty($input['is223fz']) || in_array('223-ФЗ', $options, true);

    if ($has44 && !$has223) {
        return BITRIX_ENUM_LAW_44;
    }
    if ($has223 && !$has44) {
        return BITRIX_ENUM_LAW_223;
    }
    return null;
}

function bitrix_build_enroll_lead_fields(array $input): array
{
    $name = trim((string)($input['name'] ?? ''));
    $lastName = trim((string)($input['lastName'] ?? ''));
    $phone = trim((string)($input['phone'] ?? ''));
    $email = trim((string)($input['email'] ?? ''));
    $company = trim((string)($input['company'] ?? ''));
    $courseTitle = trim((string)($input['courseTitle'] ?? $input['title'] ?? ''));
    $sourceId = trim((string)($input['sourceId'] ?? $input['source'] ?? ''));
    $audienceType = trim((string)($input['audienceType'] ?? 'individual'));
    $courseElementId = (int)($input['courseElementId'] ?? $input['bitrixCourseElementId'] ?? 0);
    $courseLabel = trim((string)($input['courseLabel'] ?? ''));
    if ($courseLabel === '') {
        $courseLabel = bitrix_format_course_application_label([
            'title' => $courseTitle,
            'dateFrom' => $input['dateFrom'] ?? '',
            'dateTo' => $input['dateTo'] ?? '',
            'durationDays' => (int)($input['durationDays'] ?? 1),
            'format' => $input['format'] ?? 'och',
        ]);
    }

    $title = $courseLabel !== ''
        ? ('Заявка с сайта: ' . $courseLabel)
        : ($courseTitle !== '' ? ('Заявка на курс: ' . $courseTitle) : 'Заявка на курс с сайта');

    $fields = [
        'TITLE' => $title,
        'SOURCE_ID' => 'WEBFORM',
        BITRIX_UF_LEAD_TYPE => BITRIX_ENUM_LEAD_APPLICATION,
        BITRIX_UF_AUDIENCE => $audienceType === 'legal'
            ? BITRIX_ENUM_AUDIENCE_LEGAL
            : BITRIX_ENUM_AUDIENCE_INDIVIDUAL,
    ];

    if ($name !== '') {
        $fields['NAME'] = $name;
    }
    if ($lastName !== '') {
        $fields['LAST_NAME'] = $lastName;
    }
    if ($phone !== '') {
        $fields['PHONE'] = [['VALUE' => $phone, 'VALUE_TYPE' => 'WORK']];
    }
    if ($email !== '') {
        $fields['EMAIL'] = [['VALUE' => $email, 'VALUE_TYPE' => 'WORK']];
    }
    if ($company !== '') {
        $fields['COMPANY_TITLE'] = $company;
    }
    if ($sourceId !== '') {
        $fields[BITRIX_UF_SOURCE] = $sourceId;
    }
    if ($courseElementId > 0) {
        $fields[BITRIX_UF_COURSE_CATALOG] = $courseElementId;
    }
    if ($courseLabel !== '') {
        $fields[BITRIX_UF_COURSE_TEXT] = $courseLabel;
    }

    $opportunity = bitrix_parse_opportunity($input['price'] ?? '');
    if ($opportunity !== null && $opportunity > 0) {
        $fields['OPPORTUNITY'] = $opportunity;
        $fields['CURRENCY_ID'] = 'RUB';
    }

    $customerType = bitrix_pick_customer_type_enum($input);
    if ($customerType !== null) {
        $fields[BITRIX_UF_CUSTOMER_TYPE] = $customerType;
    }
    $customerLaw = bitrix_pick_customer_law_enum($input);
    if ($customerLaw !== null) {
        $fields[BITRIX_UF_CUSTOMER_LAW] = $customerLaw;
    }

    $comments = trim((string)($input['comments'] ?? ''));
    if ($comments !== '') {
        $fields['COMMENTS'] = $comments;
    }

    foreach ($fields as $key => $value) {
        if ($value === '' || $value === null || $value === []) {
            unset($fields[$key]);
        }
    }

    return $fields;
}

function bitrix_build_event_lead_fields(array $input): array
{
    $title = trim((string)($input['title'] ?? 'Заявка с сайта'));
    $name = trim((string)($input['name'] ?? ''));
    $lastName = trim((string)($input['lastName'] ?? ''));
    $phone = trim((string)($input['phone'] ?? ''));
    $email = trim((string)($input['email'] ?? ''));
    $eventTitle = trim((string)($input['eventTitle'] ?? ''));
    $dateFrom = trim((string)($input['dateFrom'] ?? ''));
    $dateTo = bitrix_course_end_iso(
        $dateFrom,
        $input['dateTo'] ?? '',
        (int)($input['durationDays'] ?? 1)
    );
    $comments = trim((string)($input['comments'] ?? ''));

    $fields = [
        'TITLE' => $title !== '' ? $title : 'Заявка с сайта',
        BITRIX_UF_EVENT_TITLE => $eventTitle,
        BITRIX_UF_EVENT_START => bitrix_format_date_dmY($dateFrom),
        BITRIX_UF_EVENT_END => bitrix_format_date_dmY($dateTo),
    ];

    if ($name !== '') {
        $fields['NAME'] = $name;
    }
    if ($lastName !== '') {
        $fields['LAST_NAME'] = $lastName;
    }
    if ($phone !== '') {
        $fields['PHONE'] = [['VALUE' => $phone, 'VALUE_TYPE' => 'WORK']];
    }
    if ($email !== '') {
        $fields['EMAIL'] = [['VALUE' => $email, 'VALUE_TYPE' => 'WORK']];
    }
    if ($comments !== '') {
        $fields['COMMENTS'] = $comments;
    }

    foreach ($fields as $key => $value) {
        if ($value === '' || $value === null || $value === []) {
            unset($fields[$key]);
        }
    }

    return $fields;
}

/**
 * @deprecated Используйте bitrix_build_enroll_lead_fields или bitrix_build_event_lead_fields.
 */
function bitrix_build_lead_fields(array $input): array
{
    $mode = trim((string)($input['mode'] ?? ''));
    if ($mode === 'event') {
        return bitrix_build_event_lead_fields($input);
    }
    if ($mode === 'enroll' || !empty($input['phone'])) {
        return bitrix_build_enroll_lead_fields($input);
    }
    return bitrix_build_event_lead_fields($input);
}

function bitrix_lead_add(array $fields): array
{
    $config = bitrix_load_config();
    $url = trim((string)($config['webhook_lead_add'] ?? ''));
    if ($url === '') {
        return [
            'success' => false,
            'error' => 'Webhook Bitrix24 не настроен. Создайте api/bitrix-config.local.php',
        ];
    }

    $payload = ['fields' => $fields];
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($payload),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response = curl_exec($ch);
    $curlError = curl_error($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response === false) {
        return [
            'success' => false,
            'error' => 'Не удалось связаться с Bitrix24',
            'details' => $curlError,
        ];
    }

    $result = json_decode($response, true);
    if (!is_array($result)) {
        return [
            'success' => false,
            'error' => 'Bitrix24 вернул некорректный ответ',
            'details' => $response,
            'httpCode' => $httpCode,
        ];
    }

    if (!empty($result['result'])) {
        return [
            'success' => true,
            'leadId' => (int)$result['result'],
        ];
    }

    return [
        'success' => false,
        'error' => (string)($result['error_description'] ?? $result['error'] ?? 'Bitrix24 не создал лид'),
        'details' => $result,
        'httpCode' => $httpCode,
    ];
}
