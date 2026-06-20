/**
 * Редактор страницы «Обучение» для admin.html
 */
(function () {
  const DEFAULT_OBUCHENIE_PAGE = window.ObuchenieContent?.OBUCHENIE_DEFAULTS || {
    hero: { background: '', title: '', subtitle: '', gavelImage: '' },
    navCards: [],
    courseSearch: { title: '', cta: '', phone: '', phoneDisplay: '', tags: [], showAllLabel: '' },
    calendar: { promoTitle: '', promoImage: '', allCoursesLink: '', courseDaysByMonth: {} },
    courseCards: [],
    testingBanner: { title: '', btnText: '', btnLink: '', image: '' }
  };

  function escapeAttr(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function migrateObucheniePageData(raw) {
    if (window.ObuchenieContent?.migrateObucheniePageData) {
      return window.ObuchenieContent.migrateObucheniePageData(raw);
    }
    return { ...DEFAULT_OBUCHENIE_PAGE, ...(raw || {}) };
  }

  function getMigratedData(data) {
    return migrateObucheniePageData(data || {});
  }

  function setImageUploadState(id, src) {
    const v = src ? String(src) : '';
    const prev = document.getElementById(`${id}_preview`);
    const val = document.getElementById(`${id}_val`);
    const clr = document.getElementById(`${id}_clear`);
    if (val) val.value = v;
    if (prev) {
      prev.src = v;
      if (!document.querySelector(`[data-upload-frame-for="${id}"]`)) {
        prev.style.display = v ? 'block' : 'none';
      }
    }
    const frame = document.querySelector(`[data-upload-frame-for="${id}"]`);
    if (frame) {
      frame.classList.toggle('hero-slide-frame--empty', !v);
    }
    if (clr) clr.style.display = v ? 'inline-flex' : 'none';
  }

  function heroBgUploadShell(id, label, sizeLabel = '1520×420') {
    return `
      <div class="form-group hero-slide-upload-group" style="margin-bottom:0;">
        <label>${label}</label>
        <div class="hero-slide-frame hero-slide-frame--empty" data-upload-frame-for="${id}">
          <span class="hero-slide-frame__empty">${sizeLabel}</span>
          <img id="${id}_preview" class="hero-slide-frame__img" src="" alt="">
        </div>
        <div class="hero-slide-upload-actions image-upload-mini" data-upload-id="${id}">
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminObuchenie.pickImage('${id}')">Загрузить</button>
          <button type="button" class="btn-delete" style="padding:8px 14px;font-size:0.85rem;display:none;" id="${id}_clear" onclick="AdminObuchenie.clearImage('${id}')">Удалить</button>
          <input type="hidden" id="${id}_val" value="">
        </div>
      </div>`;
  }

  function imageUploadHtml(id, label, hint) {
    return `
      <div class="form-group" style="margin-bottom:0;">
        <label>${label}</label>
        ${hint ? `<p style="color:var(--text-secondary);font-size:0.85rem;margin:-4px 0 8px;">${hint}</p>` : ''}
        <div class="image-upload-mini" data-upload-id="${id}">
          <img id="${id}_preview" src="" alt="" style="max-width:220px;max-height:160px;object-fit:contain;border-radius:8px;display:none;margin-bottom:8px;background:rgba(0,0,0,0.15);">
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminObuchenie.pickImage('${id}')">Загрузить</button>
          <button type="button" class="btn-delete" style="padding:8px 14px;margin-left:8px;font-size:0.85rem;display:none;" id="${id}_clear" onclick="AdminObuchenie.clearImage('${id}')">Удалить</button>
          <input type="hidden" id="${id}_val" value="">
        </div>
      </div>`;
  }

  function navIconUploadHtml(id) {
    return `
      <div class="form-group consulting-comp-admin-card__icon">
        <label>Иконка</label>
        <div class="image-upload-mini" data-upload-id="${id}">
          <img id="${id}_preview" class="consulting-comp-admin-card__icon-preview" src="" alt="">
          <div class="consulting-comp-admin-card__icon-actions">
            <button type="button" class="btn-save" onclick="AdminObuchenie.pickImage('${id}')">Загрузить</button>
            <button type="button" class="btn-delete consulting-comp-admin-card__icon-clear" style="display:none;" id="${id}_clear" onclick="AdminObuchenie.clearImage('${id}')">×</button>
          </div>
          <input type="hidden" id="${id}_val" value="">
        </div>
      </div>`;
  }

  function renderHeroAdmin(data) {
    const el = document.getElementById('obuchenieHeroAdmin');
    if (!el) return;
    const hero = getMigratedData(data).hero || {};
    el.innerHTML = `
      ${heroBgUploadShell('obuchenie_hero_bg', 'Готовый баннер (~1520×420 px)')}
      <div class="form-group" style="margin-top:20px;">
        <label>Заголовок (Enter — перенос строки)</label>
        <textarea class="form-control" id="obuchenie_hero_title" rows="2">${escapeAttr(hero.title)}</textarea>
      </div>
      <div class="form-group">
        <label>Подзаголовок</label>
        <textarea class="form-control" id="obuchenie_hero_subtitle" rows="3">${escapeAttr(hero.subtitle)}</textarea>
      </div>
      ${imageUploadHtml('obuchenie_hero_gavel', 'Изображение молотка (если нет готового баннера)', 'Показывается справа на стандартном баннере.')}
    `;
    setImageUploadState('obuchenie_hero_bg', hero.background);
    setImageUploadState('obuchenie_hero_gavel', hero.gavelImage);
  }

  function renderNavCardsAdmin(data) {
    const el = document.getElementById('obuchenieNavCardsAdmin');
    if (!el) return;
    const cards = getMigratedData(data).navCards || [];
    el.innerHTML = cards
      .map(
        (card, i) => `
      <div class="admin-subcard" style="margin-bottom:16px;padding:16px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <strong>Карточка ${i + 1}</strong>
        </div>
        ${navIconUploadHtml(`obuchenie_nav_icon_${i}`)}
        <div class="form-group">
          <label>Надпись (Enter — перенос)</label>
          <textarea class="form-control" id="obuchenie_nav_label_${i}" rows="2">${escapeAttr(card.label)}</textarea>
        </div>
        <div class="form-group">
          <label>Ссылка (якорь или URL)</label>
          <input type="text" class="form-control" id="obuchenie_nav_href_${i}" value="${escapeAttr(card.href)}">
        </div>
      </div>`
      )
      .join('');
    cards.forEach((card, i) => setImageUploadState(`obuchenie_nav_icon_${i}`, card.icon));
  }

  function renderCourseSearchAdmin(data) {
    const el = document.getElementById('obuchenieCourseSearchAdmin');
    if (!el) return;
    const search = getMigratedData(data).courseSearch || {};
    const tagsText = Array.isArray(search.tags) ? search.tags.join('\n') : '';
    el.innerHTML = `
      <div class="form-group">
        <label>Заголовок секции</label>
        <input type="text" class="form-control" id="obuchenie_search_title" value="${escapeAttr(search.title)}">
      </div>
      <div class="form-group">
        <label>Текст призыва</label>
        <input type="text" class="form-control" id="obuchenie_search_cta" value="${escapeAttr(search.cta)}">
      </div>
      <div class="form-group">
        <label>Телефон (только цифры, для tel:)</label>
        <input type="text" class="form-control" id="obuchenie_search_phone" value="${escapeAttr(search.phone)}">
      </div>
      <div class="form-group">
        <label>Телефон (отображение)</label>
        <input type="text" class="form-control" id="obuchenie_search_phone_display" value="${escapeAttr(search.phoneDisplay)}">
      </div>
      <div class="form-group">
        <label>Теги (каждый с новой строки, по 7 в ряд)</label>
        <textarea class="form-control" id="obuchenie_search_tags" rows="8">${escapeAttr(tagsText)}</textarea>
      </div>
      <div class="form-group">
        <label>Текст кнопки «Показать все»</label>
        <input type="text" class="form-control" id="obuchenie_search_show_all" value="${escapeAttr(search.showAllLabel)}">
      </div>`;
  }

  function courseDayRowHtml(entry, i) {
    const parts = String(entry.key || '').split('-');
    const year = parts[0] || '';
    const month = parts[1] || '';
    const days = Array.isArray(entry.days) ? entry.days.join(', ') : '';
    return `
      <div class="admin-subcard" style="margin-bottom:16px;padding:16px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <strong>Месяц ${i + 1}</strong>
          <button type="button" class="btn-delete" style="padding:6px 12px;font-size:0.8rem;" onclick="AdminObuchenie.removeCourseMonth(${i})">Удалить</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 2fr;gap:12px;">
          <div class="form-group" style="margin:0;">
            <label>Год</label>
            <input type="number" class="form-control" id="obuchenie_cal_year_${i}" value="${escapeAttr(year)}" min="2020" max="2099">
          </div>
          <div class="form-group" style="margin:0;">
            <label>Месяц (1–12)</label>
            <input type="number" class="form-control" id="obuchenie_cal_month_${i}" value="${escapeAttr(month)}" min="1" max="12">
          </div>
          <div class="form-group" style="margin:0;">
            <label>Дни с курсами (через запятую)</label>
            <input type="text" class="form-control" id="obuchenie_cal_days_${i}" value="${escapeAttr(days)}" placeholder="3, 10, 17, 24">
          </div>
        </div>
      </div>`;
  }

  function courseDaysToEntries(courseDaysByMonth) {
    return Object.keys(courseDaysByMonth || {})
      .sort()
      .map((key) => ({ key, days: courseDaysByMonth[key] }));
  }

  function renderCalendarAdmin(data) {
    const el = document.getElementById('obuchenieCalendarAdmin');
    if (!el) return;
    const calendar = getMigratedData(data).calendar || {};
    const entries = courseDaysToEntries(calendar.courseDaysByMonth);
    el.innerHTML = `
      <div class="form-group">
        <label>Заголовок промо-блока</label>
        <input type="text" class="form-control" id="obuchenie_cal_promo_title" value="${escapeAttr(calendar.promoTitle)}">
      </div>
      ${imageUploadHtml('obuchenie_cal_promo_image', 'Изображение промо-блока', 'Рекомендуемый размер ~320×320 px.')}
      <div class="form-group">
        <label>Ссылка «все курсы»</label>
        <input type="text" class="form-control" id="obuchenie_cal_all_link" value="${escapeAttr(calendar.allCoursesLink)}">
      </div>
      <h4 style="margin:24px 0 12px;font-size:0.95rem;">Дни с курсами в календаре</h4>
      <p style="color:var(--text-secondary);margin:-8px 0 16px;font-size:0.9rem;">Укажите год, месяц и числа — они подсветятся зелёным в календаре.</p>
      <div id="obuchenieCalendarMonthsAdmin">${entries.map((entry, i) => courseDayRowHtml(entry, i)).join('')}</div>`;
    setImageUploadState('obuchenie_cal_promo_image', calendar.promoImage);
  }

  function courseCardHtml(item, i) {
    return `
      <div class="admin-subcard" style="margin-bottom:16px;padding:16px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <strong>Курс ${i + 1}</strong>
          <button type="button" class="btn-delete" style="padding:6px 12px;font-size:0.8rem;" onclick="AdminObuchenie.removeCourseCard(${i})">Удалить</button>
        </div>
        <div class="form-group">
          <label>Название</label>
          <input type="text" class="form-control" id="obuchenie_course_title_${i}" value="${escapeAttr(item.title)}">
        </div>
        <div class="form-group">
          <label>Цена</label>
          <input type="text" class="form-control" id="obuchenie_course_price_${i}" value="${escapeAttr(item.price)}">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group" style="margin:0;">
            <label>Длительность (число)</label>
            <input type="text" class="form-control" id="obuchenie_course_duration_num_${i}" value="${escapeAttr(item.durationNum)}">
          </div>
          <div class="form-group" style="margin:0;">
            <label>Длительность (единица)</label>
            <input type="text" class="form-control" id="obuchenie_course_duration_unit_${i}" value="${escapeAttr(item.durationUnit)}">
          </div>
          <div class="form-group" style="margin:0;">
            <label>График (число)</label>
            <input type="text" class="form-control" id="obuchenie_course_schedule_num_${i}" value="${escapeAttr(item.scheduleNum)}">
          </div>
          <div class="form-group" style="margin:0;">
            <label>График (единица)</label>
            <input type="text" class="form-control" id="obuchenie_course_schedule_unit_${i}" value="${escapeAttr(item.scheduleUnit)}">
          </div>
        </div>
        <div class="form-group" style="margin-top:12px;">
          <label>Текст кнопки</label>
          <input type="text" class="form-control" id="obuchenie_course_btn_text_${i}" value="${escapeAttr(item.btnText)}">
        </div>
        <div class="form-group">
          <label>Ссылка кнопки</label>
          <input type="text" class="form-control" id="obuchenie_course_btn_link_${i}" value="${escapeAttr(item.btnLink)}">
        </div>
        <div class="form-group">
          <label>Ссылка «подробнее»</label>
          <input type="text" class="form-control" id="obuchenie_course_more_link_${i}" value="${escapeAttr(item.moreLink)}">
        </div>
      </div>`;
  }

  function renderCourseCardsAdmin(data) {
    const el = document.getElementById('obuchenieCourseCardsAdmin');
    if (!el) return;
    const cards = getMigratedData(data).courseCards || [];
    el.innerHTML = cards.map((item, i) => courseCardHtml(item, i)).join('');
  }

  function renderTestingAdmin(data) {
    const el = document.getElementById('obuchenieTestingAdmin');
    if (!el) return;
    const banner = getMigratedData(data).testingBanner || {};
    el.innerHTML = `
      <div class="form-group">
        <label>Заголовок (Enter — перенос)</label>
        <textarea class="form-control" id="obuchenie_testing_title" rows="2">${escapeAttr(banner.title)}</textarea>
      </div>
      <div class="form-group">
        <label>Текст кнопки</label>
        <input type="text" class="form-control" id="obuchenie_testing_btn_text" value="${escapeAttr(banner.btnText)}">
      </div>
      <div class="form-group">
        <label>Ссылка кнопки</label>
        <input type="text" class="form-control" id="obuchenie_testing_btn_link" value="${escapeAttr(banner.btnLink)}">
      </div>
      ${imageUploadHtml('obuchenie_testing_image', 'Изображение справа (необязательно)', '')}
    `;
    setImageUploadState('obuchenie_testing_image', banner.image);
  }

  function renderObucheniePageAdmin(data) {
    const migrated = getMigratedData(data);
    renderHeroAdmin(migrated);
    renderNavCardsAdmin(migrated);
    renderCourseSearchAdmin(migrated);
    renderCalendarAdmin(migrated);
    renderCourseCardsAdmin(migrated);
    renderTestingAdmin(migrated);
  }

  function readImageVal(id) {
    return document.getElementById(`${id}_val`)?.value || '';
  }

  function collectCourseDaysFromForm() {
    const result = {};
    const count = document.querySelectorAll('[id^="obuchenie_cal_year_"]').length;
    for (let i = 0; i < count; i++) {
      const year = document.getElementById(`obuchenie_cal_year_${i}`)?.value?.trim();
      const month = document.getElementById(`obuchenie_cal_month_${i}`)?.value?.trim();
      const daysRaw = document.getElementById(`obuchenie_cal_days_${i}`)?.value || '';
      if (!year || !month) continue;
      const days = daysRaw
        .split(/[,;\s]+/)
        .map((day) => parseInt(day, 10))
        .filter((day) => Number.isFinite(day) && day >= 1 && day <= 31);
      if (days.length) {
        result[`${year}-${parseInt(month, 10)}`] = days;
      }
    }
    return result;
  }

  function collectObucheniePageFromForm(existing) {
    const data = getMigratedData(existing || window.obucheniePageData || {});

    data.hero = {
      background: readImageVal('obuchenie_hero_bg') || data.hero?.background || '',
      title: document.getElementById('obuchenie_hero_title')?.value ?? data.hero?.title ?? '',
      subtitle: document.getElementById('obuchenie_hero_subtitle')?.value ?? data.hero?.subtitle ?? '',
      gavelImage: readImageVal('obuchenie_hero_gavel') || data.hero?.gavelImage || ''
    };

    data.navCards = [];
    const navCount = document.querySelectorAll('[id^="obuchenie_nav_label_"]').length;
    for (let i = 0; i < navCount; i++) {
      data.navCards.push({
        label: document.getElementById(`obuchenie_nav_label_${i}`)?.value || '',
        href: document.getElementById(`obuchenie_nav_href_${i}`)?.value || '#',
        icon: readImageVal(`obuchenie_nav_icon_${i}`) || data.navCards?.[i]?.icon || ''
      });
    }

    const tagsRaw = document.getElementById('obuchenie_search_tags')?.value || '';
    data.courseSearch = {
      title: document.getElementById('obuchenie_search_title')?.value ?? data.courseSearch?.title ?? '',
      cta: document.getElementById('obuchenie_search_cta')?.value ?? data.courseSearch?.cta ?? '',
      phone: document.getElementById('obuchenie_search_phone')?.value ?? data.courseSearch?.phone ?? '',
      phoneDisplay: document.getElementById('obuchenie_search_phone_display')?.value ?? data.courseSearch?.phoneDisplay ?? '',
      tags: tagsRaw.split('\n').map((tag) => tag.trim()).filter(Boolean),
      showAllLabel: document.getElementById('obuchenie_search_show_all')?.value ?? data.courseSearch?.showAllLabel ?? ''
    };

    data.calendar = {
      promoTitle: document.getElementById('obuchenie_cal_promo_title')?.value ?? data.calendar?.promoTitle ?? '',
      promoImage: readImageVal('obuchenie_cal_promo_image') || data.calendar?.promoImage || '',
      allCoursesLink: document.getElementById('obuchenie_cal_all_link')?.value ?? data.calendar?.allCoursesLink ?? '#courses',
      courseDaysByMonth: collectCourseDaysFromForm()
    };

    data.courseCards = [];
    const cardCount = document.querySelectorAll('[id^="obuchenie_course_title_"]').length;
    for (let i = 0; i < cardCount; i++) {
      data.courseCards.push({
        title: document.getElementById(`obuchenie_course_title_${i}`)?.value || '',
        price: document.getElementById(`obuchenie_course_price_${i}`)?.value || '',
        durationNum: document.getElementById(`obuchenie_course_duration_num_${i}`)?.value || '',
        durationUnit: document.getElementById(`obuchenie_course_duration_unit_${i}`)?.value || '',
        scheduleNum: document.getElementById(`obuchenie_course_schedule_num_${i}`)?.value || '',
        scheduleUnit: document.getElementById(`obuchenie_course_schedule_unit_${i}`)?.value || '',
        btnText: document.getElementById(`obuchenie_course_btn_text_${i}`)?.value || 'Записаться',
        btnLink: document.getElementById(`obuchenie_course_btn_link_${i}`)?.value || '#contacts',
        moreLink: document.getElementById(`obuchenie_course_more_link_${i}`)?.value || '#courses'
      });
    }

    data.testingBanner = {
      title: document.getElementById('obuchenie_testing_title')?.value ?? data.testingBanner?.title ?? '',
      btnText: document.getElementById('obuchenie_testing_btn_text')?.value ?? data.testingBanner?.btnText ?? '',
      btnLink: document.getElementById('obuchenie_testing_btn_link')?.value ?? data.testingBanner?.btnLink ?? '#contacts',
      image: readImageVal('obuchenie_testing_image') || data.testingBanner?.image || ''
    };

    return data;
  }

  function pickImage(uploadId) {
    window.cropTarget = { uploadId, aspect: AdminObuchenie.getAspect(uploadId) };
    window.activeAuthorIndex = null;
    window.activeFeatureCardIndex = undefined;
    window.activeAboutImage = false;
    document.getElementById('imageInput')?.click();
  }

  function clearImage(uploadId) {
    setImageUploadState(uploadId, '');
  }

  function applyCroppedImage(uploadId, dataUrl) {
    if (uploadId && uploadId.startsWith('obuchenie_')) {
      setImageUploadState(uploadId, dataUrl);
    }
  }

  function getAspect(uploadId) {
    if (uploadId === 'obuchenie_hero_bg') return 1520 / 420;
    if (uploadId === 'obuchenie_hero_gavel') return 1;
    if (uploadId === 'obuchenie_cal_promo_image') return 1;
    if (uploadId === 'obuchenie_testing_image') return 4 / 3;
    if (uploadId.startsWith('obuchenie_nav_icon_')) return 118 / 149;
    return 16 / 9;
  }

  function getCropSize(uploadId) {
    if (uploadId === 'obuchenie_hero_bg') return [1520, 420];
    if (uploadId === 'obuchenie_hero_gavel') return [420, 420];
    if (uploadId === 'obuchenie_cal_promo_image') return [320, 320];
    if (uploadId === 'obuchenie_testing_image') return [600, 450];
    if (uploadId.startsWith('obuchenie_nav_icon_')) return [118, 149];
    return [1200, 675];
  }

  function isObuchenieUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('obuchenie_'));
  }

  window.AdminObuchenie = {
    DEFAULT_OBUCHENIE_PAGE,
    migrateObucheniePageData,
    renderObucheniePageAdmin,
    collectObucheniePageFromForm,
    setImageUploadState,
    pickImage,
    clearImage,
    applyCroppedImage,
    getAspect,
    getCropSize,
    isObuchenieUploadId,
    addCourseCard() {
      window.saveObucheniePageStateToMemory?.();
      window.obucheniePageData.courseCards.push({
        title: '',
        price: 'от 10 000 руб.',
        durationNum: '1,5',
        durationUnit: 'месяца',
        scheduleNum: '2',
        scheduleUnit: 'раза в неделю',
        btnText: 'Записаться',
        btnLink: '#contacts',
        moreLink: '#courses'
      });
      renderObucheniePageAdmin(window.obucheniePageData);
    },
    removeCourseCard(index) {
      window.saveObucheniePageStateToMemory?.();
      window.obucheniePageData.courseCards.splice(index, 1);
      renderObucheniePageAdmin(window.obucheniePageData);
    },
    addCourseMonth() {
      window.saveObucheniePageStateToMemory?.();
      const now = new Date();
      const key = `${now.getFullYear()}-${now.getMonth() + 1}`;
      window.obucheniePageData.calendar.courseDaysByMonth[key] = [];
      renderObucheniePageAdmin(window.obucheniePageData);
    },
    removeCourseMonth(index) {
      window.saveObucheniePageStateToMemory?.();
      const entries = courseDaysToEntries(window.obucheniePageData.calendar.courseDaysByMonth);
      const entry = entries[index];
      if (entry?.key) {
        delete window.obucheniePageData.calendar.courseDaysByMonth[entry.key];
      }
      renderObucheniePageAdmin(window.obucheniePageData);
    }
  };
})();
