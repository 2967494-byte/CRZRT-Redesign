# -*- coding: utf-8 -*-
"""PDF: manual testing checklist for Assessment module."""
from __future__ import annotations

import os
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "Документы" / "Чеклист_ручного_тестирования_Assessment.pdf"
WIN_FONTS = Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts"

pdfmetrics.registerFont(TTFont("Arial", str(WIN_FONTS / "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(WIN_FONTS / "arialbd.ttf")))

GREEN = colors.HexColor("#1f8a5b")
GREEN_LIGHT = colors.HexColor("#e8f5ee")
BORDER = colors.HexColor("#c9d3df")
HEADER_BG = colors.HexColor("#1a3a4a")
MUTED = colors.HexColor("#4b5563")
ROW_ALT = colors.HexColor("#f7faf8")


def S():
    return {
        "title": ParagraphStyle("t", fontName="Arial-Bold", fontSize=15, leading=19, alignment=TA_CENTER, textColor=HEADER_BG, spaceAfter=4),
        "sub": ParagraphStyle("s", fontName="Arial", fontSize=9, leading=12, alignment=TA_CENTER, textColor=MUTED, spaceAfter=8),
        "h1": ParagraphStyle("h1", fontName="Arial-Bold", fontSize=11, leading=14, textColor=HEADER_BG, spaceBefore=10, spaceAfter=5),
        "body": ParagraphStyle("b", fontName="Arial", fontSize=8.5, leading=11, spaceAfter=4),
        "cell": ParagraphStyle("c", fontName="Arial", fontSize=7.4, leading=9.5),
        "cell_b": ParagraphStyle("cb", fontName="Arial-Bold", fontSize=7.4, leading=9.5, textColor=colors.white),
        "note": ParagraphStyle("n", fontName="Arial", fontSize=8, leading=10, textColor=MUTED, spaceAfter=6),
        "smoke": ParagraphStyle("sm", fontName="Arial", fontSize=8.5, leading=11, leftIndent=6, spaceAfter=2),
    }


def P(text, key, styles):
    return Paragraph(text, styles[key])


def table(headers, rows, widths, styles, check_col=True):
    data = [[P(h, "cell_b", styles) for h in headers]]
    for row in rows:
        cells = [P(c, "cell", styles) for c in row]
        data.append(cells)
    t = Table(data, colWidths=widths, repeatRows=1)
    cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), HEADER_BG),
        ("GRID", (0, 0), (-1, -1), 0.35, BORDER),
        ("BOX", (0, 0), (-1, -1), 0.7, GREEN),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 3),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]
    for i in range(1, len(data)):
        if i % 2 == 0:
            cmds.append(("BACKGROUND", (0, i), (-1, i), ROW_ALT))
    if check_col:
        cmds.append(("ALIGN", (-1, 1), (-1, -1), "CENTER"))
    t.setStyle(TableStyle(cmds))
    return t


def section(title, headers, rows, widths, styles):
    return KeepTogether([P(title, "h1", styles), table(headers, rows, widths, styles), Spacer(1, 2 * mm)])


def build():
    styles = S()
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=12 * mm,
        rightMargin=12 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title="Чеклист ручного тестирования Assessment",
    )
    W = doc.width
    story = []

    story.append(P("ЧЕКЛИСТ РУЧНОГО ТЕСТИРОВАНИЯ", "title", styles))
    story.append(P("Модуль Assessment · v1.0 · 06.08.2026", "sub", styles))
    story.append(
        P(
            "Стенд: <b>http://localhost:8080</b> &nbsp;|&nbsp; Письма: <b>assessment/storage/mail.log</b><br/>"
            "Отметка: <b>OK</b> / <b>FAIL</b> / <b>N/A</b> &nbsp;·&nbsp; "
            "Тестировщик: __________ &nbsp; Дата: ______ &nbsp; Устройство: __________",
            "body",
            styles,
        )
    )

    # Accounts
    story.append(P("Учётные записи стенда", "h1", styles))
    story.append(
        table(
            ["Роль", "Email", "Пароль"],
            [
                ["Суперадмин", "admin@assessment.local", "Admin123!"],
                ["Региональный админ", "region_admin@assessment.local", "Admin123!"],
                ["Модератор", "moderator@assessment.local", "Admin123!"],
                ["Аналитик", "analyst@assessment.local", "Admin123!"],
            ],
            [40 * mm, 80 * mm, W - 120 * mm],
            styles,
            check_col=False,
        )
    )
    story.append(
        P(
            "Демо-ИНН: <b>1644010001</b> (Альметьевск), <b>1655010002</b> (Казань), <b>1652010003</b> (Нижнекамск). "
            "Перед тестом: сервер PHP запущен, PostgreSQL up, при 429 очистить <font face='Arial'>storage/ratelimit</font>.",
            "note",
            styles,
        )
    )

    H = ["#", "Действие", "Ожидание", "☐"]
    # widths for standard 4-col
    w4 = [10 * mm, 62 * mm, W - 88 * mm, 16 * mm]

    story.append(
        section(
            "0. Подготовка",
            H,
            [
                ["0.1", "PHP: php -S localhost:8080 из assessment/public", "Главная открывается", ""],
                ["0.2", "PostgreSQL / БД asmt", "Нет ошибок БД", ""],
                ["0.3", "Seed при чистой БД (README / LOCAL_WINDOWS)", "Admin, вопросы, orgs, staff", ""],
            ],
            w4,
            styles,
        )
    )

    story.append(
        section(
            "1. Модалка портала (index.html)",
            H,
            [
                ["1.1", "Иконка входа", "Два блока: админ CMS + участник", ""],
                ["1.2", "«Войти как участник»", "→ Assessment /login.html", ""],
                ["1.3", "«Регистрация»", "→ Assessment /register.html", ""],
                ["1.4", "Mobile ≤375px", "Читаемо, кнопки ≥44px", ""],
            ],
            w4,
            styles,
        )
    )

    story.append(
        section(
            "2. Регистрация + ИНН",
            H,
            [
                ["2.1", "ИНН 1644010001", "Автоподстановка + иерархия 1→2→3", ""],
                ["2.2", "Поле «Организация»", "Readonly после lookup", ""],
                ["2.3", "ИНН 9999999999", "«Не найден», ручной ввод названия", ""],
                ["2.4", "Без согласий 152-ФЗ", "Регистрация блокируется", ""],
                ["2.5", "Полная регистрация (новый email/телефон)", "Логин+пароль на экране → ЛК", ""],
                ["2.6", "mail.log", "Письмо с учётными данными", ""],
                ["2.7", "Повтор того же email", "Ошибка «уже зарегистрирован»", ""],
            ],
            w4,
            styles,
        )
    )
    story.append(P("Тест-участник: email _____________ пароль _____________ ФИО _____________", "note", styles))

    story.append(
        section(
            "3. Вход / выход / Magic Link / ЕСИА",
            H,
            [
                ["3.1", "Верный логин участника", "cabinet.html", ""],
                ["3.2", "Неверный пароль", "Ошибка, остаёмся на login", ""],
                ["3.3", "«Забыли пароль?»", "Сообщение об отправке", ""],
                ["3.4", "Ссылка из mail.log", "Форма нового пароля", ""],
                ["3.5", "Новый пароль ≥8", "Вход новым паролем OK", ""],
                ["3.6", "Повтор той же ссылки", "Ссылка недействительна", ""],
                ["3.7", "«Войти через Госуслуги»", "Disabled + пояснение", ""],
            ],
            w4,
            styles,
        )
    )

    story.append(
        section(
            "4. Личный кабинет",
            H,
            [
                ["4.1", "Открыть ЛК", "ФИО, орг, статус модерации", ""],
                ["4.2", "Иерархия (если из справочника)", "Ур.1 / ур.2 видны", ""],
                ["4.3", "Статус pending", "Можно тест; в отчёт — после approve", ""],
                ["4.4", "Баннер региона", "«Аттестация 2026» или иной", ""],
                ["4.5", "«Пройти тест»", "Активна без finished-попытки", ""],
            ],
            w4,
            styles,
        )
    )

    story.append(
        section(
            "5. Прохождение теста",
            H,
            [
                ["5.1", "Старт", "40 вопросов, таймер ~90 мин", ""],
                ["5.2", "Network на вопросах", "Нет correct_letter / ключей", ""],
                ["5.3", "UI mobile", "Карточки ≥44px, шрифт ≥16px", ""],
                ["5.4", "Ответы + refresh", "Resume, ответы сохранены", ""],
                ["5.5", "Завершить", "Балл, %, экран результата", ""],
                ["5.6", "История в ЛК", "Запись попытки", ""],
                ["5.7", "Повторный старт", "Отказ «уже пройден»", ""],
                ["5.8", "Два участника, один № вопроса", "Формулировки могут отличаться", ""],
            ],
            w4,
            styles,
        )
    )

    story.append(
        section(
            "6. Модерация (moderator@…)",
            H,
            [
                ["6.1", "Админка → «Модерация»", "Очередь pending", ""],
                ["6.2", "Заявка тест-участника", "ФИО, орг, иерархия", ""],
                ["6.3", "«Утвердить»", "approved", ""],
                ["6.4", "ЛК участника", "Бейдж «Утверждено»", ""],
                ["6.5", "Уточнить/отклонить", "Комментарий обязателен; виден в ЛК", ""],
            ],
            w4,
            styles,
        )
    )

    story.append(
        section(
            "7. Результаты и CSV (admin@…)",
            H,
            [
                ["7.1", "Вкладка «Результаты»", "Попытки, баллы, устройство", ""],
                ["7.2", "Колонка IP", "Видна superadmin / region_admin", ""],
                ["7.3", "Фильтры", "Список сужается", ""],
                ["7.4", "«Только approved»", "Только утверждённые", ""],
                ["7.5", "Скачать CSV → Excel", "Кириллица OK (UTF-8 BOM)", ""],
            ],
            w4,
            styles,
        )
    )

    story.append(
        section(
            "8. Свод организаций",
            H,
            [
                ["8.1", "Вкладка свода", "Пояснение: только approved", ""],
                ["8.2", "После approve + finished", "Строка со средними", ""],
                ["8.3", "Только pending", "В своде нет", ""],
            ],
            w4,
            styles,
        )
    )

    story.append(
        section(
            "9. Банк вопросов / формулировки",
            H,
            [
                ["9.1", "Список вопросов", "~100 шт., формулировок ≥1 (часто 3)", ""],
                ["9.2", "Открыть вопрос", "Текст + список формулировок", ""],
                ["9.3", "Добавить формулировку", "Появляется в списке", ""],
                ["9.4", "Отключить последнюю активную", "Запрещено", ""],
                ["9.5", "analyst@", "Просмотр без редактирования", ""],
            ],
            w4,
            styles,
        )
    )

    story.append(
        section(
            "10. Аналитика вопросов",
            H,
            [
                ["10.1", "Вкладка аналитики", "%, рейтинг easy/hard/needs_correction", ""],
                ["10.2", "Фильтр рейтинга", "Список фильтруется", ""],
                ["10.3", "CSV аналитики", "Открывается в Excel", ""],
            ],
            w4,
            styles,
        )
    )

    story.append(
        section(
            "11. RBAC",
            H,
            [
                ["11.1", "analyst → модерация", "Нет действий / 403", ""],
                ["11.2", "analyst → CSV результатов", "Доступно", ""],
                ["11.3", "moderator → IP", "Скрыт", ""],
                ["11.4", "region_admin → IP", "Виден", ""],
                ["11.5", "participant → admin.html", "Редирект / отказ", ""],
            ],
            w4,
            styles,
        )
    )

    story.append(
        section(
            "12. Граничные",
            H,
            [
                ["12.1", "≥21 неверный логин", "429 «Слишком много запросов»", ""],
                ["12.2", "Очистить ratelimit / подождать", "Логин снова OK", ""],
                ["12.3", "/api/esia.php?action=start", "enabled:false / deferred", ""],
            ],
            w4,
            styles,
        )
    )

    # Smoke 15 min
    box = Table(
        [[
            P(
                "<b>Smoke за 15 минут (минимум)</b><br/>"
                "1) Модалка → участник &nbsp; 2) Регистрация ИНН 1644010001 &nbsp; 3) ЛК: баннер + тест<br/>"
                "4) 3–5 ответов → finish &nbsp; 5) Модератор: approve &nbsp; 6) Админ: CSV + свод<br/>"
                "7) Банк формулировок &nbsp; 8) Аналитика + CSV &nbsp; 9) ЕСИА disabled<br/>"
                "Если все 9 зелёные — базовый контур жив.",
                "body",
                styles,
            )
        ]],
        colWidths=[W],
    )
    box.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), GREEN_LIGHT),
                ("BOX", (0, 0), (-1, -1), 1, GREEN),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(Spacer(1, 3 * mm))
    story.append(box)

    story.append(Spacer(1, 4 * mm))
    story.append(
        P(
            "Вердикт: ☐ готово к выкату &nbsp; ☐ есть блокеры &nbsp; ☐ некритичные замечания<br/>"
            "Блокеры: _________________________________________________________________",
            "body",
            styles,
        )
    )

    def on_page(canvas, doc_):
        canvas.saveState()
        canvas.setStrokeColor(GREEN)
        canvas.setLineWidth(0.7)
        canvas.line(12 * mm, A4[1] - 9 * mm, A4[0] - 12 * mm, A4[1] - 9 * mm)
        canvas.setFont("Arial", 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(12 * mm, A4[1] - 7 * mm, "Assessment · чеклист ручного тестирования")
        canvas.drawRightString(A4[0] - 12 * mm, A4[1] - 7 * mm, "OK / FAIL / N/A")
        canvas.line(12 * mm, 10 * mm, A4[0] - 12 * mm, 10 * mm)
        canvas.drawCentredString(A4[0] / 2, 5.5 * mm, f"стр. {doc_.page}")
        canvas.restoreState()

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"OK: {OUT}")


if __name__ == "__main__":
    build()
