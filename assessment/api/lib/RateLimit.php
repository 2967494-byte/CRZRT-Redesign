<?php
declare(strict_types=1);

namespace Asmt;

final class RateLimit
{
    private static ?\Redis $redisClient = null;
    private static bool $redisAttempted = false;

    private static function getRedis(): ?\Redis
    {
        if (self::$redisAttempted) {
            return self::$redisClient;
        }
        self::$redisAttempted = true;

        $host = Config::get('ASMT_REDIS_HOST', Config::get('REDIS_HOST', ''));
        if (!$host) {
            return null;
        }
        $port = (int)(Config::get('ASMT_REDIS_PORT', Config::get('REDIS_PORT', '6379')) ?: 6379);
        $pass = Config::get('ASMT_REDIS_PASSWORD', Config::get('REDIS_PASSWORD', ''));

        try {
            $r = new \Redis();
            if ($r->connect($host, $port, 1.5)) {
                if ($pass !== null && $pass !== '') {
                    $r->auth($pass);
                }
                self::$redisClient = $r;
            }
        } catch (\Throwable $_e) {
            self::$redisClient = null;
        }

        return self::$redisClient;
    }

    public static function check(string $bucket, string $key, int $maxRequests, int $windowSeconds): bool
    {
        $redis = self::getRedis();
        if ($redis) {
            return self::checkRedis($redis, $bucket, $key, $maxRequests, $windowSeconds);
        }
        return self::checkFile($bucket, $key, $maxRequests, $windowSeconds);
    }

    private static function checkRedis(\Redis $redis, string $bucket, string $key, int $maxRequests, int $windowSeconds): bool
    {
        $redisKey = "asmt:ratelimit:{$bucket}:" . md5($key);
        // Atomic Lua script: increment and set TTL on first hit
        $lua = "
            local current = redis.call('INCR', KEYS[1])
            if current == 1 then
                redis.call('EXPIRE', KEYS[1], ARGV[1])
            end
            return current
        ";
        try {
            $count = (int)$redis->eval($lua, [$redisKey, $windowSeconds], 1);
            return $count <= $maxRequests;
        } catch (\Throwable $_e) {
            // Fallback to file on Redis failure
            return self::checkFile($bucket, $key, $maxRequests, $windowSeconds);
        }
    }

    private static function checkFile(string $bucket, string $key, int $maxRequests, int $windowSeconds): bool
    {
        $dir = dirname(__DIR__, 2) . '/storage/ratelimit';
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        $file = $dir . '/' . $bucket . '_' . md5($key) . '.json';
        $now = time();

        $fp = @fopen($file, 'c+');
        if (!$fp) {
            return true;
        }
        if (!flock($fp, LOCK_EX)) {
            fclose($fp);
            return true;
        }

        $size = (int)filesize($file);
        $content = $size > 0 ? (string)fread($fp, $size) : '';
        $data = json_decode($content, true);
        if (!is_array($data) || empty($data['window_start']) || ($now - (int)$data['window_start']) > $windowSeconds) {
            $data = ['window_start' => $now, 'count' => 1];
        } else {
            $data['count'] = (int)($data['count'] ?? 0) + 1;
        }

        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, (string)json_encode($data));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);

        return (int)$data['count'] <= $maxRequests;
    }
}
