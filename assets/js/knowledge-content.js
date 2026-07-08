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
 * Контент страницы «Документы» — загрузка из API / localStorage и динамический рендеринг блоков.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'crzrt_knowledge_page_data';
  var CONTENT_PENDING_CLASS = 'knowledge-content-pending';
  var CONTENT_READY_CLASS = 'knowledge-content-ready';
  var PDF_ICON_SVG = "\n    <svg width=\"24\" height=\"28\" viewBox=\"0 0 24 28\" fill=\"none\" class=\"knowledge-download-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n      <path d=\"M1.5 1h14.5l6.5 6.5v19.5c0 .828-.672 1.5-1.5 1.5H1.5C.672 28.5 0 27.828 0 27V2C0 1.172.672.5 1.5.5z\" fill=\"#FFF\" stroke=\"#0FAA4B\" stroke-width=\"2\"/>\n      <path d=\"M16 1v6h6\" stroke=\"#0FAA4B\" stroke-width=\"2\" stroke-linejoin=\"round\"/>\n      <rect y=\"12\" width=\"24\" height=\"10\" rx=\"1\" fill=\"#0FAA4B\"/>\n      <text x=\"12\" y=\"20\" fill=\"#FFF\" font-family=\"'Google Sans', 'Inter', sans-serif\" font-size=\"7\" font-weight=\"bold\" text-anchor=\"middle\">PDF</text>\n    </svg>\n  ";
  var ARROW_SVG = "\n    <svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n      <path d=\"M1 1L11 11M11 11V3M11 11H3\" stroke=\"#0FAA4B\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n    </svg>\n  ";
  var DEFAULT_KNOWLEDGE_PAGE = {
    hero: {
      background: '',
      title: 'Документы',
      subtitle: 'Здесь вы найдете все официальные документы для скачивания. Файлы регулярно обновляются.',
      titleColor: '#575B6D',
      subtitleColor: '#FFFFFF',
      titleTop: 122,
      titleLeft: 70,
      subtitleTop: 213,
      subtitleLeft: 70
    },
    blocks: [{
      id: 'default_1',
      type: 'header',
      value: 'Основные сведения'
    }, {
      id: 'default_2',
      type: 'text',
      value: 'Акционерное общество «Центр развития закупок Республики Татарстан» является подведомственной организацией Государственного комитета Республики Татарстан по закупкам.'
    }, {
      id: 'default_3',
      type: 'file',
      title: 'Устав АО «Центр развития закупок РТ»',
      file: '#',
      fileName: 'ustav_crzrt.pdf'
    }]
  };
  document.documentElement.classList.add(CONTENT_PENDING_CLASS);
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function multilineHtml(str) {
    return escapeHtml(str || '').split('\n').filter(function (line, i, arr) {
      return line.length || i < arr.length - 1;
    }).join('<br>');
  }
  function normalizeKnowledgeBlock(b, index) {
    var id = b.id || "block_".concat(Date.now(), "_").concat(index);
    var type = b.type || 'text';
    if (type === 'group') {
      var children = Array.isArray(b.children) ? b.children : [];
      return {
        id: id,
        type: 'group',
        value: b.value !== undefined ? String(b.value) : '',
        defaultExpanded: Boolean(b.defaultExpanded),
        children: children.map(function (child, childIndex) {
          return normalizeKnowledgeBlock(child, childIndex);
        })
      };
    }
    if (type === 'file') {
      return {
        id: id,
        type: 'file',
        title: b.title !== undefined ? String(b.title) : '',
        file: b.file !== undefined ? String(b.file) : '',
        fileName: b.fileName !== undefined ? String(b.fileName) : ''
      };
    }
    return {
      id: id,
      type: type,
      value: b.value !== undefined ? String(b.value) : ''
    };
  }
  function migrateKnowledgePageData(raw) {
    var rawHero = raw !== null && raw !== void 0 && raw.hero && _typeof(raw.hero) === 'object' ? raw.hero : {};
    var blocks = Array.isArray(raw === null || raw === void 0 ? void 0 : raw.blocks) && raw.blocks.length > 0 ? raw.blocks : _toConsumableArray(DEFAULT_KNOWLEDGE_PAGE.blocks);
    return {
      hero: {
        background: rawHero.background || '',
        title: rawHero.title || DEFAULT_KNOWLEDGE_PAGE.hero.title,
        subtitle: rawHero.subtitle || DEFAULT_KNOWLEDGE_PAGE.hero.subtitle,
        titleColor: rawHero.titleColor || DEFAULT_KNOWLEDGE_PAGE.hero.titleColor,
        subtitleColor: rawHero.subtitleColor || DEFAULT_KNOWLEDGE_PAGE.hero.subtitleColor,
        titleTop: rawHero.titleTop !== undefined ? parseInt(rawHero.titleTop, 10) : DEFAULT_KNOWLEDGE_PAGE.hero.titleTop,
        titleLeft: rawHero.titleLeft !== undefined ? parseInt(rawHero.titleLeft, 10) : DEFAULT_KNOWLEDGE_PAGE.hero.titleLeft,
        titleFontSize: rawHero.titleFontSize || '',
        titleFontWeight: rawHero.titleFontWeight || '',
        titleItalic: rawHero.titleItalic || false,
        titleUnderline: rawHero.titleUnderline || false,
        subtitleTop: rawHero.subtitleTop !== undefined ? parseInt(rawHero.subtitleTop, 10) : DEFAULT_KNOWLEDGE_PAGE.hero.subtitleTop,
        subtitleLeft: rawHero.subtitleLeft !== undefined ? parseInt(rawHero.subtitleLeft, 10) : DEFAULT_KNOWLEDGE_PAGE.hero.subtitleLeft,
        subtitleFontSize: rawHero.subtitleFontSize || '',
        subtitleFontWeight: rawHero.subtitleFontWeight || '',
        subtitleItalic: rawHero.subtitleItalic || false,
        subtitleUnderline: rawHero.subtitleUnderline || false
      },
      blocks: blocks.map(function (b, index) {
        return normalizeKnowledgeBlock(b, index);
      })
    };
  }
  function markKnowledgeContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }
  function loadKnowledgeDataFromLocal() {
    try {
      var local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateKnowledgePageData(JSON.parse(local));
    } catch (error) {
      console.warn('Knowledge: localStorage parse error', error);
    }
    return null;
  }
  function loadKnowledgeDataFromApi() {
    return _loadKnowledgeDataFromApi.apply(this, arguments);
  }
  function _loadKnowledgeDataFromApi() {
    _loadKnowledgeDataFromApi = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
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
            return _context.a(2, migrateKnowledgePageData(data));
          case 3:
            _context.n = 5;
            break;
          case 4:
            _context.p = 4;
            _t = _context.v;
            console.warn('Knowledge: API unavailable', _t);
          case 5:
            return _context.a(2, null);
        }
      }, _callee, null, [[0, 4]]);
    }));
    return _loadKnowledgeDataFromApi.apply(this, arguments);
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
  function renderKnowledgeHero(hero) {
    var banner = document.querySelector('body[data-page="knowledge"] .consulting-hero');
    var titleEl = document.querySelector('body[data-page="knowledge"] .consulting-hero-title');
    var subtitleEl = document.querySelector('body[data-page="knowledge"] .consulting-hero-subtitle');
    var graphicEl = document.querySelector('body[data-page="knowledge"] .consulting-banner__graphic');
    if (!banner) return;
    banner.style.containerType = 'inline-size';
    var background = ((hero === null || hero === void 0 ? void 0 : hero.background) || '').trim();
    var hasCustomBanner = Boolean(background);
    if (titleEl) {
      titleEl.innerHTML = multilineHtml(hero === null || hero === void 0 ? void 0 : hero.title);
      titleEl.style.color = (hero === null || hero === void 0 ? void 0 : hero.titleColor) || DEFAULT_KNOWLEDGE_PAGE.hero.titleColor;
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
      subtitleEl.style.color = (hero === null || hero === void 0 ? void 0 : hero.subtitleColor) || DEFAULT_KNOWLEDGE_PAGE.hero.subtitleColor;
      if ((hero === null || hero === void 0 ? void 0 : hero.subtitleTop) !== undefined) subtitleEl.style.top = "".concat(hero.subtitleTop, "px");
      if ((hero === null || hero === void 0 ? void 0 : hero.subtitleLeft) !== undefined) {
        subtitleEl.style.left = "".concat(hero.subtitleLeft, "px");
        subtitleEl.style.width = 'auto';
        subtitleEl.style.maxWidth = "calc(100% - ".concat(hero.subtitleLeft, "px - 10px)");
      }
      applyTypographyStyles(subtitleEl, hero === null || hero === void 0 ? void 0 : hero.subtitleFontSize, hero === null || hero === void 0 ? void 0 : hero.subtitleFontWeight, hero === null || hero === void 0 ? void 0 : hero.subtitleItalic, hero === null || hero === void 0 ? void 0 : hero.subtitleUnderline);
    }
    if (hasCustomBanner) {
      banner.style.backgroundImage = "url('".concat(background.replace(/'/g, "\\'"), "')");
      banner.classList.add('consulting-hero--custom-bg');
    } else {
      banner.style.backgroundImage = '';
      banner.classList.remove('consulting-hero--custom-bg');
    }
    if (graphicEl) graphicEl.classList.add('is-hidden');
  }
  function renderBlockInto(block, parentEl) {
    if (!block || !parentEl) return;
    if (block.type === 'header') {
      var headerEl = document.createElement('h2');
      headerEl.className = 'knowledge-header';
      headerEl.textContent = block.value || '';
      parentEl.appendChild(headerEl);
      return;
    }
    if (block.type === 'text') {
      var textEl = document.createElement('p');
      textEl.className = 'knowledge-text';
      textEl.textContent = block.value || '';
      parentEl.appendChild(textEl);
      return;
    }
    if (block.type === 'file') {
      var fileCard = document.createElement('div');
      fileCard.className = 'knowledge-file-card';
      var fileTitle = document.createElement('h3');
      fileTitle.className = 'knowledge-file-title';
      fileTitle.textContent = block.title || 'Документ';
      var downloadLink = document.createElement('a');
      downloadLink.className = 'knowledge-download-btn';
      downloadLink.href = block.file || '#';
      if (block.file && block.file !== '#') {
        downloadLink.setAttribute('download', block.fileName || '');
        downloadLink.setAttribute('target', '_blank');
      }
      downloadLink.innerHTML = "\n          \u0441\u043A\u0430\u0447\u0430\u0442\u044C <span class=\"arrow-down-right\">".concat(ARROW_SVG, "</span>\n        ");
      fileCard.appendChild(fileTitle);
      fileCard.appendChild(downloadLink);
      parentEl.appendChild(fileCard);
      return;
    }
    if (block.type === 'group') {
      var groupEl = document.createElement('div');
      groupEl.className = 'knowledge-group';
      var _headerEl = document.createElement('div');
      _headerEl.className = 'knowledge-group__header';
      var titleEl = document.createElement('h3');
      titleEl.className = 'knowledge-group__title';
      titleEl.textContent = block.value || 'Раздел';
      var toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'knowledge-group__toggle';
      var expanded = Boolean(block.defaultExpanded);
      toggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      toggleBtn.textContent = expanded ? 'Скрыть' : 'Раскрыть';
      var bodyEl = document.createElement('div');
      bodyEl.className = 'knowledge-group__body';
      bodyEl.hidden = !expanded;
      toggleBtn.addEventListener('click', function () {
        var isOpen = !bodyEl.hidden;
        bodyEl.hidden = isOpen;
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        toggleBtn.textContent = isOpen ? 'Раскрыть' : 'Скрыть';
      });
      _headerEl.appendChild(titleEl);
      _headerEl.appendChild(toggleBtn);
      groupEl.appendChild(_headerEl);
      (block.children || []).forEach(function (child) {
        return renderBlockInto(child, bodyEl);
      });
      groupEl.appendChild(bodyEl);
      parentEl.appendChild(groupEl);
    }
  }
  function renderBlocks(blocks) {
    var container = document.getElementById('knowledge-blocks-container');
    if (!container) return;
    container.innerHTML = '';
    blocks.forEach(function (block) {
      return renderBlockInto(block, container);
    });
  }
  function renderKnowledgePage(data) {
    renderKnowledgeHero(data.hero);
    renderBlocks(data.blocks);
  }
  function initKnowledgeContent() {
    return _initKnowledgeContent.apply(this, arguments);
  }
  function _initKnowledgeContent() {
    _initKnowledgeContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var localData, initialData, apiData, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            localData = loadKnowledgeDataFromLocal();
            initialData = localData || migrateKnowledgePageData(null);
            renderKnowledgePage(initialData);
            markKnowledgeContentReady();
            _context2.n = 1;
            return loadKnowledgeDataFromApi();
          case 1:
            apiData = _context2.v;
            if (apiData) {
              renderKnowledgePage(apiData);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
              } catch (error) {
                console.warn('Knowledge: localStorage update failed', error);
              }
            }
            _context2.n = 3;
            break;
          case 2:
            _context2.p = 2;
            _t2 = _context2.v;
            console.error('Knowledge content init failed', _t2);
            markKnowledgeContentReady();
          case 3:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 2]]);
    }));
    return _initKnowledgeContent.apply(this, arguments);
  }
  window.KnowledgeContent = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_KNOWLEDGE_PAGE: DEFAULT_KNOWLEDGE_PAGE,
    normalizeKnowledgeBlock: normalizeKnowledgeBlock,
    migrateKnowledgePageData: migrateKnowledgePageData,
    loadKnowledgeDataFromApi: loadKnowledgeDataFromApi,
    loadKnowledgeDataFromLocal: loadKnowledgeDataFromLocal,
    renderKnowledgePage: renderKnowledgePage
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKnowledgeContent);
  } else {
    initKnowledgeContent();
  }
})();