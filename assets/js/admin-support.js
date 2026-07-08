function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Редактор страницы «Сопровождение» для admin.html
 */
(function (_window$SupportConten) {
  var DEFAULT_SUPPORT_PAGE = ((_window$SupportConten = window.SupportContent) === null || _window$SupportConten === void 0 ? void 0 : _window$SupportConten.SUPPORT_DEFAULTS) || {
    hero: {
      background: '',
      title: '',
      titleColor: '#ffffff',
      titleTop: 122,
      titleLeft: 70,
      subtitle: '',
      subtitleColor: '#ffffff',
      subtitleTop: 213,
      subtitleLeft: 70
    },
    navCards: [],
    customers: {
      title: '',
      services44: [],
      services223: [],
      checklist: {
        title: '',
        items: []
      }
    },
    calculator: {
      title: '',
      image: ''
    },
    suppliers: {
      title: '',
      services: [],
      checklist: {
        title: '',
        items: []
      }
    }
  };
  var supportDetailsWysiwygBound = false;
  function escapeAttr(s) {
    return String(s !== null && s !== void 0 ? s : '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }
  function migrateSupportPageData(raw) {
    var _window$SupportConten2;
    if ((_window$SupportConten2 = window.SupportContent) !== null && _window$SupportConten2 !== void 0 && _window$SupportConten2.migrateSupportPageData) {
      return window.SupportContent.migrateSupportPageData(raw);
    }
    return _objectSpread(_objectSpread({}, DEFAULT_SUPPORT_PAGE), raw || {});
  }
  function getMigratedData(data) {
    return migrateSupportPageData(data || {});
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
    if (frame) {
      frame.classList.toggle('hero-slide-frame--empty', !v);
    }
    if (clr) clr.style.display = v ? 'inline-flex' : 'none';
    if (id === 'support_hero_bg') {
      var livePreview = document.getElementById('support_hero_live_preview');
      if (livePreview) {
        if (v) {
          livePreview.style.backgroundImage = "url('".concat(v, "')");
        } else {
          livePreview.style.backgroundImage = 'radial-gradient(32.3% 55.38% at 71.22% 54%, #FFFFFF 0%, #B8FDC6 100%)';
        }
      }
    }
  }
  function setFileUploadState(id, url, name) {
    var val = document.getElementById(id);
    var label = document.getElementById("".concat(id, "_name"));
    if (val) val.value = url || '';
    if (label) {
      label.textContent = name || (url ? url.split('/').pop() : '');
      label.style.display = url ? 'inline' : 'none';
    }
  }
  function heroBgUploadShell(id, label) {
    var sizeLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1520×420';
    return "\n      <div class=\"form-group hero-slide-upload-group\" style=\"margin-bottom:0;\">\n        <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;\">\n          <label style=\"margin-bottom:0;\">".concat(label, "</label>\n          <div class=\"hero-slide-upload-actions image-upload-mini\" data-upload-id=\"").concat(id, "\" style=\"display:flex; gap:8px;\">\n            <button type=\"button\" class=\"btn-save\" style=\"padding:6px 12px;font-size:0.8rem;\" onclick=\"AdminSupport.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n            <button type=\"button\" class=\"btn-delete\" style=\"padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;\" id=\"").concat(id, "_clear\" onclick=\"AdminSupport.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n            <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n          </div>\n        </div>\n        <div class=\"hero-slide-frame hero-slide-frame--empty\" data-upload-frame-for=\"").concat(id, "\">\n          <span class=\"hero-slide-frame__empty\">").concat(sizeLabel, "</span>\n          <img id=\"").concat(id, "_preview\" class=\"hero-slide-frame__img\" src=\"\" alt=\"\">\n        </div>\n      </div>");
  }
  function blockHeaderWithColorHtml(title, colorId, value) {
    var defaultColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#ffffff';
    var fontSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    var fontWeight = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
    var italic = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
    var underline = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    var color = /^#[0-9A-Fa-f]{6}$/.test(value || '') ? value : defaultColor;
    var sizeId = colorId.replace('_color', '_size');
    var weightId = colorId.replace('_color', '_weight');
    var italicId = colorId.replace('_color', '_italic');
    var underlineId = colorId.replace('_color', '_underline');
    return "\n      <div class=\"obuchenie-block-header\" style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;\">\n        <span style=\"font-weight:600; font-size:0.95rem; color:var(--text-secondary);\">".concat(title, "</span>\n        <div style=\"display:flex; gap:8px; align-items:center; flex-wrap:wrap;\">\n          <input type=\"number\" id=\"").concat(sizeId, "\" value=\"").concat(escapeAttr(fontSize), "\" placeholder=\"px\" title=\"\u0420\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430\" style=\"width:55px; height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; text-align:center; margin-bottom:0;\">\n          <select id=\"").concat(weightId, "\" title=\"\u0422\u043E\u043B\u0449\u0438\u043D\u0430 \u0448\u0440\u0438\u0444\u0442\u0430\" style=\"height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; cursor:pointer; margin-bottom:0;\">\n            <option value=\"\" ").concat(!fontWeight ? 'selected' : '', ">\u0422\u043E\u043B\u0449\u0438\u043D\u0430</option>\n            <option value=\"300\" ").concat(fontWeight === '300' ? 'selected' : '', ">\u0422\u043E\u043D\u043A\u0438\u0439</option>\n            <option value=\"500\" ").concat(fontWeight === '500' ? 'selected' : '', ">\u0421\u0440\u0435\u0434\u043D\u0438\u0439</option>\n            <option value=\"700\" ").concat(fontWeight === '700' ? 'selected' : '', ">\u0422\u043E\u043B\u0441\u0442\u044B\u0439</option>\n          </select>\n          <label title=\"\u041A\u0443\u0440\u0441\u0438\u0432\" style=\"display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:").concat(italic ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)', "; margin-bottom:0; font-style:italic; font-weight:bold; user-select:none; font-family:serif;\">\n            <input type=\"checkbox\" id=\"").concat(italicId, "\" ").concat(italic ? 'checked' : '', " style=\"display:none;\" onchange=\"this.parentElement.style.background = this.checked ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'\">\n            I\n          </label>\n          <label title=\"\u041F\u043E\u0434\u0447\u0435\u0440\u043A\u043D\u0443\u0442\u044B\u0439\" style=\"display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:").concat(underline ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)', "; margin-bottom:0; text-decoration:underline; font-weight:bold; user-select:none; font-family:serif;\">\n            <input type=\"checkbox\" id=\"").concat(underlineId, "\" ").concat(underline ? 'checked' : '', " style=\"display:none;\" onchange=\"this.parentElement.style.background = this.checked ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'\">\n            U\n          </label>\n          <input type=\"color\" id=\"").concat(colorId, "_picker\" value=\"").concat(escapeAttr(color), "\" style=\"width:30px; height:30px; padding:0; border:none; border-radius:4px; cursor:pointer; background:transparent; margin-bottom:0;\">\n          <input type=\"text\" class=\"form-control\" id=\"").concat(colorId, "\" value=\"").concat(escapeAttr(color), "\" placeholder=\"").concat(defaultColor, "\" style=\"max-width:90px; padding:4px 8px; font-size:0.85rem; font-family:monospace; margin-bottom:0;\">\n        </div>\n      </div>");
  }
  function imageUploadHtml(id, label, hint) {
    return "\n      <div class=\"form-group\" style=\"margin-bottom:0;\">\n        <label>".concat(label, "</label>\n        ").concat(hint ? "<p style=\"color:var(--text-secondary);font-size:0.85rem;margin:-4px 0 8px;\">".concat(hint, "</p>") : '', "\n        <div class=\"image-upload-mini\" data-upload-id=\"").concat(id, "\">\n          <img id=\"").concat(id, "_preview\" src=\"\" alt=\"\" style=\"max-width:220px;max-height:160px;object-fit:contain;border-radius:8px;display:none;margin-bottom:8px;background:rgba(0,0,0,0.15);\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:8px 14px;font-size:0.85rem;\" onclick=\"AdminSupport.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n          <button type=\"button\" class=\"btn-delete\" style=\"padding:8px 14px;margin-left:8px;font-size:0.85rem;display:none;\" id=\"").concat(id, "_clear\" onclick=\"AdminSupport.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n          <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n        </div>\n      </div>");
  }
  function navIconUploadHtml(id) {
    return "\n      <div class=\"form-group consulting-comp-admin-card__icon\">\n        <label>\u0418\u043A\u043E\u043D\u043A\u0430</label>\n        <div class=\"image-upload-mini\" data-upload-id=\"".concat(id, "\">\n          <img id=\"").concat(id, "_preview\" class=\"consulting-comp-admin-card__icon-preview\" src=\"\" alt=\"\">\n          <div class=\"consulting-comp-admin-card__icon-actions\">\n            <button type=\"button\" class=\"btn-save\" onclick=\"AdminSupport.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n            <button type=\"button\" class=\"btn-delete consulting-comp-admin-card__icon-clear\" style=\"display:none;\" id=\"").concat(id, "_clear\" onclick=\"AdminSupport.clearImage('").concat(id, "')\">\xD7</button>\n          </div>\n          <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n        </div>\n      </div>");
  }
  function fileUploadRow(id, label, value, fileName) {
    var shownName = fileName || (value ? value.split('/').pop() : '');
    return "\n      <div class=\"form-group\">\n        <label>".concat(label, "</label>\n        <div style=\"display:flex;gap:8px;flex-wrap:wrap;align-items:center;\">\n          <input type=\"text\" class=\"form-control\" id=\"").concat(id, "\" value=\"").concat(escapeAttr(value), "\" placeholder=\"\u0421\u0441\u044B\u043B\u043A\u0430 \u0438\u043B\u0438 uploads/files/...\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:8px 14px;font-size:0.85rem;\" onclick=\"AdminSupport.pickFile('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u0430\u0439\u043B</button>\n        </div>\n        <small id=\"").concat(id, "_name\" style=\"display:").concat(shownName ? 'inline' : 'none', ";color:var(--text-secondary);margin-top:6px;\">").concat(escapeAttr(shownName), "</small>\n      </div>");
  }
  function supportHeroSlidesConfig() {
    return {
      prefix: 'support_hero',
      removeHandler: 'AdminSupport.removeHeroSlide',
      pickHandler: 'AdminSupport.pickImage',
      clearHandler: 'AdminSupport.clearImage',
      previewClass: 'support-live-banner-preview',
      defaults: {
        titleColor: '#ffffff',
        subtitleColor: '#ffffff',
        titleTop: 122,
        titleLeft: 70,
        subtitleTop: 213,
        subtitleLeft: 70
      }
    };
  }
  function renderHeroAdmin(data) {
    var el = document.getElementById('supportHeroAdmin');
    if (!el || !window.AdminHeroSlides) return;
    AdminHeroSlides.render(el, getMigratedData(data).heroSlides || [], supportHeroSlidesConfig(), setImageUploadState);
  }
  function navCardAdminHtml(card, i) {
    return "\n      <div class=\"consulting-comp-admin-card\">\n        <div class=\"consulting-comp-admin-card__head\">\n          <strong>\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 ".concat(i + 1, "</strong>\n        </div>\n        ").concat(navIconUploadHtml("support_nav_icon_".concat(i)), "\n        <div class=\"form-group consulting-comp-admin-card__text\">\n          <label>\u041D\u0430\u0434\u043F\u0438\u0441\u044C (Enter \u2014 \u043F\u0435\u0440\u0435\u043D\u043E\u0441)</label>\n          <textarea class=\"form-control\" id=\"support_nav_label_").concat(i, "\" rows=\"2\">").concat(escapeAttr(card.label), "</textarea>\n        </div>\n        <div class=\"form-group consulting-comp-admin-card__link\">\n          <label>\u0421\u0441\u044B\u043B\u043A\u0430 (\u044F\u043A\u043E\u0440\u044C \u0438\u043B\u0438 URL)</label>\n          <input type=\"text\" class=\"form-control\" id=\"support_nav_href_").concat(i, "\" value=\"").concat(escapeAttr(card.href), "\">\n        </div>\n      </div>");
  }
  function renderNavCardsAdmin(data) {
    var el = document.getElementById('supportNavCardsAdmin');
    if (!el) return;
    var cards = getMigratedData(data).navCards || [];
    el.innerHTML = "<div class=\"admin-nav-cards-grid admin-nav-cards-grid--3\">".concat(cards.map(function (card, i) {
      return navCardAdminHtml(card, i);
    }).join(''), "</div>");
    cards.forEach(function (card, i) {
      return setImageUploadState("support_nav_icon_".concat(i), card.icon);
    });
  }
  function serviceCardRowHtml(prefix, item, i) {
    return "\n      <div class=\"support-svc-admin-card\">\n        <span class=\"support-svc-admin-card__num\">\u041F\u043B\u0430\u0448\u043A\u0430 ".concat(i + 1, "</span>\n        <div class=\"support-svc-admin-card__field\">\n          <label for=\"support_").concat(prefix, "_svc_title_").concat(i, "\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</label>\n          <textarea class=\"form-control\" id=\"support_").concat(prefix, "_svc_title_").concat(i, "\" rows=\"2\">").concat(escapeAttr(item.title), "</textarea>\n        </div>\n        <div class=\"support-svc-admin-card__field\">\n          <label for=\"support_").concat(prefix, "_svc_price_").concat(i, "\">\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u043E\u0442</label>\n          <input type=\"text\" class=\"form-control\" id=\"support_").concat(prefix, "_svc_price_").concat(i, "\" value=\"").concat(escapeAttr(item.price), "\">\n        </div>\n        <div class=\"support-svc-admin-card__field\">\n          <label>\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</label>\n          <button type=\"button\" class=\"btn-edit support-svc-admin-card__details-btn\" onclick=\"AdminSupport.openServiceDetails('").concat(prefix, "', ").concat(i, ")\">\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button>\n          <textarea id=\"support_").concat(prefix, "_svc_details_").concat(i, "\" style=\"display:none;\" aria-hidden=\"true\"></textarea>\n        </div>\n      </div>");
  }
  function renderServicesBlockHtml(blockTitle, prefix, services) {
    var list = Array.isArray(services) ? services.slice(0, 3) : [];
    while (list.length < 3) list.push({});
    return "\n      <div class=\"support-svc-admin-block\">\n        <h4 class=\"support-svc-admin-block__title\">".concat(blockTitle, "</h4>\n        <div class=\"support-svc-admin-row\">\n          ").concat(list.map(function (item, i) {
      return serviceCardRowHtml(prefix, item, i);
    }).join(''), "\n        </div>\n      </div>");
  }
  function fillServiceDetailsTextareas(prefix, services) {
    var list = services || [];
    for (var i = 0; i < 3; i++) {
      var _list$i;
      var textarea = document.getElementById("support_".concat(prefix, "_svc_details_").concat(i));
      if (textarea) textarea.value = ((_list$i = list[i]) === null || _list$i === void 0 ? void 0 : _list$i.detailsHtml) || '';
    }
  }
  function checklistFileUploadHtml(id, value, fileName) {
    var shownName = fileName || (value ? value.split('/').pop() : '');
    return "\n      <div class=\"support-checklist-admin-card__file\">\n        <label for=\"".concat(id, "\">\u0424\u0430\u0439\u043B \u0434\u043B\u044F \u0441\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u044F</label>\n        <input type=\"text\" class=\"form-control\" id=\"").concat(id, "\" value=\"").concat(escapeAttr(value), "\" placeholder=\"\u0421\u0441\u044B\u043B\u043A\u0430 \u0438\u043B\u0438 uploads/files/...\">\n        <button type=\"button\" class=\"btn-save support-checklist-admin-card__upload-btn\" onclick=\"AdminSupport.pickFile('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u0430\u0439\u043B</button>\n        <small id=\"").concat(id, "_name\" class=\"support-checklist-admin-card__file-name\" style=\"display:").concat(shownName ? 'block' : 'none', ";\">").concat(escapeAttr(shownName), "</small>\n      </div>");
  }
  function renderChecklistSectionHtml(prefix, checklist) {
    var data = checklist || {
      title: '',
      items: []
    };
    var items = data.items || [];
    return "\n      <div class=\"support-checklist-admin-section\">\n        <div class=\"support-checklist-admin-section__head\">\n          <h4 class=\"support-checklist-admin-section__title\">\u0427\u0435\u043A-\u043B\u0438\u0441\u0442\u044B</h4>\n          <button type=\"button\" class=\"btn-save support-checklist-admin-section__add\" onclick=\"AdminSupport.addChecklistItem('".concat(prefix, "')\">+ \u0427\u0435\u043A-\u043B\u0438\u0441\u0442</button>\n        </div>\n        <div class=\"form-group\">\n          <label>\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0431\u043B\u043E\u043A\u0430 \u0447\u0435\u043A-\u043B\u0438\u0441\u0442\u043E\u0432 (Enter \u2014 \u043F\u0435\u0440\u0435\u043D\u043E\u0441)</label>\n          <textarea class=\"form-control\" id=\"support_").concat(prefix, "_check_title\" rows=\"2\">").concat(escapeAttr(data.title), "</textarea>\n        </div>\n        <div class=\"support-checklist-admin-grid\">\n          ").concat(items.map(function (item, i) {
      return checklistItemHtml(prefix, item, i);
    }).join(''), "\n        </div>\n      </div>");
  }
  function checklistItemHtml(prefix, item, i) {
    var lines = Array.isArray(item.lines) ? item.lines.join('\n') : '';
    return "\n      <div class=\"support-checklist-admin-card\">\n        <div class=\"support-checklist-admin-card__head\">\n          <span class=\"support-checklist-admin-card__num\">\u0427\u0435\u043A-\u043B\u0438\u0441\u0442 ".concat(i + 1, "</span>\n          <button type=\"button\" class=\"btn-delete support-checklist-admin-card__delete\" onclick=\"AdminSupport.removeChecklistItem('").concat(prefix, "', ").concat(i, ")\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n        </div>\n        <div class=\"support-checklist-admin-card__field\">\n          <label for=\"support_").concat(prefix, "_check_lines_").concat(i, "\">\u0422\u0435\u043A\u0441\u0442 (\u043A\u0430\u0436\u0434\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430 \u2014 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u0430\u044F \u043B\u0438\u043D\u0438\u044F \u043D\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435)</label>\n          <textarea class=\"form-control\" id=\"support_").concat(prefix, "_check_lines_").concat(i, "\" rows=\"3\">").concat(escapeAttr(lines), "</textarea>\n        </div>\n        ").concat(checklistFileUploadHtml("support_".concat(prefix, "_check_file_").concat(i), item.file || '', item.fileName), "\n      </div>");
  }
  function renderCustomersAdmin(section) {
    var el = document.getElementById('supportCustomersAdmin');
    if (!el) return;
    var data = section || {
      title: '',
      services44: [],
      services223: [],
      checklist: {
        title: '',
        items: []
      }
    };
    el.innerHTML = "\n      <div class=\"form-group\">\n        <label>\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0441\u0435\u043A\u0446\u0438\u0438</label>\n        <input type=\"text\" class=\"form-control\" id=\"support_customers_title\" value=\"".concat(escapeAttr(data.title), "\">\n      </div>\n      <h4 style=\"margin:24px 0 12px;font-size:0.95rem;\">\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0443\u0441\u043B\u0443\u0433</h4>\n      ").concat(renderServicesBlockHtml('44-ФЗ', 'customers_44', data.services44), "\n      ").concat(renderServicesBlockHtml('223-ФЗ', 'customers_223', data.services223), "\n      ").concat(renderChecklistSectionHtml('customers', data.checklist));
    fillServiceDetailsTextareas('customers_44', data.services44);
    fillServiceDetailsTextareas('customers_223', data.services223);
  }
  function renderSuppliersAdmin(section) {
    var el = document.getElementById('supportSuppliersAdmin');
    if (!el) return;
    var data = section || {
      title: '',
      services: [],
      checklist: {
        title: '',
        items: []
      }
    };
    el.innerHTML = "\n      <div class=\"form-group\">\n        <label>\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0441\u0435\u043A\u0446\u0438\u0438</label>\n        <input type=\"text\" class=\"form-control\" id=\"support_suppliers_title\" value=\"".concat(escapeAttr(data.title), "\">\n      </div>\n      <h4 style=\"margin:24px 0 12px;font-size:0.95rem;\">\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0443\u0441\u043B\u0443\u0433</h4>\n      ").concat(renderServicesBlockHtml('Услуги', 'suppliers', data.services), "\n      ").concat(renderChecklistSectionHtml('suppliers', data.checklist));
    fillServiceDetailsTextareas('suppliers', data.services);
  }
  function renderCalculatorAdmin(data) {
    var el = document.getElementById('supportCalculatorAdmin');
    if (!el) return;
    var calc = getMigratedData(data).calculator || {};
    el.innerHTML = "\n      <div class=\"support-calc-admin-row\">\n        <div class=\"support-calc-admin-row__image\">\n          ".concat(imageUploadHtml('support_calc_image', 'Фоновое изображение (необязательно)', 'Если загружено — заменит градиент в оранжевом блоке справа от калькулятора.'), "\n        </div>\n        <div class=\"support-calc-admin-row__title form-group\">\n          <label>\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0432 \u043F\u0440\u0430\u0432\u043E\u043C \u0431\u043B\u043E\u043A\u0435</label>\n          <textarea class=\"form-control support-calc-admin-row__textarea\" id=\"support_calc_title\" rows=\"4\">").concat(escapeAttr(calc.title), "</textarea>\n        </div>\n      </div>\n    ");
    setImageUploadState('support_calc_image', calc.image);
  }
  function bindSupportDetailsWysiwyg() {
    if (supportDetailsWysiwygBound) return;
    var editor = document.getElementById('supportServiceDetailsEditor');
    if (!editor) return;
    supportDetailsWysiwygBound = true;
    var buttons = document.querySelectorAll('#supportServiceDetailsToolbar .wysiwyg-btn');
    var fontSize = document.getElementById('supportServiceDetailsFontSize');
    var color = document.getElementById('supportServiceDetailsColor');
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
  function bindSupportDetailsModalEvents() {
    var _document$getElementB, _document$getElementB2;
    var form = document.getElementById('supportServiceDetailsForm');
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';
    form.addEventListener('submit', saveServiceDetailsFromModal);
    (_document$getElementB = document.getElementById('supportServiceDetailsModalClose')) === null || _document$getElementB === void 0 || _document$getElementB.addEventListener('click', closeServiceDetailsModal);
    (_document$getElementB2 = document.getElementById('supportServiceDetailsModalCancel')) === null || _document$getElementB2 === void 0 || _document$getElementB2.addEventListener('click', closeServiceDetailsModal);
  }
  function openServiceDetails(prefix, index) {
    var _window$saveSupportPa, _window, _document$getElementB3;
    (_window$saveSupportPa = (_window = window).saveSupportPageStateToMemory) === null || _window$saveSupportPa === void 0 || _window$saveSupportPa.call(_window);
    var textarea = document.getElementById("support_".concat(prefix, "_svc_details_").concat(index));
    var modal = document.getElementById('supportServiceDetailsModal');
    var editor = document.getElementById('supportServiceDetailsEditor');
    var titleEl = document.getElementById('supportServiceDetailsModalTitle');
    var cardTitle = ((_document$getElementB3 = document.getElementById("support_".concat(prefix, "_svc_title_").concat(index))) === null || _document$getElementB3 === void 0 || (_document$getElementB3 = _document$getElementB3.value) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.trim()) || "\u041F\u043B\u0430\u0448\u043A\u0430 ".concat(index + 1);
    if (!modal || !editor || !textarea) return;
    document.getElementById('supportServiceDetailsPrefix').value = prefix;
    document.getElementById('supportServiceDetailsIndex').value = String(index);
    if (titleEl) titleEl.textContent = "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435: ".concat(cardTitle);
    editor.innerHTML = textarea.value || '';
    modal.style.display = 'flex';
    bindSupportDetailsWysiwyg();
    editor.focus();
  }
  function closeServiceDetailsModal() {
    var modal = document.getElementById('supportServiceDetailsModal');
    if (modal) modal.style.display = 'none';
    var editor = document.getElementById('supportServiceDetailsEditor');
    if (editor) editor.innerHTML = '';
  }
  function saveServiceDetailsFromModal(event) {
    var _document$getElementB4, _document$getElementB5;
    event.preventDefault();
    var prefix = ((_document$getElementB4 = document.getElementById('supportServiceDetailsPrefix')) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value) || '';
    var index = parseInt(((_document$getElementB5 = document.getElementById('supportServiceDetailsIndex')) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.value) || '-1', 10);
    var editor = document.getElementById('supportServiceDetailsEditor');
    var textarea = document.getElementById("support_".concat(prefix, "_svc_details_").concat(index));
    if (!prefix || index < 0 || !textarea || !editor) return;
    textarea.value = editor.innerHTML || '';
    closeServiceDetailsModal();
  }
  function renderSupportPageAdmin(data) {
    var migrated = getMigratedData(data);
    renderHeroAdmin(migrated);
    renderNavCardsAdmin(migrated);
    renderCustomersAdmin(migrated.customers);
    renderCalculatorAdmin(migrated);
    renderSuppliersAdmin(migrated.suppliers);
    bindSupportDetailsModalEvents();
  }
  function collectServiceList(prefix, existingList) {
    var services = [];
    for (var i = 0; i < 3; i++) {
      var _document$getElementB6, _document$getElementB7, _document$getElementB8;
      var existing = (existingList === null || existingList === void 0 ? void 0 : existingList[i]) || {};
      services.push({
        title: ((_document$getElementB6 = document.getElementById("support_".concat(prefix, "_svc_title_").concat(i))) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.value) || '',
        price: ((_document$getElementB7 = document.getElementById("support_".concat(prefix, "_svc_price_").concat(i))) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.value) || '',
        detailsHtml: ((_document$getElementB8 = document.getElementById("support_".concat(prefix, "_svc_details_").concat(i))) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.value) || '',
        btnText: existing.btnText || 'Оставить заявку',
        btnLink: existing.btnLink || '#contacts'
      });
    }
    return services;
  }
  function collectChecklistSection(prefix, existing) {
    var _ref, _document$getElementB1, _document$getElementB10;
    var checklistItems = [];
    var checkCount = document.querySelectorAll("[id^=\"support_".concat(prefix, "_check_lines_\"]")).length;
    for (var i = 0; i < checkCount; i++) {
      var _document$getElementB9, _document$getElementB0;
      var linesRaw = ((_document$getElementB9 = document.getElementById("support_".concat(prefix, "_check_lines_").concat(i))) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.value) || '';
      var fileInput = document.getElementById("support_".concat(prefix, "_check_file_").concat(i));
      checklistItems.push({
        lines: linesRaw.split('\n').map(function (line) {
          return line.trim();
        }).filter(Boolean),
        file: (fileInput === null || fileInput === void 0 ? void 0 : fileInput.value) || '',
        fileName: ((_document$getElementB0 = document.getElementById("support_".concat(prefix, "_check_file_").concat(i, "_name"))) === null || _document$getElementB0 === void 0 ? void 0 : _document$getElementB0.textContent) || ''
      });
    }
    return {
      title: (_ref = (_document$getElementB1 = (_document$getElementB10 = document.getElementById("support_".concat(prefix, "_check_title"))) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.value) !== null && _document$getElementB1 !== void 0 ? _document$getElementB1 : existing === null || existing === void 0 ? void 0 : existing.title) !== null && _ref !== void 0 ? _ref : '',
      items: checklistItems
    };
  }
  function readImageVal(id) {
    var _document$getElementB11;
    return ((_document$getElementB11 = document.getElementById("".concat(id, "_val"))) === null || _document$getElementB11 === void 0 ? void 0 : _document$getElementB11.value) || '';
  }
  function collectAudienceSection(prefix, existing) {
    var _ref3, _document$getElementB14, _document$getElementB15;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (options.splitByLaw) {
      var _ref2, _document$getElementB12, _document$getElementB13;
      return {
        title: (_ref2 = (_document$getElementB12 = (_document$getElementB13 = document.getElementById("support_".concat(prefix, "_title"))) === null || _document$getElementB13 === void 0 ? void 0 : _document$getElementB13.value) !== null && _document$getElementB12 !== void 0 ? _document$getElementB12 : existing === null || existing === void 0 ? void 0 : existing.title) !== null && _ref2 !== void 0 ? _ref2 : '',
        services44: collectServiceList('customers_44', existing === null || existing === void 0 ? void 0 : existing.services44),
        services223: collectServiceList('customers_223', existing === null || existing === void 0 ? void 0 : existing.services223),
        checklist: collectChecklistSection(prefix, existing === null || existing === void 0 ? void 0 : existing.checklist)
      };
    }
    return {
      title: (_ref3 = (_document$getElementB14 = (_document$getElementB15 = document.getElementById("support_".concat(prefix, "_title"))) === null || _document$getElementB15 === void 0 ? void 0 : _document$getElementB15.value) !== null && _document$getElementB14 !== void 0 ? _document$getElementB14 : existing === null || existing === void 0 ? void 0 : existing.title) !== null && _ref3 !== void 0 ? _ref3 : '',
      services: collectServiceList(prefix, existing === null || existing === void 0 ? void 0 : existing.services),
      checklist: collectChecklistSection(prefix, existing === null || existing === void 0 ? void 0 : existing.checklist)
    };
  }
  function collectSupportPageFromForm(existing) {
    var _ref4, _document$getElementB18, _document$getElementB19, _data$calculator, _data$calculator2;
    var data = getMigratedData(existing || window.supportPageData || {});
    data.heroSlides = window.AdminHeroSlides ? AdminHeroSlides.collect('support_hero') : [];
    data.hero = data.heroSlides[0] || data.hero || {};
    data.navCards = [];
    var navCount = document.querySelectorAll('[id^="support_nav_label_"]').length;
    for (var i = 0; i < navCount; i++) {
      var _document$getElementB16, _document$getElementB17, _data$navCards;
      data.navCards.push({
        label: ((_document$getElementB16 = document.getElementById("support_nav_label_".concat(i))) === null || _document$getElementB16 === void 0 ? void 0 : _document$getElementB16.value) || '',
        href: ((_document$getElementB17 = document.getElementById("support_nav_href_".concat(i))) === null || _document$getElementB17 === void 0 ? void 0 : _document$getElementB17.value) || '#',
        icon: readImageVal("support_nav_icon_".concat(i)) || ((_data$navCards = data.navCards) === null || _data$navCards === void 0 || (_data$navCards = _data$navCards[i]) === null || _data$navCards === void 0 ? void 0 : _data$navCards.icon) || ''
      });
    }
    data.customers = collectAudienceSection('customers', data.customers, {
      splitByLaw: true
    });
    data.suppliers = collectAudienceSection('suppliers', data.suppliers);
    data.calculator = {
      title: (_ref4 = (_document$getElementB18 = (_document$getElementB19 = document.getElementById('support_calc_title')) === null || _document$getElementB19 === void 0 ? void 0 : _document$getElementB19.value) !== null && _document$getElementB18 !== void 0 ? _document$getElementB18 : (_data$calculator = data.calculator) === null || _data$calculator === void 0 ? void 0 : _data$calculator.title) !== null && _ref4 !== void 0 ? _ref4 : '',
      image: readImageVal('support_calc_image') || ((_data$calculator2 = data.calculator) === null || _data$calculator2 === void 0 ? void 0 : _data$calculator2.image) || ''
    };
    return migrateSupportPageData(data);
  }
  function pickImage(uploadId) {
    var _document$getElementB20;
    window.cropTarget = {
      uploadId: uploadId,
      aspect: AdminSupport.getAspect(uploadId)
    };
    window.activeAuthorIndex = null;
    window.activeFeatureCardIndex = undefined;
    window.activeAboutImage = false;
    (_document$getElementB20 = document.getElementById('imageInput')) === null || _document$getElementB20 === void 0 || _document$getElementB20.click();
  }
  function clearImage(uploadId) {
    setImageUploadState(uploadId, '');
  }
  function pickFile(inputId) {
    var _document$getElementB21;
    window.fileUploadTarget = inputId;
    (_document$getElementB21 = document.getElementById('docFileInput')) === null || _document$getElementB21 === void 0 || _document$getElementB21.click();
  }
  function applyCroppedImage(uploadId, dataUrl) {
    if (uploadId && uploadId.startsWith('support_')) {
      setImageUploadState(uploadId, dataUrl);
    }
  }
  function getAspect(uploadId) {
    if (uploadId === 'support_hero_bg' || uploadId !== null && uploadId !== void 0 && uploadId.startsWith('support_hero_bg_')) return 1520 / 420;
    if (uploadId === 'support_calc_image') return 845 / 845;
    if (uploadId.startsWith('support_nav_icon_')) return 122 / 154;
    return 16 / 9;
  }
  function getCropSize(uploadId) {
    if (uploadId === 'support_hero_bg' || uploadId !== null && uploadId !== void 0 && uploadId.startsWith('support_hero_bg_')) return [1520, 420];
    if (uploadId === 'support_calc_image') return [845, 845];
    if (uploadId.startsWith('support_nav_icon_')) return [122, 154];
    return [1200, 675];
  }
  function isSupportUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('support_'));
  }
  function isSupportFileInputId(inputId) {
    return Boolean(inputId && inputId.startsWith('support_') && inputId.includes('_check_file_'));
  }
  window.AdminSupport = {
    DEFAULT_SUPPORT_PAGE: DEFAULT_SUPPORT_PAGE,
    migrateSupportPageData: migrateSupportPageData,
    renderSupportPageAdmin: renderSupportPageAdmin,
    collectSupportPageFromForm: collectSupportPageFromForm,
    setImageUploadState: setImageUploadState,
    setFileUploadState: setFileUploadState,
    pickImage: pickImage,
    clearImage: clearImage,
    pickFile: pickFile,
    applyCroppedImage: applyCroppedImage,
    getAspect: getAspect,
    getCropSize: getCropSize,
    isSupportUploadId: isSupportUploadId,
    isSupportFileInputId: isSupportFileInputId,
    openServiceDetails: openServiceDetails,
    addHeroSlide: function addHeroSlide() {
      var _window$saveSupportPa2, _window2;
      (_window$saveSupportPa2 = (_window2 = window).saveSupportPageStateToMemory) === null || _window$saveSupportPa2 === void 0 || _window$saveSupportPa2.call(_window2);
      var page = window.supportPageData || {};
      if (!page.heroSlides) page.heroSlides = [];
      if (page.heroSlides.length >= AdminHeroSlides.MAX) {
        alert("\u041D\u0435 \u0431\u043E\u043B\u0435\u0435 ".concat(AdminHeroSlides.MAX, " \u0441\u043B\u0430\u0439\u0434\u043E\u0432"));
        return;
      }
      page.heroSlides.push({
        title: '',
        subtitle: '',
        background: ''
      });
      renderSupportPageAdmin(page);
    },
    removeHeroSlide: function removeHeroSlide(i) {
      var _window$saveSupportPa3, _window3, _page$heroSlides;
      (_window$saveSupportPa3 = (_window3 = window).saveSupportPageStateToMemory) === null || _window$saveSupportPa3 === void 0 || _window$saveSupportPa3.call(_window3);
      var page = window.supportPageData || {};
      if (!((_page$heroSlides = page.heroSlides) !== null && _page$heroSlides !== void 0 && _page$heroSlides.length)) return;
      page.heroSlides.splice(i, 1);
      if (!page.heroSlides.length) page.heroSlides.push({
        title: '',
        subtitle: '',
        background: ''
      });
      renderSupportPageAdmin(page);
    },
    addChecklistItem: function addChecklistItem(prefix) {
      var _window$saveSupportPa4, _window4;
      (_window$saveSupportPa4 = (_window4 = window).saveSupportPageStateToMemory) === null || _window$saveSupportPa4 === void 0 || _window$saveSupportPa4.call(_window4);
      var key = prefix === 'customers' ? 'customers' : 'suppliers';
      window.supportPageData[key].checklist.items.push({
        lines: [''],
        file: ''
      });
      renderSupportPageAdmin(window.supportPageData);
    },
    removeChecklistItem: function removeChecklistItem(prefix, index) {
      var _window$saveSupportPa5, _window5;
      (_window$saveSupportPa5 = (_window5 = window).saveSupportPageStateToMemory) === null || _window$saveSupportPa5 === void 0 || _window$saveSupportPa5.call(_window5);
      var key = prefix === 'customers' ? 'customers' : 'suppliers';
      window.supportPageData[key].checklist.items.splice(index, 1);
      renderSupportPageAdmin(window.supportPageData);
    }
  };
})();