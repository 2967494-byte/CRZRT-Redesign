<?php
declare(strict_types=1);

namespace Asmt;

/**
 * Lookup organization by INN via DaData with local PostgreSQL 24h caching.
 */
final class DaDataParty
{
    /**
     * @return array{name:string,inn:string,kpp:?string,ogrn:?string,type:?string,status:?string,address:?string}|null
     */
    public static function findByInn(string $inn): ?array
    {
        $innClean = preg_replace('/\D+/', '', $inn) ?? $inn;
        if ($innClean === '') {
            return null;
        }

        // 1. Check local DB cache (24h TTL)
        try {
            $pdo = Db::pdo();
            $stmt = $pdo->prepare(
                "SELECT data_json FROM asmt_dadata_cache 
                 WHERE inn = ? AND fetched_at > NOW() - INTERVAL '24 hours'
                 LIMIT 1"
            );
            $stmt->execute([$innClean]);
            $cached = $stmt->fetchColumn();
            if ($cached) {
                $decoded = json_decode((string)$cached, true);
                if (is_array($decoded)) {
                    return $decoded;
                }
            }
        } catch (\Throwable $_e) {
            // Ignore DB cache errors and proceed to API
        }

        // 2. Fetch from DaData API
        $token = Config::get('ASMT_DADATA_TOKEN', '');
        if ($token === null || $token === '') {
            return null;
        }

        $payload = json_encode(['query' => $innClean], JSON_UNESCAPED_UNICODE);
        if ($payload === false) {
            return null;
        }

        $ch = curl_init('https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party');
        if ($ch === false) {
            return null;
        }

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: Token ' . $token,
        ];
        $secret = Config::get('ASMT_DADATA_SECRET', '');
        if ($secret !== null && $secret !== '') {
            $headers[] = 'X-Secret: ' . $secret;
        }

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 3,
            CURLOPT_TIMEOUT => 5,
        ]);

        $raw = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($raw === false || $code < 200 || $code >= 300) {
            return null;
        }

        $data = json_decode($raw, true);
        if (!is_array($data) || empty($data['suggestions'][0]) || !is_array($data['suggestions'][0])) {
            return null;
        }

        $item = $data['suggestions'][0];
        $d = is_array($item['data'] ?? null) ? $item['data'] : [];
        $name = trim((string)(
            $d['name']['full_with_opf']
            ?? $d['name']['short_with_opf']
            ?? $item['value']
            ?? ''
        ));
        $foundInn = preg_replace('/\D+/', '', (string)($d['inn'] ?? $innClean)) ?? $innClean;
        if ($name === '' || $foundInn === '') {
            return null;
        }

        $addr = $d['address']['unrestricted_value'] ?? $d['address']['value'] ?? null;

        $result = [
            'name' => $name,
            'inn' => $foundInn,
            'kpp' => isset($d['kpp']) ? (string)$d['kpp'] : null,
            'ogrn' => isset($d['ogrn']) ? (string)$d['ogrn'] : null,
            'type' => isset($d['type']) ? (string)$d['type'] : null,
            'status' => isset($d['state']['status']) ? (string)$d['state']['status'] : null,
            'address' => is_string($addr) ? $addr : null,
        ];

        // 3. Save into cache (UPSERT)
        try {
            $pdo = Db::pdo();
            $ins = $pdo->prepare(
                "INSERT INTO asmt_dadata_cache (inn, data_json, fetched_at)
                 VALUES (?, ?::jsonb, NOW())
                 ON CONFLICT (inn) DO UPDATE SET data_json = EXCLUDED.data_json, fetched_at = NOW()"
            );
            $ins->execute([$foundInn, json_encode($result, JSON_UNESCAPED_UNICODE)]);
        } catch (\Throwable $_e) {
            // silent
        }

        return $result;
    }
}
