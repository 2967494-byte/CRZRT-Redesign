document.addEventListener('DOMContentLoaded', () => {
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

});
