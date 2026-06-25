/**
 * Контент главной страницы (лендинг) — загрузка из API / localStorage и отрисовка.
 */
(function () {
  const STORAGE_KEY = 'crzrt_main_page_data';
  const CONTENT_PENDING_CLASS = 'landing-content-pending';
  const CONTENT_READY_CLASS = 'landing-content-ready';
  const REVEAL_TIMEOUT_MS = 10000;
  const REVIEW_TEXT_MAX_LENGTH = 243;
  let promoBound = false;

  document.documentElement.classList.add(CONTENT_PENDING_CLASS);

  const LANDING_DEFAULTS = {
    heroSlides: [
      {
        title: 'Надежное тендерное\nсопровождение',
        titleColor: '#ffffff', titleTop: 122, titleLeft: 70,
        subtitle: 'Поиск выгодных закупок\nи оценка целесообразности участия',
        subtitleColor: '#ffffff', subtitleTop: 213, subtitleLeft: 70,
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
        link: 'support.html',
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
        link: 'ecp.html',
        variant: 'blue',
        icon: 'assets/img/etp.png',
        external: false
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
    },
    socialLinks: [
      { id: 'max', label: 'Max', href: '#' },
      { id: 'tg', label: 'Телеграм', href: '#' },
      { id: 'vk', label: 'В контакте', href: '#' }
    ]
  };

  const SOCIAL_ICON_ASSETS = {
    max: {
      banner: 'assets/img/social-max.png',
      footer: 'assets/img/max.png',
      footerClass: 'footer-social-icon--max'
    },
    tg: {
      banner: 'assets/img/social-tg.png',
      footer: 'assets/img/tg.png',
      footerClass: 'footer-social-icon--tg'
    },
    vk: {
      banner: 'assets/img/social-vk.png',
      footer: 'assets/img/vk.png',
      footerClass: 'footer-social-icon--vk'
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
          title: raw?.heroTitle !== undefined ? raw.heroTitle : LANDING_DEFAULTS.heroSlides[0].title,
          titleColor: raw?.heroTitleColor || LANDING_DEFAULTS.heroSlides[0].titleColor,
          titleTop: raw?.heroTitleTop !== undefined ? raw.heroTitleTop : LANDING_DEFAULTS.heroSlides[0].titleTop,
          titleLeft: raw?.heroTitleLeft !== undefined ? raw.heroTitleLeft : LANDING_DEFAULTS.heroSlides[0].titleLeft,
          subtitle: raw?.heroSubtitle !== undefined ? raw.heroSubtitle : LANDING_DEFAULTS.heroSlides[0].subtitle,
          subtitleColor: raw?.heroSubtitleColor || LANDING_DEFAULTS.heroSlides[0].subtitleColor,
          subtitleTop: raw?.heroSubtitleTop !== undefined ? raw.heroSubtitleTop : LANDING_DEFAULTS.heroSlides[0].subtitleTop,
          subtitleLeft: raw?.heroSubtitleLeft !== undefined ? raw.heroSubtitleLeft : LANDING_DEFAULTS.heroSlides[0].subtitleLeft,
          background: bg
        }
      ];
    } else {
      data.heroSlides = data.heroSlides.map(s => ({
          ...s,
          title: s.title !== undefined ? s.title : LANDING_DEFAULTS.heroSlides[0].title,
          titleColor: s.titleColor || LANDING_DEFAULTS.heroSlides[0].titleColor,
          titleTop: s.titleTop !== undefined ? s.titleTop : LANDING_DEFAULTS.heroSlides[0].titleTop,
          titleLeft: s.titleLeft !== undefined ? s.titleLeft : LANDING_DEFAULTS.heroSlides[0].titleLeft,
          subtitle: s.subtitle !== undefined ? s.subtitle : LANDING_DEFAULTS.heroSlides[0].subtitle,
          subtitleColor: s.subtitleColor || LANDING_DEFAULTS.heroSlides[0].subtitleColor,
          subtitleTop: s.subtitleTop !== undefined ? s.subtitleTop : LANDING_DEFAULTS.heroSlides[0].subtitleTop,
          subtitleLeft: s.subtitleLeft !== undefined ? s.subtitleLeft : LANDING_DEFAULTS.heroSlides[0].subtitleLeft,
      }));
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

    data.serviceCards = data.serviceCards.map((card) => {
      const title = String(card?.title || '').trim();
      const link = String(card?.link || '').trim();
      if (title === 'ЭТП' && /etpzakupki/i.test(link)) {
        return { ...card, link: 'ecp.html', external: false };
      }
      if (title === 'Сопровождение') {
        return { ...card, link: 'support.html', external: false };
      }
      if (title === 'Обучение') {
        return { ...card, link: 'obuchenie.html', external: false };
      }
      return card;
    });

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

    if (!Array.isArray(data.socialLinks) || !data.socialLinks.length) {
      data.socialLinks = LANDING_DEFAULTS.socialLinks.map((link) => ({ ...link }));
    } else {
      data.socialLinks = data.socialLinks
        .map((link, index) => {
          const fallback = LANDING_DEFAULTS.socialLinks[index] || LANDING_DEFAULTS.socialLinks[0];
          return {
            id: link?.id || fallback.id,
            label: link?.label || fallback.label,
            href: link?.href || fallback.href || '#'
          };
        })
        .filter((link) => SOCIAL_ICON_ASSETS[link.id]);
    }

    return data;
  }

  function markLandingContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }

  function loadLandingDataFromLocal() {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateLandingData(JSON.parse(local));
    } catch (e) {
      console.warn('Landing: localStorage parse error', e);
    }
    return null;
  }

  async function loadLandingDataFromApi() {
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
    return null;
  }

  function shouldSkipLandingHero() {
    return (
      document.body.dataset.page === 'consulting' ||
      document.body.dataset.page === 'support' ||
      document.body.dataset.page === 'obuchenie' ||
      document.body.classList.contains('theme-blue') ||
      document.body.classList.contains('theme-purple') ||
      Boolean(document.querySelector('.consulting-hero')) ||
      Boolean(document.querySelector('.hero-slider--single'))
    );
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

  function renderHero(data) {
    const slider = document.querySelector('.hero-slider');
    const slideEl = document.querySelector('.hero-slide');
    if (!slider || !slideEl) return;
    if (shouldSkipLandingHero()) return;

    const slides = (data.heroSlides || []).filter((s) => s && (s.background || s.title));
    if (!slides.length) return;

    const first = slides[0];
    slider.style.backgroundImage = first.background ? `url('${first.background}')` : '';
    slider.dataset.slides = JSON.stringify(slides);

    const titleEl = slideEl.querySelector('.hero-slide__title');
    const subEl = slideEl.querySelector('.hero-slide__subtitle');
    if (titleEl) {
      titleEl.innerHTML = multilineHtml(first.title);
      if (first.titleColor && first.titleColor !== '#000000') titleEl.style.color = first.titleColor;
      else titleEl.style.removeProperty('color');
      if (first.titleTop !== undefined) titleEl.style.top = `${first.titleTop}px`;
      if (first.titleLeft !== undefined) titleEl.style.left = `${first.titleLeft}px`;
      applyTypographyStyles(titleEl, first.titleFontSize, first.titleFontWeight, first.titleItalic, first.titleUnderline);
    }
    if (subEl) {
      subEl.innerHTML = multilineHtml(first.subtitle);
      if (first.subtitleColor && first.subtitleColor !== '#333333') subEl.style.color = first.subtitleColor;
      else subEl.style.removeProperty('color');
      if (first.subtitleTop !== undefined) subEl.style.top = `${first.subtitleTop}px`;
      if (first.subtitleLeft !== undefined) subEl.style.left = `${first.subtitleLeft}px`;
      applyTypographyStyles(subEl, first.subtitleFontSize, first.subtitleFontWeight, first.subtitleItalic, first.subtitleUnderline);
    }
    
    if (first.background) slider.classList.add('hero-slider--custom-bg');
    else slider.classList.remove('hero-slider--custom-bg');

    const dotsWrap = slideEl.querySelector('.hero-slide__dots');
    const arrowsWrap = slideEl.querySelector('.hero-slide__arrows');
    const hasMultipleSlides = slides.length > 1;

    if (dotsWrap) {
      dotsWrap.innerHTML = hasMultipleSlides
        ? slides
            .map((_, i) => `<span class="dot${i === 0 ? ' active' : ''}" data-slide="${i}"></span>`)
            .join('')
        : '';
      dotsWrap.classList.toggle('is-hidden', !hasMultipleSlides);
    }

    if (arrowsWrap) {
      arrowsWrap.classList.toggle('is-hidden', !hasMultipleSlides);
    }

    window.__heroSlides = slides;
    window.__heroCurrent = 0;
    document.dispatchEvent(new CustomEvent('heroSlidesUpdated', { detail: { count: slides.length } }));
  }

  function applyHeroSlide(index) {
    if (shouldSkipLandingHero()) return;
    const slides = window.__heroSlides;
    if (!slides || !slides.length) return;
    const i = ((index % slides.length) + slides.length) % slides.length;
    window.__heroCurrent = i;
    const slide = slides[i];
    const slider = document.querySelector('.hero-slider');
    const titleEl = document.querySelector('.hero-slide__title');
    const subEl = document.querySelector('.hero-slide__subtitle');
    if (slider) {
      if (slide.background) {
        slider.style.backgroundImage = `url('${slide.background}')`;
        slider.classList.add('hero-slider--custom-bg');
      } else {
        slider.style.backgroundImage = '';
        slider.classList.remove('hero-slider--custom-bg');
      }
    }
    if (titleEl) {
      titleEl.innerHTML = multilineHtml(slide.title);
      if (slide.titleColor && slide.titleColor !== '#000000') titleEl.style.color = slide.titleColor;
      else titleEl.style.removeProperty('color');
      if (slide.titleTop !== undefined) titleEl.style.top = `${slide.titleTop}px`;
      if (slide.titleLeft !== undefined) titleEl.style.left = `${slide.titleLeft}px`;
      applyTypographyStyles(titleEl, slide.titleFontSize, slide.titleFontWeight, slide.titleItalic, slide.titleUnderline);
    }
    if (subEl) {
      subEl.innerHTML = multilineHtml(slide.subtitle);
      if (slide.subtitleColor && slide.subtitleColor !== '#333333') subEl.style.color = slide.subtitleColor;
      else subEl.style.removeProperty('color');
      if (slide.subtitleTop !== undefined) subEl.style.top = `${slide.subtitleTop}px`;
      if (slide.subtitleLeft !== undefined) subEl.style.left = `${slide.subtitleLeft}px`;
      applyTypographyStyles(subEl, slide.subtitleFontSize, slide.subtitleFontWeight, slide.subtitleItalic, slide.subtitleUnderline);
    }
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
          <img src="${escapeAttr(p.image)}" alt="${escapeHtml(p.alt || 'Партнёр')}" loading="lazy" decoding="async">
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

  function renderSocialLinks(socialLinks) {
    const bannerLinks = document.querySelector('.social-banner__links');
    const footerLinks = document.querySelector('.footer-socials');
    const list = socialLinks && socialLinks.length ? socialLinks : LANDING_DEFAULTS.socialLinks;

    if (bannerLinks) {
      bannerLinks.innerHTML = list
        .map((link) => {
          const assets = SOCIAL_ICON_ASSETS[link.id];
          if (!assets) return '';
          const href = link.href || '#';
          const ext = /^https?:\/\//i.test(href);
          const target = ext ? ' target="_blank" rel="noopener noreferrer"' : '';
          return `<a href="${escapeHtml(href)}" class="social-btn" aria-label="${escapeHtml(link.label || link.id)}"${target}>
            <span class="social-btn__icon-wrap">
              <img src="${escapeAttr(assets.banner)}" alt="" class="social-btn__icon" width="57" height="57" decoding="async">
            </span>
            <span class="social-btn__label">${escapeHtml(link.label || link.id)}</span>
          </a>`;
        })
        .join('');
    }

    if (footerLinks) {
      footerLinks.innerHTML = list
        .map((link) => {
          const assets = SOCIAL_ICON_ASSETS[link.id];
          if (!assets) return '';
          const href = link.href || '#';
          const ext = /^https?:\/\//i.test(href);
          const target = ext ? ' target="_blank" rel="noopener noreferrer"' : '';
          return `<a href="${escapeHtml(href)}" class="footer-social-icon ${assets.footerClass}" aria-label="${escapeHtml(link.label || link.id)}"${target}>
            <img src="${escapeAttr(assets.footer)}" alt="${escapeHtml(link.label || link.id)}">
          </a>`;
        })
        .join('');
    }
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
    if (promoBound) return;
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
    promoBound = true;
  }

  function getHeroLcpImage(data) {
    return (data?.heroSlides || []).find((slide) => slide?.background)?.background || '';
  }

  function preloadLcpImage(url) {
    if (!url || String(url).startsWith('data:')) return;
    const href = String(url);
    let link = document.querySelector('link[data-preload-lcp="hero"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.setAttribute('data-preload-lcp', 'hero');
      document.head.appendChild(link);
    }
    link.href = href;
  }

  function preloadImage(url, options) {
    if (!url || String(url).startsWith('data:')) return;
    const img = new Image();
    img.decoding = 'async';
    if (options?.highPriority && 'fetchPriority' in img) {
      img.fetchPriority = 'high';
    }
    img.src = url;
  }

  function renderLanding(data) {
    renderHero(data);
    renderServiceCards(data.serviceCards);
    renderPromoBanner(data.promoBanner);
    renderPartners(data.partners);
    renderReviews(data.reviews);
    renderSocialLinks(data.socialLinks);
    renderConsultationPhoto(data.consultation?.photos);
    bindPromoClick();
    window.applyHeroSlide = applyHeroSlide;
    document.dispatchEvent(new CustomEvent('landingContentReady', { detail: data }));
  }

  async function initLandingContent() {
    const revealTimer = window.setTimeout(markLandingContentReady, REVEAL_TIMEOUT_MS);
    try {
      const localData = loadLandingDataFromLocal();
      const initialData = localData || migrateLandingData(null);
      preloadLcpImage(getHeroLcpImage(initialData));
      renderLanding(initialData);
      markLandingContentReady();
      preloadImage(getHeroLcpImage(initialData), { highPriority: true });

      const apiData = await loadLandingDataFromApi();
      if (apiData) {
        renderLanding(apiData);
        preloadImage(getHeroLcpImage(apiData), { highPriority: true });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
        } catch (e) {
          console.warn('Landing: localStorage update failed', e);
        }
      }
    } catch (e) {
      console.error('Landing content init failed', e);
      markLandingContentReady();
    } finally {
      window.clearTimeout(revealTimer);
    }
  }

  window.LandingContent = {
    loadLandingDataFromApi,
    loadLandingDataFromLocal,
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
