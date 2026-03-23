document.addEventListener('DOMContentLoaded', () => {
    // Reveal functionality (Single Elements)
    const revealElements = document.querySelectorAll(`
        .hero-title, .hero-subtitle, .why-card, .direction-tile, .section-title, .tag, 
        .testimonial-card, .contact-form, .section-desc, .event-tile, .news-item,
        .interactive-calendar, .filters-bar, .ad-banner-placeholder
    `);

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
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

    // 4-sides reveal for main services
    const sidesElements = document.querySelectorAll('.slide-from-left, .slide-from-right, .slide-from-top, .slide-from-bottom');
    const sidesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });
    
    sidesElements.forEach(el => {
        sidesObserver.observe(el);
    });

    // Staggered Grid Reveal (Highly attractive animation for cards)
    const grids = document.querySelectorAll('.education-grid, .consulting-grid, .stats-grid, .contacts-grid, .feature-grid, .course-list');
    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = Array.from(entry.target.children);
                children.forEach((child, index) => {
                    // Stagger delay based on index
                    child.style.transitionDelay = `${index * 0.15}s`;
                    // Brief timeout to ensure CSS registers the delay before adding active class
                    setTimeout(() => {
                        child.classList.add('reveal-active');
                    }, 50);
                });
            } else {
                const children = Array.from(entry.target.children);
                children.forEach((child) => {
                    // Remove stagger delay for an immediate reverse animation
                    child.style.transitionDelay = `0s`;
                    child.classList.remove('reveal-active');
                });
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    grids.forEach(grid => {
        Array.from(grid.children).forEach(child => {
            child.classList.add('reveal-item');
        });
        gridObserver.observe(grid);
    });

    // Stats Counter
    const stats = document.querySelectorAll('.stat-number');

    const countUp = (el) => {
        const target = +el.getAttribute('data-target');
        const count = +el.innerText.replace('+', ''); // Remove + for safety
        const speed = target / 100; // Increment step

        if (count < target) {
            el.innerText = Math.ceil(count + speed) + (el.getAttribute('data-plus') ? '+' : '');
            el.dataset.tid = setTimeout(() => countUp(el), 20);
        } else {
            el.innerText = target + (el.getAttribute('data-plus') ? '+' : '');
        }
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
            } else {
                if (entry.target.dataset.tid) {
                    clearTimeout(entry.target.dataset.tid);
                }
                entry.target.innerText = '0';
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });


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
    const defaultMainData = {
        heroTitle: 'Ваш надежный<br>партнёр в мире закупок',
        heroSubtitle: 'ЭТП — Обучение — Сопровождение — Юридический консалтинг',
        heroBgImage: '',
        events: [
            { date: '23-27 МАРТА', title: 'Очный курс: Закупки по 44-ФЗ (108 ч)', link: 'course-44fz.html' },
            { date: '25-27 МАРТА', title: 'Очный курс: Закупки по 223-ФЗ (72 ч)', link: 'course-223fz.html' },
            { date: '20 АПРЕЛЯ', title: 'Семинар: Новые правила ГИС в 2026 году', link: 'seminars.html' }
        ],
        sideNews: [
            { date: '06.03.2026', title: 'Запущен новый раздел "База знаний"', link: 'knowledge.html' },
            { date: '01.03.2026', title: 'Обновлено расписание курсов на весну 2026', link: 'calendar.html' },
            { date: '25.02.2026', title: 'Новые правила электронного актирования в ЕИС', link: '#' }
        ],
        featureCards: [
            { title: 'Обучение', link: 'courses.html', image: '' },
            { title: 'Консалтинг', link: 'consulting.html', image: '' },
            { title: 'Закупки (ЭТП)', link: 'https://etpzakupki.tatar', image: '' },
            { title: 'Сопровождение', link: 'consulting.html#deals', image: '' }
        ],
        orgBlocks: [
            { title: 'Специализированная организация', text: 'Мы — официальный партнер в сфере 44-ФЗ и 223-ФЗ с безупречной репутацией.' },
            { title: '10 лет экспертизы', text: 'Сотни успешно защищенных интересов в ФАС и тысячи подготовленных специалистов.' },
            { title: 'Собственная экосистема', text: 'Мы объединяем обучение, ЭТП и юридическую поддержку в одном месте.' }
        ],
        testimonials: [
            { client: 'ТрансТехСервис', text: '«Выражаем благодарность за высокий уровень организации обучения сотрудников в сфере государственных закупок.»' },
            { client: 'Министерство экологии РТ', text: '«Профессиональный подход к подготовке кадров и глубокая экспертиза преподавательского состава.»' },
            { client: 'ГБУ «Научный центр БЖД»', text: '«Курсы повышения квалификации помогли нам систематизировать работу с тендерами по 44-ФЗ.»' },
            { client: 'Компания «ВАТ»', text: '«Отмечаем доступность изложения сложного материала и практическую направленность программы.»' },
            { client: 'АО «Казанский Гипронииавиапром»', text: '«Своевременная поддержка и квалифицированные консультации по вопросам сложных торгов.»' }
        ]
    };

    // Load function that can be called multiple times
    async function initPageData() {
        let savedMainData = JSON.parse(localStorage.getItem('crzrt_main_page_data')) || {};
        
        // Sync with server API
        try {
            const response = await fetch('api/settings.php?key=crzrt_main_page_data');
            if (response.ok) {
                const serverData = await response.json();
                if (serverData && Object.keys(serverData).length > 0) {
                    savedMainData = serverData;
                    localStorage.setItem('crzrt_main_page_data', JSON.stringify(serverData));
                }
            }
        } catch (e) {
            console.warn("Failed to sync settings with server:", e);
        }

        const mainPageData = { ...defaultMainData, ...savedMainData };
        renderPage(mainPageData);
    }

    function renderPage(mainPageData) {
        // 1. Hero Background Image Logic (via CSS Variable)
        if (mainPageData.heroBgImage) {
            document.documentElement.style.setProperty('--hero-bg', `url(${mainPageData.heroBgImage})`);
        } else {
            document.documentElement.style.removeProperty('--hero-bg');
        }

        // 2. Hero Section collapse/style logic
        const heroMain = document.querySelector('.hero-main');
        if (heroMain) {
            if (mainPageData.heroBgImage === '') {
                heroMain.classList.add('no-hero-bg');
                heroMain.style.height = 'auto';
                heroMain.style.padding = '140px 0 60px';
                heroMain.style.overflow = 'visible';
                const overlay = heroMain.querySelector('.hero-overlay');
                if (overlay) overlay.style.display = 'none';
            } else {
                heroMain.classList.remove('no-hero-bg');
                heroMain.style.height = '';
                heroMain.style.padding = '';
                heroMain.style.overflow = '';
                const overlay = heroMain.querySelector('.hero-overlay');
                if (overlay) overlay.style.display = 'block';
            }
        }

        // 3. Hero Texts
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroTitle && mainPageData.heroTitle) {
            heroTitle.innerHTML = mainPageData.heroTitle;
        }
        if (heroSubtitle && mainPageData.heroSubtitle) {
            heroSubtitle.innerText = mainPageData.heroSubtitle;
        }

        // 4. Sidebar Events Rendering
        const eventsList = document.getElementById('sidebarEventsList');
        if (eventsList && mainPageData.events) {
            eventsList.innerHTML = mainPageData.events.map(e => `
                <a href="${e.link || '#'}" class="event-tile">
                    <div class="event-date">${e.date}</div>
                    <div class="event-title">${e.title}</div>
                </a>
            `).join('');
        }

        // 5. Sidebar News Rendering
        const sideNewsList = document.getElementById('sidebarNewsList');
        if (sideNewsList && mainPageData.sideNews) {
            sideNewsList.innerHTML = mainPageData.sideNews.map(n => `
                <a href="${n.link || '#'}" class="news-item">
                    <div class="news-item-date">${n.date}</div>
                    <div class="news-item-title">${n.title}</div>
                </a>
            `).join('');
        }

        // 6. Feature Cards (Dynamic Grid)
        const featureGrid = document.getElementById('mainFeatureGrid');
        if (featureGrid && mainPageData.featureCards) {
            featureGrid.innerHTML = mainPageData.featureCards.map((c, i) => `
                <a href="${c.link || '#'}" class="feature-card ${c.image ? '' : 'no-image'}" id="feature-card-${i + 1}">
                    <div class="feature-card-bg" style="${c.image ? `background-image: url(${c.image})` : ''}"></div>
                    <div class="feature-card-link-arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                    </div>
                    <div class="feature-card-content">
                        <h3>${c.title}</h3>
                    </div>
                </a>
            `).join('');
        }

        // 7. Why Us Grid
        const orgGrid = document.getElementById('mainOrgGrid');
        if (orgGrid && mainPageData.orgBlocks) {
            orgGrid.innerHTML = mainPageData.orgBlocks.map(b => `
                <div class="why-card">
                    <h3>${b.title}</h3>
                    <p>${b.text}</p>
                </div>
            `).join('');
        }

        // 8. Testimonials Sidebar
        const testimonialsList = document.getElementById('sidebarTestimonialsList');
        if (testimonialsList && mainPageData.testimonials) {
            testimonialsList.innerHTML = mainPageData.testimonials.slice(0, 3).map(t => `
                <div class="sidebar-testimonial-card testimonial-card">
                    <div class="client-name">${t.client}</div>
                    <p>${t.text}</p>
                </div>
            `).join('');
        }

        // 9. Re-catch reveal elements for Scroll Animations
        const newRevealElements = document.querySelectorAll(`
            .why-card, .testimonial-card, .news-strip, .feature-card, 
            .news-item, .event-tile
        `);
        newRevealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
            revealObserver.observe(el);

            if (el.classList.contains('why-card') || el.classList.contains('testimonial-card')) {
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
            }
        });

        // 10. Update Services Mega Menu
        renderServicesMegaMenu();
    }

    // Call it initially (async fetch inside)
    initPageData();

    // === DYNAMIC MEGA MENU для Услуг ===
    function renderServicesMegaMenu() {
        const servicesMegaGrid = document.getElementById('servicesMegaGrid');
        if (!servicesMegaGrid) return;

        const localData = JSON.parse(localStorage.getItem('crzrt_consulting_data'));
        if (localData && localData.services && localData.services.length > 0) {
            const processedServices = localData.services.map((s, idx) => {
                const sid = s.id || `service_${idx}`;
                let cat = s.category;
                if (!cat) {
                    const customersIds = ['public', 'deals', 'business', 'corporate'];
                    const suppliersIds = ['competitor', 'disputes'];
                    cat = (customersIds.includes(sid) ? 'customers' :
                        (suppliersIds.includes(sid) ? 'suppliers' : 'customers'));
                }
                return { ...s, id: sid, category: cat };
            });

            servicesMegaGrid.innerHTML = `
                <div class="mega-col">
                    ${processedServices.filter(s => s.category === 'customers').map(s => `<a href="consulting.html#${s.id}">${s.title || 'Без названия'}</a>`).join('')}
                </div>
                <div class="mega-col">
                    ${processedServices.filter(s => s.category === 'suppliers').map(s => `<a href="consulting.html#${s.id}">${s.title || 'Без названия'}</a>`).join('')}
                </div>
            `;
        }
    }

    document.addEventListener('headerLoaded', renderServicesMegaMenu);

    // Cookie Banner Logic
    const initCookieBanner = () => {
        if (localStorage.getItem('crzrt_cookies_accepted')) return;

        const bannerHtml = `
            <div class="cookie-banner" id="cookieBanner">
                <div class="cookie-text">
                    Мы используем файлы cookie для улучшения работы сайта и анализа трафика. 
                    Продолжая использовать сайт, вы соглашаетесь с нашей <a href="#">Политикой конфиденциальности</a>.
                </div>
                <button class="btn-cookie-accept" id="btnAcceptCookies">Принять</button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', bannerHtml);
        const banner = document.getElementById('cookieBanner');
        const btn = document.getElementById('btnAcceptCookies');

        setTimeout(() => {
            banner.classList.add('show');
        }, 2000);

        btn.addEventListener('click', () => {
            localStorage.setItem('crzrt_cookies_accepted', 'true');
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 600);
        });
    };

    initCookieBanner();
});
