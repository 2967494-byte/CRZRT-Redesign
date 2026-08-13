import subprocess, os, json

env = dict(os.environ, PGPASSWORD='asmt_secret')

sql_attempts = """
SELECT a.id, a.status, a.started_at, a.finished_at, a.score, a.percent_correct, a.answered_count, a.correct_count
FROM asmt_attempts a
ORDER BY a.started_at DESC;
"""

res_att = subprocess.run(['psql', '-h', '127.0.0.1', '-U', 'asmt', '-d', 'asmt', '-c', sql_attempts], capture_output=True, text=True, env=env)
print("=== ATTEMPTS ===")
print(res_att.stdout)

sql_answers = """
SELECT aa.attempt_id, aa.question_id, aa.option_letter_chosen, aa.is_correct, q.correct_letter, q.options_json
FROM asmt_attempt_answers aa
JOIN asmt_questions q ON q.id = aa.question_id
WHERE aa.option_letter_chosen IS NOT NULL AND aa.option_letter_chosen != ''
ORDER BY aa.attempt_id DESC, aa.question_id ASC;
"""

res_ans = subprocess.run(['psql', '-h', '127.0.0.1', '-U', 'asmt', '-d', 'asmt', '-c', sql_answers], capture_output=True, text=True, env=env)
print("=== ANSWERS ===")
print(res_ans.stdout)
