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
      bitrixFormFl: { id: '886', sec: 'a7wdlg' },
      bitrixFormUr: { id: '888', sec: '6wx7xd' },
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
      showAllLabel: 'Показать все',
      blocks: [
        { id: 'block_audience', title: 'заказчик/поставщик', values: ['Заказчик', 'Поставщик'] },
        { id: 'block_law', title: '44-ФЗ / 223-ФЗ', values: ['44-ФЗ', '223-ФЗ'] },
        { id: 'block_format', title: 'очно / дистанционно', values: ['Очно', 'Дистанционно'] },
        { id: 'block_type', title: 'Курсы повышения ...', values: ['Курсы повышения квалификации', 'Курсы профессиональной переподготовки'] }
      ]
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

  const isObucheniePage = document.body.dataset.page === 'obuchenie';
  if (isObucheniePage) {
    document.documentElement.classList.add(CONTENT_PENDING_CLASS);
  }

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

  function parseBitrixFormRef(value) {
    const str = String(value || '').trim();
    const scriptMatch = str.match(/data-b24-form="[\w-]+\/(\d+)\/([a-z0-9]+)"/i)
      || str.match(/(?:click|inline)\/(\d+)\/([a-z0-9]+)/i);
    if (scriptMatch) {
      return { id: scriptMatch[1], sec: scriptMatch[2] };
    }
    const match = str.match(/^(\d+)\s*[/:]\s*([a-z0-9]+)$/i);
    if (!match) return null;
    return { id: match[1], sec: match[2] };
  }

  function formatBitrixFormRef(form) {
    if (!form?.id || !form?.sec) return '';
    return `${form.id} / ${form.sec}`;
  }

  function normalizeBitrixForm(raw) {
    if (raw && typeof raw === 'object' && raw.id && raw.sec) {
      const id = String(raw.id).trim();
      const sec = String(raw.sec).trim();
      if (/^\d+$/.test(id) && /^[a-z0-9]+$/i.test(sec)) {
        return { id, sec };
      }
      return null;
    }
    return parseBitrixFormRef(raw);
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

    let options = Array.isArray(raw?.options) ? [...raw.options] : [];
    if (!raw?.options) {
      if (raw?.forCustomers) options.push('Заказчик');
      if (raw?.forSuppliers) options.push('Поставщик');
      if (raw?.is44fz) options.push('44-ФЗ');
      if (raw?.is223fz) options.push('223-ФЗ');
      if (format === 'och') options.push('Очно');
      if (format === 'dist') options.push('Дистанционно');
    }

    return {
      id: String(raw?.id || createCourseId() || `course_${index}`),
      title: String(raw?.title || '').trim(),
      format,
      dateFrom,
      dateTo: range ? formatIsoDate(range.to) : (parseIsoDate(raw?.dateTo) ? String(raw.dateTo).trim() : dateFrom),
      durationDays,
      description: Array.isArray(raw?.description) ? raw.description : String(raw?.description || '').trim(),
      price: String(raw?.price || '').trim(),
      forIndividuals: audience.forIndividuals,
      forLegalEntities: audience.forLegalEntities,
      forCustomers: Boolean(raw?.forCustomers),
      forSuppliers: Boolean(raw?.forSuppliers),
      is44fz: Boolean(raw?.is44fz),
      is223fz: Boolean(raw?.is223fz),
      bitrixFormFl: normalizeBitrixForm(raw?.bitrixFormFl),
      bitrixFormUr: normalizeBitrixForm(raw?.bitrixFormUr),
      speakers,
      options,
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
    if (!tags.length && (!raw || rawSearch.tags === undefined)) tags = [...OBUCHENIE_DEFAULTS.courseSearch.tags];

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
        titleFontSize: rawHero.titleFontSize || '',
        titleFontWeight: rawHero.titleFontWeight || '',
        titleItalic: rawHero.titleItalic || false,
        titleUnderline: rawHero.titleUnderline || false,
        subtitleBottom: rawHero.subtitleBottom !== undefined ? parseInt(rawHero.subtitleBottom, 10) : OBUCHENIE_DEFAULTS.hero.subtitleBottom,
        subtitleLeft: rawHero.subtitleLeft !== undefined ? parseInt(rawHero.subtitleLeft, 10) : OBUCHENIE_DEFAULTS.hero.subtitleLeft,
        subtitleFontSize: rawHero.subtitleFontSize || '',
        subtitleFontWeight: rawHero.subtitleFontWeight || '',
        subtitleItalic: rawHero.subtitleItalic || false,
        subtitleUnderline: rawHero.subtitleUnderline || false
      },
      navCards,
      courseSearch: {
        title: rawSearch.title || OBUCHENIE_DEFAULTS.courseSearch.title,
        cta: rawSearch.cta || OBUCHENIE_DEFAULTS.courseSearch.cta,
        phone: rawSearch.phone || OBUCHENIE_DEFAULTS.courseSearch.phone,
        phoneDisplay: rawSearch.phoneDisplay || OBUCHENIE_DEFAULTS.courseSearch.phoneDisplay,
        tags,
        showAllLabel: rawSearch.showAllLabel || OBUCHENIE_DEFAULTS.courseSearch.showAllLabel,
        blocks: Array.isArray(rawSearch.blocks) ? rawSearch.blocks : [...OBUCHENIE_DEFAULTS.courseSearch.blocks]
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
        titleColor: raw?.testingBanner?.titleColor || '',
        titleTop: raw?.testingBanner?.titleTop,
        titleLeft: raw?.testingBanner?.titleLeft,
        titleFontSize: raw?.testingBanner?.titleFontSize || '',
        titleFontWeight: raw?.testingBanner?.titleFontWeight || '',
        titleItalic: raw?.testingBanner?.titleItalic || false,
        titleUnderline: raw?.testingBanner?.titleUnderline || false,
        btnText: raw?.testingBanner?.btnText || OBUCHENIE_DEFAULTS.testingBanner.btnText,
        btnLink: raw?.testingBanner?.btnLink || OBUCHENIE_DEFAULTS.testingBanner.btnLink,
        btnBottom: raw?.testingBanner?.btnBottom,
        btnLeft: raw?.testingBanner?.btnLeft,
        image: raw?.testingBanner?.image || OBUCHENIE_DEFAULTS.testingBanner.image
      }
    };
  }

  let enrollModalInitialized = false;
  let activeCourseRegistry = [];

  function setEnrollFormStatus(message, type) {
    const statusEl = document.getElementById('enroll-form-status');
    if (!statusEl) return;
    if (!message) {
      statusEl.hidden = true;
      statusEl.textContent = '';
      statusEl.className = 'enroll-modal__status';
      return;
    }
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.className = `enroll-modal__status enroll-modal__status--${type || 'info'}`;
  }

  async function submitEnrollToBitrix(form) {
    const courseId = form?.dataset?.courseId || '';
    const course = activeCourseRegistry.find((item) => item.id === courseId);
    const audienceType = document.getElementById('enroll-audience-type')?.value === 'legal' ? 'legal' : 'individual';
    const bitrixForm = audienceType === 'legal' ? course?.bitrixFormUr : course?.bitrixFormFl;

    if (!bitrixForm?.id || !bitrixForm?.sec) {
      throw new Error('Для этого курса не настроена CRM-форма Bitrix24. Укажите ID формы в админке.');
    }

    const values = {
      LEAD_NAME: document.getElementById('enroll-name')?.value.trim() || '',
      LEAD_PHONE: document.getElementById('enroll-phone')?.value.trim() || '',
      LEAD_EMAIL: document.getElementById('enroll-email')?.value.trim() || '',
      LEAD_UF_CRM_1669365821: document.getElementById('enroll-source')?.value || '',
      AGREEMENT_24: 'Y'
    };

    if (audienceType === 'legal') {
      values.LEAD_COMPANY_TITLE = document.getElementById('enroll-company')?.value.trim() || '';
      if (!values.LEAD_COMPANY_TITLE) {
        throw new Error('Укажите название компании');
      }
    }

    const response = await fetch('api/bitrix-enroll.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formId: parseInt(bitrixForm.id, 10),
        sec: bitrixForm.sec,
        values
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Не удалось отправить заявку в Bitrix24');
    }

    return result;
  }

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

    setEnrollFormStatus('');

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
      setEnrollFormStatus('');
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
      const detailBtn = e.target.closest('[data-action="course-detail"]');
      if (detailBtn) {
        e.preventDefault();
        const courseId = detailBtn.getAttribute('data-course-id') || '';
        const course = activeCourseRegistry.find((item) => item.id === courseId);
        if (course && window.ObuchenieCalendar?.openCourseDetailModal) {
          window.ObuchenieCalendar.openCourseDetailModal(course);
        }
        return;
      }

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
      const submitBtn = form.querySelector('.enroll-modal__submit');
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        setEnrollFormStatus('');

        const originalText = submitBtn?.textContent || 'Отправить';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Отправка…';
        }

        try {
          const result = await submitEnrollToBitrix(form);
          setEnrollFormStatus(result.message || 'Заявка принята', 'success');
          window.setTimeout(closeEnrollModal, 2200);
        } catch (error) {
          setEnrollFormStatus(error.message || 'Ошибка отправки', 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        }
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

  function applyTypographyStyles(el, size, weight, italic, underline) {
    if (!el) return;
    if (size) el.style.fontSize = `${size}px`;
    else el.style.removeProperty('font-size');
    if (weight) el.style.fontWeight = weight;
    else el.style.removeProperty('font-weight');
    if (italic) el.style.fontStyle = 'italic';
    else el.style.removeProperty('font-style');
    if (underline) el.style.textDecoration = 'underline';
    else el.style.removeProperty('text-decoration');
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
      applyTypographyStyles(titleEl, hero?.titleFontSize, hero?.titleFontWeight, hero?.titleItalic, hero?.titleUnderline);
    }
    if (subtitleEl) {
      subtitleEl.innerHTML = multilineHtml(hero?.subtitle);
      subtitleEl.style.color = hero?.subtitleColor || OBUCHENIE_DEFAULTS.hero.subtitleColor;
      if (hero?.subtitleBottom !== undefined) subtitleEl.style.bottom = `${hero.subtitleBottom}px`;
      if (hero?.subtitleLeft !== undefined) subtitleEl.style.left = `${hero.subtitleLeft}px`;
      applyTypographyStyles(subtitleEl, hero?.subtitleFontSize, hero?.subtitleFontWeight, hero?.subtitleItalic, hero?.subtitleUnderline);
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

    // Render dynamic select dropdown filters
    const filtersEl = document.querySelector('.obuchenie-course-search-panel__filters');
    if (filtersEl && Array.isArray(data.blocks)) {
      filtersEl.innerHTML = data.blocks
        .map((block) => {
          const title = escapeHtml(block.title);
          const isWide = block.title.length > 20 ? ' csr-dropdown--wide' : '';
          const optionsHtml = Array.isArray(block.values)
            ? block.values
                .map((val) => `<button type="button" class="csr-dropdown__option" data-value="${escapeAttr(val)}" role="option">${escapeHtml(val)}</button>`)
                .join('')
            : '';
          return `
            <div class="csr-dropdown${isWide}" data-value="" aria-label="${escapeAttr(block.title)}">
              <button type="button" class="csr-dropdown__trigger" aria-haspopup="listbox" aria-expanded="false">
                <span class="csr-dropdown__label">${title}</span>
                <svg class="csr-dropdown__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div class="csr-dropdown__panel" role="listbox">
                ${optionsHtml}
              </div>
            </div>`;
        })
        .join('');

      if (typeof window.initDropdowns === 'function') {
        window.initDropdowns();
      }
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

  const MONTH_NAMES_NOMINATIVE_RU = [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
  ];

  function formatUpcomingEventDate(course) {
    const range = getCourseDateRange(course);
    if (!range) return { range: '—', month: '' };

    const start = range.from;
    const end = range.to;
    const startDay = start.getDate();
    const endDay = end.getDate();

    if (startDay === endDay) {
      return {
        range: String(startDay),
        month: MONTH_NAMES_NOMINATIVE_RU[start.getMonth()]
      };
    }

    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    if (sameMonth) {
      return {
        range: `${startDay}–${endDay}`,
        month: MONTH_NAMES_NOMINATIVE_RU[start.getMonth()]
      };
    }

    return {
      range: `${startDay}–${endDay}`,
      month: `${MONTH_NAMES_NOMINATIVE_RU[start.getMonth()]}–${MONTH_NAMES_NOMINATIVE_RU[end.getMonth()]}`
    };
  }

  function getUpcomingCourses(courseRegistry, limit = 4) {
    const today = new Date();
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const activeCourses = (courseRegistry || []).filter((course) => course && course.active !== false);

    return activeCourses
      .map((course) => ({
        course,
        startDate: parseIsoDate(course.dateFrom) || new Date(2099, 11, 31)
      }))
      .filter((item) => item.startDate >= todayZero)
      .sort((a, b) => a.startDate - b.startDate)
      .slice(0, limit)
      .map((item) => item.course);
  }

  function renderLandingUpcomingEvents(courseRegistry, options) {
    const list = document.getElementById('landingUpcomingEvents');
    if (!list) return;

    activeCourseRegistry = Array.isArray(courseRegistry) ? courseRegistry : [];
    setupEnrollModal();

    const limit = options?.limit || 4;
    const upcoming = getUpcomingCourses(courseRegistry, limit);

    list.innerHTML = upcoming
      .map((course) => {
        const { range, month } = formatUpcomingEventDate(course);
        const monthHtml = month
          ? `<span class="event-date__month">${escapeHtml(month)}</span>`
          : '';
        const detailAttrs = buildCourseDetailAttrs(course);

        return `<li class="events-list__item">
          <button type="button" class="events-list__btn" ${detailAttrs}>
            <div class="event-date"><span class="event-date__range">${escapeHtml(range)}</span>${monthHtml}</div>
            <div class="event-desc">${escapeHtml(course.title)}</div>
          </button>
        </li>`;
      })
      .join('');

    const allLink = document.getElementById('landingAllEventsLink');
    if (allLink) {
      allLink.href = 'obuchenie.html#schedule';
      window.CrzrtZoomSync?.prepareInternalLink?.(allLink);
    }
  }

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

  function buildEnrollAttrs(course, dateLabel) {
    const forIndividuals = course.forIndividuals !== false;
    const forLegal = course.forLegalEntities !== false;
    return `data-action="enroll" data-course-id="${escapeAttr(course.id)}" data-title="${escapeAttr(course.title || '')}" data-date="${escapeAttr(dateLabel)}" data-for-individuals="${forIndividuals ? 'true' : 'false'}" data-for-legal="${forLegal ? 'true' : 'false'}"`;
  }

  function buildCourseDetailAttrs(course) {
    return `data-action="course-detail" data-course-id="${escapeAttr(course.id)}"`;
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
        const enrollAttrs = buildEnrollAttrs(c, dateLabel);
        const detailAttrs = buildCourseDetailAttrs(c);

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
          <button type="button" class="occ-card__btn" ${enrollAttrs}>Записаться</button>
          <button type="button" class="occ-card__more" ${detailAttrs}>подробнее ${MORE_ARROW_SVG}</button>
        </article>`;
      })
      .join('');
  }

  function renderTestingBanner(testingBanner) {
    const data = testingBanner || OBUCHENIE_DEFAULTS.testingBanner;
    const bannerEl = document.querySelector('.obuchenie-testing-banner');
    const contentEl = document.querySelector('.obuchenie-testing-banner__content');
    const titleEl = document.querySelector('.obuchenie-testing-banner__title');
    const btnEl = document.querySelector('.obuchenie-testing-banner__btn');
    const imageEl = document.querySelector('.obuchenie-testing-banner__image');
    const image = (data.image || '').trim();
    const hasCustomLayout = data.titleTop !== undefined
      || data.titleLeft !== undefined
      || data.btnBottom !== undefined
      || data.btnLeft !== undefined;

    if (contentEl) {
      if (hasCustomLayout) {
        contentEl.style.position = 'absolute';
        contentEl.style.inset = '0';
        contentEl.style.padding = '0';
        contentEl.style.gap = '0';
        contentEl.style.justifyContent = 'flex-start';
      } else {
        contentEl.style.position = '';
        contentEl.style.inset = '';
        contentEl.style.padding = '';
        contentEl.style.gap = '';
        contentEl.style.justifyContent = '';
      }
    }

    if (titleEl) {
      titleEl.innerHTML = multilineHtml(data.title);
      if (data.titleColor) {
        titleEl.style.color = data.titleColor;
      } else {
        titleEl.style.color = '';
      }
      if (hasCustomLayout) {
        titleEl.style.position = 'absolute';
        titleEl.style.margin = '0';
        titleEl.style.top = `${data.titleTop !== undefined ? data.titleTop : 68}px`;
        titleEl.style.left = `${data.titleLeft !== undefined ? data.titleLeft : 60}px`;
        titleEl.style.maxWidth = `calc(100% - ${data.titleLeft !== undefined ? data.titleLeft : 60}px - 24px)`;
      } else {
        titleEl.style.position = '';
        titleEl.style.top = '';
        titleEl.style.left = '';
        titleEl.style.maxWidth = '';
      }
      applyTypographyStyles(titleEl, data.titleFontSize, data.titleFontWeight, data.titleItalic, data.titleUnderline);
    }
    
    if (btnEl) {
      btnEl.textContent = data.btnText || OBUCHENIE_DEFAULTS.testingBanner.btnText;
      let btnLink = (data.btnLink || 'testing.html').trim();
      if (btnLink === '#contacts' || btnLink === '' || btnLink === '#') {
        btnLink = 'testing.html';
      }
      btnEl.href = btnLink;
      
      if (hasCustomLayout) {
         btnEl.style.position = 'absolute';
         btnEl.style.margin = '0';
         btnEl.style.bottom = `${data.btnBottom !== undefined ? data.btnBottom : 65}px`;
         btnEl.style.left = `${data.btnLeft !== undefined ? data.btnLeft : (data.titleLeft !== undefined ? data.titleLeft : 60)}px`;
         btnEl.style.top = 'auto';
      } else {
         btnEl.style.position = '';
         btnEl.style.margin = '';
         btnEl.style.bottom = '';
         btnEl.style.left = '';
         btnEl.style.top = '';
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
    activeCourseRegistry = Array.isArray(data.courseRegistry) ? data.courseRegistry : [];
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
    parseBitrixFormRef,
    formatBitrixFormRef,
    normalizeBitrixForm,
    configureEnrollModalAudience,
    openEnrollModal,
    setEnrollAudienceMode,
    loadObuchenieDataFromApi,
    loadObuchenieDataFromLocal,
    renderObucheniePage,
    getUpcomingCourses,
    formatUpcomingEventDate,
    renderLandingUpcomingEvents
  };

  if (isObucheniePage) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initObuchenieContent);
    } else {
      initObuchenieContent();
    }
  }
})();
