const fs = require('fs');

const coursesHtml = fs.readFileSync('courses.html', 'utf8');
const distanceHtml = fs.readFileSync('distance.html', 'utf8');
const obuchenieHtml = fs.readFileSync('obuchenie.html', 'utf8');

// Helper to extract course cards
function extractCards(html) {
    const cards = [];
    const regex = /<div class="course-full-card">([\s\S]*?)<\/div>(?=\s*<!-- Course |\s*<\/div>\s*<\/div>)/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        cards.push('<div class="course-full-card unified-course-card">' + match[1] + '</div>');
    }
    return cards;
}

const inPersonCards = extractCards(coursesHtml);
const distanceCards = extractCards(distanceHtml);

// Add categories to cards based on text content
function categorizeCard(cardHtml, format) {
    let cats = [format];
    if (cardHtml.includes('44-ФЗ')) cats.push('44fz');
    if (cardHtml.includes('223-ФЗ')) cats.push('223fz');
    if (cardHtml.includes('Поставщик')) cats.push('supplier');
    
    // Add data-category attribute
    return cardHtml.replace('class="course-full-card unified-course-card"', `class="course-full-card unified-course-card" data-category="${cats.join(' ')}"`);
}

const allCards = [
    ...inPersonCards.map(c => categorizeCard(c, 'offline')),
    ...distanceCards.map(c => categorizeCard(c, 'online'))
];

// Calendar HTML
const calendarHtml = `
        <!-- ═══════════ КАЛЕНДАРЬ КУРСОВ ═══════════ -->
        <section class="calendar-section" style="padding: 60px 0; border-top: 1px solid var(--card-border);">
            <div class="container">
                <p class="section-eyebrow">Интерактивный инструмент</p>
                <h2 class="section-heading" style="margin-bottom: 24px;">Календарь курсов</h2>
                <p style="color: var(--text-secondary); max-width: 600px; margin-bottom: 40px; line-height: 1.6;">
                    Наведите на месяц, чтобы увидеть расписание. Кликните по курсу для перехода к подробному описанию.
                </p>
                
                <div class="interactive-calendar" style="display: flex; gap: 20px; position: relative;">
                    <!-- Месяца (слева) -->
                    <div class="calendar-months" style="display: flex; flex-direction: column; gap: 8px; width: 220px; flex-shrink: 0;">
                        <button class="cal-month-btn active" data-month="march">Март 2026</button>
                        <button class="cal-month-btn" data-month="april">Апрель 2026</button>
                        <button class="cal-month-btn" data-month="may">Май 2026</button>
                        <button class="cal-month-btn" data-month="june">Июнь 2026</button>
                    </div>

                    <!-- Панель с курсами (справа) -->
                    <div class="calendar-panel" style="flex: 1; border: 1px solid var(--card-border); background: var(--card-bg); padding: 30px; position: relative; min-height: 350px;">
                        
                        <!-- Март -->
                        <div class="cal-content active" id="cal-march">
                            <h3 style="margin-bottom: 20px; font-size: 1.2rem;">Очное обучение</h3>
                            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px;">
                                <a href="courses.html" class="cal-course-item">
                                    <div class="cal-date">23 марта</div>
                                    <div class="cal-info">Повышение квалификации по 44-ФЗ (108 ак.ч.)</div>
                                </a>
                                <a href="courses.html" class="cal-course-item">
                                    <div class="cal-date">25 марта</div>
                                    <div class="cal-info">Повышение квалификации по 223-ФЗ (72 ак.ч.)</div>
                                </a>
                                <a href="courses.html" class="cal-course-item">
                                    <div class="cal-date">23 марта</div>
                                    <div class="cal-info">Спецпрограмма: 44-ФЗ + Весенняя Казань</div>
                                </a>
                            </div>

                            <h3 style="margin-bottom: 20px; font-size: 1.2rem;">Дистанционное обучение</h3>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <a href="distance.html" class="cal-course-item">
                                    <div class="cal-date">2 марта</div>
                                    <div class="cal-info">Повышение квалификации по 44-ФЗ (120 ак.ч.)</div>
                                </a>
                                <a href="distance.html" class="cal-course-item">
                                    <div class="cal-date">В любое время</div>
                                    <div class="cal-info">Специалист в сфере закупок по 44-ФЗ (256 ак.ч.)</div>
                                </a>
                            </div>
                        </div>

                        <!-- Апрель -->
                        <div class="cal-content" id="cal-april" style="display: none;">
                            <h3 style="margin-bottom: 20px; font-size: 1.2rem;">Очное обучение</h3>
                            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px;">
                                <a href="courses.html" class="cal-course-item">
                                    <div class="cal-date">10 апреля</div>
                                    <div class="cal-info">Прагматичный подход для поставщика (40 ак.ч.)</div>
                                </a>
                            </div>

                            <h3 style="margin-bottom: 20px; font-size: 1.2rem;">Дистанционное обучение</h3>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <a href="distance.html" class="cal-course-item">
                                    <div class="cal-date">6 апреля</div>
                                    <div class="cal-info">Повышение квалификации по 223-ФЗ (72 ак.ч.)</div>
                                </a>
                                <a href="distance.html" class="cal-course-item">
                                    <div class="cal-date">В любое время</div>
                                    <div class="cal-info">Специалист в сфере закупок по 44-ФЗ (256 ак.ч.)</div>
                                </a>
                            </div>
                        </div>

                        <!-- Май -->
                        <div class="cal-content" id="cal-may" style="display: none;">
                            <h3 style="margin-bottom: 20px; font-size: 1.2rem;">Очное обучение</h3>
                            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px;">
                                <a href="courses.html" class="cal-course-item">
                                    <div class="cal-date">11 мая</div>
                                    <div class="cal-info">Курс для поставщиков по 44-ФЗ / 223-ФЗ (40 ак.ч.)</div>
                                </a>
                                <a href="courses.html" class="cal-course-item">
                                    <div class="cal-date">18 мая</div>
                                    <div class="cal-info">Повышение квалификации по 44-ФЗ (108 ак.ч.)</div>
                                </a>
                            </div>
                        </div>

                        <!-- Июнь -->
                        <div class="cal-content" id="cal-june" style="display: none;">
                            <div style="text-align: center; color: var(--text-secondary); padding-top: 50px;">
                                <p>Расписание на июнь формируется.</p>
                                <p>Оставьте заявку, и мы уведомим вас о новых группах.</p>
                                <a href="#contacts" class="btn-secondary" style="margin-top: 20px; display: inline-block;">Уведомить меня</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
`;

const filterBarHtml = `
        <!-- ═══════════ ВСЕ КУРСЫ ═══════════ -->
        <section class="all-courses-section" style="padding: 60px 0; border-top: 1px solid var(--card-border);">
            <div class="container">
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; gap: 20px;">
                    <div>
                        <p class="section-eyebrow">Каталог</p>
                        <h2 class="section-heading" style="margin-bottom: 0;">Все учебные программы</h2>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px; color: var(--text-secondary); font-size: 0.9rem;">
                         <span>Сортировать:</span>
                         <select style="background: transparent; border: 1px solid var(--card-border); color: var(--text-primary); padding: 6px 12px; font-family: inherit;">
                             <option>по популярности</option>
                             <option>по алфавиту</option>
                         </select>
                    </div>
                </div>

                <!-- Filters -->
                <div class="filters-bar" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 30px;">
                    <button class="filter-btn active" data-filter="all">Все курсы</button>
                    <button class="filter-btn" data-filter="44fz">44-ФЗ</button>
                    <button class="filter-btn" data-filter="223fz">223-ФЗ</button>
                    <button class="filter-btn" data-filter="supplier">Поставщикам</button>
                    <button class="filter-btn" data-filter="offline">Очные</button>
                    <button class="filter-btn" data-filter="online">Дистанционные</button>
                </div>

                <div class="course-list">
`;

const newSectionHtml = calendarHtml + filterBarHtml + allCards.join('\\n\\n') + '\\n                </div>\\n            </div>\\n        </section>';

const newScriptHtml = `

        <script>
            // Calendar Hover Logic
            const monthBtns = document.querySelectorAll('.cal-month-btn');
            const calContents = document.querySelectorAll('.cal-content');
            
            monthBtns.forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    monthBtns.forEach(b => b.classList.remove('active'));
                    calContents.forEach(c => c.style.display = 'none');
                    
                    btn.classList.add('active');
                    document.getElementById('cal-' + btn.dataset.month).style.display = 'block';
                });
            });

            // Filter Logic
            const filterBtns = document.querySelectorAll('.filter-btn');
            const courseCards = document.querySelectorAll('.unified-course-card');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const filter = btn.dataset.filter;
                    
                    courseCards.forEach(card => {
                        if (filter === 'all') {
                            card.style.display = '';
                        } else {
                            if (card.dataset.category && card.dataset.category.includes(filter)) {
                                card.style.display = '';
                            } else {
                                card.style.display = 'none';
                            }
                        }
                    });
                });
            });
        </script>
`;

// Replace lines 807 to 1166 in obuchenie.html
// Let's use string split to be safe
const startIndex = obuchenieHtml.indexOf('<!-- ═══════════ ФОРМАТЫ ═══════════ -->');
const endIndex = obuchenieHtml.indexOf('<!-- ═══════════ CTA BANNER ═══════════ -->');

if (startIndex !== -1 && endIndex !== -1) {
    const finalHtml = obuchenieHtml.substring(0, startIndex) + newSectionHtml + newScriptHtml + '\\n\\n' + obuchenieHtml.substring(endIndex);
    fs.writeFileSync('obuchenie.html', finalHtml, 'utf8');
    console.log('Successfully updated obuchenie.html');
} else {
    console.log('Could not find replace markers');
}
