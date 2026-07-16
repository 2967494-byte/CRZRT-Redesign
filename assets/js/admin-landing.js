function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * Редактор главной страницы (лендинг) для admin.html
 */
(function () {
  var MAX_HERO_SLIDES = 8;

  /** Макс. длина текста отзыва на карточке лендинга (≈ объём «Все понятно, очень интересно!» ×8 + «Все») */
  var REVIEW_TEXT_MAX_LENGTH = 243;

  /** Поля и сетка для логотипов партнёров (доли от стороны кадра 0–1) */
  var PARTNER_LOGO_CROP = {
    width: 400,
    height: 400,
    marginX: 0.18,
    marginY: 0.14,
    minZoomRatio: 0.001,
    zoomStep: 0.18
  };
  var partnerCropGuidesEl = null;
  var SERVICE_VARIANTS = [{
    id: 'green',
    label: 'Зелёная'
  }, {
    id: 'peach',
    label: 'Персиковая'
  }, {
    id: 'purple',
    label: 'Фиолетовая'
  }, {
    id: 'blue',
    label: 'Голубая'
  }];
  var DEFAULT_LANDING_MAIN = {
    heroSlides: [{
      title: 'Надежное тендерное\nсопровождение',
      titleColor: '#ffffff',
      titleTop: 122,
      titleLeft: 70,
      subtitle: '',
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
    },
    logo: 'assets/img/logo.svg'
  };
  function escapeAttr(s) {
    return String(s !== null && s !== void 0 ? s : '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }
  var CHAT_TEXT_MAX_LENGTH = 600;
  function normalizeChatTextList(raw, fallback) {
    var source = Array.isArray(raw) ? raw : typeof raw === 'string' && raw.trim() ? [raw] : [];
    var items = source.map(function (item) {
      return String(item || '').trim();
    }).filter(Boolean);
    if (items.length) return items;
    return Array.isArray(fallback) ? _toConsumableArray(fallback) : [];
  }
  function migrateMainPageData(raw) {
    var data = Object.assign({}, DEFAULT_LANDING_MAIN, raw || {});
    
    // Migrate Hero Slides
    if (!Array.isArray(data.heroSlides) || !data.heroSlides.length) {
      var bg = (raw && raw.heroBgImage) ? raw.heroBgImage : DEFAULT_LANDING_MAIN.heroSlides[0].background;
      data.heroSlides = [{
        title: (raw && raw.heroTitle !== undefined) ? raw.heroTitle : DEFAULT_LANDING_MAIN.heroSlides[0].title,
        titleColor: (raw && raw.heroTitleColor) ? raw.heroTitleColor : DEFAULT_LANDING_MAIN.heroSlides[0].titleColor,
        titleTop: (raw && raw.heroTitleTop !== undefined) ? raw.heroTitleTop : DEFAULT_LANDING_MAIN.heroSlides[0].titleTop,
        titleLeft: (raw && raw.heroTitleLeft !== undefined) ? raw.heroTitleLeft : DEFAULT_LANDING_MAIN.heroSlides[0].titleLeft,
        subtitle: (raw && raw.heroSubtitle !== undefined) ? raw.heroSubtitle : DEFAULT_LANDING_MAIN.heroSlides[0].subtitle,
        subtitleColor: (raw && raw.heroSubtitleColor) ? raw.heroSubtitleColor : DEFAULT_LANDING_MAIN.heroSlides[0].subtitleColor,
        subtitleTop: (raw && raw.heroSubtitleTop !== undefined) ? raw.heroSubtitleTop : DEFAULT_LANDING_MAIN.heroSlides[0].subtitleTop,
        subtitleLeft: (raw && raw.heroSubtitleLeft !== undefined) ? raw.heroSubtitleLeft : DEFAULT_LANDING_MAIN.heroSlides[0].subtitleLeft,
        background: bg
      }];
    }
    
    // Migrate Service Cards
    if (!Array.isArray(data.serviceCards) || !data.serviceCards.length) {
      if (raw && Array.isArray(raw.featureCards) && raw.featureCards.length) {
        var variants = ['green', 'peach', 'purple', 'blue'];
        data.serviceCards = raw.featureCards.map(function(c, i) {
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
        data.serviceCards = JSON.parse(JSON.stringify(DEFAULT_LANDING_MAIN.serviceCards));
      }
    }
    
    if (!data.serviceCards || data.serviceCards.length === 0) {
      data.serviceCards = JSON.parse(JSON.stringify(DEFAULT_LANDING_MAIN.serviceCards));
    }
    
    var _raw$chatWidget, _raw$chatWidget2, _raw$chatWidget3, _raw$chatWidget$autoR, _raw$chatWidget4, _raw$chatWidget5;
    data.chatWidget = {
      operatorName: (raw === null || raw === void 0 || (_raw$chatWidget = raw.chatWidget) === null || _raw$chatWidget === void 0 ? void 0 : _raw$chatWidget.operatorName) || DEFAULT_LANDING_MAIN.chatWidget.operatorName,
      operatorAvatar: (raw === null || raw === void 0 || (_raw$chatWidget2 = raw.chatWidget) === null || _raw$chatWidget2 === void 0 ? void 0 : _raw$chatWidget2.operatorAvatar) || DEFAULT_LANDING_MAIN.chatWidget.operatorAvatar,
      welcomeMessages: normalizeChatTextList(raw === null || raw === void 0 || (_raw$chatWidget3 = raw.chatWidget) === null || _raw$chatWidget3 === void 0 ? void 0 : _raw$chatWidget3.welcomeMessages, DEFAULT_LANDING_MAIN.chatWidget.welcomeMessages),
      autoReplies: normalizeChatTextList((_raw$chatWidget$autoR = raw === null || raw === void 0 || (_raw$chatWidget4 = raw.chatWidget) === null || _raw$chatWidget4 === void 0 ? void 0 : _raw$chatWidget4.autoReplies) !== null && _raw$chatWidget$autoR !== void 0 ? _raw$chatWidget$autoR : raw === null || raw === void 0 || (_raw$chatWidget5 = raw.chatWidget) === null || _raw$chatWidget5 === void 0 ? void 0 : _raw$chatWidget5.autoReply, DEFAULT_LANDING_MAIN.chatWidget.autoReplies)
    };
    data.logo = raw && raw.logo ? raw.logo : DEFAULT_LANDING_MAIN.logo;
    return data;
  }

  /** Заполняет превью/hidden без вставки base64 в HTML-разметку (иначе браузер обрезает длинные value/src). */
  function setImageUploadState(id, src) {
    var v = src ? String(src) : '';
    var prev = document.getElementById("".concat(id, "_preview"));
    var val = document.getElementById("".concat(id, "_val"));
    var clr = document.getElementById("".concat(id, "_clear"));
    if (val) val.value = v;
    if (prev) {
      prev.src = v;
      if (!document.querySelector("[data-upload-frame-for=\"".concat(id, "\"]"))) {
        prev.style.display = v ? 'block' : 'none';
      }
    }
    var frame = document.querySelector("[data-upload-frame-for=\"".concat(id, "\"]"));
    if (frame) {
      frame.classList.toggle('consult-photo-frame--empty', !v);
      frame.classList.toggle('hero-slide-frame--empty', !v);
    }
    if (clr) clr.style.display = v ? 'inline-flex' : 'none';
    if (id.startsWith('m_hero_bg_')) {
      var idx = id.split('_').pop();
      var livePreview = document.getElementById("m_hero_live_preview_".concat(idx));
      if (livePreview) {
        if (v) {
          livePreview.style.backgroundImage = "url('".concat(v, "')");
        } else {
          livePreview.style.backgroundImage = 'radial-gradient(32.3% 55.38% at 71.22% 54%, #FFFFFF 0%, #B8FDC6 100%)';
        }
      }
    }
    if (id === 'm_promo_img') {
      applyPromoPreviewStyles();
    }
  }
  function consultPhotoUploadShell(id, label, index) {
    return "\n      <div class=\"consult-photo-card__body\">\n        <div class=\"consult-photo-card__media\">\n          <div class=\"consult-photo-frame consult-photo-frame--empty\" data-upload-frame-for=\"".concat(id, "\">\n            <span class=\"consult-photo-frame__empty\">396\xD7509</span>\n            <img id=\"").concat(id, "_preview\" class=\"consult-photo-frame__img\" src=\"\" alt=\"\">\n          </div>\n        </div>\n        <div class=\"consult-photo-card__info\">\n          <span class=\"consult-photo-card__title\">").concat(label, "</span>\n          <p class=\"consult-photo-card__hint\">\u041F\u0440\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u043E\u0435 \u0444\u043E\u0442\u043E \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430.</p>\n          <div class=\"consult-photo-card__actions image-upload-mini\" data-upload-id=\"").concat(id, "\">\n            <button type=\"button\" class=\"btn-save\" onclick=\"AdminLanding.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n            <button type=\"button\" class=\"btn-delete\" onclick=\"AdminLanding.removeConsultPhoto(").concat(index, ")\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n            <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n          </div>\n        </div>\n      </div>");
  }
  function imageUploadHtml(id, label) {
    return "\n      <div class=\"form-group\" style=\"margin-bottom:0;\">\n        <label>".concat(label, "</label>\n        <div class=\"image-upload-mini\" data-upload-id=\"").concat(id, "\">\n          <img id=\"").concat(id, "_preview\" src=\"\" alt=\"\" style=\"max-width:160px;max-height:160px;object-fit:contain;border-radius:8px;display:none;margin-bottom:8px;background:rgba(0,0,0,0.15);\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:8px 14px;font-size:0.85rem;\" onclick=\"AdminLanding.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n          <button type=\"button\" class=\"btn-delete\" style=\"padding:8px 14px;margin-left:8px;font-size:0.85rem;display:none;\" id=\"").concat(id, "_clear\" onclick=\"AdminLanding.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n          <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n        </div>\n      </div>");
  }
  function heroBgUploadShell(id, label) {
    return "\n      <div class=\"form-group hero-slide-upload-group\" style=\"margin-bottom:0;\">\n        <label>".concat(label, "</label>\n        <div class=\"hero-slide-frame hero-slide-frame--empty\" data-upload-frame-for=\"").concat(id, "\">\n          <span class=\"hero-slide-frame__empty\">\u043F\u0440\u043E\u043F\u043E\u0440\u0446\u0438\u0438 1520\xD7420</span>\n          <img id=\"").concat(id, "_preview\" class=\"hero-slide-frame__img\" src=\"\" alt=\"\">\n        </div>\n        <div class=\"hero-slide-upload-actions image-upload-mini\" data-upload-id=\"").concat(id, "\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:8px 14px;font-size:0.85rem;\" onclick=\"AdminLanding.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n          <button type=\"button\" class=\"btn-delete\" style=\"padding:8px 14px;font-size:0.85rem;display:none;\" id=\"").concat(id, "_clear\" onclick=\"AdminLanding.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n          <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n        </div>\n      </div>");
  }
  function partnerImageUploadHtml(id, previewSrc) {
    var show = previewSrc ? 'block' : 'none';
    return "\n      <div class=\"form-group partner-upload-group\">\n        <label>\u041B\u043E\u0433\u043E\u0442\u0438\u043F</label>\n        <div class=\"image-upload-mini\" data-upload-id=\"".concat(id, "\">\n          <div class=\"partner-logo-preview\" style=\"--partner-mx:").concat(PARTNER_LOGO_CROP.marginX * 100, "%;--partner-my:").concat(PARTNER_LOGO_CROP.marginY * 100, "%;\">\n            <div class=\"partner-logo-preview__inner\">\n              <span class=\"partner-logo-preview__margin partner-logo-preview__margin--left\" aria-hidden=\"true\"></span>\n              <span class=\"partner-logo-preview__margin partner-logo-preview__margin--right\" aria-hidden=\"true\"></span>\n              <span class=\"partner-logo-preview__margin partner-logo-preview__margin--top\" aria-hidden=\"true\"></span>\n              <span class=\"partner-logo-preview__margin partner-logo-preview__margin--bottom\" aria-hidden=\"true\"></span>\n              <img id=\"").concat(id, "_preview\" class=\"partner-logo-preview__img\" src=\"").concat(escapeAttr(previewSrc), "\" alt=\"\" style=\"display:").concat(show, ";\">\n            </div>\n          </div>\n          <div class=\"partner-upload-actions\">\n            <button type=\"button\" class=\"btn-save\" onclick=\"AdminLanding.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n            <button type=\"button\" class=\"btn-delete\" id=\"").concat(id, "_clear\" onclick=\"AdminLanding.clearImage('").concat(id, "')\" style=\"").concat(previewSrc ? '' : 'display:none;', "\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n          </div>\n          <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"").concat(escapeAttr(previewSrc), "\">\n        </div>\n        <small class=\"partner-upload-hint\">\u041D\u0430 \u0441\u0430\u0439\u0442\u0435 \u2014 \u0446\u0432\u0435\u0442; \u0432 \u043F\u043E\u043A\u043E\u0435 \u2014 \u0441\u0435\u0440\u044B\u0439, \u043F\u0440\u0438 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u0438 \u2014 \u0446\u0432\u0435\u0442.</small>\n      </div>");
  }
  function blockHeaderWithColorHtml(title, colorId, colorValue, defaultColor) {
    var fontSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    var fontWeight = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
    var italic = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
    var underline = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    var color = /^#[0-9A-Fa-f]{6}$/.test(colorValue || '') ? colorValue : defaultColor;
    var sizeId = colorId.replace('_color', '_size');
    var weightId = colorId.replace('_color', '_weight');
    var italicId = colorId.replace('_color', '_italic');
    var underlineId = colorId.replace('_color', '_underline');
    return "\n      <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;\">\n        <span style=\"font-weight:600; font-size:0.95rem;\">".concat(title, "</span>\n        <div style=\"display:flex; align-items:center; gap:8px; flex-wrap:wrap;\">\n          <input type=\"number\" id=\"").concat(sizeId, "\" value=\"").concat(escapeAttr(fontSize), "\" placeholder=\"px\" title=\"\u0420\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430\" style=\"width:55px; height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; text-align:center; margin-bottom:0;\">\n          <select id=\"").concat(weightId, "\" title=\"\u0422\u043E\u043B\u0449\u0438\u043D\u0430 \u0448\u0440\u0438\u0444\u0442\u0430\" style=\"height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; cursor:pointer; margin-bottom:0;\">\n            <option value=\"\" ").concat(!fontWeight ? 'selected' : '', ">\u0422\u043E\u043B\u0449\u0438\u043D\u0430</option>\n            <option value=\"300\" ").concat(fontWeight === '300' ? 'selected' : '', ">\u0422\u043E\u043D\u043A\u0438\u0439</option>\n            <option value=\"500\" ").concat(fontWeight === '500' ? 'selected' : '', ">\u0421\u0440\u0435\u0434\u043D\u0438\u0439</option>\n            <option value=\"700\" ").concat(fontWeight === '700' ? 'selected' : '', ">\u0422\u043E\u043B\u0441\u0442\u044B\u0439</option>\n          </select>\n          <label title=\"\u041A\u0443\u0440\u0441\u0438\u0432\" style=\"display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:").concat(italic ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)', "; margin-bottom:0; font-style:italic; font-weight:bold; user-select:none; font-family:serif;\">\n            <input type=\"checkbox\" id=\"").concat(italicId, "\" ").concat(italic ? 'checked' : '', " style=\"display:none;\" onchange=\"this.parentElement.style.background = this.checked ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'\">\n            I\n          </label>\n          <label title=\"\u041F\u043E\u0434\u0447\u0435\u0440\u043A\u043D\u0443\u0442\u044B\u0439\" style=\"display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:").concat(underline ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)', "; margin-bottom:0; text-decoration:underline; font-weight:bold; user-select:none; font-family:serif;\">\n            <input type=\"checkbox\" id=\"").concat(underlineId, "\" ").concat(underline ? 'checked' : '', " style=\"display:none;\" onchange=\"this.parentElement.style.background = this.checked ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'\">\n            U\n          </label>\n          <input type=\"color\" id=\"").concat(colorId, "_picker\" value=\"").concat(escapeAttr(color), "\" style=\"width:30px; height:30px; padding:0; border:none; border-radius:4px; cursor:pointer; background:transparent; margin-bottom:0;\">\n          <input type=\"text\" class=\"form-control\" id=\"").concat(colorId, "\" value=\"").concat(escapeAttr(colorValue || ''), "\" placeholder=\"").concat(defaultColor, "\" style=\"max-width:90px; padding:4px 8px; font-size:0.85rem; font-family:monospace; margin-bottom:0;\">\n        </div>\n      </div>\n    ");
  }
  function renderHeroSlides(container, slides) {
    container.innerHTML = '';
    slides.forEach(function (slide, i) {
      container.insertAdjacentHTML('beforeend', "<div class=\"admin-subcard\" style=\"padding:16px;border:1px solid var(--card-border);border-radius:12px;position:relative;margin-bottom:20px;\">\n          <button type=\"button\" class=\"btn-delete\" style=\"position:absolute;top:10px;right:10px;z-index:2;\" onclick=\"AdminLanding.removeHeroSlide(".concat(i, ")\">\xD7</button>\n          \n          <div class=\"obuchenie-block-header\"><strong>\u0421\u043B\u0430\u0439\u0434 ").concat(i + 1, "</strong></div>\n          <div class=\"obuchenie-hero-grid\" style=\"margin-top: 15px;\">\n            <!-- Left: Banner upload & Preview -->\n            <div class=\"obuchenie-hero-banner-col\">\n              ").concat(heroBgUploadShell("m_hero_bg_".concat(i), 'Фон слайда (пропорции ~1520×420, сохраняется исходное разрешение)'), "\n              \n              <div style=\"margin-top:20px;\">\n                <label style=\"font-weight:600; display:block; margin-bottom:8px; font-size:0.9rem; color:var(--text-secondary);\">\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0433\u043E\u0442\u043E\u0432\u043E\u0433\u043E \u0431\u0430\u043D\u043D\u0435\u0440\u0430 \u0441 \u043D\u0430\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u043C \u0442\u0435\u043A\u0441\u0442\u043E\u043C</label>\n                <div class=\"landing-live-banner-preview\" id=\"m_hero_live_preview_").concat(i, "\">\n                  <div class=\"live-banner-title\" id=\"m_hero_live_title_").concat(i, "\">").concat(escapeAttr(slide.title), "</div>\n                  <div class=\"live-banner-subtitle\" id=\"m_hero_live_subtitle_").concat(i, "\">").concat(escapeAttr(slide.subtitle), "</div>\n                </div>\n              </div>\n            </div>\n            \n            <!-- Right: Fields -->\n            <div class=\"obuchenie-hero-fields-col\" style=\"display:flex; flex-direction:column; gap:20px;\">\n              <!-- Block \"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A\" -->\n              <!-- Block \"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A\" -->\n              <div class=\"obuchenie-hero-block\" style=\"border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);\">\n                ").concat(blockHeaderWithColorHtml('Заголовок (Enter — перенос строки)', "m_hero_title_color_".concat(i), slide.titleColor, '#ffffff', slide.titleFontSize, slide.titleFontWeight, slide.titleItalic, slide.titleUnderline), "\n                <div class=\"form-group\" style=\"margin-bottom:0; margin-top:8px;\">\n                  <textarea class=\"form-control\" id=\"m_hero_title_").concat(i, "\" rows=\"2\" placeholder=\"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0431\u0430\u043D\u043D\u0435\u0440\u0430\">").concat(escapeAttr(slide.title), "</textarea>\n                </div>\n                <div style=\"display:flex; gap:16px; margin-top:12px;\">\n                  <div style=\"flex:1; margin-bottom:0;\" class=\"form-group\">\n                    <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u0432\u0435\u0440\u0445\u0443 (px)</label>\n                    <input type=\"number\" class=\"form-control\" id=\"m_hero_title_top_").concat(i, "\" value=\"").concat(slide.titleTop !== undefined ? slide.titleTop : 122, "\" style=\"padding:6px 10px; font-size:0.85rem; margin-bottom:0;\">\n                  </div>\n                  <div style=\"flex:1; margin-bottom:0;\" class=\"form-group\">\n                    <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430 (px)</label>\n                    <input type=\"number\" class=\"form-control\" id=\"m_hero_title_left_").concat(i, "\" value=\"").concat(slide.titleLeft !== undefined ? slide.titleLeft : 70, "\" style=\"padding:6px 10px; font-size:0.85rem; margin-bottom:0;\">\n                  </div>\n                </div>\n              </div>\n              \n              <!-- Block \"\u0422\u0435\u043A\u0441\u0442\" -->\n              <div class=\"obuchenie-hero-block\" style=\"border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);\">\n                ").concat(blockHeaderWithColorHtml('Текст', "m_hero_subtitle_color_".concat(i), slide.subtitleColor, '#ffffff', slide.subtitleFontSize, slide.subtitleFontWeight, slide.subtitleItalic, slide.subtitleUnderline), "\n                <div class=\"form-group\" style=\"margin-bottom:0; margin-top:8px;\">\n                  <textarea class=\"form-control\" id=\"m_hero_subtitle_").concat(i, "\" rows=\"3\" placeholder=\"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435/\u0442\u0435\u043A\u0441\u0442 \u043F\u043E\u0434 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u043C\">").concat(escapeAttr(slide.subtitle), "</textarea>\n                </div>\n                <div style=\"display:flex; gap:16px; margin-top:12px;\">\n                  <div style=\"flex:1; margin-bottom:0;\" class=\"form-group\">\n                    <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u0432\u0435\u0440\u0445\u0443 (px)</label>\n                    <input type=\"number\" class=\"form-control\" id=\"m_hero_subtitle_top_").concat(i, "\" value=\"").concat(slide.subtitleTop !== undefined ? slide.subtitleTop : 213, "\" style=\"padding:6px 10px; font-size:0.85rem; margin-bottom:0;\">\n                  </div>\n                  <div style=\"flex:1; margin-bottom:0;\" class=\"form-group\">\n                    <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430 (px)</label>\n                    <input type=\"number\" class=\"form-control\" id=\"m_hero_subtitle_left_").concat(i, "\" value=\"").concat(slide.subtitleLeft !== undefined ? slide.subtitleLeft : 70, "\" style=\"padding:6px 10px; font-size:0.85rem; margin-bottom:0;\">\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>"));
      setTimeout(function () {
        ['title', 'subtitle'].forEach(function (field) {
          var input = document.getElementById("m_hero_".concat(field, "_").concat(i));
          var color = document.getElementById("m_hero_".concat(field, "_color_").concat(i));
          var colorPicker = document.getElementById("m_hero_".concat(field, "_color_").concat(i, "_picker"));
          var top = document.getElementById("m_hero_".concat(field, "_top_").concat(i));
          var left = document.getElementById("m_hero_".concat(field, "_left_").concat(i));
          var live = document.getElementById("m_hero_live_".concat(field, "_").concat(i));
          var size = document.getElementById("m_hero_".concat(field, "_size_").concat(i));
          var weight = document.getElementById("m_hero_".concat(field, "_weight_").concat(i));
          var italic = document.getElementById("m_hero_".concat(field, "_italic_").concat(i));
          var underline = document.getElementById("m_hero_".concat(field, "_underline_").concat(i));
          if (input && live) input.addEventListener('input', function (e) {
            return live.innerText = e.target.value;
          });
          if (color && live) color.addEventListener('input', function (e) {
            live.style.color = e.target.value;
            if (colorPicker) colorPicker.value = e.target.value;
          });
          if (colorPicker && live) colorPicker.addEventListener('input', function (e) {
            live.style.color = e.target.value;
            if (color) color.value = e.target.value;
          });
          if (top && live) top.addEventListener('input', function (e) {
            return live.style.top = "".concat(e.target.value / 420 * 100, "%");
          });
          if (left && live) left.addEventListener('input', function (e) {
            return live.style.left = "".concat(e.target.value / 1520 * 100, "%");
          });
          if (size && live) size.addEventListener('input', function (e) {
            if (e.target.value) live.style.fontSize = "calc((".concat(e.target.value, " / 1520) * 100cqw)");else live.style.removeProperty('font-size');
          });
          if (weight && live) weight.addEventListener('change', function (e) {
            if (e.target.value) live.style.fontWeight = e.target.value;else live.style.removeProperty('font-weight');
          });
          if (italic && live) italic.addEventListener('change', function (e) {
            if (e.target.checked) live.style.fontStyle = 'italic';else live.style.removeProperty('font-style');
          });
          if (underline && live) underline.addEventListener('change', function (e) {
            if (e.target.checked) live.style.textDecoration = 'underline';else live.style.removeProperty('text-decoration');
          });
        });
        setImageUploadState("m_hero_bg_".concat(i), slide.background);
        var liveTitle = document.getElementById("m_hero_live_title_".concat(i));
        if (liveTitle) {
          liveTitle.style.color = slide.titleColor || '#ffffff';
          liveTitle.style.top = "".concat((slide.titleTop !== undefined ? slide.titleTop : 122) / 420 * 100, "%");
          liveTitle.style.left = "".concat((slide.titleLeft !== undefined ? slide.titleLeft : 70) / 1520 * 100, "%");
          if (slide.titleFontSize) liveTitle.style.fontSize = "calc((".concat(slide.titleFontSize, " / 1520) * 100cqw)");
          if (slide.titleFontWeight) liveTitle.style.fontWeight = slide.titleFontWeight;
          if (slide.titleItalic) liveTitle.style.fontStyle = 'italic';
          if (slide.titleUnderline) liveTitle.style.textDecoration = 'underline';
        }
        var liveSubtitle = document.getElementById("m_hero_live_subtitle_".concat(i));
        if (liveSubtitle) {
          liveSubtitle.style.color = slide.subtitleColor || '#ffffff';
          liveSubtitle.style.top = "".concat((slide.subtitleTop !== undefined ? slide.subtitleTop : 213) / 420 * 100, "%");
          liveSubtitle.style.left = "".concat((slide.subtitleLeft !== undefined ? slide.subtitleLeft : 70) / 1520 * 100, "%");
          if (slide.subtitleFontSize) liveSubtitle.style.fontSize = "calc((".concat(slide.subtitleFontSize, " / 1520) * 100cqw)");
          if (slide.subtitleFontWeight) liveSubtitle.style.fontWeight = slide.subtitleFontWeight;
          if (slide.subtitleItalic) liveSubtitle.style.fontStyle = 'italic';
          if (slide.subtitleUnderline) liveSubtitle.style.textDecoration = 'underline';
        }
      }, 0);
    });
  }
  function renderServiceCards(container, cards) {
    container.innerHTML = '';
    cards.forEach(function (card, i) {
      var opts = SERVICE_VARIANTS.map(function (v) {
        return "<option value=\"".concat(v.id, "\" ").concat(card.variant === v.id ? 'selected' : '', ">").concat(v.label, "</option>");
      }).join('');
      container.insertAdjacentHTML('beforeend', "<div style=\"padding:16px;border:1px solid var(--card-border);border-radius:12px;\">\n          <div class=\"form-group\"><label>\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A</label><input type=\"text\" class=\"form-control\" id=\"m_svc_title_".concat(i, "\" value=\"").concat(escapeAttr(card.title), "\"></div>\n          <div class=\"form-group\"><label>\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</label><input type=\"text\" class=\"form-control\" id=\"m_svc_desc_").concat(i, "\" value=\"").concat(escapeAttr(card.desc), "\"></div>\n          <div class=\"form-group\"><label>\u0421\u0441\u044B\u043B\u043A\u0430</label><input type=\"text\" class=\"form-control\" id=\"m_svc_link_").concat(i, "\" value=\"").concat(escapeAttr(card.link), "\"></div>\n          <div class=\"form-group\"><label>\u0426\u0432\u0435\u0442 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438</label><select class=\"form-control\" id=\"m_svc_variant_").concat(i, "\">").concat(opts, "</select></div>\n          ").concat(imageUploadHtml("m_svc_icon_".concat(i), 'Картинка блока'), "\n        </div>"));
      setImageUploadState("m_svc_icon_".concat(i), card.icon);
    });
  }
  function renderPartners(container, partners) {
    container.innerHTML = '';
    partners.forEach(function (p, i) {
      container.insertAdjacentHTML('beforeend', "<div class=\"partner-admin-card\">\n          <button type=\"button\" class=\"btn-delete partner-admin-card__remove\" onclick=\"AdminLanding.removePartner(".concat(i, ")\" aria-label=\"\u0423\u0434\u0430\u043B\u0438\u0442\u044C\">\xD7</button>\n          <div class=\"form-group\"><label>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 (alt)</label><input type=\"text\" class=\"form-control\" id=\"m_partner_alt_").concat(i, "\" value=\"").concat(escapeAttr(p.alt), "\"></div>\n          ").concat(partnerImageUploadHtml("m_partner_img_".concat(i), p.image), "\n        </div>"));
    });
  }
  function truncateReviewText(text) {
    var s = String(text || '');
    return s.length > REVIEW_TEXT_MAX_LENGTH ? s.slice(0, REVIEW_TEXT_MAX_LENGTH) : s;
  }
  function updateReviewTextLimit(textarea) {
    var _textarea$closest;
    if (!textarea) return;
    var max = REVIEW_TEXT_MAX_LENGTH;
    if (textarea.value.length > max) {
      textarea.value = textarea.value.slice(0, max);
    }
    var counter = (_textarea$closest = textarea.closest('.review-admin-card')) === null || _textarea$closest === void 0 ? void 0 : _textarea$closest.querySelector('.review-admin-card__counter');
    if (counter) {
      var len = textarea.value.length;
      counter.textContent = "".concat(len, " / ").concat(max);
      counter.classList.toggle('review-admin-card__counter--limit', len >= max);
    }
  }
  function bindReviewTextLimits(root) {
    if (!root) return;
    root.querySelectorAll('textarea[id^="m_rev_text_"]').forEach(function (ta) {
      ta.setAttribute('maxlength', String(REVIEW_TEXT_MAX_LENGTH));
      ta.addEventListener('input', function () {
        return updateReviewTextLimit(ta);
      });
      ta.addEventListener('paste', function () {
        requestAnimationFrame(function () {
          return updateReviewTextLimit(ta);
        });
      });
      updateReviewTextLimit(ta);
    });
  }
  function renderReviews(container, reviews) {
    container.innerHTML = '';
    reviews.forEach(function (r, i) {
      var _r$nameLines, _r$nameLines2, _r$roleLines, _r$roleLines2;
      var num = i + 1;
      var reviewText = truncateReviewText(r.text);
      container.insertAdjacentHTML('beforeend', "<div class=\"review-admin-card\">\n          <div class=\"review-admin-card__head\">\n            <span class=\"review-admin-card__title\">\u041E\u0442\u0437\u044B\u0432 \u2116".concat(num, "</span>\n            <button type=\"button\" class=\"btn-delete review-admin-card__remove\" onclick=\"AdminLanding.removeReview(").concat(i, ")\" aria-label=\"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043E\u0442\u0437\u044B\u0432 \u2116").concat(num, "\">\xD7</button>\n          </div>\n          <div class=\"form-group review-admin-card__text-field\">\n            <div class=\"review-admin-card__label-row\">\n              <label for=\"m_rev_text_").concat(i, "\">\u0422\u0435\u043A\u0441\u0442</label>\n              <span class=\"review-admin-card__counter\" id=\"m_rev_count_").concat(i, "\">0 / ").concat(REVIEW_TEXT_MAX_LENGTH, "</span>\n            </div>\n            <textarea class=\"form-control review-admin-card__textarea\" id=\"m_rev_text_").concat(i, "\" rows=\"7\" maxlength=\"").concat(REVIEW_TEXT_MAX_LENGTH, "\">").concat(escapeAttr(reviewText), "</textarea>\n          </div>\n          <div class=\"review-admin-card__meta\">\n            <div class=\"form-group\">\n              <label for=\"m_rev_name1_").concat(i, "\">\u0418\u043C\u044F 1</label>\n              <input type=\"text\" class=\"form-control\" id=\"m_rev_name1_").concat(i, "\" value=\"").concat(escapeAttr(((_r$nameLines = r.nameLines) === null || _r$nameLines === void 0 ? void 0 : _r$nameLines[0]) || ''), "\">\n            </div>\n            <div class=\"form-group\">\n              <label for=\"m_rev_name2_").concat(i, "\">\u0418\u043C\u044F 2</label>\n              <input type=\"text\" class=\"form-control\" id=\"m_rev_name2_").concat(i, "\" value=\"").concat(escapeAttr(((_r$nameLines2 = r.nameLines) === null || _r$nameLines2 === void 0 ? void 0 : _r$nameLines2[1]) || ''), "\">\n            </div>\n            <div class=\"form-group\">\n              <label for=\"m_rev_role1_").concat(i, "\">\u0414\u043E\u043B\u0436\u043D. 1</label>\n              <input type=\"text\" class=\"form-control\" id=\"m_rev_role1_").concat(i, "\" value=\"").concat(escapeAttr(((_r$roleLines = r.roleLines) === null || _r$roleLines === void 0 ? void 0 : _r$roleLines[0]) || ''), "\">\n            </div>\n            <div class=\"form-group\">\n              <label for=\"m_rev_role2_").concat(i, "\">\u0414\u043E\u043B\u0436\u043D. 2</label>\n              <input type=\"text\" class=\"form-control\" id=\"m_rev_role2_").concat(i, "\" value=\"").concat(escapeAttr(((_r$roleLines2 = r.roleLines) === null || _r$roleLines2 === void 0 ? void 0 : _r$roleLines2[1]) || ''), "\">\n            </div>\n          </div>\n        </div>"));
    });
    bindReviewTextLimits(container);
  }
  function renderChatTextList(container, items, prefix, labelPrefix) {
    if (!container) return;
    container.innerHTML = '';
    var list = Array.isArray(items) && items.length ? items : [''];
    list.forEach(function (text, i) {
      var num = i + 1;
      container.insertAdjacentHTML('beforeend', "<div class=\"review-admin-card chat-text-admin-card\">\n          <div class=\"review-admin-card__head\">\n            <span class=\"review-admin-card__title\">".concat(labelPrefix, " \u2116").concat(num, "</span>\n            <button type=\"button\" class=\"btn-delete review-admin-card__remove\" onclick=\"AdminLanding.removeChatText('").concat(prefix, "', ").concat(i, ")\" aria-label=\"\u0423\u0434\u0430\u043B\u0438\u0442\u044C ").concat(labelPrefix.toLowerCase(), " \u2116").concat(num, "\">\xD7</button>\n          </div>\n          <div class=\"form-group review-admin-card__text-field\">\n            <textarea class=\"form-control review-admin-card__textarea\" id=\"m_chat_").concat(prefix, "_").concat(i, "\" rows=\"4\" maxlength=\"").concat(CHAT_TEXT_MAX_LENGTH, "\">").concat(escapeAttr(text), "</textarea>\n          </div>\n        </div>"));
    });
  }
  function collectChatTextList(prefix) {
    var inputs = Array.from(document.querySelectorAll("textarea[id^=\"m_chat_".concat(prefix, "_\"]"))).sort(function (a, b) {
      var indexFromId = function indexFromId(el) {
        return parseInt(el.id.replace("m_chat_".concat(prefix, "_"), ''), 10);
      };
      return indexFromId(a) - indexFromId(b);
    });
    return inputs.map(function (input) {
      return (input.value || '').trim();
    }).filter(Boolean);
  }
  function renderConsultPhotos(container, photos) {
    container.innerHTML = '';
    var list = Array.isArray(photos) && photos.length ? photos : [''];
    list.forEach(function (src, i) {
      var uploadId = "m_consult_photo_".concat(i);
      container.insertAdjacentHTML('beforeend', "<div class=\"consult-photo-card\">\n          ".concat(consultPhotoUploadShell(uploadId, "\u0424\u043E\u0442\u043E ".concat(i + 1), i), "\n        </div>"));
      setImageUploadState(uploadId, src);
    });
  }
  function renderSocialLinksAdmin(container, socialLinks) {
    if (!container) return;
    var list = socialLinks && socialLinks.length ? socialLinks : DEFAULT_LANDING_MAIN.socialLinks;
    container.innerHTML = list.map(function (link, i) {
      var platform = link.id === 'max' ? 'Max' : link.id === 'tg' ? 'Telegram' : 'ВКонтакте';
      return "<div class=\"admin-social-row\" style=\"display:grid;grid-template-columns:120px 1fr 1fr;gap:12px;align-items:center;margin-bottom:12px;\">\n          <span style=\"font-weight:600;\">".concat(escapeAttr(platform), "</span>\n          <input type=\"text\" class=\"form-control\" id=\"m_social_label_").concat(i, "\" value=\"").concat(escapeAttr(link.label || ''), "\" placeholder=\"\u041F\u043E\u0434\u043F\u0438\u0441\u044C\">\n          <input type=\"url\" class=\"form-control\" id=\"m_social_href_").concat(i, "\" value=\"").concat(escapeAttr(link.href || ''), "\" placeholder=\"https://...\">\n          <input type=\"hidden\" id=\"m_social_id_").concat(i, "\" value=\"").concat(escapeAttr(link.id || ''), "\">\n        </div>");
    }).join('');
  }
  function collectSocialLinksFromForm() {
    var links = [];
    var count = document.querySelectorAll('[id^="m_social_href_"]').length;
    for (var i = 0; i < count; i++) {
      var _document$getElementB, _DEFAULT_LANDING_MAIN, _document$getElementB2, _document$getElementB3;
      links.push({
        id: ((_document$getElementB = document.getElementById("m_social_id_".concat(i))) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value) || ((_DEFAULT_LANDING_MAIN = DEFAULT_LANDING_MAIN.socialLinks[i]) === null || _DEFAULT_LANDING_MAIN === void 0 ? void 0 : _DEFAULT_LANDING_MAIN.id) || 'max',
        label: ((_document$getElementB2 = document.getElementById("m_social_label_".concat(i))) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.value) || '',
        href: ((_document$getElementB3 = document.getElementById("m_social_href_".concat(i))) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.value) || '#'
      });
    }
    return links.length ? links : _toConsumableArray(DEFAULT_LANDING_MAIN.socialLinks);
  }
  var PROMO_BANNER_W = 1520;
  var PROMO_BANNER_H = 253;
  function promoBgUploadShell(id, label) {
    return "\n      <div class=\"form-group hero-slide-upload-group\" style=\"margin-bottom:0;\">\n        <label>".concat(label, "</label>\n        <div class=\"hero-slide-frame hero-slide-frame--promo hero-slide-frame--empty\" data-upload-frame-for=\"").concat(id, "\">\n          <span class=\"hero-slide-frame__empty\">\u043F\u0440\u043E\u043F\u043E\u0440\u0446\u0438\u0438 1520\xD7253</span>\n          <img id=\"").concat(id, "_preview\" class=\"hero-slide-frame__img\" src=\"\" alt=\"\">\n        </div>\n        <div class=\"hero-slide-upload-actions image-upload-mini\" data-upload-id=\"").concat(id, "\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:8px 14px;font-size:0.85rem;\" onclick=\"AdminLanding.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n          <button type=\"button\" class=\"btn-delete\" style=\"padding:8px 14px;font-size:0.85rem;display:none;\" id=\"").concat(id, "_clear\" onclick=\"AdminLanding.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n          <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n        </div>\n      </div>");
  }
  function resolvePromoColor(colorId, fallback) {
    var _document$getElementById, _document$getElementById2;
    var text = ((_document$getElementById = document.getElementById(colorId)) === null || _document$getElementById === void 0 || (_document$getElementById = _document$getElementById.value) === null || _document$getElementById === void 0 ? void 0 : _document$getElementById.trim()) || '';
    if (/^#[0-9A-Fa-f]{6}$/.test(text)) return text;
    if (/^[0-9A-Fa-f]{6}$/.test(text)) return "#".concat(text);
    var picker = ((_document$getElementById2 = document.getElementById("".concat(colorId, "_picker"))) === null || _document$getElementById2 === void 0 ? void 0 : _document$getElementById2.value) || '';
    if (/^#[0-9A-Fa-f]{6}$/.test(picker)) return picker;
    return fallback || '#ffffff';
  }
  function applyPromoPreviewStyles() {
    var _document$getElementById3, _document$getElementById4, _document$getElementById5, _document$getElementById6, _document$getElementById7, _document$getElementById8, _document$getElementById9, _document$getElementById0, _document$getElementById1, _document$getElementById10, _document$getElementById11, _document$getElementById12, _document$getElementById13, _document$getElementById14;
    var preview = document.getElementById('m_promo_live_preview');
    var titleLive = document.getElementById('m_promo_live_title');
    var dateLive = document.getElementById('m_promo_live_date');
    if (!preview) return;
    var bg = readImageVal('m_promo_img');
    preview.style.backgroundImage = bg ? "url('".concat(bg.replace(/'/g, "\\'"), "')") : 'radial-gradient(32.3% 55.38% at 71.22% 54%, #FFFFFF 0%, #B8FDC6 100%)';
    var titleTop = parseFloat((_document$getElementById3 = document.getElementById('m_promo_title_top')) === null || _document$getElementById3 === void 0 ? void 0 : _document$getElementById3.value) || 40;
    var titleLeft = parseFloat((_document$getElementById4 = document.getElementById('m_promo_title_left')) === null || _document$getElementById4 === void 0 ? void 0 : _document$getElementById4.value) || 80;
    var dateTop = parseFloat((_document$getElementById5 = document.getElementById('m_promo_date_top')) === null || _document$getElementById5 === void 0 ? void 0 : _document$getElementById5.value) || 160;
    var dateLeft = parseFloat((_document$getElementById6 = document.getElementById('m_promo_date_left')) === null || _document$getElementById6 === void 0 ? void 0 : _document$getElementById6.value) || 80;
    if (titleLive) {
      var titleValue = (((_document$getElementById7 = document.getElementById('m_promo_title')) === null || _document$getElementById7 === void 0 ? void 0 : _document$getElementById7.value) || '').trim();
      titleLive.innerHTML = escapeAttr(titleValue).split('\n').join('<br>');
      titleLive.style.color = resolvePromoColor('m_promo_title_color', '#ffffff');
      titleLive.style.top = "calc((".concat(titleTop, " / ").concat(PROMO_BANNER_H, ") * 100%)");
      titleLive.style.left = "calc((".concat(titleLeft, " / ").concat(PROMO_BANNER_W, ") * 100%)");
      titleLive.style.maxWidth = "calc(100% - ((".concat(titleLeft, " / ").concat(PROMO_BANNER_W, ") * 100%) - 10px)");
      var titleSize = ((_document$getElementById8 = document.getElementById('m_promo_title_size')) === null || _document$getElementById8 === void 0 ? void 0 : _document$getElementById8.value) || '';
      var titleWeight = ((_document$getElementById9 = document.getElementById('m_promo_title_weight')) === null || _document$getElementById9 === void 0 ? void 0 : _document$getElementById9.value) || '';
      if (titleSize) titleLive.style.fontSize = "calc((".concat(titleSize, " / ").concat(PROMO_BANNER_W, ") * 100cqw)");else titleLive.style.removeProperty('font-size');
      if (titleWeight) titleLive.style.fontWeight = titleWeight;else titleLive.style.removeProperty('font-weight');
      titleLive.style.fontStyle = ((_document$getElementById0 = document.getElementById('m_promo_title_italic')) === null || _document$getElementById0 === void 0 ? void 0 : _document$getElementById0.checked) ? 'italic' : '';
      titleLive.style.textDecoration = ((_document$getElementById1 = document.getElementById('m_promo_title_underline')) === null || _document$getElementById1 === void 0 ? void 0 : _document$getElementById1.checked) ? 'underline' : '';
    }
    if (dateLive) {
      dateLive.textContent = ((_document$getElementById10 = document.getElementById('m_promo_date')) === null || _document$getElementById10 === void 0 ? void 0 : _document$getElementById10.value) || '';
      dateLive.style.color = resolvePromoColor('m_promo_date_color', '#ffffff');
      dateLive.style.top = "calc((".concat(dateTop, " / ").concat(PROMO_BANNER_H, ") * 100%)");
      dateLive.style.left = "calc((".concat(dateLeft, " / ").concat(PROMO_BANNER_W, ") * 100%)");
      dateLive.style.maxWidth = "calc(100% - ((".concat(dateLeft, " / ").concat(PROMO_BANNER_W, ") * 100%) - 10px)");
      var dateSize = ((_document$getElementById11 = document.getElementById('m_promo_date_size')) === null || _document$getElementById11 === void 0 ? void 0 : _document$getElementById11.value) || '';
      var dateWeight = ((_document$getElementById12 = document.getElementById('m_promo_date_weight')) === null || _document$getElementById12 === void 0 ? void 0 : _document$getElementById12.value) || '';
      if (dateSize) dateLive.style.fontSize = "calc((".concat(dateSize, " / ").concat(PROMO_BANNER_W, ") * 100cqw)");else dateLive.style.removeProperty('font-size');
      if (dateWeight) dateLive.style.fontWeight = dateWeight;else dateLive.style.removeProperty('font-weight');
      dateLive.style.fontStyle = ((_document$getElementById13 = document.getElementById('m_promo_date_italic')) === null || _document$getElementById13 === void 0 ? void 0 : _document$getElementById13.checked) ? 'italic' : '';
      dateLive.style.textDecoration = ((_document$getElementById14 = document.getElementById('m_promo_date_underline')) === null || _document$getElementById14 === void 0 ? void 0 : _document$getElementById14.checked) ? 'underline' : '';
    }
  }
  function wirePromoLivePreview() {
    var refresh = function refresh() {
      return applyPromoPreviewStyles();
    };
    ['title', 'date'].forEach(function (field) {
      var input = document.getElementById("m_promo_".concat(field));
      var color = document.getElementById("m_promo_".concat(field, "_color"));
      var colorPicker = document.getElementById("m_promo_".concat(field, "_color_picker"));
      var size = document.getElementById("m_promo_".concat(field, "_size"));
      var weight = document.getElementById("m_promo_".concat(field, "_weight"));
      var italic = document.getElementById("m_promo_".concat(field, "_italic"));
      var underline = document.getElementById("m_promo_".concat(field, "_underline"));
      var top = document.getElementById("m_promo_".concat(field, "_top"));
      var left = document.getElementById("m_promo_".concat(field, "_left"));
      if (input) input.addEventListener('input', refresh);
      if (colorPicker) colorPicker.addEventListener('input', function (e) {
        if (color) color.value = e.target.value.toUpperCase();
        refresh();
      });
      if (color) color.addEventListener('input', function (e) {
        var v = String(e.target.value || '').trim();
        if (/^[0-9A-Fa-f]{6}$/.test(v)) v = "#".concat(v);
        if (/^#[0-9A-Fa-f]{6}$/.test(v) && colorPicker) colorPicker.value = v.toLowerCase();
        refresh();
      });
      if (size) size.addEventListener('input', refresh);
      if (weight) weight.addEventListener('change', refresh);
      if (italic) italic.addEventListener('change', refresh);
      if (underline) underline.addEventListener('change', refresh);
      if (top) top.addEventListener('input', refresh);
      if (left) left.addEventListener('input', refresh);
    });
    var link = document.getElementById('m_promo_link');
    if (link) link.addEventListener('input', refresh);
  }
  function renderPromoBannerAdmin(container, promo) {
    var p = _objectSpread(_objectSpread({}, DEFAULT_LANDING_MAIN.promoBanner), promo || {});
    if (!container) return;
    container.innerHTML = "\n      <div class=\"obuchenie-hero-grid\">\n        <div class=\"obuchenie-hero-banner-col\">\n          ".concat(promoBgUploadShell('m_promo_img', 'Фон баннера (пропорции ~1520×253)'), "\n          <div style=\"margin-top:20px;\">\n            <label style=\"font-weight:600;display:block;margin-bottom:8px;font-size:0.9rem;color:var(--text-secondary);\">\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440</label>\n            <div class=\"landing-live-promo-preview\" id=\"m_promo_live_preview\">\n              <div class=\"live-banner-title\" id=\"m_promo_live_title\">").concat(escapeAttr(p.title), "</div>\n              <div class=\"live-banner-subtitle\" id=\"m_promo_live_date\">").concat(escapeAttr(p.date), "</div>\n            </div>\n          </div>\n        </div>\n        <div class=\"obuchenie-hero-fields-col\" style=\"display:flex;flex-direction:column;gap:20px;\">\n          <div class=\"obuchenie-hero-block\" style=\"border:1px solid var(--card-border);padding:15px;border-radius:8px;background:rgba(255,255,255,0.02);\">\n            ").concat(blockHeaderWithColorHtml('Заголовок (Enter — перенос)', 'm_promo_title_color', p.titleColor, '#ffffff', p.titleFontSize, p.titleFontWeight, p.titleItalic, p.titleUnderline), "\n            <div class=\"form-group\" style=\"margin-bottom:0;margin-top:8px;\">\n              <textarea class=\"form-control\" id=\"m_promo_title\" rows=\"2\">").concat(escapeAttr(p.title), "</textarea>\n            </div>\n            <div style=\"display:flex;gap:16px;margin-top:12px;\">\n              <div style=\"flex:1;margin-bottom:0;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u0432\u0435\u0440\u0445\u0443 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"m_promo_title_top\" value=\"").concat(p.titleTop !== undefined ? p.titleTop : 40, "\" style=\"padding:6px 10px;font-size:0.85rem;margin-bottom:0;\">\n              </div>\n              <div style=\"flex:1;margin-bottom:0;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"m_promo_title_left\" value=\"").concat(p.titleLeft !== undefined ? p.titleLeft : 80, "\" style=\"padding:6px 10px;font-size:0.85rem;margin-bottom:0;\">\n              </div>\n            </div>\n          </div>\n          <div class=\"obuchenie-hero-block\" style=\"border:1px solid var(--card-border);padding:15px;border-radius:8px;background:rgba(255,255,255,0.02);\">\n            ").concat(blockHeaderWithColorHtml('Дата / подпись', 'm_promo_date_color', p.dateColor, '#ffffff', p.dateFontSize, p.dateFontWeight, p.dateItalic, p.dateUnderline), "\n            <div class=\"form-group\" style=\"margin-bottom:0;margin-top:8px;\">\n              <input type=\"text\" class=\"form-control\" id=\"m_promo_date\" value=\"").concat(escapeAttr(p.date), "\">\n            </div>\n            <div style=\"display:flex;gap:16px;margin-top:12px;\">\n              <div style=\"flex:1;margin-bottom:0;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u0432\u0435\u0440\u0445\u0443 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"m_promo_date_top\" value=\"").concat(p.dateTop !== undefined ? p.dateTop : 160, "\" style=\"padding:6px 10px;font-size:0.85rem;margin-bottom:0;\">\n              </div>\n              <div style=\"flex:1;margin-bottom:0;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"m_promo_date_left\" value=\"").concat(p.dateLeft !== undefined ? p.dateLeft : 80, "\" style=\"padding:6px 10px;font-size:0.85rem;margin-bottom:0;\">\n              </div>\n            </div>\n          </div>\n          <div class=\"form-group\" style=\"margin-bottom:0;\">\n            <label>\u0421\u0441\u044B\u043B\u043A\u0430 \u043F\u0440\u0438 \u043A\u043B\u0438\u043A\u0435 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)</label>\n            <input type=\"text\" class=\"form-control\" id=\"m_promo_link\" value=\"").concat(escapeAttr(p.link), "\" placeholder=\"seminars.html \u0438\u043B\u0438 https://...\">\n          </div>\n        </div>\n      </div>");
    setImageUploadState('m_promo_img', p.image || '');
    wirePromoLivePreview();
    applyPromoPreviewStyles();
  }
  function collectPromoBannerFromForm() {
    var _document$getElementById15, _document$getElementById16, _document$getElementById17, _document$getElementById18, _document$getElementById19, _document$getElementById20, _document$getElementById21, _document$getElementById22, _document$getElementById23, _document$getElementById24, _document$getElementById25, _document$getElementById26, _document$getElementById27, _document$getElementById28, _document$getElementById29, _document$getElementById30, _document$getElementById31;
    return {
      title: (((_document$getElementById15 = document.getElementById('m_promo_title')) === null || _document$getElementById15 === void 0 ? void 0 : _document$getElementById15.value) || '').trim(),
      titleColor: resolvePromoColor('m_promo_title_color', '#ffffff'),
      titleTop: parseInt(((_document$getElementById16 = document.getElementById('m_promo_title_top')) === null || _document$getElementById16 === void 0 ? void 0 : _document$getElementById16.value) || '40', 10),
      titleLeft: parseInt(((_document$getElementById17 = document.getElementById('m_promo_title_left')) === null || _document$getElementById17 === void 0 ? void 0 : _document$getElementById17.value) || '80', 10),
      titleFontSize: ((_document$getElementById18 = document.getElementById('m_promo_title_size')) === null || _document$getElementById18 === void 0 ? void 0 : _document$getElementById18.value) || '',
      titleFontWeight: ((_document$getElementById19 = document.getElementById('m_promo_title_weight')) === null || _document$getElementById19 === void 0 ? void 0 : _document$getElementById19.value) || '',
      titleItalic: ((_document$getElementById20 = document.getElementById('m_promo_title_italic')) === null || _document$getElementById20 === void 0 ? void 0 : _document$getElementById20.checked) || false,
      titleUnderline: ((_document$getElementById21 = document.getElementById('m_promo_title_underline')) === null || _document$getElementById21 === void 0 ? void 0 : _document$getElementById21.checked) || false,
      date: (((_document$getElementById22 = document.getElementById('m_promo_date')) === null || _document$getElementById22 === void 0 ? void 0 : _document$getElementById22.value) || '').trim(),
      dateColor: resolvePromoColor('m_promo_date_color', '#ffffff'),
      dateTop: parseInt(((_document$getElementById23 = document.getElementById('m_promo_date_top')) === null || _document$getElementById23 === void 0 ? void 0 : _document$getElementById23.value) || '160', 10),
      dateLeft: parseInt(((_document$getElementById24 = document.getElementById('m_promo_date_left')) === null || _document$getElementById24 === void 0 ? void 0 : _document$getElementById24.value) || '80', 10),
      dateFontSize: ((_document$getElementById25 = document.getElementById('m_promo_date_size')) === null || _document$getElementById25 === void 0 ? void 0 : _document$getElementById25.value) || '',
      dateFontWeight: ((_document$getElementById26 = document.getElementById('m_promo_date_weight')) === null || _document$getElementById26 === void 0 ? void 0 : _document$getElementById26.value) || '',
      dateItalic: ((_document$getElementById27 = document.getElementById('m_promo_date_italic')) === null || _document$getElementById27 === void 0 ? void 0 : _document$getElementById27.checked) || false,
      dateUnderline: ((_document$getElementById28 = document.getElementById('m_promo_date_underline')) === null || _document$getElementById28 === void 0 ? void 0 : _document$getElementById28.checked) || false,
      link: ((_document$getElementById29 = document.getElementById('m_promo_link')) === null || _document$getElementById29 === void 0 ? void 0 : _document$getElementById29.value) || '',
      image: readImageVal('m_promo_img')
    };
  }
  function renderMainPageAdmin(mainPageData) {
    var _mainPageData$consult;
    var logoEl = document.getElementById('mLogoAdmin');
    if (logoEl) {
      logoEl.innerHTML = imageUploadHtml('m_logo', 'Логотип');
      setImageUploadState('m_logo', mainPageData.logo || '');
    }
    var heroEl = document.getElementById('mHeroSlidesAdmin');
    var svcEl = document.getElementById('mServiceCardsAdmin');
    var promoEl = document.getElementById('mPromoBannerAdmin');
    if (promoEl) renderPromoBannerAdmin(promoEl, mainPageData.promoBanner || {});
    if (heroEl) renderHeroSlides(heroEl, mainPageData.heroSlides || []);
    if (svcEl) renderServiceCards(svcEl, mainPageData.serviceCards || []);
    renderPartners(document.getElementById('mPartnersAdmin'), mainPageData.partners || []);
    renderReviews(document.getElementById('mReviewsAdmin'), mainPageData.reviews || []);
    renderSocialLinksAdmin(document.getElementById('mSocialAdmin'), mainPageData.socialLinks || []);
    renderConsultPhotos(document.getElementById('mConsultPhotosAdmin'), ((_mainPageData$consult = mainPageData.consultation) === null || _mainPageData$consult === void 0 ? void 0 : _mainPageData$consult.photos) || []);
    var chatWidget = mainPageData.chatWidget || DEFAULT_LANDING_MAIN.chatWidget || {};
    var chatNameInput = document.getElementById('m_chat_operator_name');
    if (chatNameInput) chatNameInput.value = chatWidget.operatorName || 'Анна';
    setImageUploadState('m_chat_operator_avatar', chatWidget.operatorAvatar || '');
    renderChatTextList(document.getElementById('mChatWelcomeAdmin'), chatWidget.welcomeMessages || DEFAULT_LANDING_MAIN.chatWidget.welcomeMessages, 'welcome', 'Приветствие');
    renderChatTextList(document.getElementById('mChatAutoReplyAdmin'), chatWidget.autoReplies || DEFAULT_LANDING_MAIN.chatWidget.autoReplies, 'autoreply', 'Автоответ');
  }
  function readImageVal(id) {
    var _document$getElementB4;
    return ((_document$getElementB4 = document.getElementById("".concat(id, "_val"))) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value) || '';
  }
  function collectConsultationPhotosFromForm() {
    var inputs = Array.from(document.querySelectorAll('input[type="hidden"][id^="m_consult_photo_"][id$="_val"]')).sort(function (a, b) {
      var indexFromId = function indexFromId(el) {
        return parseInt(el.id.replace('m_consult_photo_', '').replace('_val', ''), 10);
      };
      return indexFromId(a) - indexFromId(b);
    });
    var photos = [];
    inputs.forEach(function (input) {
      var v = (input.value || '').trim();
      if (v) photos.push(v);
    });
    return photos;
  }
  function consultationPhotosForSave() {
    var photos = collectConsultationPhotosFromForm();
    return photos.length ? photos : ['assets/img/mask_group.png'];
  }
  function syncConsultPhotoToMemory(uploadId, dataUrl) {
    var match = /^m_consult_photo_(\d+)$/.exec(uploadId || '');
    if (!match || !window.mainPageData) return;
    var index = parseInt(match[1], 10);
    var main = window.mainPageData;
    if (!main.consultation) main.consultation = {
      photos: []
    };
    var photos = Array.isArray(main.consultation.photos) ? _toConsumableArray(main.consultation.photos) : [];
    while (photos.length <= index) photos.push('');
    photos[index] = dataUrl;
    main.consultation.photos = photos;
  }
  function clearConsultPhotoInMemory(uploadId) {
    var _window$mainPageData;
    var match = /^m_consult_photo_(\d+)$/.exec(uploadId || '');
    if (!match || !((_window$mainPageData = window.mainPageData) !== null && _window$mainPageData !== void 0 && (_window$mainPageData = _window$mainPageData.consultation) !== null && _window$mainPageData !== void 0 && _window$mainPageData.photos)) return;
    var index = parseInt(match[1], 10);
    var photos = window.mainPageData.consultation.photos;
    if (index >= 0 && index < photos.length) photos[index] = '';
  }
  function collectMainPageFromForm(mainPageData) {
    var _document$getElementB32;
    var heroSlides = [];
    var heroCount = document.querySelectorAll('[id^="m_hero_bg_"][type="hidden"]').length;
    for (var i = 0; i < heroCount; i++) {
      var _document$getElementB5, _document$getElementB6, _document$getElementB7, _document$getElementB8, _document$getElementB9, _document$getElementB0, _document$getElementB1, _document$getElementB10, _document$getElementB11, _document$getElementB12, _document$getElementB13, _document$getElementB14, _document$getElementB15, _document$getElementB16, _document$getElementB17, _document$getElementB18;
      heroSlides.push({
        title: ((_document$getElementB5 = document.getElementById("m_hero_title_".concat(i))) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.value) || '',
        titleColor: ((_document$getElementB6 = document.getElementById("m_hero_title_color_".concat(i))) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.value) || '',
        titleTop: parseInt(((_document$getElementB7 = document.getElementById("m_hero_title_top_".concat(i))) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.value) || 122, 10),
        titleLeft: parseInt(((_document$getElementB8 = document.getElementById("m_hero_title_left_".concat(i))) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.value) || 70, 10),
        titleFontSize: ((_document$getElementB9 = document.getElementById("m_hero_title_size_".concat(i))) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.value) || '',
        titleFontWeight: ((_document$getElementB0 = document.getElementById("m_hero_title_weight_".concat(i))) === null || _document$getElementB0 === void 0 ? void 0 : _document$getElementB0.value) || '',
        titleItalic: ((_document$getElementB1 = document.getElementById("m_hero_title_italic_".concat(i))) === null || _document$getElementB1 === void 0 ? void 0 : _document$getElementB1.checked) || false,
        titleUnderline: ((_document$getElementB10 = document.getElementById("m_hero_title_underline_".concat(i))) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.checked) || false,
        subtitle: ((_document$getElementB11 = document.getElementById("m_hero_subtitle_".concat(i))) === null || _document$getElementB11 === void 0 ? void 0 : _document$getElementB11.value) || '',
        subtitleColor: ((_document$getElementB12 = document.getElementById("m_hero_subtitle_color_".concat(i))) === null || _document$getElementB12 === void 0 ? void 0 : _document$getElementB12.value) || '',
        subtitleTop: parseInt(((_document$getElementB13 = document.getElementById("m_hero_subtitle_top_".concat(i))) === null || _document$getElementB13 === void 0 ? void 0 : _document$getElementB13.value) || 213, 10),
        subtitleLeft: parseInt(((_document$getElementB14 = document.getElementById("m_hero_subtitle_left_".concat(i))) === null || _document$getElementB14 === void 0 ? void 0 : _document$getElementB14.value) || 70, 10),
        subtitleFontSize: ((_document$getElementB15 = document.getElementById("m_hero_subtitle_size_".concat(i))) === null || _document$getElementB15 === void 0 ? void 0 : _document$getElementB15.value) || '',
        subtitleFontWeight: ((_document$getElementB16 = document.getElementById("m_hero_subtitle_weight_".concat(i))) === null || _document$getElementB16 === void 0 ? void 0 : _document$getElementB16.value) || '',
        subtitleItalic: ((_document$getElementB17 = document.getElementById("m_hero_subtitle_italic_".concat(i))) === null || _document$getElementB17 === void 0 ? void 0 : _document$getElementB17.checked) || false,
        subtitleUnderline: ((_document$getElementB18 = document.getElementById("m_hero_subtitle_underline_".concat(i))) === null || _document$getElementB18 === void 0 ? void 0 : _document$getElementB18.checked) || false,
        background: readImageVal("m_hero_bg_".concat(i))
      });
    }
    var serviceCards = [];
    var svcCount = document.querySelectorAll('[id^="m_svc_title_"]').length;
    for (var _i = 0; _i < svcCount; _i++) {
      var _document$getElementB19, _document$getElementB20, _document$getElementB21, _document$getElementB22;
      var link = ((_document$getElementB19 = document.getElementById("m_svc_link_".concat(_i))) === null || _document$getElementB19 === void 0 ? void 0 : _document$getElementB19.value) || '#';
      serviceCards.push({
        title: ((_document$getElementB20 = document.getElementById("m_svc_title_".concat(_i))) === null || _document$getElementB20 === void 0 ? void 0 : _document$getElementB20.value) || '',
        desc: ((_document$getElementB21 = document.getElementById("m_svc_desc_".concat(_i))) === null || _document$getElementB21 === void 0 ? void 0 : _document$getElementB21.value) || '',
        link: link,
        variant: ((_document$getElementB22 = document.getElementById("m_svc_variant_".concat(_i))) === null || _document$getElementB22 === void 0 ? void 0 : _document$getElementB22.value) || 'green',
        icon: readImageVal("m_svc_icon_".concat(_i)),
        external: /^https?:\/\//i.test(link)
      });
    }
    var partners = [];
    var pCount = document.querySelectorAll('[id^="m_partner_alt_"]').length;
    for (var _i2 = 0; _i2 < pCount; _i2++) {
      var _document$getElementB23;
      partners.push({
        alt: ((_document$getElementB23 = document.getElementById("m_partner_alt_".concat(_i2))) === null || _document$getElementB23 === void 0 ? void 0 : _document$getElementB23.value) || '',
        image: readImageVal("m_partner_img_".concat(_i2))
      });
    }
    var reviews = [];
    var rCount = document.querySelectorAll('[id^="m_rev_text_"]').length;
    for (var _i3 = 0; _i3 < rCount; _i3++) {
      var _document$getElementB24, _document$getElementB25, _document$getElementB26, _document$getElementB27, _document$getElementB28;
      reviews.push({
        text: truncateReviewText(((_document$getElementB24 = document.getElementById("m_rev_text_".concat(_i3))) === null || _document$getElementB24 === void 0 ? void 0 : _document$getElementB24.value) || ''),
        nameLines: [((_document$getElementB25 = document.getElementById("m_rev_name1_".concat(_i3))) === null || _document$getElementB25 === void 0 ? void 0 : _document$getElementB25.value) || '', ((_document$getElementB26 = document.getElementById("m_rev_name2_".concat(_i3))) === null || _document$getElementB26 === void 0 ? void 0 : _document$getElementB26.value) || ''].filter(Boolean),
        roleLines: [((_document$getElementB27 = document.getElementById("m_rev_role1_".concat(_i3))) === null || _document$getElementB27 === void 0 ? void 0 : _document$getElementB27.value) || '', ((_document$getElementB28 = document.getElementById("m_rev_role2_".concat(_i3))) === null || _document$getElementB28 === void 0 ? void 0 : _document$getElementB28.value) || ''].filter(Boolean)
      });
    }
    mainPageData.heroSlides = heroSlides;
    mainPageData.serviceCards = serviceCards;
    mainPageData.promoBanner = collectPromoBannerFromForm();
    mainPageData.partners = partners;
    mainPageData.reviews = reviews;
    mainPageData.socialLinks = collectSocialLinksFromForm();
    mainPageData.consultation = {
      photos: consultationPhotosForSave()
    };
    mainPageData.chatWidget = {
      operatorName: ((_document$getElementB32 = document.getElementById('m_chat_operator_name')) === null || _document$getElementB32 === void 0 ? void 0 : _document$getElementB32.value) || 'Анна',
      operatorAvatar: readImageVal('m_chat_operator_avatar'),
      welcomeMessages: function () {
        var items = collectChatTextList('welcome');
        return items.length ? items : _toConsumableArray(DEFAULT_LANDING_MAIN.chatWidget.welcomeMessages);
      }(),
      autoReplies: function () {
        var items = collectChatTextList('autoreply');
        return items.length ? items : _toConsumableArray(DEFAULT_LANDING_MAIN.chatWidget.autoReplies);
      }()
    };
    mainPageData.logo = readImageVal('m_logo');
    return mainPageData;
  }
  function pickImage(uploadId) {
    var _document$getElementB33;
    window.cropTarget = {
      uploadId: uploadId,
      aspect: AdminLanding.getAspect(uploadId)
    };
    window.activeAuthorIndex = null;
    window.activeFeatureCardIndex = undefined;
    window.activeAboutImage = false;
    (_document$getElementB33 = document.getElementById('imageInput')) === null || _document$getElementB33 === void 0 || _document$getElementB33.click();
  }
  function clearImage(uploadId) {
    if (uploadId !== null && uploadId !== void 0 && uploadId.startsWith('m_consult_photo_')) {
      clearConsultPhotoInMemory(uploadId);
    }
    if (uploadId !== null && uploadId !== void 0 && uploadId.startsWith('m_consult_photo_') || uploadId !== null && uploadId !== void 0 && uploadId.startsWith('m_hero_bg_') || uploadId !== null && uploadId !== void 0 && uploadId.startsWith('m_svc_icon_') || uploadId === 'm_logo') {
      setImageUploadState(uploadId, '');
      return;
    }
    var prev = document.getElementById("".concat(uploadId, "_preview"));
    var val = document.getElementById("".concat(uploadId, "_val"));
    var clr = document.getElementById("".concat(uploadId, "_clear"));
    if (prev) {
      prev.src = '';
      prev.style.display = 'none';
    }
    if (val) val.value = '';
    if (clr) clr.style.display = 'none';
  }
  function applyCroppedImage(uploadId, dataUrl) {
    if (uploadId !== null && uploadId !== void 0 && uploadId.startsWith('m_consult_photo_')) {
      syncConsultPhotoToMemory(uploadId, dataUrl);
    }
    if (uploadId !== null && uploadId !== void 0 && uploadId.startsWith('m_consult_photo_') || uploadId !== null && uploadId !== void 0 && uploadId.startsWith('m_hero_bg_') || uploadId !== null && uploadId !== void 0 && uploadId.startsWith('m_svc_icon_') || uploadId === 'm_logo') {
      setImageUploadState(uploadId, dataUrl);
      return;
    }
    var prev = document.getElementById("".concat(uploadId, "_preview"));
    var val = document.getElementById("".concat(uploadId, "_val"));
    var clr = document.getElementById("".concat(uploadId, "_clear"));
    if (prev) {
      prev.src = dataUrl;
      prev.style.display = 'block';
    }
    if (val) val.value = dataUrl;
    if (clr) clr.style.display = 'inline-flex';
  }
  function isPartnerUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('m_partner_img_'));
  }
  function getPartnerGuidesElement() {
    if (partnerCropGuidesEl) return partnerCropGuidesEl;
    var mx = "".concat(PARTNER_LOGO_CROP.marginX * 100, "%");
    var my = "".concat(PARTNER_LOGO_CROP.marginY * 100, "%");
    var el = document.createElement('div');
    el.className = 'partner-crop-guides';
    el.setAttribute('aria-hidden', 'true');
    el.style.setProperty('--partner-mx', mx);
    el.style.setProperty('--partner-my', my);
    el.innerHTML = "\n      <span class=\"partner-crop-guides__zone partner-crop-guides__zone--left\"></span>\n      <span class=\"partner-crop-guides__zone partner-crop-guides__zone--right\"></span>\n      <span class=\"partner-crop-guides__zone partner-crop-guides__zone--top\"></span>\n      <span class=\"partner-crop-guides__zone partner-crop-guides__zone--bottom\"></span>\n      <span class=\"partner-crop-guides__safe\">\n        <span class=\"partner-crop-guides__line partner-crop-guides__line--v1\"></span>\n        <span class=\"partner-crop-guides__line partner-crop-guides__line--v2\"></span>\n        <span class=\"partner-crop-guides__line partner-crop-guides__line--h1\"></span>\n        <span class=\"partner-crop-guides__line partner-crop-guides__line--h2\"></span>\n      </span>";
    partnerCropGuidesEl = el;
    return partnerCropGuidesEl;
  }
  function mountPartnerCropGuides(cropperInstance) {
    var root = cropperInstance === null || cropperInstance === void 0 ? void 0 : cropperInstance.cropper;
    var viewBox = root === null || root === void 0 ? void 0 : root.querySelector('.cropper-view-box');
    if (!viewBox) return;
    var guides = getPartnerGuidesElement();
    if (guides.parentElement !== viewBox) viewBox.appendChild(guides);
  }
  function unmountPartnerCropGuides() {
    var _partnerCropGuidesEl;
    if ((_partnerCropGuidesEl = partnerCropGuidesEl) !== null && _partnerCropGuidesEl !== void 0 && _partnerCropGuidesEl.parentElement) {
      partnerCropGuidesEl.parentElement.removeChild(partnerCropGuidesEl);
    }
  }
  function setPartnerCropperMode(enabled, wrapperEl) {
    if (wrapperEl) wrapperEl.classList.toggle('cropper-wrapper--partner', Boolean(enabled));
    var hint = document.getElementById('partnerCropHint');
    if (hint) hint.style.display = enabled ? 'block' : 'none';
    var btnFit = document.getElementById('btnPartnerFit');
    if (btnFit) btnFit.style.display = enabled ? 'inline-flex' : 'none';
  }

  /** Вписать логотип в красную сетку (с учётом серых полей) */
  function fitPartnerLogoToSafeZone(cropperInstance) {
    if (!cropperInstance) return;
    var crop = cropperInstance.getCropBoxData();
    var img = cropperInstance.getImageData();
    if (!(crop !== null && crop !== void 0 && crop.width) || !(img !== null && img !== void 0 && img.naturalWidth)) return;
    var safeW = crop.width * (1 - 2 * PARTNER_LOGO_CROP.marginX);
    var safeH = crop.height * (1 - 2 * PARTNER_LOGO_CROP.marginY);
    var targetRatio = Math.min(safeW / img.naturalWidth, safeH / img.naturalHeight) * 0.92;
    targetRatio = Math.max(targetRatio, PARTNER_LOGO_CROP.minZoomRatio);
    cropperInstance.zoomTo(targetRatio);
    var canvas = cropperInstance.getCanvasData();
    cropperInstance.setCanvasData({
      left: crop.left + (crop.width - canvas.width) / 2,
      top: crop.top + (crop.height - canvas.height) / 2
    });
    mountPartnerCropGuides(cropperInstance);
  }
  function partnerZoomBy(cropperInstance, direction) {
    if (!cropperInstance) return;
    var img = cropperInstance.getImageData();
    var factor = direction < 0 ? 0.82 : 1.22;
    var next = (img.ratio || 1) * factor;
    if (direction < 0) {
      next = Math.max(next, PARTNER_LOGO_CROP.minZoomRatio);
    }
    cropperInstance.zoomTo(next);
    mountPartnerCropGuides(cropperInstance);
  }
  function getCropperOptions(uploadId) {
    var base = {
      viewMode: 2,
      dragMode: 'move',
      autoCropArea: 1,
      background: false,
      zoomable: true,
      guides: true,
      center: true,
      highlight: true
    };
    if (!isPartnerUploadId(uploadId)) {
      var aspect = getAspect(uploadId);
      if (!Number.isNaN(aspect)) base.aspectRatio = aspect;
      return base;
    }
    return {
      viewMode: 0,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 0.92,
      background: false,
      zoomable: true,
      zoomOnWheel: true,
      wheelZoomRatio: 0.12,
      guides: false,
      center: true,
      highlight: false,
      modal: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
      ready: function ready() {
        var cropper = this;
        mountPartnerCropGuides(cropper);
        setTimeout(function () {
          return fitPartnerLogoToSafeZone(cropper);
        }, 50);
      },
      crop: function crop() {
        mountPartnerCropGuides(this);
      }
    };
  }
  function getCroppedCanvasOptions(uploadId) {
    if (uploadId === 'm_logo') {
      return {
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      };
    }
    if (uploadId.startsWith('m_hero_bg_')) {
      return {
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      };
    }
    var _getCropSize = getCropSize(uploadId),
      _getCropSize2 = _slicedToArray(_getCropSize, 2),
      width = _getCropSize2[0],
      height = _getCropSize2[1];
    var opts = {
      width: width,
      height: height,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    };
    if (isPartnerUploadId(uploadId)) {
      opts.fillColor = '#ffffff';
    }
    return opts;
  }
  function getZoomStep(uploadId, direction) {
    if (isPartnerUploadId(uploadId)) {
      return null;
    }
    return direction < 0 ? -0.1 : 0.1;
  }
  function getAspect(uploadId) {
    if (uploadId === 'm_logo') return NaN;
    if (uploadId.startsWith('m_hero_bg_')) return 1520 / 420;
    if (uploadId === 'm_promo_img') return 1520 / 253;
    if (uploadId.startsWith('m_consult_photo_')) return 396 / 509;
    if (uploadId.startsWith('m_partner_img_')) return 1;
    if (uploadId.startsWith('m_svc_icon_')) return 1;
    if (uploadId === 'm_chat_operator_avatar') return 1;
    return 16 / 9;
  }
  function getCropSize(uploadId) {
    if (uploadId === 'm_logo') return [800, 400];
    if (uploadId.startsWith('m_hero_bg_')) return [1520, 420];
    if (uploadId === 'm_promo_img') return [1520, 253];
    if (uploadId.startsWith('m_consult_photo_')) return [396, 509];
    if (uploadId.startsWith('m_partner_img_')) return [PARTNER_LOGO_CROP.width, PARTNER_LOGO_CROP.height];
    if (uploadId.startsWith('m_svc_icon_')) return [400, 400];
    if (uploadId === 'm_chat_operator_avatar') return [400, 400];
    return [1200, 675];
  }
  function isLandingMainHeroUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('m_hero_bg_'));
  }
  window.AdminLanding = {
    DEFAULT_LANDING_MAIN: DEFAULT_LANDING_MAIN,
    migrateMainPageData: migrateMainPageData,
    renderMainPageAdmin: renderMainPageAdmin,
    collectMainPageFromForm: collectMainPageFromForm,
    pickImage: pickImage,
    clearImage: clearImage,
    applyCroppedImage: applyCroppedImage,
    isLandingMainHeroUploadId: isLandingMainHeroUploadId,
    getAspect: getAspect,
    getCropSize: getCropSize,
    PARTNER_LOGO_CROP: PARTNER_LOGO_CROP,
    isPartnerUploadId: isPartnerUploadId,
    getCropperOptions: getCropperOptions,
    getCroppedCanvasOptions: getCroppedCanvasOptions,
    getZoomStep: getZoomStep,
    unmountPartnerCropGuides: unmountPartnerCropGuides,
    setPartnerCropperMode: setPartnerCropperMode,
    fitPartnerLogoToSafeZone: fitPartnerLogoToSafeZone,
    partnerZoomBy: partnerZoomBy,
    REVIEW_TEXT_MAX_LENGTH: REVIEW_TEXT_MAX_LENGTH,
    updateReviewTextLimit: updateReviewTextLimit,
    MAX_HERO_SLIDES: MAX_HERO_SLIDES,
    addHeroSlide: function addHeroSlide() {
      var _window$saveMainPageS, _window;
      var main = window.mainPageData;
      (_window$saveMainPageS = (_window = window).saveMainPageStateToMemory) === null || _window$saveMainPageS === void 0 || _window$saveMainPageS.call(_window);
      if (!main.heroSlides) main.heroSlides = [];
      if (main.heroSlides.length >= MAX_HERO_SLIDES) {
        alert("\u041D\u0435 \u0431\u043E\u043B\u0435\u0435 ".concat(MAX_HERO_SLIDES, " \u0441\u043B\u0430\u0439\u0434\u043E\u0432"));
        return;
      }
      main.heroSlides.push({
        title: '',
        subtitle: '',
        background: ''
      });
      renderMainPageAdmin(main);
    },
    removeHeroSlide: function removeHeroSlide(i) {
      var _window$saveMainPageS2, _window2;
      var main = window.mainPageData;
      (_window$saveMainPageS2 = (_window2 = window).saveMainPageStateToMemory) === null || _window$saveMainPageS2 === void 0 || _window$saveMainPageS2.call(_window2);
      main.heroSlides.splice(i, 1);
      renderMainPageAdmin(main);
    },
    addPartner: function addPartner() {
      var _window$saveMainPageS3, _window3;
      var main = window.mainPageData;
      (_window$saveMainPageS3 = (_window3 = window).saveMainPageStateToMemory) === null || _window$saveMainPageS3 === void 0 || _window$saveMainPageS3.call(_window3);
      if (!main.partners) main.partners = [];
      main.partners.push({
        alt: 'Партнёр',
        image: ''
      });
      renderMainPageAdmin(main);
    },
    removePartner: function removePartner(i) {
      var _window$saveMainPageS4, _window4;
      var main = window.mainPageData;
      (_window$saveMainPageS4 = (_window4 = window).saveMainPageStateToMemory) === null || _window$saveMainPageS4 === void 0 || _window$saveMainPageS4.call(_window4);
      main.partners.splice(i, 1);
      renderMainPageAdmin(main);
    },
    addReview: function addReview() {
      var _window$saveMainPageS5, _window5;
      var main = window.mainPageData;
      (_window$saveMainPageS5 = (_window5 = window).saveMainPageStateToMemory) === null || _window$saveMainPageS5 === void 0 || _window$saveMainPageS5.call(_window5);
      if (!main.reviews) main.reviews = [];
      main.reviews.push({
        text: '',
        nameLines: ['', ''],
        roleLines: ['', '']
      });
      renderMainPageAdmin(main);
    },
    removeReview: function removeReview(i) {
      var _window$saveMainPageS6, _window6;
      var main = window.mainPageData;
      (_window$saveMainPageS6 = (_window6 = window).saveMainPageStateToMemory) === null || _window$saveMainPageS6 === void 0 || _window$saveMainPageS6.call(_window6);
      main.reviews.splice(i, 1);
      renderMainPageAdmin(main);
    },
    addChatWelcome: function addChatWelcome() {
      var _window$saveMainPageS7, _window7;
      var main = window.mainPageData;
      (_window$saveMainPageS7 = (_window7 = window).saveMainPageStateToMemory) === null || _window$saveMainPageS7 === void 0 || _window$saveMainPageS7.call(_window7);
      if (!main.chatWidget) main.chatWidget = _objectSpread({}, DEFAULT_LANDING_MAIN.chatWidget);
      if (!Array.isArray(main.chatWidget.welcomeMessages)) {
        main.chatWidget.welcomeMessages = _toConsumableArray(DEFAULT_LANDING_MAIN.chatWidget.welcomeMessages);
      }
      main.chatWidget.welcomeMessages.push('');
      renderMainPageAdmin(main);
    },
    addChatAutoReply: function addChatAutoReply() {
      var _window$saveMainPageS8, _window8;
      var main = window.mainPageData;
      (_window$saveMainPageS8 = (_window8 = window).saveMainPageStateToMemory) === null || _window$saveMainPageS8 === void 0 || _window$saveMainPageS8.call(_window8);
      if (!main.chatWidget) main.chatWidget = _objectSpread({}, DEFAULT_LANDING_MAIN.chatWidget);
      if (!Array.isArray(main.chatWidget.autoReplies)) {
        main.chatWidget.autoReplies = _toConsumableArray(DEFAULT_LANDING_MAIN.chatWidget.autoReplies);
      }
      main.chatWidget.autoReplies.push('');
      renderMainPageAdmin(main);
    },
    removeChatText: function removeChatText(prefix, i) {
      var _window$saveMainPageS9, _window9;
      var main = window.mainPageData;
      (_window$saveMainPageS9 = (_window9 = window).saveMainPageStateToMemory) === null || _window$saveMainPageS9 === void 0 || _window$saveMainPageS9.call(_window9);
      if (!main.chatWidget) main.chatWidget = _objectSpread({}, DEFAULT_LANDING_MAIN.chatWidget);
      var key = prefix === 'welcome' ? 'welcomeMessages' : 'autoReplies';
      var fallback = DEFAULT_LANDING_MAIN.chatWidget[key];
      if (!Array.isArray(main.chatWidget[key])) {
        main.chatWidget[key] = collectChatTextList(prefix);
      }
      main.chatWidget[key].splice(i, 1);
      if (!main.chatWidget[key].length) {
        main.chatWidget[key] = _toConsumableArray(fallback);
      }
      renderMainPageAdmin(main);
    },
    addConsultPhoto: function addConsultPhoto() {
      var _window$saveMainPageS0, _window0;
      var main = window.mainPageData;
      (_window$saveMainPageS0 = (_window0 = window).saveMainPageStateToMemory) === null || _window$saveMainPageS0 === void 0 || _window$saveMainPageS0.call(_window0);
      main.consultation = {
        photos: collectConsultationPhotosFromForm()
      };
      main.consultation.photos.push('');
      renderMainPageAdmin(main);
    },
    removeConsultPhoto: function removeConsultPhoto(i) {
      var _window$saveMainPageS1, _window1;
      var main = window.mainPageData;
      (_window$saveMainPageS1 = (_window1 = window).saveMainPageStateToMemory) === null || _window$saveMainPageS1 === void 0 || _window$saveMainPageS1.call(_window1);
      main.consultation.photos.splice(i, 1);
      if (!main.consultation.photos.length) main.consultation.photos.push('');
      renderMainPageAdmin(main);
    }
  };
})();