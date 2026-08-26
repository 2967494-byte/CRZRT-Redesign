<?php
declare(strict_types=1);

namespace Asmt;

/**
 * Transactional mailer.
 * Modes: log | mailhog | smtp
 *
 * For production use ASMT_MAIL_MODE=smtp with a relay (Brevo/Mailjet/etc.)
 * and SPF+DKIM on the From-domain — otherwise messages land in spam.
 */
final class Mailer
{
    public static function send(string $to, string $subject, string $body): bool
    {
        Config::load();
        $mode = strtolower(trim((string)(Config::get('ASMT_MAIL_MODE', 'log') ?? 'log')));
        $from = trim((string)(Config::get('ASMT_MAIL_FROM', 'noreply@zakupki.tatar') ?? 'noreply@zakupki.tatar'));
        $fromName = trim((string)(Config::get('ASMT_MAIL_FROM_NAME', 'ЦРЗ РТ — модуль тестирования') ?? 'ЦРЗ РТ — модуль тестирования'));
        $replyTo = trim((string)(Config::get('ASMT_MAIL_REPLY_TO', '') ?? ''));

        if ($mode === 'log') {
            $line = date('c') . " TO={$to} SUBJ={$subject}\n{$body}\n---\n";
            $dir = dirname(__DIR__, 2) . '/storage';
            if (!is_dir($dir)) {
                @mkdir($dir, 0775, true);
            }
            file_put_contents($dir . '/mail.log', $line, FILE_APPEND);
            return true;
        }

        $raw = self::buildMessage($to, $from, $fromName, $replyTo, $subject, $body);

        if ($mode === 'smtp') {
            return self::sendSmtp($to, $from, $raw);
        }

        // mailhog / legacy raw SMTP without auth
        $host = Config::get('ASMT_MAILHOG_HOST', '127.0.0.1') ?? '127.0.0.1';
        $port = (int)(Config::get('ASMT_MAILHOG_PORT', '1025') ?? '1025');
        return self::sendRawSmtp($host, $port, false, null, null, $to, $from, $raw);
    }

    private static function buildMessage(
        string $to,
        string $from,
        string $fromName,
        string $replyTo,
        string $subject,
        string $body
    ): string {
        $domain = 'zakupki.tatar';
        if (str_contains($from, '@')) {
            $domain = substr($from, strrpos($from, '@') + 1) ?: $domain;
        }
        $messageId = sprintf('<%s@%s>', bin2hex(random_bytes(12)), $domain);
        $date = date('r');
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';

        $headers = [
            "Date: {$date}",
            "From: {$encodedFromName} <{$from}>",
            "To: <{$to}>",
            "Subject: {$encodedSubject}",
            "Message-ID: {$messageId}",
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            'X-Mailer: CRZRT-Assessment',
            'Auto-Submitted: auto-generated',
        ];
        if ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
            $headers[] = "Reply-To: <{$replyTo}>";
        }

        // Dot-stuffing for SMTP DATA
        $safeBody = preg_replace('/^\./m', '..', str_replace(["\r\n", "\r"], "\n", $body)) ?? $body;
        $safeBody = str_replace("\n", "\r\n", $safeBody);

        return implode("\r\n", $headers) . "\r\n\r\n" . $safeBody . "\r\n.";
    }

    private static function sendSmtp(string $to, string $from, string $rawMessage): bool
    {
        $host = trim((string)(Config::get('ASMT_SMTP_HOST', '') ?? ''));
        $port = (int)(Config::get('ASMT_SMTP_PORT', '587') ?? '587');
        $user = (string)(Config::get('ASMT_SMTP_USER', '') ?? '');
        $pass = (string)(Config::get('ASMT_SMTP_PASS', '') ?? '');
        $enc = strtolower(trim((string)(Config::get('ASMT_SMTP_ENCRYPTION', 'tls') ?? 'tls')));
        // tls = STARTTLS on 587; ssl = implicit TLS on 465; none = plain
        $secure = $enc === 'ssl' || $enc === 'smtps';

        if ($host === '') {
            error_log('Mailer SMTP: ASMT_SMTP_HOST is empty');
            return false;
        }

        return self::sendRawSmtp($host, $port, $secure, $user !== '' ? $user : null, $pass !== '' ? $pass : null, $to, $from, $rawMessage, $enc === 'tls' || $enc === 'starttls');
    }

    /**
     * Minimal SMTP client (EHLO, optional STARTTLS/SSL, AUTH LOGIN, DATA).
     */
    private static function sendRawSmtp(
        string $host,
        int $port,
        bool $implicitSsl,
        ?string $user,
        ?string $pass,
        string $to,
        string $from,
        string $rawMessage,
        bool $startTls = false
    ): bool {
        $remote = ($implicitSsl ? 'ssl://' : '') . $host;
        $sock = @stream_socket_client(
            "{$remote}:{$port}",
            $errno,
            $errstr,
            20,
            STREAM_CLIENT_CONNECT,
            stream_context_create([
                'ssl' => [
                    'verify_peer' => true,
                    'verify_peer_name' => true,
                    'allow_self_signed' => false,
                ],
            ])
        );
        if (!$sock) {
            error_log("Mailer SMTP connect failed: {$errstr} ({$errno})");
            return false;
        }
        stream_set_timeout($sock, 20);

        $read = static function () use ($sock): string {
            $data = '';
            while (($line = fgets($sock, 515)) !== false) {
                $data .= $line;
                if (isset($line[3]) && $line[3] === ' ') {
                    break;
                }
            }
            return $data;
        };
        $write = static function (string $cmd) use ($sock): void {
            fwrite($sock, $cmd . "\r\n");
        };
        $expect = static function (string $resp, string $prefix, string $step) : void {
            if ($resp === '' || !str_starts_with($resp, $prefix)) {
                throw new \RuntimeException("SMTP {$step}: " . trim($resp !== '' ? $resp : 'empty response'));
            }
        };

        try {
            $expect($read(), '220', 'banner');
            $ehloHost = 'test.zakupki.tatar';
            $write('EHLO ' . $ehloHost);
            $ehlo = $read();
            $expect($ehlo, '250', 'EHLO');

            if ($startTls && !$implicitSsl) {
                $write('STARTTLS');
                $expect($read(), '220', 'STARTTLS');
                $cryptoOk = stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                if ($cryptoOk !== true) {
                    throw new \RuntimeException('SMTP STARTTLS crypto failed');
                }
                $write('EHLO ' . $ehloHost);
                $expect($read(), '250', 'EHLO after STARTTLS');
            }

            if ($user !== null && $pass !== null) {
                $write('AUTH LOGIN');
                $expect($read(), '334', 'AUTH LOGIN');
                $write(base64_encode($user));
                $expect($read(), '334', 'AUTH USER');
                $write(base64_encode($pass));
                $expect($read(), '235', 'AUTH PASS');
            }

            $write('MAIL FROM:<' . $from . '>');
            $expect($read(), '250', 'MAIL FROM');
            $write('RCPT TO:<' . $to . '>');
            $rcpt = $read();
            if (!str_starts_with($rcpt, '250') && !str_starts_with($rcpt, '251')) {
                throw new \RuntimeException('SMTP RCPT TO: ' . trim($rcpt));
            }
            $write('DATA');
            $expect($read(), '354', 'DATA');
            fwrite($sock, $rawMessage . "\r\n");
            $expect($read(), '250', 'DATA end');
            $write('QUIT');
            $read();
            fclose($sock);
            return true;
        } catch (\Throwable $e) {
            error_log('Mailer SMTP: ' . $e->getMessage());
            fclose($sock);
            return false;
        }
    }
}
