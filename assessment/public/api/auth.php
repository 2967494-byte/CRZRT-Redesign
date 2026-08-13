<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use Asmt\Auth;
use Asmt\Db;
use Asmt\Http;

$action = $_GET['action'] ?? 'login';
$pdo = Db::pdo();

if ($action === 'logout') {
    Auth::logout();
    Http::json(['success' => true]);
}

if ($action === 'me') {
    $id = Auth::userId();
    if (!$id) {
        Http::json(['success' => false, 'authenticated' => false], 200);
    }
    $user = Auth::requireUser();
    Http::json([
        'success' => true,
        'authenticated' => true,
        'user' => publicUser($user),
    ]);
}

if ($action === 'set-region') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
    }
    $user = Auth::requireUser();
    $payload = Http::readJson();
    $regionId = isset($payload['regionId']) && (int)$payload['regionId'] > 0 ? (int)$payload['regionId'] : null;

    $pdo->prepare('UPDATE asmt_users SET region_id = ? WHERE id = ?')
        ->execute([$regionId, (int)$user['id']]);

    // Получаем обновленного пользователя
    $stmt = $pdo->prepare('SELECT * FROM asmt_users WHERE id = ?');
    $stmt->execute([(int)$user['id']]);
    $updatedUser = $stmt->fetch();
    Auth::login($updatedUser);

    Http::json([
        'success' => true,
        'user' => publicUser($updatedUser),
    ]);
}

if ($action === 'login') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
    }
    \Asmt\RateLimit::hit('login', 20, 300);
    $payload = Http::readJson();
    $email = Auth::normalizeEmail((string)($payload['email'] ?? ''));
    $password = (string)($payload['password'] ?? '');
    if ($email === '' || $password === '') {
        Http::json(['success' => false, 'error' => 'Укажите email и пароль'], 400);
    }

    $stmt = $pdo->prepare('SELECT * FROM asmt_users WHERE email_normalized = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user || !password_verify($password, $user['password_hash'])) {
        Http::json(['success' => false, 'error' => 'Неверный email или пароль'], 401);
    }
    if ($user['status'] !== 'active') {
        Http::json(['success' => false, 'error' => 'Учётная запись заблокирована'], 403);
    }
    Auth::login($user);
    $redirect = in_array($user['role'], ['superadmin', 'region_admin', 'moderator', 'analyst'], true)
        ? 'admin.html'
        : 'cabinet.html';
    Http::json([
        'success' => true,
        'user' => publicUser($user),
        'redirect' => $redirect,
    ]);
}

if ($action === 'request-reset') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
    }
    \Asmt\RateLimit::hit('reset', 10, 600);
    $payload = Http::readJson();
    $email = Auth::normalizeEmail((string)($payload['email'] ?? ''));
    if ($email === '') {
        Http::json(['success' => false, 'error' => 'Укажите email'], 400);
    }
    $stmt = $pdo->prepare('SELECT * FROM asmt_users WHERE email_normalized = ? AND status = \'active\' LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if ($user) {
        $token = Auth::createAuthToken((int)$user['id'], 'reset', 86400);
        $link = \Asmt\Config::appUrl() . '/reset.html?token=' . urlencode($token);
        \Asmt\Mailer::send(
            $email,
            'Восстановление доступа — Assessment ЦРЗ РТ',
            "Здравствуйте!\n\nСсылка для сброса пароля (24 часа):\n{$link}\n\nЕсли вы не запрашивали сброс — проигнорируйте письмо.\n"
        );
    }
    Http::json([
        'success' => true,
        'message' => 'Если email зарегистрирован, ссылка отправлена (или записана в mail.log).',
    ]);
}

if ($action === 'reset-password') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        Http::json(['success' => false, 'error' => 'Метод не поддерживается'], 405);
    }
    \Asmt\RateLimit::hit('reset-consume', 20, 600);
    $payload = Http::readJson();
    $token = trim((string)($payload['token'] ?? ''));
    $password = (string)($payload['password'] ?? '');
    if ($token === '' || strlen($password) < 8) {
        Http::json(['success' => false, 'error' => 'Укажите токен и пароль не короче 8 символов'], 400);
    }
    $row = Auth::consumeAuthToken($token, 'reset');
    if (!$row) {
        Http::json(['success' => false, 'error' => 'Ссылка недействительна или устарела'], 400);
    }
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $pdo->prepare('UPDATE asmt_users SET password_hash = ? WHERE id = ?')
        ->execute([$hash, (int)$row['user_id']]);
    Http::json(['success' => true, 'message' => 'Пароль обновлён. Можно войти.', 'redirect' => 'login.html']);
}

Http::json(['success' => false, 'error' => 'Неизвестное действие'], 400);

function publicUser(array $user): array
{
    $pdo = Db::pdo();
    $regionName = null;
    if (!empty($user['region_id'])) {
        $stmt = $pdo->prepare('SELECT name FROM asmt_regions WHERE id = ?');
        $stmt->execute([(int)$user['region_id']]);
        $regionName = $stmt->fetchColumn() ?: null;
    }

    return [
        'id' => (int)$user['id'],
        'email' => $user['email_normalized'],
        'lastName' => $user['last_name'],
        'firstName' => $user['first_name'],
        'middleName' => $user['middle_name'],
        'role' => $user['role'],
        'phone' => $user['phone_normalized'],
        'position' => $user['position'],
        'regionId' => !empty($user['region_id']) ? (int)$user['region_id'] : null,
        'regionName' => $regionName,
    ];
}
