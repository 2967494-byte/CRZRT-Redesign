<?php
declare(strict_types=1);

/**
 * CLI: php scripts/seed_staff.php
 * Creates region_admin / moderator / analyst for local smoke.
 */

require_once dirname(__DIR__) . '/api/bootstrap.php';

use Asmt\Auth;
use Asmt\Config;
use Asmt\Db;

Config::load(dirname(__DIR__));
$pdo = Db::pdo();
$regionId = $pdo->query("SELECT id FROM asmt_regions WHERE code = '16' LIMIT 1")->fetchColumn();
$pass = 'Admin123!';
$hash = password_hash($pass, PASSWORD_BCRYPT);

$staff = [
    ['region_admin@assessment.local', '70000000001', 'region_admin', 'Регион', 'Админ'],
    ['moderator@assessment.local', '70000000002', 'moderator', 'Модератор', 'Системы'],
    ['analyst@assessment.local', '70000000003', 'analyst', 'Аналитик', 'Системы'],
];

foreach ($staff as [$email, $phone, $role, $ln, $fn]) {
    $email = Auth::normalizeEmail($email);
    $exists = $pdo->prepare('SELECT id FROM asmt_users WHERE email_normalized = ?');
    $exists->execute([$email]);
    $id = $exists->fetchColumn();
    if ($id) {
        $pdo->prepare(
            'UPDATE asmt_users SET password_hash = ?, role = ?, region_id = ?, status = \'active\' WHERE id = ?'
        )->execute([$hash, $role, $regionId ?: null, (int)$id]);
        echo "Updated {$role} {$email}\n";
        continue;
    }
    $pdo->prepare(
        'INSERT INTO asmt_users (
            email_normalized, phone_normalized, password_hash,
            last_name, first_name, middle_name, region_id, role,
            consent_pd_at, consent_privacy_at
         ) VALUES (?, ?, ?, ?, ?, \'\', ?, ?, NOW(), NOW())'
    )->execute([$email, $phone, $hash, $ln, $fn, $regionId ?: null, $role]);
    echo "Created {$role} {$email} / {$pass}\n";
}
