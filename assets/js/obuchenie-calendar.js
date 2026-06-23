(function () {
  var MONTH_NAMES = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  /** Дни с курсами: ключ «год-месяц» (месяц 1–12) → массив чисел */
  var COURSE_DAYS_BY_MONTH = {};

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

      if (courseDays.indexOf(day) !== -1) {
        var cellDate = new Date(year, monthIndex, day);
        if (cellDate < todayZero) {
          cell.classList.add('obuchenie-calendar-day--active', 'obuchenie-calendar-day--past');
        } else {
          cell.classList.add('obuchenie-calendar-day--active');
        }
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
  });

  window.ObuchenieCalendar = { setCourseDays: setCourseDays };
})();
