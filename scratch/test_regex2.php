<?php
$html = '
        <div class="course-hero__widget">
          <div class="course-widget-item">
            <div class="course-widget-item__icon"><svg></svg></div>
            <div class="course-widget-item__text">
              <span class="course-widget-item__label">Длительность</span>
              <span class="course-widget-item__val">120 ак. часов</span>
            </div>
          </div>
          <div class="course-widget-item">
            <div class="course-widget-item__icon"><svg></svg></div>
            <div class="course-widget-item__text">
              <span class="course-widget-item__label">Ближайший старт</span>
              <span class="course-widget-item__val">22 июля</span>
            </div>
          </div>
          <div class="course-widget-item" data-course-start-time-widget>
            <div class="course-widget-item__icon"><svg></svg></div>
            <div class="course-widget-item__text">
              <span class="course-widget-item__label">Время начала</span>
              <span class="course-widget-item__val">—</span>
            </div>
          </div>
          <div class="course-widget-item">
            <div class="course-widget-item__icon"><svg></svg></div>
            <div class="course-widget-item__text">
              <span class="course-widget-item__label">Стоимость</span>
              <span class="course-widget-item__val course-widget-item__price">13 500 ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
';

$result = preg_replace(
    '/\s*<div\s+class="course-widget-item"[^>]*\bdata-course-start-time-widget\b[^>]*>\s*'
    . '<div class="course-widget-item__icon">.*?<\/div>\s*'
    . '<div class="course-widget-item__text">.*?<\/div>\s*'
    . '<\/div>\s*/s',
    "\n",
    $html,
    1
);
echo $result;
