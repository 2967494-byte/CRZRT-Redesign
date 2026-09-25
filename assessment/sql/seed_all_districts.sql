-- =====================================================================
-- SEED ALL MUNICIPAL DISTRICTS AND URBAN OKRUGS (89 REGIONS OF RUSSIA)
-- Recommended method for PHP environments: php scripts/seed_all_districts.php
-- This SQL script safely resolves region_id by matching asmt_regions.code.
-- It does NOT hardcode serial IDs or region_id numbers, preventing collisions.
-- =====================================================================

BEGIN;

-- 1. Ensure schema and indexes
ALTER TABLE asmt_districts ADD COLUMN IF NOT EXISTS region_id BIGINT NULL REFERENCES asmt_regions(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS asmt_districts_region_idx ON asmt_districts (region_id);
CREATE UNIQUE INDEX IF NOT EXISTS asmt_districts_region_name_uidx ON asmt_districts (region_id, name) WHERE region_id IS NOT NULL;

-- 2. Link legacy Tatarstan records (IDs 1-10) to region code 16 if unassigned
UPDATE asmt_districts SET region_id = (SELECT id FROM asmt_regions WHERE code = '16' LIMIT 1) WHERE id <= 10 AND region_id IS NULL;

-- 3. Seed districts for each region by code
-- Region 01: Республика Адыгея
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Адыгейск', TRUE, 10),
  ('город Майкоп', TRUE, 20),
  ('Гиагинский район', FALSE, 30),
  ('Кошехабльский район', FALSE, 40),
  ('Красногвардейский район', FALSE, 50),
  ('Майкопский район', FALSE, 60),
  ('Тахтамукайский район', FALSE, 70),
  ('Теучежский район', FALSE, 80),
  ('Шовгеновский район', FALSE, 90),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '01'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 02: Республика Башкортостан
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Агидель', TRUE, 10),
  ('город Кумертау', TRUE, 20),
  ('город Межгорье (ЗАТО)', TRUE, 30),
  ('город Нефтекамск', TRUE, 40),
  ('город Октябрьский', TRUE, 50),
  ('город Салават', TRUE, 60),
  ('город Сибай', TRUE, 70),
  ('город Стерлитамак', TRUE, 80),
  ('город Уфа', TRUE, 90),
  ('Абзелиловский район', FALSE, 100),
  ('Альшеевский район', FALSE, 110),
  ('Архангельский район', FALSE, 120),
  ('Аскинский район', FALSE, 130),
  ('Аургазинский район', FALSE, 140),
  ('Баймакский район', FALSE, 150),
  ('Бакалинский район', FALSE, 160),
  ('Балтачевский район', FALSE, 170),
  ('Белебеевский район', FALSE, 180),
  ('Белокатайский район', FALSE, 190),
  ('Белорецкий район', FALSE, 200),
  ('Бижбулякский район', FALSE, 210),
  ('Бирский район', FALSE, 220),
  ('Благоварский район', FALSE, 230),
  ('Благовещенский район', FALSE, 240),
  ('Буздякский район', FALSE, 250),
  ('Бураевский район', FALSE, 260),
  ('Бурзянский район', FALSE, 270),
  ('Гафурийский район', FALSE, 280),
  ('Давлекановский район', FALSE, 290),
  ('Дуванский район', FALSE, 300),
  ('Дюртюлинский район', FALSE, 310),
  ('Ермекеевский район', FALSE, 320),
  ('Зианчуринский район', FALSE, 330),
  ('Зилаирский район', FALSE, 340),
  ('Иглинский район', FALSE, 350),
  ('Илишевский район', FALSE, 360),
  ('Ишимбайский район', FALSE, 370),
  ('Калтасинский район', FALSE, 380),
  ('Караидельский район', FALSE, 390),
  ('Кармаскалинский район', FALSE, 400),
  ('Кигинский район', FALSE, 410),
  ('Краснокамский район', FALSE, 420),
  ('Кугарчинский район', FALSE, 430),
  ('Кушнаренковский район', FALSE, 440),
  ('Куюргазинский район', FALSE, 450),
  ('Мелеузовский район', FALSE, 460),
  ('Мечетлинский район', FALSE, 470),
  ('Мишкинский район', FALSE, 480),
  ('Миякинский район', FALSE, 490),
  ('Нуримановский район', FALSE, 500),
  ('Салаватский район', FALSE, 510),
  ('Стерлибашевский район', FALSE, 520),
  ('Стерлитамакский район', FALSE, 530),
  ('Татышлинский район', FALSE, 540),
  ('Туймазинский район', FALSE, 550),
  ('Уфимский район', FALSE, 560),
  ('Учалинский район', FALSE, 570),
  ('Фёдоровский район', FALSE, 580),
  ('Хайбуллинский район', FALSE, 590),
  ('Чекмагушевский район', FALSE, 600),
  ('Чишминский район', FALSE, 610),
  ('Шаранский район', FALSE, 620),
  ('Янаульский район', FALSE, 630),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '02'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 03: Республика Бурятия
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Северобайкальск', TRUE, 10),
  ('город Улан-Удэ', TRUE, 20),
  ('Баргузинский район', FALSE, 30),
  ('Баунтовский эвенкийский район', FALSE, 40),
  ('Бичурский район', FALSE, 50),
  ('Джидинский район', FALSE, 60),
  ('Еравнинский район', FALSE, 70),
  ('Заиграевский район', FALSE, 80),
  ('Закаменский район', FALSE, 90),
  ('Иволгинский район', FALSE, 100),
  ('Кабанский район', FALSE, 110),
  ('Кижингинский район', FALSE, 120),
  ('Курумканский район', FALSE, 130),
  ('Кяхтинский район', FALSE, 140),
  ('Муйский район', FALSE, 150),
  ('Мухоршибирский район', FALSE, 160),
  ('Окинский район', FALSE, 170),
  ('Прибайкальский район', FALSE, 180),
  ('Северо-Байкальский район', FALSE, 190),
  ('Селенгинский район', FALSE, 200),
  ('Тарбагатайский район', FALSE, 210),
  ('Тункинский район', FALSE, 220),
  ('Хоринский район', FALSE, 230),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '03'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 04: Республика Алтай
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Горно-Алтайск', TRUE, 10),
  ('Кош-Агачский район', FALSE, 20),
  ('Майминский район', FALSE, 30),
  ('Онгудайский район', FALSE, 40),
  ('Турочакский район', FALSE, 50),
  ('Улаганский район', FALSE, 60),
  ('Усть-Канский район', FALSE, 70),
  ('Усть-Коксинский район', FALSE, 80),
  ('Чемальский район', FALSE, 90),
  ('Чойский район', FALSE, 100),
  ('Шебалинский район', FALSE, 110),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '04'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 05: Республика Дагестан
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Буйнакск', TRUE, 10),
  ('город Дагестанские Огни', TRUE, 20),
  ('город Дербент', TRUE, 30),
  ('город Избербаш', TRUE, 40),
  ('город Каспийск', TRUE, 50),
  ('город Кизилюрт', TRUE, 60),
  ('город Кизляр', TRUE, 70),
  ('город Махачкала', TRUE, 80),
  ('город Хасавюрт', TRUE, 90),
  ('город Южно-Сухокумск', TRUE, 100),
  ('Агульский район', FALSE, 110),
  ('Акушинский район', FALSE, 120),
  ('Ахвахский район', FALSE, 130),
  ('Ахтынский район', FALSE, 140),
  ('Бабаюртовский район', FALSE, 150),
  ('Ботлихский район', FALSE, 160),
  ('Буйнакский район', FALSE, 170),
  ('Гергебильский район', FALSE, 180),
  ('Гумбетовский район', FALSE, 190),
  ('Гунибский район', FALSE, 200),
  ('Дахадаевский район', FALSE, 210),
  ('Дербентский район', FALSE, 220),
  ('Докузпаринский район', FALSE, 230),
  ('Казбековский район', FALSE, 240),
  ('Кайтагский район', FALSE, 250),
  ('Карабудахкентский район', FALSE, 260),
  ('Каякентский район', FALSE, 270),
  ('Кизилюртовский район', FALSE, 280),
  ('Кизлярский район', FALSE, 290),
  ('Кулинский район', FALSE, 300),
  ('Кумторкалинский район', FALSE, 310),
  ('Курахский район', FALSE, 320),
  ('Лакский район', FALSE, 330),
  ('Левашинский район', FALSE, 340),
  ('Магарамкентский район', FALSE, 350),
  ('Новолакский район', FALSE, 360),
  ('Ногайский район', FALSE, 370),
  ('Рутульский район', FALSE, 380),
  ('Сергокалинский район', FALSE, 390),
  ('Сулейман-Стальский район', FALSE, 400),
  ('Табасаранский район', FALSE, 410),
  ('Тарумовский район', FALSE, 420),
  ('Тляратинский район', FALSE, 430),
  ('Унцукульский район', FALSE, 440),
  ('Хасавюртовский район', FALSE, 450),
  ('Хивский район', FALSE, 460),
  ('Хунзахский район', FALSE, 470),
  ('Цумадинский район', FALSE, 480),
  ('Цунтинский район', FALSE, 490),
  ('Чародинский район', FALSE, 500),
  ('Шамильский район', FALSE, 510),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '05'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 06: Республика Ингушетия
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Карабулак', TRUE, 10),
  ('город Магас', TRUE, 20),
  ('город Малгобек', TRUE, 30),
  ('город Назрань', TRUE, 40),
  ('город Сунжа', TRUE, 50),
  ('Джейрахский район', FALSE, 60),
  ('Малгобекский район', FALSE, 70),
  ('Назрановский район', FALSE, 80),
  ('Сунженский район', FALSE, 90),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '06'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 07: Кабардино-Балкарская Республика
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Баксан', TRUE, 10),
  ('город Нальчик', TRUE, 20),
  ('город Прохладный', TRUE, 30),
  ('Баксанский район', FALSE, 40),
  ('Зольский район', FALSE, 50),
  ('Лескенский район', FALSE, 60),
  ('Майский район', FALSE, 70),
  ('Прохладненский район', FALSE, 80),
  ('Терский район', FALSE, 90),
  ('Урванский район', FALSE, 100),
  ('Чегемский район', FALSE, 110),
  ('Черекский район', FALSE, 120),
  ('Эльбрусский район', FALSE, 130),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '07'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 08: Республика Калмыкия
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('Городовиковский район', FALSE, 10),
  ('Ики-Бурульский район', FALSE, 20),
  ('Кетченеровский район', FALSE, 30),
  ('Лаганский район', FALSE, 40),
  ('Малодербетовский район', FALSE, 50),
  ('Октябрьский район', FALSE, 60),
  ('Приютненский район', FALSE, 70),
  ('Сарпинский район', FALSE, 80),
  ('Целинный район', FALSE, 90),
  ('Черноземельский район', FALSE, 100),
  ('Элистинский городской округ', FALSE, 110),
  ('Юстинский район', FALSE, 120),
  ('Яшалтинский район', FALSE, 130),
  ('Яшкульский район', FALSE, 140),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '08'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 09: Карачаево-Черкесская Республика
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('Абазинский район', FALSE, 10),
  ('Адыге-Хабльский район', FALSE, 20),
  ('Зеленчукский район', FALSE, 30),
  ('Карачаевский городской округ', FALSE, 40),
  ('Карачаевский район', FALSE, 50),
  ('Малокарачаевский район', FALSE, 60),
  ('Ногайский район', FALSE, 70),
  ('Прикубанский район', FALSE, 80),
  ('Урупский район', FALSE, 90),
  ('Усть-Джегутинский район', FALSE, 100),
  ('Хабезский район', FALSE, 110),
  ('Черкесский городской округ', FALSE, 120),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '09'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 10: Республика Карелия
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('Беломорский район', FALSE, 10),
  ('Калевальский район', FALSE, 20),
  ('Кемский район', FALSE, 30),
  ('Кондопожский район', FALSE, 40),
  ('Костомукшский городской округ', FALSE, 50),
  ('Лахденпохский район', FALSE, 60),
  ('Лоухский район', FALSE, 70),
  ('Медвежьегорский район', FALSE, 80),
  ('Муезерский район', FALSE, 90),
  ('Олонецкий район', FALSE, 100),
  ('Петрозаводский городской округ', FALSE, 110),
  ('Питкярантский район', FALSE, 120),
  ('Прионежский район', FALSE, 130),
  ('Пряжинский район', FALSE, 140),
  ('Пудожский район', FALSE, 150),
  ('Сегежский район', FALSE, 160),
  ('Сортавальский район', FALSE, 170),
  ('Суоярвский район', FALSE, 180),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '10'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 11: Республика Коми
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Воркута', TRUE, 10),
  ('город Вуктыл', TRUE, 20),
  ('город Инта', TRUE, 30),
  ('город Сыктывкар', TRUE, 40),
  ('город Усинск', TRUE, 50),
  ('город Ухта', TRUE, 60),
  ('Ижемский район', FALSE, 70),
  ('Княжпогостский район', FALSE, 80),
  ('Койгородский район', FALSE, 90),
  ('Корткеросский район', FALSE, 100),
  ('Печора район', FALSE, 110),
  ('Прилузский район', FALSE, 120),
  ('Сосногорск район', FALSE, 130),
  ('Сыктывдинский район', FALSE, 140),
  ('Сысольский район', FALSE, 150),
  ('Троицко-Печорский район', FALSE, 160),
  ('Удорский район', FALSE, 170),
  ('Усть-Вымский район', FALSE, 180),
  ('Усть-Куломский район', FALSE, 190),
  ('Усть-Цилемский район', FALSE, 200),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '11'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 12: Республика Марий Эл
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Волжск', TRUE, 10),
  ('город Йошкар-Ола', TRUE, 20),
  ('город Козьмодемьянск', TRUE, 30),
  ('Волжский район', FALSE, 40),
  ('Горномарийский район', FALSE, 50),
  ('Звениговский район', FALSE, 60),
  ('Килемарский район', FALSE, 70),
  ('Куженерский район', FALSE, 80),
  ('Мари-Турекский район', FALSE, 90),
  ('Медведевский район', FALSE, 100),
  ('Моркинский район', FALSE, 110),
  ('Новоторъяльский район', FALSE, 120),
  ('Оршанский район', FALSE, 130),
  ('Параньгинский район', FALSE, 140),
  ('Сернурский район', FALSE, 150),
  ('Советский район', FALSE, 160),
  ('Юринский район', FALSE, 170),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '12'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 13: Республика Мордовия
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Саранск', TRUE, 10),
  ('Ардатовский район', FALSE, 20),
  ('Атюрьевский район', FALSE, 30),
  ('Атяшевский район', FALSE, 40),
  ('Большеберезниковский район', FALSE, 50),
  ('Большеигнатовский район', FALSE, 60),
  ('Дубёнский район', FALSE, 70),
  ('Ельниковский район', FALSE, 80),
  ('Зубово-Полянский район', FALSE, 90),
  ('Инсарский район', FALSE, 100),
  ('Ичалковский район', FALSE, 110),
  ('Кадошкинский район', FALSE, 120),
  ('Ковылкинский район', FALSE, 130),
  ('Кочкуровский район', FALSE, 140),
  ('Краснослободский район', FALSE, 150),
  ('Лямбирский район', FALSE, 160),
  ('Ромодановский район', FALSE, 170),
  ('Рузаевский район', FALSE, 180),
  ('Старошайговский район', FALSE, 190),
  ('Темниковский район', FALSE, 200),
  ('Теньгушевский район', FALSE, 210),
  ('Торбеевский район', FALSE, 220),
  ('Чамзинский район', FALSE, 230),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '13'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 14: Республика Саха (Якутия)
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('Александровск-Сахалинский район', TRUE, 10),
  ('город Жатай', TRUE, 20),
  ('город Южно-Сахалинск', TRUE, 30),
  ('город Якутск', TRUE, 40),
  ('Абыйский район', FALSE, 50),
  ('Алданский район', FALSE, 60),
  ('Аллаиховский район', FALSE, 70),
  ('Амгинский район', FALSE, 80),
  ('Анабарский нац. долгано-эвенкийский район', FALSE, 90),
  ('Анивский городской округ', FALSE, 100),
  ('Булунский район', FALSE, 110),
  ('Верхневилюйский район', FALSE, 120),
  ('Верхнеколымский район', FALSE, 130),
  ('Верхоянский район', FALSE, 140),
  ('Вилюйский район', FALSE, 150),
  ('Горный район', FALSE, 160),
  ('Долинский городской округ', FALSE, 170),
  ('Жиганский нац. эвенкийский район', FALSE, 180),
  ('Кобяйский район', FALSE, 190),
  ('Корсаковский городской округ', FALSE, 200),
  ('Курильский городской округ', FALSE, 210),
  ('Ленский район', FALSE, 220),
  ('Макаровский городской округ', FALSE, 230),
  ('Мегино-Кангаласский район', FALSE, 240),
  ('Мирнинский район', FALSE, 250),
  ('Момский (нац.) район', FALSE, 260),
  ('Намский район', FALSE, 270),
  ('Невельский городской округ', FALSE, 280),
  ('Нерюнгринский район', FALSE, 290),
  ('Нижнеколымский район', FALSE, 300),
  ('Ногликский городской округ', FALSE, 310),
  ('Нюрбинский район', FALSE, 320),
  ('Оймяконский район', FALSE, 330),
  ('Оленёкский эвенкийский нац. район', FALSE, 340),
  ('Олёкминский район', FALSE, 350),
  ('Охинский городской округ', FALSE, 360),
  ('Поронайский городской округ', FALSE, 370),
  ('Северо-Курильский городской округ', FALSE, 380),
  ('Смирныховский городской округ', FALSE, 390),
  ('Среднеколымский район', FALSE, 400),
  ('Сунтарский район', FALSE, 410),
  ('Таттинский район', FALSE, 420),
  ('Томаринский городской округ', FALSE, 430),
  ('Томпонский район', FALSE, 440),
  ('Тымовский городской округ', FALSE, 450),
  ('Углегорский городской округ', FALSE, 460),
  ('Усть-Алданский район', FALSE, 470),
  ('Усть-Майский район', FALSE, 480),
  ('Усть-Янский район', FALSE, 490),
  ('Хангаласский район', FALSE, 500),
  ('Холмский городской округ', FALSE, 510),
  ('Чурапчинский район', FALSE, 520),
  ('Эвено-Бытантайский нац. район', FALSE, 530),
  ('Южно-Курильский городской округ', FALSE, 540),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '14'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 15: Республика Северная Осетия — Алания
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Владикавказ (Дзауджикау)', TRUE, 10),
  ('Алагирский район', FALSE, 20),
  ('Ардонский район', FALSE, 30),
  ('Дигорский район', FALSE, 40),
  ('Ирафский район', FALSE, 50),
  ('Кировский район', FALSE, 60),
  ('Моздокский район', FALSE, 70),
  ('Правобережный район', FALSE, 80),
  ('Пригородный район', FALSE, 90),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '15'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 16: Республика Татарстан
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Казань', TRUE, 10),
  ('город Набережные Челны', TRUE, 20),
  ('Агрызский район', FALSE, 30),
  ('Азнакаевский район', FALSE, 40),
  ('Аксубаевский район', FALSE, 50),
  ('Актанышский район', FALSE, 60),
  ('Алексеевский район', FALSE, 70),
  ('Алькеевский район', FALSE, 80),
  ('Альметьевский район', FALSE, 90),
  ('Апастовский район', FALSE, 100),
  ('Арский район', FALSE, 110),
  ('Атнинский район', FALSE, 120),
  ('Бавлинский район', FALSE, 130),
  ('Балтасинский район', FALSE, 140),
  ('Бугульминский район', FALSE, 150),
  ('Буинский район', FALSE, 160),
  ('Верхнеуслонский район', FALSE, 170),
  ('Высокогорский район', FALSE, 180),
  ('Дрожжановский район', FALSE, 190),
  ('Елабужский район', FALSE, 200),
  ('Заинский район', FALSE, 210),
  ('Зеленодольский район', FALSE, 220),
  ('Кайбицкий район', FALSE, 230),
  ('Камско-Устьинский район', FALSE, 240),
  ('Кукморский район', FALSE, 250),
  ('Лаишевский район', FALSE, 260),
  ('Лениногорский район', FALSE, 270),
  ('Мамадышский район', FALSE, 280),
  ('Менделеевский район', FALSE, 290),
  ('Мензелинский район', FALSE, 300),
  ('Муслюмовский район', FALSE, 310),
  ('Нижнекамский район', FALSE, 320),
  ('Новошешминский район', FALSE, 330),
  ('Нурлатский район', FALSE, 340),
  ('Пестречинский район', FALSE, 350),
  ('Рыбно-Слободский район', FALSE, 360),
  ('Сабинский район', FALSE, 370),
  ('Сармановский район', FALSE, 380),
  ('Спасский район', FALSE, 390),
  ('Тетюшский район', FALSE, 400),
  ('Тукаевский район', FALSE, 410),
  ('Тюлячинский район', FALSE, 420),
  ('Черемшанский район', FALSE, 430),
  ('Чистопольский район', FALSE, 440),
  ('Ютазинский район', FALSE, 450),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '16'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 17: Республика Тыва
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Ак-Довурак', TRUE, 10),
  ('город Кызыл', TRUE, 20),
  ('Бай-Тайгинский район', FALSE, 30),
  ('Барун-Хемчикский район', FALSE, 40),
  ('Дзун-Хемчикский район', FALSE, 50),
  ('Каа-Хемский район', FALSE, 60),
  ('Кызылский район', FALSE, 70),
  ('Монгун-Тайгинский район', FALSE, 80),
  ('Овюрский район', FALSE, 90),
  ('Пий-Хемский район', FALSE, 100),
  ('Сут-Хольский район', FALSE, 110),
  ('Тандинский район', FALSE, 120),
  ('Тере-Хольский район', FALSE, 130),
  ('Тес-Хемский район', FALSE, 140),
  ('Тоджинский район', FALSE, 150),
  ('Улуг-Хемский район', FALSE, 160),
  ('Чаа-Хольский район', FALSE, 170),
  ('Чеди-Хольский район', FALSE, 180),
  ('Эрзинский район', FALSE, 190),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '17'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 18: Удмуртская Республика
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Воткинск', TRUE, 10),
  ('город Глазов', TRUE, 20),
  ('город Ижевск', TRUE, 30),
  ('город Можга', TRUE, 40),
  ('город Сарапул', TRUE, 50),
  ('Алнашский район', FALSE, 60),
  ('Балезинский район', FALSE, 70),
  ('Вавожский район', FALSE, 80),
  ('Воткинский район', FALSE, 90),
  ('Глазовский район', FALSE, 100),
  ('Граховский район', FALSE, 110),
  ('Дебёсский район', FALSE, 120),
  ('Завьяловский район', FALSE, 130),
  ('Игринский район', FALSE, 140),
  ('Камбарский район', FALSE, 150),
  ('Каракулинский район', FALSE, 160),
  ('Кезский район', FALSE, 170),
  ('Кизнерский район', FALSE, 180),
  ('Киясовский район', FALSE, 190),
  ('Красногорский район', FALSE, 200),
  ('Малопургинский район', FALSE, 210),
  ('Можгинский район', FALSE, 220),
  ('Сарапульский район', FALSE, 230),
  ('Селтинский район', FALSE, 240),
  ('Сюмсинский район', FALSE, 250),
  ('Увинский район', FALSE, 260),
  ('Шарканский район', FALSE, 270),
  ('Юкаменский район', FALSE, 280),
  ('Якшур-Бодьинский район', FALSE, 290),
  ('Ярский район', FALSE, 300),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '18'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 19: Республика Хакасия
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Абаза', TRUE, 10),
  ('город Абакан', TRUE, 20),
  ('город Саяногорск', TRUE, 30),
  ('город Сорск', TRUE, 40),
  ('город Черногорск', TRUE, 50),
  ('Алтайский район', FALSE, 60),
  ('Аскизский район', FALSE, 70),
  ('Бейский район', FALSE, 80),
  ('Боградский район', FALSE, 90),
  ('Орджоникидзевский район', FALSE, 100),
  ('Таштыпский район', FALSE, 110),
  ('Усть-Абаканский район', FALSE, 120),
  ('Ширинский район', FALSE, 130),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '19'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 20: Чеченская Республика
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Аргун', TRUE, 10),
  ('город Грозный', TRUE, 20),
  ('Ачхой-Мартановский район', FALSE, 30),
  ('Веденский район', FALSE, 40),
  ('Грозненский район', FALSE, 50),
  ('Гудермесский район', FALSE, 60),
  ('Итум-Калинский район', FALSE, 70),
  ('Курчалоевский район', FALSE, 80),
  ('Надтеречный район', FALSE, 90),
  ('Наурский район', FALSE, 100),
  ('Ножай-Юртовский район', FALSE, 110),
  ('Серноводский район', FALSE, 120),
  ('Урус-Мартановский район', FALSE, 130),
  ('Шалинский район', FALSE, 140),
  ('Шаройский район', FALSE, 150),
  ('Шатойский район', FALSE, 160),
  ('Шелковской район', FALSE, 170),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '20'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 21: Чувашская Республика
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Алатырь', TRUE, 10),
  ('город Канаш', TRUE, 20),
  ('город Шумерля', TRUE, 30),
  ('Алатырский район', FALSE, 40),
  ('Аликовский район', FALSE, 50),
  ('Батыревский район', FALSE, 60),
  ('Вурнарский район', FALSE, 70),
  ('Ибресинский район', FALSE, 80),
  ('Канашский район', FALSE, 90),
  ('Козловский район', FALSE, 100),
  ('Комсомольский район', FALSE, 110),
  ('Красноармейский район', FALSE, 120),
  ('Красночетайский район', FALSE, 130),
  ('Мариинско-Посадский район', FALSE, 140),
  ('Моргаушский район', FALSE, 150),
  ('Новочебоксарский городской округ', FALSE, 160),
  ('Порецкий район', FALSE, 170),
  ('Урмарский район', FALSE, 180),
  ('Цивильский район', FALSE, 190),
  ('Чебоксарский городской округ', FALSE, 200),
  ('Чебоксарский район', FALSE, 210),
  ('Шемуршинский район', FALSE, 220),
  ('Шумерлинский район', FALSE, 230),
  ('Ядринский район', FALSE, 240),
  ('Яльчикский район', FALSE, 250),
  ('Янтиковский район', FALSE, 260),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '21'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 22: Алтайский край
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Алейск', TRUE, 10),
  ('город Барнаул', TRUE, 20),
  ('город Белокуриха', TRUE, 30),
  ('город Бийск', TRUE, 40),
  ('город Заринск', TRUE, 50),
  ('город Новоалтайск', TRUE, 60),
  ('город Рубцовск', TRUE, 70),
  ('город Сибирский (ЗАТО)', TRUE, 80),
  ('город Славгород', TRUE, 90),
  ('город Яровое', TRUE, 100),
  ('Алейский район', FALSE, 110),
  ('Алтайский район', FALSE, 120),
  ('Баевский район', FALSE, 130),
  ('Бийский район', FALSE, 140),
  ('Благовещенский район', FALSE, 150),
  ('Бурлинский район', FALSE, 160),
  ('Быстроистокский район', FALSE, 170),
  ('Волчихинский район', FALSE, 180),
  ('Егорьевский район', FALSE, 190),
  ('Ельцовский район', FALSE, 200),
  ('Завьяловский район', FALSE, 210),
  ('Залесовский район', FALSE, 220),
  ('Заринский район', FALSE, 230),
  ('Змеиногорский район', FALSE, 240),
  ('Зональный район', FALSE, 250),
  ('Калманский район', FALSE, 260),
  ('Каменский район', FALSE, 270),
  ('Ключевский район', FALSE, 280),
  ('Косихинский район', FALSE, 290),
  ('Красногорский район', FALSE, 300),
  ('Краснощёковский район', FALSE, 310),
  ('Крутихинский район', FALSE, 320),
  ('Кулундинский район', FALSE, 330),
  ('Курьинский район', FALSE, 340),
  ('Кытмановский район', FALSE, 350),
  ('Локтевский район', FALSE, 360),
  ('Мамонтовский район', FALSE, 370),
  ('Михайловский район', FALSE, 380),
  ('Немецкий нац. район', FALSE, 390),
  ('Новичихинский район', FALSE, 400),
  ('Павловский район', FALSE, 410),
  ('Панкрушихинский район', FALSE, 420),
  ('Первомайский район', FALSE, 430),
  ('Петропавловский район', FALSE, 440),
  ('Поспелихинский район', FALSE, 450),
  ('Ребрихинский район', FALSE, 460),
  ('Родинский район', FALSE, 470),
  ('Романовский район', FALSE, 480),
  ('Рубцовский район', FALSE, 490),
  ('Смоленский район', FALSE, 500),
  ('Советский район', FALSE, 510),
  ('Солонешенский район', FALSE, 520),
  ('Солтонский район', FALSE, 530),
  ('Суетский район', FALSE, 540),
  ('Табунский район', FALSE, 550),
  ('Тальменский район', FALSE, 560),
  ('Тогульский район', FALSE, 570),
  ('Топчихинский район', FALSE, 580),
  ('Третьяковский район', FALSE, 590),
  ('Троицкий район', FALSE, 600),
  ('Тюменцевский район', FALSE, 610),
  ('Угловский район', FALSE, 620),
  ('Усть-Калманский район', FALSE, 630),
  ('Усть-Пристанский район', FALSE, 640),
  ('Хабарский район', FALSE, 650),
  ('Целинный район', FALSE, 660),
  ('Чарышский район', FALSE, 670),
  ('Шелаболихинский район', FALSE, 680),
  ('Шипуновский район', FALSE, 690),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '22'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 23: Краснодарский край
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Армавир', TRUE, 10),
  ('город Геленджик, город-курорт', TRUE, 20),
  ('город Горячий Ключ', TRUE, 30),
  ('город Краснодар', TRUE, 40),
  ('город Новороссийск', TRUE, 50),
  ('город Сириус (ФТ)', TRUE, 60),
  ('город Сочи, город-курорт', TRUE, 70),
  ('Абинский район', FALSE, 80),
  ('Анапа муниципальный округ', FALSE, 90),
  ('Апшеронский район', FALSE, 100),
  ('Белоглинский район', FALSE, 110),
  ('Белореченский район', FALSE, 120),
  ('Брюховецкий район', FALSE, 130),
  ('Выселковский район', FALSE, 140),
  ('Гулькевичский район', FALSE, 150),
  ('Динской район', FALSE, 160),
  ('Ейский район', FALSE, 170),
  ('Кавказский район', FALSE, 180),
  ('Калининский район', FALSE, 190),
  ('Каневской район', FALSE, 200),
  ('Кореновский район', FALSE, 210),
  ('Красноармейский район', FALSE, 220),
  ('Крыловский район', FALSE, 230),
  ('Крымский район', FALSE, 240),
  ('Курганинский район', FALSE, 250),
  ('Кущёвский район', FALSE, 260),
  ('Лабинский район', FALSE, 270),
  ('Ленинградский район', FALSE, 280),
  ('Мостовский район', FALSE, 290),
  ('Новокубанский район', FALSE, 300),
  ('Новопокровский район', FALSE, 310),
  ('Отрадненский район', FALSE, 320),
  ('Павловский район', FALSE, 330),
  ('Приморско-Ахтарский район', FALSE, 340),
  ('Северский район', FALSE, 350),
  ('Славянский район', FALSE, 360),
  ('Староминский район', FALSE, 370),
  ('Тбилисский район', FALSE, 380),
  ('Темрюкский район', FALSE, 390),
  ('Тимашёвский район', FALSE, 400),
  ('Тихорецкий район', FALSE, 410),
  ('Туапсинский район', FALSE, 420),
  ('Успенский район', FALSE, 430),
  ('Усть-Лабинский район', FALSE, 440),
  ('Щербиновский район', FALSE, 450),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '23'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 24: Красноярский край
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Ачинск', TRUE, 10),
  ('город Боготол', TRUE, 20),
  ('город Бородино', TRUE, 30),
  ('город Дивногорск', TRUE, 40),
  ('город Енисейск', TRUE, 50),
  ('город Железногорск (ЗАТО)', TRUE, 60),
  ('город Зеленогорск (ЗАТО)', TRUE, 70),
  ('город Канск', TRUE, 80),
  ('город Кедровый, посёлок', TRUE, 90),
  ('город Красноярск', TRUE, 100),
  ('город Лесосибирск', TRUE, 110),
  ('город Минусинск', TRUE, 120),
  ('город Назарово', TRUE, 130),
  ('город Норильск', TRUE, 140),
  ('город Солнечный (ЗАТО, посёлок)', TRUE, 150),
  ('город Сосновоборск', TRUE, 160),
  ('город Шарыпово', TRUE, 170),
  ('Абанский район', FALSE, 180),
  ('Ачинский район', FALSE, 190),
  ('Балахтинский район', FALSE, 200),
  ('Берёзовский район', FALSE, 210),
  ('Бирилюсский район', FALSE, 220),
  ('Боготольский район', FALSE, 230),
  ('Богучанский район', FALSE, 240),
  ('Большемуртинский район', FALSE, 250),
  ('Большеулуйский район', FALSE, 260),
  ('Дзержинский район', FALSE, 270),
  ('Емельяновский район', FALSE, 280),
  ('Енисейский район', FALSE, 290),
  ('Ермаковский район', FALSE, 300),
  ('Идринский район', FALSE, 310),
  ('Иланский район', FALSE, 320),
  ('Ирбейский район', FALSE, 330),
  ('Казачинский район', FALSE, 340),
  ('Канский район', FALSE, 350),
  ('Каратузский район', FALSE, 360),
  ('Кежемский район', FALSE, 370),
  ('Козульский район', FALSE, 380),
  ('Краснотуранский район', FALSE, 390),
  ('Курагинский район', FALSE, 400),
  ('Манский район', FALSE, 410),
  ('Минусинский район', FALSE, 420),
  ('Мотыгинский район', FALSE, 430),
  ('Назаровский район', FALSE, 440),
  ('Нижнеингашский район', FALSE, 450),
  ('Новосёловский район', FALSE, 460),
  ('Партизанский район', FALSE, 470),
  ('Пировский муниципальный округ', FALSE, 480),
  ('Рыбинский район', FALSE, 490),
  ('Саянский район', FALSE, 500),
  ('Северо-Енисейский район', FALSE, 510),
  ('Сухобузимский район', FALSE, 520),
  ('Таймырский Долгано-Ненецкий район', FALSE, 530),
  ('Тасеевский район', FALSE, 540),
  ('Туруханский район', FALSE, 550),
  ('Тюхтетский муниципальный округ', FALSE, 560),
  ('Ужурский район', FALSE, 570),
  ('Уярский район', FALSE, 580),
  ('Шарыповский муниципальный округ', FALSE, 590),
  ('Шушенский район', FALSE, 600),
  ('Эвенкийский район', FALSE, 610),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '24'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 25: Приморский край
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Большой Камень', TRUE, 10),
  ('город Спасск-Дальний', TRUE, 20),
  ('город Фокино (ЗАТО)', TRUE, 30),
  ('Анучинский муниципальный округ', FALSE, 40),
  ('Арсеньевский городской округ', FALSE, 50),
  ('Артёмовский городской округ', FALSE, 60),
  ('Владивостокский городской округ', FALSE, 70),
  ('Дальнегорский городской округ', FALSE, 80),
  ('Дальнереченский городской округ', FALSE, 90),
  ('Дальнереченский район', FALSE, 100),
  ('Кавалеровский район', FALSE, 110),
  ('Кировский район', FALSE, 120),
  ('Красноармейский район', FALSE, 130),
  ('Лазовский муниципальный округ', FALSE, 140),
  ('Лесозаводский городской округ', FALSE, 150),
  ('Михайловский район', FALSE, 160),
  ('Надеждинский район', FALSE, 170),
  ('Находкинский городской округ', FALSE, 180),
  ('Октябрьский муниципальный округ', FALSE, 190),
  ('Ольгинский район', FALSE, 200),
  ('Партизанский городской округ', FALSE, 210),
  ('Партизанский район', FALSE, 220),
  ('Пограничный муниципальный округ', FALSE, 230),
  ('Пожарский район', FALSE, 240),
  ('Спасский район', FALSE, 250),
  ('Тернейский муниципальный округ', FALSE, 260),
  ('Уссурийский городской округ', FALSE, 270),
  ('Ханкайский муниципальный округ', FALSE, 280),
  ('Хасанский район', FALSE, 290),
  ('Хорольский муниципальный округ', FALSE, 300),
  ('Черниговский район', FALSE, 310),
  ('Чугуевский муниципальный округ', FALSE, 320),
  ('Шкотовский район', FALSE, 330),
  ('Яковлевский район', FALSE, 340),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '25'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 26: Ставропольский край
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Ессентуки, город-курорт', TRUE, 10),
  ('город Железноводск, город-курорт', TRUE, 20),
  ('город Кисловодск, город-курорт', TRUE, 30),
  ('город Лермонтов', TRUE, 40),
  ('город Невинномысск', TRUE, 50),
  ('город Пятигорск, город-курорт', TRUE, 60),
  ('город Ставрополь', TRUE, 70),
  ('Александровский муниципальный округ', FALSE, 80),
  ('Андроповский муниципальный округ', FALSE, 90),
  ('Апанасенковский муниципальный округ', FALSE, 100),
  ('Арзгирский муниципальный округ', FALSE, 110),
  ('Благодарненский городской округ', FALSE, 120),
  ('Будённовский муниципальный округ', FALSE, 130),
  ('Георгиевский городской округ', FALSE, 140),
  ('Грачёвский муниципальный округ', FALSE, 150),
  ('Изобильненский городской округ', FALSE, 160),
  ('Ипатовский городской округ', FALSE, 170),
  ('Кировский городской округ', FALSE, 180),
  ('Кочубеевский муниципальный округ', FALSE, 190),
  ('Красногвардейский муниципальный округ', FALSE, 200),
  ('Курский муниципальный округ', FALSE, 210),
  ('Левокумский муниципальный округ', FALSE, 220),
  ('Минераловодский городской округ', FALSE, 230),
  ('Нефтекумский городской округ', FALSE, 240),
  ('Новоалександровский городской округ', FALSE, 250),
  ('Новоселицкий муниципальный округ', FALSE, 260),
  ('Петровский городской округ', FALSE, 270),
  ('Предгорный муниципальный округ', FALSE, 280),
  ('Советский городской округ', FALSE, 290),
  ('Степновский муниципальный округ', FALSE, 300),
  ('Труновский муниципальный округ', FALSE, 310),
  ('Туркменский муниципальный округ', FALSE, 320),
  ('Шпаковский муниципальный округ', FALSE, 330),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '26'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 27: Хабаровский край
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Комсомольск-на-Амуре', TRUE, 10),
  ('город Хабаровск', TRUE, 20),
  ('Амурский район', FALSE, 30),
  ('Аяно-Майский район', FALSE, 40),
  ('Бикинский район', FALSE, 50),
  ('Ванинский район', FALSE, 60),
  ('Верхнебуреинский район', FALSE, 70),
  ('Вяземский район', FALSE, 80),
  ('Комсомольский район', FALSE, 90),
  ('Нанайский район', FALSE, 100),
  ('Николаевский район', FALSE, 110),
  ('Охотский район', FALSE, 120),
  ('Советско-Гаванский район', FALSE, 130),
  ('Солнечный район', FALSE, 140),
  ('Тугуро-Чумиканский район', FALSE, 150),
  ('Ульчский район', FALSE, 160),
  ('Хабаровский район', FALSE, 170),
  ('имени Лазо район', FALSE, 180),
  ('имени Полины Осипенко район', FALSE, 190),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '27'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 28: Амурская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Белогорск', TRUE, 10),
  ('город Благовещенск', TRUE, 20),
  ('город Зея', TRUE, 30),
  ('город Прогресс, пгт (р.п.)', TRUE, 40),
  ('город Райчихинск', TRUE, 50),
  ('город Свободный', TRUE, 60),
  ('город Тында', TRUE, 70),
  ('город Циолковский (ЗАТО)', TRUE, 80),
  ('город Шимановск', TRUE, 90),
  ('Архаринский район', FALSE, 100),
  ('Белогорский муниципальный округ', FALSE, 110),
  ('Благовещенский район', FALSE, 120),
  ('Бурейский муниципальный округ', FALSE, 130),
  ('Завитинский муниципальный округ', FALSE, 140),
  ('Зейский район', FALSE, 150),
  ('Ивановский муниципальный округ', FALSE, 160),
  ('Константиновский район', FALSE, 170),
  ('Магдагачинский район', FALSE, 180),
  ('Мазановский район', FALSE, 190),
  ('Михайловский район', FALSE, 200),
  ('Октябрьский район', FALSE, 210),
  ('Ромненский муниципальный округ', FALSE, 220),
  ('Свободненский район', FALSE, 230),
  ('Селемджинский район', FALSE, 240),
  ('Серышевский район', FALSE, 250),
  ('Сковородинский район', FALSE, 260),
  ('Тамбовский район', FALSE, 270),
  ('Тындинский муниципальный округ', FALSE, 280),
  ('Шимановский район', FALSE, 290),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '28'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 29: Архангельская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Архангельск', TRUE, 10),
  ('город Коряжма', TRUE, 20),
  ('город Котлас', TRUE, 30),
  ('город Мирный (ЗАТО)', TRUE, 40),
  ('город Новая Земля', TRUE, 50),
  ('город Новодвинск', TRUE, 60),
  ('город Северодвинск', TRUE, 70),
  ('Вельский район', FALSE, 80),
  ('Верхнетоемский район', FALSE, 90),
  ('Вилегодский муниципальный округ', FALSE, 100),
  ('Виноградовский район', FALSE, 110),
  ('Каргопольский муниципальный округ', FALSE, 120),
  ('Коношский район', FALSE, 130),
  ('Котласский район', FALSE, 140),
  ('Красноборский район', FALSE, 150),
  ('Ленский район', FALSE, 160),
  ('Лешуконский район', FALSE, 170),
  ('Мезенский район', FALSE, 180),
  ('Няндомский район', FALSE, 190),
  ('Онежский район', FALSE, 200),
  ('Пинежский район', FALSE, 210),
  ('Плесецкий район', FALSE, 220),
  ('Приморский район', FALSE, 230),
  ('Устьянский район', FALSE, 240),
  ('Холмогорский район', FALSE, 250),
  ('Шенкурский район', FALSE, 260),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '29'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 30: Астраханская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Астрахань', TRUE, 10),
  ('город Знаменск (ЗАТО)', TRUE, 20),
  ('Ахтубинский район', FALSE, 30),
  ('Володарский район', FALSE, 40),
  ('Енотаевский район', FALSE, 50),
  ('Икрянинский район', FALSE, 60),
  ('Камызякский район', FALSE, 70),
  ('Красноярский район', FALSE, 80),
  ('Лиманский район', FALSE, 90),
  ('Наримановский район', FALSE, 100),
  ('Приволжский район', FALSE, 110),
  ('Харабалинский район', FALSE, 120),
  ('Черноярский район', FALSE, 130),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '30'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 31: Белгородская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Белгород', TRUE, 10),
  ('Алексеевский городской округ', FALSE, 20),
  ('Белгородский район', FALSE, 30),
  ('Борисовский район', FALSE, 40),
  ('Валуйский городской округ', FALSE, 50),
  ('Вейделевский район', FALSE, 60),
  ('Волоконовский район', FALSE, 70),
  ('Грайворонский городской округ', FALSE, 80),
  ('Губкинский городской округ', FALSE, 90),
  ('Ивнянский район', FALSE, 100),
  ('Корочанский район', FALSE, 110),
  ('Красненский район', FALSE, 120),
  ('Красногвардейский район', FALSE, 130),
  ('Краснояружский район', FALSE, 140),
  ('Новооскольский городской округ', FALSE, 150),
  ('Прохоровский район', FALSE, 160),
  ('Ракитянский район', FALSE, 170),
  ('Ровеньский район', FALSE, 180),
  ('Старооскольский городской округ', FALSE, 190),
  ('Чернянский район', FALSE, 200),
  ('Шебекинский городской округ', FALSE, 210),
  ('Яковлевский городской округ', FALSE, 220),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '31'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 32: Брянская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Брянск', TRUE, 10),
  ('город Клинцы', TRUE, 20),
  ('город Сельцо', TRUE, 30),
  ('город Фокино', TRUE, 40),
  ('Брасовский район', FALSE, 50),
  ('Брянский район', FALSE, 60),
  ('Выгоничский район', FALSE, 70),
  ('Гордеевский район', FALSE, 80),
  ('Дубровский район', FALSE, 90),
  ('Дятьковский район', FALSE, 100),
  ('Жирятинский район', FALSE, 110),
  ('Жуковский муниципальный округ', FALSE, 120),
  ('Злынковский район', FALSE, 130),
  ('Карачевский район', FALSE, 140),
  ('Клетнянский район', FALSE, 150),
  ('Климовский район', FALSE, 160),
  ('Клинцовский район', FALSE, 170),
  ('Комаричский район', FALSE, 180),
  ('Красногорский район', FALSE, 190),
  ('Мглинский район', FALSE, 200),
  ('Навлинский район', FALSE, 210),
  ('Новозыбковский городской округ', FALSE, 220),
  ('Погарский район', FALSE, 230),
  ('Почепский район', FALSE, 240),
  ('Рогнединский район', FALSE, 250),
  ('Севский район', FALSE, 260),
  ('Стародубский муниципальный округ', FALSE, 270),
  ('Суземский район', FALSE, 280),
  ('Суражский район', FALSE, 290),
  ('Трубчевский район', FALSE, 300),
  ('Унечский район', FALSE, 310),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '32'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 33: Владимирская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('Муром, округ', TRUE, 10),
  ('город Владимир', TRUE, 20),
  ('город Гусь-Хрустальный', TRUE, 30),
  ('город Ковров', TRUE, 40),
  ('город Радужный (ЗАТО)', TRUE, 50),
  ('Александровский район', FALSE, 60),
  ('Вязниковский район', FALSE, 70),
  ('Гороховецкий район', FALSE, 80),
  ('Гусь-Хрустальный район', FALSE, 90),
  ('Камешковский район', FALSE, 100),
  ('Киржачский район', FALSE, 110),
  ('Ковровский район', FALSE, 120),
  ('Кольчугинский район', FALSE, 130),
  ('Меленковский район', FALSE, 140),
  ('Муромский район', FALSE, 150),
  ('Петушинский район', FALSE, 160),
  ('Селивановский район', FALSE, 170),
  ('Собинский район', FALSE, 180),
  ('Судогодский район', FALSE, 190),
  ('Суздальский район', FALSE, 200),
  ('Юрьев-Польский район', FALSE, 210),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '33'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 34: Волгоградская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Волгоград, город-герой', TRUE, 10),
  ('город Волжский', TRUE, 20),
  ('город Камышин', TRUE, 30),
  ('город Михайловка', TRUE, 40),
  ('город Урюпинск', TRUE, 50),
  ('город Фролово', TRUE, 60),
  ('Алексеевский район', FALSE, 70),
  ('Быковский район', FALSE, 80),
  ('Городищенский район', FALSE, 90),
  ('Даниловский район', FALSE, 100),
  ('Дубовский район', FALSE, 110),
  ('Еланский район', FALSE, 120),
  ('Жирновский район', FALSE, 130),
  ('Иловлинский район', FALSE, 140),
  ('Калачёвский район', FALSE, 150),
  ('Камышинский район', FALSE, 160),
  ('Киквидзенский район', FALSE, 170),
  ('Клетский район', FALSE, 180),
  ('Котельниковский район', FALSE, 190),
  ('Котовский район', FALSE, 200),
  ('Кумылженский район', FALSE, 210),
  ('Ленинский район', FALSE, 220),
  ('Нехаевский район', FALSE, 230),
  ('Николаевский район', FALSE, 240),
  ('Новоаннинский район', FALSE, 250),
  ('Новониколаевский район', FALSE, 260),
  ('Октябрьский район', FALSE, 270),
  ('Ольховский район', FALSE, 280),
  ('Палласовский район', FALSE, 290),
  ('Руднянский район', FALSE, 300),
  ('Светлоярский район', FALSE, 310),
  ('Серафимовичский район', FALSE, 320),
  ('Среднеахтубинский район', FALSE, 330),
  ('Старополтавский район', FALSE, 340),
  ('Суровикинский район', FALSE, 350),
  ('Урюпинский район', FALSE, 360),
  ('Фроловский район', FALSE, 370),
  ('Чернышковский район', FALSE, 380),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '34'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 35: Вологодская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Вологда', TRUE, 10),
  ('город Череповец', TRUE, 20),
  ('Бабаевский район', FALSE, 30),
  ('Бабушкинский район', FALSE, 40),
  ('Белозерский район', FALSE, 50),
  ('Вашкинский район', FALSE, 60),
  ('Великоустюгский район', FALSE, 70),
  ('Верховажский район', FALSE, 80),
  ('Вожегодский район', FALSE, 90),
  ('Вологодский район', FALSE, 100),
  ('Вытегорский район', FALSE, 110),
  ('Грязовецкий район', FALSE, 120),
  ('Кадуйский район', FALSE, 130),
  ('Кирилловский район', FALSE, 140),
  ('Кичменгско-Городецкий район', FALSE, 150),
  ('Междуреченский район', FALSE, 160),
  ('Никольский район', FALSE, 170),
  ('Нюксенский район', FALSE, 180),
  ('Сокольский район', FALSE, 190),
  ('Сямженский район', FALSE, 200),
  ('Тарногский район', FALSE, 210),
  ('Тотемский район', FALSE, 220),
  ('Усть-Кубинский район', FALSE, 230),
  ('Устюженский район', FALSE, 240),
  ('Харовский район', FALSE, 250),
  ('Чагодощенский район', FALSE, 260),
  ('Череповецкий район', FALSE, 270),
  ('Шекснинский район', FALSE, 280),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '35'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 36: Воронежская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Воронеж', TRUE, 10),
  ('город Нововоронеж', TRUE, 20),
  ('Аннинский район', FALSE, 30),
  ('Бобровский район', FALSE, 40),
  ('Богучарский район', FALSE, 50),
  ('Борисоглебский городской округ', FALSE, 60),
  ('Бутурлиновский район', FALSE, 70),
  ('Верхнемамонский район', FALSE, 80),
  ('Верхнехавский район', FALSE, 90),
  ('Воробьёвский район', FALSE, 100),
  ('Грибановский район', FALSE, 110),
  ('Калачеевский район', FALSE, 120),
  ('Каменский район', FALSE, 130),
  ('Кантемировский район', FALSE, 140),
  ('Каширский район', FALSE, 150),
  ('Лискинский район', FALSE, 160),
  ('Нижнедевицкий район', FALSE, 170),
  ('Новоусманский район', FALSE, 180),
  ('Новохопёрский район', FALSE, 190),
  ('Ольховатский район', FALSE, 200),
  ('Острогожский район', FALSE, 210),
  ('Павловский район', FALSE, 220),
  ('Панинский район', FALSE, 230),
  ('Петропавловский район', FALSE, 240),
  ('Поворинский район', FALSE, 250),
  ('Подгоренский район', FALSE, 260),
  ('Рамонский район', FALSE, 270),
  ('Репьёвский район', FALSE, 280),
  ('Россошанский район', FALSE, 290),
  ('Семилукский район', FALSE, 300),
  ('Таловский район', FALSE, 310),
  ('Терновский район', FALSE, 320),
  ('Хохольский район', FALSE, 330),
  ('Эртильский район', FALSE, 340),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '36'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 37: Ивановская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Вичуга', TRUE, 10),
  ('город Иваново', TRUE, 20),
  ('город Кинешма', TRUE, 30),
  ('город Кохма', TRUE, 40),
  ('город Тейково', TRUE, 50),
  ('город Шуя', TRUE, 60),
  ('Верхнеландеховский район', FALSE, 70),
  ('Вичугский район', FALSE, 80),
  ('Гаврилово-Посадский район', FALSE, 90),
  ('Заволжский район', FALSE, 100),
  ('Ивановский район', FALSE, 110),
  ('Ильинский район', FALSE, 120),
  ('Кинешемский район', FALSE, 130),
  ('Комсомольский район', FALSE, 140),
  ('Лежневский район', FALSE, 150),
  ('Лухский район', FALSE, 160),
  ('Палехский район', FALSE, 170),
  ('Пестяковский район', FALSE, 180),
  ('Приволжский район', FALSE, 190),
  ('Пучежский район', FALSE, 200),
  ('Родниковский район', FALSE, 210),
  ('Савинский район', FALSE, 220),
  ('Тейковский район', FALSE, 230),
  ('Фурмановский район', FALSE, 240),
  ('Шуйский район', FALSE, 250),
  ('Южский район', FALSE, 260),
  ('Юрьевецкий район', FALSE, 270),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '37'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 38: Иркутская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Братск', TRUE, 10),
  ('город Зиминское ГМО', TRUE, 20),
  ('город Иркутск', TRUE, 30),
  ('город Саянск', TRUE, 40),
  ('город Свирское МО', TRUE, 50),
  ('город Тулун', TRUE, 60),
  ('город Усолье-Сибирское', TRUE, 70),
  ('город Усть-Илимск', TRUE, 80),
  ('город Черемхово', TRUE, 90),
  ('Аларский район', FALSE, 100),
  ('Ангарский городской округ', FALSE, 110),
  ('Балаганский район', FALSE, 120),
  ('Баяндаевский район', FALSE, 130),
  ('Бодайбинский район', FALSE, 140),
  ('Боханский район', FALSE, 150),
  ('Братский район', FALSE, 160),
  ('Жигаловский район', FALSE, 170),
  ('Заларинский район', FALSE, 180),
  ('Зиминский район', FALSE, 190),
  ('Иркутский район', FALSE, 200),
  ('Казачинско-Ленский район', FALSE, 210),
  ('Катангский район', FALSE, 220),
  ('Качугский район', FALSE, 230),
  ('Киренский район', FALSE, 240),
  ('Куйтунский район', FALSE, 250),
  ('Мамско-Чуйский район', FALSE, 260),
  ('Нижнеилимский район', FALSE, 270),
  ('Нижнеудинский район', FALSE, 280),
  ('Нукутский район', FALSE, 290),
  ('Ольхонский район', FALSE, 300),
  ('Осинский район', FALSE, 310),
  ('Слюдянский район', FALSE, 320),
  ('Тайшетский район', FALSE, 330),
  ('Тулунский район', FALSE, 340),
  ('Усольский район', FALSE, 350),
  ('Усть-Илимский район', FALSE, 360),
  ('Усть-Кутский район', FALSE, 370),
  ('Усть-Удинский район', FALSE, 380),
  ('Черемховский район', FALSE, 390),
  ('Чунский район', FALSE, 400),
  ('Шелеховский район', FALSE, 410),
  ('Эхирит-Булагатский район', FALSE, 420),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '38'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 39: Калининградская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Калининград', TRUE, 10),
  ('город Янтарный', TRUE, 20),
  ('Багратионовский муниципальный округ', FALSE, 30),
  ('Балтийский городской округ', FALSE, 40),
  ('Гвардейский муниципальный округ', FALSE, 50),
  ('Гурьевский муниципальный округ', FALSE, 60),
  ('Гусевский городской округ', FALSE, 70),
  ('Зеленоградский муниципальный округ', FALSE, 80),
  ('Краснознаменский муниципальный округ', FALSE, 90),
  ('Ладушкинский городской округ', FALSE, 100),
  ('Мамоновский городской округ', FALSE, 110),
  ('Неманский муниципальный округ', FALSE, 120),
  ('Нестеровский муниципальный округ', FALSE, 130),
  ('Озёрский муниципальный округ', FALSE, 140),
  ('Пионерский городской округ', FALSE, 150),
  ('Полесский муниципальный округ', FALSE, 160),
  ('Правдинский муниципальный округ', FALSE, 170),
  ('Светловский городской округ', FALSE, 180),
  ('Светлогорский городской округ', FALSE, 190),
  ('Славский муниципальный округ', FALSE, 200),
  ('Советский городской округ', FALSE, 210),
  ('Черняховский муниципальный округ', FALSE, 220),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '39'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 40: Калужская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Калуга', TRUE, 10),
  ('город Обнинск', TRUE, 20),
  ('Бабынинский район', FALSE, 30),
  ('Барятинский район', FALSE, 40),
  ('Боровский район', FALSE, 50),
  ('Дзержинский район', FALSE, 60),
  ('Думиничский район', FALSE, 70),
  ('Жиздринский район', FALSE, 80),
  ('Жуковский район', FALSE, 90),
  ('Износковский район', FALSE, 100),
  ('Кировский район', FALSE, 110),
  ('Козельский район', FALSE, 120),
  ('Куйбышевский район', FALSE, 130),
  ('Людиновский район', FALSE, 140),
  ('Малоярославецкий район', FALSE, 150),
  ('Медынский район', FALSE, 160),
  ('Мещовский район', FALSE, 170),
  ('Мосальский район', FALSE, 180),
  ('Перемышльский район', FALSE, 190),
  ('Спас-Деменский район', FALSE, 200),
  ('Сухиничский район', FALSE, 210),
  ('Тарусский район', FALSE, 220),
  ('Ульяновский район', FALSE, 230),
  ('Ферзиковский район', FALSE, 240),
  ('Хвастовичский район', FALSE, 250),
  ('Юхновский район', FALSE, 260),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '40'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 41: Камчатский край
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Вилючинский (ЗАТО)', TRUE, 10),
  ('город Палана, пгт', TRUE, 20),
  ('Алеутский муниципальный округ', FALSE, 30),
  ('Быстринский район', FALSE, 40),
  ('Елизовский район', FALSE, 50),
  ('Карагинский район', FALSE, 60),
  ('Мильковский район', FALSE, 70),
  ('Олюторский район', FALSE, 80),
  ('Пенжинский район', FALSE, 90),
  ('Петропавловск-Камчатский городской округ', FALSE, 100),
  ('Соболевский район', FALSE, 110),
  ('Тигильский район', FALSE, 120),
  ('Усть-Большерецкий район', FALSE, 130),
  ('Усть-Камчатский район', FALSE, 140),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '41'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 42: Кемеровская область — Кузбасс
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '42'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 43: Кировская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Вятские Поляны', TRUE, 10),
  ('город Киров', TRUE, 20),
  ('город Кирово-Чепецк', TRUE, 30),
  ('город Котельнич', TRUE, 40),
  ('город Первомайский (ЗАТО)', TRUE, 50),
  ('город Слободской', TRUE, 60),
  ('Арбажский муниципальный округ', FALSE, 70),
  ('Афанасьевский район', FALSE, 80),
  ('Белохолуницкий район', FALSE, 90),
  ('Богородский муниципальный округ', FALSE, 100),
  ('Верхнекамский район', FALSE, 110),
  ('Верхошижемский район', FALSE, 120),
  ('Вятскополянский район', FALSE, 130),
  ('Даровской район', FALSE, 140),
  ('Зуевский район', FALSE, 150),
  ('Кикнурский муниципальный округ', FALSE, 160),
  ('Кильмезский район', FALSE, 170),
  ('Кирово-Чепецкий район', FALSE, 180),
  ('Котельничский район', FALSE, 190),
  ('Кумёнский район', FALSE, 200),
  ('Лебяжский район', FALSE, 210),
  ('Лузский район', FALSE, 220),
  ('Малмыжский район', FALSE, 230),
  ('Мурашинский район', FALSE, 240),
  ('Нагорский район', FALSE, 250),
  ('Немский район', FALSE, 260),
  ('Нолинский район', FALSE, 270),
  ('Омутнинский район', FALSE, 280),
  ('Опаринский район', FALSE, 290),
  ('Оричевский район', FALSE, 300),
  ('Орловский район', FALSE, 310),
  ('Пижанский район', FALSE, 320),
  ('Подосиновский район', FALSE, 330),
  ('Санчурский муниципальный округ', FALSE, 340),
  ('Свечинский муниципальный округ', FALSE, 350),
  ('Слободской район', FALSE, 360),
  ('Советский район', FALSE, 370),
  ('Сунский район', FALSE, 380),
  ('Тужинский район', FALSE, 390),
  ('Унинский район', FALSE, 400),
  ('Уржумский район', FALSE, 410),
  ('Фалёнский муниципальный округ', FALSE, 420),
  ('Шабалинский район', FALSE, 430),
  ('Юрьянский район', FALSE, 440),
  ('Яранский район', FALSE, 450),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '43'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 44: Костромская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Буй', TRUE, 10),
  ('город Волгореченск', TRUE, 20),
  ('город Галич', TRUE, 30),
  ('город Кострома', TRUE, 40),
  ('город Мантурово', TRUE, 50),
  ('город Шарья', TRUE, 60),
  ('Антроповский район', FALSE, 70),
  ('Буйский район', FALSE, 80),
  ('Вохомский район', FALSE, 90),
  ('Галичский район', FALSE, 100),
  ('Кадыйский район', FALSE, 110),
  ('Кологривский район', FALSE, 120),
  ('Костромской район', FALSE, 130),
  ('Красносельский район', FALSE, 140),
  ('Макарьевский район', FALSE, 150),
  ('Межевской район', FALSE, 160),
  ('Нейский район', FALSE, 170),
  ('Нерехтский район', FALSE, 180),
  ('Октябрьский район', FALSE, 190),
  ('Островский район', FALSE, 200),
  ('Павинский район', FALSE, 210),
  ('Парфеньевский район', FALSE, 220),
  ('Поназыревский район', FALSE, 230),
  ('Пыщугский район', FALSE, 240),
  ('Солигаличский район', FALSE, 250),
  ('Судиславский район', FALSE, 260),
  ('Сусанинский район', FALSE, 270),
  ('Чухломский район', FALSE, 280),
  ('Шарьинский район', FALSE, 290),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '44'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 45: Курганская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Курган', TRUE, 10),
  ('город Шадринск', TRUE, 20),
  ('Альменевский район', FALSE, 30),
  ('Белозерский район', FALSE, 40),
  ('Варгашинский район', FALSE, 50),
  ('Далматовский район', FALSE, 60),
  ('Звериноголовский район', FALSE, 70),
  ('Каргапольский район', FALSE, 80),
  ('Катайский район', FALSE, 90),
  ('Кетовский район', FALSE, 100),
  ('Куртамышский район', FALSE, 110),
  ('Лебяжьевский район', FALSE, 120),
  ('Макушинский муниципальный округ', FALSE, 130),
  ('Мишкинский район', FALSE, 140),
  ('Мокроусовский район', FALSE, 150),
  ('Петуховский район', FALSE, 160),
  ('Половинский район', FALSE, 170),
  ('Притобольный район', FALSE, 180),
  ('Сафакулевский район', FALSE, 190),
  ('Целинный район', FALSE, 200),
  ('Частоозерский район', FALSE, 210),
  ('Шадринский район', FALSE, 220),
  ('Шатровский район', FALSE, 230),
  ('Шумихинский муниципальный округ', FALSE, 240),
  ('Щучанский район', FALSE, 250),
  ('Юргамышский район', FALSE, 260),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '45'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 46: Курская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Железногорск', TRUE, 10),
  ('город Курск', TRUE, 20),
  ('город Курчатов', TRUE, 30),
  ('город Льгов', TRUE, 40),
  ('город Щигры', TRUE, 50),
  ('Беловский район', FALSE, 60),
  ('Большесолдатский район', FALSE, 70),
  ('Глушковский район', FALSE, 80),
  ('Горшеченский район', FALSE, 90),
  ('Дмитриевский район', FALSE, 100),
  ('Железногорский район', FALSE, 110),
  ('Золотухинский район', FALSE, 120),
  ('Касторенский район', FALSE, 130),
  ('Конышёвский район', FALSE, 140),
  ('Кореневский район', FALSE, 150),
  ('Курский район', FALSE, 160),
  ('Курчатовский район', FALSE, 170),
  ('Льговский район', FALSE, 180),
  ('Мантуровский район', FALSE, 190),
  ('Медвенский район', FALSE, 200),
  ('Обоянский район', FALSE, 210),
  ('Октябрьский район', FALSE, 220),
  ('Поныровский район', FALSE, 230),
  ('Пристенский район', FALSE, 240),
  ('Рыльский район', FALSE, 250),
  ('Советский район', FALSE, 260),
  ('Солнцевский район', FALSE, 270),
  ('Суджанский район', FALSE, 280),
  ('Тимский район', FALSE, 290),
  ('Фатежский район', FALSE, 300),
  ('Хомутовский район', FALSE, 310),
  ('Черемисиновский район', FALSE, 320),
  ('Щигровский район', FALSE, 330),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '46'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 47: Ленинградская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('Бокситогорский район', FALSE, 10),
  ('Волосовский район', FALSE, 20),
  ('Волховский район', FALSE, 30),
  ('Всеволожский район', FALSE, 40),
  ('Выборгский район', FALSE, 50),
  ('Гатчинский муниципальный округ', FALSE, 60),
  ('Кингисеппский район', FALSE, 70),
  ('Киришский район', FALSE, 80),
  ('Кировский район', FALSE, 90),
  ('Лодейнопольский район', FALSE, 100),
  ('Ломоносовский район', FALSE, 110),
  ('Лужский район', FALSE, 120),
  ('Подпорожский район', FALSE, 130),
  ('Приозерский район', FALSE, 140),
  ('Сланцевский район', FALSE, 150),
  ('Сосновоборский городской округ', FALSE, 160),
  ('Тихвинский район', FALSE, 170),
  ('Тосненский район', FALSE, 180),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '47'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 48: Липецкая область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Елец', TRUE, 10),
  ('город Липецк', TRUE, 20),
  ('Воловский район', FALSE, 30),
  ('Грязинский район', FALSE, 40),
  ('Данковский район', FALSE, 50),
  ('Добринский район', FALSE, 60),
  ('Добровский район', FALSE, 70),
  ('Долгоруковский район', FALSE, 80),
  ('Елецкий район', FALSE, 90),
  ('Задонский район', FALSE, 100),
  ('Измалковский район', FALSE, 110),
  ('Краснинский район', FALSE, 120),
  ('Лебедянский район', FALSE, 130),
  ('Лев-Толстовский район', FALSE, 140),
  ('Липецкий район', FALSE, 150),
  ('Становлянский район', FALSE, 160),
  ('Тербунский район', FALSE, 170),
  ('Усманский район', FALSE, 180),
  ('Хлевенский район', FALSE, 190),
  ('Чаплыгинский район', FALSE, 200),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '48'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 49: Магаданская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Магадан', TRUE, 10),
  ('Ольский городской округ', FALSE, 20),
  ('Омсукчанский городской округ', FALSE, 30),
  ('Северо-Эвенский городской округ', FALSE, 40),
  ('Среднеканский городской округ', FALSE, 50),
  ('Сусуманский городской округ', FALSE, 60),
  ('Тенькинский городской округ', FALSE, 70),
  ('Хасынский городской округ', FALSE, 80),
  ('Ягоднинский городской округ', FALSE, 90),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '49'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 50: Московская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Балашиха', TRUE, 10),
  ('город Бронницы', TRUE, 20),
  ('город Власиха (ЗАТО)', TRUE, 30),
  ('город Воскресенск', TRUE, 40),
  ('город Восход (ЗАТО)', TRUE, 50),
  ('город Долгопрудный', TRUE, 60),
  ('город Домодедово', TRUE, 70),
  ('город Дубна', TRUE, 80),
  ('город Егорьевск', TRUE, 90),
  ('город Зарайск', TRUE, 100),
  ('город Звёздный городок (ЗАТО)', TRUE, 110),
  ('город Ивантеевка', TRUE, 120),
  ('город Истра', TRUE, 130),
  ('город Кашира', TRUE, 140),
  ('город Клин', TRUE, 150),
  ('город Королёв', TRUE, 160),
  ('город Котельники', TRUE, 170),
  ('город Красноармейск', TRUE, 180),
  ('город Красногорск', TRUE, 190),
  ('город Краснознаменск (ЗАТО)', TRUE, 200),
  ('город Лобня', TRUE, 210),
  ('город Лотошино', TRUE, 220),
  ('город Луховицы', TRUE, 230),
  ('город Лыткарино', TRUE, 240),
  ('город Люберцы', TRUE, 250),
  ('город Молодёжный (ЗАТО)', TRUE, 260),
  ('город Мытищи', TRUE, 270),
  ('город Озёры', TRUE, 280),
  ('город Павловский Посад', TRUE, 290),
  ('город Подольск', TRUE, 300),
  ('город Протвино', TRUE, 310),
  ('город Пущино', TRUE, 320),
  ('город Реутов', TRUE, 330),
  ('город Серебряные Пруды', TRUE, 340),
  ('город Серпухов', TRUE, 350),
  ('город Солнечногорск', TRUE, 360),
  ('город Ступино', TRUE, 370),
  ('город Фрязино', TRUE, 380),
  ('город Химки', TRUE, 390),
  ('город Черноголовка', TRUE, 400),
  ('город Чехов', TRUE, 410),
  ('город Шатура', TRUE, 420),
  ('город Шаховская', TRUE, 430),
  ('город Щёлково', TRUE, 440),
  ('город Электрогорск', TRUE, 450),
  ('город Электросталь', TRUE, 460),
  ('Богородский городской округ', FALSE, 470),
  ('Волоколамский городской округ', FALSE, 480),
  ('Дзержинский городской округ', FALSE, 490),
  ('Дмитровский городской округ', FALSE, 500),
  ('Жуковский городской округ', FALSE, 510),
  ('Коломенский городской округ', FALSE, 520),
  ('Ленинский городской округ', FALSE, 530),
  ('Лосино-Петровский городской округ', FALSE, 540),
  ('Можайский городской округ', FALSE, 550),
  ('Наро-Фоминский городской округ', FALSE, 560),
  ('Одинцовский городской округ', FALSE, 570),
  ('Орехово-Зуевский городской округ', FALSE, 580),
  ('Пушкинский городской округ', FALSE, 590),
  ('Раменский городской округ', FALSE, 600),
  ('Рузский городской округ', FALSE, 610),
  ('Сергиево-Посадский городской округ', FALSE, 620),
  ('Талдомский городской округ', FALSE, 630),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '50'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 51: Мурманская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('Ковдорский район', TRUE, 10),
  ('город Александровск (ЗАТО)', TRUE, 20),
  ('город Апатиты, город с п.т.', TRUE, 30),
  ('город Видяево (ЗАТО)', TRUE, 40),
  ('город Заозёрск (ЗАТО)', TRUE, 50),
  ('город Кировск, город с п.т.', TRUE, 60),
  ('город Мончегорск, город с п.т.', TRUE, 70),
  ('город Мурманск', TRUE, 80),
  ('город Оленегорск, город с п.т.', TRUE, 90),
  ('город Островной (ЗАТО)', TRUE, 100),
  ('город Полярные Зори, город с п.т.', TRUE, 110),
  ('город Североморск (ЗАТО)', TRUE, 120),
  ('Кандалакшский район', FALSE, 130),
  ('Кольский район', FALSE, 140),
  ('Ловозерский район', FALSE, 150),
  ('Печенгский муниципальный округ', FALSE, 160),
  ('Терский район', FALSE, 170),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '51'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 52: Нижегородская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Арзамас', TRUE, 10),
  ('город Бор', TRUE, 20),
  ('город Выкса', TRUE, 30),
  ('город Дзержинск', TRUE, 40),
  ('город Кулебаки', TRUE, 50),
  ('город Нижний Новгород', TRUE, 60),
  ('город Первомайск', TRUE, 70),
  ('город Саров (ЗАТО)', TRUE, 80),
  ('город Чкаловск', TRUE, 90),
  ('город Шахунья', TRUE, 100),
  ('Ардатовский район', FALSE, 110),
  ('Арзамасский район', FALSE, 120),
  ('Балахнинский муниципальный округ', FALSE, 130),
  ('Богородский муниципальный округ', FALSE, 140),
  ('Большеболдинский район', FALSE, 150),
  ('Большемурашкинский район', FALSE, 160),
  ('Бутурлинский муниципальный округ', FALSE, 170),
  ('Вадский муниципальный округ', FALSE, 180),
  ('Варнавинский район', FALSE, 190),
  ('Вачский район', FALSE, 200),
  ('Ветлужский район', FALSE, 210),
  ('Вознесенский район', FALSE, 220),
  ('Володарский район', FALSE, 230),
  ('Воротынский городской округ', FALSE, 240),
  ('Воскресенский район', FALSE, 250),
  ('Гагинский район', FALSE, 260),
  ('Городецкий район', FALSE, 270),
  ('Дальнеконстантиновский район', FALSE, 280),
  ('Дивеевский муниципальный округ', FALSE, 290),
  ('Княгининский район', FALSE, 300),
  ('Ковернинский муниципальный округ', FALSE, 310),
  ('Краснобаковский район', FALSE, 320),
  ('Краснооктябрьский район', FALSE, 330),
  ('Кстовский район', FALSE, 340),
  ('Лукояновский район', FALSE, 350),
  ('Лысковский муниципальный округ', FALSE, 360),
  ('Навашинский городской округ', FALSE, 370),
  ('Павловский муниципальный округ', FALSE, 380),
  ('Перевозский городской округ', FALSE, 390),
  ('Пильнинский район', FALSE, 400),
  ('Починковский муниципальный округ', FALSE, 410),
  ('Семёновский городской округ', FALSE, 420),
  ('Сергачский район', FALSE, 430),
  ('Сеченовский район', FALSE, 440),
  ('Сокольский городской округ', FALSE, 450),
  ('Сосновский район', FALSE, 460),
  ('Спасский район', FALSE, 470),
  ('Тонкинский район', FALSE, 480),
  ('Тоншаевский муниципальный округ', FALSE, 490),
  ('Уренский муниципальный округ', FALSE, 500),
  ('Шарангский район', FALSE, 510),
  ('Шатковский район', FALSE, 520),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '52'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 53: Новгородская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('Великий Новгород', TRUE, 10),
  ('Батецкий район', FALSE, 20),
  ('Боровичский район', FALSE, 30),
  ('Валдайский район', FALSE, 40),
  ('Волотовский муниципальный округ', FALSE, 50),
  ('Демянский район', FALSE, 60),
  ('Крестецкий район', FALSE, 70),
  ('Любытинский район', FALSE, 80),
  ('Маловишерский район', FALSE, 90),
  ('Марёвский муниципальный округ', FALSE, 100),
  ('Мошенской район', FALSE, 110),
  ('Новгородский район', FALSE, 120),
  ('Окуловский район', FALSE, 130),
  ('Парфинский район', FALSE, 140),
  ('Пестовский район', FALSE, 150),
  ('Поддорский район', FALSE, 160),
  ('Солецкий муниципальный округ', FALSE, 170),
  ('Старорусский район', FALSE, 180),
  ('Хвойнинский муниципальный округ', FALSE, 190),
  ('Холмский район', FALSE, 200),
  ('Чудовский район', FALSE, 210),
  ('Шимский район', FALSE, 220),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '53'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 54: Новосибирская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Бердск', TRUE, 10),
  ('город Искитим', TRUE, 20),
  ('город Кольцово, р.п.', TRUE, 30),
  ('город Новосибирск', TRUE, 40),
  ('город Обь', TRUE, 50),
  ('Баганский район', FALSE, 60),
  ('Барабинский район', FALSE, 70),
  ('Болотнинский район', FALSE, 80),
  ('Венгеровский район', FALSE, 90),
  ('Доволенский район', FALSE, 100),
  ('Здвинский район', FALSE, 110),
  ('Искитимский район', FALSE, 120),
  ('Карасукский район', FALSE, 130),
  ('Каргатский район', FALSE, 140),
  ('Колыванский район', FALSE, 150),
  ('Коченёвский район', FALSE, 160),
  ('Кочковский район', FALSE, 170),
  ('Краснозёрский район', FALSE, 180),
  ('Куйбышевский район', FALSE, 190),
  ('Купинский район', FALSE, 200),
  ('Кыштовский район', FALSE, 210),
  ('Маслянинский район', FALSE, 220),
  ('Мошковский район', FALSE, 230),
  ('Новосибирский район', FALSE, 240),
  ('Ордынский район', FALSE, 250),
  ('Северный район', FALSE, 260),
  ('Сузунский район', FALSE, 270),
  ('Татарский район', FALSE, 280),
  ('Тогучинский район', FALSE, 290),
  ('Убинский район', FALSE, 300),
  ('Усть-Таркский район', FALSE, 310),
  ('Чановский район', FALSE, 320),
  ('Черепановский район', FALSE, 330),
  ('Чистоозёрный район', FALSE, 340),
  ('Чулымский район', FALSE, 350),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '54'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 55: Омская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Кедровый', TRUE, 10),
  ('город Омск', TRUE, 20),
  ('город Северск (ЗАТО)', TRUE, 30),
  ('город Стрежевой', TRUE, 40),
  ('город Томск', TRUE, 50),
  ('Азовский немецкий нац. район', FALSE, 60),
  ('Александровский район', FALSE, 70),
  ('Асиновский район', FALSE, 80),
  ('Бакчарский район', FALSE, 90),
  ('Большереченский район', FALSE, 100),
  ('Большеуковский район', FALSE, 110),
  ('Верхнекетский район', FALSE, 120),
  ('Горьковский район', FALSE, 130),
  ('Знаменский район', FALSE, 140),
  ('Зырянский район', FALSE, 150),
  ('Исилькульский район', FALSE, 160),
  ('Калачинский район', FALSE, 170),
  ('Каргасокский район', FALSE, 180),
  ('Кожевниковский район', FALSE, 190),
  ('Колосовский район', FALSE, 200),
  ('Колпашевский район', FALSE, 210),
  ('Кормиловский район', FALSE, 220),
  ('Кривошеинский район', FALSE, 230),
  ('Крутинский район', FALSE, 240),
  ('Любинский район', FALSE, 250),
  ('Марьяновский район', FALSE, 260),
  ('Молчановский район', FALSE, 270),
  ('Москаленский район', FALSE, 280),
  ('Муромцевский район', FALSE, 290),
  ('Называевский район', FALSE, 300),
  ('Нижнеомский район', FALSE, 310),
  ('Нововаршавский район', FALSE, 320),
  ('Одесский район', FALSE, 330),
  ('Оконешниковский район', FALSE, 340),
  ('Омский район', FALSE, 350),
  ('Павлоградский район', FALSE, 360),
  ('Парабельский район', FALSE, 370),
  ('Первомайский район', FALSE, 380),
  ('Полтавский район', FALSE, 390),
  ('Русско-Полянский район', FALSE, 400),
  ('Саргатский район', FALSE, 410),
  ('Седельниковский район', FALSE, 420),
  ('Таврический район', FALSE, 430),
  ('Тарский район', FALSE, 440),
  ('Тевризский район', FALSE, 450),
  ('Тегульдетский район', FALSE, 460),
  ('Томский район', FALSE, 470),
  ('Тюкалинский район', FALSE, 480),
  ('Усть-Ишимский район', FALSE, 490),
  ('Чаинский район', FALSE, 500),
  ('Черлакский район', FALSE, 510),
  ('Шегарский район', FALSE, 520),
  ('Шербакульский район', FALSE, 530),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '55'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 56: Оренбургская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Бугуруслан', TRUE, 10),
  ('город Бузулук', TRUE, 20),
  ('город Комаровский (ЗАТО, посёлок)', TRUE, 30),
  ('город Медногорск', TRUE, 40),
  ('город Новотроицк', TRUE, 50),
  ('город Оренбург', TRUE, 60),
  ('город Орск', TRUE, 70),
  ('город Соль-Илецкий', TRUE, 80),
  ('Абдулинский городской округ', FALSE, 90),
  ('Адамовский район', FALSE, 100),
  ('Акбулакский район', FALSE, 110),
  ('Александровский район', FALSE, 120),
  ('Асекеевский район', FALSE, 130),
  ('Беляевский район', FALSE, 140),
  ('Бугурусланский район', FALSE, 150),
  ('Бузулукский район', FALSE, 160),
  ('Гайский городской округ', FALSE, 170),
  ('Грачёвский район', FALSE, 180),
  ('Домбаровский район', FALSE, 190),
  ('Илекский район', FALSE, 200),
  ('Кваркенский район', FALSE, 210),
  ('Красногвардейский район', FALSE, 220),
  ('Кувандыкский городской округ', FALSE, 230),
  ('Курманаевский район', FALSE, 240),
  ('Матвеевский район', FALSE, 250),
  ('Новоорский район', FALSE, 260),
  ('Новосергиевский район', FALSE, 270),
  ('Октябрьский район', FALSE, 280),
  ('Оренбургский район', FALSE, 290),
  ('Первомайский район', FALSE, 300),
  ('Переволоцкий район', FALSE, 310),
  ('Пономарёвский район', FALSE, 320),
  ('Сакмарский район', FALSE, 330),
  ('Саракташский район', FALSE, 340),
  ('Светлинский район', FALSE, 350),
  ('Северный район', FALSE, 360),
  ('Сорочинский городской округ', FALSE, 370),
  ('Ташлинский район', FALSE, 380),
  ('Тоцкий район', FALSE, 390),
  ('Тюльганский район', FALSE, 400),
  ('Шарлыкский район', FALSE, 410),
  ('Ясненский городской округ', FALSE, 420),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '56'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 57: Орловская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Ливны', TRUE, 10),
  ('город Мценск', TRUE, 20),
  ('город Орёл', TRUE, 30),
  ('Болховский район', FALSE, 40),
  ('Верховский район', FALSE, 50),
  ('Глазуновский район', FALSE, 60),
  ('Дмитровский район', FALSE, 70),
  ('Должанский район', FALSE, 80),
  ('Залегощенский район', FALSE, 90),
  ('Знаменский район', FALSE, 100),
  ('Колпнянский район', FALSE, 110),
  ('Корсаковский район', FALSE, 120),
  ('Краснозоренский район', FALSE, 130),
  ('Кромской район', FALSE, 140),
  ('Ливенский район', FALSE, 150),
  ('Малоархангельский район', FALSE, 160),
  ('Мценский район', FALSE, 170),
  ('Новодеревеньковский район', FALSE, 180),
  ('Новосильский район', FALSE, 190),
  ('Орловский район', FALSE, 200),
  ('Покровский район', FALSE, 210),
  ('Свердловский район', FALSE, 220),
  ('Сосковский район', FALSE, 230),
  ('Троснянский район', FALSE, 240),
  ('Урицкий район', FALSE, 250),
  ('Хотынецкий район', FALSE, 260),
  ('Шаблыкинский район', FALSE, 270),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '57'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 58: Пензенская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Заречный (ЗАТО)', TRUE, 10),
  ('город Кузнецк', TRUE, 20),
  ('город Пенза', TRUE, 30),
  ('Башмаковский район', FALSE, 40),
  ('Бековский район', FALSE, 50),
  ('Белинский район', FALSE, 60),
  ('Бессоновский район', FALSE, 70),
  ('Вадинский район', FALSE, 80),
  ('Городищенский район', FALSE, 90),
  ('Земетчинский район', FALSE, 100),
  ('Иссинский район', FALSE, 110),
  ('Каменский район', FALSE, 120),
  ('Камешкирский район', FALSE, 130),
  ('Колышлейский район', FALSE, 140),
  ('Кузнецкий район', FALSE, 150),
  ('Лопатинский район', FALSE, 160),
  ('Лунинский район', FALSE, 170),
  ('Малосердобинский район', FALSE, 180),
  ('Мокшанский район', FALSE, 190),
  ('Наровчатский район', FALSE, 200),
  ('Неверкинский район', FALSE, 210),
  ('Нижнеломовский район', FALSE, 220),
  ('Никольский район', FALSE, 230),
  ('Пачелмский район', FALSE, 240),
  ('Пензенский район', FALSE, 250),
  ('Сердобский район', FALSE, 260),
  ('Сосновоборский район', FALSE, 270),
  ('Спасский район', FALSE, 280),
  ('Тамалинский район', FALSE, 290),
  ('Шемышейский район', FALSE, 300),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '58'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 59: Пермский край
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Березники', TRUE, 10),
  ('город Звёздный (ЗАТО)', TRUE, 20),
  ('Александровский муниципальный округ', FALSE, 30),
  ('Бардымский муниципальный округ', FALSE, 40),
  ('Берёзовский муниципальный округ', FALSE, 50),
  ('Большесосновский район', FALSE, 60),
  ('Верещагинский городской округ', FALSE, 70),
  ('Гайнский муниципальный округ', FALSE, 80),
  ('Горнозаводский городской округ', FALSE, 90),
  ('Гремячинский городской округ', FALSE, 100),
  ('Губахинский городской округ', FALSE, 110),
  ('Добрянский городской округ', FALSE, 120),
  ('Еловский муниципальный округ', FALSE, 130),
  ('Ильинский городской округ', FALSE, 140),
  ('Карагайский муниципальный округ', FALSE, 150),
  ('Кизеловский городской округ', FALSE, 160),
  ('Кишертский муниципальный округ', FALSE, 170),
  ('Косинский муниципальный округ', FALSE, 180),
  ('Кочёвский муниципальный округ', FALSE, 190),
  ('Красновишерский городской округ', FALSE, 200),
  ('Краснокамский городской округ', FALSE, 210),
  ('Кудымкарский городской округ', FALSE, 220),
  ('Кудымкарский муниципальный округ', FALSE, 230),
  ('Куединский муниципальный округ', FALSE, 240),
  ('Кунгурский городской округ', FALSE, 250),
  ('Кунгурский район', FALSE, 260),
  ('Лысьвенский городской округ', FALSE, 270),
  ('Нытвенский городской округ', FALSE, 280),
  ('Октябрьский городской округ', FALSE, 290),
  ('Ординский муниципальный округ', FALSE, 300),
  ('Осинский городской округ', FALSE, 310),
  ('Оханский городской округ', FALSE, 320),
  ('Очёрский городской округ', FALSE, 330),
  ('Пермский городской округ', FALSE, 340),
  ('Пермский район', FALSE, 350),
  ('Сивинский муниципальный округ', FALSE, 360),
  ('Соликамский городской округ', FALSE, 370),
  ('Суксунский городской округ', FALSE, 380),
  ('Уинский муниципальный округ', FALSE, 390),
  ('Чайковский городской округ', FALSE, 400),
  ('Частинский муниципальный округ', FALSE, 410),
  ('Чердынский городской округ', FALSE, 420),
  ('Чернушинский городской округ', FALSE, 430),
  ('Чусовской городской округ', FALSE, 440),
  ('Юрлинский муниципальный округ', FALSE, 450),
  ('Юсьвинский муниципальный округ', FALSE, 460),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '59'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 60: Псковская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Великие Луки', TRUE, 10),
  ('город Псков', TRUE, 20),
  ('Бежаницкий район', FALSE, 30),
  ('Великолукский район', FALSE, 40),
  ('Гдовский район', FALSE, 50),
  ('Дедовичский район', FALSE, 60),
  ('Дновский район', FALSE, 70),
  ('Красногородский район', FALSE, 80),
  ('Куньинский район', FALSE, 90),
  ('Локнянский район', FALSE, 100),
  ('Невельский район', FALSE, 110),
  ('Новоржевский район', FALSE, 120),
  ('Новосокольнический район', FALSE, 130),
  ('Опочецкий район', FALSE, 140),
  ('Островский район', FALSE, 150),
  ('Палкинский район', FALSE, 160),
  ('Печорский район', FALSE, 170),
  ('Плюсский район', FALSE, 180),
  ('Порховский район', FALSE, 190),
  ('Псковский район', FALSE, 200),
  ('Пустошкинский район', FALSE, 210),
  ('Пушкиногорский район', FALSE, 220),
  ('Пыталовский район', FALSE, 230),
  ('Себежский район', FALSE, 240),
  ('Струго-Красненский район', FALSE, 250),
  ('Усвятский район', FALSE, 260),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '60'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 61: Ростовская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Азов', TRUE, 10),
  ('город Батайск', TRUE, 20),
  ('город Волгодонск', TRUE, 30),
  ('город Гуково', TRUE, 40),
  ('город Донецк', TRUE, 50),
  ('город Зверево', TRUE, 60),
  ('город Каменск-Шахтинский', TRUE, 70),
  ('город Новочеркасск', TRUE, 80),
  ('город Новошахтинск', TRUE, 90),
  ('город Ростов-на-Дону', TRUE, 100),
  ('город Таганрог', TRUE, 110),
  ('город Шахты', TRUE, 120),
  ('Азовский район', FALSE, 130),
  ('Аксайский район', FALSE, 140),
  ('Багаевский район', FALSE, 150),
  ('Белокалитвинский район', FALSE, 160),
  ('Боковский район', FALSE, 170),
  ('Верхнедонской район', FALSE, 180),
  ('Весёловский район', FALSE, 190),
  ('Волгодонской район', FALSE, 200),
  ('Дубовский район', FALSE, 210),
  ('Егорлыкский район', FALSE, 220),
  ('Заветинский район', FALSE, 230),
  ('Зерноградский район', FALSE, 240),
  ('Зимовниковский район', FALSE, 250),
  ('Кагальницкий район', FALSE, 260),
  ('Каменский район', FALSE, 270),
  ('Кашарский район', FALSE, 280),
  ('Константиновский район', FALSE, 290),
  ('Красносулинский район', FALSE, 300),
  ('Куйбышевский район', FALSE, 310),
  ('Мартыновский район', FALSE, 320),
  ('Матвеево-Курганский район', FALSE, 330),
  ('Миллеровский район', FALSE, 340),
  ('Милютинский район', FALSE, 350),
  ('Морозовский район', FALSE, 360),
  ('Мясниковский район', FALSE, 370),
  ('Неклиновский район', FALSE, 380),
  ('Обливский район', FALSE, 390),
  ('Октябрьский район', FALSE, 400),
  ('Орловский район', FALSE, 410),
  ('Песчанокопский район', FALSE, 420),
  ('Пролетарский район', FALSE, 430),
  ('Ремонтненский район', FALSE, 440),
  ('Родионово-Несветайский район', FALSE, 450),
  ('Сальский район', FALSE, 460),
  ('Семикаракорский район', FALSE, 470),
  ('Советский район', FALSE, 480),
  ('Тарасовский район', FALSE, 490),
  ('Тацинский район', FALSE, 500),
  ('Усть-Донецкий район', FALSE, 510),
  ('Целинский район', FALSE, 520),
  ('Цимлянский район', FALSE, 530),
  ('Чертковский район', FALSE, 540),
  ('Шолоховский район', FALSE, 550),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '61'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 62: Рязанская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Касимов', TRUE, 10),
  ('город Рязань', TRUE, 20),
  ('город Сасово', TRUE, 30),
  ('город Скопин', TRUE, 40),
  ('Александро-Невский район', FALSE, 50),
  ('Ермишинский район', FALSE, 60),
  ('Захаровский район', FALSE, 70),
  ('Кадомский район', FALSE, 80),
  ('Касимовский район', FALSE, 90),
  ('Клепиковский район', FALSE, 100),
  ('Кораблинский район', FALSE, 110),
  ('Милославский район', FALSE, 120),
  ('Михайловский район', FALSE, 130),
  ('Пителинский район', FALSE, 140),
  ('Пронский район', FALSE, 150),
  ('Путятинский район', FALSE, 160),
  ('Рыбновский район', FALSE, 170),
  ('Ряжский район', FALSE, 180),
  ('Рязанский район', FALSE, 190),
  ('Сапожковский район', FALSE, 200),
  ('Сараевский район', FALSE, 210),
  ('Сасовский район', FALSE, 220),
  ('Скопинский район', FALSE, 230),
  ('Спасский район', FALSE, 240),
  ('Старожиловский район', FALSE, 250),
  ('Ухоловский район', FALSE, 260),
  ('Чучковский район', FALSE, 270),
  ('Шацкий район', FALSE, 280),
  ('Шиловский район', FALSE, 290),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '62'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 63: Самарская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Жигулёвск', TRUE, 10),
  ('город Кинель', TRUE, 20),
  ('город Новокуйбышевск', TRUE, 30),
  ('город Октябрьск', TRUE, 40),
  ('город Отрадный', TRUE, 50),
  ('город Похвистнево', TRUE, 60),
  ('город Самара', TRUE, 70),
  ('город Сызрань', TRUE, 80),
  ('город Тольятти', TRUE, 90),
  ('город Чапаевск', TRUE, 100),
  ('Алексеевский район', FALSE, 110),
  ('Безенчукский район', FALSE, 120),
  ('Богатовский район', FALSE, 130),
  ('Большеглушицкий район', FALSE, 140),
  ('Большечерниговский район', FALSE, 150),
  ('Борский район', FALSE, 160),
  ('Волжский район', FALSE, 170),
  ('Елховский район', FALSE, 180),
  ('Исаклинский район', FALSE, 190),
  ('Камышлинский район', FALSE, 200),
  ('Кинель-Черкасский район', FALSE, 210),
  ('Кинельский район', FALSE, 220),
  ('Клявлинский район', FALSE, 230),
  ('Кошкинский район', FALSE, 240),
  ('Красноармейский район', FALSE, 250),
  ('Красноярский район', FALSE, 260),
  ('Нефтегорский район', FALSE, 270),
  ('Пестравский район', FALSE, 280),
  ('Похвистневский район', FALSE, 290),
  ('Приволжский район', FALSE, 300),
  ('Сергиевский район', FALSE, 310),
  ('Ставропольский район', FALSE, 320),
  ('Сызранский район', FALSE, 330),
  ('Хворостянский район', FALSE, 340),
  ('Челно-Вершинский район', FALSE, 350),
  ('Шенталинский район', FALSE, 360),
  ('Шигонский район', FALSE, 370),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '63'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 64: Саратовская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Саратов', TRUE, 10),
  ('город Светлый (ЗАТО)', TRUE, 20),
  ('город Шиханы', TRUE, 30),
  ('Александрово-Гайский район', FALSE, 40),
  ('Аркадакский район', FALSE, 50),
  ('Аткарский район', FALSE, 60),
  ('Базарно-Карабулакский район', FALSE, 70),
  ('Балаковский район', FALSE, 80),
  ('Балашовский район', FALSE, 90),
  ('Балтайский район', FALSE, 100),
  ('Вольский район', FALSE, 110),
  ('Воскресенский район', FALSE, 120),
  ('Дергачёвский район', FALSE, 130),
  ('Духовницкий район', FALSE, 140),
  ('Екатериновский район', FALSE, 150),
  ('Ершовский район', FALSE, 160),
  ('Ивантеевский район', FALSE, 170),
  ('Калининский район', FALSE, 180),
  ('Красноармейский район', FALSE, 190),
  ('Краснокутский район', FALSE, 200),
  ('Краснопартизанский район', FALSE, 210),
  ('Лысогорский район', FALSE, 220),
  ('Марксовский район', FALSE, 230),
  ('Михайловский городской округ', FALSE, 240),
  ('Новобурасский район', FALSE, 250),
  ('Новоузенский район', FALSE, 260),
  ('Озинский район', FALSE, 270),
  ('Перелюбский район', FALSE, 280),
  ('Петровский район', FALSE, 290),
  ('Питерский район', FALSE, 300),
  ('Пугачёвский район', FALSE, 310),
  ('Ровенский район', FALSE, 320),
  ('Романовский район', FALSE, 330),
  ('Ртищевский район', FALSE, 340),
  ('Самойловский район', FALSE, 350),
  ('Саратовский район', FALSE, 360),
  ('Советский район', FALSE, 370),
  ('Татищевский район', FALSE, 380),
  ('Турковский район', FALSE, 390),
  ('Фёдоровский район', FALSE, 400),
  ('Хвалынский район', FALSE, 410),
  ('Энгельсский район', FALSE, 420),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '64'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 65: Сахалинская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '65'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 66: Свердловская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('Красноуфимский округ', TRUE, 10),
  ('город Алапаевск', TRUE, 20),
  ('город Алапаевское, МО', TRUE, 30),
  ('город Богданович', TRUE, 40),
  ('город Верхнее Дуброво', TRUE, 50),
  ('город Верхний Тагил', TRUE, 60),
  ('город Верхняя Пышма', TRUE, 70),
  ('город Верхняя Тура', TRUE, 80),
  ('город Дегтярск', TRUE, 90),
  ('город Екатеринбург', TRUE, 100),
  ('город Заречный', TRUE, 110),
  ('город Ирбит', TRUE, 120),
  ('город Ирбитское МО', TRUE, 130),
  ('город Каменск-Уральский', TRUE, 140),
  ('город Карпинск', TRUE, 150),
  ('город Краснотурьинск', TRUE, 160),
  ('город Красноуральск', TRUE, 170),
  ('город Красноуфимск', TRUE, 180),
  ('город Лесной (ЗАТО)', TRUE, 190),
  ('город Махнёвское МО', TRUE, 200),
  ('город Нижний Тагил', TRUE, 210),
  ('город Нижняя Салда', TRUE, 220),
  ('город Новоуральский (ЗАТО)', TRUE, 230),
  ('город Пелым', TRUE, 240),
  ('город Первоуральск', TRUE, 250),
  ('город Ревда', TRUE, 260),
  ('город Свободный (ЗАТО)', TRUE, 270),
  ('город Среднеуральск', TRUE, 280),
  ('город Староуткинск', TRUE, 290),
  ('город Сухой Лог', TRUE, 300),
  ('город Талицкий', TRUE, 310),
  ('город Уральский (ЗАТО, посёлок)', TRUE, 320),
  ('Арамильский городской округ', FALSE, 330),
  ('Артинский городской округ', FALSE, 340),
  ('Артёмовский городской округ', FALSE, 350),
  ('Асбестовский городской округ', FALSE, 360),
  ('Ачитский городской округ', FALSE, 370),
  ('Байкаловский район', FALSE, 380),
  ('Белоярский городской округ', FALSE, 390),
  ('Берёзовский городской округ', FALSE, 400),
  ('Бисертский городской округ', FALSE, 410),
  ('Верх-Нейвинский городской округ', FALSE, 420),
  ('Верхнесалдинский городской округ', FALSE, 430),
  ('Верхотурский городской округ', FALSE, 440),
  ('Волчанский городской округ', FALSE, 450),
  ('Гаринский городской округ', FALSE, 460),
  ('Горноуральский городской округ', FALSE, 470),
  ('Ивдельский городской округ', FALSE, 480),
  ('Каменский городской округ', FALSE, 490),
  ('Камышловский городской округ', FALSE, 500),
  ('Камышловский район', FALSE, 510),
  ('Качканарский городской округ', FALSE, 520),
  ('Кировградский городской округ', FALSE, 530),
  ('Кушвинский городской округ', FALSE, 540),
  ('Малышевский городской округ', FALSE, 550),
  ('Невьянский городской округ', FALSE, 560),
  ('Нижнесергинский район', FALSE, 570),
  ('Нижнетуринский городской округ', FALSE, 580),
  ('Новолялинский городской округ', FALSE, 590),
  ('Полевской городской округ', FALSE, 600),
  ('Пышминский городской округ', FALSE, 610),
  ('Режевской городской округ', FALSE, 620),
  ('Рефтинский городской округ', FALSE, 630),
  ('Североуральский городской округ', FALSE, 640),
  ('Серовский городской округ', FALSE, 650),
  ('Слободо-Туринский район', FALSE, 660),
  ('Сосьвинский городской округ', FALSE, 670),
  ('Сысертский городской округ', FALSE, 680),
  ('Таборинский район', FALSE, 690),
  ('Тавдинский городской округ', FALSE, 700),
  ('Тугулымский городской округ', FALSE, 710),
  ('Туринский городской округ', FALSE, 720),
  ('Шалинский городской округ', FALSE, 730),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '66'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 67: Смоленская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Десногорск', TRUE, 10),
  ('город Смоленск', TRUE, 20),
  ('Велижский район', FALSE, 30),
  ('Вяземский район', FALSE, 40),
  ('Гагаринский район', FALSE, 50),
  ('Глинковский район', FALSE, 60),
  ('Демидовский район', FALSE, 70),
  ('Дорогобужский район', FALSE, 80),
  ('Духовщинский район', FALSE, 90),
  ('Ельнинский район', FALSE, 100),
  ('Ершичский район', FALSE, 110),
  ('Кардымовский район', FALSE, 120),
  ('Краснинский район', FALSE, 130),
  ('Монастырщинский район', FALSE, 140),
  ('Новодугинский район', FALSE, 150),
  ('Починковский район', FALSE, 160),
  ('Рославльский район', FALSE, 170),
  ('Руднянский район', FALSE, 180),
  ('Сафоновский район', FALSE, 190),
  ('Смоленский район', FALSE, 200),
  ('Сычёвский район', FALSE, 210),
  ('Тёмкинский район', FALSE, 220),
  ('Угранский район', FALSE, 230),
  ('Хиславичский район', FALSE, 240),
  ('Холм-Жирковский район', FALSE, 250),
  ('Шумячский район', FALSE, 260),
  ('Ярцевский район', FALSE, 270),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '67'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 68: Тамбовская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Кирсанов', TRUE, 10),
  ('город Котовск', TRUE, 20),
  ('город Мичуринск', TRUE, 30),
  ('город Моршанск', TRUE, 40),
  ('город Рассказово', TRUE, 50),
  ('город Тамбов', TRUE, 60),
  ('город Уварово', TRUE, 70),
  ('Бондарский район', FALSE, 80),
  ('Гавриловский район', FALSE, 90),
  ('Жердевский район', FALSE, 100),
  ('Знаменский район', FALSE, 110),
  ('Инжавинский район', FALSE, 120),
  ('Кирсановский район', FALSE, 130),
  ('Мичуринский район', FALSE, 140),
  ('Мордовский район', FALSE, 150),
  ('Моршанский район', FALSE, 160),
  ('Мучкапский район', FALSE, 170),
  ('Никифоровский район', FALSE, 180),
  ('Первомайский район', FALSE, 190),
  ('Петровский район', FALSE, 200),
  ('Пичаевский район', FALSE, 210),
  ('Рассказовский район', FALSE, 220),
  ('Ржаксинский район', FALSE, 230),
  ('Сампурский район', FALSE, 240),
  ('Сосновский район', FALSE, 250),
  ('Староюрьевский район', FALSE, 260),
  ('Тамбовский район', FALSE, 270),
  ('Токарёвский район', FALSE, 280),
  ('Уваровский район', FALSE, 290),
  ('Умётский район', FALSE, 300),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '68'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 69: Тверская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Вышневолоцкий', TRUE, 10),
  ('город Кимры', TRUE, 20),
  ('город Озёрный (ЗАТО)', TRUE, 30),
  ('город Ржев', TRUE, 40),
  ('город Солнечный (ЗАТО)', TRUE, 50),
  ('город Тверь', TRUE, 60),
  ('город Торжок', TRUE, 70),
  ('Андреапольский муниципальный округ', FALSE, 80),
  ('Бежецкий район', FALSE, 90),
  ('Бельский район', FALSE, 100),
  ('Бологовский район', FALSE, 110),
  ('Весьегонский муниципальный округ', FALSE, 120),
  ('Жарковский район', FALSE, 130),
  ('Западнодвинский муниципальный округ', FALSE, 140),
  ('Зубцовский район', FALSE, 150),
  ('Калининский район', FALSE, 160),
  ('Калязинский район', FALSE, 170),
  ('Кашинский городской округ', FALSE, 180),
  ('Кесовогорский район', FALSE, 190),
  ('Кимрский район', FALSE, 200),
  ('Конаковский район', FALSE, 210),
  ('Краснохолмский муниципальный округ', FALSE, 220),
  ('Кувшиновский район', FALSE, 230),
  ('Лесной муниципальный округ', FALSE, 240),
  ('Лихославльский район', FALSE, 250),
  ('Максатихинский район', FALSE, 260),
  ('Молоковский район', FALSE, 270),
  ('Нелидовский городской округ', FALSE, 280),
  ('Оленинский муниципальный округ', FALSE, 290),
  ('Осташковский городской округ', FALSE, 300),
  ('Пеновский муниципальный округ', FALSE, 310),
  ('Рамешковский район', FALSE, 320),
  ('Ржевский район', FALSE, 330),
  ('Сандовский муниципальный округ', FALSE, 340),
  ('Селижаровский муниципальный округ', FALSE, 350),
  ('Сонковский район', FALSE, 360),
  ('Спировский район', FALSE, 370),
  ('Старицкий район', FALSE, 380),
  ('Торжокский район', FALSE, 390),
  ('Торопецкий район', FALSE, 400),
  ('Удомельский городской округ', FALSE, 410),
  ('Фировский район', FALSE, 420),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '69'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 70: Томская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '70'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 71: Тульская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Алексин', TRUE, 10),
  ('город Донской', TRUE, 20),
  ('город Ефремов', TRUE, 30),
  ('город Новогуровский, р.п.', TRUE, 40),
  ('город Новомосковск', TRUE, 50),
  ('город Славный', TRUE, 60),
  ('город Тула', TRUE, 70),
  ('Арсеньевский район', FALSE, 80),
  ('Белёвский район', FALSE, 90),
  ('Богородицкий район', FALSE, 100),
  ('Венёвский район', FALSE, 110),
  ('Воловский район', FALSE, 120),
  ('Дубенский район', FALSE, 130),
  ('Заокский район', FALSE, 140),
  ('Каменский район', FALSE, 150),
  ('Кимовский район', FALSE, 160),
  ('Киреевский район', FALSE, 170),
  ('Куркинский район', FALSE, 180),
  ('Одоевский район', FALSE, 190),
  ('Плавский район', FALSE, 200),
  ('Суворовский район', FALSE, 210),
  ('Тёпло-Огарёвский район', FALSE, 220),
  ('Узловский район', FALSE, 230),
  ('Чернский район', FALSE, 240),
  ('Щёкинский район', FALSE, 250),
  ('Ясногорский район', FALSE, 260),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '71'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 72: Тюменская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Ишим', TRUE, 10),
  ('город Тобольск', TRUE, 20),
  ('город Тюмень', TRUE, 30),
  ('город Ялуторовск', TRUE, 40),
  ('Абатский район', FALSE, 50),
  ('Армизонский район', FALSE, 60),
  ('Аромашевский район', FALSE, 70),
  ('Бердюжский район', FALSE, 80),
  ('Вагайский район', FALSE, 90),
  ('Викуловский район', FALSE, 100),
  ('Голышмановский городской округ', FALSE, 110),
  ('Заводоуковский городской округ', FALSE, 120),
  ('Исетский район', FALSE, 130),
  ('Ишимский район', FALSE, 140),
  ('Казанский район', FALSE, 150),
  ('Нижнетавдинский район', FALSE, 160),
  ('Омутинский район', FALSE, 170),
  ('Сладковский район', FALSE, 180),
  ('Сорокинский район', FALSE, 190),
  ('Тобольский район', FALSE, 200),
  ('Тюменский район', FALSE, 210),
  ('Уватский район', FALSE, 220),
  ('Упоровский район', FALSE, 230),
  ('Юргинский район', FALSE, 240),
  ('Ялуторовский район', FALSE, 250),
  ('Ярковский район', FALSE, 260),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '72'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 73: Ульяновская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Димитровград', TRUE, 10),
  ('город Новоульяновск', TRUE, 20),
  ('город Ульяновск', TRUE, 30),
  ('Базарносызганский район', FALSE, 40),
  ('Барышский район', FALSE, 50),
  ('Вешкаймский район', FALSE, 60),
  ('Инзенский район', FALSE, 70),
  ('Карсунский район', FALSE, 80),
  ('Кузоватовский район', FALSE, 90),
  ('Майнский район', FALSE, 100),
  ('Мелекесский район', FALSE, 110),
  ('Николаевский район', FALSE, 120),
  ('Новомалыклинский район', FALSE, 130),
  ('Новоспасский район', FALSE, 140),
  ('Павловский район', FALSE, 150),
  ('Радищевский район', FALSE, 160),
  ('Сенгилеевский район', FALSE, 170),
  ('Старокулаткинский район', FALSE, 180),
  ('Старомайнский район', FALSE, 190),
  ('Сурский район', FALSE, 200),
  ('Тереньгульский район', FALSE, 210),
  ('Ульяновский район', FALSE, 220),
  ('Цильнинский район', FALSE, 230),
  ('Чердаклинский район', FALSE, 240),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '73'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 74: Челябинская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Локомотивный', TRUE, 10),
  ('город Озёрский (ЗАТО)', TRUE, 20),
  ('город Снежинский (ЗАТО)', TRUE, 30),
  ('город Троицкий', TRUE, 40),
  ('город Трёхгорный (ЗАТО)', TRUE, 50),
  ('Агаповский район', FALSE, 60),
  ('Аргаяшский район', FALSE, 70),
  ('Ашинский район', FALSE, 80),
  ('Брединский район', FALSE, 90),
  ('Варненский район', FALSE, 100),
  ('Верхнеуральский район', FALSE, 110),
  ('Верхнеуфалейский городской округ', FALSE, 120),
  ('Еманжелинский район', FALSE, 130),
  ('Еткульский район', FALSE, 140),
  ('Златоустовский городской округ', FALSE, 150),
  ('Карабашский городской округ', FALSE, 160),
  ('Карталинский район', FALSE, 170),
  ('Каслинский район', FALSE, 180),
  ('Катав-Ивановский район', FALSE, 190),
  ('Кизильский район', FALSE, 200),
  ('Копейский городской округ', FALSE, 210),
  ('Коркинский район', FALSE, 220),
  ('Красноармейский район', FALSE, 230),
  ('Кунашакский район', FALSE, 240),
  ('Кусинский район', FALSE, 250),
  ('Кыштымский городской округ', FALSE, 260),
  ('Магнитогорский городской округ', FALSE, 270),
  ('Миасский городской округ', FALSE, 280),
  ('Нагайбакский район', FALSE, 290),
  ('Нязепетровский район', FALSE, 300),
  ('Октябрьский район', FALSE, 310),
  ('Пластовский район', FALSE, 320),
  ('Саткинский район', FALSE, 330),
  ('Сосновский район', FALSE, 340),
  ('Троицкий район', FALSE, 350),
  ('Увельский район', FALSE, 360),
  ('Уйский район', FALSE, 370),
  ('Усть-Катавский городской округ', FALSE, 380),
  ('Чебаркульский городской округ', FALSE, 390),
  ('Чебаркульский район', FALSE, 400),
  ('Челябинский городской округ', FALSE, 410),
  ('Чесменский район', FALSE, 420),
  ('Южноуральский городской округ', FALSE, 430),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '74'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 75: Забайкальский край
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Агинское, посёлок', TRUE, 10),
  ('город Горный (ЗАТО, посёлок)', TRUE, 20),
  ('город Петровск-Забайкальский', TRUE, 30),
  ('город Чита', TRUE, 40),
  ('Агинский район', FALSE, 50),
  ('Акшинский район', FALSE, 60),
  ('Александрово-Заводский район', FALSE, 70),
  ('Балейский район', FALSE, 80),
  ('Борзинский район', FALSE, 90),
  ('Газимуро-Заводский район', FALSE, 100),
  ('Дульдургинский район', FALSE, 110),
  ('Забайкальский район', FALSE, 120),
  ('Каларский муниципальный округ', FALSE, 130),
  ('Калганский район', FALSE, 140),
  ('Карымский район', FALSE, 150),
  ('Краснокаменский район', FALSE, 160),
  ('Красночикойский район', FALSE, 170),
  ('Кыринский район', FALSE, 180),
  ('Могойтуйский район', FALSE, 190),
  ('Могочинский район', FALSE, 200),
  ('Нерчинский район', FALSE, 210),
  ('Нерчинско-Заводский район', FALSE, 220),
  ('Оловяннинский район', FALSE, 230),
  ('Ононский район', FALSE, 240),
  ('Петровск-Забайкальский район', FALSE, 250),
  ('Приаргунский муниципальный округ', FALSE, 260),
  ('Сретенский район', FALSE, 270),
  ('Тунгиро-Олёкминский район', FALSE, 280),
  ('Тунгокоченский район', FALSE, 290),
  ('Улётовский район', FALSE, 300),
  ('Хилокский район', FALSE, 310),
  ('Чернышевский район', FALSE, 320),
  ('Читинский район', FALSE, 330),
  ('Шелопугинский район', FALSE, 340),
  ('Шилкинский район', FALSE, 350),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '75'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 76: Ярославская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Переславль-Залесский', TRUE, 10),
  ('город Рыбинск', TRUE, 20),
  ('город Ярославль', TRUE, 30),
  ('Большесельский район', FALSE, 40),
  ('Борисоглебский район', FALSE, 50),
  ('Брейтовский район', FALSE, 60),
  ('Гаврилов-Ямский район', FALSE, 70),
  ('Даниловский район', FALSE, 80),
  ('Любимский район', FALSE, 90),
  ('Мышкинский район', FALSE, 100),
  ('Некоузский район', FALSE, 110),
  ('Некрасовский район', FALSE, 120),
  ('Первомайский район', FALSE, 130),
  ('Пошехонский район', FALSE, 140),
  ('Ростовский район', FALSE, 150),
  ('Рыбинский район', FALSE, 160),
  ('Тутаевский район', FALSE, 170),
  ('Угличский район', FALSE, 180),
  ('Ярославский район', FALSE, 190),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '76'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 77: Москва
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Зеленоград', TRUE, 10),
  ('город Троицк', TRUE, 20),
  ('город Щербинка', TRUE, 30),
  ('Восточный административный округ (ВАО)', FALSE, 40),
  ('Западный административный округ (ЗАО)', FALSE, 50),
  ('Зеленоградский административный округ (ЗелАО)', FALSE, 60),
  ('Новомосковский административный округ (НАО)', FALSE, 70),
  ('Северный административный округ (САО)', FALSE, 80),
  ('Северо-Восточный административный округ (СВАО)', FALSE, 90),
  ('Северо-Западный административный округ (СЗАО)', FALSE, 100),
  ('Троицкий административный округ (ТАО)', FALSE, 110),
  ('Центральный административный округ (ЦАО)', FALSE, 120),
  ('Юго-Восточный административный округ (ЮВАО)', FALSE, 130),
  ('Юго-Западный административный округ (ЮЗАО)', FALSE, 140),
  ('Южный административный округ (ЮАО)', FALSE, 150),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '77'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 78: Санкт-Петербург
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Колпино', TRUE, 10),
  ('город Кронштадт', TRUE, 20),
  ('город Петергоф', TRUE, 30),
  ('город Пушкин', TRUE, 40),
  ('город Сестрорецк', TRUE, 50),
  ('Адмиралтейский район', FALSE, 60),
  ('Василеостровский район', FALSE, 70),
  ('Выборгский район', FALSE, 80),
  ('Калининский район', FALSE, 90),
  ('Кировский район', FALSE, 100),
  ('Колпинский район', FALSE, 110),
  ('Красногвардейский район', FALSE, 120),
  ('Красносельский район', FALSE, 130),
  ('Кронштадтский район', FALSE, 140),
  ('Курортный район', FALSE, 150),
  ('Московский район', FALSE, 160),
  ('Невский район', FALSE, 170),
  ('Петроградский район', FALSE, 180),
  ('Петродворцовый район', FALSE, 190),
  ('Приморский район', FALSE, 200),
  ('Пушкинский район', FALSE, 210),
  ('Фрунзенский район', FALSE, 220),
  ('Центральный район', FALSE, 230),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '78'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 79: Еврейская автономная область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Биробиджан', TRUE, 10),
  ('Биробиджанский район', FALSE, 20),
  ('Ленинский район', FALSE, 30),
  ('Облученский район', FALSE, 40),
  ('Октябрьский район', FALSE, 50),
  ('Смидовичский район', FALSE, 60),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '79'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 80: Донецкая Народная Республика
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Горловка', TRUE, 10),
  ('город Дебальцево', TRUE, 20),
  ('город Докучаевск', TRUE, 30),
  ('город Донецк', TRUE, 40),
  ('город Енакиево', TRUE, 50),
  ('город Ждановка', TRUE, 60),
  ('город Кировское', TRUE, 70),
  ('город Макеевка', TRUE, 80),
  ('город Мариуполь', TRUE, 90),
  ('город Снежное', TRUE, 100),
  ('город Торез', TRUE, 110),
  ('город Харцызск', TRUE, 120),
  ('город Шахтёрск', TRUE, 130),
  ('город Ясиноватая', TRUE, 140),
  ('Амвросиевский район', FALSE, 150),
  ('Волновахский район', FALSE, 160),
  ('Володарский район', FALSE, 170),
  ('Мангушский район', FALSE, 180),
  ('Новоазовский район', FALSE, 190),
  ('Старобешевский район', FALSE, 200),
  ('Тельмановский район', FALSE, 210),
  ('Шахтёрский район', FALSE, 220),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '80'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 81: Луганская Народная Республика
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Алчевск', TRUE, 10),
  ('город Антрацит', TRUE, 20),
  ('город Брянка', TRUE, 30),
  ('город Кировск', TRUE, 40),
  ('город Краснодон', TRUE, 50),
  ('город Красный Луч', TRUE, 60),
  ('город Луганск', TRUE, 70),
  ('город Первомайск', TRUE, 80),
  ('город Ровеньки', TRUE, 90),
  ('город Рубежное', TRUE, 100),
  ('город Свердловск', TRUE, 110),
  ('город Северодонецк', TRUE, 120),
  ('город Стаханов', TRUE, 130),
  ('Беловодский район', FALSE, 140),
  ('Белокуракинский район', FALSE, 150),
  ('Краснодонский район', FALSE, 160),
  ('Кременской район', FALSE, 170),
  ('Лутугинский район', FALSE, 180),
  ('Марковский район', FALSE, 190),
  ('Меловский район', FALSE, 200),
  ('Новоайдарский район', FALSE, 210),
  ('Новопсковский район', FALSE, 220),
  ('Перевальский район', FALSE, 230),
  ('Попаснянский район', FALSE, 240),
  ('Сватовский район', FALSE, 250),
  ('Славяносербский район', FALSE, 260),
  ('Станично-Луганский район', FALSE, 270),
  ('Старобельский район', FALSE, 280),
  ('Троицкий район', FALSE, 290),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '81'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 83: Ненецкий автономный округ
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Нарьян-Мар', TRUE, 10),
  ('Заполярный район', FALSE, 20),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '83'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 84: Запорожская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Бердянск', TRUE, 10),
  ('город Мелитополь', TRUE, 20),
  ('город Энергодар', TRUE, 30),
  ('Акимовский район', FALSE, 40),
  ('Бердянский район', FALSE, 50),
  ('Васильевский район', FALSE, 60),
  ('Весёловский район', FALSE, 70),
  ('Каменско-Днепровский район', FALSE, 80),
  ('Куйбышевский район', FALSE, 90),
  ('Мелитопольский район', FALSE, 100),
  ('Михайловский район', FALSE, 110),
  ('Пологовский район', FALSE, 120),
  ('Приазовский район', FALSE, 130),
  ('Приморский район', FALSE, 140),
  ('Токмакский район', FALSE, 150),
  ('Черниговский район', FALSE, 160),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '84'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 85: Херсонская область
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Геническ', TRUE, 10),
  ('город Новая Каховка', TRUE, 20),
  ('город Скадовск', TRUE, 30),
  ('Алешкинский район', FALSE, 40),
  ('Белозёрский район', FALSE, 50),
  ('Великоалександровский район', FALSE, 60),
  ('Великолепетихский район', FALSE, 70),
  ('Верхнерогачикский район', FALSE, 80),
  ('Высокопольский район', FALSE, 90),
  ('Генический район', FALSE, 100),
  ('Голопристанский район', FALSE, 110),
  ('Горностаевский район', FALSE, 120),
  ('Ивановский район', FALSE, 130),
  ('Каланчакский район', FALSE, 140),
  ('Каховский район', FALSE, 150),
  ('Нижнесерогозский район', FALSE, 160),
  ('Нововоронцовский район', FALSE, 170),
  ('Новотроицкий район', FALSE, 180),
  ('Скадовский район', FALSE, 190),
  ('Чаплинский район', FALSE, 200),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '85'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 86: Ханты-Мансийский автономный округ — Югра
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Когалым', TRUE, 10),
  ('город Лангепас', TRUE, 20),
  ('город Мегион', TRUE, 30),
  ('город Нефтеюганск', TRUE, 40),
  ('город Нижневартовск', TRUE, 50),
  ('город Нягань', TRUE, 60),
  ('город Покачи', TRUE, 70),
  ('город Пыть-Ях', TRUE, 80),
  ('город Радужный', TRUE, 90),
  ('город Сургут', TRUE, 100),
  ('город Урай', TRUE, 110),
  ('город Ханты-Мансийск', TRUE, 120),
  ('город Югорск', TRUE, 130),
  ('Белоярский район', FALSE, 140),
  ('Берёзовский район', FALSE, 150),
  ('Кондинский район', FALSE, 160),
  ('Нефтеюганский район', FALSE, 170),
  ('Нижневартовский район', FALSE, 180),
  ('Октябрьский район', FALSE, 190),
  ('Советский район', FALSE, 200),
  ('Сургутский район', FALSE, 210),
  ('Ханты-Мансийский район', FALSE, 220),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '86'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 87: Чукотский автономный округ
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Анадырь', TRUE, 10),
  ('город Певек', TRUE, 20),
  ('город Эгвекинот', TRUE, 30),
  ('Анадырский район', FALSE, 40),
  ('Билибинский район', FALSE, 50),
  ('Провиденский городской округ', FALSE, 60),
  ('Чукотский район', FALSE, 70),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '87'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 89: Ямало-Ненецкий автономный округ
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Губкинский', TRUE, 10),
  ('город Лабытнанги', TRUE, 20),
  ('город Муравленко', TRUE, 30),
  ('город Новый Уренгой', TRUE, 40),
  ('город Ноябрьск', TRUE, 50),
  ('город Салехард', TRUE, 60),
  ('Красноселькупский район', FALSE, 70),
  ('Надымский район', FALSE, 80),
  ('Приуральский район', FALSE, 90),
  ('Пуровский район', FALSE, 100),
  ('Тазовский район', FALSE, 110),
  ('Шурышкарский район', FALSE, 120),
  ('Ямальский район', FALSE, 130),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '89'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 91: Республика Крым
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Алушта', TRUE, 10),
  ('город Армянск', TRUE, 20),
  ('город Джанкой', TRUE, 30),
  ('город Евпатория', TRUE, 40),
  ('город Керчь', TRUE, 50),
  ('город Красноперекопск', TRUE, 60),
  ('город Саки', TRUE, 70),
  ('город Симферополь', TRUE, 80),
  ('город Судак', TRUE, 90),
  ('город Феодосия', TRUE, 100),
  ('город Ялта', TRUE, 110),
  ('Бахчисарайский район', FALSE, 120),
  ('Белогорский район', FALSE, 130),
  ('Джанкойский район', FALSE, 140),
  ('Кировский район', FALSE, 150),
  ('Красногвардейский район', FALSE, 160),
  ('Красноперекопский район', FALSE, 170),
  ('Ленинский район', FALSE, 180),
  ('Нижнегорский район', FALSE, 190),
  ('Первомайский район', FALSE, 200),
  ('Раздольненский район', FALSE, 210),
  ('Сакский район', FALSE, 220),
  ('Симферопольский район', FALSE, 230),
  ('Советский район', FALSE, 240),
  ('Черноморский район', FALSE, 250),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '91'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Region 92: Севастополь
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT r.id, v.name, v.is_city, v.sort, TRUE
FROM asmt_regions r,
(VALUES
  ('город Инкерман', TRUE, 10),
  ('Андреевский муниципальный округ', FALSE, 20),
  ('Балаклавский муниципальный округ', FALSE, 30),
  ('Верхнесадовский муниципальный округ', FALSE, 40),
  ('Гагаринский муниципальный округ', FALSE, 50),
  ('Качинский муниципальный округ', FALSE, 60),
  ('Ленинский муниципальный округ', FALSE, 70),
  ('Нахимовский муниципальный округ', FALSE, 80),
  ('Орлиновский муниципальный округ', FALSE, 90),
  ('Терновский муниципальный округ', FALSE, 100),
  ('Иное', FALSE, 999)
) AS v(name, is_city, sort)
WHERE r.code = '92'
ON CONFLICT (region_id, name) WHERE region_id IS NOT NULL DO UPDATE
SET is_separate_city = EXCLUDED.is_separate_city,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- 4. Global fallback for Иное (region_id NULL)
INSERT INTO asmt_districts (region_id, name, is_separate_city, sort_order, is_active)
SELECT NULL, 'Иное', FALSE, 999, TRUE
WHERE NOT EXISTS (SELECT 1 FROM asmt_districts WHERE region_id IS NULL AND name = 'Иное');

COMMIT;
