function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * Карусель баннеров (до 8 слайдов) — общая логика для главной и внутренних страниц.
 */
(function () {
  var MAX_HERO_SLIDES = 8;
  function multilineHtml(str) {
    return String(str !== null && str !== void 0 ? str : '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  }
  function applyTypographyStyles(el, size, weight, italic, underline) {
    if (!el) return;
    if (size) {
      el.style.fontSize = "clamp(calc(".concat(size, "px * 0.5), calc(").concat(size, "px * (100cqw / 1520)), ").concat(size, "px)");
    } else {
      el.style.removeProperty('font-size');
    }
    if (weight) el.style.fontWeight = weight;else el.style.removeProperty('font-weight');
    if (italic) el.style.fontStyle = 'italic';else el.style.removeProperty('font-style');
    if (underline) el.style.textDecoration = 'underline';else el.style.removeProperty('text-decoration');
  }
  function normalizeSlide(slide, defaults) {
    var d = defaults || {};
    return {
      background: (slide === null || slide === void 0 ? void 0 : slide.background) || '',
      title: (slide === null || slide === void 0 ? void 0 : slide.title) !== undefined ? slide.title : d.title || '',
      titleColor: (slide === null || slide === void 0 ? void 0 : slide.titleColor) || d.titleColor || '#ffffff',
      titleTop: (slide === null || slide === void 0 ? void 0 : slide.titleTop) !== undefined ? parseInt(slide.titleTop, 10) : d.titleTop !== undefined ? d.titleTop : 122,
      titleLeft: (slide === null || slide === void 0 ? void 0 : slide.titleLeft) !== undefined ? parseInt(slide.titleLeft, 10) : d.titleLeft !== undefined ? d.titleLeft : 70,
      titleFontSize: (slide === null || slide === void 0 ? void 0 : slide.titleFontSize) || '',
      titleFontWeight: (slide === null || slide === void 0 ? void 0 : slide.titleFontWeight) || '',
      titleItalic: Boolean(slide === null || slide === void 0 ? void 0 : slide.titleItalic),
      titleUnderline: Boolean(slide === null || slide === void 0 ? void 0 : slide.titleUnderline),
      subtitle: (slide === null || slide === void 0 ? void 0 : slide.subtitle) !== undefined ? slide.subtitle : d.subtitle || '',
      subtitleColor: (slide === null || slide === void 0 ? void 0 : slide.subtitleColor) || d.subtitleColor || '#ffffff',
      subtitleTop: (slide === null || slide === void 0 ? void 0 : slide.subtitleTop) !== undefined ? parseInt(slide.subtitleTop, 10) : d.subtitleTop !== undefined ? d.subtitleTop : 213,
      subtitleLeft: (slide === null || slide === void 0 ? void 0 : slide.subtitleLeft) !== undefined ? parseInt(slide.subtitleLeft, 10) : d.subtitleLeft !== undefined ? d.subtitleLeft : 70,
      subtitleBottom: (slide === null || slide === void 0 ? void 0 : slide.subtitleBottom) !== undefined ? parseInt(slide.subtitleBottom, 10) : d.subtitleBottom !== undefined ? d.subtitleBottom : 40,
      subtitleFontSize: (slide === null || slide === void 0 ? void 0 : slide.subtitleFontSize) || '',
      subtitleFontWeight: (slide === null || slide === void 0 ? void 0 : slide.subtitleFontWeight) || '',
      subtitleItalic: Boolean(slide === null || slide === void 0 ? void 0 : slide.subtitleItalic),
      subtitleUnderline: Boolean(slide === null || slide === void 0 ? void 0 : slide.subtitleUnderline)
    };
  }
  function migrateHeroSlides(raw, defaults) {
    if (Array.isArray(raw === null || raw === void 0 ? void 0 : raw.heroSlides) && raw.heroSlides.length) {
      return raw.heroSlides.slice(0, MAX_HERO_SLIDES).map(function (slide) {
        return normalizeSlide(slide, defaults);
      });
    }
    var hero = raw !== null && raw !== void 0 && raw.hero && _typeof(raw.hero) === 'object' ? raw.hero : {};
    if (!Object.keys(hero).length && !defaults) {
      return [normalizeSlide({}, defaults)];
    }
    return [normalizeSlide(hero, defaults)];
  }
  function createRenderer(config) {
    var rootSelector = config.rootSelector,
      _config$customBgClass = config.customBgClass,
      customBgClass = _config$customBgClass === void 0 ? 'hero-slider--custom-bg' : _config$customBgClass,
      titleSelector = config.titleSelector,
      subtitleSelector = config.subtitleSelector,
      _config$graphicSelect = config.graphicSelector,
      graphicSelector = _config$graphicSelect === void 0 ? null : _config$graphicSelect,
      _config$contentSelect = config.contentSelector,
      contentSelector = _config$contentSelect === void 0 ? null : _config$contentSelect,
      _config$dotsSelector = config.dotsSelector,
      dotsSelector = _config$dotsSelector === void 0 ? '.hero-slide__dots' : _config$dotsSelector,
      _config$arrowsSelecto = config.arrowsSelector,
      arrowsSelector = _config$arrowsSelecto === void 0 ? '.hero-slide__arrows' : _config$arrowsSelecto,
      _config$subtitleUseBo = config.subtitleUseBottom,
      subtitleUseBottom = _config$subtitleUseBo === void 0 ? false : _config$subtitleUseBo,
      _config$titleColorFal = config.titleColorFallback,
      titleColorFallback = _config$titleColorFal === void 0 ? '#000000' : _config$titleColorFal,
      _config$subtitleColor = config.subtitleColorFallback,
      subtitleColorFallback = _config$subtitleColor === void 0 ? '#333333' : _config$subtitleColor;
    function getRoot() {
      return document.querySelector(rootSelector);
    }
    function applySlide(index) {
      var slides = window.__heroSlides;
      if (!slides || !slides.length) return;
      var i = (index % slides.length + slides.length) % slides.length;
      window.__heroCurrent = i;
      var slide = slides[i];
      var root = getRoot();
      var titleEl = document.querySelector(titleSelector);
      var subtitleEl = document.querySelector(subtitleSelector);
      var graphicEl = graphicSelector ? document.querySelector(graphicSelector) : null;
      var contentEl = contentSelector ? document.querySelector(contentSelector) : null;
      var background = (slide.background || '').trim();
      var hasCustomBanner = Boolean(background);
      if (root) {
        if (hasCustomBanner) {
          root.style.backgroundImage = "url('".concat(background.replace(/'/g, "\\'"), "')");
          root.classList.add(customBgClass);
        } else {
          root.style.backgroundImage = '';
          root.classList.remove(customBgClass);
        }
      }
      if (titleEl) {
        titleEl.innerHTML = multilineHtml(slide.title);
        if (slide.titleColor && slide.titleColor !== titleColorFallback) titleEl.style.color = slide.titleColor;else titleEl.style.removeProperty('color');
        if (slide.titleTop !== undefined) titleEl.style.top = "".concat(slide.titleTop, "px");
        if (slide.titleLeft !== undefined) {
          titleEl.style.left = "".concat(slide.titleLeft, "px");
          titleEl.style.width = 'auto';
          titleEl.style.maxWidth = "calc(100% - ".concat(slide.titleLeft, "px - 10px)");
        }
        applyTypographyStyles(titleEl, slide.titleFontSize, slide.titleFontWeight, slide.titleItalic, slide.titleUnderline);
      }
      if (subtitleEl) {
        subtitleEl.innerHTML = multilineHtml(slide.subtitle);
        if (slide.subtitleColor && slide.subtitleColor !== subtitleColorFallback) subtitleEl.style.color = slide.subtitleColor;else subtitleEl.style.removeProperty('color');
        if (subtitleUseBottom) {
          if (slide.subtitleBottom !== undefined) subtitleEl.style.bottom = "".concat(slide.subtitleBottom, "px");
          subtitleEl.style.removeProperty('top');
        } else {
          if (slide.subtitleTop !== undefined) subtitleEl.style.top = "".concat(slide.subtitleTop, "px");
          subtitleEl.style.removeProperty('bottom');
        }
        if (slide.subtitleLeft !== undefined) {
          subtitleEl.style.left = "".concat(slide.subtitleLeft, "px");
          subtitleEl.style.width = 'auto';
          subtitleEl.style.maxWidth = "calc(100% - ".concat(slide.subtitleLeft, "px - 10px)");
        }
        applyTypographyStyles(subtitleEl, slide.subtitleFontSize, slide.subtitleFontWeight, slide.subtitleItalic, slide.subtitleUnderline);
      }
      if (contentEl) contentEl.classList.remove('is-hidden');
      if (graphicEl) graphicEl.classList.toggle('is-hidden', hasCustomBanner);
      document.querySelectorAll("".concat(dotsSelector, " .dot")).forEach(function (dot, idx) {
        dot.classList.toggle('active', idx === i);
      });
    }
    function render(slidesInput, meta) {
      var slides = (slidesInput || []).filter(function (s) {
        return s && (s.background || s.title || s.subtitle);
      });
      if (!slides.length) return;
      var root = getRoot();
      if (!root) return;
      var first = slides[0];
      var background = (first.background || '').trim();
      var hasCustomBanner = Boolean(background);
      if (background) {
        root.style.backgroundImage = "url('".concat(background.replace(/'/g, "\\'"), "')");
        root.classList.add(customBgClass);
      } else {
        root.style.backgroundImage = '';
        root.classList.remove(customBgClass);
      }
      var titleEl = document.querySelector(titleSelector);
      var subtitleEl = document.querySelector(subtitleSelector);
      var graphicEl = graphicSelector ? document.querySelector(graphicSelector) : null;
      var contentEl = contentSelector ? document.querySelector(contentSelector) : null;
      if (titleEl) {
        titleEl.innerHTML = multilineHtml(first.title);
        if (first.titleColor && first.titleColor !== titleColorFallback) titleEl.style.color = first.titleColor;else titleEl.style.removeProperty('color');
        if (first.titleTop !== undefined) titleEl.style.top = "".concat(first.titleTop, "px");
        if (first.titleLeft !== undefined) {
          titleEl.style.left = "".concat(first.titleLeft, "px");
          titleEl.style.width = 'auto';
          titleEl.style.maxWidth = "calc(100% - ".concat(first.titleLeft, "px - 10px)");
        }
        applyTypographyStyles(titleEl, first.titleFontSize, first.titleFontWeight, first.titleItalic, first.titleUnderline);
      }
      if (subtitleEl) {
        subtitleEl.innerHTML = multilineHtml(first.subtitle);
        if (first.subtitleColor && first.subtitleColor !== subtitleColorFallback) subtitleEl.style.color = first.subtitleColor;else subtitleEl.style.removeProperty('color');
        if (subtitleUseBottom) {
          if (first.subtitleBottom !== undefined) subtitleEl.style.bottom = "".concat(first.subtitleBottom, "px");
          subtitleEl.style.removeProperty('top');
        } else {
          if (first.subtitleTop !== undefined) subtitleEl.style.top = "".concat(first.subtitleTop, "px");
          subtitleEl.style.removeProperty('bottom');
        }
        if (first.subtitleLeft !== undefined) {
          subtitleEl.style.left = "".concat(first.subtitleLeft, "px");
          subtitleEl.style.width = 'auto';
          subtitleEl.style.maxWidth = "calc(100% - ".concat(first.subtitleLeft, "px - 10px)");
        }
        applyTypographyStyles(subtitleEl, first.subtitleFontSize, first.subtitleFontWeight, first.subtitleItalic, first.subtitleUnderline);
      }
      if (meta !== null && meta !== void 0 && meta.gavelImage) {
        var gavelEl = document.querySelector('.consulting-hero-gavel');
        if (gavelEl) gavelEl.src = meta.gavelImage;
      }
      if (meta !== null && meta !== void 0 && meta.graphic) {
        var graphicImg = document.querySelector('.consulting-hero-gavel');
        if (graphicImg) graphicImg.src = meta.graphic;
      }
      if (contentEl) contentEl.classList.remove('is-hidden');
      if (graphicEl) graphicEl.classList.toggle('is-hidden', hasCustomBanner);
      var dotsWrap = document.querySelector(dotsSelector);
      var arrowsWrap = document.querySelector(arrowsSelector);
      var hasMultipleSlides = slides.length > 1;
      if (dotsWrap) {
        dotsWrap.innerHTML = hasMultipleSlides ? slides.map(function (_, idx) {
          return "<span class=\"dot".concat(idx === 0 ? ' active' : '', "\" data-slide=\"").concat(idx, "\"></span>");
        }).join('') : '';
        dotsWrap.classList.toggle('is-hidden', !hasMultipleSlides);
      }
      if (arrowsWrap) {
        arrowsWrap.classList.toggle('is-hidden', !hasMultipleSlides);
      }
      window.__heroSlides = slides;
      window.__heroCurrent = 0;
      window.applyHeroSlide = applySlide;
      document.dispatchEvent(new CustomEvent('heroSlidesUpdated', {
        detail: {
          count: slides.length
        }
      }));
    }
    return {
      render: render,
      applySlide: applySlide
    };
  }
  window.HeroSlides = {
    MAX_HERO_SLIDES: MAX_HERO_SLIDES,
    normalizeSlide: normalizeSlide,
    migrateHeroSlides: migrateHeroSlides,
    createRenderer: createRenderer,
    multilineHtml: multilineHtml
  };
})();