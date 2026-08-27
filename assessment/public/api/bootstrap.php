<?php
declare(strict_types=1);

// Suppress PHP error output in production to prevent information leaks
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(E_ALL);  // still log all errors, just don't output them

require_once __DIR__ . '/../../api/lib/Config.php';
require_once __DIR__ . '/../../api/lib/Db.php';
require_once __DIR__ . '/../../api/lib/Auth.php';
require_once __DIR__ . '/../../api/lib/Http.php';
require_once __DIR__ . '/../../api/lib/RateLimit.php';
require_once __DIR__ . '/../../api/lib/Mailer.php';
require_once __DIR__ . '/../../api/lib/DaDataParty.php';
require_once __DIR__ . '/../../api/lib/AttemptService.php';

use Asmt\Auth;
use Asmt\Config;
use Asmt\Http;

Config::load();
Auth::startSession();

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Verify CSRF on state-mutating requests
Http::verifyCsrf();
