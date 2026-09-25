<?php
declare(strict_types=1);

/**
 * CLI: php scripts/seed_all_districts.php
 * Migrates asmt_districts table to include region_id and seeds
 * comprehensive municipal districts / cities for all 89 Russian regions.
 */

require_once dirname(__DIR__) . '/public/api/bootstrap.php';

use Asmt\Db;

$pdo = Db::pdo();

echo "1. Applying schema migration to asmt_districts...\n";

$pdo->exec("
    ALTER TABLE asmt_districts ADD COLUMN IF NOT EXISTS region_id BIGINT NULL REFERENCES asmt_regions(id) ON DELETE RESTRICT;
    CREATE INDEX IF NOT EXISTS asmt_districts_region_idx ON asmt_districts (region_id);
    CREATE UNIQUE INDEX IF NOT EXISTS asmt_districts_region_name_uidx ON asmt_districts (region_id, name) WHERE region_id IS NOT NULL;
");

// Map region codes to DB ids
$regions = $pdo->query("SELECT id, code, name FROM asmt_regions")->fetchAll(PDO::FETCH_ASSOC);
$codeToId = [];
foreach ($regions as $r) {
    $codeToId[(string)$r['code']] = (int)$r['id'];
}

echo "Found " . count($codeToId) . " regions in asmt_regions.\n";

// Assign Tatarstan region_id to existing legacy rows 1..10
$tatId = $codeToId['16'] ?? 1;
$pdo->exec("UPDATE asmt_districts SET region_id = {$tatId} WHERE id <= 10 AND region_id IS NULL");

// Read dataset
$dataFile = dirname(__DIR__) . '/storage/all_districts.json';
if (!file_exists($dataFile)) {
    echo "ERROR: Data file {$dataFile} not found!\n";
    exit(1);
}

$dataset = json_decode(file_get_contents($dataFile), true);
if (!is_array($dataset)) {
    echo "ERROR: Invalid JSON in {$dataFile}!\n";
    exit(1);
}

echo "2. Seeding districts for all regions...\n";

$insertStmt = $pdo->prepare("
    INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
    VALUES (?, ?, ?, ?, TRUE)
    ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
    SET is_separate_city = EXCLUDED.is_separate_city,
        sort_order = EXCLUDED.sort_order,
        is_active = TRUE
");

$existingStmt = $pdo->prepare("SELECT id FROM asmt_districts WHERE region_id = ? AND name = ? LIMIT 1");

$totalInserted = 0;
$pdo->beginTransaction();

try {
    foreach ($dataset as $code => $regInfo) {
        $regId = $codeToId[(string)$code] ?? null;
        if (!$regId) {
            echo "Warning: Region code {$code} not found in DB!\n";
            continue;
        }

        $districts = $regInfo['districts'] ?? [];
        $order = 10;
        foreach ($districts as $d) {
            $name = trim((string)$d['name']);
            if ($name === '') continue;

            $isCity = !empty($d['isSeparateCity']);
            $sort = ($name === 'Иное') ? 999 : $order;
            if ($name !== 'Иное') $order += 10;

            $insertStmt->execute([
                $regId,
                $name,
                $isCity ? 'true' : 'false',
                $sort
            ]);
            $totalInserted++;
        }
    }

    // Also ensure a generic global 'Иное' (region_id IS NULL) exists for any edge cases
    $checkGlobalOther = $pdo->query("SELECT id FROM asmt_districts WHERE region_id IS NULL AND name = 'Иное' LIMIT 1")->fetchColumn();
    if (!$checkGlobalOther) {
        $pdo->exec("INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active) VALUES (NULL, 'Иное', FALSE, 999, TRUE)");
    }

    $pdo->commit();
    echo "SUCCESS: Seeded {$totalInserted} district entries across regions.\n";
} catch (\Throwable $e) {
    $pdo->rollBack();
    echo "ERROR during seed: " . $e->getMessage() . "\n";
    exit(1);
}

$count = (int)$pdo->query("SELECT COUNT(*) FROM asmt_districts")->fetchColumn();
echo "Total districts in database now: {$count}\n";

// Verification for Region 86 (HMAO)
$hmaoId = $codeToId['86'] ?? 0;
$stmt = $pdo->prepare("SELECT name, is_separate_city FROM asmt_districts WHERE region_id = ? ORDER BY sort_order, name LIMIT 5");
$stmt->execute([$hmaoId]);
echo "\nSample districts for Region 86 (HMAO, id={$hmaoId}):\n";
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
    echo " - {$row['name']} " . ($row['is_separate_city'] ? '(город)' : '') . "\n";
}
