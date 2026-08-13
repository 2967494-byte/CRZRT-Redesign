#!/bin/sh
set -e
cd /var/www/html
echo "Waiting for PostgreSQL..."
i=0
until php -r 'try { new PDO(getenv("ASMT_DB_DSN"), getenv("ASMT_DB_USER"), getenv("ASMT_DB_PASS")); exit(0);} catch (Throwable $e) { exit(1);}'; do
  i=$((i+1))
  if [ "$i" -gt 40 ]; then
    echo "Postgres not ready"
    exit 1
  fi
  sleep 1
done
php scripts/seed_questions.php
php scripts/seed_admin.php
echo "Seed done."
