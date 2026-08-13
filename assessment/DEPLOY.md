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

## 6. Smoke после выката (30 мин)

- [ ] HTTPS `test.zakupki.tatar` открывается  
- [ ] С портала: кнопка «Войти как участник» ведёт на Assessment  
- [ ] Регистрация создаёт пользователя + согласия 152-ФЗ  
- [ ] Письмо с паролем / `mail.log`  
- [ ] ИНН из реестра подтягивает организацию  
- [ ] Тест: 40 вопросов, таймер, `formulation_id` в ответах  
- [ ] Повторная попытка в кампании запрещена  
- [ ] Админка: результаты, модерация, CSV, аналитика вопросов  
- [ ] ЕСИА: кнопка disabled (пока нет ключей) — см. `docs/ESIA_DEFERRED.md`  

## 7. Нагрузка

```bash
k6 run -e BASE_URL=https://test.zakupki.tatar -e VUS=100 -e DURATION=1m load/k6-smoke.js
```

Цели ТЗ: p95 ≤ 1.5 с (моб. 4G) / ≤ 0.5 с (провод). Факт на железе Заказчика фиксируется в протоколе ПСИ.

## 8. Документы

- `docs/ESIA_DEFERRED.md` — отложение ЕСИА  
- `docs/ACCEPTANCE_CHECKLIST.md` — критерии §7.2  
- `LOCAL_WINDOWS.md` — локальный стенд  
