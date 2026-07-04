<?php
/**
 * Скопируйте в bitrix-config.local.php и укажите webhook из Bitrix24.
 * Файл в .gitignore — его нужно вручную залить на боевой сервер в api/.
 * Альтернатива: переменная окружения BITRIX_WEBHOOK_LEAD_ADD на сервере.
 *
 * Права входящего webhook:
 * - crm (crm.lead.add) — обязательно;
 * - lists (lists.element.add) — чтобы курс появлялся в каталоге «На какой курс заявка».
 */
return [
    'webhook_lead_add' => 'https://YOUR_PORTAL.bitrix24.ru/rest/USER_ID/WEBHOOK_KEY/crm.lead.add.json',

    // Каталог курсов в Bitrix24 (список для поля UF_CRM_1668839163).
    'course_catalog_iblock_id' => 24,
    'course_catalog_iblock_type' => 'lists',
];
