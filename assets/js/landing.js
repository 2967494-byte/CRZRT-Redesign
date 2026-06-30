// Hero slider (контент и фоны — из landing-content.js)
let heroCurrent = 0;

function isStandaloneHeroPage() {
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

const DEFAULT_CHAT_WELCOME_MESSAGES = [
  'Здравствуйте! 👋 Я специалист Центра развития закупок РТ.',
  'Чем я могу вам помочь? Вы можете задать любой вопрос по обучению, тендерному сопровождению или работе на нашей ЭТП.'
];

const DEFAULT_CHAT_AUTO_REPLIES = [
  'Спасибо за ваше обращение! Ваше сообщение отправлено в отдел поддержки. Наш специалист свяжется с вами в ближайшее время. Если хотите ускорить процесс, оставьте ваши контактные данные.'
];

function normalizeChatTextList(raw, fallback) {
  const source = Array.isArray(raw) ? raw : (typeof raw === 'string' && raw.trim() ? [raw] : []);
  const items = source.map((item) => String(item || '').trim()).filter(Boolean);
  if (items.length) return items;
  return Array.isArray(fallback) ? [...fallback] : [];
}

function readChatWidgetFromStorage() {
  try {
    const cached = localStorage.getItem('crzrt_main_page_data');
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    return parsed?.chatWidget || null;
  } catch (e) {
    return null;
  }
}

// --- DYNAMIC CHAT WIDGET INITIALIZATION ---
function initChatWidget() {
  if (document.querySelector('.crzrt-chat-container')) return;

  const initialChat = readChatWidgetFromStorage();
  let operatorName = initialChat?.operatorName || 'Анна';
  let operatorAvatar = initialChat?.operatorAvatar || 'assets/img/chat-avatar.png';
  let welcomeMessages = normalizeChatTextList(initialChat?.welcomeMessages, DEFAULT_CHAT_WELCOME_MESSAGES);
  let autoReplies = normalizeChatTextList(
    initialChat?.autoReplies ?? initialChat?.autoReply,
    DEFAULT_CHAT_AUTO_REPLIES
  );

  const chatHTML = `
    <div class="crzrt-chat-container">
      <button class="crzrt-chat-trigger" aria-label="Открыть чат">
        <img src="${operatorAvatar}" alt="Оператор" class="crzrt-chat-trigger__avatar">
        <span class="crzrt-chat-trigger__badge"></span>
        <span class="crzrt-chat-trigger__pulse"></span>
      </button>

      <div class="crzrt-chat-window">
        <div class="crzrt-chat-header">
          <div class="crzrt-chat-header__avatar-container">
            <img src="${operatorAvatar}" alt="${operatorName}" class="crzrt-chat-header__avatar">
            <span class="crzrt-chat-header__status-dot"></span>
          </div>
          <div class="crzrt-chat-header__info">
            <div class="crzrt-chat-header__name">${operatorName}</div>
            <div class="crzrt-chat-header__status">Консультант ЦРЗ РТ • Онлайн</div>
          </div>
          <button class="crzrt-chat-header__close" aria-label="Закрыть чат">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="crzrt-chat-messages"></div>

        <div class="crzrt-chat-typing" style="display: none;">
          <div class="crzrt-chat-typing__dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="crzrt-chat-typing__label">${operatorName} печатает...</span>
        </div>

        <form class="crzrt-chat-footer">
          <input type="text" class="crzrt-chat-input" placeholder="Напишите сообщение..." required autocomplete="off">
          <button type="submit" class="crzrt-chat-send-btn" aria-label="Отправить">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = chatHTML;
  const container = wrapper.firstElementChild;
  document.body.appendChild(container);

  const trigger = container.querySelector('.crzrt-chat-trigger');
  const windowEl = container.querySelector('.crzrt-chat-window');
  const closeBtn = container.querySelector('.crzrt-chat-header__close');
  const form = container.querySelector('.crzrt-chat-footer');
  const input = container.querySelector('.crzrt-chat-input');
  const msgArea = container.querySelector('.crzrt-chat-messages');
  const typingIndicator = container.querySelector('.crzrt-chat-typing');

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    windowEl.classList.toggle('crzrt-chat-window--open');
    if (windowEl.classList.contains('crzrt-chat-window--open')) {
      input.focus();
      scrollToBottom();
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    windowEl.classList.remove('crzrt-chat-window--open');
  });

  windowEl.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.addEventListener('click', () => {
    windowEl.classList.remove('crzrt-chat-window--open');
  });

  function scrollToBottom() {
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `crzrt-chat-msg crzrt-chat-msg--${sender}`;
    msgDiv.innerHTML = `
      <div class="crzrt-chat-msg__bubble">
        ${escapeHTML(text)}
      </div>
    `;
    msgArea.appendChild(msgDiv);
  }

  function renderWelcomeMessages() {
    const hasUserMessages = msgArea.querySelector('.crzrt-chat-msg--user');
    if (hasUserMessages) return;
    msgArea.innerHTML = '';
    welcomeMessages.forEach((text) => appendMessage(text, 'operator'));
  }

  function showTyping(show) {
    typingIndicator.style.display = show ? 'flex' : 'none';
  }

  function playAutoReplies(replies, index = 0) {
    if (!replies[index]) return;
    showTyping(true);
    scrollToBottom();
    window.setTimeout(() => {
      showTyping(false);
      appendMessage(replies[index], 'operator');
      scrollToBottom();
      if (replies[index + 1]) {
        window.setTimeout(() => playAutoReplies(replies, index + 1), 400);
      }
    }, 1500);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    input.value = '';
    scrollToBottom();
    playAutoReplies(autoReplies);
  });

  renderWelcomeMessages();

  document.addEventListener('landingContentReady', (e) => {
    const data = e.detail;
    if (!data?.chatWidget) return;

    const name = data.chatWidget.operatorName || 'Анна';
    const avatar = data.chatWidget.operatorAvatar || 'assets/img/chat-avatar.png';
    welcomeMessages = normalizeChatTextList(data.chatWidget.welcomeMessages, DEFAULT_CHAT_WELCOME_MESSAGES);
    autoReplies = normalizeChatTextList(
      data.chatWidget.autoReplies ?? data.chatWidget.autoReply,
      DEFAULT_CHAT_AUTO_REPLIES
    );

    const triggerAvatar = container.querySelector('.crzrt-chat-trigger__avatar');
    if (triggerAvatar) triggerAvatar.src = avatar;

    const headerAvatar = container.querySelector('.crzrt-chat-header__avatar');
    if (headerAvatar) {
      headerAvatar.src = avatar;
      headerAvatar.alt = name;
    }

    const headerName = container.querySelector('.crzrt-chat-header__name');
    if (headerName) headerName.textContent = name;

    const typingLabel = container.querySelector('.crzrt-chat-typing__label');
    if (typingLabel) typingLabel.textContent = `${name} печатает...`;

    operatorName = name;
    operatorAvatar = avatar;
    renderWelcomeMessages();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatWidget);
} else {
  initChatWidget();
}

