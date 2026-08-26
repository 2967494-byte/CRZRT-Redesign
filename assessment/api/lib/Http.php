<?php
declare(strict_types=1);

namespace Asmt;

final class Http
{
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
        $raw = file_get_contents('php://input');
        if ($raw === false || trim($raw) === '') {
            return [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    public static function isTrustedProxy(string $ip): bool
    {
        if ($ip === '127.0.0.1' || $ip === '::1') {
            return true;
        }
        // Check private network CIDRs (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
        $long = ip2long($ip);
        if ($long === false) {
            return false;
        }
        $net10 = (ip2long('10.0.0.0') & ip2long('255.0.0.0')) === ($long & ip2long('255.0.0.0'));
        $net172 = (ip2long('172.16.0.0') & ip2long('255.240.0.0')) === ($long & ip2long('255.240.0.0'));
        $net192 = (ip2long('192.168.0.0') & ip2long('255.255.0.0')) === ($long & ip2long('255.255.0.0'));
        return $net10 || $net172 || $net192;
    }

    public static function clientIp(): ?string
    {
        $remote = $_SERVER['REMOTE_ADDR'] ?? null;
        if (!is_string($remote) || $remote === '') {
            return null;
        }

        // Only trust forwarded headers if remote is trusted proxy
        if (self::isTrustedProxy($remote)) {
            $candidates = [
                $_SERVER['HTTP_X_FORWARDED_FOR'] ?? null,
                $_SERVER['HTTP_X_REAL_IP'] ?? null,
            ];
            foreach ($candidates as $raw) {
                if (!is_string($raw) || $raw === '') {
                    continue;
                }
                $first = trim(explode(',', $raw)[0]);
                if (filter_var($first, FILTER_VALIDATE_IP)) {
                    return $first;
                }
            }
        }

        return filter_var($remote, FILTER_VALIDATE_IP) ? $remote : null;
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
            return;
        }

        $headerToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
        if (!$headerToken) {
            $payload = self::readJson();
            $headerToken = $payload['csrf_token'] ?? null;
        }

        if (!$headerToken || !hash_equals((string)$sessionToken, (string)$headerToken)) {
            self::json([
                'success' => false,
                'error' => 'CSRF token mismatch',
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
