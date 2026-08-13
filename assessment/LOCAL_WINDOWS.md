# Локальный запуск Assessment без Docker (Windows)

Виртуализация / Docker не нужны.

## Уже настроено на этой машине

| Компонент | Статус |
|-----------|--------|
| PHP 8.2.33 | установлен (WinGet), `pdo_pgsql` + `mbstring` |
| PostgreSQL 16 | служба `postgresql-x64-16` Running |
| БД `asmt` / пользователь `asmt` | созданы |
| Схема + 100 вопросов + admin | залиты |

**Пароль суперпользователя postgres** (на этой установке): `postgres`  
**Пароль БД приложения**: `asmt` / `asmt_secret`  
**Админ Assessment**: `admin@assessment.local` / `Admin123!`

## Запуск сервера

Открой **новый** терминал (чтобы PATH подхватил PHP) или явно:

```powershell
$phpDir = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe"
$env:Path = "C:\Program Files\PostgreSQL\16\bin;$phpDir;" + $env:Path

cd C:\Users\Matvey\Documents\Projects\CRZRT-Site\assessment\public
php -S localhost:8080
```

Открыть: **http://localhost:8080**

Письма с паролем при регистрации пишутся в `assessment/storage/mail.log` (`ASMT_MAIL_MODE=log`).

## Если php не находится в новом терминале

```powershell
$env:Path = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe;C:\Program Files\PostgreSQL\16\bin;" + $env:Path
```

Или добавь оба каталога в PATH системы (Параметры → Переменные среды).

## Повторная установка с нуля

```powershell
winget install -e --id PHP.PHP.8.2 --accept-package-agreements --accept-source-agreements
winget install -e --id PostgreSQL.PostgreSQL.16 --accept-package-agreements --accept-source-agreements
```

В `php.ini` (рядом с `php.exe`):
```
extension_dir = "ext"
extension=pdo_pgsql
extension=pgsql
extension=mbstring
```

```powershell
$env:PGPASSWORD = 'postgres'   # ваш пароль postgres
psql -U postgres -h 127.0.0.1 -f sql\init_user.sql
$env:PGPASSWORD = 'asmt_secret'
psql -U asmt -h 127.0.0.1 -d asmt -f sql\schema.pgsql.sql
copy .env.example .env
php scripts\seed_questions.php
php scripts\seed_admin.php
```

## Docker

Не используем, пока нет виртуализации (Hyper-V / VT-x). Assessment рассчитан на обычный PHP + PostgreSQL.
