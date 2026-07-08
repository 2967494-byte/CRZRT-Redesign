var _document$getElementB, _document$getElementB2;
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// Загрузка настроек с бэкенда (Синхронно)
try {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'api/settings.php', false);
  xhr.send(null);
  if (xhr.status === 200) {
    var data = JSON.parse(xhr.responseText);
    if (!data.error) {
      for (var _i = 0, _Object$entries = Object.entries(data); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
        localStorage.setItem(key, _typeof(value) === 'object' ? JSON.stringify(value) : value);
      }
    }
  }
} catch (e) {
  console.error('DB Sync Error:', e);
}
function safeParseJson(str) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (!str || str === 'undefined' || str === 'null') return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn('JSON parse warning:', e, 'for string:', str);
    return fallback;
  }
}

// Global Variables for Admin Panel
var cropper;
var imageInput, uploadWrapper, imageToCrop, cropperWrapper, cropperActions;
var btnZoomIn, btnZoomOut, btnCrop, btnCancelCrop, croppedResultContainer, croppedResult;
function initUploadElements() {
  imageInput = document.getElementById('imageInput');
  uploadWrapper = document.getElementById('uploadWrapper');
  imageToCrop = document.getElementById('imageToCrop');
  cropperWrapper = document.getElementById('cropperWrapper');
  cropperActions = document.getElementById('cropperActions');
  btnZoomIn = document.getElementById('btnZoomIn');
  btnZoomOut = document.getElementById('btnZoomOut');
  btnCrop = document.getElementById('btnCrop');
  btnCancelCrop = document.getElementById('btnCancelCrop');
  croppedResultContainer = document.getElementById('croppedResultContainer');
  croppedResult = document.getElementById('croppedResult');
  var btnCropperClose = document.getElementById('btnCropperClose');
  if (uploadWrapper && imageInput) {
    uploadWrapper.addEventListener('click', function () {
      return imageInput.click();
    });
  } else {
    console.error("Upload elements NOT found during early init!");
  }
  if (btnCropperClose && btnCancelCrop) {
    btnCropperClose.addEventListener('click', function () {
      return btnCancelCrop.click();
    });
  }
}
function updateSaveButtonsState(options) {
  var buttons = [document.getElementById('globalSaveBtn')].concat(_toConsumableArray(document.querySelectorAll('.btn-save-bottom'))).filter(Boolean);
  buttons.forEach(function (btn) {
    if (options.text !== undefined) btn.innerText = options.text;
    if (options.disabled !== undefined) {
      btn.disabled = options.disabled;
      if (options.disabled) {
        btn.setAttribute('disabled', 'disabled');
      } else {
        btn.removeAttribute('disabled');
      }
    }
    if (options.opacity !== undefined) btn.style.opacity = options.opacity;
    if (options.boxShadow !== undefined) btn.style.boxShadow = options.boxShadow;
    if (options.backgroundColor !== undefined) btn.style.backgroundColor = options.backgroundColor;
    if (options.color !== undefined) btn.style.color = options.color;
  });
}

// Theme Toggle for Admin
var themeBtn = document.getElementById('theme-toggle-admin');
var root = document.documentElement;
var iconSun = document.querySelector('.icon-sun');
var iconMoon = document.querySelector('.icon-moon');

// Initial theme logic borrowed from index.html (implicitly)
if (localStorage.getItem('theme') === 'light') {
  root.setAttribute('data-theme', 'light');
  iconSun.style.display = 'none';
  iconMoon.style.display = 'block';
}
themeBtn.addEventListener('click', function () {
  var currentTheme = root.getAttribute('data-theme');
  if (currentTheme === 'light') {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
    iconSun.style.display = 'block';
    iconMoon.style.display = 'none';
  } else {
    root.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
  }
});

// Initialize upload elements immediately
initUploadElements();

// User & Role Management Logic
var defaultUsers = {
  'admin@crzrt.ru': {
    password: 'admin',
    name: 'Администратор',
    permissions: ['superuser']
  },
  'main@crzrt.ru': {
    password: 'password',
    name: 'Редактор Сайта',
    permissions: ['main-page']
  },
  'users@crzrt.ru': {
    password: 'password',
    name: 'Менеджер Кадров',
    permissions: ['users']
  }
};
var usersDb = safeParseJson(localStorage.getItem('crzrt_users'));
var defaultMainData = AdminLanding.DEFAULT_LANDING_MAIN;
var defaultAboutData = {
  heroTitle: 'Профессионализм и Опыт',
  heroSubtitle: 'Центр развития закупок — ваш надежный партнер в мире тендеров.',
  mainTitle: 'О нас',
  p1: 'Акционерное общество «Центр развития закупок Республики Татарстан» является подведомственной организацией Государственного комитета Республики Татарстан по закупкам.',
  p2: 'Наш офис расположен в самом сердце Казани, на улице Петербургская 86. Мы объединяем экспертов с многолетним опытом работы в сфере государственного заказа.',
  services: 'Сопровождение 44-ФЗ и 223-ФЗ\nОбучение и консалтинг\nЭлектронная подпись\nПлощадка Etpzakupki.tatar\nЮридические услуги\nНезависимые гарантии',
  image: 'IMG_8077-e1536932079653.jpg'
};
var defaultContactsData = {
  phone: '8 (800) 101-78-92',
  email: 'info@crzrt.ru',
  requisites: 'АО «ЦРЗ РТ»\nИНН 1655291703\nКПП 165501001\nОГРН 1141690029800'
};
var mainPageData = AdminLanding.migrateMainPageData(safeParseJson(localStorage.getItem('crzrt_main_page_data')));
window.mainPageData = mainPageData;
window.saveMainPageStateToMemory = function () {
  AdminLanding.collectMainPageFromForm(mainPageData);
};
var ecpPageData = AdminEcp.migrateEcpPageData(safeParseJson(localStorage.getItem('crzrt_ecp_page_data')));
window.ecpPageData = ecpPageData;
window.saveEcpPageStateToMemory = function () {
  ecpPageData = AdminEcp.collectEcpPageFromForm(ecpPageData);
  window.ecpPageData = ecpPageData;
};
var consultingPageData = {};
if (typeof AdminConsultingPage !== 'undefined') {
  consultingPageData = AdminConsultingPage.migrateConsultingPageData(safeParseJson(localStorage.getItem('crzrt_consulting_page_data')));
}
window.consultingPageData = consultingPageData;
window.saveConsultingPageStateToMemory = function () {
  if (typeof AdminConsultingPage === 'undefined') return;
  consultingPageData = AdminConsultingPage.collectConsultingPageFromForm(consultingPageData);
  window.consultingPageData = consultingPageData;
};
var supportPageData = {};
if (typeof AdminSupport !== 'undefined') {
  supportPageData = AdminSupport.migrateSupportPageData(safeParseJson(localStorage.getItem('crzrt_support_page_data')));
}
window.supportPageData = supportPageData;
window.saveSupportPageStateToMemory = function () {
  if (typeof AdminSupport === 'undefined') return;
  supportPageData = AdminSupport.collectSupportPageFromForm(supportPageData);
  window.supportPageData = supportPageData;
};
var obucheniePageData = {};
if (typeof AdminObuchenie !== 'undefined') {
  obucheniePageData = AdminObuchenie.migrateObucheniePageData(safeParseJson(localStorage.getItem('crzrt_obuchenie_page_data')));
}
window.obucheniePageData = obucheniePageData;
window.saveObucheniePageStateToMemory = function () {
  if (typeof AdminObuchenie === 'undefined') return;
  obucheniePageData = AdminObuchenie.collectObucheniePageFromForm(obucheniePageData);
  window.obucheniePageData = obucheniePageData;
};
var quizPageData = {};
if (typeof AdminQuiz !== 'undefined') {
  quizPageData = AdminQuiz.migrateQuizPageData(safeParseJson(localStorage.getItem('crzrt_quiz_data')));
}
window.quizPageData = quizPageData;
window.saveQuizPageStateToMemory = function () {
  if (typeof AdminQuiz === 'undefined') return;
  quizPageData = AdminQuiz.collectQuizPageFromForm(quizPageData);
  window.quizPageData = quizPageData;
};
var knowledgePageData = {};
if (typeof AdminKnowledge !== 'undefined') {
  knowledgePageData = AdminKnowledge.migrateKnowledgePageData(safeParseJson(localStorage.getItem('crzrt_knowledge_page_data')));
}
window.knowledgePageData = knowledgePageData;
window.saveKnowledgePageStateToMemory = function () {
  if (typeof AdminKnowledge === 'undefined') return;
  knowledgePageData = AdminKnowledge.collectKnowledgePageFromForm(knowledgePageData);
  window.knowledgePageData = knowledgePageData;
};
var newsPageData = {};
if (typeof AdminNews !== 'undefined') {
  newsPageData = AdminNews.migrateNewsPageData(safeParseJson(localStorage.getItem('crzrt_news_page_data')));
}
window.newsPageData = newsPageData;
window.saveNewsPageStateToMemory = function () {
  if (typeof AdminNews === 'undefined') return;
  newsPageData = AdminNews.collectNewsPageFromForm(newsPageData);
  window.newsPageData = newsPageData;
};
var bgHistoryData = safeParseJson(localStorage.getItem('crzrt_bg_history'), []);
window.bgHistoryData = bgHistoryData;

// Background History Modal Logic
var bgHistoryTargetId = null;
window.openBgHistoryModal = function (targetId) {
  bgHistoryTargetId = targetId;
  var modal = document.getElementById('bgHistoryModal');
  var grid = document.getElementById('bgHistoryGrid');
  var emptyState = document.getElementById('bgHistoryEmptyState');
  if (!modal || !grid) return;
  grid.innerHTML = '';
  if (bgHistoryData.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
  } else {
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    bgHistoryData.forEach(function (url) {
      var item = document.createElement('div');
      item.className = 'bg-history-item';
      item.innerHTML = "\n                        <img src=\"".concat(url, "\" alt=\"Background\">\n                        <div class=\"bg-history-item-apply\">\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u044D\u0442\u043E\u0442 \u0444\u043E\u043D</div>\n                    ");
      item.onclick = function () {
        var input = document.getElementById(bgHistoryTargetId + '_val');
        var preview = document.getElementById(bgHistoryTargetId + '_preview');
        var frame = document.querySelector("[data-upload-frame-for=\"".concat(bgHistoryTargetId, "\"]"));
        var clearBtn = document.getElementById(bgHistoryTargetId + '_clear');
        if (input) input.value = url;
        if (preview) {
          preview.src = url;
          preview.style.display = 'block';
        }
        if (frame) {
          frame.classList.remove('hero-slide-frame--empty');
          frame.classList.add('hero-slide-frame--filled');
        }
        if (clearBtn) clearBtn.style.display = 'inline-block';
        modal.style.display = 'none';
        bgHistoryTargetId = null;
        updateSaveButtonsState({
          boxShadow: '0 0 15px rgba(52, 199, 89, 0.5)',
          text: 'Сохраните изменения!'
        });
      };
      grid.appendChild(item);
    });
  }
  modal.style.display = 'flex';
  modal.style.opacity = '1';
};
(_document$getElementB = document.getElementById('btnBgHistoryClose')) === null || _document$getElementB === void 0 || _document$getElementB.addEventListener('click', function () {
  var modal = document.getElementById('bgHistoryModal');
  if (modal) modal.style.display = 'none';
  bgHistoryTargetId = null;
});
var aboutData = _objectSpread({}, defaultAboutData);
var contactsData = _objectSpread({}, defaultContactsData);
var educationData; // assigned after defaultEducationData is declared (~line 1570)
var consultingData; // assigned after defaultConsultingData is declared (~line 2490)
function syncAllDataFromServer() {
  return _syncAllDataFromServer.apply(this, arguments);
} // Миграция со старой версии или инициализация по умолчанию
function _syncAllDataFromServer() {
  _syncAllDataFromServer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var keys, _i2, _keys, _key, resp, _data2, _t6;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          keys = ['crzrt_main_page_data', 'crzrt_ecp_page_data', 'crzrt_consulting_page_data', 'crzrt_support_page_data', 'crzrt_obuchenie_page_data', 'crzrt_quiz_data', 'crzrt_knowledge_page_data', 'crzrt_news_page_data', 'crzrt_about_data', 'crzrt_contacts', 'crzrt_education_data', 'crzrt_consulting_data', 'crzrt_bg_history'];
          _i2 = 0, _keys = keys;
        case 1:
          if (!(_i2 < _keys.length)) {
            _context5.n = 8;
            break;
          }
          _key = _keys[_i2];
          _context5.p = 2;
          _context5.n = 3;
          return fetch("api/settings.php?key=".concat(_key));
        case 3:
          resp = _context5.v;
          if (!resp.ok) {
            _context5.n = 5;
            break;
          }
          _context5.n = 4;
          return resp.json();
        case 4:
          _data2 = _context5.v;
          if (_data2 && Object.keys(_data2).length > 0) {
            if (_key === 'crzrt_main_page_data') {
              mainPageData = AdminLanding.migrateMainPageData(_data2);
              window.mainPageData = mainPageData;
            } else if (_key === 'crzrt_ecp_page_data') {
              ecpPageData = AdminEcp.migrateEcpPageData(_data2);
              window.ecpPageData = ecpPageData;
              localStorage.setItem(_key, JSON.stringify(ecpPageData));
            } else if (_key === 'crzrt_consulting_page_data' && typeof AdminConsultingPage !== 'undefined') {
              consultingPageData = AdminConsultingPage.migrateConsultingPageData(_data2);
              window.consultingPageData = consultingPageData;
              localStorage.setItem(_key, JSON.stringify(consultingPageData));
            } else if (_key === 'crzrt_support_page_data' && typeof AdminSupport !== 'undefined') {
              supportPageData = AdminSupport.migrateSupportPageData(_data2);
              window.supportPageData = supportPageData;
              localStorage.setItem(_key, JSON.stringify(supportPageData));
            } else if (_key === 'crzrt_obuchenie_page_data' && typeof AdminObuchenie !== 'undefined') {
              obucheniePageData = AdminObuchenie.migrateObucheniePageData(_data2);
              window.obucheniePageData = obucheniePageData;
              localStorage.setItem(_key, JSON.stringify(obucheniePageData));
            } else if (_key === 'crzrt_quiz_data' && typeof AdminQuiz !== 'undefined') {
              quizPageData = AdminQuiz.migrateQuizPageData(_data2);
              window.quizPageData = quizPageData;
              localStorage.setItem(_key, JSON.stringify(quizPageData));
            } else if (_key === 'crzrt_knowledge_page_data' && typeof AdminKnowledge !== 'undefined') {
              knowledgePageData = AdminKnowledge.migrateKnowledgePageData(_data2);
              window.knowledgePageData = knowledgePageData;
              localStorage.setItem(_key, JSON.stringify(knowledgePageData));
            } else if (_key === 'crzrt_news_page_data' && typeof AdminNews !== 'undefined') {
              newsPageData = AdminNews.migrateNewsPageData(_data2);
              window.newsPageData = newsPageData;
              localStorage.setItem(_key, JSON.stringify(newsPageData));
            } else if (_key === 'crzrt_about_data') aboutData = _objectSpread(_objectSpread({}, defaultAboutData), _data2);else if (_key === 'crzrt_contacts') contactsData = _objectSpread(_objectSpread({}, defaultContactsData), _data2);else if (_key === 'crzrt_education_data') educationData = _objectSpread(_objectSpread({}, educationData), _data2);else if (_key === 'crzrt_consulting_data') consultingData = _objectSpread(_objectSpread({}, consultingData), _data2);else if (_key === 'crzrt_bg_history') {
              bgHistoryData = Array.isArray(_data2) ? _data2 : [];
              window.bgHistoryData = bgHistoryData;
            }

            // Save to local for fallback
            if (_key !== 'crzrt_ecp_page_data' && _key !== 'crzrt_consulting_page_data' && _key !== 'crzrt_support_page_data' && _key !== 'crzrt_obuchenie_page_data' && _key !== 'crzrt_knowledge_page_data' && _key !== 'crzrt_news_page_data') {
              localStorage.setItem(_key, JSON.stringify(_data2));
            }
          }
        case 5:
          _context5.n = 7;
          break;
        case 6:
          _context5.p = 6;
          _t6 = _context5.v;
          console.warn("Failed to sync key ".concat(_key, " from server:"), _t6);
        case 7:
          _i2++;
          _context5.n = 1;
          break;
        case 8:
          // Refresh appropriate views
          try {
            if (currentTarget === 'main-page') renderMainPageAdmin();else if (currentTarget === 'ecp-page') renderEcpPageAdmin();else if (currentTarget === 'consulting-page') renderConsultingPageAdmin();else if (currentTarget === 'support-page') renderSupportPageAdmin();else if (currentTarget === 'obuchenie-page') renderObucheniePageAdmin();else if (currentTarget === 'testing-page') renderQuizPageAdmin();else if (currentTarget === 'knowledge-page') renderKnowledgePageAdmin();else if (currentTarget === 'news-page') renderNewsPageAdmin();else if (currentTarget === 'about-us') renderAboutUsAdmin();else if (currentTarget === 'contacts') renderContactsAdmin();else if (currentTarget === 'education') renderEducationAdmin();else if (currentTarget === 'consulting') renderConsultingAdmin();
          } catch (e) {
            console.error('Error rendering current target in syncAllDataFromServer:', currentTarget, e);
          }
        case 9:
          return _context5.a(2);
      }
    }, _callee5, null, [[2, 6]]);
  }));
  return _syncAllDataFromServer.apply(this, arguments);
}
if (usersDb) {
  for (var email in usersDb) {
    var user = usersDb[email];
    // Если осталась старая роль вместо массива прав
    if (user.role && !user.permissions) {
      if (user.role === 'superuser') user.permissions = ['superuser'];else if (user.role === 'editor_main') user.permissions = ['main-page'];else if (user.role === 'editor_other') user.permissions = ['users'];else user.permissions = [];
      user.name = user.name || 'Без имени';
      delete user.role;
    }
  }
  // Жестко гарантируем, что суперпользователь хотя бы один есть и работает
  if (usersDb['admin@crzrt.ru']) {
    usersDb['admin@crzrt.ru'].permissions = ['superuser'];
    usersDb['admin@crzrt.ru'].name = usersDb['admin@crzrt.ru'].name || 'Администратор';
  } else {
    usersDb['admin@crzrt.ru'] = defaultUsers['admin@crzrt.ru'];
  }
} else {
  usersDb = defaultUsers;
}
localStorage.setItem('crzrt_users', JSON.stringify(usersDb));
var blocks = document.querySelectorAll('.admin-block');
var permissionDenied = document.getElementById('permissionDenied');
var navItems = document.querySelectorAll('.nav-item');
var blockTargetMap = {
  'main-page': 'mainPageBlock',
  'ecp-page': 'ecpPageBlock',
  'consulting-page': 'consultingPageBlock',
  'support-page': 'supportPageBlock',
  'obuchenie-page': 'obucheniePageBlock',
  'testing-page': 'testingPageBlock',
  'knowledge-page': 'knowledgePageBlock',
  'news-page': 'newsPageBlock',
  'consulting': 'consultingBlock',
  'education': 'educationBlock',
  'users': 'usersBlock',
  'about-us': 'aboutUsBlock',
  'contacts': 'contactsBlock',
  'settings': 'settingsBlock'
};
var currentPermissions = [];
var currentUserEmail = null;
var currentTarget = 'main-page';
var authModal = document.getElementById('authModal');
var authEmail = document.getElementById('authEmail');
var authPassword = document.getElementById('authPassword');
var btnAuthLogin = document.getElementById('btnAuthLogin');
var authError = document.getElementById('authError');
var currentUserRoleInfo = document.getElementById('currentUserRoleInfo');
var btnLogout = document.getElementById('btnLogout');
function renderMainPageAdmin() {
  AdminLanding.renderMainPageAdmin(mainPageData);
}
function renderEcpPageAdmin() {
  AdminEcp.renderEcpPageAdmin(ecpPageData);
}
function renderConsultingPageAdmin() {
  console.log('renderConsultingPageAdmin called. AdminConsultingPage:', typeof AdminConsultingPage === "undefined" ? "undefined" : _typeof(AdminConsultingPage));
  if (typeof AdminConsultingPage === 'undefined') return;
  AdminConsultingPage.renderConsultingPageAdmin(consultingPageData);
}
function renderSupportPageAdmin() {
  console.log('renderSupportPageAdmin called. AdminSupport:', typeof AdminSupport === "undefined" ? "undefined" : _typeof(AdminSupport));
  if (typeof AdminSupport === 'undefined') return;
  AdminSupport.renderSupportPageAdmin(supportPageData);
}
function renderObucheniePageAdmin() {
  console.log('renderObucheniePageAdmin called. AdminObuchenie:', typeof AdminObuchenie === "undefined" ? "undefined" : _typeof(AdminObuchenie));
  if (typeof AdminObuchenie === 'undefined') return;
  AdminObuchenie.renderObucheniePageAdmin(obucheniePageData);
}
function renderQuizPageAdmin() {
  if (typeof AdminQuiz === 'undefined') return;
  quizPageData = AdminQuiz.migrateQuizPageData(quizPageData);
  window.quizPageData = quizPageData;
  AdminQuiz.renderQuizPageAdmin();
}
function renderKnowledgePageAdmin() {
  console.log('renderKnowledgePageAdmin called. AdminKnowledge:', typeof AdminKnowledge === "undefined" ? "undefined" : _typeof(AdminKnowledge));
  if (typeof AdminKnowledge === 'undefined') return;
  AdminKnowledge.renderKnowledgePageAdmin(knowledgePageData);
}
function renderNewsPageAdmin() {
  console.log('renderNewsPageAdmin called. AdminNews:', typeof AdminNews === "undefined" ? "undefined" : _typeof(AdminNews));
  if (typeof AdminNews === 'undefined') return;
  AdminNews.renderNewsPageAdmin(newsPageData);
}

// ═══════════════════════════════════════════════
//  EDUCATION ADMIN MODULE
// ═══════════════════════════════════════════════

var defaultEducationData = {
  courses: [{
    id: 1,
    type: 'Очное',
    law: '44-ФЗ',
    audience: 'Заказчикам',
    title: 'Повышение квалификации по 44-ФЗ (108 ак.ч.)',
    description: 'Комплексная программа по 44-ФЗ для специалистов контрактной системы.',
    duration: '108 ак.ч. / 5 дней',
    location: 'Казань, Петербургская 86',
    document: 'Удостоверение гос. образца',
    price: '23 700 ₽',
    link: 'course-44fz.html',
    active: true,
    bullets: ['Последние изменения в 44-ФЗ', 'Планирование закупок', 'Электронные процедуры', 'Исполнение контракта']
  }, {
    id: 2,
    type: 'Очное',
    law: '44-ФЗ',
    audience: 'Заказчикам',
    title: '44-ФЗ + Весенняя Казань',
    description: 'Курс по 44-ФЗ + культурная программа по достопримечательностям Казани.',
    duration: '108 ак.ч. / 5 дней',
    location: 'Казань',
    document: 'Удостоверение гос. образца',
    price: '40 470 ₽',
    link: 'course-vesennyaya-kazan.html',
    active: true,
    bullets: ['Полная программа 44-ФЗ', 'Экскурсии по Казани', 'Мастер-класс по татарской кухне']
  }, {
    id: 3,
    type: 'Дистанционное',
    law: '44-ФЗ',
    audience: 'Заказчикам',
    title: 'Профессиональная переподготовка по 44-ФЗ (256 ак.ч.)',
    description: 'Онлайн-программа с выдачей диплома государственного образца.',
    duration: '256 ак.ч.',
    location: 'Онлайн',
    document: 'Диплом о профессиональной переподготовке',
    price: '17 500 ₽',
    link: 'course-distance-repro.html',
    active: true,
    bullets: ['Правовые основы', 'Электронные процедуры', 'ЕИС и отчётность']
  }],
  events: [{
    id: 1,
    title: 'Очный курс: 44-ФЗ (108 ак.ч.)',
    date: '2026-03-23',
    month: 'Март',
    day: '23',
    format: 'Очно, Казань',
    price: '23 700 ₽',
    badge: 'Заказчикам',
    link: 'course-44fz.html',
    active: true
  }, {
    id: 2,
    title: '44-ФЗ + Весенняя Казань',
    date: '2026-03-23',
    month: 'Март',
    day: '23',
    format: 'Очно + культурная программа',
    price: '40 470 ₽',
    badge: 'Спецпредложение',
    link: 'course-vesennyaya-kazan.html',
    active: true
  }, {
    id: 3,
    title: 'Очный курс: 223-ФЗ (72 ак.ч.)',
    date: '2026-03-25',
    month: 'Март',
    day: '25',
    format: 'Очно, Казань',
    price: '16 200 ₽',
    badge: 'Заказчикам',
    link: 'course-223fz.html',
    active: true
  }, {
    id: 4,
    title: 'Очный курс для поставщиков (40 ак.ч.)',
    date: '2026-05-11',
    month: 'Май',
    day: '11',
    format: 'Очно, Казань',
    price: '20 000 ₽',
    badge: 'Поставщикам',
    link: 'course-suppliers.html',
    active: true
  }],
  teachers: [{
    id: 1,
    name: 'Иванов Иван Иванович',
    title: 'Руководитель образовательных программ',
    bio: 'Эксперт в сфере 44-ФЗ и 223-ФЗ с 15-летним опытом. Разработал более 20 учебных программ.',
    photo: ''
  }, {
    id: 2,
    name: 'Петрова Анна Сергеевна',
    title: 'Ведущий преподаватель по 44-ФЗ',
    bio: 'Бывший специалист ФАС, практикующий юрист. Провела более 200 семинаров для заказчиков.',
    photo: ''
  }]
};

// Initialize educationData now that defaultEducationData is available
educationData = JSON.parse(localStorage.getItem('crzrt_education_data')) || _objectSpread({}, defaultEducationData);
function saveEducationData() {
  localStorage.setItem('crzrt_education_data', JSON.stringify(educationData));
}

// ── Sub-tab switching ──
document.querySelectorAll('.edu-tab').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.edu-tab').forEach(function (b) {
      b.style.background = 'transparent';
      b.style.color = 'var(--text-secondary)';
      b.classList.remove('active');
    });
    btn.style.background = 'var(--card-bg)';
    btn.style.color = 'var(--accent-color)';
    btn.classList.add('active');
    var target = btn.getAttribute('data-tab');
    document.querySelectorAll('.edu-tab-content').forEach(function (c) {
      return c.style.display = 'none';
    });
    document.getElementById(target).style.display = 'block';
  });
});

// ══════════════════════════════════════
//  COURSES RENDER
// ══════════════════════════════════════
function renderEducationAdmin() {
  renderEduCourses();
  renderEduEvents();
  renderEduTeachers();
}
function renderEduCourses() {
  var container = document.getElementById('eduCoursesAdmin');
  if (!container) return;
  container.innerHTML = '';
  educationData.courses.forEach(function (course, i) {
    container.insertAdjacentHTML('beforeend', "\n                <div style=\"border:1px solid var(--card-border); border-radius:12px; overflow:hidden; background:var(--card-bg);\">\n                    <div style=\"display:flex; justify-content:space-between; align-items:center; padding:12px 18px; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--card-border);\">\n                        <span style=\"font-weight:700; font-size:0.9rem;\">".concat(course.title, "</span>\n                        <div style=\"display:flex;gap:8px;\">\n                            <button class=\"btn-edit\" onclick=\"window.toggleEduCourse(").concat(i, ")\">\u0420\u0435\u0434.</button>\n                            <button class=\"btn-delete\" onclick=\"window.deleteEduCourse(").concat(i, ")\">\u0423\u0434.</button>\n                        </div>\n                    </div>\n                    <div id=\"eduCourseForm_").concat(i, "\" style=\"display:none; padding:20px; display:flex; flex-direction:column; gap:12px;\">\n                        <div style=\"display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;\">\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u0422\u0438\u043F</label>\n                                <select class=\"form-control\" id=\"ec_type_").concat(i, "\">\n                                    <option ").concat(course.type === 'Очное' ? 'selected' : '', ">\u041E\u0447\u043D\u043E\u0435</option>\n                                    <option ").concat(course.type === 'Дистанционное' ? 'selected' : '', ">\u0414\u0438\u0441\u0442\u0430\u043D\u0446\u0438\u043E\u043D\u043D\u043E\u0435</option>\n                                    <option ").concat(course.type === 'Семинар' ? 'selected' : '', ">\u0421\u0435\u043C\u0438\u043D\u0430\u0440</option>\n                                    <option ").concat(course.type === 'Вебинар' ? 'selected' : '', ">\u0412\u0435\u0431\u0438\u043D\u0430\u0440</option>\n                                    <option ").concat(course.type === 'Индивидуальное' ? 'selected' : '', ">\u0418\u043D\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043B\u044C\u043D\u043E\u0435</option>\n                                </select>\n                            </div>\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u0424\u0417</label>\n                                <select class=\"form-control\" id=\"ec_law_").concat(i, "\">\n                                    <option ").concat(course.law === '44-ФЗ' ? 'selected' : '', ">44-\u0424\u0417</option>\n                                    <option ").concat(course.law === '223-ФЗ' ? 'selected' : '', ">223-\u0424\u0417</option>\n                                    <option ").concat(course.law === '44-ФЗ / 223-ФЗ' ? 'selected' : '', ">44-\u0424\u0417 / 223-\u0424\u0417</option>\n                                </select>\n                            </div>\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u0410\u0443\u0434\u0438\u0442\u043E\u0440\u0438\u044F</label>\n                                <select class=\"form-control\" id=\"ec_audience_").concat(i, "\">\n                                    <option ").concat(course.audience === 'Заказчикам' ? 'selected' : '', ">\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A\u0430\u043C</option>\n                                    <option ").concat(course.audience === 'Поставщикам' ? 'selected' : '', ">\u041F\u043E\u0441\u0442\u0430\u0432\u0449\u0438\u043A\u0430\u043C</option>\n                                    <option ").concat(course.audience === 'Всем' ? 'selected' : '', ">\u0412\u0441\u0435\u043C</option>\n                                </select>\n                            </div>\n                        </div>\n                        <div class=\"form-group\" style=\"margin:0;\">\n                            <label>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0443\u0440\u0441\u0430</label>\n                            <input type=\"text\" class=\"form-control\" id=\"ec_title_").concat(i, "\" value=\"").concat(course.title, "\">\n                        </div>\n                        <div class=\"form-group\" style=\"margin:0;\">\n                            <label>\u041A\u0440\u0430\u0442\u043A\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</label>\n                            <textarea class=\"form-control\" id=\"ec_desc_").concat(i, "\" style=\"min-height:80px;\">").concat(course.description, "</textarea>\n                        </div>\n                        <div style=\"display:grid; grid-template-columns:1fr 1fr; gap:12px;\">\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C</label>\n                                <input type=\"text\" class=\"form-control\" id=\"ec_dur_").concat(i, "\" value=\"").concat(course.duration, "\">\n                            </div>\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u041C\u0435\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F</label>\n                                <input type=\"text\" class=\"form-control\" id=\"ec_loc_").concat(i, "\" value=\"").concat(course.location, "\">\n                            </div>\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442 \u043F\u043E \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0438</label>\n                                <input type=\"text\" class=\"form-control\" id=\"ec_doc_").concat(i, "\" value=\"").concat(course.document, "\">\n                            </div>\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C</label>\n                                <input type=\"text\" class=\"form-control\" id=\"ec_price_").concat(i, "\" value=\"").concat(course.price, "\">\n                            </div>\n                        </div>\n                        <div class=\"form-group\" style=\"margin:0;\">\n                            <label>\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u043A\u0443\u0440\u0441\u0430</label>\n                            <input type=\"text\" class=\"form-control\" id=\"ec_link_").concat(i, "\" value=\"").concat(course.link, "\">\n                        </div>\n                        <div class=\"form-group\" style=\"margin:0;\">\n                            <label>\u0427\u0442\u043E \u0438\u0437\u0443\u0447\u0438\u043C (\u043A\u0430\u0436\u0434\u044B\u0439 \u043F\u0443\u043D\u043A\u0442 \u0441 \u043D\u043E\u0432\u043E\u0439 \u0441\u0442\u0440\u043E\u043A\u0438)</label>\n                            <textarea class=\"form-control\" id=\"ec_bullets_").concat(i, "\" style=\"min-height:100px;\">").concat((course.bullets || []).join('\n'), "</textarea>\n                        </div>\n                        <div style=\"display:flex; align-items:center; gap:10px;\">\n                            <input type=\"checkbox\" id=\"ec_active_").concat(i, "\" ").concat(course.active ? 'checked' : '', " style=\"width:18px;height:18px;accent-color:var(--accent-color);\">\n                            <label for=\"ec_active_").concat(i, "\" style=\"margin:0;font-size:0.9rem;\">\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043D\u0430 \u0441\u0430\u0439\u0442\u0435</label>\n                        </div>\n                        <button class=\"btn-save\" style=\"align-self:flex-start; padding:10px 24px;\" onclick=\"window.saveEduCourse(").concat(i, ")\">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043A\u0443\u0440\u0441</button>\n                    </div>\n                </div>"));
    // Expand form by default for first render visibility — keep closed
    document.getElementById("eduCourseForm_".concat(i)).style.display = 'none';
  });
}
window.toggleEduCourse = function (i) {
  var form = document.getElementById("eduCourseForm_".concat(i));
  form.style.display = form.style.display === 'none' ? 'flex' : 'none';
};
window.saveEduCourse = function (i) {
  var c = educationData.courses[i];
  c.type = document.getElementById("ec_type_".concat(i)).value;
  c.law = document.getElementById("ec_law_".concat(i)).value;
  c.audience = document.getElementById("ec_audience_".concat(i)).value;
  c.title = document.getElementById("ec_title_".concat(i)).value;
  c.description = document.getElementById("ec_desc_".concat(i)).value;
  c.duration = document.getElementById("ec_dur_".concat(i)).value;
  c.location = document.getElementById("ec_loc_".concat(i)).value;
  c.document = document.getElementById("ec_doc_".concat(i)).value;
  c.price = document.getElementById("ec_price_".concat(i)).value;
  c.link = document.getElementById("ec_link_".concat(i)).value;
  c.active = document.getElementById("ec_active_".concat(i)).checked;
  var bulletsRaw = document.getElementById("ec_bullets_".concat(i)).value;
  c.bullets = bulletsRaw.split('\n').map(function (s) {
    return s.trim();
  }).filter(Boolean);
  saveEducationData();
  showToast('Курс сохранён');
};
window.deleteEduCourse = function (i) {
  if (!confirm('Удалить этот курс?')) return;
  educationData.courses.splice(i, 1);
  saveEducationData();
  renderEduCourses();
};
document.getElementById('btnAddCourse').addEventListener('click', function () {
  educationData.courses.push({
    id: Date.now(),
    type: 'Очное',
    law: '44-ФЗ',
    audience: 'Заказчикам',
    title: 'Новый курс',
    description: '',
    duration: '',
    location: 'Казань',
    document: 'Удостоверение гос. образца',
    price: '0 ₽',
    link: '#',
    active: false,
    bullets: []
  });
  saveEducationData();
  renderEduCourses();
  // Auto-expand last
  var last = educationData.courses.length - 1;
  setTimeout(function () {
    var f = document.getElementById("eduCourseForm_".concat(last));
    if (f) f.style.display = 'flex';
  }, 50);
});

// ══════════════════════════════════════
//  EVENTS RENDER
// ══════════════════════════════════════
function renderEduEvents() {
  var container = document.getElementById('eduEventsAdmin');
  if (!container) return;
  container.innerHTML = '';
  educationData.events.forEach(function (ev, i) {
    container.insertAdjacentHTML('beforeend', "\n                <div style=\"border:1px solid var(--card-border); border-radius:12px; overflow:hidden; background:var(--card-bg);\">\n                    <div style=\"display:flex; justify-content:space-between; align-items:center; padding:12px 18px; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--card-border);\">\n                        <span style=\"font-weight:700; font-size:0.9rem;\">".concat(ev.month, " ").concat(ev.day, " \u2014 ").concat(ev.title, "</span>\n                        <div style=\"display:flex;gap:8px;\">\n                            <button class=\"btn-edit\" onclick=\"window.toggleEduEvent(").concat(i, ")\">\u0420\u0435\u0434.</button>\n                            <button class=\"btn-delete\" onclick=\"window.deleteEduEvent(").concat(i, ")\">\u0423\u0434.</button>\n                        </div>\n                    </div>\n                    <div id=\"eduEventForm_").concat(i, "\" style=\"display:none; padding:20px; flex-direction:column; gap:12px;\">\n                        <div class=\"form-group\" style=\"margin:0;\">\n                            <label>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u044F</label>\n                            <input type=\"text\" class=\"form-control\" id=\"ev_title_").concat(i, "\" value=\"").concat(ev.title, "\">\n                        </div>\n                        <div style=\"display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;\">\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u0414\u0430\u0442\u0430 (\u0413\u0413\u0413\u0413-\u041C\u041C-\u0414\u0414)</label>\n                                <input type=\"date\" class=\"form-control\" id=\"ev_date_").concat(i, "\" value=\"").concat(ev.date, "\">\n                            </div>\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u041C\u0435\u0441\u044F\u0446 (\u0442\u0435\u043A\u0441\u0442\u043E\u043C)</label>\n                                <input type=\"text\" class=\"form-control\" id=\"ev_month_").concat(i, "\" value=\"").concat(ev.month, "\" placeholder=\"\u041C\u0430\u0440\u0442\">\n                            </div>\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u0414\u0435\u043D\u044C (\u0447\u0438\u0441\u043B\u043E)</label>\n                                <input type=\"text\" class=\"form-control\" id=\"ev_day_").concat(i, "\" value=\"").concat(ev.day, "\" placeholder=\"23\">\n                            </div>\n                        </div>\n                        <div style=\"display:grid; grid-template-columns:1fr 1fr; gap:12px;\">\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u0424\u043E\u0440\u043C\u0430\u0442 / \u041C\u0435\u0441\u0442\u043E</label>\n                                <input type=\"text\" class=\"form-control\" id=\"ev_format_").concat(i, "\" value=\"").concat(ev.format, "\">\n                            </div>\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C</label>\n                                <input type=\"text\" class=\"form-control\" id=\"ev_price_").concat(i, "\" value=\"").concat(ev.price, "\">\n                            </div>\n                        </div>\n                        <div style=\"display:grid; grid-template-columns:1fr 1fr; gap:12px;\">\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u0411\u0435\u0439\u0434\u0436 (\u043D\u0430\u043F\u0440. \xAB\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A\u0430\u043C\xBB)</label>\n                                <input type=\"text\" class=\"form-control\" id=\"ev_badge_").concat(i, "\" value=\"").concat(ev.badge, "\">\n                            </div>\n                            <div class=\"form-group\" style=\"margin:0;\">\n                                <label>\u0421\u0441\u044B\u043B\u043A\u0430</label>\n                                <input type=\"text\" class=\"form-control\" id=\"ev_link_").concat(i, "\" value=\"").concat(ev.link, "\">\n                            </div>\n                        </div>\n                        <div style=\"display:flex; align-items:center; gap:10px;\">\n                            <input type=\"checkbox\" id=\"ev_active_").concat(i, "\" ").concat(ev.active ? 'checked' : '', " style=\"width:18px;height:18px;accent-color:var(--accent-color);\">\n                            <label for=\"ev_active_").concat(i, "\" style=\"margin:0;font-size:0.9rem;\">\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043D\u0430 \u0441\u0430\u0439\u0442\u0435</label>\n                        </div>\n                        <button class=\"btn-save\" style=\"align-self:flex-start; padding:10px 24px;\" onclick=\"window.saveEduEvent(").concat(i, ")\">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button>\n                    </div>\n                </div>"));
    document.getElementById("eduEventForm_".concat(i)).style.display = 'none';
  });
}
window.toggleEduEvent = function (i) {
  var form = document.getElementById("eduEventForm_".concat(i));
  form.style.display = form.style.display === 'none' ? 'flex' : 'none';
};
window.saveEduEvent = function (i) {
  var ev = educationData.events[i];
  ev.title = document.getElementById("ev_title_".concat(i)).value;
  ev.date = document.getElementById("ev_date_".concat(i)).value;
  ev.month = document.getElementById("ev_month_".concat(i)).value;
  ev.day = document.getElementById("ev_day_".concat(i)).value;
  ev.format = document.getElementById("ev_format_".concat(i)).value;
  ev.price = document.getElementById("ev_price_".concat(i)).value;
  ev.badge = document.getElementById("ev_badge_".concat(i)).value;
  ev.link = document.getElementById("ev_link_".concat(i)).value;
  ev.active = document.getElementById("ev_active_".concat(i)).checked;
  saveEducationData();
  showToast('Мероприятие сохранено');
};
window.deleteEduEvent = function (i) {
  if (!confirm('Удалить это мероприятие?')) return;
  educationData.events.splice(i, 1);
  saveEducationData();
  renderEduEvents();
};
document.getElementById('btnAddEvent').addEventListener('click', function () {
  var now = new Date();
  educationData.events.push({
    id: Date.now(),
    title: 'Новое мероприятие',
    date: now.toISOString().split('T')[0],
    month: now.toLocaleString('ru', {
      month: 'long'
    }),
    day: String(now.getDate()),
    format: 'Очно, Казань',
    price: '0 ₽',
    badge: 'Заказчикам',
    link: '#',
    active: false
  });
  saveEducationData();
  renderEduEvents();
  var last = educationData.events.length - 1;
  setTimeout(function () {
    var f = document.getElementById("eduEventForm_".concat(last));
    if (f) f.style.display = 'flex';
  }, 50);
});

// ══════════════════════════════════════
//  TEACHERS RENDER
// ══════════════════════════════════════
function renderEduTeachers() {
  var container = document.getElementById('eduTeachersAdmin');
  if (!container) return;
  container.innerHTML = '';
  educationData.teachers.forEach(function (t, i) {
    container.insertAdjacentHTML('beforeend', "\n                <div style=\"border:1px solid var(--card-border); border-radius:12px; padding:20px; background:var(--card-bg); display:flex; flex-direction:column; gap:16px;\">\n                    <!-- Photo -->\n                    <div style=\"position:relative; width:100%; height:180px; border:1px dashed var(--card-border); border-radius:8px; overflow:hidden; cursor:pointer; background:rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center;\"\n                         onclick=\"window.uploadTeacherPhoto(".concat(i, ")\">\n                        <img id=\"teacher_photo_preview_").concat(i, "\" src=\"").concat(t.photo || '', "\" alt=\"\" style=\"width:100%; height:100%; object-fit:cover; object-position:top; display:").concat(t.photo ? 'block' : 'none', ";\">\n                        <span id=\"teacher_photo_placeholder_").concat(i, "\" style=\"font-size:0.85rem; color:var(--text-secondary); display:").concat(t.photo ? 'none' : 'block', ";\">\n                            \u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u043E\u0442\u043E\n                        </span>\n                        ").concat(t.photo ? "<button class=\"btn-delete\" onclick=\"event.stopPropagation(); window.clearTeacherPhoto(".concat(i, ")\" style=\"position:absolute;top:8px;right:8px;padding:4px 10px;font-size:0.75rem;\"><svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" style=\"margin-right:4px;\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line></svg>\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>") : '', "\n                        <input type=\"hidden\" id=\"teacher_photo_val_").concat(i, "\" value=\"").concat(t.photo || '', "\">\n                        <input type=\"file\" id=\"teacher_photo_input_").concat(i, "\" accept=\"image/*\" style=\"display:none;\" onchange=\"window.handleTeacherPhotoChange(event, ").concat(i, ")\">\n                    </div>\n                    <div class=\"form-group\" style=\"margin:0;\">\n                        <label>\u0424\u0418\u041E</label>\n                        <input type=\"text\" class=\"form-control\" id=\"t_name_").concat(i, "\" value=\"").concat(t.name, "\">\n                    </div>\n                    <div class=\"form-group\" style=\"margin:0;\">\n                        <label>\u0414\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u044C / \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F</label>\n                        <input type=\"text\" class=\"form-control\" id=\"t_title_").concat(i, "\" value=\"").concat(t.title, "\">\n                    </div>\n                    <div class=\"form-group\" style=\"margin:0;\">\n                        <label>\u041A\u0440\u0430\u0442\u043A\u0430\u044F \u0431\u0438\u043E\u0433\u0440\u0430\u0444\u0438\u044F</label>\n                        <textarea class=\"form-control\" id=\"t_bio_").concat(i, "\" style=\"min-height:80px;\">").concat(t.bio, "</textarea>\n                    </div>\n                    <div style=\"display:flex; gap:8px;\">\n                        <button class=\"btn-save\" style=\"flex:1; padding:10px;\" onclick=\"window.saveTeacher(").concat(i, ")\">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C</button>\n                        <button class=\"btn-delete\" style=\"padding:10px 16px;\" onclick=\"window.deleteTeacher(").concat(i, ")\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n                    </div>\n                </div>"));
  });
}
window.uploadTeacherPhoto = function (i) {
  document.getElementById("teacher_photo_input_".concat(i)).click();
};
window.handleTeacherPhotoChange = function (event, i) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    var dataUrl = e.target.result;
    var preview = document.getElementById("teacher_photo_preview_".concat(i));
    var placeholder = document.getElementById("teacher_photo_placeholder_".concat(i));
    var val = document.getElementById("teacher_photo_val_".concat(i));
    if (preview) {
      preview.src = dataUrl;
      preview.style.display = 'block';
    }
    if (placeholder) placeholder.style.display = 'none';
    if (val) val.value = dataUrl;
    educationData.teachers[i].photo = dataUrl;
    saveEducationData();
    showToast('Фото загружено');
  };
  reader.readAsDataURL(file);
};
window.clearTeacherPhoto = function (i) {
  educationData.teachers[i].photo = '';
  saveEducationData();
  renderEduTeachers();
};
window.saveTeacher = function (i) {
  var t = educationData.teachers[i];
  t.name = document.getElementById("t_name_".concat(i)).value;
  t.title = document.getElementById("t_title_".concat(i)).value;
  t.bio = document.getElementById("t_bio_".concat(i)).value;
  t.photo = document.getElementById("teacher_photo_val_".concat(i)).value;
  saveEducationData();
  showToast('Преподаватель сохранён');
};
window.deleteTeacher = function (i) {
  if (!confirm('Удалить преподавателя?')) return;
  educationData.teachers.splice(i, 1);
  saveEducationData();
  renderEduTeachers();
};
document.getElementById('btnAddTeacher').addEventListener('click', function () {
  educationData.teachers.push({
    id: Date.now(),
    name: 'Новый преподаватель',
    title: '',
    bio: '',
    photo: ''
  });
  saveEducationData();
  renderEduTeachers();
});

// ── Toast helper ──
function showToast(msg) {
  var toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:var(--accent-color);color:#fff;padding:12px 24px;font-weight:600;font-size:0.9rem;z-index:99999;border-radius:0;opacity:0;transition:opacity 0.3s;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    return toast.style.opacity = '0';
  }, 2500);
}

// ═══════════════════════════════════════════════
function checkAuth() {
  return _checkAuth.apply(this, arguments);
}
function _checkAuth() {
  _checkAuth = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var response, _data3, _user2, roleDisplay, _t7;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          _context6.n = 1;
          return fetch('api/auth.php?action=check');
        case 1:
          response = _context6.v;
          _context6.n = 2;
          return response.json();
        case 2:
          _data3 = _context6.v;
          if (_data3.authenticated) {
            _user2 = _data3.user;
            currentUserEmail = _user2.email || _user2.name;
            if (_user2.role === 'superadmin' || _user2.role === 'admin') {
              currentPermissions = ['superuser'];
            } else {
              currentPermissions = [];
            }
            authModal.style.display = 'none';
            roleDisplay = "Пользователь";
            if (currentPermissions.includes('superuser')) {
              roleDisplay = "Суперпользователь";
            }
            currentUserRoleInfo.innerHTML = "<div>".concat(_user2.name, "</div><div style=\"font-size:0.8rem; font-weight:normal; opacity:0.8; margin-top:2px;\">").concat(roleDisplay, "</div>");

            // СИНХРОНИЗАЦИЯ С СЕРВЕРОМ
            syncAllDataFromServer();
            updateAccess();
          } else {
            authModal.style.display = 'flex';
            authModal.style.opacity = '1';
          }
          _context6.n = 4;
          break;
        case 3:
          _context6.p = 3;
          _t7 = _context6.v;
          console.error('Auth error:', _t7);
          authModal.style.display = 'flex';
          authModal.style.opacity = '1';
        case 4:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 3]]);
  }));
  return _checkAuth.apply(this, arguments);
}
btnAuthLogin.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
  var email, password, originalText, response, _data, _t;
  return _regenerator().w(function (_context) {
    while (1) switch (_context.p = _context.n) {
      case 0:
        email = authEmail.value.trim();
        password = authPassword.value; // Визуальная индикация загрузки
        originalText = btnAuthLogin.innerText;
        btnAuthLogin.innerText = 'Вход...';
        btnAuthLogin.disabled = true;
        _context.p = 1;
        _context.n = 2;
        return fetch('api/auth.php?action=login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });
      case 2:
        response = _context.v;
        _context.n = 3;
        return response.json();
      case 3:
        _data = _context.v;
        if (_data.success) {
          authError.style.display = 'none';
          checkAuth();
        } else {
          authError.style.display = 'block';
          authError.innerText = _data.error || 'Ошибка записи';
        }
        _context.n = 5;
        break;
      case 4:
        _context.p = 4;
        _t = _context.v;
        authError.style.display = 'block';
        authError.innerText = 'Ошибка соединения с сервером';
      case 5:
        _context.p = 5;
        btnAuthLogin.innerText = originalText;
        btnAuthLogin.disabled = false;
        return _context.f(5);
      case 6:
        return _context.a(2);
    }
  }, _callee, null, [[1, 4, 5, 6]]);
})));
btnLogout.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
  var _t2;
  return _regenerator().w(function (_context2) {
    while (1) switch (_context2.p = _context2.n) {
      case 0:
        _context2.p = 0;
        _context2.n = 1;
        return fetch('api/auth.php?action=logout');
      case 1:
        currentUserEmail = null;
        currentPermissions = [];
        authEmail.value = '';
        authPassword.value = '';
        checkAuth();
        _context2.n = 3;
        break;
      case 2:
        _context2.p = 2;
        _t2 = _context2.v;
        console.error('Logout error:', _t2);
      case 3:
        return _context2.a(2);
    }
  }, _callee2, null, [[0, 2]]);
})));
function updateAccess() {
  console.log('--- updateAccess called ---');
  console.log('currentTarget:', currentTarget);
  console.log('currentPermissions:', currentPermissions);
  console.log('currentUserEmail:', currentUserEmail);
  if (currentPermissions.length === 0 && currentUserEmail === null) {
    console.log('updateAccess: returned early because of no permissions & email');
    return;
  }
  var isSuperuser = currentPermissions.includes('superuser');
  var targetBlockId = blockTargetMap[currentTarget];
  var targetBlock = targetBlockId ? document.getElementById(targetBlockId) : null;
  console.log('targetBlockId:', targetBlockId);
  console.log('targetBlock found:', !!targetBlock);
  blocks.forEach(function (block) {
    block.classList.remove('active');
  });
  if (!targetBlock) {
    console.log('updateAccess: targetBlock not found, showing permissionDenied');
    permissionDenied.style.display = 'block';
    return;
  }
  var requiredTarget = targetBlock.getAttribute('data-required-role') || currentTarget;
  var canAccess = isSuperuser || currentPermissions.includes(requiredTarget);
  console.log('requiredTarget:', requiredTarget);
  console.log('canAccess:', canAccess);
  if (canAccess) {
    targetBlock.classList.add('active');
    console.log('targetBlock active class added. Classes now:', targetBlock.className);
    console.log('Computed display style for targetBlock:', window.getComputedStyle(targetBlock).display);
    permissionDenied.style.display = 'none';
    try {
      if (currentTarget === 'main-page') renderMainPageAdmin();else if (currentTarget === 'ecp-page') renderEcpPageAdmin();else if (currentTarget === 'consulting-page') renderConsultingPageAdmin();else if (currentTarget === 'support-page') renderSupportPageAdmin();else if (currentTarget === 'obuchenie-page') renderObucheniePageAdmin();else if (currentTarget === 'testing-page') renderQuizPageAdmin();else if (currentTarget === 'knowledge-page') renderKnowledgePageAdmin();else if (currentTarget === 'news-page') renderNewsPageAdmin();else if (currentTarget === 'consulting') renderConsultingAdmin();else if (currentTarget === 'education') renderEducationAdmin();else if (currentTarget === 'users') renderUsers();else if (currentTarget === 'about-us') renderAboutUsAdmin();else if (currentTarget === 'contacts') renderContactsAdmin();
    } catch (e) {
      console.error('Error rendering current target in updateAccess:', currentTarget, e);
      alert('Ошибка при отрисовке вкладки ' + currentTarget + ': ' + e.message + '\n\nПожалуйста, отправьте скриншот этой ошибки.');
    }
    var gBtn = document.getElementById('globalSaveBtn');
    if (gBtn) {
      gBtn.style.display = currentTarget === 'users' || currentTarget === 'settings' || currentTarget === 'education' ? 'none' : 'flex';
    }
  } else {
    permissionDenied.style.display = 'block';
  }
}
navItems.forEach(function (item) {
  item.addEventListener('click', function () {
    navItems.forEach(function (n) {
      return n.classList.remove('active');
    });
    item.classList.add('active');
    currentTarget = item.getAttribute('data-target');
    document.getElementById('pageTitle').innerText = item.innerText.trim();
    // Reset active indices on tab change
    window.activeAuthorIndex = null;
    window.activeFeatureCardIndex = undefined;
    updateAccess();
  });
});

// Users Management
var newUserId = document.getElementById('newUserId');
var newUserName = document.getElementById('newUserName');
var newUserPass = document.getElementById('newUserPass');
var btnAddUser = document.getElementById('btnAddUser');
var usersListContent = document.getElementById('usersListContent');
var permSuperuser = document.getElementById('permSuperuser');
var regularPermissions = document.getElementById('regularPermissions');
var permCheckboxes = document.querySelectorAll('.perm-checkbox');

// Logic to disable other checkboxes if superuser is checked
permSuperuser.addEventListener('change', function () {
  if (permSuperuser.checked) {
    regularPermissions.style.opacity = '0.5';
    permCheckboxes.forEach(function (cb) {
      cb.disabled = true;
      cb.checked = false;
    });
  } else {
    regularPermissions.style.opacity = '1';
    permCheckboxes.forEach(function (cb) {
      return cb.disabled = false;
    });
  }
});
function renderUsers() {
  usersListContent.innerHTML = '';
  usersDb = JSON.parse(localStorage.getItem('crzrt_users')) || defaultUsers;
  var permNames = {
    'superuser': '<span style="color:var(--accent-color);font-weight:bold;">Полный доступ</span>',
    'main-page': 'Главная страница',
    'ecp-page': 'ЭТП',
    'consulting-page': 'Консалтинг',
    'support-page': 'Сопровождение',
    'obuchenie-page': 'Обучение',
    'testing-page': 'База тестирования',
    'users': 'Упр. пользователями',
    'contacts': 'Реквизиты',
    'settings': 'Настройки'
  };
  var _loop = function _loop(email) {
    var user = usersDb[email];
    var tr = document.createElement('tr');
    var tdName = document.createElement('td');
    tdName.innerText = user.name || '-';
    var tdEmail = document.createElement('td');
    tdEmail.innerText = email;
    var tdRole = document.createElement('td');
    if (user.permissions && user.permissions.includes('superuser')) {
      tdRole.innerHTML = permNames['superuser'];
    } else if (user.permissions && user.permissions.length > 0) {
      tdRole.innerHTML = user.permissions.map(function (p) {
        return permNames[p];
      }).filter(Boolean).join(', ');
    } else {
      tdRole.innerText = 'Нет прав';
    }
    var tdActions = document.createElement('td');
    if (currentPermissions.includes('superuser')) {
      // Edit Button
      var btnEdit = document.createElement('button');
      btnEdit.className = 'btn-edit';
      btnEdit.innerText = 'Редактировать';
      btnEdit.onclick = function () {
        return openUserModal(email);
      };
      tdActions.appendChild(btnEdit);
      if (email !== currentUserEmail) {
        var btnDel = document.createElement('button');
        btnDel.className = 'btn-delete';
        btnDel.innerText = 'Удалить';
        btnDel.onclick = function () {
          if (confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F ".concat(email, "?"))) {
            delete usersDb[email];
            localStorage.setItem('crzrt_users', JSON.stringify(usersDb));
            renderUsers();
          }
        };
        tdActions.appendChild(btnDel);
      }
    }
    tr.appendChild(tdName);
    tr.appendChild(tdEmail);
    tr.appendChild(tdRole);
    tr.appendChild(tdActions);
    usersListContent.appendChild(tr);
  };
  for (var email in usersDb) {
    _loop(email);
  }
}
var editingUserEmail = null;
function openUserModal() {
  var email = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  editingUserEmail = email;
  var modal = document.getElementById('userModal');
  var title = document.getElementById('userModalTitle');
  var emailInput = document.getElementById('newUserId');

  // Reset fields
  document.getElementById('newUserName').value = '';
  emailInput.value = '';
  document.getElementById('newUserPass').value = '';
  document.getElementById('permSuperuser').checked = false;
  permCheckboxes.forEach(function (cb) {
    cb.checked = false;
    cb.disabled = false;
  });
  regularPermissions.style.opacity = '1';
  if (email) {
    var _user = usersDb[email];
    if (_user) {
      title.innerText = 'Редактировать пользователя';
      emailInput.value = email;
      emailInput.disabled = true;
      document.getElementById('newUserName').value = _user.name || '';
      if (_user.permissions.includes('superuser')) {
        document.getElementById('permSuperuser').checked = true;
        permCheckboxes.forEach(function (cb) {
          cb.disabled = true;
        });
        regularPermissions.style.opacity = '0.5';
      } else {
        permCheckboxes.forEach(function (cb) {
          if (_user.permissions.includes(cb.value)) cb.checked = true;
        });
      }
    }
  } else {
    title.innerText = 'Добавить пользователя';
    emailInput.disabled = false;
  }
  modal.style.display = 'flex';
}
function closeUserModal() {
  document.getElementById('userModal').style.display = 'none';
  editingUserEmail = null;
}

// Event listeners initialization for Users
function initUsersEventListeners() {
  var btnOpenAdd = document.getElementById('btnOpenAddUser');
  if (btnOpenAdd) {
    btnOpenAdd.onclick = function () {
      return openUserModal();
    };
  }
  var btnClose = document.getElementById('btnUserModalClose');
  if (btnClose) btnClose.onclick = closeUserModal;
  var btnCancel = document.getElementById('btnCancelUserModal');
  if (btnCancel) btnCancel.onclick = closeUserModal;
  var btnAdd = document.getElementById('btnAddUser');
  if (btnAdd) {
    btnAdd.onclick = function () {
      var email = newUserId.value.trim();
      var name = newUserName.value.trim() || 'Без имени';
      var pass = newUserPass.value.trim();
      var permissions = [];
      if (permSuperuser.checked) {
        permissions.push('superuser');
      } else {
        permCheckboxes.forEach(function (cb) {
          if (cb.checked) permissions.push(cb.value);
        });
      }
      if (email) {
        if (!editingUserEmail && usersDb[email]) {
          alert('Пользователь с таким email уже существует');
          return;
        }
        if (!editingUserEmail && !pass) {
          alert('Для нового пользователя обязателен пароль');
          return;
        }
        var userData = _objectSpread(_objectSpread({}, usersDb[email] || {}), {}, {
          name: name,
          permissions: permissions
        });
        if (pass) userData.password = pass;
        usersDb[email] = userData;
        localStorage.setItem('crzrt_users', JSON.stringify(usersDb));
        renderUsers();
        closeUserModal();
      } else {
        alert('Заполните E-mail');
      }
    };
  }
}

// Call init immediately and also whenever users section might be re-rendered or tab switched
initUsersEventListeners();

// Drag and drop for uploadWrapper
if (uploadWrapper) {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
    uploadWrapper.addEventListener(eventName, preventDefaults, false);
  });
  ['dragenter', 'dragover'].forEach(function (eventName) {
    uploadWrapper.addEventListener(eventName, highlight, false);
  });
  ['dragleave', 'drop'].forEach(function (eventName) {
    uploadWrapper.addEventListener(eventName, unhighlight, false);
  });
  uploadWrapper.addEventListener('drop', handleDrop, false);
}
if (imageInput) {
  imageInput.addEventListener('change', function (e) {
    handleFiles(this.files);
    this.value = '';
  });
}
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}
function highlight(e) {
  if (uploadWrapper) {
    uploadWrapper.style.borderColor = 'var(--accent-color)';
    uploadWrapper.style.background = 'rgba(41, 151, 255, 0.1)';
  }
}
function unhighlight(e) {
  if (uploadWrapper) {
    uploadWrapper.style.borderColor = '';
    uploadWrapper.style.background = '';
  }
}
function handleDrop(e) {
  var dt = e.dataTransfer;
  var files = dt.files;
  handleFiles(files);
}
var docFileInput = document.getElementById('docFileInput');
if (docFileInput) {
  docFileInput.addEventListener('change', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var file, targetId, formData, _AdminEcp, _AdminSupport, _AdminSupport$isSuppo, _AdminSupport2, _AdminKnowledge, _AdminObuchenie, response, result, input, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          file = this.files && this.files[0];
          targetId = window.fileUploadTarget;
          this.value = '';
          if (!(!file || !targetId)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2);
        case 1:
          formData = new FormData();
          formData.append('file', file);
          formData.append('slot', targetId.replace(/[^a-z0-9_]/gi, '_'));
          _context3.p = 2;
          _context3.n = 3;
          return fetch('api/upload-file.php', {
            method: 'POST',
            body: formData
          });
        case 3:
          response = _context3.v;
          _context3.n = 4;
          return response.json();
        case 4:
          result = _context3.v;
          if (!(!response.ok || !(result !== null && result !== void 0 && result.success) || !(result !== null && result !== void 0 && result.url))) {
            _context3.n = 5;
            break;
          }
          throw new Error((result === null || result === void 0 ? void 0 : result.error) || 'Не удалось загрузить файл');
        case 5:
          input = document.getElementById(targetId);
          if (input) input.value = result.url;
          if ((_AdminEcp = AdminEcp) !== null && _AdminEcp !== void 0 && _AdminEcp.setFileUploadState) {
            AdminEcp.setFileUploadState(targetId, result.url, result.name || file.name);
          }
          if ((_AdminSupport = AdminSupport) !== null && _AdminSupport !== void 0 && (_AdminSupport$isSuppo = _AdminSupport.isSupportFileInputId) !== null && _AdminSupport$isSuppo !== void 0 && _AdminSupport$isSuppo.call(_AdminSupport, targetId) && (_AdminSupport2 = AdminSupport) !== null && _AdminSupport2 !== void 0 && _AdminSupport2.setFileUploadState) {
            AdminSupport.setFileUploadState(targetId, result.url, result.name || file.name);
          }
          if ((_AdminKnowledge = AdminKnowledge) !== null && _AdminKnowledge !== void 0 && _AdminKnowledge.setFileUploadState) {
            AdminKnowledge.setFileUploadState(targetId, result.url, result.name || file.name);
          }
          if (targetId.startsWith('obuchenie_') && (_AdminObuchenie = AdminObuchenie) !== null && _AdminObuchenie !== void 0 && _AdminObuchenie.setFileUploadState) {
            AdminObuchenie.setFileUploadState(targetId, result.url, result.name || file.name);
          }
          updateSaveButtonsState({
            boxShadow: '0 0 15px rgba(52, 199, 89, 0.5)',
            text: 'Сохраните изменения!'
          });
          _context3.n = 7;
          break;
        case 6:
          _context3.p = 6;
          _t3 = _context3.v;
          alert('Ошибка загрузки файла: ' + _t3.message);
        case 7:
          _context3.p = 7;
          window.fileUploadTarget = null;
          return _context3.f(7);
        case 8:
          return _context3.a(2);
      }
    }, _callee3, this, [[2, 6, 7, 8]]);
  })));
}
function getCropAspectForUpload(uploadId) {
  var _window$cropTarget, _AdminEcp2, _AdminEcp2$isEcpUploa, _AdminConsultingPage, _AdminConsultingPage$, _AdminSupport3, _AdminSupport3$isSupp, _AdminObuchenie2, _AdminObuchenie2$isOb, _AdminKnowledge2, _AdminKnowledge2$isKn, _AdminNews, _AdminNews$isNewsUplo, _AdminLanding;
  if (((_window$cropTarget = window.cropTarget) === null || _window$cropTarget === void 0 ? void 0 : _window$cropTarget.uploadId) === uploadId) {
    var _window$cropTarget2;
    var forced = Number((_window$cropTarget2 = window.cropTarget) === null || _window$cropTarget2 === void 0 ? void 0 : _window$cropTarget2.aspect);
    if (Number.isFinite(forced) && forced > 0) return forced;
  }
  if (uploadId === 'consulting_why_side_image') return 489 / 763;
  if ((_AdminEcp2 = AdminEcp) !== null && _AdminEcp2 !== void 0 && (_AdminEcp2$isEcpUploa = _AdminEcp2.isEcpUploadId) !== null && _AdminEcp2$isEcpUploa !== void 0 && _AdminEcp2$isEcpUploa.call(_AdminEcp2, uploadId)) return AdminEcp.getAspect(uploadId);
  if ((_AdminConsultingPage = AdminConsultingPage) !== null && _AdminConsultingPage !== void 0 && (_AdminConsultingPage$ = _AdminConsultingPage.isConsultingUploadId) !== null && _AdminConsultingPage$ !== void 0 && _AdminConsultingPage$.call(_AdminConsultingPage, uploadId)) return AdminConsultingPage.getAspect(uploadId);
  if ((_AdminSupport3 = AdminSupport) !== null && _AdminSupport3 !== void 0 && (_AdminSupport3$isSupp = _AdminSupport3.isSupportUploadId) !== null && _AdminSupport3$isSupp !== void 0 && _AdminSupport3$isSupp.call(_AdminSupport3, uploadId)) return AdminSupport.getAspect(uploadId);
  if ((_AdminObuchenie2 = AdminObuchenie) !== null && _AdminObuchenie2 !== void 0 && (_AdminObuchenie2$isOb = _AdminObuchenie2.isObuchenieUploadId) !== null && _AdminObuchenie2$isOb !== void 0 && _AdminObuchenie2$isOb.call(_AdminObuchenie2, uploadId)) return AdminObuchenie.getAspect(uploadId);
  if ((_AdminKnowledge2 = AdminKnowledge) !== null && _AdminKnowledge2 !== void 0 && (_AdminKnowledge2$isKn = _AdminKnowledge2.isKnowledgeUploadId) !== null && _AdminKnowledge2$isKn !== void 0 && _AdminKnowledge2$isKn.call(_AdminKnowledge2, uploadId)) return AdminKnowledge.getAspect(uploadId);
  if ((_AdminNews = AdminNews) !== null && _AdminNews !== void 0 && (_AdminNews$isNewsUplo = _AdminNews.isNewsUploadId) !== null && _AdminNews$isNewsUplo !== void 0 && _AdminNews$isNewsUplo.call(_AdminNews, uploadId)) return AdminNews.getAspect(uploadId);
  if ((_AdminLanding = AdminLanding) !== null && _AdminLanding !== void 0 && _AdminLanding.getAspect) return AdminLanding.getAspect(uploadId);
  return window.activeAuthorIndex !== null ? 1 : 16 / 9;
}
function setCropperWrapperLayout(aspect) {
  if (!cropperWrapper) return;
  cropperWrapper.classList.toggle('cropper-wrapper--tall-portrait', Number.isFinite(aspect) && aspect > 0 && aspect < 0.85);
}
function buildStandardCropperOptions(aspect) {
  return {
    viewMode: 2,
    dragMode: 'move',
    autoCropArea: 1,
    background: false,
    zoomable: true,
    guides: true,
    center: true,
    highlight: true,
    aspectRatio: aspect
  };
}
function handleFiles(files) {
  if (files && files.length > 0) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var _AdminLanding2, _window$cropTarget3, _AdminLanding3, _AdminLanding3$isPart, _AdminLanding4, _AdminLanding5, _AdminEcp3, _AdminEcp3$isEcpUploa, _AdminConsultingPage2, _AdminConsultingPage3, _AdminSupport4, _AdminSupport4$isSupp, _AdminObuchenie3, _AdminObuchenie3$isOb, _AdminKnowledge3, _AdminKnowledge3$isKn, _AdminNews2, _AdminNews2$isNewsUpl, _AdminLanding6;
      imageToCrop.src = e.target.result;

      // Show global cropper modal
      var globalContainer = document.getElementById('cropperGlobalContainer');
      globalContainer.style.display = 'flex'; // Modal is flex centered

      if (cropper) {
        cropper.destroy();
        cropper = null;
      }
      if ((_AdminLanding2 = AdminLanding) !== null && _AdminLanding2 !== void 0 && _AdminLanding2.unmountPartnerCropGuides) AdminLanding.unmountPartnerCropGuides();
      var uploadId = (_window$cropTarget3 = window.cropTarget) === null || _window$cropTarget3 === void 0 ? void 0 : _window$cropTarget3.uploadId;
      var isPartner = (_AdminLanding3 = AdminLanding) === null || _AdminLanding3 === void 0 || (_AdminLanding3$isPart = _AdminLanding3.isPartnerUploadId) === null || _AdminLanding3$isPart === void 0 ? void 0 : _AdminLanding3$isPart.call(_AdminLanding3, uploadId);
      var isCircle = uploadId === 'm_chat_operator_avatar';
      if (cropperWrapper) {
        cropperWrapper.classList.toggle('cropper-wrapper--circle', isCircle);
      }
      if ((_AdminLanding4 = AdminLanding) !== null && _AdminLanding4 !== void 0 && _AdminLanding4.setPartnerCropperMode) {
        AdminLanding.setPartnerCropperMode(isPartner, cropperWrapper);
      }
      var cropperOpts;
      if (isPartner && (_AdminLanding5 = AdminLanding) !== null && _AdminLanding5 !== void 0 && _AdminLanding5.getCropperOptions) {
        cropperOpts = AdminLanding.getCropperOptions(uploadId);
        setCropperWrapperLayout(NaN);
      } else if (uploadId && ((_AdminEcp3 = AdminEcp) !== null && _AdminEcp3 !== void 0 && (_AdminEcp3$isEcpUploa = _AdminEcp3.isEcpUploadId) !== null && _AdminEcp3$isEcpUploa !== void 0 && _AdminEcp3$isEcpUploa.call(_AdminEcp3, uploadId) || (_AdminConsultingPage2 = AdminConsultingPage) !== null && _AdminConsultingPage2 !== void 0 && (_AdminConsultingPage3 = _AdminConsultingPage2.isConsultingUploadId) !== null && _AdminConsultingPage3 !== void 0 && _AdminConsultingPage3.call(_AdminConsultingPage2, uploadId) || (_AdminSupport4 = AdminSupport) !== null && _AdminSupport4 !== void 0 && (_AdminSupport4$isSupp = _AdminSupport4.isSupportUploadId) !== null && _AdminSupport4$isSupp !== void 0 && _AdminSupport4$isSupp.call(_AdminSupport4, uploadId) || (_AdminObuchenie3 = AdminObuchenie) !== null && _AdminObuchenie3 !== void 0 && (_AdminObuchenie3$isOb = _AdminObuchenie3.isObuchenieUploadId) !== null && _AdminObuchenie3$isOb !== void 0 && _AdminObuchenie3$isOb.call(_AdminObuchenie3, uploadId) || (_AdminKnowledge3 = AdminKnowledge) !== null && _AdminKnowledge3 !== void 0 && (_AdminKnowledge3$isKn = _AdminKnowledge3.isKnowledgeUploadId) !== null && _AdminKnowledge3$isKn !== void 0 && _AdminKnowledge3$isKn.call(_AdminKnowledge3, uploadId) || (_AdminNews2 = AdminNews) !== null && _AdminNews2 !== void 0 && (_AdminNews2$isNewsUpl = _AdminNews2.isNewsUploadId) !== null && _AdminNews2$isNewsUpl !== void 0 && _AdminNews2$isNewsUpl.call(_AdminNews2, uploadId) || window.activeAuthorIndex !== null)) {
        var aspect = getCropAspectForUpload(uploadId);
        cropperOpts = buildStandardCropperOptions(aspect);
        setCropperWrapperLayout(aspect);
      } else if (uploadId && (_AdminLanding6 = AdminLanding) !== null && _AdminLanding6 !== void 0 && _AdminLanding6.getCropperOptions) {
        cropperOpts = AdminLanding.getCropperOptions(uploadId);
        setCropperWrapperLayout(NaN);
      } else {
        var _aspect = getCropAspectForUpload(uploadId);
        cropperOpts = buildStandardCropperOptions(_aspect);
        setCropperWrapperLayout(_aspect);
      }
      cropper = new Cropper(imageToCrop, cropperOpts);
    };
    reader.readAsDataURL(files[0]);
  }
}
var HERO_MAX_BASE64_BYTES = 1.6 * 1024 * 1024;
var PROMO_COVER_MAX_BASE64_BYTES = 1.6 * 1024 * 1024;
function dataUrlBytes(dataUrl) {
  var commaIdx = dataUrl === null || dataUrl === void 0 ? void 0 : dataUrl.indexOf(',');
  if (commaIdx === -1) return 0;
  var base64 = dataUrl.slice(commaIdx + 1);
  var padding = (base64.match(/=+$/) || [''])[0].length;
  return Math.floor(base64.length * 3 / 4) - padding;
}
function scaleCanvas(sourceCanvas, scale) {
  var next = document.createElement('canvas');
  next.width = Math.max(1, Math.round(sourceCanvas.width * scale));
  next.height = Math.max(1, Math.round(sourceCanvas.height * scale));
  var ctx = next.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, 0, 0, next.width, next.height);
  }
  return next;
}
function makeDataUrlWithinLimit(canvas, maxBytes) {
  var startQuality = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.76;
  var quality = startQuality;
  var workingCanvas = canvas;
  var result = workingCanvas.toDataURL('image/jpeg', quality);
  var tries = 0;
  while (dataUrlBytes(result) > maxBytes && tries < 10) {
    tries += 1;
    if (quality > 0.70) {
      quality = Math.max(0.70, quality - 0.06);
    } else {
      workingCanvas = scaleCanvas(workingCanvas, 0.88);
    }
    result = workingCanvas.toDataURL('image/jpeg', quality);
  }
  return result;
}
function makeHeroDataUrlWithinLimit(canvas) {
  return makeDataUrlWithinLimit(canvas, HERO_MAX_BASE64_BYTES, 0.85);
}
function makePromoCoverDataUrlWithinLimit(canvas) {
  return makeDataUrlWithinLimit(canvas, PROMO_COVER_MAX_BASE64_BYTES, 0.88);
}
btnZoomIn.addEventListener('click', function () {
  var _window$cropTarget4, _AdminLanding7, _AdminLanding7$isPart, _AdminLanding$getZoom, _AdminLanding8, _AdminLanding8$getZoo;
  if (!cropper) return;
  var uploadId = (_window$cropTarget4 = window.cropTarget) === null || _window$cropTarget4 === void 0 ? void 0 : _window$cropTarget4.uploadId;
  if ((_AdminLanding7 = AdminLanding) !== null && _AdminLanding7 !== void 0 && (_AdminLanding7$isPart = _AdminLanding7.isPartnerUploadId) !== null && _AdminLanding7$isPart !== void 0 && _AdminLanding7$isPart.call(_AdminLanding7, uploadId)) {
    AdminLanding.partnerZoomBy(cropper, 1);
    return;
  }
  var step = (_AdminLanding$getZoom = (_AdminLanding8 = AdminLanding) === null || _AdminLanding8 === void 0 || (_AdminLanding8$getZoo = _AdminLanding8.getZoomStep) === null || _AdminLanding8$getZoo === void 0 ? void 0 : _AdminLanding8$getZoo.call(_AdminLanding8, uploadId, 1)) !== null && _AdminLanding$getZoom !== void 0 ? _AdminLanding$getZoom : 0.1;
  cropper.zoom(step);
});
btnZoomOut.addEventListener('click', function () {
  var _window$cropTarget5, _AdminLanding9, _AdminLanding9$isPart, _AdminLanding$getZoom2, _AdminLanding0, _AdminLanding0$getZoo;
  if (!cropper) return;
  var uploadId = (_window$cropTarget5 = window.cropTarget) === null || _window$cropTarget5 === void 0 ? void 0 : _window$cropTarget5.uploadId;
  if ((_AdminLanding9 = AdminLanding) !== null && _AdminLanding9 !== void 0 && (_AdminLanding9$isPart = _AdminLanding9.isPartnerUploadId) !== null && _AdminLanding9$isPart !== void 0 && _AdminLanding9$isPart.call(_AdminLanding9, uploadId)) {
    AdminLanding.partnerZoomBy(cropper, -1);
    return;
  }
  var step = (_AdminLanding$getZoom2 = (_AdminLanding0 = AdminLanding) === null || _AdminLanding0 === void 0 || (_AdminLanding0$getZoo = _AdminLanding0.getZoomStep) === null || _AdminLanding0$getZoo === void 0 ? void 0 : _AdminLanding0$getZoo.call(_AdminLanding0, uploadId, -1)) !== null && _AdminLanding$getZoom2 !== void 0 ? _AdminLanding$getZoom2 : -0.1;
  cropper.zoom(step);
});
(_document$getElementB2 = document.getElementById('btnPartnerFit')) === null || _document$getElementB2 === void 0 || _document$getElementB2.addEventListener('click', function () {
  var _AdminLanding1;
  if (cropper && (_AdminLanding1 = AdminLanding) !== null && _AdminLanding1 !== void 0 && _AdminLanding1.fitPartnerLogoToSafeZone) {
    AdminLanding.fitPartnerLogoToSafeZone(cropper);
  }
});
btnCrop.addEventListener('click', function () {
  if (cropper) {
    var _AdminEcp4, _AdminEcp4$isEcpUploa, _AdminConsultingPage4, _AdminConsultingPage5, _AdminSupport5, _AdminSupport5$isSupp, _AdminObuchenie4, _AdminObuchenie4$isOb, _AdminKnowledge4, _AdminKnowledge4$isKn, _AdminNews3, _AdminNews3$isNewsUpl, _window$cropTarget6, _AdminEcp5, _AdminEcp5$isEcpUploa, _AdminConsultingPage6, _AdminConsultingPage7, _AdminSupport6, _AdminSupport6$isSupp, _AdminObuchenie5, _AdminObuchenie5$isOb, _AdminKnowledge5, _AdminKnowledge5$isKn, _AdminNews4, _AdminNews4$isNewsUpl, _AdminLanding10, _AdminLanding11, _AdminLanding11$isPar, _AdminLanding12, _AdminLanding12$isLan, _AdminEcp6, _AdminEcp6$isEcpUploa, _AdminConsultingPage8, _AdminConsultingPage9, _AdminSupport7, _AdminSupport7$isSupp, _AdminObuchenie6, _AdminObuchenie6$isOb, _AdminKnowledge6, _AdminKnowledge6$isKn, _AdminNews5, _AdminNews5$isNewsUpl, _AdminLanding13, _AdminLanding14;
    var resWidth = 1200;
    var resHeight = 675;
    if (window.activeAuthorIndex !== null) {
      resWidth = 400;
      resHeight = 400;
    } else if (window.cropTarget && (_AdminEcp4 = AdminEcp) !== null && _AdminEcp4 !== void 0 && (_AdminEcp4$isEcpUploa = _AdminEcp4.isEcpUploadId) !== null && _AdminEcp4$isEcpUploa !== void 0 && _AdminEcp4$isEcpUploa.call(_AdminEcp4, window.cropTarget.uploadId)) {
      var _AdminEcp$getCropSize = AdminEcp.getCropSize(window.cropTarget.uploadId);
      var _AdminEcp$getCropSize2 = _slicedToArray(_AdminEcp$getCropSize, 2);
      resWidth = _AdminEcp$getCropSize2[0];
      resHeight = _AdminEcp$getCropSize2[1];
    } else if (window.cropTarget && (_AdminConsultingPage4 = AdminConsultingPage) !== null && _AdminConsultingPage4 !== void 0 && (_AdminConsultingPage5 = _AdminConsultingPage4.isConsultingUploadId) !== null && _AdminConsultingPage5 !== void 0 && _AdminConsultingPage5.call(_AdminConsultingPage4, window.cropTarget.uploadId)) {
      var _AdminConsultingPage$2 = AdminConsultingPage.getCropSize(window.cropTarget.uploadId);
      var _AdminConsultingPage$3 = _slicedToArray(_AdminConsultingPage$2, 2);
      resWidth = _AdminConsultingPage$3[0];
      resHeight = _AdminConsultingPage$3[1];
    } else if (window.cropTarget && (_AdminSupport5 = AdminSupport) !== null && _AdminSupport5 !== void 0 && (_AdminSupport5$isSupp = _AdminSupport5.isSupportUploadId) !== null && _AdminSupport5$isSupp !== void 0 && _AdminSupport5$isSupp.call(_AdminSupport5, window.cropTarget.uploadId)) {
      var _AdminSupport$getCrop = AdminSupport.getCropSize(window.cropTarget.uploadId);
      var _AdminSupport$getCrop2 = _slicedToArray(_AdminSupport$getCrop, 2);
      resWidth = _AdminSupport$getCrop2[0];
      resHeight = _AdminSupport$getCrop2[1];
    } else if (window.cropTarget && (_AdminObuchenie4 = AdminObuchenie) !== null && _AdminObuchenie4 !== void 0 && (_AdminObuchenie4$isOb = _AdminObuchenie4.isObuchenieUploadId) !== null && _AdminObuchenie4$isOb !== void 0 && _AdminObuchenie4$isOb.call(_AdminObuchenie4, window.cropTarget.uploadId)) {
      var _AdminObuchenie$getCr = AdminObuchenie.getCropSize(window.cropTarget.uploadId);
      var _AdminObuchenie$getCr2 = _slicedToArray(_AdminObuchenie$getCr, 2);
      resWidth = _AdminObuchenie$getCr2[0];
      resHeight = _AdminObuchenie$getCr2[1];
    } else if (window.cropTarget && (_AdminKnowledge4 = AdminKnowledge) !== null && _AdminKnowledge4 !== void 0 && (_AdminKnowledge4$isKn = _AdminKnowledge4.isKnowledgeUploadId) !== null && _AdminKnowledge4$isKn !== void 0 && _AdminKnowledge4$isKn.call(_AdminKnowledge4, window.cropTarget.uploadId)) {
      var _AdminKnowledge$getCr = AdminKnowledge.getCropSize(window.cropTarget.uploadId);
      var _AdminKnowledge$getCr2 = _slicedToArray(_AdminKnowledge$getCr, 2);
      resWidth = _AdminKnowledge$getCr2[0];
      resHeight = _AdminKnowledge$getCr2[1];
    } else if (window.cropTarget && (_AdminNews3 = AdminNews) !== null && _AdminNews3 !== void 0 && (_AdminNews3$isNewsUpl = _AdminNews3.isNewsUploadId) !== null && _AdminNews3$isNewsUpl !== void 0 && _AdminNews3$isNewsUpl.call(_AdminNews3, window.cropTarget.uploadId)) {
      var _AdminNews$getCropSiz = AdminNews.getCropSize(window.cropTarget.uploadId);
      var _AdminNews$getCropSiz2 = _slicedToArray(_AdminNews$getCropSiz, 2);
      resWidth = _AdminNews$getCropSiz2[0];
      resHeight = _AdminNews$getCropSiz2[1];
    } else if (window.cropTarget && AdminLanding) {
      var _AdminLanding$getCrop = AdminLanding.getCropSize(window.cropTarget.uploadId);
      var _AdminLanding$getCrop2 = _slicedToArray(_AdminLanding$getCrop, 2);
      resWidth = _AdminLanding$getCrop2[0];
      resHeight = _AdminLanding$getCrop2[1];
    }
    var uploadId = (_window$cropTarget6 = window.cropTarget) === null || _window$cropTarget6 === void 0 ? void 0 : _window$cropTarget6.uploadId;
    var canvasOpts = {
      width: resWidth,
      height: resHeight
    };
    if (window.cropTarget && ((_AdminEcp5 = AdminEcp) !== null && _AdminEcp5 !== void 0 && (_AdminEcp5$isEcpUploa = _AdminEcp5.isEcpUploadId) !== null && _AdminEcp5$isEcpUploa !== void 0 && _AdminEcp5$isEcpUploa.call(_AdminEcp5, uploadId) || (_AdminConsultingPage6 = AdminConsultingPage) !== null && _AdminConsultingPage6 !== void 0 && (_AdminConsultingPage7 = _AdminConsultingPage6.isConsultingUploadId) !== null && _AdminConsultingPage7 !== void 0 && _AdminConsultingPage7.call(_AdminConsultingPage6, uploadId) || (_AdminSupport6 = AdminSupport) !== null && _AdminSupport6 !== void 0 && (_AdminSupport6$isSupp = _AdminSupport6.isSupportUploadId) !== null && _AdminSupport6$isSupp !== void 0 && _AdminSupport6$isSupp.call(_AdminSupport6, uploadId) || (_AdminObuchenie5 = AdminObuchenie) !== null && _AdminObuchenie5 !== void 0 && (_AdminObuchenie5$isOb = _AdminObuchenie5.isObuchenieUploadId) !== null && _AdminObuchenie5$isOb !== void 0 && _AdminObuchenie5$isOb.call(_AdminObuchenie5, uploadId) || (_AdminKnowledge5 = AdminKnowledge) !== null && _AdminKnowledge5 !== void 0 && (_AdminKnowledge5$isKn = _AdminKnowledge5.isKnowledgeUploadId) !== null && _AdminKnowledge5$isKn !== void 0 && _AdminKnowledge5$isKn.call(_AdminKnowledge5, uploadId) || (_AdminNews4 = AdminNews) !== null && _AdminNews4 !== void 0 && (_AdminNews4$isNewsUpl = _AdminNews4.isNewsUploadId) !== null && _AdminNews4$isNewsUpl !== void 0 && _AdminNews4$isNewsUpl.call(_AdminNews4, uploadId))) {
      canvasOpts = {
        width: resWidth,
        height: resHeight,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      };
    } else if (window.cropTarget && (_AdminLanding10 = AdminLanding) !== null && _AdminLanding10 !== void 0 && _AdminLanding10.getCroppedCanvasOptions) {
      canvasOpts = AdminLanding.getCroppedCanvasOptions(uploadId);
    }
    var canvas = cropper.getCroppedCanvas(canvasOpts);
    var isPartner = (_AdminLanding11 = AdminLanding) === null || _AdminLanding11 === void 0 || (_AdminLanding11$isPar = _AdminLanding11.isPartnerUploadId) === null || _AdminLanding11$isPar === void 0 ? void 0 : _AdminLanding11$isPar.call(_AdminLanding11, uploadId);
    var isLandingMainHero = (_AdminLanding12 = AdminLanding) === null || _AdminLanding12 === void 0 || (_AdminLanding12$isLan = _AdminLanding12.isLandingMainHeroUploadId) === null || _AdminLanding12$isLan === void 0 ? void 0 : _AdminLanding12$isLan.call(_AdminLanding12, uploadId);
    var isHeroSlide = Boolean(uploadId && (uploadId.startsWith('m_hero_bg_') || /^(ecp|consulting|support|obuchenie|knowledge|news)_hero_bg(_\d+)?$/.test(uploadId) || uploadId === 'ecp_support_bg'));
    var isPromoCover = uploadId === 'obuchenie_cal_promo_image' || uploadId === 'obuchenie_testing_image' || uploadId === 'consulting_why_side_image';
    var resultBase64 = isPartner ? canvas.toDataURL('image/png') : isPromoCover ? makePromoCoverDataUrlWithinLimit(canvas) : isLandingMainHero ? canvas.toDataURL('image/jpeg', 0.95) : isHeroSlide ? makeHeroDataUrlWithinLimit(canvas) : canvas.toDataURL('image/jpeg', 0.85);
    if (window.activeAuthorIndex !== null) {
      var idx = window.activeAuthorIndex;
      var el = document.getElementById("c_author_photo_preview_".concat(idx));
      if (el) {
        el.src = resultBase64;
        el.style.display = 'block';
        document.getElementById("c_author_photo_text_".concat(idx)).style.display = 'none';
        document.getElementById("c_author_avatarUrl_".concat(idx)).value = resultBase64;
      }
      window.activeAuthorIndex = null;
    } else if (window.cropTarget && (_AdminEcp6 = AdminEcp) !== null && _AdminEcp6 !== void 0 && (_AdminEcp6$isEcpUploa = _AdminEcp6.isEcpUploadId) !== null && _AdminEcp6$isEcpUploa !== void 0 && _AdminEcp6$isEcpUploa.call(_AdminEcp6, window.cropTarget.uploadId)) {
      AdminEcp.applyCroppedImage(window.cropTarget.uploadId, resultBase64);
      window.cropTarget = null;
    } else if (window.cropTarget && (_AdminConsultingPage8 = AdminConsultingPage) !== null && _AdminConsultingPage8 !== void 0 && (_AdminConsultingPage9 = _AdminConsultingPage8.isConsultingUploadId) !== null && _AdminConsultingPage9 !== void 0 && _AdminConsultingPage9.call(_AdminConsultingPage8, window.cropTarget.uploadId)) {
      AdminConsultingPage.applyCroppedImage(window.cropTarget.uploadId, resultBase64);
      window.cropTarget = null;
    } else if (window.cropTarget && (_AdminSupport7 = AdminSupport) !== null && _AdminSupport7 !== void 0 && (_AdminSupport7$isSupp = _AdminSupport7.isSupportUploadId) !== null && _AdminSupport7$isSupp !== void 0 && _AdminSupport7$isSupp.call(_AdminSupport7, window.cropTarget.uploadId)) {
      AdminSupport.applyCroppedImage(window.cropTarget.uploadId, resultBase64);
      window.cropTarget = null;
    } else if (window.cropTarget && (_AdminObuchenie6 = AdminObuchenie) !== null && _AdminObuchenie6 !== void 0 && (_AdminObuchenie6$isOb = _AdminObuchenie6.isObuchenieUploadId) !== null && _AdminObuchenie6$isOb !== void 0 && _AdminObuchenie6$isOb.call(_AdminObuchenie6, window.cropTarget.uploadId)) {
      AdminObuchenie.applyCroppedImage(window.cropTarget.uploadId, resultBase64);
      window.cropTarget = null;
    } else if (window.cropTarget && (_AdminKnowledge6 = AdminKnowledge) !== null && _AdminKnowledge6 !== void 0 && (_AdminKnowledge6$isKn = _AdminKnowledge6.isKnowledgeUploadId) !== null && _AdminKnowledge6$isKn !== void 0 && _AdminKnowledge6$isKn.call(_AdminKnowledge6, window.cropTarget.uploadId)) {
      AdminKnowledge.applyCroppedImage(window.cropTarget.uploadId, resultBase64);
    } else if (window.cropTarget && (_AdminNews5 = AdminNews) !== null && _AdminNews5 !== void 0 && (_AdminNews5$isNewsUpl = _AdminNews5.isNewsUploadId) !== null && _AdminNews5$isNewsUpl !== void 0 && _AdminNews5$isNewsUpl.call(_AdminNews5, window.cropTarget.uploadId)) {
      AdminNews.applyCroppedImage(window.cropTarget.uploadId, resultBase64);
      window.cropTarget = null;
    } else if (window.cropTarget && AdminLanding) {
      AdminLanding.applyCroppedImage(window.cropTarget.uploadId, resultBase64);
      window.cropTarget = null;
    } else if (window.activeAboutImage) {
      var _el = document.getElementById('a_image_preview');
      if (_el) {
        _el.src = resultBase64;
        _el.style.display = 'block';
        document.getElementById('a_image_placeholder').style.display = 'none';
        document.getElementById('a_image_val').value = resultBase64;
      }
      window.activeAboutImage = false;
    }
    document.getElementById('cropperGlobalContainer').style.display = 'none';
    updateSaveButtonsState({
      boxShadow: '0 0 15px rgba(52, 199, 89, 0.5)',
      text: 'Сохраните изменения!'
    });
    cropper.destroy();
    cropper = null;
    setCropperWrapperLayout(NaN);
    if (cropperWrapper) cropperWrapper.classList.remove('cropper-wrapper--circle');
    if ((_AdminLanding13 = AdminLanding) !== null && _AdminLanding13 !== void 0 && _AdminLanding13.unmountPartnerCropGuides) AdminLanding.unmountPartnerCropGuides();
    if ((_AdminLanding14 = AdminLanding) !== null && _AdminLanding14 !== void 0 && _AdminLanding14.setPartnerCropperMode) AdminLanding.setPartnerCropperMode(false, cropperWrapper);
  }
});
btnCancelCrop.addEventListener('click', function () {
  var _AdminLanding15, _AdminLanding16;
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
  setCropperWrapperLayout(NaN);
  if (cropperWrapper) cropperWrapper.classList.remove('cropper-wrapper--circle');
  if ((_AdminLanding15 = AdminLanding) !== null && _AdminLanding15 !== void 0 && _AdminLanding15.unmountPartnerCropGuides) AdminLanding.unmountPartnerCropGuides();
  if ((_AdminLanding16 = AdminLanding) !== null && _AdminLanding16 !== void 0 && _AdminLanding16.setPartnerCropperMode) AdminLanding.setPartnerCropperMode(false, cropperWrapper);
  document.getElementById('cropperGlobalContainer').style.display = 'none';
  window.activeAuthorIndex = null;
  window.activeFeatureCardIndex = undefined;
  window.activeAboutImage = false;
  window.cropTarget = null;
});

// =======================
// Consulting Admin Logic
// =======================

var defaultConsultingData = {
  authors: [{
    id: '1',
    avatarText: 'Д',
    name: 'Дмитрий',
    phone: '+7 900 000-00-00',
    email: 'dima@crzrt.ru'
  }, {
    id: '2',
    avatarText: 'ИИ',
    name: 'Иванов И.И.',
    phone: '+7 900 000-00-01',
    email: 'ivanov@crzrt.ru'
  }],
  services: [{
    id: 'business',
    category: 'customers',
    title: 'Решения для бизнеса',
    highlight: 'Юридические решения – это не расходы, а защита ваших денег и времени.',
    benefits: 'анализ бизнес-модели на предмет потенциальных рисков: исков, штрафов, претензий\nшаблоны рабочих документов: договоры, приказы, положение о закупках (223-ФЗ)\nпрактические советы и стратегии минимизации негативных последствий',
    disclaimer: ''
  }, {
    id: 'deals',
    category: 'customers',
    title: 'Сопровождение сделок',
    highlight: 'Сопровождение сделки абсолютно необходимо для минимизации рисков и безопасности всех сторон.',
    benefits: 'Правовую экспертизу объектов перед сделкой\nподготовка полного и юридически выверенного пакета документов\nорганизацию безопасных расчетов между контрагентами\nсопровождение сделки и проверку «чистоты» подписания',
    disclaimer: ''
  }, {
    id: 'disputes',
    category: 'suppliers',
    title: 'Сложные судебные споры',
    highlight: 'Суд - крайняя стадия конфликтной ситуации, и к ней нужно быть готовым заранее.',
    benefits: 'правовой аудит ситуации и досудебную подготовку (медиация)\nформирование железной доказательной базы и процессуальных документов\nпредставительство ваших интересов в судах всех инстанций\nсопровождение на этапе исполнительного производства',
    disclaimer: ''
  }, {
    id: 'corporate',
    category: 'customers',
    title: 'Корпоративное право',
    highlight: 'В процессе деятельности любое юридическое лицо руководствуется прежде всего нормами корпоративного права, и их исполнение лучше доверить профессионалам.',
    benefits: 'Система «под ключ»: регистрация, ликвидация или реорганизация юридических лиц, в том числе унитарных предприятий\nподготовка решений и протоколов собраний\nдетальная правовая экспертиза и структурирование сделок\nразработка и внедрение корпоративных договоров и опционных программ для сотрудников',
    disclaimer: ''
  }, {
    id: 'public',
    category: 'customers',
    title: 'Поддержка госзаказчиков',
    highlight: 'Поможем понять структуры работы с 44-ФЗ и госзакупками в целом, снять излишние риски с должностных лиц.',
    benefits: 'правовая экспертиза закупочной документации еще на стадии планирования\nкомплексное сопровождение заключения и исполнения контракта\nпретензионно-исковая работа и взыскание неустоек\nзащита при проверках контролирующих органов и обжалование решений, предписаний, постановлений КоАП\nметодологическое обеспечение закупочной деятельности (положения, регламенты)',
    disclaimer: ''
  }, {
    id: 'competitor',
    category: 'suppliers',
    title: 'Конкурентный консалтинг',
    highlight: 'Работа с поставщиками – одно из наших приоритетных направлений. Постоянные изменения в законодательстве требуют всегда быть в курсе новых судебных практик.',
    benefits: 'анализ закупочной документации и проверка «подводных камней».\nпрактические рекомендации и оценка возможностей участия в торгах\nПодготовка и тщательная проверка заявки на участие (решения об одобрении сделки, отсутствие оснований для отклонения)\nсопровождение «антимонопольного этапа» и подача запросов на разъяснение (жалобы, представление интересов)\nЮридическая поддержка при исполнении контракта\nзащита интересов при спорах о включении в РНП*',
    disclaimer: '* Реестр недобросовестных поставщиков (ст. 104 Закона о контрактной системе 44-ФЗ)'
  }]
};

// Initialize consultingData now that defaultConsultingData is available
consultingData = JSON.parse(localStorage.getItem('crzrt_consulting_data')) || _objectSpread({}, defaultConsultingData);
var consultingAuthorsAdmin = document.getElementById('consultingAuthorsAdmin');
var consultingServicesAdmin = document.getElementById('consultingServicesAdmin');
window.handleAuthorPhoto = function (input, index) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('c_author_photo_preview_' + index).src = e.target.result;
      document.getElementById('c_author_photo_preview_' + index).style.display = 'block';
      document.getElementById('c_author_photo_text_' + index).style.display = 'none';
      document.getElementById('c_author_avatarUrl_' + index).value = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
};
function renderConsultingAdmin() {
  // Render Color Setting
  var clrInput = document.getElementById('c_category_color');
  var clrPicker = document.getElementById('c_category_color_picker');
  clrInput.value = consultingData.categoryColor || '#ff3b3b';
  clrPicker.value = consultingData.categoryColor || '#ff3b3b';
  clrInput.addEventListener('input', function (e) {
    clrPicker.value = e.target.value;
  });
  clrPicker.addEventListener('input', function (e) {
    clrInput.value = e.target.value;
  });

  // Render Authors
  consultingAuthorsAdmin.innerHTML = '';
  consultingData.authors.forEach(function (author, index) {
    var authorHTML = "\n                    <div style=\"border-left: 3px solid var(--accent-color); padding-left: 20px; margin-bottom: 24px; background: rgba(0,0,0,0.02); padding: 25px; border-radius: 0 16px 16px 0;\">\n                        <h4 style=\"margin-bottom: 20px; font-weight: 600; font-size: 1.1rem; color: var(--accent-color);\">\u0410\u0432\u0442\u043E\u0440 ".concat(index + 1, "</h4>\n                        \n                        <!-- Row 1: Photo & Avatar Text -->\n                        <div style=\"display: flex; gap: 30px; align-items: flex-end; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px dashed var(--card-border);\">\n                            <div class=\"form-group\" style=\"margin-bottom: 0;\">\n                                <label>\u0424\u043E\u0442\u043E (\u0410\u0432\u0430\u0442\u0430\u0440)</label>\n                                <div style=\"width: 100px; height: 100px; border-radius: 50%; background: var(--card-border); overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; border: 2px solid var(--accent-color);\" onclick=\"window.activeAuthorIndex = ").concat(index, "; window.activeFeatureCardIndex = undefined; document.getElementById('imageInput').click()\">\n                                    <img id=\"c_author_photo_preview_").concat(index, "\" src=\"").concat(author.avatarUrl || '', "\" style=\"width: 100%; height: 100%; object-fit: cover; display: ").concat(author.avatarUrl ? 'block' : 'none', ";\">\n                                    <span id=\"c_author_photo_text_").concat(index, "\" style=\"font-size: 2rem; font-weight: 700; color: var(--text-secondary); display: ").concat(author.avatarUrl ? 'none' : 'block', ";\">").concat(author.avatarText || 'ИИ', "</span>\n                                    <div style=\"position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); font-size: 0.7rem; text-align: center; color: white; padding: 4px 0;\">\u0418\u0417\u041C\u0415\u041D\u0418\u0422\u042C</div>\n                                </div>\n                                <input type=\"hidden\" id=\"c_author_avatarUrl_").concat(index, "\" value=\"").concat(author.avatarUrl || '', "\">\n                            </div>\n                            <div class=\"form-group\" style=\"margin-bottom: 0; flex: 1; max-width: 200px;\">\n                                <label>\u0418\u043D\u0438\u0446\u0438\u0430\u043B\u044B (\u0442\u0435\u043A\u0441\u0442\u043E\u043C)</label>\n                                <input type=\"text\" class=\"form-control\" id=\"c_author_avatar_").concat(index, "\" value=\"").concat(author.avatarText || '', "\" placeholder=\"\u0418\u0418\" maxlength=\"4\">\n                                <small style=\"display:block; margin-top:5px; font-size:0.7rem;\">\u0415\u0441\u043B\u0438 \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E \u0444\u043E\u0442\u043E</small>\n                            </div>\n                        </div>\n\n                        <!-- Row 2: Basic Info -->\n                        <div style=\"display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;\">\n                            <div class=\"form-group\" style=\"margin-bottom: 0;\">\n                                <label>\u0424\u0418\u041E</label>\n                                <input type=\"text\" class=\"form-control\" id=\"c_author_name_").concat(index, "\" value=\"").concat(author.name || '', "\" placeholder=\"\u0418\u0432\u0430\u043D\u043E\u0432 \u0418.\u0418.\">\n                            </div>\n                            <div class=\"form-group\" style=\"margin-bottom: 0;\">\n                                <label>\u0422\u0435\u043B\u0435\u0444\u043E\u043D</label>\n                                <input type=\"text\" class=\"form-control\" id=\"c_author_phone_").concat(index, "\" value=\"").concat(author.phone || '', "\" placeholder=\"+7 ...\">\n                            </div>\n                            <div class=\"form-group\" style=\"margin-bottom: 0;\">\n                                <label>E-mail</label>\n                                <input type=\"email\" class=\"form-control\" id=\"c_author_email_").concat(index, "\" value=\"").concat(author.email || '', "\" placeholder=\"mail@domain.ru\">\n                            </div>\n                        </div>\n                    </div>\n                ");
    consultingAuthorsAdmin.insertAdjacentHTML('beforeend', authorHTML);
  });

  // Render Services
  consultingServicesAdmin.innerHTML = '';
  consultingData.services.forEach(function (service, index) {
    var serviceHTML = "\n                    <div style=\"background: rgba(0,0,0,0.05); padding: 20px; border-radius: 8px; border: 1px solid var(--card-border);\">\n                        <h3 style=\"margin-bottom: 15px; font-weight: 600; color: var(--accent-color);\">".concat(service.title, "</h3>\n                        <input type=\"hidden\" id=\"c_service_id_").concat(index, "\" value=\"").concat(service.id, "\">\n                        \n                        <div class=\"form-group\">\n                            <label>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0443\u0441\u043B\u0443\u0433\u0438</label>\n                            <input type=\"text\" class=\"form-control\" id=\"c_service_title_").concat(index, "\" value=\"").concat(service.title || '', "\">\n                        </div>\n                        <div class=\"form-group\">\n                            <label>\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F (\u0434\u043B\u044F \u043C\u0435\u043D\u044E)</label>\n                            <select class=\"form-control\" id=\"c_service_category_").concat(index, "\">\n                                <option value=\"customers\" ").concat(service.category === 'customers' ? 'selected' : '', ">\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A\u0430\u043C</option>\n                                <option value=\"suppliers\" ").concat(service.category === 'suppliers' ? 'selected' : '', ">\u041F\u043E\u0441\u0442\u0430\u0432\u0449\u0438\u043A\u0430\u043C</option>\n                            </select>\n                        </div>\n                        <div class=\"form-group\">\n                            <label>\u0412\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u0430\u044F \u0446\u0438\u0442\u0430\u0442\u0430 (\u0413\u043B\u0430\u0432\u043D\u0430\u044F \u043C\u044B\u0441\u043B\u044C)</label>\n                            <textarea class=\"form-control\" id=\"c_service_highlight_").concat(index, "\" style=\"min-height: 80px;\">").concat(service.highlight || '', "</textarea>\n                        </div>\n                        <div class=\"form-group\">\n                            <label>\u0421\u043F\u0438\u0441\u043E\u043A \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u043C\u044B\u0445 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432 (\u043A\u0430\u0436\u0434\u044B\u0439 \u043F\u0443\u043D\u043A\u0442 \u0441 \u043D\u043E\u0432\u043E\u0439 \u0441\u0442\u0440\u043E\u043A\u0438, \u0431\u0435\u0437 \u0442\u0438\u0440\u0435)</label>\n                            <textarea class=\"form-control\" id=\"c_service_benefits_").concat(index, "\" style=\"min-height: 80px;\">").concat(service.benefits || '', "</textarea>\n                        </div>\n                        <div class=\"form-group\">\n                            <label>\u041C\u0435\u043B\u043A\u0438\u0439 \u0448\u0440\u0438\u0444\u0442 (\u0441\u043D\u043E\u0441\u043A\u0430, \u0435\u0441\u043B\u0438 \u0435\u0441\u0442\u044C)</label>\n                            <input type=\"text\" class=\"form-control\" id=\"c_service_disclaimer_").concat(index, "\" value=\"").concat(service.disclaimer || '', "\">\n                        </div>\n                        <button class=\"btn-delete\" style=\"margin-top: 15px;\" onclick=\"window.removeConsultingService(").concat(index, ")\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0443\u0441\u043B\u0443\u0433\u0443</button>\n                    </div>\n                ");
    consultingServicesAdmin.insertAdjacentHTML('beforeend', serviceHTML);
  });
}
function renderAboutUsAdmin() {
  document.getElementById('a_hero_title').value = aboutData.heroTitle || '';
  document.getElementById('a_hero_subtitle').value = aboutData.heroSubtitle || '';
  document.getElementById('a_main_title').value = aboutData.mainTitle || '';
  document.getElementById('a_p1').value = aboutData.p1 || '';
  document.getElementById('a_p2').value = aboutData.p2 || '';
  document.getElementById('a_services').value = aboutData.services || '';
  var preview = document.getElementById('a_image_preview');
  var placeholder = document.getElementById('a_image_placeholder');
  var valInput = document.getElementById('a_image_val');
  if (aboutData.image) {
    preview.src = aboutData.image;
    preview.style.display = 'block';
    placeholder.style.display = 'none';
    valInput.value = aboutData.image;
  } else {
    preview.style.display = 'none';
    placeholder.style.display = 'block';
    valInput.value = '';
  }
}
function saveAboutUsStateToMemory() {
  aboutData.heroTitle = document.getElementById('a_hero_title').value;
  aboutData.heroSubtitle = document.getElementById('a_hero_subtitle').value;
  aboutData.mainTitle = document.getElementById('a_main_title').value;
  aboutData.p1 = document.getElementById('a_p1').value;
  aboutData.p2 = document.getElementById('a_p2').value;
  aboutData.services = document.getElementById('a_services').value;
  aboutData.image = document.getElementById('a_image_val').value;
}
function renderContactsAdmin() {
  document.getElementById('c_phone').value = contactsData.phone || '';
  document.getElementById('c_email').value = contactsData.email || '';
  document.getElementById('c_requisites').value = contactsData.requisites || '';
}
function saveContactsStateToMemory() {
  contactsData.phone = document.getElementById('c_phone').value;
  contactsData.email = document.getElementById('c_email').value;
  contactsData.requisites = document.getElementById('c_requisites').value;
}
function saveConsultingStateToMemory() {
  consultingData.categoryColor = document.getElementById('c_category_color').value;
  consultingData.authors.forEach(function (author, index) {
    author.avatarText = document.getElementById("c_author_avatar_".concat(index)).value;
    author.avatarUrl = document.getElementById("c_author_avatarUrl_".concat(index)).value;
    author.name = document.getElementById("c_author_name_".concat(index)).value;
    author.phone = document.getElementById("c_author_phone_".concat(index)).value;
    author.email = document.getElementById("c_author_email_".concat(index)).value;
  });
  consultingData.services.forEach(function (service, index) {
    service.title = document.getElementById("c_service_title_".concat(index)).value;
    service.category = document.getElementById("c_service_category_".concat(index)).value;
    service.highlight = document.getElementById("c_service_highlight_".concat(index)).value;
    service.benefits = document.getElementById("c_service_benefits_".concat(index)).value;
    service.disclaimer = document.getElementById("c_service_disclaimer_".concat(index)).value;
    // Add an ID if it's new
    if (!service.id) service.id = 'service_' + Date.now() + Math.floor(Math.random() * 1000);
  });
}
window.removeConsultingService = function (index) {
  if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
    saveConsultingStateToMemory();
    consultingData.services.splice(index, 1);
    renderConsultingAdmin();
  }
};
var btnAddConsultingService = document.getElementById('btnAddConsultingService');
if (btnAddConsultingService) {
  btnAddConsultingService.addEventListener('click', function () {
    saveConsultingStateToMemory();
    consultingData.services.push({
      id: 'service_' + Date.now(),
      title: 'Новая услуга',
      highlight: '',
      benefits: '',
      disclaimer: ''
    });
    renderConsultingAdmin();
    // scroll to bottom of services
    setTimeout(function () {
      var block = document.getElementById('consultingServicesAdmin');
      block.lastElementChild.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }, 100);
  });
}

// Global Cropper logic is handled in the unified block (lines 1138-1265)

function isImageDataUrl(value) {
  return typeof value === 'string' && /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value);
}
function uploadDataUrlImage(_x, _x2, _x3, _x4) {
  return _uploadDataUrlImage.apply(this, arguments);
}
function _uploadDataUrlImage() {
  _uploadDataUrlImage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(dataUrl, slot, maxWidth, maxHeight) {
    var _payload, _payload2;
    var options,
      response,
      raw,
      payload,
      _payload3,
      _args7 = arguments,
      _t8;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          options = _args7.length > 4 && _args7[4] !== undefined ? _args7[4] : {};
          _context7.n = 1;
          return fetch('api/upload.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              dataUrl: dataUrl,
              slot: slot,
              maxWidth: maxWidth,
              maxHeight: maxHeight,
              preserveSize: Boolean(options.preserveSize)
            })
          });
        case 1:
          response = _context7.v;
          _context7.n = 2;
          return response.text();
        case 2:
          raw = _context7.v;
          payload = null;
          _context7.p = 3;
          payload = raw ? JSON.parse(raw) : null;
          _context7.n = 5;
          break;
        case 4:
          _context7.p = 4;
          _t8 = _context7.v;
          throw new Error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043C\u0435\u0434\u0438\u0430 (HTTP ".concat(response.status, ")"));
        case 5:
          if (!(!response.ok || !((_payload = payload) !== null && _payload !== void 0 && _payload.success) || !((_payload2 = payload) !== null && _payload2 !== void 0 && _payload2.url))) {
            _context7.n = 6;
            break;
          }
          throw new Error(((_payload3 = payload) === null || _payload3 === void 0 ? void 0 : _payload3.error) || 'Не удалось загрузить изображение');
        case 6:
          // Track hero/banner backgrounds in history
          if (payload.url && slot && (slot.includes('hero_bg') || slot.includes('hero_graphic') || slot.includes('bg'))) {
            if (!bgHistoryData.includes(payload.url)) {
              bgHistoryData.push(payload.url);
              window.bgHistoryData = bgHistoryData;
              fetch('api/settings.php', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  key: 'crzrt_bg_history',
                  value: bgHistoryData
                })
              }).catch(function (e) {
                return console.error('Failed to save bg history', e);
              });
            }
          }
          return _context7.a(2, payload.url);
      }
    }, _callee7, null, [[3, 4]]);
  }));
  return _uploadDataUrlImage.apply(this, arguments);
}
function replaceMainPageBase64WithUploads(_x5) {
  return _replaceMainPageBase64WithUploads.apply(this, arguments);
}
function _replaceMainPageBase64WithUploads() {
  _replaceMainPageBase64WithUploads = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(data) {
    var cache, uploadOrReuse, i, slide, _i3, card, _i4, partner, _i5;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          cache = new Map();
          uploadOrReuse = function uploadOrReuse(src, slot, maxWidth, maxHeight) {
            var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
            if (!isImageDataUrl(src)) return Promise.resolve(src);
            var key = "".concat(slot, ":").concat(src.slice(0, 64), ":").concat(src.length, ":").concat(options.preserveSize ? '1' : '0');
            if (!cache.has(key)) {
              cache.set(key, uploadDataUrlImage(src, slot, maxWidth, maxHeight, options));
            }
            return cache.get(key);
          };
          if (!Array.isArray(data.heroSlides)) {
            _context8.n = 5;
            break;
          }
          i = 0;
        case 1:
          if (!(i < data.heroSlides.length)) {
            _context8.n = 5;
            break;
          }
          slide = data.heroSlides[i];
          if (slide) {
            _context8.n = 2;
            break;
          }
          return _context8.a(3, 4);
        case 2:
          _context8.n = 3;
          return uploadOrReuse(slide.background, "hero_".concat(i), 8192, 8192, {
            preserveSize: true
          });
        case 3:
          slide.background = _context8.v;
        case 4:
          i++;
          _context8.n = 1;
          break;
        case 5:
          if (!Array.isArray(data.serviceCards)) {
            _context8.n = 10;
            break;
          }
          _i3 = 0;
        case 6:
          if (!(_i3 < data.serviceCards.length)) {
            _context8.n = 10;
            break;
          }
          card = data.serviceCards[_i3];
          if (card) {
            _context8.n = 7;
            break;
          }
          return _context8.a(3, 9);
        case 7:
          _context8.n = 8;
          return uploadOrReuse(card.icon, "service_icon_".concat(_i3), 400, 400);
        case 8:
          card.icon = _context8.v;
        case 9:
          _i3++;
          _context8.n = 6;
          break;
        case 10:
          if (!data.promoBanner) {
            _context8.n = 12;
            break;
          }
          _context8.n = 11;
          return uploadOrReuse(data.promoBanner.image, 'promo_banner', 1520, 253);
        case 11:
          data.promoBanner.image = _context8.v;
        case 12:
          if (!Array.isArray(data.partners)) {
            _context8.n = 17;
            break;
          }
          _i4 = 0;
        case 13:
          if (!(_i4 < data.partners.length)) {
            _context8.n = 17;
            break;
          }
          partner = data.partners[_i4];
          if (partner) {
            _context8.n = 14;
            break;
          }
          return _context8.a(3, 16);
        case 14:
          _context8.n = 15;
          return uploadOrReuse(partner.image, "partner_".concat(_i4), 400, 400);
        case 15:
          partner.image = _context8.v;
        case 16:
          _i4++;
          _context8.n = 13;
          break;
        case 17:
          if (!(data.consultation && Array.isArray(data.consultation.photos))) {
            _context8.n = 21;
            break;
          }
          _i5 = 0;
        case 18:
          if (!(_i5 < data.consultation.photos.length)) {
            _context8.n = 21;
            break;
          }
          _context8.n = 19;
          return uploadOrReuse(data.consultation.photos[_i5], "consult_photo_".concat(_i5), 396, 509);
        case 19:
          data.consultation.photos[_i5] = _context8.v;
        case 20:
          _i5++;
          _context8.n = 18;
          break;
        case 21:
          if (!data.chatWidget) {
            _context8.n = 23;
            break;
          }
          _context8.n = 22;
          return uploadOrReuse(data.chatWidget.operatorAvatar, 'chat_operator_avatar', 400, 400);
        case 22:
          data.chatWidget.operatorAvatar = _context8.v;
        case 23:
          return _context8.a(2, data);
      }
    }, _callee8);
  }));
  return _replaceMainPageBase64WithUploads.apply(this, arguments);
}
function replaceEcpBase64WithUploads(_x6) {
  return _replaceEcpBase64WithUploads.apply(this, arguments);
}
function _replaceEcpBase64WithUploads() {
  _replaceEcpBase64WithUploads = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(data) {
    var cache, uploadOrReuse, uploadHeroSlidesBackgrounds, _uploadHeroSlidesBackgrounds, i, video;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          _uploadHeroSlidesBackgrounds = function _uploadHeroSlidesBack2() {
            _uploadHeroSlidesBackgrounds = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(slides, prefix, uploadOrReuse, preserveSize) {
              var _i6, slide;
              return _regenerator().w(function (_context9) {
                while (1) switch (_context9.n) {
                  case 0:
                    if (Array.isArray(slides)) {
                      _context9.n = 1;
                      break;
                    }
                    return _context9.a(2);
                  case 1:
                    _i6 = 0;
                  case 2:
                    if (!(_i6 < slides.length)) {
                      _context9.n = 6;
                      break;
                    }
                    slide = slides[_i6];
                    if (slide) {
                      _context9.n = 3;
                      break;
                    }
                    return _context9.a(3, 5);
                  case 3:
                    _context9.n = 4;
                    return uploadOrReuse(slide.background, "".concat(prefix, "_bg_").concat(_i6), 1520, 420, preserveSize ? {
                      preserveSize: true
                    } : undefined);
                  case 4:
                    slide.background = _context9.v;
                  case 5:
                    _i6++;
                    _context9.n = 2;
                    break;
                  case 6:
                    return _context9.a(2);
                }
              }, _callee9);
            }));
            return _uploadHeroSlidesBackgrounds.apply(this, arguments);
          };
          uploadHeroSlidesBackgrounds = function _uploadHeroSlidesBack(_x10, _x11, _x12, _x13) {
            return _uploadHeroSlidesBackgrounds.apply(this, arguments);
          };
          cache = new Map();
          uploadOrReuse = function uploadOrReuse(src, slot, maxWidth, maxHeight) {
            if (!isImageDataUrl(src)) return Promise.resolve(src);
            var key = "".concat(slot, ":").concat(src.slice(0, 64), ":").concat(src.length);
            if (!cache.has(key)) {
              cache.set(key, uploadDataUrlImage(src, slot, maxWidth, maxHeight));
            }
            return cache.get(key);
          };
          if (!Array.isArray(data.heroSlides)) {
            _context0.n = 2;
            break;
          }
          _context0.n = 1;
          return uploadHeroSlidesBackgrounds(data.heroSlides, 'ecp_hero', uploadOrReuse, true);
        case 1:
          _context0.n = 4;
          break;
        case 2:
          if (!data.hero) {
            _context0.n = 4;
            break;
          }
          _context0.n = 3;
          return uploadOrReuse(data.hero.background, 'ecp_hero_bg', 1520, 420);
        case 3:
          data.hero.background = _context0.v;
        case 4:
          if (!data.blanks) {
            _context0.n = 6;
            break;
          }
          _context0.n = 5;
          return uploadOrReuse(data.blanks.patternImage, 'ecp_blanks_pattern', 400, 480);
        case 5:
          data.blanks.patternImage = _context0.v;
        case 6:
          if (!data.manual) {
            _context0.n = 8;
            break;
          }
          _context0.n = 7;
          return uploadOrReuse(data.manual.bookImage, 'ecp_manual_book', 396, 509);
        case 7:
          data.manual.bookImage = _context0.v;
        case 8:
          if (!data.support) {
            _context0.n = 10;
            break;
          }
          _context0.n = 9;
          return uploadOrReuse(data.support.background, 'ecp_support_bg', 1520, 435);
        case 9:
          data.support.background = _context0.v;
        case 10:
          if (!Array.isArray(data.videos)) {
            _context0.n = 15;
            break;
          }
          i = 0;
        case 11:
          if (!(i < data.videos.length)) {
            _context0.n = 15;
            break;
          }
          video = data.videos[i];
          if (video) {
            _context0.n = 12;
            break;
          }
          return _context0.a(3, 14);
        case 12:
          _context0.n = 13;
          return uploadOrReuse(video.thumbnail, "ecp_video_thumb_".concat(i), 474, 290);
        case 13:
          video.thumbnail = _context0.v;
        case 14:
          i++;
          _context0.n = 11;
          break;
        case 15:
          return _context0.a(2, data);
      }
    }, _callee0);
  }));
  return _replaceEcpBase64WithUploads.apply(this, arguments);
}
function replaceConsultingBase64WithUploads(_x7) {
  return _replaceConsultingBase64WithUploads.apply(this, arguments);
}
function _replaceConsultingBase64WithUploads() {
  _replaceConsultingBase64WithUploads = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(data) {
    var _data$whyUs, _data$whyUs2;
    var cache, uploadOrReuse, i, slide, _i7, item;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          cache = new Map();
          uploadOrReuse = function uploadOrReuse(src, slot, maxWidth, maxHeight) {
            if (!isImageDataUrl(src)) return Promise.resolve(src);
            var key = "".concat(slot, ":").concat(src.slice(0, 64), ":").concat(src.length);
            if (!cache.has(key)) {
              cache.set(key, uploadDataUrlImage(src, slot, maxWidth, maxHeight));
            }
            return cache.get(key);
          };
          if (!Array.isArray(data.heroSlides)) {
            _context1.n = 6;
            break;
          }
          i = 0;
        case 1:
          if (!(i < data.heroSlides.length)) {
            _context1.n = 5;
            break;
          }
          slide = data.heroSlides[i];
          if (slide) {
            _context1.n = 2;
            break;
          }
          return _context1.a(3, 4);
        case 2:
          _context1.n = 3;
          return uploadOrReuse(slide.background, "consulting_hero_bg_".concat(i), 1520, 420);
        case 3:
          slide.background = _context1.v;
        case 4:
          i++;
          _context1.n = 1;
          break;
        case 5:
          _context1.n = 8;
          break;
        case 6:
          if (!data.hero) {
            _context1.n = 8;
            break;
          }
          _context1.n = 7;
          return uploadOrReuse(data.hero.background, 'consulting_hero_bg', 1520, 420);
        case 7:
          data.hero.background = _context1.v;
        case 8:
          if (!data.hero) {
            _context1.n = 10;
            break;
          }
          _context1.n = 9;
          return uploadOrReuse(data.hero.graphic, 'consulting_hero_graphic', 420, 420);
        case 9:
          data.hero.graphic = _context1.v;
        case 10:
          if (!((_data$whyUs = data.whyUs) !== null && _data$whyUs !== void 0 && _data$whyUs.photo)) {
            _context1.n = 12;
            break;
          }
          _context1.n = 11;
          return uploadOrReuse(data.whyUs.photo.image, 'consulting_why_photo', 494, 329);
        case 11:
          data.whyUs.photo.image = _context1.v;
        case 12:
          if (!((_data$whyUs2 = data.whyUs) !== null && _data$whyUs2 !== void 0 && _data$whyUs2.side)) {
            _context1.n = 14;
            break;
          }
          _context1.n = 13;
          return uploadOrReuse(data.whyUs.side.image, 'consulting_why_side_image', 978, 1526);
        case 13:
          data.whyUs.side.image = _context1.v;
        case 14:
          if (!Array.isArray(data.competencies)) {
            _context1.n = 19;
            break;
          }
          _i7 = 0;
        case 15:
          if (!(_i7 < data.competencies.length)) {
            _context1.n = 19;
            break;
          }
          item = data.competencies[_i7];
          if (item) {
            _context1.n = 16;
            break;
          }
          return _context1.a(3, 18);
        case 16:
          _context1.n = 17;
          return uploadOrReuse(item.icon, "consulting_comp_icon_".concat(_i7), 109, 110);
        case 17:
          item.icon = _context1.v;
        case 18:
          _i7++;
          _context1.n = 15;
          break;
        case 19:
          return _context1.a(2, data);
      }
    }, _callee1);
  }));
  return _replaceConsultingBase64WithUploads.apply(this, arguments);
}
function replaceSupportBase64WithUploads(_x8) {
  return _replaceSupportBase64WithUploads.apply(this, arguments);
}
function _replaceSupportBase64WithUploads() {
  _replaceSupportBase64WithUploads = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(data) {
    var cache, uploadOrReuse, i, slide, _i8, card;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.n) {
        case 0:
          cache = new Map();
          uploadOrReuse = function uploadOrReuse(src, slot, maxWidth, maxHeight) {
            if (!isImageDataUrl(src)) return Promise.resolve(src);
            var key = "".concat(slot, ":").concat(src.slice(0, 64), ":").concat(src.length);
            if (!cache.has(key)) {
              cache.set(key, uploadDataUrlImage(src, slot, maxWidth, maxHeight));
            }
            return cache.get(key);
          };
          if (!Array.isArray(data.heroSlides)) {
            _context10.n = 6;
            break;
          }
          i = 0;
        case 1:
          if (!(i < data.heroSlides.length)) {
            _context10.n = 5;
            break;
          }
          slide = data.heroSlides[i];
          if (slide) {
            _context10.n = 2;
            break;
          }
          return _context10.a(3, 4);
        case 2:
          _context10.n = 3;
          return uploadOrReuse(slide.background, "support_hero_bg_".concat(i), 1520, 420);
        case 3:
          slide.background = _context10.v;
        case 4:
          i++;
          _context10.n = 1;
          break;
        case 5:
          _context10.n = 8;
          break;
        case 6:
          if (!data.hero) {
            _context10.n = 8;
            break;
          }
          _context10.n = 7;
          return uploadOrReuse(data.hero.background, 'support_hero_bg', 1520, 420);
        case 7:
          data.hero.background = _context10.v;
        case 8:
          if (!data.calculator) {
            _context10.n = 10;
            break;
          }
          _context10.n = 9;
          return uploadOrReuse(data.calculator.image, 'support_calc_image', 845, 845);
        case 9:
          data.calculator.image = _context10.v;
        case 10:
          if (!Array.isArray(data.navCards)) {
            _context10.n = 15;
            break;
          }
          _i8 = 0;
        case 11:
          if (!(_i8 < data.navCards.length)) {
            _context10.n = 15;
            break;
          }
          card = data.navCards[_i8];
          if (card) {
            _context10.n = 12;
            break;
          }
          return _context10.a(3, 14);
        case 12:
          _context10.n = 13;
          return uploadOrReuse(card.icon, "support_nav_icon_".concat(_i8), 122, 154);
        case 13:
          card.icon = _context10.v;
        case 14:
          _i8++;
          _context10.n = 11;
          break;
        case 15:
          return _context10.a(2, data);
      }
    }, _callee10);
  }));
  return _replaceSupportBase64WithUploads.apply(this, arguments);
}
function replaceKnowledgeBase64WithUploads(_x9) {
  return _replaceKnowledgeBase64WithUploads.apply(this, arguments);
}
function _replaceKnowledgeBase64WithUploads() {
  _replaceKnowledgeBase64WithUploads = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(data) {
    var cache, uploadOrReuse;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          cache = new Map();
          uploadOrReuse = function uploadOrReuse(src, slot, maxWidth, maxHeight) {
            if (!isImageDataUrl(src)) return Promise.resolve(src);
            var key = "".concat(slot, ":").concat(src.slice(0, 64), ":").concat(src.length);
            if (!cache.has(key)) {
              cache.set(key, uploadDataUrlImage(src, slot, maxWidth, maxHeight));
            }
            return cache.get(key);
          };
          if (!data.hero) {
            _context11.n = 2;
            break;
          }
          _context11.n = 1;
          return uploadOrReuse(data.hero.background, 'knowledge_hero_bg', 1520, 420);
        case 1:
          data.hero.background = _context11.v;
        case 2:
          return _context11.a(2, data);
      }
    }, _callee11);
  }));
  return _replaceKnowledgeBase64WithUploads.apply(this, arguments);
}
function replaceObuchenieBase64WithUploads(_x0) {
  return _replaceObuchenieBase64WithUploads.apply(this, arguments);
}
function _replaceObuchenieBase64WithUploads() {
  _replaceObuchenieBase64WithUploads = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(data) {
    var cache, uploadOrReuse, i, slide, _data$hero, _i9, card;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          cache = new Map();
          uploadOrReuse = function uploadOrReuse(src, slot, maxWidth, maxHeight) {
            var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
            if (!isImageDataUrl(src)) return Promise.resolve(src);
            var key = "".concat(slot, ":").concat(src.slice(0, 64), ":").concat(src.length, ":").concat(options.preserveSize ? '1' : '0');
            if (!cache.has(key)) {
              cache.set(key, uploadDataUrlImage(src, slot, maxWidth, maxHeight, options));
            }
            return cache.get(key);
          };
          if (!Array.isArray(data.heroSlides)) {
            _context12.n = 6;
            break;
          }
          i = 0;
        case 1:
          if (!(i < data.heroSlides.length)) {
            _context12.n = 5;
            break;
          }
          slide = data.heroSlides[i];
          if (slide) {
            _context12.n = 2;
            break;
          }
          return _context12.a(3, 4);
        case 2:
          _context12.n = 3;
          return uploadOrReuse(slide.background, "obuchenie_hero_bg_".concat(i), 1520, 420, {
            preserveSize: true
          });
        case 3:
          slide.background = _context12.v;
        case 4:
          i++;
          _context12.n = 1;
          break;
        case 5:
          _context12.n = 8;
          break;
        case 6:
          if (!data.hero) {
            _context12.n = 8;
            break;
          }
          _context12.n = 7;
          return uploadOrReuse(data.hero.background, 'obuchenie_hero_bg', 1520, 420, {
            preserveSize: true
          });
        case 7:
          data.hero.background = _context12.v;
        case 8:
          if (!data.hero) {
            _context12.n = 10;
            break;
          }
          _context12.n = 9;
          return uploadOrReuse(data.hero.gavelImage, 'obuchenie_hero_gavel', 420, 420);
        case 9:
          data.hero.gavelImage = _context12.v;
        case 10:
          if (Array.isArray(data.heroSlides) && data.heroSlides[0]) {
            data.hero = _objectSpread(_objectSpread({}, data.heroSlides[0]), {}, {
              gavelImage: ((_data$hero = data.hero) === null || _data$hero === void 0 ? void 0 : _data$hero.gavelImage) || ''
            });
          }
          if (!data.calendar) {
            _context12.n = 12;
            break;
          }
          _context12.n = 11;
          return uploadOrReuse(data.calendar.promoImage, 'obuchenie_cal_promo_image', 800, 1183);
        case 11:
          data.calendar.promoImage = _context12.v;
        case 12:
          if (!data.testingBanner) {
            _context12.n = 14;
            break;
          }
          _context12.n = 13;
          return uploadOrReuse(data.testingBanner.image, 'obuchenie_testing_image', 3040, 870);
        case 13:
          data.testingBanner.image = _context12.v;
        case 14:
          if (!Array.isArray(data.navCards)) {
            _context12.n = 19;
            break;
          }
          _i9 = 0;
        case 15:
          if (!(_i9 < data.navCards.length)) {
            _context12.n = 19;
            break;
          }
          card = data.navCards[_i9];
          if (card) {
            _context12.n = 16;
            break;
          }
          return _context12.a(3, 18);
        case 16:
          _context12.n = 17;
          return uploadOrReuse(card.icon, "obuchenie_nav_icon_".concat(_i9), 118, 149);
        case 17:
          card.icon = _context12.v;
        case 18:
          _i9++;
          _context12.n = 15;
          break;
        case 19:
          return _context12.a(2, data);
      }
    }, _callee12);
  }));
  return _replaceObuchenieBase64WithUploads.apply(this, arguments);
}
function replaceNewsBase64WithUploads(_x1) {
  return _replaceNewsBase64WithUploads.apply(this, arguments);
}
function _replaceNewsBase64WithUploads() {
  _replaceNewsBase64WithUploads = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(data) {
    var cache, uploadOrReuse, i, item;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.n) {
        case 0:
          cache = new Map();
          uploadOrReuse = function uploadOrReuse(src, slot, maxWidth, maxHeight) {
            if (!isImageDataUrl(src)) return Promise.resolve(src);
            var key = "".concat(slot, ":").concat(src.slice(0, 64), ":").concat(src.length);
            if (!cache.has(key)) {
              cache.set(key, uploadDataUrlImage(src, slot, maxWidth, maxHeight));
            }
            return cache.get(key);
          };
          if (!data.hero) {
            _context13.n = 2;
            break;
          }
          _context13.n = 1;
          return uploadOrReuse(data.hero.background, 'news_hero_bg', 1520, 420);
        case 1:
          data.hero.background = _context13.v;
        case 2:
          if (!Array.isArray(data.items)) {
            _context13.n = 7;
            break;
          }
          i = 0;
        case 3:
          if (!(i < data.items.length)) {
            _context13.n = 7;
            break;
          }
          item = data.items[i];
          if (item) {
            _context13.n = 4;
            break;
          }
          return _context13.a(3, 6);
        case 4:
          _context13.n = 5;
          return uploadOrReuse(item.image, "news_item_image_".concat(i), 511, 474);
        case 5:
          item.image = _context13.v;
        case 6:
          i++;
          _context13.n = 3;
          break;
        case 7:
          return _context13.a(2, data);
      }
    }, _callee13);
  }));
  return _replaceNewsBase64WithUploads.apply(this, arguments);
}
var handleSaveClick = /*#__PURE__*/function () {
  var _handleSaveClick = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var originalText, _result, keyToSave, dataToSave, snapshot, _snapshot, _snapshot2, _snapshot3, _snapshot4, _snapshot5, _snapshot6, response, rawResponse, result, _t4, _t5;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          originalText = 'Сохранить изменения';
          _context4.p = 1;
          keyToSave = '';
          dataToSave = null;
          if (!(currentTarget === 'consulting')) {
            _context4.n = 2;
            break;
          }
          saveConsultingStateToMemory();
          keyToSave = 'crzrt_consulting_data';
          dataToSave = consultingData;
          _context4.n = 13;
          break;
        case 2:
          if (!(currentTarget === 'main-page')) {
            _context4.n = 3;
            break;
          }
          saveMainPageStateToMemory();
          keyToSave = 'crzrt_main_page_data';
          dataToSave = mainPageData;
          _context4.n = 13;
          break;
        case 3:
          if (!(currentTarget === 'ecp-page')) {
            _context4.n = 4;
            break;
          }
          saveEcpPageStateToMemory();
          keyToSave = 'crzrt_ecp_page_data';
          dataToSave = ecpPageData;
          _context4.n = 13;
          break;
        case 4:
          if (!(currentTarget === 'consulting-page')) {
            _context4.n = 5;
            break;
          }
          saveConsultingPageStateToMemory();
          keyToSave = 'crzrt_consulting_page_data';
          dataToSave = consultingPageData;
          _context4.n = 13;
          break;
        case 5:
          if (!(currentTarget === 'support-page')) {
            _context4.n = 6;
            break;
          }
          saveSupportPageStateToMemory();
          keyToSave = 'crzrt_support_page_data';
          dataToSave = supportPageData;
          _context4.n = 13;
          break;
        case 6:
          if (!(currentTarget === 'obuchenie-page')) {
            _context4.n = 7;
            break;
          }
          saveObucheniePageStateToMemory();
          keyToSave = 'crzrt_obuchenie_page_data';
          dataToSave = obucheniePageData;
          _context4.n = 13;
          break;
        case 7:
          if (!(currentTarget === 'testing-page')) {
            _context4.n = 8;
            break;
          }
          saveQuizPageStateToMemory();
          keyToSave = 'crzrt_quiz_data';
          dataToSave = quizPageData;
          _context4.n = 13;
          break;
        case 8:
          if (!(currentTarget === 'knowledge-page')) {
            _context4.n = 9;
            break;
          }
          saveKnowledgePageStateToMemory();
          keyToSave = 'crzrt_knowledge_page_data';
          dataToSave = knowledgePageData;
          _context4.n = 13;
          break;
        case 9:
          if (!(currentTarget === 'news-page')) {
            _context4.n = 10;
            break;
          }
          saveNewsPageStateToMemory();
          keyToSave = 'crzrt_news_page_data';
          dataToSave = newsPageData;
          _context4.n = 13;
          break;
        case 10:
          if (!(currentTarget === 'about-us')) {
            _context4.n = 11;
            break;
          }
          saveAboutUsStateToMemory();
          keyToSave = 'crzrt_about_data';
          dataToSave = aboutData;
          _context4.n = 13;
          break;
        case 11:
          if (!(currentTarget === 'contacts')) {
            _context4.n = 12;
            break;
          }
          saveContactsStateToMemory();
          keyToSave = 'crzrt_contacts';
          dataToSave = contactsData;
          _context4.n = 13;
          break;
        case 12:
          if (!(currentTarget === 'users')) {
            _context4.n = 13;
            break;
          }
          alert('Для управления пользователями используйте специальный раздел API (в разработке)');
          return _context4.a(2);
        case 13:
          if (keyToSave) {
            _context4.n = 14;
            break;
          }
          return _context4.a(2);
        case 14:
          updateSaveButtonsState({
            text: 'Сохраняется...',
            opacity: '0.8',
            disabled: true
          });
          if (!(currentTarget === 'main-page')) {
            _context4.n = 16;
            break;
          }
          updateSaveButtonsState({
            text: 'Загрузка медиа...'
          });
          snapshot = JSON.parse(JSON.stringify(dataToSave));
          _context4.n = 15;
          return replaceMainPageBase64WithUploads(snapshot);
        case 15:
          dataToSave = _context4.v;
          mainPageData = dataToSave;
          window.mainPageData = mainPageData;
          renderMainPageAdmin();
        case 16:
          if (!(currentTarget === 'ecp-page')) {
            _context4.n = 18;
            break;
          }
          updateSaveButtonsState({
            text: 'Загрузка медиа...'
          });
          _snapshot = JSON.parse(JSON.stringify(dataToSave));
          _context4.n = 17;
          return replaceEcpBase64WithUploads(_snapshot);
        case 17:
          dataToSave = _context4.v;
          ecpPageData = dataToSave;
          window.ecpPageData = ecpPageData;
          renderEcpPageAdmin();
        case 18:
          if (!(currentTarget === 'consulting-page')) {
            _context4.n = 20;
            break;
          }
          updateSaveButtonsState({
            text: 'Загрузка медиа...'
          });
          _snapshot2 = JSON.parse(JSON.stringify(dataToSave));
          _context4.n = 19;
          return replaceConsultingBase64WithUploads(_snapshot2);
        case 19:
          dataToSave = _context4.v;
          consultingPageData = dataToSave;
          window.consultingPageData = consultingPageData;
          renderConsultingPageAdmin();
        case 20:
          if (!(currentTarget === 'support-page')) {
            _context4.n = 22;
            break;
          }
          updateSaveButtonsState({
            text: 'Загрузка медиа...'
          });
          _snapshot3 = JSON.parse(JSON.stringify(dataToSave));
          _context4.n = 21;
          return replaceSupportBase64WithUploads(_snapshot3);
        case 21:
          dataToSave = _context4.v;
          supportPageData = dataToSave;
          window.supportPageData = supportPageData;
          renderSupportPageAdmin();
        case 22:
          if (!(currentTarget === 'obuchenie-page')) {
            _context4.n = 24;
            break;
          }
          updateSaveButtonsState({
            text: 'Загрузка медиа...'
          });
          _snapshot4 = JSON.parse(JSON.stringify(dataToSave));
          _context4.n = 23;
          return replaceObuchenieBase64WithUploads(_snapshot4);
        case 23:
          dataToSave = _context4.v;
          obucheniePageData = dataToSave;
          window.obucheniePageData = obucheniePageData;
          renderObucheniePageAdmin();
        case 24:
          if (!(currentTarget === 'knowledge-page')) {
            _context4.n = 26;
            break;
          }
          updateSaveButtonsState({
            text: 'Загрузка медиа...'
          });
          _snapshot5 = JSON.parse(JSON.stringify(dataToSave));
          _context4.n = 25;
          return replaceKnowledgeBase64WithUploads(_snapshot5);
        case 25:
          dataToSave = _context4.v;
          knowledgePageData = dataToSave;
          window.knowledgePageData = knowledgePageData;
          renderKnowledgePageAdmin();
        case 26:
          if (!(currentTarget === 'news-page')) {
            _context4.n = 28;
            break;
          }
          updateSaveButtonsState({
            text: 'Загрузка медиа...'
          });
          _snapshot6 = JSON.parse(JSON.stringify(dataToSave));
          _context4.n = 27;
          return replaceNewsBase64WithUploads(_snapshot6);
        case 27:
          dataToSave = _context4.v;
          newsPageData = dataToSave;
          window.newsPageData = newsPageData;
          renderNewsPageAdmin();
        case 28:
          updateSaveButtonsState({
            text: 'Сохраняется...'
          });

          // Отправляем данные на Бэкенд
          _context4.n = 29;
          return fetch('api/settings.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              key: keyToSave,
              value: dataToSave
            })
          });
        case 29:
          response = _context4.v;
          _context4.n = 30;
          return response.text();
        case 30:
          rawResponse = _context4.v;
          result = null;
          _context4.p = 31;
          result = rawResponse ? JSON.parse(rawResponse) : null;
          _context4.n = 33;
          break;
        case 32:
          _context4.p = 32;
          _t4 = _context4.v;
          throw new Error("\u0421\u0435\u0440\u0432\u0435\u0440 \u0432\u0435\u0440\u043D\u0443\u043B \u043D\u0435-JSON \u043E\u0442\u0432\u0435\u0442 (HTTP ".concat(response.status, "). \u041E\u0431\u044B\u0447\u043D\u043E \u044D\u0442\u043E \u0438\u0437-\u0437\u0430 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0433\u043E \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F."));
        case 33:
          if (!(!response.ok || !((_result = result) !== null && _result !== void 0 && _result.success))) {
            _context4.n = 34;
            break;
          }
          throw new Error(result.error || 'Ошибка сервера');
        case 34:
          try {
            localStorage.setItem(keyToSave, JSON.stringify(dataToSave));
          } catch (storageErr) {
            console.warn('localStorage backup failed', storageErr);
          }

          // Визуальный отклик об успехе
          updateSaveButtonsState({
            text: "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E! (".concat((result.size / 1024).toFixed(1), " KB)"),
            backgroundColor: '#34c759',
            color: '#fff',
            opacity: '1'
          });
          setTimeout(function () {
            updateSaveButtonsState({
              text: originalText,
              backgroundColor: '',
              color: '',
              boxShadow: '',
              disabled: false
            });
          }, 2000);
          _context4.n = 36;
          break;
        case 35:
          _context4.p = 35;
          _t5 = _context4.v;
          console.error("Storage error:", _t5);
          alert("Ошибка сохранения: " + _t5.message + "\nПроверьте формат/размер изображения и повторите.");
          updateSaveButtonsState({
            text: originalText,
            opacity: '1',
            disabled: false
          });
        case 36:
          return _context4.a(2);
      }
    }, _callee4, null, [[31, 32], [1, 35]]);
  }));
  function handleSaveClick() {
    return _handleSaveClick.apply(this, arguments);
  }
  return handleSaveClick;
}();
document.getElementById('globalSaveBtn').addEventListener('click', handleSaveClick);
document.addEventListener('click', function (e) {
  if (e.target && e.target.classList.contains('btn-save-bottom')) {
    handleSaveClick();
  }
});

// Initialize display
checkAuth();