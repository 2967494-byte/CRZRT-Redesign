(function () {
  var MONTH_NAMES = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  /** Дни с курсами: ключ «год-месяц» (месяц 1–12) → массив чисел */
  var COURSE_DAYS_BY_MONTH = {};
  var COURSE_REGISTRY = [];

  function setCourseDays(map) {
    if (!map || typeof map !== 'object') return;
    COURSE_DAYS_BY_MONTH = {};
    Object.keys(map).forEach(function (key) {
      var days = map[key];
      if (!Array.isArray(days)) return;
      var normalized = days
        .map(function (day) { return parseInt(day, 10); })
        .filter(function (day) { return day >= 1 && day <= 31; });
      if (normalized.length) COURSE_DAYS_BY_MONTH[key] = normalized;
    });
    render();
  }

  var root = document.getElementById('obuchenieCourseCalendar');
  if (!root) return;

  var monthLabel = root.querySelector('[data-calendar-month-label]');
  var grid = root.querySelector('[data-calendar-grid]');
  var prevBtn = root.querySelector('[data-calendar-prev]');
  var nextBtn = root.querySelector('[data-calendar-next]');

  if (!monthLabel || !grid || !prevBtn || !nextBtn) return;

  var viewDate = new Date();
  viewDate.setDate(1);

  function monthKey(year, monthIndex) {
    return year + '-' + (monthIndex + 1);
  }

  function getCourseDays(year, monthIndex) {
    return COURSE_DAYS_BY_MONTH[monthKey(year, monthIndex)] || [];
  }

  function getMondayBasedOffset(year, monthIndex) {
    var day = new Date(year, monthIndex, 1).getDay();
    return (day + 6) % 7;
  }

  function formatMonthLabel(year, monthIndex) {
    return MONTH_NAMES[monthIndex] + ' ' + year;
  }

  function render() {
    var year = viewDate.getFullYear();
    var monthIndex = viewDate.getMonth();
    var daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    var offset = getMondayBasedOffset(year, monthIndex);
    var courseDays = getCourseDays(year, monthIndex);
    var label = formatMonthLabel(year, monthIndex);

    monthLabel.textContent = label;
    grid.setAttribute('aria-label', label);
    grid.innerHTML = '';

    var cellIndex = 0;

    for (var i = 0; i < offset; i += 1) {
      var empty = document.createElement('span');
      empty.className = 'obuchenie-calendar-day obuchenie-calendar-day--empty';
      empty.setAttribute('aria-hidden', 'true');
      grid.appendChild(empty);
      cellIndex += 1;
    }

    var today = new Date();
    var todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    for (var day = 1; day <= daysInMonth; day += 1) {
      var cell = document.createElement('span');
      cell.className = 'obuchenie-calendar-day';
      cell.setAttribute('role', 'gridcell');
      cell.textContent = String(day);

      if (year === todayZero.getFullYear() && monthIndex === todayZero.getMonth() && day === todayZero.getDate()) {
        cell.classList.add('obuchenie-calendar-day--today');
      }

      if (courseDays.indexOf(day) !== -1) {
        var cellDate = new Date(year, monthIndex, day);
        if (cellDate < todayZero) {
          cell.classList.add('obuchenie-calendar-day--active', 'obuchenie-calendar-day--past');
        } else {
          cell.classList.add('obuchenie-calendar-day--active');
        }

        (function(d) {
          cell.style.cursor = 'pointer';
          cell.addEventListener('click', function(e) {
            openCalendarModal(year, monthIndex, d);
          });
        })(day);
      }

      grid.appendChild(cell);
      cellIndex += 1;
    }

    while (cellIndex < 42) {
      var trailing = document.createElement('span');
      trailing.className = 'obuchenie-calendar-day obuchenie-calendar-day--empty';
      trailing.setAttribute('aria-hidden', 'true');
      grid.appendChild(trailing);
      cellIndex += 1;
    }
  }

  prevBtn.addEventListener('click', function () {
    viewDate.setMonth(viewDate.getMonth() - 1);
    render();
  });

  nextBtn.addEventListener('click', function () {
    viewDate.setMonth(viewDate.getMonth() + 1);
    render();
  });

  render();

  document.addEventListener('obuchenieContentReady', function (ev) {
    var days = ev.detail && ev.detail.calendar && ev.detail.calendar.courseDaysByMonth;
    if (days) setCourseDays(days);

    if (ev.detail && ev.detail.courseRegistry) {
      COURSE_REGISTRY = ev.detail.courseRegistry;
    }
  });

  function openCalendarModal(year, monthIndex, day) {
    var modal = document.getElementById('calendar-course-modal');
    if (!modal) return;
    
    var dateLabel = document.getElementById('calendar-modal-date-label');
    var coursesContainer = document.getElementById('calendar-modal-courses');
    var priceContainer = document.getElementById('calendar-modal-price');
    var actionContainer = document.getElementById('calendar-modal-action');
    
    if (dateLabel) {
      dateLabel.textContent = day + ' ' + MONTH_NAMES_GENITIVE[monthIndex] + ' ' + year;
    }
    if (priceContainer) priceContainer.innerHTML = '';
    if (actionContainer) actionContainer.innerHTML = '';
    
    if (coursesContainer) {
      coursesContainer.innerHTML = '';
      
      var targetDate = new Date(year, monthIndex, day);
      
      var coursesOnDate = COURSE_REGISTRY.filter(function(course) {
        if (!course.active) return false;
        if (!course.dateFrom) return false;
        
        var parts = course.dateFrom.split('-');
        if (parts.length !== 3) return false;
        var start = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        
        return targetDate.getTime() === start.getTime();
      });
      
      if (coursesOnDate.length === 0) {
        coursesContainer.innerHTML = '<p>На эту дату курсов не найдено.</p>';
      } else {
        coursesOnDate.forEach(function(course) {
          var div = document.createElement('div');
          div.className = 'calendar-modal__course';
          
          var titleContainer = document.createElement('div');
          titleContainer.style.display = 'flex';
          titleContainer.style.alignItems = 'center';
          titleContainer.style.gap = '12px';
          titleContainer.style.marginBottom = '16px';
          
          if (course.format) {
            var formatPill = document.createElement('span');
            var isDist = course.format === 'dist';
            formatPill.textContent = isDist ? 'Дистанционно' : 'Очно';
            formatPill.style.padding = '4px 12px';
            formatPill.style.borderRadius = '20px';
            formatPill.style.fontSize = '0.85rem';
            formatPill.style.fontWeight = '500';
            if (isDist) {
              formatPill.style.backgroundColor = 'rgba(0, 174, 77, 0.1)';
              formatPill.style.color = '#00AE4D';
              formatPill.style.border = '1px solid #00AE4D';
            } else {
              formatPill.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
              formatPill.style.color = '#2196F3';
              formatPill.style.border = '1px solid #2196F3';
            }
            titleContainer.appendChild(formatPill);
          }

          var title = document.createElement('h4');
          title.className = 'calendar-modal__course-title';
          title.textContent = course.title || 'Курс';
          title.style.margin = '0';
          
          titleContainer.appendChild(title);
          
          var descContainer = document.createElement('div');
          descContainer.className = 'calendar-modal__course-desc-container';
          
          if (Array.isArray(course.description)) {
            course.description.forEach(function(block) {
              if (block.title) {
                var blockTitle = document.createElement('strong');
                blockTitle.className = 'calendar-modal__course-desc-title';
                blockTitle.textContent = block.title;
                blockTitle.style.display = 'block';
                blockTitle.style.marginTop = '12px';
                blockTitle.style.marginBottom = '4px';
                descContainer.appendChild(blockTitle);
              }
              if (block.text) {
                var blockText = document.createElement('p');
                blockText.className = 'calendar-modal__course-desc';
                blockText.textContent = block.text;
                descContainer.appendChild(blockText);
              }
            });
          } else if (typeof course.description === 'string' && course.description.trim()) {
            var desc = document.createElement('div');
            desc.className = 'calendar-modal__course-desc';
            desc.innerHTML = course.description;
            descContainer.appendChild(desc);
          }
          
          var meta = document.createElement('div');
          meta.className = 'calendar-modal__course-meta';
          
          if (course.price) {
            var price = document.createElement('span');
            price.className = 'calendar-modal__course-price';
            price.textContent = course.price;
            
            if (coursesOnDate.length === 1 && priceContainer) {
              priceContainer.textContent = course.price;
            } else {
              meta.appendChild(price);
            }
          }
          
          var enrollBtn = document.createElement('button');
          enrollBtn.type = 'button';
          enrollBtn.className = 'btn btn--green';
          enrollBtn.style.marginTop = '16px';
          enrollBtn.style.display = 'inline-flex';
          enrollBtn.style.backgroundColor = '#00AE4D';
          enrollBtn.style.color = '#FFFFFF';
          enrollBtn.style.textDecoration = 'none';
          enrollBtn.style.border = 'none';
          enrollBtn.style.cursor = 'pointer';
          enrollBtn.textContent = 'Записаться';
          enrollBtn.setAttribute('data-action', 'enroll');
          enrollBtn.setAttribute('data-course-id', course.id || '');
          enrollBtn.setAttribute('data-title', course.title || 'Курс');
          enrollBtn.setAttribute('data-date', day + ' ' + MONTH_NAMES_GENITIVE[monthIndex] + ' ' + year);
          enrollBtn.setAttribute('data-for-individuals', course.forIndividuals !== false ? 'true' : 'false');
          enrollBtn.setAttribute('data-for-legal', course.forLegalEntities !== false ? 'true' : 'false');
          
          div.appendChild(titleContainer);
          div.appendChild(descContainer);
          if (meta.hasChildNodes()) div.appendChild(meta);
          
          if (coursesOnDate.length === 1 && actionContainer) {
            enrollBtn.style.marginTop = '0';
            actionContainer.appendChild(enrollBtn);
          } else {
            div.appendChild(enrollBtn);
          }
          
          coursesContainer.appendChild(div);
        });
      }
    }
    
    modal.style.display = 'flex';
  }

  function setupModal() {
    var modal = document.getElementById('calendar-course-modal');
    var closeBtn = document.querySelector('.calendar-modal__close');
    var overlay = document.querySelector('.calendar-modal__overlay');
    
    if (!modal) return;
    
    function closeModal() {
      modal.style.display = 'none';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
  }
  
  setupModal();

  window.ObuchenieCalendar = { setCourseDays: setCourseDays };
})();
