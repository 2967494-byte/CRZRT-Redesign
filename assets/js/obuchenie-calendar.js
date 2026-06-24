(function () {
  var MONTH_NAMES = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  var MONTH_NAMES_GENITIVE = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
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

  function formatCourseDateLabel(course) {
    if (!course || !course.dateFrom) return '';
    var parts = course.dateFrom.split('-');
    if (parts.length !== 3) return '';
    var year = parseInt(parts[0], 10);
    var monthIndex = parseInt(parts[1], 10) - 1;
    var day = parseInt(parts[2], 10);
    if (!year || monthIndex < 0 || monthIndex > 11 || !day) return '';
    return day + ' ' + MONTH_NAMES_GENITIVE[monthIndex] + ' ' + year;
  }

  function createFormatPill(course) {
    if (!course.format) return null;
    var pill = document.createElement('span');
    var isDist = course.format === 'dist';
    pill.textContent = isDist ? 'Дистанционно' : 'Очно';
    pill.className = 'calendar-modal__format-pill' + (isDist ? ' calendar-modal__format-pill--dist' : ' calendar-modal__format-pill--och');
    return pill;
  }

  function createEnrollButton(course, dateLabel) {
    var enrollBtn = document.createElement('button');
    enrollBtn.type = 'button';
    enrollBtn.className = 'btn btn--green calendar-modal__header-enroll';
    enrollBtn.textContent = 'Записаться';
    enrollBtn.setAttribute('data-action', 'enroll');
    enrollBtn.setAttribute('data-course-id', course.id || '');
    enrollBtn.setAttribute('data-title', course.title || 'Курс');
    enrollBtn.setAttribute('data-date', dateLabel || formatCourseDateLabel(course));
    enrollBtn.setAttribute('data-for-individuals', course.forIndividuals !== false ? 'true' : 'false');
    enrollBtn.setAttribute('data-for-legal', course.forLegalEntities !== false ? 'true' : 'false');
    return enrollBtn;
  }

  function appendCourseDescription(course, container) {
    if (Array.isArray(course.description)) {
      course.description.forEach(function (block) {
        if (block.title) {
          var blockTitle = document.createElement('strong');
          blockTitle.className = 'calendar-modal__course-desc-title';
          blockTitle.textContent = block.title;
          container.appendChild(blockTitle);
        }
        if (block.text) {
          var blockText = document.createElement('p');
          blockText.className = 'calendar-modal__course-desc';
          blockText.textContent = block.text;
          container.appendChild(blockText);
        }
      });
      return;
    }

    if (typeof course.description === 'string' && course.description.trim()) {
      var desc = document.createElement('div');
      desc.className = 'calendar-modal__course-desc';
      desc.innerHTML = course.description;
      container.appendChild(desc);
    }
  }

  function renderCoursesInModal(courses, dateLabel) {
    var coursesContainer = document.getElementById('calendar-modal-courses');
    var priceContainer = document.getElementById('calendar-modal-price');
    var actionContainer = document.getElementById('calendar-modal-action');
    var formatContainer = document.getElementById('calendar-modal-format');
    var dateLabelEl = document.getElementById('calendar-modal-date-label');

    if (dateLabelEl) dateLabelEl.textContent = dateLabel || '';
    if (priceContainer) priceContainer.innerHTML = '';
    if (actionContainer) actionContainer.innerHTML = '';
    if (formatContainer) formatContainer.innerHTML = '';
    if (!coursesContainer) return;

    coursesContainer.innerHTML = '';

    if (!courses.length) {
      coursesContainer.innerHTML = '<p>На эту дату курсов не найдено.</p>';
      return;
    }

    var isSingle = courses.length === 1;

    courses.forEach(function (course) {
      var div = document.createElement('div');
      div.className = 'calendar-modal__course';

      var titleContainer = document.createElement('div');
      titleContainer.className = 'calendar-modal__course-head';

      var formatPill = createFormatPill(course);
      if (formatPill) {
        if (isSingle && formatContainer) {
          formatContainer.appendChild(formatPill);
        } else {
          titleContainer.appendChild(formatPill);
        }
      }

      var title = document.createElement('h4');
      title.className = 'calendar-modal__course-title';
      title.textContent = course.title || 'Курс';

      if (isSingle && formatContainer) {
        title.className += ' calendar-modal__course-title--single';
        div.appendChild(title);
      } else {
        titleContainer.appendChild(title);
        div.appendChild(titleContainer);
      }

      var descContainer = document.createElement('div');
      descContainer.className = 'calendar-modal__course-desc-container';
      appendCourseDescription(course, descContainer);

      var meta = document.createElement('div');
      meta.className = 'calendar-modal__course-meta';

      if (course.price) {
        if (isSingle && priceContainer) {
          priceContainer.textContent = course.price;
        } else {
          var price = document.createElement('span');
          price.className = 'calendar-modal__course-price';
          price.textContent = course.price;
          meta.appendChild(price);
        }
      }

      var enrollBtn = createEnrollButton(course, dateLabel);

      div.appendChild(descContainer);
      if (meta.hasChildNodes()) div.appendChild(meta);

      if (isSingle && actionContainer) {
        actionContainer.appendChild(enrollBtn);
      } else {
        enrollBtn.className = 'btn btn--green calendar-modal__enroll-btn';
        div.appendChild(enrollBtn);
      }

      coursesContainer.appendChild(div);
    });
  }

  function openCalendarModal(year, monthIndex, day) {
    var modal = document.getElementById('calendar-course-modal');
    if (!modal) return;

    var targetDate = new Date(year, monthIndex, day);
    var dateLabel = day + ' ' + MONTH_NAMES_GENITIVE[monthIndex] + ' ' + year;

    var coursesOnDate = COURSE_REGISTRY.filter(function (course) {
      if (!course.active) return false;
      if (!course.dateFrom) return false;

      var parts = course.dateFrom.split('-');
      if (parts.length !== 3) return false;
      var start = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

      return targetDate.getTime() === start.getTime();
    });

    renderCoursesInModal(coursesOnDate, dateLabel);
    modal.style.display = 'flex';
  }

  function openCourseDetailModal(course) {
    var modal = document.getElementById('calendar-course-modal');
    if (!modal || !course) return;

    renderCoursesInModal([course], formatCourseDateLabel(course));
    modal.style.display = 'flex';
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

        (function (d) {
          cell.style.cursor = 'pointer';
          cell.addEventListener('click', function () {
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

  function setupModal() {
    var modal = document.getElementById('calendar-course-modal');
    if (!modal) return;

    var closeBtn = modal.querySelector('.calendar-modal__close');
    var overlay = modal.querySelector('.calendar-modal__overlay');

    function closeModal() {
      modal.style.display = 'none';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
  }

  setupModal();

  window.ObuchenieCalendar = {
    setCourseDays: setCourseDays,
    openCourseDetailModal: openCourseDetailModal,
    openCalendarModal: openCalendarModal
  };

  // Expose globally for course-search.js
  window.openCalendarModal = openCalendarModal;
})();

