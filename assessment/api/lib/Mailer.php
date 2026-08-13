<?php
declare(strict_types=1);

namespace Asmt;

final class Mailer
{
    public static function send(string $to, string $subject, string $body): bool
    {
        Config::load();
        $mode = Config::get('ASMT_MAIL_MODE', 'mailhog') ?? 'mailhog';

        if ($mode === 'log') {
            $line = date('c') . " TO={$to} SUBJ={$subject}\n{$body}\n---\n";
            file_put_contents(dirname(__DIR__, 2) . '/storage/mail.log', $line, FILE_APPEND);
            return true;
        }

        $host = Config::get('ASMT_MAILHOG_HOST', 'mailhog') ?? 'mailhog';
        $port = (int)(Config::get('ASMT_MAILHOG_PORT', '1025') ?? '1025');
        $from = 'noreply@assessment.local';

        $sock = @fsockopen($host, $port, $errno, $errstr, 5);
        if (!$sock) {
            error_log("Mailer failed: {$errstr}");
            return false;
        }

        $read = static function () use ($sock): string {
            $data = '';
            while ($line = fgets($sock, 512)) {
                $data .= $line;
                if (isset($line[3]) && $line[3] === ' ') break;
            }
            return $data;
        };
        $write = static function (string $cmd) use ($sock): void {
            fwrite($sock, $cmd . "\r\n");
        };

        $read();
        $write('EHLO assessment.local');
        $read();
        $write('MAIL FROM:<' . $from . '>');
        $read();
        $write('RCPT TO:<' . $to . '>');
        $read();
        $write('DATA');
        $read();
        $msg = "From: Assessment <{$from}>\r\nTo: <{$to}>\r\nSubject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
        $msg .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n";
        $msg .= $body . "\r\n.";
        $write($msg);
        $read();
        $write('QUIT');
        fclose($sock);
        return true;
    }
}
