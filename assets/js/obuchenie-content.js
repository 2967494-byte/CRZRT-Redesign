/**
 * Контент страницы «Обучение» — загрузка из API / localStorage и отрисовка.
 */
(function () {
  const STORAGE_KEY = 'crzrt_obuchenie_page_data';
  const CONTENT_PENDING_CLASS = 'obuchenie-content-pending';
  const CONTENT_READY_CLASS = 'obuchenie-content-ready';

  const MORE_ARROW_SVG =
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M1 1L11 11M11 11V3M11 11H3" stroke="#0FAA4B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const DEFAULT_NAV_CARDS = [
    {
      label: 'Популярные\nпрограммы обучения',
      href: '#courses',
      icon: 'assets/img/obuchenie/icon-programs.png?v=2'
    },
    {
      label: 'Для\nпоставщиков',
      href: '#suppliers',
      icon: 'assets/img/obuchenie/icon-distance.png?v=2'
    },
    {
      label: 'Для\nзаказчиков',
      href: '#customers',
      icon: 'assets/img/obuchenie/icon-corporate.png?v=2'
    },
    {
      label: 'Календарь\nкурсов',
      href: '#schedule',
      icon: 'assets/img/obuchenie/icon-schedule.png?v=2'
    },
    {
      label: 'Тестирование',
      href: '#testing',
      icon: 'assets/img/obuchenie/icon-certificates.png?v=2'
    },
    {
      label: 'Помощь\nс выбором',
      href: '#help',
      icon: 'assets/img/obuchenie/icon-faq.png?v=2'
    }
  ];

  const DEFAULT_COURSE_CARDS = [
    {
      title: 'Очный курс повышения квалификации',
      price: 'от 7 830 руб.',
      durationNum: '1,5',
      durationUnit: 'месяца',
      scheduleNum: '2',
      scheduleUnit: 'раза в неделю',
      btnText: 'Записаться',
      btnLink: '#contacts',
      moreLink: '#courses'
    },
    {
      title: 'Дистанционный курс повышения квалификации',
      price: 'от 10 890 руб.',
      durationNum: '1,5',
      durationUnit: 'месяца',
      scheduleNum: '2',
      scheduleUnit: 'раза в неделю',
      btnText: 'Записаться',
      btnLink: '#contacts',
      moreLink: '#courses'
    },
    {
      title: 'Очный курс для поставщиков',
      price: 'от 20 256 руб.',
      durationNum: '1,5',
      durationUnit: 'месяца',
      scheduleNum: '2',
      scheduleUnit: 'раза в неделю',
      btnText: 'Записаться',
      btnLink: '#contacts',
      moreLink: '#courses'
    }
  ];

  const DEFAULT_TAGS = [
    'Онлайн-курсы', 'Онлайн-курсы', 'Онлайн-курсы', 'Онлайн-курсы', 'Онлайн-курсы', 'Онлайн-курсы', 'Онлайн-курсы',
    'Программирование', 'Программирование', 'Программирование', 'Программирование', 'Программирование', 'Программирование', 'Программирование',
    'Дизайн', 'Дизайн', 'Дизайн', 'Дизайн', 'Дизайн', 'Дизайн'
  ];

  const MONTH_NAMES_RU = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const DEFAULT_COURSE_REGISTRY = [
    {
      id: 'demo-och-2026-06',
      title: 'Очный курс повышения квалификации по 44-ФЗ',
      format: 'och',
      dateFrom: '2026-06-03',
      dateTo: '2026-06-07',
      durationDays: 5,
      description: 'Практический курс для специалистов по закупкам: разбор типовых ошибок, кейсы и шаблоны документов.',
      price: '23 700 ₽',
      forIndividuals: true,
      forLegalEntities: true,
      speakers: [
        { name: 'Иванов Иван Иванович', position: 'к.ю.н., эксперт по госзакупкам' }
      ],
      active: true
    },
    {
      id: 'demo-dist-2026-06',
      title: 'Дистанционный курс для поставщиков',
      format: 'dist',
      dateFrom: '2026-06-10',
      dateTo: '2026-06-24',
      durationDays: 15,
      description: 'Онлайн-программа с доступом к материалам и консультациями куратора.',
      price: '10 890 ₽',
      forIndividuals: true,
      forLegalEntities: false,
      speakers: [
        { name: 'Петрова Анна Сергеевна', position: 'ведущий преподаватель, опыт 12 лет' }
      ],
      active: true
    }
  ];

  const OBUCHENIE_DEFAULTS = {
    hero: {
      background: '',
      title: 'Обучение\nгосзакупкам',
      subtitle:
        'Как зарабатывать на госзакупках и тендерах: практические курсы и программы для заказчиков и поставщиков.',
      gavelImage: 'assets/img/consulting/banner-gavel.png',
      titleColor: '#00AE4D',
      subtitleColor: '#FFFFFF',
      titleTop: 68,
      titleLeft: 60,
      subtitleBottom: 40,
      subtitleLeft: 60
    },
    navCards: DEFAULT_NAV_CARDS.map((card) => ({ ...card })),
    courseSearch: {
      title: 'Поиск курсов',
      cta: 'Оставьте заявку, мы поможем',
      phone: '88001017892',
      phoneDisplay: '8 800 101-78-92',
      tags: [...DEFAULT_TAGS],
      showAllLabel: 'Показать все'
    },
    calendar: {
      promoTitle: 'Защищаем\nваши интересы',
      promoTitleColor: '#FFFFFF',
      promoImage: 'assets/img/img1_processed.png',
      allCoursesLink: '#courses',
      allCoursesFileName: '',
      courseDaysByMonth: {
        '2026-5': [5, 8, 15, 20],
        '2026-6': [3, 10, 17, 24]
      }
    },
    courseCards: DEFAULT_COURSE_CARDS.map((card) => ({ ...card })),
    courseRegistry: DEFAULT_COURSE_REGISTRY.map((item) => ({
      ...item,
      speakers: item.speakers.map((speaker) => ({ ...speaker }))
    })),
    testingBanner: {
      title: 'Проверь себя\nв госзакупках',
      btnText: 'Пройти тест',
      btnLink: 'testing.html',
      image: ''
    }
  };

  document.documentElement.classList.add(CONTENT_PENDING_CLASS);

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function multilineHtml(str) {
    return escapeHtml(str || '')
      .split('\n')
      .filter((line, i, arr) => line.length || i < arr.length - 1)
      .join('<br>');
  }

  function parseIsoDate(value) {
    if (!value || typeof value !== 'string') return null;
    const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
  }

  function formatIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function createCourseId() {
    return `course_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function addDays(date, days) {
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    next.setDate(next.getDate() + days);
    return next;
  }

  function getCourseDateRange(course) {
    const start = parseIsoDate(course?.dateFrom);
    if (!start) return null;

    const explicitEnd = parseIsoDate(course?.dateTo);
    const durationDays = Math.max(1, parseInt(course?.durationDays, 10) || 1);
    const end = explicitEnd && explicitEnd >= start ? explicitEnd : addDays(start, durationDays - 1);

    return { from: start, to: end };
  }

  function normalizeSpeaker(raw) {
    return {
      name: String(raw?.name || '').trim(),
      position: String(raw?.position || '').trim()
    };
  }

  function normalizeCourseAudience(raw) {
    const hasFl = raw?.forIndividuals;
    const hasUr = raw?.forLegalEntities;
    if (hasFl === undefined && hasUr === undefined) {
      return { forIndividuals: true, forLegalEntities: true };
    }

    let forIndividuals = hasFl !== false;
    let forLegalEntities = hasUr !== false;
    if (!forIndividuals && !forLegalEntities) {
      forIndividuals = true;
      forLegalEntities = true;
    }

    return { forIndividuals, forLegalEntities };
  }

  function normalizeCourseRegistryItem(raw, index) {
    const format = raw?.format === 'dist' ? 'dist' : 'och';
    const dateFrom = parseIsoDate(raw?.dateFrom) ? String(raw.dateFrom).trim() : '';
    const durationDays = Math.max(1, parseInt(raw?.durationDays, 10) || 1);
    const range = dateFrom
      ? getCourseDateRange({ dateFrom, dateTo: raw?.dateTo, durationDays })
      : null;
    const speakers = Array.isArray(raw?.speakers) && raw.speakers.length
      ? raw.speakers.map(normalizeSpeaker).filter((speaker) => speaker.name || speaker.position)
      : [];
    const audience = normalizeCourseAudience(raw);

    return {
      id: String(raw?.id || createCourseId() || `course_${index}`),
      title: String(raw?.title || '').trim(),
      format,
      dateFrom,
      dateTo: range ? formatIsoDate(range.to) : (parseIsoDate(raw?.dateTo) ? String(raw.dateTo).trim() : dateFrom),
      durationDays,
      description: String(raw?.description || '').trim(),
      price: String(raw?.price || '').trim(),
      forIndividuals: audience.forIndividuals,
      forLegalEntities: audience.forLegalEntities,
      speakers,
      active: raw?.active !== false
    };
  }

  function normalizeCourseRegistry(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map((item, index) => normalizeCourseRegistryItem(item, index));
  }

  function deriveCourseDaysByMonth(registry) {
    const result = {};
    const list = Array.isArray(registry) ? registry : [];

    list.forEach((course) => {
      if (!course || course.active === false) return;
      const range = getCourseDateRange(course);
      if (!range) return;

      const start = range.from;
      const key = `${start.getFullYear()}-${start.getMonth() + 1}`;
      if (!result[key]) result[key] = [];
      const day = start.getDate();
      if (!result[key].includes(day)) result[key].push(day);
    });

    Object.keys(result).forEach((key) => {
      result[key].sort((a, b) => a - b);
    });

    return result;
  }

  function resolveCalendarCourseDays(calendar, courseRegistry) {
    const derived = deriveCourseDaysByMonth(courseRegistry);
    if (Object.keys(derived).length) return derived;
    return normalizeCourseDays(calendar?.courseDaysByMonth);
  }

  function normalizeCourseDays(raw) {
    const result = {};
    if (!raw || typeof raw !== 'object') return { ...OBUCHENIE_DEFAULTS.calendar.courseDaysByMonth };

    Object.keys(raw).forEach((key) => {
      const days = raw[key];
      if (!Array.isArray(days)) return;
      const normalized = days
        .map((day) => parseInt(day, 10))
        .filter((day) => Number.isFinite(day) && day >= 1 && day <= 31);
      if (normalized.length) result[key] = normalized;
    });

    return Object.keys(result).length ? result : { ...OBUCHENIE_DEFAULTS.calendar.courseDaysByMonth };
  }

  function migrateObucheniePageData(raw) {
    const rawHero = raw?.hero && typeof raw.hero === 'object' ? raw.hero : {};

    const navCards =
      Array.isArray(raw?.navCards) && raw.navCards.length
        ? raw.navCards.map((card, i) => ({
            label: card?.label || OBUCHENIE_DEFAULTS.navCards[i]?.label || '',
            href: card?.href || OBUCHENIE_DEFAULTS.navCards[i]?.href || '#',
            icon: card?.icon || OBUCHENIE_DEFAULTS.navCards[i]?.icon || ''
          }))
        : OBUCHENIE_DEFAULTS.navCards.map((card) => ({ ...card }));

    const rawSearch = raw?.courseSearch && typeof raw.courseSearch === 'object' ? raw.courseSearch : {};
    let tags = [];
    if (Array.isArray(rawSearch.tags)) {
      tags = rawSearch.tags.map((tag) => String(tag || '').trim()).filter(Boolean);
    } else if (typeof rawSearch.tags === 'string') {
      tags = rawSearch.tags.split('\n').map((tag) => tag.trim()).filter(Boolean);
    }
    if (!tags.length) tags = [...OBUCHENIE_DEFAULTS.courseSearch.tags];

    const rawCalendar = raw?.calendar && typeof raw.calendar === 'object' ? raw.calendar : {};
    const courseRegistry = Array.isArray(raw?.courseRegistry)
      ? normalizeCourseRegistry(raw.courseRegistry)
      : !raw
        ? OBUCHENIE_DEFAULTS.courseRegistry.map((item) => ({
            ...item,
            speakers: item.speakers.map((speaker) => ({ ...speaker }))
          }))
        : [];

    return {
      hero: {
        background: rawHero.background || '',
        title: rawHero.title || OBUCHENIE_DEFAULTS.hero.title,
        subtitle: rawHero.subtitle || OBUCHENIE_DEFAULTS.hero.subtitle,
        gavelImage: rawHero.gavelImage || OBUCHENIE_DEFAULTS.hero.gavelImage,
        titleColor: rawHero.titleColor || OBUCHENIE_DEFAULTS.hero.titleColor,
        subtitleColor: rawHero.subtitleColor || OBUCHENIE_DEFAULTS.hero.subtitleColor,
        titleTop: rawHero.titleTop !== undefined ? parseInt(rawHero.titleTop, 10) : OBUCHENIE_DEFAULTS.hero.titleTop,
        titleLeft: rawHero.titleLeft !== undefined ? parseInt(rawHero.titleLeft, 10) : OBUCHENIE_DEFAULTS.hero.titleLeft,
        subtitleBottom: rawHero.subtitleBottom !== undefined ? parseInt(rawHero.subtitleBottom, 10) : OBUCHENIE_DEFAULTS.hero.subtitleBottom,
        subtitleLeft: rawHero.subtitleLeft !== undefined ? parseInt(rawHero.subtitleLeft, 10) : OBUCHENIE_DEFAULTS.hero.subtitleLeft
      },
      navCards,
      courseSearch: {
        title: rawSearch.title || OBUCHENIE_DEFAULTS.courseSearch.title,
        cta: rawSearch.cta || OBUCHENIE_DEFAULTS.courseSearch.cta,
        phone: rawSearch.phone || OBUCHENIE_DEFAULTS.courseSearch.phone,
        phoneDisplay: rawSearch.phoneDisplay || OBUCHENIE_DEFAULTS.courseSearch.phoneDisplay,
        tags,
        showAllLabel: rawSearch.showAllLabel || OBUCHENIE_DEFAULTS.courseSearch.showAllLabel
      },
      calendar: {
        promoTitle: rawCalendar.promoTitle || OBUCHENIE_DEFAULTS.calendar.promoTitle,
        promoTitleColor: rawCalendar.promoTitleColor || OBUCHENIE_DEFAULTS.calendar.promoTitleColor,
        promoImage: rawCalendar.promoImage || OBUCHENIE_DEFAULTS.calendar.promoImage,
        allCoursesLink: rawCalendar.allCoursesLink || OBUCHENIE_DEFAULTS.calendar.allCoursesLink,
        allCoursesFileName: rawCalendar.allCoursesFileName || '',
        courseDaysByMonth: resolveCalendarCourseDays(rawCalendar, courseRegistry)
      },
      courseCards:
        Array.isArray(raw?.courseCards) && raw.courseCards.length
          ? raw.courseCards.map((card, i) => ({
              title: card?.title || OBUCHENIE_DEFAULTS.courseCards[i]?.title || '',
              price: card?.price || OBUCHENIE_DEFAULTS.courseCards[i]?.price || '',
              durationNum: card?.durationNum || OBUCHENIE_DEFAULTS.courseCards[i]?.durationNum || '',
              durationUnit: card?.durationUnit || OBUCHENIE_DEFAULTS.courseCards[i]?.durationUnit || '',
              scheduleNum: card?.scheduleNum || OBUCHENIE_DEFAULTS.courseCards[i]?.scheduleNum || '',
              scheduleUnit: card?.scheduleUnit || OBUCHENIE_DEFAULTS.courseCards[i]?.scheduleUnit || '',
              btnText: card?.btnText || OBUCHENIE_DEFAULTS.courseCards[i]?.btnText || 'Записаться',
              btnLink: card?.btnLink || OBUCHENIE_DEFAULTS.courseCards[i]?.btnLink || '#contacts',
              moreLink: card?.moreLink || OBUCHENIE_DEFAULTS.courseCards[i]?.moreLink || '#courses'
            }))
          : OBUCHENIE_DEFAULTS.courseCards.map((card) => ({ ...card })),
      courseRegistry,
      testingBanner: {
        title: raw?.testingBanner?.title || OBUCHENIE_DEFAULTS.testingBanner.title,
        btnText: raw?.testingBanner?.btnText || OBUCHENIE_DEFAULTS.testingBanner.btnText,
        btnLink: raw?.testingBanner?.btnLink || OBUCHENIE_DEFAULTS.testingBanner.btnLink,
        image: raw?.testingBanner?.image || OBUCHENIE_DEFAULTS.testingBanner.image
      }
    };
  }

  let enrollModalInitialized = false;

  function setEnrollAudienceMode(mode) {
    const audienceInput = document.getElementById('enroll-audience-type');
    const companyField = document.getElementById('enroll-company-field');
    const companyInput = document.getElementById('enroll-company');
    const labels = document.querySelectorAll('[data-audience-label]');
    const normalizedMode = mode === 'legal' ? 'legal' : 'individual';

    if (audienceInput) audienceInput.value = normalizedMode;

    labels.forEach((label) => {
      label.classList.toggle('enroll-modal__audience-label--active', label.dataset.audienceLabel === normalizedMode);
    });

    if (companyField && companyInput) {
      const isLegal = normalizedMode === 'legal';
      companyField.hidden = !isLegal;
      companyInput.required = isLegal;
      if (!isLegal) companyInput.value = '';
    }
  }

  function configureEnrollModalAudience(options) {
    const forIndividuals = options?.forIndividuals !== false;
    const forLegalEntities = options?.forLegalEntities !== false;
    const switchWrap = document.getElementById('enroll-audience-switch');
    const toggle = document.getElementById('enroll-audience-toggle');

    if (switchWrap) {
      switchWrap.hidden = !(forIndividuals && forLegalEntities);
    }

    let mode = 'individual';
    if (!forIndividuals && forLegalEntities) {
      mode = 'legal';
    } else if (forIndividuals && !forLegalEntities) {
      mode = 'individual';
    } else if (toggle) {
      mode = toggle.checked ? 'legal' : 'individual';
    }

    if (toggle) toggle.checked = mode === 'legal';
    setEnrollAudienceMode(mode);
  }

  function openEnrollModal(options) {
    const modal = document.getElementById('enroll-modal');
    if (!modal) return;

    const titleEl = document.getElementById('enroll-modal-title');
    const dateEl = document.getElementById('enroll-modal-date');
    const form = document.getElementById('enroll-form');

    if (titleEl) titleEl.textContent = options?.title || '';
    if (dateEl) dateEl.textContent = options?.date || '';
    if (form) {
      form.dataset.courseId = options?.courseId || '';
    }

    configureEnrollModalAudience({
      forIndividuals: options?.forIndividuals,
      forLegalEntities: options?.forLegalEntities
    });

    const calendarModal = document.getElementById('calendar-course-modal');
    if (calendarModal && calendarModal.style.display !== 'none') {
      calendarModal.style.display = 'none';
    }

    modal.style.display = 'flex';
  }

  function setupEnrollModal() {
    if (enrollModalInitialized) return;
    enrollModalInitialized = true;

    const modal = document.getElementById('enroll-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.calendar-modal__close');
    const overlay = modal.querySelector('.calendar-modal__overlay');
    const form = document.getElementById('enroll-form');
    const audienceToggle = document.getElementById('enroll-audience-toggle');

    function closeEnrollModal() {
      modal.style.display = 'none';
      if (form) {
        form.reset();
        delete form.dataset.courseId;
      }
      configureEnrollModalAudience({ forIndividuals: true, forLegalEntities: true });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeEnrollModal);
    if (overlay) overlay.addEventListener('click', closeEnrollModal);

    if (audienceToggle) {
      audienceToggle.addEventListener('change', function () {
        setEnrollAudienceMode(audienceToggle.checked ? 'legal' : 'individual');
      });
    }

    document.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-action="enroll"]');
      if (!btn) return;

      e.preventDefault();

      openEnrollModal({
        title: btn.getAttribute('data-title') || '',
        date: btn.getAttribute('data-date') || '',
        courseId: btn.getAttribute('data-course-id') || '',
        forIndividuals: btn.getAttribute('data-for-individuals') !== 'false',
        forLegalEntities: btn.getAttribute('data-for-legal') !== 'false'
      });
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Заявка успешно отправлена!');
        closeEnrollModal();
      });
    }
  }

  function markObuchenieContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }

  function loadObuchenieDataFromLocal() {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateObucheniePageData(JSON.parse(local));
    } catch (error) {
      console.warn('Obuchenie: localStorage parse error', error);
    }
    return null;
  }

  async function loadObuchenieDataFromApi() {
    try {
      const resp = await fetch(`api/settings.php?key=${STORAGE_KEY}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data && typeof data === 'object' && Object.keys(data).length) {
          return migrateObucheniePageData(data);
        }
      }
    } catch (error) {
      console.warn('Obuchenie: API unavailable', error);
    }
    return null;
  }

  function renderHero(hero) {
    const banner = document.querySelector('.consulting-hero');
    const titleEl = document.querySelector('.consulting-hero-title');
    const subtitleEl = document.querySelector('.consulting-hero-subtitle');
    const graphicEl = document.querySelector('.consulting-banner__graphic');
    const gavelEl = document.querySelector('.consulting-hero-gavel');
    const background = (hero?.background || '').trim();
    const hasCustomBanner = Boolean(background);

    if (titleEl) {
      titleEl.innerHTML = multilineHtml(hero?.title);
      titleEl.style.color = hero?.titleColor || OBUCHENIE_DEFAULTS.hero.titleColor;
      if (hero?.titleTop !== undefined) titleEl.style.top = `${hero.titleTop}px`;
      if (hero?.titleLeft !== undefined) titleEl.style.left = `${hero.titleLeft}px`;
    }
    if (subtitleEl) {
      subtitleEl.innerHTML = multilineHtml(hero?.subtitle);
      subtitleEl.style.color = hero?.subtitleColor || OBUCHENIE_DEFAULTS.hero.subtitleColor;
      if (hero?.subtitleBottom !== undefined) subtitleEl.style.bottom = `${hero.subtitleBottom}px`;
      if (hero?.subtitleLeft !== undefined) subtitleEl.style.left = `${hero.subtitleLeft}px`;
    }
    if (gavelEl && hero?.gavelImage) gavelEl.src = hero.gavelImage;

    if (banner) {
      if (hasCustomBanner) {
        banner.style.backgroundImage = `url('${background.replace(/'/g, "\\'")}')`;
        banner.classList.add('consulting-hero--custom-bg');
      } else {
        banner.style.backgroundImage = '';
        banner.classList.remove('consulting-hero--custom-bg');
      }
    }

    window.__heroSlides = [];
    window.__heroCurrent = 0;

    const contentEl = document.querySelector('.consulting-hero__content');
    if (contentEl) contentEl.classList.remove('is-hidden');
    if (graphicEl) graphicEl.classList.toggle('is-hidden', hasCustomBanner);

    document.dispatchEvent(new CustomEvent('heroSlidesUpdated', { detail: { count: 1 } }));
  }

  function renderNavCards(navCards) {
    const grid = document.querySelector('.obuchenie-nav-cards');
    if (!grid) return;
    const list = navCards?.length ? navCards : OBUCHENIE_DEFAULTS.navCards;
    grid.innerHTML = list
      .map((card) => {
        const href = escapeHtml((card.href || '#').trim() || '#');
        const icon = escapeAttr((card.icon || '').trim() || 'assets/img/obuchenie/icon-programs.png?v=2');
        return `<a href="${href}" class="ecp-card">
          <div class="ecp-card__icon-wrap">
            <img src="${icon}" alt="" class="ecp-card__icon" width="118" height="149" decoding="async">
          </div>
          <div class="ecp-card__label">${multilineHtml(card.label)}</div>
        </a>`;
      })
      .join('');
  }

  function renderCourseSearch(courseSearch) {
    const data = courseSearch || OBUCHENIE_DEFAULTS.courseSearch;
    const titleEl = document.querySelector('.obuchenie-course-search__title');
    const ctaEl = document.querySelector('.obuchenie-course-search-panel__cta');
    const phoneEl = document.querySelector('.obuchenie-course-search-panel__phone');
    const tagsEl = document.querySelector('.obuchenie-course-search-tags');

    if (titleEl) titleEl.textContent = data.title || OBUCHENIE_DEFAULTS.courseSearch.title;
    if (ctaEl) ctaEl.textContent = data.cta || OBUCHENIE_DEFAULTS.courseSearch.cta;
    if (phoneEl) {
      const phone = (data.phone || OBUCHENIE_DEFAULTS.courseSearch.phone).replace(/\D/g, '');
      phoneEl.href = phone ? `tel:${phone}` : '#';
      phoneEl.textContent = data.phoneDisplay || OBUCHENIE_DEFAULTS.courseSearch.phoneDisplay;
    }

    if (!tagsEl) return;

    const tags = data.tags?.length ? data.tags : OBUCHENIE_DEFAULTS.courseSearch.tags;
    const showAll = data.showAllLabel || OBUCHENIE_DEFAULTS.courseSearch.showAllLabel;
    const rows = [];
    for (let i = 0; i < tags.length; i += 7) {
      rows.push(tags.slice(i, i + 7));
    }
    if (!rows.length) rows.push([]);

    tagsEl.innerHTML = rows
      .map((row, index) => {
        const isLast = index === rows.length - 1;
        const rowClass = isLast ? ' obuchenie-course-search-tags__row--last' : '';
        const cells = row
          .map((tag) => `<button type="button" class="obuchenie-course-search-tag">${escapeHtml(tag)}</button>`)
          .join('');
        const moreBtn = isLast
          ? `<button type="button" class="obuchenie-course-search-tag obuchenie-course-search-tag--more">${escapeHtml(showAll)}</button>`
          : '';
        return `<div class="obuchenie-course-search-tags__row${rowClass}">${cells}${moreBtn}</div>`;
      })
      .join('');
  }

  function renderCalendar(calendar, courseRegistry) {
    const data = calendar || OBUCHENIE_DEFAULTS.calendar;
    const courseDaysByMonth = resolveCalendarCourseDays(data, courseRegistry);
    const promoEl = document.querySelector('.obuchenie-calendar-promo');
    const titleEl = document.querySelector('.obuchenie-calendar-promo__title');
    const imageEl = document.querySelector('.obuchenie-calendar-promo__image');
    const allLinkEl = document.querySelector('.obuchenie-calendar-block__all');
    const promoImage = (data.promoImage || OBUCHENIE_DEFAULTS.calendar.promoImage || '').trim();

    if (titleEl) {
      titleEl.innerHTML = multilineHtml(data.promoTitle || OBUCHENIE_DEFAULTS.calendar.promoTitle);
      titleEl.style.color = data.promoTitleColor || OBUCHENIE_DEFAULTS.calendar.promoTitleColor;
    }
    if (imageEl && promoImage) {
      imageEl.src = promoImage;
    }
    if (promoEl) {
      promoEl.classList.toggle('obuchenie-calendar-promo--has-image', Boolean(promoImage));
    }
    if (allLinkEl) {
      const link = (data.allCoursesLink || '#courses').trim() || '#courses';
      allLinkEl.href = link;
      if (link.startsWith('uploads/')) {
        allLinkEl.setAttribute('download', '');
        allLinkEl.setAttribute('target', '_blank');
      } else {
        allLinkEl.removeAttribute('download');
        allLinkEl.removeAttribute('target');
      }
    }

    if (window.ObuchenieCalendar?.setCourseDays) {
      window.ObuchenieCalendar.setCourseDays(courseDaysByMonth);
    }
  }

  const MONTH_NAMES_GENITIVE_RU = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];

  function formatDaysPlural(days) {
    const d = parseInt(days, 10) || 1;
    const mod10 = d % 10;
    const mod100 = d % 100;
    if (mod10 === 1 && mod100 !== 11) {
      return 'день';
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
      return 'дня';
    } else {
      return 'дней';
    }
  }

  function renderCourseCards(courseCards, courseRegistry) {
    const grid = document.querySelector('.obuchenie-course-cards');
    if (!grid) return;

    // Filter active courses
    const activeCourses = (courseRegistry || []).filter(c => c && c.active !== false);

    // If we have no active courses in the registry at all (empty DB), fallback to default mock cards
    if (activeCourses.length === 0) {
      const mockList = OBUCHENIE_DEFAULTS.courseCards;
      grid.innerHTML = mockList
        .map((card) => {
          const btnHref = escapeHtml((card.btnLink || '#contacts').trim() || '#contacts');
          const moreHref = escapeHtml((card.moreLink || '#courses').trim() || '#courses');
          const price = escapeHtml(card.price || '');
          return `<article class="occ-card">
            <div class="occ-card__top" style="flex-grow: 1; margin-bottom: auto;">
              <h3 class="occ-card__title">${escapeHtml(card.title)}</h3>
              <p class="occ-card__price">${price.replace(/ /g, '&nbsp;')}</p>
            </div>
            <div class="occ-card__stats" style="margin-top: 0;">
              <div class="occ-card__stat">
                <span class="occ-card__stat-label">длительность</span>
                <div class="occ-card__stat-value">
                  <span class="occ-card__stat-num">${escapeHtml(card.durationNum)}</span>
                  <span class="occ-card__stat-unit">${escapeHtml(card.durationUnit)}</span>
                </div>
              </div>
              <div class="occ-card__stat-divider"></div>
              <div class="occ-card__stat">
                <span class="occ-card__stat-label">график занятий</span>
                <div class="occ-card__stat-value">
                  <span class="occ-card__stat-num">${escapeHtml(card.scheduleNum)}</span>
                  <span class="occ-card__stat-unit">${escapeHtml(card.scheduleUnit)}</span>
                </div>
              </div>
            </div>
            <a href="${btnHref}" class="occ-card__btn">${escapeHtml(card.btnText || 'Записаться')}</a>
            <a href="${moreHref}" class="occ-card__more">подробнее ${MORE_ARROW_SVG}</a>
          </article>`;
        })
        .join('');
      return;
    }

    // Map and calculate dates for sorting
    const today = new Date();
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const mapped = activeCourses.map(course => {
      const start = parseIsoDate(course.dateFrom);
      return {
        course,
        startDate: start || new Date(2099, 11, 31) // Fallback for sorting if date is invalid
      };
    });

    // Only upcoming courses! (start date must be today or in the future)
    const upcoming = mapped.filter(item => item.startDate >= todayZero);

    // Sort upcoming ascending (closest first)
    upcoming.sort((a, b) => a.startDate - b.startDate);

    // Take top 3
    const top3 = upcoming.slice(0, 3);

    // If there are no upcoming courses (all are in the past), render empty grid
    if (top3.length === 0) {
      grid.innerHTML = '';
      return;
    }

    grid.innerHTML = top3
      .map((item) => {
        const c = item.course;
        const start = item.startDate;
        
        // Format price (fallback to empty)
        const price = escapeHtml(c.price || '').trim();
        const priceHtml = price ? `<p class="occ-card__price">${price.replace(/ /g, '&nbsp;')}</p>` : '<p class="occ-card__price">&nbsp;</p>';
        
        // Format duration
        const durDays = c.durationDays || 1;
        const durUnit = formatDaysPlural(durDays);

        // Format start date
        const startDay = start.getFullYear() === 2099 ? '—' : String(start.getDate());
        const startMonth = start.getFullYear() === 2099 ? '' : MONTH_NAMES_GENITIVE_RU[start.getMonth()];
        const dateLabel = start.getFullYear() === 2099
          ? ''
          : `${startDay} ${startMonth} ${start.getFullYear()}`;
        const forIndividuals = c.forIndividuals !== false;
        const forLegal = c.forLegalEntities !== false;

        return `<article class="occ-card">
          <div class="occ-card__top" style="flex-grow: 1; margin-bottom: auto;">
            <h3 class="occ-card__title">${escapeHtml(c.title)}</h3>
            ${priceHtml}
          </div>
          <div class="occ-card__stats" style="margin-top: 0;">
            <div class="occ-card__stat">
              <span class="occ-card__stat-label">старт курса</span>
              <div class="occ-card__stat-value">
                <span class="occ-card__stat-num">${startDay}</span>
                <span class="occ-card__stat-unit">${startMonth}</span>
              </div>
            </div>
            <div class="occ-card__stat-divider"></div>
            <div class="occ-card__stat">
              <span class="occ-card__stat-label">длительность</span>
              <div class="occ-card__stat-value">
                <span class="occ-card__stat-num">${durDays}</span>
                <span class="occ-card__stat-unit">${durUnit}</span>
              </div>
            </div>
          </div>
          <button type="button" class="occ-card__btn" data-action="enroll" data-course-id="${escapeAttr(c.id)}" data-title="${escapeAttr(c.title)}" data-date="${escapeAttr(dateLabel)}" data-for-individuals="${forIndividuals ? 'true' : 'false'}" data-for-legal="${forLegal ? 'true' : 'false'}">Записаться</button>
          <a href="#contacts" class="occ-card__more">подробнее ${MORE_ARROW_SVG}</a>
        </article>`;
      })
      .join('');
  }

  function renderTestingBanner(testingBanner) {
    const data = testingBanner || OBUCHENIE_DEFAULTS.testingBanner;
    const bannerEl = document.querySelector('.obuchenie-testing-banner');
    const titleEl = document.querySelector('.obuchenie-testing-banner__title');
    const btnEl = document.querySelector('.obuchenie-testing-banner__btn');
    const imageEl = document.querySelector('.obuchenie-testing-banner__image');
    const image = (data.image || '').trim();

    if (titleEl) {
      titleEl.innerHTML = multilineHtml(data.title);
      if (data.titleColor) {
        titleEl.style.color = data.titleColor;
      } else {
        titleEl.style.color = '';
      }
      if (data.titleTop !== undefined || data.titleLeft !== undefined) {
        titleEl.style.position = 'absolute';
        titleEl.style.margin = '0';
        if (data.titleTop !== undefined) titleEl.style.top = `${data.titleTop}px`;
        if (data.titleLeft !== undefined) titleEl.style.left = `${data.titleLeft}px`;
      } else {
        titleEl.style.position = '';
        titleEl.style.top = '';
        titleEl.style.left = '';
      }
    }
    
    if (btnEl) {
      btnEl.textContent = data.btnText || OBUCHENIE_DEFAULTS.testingBanner.btnText;
      let btnLink = (data.btnLink || 'testing.html').trim();
      if (btnLink === '#contacts' || btnLink === '' || btnLink === '#') {
        btnLink = 'testing.html';
      }
      btnEl.href = btnLink;
      
      if (data.titleTop !== undefined || data.titleLeft !== undefined || data.btnBottom !== undefined || data.btnLeft !== undefined) {
         // position the button absolute as well, roughly matching the preview
         btnEl.style.position = 'absolute';
         btnEl.style.margin = '0';
         if (data.btnBottom !== undefined) {
           btnEl.style.bottom = `${data.btnBottom}px`;
         } else {
           btnEl.style.bottom = '65px';
         }
         
         if (data.btnLeft !== undefined) {
           btnEl.style.left = `${data.btnLeft}px`;
         } else if (data.titleLeft !== undefined) {
           btnEl.style.left = `${data.titleLeft}px`;
         } else {
           btnEl.style.left = '60px';
         }
      } else {
         btnEl.style.position = '';
         btnEl.style.margin = '';
         btnEl.style.bottom = '';
         btnEl.style.left = '';
      }
    }

    if (imageEl) {
      if (image) {
        imageEl.src = image;
        imageEl.hidden = false;
      } else {
        imageEl.removeAttribute('src');
        imageEl.hidden = true;
      }
    }
    if (bannerEl) {
      bannerEl.classList.toggle('obuchenie-testing-banner--has-image', Boolean(image));
    }
  }

  function renderObucheniePage(data) {
    renderHero(data.hero);
    renderNavCards(data.navCards);
    renderCourseSearch(data.courseSearch);
    renderCalendar(data.calendar, data.courseRegistry);
    renderCourseCards(data.courseCards, data.courseRegistry);
    renderTestingBanner(data.testingBanner);
    setupEnrollModal();
    document.dispatchEvent(new CustomEvent('obuchenieContentReady', { detail: data }));
  }

  async function initObuchenieContent() {
    try {
      const localData = loadObuchenieDataFromLocal();
      const initialData = localData || migrateObucheniePageData(null);
      renderObucheniePage(initialData);
      markObuchenieContentReady();

      const apiData = await loadObuchenieDataFromApi();
      if (apiData) {
        renderObucheniePage(apiData);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
        } catch (error) {
          console.warn('Obuchenie: localStorage update failed', error);
        }
      }
    } catch (error) {
      console.error('Obuchenie content init failed', error);
      markObuchenieContentReady();
    }
  }

  window.ObuchenieContent = {
    STORAGE_KEY,
    OBUCHENIE_DEFAULTS,
    MONTH_NAMES_RU,
    migrateObucheniePageData,
    normalizeCourseRegistry,
    normalizeCourseRegistryItem,
    normalizeCourseAudience,
    deriveCourseDaysByMonth,
    resolveCalendarCourseDays,
    getCourseDateRange,
    createCourseId,
    parseIsoDate,
    formatIsoDate,
    configureEnrollModalAudience,
    openEnrollModal,
    setEnrollAudienceMode,
    loadObuchenieDataFromApi,
    loadObuchenieDataFromLocal,
    renderObucheniePage
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObuchenieContent);
  } else {
    initObuchenieContent();
  }
})();
