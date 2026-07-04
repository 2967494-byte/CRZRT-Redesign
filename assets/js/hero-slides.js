/**
 * Карусель баннеров (до 8 слайдов) — общая логика для главной и внутренних страниц.
 */
(function () {
  const MAX_HERO_SLIDES = 8;

  function multilineHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
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

  function normalizeSlide(slide, defaults) {
    const d = defaults || {};
    return {
      background: slide?.background || '',
      title: slide?.title !== undefined ? slide.title : d.title || '',
      titleColor: slide?.titleColor || d.titleColor || '#ffffff',
      titleTop: slide?.titleTop !== undefined ? parseInt(slide.titleTop, 10) : d.titleTop !== undefined ? d.titleTop : 122,
      titleLeft: slide?.titleLeft !== undefined ? parseInt(slide.titleLeft, 10) : d.titleLeft !== undefined ? d.titleLeft : 70,
      titleFontSize: slide?.titleFontSize || '',
      titleFontWeight: slide?.titleFontWeight || '',
      titleItalic: Boolean(slide?.titleItalic),
      titleUnderline: Boolean(slide?.titleUnderline),
      subtitle: slide?.subtitle !== undefined ? slide.subtitle : d.subtitle || '',
      subtitleColor: slide?.subtitleColor || d.subtitleColor || '#ffffff',
      subtitleTop: slide?.subtitleTop !== undefined ? parseInt(slide.subtitleTop, 10) : d.subtitleTop !== undefined ? d.subtitleTop : 213,
      subtitleLeft: slide?.subtitleLeft !== undefined ? parseInt(slide.subtitleLeft, 10) : d.subtitleLeft !== undefined ? d.subtitleLeft : 70,
      subtitleBottom: slide?.subtitleBottom !== undefined ? parseInt(slide.subtitleBottom, 10) : d.subtitleBottom !== undefined ? d.subtitleBottom : 40,
      subtitleFontSize: slide?.subtitleFontSize || '',
      subtitleFontWeight: slide?.subtitleFontWeight || '',
      subtitleItalic: Boolean(slide?.subtitleItalic),
      subtitleUnderline: Boolean(slide?.subtitleUnderline)
    };
  }

  function migrateHeroSlides(raw, defaults) {
    if (Array.isArray(raw?.heroSlides) && raw.heroSlides.length) {
      return raw.heroSlides.slice(0, MAX_HERO_SLIDES).map((slide) => normalizeSlide(slide, defaults));
    }
    const hero = raw?.hero && typeof raw.hero === 'object' ? raw.hero : {};
    if (!Object.keys(hero).length && !defaults) {
      return [normalizeSlide({}, defaults)];
    }
    return [normalizeSlide(hero, defaults)];
  }

  function createRenderer(config) {
    const {
      rootSelector,
      customBgClass = 'hero-slider--custom-bg',
      titleSelector,
      subtitleSelector,
      graphicSelector = null,
      contentSelector = null,
      dotsSelector = '.hero-slide__dots',
      arrowsSelector = '.hero-slide__arrows',
      subtitleUseBottom = false,
      titleColorFallback = '#000000',
      subtitleColorFallback = '#333333'
    } = config;

    function getRoot() {
      return document.querySelector(rootSelector);
    }

    function applySlide(index) {
      const slides = window.__heroSlides;
      if (!slides || !slides.length) return;
      const i = ((index % slides.length) + slides.length) % slides.length;
      window.__heroCurrent = i;
      const slide = slides[i];
      const root = getRoot();
      const titleEl = document.querySelector(titleSelector);
      const subtitleEl = document.querySelector(subtitleSelector);
      const graphicEl = graphicSelector ? document.querySelector(graphicSelector) : null;
      const contentEl = contentSelector ? document.querySelector(contentSelector) : null;
      const background = (slide.background || '').trim();
      const hasCustomBanner = Boolean(background);

      if (root) {
        if (hasCustomBanner) {
          root.style.backgroundImage = `url('${background.replace(/'/g, "\\'")}')`;
          root.classList.add(customBgClass);
        } else {
          root.style.backgroundImage = '';
          root.classList.remove(customBgClass);
        }
      }

      if (titleEl) {
        titleEl.innerHTML = multilineHtml(slide.title);
        if (slide.titleColor && slide.titleColor !== titleColorFallback) titleEl.style.color = slide.titleColor;
        else titleEl.style.removeProperty('color');
        if (slide.titleTop !== undefined) titleEl.style.top = `${slide.titleTop}px`;
        if (slide.titleLeft !== undefined) titleEl.style.left = `${slide.titleLeft}px`;
        applyTypographyStyles(titleEl, slide.titleFontSize, slide.titleFontWeight, slide.titleItalic, slide.titleUnderline);
      }

      if (subtitleEl) {
        subtitleEl.innerHTML = multilineHtml(slide.subtitle);
        if (slide.subtitleColor && slide.subtitleColor !== subtitleColorFallback) subtitleEl.style.color = slide.subtitleColor;
        else subtitleEl.style.removeProperty('color');
        if (subtitleUseBottom) {
          if (slide.subtitleBottom !== undefined) subtitleEl.style.bottom = `${slide.subtitleBottom}px`;
          subtitleEl.style.removeProperty('top');
        } else {
          if (slide.subtitleTop !== undefined) subtitleEl.style.top = `${slide.subtitleTop}px`;
          subtitleEl.style.removeProperty('bottom');
        }
        if (slide.subtitleLeft !== undefined) subtitleEl.style.left = `${slide.subtitleLeft}px`;
        applyTypographyStyles(subtitleEl, slide.subtitleFontSize, slide.subtitleFontWeight, slide.subtitleItalic, slide.subtitleUnderline);
      }

      if (contentEl) contentEl.classList.remove('is-hidden');
      if (graphicEl) graphicEl.classList.toggle('is-hidden', hasCustomBanner);

      document.querySelectorAll(`${dotsSelector} .dot`).forEach((dot, idx) => {
        dot.classList.toggle('active', idx === i);
      });
    }

    function render(slidesInput, meta) {
      const slides = (slidesInput || []).filter((s) => s && (s.background || s.title || s.subtitle));
      if (!slides.length) return;

      const root = getRoot();
      if (!root) return;

      const first = slides[0];
      const background = (first.background || '').trim();
      const hasCustomBanner = Boolean(background);

      if (background) {
        root.style.backgroundImage = `url('${background.replace(/'/g, "\\'")}')`;
        root.classList.add(customBgClass);
      } else {
        root.style.backgroundImage = '';
        root.classList.remove(customBgClass);
      }

      const titleEl = document.querySelector(titleSelector);
      const subtitleEl = document.querySelector(subtitleSelector);
      const graphicEl = graphicSelector ? document.querySelector(graphicSelector) : null;
      const contentEl = contentSelector ? document.querySelector(contentSelector) : null;

      if (titleEl) {
        titleEl.innerHTML = multilineHtml(first.title);
        if (first.titleColor && first.titleColor !== titleColorFallback) titleEl.style.color = first.titleColor;
        else titleEl.style.removeProperty('color');
        if (first.titleTop !== undefined) titleEl.style.top = `${first.titleTop}px`;
        if (first.titleLeft !== undefined) titleEl.style.left = `${first.titleLeft}px`;
        applyTypographyStyles(titleEl, first.titleFontSize, first.titleFontWeight, first.titleItalic, first.titleUnderline);
      }

      if (subtitleEl) {
        subtitleEl.innerHTML = multilineHtml(first.subtitle);
        if (first.subtitleColor && first.subtitleColor !== subtitleColorFallback) subtitleEl.style.color = first.subtitleColor;
        else subtitleEl.style.removeProperty('color');
        if (subtitleUseBottom) {
          if (first.subtitleBottom !== undefined) subtitleEl.style.bottom = `${first.subtitleBottom}px`;
          subtitleEl.style.removeProperty('top');
        } else {
          if (first.subtitleTop !== undefined) subtitleEl.style.top = `${first.subtitleTop}px`;
          subtitleEl.style.removeProperty('bottom');
        }
        if (first.subtitleLeft !== undefined) subtitleEl.style.left = `${first.subtitleLeft}px`;
        applyTypographyStyles(subtitleEl, first.subtitleFontSize, first.subtitleFontWeight, first.subtitleItalic, first.subtitleUnderline);
      }

      if (meta?.gavelImage) {
        const gavelEl = document.querySelector('.consulting-hero-gavel');
        if (gavelEl) gavelEl.src = meta.gavelImage;
      }
      if (meta?.graphic) {
        const graphicImg = document.querySelector('.consulting-hero-gavel');
        if (graphicImg) graphicImg.src = meta.graphic;
      }

      if (contentEl) contentEl.classList.remove('is-hidden');
      if (graphicEl) graphicEl.classList.toggle('is-hidden', hasCustomBanner);

      const dotsWrap = document.querySelector(dotsSelector);
      const arrowsWrap = document.querySelector(arrowsSelector);
      const hasMultipleSlides = slides.length > 1;

      if (dotsWrap) {
        dotsWrap.innerHTML = hasMultipleSlides
          ? slides.map((_, idx) => `<span class="dot${idx === 0 ? ' active' : ''}" data-slide="${idx}"></span>`).join('')
          : '';
        dotsWrap.classList.toggle('is-hidden', !hasMultipleSlides);
      }

      if (arrowsWrap) {
        arrowsWrap.classList.toggle('is-hidden', !hasMultipleSlides);
      }

      window.__heroSlides = slides;
      window.__heroCurrent = 0;
      window.applyHeroSlide = applySlide;
      document.dispatchEvent(new CustomEvent('heroSlidesUpdated', { detail: { count: slides.length } }));
    }

    return { render, applySlide };
  }

  window.HeroSlides = {
    MAX_HERO_SLIDES,
    normalizeSlide,
    migrateHeroSlides,
    createRenderer,
    multilineHtml
  };
})();
