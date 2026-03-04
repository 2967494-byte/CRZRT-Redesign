document.addEventListener('DOMContentLoaded', () => {
    const globalHeaderHTML = `
    <header class="header">
        <div class="container header-content">
            <a href="index.html" class="logo">
                <img src="logo.png" alt="Logo" class="logo-img">
                <span>Центр развития закупок</span>
            </a>
            <nav class="nav">
                <a href="courses.html" class="nav-link">Курсы</a>
                <a href="index.html#services" class="nav-link">Услуги</a>
                <a href="consulting.html" class="nav-link">Консалтинг</a>
                <a href="about.html" class="nav-link">О нас</a>
            </nav>
            <div class="header-actions">
                <button id="theme-toggle" class="btn-icon" aria-label="Toggle Theme">
                    <span class="icon-sun">
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
                <a href="admin.html" class="btn-primary">Личный кабинет</a>
            </div>
        </div>

        <div class="header-nav-bar-container">
            <div class="header-nav-bar">
                <div class="nav-bar-item nav-edu">
                    <a href="courses.html" class="nav-item-link">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <span>Образовательный центр</span>
                    </a>
                    <div class="mega-menu">
                        <div class="mega-grid">
                            <div class="mega-col">
                                <h4>Очное обучение</h4>
                                <a href="courses.html">44-ФЗ (108 ак. ч)</a>
                                <a href="courses.html">44-ФЗ + Весенняя Казань</a>
                                <a href="courses.html">223-ФЗ (72 ак. ч)</a>
                            </div>
                            <div class="mega-col">
                                <h4>Дистанционно</h4>
                                <a href="distance.html">Переподготовка</a>
                                <a href="distance.html">Повышение квалификации</a>
                                <a href="distance.html">Электронные курсы</a>
                            </div>
                            <div class="mega-col">
                                <h4>События</h4>
                                <a href="seminars.html">Семинары в Казани</a>
                                <a href="webinars.html">Вебинары</a>
                                <a href="#">Календарь событий</a>
                            </div>
                            <div class="mega-col">
                                <h4>Сервисы</h4>
                                <a href="individual.html">Индивидуальные курсы</a>
                                <a href="testing.html">Тестирование</a>
                                <a href="team.html">Преподаватели</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="nav-bar-item nav-support">
                    <a href="#" class="nav-item-link">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span>Сопровождение</span>
                    </a>
                    <div class="mega-menu">
                        <div class="mega-grid">
                            <div class="mega-col">
                                <h4>Для заказчиков</h4>
                                <a href="#">Аутсорсинг закупок</a>
                                <a href="#">Техзадания (ТЗ)</a>
                                <a href="#">Проверка заявок</a>
                            </div>
                            <div class="mega-col">
                                <h4>Для поставщиков</h4>
                                <a href="#">Тендерный отдел</a>
                                <a href="#">Поиск закупок</a>
                                <a href="#">Защита заявок</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="nav-bar-item nav-etp">
                    <a href="https://etp.zakupki.tatar" target="_blank" class="nav-item-link">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                        <span>ЭТП</span>
                    </a>
                    <div class="mega-menu">
                        <div class="mega-grid">
                            <div class="mega-col">
                                <h4>Сервисы ЭТП</h4>
                                <a href="https://etp.zakupki.tatar">Вход на площадку</a>
                                <a href="#">Реестр торгов</a>
                                <a href="#">Реестр контрактов</a>
                            </div>
                            <div class="mega-col">
                                <h4>Информация</h4>
                                <a href="#">Тарифы</a>
                                <a href="#">Инструкции</a>
                                <a href="#">Регламент</a>
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
                        <div class="mega-grid">
                            <!-- Populated by script.js -->
                        </div>
                    </div>
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
                    sun.style.display = 'none';
                    moon.style.display = 'inline-block';
                } else {
                    sun.style.display = 'inline-block';
                    moon.style.display = 'none';
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
                    background: ${categoryColor} !important;
                    color: #fff !important;
                    border-color: ${categoryColor} !important;
                }
                .nav-legal:hover .mega-menu {
                    border-bottom-color: ${categoryColor} !important;
                }
            `;
        }
    }

    // 2. Dispatch event to notify script.js we're ready
    document.dispatchEvent(new Event('headerLoaded'));
});
