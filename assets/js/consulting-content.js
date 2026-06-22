/**
 * Контент страницы «Юридический консалтинг» — загрузка из API / localStorage и отрисовка.
 */
(function () {
  const STORAGE_KEY = 'crzrt_consulting_page_data';
  const CONTENT_PENDING_CLASS = 'consulting-content-pending';
  const CONTENT_READY_CLASS = 'consulting-content-ready';

  const DEFAULT_COMPETENCIES = [
    { title: 'Решения\nдля бизнеса', icon: 'assets/img/consulting/icon-business.png', link: '#competencies' },
    { title: 'Сложные\nсудебные споры', icon: 'assets/img/consulting/icon-disputes.png', link: '#competencies' },
    { title: 'Сопровождение\nсделок', icon: 'assets/img/consulting/icon-deals.png', link: '#competencies' },
    { title: 'Поддержка\nгосзаказчиков', icon: 'assets/img/consulting/icon-public.png', link: '#competencies' },
    { title: 'Конкурентный\nконсалтинг', icon: 'assets/img/consulting/icon-competitor.png', link: '#competencies' },
    { title: 'Корпоративное\nправо', icon: 'assets/img/consulting/icon-corporate.png', link: '#competencies' }
  ];

  const CONSULTING_DEFAULTS = {
    hero: {
      background: '',
      graphic: 'assets/img/consulting/banner-gavel.png',
      title: 'Защищаем\nваши интересы',
      titleColor: '#000000', titleTop: 122, titleLeft: 70,
      subtitle:
        'Профессиональная юридическая поддержка в сфере закупок: сопровождение сделок, представительство в спорах, консультации для заказчиков и поставщиков на всех этапах.',
      subtitleColor: '#333333', subtitleTop: 213, subtitleLeft: 70
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

  function migrateConsultingData(raw) {
    const rawHero = raw?.hero && typeof raw.hero === 'object' ? raw.hero : {};
    const hero = {
      background: rawHero.background || '',
      graphic: rawHero.graphic || CONSULTING_DEFAULTS.hero.graphic,
      title: rawHero.title !== undefined ? rawHero.title : CONSULTING_DEFAULTS.hero.title,
      titleColor: rawHero.titleColor || CONSULTING_DEFAULTS.hero.titleColor,
      titleTop: rawHero.titleTop !== undefined ? rawHero.titleTop : CONSULTING_DEFAULTS.hero.titleTop,
      titleLeft: rawHero.titleLeft !== undefined ? rawHero.titleLeft : CONSULTING_DEFAULTS.hero.titleLeft,
      subtitle: rawHero.subtitle !== undefined ? rawHero.subtitle : CONSULTING_DEFAULTS.hero.subtitle,
      subtitleColor: rawHero.subtitleColor || CONSULTING_DEFAULTS.hero.subtitleColor,
      subtitleTop: rawHero.subtitleTop !== undefined ? rawHero.subtitleTop : CONSULTING_DEFAULTS.hero.subtitleTop,
      subtitleLeft: rawHero.subtitleLeft !== undefined ? rawHero.subtitleLeft : CONSULTING_DEFAULTS.hero.subtitleLeft
    };

    const competencies =
      Array.isArray(raw?.competencies) && raw.competencies.length
        ? raw.competencies.map((item) => ({
            title: item?.title || '',
            icon: item?.icon || '',
            link: item?.link || '#competencies'
          }))
        : [...CONSULTING_DEFAULTS.competencies];

    return {
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

  function renderHero(hero) {
    const banner = document.querySelector('.consulting-hero');
    const contentEl = document.querySelector('.consulting-hero__content');
    const titleEl = document.querySelector('.consulting-hero-title');
    const subtitleEl = document.querySelector('.consulting-hero-subtitle');
    const graphicEl = document.querySelector('.consulting-banner__graphic');
    const graphicImg = document.querySelector('.consulting-hero-gavel');
    const background = (hero?.background || '').trim();
    const hasCustomBanner = Boolean(background);
    const graphic = (hero?.graphic || CONSULTING_DEFAULTS.hero.graphic || '').trim();

    if (titleEl) {
      titleEl.innerHTML = multilineHtml(hero?.title);
      titleEl.style.color = hero?.titleColor || '';
      if (hero?.titleTop !== undefined) titleEl.style.top = `${hero.titleTop}px`;
      if (hero?.titleLeft !== undefined) titleEl.style.left = `${hero.titleLeft}px`;
      if (hero?.titleTop !== undefined || hero?.titleLeft !== undefined) {
         titleEl.style.position = 'absolute';
         titleEl.style.margin = '0';
      }
    }
    if (subtitleEl) {
      subtitleEl.innerHTML = multilineHtml(hero?.subtitle);
      subtitleEl.style.color = hero?.subtitleColor || '';
      if (hero?.subtitleTop !== undefined) subtitleEl.style.top = `${hero.subtitleTop}px`;
      if (hero?.subtitleLeft !== undefined) subtitleEl.style.left = `${hero.subtitleLeft}px`;
      if (hero?.subtitleTop !== undefined || hero?.subtitleLeft !== undefined) {
         subtitleEl.style.position = 'absolute';
         subtitleEl.style.margin = '0';
         subtitleEl.style.maxWidth = 'none';
      }
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

    if (graphicImg && graphic) {
      graphicImg.src = graphic;
    }

    window.__heroSlides = [];
    window.__heroCurrent = 0;

    if (contentEl) contentEl.classList.remove('is-hidden');
    if (graphicEl) graphicEl.classList.toggle('is-hidden', hasCustomBanner);

    document.dispatchEvent(new CustomEvent('heroSlidesUpdated', { detail: { count: 1 } }));
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
        return `<a href="${href}" class="consulting-competency-card">
          <div class="consulting-competency-card__icon-circle">
            <img src="${icon}" alt="" class="consulting-competency-card__icon" width="109" height="110" decoding="async">
          </div>
          <span class="consulting-competency-card__title">${multilineHtml(item.title)}</span>
        </a>`;
      })
      .join('');
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
    renderHero(data.hero);
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
