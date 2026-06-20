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

  const OBUCHENIE_DEFAULTS = {
    hero: {
      background: '',
      title: 'Обучение\nгосзакупкам',
      subtitle:
        'Как зарабатывать на госзакупках и тендерах: практические курсы и программы для заказчиков и поставщиков.',
      gavelImage: 'assets/img/consulting/banner-gavel.png',
      titleColor: '#00AE4D',
      subtitleColor: '#FFFFFF'
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
      promoTitle: 'Защищаем ваши интересы',
      promoImage: 'assets/img/img1_processed.png',
      allCoursesLink: '#courses',
      courseDaysByMonth: {
        '2026-5': [5, 8, 15, 20],
        '2026-6': [3, 10, 17, 24]
      }
    },
    courseCards: DEFAULT_COURSE_CARDS.map((card) => ({ ...card })),
    testingBanner: {
      title: 'Проверь себя\nв госзакупках',
      btnText: 'Пройти тест',
      btnLink: '#contacts',
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

    return {
      hero: {
        background: rawHero.background || '',
        title: rawHero.title || OBUCHENIE_DEFAULTS.hero.title,
        subtitle: rawHero.subtitle || OBUCHENIE_DEFAULTS.hero.subtitle,
        gavelImage: rawHero.gavelImage || OBUCHENIE_DEFAULTS.hero.gavelImage,
        titleColor: rawHero.titleColor || OBUCHENIE_DEFAULTS.hero.titleColor,
        subtitleColor: rawHero.subtitleColor || OBUCHENIE_DEFAULTS.hero.subtitleColor
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
        promoImage: rawCalendar.promoImage || OBUCHENIE_DEFAULTS.calendar.promoImage,
        allCoursesLink: rawCalendar.allCoursesLink || OBUCHENIE_DEFAULTS.calendar.allCoursesLink,
        courseDaysByMonth: normalizeCourseDays(rawCalendar.courseDaysByMonth)
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
      testingBanner: {
        title: raw?.testingBanner?.title || OBUCHENIE_DEFAULTS.testingBanner.title,
        btnText: raw?.testingBanner?.btnText || OBUCHENIE_DEFAULTS.testingBanner.btnText,
        btnLink: raw?.testingBanner?.btnLink || OBUCHENIE_DEFAULTS.testingBanner.btnLink,
        image: raw?.testingBanner?.image || OBUCHENIE_DEFAULTS.testingBanner.image
      }
    };
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
    }
    if (subtitleEl) {
      subtitleEl.innerHTML = multilineHtml(hero?.subtitle);
      subtitleEl.style.color = hero?.subtitleColor || OBUCHENIE_DEFAULTS.hero.subtitleColor;
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

  function renderCalendar(calendar) {
    const data = calendar || OBUCHENIE_DEFAULTS.calendar;
    const titleEl = document.querySelector('.obuchenie-calendar-promo__title');
    const imageEl = document.querySelector('.obuchenie-calendar-promo__image');
    const allLinkEl = document.querySelector('.obuchenie-calendar-block__all');

    if (titleEl) titleEl.textContent = data.promoTitle || OBUCHENIE_DEFAULTS.calendar.promoTitle;
    if (imageEl && data.promoImage) {
      imageEl.src = data.promoImage;
    }
    if (allLinkEl) {
      allLinkEl.href = (data.allCoursesLink || '#courses').trim() || '#courses';
    }

    if (window.ObuchenieCalendar?.setCourseDays) {
      window.ObuchenieCalendar.setCourseDays(data.courseDaysByMonth);
    }
  }

  function renderCourseCards(courseCards) {
    const grid = document.querySelector('.obuchenie-course-cards');
    if (!grid) return;
    const list = courseCards?.length ? courseCards : OBUCHENIE_DEFAULTS.courseCards;

    grid.innerHTML = list
      .map((card) => {
        const btnHref = escapeHtml((card.btnLink || '#contacts').trim() || '#contacts');
        const moreHref = escapeHtml((card.moreLink || '#courses').trim() || '#courses');
        const price = escapeHtml(card.price || '');
        return `<article class="occ-card">
          <h3 class="occ-card__title">${escapeHtml(card.title)}</h3>
          <p class="occ-card__price">${price.replace(/ /g, '&nbsp;')}</p>
          <div class="occ-card__stats">
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
  }

  function renderTestingBanner(testingBanner) {
    const data = testingBanner || OBUCHENIE_DEFAULTS.testingBanner;
    const titleEl = document.querySelector('.obuchenie-testing-banner__title');
    const btnEl = document.querySelector('.obuchenie-testing-banner__btn');
    const graphicEl = document.querySelector('.obuchenie-testing-banner__graphic');

    if (titleEl) titleEl.innerHTML = multilineHtml(data.title);
    if (btnEl) {
      btnEl.textContent = data.btnText || OBUCHENIE_DEFAULTS.testingBanner.btnText;
      btnEl.href = (data.btnLink || '#contacts').trim() || '#contacts';
    }

    if (graphicEl) {
      const image = (data.image || '').trim();
      if (image) {
        graphicEl.innerHTML = `<img src="${escapeAttr(image)}" alt="" class="obuchenie-testing-banner__image" decoding="async">`;
      } else {
        graphicEl.innerHTML = '';
      }
    }
  }

  function renderObucheniePage(data) {
    renderHero(data.hero);
    renderNavCards(data.navCards);
    renderCourseSearch(data.courseSearch);
    renderCalendar(data.calendar);
    renderCourseCards(data.courseCards);
    renderTestingBanner(data.testingBanner);
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
    migrateObucheniePageData,
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
