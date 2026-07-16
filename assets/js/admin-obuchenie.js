function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Редактор страницы «Обучение» для admin.html
 */
(function (_window$ObuchenieCont) {
  var DEFAULT_OBUCHENIE_PAGE = ((_window$ObuchenieCont = window.ObuchenieContent) === null || _window$ObuchenieCont === void 0 ? void 0 : _window$ObuchenieCont.OBUCHENIE_DEFAULTS) || {
    hero: {
      background: '',
      title: '',
      subtitle: '',
      gavelImage: '',
      titleColor: '#00AE4D',
      subtitleColor: '#FFFFFF',
      titleTop: 68,
      titleLeft: 60,
      subtitleBottom: 40,
      subtitleLeft: 60
    },
    navCards: [],
    courseSearch: {
      title: '',
      cta: '',
      phone: '',
      phoneDisplay: '',
      tags: [],
      showAllLabel: '',
      blocks: []
    },
    calendar: {
      promoTitle: '',
      promoTitleColor: '',
      promoImage: '',
      promoLink: '',
      allCoursesLink: '',
      courseDaysByMonth: {}
    },
    courseRegistry: [],
    courseCards: [],
    testingBanner: {
      title: '',
      btnText: '',
      btnLink: '',
      image: ''
    }
  };
  function escapeAttr(s) {
    return String(s !== null && s !== void 0 ? s : '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }
  function migrateObucheniePageData(raw) {
    var _window$ObuchenieCont2;
    if ((_window$ObuchenieCont2 = window.ObuchenieContent) !== null && _window$ObuchenieCont2 !== void 0 && _window$ObuchenieCont2.migrateObucheniePageData) {
      return window.ObuchenieContent.migrateObucheniePageData(raw);
    }
    return _objectSpread(_objectSpread({}, DEFAULT_OBUCHENIE_PAGE), raw || {});
  }
  function getMigratedData(data) {
    return migrateObucheniePageData(data || {});
  }
  function setImageUploadState(id, src) {
    var _window$AdminHeroSlid;
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
    if ((_window$AdminHeroSlid = window.AdminHeroSlides) !== null && _window$AdminHeroSlid !== void 0 && _window$AdminHeroSlid.isHeroBgUploadId(id, 'obuchenie_hero')) {
      var match = id.match(/_bg_(\d+)$/);
      var idx = match ? parseInt(match[1], 10) : 0;
      setTimeout(function () {
        AdminHeroSlides.applySlidePreviewStyles(idx, obuchenieHeroSlidesConfig());
      }, 0);
    }
    if (id === 'obuchenie_testing_image') {
      setTimeout(function () {
        var _window$AdminObucheni, _window$AdminObucheni2;
        return (_window$AdminObucheni = window.AdminObuchenie) === null || _window$AdminObucheni === void 0 || (_window$AdminObucheni2 = _window$AdminObucheni.updateTestingLivePreview) === null || _window$AdminObucheni2 === void 0 ? void 0 : _window$AdminObucheni2.call(_window$AdminObucheni);
      }, 0);
    }
  }
  function heroBgUploadShell(id, label) {
    var sizeLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1520×420';
    return "\n      <div class=\"form-group hero-slide-upload-group\" style=\"margin-bottom:0;\">\n        <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;\">\n          <label style=\"margin-bottom:0;\">".concat(label, "</label>\n          <div class=\"hero-slide-upload-actions image-upload-mini\" data-upload-id=\"").concat(id, "\" style=\"display:flex; gap:8px;\">\n            <button type=\"button\" class=\"btn-save\" style=\"padding:6px 12px;font-size:0.8rem;\" onclick=\"AdminObuchenie.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n            <button type=\"button\" class=\"btn-delete\" style=\"padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;\" id=\"").concat(id, "_clear\" onclick=\"AdminObuchenie.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n            <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n          </div>\n        </div>\n        <div class=\"hero-slide-frame hero-slide-frame--empty\" data-upload-frame-for=\"").concat(id, "\">\n          <span class=\"hero-slide-frame__empty\">").concat(sizeLabel, "</span>\n          <img id=\"").concat(id, "_preview\" class=\"hero-slide-frame__img\" src=\"\" alt=\"\">\n        </div>\n      </div>");
  }
  function imageUploadHtml(id, label, hint) {
    return "\n      <div class=\"form-group\" style=\"margin-bottom:0;\">\n        <label>".concat(label, "</label>\n        ").concat(hint ? "<p style=\"color:var(--text-secondary);font-size:0.85rem;margin:-4px 0 8px;\">".concat(hint, "</p>") : '', "\n        <div class=\"image-upload-mini\" data-upload-id=\"").concat(id, "\">\n          <img id=\"").concat(id, "_preview\" src=\"\" alt=\"\" style=\"max-width:220px;max-height:160px;object-fit:contain;border-radius:8px;display:none;margin-bottom:8px;background:rgba(0,0,0,0.15);\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:8px 14px;font-size:0.85rem;\" onclick=\"AdminObuchenie.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n          <button type=\"button\" class=\"btn-delete\" style=\"padding:8px 14px;margin-left:8px;font-size:0.85rem;display:none;\" id=\"").concat(id, "_clear\" onclick=\"AdminObuchenie.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n          <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n        </div>\n      </div>");
  }
  function fileUploadRow(id, label, value, fileName) {
    var shownName = fileName || (value ? value.split('/').pop() : '');
    return "\n      <div class=\"form-group\" style=\"margin-bottom:0;\">\n        <label>".concat(label, "</label>\n        <div style=\"display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:8px;\">\n          <input type=\"text\" class=\"form-control\" id=\"").concat(id, "\" value=\"").concat(escapeAttr(value), "\" placeholder=\"\u0421\u0441\u044B\u043B\u043A\u0430 \u0438\u043B\u0438 uploads/files/...\" style=\"flex:1;min-width:200px;\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:10px 16px;font-size:0.92rem;border-radius:8px;\" onclick=\"AdminObuchenie.pickFile('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u0430\u0439\u043B</button>\n        </div>\n        <small id=\"").concat(id, "_name\" style=\"display:").concat(shownName ? 'inline-block' : 'none', ";color:var(--text-secondary);margin-top:8px;font-size:0.85rem;\">").concat(escapeAttr(shownName), "</small>\n      </div>");
  }
  function navIconUploadHtml(id) {
    return "\n      <div class=\"form-group consulting-comp-admin-card__icon\">\n        <label>\u0418\u043A\u043E\u043D\u043A\u0430</label>\n        <div class=\"image-upload-mini\" data-upload-id=\"".concat(id, "\">\n          <img id=\"").concat(id, "_preview\" class=\"consulting-comp-admin-card__icon-preview\" src=\"\" alt=\"\">\n          <div class=\"consulting-comp-admin-card__icon-actions\">\n            <button type=\"button\" class=\"btn-save\" onclick=\"AdminObuchenie.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n            <button type=\"button\" class=\"btn-delete consulting-comp-admin-card__icon-clear\" style=\"display:none;\" id=\"").concat(id, "_clear\" onclick=\"AdminObuchenie.clearImage('").concat(id, "')\">\xD7</button>\n          </div>\n          <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n        </div>\n      </div>");
  }
  function colorFieldHtml(id, label, value) {
    var color = /^#[0-9A-Fa-f]{6}$/.test(value || '') ? value : '#00AE4D';
    return "\n      <div class=\"form-group\">\n        <label>".concat(label, "</label>\n        <div style=\"display:flex;gap:12px;align-items:center;flex-wrap:wrap;\">\n          <input type=\"color\" id=\"").concat(id, "_picker\" value=\"").concat(escapeAttr(color), "\" style=\"width:48px;height:40px;padding:2px;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;background:transparent;\" oninput=\"AdminObuchenie.syncColorField('").concat(id, "', this.value)\">\n          <input type=\"text\" class=\"form-control\" id=\"").concat(id, "\" value=\"").concat(escapeAttr(color), "\" placeholder=\"#00AE4D\" style=\"max-width:140px;font-family:monospace;\" oninput=\"AdminObuchenie.syncColorField('").concat(id, "', this.value, true)\">\n        </div>\n      </div>");
  }
  function blockHeaderWithColorHtml(title, colorId, value) {
    var defaultColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#00AE4D';
    var fontSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    var fontWeight = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
    var italic = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
    var underline = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    var color = /^#[0-9A-Fa-f]{6}$/.test(value || '') ? value : defaultColor;
    var sizeId = colorId.replace('_color', '_size');
    var weightId = colorId.replace('_color', '_weight');
    var italicId = colorId.replace('_color', '_italic');
    var underlineId = colorId.replace('_color', '_underline');
    return "\n      <div class=\"obuchenie-block-header\" style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;\">\n        <span style=\"font-weight:600; font-size:0.95rem; color:var(--text-secondary);\">".concat(title, "</span>\n        <div style=\"display:flex; gap:8px; align-items:center; flex-wrap:wrap;\">\n          <input type=\"number\" id=\"").concat(sizeId, "\" value=\"").concat(escapeAttr(fontSize), "\" placeholder=\"px\" title=\"\u0420\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430\" style=\"width:55px; height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; text-align:center; margin-bottom:0;\">\n          <select id=\"").concat(weightId, "\" title=\"\u0422\u043E\u043B\u0449\u0438\u043D\u0430 \u0448\u0440\u0438\u0444\u0442\u0430\" style=\"height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; cursor:pointer; margin-bottom:0;\">\n            <option value=\"\" ").concat(!fontWeight ? 'selected' : '', ">\u0422\u043E\u043B\u0449\u0438\u043D\u0430</option>\n            <option value=\"300\" ").concat(fontWeight === '300' ? 'selected' : '', ">\u0422\u043E\u043D\u043A\u0438\u0439</option>\n            <option value=\"500\" ").concat(fontWeight === '500' ? 'selected' : '', ">\u0421\u0440\u0435\u0434\u043D\u0438\u0439</option>\n            <option value=\"700\" ").concat(fontWeight === '700' ? 'selected' : '', ">\u0422\u043E\u043B\u0441\u0442\u044B\u0439</option>\n          </select>\n          <label title=\"\u041A\u0443\u0440\u0441\u0438\u0432\" style=\"display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:").concat(italic ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)', "; margin-bottom:0; font-style:italic; font-weight:bold; user-select:none; font-family:serif;\">\n            <input type=\"checkbox\" id=\"").concat(italicId, "\" ").concat(italic ? 'checked' : '', " style=\"display:none;\" onchange=\"this.parentElement.style.background = this.checked ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'\">\n            I\n          </label>\n          <label title=\"\u041F\u043E\u0434\u0447\u0435\u0440\u043A\u043D\u0443\u0442\u044B\u0439\" style=\"display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:").concat(underline ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)', "; margin-bottom:0; text-decoration:underline; font-weight:bold; user-select:none; font-family:serif;\">\n            <input type=\"checkbox\" id=\"").concat(underlineId, "\" ").concat(underline ? 'checked' : '', " style=\"display:none;\" onchange=\"this.parentElement.style.background = this.checked ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'\">\n            U\n          </label>\n          <input type=\"color\" id=\"").concat(colorId, "_picker\" value=\"").concat(escapeAttr(color), "\" style=\"width:30px; height:30px; padding:0; border:none; border-radius:4px; cursor:pointer; background:transparent; margin-bottom:0;\" oninput=\"AdminObuchenie.syncColorField('").concat(colorId, "', this.value)\">\n          <input type=\"text\" class=\"form-control\" id=\"").concat(colorId, "\" value=\"").concat(escapeAttr(color), "\" placeholder=\"#00AE4D\" style=\"max-width:90px; padding:4px 8px; font-size:0.85rem; font-family:monospace; margin-bottom:0;\" oninput=\"AdminObuchenie.syncColorField('").concat(colorId, "', this.value, true)\">\n        </div>\n      </div>");
  }
  function obuchenieHeroSlidesConfig() {
    return {
      prefix: 'obuchenie_hero',
      removeHandler: 'AdminObuchenie.removeHeroSlide',
      pickHandler: 'AdminObuchenie.pickImage',
      clearHandler: 'AdminObuchenie.clearImage',
      subtitleUseBottom: true,
      previewClass: 'obuchenie-live-banner-preview',
      defaults: {
        titleColor: '#00AE4D',
        subtitleColor: '#FFFFFF',
        titleTop: 68,
        titleLeft: 60,
        subtitleBottom: 40,
        subtitleLeft: 60
      }
    };
  }
  function renderHeroAdmin(data) {
    var el = document.getElementById('obuchenieHeroAdmin');
    if (!el || !window.AdminHeroSlides) return;
    var migrated = getMigratedData(data);
    AdminHeroSlides.render(el, migrated.heroSlides || [], obuchenieHeroSlidesConfig(), setImageUploadState);
  }
  function navCardAdminHtml(prefix, card, i) {
    return "\n      <div class=\"consulting-comp-admin-card\">\n        <div class=\"consulting-comp-admin-card__head\">\n          <strong>\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 ".concat(i + 1, "</strong>\n        </div>\n        ").concat(navIconUploadHtml("".concat(prefix, "_nav_icon_").concat(i)), "\n        <div class=\"form-group consulting-comp-admin-card__text\">\n          <label>\u041D\u0430\u0434\u043F\u0438\u0441\u044C (Enter \u2014 \u043F\u0435\u0440\u0435\u043D\u043E\u0441)</label>\n          <textarea class=\"form-control\" id=\"").concat(prefix, "_nav_label_").concat(i, "\" rows=\"2\">").concat(escapeAttr(card.label), "</textarea>\n        </div>\n        <div class=\"form-group consulting-comp-admin-card__link\">\n          <label>\u0421\u0441\u044B\u043B\u043A\u0430 (\u044F\u043A\u043E\u0440\u044C \u0438\u043B\u0438 URL)</label>\n          <input type=\"text\" class=\"form-control\" id=\"").concat(prefix, "_nav_href_").concat(i, "\" value=\"").concat(escapeAttr(card.href), "\">\n        </div>\n      </div>");
  }
  function renderNavCardsAdmin(data) {
    var el = document.getElementById('obuchenieNavCardsAdmin');
    if (!el) return;
    var cards = getMigratedData(data).navCards || [];
    el.innerHTML = "<div class=\"admin-nav-cards-grid\">".concat(cards.map(function (card, i) {
      return navCardAdminHtml('obuchenie', card, i);
    }).join(''), "</div>");
    cards.forEach(function (card, i) {
      return setImageUploadState("obuchenie_nav_icon_".concat(i), card.icon);
    });
  }
  function renderCourseSearchAdmin(data) {
    var el = document.getElementById('obuchenieCourseSearchAdmin');
    if (!el) return;
    var search = getMigratedData(data).courseSearch || {};
    if (data && !data._isInternalReRender) {
      window.obuchenieSearchBlocks = Array.isArray(search.blocks) ? JSON.parse(JSON.stringify(search.blocks)) : [];
      window.obuchenieSearchTags = Array.isArray(search.tags) ? JSON.parse(JSON.stringify(search.tags)) : [];
    }
    var blocks = window.obuchenieSearchBlocks || [];
    var blocksHtml = blocks.map(function (block, bIdx) {
      var valuesHtml = Array.isArray(block.values) ? block.values.map(function (val, vIdx) {
        return "\n              <div style=\"display:flex; justify-content:space-between; align-items:center; background:var(--card-border); padding:6px 10px; border-radius:6px; margin-bottom:6px; font-size:0.9rem;\">\n                <span style=\"word-break: break-all;\">".concat(escapeAttr(val), "</span>\n                <button type=\"button\" class=\"btn-delete\" style=\"padding:2px 6px; font-size:0.8rem; min-height:auto; margin-left:8px; line-height:1;\" onclick=\"AdminObuchenie.deleteSearchBlockValue(").concat(bIdx, ", ").concat(vIdx, ")\">\xD7</button>\n              </div>");
      }).join('') : '';
      return "\n        <div class=\"search-block-card\" style=\"border: 1px solid var(--card-border); padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.02); display: flex; flex-direction: column; justify-content: space-between; min-height: 280px;\">\n          <div>\n            <div style=\"display: flex; gap: 8px; align-items: center; margin-bottom: 12px;\">\n              <input type=\"text\" class=\"form-control\" value=\"".concat(escapeAttr(block.title), "\" placeholder=\"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0441\u043F\u0438\u0441\u043A\u0430\" style=\"margin-bottom: 0; font-weight: bold; font-size: 0.95rem; padding: 6px 10px;\" oninput=\"AdminObuchenie.updateSearchBlockTitle(").concat(bIdx, ", this.value)\">\n              <button type=\"button\" class=\"btn-delete\" style=\"padding: 6px 10px; font-size: 0.85rem; min-height:auto;\" onclick=\"AdminObuchenie.deleteSearchBlock(").concat(bIdx, ")\">\n                <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"3 6 5 6 21 6\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/></svg>\n              </button>\n            </div>\n            <div class=\"search-block-values\" style=\"max-height: 180px; overflow-y: auto; margin-bottom: 12px; padding-right: 4px;\">\n              ").concat(valuesHtml, "\n            </div>\n          </div>\n          <div style=\"display: flex; gap: 6px; margin-top: auto;\">\n            <input type=\"text\" class=\"form-control\" id=\"new_val_input_").concat(bIdx, "\" placeholder=\"\u041D\u043E\u0432\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435\" style=\"margin-bottom: 0; padding: 6px 10px; font-size: 0.85rem;\" onkeydown=\"if(event.key==='Enter'){event.preventDefault(); AdminObuchenie.addSearchBlockValue(").concat(bIdx, ");}\">\n            <button type=\"button\" class=\"btn-save\" style=\"padding: 6px 12px;\" onclick=\"AdminObuchenie.addSearchBlockValue(").concat(bIdx, ")\">+</button>\n          </div>\n        </div>");
    }).join('');
    var addBlockBtn = blocks.length < 4 ? "<button type=\"button\" class=\"btn-save\" style=\"margin-top: 16px; width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; border: 1px dashed var(--accent-color); background: transparent; color: var(--accent-color); padding: 12px;\" onclick=\"AdminObuchenie.addSearchBlock()\">\n           <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"/><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"/></svg>\n           \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u043B\u043E\u043D\u043A\u0443 \u043F\u043E\u0438\u0441\u043A\u0430\n         </button>" : '';

    // Collect all unique non-empty filter values
    var allValues = [];
    blocks.forEach(function (block) {
      if (Array.isArray(block.values)) {
        block.values.forEach(function (val) {
          var trimmed = String(val || '').trim();
          if (trimmed && !allValues.includes(trimmed)) {
            allValues.push(trimmed);
          }
        });
      }
    });

    // Sync tags list to exclude deleted values
    window.obuchenieSearchTags = (window.obuchenieSearchTags || []).filter(function (t) {
      return allValues.includes(t);
    });
    var tagsHtml = '';
    if (allValues.length > 0) {
      var checkboxes = allValues.map(function (val) {
        var isChecked = window.obuchenieSearchTags.includes(val) ? 'checked' : '';
        return "\n          <label style=\"display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px; border:1px solid var(--card-border); cursor:pointer; font-size:0.9rem; user-select:none; transition: background-color 0.2s;\">\n            <input type=\"checkbox\" class=\"obuchenie-tag-checkbox\" value=\"".concat(escapeAttr(val), "\" ").concat(isChecked, " style=\"width:16px; height:16px; margin:0; cursor:pointer;\" onchange=\"AdminObuchenie.toggleTagCheckbox(this)\">\n            <span>").concat(escapeAttr(val), "</span>\n          </label>\n        ");
      }).join('');
      tagsHtml = "\n        <div style=\"margin-top:24px; border-top:1px solid var(--card-border); padding-top:20px;\">\n          <label style=\"font-weight:600; display:block; margin-bottom:12px; font-size:0.95rem; color:var(--text-secondary);\">\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u043C\u044B\u0435 \u0442\u0435\u0433\u0438 \u043F\u043E\u0434 \u043F\u043E\u0438\u0441\u043A\u043E\u043C (\u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u0438\u0437 \u0441\u043F\u0440\u0430\u0432\u043E\u0447\u043D\u0438\u043A\u043E\u0432):</label>\n          <div style=\"display:flex; flex-wrap:wrap; gap:10px;\">\n            ".concat(checkboxes, "\n          </div>\n        </div>\n      ");
    }
    el.innerHTML = "\n      <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;\">\n        ".concat(blocksHtml, "\n      </div>\n      ").concat(addBlockBtn, "\n      ").concat(tagsHtml);
  }
  function getRegistryApi() {
    return window.ObuchenieContent || {};
  }
  function renderCalendarAdmin(data) {
    var el = document.getElementById('obuchenieCalendarAdmin');
    if (!el) return;
    var migrated = getMigratedData(data);
    var calendar = migrated.calendar || {};
    el.innerHTML = "\n      <div class=\"obuchenie-hero-grid\">\n        <!-- Left: Promo Image -->\n        <div class=\"obuchenie-hero-banner-col\" style=\"margin-bottom:0;\">\n          ".concat(imageUploadHtml('obuchenie_cal_promo_image', 'Изображение промо-блока', 'Рекомендуемый размер ~1200×1760 px'), "\n        </div>\n        \n        <!-- Right: Fields -->\n        <div class=\"obuchenie-hero-fields-col\" style=\"display:flex; flex-direction:column; gap:20px;\">\n          <div style=\"display:grid; grid-template-columns: 1fr 160px; gap:16px; align-items:start;\">\n            <div class=\"form-group\" style=\"margin-bottom:0;\">\n              <label>\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043F\u0440\u043E\u043C\u043E-\u0431\u043B\u043E\u043A\u0430 (Enter \u2014 \u043F\u0435\u0440\u0435\u043D\u043E\u0441 \u0441\u0442\u0440\u043E\u043A\u0438)</label>\n              <textarea class=\"form-control\" id=\"obuchenie_cal_promo_title\" rows=\"2\" style=\"height: 80px; resize: vertical; margin-top:8px;\">").concat(escapeAttr(calendar.promoTitle), "</textarea>\n            </div>\n            <div class=\"form-group\" style=\"margin-bottom:0;\">\n              <label>\u0426\u0432\u0435\u0442 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430</label>\n              <div style=\"display:flex; gap:8px; align-items:center; height:44px; margin-top:8px;\">\n                <input type=\"color\" id=\"obuchenie_cal_promo_title_color_picker\" value=\"").concat(escapeAttr(calendar.promoTitleColor || '#FFFFFF'), "\" style=\"width:38px; height:38px; padding:0; border:1px solid rgba(255,255,255,0.15); border-radius:8px; cursor:pointer; background:transparent;\" oninput=\"AdminObuchenie.syncColorField('obuchenie_cal_promo_title_color', this.value)\">\n                <input type=\"text\" class=\"form-control\" id=\"obuchenie_cal_promo_title_color\" value=\"").concat(escapeAttr(calendar.promoTitleColor || '#FFFFFF'), "\" placeholder=\"#FFFFFF\" style=\"width:90px; padding:6px 10px; font-family:monospace; font-size:0.85rem; margin-bottom:0;\" oninput=\"AdminObuchenie.syncColorField('obuchenie_cal_promo_title_color', this.value, true)\">\n              </div>\n            </div>\n          </div>\n          <div class=\"form-group\" style=\"margin-bottom:0;\">\n            <label>\u0421\u0441\u044B\u043B\u043A\u0430 \u043F\u0440\u043E\u043C\u043E-\u0431\u043B\u043E\u043A\u0430 (\u0434\u043B\u044F \u043A\u043B\u0438\u043A\u0430\u0431\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u0438 \u0431\u0430\u043D\u043D\u0435\u0440\u0430)</label>\n            <input type=\"text\" class=\"form-control\" id=\"obuchenie_cal_promo_link\" value=\"").concat(escapeAttr(calendar.promoLink || ''), "\" placeholder=\"https://example.com \u0438\u043B\u0438 #anchor\" style=\"margin-top:8px;\">\n          </div>\n          ").concat(fileUploadRow('obuchenie_cal_all_link', 'Файл «Все курсы» (PDF/Doc/Zip)', calendar.allCoursesLink || '', calendar.allCoursesFileName || ''), "\n        </div>\n      </div>");
    setImageUploadState('obuchenie_cal_promo_image', calendar.promoImage);
  }
  function courseCardHtml(item, i) {
    return "\n      <div class=\"admin-subcard\" style=\"margin-bottom:16px;padding:16px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;\">\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;\">\n          <strong>\u041A\u0443\u0440\u0441 ".concat(i + 1, "</strong>\n          <button type=\"button\" class=\"btn-delete\" style=\"padding:6px 12px;font-size:0.8rem;\" onclick=\"AdminObuchenie.removeCourseCard(").concat(i, ")\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n        </div>\n        <div class=\"form-group\">\n          <label>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</label>\n          <input type=\"text\" class=\"form-control\" id=\"obuchenie_course_title_").concat(i, "\" value=\"").concat(escapeAttr(item.title), "\">\n        </div>\n        <div class=\"form-group\">\n          <label>\u0426\u0435\u043D\u0430</label>\n          <input type=\"text\" class=\"form-control\" id=\"obuchenie_course_price_").concat(i, "\" value=\"").concat(escapeAttr(item.price), "\">\n        </div>\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;\">\n          <div class=\"form-group\" style=\"margin:0;\">\n            <label>\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C (\u0447\u0438\u0441\u043B\u043E)</label>\n            <input type=\"text\" class=\"form-control\" id=\"obuchenie_course_duration_num_").concat(i, "\" value=\"").concat(escapeAttr(item.durationNum), "\">\n          </div>\n          <div class=\"form-group\" style=\"margin:0;\">\n            <label>\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C (\u0435\u0434\u0438\u043D\u0438\u0446\u0430)</label>\n            <input type=\"text\" class=\"form-control\" id=\"obuchenie_course_duration_unit_").concat(i, "\" value=\"").concat(escapeAttr(item.durationUnit), "\">\n          </div>\n          <div class=\"form-group\" style=\"margin:0;\">\n            <label>\u0413\u0440\u0430\u0444\u0438\u043A (\u0447\u0438\u0441\u043B\u043E)</label>\n            <input type=\"text\" class=\"form-control\" id=\"obuchenie_course_schedule_num_").concat(i, "\" value=\"").concat(escapeAttr(item.scheduleNum), "\">\n          </div>\n          <div class=\"form-group\" style=\"margin:0;\">\n            <label>\u0413\u0440\u0430\u0444\u0438\u043A (\u0435\u0434\u0438\u043D\u0438\u0446\u0430)</label>\n            <input type=\"text\" class=\"form-control\" id=\"obuchenie_course_schedule_unit_").concat(i, "\" value=\"").concat(escapeAttr(item.scheduleUnit), "\">\n          </div>\n        </div>\n        <div class=\"form-group\" style=\"margin-top:12px;\">\n          <label>\u0422\u0435\u043A\u0441\u0442 \u043A\u043D\u043E\u043F\u043A\u0438</label>\n          <input type=\"text\" class=\"form-control\" id=\"obuchenie_course_btn_text_").concat(i, "\" value=\"").concat(escapeAttr(item.btnText), "\">\n        </div>\n        <div class=\"form-group\">\n          <label>\u0421\u0441\u044B\u043B\u043A\u0430 \u043A\u043D\u043E\u043F\u043A\u0438</label>\n          <input type=\"text\" class=\"form-control\" id=\"obuchenie_course_btn_link_").concat(i, "\" value=\"").concat(escapeAttr(item.btnLink), "\">\n        </div>\n        <div class=\"form-group\">\n          <label>\u0421\u0441\u044B\u043B\u043A\u0430 \xAB\u043F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435\xBB</label>\n          <input type=\"text\" class=\"form-control\" id=\"obuchenie_course_more_link_").concat(i, "\" value=\"").concat(escapeAttr(item.moreLink), "\">\n        </div>\n      </div>");
  }
  function renderCourseCardsAdmin(data) {
    var el = document.getElementById('obuchenieCourseCardsAdmin');
    if (!el) return;
    var cards = getMigratedData(data).courseCards || [];
    el.innerHTML = cards.map(function (item, i) {
      return courseCardHtml(item, i);
    }).join('');
  }
  function renderTestingAdmin(data) {
    var el = document.getElementById('obuchenieTestingAdmin');
    if (!el) return;
    var banner = getMigratedData(data).testingBanner || {};
    el.innerHTML = "\n      <div class=\"obuchenie-hero-grid\">\n        <!-- Left: Banner upload & Preview -->\n        <div class=\"obuchenie-hero-banner-col\">\n          ".concat(heroBgUploadShell('obuchenie_testing_image', 'Фоновое изображение баннера (~1520×435 px)'), "\n          \n          <div style=\"margin-top:20px;\">\n            <label style=\"font-weight:600; display:block; margin-bottom:8px; font-size:0.9rem; color:var(--text-secondary);\">\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0433\u043E\u0442\u043E\u0432\u043E\u0433\u043E \u0431\u0430\u043D\u043D\u0435\u0440\u0430 \u0441 \u043D\u0430\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u043C \u0442\u0435\u043A\u0441\u0442\u043E\u043C</label>\n            <div class=\"ecp-live-banner-preview\" id=\"obuchenie_testing_live_preview\" style=\"height:120px; position:relative; background-size:cover; background-position:center; border-radius:12px; overflow:hidden;\">\n              <div class=\"live-banner-title\" id=\"obuchenie_testing_live_title\" style=\"top:25%; left:60px; position:absolute; font-size:16px;\">").concat(escapeAttr(banner.title), "</div>\n              <div class=\"hero-btn\" id=\"obuchenie_testing_live_btn\" style=\"position:absolute; bottom:20%; left:60px; padding:6px 14px; background:#fff; color:#000; border-radius:8px; font-size:11px; pointer-events:none;\">").concat(escapeAttr(banner.btnText || 'Пройти тест'), "</div>\n            </div>\n          </div>\n        </div>\n        \n        <!-- Right: Fields -->\n        <div class=\"obuchenie-hero-fields-col\" style=\"display:flex; flex-direction:column; gap:20px;\">\n          <!-- Block \"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A\" -->\n          <div class=\"obuchenie-hero-block\" style=\"border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);\">\n            ").concat(blockHeaderWithColorHtml('Заголовок (Enter — перенос строки)', 'obuchenie_testing_title_color', banner.titleColor || '#ffffff', '#ffffff', banner.titleFontSize, banner.titleFontWeight, banner.titleItalic, banner.titleUnderline), "\n            <div class=\"form-group\" style=\"margin-bottom:0; margin-top:8px;\">\n              <textarea class=\"form-control\" id=\"obuchenie_testing_title\" rows=\"2\" placeholder=\"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0431\u0430\u043D\u043D\u0435\u0440\u0430 (Enter \u2014 \u043F\u0435\u0440\u0435\u043D\u043E\u0441 \u0441\u0442\u0440\u043E\u043A\u0438)\" oninput=\"AdminObuchenie.updateTestingLivePreview()\">").concat(escapeAttr(banner.title), "</textarea>\n            </div>\n            <div style=\"display:flex; gap:16px; margin-top:12px;\">\n              <div style=\"flex:1; margin-bottom:0;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u0432\u0435\u0440\u0445\u0443 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"obuchenie_testing_title_top\" value=\"").concat(banner.titleTop !== undefined ? banner.titleTop : 68, "\" style=\"padding:6px 10px; font-size:0.85rem; margin-bottom:0;\" oninput=\"AdminObuchenie.updateTestingLivePreview()\">\n              </div>\n              <div style=\"flex:1; margin-bottom:0;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"obuchenie_testing_title_left\" value=\"").concat(banner.titleLeft !== undefined ? banner.titleLeft : 60, "\" style=\"padding:6px 10px; font-size:0.85rem; margin-bottom:0;\" oninput=\"AdminObuchenie.updateTestingLivePreview()\">\n              </div>\n            </div>\n          </div>\n          \n          <!-- Block \"\u041A\u043D\u043E\u043F\u043A\u0430\" -->\n          <div class=\"obuchenie-hero-block\" style=\"border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);\">\n            <div style=\"font-weight:600; font-size:0.95rem; margin-bottom:12px;\">\u041A\u043D\u043E\u043F\u043A\u0430</div>\n            <div class=\"form-group\" style=\"margin-bottom:12px;\">\n              <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u0422\u0435\u043A\u0441\u0442 \u043A\u043D\u043E\u043F\u043A\u0438</label>\n              <input type=\"text\" class=\"form-control\" id=\"obuchenie_testing_btn_text\" value=\"").concat(escapeAttr(banner.btnText), "\" placeholder=\"\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u041F\u0440\u043E\u0439\u0442\u0438 \u0442\u0435\u0441\u0442\" oninput=\"AdminObuchenie.updateTestingLivePreview()\">\n            </div>\n            <div class=\"form-group\" style=\"margin-bottom:12px;\">\n              <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u0421\u0441\u044B\u043B\u043A\u0430 \u043A\u043D\u043E\u043F\u043A\u0438</label>\n              <input type=\"text\" class=\"form-control\" id=\"obuchenie_testing_btn_link\" value=\"").concat(escapeAttr(banner.btnLink), "\" placeholder=\"URL \u0438\u043B\u0438 #anchor\">\n            </div>\n            <div style=\"display:flex; gap:16px;\">\n              <div style=\"flex:1; margin-bottom:0;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043D\u0438\u0437\u0443 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"obuchenie_testing_btn_bottom\" value=\"").concat(banner.btnBottom !== undefined ? banner.btnBottom : 65, "\" style=\"padding:6px 10px; font-size:0.85rem; margin-bottom:0;\" oninput=\"AdminObuchenie.updateTestingLivePreview()\">\n              </div>\n              <div style=\"flex:1; margin-bottom:0;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"obuchenie_testing_btn_left\" value=\"").concat(banner.btnLeft !== undefined ? banner.btnLeft : 60, "\" style=\"padding:6px 10px; font-size:0.85rem; margin-bottom:0;\" oninput=\"AdminObuchenie.updateTestingLivePreview()\">\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    ");
    setImageUploadState('obuchenie_testing_image', banner.image);
    setTimeout(function () {
      AdminObuchenie.updateTestingLivePreview();
      ['title_size', 'title_weight', 'title_italic', 'title_underline'].forEach(function (prop) {
        var el = document.getElementById("obuchenie_testing_".concat(prop));
        if (el) {
          el.addEventListener('input', function () {
            return AdminObuchenie.updateTestingLivePreview();
          });
          el.addEventListener('change', function () {
            return AdminObuchenie.updateTestingLivePreview();
          });
        }
      });
    }, 50);
  }
  function renderObucheniePageAdmin(data) {
    var migrated = getMigratedData(data);

    // МИГРАЦИЯ: если нет вопросов, но есть window.TEST_QUESTIONS, загружаем их
    if ((!migrated.quizQuestions || migrated.quizQuestions.length === 0) && window.TEST_QUESTIONS && window.TEST_QUESTIONS.length > 0) {
      var CORRECT_ANSWERS = {
        1: 'А',
        2: 'В',
        3: 'Г',
        4: 'В',
        5: 'А',
        6: 'Д',
        7: 'Д',
        8: 'В',
        9: 'А',
        10: 'Г',
        11: 'Г',
        12: 'Г',
        13: 'Б',
        14: 'Б',
        15: 'Б',
        16: 'А',
        17: 'А',
        18: 'А',
        19: 'А',
        20: 'В',
        21: 'А',
        22: 'А',
        23: 'Б',
        24: 'Г',
        25: 'Б',
        26: 'Г',
        27: 'В',
        28: 'Г',
        29: 'А',
        30: 'В',
        31: 'Е',
        32: 'Б',
        33: 'Г',
        34: 'Г',
        35: 'Б',
        36: 'В',
        37: 'Г',
        38: 'Г',
        39: 'Е',
        40: 'Д',
        41: 'А',
        42: 'А',
        43: 'А',
        44: 'А',
        45: 'А',
        46: 'В',
        47: 'В',
        48: 'Г',
        49: 'А',
        50: 'Б',
        51: 'А',
        52: 'А',
        53: 'А',
        54: 'А',
        55: 'А',
        56: 'А',
        57: 'А',
        58: 'А',
        59: 'А',
        60: 'А',
        61: 'А',
        62: 'А',
        63: 'А',
        64: 'А',
        65: 'А',
        66: 'А',
        67: 'А',
        68: 'А',
        69: 'А',
        70: 'А',
        71: 'А',
        72: 'А',
        73: 'А',
        74: 'А',
        75: 'А',
        76: 'А',
        77: 'А',
        78: 'А',
        79: 'А',
        80: 'А',
        81: 'А',
        82: 'А',
        83: 'А',
        84: 'А',
        85: 'А',
        86: 'А',
        87: 'А',
        88: 'А',
        89: 'А',
        90: 'А',
        91: 'А',
        92: 'А',
        93: 'А',
        94: 'А',
        95: 'А',
        96: 'А',
        97: 'А',
        98: 'А',
        99: 'А',
        100: 'А'
      };
      migrated.quizQuestions = window.TEST_QUESTIONS.map(function (q) {
        return {
          id: q.id,
          text: q.text,
          options: q.options || [],
          correctAnswer: CORRECT_ANSWERS[q.id] || 'А'
        };
      });
    }
    renderHeroAdmin(migrated);
    renderNavCardsAdmin(migrated);
    renderCourseSearchAdmin(migrated);
    renderCalendarAdmin(migrated);
    renderTestingAdmin(migrated);
  }
  function readImageVal(id) {
    var _document$getElementB;
    return ((_document$getElementB = document.getElementById("".concat(id, "_val"))) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value) || '';
  }
  function readColorVal(id, fallback) {
    var _document$getElementB2;
    var raw = ((_document$getElementB2 = document.getElementById(id)) === null || _document$getElementB2 === void 0 || (_document$getElementB2 = _document$getElementB2.value) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.trim()) || '';
    if (/^#[0-9A-Fa-f]{6}$/.test(raw)) return raw.toUpperCase();
    if (/^[0-9A-Fa-f]{6}$/.test(raw)) return "#".concat(raw.toUpperCase());
    return fallback;
  }
  function previewMultilineHtml(text) {
    return String(text !== null && text !== void 0 ? text : '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  }
  function syncColorField(id, value, fromText) {
    var textEl = document.getElementById(id);
    var pickerEl = document.getElementById("".concat(id, "_picker"));
    if (!textEl || !pickerEl) return;
    var normalized = String(value || '').trim();
    if (/^[0-9A-Fa-f]{6}$/.test(normalized)) normalized = "#".concat(normalized);
    if (!/^#[0-9A-Fa-f]{6}$/.test(normalized)) {
      if (fromText) return;
      normalized = '#000000';
    }
    textEl.value = normalized.toUpperCase();
    pickerEl.value = normalized.toLowerCase();
    setTimeout(function () {
      var _window$AdminHeroSlid2;
      if (String(id).startsWith('obuchenie_testing_')) {
        var _window$AdminObucheni3, _window$AdminObucheni4;
        (_window$AdminObucheni3 = window.AdminObuchenie) === null || _window$AdminObucheni3 === void 0 || (_window$AdminObucheni4 = _window$AdminObucheni3.updateTestingLivePreview) === null || _window$AdminObucheni4 === void 0 || _window$AdminObucheni4.call(_window$AdminObucheni3);
      } else if ((_window$AdminHeroSlid2 = window.AdminHeroSlides) !== null && _window$AdminHeroSlid2 !== void 0 && _window$AdminHeroSlid2.isHeroBgUploadId(id, 'obuchenie_hero')) {
        var match = id.match(/_bg_(\d+)$/);
        var idx = match ? parseInt(match[1], 10) : 0;
        AdminHeroSlides.applySlidePreviewStyles(idx, obuchenieHeroSlidesConfig());
      }
    }, 0);
  }
  function collectCourseDaysFromForm(courseRegistry) {
    var _api$deriveCourseDays;
    var api = getRegistryApi();
    return ((_api$deriveCourseDays = api.deriveCourseDaysByMonth) === null || _api$deriveCourseDays === void 0 ? void 0 : _api$deriveCourseDays.call(api, courseRegistry || [])) || {};
  }
  function collectObucheniePageFromForm(existing) {
    var _data$hero, _data$courseSearch, _data$courseSearch2, _data$courseSearch3, _data$courseSearch4, _data$courseSearch5, _data$courseSearch6, _data$courseSearch7, _window$obucheniePage, _ref, _document$getElementB5, _document$getElementB6, _data$calendar, _data$calendar2, _data$calendar3, _ref2, _document$getElementB7, _document$getElementB8, _data$calendar4, _document$getElementB9, _ref3, _document$getElementB0, _document$getElementB1, _data$testingBanner, _data$testingBanner2, _document$getElementB10, _document$getElementB11, _document$getElementB12, _document$getElementB13, _document$getElementB14, _document$getElementB15, _ref4, _document$getElementB16, _document$getElementB17, _data$testingBanner3, _ref5, _document$getElementB18, _document$getElementB19, _data$testingBanner4, _document$getElementB20, _document$getElementB21, _data$testingBanner5;
    var data = getMigratedData(existing || window.obucheniePageData || {});
    data.heroSlides = window.AdminHeroSlides ? AdminHeroSlides.collect('obuchenie_hero', {
      subtitleUseBottom: true
    }) : [];
    var firstSlide = data.heroSlides[0] || {};
    data.hero = _objectSpread(_objectSpread({}, firstSlide), {}, {
      gavelImage: readImageVal('obuchenie_hero_gavel') || ((_data$hero = data.hero) === null || _data$hero === void 0 ? void 0 : _data$hero.gavelImage) || ''
    });
    data.navCards = [];
    var navCount = document.querySelectorAll('[id^="obuchenie_nav_label_"]').length;
    for (var i = 0; i < navCount; i++) {
      var _document$getElementB3, _document$getElementB4, _data$navCards;
      data.navCards.push({
        label: ((_document$getElementB3 = document.getElementById("obuchenie_nav_label_".concat(i))) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.value) || '',
        href: ((_document$getElementB4 = document.getElementById("obuchenie_nav_href_".concat(i))) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value) || '#',
        icon: readImageVal("obuchenie_nav_icon_".concat(i)) || ((_data$navCards = data.navCards) === null || _data$navCards === void 0 || (_data$navCards = _data$navCards[i]) === null || _data$navCards === void 0 ? void 0 : _data$navCards.icon) || ''
      });
    }
    data.courseSearch = {
      title: ((_data$courseSearch = data.courseSearch) === null || _data$courseSearch === void 0 ? void 0 : _data$courseSearch.title) || 'Поиск курсов',
      cta: ((_data$courseSearch2 = data.courseSearch) === null || _data$courseSearch2 === void 0 ? void 0 : _data$courseSearch2.cta) || 'Оставьте заявку, мы поможем',
      phone: ((_data$courseSearch3 = data.courseSearch) === null || _data$courseSearch3 === void 0 ? void 0 : _data$courseSearch3.phone) || '88001017892',
      phoneDisplay: ((_data$courseSearch4 = data.courseSearch) === null || _data$courseSearch4 === void 0 ? void 0 : _data$courseSearch4.phoneDisplay) || '8 800 101-78-92',
      tags: window.obuchenieSearchTags || ((_data$courseSearch5 = data.courseSearch) === null || _data$courseSearch5 === void 0 ? void 0 : _data$courseSearch5.tags) || [],
      showAllLabel: ((_data$courseSearch6 = data.courseSearch) === null || _data$courseSearch6 === void 0 ? void 0 : _data$courseSearch6.showAllLabel) || 'Показать все',
      blocks: window.obuchenieSearchBlocks || ((_data$courseSearch7 = data.courseSearch) === null || _data$courseSearch7 === void 0 ? void 0 : _data$courseSearch7.blocks) || []
    };
    data.courseRegistry = ((_window$obucheniePage = window.obucheniePageData) === null || _window$obucheniePage === void 0 ? void 0 : _window$obucheniePage.courseRegistry) || data.courseRegistry || [];
    data.calendar = {
      promoTitle: (_ref = (_document$getElementB5 = (_document$getElementB6 = document.getElementById('obuchenie_cal_promo_title')) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.value) !== null && _document$getElementB5 !== void 0 ? _document$getElementB5 : (_data$calendar = data.calendar) === null || _data$calendar === void 0 ? void 0 : _data$calendar.promoTitle) !== null && _ref !== void 0 ? _ref : '',
      promoTitleColor: readColorVal('obuchenie_cal_promo_title_color', ((_data$calendar2 = data.calendar) === null || _data$calendar2 === void 0 ? void 0 : _data$calendar2.promoTitleColor) || '#FFFFFF'),
      promoImage: readImageVal('obuchenie_cal_promo_image') || ((_data$calendar3 = data.calendar) === null || _data$calendar3 === void 0 ? void 0 : _data$calendar3.promoImage) || '',
      promoLink: document.getElementById('obuchenie_cal_promo_link') ? document.getElementById('obuchenie_cal_promo_link').value.trim() : (data.calendar.promoLink || ''),
      allCoursesLink: (_ref2 = (_document$getElementB7 = (_document$getElementB8 = document.getElementById('obuchenie_cal_all_link')) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.value) !== null && _document$getElementB7 !== void 0 ? _document$getElementB7 : (_data$calendar4 = data.calendar) === null || _data$calendar4 === void 0 ? void 0 : _data$calendar4.allCoursesLink) !== null && _ref2 !== void 0 ? _ref2 : '',
      allCoursesFileName: ((_document$getElementB9 = document.getElementById('obuchenie_cal_all_link_name')) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.textContent) || '',
      courseDaysByMonth: collectCourseDaysFromForm(data.courseRegistry)
    };
    data.courseCards = [];
    data.testingBanner = {
      title: (_ref3 = (_document$getElementB0 = (_document$getElementB1 = document.getElementById('obuchenie_testing_title')) === null || _document$getElementB1 === void 0 ? void 0 : _document$getElementB1.value) !== null && _document$getElementB0 !== void 0 ? _document$getElementB0 : (_data$testingBanner = data.testingBanner) === null || _data$testingBanner === void 0 ? void 0 : _data$testingBanner.title) !== null && _ref3 !== void 0 ? _ref3 : '',
      titleColor: readColorVal('obuchenie_testing_title_color', ((_data$testingBanner2 = data.testingBanner) === null || _data$testingBanner2 === void 0 ? void 0 : _data$testingBanner2.titleColor) || '#FFFFFF'),
      titleTop: parseFloat((_document$getElementB10 = document.getElementById('obuchenie_testing_title_top')) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.value) || 68,
      titleLeft: parseFloat((_document$getElementB11 = document.getElementById('obuchenie_testing_title_left')) === null || _document$getElementB11 === void 0 ? void 0 : _document$getElementB11.value) || 60,
      titleFontSize: ((_document$getElementB12 = document.getElementById('obuchenie_testing_title_size')) === null || _document$getElementB12 === void 0 ? void 0 : _document$getElementB12.value) || '',
      titleFontWeight: ((_document$getElementB13 = document.getElementById('obuchenie_testing_title_weight')) === null || _document$getElementB13 === void 0 ? void 0 : _document$getElementB13.value) || '',
      titleItalic: ((_document$getElementB14 = document.getElementById('obuchenie_testing_title_italic')) === null || _document$getElementB14 === void 0 ? void 0 : _document$getElementB14.checked) || false,
      titleUnderline: ((_document$getElementB15 = document.getElementById('obuchenie_testing_title_underline')) === null || _document$getElementB15 === void 0 ? void 0 : _document$getElementB15.checked) || false,
      btnText: (_ref4 = (_document$getElementB16 = (_document$getElementB17 = document.getElementById('obuchenie_testing_btn_text')) === null || _document$getElementB17 === void 0 ? void 0 : _document$getElementB17.value) !== null && _document$getElementB16 !== void 0 ? _document$getElementB16 : (_data$testingBanner3 = data.testingBanner) === null || _data$testingBanner3 === void 0 ? void 0 : _data$testingBanner3.btnText) !== null && _ref4 !== void 0 ? _ref4 : '',
      btnLink: (_ref5 = (_document$getElementB18 = (_document$getElementB19 = document.getElementById('obuchenie_testing_btn_link')) === null || _document$getElementB19 === void 0 ? void 0 : _document$getElementB19.value) !== null && _document$getElementB18 !== void 0 ? _document$getElementB18 : (_data$testingBanner4 = data.testingBanner) === null || _data$testingBanner4 === void 0 ? void 0 : _data$testingBanner4.btnLink) !== null && _ref5 !== void 0 ? _ref5 : '#contacts',
      btnBottom: parseFloat((_document$getElementB20 = document.getElementById('obuchenie_testing_btn_bottom')) === null || _document$getElementB20 === void 0 ? void 0 : _document$getElementB20.value) || 65,
      btnLeft: parseFloat((_document$getElementB21 = document.getElementById('obuchenie_testing_btn_left')) === null || _document$getElementB21 === void 0 ? void 0 : _document$getElementB21.value) || 60,
      image: readImageVal('obuchenie_testing_image') || ((_data$testingBanner5 = data.testingBanner) === null || _data$testingBanner5 === void 0 ? void 0 : _data$testingBanner5.image) || ''
    };
    data.quizQuestions = [];
    var qCount = document.querySelectorAll('[id^="obuchenie_q_text_"]').length;
    for (var _i = 0; _i < qCount; _i++) {
      var _document$getElementB22;
      var qText = ((_document$getElementB22 = document.getElementById("obuchenie_q_text_".concat(_i))) === null || _document$getElementB22 === void 0 ? void 0 : _document$getElementB22.value) || '';
      var correctRadio = document.querySelector("input[name=\"obuchenie_q_correct_".concat(_i, "\"]:checked"));
      var correctAnswer = correctRadio ? correctRadio.value : 'А';
      var options = [];
      var optIdx = 0;
      while (document.getElementById("obuchenie_q_opt_letter_".concat(_i, "_").concat(optIdx))) {
        options.push({
          letter: document.getElementById("obuchenie_q_opt_letter_".concat(_i, "_").concat(optIdx)).value,
          text: document.getElementById("obuchenie_q_opt_text_".concat(_i, "_").concat(optIdx)).value
        });
        optIdx++;
      }
      data.quizQuestions.push({
        id: _i + 1,
        // Re-assign sequential IDs
        text: qText,
        options: options,
        correctAnswer: correctAnswer
      });
    }
    return data;
  }
  function pickImage(uploadId) {
    var imageInput = document.getElementById('imageInput');
    if (imageInput) imageInput.value = '';
    window.cropTarget = {
      uploadId: uploadId,
      aspect: AdminObuchenie.getAspect(uploadId)
    };
    window.activeAuthorIndex = null;
    window.activeFeatureCardIndex = undefined;
    window.activeAboutImage = false;
    imageInput === null || imageInput === void 0 || imageInput.click();
  }
  function clearImage(uploadId) {
    setImageUploadState(uploadId, '');
  }
  function applyCroppedImage(uploadId, dataUrl) {
    if (uploadId && uploadId.startsWith('obuchenie_')) {
      setImageUploadState(uploadId, dataUrl);
    }
  }
  function getAspect(uploadId) {
    if (uploadId === 'obuchenie_hero_bg' || uploadId !== null && uploadId !== void 0 && uploadId.startsWith('obuchenie_hero_bg_')) return 1520 / 420;
    if (uploadId === 'obuchenie_hero_gavel') return 1;
    if (uploadId === 'obuchenie_cal_promo_image') return 596 / 881;
    if (uploadId === 'obuchenie_testing_image') return 1520 / 435;
    if (uploadId.startsWith('obuchenie_nav_icon_')) return 118 / 149;
    return 16 / 9;
  }
  function getCropSize(uploadId) {
    if (uploadId === 'obuchenie_hero_bg' || uploadId !== null && uploadId !== void 0 && uploadId.startsWith('obuchenie_hero_bg_')) return [1520, 420];
    if (uploadId === 'obuchenie_hero_gavel') return [420, 420];
    if (uploadId === 'obuchenie_cal_promo_image') return [800, 1183];
    if (uploadId === 'obuchenie_testing_image') return [3040, 870];
    if (uploadId.startsWith('obuchenie_nav_icon_')) return [118, 149];
    return [1200, 675];
  }
  function isObuchenieUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('obuchenie_'));
  }
  window.AdminObuchenie = {
    DEFAULT_OBUCHENIE_PAGE: DEFAULT_OBUCHENIE_PAGE,
    migrateObucheniePageData: migrateObucheniePageData,
    renderObucheniePageAdmin: renderObucheniePageAdmin,
    collectObucheniePageFromForm: collectObucheniePageFromForm,
    clearImage: clearImage,
    updateSearchBlockTitle: function updateSearchBlockTitle(bIdx, value) {
      if (window.obuchenieSearchBlocks && window.obuchenieSearchBlocks[bIdx]) {
        window.obuchenieSearchBlocks[bIdx].title = value;
      }
    },
    deleteSearchBlock: function deleteSearchBlock(bIdx) {
      if (window.obuchenieSearchBlocks) {
        window.obuchenieSearchBlocks.splice(bIdx, 1);
        AdminObuchenie.renderCourseSearchAdmin({
          courseSearch: {
            blocks: window.obuchenieSearchBlocks,
            tags: window.obuchenieSearchTags
          },
          _isInternalReRender: true
        });
      }
    },
    addHeroSlide: function addHeroSlide() {
      var _window$saveObuchenie, _window;
      (_window$saveObuchenie = (_window = window).saveObucheniePageStateToMemory) === null || _window$saveObuchenie === void 0 || _window$saveObuchenie.call(_window);
      var page = window.obucheniePageData || {};
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
      renderObucheniePageAdmin(page);
    },
    removeHeroSlide: function removeHeroSlide(i) {
      var _window$saveObuchenie2, _window2, _page$heroSlides;
      (_window$saveObuchenie2 = (_window2 = window).saveObucheniePageStateToMemory) === null || _window$saveObuchenie2 === void 0 || _window$saveObuchenie2.call(_window2);
      var page = window.obucheniePageData || {};
      if (!((_page$heroSlides = page.heroSlides) !== null && _page$heroSlides !== void 0 && _page$heroSlides.length)) return;
      page.heroSlides.splice(i, 1);
      if (!page.heroSlides.length) page.heroSlides.push({
        title: '',
        subtitle: '',
        background: ''
      });
      renderObucheniePageAdmin(page);
    },
    addSearchBlock: function addSearchBlock() {
      if (window.obuchenieSearchBlocks && window.obuchenieSearchBlocks.length < 4) {
        window.obuchenieSearchBlocks.push({
          id: 'block_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          title: 'Новый фильтр',
          values: []
        });
        AdminObuchenie.renderCourseSearchAdmin({
          courseSearch: {
            blocks: window.obuchenieSearchBlocks,
            tags: window.obuchenieSearchTags
          },
          _isInternalReRender: true
        });
      }
    },
    deleteSearchBlockValue: function deleteSearchBlockValue(bIdx, vIdx) {
      if (window.obuchenieSearchBlocks && window.obuchenieSearchBlocks[bIdx]) {
        window.obuchenieSearchBlocks[bIdx].values.splice(vIdx, 1);
        AdminObuchenie.renderCourseSearchAdmin({
          courseSearch: {
            blocks: window.obuchenieSearchBlocks,
            tags: window.obuchenieSearchTags
          },
          _isInternalReRender: true
        });
      }
    },
    addSearchBlockValue: function addSearchBlockValue(bIdx) {
      var input = document.getElementById("new_val_input_".concat(bIdx));
      var val = input ? input.value.trim() : '';
      if (val && window.obuchenieSearchBlocks && window.obuchenieSearchBlocks[bIdx]) {
        if (!window.obuchenieSearchBlocks[bIdx].values.includes(val)) {
          window.obuchenieSearchBlocks[bIdx].values.push(val);
        }
        AdminObuchenie.renderCourseSearchAdmin({
          courseSearch: {
            blocks: window.obuchenieSearchBlocks,
            tags: window.obuchenieSearchTags
          },
          _isInternalReRender: true
        });
      }
    },
    toggleTagCheckbox: function toggleTagCheckbox(input) {
      var val = input.value;
      if (!window.obuchenieSearchTags) {
        window.obuchenieSearchTags = [];
      }
      if (input.checked) {
        if (!window.obuchenieSearchTags.includes(val)) {
          window.obuchenieSearchTags.push(val);
        }
      } else {
        var idx = window.obuchenieSearchTags.indexOf(val);
        if (idx !== -1) {
          window.obuchenieSearchTags.splice(idx, 1);
        }
      }
    },
    pickFile: function pickFile(inputId) {
      var _document$getElementB23;
      window.fileUploadTarget = inputId;
      (_document$getElementB23 = document.getElementById('docFileInput')) === null || _document$getElementB23 === void 0 || _document$getElementB23.click();
    },
    setFileUploadState: function setFileUploadState(inputId, url, name) {
      var input = document.getElementById(inputId);
      if (input) {
        input.value = url;
      }
      var nameEl = document.getElementById("".concat(inputId, "_name"));
      if (nameEl) {
        nameEl.textContent = name || url.split('/').pop();
        nameEl.style.display = 'inline-block';
      }
    },
    applyCroppedImage: applyCroppedImage,
    pickImage: pickImage,
    getAspect: getAspect,
    getCropSize: getCropSize,
    isObuchenieUploadId: isObuchenieUploadId,
    syncColorField: syncColorField,
    updateTestingLivePreview: function updateTestingLivePreview() {
      var _document$getElementB24, _document$getElementB25, _document$getElementB26, _document$getElementB27, _document$getElementB28, _document$getElementB29, _document$getElementB30, _document$getElementB31, _document$getElementB32, _document$getElementB33, _document$getElementB34;
      var titleEl = document.getElementById('obuchenie_testing_live_title');
      var btnEl = document.getElementById('obuchenie_testing_live_btn');
      var previewEl = document.getElementById('obuchenie_testing_live_preview');
      if (!titleEl || !btnEl || !previewEl) return;
      var titleText = ((_document$getElementB24 = document.getElementById('obuchenie_testing_title')) === null || _document$getElementB24 === void 0 ? void 0 : _document$getElementB24.value) || '';
      var btnText = ((_document$getElementB25 = document.getElementById('obuchenie_testing_btn_text')) === null || _document$getElementB25 === void 0 ? void 0 : _document$getElementB25.value) || 'Пройти тест';
      var titleColor = readColorVal('obuchenie_testing_title_color', '#FFFFFF');
      var bgImage = ((_document$getElementB26 = document.getElementById('obuchenie_testing_image_val')) === null || _document$getElementB26 === void 0 ? void 0 : _document$getElementB26.value) || '';
      var titleTop = parseFloat((_document$getElementB27 = document.getElementById('obuchenie_testing_title_top')) === null || _document$getElementB27 === void 0 ? void 0 : _document$getElementB27.value) || 68;
      var titleLeft = parseFloat((_document$getElementB28 = document.getElementById('obuchenie_testing_title_left')) === null || _document$getElementB28 === void 0 ? void 0 : _document$getElementB28.value) || 60;
      var btnBottom = parseFloat((_document$getElementB29 = document.getElementById('obuchenie_testing_btn_bottom')) === null || _document$getElementB29 === void 0 ? void 0 : _document$getElementB29.value) || 65;
      var btnLeft = parseFloat((_document$getElementB30 = document.getElementById('obuchenie_testing_btn_left')) === null || _document$getElementB30 === void 0 ? void 0 : _document$getElementB30.value) || 60;
      previewEl.style.backgroundImage = bgImage ? "url(".concat(bgImage, ")") : '';
      previewEl.style.backgroundColor = bgImage ? 'transparent' : '';
      titleEl.innerHTML = previewMultilineHtml(titleText);
      titleEl.style.color = titleColor;
      titleEl.style.top = "calc((".concat(titleTop, " / 435) * 100%)");
      titleEl.style.left = "calc((".concat(titleLeft, " / 1520) * 100%)");
      titleEl.style.maxWidth = "calc(100% - ((".concat(titleLeft, " / 1520) * 100%) - 10px)");
      var titleSize = ((_document$getElementB31 = document.getElementById('obuchenie_testing_title_size')) === null || _document$getElementB31 === void 0 ? void 0 : _document$getElementB31.value) || '';
      var titleWeight = ((_document$getElementB32 = document.getElementById('obuchenie_testing_title_weight')) === null || _document$getElementB32 === void 0 ? void 0 : _document$getElementB32.value) || '';
      var titleItalic = ((_document$getElementB33 = document.getElementById('obuchenie_testing_title_italic')) === null || _document$getElementB33 === void 0 ? void 0 : _document$getElementB33.checked) || false;
      var titleUnderline = ((_document$getElementB34 = document.getElementById('obuchenie_testing_title_underline')) === null || _document$getElementB34 === void 0 ? void 0 : _document$getElementB34.checked) || false;
      if (titleSize) titleEl.style.fontSize = "calc((".concat(titleSize, " / 1520) * 100cqw)");else titleEl.style.removeProperty('font-size');
      if (titleWeight) titleEl.style.fontWeight = titleWeight;else titleEl.style.removeProperty('font-weight');
      titleEl.style.fontStyle = titleItalic ? 'italic' : '';
      titleEl.style.textDecoration = titleUnderline ? 'underline' : '';
      btnEl.textContent = btnText;
      btnEl.style.bottom = "calc((".concat(btnBottom, " / 435) * 100%)");
      btnEl.style.left = "calc((".concat(btnLeft, " / 1520) * 100%)");
      btnEl.style.top = 'auto';
    },
    updateLivePreview: function updateLivePreview() {
      if (!window.AdminHeroSlides) return;
      var config = obuchenieHeroSlidesConfig();
      var count = document.querySelectorAll("input[id^=\"obuchenie_hero_bg_\"][id$=\"_val\"]").length;
      for (var i = 0; i < count; i++) {
        AdminHeroSlides.applySlidePreviewStyles(i, config);
      }
    },
    addCourseCard: function addCourseCard() {
      var _window$saveObuchenie3, _window3;
      (_window$saveObuchenie3 = (_window3 = window).saveObucheniePageStateToMemory) === null || _window$saveObuchenie3 === void 0 || _window$saveObuchenie3.call(_window3);
      window.obucheniePageData.courseCards.push({
        title: '',
        price: 'от 10 000 руб.',
        durationNum: '1,5',
        durationUnit: 'месяца',
        scheduleNum: '2',
        scheduleUnit: 'раза в неделю',
        btnText: 'Записаться',
        btnLink: '#contacts',
        moreLink: '#courses'
      });
      renderObucheniePageAdmin(window.obucheniePageData);
    },
    removeCourseCard: function removeCourseCard(index) {
      var _window$saveObuchenie4, _window4;
      (_window$saveObuchenie4 = (_window4 = window).saveObucheniePageStateToMemory) === null || _window$saveObuchenie4 === void 0 || _window$saveObuchenie4.call(_window4);
      window.obucheniePageData.courseCards.splice(index, 1);
      renderObucheniePageAdmin(window.obucheniePageData);
    }
  };
})();