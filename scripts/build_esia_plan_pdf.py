# -*- coding: utf-8 -*-
"""Generate customer-facing ESIA connection plan PDF."""
from __future__ import annotations

import os
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "Документы" / "План_подключения_ЕСИА.pdf"
WIN_FONTS = Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts"

pdfmetrics.registerFont(TTFont("Arial", str(WIN_FONTS / "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(WIN_FONTS / "arialbd.ttf")))

GREEN = colors.HexColor("#1f8a5b")
GREEN_LIGHT = colors.HexColor("#e8f5ee")
BORDER = colors.HexColor("#c9d3df")
HEADER_BG = colors.HexColor("#1a3a4a")
MUTED = colors.HexColor("#4b5563")
ROW_ALT = colors.HexColor("#f7faf8")


def styles():
    base = getSampleStyleSheet()
    return {
        "cover_title": ParagraphStyle(
            "cover_title",
            fontName="Arial-Bold",
            fontSize=18,
            leading=24,
            alignment=TA_CENTER,
            textColor=HEADER_BG,
            spaceAfter=8,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub",
            fontName="Arial",
            fontSize=11,
            leading=15,
            alignment=TA_CENTER,
            textColor=MUTED,
            spaceAfter=4,
        ),
        "h1": ParagraphStyle(
            "h1",
            fontName="Arial-Bold",
            fontSize=13,
            leading=17,
            textColor=HEADER_BG,
            spaceBefore=14,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "h2",
            fontName="Arial-Bold",
            fontSize=11,
            leading=14,
            textColor=GREEN,
            spaceBefore=10,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body",
            fontName="Arial",
            fontSize=9.5,
            leading=13,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
        ),
        "note": ParagraphStyle(
            "note",
            fontName="Arial",
            fontSize=9,
            leading=12,
            textColor=MUTED,
            leftIndent=4,
            spaceAfter=8,
            spaceBefore=4,
        ),
        "meta": ParagraphStyle(
            "meta",
            fontName="Arial",
            fontSize=9.5,
            leading=13,
            spaceAfter=3,
        ),
        "cell": ParagraphStyle(
            "cell",
            fontName="Arial",
            fontSize=8.2,
            leading=11,
        ),
        "cell_b": ParagraphStyle(
            "cell_b",
            fontName="Arial-Bold",
            fontSize=8.2,
            leading=11,
            textColor=colors.white,
        ),
        "footer": ParagraphStyle(
            "footer",
            fontName="Arial",
            fontSize=8,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
        "callout": ParagraphStyle(
            "callout",
            fontName="Arial-Bold",
            fontSize=10,
            leading=13,
            textColor=HEADER_BG,
            alignment=TA_CENTER,
        ),
    }


def P(text: str, style_name: str, S) -> Paragraph:
    return Paragraph(text.replace("\n", "<br/>"), S[style_name])


def make_table(headers, rows, col_widths, S, header=True):
    data = []
    if header:
        data.append([P(h, "cell_b", S) for h in headers])
    for row in rows:
        data.append([P(c, "cell", S) for c in row])

    t = Table(data, colWidths=col_widths, repeatRows=1 if header else 0)
    style_cmds = [
        ("FONTNAME", (0, 0), (-1, -1), "Arial"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("GRID", (0, 0), (-1, -1), 0.4, BORDER),
        ("BOX", (0, 0), (-1, -1), 0.8, GREEN),
    ]
    if header:
        style_cmds += [
            ("BACKGROUND", (0, 0), (-1, 0), HEADER_BG),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ]
        for i in range(1, len(data)):
            if i % 2 == 0:
                style_cmds.append(("BACKGROUND", (0, i), (-1, i), ROW_ALT))
    else:
        for i in range(len(data)):
            if i % 2 == 1:
                style_cmds.append(("BACKGROUND", (0, i), (-1, i), ROW_ALT))
            style_cmds.append(("BACKGROUND", (0, i), (0, i), GREEN_LIGHT))
            style_cmds.append(("FONTNAME", (0, i), (0, i), "Arial-Bold"))

    t.setStyle(TableStyle(style_cmds))
    return t


def letter_block(title: str, fields: list[tuple[str, str]], note: str | None, S, width):
    bits = [P(title, "h2", S)]
    bits.append(
        make_table(
            [],
            [[k, v] for k, v in fields],
            [38 * mm, width - 38 * mm],
            S,
            header=False,
        )
    )
    if note:
        bits.append(P(note, "note", S))
    bits.append(Spacer(1, 4))
    return KeepTogether(bits)


def build():
    S = styles()
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title="План подключения модуля Assessment к ЕСИА",
        author="АО «ЦРЗ РТ» / Исполнитель",
    )
    W = doc.width
    story = []

    # Cover
    story.append(Spacer(1, 12 * mm))
    story.append(P("ПЛАН ПОДКЛЮЧЕНИЯ", "cover_title", S))
    story.append(P("модуля Assessment к ЕСИА (Госуслуги)", "cover_title", S))
    story.append(Spacer(1, 6 * mm))
    story.append(P("Документ для передачи Заказчику<br/>организационно-правовой контур", "cover_sub", S))
    story.append(Spacer(1, 8 * mm))

    meta = [
        ["Проект", "Автоматизированный модуль профессионального тестирования (Assessment)"],
        ["Система", "https://test.zakupki.tatar"],
        ["Заказчик / оператор ИС", "АО «Центр развития закупок Республики Татарстан»"],
        ["Учредитель", "Республика Татарстан"],
        ["Дата", "06.08.2026"],
        [
            "Основание",
            "Регламент информационного взаимодействия с Оператором ЕСИА; "
            "инструкция ЕСКС «Как подключиться к ЕСИА» (актуализация 26.01.2026)",
        ],
    ]
    story.append(make_table(["Параметр", "Значение"], meta, [42 * mm, W - 42 * mm], S))
    story.append(Spacer(1, 8 * mm))

    callout = Table(
        [[P("Главный адрес подачи заявок на подключение ИС к ЕСИА:<br/>"
           "<font color='#1f8a5b'><b>sd@sc.digital.gov.ru</b></font>", "callout", S)]],
        colWidths=[W],
    )
    callout.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), GREEN_LIGHT),
                ("BOX", (0, 0), (-1, -1), 1, GREEN),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    story.append(callout)

    # 1
    story.append(P("1. Краткий вывод", "h1", S))
    story.append(
        P(
            "Подключение <b>входа через Госуслуги (ЕСИА)</b> для модуля Assessment — это "
            "<b>организационная процедура Заказчика</b> и последующая техническая настройка Исполнителем.",
            "body",
            S,
        )
    )
    story.append(
        P(
            "Для АО с учредителем в лице Республики Татарстан правовые предпосылки, как правило, "
            "<b>благоприятные</b>: организация относится к контуру региональной инфраструктуры закупок "
            "и может обосновать подключение нормативными актами РТ. Окончательное решение принимает "
            "<b>федеральный операторский контур ЕСИА</b> (заявки — в ситуационный центр электронного правительства).",
            "body",
            S,
        )
    )
    story.append(
        P(
            "Официальная памятка: https://info.gosuslugi.ru/articles/Как_подключиться_к_ЕСИА/",
            "note",
            S,
        )
    )

    # 2
    story.append(P("2. Роли и ответственность", "h1", S))
    roles = [
        ["Заявитель / оператор ИС", "АО «ЦРЗ РТ»", "Регистрация организации и ИС, КЭП, заявки на тест/пром, правовые основания"],
        ["Руководитель организации", "Генеральный директор (или иное лицо с правом действовать без доверенности)", "Подтверждённая УЗ в ЕСИА, КЭП руководителя, регистрация ЮЛ в ЕСИА"],
        ["Ответственный за Технологический портал", "Назначенный сотрудник Заказчика (ИТ / ИБ / администратор портала)", "Регистрация ИС, сертификат ИС, переписка с СЦ"],
        ["Сопровождение (регион)", "Минцифры Республики Татарстан (рекомендуется)", "Методическая поддержка, проверка комплектности, ускорение координации"],
        ["Исполнитель (разработчик)", "Подрядчик по разработке Assessment", "Техпараметры redirect URI / scope, реализация OIDC после выдачи доступов"],
        ["Оператор ЕСИА / СЦ", "Минцифры России / ситуационный центр ЭП", "Приём заявок, тестовый и промышленный доступ"],
    ]
    story.append(make_table(["Роль", "Кто", "Что делает"], roles, [38 * mm, 52 * mm, W - 90 * mm], S))

    # 3
    story.append(P("3. Карта писем и обращений", "h1", S))
    story.append(
        P(
            "Ниже — рабочий порядок. Адреса и формы заявок нужно сверить с <b>актуальной</b> редакцией "
            "Регламента ЕСИА на момент подачи (формы — в приложениях к Регламенту).",
            "body",
            S,
        )
    )

    story.append(
        letter_block(
            "Письмо № 0 (по желанию) — региональное сопровождение",
            [
                ("От кого", "АО «ЦРЗ РТ» (гендиректор / зам. по ИТ)"),
                (
                    "Кому",
                    "Министерство цифрового развития государственного управления, информационных технологий "
                    "и связи Республики Татарстан (актуальное полное наименование — уточнить в справочнике органов РТ)",
                ),
                (
                    "Куда",
                    "Официальный email / ЭДО Минцифры РТ (уточнить на сайте органа); копия — куратору от учредителя",
                ),
                (
                    "Тема",
                    "О методическом сопровождении подключения ИС модуля Assessment (test.zakupki.tatar) к ЕСИА",
                ),
                (
                    "Суть",
                    "Просим подтвердить готовность оказать методическую помощь при подготовке заявки в СЦ ЭП; "
                    "указать контакт ответственного специалиста Минцифры РТ",
                ),
                (
                    "Вложения",
                    "Краткое описание ИС (1–2 стр.), цели входа через Госуслуги, домен test.zakupki.tatar",
                ),
            ],
            "Это письмо <b>не заменяет</b> федеральную заявку. Оно помогает АО с учредителем РТ пройти контур быстрее.",
            S,
            W,
        )
    )

    story.append(
        letter_block(
            "Письмо № 1 — регистрация организации в ЕСИА (обязательно)",
            [
                ("Кто делает", "Руководитель АО «ЦРЗ РТ»"),
                ("Куда", "Портал ЕСИА / Госуслуги (профиль организации), не email"),
                (
                    "Что",
                    "1) Подтверждённая УЗ руководителя; 2) КЭП на руководителя; "
                    "3) регистрация ЮЛ в ЕСИА; 4) ожидание проверки ФНС",
                ),
                ("Результат", "Организация видна в ЕСИА как юридическое лицо"),
            ],
            "Инструкция: раздел 1 памятки ЕСКС «Регистрация организации в ЕСИА».",
            S,
            W,
        )
    )

    story.append(
        letter_block(
            "Письмо № 2 — назначение ответственного (внутри АО)",
            [
                ("От кого", "Руководитель АО"),
                ("Кому", "Ответственный сотрудник (ИТ/ИБ)"),
                ("Форма", "Приказ / распоряжение + действие в профиле организации ЕСИА"),
                (
                    "Что",
                    "Присоединить УЗ сотрудника к организации; включить в группу доступа «Технологический портал»",
                ),
                ("Результат", "Сотрудник может работать на Технологическом портале ЕСИА"),
            ],
            "Портал: https://esia.gosuslugi.ru/console/tech",
            S,
            W,
        )
    )

    story.append(
        letter_block(
            "Письмо № 3 — регистрация информационной системы",
            [
                ("Кто делает", "Ответственный с доступом к Технологическому порталу"),
                ("Куда", "Технологический портал ЕСИА (веб-интерфейс)"),
                ("Что", "Добавить запись информационной системы модуля Assessment"),
                (
                    "Важно",
                    "Мнемоника ИС должна совпадать с мнемоникой в СМЭВ "
                    "(если ИС уже/будет в СМЭВ — использовать ту же)",
                ),
                (
                    "Имя ИС (проект)",
                    "«Модуль Assessment — профессиональное тестирование специалистов сферы закупок ЦРЗ РТ»",
                ),
                ("URL", "https://test.zakupki.tatar"),
            ],
            "Если ИС ещё не в СМЭВ — параллельно запускается регистрация в СМЭВ (часто через регионального оператора / Минцифры РТ).",
            S,
            W,
        )
    )

    story.append(
        letter_block(
            "Письмо № 4 — заявка на ТЕСТОВУЮ среду ЕСИА (ключевое)",
            [
                ("От кого", "Оператор ИС — АО «ЦРЗ РТ» (ответственный / руководитель)"),
                ("Кому / куда", "<b>sd@sc.digital.gov.ru</b> (Ситуационный центр электронного правительства)"),
                (
                    "Форма",
                    "Заявка по форме из Регламента информационного взаимодействия "
                    "(приложение — форма на подключение к тестовой среде)",
                ),
                (
                    "Тема письма (пример)",
                    "Заявка на подключение ИС к тестовой среде ЕСИА — АО «ЦРЗ РТ», модуль Assessment (test.zakupki.tatar)",
                ),
                (
                    "В заявке указать",
                    "НПА-основания; необходимые области доступа (scope); данные об операторе ИС и об ИС",
                ),
                (
                    "Вложения",
                    "1) Форма заявки; 2) сертификат ключа ЭП информационной системы; "
                    "3) лицензии / договоры (при необходимости); 4) краткое описание ИС",
                ),
                ("Результат", "Доступ к тестовой ЕСИА, параметры для отладки (по ответу СЦ)"),
            ],
            None,
            S,
            W,
        )
    )

    story.append(P("Технические параметры для заявки (готовит Исполнитель / фиксирует Заказчик):", "body", S))
    tech = [
        ["Redirect URI (callback)", "https://test.zakupki.tatar/api/esia.php?action=callback"],
        ["Стартовая страница входа", "https://test.zakupki.tatar/login.html"],
        ["Протокол", "OpenID Connect / OAuth 2.0 (по методическим рекомендациям ЕСИА)"],
        ["Цель", "Идентификация и аутентификация участников тестирования"],
        [
            "Scope (минимум)",
            "Идентификация ФЛ, ФИО, контакты (email/телефон — если доступны политикой согласия). "
            "Не запрашивать лишние scope «на будущее».",
        ],
    ]
    story.append(make_table(["Параметр", "Значение"], tech, [48 * mm, W - 48 * mm], S))

    story.append(
        letter_block(
            "Письмо № 5 — заявка на ПРОМЫШЛЕННУЮ среду ЕСИА",
            [
                ("От кого", "АО «ЦРЗ РТ»"),
                ("Кому / куда", "<b>sd@sc.digital.gov.ru</b>"),
                ("Когда", "После успешной отладки на тесте"),
                ("Форма", "Заявка на подключение к промышленной среде (форма Регламента)"),
                ("Обязательно указать", "НПА; scope; <b>номер заявки на тестовое подключение</b>"),
                ("Вложения", "Форма; сертификат ЭП ИС; подтверждающие документы по форме"),
                (
                    "После согласования",
                    "Загрузить сертификат ЭП в карточку ИС через Технологический портал ЕСИА",
                ),
            ],
            None,
            S,
            W,
        )
    )

    story.append(
        letter_block(
            "Письмо № 6 — Исполнителю после ответов СЦ",
            [
                ("От кого", "АО «ЦРЗ РТ» (ответственный за ИС)"),
                ("Кому", "Исполнитель разработки Assessment"),
                ("Куда", "Рабочий email / ЭДО по договору"),
                ("Тема", "Передача параметров ЕСИА для включения входа через Госуслуги"),
                (
                    "Состав пакета",
                    "mnemonic / client_id; среда (тест/пром); сертификаты; разрешённые scope; "
                    "redirect URI; контакты СЦ по тикету",
                ),
                (
                    "Ожидаемый результат",
                    "Включение ASMT_ESIA_ENABLED, реализация OIDC callback, тест сценария "
                    "«вход → создание/привязка УЗ → дозаполнение анкеты → согласия 152-ФЗ»",
                ),
            ],
            None,
            S,
            W,
        )
    )

    story.append(
        letter_block(
            "Письмо № 7 — статус / дозапрос",
            [
                ("От кого", "Ответственный АО «ЦРЗ РТ»"),
                ("Кому / куда", "<b>sd@sc.digital.gov.ru</b>"),
                ("Тема", "Уточнение статуса заявки № … от … — подключение ИС Assessment АО «ЦРЗ РТ»"),
                ("Суть", "Просим сообщить статус рассмотрения / перечень недостающих документов"),
            ],
            None,
            S,
            W,
        )
    )

    # 4 calendar
    story.append(P("4. Пошаговый календарный план (ориентир)", "h1", S))
    cal = [
        ["A", "КЭП руководителя + регистрация ЮЛ в ЕСИА", "Руководитель АО", "3–10 р.д."],
        ["B", "Приказ + доступ сотрудника к Технологическому порталу", "АО", "1–3 р.д."],
        ["C", "Регистрация ИС (и СМЭВ-мнемоника при необходимости)", "АО (+ Минцифры РТ)", "5–15 р.д."],
        ["D", "Выпуск КЭП / сертификата на ИС", "АО (УЦ)", "3–10 р.д."],
        ["E", "Письмо № 0 в Минцифры РТ (сопровождение)", "АО", "параллельно с C–D"],
        ["F", "Заявка тест → sd@sc.digital.gov.ru", "АО", "1 р.д. на отправку"],
        ["G", "Ответ СЦ + настройка теста", "СЦ + АО + Исполнитель", "по регламенту СЦ"],
        ["H", "Отладка входа на test.zakupki.tatar", "Исполнитель", "3–7 р.д. после доступов"],
        ["I", "Заявка на пром → sd@sc.digital.gov.ru", "АО", "после успешного теста"],
        ["J", "Пром + приёмка", "АО + Исполнитель", "3–7 р.д."],
    ]
    story.append(
        make_table(
            ["Этап", "Действие", "Ответственный", "Ориентир*"],
            cal,
            [14 * mm, W - 78 * mm, 38 * mm, 26 * mm],
            S,
        )
    )
    story.append(
        P(
            "* Сроки рассмотрения заявок СЦ зависят от федерального контура и комплектности документов; "
            "Исполнитель на них не влияет.",
            "note",
            S,
        )
    )

    # 5 checklist
    story.append(P("5. Чек-лист подготовки Заказчика", "h1", S))
    checks = [
        "Карточка ЮЛ АО «ЦРЗ РТ» (ОГРН, ИНН, полное наименование)",
        "КЭП руководителя (действующий)",
        "Приказ о назначении ответственного за Технологический портал ЕСИА",
        "Краткое описание ИС Assessment (назначение, пользователи, ПДн, URL)",
        "Перечень НПА-оснований (формулировки — юрист Заказчика)",
        "Решение по СМЭВ: новая регистрация ИС или существующая мнемоника",
        "Сертификат ключа ЭП информационной системы",
        "Согласованный список scope",
        "Контакт для СЦ (ФИО, телефон, email)",
    ]
    for c in checks:
        story.append(P(f"☐  {c}", "body", S))
    story.append(
        P(
            "<b>Важно (требования 2025+):</b> для новых подключений действуют усиленные требования ИБ / OpenID Connect "
            "по актуальным Методическим рекомендациям Минцифры. Комплект нужно сверить до подачи заявки на пром.",
            "note",
            S,
        )
    )

    # 6 ready
    story.append(P("6. Что уже готово у Исполнителя", "h1", S))
    story.append(
        P(
            "В модуле Assessment уже предусмотрены: кнопка «Войти через Госуслуги» (неактивна до доступов); "
            "каркас API https://test.zakupki.tatar/api/esia.php; конфигурация через .env; сценарий после ключей: "
            "OIDC → создание/привязка пользователя → дозаполнение анкеты → согласия 152-ФЗ. "
            "До получения пакета из Письма № 6 полная интеграция не может быть включена в промышленную эксплуатацию.",
            "body",
            S,
        )
    )

    # 7 legal example
    story.append(P("7. Пример формулировки цели (для юриста Заказчика)", "h1", S))
    story.append(
        P(
            "«Подключение информационной системы „Модуль Assessment“ к ЕСИА осуществляется в целях идентификации "
            "и аутентификации физических лиц — участников процедур независимой оценки профессиональных знаний "
            "специалистов в сфере закупок, организуемых АО „Центр развития закупок Республики Татарстан“, "
            "с использованием единой системы идентификации и аутентификации в соответствии с законодательством РФ.»",
            "note",
            S,
        )
    )
    story.append(P("В заявке лучше ссылаться на конкретные пункты правовых актов (указывает юрист АО / куратор от РТ).", "body", S))

    # 8 risks
    story.append(P("8. Риски и как их снять", "h1", S))
    risks = [
        ["Заявка отклонена из‑за неполного комплекта", "Письмо № 0 в Минцифры РТ + сверка формы с актуальной версией Регламента"],
        ["Нет мнемоники СМЭВ", "Параллельно открыть трек регистрации ИС в СМЭВ"],
        ["Долго ждут КЭП на ИС", "Заказать сертификат ИС сразу после регистрации ЮЛ в ЕСИА"],
        ["Scope «раздуты»", "Согласовать минимум с Исполнителем до подачи"],
        ["Путаница тест/пром", "Сначала только тест; пром — отдельным письмом с номером тестовой заявки"],
    ]
    story.append(make_table(["Риск", "Как снизить"], risks, [55 * mm, W - 55 * mm], S))

    # 9 contacts
    story.append(P("9. Контакты (заполняет Заказчик)", "h1", S))
    contacts = [
        ["Руководитель АО «ЦРЗ РТ»", "", "", "", ""],
        ["Ответственный за Технологический портал ЕСИА", "", "", "", ""],
        ["Куратор Минцифры РТ", "", "", "", ""],
        ["Исполнитель (разработка Assessment)", "", "", "", ""],
        ["Тикет / № заявки СЦ (тест)", "", "sd@sc.digital.gov.ru", "", ""],
        ["Тикет / № заявки СЦ (пром)", "", "sd@sc.digital.gov.ru", "", ""],
    ]
    story.append(
        make_table(
            ["Сторона", "ФИО", "Email / адрес", "Телефон", "Примечание"],
            contacts,
            [48 * mm, 32 * mm, 42 * mm, 28 * mm, W - 150 * mm],
            S,
        )
    )

    # 10 summary
    story.append(P("10. Итог одной фразой", "h1", S))
    story.append(
        P(
            "<b>АО «ЦРЗ РТ» назначает ответственного, регистрирует организацию и ИС в ЕСИА "
            "(при необходимости — в СМЭВ), направляет заявки на тест и затем на пром на "
            "sd@sc.digital.gov.ru по формам Регламента; параллельно желательно запросить методическую "
            "поддержку Минцифры РТ; после ответа СЦ передаёт параметры Исполнителю для включения кнопки "
            "«Войти через Госуслуги» на test.zakupki.tatar.</b>",
            "body",
            S,
        )
    )
    story.append(Spacer(1, 8 * mm))
    story.append(
        P(
            "Документ подготовлен Исполнителем для организационной передачи Заказчику. "
            "Адреса, формы приложений и требования ИБ необходимо сверить с актуальной редакцией "
            "Регламента ЕСИА / Методических рекомендаций Минцифры России на дату подачи заявки.",
            "note",
            S,
        )
    )

    def on_page(canvas, doc_):
        canvas.saveState()
        canvas.setStrokeColor(GREEN)
        canvas.setLineWidth(0.8)
        canvas.line(16 * mm, A4[1] - 10 * mm, A4[0] - 16 * mm, A4[1] - 10 * mm)
        canvas.setFont("Arial", 8)
        canvas.setFillColor(MUTED)
        canvas.drawString(16 * mm, A4[1] - 8 * mm, "АО «ЦРЗ РТ» · План подключения Assessment к ЕСИА")
        canvas.drawRightString(A4[0] - 16 * mm, A4[1] - 8 * mm, "Конфиденциально · для Заказчика")
        canvas.line(16 * mm, 12 * mm, A4[0] - 16 * mm, 12 * mm)
        canvas.drawCentredString(A4[0] / 2, 7 * mm, f"Страница {doc_.page}")
        canvas.restoreState()

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"OK: {OUT}")


if __name__ == "__main__":
    build()
