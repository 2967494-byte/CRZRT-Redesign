<?php
declare(strict_types=1);

namespace Asmt;

final class RateLimit
{
    public static function hit(string $bucket, int $max, int $windowSeconds): void
    {
        $ip = Http::clientIp() ?? 'unknown';
        $key = hash('sha256', $bucket . '|' . $ip);
        $dir = dirname(__DIR__, 2) . '/storage/ratelimit';
        if (!is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }
        $file = $dir . '/' . $key . '.json';
        $now = time();
        $data = ['start' => $now, 'count' => 0];
        if (is_file($file)) {
            $raw = json_decode((string)file_get_contents($file), true);
            if (is_array($raw) && isset($raw['start'], $raw['count'])) {
                $data = $raw;
            }
        }
        if (($now - (int)$data['start']) >= $windowSeconds) {
            $data = ['start' => $now, 'count' => 0];
        }
        $data['count'] = (int)$data['count'] + 1;
        file_put_contents($file, json_encode($data), LOCK_EX);
        if ($data['count'] > $max) {
            Http::json([
                'success' => false,
                'error' => 'Слишком много запросов. Попробуйте позже.',
            ], 429);
        }
    }
}
