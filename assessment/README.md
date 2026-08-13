# Assessment — локальный стенд

Изолированный модуль профессионального тестирования (PostgreSQL).

## Быстрый старт (Docker)

Требуется [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
cd assessment
docker compose up -d --build
docker compose exec app sh scripts/bootstrap_seed.sh
```

Открыть:

- Приложение: http://localhost:8080  
- MailHog (письма): http://localhost:8025  
- PostgreSQL: `localhost:5433` (user/pass/db: `asmt` / `asmt_secret` / `asmt`)

Суперадмин по умолчанию: `admin@assessment.local` / `Admin123!`

## Сценарий проверки (этап 1 — MVP)

1. http://localhost:8080/register.html — зарегистрироваться  
2. Сохранить показанный пароль (дублируется в MailHog / `storage/mail.log`)  
3. Личный кабинет → «Пройти тест»  
4. Ответить на часть вопросов, завершить  
5. Увидеть результат и историю в ЛК  
6. Вход суперадмина → `admin.html` → фильтры → «Скачать CSV (Excel)»  
7. «Забыли пароль?» → ссылка в `storage/mail.log` → `reset.html?token=…`  

**Полный чеклист ручного тестирования:**  
`Документы/Чеклист_ручного_тестирования_Assessment.md`  
и PDF: `Документы/Чеклист_ручного_тестирования_Assessment.pdf`

**Этап 1 закрыт локально** (auth, тест, админка, CSV, Magic Link, rate limit).  
**Этап 2 закрыт локально** (справочник 3 ур., ИНН, модерация, баннеры, org-stats, RBAC).  
**Этап 3 закрыт локально** (формулировки, банк вопросов, аналитика + CSV).  
**Этап 4 (код):** модалка портала ✅, ЕСИА-заглушка ✅, k6/индексы/DEPLOY ✅. Прогон 5000 VU и OAuth ЕСИА — на сервере Заказчика.

### Учётные записи стенда

| Роль | Email | Пароль |
|------|-------|--------|
| superadmin | admin@assessment.local | Admin123! |
| region_admin | region_admin@assessment.local | Admin123! |
| moderator | moderator@assessment.local | Admin123! |
| analyst | analyst@assessment.local | Admin123! |

Демо-ИНН для автозаполнения: `1644010001`, `1655010002`, `1652010003`.

```bash
php scripts/seed_orgs.php
php scripts/seed_staff.php
php scripts/seed_formulations.php
php scripts/import_orgs_csv.php sql/orgs_import_sample.csv
```
 

## Структура

```
assessment/
  docker-compose.yml
  public/          # UI
  api/             # PHP API
  sql/             # schema.pgsql.sql, questions_seed.json
  scripts/         # seed_questions.php, seed_admin.php
```

## Документы

- План: `../Документы/План_выполнения_ТЗ_Assessment.md`
- Выкат на бой: `DEPLOY.md`
