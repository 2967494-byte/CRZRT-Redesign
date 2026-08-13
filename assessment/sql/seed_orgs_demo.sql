-- Demo 3-level organization directory + region banner (idempotent-ish)

INSERT INTO asmt_region_banners (region_id, title, body, link_url, is_active, sort_order)
SELECT r.id,
       'Аттестационная кампания 2026',
       'Приглашаем специалистов Республики Татарстан пройти ежегодное профессиональное тестирование для подтверждения квалификации в сфере закупок.',
       NULL,
       TRUE,
       10
FROM asmt_regions r
WHERE r.code = '16'
  AND NOT EXISTS (
      SELECT 1 FROM asmt_region_banners b
      WHERE b.region_id = r.id AND b.title = 'Аттестационная кампания 2026'
  );

-- Level 1
INSERT INTO asmt_organizations (parent_id, level, name, inn, customer_level, status)
SELECT NULL, 1, 'Министерство образования и науки Республики Татарстан', NULL, 'state', 'approved'
WHERE NOT EXISTS (
    SELECT 1 FROM asmt_organizations WHERE level = 1 AND name = 'Министерство образования и науки Республики Татарстан'
);

INSERT INTO asmt_organizations (parent_id, level, name, inn, customer_level, status)
SELECT NULL, 1, 'Министерство здравоохранения Республики Татарстан', NULL, 'state', 'approved'
WHERE NOT EXISTS (
    SELECT 1 FROM asmt_organizations WHERE level = 1 AND name = 'Министерство здравоохранения Республики Татарстан'
);

-- Level 2 under education ministry
INSERT INTO asmt_organizations (parent_id, level, name, inn, customer_level, status)
SELECT p.id, 2, 'Альметьевский муниципальный район', NULL, 'municipal', 'approved'
FROM asmt_organizations p
WHERE p.level = 1 AND p.name = 'Министерство образования и науки Республики Татарстан'
  AND NOT EXISTS (
      SELECT 1 FROM asmt_organizations WHERE level = 2 AND name = 'Альметьевский муниципальный район'
  );

INSERT INTO asmt_organizations (parent_id, level, name, inn, customer_level, status)
SELECT p.id, 2, 'город Казань', NULL, 'municipal', 'approved'
FROM asmt_organizations p
WHERE p.level = 1 AND p.name = 'Министерство образования и науки Республики Татарстан'
  AND NOT EXISTS (
      SELECT 1 FROM asmt_organizations WHERE level = 2 AND name = 'город Казань' AND parent_id = p.id
  );

INSERT INTO asmt_organizations (parent_id, level, name, inn, customer_level, status)
SELECT p.id, 2, 'Нижнекамский муниципальный район', NULL, 'municipal', 'approved'
FROM asmt_organizations p
WHERE p.level = 1 AND p.name = 'Министерство здравоохранения Республики Татарстан'
  AND NOT EXISTS (
      SELECT 1 FROM asmt_organizations WHERE level = 2 AND name = 'Нижнекамский муниципальный район'
  );

-- Level 3 legal entities (demo INNs)
INSERT INTO asmt_organizations (parent_id, level, name, inn, customer_level, status)
SELECT p.id, 3, 'МБОУ «Средняя общеобразовательная школа №1» г. Альметьевск', '1644010001', 'municipal', 'approved'
FROM asmt_organizations p
WHERE p.level = 2 AND p.name = 'Альметьевский муниципальный район'
  AND NOT EXISTS (SELECT 1 FROM asmt_organizations WHERE inn = '1644010001');

INSERT INTO asmt_organizations (parent_id, level, name, inn, customer_level, status)
SELECT p.id, 3, 'МБОУ «Гимназия №3» г. Казань', '1655010002', 'municipal', 'approved'
FROM asmt_organizations p
WHERE p.level = 2 AND p.name = 'город Казань'
  AND NOT EXISTS (SELECT 1 FROM asmt_organizations WHERE inn = '1655010002');

INSERT INTO asmt_organizations (parent_id, level, name, inn, customer_level, status)
SELECT p.id, 3, 'ГАУЗ «Нижнекамская ЦРБ»', '1652010003', 'municipal', 'approved'
FROM asmt_organizations p
WHERE p.level = 2 AND p.name = 'Нижнекамский муниципальный район'
  AND NOT EXISTS (SELECT 1 FROM asmt_organizations WHERE inn = '1652010003');
