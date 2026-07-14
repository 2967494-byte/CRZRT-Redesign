<?php
// Р¤Р°Р№Р»: api/generate_courses.php
// Р­С‚РѕС‚ СЃРєСЂРёРїС‚ РіРµРЅРµСЂРёСЂСѓРµС‚ СЃС‚Р°С‚РёС‡РµСЃРєРёРµ HTML СЃС‚СЂР°РЅРёС†С‹ РґР»СЏ РєР°Р¶РґРѕРіРѕ РєСѓСЂСЃР°

function generate_static_courses($courseRegistry) {
    $templatePath = __DIR__ . '/../course-template.html';
    if (!file_exists($templatePath)) {
        return ['success' => false, 'error' => 'РЁР°Р±Р»РѕРЅ course-template.html РЅРµ РЅР°Р№РґРµРЅ'];
    }

    $template = file_get_contents($templatePath);
    $generatedFiles = [];

    foreach ($courseRegistry as $course) {
        if (empty($course['active'])) {
            continue; // РџСЂРѕРїСѓСЃРєР°РµРј РЅРµР°РєС‚РёРІРЅС‹Рµ
        }

        $html = $template;

        // 1. SEO С‚РµРіРё
        $title = htmlspecialchars($course['title'] ?? 'РљСѓСЂСЃ');
        $html = preg_replace('/<title>.*?<\/title>/', "<title>{$title}. Р¦РµРЅС‚СЂ СЂР°Р·РІРёС‚РёСЏ Р·Р°РєСѓРїРѕРє</title>", $html);
        $html = preg_replace('/<meta name="description" content=".*?">/', '<meta name="description" content="РџСЂРѕРіСЂР°РјРјР° РѕР±СѓС‡РµРЅРёСЏ: ' . $title . '">', $html);

        // 2. Хлебные крошки
        $html = preg_replace('/<span class="current">.*?<\/span>/s', '<span class="current">' . $title . '</span>', $html);

        // 3. Теги (Формат, Закон, Аудитория)
        $tagsHtml = '';
        if (!empty($course['format'])) {
            $tagsHtml .= '<span class="course-tag">' . htmlspecialchars($course['format']) . '</span>';
        }
        if (!empty($course['law'])) {
            $tagsHtml .= '<span class="course-tag">' . htmlspecialchars($course['law']) . '</span>';
        }
        if (!empty($course['targetAudience'])) {
            // Берем первую аудиторию для тега
            $audiences = explode("\n", $course['targetAudience']);
            $tagsHtml .= '<span class="course-tag course-tag--accent">' . htmlspecialchars(trim($audiences[0])) . '</span>';
        }
        $html = preg_replace('/<div class="course-hero__tags">.*?<\/div>/s', '<div class="course-hero__tags">' . $tagsHtml . '</div>', $html);

        // 4. Заголовок и описание (в Hero)
        $html = preg_replace('/<h1 class="course-hero__title">.*?<\/h1>/s', '<h1 class="course-hero__title">' . $title . '</h1>', $html);
        $desc = nl2br(htmlspecialchars($course['outcomes'] ?? $course['description'] ?? ''));
        $html = preg_replace('/<p class="course-hero__desc">.*?<\/p>/s', '<p class="course-hero__desc">' . $desc . '</p>', $html);

        // 5. Виджеты (Длительность, Дата, Цена)
        $duration = htmlspecialchars($course['duration'] ?? '');
        $date = htmlspecialchars($course['date'] ?? '');
        $price = htmlspecialchars($course['price'] ?? '');
        
        // Заменяем значения в виджетах. Это немного хрупко через регулярки, поэтому мы сделаем простую замену по порядку или уникальным классам.
        // Длительность
        $html = preg_replace('/<span class="course-widget-item__label">Р”Р»РёС‚РµР»СЊРЅРѕСЃС‚СЊ<\/span>.*?<span class="course-widget-item__val">.*?<\/span>/s', '<span class="course-widget-item__label">Длительность</span><span class="course-widget-item__val">' . $duration . '</span>', $html);
        // Дата
        $html = preg_replace('/<span class="course-widget-item__label">Р‘Р»РёР¶Р°Р№С€РёР№ СЃС‚Р°СЂС‚<\/span>.*?<span class="course-widget-item__val">.*?<\/span>/s', '<span class="course-widget-item__label">Ближайший старт</span><span class="course-widget-item__val">' . $date . '</span>', $html);
        // Цена
        $html = preg_replace('/<span class="course-widget-item__label">РЎС‚РѕРёРјРѕСЃС‚СЊ<\/span>.*?<span class="course-widget-item__val course-widget-item__price">.*?<\/span>/s', '<span class="course-widget-item__label">Стоимость</span><span class="course-widget-item__val course-widget-item__price">' . $price . '</span>', $html);

        // 6. О курсе
        $aboutText = nl2br(htmlspecialchars($course['description'] ?? ''));
        $html = preg_replace('/<div class="course-about__text">.*?<\/div>/s', '<div class="course-about__text"><p>' . $aboutText . '</p></div>', $html);

        // 6.5 Для кого (Целевая аудитория)
        $audienceHtml = '';
        if (!empty($course['targetAudience'])) {
            $audiences = array_filter(array_map('trim', explode("\n", $course['targetAudience'])));
            $icons = ['icon-programs.png', 'icon-corporate.png', 'icon-certificates.png'];
            $iconIdx = 0;
            foreach ($audiences as $aud) {
                // Если аудитория содержит дефис, попробуем разделить на заголовок и описание
                $parts = explode('-', $aud, 2);
                $audTitle = htmlspecialchars(trim($parts[0]));
                $audDesc = isset($parts[1]) ? htmlspecialchars(trim($parts[1])) : '';
                
                $icon = $icons[$iconIdx % count($icons)];
                $iconIdx++;
                
                $audienceHtml .= '<div class="audience-card">';
                $audienceHtml .= '<div class="audience-card__icon"><img src="assets/img/obuchenie/' . $icon . '" alt="" width="60"></div>';
                $audienceHtml .= '<h3 class="audience-card__title">' . $audTitle . '</h3>';
                if ($audDesc) {
                    $audienceHtml .= '<p class="audience-card__desc">' . $audDesc . '</p>';
                }
                $audienceHtml .= '</div>';
            }
        } else {
            $audienceHtml = '<p>Информация уточняется</p>';
        }
        $html = preg_replace('/<div class="course-audience__grid">.*?<\/div>\s*<\/div>\s*<\/section>/s', '<div class="course-audience__grid">' . $audienceHtml . '</div></div></section>', $html);

        // 7. Программа обучения (Конструктор)
        $programHtml = '';
        if (!empty($course['program']) && is_array($course['program'])) {
            foreach ($course['program'] as $module) {
                $moduleTitle = htmlspecialchars($module['title'] ?? '');
                $programHtml .= '<div class="course-accordion__item">';
                $programHtml .= '<button class="course-accordion__trigger">';
                $programHtml .= '<span class="course-accordion__title">' . $moduleTitle . '</span>';
                $programHtml .= '<span class="course-accordion__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span>';
                $programHtml .= '</button>';
                $programHtml .= '<div class="course-accordion__content">';
                $programHtml .= '<ul class="course-accordion__list">';
                if (!empty($module['items']) && is_array($module['items'])) {
                    foreach ($module['items'] as $item) {
                        $programHtml .= '<li>' . htmlspecialchars($item) . '</li>';
                    }
                }
                $programHtml .= '</ul></div></div>';
            }
        } else {
            $programHtml = '<p>Программа формируется.</p>';
        }
        $html = preg_replace('/<div class="course-accordion">.*?<\/div>\s*<\/div>\s*<\/section>/s', '<div class="course-accordion">' . $programHtml . '</div></div></section>', $html);

        // 8. Документ
        $docName = htmlspecialchars($course['documentType'] ?? 'Удостоверение о повышении квалификации');
        $html = preg_replace('/<strong>Удостоверение о повышении квалификации установленного образца<\/strong>/s', '<strong>' . $docName . '</strong>', $html);

        // 9. Сохранение файла
        $fileName = $course['id'] . '.html'; // e.g. course_17200000.html
        $filePath = __DIR__ . '/../' . $fileName;
        file_put_contents($filePath, $html);
        $generatedFiles[] = $fileName;
    }

    return ['success' => true, 'generated' => $generatedFiles];
}

// Если скрипт вызван напрямую (для тестов или ручного запуска)
if (basename(__FILE__) === basename($_SERVER['PHP_SELF'])) {
    require_once 'db.php';
    $stmt = $pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = 'crzrt_obuchenie_page_data'");
    $stmt->execute();
    $row = $stmt->fetch();
    if ($row) {
        $data = json_decode($row['setting_value'], true);
        if (isset($data['courseRegistry'])) {
            $result = generate_static_courses($data['courseRegistry']);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($result);
            exit;
        }
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => 'Нет данных курсов']);
}
?>
