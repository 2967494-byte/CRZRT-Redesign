<?php
declare(strict_types=1);

/**
 * CLI: php scripts/seed_orgs.php
 * Applies sql/seed_orgs_demo.sql
 */

require_once dirname(__DIR__) . '/api/bootstrap.php';

use Asmt\Config;
use Asmt\Db;

Config::load(dirname(__DIR__));
$sqlFile = dirname(__DIR__) . '/sql/seed_orgs_demo.sql';
$sql = file_get_contents($sqlFile);
if ($sql === false) {
    fwrite(STDERR, "Cannot read {$sqlFile}\n");
    exit(1);
}

$pdo = Db::pdo();
$pdo->exec($sql);

$counts = $pdo->query(
    "SELECT level, COUNT(*) AS c FROM asmt_organizations GROUP BY level ORDER BY level"
)->fetchAll();
echo "Organizations by level:\n";
foreach ($counts as $row) {
    echo "  level {$row['level']}: {$row['c']}\n";
}
$banners = (int)$pdo->query('SELECT COUNT(*) FROM asmt_region_banners')->fetchColumn();
echo "Region banners: {$banners}\n";
echo "OK\n";
