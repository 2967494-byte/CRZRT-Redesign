// Hero slider (контент и фоны — из landing-content.js)
let heroCurrent = 0;

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
  setHeroDot((heroCurrent - 1 + heroSlideCount()) % heroSlideCount());
});

document.getElementById('hero-next')?.addEventListener('click', () => {
  setHeroDot((heroCurrent + 1) % heroSlideCount());
});

document.addEventListener('landingContentReady', () => {
  heroCurrent = window.__heroCurrent ?? 0;
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

// Form submit
document.getElementById('consultForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
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
  '.events-card, .news-card, .promo-banner, .partners-section, .review-card, .consultation-card__left, .consultation-card__right, .social-banner';

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

document.addEventListener('landingContentReady', () => {
  observeRevealElements();
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
