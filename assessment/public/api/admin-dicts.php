<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = Db::pdo();

function ensureAllRussianRegionsSeeded(\PDO $pdo): void {
    // Гарантированно наполняем все 89 регионов РФ
    $count = (int)$pdo->query('SELECT COUNT(*) FROM asmt_regions')->fetchColumn();
    if ($count >= 89) {
        return;
    }

    $regions = [
        ['01', 'Республика Адыгея'],
        ['02', 'Республика Башкортостан'],
        ['03', 'Республика Бурятия'],
        ['04', 'Республика Алтай'],
        ['05', 'Республика Дагестан'],
        ['06', 'Республика Ингушетия'],
        ['07', 'Кабардино-Балкарская Республика'],
        ['08', 'Республика Калмыкия'],
        ['09', 'Карачаево-Черкесская Республика'],
        ['10', 'Республика Карелия'],
        ['11', 'Республика Коми'],
        ['12', 'Республика Марий Эл'],
        ['13', 'Республика Мордовия'],
        ['14', 'Республика Саха (Якутия)'],
        ['15', 'Республика Северная Осетия — Алания'],
        ['16', 'Республика Татарстан'],
        ['17', 'Республика Тыва'],
        ['18', 'Удмуртская Республика'],
        ['19', 'Республика Хакасия'],
        ['20', 'Чеченская Республика'],
        ['21', 'Чувашская Республика'],
        ['22', 'Алтайский край'],
        ['23', 'Краснодарский край'],
        ['24', 'Красноярский край'],
        ['25', 'Приморский край'],
        ['26', 'Ставропольский край'],
        ['27', 'Хабаровский край'],
        ['28', 'Амурская область'],
        ['29', 'Архангельская область'],
        ['30', 'Астраханская область'],
        ['31', 'Белгородская область'],
        ['32', 'Брянская область'],
        ['33', 'Владимирская область'],
        ['34', 'Волгоградская область'],
        ['35', 'Вологодская область'],
        ['36', 'Воронежская область'],
        ['37', 'Ивановская область'],
        ['38', 'Иркутская область'],
        ['39', 'Калининградская область'],
        ['40', 'Калужская область'],
        ['41', 'Камчатский край'],
        ['42', 'Кемеровская область — Кузбасс'],
        ['43', 'Кировская область'],
        ['44', 'Костромская область'],
        ['45', 'Курганская область'],
        ['46', 'Курская область'],
        ['47', 'Ленинградская область'],
        ['48', 'Липецкая область'],
        ['49', 'Магаданская область'],
        ['50', 'Московская область'],
        ['51', 'Мурманская область'],
        ['52', 'Нижегородская область'],
        ['53', 'Новгородская область'],
        ['54', 'Новосибирская область'],
        ['55', 'Омская область'],
        ['56', 'Оренбургская область'],
        ['57', 'Орловская область'],
        ['58', 'Пензенская область'],
        ['59', 'Пермский край'],
        ['60', 'Псковская область'],
        ['61', 'Ростовская область'],
        ['62', 'Рязанская область'],
        ['63', 'Самарская область'],
        ['64', 'Саратовская область'],
        ['65', 'Сахалинская область'],
        ['66', 'Свердловская область'],
        ['67', 'Смоленская область'],
        ['68', 'Тамбовская область'],
        ['69', 'Тверская область'],
        ['70', 'Томская область'],
        ['71', 'Тульская область'],
        ['72', 'Тюменская область'],
        ['73', 'Ульяновская область'],
        ['74', 'Челябинская область'],
        ['75', 'Забайкальский край'],
        ['76', 'Ярославская область'],
        ['77', 'Москва'],
        ['78', 'Санкт-Петербург'],
        ['79', 'Еврейская автономная область'],
        ['80', 'Донецкая Народная Республика'],
        ['81', 'Луганская Народная Республика'],
        ['83', 'Ненецкий автономный округ'],
        ['84', 'Запорожская область'],
        ['85', 'Херсонская область'],
        ['86', 'Ханты-Мансийский автономный округ — Югра'],
        ['87', 'Чукотский автономный округ'],
        ['89', 'Ямало-Ненецкий автономный округ'],
        ['91', 'Республика Крым'],
        ['92', 'Севастополь'],
    ];

    $stmt = $pdo->prepare('
        INSERT INTO asmt_regions (code, name, is_active)
        VALUES (?, ?, TRUE)
        ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
    ');

    foreach ($regions as $r) {
        $stmt->execute([$r[0], $r[1]]);
    }
}

ensureAllRussianRegionsSeeded($pdo);

if ($method === 'GET') {
    // Единый публичный доступ к получению списка регионов для ЛК и админки
    $type = trim((string)($_GET['type'] ?? 'regions'));

    if ($type === 'regions_public') {
        $stmt = $pdo->query('SELECT id, code, name FROM asmt_regions WHERE is_active = TRUE ORDER BY CAST(code AS INTEGER), name');
        Http::json(['success' => true, 'items' => $stmt->fetchAll()]);
    }

    $user = Auth::requireRole(['superadmin', 'region_admin']);

    if ($type === 'districts') {
        $stmt = $pdo->query('SELECT id, name, sort_order, is_separate_city, is_active FROM asmt_districts ORDER BY sort_order, name');
        Http::json(['success' => true, 'items' => $stmt->fetchAll()]);
    }

    if ($type === 'banners') {
        $stmt = $pdo->query('
            SELECT b.*, r.name AS region_name
            FROM asmt_region_banners b
            JOIN asmt_regions r ON r.id = b.region_id
            ORDER BY r.name, b.sort_order, b.id
        ');
        Http::json(['success' => true, 'items' => $stmt->fetchAll()]);
    }

    // Default: regions
    $stmt = $pdo->query('
        SELECT r.*,
               (SELECT COUNT(*) FROM asmt_districts) AS districts_count
        FROM asmt_regions r
        ORDER BY r.name
    ');
    Http::json(['success' => true, 'items' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $user = Auth::requireRole(['superadmin', 'region_admin']);
    $payload = Http::readJson();
    $type = trim((string)($payload['type'] ?? 'region'));

    if ($type === 'region') {
        $id = (int)($payload['id'] ?? 0);
        $code = strtoupper(trim((string)($payload['code'] ?? '')));
        $name = trim((string)($payload['name'] ?? ''));
        $isActive = !empty($payload['isActive']);

        if ($code === '' || $name === '') {
            Http::json(['success' => false, 'error' => 'Заполните код и название региона'], 400);
        }

        if ($id > 0) {
            $pdo->prepare('UPDATE asmt_regions SET code = ?, name = ?, is_active = ? WHERE id = ?')
                ->execute([$code, $name, $isActive ? 'true' : 'false', $id]);
        } else {
            $pdo->prepare('INSERT INTO asmt_regions (code, name, is_active) VALUES (?, ?, ?)')
                ->execute([$code, $name, $isActive ? 'true' : 'false']);
        }
        Http::json(['success' => true]);
    }

    if ($type === 'district') {
        $id = (int)($payload['id'] ?? 0);
        $name = trim((string)($payload['name'] ?? ''));
        $isSeparate = !empty($payload['isSeparateCity']);
        $isActive = !empty($payload['isActive']);
        $sortOrder = (int)($payload['sortOrder'] ?? 0);

        if ($name === '') {
            Http::json(['success' => false, 'error' => 'Введите наименование района'], 400);
        }

        if ($id > 0) {
            $pdo->prepare('UPDATE asmt_districts SET name = ?, is_separate_city = ?, is_active = ?, sort_order = ? WHERE id = ?')
                ->execute([$name, $isSeparate ? 'true' : 'false', $isActive ? 'true' : 'false', $sortOrder, $id]);
        } else {
            $pdo->prepare('INSERT INTO asmt_districts (name, is_separate_city, is_active, sort_order) VALUES (?, ?, ?, ?)')
                ->execute([$name, $isSeparate ? 'true' : 'false', $isActive ? 'true' : 'false', $sortOrder]);
        }
        Http::json(['success' => true]);
    }

    if ($type === 'banner') {
        $id = (int)($payload['id'] ?? 0);
        $regionId = (int)($payload['regionId'] ?? 0);
        $title = trim((string)($payload['title'] ?? ''));
        $body = trim((string)($payload['body'] ?? ''));
        $linkUrl = trim((string)($payload['linkUrl'] ?? ''));
        $isActive = !empty($payload['isActive']);

        if ($regionId <= 0 || $title === '') {
            Http::json(['success' => false, 'error' => 'Укажите регион и заголовок баннера'], 400);
        }

        if ($id > 0) {
            $pdo->prepare('UPDATE asmt_region_banners SET region_id = ?, title = ?, body = ?, link_url = ?, is_active = ? WHERE id = ?')
                ->execute([$regionId, $title, $body, $linkUrl, $isActive ? 'true' : 'false', $id]);
        } else {
            $pdo->prepare('INSERT INTO asmt_region_banners (region_id, title, body, link_url, is_active) VALUES (?, ?, ?, ?, ?)')
                ->execute([$regionId, $title, $body, $linkUrl, $isActive ? 'true' : 'false']);
        }
        Http::json(['success' => true]);
    }

    Http::json(['success' => false, 'error' => 'Неизвестный тип справочника'], 400);
}

Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
