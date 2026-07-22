<?php
// Р¤Р°Р№Р»: api/generate_courses.php
// Р­С‚РѕС‚ СЃРєСЂРёРїС‚ РіРµРЅРµСЂРёСЂСѓРµС‚ СЃС‚Р°С‚РёС‡РµСЃРєРёРµ HTML СЃС‚СЂР°РЅРёС†С‹ РґР»СЏ РєР°Р¶РґРѕРіРѕ РєСѓСЂСЃР°

function normalize_course_asset_url($url) {
    $url = trim((string)$url);
    if ($url === '') {
        return '';
    }
    $url = htmlspecialchars($url, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    if (preg_match('#^https?://#i', $url)) {
        return $url;
    }
    if (strpos($url, '../') === 0) {
        return $url;
    }
    if (strpos($url, 'uploads/') === 0) {
        return '../' . $url;
    }
    if (strpos($url, '/uploads/') === 0) {
        return '..' . $url;
    }
    return $url;
}

function build_course_program_pdf_link($url, $className, $label, $withDownloadAttr = false) {
    $normalized = normalize_course_asset_url($url);
    if ($normalized === '') {
        return '';
    }
    $downloadAttr = $withDownloadAttr ? ' download' : '';
    return '<a href="' . $normalized . '" target="_blank" rel="noopener noreferrer" class="' . $className . '"' . $downloadAttr . '>' . $label . '</a>';
}

function generate_static_courses($courseRegistry) {
    $templatePath = __DIR__ . '/../course-template.html';
    if (!file_exists($templatePath)) {
        return ['success' => false, 'error' => 'Шаблон course-template.html не найден'];
    }

    $template = file_get_contents($templatePath);
    $generatedFiles = [];

    foreach ($courseRegistry as $course) {
        if (empty($course['active'])) {
            continue; // РџСЂРѕРїСѓСЃРєР°РµРј РЅРµР°РєС‚РёРІРЅС‹Рµ
        }

        $html = $template;

        // 1. SEO С‚РµРіРё
        $title = htmlspecialchars($course['title'] ?? 'Курс');
        $html = preg_replace('/<title>.*?<\/title>/', "<title>{$title}. Центр развития закупок</title>", $html);
        $html = preg_replace('/<meta name="description" content=".*?">/', '<meta name="description" content="Программа обучения: ' . $title . '">', $html);

        // 2. Хлебные крошки
        $html = preg_replace('/<span class="current">.*?<\/span>/s', '<span class="current">' . $title . '</span>', $html);

        // 3. Теги (Формат, Закон, Аудитория)
        $tagsHtml = '';
        if (!empty($course['format'])) {
            $formatText = ($course['format'] === 'dist') ? 'Дистанционно' : (($course['format'] === 'och') ? 'Очно' : htmlspecialchars($course['format']));
            $tagsHtml .= '<span class="course-tag">' . $formatText . '</span>';
        }
        if (!empty($course['law'])) {
            $tagsHtml .= '<span class="course-tag">' . htmlspecialchars($course['law']) . '</span>';
        }
        if (!empty($course['targetAudience'])) {
            // Берем первую аудиторию для тега
            $audiences = is_array($course['targetAudience']) ? $course['targetAudience'] : explode("\n", $course['targetAudience']);
            if (!empty($audiences[0])) {
                $tagsHtml .= '<span class="course-tag course-tag--accent">' . htmlspecialchars(trim($audiences[0])) . '</span>';
            }
        }
        $html = preg_replace('/<div class="course-hero__tags">.*?<\/div>/s', '<div class="course-hero__tags">' . $tagsHtml . '</div>', $html);

        // 4. Заголовок и описание (в Hero)
        $html = preg_replace('/<h1 class="course-hero__title">.*?<\/h1>/s', '<h1 class="course-hero__title">' . $title . '</h1>', $html);
        $descOutcomes = is_array($course['outcomes'] ?? null) ? implode("\n", $course['outcomes']) : ($course['outcomes'] ?? '');
        $desc = nl2br($descOutcomes ?: ($course['description'] ?? ''));
        $html = preg_replace('/<p class="course-hero__desc">.*?<\/p>/s', '<p class="course-hero__desc">' . $desc . '</p>', $html);

        // 5. Виджеты (Длительность, Дата, Цена)
        $duration = '';
        if (!empty($course['duration'])) {
            $duration = $course['duration'];
        } elseif (!empty($course['durationDays'])) {
            $days = intval($course['durationDays']);
            $mod100 = $days % 100;
            $mod10 = $days % 10;
            if ($mod100 >= 11 && $mod100 <= 19) {
                $duration = $days . ' дней';
            } elseif ($mod10 == 1) {
                $duration = $days . ' день';
            } elseif ($mod10 >= 2 && $mod10 <= 4) {
                $duration = $days . ' дня';
            } else {
                $duration = $days . ' дней';
            }
        }
        $duration = htmlspecialchars($duration);

        $date = '';
        if (!empty($course['date'])) {
            $date = htmlspecialchars($course['date']);
        } elseif (!empty($course['dateFrom'])) {
            $months = [
                1 => 'января', 2 => 'февраля', 3 => 'марта', 4 => 'апреля',
                5 => 'мая', 6 => 'июня', 7 => 'июля', 8 => 'августа',
                9 => 'сентября', 10 => 'октября', 11 => 'ноября', 12 => 'декабря'
            ];
            $dateStrArr = explode(',', $course['dateFrom']);
            $formattedDates = [];
            foreach ($dateStrArr as $dStr) {
                $time = strtotime(trim($dStr));
                if ($time) {
                    $day = date('j', $time);
                    $monthNum = intval(date('n', $time));
                    $monthName = $months[$monthNum] ?? '';
                    $formattedDates[] = htmlspecialchars($day . ' ' . $monthName);
                }
            }
            if (!empty($formattedDates)) {
                $date = implode('<br>', $formattedDates);
            }
        }

        $price = htmlspecialchars($course['price'] ?? '');
        
        // Заменяем значения в виджетах.
        // Длительность
        $html = preg_replace('/<span class="course-widget-item__label">Длительность<\/span>.*?<span class="course-widget-item__val">.*?<\/span>/s', '<span class="course-widget-item__label">Длительность</span><span class="course-widget-item__val">' . $duration . '</span>', $html);
        // Дата
        $html = preg_replace('/<span class="course-widget-item__label">Ближайший старт<\/span>.*?<span class="course-widget-item__val">.*?<\/span>/s', '<span class="course-widget-item__label">Ближайший старт</span><span class="course-widget-item__val">' . $date . '</span>', $html);
        // Цена
        $html = preg_replace('/<span class="course-widget-item__label">Стоимость<\/span>.*?<span class="course-widget-item__val course-widget-item__price">.*?<\/span>/s', '<span class="course-widget-item__label">Стоимость</span><span class="course-widget-item__val course-widget-item__price">' . $price . '</span>', $html);

        // 6. О курсе
        $aboutText = nl2br($course['description'] ?? '');
        $html = preg_replace('/<div class="course-about__text">.*?<\/div>/s', '<div class="course-about__text">' . $aboutText . '</div>', $html);

        // 6.5 Для кого (Целевая аудитория)
        $audienceHtml = '';
        if (!empty($course['targetAudience'])) {
            $audiences = is_array($course['targetAudience']) ? array_filter(array_map('trim', $course['targetAudience'])) : array_filter(array_map('trim', explode("\n", $course['targetAudience'])));
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
        $heroPdfHtml = build_course_program_pdf_link(
            $course['programPdf'] ?? '',
            'btn btn--white-outline btn--large course-hero__download',
            'Скачать программу (PDF)',
            true
        );
        $html = preg_replace(
            '/<(?:button|a)[^>]*class="[^"]*course-hero__download[^"]*"[^>]*>.*?<\/(?:button|a)>/s',
            $heroPdfHtml,
            $html,
            1
        );
        $html = preg_replace(
            '/<button class="btn btn--white-outline btn--large">Скачать программу \(PDF\)<\/button>/s',
            $heroPdfHtml,
            $html,
            1
        );

        $pdfHtml = build_course_program_pdf_link(
            $course['programPdf'] ?? '',
            'course-program__download',
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Скачать PDF'
        );
        $html = preg_replace('/<a href="#" class="course-program__download">.*?<\/a>/s', $pdfHtml, $html);

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

        // 7.5 Эксперты
        $speakersHtml = '';
        if (!empty($course['speakers']) && is_array($course['speakers'])) {
            foreach ($course['speakers'] as $speaker) {
                $sName = htmlspecialchars($speaker['name'] ?? '');
                $sRole = htmlspecialchars($speaker['role'] ?? '');
                $sDesc = htmlspecialchars($speaker['desc'] ?? '');
                $sImg = htmlspecialchars($speaker['img'] ?? '');
                if (strpos($sImg, 'uploads/') === 0) {
                    $sImg = '../' . $sImg;
                }
                
                $imgHtml = '<div class="expert-card__img-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="#ADB8C6" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>';
                if ($sImg) {
                    $imgHtml = '<img src="' . $sImg . '" alt="' . $sName . '" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">';
                }
                
                $speakersHtml .= '<div class="expert-card">';
                $speakersHtml .= '<div class="expert-card__img-wrap">' . $imgHtml . '</div>';
                $speakersHtml .= '<h3 class="expert-card__name">' . $sName . '</h3>';
                if ($sRole) $speakersHtml .= '<p class="expert-card__role">' . $sRole . '</p>';
                if ($sDesc) $speakersHtml .= '<p class="expert-card__desc">' . $sDesc . '</p>';
                $speakersHtml .= '</div>';
            }
        } else {
            $speakersHtml = '<p style="color:var(--text-secondary);">Спикеры уточняются</p>';
        }
        $html = preg_replace('/<div class="course-experts__grid">.*?<\/div>\s*<\/div>\s*<\/section>/s', '<div class="course-experts__grid">' . $speakersHtml . '</div></div></section>', $html);

        // 8. Документ
        $docName = htmlspecialchars($course['documentType'] ?? 'Удостоверение о повышении квалификации');
        $html = preg_replace('/<strong>Удостоверение о повышении квалификации установленного образца<\/strong>/s', '<strong>' . $docName . '</strong>', $html);

        if (!empty($course['documentImage'])) {
            $docImg = htmlspecialchars($course['documentImage']);
            if (strpos($docImg, 'uploads/') === 0) {
                $docImg = '../' . $docImg;
            }
            $docImgHtml = '<img src="' . $docImg . '" alt="Образец документа" style="max-width:100%; height:auto; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.1);">';
            $html = preg_replace('/<div class="doc-placeholder">.*?<\/div>/s', $docImgHtml, $html);
        }

        // 9. Относительные пути (так как мы теперь в папке courses/)
        $html = preg_replace('/href="assets\//', 'href="../assets/', $html);
        $html = preg_replace('/src="assets\//', 'src="../assets/', $html);
        $html = preg_replace('/url\([\'"]?assets\//', 'url(\'../assets/', $html);
        // Ссылки на .html файлы в корне
        $html = preg_replace('/href="([^\\/:]+\.html)(#[^"]*)?"/', 'href="../$1$2"', $html);

        // 10. Сохранение файла
        $coursesDir = __DIR__ . '/../courses';
        if (!is_dir($coursesDir)) {
            mkdir($coursesDir, 0777, true);
        }
        $fileName = $course['id'] . '.html';
        $filePath = $coursesDir . '/' . $fileName;
        file_put_contents($filePath, $html);
        $generatedFiles[] = 'courses/' . $fileName;
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
