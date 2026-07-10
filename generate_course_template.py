import re

with open('obuchenie.html', 'r', encoding='utf-8') as f:
    obuchenie_html = f.read()

# Extract head
head_match = re.search(r'(<head>.*?</head>)', obuchenie_html, re.DOTALL)
head = head_match.group(1)

# Modify head to include course.css
head = head.replace('<link rel="stylesheet" href="assets/css/obuchenie.css?v=56">',
                    '<link rel="stylesheet" href="assets/css/obuchenie.css?v=56">\n  <link rel="stylesheet" href="assets/css/course.css?v=1">')

# Extract header
header_match = re.search(r'(<!-- HEADER -->.*?)</header>', obuchenie_html, re.DOTALL)
header = header_match.group(1) + '</header>'

# Extract footer and modals
footer_match = re.search(r'(<footer class="footer">.*?</html>)', obuchenie_html, re.DOTALL)
footer = footer_match.group(1)

# Add course.js to scripts
footer = footer.replace('</body>', '<script src="assets/js/course.js?v=1" defer></script>\n</body>')

# Create the body content
course_content = """
<div class="course-page-wrapper">
  <!-- HERO SECTION -->
  <section class="course-hero">
    <div class="container course-hero__container">
      <div class="course-hero__breadcrumbs">
        <a href="index.html">Главная</a>
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <a href="obuchenie.html">Обучение</a>
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="current">Специалист в сфере закупок по 44-ФЗ</span>
      </div>
      
      <div class="course-hero__content">
        <div class="course-hero__text">
          <div class="course-hero__tags">
            <span class="course-tag">Дистанционно</span>
            <span class="course-tag">44-ФЗ</span>
            <span class="course-tag course-tag--accent">Для заказчиков</span>
          </div>
          <h1 class="course-hero__title">Специалист в сфере закупок по 44-ФЗ</h1>
          <p class="course-hero__desc">Комплексная программа повышения квалификации. Узнайте все нововведения законодательства и научитесь проводить закупки без нарушений и штрафов.</p>
          
          <div class="course-hero__actions">
            <button class="btn btn--green btn--large btn-enroll">Записаться на курс</button>
            <button class="btn btn--white-outline btn--large">Скачать программу (PDF)</button>
          </div>
        </div>
        
        <!-- Info Widget overlaying right side -->
        <div class="course-hero__widget">
          <div class="course-widget-item">
            <div class="course-widget-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div class="course-widget-item__text">
              <span class="course-widget-item__label">Длительность</span>
              <span class="course-widget-item__val">120 ак. часов</span>
            </div>
          </div>
          <div class="course-widget-item">
            <div class="course-widget-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <div class="course-widget-item__text">
              <span class="course-widget-item__label">Ближайший старт</span>
              <span class="course-widget-item__val">22 июля</span>
            </div>
          </div>
          <div class="course-widget-item">
            <div class="course-widget-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div class="course-widget-item__text">
              <span class="course-widget-item__label">Стоимость</span>
              <span class="course-widget-item__val course-widget-item__price">13 500 ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- NAVIGATION TABS (Sticky) -->
  <div class="course-nav-bar" id="courseNav">
    <div class="container">
      <nav class="course-nav">
        <a href="#about" class="course-nav__link active">О курсе</a>
        <a href="#audience" class="course-nav__link">Для кого</a>
        <a href="#program" class="course-nav__link">Программа</a>
        <a href="#experts" class="course-nav__link">Спикеры</a>
        <a href="#document" class="course-nav__link">Документ</a>
      </nav>
    </div>
  </div>

  <!-- ABOUT -->
  <section class="course-section course-about" id="about">
    <div class="container">
      <h2 class="course-section__title">О курсе</h2>
      <div class="course-about__grid">
        <div class="course-about__text">
          <p>Программа разработана с учетом последних изменений в законодательстве о контрактной системе. Мы даем не просто теорию, а разбираем реальные кейсы из практики заказчиков и контрольных органов Республики Татарстан.</p>
          <p>Обучение проходит на современной образовательной платформе с круглосуточным доступом к материалам. Вы можете учиться в удобное время без отрыва от производства.</p>
        </div>
        <div class="course-about__features">
          <div class="feature-item">
            <div class="feature-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#00AE4D" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <span>Актуальная нормативная база со всеми изменениями</span>
          </div>
          <div class="feature-item">
            <div class="feature-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#00AE4D" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <span>Помощь в решении сложных рабочих ситуаций во время обучения</span>
          </div>
          <div class="feature-item">
            <div class="feature-item__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#00AE4D" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            </div>
            <span>Доступ к материалам курса на 6 месяцев после окончания</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- AUDIENCE -->
  <section class="course-section course-audience bg-grey" id="audience">
    <div class="container">
      <h2 class="course-section__title">Кому подойдет курс</h2>
      <div class="course-audience__grid">
        <div class="audience-card">
          <div class="audience-card__icon">
            <img src="assets/img/obuchenie/icon-programs.png" alt="" width="60">
          </div>
          <h3 class="audience-card__title">Начинающим специалистам</h3>
          <p class="audience-card__desc">Кто только планирует работать в сфере госзакупок со стороны заказчика. Научитесь работать без ошибок с первого дня.</p>
        </div>
        <div class="audience-card">
          <div class="audience-card__icon">
            <img src="assets/img/obuchenie/icon-corporate.png" alt="" width="60">
          </div>
          <h3 class="audience-card__title">Контрактным управляющим</h3>
          <p class="audience-card__desc">Кому необходимо обновить знания и разобраться в последних поправках 44-ФЗ для минимизации рисков ФАС.</p>
        </div>
        <div class="audience-card">
          <div class="audience-card__icon">
            <img src="assets/img/obuchenie/icon-certificates.png" alt="" width="60">
          </div>
          <h3 class="audience-card__title">Руководителям учреждений</h3>
          <p class="audience-card__desc">Для контроля работы отдела закупок и понимания ответственности при подписании контрактов.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SYLLABUS -->
  <section class="course-section course-program" id="program">
    <div class="container">
      <div class="course-program__header">
        <h2 class="course-section__title">Программа обучения</h2>
        <a href="#" class="course-program__download">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Скачать PDF
        </a>
      </div>
      
      <div class="course-accordion">
        <div class="course-accordion__item">
          <button class="course-accordion__trigger">
            <span class="course-accordion__title">Модуль 1. Основы контрактной системы. Законодательная база.</span>
            <span class="course-accordion__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
          </button>
          <div class="course-accordion__content">
            <ul class="course-accordion__list">
              <li>Общие положения 44-ФЗ. Цели и принципы контрактной системы.</li>
              <li>Участники контрактной системы, их права и обязанности.</li>
              <li>Информационное обеспечение закупок (ЕИС).</li>
            </ul>
          </div>
        </div>

        <div class="course-accordion__item">
          <button class="course-accordion__trigger">
            <span class="course-accordion__title">Модуль 2. Планирование и обоснование закупок.</span>
            <span class="course-accordion__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
          </button>
          <div class="course-accordion__content">
            <ul class="course-accordion__list">
              <li>Порядок формирования, утверждения и ведения плана-графика.</li>
              <li>Обоснование начальной (максимальной) цены контракта.</li>
              <li>Описание объекта закупки. Использование КТРУ.</li>
            </ul>
          </div>
        </div>

        <div class="course-accordion__item">
          <button class="course-accordion__trigger">
            <span class="course-accordion__title">Модуль 3. Осуществление закупок. Способы определения поставщиков.</span>
            <span class="course-accordion__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
          </button>
          <div class="course-accordion__content">
            <ul class="course-accordion__list">
              <li>Электронный аукцион: порядок проведения, рассмотрение заявок.</li>
              <li>Открытый конкурс в электронной форме: критерии оценки.</li>
              <li>Запрос котировок в электронной форме.</li>
              <li>Закупка у единственного поставщика (электронный магазин).</li>
            </ul>
          </div>
        </div>
        
        <div class="course-accordion__item">
          <button class="course-accordion__trigger">
            <span class="course-accordion__title">Модуль 4. Государственные контракты. Контроль и аудит.</span>
            <span class="course-accordion__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
          </button>
          <div class="course-accordion__content">
            <ul class="course-accordion__list">
              <li>Заключение, изменение, расторжение контракта.</li>
              <li>Приемка товаров, работ, услуг (электронное актирование).</li>
              <li>Контроль в сфере закупок, обжалование действий заказчика.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- EXPERTS -->
  <section class="course-section course-experts bg-grey" id="experts">
    <div class="container">
      <h2 class="course-section__title">Эксперты курса</h2>
      <div class="course-experts__grid">
        <div class="expert-card">
          <div class="expert-card__img-wrap">
            <div class="expert-card__img-placeholder">
               <svg viewBox="0 0 24 24" fill="none" stroke="#ADB8C6" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
          </div>
          <h3 class="expert-card__name">Иванов Иван Иванович</h3>
          <p class="expert-card__role">Руководитель отдела образовательных программ</p>
          <p class="expert-card__desc">Опыт работы в закупках более 10 лет. Эксперт-практик по 44-ФЗ и 223-ФЗ.</p>
        </div>
        <div class="expert-card">
          <div class="expert-card__img-wrap">
            <div class="expert-card__img-placeholder">
               <svg viewBox="0 0 24 24" fill="none" stroke="#ADB8C6" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
          </div>
          <h3 class="expert-card__name">Петрова Анна Сергеевна</h3>
          <p class="expert-card__role">Ведущий юрисконсульт</p>
          <p class="expert-card__desc">Специалист по защите интересов заказчиков в ФАС России.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- DOCUMENT -->
  <section class="course-section course-document" id="document">
    <div class="container">
      <div class="course-doc-wrapper">
        <div class="course-doc-text">
          <h2 class="course-section__title">Выдаваемый документ</h2>
          <p class="course-doc-text__desc">По окончании курса и успешном прохождении итогового тестирования вы получите <strong>Удостоверение о повышении квалификации установленного образца</strong> (120 академических часов).</p>
          <ul class="course-doc-text__list">
            <li>Вносится в федеральный реестр ФИС ФРДО</li>
            <li>Действительно на всей территории РФ</li>
            <li>Отправляем оригинал Почтой России</li>
          </ul>
        </div>
        <div class="course-doc-img">
          <!-- Placeholder for certificate -->
          <div class="doc-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="#00AE4D" stroke-width="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span>Образец удостоверения</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA FOOTER SECTION -->
  <section class="course-section course-cta bg-purple">
    <div class="container">
      <div class="course-cta__inner">
        <div class="course-cta__text">
          <h2 class="course-cta__title">Готовы повысить свою квалификацию?</h2>
          <p class="course-cta__desc">Оставьте заявку на обучение прямо сейчас. Наш менеджер свяжется с вами для уточнения деталей.</p>
        </div>
        <div class="course-cta__form">
          <form class="consult-form" style="background: transparent; padding: 0;">
            <input type="text" class="form-input form-input--white" placeholder="Ваше имя" required>
            <input type="tel" class="form-input form-input--white" placeholder="Телефон" required>
            <button type="button" class="btn btn--green btn--large" style="width: 100%; margin-top: 10px;">Записаться</button>
            <label class="form-check" style="color: #fff; margin-top: 15px; font-size: 13px;">
              <input type="checkbox" required checked>
              <span>Согласен с политикой персональных данных</span>
            </label>
          </form>
        </div>
      </div>
    </div>
  </section>

</div>
"""

final_html = f"<!DOCTYPE html>\n<html lang=\"ru\">\n{head}\n<body class=\"theme-purple\" data-page=\"course\">\n{header}\n{course_content}\n{footer}"

with open('course-template.html', 'w', encoding='utf-8') as f:
    f.write(final_html)
print('Generated course-template.html')
