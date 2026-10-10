<?php
declare(strict_types=1);

namespace Asmt;

/**
 * Service to retrieve REG.RU / Reg.Cloud balance.
 * Supports:
 * 1. Reg.Cloud (api.cloudvps.reg.ru/v1/balance_data) via ASMT_REGRU_TOKEN (Рег.облако / Cloud VPS)
 * 2. Classic Reg.ru (api.reg.ru/api/regru2/user/get_balance) via ASMT_REGRU_USERNAME + ASMT_REGRU_PASSWORD
 */
final class RegRuService
{
    private const CLOUD_API_URL = 'https://api.cloudvps.reg.ru/v1/balance_data';
    private const CLASSIC_API_URL = 'https://api.reg.ru/api/regru2/user/get_balance';
    private const CACHE_TTL = 300; // 5 минут

    /**
     * @return array{
     *   configured: bool,
     *   balance: ?float,
     *   credit: ?float,
     *   currency: string,
     *   is_low: bool,
     *   days_left: ?int,
     *   cached: bool,
     *   updated_at: ?string,
     *   error: ?string,
     *   type: string
     * }
     */
    public static function getBalance(bool $forceFresh = false): array
    {
        $token = Config::get('ASMT_REGRU_TOKEN') ?: Config::get('ASMT_REGRU_API_TOKEN');
        $username = Config::get('ASMT_REGRU_USERNAME', '');
        $password = Config::get('ASMT_REGRU_PASSWORD', '');

        if (!$token && ($username === '' || $password === '')) {
            return [
                'configured' => false,
                'balance' => null,
                'credit' => null,
                'currency' => 'RUB',
                'is_low' => false,
                'days_left' => null,
                'cached' => false,
                'updated_at' => null,
                'error' => 'API не настроен (укажите ASMT_REGRU_TOKEN из рег.облака в .env)',
                'type' => 'none',
            ];
        }

        $cacheDir = dirname(__DIR__, 2) . '/storage';
        $cacheFile = is_dir($cacheDir) && is_writable($cacheDir)
            ? $cacheDir . '/regru_balance_cache.json'
            : sys_get_temp_dir() . '/asmt_regru_balance_cache.json';

        if (!$forceFresh && is_file($cacheFile)) {
            $raw = @file_get_contents($cacheFile);
            if ($raw !== false && $raw !== '') {
                $cached = json_decode($raw, true);
                if (is_array($cached) && !empty($cached['timestamp']) && (time() - $cached['timestamp']) < self::CACHE_TTL) {
                    $data = $cached['data'] ?? [];
                    if (is_array($data)) {
                        $data['cached'] = true;
                        return $data;
                    }
                }
            }
        }

        // 1. Если указан токен Рег.облака (Cloud VPS) — используем его
        if (!empty($token)) {
            $res = self::fetchCloudBalance(trim((string)$token));
        } else {
            // 2. Иначе классический API Reg.ru
            $res = self::fetchClassicBalance($username, $password);
        }

        @file_put_contents($cacheFile, json_encode([
            'timestamp' => time(),
            'data' => $res,
        ], JSON_UNESCAPED_UNICODE));

        return $res;
    }

    private static function fetchCloudBalance(string $token): array
    {
        $headers = [
            'Authorization: Bearer ' . $token,
            'Accept: application/json',
            'User-Agent: CRZRT-Assessment/1.0',
        ];

        $raw = false;
        $httpCode = 0;

        if (\function_exists('curl_init')) {
            $ch = \curl_init(self::CLOUD_API_URL);
            if ($ch !== false) {
                \curl_setopt_array($ch, [
                    CURLOPT_HTTPGET => true,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_CONNECTTIMEOUT => 4,
                    CURLOPT_TIMEOUT => 6,
                    CURLOPT_HTTPHEADER => $headers,
                ]);
                $raw = \curl_exec($ch);
                $httpCode = (int)\curl_getinfo($ch, CURLINFO_HTTP_CODE);
                \curl_close($ch);
            }
        }

        if ($raw === false && \ini_get('allow_url_fopen')) {
            $ctx = \stream_context_create([
                'http' => [
                    'method' => 'GET',
                    'header' => implode("\r\n", $headers) . "\r\n",
                    'timeout' => 6,
                    'ignore_errors' => true,
                ],
                'ssl' => [
                    'verify_peer' => true,
                    'verify_peer_name' => true,
                ],
            ]);
            $raw = @\file_get_contents(self::CLOUD_API_URL, false, $ctx);
            if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
                $httpCode = (int)$m[1];
            } else {
                $httpCode = $raw !== false ? 200 : 500;
            }
        }

        if ($raw === false || $raw === '') {
            return [
                'configured' => true,
                'balance' => null,
                'credit' => null,
                'currency' => 'RUB',
                'is_low' => false,
                'days_left' => null,
                'cached' => false,
                'updated_at' => date('d.m.Y H:i'),
                'error' => 'Сетевая ошибка при обращении к API Рег.облака',
                'type' => 'cloud',
            ];
        }

        $json = json_decode($raw, true);
        if (!is_array($json)) {
            return [
                'configured' => true,
                'balance' => null,
                'credit' => null,
                'currency' => 'RUB',
                'is_low' => false,
                'days_left' => null,
                'cached' => false,
                'updated_at' => date('d.m.Y H:i'),
                'error' => 'Некорректный ответ от API Рег.облака',
                'type' => 'cloud',
            ];
        }

        if ($httpCode >= 400 || isset($json['errors']) || isset($json['error'])) {
            $msg = $json['errors'][0]['message'] ?? $json['error'] ?? 'Неверный токен API Рег.облака';
            return [
                'configured' => true,
                'balance' => null,
                'credit' => null,
                'currency' => 'RUB',
                'is_low' => false,
                'days_left' => null,
                'cached' => false,
                'updated_at' => date('d.m.Y H:i'),
                'error' => 'Рег.облако: ' . $msg,
                'type' => 'cloud',
            ];
        }

        $bData = $json['balance_data'] ?? $json;
        $balance = isset($bData['balance']) ? (float)$bData['balance'] : 0.0;
        $bonus = isset($bData['bonus_balance']) ? (float)$bData['bonus_balance'] : 0.0;
        $totalBalance = round($balance + $bonus, 2);
        $daysLeft = isset($bData['days_left']) ? (int)$bData['days_left'] : null;

        return [
            'configured' => true,
            'balance' => $totalBalance,
            'credit' => $bonus,
            'currency' => 'RUB',
            'is_low' => ($totalBalance < 500.0),
            'days_left' => $daysLeft,
            'cached' => false,
            'updated_at' => date('d.m.Y H:i'),
            'error' => null,
            'type' => 'cloud',
        ];
    }

    private static function fetchClassicBalance(string $username, string $password): array
    {
        $postFields = [
            'username' => $username,
            'password' => $password,
            'output_format' => 'json',
        ];
        $postBody = http_build_query($postFields);

        $raw = false;
        $httpCode = 0;

        if (\function_exists('curl_init')) {
            $ch = \curl_init(self::CLASSIC_API_URL);
            if ($ch !== false) {
                \curl_setopt_array($ch, [
                    CURLOPT_POST => true,
                    CURLOPT_POSTFIELDS => $postBody,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_CONNECTTIMEOUT => 4,
                    CURLOPT_TIMEOUT => 6,
                    CURLOPT_HTTPHEADER => [
                        'Content-Type: application/x-www-form-urlencoded',
                        'Accept: application/json',
                        'User-Agent: CRZRT-Assessment/1.0',
                    ],
                ]);
                $raw = \curl_exec($ch);
                $httpCode = (int)\curl_getinfo($ch, CURLINFO_HTTP_CODE);
                \curl_close($ch);
            }
        }

        if ($raw === false && \ini_get('allow_url_fopen')) {
            $ctx = \stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' => "Content-Type: application/x-www-form-urlencoded\r\n" .
                                "Accept: application/json\r\n" .
                                "User-Agent: CRZRT-Assessment/1.0\r\n",
                    'content' => $postBody,
                    'timeout' => 6,
                    'ignore_errors' => true,
                ],
                'ssl' => [
                    'verify_peer' => true,
                    'verify_peer_name' => true,
                ],
            ]);
            $raw = @\file_get_contents(self::CLASSIC_API_URL, false, $ctx);
            if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
                $httpCode = (int)$m[1];
            } else {
                $httpCode = $raw !== false ? 200 : 500;
            }
        }

        if ($raw === false || $raw === '') {
            return [
                'configured' => true,
                'balance' => null,
                'credit' => null,
                'currency' => 'RUB',
                'is_low' => false,
                'days_left' => null,
                'cached' => false,
                'updated_at' => date('d.m.Y H:i'),
                'error' => 'Сетевая ошибка при обращении к API REG.RU',
                'type' => 'classic',
            ];
        }

        $json = json_decode($raw, true);
        if (!is_array($json)) {
            return [
                'configured' => true,
                'balance' => null,
                'credit' => null,
                'currency' => 'RUB',
                'is_low' => false,
                'days_left' => null,
                'cached' => false,
                'updated_at' => date('d.m.Y H:i'),
                'error' => 'Некорректный ответ от REG.RU API',
                'type' => 'classic',
            ];
        }

        if (($json['result'] ?? '') !== 'success') {
            $errCode = $json['error_code'] ?? 'UNKNOWN_ERROR';
            $errText = $json['error_text'] ?? 'Ошибка запроса к REG.RU';
            $hint = '';
            if ($errCode === 'ACCESS_DENIED_FROM_IP') {
                $hint = ' (IP сервера не добавлен в белый список в ЛК REG.RU)';
            } elseif ($errCode === 'PASSWORD_AUTH_FAILED' || $errCode === 'AUTHENTICATION_FAILED') {
                $hint = ' (проверьте логин и пароль API в .env)';
            }
            return [
                'configured' => true,
                'balance' => null,
                'credit' => null,
                'currency' => 'RUB',
                'is_low' => false,
                'days_left' => null,
                'cached' => false,
                'updated_at' => date('d.m.Y H:i'),
                'error' => "REG.RU: {$errCode} — {$errText}{$hint}",
                'type' => 'classic',
            ];
        }

        $answer = $json['answer'] ?? [];
        $prepay = isset($answer['prepay']) ? (float)$answer['prepay'] : 0.0;
        $credit = isset($answer['credit']) ? (float)$answer['credit'] : 0.0;
        $curr = $answer['currency'] ?? 'RUB';
        if ($curr === 'RUR') {
            $curr = 'RUB';
        }

        return [
            'configured' => true,
            'balance' => $prepay,
            'credit' => $credit,
            'currency' => $curr,
            'is_low' => ($prepay < 500.0),
            'days_left' => null,
            'cached' => false,
            'updated_at' => date('d.m.Y H:i'),
            'error' => null,
            'type' => 'classic',
        ];
    }
}
