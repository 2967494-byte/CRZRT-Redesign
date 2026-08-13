<?php
declare(strict_types=1);

/**
 * CLI: php scripts/import_orgs_csv.php [path/to.csv]
 * CSV columns: level,parent_name,name,inn,customer_level
 */

require_once dirname(__DIR__) . '/api/bootstrap.php';

use Asmt\Config;
use Asmt\Db;

Config::load(dirname(__DIR__));
$path = $argv[1] ?? (dirname(__DIR__) . '/sql/orgs_import_sample.csv');
if (!is_file($path)) {
    fwrite(STDERR, "File not found: {$path}\n");
    exit(1);
}

$fh = fopen($path, 'rb');
if (!$fh) {
    fwrite(STDERR, "Cannot open {$path}\n");
    exit(1);
}

$header = fgetcsv($fh);
if (!$header) {
    fwrite(STDERR, "Empty CSV\n");
    exit(1);
}
$header = array_map(static fn($h) => strtolower(trim((string)$h)), $header);
$col = static function (array $row, array $header, string $name): string {
    $i = array_search($name, $header, true);
    return $i === false ? '' : trim((string)($row[$i] ?? ''));
};

$pdo = Db::pdo();
$inserted = 0;
$skipped = 0;

while (($row = fgetcsv($fh)) !== false) {
    if (count($row) === 1 && trim((string)$row[0]) === '') {
        continue;
    }
    $level = (int)$col($row, $header, 'level');
    $parentName = $col($row, $header, 'parent_name');
    $name = $col($row, $header, 'name');
    $inn = preg_replace('/\D+/', '', $col($row, $header, 'inn')) ?? '';
    $customerLevel = $col($row, $header, 'customer_level');
    if ($name === '' || !in_array($level, [1, 2, 3], true)) {
        $skipped++;
        continue;
    }

    $parentId = null;
    if ($level > 1) {
        if ($parentName === '') {
            fwrite(STDERR, "Skip (no parent): {$name}\n");
            $skipped++;
            continue;
        }
        $st = $pdo->prepare(
            'SELECT id FROM asmt_organizations WHERE name = ? AND level = ? ORDER BY id LIMIT 1'
        );
        $st->execute([$parentName, $level - 1]);
        $parentId = $st->fetchColumn();
        if (!$parentId) {
            fwrite(STDERR, "Skip (parent not found): {$name} ← {$parentName}\n");
            $skipped++;
            continue;
        }
        $parentId = (int)$parentId;
    }

    if ($level === 3 && $inn !== '') {
        $exists = $pdo->prepare('SELECT id FROM asmt_organizations WHERE inn = ? AND level = 3 LIMIT 1');
        $exists->execute([$inn]);
        if ($exists->fetch()) {
            $skipped++;
            continue;
        }
    } else {
        $exists = $pdo->prepare(
            'SELECT id FROM asmt_organizations WHERE name = ? AND level = ? AND COALESCE(parent_id,0) = COALESCE(?,0) LIMIT 1'
        );
        $exists->execute([$name, $level, $parentId]);
        if ($exists->fetch()) {
            $skipped++;
            continue;
        }
    }

    $pdo->prepare(
        'INSERT INTO asmt_organizations (parent_id, level, name, inn, customer_level, status)
         VALUES (?, ?, ?, ?, ?, \'approved\')'
    )->execute([
        $parentId,
        $level,
        $name,
        $inn !== '' ? $inn : null,
        $customerLevel,
    ]);
    $inserted++;
}

fclose($fh);
echo "Inserted: {$inserted}, skipped: {$skipped}\n";
