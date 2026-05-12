// Hero slider
const dots = document.querySelectorAll('.dot');
let current = 0;

function setDot(i) {
  dots.forEach(d => d.classList.remove('active'));
  if (dots[i]) dots[i].classList.add('active');
  current = i;
}

document.getElementById('hero-prev')?.addEventListener('click', () => {
  setDot((current - 1 + dots.length) % dots.length);
});
document.getElementById('hero-next')?.addEventListener('click', () => {
  setDot((current + 1) % dots.length);
});

// Карусель «Наши партнёры» — прокрутка трека
const partnersTrack = document.querySelector('.partners-track');
const partnersPrev = document.getElementById('partners-prev');
const partnersNext = document.getElementById('partners-next');

function partnersScrollStep() {
  if (!partnersTrack) return 320;
  const first = partnersTrack.querySelector('.partner-logo');
  if (!first) return 320;
  const w = first.getBoundingClientRect().width;
  const style = window.getComputedStyle(partnersTrack);
  const gap = parseFloat(style.columnGap || style.gap) || 0;
  return Math.round(w + gap);
}

partnersPrev?.addEventListener('click', () => {
  partnersTrack?.scrollBy({ left: -partnersScrollStep(), behavior: 'smooth' });
});

partnersNext?.addEventListener('click', () => {
  partnersTrack?.scrollBy({ left: partnersScrollStep(), behavior: 'smooth' });
});

// Auto-advance
setInterval(() => {
  setDot((current + 1) % dots.length);
}, 4000);

// Sticky Header
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
});

// Form submit
document.getElementById('consultForm')?.addEventListener('submit', e => {
  e.preventDefault();
  alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
});

// Scroll Reveal Animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    } else {
      entry.target.classList.remove('revealed'); // Повторная анимация
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -10px 0px'
});

const elementsToReveal = document.querySelectorAll(
  '.events-card, .news-card, .promo-banner, .partners-section, .review-card, .consultation-card__left, .consultation-card__right, .social-banner'
);

elementsToReveal.forEach(el => {
  el.classList.add('reveal-init');
  revealObserver.observe(el);
});

// LOGIN POPOVER
const loginModal = document.getElementById('loginModal');
const openLoginBtn = document.getElementById('openLoginModal');
const closeLoginBtn = document.getElementById('closeLoginModal');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

openLoginBtn?.addEventListener('click', () => {
  loginModal.classList.toggle('active');
});

closeLoginBtn?.addEventListener('click', () => {
  loginModal.classList.remove('active');
});

// Close when clicking outside
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
