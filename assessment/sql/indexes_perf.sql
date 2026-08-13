-- Performance indexes for Assessment (safe to re-run)

CREATE INDEX IF NOT EXISTS asmt_user_org_status_idx
    ON asmt_user_organizations (status, requested_at);

CREATE INDEX IF NOT EXISTS asmt_org_parent_idx
    ON asmt_organizations (parent_id);

CREATE INDEX IF NOT EXISTS asmt_org_level_idx
    ON asmt_organizations (level);

CREATE INDEX IF NOT EXISTS asmt_attempts_finished_campaign_idx
    ON asmt_attempts (campaign_id, finished_at DESC)
    WHERE status = 'finished';

CREATE INDEX IF NOT EXISTS asmt_attempt_answers_question_idx
    ON asmt_attempt_answers (question_id);

CREATE INDEX IF NOT EXISTS asmt_attempt_answers_formulation_idx
    ON asmt_attempt_answers (formulation_id)
    WHERE formulation_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS asmt_users_region_role_idx
    ON asmt_users (region_id, role);

CREATE INDEX IF NOT EXISTS asmt_formulations_question_active_idx
    ON asmt_question_formulations (question_id)
    WHERE is_active = TRUE;
