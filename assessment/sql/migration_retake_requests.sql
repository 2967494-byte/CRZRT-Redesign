-- Retake requests + allow superseded attempts (old finished after retake approval)

ALTER TABLE asmt_attempts DROP CONSTRAINT IF EXISTS asmt_attempts_status_check;
ALTER TABLE asmt_attempts
  ADD CONSTRAINT asmt_attempts_status_check
  CHECK (status IN ('in_progress', 'finished', 'expired', 'abandoned', 'superseded'));

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
