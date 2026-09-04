function initCoursePage() {
  wireCourseProgramPdfLinks();
  initCourseEnrollModal();
  initCourseEnrollSubmit();

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

        // Configure audience settings according to course metadata
        try {
          const course = await loadCourseEnrollMeta();
          configureCourseEnrollModalAudience(course);
        } catch (_e) {
          configureCourseEnrollModalAudience(null);
        }
        
        // Show modal
        enrollModal.style.display = 'flex';
        setTimeout(() => enrollModal.classList.add('calendar-modal--visible'), 10);
      });
    });
  }

  updateCourseStartDate();
  // Preload course metadata early so custom btnText and audience are applied immediately
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
    return d + ' ' + MONTH_NAMES_GENITIVE[m] + ' ' + y;
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

  if (dateParam) {
    const formatted = formatIso(dateParam);
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

function resolveCourseIdFromPath() {
  const file = (window.location.pathname.split('/').pop() || '').trim();
  const key = file.replace(/\.html$/i, '');
  return key;
}

function resolveSelectedCourseDate(course) {
  const urlDate = (new URLSearchParams(window.location.search).get('date') || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(urlDate)) return urlDate;
  const raw = String((course && course.dateFrom) || '');
  const first = raw.split(',')[0].trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(first) ? first : first;
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
  const forIndividuals = course?.forIndividuals !== false;
  const forLegalEntities = course?.forLegalEntities !== false;
  const switchWrap = document.getElementById('enroll-audience-switch');
  const toggle = document.getElementById('enroll-audience-toggle');
  if (switchWrap) {
    switchWrap.hidden = !(forIndividuals && forLegalEntities);
  }
  let mode = 'legal';
  if (!forLegalEntities && forIndividuals) {
    mode = 'individual';
  } else if (toggle) {
    mode = toggle.checked ? 'legal' : 'individual';
  }
  if (toggle) toggle.checked = mode === 'legal';
  applyCourseEnrollAudienceMode(mode);
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

  const closeEnrollModal = () => {
    modal.classList.remove('calendar-modal--visible');
    modal.style.display = 'none';
    if (form) {
      form.reset();
      delete form.dataset.courseId;
    }
    configureCourseEnrollModalAudience(courseEnrollMetaCache);
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
      applyCourseEnrollAudienceMode(audienceToggle.checked ? 'legal' : 'individual');
    });
  }

  // Prevent accidental close from clicks inside dialog body.
  if (content) {
    content.addEventListener('click', (event) => event.stopPropagation());
  }
}

let courseEnrollMetaCache = null;

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

async function loadCourseEnrollMeta() {
  if (courseEnrollMetaCache) return courseEnrollMetaCache;
  const courseId = resolveCourseIdFromPath();
  const fallback = {
    id: courseId,
    title: (document.querySelector('.course-hero__title')?.textContent || '').trim(),
    dateFrom: '',
    dateTo: '',
    durationDays: parseDurationDaysFromWidget(),
    format: parseFormatFromTags(),
    price: (document.querySelector('.course-widget-item__price')?.textContent || '').trim(),
    bitrixCourseElementId: null,
    forCustomers: false,
    forSuppliers: false,
    is44fz: false,
    is223fz: false,
    options: []
  };

  if (!courseId) {
    courseEnrollMetaCache = fallback;
    return fallback;
  }

  try {
    const resp = await fetch('../api/settings.php?key=crzrt_obuchenie_page_data&_=' + Date.now(), { cache: 'no-store' });
    if (!resp.ok) {
      courseEnrollMetaCache = fallback;
      return fallback;
    }
    const data = await resp.json();
    const course = Array.isArray(data.courseRegistry)
      ? findCourseByPathKey(data.courseRegistry, courseId)
      : null;
    courseEnrollMetaCache = course ? { ...fallback, ...course, id: course.id || courseId } : fallback;
    if (course && course.btnText) {
      document.querySelectorAll('.btn-enroll, [data-enroll-btn]').forEach((btn) => {
        btn.textContent = course.btnText;
      });
    }
    return courseEnrollMetaCache;
  } catch (_error) {
    courseEnrollMetaCache = fallback;
    return fallback;
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
      const sourceSelect = document.getElementById('enroll-source');
      const sourceValue = sourceSelect?.value || '';
      const sourceLabel = sourceSelect?.selectedOptions?.[0]?.textContent?.trim() || '';

      if (!name || !phone) {
        throw new Error('Укажите имя и телефон');
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
