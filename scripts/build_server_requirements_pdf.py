# -*- coding: utf-8 -*-
"""PDF: server requirements for Assessment (customer-facing)."""
from __future__ import annotations

import os
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "Документы" / "Требования_к_серверу_Assessment.pdf"
WIN = Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts"
pdfmetrics.registerFont(TTFont("Arial", str(WIN / "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(WIN / "arialbd.ttf")))

GREEN = colors.HexColor("#1f8a5b")
GREEN_LIGHT = colors.HexColor("#e8f5ee")
BORDER = colors.HexColor("#c9d3df")
HEADER = colors.HexColor("#1a3a4a")
MUTED = colors.HexColor("#4b5563")
ALT = colors.HexColor("#f7faf8")


def styles():
    return {
        "title": ParagraphStyle("t", fontName="Arial-Bold", fontSize=16, leading=20, alignment=TA_CENTER, textColor=HEADER, spaceAfter=4),
        "sub": ParagraphStyle("s", fontName="Arial", fontSize=9.5, leading=12, alignment=TA_CENTER, textColor=MUTED, spaceAfter=10),
        "h1": ParagraphStyle("h1", fontName="Arial-Bold", fontSize=11.5, leading=14, textColor=HEADER, spaceBefore=11, spaceAfter=6),
        "body": ParagraphStyle("b", fontName="Arial", fontSize=9, leading=12, alignment=TA_JUSTIFY, spaceAfter=5),
        "note": ParagraphStyle("n", fontName="Arial", fontSize=8.5, leading=11, textColor=MUTED, spaceAfter=6),
        "cell": ParagraphStyle("c", fontName="Arial", fontSize=8, leading=10.5),
        "cell_b": ParagraphStyle("cb", fontName="Arial-Bold", fontSize=8, leading=10.5, textColor=colors.white),
        "callout": ParagraphStyle("ca", fontName="Arial", fontSize=9, leading=12, alignment=TA_CENTER),
    }


def P(text, key, S):
    return Paragraph(text, S[key])


def tbl(headers, rows, widths, S):
    data = [[P(h, "cell_b", S) for h in headers]]
    for r in rows:
        data.append([P(c, "cell", S) for c in r])
    t = Table(data, colWidths=widths, repeatRows=1)
    cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), HEADER),
        ("GRID", (0, 0), (-1, -1), 0.35, BORDER),
        ("BOX", (0, 0), (-1, -1), 0.7, GREEN),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]
    for i in range(1, len(data)):
        if i % 2 == 0:
            cmds.append(("BACKGROUND", (0, i), (-1, i), ALT))
    t.setStyle(TableStyle(cmds))
    return t


def build():
    S = styles()
    doc = SimpleDocTemplate(
        str(OUT), pagesize=A4,
        leftMargin=14 * mm, rightMargin=14 * mm, topMargin=14 * mm, bottomMargin=14 * mm,
        title="Требования к серверу Assessment",
    )
    W = doc.width
    story = []

    story.append(P("ТРЕБОВАНИЯ К СЕРВЕРУ И ИНФРАСТРУКТУРЕ", "title", S))
    story.append(P("Модуль Assessment · test.zakupki.tatar · v1.0 · 07.08.2026", "sub", S))
    story.append(P(
        "Заказчик: АО «Центр развития закупок Республики Татарстан».<br/>"
        "Документ для выделения / закупки / настройки отдельного сервера модуля тестирования.",
        "body", S,
    ))

    story.append(P("1. Назначение", "h1", S))
    story.append(P(
        "Выделяется <b>отдельный</b> сервер под модуль Assessment. Контур <b>изолирован</b> от основного портала "
        "zakupki.tatar (своя ОС/ВМ, своя СУБД <b>PostgreSQL</b>). MySQL портала не используется и не модифицируется.",
        "body", S,
    ))
    story.append(tbl(
        ["Параметр", "Значение"],
        [
            ["Публичное имя", "test.zakupki.tatar"],
            ["СУБД модуля", "PostgreSQL 14+ (рекомендуется 15/16), БД asmt"],
            ["СУБД портала", "MySQL/MariaDB — без изменений"],
            ["ПДн / 152-ФЗ", "Размещение и доступы — по политике Заказчика"],
        ],
        [45 * mm, W - 45 * mm], S,
    ))

    story.append(P("2. Профили мощности", "h1", S))
    story.append(P("<b>2.1. Старт / приёмка</b> — выкат, функциональные испытания, пилотные кампании:", "body", S))
    story.append(tbl(
        ["Ресурс", "Минимум", "Рекомендуется"],
        [
            ["vCPU", "4", "8"],
            ["RAM", "8 ГБ", "16 ГБ"],
            ["Диск", "40 ГБ SSD", "60–80 ГБ SSD / NVMe"],
            ["Сеть", "100 Мбит/с", "1 Гбит/с"],
            ["ОС", "Ubuntu 22.04 / Debian 12 / аналог", "то же"],
        ],
        [40 * mm, (W - 40 * mm) / 2, (W - 40 * mm) / 2], S,
    ))
    story.append(Spacer(1, 3 * mm))
    story.append(P("<b>2.2. Пик до 5000 одновременных сессий</b> (ПСИ по ТЗ §5.1.3):", "body", S))
    story.append(tbl(
        ["Ресурс", "Минимум под пик", "Рекомендуется"],
        [
            ["vCPU", "16", "24–32"],
            ["RAM", "32 ГБ", "64 ГБ"],
            ["Диск", "100 ГБ NVMe", "150–200 ГБ; бэкапы — отдельно"],
            ["Сеть", "1 Гбит/с", "1–10 Гбит/с"],
            ["Дополнительно", "PgBouncer", "PgBouncer + опционально Redis для сессий PHP"],
        ],
        [40 * mm, (W - 40 * mm) / 2, (W - 40 * mm) / 2], S,
    ))
    story.append(P(
        "Допустимо начать с профиля «Старт» и апгрейдить к массовой кампании. "
        "Факт достижения 5000 сессий зависит от железа Заказчика и фиксируется в протоколе ПСИ.",
        "note", S,
    ))

    story.append(P("3. Программный стек (обязательно)", "h1", S))
    story.append(tbl(
        ["Компонент", "Требование"],
        [
            ["ОС", "Linux x86_64 (Ubuntu 22.04 LTS / Debian 12 / аналог RHEL 8+)"],
            ["Веб", "Nginx + PHP-FPM (предпочтительно)"],
            ["PHP", "8.1+ (рекомендуется 8.2/8.3)"],
            ["Расширения PHP", "pdo_pgsql, pgsql, mbstring, json, openssl, session; желательно opcache"],
            ["СУБД", "PostgreSQL 14+ (рекомендуется 15/16), UTF8"],
            ["Пул (для пика)", "PgBouncer, режим transaction"],
            ["SSL/TLS", "Сертификат на test.zakupki.tatar"],
            ["Почта", "Исходящий SMTP (см. §5)"],
        ],
        [42 * mm, W - 42 * mm], S,
    ))
    story.append(P("Не требуется: MySQL для модуля, Node.js, Java. Docker — по желанию Заказчика.", "note", S))

    story.append(P("4. Сеть, DNS, доступы", "h1", S))
    story.append(tbl(
        ["#", "Требование", "Кто"],
        [
            ["4.1", "A-запись test.zakupki.tatar → IP сервера", "Заказчик"],
            ["4.2", "Порты 80/443 открыты из Интернета", "Заказчик"],
            ["4.3", "PostgreSQL 5432 не публиковать наружу", "Заказчик"],
            ["4.4", "SSH Исполнителю (ключ, sudo по согласованию)", "Заказчик"],
            ["4.5", "HTTPS до приёмки (обмен ПДн)", "Заказчик + Исполнитель"],
            ["4.6", "Исходящий SMTP (25/465/587 — по политике)", "Заказчик"],
        ],
        [12 * mm, W - 42 * mm, 30 * mm], S,
    ))

    story.append(P("5. Почта (SMTP)", "h1", S))
    story.append(P(
        "Нужна для пароля при регистрации и Magic Link восстановления (24 ч). "
        "Передать: host, порт, логин/пароль или IP-allow, адрес From, желательно SPF/DKIM.",
        "body", S,
    ))

    story.append(P("6. Бэкапы и эксплуатация", "h1", S))
    story.append(tbl(
        ["#", "Требование"],
        [
            ["6.1", "Ежедневный pg_dump -Fc (или WAL-архив), отдельно от бэкапов MySQL портала"],
            ["6.2", "Срок хранения — по политике Заказчика (рекомендуется ≥ 14–30 суток)"],
            ["6.3", "Ротация логов Nginx/PHP; NTP (таймер теста 90 мин, Magic Link)"],
            ["6.4", "Мониторинг CPU/RAM/диск/HTTPS/соединения PG"],
        ],
        [14 * mm, W - 14 * mm], S,
    ))

    story.append(P("7. Безопасность инфраструктуры (минимум)", "h1", S))
    story.append(P(
        "SSH по ключам; запрет парольного root снаружи; патчинг ОС; права на .env только у служебной УЗ; "
        "резервирование секретов по процедуре ИБ. Прикладная защита (bcrypt, rate limit, валидация, аудит) — в коде модуля.",
        "body", S,
    ))

    story.append(P("8. Чек-лист передачи сервера Исполнителю", "h1", S))
    checks = [
        "IP / hostname, ОС установлена",
        "DNS test.zakupki.tatar → сервер",
        "SSH-доступ Исполнителю",
        "Возможность установить Nginx, PHP-FPM, PostgreSQL (или уже установлены)",
        "SSL выпущен или доступен Let’s Encrypt",
        "Реквизиты SMTP",
        "Подтверждение: PostgreSQL только под Assessment",
        "Реестр организаций (CSV/XLSX) для импорта ИНН",
        "Контакты админа ОС и ИБ на период выката",
    ]
    for c in checks:
        story.append(P(f"☐  {c}", "body", S))

    story.append(P("9. Целевые показатели (из ТЗ)", "h1", S))
    story.append(tbl(
        ["Условие", "Цель"],
        [
            ["Проводная сеть", "среднее время ответа API ≤ 0,5 с"],
            ["Сеть 4G", "среднее время ответа API ≤ 1,5 с"],
            ["Пик", "до 5000 одновременных активных пользователей (профиль §2.2)"],
        ],
        [55 * mm, W - 55 * mm], S,
    ))

    box = Table([[P(
        "<b>Спецификация для закупки VM (одной строкой)</b><br/><br/>"
        "Linux VM, <b>8 vCPU / 16 GB RAM / 60 GB SSD</b> (минимум 40 GB), Ubuntu 22.04, публичный IP, "
        "DNS test.zakupki.tatar, HTTPS, исходящий SMTP; Nginx + PHP 8.2-FPM + PostgreSQL 16. "
        "Данные в основном текстовые — сотни GB не нужны; бэкапы лучше вне системного диска.<br/>"
        "Для пика ~5000: <b>16–32 vCPU / 32–64 GB RAM</b> + PgBouncer; диск при необходимости 100+ GB.",
        "callout", S,
    )]], colWidths=[W])
    box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GREEN_LIGHT),
        ("BOX", (0, 0), (-1, -1), 1.2, GREEN),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(Spacer(1, 4 * mm))
    story.append(box)

    story.append(Spacer(1, 6 * mm))
    story.append(P(
        "Документ подготовлен Исполнителем для передачи Заказчику. "
        "Модели железа и политики ЦОД уточняются при сохранении минимумов и изоляции контура Assessment.",
        "note", S,
    ))

    def on_page(canvas, doc_):
        canvas.saveState()
        canvas.setStrokeColor(GREEN)
        canvas.setLineWidth(0.7)
        canvas.line(14 * mm, A4[1] - 9 * mm, A4[0] - 14 * mm, A4[1] - 9 * mm)
        canvas.setFont("Arial", 8)
        canvas.setFillColor(MUTED)
        canvas.drawString(14 * mm, A4[1] - 7 * mm, "АО «ЦРЗ РТ» · Требования к серверу Assessment")
        canvas.drawRightString(A4[0] - 14 * mm, A4[1] - 7 * mm, "для Заказчика")
        canvas.line(14 * mm, 11 * mm, A4[0] - 14 * mm, 11 * mm)
        canvas.drawCentredString(A4[0] / 2, 6 * mm, f"стр. {doc_.page}")
        canvas.restoreState()

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"OK: {OUT}")


if __name__ == "__main__":
    build()
