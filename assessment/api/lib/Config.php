<?php
declare(strict_types=1);

namespace Asmt;

final class Config
{
    /** @var array<string,string> */
    private static array $env = [];
    private static bool $loaded = false;

    public static function load(?string $root = null): void
    {
        if (self::$loaded && $root === null) {
            return;
        }
        $possibleFiles = [
            $root ? $root . '/.env' : null,
            dirname(__DIR__) . '/.env',
            dirname(dirname(__DIR__)) . '/.env',
            dirname(dirname(dirname(__DIR__))) . '/.env',
        ];
        $file = null;
        foreach ($possibleFiles as $pf) {
            if ($pf && is_file($pf)) {
                $file = $pf;
                break;
            }
        }
        if (is_file($file)) {
            foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                    continue;
                }
                [$k, $v] = explode('=', $line, 2);
                self::$env[trim($k)] = trim($v, " \t\"'");
            }
        }
        foreach ($_ENV as $k => $v) {
            if (is_string($k) && is_string($v) && str_starts_with($k, 'ASMT_')) {
                self::$env[$k] = $v;
            }
        }
        foreach ($_SERVER as $k => $v) {
            if (is_string($k) && is_string($v) && str_starts_with($k, 'ASMT_')) {
                self::$env[$k] = $v;
            }
        }
        self::$loaded = true;
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        if (isset(self::$env[$key])) {
            return self::$env[$key];
        }
        $v = getenv($key);
        if (is_string($v) && $v !== '') {
            return $v;
        }
        return $default;
    }

    public static function require(string $key): string
    {
        $v = self::get($key);
        if ($v === null || $v === '') {
            throw new \RuntimeException("Missing config: {$key}");
        }
        return $v;
    }

    public static function appUrl(): string
    {
        return rtrim(self::get('ASMT_APP_URL', 'http://localhost:8080') ?? '', '/');
    }
}
