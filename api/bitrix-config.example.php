<?php
/**
 * Скопируйте в bitrix-config.local.php и укажите webhook из Bitrix24.
 * Файл в .gitignore — заливать на сервер вручную в api/.
 * URL webhook: базовый .../rest/USER/KEY/ или полный .../crm.lead.add.json
 * Альтернатива: переменная окружения BITRIX_WEBHOOK_LEAD_ADD на сервере.
 *
 * Права входящего webhook:
 * - crm (crm.lead.add) — обязательно;
 * - catalog (catalog.product.add) — чтобы курс появлялся в товарном каталоге «На какой курс заявка» (iblock 24).
 */
return [
    'webhook_lead_add' => 'https://YOUR_PORTAL.bitrix24.ru/rest/USER_ID/WEBHOOK_KEY/crm.lead.add.json',

    // Товарный каталог курсов в Bitrix24 (поле UF_CRM_1668839163). API: catalog.product.*
    'course_catalog_iblock_id' => 24,
    'course_catalog_iblock_type' => 'lists',
];
