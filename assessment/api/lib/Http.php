<?php
declare(strict_types=1);

namespace Asmt;

final class Http
{
    private static bool $rawBodyRead = false;
    private static string $rawBody = '';

    public static function json(array $payload, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function readJson(): array
    {
        if (!self::$rawBodyRead) {
            self::$rawBodyRead = true;
            $raw = file_get_contents('php://input');
            self::$rawBody = is_string($raw) ? $raw : '';
        }
        if (trim(self::$rawBody) === '') {
            return [];
        }
        $data = json_decode(self::$rawBody, true);
        return is_array($data) ? $data : [];
    }

    public static function isHttps(): bool
    {
        $https = $_SERVER['HTTPS'] ?? '';
        if (is_string($https) && $https !== '' && strtolower($https) !== 'off') {
            return true;
        }
        if ((string)($_SERVER['SERVER_PORT'] ?? '') === '443') {
            return true;
        }

        $remote = $_SERVER['REMOTE_ADDR'] ?? '';
        if (is_string($remote) && filter_var($remote, FILTER_VALIDATE_IP) && self::isTrustedProxy($remote)) {
            $forwarded = strtolower(trim((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')));
            $parts = array_values(array_filter(array_map('trim', explode(',', $forwarded)), static fn(string $part): bool => $part !== ''));
            $proto = $parts === [] ? '' : (string)$parts[array_key_last($parts)];
            if ($proto === 'https') {
                return true;
            }
        }

        $forced = strtolower(trim((string)(Config::get('ASMT_COOKIE_SECURE', '') ?? '')));
        if (in_array($forced, ['1', 'true', 'yes', 'on'], true)) {
            return true;
        }
        $appUrl = strtolower(trim((string)(Config::get('ASMT_APP_URL', '') ?? '')));
        return str_starts_with($appUrl, 'https://');
    }

    public static function isTrustedProxy(string $ip): bool
    {
        if ($ip === '127.0.0.1' || $ip === '::1') {
            return true;
        }
        foreach (self::trustedProxyRules() as $rule) {
            if (self::ipMatchesRule($ip, $rule)) {
                return true;
            }
        }
        return false;
    }

    public static function clientIp(): ?string
    {
        $remote = $_SERVER['REMOTE_ADDR'] ?? null;
        if (!is_string($remote) || !filter_var($remote, FILTER_VALIDATE_IP)) {
            return null;
        }

        // Forwarded headers are client-controlled unless the immediate peer is a known proxy.
        // Use the rightmost untrusted hop: a proxy that appends $remote_addr puts the real client there.
        if (self::isTrustedProxy($remote)) {
            $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
            if (is_string($forwarded) && $forwarded !== '') {
                $hops = array_reverse(array_map('trim', explode(',', $forwarded)));
                foreach ($hops as $hop) {
                    if (!filter_var($hop, FILTER_VALIDATE_IP) || self::isTrustedProxy($hop)) {
                        continue;
                    }
                    return $hop;
                }
            }

            $real = trim((string)($_SERVER['HTTP_X_REAL_IP'] ?? ''));
            if (filter_var($real, FILTER_VALIDATE_IP) && !self::isTrustedProxy($real)) {
                return $real;
            }
        }

        return $remote;
    }

    /** @return list<string> */
    private static function trustedProxyRules(): array
    {
        $raw = trim((string)(Config::get('ASMT_TRUSTED_PROXIES', '') ?? ''));
        if ($raw === '') {
            return [];
        }
        $parts = preg_split('/[\s,]+/', $raw) ?: [];
        $rules = [];
        foreach ($parts as $part) {
            $part = trim((string)$part);
            if ($part !== '') {
                $rules[] = $part;
            }
        }
        return $rules;
    }

    private static function ipMatchesRule(string $ip, string $rule): bool
    {
        if (!str_contains($rule, '/')) {
            return strcasecmp($ip, $rule) === 0;
        }
        if (str_contains($ip, ':') || str_contains($rule, ':')) {
            return false;
        }
        [$subnet, $bitsRaw] = explode('/', $rule, 2);
        if (!ctype_digit($bitsRaw)) {
            return false;
        }
        $bits = (int)$bitsRaw;
        if ($bits < 0 || $bits > 32) {
            return false;
        }
        $ipLong = ip2long($ip);
        $subLong = ip2long($subnet);
        if ($ipLong === false || $subLong === false) {
            return false;
        }
        if ($bits === 0) {
            return true;
        }
        $mask = ((-1 << (32 - $bits)) & 0xFFFFFFFF);
        $ipLong &= 0xFFFFFFFF;
        $subLong &= 0xFFFFFFFF;
        return ($ipLong & $mask) === ($subLong & $mask);
    }

    public static function userAgent(): string
    {
        return (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
    }

    public static function deviceType(string $ua = ''): string
    {
        $ua = $ua !== '' ? $ua : self::userAgent();
        $uaLower = strtolower($ua);
        if (preg_match('/ipad|tablet|kindle|playbook|silk|(android(?!.*mobile))/i', $ua)) {
            return 'tablet';
        }
        if (preg_match('/mobi|iphone|ipod|android.*mobile|windows phone|opera mini/i', $uaLower)) {
            return 'mobile';
        }
        return 'desktop';
    }

    public static function verifyCsrf(): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if (in_array($method, ['GET', 'HEAD', 'OPTIONS'], true)) {
            return;
        }

        // Skip CSRF check if user is guest on public endpoints
        $userId = Auth::userId();
        if (!$userId) {
            return;
        }

        $sessionToken = $_SESSION['asmt_csrf_token'] ?? null;
        if (!$sessionToken) {
            self::json([
                'success' => false,
                'error' => 'CSRF token mismatch. Пожалуйста, обновите страницу.',
                'csrf_error' => true,
            ], 419);
        }

        // Cookie is not proof: the browser attaches it on its own. Require a header or body token.
        $receivedToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
        if (!$receivedToken) {
            $payload = self::readJson();
            $receivedToken = $payload['csrf_token'] ?? null;
        }

        if (!$receivedToken || !hash_equals((string)$sessionToken, (string)$receivedToken)) {
            self::json([
                'success' => false,
                'error' => 'CSRF token mismatch. Пожалуйста, обновите страницу.',
                'csrf_error' => true,
            ], 419);
        }
    }

    public static function logError(string $tag, \Throwable $e, ?int $userId = null): void
    {
        error_log(sprintf(
            '[ASMT][%s] %s | file=%s line=%d | user=%s ip=%s',
            $tag,
            $e->getMessage(),
            $e->getFile(),
            $e->getLine(),
            (string)($userId ?? Auth::userId() ?? 'guest'),
            (string)(self::clientIp() ?? 'unknown')
        ));
    }
}
