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

    public static function clientIp(): ?string
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? null;
        return is_string($ip) && $ip !== '' ? $ip : null;
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
}
