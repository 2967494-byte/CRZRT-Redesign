# Deploy Assessment на Linux + PostgreSQL

## 1. Требования

- Linux, Nginx или Apache
- PHP 8.1+ с `pdo_pgsql`, `mbstring`
- PostgreSQL 14+
- SMTP (боевой) или временно MailHog
- При пике ~5000 сессий: PHP-FPM + **PgBouncer** (transaction), опционально Redis для PHP-сессий

## 2. База данных

```bash
sudo -u postgres createuser asmt -P
sudo -u postgres createdb -O asmt asmt
psql -U asmt -d asmt -f sql/schema.pgsql.sql
psql -U asmt -d asmt -f sql/indexes_perf.sql
psql -U asmt -d asmt -f sql/seed_orgs_demo.sql   # или import_orgs_csv.php с реестром Заказчика
```

Бэкап (ежедневно, отдельно от MySQL портала):

```bash
pg_dump -Fc -U asmt asmt > /var/backups/asmt-$(date +%F).dump
```

## 3. Код

Скопировать каталог `assessment/` на сервер (например `/var/www/assessment`).

```bash
cp .env.example .env
# ASMT_DB_*, ASMT_APP_URL=https://test.zakupki.tatar, ASMT_MAIL_MODE=smtp|mailhog|log
php scripts/seed_questions.php
php scripts/seed_formulations.php
php scripts/seed_admin.php
php scripts/seed_staff.php   # опционально для стенда
```

DocumentRoot → `public/`.  
Имя сессии Assessment: `ASMTSESSID` (не пересекается с CMS).

## 4. Nginx (фрагмент)

```nginx
server {
  listen 443 ssl;
  server_name test.zakupki.tatar;
  root /var/www/assessment/public;
  index index.html;

  location / {
    try_files $uri $uri/ =404;
  }
  location /api/ {
    try_files $uri =404;
  }
}
```

## 5. Портал zakupki.tatar

На основном сайте уже двухблочное `#loginModal`:

- Блок 1 — админ CMS (`api/auth.php` портала)
- Блок 2 — ссылки на Assessment (`assets/js/asmt-portal-config.js`)

После выката Assessment убедиться, что `ASMT_PORTAL` указывает на `https://test.zakupki.tatar` (на localhost конфиг сам переключится на `:8080`).

Повторный патч модалки при новых страницах:

```bash
php scripts/patch_login_modal.php
```

## 6. Почта (чтобы не попадало в спам)

На боевом сервере **не используйте** локальный `mail()` / IP VPS без репутации.
Рекомендуется бесплатный SMTP-релей **Brevo** (до ~300 писем/сутки): https://app.brevo.com/

1. Зарегистрируйте аккаунт Brevo → **SMTP & API** → создайте SMTP-ключ.
2. **Senders / Domains** → добавьте домен `zakupki.tatar` (или хотя бы отправителя `noreply@zakupki.tatar`).
3. В DNS у регистратора (reg.ru) добавьте записи, которые покажет Brevo:
   - **SPF** (TXT): обычно `v=spf1 include:spf.brevo.com ~all`  
     (если SPF уже есть — допишите `include:spf.brevo.com` в существующую запись, не создавайте вторую)
   - **DKIM** (TXT) — как в кабинете Brevo
   - желательно **DMARC** (TXT `_dmarc`): `v=DMARC1; p=none; rua=mailto:postmaster@zakupki.tatar`
4. В `assessment/.env` на сервере:

```bash
ASMT_MAIL_MODE=smtp
ASMT_MAIL_FROM=noreply@zakupki.tatar
ASMT_MAIL_FROM_NAME=ЦРЗ РТ — модуль тестирования
ASMT_SMTP_HOST=smtp-relay.brevo.com
ASMT_SMTP_PORT=587
ASMT_SMTP_ENCRYPTION=tls
ASMT_SMTP_USER=ваш_login_из_brevo
ASMT_SMTP_PASS=ваш_smtp_ключ
```

5. Проверка:

```bash
cd /var/www/CRZRT-Redesign/assessment
php scripts/mail_test.php your@mail.ru
```

Письмо должно прийти во «Входящие». Если в спаме — дождитесь верификации DKIM (до нескольких часов) и проверьте https://www.mail-tester.com/

### 6.1 Очередь писем и журнал в админке

Письма пишутся в таблицу `asmt_mail_queue` и отправляются воркером по cron:

```bash
crontab -e
* * * * * /usr/bin/php /var/www/CRZRT-Redesign/assessment/scripts/process_mail_queue.php >> /var/log/asmt-mail-queue.log 2>&1
```

Раздел «Почта» в админке (`admin-mail.html`) показывает получателя, время, тип письма
(`registration`, `password_reset`, `test`, `other`) и статус отправки, с пагинацией и фильтрами.
Записи старше 30 дней удаляются автоматически — воркером очереди и при открытии раздела.
После обновления кода один раз выполните миграцию (добавляет колонку `mail_type`):

```bash
cd /var/www/CRZRT-Redesign/assessment && php scripts/auto_migrate.php
```

## 7. Smoke после выката (30 мин)

- [ ] HTTPS `test.zakupki.tatar` открывается  
- [ ] С портала: кнопка «Войти как участник» ведёт на Assessment  
- [ ] Регистрация создаёт пользователя + согласия 152-ФЗ  
- [ ] Письмо с паролем / `mail.log`  
- [ ] ИНН из реестра подтягивает организацию  
- [ ] Тест: 40 вопросов, таймер, `formulation_id` в ответах  
- [ ] Повторная попытка в кампании запрещена  
- [ ] Админка: результаты, модерация, CSV, аналитика вопросов  
- [ ] ЕСИА: кнопка disabled (пока нет ключей) — см. `docs/ESIA_DEFERRED.md`  

## 8. Нагрузка

```bash
k6 run -e BASE_URL=https://test.zakupki.tatar -e VUS=100 -e DURATION=1m load/k6-smoke.js
```

Цели ТЗ: p95 ≤ 1.5 с (моб. 4G) / ≤ 0.5 с (провод). Факт на железе Заказчика фиксируется в протоколе ПСИ.

## 9. Документы

- `docs/ESIA_DEFERRED.md` — отложение ЕСИА  
- `docs/ACCEPTANCE_CHECKLIST.md` — критерии §7.2  
- `LOCAL_WINDOWS.md` — локальный стенд  
