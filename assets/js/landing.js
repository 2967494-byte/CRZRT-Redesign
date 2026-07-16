var _document$getElementB, _document$getElementB2, _document$getElementB3;
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Hero slider (контент и фоны — из landing-content.js)
var heroCurrent = 0;
function isStandaloneHeroPage() {
  var _window$__heroSlides;
  if ((((_window$__heroSlides = window.__heroSlides) === null || _window$__heroSlides === void 0 ? void 0 : _window$__heroSlides.length) || 0) > 1) return false;
  return document.body.dataset.page === 'consulting' || document.body.dataset.page === 'support' || document.body.dataset.page === 'obuchenie' || document.body.classList.contains('theme-blue') || document.body.classList.contains('theme-purple') || Boolean(document.querySelector('.consulting-hero')) || Boolean(document.querySelector('.hero-slider--single'));
}
function heroSlideCount() {
  var _window$__heroSlides2;
  return ((_window$__heroSlides2 = window.__heroSlides) === null || _window$__heroSlides2 === void 0 ? void 0 : _window$__heroSlides2.length) || document.querySelectorAll('.hero-slide__dots .dot').length || 1;
}
function setHeroDot(i) {
  if (typeof window.applyHeroSlide === 'function') {
    var _window$__heroCurrent;
    window.applyHeroSlide(i);
    heroCurrent = (_window$__heroCurrent = window.__heroCurrent) !== null && _window$__heroCurrent !== void 0 ? _window$__heroCurrent : i;
    return;
  }
  var dots = document.querySelectorAll('.hero-slide__dots .dot');
  dots.forEach(function (d) {
    return d.classList.remove('active');
  });
  if (dots[i]) dots[i].classList.add('active');
  heroCurrent = i;
}
(_document$getElementB = document.getElementById('hero-prev')) === null || _document$getElementB === void 0 || _document$getElementB.addEventListener('click', function () {
  if (isStandaloneHeroPage()) return;
  setHeroDot((heroCurrent - 1 + heroSlideCount()) % heroSlideCount());
});
(_document$getElementB2 = document.getElementById('hero-next')) === null || _document$getElementB2 === void 0 || _document$getElementB2.addEventListener('click', function () {
  if (isStandaloneHeroPage()) return;
  setHeroDot((heroCurrent + 1) % heroSlideCount());
});
document.addEventListener('click', function (e) {
  if (e.target.matches('.hero-slide__dots .dot')) {
    if (isStandaloneHeroPage()) return;
    var slideIdx = parseInt(e.target.dataset.slide, 10);
    if (!isNaN(slideIdx)) {
      setHeroDot(slideIdx);
    }
  }
});
function syncHeroControls() {
  var _document$querySelect, _document$querySelect2;
  var count = heroSlideCount();
  var hide = count <= 1;
  (_document$querySelect = document.querySelector('.hero-slide__arrows')) === null || _document$querySelect === void 0 || _document$querySelect.classList.toggle('is-hidden', hide);
  (_document$querySelect2 = document.querySelector('.hero-slide__dots')) === null || _document$querySelect2 === void 0 || _document$querySelect2.classList.toggle('is-hidden', hide);
}
document.addEventListener('landingContentReady', function () {
  var _window$__heroCurrent2, _window$CrzrtZoomSync, _window$CrzrtZoomSync2;
  heroCurrent = (_window$__heroCurrent2 = window.__heroCurrent) !== null && _window$__heroCurrent2 !== void 0 ? _window$__heroCurrent2 : 0;
  syncHeroControls();
  (_window$CrzrtZoomSync = window.CrzrtZoomSync) === null || _window$CrzrtZoomSync === void 0 || (_window$CrzrtZoomSync2 = _window$CrzrtZoomSync.prepareAllInternalLinks) === null || _window$CrzrtZoomSync2 === void 0 || _window$CrzrtZoomSync2.call(_window$CrzrtZoomSync);
});
document.addEventListener('heroSlidesUpdated', function () {
  var _window$__heroCurrent3;
  heroCurrent = (_window$__heroCurrent3 = window.__heroCurrent) !== null && _window$__heroCurrent3 !== void 0 ? _window$__heroCurrent3 : 0;
  syncHeroControls();
});

// Карусель «Наши партнёры» — прокрутка трека
var partnersTrack = document.querySelector('.partners-track');
var partnersPrev = document.getElementById('partners-prev');
var partnersNext = document.getElementById('partners-next');
function partnersScrollStep() {
  if (!partnersTrack) return 320;
  return Math.round(partnersTrack.clientWidth);
}
partnersPrev === null || partnersPrev === void 0 || partnersPrev.addEventListener('click', function () {
  partnersTrack === null || partnersTrack === void 0 || partnersTrack.scrollBy({
    left: -partnersScrollStep(),
    behavior: 'smooth'
  });
});
partnersNext === null || partnersNext === void 0 || partnersNext.addEventListener('click', function () {
  partnersTrack === null || partnersTrack === void 0 || partnersTrack.scrollBy({
    left: partnersScrollStep(),
    behavior: 'smooth'
  });
});

// Auto-advance hero
setInterval(function () {
  if (isStandaloneHeroPage()) return;
  if (heroSlideCount() > 1) {
    setHeroDot((heroCurrent + 1) % heroSlideCount());
  }
}, 4000);

// Sticky Header
var header = document.querySelector('.header');
window.addEventListener('scroll', function () {
  if (window.scrollY > 50) {
    header === null || header === void 0 || header.classList.add('header--scrolled');
  } else {
    header === null || header === void 0 || header.classList.remove('header--scrolled');
  }
});

// Form submit → Bitrix24 CRM
(_document$getElementB3 = document.getElementById('consultForm')) === null || _document$getElementB3 === void 0 || _document$getElementB3.addEventListener('submit', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
    var _document$getElementB4, _document$getElementB5, _document$getElementB6, _document$getElementB7, _document$getElementB8, _document$getElementB9, _document$getElementB0;
    var form, submitBtn, name, lastName, phone, email, interest, agreePolicy, agreeNews, originalText, response, result, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          e.preventDefault();
          form = e.currentTarget;
          submitBtn = form.querySelector('button[type="submit"]');
          name = ((_document$getElementB4 = document.getElementById('consultName')) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value.trim()) || '';
          lastName = ((_document$getElementB5 = document.getElementById('consultSurname')) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.value.trim()) || '';
          phone = ((_document$getElementB6 = document.getElementById('consultPhone')) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.value.trim()) || '';
          email = ((_document$getElementB7 = document.getElementById('consultEmail')) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.value.trim()) || '';
          interest = ((_document$getElementB8 = document.getElementById('consultInterest')) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.value.trim()) || '';
          agreePolicy = ((_document$getElementB9 = document.getElementById('agreePolicy')) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.checked) || false;
          agreeNews = ((_document$getElementB0 = document.getElementById('agreeNews')) === null || _document$getElementB0 === void 0 ? void 0 : _document$getElementB0.checked) || false;
          if (!(!name || !phone)) {
            _context.n = 1;
            break;
          }
          alert('Укажите имя и телефон');
          return _context.a(2);
        case 1:
          if (interest) {
            _context.n = 2;
            break;
          }
          alert('Выберите направление в поле «Мне интересно»');
          return _context.a(2);
        case 2:
          if (agreePolicy) {
            _context.n = 3;
            break;
          }
          alert('Необходимо согласие на обработку персональных данных');
          return _context.a(2);
        case 3:
          originalText = (submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.textContent) || 'Отправить';
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка…';
          }
          _context.p = 4;
          _context.n = 5;
          return fetch('api/bitrix-lead-consult.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              lastName: lastName,
              phone: phone,
              email: email,
              interest: interest,
              agreePolicy: agreePolicy,
              agreeNews: agreeNews,
              pageUrl: window.location.href,
              pageLabel: document.title
            })
          });
        case 5:
          response = _context.v;
          _context.n = 6;
          return response.json().catch(function () {
            return {};
          });
        case 6:
          result = _context.v;
          if (!(!response.ok || !result.success)) {
            _context.n = 7;
            break;
          }
          throw new Error(result.error || 'Не удалось отправить заявку');
        case 7:
          alert(result.message || 'Спасибо! Мы свяжемся с вами в ближайшее время.');
          form.reset();
          _context.n = 9;
          break;
        case 8:
          _context.p = 8;
          _t = _context.v;
          alert(_t.message || 'Ошибка отправки. Попробуйте позже или позвоните нам.');
        case 9:
          _context.p = 9;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
          return _context.f(9);
        case 10:
          return _context.a(2);
      }
    }, _callee, null, [[4, 8, 9, 10]]);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

// Scroll Reveal Animations
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    } else {
      entry.target.classList.remove('revealed');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -10px 0px'
});
var REVEAL_SELECTORS = '.events-card, .news-card, .promo-banner, .partners-section, .review-card, .consultation-card__left, .consultation-card__right, .social-banner, ' + '.ecp-card, .ecp-btn-large, .ecp-panel, .ecp-tariffs__title, .ecp-tariff-card, .ecp-blanks__title, .ecp-blank-card, .ecp-manual__title, .ecp-manual__item, .ecp-manual__graphic, .ecp-videos__title, .ecp-video-card, .ecp-support-banner, ' + '.obuchenie-cal-card, .occ-card, .obuchenie-testing-banner, .obuchenie-calendar-section, .obuchenie-course-search-section, ' + '.consulting-competency-card, .consulting-why-card, ' + '.support-service-card, .support-checklist-card, .support-calc, .ecp-tariff-card, .ecp-blank-card, .ecp-video-card';
function observeRevealElements() {
  var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  root.querySelectorAll(REVEAL_SELECTORS).forEach(function (el) {
    if (!el.classList.contains('reveal-init')) el.classList.add('reveal-init');
    revealObserver.observe(el);
  });
}
window.__reinitReveal = function (selector) {
  document.querySelectorAll(selector).forEach(function (el) {
    el.classList.add('reveal-init');
    revealObserver.observe(el);
  });
};
observeRevealElements();
['landingContentReady', 'obuchenieContentReady', 'consultingContentReady', 'supportContentReady', 'ecpContentReady'].forEach(function (evt) {
  document.addEventListener(evt, function () {
    return observeRevealElements();
  });
});

// LOGIN POPOVER
var loginModal = document.getElementById('loginModal');
var openLoginBtn = document.getElementById('openLoginModal');
var closeLoginBtn = document.getElementById('closeLoginModal');
var loginForm = document.getElementById('loginForm');
var loginError = document.getElementById('loginError');
openLoginBtn === null || openLoginBtn === void 0 || openLoginBtn.addEventListener('click', function () {
  loginModal === null || loginModal === void 0 || loginModal.classList.toggle('active');
});
closeLoginBtn === null || closeLoginBtn === void 0 || closeLoginBtn.addEventListener('click', function () {
  loginModal === null || loginModal === void 0 || loginModal.classList.remove('active');
});
document.addEventListener('click', function (e) {
  if (!(loginModal !== null && loginModal !== void 0 && loginModal.contains(e.target)) && !(openLoginBtn !== null && openLoginBtn !== void 0 && openLoginBtn.contains(e.target))) {
    loginModal === null || loginModal === void 0 || loginModal.classList.remove('active');
  }
});
loginForm === null || loginForm === void 0 || loginForm.addEventListener('submit', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(e) {
    var email, password, submitBtn, originalText, response, data, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          e.preventDefault();
          email = document.getElementById('loginEmail').value;
          password = document.getElementById('loginPass').value;
          submitBtn = loginForm.querySelector('button[type="submit"]');
          originalText = submitBtn.innerText;
          submitBtn.innerText = 'Вход...';
          submitBtn.disabled = true;
          loginError.style.display = 'none';
          _context2.p = 1;
          _context2.n = 2;
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
          response = _context2.v;
          _context2.n = 3;
          return response.json();
        case 3:
          data = _context2.v;
          if (data.success) {
            window.location.href = 'admin.html';
          } else {
            loginError.style.display = 'block';
            loginError.innerText = data.error || 'Неверный e-mail или пароль';
          }
          _context2.n = 5;
          break;
        case 4:
          _context2.p = 4;
          _t2 = _context2.v;
          loginError.style.display = 'block';
          loginError.innerText = 'Ошибка соединения с сервером';
        case 5:
          _context2.p = 5;
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
          return _context2.f(5);
        case 6:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 4, 5, 6]]);
  }));
  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());
var BITRIX_CHAT_LOADER_URL = 'https://cdn-ru.bitrix24.ru/b12905608/crm/site_button/loader_4_0j0lp5.js';
function initBitrixChatWidget() {
  if (document.getElementById('crzrt-bitrix-chat-loader') || window.__crzrtBitrixChatLoading) return;
  window.__crzrtBitrixChatLoading = true;
  var script = document.createElement('script');
  script.id = 'crzrt-bitrix-chat-loader';
  script.async = true;
  script.src = "".concat(BITRIX_CHAT_LOADER_URL, "?").concat(Math.floor(Date.now() / 60000));
  var firstScript = document.getElementsByTagName('script')[0];
  if (firstScript !== null && firstScript !== void 0 && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    (document.head || document.body).appendChild(script);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initBitrixChatWidget();
    applyDynamicLogo();
  });
} else {
  initBitrixChatWidget();
  applyDynamicLogo();
}

function applyDynamicLogo() {
  var local = localStorage.getItem('crzrt_main_page_data');
  if (local) {
    try {
      var data = JSON.parse(local);
      if (data && data.logo) {
        var logoImgs = document.querySelectorAll('.logo__img');
        logoImgs.forEach(function (img) {
          img.src = data.logo;
        });
      }
    } catch (e) {
      console.warn('Error parsing logo settings:', e);
    }
  }
  
  var apiPath = window.location.pathname.indexOf('/courses/') !== -1 ? '../api/settings.php' : 'api/settings.php';
  fetch(apiPath + '?key=crzrt_main_page_data')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data.logo) {
        localStorage.setItem('crzrt_main_page_data', JSON.stringify(data));
        var logoImgs = document.querySelectorAll('.logo__img');
        logoImgs.forEach(function (img) {
          img.src = data.logo;
        });
      }
    })
    .catch(function (err) {
      console.warn('Failed to load logo from server', err);
    });
}