document.addEventListener('DOMContentLoaded', () => {
    const globalHeaderHTML = `
    <header class="header">
        <div class="container header-content">
            <a href="index.html" class="logo">
                <img src="logo.png" alt="Logo" class="logo-img">
                <span>Центр развития закупок</span>
            </a>
            <div class="header-actions">
                <a href="tel:88001017892" id="h-phone-link" class="header-phone" style="margin-right: 20px; font-weight: 600; font-size: 1rem; color: var(--text-primary); text-decoration: none; display: flex; align-items: center; gap: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.8;">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span id="h-phone-val">8 (800) 101-78-92</span>
                </a>
                <button id="theme-toggle" class="btn-icon" aria-label="Toggle Theme">
                    <span class="icon-sun" style="display: flex;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                    </span>
                    <span class="icon-moon" style="display: none;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    </span>
                </button>
                <a href="admin.html" class="btn-primary" style="display: flex; align-items: center; gap: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Личный кабинет</span>
                </a>
            </div>
        </div>

        <div class="header-nav-bar-container">
            <div class="header-nav-bar">
                <div class="nav-bar-item nav-edu">
                    <a href="courses.html" class="nav-item-link">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <span>Обучение</span>
                    </a>
                    <div class="mega-menu">
                        <div class="mega-grid">
                            <div class="mega-col">
                                <h4>Форматы</h4>
                                <a href="courses.html">Очное обучение</a>
                                <a href="distance.html">Дистанционно</a>
                                <a href="individual.html">Индивидуально</a>
                            </div>
                            <div class="mega-col">
                                <h4>События</h4>
                                <a href="calendar.html">Календарь</a>
                                <a href="seminars.html">Семинары</a>
                                <a href="webinars.html">Вебинары</a>
                                <a href="team.html">Преподаватели</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="nav-bar-item nav-legal">
                    <a href="consulting.html" class="nav-item-link">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <path d="M10 9H8" />
                        </svg>
                        <span>Консалтинг</span>
                    </a>
                    <div class="mega-menu">
                        <div class="mega-grid" id="servicesMegaGrid">
                            <div class="mega-col">
                                <h4>Заказчикам</h4>
                                <a href="consulting.html#public">Поддержка (44/223-ФЗ)</a>
                                <a href="consulting.html#deals">Сопровождение сделок</a>
                                <a href="#">Аутсорсинг закупок</a>
                            </div>
                            <div class="mega-col">
                                <h4>Поставщикам</h4>
                                <a href="consulting.html#competitor">Тендерный отдел</a>
                                <a href="consulting.html#disputes">Судебные споры</a>
                                <a href="#">Поиск закупок</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="nav-bar-item nav-tenders">
                    <a href="#" class="nav-item-link">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <span>Закупки</span>
                    </a>
                    <div class="mega-menu">
                        <div class="mega-grid">
                            <div class="mega-col">
                                <h4>Реестры</h4>
                                <a href="#">Закупки (44-ФЗ)</a>
                                <a href="#">Закупки (223-ФЗ)</a>
                                <a href="#">Реестр контрактов</a>
                            </div>
                            <div class="mega-col">
                                <h4>Аналитика</h4>
                                <a href="#">Планы закупок</a>
                                <a href="#">Протоколы</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="nav-bar-item nav-knowledge">
                    <a href="knowledge.html" class="nav-item-link">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        <span>база знаний</span>
                    </a>
                    <div class="mega-menu">
                        <div class="mega-grid">
                            <div class="mega-col">
                                <h4>Руководство</h4>
                                <a href="#">Общее</a>
                                <a href="#">Заказчикам</a>
                                <a href="#">Поставщикам</a>
                            </div>
                            <div class="mega-col">
                                <h4>Инф. материалы</h4>
                                <a href="#">Видеоинструкции</a>
                                <a href="#">FAQ (Чаво)</a>
                            </div>
                            <div class="mega-col">
                                <h4>Право</h4>
                                <a href="#">Регламенты</a>
                                <a href="#">Законодательство</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="nav-bar-item nav-contacts">
                    <a href="contacts.html" class="nav-item-link">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>контакты</span>
                    </a>
                </div>
            </div>
        </div>
    </header>
    `;

    // 1. Inject the HTML
    const container = document.getElementById('global-header');
    if (container) {
        container.innerHTML = globalHeaderHTML;

        // Restore active link state based on current pathname
        const path = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = container.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === path ||
                (path === 'index.html' && link.getAttribute('href').startsWith('index.html'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Setup theme toggle logic inside header to control sun/moon
        const themeToggle = container.querySelector('#theme-toggle');
        const sun = container.querySelector('.icon-sun');
        const moon = container.querySelector('.icon-moon');
        const updateThemeIcon = (theme) => {
            if (sun && moon) {
                if (theme === 'dark') {
                    sun.style.display = 'inline-flex';
                    moon.style.display = 'none';
                } else {
                    sun.style.display = 'none';
                    moon.style.display = 'inline-flex';
                }
            }
        };

        const currentTheme = localStorage.getItem('theme') || 'light';
        updateThemeIcon(currentTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTh = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTh === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
            });
        }

        // Category Color Config Injection
        const localData = JSON.parse(localStorage.getItem('crzrt_consulting_data'));
        const categoryColor = (localData && localData.categoryColor) ? localData.categoryColor : '#ff3b3b';
        if (categoryColor !== '#ff3b3b' && categoryColor.trim() !== '') {
            const styleId = 'dynamic-custom-color';
            let styleEl = document.getElementById(styleId);
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = styleId;
                document.head.appendChild(styleEl);
            }
            styleEl.innerHTML = `
                .nav-legal:hover .nav-item-link {
                    background: transparent !important;
                    color: ${categoryColor} !important;
                    border-color: ${categoryColor} !important;
                }
                .nav-legal:hover .mega-menu {
                    border-bottom-color: ${categoryColor} !important;
                }
            `;
        }

        // Phone Update Logic
        const contactsData = JSON.parse(localStorage.getItem('crzrt_contacts'));
        if (contactsData && contactsData.phone) {
            const phoneVal = container.querySelector('#h-phone-val');
            const phoneLink = container.querySelector('#h-phone-link');
            if (phoneVal) phoneVal.innerText = contactsData.phone;
            if (phoneLink) {
                const numericPhone = contactsData.phone.replace(/\D/g, '');
                phoneLink.href = `tel:${numericPhone}`;
            }
        }
    }

    // 2. Dispatch event to notify script.js we're ready
    document.dispatchEvent(new Event('headerLoaded'));
});
