function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Контент страницы «Обучение» — загрузка из API / localStorage и отрисовка.
 */
(function () {
  var STORAGE_KEY = 'crzrt_obuchenie_page_data';
  var CONTENT_PENDING_CLASS = 'obuchenie-content-pending';
  var CONTENT_READY_CLASS = 'obuchenie-content-ready';
  var MORE_ARROW_SVG = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M1 1L11 11M11 11V3M11 11H3" stroke="#0FAA4B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DEFAULT_NAV_CARDS = [{
    label: 'Популярные\nпрограммы обучения',
    href: '#courses',
    icon: 'assets/img/obuchenie/icon-programs.png?v=2'
  }, {
    label: 'Для\nпоставщиков',
    href: '#suppliers',
    icon: 'assets/img/obuchenie/icon-distance.png?v=2'
  }, {
    label: 'Для\nзаказчиков',
    href: '#customers',
    icon: 'assets/img/obuchenie/icon-corporate.png?v=2'
  }, {
    label: 'Календарь\nкурсов',
    href: '#schedule',
    icon: 'assets/img/obuchenie/icon-schedule.png?v=2'
  }, {
    label: 'Тестирование',
    href: '#testing',
    icon: 'assets/img/obuchenie/icon-certificates.png?v=2'
  }, {
    label: 'Помощь\nс выбором',
    href: '#help',
    icon: 'assets/img/obuchenie/icon-faq.png?v=2'
  }];
  var DEFAULT_COURSE_CARDS = [{
    title: 'Очный курс повышения квалификации',
    price: 'от 7 830 руб.',
    durationNum: '1,5',
    durationUnit: 'месяца',
    scheduleNum: '2',
    scheduleUnit: 'раза в неделю',
    btnText: 'Записаться',
    btnLink: '#contacts',
    moreLink: '#courses'
  }, {
    title: 'Дистанционный курс повышения квалификации',
    price: 'от 10 890 руб.',
    durationNum: '1,5',
    durationUnit: 'месяца',
    scheduleNum: '2',
    scheduleUnit: 'раза в неделю',
    btnText: 'Записаться',
    btnLink: '#contacts',
    moreLink: '#courses'
  }, {
    title: 'Очный курс для поставщиков',
    price: 'от 20 256 руб.',
    durationNum: '1,5',
    durationUnit: 'месяца',
    scheduleNum: '2',
    scheduleUnit: 'раза в неделю',
    btnText: 'Записаться',
    btnLink: '#contacts',
    moreLink: '#courses'
  }];
  var DEFAULT_TAGS = ['Онлайн-курсы', 'Онлайн-курсы', 'Онлайн-курсы', 'Онлайн-курсы', 'Онлайн-курсы', 'Онлайн-курсы', 'Онлайн-курсы', 'Программирование', 'Программирование', 'Программирование', 'Программирование', 'Программирование', 'Программирование', 'Программирование', 'Дизайн', 'Дизайн', 'Дизайн', 'Дизайн', 'Дизайн', 'Дизайн'];
  var MONTH_NAMES_RU = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  var DEFAULT_COURSE_REGISTRY = [{
    id: 'demo-och-2026-06',
    title: 'Очный курс повышения квалификации по 44-ФЗ',
    format: 'och',
    dateFrom: '2026-06-03',
    dateTo: '2026-06-07',
    durationDays: 5,
    description: 'Практический курс для специалистов по закупкам: разбор типовых ошибок, кейсы и шаблоны документов.',
    price: '23 700 ₽',
    forIndividuals: true,
    forLegalEntities: true,
    bitrixFormFl: {
      id: '886',
      sec: 'a7wdlg'
    },
    bitrixFormUr: {
      id: '888',
      sec: '6wx7xd'
    },
    speakers: [{
      name: 'Иванов Иван Иванович',
      position: 'к.ю.н., эксперт по госзакупкам'
    }],
    active: true
  }, {
    id: 'demo-dist-2026-06',
    title: 'Дистанционный курс для поставщиков',
    format: 'dist',
    dateFrom: '2026-06-10',
    dateTo: '2026-06-24',
    durationDays: 15,
    description: 'Онлайн-программа с доступом к материалам и консультациями куратора.',
    price: '10 890 ₽',
    forIndividuals: true,
    forLegalEntities: false,
    speakers: [{
      name: 'Петрова Анна Сергеевна',
      position: 'ведущий преподаватель, опыт 12 лет'
    }],
    active: true
  }];
  var OBUCHENIE_DEFAULTS = {
    hero: {
      background: '',
      title: 'Обучение\nгосзакупкам',
      subtitle: 'Как зарабатывать на госзакупках и тендерах: практические курсы и программы для заказчиков и поставщиков.',
      gavelImage: 'assets/img/consulting/banner-gavel.png',
      titleColor: '#00AE4D',
      subtitleColor: '#FFFFFF',
      titleTop: 68,
      titleLeft: 60,
      subtitleBottom: 40,
      subtitleLeft: 60
    },
    navCards: DEFAULT_NAV_CARDS.map(function (card) {
      return _objectSpread({}, card);
    }),
    courseSearch: {
      title: 'Поиск курсов',
      cta: 'Оставьте заявку, мы поможем',
      phone: '88001017892',
      phoneDisplay: '8 800 101-78-92',
      tags: [].concat(DEFAULT_TAGS),
      showAllLabel: 'Показать все',
      blocks: [{
        id: 'block_audience',
        title: 'заказчик/поставщик',
        values: ['Заказчик', 'Поставщик']
      }, {
        id: 'block_law',
        title: '44-ФЗ / 223-ФЗ',
        values: ['44-ФЗ', '223-ФЗ']
      }, {
        id: 'block_format',
        title: 'очно / дистанционно',
        values: ['Очно', 'Дистанционно']
      }, {
        id: 'block_type',
        title: 'Курсы повышения ...',
        values: ['Курсы повышения квалификации', 'Курсы профессиональной переподготовки']
      }]
    },
    calendar: {
      promoTitle: 'Защищаем\nваши интересы',
      promoTitleColor: '#FFFFFF',
      promoImage: 'assets/img/img1_processed.png',
      promoLink: '',
      allCoursesLink: '#courses',
      allCoursesFileName: '',
      courseDaysByMonth: {
        '2026-5': [5, 8, 15, 20],
        '2026-6': [3, 10, 17, 24]
      }
    },
    courseCards: DEFAULT_COURSE_CARDS.map(function (card) {
      return _objectSpread({}, card);
    }),
    courseRegistry: DEFAULT_COURSE_REGISTRY.map(function (item) {
      return _objectSpread(_objectSpread({}, item), {}, {
        speakers: item.speakers.map(function (speaker) {
          return _objectSpread({}, speaker);
        })
      });
    }),
    testingBanner: {
      title: 'Проверь себя\nв госзакупках',
      btnText: 'Пройти тест',
      btnLink: 'testing.html',
      image: ''
    }
  };
  var isObucheniePage = document.body.dataset.page === 'obuchenie';
  if (isObucheniePage) {
    document.documentElement.classList.add(CONTENT_PENDING_CLASS);
  }
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
  function parseIsoDate(value) {
    if (!value || typeof value !== 'string') return null;
    var str = value.trim();
    var match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      var year = parseInt(match[1], 10);
      var month = parseInt(match[2], 10);
      var day = parseInt(match[3], 10);
      var date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) return date;
    }
    match = str.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (match) {
      var day = parseInt(match[1], 10);
      var month = parseInt(match[2], 10);
      var year = parseInt(match[3], 10);
      var date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) return date;
    }
    return null;
  }
  function normalizeDateFrom(rawDateFrom) {
    if (!rawDateFrom) return '';
    var str = String(rawDateFrom).trim();
    var parts = str.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
    var validIsoStrings = parts.map(function(p) {
      var d = parseIsoDate(p);
      return d ? formatIsoDate(d) : p;
    });
    return validIsoStrings.join(', ');
  }
  function formatIsoDate(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return "".concat(y, "-").concat(m, "-").concat(d);
  }
  function createCourseId() {
    return "course_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 8));
  }
  function addDays(date, days) {
    var next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    next.setDate(next.getDate() + days);
    return next;
  }
  function getCourseDateRanges(course) {
    if (!course || !course.dateFrom) return [];
    var datesStr = String(course.dateFrom);
    var dateStrings = datesStr.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
    var explicitEnd = parseIsoDate(course === null || course === void 0 ? void 0 : course.dateTo);
    var durationDays = Math.max(1, parseInt(course === null || course === void 0 ? void 0 : course.durationDays, 10) || 1);
    return dateStrings.map(function(dateStr) {
      var start = parseIsoDate(dateStr);
      if (!start) return null;
      var end = explicitEnd && explicitEnd >= start && dateStrings.length === 1 ? explicitEnd : addDays(start, durationDays - 1);
      return {
        from: start,
        to: end
      };
    }).filter(Boolean);
  }
  function getCourseDateRange(course) {
    var ranges = getCourseDateRanges(course);
    return ranges.length ? ranges[0] : null;
  }
  function normalizeSpeaker(raw) {
    return {
      name: String((raw === null || raw === void 0 ? void 0 : raw.name) || '').trim(),
      role: String((raw === null || raw === void 0 ? void 0 : raw.role) || (raw === null || raw === void 0 ? void 0 : raw.position) || '').trim(),
      position: String((raw === null || raw === void 0 ? void 0 : raw.role) || (raw === null || raw === void 0 ? void 0 : raw.position) || '').trim(),
      desc: String((raw === null || raw === void 0 ? void 0 : raw.desc) || '').trim(),
      img: String((raw === null || raw === void 0 ? void 0 : raw.img) || '').trim()
    };
  }
  var DEFAULT_BITRIX_FIELD_MAP = {
    name: 'LEAD_NAME',
    phone: 'LEAD_PHONE',
    email: 'LEAD_EMAIL',
    company: 'LEAD_COMPANY_TITLE',
    source: 'LEAD_UF_CRM_1669365821',
    agreement: 'AGREEMENT_24'
  };
  var BITRIX_FORM_CDN_MEMBER = 'b12905608';
  var BITRIX_FORM_LOADER_BASE = "https://cdn-ru.bitrix24.ru/".concat(BITRIX_FORM_CDN_MEMBER, "/crm/form");
  function parseBitrixFormRef(value) {
    var str = String(value || '').trim();
    var scriptMatch = str.match(/data-b24-form="[\w-]+\/(\d+)\/([a-z0-9]+)"/i) || str.match(/(?:click|inline)\/(\d+)\/([a-z0-9]+)/i) || str.match(/loader_(\d+)\.js[\s\S]*?data-b24-form="[\w-]+\/\1\/([a-z0-9]+)"/i);
    if (scriptMatch) {
      return {
        id: scriptMatch[1],
        sec: scriptMatch[2]
      };
    }
    var loaderMatch = str.match(/loader_(\d+)\.js/i);
    var secFromScript = str.match(/data-b24-form="[\w-]+\/\d+\/([a-z0-9]+)"/i);
    if (loaderMatch && secFromScript) {
      return {
        id: loaderMatch[1],
        sec: secFromScript[1]
      };
    }
    var match = str.match(/^(\d+)\s*[/:]\s*([a-z0-9]+)$/i);
    if (!match) return null;
    return {
      id: match[1],
      sec: match[2]
    };
  }
  function formatBitrixFormRef(form) {
    if (!(form !== null && form !== void 0 && form.id) || !(form !== null && form !== void 0 && form.sec)) return '';
    return "".concat(form.id, " / ").concat(form.sec);
  }
  function normalizeBitrixForm(raw) {
    if (raw && _typeof(raw) === 'object' && raw.id && raw.sec) {
      var id = String(raw.id).trim();
      var sec = String(raw.sec).trim();
      if (!/^\d+$/.test(id) || !/^[a-z0-9]+$/i.test(sec)) {
        return null;
      }
      var normalized = {
        id: id,
        sec: sec
      };
      if (raw.fieldMap && _typeof(raw.fieldMap) === 'object') {
        normalized.fieldMap = _objectSpread(_objectSpread({}, DEFAULT_BITRIX_FIELD_MAP), raw.fieldMap);
      }
      if (Array.isArray(raw.sourceOptions)) {
        normalized.sourceOptions = raw.sourceOptions.map(function (item) {
          return {
            label: String((item === null || item === void 0 ? void 0 : item.label) || '').trim(),
            value: String((item === null || item === void 0 ? void 0 : item.value) || '').trim()
          };
        }).filter(function (item) {
          return item.label && item.value;
        });
      }
      if (raw.emailRequired !== undefined) normalized.emailRequired = Boolean(raw.emailRequired);
      if (raw.captchaEnabled !== undefined) normalized.captchaEnabled = Boolean(raw.captchaEnabled);
      if (raw.title) normalized.title = String(raw.title);
      return normalized;
    }
    return parseBitrixFormRef(raw);
  }
  function fetchBitrixFormMeta(_x) {
    return _fetchBitrixFormMeta.apply(this, arguments);
  }
  function _fetchBitrixFormMeta() {
    _fetchBitrixFormMeta = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(formId) {
      var id, response, data, _t2;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            id = parseInt(formId, 10);
            if (id) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2, null);
          case 1:
            _context3.p = 1;
            _context3.n = 2;
            return fetch("api/bitrix-form-meta.php?id=".concat(id));
          case 2:
            response = _context3.v;
            _context3.n = 3;
            return response.json().catch(function () {
              return {};
            });
          case 3:
            data = _context3.v;
            if (!(!response.ok || !data.success)) {
              _context3.n = 4;
              break;
            }
            return _context3.a(2, null);
          case 4:
            return _context3.a(2, {
              fieldMap: _objectSpread(_objectSpread({}, DEFAULT_BITRIX_FIELD_MAP), data.fieldMap || {}),
              sourceOptions: Array.isArray(data.sourceOptions) ? data.sourceOptions : [],
              emailRequired: Boolean(data.emailRequired),
              captchaEnabled: Boolean(data.captchaEnabled),
              title: data.title || ''
            });
          case 5:
            _context3.p = 5;
            _t2 = _context3.v;
            return _context3.a(2, null);
        }
      }, _callee3, null, [[1, 5]]);
    }));
    return _fetchBitrixFormMeta.apply(this, arguments);
  }
  function enrichBitrixFormRef(_x2) {
    return _enrichBitrixFormRef.apply(this, arguments);
  }
  function _enrichBitrixFormRef() {
    _enrichBitrixFormRef = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(formRef) {
      var _base$sourceOptions;
      var base, meta;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            base = normalizeBitrixForm(formRef);
            if (!(!(base !== null && base !== void 0 && base.id) || !(base !== null && base !== void 0 && base.sec))) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2, null);
          case 1:
            if (!(base.fieldMap && (_base$sourceOptions = base.sourceOptions) !== null && _base$sourceOptions !== void 0 && _base$sourceOptions.length)) {
              _context4.n = 2;
              break;
            }
            return _context4.a(2, base);
          case 2:
            _context4.n = 3;
            return fetchBitrixFormMeta(base.id);
          case 3:
            meta = _context4.v;
            if (meta) {
              _context4.n = 4;
              break;
            }
            return _context4.a(2, base);
          case 4:
            return _context4.a(2, _objectSpread(_objectSpread(_objectSpread({}, base), meta), {}, {
              id: base.id,
              sec: base.sec
            }));
        }
      }, _callee4);
    }));
    return _enrichBitrixFormRef.apply(this, arguments);
  }
  function getBitrixFieldMap(formRef) {
    return _objectSpread(_objectSpread({}, DEFAULT_BITRIX_FIELD_MAP), (formRef === null || formRef === void 0 ? void 0 : formRef.fieldMap) || {});
  }
  function buildBitrixEnrollPayload(bitrixForm, audienceType) {
    var _document$getElementB, _document$getElementB2, _document$getElementB3, _document$getElementB4, _document$getElementB5;
    var map = getBitrixFieldMap(bitrixForm);
    var name = ((_document$getElementB = document.getElementById('enroll-name')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value.trim()) || '';
    var phone = ((_document$getElementB2 = document.getElementById('enroll-phone')) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.value.trim()) || '';
    var email = ((_document$getElementB3 = document.getElementById('enroll-email')) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.value.trim()) || '';
    var source = ((_document$getElementB4 = document.getElementById('enroll-source')) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value) || '';
    var company = ((_document$getElementB5 = document.getElementById('enroll-company')) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.value.trim()) || '';
    var values = {};
    var required = [];
    if (map.name) {
      values[map.name] = name;
      required.push(map.name);
    }
    if (map.phone) {
      values[map.phone] = phone;
      required.push(map.phone);
    }
    if (map.email) {
      values[map.email] = email;
      if ((bitrixForm === null || bitrixForm === void 0 ? void 0 : bitrixForm.emailRequired) !== false) required.push(map.email);
    }
    if (map.source && source) {
      values[map.source] = source;
      required.push(map.source);
    }
    if (map.agreement) {
      values[map.agreement] = 'Y';
    }
    if (audienceType === 'legal' && map.company) {
      values[map.company] = company;
      required.push(map.company);
    }
    return {
      values: values,
      required: required
    };
  }
  function configureEnrollSourceSelect(bitrixForm) {
    var _bitrixForm$sourceOpt;
    var select = document.getElementById('enroll-source');
    if (!select) return;
    var options = bitrixForm !== null && bitrixForm !== void 0 && (_bitrixForm$sourceOpt = bitrixForm.sourceOptions) !== null && _bitrixForm$sourceOpt !== void 0 && _bitrixForm$sourceOpt.length ? bitrixForm.sourceOptions : [{
      label: 'Реклама',
      value: '1156'
    }, {
      label: 'Поисковая система',
      value: '1158'
    }, {
      label: 'Рассылка по ЭДО',
      value: '1160'
    }, {
      label: 'Рассылка по эл. почте',
      value: '1162'
    }, {
      label: 'Звонок от АО ЦРЗ РТ',
      value: '1164'
    }, {
      label: 'От коллег',
      value: '1166'
    }, {
      label: 'Обучался ранее',
      value: '1168'
    }, {
      label: 'Телеграм',
      value: '1170'
    }, {
      label: 'ВКонтакте',
      value: '1172'
    }, {
      label: 'Другие соц сети',
      value: '1174'
    }];
    select.innerHTML = "\n      <option value=\"\" disabled selected hidden>\u041E\u0442\u043A\u0443\u0434\u0430 \u0443\u0437\u043D\u0430\u043B\u0438 \u043E \u043C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u0438 *</option>\n      ".concat(options.map(function (item) {
      return "<option value=\"".concat(escapeAttr(item.value), "\">").concat(escapeHtml(item.label), "</option>");
    }).join(''), "\n    ");
  }
  function clearBitrixEnrollEmbed() {
    var embed = document.getElementById('enroll-bitrix-embed');
    if (embed) {
      embed.innerHTML = '';
      embed.hidden = true;
    }
    var customForm = document.getElementById('enroll-form');
    if (customForm) customForm.hidden = false;
  }
  function mountBitrixInlineForm(container, formId, sec) {
    if (!container || !formId || !sec) return;
    container.innerHTML = '';
    var script = document.createElement('script');
    script.setAttribute('data-b24-form', "inline/".concat(formId, "/").concat(sec));
    script.setAttribute('data-skip-moving', 'true');
    script.textContent = "(function(w,d,u){var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);})(window,document,'".concat(BITRIX_FORM_LOADER_BASE, "/loader_").concat(formId, ".js');");
    container.appendChild(script);
  }
  function getCourseBitrixForm(_x3, _x4) {
    return _getCourseBitrixForm.apply(this, arguments);
  }
  function _getCourseBitrixForm() {
    _getCourseBitrixForm = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(course, audienceType) {
      var raw, normalized;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            if (course) {
              _context5.n = 1;
              break;
            }
            return _context5.a(2, null);
          case 1:
            raw = audienceType === 'legal' ? course.bitrixFormUr : course.bitrixFormFl;
            normalized = normalizeBitrixForm(raw);
            if (normalized) {
              _context5.n = 2;
              break;
            }
            return _context5.a(2, null);
          case 2:
            if (!(normalized.captchaEnabled === undefined && enrichBitrixFormRef)) {
              _context5.n = 3;
              break;
            }
            return _context5.a(2, enrichBitrixFormRef(normalized));
          case 3:
            return _context5.a(2, normalized);
        }
      }, _callee5);
    }));
    return _getCourseBitrixForm.apply(this, arguments);
  }
  function refreshEnrollBitrixView() {
    return _refreshEnrollBitrixView.apply(this, arguments);
  }
  function _refreshEnrollBitrixView() {
    _refreshEnrollBitrixView = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      var _form$dataset, _document$getElementB6;
      var form, embed, courseId, course, audienceType, bitrixForm, emailInput, _t3;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            form = document.getElementById('enroll-form');
            embed = document.getElementById('enroll-bitrix-embed');
            courseId = (form === null || form === void 0 || (_form$dataset = form.dataset) === null || _form$dataset === void 0 ? void 0 : _form$dataset.courseId) || '';
            course = activeCourseRegistry.find(function (item) {
              return item.id === courseId;
            });
            audienceType = ((_document$getElementB6 = document.getElementById('enroll-audience-type')) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.value) === 'legal' ? 'legal' : 'individual';
            if (!course) {
              _context6.n = 2;
              break;
            }
            _context6.n = 1;
            return getCourseBitrixForm(course, audienceType);
          case 1:
            _t3 = _context6.v;
            _context6.n = 3;
            break;
          case 2:
            _t3 = null;
          case 3:
            bitrixForm = _t3;
            if (form) form.hidden = false;
            if (embed) {
              embed.hidden = true;
              embed.innerHTML = '';
            }
            configureEnrollSourceSelect(bitrixForm);
            emailInput = document.getElementById('enroll-email');
            if (emailInput) emailInput.required = (bitrixForm === null || bitrixForm === void 0 ? void 0 : bitrixForm.emailRequired) !== false;
            return _context6.a(2, {
              bitrixForm: bitrixForm,
              useEmbed: false
            });
        }
      }, _callee6);
    }));
    return _refreshEnrollBitrixView.apply(this, arguments);
  }
  function normalizeCourseAudience(raw) {
    var hasFl = raw === null || raw === void 0 ? void 0 : raw.forIndividuals;
    var hasUr = raw === null || raw === void 0 ? void 0 : raw.forLegalEntities;
    if (hasFl === undefined && hasUr === undefined) {
      return {
        forIndividuals: true,
        forLegalEntities: true
      };
    }
    var forIndividuals = hasFl !== false;
    var forLegalEntities = hasUr !== false;
    if (!forIndividuals && !forLegalEntities) {
      forIndividuals = true;
      forLegalEntities = true;
    }
    return {
      forIndividuals: forIndividuals,
      forLegalEntities: forLegalEntities
    };
  }
  function normalizeCourseRegistryItem(raw, index) {
    var format = (raw === null || raw === void 0 ? void 0 : raw.format) === 'dist' ? 'dist' : 'och';
    var dateFrom = normalizeDateFrom(raw === null || raw === void 0 ? void 0 : raw.dateFrom);
    var durationDays = Math.max(1, parseInt(raw === null || raw === void 0 ? void 0 : raw.durationDays, 10) || 1);
    var ranges = dateFrom ? getCourseDateRanges({
      dateFrom: dateFrom,
      dateTo: raw === null || raw === void 0 ? void 0 : raw.dateTo,
      durationDays: durationDays
    }) : [];
    var lastRange = ranges.length ? ranges[ranges.length - 1] : null;
    var speakers = Array.isArray(raw === null || raw === void 0 ? void 0 : raw.speakers) && raw.speakers.length ? raw.speakers.map(normalizeSpeaker).filter(function (speaker) {
      return speaker.name || speaker.role || speaker.position;
    }) : [];
    var audience = normalizeCourseAudience(raw);
    var options = Array.isArray(raw === null || raw === void 0 ? void 0 : raw.options) ? _toConsumableArray(raw.options) : [];
    if (!(raw !== null && raw !== void 0 && raw.options)) {
      if (raw !== null && raw !== void 0 && raw.forCustomers) options.push('Заказчик');
      if (raw !== null && raw !== void 0 && raw.forSuppliers) options.push('Поставщик');
      if (raw !== null && raw !== void 0 && raw.is44fz) options.push('44-ФЗ');
      if (raw !== null && raw !== void 0 && raw.is223fz) options.push('223-ФЗ');
      if (format === 'och') options.push('Очно');
      if (format === 'dist') options.push('Дистанционно');
    }
    return {
      id: String((raw === null || raw === void 0 ? void 0 : raw.id) || createCourseId() || "course_".concat(index)),
      title: String((raw === null || raw === void 0 ? void 0 : raw.title) || '').trim(),
      format: format,
      dateFrom: dateFrom,
      dateTo: lastRange ? formatIsoDate(lastRange.to) : parseIsoDate(raw === null || raw === void 0 ? void 0 : raw.dateTo) ? String(raw.dateTo).trim() : dateFrom,
      durationDays: durationDays,
      description: Array.isArray(raw === null || raw === void 0 ? void 0 : raw.description) ? raw.description : String((raw === null || raw === void 0 ? void 0 : raw.description) || '').trim(),
      price: String((raw === null || raw === void 0 ? void 0 : raw.price) || '').trim(),
      forIndividuals: audience.forIndividuals,
      forLegalEntities: audience.forLegalEntities,
      forCustomers: Boolean(raw === null || raw === void 0 ? void 0 : raw.forCustomers),
      forSuppliers: Boolean(raw === null || raw === void 0 ? void 0 : raw.forSuppliers),
      is44fz: Boolean(raw === null || raw === void 0 ? void 0 : raw.is44fz),
      is223fz: Boolean(raw === null || raw === void 0 ? void 0 : raw.is223fz),
      bitrixFormFl: normalizeBitrixForm(raw === null || raw === void 0 ? void 0 : raw.bitrixFormFl),
      bitrixFormUr: normalizeBitrixForm(raw === null || raw === void 0 ? void 0 : raw.bitrixFormUr),
      bitrixLeadId: raw !== null && raw !== void 0 && raw.bitrixLeadId ? parseInt(raw.bitrixLeadId, 10) || null : null,
      bitrixCourseElementId: raw !== null && raw !== void 0 && raw.bitrixCourseElementId ? parseInt(raw.bitrixCourseElementId, 10) || null : null,
      speakers: speakers,
      options: options,
      active: (raw === null || raw === void 0 ? void 0 : raw.active) !== false,
      targetAudience: Array.isArray(raw === null || raw === void 0 ? void 0 : raw.targetAudience) ? raw.targetAudience : String((raw === null || raw === void 0 ? void 0 : raw.targetAudience) || '').trim(),
      outcomes: Array.isArray(raw === null || raw === void 0 ? void 0 : raw.outcomes) ? raw.outcomes : String((raw === null || raw === void 0 ? void 0 : raw.outcomes) || '').trim(),
      documentType: String((raw === null || raw === void 0 ? void 0 : raw.documentType) || '').trim(),
      documentImage: String((raw === null || raw === void 0 ? void 0 : raw.documentImage) || '').trim(),
      programPdf: String((raw === null || raw === void 0 ? void 0 : raw.programPdf) || '').trim(),
      program: Array.isArray(raw === null || raw === void 0 ? void 0 : raw.program) ? raw.program : []
    };
  }
  function normalizeCourseRegistry(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map(function (item, index) {
      return normalizeCourseRegistryItem(item, index);
    });
  }
  function deriveCourseDaysByMonth(registry) {
    var result = {};
    var list = Array.isArray(registry) ? registry : [];
    list.forEach(function (course) {
      if (!course || course.active === false) return;
      var ranges = getCourseDateRanges(course);
      ranges.forEach(function (range) {
        if (!range) return;
        var start = range.from;
        var key = "".concat(start.getFullYear(), "-").concat(start.getMonth() + 1);
        if (!result[key]) result[key] = [];
        var day = start.getDate();
        if (!result[key].includes(day)) result[key].push(day);
      });
    });
    Object.keys(result).forEach(function (key) {
      result[key].sort(function (a, b) {
        return a - b;
      });
    });
    return result;
  }
  function resolveCalendarCourseDays(calendar, courseRegistry) {
    var derived = deriveCourseDaysByMonth(courseRegistry);
    if (Object.keys(derived).length) return derived;
    return normalizeCourseDays(calendar === null || calendar === void 0 ? void 0 : calendar.courseDaysByMonth);
  }
  function normalizeCourseDays(raw) {
    var result = {};
    if (!raw || _typeof(raw) !== 'object') return _objectSpread({}, OBUCHENIE_DEFAULTS.calendar.courseDaysByMonth);
    Object.keys(raw).forEach(function (key) {
      var days = raw[key];
      if (!Array.isArray(days)) return;
      var normalized = days.map(function (day) {
        return parseInt(day, 10);
      }).filter(function (day) {
        return Number.isFinite(day) && day >= 1 && day <= 31;
      });
      if (normalized.length) result[key] = normalized;
    });
    return Object.keys(result).length ? result : _objectSpread({}, OBUCHENIE_DEFAULTS.calendar.courseDaysByMonth);
  }
  var OBUCHENIE_HERO_SLIDE_DEFAULTS = {
    title: OBUCHENIE_DEFAULTS.hero.title,
    subtitle: OBUCHENIE_DEFAULTS.hero.subtitle,
    titleColor: OBUCHENIE_DEFAULTS.hero.titleColor,
    subtitleColor: OBUCHENIE_DEFAULTS.hero.subtitleColor,
    titleTop: OBUCHENIE_DEFAULTS.hero.titleTop,
    titleLeft: OBUCHENIE_DEFAULTS.hero.titleLeft,
    subtitleBottom: OBUCHENIE_DEFAULTS.hero.subtitleBottom,
    subtitleLeft: OBUCHENIE_DEFAULTS.hero.subtitleLeft
  };
  var obuchenieHeroRenderer = null;
  function getObuchenieHeroRenderer() {
    if (!obuchenieHeroRenderer && window.HeroSlides) {
      obuchenieHeroRenderer = window.HeroSlides.createRenderer({
        rootSelector: '.consulting-hero',
        customBgClass: 'consulting-hero--custom-bg',
        titleSelector: '.consulting-hero-title',
        subtitleSelector: '.consulting-hero-subtitle',
        graphicSelector: '.consulting-banner__graphic',
        contentSelector: '.consulting-hero__content',
        subtitleUseBottom: true,
        titleColorFallback: '#00AE4D',
        subtitleColorFallback: '#FFFFFF'
      });
    }
    return obuchenieHeroRenderer;
  }
  function buildObuchenieHeroFromSlides(heroSlides, rawHero) {
    var first = (heroSlides === null || heroSlides === void 0 ? void 0 : heroSlides[0]) || {};
    var legacy = rawHero && _typeof(rawHero) === 'object' ? rawHero : {};
    return {
      background: first.background || '',
      title: first.title || OBUCHENIE_DEFAULTS.hero.title,
      subtitle: first.subtitle || OBUCHENIE_DEFAULTS.hero.subtitle,
      gavelImage: legacy.gavelImage || OBUCHENIE_DEFAULTS.hero.gavelImage,
      titleColor: first.titleColor || OBUCHENIE_DEFAULTS.hero.titleColor,
      subtitleColor: first.subtitleColor || OBUCHENIE_DEFAULTS.hero.subtitleColor,
      titleTop: first.titleTop !== undefined ? first.titleTop : OBUCHENIE_DEFAULTS.hero.titleTop,
      titleLeft: first.titleLeft !== undefined ? first.titleLeft : OBUCHENIE_DEFAULTS.hero.titleLeft,
      titleFontSize: first.titleFontSize || '',
      titleFontWeight: first.titleFontWeight || '',
      titleItalic: first.titleItalic || false,
      titleUnderline: first.titleUnderline || false,
      subtitleBottom: first.subtitleBottom !== undefined ? first.subtitleBottom : OBUCHENIE_DEFAULTS.hero.subtitleBottom,
      subtitleLeft: first.subtitleLeft !== undefined ? first.subtitleLeft : OBUCHENIE_DEFAULTS.hero.subtitleLeft,
      subtitleFontSize: first.subtitleFontSize || '',
      subtitleFontWeight: first.subtitleFontWeight || '',
      subtitleItalic: first.subtitleItalic || false,
      subtitleUnderline: first.subtitleUnderline || false
    };
  }
  function migrateObucheniePageData(raw) {
    var _raw$testingBanner, _raw$testingBanner2, _raw$testingBanner3, _raw$testingBanner4, _raw$testingBanner5, _raw$testingBanner6, _raw$testingBanner7, _raw$testingBanner8, _raw$testingBanner9, _raw$testingBanner0, _raw$testingBanner1, _raw$testingBanner10, _raw$testingBanner11;
    var navCards = Array.isArray(raw === null || raw === void 0 ? void 0 : raw.navCards) && raw.navCards.length ? raw.navCards.map(function (card, i) {
      var _OBUCHENIE_DEFAULTS$n, _OBUCHENIE_DEFAULTS$n2, _OBUCHENIE_DEFAULTS$n3;
      return {
        label: (card === null || card === void 0 ? void 0 : card.label) || ((_OBUCHENIE_DEFAULTS$n = OBUCHENIE_DEFAULTS.navCards[i]) === null || _OBUCHENIE_DEFAULTS$n === void 0 ? void 0 : _OBUCHENIE_DEFAULTS$n.label) || '',
        href: (card === null || card === void 0 ? void 0 : card.href) || ((_OBUCHENIE_DEFAULTS$n2 = OBUCHENIE_DEFAULTS.navCards[i]) === null || _OBUCHENIE_DEFAULTS$n2 === void 0 ? void 0 : _OBUCHENIE_DEFAULTS$n2.href) || '#',
        icon: (card === null || card === void 0 ? void 0 : card.icon) || ((_OBUCHENIE_DEFAULTS$n3 = OBUCHENIE_DEFAULTS.navCards[i]) === null || _OBUCHENIE_DEFAULTS$n3 === void 0 ? void 0 : _OBUCHENIE_DEFAULTS$n3.icon) || ''
      };
    }) : OBUCHENIE_DEFAULTS.navCards.map(function (card) {
      return _objectSpread({}, card);
    });
    var rawSearch = raw !== null && raw !== void 0 && raw.courseSearch && _typeof(raw.courseSearch) === 'object' ? raw.courseSearch : {};
    var tags = [];
    if (Array.isArray(rawSearch.tags)) {
      tags = rawSearch.tags.map(function (tag) {
        return String(tag || '').trim();
      }).filter(Boolean);
    } else if (typeof rawSearch.tags === 'string') {
      tags = rawSearch.tags.split('\n').map(function (tag) {
        return tag.trim();
      }).filter(Boolean);
    }
    if (!tags.length && (!raw || rawSearch.tags === undefined)) tags = _toConsumableArray(OBUCHENIE_DEFAULTS.courseSearch.tags);
    var rawCalendar = raw !== null && raw !== void 0 && raw.calendar && _typeof(raw.calendar) === 'object' ? raw.calendar : {};
    var courseRegistry = Array.isArray(raw === null || raw === void 0 ? void 0 : raw.courseRegistry) ? normalizeCourseRegistry(raw.courseRegistry) : !raw ? OBUCHENIE_DEFAULTS.courseRegistry.map(function (item) {
      return _objectSpread(_objectSpread({}, item), {}, {
        speakers: item.speakers.map(function (speaker) {
          return _objectSpread({}, speaker);
        })
      });
    }) : [];
    var heroSlides = window.HeroSlides ? window.HeroSlides.migrateHeroSlides(raw, OBUCHENIE_HERO_SLIDE_DEFAULTS) : (Array.isArray(raw === null || raw === void 0 ? void 0 : raw.heroSlides) ? raw.heroSlides : [buildObuchenieHeroFromSlides([], raw === null || raw === void 0 ? void 0 : raw.hero)]);
    return {
      heroSlides: heroSlides,
      hero: window.HeroSlides ? buildObuchenieHeroFromSlides(heroSlides, raw === null || raw === void 0 ? void 0 : raw.hero) : (raw === null || raw === void 0 ? void 0 : raw.hero) || buildObuchenieHeroFromSlides(heroSlides, null),
      navCards: navCards,
      courseSearch: {
        title: rawSearch.title || OBUCHENIE_DEFAULTS.courseSearch.title,
        cta: rawSearch.cta || OBUCHENIE_DEFAULTS.courseSearch.cta,
        phone: rawSearch.phone || OBUCHENIE_DEFAULTS.courseSearch.phone,
        phoneDisplay: rawSearch.phoneDisplay || OBUCHENIE_DEFAULTS.courseSearch.phoneDisplay,
        tags: tags,
        showAllLabel: rawSearch.showAllLabel || OBUCHENIE_DEFAULTS.courseSearch.showAllLabel,
        blocks: Array.isArray(rawSearch.blocks) ? rawSearch.blocks : _toConsumableArray(OBUCHENIE_DEFAULTS.courseSearch.blocks)
      },
      calendar: {
        promoTitle: rawCalendar.promoTitle || OBUCHENIE_DEFAULTS.calendar.promoTitle,
        promoTitleColor: rawCalendar.promoTitleColor || OBUCHENIE_DEFAULTS.calendar.promoTitleColor,
        promoImage: rawCalendar.promoImage || OBUCHENIE_DEFAULTS.calendar.promoImage,
        promoLink: rawCalendar.promoLink || OBUCHENIE_DEFAULTS.calendar.promoLink || '',
        allCoursesLink: rawCalendar.allCoursesLink || OBUCHENIE_DEFAULTS.calendar.allCoursesLink,
        allCoursesFileName: rawCalendar.allCoursesFileName || '',
        courseDaysByMonth: resolveCalendarCourseDays(rawCalendar, courseRegistry)
      },
      courseCards: Array.isArray(raw === null || raw === void 0 ? void 0 : raw.courseCards) && raw.courseCards.length ? raw.courseCards.map(function (card, i) {
        var _OBUCHENIE_DEFAULTS$c, _OBUCHENIE_DEFAULTS$c2, _OBUCHENIE_DEFAULTS$c3, _OBUCHENIE_DEFAULTS$c4, _OBUCHENIE_DEFAULTS$c5, _OBUCHENIE_DEFAULTS$c6, _OBUCHENIE_DEFAULTS$c7, _OBUCHENIE_DEFAULTS$c8, _OBUCHENIE_DEFAULTS$c9;
        return {
          title: (card === null || card === void 0 ? void 0 : card.title) || ((_OBUCHENIE_DEFAULTS$c = OBUCHENIE_DEFAULTS.courseCards[i]) === null || _OBUCHENIE_DEFAULTS$c === void 0 ? void 0 : _OBUCHENIE_DEFAULTS$c.title) || '',
          price: (card === null || card === void 0 ? void 0 : card.price) || ((_OBUCHENIE_DEFAULTS$c2 = OBUCHENIE_DEFAULTS.courseCards[i]) === null || _OBUCHENIE_DEFAULTS$c2 === void 0 ? void 0 : _OBUCHENIE_DEFAULTS$c2.price) || '',
          durationNum: (card === null || card === void 0 ? void 0 : card.durationNum) || ((_OBUCHENIE_DEFAULTS$c3 = OBUCHENIE_DEFAULTS.courseCards[i]) === null || _OBUCHENIE_DEFAULTS$c3 === void 0 ? void 0 : _OBUCHENIE_DEFAULTS$c3.durationNum) || '',
          durationUnit: (card === null || card === void 0 ? void 0 : card.durationUnit) || ((_OBUCHENIE_DEFAULTS$c4 = OBUCHENIE_DEFAULTS.courseCards[i]) === null || _OBUCHENIE_DEFAULTS$c4 === void 0 ? void 0 : _OBUCHENIE_DEFAULTS$c4.durationUnit) || '',
          scheduleNum: (card === null || card === void 0 ? void 0 : card.scheduleNum) || ((_OBUCHENIE_DEFAULTS$c5 = OBUCHENIE_DEFAULTS.courseCards[i]) === null || _OBUCHENIE_DEFAULTS$c5 === void 0 ? void 0 : _OBUCHENIE_DEFAULTS$c5.scheduleNum) || '',
          scheduleUnit: (card === null || card === void 0 ? void 0 : card.scheduleUnit) || ((_OBUCHENIE_DEFAULTS$c6 = OBUCHENIE_DEFAULTS.courseCards[i]) === null || _OBUCHENIE_DEFAULTS$c6 === void 0 ? void 0 : _OBUCHENIE_DEFAULTS$c6.scheduleUnit) || '',
          btnText: (card === null || card === void 0 ? void 0 : card.btnText) || ((_OBUCHENIE_DEFAULTS$c7 = OBUCHENIE_DEFAULTS.courseCards[i]) === null || _OBUCHENIE_DEFAULTS$c7 === void 0 ? void 0 : _OBUCHENIE_DEFAULTS$c7.btnText) || 'Записаться',
          btnLink: (card === null || card === void 0 ? void 0 : card.btnLink) || ((_OBUCHENIE_DEFAULTS$c8 = OBUCHENIE_DEFAULTS.courseCards[i]) === null || _OBUCHENIE_DEFAULTS$c8 === void 0 ? void 0 : _OBUCHENIE_DEFAULTS$c8.btnLink) || '#contacts',
          moreLink: (card === null || card === void 0 ? void 0 : card.moreLink) || ((_OBUCHENIE_DEFAULTS$c9 = OBUCHENIE_DEFAULTS.courseCards[i]) === null || _OBUCHENIE_DEFAULTS$c9 === void 0 ? void 0 : _OBUCHENIE_DEFAULTS$c9.moreLink) || '#courses'
        };
      }) : OBUCHENIE_DEFAULTS.courseCards.map(function (card) {
        return _objectSpread({}, card);
      }),
      courseRegistry: courseRegistry,
      testingBanner: {
        title: (raw === null || raw === void 0 || (_raw$testingBanner = raw.testingBanner) === null || _raw$testingBanner === void 0 ? void 0 : _raw$testingBanner.title) || OBUCHENIE_DEFAULTS.testingBanner.title,
        titleColor: (raw === null || raw === void 0 || (_raw$testingBanner2 = raw.testingBanner) === null || _raw$testingBanner2 === void 0 ? void 0 : _raw$testingBanner2.titleColor) || '',
        titleTop: raw === null || raw === void 0 || (_raw$testingBanner3 = raw.testingBanner) === null || _raw$testingBanner3 === void 0 ? void 0 : _raw$testingBanner3.titleTop,
        titleLeft: raw === null || raw === void 0 || (_raw$testingBanner4 = raw.testingBanner) === null || _raw$testingBanner4 === void 0 ? void 0 : _raw$testingBanner4.titleLeft,
        titleFontSize: (raw === null || raw === void 0 || (_raw$testingBanner5 = raw.testingBanner) === null || _raw$testingBanner5 === void 0 ? void 0 : _raw$testingBanner5.titleFontSize) || '',
        titleFontWeight: (raw === null || raw === void 0 || (_raw$testingBanner6 = raw.testingBanner) === null || _raw$testingBanner6 === void 0 ? void 0 : _raw$testingBanner6.titleFontWeight) || '',
        titleItalic: (raw === null || raw === void 0 || (_raw$testingBanner7 = raw.testingBanner) === null || _raw$testingBanner7 === void 0 ? void 0 : _raw$testingBanner7.titleItalic) || false,
        titleUnderline: (raw === null || raw === void 0 || (_raw$testingBanner8 = raw.testingBanner) === null || _raw$testingBanner8 === void 0 ? void 0 : _raw$testingBanner8.titleUnderline) || false,
        btnText: (raw === null || raw === void 0 || (_raw$testingBanner9 = raw.testingBanner) === null || _raw$testingBanner9 === void 0 ? void 0 : _raw$testingBanner9.btnText) || OBUCHENIE_DEFAULTS.testingBanner.btnText,
        btnLink: (raw === null || raw === void 0 || (_raw$testingBanner0 = raw.testingBanner) === null || _raw$testingBanner0 === void 0 ? void 0 : _raw$testingBanner0.btnLink) || OBUCHENIE_DEFAULTS.testingBanner.btnLink,
        btnBottom: raw === null || raw === void 0 || (_raw$testingBanner1 = raw.testingBanner) === null || _raw$testingBanner1 === void 0 ? void 0 : _raw$testingBanner1.btnBottom,
        btnLeft: raw === null || raw === void 0 || (_raw$testingBanner10 = raw.testingBanner) === null || _raw$testingBanner10 === void 0 ? void 0 : _raw$testingBanner10.btnLeft,
        image: (raw === null || raw === void 0 || (_raw$testingBanner11 = raw.testingBanner) === null || _raw$testingBanner11 === void 0 ? void 0 : _raw$testingBanner11.image) || OBUCHENIE_DEFAULTS.testingBanner.image
      }
    };
  }
  var enrollModalInitialized = false;
  var activeCourseRegistry = [];
  function setEnrollFormStatus(message, type) {
    var statusEl = document.getElementById('enroll-form-status');
    if (!statusEl) return;
    if (!message) {
      statusEl.hidden = true;
      statusEl.textContent = '';
      statusEl.className = 'enroll-modal__status';
      return;
    }
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.className = "enroll-modal__status enroll-modal__status--".concat(type || 'info');
  }
  function submitEnrollToBitrix(_x5) {
    return _submitEnrollToBitrix.apply(this, arguments);
  }
  function _submitEnrollToBitrix() {
    _submitEnrollToBitrix = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(form) {
      var _form$dataset2, _document$getElementB7, _sourceSelect$selecte, _document$getElementB8, _document$getElementB9, _document$getElementB0, _document$getElementB1;
      var courseId, course, audienceType, sourceSelect, sourceValue, sourceLabel, name, phone, email, company, response, result;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            courseId = (form === null || form === void 0 || (_form$dataset2 = form.dataset) === null || _form$dataset2 === void 0 ? void 0 : _form$dataset2.courseId) || '';
            course = activeCourseRegistry.find(function (item) {
              return item.id === courseId;
            });
            audienceType = ((_document$getElementB7 = document.getElementById('enroll-audience-type')) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.value) === 'legal' ? 'legal' : 'individual';
            sourceSelect = document.getElementById('enroll-source');
            sourceValue = (sourceSelect === null || sourceSelect === void 0 ? void 0 : sourceSelect.value) || '';
            sourceLabel = (sourceSelect === null || sourceSelect === void 0 || (_sourceSelect$selecte = sourceSelect.selectedOptions) === null || _sourceSelect$selecte === void 0 || (_sourceSelect$selecte = _sourceSelect$selecte[0]) === null || _sourceSelect$selecte === void 0 || (_sourceSelect$selecte = _sourceSelect$selecte.text) === null || _sourceSelect$selecte === void 0 ? void 0 : _sourceSelect$selecte.trim()) || '';
            name = ((_document$getElementB8 = document.getElementById('enroll-name')) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.value.trim()) || '';
            phone = ((_document$getElementB9 = document.getElementById('enroll-phone')) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.value.trim()) || '';
            email = ((_document$getElementB0 = document.getElementById('enroll-email')) === null || _document$getElementB0 === void 0 ? void 0 : _document$getElementB0.value.trim()) || '';
            company = ((_document$getElementB1 = document.getElementById('enroll-company')) === null || _document$getElementB1 === void 0 ? void 0 : _document$getElementB1.value.trim()) || '';
            if (!(!name || !phone)) {
              _context7.n = 1;
              break;
            }
            throw new Error('Заполните имя и телефон');
          case 1:
            _context7.n = 2;
            return fetch('api/bitrix-lead-enroll.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: name,
                phone: phone,
                email: email,
                company: company,
                audienceType: audienceType,
                source: sourceValue,
                sourceLabel: sourceLabel,
                courseTitle: (course === null || course === void 0 ? void 0 : course.title) || '',
                dateFrom: (course === null || course === void 0 ? void 0 : course.dateFrom) || '',
                dateTo: (course === null || course === void 0 ? void 0 : course.dateTo) || '',
                durationDays: (course === null || course === void 0 ? void 0 : course.durationDays) || 1,
                format: (course === null || course === void 0 ? void 0 : course.format) || 'och',
                price: (course === null || course === void 0 ? void 0 : course.price) || '',
                bitrixCourseElementId: (course === null || course === void 0 ? void 0 : course.bitrixCourseElementId) || null,
                forCustomers: Boolean(course === null || course === void 0 ? void 0 : course.forCustomers),
                forSuppliers: Boolean(course === null || course === void 0 ? void 0 : course.forSuppliers),
                is44fz: Boolean(course === null || course === void 0 ? void 0 : course.is44fz),
                is223fz: Boolean(course === null || course === void 0 ? void 0 : course.is223fz),
                options: Array.isArray(course === null || course === void 0 ? void 0 : course.options) ? course.options : []
              })
            });
          case 2:
            response = _context7.v;
            _context7.n = 3;
            return response.json().catch(function () {
              return {};
            });
          case 3:
            result = _context7.v;
            if (!(!response.ok || !result.success)) {
              _context7.n = 4;
              break;
            }
            throw new Error(result.error || 'Не удалось отправить заявку в Bitrix24');
          case 4:
            return _context7.a(2, result);
        }
      }, _callee7);
    }));
    return _submitEnrollToBitrix.apply(this, arguments);
  }
  function setEnrollAudienceMode(mode) {
    var audienceInput = document.getElementById('enroll-audience-type');
    var companyField = document.getElementById('enroll-company-field');
    var companyInput = document.getElementById('enroll-company');
    var labels = document.querySelectorAll('[data-audience-label]');
    var normalizedMode = mode === 'legal' ? 'legal' : 'individual';
    if (audienceInput) audienceInput.value = normalizedMode;
    labels.forEach(function (label) {
      label.classList.toggle('enroll-modal__audience-label--active', label.dataset.audienceLabel === normalizedMode);
    });
    if (companyField && companyInput) {
      var isLegal = normalizedMode === 'legal';
      companyField.hidden = !isLegal;
      companyInput.required = isLegal;
      if (!isLegal) companyInput.value = '';
    }
  }
  function configureEnrollModalAudience(options) {
    var forIndividuals = (options === null || options === void 0 ? void 0 : options.forIndividuals) !== false;
    var forLegalEntities = (options === null || options === void 0 ? void 0 : options.forLegalEntities) !== false;
    var switchWrap = document.getElementById('enroll-audience-switch');
    var toggle = document.getElementById('enroll-audience-toggle');
    if (switchWrap) {
      switchWrap.hidden = !(forIndividuals && forLegalEntities);
    }
    var mode = 'individual';
    if (!forIndividuals && forLegalEntities) {
      mode = 'legal';
    } else if (forIndividuals && !forLegalEntities) {
      mode = 'individual';
    } else if (toggle) {
      mode = toggle.checked ? 'legal' : 'individual';
    }
    if (toggle) toggle.checked = mode === 'legal';
    setEnrollAudienceMode(mode);
  }
  function openEnrollModal(_x6) {
    return _openEnrollModal.apply(this, arguments);
  }
  function _openEnrollModal() {
    _openEnrollModal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(options) {
      var modal, titleEl, dateEl, form, calendarModal;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            modal = document.getElementById('enroll-modal');
            if (modal) {
              _context8.n = 1;
              break;
            }
            return _context8.a(2);
          case 1:
            titleEl = document.getElementById('enroll-modal-title');
            dateEl = document.getElementById('enroll-modal-date');
            form = document.getElementById('enroll-form');
            if (titleEl) titleEl.textContent = (options === null || options === void 0 ? void 0 : options.title) || '';
            if (dateEl) dateEl.textContent = (options === null || options === void 0 ? void 0 : options.date) || '';
            if (form) {
              form.dataset.courseId = (options === null || options === void 0 ? void 0 : options.courseId) || '';
            }
            setEnrollFormStatus('');
            configureEnrollModalAudience({
              forIndividuals: options === null || options === void 0 ? void 0 : options.forIndividuals,
              forLegalEntities: options === null || options === void 0 ? void 0 : options.forLegalEntities
            });
            calendarModal = document.getElementById('calendar-course-modal');
            if (calendarModal && calendarModal.style.display !== 'none') {
              calendarModal.style.display = 'none';
            }
            modal.style.display = 'flex';
            _context8.n = 2;
            return refreshEnrollBitrixView();
          case 2:
            return _context8.a(2);
        }
      }, _callee8);
    }));
    return _openEnrollModal.apply(this, arguments);
  }
  function setupEnrollModal() {
    if (enrollModalInitialized) return;
    enrollModalInitialized = true;
    var modal = document.getElementById('enroll-modal');
    if (!modal) return;
    var closeBtn = modal.querySelector('.calendar-modal__close');
    var overlay = modal.querySelector('.calendar-modal__overlay');
    var form = document.getElementById('enroll-form');
    var audienceToggle = document.getElementById('enroll-audience-toggle');
    function closeEnrollModal() {
      modal.style.display = 'none';
      if (form) {
        form.reset();
        delete form.dataset.courseId;
      }
      clearBitrixEnrollEmbed();
      setEnrollFormStatus('');
      configureEnrollModalAudience({
        forIndividuals: true,
        forLegalEntities: true
      });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeEnrollModal);
    if (overlay) overlay.addEventListener('click', closeEnrollModal);
    if (audienceToggle) {
      audienceToggle.addEventListener('change', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              setEnrollAudienceMode(audienceToggle.checked ? 'legal' : 'individual');
              _context.n = 1;
              return refreshEnrollBitrixView();
            case 1:
              return _context.a(2);
          }
        }, _callee);
      })));
    }
    document.addEventListener('click', function (e) {
      var detailBtn = e.target.closest('[data-action="course-detail"]');
      if (detailBtn) {
        var _window$ObuchenieCale;
        e.preventDefault();
        var courseId = detailBtn.getAttribute('data-course-id') || '';
        var course = activeCourseRegistry.find(function (item) {
          return item.id === courseId;
        });
        if (course && (_window$ObuchenieCale = window.ObuchenieCalendar) !== null && _window$ObuchenieCale !== void 0 && _window$ObuchenieCale.openCourseDetailModal) {
          window.ObuchenieCalendar.openCourseDetailModal(course);
        }
        return;
      }
      var btn = e.target.closest('[data-action="enroll"]');
      if (!btn) return;
      e.preventDefault();
      openEnrollModal({
        title: btn.getAttribute('data-title') || '',
        date: btn.getAttribute('data-date') || '',
        courseId: btn.getAttribute('data-course-id') || '',
        forIndividuals: btn.getAttribute('data-for-individuals') !== 'false',
        forLegalEntities: btn.getAttribute('data-for-legal') !== 'false'
      });
    });
    if (form) {
      var submitBtn = form.querySelector('.enroll-modal__submit');
      form.addEventListener('submit', /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(e) {
          var originalText, result, _t;
          return _regenerator().w(function (_context2) {
            while (1) switch (_context2.p = _context2.n) {
              case 0:
                e.preventDefault();
                if (!form.hidden) {
                  _context2.n = 1;
                  break;
                }
                return _context2.a(2);
              case 1:
                setEnrollFormStatus('');
                originalText = (submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.textContent) || 'Отправить';
                if (submitBtn) {
                  submitBtn.disabled = true;
                  submitBtn.textContent = 'Отправка…';
                }
                _context2.p = 2;
                _context2.n = 3;
                return submitEnrollToBitrix(form);
              case 3:
                result = _context2.v;
                setEnrollFormStatus(result.message || 'Заявка принята', 'success');
                window.setTimeout(closeEnrollModal, 2200);
                _context2.n = 5;
                break;
              case 4:
                _context2.p = 4;
                _t = _context2.v;
                setEnrollFormStatus(_t.message || 'Ошибка отправки', 'error');
              case 5:
                _context2.p = 5;
                if (submitBtn) {
                  submitBtn.disabled = false;
                  submitBtn.textContent = originalText;
                }
                return _context2.f(5);
              case 6:
                return _context2.a(2);
            }
          }, _callee2, null, [[2, 4, 5, 6]]);
        }));
        return function (_x7) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }
  function markObuchenieContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }
  function loadObuchenieDataFromLocal() {
    try {
      var local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateObucheniePageData(JSON.parse(local));
    } catch (error) {
      console.warn('Obuchenie: localStorage parse error', error);
    }
    return null;
  }
  function loadObuchenieDataFromApi() {
    return _loadObuchenieDataFromApi.apply(this, arguments);
  }
  function _loadObuchenieDataFromApi() {
    _loadObuchenieDataFromApi = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
      var resp, data, _t4;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.p = _context9.n) {
          case 0:
            _context9.p = 0;
            _context9.n = 1;
            return fetch("api/settings.php?key=".concat(STORAGE_KEY));
          case 1:
            resp = _context9.v;
            if (!resp.ok) {
              _context9.n = 3;
              break;
            }
            _context9.n = 2;
            return resp.json();
          case 2:
            data = _context9.v;
            if (!(data && _typeof(data) === 'object' && Object.keys(data).length)) {
              _context9.n = 3;
              break;
            }
            return _context9.a(2, migrateObucheniePageData(data));
          case 3:
            _context9.n = 5;
            break;
          case 4:
            _context9.p = 4;
            _t4 = _context9.v;
            console.warn('Obuchenie: API unavailable', _t4);
          case 5:
            return _context9.a(2, null);
        }
      }, _callee9, null, [[0, 4]]);
    }));
    return _loadObuchenieDataFromApi.apply(this, arguments);
  }
  function applyTypographyStyles(el, size, weight, italic, underline) {
    if (!el) return;
    if (size) {
      el.style.fontSize = "clamp(calc(".concat(size, "px * 0.5), calc(").concat(size, "px * (100cqw / 1520)), ").concat(size, "px)");
    } else {
      el.style.removeProperty('font-size');
    }
    if (weight) el.style.fontWeight = weight;else el.style.removeProperty('font-weight');
    if (italic) el.style.fontStyle = 'italic';else el.style.fontStyle = 'normal';
    if (underline) el.style.textDecoration = 'underline';else el.style.removeProperty('text-decoration');
  }
  function renderHero(data) {
    var _pageData$heroSlides, _window$HeroSlides;
    var heroWrapper = document.querySelector('.obuchenie-hero');
    if (heroWrapper) heroWrapper.style.containerType = 'inline-size';
    var pageData = migrateObucheniePageData(data || {});
    var slides = (_pageData$heroSlides = pageData.heroSlides) !== null && _pageData$heroSlides !== void 0 && _pageData$heroSlides.length ? pageData.heroSlides : ((_window$HeroSlides = window.HeroSlides) === null || _window$HeroSlides === void 0 ? void 0 : _window$HeroSlides.migrateHeroSlides({
      hero: pageData === null || pageData === void 0 ? void 0 : pageData.hero
    }, OBUCHENIE_HERO_SLIDE_DEFAULTS)) || [];
    var renderer = getObuchenieHeroRenderer();
    if (renderer) {
      var _pageData$hero;
      renderer.render(slides, {
        gavelImage: pageData === null || pageData === void 0 || (_pageData$hero = pageData.hero) === null || _pageData$hero === void 0 ? void 0 : _pageData$hero.gavelImage
      });
    }
  }
  function renderNavCards(navCards) {
    var grid = document.querySelector('.obuchenie-nav-cards');
    if (!grid) return;
    var list = navCards !== null && navCards !== void 0 && navCards.length ? navCards : OBUCHENIE_DEFAULTS.navCards;
    grid.innerHTML = list.map(function (card) {
      var href = escapeHtml((card.href || '#').trim() || '#');
      var icon = escapeAttr((card.icon || '').trim() || 'assets/img/obuchenie/icon-programs.png?v=2');
      return "<a href=\"".concat(href, "\" class=\"ecp-card\">\n          <div class=\"ecp-card__icon-wrap\">\n            <img src=\"").concat(icon, "\" alt=\"\" class=\"ecp-card__icon\" width=\"118\" height=\"149\" decoding=\"async\">\n          </div>\n          <div class=\"ecp-card__label\">").concat(multilineHtml(card.label), "</div>\n        </a>");
    }).join('');
  }
  function renderCourseSearch(courseSearch) {
    var _data$tags;
    var data = courseSearch || OBUCHENIE_DEFAULTS.courseSearch;
    var titleEl = document.querySelector('.obuchenie-course-search__title');
    var ctaEl = document.querySelector('.obuchenie-course-search-panel__cta');
    var phoneEl = document.querySelector('.obuchenie-course-search-panel__phone');
    var tagsEl = document.querySelector('.obuchenie-course-search-tags');
    if (titleEl) titleEl.textContent = data.title || OBUCHENIE_DEFAULTS.courseSearch.title;
    if (ctaEl) ctaEl.textContent = data.cta || OBUCHENIE_DEFAULTS.courseSearch.cta;
    if (phoneEl) {
      var phone = (data.phone || OBUCHENIE_DEFAULTS.courseSearch.phone).replace(/\D/g, '');
      phoneEl.href = phone ? "tel:".concat(phone) : '#';
      phoneEl.textContent = data.phoneDisplay || OBUCHENIE_DEFAULTS.courseSearch.phoneDisplay;
    }

    // Render dynamic select dropdown filters
    var filtersEl = document.querySelector('.obuchenie-course-search-panel__filters');
    if (filtersEl && Array.isArray(data.blocks)) {
      filtersEl.innerHTML = data.blocks.map(function (block) {
        var title = escapeHtml(block.title);
        var isWide = block.title.length > 20 ? ' csr-dropdown--wide' : '';
        var optionsHtml = Array.isArray(block.values) ? block.values.map(function (val) {
          return "<button type=\"button\" class=\"csr-dropdown__option\" data-value=\"".concat(escapeAttr(val), "\" role=\"option\">").concat(escapeHtml(val), "</button>");
        }).join('') : '';
        return "\n            <div class=\"csr-dropdown".concat(isWide, "\" data-value=\"\" aria-label=\"").concat(escapeAttr(block.title), "\">\n              <button type=\"button\" class=\"csr-dropdown__trigger\" aria-haspopup=\"listbox\" aria-expanded=\"false\">\n                <span class=\"csr-dropdown__label\">").concat(title, "</span>\n                <svg class=\"csr-dropdown__chevron\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polyline points=\"6 9 12 15 18 9\"/></svg>\n              </button>\n              <div class=\"csr-dropdown__panel\" role=\"listbox\">\n                ").concat(optionsHtml, "\n              </div>\n            </div>");
      }).join('');
      if (typeof window.initDropdowns === 'function') {
        window.initDropdowns();
      }
    }
    if (!tagsEl) return;
    var tags = (_data$tags = data.tags) !== null && _data$tags !== void 0 && _data$tags.length ? data.tags : OBUCHENIE_DEFAULTS.courseSearch.tags;
    var showAll = data.showAllLabel || OBUCHENIE_DEFAULTS.courseSearch.showAllLabel;
    var rows = [];
    for (var i = 0; i < tags.length; i += 7) {
      rows.push(tags.slice(i, i + 7));
    }
    if (!rows.length) rows.push([]);
    tagsEl.innerHTML = rows.map(function (row, index) {
      var isLast = index === rows.length - 1;
      var rowClass = isLast ? ' obuchenie-course-search-tags__row--last' : '';
      var cells = row.map(function (tag) {
        return "<button type=\"button\" class=\"obuchenie-course-search-tag\">".concat(escapeHtml(tag), "</button>");
      }).join('');
      var moreBtn = isLast ? "<button type=\"button\" class=\"obuchenie-course-search-tag obuchenie-course-search-tag--more\">".concat(escapeHtml(showAll), "</button>") : '';
      return "<div class=\"obuchenie-course-search-tags__row".concat(rowClass, "\">").concat(cells).concat(moreBtn, "</div>");
    }).join('');
  }
  function renderCalendar(calendar, courseRegistry) {
    var _window$ObuchenieCale2;
    var data = calendar || OBUCHENIE_DEFAULTS.calendar;
    var courseDaysByMonth = resolveCalendarCourseDays(data, courseRegistry);
    var promoEl = document.querySelector('.obuchenie-calendar-promo');
    var titleEl = document.querySelector('.obuchenie-calendar-promo__title');
    var imageEl = document.querySelector('.obuchenie-calendar-promo__image');
    var allLinkEl = document.querySelector('.obuchenie-calendar-block__all');
    var promoImage = (data.promoImage || OBUCHENIE_DEFAULTS.calendar.promoImage || '').trim();
    if (titleEl) {
      titleEl.innerHTML = multilineHtml(data.promoTitle || OBUCHENIE_DEFAULTS.calendar.promoTitle);
      titleEl.style.color = data.promoTitleColor || OBUCHENIE_DEFAULTS.calendar.promoTitleColor;
    }
    if (imageEl && promoImage) {
      imageEl.src = promoImage;
    }
    if (promoEl) {
      promoEl.classList.toggle('obuchenie-calendar-promo--has-image', Boolean(promoImage));
      var promoLink = (data.promoLink || '').trim();
      if (promoLink) {
        promoEl.href = promoLink;
        promoEl.style.cursor = 'pointer';
      } else {
        promoEl.removeAttribute('href');
        promoEl.style.cursor = 'default';
      }
    }
    if (allLinkEl) {
      var link = (data.allCoursesLink || '#courses').trim() || '#courses';
      allLinkEl.href = link;
      if (link.startsWith('uploads/')) {
        allLinkEl.setAttribute('download', '');
        allLinkEl.setAttribute('target', '_blank');
      } else {
        allLinkEl.removeAttribute('download');
        allLinkEl.removeAttribute('target');
      }
    }
    if ((_window$ObuchenieCale2 = window.ObuchenieCalendar) !== null && _window$ObuchenieCale2 !== void 0 && _window$ObuchenieCale2.setCourseDays) {
      window.ObuchenieCalendar.setCourseDays(courseDaysByMonth);
    }
  }
  var MONTH_NAMES_GENITIVE_RU = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var MONTH_NAMES_NOMINATIVE_RU = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
  function formatUpcomingEventDate(range, course) {
    if (!range) {
      if (course && (course.dateFrom || course.date)) {
        return {
          range: String(course.dateFrom || course.date),
          month: ''
        };
      }
      return {
        range: '—',
        month: ''
      };
    }
    var start = range.from;
    var end = range.to;
    var startDay = start.getDate();
    var endDay = end.getDate();
    if (startDay === endDay) {
      return {
        range: String(startDay),
        month: MONTH_NAMES_NOMINATIVE_RU[start.getMonth()]
      };
    }
    var sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    if (sameMonth) {
      return {
        range: "".concat(startDay, "\u2013").concat(endDay),
        month: MONTH_NAMES_NOMINATIVE_RU[start.getMonth()]
      };
    }
    return {
      range: "".concat(startDay, "\u2013").concat(endDay),
      month: "".concat(MONTH_NAMES_NOMINATIVE_RU[start.getMonth()], "\u2013").concat(MONTH_NAMES_NOMINATIVE_RU[end.getMonth()])
    };
  }
  function getUpcomingCourses(courseRegistry) {
    var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
    var today = new Date();
    var todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var activeCourses = (courseRegistry || []).filter(function (course) {
      return course && course.active !== false;
    });
    var expanded = [];
    activeCourses.forEach(function (course) {
      var ranges = getCourseDateRanges(course);
      if (!ranges.length) {
        expanded.push({ course: course, startDate: new Date(2099, 11, 31), range: null });
      } else {
        ranges.forEach(function (range) {
          expanded.push({ course: course, startDate: range.from, range: range });
        });
      }
    });
    var upcoming = expanded.filter(function (item) {
      return item.startDate >= todayZero;
    });
    var listToUse = upcoming.length > 0 ? upcoming : expanded;
    listToUse.sort(function (a, b) {
      return a.startDate - b.startDate;
    });
    return listToUse.slice(0, limit);
  }
  function renderLandingUpcomingEvents(courseRegistry, options) {
    var list = document.getElementById('landingUpcomingEvents');
    if (!list) return;
    activeCourseRegistry = Array.isArray(courseRegistry) ? courseRegistry : [];
    setupEnrollModal();
    var limit = (options === null || options === void 0 ? void 0 : options.limit) || 4;
    var upcoming = getUpcomingCourses(courseRegistry, limit);
    list.innerHTML = upcoming.map(function (item) {
      var course = item.course;
      var _formatUpcomingEventD = formatUpcomingEventDate(item.range, course),
        range = _formatUpcomingEventD.range,
        month = _formatUpcomingEventD.month;
      var monthHtml = month ? "<span class=\"event-date__month\">".concat(escapeHtml(month), "</span>") : '';
      var detailAttrs = buildCourseDetailAttrs(course);
      return "<li class=\"events-list__item\">\n          <a href=\"courses/".concat(escapeHtml(course.id), ".html\" class=\"events-list__btn\">\n            <div class=\"event-date\"><span class=\"event-date__range\">").concat(escapeHtml(range), "</span>").concat(monthHtml, "</div>\n            <div class=\"event-desc\">").concat(escapeHtml(course.title), "</div>\n          </a>\n        </li>");
    }).join('');
    var allLink = document.getElementById('landingAllEventsLink');
    if (allLink) {
      var _window$CrzrtZoomSync, _window$CrzrtZoomSync2;
      allLink.href = 'obuchenie.html#schedule';
      (_window$CrzrtZoomSync = window.CrzrtZoomSync) === null || _window$CrzrtZoomSync === void 0 || (_window$CrzrtZoomSync2 = _window$CrzrtZoomSync.prepareInternalLink) === null || _window$CrzrtZoomSync2 === void 0 || _window$CrzrtZoomSync2.call(_window$CrzrtZoomSync, allLink);
    }
  }
  function formatDaysPlural(days) {
    var d = parseInt(days, 10) || 1;
    var mod10 = d % 10;
    var mod100 = d % 100;
    if (mod10 === 1 && mod100 !== 11) {
      return 'день';
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
      return 'дня';
    } else {
      return 'дней';
    }
  }
  function buildEnrollAttrs(course, dateLabel) {
    var forIndividuals = course.forIndividuals !== false;
    var forLegal = course.forLegalEntities !== false;
    return "data-action=\"enroll\" data-course-id=\"".concat(escapeAttr(course.id), "\" data-title=\"").concat(escapeAttr(course.title || ''), "\" data-date=\"").concat(escapeAttr(dateLabel), "\" data-for-individuals=\"").concat(forIndividuals ? 'true' : 'false', "\" data-for-legal=\"").concat(forLegal ? 'true' : 'false', "\"");
  }
  function buildCourseDetailAttrs(course) {
    return "data-action=\"course-detail\" data-course-id=\"".concat(escapeAttr(course.id), "\"");
  }
  function renderCourseCards(courseCards, courseRegistry) {
    var grid = document.querySelector('.obuchenie-course-cards');
    if (!grid) return;

    // Filter active courses
    var activeCourses = (courseRegistry || []).filter(function (c) {
      return c && c.active !== false;
    });

    // If we have no active courses in the registry at all (empty DB), fallback to default mock cards
    if (activeCourses.length === 0) {
      var mockList = OBUCHENIE_DEFAULTS.courseCards;
      grid.innerHTML = mockList.map(function (card) {
        var btnHref = escapeHtml((card.btnLink || '#contacts').trim() || '#contacts');
        var moreHref = escapeHtml((card.moreLink || '#courses').trim() || '#courses');
        var price = escapeHtml(card.price || '');
        return "<article class=\"occ-card\">\n            <div class=\"occ-card__top\" style=\"flex-grow: 1; margin-bottom: auto;\">\n              <h3 class=\"occ-card__title\">".concat(escapeHtml(card.title), "</h3>\n              <p class=\"occ-card__price\">").concat(price.replace(/ /g, '&nbsp;'), "</p>\n            </div>\n            <div class=\"occ-card__stats\" style=\"margin-top: 0;\">\n              <div class=\"occ-card__stat\">\n                <span class=\"occ-card__stat-label\">\u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C</span>\n                <div class=\"occ-card__stat-value\">\n                  <span class=\"occ-card__stat-num\">").concat(escapeHtml(card.durationNum), "</span>\n                  <span class=\"occ-card__stat-unit\">").concat(escapeHtml(card.durationUnit), "</span>\n                </div>\n              </div>\n              <div class=\"occ-card__stat-divider\"></div>\n              <div class=\"occ-card__stat\">\n                <span class=\"occ-card__stat-label\">\u0433\u0440\u0430\u0444\u0438\u043A \u0437\u0430\u043D\u044F\u0442\u0438\u0439</span>\n                <div class=\"occ-card__stat-value\">\n                  <span class=\"occ-card__stat-num\">").concat(escapeHtml(card.scheduleNum), "</span>\n                  <span class=\"occ-card__stat-unit\">").concat(escapeHtml(card.scheduleUnit), "</span>\n                </div>\n              </div>\n            </div>\n            <a href=\"").concat(btnHref, "\" class=\"occ-card__btn\">").concat(escapeHtml(card.btnText || 'Записаться'), "</a>\n            <a href=\"").concat(moreHref, "\" class=\"occ-card__more\">\u043F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 ").concat(MORE_ARROW_SVG, "</a>\n          </article>");
      }).join('');
      return;
    }

    // Map and calculate dates for sorting
    var today = new Date();
    var todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var mapped = [];
    activeCourses.forEach(function (course) {
      var ranges = getCourseDateRanges(course);
      if (!ranges.length) {
        mapped.push({ course: course, startDate: new Date(2099, 11, 31), range: null });
      } else {
        ranges.forEach(function (range) {
          mapped.push({ course: course, startDate: range.from, range: range });
        });
      }
    });

    // Only upcoming courses! (start date must be today or in the future)
    var upcoming = mapped.filter(function (item) {
      return item.startDate >= todayZero;
    });

    var listToRender = upcoming.length > 0 ? upcoming : mapped;

    // Sort ascending (closest first)
    listToRender.sort(function (a, b) {
      return a.startDate - b.startDate;
    });

    // Take top 3
    var top3 = listToRender.slice(0, 3);

    // If there are no upcoming courses (all are in the past), render empty grid
    if (top3.length === 0) {
      grid.innerHTML = '';
      return;
    }
    grid.innerHTML = top3.map(function (item) {
      var c = item.course;
      var start = item.startDate;

      // Format price (fallback to empty)
      var price = escapeHtml(c.price || '').trim();
      var priceHtml = price ? "<p class=\"occ-card__price\">".concat(price.replace(/ /g, '&nbsp;'), "</p>") : '<p class="occ-card__price">&nbsp;</p>';

      // Format duration
      var durDays = c.durationDays || 1;
      var durUnit = formatDaysPlural(durDays);

      // Format start date
      var startDay = start.getFullYear() === 2099 ? '—' : String(start.getDate());
      var startMonth = start.getFullYear() === 2099 ? '' : MONTH_NAMES_GENITIVE_RU[start.getMonth()];
      var dateLabel = start.getFullYear() === 2099 ? '' : "".concat(startDay, " ").concat(startMonth, " ").concat(start.getFullYear());
      var enrollAttrs = buildEnrollAttrs(c, dateLabel);
      return `<article class="occ-card">
          <div class="occ-card__top" style="flex-grow: 1; margin-bottom: auto;">
            <h3 class="occ-card__title">${escapeHtml(c.title)}</h3>
            ${priceHtml}
          </div>
          <div class="occ-card__stats" style="margin-top: 0;">
            <div class="occ-card__stat">
              <span class="occ-card__stat-label">\u0441\u0442\u0430\u0440\u0442 \u043A\u0443\u0440\u0441\u0430</span>
              <div class="occ-card__stat-value">
                <span class="occ-card__stat-num">${startDay}</span>
                <span class="occ-card__stat-unit">${startMonth}</span>
              </div>
            </div>
            <div class="occ-card__stat-divider"></div>
            <div class="occ-card__stat">
              <span class="occ-card__stat-label">\u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C</span>
              <div class="occ-card__stat-value">
                <span class="occ-card__stat-num">${durDays}</span>
                <span class="occ-card__stat-unit">${durUnit}</span>
              </div>
            </div>
          </div>
          <a href="courses/${escapeHtml(c.id)}.html" class="occ-card__btn">\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F</a>
          <a href="courses/${escapeHtml(c.id)}.html" class="occ-card__more">\u043F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 ${MORE_ARROW_SVG}</a>
        </article>`;
    }).join('');
  }
  function renderTestingBanner(testingBanner) {
    var data = testingBanner || OBUCHENIE_DEFAULTS.testingBanner;
    var bannerEl = document.querySelector('.obuchenie-testing-banner');
    if (bannerEl) bannerEl.style.containerType = 'inline-size';
    var contentEl = document.querySelector('.obuchenie-testing-banner__content');
    var titleEl = document.querySelector('.obuchenie-testing-banner__title');
    var btnEl = document.querySelector('.obuchenie-testing-banner__btn');
    var imageEl = document.querySelector('.obuchenie-testing-banner__image');
    var image = (data.image || '').trim();
    var hasCustomLayout = data.titleTop !== undefined || data.titleLeft !== undefined || data.btnBottom !== undefined || data.btnLeft !== undefined;
    if (contentEl) {
      if (hasCustomLayout) {
        contentEl.style.position = 'absolute';
        contentEl.style.inset = '0';
        contentEl.style.padding = '0';
        contentEl.style.gap = '0';
        contentEl.style.justifyContent = 'flex-start';
      } else {
        contentEl.style.position = '';
        contentEl.style.inset = '';
        contentEl.style.padding = '';
        contentEl.style.gap = '';
        contentEl.style.justifyContent = '';
      }
    }
    if (titleEl) {
      titleEl.innerHTML = multilineHtml(data.title);
      if (data.titleColor) {
        titleEl.style.color = data.titleColor;
      } else {
        titleEl.style.color = '';
      }
      if (hasCustomLayout) {
        titleEl.style.position = 'absolute';
        titleEl.style.margin = '0';
        titleEl.style.top = "".concat(data.titleTop !== undefined ? data.titleTop : 68, "px");
        titleEl.style.left = "".concat(data.titleLeft !== undefined ? data.titleLeft : 60, "px");
        titleEl.style.width = 'auto';
        titleEl.style.maxWidth = "calc(100% - ".concat(data.titleLeft !== undefined ? data.titleLeft : 60, "px - 24px)");
      } else {
        titleEl.style.position = '';
        titleEl.style.top = '';
        titleEl.style.left = '';
        titleEl.style.maxWidth = '';
      }
      applyTypographyStyles(titleEl, data.titleFontSize, data.titleFontWeight, data.titleItalic, data.titleUnderline);
    }
    if (btnEl) {
      btnEl.textContent = data.btnText || OBUCHENIE_DEFAULTS.testingBanner.btnText;
      var btnLink = (data.btnLink || 'testing.html').trim();
      if (btnLink === '#contacts' || btnLink === '' || btnLink === '#') {
        btnLink = 'testing.html';
      }
      btnEl.href = btnLink;
      if (hasCustomLayout) {
        btnEl.style.position = 'absolute';
        btnEl.style.margin = '0';
        btnEl.style.bottom = "".concat(data.btnBottom !== undefined ? data.btnBottom : 65, "px");
        btnEl.style.left = "".concat(data.btnLeft !== undefined ? data.btnLeft : data.titleLeft !== undefined ? data.titleLeft : 60, "px");
        btnEl.style.top = 'auto';
      } else {
        btnEl.style.position = '';
        btnEl.style.margin = '';
        btnEl.style.bottom = '';
        btnEl.style.left = '';
        btnEl.style.top = '';
      }
    }
    if (imageEl) {
      if (image) {
        imageEl.src = image;
        imageEl.hidden = false;
      } else {
        imageEl.removeAttribute('src');
        imageEl.hidden = true;
      }
    }
    if (bannerEl) {
      bannerEl.classList.toggle('obuchenie-testing-banner--has-image', Boolean(image));
    }
  }
  function renderObucheniePage(data) {
    var isApi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    activeCourseRegistry = Array.isArray(data.courseRegistry) ? data.courseRegistry : [];
    renderHero(data);
    renderNavCards(data.navCards);
    renderCourseSearch(data.courseSearch);
    renderCalendar(data.calendar, data.courseRegistry);
    renderCourseCards(data.courseCards, data.courseRegistry);
    renderTestingBanner(data.testingBanner);
    setupEnrollModal();
    document.dispatchEvent(new CustomEvent('obuchenieContentReady', {
      detail: {
        data: data,
        isApi: isApi
      }
    }));
  }
  function initObuchenieContent() {
    return _initObuchenieContent.apply(this, arguments);
  }
  function _initObuchenieContent() {
    _initObuchenieContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
      var localData, initialData, apiData, _t5;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.p = _context0.n) {
          case 0:
            _context0.p = 0;
            localData = loadObuchenieDataFromLocal();
            initialData = localData || migrateObucheniePageData(null);
            renderObucheniePage(initialData, false);
            markObuchenieContentReady();
            _context0.n = 1;
            return loadObuchenieDataFromApi();
          case 1:
            apiData = _context0.v;
            if (apiData) {
              renderObucheniePage(apiData, true);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
              } catch (error) {
                console.warn('Obuchenie: localStorage update failed', error);
              }
            }
            _context0.n = 3;
            break;
          case 2:
            _context0.p = 2;
            _t5 = _context0.v;
            console.error('Obuchenie content init failed', _t5);
            markObuchenieContentReady();
          case 3:
            return _context0.a(2);
        }
      }, _callee0, null, [[0, 2]]);
    }));
    return _initObuchenieContent.apply(this, arguments);
  }
  window.ObuchenieContent = {
    STORAGE_KEY: STORAGE_KEY,
    OBUCHENIE_DEFAULTS: OBUCHENIE_DEFAULTS,
    MONTH_NAMES_RU: MONTH_NAMES_RU,
    migrateObucheniePageData: migrateObucheniePageData,
    normalizeCourseRegistry: normalizeCourseRegistry,
    normalizeCourseRegistryItem: normalizeCourseRegistryItem,
    normalizeCourseAudience: normalizeCourseAudience,
    deriveCourseDaysByMonth: deriveCourseDaysByMonth,
    resolveCalendarCourseDays: resolveCalendarCourseDays,
    getCourseDateRange: getCourseDateRange,
    getCourseDateRanges: getCourseDateRanges,
    createCourseId: createCourseId,
    parseIsoDate: parseIsoDate,
    formatIsoDate: formatIsoDate,
    parseBitrixFormRef: parseBitrixFormRef,
    formatBitrixFormRef: formatBitrixFormRef,
    normalizeBitrixForm: normalizeBitrixForm,
    fetchBitrixFormMeta: fetchBitrixFormMeta,
    enrichBitrixFormRef: enrichBitrixFormRef,
    getBitrixFieldMap: getBitrixFieldMap,
    configureEnrollModalAudience: configureEnrollModalAudience,
    openEnrollModal: openEnrollModal,
    setEnrollAudienceMode: setEnrollAudienceMode,
    loadObuchenieDataFromApi: loadObuchenieDataFromApi,
    loadObuchenieDataFromLocal: loadObuchenieDataFromLocal,
    renderObucheniePage: renderObucheniePage,
    getUpcomingCourses: getUpcomingCourses,
    formatUpcomingEventDate: formatUpcomingEventDate,
    renderLandingUpcomingEvents: renderLandingUpcomingEvents
  };
  if (isObucheniePage) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initObuchenieContent);
    } else {
      initObuchenieContent();
    }
  }
})();