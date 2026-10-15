-- Allow admin to void a rejected retake request so the user may submit again

ALTER TABLE asmt_retake_requests DROP CONSTRAINT IF EXISTS asmt_retake_requests_status_check;
ALTER TABLE asmt_retake_requests
  ADD CONSTRAINT asmt_retake_requests_status_check
  CHECK (status IN ('pending', 'approved', 'rejected', 'used', 'voided'));
