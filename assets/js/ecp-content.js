/**
 * Контент страницы ЭТП — загрузка из API / localStorage и отрисовка.
 */
(function () {
  const STORAGE_KEY = 'crzrt_ecp_page_data';
  const CONTENT_PENDING_CLASS = 'ecp-content-pending';
  const CONTENT_READY_CLASS = 'ecp-content-ready';

  const DOWNLOAD_ARROW_SVG =
    '<span class="arrow-down-right"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L11 11M11 11V3M11 11H3" stroke="#1D9DFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

  const MANUAL_PDF_ICON_SRC = 'assets/img/ecp/icon-pdf.png';

  const VIDEO_PLAY_SVG =
    '<svg class="ecp-video-card__play" width="134" height="134" viewBox="0 0 134 134" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="67" cy="67" r="63" stroke="white" stroke-width="6"/><path d="M90 67L54 87.5V46.5L90 67Z" fill="white"/></svg>';

  const ECP_DEFAULTS = {
    hero: {
      background: '',
      title: 'Выгодные тарифы\nпоставщикам',
      titleColor: '#ffffff', titleTop: 122, titleLeft: 70,
      subtitle:
        'Порядок осуществления процедур закупок представляет собой строго регламентированный жизненный цикл, который включает в себя шесть основных этапов: планирование, объявление закупки, подача и рассмотрение заявок, определение победителя, заключение контракта и его последующее исполнение.',
      subtitleColor: '#ffffff', subtitleTop: 213, subtitleLeft: 70
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
      title: 'Руководство пользователя\nпо работе на ЭТП',
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

  const ECP_HERO_SLIDE_DEFAULTS = {
    title: ECP_DEFAULTS.hero.title,
    subtitle: ECP_DEFAULTS.hero.subtitle,
    titleColor: ECP_DEFAULTS.hero.titleColor,
    subtitleColor: ECP_DEFAULTS.hero.subtitleColor,
    titleTop: ECP_DEFAULTS.hero.titleTop,
    titleLeft: ECP_DEFAULTS.hero.titleLeft,
    subtitleTop: ECP_DEFAULTS.hero.subtitleTop,
    subtitleLeft: ECP_DEFAULTS.hero.subtitleLeft
  };

  let ecpHeroRenderer = null;

  function getEcpHeroRenderer() {
    if (!ecpHeroRenderer && window.HeroSlides) {
      ecpHeroRenderer = window.HeroSlides.createRenderer({
        rootSelector: '.hero-slider',
        customBgClass: 'hero-slider--custom-bg',
        titleSelector: '.ecp-hero-title',
        subtitleSelector: '.ecp-hero-subtitle',
        graphicSelector: '.ecp-banner__graphic',
        contentSelector: '.hero-slide__content',
        titleColorFallback: '#000000',
        subtitleColorFallback: '#333333'
      });
    }
    return ecpHeroRenderer;
  }

  function migrateEcpData(raw) {
    const heroSlides = window.HeroSlides
      ? window.HeroSlides.migrateHeroSlides(raw, ECP_HERO_SLIDE_DEFAULTS)
      : [];
    const first = heroSlides[0] || {};
    const rawHero = raw?.hero && typeof raw.hero === 'object' ? raw.hero : {};
    const hero = {
      background: first.background || '',
      title: first.title !== undefined ? first.title : ECP_DEFAULTS.hero.title,
      titleColor: first.titleColor || ECP_DEFAULTS.hero.titleColor,
      titleTop: first.titleTop !== undefined ? first.titleTop : ECP_DEFAULTS.hero.titleTop,
      titleLeft: first.titleLeft !== undefined ? first.titleLeft : ECP_DEFAULTS.hero.titleLeft,
      titleFontSize: first.titleFontSize || '',
      titleFontWeight: first.titleFontWeight || '',
      titleItalic: first.titleItalic || false,
      titleUnderline: first.titleUnderline || false,
      subtitle: first.subtitle !== undefined ? first.subtitle : ECP_DEFAULTS.hero.subtitle,
      subtitleColor: first.subtitleColor || ECP_DEFAULTS.hero.subtitleColor,
      subtitleTop: first.subtitleTop !== undefined ? first.subtitleTop : ECP_DEFAULTS.hero.subtitleTop,
      subtitleLeft: first.subtitleLeft !== undefined ? first.subtitleLeft : ECP_DEFAULTS.hero.subtitleLeft,
      subtitleFontSize: first.subtitleFontSize || '',
      subtitleFontWeight: first.subtitleFontWeight || '',
      subtitleItalic: first.subtitleItalic || false,
      subtitleUnderline: first.subtitleUnderline || false
    };

    const data = {
      heroSlides,
      hero,
      tariffs: Array.isArray(raw?.tariffs) && raw.tariffs.length ? raw.tariffs : [...ECP_DEFAULTS.tariffs],
      blanks: {
        patternImage: raw?.blanks?.patternImage || ECP_DEFAULTS.blanks.patternImage,
        items:
          Array.isArray(raw?.blanks?.items) && raw.blanks.items.length
            ? raw.blanks.items
            : [...ECP_DEFAULTS.blanks.items]
      },
      manual: {
        title: raw?.manual?.title !== undefined ? raw.manual.title : ECP_DEFAULTS.manual.title,
        bookImage: raw?.manual?.bookImage || ECP_DEFAULTS.manual.bookImage,
        items:
          Array.isArray(raw?.manual?.items) && raw.manual.items.length
            ? raw.manual.items
            : [...ECP_DEFAULTS.manual.items]
      },
      videos: Array.isArray(raw?.videos) && raw.videos.length ? raw.videos : [...ECP_DEFAULTS.videos],
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
      items = [...ECP_DEFAULTS.support.items];
    }

    return {
      background: raw.background || raw.image || '',
      title: raw.title || ECP_DEFAULTS.support.title,
      items,
      buttonText: raw.buttonText || ECP_DEFAULTS.support.buttonText,
      buttonLink: raw.buttonLink || ECP_DEFAULTS.support.buttonLink
    };
  }

  function markEcpContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }

  function loadEcpDataFromLocal() {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateEcpData(JSON.parse(local));
    } catch (error) {
      console.warn('ECP: localStorage parse error', error);
    }
    return null;
  }

  async function loadEcpDataFromApi() {
    try {
      const resp = await fetch(`api/settings.php?key=${STORAGE_KEY}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data && typeof data === 'object' && Object.keys(data).length) {
          return migrateEcpData(data);
        }
      }
    } catch (error) {
      console.warn('ECP: API unavailable', error);
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

  function applyTypographyStyles(el, size, weight, italic, underline) {
    if (!el) return;
    if (size) {
      const banner = el.closest('.hero-slider, .ecp-support-banner, .consulting-hero, .landing-hero, .knowledge-hero, .obuchenie-knowledge-banner, .news-knowledge-banner');
      if (banner && banner.style.containerType !== 'inline-size') {
        banner.style.containerType = 'inline-size';
      }
      el.style.fontSize = `clamp(calc(${size}px * 0.5), calc(${size}px * (100cqw / 1520)), ${size}px)`;
    } else {
      el.style.removeProperty('font-size');
    }
    if (weight) el.style.fontWeight = weight;
    else el.style.removeProperty('font-weight');
    if (italic) el.style.fontStyle = 'italic';
    else el.style.removeProperty('font-style');
    if (underline) el.style.textDecoration = 'underline';
    else el.style.removeProperty('text-decoration');
  }

  function renderHero(data) {
    const slides = data?.heroSlides?.length
      ? data.heroSlides
      : window.HeroSlides?.migrateHeroSlides({ hero: data?.hero }, ECP_HERO_SLIDE_DEFAULTS) || [];
    getEcpHeroRenderer()?.render(slides);
  }

  function renderTariffs(tariffs) {
    const grid = document.querySelector('.ecp-tariffs__grid');
    if (!grid) return;
    const list = tariffs && tariffs.length ? tariffs : ECP_DEFAULTS.tariffs;
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
    const list = blanks?.items?.length ? blanks.items : ECP_DEFAULTS.blanks.items;
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
    const titleEl = document.querySelector('.ecp-manual__title');
    const listEl = document.querySelector('.ecp-manual__list');
    const bookEl = document.querySelector('.ecp-manual__image');
    const items = manual?.items?.length ? manual.items : ECP_DEFAULTS.manual.items;

    if (titleEl) {
      titleEl.innerHTML = multilineHtml(
        manual?.title !== undefined ? manual.title : ECP_DEFAULTS.manual.title
      );
    }

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
    const list = videos && videos.length ? videos : ECP_DEFAULTS.videos;
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
    btn.textContent = support?.buttonText || ECP_DEFAULTS.support.buttonText;

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

  function renderEcpPage(data) {
    renderHero(data);
    renderTariffs(data.tariffs);
    renderBlanks(data.blanks);
    renderManual(data.manual);
    renderVideos(data.videos);
    renderSupport(data.support);
    document.dispatchEvent(new CustomEvent('ecpContentReady', { detail: data }));
  }

  async function initEcpContent() {
    try {
      const localData = loadEcpDataFromLocal();
      const initialData = localData || migrateEcpData(null);
      renderEcpPage(initialData);
      markEcpContentReady();

      const apiData = await loadEcpDataFromApi();
      if (apiData) {
        renderEcpPage(apiData);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
        } catch (error) {
          console.warn('ECP: localStorage update failed', error);
        }
      }
    } catch (error) {
      console.error('ECP content init failed', error);
      markEcpContentReady();
    }
  }

  window.EcpContent = {
    STORAGE_KEY,
    ECP_DEFAULTS,
    migrateEcpData,
    migrateSupportData,
    loadEcpDataFromApi,
    loadEcpDataFromLocal,
    resolveVideoThumbnail,
    vkVideoId,
    vkVideoThumbProxyUrl
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEcpContent);
  } else {
    initEcpContent();
  }
})();
