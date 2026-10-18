<?php
$html = '<div class="course-widget-item" data-course-start-time-widget>
  <div class="course-widget-item__icon">
    <svg><circle></circle></svg>
  </div>
  <div class="course-widget-item__text">
    <span class="course-widget-item__label">Время начала</span>
    <span class="course-widget-item__val">—</span>
  </div>
</div>';

$replaced = preg_replace(
    '/\s*<div\s+class="course-widget-item"[^>]*\bdata-course-start-time-widget\b[^>]*>\s*'
    . '<div class="course-widget-item__icon">.*?<\/div>\s*'
    . '<div class="course-widget-item__text">.*?<\/div>\s*'
    . '<\/div>\s*/s',
    "\n",
    $html,
    1
);
echo "=== RESULT ===\n" . $replaced . "\n=== END ===\n";
