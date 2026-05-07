// Загрузка настроек с бэкенда (Синхронно, чтобы избежать гонки данных)
try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/settings.php', false);
    xhr.send(null);
    if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (!data.error) {
            for (const [key, value] of Object.entries(data)) {
                localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
            }
        }
    }
} catch(e) { console.error('DB Sync Error:', e); }

document.addEventListener('DOMContentLoaded', () => {
    const globalHeaderHTML = `
    <header class="header">
        <div class="container header-content">
            <a href="index.html" class="logo">
                <img src="logo.png" alt="Logo" class="logo-img">
                <span>ЦРЗ РТ</span>
            </a>

            <nav class="nav-desktop">
                <a href="#about">О нас</a>
                <a href="#news">Новости</a>
                <a href="#partners">Нам доверяют</a>
                <a href="#contacts">Контакты</a>
            </nav>

            <div class="header-actions">
                <a href="tel:88001017892" class="header-phone" style="font-weight: 700; color: var(--text-primary);">
                    8 (800) 101-78-92
                </a>
                <a href="#contacts" class="btn-header">Заказать звонок</a>
                
                <button id="theme-toggle" class="btn-icon" aria-label="Toggle Theme" style="border-radius: 50%;">
                    <span class="icon-sun" style="display: flex;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    </span>
                    <span class="icon-moon" style="display: none;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    </span>
                </button>
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
