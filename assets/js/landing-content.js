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
 * Контент главной страницы (лендинг) — загрузка из API / localStorage и отрисовка.
 */
(function () {
  var STORAGE_KEY = 'crzrt_main_page_data';
  var CONTENT_PENDING_CLASS = 'landing-content-pending';
  var CONTENT_READY_CLASS = 'landing-content-ready';
  var REVEAL_TIMEOUT_MS = 10000;
  var REVIEW_TEXT_MAX_LENGTH = 243;
  var promoBound = false;
  document.documentElement.classList.add(CONTENT_PENDING_CLASS);
  var LANDING_DEFAULTS = {
    heroSlides: [{
      title: 'Надежное тендерное\nсопровождение',
      titleColor: '#ffffff',
      titleTop: 122,
      titleLeft: 70,
      subtitle: 'Поиск выгодных закупок\nи оценка целесообразности участия',
      subtitleColor: '#ffffff',
      subtitleTop: 213,
      subtitleLeft: 70,
      background: 'assets/img/hero_section.png'
    }],
    serviceCards: [{
      title: 'Обучение',
      desc: 'Как зарабатывать на госзакупках и тендерах',
      link: 'obuchenie.html',
      variant: 'green',
      icon: 'assets/img/obuch.png'
    }, {
      title: 'Сопровождение',
      desc: 'Комплексная помощь экспертов на всех этапах закупок',
      link: 'support.html',
      variant: 'peach',
      icon: 'assets/img/sopr.png'
    }, {
      title: 'Юридический консалтинг',
      desc: 'Профессиональные консультационные услуги по правовым вопросам',
      link: 'consulting.html',
      variant: 'purple',
      icon: 'assets/img/u_k.png'
    }, {
      title: 'ЭТП',
      desc: 'Электронная торговая площадка',
      link: 'ecp.html',
      variant: 'blue',
      icon: 'assets/img/etp.png',
      external: false
    }],
    promoBanner: {
      title: 'Дистанционный курс\nпо 44 ФЗ для заказчиков',
      titleColor: '#ffffff',
      titleTop: 40,
      titleLeft: 80,
      titleFontSize: '50',
      titleFontWeight: '700',
      titleItalic: false,
      titleUnderline: false,
      date: '2-4 июня 2026 года',
      dateColor: '#ffffff',
      dateTop: 160,
      dateLeft: 80,
      dateFontSize: '25',
      dateFontWeight: '400',
      dateItalic: false,
      dateUnderline: false,
      link: '',
      image: 'assets/img/banner.png'
    },
    partners: [{
      alt: 'Партнер 1',
      image: 'assets/img/Group 303.png'
    }, {
      alt: 'Партнер 2',
      image: 'assets/img/Group 302.png'
    }, {
      alt: 'Партнер 3',
      image: 'assets/img/Group 304.png'
    }, {
      alt: 'Партнер 4',
      image: 'assets/img/Group 305.png'
    }, {
      alt: 'Партнер 5',
      image: 'assets/img/TNV.png'
    }],
    reviews: [{
      text: 'В целом Интерфейс понятный, удобный. Если нужны какие-то улучшения, Росэлторг их активно рассматривает. Не всегда, но движения в этом вопросе точно есть.',
      nameLines: ['Сергеев', 'Александр'],
      roleLines: ['Руководитель', 'тендерного отдела']
    }, {
      text: 'В целом Интерфейс понятный, удобный. Если нужны какие-то улучшения, Росэлторг их активно рассматривает. Не всегда, но движения в этом вопросе точно есть.',
      nameLines: ['Сергеев', 'Александр'],
      roleLines: ['Руководитель', 'тендерного отдела']
    }, {
      text: 'В целом Интерфейс понятный, удобный. Если нужны какие-то улучшения, Росэлторг их активно рассматривает. Не всегда, но движения в этом вопросе точно есть.',
      nameLines: ['Сергеев', 'Александр'],
      roleLines: ['Руководитель', 'тендерного отдела']
    }],
    consultation: {
      photos: ['assets/img/mask_group.png']
    },
    socialLinks: [{
      id: 'max',
      label: 'Max',
      href: '#'
    }, {
      id: 'tg',
      label: 'Телеграм',
      href: '#'
    }, {
      id: 'vk',
      label: 'В контакте',
      href: '#'
    }],
    chatWidget: {
      operatorName: 'Анна',
      operatorAvatar: 'assets/img/chat-avatar.png',
      welcomeMessages: ['Здравствуйте! 👋 Я специалист Центра развития закупок РТ.', 'Чем я могу вам помочь? Вы можете задать любой вопрос по обучению, тендерному сопровождению или работе на нашей ЭТП.'],
      autoReplies: ['Спасибо за ваше обращение! Ваше сообщение отправлено в отдел поддержки. Наш специалист свяжется с вами в ближайшее время. Если хотите ускорить процесс, оставьте ваши контактные данные.']
    }
  };
  var SOCIAL_ICON_ASSETS = {
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
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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
  function normalizeServiceTitle(title) {
    var t = String(title || '').trim().toLowerCase();
    if (t.includes('образователь') || t === 'обучение') return 'obuchenie';
    if (t.includes('сопровожд')) return 'support';
    if (t.includes('консалтинг') || t.includes('юрид')) return 'consulting';
    if (t === 'этп' || t.includes('электронная торгов')) return 'ecp';
    return '';
  }
  function normalizeServiceCards(cards) {
    var canonical = {
      obuchenie: {
        link: 'obuchenie.html',
        variant: 'green',
        icon: 'assets/img/obuch.png'
      },
      support: {
        link: 'support.html',
        variant: 'peach',
        icon: 'assets/img/sopr.png'
      },
      consulting: {
        link: 'consulting.html',
        variant: 'purple',
        icon: 'assets/img/u_k.png'
      },
      ecp: {
        link: 'ecp.html',
        variant: 'blue',
        icon: 'assets/img/etp.png'
      }
    };
    var order = ['obuchenie', 'support', 'consulting', 'ecp'];
    var known = new Map();
    var unknown = [];
    (cards || []).forEach(function (card) {
      var key = normalizeServiceTitle(card === null || card === void 0 ? void 0 : card.title);
      if (key && !known.has(key)) {
        known.set(key, _objectSpread(_objectSpread({}, card), {}, {
          link: canonical[key].link,
          variant: canonical[key].variant,
          icon: (card === null || card === void 0 ? void 0 : card.icon) || canonical[key].icon,
          external: false
        }));
      } else if (key) {
        var prev = known.get(key) || {};
        known.set(key, _objectSpread(_objectSpread(_objectSpread({}, prev), card), {}, {
          link: canonical[key].link,
          variant: canonical[key].variant,
          icon: (card === null || card === void 0 ? void 0 : card.icon) || prev.icon || canonical[key].icon,
          external: false
        }));
      } else if (card) {
        unknown.push(card);
      }
    });
    var normalized = order.filter(function (key) {
      return known.has(key);
    }).map(function (key) {
      return known.get(key);
    });
    return [].concat(_toConsumableArray(normalized), unknown);
  }
  function normalizeConsultationPhotos(raw, data) {
    var _data$consultation, _raw$consultation;
    var photos = [];
    if (Array.isArray(data === null || data === void 0 || (_data$consultation = data.consultation) === null || _data$consultation === void 0 ? void 0 : _data$consultation.photos)) {
      photos = _toConsumableArray(data.consultation.photos);
    } else if (typeof (data === null || data === void 0 ? void 0 : data.consultation) === 'string' && data.consultation.trim()) {
      photos = [data.consultation.trim()];
    }
    if (!photos.length && Array.isArray(raw === null || raw === void 0 || (_raw$consultation = raw.consultation) === null || _raw$consultation === void 0 ? void 0 : _raw$consultation.photos)) {
      photos = _toConsumableArray(raw.consultation.photos);
    }
    if (!photos.length && raw !== null && raw !== void 0 && raw.consultationPhoto) {
      photos = [raw.consultationPhoto];
    }
    photos = photos.map(function (p) {
      return p && String(p).trim() || '';
    }).filter(Boolean);
    if (!photos.length) {
      photos = _toConsumableArray(LANDING_DEFAULTS.consultation.photos);
    }
    return {
      photos: photos
    };
  }
  function normalizeChatTextList(raw, fallback) {
    var source = Array.isArray(raw) ? raw : typeof raw === 'string' && raw.trim() ? [raw] : [];
    var items = source.map(function (item) {
      return String(item || '').trim();
    }).filter(Boolean);
    if (items.length) return items;
    return Array.isArray(fallback) ? _toConsumableArray(fallback) : [];
  }
  function migrateLandingData(raw) {
    var _raw$chatWidget, _raw$chatWidget2, _raw$chatWidget3, _raw$chatWidget$autoR, _raw$chatWidget4, _raw$chatWidget5;
    var data = _objectSpread(_objectSpread({}, LANDING_DEFAULTS), raw || {});
    if (!Array.isArray(data.heroSlides) || !data.heroSlides.length) {
      var bg = (raw === null || raw === void 0 ? void 0 : raw.heroBgImage) || LANDING_DEFAULTS.heroSlides[0].background;
      data.heroSlides = [{
        title: (raw === null || raw === void 0 ? void 0 : raw.heroTitle) !== undefined ? raw.heroTitle : LANDING_DEFAULTS.heroSlides[0].title,
        titleColor: (raw === null || raw === void 0 ? void 0 : raw.heroTitleColor) || LANDING_DEFAULTS.heroSlides[0].titleColor,
        titleTop: (raw === null || raw === void 0 ? void 0 : raw.heroTitleTop) !== undefined ? raw.heroTitleTop : LANDING_DEFAULTS.heroSlides[0].titleTop,
        titleLeft: (raw === null || raw === void 0 ? void 0 : raw.heroTitleLeft) !== undefined ? raw.heroTitleLeft : LANDING_DEFAULTS.heroSlides[0].titleLeft,
        subtitle: (raw === null || raw === void 0 ? void 0 : raw.heroSubtitle) !== undefined ? raw.heroSubtitle : LANDING_DEFAULTS.heroSlides[0].subtitle,
        subtitleColor: (raw === null || raw === void 0 ? void 0 : raw.heroSubtitleColor) || LANDING_DEFAULTS.heroSlides[0].subtitleColor,
        subtitleTop: (raw === null || raw === void 0 ? void 0 : raw.heroSubtitleTop) !== undefined ? raw.heroSubtitleTop : LANDING_DEFAULTS.heroSlides[0].subtitleTop,
        subtitleLeft: (raw === null || raw === void 0 ? void 0 : raw.heroSubtitleLeft) !== undefined ? raw.heroSubtitleLeft : LANDING_DEFAULTS.heroSlides[0].subtitleLeft,
        background: bg
      }];
    } else {
      data.heroSlides = data.heroSlides.map(function (s) {
        return _objectSpread(_objectSpread({}, s), {}, {
          title: s.title !== undefined ? s.title : LANDING_DEFAULTS.heroSlides[0].title,
          titleColor: s.titleColor || LANDING_DEFAULTS.heroSlides[0].titleColor,
          titleTop: s.titleTop !== undefined ? s.titleTop : LANDING_DEFAULTS.heroSlides[0].titleTop,
          titleLeft: s.titleLeft !== undefined ? s.titleLeft : LANDING_DEFAULTS.heroSlides[0].titleLeft,
          subtitle: s.subtitle !== undefined ? s.subtitle : LANDING_DEFAULTS.heroSlides[0].subtitle,
          subtitleColor: s.subtitleColor || LANDING_DEFAULTS.heroSlides[0].subtitleColor,
          subtitleTop: s.subtitleTop !== undefined ? s.subtitleTop : LANDING_DEFAULTS.heroSlides[0].subtitleTop,
          subtitleLeft: s.subtitleLeft !== undefined ? s.subtitleLeft : LANDING_DEFAULTS.heroSlides[0].subtitleLeft
        });
      });
    }
    if (!Array.isArray(data.serviceCards) || !data.serviceCards.length) {
      if (Array.isArray(raw === null || raw === void 0 ? void 0 : raw.featureCards) && raw.featureCards.length) {
        var variants = ['green', 'peach', 'purple', 'blue'];
        data.serviceCards = raw.featureCards.map(function (c, i) {
          return {
            title: c.title || '',
            desc: c.subtitle || c.desc || '',
            link: c.link || '#',
            variant: c.variant || variants[i % variants.length],
            icon: c.image || c.icon || '',
            external: /^https?:\/\//i.test(c.link || '')
          };
        });
      } else {
        data.serviceCards = _toConsumableArray(LANDING_DEFAULTS.serviceCards);
      }
    }
    data.serviceCards = data.serviceCards.map(function (card) {
      var title = String((card === null || card === void 0 ? void 0 : card.title) || '').trim();
      var link = String((card === null || card === void 0 ? void 0 : card.link) || '').trim();
      if (title === 'ЭТП' && /etp\.?zakupki/i.test(link)) {
        return _objectSpread(_objectSpread({}, card), {}, {
          link: 'ecp.html',
          external: false
        });
      }
      if (title === 'Сопровождение') {
        return _objectSpread(_objectSpread({}, card), {}, {
          link: 'support.html',
          external: false
        });
      }
      if (title === 'Обучение') {
        return _objectSpread(_objectSpread({}, card), {}, {
          link: 'obuchenie.html',
          external: false
        });
      }
      return card;
    });
    data.serviceCards = normalizeServiceCards(data.serviceCards);
    if (!data.promoBanner || _typeof(data.promoBanner) !== 'object') {
      data.promoBanner = _objectSpread({}, LANDING_DEFAULTS.promoBanner);
    } else {
      data.promoBanner = _objectSpread(_objectSpread({}, LANDING_DEFAULTS.promoBanner), data.promoBanner);
    }
    if (!Array.isArray(data.partners) || !data.partners.length) {
      data.partners = _toConsumableArray(LANDING_DEFAULTS.partners);
    }
    if (!Array.isArray(data.reviews) || !data.reviews.length) {
      if (Array.isArray(raw === null || raw === void 0 ? void 0 : raw.testimonials) && raw.testimonials.length) {
        data.reviews = raw.testimonials.map(function (t) {
          return {
            text: (t.text || '').replace(/^«|»$/g, ''),
            nameLines: t.nameLines || [t.client || ''],
            roleLines: t.roleLines || []
          };
        });
      } else {
        data.reviews = _toConsumableArray(LANDING_DEFAULTS.reviews);
      }
    }
    data.consultation = normalizeConsultationPhotos(raw, data);
    if (!Array.isArray(data.socialLinks) || !data.socialLinks.length) {
      data.socialLinks = LANDING_DEFAULTS.socialLinks.map(function (link) {
        return _objectSpread({}, link);
      });
    } else {
      data.socialLinks = data.socialLinks.map(function (link, index) {
        var fallback = LANDING_DEFAULTS.socialLinks[index] || LANDING_DEFAULTS.socialLinks[0];
        return {
          id: (link === null || link === void 0 ? void 0 : link.id) || fallback.id,
          label: (link === null || link === void 0 ? void 0 : link.label) || fallback.label,
          href: (link === null || link === void 0 ? void 0 : link.href) || fallback.href || '#'
        };
      }).filter(function (link) {
        return SOCIAL_ICON_ASSETS[link.id];
      });
    }
    data.chatWidget = {
      operatorName: (raw === null || raw === void 0 || (_raw$chatWidget = raw.chatWidget) === null || _raw$chatWidget === void 0 ? void 0 : _raw$chatWidget.operatorName) || LANDING_DEFAULTS.chatWidget.operatorName,
      operatorAvatar: (raw === null || raw === void 0 || (_raw$chatWidget2 = raw.chatWidget) === null || _raw$chatWidget2 === void 0 ? void 0 : _raw$chatWidget2.operatorAvatar) || LANDING_DEFAULTS.chatWidget.operatorAvatar,
      welcomeMessages: normalizeChatTextList(raw === null || raw === void 0 || (_raw$chatWidget3 = raw.chatWidget) === null || _raw$chatWidget3 === void 0 ? void 0 : _raw$chatWidget3.welcomeMessages, LANDING_DEFAULTS.chatWidget.welcomeMessages),
      autoReplies: normalizeChatTextList((_raw$chatWidget$autoR = raw === null || raw === void 0 || (_raw$chatWidget4 = raw.chatWidget) === null || _raw$chatWidget4 === void 0 ? void 0 : _raw$chatWidget4.autoReplies) !== null && _raw$chatWidget$autoR !== void 0 ? _raw$chatWidget$autoR : raw === null || raw === void 0 || (_raw$chatWidget5 = raw.chatWidget) === null || _raw$chatWidget5 === void 0 ? void 0 : _raw$chatWidget5.autoReply, LANDING_DEFAULTS.chatWidget.autoReplies)
    };
    return data;
  }
  function markLandingContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }
  function loadLandingDataFromLocal() {
    try {
      var local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateLandingData(JSON.parse(local));
    } catch (e) {
      console.warn('Landing: localStorage parse error', e);
    }
    return null;
  }
  function loadLandingDataFromApi() {
    return _loadLandingDataFromApi.apply(this, arguments);
  }
  function _loadLandingDataFromApi() {
    _loadLandingDataFromApi = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
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
            return _context.a(2, migrateLandingData(data));
          case 3:
            _context.n = 5;
            break;
          case 4:
            _context.p = 4;
            _t = _context.v;
            console.warn('Landing: API unavailable, using local fallback', _t);
          case 5:
            return _context.a(2, null);
        }
      }, _callee, null, [[0, 4]]);
    }));
    return _loadLandingDataFromApi.apply(this, arguments);
  }
  function shouldSkipLandingHero() {
    return document.body.dataset.page !== undefined || document.body.classList.contains('theme-blue') || document.body.classList.contains('theme-purple') || Boolean(document.querySelector('.consulting-hero')) || Boolean(document.querySelector('.hero-slider--single'));
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
    var slider = document.querySelector('.hero-slider');
    var slideEl = document.querySelector('.hero-slide');
    if (!slider || !slideEl) return;
    if (shouldSkipLandingHero()) return;
    slider.style.containerType = 'inline-size';
    var slides = (data.heroSlides || []).filter(function (s) {
      return s && (s.background || s.title);
    });
    if (!slides.length) return;
    var first = slides[0];
    slider.style.backgroundImage = first.background ? "url('".concat(first.background, "')") : '';
    slider.dataset.slides = JSON.stringify(slides);
    var titleEl = slideEl.querySelector('.hero-slide__title');
    var subEl = slideEl.querySelector('.hero-slide__subtitle');
    if (titleEl) {
      titleEl.innerHTML = multilineHtml(first.title);
      if (first.titleColor && first.titleColor !== '#000000') titleEl.style.color = first.titleColor;else titleEl.style.removeProperty('color');
      if (first.titleTop !== undefined) titleEl.style.top = "".concat(first.titleTop, "px");
      if (first.titleLeft !== undefined) {
        titleEl.style.left = "".concat(first.titleLeft, "px");
        titleEl.style.width = 'auto';
        titleEl.style.maxWidth = "calc(100% - ".concat(first.titleLeft, "px - 10px)");
      }
      applyTypographyStyles(titleEl, first.titleFontSize, first.titleFontWeight, first.titleItalic, first.titleUnderline);
    }
    if (subEl) {
      subEl.innerHTML = multilineHtml(first.subtitle);
      if (first.subtitleColor && first.subtitleColor !== '#333333') subEl.style.color = first.subtitleColor;else subEl.style.removeProperty('color');
      if (first.subtitleTop !== undefined) subEl.style.top = "".concat(first.subtitleTop, "px");
      if (first.subtitleLeft !== undefined) {
        subEl.style.left = "".concat(first.subtitleLeft, "px");
        subEl.style.width = 'auto';
        subEl.style.maxWidth = "calc(100% - ".concat(first.subtitleLeft, "px - 10px)");
      }
      applyTypographyStyles(subEl, first.subtitleFontSize, first.subtitleFontWeight, first.subtitleItalic, first.subtitleUnderline);
    }
    if (first.background) slider.classList.add('hero-slider--custom-bg');else slider.classList.remove('hero-slider--custom-bg');
    var dotsWrap = slideEl.querySelector('.hero-slide__dots');
    var arrowsWrap = slideEl.querySelector('.hero-slide__arrows');
    var hasMultipleSlides = slides.length > 1;
    if (dotsWrap) {
      dotsWrap.innerHTML = hasMultipleSlides ? slides.map(function (_, i) {
        return "<span class=\"dot".concat(i === 0 ? ' active' : '', "\" data-slide=\"").concat(i, "\"></span>");
      }).join('') : '';
      dotsWrap.classList.toggle('is-hidden', !hasMultipleSlides);
    }
    if (arrowsWrap) {
      arrowsWrap.classList.toggle('is-hidden', !hasMultipleSlides);
    }
    window.__heroSlides = slides;
    window.__heroCurrent = 0;
    document.dispatchEvent(new CustomEvent('heroSlidesUpdated', {
      detail: {
        count: slides.length
      }
    }));
  }
  function applyHeroSlide(index) {
    if (shouldSkipLandingHero()) return;
    var slides = window.__heroSlides;
    if (!slides || !slides.length) return;
    var i = (index % slides.length + slides.length) % slides.length;
    window.__heroCurrent = i;
    var slide = slides[i];
    var slider = document.querySelector('.hero-slider');
    var titleEl = document.querySelector('.hero-slide__title');
    var subEl = document.querySelector('.hero-slide__subtitle');
    if (slider) {
      if (slide.background) {
        slider.style.backgroundImage = "url('".concat(slide.background, "')");
        slider.classList.add('hero-slider--custom-bg');
      } else {
        slider.style.backgroundImage = '';
        slider.classList.remove('hero-slider--custom-bg');
      }
    }
    if (titleEl) {
      titleEl.innerHTML = multilineHtml(slide.title);
      if (slide.titleColor && slide.titleColor !== '#000000') titleEl.style.color = slide.titleColor;else titleEl.style.removeProperty('color');
      if (slide.titleTop !== undefined) titleEl.style.top = "".concat(slide.titleTop, "px");
      if (slide.titleLeft !== undefined) {
        titleEl.style.left = "".concat(slide.titleLeft, "px");
        titleEl.style.width = 'auto';
        titleEl.style.maxWidth = "calc(100% - ".concat(slide.titleLeft, "px - 10px)");
      }
      applyTypographyStyles(titleEl, slide.titleFontSize, slide.titleFontWeight, slide.titleItalic, slide.titleUnderline);
    }
    if (subEl) {
      subEl.innerHTML = multilineHtml(slide.subtitle);
      if (slide.subtitleColor && slide.subtitleColor !== '#333333') subEl.style.color = slide.subtitleColor;else subEl.style.removeProperty('color');
      if (slide.subtitleTop !== undefined) subEl.style.top = "".concat(slide.subtitleTop, "px");
      if (slide.subtitleLeft !== undefined) {
        subEl.style.left = "".concat(slide.subtitleLeft, "px");
        subEl.style.width = 'auto';
        subEl.style.maxWidth = "calc(100% - ".concat(slide.subtitleLeft, "px - 10px)");
      }
      applyTypographyStyles(subEl, slide.subtitleFontSize, slide.subtitleFontWeight, slide.subtitleItalic, slide.subtitleUnderline);
    }
    document.querySelectorAll('.hero-slide__dots .dot').forEach(function (dot, idx) {
      dot.classList.toggle('active', idx === i);
    });
  }
  function renderServiceCards(cards) {
    var grid = document.querySelector('.services-grid');
    if (!grid) return;
    var list = cards && cards.length ? cards : LANDING_DEFAULTS.serviceCards;
    grid.innerHTML = list.map(function (card) {
      var ext = card.external || /^https?:\/\//i.test(card.link || '');
      var target = ext ? ' target="_blank" rel="noopener noreferrer"' : '';
      var variant = card.variant || 'green';
      var icon = card.icon ? "<img src=\"".concat(card.icon, "\" alt=\"").concat(escapeHtml(card.title), "\" class=\"service-card__icon\">") : '';
      return "<a href=\"".concat(escapeHtml(card.link || '#'), "\" class=\"service-card service-card--").concat(variant, "\"").concat(target, ">\n          <div class=\"service-card__body\">\n            <h3 class=\"service-card__title\">").concat(escapeHtml(card.title), "</h3>\n            <p class=\"service-card__desc\">").concat(escapeHtml(card.desc), "</p>\n          </div>\n          ").concat(icon, "\n        </a>");
    }).join('');
  }
  function renderPromoBanner(banner) {
    var el = document.querySelector('.promo-banner');
    if (!el || !banner) return;
    el.style.containerType = 'inline-size';
    if (banner.image) el.style.backgroundImage = "url('".concat(banner.image, "')");
    el.classList.add('promo-banner--custom');
    var titleEl = el.querySelector('.promo-banner__title');
    var dateEl = el.querySelector('.promo-banner__date');
    if (titleEl) {
      titleEl.innerHTML = multilineHtml(banner.title);
      if (banner.titleColor) titleEl.style.color = banner.titleColor;else titleEl.style.removeProperty('color');
      if (banner.titleTop !== undefined) titleEl.style.top = "calc((".concat(banner.titleTop, " / 253) * 100%)");
      if (banner.titleLeft !== undefined) {
        titleEl.style.left = "calc((".concat(banner.titleLeft, " / 1520) * 100%)");
        titleEl.style.maxWidth = "calc(100% - ((".concat(banner.titleLeft, " / 1520) * 100%) - 10px)");
      }
      applyTypographyStyles(titleEl, banner.titleFontSize, banner.titleFontWeight, banner.titleItalic, banner.titleUnderline);
    }
    if (dateEl) {
      dateEl.textContent = banner.date || '';
      if (banner.dateColor) dateEl.style.color = banner.dateColor;else dateEl.style.removeProperty('color');
      if (banner.dateTop !== undefined) dateEl.style.top = "calc((".concat(banner.dateTop, " / 253) * 100%)");
      if (banner.dateLeft !== undefined) {
        dateEl.style.left = "calc((".concat(banner.dateLeft, " / 1520) * 100%)");
        dateEl.style.maxWidth = "calc(100% - ((".concat(banner.dateLeft, " / 1520) * 100%) - 10px)");
      }
      applyTypographyStyles(dateEl, banner.dateFontSize, banner.dateFontWeight, banner.dateItalic, banner.dateUnderline);
    }
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
    var track = document.querySelector('.partners-track');
    if (!track) return;
    var list = partners && partners.length ? partners : LANDING_DEFAULTS.partners;
    track.innerHTML = list.map(function (p) {
      return "<div class=\"partner-logo\">\n          <img src=\"".concat(escapeAttr(p.image), "\" alt=\"").concat(escapeHtml(p.alt || 'Партнёр'), "\" loading=\"lazy\" decoding=\"async\">\n        </div>");
    }).join('');
  }
  function renderReviews(reviews) {
    var grid = document.querySelector('.reviews-grid');
    if (!grid) return;
    var list = reviews && reviews.length ? reviews : LANDING_DEFAULTS.reviews;
    grid.innerHTML = list.map(function (r) {
      var nameLines = (r.nameLines || []).map(function (line) {
        return "<span class=\"review-card__name-line\">".concat(escapeHtml(line), "</span>");
      }).join('');
      var roleLines = (r.roleLines || []).map(function (line) {
        return "<span class=\"review-card__role-line\">".concat(escapeHtml(line), "</span>");
      }).join('');
      var text = String(r.text || '');
      var reviewText = text.length > REVIEW_TEXT_MAX_LENGTH ? text.slice(0, REVIEW_TEXT_MAX_LENGTH) : text;
      return "<div class=\"review-card reveal-init\">\n          <p class=\"review-card__text\">".concat(escapeHtml(reviewText), "</p>\n          <div class=\"review-card__footer\">\n            <div class=\"review-card__author\">\n              <p class=\"review-card__name\">").concat(nameLines, "</p>\n              <p class=\"review-card__role\">").concat(roleLines, "</p>\n            </div>\n          </div>\n          <div class=\"review-card__quote\" aria-hidden=\"true\">\n            <img src=\"assets/img/quote.svg\" alt=\"\" class=\"review-card__quote-img\" width=\"179\" height=\"182\" decoding=\"async\">\n          </div>\n        </div>");
    }).join('');
    if (window.__reinitReveal) window.__reinitReveal('.review-card');
  }
  function renderSocialLinks(socialLinks) {
    var bannerLinks = document.querySelector('.social-banner__links');
    var footerLinks = document.querySelector('.footer-socials');
    var list = socialLinks && socialLinks.length ? socialLinks : LANDING_DEFAULTS.socialLinks;
    if (bannerLinks) {
      bannerLinks.innerHTML = list.map(function (link) {
        var assets = SOCIAL_ICON_ASSETS[link.id];
        if (!assets) return '';
        var href = link.href || '#';
        var ext = /^https?:\/\//i.test(href);
        var target = ext ? ' target="_blank" rel="noopener noreferrer"' : '';
        return "<a href=\"".concat(escapeHtml(href), "\" class=\"social-btn\" aria-label=\"").concat(escapeHtml(link.label || link.id), "\"").concat(target, ">\n            <span class=\"social-btn__icon-wrap\">\n              <img src=\"").concat(escapeAttr(assets.banner), "\" alt=\"\" class=\"social-btn__icon\" width=\"57\" height=\"57\" decoding=\"async\">\n            </span>\n            <span class=\"social-btn__label\">").concat(escapeHtml(link.label || link.id), "</span>\n          </a>");
      }).join('');
    }
    if (footerLinks) {
      footerLinks.innerHTML = list.map(function (link) {
        var assets = SOCIAL_ICON_ASSETS[link.id];
        if (!assets) return '';
        var href = link.href || '#';
        var ext = /^https?:\/\//i.test(href);
        var target = ext ? ' target="_blank" rel="noopener noreferrer"' : '';
        return "<a href=\"".concat(escapeHtml(href), "\" class=\"footer-social-icon ").concat(assets.footerClass, "\" aria-label=\"").concat(escapeHtml(link.label || link.id), "\"").concat(target, ">\n            <img src=\"").concat(escapeAttr(assets.footer), "\" alt=\"").concat(escapeHtml(link.label || link.id), "\">\n          </a>");
      }).join('');
    }
  }
  function renderConsultationPhoto(photos) {
    var person = document.querySelector('.consultation-card__person');
    if (!person) return;
    var list = (photos || []).map(function (p) {
      return p && String(p).trim() || '';
    }).filter(Boolean);
    var pool = list.length ? list : LANDING_DEFAULTS.consultation.photos;
    var chosen = pool[Math.floor(Math.random() * pool.length)];
    var safeUrl = String(chosen).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    person.style.backgroundImage = "url(\"".concat(safeUrl, "\")");
    person.style.backgroundRepeat = 'no-repeat';
    person.style.backgroundPosition = 'right bottom';
    person.style.backgroundSize = 'contain';
  }
  function bindPromoClick() {
    if (promoBound) return;
    var el = document.querySelector('.promo-banner');
    if (!el) return;
    var go = function go() {
      var href = el.dataset.href;
      if (href) window.location.href = href;
    };
    el.addEventListener('click', go);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go();
      }
    });
    promoBound = true;
  }
  function getHeroLcpImage(data) {
    var _find;
    return ((_find = ((data === null || data === void 0 ? void 0 : data.heroSlides) || []).find(function (slide) {
      return slide === null || slide === void 0 ? void 0 : slide.background;
    })) === null || _find === void 0 ? void 0 : _find.background) || '';
  }
  function preloadLcpImage(url) {
    if (!url || String(url).startsWith('data:')) return;
    var href = String(url);
    var link = document.querySelector('link[data-preload-lcp="hero"]');
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
    var img = new Image();
    img.decoding = 'async';
    if (options !== null && options !== void 0 && options.highPriority && 'fetchPriority' in img) {
      img.fetchPriority = 'high';
    }
    img.src = url;
  }
  function renderLanding(data) {
    var _data$consultation2;
    renderHero(data);
    renderServiceCards(data.serviceCards);
    renderPromoBanner(data.promoBanner);
    renderPartners(data.partners);
    renderReviews(data.reviews);
    renderSocialLinks(data.socialLinks);
    renderConsultationPhoto((_data$consultation2 = data.consultation) === null || _data$consultation2 === void 0 ? void 0 : _data$consultation2.photos);
    bindPromoClick();
    if (!shouldSkipLandingHero()) {
      window.applyHeroSlide = applyHeroSlide;
    }
    document.dispatchEvent(new CustomEvent('landingContentReady', {
      detail: data
    }));
  }
  function loadAndRenderUpcomingEvents() {
    return _loadAndRenderUpcomingEvents.apply(this, arguments);
  }
  function _loadAndRenderUpcomingEvents() {
    _loadAndRenderUpcomingEvents = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var api, localData, initialData, apiData, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            api = window.ObuchenieContent;
            if (api !== null && api !== void 0 && api.renderLandingUpcomingEvents) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2);
          case 1:
            _context2.p = 1;
            localData = api.loadObuchenieDataFromLocal();
            initialData = localData || api.migrateObucheniePageData(null);
            api.renderLandingUpcomingEvents(initialData.courseRegistry);
            _context2.n = 2;
            return api.loadObuchenieDataFromApi();
          case 2:
            apiData = _context2.v;
            if (apiData) {
              api.renderLandingUpcomingEvents(apiData.courseRegistry);
            }
            _context2.n = 4;
            break;
          case 3:
            _context2.p = 3;
            _t2 = _context2.v;
            console.warn('Landing: upcoming events load failed', _t2);
          case 4:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 3]]);
    }));
    return _loadAndRenderUpcomingEvents.apply(this, arguments);
  }
  function loadAndRenderLandingNews() {
    return _loadAndRenderLandingNews.apply(this, arguments);
  }
  function _loadAndRenderLandingNews() {
    _loadAndRenderLandingNews = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var api, localData, initialData, apiData, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            api = window.NewsContent;
            if (api !== null && api !== void 0 && api.renderLandingNewsPreview) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2);
          case 1:
            _context3.p = 1;
            localData = api.loadNewsDataFromLocal();
            initialData = localData || api.migrateNewsPageData(null);
            api.renderLandingNewsPreview(initialData.items);
            _context3.n = 2;
            return api.loadNewsDataFromApi();
          case 2:
            apiData = _context3.v;
            if (apiData) {
              api.renderLandingNewsPreview(apiData.items);
            }
            _context3.n = 4;
            break;
          case 3:
            _context3.p = 3;
            _t3 = _context3.v;
            console.warn('Landing: news load failed', _t3);
          case 4:
            return _context3.a(2);
        }
      }, _callee3, null, [[1, 3]]);
    }));
    return _loadAndRenderLandingNews.apply(this, arguments);
  }
  function initLandingContent() {
    return _initLandingContent.apply(this, arguments);
  }
  function _initLandingContent() {
    _initLandingContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var revealTimer, upcomingEventsPromise, landingNewsPromise, localData, initialData, apiData, _t4;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            revealTimer = window.setTimeout(markLandingContentReady, REVEAL_TIMEOUT_MS);
            upcomingEventsPromise = loadAndRenderUpcomingEvents();
            landingNewsPromise = loadAndRenderLandingNews();
            _context4.p = 1;
            localData = loadLandingDataFromLocal();
            initialData = localData || migrateLandingData(null);
            preloadLcpImage(getHeroLcpImage(initialData));
            renderLanding(initialData);
            markLandingContentReady();
            preloadImage(getHeroLcpImage(initialData), {
              highPriority: true
            });
            _context4.n = 2;
            return loadLandingDataFromApi();
          case 2:
            apiData = _context4.v;
            if (apiData) {
              renderLanding(apiData);
              preloadImage(getHeroLcpImage(apiData), {
                highPriority: true
              });
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
              } catch (e) {
                console.warn('Landing: localStorage update failed', e);
              }
            }
            _context4.n = 4;
            break;
          case 3:
            _context4.p = 3;
            _t4 = _context4.v;
            console.error('Landing content init failed', _t4);
            markLandingContentReady();
          case 4:
            _context4.p = 4;
            window.clearTimeout(revealTimer);
            return _context4.f(4);
          case 5:
            return _context4.a(2);
        }
      }, _callee4, null, [[1, 3, 4, 5]]);
    }));
    return _initLandingContent.apply(this, arguments);
  }
  window.LandingContent = {
    loadLandingDataFromApi: loadLandingDataFromApi,
    loadLandingDataFromLocal: loadLandingDataFromLocal,
    migrateLandingData: migrateLandingData,
    normalizeConsultationPhotos: normalizeConsultationPhotos,
    LANDING_DEFAULTS: LANDING_DEFAULTS,
    applyHeroSlide: applyHeroSlide
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLandingContent);
  } else {
    initLandingContent();
  }
})();