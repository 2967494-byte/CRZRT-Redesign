<?php
declare(strict_types=1);

namespace Asmt;

/**
 * Service to retrieve REG.RU hosting/domain balance via REG.API 2.0.
 */
final class RegRuService
{
    private const API_URL = 'https://api.reg.ru/api/regru2/user/get_balance';
    private const CACHE_TTL = 300; // 5 минут

    /**
     * @return array{
     *   configured: bool,
     *   balance: ?float,
     *   credit: ?float,
     *   currency: string,
     *   is_low: bool,
     *   cached: bool,
     *   updated_at: ?string,
     *   error: ?string,
     *   username: ?string
     * }
     */
    public static function getBalance(bool $forceFresh = false): array
    {
        $username = Config::get('ASMT_REGRU_USERNAME', '');
        $password = Config::get('ASMT_REGRU_PASSWORD', '');

        if ($username === '' || $password === '') {
            return [
                'configured' => false,
                'balance' => null,
                'credit' => null,
                'currency' => 'RUB',
                'is_low' => false,
                'cached' => false,
                'updated_at' => null,
                'error' => 'API REG.RU не настроен в .env (укажите ASMT_REGRU_USERNAME и ASMT_REGRU_PASSWORD)',
                'username' => null,
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

        $postFields = [
            'username' => $username,
            'password' => $password,
            'output_format' => 'json',
        ];
        $postBody = http_build_query($postFields);

        $raw = false;
        $httpCode = 0;

        if (\function_exists('curl_init')) {
            $ch = \curl_init(self::API_URL);
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
            $raw = @\file_get_contents(self::API_URL, false, $ctx);
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
                'cached' => false,
                'updated_at' => null,
                'error' => 'Сетевая ошибка при обращении к API REG.RU',
                'username' => $username,
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
                'cached' => false,
                'updated_at' => null,
                'error' => 'Некорректный ответ от REG.RU API',
                'username' => $username,
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
                'cached' => false,
                'updated_at' => null,
                'error' => "REG.RU: {$errCode} — {$errText}{$hint}",
                'username' => $username,
            ];
        }

        $answer = $json['answer'] ?? [];
        $prepay = isset($answer['prepay']) ? (float)$answer['prepay'] : 0.0;
        $credit = isset($answer['credit']) ? (float)$answer['credit'] : 0.0;
        $curr = $answer['currency'] ?? 'RUB';
        if ($curr === 'RUR') {
            $curr = 'RUB';
        }

        $resultData = [
            'configured' => true,
            'balance' => $prepay,
            'credit' => $credit,
            'currency' => $curr,
            'is_low' => ($prepay < 500.0),
            'cached' => false,
            'updated_at' => date('d.m.Y H:i'),
            'error' => null,
            'username' => $username,
        ];

        @file_put_contents($cacheFile, json_encode([
            'timestamp' => time(),
            'data' => $resultData,
        ], JSON_UNESCAPED_UNICODE));

        return $resultData;
    }
}
