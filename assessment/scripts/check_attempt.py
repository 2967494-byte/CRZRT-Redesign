import subprocess, os
env = dict(os.environ, PGPASSWORD='asmt_secret')
sql = """
SELECT aa.attempt_id, aa.question_id, aa.option_letter_chosen, q.correct_letter, aa.is_correct
FROM asmt_attempt_answers aa
JOIN asmt_questions q ON q.id = aa.question_id
WHERE aa.attempt_id = (SELECT max(id) FROM asmt_attempts);
"""
res = subprocess.run(['psql', '-h', '127.0.0.1', '-U', 'asmt', '-d', 'asmt', '-c', sql], capture_output=True, text=True, env=env)
print("STDOUT:\n", res.stdout)
print("STDERR:\n", res.stderr)
