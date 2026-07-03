<?php
/**
 * Скопируйте в bitrix-config.local.php и укажите webhook из Bitrix24.
 * Файл в .gitignore — его нужно вручную залить на боевой сервер в api/.
 * Альтернатива: переменная окружения BITRIX_WEBHOOK_LEAD_ADD на сервере.
 * Права webhook: crm (crm.lead.add).
 */
return [
    'webhook_lead_add' => 'https://YOUR_PORTAL.bitrix24.ru/rest/USER_ID/WEBHOOK_KEY/crm.lead.add.json',
];
