function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * Контент страницы «Юридический консалтинг» — загрузка из API / localStorage и отрисовка.
 */
(function () {
  var STORAGE_KEY = 'crzrt_consulting_page_data';
  var CONTENT_PENDING_CLASS = 'consulting-content-pending';
  var CONTENT_READY_CLASS = 'consulting-content-ready';
  var DEFAULT_COMPETENCIES = [{
    title: 'Решения\nдля бизнеса',
    icon: 'assets/img/consulting/icon-business.png',
    link: '#competencies',
    description: ''
  }, {
    title: 'Сложные\nсудебные споры',
    icon: 'assets/img/consulting/icon-disputes.png',
    link: '#competencies',
    description: ''
  }, {
    title: 'Сопровождение\nсделок',
    icon: 'assets/img/consulting/icon-deals.png',
    link: '#competencies',
    description: ''
  }, {
    title: 'Поддержка\nгосзаказчиков',
    icon: 'assets/img/consulting/icon-public.png',
    link: '#competencies',
    description: ''
  }, {
    title: 'Конкурентный\nконсалтинг',
    icon: 'assets/img/consulting/icon-competitor.png',
    link: '#competencies',
    description: ''
  }, {
    title: 'Корпоративное\nправо',
    icon: 'assets/img/consulting/icon-corporate.png',
    link: '#competencies',
    description: ''
  }];
  var CONSULTING_DEFAULTS = {
    hero: {
      background: '',
      graphic: 'assets/img/consulting/banner-gavel.png',
      title: 'Защищаем\nваши интересы',
      titleColor: '#ffffff',
      titleTop: 122,
      titleLeft: 70,
      subtitle: 'Профессиональная юридическая поддержка в сфере закупок: сопровождение сделок, представительство в спорах, консультации для заказчиков и поставщиков на всех этапах.',
      subtitleColor: '#ffffff',
      subtitleTop: 213,
      subtitleLeft: 70
    },
    competenciesTitle: 'Компетенции',
    competencies: [].concat(DEFAULT_COMPETENCIES),
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
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function multilineHtml(str) {
    return escapeHtml(str || '').split('\n').filter(function (line, i, arr) {
      return line.length || i < arr.length - 1;
    }).join('<br>');
  }
  function migrateWhyUs(rawWhy) {
    var _raw$lead, _raw$photo, _raw$photo2, _raw$support, _raw$side, _raw$side2;
    var raw = rawWhy && _typeof(rawWhy) === 'object' ? rawWhy : {};
    var defaults = CONSULTING_DEFAULTS.whyUs;
    return {
      title: raw.title || defaults.title,
      lead: {
        text: ((_raw$lead = raw.lead) === null || _raw$lead === void 0 ? void 0 : _raw$lead.text) || defaults.lead.text
      },
      photo: {
        image: ((_raw$photo = raw.photo) === null || _raw$photo === void 0 ? void 0 : _raw$photo.image) || defaults.photo.image,
        caption: ((_raw$photo2 = raw.photo) === null || _raw$photo2 === void 0 ? void 0 : _raw$photo2.caption) || defaults.photo.caption
      },
      support: {
        text: ((_raw$support = raw.support) === null || _raw$support === void 0 ? void 0 : _raw$support.text) || defaults.support.text
      },
      side: {
        text: ((_raw$side = raw.side) === null || _raw$side === void 0 ? void 0 : _raw$side.text) || defaults.side.text,
        image: ((_raw$side2 = raw.side) === null || _raw$side2 === void 0 ? void 0 : _raw$side2.image) || defaults.side.image
      }
    };
  }
  var CONSULTING_HERO_SLIDE_DEFAULTS = {
    title: CONSULTING_DEFAULTS.hero.title,
    subtitle: CONSULTING_DEFAULTS.hero.subtitle,
    titleColor: CONSULTING_DEFAULTS.hero.titleColor,
    subtitleColor: CONSULTING_DEFAULTS.hero.subtitleColor,
    titleTop: CONSULTING_DEFAULTS.hero.titleTop,
    titleLeft: CONSULTING_DEFAULTS.hero.titleLeft,
    subtitleTop: CONSULTING_DEFAULTS.hero.subtitleTop,
    subtitleLeft: CONSULTING_DEFAULTS.hero.subtitleLeft
  };
  var consultingHeroRenderer = null;
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
    var heroSlides = window.HeroSlides ? window.HeroSlides.migrateHeroSlides(raw, CONSULTING_HERO_SLIDE_DEFAULTS) : [];
    var first = heroSlides[0] || {};
    var rawHero = raw !== null && raw !== void 0 && raw.hero && _typeof(raw.hero) === 'object' ? raw.hero : {};
    var hero = {
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
    var competencies = Array.isArray(raw === null || raw === void 0 ? void 0 : raw.competencies) && raw.competencies.length ? raw.competencies.map(function (item) {
      return {
        title: (item === null || item === void 0 ? void 0 : item.title) || '',
        icon: (item === null || item === void 0 ? void 0 : item.icon) || '',
        link: (item === null || item === void 0 ? void 0 : item.link) || '#competencies',
        description: (item === null || item === void 0 ? void 0 : item.description) || ''
      };
    }) : _toConsumableArray(CONSULTING_DEFAULTS.competencies);
    return {
      heroSlides: heroSlides,
      hero: hero,
      competenciesTitle: (raw === null || raw === void 0 ? void 0 : raw.competenciesTitle) || CONSULTING_DEFAULTS.competenciesTitle,
      competencies: competencies,
      whyUs: migrateWhyUs(raw === null || raw === void 0 ? void 0 : raw.whyUs)
    };
  }
  function markConsultingContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }
  function loadConsultingDataFromLocal() {
    try {
      var local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateConsultingData(JSON.parse(local));
    } catch (error) {
      console.warn('Consulting: localStorage parse error', error);
    }
    return null;
  }
  function loadConsultingDataFromApi() {
    return _loadConsultingDataFromApi.apply(this, arguments);
  }
  function _loadConsultingDataFromApi() {
    _loadConsultingDataFromApi = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var resp, data, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            _context.n = 1;
            return fetch("api/settings.php?key=".concat(STORAGE_KEY));
          case 1:
            resp = _context.v;
            if (!resp.ok) {
              _context.n = 3;
              break;
            }
            _context.n = 2;
            return resp.json();
          case 2:
            data = _context.v;
            if (!(data && _typeof(data) === 'object' && Object.keys(data).length)) {
              _context.n = 3;
              break;
            }
            return _context.a(2, migrateConsultingData(data));
          case 3:
            _context.n = 5;
            break;
          case 4:
            _context.p = 4;
            _t = _context.v;
            console.warn('Consulting: API unavailable', _t);
          case 5:
            return _context.a(2, null);
        }
      }, _callee, null, [[0, 4]]);
    }));
    return _loadConsultingDataFromApi.apply(this, arguments);
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
  function renderHero(data) {
    var _data$heroSlides, _window$HeroSlides, _getConsultingHeroRen, _data$hero;
    var slides = data !== null && data !== void 0 && (_data$heroSlides = data.heroSlides) !== null && _data$heroSlides !== void 0 && _data$heroSlides.length ? data.heroSlides : ((_window$HeroSlides = window.HeroSlides) === null || _window$HeroSlides === void 0 ? void 0 : _window$HeroSlides.migrateHeroSlides({
      hero: data === null || data === void 0 ? void 0 : data.hero
    }, CONSULTING_HERO_SLIDE_DEFAULTS)) || [];
    (_getConsultingHeroRen = getConsultingHeroRenderer()) === null || _getConsultingHeroRen === void 0 || _getConsultingHeroRen.render(slides, {
      graphic: data === null || data === void 0 || (_data$hero = data.hero) === null || _data$hero === void 0 ? void 0 : _data$hero.graphic
    });
  }
  var publicModalOverlay = null;
  function openPublicModal(cardData) {
    if (!publicModalOverlay) {
      publicModalOverlay = document.createElement('div');
      publicModalOverlay.className = 'comp-public-overlay';
      publicModalOverlay.innerHTML = "\n        <div class=\"comp-public-card\">\n          <button type=\"button\" class=\"comp-public-close\" aria-label=\"\u0417\u0430\u043A\u0440\u044B\u0442\u044C\">\n            <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">\n              <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line>\n              <line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line>\n            </svg>\n          </button>\n          <div class=\"comp-public-header\">\n            <div class=\"comp-public-icon-circle\">\n              <img src=\"\" alt=\"\" class=\"comp-public-icon\">\n            </div>\n            <h3 class=\"comp-public-title\"></h3>\n          </div>\n          <div class=\"comp-public-body\"></div>\n        </div>\n      ";
      document.body.appendChild(publicModalOverlay);

      // Close events
      publicModalOverlay.addEventListener('click', function (e) {
        if (e.target === publicModalOverlay) {
          closePublicModal();
        }
      });
      publicModalOverlay.querySelector('.comp-public-close').addEventListener('click', closePublicModal);

      // Close on Esc key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && publicModalOverlay.classList.contains('is-active')) {
          closePublicModal();
        }
      });
    }
    var titleEl = publicModalOverlay.querySelector('.comp-public-title');
    var iconEl = publicModalOverlay.querySelector('.comp-public-icon');
    var bodyEl = publicModalOverlay.querySelector('.comp-public-body');
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
      setTimeout(function () {
        if (!publicModalOverlay.classList.contains('is-active')) {
          publicModalOverlay.style.display = 'none';
        }
      }, 300);
    }
  }
  function renderCompetencies(data) {
    var _data$competencies;
    var titleEl = document.querySelector('.consulting-competencies-title');
    var grid = document.querySelector('.consulting-competencies-grid');
    var title = (data === null || data === void 0 ? void 0 : data.competenciesTitle) || CONSULTING_DEFAULTS.competenciesTitle;
    var list = data !== null && data !== void 0 && (_data$competencies = data.competencies) !== null && _data$competencies !== void 0 && _data$competencies.length ? data.competencies : CONSULTING_DEFAULTS.competencies;
    if (titleEl) titleEl.textContent = title;
    if (!grid) return;
    grid.innerHTML = list.map(function (item) {
      var href = escapeAttr((item.link || '#competencies').trim() || '#competencies');
      var icon = escapeAttr(item.icon || '');
      var desc = escapeAttr(item.description || '');
      return "<a href=\"".concat(href, "\" class=\"consulting-competency-card\" data-description=\"").concat(desc, "\">\n          <div class=\"consulting-competency-card__icon-circle\">\n            <img src=\"").concat(icon, "\" alt=\"\" class=\"consulting-competency-card__icon\" width=\"109\" height=\"110\" decoding=\"async\">\n          </div>\n          <span class=\"consulting-competency-card__title\">").concat(multilineHtml(item.title), "</span>\n        </a>");
    }).join('');
    if (!grid.dataset.listenerBound) {
      grid.addEventListener('click', function (e) {
        var card = e.target.closest('.consulting-competency-card');
        if (!card) return;
        var description = card.getAttribute('data-description');
        if (description && description.trim().length > 0) {
          var _card$querySelector, _card$querySelector2;
          e.preventDefault();
          var _title = ((_card$querySelector = card.querySelector('.consulting-competency-card__title')) === null || _card$querySelector === void 0 ? void 0 : _card$querySelector.innerHTML) || '';
          var icon = ((_card$querySelector2 = card.querySelector('.consulting-competency-card__icon')) === null || _card$querySelector2 === void 0 ? void 0 : _card$querySelector2.getAttribute('src')) || '';
          openPublicModal({
            title: _title,
            icon: icon,
            description: description
          });
        }
      });
      grid.dataset.listenerBound = 'true';
    }
  }
  function renderWhyUs(whyUs) {
    var data = migrateWhyUs(whyUs);
    var titleEl = document.querySelector('.consulting-why-title');
    var mosaic = document.querySelector('.consulting-why-mosaic');
    if (titleEl) titleEl.textContent = data.title;
    if (!mosaic) return;
    var photoSrc = escapeAttr(data.photo.image);
    var sideSrc = escapeAttr(data.side.image);
    var sideImage = (data.side.image || '').trim();
    mosaic.innerHTML = "\n      <div class=\"consulting-why-card consulting-why-card--lead\">\n        <p class=\"consulting-why-card__lead-text\">".concat(multilineHtml(data.lead.text), "</p>\n      </div>\n      <div class=\"consulting-why-card consulting-why-card--photo\">\n        <img src=\"").concat(photoSrc, "\" alt=\"\" class=\"consulting-why-card__photo\" width=\"494\" height=\"329\" decoding=\"async\">\n        <p class=\"consulting-why-card__photo-caption\">").concat(escapeHtml(data.photo.caption), "</p>\n      </div>\n      <div class=\"consulting-why-card consulting-why-card--support\">\n        <p class=\"consulting-why-card__support-text\">").concat(multilineHtml(data.support.text), "</p>\n      </div>\n      <div class=\"consulting-why-card consulting-why-card--side").concat(sideImage ? ' consulting-why-card--has-image' : '', "\">\n        ").concat(sideImage ? "<img src=\"".concat(sideSrc, "\" alt=\"\" class=\"consulting-why-card__side-image\" decoding=\"async\">") : '', "\n        <p class=\"consulting-why-card__side-text\">").concat(multilineHtml(data.side.text), "</p>\n      </div>");
  }
  function renderConsultingPage(data) {
    renderHero(data);
    renderCompetencies(data);
    renderWhyUs(data.whyUs);
    document.dispatchEvent(new CustomEvent('consultingContentReady', {
      detail: data
    }));
  }
  function initConsultingContent() {
    return _initConsultingContent.apply(this, arguments);
  }
  function _initConsultingContent() {
    _initConsultingContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var localData, initialData, apiData, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            localData = loadConsultingDataFromLocal();
            initialData = localData || migrateConsultingData(null);
            renderConsultingPage(initialData);
            markConsultingContentReady();
            _context2.n = 1;
            return loadConsultingDataFromApi();
          case 1:
            apiData = _context2.v;
            if (apiData) {
              renderConsultingPage(apiData);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
              } catch (error) {
                console.warn('Consulting: localStorage update failed', error);
              }
            }
            _context2.n = 3;
            break;
          case 2:
            _context2.p = 2;
            _t2 = _context2.v;
            console.error('Consulting content init failed', _t2);
            markConsultingContentReady();
          case 3:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 2]]);
    }));
    return _initConsultingContent.apply(this, arguments);
  }
  window.ConsultingContent = {
    STORAGE_KEY: STORAGE_KEY,
    CONSULTING_DEFAULTS: CONSULTING_DEFAULTS,
    migrateConsultingData: migrateConsultingData,
    migrateWhyUs: migrateWhyUs,
    loadConsultingDataFromApi: loadConsultingDataFromApi,
    loadConsultingDataFromLocal: loadConsultingDataFromLocal
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsultingContent);
  } else {
    initConsultingContent();
  }
})();