<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;
use Asmt\Mailer;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    Http::json(['ok' => true], 204);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
}

\Asmt\RateLimit::hit('register', 10, 600);

$payload = Http::readJson();

$required = [
    'lastName', 'firstName', 'middleName', 'phone', 'email',
    'organizationName', 'inn', 'position', 'experienceLevel',
    'education', 'specialty', 'customerLevel',
];
foreach ($required as $field) {
    if (trim((string)($payload[$field] ?? '')) === '') {
        Http::json(['success' => false, 'error' => 'Заполните все обязательные поля'], 400);
    }
}

if (empty($payload['consentPd']) || empty($payload['consentPrivacy'])) {
    Http::json(['success' => false, 'error' => 'Необходимо принять согласия 152-ФЗ и политику конфиденциальности'], 400);
}

$email = Auth::normalizeEmail((string)$payload['email']);
$phone = Auth::normalizePhone((string)$payload['phone']);
$inn = preg_replace('/\D+/', '', (string)$payload['inn']) ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    Http::json(['success' => false, 'error' => 'Некорректный email'], 400);
}
if (strlen($phone) !== 11 || $phone[0] !== '7') {
    Http::json(['success' => false, 'error' => 'Некорректный телефон'], 400);
}
if (!in_array(strlen($inn), [10, 12], true)) {
    Http::json(['success' => false, 'error' => 'ИНН должен содержать 10 или 12 цифр'], 400);
}

$pdo = Db::pdo();

$exists = $pdo->prepare('SELECT id FROM asmt_users WHERE email_normalized = ? OR phone_normalized = ? LIMIT 1');
$exists->execute([$email, $phone]);
if ($exists->fetch()) {
    Http::json(['success' => false, 'error' => 'Пользователь с таким email или телефоном уже зарегистрирован. Войдите в личный кабинет.'], 409);
}

$customerLevel = (string)$payload['customerLevel'];
$districtId = isset($payload['districtId']) && $payload['districtId'] !== '' ? (int)$payload['districtId'] : null;
$districtOther = trim((string)($payload['districtOther'] ?? ''));
if ($customerLevel === 'federal') {
    $districtOther = $districtOther !== '' ? $districtOther : 'Иное';
}

$passwordPlain = Auth::generatePassword(10);
$passwordHash = password_hash($passwordPlain, PASSWORD_BCRYPT);

$pdo->beginTransaction();
try {
    $orgId = null;
    $findOrg = $pdo->prepare(
        'SELECT id, name, customer_level, status FROM asmt_organizations WHERE inn = ? AND level = 3 LIMIT 1'
    );
    $findOrg->execute([$inn]);
    $org = $findOrg->fetch();
    if ($org) {
        $orgId = (int)$org['id'];
        // Directory hit: keep official name / customer level from registry
        if ($org['customer_level'] !== '') {
            $customerLevel = (string)$org['customer_level'];
        }
    } else {
        $insOrg = $pdo->prepare(
            'INSERT INTO asmt_organizations (parent_id, level, name, inn, customer_level, status)
             VALUES (NULL, 3, ?, ?, ?, \'pending\') RETURNING id'
        );
        $insOrg->execute([
            trim((string)$payload['organizationName']),
            $inn,
            $customerLevel,
        ]);
        $orgId = (int)$insOrg->fetchColumn();
    }

    $regionId = !empty($payload['regionId']) && (int)$payload['regionId'] > 0
        ? (int)$payload['regionId']
        : (int)($pdo->query("SELECT id FROM asmt_regions WHERE code = '16' LIMIT 1")->fetchColumn() ?: 16);

    $insUser = $pdo->prepare(
        'INSERT INTO asmt_users (
            email_normalized, phone_normalized, password_hash,
            last_name, first_name, middle_name, position, experience_level,
            education, specialty, customer_level, district_id, district_other_text,
            region_id, role, consent_pd_at, consent_privacy_at
         ) VALUES (
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,\'participant\', NOW(), NOW()
         ) RETURNING id'
    );
    $cleanNameFn = static function ($str): string {
        return trim(preg_replace('/(индивидуальный предприниматель|ип|предприниматель)/ui', '', (string)$str));
    };

    $insUser->execute([
        $email,
        $phone,
        $passwordHash,
        $cleanNameFn($payload['lastName']),
        $cleanNameFn($payload['firstName']),
        $cleanNameFn($payload['middleName']),
        trim((string)$payload['position']),
        trim((string)$payload['experienceLevel']),
        trim((string)$payload['education']),
        trim((string)$payload['specialty']),
        $customerLevel,
        $districtId,
        $districtOther,
        $regionId ?: null,
    ]);
    $userId = (int)$insUser->fetchColumn();

    $link = $pdo->prepare(
        'INSERT INTO asmt_user_organizations (user_id, organization_id, status)
         VALUES (?, ?, \'pending\')'
    );
    $link->execute([$userId, $orgId]);

    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    Http::json(['success' => false, 'error' => 'Ошибка регистрации: ' . $e->getMessage()], 500);
}

$loginUrl = \Asmt\Config::appUrl() . '/login.html';
Mailer::send(
    $email,
    'Регистрация в модуле тестирования ЦРЗ РТ',
    "Здравствуйте!\n\nВаш логин: {$email}\nПароль: {$passwordPlain}\n\nВход: {$loginUrl}\n\nСохраните пароль. При утере используйте восстановление на странице входа.\n"
);

$userStmt = $pdo->prepare('SELECT * FROM asmt_users WHERE id = ?');
$userStmt->execute([$userId]);
$user = $userStmt->fetch();
Auth::login($user);

Http::json([
    'success' => true,
    'message' => 'Регистрация выполнена',
    'login' => $email,
    'password' => $passwordPlain,
    'moderationStatus' => 'pending',
    'redirect' => 'cabinet.html',
]);
