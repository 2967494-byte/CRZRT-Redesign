document.addEventListener('DOMContentLoaded', () => {
  wireCourseProgramPdfLinks();

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
  const enrollBtns = document.querySelectorAll('.btn-enroll');
  const enrollModal = document.getElementById('enroll-modal');
  const enrollTitle = document.getElementById('enroll-modal-title');

  if (enrollModal) {
    enrollBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Find course title
        const titleEl = document.querySelector('.course-hero__title');
        if (titleEl && enrollTitle) {
          enrollTitle.textContent = titleEl.textContent;
        }
        
        // Show modal
        enrollModal.style.display = 'flex';
        setTimeout(() => enrollModal.classList.add('calendar-modal--visible'), 10);
      });
    });
  }

  updateCourseStartDate();
});

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
  return file.replace(/\.html$/i, '');
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
      ? data.courseRegistry.find((item) => item && item.id === courseId)
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
