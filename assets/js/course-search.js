/**
 * course-search.js — Фильтрация курсов по параметрам поисковой панели
 * Зависит от: COURSE_REGISTRY (из obuchenie-content.js), openCalendarModal (из obuchenie-calendar.js)
 */
(function () {
  'use strict';

  var COURSE_REGISTRY = [];

  var MONTH_NAMES_GENITIVE = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  function formatDate(iso) {
    if (!iso) return '—';
    var p = iso.split('-');
    if (p.length !== 3) return iso;
    return p[2] + ' ' + MONTH_NAMES_GENITIVE[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }

  function hasActiveFilters() {
    var active = false;
    document.querySelectorAll('.csr-dropdown').forEach(function (dd) {
      if (dd.dataset.value) active = true;
    });
    return active;
  }

  // ─── Filter Logic ─────────────────────────────────────────────────────────────

  function filterCourses() {
    var activeFilters = [];
    document.querySelectorAll('.csr-dropdown').forEach(function (dd) {
      var val = dd.dataset.value;
      if (val) {
        activeFilters.push(val);
      }
    });

    return COURSE_REGISTRY.filter(function (c) {
      if (!c.active) return false;

      // Filter out past courses
      if (c.dateFrom) {
        var parts = c.dateFrom.split('-');
        if (parts.length === 3) {
          var courseDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          var today = new Date();
          today.setHours(0, 0, 0, 0);
          if (courseDate < today) return false;
        }
      }

      // Dynamic check for selected options
      for (var i = 0; i < activeFilters.length; i++) {
        var filterVal = activeFilters[i];
        if (!c.options || c.options.indexOf(filterVal) === -1) {
          return false;
        }
      }

      return true;
    });
  }

  // ─── Render Card ──────────────────────────────────────────────────────────────

  function renderCard(course) {
    var card = document.createElement('div');
    card.className = 'csr-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('data-course-id', course.id || '');

    var isDist = course.format === 'dist';

    // Badge
    var badge = document.createElement('span');
    badge.className = 'csr-card__badge ' + (isDist ? 'csr-card__badge--dist' : 'csr-card__badge--och');
    badge.textContent = isDist ? 'Дистанционно' : 'Очно';

    // Title
    var title = document.createElement('p');
    title.className = 'csr-card__title';
    title.textContent = course.title || 'Курс';

    // Meta
    var meta = document.createElement('div');
    meta.className = 'csr-card__meta';

    if (course.dateFrom) {
      var dateItem = document.createElement('span');
      dateItem.className = 'csr-card__meta-item csr-card__meta-item--date';
      dateItem.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
        '<span>' + formatDate(course.dateFrom) + '</span>';
      meta.appendChild(dateItem);
    }

    if (course.durationDays) {
      var durItem = document.createElement('span');
      durItem.className = 'csr-card__meta-item';
      durItem.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
        '<span>' + course.durationDays + ' дн.</span>';
      meta.appendChild(durItem);
    }

    // Footer: price + arrow
    var footer = document.createElement('div');
    footer.className = 'csr-card__footer';

    var price = document.createElement('span');
    price.className = 'csr-card__price';
    price.textContent = course.price || '';

    var arrow = document.createElement('span');
    arrow.className = 'csr-card__arrow';
    arrow.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>';

    footer.appendChild(price);
    footer.appendChild(arrow);

    card.appendChild(badge);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(footer);

    // Click → open existing calendar modal
    function openModal() {
      if (!course.dateFrom) return;
      var parts = course.dateFrom.split('-');
      if (parts.length !== 3) return;
      var year  = parseInt(parts[0], 10);
      var month = parseInt(parts[1], 10) - 1; // 0-based
      var day   = parseInt(parts[2], 10);

      if (typeof window.openCalendarModal === 'function') {
        window.openCalendarModal(year, month, day);
      }
    }

    card.addEventListener('click', openModal);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
    });

    return card;
  }

  // ─── Render Results ───────────────────────────────────────────────────────────

  function renderResults() {
    var wrapper = document.getElementById('course-search-results');
    var grid    = document.getElementById('course-search-grid');
    var count   = document.getElementById('course-search-count');

    if (!wrapper || !grid || !count) return;

    if (!hasActiveFilters()) {
      wrapper.hidden = true;
      return;
    }

    var results = filterCourses();
    grid.innerHTML = '';

    if (results.length === 0) {
      grid.innerHTML =
        '<div class="csr-no-results">' +
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
          '<p>По выбранным фильтрам курсы не найдены.<br>Попробуйте изменить параметры поиска.</p>' +
        '</div>';
    } else {
      results.forEach(function (c) {
        grid.appendChild(renderCard(c));
      });
    }

    count.textContent = results.length
      ? ('Найдено: ' + results.length + (results.length === 1 ? ' курс' : results.length < 5 ? ' курса' : ' курсов'))
      : '';

    wrapper.hidden = false;
  }

  // ─── Reset ────────────────────────────────────────────────────────────────────

  function resetFilters() {
    document.querySelectorAll('.csr-dropdown').forEach(function (dd) {
      dd.dataset.value = '';
      dd.classList.remove('has-value', 'is-open');
      var label = dd.querySelector('.csr-dropdown__label');
      var placeholder = dd.getAttribute('aria-label') || '';
      if (label) {
        // Restore original placeholder from data or aria-label
        var original = dd.getAttribute('data-placeholder');
        if (original) label.textContent = original;
      }
      dd.querySelectorAll('.csr-dropdown__option').forEach(function (o) {
        o.classList.remove('is-selected');
      });
    });

    var wrapper = document.getElementById('course-search-results');
    if (wrapper) wrapper.hidden = true;
  }

  // ─── Init ─────────────────────────────────────────────────────────────────────

  function isMatching(tagText, optionText) {
    var t = String(tagText || '').toLowerCase().trim();
    var o = String(optionText || '').toLowerCase().trim();
    if (t === o) return true;
    if (t.indexOf(o) !== -1 || o.indexOf(t) !== -1) return true;
    if (t.substring(0, 3) === o.substring(0, 3)) return true;
    return false;
  }

  function init() {
    // Store placeholders in data attributes
    document.querySelectorAll('.csr-dropdown').forEach(function (dd) {
      var label = dd.querySelector('.csr-dropdown__label');
      if (label && !dd.getAttribute('data-placeholder')) {
        dd.setAttribute('data-placeholder', label.textContent.trim());
      }
    });

    // Hook into option clicks to trigger search via event delegation
    document.addEventListener('click', function (e) {
      if (e.target.closest('.csr-dropdown__option')) {
        setTimeout(renderResults, 50);
      }
    });

    // Hook into course search tags clicks
    document.addEventListener('click', function (e) {
      var tagBtn = e.target.closest('.obuchenie-course-search-tag');
      if (!tagBtn) return;
      
      e.preventDefault();
      
      // If it is the "Show all" / "Показать все" button
      if (tagBtn.classList.contains('obuchenie-course-search-tag--more')) {
        resetFilters();
        renderResults();
        return;
      }
      
      var tagText = tagBtn.textContent.trim();
      var matched = false;
      
      document.querySelectorAll('.csr-dropdown').forEach(function (dd) {
        var options = dd.querySelectorAll('.csr-dropdown__option');
        options.forEach(function (opt) {
          var optText = opt.textContent.trim();
          if (isMatching(tagText, optText)) {
            dd.dataset.value = opt.getAttribute('data-value') || optText;
            dd.classList.add('has-value');
            
            var label = dd.querySelector('.csr-dropdown__label');
            if (label) label.textContent = optText;
            
            options.forEach(function (o) {
              o.classList.toggle('is-selected', o === opt);
            });
            matched = true;
          }
        });
      });
      
      if (matched) {
        renderResults();
      }
    });

    // Helper to select an option in a specific dropdown
    function setDropdownValue(ariaLabel, val) {
      var dd = document.querySelector('.csr-dropdown[aria-label="' + ariaLabel + '"]');
      if (!dd) return;
      var opt = dd.querySelector('.csr-dropdown__option[data-value="' + val + '"]');
      if (!opt) return;

      dd.dataset.value = val;
      dd.classList.add('has-value');
      
      var label = dd.querySelector('.csr-dropdown__label');
      if (label) label.textContent = opt.textContent.trim();
      
      dd.querySelectorAll('.csr-dropdown__option').forEach(function (o) {
        o.classList.toggle('is-selected', o === opt);
      });
    }

    // Scroll helper with header offset
    function scrollToTarget(targetId) {
      var el = document.getElementById(targetId);
      if (!el) return;

      var header = document.querySelector('.header');
      var headerHeight = header ? header.getBoundingClientRect().height : 100;
      var offset = headerHeight + 20;

      setTimeout(function () {
        var rect = el.getBoundingClientRect();
        var targetPosition = window.scrollY + rect.top - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }, 50);
    }

    // Handle incoming hash on page load or hashchange
    function handleHash(hashString) {
      var cleanHash = (hashString || window.location.hash || '').replace('#', '');
      if (!cleanHash) return;

      if (cleanHash === 'suppliers') {
        setDropdownValue('Заказчик или поставщик', 'supplier');
        renderResults();
        scrollToTarget('courses');
      } else if (cleanHash === 'customers') {
        setDropdownValue('Заказчик или поставщик', 'customer');
        renderResults();
        scrollToTarget('courses');
      } else if (cleanHash === 'help') {
        scrollToTarget('contacts');
      } else {
        scrollToTarget(cleanHash);
      }
    }

    // Intercept clicks on links that have hash hrefs
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href*="#"]');
      if (!link) return;

      var currentUrl = window.location.href.split('#')[0];
      var linkUrl = link.href.split('#')[0];
      if (currentUrl !== linkUrl) return;

      var hash = link.hash;
      if (!hash) return;

      e.preventDefault();

      if (history.pushState) {
        history.pushState(null, null, hash);
      } else {
        window.location.hash = hash;
      }

      handleHash(hash);
    });

    // Check hash on initialization
    if (window.location.hash) {
      window.scrollTo(0, 0);
      setTimeout(function () {
        handleHash(window.location.hash);
      }, 100);
    }

    // Reset button
    var resetBtn = document.getElementById('courseSearchReset');
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
  }

  // Wait for content to be ready
  document.addEventListener('obuchenieContentReady', function (ev) {
    if (ev.detail && ev.detail.courseRegistry) {
      COURSE_REGISTRY = ev.detail.courseRegistry;
    }
    init();
  });

  // Also init if DOM is already ready (fallback)
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

})();
