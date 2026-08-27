<?php
declare(strict_types=1);

namespace Asmt;

final class Mailer
{
    /** Mail types shown in the admin mail journal. */
    public const TYPE_REGISTRATION = 'registration';
    public const TYPE_PASSWORD_RESET = 'password_reset';
    public const TYPE_TEST = 'test';
    public const TYPE_OTHER = 'other';

    /**
     * Instantly put email into PostgreSQL queue (asynchronous).
     */
    public static function queue(
        string $to,
        string $subject,
        string $bodyHtml,
        int $priority = 10,
        string $mailType = self::TYPE_OTHER
    ): bool {
        try {
            $pdo = Db::pdo();
            $stmt = $pdo->prepare(
                "INSERT INTO asmt_mail_queue (to_email, subject, body_html, priority, mail_type, status, created_at, next_retry_at)
                 VALUES (?, ?, ?, ?, ?, 'new', NOW(), NOW())"
            );
            return $stmt->execute([$to, $subject, $bodyHtml, $priority, $mailType]);
        } catch (\Throwable $e) {
            Http::logError("mail_queue_insert_failed", $e);
            // Fallback to sync send if queue insert fails
            return self::sendSync($to, $subject, $bodyHtml);
        }
    }

    /**
     * Send email synchronously via configured transport (SMTP or mail()).
     */
    public static function send(
        string $to,
        string $subject,
        string $bodyHtml,
        string $mailType = self::TYPE_OTHER
    ): bool {
        // Default to asynchronous queue for ultra-fast API performance
        return self::queue($to, $subject, $bodyHtml, 10, $mailType);
    }

    public static function sendSync(string $to, string $subject, string $bodyHtml): bool
    {
        Config::load();
        $transport = Config::get('ASMT_MAIL_TRANSPORT', 'mail');
        if ($transport === 'log') {
            Http::logError("mail_mock_log", new \Exception("Mail to {$to}: {$subject}"));
            return true;
        }

        if ($transport === 'smtp') {
            return self::sendSmtp($to, $subject, $bodyHtml);
        }

        return self::sendPhpMail($to, $subject, $bodyHtml);
    }

    private static function sendPhpMail(string $to, string $subject, string $bodyHtml): bool
    {
        $from = Config::get('ASMT_MAIL_FROM', 'no-reply@assessment.local') ?? 'no-reply@assessment.local';
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . $from,
            'Reply-To: ' . $from,
            'X-Mailer: AsmtMailer/1.0',
        ];
        return @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $bodyHtml, implode("\r\n", $headers));
    }

    public static function sendSmtp(string $to, string $subject, string $bodyHtml, ?string &$errorOut = null): bool
    {
        Config::load();
        $host = Config::get('ASMT_SMTP_HOST', '127.0.0.1') ?? '127.0.0.1';
        $port = (int)(Config::get('ASMT_SMTP_PORT', '25') ?: 25);
        $user = Config::get('ASMT_SMTP_USER', '');
        $pass = Config::get('ASMT_SMTP_PASS', '');
        $from = Config::get('ASMT_MAIL_FROM', 'no-reply@assessment.local') ?? 'no-reply@assessment.local';
        $encryption = strtolower(Config::get('ASMT_SMTP_ENCRYPTION', '') ?? '');

        $timeout = 10;
        $remote = ($encryption === 'ssl' ? 'ssl://' : '') . $host . ':' . $port;
        $socket = @stream_socket_client($remote, $errno, $errstr, $timeout);
        if (!$socket) {
            $errorOut = "Connection failed: {$errstr} ({$errno})";
            return false;
        }

        stream_set_timeout($socket, $timeout);
        $read = static function () use ($socket, &$errorOut): string {
            $res = '';
            while ($line = fgets($socket, 512)) {
                $res .= $line;
                if (isset($line[3]) && $line[3] === ' ') break;
            }
            return $res;
        };

        $write = static function (string $cmd) use ($socket): void {
            fwrite($socket, $cmd . "\r\n");
        };

        $res = $read();
        if (!str_starts_with($res, '220')) {
            $errorOut = "SMTP 220 expected, got: {$res}";
            fclose($socket);
            return false;
        }

        $write('EHLO ' . gethostname());
        $res = $read();

        if ($encryption === 'tls') {
            $write('STARTTLS');
            $res = $read();
            if (!str_starts_with($res, '220')) {
                $errorOut = "STARTTLS failed: {$res}";
                fclose($socket);
                return false;
            }
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT)) {
                $errorOut = "Crypto negotiation failed";
                fclose($socket);
                return false;
            }
            $write('EHLO ' . gethostname());
            $read();
        }

        if ($user !== null && $user !== '') {
            $write('AUTH LOGIN');
            $read();
            $write(base64_encode($user));
            $read();
            $write(base64_encode($pass ?? ''));
            $res = $read();
            if (!str_starts_with($res, '235')) {
                $errorOut = "Auth failed: {$res}";
                fclose($socket);
                return false;
            }
        }

        $write("MAIL FROM:<{$from}>");
        $read();
        $write("RCPT TO:<{$to}>");
        $read();
        $write('DATA');
        $read();

        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . $from,
            'To: ' . $to,
            'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
            'Date: ' . date('r'),
        ];
        $msg = implode("\r\n", $headers) . "\r\n\r\n" . $bodyHtml . "\r\n.";
        $write($msg);
        $res = $read();

        $write('QUIT');
        fclose($socket);

        return str_starts_with($res, '250');
    }
}
