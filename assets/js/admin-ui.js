// Загрузка настроек с бэкенда (Синхронно)
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

        // Global Variables for Admin Panel
        let cropper;
        let imageInput, uploadWrapper, imageToCrop, cropperWrapper, cropperActions;
        let btnZoomIn, btnZoomOut, btnCrop, btnCancelCrop, croppedResultContainer, croppedResult;

        function initUploadElements() {
            imageInput = document.getElementById('imageInput');
            uploadWrapper = document.getElementById('uploadWrapper');
            imageToCrop = document.getElementById('imageToCrop');
            cropperWrapper = document.getElementById('cropperWrapper');
            cropperActions = document.getElementById('cropperActions');
            btnZoomIn = document.getElementById('btnZoomIn');
            btnZoomOut = document.getElementById('btnZoomOut');
            btnCrop = document.getElementById('btnCrop');
            btnCancelCrop = document.getElementById('btnCancelCrop');
            croppedResultContainer = document.getElementById('croppedResultContainer');
            croppedResult = document.getElementById('croppedResult');
            const btnCropperClose = document.getElementById('btnCropperClose');

            if (uploadWrapper && imageInput) {
                uploadWrapper.addEventListener('click', () => imageInput.click());
            } else {
                console.error("Upload elements NOT found during early init!");
            }
            if (btnCropperClose && btnCancelCrop) {
                btnCropperClose.addEventListener('click', () => btnCancelCrop.click());
            }
        }

        function updateSaveButtonsState(options) {
            const buttons = [
                document.getElementById('globalSaveBtn'),
                ...document.querySelectorAll('.btn-save-bottom')
            ].filter(Boolean);

            buttons.forEach(btn => {
                if (options.text !== undefined) btn.innerText = options.text;
                if (options.disabled !== undefined) {
                    btn.disabled = options.disabled;
                    if (options.disabled) {
                        btn.setAttribute('disabled', 'disabled');
                    } else {
                        btn.removeAttribute('disabled');
                    }
                }
                if (options.opacity !== undefined) btn.style.opacity = options.opacity;
                if (options.boxShadow !== undefined) btn.style.boxShadow = options.boxShadow;
                if (options.backgroundColor !== undefined) btn.style.backgroundColor = options.backgroundColor;
                if (options.color !== undefined) btn.style.color = options.color;
            });
        }

        // Theme Toggle for Admin
        const themeBtn = document.getElementById('theme-toggle-admin');
        const root = document.documentElement;
        const iconSun = document.querySelector('.icon-sun');
        const iconMoon = document.querySelector('.icon-moon');

        // Initial theme logic borrowed from index.html (implicitly)
        if (localStorage.getItem('theme') === 'light') {
            root.setAttribute('data-theme', 'light');
            iconSun.style.display = 'none';
            iconMoon.style.display = 'block';
        }

        themeBtn.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            if (currentTheme === 'light') {
                root.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                iconSun.style.display = 'block';
                iconMoon.style.display = 'none';
            } else {
                root.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                iconSun.style.display = 'none';
                iconMoon.style.display = 'block';
            }
        });

        // Initialize upload elements immediately
        initUploadElements();

        // User & Role Management Logic
        const defaultUsers = {
            'admin@crzrt.ru': { password: 'admin', name: 'Администратор', permissions: ['superuser'] },
            'main@crzrt.ru': { password: 'password', name: 'Редактор Сайта', permissions: ['main-page'] },
            'users@crzrt.ru': { password: 'password', name: 'Менеджер Кадров', permissions: ['users'] }
        };

        let usersDb = JSON.parse(localStorage.getItem('crzrt_users'));
        const defaultMainData = AdminLanding.DEFAULT_LANDING_MAIN;

        const defaultAboutData = {
            heroTitle: 'Профессионализм и Опыт',
            heroSubtitle: 'Центр развития закупок — ваш надежный партнер в мире тендеров.',
            mainTitle: 'О нас',
            p1: 'Акционерное общество «Центр развития закупок Республики Татарстан» является подведомственной организацией Государственного комитета Республики Татарстан по закупкам.',
            p2: 'Наш офис расположен в самом сердце Казани, на улице Петербургская 86. Мы объединяем экспертов с многолетним опытом работы в сфере государственного заказа.',
            services: 'Сопровождение 44-ФЗ и 223-ФЗ\nОбучение и консалтинг\nЭлектронная подпись\nПлощадка Etpzakupki.tatar\nЮридические услуги\nНезависимые гарантии',
            image: 'IMG_8077-e1536932079653.jpg'
        };

        const defaultContactsData = {
            phone: '8 (800) 101-78-92',
            email: 'info@crzrt.ru',
            requisites: 'АО «ЦРЗ РТ»\nИНН 1655291703\nКПП 165501001\nОГРН 1141690029800'
        };
        let mainPageData = AdminLanding.migrateMainPageData(
            JSON.parse(localStorage.getItem('crzrt_main_page_data') || 'null')
        );
        window.mainPageData = mainPageData;
        window.saveMainPageStateToMemory = function () {
            AdminLanding.collectMainPageFromForm(mainPageData);
        };
        let ecpPageData = AdminEcp.migrateEcpPageData(
            JSON.parse(localStorage.getItem('crzrt_ecp_page_data') || 'null')
        );
        window.ecpPageData = ecpPageData;
        window.saveEcpPageStateToMemory = function () {
            ecpPageData = AdminEcp.collectEcpPageFromForm(ecpPageData);
            window.ecpPageData = ecpPageData;
        };
        let consultingPageData = {};
        if (typeof AdminConsultingPage !== 'undefined') {
            consultingPageData = AdminConsultingPage.migrateConsultingPageData(
                JSON.parse(localStorage.getItem('crzrt_consulting_page_data') || 'null')
            );
        }
        window.consultingPageData = consultingPageData;
        window.saveConsultingPageStateToMemory = function () {
            if (typeof AdminConsultingPage === 'undefined') return;
            consultingPageData = AdminConsultingPage.collectConsultingPageFromForm(consultingPageData);
            window.consultingPageData = consultingPageData;
        };
        let supportPageData = {};
        if (typeof AdminSupport !== 'undefined') {
            supportPageData = AdminSupport.migrateSupportPageData(
                JSON.parse(localStorage.getItem('crzrt_support_page_data') || 'null')
            );
        }
        window.supportPageData = supportPageData;
        window.saveSupportPageStateToMemory = function () {
            if (typeof AdminSupport === 'undefined') return;
            supportPageData = AdminSupport.collectSupportPageFromForm(supportPageData);
            window.supportPageData = supportPageData;
        };
        let obucheniePageData = {};
        if (typeof AdminObuchenie !== 'undefined') {
            obucheniePageData = AdminObuchenie.migrateObucheniePageData(
                JSON.parse(localStorage.getItem('crzrt_obuchenie_page_data') || 'null')
            );
        }
        window.obucheniePageData = obucheniePageData;
        window.saveObucheniePageStateToMemory = function () {
            if (typeof AdminObuchenie === 'undefined') return;
            obucheniePageData = AdminObuchenie.collectObucheniePageFromForm(obucheniePageData);
            window.obucheniePageData = obucheniePageData;
        };
        let knowledgePageData = {};
        if (typeof AdminKnowledge !== 'undefined') {
            knowledgePageData = AdminKnowledge.migrateKnowledgePageData(
                JSON.parse(localStorage.getItem('crzrt_knowledge_page_data') || 'null')
            );
        }
        window.knowledgePageData = knowledgePageData;
        window.saveKnowledgePageStateToMemory = function () {
            if (typeof AdminKnowledge === 'undefined') return;
            knowledgePageData = AdminKnowledge.collectKnowledgePageFromForm(knowledgePageData);
            window.knowledgePageData = knowledgePageData;
        };
        let aboutData = { ...defaultAboutData };
        let contactsData = { ...defaultContactsData };
        let educationData; // assigned after defaultEducationData is declared (~line 1570)
        let consultingData; // assigned after defaultConsultingData is declared (~line 2490)

        async function syncAllDataFromServer() {
            const keys = [
                'crzrt_main_page_data',
                'crzrt_ecp_page_data',
                'crzrt_consulting_page_data',
                'crzrt_support_page_data',
                'crzrt_obuchenie_page_data',
                'crzrt_knowledge_page_data',
                'crzrt_about_data', 
                'crzrt_contacts', 
                'crzrt_education_data', 
                'crzrt_consulting_data'
            ];

            try {
                for (const key of keys) {
                    const resp = await fetch(`api/settings.php?key=${key}`);
                    if (resp.ok) {
                        const data = await resp.json();
                        if (data && Object.keys(data).length > 0) {
                            if (key === 'crzrt_main_page_data') {
                                mainPageData = AdminLanding.migrateMainPageData(data);
                                window.mainPageData = mainPageData;
                            }
                            else if (key === 'crzrt_ecp_page_data') {
                                ecpPageData = AdminEcp.migrateEcpPageData(data);
                                window.ecpPageData = ecpPageData;
                                localStorage.setItem(key, JSON.stringify(ecpPageData));
                            }
                            else if (key === 'crzrt_consulting_page_data' && typeof AdminConsultingPage !== 'undefined') {
                                consultingPageData = AdminConsultingPage.migrateConsultingPageData(data);
                                window.consultingPageData = consultingPageData;
                                localStorage.setItem(key, JSON.stringify(consultingPageData));
                            }
                            else if (key === 'crzrt_support_page_data' && typeof AdminSupport !== 'undefined') {
                                supportPageData = AdminSupport.migrateSupportPageData(data);
                                window.supportPageData = supportPageData;
                                localStorage.setItem(key, JSON.stringify(supportPageData));
                            }
                            else if (key === 'crzrt_obuchenie_page_data' && typeof AdminObuchenie !== 'undefined') {
                                obucheniePageData = AdminObuchenie.migrateObucheniePageData(data);
                                window.obucheniePageData = obucheniePageData;
                                localStorage.setItem(key, JSON.stringify(obucheniePageData));
                            }
                            else if (key === 'crzrt_knowledge_page_data' && typeof AdminKnowledge !== 'undefined') {
                                knowledgePageData = AdminKnowledge.migrateKnowledgePageData(data);
                                window.knowledgePageData = knowledgePageData;
                                localStorage.setItem(key, JSON.stringify(knowledgePageData));
                            }
                            else if (key === 'crzrt_about_data') aboutData = { ...defaultAboutData, ...data };
                            else if (key === 'crzrt_contacts') contactsData = { ...defaultContactsData, ...data };
                            else if (key === 'crzrt_education_data') educationData = { ...educationData, ...data };
                            else if (key === 'crzrt_consulting_data') consultingData = { ...consultingData, ...data };
                            
                            // Save to local for fallback
                            if (key !== 'crzrt_ecp_page_data' && key !== 'crzrt_consulting_page_data' && key !== 'crzrt_support_page_data' && key !== 'crzrt_obuchenie_page_data' && key !== 'crzrt_knowledge_page_data') {
                                localStorage.setItem(key, JSON.stringify(data));
                            }
                        }
                    }
                }
                // Refresh appropriate views
                if (currentTarget === 'main-page') renderMainPageAdmin();
                else if (currentTarget === 'ecp-page') renderEcpPageAdmin();
                else if (currentTarget === 'consulting-page') renderConsultingPageAdmin();
                else if (currentTarget === 'support-page') renderSupportPageAdmin();
                else if (currentTarget === 'obuchenie-page') renderObucheniePageAdmin();
                else if (currentTarget === 'knowledge-page') renderKnowledgePageAdmin();
                else if (currentTarget === 'about-us') renderAboutUsAdmin();
                else if (currentTarget === 'contacts') renderContactsAdmin();
                else if (currentTarget === 'education') renderEducationAdmin();
                else if (currentTarget === 'consulting') renderConsultingAdmin();
                
            } catch (e) {
                console.warn("Failed to sync some data from server, using local/defaults", e);
            }
        }

        // Миграция со старой версии или инициализация по умолчанию
        if (usersDb) {
            for (const email in usersDb) {
                const user = usersDb[email];
                // Если осталась старая роль вместо массива прав
                if (user.role && !user.permissions) {
                    if (user.role === 'superuser') user.permissions = ['superuser'];
                    else if (user.role === 'editor_main') user.permissions = ['main-page'];
                    else if (user.role === 'editor_other') user.permissions = ['users'];
                    else user.permissions = [];
                    user.name = user.name || 'Без имени';
                    delete user.role;
                }
            }
            // Жестко гарантируем, что суперпользователь хотя бы один есть и работает
            if (usersDb['admin@crzrt.ru']) {
                usersDb['admin@crzrt.ru'].permissions = ['superuser'];
                usersDb['admin@crzrt.ru'].name = usersDb['admin@crzrt.ru'].name || 'Администратор';
            } else {
                usersDb['admin@crzrt.ru'] = defaultUsers['admin@crzrt.ru'];
            }
        } else {
            usersDb = defaultUsers;
        }

        localStorage.setItem('crzrt_users', JSON.stringify(usersDb));

        const blocks = document.querySelectorAll('.admin-block');
        const permissionDenied = document.getElementById('permissionDenied');
        const navItems = document.querySelectorAll('.nav-item');
        const blockTargetMap = {
            'main-page': 'mainPageBlock',
            'ecp-page': 'ecpPageBlock',
            'consulting-page': 'consultingPageBlock',
            'support-page': 'supportPageBlock',
            'obuchenie-page': 'obucheniePageBlock',
            'knowledge-page': 'knowledgePageBlock',
            'consulting': 'consultingBlock',
            'education': 'educationBlock',
            'users': 'usersBlock',
            'about-us': 'aboutUsBlock',
            'contacts': 'contactsBlock',
            'settings': 'settingsBlock'
        };
        let currentPermissions = [];
        let currentUserEmail = null;
        let currentTarget = 'main-page';

        const authModal = document.getElementById('authModal');
        const authEmail = document.getElementById('authEmail');
        const authPassword = document.getElementById('authPassword');
        const btnAuthLogin = document.getElementById('btnAuthLogin');
        const authError = document.getElementById('authError');
        const currentUserRoleInfo = document.getElementById('currentUserRoleInfo');
        const btnLogout = document.getElementById('btnLogout');

        function renderMainPageAdmin() {
            AdminLanding.renderMainPageAdmin(mainPageData);
        }

        function renderEcpPageAdmin() {
            AdminEcp.renderEcpPageAdmin(ecpPageData);
        }

        function renderConsultingPageAdmin() {
            if (typeof AdminConsultingPage === 'undefined') return;
            AdminConsultingPage.renderConsultingPageAdmin(consultingPageData);
        }

        function renderSupportPageAdmin() {
            if (typeof AdminSupport === 'undefined') return;
            AdminSupport.renderSupportPageAdmin(supportPageData);
        }

        function renderObucheniePageAdmin() {
            if (typeof AdminObuchenie === 'undefined') return;
            AdminObuchenie.renderObucheniePageAdmin(obucheniePageData);
        }

        function renderKnowledgePageAdmin() {
            if (typeof AdminKnowledge === 'undefined') return;
            AdminKnowledge.renderKnowledgePageAdmin(knowledgePageData);
        }

        // ═══════════════════════════════════════════════
        //  EDUCATION ADMIN MODULE
        // ═══════════════════════════════════════════════

        const defaultEducationData = {
            courses: [
                {
                    id: 1, type: 'Очное', law: '44-ФЗ', audience: 'Заказчикам',
                    title: 'Повышение квалификации по 44-ФЗ (108 ак.ч.)',
                    description: 'Комплексная программа по 44-ФЗ для специалистов контрактной системы.',
                    duration: '108 ак.ч. / 5 дней', location: 'Казань, Петербургская 86',
                    document: 'Удостоверение гос. образца', price: '23 700 ₽',
                    link: 'course-44fz.html', active: true,
                    bullets: ['Последние изменения в 44-ФЗ', 'Планирование закупок', 'Электронные процедуры', 'Исполнение контракта']
                },
                {
                    id: 2, type: 'Очное', law: '44-ФЗ', audience: 'Заказчикам',
                    title: '44-ФЗ + Весенняя Казань',
                    description: 'Курс по 44-ФЗ + культурная программа по достопримечательностям Казани.',
                    duration: '108 ак.ч. / 5 дней', location: 'Казань',
                    document: 'Удостоверение гос. образца', price: '40 470 ₽',
                    link: 'course-vesennyaya-kazan.html', active: true,
                    bullets: ['Полная программа 44-ФЗ', 'Экскурсии по Казани', 'Мастер-класс по татарской кухне']
                },
                {
                    id: 3, type: 'Дистанционное', law: '44-ФЗ', audience: 'Заказчикам',
                    title: 'Профессиональная переподготовка по 44-ФЗ (256 ак.ч.)',
                    description: 'Онлайн-программа с выдачей диплома государственного образца.',
                    duration: '256 ак.ч.', location: 'Онлайн',
                    document: 'Диплом о профессиональной переподготовке', price: '17 500 ₽',
                    link: 'course-distance-repro.html', active: true,
                    bullets: ['Правовые основы', 'Электронные процедуры', 'ЕИС и отчётность']
                }
            ],
            events: [
                { id: 1, title: 'Очный курс: 44-ФЗ (108 ак.ч.)', date: '2026-03-23', month: 'Март', day: '23', format: 'Очно, Казань', price: '23 700 ₽', badge: 'Заказчикам', link: 'course-44fz.html', active: true },
                { id: 2, title: '44-ФЗ + Весенняя Казань', date: '2026-03-23', month: 'Март', day: '23', format: 'Очно + культурная программа', price: '40 470 ₽', badge: 'Спецпредложение', link: 'course-vesennyaya-kazan.html', active: true },
                { id: 3, title: 'Очный курс: 223-ФЗ (72 ак.ч.)', date: '2026-03-25', month: 'Март', day: '25', format: 'Очно, Казань', price: '16 200 ₽', badge: 'Заказчикам', link: 'course-223fz.html', active: true },
                { id: 4, title: 'Очный курс для поставщиков (40 ак.ч.)', date: '2026-05-11', month: 'Май', day: '11', format: 'Очно, Казань', price: '20 000 ₽', badge: 'Поставщикам', link: 'course-suppliers.html', active: true }
            ],
            teachers: [
                { id: 1, name: 'Иванов Иван Иванович', title: 'Руководитель образовательных программ', bio: 'Эксперт в сфере 44-ФЗ и 223-ФЗ с 15-летним опытом. Разработал более 20 учебных программ.', photo: '' },
                { id: 2, name: 'Петрова Анна Сергеевна', title: 'Ведущий преподаватель по 44-ФЗ', bio: 'Бывший специалист ФАС, практикующий юрист. Провела более 200 семинаров для заказчиков.', photo: '' }
            ]
        };

        // Initialize educationData now that defaultEducationData is available
        educationData = JSON.parse(localStorage.getItem('crzrt_education_data')) || { ...defaultEducationData };

        function saveEducationData() {
            localStorage.setItem('crzrt_education_data', JSON.stringify(educationData));
        }

        // ── Sub-tab switching ──
        document.querySelectorAll('.edu-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.edu-tab').forEach(b => {
                    b.style.background = 'transparent';
                    b.style.color = 'var(--text-secondary)';
                    b.classList.remove('active');
                });
                btn.style.background = 'var(--card-bg)';
                btn.style.color = 'var(--accent-color)';
                btn.classList.add('active');
                const target = btn.getAttribute('data-tab');
                document.querySelectorAll('.edu-tab-content').forEach(c => c.style.display = 'none');
                document.getElementById(target).style.display = 'block';
            });
        });

        // ══════════════════════════════════════
        //  COURSES RENDER
        // ══════════════════════════════════════
        function renderEducationAdmin() {
            renderEduCourses();
            renderEduEvents();
            renderEduTeachers();
        }

        function renderEduCourses() {
            const container = document.getElementById('eduCoursesAdmin');
            if (!container) return;
            container.innerHTML = '';
            educationData.courses.forEach((course, i) => {
                container.insertAdjacentHTML('beforeend', `
                <div style="border:1px solid var(--card-border); border-radius:12px; overflow:hidden; background:var(--card-bg);">
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 18px; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--card-border);">
                        <span style="font-weight:700; font-size:0.9rem;">${course.title}</span>
                        <div style="display:flex;gap:8px;">
                            <button class="btn-edit" onclick="window.toggleEduCourse(${i})">Ред.</button>
                            <button class="btn-delete" onclick="window.deleteEduCourse(${i})">Уд.</button>
                        </div>
                    </div>
                    <div id="eduCourseForm_${i}" style="display:none; padding:20px; display:flex; flex-direction:column; gap:12px;">
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;">
                            <div class="form-group" style="margin:0;">
                                <label>Тип</label>
                                <select class="form-control" id="ec_type_${i}">
                                    <option ${course.type === 'Очное' ? 'selected' : ''}>Очное</option>
                                    <option ${course.type === 'Дистанционное' ? 'selected' : ''}>Дистанционное</option>
                                    <option ${course.type === 'Семинар' ? 'selected' : ''}>Семинар</option>
                                    <option ${course.type === 'Вебинар' ? 'selected' : ''}>Вебинар</option>
                                    <option ${course.type === 'Индивидуальное' ? 'selected' : ''}>Индивидуальное</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin:0;">
                                <label>ФЗ</label>
                                <select class="form-control" id="ec_law_${i}">
                                    <option ${course.law === '44-ФЗ' ? 'selected' : ''}>44-ФЗ</option>
                                    <option ${course.law === '223-ФЗ' ? 'selected' : ''}>223-ФЗ</option>
                                    <option ${course.law === '44-ФЗ / 223-ФЗ' ? 'selected' : ''}>44-ФЗ / 223-ФЗ</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin:0;">
                                <label>Аудитория</label>
                                <select class="form-control" id="ec_audience_${i}">
                                    <option ${course.audience === 'Заказчикам' ? 'selected' : ''}>Заказчикам</option>
                                    <option ${course.audience === 'Поставщикам' ? 'selected' : ''}>Поставщикам</option>
                                    <option ${course.audience === 'Всем' ? 'selected' : ''}>Всем</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label>Название курса</label>
                            <input type="text" class="form-control" id="ec_title_${i}" value="${course.title}">
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label>Краткое описание</label>
                            <textarea class="form-control" id="ec_desc_${i}" style="min-height:80px;">${course.description}</textarea>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                            <div class="form-group" style="margin:0;">
                                <label>Продолжительность</label>
                                <input type="text" class="form-control" id="ec_dur_${i}" value="${course.duration}">
                            </div>
                            <div class="form-group" style="margin:0;">
                                <label>Место проведения</label>
                                <input type="text" class="form-control" id="ec_loc_${i}" value="${course.location}">
                            </div>
                            <div class="form-group" style="margin:0;">
                                <label>Документ по окончании</label>
                                <input type="text" class="form-control" id="ec_doc_${i}" value="${course.document}">
                            </div>
                            <div class="form-group" style="margin:0;">
                                <label>Стоимость</label>
                                <input type="text" class="form-control" id="ec_price_${i}" value="${course.price}">
                            </div>
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label>Ссылка на страницу курса</label>
                            <input type="text" class="form-control" id="ec_link_${i}" value="${course.link}">
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label>Что изучим (каждый пункт с новой строки)</label>
                            <textarea class="form-control" id="ec_bullets_${i}" style="min-height:100px;">${(course.bullets || []).join('\n')}</textarea>
                        </div>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <input type="checkbox" id="ec_active_${i}" ${course.active ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--accent-color);">
                            <label for="ec_active_${i}" style="margin:0;font-size:0.9rem;">Показывать на сайте</label>
                        </div>
                        <button class="btn-save" style="align-self:flex-start; padding:10px 24px;" onclick="window.saveEduCourse(${i})">Сохранить курс</button>
                    </div>
                </div>`);
                // Expand form by default for first render visibility — keep closed
                document.getElementById(`eduCourseForm_${i}`).style.display = 'none';
            });
        }

        window.toggleEduCourse = function (i) {
            const form = document.getElementById(`eduCourseForm_${i}`);
            form.style.display = form.style.display === 'none' ? 'flex' : 'none';
        };

        window.saveEduCourse = function (i) {
            const c = educationData.courses[i];
            c.type = document.getElementById(`ec_type_${i}`).value;
            c.law = document.getElementById(`ec_law_${i}`).value;
            c.audience = document.getElementById(`ec_audience_${i}`).value;
            c.title = document.getElementById(`ec_title_${i}`).value;
            c.description = document.getElementById(`ec_desc_${i}`).value;
            c.duration = document.getElementById(`ec_dur_${i}`).value;
            c.location = document.getElementById(`ec_loc_${i}`).value;
            c.document = document.getElementById(`ec_doc_${i}`).value;
            c.price = document.getElementById(`ec_price_${i}`).value;
            c.link = document.getElementById(`ec_link_${i}`).value;
            c.active = document.getElementById(`ec_active_${i}`).checked;
            const bulletsRaw = document.getElementById(`ec_bullets_${i}`).value;
            c.bullets = bulletsRaw.split('\n').map(s => s.trim()).filter(Boolean);
            saveEducationData();
            showToast('Курс сохранён');
        };

        window.deleteEduCourse = function (i) {
            if (!confirm('Удалить этот курс?')) return;
            educationData.courses.splice(i, 1);
            saveEducationData();
            renderEduCourses();
        };

        document.getElementById('btnAddCourse').addEventListener('click', () => {
            educationData.courses.push({
                id: Date.now(), type: 'Очное', law: '44-ФЗ', audience: 'Заказчикам',
                title: 'Новый курс', description: '', duration: '', location: 'Казань',
                document: 'Удостоверение гос. образца', price: '0 ₽',
                link: '#', active: false, bullets: []
            });
            saveEducationData();
            renderEduCourses();
            // Auto-expand last
            const last = educationData.courses.length - 1;
            setTimeout(() => {
                const f = document.getElementById(`eduCourseForm_${last}`);
                if (f) f.style.display = 'flex';
            }, 50);
        });

        // ══════════════════════════════════════
        //  EVENTS RENDER
        // ══════════════════════════════════════
        function renderEduEvents() {
            const container = document.getElementById('eduEventsAdmin');
            if (!container) return;
            container.innerHTML = '';
            educationData.events.forEach((ev, i) => {
                container.insertAdjacentHTML('beforeend', `
                <div style="border:1px solid var(--card-border); border-radius:12px; overflow:hidden; background:var(--card-bg);">
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 18px; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--card-border);">
                        <span style="font-weight:700; font-size:0.9rem;">${ev.month} ${ev.day} — ${ev.title}</span>
                        <div style="display:flex;gap:8px;">
                            <button class="btn-edit" onclick="window.toggleEduEvent(${i})">Ред.</button>
                            <button class="btn-delete" onclick="window.deleteEduEvent(${i})">Уд.</button>
                        </div>
                    </div>
                    <div id="eduEventForm_${i}" style="display:none; padding:20px; flex-direction:column; gap:12px;">
                        <div class="form-group" style="margin:0;">
                            <label>Название мероприятия</label>
                            <input type="text" class="form-control" id="ev_title_${i}" value="${ev.title}">
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;">
                            <div class="form-group" style="margin:0;">
                                <label>Дата (ГГГГ-ММ-ДД)</label>
                                <input type="date" class="form-control" id="ev_date_${i}" value="${ev.date}">
                            </div>
                            <div class="form-group" style="margin:0;">
                                <label>Месяц (текстом)</label>
                                <input type="text" class="form-control" id="ev_month_${i}" value="${ev.month}" placeholder="Март">
                            </div>
                            <div class="form-group" style="margin:0;">
                                <label>День (число)</label>
                                <input type="text" class="form-control" id="ev_day_${i}" value="${ev.day}" placeholder="23">
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                            <div class="form-group" style="margin:0;">
                                <label>Формат / Место</label>
                                <input type="text" class="form-control" id="ev_format_${i}" value="${ev.format}">
                            </div>
                            <div class="form-group" style="margin:0;">
                                <label>Стоимость</label>
                                <input type="text" class="form-control" id="ev_price_${i}" value="${ev.price}">
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                            <div class="form-group" style="margin:0;">
                                <label>Бейдж (напр. «Заказчикам»)</label>
                                <input type="text" class="form-control" id="ev_badge_${i}" value="${ev.badge}">
                            </div>
                            <div class="form-group" style="margin:0;">
                                <label>Ссылка</label>
                                <input type="text" class="form-control" id="ev_link_${i}" value="${ev.link}">
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <input type="checkbox" id="ev_active_${i}" ${ev.active ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--accent-color);">
                            <label for="ev_active_${i}" style="margin:0;font-size:0.9rem;">Показывать на сайте</label>
                        </div>
                        <button class="btn-save" style="align-self:flex-start; padding:10px 24px;" onclick="window.saveEduEvent(${i})">Сохранить</button>
                    </div>
                </div>`);
                document.getElementById(`eduEventForm_${i}`).style.display = 'none';
            });
        }

        window.toggleEduEvent = function (i) {
            const form = document.getElementById(`eduEventForm_${i}`);
            form.style.display = form.style.display === 'none' ? 'flex' : 'none';
        };

        window.saveEduEvent = function (i) {
            const ev = educationData.events[i];
            ev.title = document.getElementById(`ev_title_${i}`).value;
            ev.date = document.getElementById(`ev_date_${i}`).value;
            ev.month = document.getElementById(`ev_month_${i}`).value;
            ev.day = document.getElementById(`ev_day_${i}`).value;
            ev.format = document.getElementById(`ev_format_${i}`).value;
            ev.price = document.getElementById(`ev_price_${i}`).value;
            ev.badge = document.getElementById(`ev_badge_${i}`).value;
            ev.link = document.getElementById(`ev_link_${i}`).value;
            ev.active = document.getElementById(`ev_active_${i}`).checked;
            saveEducationData();
            showToast('Мероприятие сохранено');
        };

        window.deleteEduEvent = function (i) {
            if (!confirm('Удалить это мероприятие?')) return;
            educationData.events.splice(i, 1);
            saveEducationData();
            renderEduEvents();
        };

        document.getElementById('btnAddEvent').addEventListener('click', () => {
            const now = new Date();
            educationData.events.push({
                id: Date.now(), title: 'Новое мероприятие',
                date: now.toISOString().split('T')[0],
                month: now.toLocaleString('ru', { month: 'long' }),
                day: String(now.getDate()),
                format: 'Очно, Казань', price: '0 ₽', badge: 'Заказчикам',
                link: '#', active: false
            });
            saveEducationData();
            renderEduEvents();
            const last = educationData.events.length - 1;
            setTimeout(() => {
                const f = document.getElementById(`eduEventForm_${last}`);
                if (f) f.style.display = 'flex';
            }, 50);
        });

        // ══════════════════════════════════════
        //  TEACHERS RENDER
        // ══════════════════════════════════════
        function renderEduTeachers() {
            const container = document.getElementById('eduTeachersAdmin');
            if (!container) return;
            container.innerHTML = '';
            educationData.teachers.forEach((t, i) => {
                container.insertAdjacentHTML('beforeend', `
                <div style="border:1px solid var(--card-border); border-radius:12px; padding:20px; background:var(--card-bg); display:flex; flex-direction:column; gap:16px;">
                    <!-- Photo -->
                    <div style="position:relative; width:100%; height:180px; border:1px dashed var(--card-border); border-radius:8px; overflow:hidden; cursor:pointer; background:rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center;"
                         onclick="window.uploadTeacherPhoto(${i})">
                        <img id="teacher_photo_preview_${i}" src="${t.photo || ''}" alt="" style="width:100%; height:100%; object-fit:cover; object-position:top; display:${t.photo ? 'block' : 'none'};">
                        <span id="teacher_photo_placeholder_${i}" style="font-size:0.85rem; color:var(--text-secondary); display:${t.photo ? 'none' : 'block'};">
                            Нажмите, чтобы загрузить фото
                        </span>
                        ${t.photo ? `<button class="btn-delete" onclick="event.stopPropagation(); window.clearTeacherPhoto(${i})" style="position:absolute;top:8px;right:8px;padding:4px 10px;font-size:0.75rem;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>Удалить</button>` : ''}
                        <input type="hidden" id="teacher_photo_val_${i}" value="${t.photo || ''}">
                        <input type="file" id="teacher_photo_input_${i}" accept="image/*" style="display:none;" onchange="window.handleTeacherPhotoChange(event, ${i})">
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label>ФИО</label>
                        <input type="text" class="form-control" id="t_name_${i}" value="${t.name}">
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label>Должность / специализация</label>
                        <input type="text" class="form-control" id="t_title_${i}" value="${t.title}">
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label>Краткая биография</label>
                        <textarea class="form-control" id="t_bio_${i}" style="min-height:80px;">${t.bio}</textarea>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-save" style="flex:1; padding:10px;" onclick="window.saveTeacher(${i})">Сохранить</button>
                        <button class="btn-delete" style="padding:10px 16px;" onclick="window.deleteTeacher(${i})">Удалить</button>
                    </div>
                </div>`);
            });
        }

        window.uploadTeacherPhoto = function (i) {
            document.getElementById(`teacher_photo_input_${i}`).click();
        };

        window.handleTeacherPhotoChange = function (event, i) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                const dataUrl = e.target.result;
                const preview = document.getElementById(`teacher_photo_preview_${i}`);
                const placeholder = document.getElementById(`teacher_photo_placeholder_${i}`);
                const val = document.getElementById(`teacher_photo_val_${i}`);
                if (preview) { preview.src = dataUrl; preview.style.display = 'block'; }
                if (placeholder) placeholder.style.display = 'none';
                if (val) val.value = dataUrl;
                educationData.teachers[i].photo = dataUrl;
                saveEducationData();
                showToast('Фото загружено');
            };
            reader.readAsDataURL(file);
        };

        window.clearTeacherPhoto = function (i) {
            educationData.teachers[i].photo = '';
            saveEducationData();
            renderEduTeachers();
        };

        window.saveTeacher = function (i) {
            const t = educationData.teachers[i];
            t.name = document.getElementById(`t_name_${i}`).value;
            t.title = document.getElementById(`t_title_${i}`).value;
            t.bio = document.getElementById(`t_bio_${i}`).value;
            t.photo = document.getElementById(`teacher_photo_val_${i}`).value;
            saveEducationData();
            showToast('Преподаватель сохранён');
        };

        window.deleteTeacher = function (i) {
            if (!confirm('Удалить преподавателя?')) return;
            educationData.teachers.splice(i, 1);
            saveEducationData();
            renderEduTeachers();
        };

        document.getElementById('btnAddTeacher').addEventListener('click', () => {
            educationData.teachers.push({ id: Date.now(), name: 'Новый преподаватель', title: '', bio: '', photo: '' });
            saveEducationData();
            renderEduTeachers();
        });

        // ── Toast helper ──
        function showToast(msg) {
            let toast = document.getElementById('adminToast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'adminToast';
                toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:var(--accent-color);color:#fff;padding:12px 24px;font-weight:600;font-size:0.9rem;z-index:99999;border-radius:0;opacity:0;transition:opacity 0.3s;';
                document.body.appendChild(toast);
            }
            toast.textContent = msg;
            toast.style.opacity = '1';
            clearTimeout(toast._timer);
            toast._timer = setTimeout(() => toast.style.opacity = '0', 2500);
        }

        // ═══════════════════════════════════════════════

        async function checkAuth() {
            try {
                const response = await fetch('api/auth.php?action=check');
                const data = await response.json();
                
                if (data.authenticated) {
                    const user = data.user;
                    currentUserEmail = user.email || user.name;
                    
                    if (user.role === 'superadmin' || user.role === 'admin') {
                        currentPermissions = ['superuser'];
                    } else {
                        currentPermissions = [];
                    }

                    authModal.style.display = 'none';

                    let roleDisplay = "Пользователь";
                    if (currentPermissions.includes('superuser')) {
                        roleDisplay = "Суперпользователь";
                    }

                    currentUserRoleInfo.innerHTML = `<div>${user.name}</div><div style="font-size:0.8rem; font-weight:normal; opacity:0.8; margin-top:2px;">${roleDisplay}</div>`;
                    
                    // СИНХРОНИЗАЦИЯ С СЕРВЕРОМ
                    syncAllDataFromServer();
                    
                    updateAccess();
                } else {
                    authModal.style.display = 'flex';
                    authModal.style.opacity = '1';
                }
            } catch (error) {
                console.error('Auth error:', error);
                authModal.style.display = 'flex';
                authModal.style.opacity = '1';
            }
        }

        btnAuthLogin.addEventListener('click', async () => {
            const email = authEmail.value.trim();
            const password = authPassword.value;
            
            // Визуальная индикация загрузки
            const originalText = btnAuthLogin.innerText;
            btnAuthLogin.innerText = 'Вход...';
            btnAuthLogin.disabled = true;

            try {
                const response = await fetch('api/auth.php?action=login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                
                if (data.success) {
                    authError.style.display = 'none';
                    checkAuth();
                } else {
                    authError.style.display = 'block';
                    authError.innerText = data.error || 'Ошибка записи';
                }
            } catch (error) {
                authError.style.display = 'block';
                authError.innerText = 'Ошибка соединения с сервером';
            } finally {
                btnAuthLogin.innerText = originalText;
                btnAuthLogin.disabled = false;
            }
        });

        btnLogout.addEventListener('click', async () => {
            try {
                await fetch('api/auth.php?action=logout');
                currentUserEmail = null;
                currentPermissions = [];
                authEmail.value = '';
                authPassword.value = '';
                checkAuth();
            } catch (error) {
                console.error('Logout error:', error);
            }
        });

        function updateAccess() {
            if (currentPermissions.length === 0 && currentUserEmail === null) return;

            const isSuperuser = currentPermissions.includes('superuser');
            const targetBlockId = blockTargetMap[currentTarget];
            const targetBlock = targetBlockId ? document.getElementById(targetBlockId) : null;

            blocks.forEach((block) => block.classList.remove('active'));

            if (!targetBlock) {
                permissionDenied.style.display = 'block';
                return;
            }

            const requiredTarget = targetBlock.getAttribute('data-required-role') || currentTarget;
            const canAccess = isSuperuser || currentPermissions.includes(requiredTarget);

            if (canAccess) {
                targetBlock.classList.add('active');
                permissionDenied.style.display = 'none';

                if (currentTarget === 'main-page') renderMainPageAdmin();
                if (currentTarget === 'ecp-page') renderEcpPageAdmin();
                if (currentTarget === 'consulting-page') renderConsultingPageAdmin();
                if (currentTarget === 'support-page') renderSupportPageAdmin();
                if (currentTarget === 'obuchenie-page') renderObucheniePageAdmin();
                if (currentTarget === 'knowledge-page') renderKnowledgePageAdmin();
                if (currentTarget === 'consulting') renderConsultingAdmin();
                if (currentTarget === 'education') renderEducationAdmin();
                if (currentTarget === 'users') renderUsers();
                if (currentTarget === 'about-us') renderAboutUsAdmin();
                if (currentTarget === 'contacts') renderContactsAdmin();

                const gBtn = document.getElementById('globalSaveBtn');
                if (gBtn) {
                    gBtn.style.display = (currentTarget === 'users' || currentTarget === 'settings' || currentTarget === 'education') ? 'none' : 'flex';
                }
            } else {
                permissionDenied.style.display = 'block';
            }
        }

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                currentTarget = item.getAttribute('data-target');
                document.getElementById('pageTitle').innerText = item.innerText.trim();
                // Reset active indices on tab change
                window.activeAuthorIndex = null;
                window.activeFeatureCardIndex = undefined;
                updateAccess();
            });
        });

        // Users Management
        const newUserId = document.getElementById('newUserId');
        const newUserName = document.getElementById('newUserName');
        const newUserPass = document.getElementById('newUserPass');
        const btnAddUser = document.getElementById('btnAddUser');
        const usersListContent = document.getElementById('usersListContent');
        const permSuperuser = document.getElementById('permSuperuser');
        const regularPermissions = document.getElementById('regularPermissions');
        const permCheckboxes = document.querySelectorAll('.perm-checkbox');

        // Logic to disable other checkboxes if superuser is checked
        permSuperuser.addEventListener('change', () => {
            if (permSuperuser.checked) {
                regularPermissions.style.opacity = '0.5';
                permCheckboxes.forEach(cb => { cb.disabled = true; cb.checked = false; });
            } else {
                regularPermissions.style.opacity = '1';
                permCheckboxes.forEach(cb => cb.disabled = false);
            }
        });

        function renderUsers() {
            usersListContent.innerHTML = '';
            usersDb = JSON.parse(localStorage.getItem('crzrt_users')) || defaultUsers;

            const permNames = {
                'superuser': '<span style="color:var(--accent-color);font-weight:bold;">Полный доступ</span>',
                'main-page': 'Главная страница',
                'ecp-page': 'ЭТП',
                'consulting-page': 'Консалтинг',
                'support-page': 'Сопровождение',
                'obuchenie-page': 'Обучение',
                'users': 'Упр. пользователями',
                'contacts': 'Реквизиты',
                'settings': 'Настройки'
            };

            for (const email in usersDb) {
                const user = usersDb[email];
                const tr = document.createElement('tr');

                const tdName = document.createElement('td');
                tdName.innerText = user.name || '-';

                const tdEmail = document.createElement('td');
                tdEmail.innerText = email;

                const tdRole = document.createElement('td');
                if (user.permissions && user.permissions.includes('superuser')) {
                    tdRole.innerHTML = permNames['superuser'];
                } else if (user.permissions && user.permissions.length > 0) {
                    tdRole.innerHTML = user.permissions.map(p => permNames[p]).filter(Boolean).join(', ');
                } else {
                    tdRole.innerText = 'Нет прав';
                }

                const tdActions = document.createElement('td');
                if (currentPermissions.includes('superuser')) {
                    // Edit Button
                    const btnEdit = document.createElement('button');
                    btnEdit.className = 'btn-edit';
                    btnEdit.innerText = 'Редактировать';
                    btnEdit.onclick = () => openUserModal(email);
                    tdActions.appendChild(btnEdit);

                    if (email !== currentUserEmail) {
                        const btnDel = document.createElement('button');
                        btnDel.className = 'btn-delete';
                        btnDel.innerText = 'Удалить';
                        btnDel.onclick = () => {
                            if (confirm(`Удалить пользователя ${email}?`)) {
                                delete usersDb[email];
                                localStorage.setItem('crzrt_users', JSON.stringify(usersDb));
                                renderUsers();
                            }
                        };
                        tdActions.appendChild(btnDel);
                    }
                }

                tr.appendChild(tdName);
                tr.appendChild(tdEmail);
                tr.appendChild(tdRole);
                tr.appendChild(tdActions);
                usersListContent.appendChild(tr);
            }
        }

        let editingUserEmail = null;

        function openUserModal(email = null) {
            editingUserEmail = email;
            const modal = document.getElementById('userModal');
            const title = document.getElementById('userModalTitle');
            const emailInput = document.getElementById('newUserId');

            // Reset fields
            document.getElementById('newUserName').value = '';
            emailInput.value = '';
            document.getElementById('newUserPass').value = '';
            document.getElementById('permSuperuser').checked = false;
            permCheckboxes.forEach(cb => { cb.checked = false; cb.disabled = false; });
            regularPermissions.style.opacity = '1';

            if (email) {
                const user = usersDb[email];
                if (user) {
                    title.innerText = 'Редактировать пользователя';
                    emailInput.value = email;
                    emailInput.disabled = true;
                    document.getElementById('newUserName').value = user.name || '';

                    if (user.permissions.includes('superuser')) {
                        document.getElementById('permSuperuser').checked = true;
                        permCheckboxes.forEach(cb => { cb.disabled = true; });
                        regularPermissions.style.opacity = '0.5';
                    } else {
                        permCheckboxes.forEach(cb => {
                            if (user.permissions.includes(cb.value)) cb.checked = true;
                        });
                    }
                }
            } else {
                title.innerText = 'Добавить пользователя';
                emailInput.disabled = false;
            }
            modal.style.display = 'flex';
        }

        function closeUserModal() {
            document.getElementById('userModal').style.display = 'none';
            editingUserEmail = null;
        }

        // Event listeners initialization for Users
        function initUsersEventListeners() {
            const btnOpenAdd = document.getElementById('btnOpenAddUser');
            if (btnOpenAdd) {
                btnOpenAdd.onclick = () => openUserModal();
            }

            const btnClose = document.getElementById('btnUserModalClose');
            if (btnClose) btnClose.onclick = closeUserModal;

            const btnCancel = document.getElementById('btnCancelUserModal');
            if (btnCancel) btnCancel.onclick = closeUserModal;

            const btnAdd = document.getElementById('btnAddUser');
            if (btnAdd) {
                btnAdd.onclick = () => {
                    const email = newUserId.value.trim();
                    const name = newUserName.value.trim() || 'Без имени';
                    const pass = newUserPass.value.trim();

                    let permissions = [];
                    if (permSuperuser.checked) {
                        permissions.push('superuser');
                    } else {
                        permCheckboxes.forEach(cb => {
                            if (cb.checked) permissions.push(cb.value);
                        });
                    }

                    if (email) {
                        if (!editingUserEmail && usersDb[email]) {
                            alert('Пользователь с таким email уже существует');
                            return;
                        }
                        if (!editingUserEmail && !pass) {
                            alert('Для нового пользователя обязателен пароль');
                            return;
                        }

                        const userData = { ...usersDb[email] || {}, name, permissions };
                        if (pass) userData.password = pass;

                        usersDb[email] = userData;
                        localStorage.setItem('crzrt_users', JSON.stringify(usersDb));
                        renderUsers();
                        closeUserModal();
                    } else {
                        alert('Заполните E-mail');
                    }
                };
            }
        }

        // Call init immediately and also whenever users section might be re-rendered or tab switched
        initUsersEventListeners();

        // Drag and drop for uploadWrapper
        if (uploadWrapper) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadWrapper.addEventListener(eventName, preventDefaults, false);
            });
            ['dragenter', 'dragover'].forEach(eventName => {
                uploadWrapper.addEventListener(eventName, highlight, false);
            });
            ['dragleave', 'drop'].forEach(eventName => {
                uploadWrapper.addEventListener(eventName, unhighlight, false);
            });
            uploadWrapper.addEventListener('drop', handleDrop, false);
        }

        if (imageInput) {
            imageInput.addEventListener('change', function (e) {
                handleFiles(this.files);
            });
        }

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight(e) {
            if (uploadWrapper) {
                uploadWrapper.style.borderColor = 'var(--accent-color)';
                uploadWrapper.style.background = 'rgba(41, 151, 255, 0.1)';
            }
        }
        function unhighlight(e) {
            if (uploadWrapper) {
                uploadWrapper.style.borderColor = '';
                uploadWrapper.style.background = '';
            }
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        imageInput.addEventListener('change', function (e) {
            handleFiles(this.files);
        });

        const docFileInput = document.getElementById('docFileInput');
        if (docFileInput) {
            docFileInput.addEventListener('change', async function () {
                const file = this.files && this.files[0];
                const targetId = window.fileUploadTarget;
                this.value = '';
                if (!file || !targetId) return;

                const formData = new FormData();
                formData.append('file', file);
                formData.append('slot', targetId.replace(/[^a-z0-9_]/gi, '_'));

                try {
                    const response = await fetch('api/upload-file.php', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    if (!response.ok || !result?.success || !result?.url) {
                        throw new Error(result?.error || 'Не удалось загрузить файл');
                    }
                    const input = document.getElementById(targetId);
                    if (input) input.value = result.url;
                    if (AdminEcp?.setFileUploadState) {
                        AdminEcp.setFileUploadState(targetId, result.url, result.name || file.name);
                    }
                    if (AdminSupport?.isSupportFileInputId?.(targetId) && AdminSupport?.setFileUploadState) {
                        AdminSupport.setFileUploadState(targetId, result.url, result.name || file.name);
                    }
                    if (AdminKnowledge?.setFileUploadState) {
                        AdminKnowledge.setFileUploadState(targetId, result.url, result.name || file.name);
                    }
                    if (targetId.startsWith('obuchenie_') && AdminObuchenie?.setFileUploadState) {
                        AdminObuchenie.setFileUploadState(targetId, result.url, result.name || file.name);
                    }
                    updateSaveButtonsState({
                        boxShadow: '0 0 15px rgba(52, 199, 89, 0.5)',
                        text: 'Сохраните изменения!'
                    });
                } catch (error) {
                    alert('Ошибка загрузки файла: ' + error.message);
                } finally {
                    window.fileUploadTarget = null;
                }
            });
        }

        function getCropAspectForUpload(uploadId) {
            if (window.cropTarget?.uploadId === uploadId) {
                const forced = Number(window.cropTarget?.aspect);
                if (Number.isFinite(forced) && forced > 0) return forced;
            }
            if (uploadId === 'consulting_why_side_image') return 489 / 763;
            if (AdminEcp?.isEcpUploadId?.(uploadId)) return AdminEcp.getAspect(uploadId);
            if (AdminConsultingPage?.isConsultingUploadId?.(uploadId)) return AdminConsultingPage.getAspect(uploadId);
            if (AdminSupport?.isSupportUploadId?.(uploadId)) return AdminSupport.getAspect(uploadId);
            if (AdminObuchenie?.isObuchenieUploadId?.(uploadId)) return AdminObuchenie.getAspect(uploadId);
            if (AdminKnowledge?.isKnowledgeUploadId?.(uploadId)) return AdminKnowledge.getAspect(uploadId);
            if (AdminLanding?.getAspect) return AdminLanding.getAspect(uploadId);
            return window.activeAuthorIndex !== null ? 1 : 16 / 9;
        }

        function setCropperWrapperLayout(aspect) {
            if (!cropperWrapper) return;
            cropperWrapper.classList.toggle(
                'cropper-wrapper--tall-portrait',
                Number.isFinite(aspect) && aspect > 0 && aspect < 0.85
            );
        }

        function buildStandardCropperOptions(aspect) {
            return {
                viewMode: 2,
                dragMode: 'move',
                autoCropArea: 1,
                background: false,
                zoomable: true,
                guides: true,
                center: true,
                highlight: true,
                aspectRatio: aspect
            };
        }

        function handleFiles(files) {
            if (files && files.length > 0) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imageToCrop.src = e.target.result;

                    // Show global cropper modal
                    const globalContainer = document.getElementById('cropperGlobalContainer');
                    globalContainer.style.display = 'flex'; // Modal is flex centered

                    if (cropper) {
                        cropper.destroy();
                        cropper = null;
                    }
                    if (AdminLanding?.unmountPartnerCropGuides) AdminLanding.unmountPartnerCropGuides();

                    const uploadId = window.cropTarget?.uploadId;
                    const isPartner = AdminLanding?.isPartnerUploadId?.(uploadId);

                    if (AdminLanding?.setPartnerCropperMode) {
                        AdminLanding.setPartnerCropperMode(isPartner, cropperWrapper);
                    }

                    let cropperOpts;
                    if (isPartner && AdminLanding?.getCropperOptions) {
                        cropperOpts = AdminLanding.getCropperOptions(uploadId);
                        setCropperWrapperLayout(NaN);
                    } else if (
                        uploadId && (
                            AdminEcp?.isEcpUploadId?.(uploadId) ||
                            AdminConsultingPage?.isConsultingUploadId?.(uploadId) ||
                            AdminSupport?.isSupportUploadId?.(uploadId) ||
                            AdminObuchenie?.isObuchenieUploadId?.(uploadId) ||
                            AdminKnowledge?.isKnowledgeUploadId?.(uploadId) ||
                            window.activeAuthorIndex !== null
                        )
                    ) {
                        const aspect = getCropAspectForUpload(uploadId);
                        cropperOpts = buildStandardCropperOptions(aspect);
                        setCropperWrapperLayout(aspect);
                    } else if (uploadId && AdminLanding?.getCropperOptions) {
                        cropperOpts = AdminLanding.getCropperOptions(uploadId);
                        setCropperWrapperLayout(NaN);
                    } else {
                        const aspect = getCropAspectForUpload(uploadId);
                        cropperOpts = buildStandardCropperOptions(aspect);
                        setCropperWrapperLayout(aspect);
                    }
                    cropper = new Cropper(imageToCrop, cropperOpts);
                };
                reader.readAsDataURL(files[0]);
            }
        }

        const HERO_MAX_BASE64_BYTES = 1.6 * 1024 * 1024;
        const PROMO_COVER_MAX_BASE64_BYTES = 1.6 * 1024 * 1024;

        function dataUrlBytes(dataUrl) {
            const commaIdx = dataUrl?.indexOf(',');
            if (commaIdx === -1) return 0;
            const base64 = dataUrl.slice(commaIdx + 1);
            const padding = (base64.match(/=+$/) || [''])[0].length;
            return Math.floor((base64.length * 3) / 4) - padding;
        }

        function scaleCanvas(sourceCanvas, scale) {
            const next = document.createElement('canvas');
            next.width = Math.max(1, Math.round(sourceCanvas.width * scale));
            next.height = Math.max(1, Math.round(sourceCanvas.height * scale));
            const ctx = next.getContext('2d');
            if (ctx) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(sourceCanvas, 0, 0, next.width, next.height);
            }
            return next;
        }

        function makeDataUrlWithinLimit(canvas, maxBytes, startQuality = 0.76) {
            let quality = startQuality;
            let workingCanvas = canvas;
            let result = workingCanvas.toDataURL('image/jpeg', quality);
            let tries = 0;

            while (dataUrlBytes(result) > maxBytes && tries < 10) {
                tries += 1;
                if (quality > 0.70) {
                    quality = Math.max(0.70, quality - 0.06);
                } else {
                    workingCanvas = scaleCanvas(workingCanvas, 0.88);
                }
                result = workingCanvas.toDataURL('image/jpeg', quality);
            }

            return result;
        }

        function makeHeroDataUrlWithinLimit(canvas) {
            return makeDataUrlWithinLimit(canvas, HERO_MAX_BASE64_BYTES, 0.85);
        }

        function makePromoCoverDataUrlWithinLimit(canvas) {
            return makeDataUrlWithinLimit(canvas, PROMO_COVER_MAX_BASE64_BYTES, 0.88);
        }

        btnZoomIn.addEventListener('click', () => {
            if (!cropper) return;
            const uploadId = window.cropTarget?.uploadId;
            if (AdminLanding?.isPartnerUploadId?.(uploadId)) {
                AdminLanding.partnerZoomBy(cropper, 1);
                return;
            }
            const step = AdminLanding?.getZoomStep?.(uploadId, 1) ?? 0.1;
            cropper.zoom(step);
        });
        btnZoomOut.addEventListener('click', () => {
            if (!cropper) return;
            const uploadId = window.cropTarget?.uploadId;
            if (AdminLanding?.isPartnerUploadId?.(uploadId)) {
                AdminLanding.partnerZoomBy(cropper, -1);
                return;
            }
            const step = AdminLanding?.getZoomStep?.(uploadId, -1) ?? -0.1;
            cropper.zoom(step);
        });

        document.getElementById('btnPartnerFit')?.addEventListener('click', () => {
            if (cropper && AdminLanding?.fitPartnerLogoToSafeZone) {
                AdminLanding.fitPartnerLogoToSafeZone(cropper);
            }
        });

        btnCrop.addEventListener('click', () => {
            if (cropper) {
                let resWidth = 1200;
                let resHeight = 675;
                if (window.activeAuthorIndex !== null) {
                    resWidth = 400;
                    resHeight = 400;
                } else if (window.cropTarget && AdminEcp?.isEcpUploadId?.(window.cropTarget.uploadId)) {
                    [resWidth, resHeight] = AdminEcp.getCropSize(window.cropTarget.uploadId);
                } else if (window.cropTarget && AdminConsultingPage?.isConsultingUploadId?.(window.cropTarget.uploadId)) {
                    [resWidth, resHeight] = AdminConsultingPage.getCropSize(window.cropTarget.uploadId);
                } else if (window.cropTarget && AdminSupport?.isSupportUploadId?.(window.cropTarget.uploadId)) {
                    [resWidth, resHeight] = AdminSupport.getCropSize(window.cropTarget.uploadId);
                } else if (window.cropTarget && AdminObuchenie?.isObuchenieUploadId?.(window.cropTarget.uploadId)) {
                    [resWidth, resHeight] = AdminObuchenie.getCropSize(window.cropTarget.uploadId);
                } else if (window.cropTarget && AdminKnowledge?.isKnowledgeUploadId?.(window.cropTarget.uploadId)) {
                    [resWidth, resHeight] = AdminKnowledge.getCropSize(window.cropTarget.uploadId);
                } else if (window.cropTarget && AdminLanding) {
                    [resWidth, resHeight] = AdminLanding.getCropSize(window.cropTarget.uploadId);
                }

                const uploadId = window.cropTarget?.uploadId;
                let canvasOpts = { width: resWidth, height: resHeight };
                if (window.cropTarget && (
                    AdminEcp?.isEcpUploadId?.(uploadId) ||
                    AdminConsultingPage?.isConsultingUploadId?.(uploadId) ||
                    AdminSupport?.isSupportUploadId?.(uploadId) ||
                    AdminObuchenie?.isObuchenieUploadId?.(uploadId) ||
                    AdminKnowledge?.isKnowledgeUploadId?.(uploadId)
                )) {
                    canvasOpts = {
                        width: resWidth,
                        height: resHeight,
                        imageSmoothingEnabled: true,
                        imageSmoothingQuality: 'high'
                    };
                } else if (window.cropTarget && AdminLanding?.getCroppedCanvasOptions) {
                    canvasOpts = AdminLanding.getCroppedCanvasOptions(uploadId);
                }
                const canvas = cropper.getCroppedCanvas(canvasOpts);
                const isPartner = AdminLanding?.isPartnerUploadId?.(uploadId);
                const isHeroSlide = Boolean(
                    uploadId
                    && (uploadId.startsWith('m_hero_bg_')
                        || uploadId === 'ecp_hero_bg'
                        || uploadId === 'ecp_support_bg'
                        || uploadId === 'consulting_hero_bg'
                        || uploadId === 'support_hero_bg'
                        || uploadId === 'obuchenie_hero_bg'
                        || uploadId === 'knowledge_hero_bg')
                );
                const isPromoCover = uploadId === 'obuchenie_cal_promo_image'
                    || uploadId === 'obuchenie_testing_image'
                    || uploadId === 'consulting_why_side_image';
                const resultBase64 = isPartner
                    ? canvas.toDataURL('image/png')
                    : isPromoCover
                        ? makePromoCoverDataUrlWithinLimit(canvas)
                        : isHeroSlide
                            ? makeHeroDataUrlWithinLimit(canvas)
                            : canvas.toDataURL('image/jpeg', 0.85);

                if (window.activeAuthorIndex !== null) {
                    const idx = window.activeAuthorIndex;
                    const el = document.getElementById(`c_author_photo_preview_${idx}`);
                    if (el) {
                        el.src = resultBase64;
                        el.style.display = 'block';
                        document.getElementById(`c_author_photo_text_${idx}`).style.display = 'none';
                        document.getElementById(`c_author_avatarUrl_${idx}`).value = resultBase64;
                    }
                    window.activeAuthorIndex = null;
                } else if (window.cropTarget && AdminEcp?.isEcpUploadId?.(window.cropTarget.uploadId)) {
                    AdminEcp.applyCroppedImage(window.cropTarget.uploadId, resultBase64);
                    window.cropTarget = null;
                } else if (window.cropTarget && AdminConsultingPage?.isConsultingUploadId?.(window.cropTarget.uploadId)) {
                    AdminConsultingPage.applyCroppedImage(window.cropTarget.uploadId, resultBase64);
                    window.cropTarget = null;
                } else if (window.cropTarget && AdminSupport?.isSupportUploadId?.(window.cropTarget.uploadId)) {
                    AdminSupport.applyCroppedImage(window.cropTarget.uploadId, resultBase64);
                    window.cropTarget = null;
                } else if (window.cropTarget && AdminObuchenie?.isObuchenieUploadId?.(window.cropTarget.uploadId)) {
                    AdminObuchenie.applyCroppedImage(window.cropTarget.uploadId, resultBase64);
                    window.cropTarget = null;
                } else if (window.cropTarget && AdminKnowledge?.isKnowledgeUploadId?.(window.cropTarget.uploadId)) {
                    AdminKnowledge.applyCroppedImage(window.cropTarget.uploadId, resultBase64);
                    window.cropTarget = null;
                } else if (window.cropTarget && AdminLanding) {
                    AdminLanding.applyCroppedImage(window.cropTarget.uploadId, resultBase64);
                    window.cropTarget = null;
                } else if (window.activeAboutImage) {
                    const el = document.getElementById('a_image_preview');
                    if (el) {
                        el.src = resultBase64;
                        el.style.display = 'block';
                        document.getElementById('a_image_placeholder').style.display = 'none';
                        document.getElementById('a_image_val').value = resultBase64;
                    }
                    window.activeAboutImage = false;
                }

                document.getElementById('cropperGlobalContainer').style.display = 'none';


                cropper.destroy();
                cropper = null;
                setCropperWrapperLayout(NaN);
                if (AdminLanding?.unmountPartnerCropGuides) AdminLanding.unmountPartnerCropGuides();
                if (AdminLanding?.setPartnerCropperMode) AdminLanding.setPartnerCropperMode(false, cropperWrapper);
            }
        });

        btnCancelCrop.addEventListener('click', () => {
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
            setCropperWrapperLayout(NaN);
            if (AdminLanding?.unmountPartnerCropGuides) AdminLanding.unmountPartnerCropGuides();
            if (AdminLanding?.setPartnerCropperMode) AdminLanding.setPartnerCropperMode(false, cropperWrapper);
            document.getElementById('cropperGlobalContainer').style.display = 'none';
            window.activeAuthorIndex = null;
            window.activeFeatureCardIndex = undefined;
            window.activeAboutImage = false;
            window.cropTarget = null;
        });

        // =======================
        // Consulting Admin Logic
        // =======================

        const defaultConsultingData = {
            authors: [
                { id: '1', avatarText: 'Д', name: 'Дмитрий', phone: '+7 900 000-00-00', email: 'dima@crzrt.ru' },
                { id: '2', avatarText: 'ИИ', name: 'Иванов И.И.', phone: '+7 900 000-00-01', email: 'ivanov@crzrt.ru' }
            ],
            services: [
                { id: 'business', category: 'customers', title: 'Решения для бизнеса', highlight: 'Юридические решения – это не расходы, а защита ваших денег и времени.', benefits: 'анализ бизнес-модели на предмет потенциальных рисков: исков, штрафов, претензий\nшаблоны рабочих документов: договоры, приказы, положение о закупках (223-ФЗ)\nпрактические советы и стратегии минимизации негативных последствий', disclaimer: '' },
                { id: 'deals', category: 'customers', title: 'Сопровождение сделок', highlight: 'Сопровождение сделки абсолютно необходимо для минимизации рисков и безопасности всех сторон.', benefits: 'Правовую экспертизу объектов перед сделкой\nподготовка полного и юридически выверенного пакета документов\nорганизацию безопасных расчетов между контрагентами\nсопровождение сделки и проверку «чистоты» подписания', disclaimer: '' },
                { id: 'disputes', category: 'suppliers', title: 'Сложные судебные споры', highlight: 'Суд - крайняя стадия конфликтной ситуации, и к ней нужно быть готовым заранее.', benefits: 'правовой аудит ситуации и досудебную подготовку (медиация)\nформирование железной доказательной базы и процессуальных документов\nпредставительство ваших интересов в судах всех инстанций\nсопровождение на этапе исполнительного производства', disclaimer: '' },
                { id: 'corporate', category: 'customers', title: 'Корпоративное право', highlight: 'В процессе деятельности любое юридическое лицо руководствуется прежде всего нормами корпоративного права, и их исполнение лучше доверить профессионалам.', benefits: 'Система «под ключ»: регистрация, ликвидация или реорганизация юридических лиц, в том числе унитарных предприятий\nподготовка решений и протоколов собраний\nдетальная правовая экспертиза и структурирование сделок\nразработка и внедрение корпоративных договоров и опционных программ для сотрудников', disclaimer: '' },
                { id: 'public', category: 'customers', title: 'Поддержка госзаказчиков', highlight: 'Поможем понять структуры работы с 44-ФЗ и госзакупками в целом, снять излишние риски с должностных лиц.', benefits: 'правовая экспертиза закупочной документации еще на стадии планирования\nкомплексное сопровождение заключения и исполнения контракта\nпретензионно-исковая работа и взыскание неустоек\nзащита при проверках контролирующих органов и обжалование решений, предписаний, постановлений КоАП\nметодологическое обеспечение закупочной деятельности (положения, регламенты)', disclaimer: '' },
                { id: 'competitor', category: 'suppliers', title: 'Конкурентный консалтинг', highlight: 'Работа с поставщиками – одно из наших приоритетных направлений. Постоянные изменения в законодательстве требуют всегда быть в курсе новых судебных практик.', benefits: 'анализ закупочной документации и проверка «подводных камней».\nпрактические рекомендации и оценка возможностей участия в торгах\nПодготовка и тщательная проверка заявки на участие (решения об одобрении сделки, отсутствие оснований для отклонения)\nсопровождение «антимонопольного этапа» и подача запросов на разъяснение (жалобы, представление интересов)\nЮридическая поддержка при исполнении контракта\nзащита интересов при спорах о включении в РНП*', disclaimer: '* Реестр недобросовестных поставщиков (ст. 104 Закона о контрактной системе 44-ФЗ)' }
            ]
        };

        // Initialize consultingData now that defaultConsultingData is available
        consultingData = JSON.parse(localStorage.getItem('crzrt_consulting_data')) || { ...defaultConsultingData };
        const consultingAuthorsAdmin = document.getElementById('consultingAuthorsAdmin');
        const consultingServicesAdmin = document.getElementById('consultingServicesAdmin');

        window.handleAuthorPhoto = function (input, index) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('c_author_photo_preview_' + index).src = e.target.result;
                    document.getElementById('c_author_photo_preview_' + index).style.display = 'block';
                    document.getElementById('c_author_photo_text_' + index).style.display = 'none';
                    document.getElementById('c_author_avatarUrl_' + index).value = e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
            }
        };

        function renderConsultingAdmin() {
            // Render Color Setting
            const clrInput = document.getElementById('c_category_color');
            const clrPicker = document.getElementById('c_category_color_picker');

            clrInput.value = consultingData.categoryColor || '#ff3b3b';
            clrPicker.value = consultingData.categoryColor || '#ff3b3b';

            clrInput.addEventListener('input', (e) => { clrPicker.value = e.target.value; });
            clrPicker.addEventListener('input', (e) => { clrInput.value = e.target.value; });

            // Render Authors
            consultingAuthorsAdmin.innerHTML = '';
            consultingData.authors.forEach((author, index) => {
                const authorHTML = `
                    <div style="border-left: 3px solid var(--accent-color); padding-left: 20px; margin-bottom: 24px; background: rgba(0,0,0,0.02); padding: 25px; border-radius: 0 16px 16px 0;">
                        <h4 style="margin-bottom: 20px; font-weight: 600; font-size: 1.1rem; color: var(--accent-color);">Автор ${index + 1}</h4>
                        
                        <!-- Row 1: Photo & Avatar Text -->
                        <div style="display: flex; gap: 30px; align-items: flex-end; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px dashed var(--card-border);">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Фото (Аватар)</label>
                                <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--card-border); overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; border: 2px solid var(--accent-color);" onclick="window.activeAuthorIndex = ${index}; window.activeFeatureCardIndex = undefined; document.getElementById('imageInput').click()">
                                    <img id="c_author_photo_preview_${index}" src="${author.avatarUrl || ''}" style="width: 100%; height: 100%; object-fit: cover; display: ${author.avatarUrl ? 'block' : 'none'};">
                                    <span id="c_author_photo_text_${index}" style="font-size: 2rem; font-weight: 700; color: var(--text-secondary); display: ${author.avatarUrl ? 'none' : 'block'};">${author.avatarText || 'ИИ'}</span>
                                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); font-size: 0.7rem; text-align: center; color: white; padding: 4px 0;">ИЗМЕНИТЬ</div>
                                </div>
                                <input type="hidden" id="c_author_avatarUrl_${index}" value="${author.avatarUrl || ''}">
                            </div>
                            <div class="form-group" style="margin-bottom: 0; flex: 1; max-width: 200px;">
                                <label>Инициалы (текстом)</label>
                                <input type="text" class="form-control" id="c_author_avatar_${index}" value="${author.avatarText || ''}" placeholder="ИИ" maxlength="4">
                                <small style="display:block; margin-top:5px; font-size:0.7rem;">Если не загружено фото</small>
                            </div>
                        </div>

                        <!-- Row 2: Basic Info -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>ФИО</label>
                                <input type="text" class="form-control" id="c_author_name_${index}" value="${author.name || ''}" placeholder="Иванов И.И.">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Телефон</label>
                                <input type="text" class="form-control" id="c_author_phone_${index}" value="${author.phone || ''}" placeholder="+7 ...">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>E-mail</label>
                                <input type="email" class="form-control" id="c_author_email_${index}" value="${author.email || ''}" placeholder="mail@domain.ru">
                            </div>
                        </div>
                    </div>
                `;
                consultingAuthorsAdmin.insertAdjacentHTML('beforeend', authorHTML);
            });

            // Render Services
            consultingServicesAdmin.innerHTML = '';
            consultingData.services.forEach((service, index) => {
                const serviceHTML = `
                    <div style="background: rgba(0,0,0,0.05); padding: 20px; border-radius: 8px; border: 1px solid var(--card-border);">
                        <h3 style="margin-bottom: 15px; font-weight: 600; color: var(--accent-color);">${service.title}</h3>
                        <input type="hidden" id="c_service_id_${index}" value="${service.id}">
                        
                        <div class="form-group">
                            <label>Название услуги</label>
                            <input type="text" class="form-control" id="c_service_title_${index}" value="${service.title || ''}">
                        </div>
                        <div class="form-group">
                            <label>Категория (для меню)</label>
                            <select class="form-control" id="c_service_category_${index}">
                                <option value="customers" ${service.category === 'customers' ? 'selected' : ''}>Заказчикам</option>
                                <option value="suppliers" ${service.category === 'suppliers' ? 'selected' : ''}>Поставщикам</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Выделенная цитата (Главная мысль)</label>
                            <textarea class="form-control" id="c_service_highlight_${index}" style="min-height: 80px;">${service.highlight || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Список получаемых результатов (каждый пункт с новой строки, без тире)</label>
                            <textarea class="form-control" id="c_service_benefits_${index}" style="min-height: 80px;">${service.benefits || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Мелкий шрифт (сноска, если есть)</label>
                            <input type="text" class="form-control" id="c_service_disclaimer_${index}" value="${service.disclaimer || ''}">
                        </div>
                        <button class="btn-delete" style="margin-top: 15px;" onclick="window.removeConsultingService(${index})">Удалить услугу</button>
                    </div>
                `;
                consultingServicesAdmin.insertAdjacentHTML('beforeend', serviceHTML);
            });
        }

        function renderAboutUsAdmin() {
            document.getElementById('a_hero_title').value = aboutData.heroTitle || '';
            document.getElementById('a_hero_subtitle').value = aboutData.heroSubtitle || '';
            document.getElementById('a_main_title').value = aboutData.mainTitle || '';
            document.getElementById('a_p1').value = aboutData.p1 || '';
            document.getElementById('a_p2').value = aboutData.p2 || '';
            document.getElementById('a_services').value = aboutData.services || '';

            const preview = document.getElementById('a_image_preview');
            const placeholder = document.getElementById('a_image_placeholder');
            const valInput = document.getElementById('a_image_val');

            if (aboutData.image) {
                preview.src = aboutData.image;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
                valInput.value = aboutData.image;
            } else {
                preview.style.display = 'none';
                placeholder.style.display = 'block';
                valInput.value = '';
            }
        }

        function saveAboutUsStateToMemory() {
            aboutData.heroTitle = document.getElementById('a_hero_title').value;
            aboutData.heroSubtitle = document.getElementById('a_hero_subtitle').value;
            aboutData.mainTitle = document.getElementById('a_main_title').value;
            aboutData.p1 = document.getElementById('a_p1').value;
            aboutData.p2 = document.getElementById('a_p2').value;
            aboutData.services = document.getElementById('a_services').value;
            aboutData.image = document.getElementById('a_image_val').value;
        }

        function renderContactsAdmin() {
            document.getElementById('c_phone').value = contactsData.phone || '';
            document.getElementById('c_email').value = contactsData.email || '';
            document.getElementById('c_requisites').value = contactsData.requisites || '';
        }

        function saveContactsStateToMemory() {
            contactsData.phone = document.getElementById('c_phone').value;
            contactsData.email = document.getElementById('c_email').value;
            contactsData.requisites = document.getElementById('c_requisites').value;
        }

        function saveConsultingStateToMemory() {
            consultingData.categoryColor = document.getElementById('c_category_color').value;

            consultingData.authors.forEach((author, index) => {
                author.avatarText = document.getElementById(`c_author_avatar_${index}`).value;
                author.avatarUrl = document.getElementById(`c_author_avatarUrl_${index}`).value;
                author.name = document.getElementById(`c_author_name_${index}`).value;
                author.phone = document.getElementById(`c_author_phone_${index}`).value;
                author.email = document.getElementById(`c_author_email_${index}`).value;
            });

            consultingData.services.forEach((service, index) => {
                service.title = document.getElementById(`c_service_title_${index}`).value;
                service.category = document.getElementById(`c_service_category_${index}`).value;
                service.highlight = document.getElementById(`c_service_highlight_${index}`).value;
                service.benefits = document.getElementById(`c_service_benefits_${index}`).value;
                service.disclaimer = document.getElementById(`c_service_disclaimer_${index}`).value;
                // Add an ID if it's new
                if (!service.id) service.id = 'service_' + Date.now() + Math.floor(Math.random() * 1000);
            });
        }

        window.removeConsultingService = function (index) {
            if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
                saveConsultingStateToMemory();
                consultingData.services.splice(index, 1);
                renderConsultingAdmin();
            }
        };

        const btnAddConsultingService = document.getElementById('btnAddConsultingService');
        if (btnAddConsultingService) {
            btnAddConsultingService.addEventListener('click', () => {
                saveConsultingStateToMemory();
                consultingData.services.push({
                    id: 'service_' + Date.now(),
                    title: 'Новая услуга',
                    highlight: '',
                    benefits: '',
                    disclaimer: ''
                });
                renderConsultingAdmin();
                // scroll to bottom of services
                setTimeout(() => {
                    const block = document.getElementById('consultingServicesAdmin');
                    block.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 100);
            });
        }

        // Global Cropper logic is handled in the unified block (lines 1138-1265)

        function isImageDataUrl(value) {
            return typeof value === 'string' && /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value);
        }

        async function uploadDataUrlImage(dataUrl, slot, maxWidth, maxHeight) {
            const response = await fetch('api/upload.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dataUrl, slot, maxWidth, maxHeight })
            });
            const raw = await response.text();
            let payload = null;
            try {
                payload = raw ? JSON.parse(raw) : null;
            } catch (e) {
                throw new Error(`Ошибка загрузки медиа (HTTP ${response.status})`);
            }
            if (!response.ok || !payload?.success || !payload?.url) {
                throw new Error(payload?.error || 'Не удалось загрузить изображение');
            }
            return payload.url;
        }

        async function replaceMainPageBase64WithUploads(data) {
            const cache = new Map();
            const uploadOrReuse = (src, slot, maxWidth, maxHeight) => {
                if (!isImageDataUrl(src)) return Promise.resolve(src);
                const key = `${slot}:${src.slice(0, 64)}:${src.length}`;
                if (!cache.has(key)) {
                    cache.set(key, uploadDataUrlImage(src, slot, maxWidth, maxHeight));
                }
                return cache.get(key);
            };

            if (Array.isArray(data.heroSlides)) {
                for (let i = 0; i < data.heroSlides.length; i++) {
                    const slide = data.heroSlides[i];
                    if (!slide) continue;
                    slide.background = await uploadOrReuse(slide.background, `hero_${i}`, 1520, 420);
                }
            }

            if (Array.isArray(data.serviceCards)) {
                for (let i = 0; i < data.serviceCards.length; i++) {
                    const card = data.serviceCards[i];
                    if (!card) continue;
                    card.icon = await uploadOrReuse(card.icon, `service_icon_${i}`, 400, 400);
                }
            }

            if (data.promoBanner) {
                data.promoBanner.image = await uploadOrReuse(data.promoBanner.image, 'promo_banner', 1520, 253);
            }

            if (Array.isArray(data.partners)) {
                for (let i = 0; i < data.partners.length; i++) {
                    const partner = data.partners[i];
                    if (!partner) continue;
                    partner.image = await uploadOrReuse(partner.image, `partner_${i}`, 400, 400);
                }
            }

            if (data.consultation && Array.isArray(data.consultation.photos)) {
                for (let i = 0; i < data.consultation.photos.length; i++) {
                    data.consultation.photos[i] = await uploadOrReuse(
                        data.consultation.photos[i],
                        `consult_photo_${i}`,
                        396,
                        509
                    );
                }
            }

            return data;
        }

        async function replaceEcpBase64WithUploads(data) {
            const cache = new Map();
            const uploadOrReuse = (src, slot, maxWidth, maxHeight) => {
                if (!isImageDataUrl(src)) return Promise.resolve(src);
                const key = `${slot}:${src.slice(0, 64)}:${src.length}`;
                if (!cache.has(key)) {
                    cache.set(key, uploadDataUrlImage(src, slot, maxWidth, maxHeight));
                }
                return cache.get(key);
            };

            if (data.hero) {
                data.hero.background = await uploadOrReuse(data.hero.background, 'ecp_hero_bg', 1520, 420);
            }

            if (data.blanks) {
                data.blanks.patternImage = await uploadOrReuse(data.blanks.patternImage, 'ecp_blanks_pattern', 400, 480);
            }

            if (data.manual) {
                data.manual.bookImage = await uploadOrReuse(data.manual.bookImage, 'ecp_manual_book', 396, 509);
            }

            if (data.support) {
                data.support.background = await uploadOrReuse(
                    data.support.background,
                    'ecp_support_bg',
                    1520,
                    435
                );
            }

            if (Array.isArray(data.videos)) {
                for (let i = 0; i < data.videos.length; i++) {
                    const video = data.videos[i];
                    if (!video) continue;
                    video.thumbnail = await uploadOrReuse(video.thumbnail, `ecp_video_thumb_${i}`, 474, 290);
                }
            }

            return data;
        }

        async function replaceConsultingBase64WithUploads(data) {
            const cache = new Map();
            const uploadOrReuse = (src, slot, maxWidth, maxHeight) => {
                if (!isImageDataUrl(src)) return Promise.resolve(src);
                const key = `${slot}:${src.slice(0, 64)}:${src.length}`;
                if (!cache.has(key)) {
                    cache.set(key, uploadDataUrlImage(src, slot, maxWidth, maxHeight));
                }
                return cache.get(key);
            };

            if (data.hero) {
                data.hero.background = await uploadOrReuse(data.hero.background, 'consulting_hero_bg', 1520, 420);
                data.hero.graphic = await uploadOrReuse(data.hero.graphic, 'consulting_hero_graphic', 420, 420);
            }

            if (data.whyUs?.photo) {
                data.whyUs.photo.image = await uploadOrReuse(
                    data.whyUs.photo.image,
                    'consulting_why_photo',
                    494,
                    329
                );
            }

            if (data.whyUs?.side) {
                data.whyUs.side.image = await uploadOrReuse(
                    data.whyUs.side.image,
                    'consulting_why_side_image',
                    978,
                    1526
                );
            }

            if (Array.isArray(data.competencies)) {
                for (let i = 0; i < data.competencies.length; i++) {
                    const item = data.competencies[i];
                    if (!item) continue;
                    item.icon = await uploadOrReuse(item.icon, `consulting_comp_icon_${i}`, 109, 110);
                }
            }

            return data;
        }

        async function replaceSupportBase64WithUploads(data) {
            const cache = new Map();
            const uploadOrReuse = (src, slot, maxWidth, maxHeight) => {
                if (!isImageDataUrl(src)) return Promise.resolve(src);
                const key = `${slot}:${src.slice(0, 64)}:${src.length}`;
                if (!cache.has(key)) {
                    cache.set(key, uploadDataUrlImage(src, slot, maxWidth, maxHeight));
                }
                return cache.get(key);
            };

            if (data.hero) {
                data.hero.background = await uploadOrReuse(data.hero.background, 'support_hero_bg', 1520, 420);
            }

            if (data.calculator) {
                data.calculator.image = await uploadOrReuse(data.calculator.image, 'support_calc_image', 845, 845);
            }

            if (Array.isArray(data.navCards)) {
                for (let i = 0; i < data.navCards.length; i++) {
                    const card = data.navCards[i];
                    if (!card) continue;
                    card.icon = await uploadOrReuse(card.icon, `support_nav_icon_${i}`, 122, 154);
                }
            }

            return data;
        }

        async function replaceKnowledgeBase64WithUploads(data) {
            const cache = new Map();
            const uploadOrReuse = (src, slot, maxWidth, maxHeight) => {
                if (!isImageDataUrl(src)) return Promise.resolve(src);
                const key = `${slot}:${src.slice(0, 64)}:${src.length}`;
                if (!cache.has(key)) {
                    cache.set(key, uploadDataUrlImage(src, slot, maxWidth, maxHeight));
                }
                return cache.get(key);
            };

            if (data.hero) {
                data.hero.background = await uploadOrReuse(data.hero.background, 'knowledge_hero_bg', 1520, 420);
            }

            return data;
        }

        async function replaceObuchenieBase64WithUploads(data) {
            const cache = new Map();
            const uploadOrReuse = (src, slot, maxWidth, maxHeight) => {
                if (!isImageDataUrl(src)) return Promise.resolve(src);
                const key = `${slot}:${src.slice(0, 64)}:${src.length}`;
                if (!cache.has(key)) {
                    cache.set(key, uploadDataUrlImage(src, slot, maxWidth, maxHeight));
                }
                return cache.get(key);
            };

            if (data.hero) {
                data.hero.background = await uploadOrReuse(data.hero.background, 'obuchenie_hero_bg', 1520, 420);
                data.hero.gavelImage = await uploadOrReuse(data.hero.gavelImage, 'obuchenie_hero_gavel', 420, 420);
            }

            if (data.calendar) {
                data.calendar.promoImage = await uploadOrReuse(data.calendar.promoImage, 'obuchenie_cal_promo_image', 800, 1183);
            }

            if (data.testingBanner) {
                data.testingBanner.image = await uploadOrReuse(data.testingBanner.image, 'obuchenie_testing_image', 3040, 870);
            }

            if (Array.isArray(data.navCards)) {
                for (let i = 0; i < data.navCards.length; i++) {
                    const card = data.navCards[i];
                    if (!card) continue;
                    card.icon = await uploadOrReuse(card.icon, `obuchenie_nav_icon_${i}`, 118, 149);
                }
            }

            return data;
        }

        document.getElementById('globalSaveBtn').addEventListener('click', async () => {
            const btn = document.getElementById('globalSaveBtn');
            const originalText = btn.innerText;

            try {
                let keyToSave = '';
                let dataToSave = null;

                if (currentTarget === 'consulting') {
                    saveConsultingStateToMemory();
                    keyToSave = 'crzrt_consulting_data';
                    dataToSave = consultingData;
                } else if (currentTarget === 'main-page') {
                    saveMainPageStateToMemory();
                    keyToSave = 'crzrt_main_page_data';
                    dataToSave = mainPageData;
                } else if (currentTarget === 'ecp-page') {
                    saveEcpPageStateToMemory();
                    keyToSave = 'crzrt_ecp_page_data';
                    dataToSave = ecpPageData;
                } else if (currentTarget === 'consulting-page') {
                    saveConsultingPageStateToMemory();
                    keyToSave = 'crzrt_consulting_page_data';
                    dataToSave = consultingPageData;
                } else if (currentTarget === 'support-page') {
                    saveSupportPageStateToMemory();
                    keyToSave = 'crzrt_support_page_data';
                    dataToSave = supportPageData;
                } else if (currentTarget === 'obuchenie-page') {
                    saveObucheniePageStateToMemory();
                    keyToSave = 'crzrt_obuchenie_page_data';
                    dataToSave = obucheniePageData;
                } else if (currentTarget === 'knowledge-page') {
                    saveKnowledgePageStateToMemory();
                    keyToSave = 'crzrt_knowledge_page_data';
                    dataToSave = knowledgePageData;
                } else if (currentTarget === 'about-us') {
                    saveAboutUsStateToMemory();
                    keyToSave = 'crzrt_about_data';
                    dataToSave = aboutData;
                } else if (currentTarget === 'contacts') {
                    saveContactsStateToMemory();
                    keyToSave = 'crzrt_contacts';
                    dataToSave = contactsData;
                } else if (currentTarget === 'users') {
                    alert('Для управления пользователями используйте специальный раздел API (в разработке)');
                    return;
                }

                if (!keyToSave) return;

                btn.innerText = 'Сохраняется...';
                btn.style.opacity = '0.8';
                btn.disabled = true;

                if (currentTarget === 'main-page') {
                    btn.innerText = 'Загрузка медиа...';
                    const snapshot = JSON.parse(JSON.stringify(dataToSave));
                    dataToSave = await replaceMainPageBase64WithUploads(snapshot);
                    mainPageData = dataToSave;
                    window.mainPageData = mainPageData;
                    renderMainPageAdmin();
                }

                if (currentTarget === 'ecp-page') {
                    btn.innerText = 'Загрузка медиа...';
                    const snapshot = JSON.parse(JSON.stringify(dataToSave));
                    dataToSave = await replaceEcpBase64WithUploads(snapshot);
                    ecpPageData = dataToSave;
                    window.ecpPageData = ecpPageData;
                    renderEcpPageAdmin();
                }

                if (currentTarget === 'consulting-page') {
                    btn.innerText = 'Загрузка медиа...';
                    const snapshot = JSON.parse(JSON.stringify(dataToSave));
                    dataToSave = await replaceConsultingBase64WithUploads(snapshot);
                    consultingPageData = dataToSave;
                    window.consultingPageData = consultingPageData;
                    renderConsultingPageAdmin();
                }

                if (currentTarget === 'support-page') {
                    btn.innerText = 'Загрузка медиа...';
                    const snapshot = JSON.parse(JSON.stringify(dataToSave));
                    dataToSave = await replaceSupportBase64WithUploads(snapshot);
                    supportPageData = dataToSave;
                    window.supportPageData = supportPageData;
                    renderSupportPageAdmin();
                }

                if (currentTarget === 'obuchenie-page') {
                    btn.innerText = 'Загрузка медиа...';
                    const snapshot = JSON.parse(JSON.stringify(dataToSave));
                    dataToSave = await replaceObuchenieBase64WithUploads(snapshot);
                    obucheniePageData = dataToSave;
                    window.obucheniePageData = obucheniePageData;
                    renderObucheniePageAdmin();
                }

                if (currentTarget === 'knowledge-page') {
                    btn.innerText = 'Загрузка медиа...';
                    const snapshot = JSON.parse(JSON.stringify(dataToSave));
                    dataToSave = await replaceKnowledgeBase64WithUploads(snapshot);
                    knowledgePageData = dataToSave;
                    window.knowledgePageData = knowledgePageData;
                    renderKnowledgePageAdmin();
                }

                btn.innerText = 'Сохраняется...';

                // Отправляем данные на Бэкенд
                const response = await fetch('api/settings.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: keyToSave, value: dataToSave })
                });

                const rawResponse = await response.text();
                let result = null;
                try {
                    result = rawResponse ? JSON.parse(rawResponse) : null;
                } catch (parseErr) {
                    throw new Error(
                        `Сервер вернул не-JSON ответ (HTTP ${response.status}). Обычно это из-за слишком большого изображения.`
                    );
                }

                if (!response.ok || !result?.success) {
                    throw new Error(result.error || 'Ошибка сервера');
                }

                try {
                    localStorage.setItem(keyToSave, JSON.stringify(dataToSave));
                } catch (storageErr) {
                    console.warn('localStorage backup failed', storageErr);
                }

                // Визуальный отклик об успехе
                btn.innerText = `Сохранено! (${(result.size / 1024).toFixed(1)} KB)`;
                btn.style.backgroundColor = '#34c759';
                btn.style.color = '#fff';
                btn.style.opacity = '1';

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 2000);

            } catch (e) {
                console.error("Storage error:", e);
                alert("Ошибка сохранения: " + e.message + "\nПроверьте формат/размер изображения и повторите.");
                btn.innerText = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
            }
        });

        // Initialize display
        checkAuth();