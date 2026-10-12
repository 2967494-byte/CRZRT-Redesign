<?php
declare(strict_types=1);

// Suppress PHP error output in production to prevent information leaks
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(E_ALL);  // still log all errors, just don't output them
date_default_timezone_set('Europe/Moscow');

require_once __DIR__ . '/../../api/lib/Config.php';
require_once __DIR__ . '/../../api/lib/Db.php';
require_once __DIR__ . '/../../api/lib/Auth.php';
require_once __DIR__ . '/../../api/lib/Http.php';
require_once __DIR__ . '/../../api/lib/RateLimit.php';
require_once __DIR__ . '/../../api/lib/Mailer.php';
require_once __DIR__ . '/../../api/lib/DaDataParty.php';
require_once __DIR__ . '/../../api/lib/AttemptService.php';
if (is_file(__DIR__ . '/../../api/lib/RegRuService.php')) {
    require_once __DIR__ . '/../../api/lib/RegRuService.php';
}

use Asmt\Auth;
use Asmt\Config;
use Asmt\Http;

Config::load();
Auth::startSession();

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Ceiling for every API method. Signed-in users are counted per account, not per IP:
// a whole office taking a test behind one NAT address must not share a single budget.
// Expensive routes add a tighter bucket of their own.
if (PHP_SAPI !== 'cli') {
    $rateLimitUserId = Auth::userId();
    if ($rateLimitUserId !== null) {
        \Asmt\RateLimit::hitKey('api-user', (string)$rateLimitUserId, 600, 300);
    } else {
        \Asmt\RateLimit::hit('api', 300, 300);
    }
}

// Verify CSRF on state-mutating requests
Http::verifyCsrf();
