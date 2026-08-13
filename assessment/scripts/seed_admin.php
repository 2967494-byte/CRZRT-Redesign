<?php
declare(strict_types=1);

/**
 * CLI: php scripts/seed_admin.php
 * Creates superadmin from env ASMT_ADMIN_EMAIL / ASMT_ADMIN_PASSWORD
 */

require_once dirname(__DIR__) . '/api/bootstrap.php';

use Asmt\Auth;
use Asmt\Config;
use Asmt\Db;

Config::load(dirname(__DIR__));
$email = Auth::normalizeEmail(Config::get('ASMT_ADMIN_EMAIL', 'admin@assessment.local') ?? 'admin@assessment.local');
$pass = Config::get('ASMT_ADMIN_PASSWORD', 'Admin123!') ?? 'Admin123!';
$hash = password_hash($pass, PASSWORD_BCRYPT);
$pdo = Db::pdo();

$regionId = $pdo->query("SELECT id FROM asmt_regions WHERE code = '16' LIMIT 1")->fetchColumn();

$exists = $pdo->prepare('SELECT id FROM asmt_users WHERE email_normalized = ?');
$exists->execute([$email]);
if ($exists->fetch()) {
    $pdo->prepare(
        'UPDATE asmt_users SET password_hash = ?, role = \'superadmin\', status = \'active\', region_id = COALESCE(region_id, ?) WHERE email_normalized = ?'
    )->execute([$hash, $regionId ?: null, $email]);
    echo "Updated superadmin {$email}\n";
    exit(0);
}

$pdo->prepare(
    'INSERT INTO asmt_users (
        email_normalized, phone_normalized, password_hash,
        last_name, first_name, middle_name, region_id, role, consent_pd_at, consent_privacy_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, \'superadmin\', NOW(), NOW())'
)->execute([
    $email,
    '70000000000',
    $hash,
    'Администратор',
    'Системы',
    '',
    $regionId ?: null,
]);
echo "Created superadmin {$email} / {$pass}\n";
