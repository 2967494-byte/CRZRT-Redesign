/**
 * Контент страницы «Сопровождение» — загрузка из API / localStorage и отрисовка.
 */
(function () {
  const STORAGE_KEY = 'crzrt_support_page_data';
  const CONTENT_PENDING_CLASS = 'support-content-pending';
  const CONTENT_READY_CLASS = 'support-content-ready';

  const DOWNLOAD_ARROW_SVG =
    '<span class="arrow-down-right"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L11 11M11 11V3M11 11H3" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

  const MANUAL_PDF_ICON_SRC = 'assets/img/ecp/icon-pdf.png';

  const VIDEO_PLAY_SVG =
    '<svg class="ecp-video-card__play" width="134" height="134" viewBox="0 0 134 134" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="67" cy="67" r="63" stroke="white" stroke-width="6"/><path d="M90 67L54 87.5V46.5L90 67Z" fill="white"/></svg>';

  const MORE_ARROW_SVG =
    '<span class="support-service-card__more-arrow" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L11 11M11 11V3M11 11H3" stroke="#FF5512" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

  const CHECKLIST_ICON_SRC = 'assets/img/support/checklist-icon-inner.png';

  const DEFAULT_NAV_CARDS = [
    {
      label: 'Для\nзаказчиков',
      href: '#for-customers',
      icon: 'assets/img/support/icon-customers.png?v=2'
    },
    {
      label: 'Для\nпоставщиков',
      href: '#for-suppliers',
      icon: 'assets/img/support/icon-suppliers.png?v=2'
    },
    {
      label: 'Консультация\nспециалиста',
      href: '#consultation',
      icon: 'assets/img/support/icon-consultation.png?v=2'
    }
  ];

  const DEFAULT_CUSTOMER_SERVICES = [
    {
      title: 'Разработка\nположения о закупках',
      price: 'от 10 000 руб.',
      btnText: 'Оставить заявку',
      btnLink: '#contacts',
      moreLink: '#'
    },
    {
      title: 'Подготовка\nзакупочной документации',
      price: 'от 10 000 руб.',
      btnText: 'Оставить заявку',
      btnLink: '#contacts',
      moreLink: '#'
    },
    {
      title: 'Комплексное\nсопровождение',
      price: 'от 10 000 руб.',
      btnText: 'Оставить заявку',
      btnLink: '#contacts',
      moreLink: '#'
    }
  ];

  const DEFAULT_CUSTOMER_CHECKLIST = {
    title: 'Чек-лист подготовки\nзакупочной документации',
    items: [
      { lines: ['Контрольный', 'список заказчика', 'при проведении закупки'], file: '' },
      { lines: ['Чек-лист', 'соблюдения требований', 'законодательства'], file: '' },
      { lines: ['Контроль', 'процедур закупочной', 'деятельности'], file: '' },
      { lines: ['Чек-лист проверки', 'обоснования закупки'], file: '' },
      { lines: ['Чек-лист формирования', 'технического задания'], file: '' }
    ]
  };

  const DEFAULT_SUPPLIER_SERVICES = [
    {
      title: 'Подбор\nтендеров',
      price: 'от 10 000 руб.',
      btnText: 'Оставить заявку',
      btnLink: '#contacts',
      moreLink: '#'
    },
    {
      title: 'Помощь участия\nв торгах',
      price: 'от 10 000 руб.',
      btnText: 'Оставить заявку',
      btnLink: '#contacts',
      moreLink: '#'
    },
    {
      title: 'Защита интересов\nв ФАС и в судах',
      price: 'от 10 000 руб.',
      btnText: 'Оставить заявку',
      btnLink: '#contacts',
      moreLink: '#'
    }
  ];

  const DEFAULT_SUPPLIER_CHECKLIST = {
    title: 'Чек-лист: как подать заявку\nбез ошибок',
    items: [
      { lines: ['Готова ли ваша заявка?', 'Быстрый чек-лист'], file: '' },
      { lines: ['Чек-лист участника:', 'от поиска до победы'], file: '' },
      { lines: ['Проверка заявки', 'за 10 минут'], file: '' },
      { lines: ['Чек-лист перед подачей', 'на тендер'], file: '' },
      { lines: ['Чек-лист участия в закупке', '«под ключ»'], file: '' }
    ]
  };

  const SUPPORT_DEFAULTS = {
    hero: {
      background: '',
      title: 'Надежное тендерное\nсопровождение',
      titleColor: '#000000', titleTop: 122, titleLeft: 70,
      subtitle:
        'Комплексная помощь экспертов на всех этапах закупок: от подготовки документации до заключения контракта и исполнения обязательств.',
      subtitleColor: '#333333', subtitleTop: 213, subtitleLeft: 70
    },
    navCards: DEFAULT_NAV_CARDS.map((card) => ({ ...card })),
    customers: {
      title: 'Для заказчиков',
      services: DEFAULT_CUSTOMER_SERVICES.map((item) => ({ ...item })),
      checklist: {
        title: DEFAULT_CUSTOMER_CHECKLIST.title,
        items: DEFAULT_CUSTOMER_CHECKLIST.items.map((item) => ({ lines: [...item.lines], file: item.file }))
      }
    },
    calculator: {
      title:
        'Расчет начальной (максимальной) цены контракта методом сопоставимых рыночных цен (анализа рынка)',
      image: ''
    },
    suppliers: {
      title: 'Для поставщиков',
      services: DEFAULT_SUPPLIER_SERVICES.map((item) => ({ ...item })),
      checklist: {
        title: DEFAULT_SUPPLIER_CHECKLIST.title,
        items: DEFAULT_SUPPLIER_CHECKLIST.items.map((item) => ({ lines: [...item.lines], file: item.file }))
      }
    },
    tariffs: [
      { text: 'Тарифы торговых\nпроцедур', file: '' },
      { text: 'Тарифы АО\n«Татспиртпром»', file: '' },
      { text: 'Индивидуальные тарифы', file: '' },
      { text: 'Тарифы АНО ВО\n«Университет Иннополис»', file: '' }
    ],
    blanks: {
      patternImage: 'uploads/d4cfd570b4a2548242759c7e47ea853918a2254c.png',
      items: [
        { text: 'Бланк доверенности\nна Представителя, включаемого\nв личный кабинет;', file: '' },
        { text: 'Бланк заявления\nна запрос логина Представителя;', file: '' },
        { text: 'Бланк заявления на включение\nПредставителя в личный кабинет;', file: '' },
        { text: 'Бланк перечня используемых\nЗаказчиком способов закупок\nи протоколов.', file: '' }
      ]
    },
    manual: {
      bookImage: 'uploads/etp-book.png',
      items: [
        { title: 'Регламент пользования АИС ЭТП ЦРЗ РТ;', file: '' },
        { title: 'Инструкция по настройке АРМ;', file: '' },
        { title: 'Инструкция по работе Заказчика;', file: '' },
        { title: 'Инструкция по работе участника.', file: '' }
      ]
    },
    videos: [
      { url: '', title: 'Инструкция по созданию и наполнению плана закупок;', thumbnail: '' },
      { url: '', title: 'Инструкция по созданию закупки через Мастер создания закупки по плану;', thumbnail: '' },
      { url: '', title: 'Инструкция по созданию коммерческих закупок;', thumbnail: '' },
      { url: '', title: 'Инструкция по формированию ответа на запрос разъяснений;', thumbnail: '' },
      { url: '', title: 'Инструкция по рассмотрению заявок и размещению протокола;', thumbnail: '' },
      { url: '', title: 'Инструкция по отправке договора на подписание участнику;', thumbnail: '' },
      { url: '', title: 'Инструкция по подписанию договора;', thumbnail: '' },
      { url: '', title: 'Инструкция по прикреплению/обновлению ЭП.', thumbnail: '' }
    ],
    support: {
      background: '',
      title: 'Оперативная поддержка',
      items: [
        'Информационно-техническая поддержка',
        'Персональный менеджер 24/7',
        'Автоматическая рассылка приглашений к участию в закупке',
        'Аналитические отчеты (как стандартные, так и по запросу)'
      ],
      buttonText: 'Узнать подробнее',
      buttonLink: '#contacts'
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

  function migrateAudienceSection(rawSection, defaults) {
    const raw = rawSection && typeof rawSection === 'object' ? rawSection : {};
    const services =
      Array.isArray(raw.services) && raw.services.length
        ? raw.services.map((item) => ({
            title: item?.title || '',
            price: item?.price || '',
            btnText: item?.btnText || 'Оставить заявку',
            btnLink: item?.btnLink || '#contacts',
            moreLink: item?.moreLink || '#'
          }))
        : defaults.services.map((item) => ({ ...item }));

    const rawChecklist = raw.checklist && typeof raw.checklist === 'object' ? raw.checklist : {};
    const checklistItems =
      Array.isArray(rawChecklist.items) && rawChecklist.items.length
        ? rawChecklist.items.map((item) => ({
            lines: Array.isArray(item?.lines)
              ? item.lines.map((line) => String(line || '').trim()).filter(Boolean)
              : String(item?.text || '')
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean),
            file: item?.file || ''
          }))
        : defaults.checklist.items.map((item) => ({ lines: [...item.lines], file: item.file || '' }));

    return {
      title: raw.title || defaults.title,
      services,
      checklist: {
        title: rawChecklist.title || defaults.checklist.title,
        items: checklistItems
      }
    };
  }

  function migrateSupportPageData(raw) {
    const rawHero = raw?.hero && typeof raw.hero === 'object' ? raw.hero : {};
    const hero = {
      background: rawHero.background || '',
      title: rawHero.title !== undefined ? rawHero.title : SUPPORT_DEFAULTS.hero.title,
      titleColor: rawHero.titleColor || SUPPORT_DEFAULTS.hero.titleColor,
      titleTop: rawHero.titleTop !== undefined ? rawHero.titleTop : SUPPORT_DEFAULTS.hero.titleTop,
      titleLeft: rawHero.titleLeft !== undefined ? rawHero.titleLeft : SUPPORT_DEFAULTS.hero.titleLeft,
      subtitle: rawHero.subtitle !== undefined ? rawHero.subtitle : SUPPORT_DEFAULTS.hero.subtitle,
      subtitleColor: rawHero.subtitleColor || SUPPORT_DEFAULTS.hero.subtitleColor,
      subtitleTop: rawHero.subtitleTop !== undefined ? rawHero.subtitleTop : SUPPORT_DEFAULTS.hero.subtitleTop,
      subtitleLeft: rawHero.subtitleLeft !== undefined ? rawHero.subtitleLeft : SUPPORT_DEFAULTS.hero.subtitleLeft
    };

    const navCards =
      Array.isArray(raw?.navCards) && raw.navCards.length
        ? raw.navCards.map((card, i) => ({
            label: card?.label || DEFAULT_NAV_CARDS[i]?.label || '',
            href: card?.href || DEFAULT_NAV_CARDS[i]?.href || '#',
            icon: card?.icon || DEFAULT_NAV_CARDS[i]?.icon || ''
          }))
        : DEFAULT_NAV_CARDS.map((card) => ({ ...card }));

    const customers = migrateAudienceSection(raw?.customers, SUPPORT_DEFAULTS.customers);
    const suppliers = migrateAudienceSection(raw?.suppliers, SUPPORT_DEFAULTS.suppliers);

    const rawCalc = raw?.calculator && typeof raw.calculator === 'object' ? raw.calculator : {};
    const calculator = {
      title: rawCalc.title || SUPPORT_DEFAULTS.calculator.title,
      image: rawCalc.image || ''
    };

    const data = {
      hero,
      navCards,
      customers,
      calculator,
      suppliers,
      tariffs: Array.isArray(raw?.tariffs) && raw.tariffs.length ? raw.tariffs : [...SUPPORT_DEFAULTS.tariffs],
      blanks: {
        patternImage: raw?.blanks?.patternImage || SUPPORT_DEFAULTS.blanks.patternImage,
        items:
          Array.isArray(raw?.blanks?.items) && raw.blanks.items.length
            ? raw.blanks.items
            : [...SUPPORT_DEFAULTS.blanks.items]
      },
      manual: {
        bookImage: raw?.manual?.bookImage || SUPPORT_DEFAULTS.manual.bookImage,
        items:
          Array.isArray(raw?.manual?.items) && raw.manual.items.length
            ? raw.manual.items
            : [...SUPPORT_DEFAULTS.manual.items]
      },
      videos: Array.isArray(raw?.videos) && raw.videos.length ? raw.videos : [...SUPPORT_DEFAULTS.videos],
      support: migrateSupportData(raw?.support)
    };

    return data;
  }

  function migrateSupportData(rawSupport) {
    const raw = rawSupport && typeof rawSupport === 'object' ? rawSupport : {};
    let items = [];

    if (Array.isArray(raw.items)) {
      items = raw.items.map((item) => String(item || '').trim()).filter(Boolean);
    } else if (typeof raw.items === 'string') {
      items = raw.items.split('\n').map((item) => item.trim()).filter(Boolean);
    }

    if (!items.length) {
      items = [...SUPPORT_DEFAULTS.support.items];
    }

    return {
      background: raw.background || raw.image || '',
      title: raw.title || SUPPORT_DEFAULTS.support.title,
      items,
      buttonText: raw.buttonText || SUPPORT_DEFAULTS.support.buttonText,
      buttonLink: raw.buttonLink || SUPPORT_DEFAULTS.support.buttonLink
    };
  }

  function markSupportContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }

  function loadSupportDataFromLocal() {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateSupportPageData(JSON.parse(local));
    } catch (error) {
      console.warn('Support: localStorage parse error', error);
    }
    return null;
  }

  async function loadSupportDataFromApi() {
    try {
      const resp = await fetch(`api/settings.php?key=${STORAGE_KEY}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data && typeof data === 'object' && Object.keys(data).length) {
          return migrateSupportPageData(data);
        }
      }
    } catch (error) {
      console.warn('Support: API unavailable', error);
    }
    return null;
  }

  function fileLinkAttrs(file) {
    const href = (file || '').trim() || '#';
    const isDownload = href !== '#' && !/^https?:\/\//i.test(href);
    const download = isDownload ? ' download' : '';
    const target = /^https?:\/\//i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return { href: escapeHtml(href), download, target };
  }

  function youtubeVideoId(url) {
    const match = String(url || '').match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : '';
  }

  function rutubeVideoId(url) {
    const match = String(url || '').match(/rutube\.ru\/video\/([a-f0-9]+)/i);
    return match ? match[1] : '';
  }

  function vkVideoId(url) {
    const str = String(url || '');
    const patterns = [
      /(?:vk\.com|vkvideo\.ru|vk\.ru|m\.vk\.com)\/video(-?\d+)_(\d+)/i,
      /[?&]z=video(-?\d+)_(\d+)/i,
      /[?&]vid=(-?\d+)_(\d+)/i
    ];
    for (const pattern of patterns) {
      const match = str.match(pattern);
      if (match) return `${match[1]}_${match[2]}`;
    }
    const oidMatch = str.match(/[?&]oid=(-?\d+)/i);
    const idMatch = str.match(/[?&]id=(\d+)/i);
    if (oidMatch && idMatch) return `${oidMatch[1]}_${idMatch[1]}`;
    return '';
  }

  function vkVideoThumbProxyUrl(url) {
    if (!vkVideoId(url)) return '';
    return `api/video-thumb.php?url=${encodeURIComponent(url)}&proxy=1`;
  }

  function resolveVideoThumbnail(video) {
    if (video?.thumbnail) return video.thumbnail;
    const youtubeId = youtubeVideoId(video?.url);
    if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    const rutubeId = rutubeVideoId(video?.url);
    if (rutubeId) return `https://pic.rutube.ru/video/${rutubeId}.jpg`;
    return vkVideoThumbProxyUrl(video?.url);
  }

  function renderHero(hero) {
    const banner = document.querySelector('.consulting-hero');
    const contentEl = document.querySelector('.consulting-hero__content');
    const titleEl = document.querySelector('.consulting-hero-title');
    const subtitleEl = document.querySelector('.consulting-hero-subtitle');
    const graphicEl = document.querySelector('.consulting-banner__graphic');
    const background = (hero?.background || '').trim();
    const hasCustomBanner = Boolean(background);

    if (titleEl) {
      titleEl.innerHTML = multilineHtml(hero?.title);
      if (hero?.titleColor) titleEl.style.color = hero.titleColor;
      else titleEl.style.removeProperty('color');
    }
    if (subtitleEl) {
      subtitleEl.innerHTML = multilineHtml(hero?.subtitle);
      if (hero?.subtitleColor) subtitleEl.style.color = hero.subtitleColor;
      else subtitleEl.style.removeProperty('color');
    }

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

    if (contentEl) contentEl.classList.remove('is-hidden');
    if (graphicEl) graphicEl.classList.toggle('is-hidden', hasCustomBanner);

    document.dispatchEvent(new CustomEvent('heroSlidesUpdated', { detail: { count: 1 } }));
  }

  function renderNavCards(navCards) {
    const grid = document.querySelector('.support-nav-cards');
    if (!grid) return;
    const list = navCards?.length ? navCards : SUPPORT_DEFAULTS.navCards;
    grid.innerHTML = list
      .map((card) => {
        const href = escapeHtml((card.href || '#').trim() || '#');
        const icon = escapeAttr((card.icon || '').trim() || 'assets/img/support/icon-customers.png');
        return `<a href="${href}" class="ecp-card">
          <div class="ecp-card__icon-wrap">
            <img src="${icon}" alt="" class="ecp-card__icon" width="122" height="154" decoding="async">
          </div>
          <div class="ecp-card__label">${multilineHtml(card.label)}</div>
        </a>`;
      })
      .join('');
  }

  function renderServiceCards(container, services) {
    if (!container) return;
    const list = services?.length ? services : [];
    container.innerHTML = list
      .map((item) => {
        const btnHref = escapeHtml((item.btnLink || '#contacts').trim() || '#contacts');
        const moreHref = escapeHtml((item.moreLink || '#').trim() || '#');
        const price = escapeHtml(item.price || '');
        return `<article class="support-service-card">
          <h3 class="support-service-card__title">${multilineHtml(item.title)}</h3>
          <p class="support-service-card__price">${price.replace(/ /g, '&nbsp;')}</p>
          <a href="${btnHref}" class="support-service-card__btn">${escapeHtml(item.btnText || 'Оставить заявку')}</a>
          <a href="${moreHref}" class="support-service-card__more">
            подробнее
            ${MORE_ARROW_SVG}
          </a>
        </article>`;
      })
      .join('');
  }

  function renderChecklistBlock(checklistEl, checklist) {
    if (!checklistEl) return;
    const data = checklist || { title: '', items: [] };
    const titleEl = checklistEl.querySelector('.support-checklist__title');
    const gridEl = checklistEl.querySelector('.support-checklist-grid');
    if (titleEl) titleEl.innerHTML = multilineHtml(data.title);
    if (!gridEl) return;

    const items = data.items?.length ? data.items : [];
    gridEl.innerHTML = items
      .map((item) => {
        const lines = Array.isArray(item.lines) ? item.lines : [];
        const textClass =
          lines.length <= 2
            ? 'support-checklist-card__text support-checklist-card__text--bottom'
            : 'support-checklist-card__text';
        const linesHtml = lines
          .map((line) => `<span class="support-checklist-card__text-line">${escapeHtml(line)}</span>`)
          .join('');
        const link = fileLinkAttrs(item.file);
        return `<div class="support-checklist-item">
          <div class="support-checklist-card">
            <div class="support-checklist-card__icon" aria-hidden="true">
              <span class="support-checklist-card__icon-bg"></span>
              <img src="${CHECKLIST_ICON_SRC}" alt="" class="support-checklist-card__icon-inner" width="75" height="76" decoding="async">
            </div>
            <p class="${textClass}">${linesHtml}</p>
          </div>
          <a href="${link.href}" class="support-checklist-card__download"${link.target}${link.download}>
            скачать
            ${MORE_ARROW_SVG.replace('support-service-card__more-arrow', 'support-checklist-card__download-arrow')}
          </a>
        </div>`;
      })
      .join('');
  }

  function renderAudienceSection(sectionId, titleSelector, section) {
    const root = document.getElementById(sectionId);
    if (!root) return;
    const titleEl = root.querySelector(titleSelector);
    if (titleEl) titleEl.textContent = section?.title || '';
    renderServiceCards(root.querySelector('.support-service-cards'), section?.services);
    renderChecklistBlock(root.querySelector('.support-checklist'), section?.checklist);
  }

  function renderCalculator(calculator) {
    const data = calculator || SUPPORT_DEFAULTS.calculator;
    const titleEl = document.querySelector('.support-calculator__title');
    const infoEl = document.querySelector('.support-calculator__info');
    if (titleEl) titleEl.textContent = data.title || SUPPORT_DEFAULTS.calculator.title;
    if (!infoEl) return;
    const image = (data.image || '').trim();
    const gradient = 'linear-gradient(135deg, #FF5512 0%, #FF8A4C 55%, #FFC9A8 100%)';
    if (image) {
      infoEl.style.backgroundImage = `url('${image.replace(/'/g, "\\'")}'), ${gradient}`;
      infoEl.style.backgroundSize = 'cover, auto';
      infoEl.style.backgroundPosition = 'center, center';
    } else {
      infoEl.style.backgroundImage = gradient;
      infoEl.style.backgroundSize = '';
      infoEl.style.backgroundPosition = '';
    }
  }

  function renderTariffs(tariffs) {
    const grid = document.querySelector('.ecp-tariffs__grid');
    if (!grid) return;
    const list = tariffs && tariffs.length ? tariffs : SUPPORT_DEFAULTS.tariffs;
    grid.innerHTML = list
      .map((item) => {
        const link = fileLinkAttrs(item.file);
        return `<a href="${link.href}" class="ecp-tariff-card"${link.target}${link.download}>
          <div class="ecp-tariff-card__icon-circle">
            <img src="assets/img/ecp/icon-tariff.png" alt="" class="ecp-tariff-card__icon" width="103" height="103" decoding="async">
          </div>
          <span class="ecp-tariff-card__text">${multilineHtml(item.text)}</span>
          <div class="ecp-tariff-card__download">скачать ${DOWNLOAD_ARROW_SVG}</div>
        </a>`;
      })
      .join('');
  }

  function renderBlanks(blanks) {
    const patternImage = document.getElementById('image_blank');
    if (patternImage && blanks?.patternImage) {
      patternImage.setAttribute('href', blanks.patternImage);
    }

    const grid = document.querySelector('.ecp-blanks__grid');
    if (!grid) return;
    const list = blanks?.items?.length ? blanks.items : SUPPORT_DEFAULTS.blanks.items;
    grid.innerHTML = list
      .map((item) => {
        const link = fileLinkAttrs(item.file);
        return `<a href="${link.href}" class="ecp-blank-card"${link.target}${link.download}>
          <div class="ecp-blank-card__content">
            <span class="ecp-blank-card__text">${multilineHtml(item.text)}</span>
            <div class="ecp-blank-card__download">скачать ${DOWNLOAD_ARROW_SVG}</div>
          </div>
          <div class="ecp-blank-card__icon">
            <svg width="90" height="107" viewBox="0 0 90 107">
              <rect width="90" height="107" fill="url(#pattern_blank)"/>
            </svg>
          </div>
        </a>`;
      })
      .join('');
  }

  function renderManual(manual) {
    const listEl = document.querySelector('.ecp-manual__list');
    const bookEl = document.querySelector('.ecp-manual__image');
    const items = manual?.items?.length ? manual.items : SUPPORT_DEFAULTS.manual.items;

    if (listEl) {
      listEl.innerHTML = items
        .map((item) => {
          const link = fileLinkAttrs(item.file);
          return `<li class="ecp-manual__item">
            <img src="${MANUAL_PDF_ICON_SRC}" alt="" class="ecp-manual__icon" width="45" height="51" decoding="async">
            <a href="${link.href}" class="ecp-manual__link"${link.target}${link.download}>${escapeHtml(item.title)}</a>
          </li>`;
        })
        .join('');
    }

    if (bookEl && manual?.bookImage) {
      bookEl.src = manual.bookImage;
    }
  }

  function renderVideos(videos) {
    const grid = document.querySelector('.ecp-videos__grid');
    if (!grid) return;
    const list = videos && videos.length ? videos : SUPPORT_DEFAULTS.videos;
    grid.innerHTML = list
      .map((video) => {
        const href = (video.url || '').trim() || '#';
        const thumb = resolveVideoThumbnail(video);
        const thumbStyle = thumb
          ? ` style="background-image:url('${escapeAttr(thumb)}');background-size:cover;background-position:center;"`
          : '';
        const target = href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${escapeHtml(href)}" class="ecp-video-card"${target}>
          <div class="ecp-video-card__thumbnail"${thumbStyle}>
            ${VIDEO_PLAY_SVG}
          </div>
          <div class="ecp-video-card__label">${escapeHtml(video.title)}</div>
        </a>`;
      })
      .join('');

    if (window.__reinitReveal) window.__reinitReveal('.ecp-video-card');
  }

  function bindSupportButton(support) {
    const btn = document.querySelector('.ecp-support-banner__btn');
    if (!btn) return;
    const link = (support?.buttonLink || '#contacts').trim();
    btn.textContent = support?.buttonText || SUPPORT_DEFAULTS.support.buttonText;

    btn.type = 'button';
    btn.onclick = function () {
      if (link.startsWith('#')) {
        const target = document.querySelector(link);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (/^https?:\/\//i.test(link)) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else if (link && link !== '#') {
        window.location.href = link;
      }
    };
  }

  function renderSupport(support) {
    const banner = document.querySelector('.ecp-support-banner');
    const titleEl = document.querySelector('.ecp-support-banner__title');
    const listEl = document.querySelector('.ecp-support-banner__list');
    const graphicEl = document.querySelector('.ecp-support-banner__graphic');
    const data = migrateSupportData(support);
    const background = (data.background || '').trim();
    const hasCustomBanner = Boolean(background);

    if (titleEl) titleEl.textContent = data.title;
    if (listEl) {
      listEl.innerHTML = data.items
        .map((item) => `<li class="ecp-support-banner__item">${escapeHtml(item)}</li>`)
        .join('');
    }

    if (banner) {
      if (hasCustomBanner) {
        banner.style.backgroundImage = `url('${background.replace(/'/g, "\\'")}')`;
        banner.classList.add('ecp-support-banner--custom-bg');
      } else {
        banner.style.backgroundImage = '';
        banner.classList.remove('ecp-support-banner--custom-bg');
      }
    }

    if (graphicEl) graphicEl.classList.toggle('is-hidden', hasCustomBanner);
    bindSupportButton(data);
  }

  function renderSupportPage(data) {
    renderHero(data.hero);
    renderNavCards(data.navCards);
    renderAudienceSection('for-customers', '.support-customers-section__title', data.customers);
    renderCalculator(data.calculator);
    renderAudienceSection('for-suppliers', '.support-suppliers-section__title', data.suppliers);
    renderTariffs(data.tariffs);
    renderBlanks(data.blanks);
    renderManual(data.manual);
    renderVideos(data.videos);
    renderSupport(data.support);
    document.dispatchEvent(new CustomEvent('supportContentReady', { detail: data }));
  }

  function initSupportLawToggle() {
    const toggle = document.querySelector('.support-law-toggle');
    const btn = toggle?.querySelector('.support-law-toggle__switch');
    if (!toggle || !btn) return;

    const labels = toggle.querySelectorAll('.support-law-toggle__label');

    function setLaw(law) {
      const is223 = law === '223';
      toggle.classList.toggle('support-law-toggle--223', is223);
      toggle.classList.toggle('support-law-toggle--44', !is223);
      btn.setAttribute('aria-pressed', is223 ? 'true' : 'false');
      labels.forEach((label) => {
        label.classList.toggle('support-law-toggle__label--active', label.dataset.law === law);
      });
      toggle.dispatchEvent(new CustomEvent('supportLawChange', { detail: { law } }));
    }

    btn.addEventListener('click', () => {
      setLaw(toggle.classList.contains('support-law-toggle--223') ? '44' : '223');
    });
  }

  async function initSupportContent() {
    try {
      const localData = loadSupportDataFromLocal();
      const initialData = localData || migrateSupportPageData(null);
      renderSupportPage(initialData);
      initSupportLawToggle();
      markSupportContentReady();

      const apiData = await loadSupportDataFromApi();
      if (apiData) {
        renderSupportPage(apiData);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
        } catch (error) {
          console.warn('Support: localStorage update failed', error);
        }
      }
    } catch (error) {
      console.error('Support content init failed', error);
      markSupportContentReady();
    }
  }

  window.SupportContent = {
    STORAGE_KEY,
    SUPPORT_DEFAULTS,
    migrateSupportPageData,
    migrateSupportData,
    loadSupportDataFromApi,
    loadSupportDataFromLocal,
    resolveVideoThumbnail,
    vkVideoId,
    vkVideoThumbProxyUrl
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupportContent);
  } else {
    initSupportContent();
  }
})();
