// Hero slider (контент и фоны — из landing-content.js)
let heroCurrent = 0;

function isStandaloneHeroPage() {
  if ((window.__heroSlides?.length || 0) > 1) return false;
  return (
    document.body.dataset.page === 'consulting' ||
    document.body.dataset.page === 'support' ||
    document.body.dataset.page === 'obuchenie' ||
    document.body.classList.contains('theme-blue') ||
    document.body.classList.contains('theme-purple') ||
    Boolean(document.querySelector('.consulting-hero')) ||
    Boolean(document.querySelector('.hero-slider--single'))
  );
}

function heroSlideCount() {
  return window.__heroSlides?.length || document.querySelectorAll('.hero-slide__dots .dot').length || 1;
}

function setHeroDot(i) {
  if (typeof window.applyHeroSlide === 'function') {
    window.applyHeroSlide(i);
    heroCurrent = window.__heroCurrent ?? i;
    return;
  }
  const dots = document.querySelectorAll('.hero-slide__dots .dot');
  dots.forEach((d) => d.classList.remove('active'));
  if (dots[i]) dots[i].classList.add('active');
  heroCurrent = i;
}

document.getElementById('hero-prev')?.addEventListener('click', () => {
  if (isStandaloneHeroPage()) return;
  setHeroDot((heroCurrent - 1 + heroSlideCount()) % heroSlideCount());
});

document.getElementById('hero-next')?.addEventListener('click', () => {
  if (isStandaloneHeroPage()) return;
  setHeroDot((heroCurrent + 1) % heroSlideCount());
});

function syncHeroControls() {
  const count = heroSlideCount();
  const hide = count <= 1;
  document.querySelector('.hero-slide__arrows')?.classList.toggle('is-hidden', hide);
  document.querySelector('.hero-slide__dots')?.classList.toggle('is-hidden', hide);
}

document.addEventListener('landingContentReady', () => {
  heroCurrent = window.__heroCurrent ?? 0;
  syncHeroControls();
  window.CrzrtZoomSync?.prepareAllInternalLinks?.();
});

document.addEventListener('heroSlidesUpdated', () => {
  heroCurrent = window.__heroCurrent ?? 0;
  syncHeroControls();
});

// Карусель «Наши партнёры» — прокрутка трека
const partnersTrack = document.querySelector('.partners-track');
const partnersPrev = document.getElementById('partners-prev');
const partnersNext = document.getElementById('partners-next');

function partnersScrollStep() {
  if (!partnersTrack) return 320;
  return Math.round(partnersTrack.clientWidth);
}

partnersPrev?.addEventListener('click', () => {
  partnersTrack?.scrollBy({ left: -partnersScrollStep(), behavior: 'smooth' });
});

partnersNext?.addEventListener('click', () => {
  partnersTrack?.scrollBy({ left: partnersScrollStep(), behavior: 'smooth' });
});

// Auto-advance hero
setInterval(() => {
  if (isStandaloneHeroPage()) return;
  if (heroSlideCount() > 1) {
    setHeroDot((heroCurrent + 1) % heroSlideCount());
  }
}, 4000);

// Sticky Header
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header?.classList.add('header--scrolled');
  } else {
    header?.classList.remove('header--scrolled');
  }
});

// Form submit → Bitrix24 CRM
document.getElementById('consultForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const submitBtn = form.querySelector('button[type="submit"]');
  const name = document.getElementById('consultName')?.value.trim() || '';
  const lastName = document.getElementById('consultSurname')?.value.trim() || '';
  const phone = document.getElementById('consultPhone')?.value.trim() || '';
  const email = document.getElementById('consultEmail')?.value.trim() || '';
  const interest = document.getElementById('consultInterest')?.value.trim() || '';
  const agreePolicy = document.getElementById('agreePolicy')?.checked || false;
  const agreeNews = document.getElementById('agreeNews')?.checked || false;

  if (!name || !phone) {
    alert('Укажите имя и телефон');
    return;
  }
  if (!interest) {
    alert('Выберите направление в поле «Мне интересно»');
    return;
  }
  if (!agreePolicy) {
    alert('Необходимо согласие на обработку персональных данных');
    return;
  }

  const originalText = submitBtn?.textContent || 'Отправить';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка…';
  }

  try {
    const response = await fetch('api/bitrix-lead-consult.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        lastName,
        phone,
        email,
        interest,
        agreePolicy,
        agreeNews,
        pageUrl: window.location.href,
        pageLabel: document.title,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Не удалось отправить заявку');
    }
    alert(result.message || 'Спасибо! Мы свяжемся с вами в ближайшее время.');
    form.reset();
  } catch (error) {
    alert(error.message || 'Ошибка отправки. Попробуйте позже или позвоните нам.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
});

// Scroll Reveal Animations
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      } else {
        entry.target.classList.remove('revealed');
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -10px 0px'
  }
);

const REVEAL_SELECTORS =
  '.events-card, .news-card, .promo-banner, .partners-section, .review-card, .consultation-card__left, .consultation-card__right, .social-banner, ' +
  '.ecp-card, .ecp-btn-large, .ecp-panel, .ecp-tariffs__title, .ecp-tariff-card, .ecp-blanks__title, .ecp-blank-card, .ecp-manual__title, .ecp-manual__item, .ecp-manual__graphic, .ecp-videos__title, .ecp-video-card, .ecp-support-banner, ' +
  '.obuchenie-cal-card, .occ-card, .obuchenie-testing-banner, .obuchenie-calendar-section, .obuchenie-course-search-section, ' +
  '.consulting-competency-card, .consulting-why-card, ' +
  '.support-service-card, .support-checklist-card, .support-calc, .ecp-tariff-card, .ecp-blank-card, .ecp-video-card';

function observeRevealElements(root = document) {
  root.querySelectorAll(REVEAL_SELECTORS).forEach((el) => {
    if (!el.classList.contains('reveal-init')) el.classList.add('reveal-init');
    revealObserver.observe(el);
  });
}

window.__reinitReveal = (selector) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.classList.add('reveal-init');
    revealObserver.observe(el);
  });
};

observeRevealElements();

['landingContentReady', 'obuchenieContentReady', 'consultingContentReady', 'supportContentReady', 'ecpContentReady'].forEach(evt => {
  document.addEventListener(evt, () => observeRevealElements());
});

// LOGIN POPOVER
const loginModal = document.getElementById('loginModal');
const openLoginBtn = document.getElementById('openLoginModal');
const closeLoginBtn = document.getElementById('closeLoginModal');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

openLoginBtn?.addEventListener('click', () => {
  loginModal?.classList.toggle('active');
});

closeLoginBtn?.addEventListener('click', () => {
  loginModal?.classList.remove('active');
});

document.addEventListener('click', (e) => {
  if (!loginModal?.contains(e.target) && !openLoginBtn?.contains(e.target)) {
    loginModal?.classList.remove('active');
  }
});

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPass').value;
  const submitBtn = loginForm.querySelector('button[type="submit"]');

  const originalText = submitBtn.innerText;
  submitBtn.innerText = 'Вход...';
  submitBtn.disabled = true;
  loginError.style.display = 'none';

  try {
    const response = await fetch('api/auth.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if (data.success) {
      window.location.href = 'admin.html';
    } else {
      loginError.style.display = 'block';
      loginError.innerText = data.error || 'Неверный e-mail или пароль';
    }
  } catch (error) {
    loginError.style.display = 'block';
    loginError.innerText = 'Ошибка соединения с сервером';
  } finally {
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
  }
});

const BITRIX_CHAT_LOADER_URL = 'https://cdn-ru.bitrix24.ru/b12905608/crm/site_button/loader_4_0j0lp5.js';

function initBitrixChatWidget() {
  if (document.getElementById('crzrt-bitrix-chat-loader') || window.__crzrtBitrixChatLoading) return;
  window.__crzrtBitrixChatLoading = true;

  const script = document.createElement('script');
  script.id = 'crzrt-bitrix-chat-loader';
  script.async = true;
  script.src = `${BITRIX_CHAT_LOADER_URL}?${Math.floor(Date.now() / 60000)}`;

  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    (document.head || document.body).appendChild(script);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBitrixChatWidget);
} else {
  initBitrixChatWidget();
}

