/**
 * Контент страницы «Юридический консалтинг» — загрузка из API / localStorage и отрисовка.
 */
(function () {
  const STORAGE_KEY = 'crzrt_consulting_page_data';
  const CONTENT_PENDING_CLASS = 'consulting-content-pending';
  const CONTENT_READY_CLASS = 'consulting-content-ready';

  const DEFAULT_COMPETENCIES = [
    { title: 'Решения\nдля бизнеса', icon: 'assets/img/consulting/icon-business.png', link: '#competencies', description: '' },
    { title: 'Сложные\nсудебные споры', icon: 'assets/img/consulting/icon-disputes.png', link: '#competencies', description: '' },
    { title: 'Сопровождение\nсделок', icon: 'assets/img/consulting/icon-deals.png', link: '#competencies', description: '' },
    { title: 'Поддержка\nгосзаказчиков', icon: 'assets/img/consulting/icon-public.png', link: '#competencies', description: '' },
    { title: 'Конкурентный\nконсалтинг', icon: 'assets/img/consulting/icon-competitor.png', link: '#competencies', description: '' },
    { title: 'Корпоративное\nправо', icon: 'assets/img/consulting/icon-corporate.png', link: '#competencies', description: '' }
  ];

  const CONSULTING_DEFAULTS = {
    hero: {
      background: '',
      graphic: 'assets/img/consulting/banner-gavel.png',
      title: 'Защищаем\nваши интересы',
      titleColor: '#ffffff', titleTop: 122, titleLeft: 70,
      subtitle:
        'Профессиональная юридическая поддержка в сфере закупок: сопровождение сделок, представительство в спорах, консультации для заказчиков и поставщиков на всех этапах.',
      subtitleColor: '#ffffff', subtitleTop: 213, subtitleLeft: 70
    },
    competenciesTitle: 'Компетенции',
    competencies: [...DEFAULT_COMPETENCIES],
    whyUs: {
      title: 'Почему мы?',
      lead: {
        text: 'Исключаем, сопровождаем, решаем, помогаем, проводим, начинаем, заканчиваем'
      },
      photo: {
        image: 'assets/img/consulting/why-meeting.png',
        caption: 'Проводим индивидуальные консультации'
      },
      support: {
        text: 'Помогаем\nна протяжении\nвсего пути'
      },
      side: {
        text: 'Решения для бизнеса, сопровождение сделок, поддержка на каждом этапе',
        image: 'assets/img/consulting/icon-disputes.png'
      }
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

  function migrateWhyUs(rawWhy) {
    const raw = rawWhy && typeof rawWhy === 'object' ? rawWhy : {};
    const defaults = CONSULTING_DEFAULTS.whyUs;
    return {
      title: raw.title || defaults.title,
      lead: {
        text: raw.lead?.text || defaults.lead.text
      },
      photo: {
        image: raw.photo?.image || defaults.photo.image,
        caption: raw.photo?.caption || defaults.photo.caption
      },
      support: {
        text: raw.support?.text || defaults.support.text
      },
      side: {
        text: raw.side?.text || defaults.side.text,
        image: raw.side?.image || defaults.side.image
      }
    };
  }

  const CONSULTING_HERO_SLIDE_DEFAULTS = {
    title: CONSULTING_DEFAULTS.hero.title,
    subtitle: CONSULTING_DEFAULTS.hero.subtitle,
    titleColor: CONSULTING_DEFAULTS.hero.titleColor,
    subtitleColor: CONSULTING_DEFAULTS.hero.subtitleColor,
    titleTop: CONSULTING_DEFAULTS.hero.titleTop,
    titleLeft: CONSULTING_DEFAULTS.hero.titleLeft,
    subtitleTop: CONSULTING_DEFAULTS.hero.subtitleTop,
    subtitleLeft: CONSULTING_DEFAULTS.hero.subtitleLeft
  };

  let consultingHeroRenderer = null;

  function getConsultingHeroRenderer() {
    if (!consultingHeroRenderer && window.HeroSlides) {
      consultingHeroRenderer = window.HeroSlides.createRenderer({
        rootSelector: '.consulting-hero',
        customBgClass: 'consulting-hero--custom-bg',
        titleSelector: '.consulting-hero-title',
        subtitleSelector: '.consulting-hero-subtitle',
        graphicSelector: '.consulting-banner__graphic',
        contentSelector: '.consulting-hero__content',
        titleColorFallback: '#000000',
        subtitleColorFallback: '#333333'
      });
    }
    return consultingHeroRenderer;
  }

  function migrateConsultingData(raw) {
    const heroSlides = window.HeroSlides
      ? window.HeroSlides.migrateHeroSlides(raw, CONSULTING_HERO_SLIDE_DEFAULTS)
      : [];
    const first = heroSlides[0] || {};
    const rawHero = raw?.hero && typeof raw.hero === 'object' ? raw.hero : {};
    const hero = {
      background: first.background || '',
      graphic: rawHero.graphic || CONSULTING_DEFAULTS.hero.graphic,
      title: first.title !== undefined ? first.title : CONSULTING_DEFAULTS.hero.title,
      titleColor: first.titleColor || CONSULTING_DEFAULTS.hero.titleColor,
      titleTop: first.titleTop !== undefined ? first.titleTop : CONSULTING_DEFAULTS.hero.titleTop,
      titleLeft: first.titleLeft !== undefined ? first.titleLeft : CONSULTING_DEFAULTS.hero.titleLeft,
      titleFontSize: first.titleFontSize || '',
      titleFontWeight: first.titleFontWeight || '',
      titleItalic: first.titleItalic || false,
      titleUnderline: first.titleUnderline || false,
      subtitle: first.subtitle !== undefined ? first.subtitle : CONSULTING_DEFAULTS.hero.subtitle,
      subtitleColor: first.subtitleColor || CONSULTING_DEFAULTS.hero.subtitleColor,
      subtitleTop: first.subtitleTop !== undefined ? first.subtitleTop : CONSULTING_DEFAULTS.hero.subtitleTop,
      subtitleLeft: first.subtitleLeft !== undefined ? first.subtitleLeft : CONSULTING_DEFAULTS.hero.subtitleLeft,
      subtitleFontSize: first.subtitleFontSize || '',
      subtitleFontWeight: first.subtitleFontWeight || '',
      subtitleItalic: first.subtitleItalic || false,
      subtitleUnderline: first.subtitleUnderline || false
    };

    const competencies =
      Array.isArray(raw?.competencies) && raw.competencies.length
        ? raw.competencies.map((item) => ({
            title: item?.title || '',
            icon: item?.icon || '',
            link: item?.link || '#competencies',
            description: item?.description || ''
          }))
        : [...CONSULTING_DEFAULTS.competencies];

    return {
      heroSlides,
      hero,
      competenciesTitle: raw?.competenciesTitle || CONSULTING_DEFAULTS.competenciesTitle,
      competencies,
      whyUs: migrateWhyUs(raw?.whyUs)
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

  function applyTypographyStyles(el, size, weight, italic, underline) {
    if (!el) return;
    if (size) el.style.fontSize = `clamp(calc(${size}px * 0.5), calc(${size}px * (100vw / 1520)), ${size}px)`;
    else el.style.removeProperty('font-size');
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
      : window.HeroSlides?.migrateHeroSlides({ hero: data?.hero }, CONSULTING_HERO_SLIDE_DEFAULTS) || [];
    getConsultingHeroRenderer()?.render(slides, { graphic: data?.hero?.graphic });
  }

  let publicModalOverlay = null;

  function openPublicModal(cardData) {
    if (!publicModalOverlay) {
      publicModalOverlay = document.createElement('div');
      publicModalOverlay.className = 'comp-public-overlay';
      publicModalOverlay.innerHTML = `
        <div class="comp-public-card">
          <button type="button" class="comp-public-close" aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div class="comp-public-header">
            <div class="comp-public-icon-circle">
              <img src="" alt="" class="comp-public-icon">
            </div>
            <h3 class="comp-public-title"></h3>
          </div>
          <div class="comp-public-body"></div>
        </div>
      `;
      document.body.appendChild(publicModalOverlay);

      // Close events
      publicModalOverlay.addEventListener('click', (e) => {
        if (e.target === publicModalOverlay) {
          closePublicModal();
        }
      });
      publicModalOverlay.querySelector('.comp-public-close').addEventListener('click', closePublicModal);

      // Close on Esc key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && publicModalOverlay.classList.contains('is-active')) {
          closePublicModal();
        }
      });
    }

    const titleEl = publicModalOverlay.querySelector('.comp-public-title');
    const iconEl = publicModalOverlay.querySelector('.comp-public-icon');
    const bodyEl = publicModalOverlay.querySelector('.comp-public-body');

    titleEl.innerHTML = cardData.title || '';
    iconEl.src = cardData.icon || '';
    bodyEl.innerHTML = cardData.description || '';

    publicModalOverlay.style.display = 'flex';
    // Force reflow
    publicModalOverlay.offsetHeight;
    publicModalOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closePublicModal() {
    if (publicModalOverlay) {
      publicModalOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (!publicModalOverlay.classList.contains('is-active')) {
          publicModalOverlay.style.display = 'none';
        }
      }, 300);
    }
  }

  function renderCompetencies(data) {
    const titleEl = document.querySelector('.consulting-competencies-title');
    const grid = document.querySelector('.consulting-competencies-grid');
    const title = data?.competenciesTitle || CONSULTING_DEFAULTS.competenciesTitle;
    const list =
      data?.competencies?.length ? data.competencies : CONSULTING_DEFAULTS.competencies;

    if (titleEl) titleEl.textContent = title;
    if (!grid) return;

    grid.innerHTML = list
      .map((item) => {
        const href = escapeAttr((item.link || '#competencies').trim() || '#competencies');
        const icon = escapeAttr(item.icon || '');
        const desc = escapeAttr(item.description || '');
        return `<a href="${href}" class="consulting-competency-card" data-description="${desc}">
          <div class="consulting-competency-card__icon-circle">
            <img src="${icon}" alt="" class="consulting-competency-card__icon" width="109" height="110" decoding="async">
          </div>
          <span class="consulting-competency-card__title">${multilineHtml(item.title)}</span>
        </a>`;
      })
      .join('');

    if (!grid.dataset.listenerBound) {
      grid.addEventListener('click', (e) => {
        const card = e.target.closest('.consulting-competency-card');
        if (!card) return;

        const description = card.getAttribute('data-description');
        if (description && description.trim().length > 0) {
          e.preventDefault();
          const title = card.querySelector('.consulting-competency-card__title')?.innerHTML || '';
          const icon = card.querySelector('.consulting-competency-card__icon')?.getAttribute('src') || '';
          openPublicModal({
            title,
            icon,
            description
          });
        }
      });
      grid.dataset.listenerBound = 'true';
    }
  }

  function renderWhyUs(whyUs) {
    const data = migrateWhyUs(whyUs);
    const titleEl = document.querySelector('.consulting-why-title');
    const mosaic = document.querySelector('.consulting-why-mosaic');

    if (titleEl) titleEl.textContent = data.title;
    if (!mosaic) return;

    const photoSrc = escapeAttr(data.photo.image);
    const sideSrc = escapeAttr(data.side.image);
    const sideImage = (data.side.image || '').trim();

    mosaic.innerHTML = `
      <div class="consulting-why-card consulting-why-card--lead">
        <p class="consulting-why-card__lead-text">${multilineHtml(data.lead.text)}</p>
      </div>
      <div class="consulting-why-card consulting-why-card--photo">
        <img src="${photoSrc}" alt="" class="consulting-why-card__photo" width="494" height="329" decoding="async">
        <p class="consulting-why-card__photo-caption">${escapeHtml(data.photo.caption)}</p>
      </div>
      <div class="consulting-why-card consulting-why-card--support">
        <p class="consulting-why-card__support-text">${multilineHtml(data.support.text)}</p>
      </div>
      <div class="consulting-why-card consulting-why-card--side${sideImage ? ' consulting-why-card--has-image' : ''}">
        ${sideImage ? `<img src="${sideSrc}" alt="" class="consulting-why-card__side-image" decoding="async">` : ''}
        <p class="consulting-why-card__side-text">${multilineHtml(data.side.text)}</p>
      </div>`;
  }

  function renderConsultingPage(data) {
    renderHero(data);
    renderCompetencies(data);
    renderWhyUs(data.whyUs);
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
    migrateWhyUs,
    loadConsultingDataFromApi,
    loadConsultingDataFromLocal
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsultingContent);
  } else {
    initConsultingContent();
  }
})();
