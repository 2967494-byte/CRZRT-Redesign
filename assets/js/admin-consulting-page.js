function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Редактор страницы «Юридический консалтинг» для admin.html
 */
(function (_window$ConsultingCon) {
  var DEFAULT_CONSULTING_PAGE = ((_window$ConsultingCon = window.ConsultingContent) === null || _window$ConsultingCon === void 0 ? void 0 : _window$ConsultingCon.CONSULTING_DEFAULTS) || {
    hero: {
      background: '',
      graphic: '',
      title: '',
      titleColor: '#ffffff',
      titleTop: 122,
      titleLeft: 70,
      subtitle: '',
      subtitleColor: '#ffffff',
      subtitleTop: 213,
      subtitleLeft: 70
    },
    competenciesTitle: 'Компетенции',
    competencies: [],
    whyUs: {
      title: 'Почему мы?',
      lead: {
        text: ''
      },
      photo: {
        image: '',
        caption: ''
      },
      support: {
        text: ''
      },
      side: {
        text: '',
        image: ''
      }
    }
  };
  function escapeAttr(s) {
    return String(s !== null && s !== void 0 ? s : '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }
  function migrateConsultingPageData(raw) {
    var _window$ConsultingCon2;
    if ((_window$ConsultingCon2 = window.ConsultingContent) !== null && _window$ConsultingCon2 !== void 0 && _window$ConsultingCon2.migrateConsultingData) {
      return window.ConsultingContent.migrateConsultingData(raw);
    }
    return _objectSpread(_objectSpread({}, DEFAULT_CONSULTING_PAGE), raw || {});
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
      frame.classList.toggle('cover-upload-frame--empty', !v);
    }
    if (clr) clr.style.display = v ? 'inline-flex' : 'none';
    if (id === 'consulting_hero_bg') {
      var livePreview = document.getElementById('consulting_hero_live_preview');
      if (livePreview) {
        if (v) {
          livePreview.style.backgroundImage = "url('".concat(v, "')");
        } else {
          livePreview.style.backgroundImage = 'radial-gradient(32.3% 55.38% at 71.22% 54%, #FFFFFF 0%, #B8FDC6 100%)';
        }
      }
    }
  }
  function coverUploadShell(id, label, hint, width, height) {
    var sizeLabel = "".concat(width, "\xD7").concat(height);
    return "\n      <div class=\"form-group cover-upload-group\" style=\"margin-bottom:0;\">\n        <label>".concat(label, "</label>\n        ").concat(hint ? "<p style=\"color:var(--text-secondary);font-size:0.85rem;margin:-4px 0 8px;\">".concat(hint, "</p>") : '', "\n        <div class=\"cover-upload-frame cover-upload-frame--empty\" data-upload-frame-for=\"").concat(id, "\" style=\"--cover-aspect: ").concat(width, " / ").concat(height, ";\">\n          <span class=\"cover-upload-frame__empty\">").concat(sizeLabel, "</span>\n          <img id=\"").concat(id, "_preview\" class=\"cover-upload-frame__img\" src=\"\" alt=\"\">\n        </div>\n        <div class=\"hero-slide-upload-actions image-upload-mini\" data-upload-id=\"").concat(id, "\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:8px 14px;font-size:0.85rem;\" onclick=\"AdminConsultingPage.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n          <button type=\"button\" class=\"btn-delete\" style=\"padding:8px 14px;font-size:0.85rem;display:none;\" id=\"").concat(id, "_clear\" onclick=\"AdminConsultingPage.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n          <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n        </div>\n      </div>");
  }
  function heroBgUploadShell(id, label) {
    var sizeLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1520×420';
    return "\n      <div class=\"form-group hero-slide-upload-group\" style=\"margin-bottom:0;\">\n        <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;\">\n          <label style=\"margin-bottom:0;\">".concat(label, "</label>\n          <div class=\"hero-slide-upload-actions image-upload-mini\" data-upload-id=\"").concat(id, "\" style=\"display:flex; gap:8px;\">\n            <button type=\"button\" class=\"btn-save\" style=\"padding:6px 12px;font-size:0.8rem;\" onclick=\"AdminConsultingPage.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n            <button type=\"button\" class=\"btn-delete\" style=\"padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;\" id=\"").concat(id, "_clear\" onclick=\"AdminConsultingPage.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n            <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n          </div>\n        </div>\n        <div class=\"hero-slide-frame hero-slide-frame--empty\" data-upload-frame-for=\"").concat(id, "\">\n          <span class=\"hero-slide-frame__empty\">").concat(sizeLabel, "</span>\n          <img id=\"").concat(id, "_preview\" class=\"hero-slide-frame__img\" src=\"\" alt=\"\">\n        </div>\n      </div>");
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
    return "\n      <div class=\"form-group\" style=\"margin-bottom:0;\">\n        <label>".concat(label, "</label>\n        ").concat(hint ? "<p style=\"color:var(--text-secondary);font-size:0.85rem;margin:-4px 0 8px;\">".concat(hint, "</p>") : '', "\n        <div class=\"image-upload-mini\" data-upload-id=\"").concat(id, "\">\n          <img id=\"").concat(id, "_preview\" src=\"\" alt=\"\" style=\"max-width:220px;max-height:160px;object-fit:contain;border-radius:8px;display:none;margin-bottom:8px;background:rgba(0,0,0,0.15);\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:8px 14px;font-size:0.85rem;\" onclick=\"AdminConsultingPage.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n          <button type=\"button\" class=\"btn-delete\" style=\"padding:8px 14px;margin-left:8px;font-size:0.85rem;display:none;\" id=\"").concat(id, "_clear\" onclick=\"AdminConsultingPage.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n          <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n        </div>\n      </div>");
  }
  function compactCompIconUploadHtml(id) {
    return "\n      <div class=\"form-group consulting-comp-admin-card__icon\">\n        <label>\u0418\u043A\u043E\u043D\u043A\u0430</label>\n        <div class=\"image-upload-mini\" data-upload-id=\"".concat(id, "\">\n          <img id=\"").concat(id, "_preview\" class=\"consulting-comp-admin-card__icon-preview\" src=\"\" alt=\"\">\n          <div class=\"consulting-comp-admin-card__icon-actions\">\n            <button type=\"button\" class=\"btn-save\" onclick=\"AdminConsultingPage.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n            <button type=\"button\" class=\"btn-delete consulting-comp-admin-card__icon-clear\" style=\"display:none;\" id=\"").concat(id, "_clear\" onclick=\"AdminConsultingPage.clearImage('").concat(id, "')\">\xD7</button>\n          </div>\n          <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n        </div>\n      </div>");
  }
  function getMigratedData(data) {
    return migrateConsultingPageData(data || {});
  }
  function consultingHeroSlidesConfig() {
    return {
      prefix: 'consulting_hero',
      removeHandler: 'AdminConsultingPage.removeHeroSlide',
      pickHandler: 'AdminConsultingPage.pickImage',
      clearHandler: 'AdminConsultingPage.clearImage',
      previewClass: 'consulting-live-banner-preview',
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
    var el = document.getElementById('consultingPageHeroAdmin');
    if (!el || !window.AdminHeroSlides) return;
    var migrated = getMigratedData(data);
    AdminHeroSlides.render(el, migrated.heroSlides || [], consultingHeroSlidesConfig(), setImageUploadState);
  }
  function renderCompetenciesAdmin(data) {
    var el = document.getElementById('consultingPageCompetenciesAdmin');
    if (!el) return;
    var migrated = getMigratedData(data);
    var items = migrated.competencies || [];
    el.innerHTML = "\n      <div class=\"form-group\">\n        <label>\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0441\u0435\u043A\u0446\u0438\u0438</label>\n        <input type=\"text\" class=\"form-control\" id=\"consulting_competencies_title\" value=\"".concat(escapeAttr(migrated.competenciesTitle), "\">\n      </div>\n      <div id=\"consultingCompetenciesList\" class=\"consulting-comp-admin-grid\">\n        ").concat(items.map(function (item, i) {
      return "\n          <div class=\"consulting-comp-admin-card\">\n            <div class=\"consulting-comp-admin-card__head\">\n              <strong>\u2116".concat(i + 1, "</strong>\n              <button type=\"button\" class=\"btn-delete consulting-comp-admin-card__remove\" onclick=\"AdminConsultingPage.removeCompetency(").concat(i, ")\" aria-label=\"\u0423\u0434\u0430\u043B\u0438\u0442\u044C\">\xD7</button>\n            </div>\n            ").concat(compactCompIconUploadHtml("consulting_comp_icon_".concat(i)), "\n            <div class=\"form-group consulting-comp-admin-card__text\">\n              <label>\u041D\u0430\u0434\u043F\u0438\u0441\u044C</label>\n              <textarea class=\"form-control\" id=\"consulting_comp_text_").concat(i, "\" rows=\"2\">").concat(escapeAttr(item.title), "</textarea>\n            </div>\n            <div class=\"form-group consulting-comp-admin-card__link\">\n              <label>\u0421\u0441\u044B\u043B\u043A\u0430</label>\n              <input type=\"text\" class=\"form-control\" id=\"consulting_comp_link_").concat(i, "\" value=\"").concat(escapeAttr(item.link || '#competencies'), "\" placeholder=\"#competencies\">\n            </div>\n            <div class=\"form-group\" style=\"margin-top:8px; margin-bottom:0;\">\n              <button type=\"button\" class=\"btn-save\" style=\"width: 100%; font-size: 0.85rem; padding: 6px 12px;\" onclick=\"AdminConsultingPage.openDescriptionModal(").concat(i, ")\">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</button>\n              <textarea id=\"consulting_comp_desc_").concat(i, "\" style=\"display:none;\">").concat(escapeAttr(item.description || ''), "</textarea>\n            </div>\n          </div>");
    }).join(''), "\n      </div>");
    items.forEach(function (item, i) {
      return setImageUploadState("consulting_comp_icon_".concat(i), item.icon);
    });
  }
  function renderWhyAdmin(data) {
    var el = document.getElementById('consultingPageWhyAdmin');
    if (!el) return;
    var why = getMigratedData(data).whyUs || {};
    var lead = why.lead || {};
    var photo = why.photo || {};
    var support = why.support || {};
    var side = why.side || {};
    el.innerHTML = "\n      <div class=\"form-group\">\n        <label>\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0441\u0435\u043A\u0446\u0438\u0438</label>\n        <input type=\"text\" class=\"form-control\" id=\"consulting_why_title\" value=\"".concat(escapeAttr(why.title), "\">\n      </div>\n\n      <div class=\"consulting-why-admin-row\" style=\"display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 16px;\">\n        <div class=\"admin-card\" style=\"margin:0;padding:16px;background:rgba(255,255,255,0.03); display: flex; flex-direction: column;\">\n          <strong style=\"display:block;margin-bottom:12px;\">\u0411\u043B\u043E\u043A 1 \u2014 \u0431\u043E\u043B\u044C\u0448\u0430\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430</strong>\n          <div class=\"form-group\" style=\"flex-grow: 1; display: flex; flex-direction: column; margin-bottom: 0;\">\n            <label>\u0422\u0435\u043A\u0441\u0442</label>\n            <textarea class=\"form-control\" id=\"consulting_why_lead_text\" rows=\"8\" style=\"flex-grow: 1; resize: vertical;\">").concat(escapeAttr(lead.text), "</textarea>\n          </div>\n        </div>\n\n        <div class=\"admin-card\" style=\"margin:0;padding:16px;background:rgba(255,255,255,0.03); display: flex; flex-direction: column;\">\n          <strong style=\"display:block;margin-bottom:12px;\">\u0411\u043B\u043E\u043A 2 \u2014 \u0444\u043E\u0442\u043E \u0441 \u043F\u043E\u0434\u043F\u0438\u0441\u044C\u044E</strong>\n          <div style=\"flex-grow: 1; display: flex; flex-direction: column; gap: 12px;\">\n            ").concat(imageUploadHtml('consulting_why_photo', 'Фото (~494×329)', ''), "\n            <div class=\"form-group\" style=\"margin-bottom: 0; margin-top: auto;\">\n              <label>\u041F\u043E\u0434\u043F\u0438\u0441\u044C \u043F\u043E\u0434 \u0444\u043E\u0442\u043E</label>\n              <input type=\"text\" class=\"form-control\" id=\"consulting_why_photo_caption\" value=\"").concat(escapeAttr(photo.caption), "\" style=\"margin-bottom: 0;\">\n            </div>\n          </div>\n        </div>\n\n        <div class=\"admin-card\" style=\"margin:0;padding:16px;background:rgba(255,255,255,0.03); display: flex; flex-direction: column;\">\n          <strong style=\"display:block;margin-bottom:12px;\">\u0411\u043B\u043E\u043A 3 \u2014 \xAB\u041F\u043E\u043C\u043E\u0433\u0430\u0435\u043C...\xBB</strong>\n          <div class=\"form-group\" style=\"flex-grow: 1; display: flex; flex-direction: column; margin-bottom: 0;\">\n            <label>\u0422\u0435\u043A\u0441\u0442 (Enter \u2014 \u043F\u0435\u0440\u0435\u043D\u043E\u0441)</label>\n            <textarea class=\"form-control\" id=\"consulting_why_support_text\" rows=\"8\" style=\"flex-grow: 1; resize: vertical;\">").concat(escapeAttr(support.text), "</textarea>\n          </div>\n        </div>\n\n        <div class=\"admin-card\" style=\"margin:0;padding:16px;background:rgba(255,255,255,0.03); display: flex; flex-direction: column;\">\n          <strong style=\"display:block;margin-bottom:12px;\">\u0411\u043B\u043E\u043A 4 \u2014 \u0431\u043E\u043A\u043E\u0432\u0430\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430</strong>\n          <div style=\"flex-grow: 1; display: flex; flex-direction: column; gap: 12px;\">\n            <div class=\"form-group\" style=\"margin-bottom: 0;\">\n              <label>\u0422\u0435\u043A\u0441\u0442</label>\n              <textarea class=\"form-control\" id=\"consulting_why_side_text\" rows=\"2\">").concat(escapeAttr(side.text), "</textarea>\n            </div>\n            <div style=\"margin-top: auto;\">\n              ").concat(coverUploadShell('consulting_why_side_image', 'Фоновое изображение', '', 489, 763), "\n            </div>\n          </div>\n        </div>\n      </div>");
    setImageUploadState('consulting_why_photo', photo.image);
    setImageUploadState('consulting_why_side_image', side.image);
  }
  function renderConsultingPageAdmin(data) {
    renderHeroAdmin(data);
    renderCompetenciesAdmin(data);
    renderWhyAdmin(data);
  }
  function readImageVal(id) {
    var _document$getElementB;
    return ((_document$getElementB = document.getElementById("".concat(id, "_val"))) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value) || '';
  }
  var activeCompetencyIndex = null;
  var competencyModalInitialized = false;
  function openDescriptionModal(i) {
    activeCompetencyIndex = i;
    var modal = document.getElementById('competencyModal');
    var editor = document.getElementById('competencyFormDescription');
    var textarea = document.getElementById("consulting_comp_desc_".concat(i));
    if (modal && editor && textarea) {
      editor.innerHTML = textarea.value || '';
      modal.style.display = 'flex';
      editor.focus();
      updateWysiwygToolbarState();
    }
  }
  function closeDescriptionModal() {
    var modal = document.getElementById('competencyModal');
    if (modal) {
      modal.style.display = 'none';
    }
    activeCompetencyIndex = null;
  }
  function initCompetencyModal() {
    if (competencyModalInitialized) return;
    var modal = document.getElementById('competencyModal');
    if (!modal) {
      console.log('competencyModal not found in DOM, creating dynamically...');
      modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.id = 'competencyModal';
      modal.style.cssText = 'display: none; z-index: 1050;';
      modal.innerHTML = "\n        <div class=\"modal-content admin-courses-modal\" style=\"max-width: 800px; width: 100%;\">\n            <button type=\"button\" class=\"btn-modal-close\" id=\"competencyModalClose\" aria-label=\"\u0417\u0430\u043A\u0440\u044B\u0442\u044C\">\n                <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" aria-hidden=\"true\">\n                    <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line>\n                    <line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line>\n                </svg>\n            </button>\n            <h2 class=\"modal-title admin-courses-modal__title\" id=\"competencyModalTitle\">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0435\u0442\u0435\u043D\u0446\u0438\u0438</h2>\n            <form id=\"competencyForm\" class=\"admin-courses-modal__form\">\n                <div class=\"form-group admin-courses-modal__desc-section\">\n                    <div class=\"wysiwyg-container\">\n                        <div class=\"wysiwyg-toolbar\" id=\"compWysiwygToolbar\">\n                            <button type=\"button\" class=\"wysiwyg-btn\" data-command=\"bold\" title=\"\u0416\u0438\u0440\u043D\u044B\u0439\">\n                                <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z\"></path><path d=\"M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z\"></path></svg>\n                            </button>\n                            <button type=\"button\" class=\"wysiwyg-btn\" data-command=\"italic\" title=\"\u041A\u0443\u0440\u0441\u0438\u0432\">\n                                <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"19\" y1=\"4\" x2=\"10\" y2=\"4\"></line><line x1=\"14\" y1=\"20\" x2=\"5\" y2=\"20\"></line><line x1=\"15\" y1=\"4\" x2=\"9\" y2=\"20\"></line></svg>\n                            </button>\n                            <button type=\"button\" class=\"wysiwyg-btn\" data-command=\"underline\" title=\"\u041F\u043E\u0434\u0447\u0435\u0440\u043A\u043D\u0443\u0442\u044B\u0439\">\n                                <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3\"></path><line x1=\"4\" y1=\"21\" x2=\"20\" y2=\"21\"></line></svg>\n                            </button>\n                            <div class=\"wysiwyg-divider\"></div>\n                            <button type=\"button\" class=\"wysiwyg-btn\" data-command=\"justifyLeft\" title=\"\u041F\u043E \u043B\u0435\u0432\u043E\u043C\u0443 \u043A\u0440\u0430\u044E\">\n                                <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"17\" y1=\"10\" x2=\"3\" y2=\"10\"></line><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"></line><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"></line><line x1=\"17\" y1=\"18\" x2=\"3\" y2=\"18\"></line></svg>\n                            </button>\n                            <button type=\"button\" class=\"wysiwyg-btn\" data-command=\"justifyCenter\" title=\"\u041F\u043E \u0446\u0435\u043D\u0442\u0440\u0443\">\n                                <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"18\" y1=\"10\" x2=\"6\" y2=\"10\"></line><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"></line><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"></line><line x1=\"18\" y1=\"18\" x2=\"6\" y2=\"18\"></line></svg>\n                            </button>\n                            <button type=\"button\" class=\"wysiwyg-btn\" data-command=\"justifyRight\" title=\"\u041F\u043E \u043F\u0440\u0430\u0432\u043E\u043C\u0443 \u043A\u0440\u0430\u044E\">\n                                <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"21\" y1=\"10\" x2=\"7\" y2=\"10\"></line><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"></line><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"></line><line x1=\"21\" y1=\"18\" x2=\"7\" y2=\"18\"></line></svg>\n                            </button>\n                            <div class=\"wysiwyg-divider\"></div>\n                            \n                            <div class=\"wysiwyg-tool-group\" title=\"\u0420\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430\">\n                                <span class=\"wysiwyg-tool-label\">\u0420\u0430\u0437\u043C\u0435\u0440:</span>\n                                <select class=\"wysiwyg-select\" id=\"compWysiwygFontSize\">\n                                    <option value=\"1\">1 (\u041C\u0435\u043B\u043A\u0438\u0439)</option>\n                                    <option value=\"2\">2 (\u041D\u0435\u0431\u043E\u043B\u044C\u0448\u043E\u0439)</option>\n                                    <option value=\"3\" selected>3 (\u041E\u0431\u044B\u0447\u043D\u044B\u0439)</option>\n                                    <option value=\"4\">4 (\u0421\u0440\u0435\u0434\u043D\u0438\u0439)</option>\n                                    <option value=\"5\">5 (\u0411\u043E\u043B\u044C\u0448\u043E\u0439)</option>\n                                    <option value=\"6\">6 (\u041E\u0447\u0435\u043D\u044C \u0431\u043E\u043B\u044C\u0448\u043E\u0439)</option>\n                                    <option value=\"7\">7 (\u041E\u0433\u0440\u043E\u043C\u043D\u044B\u0439)</option>\n                                </select>\n                            </div>\n\n                            <div class=\"wysiwyg-divider\"></div>\n\n                            <div class=\"wysiwyg-tool-group\" title=\"\u0426\u0432\u0435\u0442 \u0442\u0435\u043A\u0441\u0442\u0430\">\n                                <span class=\"wysiwyg-tool-label\">\u0426\u0432\u0435\u0442:</span>\n                                <input type=\"color\" id=\"compWysiwygColor\" class=\"wysiwyg-color-input\" value=\"#1D1D1F\">\n                            </div>\n                        </div>\n                        <div class=\"wysiwyg-editor form-control\" id=\"competencyFormDescription\" contenteditable=\"true\" spellcheck=\"false\" style=\"min-height: 250px;\"></div>\n                    </div>\n                </div>\n                <div class=\"admin-courses-modal__actions\" style=\"display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px;\">\n                    <button type=\"button\" class=\"btn-secondary\" id=\"competencyModalCancel\">\u041E\u0442\u043C\u0435\u043D\u0430</button>\n                    <button type=\"submit\" class=\"btn-save\" id=\"competencyModalSave\">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button>\n                </div>\n            </form>\n        </div>\n      ";
      document.body.appendChild(modal);
    }
    var closeBtn = document.getElementById('competencyModalClose');
    var cancelBtn = document.getElementById('competencyModalCancel');
    var form = document.getElementById('competencyForm');
    if (closeBtn) closeBtn.addEventListener('click', closeDescriptionModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeDescriptionModal);
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var editor = document.getElementById('competencyFormDescription');
        if (activeCompetencyIndex !== null && editor) {
          var textarea = document.getElementById("consulting_comp_desc_".concat(activeCompetencyIndex));
          if (textarea) {
            var _window$saveConsultin, _window;
            textarea.value = editor.innerHTML;
            (_window$saveConsultin = (_window = window).saveConsultingPageStateToMemory) === null || _window$saveConsultin === void 0 || _window$saveConsultin.call(_window);
          }
        }
        closeDescriptionModal();
      });
    }
    var wysiwygBtns = document.querySelectorAll('#compWysiwygToolbar .wysiwyg-btn');
    wysiwygBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var command = btn.getAttribute('data-command');
        document.execCommand(command, false, null);
        var editor = document.getElementById('competencyFormDescription');
        if (editor) editor.focus();
        updateWysiwygToolbarState();
      });
    });
    var wysiwygFontSize = document.getElementById('compWysiwygFontSize');
    if (wysiwygFontSize) {
      wysiwygFontSize.addEventListener('change', function (e) {
        document.execCommand('fontSize', false, e.target.value);
        var editor = document.getElementById('competencyFormDescription');
        if (editor) editor.focus();
      });
    }
    var wysiwygColor = document.getElementById('compWysiwygColor');
    if (wysiwygColor) {
      wysiwygColor.addEventListener('input', function (e) {
        document.execCommand('foreColor', false, e.target.value);
        var editor = document.getElementById('competencyFormDescription');
        if (editor) editor.focus();
      });
    }
    var editor = document.getElementById('competencyFormDescription');
    if (editor) {
      editor.addEventListener('keyup', updateWysiwygToolbarState);
      editor.addEventListener('mouseup', updateWysiwygToolbarState);
    }
    competencyModalInitialized = true;
  }
  function updateWysiwygToolbarState() {
    var wysiwygBtns = document.querySelectorAll('#compWysiwygToolbar .wysiwyg-btn');
    wysiwygBtns.forEach(function (btn) {
      var command = btn.getAttribute('data-command');
      if (document.queryCommandState(command)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompetencyModal);
  } else {
    initCompetencyModal();
  }
  function collectConsultingPageFromForm(existing) {
    var _data$hero, _ref, _document$getElementB2, _document$getElementB3, _ref2, _document$getElementB7, _document$getElementB8, _ref3, _document$getElementB9, _document$getElementB0, _existingWhy$lead, _existingWhy$photo, _ref4, _document$getElementB1, _document$getElementB10, _existingWhy$photo2, _ref5, _document$getElementB11, _document$getElementB12, _existingWhy$support, _ref6, _document$getElementB13, _document$getElementB14, _existingWhy$side, _existingWhy$side2;
    var data = getMigratedData(existing || window.consultingPageData || {});
    data.heroSlides = window.AdminHeroSlides ? AdminHeroSlides.collect('consulting_hero') : [];
    data.hero = _objectSpread(_objectSpread({}, data.heroSlides[0] || {}), {}, {
      graphic: readImageVal('consulting_hero_graphic') || ((_data$hero = data.hero) === null || _data$hero === void 0 ? void 0 : _data$hero.graphic) || ''
    });
    data.competenciesTitle = (_ref = (_document$getElementB2 = (_document$getElementB3 = document.getElementById('consulting_competencies_title')) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.value) !== null && _document$getElementB2 !== void 0 ? _document$getElementB2 : data.competenciesTitle) !== null && _ref !== void 0 ? _ref : '';
    data.competencies = [];
    var compCount = document.querySelectorAll('[id^="consulting_comp_text_"]').length;
    for (var i = 0; i < compCount; i++) {
      var _document$getElementB4, _data$competencies, _document$getElementB5, _document$getElementB6;
      data.competencies.push({
        title: ((_document$getElementB4 = document.getElementById("consulting_comp_text_".concat(i))) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value) || '',
        icon: readImageVal("consulting_comp_icon_".concat(i)) || ((_data$competencies = data.competencies) === null || _data$competencies === void 0 || (_data$competencies = _data$competencies[i]) === null || _data$competencies === void 0 ? void 0 : _data$competencies.icon) || '',
        link: ((_document$getElementB5 = document.getElementById("consulting_comp_link_".concat(i))) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.value) || '#competencies',
        description: ((_document$getElementB6 = document.getElementById("consulting_comp_desc_".concat(i))) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.value) || ''
      });
    }
    var existingWhy = data.whyUs || {};
    data.whyUs = {
      title: (_ref2 = (_document$getElementB7 = (_document$getElementB8 = document.getElementById('consulting_why_title')) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.value) !== null && _document$getElementB7 !== void 0 ? _document$getElementB7 : existingWhy.title) !== null && _ref2 !== void 0 ? _ref2 : '',
      lead: {
        text: (_ref3 = (_document$getElementB9 = (_document$getElementB0 = document.getElementById('consulting_why_lead_text')) === null || _document$getElementB0 === void 0 ? void 0 : _document$getElementB0.value) !== null && _document$getElementB9 !== void 0 ? _document$getElementB9 : (_existingWhy$lead = existingWhy.lead) === null || _existingWhy$lead === void 0 ? void 0 : _existingWhy$lead.text) !== null && _ref3 !== void 0 ? _ref3 : ''
      },
      photo: {
        image: readImageVal('consulting_why_photo') || ((_existingWhy$photo = existingWhy.photo) === null || _existingWhy$photo === void 0 ? void 0 : _existingWhy$photo.image) || '',
        caption: (_ref4 = (_document$getElementB1 = (_document$getElementB10 = document.getElementById('consulting_why_photo_caption')) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.value) !== null && _document$getElementB1 !== void 0 ? _document$getElementB1 : (_existingWhy$photo2 = existingWhy.photo) === null || _existingWhy$photo2 === void 0 ? void 0 : _existingWhy$photo2.caption) !== null && _ref4 !== void 0 ? _ref4 : ''
      },
      support: {
        text: (_ref5 = (_document$getElementB11 = (_document$getElementB12 = document.getElementById('consulting_why_support_text')) === null || _document$getElementB12 === void 0 ? void 0 : _document$getElementB12.value) !== null && _document$getElementB11 !== void 0 ? _document$getElementB11 : (_existingWhy$support = existingWhy.support) === null || _existingWhy$support === void 0 ? void 0 : _existingWhy$support.text) !== null && _ref5 !== void 0 ? _ref5 : ''
      },
      side: {
        text: (_ref6 = (_document$getElementB13 = (_document$getElementB14 = document.getElementById('consulting_why_side_text')) === null || _document$getElementB14 === void 0 ? void 0 : _document$getElementB14.value) !== null && _document$getElementB13 !== void 0 ? _document$getElementB13 : (_existingWhy$side = existingWhy.side) === null || _existingWhy$side === void 0 ? void 0 : _existingWhy$side.text) !== null && _ref6 !== void 0 ? _ref6 : '',
        image: readImageVal('consulting_why_side_image') || ((_existingWhy$side2 = existingWhy.side) === null || _existingWhy$side2 === void 0 ? void 0 : _existingWhy$side2.image) || ''
      }
    };
    return data;
  }
  function pickImage(uploadId) {
    var _document$getElementB15;
    window.cropTarget = {
      uploadId: uploadId,
      aspect: AdminConsultingPage.getAspect(uploadId)
    };
    window.activeAuthorIndex = null;
    window.activeFeatureCardIndex = undefined;
    window.activeAboutImage = false;
    (_document$getElementB15 = document.getElementById('imageInput')) === null || _document$getElementB15 === void 0 || _document$getElementB15.click();
  }
  function clearImage(uploadId) {
    setImageUploadState(uploadId, '');
  }
  function applyCroppedImage(uploadId, dataUrl) {
    if (uploadId && uploadId.startsWith('consulting_')) {
      setImageUploadState(uploadId, dataUrl);
    }
  }
  var CONSULTING_WHY_SIDE_ASPECT = 489 / 763;
  function getAspect(uploadId) {
    if (uploadId === 'consulting_hero_bg' || uploadId !== null && uploadId !== void 0 && uploadId.startsWith('consulting_hero_bg_')) return 1520 / 420;
    if (uploadId === 'consulting_hero_graphic') return 1;
    if (uploadId === 'consulting_why_photo') return 494 / 329;
    if (uploadId === 'consulting_why_side_image') return CONSULTING_WHY_SIDE_ASPECT;
    if (uploadId.startsWith('consulting_comp_icon_')) return 109 / 110;
    return 16 / 9;
  }
  function getCropSize(uploadId) {
    if (uploadId === 'consulting_hero_bg' || uploadId !== null && uploadId !== void 0 && uploadId.startsWith('consulting_hero_bg_')) return [1520, 420];
    if (uploadId === 'consulting_hero_graphic') return [420, 420];
    if (uploadId === 'consulting_why_photo') return [494, 329];
    if (uploadId === 'consulting_why_side_image') return [978, 1526];
    if (uploadId.startsWith('consulting_comp_icon_')) return [109, 110];
    return [1200, 675];
  }
  function isConsultingUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('consulting_'));
  }
  window.AdminConsultingPage = {
    DEFAULT_CONSULTING_PAGE: DEFAULT_CONSULTING_PAGE,
    CONSULTING_WHY_SIDE_ASPECT: CONSULTING_WHY_SIDE_ASPECT,
    migrateConsultingPageData: migrateConsultingPageData,
    renderConsultingPageAdmin: renderConsultingPageAdmin,
    collectConsultingPageFromForm: collectConsultingPageFromForm,
    pickImage: pickImage,
    clearImage: clearImage,
    applyCroppedImage: applyCroppedImage,
    getAspect: getAspect,
    getCropSize: getCropSize,
    isConsultingUploadId: isConsultingUploadId,
    openDescriptionModal: openDescriptionModal,
    closeDescriptionModal: closeDescriptionModal,
    addHeroSlide: function addHeroSlide() {
      var _window$saveConsultin2, _window2;
      (_window$saveConsultin2 = (_window2 = window).saveConsultingPageStateToMemory) === null || _window$saveConsultin2 === void 0 || _window$saveConsultin2.call(_window2);
      var page = window.consultingPageData || {};
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
      renderConsultingPageAdmin(page);
    },
    removeHeroSlide: function removeHeroSlide(i) {
      var _window$saveConsultin3, _window3, _page$heroSlides;
      (_window$saveConsultin3 = (_window3 = window).saveConsultingPageStateToMemory) === null || _window$saveConsultin3 === void 0 || _window$saveConsultin3.call(_window3);
      var page = window.consultingPageData || {};
      if (!((_page$heroSlides = page.heroSlides) !== null && _page$heroSlides !== void 0 && _page$heroSlides.length)) return;
      page.heroSlides.splice(i, 1);
      if (!page.heroSlides.length) page.heroSlides.push({
        title: '',
        subtitle: '',
        background: ''
      });
      renderConsultingPageAdmin(page);
    },
    addCompetency: function addCompetency() {
      var _window$saveConsultin4, _window4;
      (_window$saveConsultin4 = (_window4 = window).saveConsultingPageStateToMemory) === null || _window$saveConsultin4 === void 0 || _window$saveConsultin4.call(_window4);
      window.consultingPageData.competencies.push({
        title: '',
        icon: '',
        link: '#competencies',
        description: ''
      });
      renderConsultingPageAdmin(window.consultingPageData);
    },
    removeCompetency: function removeCompetency(index) {
      var _window$saveConsultin5, _window5;
      (_window$saveConsultin5 = (_window5 = window).saveConsultingPageStateToMemory) === null || _window$saveConsultin5 === void 0 || _window$saveConsultin5.call(_window5);
      window.consultingPageData.competencies.splice(index, 1);
      renderConsultingPageAdmin(window.consultingPageData);
    }
  };
})();