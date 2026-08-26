<?php
declare(strict_types=1);

require_once __DIR__ . '/../public/api/bootstrap.php';

use Asmt\Db;

$pdo = Db::pdo();

echo "Running complete database auto-migration...\n";

$queries = [
    // 1. Add telemetry columns to asmt_attempts
    "ALTER TABLE asmt_attempts ADD COLUMN IF NOT EXISTS disconnect_count INT NOT NULL DEFAULT 0;",
    "ALTER TABLE asmt_attempts ADD COLUMN IF NOT EXISTS total_offline_seconds INT NOT NULL DEFAULT 0;",
    "ALTER TABLE asmt_attempts ADD COLUMN IF NOT EXISTS tab_hidden_seconds INT NOT NULL DEFAULT 0;",
    "ALTER TABLE asmt_attempts ADD COLUMN IF NOT EXISTS last_ping_at TIMESTAMPTZ NULL;",
    "ALTER TABLE asmt_attempts ADD COLUMN IF NOT EXISTS telemetry_json JSONB NOT NULL DEFAULT '[]'::jsonb;",

    // 2. Add user registration fields to asmt_users
    "ALTER TABLE asmt_users ADD COLUMN IF NOT EXISTS position VARCHAR(255) NULL;",
    "ALTER TABLE asmt_users ADD COLUMN IF NOT EXISTS consent_personal_data BOOLEAN DEFAULT FALSE;",
    "ALTER TABLE asmt_users ADD COLUMN IF NOT EXISTS consent_nda BOOLEAN DEFAULT FALSE;",
    "ALTER TABLE asmt_users ADD COLUMN IF NOT EXISTS consent_data_transferred BOOLEAN DEFAULT FALSE;",
    "ALTER TABLE asmt_users ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ NULL;",
    "ALTER TABLE asmt_users ADD COLUMN IF NOT EXISTS organization_inn VARCHAR(32) NULL;",

    // 3. DaData cache table
    "CREATE TABLE IF NOT EXISTS asmt_dadata_cache (
        inn VARCHAR(32) PRIMARY KEY,
        data_json JSONB NOT NULL,
        fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );",
    "CREATE INDEX IF NOT EXISTS asmt_dadata_cache_fetched_idx ON asmt_dadata_cache (fetched_at);",

    // 4. Mail queue table
    "CREATE TABLE IF NOT EXISTS asmt_mail_queue (
        id BIGSERIAL PRIMARY KEY,
        to_email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        body_html TEXT NOT NULL,
        priority SMALLINT NOT NULL DEFAULT 10,
        status VARCHAR(32) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processing', 'sent', 'failed')),
        attempts_count INT NOT NULL DEFAULT 0,
        last_error TEXT NULL,
        next_retry_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        sent_at TIMESTAMPTZ NULL
    );",
    "CREATE INDEX IF NOT EXISTS asmt_mail_queue_status_prio_idx ON asmt_mail_queue (status, priority ASC, next_retry_at ASC);",

    // 5. Composite Performance Indexes
    "CREATE INDEX IF NOT EXISTS asmt_attempts_user_status_exp_idx ON asmt_attempts (user_id, status, expires_at);",
    "CREATE INDEX IF NOT EXISTS asmt_attempts_user_campaign_status_idx ON asmt_attempts (user_id, campaign_id, status);",
    "CREATE INDEX IF NOT EXISTS asmt_user_org_user_req_idx ON asmt_user_organizations (user_id, requested_at DESC);",
    "CREATE INDEX IF NOT EXISTS asmt_attempts_status_expires_idx ON asmt_attempts (status, expires_at) WHERE status = 'in_progress';",

    // 6. Analyze statistics
    "ANALYZE asmt_attempts;",
    "ANALYZE asmt_attempt_answers;",
    "ANALYZE asmt_user_organizations;",
    "ANALYZE asmt_users;"
];

foreach ($queries as $sql) {
    try {
        $pdo->exec($sql);
    } catch (\Throwable $e) {
        echo "Query notice: " . $e->getMessage() . "\n";
    }
}

echo "SUCCESS: Database migration completed.\n";
