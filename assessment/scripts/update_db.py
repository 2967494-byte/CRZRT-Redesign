import subprocess, os
env = dict(os.environ, PGPASSWORD='asmt_secret')
sql = "UPDATE asmt_users SET middle_name = TRIM(REGEXP_REPLACE(middle_name, 'индивидуальный предприниматель|ип|предприниматель', '', 'gi')) WHERE middle_name ~* 'предприниматель';"
res = subprocess.run(['psql', '-h', '127.0.0.1', '-U', 'asmt', '-d', 'asmt', '-c', sql], capture_output=True, text=True, env=env)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
