function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
 * Редактор страницы Документы для admin.html
 */
(function (_window$KnowledgeCont) {
  'use strict';

  var DEFAULT_KNOWLEDGE_PAGE = ((_window$KnowledgeCont = window.KnowledgeContent) === null || _window$KnowledgeCont === void 0 ? void 0 : _window$KnowledgeCont.DEFAULT_KNOWLEDGE_PAGE) || {
    hero: {
      background: '',
      title: '',
      subtitle: '',
      titleColor: '#575B6D',
      titleTop: 122,
      titleLeft: 70,
      subtitleColor: '#FFFFFF',
      subtitleTop: 213,
      subtitleLeft: 70
    },
    blocks: []
  };
  var expandedAdminGroups = new Set();
  function escapeAttr(s) {
    return String(s !== null && s !== void 0 ? s : '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }
  function migrateKnowledgePageData(raw) {
    var _window$KnowledgeCont2;
    if ((_window$KnowledgeCont2 = window.KnowledgeContent) !== null && _window$KnowledgeCont2 !== void 0 && _window$KnowledgeCont2.migrateKnowledgePageData) {
      return window.KnowledgeContent.migrateKnowledgePageData(raw);
    }
    return _objectSpread(_objectSpread({}, DEFAULT_KNOWLEDGE_PAGE), raw || {});
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
    if (id === 'knowledge_hero_bg') {
      var livePreview = document.getElementById('knowledge_hero_live_preview');
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
    return "\n      <div class=\"form-group hero-slide-upload-group\" style=\"margin-bottom:0;\">\n        <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;\">\n          <label style=\"margin-bottom:0;\">".concat(label, "</label>\n          <div class=\"hero-slide-upload-actions image-upload-mini\" data-upload-id=\"").concat(id, "\" style=\"display:flex; gap:8px;\">\n            <button type=\"button\" class=\"btn-save\" style=\"padding:6px 12px;font-size:0.8rem;\" onclick=\"AdminKnowledge.pickImage('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>\n            <button type=\"button\" class=\"btn-delete\" style=\"padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;\" id=\"").concat(id, "_clear\" onclick=\"AdminKnowledge.clearImage('").concat(id, "')\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n            <input type=\"hidden\" id=\"").concat(id, "_val\" value=\"\">\n          </div>\n        </div>\n        <div class=\"hero-slide-frame hero-slide-frame--empty\" data-upload-frame-for=\"").concat(id, "\">\n          <span class=\"hero-slide-frame__empty\">").concat(sizeLabel, "</span>\n          <img id=\"").concat(id, "_preview\" class=\"hero-slide-frame__img\" src=\"\" alt=\"\">\n        </div>\n      </div>");
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
  function fileUploadRow(id, label, value, fileName) {
    var shownName = fileName || (value ? value.split('/').pop() : '');
    return "\n      <div class=\"form-group\" style=\"margin-bottom: 0;\">\n        <label>".concat(label, "</label>\n        <div style=\"display:flex;gap:8px;flex-wrap:wrap;align-items:center;\">\n          <input type=\"text\" class=\"form-control\" id=\"").concat(id, "\" value=\"").concat(escapeAttr(value), "\" placeholder=\"\u0421\u0441\u044B\u043B\u043A\u0430 \u0438\u043B\u0438 uploads/files/...\" style=\"flex:1; margin-bottom:0;\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:8px 14px;font-size:0.85rem;\" onclick=\"AdminKnowledge.pickFile('").concat(id, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u0430\u0439\u043B</button>\n        </div>\n        <small id=\"").concat(id, "_name\" style=\"display:").concat(shownName ? 'inline' : 'none', ";color:var(--text-secondary);margin-top:6px;display:block;\">").concat(escapeAttr(shownName), "</small>\n      </div>");
  }
  function isDescendantPath(ancestorPathStr, pathStr) {
    if (!ancestorPathStr) return false;
    return pathStr === ancestorPathStr || pathStr.startsWith("".concat(ancestorPathStr, "."));
  }
  function collectGroupTargets(blocks) {
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var excludePathStr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    (blocks || []).forEach(function (block, i) {
      var currentPath = [].concat(_toConsumableArray(path), [i]);
      var pathStr = pathToString(currentPath);
      if (block.type === 'group' && pathStr !== excludePathStr && !isDescendantPath(excludePathStr, pathStr)) {
        var prefix = path.length ? "".concat('— '.repeat(path.length)) : '';
        options.push({
          pathStr: pathStr,
          label: "".concat(prefix).concat(block.value || 'Группа без названия')
        });
        collectGroupTargets(block.children || [], currentPath, excludePathStr, options);
      }
    });
    return options;
  }
  function renderMoveToGroupControl(pathStr, blockId) {
    var _window$knowledgePage;
    var groupTargets = collectGroupTargets(((_window$knowledgePage = window.knowledgePageData) === null || _window$knowledgePage === void 0 ? void 0 : _window$knowledgePage.blocks) || [], [], pathStr);
    if (!groupTargets.length) return '';
    var selectId = "knowledge_move_target_".concat(blockId);
    return "\n      <div class=\"knowledge-move-to-group\">\n        <select id=\"".concat(selectId, "\" class=\"knowledge-move-to-group__select\" title=\"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u0440\u0443\u043F\u043F\u0443\">\n          <option value=\"\">\u0412 \u0433\u0440\u0443\u043F\u043F\u0443\u2026</option>\n          ").concat(groupTargets.map(function (g) {
      return "<option value=\"".concat(escapeAttr(g.pathStr), "\">").concat(escapeHtml(g.label), "</option>");
    }).join(''), "\n        </select>\n        <button type=\"button\" class=\"btn-save knowledge-move-to-group__btn\" title=\"\u041F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0432 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u0443\u044E \u0433\u0440\u0443\u043F\u043F\u0443\" onclick=\"AdminKnowledge.moveBlockToGroup('").concat(pathStr, "', document.getElementById('").concat(selectId, "').value)\">\u2192</button>\n      </div>");
  }
  function escapeHtml(s) {
    return escapeAttr(s);
  }
  function renderHeroAdmin(data) {
    var el = document.getElementById('knowledgeHeroAdmin');
    if (!el) return;
    var hero = migrateKnowledgePageData(data).hero || {};
    el.innerHTML = "\n      <div class=\"obuchenie-hero-grid\">\n        <!-- Left: Banner upload & Preview -->\n        <div class=\"obuchenie-hero-banner-col\">\n          ".concat(heroBgUploadShell('knowledge_hero_bg', 'Готовый баннер (~1520×420 px)'), "\n          \n          <div style=\"margin-top:20px;\">\n            <label style=\"font-weight:600; display:block; margin-bottom:8px; font-size:0.9rem; color:var(--text-secondary);\">\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0433\u043E\u0442\u043E\u0432\u043E\u0433\u043E \u0431\u0430\u043D\u043D\u0435\u0440\u0430 \u0441 \u043D\u0430\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u043C \u0442\u0435\u043A\u0441\u0442\u043E\u043C</label>\n            <div class=\"ecp-live-banner-preview\" id=\"knowledge_hero_live_preview\">\n              <div class=\"live-banner-title\" id=\"knowledge_hero_live_title\">").concat(escapeAttr(hero.title), "</div>\n              <div class=\"live-banner-subtitle\" id=\"knowledge_hero_live_subtitle\">").concat(escapeAttr(hero.subtitle), "</div>\n            </div>\n          </div>\n        </div>\n        \n        <!-- Right: Fields -->\n        <div class=\"obuchenie-hero-fields-col\" style=\"display:flex; flex-direction:column; gap:20px;\">\n          <!-- Block \"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A\" -->\n          <div class=\"obuchenie-hero-block\" style=\"border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);\">\n            ").concat(blockHeaderWithColorHtml('Заголовок (Enter — перенос строки)', 'knowledge_hero_title_color', hero.titleColor, '#575B6D', hero.titleFontSize, hero.titleFontWeight, hero.titleItalic, hero.titleUnderline), "\n            <div class=\"form-group\" style=\"margin-bottom:0; margin-top:8px;\">\n              <textarea class=\"form-control\" id=\"knowledge_hero_title\" rows=\"2\" placeholder=\"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0431\u0430\u043D\u043D\u0435\u0440\u0430 (Enter \u2014 \u043F\u0435\u0440\u0435\u043D\u043E\u0441 \u0441\u0442\u0440\u043E\u043A\u0438)\">").concat(escapeAttr(hero.title), "</textarea>\n            </div>\n            <div style=\"display:flex; gap:16px; margin-top:12px;\">\n              <div style=\"flex:1; margin-bottom:0;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u0432\u0435\u0440\u0445\u0443 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"knowledge_hero_title_top\" value=\"").concat(hero.titleTop !== undefined ? hero.titleTop : 122, "\" style=\"padding:6px 10px; font-size:0.85rem; margin-bottom:0;\">\n              </div>\n              <div style=\"flex:1; margin-bottom:0;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"knowledge_hero_title_left\" value=\"").concat(hero.titleLeft !== undefined ? hero.titleLeft : 70, "\" style=\"padding:6px 10px; font-size:0.85rem; margin-bottom:0;\">\n              </div>\n            </div>\n          </div>\n          \n          <!-- Block \"\u0422\u0435\u043A\u0441\u0442\" -->\n          <div class=\"obuchenie-hero-block\" style=\"border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);\">\n            ").concat(blockHeaderWithColorHtml('Текст', 'knowledge_hero_subtitle_color', hero.subtitleColor, '#FFFFFF', hero.subtitleFontSize, hero.subtitleFontWeight, hero.subtitleItalic, hero.subtitleUnderline), "\n            <div class=\"form-group\" style=\"margin-bottom:0; margin-top:8px;\">\n              <textarea class=\"form-control\" id=\"knowledge_hero_subtitle\" rows=\"3\" placeholder=\"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435/\u0442\u0435\u043A\u0441\u0442 \u043F\u043E\u0434 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u043C\">").concat(escapeAttr(hero.subtitle), "</textarea>\n            </div>\n            <div style=\"display:flex; gap:16px; margin-top:12px;\">\n              <div style=\"flex:1; margin-bottom:0;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u0432\u0435\u0440\u0445\u0443 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"knowledge_hero_subtitle_top\" value=\"").concat(hero.subtitleTop !== undefined ? hero.subtitleTop : 213, "\" style=\"padding:6px 10px; font-size:0.85rem; margin-bottom:0;\">\n              </div>\n              <div style=\"flex:1; margin-bottom:0;\" class=\"form-group\">\n                <label style=\"font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;\">\u041E\u0442\u0441\u0442\u0443\u043F \u0441\u043B\u0435\u0432\u0430 (px)</label>\n                <input type=\"number\" class=\"form-control\" id=\"knowledge_hero_subtitle_left\" value=\"").concat(hero.subtitleLeft !== undefined ? hero.subtitleLeft : 70, "\" style=\"padding:6px 10px; font-size:0.85rem; margin-bottom:0;\">\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    ");
    ['title', 'subtitle'].forEach(function (field) {
      var input = document.getElementById("knowledge_hero_".concat(field));
      var color = document.getElementById("knowledge_hero_".concat(field, "_color"));
      var colorPicker = document.getElementById("knowledge_hero_".concat(field, "_color_picker"));
      var top = document.getElementById("knowledge_hero_".concat(field, "_top"));
      var left = document.getElementById("knowledge_hero_".concat(field, "_left"));
      var live = document.getElementById("knowledge_hero_live_".concat(field));
      var size = document.getElementById("knowledge_hero_".concat(field, "_size"));
      var weight = document.getElementById("knowledge_hero_".concat(field, "_weight"));
      var italic = document.getElementById("knowledge_hero_".concat(field, "_italic"));
      var underline = document.getElementById("knowledge_hero_".concat(field, "_underline"));
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
    setImageUploadState('knowledge_hero_bg', hero.background);
    var liveTitle = document.getElementById('knowledge_hero_live_title');
    if (liveTitle) {
      liveTitle.style.color = hero.titleColor || '#575B6D';
      liveTitle.style.top = "".concat((hero.titleTop !== undefined ? hero.titleTop : 122) / 420 * 100, "%");
      liveTitle.style.left = "".concat((hero.titleLeft !== undefined ? hero.titleLeft : 70) / 1520 * 100, "%");
      if (hero.titleFontSize) liveTitle.style.fontSize = "calc((".concat(hero.titleFontSize, " / 1520) * 100cqw)");
      if (hero.titleFontWeight) liveTitle.style.fontWeight = hero.titleFontWeight;
      if (hero.titleItalic) liveTitle.style.fontStyle = 'italic';
      if (hero.titleUnderline) liveTitle.style.textDecoration = 'underline';
    }
    var liveSubtitle = document.getElementById('knowledge_hero_live_subtitle');
    if (liveSubtitle) {
      liveSubtitle.style.color = hero.subtitleColor || '#FFFFFF';
      liveSubtitle.style.top = "".concat((hero.subtitleTop !== undefined ? hero.subtitleTop : 213) / 420 * 100, "%");
      liveSubtitle.style.left = "".concat((hero.subtitleLeft !== undefined ? hero.subtitleLeft : 70) / 1520 * 100, "%");
      if (hero.subtitleFontSize) liveSubtitle.style.fontSize = "calc((".concat(hero.subtitleFontSize, " / 1520) * 100cqw)");
      if (hero.subtitleFontWeight) liveSubtitle.style.fontWeight = hero.subtitleFontWeight;
      if (hero.subtitleItalic) liveSubtitle.style.fontStyle = 'italic';
      if (hero.subtitleUnderline) liveSubtitle.style.textDecoration = 'underline';
    }
  }
  function createKnowledgeBlock(type) {
    var id = "block_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 7));
    if (type === 'group') {
      return {
        id: id,
        type: 'group',
        value: '',
        defaultExpanded: false,
        children: []
      };
    }
    if (type === 'file') {
      return {
        id: id,
        type: 'file',
        title: '',
        file: '',
        fileName: ''
      };
    }
    return {
      id: id,
      type: type,
      value: ''
    };
  }
  function parseBlockPath(pathStr) {
    if (!pathStr && pathStr !== 0) return [];
    return String(pathStr).split('.').map(function (part) {
      return parseInt(part, 10);
    });
  }
  function pathToString(path) {
    return path.join('.');
  }
  function resolveBlockPath(blocks, path) {
    if (!path.length) return null;
    var list = blocks;
    for (var i = 0; i < path.length - 1; i++) {
      var block = list[path[i]];
      if (!block || block.type !== 'group' || !Array.isArray(block.children)) return null;
      list = block.children;
    }
    var index = path[path.length - 1];
    return {
      list: list,
      index: index,
      block: list[index]
    };
  }
  function collectBlockFromDom(block) {
    var result = {
      id: block.id,
      type: block.type
    };
    if (block.type === 'header' || block.type === 'text' || block.type === 'group') {
      var _document$getElementB;
      result.value = ((_document$getElementB = document.getElementById("knowledge_block_val_".concat(block.id))) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value) || '';
    }
    if (block.type === 'group') {
      var _document$getElementB2;
      result.defaultExpanded = ((_document$getElementB2 = document.getElementById("knowledge_block_expanded_".concat(block.id))) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.checked) || false;
      result.children = (block.children || []).map(collectBlockFromDom);
    }
    if (block.type === 'file') {
      var _document$getElementB3, _document$getElementB4;
      var fileId = "knowledge_block_file_".concat(block.id);
      result.title = ((_document$getElementB3 = document.getElementById("knowledge_block_title_".concat(block.id))) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.value) || '';
      result.file = ((_document$getElementB4 = document.getElementById(fileId)) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value) || '';
      var label = document.getElementById("".concat(fileId, "_name"));
      result.fileName = label ? label.textContent.trim() : result.file ? result.file.split('/').pop() : '';
    }
    return result;
  }
  function renderBlockFields(block) {
    var blockId = block.id;
    if (block.type === 'group') {
      var children = block.children || [];
      var pathStr = block._pathStr || '';
      return "\n        <div class=\"form-group\" style=\"margin-bottom:12px;\">\n          <label>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B</label>\n          <input type=\"text\" class=\"form-control\" id=\"knowledge_block_val_".concat(blockId, "\" value=\"").concat(escapeAttr(block.value), "\" placeholder=\"\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u0420\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B\">\n        </div>\n        <label style=\"display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px;cursor:pointer;\">\n          <input type=\"checkbox\" id=\"knowledge_block_expanded_").concat(blockId, "\" ").concat(block.defaultExpanded ? 'checked' : '', ">\n          \u041E\u0442\u043A\u0440\u044B\u0442\u0430 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u043D\u0430 \u0441\u0430\u0439\u0442\u0435\n        </label>\n        <div style=\"display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;\">\n          <button type=\"button\" class=\"btn-save\" style=\"padding:4px 10px;font-size:0.75rem;\" onclick=\"AdminKnowledge.addChildBlock('").concat(pathStr, "', 'header')\">+ \u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A</button>\n          <button type=\"button\" class=\"btn-save\" style=\"padding:4px 10px;font-size:0.75rem;\" onclick=\"AdminKnowledge.addChildBlock('").concat(pathStr, "', 'text')\">+ \u0422\u0435\u043A\u0441\u0442</button>\n          <button type=\"button\" class=\"btn-save\" style=\"padding:4px 10px;font-size:0.75rem;\" onclick=\"AdminKnowledge.addChildBlock('").concat(pathStr, "', 'file')\">+ \u0424\u0430\u0439\u043B</button>\n          <button type=\"button\" class=\"btn-save\" style=\"padding:4px 10px;font-size:0.75rem;\" onclick=\"AdminKnowledge.addChildBlock('").concat(pathStr, "', 'group')\">+ \u0413\u0440\u0443\u043F\u043F\u0430</button>\n        </div>\n        <div class=\"knowledge-admin-tree-children\">\n          ").concat(children.length ? children.map(function (child, childIndex) {
        return renderBlockAdminCard(child, [].concat(_toConsumableArray(block._path || []), [childIndex]));
      }).join('') : '<p style="color:var(--text-secondary);font-size:0.85rem;margin:0;padding:8px 0;">Внутри группы пока нет элементов.</p>', "\n        </div>");
    }
    return '';
  }
  function renderCompactBlockContent(block) {
    var blockId = block.id;
    if (block.type === 'header') {
      return {
        fields: "<input type=\"text\" class=\"form-control knowledge-inline-field\" id=\"knowledge_block_val_".concat(blockId, "\" value=\"").concat(escapeAttr(block.value), "\" placeholder=\"\u0422\u0435\u043A\u0441\u0442 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430\">"),
        footer: ''
      };
    }
    if (block.type === 'text') {
      return {
        fields: "<textarea class=\"form-control knowledge-inline-field knowledge-inline-field--textarea\" id=\"knowledge_block_val_".concat(blockId, "\" rows=\"2\" placeholder=\"\u0421\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0442\u0435\u043A\u0441\u0442\u0430...\">").concat(escapeAttr(block.value), "</textarea>"),
        footer: ''
      };
    }
    if (block.type === 'file') {
      var fileId = "knowledge_block_file_".concat(blockId);
      var shownName = block.fileName || (block.file ? block.file.split('/').pop() : '');
      return {
        fields: "\n          <input type=\"text\" class=\"form-control knowledge-inline-field knowledge-inline-field--title\" id=\"knowledge_block_title_".concat(blockId, "\" value=\"").concat(escapeAttr(block.title), "\" placeholder=\"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\" title=\"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\">\n          <input type=\"text\" class=\"form-control knowledge-inline-field knowledge-inline-field--file\" id=\"").concat(fileId, "\" value=\"").concat(escapeAttr(block.file), "\" placeholder=\"\u0421\u0441\u044B\u043B\u043A\u0430 \u0438\u043B\u0438 uploads/files/...\" title=\"\u0424\u0430\u0439\u043B \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\">\n          <button type=\"button\" class=\"btn-save knowledge-inline-upload-btn\" onclick=\"AdminKnowledge.pickFile('").concat(fileId, "')\">\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C</button>"),
        footer: "<small id=\"".concat(fileId, "_name\" class=\"knowledge-inline-file-name\" style=\"display:").concat(shownName ? 'block' : 'none', ";\">").concat(escapeAttr(shownName), "</small>")
      };
    }
    return {
      fields: '',
      footer: ''
    };
  }
  function getBlockMeta(block) {
    if (block.type === 'header') return {
      label: 'Заголовок',
      color: '#00AE4D'
    };
    if (block.type === 'text') return {
      label: 'Текст',
      color: '#3a86ff'
    };
    if (block.type === 'file') return {
      label: 'Документ',
      color: '#f72585'
    };
    if (block.type === 'group') return {
      label: 'Группа',
      color: '#8338ec'
    };
    return {
      label: block.type,
      color: 'var(--text-secondary)'
    };
  }
  function isGroupExpandedInAdmin(blockId) {
    return expandedAdminGroups.has(blockId);
  }
  function renderBlockAdminCard(block, path) {
    var _window$knowledgePage2, _resolved$index;
    var pathStr = pathToString(path);
    var resolved = resolveBlockPath(((_window$knowledgePage2 = window.knowledgePageData) === null || _window$knowledgePage2 === void 0 ? void 0 : _window$knowledgePage2.blocks) || [], path);
    var siblings = (resolved === null || resolved === void 0 ? void 0 : resolved.list) || [];
    var index = (_resolved$index = resolved === null || resolved === void 0 ? void 0 : resolved.index) !== null && _resolved$index !== void 0 ? _resolved$index : 0;
    var canUnnest = path.length > 1;
    var isGroup = block.type === 'group';
    var depth = Math.max(0, path.length - 1);
    var isExpanded = !isGroup || isGroupExpandedInAdmin(block.id);
    var childCount = isGroup ? (block.children || []).length : 0;
    var cardClass = isGroup ? "admin-subcard knowledge-admin-block-card knowledge-admin-block-card--group".concat(isExpanded ? '' : ' knowledge-admin-block-card--group-collapsed') : 'admin-subcard knowledge-admin-block-card';
    var nodeClass = isGroup && depth === 0 ? 'knowledge-admin-tree-node knowledge-admin-tree-node--group-root' : 'knowledge-admin-tree-node';
    block._path = path;
    block._pathStr = pathStr;
    var meta = getBlockMeta(block);
    var upDisabled = index === 0 ? 'disabled' : '';
    var downDisabled = index >= siblings.length - 1 ? 'disabled' : '';
    var controlsHtml = "\n      <div class=\"knowledge-admin-block-card__controls\">\n        <button type=\"button\" class=\"btn-save knowledge-block-btn\" title=\"\u0412\u044B\u0448\u0435\" ".concat(upDisabled, " onclick=\"AdminKnowledge.moveBlockUp('").concat(pathStr, "')\">\u25B2</button>\n        <button type=\"button\" class=\"btn-save knowledge-block-btn\" title=\"\u041D\u0438\u0436\u0435\" ").concat(downDisabled, " onclick=\"AdminKnowledge.moveBlockDown('").concat(pathStr, "')\">\u25BC</button>\n        ").concat(renderMoveToGroupControl(pathStr, block.id), "\n        ").concat(canUnnest ? "<button type=\"button\" class=\"btn-save knowledge-block-btn\" title=\"\u0412\u044B\u043D\u0435\u0441\u0442\u0438 \u0438\u0437 \u0433\u0440\u0443\u043F\u043F\u044B\" onclick=\"AdminKnowledge.unnestBlock('".concat(pathStr, "')\">\u2190</button>") : '', "\n        <button type=\"button\" class=\"btn-delete knowledge-block-btn\" title=\"\u0423\u0434\u0430\u043B\u0438\u0442\u044C\" onclick=\"AdminKnowledge.removeBlock('").concat(pathStr, "')\">\xD7</button>\n      </div>");
    var headerHtml = isGroup ? "\n          <div class=\"knowledge-admin-block-card__header\">\n            <div class=\"knowledge-admin-block-card__lead\">\n              <button type=\"button\" class=\"knowledge-group-collapse-btn\" aria-expanded=\"".concat(isExpanded ? 'true' : 'false', "\" title=\"").concat(isExpanded ? 'Свернуть группу' : 'Развернуть группу', "\" onclick=\"AdminKnowledge.toggleGroupCollapsed('").concat(block.id, "')\">").concat(isExpanded ? '▼' : '▶', "</button>\n              <span class=\"block-badge\" style=\"background:").concat(meta.color, "; color:#fff; padding:3px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; cursor:pointer; user-select:none;\" onclick=\"AdminKnowledge.toggleGroupCollapsed('").concat(block.id, "')\">").concat(meta.label, "</span>\n              ").concat(!isExpanded ? "<span class=\"knowledge-group-summary\">".concat(escapeAttr(block.value || 'Без названия'), "</span>") : '', "\n              ").concat(!isExpanded ? "<span class=\"knowledge-group-count\">".concat(childCount, " \u044D\u043B.</span>") : '', "\n            </div>\n            ").concat(controlsHtml, "\n          </div>\n          <div class=\"knowledge-admin-block-card__body\"").concat(isExpanded ? '' : ' hidden', ">\n            ").concat(renderBlockFields(block), "\n          </div>") : function () {
      var compact = renderCompactBlockContent(block);
      return "\n          <div class=\"knowledge-admin-block-card__toolbar knowledge-admin-block-card__toolbar--".concat(block.type, "\">\n            <span class=\"block-badge\" style=\"background:").concat(meta.color, "; color:#fff; padding:3px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold;\">").concat(meta.label, "</span>\n            ").concat(compact.fields, "\n            ").concat(controlsHtml, "\n          </div>\n          ").concat(compact.footer);
    }();
    var cardClassFinal = isGroup ? cardClass : "admin-subcard knowledge-admin-block-card knowledge-admin-block-card--compact knowledge-admin-block-card--".concat(block.type);
    return "\n      <div class=\"".concat(nodeClass, "\" data-block-path=\"").concat(pathStr, "\">\n        <div class=\"").concat(isGroup ? cardClass : cardClassFinal, "\">\n          ").concat(headerHtml, "\n        </div>\n      </div>");
  }
  function renderBlocksAdmin(data) {
    var el = document.getElementById('knowledgeBlocksAdmin');
    if (!el) return;
    var list = data.blocks || [];
    if (list.length === 0) {
      el.innerHTML = "<div style=\"text-align:center; padding:30px; border:2px dashed var(--card-border); border-radius:12px; color:var(--text-secondary);\">\u041D\u0435\u0442 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0445 \u0431\u043B\u043E\u043A\u043E\u0432. \u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043A\u043D\u043E\u043F\u043A\u0438 \u0432\u044B\u0448\u0435, \u0447\u0442\u043E\u0431\u044B \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A, \u0442\u0435\u043A\u0441\u0442, \u0433\u0440\u0443\u043F\u043F\u0443 \u0438\u043B\u0438 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442.</div>";
      return;
    }
    el.innerHTML = list.map(function (block, i) {
      return renderBlockAdminCard(block, [i]);
    }).join('');
  }
  function renderKnowledgePageAdmin(data) {
    renderHeroAdmin(data);
    renderBlocksAdmin(data);
  }
  function readImageVal(id) {
    var _document$getElementB5;
    return ((_document$getElementB5 = document.getElementById("".concat(id, "_val"))) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.value) || '';
  }
  function collectKnowledgePageFromForm(existing) {
    var _ref, _document$getElementB6, _document$getElementB7, _ref2, _document$getElementB8, _document$getElementB9, _document$getElementB0, _document$getElementB1, _document$getElementB10, _document$getElementB11, _document$getElementB12, _document$getElementB13, _ref3, _document$getElementB14, _document$getElementB15, _ref4, _document$getElementB16, _document$getElementB17, _document$getElementB18, _document$getElementB19, _document$getElementB20, _document$getElementB21, _document$getElementB22, _document$getElementB23;
    var data = migrateKnowledgePageData(existing || window.knowledgePageData || {});
    var hero = data.hero || {};
    data.hero = {
      background: readImageVal('knowledge_hero_bg') || hero.background || '',
      title: (_ref = (_document$getElementB6 = (_document$getElementB7 = document.getElementById('knowledge_hero_title')) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.value) !== null && _document$getElementB6 !== void 0 ? _document$getElementB6 : hero.title) !== null && _ref !== void 0 ? _ref : '',
      titleColor: (_ref2 = (_document$getElementB8 = (_document$getElementB9 = document.getElementById('knowledge_hero_title_color')) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.value) !== null && _document$getElementB8 !== void 0 ? _document$getElementB8 : hero.titleColor) !== null && _ref2 !== void 0 ? _ref2 : '#575B6D',
      titleTop: parseInt(((_document$getElementB0 = document.getElementById('knowledge_hero_title_top')) === null || _document$getElementB0 === void 0 ? void 0 : _document$getElementB0.value) || 122, 10),
      titleLeft: parseInt(((_document$getElementB1 = document.getElementById('knowledge_hero_title_left')) === null || _document$getElementB1 === void 0 ? void 0 : _document$getElementB1.value) || 70, 10),
      titleFontSize: ((_document$getElementB10 = document.getElementById('knowledge_hero_title_size')) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.value) || '',
      titleFontWeight: ((_document$getElementB11 = document.getElementById('knowledge_hero_title_weight')) === null || _document$getElementB11 === void 0 ? void 0 : _document$getElementB11.value) || '',
      titleItalic: ((_document$getElementB12 = document.getElementById('knowledge_hero_title_italic')) === null || _document$getElementB12 === void 0 ? void 0 : _document$getElementB12.checked) || false,
      titleUnderline: ((_document$getElementB13 = document.getElementById('knowledge_hero_title_underline')) === null || _document$getElementB13 === void 0 ? void 0 : _document$getElementB13.checked) || false,
      subtitle: (_ref3 = (_document$getElementB14 = (_document$getElementB15 = document.getElementById('knowledge_hero_subtitle')) === null || _document$getElementB15 === void 0 ? void 0 : _document$getElementB15.value) !== null && _document$getElementB14 !== void 0 ? _document$getElementB14 : hero.subtitle) !== null && _ref3 !== void 0 ? _ref3 : '',
      subtitleColor: (_ref4 = (_document$getElementB16 = (_document$getElementB17 = document.getElementById('knowledge_hero_subtitle_color')) === null || _document$getElementB17 === void 0 ? void 0 : _document$getElementB17.value) !== null && _document$getElementB16 !== void 0 ? _document$getElementB16 : hero.subtitleColor) !== null && _ref4 !== void 0 ? _ref4 : '#FFFFFF',
      subtitleTop: parseInt(((_document$getElementB18 = document.getElementById('knowledge_hero_subtitle_top')) === null || _document$getElementB18 === void 0 ? void 0 : _document$getElementB18.value) || 213, 10),
      subtitleLeft: parseInt(((_document$getElementB19 = document.getElementById('knowledge_hero_subtitle_left')) === null || _document$getElementB19 === void 0 ? void 0 : _document$getElementB19.value) || 70, 10),
      subtitleFontSize: ((_document$getElementB20 = document.getElementById('knowledge_hero_subtitle_size')) === null || _document$getElementB20 === void 0 ? void 0 : _document$getElementB20.value) || '',
      subtitleFontWeight: ((_document$getElementB21 = document.getElementById('knowledge_hero_subtitle_weight')) === null || _document$getElementB21 === void 0 ? void 0 : _document$getElementB21.value) || '',
      subtitleItalic: ((_document$getElementB22 = document.getElementById('knowledge_hero_subtitle_italic')) === null || _document$getElementB22 === void 0 ? void 0 : _document$getElementB22.checked) || false,
      subtitleUnderline: ((_document$getElementB23 = document.getElementById('knowledge_hero_subtitle_underline')) === null || _document$getElementB23 === void 0 ? void 0 : _document$getElementB23.checked) || false
    };
    data.blocks = (data.blocks || []).map(collectBlockFromDom);
    return data;
  }
  function pickImage(uploadId) {
    var _document$getElementB24;
    window.cropTarget = {
      uploadId: uploadId,
      aspect: AdminKnowledge.getAspect(uploadId)
    };
    window.activeAuthorIndex = null;
    window.activeFeatureCardIndex = undefined;
    window.activeAboutImage = false;
    (_document$getElementB24 = document.getElementById('imageInput')) === null || _document$getElementB24 === void 0 || _document$getElementB24.click();
  }
  function pickFile(inputId) {
    var _document$getElementB25;
    window.fileUploadTarget = inputId;
    (_document$getElementB25 = document.getElementById('docFileInput')) === null || _document$getElementB25 === void 0 || _document$getElementB25.click();
  }
  function clearImage(uploadId) {
    setImageUploadState(uploadId, '');
  }
  function applyCroppedImage(uploadId, dataUrl) {
    if (uploadId && uploadId.startsWith('knowledge_')) {
      setImageUploadState(uploadId, dataUrl);
    }
  }
  function getAspect(uploadId) {
    if (uploadId === 'knowledge_hero_bg') return 1520 / 420;
    return 16 / 9;
  }
  function getCropSize(uploadId) {
    if (uploadId === 'knowledge_hero_bg') return [1520, 420];
    return [1200, 675];
  }
  function isKnowledgeUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('knowledge_'));
  }
  window.AdminKnowledge = {
    DEFAULT_KNOWLEDGE_PAGE: DEFAULT_KNOWLEDGE_PAGE,
    migrateKnowledgePageData: migrateKnowledgePageData,
    renderKnowledgePageAdmin: renderKnowledgePageAdmin,
    collectKnowledgePageFromForm: collectKnowledgePageFromForm,
    pickImage: pickImage,
    pickFile: pickFile,
    clearImage: clearImage,
    applyCroppedImage: applyCroppedImage,
    getAspect: getAspect,
    getCropSize: getCropSize,
    isKnowledgeUploadId: isKnowledgeUploadId,
    setFileUploadState: setFileUploadState,
    addHeaderBlock: function addHeaderBlock() {
      var _window$saveKnowledge, _window;
      (_window$saveKnowledge = (_window = window).saveKnowledgePageStateToMemory) === null || _window$saveKnowledge === void 0 || _window$saveKnowledge.call(_window);
      window.knowledgePageData.blocks.push(createKnowledgeBlock('header'));
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    addTextBlock: function addTextBlock() {
      var _window$saveKnowledge2, _window2;
      (_window$saveKnowledge2 = (_window2 = window).saveKnowledgePageStateToMemory) === null || _window$saveKnowledge2 === void 0 || _window$saveKnowledge2.call(_window2);
      window.knowledgePageData.blocks.push(createKnowledgeBlock('text'));
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    addFileBlock: function addFileBlock() {
      var _window$saveKnowledge3, _window3;
      (_window$saveKnowledge3 = (_window3 = window).saveKnowledgePageStateToMemory) === null || _window$saveKnowledge3 === void 0 || _window$saveKnowledge3.call(_window3);
      window.knowledgePageData.blocks.push(createKnowledgeBlock('file'));
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    addGroupBlock: function addGroupBlock() {
      var _window$saveKnowledge4, _window4;
      (_window$saveKnowledge4 = (_window4 = window).saveKnowledgePageStateToMemory) === null || _window$saveKnowledge4 === void 0 || _window$saveKnowledge4.call(_window4);
      window.knowledgePageData.blocks.push(createKnowledgeBlock('group'));
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    toggleGroupCollapsed: function toggleGroupCollapsed(blockId) {
      var _window$saveKnowledge5, _window5;
      (_window$saveKnowledge5 = (_window5 = window).saveKnowledgePageStateToMemory) === null || _window$saveKnowledge5 === void 0 || _window$saveKnowledge5.call(_window5);
      if (expandedAdminGroups.has(blockId)) {
        expandedAdminGroups.delete(blockId);
      } else {
        expandedAdminGroups.add(blockId);
      }
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    addChildBlock: function addChildBlock(parentPathStr, type) {
      var _window$saveKnowledge6, _window6;
      (_window$saveKnowledge6 = (_window6 = window).saveKnowledgePageStateToMemory) === null || _window$saveKnowledge6 === void 0 || _window$saveKnowledge6.call(_window6);
      var path = parseBlockPath(parentPathStr);
      var resolved = resolveBlockPath(window.knowledgePageData.blocks, path);
      if (!(resolved !== null && resolved !== void 0 && resolved.block) || resolved.block.type !== 'group') return;
      if (!Array.isArray(resolved.block.children)) resolved.block.children = [];
      resolved.block.children.push(createKnowledgeBlock(type));
      expandedAdminGroups.add(resolved.block.id);
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    removeBlock: function removeBlock(pathStr) {
      var _window$saveKnowledge7, _window7, _resolved$block;
      (_window$saveKnowledge7 = (_window7 = window).saveKnowledgePageStateToMemory) === null || _window$saveKnowledge7 === void 0 || _window$saveKnowledge7.call(_window7);
      var path = parseBlockPath(pathStr);
      var resolved = resolveBlockPath(window.knowledgePageData.blocks, path);
      if (!resolved) return;
      if (((_resolved$block = resolved.block) === null || _resolved$block === void 0 ? void 0 : _resolved$block.type) === 'group') {
        expandedAdminGroups.delete(resolved.block.id);
      }
      resolved.list.splice(resolved.index, 1);
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    moveBlockUp: function moveBlockUp(pathStr) {
      var _window$saveKnowledge8, _window8;
      (_window$saveKnowledge8 = (_window8 = window).saveKnowledgePageStateToMemory) === null || _window$saveKnowledge8 === void 0 || _window$saveKnowledge8.call(_window8);
      var path = parseBlockPath(pathStr);
      var resolved = resolveBlockPath(window.knowledgePageData.blocks, path);
      if (!resolved || resolved.index <= 0) return;
      var list = resolved.list,
        index = resolved.index;
      var _ref5 = [list[index], list[index - 1]];
      list[index - 1] = _ref5[0];
      list[index] = _ref5[1];
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    moveBlockDown: function moveBlockDown(pathStr) {
      var _window$saveKnowledge9, _window9;
      (_window$saveKnowledge9 = (_window9 = window).saveKnowledgePageStateToMemory) === null || _window$saveKnowledge9 === void 0 || _window$saveKnowledge9.call(_window9);
      var path = parseBlockPath(pathStr);
      var resolved = resolveBlockPath(window.knowledgePageData.blocks, path);
      if (!resolved || resolved.index >= resolved.list.length - 1) return;
      var list = resolved.list,
        index = resolved.index;
      var _ref6 = [list[index], list[index + 1]];
      list[index + 1] = _ref6[0];
      list[index] = _ref6[1];
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    moveBlockToGroup: function moveBlockToGroup(blockPathStr, targetGroupPathStr) {
      var _window$saveKnowledge0, _window0;
      if (!targetGroupPathStr) return;
      (_window$saveKnowledge0 = (_window0 = window).saveKnowledgePageStateToMemory) === null || _window$saveKnowledge0 === void 0 || _window$saveKnowledge0.call(_window0);
      var blockPath = parseBlockPath(blockPathStr);
      var targetPath = parseBlockPath(targetGroupPathStr);
      var blockResolved = resolveBlockPath(window.knowledgePageData.blocks, blockPath);
      var targetResolved = resolveBlockPath(window.knowledgePageData.blocks, targetPath);
      if (!(blockResolved !== null && blockResolved !== void 0 && blockResolved.block) || !(targetResolved !== null && targetResolved !== void 0 && targetResolved.block) || targetResolved.block.type !== 'group') return;
      if (isDescendantPath(blockPathStr, targetGroupPathStr)) return;
      var parentPathStr = pathToString(blockPath.slice(0, -1));
      if (parentPathStr === targetGroupPathStr) return;
      var _blockResolved$list$s = blockResolved.list.splice(blockResolved.index, 1),
        _blockResolved$list$s2 = _slicedToArray(_blockResolved$list$s, 1),
        block = _blockResolved$list$s2[0];
      if (!Array.isArray(targetResolved.block.children)) targetResolved.block.children = [];
      targetResolved.block.children.push(block);
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    nestIntoPreviousGroup: function nestIntoPreviousGroup(pathStr) {
      var _window$saveKnowledge1, _window1;
      (_window$saveKnowledge1 = (_window1 = window).saveKnowledgePageStateToMemory) === null || _window$saveKnowledge1 === void 0 || _window$saveKnowledge1.call(_window1);
      var path = parseBlockPath(pathStr);
      var resolved = resolveBlockPath(window.knowledgePageData.blocks, path);
      if (!resolved || resolved.index <= 0) return;
      var prev = resolved.list[resolved.index - 1];
      if (!prev || prev.type !== 'group') return;
      var _resolved$list$splice = resolved.list.splice(resolved.index, 1),
        _resolved$list$splice2 = _slicedToArray(_resolved$list$splice, 1),
        block = _resolved$list$splice2[0];
      if (!Array.isArray(prev.children)) prev.children = [];
      prev.children.push(block);
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    unnestBlock: function unnestBlock(pathStr) {
      var _window$saveKnowledge10, _window10;
      (_window$saveKnowledge10 = (_window10 = window).saveKnowledgePageStateToMemory) === null || _window$saveKnowledge10 === void 0 || _window$saveKnowledge10.call(_window10);
      var path = parseBlockPath(pathStr);
      if (path.length < 2) return;
      var resolved = resolveBlockPath(window.knowledgePageData.blocks, path);
      if (!resolved) return;
      var parentPath = path.slice(0, -1);
      var parentResolved = resolveBlockPath(window.knowledgePageData.blocks, parentPath);
      if (!(parentResolved !== null && parentResolved !== void 0 && parentResolved.block) || parentResolved.block.type !== 'group') return;
      var _resolved$list$splice3 = resolved.list.splice(resolved.index, 1),
        _resolved$list$splice4 = _slicedToArray(_resolved$list$splice3, 1),
        block = _resolved$list$splice4[0];
      var containerPath = parentPath.slice(0, -1);
      var containerList;
      var insertAfterIndex;
      if (containerPath.length === 0) {
        containerList = window.knowledgePageData.blocks;
        insertAfterIndex = parentPath[0];
      } else {
        var containerResolved = resolveBlockPath(window.knowledgePageData.blocks, containerPath);
        if (!(containerResolved !== null && containerResolved !== void 0 && containerResolved.block) || containerResolved.block.type !== 'group') return;
        containerList = containerResolved.block.children;
        insertAfterIndex = parentPath[parentPath.length - 1];
      }
      containerList.splice(insertAfterIndex + 1, 0, block);
      renderKnowledgePageAdmin(window.knowledgePageData);
    }
  };
})();