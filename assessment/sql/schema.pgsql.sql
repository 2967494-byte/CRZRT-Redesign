-- Assessment module schema (PostgreSQL 14+)
-- Encoding: UTF8

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS asmt_regions (
    id              BIGSERIAL PRIMARY KEY,
    code            VARCHAR(32) NOT NULL UNIQUE,
    name            VARCHAR(255) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS asmt_region_banners (
    id              BIGSERIAL PRIMARY KEY,
    region_id       BIGINT NOT NULL REFERENCES asmt_regions(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL DEFAULT '',
    body            TEXT NOT NULL DEFAULT '',
    link_url        VARCHAR(512) NOT NULL DEFAULT '',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS asmt_districts (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    sort_order      INT NOT NULL DEFAULT 0,
    is_separate_city BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS asmt_campaigns (
    id                      BIGSERIAL PRIMARY KEY,
    code                    VARCHAR(64) NOT NULL UNIQUE,
    name                    VARCHAR(255) NOT NULL,
    region_id               BIGINT NULL REFERENCES asmt_regions(id) ON DELETE SET NULL,
    starts_at               TIMESTAMPTZ NULL,
    ends_at                 TIMESTAMPTZ NULL,
    time_limit_minutes      INT NOT NULL DEFAULT 90,
    questions_per_attempt   INT NOT NULL DEFAULT 40,
    pool_size               INT NOT NULL DEFAULT 100,
    error_threshold_percent INT NOT NULL DEFAULT 60,
    shuffle_questions       BOOLEAN NOT NULL DEFAULT TRUE,
    shuffle_options         BOOLEAN NOT NULL DEFAULT TRUE,
    is_active               BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hierarchical organizations: level 1 ministry, 2 district/territorial, 3 legal entity
CREATE TABLE IF NOT EXISTS asmt_organizations (
    id              BIGSERIAL PRIMARY KEY,
    parent_id       BIGINT NULL REFERENCES asmt_organizations(id) ON DELETE SET NULL,
    level           SMALLINT NOT NULL CHECK (level BETWEEN 1 AND 3),
    name            VARCHAR(512) NOT NULL,
    inn             VARCHAR(12) NULL,
    customer_level  VARCHAR(32) NOT NULL DEFAULT '',
    status          VARCHAR(32) NOT NULL DEFAULT 'approved'
                        CHECK (status IN ('pending','approved','rejected')),
    notes           TEXT NOT NULL DEFAULT '',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS asmt_organizations_inn_uidx
    ON asmt_organizations (inn)
    WHERE inn IS NOT NULL AND inn <> '' AND level = 3;

CREATE TABLE IF NOT EXISTS asmt_users (
    id                      BIGSERIAL PRIMARY KEY,
    email_normalized        VARCHAR(255) NOT NULL UNIQUE,
    phone_normalized        VARCHAR(32) NOT NULL UNIQUE,
    password_hash           VARCHAR(255) NOT NULL,
    last_name               VARCHAR(120) NOT NULL,
    first_name              VARCHAR(120) NOT NULL,
    middle_name             VARCHAR(120) NOT NULL DEFAULT '',
    position                VARCHAR(255) NOT NULL DEFAULT '',
    experience_level        VARCHAR(64) NOT NULL DEFAULT '',
    education               VARCHAR(255) NOT NULL DEFAULT '',
    specialty               VARCHAR(255) NOT NULL DEFAULT '',
    customer_level          VARCHAR(64) NOT NULL DEFAULT '',
    district_id             BIGINT NULL REFERENCES asmt_districts(id) ON DELETE SET NULL,
    district_other_text     VARCHAR(255) NOT NULL DEFAULT '',
    region_id               BIGINT NULL REFERENCES asmt_regions(id) ON DELETE SET NULL,
    role                    VARCHAR(32) NOT NULL DEFAULT 'participant'
                                CHECK (role IN ('superadmin','region_admin','moderator','analyst','participant')),
    status                  VARCHAR(32) NOT NULL DEFAULT 'active'
                                CHECK (status IN ('active','blocked')),
    consent_pd_at           TIMESTAMPTZ NULL,
    consent_privacy_at      TIMESTAMPTZ NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at           TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS asmt_user_organizations (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES asmt_users(id) ON DELETE CASCADE,
    organization_id     BIGINT NOT NULL REFERENCES asmt_organizations(id) ON DELETE CASCADE,
    status              VARCHAR(32) NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','approved','rejected','needs_info')),
    requested_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    moderated_at        TIMESTAMPTZ NULL,
    moderated_by        BIGINT NULL REFERENCES asmt_users(id) ON DELETE SET NULL,
    moderator_comment   TEXT NOT NULL DEFAULT '',
    UNIQUE (user_id, organization_id)
);

CREATE TABLE IF NOT EXISTS asmt_questions (
    id              BIGSERIAL PRIMARY KEY,
    external_id     INT NULL UNIQUE,
    text            TEXT NOT NULL,
    correct_letter  VARCHAR(8) NOT NULL,
    difficulty      INT NULL CHECK (difficulty BETWEEN 1 AND 10),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS asmt_question_formulations (
    id              BIGSERIAL PRIMARY KEY,
    question_id     BIGINT NOT NULL REFERENCES asmt_questions(id) ON DELETE CASCADE,
    text            TEXT NOT NULL,
    sort_order      INT NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS asmt_question_options (
    id              BIGSERIAL PRIMARY KEY,
    question_id     BIGINT NOT NULL REFERENCES asmt_questions(id) ON DELETE CASCADE,
    letter          VARCHAR(8) NOT NULL,
    text            TEXT NOT NULL,
    sort_order      INT NOT NULL DEFAULT 0,
    UNIQUE (question_id, letter)
);

CREATE TABLE IF NOT EXISTS asmt_attempts (
    id                          BIGSERIAL PRIMARY KEY,
    user_id                     BIGINT NOT NULL REFERENCES asmt_users(id) ON DELETE CASCADE,
    campaign_id                 BIGINT NOT NULL REFERENCES asmt_campaigns(id) ON DELETE CASCADE,
    organization_id_at_attempt  BIGINT NULL REFERENCES asmt_organizations(id) ON DELETE SET NULL,
    user_org_status_at_attempt  VARCHAR(32) NOT NULL DEFAULT 'pending',
    status                      VARCHAR(32) NOT NULL DEFAULT 'in_progress'
                                    CHECK (status IN ('in_progress','finished','expired','abandoned','superseded')),
    started_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at                  TIMESTAMPTZ NOT NULL,
    finished_at                 TIMESTAMPTZ NULL,
    duration_seconds            INT NULL,
    total_questions             INT NOT NULL DEFAULT 0,
    answered_count              INT NOT NULL DEFAULT 0,
    correct_count               INT NOT NULL DEFAULT 0,
    incorrect_count             INT NOT NULL DEFAULT 0,
    score                       INT NOT NULL DEFAULT 0,
    percent_correct             NUMERIC(6,2) NOT NULL DEFAULT 0,
    question_order_json         JSONB NOT NULL DEFAULT '[]'::jsonb,
    ip_address                  INET NULL,
    user_agent                  TEXT NOT NULL DEFAULT '',
    device_type                 VARCHAR(16) NOT NULL DEFAULT 'desktop'
                                    CHECK (device_type IN ('mobile','tablet','desktop')),
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS asmt_attempts_one_finished_per_campaign
    ON asmt_attempts (user_id, campaign_id)
    WHERE status = 'finished';

CREATE INDEX IF NOT EXISTS asmt_attempts_campaign_idx ON asmt_attempts (campaign_id);
CREATE INDEX IF NOT EXISTS asmt_attempts_user_idx ON asmt_attempts (user_id);

CREATE TABLE IF NOT EXISTS asmt_retake_requests (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES asmt_users(id) ON DELETE CASCADE,
    campaign_id     BIGINT NOT NULL REFERENCES asmt_campaigns(id) ON DELETE CASCADE,
    attempt_id      BIGINT NULL REFERENCES asmt_attempts(id) ON DELETE SET NULL,
    reason          TEXT NOT NULL,
    status          VARCHAR(32) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'approved', 'rejected', 'used')),
    admin_comment   TEXT NULL,
    reviewed_by     BIGINT NULL REFERENCES asmt_users(id) ON DELETE SET NULL,
    reviewed_at     TIMESTAMPTZ NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS asmt_retake_one_pending_per_user_campaign
    ON asmt_retake_requests (user_id, campaign_id)
    WHERE status = 'pending';

CREATE UNIQUE INDEX IF NOT EXISTS asmt_retake_one_approved_unused_per_user_campaign
    ON asmt_retake_requests (user_id, campaign_id)
    WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS asmt_retake_status_idx ON asmt_retake_requests (status, created_at DESC);

CREATE TABLE IF NOT EXISTS asmt_attempt_answers (
    id                      BIGSERIAL PRIMARY KEY,
    attempt_id              BIGINT NOT NULL REFERENCES asmt_attempts(id) ON DELETE CASCADE,
    question_id             BIGINT NOT NULL REFERENCES asmt_questions(id) ON DELETE CASCADE,
    formulation_id          BIGINT NULL REFERENCES asmt_question_formulations(id) ON DELETE SET NULL,
    option_letter_chosen    VARCHAR(8) NULL,
    is_correct              BOOLEAN NULL,
    options_order_json      JSONB NOT NULL DEFAULT '[]'::jsonb,
    answered_at             TIMESTAMPTZ NULL,
    UNIQUE (attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS asmt_auth_tokens (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES asmt_users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(128) NOT NULL UNIQUE,
    type            VARCHAR(16) NOT NULL CHECK (type IN ('reset','magic')),
    expires_at      TIMESTAMPTZ NOT NULL,
    used_at         TIMESTAMPTZ NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS asmt_admin_audit (
    id              BIGSERIAL PRIMARY KEY,
    admin_user_id   BIGINT NULL REFERENCES asmt_users(id) ON DELETE SET NULL,
    action          VARCHAR(64) NOT NULL,
    entity          VARCHAR(64) NOT NULL DEFAULT '',
    entity_id       BIGINT NULL,
    meta_json       JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed: default region + campaign + sample districts
INSERT INTO asmt_regions (code, name) VALUES ('16', 'Республика Татарстан')
ON CONFLICT (code) DO NOTHING;

INSERT INTO asmt_campaigns (code, name, region_id, time_limit_minutes, questions_per_attempt, pool_size, is_active)
SELECT '2026-DEMO', 'Демо-кампания 2026 (локальная)', r.id, 90, 40, 100, TRUE
FROM asmt_regions r WHERE r.code = '16'
ON CONFLICT (code) DO NOTHING;

INSERT INTO asmt_districts (name, sort_order, is_separate_city) VALUES
('город Казань', 1, TRUE),
('город Набережные Челны', 2, TRUE),
('Агрызский район', 10, FALSE),
('Азнакаевский район', 20, FALSE),
('Альметьевский район', 30, FALSE),
('Бугульминский район', 40, FALSE),
('Елабужский район', 50, FALSE),
('Зеленодольский район', 60, FALSE),
('Нижнекамский район', 70, FALSE),
('Чистопольский район', 80, FALSE),
('Иное', 999, FALSE);
