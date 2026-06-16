/**
 * Контент страницы «Юридический консалтинг» — загрузка из API / localStorage и отрисовка.
 */
(function () {
  const STORAGE_KEY = 'crzrt_consulting_page_data';
  const CONTENT_PENDING_CLASS = 'consulting-content-pending';
  const CONTENT_READY_CLASS = 'consulting-content-ready';

  const DOWNLOAD_ARROW_SVG =
    '<span class="arrow-down-right"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L11 11M11 11V3M11 11H3" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

  const MANUAL_PDF_ICON_SRC = 'assets/img/ecp/icon-pdf.png';

  const VIDEO_PLAY_SVG =
    '<svg class="ecp-video-card__play" width="134" height="134" viewBox="0 0 134 134" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="67" cy="67" r="63" stroke="white" stroke-width="6"/><path d="M90 67L54 87.5V46.5L90 67Z" fill="white"/></svg>';

  const CONSULTING_DEFAULTS = {
    hero: {
      background: '',
      title: 'Защищаем\nваши интересы',
      subtitle:
        'Профессиональная юридическая поддержка в сфере закупок: сопровождение сделок, представительство в спорах, консультации для заказчиков и поставщиков на всех этапах.'
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

  function migrateConsultingData(raw) {
    const rawHero = raw?.hero && typeof raw.hero === 'object' ? raw.hero : {};
    const hero = {
      background: rawHero.background || '',
      title: rawHero.title || CONSULTING_DEFAULTS.hero.title,
      subtitle: rawHero.subtitle || CONSULTING_DEFAULTS.hero.subtitle
    };

    const data = {
      hero,
      tariffs: Array.isArray(raw?.tariffs) && raw.tariffs.length ? raw.tariffs : [...CONSULTING_DEFAULTS.tariffs],
      blanks: {
        patternImage: raw?.blanks?.patternImage || CONSULTING_DEFAULTS.blanks.patternImage,
        items:
          Array.isArray(raw?.blanks?.items) && raw.blanks.items.length
            ? raw.blanks.items
            : [...CONSULTING_DEFAULTS.blanks.items]
      },
      manual: {
        bookImage: raw?.manual?.bookImage || CONSULTING_DEFAULTS.manual.bookImage,
        items:
          Array.isArray(raw?.manual?.items) && raw.manual.items.length
            ? raw.manual.items
            : [...CONSULTING_DEFAULTS.manual.items]
      },
      videos: Array.isArray(raw?.videos) && raw.videos.length ? raw.videos : [...CONSULTING_DEFAULTS.videos],
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
      items = [...CONSULTING_DEFAULTS.support.items];
    }

    return {
      background: raw.background || raw.image || '',
      title: raw.title || CONSULTING_DEFAULTS.support.title,
      items,
      buttonText: raw.buttonText || CONSULTING_DEFAULTS.support.buttonText,
      buttonLink: raw.buttonLink || CONSULTING_DEFAULTS.support.buttonLink
    };
  }

  function markConsultingContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }

  function loadConsultingDataFromLocal() {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateConsultingData(JSON.parse(local));
    } catch (error) {
      console.warn('Consulting: localStorage parse error', error);
    }
    return null;
  }

  async function loadConsultingDataFromApi() {
    try {
      const resp = await fetch(`api/settings.php?key=${STORAGE_KEY}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data && typeof data === 'object' && Object.keys(data).length) {
          return migrateConsultingData(data);
        }
      }
    } catch (error) {
      console.warn('Consulting: API unavailable', error);
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
    const slider = document.querySelector('.hero-slider');
    const contentEl = document.querySelector('.hero-slide__content');
    const titleEl = document.querySelector('.ecp-hero-title');
    const subtitleEl = document.querySelector('.ecp-hero-subtitle');
    const graphicEl = document.querySelector('.ecp-banner__graphic');
    const dotsWrap = document.querySelector('.hero-slide__dots');
    const arrowsWrap = document.querySelector('.hero-slide__arrows');
    const background = (hero?.background || '').trim();
    const hasCustomBanner = Boolean(background);

    if (titleEl) titleEl.innerHTML = multilineHtml(hero?.title);
    if (subtitleEl) subtitleEl.innerHTML = multilineHtml(hero?.subtitle);

    if (slider) {
      if (hasCustomBanner) {
        slider.style.backgroundImage = `url('${background.replace(/'/g, "\\'")}')`;
        slider.classList.add('hero-slider--custom-bg');
      } else {
        slider.style.backgroundImage = '';
        slider.classList.remove('hero-slider--custom-bg');
      }
    }

    if (contentEl) contentEl.classList.remove('is-hidden');
    if (graphicEl) graphicEl.classList.toggle('is-hidden', hasCustomBanner);

    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      dotsWrap.classList.add('is-hidden');
    }
    if (arrowsWrap) {
      arrowsWrap.classList.add('is-hidden');
    }
  }

  function renderTariffs(tariffs) {
    const grid = document.querySelector('.ecp-tariffs__grid');
    if (!grid) return;
    const list = tariffs && tariffs.length ? tariffs : CONSULTING_DEFAULTS.tariffs;
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
    const list = blanks?.items?.length ? blanks.items : CONSULTING_DEFAULTS.blanks.items;
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
    const items = manual?.items?.length ? manual.items : CONSULTING_DEFAULTS.manual.items;

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
    const list = videos && videos.length ? videos : CONSULTING_DEFAULTS.videos;
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
    btn.textContent = support?.buttonText || CONSULTING_DEFAULTS.support.buttonText;

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

  function renderConsultingPage(data) {
    renderHero(data.hero);
    renderTariffs(data.tariffs);
    renderBlanks(data.blanks);
    renderManual(data.manual);
    renderVideos(data.videos);
    renderSupport(data.support);
    document.dispatchEvent(new CustomEvent('consultingContentReady', { detail: data }));
  }

  async function initConsultingContent() {
    try {
      const localData = loadConsultingDataFromLocal();
      const initialData = localData || migrateConsultingData(null);
      renderConsultingPage(initialData);
      markConsultingContentReady();

      const apiData = await loadConsultingDataFromApi();
      if (apiData) {
        renderConsultingPage(apiData);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
        } catch (error) {
          console.warn('Consulting: localStorage update failed', error);
        }
      }
    } catch (error) {
      console.error('Consulting content init failed', error);
      markConsultingContentReady();
    }
  }

  window.ConsultingContent = {
    STORAGE_KEY,
    CONSULTING_DEFAULTS,
    migrateConsultingData,
    migrateSupportData,
    loadConsultingDataFromApi,
    loadConsultingDataFromLocal,
    resolveVideoThumbnail,
    vkVideoId,
    vkVideoThumbProxyUrl
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsultingContent);
  } else {
    initConsultingContent();
  }
})();
