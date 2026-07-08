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
 * Контент страницы ЭТП — загрузка из API / localStorage и отрисовка.
 */
(function () {
  var STORAGE_KEY = 'crzrt_ecp_page_data';
  var CONTENT_PENDING_CLASS = 'ecp-content-pending';
  var CONTENT_READY_CLASS = 'ecp-content-ready';
  var DOWNLOAD_ARROW_SVG = '<span class="arrow-down-right"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L11 11M11 11V3M11 11H3" stroke="#1D9DFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
  var MANUAL_PDF_ICON_SRC = 'assets/img/ecp/icon-pdf.png';
  var VIDEO_PLAY_SVG = '<svg class="ecp-video-card__play" width="134" height="134" viewBox="0 0 134 134" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="67" cy="67" r="63" stroke="white" stroke-width="6"/><path d="M90 67L54 87.5V46.5L90 67Z" fill="white"/></svg>';
  var ECP_DEFAULTS = {
    hero: {
      background: '',
      title: 'Выгодные тарифы\nпоставщикам',
      titleColor: '#ffffff',
      titleTop: 122,
      titleLeft: 70,
      subtitle: 'Порядок осуществления процедур закупок представляет собой строго регламентированный жизненный цикл, который включает в себя шесть основных этапов: планирование, объявление закупки, подача и рассмотрение заявок, определение победителя, заключение контракта и его последующее исполнение.',
      subtitleColor: '#ffffff',
      subtitleTop: 213,
      subtitleLeft: 70
    },
    tariffs: [{
      text: 'Тарифы торговых\nпроцедур',
      file: ''
    }, {
      text: 'Тарифы АО\n«Татспиртпром»',
      file: ''
    }, {
      text: 'Индивидуальные тарифы',
      file: ''
    }, {
      text: 'Тарифы АНО ВО\n«Университет Иннополис»',
      file: ''
    }],
    blanks: {
      patternImage: 'uploads/d4cfd570b4a2548242759c7e47ea853918a2254c.png',
      items: [{
        text: 'Бланк доверенности\nна Представителя, включаемого\nв личный кабинет;',
        file: ''
      }, {
        text: 'Бланк заявления\nна запрос логина Представителя;',
        file: ''
      }, {
        text: 'Бланк заявления на включение\nПредставителя в личный кабинет;',
        file: ''
      }, {
        text: 'Бланк перечня используемых\nЗаказчиком способов закупок\nи протоколов.',
        file: ''
      }]
    },
    manual: {
      title: 'Руководство пользователя\nпо работе на ЭТП',
      bookImage: 'uploads/etp-book.png',
      items: [{
        title: 'Регламент пользования АИС ЭТП ЦРЗ РТ;',
        file: ''
      }, {
        title: 'Инструкция по настройке АРМ;',
        file: ''
      }, {
        title: 'Инструкция по работе Заказчика;',
        file: ''
      }, {
        title: 'Инструкция по работе участника.',
        file: ''
      }]
    },
    videos: [{
      url: '',
      title: 'Инструкция по созданию и наполнению плана закупок;',
      thumbnail: ''
    }, {
      url: '',
      title: 'Инструкция по созданию закупки через Мастер создания закупки по плану;',
      thumbnail: ''
    }, {
      url: '',
      title: 'Инструкция по созданию коммерческих закупок;',
      thumbnail: ''
    }, {
      url: '',
      title: 'Инструкция по формированию ответа на запрос разъяснений;',
      thumbnail: ''
    }, {
      url: '',
      title: 'Инструкция по рассмотрению заявок и размещению протокола;',
      thumbnail: ''
    }, {
      url: '',
      title: 'Инструкция по отправке договора на подписание участнику;',
      thumbnail: ''
    }, {
      url: '',
      title: 'Инструкция по подписанию договора;',
      thumbnail: ''
    }, {
      url: '',
      title: 'Инструкция по прикреплению/обновлению ЭП.',
      thumbnail: ''
    }],
    support: {
      background: '',
      title: 'Оперативная поддержка',
      items: ['Информационно-техническая поддержка', 'Персональный менеджер 24/7', 'Автоматическая рассылка приглашений к участию в закупке', 'Аналитические отчеты (как стандартные, так и по запросу)'],
      buttonText: 'Узнать подробнее',
      buttonLink: '#contacts'
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
  var ECP_HERO_SLIDE_DEFAULTS = {
    title: ECP_DEFAULTS.hero.title,
    subtitle: ECP_DEFAULTS.hero.subtitle,
    titleColor: ECP_DEFAULTS.hero.titleColor,
    subtitleColor: ECP_DEFAULTS.hero.subtitleColor,
    titleTop: ECP_DEFAULTS.hero.titleTop,
    titleLeft: ECP_DEFAULTS.hero.titleLeft,
    subtitleTop: ECP_DEFAULTS.hero.subtitleTop,
    subtitleLeft: ECP_DEFAULTS.hero.subtitleLeft
  };
  var ecpHeroRenderer = null;
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
    var _raw$blanks, _raw$blanks2, _raw$manual, _raw$manual2, _raw$manual3;
    var heroSlides = window.HeroSlides ? window.HeroSlides.migrateHeroSlides(raw, ECP_HERO_SLIDE_DEFAULTS) : [];
    var first = heroSlides[0] || {};
    var rawHero = raw !== null && raw !== void 0 && raw.hero && _typeof(raw.hero) === 'object' ? raw.hero : {};
    var hero = {
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
    var data = {
      heroSlides: heroSlides,
      hero: hero,
      tariffs: Array.isArray(raw === null || raw === void 0 ? void 0 : raw.tariffs) && raw.tariffs.length ? raw.tariffs : _toConsumableArray(ECP_DEFAULTS.tariffs),
      blanks: {
        patternImage: (raw === null || raw === void 0 || (_raw$blanks = raw.blanks) === null || _raw$blanks === void 0 ? void 0 : _raw$blanks.patternImage) || ECP_DEFAULTS.blanks.patternImage,
        items: Array.isArray(raw === null || raw === void 0 || (_raw$blanks2 = raw.blanks) === null || _raw$blanks2 === void 0 ? void 0 : _raw$blanks2.items) && raw.blanks.items.length ? raw.blanks.items : _toConsumableArray(ECP_DEFAULTS.blanks.items)
      },
      manual: {
        title: (raw === null || raw === void 0 || (_raw$manual = raw.manual) === null || _raw$manual === void 0 ? void 0 : _raw$manual.title) !== undefined ? raw.manual.title : ECP_DEFAULTS.manual.title,
        bookImage: (raw === null || raw === void 0 || (_raw$manual2 = raw.manual) === null || _raw$manual2 === void 0 ? void 0 : _raw$manual2.bookImage) || ECP_DEFAULTS.manual.bookImage,
        items: Array.isArray(raw === null || raw === void 0 || (_raw$manual3 = raw.manual) === null || _raw$manual3 === void 0 ? void 0 : _raw$manual3.items) && raw.manual.items.length ? raw.manual.items : _toConsumableArray(ECP_DEFAULTS.manual.items)
      },
      videos: Array.isArray(raw === null || raw === void 0 ? void 0 : raw.videos) && raw.videos.length ? raw.videos : _toConsumableArray(ECP_DEFAULTS.videos),
      support: migrateSupportData(raw === null || raw === void 0 ? void 0 : raw.support)
    };
    return data;
  }
  function migrateSupportData(rawSupport) {
    var raw = rawSupport && _typeof(rawSupport) === 'object' ? rawSupport : {};
    var items = [];
    if (Array.isArray(raw.items)) {
      items = raw.items.map(function (item) {
        return String(item || '').trim();
      }).filter(Boolean);
    } else if (typeof raw.items === 'string') {
      items = raw.items.split('\n').map(function (item) {
        return item.trim();
      }).filter(Boolean);
    }
    if (!items.length) {
      items = _toConsumableArray(ECP_DEFAULTS.support.items);
    }
    return {
      background: raw.background || raw.image || '',
      title: raw.title || ECP_DEFAULTS.support.title,
      items: items,
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
      var local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateEcpData(JSON.parse(local));
    } catch (error) {
      console.warn('ECP: localStorage parse error', error);
    }
    return null;
  }
  function loadEcpDataFromApi() {
    return _loadEcpDataFromApi.apply(this, arguments);
  }
  function _loadEcpDataFromApi() {
    _loadEcpDataFromApi = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
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
            return _context.a(2, migrateEcpData(data));
          case 3:
            _context.n = 5;
            break;
          case 4:
            _context.p = 4;
            _t = _context.v;
            console.warn('ECP: API unavailable', _t);
          case 5:
            return _context.a(2, null);
        }
      }, _callee, null, [[0, 4]]);
    }));
    return _loadEcpDataFromApi.apply(this, arguments);
  }
  function fileLinkAttrs(file) {
    var href = (file || '').trim() || '#';
    var isDownload = href !== '#' && !/^https?:\/\//i.test(href);
    var download = isDownload ? ' download' : '';
    var target = /^https?:\/\//i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return {
      href: escapeHtml(href),
      download: download,
      target: target
    };
  }
  function youtubeVideoId(url) {
    var match = String(url || '').match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : '';
  }
  function rutubeVideoId(url) {
    var match = String(url || '').match(/rutube\.ru\/video\/([a-f0-9]+)/i);
    return match ? match[1] : '';
  }
  function vkVideoId(url) {
    var str = String(url || '');
    var patterns = [/(?:vk\.com|vkvideo\.ru|vk\.ru|m\.vk\.com)\/video(-?\d+)_(\d+)/i, /[?&]z=video(-?\d+)_(\d+)/i, /[?&]vid=(-?\d+)_(\d+)/i];
    for (var _i = 0, _patterns = patterns; _i < _patterns.length; _i++) {
      var pattern = _patterns[_i];
      var match = str.match(pattern);
      if (match) return "".concat(match[1], "_").concat(match[2]);
    }
    var oidMatch = str.match(/[?&]oid=(-?\d+)/i);
    var idMatch = str.match(/[?&]id=(\d+)/i);
    if (oidMatch && idMatch) return "".concat(oidMatch[1], "_").concat(idMatch[1]);
    return '';
  }
  function vkVideoThumbProxyUrl(url) {
    if (!vkVideoId(url)) return '';
    return "api/video-thumb.php?url=".concat(encodeURIComponent(url), "&proxy=1");
  }
  function resolveVideoThumbnail(video) {
    if (video !== null && video !== void 0 && video.thumbnail) return video.thumbnail;
    var youtubeId = youtubeVideoId(video === null || video === void 0 ? void 0 : video.url);
    if (youtubeId) return "https://img.youtube.com/vi/".concat(youtubeId, "/hqdefault.jpg");
    var rutubeId = rutubeVideoId(video === null || video === void 0 ? void 0 : video.url);
    if (rutubeId) return "https://pic.rutube.ru/video/".concat(rutubeId, ".jpg");
    return vkVideoThumbProxyUrl(video === null || video === void 0 ? void 0 : video.url);
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
    var _data$heroSlides, _window$HeroSlides, _getEcpHeroRenderer;
    var slides = data !== null && data !== void 0 && (_data$heroSlides = data.heroSlides) !== null && _data$heroSlides !== void 0 && _data$heroSlides.length ? data.heroSlides : ((_window$HeroSlides = window.HeroSlides) === null || _window$HeroSlides === void 0 ? void 0 : _window$HeroSlides.migrateHeroSlides({
      hero: data === null || data === void 0 ? void 0 : data.hero
    }, ECP_HERO_SLIDE_DEFAULTS)) || [];
    (_getEcpHeroRenderer = getEcpHeroRenderer()) === null || _getEcpHeroRenderer === void 0 || _getEcpHeroRenderer.render(slides);
  }
  function renderTariffs(tariffs) {
    var grid = document.querySelector('.ecp-tariffs__grid');
    if (!grid) return;
    var list = tariffs && tariffs.length ? tariffs : ECP_DEFAULTS.tariffs;
    grid.innerHTML = list.map(function (item) {
      var link = fileLinkAttrs(item.file);
      return "<a href=\"".concat(link.href, "\" class=\"ecp-tariff-card\"").concat(link.target).concat(link.download, ">\n          <div class=\"ecp-tariff-card__icon-circle\">\n            <img src=\"assets/img/ecp/icon-tariff.png\" alt=\"\" class=\"ecp-tariff-card__icon\" width=\"103\" height=\"103\" decoding=\"async\">\n          </div>\n          <span class=\"ecp-tariff-card__text\">").concat(multilineHtml(item.text), "</span>\n          <div class=\"ecp-tariff-card__download\">\u0441\u043A\u0430\u0447\u0430\u0442\u044C ").concat(DOWNLOAD_ARROW_SVG, "</div>\n        </a>");
    }).join('');
  }
  function renderBlanks(blanks) {
    var _blanks$items;
    var patternImage = document.getElementById('image_blank');
    if (patternImage && blanks !== null && blanks !== void 0 && blanks.patternImage) {
      patternImage.setAttribute('href', blanks.patternImage);
    }
    var grid = document.querySelector('.ecp-blanks__grid');
    if (!grid) return;
    var list = blanks !== null && blanks !== void 0 && (_blanks$items = blanks.items) !== null && _blanks$items !== void 0 && _blanks$items.length ? blanks.items : ECP_DEFAULTS.blanks.items;
    grid.innerHTML = list.map(function (item) {
      var link = fileLinkAttrs(item.file);
      return "<a href=\"".concat(link.href, "\" class=\"ecp-blank-card\"").concat(link.target).concat(link.download, ">\n          <div class=\"ecp-blank-card__content\">\n            <span class=\"ecp-blank-card__text\">").concat(multilineHtml(item.text), "</span>\n            <div class=\"ecp-blank-card__download\">\u0441\u043A\u0430\u0447\u0430\u0442\u044C ").concat(DOWNLOAD_ARROW_SVG, "</div>\n          </div>\n          <div class=\"ecp-blank-card__icon\">\n            <svg width=\"90\" height=\"107\" viewBox=\"0 0 90 107\">\n              <rect width=\"90\" height=\"107\" fill=\"url(#pattern_blank)\"/>\n            </svg>\n          </div>\n        </a>");
    }).join('');
  }
  function renderManual(manual) {
    var _manual$items;
    var titleEl = document.querySelector('.ecp-manual__title');
    var listEl = document.querySelector('.ecp-manual__list');
    var bookEl = document.querySelector('.ecp-manual__image');
    var items = manual !== null && manual !== void 0 && (_manual$items = manual.items) !== null && _manual$items !== void 0 && _manual$items.length ? manual.items : ECP_DEFAULTS.manual.items;
    if (titleEl) {
      titleEl.innerHTML = multilineHtml((manual === null || manual === void 0 ? void 0 : manual.title) !== undefined ? manual.title : ECP_DEFAULTS.manual.title);
    }
    if (listEl) {
      listEl.innerHTML = items.map(function (item) {
        var link = fileLinkAttrs(item.file);
        return "<li class=\"ecp-manual__item\">\n            <img src=\"".concat(MANUAL_PDF_ICON_SRC, "\" alt=\"\" class=\"ecp-manual__icon\" width=\"45\" height=\"51\" decoding=\"async\">\n            <a href=\"").concat(link.href, "\" class=\"ecp-manual__link\"").concat(link.target).concat(link.download, ">").concat(escapeHtml(item.title), "</a>\n          </li>");
      }).join('');
    }
    if (bookEl && manual !== null && manual !== void 0 && manual.bookImage) {
      bookEl.src = manual.bookImage;
    }
  }
  function renderVideos(videos) {
    var grid = document.querySelector('.ecp-videos__grid');
    if (!grid) return;
    var list = videos && videos.length ? videos : ECP_DEFAULTS.videos;
    grid.innerHTML = list.map(function (video) {
      var href = (video.url || '').trim() || '#';
      var thumb = resolveVideoThumbnail(video);
      var thumbStyle = thumb ? " style=\"background-image:url('".concat(escapeAttr(thumb), "');background-size:cover;background-position:center;\"") : '';
      var target = href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
      return "<a href=\"".concat(escapeHtml(href), "\" class=\"ecp-video-card\"").concat(target, ">\n          <div class=\"ecp-video-card__thumbnail\"").concat(thumbStyle, ">\n            ").concat(VIDEO_PLAY_SVG, "\n          </div>\n          <div class=\"ecp-video-card__label\">").concat(escapeHtml(video.title), "</div>\n        </a>");
    }).join('');
    if (window.__reinitReveal) window.__reinitReveal('.ecp-video-card');
  }
  function bindSupportButton(support) {
    var btn = document.querySelector('.ecp-support-banner__btn');
    if (!btn) return;
    var link = ((support === null || support === void 0 ? void 0 : support.buttonLink) || '#contacts').trim();
    btn.textContent = (support === null || support === void 0 ? void 0 : support.buttonText) || ECP_DEFAULTS.support.buttonText;
    btn.type = 'button';
    btn.onclick = function () {
      if (link.startsWith('#')) {
        var target = document.querySelector(link);
        if (target) target.scrollIntoView({
          behavior: 'smooth'
        });
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
    var banner = document.querySelector('.ecp-support-banner');
    var titleEl = document.querySelector('.ecp-support-banner__title');
    var listEl = document.querySelector('.ecp-support-banner__list');
    var graphicEl = document.querySelector('.ecp-support-banner__graphic');
    var data = migrateSupportData(support);
    var background = (data.background || '').trim();
    var hasCustomBanner = Boolean(background);
    if (titleEl) titleEl.textContent = data.title;
    if (listEl) {
      listEl.innerHTML = data.items.map(function (item) {
        return "<li class=\"ecp-support-banner__item\">".concat(escapeHtml(item), "</li>");
      }).join('');
    }
    if (banner) {
      if (hasCustomBanner) {
        banner.style.backgroundImage = "url('".concat(background.replace(/'/g, "\\'"), "')");
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
    document.dispatchEvent(new CustomEvent('ecpContentReady', {
      detail: data
    }));
  }
  function initEcpContent() {
    return _initEcpContent.apply(this, arguments);
  }
  function _initEcpContent() {
    _initEcpContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var localData, initialData, apiData, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            localData = loadEcpDataFromLocal();
            initialData = localData || migrateEcpData(null);
            renderEcpPage(initialData);
            markEcpContentReady();
            _context2.n = 1;
            return loadEcpDataFromApi();
          case 1:
            apiData = _context2.v;
            if (apiData) {
              renderEcpPage(apiData);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
              } catch (error) {
                console.warn('ECP: localStorage update failed', error);
              }
            }
            _context2.n = 3;
            break;
          case 2:
            _context2.p = 2;
            _t2 = _context2.v;
            console.error('ECP content init failed', _t2);
            markEcpContentReady();
          case 3:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 2]]);
    }));
    return _initEcpContent.apply(this, arguments);
  }
  window.EcpContent = {
    STORAGE_KEY: STORAGE_KEY,
    ECP_DEFAULTS: ECP_DEFAULTS,
    migrateEcpData: migrateEcpData,
    migrateSupportData: migrateSupportData,
    loadEcpDataFromApi: loadEcpDataFromApi,
    loadEcpDataFromLocal: loadEcpDataFromLocal,
    resolveVideoThumbnail: resolveVideoThumbnail,
    vkVideoId: vkVideoId,
    vkVideoThumbProxyUrl: vkVideoThumbProxyUrl
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEcpContent);
  } else {
    initEcpContent();
  }
})();