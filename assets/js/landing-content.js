/**
 * Контент главной страницы (лендинг) — загрузка из API / localStorage и отрисовка.
 */
(function () {
  const STORAGE_KEY = 'crzrt_main_page_data';
  const CONTENT_PENDING_CLASS = 'landing-content-pending';
  const CONTENT_READY_CLASS = 'landing-content-ready';
  const REVEAL_TIMEOUT_MS = 10000;
  const REVIEW_TEXT_MAX_LENGTH = 243;

  document.documentElement.classList.add(CONTENT_PENDING_CLASS);

  const LANDING_DEFAULTS = {
    heroSlides: [
      {
        title: 'Надежное тендерное\nсопровождение',
        subtitle: 'Поиск выгодных закупок\nи оценка целесообразности участия',
        background: 'assets/img/hero_section.png'
      }
    ],
    serviceCards: [
      {
        title: 'Обучение',
        desc: 'Как зарабатывать на госзакупках и тендерах',
        link: 'obuchenie.html',
        variant: 'green',
        icon: 'assets/img/obuch.png'
      },
      {
        title: 'Сопровождение',
        desc: 'Комплексная помощь экспертов на всех этапах закупок',
        link: 'consulting.html',
        variant: 'peach',
        icon: 'assets/img/sopr.png'
      },
      {
        title: 'Юридический консалтинг',
        desc: 'Профессиональные консультационные услуги по правовым вопросам',
        link: 'consulting.html',
        variant: 'purple',
        icon: 'assets/img/u_k.png'
      },
      {
        title: 'ЭТП',
        desc: 'Электронная торговая площадка',
        link: 'https://etpzakupki.tatar',
        variant: 'blue',
        icon: 'assets/img/etp.png',
        external: true
      }
    ],
    promoBanner: {
      title: 'Дистанционный курс\nпо 44 ФЗ для заказчиков',
      date: '2-4 июня 2026 года',
      link: '',
      image: 'assets/img/banner.png'
    },
    partners: [
      { alt: 'Партнер 1', image: 'assets/img/Group 303.png' },
      { alt: 'Партнер 2', image: 'assets/img/Group 302.png' },
      { alt: 'Партнер 3', image: 'assets/img/Group 304.png' },
      { alt: 'Партнер 4', image: 'assets/img/Group 305.png' },
      { alt: 'Партнер 5', image: 'assets/img/TNV.png' }
    ],
    reviews: [
      {
        text: 'В целом Интерфейс понятный, удобный. Если нужны какие-то улучшения, Росэлторг их активно рассматривает. Не всегда, но движения в этом вопросе точно есть.',
        nameLines: ['Сергеев', 'Александр'],
        roleLines: ['Руководитель', 'тендерного отдела']
      },
      {
        text: 'В целом Интерфейс понятный, удобный. Если нужны какие-то улучшения, Росэлторг их активно рассматривает. Не всегда, но движения в этом вопросе точно есть.',
        nameLines: ['Сергеев', 'Александр'],
        roleLines: ['Руководитель', 'тендерного отдела']
      },
      {
        text: 'В целом Интерфейс понятный, удобный. Если нужны какие-то улучшения, Росэлторг их активно рассматривает. Не всегда, но движения в этом вопросе точно есть.',
        nameLines: ['Сергеев', 'Александр'],
        roleLines: ['Руководитель', 'тендерного отдела']
      }
    ],
    consultation: {
      photos: ['assets/img/mask_group.png']
    }
  };

  function escapeAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function multilineHtml(str) {
    return escapeHtml(str || '')
      .split('\n')
      .filter((line, i, arr) => line.length || i < arr.length - 1)
      .join('<br>');
  }

  function normalizeConsultationPhotos(raw, data) {
    let photos = [];
    if (Array.isArray(data?.consultation?.photos)) {
      photos = [...data.consultation.photos];
    } else if (typeof data?.consultation === 'string' && data.consultation.trim()) {
      photos = [data.consultation.trim()];
    }
    if (!photos.length && Array.isArray(raw?.consultation?.photos)) {
      photos = [...raw.consultation.photos];
    }
    if (!photos.length && raw?.consultationPhoto) {
      photos = [raw.consultationPhoto];
    }
    photos = photos.map((p) => (p && String(p).trim()) || '').filter(Boolean);
    if (!photos.length) {
      photos = [...LANDING_DEFAULTS.consultation.photos];
    }
    return { photos };
  }

  function migrateLandingData(raw) {
    const data = { ...LANDING_DEFAULTS, ...(raw || {}) };

    if (!Array.isArray(data.heroSlides) || !data.heroSlides.length) {
      const bg = raw?.heroBgImage || LANDING_DEFAULTS.heroSlides[0].background;
      data.heroSlides = [
        {
          title: raw?.heroTitle || LANDING_DEFAULTS.heroSlides[0].title,
          subtitle: raw?.heroSubtitle || LANDING_DEFAULTS.heroSlides[0].subtitle,
          background: bg
        }
      ];
    }

    if (!Array.isArray(data.serviceCards) || !data.serviceCards.length) {
      if (Array.isArray(raw?.featureCards) && raw.featureCards.length) {
        const variants = ['green', 'peach', 'purple', 'blue'];
        data.serviceCards = raw.featureCards.map((c, i) => ({
          title: c.title || '',
          desc: c.subtitle || c.desc || '',
          link: c.link || '#',
          variant: c.variant || variants[i % variants.length],
          icon: c.image || c.icon || '',
          external: /^https?:\/\//i.test(c.link || '')
        }));
      } else {
        data.serviceCards = [...LANDING_DEFAULTS.serviceCards];
      }
    }

    if (!data.promoBanner || typeof data.promoBanner !== 'object') {
      data.promoBanner = { ...LANDING_DEFAULTS.promoBanner };
    }

    if (!Array.isArray(data.partners) || !data.partners.length) {
      data.partners = [...LANDING_DEFAULTS.partners];
    }

    if (!Array.isArray(data.reviews) || !data.reviews.length) {
      if (Array.isArray(raw?.testimonials) && raw.testimonials.length) {
        data.reviews = raw.testimonials.map((t) => ({
          text: (t.text || '').replace(/^«|»$/g, ''),
          nameLines: t.nameLines || [t.client || ''],
          roleLines: t.roleLines || []
        }));
      } else {
        data.reviews = [...LANDING_DEFAULTS.reviews];
      }
    }

    data.consultation = normalizeConsultationPhotos(raw, data);

    return data;
  }

  function collectImageUrls(data) {
    const urls = [];
    (data.heroSlides || []).forEach((s) => {
      if (s?.background) urls.push(s.background);
    });
    (data.serviceCards || []).forEach((c) => {
      if (c?.icon) urls.push(c.icon);
    });
    if (data.promoBanner?.image) urls.push(data.promoBanner.image);
    (data.partners || []).forEach((p) => {
      if (p?.image) urls.push(p.image);
    });
    (data.consultation?.photos || []).forEach((src) => {
      if (src) urls.push(src);
    });
    return [...new Set(urls)];
  }

  function preloadImages(urls) {
    const list = urls.filter(Boolean);
    if (!list.length) return Promise.resolve();
    return Promise.all(
      list.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            const done = () => resolve();
            img.onload = done;
            img.onerror = done;
            img.src = url;
          })
      )
    );
  }

  function markLandingContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }

  async function loadLandingData() {
    try {
      const resp = await fetch(`api/settings.php?key=${STORAGE_KEY}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data && typeof data === 'object' && Object.keys(data).length) {
          return migrateLandingData(data);
        }
      }
    } catch (e) {
      console.warn('Landing: API unavailable, using local fallback', e);
    }

    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateLandingData(JSON.parse(local));
    } catch (e) {
      console.warn('Landing: localStorage parse error', e);
    }

    return migrateLandingData(null);
  }

  function renderHero(data) {
    const slider = document.querySelector('.hero-slider');
    const slideEl = document.querySelector('.hero-slide');
    if (!slider || !slideEl) return;

    const slides = (data.heroSlides || []).filter((s) => s && (s.background || s.title));
    if (!slides.length) return;

    const first = slides[0];
    slider.style.backgroundImage = first.background ? `url('${first.background}')` : '';
    slider.dataset.slides = JSON.stringify(slides);

    const titleEl = slideEl.querySelector('.hero-slide__title');
    const subEl = slideEl.querySelector('.hero-slide__subtitle');
    if (titleEl) titleEl.innerHTML = multilineHtml(first.title);
    if (subEl) subEl.innerHTML = multilineHtml(first.subtitle);

    const dotsWrap = slideEl.querySelector('.hero-slide__dots');
    if (dotsWrap) {
      dotsWrap.innerHTML = slides
        .map((_, i) => `<span class="dot${i === 0 ? ' active' : ''}" data-slide="${i}"></span>`)
        .join('');
    }

    window.__heroSlides = slides;
    window.__heroCurrent = 0;
  }

  function applyHeroSlide(index) {
    const slides = window.__heroSlides;
    if (!slides || !slides.length) return;
    const i = ((index % slides.length) + slides.length) % slides.length;
    window.__heroCurrent = i;
    const slide = slides[i];
    const slider = document.querySelector('.hero-slider');
    const titleEl = document.querySelector('.hero-slide__title');
    const subEl = document.querySelector('.hero-slide__subtitle');
    if (slider && slide.background) slider.style.backgroundImage = `url('${slide.background}')`;
    if (titleEl) titleEl.innerHTML = multilineHtml(slide.title);
    if (subEl) subEl.innerHTML = multilineHtml(slide.subtitle);
    document.querySelectorAll('.hero-slide__dots .dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === i);
    });
  }

  function renderServiceCards(cards) {
    const grid = document.querySelector('.services-grid');
    if (!grid) return;
    const list = cards && cards.length ? cards : LANDING_DEFAULTS.serviceCards;
    grid.innerHTML = list
      .map((card) => {
        const ext = card.external || /^https?:\/\//i.test(card.link || '');
        const target = ext ? ' target="_blank" rel="noopener noreferrer"' : '';
        const variant = card.variant || 'green';
        const icon = card.icon ? `<img src="${card.icon}" alt="${escapeHtml(card.title)}" class="service-card__icon">` : '';
        return `<a href="${escapeHtml(card.link || '#')}" class="service-card service-card--${variant}"${target}>
          <div class="service-card__body">
            <h3 class="service-card__title">${escapeHtml(card.title)}</h3>
            <p class="service-card__desc">${escapeHtml(card.desc)}</p>
          </div>
          ${icon}
        </a>`;
      })
      .join('');
  }

  function renderPromoBanner(banner) {
    const el = document.querySelector('.promo-banner');
    if (!el || !banner) return;
    if (banner.image) el.style.backgroundImage = `url('${banner.image}')`;
    const titleEl = el.querySelector('.promo-banner__title');
    const dateEl = el.querySelector('.promo-banner__date');
    if (titleEl) titleEl.innerHTML = multilineHtml(banner.title);
    if (dateEl) dateEl.textContent = banner.date || '';

    if (banner.link) {
      el.style.cursor = 'pointer';
      el.dataset.href = banner.link;
      el.setAttribute('role', 'link');
      el.setAttribute('tabindex', '0');
    } else {
      el.style.cursor = '';
      delete el.dataset.href;
      el.removeAttribute('role');
      el.removeAttribute('tabindex');
    }
  }

  function renderPartners(partners) {
    const track = document.querySelector('.partners-track');
    if (!track) return;
    const list = partners && partners.length ? partners : LANDING_DEFAULTS.partners;
    track.innerHTML = list
      .map(
        (p) => `<div class="partner-logo">
          <img src="${escapeAttr(p.image)}" alt="${escapeHtml(p.alt || 'Партнёр')}" decoding="async">
        </div>`
      )
      .join('');
  }

  function renderReviews(reviews) {
    const grid = document.querySelector('.reviews-grid');
    if (!grid) return;
    const list = reviews && reviews.length ? reviews : LANDING_DEFAULTS.reviews;
    grid.innerHTML = list
      .map((r) => {
        const nameLines = (r.nameLines || []).map((line) => `<span class="review-card__name-line">${escapeHtml(line)}</span>`).join('');
        const roleLines = (r.roleLines || []).map((line) => `<span class="review-card__role-line">${escapeHtml(line)}</span>`).join('');
        const text = String(r.text || '');
        const reviewText = text.length > REVIEW_TEXT_MAX_LENGTH ? text.slice(0, REVIEW_TEXT_MAX_LENGTH) : text;
        return `<div class="review-card reveal-init">
          <p class="review-card__text">${escapeHtml(reviewText)}</p>
          <div class="review-card__footer">
            <div class="review-card__author">
              <p class="review-card__name">${nameLines}</p>
              <p class="review-card__role">${roleLines}</p>
            </div>
          </div>
          <div class="review-card__quote" aria-hidden="true">
            <img src="assets/img/quote.svg" alt="" class="review-card__quote-img" width="179" height="182" decoding="async">
          </div>
        </div>`;
      })
      .join('');

    if (window.__reinitReveal) window.__reinitReveal('.review-card');
  }

  function renderConsultationPhoto(photos) {
    const person = document.querySelector('.consultation-card__person');
    if (!person) return;
    const list = (photos || []).map((p) => (p && String(p).trim()) || '').filter(Boolean);
    const pool = list.length ? list : LANDING_DEFAULTS.consultation.photos;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    const safeUrl = String(chosen).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    person.style.backgroundImage = `url("${safeUrl}")`;
    person.style.backgroundRepeat = 'no-repeat';
    person.style.backgroundPosition = 'right bottom';
    person.style.backgroundSize = 'contain';
  }

  function bindPromoClick() {
    const el = document.querySelector('.promo-banner');
    if (!el) return;
    const go = () => {
      const href = el.dataset.href;
      if (href) window.location.href = href;
    };
    el.addEventListener('click', go);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go();
      }
    });
  }

  async function initLandingContent() {
    const revealTimer = window.setTimeout(markLandingContentReady, REVEAL_TIMEOUT_MS);
    try {
      const data = await loadLandingData();
      await preloadImages(collectImageUrls(data));
      renderHero(data);
      renderServiceCards(data.serviceCards);
      renderPromoBanner(data.promoBanner);
      renderPartners(data.partners);
      renderReviews(data.reviews);
      renderConsultationPhoto(data.consultation?.photos);
      bindPromoClick();
      markLandingContentReady();

      window.applyHeroSlide = applyHeroSlide;
      document.dispatchEvent(new CustomEvent('landingContentReady', { detail: data }));
    } catch (e) {
      console.error('Landing content init failed', e);
      markLandingContentReady();
    } finally {
      window.clearTimeout(revealTimer);
    }
  }

  window.LandingContent = {
    loadLandingData,
    migrateLandingData,
    normalizeConsultationPhotos,
    LANDING_DEFAULTS,
    applyHeroSlide
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLandingContent);
  } else {
    initLandingContent();
  }
})();
