function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Редактор страницы «Новости» для admin.html
 */
(function (_window$NewsContent) {
  'use strict';

  var DEFAULT_NEWS_PAGE = ((_window$NewsContent = window.NewsContent) === null || _window$NewsContent === void 0 ? void 0 : _window$NewsContent.DEFAULT_NEWS_PAGE) || {
    hero: {
      background: '',
      title: 'Новости',
      subtitle: '',
      titleColor: '#575B6D',
      titleTop: 122,
      titleLeft: 70,
      subtitleColor: '#FFFFFF',
      subtitleTop: 213,
      subtitleLeft: 70
    },
    items: []
  };
  var wysiwygBound = false;
  function escapeAttr(s) {
    return String(s !== null && s !== void 0 ? s : '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }
  function escapeHtml(s) {
    return escapeAttr(s);
  }
  function migrateNewsPageData(raw) {
    var _window$NewsContent2;
    if ((_window$NewsContent2 = window.NewsContent) !== null && _window$NewsContent2 !== void 0 && _window$NewsContent2.migrateNewsPageData) {
      return window.NewsContent.migrateNewsPageData(raw);
    }
    return _objectSpread(_objectSpread({}, DEFAULT_NEWS_PAGE), raw || {});
  }
  function formatDateLabel(iso) {
    var _window$NewsContent3;
    if ((_window$NewsContent3 = window.NewsContent) !== null && _window$NewsContent3 !== void 0 && _window$NewsContent3.formatNewsDateDisplay) {
      return window.NewsContent.formatNewsDateDisplay(iso);
    }
    return iso || '—';
  }
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
    if (frame) frame.classList.toggle('hero-slide-frame--empty', !v);
    if (clr) clr.style.display = v ? 'inline-flex' : 'none';
    if (id === 'news_hero_bg') {
      var livePreview = document.getElementById('news_hero_live_preview');
      if (livePreview) {
        livePreview.style.backgroundImage = v ? "url('".concat(v, "')") : 'radial-gradient(32.3% 55.38% at 71.22% 54%, #FFFFFF 0%, #B8FDC6 100%)';
      }
      updateNewsLivePreview();
    }
  }
  function readColorVal(id, fallback) {
    var _document$getElementB;
    var raw = ((_document$getElementB = document.getElementById(id)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value) || fallback || '';
    var normalized = String(raw).trim();
    if (/^#[0-9A-Fa-f]{6}$/i.test(normalized)) return normalized.toUpperCase();
    if (/^[0-9A-Fa-f]{6}$/.test(normalized)) return "#".concat(normalized).toUpperCase();
    return fallback || '#575B6D';
  }
  function syncColorField(id, value, fromText) {
    var textEl = document.getElementById(id);
    var pickerEl = document.getElementById("".concat(id, "_picker"));
    if (!textEl || !pickerEl) return;
    var normalized = String(value || '').trim();
    if (/^[0-9A-Fa-f]{6}$/.test(normalized)) normalized = "#".concat(normalized);
    if (!/^#[0-9A-Fa-f]{6}$/i.test(normalized)) {
      if (fromText) return;
      normalized = '#000000';
    }
    textEl.value = normalized.toUpperCase();
    pickerEl.value = normalized.toLowerCase();
    updateNewsLivePreview();
  }
  function updateNewsLivePreview() {
    var _document$getElementB2, _document$getElementB3, _document$getElementB4, _document$getElementB5, _document$getElementB6, _document$getElementB7, _document$getElementB8, _document$getElementB9, _document$getElementB0, _document$getElementB1, _document$getElementB10, _document$getElementB11, _document$getElementB12, _document$getElementB13, _document$getElementB14;
    var titleEl = document.getElementById('news_hero_live_title');
    var subtitleEl = document.getElementById('news_hero_live_subtitle');
    var previewEl = document.getElementById('news_hero_live_preview');
    if (!titleEl || !subtitleEl || !previewEl) return;
    var titleText = ((_document$getElementB2 = document.getElementById('news_hero_title')) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.value) || '';
    var subtitleText = ((_document$getElementB3 = document.getElementById('news_hero_subtitle')) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.value) || '';
    var titleColor = readColorVal('news_hero_title_color', '#575B6D');
    var subtitleColor = readColorVal('news_hero_subtitle_color', '#FFFFFF');
    var bgImage = ((_document$getElementB4 = document.getElementById('news_hero_bg_val')) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value) || '';
    var titleTop = parseFloat((_document$getElementB5 = document.getElementById('news_hero_title_top')) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.value) || 122;
    var titleLeft = parseFloat((_document$getElementB6 = document.getElementById('news_hero_title_left')) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.value) || 70;
    var subtitleTop = parseFloat((_document$getElementB7 = document.getElementById('news_hero_subtitle_top')) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.value) || 213;
    var subtitleLeft = parseFloat((_document$getElementB8 = document.getElementById('news_hero_subtitle_left')) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.value) || 70;
    previewEl.style.backgroundImage = bgImage ? "url('".concat(bgImage.replace(/'/g, "\\'"), "')") : 'radial-gradient(32.3% 55.38% at 71.22% 54%, #FFFFFF 0%, #B8FDC6 100%)';
    titleEl.textContent = titleText;
    titleEl.style.color = titleColor;
    titleEl.style.top = "calc((".concat(titleTop, " / 420) * 100%)");
    titleEl.style.left = "calc((".concat(titleLeft, " / 1520) * 100%)");
    titleEl.style.maxWidth = "calc(100% - ((".concat(titleLeft, " / 1520) * 100%) - 10px)");
    titleEl.hidden = !titleText.trim();
    var titleSize = ((_document$getElementB9 = document.getElementById('news_hero_title_size')) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.value) || '';
    var titleWeight = ((_document$getElementB0 = document.getElementById('news_hero_title_weight')) === null || _document$getElementB0 === void 0 ? void 0 : _document$getElementB0.value) || '';
    var titleItalic = ((_document$getElementB1 = document.getElementById('news_hero_title_italic')) === null || _document$getElementB1 === void 0 ? void 0 : _document$getElementB1.checked) || false;
    var titleUnderline = ((_document$getElementB10 = document.getElementById('news_hero_title_underline')) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.checked) || false;
    if (titleSize) titleEl.style.fontSize = "calc((".concat(titleSize, " / 1520) * 100cqw)");else titleEl.style.removeProperty('font-size');
    if (titleWeight) titleEl.style.fontWeight = titleWeight;else titleEl.style.removeProperty('font-weight');
    titleEl.style.fontStyle = titleItalic ? 'italic' : '';
    titleEl.style.textDecoration = titleUnderline ? 'underline' : '';
    subtitleEl.textContent = subtitleText;
    subtitleEl.style.color = subtitleColor;
    subtitleEl.style.top = "calc((".concat(subtitleTop, " / 420) * 100%)");
    subtitleEl.style.left = "calc((".concat(subtitleLeft, " / 1520) * 100%)");
    subtitleEl.style.maxWidth = "calc(100% - ((".concat(subtitleLeft, " / 1520) * 100%) - 10px)");
    subtitleEl.hidden = !subtitleText.trim();
    var subtitleSize = ((_document$getElementB11 = document.getElementById('news_hero_subtitle_size')) === null || _document$getElementB11 === void 0 ? void 0 : _document$getElementB11.value) || '';
    var subtitleWeight = ((_document$getElementB12 = document.getElementById('news_hero_subtitle_weight')) === null || _document$getElementB12 === void 0 ? void 0 : _document$getElementB12.value) || '';
    var subtitleItalic = ((_document$getElementB13 = document.getElementById('news_hero_subtitle_italic')) === null || _document$getElementB13 === void 0 ? void 0 : _document$getElementB13.checked) || false;
    var subtitleUnderline = ((_document$getElementB14 = document.getElementById('news_hero_subtitle_underline')) === null || _document$getElementB14 === void 0 ? void 0 : _document$getElementB14.checked) || false;
    if (subtitleSize) subtitleEl.style.fontSize = "calc((".concat(subtitleSize, " / 1520) * 100cqw)");else subtitleEl.style.removeProperty('font-size');
    if (subtitleWeight) subtitleEl.style.fontWeight = subtitleWeight;else subtitleEl.style.removeProperty('font-weight');
    subtitleEl.style.fontStyle = subtitleItalic ? 'italic' : '';
    subtitleEl.style.textDecoration = subtitleUnderline ? 'underline' : '';
  }
  function bindNewsHeroPreviewControls() {
    var selectors = ['#news_hero_title', '#news_hero_subtitle', '#news_hero_title_top', '#news_hero_title_left', '#news_hero_subtitle_top', '#news_hero_subtitle_left', '#news_hero_title_size', '#news_hero_title_weight', '#news_hero_subtitle_size', '#news_hero_subtitle_weight'];
    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (el.dataset.newsPreviewBound === 'true') return;
        el.dataset.newsPreviewBound = 'true';
        el.addEventListener('input', updateNewsLivePreview);
        el.addEventListener('change', updateNewsLivePreview);
      });
    });
    ['#news_hero_title_italic', '#news_hero_title_underline', '#news_hero_subtitle_italic', '#news_hero_subtitle_underline'].forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (el.dataset.newsPreviewBound === 'true') return;
        el.dataset.newsPreviewBound = 'true';
        el.addEventListener('change', updateNewsLivePreview);
      });
    });
  }
  function heroBgUploadShell(id, label) {
    var sizeLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1520×420';
    return "\n      <div class=\"form-group hero-slide-upload-group\" style=\"margin-bottom:0;\">\n        <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;\">\n          <label style=\"margin-bottom:0;\">".concat(label, "</label>\n          <div class=\"hero-slide-upload-actions image-upload-mini\" data-upload-id=\"").concat(id, "\" style=\"display:flex; gap:8px;\">\n            <button type=\"button\" class=\"btn-save\" style=\"padding:6px 12px;font-size:0.8rem;\" onclick=\"AdminNews.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n            <button type=\"button\" class=\"btn-delete\" style=\"padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;\" id=\"").concat(id, "_clear\" onclick=\"AdminNews.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n            <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n          </div>\n        </div>\n        <div class=\"hero-slide-frame hero-slide-frame--empty\" data-upload-frame-for=\"").concat(id, "\">\n          <span class=\"hero-slide-frame__empty\">").concat(sizeLabel, "</span>\n          <img id=\"").concat(id, "_preview\" class=\"hero-slide-frame__img\" src=\"\" alt=\"\">\n        </div>\n      </div>");
  }
  function newsImageUploadShell(id) {
    return "\n      <div class=\"form-group hero-slide-upload-group\" style=\"margin-bottom:0;\">\n        <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;\">\n          <label style=\"margin-bottom:0;\">\u0424\u043E\u0442\u043E \u043D\u043E\u0432\u043E\u0441\u0442\u0438 (511\xD7474)</label>\n          <div class=\"hero-slide-upload-actions image-upload-mini\" data-upload-id=\"".concat(id, "\" style=\"display:flex; gap:8px;\">\n            <button type=\"button\" class=\"btn-save\" style=\"padding:6px 12px;font-size:0.8rem;\" onclick=\"AdminNews.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n            <button type=\"button\" class=\"btn-delete\" style=\"padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;\" id=\"").concat(id, "_clear\" onclick=\"AdminNews.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n            <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n          </div>\n        </div>\n        <div class=\"hero-slide-frame hero-slide-frame--empty\" data-upload-frame-for=\"").concat(id, "\">\n          <span class=\"hero-slide-frame__empty\">511\xD7474</span>\n          <img id=\"").concat(id, "_preview\" class=\"hero-slide-frame__img\" src=\"\" alt=\"\">\n        </div>\n      </div>");
  }
  function blockHeaderWithColorHtml(title, colorId, value) {
    var defaultColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#575B6D';
    var fontSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    var fontWeight = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
    var italic = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
    var underline = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    var color = /^#[0-9A-Fa-f]{6}$/.test(value || '') ? value : defaultColor;
    var sizeId = colorId.replace('_color', '_size');
    var weightId = colorId.replace('_color', '_weight');
    var italicId = colorId.replace('_color', '_italic');
    var underlineId = colorId.replace('_color', '_underline');
    return "\n      <div class=\"obuchenie-block-header\" style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;\">\n        <span style=\"font-weight:600; font-size:0.95rem; color:var(--text-secondary);\">".concat(title, "</span>\n        <div style=\"display:flex; gap:8px; align-items:center; flex-wrap:wrap;\">\n          <input type=\"number\" id=\"").concat(sizeId, "\" value=\"").concat(escapeAttr(fontSize), "\" placeholder=\"px\" title=\"\u0420\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430\" style=\"width:55px; height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; text-align:center; margin-bottom:0;\">\n          <select id=\"").concat(weightId, "\" title=\"\u0422\u043E\u043B\u0449\u0438\u043D\u0430 \u0448\u0440\u0438\u0444\u0442\u0430\" style=\"height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; cursor:pointer; margin-bottom:0;\">\n            <option value=\"\" ").concat(!fontWeight ? 'selected' : '', ">\u0422\u043E\u043B\u0449\u0438\u043D\u0430</option>\n            <option value=\"300\" ").concat(fontWeight === '300' ? 'selected' : '', ">\u0422\u043E\u043D\u043A\u0438\u0439</option>\n            <option value=\"500\" ").concat(fontWeight === '500' ? 'selected' : '', ">\u0421\u0440\u0435\u0434\u043D\u0438\u0439</option>\n            <option value=\"700\" ").concat(fontWeight === '700' ? 'selected' : '', ">\u0422\u043E\u043B\u0441\u0442\u044B\u0439</option>\n          </select>\n          <label title=\"\u041A\u0443\u0440\u0441\u0438\u0432\" style=\"display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:").concat(italic ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)', "; margin-bottom:0; font-style:italic; font-weight:bold; user-select:none; font-family:serif;\">\n            <input type=\"checkbox\" id=\"").concat(italicId, "\" ").concat(italic ? 'checked' : '', " style=\"display:none;\" onchange=\"this.parentElement.style.background = this.checked ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'; AdminNews.updateNewsLivePreview()\">\n            I\n          </label>\n          <label title=\"\u041F\u043E\u0434\u0447\u0435\u0440\u043A\u043D\u0443\u0442\u044B\u0439\" style=\"display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:").concat(underline ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)', "; margin-bottom:0; text-decoration:underline; font-weight:bold; user-select:none; font-family:serif;\">\n            <input type=\"checkbox\" id=\"").concat(underlineId, "\" ").concat(underline ? 'checked' : '', " style=\"display:none;\" onchange=\"this.parentElement.style.background = this.checked ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'; AdminNews.updateNewsLivePreview()\">\n            U\n          </label>\n          <input type=\"color\" id=\"").concat(colorId, "_picker\" value=\"").concat(escapeAttr(color), "\" style=\"width:30px; height:30px; padding:0; border:none; border-radius:4px; cursor:pointer; background:transparent; margin-bottom:0;\" oninput=\"AdminNews.syncColorField('").concat(colorId, "', this.value)\">\n          <input type=\"text\" class=\"form-control\" id=\"").concat(colorId, "\" value=\"").concat(escapeAttr(color), "\" placeholder=\"").concat(defaultColor, "\" style=\"max-width:90px; padding:4px 8px; font-size:0.85rem; font-family:monospace; margin-bottom:0;\" oninput=\"AdminNews.syncColorField('").concat(colorId, "', this.value, true)\">\n        </div>\n      </div>");
  }
  function renderHeroAdmin(data) {
    var el = document.getElementById('newsHeroAdmin');
    if (!el) return;
    var hero = migrateNewsPageData(data).hero || {};
    el.innerHTML = "\n      <div class=\"obuchenie-hero-grid\">\n        <div class=\"obuchenie-hero-banner-col\">\n          ".concat(heroBgUploadShell('news_hero_bg', 'Готовый баннер (~1520×420 px)'), "\n          <div style=\"margin-top:20px;\">\n            <label style=\"font-weight:600; display:block; margin-bottom:8px; font-size:0.9rem; color:var(--text-secondary);\">\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0431\u0430\u043D\u043D\u0435\u0440\u0430</label>\n            <div class=\"ecp-live-banner-preview\" id=\"news_hero_live_preview\">\n              <div class=\"live-banner-title\" id=\"news_hero_live_title\">").concat(escapeAttr(hero.title), "</div>\n              <div class=\"live-banner-subtitle\" id=\"news_hero_live_subtitle\">").concat(escapeAttr(hero.subtitle), "</div>\n            </div>\n          </div>\n        </div>\n        <div class=\"obuchenie-hero-fields-col\" style=\"display:flex; flex-direction:column; gap:20px;\">\n          <div class=\"obuchenie-hero-block\" style=\"border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);\">\n            ").concat(blockHeaderWithColorHtml('Заголовок', 'news_hero_title_color', hero.titleColor, '#575B6D', hero.titleFontSize, hero.titleFontWeight, hero.titleItalic, hero.titleUnderline), "\n            <div class=\"form-group\" style=\"margin-bottom:0; margin-top:8px;\">\n              <textarea class=\"form-control\" id=\"news_hero_title\" rows=\"2\" oninput=\"AdminNews.updateNewsLivePreview()\">").concat(escapeAttr(hero.title), "</textarea>\n            </div>\n            <div style=\"display:flex; gap:16px; margin-top:12px;\">\n              <div style=\"flex:1;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem; color:var(--text-secondary);\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u0432\u0435\u0440\u0445\u0443 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"news_hero_title_top\" value=\"").concat(hero.titleTop !== undefined ? hero.titleTop : 122, "\" oninput=\"AdminNews.updateNewsLivePreview()\">\n              </div>\n              <div style=\"flex:1;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem; color:var(--text-secondary);\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"news_hero_title_left\" value=\"").concat(hero.titleLeft !== undefined ? hero.titleLeft : 70, "\" oninput=\"AdminNews.updateNewsLivePreview()\">\n              </div>\n            </div>\n          </div>\n          <div class=\"obuchenie-hero-block\" style=\"border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);\">\n            ").concat(blockHeaderWithColorHtml('Подзаголовок (необязательно)', 'news_hero_subtitle_color', hero.subtitleColor, '#FFFFFF', hero.subtitleFontSize, hero.subtitleFontWeight, hero.subtitleItalic, hero.subtitleUnderline), "\n            <div class=\"form-group\" style=\"margin-bottom:0; margin-top:8px;\">\n              <textarea class=\"form-control\" id=\"news_hero_subtitle\" rows=\"2\" placeholder=\"\u041D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\" oninput=\"AdminNews.updateNewsLivePreview()\">").concat(escapeAttr(hero.subtitle), "</textarea>\n            </div>\n            <div style=\"display:flex; gap:16px; margin-top:12px;\">\n              <div style=\"flex:1;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem; color:var(--text-secondary);\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u0432\u0435\u0440\u0445\u0443 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"news_hero_subtitle_top\" value=\"").concat(hero.subtitleTop !== undefined ? hero.subtitleTop : 213, "\" oninput=\"AdminNews.updateNewsLivePreview()\">\n              </div>\n              <div style=\"flex:1;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem; color:var(--text-secondary);\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"news_hero_subtitle_left\" value=\"").concat(hero.subtitleLeft !== undefined ? hero.subtitleLeft : 70, "\" oninput=\"AdminNews.updateNewsLivePreview()\">\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>");
    setImageUploadState('news_hero_bg', hero.background);
    bindNewsHeroPreviewControls();
    updateNewsLivePreview();
  }
  function renderItemsAdmin(data) {
    var el = document.getElementById('newsItemsAdmin');
    if (!el) return;
    var items = data.items || [];
    if (!items.length) {
      el.innerHTML = '<p style="color:var(--text-secondary);">Новостей пока нет. Нажмите «Добавить новость».</p>';
      return;
    }
    el.innerHTML = "\n      <table class=\"users-table\" style=\"width:100%;\">\n        <thead>\n          <tr>\n            <th>\u0414\u0430\u0442\u0430</th>\n            <th>\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A</th>\n            <th style=\"width:180px;\">\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</th>\n          </tr>\n        </thead>\n        <tbody>\n          ".concat(items.map(function (item, i) {
      return "\n            <tr>\n              <td>".concat(escapeHtml(formatDateLabel(item.date)), "</td>\n              <td><strong>").concat(escapeHtml(item.title || 'Без заголовка'), "</strong></td>\n              <td style=\"white-space:nowrap;\">\n                <button type=\"button\" class=\"btn-save\" style=\"padding:4px 10px;font-size:0.8rem;margin-right:4px;\" onclick=\"AdminNews.moveItemUp(").concat(i, ")\" ").concat(i === 0 ? 'disabled' : '', ">\u25B2</button>\n                <button type=\"button\" class=\"btn-save\" style=\"padding:4px 10px;font-size:0.8rem;margin-right:4px;\" onclick=\"AdminNews.moveItemDown(").concat(i, ")\" ").concat(i === items.length - 1 ? 'disabled' : '', ">\u25BC</button>\n                <button type=\"button\" class=\"btn-edit\" onclick=\"AdminNews.openItemModal(").concat(i, ")\">\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button>\n                <button type=\"button\" class=\"btn-delete\" onclick=\"AdminNews.removeItem(").concat(i, ")\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n              </td>\n            </tr>");
    }).join(''), "\n        </tbody>\n      </table>");
  }
  function bindWysiwyg() {
    if (wysiwygBound) return;
    var editor = document.getElementById('newsFormDescription');
    if (!editor) return;
    wysiwygBound = true;
    var buttons = document.querySelectorAll('#newsWysiwygToolbar .wysiwyg-btn');
    var fontSize = document.getElementById('newsWysiwygFontSize');
    var color = document.getElementById('newsWysiwygColor');
    function updateToolbar() {
      buttons.forEach(function (btn) {
        var command = btn.getAttribute('data-command');
        btn.classList.toggle('active', document.queryCommandState(command));
      });
    }
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        document.execCommand(btn.getAttribute('data-command'), false, null);
        editor.focus();
        updateToolbar();
      });
    });
    fontSize === null || fontSize === void 0 || fontSize.addEventListener('change', function (e) {
      document.execCommand('fontSize', false, e.target.value);
      editor.focus();
    });
    color === null || color === void 0 || color.addEventListener('input', function (e) {
      document.execCommand('foreColor', false, e.target.value);
      editor.focus();
    });
    editor.addEventListener('keyup', updateToolbar);
    editor.addEventListener('mouseup', updateToolbar);
  }
  function getCurrentImageUploadId() {
    return 'news_item_image';
  }
  function openItemModal(index) {
    var _window$saveNewsPageS, _window, _document$getElementB15;
    (_window$saveNewsPageS = (_window = window).saveNewsPageStateToMemory) === null || _window$saveNewsPageS === void 0 || _window$saveNewsPageS.call(_window);
    var data = window.newsPageData || migrateNewsPageData(null);
    var item = index >= 0 ? data.items[index] : null;
    var modal = document.getElementById('newsItemModal');
    var titleEl = document.getElementById('newsItemModalTitle');
    var form = document.getElementById('newsItemForm');
    var editor = document.getElementById('newsFormDescription');
    if (!modal || !form) return;
    document.getElementById('newsFormIndex').value = index >= 0 ? String(index) : '';
    document.getElementById('newsFormId').value = (item === null || item === void 0 ? void 0 : item.id) || '';
    document.getElementById('newsFormTitle').value = (item === null || item === void 0 ? void 0 : item.title) || '';
    document.getElementById('newsFormDate').value = (item === null || item === void 0 ? void 0 : item.date) || '';
    if (editor) editor.innerHTML = (item === null || item === void 0 ? void 0 : item.text) || '';
    setImageUploadState(getCurrentImageUploadId(), (item === null || item === void 0 ? void 0 : item.image) || '');
    if (titleEl) titleEl.textContent = item ? 'Редактировать новость' : 'Добавить новость';
    modal.style.display = 'flex';
    bindWysiwyg();
    (_document$getElementB15 = document.getElementById('newsFormTitle')) === null || _document$getElementB15 === void 0 || _document$getElementB15.focus();
  }
  function closeItemModal() {
    var _document$getElementB16;
    var modal = document.getElementById('newsItemModal');
    if (modal) modal.style.display = 'none';
    (_document$getElementB16 = document.getElementById('newsItemForm')) === null || _document$getElementB16 === void 0 || _document$getElementB16.reset();
    var editor = document.getElementById('newsFormDescription');
    if (editor) editor.innerHTML = '';
    setImageUploadState(getCurrentImageUploadId(), '');
  }
  function saveItemFromModal(event) {
    var _window$saveNewsPageS2, _window2, _document$getElementB17, _window$NewsContent4, _document$getElementB18, _document$getElementB19, _document$getElementB20, _document$getElementB21, _document$getElementB22, _document$getElementB23, _document$getElementB24, _document$getElementB25;
    event.preventDefault();
    (_window$saveNewsPageS2 = (_window2 = window).saveNewsPageStateToMemory) === null || _window$saveNewsPageS2 === void 0 || _window$saveNewsPageS2.call(_window2);
    var data = window.newsPageData || migrateNewsPageData(null);
    var indexRaw = (_document$getElementB17 = document.getElementById('newsFormIndex')) === null || _document$getElementB17 === void 0 ? void 0 : _document$getElementB17.value;
    var index = indexRaw !== '' ? parseInt(indexRaw, 10) : -1;
    var editor = document.getElementById('newsFormDescription');
    var payload = (_window$NewsContent4 = window.NewsContent) !== null && _window$NewsContent4 !== void 0 && _window$NewsContent4.normalizeNewsItem ? window.NewsContent.normalizeNewsItem({
      id: ((_document$getElementB18 = document.getElementById('newsFormId')) === null || _document$getElementB18 === void 0 ? void 0 : _document$getElementB18.value) || "news_".concat(Date.now()),
      title: ((_document$getElementB19 = document.getElementById('newsFormTitle')) === null || _document$getElementB19 === void 0 ? void 0 : _document$getElementB19.value) || '',
      date: ((_document$getElementB20 = document.getElementById('newsFormDate')) === null || _document$getElementB20 === void 0 ? void 0 : _document$getElementB20.value) || '',
      image: ((_document$getElementB21 = document.getElementById("".concat(getCurrentImageUploadId(), "_val"))) === null || _document$getElementB21 === void 0 ? void 0 : _document$getElementB21.value) || '',
      text: (editor === null || editor === void 0 ? void 0 : editor.innerHTML) || '',
      active: true
    }, data.items.length) : {
      id: ((_document$getElementB22 = document.getElementById('newsFormId')) === null || _document$getElementB22 === void 0 ? void 0 : _document$getElementB22.value) || "news_".concat(Date.now()),
      title: ((_document$getElementB23 = document.getElementById('newsFormTitle')) === null || _document$getElementB23 === void 0 || (_document$getElementB23 = _document$getElementB23.value) === null || _document$getElementB23 === void 0 ? void 0 : _document$getElementB23.trim()) || '',
      date: ((_document$getElementB24 = document.getElementById('newsFormDate')) === null || _document$getElementB24 === void 0 ? void 0 : _document$getElementB24.value) || '',
      image: ((_document$getElementB25 = document.getElementById("".concat(getCurrentImageUploadId(), "_val"))) === null || _document$getElementB25 === void 0 ? void 0 : _document$getElementB25.value) || '',
      text: (editor === null || editor === void 0 ? void 0 : editor.innerHTML) || '',
      active: true
    };
    if (index >= 0 && data.items[index]) {
      data.items[index] = _objectSpread(_objectSpread({}, data.items[index]), payload);
    } else {
      data.items.unshift(payload);
    }
    window.newsPageData = data;
    closeItemModal();
    renderNewsPageAdmin(data);
  }
  function renderNewsPageAdmin(data) {
    var uploadHost = document.getElementById('newsItemImageUpload');
    if (uploadHost && !uploadHost.dataset.ready) {
      uploadHost.innerHTML = newsImageUploadShell('news_item_image');
      uploadHost.dataset.ready = 'true';
    }
    renderHeroAdmin(data);
    renderItemsAdmin(data);
    bindNewsModalEvents();
  }
  function bindNewsModalEvents() {
    var form = document.getElementById('newsItemForm');
    if (form && !form.dataset.bound) {
      var _document$getElementB26, _document$getElementB27;
      form.dataset.bound = 'true';
      form.addEventListener('submit', saveItemFromModal);
      (_document$getElementB26 = document.getElementById('newsItemModalClose')) === null || _document$getElementB26 === void 0 || _document$getElementB26.addEventListener('click', closeItemModal);
      (_document$getElementB27 = document.getElementById('newsItemModalCancel')) === null || _document$getElementB27 === void 0 || _document$getElementB27.addEventListener('click', closeItemModal);
    }
  }
  function readImageVal(id) {
    var _document$getElementB28;
    return ((_document$getElementB28 = document.getElementById("".concat(id, "_val"))) === null || _document$getElementB28 === void 0 ? void 0 : _document$getElementB28.value) || '';
  }
  function collectNewsPageFromForm(existing) {
    var _ref, _document$getElementB29, _document$getElementB30, _ref2, _document$getElementB31, _document$getElementB32, _document$getElementB33, _document$getElementB34, _document$getElementB35, _document$getElementB36, _document$getElementB37, _document$getElementB38, _ref3, _document$getElementB39, _document$getElementB40, _ref4, _document$getElementB41, _document$getElementB42, _document$getElementB43, _document$getElementB44, _document$getElementB45, _document$getElementB46, _document$getElementB47, _document$getElementB48;
    var data = migrateNewsPageData(existing || window.newsPageData || {});
    var hero = data.hero || {};
    data.hero = {
      background: readImageVal('news_hero_bg') || hero.background || '',
      title: (_ref = (_document$getElementB29 = (_document$getElementB30 = document.getElementById('news_hero_title')) === null || _document$getElementB30 === void 0 ? void 0 : _document$getElementB30.value) !== null && _document$getElementB29 !== void 0 ? _document$getElementB29 : hero.title) !== null && _ref !== void 0 ? _ref : '',
      titleColor: (_ref2 = (_document$getElementB31 = (_document$getElementB32 = document.getElementById('news_hero_title_color')) === null || _document$getElementB32 === void 0 ? void 0 : _document$getElementB32.value) !== null && _document$getElementB31 !== void 0 ? _document$getElementB31 : hero.titleColor) !== null && _ref2 !== void 0 ? _ref2 : '#575B6D',
      titleTop: parseInt(((_document$getElementB33 = document.getElementById('news_hero_title_top')) === null || _document$getElementB33 === void 0 ? void 0 : _document$getElementB33.value) || 122, 10),
      titleLeft: parseInt(((_document$getElementB34 = document.getElementById('news_hero_title_left')) === null || _document$getElementB34 === void 0 ? void 0 : _document$getElementB34.value) || 70, 10),
      titleFontSize: ((_document$getElementB35 = document.getElementById('news_hero_title_size')) === null || _document$getElementB35 === void 0 ? void 0 : _document$getElementB35.value) || '',
      titleFontWeight: ((_document$getElementB36 = document.getElementById('news_hero_title_weight')) === null || _document$getElementB36 === void 0 ? void 0 : _document$getElementB36.value) || '',
      titleItalic: ((_document$getElementB37 = document.getElementById('news_hero_title_italic')) === null || _document$getElementB37 === void 0 ? void 0 : _document$getElementB37.checked) || false,
      titleUnderline: ((_document$getElementB38 = document.getElementById('news_hero_title_underline')) === null || _document$getElementB38 === void 0 ? void 0 : _document$getElementB38.checked) || false,
      subtitle: (_ref3 = (_document$getElementB39 = (_document$getElementB40 = document.getElementById('news_hero_subtitle')) === null || _document$getElementB40 === void 0 ? void 0 : _document$getElementB40.value) !== null && _document$getElementB39 !== void 0 ? _document$getElementB39 : hero.subtitle) !== null && _ref3 !== void 0 ? _ref3 : '',
      subtitleColor: (_ref4 = (_document$getElementB41 = (_document$getElementB42 = document.getElementById('news_hero_subtitle_color')) === null || _document$getElementB42 === void 0 ? void 0 : _document$getElementB42.value) !== null && _document$getElementB41 !== void 0 ? _document$getElementB41 : hero.subtitleColor) !== null && _ref4 !== void 0 ? _ref4 : '#FFFFFF',
      subtitleTop: parseInt(((_document$getElementB43 = document.getElementById('news_hero_subtitle_top')) === null || _document$getElementB43 === void 0 ? void 0 : _document$getElementB43.value) || 213, 10),
      subtitleLeft: parseInt(((_document$getElementB44 = document.getElementById('news_hero_subtitle_left')) === null || _document$getElementB44 === void 0 ? void 0 : _document$getElementB44.value) || 70, 10),
      subtitleFontSize: ((_document$getElementB45 = document.getElementById('news_hero_subtitle_size')) === null || _document$getElementB45 === void 0 ? void 0 : _document$getElementB45.value) || '',
      subtitleFontWeight: ((_document$getElementB46 = document.getElementById('news_hero_subtitle_weight')) === null || _document$getElementB46 === void 0 ? void 0 : _document$getElementB46.value) || '',
      subtitleItalic: ((_document$getElementB47 = document.getElementById('news_hero_subtitle_italic')) === null || _document$getElementB47 === void 0 ? void 0 : _document$getElementB47.checked) || false,
      subtitleUnderline: ((_document$getElementB48 = document.getElementById('news_hero_subtitle_underline')) === null || _document$getElementB48 === void 0 ? void 0 : _document$getElementB48.checked) || false
    };
    data.items = Array.isArray(data.items) ? data.items : [];
    return data;
  }
  function pickImage(uploadId) {
    var _document$getElementB49;
    window.cropTarget = {
      uploadId: uploadId,
      aspect: AdminNews.getAspect(uploadId)
    };
    (_document$getElementB49 = document.getElementById('imageInput')) === null || _document$getElementB49 === void 0 || _document$getElementB49.click();
  }
  function clearImage(uploadId) {
    setImageUploadState(uploadId, '');
  }
  function applyCroppedImage(uploadId, dataUrl) {
    if (uploadId && uploadId.startsWith('news_')) {
      setImageUploadState(uploadId, dataUrl);
    }
  }
  function getAspect(uploadId) {
    if (uploadId === 'news_hero_bg') return 1520 / 420;
    if (uploadId === 'news_item_image') return 511 / 474;
    return 16 / 9;
  }
  function getCropSize(uploadId) {
    if (uploadId === 'news_hero_bg') return [1520, 420];
    if (uploadId === 'news_item_image') return [511, 474];
    return [1200, 675];
  }
  function isNewsUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('news_'));
  }
  window.AdminNews = {
    DEFAULT_NEWS_PAGE: DEFAULT_NEWS_PAGE,
    migrateNewsPageData: migrateNewsPageData,
    renderNewsPageAdmin: renderNewsPageAdmin,
    collectNewsPageFromForm: collectNewsPageFromForm,
    pickImage: pickImage,
    clearImage: clearImage,
    applyCroppedImage: applyCroppedImage,
    getAspect: getAspect,
    getCropSize: getCropSize,
    isNewsUploadId: isNewsUploadId,
    setImageUploadState: setImageUploadState,
    syncColorField: syncColorField,
    updateNewsLivePreview: updateNewsLivePreview,
    openItemModal: openItemModal,
    closeItemModal: closeItemModal,
    addItem: function addItem() {
      openItemModal(-1);
    },
    removeItem: function removeItem(i) {
      var _window$saveNewsPageS3, _window3;
      (_window$saveNewsPageS3 = (_window3 = window).saveNewsPageStateToMemory) === null || _window$saveNewsPageS3 === void 0 || _window$saveNewsPageS3.call(_window3);
      window.newsPageData.items.splice(i, 1);
      renderNewsPageAdmin(window.newsPageData);
    },
    moveItemUp: function moveItemUp(i) {
      var _window$saveNewsPageS4, _window4;
      if (i <= 0) return;
      (_window$saveNewsPageS4 = (_window4 = window).saveNewsPageStateToMemory) === null || _window$saveNewsPageS4 === void 0 || _window$saveNewsPageS4.call(_window4);
      var list = window.newsPageData.items;
      var _ref5 = [list[i], list[i - 1]];
      list[i - 1] = _ref5[0];
      list[i] = _ref5[1];
      renderNewsPageAdmin(window.newsPageData);
    },
    moveItemDown: function moveItemDown(i) {
      var _window$saveNewsPageS5, _window5;
      (_window$saveNewsPageS5 = (_window5 = window).saveNewsPageStateToMemory) === null || _window$saveNewsPageS5 === void 0 || _window$saveNewsPageS5.call(_window5);
      var list = window.newsPageData.items;
      if (i >= list.length - 1) return;
      var _ref6 = [list[i], list[i + 1]];
      list[i + 1] = _ref6[0];
      list[i] = _ref6[1];
      renderNewsPageAdmin(window.newsPageData);
    }
  };
})();