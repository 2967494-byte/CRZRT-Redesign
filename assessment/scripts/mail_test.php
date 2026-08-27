<?php
declare(strict_types=1);

/**
 * CLI: php scripts/mail_test.php you@example.com
 * Sends a test message via current ASMT_MAIL_* settings.
 */
require_once dirname(__DIR__) . '/api/bootstrap.php';

use Asmt\Config;
use Asmt\Mailer;

Config::load(dirname(__DIR__));

$to = $argv[1] ?? '';
if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "Usage: php scripts/mail_test.php you@example.com\n");
    exit(1);
}

$mode = Config::get('ASMT_MAIL_MODE', 'log');
$from = Config::get('ASMT_MAIL_FROM', '');
$host = Config::get('ASMT_SMTP_HOST', '');

echo "Mode: {$mode}\n";
echo "From: {$from}\n";
echo "SMTP: {$host}\n";
echo "To:   {$to}\n";

$ok = Mailer::send(
    $to,
    'Тест почты — модуль тестирования ЦРЗ РТ',
    "Здравствуйте!\n\nЭто тестовое письмо с сервера test.zakupki.tatar.\n"
    . "Если вы его видите во «Входящих», SMTP и DNS настроены корректно.\n\n"
    . 'Время: ' . date('c') . "\n",
    Mailer::TYPE_TEST
);

echo $ok ? "OK: письмо принято SMTP/логом\n" : "FAIL: смотрите error_log / journalctl php-fpm\n";
exit($ok ? 0 : 2);
