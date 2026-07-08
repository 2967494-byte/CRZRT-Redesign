function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Редактор страницы ЭТП для admin.html
 */
(function (_window$EcpContent) {
  var DEFAULT_ECP_PAGE = ((_window$EcpContent = window.EcpContent) === null || _window$EcpContent === void 0 ? void 0 : _window$EcpContent.ECP_DEFAULTS) || {
    hero: {
      background: '',
      title: '',
      subtitle: '',
      titleColor: '#ffffff',
      titleTop: 122,
      titleLeft: 70,
      subtitleColor: '#ffffff',
      subtitleTop: 213,
      subtitleLeft: 70
    },
    tariffs: [],
    blanks: {
      patternImage: '',
      items: []
    },
    manual: {
      title: '',
      bookImage: '',
      items: []
    },
    videos: [],
    support: {
      background: '',
      title: '',
      items: [],
      buttonText: '',
      buttonLink: '#contacts'
    }
  };
  function escapeAttr(s) {
    return String(s !== null && s !== void 0 ? s : '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }
  function migrateEcpPageData(raw) {
    var _window$EcpContent2;
    if ((_window$EcpContent2 = window.EcpContent) !== null && _window$EcpContent2 !== void 0 && _window$EcpContent2.migrateEcpData) {
      return window.EcpContent.migrateEcpData(raw);
    }
    return _objectSpread(_objectSpread({}, DEFAULT_ECP_PAGE), raw || {});
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
    if (id === 'ecp_hero_bg' || id !== null && id !== void 0 && id.startsWith('ecp_hero_bg_')) {
      var idx = id.split('_').pop();
      var livePreview = document.getElementById("ecp_hero_live_preview_".concat(idx));
      if (livePreview) {
        if (v) {
          livePreview.style.backgroundImage = "url('".concat(v, "')");
        } else {
          livePreview.style.backgroundImage = 'radial-gradient(32.3% 55.38% at 71.22% 54%, #FFFFFF 0%, #B8FDC6 100%)';
        }
      }
    }
  }
  function heroBgUploadShell(id, label) {
    var sizeLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1520×420';
    return "\n      <div class=\"form-group hero-slide-upload-group\" style=\"margin-bottom:0;\">\n        <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;\">\n          <label style=\"margin-bottom:0;\">".concat(label, "</label>\n          <div class=\"hero-slide-upload-actions image-upload-mini\" data-upload-id=\"").concat(id, "\" style=\"display:flex; gap:8px;\">\n            <button type=\"button\" class=\"btn-save\" style=\"padding:6px 12px;font-size:0.8rem;\" onclick=\"AdminEcp.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n            <button type=\"button\" class=\"btn-delete\" style=\"padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;\" id=\"").concat(id, "_clear\" onclick=\"AdminEcp.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n            <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n          </div>\n        </div>\n        <div class=\"hero-slide-frame hero-slide-frame--empty\" data-upload-frame-for=\"").concat(id, "\">\n          <span class=\"hero-slide-frame__empty\">").concat(sizeLabel, "</span>\n          <img id=\"").concat(id, "_preview\" class=\"hero-slide-frame__img\" src=\"\" alt=\"\">\n        </div>\n      </div>");
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
  function setFileUploadState(id, url, name) {
    var val = document.getElementById(id);
    var label = document.getElementById("".concat(id, "_name"));
    if (val) val.value = url || '';
    if (label) {
      label.textContent = name || (url ? url.split('/').pop() : '');
      label.style.display = url ? 'inline' : 'none';
    }
  }
  function imageUploadHtml(id, label, hint) {
    return "\n      <div class=\"form-group\" style=\"margin-bottom:0;\">\n        <label>".concat(label, "</label>\n        ").concat(hint ? "<p style=\"color:var(--text-secondary);font-size:0.85rem;margin:-4px 0 8px;\">".concat(hint, "</p>") : '', "\n        <div class=\"image-upload-mini\" data-upload-id=\"").concat(id, "\">\n          <img id=\"").concat(id, "_preview\" src=\"\" alt=\"\" style=\"max-width:220px;max-height:160px;object-fit:contain;border-radius:8px;display:none;margin-bottom:8px;background:rgba(0,0,0,0.15);\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:8px 14px;font-size:0.85rem;\" onclick=\"AdminEcp.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n          <button type=\"button\" class=\"btn-delete\" style=\"padding:8px 14px;margin-left:8px;font-size:0.85rem;display:none;\" id=\"").concat(id, "_clear\" onclick=\"AdminEcp.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n          <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n        </div>\n      </div>");
  }
  function fileUploadRow(id, label, value, fileName) {
    var shownName = fileName || (value ? value.split('/').pop() : '');
    return "\n      <div class=\"form-group\">\n        <label>".concat(label, "</label>\n        <div style=\"display:flex;gap:8px;flex-wrap:wrap;align-items:center;\">\n          <input type=\"text\" class=\"form-control\" id=\"").concat(id, "\" value=\"").concat(escapeAttr(value), "\" placeholder=\"\u0421\u0441\u044B\u043B\u043A\u0430 \u0438\u043B\u0438 uploads/files/...\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:8px 14px;font-size:0.85rem;\" onclick=\"AdminEcp.pickFile('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u0430\u0439\u043B</button>\n        </div>\n        <small id=\"").concat(id, "_name\" style=\"display:").concat(shownName ? 'inline' : 'none', ";color:var(--text-secondary);margin-top:6px;\">").concat(escapeAttr(shownName), "</small>\n      </div>");
  }
  function compactFileUploadHtml(id, value, fileName) {
    var label = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'Файл для скачивания';
    var shownName = fileName || (value ? value.split('/').pop() : '');
    return "\n      <div class=\"ecp-admin-card__file\">\n        <label for=\"".concat(id, "\">").concat(label, "</label>\n        <input type=\"text\" class=\"form-control\" id=\"").concat(id, "\" value=\"").concat(escapeAttr(value), "\" placeholder=\"\u0421\u0441\u044B\u043B\u043A\u0430 \u0438\u043B\u0438 uploads/files/...\">\n        <button type=\"button\" class=\"btn-save ecp-admin-card__upload-btn\" onclick=\"AdminEcp.pickFile('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u0430\u0439\u043B</button>\n        <small id=\"").concat(id, "_name\" class=\"ecp-admin-card__file-name\" style=\"display:").concat(shownName ? 'block' : 'none', ";\">").concat(escapeAttr(shownName), "</small>\n      </div>");
  }
  function ecpAdminGridHtml(gridModifier, cardsHtml) {
    return "<div class=\"ecp-admin-grid ".concat(gridModifier, "\">").concat(cardsHtml, "</div>");
  }
  function ecpAdminCardHtml(index, removeOnclick, bodyHtml) {
    return "\n      <div class=\"ecp-admin-card\">\n        <div class=\"ecp-admin-card__head\">\n          <span class=\"ecp-admin-card__num\">\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 ".concat(index + 1, "</span>\n          <button type=\"button\" class=\"btn-delete ecp-admin-card__delete\" onclick=\"").concat(removeOnclick, "\">\xD7</button>\n        </div>\n        ").concat(bodyHtml, "\n      </div>");
  }
  function getMigratedEcpData(data) {
    var _window$EcpContent3;
    if ((_window$EcpContent3 = window.EcpContent) !== null && _window$EcpContent3 !== void 0 && _window$EcpContent3.migrateEcpData) {
      return window.EcpContent.migrateEcpData(data || {});
    }
    return _objectSpread(_objectSpread({}, DEFAULT_ECP_PAGE), data || {});
  }
  function ecpHeroSlidesConfig() {
    return {
      prefix: 'ecp_hero',
      removeHandler: 'AdminEcp.removeHeroSlide',
      pickHandler: 'AdminEcp.pickImage',
      clearHandler: 'AdminEcp.clearImage',
      previewClass: 'ecp-live-banner-preview',
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
    var el = document.getElementById('ecpHeroAdmin');
    if (!el || !window.AdminHeroSlides) return;
    AdminHeroSlides.render(el, getMigratedEcpData(data).heroSlides || [], ecpHeroSlidesConfig(), setImageUploadState);
  }
  function renderTariffsAdmin(data) {
    var el = document.getElementById('ecpTariffsAdmin');
    if (!el) return;
    var list = data.tariffs || [];
    el.innerHTML = ecpAdminGridHtml('ecp-admin-grid--4', list.map(function (item, i) {
      return ecpAdminCardHtml(i, "AdminEcp.removeTariff(".concat(i, ")"), "\n          <div class=\"ecp-admin-card__field\">\n            <label for=\"ecp_tariff_text_".concat(i, "\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 (Enter \u2014 \u043F\u0435\u0440\u0435\u043D\u043E\u0441)</label>\n            <textarea class=\"form-control\" id=\"ecp_tariff_text_").concat(i, "\" rows=\"2\">").concat(escapeAttr(item.text), "</textarea>\n          </div>\n          ").concat(compactFileUploadHtml("ecp_tariff_file_".concat(i), item.file || '', item.fileName)));
    }).join(''));
  }
  function renderBlanksAdmin(data) {
    var el = document.getElementById('ecpBlanksAdmin');
    if (!el) return;
    var blanks = data.blanks || {};
    var items = blanks.items || [];
    el.innerHTML = "\n      ".concat(imageUploadHtml('ecp_blanks_pattern', 'Декоративный паттерн карточек', 'Используется справа в карточках бланков'), "\n      <div id=\"ecpBlanksItemsAdmin\"></div>\n    ");
    setImageUploadState('ecp_blanks_pattern', blanks.patternImage);
    var itemsEl = document.getElementById('ecpBlanksItemsAdmin');
    itemsEl.innerHTML = ecpAdminGridHtml('ecp-admin-grid--4', items.map(function (item, i) {
      return ecpAdminCardHtml(i, "AdminEcp.removeBlank(".concat(i, ")"), "\n          <div class=\"ecp-admin-card__field\">\n            <label for=\"ecp_blank_text_".concat(i, "\">\u0422\u0435\u043A\u0441\u0442 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438</label>\n            <textarea class=\"form-control\" id=\"ecp_blank_text_").concat(i, "\" rows=\"3\">").concat(escapeAttr(item.text), "</textarea>\n          </div>\n          ").concat(compactFileUploadHtml("ecp_blank_file_".concat(i), item.file || '', item.fileName)));
    }).join(''));
  }
  function renderManualAdmin(data) {
    var el = document.getElementById('ecpManualAdmin');
    if (!el) return;
    var manual = data.manual || {};
    var items = manual.items || [];
    el.innerHTML = "\n      <div class=\"form-group\">\n        <label for=\"ecp_manual_section_title\">\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0431\u043B\u043E\u043A\u0430 (Enter \u2014 \u043F\u0435\u0440\u0435\u043D\u043E\u0441)</label>\n        <textarea class=\"form-control\" id=\"ecp_manual_section_title\" rows=\"2\">".concat(escapeAttr(manual.title), "</textarea>\n      </div>\n      ").concat(imageUploadHtml('ecp_manual_book', 'Изображение книги справа'), "\n      <div id=\"ecpManualItemsAdmin\"></div>\n    ");
    setImageUploadState('ecp_manual_book', manual.bookImage);
    var itemsEl = document.getElementById('ecpManualItemsAdmin');
    itemsEl.innerHTML = ecpAdminGridHtml('ecp-admin-grid--4', items.map(function (item, i) {
      return ecpAdminCardHtml(i, "AdminEcp.removeManualItem(".concat(i, ")"), "\n          <div class=\"ecp-admin-card__field\">\n            <label for=\"ecp_manual_title_".concat(i, "\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430</label>\n            <input type=\"text\" class=\"form-control\" id=\"ecp_manual_title_").concat(i, "\" value=\"").concat(escapeAttr(item.title), "\">\n          </div>\n          ").concat(compactFileUploadHtml("ecp_manual_file_".concat(i), item.file || '', item.fileName, 'PDF / файл')));
    }).join(''));
  }
  function resolveAdminVideoPreview(video) {
    var _window$EcpContent4;
    if ((_window$EcpContent4 = window.EcpContent) !== null && _window$EcpContent4 !== void 0 && _window$EcpContent4.resolveVideoThumbnail) {
      return window.EcpContent.resolveVideoThumbnail(video) || '';
    }
    return (video === null || video === void 0 ? void 0 : video.thumbnail) || '';
  }
  function renderVideosAdmin(data) {
    var el = document.getElementById('ecpVideosAdmin');
    if (!el) return;
    var list = data.videos || [];
    el.innerHTML = ecpAdminGridHtml('ecp-admin-grid--3', list.map(function (video, i) {
      var thumb = resolveAdminVideoPreview(video);
      return ecpAdminCardHtml(i, "AdminEcp.removeVideo(".concat(i, ")"), "\n          <div class=\"ecp-admin-card__field\">\n            <label for=\"ecp_video_url_".concat(i, "\">\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u0432\u0438\u0434\u0435\u043E</label>\n            <input type=\"url\" class=\"form-control\" id=\"ecp_video_url_").concat(i, "\" value=\"").concat(escapeAttr(video.url), "\" placeholder=\"https://youtube.com/...\">\n          </div>\n          <div class=\"ecp-admin-card__field\">\n            <label for=\"ecp_video_title_").concat(i, "\">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</label>\n            <textarea class=\"form-control\" id=\"ecp_video_title_").concat(i, "\" rows=\"2\">").concat(escapeAttr(video.title), "</textarea>\n          </div>\n          <div class=\"ecp-admin-card__thumb\">\n            ").concat(imageUploadHtml("ecp_video_thumb_".concat(i), 'Превью (необязательно)', 'Для YouTube, Rutube и VK подставится автоматически'), "\n            <img id=\"ecp_video_auto_preview_").concat(i, "\" class=\"ecp-admin-card__auto-preview\" src=\"").concat(escapeAttr(thumb), "\" alt=\"\" style=\"").concat(thumb ? '' : 'display:none;', "\">\n          </div>"));
    }).join(''));
    list.forEach(function (video, i) {
      return setImageUploadState("ecp_video_thumb_".concat(i), video.thumbnail || '');
    });
  }
  function renderSupportAdmin(data) {
    var el = document.getElementById('ecpSupportAdmin');
    if (!el) return;
    var support = getMigratedEcpData(data).support || {};
    var items = Array.isArray(support.items) ? support.items : [];
    el.innerHTML = "\n      ".concat(heroBgUploadShell('ecp_support_bg', 'Фон баннера (~1520×435 px, весь баннер целиком)', '1520×435'), "\n      <div class=\"form-group\" style=\"margin-top:20px;\">\n        <label>\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A</label>\n        <input type=\"text\" class=\"form-control\" id=\"ecp_support_title\" value=\"").concat(escapeAttr(support.title), "\">\n      </div>\n      <div class=\"form-group\">\n        <label>\u041F\u0443\u043D\u043A\u0442\u044B \u0441\u043F\u0438\u0441\u043A\u0430 (\u043F\u043E \u043E\u0434\u043D\u043E\u043C\u0443 \u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0443)</label>\n        <textarea class=\"form-control\" id=\"ecp_support_items\" rows=\"5\">").concat(escapeAttr(items.join('\n')), "</textarea>\n      </div>\n      <div class=\"form-group\">\n        <label>\u0422\u0435\u043A\u0441\u0442 \u043A\u043D\u043E\u043F\u043A\u0438</label>\n        <input type=\"text\" class=\"form-control\" id=\"ecp_support_btn_text\" value=\"").concat(escapeAttr(support.buttonText), "\">\n      </div>\n      <div class=\"form-group\">\n        <label>\u0421\u0441\u044B\u043B\u043A\u0430 \u043A\u043D\u043E\u043F\u043A\u0438 \xAB\u0423\u0437\u043D\u0430\u0442\u044C \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435\xBB</label>\n        <input type=\"text\" class=\"form-control\" id=\"ecp_support_btn_link\" value=\"").concat(escapeAttr(support.buttonLink), "\" placeholder=\"#contacts \u0438\u043B\u0438 https://...\">\n      </div>\n    ");
    setImageUploadState('ecp_support_bg', support.background);
  }
  function renderEcpPageAdmin(data) {
    renderHeroAdmin(data);
    renderTariffsAdmin(data);
    renderBlanksAdmin(data);
    renderManualAdmin(data);
    renderVideosAdmin(data);
    renderSupportAdmin(data);
  }
  function readImageVal(id) {
    var _document$getElementB;
    return ((_document$getElementB = document.getElementById("".concat(id, "_val"))) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value) || '';
  }
  function collectEcpPageFromForm(existing) {
    var _ref, _document$getElementB6, _document$getElementB7, _data$manual, _document$getElementB10, _document$getElementB11, _document$getElementB12, _document$getElementB13;
    var data = getMigratedEcpData(existing || window.ecpPageData || {});
    var existingSupport = data.support || {};
    data.heroSlides = window.AdminHeroSlides ? AdminHeroSlides.collect('ecp_hero') : [];
    data.hero = data.heroSlides[0] || data.hero || {};
    data.tariffs = [];
    var tariffCount = document.querySelectorAll('[id^="ecp_tariff_text_"]').length;
    for (var i = 0; i < tariffCount; i++) {
      var _document$getElementB2, _document$getElementB3;
      data.tariffs.push({
        text: ((_document$getElementB2 = document.getElementById("ecp_tariff_text_".concat(i))) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.value) || '',
        file: ((_document$getElementB3 = document.getElementById("ecp_tariff_file_".concat(i))) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.value) || ''
      });
    }
    data.blanks = {
      patternImage: readImageVal('ecp_blanks_pattern'),
      items: []
    };
    var blankCount = document.querySelectorAll('[id^="ecp_blank_text_"]').length;
    for (var _i = 0; _i < blankCount; _i++) {
      var _document$getElementB4, _document$getElementB5;
      data.blanks.items.push({
        text: ((_document$getElementB4 = document.getElementById("ecp_blank_text_".concat(_i))) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value) || '',
        file: ((_document$getElementB5 = document.getElementById("ecp_blank_file_".concat(_i))) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.value) || ''
      });
    }
    data.manual = {
      title: (_ref = (_document$getElementB6 = (_document$getElementB7 = document.getElementById('ecp_manual_section_title')) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.value) !== null && _document$getElementB6 !== void 0 ? _document$getElementB6 : (_data$manual = data.manual) === null || _data$manual === void 0 ? void 0 : _data$manual.title) !== null && _ref !== void 0 ? _ref : '',
      bookImage: readImageVal('ecp_manual_book'),
      items: []
    };
    var manualCount = document.querySelectorAll('[id^="ecp_manual_title_"]').length;
    for (var _i2 = 0; _i2 < manualCount; _i2++) {
      var _document$getElementB8, _document$getElementB9;
      data.manual.items.push({
        title: ((_document$getElementB8 = document.getElementById("ecp_manual_title_".concat(_i2))) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.value) || '',
        file: ((_document$getElementB9 = document.getElementById("ecp_manual_file_".concat(_i2))) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.value) || ''
      });
    }
    data.videos = [];
    var videoCount = document.querySelectorAll('[id^="ecp_video_url_"]').length;
    for (var _i3 = 0; _i3 < videoCount; _i3++) {
      var _document$getElementB0, _document$getElementB1;
      data.videos.push({
        url: ((_document$getElementB0 = document.getElementById("ecp_video_url_".concat(_i3))) === null || _document$getElementB0 === void 0 ? void 0 : _document$getElementB0.value) || '',
        title: ((_document$getElementB1 = document.getElementById("ecp_video_title_".concat(_i3))) === null || _document$getElementB1 === void 0 ? void 0 : _document$getElementB1.value) || '',
        thumbnail: readImageVal("ecp_video_thumb_".concat(_i3))
      });
    }
    var supportItemsRaw = (_document$getElementB10 = document.getElementById('ecp_support_items')) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.value;
    var supportTitle = (_document$getElementB11 = document.getElementById('ecp_support_title')) === null || _document$getElementB11 === void 0 ? void 0 : _document$getElementB11.value;
    var supportBtnText = (_document$getElementB12 = document.getElementById('ecp_support_btn_text')) === null || _document$getElementB12 === void 0 ? void 0 : _document$getElementB12.value;
    var supportBtnLink = (_document$getElementB13 = document.getElementById('ecp_support_btn_link')) === null || _document$getElementB13 === void 0 ? void 0 : _document$getElementB13.value;
    data.support = {
      background: readImageVal('ecp_support_bg') || existingSupport.background || '',
      title: supportTitle != null ? supportTitle : existingSupport.title || '',
      items: supportItemsRaw != null ? supportItemsRaw.split('\n').map(function (s) {
        return s.trim();
      }).filter(Boolean) : existingSupport.items || [],
      buttonText: supportBtnText != null ? supportBtnText : existingSupport.buttonText || '',
      buttonLink: supportBtnLink != null ? supportBtnLink : existingSupport.buttonLink || '#contacts'
    };
    return data;
  }
  function pickImage(uploadId) {
    var _document$getElementB14;
    window.cropTarget = {
      uploadId: uploadId,
      aspect: AdminEcp.getAspect(uploadId)
    };
    window.activeAuthorIndex = null;
    window.activeFeatureCardIndex = undefined;
    window.activeAboutImage = false;
    (_document$getElementB14 = document.getElementById('imageInput')) === null || _document$getElementB14 === void 0 || _document$getElementB14.click();
  }
  function pickFile(inputId) {
    var _document$getElementB15;
    window.fileUploadTarget = inputId;
    (_document$getElementB15 = document.getElementById('docFileInput')) === null || _document$getElementB15 === void 0 || _document$getElementB15.click();
  }
  function clearImage(uploadId) {
    setImageUploadState(uploadId, '');
  }
  function applyCroppedImage(uploadId, dataUrl) {
    if (uploadId && uploadId.startsWith('ecp_')) {
      setImageUploadState(uploadId, dataUrl);
    }
  }
  function getAspect(uploadId) {
    if (uploadId === 'ecp_hero_bg' || uploadId !== null && uploadId !== void 0 && uploadId.startsWith('ecp_hero_bg_')) return 1520 / 420;
    if (uploadId === 'ecp_support_bg') return 1520 / 435;
    if (uploadId === 'ecp_blanks_pattern') return 90 / 107;
    if (uploadId === 'ecp_manual_book') return 396 / 509;
    if (uploadId.startsWith('ecp_video_thumb_')) return 474 / 290;
    return 16 / 9;
  }
  function getCropSize(uploadId) {
    if (uploadId === 'ecp_hero_bg' || uploadId !== null && uploadId !== void 0 && uploadId.startsWith('ecp_hero_bg_')) return [1520, 420];
    if (uploadId === 'ecp_support_bg') return [1520, 435];
    if (uploadId === 'ecp_blanks_pattern') return [400, 480];
    if (uploadId === 'ecp_manual_book') return [396, 509];
    if (uploadId.startsWith('ecp_video_thumb_')) return [474, 290];
    return [1200, 675];
  }
  function isEcpUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('ecp_'));
  }
  window.AdminEcp = {
    DEFAULT_ECP_PAGE: DEFAULT_ECP_PAGE,
    migrateEcpPageData: migrateEcpPageData,
    renderEcpPageAdmin: renderEcpPageAdmin,
    collectEcpPageFromForm: collectEcpPageFromForm,
    pickImage: pickImage,
    pickFile: pickFile,
    clearImage: clearImage,
    applyCroppedImage: applyCroppedImage,
    getAspect: getAspect,
    getCropSize: getCropSize,
    isEcpUploadId: isEcpUploadId,
    setFileUploadState: setFileUploadState,
    addHeroSlide: function addHeroSlide() {
      var _window$saveEcpPageSt, _window;
      (_window$saveEcpPageSt = (_window = window).saveEcpPageStateToMemory) === null || _window$saveEcpPageSt === void 0 || _window$saveEcpPageSt.call(_window);
      var page = window.ecpPageData || {};
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
      renderEcpPageAdmin(page);
    },
    removeHeroSlide: function removeHeroSlide(i) {
      var _window$saveEcpPageSt2, _window2, _page$heroSlides;
      (_window$saveEcpPageSt2 = (_window2 = window).saveEcpPageStateToMemory) === null || _window$saveEcpPageSt2 === void 0 || _window$saveEcpPageSt2.call(_window2);
      var page = window.ecpPageData || {};
      if (!((_page$heroSlides = page.heroSlides) !== null && _page$heroSlides !== void 0 && _page$heroSlides.length)) return;
      page.heroSlides.splice(i, 1);
      if (!page.heroSlides.length) page.heroSlides.push({
        title: '',
        subtitle: '',
        background: ''
      });
      renderEcpPageAdmin(page);
    },
    addTariff: function addTariff() {
      var _window$saveEcpPageSt3, _window3;
      (_window$saveEcpPageSt3 = (_window3 = window).saveEcpPageStateToMemory) === null || _window$saveEcpPageSt3 === void 0 || _window$saveEcpPageSt3.call(_window3);
      window.ecpPageData.tariffs.push({
        text: '',
        file: ''
      });
      renderEcpPageAdmin(window.ecpPageData);
    },
    removeTariff: function removeTariff(i) {
      var _window$saveEcpPageSt4, _window4;
      (_window$saveEcpPageSt4 = (_window4 = window).saveEcpPageStateToMemory) === null || _window$saveEcpPageSt4 === void 0 || _window$saveEcpPageSt4.call(_window4);
      window.ecpPageData.tariffs.splice(i, 1);
      renderEcpPageAdmin(window.ecpPageData);
    },
    addBlank: function addBlank() {
      var _window$saveEcpPageSt5, _window5;
      (_window$saveEcpPageSt5 = (_window5 = window).saveEcpPageStateToMemory) === null || _window$saveEcpPageSt5 === void 0 || _window$saveEcpPageSt5.call(_window5);
      if (!window.ecpPageData.blanks) window.ecpPageData.blanks = {
        patternImage: '',
        items: []
      };
      window.ecpPageData.blanks.items.push({
        text: '',
        file: ''
      });
      renderEcpPageAdmin(window.ecpPageData);
    },
    removeBlank: function removeBlank(i) {
      var _window$saveEcpPageSt6, _window6;
      (_window$saveEcpPageSt6 = (_window6 = window).saveEcpPageStateToMemory) === null || _window$saveEcpPageSt6 === void 0 || _window$saveEcpPageSt6.call(_window6);
      window.ecpPageData.blanks.items.splice(i, 1);
      renderEcpPageAdmin(window.ecpPageData);
    },
    addManualItem: function addManualItem() {
      var _window$saveEcpPageSt7, _window7;
      (_window$saveEcpPageSt7 = (_window7 = window).saveEcpPageStateToMemory) === null || _window$saveEcpPageSt7 === void 0 || _window$saveEcpPageSt7.call(_window7);
      if (!window.ecpPageData.manual) window.ecpPageData.manual = {
        title: '',
        bookImage: '',
        items: []
      };
      window.ecpPageData.manual.items.push({
        title: '',
        file: ''
      });
      renderEcpPageAdmin(window.ecpPageData);
    },
    removeManualItem: function removeManualItem(i) {
      var _window$saveEcpPageSt8, _window8;
      (_window$saveEcpPageSt8 = (_window8 = window).saveEcpPageStateToMemory) === null || _window$saveEcpPageSt8 === void 0 || _window$saveEcpPageSt8.call(_window8);
      window.ecpPageData.manual.items.splice(i, 1);
      renderEcpPageAdmin(window.ecpPageData);
    },
    addVideo: function addVideo() {
      var _window$saveEcpPageSt9, _window9;
      (_window$saveEcpPageSt9 = (_window9 = window).saveEcpPageStateToMemory) === null || _window$saveEcpPageSt9 === void 0 || _window$saveEcpPageSt9.call(_window9);
      window.ecpPageData.videos.push({
        url: '',
        title: '',
        thumbnail: ''
      });
      renderEcpPageAdmin(window.ecpPageData);
    },
    removeVideo: function removeVideo(i) {
      var _window$saveEcpPageSt0, _window0;
      (_window$saveEcpPageSt0 = (_window0 = window).saveEcpPageStateToMemory) === null || _window$saveEcpPageSt0 === void 0 || _window$saveEcpPageSt0.call(_window0);
      window.ecpPageData.videos.splice(i, 1);
      renderEcpPageAdmin(window.ecpPageData);
    }
  };
})();