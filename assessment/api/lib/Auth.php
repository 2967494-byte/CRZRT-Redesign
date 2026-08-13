<?php
declare(strict_types=1);

namespace Asmt;

final class Auth
{
    public static function startSession(): void
    {
        Config::load();
        $name = Config::get('ASMT_SESSION_NAME', 'ASMTSESSID') ?? 'ASMTSESSID';
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_name($name);
            session_start([
                'cookie_httponly' => true,
                'cookie_samesite' => 'Lax',
                'use_strict_mode' => true,
            ]);
        }
    }

    public static function userId(): ?int
    {
        self::startSession();
        $id = $_SESSION['asmt_user_id'] ?? null;
        return is_int($id) || (is_string($id) && ctype_digit($id)) ? (int)$id : null;
    }

    public static function requireUser(): array
    {
        $id = self::userId();
        if (!$id) {
            Http::json(['success' => false, 'error' => 'Требуется авторизация'], 401);
        }
        $stmt = Db::pdo()->prepare('SELECT * FROM asmt_users WHERE id = ? AND status = \'active\'');
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        if (!$user) {
            self::logout();
            Http::json(['success' => false, 'error' => 'Сессия недействительна'], 401);
        }
        return $user;
    }

    /** @param string[] $roles */
    public static function requireRole(array $roles): array
    {
        $user = self::requireUser();
        if (!in_array($user['role'], $roles, true)) {
            Http::json(['success' => false, 'error' => 'Недостаточно прав'], 403);
        }
        return $user;
    }

    public static function createAuthToken(int $userId, string $type, int $ttlSeconds = 86400): string
    {
        $plain = bin2hex(random_bytes(32));
        $hash = hash('sha256', $plain);
        $stmt = Db::pdo()->prepare(
            'INSERT INTO asmt_auth_tokens (user_id, token_hash, type, expires_at)
             VALUES (?, ?, ?, NOW() + (? || \' seconds\')::interval)'
        );
        $stmt->execute([$userId, $hash, $type, (string)$ttlSeconds]);
        return $plain;
    }

    public static function consumeAuthToken(string $plain, string $type): ?array
    {
        $hash = hash('sha256', $plain);
        $pdo = Db::pdo();
        $stmt = $pdo->prepare(
            'SELECT t.*, u.email_normalized
             FROM asmt_auth_tokens t
             JOIN asmt_users u ON u.id = t.user_id
             WHERE t.token_hash = ? AND t.type = ? AND t.used_at IS NULL AND t.expires_at > NOW()
             LIMIT 1'
        );
        $stmt->execute([$hash, $type]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        $pdo->prepare('UPDATE asmt_auth_tokens SET used_at = NOW() WHERE id = ?')->execute([(int)$row['id']]);
        return $row;
    }

    public static function login(array $user): void
    {
        self::startSession();
        session_regenerate_id(true);
        $_SESSION['asmt_user_id'] = (int)$user['id'];
        $_SESSION['asmt_user_role'] = $user['role'];
        $stmt = Db::pdo()->prepare('UPDATE asmt_users SET last_login_at = NOW() WHERE id = ?');
        $stmt->execute([(int)$user['id']]);
    }

    public static function logout(): void
    {
        self::startSession();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
        }
        session_destroy();
    }

    public static function normalizeEmail(string $email): string
    {
        return \mb_strtolower(trim($email));
    }

    public static function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone) ?? '';
        if (strlen($digits) === 11 && ($digits[0] === '8' || $digits[0] === '7')) {
            $digits = '7' . substr($digits, 1);
        } elseif (strlen($digits) === 10) {
            $digits = '7' . $digits;
        }
        return $digits;
    }

    public static function generatePassword(int $length = 10): string
    {
        $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
        $out = '';
        for ($i = 0; $i < $length; $i++) {
            $out .= $alphabet[random_int(0, strlen($alphabet) - 1)];
        }
        return $out;
    }
}
