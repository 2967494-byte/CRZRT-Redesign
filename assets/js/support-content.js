function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Контент страницы «Сопровождение» — загрузка из API / localStorage и отрисовка.
 */
(function () {
  var STORAGE_KEY = 'crzrt_support_page_data';
  var CONTENT_PENDING_CLASS = 'support-content-pending';
  var CONTENT_READY_CLASS = 'support-content-ready';
  var DOWNLOAD_ARROW_SVG = '<span class="arrow-down-right"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L11 11M11 11V3M11 11H3" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
  var MANUAL_PDF_ICON_SRC = 'assets/img/ecp/icon-pdf.png';
  var VIDEO_PLAY_SVG = '<svg class="ecp-video-card__play" width="134" height="134" viewBox="0 0 134 134" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="67" cy="67" r="63" stroke="white" stroke-width="6"/><path d="M90 67L54 87.5V46.5L90 67Z" fill="white"/></svg>';
  var MORE_ARROW_SVG = '<span class="support-service-card__more-arrow" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L11 11M11 11V3M11 11H3" stroke="#FF5512" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
  var CHECKLIST_ICON_SRC = 'assets/img/support/checklist-icon-inner.png';
  var DEFAULT_NAV_CARDS = [{
    label: 'Для\nзаказчиков',
    href: '#for-customers',
    icon: 'assets/img/support/icon-customers.png?v=2'
  }, {
    label: 'Для\nпоставщиков',
    href: '#for-suppliers',
    icon: 'assets/img/support/icon-suppliers.png?v=2'
  }, {
    label: 'Консультация\nспециалиста',
    href: '#consultation',
    icon: 'assets/img/support/icon-consultation.png?v=2'
  }];
  var DEFAULT_CUSTOMER_SERVICES = [{
    title: 'Разработка\nположения о закупках',
    price: 'от 10 000 руб.',
    btnText: 'Оставить заявку',
    btnLink: '#contacts',
    detailsHtml: ''
  }, {
    title: 'Подготовка\nзакупочной документации',
    price: 'от 10 000 руб.',
    btnText: 'Оставить заявку',
    btnLink: '#contacts',
    detailsHtml: ''
  }, {
    title: 'Комплексное\nсопровождение',
    price: 'от 10 000 руб.',
    btnText: 'Оставить заявку',
    btnLink: '#contacts',
    detailsHtml: ''
  }];
  var DEFAULT_CUSTOMER_CHECKLIST = {
    title: 'Чек-лист подготовки\nзакупочной документации',
    items: [{
      lines: ['Контрольный', 'список заказчика', 'при проведении закупки'],
      file: ''
    }, {
      lines: ['Чек-лист', 'соблюдения требований', 'законодательства'],
      file: ''
    }, {
      lines: ['Контроль', 'процедур закупочной', 'деятельности'],
      file: ''
    }, {
      lines: ['Чек-лист проверки', 'обоснования закупки'],
      file: ''
    }, {
      lines: ['Чек-лист формирования', 'технического задания'],
      file: ''
    }]
  };
  var DEFAULT_SUPPLIER_SERVICES = [{
    title: 'Подбор\nтендеров',
    price: 'от 10 000 руб.',
    btnText: 'Оставить заявку',
    btnLink: '#contacts',
    detailsHtml: ''
  }, {
    title: 'Помощь участия\nв торгах',
    price: 'от 10 000 руб.',
    btnText: 'Оставить заявку',
    btnLink: '#contacts',
    detailsHtml: ''
  }, {
    title: 'Защита интересов\nв ФАС и в судах',
    price: 'от 10 000 руб.',
    btnText: 'Оставить заявку',
    btnLink: '#contacts',
    detailsHtml: ''
  }];
  var DEFAULT_SUPPLIER_CHECKLIST = {
    title: 'Чек-лист: как подать заявку\nбез ошибок',
    items: [{
      lines: ['Готова ли ваша заявка?', 'Быстрый чек-лист'],
      file: ''
    }, {
      lines: ['Чек-лист участника:', 'от поиска до победы'],
      file: ''
    }, {
      lines: ['Проверка заявки', 'за 10 минут'],
      file: ''
    }, {
      lines: ['Чек-лист перед подачей', 'на тендер'],
      file: ''
    }, {
      lines: ['Чек-лист участия в закупке', '«под ключ»'],
      file: ''
    }]
  };
  var SUPPORT_DEFAULTS = {
    hero: {
      background: '',
      title: 'Надежное тендерное\nсопровождение',
      titleColor: '#ffffff',
      titleTop: 122,
      titleLeft: 70,
      subtitle: 'Комплексная помощь экспертов на всех этапах закупок: от подготовки документации до заключения контракта и исполнения обязательств.',
      subtitleColor: '#ffffff',
      subtitleTop: 213,
      subtitleLeft: 70
    },
    navCards: DEFAULT_NAV_CARDS.map(function (card) {
      return _objectSpread({}, card);
    }),
    customers: {
      title: 'Для заказчиков',
      services44: DEFAULT_CUSTOMER_SERVICES.map(function (item) {
        return _objectSpread({}, item);
      }),
      services223: DEFAULT_CUSTOMER_SERVICES.map(function (item) {
        return _objectSpread({}, item);
      }),
      checklist: {
        title: DEFAULT_CUSTOMER_CHECKLIST.title,
        items: DEFAULT_CUSTOMER_CHECKLIST.items.map(function (item) {
          return {
            lines: _toConsumableArray(item.lines),
            file: item.file
          };
        })
      }
    },
    calculator: {
      title: 'Расчет начальной (максимальной) цены контракта методом сопоставимых рыночных цен (анализа рынка)',
      image: ''
    },
    suppliers: {
      title: 'Для поставщиков',
      services: DEFAULT_SUPPLIER_SERVICES.map(function (item) {
        return _objectSpread({}, item);
      }),
      checklist: {
        title: DEFAULT_SUPPLIER_CHECKLIST.title,
        items: DEFAULT_SUPPLIER_CHECKLIST.items.map(function (item) {
          return {
            lines: _toConsumableArray(item.lines),
            file: item.file
          };
        })
      }
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
  function normalizeServiceItem(item, fallback) {
    var base = fallback || {};
    return {
      title: (item === null || item === void 0 ? void 0 : item.title) !== undefined ? String(item.title) : base.title || '',
      price: (item === null || item === void 0 ? void 0 : item.price) !== undefined ? String(item.price) : base.price || 'от 10 000 руб.',
      btnText: (item === null || item === void 0 ? void 0 : item.btnText) || base.btnText || 'Оставить заявку',
      btnLink: (item === null || item === void 0 ? void 0 : item.btnLink) || base.btnLink || '#contacts',
      detailsHtml: (item === null || item === void 0 ? void 0 : item.detailsHtml) !== undefined ? String(item.detailsHtml) : item !== null && item !== void 0 && item.moreLink && /<[a-z][\s\S]*>/i.test(String(item.moreLink)) ? String(item.moreLink) : base.detailsHtml || ''
    };
  }
  function normalizeServicesList(rawList, defaults) {
    var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
    var source = Array.isArray(rawList) && rawList.length ? rawList : defaults.map(function (item) {
      return _objectSpread({}, item);
    });
    var items = [];
    for (var i = 0; i < count; i++) {
      items.push(normalizeServiceItem(source[i], defaults[i] || defaults[0] || {}));
    }
    return items;
  }
  function migrateAudienceSection(rawSection, defaults) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var raw = rawSection && _typeof(rawSection) === 'object' ? rawSection : {};
    var legacyServices = Array.isArray(raw.services) ? raw.services : [];
    var services44 = normalizeServicesList(raw.services44 || legacyServices, defaults.services44 || defaults.services || DEFAULT_CUSTOMER_SERVICES, 3);
    var services223 = normalizeServicesList(raw.services223 || legacyServices, defaults.services223 || defaults.services || DEFAULT_CUSTOMER_SERVICES, 3);
    var services = normalizeServicesList(raw.services || legacyServices, defaults.services || DEFAULT_SUPPLIER_SERVICES, 3);
    var rawChecklist = raw.checklist && _typeof(raw.checklist) === 'object' ? raw.checklist : {};
    var checklistItems = Array.isArray(rawChecklist.items) && rawChecklist.items.length ? rawChecklist.items.map(function (item) {
      return {
        lines: Array.isArray(item === null || item === void 0 ? void 0 : item.lines) ? item.lines.map(function (line) {
          return String(line || '').trim();
        }).filter(Boolean) : String((item === null || item === void 0 ? void 0 : item.text) || '').split('\n').map(function (line) {
          return line.trim();
        }).filter(Boolean),
        file: (item === null || item === void 0 ? void 0 : item.file) || ''
      };
    }) : defaults.checklist.items.map(function (item) {
      return {
        lines: _toConsumableArray(item.lines),
        file: item.file || ''
      };
    });
    var section = {
      title: raw.title || defaults.title,
      checklist: {
        title: rawChecklist.title || defaults.checklist.title,
        items: checklistItems
      }
    };
    if (options.splitByLaw) {
      section.services44 = services44;
      section.services223 = services223;
    } else {
      section.services = services;
    }
    return section;
  }
  var SUPPORT_HERO_SLIDE_DEFAULTS = {
    title: SUPPORT_DEFAULTS.hero.title,
    subtitle: SUPPORT_DEFAULTS.hero.subtitle,
    titleColor: SUPPORT_DEFAULTS.hero.titleColor,
    subtitleColor: SUPPORT_DEFAULTS.hero.subtitleColor,
    titleTop: SUPPORT_DEFAULTS.hero.titleTop,
    titleLeft: SUPPORT_DEFAULTS.hero.titleLeft,
    subtitleTop: SUPPORT_DEFAULTS.hero.subtitleTop,
    subtitleLeft: SUPPORT_DEFAULTS.hero.subtitleLeft
  };
  var supportHeroRenderer = null;
  function getSupportHeroRenderer() {
    if (!supportHeroRenderer && window.HeroSlides) {
      supportHeroRenderer = window.HeroSlides.createRenderer({
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
    return supportHeroRenderer;
  }
  function migrateSupportPageData(raw) {
    var _window$HeroSlides, _raw$blanks, _raw$blanks2, _raw$manual, _raw$manual2;
    var heroSlides = window.HeroSlides ? window.HeroSlides.migrateHeroSlides(raw, SUPPORT_HERO_SLIDE_DEFAULTS) : [];
    var first = heroSlides[0] || {};
    var rawHero = raw !== null && raw !== void 0 && raw.hero && _typeof(raw.hero) === 'object' ? raw.hero : {};
    var hero = {
      background: first.background || '',
      title: first.title !== undefined ? first.title : SUPPORT_DEFAULTS.hero.title,
      titleColor: first.titleColor || SUPPORT_DEFAULTS.hero.titleColor,
      titleTop: first.titleTop !== undefined ? first.titleTop : SUPPORT_DEFAULTS.hero.titleTop,
      titleLeft: first.titleLeft !== undefined ? first.titleLeft : SUPPORT_DEFAULTS.hero.titleLeft,
      titleFontSize: first.titleFontSize || '',
      titleFontWeight: first.titleFontWeight || '',
      titleItalic: first.titleItalic || false,
      titleUnderline: first.titleUnderline || false,
      subtitle: first.subtitle !== undefined ? first.subtitle : SUPPORT_DEFAULTS.hero.subtitle,
      subtitleColor: first.subtitleColor || SUPPORT_DEFAULTS.hero.subtitleColor,
      subtitleTop: first.subtitleTop !== undefined ? first.subtitleTop : SUPPORT_DEFAULTS.hero.subtitleTop,
      subtitleLeft: first.subtitleLeft !== undefined ? first.subtitleLeft : SUPPORT_DEFAULTS.hero.subtitleLeft,
      subtitleFontSize: first.subtitleFontSize || '',
      subtitleFontWeight: first.subtitleFontWeight || '',
      subtitleItalic: first.subtitleItalic || false,
      subtitleUnderline: first.subtitleUnderline || false
    };
    if (!heroSlides.length && rawHero.background) {
      hero.background = rawHero.background;
    }
    var navCards = Array.isArray(raw === null || raw === void 0 ? void 0 : raw.navCards) && raw.navCards.length ? raw.navCards.map(function (card, i) {
      var _DEFAULT_NAV_CARDS$i, _DEFAULT_NAV_CARDS$i2, _DEFAULT_NAV_CARDS$i3;
      return {
        label: (card === null || card === void 0 ? void 0 : card.label) || ((_DEFAULT_NAV_CARDS$i = DEFAULT_NAV_CARDS[i]) === null || _DEFAULT_NAV_CARDS$i === void 0 ? void 0 : _DEFAULT_NAV_CARDS$i.label) || '',
        href: (card === null || card === void 0 ? void 0 : card.href) || ((_DEFAULT_NAV_CARDS$i2 = DEFAULT_NAV_CARDS[i]) === null || _DEFAULT_NAV_CARDS$i2 === void 0 ? void 0 : _DEFAULT_NAV_CARDS$i2.href) || '#',
        icon: (card === null || card === void 0 ? void 0 : card.icon) || ((_DEFAULT_NAV_CARDS$i3 = DEFAULT_NAV_CARDS[i]) === null || _DEFAULT_NAV_CARDS$i3 === void 0 ? void 0 : _DEFAULT_NAV_CARDS$i3.icon) || ''
      };
    }) : DEFAULT_NAV_CARDS.map(function (card) {
      return _objectSpread({}, card);
    });
    var customers = migrateAudienceSection(raw === null || raw === void 0 ? void 0 : raw.customers, SUPPORT_DEFAULTS.customers, {
      splitByLaw: true
    });
    var suppliers = migrateAudienceSection(raw === null || raw === void 0 ? void 0 : raw.suppliers, SUPPORT_DEFAULTS.suppliers);
    var rawCalc = raw !== null && raw !== void 0 && raw.calculator && _typeof(raw.calculator) === 'object' ? raw.calculator : {};
    var calculator = {
      title: rawCalc.title || SUPPORT_DEFAULTS.calculator.title,
      image: rawCalc.image || ''
    };
    var data = {
      heroSlides: heroSlides.length ? heroSlides : ((_window$HeroSlides = window.HeroSlides) === null || _window$HeroSlides === void 0 ? void 0 : _window$HeroSlides.migrateHeroSlides({
        hero: hero
      }, SUPPORT_HERO_SLIDE_DEFAULTS)) || [],
      hero: hero,
      navCards: navCards,
      customers: customers,
      calculator: calculator,
      suppliers: suppliers,
      tariffs: Array.isArray(raw === null || raw === void 0 ? void 0 : raw.tariffs) && raw.tariffs.length ? raw.tariffs : _toConsumableArray(SUPPORT_DEFAULTS.tariffs),
      blanks: {
        patternImage: (raw === null || raw === void 0 || (_raw$blanks = raw.blanks) === null || _raw$blanks === void 0 ? void 0 : _raw$blanks.patternImage) || SUPPORT_DEFAULTS.blanks.patternImage,
        items: Array.isArray(raw === null || raw === void 0 || (_raw$blanks2 = raw.blanks) === null || _raw$blanks2 === void 0 ? void 0 : _raw$blanks2.items) && raw.blanks.items.length ? raw.blanks.items : _toConsumableArray(SUPPORT_DEFAULTS.blanks.items)
      },
      manual: {
        bookImage: (raw === null || raw === void 0 || (_raw$manual = raw.manual) === null || _raw$manual === void 0 ? void 0 : _raw$manual.bookImage) || SUPPORT_DEFAULTS.manual.bookImage,
        items: Array.isArray(raw === null || raw === void 0 || (_raw$manual2 = raw.manual) === null || _raw$manual2 === void 0 ? void 0 : _raw$manual2.items) && raw.manual.items.length ? raw.manual.items : _toConsumableArray(SUPPORT_DEFAULTS.manual.items)
      },
      videos: Array.isArray(raw === null || raw === void 0 ? void 0 : raw.videos) && raw.videos.length ? raw.videos : _toConsumableArray(SUPPORT_DEFAULTS.videos),
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
      items = _toConsumableArray(SUPPORT_DEFAULTS.support.items);
    }
    return {
      background: raw.background || raw.image || '',
      title: raw.title || SUPPORT_DEFAULTS.support.title,
      items: items,
      buttonText: raw.buttonText || SUPPORT_DEFAULTS.support.buttonText,
      buttonLink: raw.buttonLink || SUPPORT_DEFAULTS.support.buttonLink
    };
  }
  function markSupportContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }
  function loadSupportDataFromLocal() {
    try {
      var local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateSupportPageData(JSON.parse(local));
    } catch (error) {
      console.warn('Support: localStorage parse error', error);
    }
    return null;
  }
  function loadSupportDataFromApi() {
    return _loadSupportDataFromApi.apply(this, arguments);
  }
  function _loadSupportDataFromApi() {
    _loadSupportDataFromApi = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
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
            return _context.a(2, migrateSupportPageData(data));
          case 3:
            _context.n = 5;
            break;
          case 4:
            _context.p = 4;
            _t = _context.v;
            console.warn('Support: API unavailable', _t);
          case 5:
            return _context.a(2, null);
        }
      }, _callee, null, [[0, 4]]);
    }));
    return _loadSupportDataFromApi.apply(this, arguments);
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
    var _data$heroSlides, _window$HeroSlides2, _getSupportHeroRender;
    var slides = data !== null && data !== void 0 && (_data$heroSlides = data.heroSlides) !== null && _data$heroSlides !== void 0 && _data$heroSlides.length ? data.heroSlides : ((_window$HeroSlides2 = window.HeroSlides) === null || _window$HeroSlides2 === void 0 ? void 0 : _window$HeroSlides2.migrateHeroSlides({
      hero: data === null || data === void 0 ? void 0 : data.hero
    }, SUPPORT_HERO_SLIDE_DEFAULTS)) || [];
    (_getSupportHeroRender = getSupportHeroRenderer()) === null || _getSupportHeroRender === void 0 || _getSupportHeroRender.render(slides);
  }
  function renderNavCards(navCards) {
    var grid = document.querySelector('.support-nav-cards');
    if (!grid) return;
    var list = navCards !== null && navCards !== void 0 && navCards.length ? navCards : SUPPORT_DEFAULTS.navCards;
    grid.innerHTML = list.map(function (card) {
      var href = escapeHtml((card.href || '#').trim() || '#');
      var icon = escapeAttr((card.icon || '').trim() || 'assets/img/support/icon-customers.png');
      return "<a href=\"".concat(href, "\" class=\"ecp-card\">\n          <div class=\"ecp-card__icon-wrap\">\n            <img src=\"").concat(icon, "\" alt=\"\" class=\"ecp-card__icon\" width=\"122\" height=\"154\" decoding=\"async\">\n          </div>\n          <div class=\"ecp-card__label\">").concat(multilineHtml(card.label), "</div>\n        </a>");
    }).join('');
  }
  var cachedCustomersSection = null;
  function renderServiceCards(container, services) {
    if (!container) return;
    var list = services !== null && services !== void 0 && services.length ? services : [];
    container.innerHTML = list.map(function (item, index) {
      var btnHref = escapeHtml((item.btnLink || '#contacts').trim() || '#contacts');
      var price = escapeHtml(item.price || '');
      var hasDetails = Boolean((item.detailsHtml || '').trim());
      var moreControl = hasDetails ? "<button type=\"button\" class=\"support-service-card__more\" data-support-service-detail=\"".concat(index, "\">\n            \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435\n            ").concat(MORE_ARROW_SVG, "\n          </button>") : "<span class=\"support-service-card__more support-service-card__more--empty\">\n            \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435\n            ".concat(MORE_ARROW_SVG, "\n          </span>");
      return "<article class=\"support-service-card\" data-service-index=\"".concat(index, "\">\n          <h3 class=\"support-service-card__title\">").concat(multilineHtml(item.title), "</h3>\n          <p class=\"support-service-card__price\">").concat(price.replace(/ /g, '&nbsp;'), "</p>\n          <a href=\"").concat(btnHref, "\" class=\"support-service-card__btn\">").concat(escapeHtml(item.btnText || 'Оставить заявку'), "</a>\n          ").concat(moreControl, "\n        </article>");
    }).join('');
    container.dataset.servicesJson = JSON.stringify(list);
  }
  function getCurrentCustomerLaw() {
    var toggle = document.querySelector('.support-law-toggle');
    return toggle !== null && toggle !== void 0 && toggle.classList.contains('support-law-toggle--223') ? '223' : '44';
  }
  function renderCustomerServiceCards(section) {
    var root = document.getElementById('for-customers');
    var container = root === null || root === void 0 ? void 0 : root.querySelector('.support-service-cards');
    if (!container || !section) return;
    var law = getCurrentCustomerLaw();
    var services = law === '223' ? section.services223 : section.services44;
    renderServiceCards(container, services);
  }
  function bindSupportServiceDetails() {
    document.querySelectorAll('.support-service-cards').forEach(function (container) {
      if (container.dataset.detailsBound === 'true') return;
      container.dataset.detailsBound = 'true';
      container.addEventListener('click', function (event) {
        var btn = event.target.closest('[data-support-service-detail]');
        if (!btn) return;
        var index = parseInt(btn.getAttribute('data-support-service-detail'), 10);
        var services = [];
        try {
          services = JSON.parse(container.dataset.servicesJson || '[]');
        } catch (error) {
          services = [];
        }
        var item = services[index];
        if (!item || !(item.detailsHtml || '').trim()) return;
        openSupportServiceModal(item);
      });
    });
  }
  function openSupportServiceModal(item) {
    var modal = document.getElementById('supportServiceModal');
    var titleEl = document.getElementById('supportServiceModalTitle');
    var bodyEl = document.getElementById('supportServiceModalBody');
    if (!modal || !titleEl || !bodyEl) return;
    titleEl.innerHTML = multilineHtml(item.title);
    bodyEl.innerHTML = item.detailsHtml || '';
    modal.style.display = 'flex';
  }
  function closeSupportServiceModal() {
    var modal = document.getElementById('supportServiceModal');
    if (modal) modal.style.display = 'none';
  }
  function bindSupportServiceModal() {
    var _modal$querySelector, _modal$querySelector2;
    var modal = document.getElementById('supportServiceModal');
    if (!modal || modal.dataset.bound === 'true') return;
    modal.dataset.bound = 'true';
    (_modal$querySelector = modal.querySelector('.support-service-modal__close')) === null || _modal$querySelector === void 0 || _modal$querySelector.addEventListener('click', closeSupportServiceModal);
    (_modal$querySelector2 = modal.querySelector('.support-service-modal__overlay')) === null || _modal$querySelector2 === void 0 || _modal$querySelector2.addEventListener('click', closeSupportServiceModal);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeSupportServiceModal();
    });
  }
  function renderChecklistBlock(checklistEl, checklist) {
    var _data$items;
    if (!checklistEl) return;
    var data = checklist || {
      title: '',
      items: []
    };
    var titleEl = checklistEl.querySelector('.support-checklist__title');
    var gridEl = checklistEl.querySelector('.support-checklist-grid');
    if (titleEl) titleEl.innerHTML = multilineHtml(data.title);
    if (!gridEl) return;
    var items = (_data$items = data.items) !== null && _data$items !== void 0 && _data$items.length ? data.items : [];
    gridEl.innerHTML = items.map(function (item) {
      var lines = Array.isArray(item.lines) ? item.lines : [];
      var textClass = lines.length <= 2 ? 'support-checklist-card__text support-checklist-card__text--bottom' : 'support-checklist-card__text';
      var linesHtml = lines.map(function (line) {
        return "<span class=\"support-checklist-card__text-line\">".concat(escapeHtml(line), "</span>");
      }).join('');
      var link = fileLinkAttrs(item.file);
      return "<div class=\"support-checklist-item\">\n          <div class=\"support-checklist-card\">\n            <div class=\"support-checklist-card__icon\" aria-hidden=\"true\">\n              <span class=\"support-checklist-card__icon-bg\"></span>\n              <img src=\"".concat(CHECKLIST_ICON_SRC, "\" alt=\"\" class=\"support-checklist-card__icon-inner\" width=\"75\" height=\"76\" decoding=\"async\">\n            </div>\n            <p class=\"").concat(textClass, "\">").concat(linesHtml, "</p>\n          </div>\n          <a href=\"").concat(link.href, "\" class=\"support-checklist-card__download\"").concat(link.target).concat(link.download, ">\n            \u0441\u043A\u0430\u0447\u0430\u0442\u044C\n            ").concat(MORE_ARROW_SVG.replace('support-service-card__more-arrow', 'support-checklist-card__download-arrow'), "\n          </a>\n        </div>");
    }).join('');
  }
  function renderAudienceSection(sectionId, titleSelector, section) {
    var root = document.getElementById(sectionId);
    if (!root) return;
    var titleEl = root.querySelector(titleSelector);
    if (titleEl) titleEl.textContent = (section === null || section === void 0 ? void 0 : section.title) || '';
    if (sectionId === 'for-customers') {
      cachedCustomersSection = section;
      renderCustomerServiceCards(section);
    } else {
      renderServiceCards(root.querySelector('.support-service-cards'), section === null || section === void 0 ? void 0 : section.services);
    }
    renderChecklistBlock(root.querySelector('.support-checklist'), section === null || section === void 0 ? void 0 : section.checklist);
    bindSupportServiceDetails();
  }
  function renderCalculator(calculator) {
    var data = calculator || SUPPORT_DEFAULTS.calculator;
    var titleEl = document.querySelector('.support-calculator__title');
    var infoEl = document.querySelector('.support-calculator__info');
    if (titleEl) titleEl.textContent = data.title || SUPPORT_DEFAULTS.calculator.title;
    if (!infoEl) return;
    var image = (data.image || '').trim();
    var gradient = 'linear-gradient(135deg, #FF5512 0%, #FF8A4C 55%, #FFC9A8 100%)';
    if (image) {
      infoEl.style.backgroundImage = "url('".concat(image.replace(/'/g, "\\'"), "'), ").concat(gradient);
      infoEl.style.backgroundSize = 'cover, auto';
      infoEl.style.backgroundPosition = 'center, center';
    } else {
      infoEl.style.backgroundImage = gradient;
      infoEl.style.backgroundSize = '';
      infoEl.style.backgroundPosition = '';
    }
  }
  function renderTariffs(tariffs) {
    var grid = document.querySelector('.ecp-tariffs__grid');
    if (!grid) return;
    var list = tariffs && tariffs.length ? tariffs : SUPPORT_DEFAULTS.tariffs;
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
    var list = blanks !== null && blanks !== void 0 && (_blanks$items = blanks.items) !== null && _blanks$items !== void 0 && _blanks$items.length ? blanks.items : SUPPORT_DEFAULTS.blanks.items;
    grid.innerHTML = list.map(function (item) {
      var link = fileLinkAttrs(item.file);
      return "<a href=\"".concat(link.href, "\" class=\"ecp-blank-card\"").concat(link.target).concat(link.download, ">\n          <div class=\"ecp-blank-card__content\">\n            <span class=\"ecp-blank-card__text\">").concat(multilineHtml(item.text), "</span>\n            <div class=\"ecp-blank-card__download\">\u0441\u043A\u0430\u0447\u0430\u0442\u044C ").concat(DOWNLOAD_ARROW_SVG, "</div>\n          </div>\n          <div class=\"ecp-blank-card__icon\">\n            <svg width=\"90\" height=\"107\" viewBox=\"0 0 90 107\">\n              <rect width=\"90\" height=\"107\" fill=\"url(#pattern_blank)\"/>\n            </svg>\n          </div>\n        </a>");
    }).join('');
  }
  function renderManual(manual) {
    var _manual$items;
    var listEl = document.querySelector('.ecp-manual__list');
    var bookEl = document.querySelector('.ecp-manual__image');
    var items = manual !== null && manual !== void 0 && (_manual$items = manual.items) !== null && _manual$items !== void 0 && _manual$items.length ? manual.items : SUPPORT_DEFAULTS.manual.items;
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
    var list = videos && videos.length ? videos : SUPPORT_DEFAULTS.videos;
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
    btn.textContent = (support === null || support === void 0 ? void 0 : support.buttonText) || SUPPORT_DEFAULTS.support.buttonText;
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
  function renderSupportPage(data) {
    renderHero(data);
    renderNavCards(data.navCards);
    renderAudienceSection('for-customers', '.support-customers-section__title', data.customers);
    renderCalculator(data.calculator);
    renderAudienceSection('for-suppliers', '.support-suppliers-section__title', data.suppliers);
    renderTariffs(data.tariffs);
    renderBlanks(data.blanks);
    renderManual(data.manual);
    renderVideos(data.videos);
    renderSupport(data.support);
    document.dispatchEvent(new CustomEvent('supportContentReady', {
      detail: data
    }));
  }
  function initSupportLawToggle() {
    var toggle = document.querySelector('.support-law-toggle');
    var btn = toggle === null || toggle === void 0 ? void 0 : toggle.querySelector('.support-law-toggle__switch');
    if (!toggle || !btn) return;
    var labels = toggle.querySelectorAll('.support-law-toggle__label');
    function setLaw(law) {
      var is223 = law === '223';
      toggle.classList.toggle('support-law-toggle--223', is223);
      toggle.classList.toggle('support-law-toggle--44', !is223);
      btn.setAttribute('aria-pressed', is223 ? 'true' : 'false');
      labels.forEach(function (label) {
        label.classList.toggle('support-law-toggle__label--active', label.dataset.law === law);
      });
      toggle.dispatchEvent(new CustomEvent('supportLawChange', {
        detail: {
          law: law
        }
      }));
      if (cachedCustomersSection) renderCustomerServiceCards(cachedCustomersSection);
    }
    btn.addEventListener('click', function () {
      setLaw(toggle.classList.contains('support-law-toggle--223') ? '44' : '223');
    });
  }
  function initSupportContent() {
    return _initSupportContent.apply(this, arguments);
  }
  function _initSupportContent() {
    _initSupportContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var localData, initialData, apiData, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            localData = loadSupportDataFromLocal();
            initialData = localData || migrateSupportPageData(null);
            renderSupportPage(initialData);
            initSupportLawToggle();
            bindSupportServiceModal();
            markSupportContentReady();
            _context2.n = 1;
            return loadSupportDataFromApi();
          case 1:
            apiData = _context2.v;
            if (apiData) {
              renderSupportPage(apiData);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
              } catch (error) {
                console.warn('Support: localStorage update failed', error);
              }
            }
            _context2.n = 3;
            break;
          case 2:
            _context2.p = 2;
            _t2 = _context2.v;
            console.error('Support content init failed', _t2);
            markSupportContentReady();
          case 3:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 2]]);
    }));
    return _initSupportContent.apply(this, arguments);
  }
  window.SupportContent = {
    STORAGE_KEY: STORAGE_KEY,
    SUPPORT_DEFAULTS: SUPPORT_DEFAULTS,
    migrateSupportPageData: migrateSupportPageData,
    migrateSupportData: migrateSupportData,
    loadSupportDataFromApi: loadSupportDataFromApi,
    loadSupportDataFromLocal: loadSupportDataFromLocal,
    resolveVideoThumbnail: resolveVideoThumbnail,
    vkVideoId: vkVideoId,
    vkVideoThumbProxyUrl: vkVideoThumbProxyUrl
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupportContent);
  } else {
    initSupportContent();
  }
})();