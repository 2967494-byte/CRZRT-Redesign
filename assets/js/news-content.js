function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * Контент страницы «Новости» — загрузка из API / localStorage и отрисовка.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'crzrt_news_page_data';
  var CONTENT_PENDING_CLASS = 'news-content-pending';
  var CONTENT_READY_CLASS = 'news-content-ready';
  var DEFAULT_NEWS_PAGE = {
    hero: {
      background: '',
      title: 'Новости',
      subtitle: '',
      titleColor: '#575B6D',
      subtitleColor: '#FFFFFF',
      titleTop: 122,
      titleLeft: 70,
      subtitleTop: 213,
      subtitleLeft: 70
    },
    items: [{
      id: 'news_demo_1',
      image: '',
      title: 'Семинары по госзакупкам прошли в городе Альметьевск Республике Татарстан',
      date: '2026-03-26',
      text: '<p>Применительно к закупкам работ и услуг Минфин разъяснил, по каким признакам товар считается «поставляемым».</p>',
      active: true
    }, {
      id: 'news_demo_2',
      image: '',
      title: 'Семинары по госзакупкам прошли в городе Альметьевск Республике Татарстан',
      date: '2026-03-24',
      text: '<p>Применительно к закупкам работ и услуг Минфин разъяснил, по каким признакам товар считается «поставляемым».</p>',
      active: true
    }]
  };
  var isNewsPage = document.body.dataset.page === 'news';
  var currentNewsItems = [];
  var currentNewsPage = 1;
  var ITEMS_PER_PAGE = 4;
  if (isNewsPage) {
    document.documentElement.classList.add(CONTENT_PENDING_CLASS);
  }
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function multilineHtml(str) {
    return escapeHtml(str || '').split('\n').filter(function (line, i, arr) {
      return line.length || i < arr.length - 1;
    }).join('<br>');
  }
  function parseIsoDate(value) {
    if (!value || typeof value !== 'string') return null;
    var match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    var year = parseInt(match[1], 10);
    var month = parseInt(match[2], 10);
    var day = parseInt(match[3], 10);
    var date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
  }
  function formatNewsDateDisplay(value) {
    var date = parseIsoDate(value);
    if (!date) return String(value || '').trim();
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0');
    return "".concat(day, ".").concat(month, ".").concat(date.getFullYear());
  }
  function stripHtml(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return (tmp.textContent || tmp.innerText || '').trim();
  }
  function excerptFromHtml(html) {
    var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 160;
    var text = stripHtml(html);
    if (text.length <= max) return text;
    return "".concat(text.slice(0, max - 1).trim(), "\u2026");
  }
  function createNewsId() {
    return "news_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 8));
  }
  function normalizeNewsItem(raw, index) {
    var dateRaw = String((raw === null || raw === void 0 ? void 0 : raw.date) || '').trim();
    var parsed = parseIsoDate(dateRaw);
    return {
      id: String((raw === null || raw === void 0 ? void 0 : raw.id) || createNewsId() || "news_".concat(index)),
      image: String((raw === null || raw === void 0 ? void 0 : raw.image) || '').trim(),
      title: String((raw === null || raw === void 0 ? void 0 : raw.title) || '').trim(),
      date: parsed ? dateRaw : '',
      text: typeof (raw === null || raw === void 0 ? void 0 : raw.text) === 'string' ? raw.text : '',
      active: (raw === null || raw === void 0 ? void 0 : raw.active) !== false
    };
  }
  function migrateNewsPageData(raw) {
    var rawHero = raw !== null && raw !== void 0 && raw.hero && _typeof(raw.hero) === 'object' ? raw.hero : {};
    var items = Array.isArray(raw === null || raw === void 0 ? void 0 : raw.items) ? raw.items.map(function (item, index) {
      return normalizeNewsItem(item, index);
    }) : !raw ? DEFAULT_NEWS_PAGE.items.map(function (item) {
      return _objectSpread({}, item);
    }) : [];
    return {
      hero: {
        background: rawHero.background || '',
        title: rawHero.title || DEFAULT_NEWS_PAGE.hero.title,
        subtitle: rawHero.subtitle || DEFAULT_NEWS_PAGE.hero.subtitle,
        titleColor: rawHero.titleColor || DEFAULT_NEWS_PAGE.hero.titleColor,
        subtitleColor: rawHero.subtitleColor || DEFAULT_NEWS_PAGE.hero.subtitleColor,
        titleTop: rawHero.titleTop !== undefined ? parseInt(rawHero.titleTop, 10) : DEFAULT_NEWS_PAGE.hero.titleTop,
        titleLeft: rawHero.titleLeft !== undefined ? parseInt(rawHero.titleLeft, 10) : DEFAULT_NEWS_PAGE.hero.titleLeft,
        titleFontSize: rawHero.titleFontSize || '',
        titleFontWeight: rawHero.titleFontWeight || '',
        titleItalic: rawHero.titleItalic || false,
        titleUnderline: rawHero.titleUnderline || false,
        subtitleTop: rawHero.subtitleTop !== undefined ? parseInt(rawHero.subtitleTop, 10) : DEFAULT_NEWS_PAGE.hero.subtitleTop,
        subtitleLeft: rawHero.subtitleLeft !== undefined ? parseInt(rawHero.subtitleLeft, 10) : DEFAULT_NEWS_PAGE.hero.subtitleLeft,
        subtitleFontSize: rawHero.subtitleFontSize || '',
        subtitleFontWeight: rawHero.subtitleFontWeight || '',
        subtitleItalic: rawHero.subtitleItalic || false,
        subtitleUnderline: rawHero.subtitleUnderline || false
      },
      items: items
    };
  }
  function markNewsContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }
  function loadNewsDataFromLocal() {
    try {
      var local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateNewsPageData(JSON.parse(local));
    } catch (error) {
      console.warn('News: localStorage parse error', error);
    }
    return null;
  }
  function loadNewsDataFromApi() {
    return _loadNewsDataFromApi.apply(this, arguments);
  }
  function _loadNewsDataFromApi() {
    _loadNewsDataFromApi = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
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
            return _context.a(2, migrateNewsPageData(data));
          case 3:
            _context.n = 5;
            break;
          case 4:
            _context.p = 4;
            _t = _context.v;
            console.warn('News: API unavailable', _t);
          case 5:
            return _context.a(2, null);
        }
      }, _callee, null, [[0, 4]]);
    }));
    return _loadNewsDataFromApi.apply(this, arguments);
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
  function getActiveNewsItems(items) {
    return (items || []).filter(function (item) {
      return item && item.active !== false;
    });
  }
  function renderNewsKnowledgeHero(hero) {
    var banner = document.querySelector('.news-knowledge-banner');
    var titleEl = document.querySelector('.news-knowledge-banner__title');
    var subtitleEl = document.querySelector('.news-knowledge-banner__subtitle');
    var graphicEl = document.querySelector('.news-knowledge-banner__graphic');
    if (!banner) return;
    banner.style.containerType = 'inline-size';
    var background = ((hero === null || hero === void 0 ? void 0 : hero.background) || '').trim();
    var hasCustomBanner = Boolean(background);
    var hasSubtitle = Boolean(String((hero === null || hero === void 0 ? void 0 : hero.subtitle) || '').trim());
    if (titleEl) {
      titleEl.innerHTML = multilineHtml(hero === null || hero === void 0 ? void 0 : hero.title);
      titleEl.style.color = (hero === null || hero === void 0 ? void 0 : hero.titleColor) || DEFAULT_NEWS_PAGE.hero.titleColor;
      if ((hero === null || hero === void 0 ? void 0 : hero.titleTop) !== undefined) titleEl.style.top = "".concat(hero.titleTop, "px");
      if ((hero === null || hero === void 0 ? void 0 : hero.titleLeft) !== undefined) {
        titleEl.style.left = "".concat(hero.titleLeft, "px");
        titleEl.style.width = 'auto';
        titleEl.style.maxWidth = "calc(100% - ".concat(hero.titleLeft, "px - 10px)");
      }
      applyTypographyStyles(titleEl, hero === null || hero === void 0 ? void 0 : hero.titleFontSize, hero === null || hero === void 0 ? void 0 : hero.titleFontWeight, hero === null || hero === void 0 ? void 0 : hero.titleItalic, hero === null || hero === void 0 ? void 0 : hero.titleUnderline);
    }
    if (subtitleEl) {
      subtitleEl.innerHTML = multilineHtml(hero === null || hero === void 0 ? void 0 : hero.subtitle);
      subtitleEl.style.color = (hero === null || hero === void 0 ? void 0 : hero.subtitleColor) || DEFAULT_NEWS_PAGE.hero.subtitleColor;
      if ((hero === null || hero === void 0 ? void 0 : hero.subtitleTop) !== undefined) subtitleEl.style.top = "".concat(hero.subtitleTop, "px");
      if ((hero === null || hero === void 0 ? void 0 : hero.subtitleLeft) !== undefined) {
        subtitleEl.style.left = "".concat(hero.subtitleLeft, "px");
        subtitleEl.style.width = 'auto';
        subtitleEl.style.maxWidth = "calc(100% - ".concat(hero.subtitleLeft, "px - 10px)");
      }
      applyTypographyStyles(subtitleEl, hero === null || hero === void 0 ? void 0 : hero.subtitleFontSize, hero === null || hero === void 0 ? void 0 : hero.subtitleFontWeight, hero === null || hero === void 0 ? void 0 : hero.subtitleItalic, hero === null || hero === void 0 ? void 0 : hero.subtitleUnderline);
      subtitleEl.hidden = !hasSubtitle;
    }
    if (banner) {
      if (hasCustomBanner) {
        banner.style.backgroundImage = "url('".concat(background.replace(/'/g, "\\'"), "')");
        banner.classList.add('news-knowledge-banner--custom-bg');
      } else {
        banner.style.backgroundImage = '';
        banner.classList.remove('news-knowledge-banner--custom-bg');
      }
    }
    if (graphicEl) graphicEl.classList.add('is-hidden');
  }
  function renderHero(hero) {
    var banner = document.querySelector('.consulting-hero');
    var titleEl = document.querySelector('.consulting-hero-title');
    var subtitleEl = document.querySelector('.consulting-hero-subtitle');
    var graphicEl = document.querySelector('.consulting-banner__graphic');
    var background = ((hero === null || hero === void 0 ? void 0 : hero.background) || '').trim();
    var hasCustomBanner = Boolean(background);
    var hasSubtitle = Boolean(String((hero === null || hero === void 0 ? void 0 : hero.subtitle) || '').trim());
    if (titleEl) {
      titleEl.innerHTML = multilineHtml(hero === null || hero === void 0 ? void 0 : hero.title);
      titleEl.style.color = (hero === null || hero === void 0 ? void 0 : hero.titleColor) || DEFAULT_NEWS_PAGE.hero.titleColor;
      if ((hero === null || hero === void 0 ? void 0 : hero.titleTop) !== undefined) titleEl.style.top = "".concat(hero.titleTop, "px");
      if ((hero === null || hero === void 0 ? void 0 : hero.titleLeft) !== undefined) {
        titleEl.style.left = "".concat(hero.titleLeft, "px");
        titleEl.style.width = 'auto';
        titleEl.style.maxWidth = "calc(100% - ".concat(hero.titleLeft, "px - 10px)");
      }
      applyTypographyStyles(titleEl, hero === null || hero === void 0 ? void 0 : hero.titleFontSize, hero === null || hero === void 0 ? void 0 : hero.titleFontWeight, hero === null || hero === void 0 ? void 0 : hero.titleItalic, hero === null || hero === void 0 ? void 0 : hero.titleUnderline);
    }
    if (subtitleEl) {
      subtitleEl.innerHTML = multilineHtml(hero === null || hero === void 0 ? void 0 : hero.subtitle);
      subtitleEl.style.color = (hero === null || hero === void 0 ? void 0 : hero.subtitleColor) || DEFAULT_NEWS_PAGE.hero.subtitleColor;
      if ((hero === null || hero === void 0 ? void 0 : hero.subtitleTop) !== undefined) subtitleEl.style.top = "".concat(hero.subtitleTop, "px");
      if ((hero === null || hero === void 0 ? void 0 : hero.subtitleLeft) !== undefined) {
        subtitleEl.style.left = "".concat(hero.subtitleLeft, "px");
        subtitleEl.style.width = 'auto';
        subtitleEl.style.maxWidth = "calc(100% - ".concat(hero.subtitleLeft, "px - 10px)");
      }
      applyTypographyStyles(subtitleEl, hero === null || hero === void 0 ? void 0 : hero.subtitleFontSize, hero === null || hero === void 0 ? void 0 : hero.subtitleFontWeight, hero === null || hero === void 0 ? void 0 : hero.subtitleItalic, hero === null || hero === void 0 ? void 0 : hero.subtitleUnderline);
      subtitleEl.hidden = !hasSubtitle;
    }
    if (banner) {
      if (hasCustomBanner) {
        banner.style.backgroundImage = "url('".concat(background.replace(/'/g, "\\'"), "')");
        banner.classList.add('consulting-hero--custom-bg');
      } else {
        banner.style.backgroundImage = '';
        banner.classList.remove('consulting-hero--custom-bg');
      }
    }
    if (graphicEl) graphicEl.classList.add('is-hidden');
  }
  function renderNewsList(items) {
    var container = document.getElementById('news-list-container');
    if (!container) return;
    var active = getActiveNewsItems(items);
    if (!active.length) {
      container.innerHTML = '<p class="news-page-empty">Новостей пока нет.</p>';
      return;
    }
    var totalPages = Math.ceil(active.length / ITEMS_PER_PAGE);
    if (currentNewsPage > totalPages) {
      currentNewsPage = totalPages;
    }
    if (currentNewsPage < 1) {
      currentNewsPage = 1;
    }
    var pageItems = active.slice((currentNewsPage - 1) * ITEMS_PER_PAGE, currentNewsPage * ITEMS_PER_PAGE);
    var itemsHtml = pageItems.map(function (item) {
      var imageHtml = item.image ? "<img src=\"".concat(escapeHtml(item.image), "\" alt=\"\" class=\"news-item__image\" width=\"511\" height=\"474\" loading=\"lazy\" decoding=\"async\">") : '<div class="news-item__image news-item__image--placeholder" aria-hidden="true"></div>';
      return "<article class=\"news-item\">\n          ".concat(imageHtml, "\n          <div class=\"news-item__body\">\n            <time class=\"news-item__date\" datetime=\"").concat(escapeHtml(item.date), "\">").concat(escapeHtml(formatNewsDateDisplay(item.date)), "</time>\n            <h2 class=\"news-item__title\">").concat(escapeHtml(item.title), "</h2>\n            <div class=\"news-item__text\">\n              <div class=\"news-item__text-wrap\" id=\"news_text_wrap_").concat(item.id, "\" onclick=\"NewsContent.toggleExpandNews('").concat(item.id, "')\">\n                ").concat(item.text || '', "\n              </div>\n              <div class=\"news-item__text-fade\" id=\"news_text_fade_").concat(item.id, "\" style=\"display: none;\" onclick=\"NewsContent.toggleExpandNews('").concat(item.id, "')\"></div>\n              <button type=\"button\" class=\"news-item__more-btn\" id=\"news_more_btn_").concat(item.id, "\" style=\"display: none;\" onclick=\"NewsContent.toggleExpandNews('").concat(item.id, "')\">\u0427\u0438\u0442\u0430\u0442\u044C \u0434\u0430\u043B\u0435\u0435</button>\n            </div>\n          </div>\n        </article>");
    }).join('');
    var paginationHtml = '';
    if (totalPages > 1) {
      var prevDisabled = currentNewsPage === 1 ? 'disabled' : '';
      var nextDisabled = currentNewsPage === totalPages ? 'disabled' : '';
      var buttonsHtml = '';
      for (var i = 1; i <= totalPages; i++) {
        var activeClass = i === currentNewsPage ? ' news-pagination__btn--active' : '';
        buttonsHtml += "<button type=\"button\" class=\"news-pagination__btn".concat(activeClass, "\" onclick=\"NewsContent.changeNewsPage(").concat(i, ")\">").concat(i, "</button>");
      }
      paginationHtml = "\n        <div class=\"news-pagination\">\n          <button type=\"button\" class=\"news-pagination__btn\" ".concat(prevDisabled, " onclick=\"NewsContent.changeNewsPage(").concat(currentNewsPage - 1, ")\" aria-label=\"\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430\">\u2190</button>\n          ").concat(buttonsHtml, "\n          <button type=\"button\" class=\"news-pagination__btn\" ").concat(nextDisabled, " onclick=\"NewsContent.changeNewsPage(").concat(currentNewsPage + 1, ")\" aria-label=\"\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430\">\u2192</button>\n        </div>");
    }
    container.innerHTML = "<div style=\"display:flex; flex-direction:column; gap:60px;\">".concat(itemsHtml, "</div>").concat(paginationHtml);

    // After adding HTML to container, check heights to show/hide "Read more" buttons
    pageItems.forEach(function (item) {
      var wrapEl = document.getElementById("news_text_wrap_".concat(item.id));
      var fadeEl = document.getElementById("news_text_fade_".concat(item.id));
      var btnEl = document.getElementById("news_more_btn_".concat(item.id));
      if (wrapEl && wrapEl.scrollHeight > 140) {
        if (fadeEl) fadeEl.style.display = 'block';
        if (btnEl) btnEl.style.display = 'inline-block';
      }
    });
  }
  function changeNewsPage(pageNum) {
    currentNewsPage = pageNum;
    renderNewsList(currentNewsItems);
    var listSection = document.querySelector('.news-list-section');
    if (listSection) {
      listSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }
  function toggleExpandNews(id) {
    var wrapEl = document.getElementById("news_text_wrap_".concat(id));
    var fadeEl = document.getElementById("news_text_fade_".concat(id));
    var btnEl = document.getElementById("news_more_btn_".concat(id));
    if (!wrapEl) return;
    if (wrapEl.classList.contains('is-expanded')) {
      // Collapse
      wrapEl.style.maxHeight = wrapEl.scrollHeight + 'px';
      wrapEl.offsetHeight; // force reflow
      wrapEl.classList.remove('is-expanded');
      wrapEl.style.maxHeight = '140px';
      if (fadeEl) {
        fadeEl.style.display = 'block';
        fadeEl.offsetHeight; // force reflow
        fadeEl.style.opacity = '1';
      }
      if (btnEl) btnEl.textContent = 'Читать далее';
    } else {
      // Expand
      wrapEl.classList.add('is-expanded');
      wrapEl.style.maxHeight = wrapEl.scrollHeight + 'px';
      if (fadeEl) {
        fadeEl.style.opacity = '0';
        setTimeout(function () {
          if (wrapEl.classList.contains('is-expanded')) {
            fadeEl.style.display = 'none';
          }
        }, 300);
      }
      if (btnEl) btnEl.textContent = 'Свернуть';
    }
  }
  function renderLandingNewsPreview(items, options) {
    var list = document.getElementById('landingNewsList');
    if (!list) return;
    var limit = (options === null || options === void 0 ? void 0 : options.limit) || 3;
    var active = getActiveNewsItems(items).slice(0, limit);
    list.innerHTML = active.map(function (item) {
      return "<li class=\"news-list__item\">\n        <span class=\"news-date\">".concat(escapeHtml(formatNewsDateDisplay(item.date)), "</span>\n        <p>").concat(escapeHtml(excerptFromHtml(item.text) || item.title), "</p>\n      </li>");
    }).join('');
    var allLink = document.getElementById('landingAllNewsLink');
    if (allLink) {
      var _window$CrzrtZoomSync, _window$CrzrtZoomSync2;
      allLink.href = 'news.html';
      (_window$CrzrtZoomSync = window.CrzrtZoomSync) === null || _window$CrzrtZoomSync === void 0 || (_window$CrzrtZoomSync2 = _window$CrzrtZoomSync.prepareInternalLink) === null || _window$CrzrtZoomSync2 === void 0 || _window$CrzrtZoomSync2.call(_window$CrzrtZoomSync, allLink);
    }
  }
  function renderNewsPage(data) {
    currentNewsItems = data.items || [];
    renderHero(data.hero);
    renderNewsList(currentNewsItems);
  }
  function initNewsContent() {
    return _initNewsContent.apply(this, arguments);
  }
  function _initNewsContent() {
    _initNewsContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var localData, initialData, apiData, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            localData = loadNewsDataFromLocal();
            initialData = localData || migrateNewsPageData(null);
            renderNewsPage(initialData);
            markNewsContentReady();
            _context2.n = 1;
            return loadNewsDataFromApi();
          case 1:
            apiData = _context2.v;
            if (apiData) {
              renderNewsPage(apiData);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
              } catch (error) {
                console.warn('News: localStorage update failed', error);
              }
            }
            document.dispatchEvent(new CustomEvent('newsContentReady', {
              detail: initialData
            }));
            if (apiData) {
              document.dispatchEvent(new CustomEvent('newsContentReady', {
                detail: apiData
              }));
            }
            _context2.n = 3;
            break;
          case 2:
            _context2.p = 2;
            _t2 = _context2.v;
            console.error('News content init failed', _t2);
            markNewsContentReady();
          case 3:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 2]]);
    }));
    return _initNewsContent.apply(this, arguments);
  }
  window.NewsContent = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_NEWS_PAGE: DEFAULT_NEWS_PAGE,
    migrateNewsPageData: migrateNewsPageData,
    normalizeNewsItem: normalizeNewsItem,
    loadNewsDataFromApi: loadNewsDataFromApi,
    loadNewsDataFromLocal: loadNewsDataFromLocal,
    renderNewsPage: renderNewsPage,
    renderLandingNewsPreview: renderLandingNewsPreview,
    formatNewsDateDisplay: formatNewsDateDisplay,
    getActiveNewsItems: getActiveNewsItems,
    excerptFromHtml: excerptFromHtml,
    changeNewsPage: changeNewsPage,
    toggleExpandNews: toggleExpandNews
  };
  if (isNewsPage) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNewsContent);
    } else {
      initNewsContent();
    }
  }
})();