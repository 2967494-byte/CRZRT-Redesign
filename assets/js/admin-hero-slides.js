/**
 * Админка: до 8 слайдов баннера (как на главной).
 */
(function (_window$HeroSlides) {
  var MAX = ((_window$HeroSlides = window.HeroSlides) === null || _window$HeroSlides === void 0 ? void 0 : _window$HeroSlides.MAX_HERO_SLIDES) || 8;
  function escapeAttr(s) {
    return String(s !== null && s !== void 0 ? s : '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }
  function blockHeaderWithColorHtml(title, colorId, colorValue, defaultColor, fontSize, fontWeight, italic, underline) {
    var color = /^#[0-9A-Fa-f]{6}$/.test(colorValue || '') ? colorValue : defaultColor;
    var sizeId = colorId.replace('_color', '_size');
    var weightId = colorId.replace('_color', '_weight');
    var italicId = colorId.replace('_color', '_italic');
    var underlineId = colorId.replace('_color', '_underline');
    return "\n      <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;\">\n        <span style=\"font-weight:600; font-size:0.95rem;\">".concat(title, "</span>\n        <div style=\"display:flex; align-items:center; gap:8px; flex-wrap:wrap;\">\n          <input type=\"number\" id=\"").concat(sizeId, "\" value=\"").concat(escapeAttr(fontSize), "\" placeholder=\"px\" title=\"\u0420\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430\" style=\"width:55px; height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; text-align:center; margin-bottom:0;\">\n          <select id=\"").concat(weightId, "\" title=\"\u0422\u043E\u043B\u0449\u0438\u043D\u0430 \u0448\u0440\u0438\u0444\u0442\u0430\" style=\"height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; cursor:pointer; margin-bottom:0;\">\n            <option value=\"\" ").concat(!fontWeight ? 'selected' : '', ">\u0422\u043E\u043B\u0449\u0438\u043D\u0430</option>\n            <option value=\"300\" ").concat(fontWeight === '300' ? 'selected' : '', ">\u0422\u043E\u043D\u043A\u0438\u0439</option>\n            <option value=\"500\" ").concat(fontWeight === '500' ? 'selected' : '', ">\u0421\u0440\u0435\u0434\u043D\u0438\u0439</option>\n            <option value=\"700\" ").concat(fontWeight === '700' ? 'selected' : '', ">\u0422\u043E\u043B\u0441\u0442\u044B\u0439</option>\n          </select>\n          <label title=\"\u041A\u0443\u0440\u0441\u0438\u0432\" style=\"display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:").concat(italic ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)', "; margin-bottom:0; font-style:italic; font-weight:bold; user-select:none; font-family:serif;\">\n            <input type=\"checkbox\" id=\"").concat(italicId, "\" ").concat(italic ? 'checked' : '', " style=\"display:none;\">\n            I\n          </label>\n          <label title=\"\u041F\u043E\u0434\u0447\u0435\u0440\u043A\u043D\u0443\u0442\u044B\u0439\" style=\"display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:").concat(underline ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)', "; margin-bottom:0; text-decoration:underline; font-weight:bold; user-select:none; font-family:serif;\">\n            <input type=\"checkbox\" id=\"").concat(underlineId, "\" ").concat(underline ? 'checked' : '', " style=\"display:none;\">\n            U\n          </label>\n          <input type=\"color\" id=\"").concat(colorId, "_picker\" value=\"").concat(escapeAttr(color), "\" style=\"width:30px; height:30px; padding:0; border:none; border-radius:4px; cursor:pointer; background:transparent; margin-bottom:0;\">\n          <input type=\"text\" class=\"form-control\" id=\"").concat(colorId, "\" value=\"").concat(escapeAttr(colorValue || ''), "\" placeholder=\"").concat(defaultColor, "\" style=\"max-width:90px; padding:4px 8px; font-size:0.85rem; font-family:monospace; margin-bottom:0;\">\n        </div>\n      </div>");
  }
  function heroBgUploadShell(id, label, pickHandler, clearHandler) {
    return "\n      <div class=\"form-group hero-slide-upload-group\" style=\"margin-bottom:0;\">\n        <label>".concat(label, "</label>\n        <div class=\"hero-slide-frame hero-slide-frame--empty\" data-upload-frame-for=\"").concat(id, "\">\n          <span class=\"hero-slide-frame__empty\">\u043F\u0440\u043E\u043F\u043E\u0440\u0446\u0438\u0438 1520\xD7420</span>\n          <img id=\"").concat(id, "_preview\" class=\"hero-slide-frame__img\" src=\"\" alt=\"\">\n        </div>\n        <div class=\"hero-slide-upload-actions image-upload-mini\" data-upload-id=\"").concat(id, "\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:8px 14px;font-size:0.85rem;\" onclick=\"").concat(pickHandler, "('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n          <button type=\"button\" class=\"btn-secondary\" style=\"padding:8px 14px;font-size:0.85rem;\" onclick=\"openBgHistoryModal('").concat(id, "')\">\u0420\u0430\u043D\u0435\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043D\u044B\u0435</button>\n          <button type=\"button\" class=\"btn-delete\" style=\"padding:8px 14px;font-size:0.85rem;display:none;\" id=\"").concat(id, "_clear\" onclick=\"").concat(clearHandler, "('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n          <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n        </div>\n      </div>");
  }
  function slideHtml(slide, i, config) {
    var _d$titleTop, _d$titleLeft, _d$subtitleBottom, _d$subtitleTop, _d$subtitleLeft;
    var prefix = config.prefix,
      removeHandler = config.removeHandler,
      pickHandler = config.pickHandler,
      clearHandler = config.clearHandler,
      subtitleUseBottom = config.subtitleUseBottom,
      defaults = config.defaults;
    var d = defaults || {};
    var titleTop = slide.titleTop !== undefined ? slide.titleTop : (_d$titleTop = d.titleTop) !== null && _d$titleTop !== void 0 ? _d$titleTop : 122;
    var titleLeft = slide.titleLeft !== undefined ? slide.titleLeft : (_d$titleLeft = d.titleLeft) !== null && _d$titleLeft !== void 0 ? _d$titleLeft : 70;
    var subtitleOffsetLabel = subtitleUseBottom ? 'Отступ снизу (px)' : 'Отступ сверху (px)';
    var subtitleOffsetId = subtitleUseBottom ? "".concat(prefix, "_subtitle_bottom_").concat(i) : "".concat(prefix, "_subtitle_top_").concat(i);
    var subtitleOffsetVal = subtitleUseBottom ? slide.subtitleBottom !== undefined ? slide.subtitleBottom : (_d$subtitleBottom = d.subtitleBottom) !== null && _d$subtitleBottom !== void 0 ? _d$subtitleBottom : 40 : slide.subtitleTop !== undefined ? slide.subtitleTop : (_d$subtitleTop = d.subtitleTop) !== null && _d$subtitleTop !== void 0 ? _d$subtitleTop : 213;
    var subtitleLeft = slide.subtitleLeft !== undefined ? slide.subtitleLeft : (_d$subtitleLeft = d.subtitleLeft) !== null && _d$subtitleLeft !== void 0 ? _d$subtitleLeft : 70;
    var titleColorDefault = d.titleColor || '#ffffff';
    var subtitleColorDefault = d.subtitleColor || '#ffffff';
    var previewClass = config.previewClass || 'landing-live-banner-preview';
    return "\n      <div class=\"admin-subcard\" style=\"padding:16px;border:1px solid var(--card-border);border-radius:12px;position:relative;margin-bottom:20px;\">\n        <button type=\"button\" class=\"btn-delete\" style=\"position:absolute;top:10px;right:10px;z-index:2;\" onclick=\"".concat(removeHandler, "(").concat(i, ")\">\xD7</button>\n        <div class=\"obuchenie-block-header\"><strong>\u0421\u043B\u0430\u0439\u0434 ").concat(i + 1, "</strong></div>\n        <div class=\"obuchenie-hero-grid\" style=\"margin-top:15px;\">\n          <div class=\"obuchenie-hero-banner-col\">\n            ").concat(heroBgUploadShell("".concat(prefix, "_bg_").concat(i), 'Фон слайда (пропорции ~1520×420)', pickHandler, clearHandler), "\n            <div style=\"margin-top:20px;\">\n              <label style=\"font-weight:600;display:block;margin-bottom:8px;font-size:0.9rem;color:var(--text-secondary);\">\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440</label>\n              <div class=\"").concat(previewClass, "\" id=\"").concat(prefix, "_live_preview_").concat(i, "\">\n                <div class=\"live-banner-title\" id=\"").concat(prefix, "_live_title_").concat(i, "\">").concat(escapeAttr(slide.title), "</div>\n                <div class=\"live-banner-subtitle\" id=\"").concat(prefix, "_live_subtitle_").concat(i, "\">").concat(escapeAttr(slide.subtitle), "</div>\n              </div>\n            </div>\n          </div>\n          <div class=\"obuchenie-hero-fields-col\" style=\"display:flex;flex-direction:column;gap:20px;\">\n            <div class=\"obuchenie-hero-block\" style=\"border:1px solid var(--card-border);padding:15px;border-radius:8px;background:rgba(255,255,255,0.02);\">\n              ").concat(blockHeaderWithColorHtml('Заголовок (Enter — перенос строки)', "".concat(prefix, "_title_color_").concat(i), slide.titleColor, titleColorDefault, slide.titleFontSize, slide.titleFontWeight, slide.titleItalic, slide.titleUnderline), "\n              <div class=\"form-group\" style=\"margin-bottom:0;margin-top:8px;\">\n                <textarea class=\"form-control\" id=\"").concat(prefix, "_title_").concat(i, "\" rows=\"2\" placeholder=\"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0431\u0430\u043D\u043D\u0435\u0440\u0430\">").concat(escapeAttr(slide.title), "</textarea>\n              </div>\n              <div style=\"display:flex;gap:16px;margin-top:12px;\">\n                <div style=\"flex:1;margin-bottom:0;\" class=\"form-group\">\n                  <label style=\"font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u0432\u0435\u0440\u0445\u0443 (px)</label>\n                  <input type=\"number\" class=\"form-control\" id=\"").concat(prefix, "_title_top_").concat(i, "\" value=\"").concat(titleTop, "\" style=\"padding:6px 10px;font-size:0.85rem;margin-bottom:0;\">\n                </div>\n                <div style=\"flex:1;margin-bottom:0;\" class=\"form-group\">\n                  <label style=\"font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430 (px)</label>\n                  <input type=\"number\" class=\"form-control\" id=\"").concat(prefix, "_title_left_").concat(i, "\" value=\"").concat(titleLeft, "\" style=\"padding:6px 10px;font-size:0.85rem;margin-bottom:0;\">\n                </div>\n              </div>\n            </div>\n            <div class=\"obuchenie-hero-block\" style=\"border:1px solid var(--card-border);padding:15px;border-radius:8px;background:rgba(255,255,255,0.02);\">\n              ").concat(blockHeaderWithColorHtml('Текст', "".concat(prefix, "_subtitle_color_").concat(i), slide.subtitleColor, subtitleColorDefault, slide.subtitleFontSize, slide.subtitleFontWeight, slide.subtitleItalic, slide.subtitleUnderline), "\n              <div class=\"form-group\" style=\"margin-bottom:0;margin-top:8px;\">\n                <textarea class=\"form-control\" id=\"").concat(prefix, "_subtitle_").concat(i, "\" rows=\"3\" placeholder=\"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435/\u0442\u0435\u043A\u0441\u0442 \u043F\u043E\u0434 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u043C\">").concat(escapeAttr(slide.subtitle), "</textarea>\n              </div>\n              <div style=\"display:flex;gap:16px;margin-top:12px;\">\n                <div style=\"flex:1;margin-bottom:0;\" class=\"form-group\">\n                  <label style=\"font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;\">").concat(subtitleOffsetLabel, "</label>\n                  <input type=\"number\" class=\"form-control\" id=\"").concat(subtitleOffsetId, "\" value=\"").concat(subtitleOffsetVal, "\" style=\"padding:6px 10px;font-size:0.85rem;margin-bottom:0;\">\n                </div>\n                <div style=\"flex:1;margin-bottom:0;\" class=\"form-group\">\n                  <label style=\"font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430 (px)</label>\n                  <input type=\"number\" class=\"form-control\" id=\"").concat(prefix, "_subtitle_left_").concat(i, "\" value=\"").concat(subtitleLeft, "\" style=\"padding:6px 10px;font-size:0.85rem;margin-bottom:0;\">\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>");
  }
  function readImageVal(id) {
    var _document$getElementB;
    return ((_document$getElementB = document.getElementById("".concat(id, "_val"))) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value) || '';
  }
  function readColorForCollect(colorId) {
    var _document$getElementB2, _document$getElementB3;
    var text = ((_document$getElementB2 = document.getElementById(colorId)) === null || _document$getElementB2 === void 0 || (_document$getElementB2 = _document$getElementB2.value) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.trim()) || '';
    if (/^#[0-9A-Fa-f]{6}$/.test(text)) return text;
    if (/^[0-9A-Fa-f]{6}$/.test(text)) return "#".concat(text);
    return ((_document$getElementB3 = document.getElementById("".concat(colorId, "_picker"))) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.value) || '';
  }
  function collect(prefix, options) {
    var _ref = options || {},
      _ref$subtitleUseBotto = _ref.subtitleUseBottom,
      subtitleUseBottom = _ref$subtitleUseBotto === void 0 ? false : _ref$subtitleUseBotto;
    var slides = [];
    var count = document.querySelectorAll("input[id^=\"".concat(prefix, "_bg_\"][id$=\"_val\"]")).length;
    for (var i = 0; i < count; i++) {
      var _document$getElementB4, _document$getElementB5, _document$getElementB6, _document$getElementB7, _document$getElementB8, _document$getElementB9, _document$getElementB0, _document$getElementB1, _document$getElementB10, _document$getElementB11, _document$getElementB12, _document$getElementB13, _document$getElementB14;
      var slide = {
        title: ((_document$getElementB4 = document.getElementById("".concat(prefix, "_title_").concat(i))) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value) || '',
        titleColor: readColorForCollect("".concat(prefix, "_title_color_").concat(i)),
        titleTop: parseInt(((_document$getElementB5 = document.getElementById("".concat(prefix, "_title_top_").concat(i))) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.value) || '122', 10),
        titleLeft: parseInt(((_document$getElementB6 = document.getElementById("".concat(prefix, "_title_left_").concat(i))) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.value) || '70', 10),
        titleFontSize: ((_document$getElementB7 = document.getElementById("".concat(prefix, "_title_size_").concat(i))) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.value) || '',
        titleFontWeight: ((_document$getElementB8 = document.getElementById("".concat(prefix, "_title_weight_").concat(i))) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.value) || '',
        titleItalic: ((_document$getElementB9 = document.getElementById("".concat(prefix, "_title_italic_").concat(i))) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.checked) || false,
        titleUnderline: ((_document$getElementB0 = document.getElementById("".concat(prefix, "_title_underline_").concat(i))) === null || _document$getElementB0 === void 0 ? void 0 : _document$getElementB0.checked) || false,
        subtitle: ((_document$getElementB1 = document.getElementById("".concat(prefix, "_subtitle_").concat(i))) === null || _document$getElementB1 === void 0 ? void 0 : _document$getElementB1.value) || '',
        subtitleColor: readColorForCollect("".concat(prefix, "_subtitle_color_").concat(i)),
        subtitleLeft: parseInt(((_document$getElementB10 = document.getElementById("".concat(prefix, "_subtitle_left_").concat(i))) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.value) || '70', 10),
        subtitleFontSize: ((_document$getElementB11 = document.getElementById("".concat(prefix, "_subtitle_size_").concat(i))) === null || _document$getElementB11 === void 0 ? void 0 : _document$getElementB11.value) || '',
        subtitleFontWeight: ((_document$getElementB12 = document.getElementById("".concat(prefix, "_subtitle_weight_").concat(i))) === null || _document$getElementB12 === void 0 ? void 0 : _document$getElementB12.value) || '',
        subtitleItalic: ((_document$getElementB13 = document.getElementById("".concat(prefix, "_subtitle_italic_").concat(i))) === null || _document$getElementB13 === void 0 ? void 0 : _document$getElementB13.checked) || false,
        subtitleUnderline: ((_document$getElementB14 = document.getElementById("".concat(prefix, "_subtitle_underline_").concat(i))) === null || _document$getElementB14 === void 0 ? void 0 : _document$getElementB14.checked) || false,
        background: readImageVal("".concat(prefix, "_bg_").concat(i))
      };
      if (subtitleUseBottom) {
        var _document$getElementB15;
        slide.subtitleBottom = parseInt(((_document$getElementB15 = document.getElementById("".concat(prefix, "_subtitle_bottom_").concat(i))) === null || _document$getElementB15 === void 0 ? void 0 : _document$getElementB15.value) || '40', 10);
      } else {
        var _document$getElementB16;
        slide.subtitleTop = parseInt(((_document$getElementB16 = document.getElementById("".concat(prefix, "_subtitle_top_").concat(i))) === null || _document$getElementB16 === void 0 ? void 0 : _document$getElementB16.value) || '213', 10);
      }
      slides.push(slide);
    }
    return slides;
  }
  function resolveColor(colorId, fallback) {
    var _document$getElementB17, _document$getElementB18;
    var text = ((_document$getElementB17 = document.getElementById(colorId)) === null || _document$getElementB17 === void 0 || (_document$getElementB17 = _document$getElementB17.value) === null || _document$getElementB17 === void 0 ? void 0 : _document$getElementB17.trim()) || '';
    if (/^#[0-9A-Fa-f]{6}$/.test(text)) return text;
    if (/^[0-9A-Fa-f]{6}$/.test(text)) return "#".concat(text);
    var picker = ((_document$getElementB18 = document.getElementById("".concat(colorId, "_picker"))) === null || _document$getElementB18 === void 0 ? void 0 : _document$getElementB18.value) || '';
    if (/^#[0-9A-Fa-f]{6}$/.test(picker)) return picker;
    return fallback || '#ffffff';
  }
  function wireColorField(colorId, refresh) {
    var color = document.getElementById(colorId);
    var colorPicker = document.getElementById("".concat(colorId, "_picker"));
    if (colorPicker) {
      colorPicker.addEventListener('input', function (e) {
        if (color) color.value = e.target.value.toUpperCase();
        refresh();
      });
    }
    if (color) {
      color.addEventListener('input', function (e) {
        var v = String(e.target.value || '').trim();
        if (/^[0-9A-Fa-f]{6}$/.test(v)) v = "#".concat(v);
        if (/^#[0-9A-Fa-f]{6}$/.test(v) && colorPicker) colorPicker.value = v.toLowerCase();
        refresh();
      });
    }
  }
  function applySlidePreviewStyles(i, config) {
    var _document$getElementB19, _document$getElementB20, _document$getElementB21;
    var prefix = config.prefix,
      subtitleUseBottom = config.subtitleUseBottom,
      defaults = config.defaults;
    var d = defaults || {};
    var preview = document.getElementById("".concat(prefix, "_live_preview_").concat(i));
    var titleLive = document.getElementById("".concat(prefix, "_live_title_").concat(i));
    var subtitleLive = document.getElementById("".concat(prefix, "_live_subtitle_").concat(i));
    if (!preview) return;
    var bg = readImageVal("".concat(prefix, "_bg_").concat(i));
    preview.style.backgroundImage = bg ? "url('".concat(bg.replace(/'/g, "\\'"), "')") : '';
    var titleColor = resolveColor("".concat(prefix, "_title_color_").concat(i), d.titleColor || '#ffffff');
    var subtitleColor = resolveColor("".concat(prefix, "_subtitle_color_").concat(i), d.subtitleColor || '#ffffff');
    var titleTop = parseFloat((_document$getElementB19 = document.getElementById("".concat(prefix, "_title_top_").concat(i))) === null || _document$getElementB19 === void 0 ? void 0 : _document$getElementB19.value) || d.titleTop || 122;
    var titleLeft = parseFloat((_document$getElementB20 = document.getElementById("".concat(prefix, "_title_left_").concat(i))) === null || _document$getElementB20 === void 0 ? void 0 : _document$getElementB20.value) || d.titleLeft || 70;
    var subtitleLeft = parseFloat((_document$getElementB21 = document.getElementById("".concat(prefix, "_subtitle_left_").concat(i))) === null || _document$getElementB21 === void 0 ? void 0 : _document$getElementB21.value) || d.subtitleLeft || 70;
    if (titleLive) {
      var _document$getElementB22, _document$getElementB23, _document$getElementB24, _document$getElementB25, _document$getElementB26;
      titleLive.textContent = ((_document$getElementB22 = document.getElementById("".concat(prefix, "_title_").concat(i))) === null || _document$getElementB22 === void 0 ? void 0 : _document$getElementB22.value) || '';
      titleLive.style.color = titleColor;
      titleLive.style.top = "calc((".concat(titleTop, " / 420) * 100%)");
      titleLive.style.left = "calc((".concat(titleLeft, " / 1520) * 100%)");
      titleLive.style.maxWidth = "calc(100% - ((".concat(titleLeft, " / 1520) * 100%) - 10px)");
      var titleSize = ((_document$getElementB23 = document.getElementById("".concat(prefix, "_title_size_").concat(i))) === null || _document$getElementB23 === void 0 ? void 0 : _document$getElementB23.value) || '';
      var titleWeight = ((_document$getElementB24 = document.getElementById("".concat(prefix, "_title_weight_").concat(i))) === null || _document$getElementB24 === void 0 ? void 0 : _document$getElementB24.value) || '';
      var titleItalic = ((_document$getElementB25 = document.getElementById("".concat(prefix, "_title_italic_").concat(i))) === null || _document$getElementB25 === void 0 ? void 0 : _document$getElementB25.checked) || false;
      var titleUnderline = ((_document$getElementB26 = document.getElementById("".concat(prefix, "_title_underline_").concat(i))) === null || _document$getElementB26 === void 0 ? void 0 : _document$getElementB26.checked) || false;
      if (titleSize) titleLive.style.fontSize = "calc((".concat(titleSize, " / 1520) * 100cqw)");else titleLive.style.removeProperty('font-size');
      if (titleWeight) titleLive.style.fontWeight = titleWeight;else titleLive.style.removeProperty('font-weight');
      titleLive.style.fontStyle = titleItalic ? 'italic' : '';
      titleLive.style.textDecoration = titleUnderline ? 'underline' : '';
    }
    if (subtitleLive) {
      var _document$getElementB27, _document$getElementB30, _document$getElementB31, _document$getElementB32, _document$getElementB33;
      subtitleLive.textContent = ((_document$getElementB27 = document.getElementById("".concat(prefix, "_subtitle_").concat(i))) === null || _document$getElementB27 === void 0 ? void 0 : _document$getElementB27.value) || '';
      subtitleLive.style.color = subtitleColor;
      subtitleLive.style.left = "calc((".concat(subtitleLeft, " / 1520) * 100%)");
      subtitleLive.style.maxWidth = "calc(100% - ((".concat(subtitleLeft, " / 1520) * 100%) - 10px)");
      if (subtitleUseBottom) {
        var _document$getElementB28;
        var subtitleBottom = parseFloat((_document$getElementB28 = document.getElementById("".concat(prefix, "_subtitle_bottom_").concat(i))) === null || _document$getElementB28 === void 0 ? void 0 : _document$getElementB28.value) || d.subtitleBottom || 40;
        subtitleLive.style.bottom = "calc((".concat(subtitleBottom, " / 420) * 100%)");
        subtitleLive.style.top = 'auto';
      } else {
        var _document$getElementB29;
        var subtitleTop = parseFloat((_document$getElementB29 = document.getElementById("".concat(prefix, "_subtitle_top_").concat(i))) === null || _document$getElementB29 === void 0 ? void 0 : _document$getElementB29.value) || d.subtitleTop || 213;
        subtitleLive.style.top = "calc((".concat(subtitleTop, " / 420) * 100%)");
        subtitleLive.style.bottom = 'auto';
      }
      var subtitleSize = ((_document$getElementB30 = document.getElementById("".concat(prefix, "_subtitle_size_").concat(i))) === null || _document$getElementB30 === void 0 ? void 0 : _document$getElementB30.value) || '';
      var subtitleWeight = ((_document$getElementB31 = document.getElementById("".concat(prefix, "_subtitle_weight_").concat(i))) === null || _document$getElementB31 === void 0 ? void 0 : _document$getElementB31.value) || '';
      var subtitleItalic = ((_document$getElementB32 = document.getElementById("".concat(prefix, "_subtitle_italic_").concat(i))) === null || _document$getElementB32 === void 0 ? void 0 : _document$getElementB32.checked) || false;
      var subtitleUnderline = ((_document$getElementB33 = document.getElementById("".concat(prefix, "_subtitle_underline_").concat(i))) === null || _document$getElementB33 === void 0 ? void 0 : _document$getElementB33.checked) || false;
      if (subtitleSize) subtitleLive.style.fontSize = "calc((".concat(subtitleSize, " / 1520) * 100cqw)");else subtitleLive.style.removeProperty('font-size');
      if (subtitleWeight) subtitleLive.style.fontWeight = subtitleWeight;else subtitleLive.style.removeProperty('font-weight');
      subtitleLive.style.fontStyle = subtitleItalic ? 'italic' : '';
      subtitleLive.style.textDecoration = subtitleUnderline ? 'underline' : '';
    }
  }
  function wireSlideLivePreview(i, config) {
    var prefix = config.prefix,
      subtitleUseBottom = config.subtitleUseBottom;
    var titleOffsetId = "".concat(prefix, "_title_top_").concat(i);
    var titleLeftId = "".concat(prefix, "_title_left_").concat(i);
    var subtitleOffsetId = subtitleUseBottom ? "".concat(prefix, "_subtitle_bottom_").concat(i) : "".concat(prefix, "_subtitle_top_").concat(i);
    ['title', 'subtitle'].forEach(function (field) {
      var input = document.getElementById("".concat(prefix, "_").concat(field, "_").concat(i));
      var colorId = "".concat(prefix, "_").concat(field, "_color_").concat(i);
      var size = document.getElementById("".concat(prefix, "_").concat(field, "_size_").concat(i));
      var weight = document.getElementById("".concat(prefix, "_").concat(field, "_weight_").concat(i));
      var italic = document.getElementById("".concat(prefix, "_").concat(field, "_italic_").concat(i));
      var underline = document.getElementById("".concat(prefix, "_").concat(field, "_underline_").concat(i));
      var refresh = function refresh() {
        return applySlidePreviewStyles(i, config);
      };
      if (input) input.addEventListener('input', refresh);
      wireColorField(colorId, refresh);
      if (size) size.addEventListener('input', refresh);
      if (weight) weight.addEventListener('change', refresh);
      if (italic) italic.addEventListener('change', refresh);
      if (underline) underline.addEventListener('change', refresh);
    });
    [titleOffsetId, titleLeftId, "".concat(prefix, "_subtitle_left_").concat(i), subtitleOffsetId].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () {
        return applySlidePreviewStyles(i, config);
      });
    });
  }
  function render(container, slides, config, setImageUploadState) {
    if (!container) return;
    container.innerHTML = '';
    (slides || []).forEach(function (slide, i) {
      container.insertAdjacentHTML('beforeend', slideHtml(slide, i, config));
      if (typeof setImageUploadState === 'function') {
        setImageUploadState("".concat(config.prefix, "_bg_").concat(i), slide.background || '');
      }
      wireSlideLivePreview(i, config);
      applySlidePreviewStyles(i, config);
    });
  }
  function isHeroBgUploadId(uploadId, prefix) {
    return Boolean(uploadId && uploadId.startsWith("".concat(prefix, "_bg_")));
  }
  window.AdminHeroSlides = {
    MAX: MAX,
    render: render,
    collect: collect,
    isHeroBgUploadId: isHeroBgUploadId,
    readImageVal: readImageVal,
    applySlidePreviewStyles: applySlidePreviewStyles,
    wireSlideLivePreview: wireSlideLivePreview
  };
})();