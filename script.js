document.addEventListener('DOMContentLoaded', () => {
    // Reveal functionality
    const revealElements = document.querySelectorAll('.hero-title, .hero-subtitle, .why-card, .direction-tile, .section-title, .tag, .testimonial-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        revealObserver.observe(el);
    });

    // Stats Counter
    const stats = document.querySelectorAll('.stat-value');

    const countUp = (el) => {
        const target = +el.getAttribute('data-count');
        const count = +el.innerText.replace('+', ''); // Remove + for safety
        const speed = target / 100; // Increment step

        if (count < target) {
            el.innerText = Math.ceil(count + speed) + (el.getAttribute('data-plus') ? '+' : '');
            setTimeout(() => countUp(el), 20);
        } else {
            el.innerText = target + (el.getAttribute('data-plus') ? '+' : '');
        }
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));


    // Tilt Effect for Cards
    const cards = document.querySelectorAll('.why-card, .course-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });



    // Header Blur Effect on Scroll
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
        } else {
            header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
        }
        lastScroll = currentScroll;
    });


    // Theme Toggle Logic is handled in header.js

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Default to light
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Smooth Scroll for Header Nav Bar
    const navBarItems = document.querySelectorAll('.nav-bar-item');

    navBarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    // === DYNAMIC CONTENT FOR MAIN PAGE ===
    const mainPageData = JSON.parse(localStorage.getItem('crzrt_main_page_data'));
    if (mainPageData) {
        // Hero Section
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroTitle && mainPageData.heroTitle) {
            // Split title if needed or just replace
            heroTitle.innerHTML = mainPageData.heroTitle.replace('госзакупках.', '<span class="gradient-text">госзакупках.</span>');
        }
        if (heroSubtitle && mainPageData.heroSubtitle) {
            heroSubtitle.innerText = mainPageData.heroSubtitle;
        }

        // Why Us Grid
        const orgGrid = document.getElementById('mainOrgGrid');
        if (orgGrid && mainPageData.orgBlocks) {
            orgGrid.innerHTML = mainPageData.orgBlocks.map(b => `
                <div class="why-card">
                    <h3>${b.title}</h3>
                    <p>${b.text}</p>
                </div>
            `).join('');
        }

        // Testimonials Marquee
        const marquee = document.getElementById('mainTestimonialsMarquee');
        if (marquee && mainPageData.testimonials) {
            const renderCard = (t) => `
                <div class="testimonial-card">
                    <div class="client-name">${t.client}</div>
                    <p>${t.text}</p>
                </div>
            `;
            const content = mainPageData.testimonials.map(renderCard).join('');
            // Double the content for seamless loop
            marquee.innerHTML = content + content;
        }

        // Re-catch newly added cards for tilt and reveal effects
        const newRevealElements = document.querySelectorAll('.why-card, .testimonial-card');
        newRevealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
            revealObserver.observe(el);

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // === DYNAMIC MEGA MENU FOR CONSULTING ===
    const consultingMegaGrid = document.querySelector('.nav-legal .mega-grid');
    if (consultingMegaGrid) {
        const localData = JSON.parse(localStorage.getItem('crzrt_consulting_data'));
        if (localData && localData.services && localData.services.length > 0) {
            consultingMegaGrid.innerHTML = '';

            // Split into two columns for layout balance
            const half = Math.ceil(localData.services.length / 2);
            const col1 = localData.services.slice(0, half);
            const col2 = localData.services.slice(half);

            const renderCol = (title, items) => {
                if (items.length === 0) return '';
                let links = items.map(s => `<a href="consulting.html#${s.id}">${s.title}</a>`).join('');
                return `<div class="mega-col" style="min-width: 200px;"><h4>${title}</h4>${links}</div>`;
            };

            consultingMegaGrid.innerHTML = renderCol('Бизнес и сделки', col1) + renderCol('Споры и закупки', col2);
        }
    }
});
