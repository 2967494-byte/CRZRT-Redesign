<?php
declare(strict_types=1);

namespace Asmt;

final class RateLimit
{
    /** @var object|null */
    private static ?object $redisClient = null;
    private static bool $redisAttempted = false;

    private static function getRedis(): ?object
    {
        if (self::$redisAttempted) {
            return self::$redisClient;
        }
        self::$redisAttempted = true;

        if (!class_exists('\Redis')) {
            return null;
        }

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

    public static function hit(string $bucket, int $maxRequests = 20, int $windowSeconds = 300): void
    {
        self::hitKey($bucket, Http::clientIp() ?? '0.0.0.0', $maxRequests, $windowSeconds);
    }

    public static function hitKey(string $bucket, string $key, int $maxRequests, int $windowSeconds): void
    {
        if (!self::check($bucket, $key, $maxRequests, $windowSeconds)) {
            Http::json([
                'success' => false,
                'error' => 'Слишком много запросов. Пожалуйста, подождите несколько минут.',
            ], 429);
        }
    }

    public static function isBlocked(string $bucket, string $key, int $maxRequests, int $windowSeconds): bool
    {
        $redis = self::getRedis();
        if ($redis) {
            try {
                return self::isBlockedRedis($redis, $bucket, $key, $maxRequests);
            } catch (\Throwable $_e) {
                // Fall through to the file counter.
            }
        }
        return self::isBlockedFile($bucket, $key, $maxRequests, $windowSeconds);
    }

    public static function clear(string $bucket, string $key): void
    {
        $redis = self::getRedis();
        if ($redis) {
            try {
                $redis->del(self::redisKey($bucket, $key));
            } catch (\Throwable $_e) {
            }
        }
        $file = self::filePath($bucket, $key);
        if (is_file($file)) {
            @unlink($file);
        }
    }

    public static function check(string $bucket, string $key, int $maxRequests, int $windowSeconds): bool
    {
        $redis = self::getRedis();
        if ($redis) {
            return self::checkRedis($redis, $bucket, $key, $maxRequests, $windowSeconds);
        }
        return self::checkFile($bucket, $key, $maxRequests, $windowSeconds);
    }

    private static function redisKey(string $bucket, string $key): string
    {
        return "asmt:ratelimit:{$bucket}:" . md5($key);
    }

    private static function filePath(string $bucket, string $key): string
    {
        $dir = dirname(__DIR__, 2) . '/storage/ratelimit';
        return $dir . '/' . $bucket . '_' . md5($key) . '.json';
    }

    private static function checkRedis(object $redis, string $bucket, string $key, int $maxRequests, int $windowSeconds): bool
    {
        $redisKey = self::redisKey($bucket, $key);
        // Atomic Lua script: increment and set TTL on first hit
        $lua = "
            local current = redis.call('INCR', KEYS[1])
            if current == 1 then
                redis.call('EXPIRE', KEYS[1], ARGV[1])
            end
            return current
        ";
        try {
            /** @var mixed $redis */
            $count = (int)$redis->eval($lua, [$redisKey, $windowSeconds], 1);
            return $count <= $maxRequests;
        } catch (\Throwable $_e) {
            // Fallback to file on Redis failure
            return self::checkFile($bucket, $key, $maxRequests, $windowSeconds);
        }
    }

    private static function isBlockedRedis(object $redis, string $bucket, string $key, int $maxRequests): bool
    {
        $count = $redis->get(self::redisKey($bucket, $key));
        if ($count === false || $count === null) {
            return false;
        }
        return (int)$count >= $maxRequests;
    }

    /**
     * Buckets that let traffic through when the counter storage is broken. The site-wide
     * ceiling must not turn a storage misconfiguration into a full outage; auth buckets stay closed.
     */
    private const FAIL_OPEN_BUCKETS = ['api', 'api-user'];

    private static function storageFailure(string $bucket, string $message): bool
    {
        error_log('[ASMT][ratelimit] ' . $message);
        return in_array($bucket, self::FAIL_OPEN_BUCKETS, true);
    }

    private static function checkFile(string $bucket, string $key, int $maxRequests, int $windowSeconds): bool
    {
        $file = self::filePath($bucket, $key);
        $dir = dirname($file);
        if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
            return self::storageFailure($bucket, 'cannot create ' . $dir);
        }
        $now = time();

        $fp = @fopen($file, 'c+');
        if (!$fp) {
            return self::storageFailure($bucket, 'cannot open ' . $file);
        }
        if (!flock($fp, LOCK_EX)) {
            fclose($fp);
            return self::storageFailure($bucket, 'cannot lock ' . $file);
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

        if (random_int(1, 100) === 1) {
            self::collectGarbage($dir);
        }

        return (int)$data['count'] <= $maxRequests;
    }

    /** Must stay above the longest window passed to check()/hit(). */
    private const FILE_MAX_AGE_SECONDS = 2 * 86400;
    private const GC_MAX_FILES_PER_RUN = 5000;

    private static function collectGarbage(string $dir): void
    {
        $handle = @opendir($dir);
        if (!$handle) {
            return;
        }
        $cutoff = time() - self::FILE_MAX_AGE_SECONDS;
        $seen = 0;
        while (($entry = readdir($handle)) !== false && $seen < self::GC_MAX_FILES_PER_RUN) {
            if (!str_ends_with($entry, '.json')) {
                continue;
            }
            $seen++;
            $path = $dir . '/' . $entry;
            $mtime = @filemtime($path);
            if ($mtime !== false && $mtime < $cutoff) {
                @unlink($path);
            }
        }
        closedir($handle);
    }

    private static function isBlockedFile(string $bucket, string $key, int $maxRequests, int $windowSeconds): bool
    {
        $file = self::filePath($bucket, $key);
        if (!is_file($file)) {
            return false;
        }
        $fp = @fopen($file, 'rb');
        if (!$fp) {
            return true;
        }
        if (!flock($fp, LOCK_SH)) {
            fclose($fp);
            return true;
        }
        $content = stream_get_contents($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
        $data = json_decode(is_string($content) ? $content : '', true);
        if (!is_array($data) || empty($data['window_start'])) {
            return false;
        }
        if ((time() - (int)$data['window_start']) > $windowSeconds) {
            return false;
        }
        return (int)($data['count'] ?? 0) >= $maxRequests;
    }
}
