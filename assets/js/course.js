var courseEnrollMetaCache = null;

function initCoursePage() {
  try { wireCourseProgramPdfLinks(); } catch (e) { console.warn('wireCourseProgramPdfLinks error', e); }
  try { initCourseEnrollModal(); } catch (e) { console.warn('initCourseEnrollModal error', e); }
  try { initCourseEnrollSubmit(); } catch (e) { console.warn('initCourseEnrollSubmit error', e); }

  /* ========================================================================
     COURSE ACCORDION LOGIC
     ======================================================================== */
  const accordionItems = document.querySelectorAll('.course-accordion__item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.course-accordion__trigger');
    const content = item.querySelector('.course-accordion__content');

    trigger.addEventListener('click', () => {
      // Is it already active?
      const isActive = item.classList.contains('active');

      // Close all items
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.course-accordion__content');
        if (otherContent) {
          otherContent.style.maxHeight = null;
        }
      });

      // If it wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Open the first item by default
  if (accordionItems.length > 0) {
    const firstItem = accordionItems[0];
    const firstContent = firstItem.querySelector('.course-accordion__content');
    firstItem.classList.add('active');
    if (firstContent) {
      firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    }
  }

  /* ========================================================================
     SMOOTH SCROLL & ACTIVE NAV LINKS
     ======================================================================== */
  const navLinks = document.querySelectorAll('.course-nav__link');
  const sections = Array.from(navLinks).map(link => {
    const targetId = link.getAttribute('href').substring(1);
    return document.getElementById(targetId);
  }).filter(Boolean);

  // Smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Offset for sticky header and nav bar
        const headerOffset = 140; 
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Update active link on scroll
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150; // offset
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });

  /* ========================================================================
     ENROLL BUTTONS
     ======================================================================== */
  const enrollBtns = document.querySelectorAll('.btn-enroll, [data-enroll-btn]');
  const enrollModal = document.getElementById('enroll-modal');
  const enrollTitle = document.getElementById('enroll-modal-title');
  const enrollDate = document.getElementById('enroll-modal-date');
  const enrollForm = document.getElementById('enroll-form');

  if (enrollModal) {
    enrollBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          const course = await loadCourseEnrollMeta();
          if (!isCourseEnrollOpen(course)) {
            applyCourseEnrollAvailability(course);
            return;
          }
          configureCourseEnrollModalAudience(course);
        } catch (_e) {
          configureCourseEnrollModalAudience(null);
        }

        // Find course title
        const titleEl = document.querySelector('.course-hero__title');
        if (titleEl && enrollTitle) {
          enrollTitle.textContent = titleEl.textContent;
        }
        if (enrollDate) {
          enrollDate.textContent = getCourseStartDateLabel();
        }
        if (enrollForm) {
          enrollForm.dataset.courseId = resolveCourseIdFromPath();
        }
        
        // Show modal
        enrollModal.style.display = 'flex';
        setTimeout(() => enrollModal.classList.add('calendar-modal--visible'), 10);
      });
    });
  }

  updateCourseStartDate();
  // Мгновенно серая/зелёная кнопка по data-enroll-until (без сети)
  applyEnrollAvailabilityFromDom();
  // Лёгкая мета одного курса (не весь settings JSON)
  loadCourseEnrollMeta().catch(() => {});
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCoursePage);
} else {
  initCoursePage();
}

function updateCourseStartDate() {
  const urlParams = new URLSearchParams(window.location.search);
  const dateParam = urlParams.get('date');

  const MONTH_NAMES_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  function formatIso(isoStr) {
    if (!isoStr) return '';
    const p = String(isoStr).trim().split('-');
    if (p.length !== 3) return isoStr;
    const y = parseInt(p[0], 10);
    const m = parseInt(p[1], 10) - 1;
    const d = parseInt(p[2], 10);
    if (!y || m < 0 || m > 11 || !d) return isoStr;
    return d + ' ' + MONTH_NAMES_GENITIVE[m] + (y ? ' ' + y : '');
  }

  const widgetItems = document.querySelectorAll('.course-widget-item');
  let dateValEl = null;
  widgetItems.forEach(item => {
    const label = item.querySelector('.course-widget-item__label');
    if (label && label.textContent.trim().toLowerCase().includes('старт')) {
      dateValEl = item.querySelector('.course-widget-item__val');
    }
  });

  if (!dateValEl) return;

  // ?date= применяем только если ещё нет мета курса; после meta — syncCourseStartDateDisplay
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam.trim()) && !courseEnrollMetaCache) {
    const formatted = formatIso(dateParam.trim());
    if (formatted) {
      dateValEl.textContent = formatted;
      return;
    }
  }

  // Fallback: extract only the first single date if multiple dates were merged in HTML
  const currentText = dateValEl.textContent.trim();
  const match = currentText.match(/^(\d{1,2}\s+[а-яА-Я]+(?:\s+\d{4})?)/);
  if (match && match[1]) {
    dateValEl.textContent = match[1].trim();
  }
}

function getCourseStartDateList(course) {
  const raw = String((course && course.dateFrom) || '');
  return raw.split(',').map((s) => s.trim()).filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s));
}

function resolveSelectedCourseDate(course) {
  const starts = getCourseStartDateList(course);
  const urlDate = (new URLSearchParams(window.location.search).get('date') || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(urlDate) && (!starts.length || starts.includes(urlDate))) {
    return urlDate;
  }
  if (!starts.length) {
    return '';
  }
  const today = typeof moscowTodayIso === 'function' ? moscowTodayIso() : '';
  const upcoming = today ? starts.find((d) => d >= today) : null;
  return upcoming || starts[0];
}

/** После загрузки мета: виджет и ?date= только по реальным датам старта курса. */
function syncCourseStartDateDisplay(course) {
  const iso = resolveSelectedCourseDate(course);
  const MONTH_NAMES_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const formatIso = (isoStr) => {
    if (!isoStr) return '';
    const p = String(isoStr).trim().split('-');
    if (p.length !== 3) return isoStr;
    const y = parseInt(p[0], 10);
    const m = parseInt(p[1], 10) - 1;
    const d = parseInt(p[2], 10);
    if (!y || m < 0 || m > 11 || !d) return isoStr;
    return d + ' ' + MONTH_NAMES_GENITIVE[m] + ' ' + y;
  };

  const widgetItems = document.querySelectorAll('.course-widget-item');
  widgetItems.forEach((item) => {
    const label = item.querySelector('.course-widget-item__label');
    if (label && label.textContent.trim().toLowerCase().includes('старт')) {
      const dateValEl = item.querySelector('.course-widget-item__val');
      if (dateValEl && iso) dateValEl.textContent = formatIso(iso);
    }
  });

  const urlDate = (new URLSearchParams(window.location.search).get('date') || '').trim();
  const starts = getCourseStartDateList(course);
  if (urlDate && starts.length && !starts.includes(urlDate)) {
    try {
      const url = new URL(window.location.href);
      if (iso) url.searchParams.set('date', iso);
      else url.searchParams.delete('date');
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    } catch (_e) {}
  }
}

function resolveCourseIdFromPath() {
  const file = (window.location.pathname.split('/').pop() || '').trim();
  const key = file.replace(/\.html$/i, '');
  return key;
}

function resolveCourseEnrollPrice(course) {
  const fromCourse = String((course && course.price) || '').trim();
  if (fromCourse) return fromCourse;
  return (document.querySelector('.course-widget-item__price')?.textContent || '').trim();
}

function findCourseByPathKey(registry, pathKey) {
  if (!pathKey || !Array.isArray(registry)) return null;
  const rawKey = String(pathKey).trim().toLowerCase();
  let decodedKey = rawKey;
  try {
    decodedKey = decodeURIComponent(rawKey);
  } catch (_e) {}
  return registry.find((item) => {
    if (!item) return false;
    const itemId = String(item.id || '').trim().toLowerCase();
    if (itemId === rawKey || itemId === decodedKey) return true;
    const slug = String(item.slug || '').trim().toLowerCase();
    if (slug && (slug === rawKey || slug === decodedKey)) return true;
    const link = String(item.link || item.url || '').trim().toLowerCase();
    if (link && (link.includes(rawKey) || link.includes(decodedKey))) return true;
    return false;
  }) || null;
}

function getCourseStartDateLabel() {
  const widgetItems = document.querySelectorAll('.course-widget-item');
  for (const item of widgetItems) {
    const label = item.querySelector('.course-widget-item__label');
    if (label && label.textContent.trim().toLowerCase().includes('старт')) {
      const val = item.querySelector('.course-widget-item__val');
      return val ? val.textContent.trim() : '';
    }
  }
  return '';
}

function applyCourseEnrollAudienceMode(mode) {
  if (window.ObuchenieContent && typeof window.ObuchenieContent.setEnrollAudienceMode === 'function') {
    window.ObuchenieContent.setEnrollAudienceMode(mode);
    return;
  }
  const normalizedMode = mode === 'individual' ? 'individual' : 'legal';
  const audienceInput = document.getElementById('enroll-audience-type');
  const companyField = document.getElementById('enroll-company-field');
  const companyInput = document.getElementById('enroll-company');
  const positionField = document.getElementById('enroll-position-field');
  const positionInput = document.getElementById('enroll-position');
  const labels = document.querySelectorAll('[data-audience-label]');

  if (audienceInput) audienceInput.value = normalizedMode;
  labels.forEach((label) => {
    label.classList.toggle('enroll-modal__audience-label--active', label.dataset.audienceLabel === normalizedMode);
  });

  const isLegal = normalizedMode === 'legal';
  if (companyField && companyInput) {
    companyField.hidden = !isLegal;
    companyInput.required = isLegal;
    if (!isLegal) companyInput.value = '';
  }
  if (positionField && positionInput) {
    positionField.hidden = !isLegal;
    positionInput.required = isLegal;
    if (!isLegal) positionInput.value = '';
  }
}

function configureCourseEnrollModalAudience(course) {
  if (window.ObuchenieContent && typeof window.ObuchenieContent.configureEnrollModalAudience === 'function') {
    window.ObuchenieContent.configureEnrollModalAudience({
      forIndividuals: course?.forIndividuals,
      forLegalEntities: course?.forLegalEntities
    });
    return;
  }
  let forIndividuals = course ? course.forIndividuals !== false : true;
  let forLegalEntities = course ? course.forLegalEntities !== false : true;
  if (!forIndividuals && !forLegalEntities) {
    forIndividuals = true;
    forLegalEntities = true;
  }
  const switchWrap = document.getElementById('enroll-audience-switch');
  const toggle = document.getElementById('enroll-audience-toggle');
  if (switchWrap) {
    switchWrap.hidden = false;
  }
  const isSingleAudience = forIndividuals !== forLegalEntities;
  let mode = 'legal';
  if (!forLegalEntities && forIndividuals) {
    mode = 'individual';
  } else if (!forIndividuals && forLegalEntities) {
    mode = 'legal';
  } else if (toggle) {
    mode = toggle.checked ? 'legal' : 'individual';
  }
  if (toggle) {
    toggle.checked = mode === 'legal';
    toggle.disabled = isSingleAudience;
  }
  if (switchWrap) {
    switchWrap.classList.toggle('enroll-modal__audience--locked', isSingleAudience);
  }
  applyCourseEnrollAudienceMode(mode);
}

function configureCourseEnrollModalDistrict(requireDistrict) {
  if (window.ObuchenieContent && typeof window.ObuchenieContent.configureEnrollModalDistrict === 'function') {
    window.ObuchenieContent.configureEnrollModalDistrict(requireDistrict);
    return;
  }
  const districtField = document.getElementById('enroll-district-field');
  const districtSelect = document.getElementById('enroll-district');
  if (districtField && districtSelect) {
    districtField.hidden = !requireDistrict;
    districtSelect.required = Boolean(requireDistrict);
    if (!requireDistrict) {
      districtSelect.value = '';
    }
  }
}

function initCourseEnrollModal() {
  const modal = document.getElementById('enroll-modal');
  if (!modal || modal.dataset.courseEnrollBound === 'true') return;
  modal.dataset.courseEnrollBound = 'true';

  const closeBtn = modal.querySelector('.calendar-modal__close');
  const overlay = modal.querySelector('.calendar-modal__overlay');
  const content = modal.querySelector('.enroll-modal__content');
  const form = document.getElementById('enroll-form');
  const audienceToggle = document.getElementById('enroll-audience-toggle');

  configureCourseEnrollModalAudience(courseEnrollMetaCache);
  configureCourseEnrollModalDistrict(Boolean(courseEnrollMetaCache?.requireDistrict));

  const closeEnrollModal = () => {
    modal.classList.remove('calendar-modal--visible');
    modal.style.display = 'none';
    if (form) {
      form.reset();
      delete form.dataset.courseId;
    }
    configureCourseEnrollModalAudience(courseEnrollMetaCache);
    configureCourseEnrollModalDistrict(Boolean(courseEnrollMetaCache?.requireDistrict));
    const status = document.getElementById('enroll-form-status');
    if (status) {
      status.hidden = true;
      status.textContent = '';
      status.className = 'enroll-modal__status';
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeEnrollModal);
  if (overlay) overlay.addEventListener('click', closeEnrollModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal || (overlay && event.target === overlay)) {
      closeEnrollModal();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display !== 'none') {
      closeEnrollModal();
    }
  });

  if (audienceToggle) {
    audienceToggle.addEventListener('change', () => {
      if (audienceToggle.disabled) return;
      applyCourseEnrollAudienceMode(audienceToggle.checked ? 'legal' : 'individual');
    });
  }

  const audienceLabels = modal.querySelectorAll('[data-audience-label]');
  audienceLabels.forEach((lbl) => {
    lbl.addEventListener('click', () => {
      if (audienceToggle && audienceToggle.disabled) return;
      const targetMode = lbl.dataset.audienceLabel;
      if (!targetMode) return;
      if (audienceToggle) {
        audienceToggle.checked = targetMode === 'legal';
      }
      applyCourseEnrollAudienceMode(targetMode);
    });
  });

  // Prevent accidental close from clicks inside dialog body.
  if (content) {
    content.addEventListener('click', (event) => event.stopPropagation());
  }
}

function parseDurationDaysFromWidget() {
  const widgetItems = document.querySelectorAll('.course-widget-item');
  for (const item of widgetItems) {
    const label = item.querySelector('.course-widget-item__label');
    if (!label || !label.textContent.trim().toLowerCase().includes('длительность')) continue;
    const val = item.querySelector('.course-widget-item__val');
    if (!val) return 1;
    const m = val.textContent.replace(/\s+/g, ' ').match(/(\d+)/);
    return m ? Math.max(1, parseInt(m[1], 10) || 1) : 1;
  }
  return 1;
}

function parseFormatFromTags() {
  const tags = Array.from(document.querySelectorAll('.course-hero__tags .course-tag'))
    .map((el) => el.textContent.trim().toLowerCase())
    .filter(Boolean);
  return tags.some((t) => t.includes('дистан')) ? 'dist' : 'och';
}

function syncCourseEventTexts(isEvent) {
  const aboutNavText = isEvent ? 'О мероприятии' : 'О курсе';
  const audienceNavText = isEvent ? 'Кому подойдет' : 'Для кого';
  const aboutTitleText = aboutNavText;
  const audienceTitleText = isEvent ? 'Кому подойдет мероприятие' : 'Кому подойдет курс';

  const aboutNav =
    document.querySelector('[data-course-about-nav]') ||
    document.querySelector('#courseNav a[href="#about"]');
  if (aboutNav) aboutNav.textContent = aboutNavText;

  const audienceNav =
    document.querySelector('[data-course-audience-nav]') ||
    document.querySelector('#courseNav a[href="#audience"]');
  if (audienceNav) audienceNav.textContent = audienceNavText;

  const aboutTitle =
    document.querySelector('[data-course-about-title]') ||
    document.querySelector('#about .course-section__title');
  if (aboutTitle) aboutTitle.textContent = aboutTitleText;

  const audienceTitle =
    document.querySelector('[data-course-audience-title]') ||
    document.querySelector('#audience .course-section__title');
  if (audienceTitle) audienceTitle.textContent = audienceTitleText;
}

function moscowTodayIso() {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Moscow',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
  } catch (_e) {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}

function readDomEnrollUntil() {
  const el =
    document.querySelector('[data-enroll-btn][data-enroll-until]') ||
    document.querySelector('.btn-enroll[data-enroll-until]') ||
    document.querySelector('.course-cta[data-enroll-until]');
  const until = el ? String(el.getAttribute('data-enroll-until') || '').trim() : '';
  return /^\d{4}-\d{2}-\d{2}$/.test(until) ? until : '';
}

function isCourseEnrollOpen(courseOrUntil) {
  if (courseOrUntil && typeof courseOrUntil === 'object' && courseOrUntil.enrollClosed) {
    return false;
  }
  if (courseOrUntil && typeof courseOrUntil === 'object' && courseOrUntil.active === false) {
    return false;
  }
  if (window.ObuchenieContent && typeof window.ObuchenieContent.isCourseEnrollOpen === 'function') {
    return window.ObuchenieContent.isCourseEnrollOpen(courseOrUntil);
  }
  let until = '';
  if (courseOrUntil && typeof courseOrUntil === 'object') {
    until = String(courseOrUntil.enrollUntil || '').trim();
  } else {
    until = String(courseOrUntil || '').trim();
  }
  if (!until || !/^\d{4}-\d{2}-\d{2}$/.test(until)) return true;
  return moscowTodayIso() <= until;
}

function setEnrollButtonClosedState(btn, closed) {
  if (!btn) return;
  btn.hidden = false;
  if (btn.style.display === 'none') btn.style.display = '';
  btn.disabled = closed;
  btn.setAttribute('aria-disabled', closed ? 'true' : 'false');
  btn.classList.toggle('is-enroll-closed', closed);
  if (closed) {
    btn.classList.remove('btn--green');
  } else if (!btn.classList.contains('btn--green')) {
    btn.classList.add('btn--green');
  }
}

function applyCourseEnrollAvailability(course) {
  const open = isCourseEnrollOpen(course);
  const closed = !open;
  const buttons = document.querySelectorAll('.btn-enroll, [data-enroll-btn]');
  buttons.forEach((btn) => {
    setEnrollButtonClosedState(btn, closed);
    if (course && course.enrollUntil) {
      btn.setAttribute('data-enroll-until', course.enrollUntil);
    }
  });
  const cta = document.querySelector('.course-cta');
  if (cta) {
    cta.hidden = false;
    if (cta.style.display === 'none') cta.style.display = '';
    if (course && course.enrollUntil) {
      cta.setAttribute('data-enroll-until', course.enrollUntil);
    }
  }
  return open;
}

/** Синхронно по атрибутам в HTML — до любого fetch. */
function applyEnrollAvailabilityFromDom() {
  const until = readDomEnrollUntil();
  if (!until) return true;
  return applyCourseEnrollAvailability({ enrollUntil: until });
}

async function loadCourseEnrollMeta() {
  if (courseEnrollMetaCache) return courseEnrollMetaCache;
  const courseId = resolveCourseIdFromPath();
  const switchWrap = document.getElementById('enroll-audience-switch');
  const staticForIndividuals = switchWrap ? switchWrap.dataset.forIndividuals !== 'false' : true;
  const staticForLegalEntities = switchWrap ? switchWrap.dataset.forLegalEntities !== 'false' : true;
  const districtField = document.getElementById('enroll-district-field');
  const staticRequireDistrict = districtField ? !districtField.hidden : false;
  const domEnrollUntil = readDomEnrollUntil();
  const fallback = {
    id: courseId,
    title: (document.querySelector('.course-hero__title')?.textContent || '').trim(),
    dateFrom: '',
    dateTo: '',
    durationDays: parseDurationDaysFromWidget(),
    format: parseFormatFromTags(),
    eventType: 'course',
    enrollUntil: domEnrollUntil,
    price: (document.querySelector('.course-widget-item__price')?.textContent || '').trim(),
    bitrixCourseElementId: null,
    forCustomers: false,
    forSuppliers: false,
    forIndividuals: staticForIndividuals,
    forLegalEntities: staticForLegalEntities,
    is44fz: false,
    is223fz: false,
    requireDistrict: staticRequireDistrict,
    options: []
  };

  if (!courseId) {
    courseEnrollMetaCache = fallback;
    applyCourseEnrollAvailability(fallback);
    syncCourseStartDateDisplay(fallback);
    return fallback;
  }

  try {
    const resp = await fetch(
      '../api/course-enroll-meta.php?id=' + encodeURIComponent(courseId) + '&_=' + Date.now(),
      { cache: 'no-store' }
    );
    if (!resp.ok) {
      // Сеть/сервер: не открываем запись заново, если DOM уже говорит «закрыто»
      if (domEnrollUntil && !isCourseEnrollOpen({ enrollUntil: domEnrollUntil })) {
        courseEnrollMetaCache = { ...fallback, enrollClosed: true, enrollUntil: domEnrollUntil };
      } else {
        courseEnrollMetaCache = fallback;
      }
      applyCourseEnrollAvailability(courseEnrollMetaCache);
      syncCourseStartDateDisplay(courseEnrollMetaCache);
      return courseEnrollMetaCache;
    }
    const data = await resp.json();
    if (!data || !data.found || !data.course) {
      courseEnrollMetaCache = { ...fallback, enrollClosed: true, enrollUntil: domEnrollUntil || '1970-01-01' };
      applyCourseEnrollAvailability(courseEnrollMetaCache);
      syncCourseStartDateDisplay(courseEnrollMetaCache);
      return courseEnrollMetaCache;
    }
    const course = data.course;
    courseEnrollMetaCache = {
      ...fallback,
      ...course,
      id: course.id || courseId,
      enrollClosed: false,
      enrollUntil: course.enrollUntil || domEnrollUntil || ''
    };
    syncCourseEventTexts(courseEnrollMetaCache.eventType === 'event');
    configureCourseEnrollModalAudience(courseEnrollMetaCache);
    configureCourseEnrollModalDistrict(Boolean(courseEnrollMetaCache.requireDistrict));
    applyCourseEnrollAvailability(courseEnrollMetaCache);
    syncCourseStartDateDisplay(courseEnrollMetaCache);
    if (course.btnText) {
      document.querySelectorAll('.btn-enroll, [data-enroll-btn]').forEach((btn) => {
        btn.textContent = course.btnText;
      });
    }
    return courseEnrollMetaCache;
  } catch (_error) {
    if (domEnrollUntil && !isCourseEnrollOpen({ enrollUntil: domEnrollUntil })) {
      courseEnrollMetaCache = { ...fallback, enrollClosed: true, enrollUntil: domEnrollUntil };
    } else {
      courseEnrollMetaCache = fallback;
    }
    applyCourseEnrollAvailability(courseEnrollMetaCache);
    syncCourseStartDateDisplay(courseEnrollMetaCache);
    return courseEnrollMetaCache;
  }
}

function setEnrollStatus(message, type = 'info') {
  const status = document.getElementById('enroll-form-status');
  if (!status) return;
  if (!message) {
    status.hidden = true;
    status.textContent = '';
    status.className = 'enroll-modal__status';
    return;
  }
  status.hidden = false;
  status.textContent = message;
  status.className = `enroll-modal__status enroll-modal__status--${type}`;
}

function initCourseEnrollSubmit() {
  const form = document.getElementById('enroll-form');
  if (!form || form.dataset.courseSubmitBound === 'true') return;
  form.dataset.courseSubmitBound = 'true';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setEnrollStatus('');

    const submitBtn = form.querySelector('.enroll-modal__submit');
    const originalText = submitBtn?.textContent || 'Отправить';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
    }

    try {
      const name = (document.getElementById('enroll-name')?.value || '').trim();
      const phone = (document.getElementById('enroll-phone')?.value || '').trim();
      const email = (document.getElementById('enroll-email')?.value || '').trim();
      const company = (document.getElementById('enroll-company')?.value || '').trim();
      const position = (document.getElementById('enroll-position')?.value || '').trim();
      const audienceType = (document.getElementById('enroll-audience-type')?.value || '') === 'individual' ? 'individual' : 'legal';
      const districtSelect = document.getElementById('enroll-district');
      const districtValue = districtSelect ? districtSelect.value.trim() : '';
      const isDistrictRequired = districtSelect && districtSelect.required;
      const sourceSelect = document.getElementById('enroll-source');
      const sourceValue = sourceSelect?.value || '';
      const sourceLabel = sourceSelect?.selectedOptions?.[0]?.textContent?.trim() || '';

      if (!name || !phone) {
        throw new Error('Укажите имя и телефон');
      }
      if (isDistrictRequired && !districtValue) {
        throw new Error('Выберите район');
      }
      if (audienceType === 'legal') {
        if (!company) {
          throw new Error('Укажите организацию');
        }
        if (!position) {
          throw new Error('Укажите должность');
        }
      }

      const course = await loadCourseEnrollMeta();
      if (!isCourseEnrollOpen(course)) {
        applyCourseEnrollAvailability(course);
        throw new Error('Приём заявок на это мероприятие завершён');
      }
      const selectedDate = resolveSelectedCourseDate(course);
      const response = await fetch('../api/bitrix-lead-enroll.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          company,
          organization: company,
          position,
          audienceType,
          source: sourceValue,
          sourceLabel,
          courseId: course?.id || resolveCourseIdFromPath() || '',
          courseTitle: course?.title || '',
          selectedDate,
          dateFrom: selectedDate || course?.dateFrom || '',
          dateTo: course?.dateTo || '',
          durationDays: course?.durationDays || 1,
          format: course?.format || 'och',
          price: resolveCourseEnrollPrice(course),
          bitrixCourseElementId: course?.bitrixCourseElementId || null,
          forCustomers: Boolean(course?.forCustomers),
          forSuppliers: Boolean(course?.forSuppliers),
          is44fz: Boolean(course?.is44fz),
          is223fz: Boolean(course?.is223fz),
          district: districtValue,
          options: Array.isArray(course?.options) ? course.options : []
        })
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Не удалось отправить заявку в Bitrix24');
      }

      setEnrollStatus(result.message || 'Заявка принята', 'success');
      window.setTimeout(() => {
        const modal = document.getElementById('enroll-modal');
        if (!modal) return;
        modal.classList.remove('calendar-modal--visible');
        modal.style.display = 'none';
        form.reset();
        setEnrollStatus('');
      }, 1800);
    } catch (error) {
      setEnrollStatus(error?.message || 'Ошибка отправки', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}

function resolveCourseAssetUrl(url) {
  if (!url) return '';
  const value = String(url).trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('../')) return value;
  if (value.startsWith('uploads/')) return '../' + value;
  if (value.startsWith('/uploads/')) return '..' + value;
  return value;
}

function isBrokenPdfHref(href) {
  if (!href) return true;
  return href.endsWith('#') || href.endsWith('.html') || href.endsWith('.html#') || href.includes('#') && !href.includes('/uploads/');
}

async function wireCourseProgramPdfLinks() {
  const heroLink = document.querySelector('.course-hero__download');
  const heroButton = document.querySelector('.course-hero__actions .btn--white-outline');
  const programLink = document.querySelector('.course-program__download');

  const needsHero = Boolean(
    (heroLink && isBrokenPdfHref(heroLink.getAttribute('href'))) ||
    (heroButton && heroButton.tagName === 'BUTTON')
  );
  const needsProgram = Boolean(programLink && isBrokenPdfHref(programLink.getAttribute('href')));

  if (!needsHero && !needsProgram) return;

  const courseId = resolveCourseIdFromPath();
  if (!courseId) return;

  try {
    const resp = await fetch('../api/settings.php?key=crzrt_obuchenie_page_data&_=' + Date.now(), {
      cache: 'no-store'
    });
    if (!resp.ok) return;

    const data = await resp.json();
    const course = Array.isArray(data.courseRegistry)
      ? findCourseByPathKey(data.courseRegistry, courseId)
      : null;
    const pdfUrl = resolveCourseAssetUrl(course && course.programPdf);
    if (!pdfUrl) {
      if (needsHero) {
        const target = heroLink || heroButton;
        if (target) target.remove();
      }
      if (needsProgram && programLink) programLink.remove();
      return;
    }

    if (needsHero) {
      const target = heroLink || heroButton;
      if (!target) return;

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = target.className + ' course-hero__download';
      link.textContent = target.textContent.trim() || 'Скачать программу (PDF)';
      link.setAttribute('download', '');
      target.replaceWith(link);
    }

    if (needsProgram && programLink) {
      programLink.href = pdfUrl;
      programLink.target = '_blank';
      programLink.rel = 'noopener noreferrer';
    }
  } catch (error) {
    console.warn('Course PDF link init failed', error);
  }
}
