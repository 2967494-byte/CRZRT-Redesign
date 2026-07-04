/**
 * Редактор страницы «Обучение» для admin.html
 */
(function () {
  const DEFAULT_OBUCHENIE_PAGE = window.ObuchenieContent?.OBUCHENIE_DEFAULTS || {
    hero: { background: '', title: '', subtitle: '', gavelImage: '', titleColor: '#00AE4D', subtitleColor: '#FFFFFF', titleTop: 68, titleLeft: 60, subtitleBottom: 40, subtitleLeft: 60 },
    navCards: [],
    courseSearch: { title: '', cta: '', phone: '', phoneDisplay: '', tags: [], showAllLabel: '', blocks: [] },
    calendar: { promoTitle: '', promoTitleColor: '', promoImage: '', allCoursesLink: '', courseDaysByMonth: {} },
    courseRegistry: [],
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
    if (window.AdminHeroSlides?.isHeroBgUploadId(id, 'obuchenie_hero')) {
      const match = id.match(/_bg_(\d+)$/);
      const idx = match ? parseInt(match[1], 10) : 0;
      setTimeout(() => {
        AdminHeroSlides.applySlidePreviewStyles(idx, obuchenieHeroSlidesConfig());
      }, 0);
    }
    if (id === 'obuchenie_testing_image') {
      setTimeout(() => window.AdminObuchenie?.updateTestingLivePreview?.(), 0);
    }
  }

  function heroBgUploadShell(id, label, sizeLabel = '1520×420') {
    return `
      <div class="form-group hero-slide-upload-group" style="margin-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <label style="margin-bottom:0;">${label}</label>
          <div class="hero-slide-upload-actions image-upload-mini" data-upload-id="${id}" style="display:flex; gap:8px;">
            <button type="button" class="btn-save" style="padding:6px 12px;font-size:0.8rem;" onclick="AdminObuchenie.pickImage('${id}')">Загрузить</button>
            <button type="button" class="btn-delete" style="padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;" id="${id}_clear" onclick="AdminObuchenie.clearImage('${id}')">Удалить</button>
            <input type="hidden" id="${id}_val" value="">
          </div>
        </div>
        <div class="hero-slide-frame hero-slide-frame--empty" data-upload-frame-for="${id}">
          <span class="hero-slide-frame__empty">${sizeLabel}</span>
          <img id="${id}_preview" class="hero-slide-frame__img" src="" alt="">
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

  function fileUploadRow(id, label, value, fileName) {
    const shownName = fileName || (value ? value.split('/').pop() : '');
    return `
      <div class="form-group" style="margin-bottom:0;">
        <label>${label}</label>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:8px;">
          <input type="text" class="form-control" id="${id}" value="${escapeAttr(value)}" placeholder="Ссылка или uploads/files/..." style="flex:1;min-width:200px;">
          <button type="button" class="btn-save" style="padding:10px 16px;font-size:0.92rem;border-radius:8px;" onclick="AdminObuchenie.pickFile('${id}')">Загрузить файл</button>
        </div>
        <small id="${id}_name" style="display:${shownName ? 'inline-block' : 'none'};color:var(--text-secondary);margin-top:8px;font-size:0.85rem;">${escapeAttr(shownName)}</small>
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

  function colorFieldHtml(id, label, value) {
    const color = /^#[0-9A-Fa-f]{6}$/.test(value || '') ? value : '#00AE4D';
    return `
      <div class="form-group">
        <label>${label}</label>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
          <input type="color" id="${id}_picker" value="${escapeAttr(color)}" style="width:48px;height:40px;padding:2px;border:1px solid rgba(255,255,255,0.15);border-radius:8px;cursor:pointer;background:transparent;" oninput="AdminObuchenie.syncColorField('${id}', this.value)">
          <input type="text" class="form-control" id="${id}" value="${escapeAttr(color)}" placeholder="#00AE4D" style="max-width:140px;font-family:monospace;" oninput="AdminObuchenie.syncColorField('${id}', this.value, true)">
        </div>
      </div>`;
  }

  function blockHeaderWithColorHtml(title, colorId, value, defaultColor = '#00AE4D', fontSize = '', fontWeight = '', italic = false, underline = false) {
    const color = /^#[0-9A-Fa-f]{6}$/.test(value || '') ? value : defaultColor;
    const sizeId = colorId.replace('_color', '_size');
    const weightId = colorId.replace('_color', '_weight');
    const italicId = colorId.replace('_color', '_italic');
    const underlineId = colorId.replace('_color', '_underline');
    return `
      <div class="obuchenie-block-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
        <span style="font-weight:600; font-size:0.95rem; color:var(--text-secondary);">${title}</span>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <input type="number" id="${sizeId}" value="${escapeAttr(fontSize)}" placeholder="px" title="Размер шрифта" style="width:55px; height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; text-align:center; margin-bottom:0;">
          <select id="${weightId}" title="Толщина шрифта" style="height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; cursor:pointer; margin-bottom:0;">
            <option value="" ${!fontWeight ? 'selected' : ''}>Толщина</option>
            <option value="300" ${fontWeight === '300' ? 'selected' : ''}>Тонкий</option>
            <option value="500" ${fontWeight === '500' ? 'selected' : ''}>Средний</option>
            <option value="700" ${fontWeight === '700' ? 'selected' : ''}>Толстый</option>
          </select>
          <label title="Курсив" style="display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:${italic ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'}; margin-bottom:0; font-style:italic; font-weight:bold; user-select:none; font-family:serif;">
            <input type="checkbox" id="${italicId}" ${italic ? 'checked' : ''} style="display:none;" onchange="this.parentElement.style.background = this.checked ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'">
            I
          </label>
          <label title="Подчеркнутый" style="display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:${underline ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'}; margin-bottom:0; text-decoration:underline; font-weight:bold; user-select:none; font-family:serif;">
            <input type="checkbox" id="${underlineId}" ${underline ? 'checked' : ''} style="display:none;" onchange="this.parentElement.style.background = this.checked ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'">
            U
          </label>
          <input type="color" id="${colorId}_picker" value="${escapeAttr(color)}" style="width:30px; height:30px; padding:0; border:none; border-radius:4px; cursor:pointer; background:transparent; margin-bottom:0;" oninput="AdminObuchenie.syncColorField('${colorId}', this.value)">
          <input type="text" class="form-control" id="${colorId}" value="${escapeAttr(color)}" placeholder="#00AE4D" style="max-width:90px; padding:4px 8px; font-size:0.85rem; font-family:monospace; margin-bottom:0;" oninput="AdminObuchenie.syncColorField('${colorId}', this.value, true)">
        </div>
      </div>`;
  }

  function obuchenieHeroSlidesConfig() {
    return {
      prefix: 'obuchenie_hero',
      removeHandler: 'AdminObuchenie.removeHeroSlide',
      pickHandler: 'AdminObuchenie.pickImage',
      clearHandler: 'AdminObuchenie.clearImage',
      subtitleUseBottom: true,
      previewClass: 'obuchenie-live-banner-preview',
      defaults: {
        titleColor: '#00AE4D',
        subtitleColor: '#FFFFFF',
        titleTop: 68,
        titleLeft: 60,
        subtitleBottom: 40,
        subtitleLeft: 60
      }
    };
  }

  function renderHeroAdmin(data) {
    const el = document.getElementById('obuchenieHeroAdmin');
    if (!el || !window.AdminHeroSlides) return;
    const migrated = getMigratedData(data);
    AdminHeroSlides.render(el, migrated.heroSlides || [], obuchenieHeroSlidesConfig(), setImageUploadState);
  }

  function navCardAdminHtml(prefix, card, i) {
    return `
      <div class="consulting-comp-admin-card">
        <div class="consulting-comp-admin-card__head">
          <strong>Карточка ${i + 1}</strong>
        </div>
        ${navIconUploadHtml(`${prefix}_nav_icon_${i}`)}
        <div class="form-group consulting-comp-admin-card__text">
          <label>Надпись (Enter — перенос)</label>
          <textarea class="form-control" id="${prefix}_nav_label_${i}" rows="2">${escapeAttr(card.label)}</textarea>
        </div>
        <div class="form-group consulting-comp-admin-card__link">
          <label>Ссылка (якорь или URL)</label>
          <input type="text" class="form-control" id="${prefix}_nav_href_${i}" value="${escapeAttr(card.href)}">
        </div>
      </div>`;
  }

  function renderNavCardsAdmin(data) {
    const el = document.getElementById('obuchenieNavCardsAdmin');
    if (!el) return;
    const cards = getMigratedData(data).navCards || [];
    el.innerHTML = `<div class="admin-nav-cards-grid">${cards.map((card, i) => navCardAdminHtml('obuchenie', card, i)).join('')}</div>`;
    cards.forEach((card, i) => setImageUploadState(`obuchenie_nav_icon_${i}`, card.icon));
  }

  function renderCourseSearchAdmin(data) {
    const el = document.getElementById('obuchenieCourseSearchAdmin');
    if (!el) return;
    const search = getMigratedData(data).courseSearch || {};

    if (data && !data._isInternalReRender) {
      window.obuchenieSearchBlocks = Array.isArray(search.blocks) ? JSON.parse(JSON.stringify(search.blocks)) : [];
      window.obuchenieSearchTags = Array.isArray(search.tags) ? JSON.parse(JSON.stringify(search.tags)) : [];
    }

    const blocks = window.obuchenieSearchBlocks || [];

    let blocksHtml = blocks.map((block, bIdx) => {
      const valuesHtml = Array.isArray(block.values)
        ? block.values
            .map((val, vIdx) => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--card-border); padding:6px 10px; border-radius:6px; margin-bottom:6px; font-size:0.9rem;">
                <span style="word-break: break-all;">${escapeAttr(val)}</span>
                <button type="button" class="btn-delete" style="padding:2px 6px; font-size:0.8rem; min-height:auto; margin-left:8px; line-height:1;" onclick="AdminObuchenie.deleteSearchBlockValue(${bIdx}, ${vIdx})">×</button>
              </div>`)
            .join('')
        : '';
        
      return `
        <div class="search-block-card" style="border: 1px solid var(--card-border); padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.02); display: flex; flex-direction: column; justify-content: space-between; min-height: 280px;">
          <div>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px;">
              <input type="text" class="form-control" value="${escapeAttr(block.title)}" placeholder="Название списка" style="margin-bottom: 0; font-weight: bold; font-size: 0.95rem; padding: 6px 10px;" oninput="AdminObuchenie.updateSearchBlockTitle(${bIdx}, this.value)">
              <button type="button" class="btn-delete" style="padding: 6px 10px; font-size: 0.85rem; min-height:auto;" onclick="AdminObuchenie.deleteSearchBlock(${bIdx})">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
            <div class="search-block-values" style="max-height: 180px; overflow-y: auto; margin-bottom: 12px; padding-right: 4px;">
              ${valuesHtml}
            </div>
          </div>
          <div style="display: flex; gap: 6px; margin-top: auto;">
            <input type="text" class="form-control" id="new_val_input_${bIdx}" placeholder="Новое значение" style="margin-bottom: 0; padding: 6px 10px; font-size: 0.85rem;" onkeydown="if(event.key==='Enter'){event.preventDefault(); AdminObuchenie.addSearchBlockValue(${bIdx});}">
            <button type="button" class="btn-save" style="padding: 6px 12px;" onclick="AdminObuchenie.addSearchBlockValue(${bIdx})">+</button>
          </div>
        </div>`;
    }).join('');

    const addBlockBtn = blocks.length < 4
      ? `<button type="button" class="btn-save" style="margin-top: 16px; width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; border: 1px dashed var(--accent-color); background: transparent; color: var(--accent-color); padding: 12px;" onclick="AdminObuchenie.addSearchBlock()">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
           Добавить колонку поиска
         </button>`
      : '';

    // Collect all unique non-empty filter values
    const allValues = [];
    blocks.forEach(block => {
      if (Array.isArray(block.values)) {
        block.values.forEach(val => {
          const trimmed = String(val || '').trim();
          if (trimmed && !allValues.includes(trimmed)) {
            allValues.push(trimmed);
          }
        });
      }
    });

    // Sync tags list to exclude deleted values
    window.obuchenieSearchTags = (window.obuchenieSearchTags || []).filter(t => allValues.includes(t));

    let tagsHtml = '';
    if (allValues.length > 0) {
      const checkboxes = allValues.map((val) => {
        const isChecked = window.obuchenieSearchTags.includes(val) ? 'checked' : '';
        return `
          <label style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px; border:1px solid var(--card-border); cursor:pointer; font-size:0.9rem; user-select:none; transition: background-color 0.2s;">
            <input type="checkbox" class="obuchenie-tag-checkbox" value="${escapeAttr(val)}" ${isChecked} style="width:16px; height:16px; margin:0; cursor:pointer;" onchange="AdminObuchenie.toggleTagCheckbox(this)">
            <span>${escapeAttr(val)}</span>
          </label>
        `;
      }).join('');

      tagsHtml = `
        <div style="margin-top:24px; border-top:1px solid var(--card-border); padding-top:20px;">
          <label style="font-weight:600; display:block; margin-bottom:12px; font-size:0.95rem; color:var(--text-secondary);">Отображаемые теги под поиском (выберите значения из справочников):</label>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            ${checkboxes}
          </div>
        </div>
      `;
    }

    el.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
        ${blocksHtml}
      </div>
      ${addBlockBtn}
      ${tagsHtml}`;
  }

  function getRegistryApi() {
    return window.ObuchenieContent || {};
  }

  function renderCalendarAdmin(data) {
    const el = document.getElementById('obuchenieCalendarAdmin');
    if (!el) return;
    const migrated = getMigratedData(data);
    const calendar = migrated.calendar || {};
    el.innerHTML = `
      <div class="obuchenie-hero-grid">
        <!-- Left: Promo Image -->
        <div class="obuchenie-hero-banner-col" style="margin-bottom:0;">
          ${imageUploadHtml('obuchenie_cal_promo_image', 'Изображение промо-блока', 'Рекомендуемый размер ~1200×1760 px')}
        </div>
        
        <!-- Right: Fields -->
        <div class="obuchenie-hero-fields-col" style="display:flex; flex-direction:column; gap:20px;">
          <div style="display:grid; grid-template-columns: 1fr 160px; gap:16px; align-items:start;">
            <div class="form-group" style="margin-bottom:0;">
              <label>Заголовок промо-блока (Enter — перенос строки)</label>
              <textarea class="form-control" id="obuchenie_cal_promo_title" rows="2" style="height: 80px; resize: vertical; margin-top:8px;">${escapeAttr(calendar.promoTitle)}</textarea>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label>Цвет заголовка</label>
              <div style="display:flex; gap:8px; align-items:center; height:44px; margin-top:8px;">
                <input type="color" id="obuchenie_cal_promo_title_color_picker" value="${escapeAttr(calendar.promoTitleColor || '#FFFFFF')}" style="width:38px; height:38px; padding:0; border:1px solid rgba(255,255,255,0.15); border-radius:8px; cursor:pointer; background:transparent;" oninput="AdminObuchenie.syncColorField('obuchenie_cal_promo_title_color', this.value)">
                <input type="text" class="form-control" id="obuchenie_cal_promo_title_color" value="${escapeAttr(calendar.promoTitleColor || '#FFFFFF')}" placeholder="#FFFFFF" style="width:90px; padding:6px 10px; font-family:monospace; font-size:0.85rem; margin-bottom:0;" oninput="AdminObuchenie.syncColorField('obuchenie_cal_promo_title_color', this.value, true)">
              </div>
            </div>
          </div>
          ${fileUploadRow('obuchenie_cal_all_link', 'Файл «Все курсы» (PDF/Doc/Zip)', calendar.allCoursesLink || '', calendar.allCoursesFileName || '')}
        </div>
      </div>`;
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
      <div class="obuchenie-hero-grid">
        <!-- Left: Banner upload & Preview -->
        <div class="obuchenie-hero-banner-col">
          ${heroBgUploadShell('obuchenie_testing_image', 'Фоновое изображение баннера (~1520×435 px)')}
          
          <div style="margin-top:20px;">
            <label style="font-weight:600; display:block; margin-bottom:8px; font-size:0.9rem; color:var(--text-secondary);">Предпросмотр готового баннера с наложенным текстом</label>
            <div class="ecp-live-banner-preview" id="obuchenie_testing_live_preview" style="height:120px; position:relative; background-size:cover; background-position:center; border-radius:12px; overflow:hidden;">
              <div class="live-banner-title" id="obuchenie_testing_live_title" style="top:25%; left:60px; position:absolute; font-size:16px;">${escapeAttr(banner.title)}</div>
              <div class="hero-btn" id="obuchenie_testing_live_btn" style="position:absolute; bottom:20%; left:60px; padding:6px 14px; background:#fff; color:#000; border-radius:8px; font-size:11px; pointer-events:none;">${escapeAttr(banner.btnText || 'Пройти тест')}</div>
            </div>
          </div>
        </div>
        
        <!-- Right: Fields -->
        <div class="obuchenie-hero-fields-col" style="display:flex; flex-direction:column; gap:20px;">
          <!-- Block "Заголовок" -->
          <div class="obuchenie-hero-block" style="border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);">
            ${blockHeaderWithColorHtml('Заголовок (Enter — перенос строки)', 'obuchenie_testing_title_color', banner.titleColor || '#ffffff', '#ffffff', banner.titleFontSize, banner.titleFontWeight, banner.titleItalic, banner.titleUnderline)}
            <div class="form-group" style="margin-bottom:0; margin-top:8px;">
              <textarea class="form-control" id="obuchenie_testing_title" rows="2" placeholder="Заголовок баннера (Enter — перенос строки)" oninput="AdminObuchenie.updateTestingLivePreview()">${escapeAttr(banner.title)}</textarea>
            </div>
            <div style="display:flex; gap:16px; margin-top:12px;">
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ сверху (px)</label>
                <input type="number" class="form-control" id="obuchenie_testing_title_top" value="${banner.titleTop !== undefined ? banner.titleTop : 68}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;" oninput="AdminObuchenie.updateTestingLivePreview()">
              </div>
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ слева (px)</label>
                <input type="number" class="form-control" id="obuchenie_testing_title_left" value="${banner.titleLeft !== undefined ? banner.titleLeft : 60}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;" oninput="AdminObuchenie.updateTestingLivePreview()">
              </div>
            </div>
          </div>
          
          <!-- Block "Кнопка" -->
          <div class="obuchenie-hero-block" style="border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);">
            <div style="font-weight:600; font-size:0.95rem; margin-bottom:12px;">Кнопка</div>
            <div class="form-group" style="margin-bottom:12px;">
              <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Текст кнопки</label>
              <input type="text" class="form-control" id="obuchenie_testing_btn_text" value="${escapeAttr(banner.btnText)}" placeholder="Например: Пройти тест" oninput="AdminObuchenie.updateTestingLivePreview()">
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Ссылка кнопки</label>
              <input type="text" class="form-control" id="obuchenie_testing_btn_link" value="${escapeAttr(banner.btnLink)}" placeholder="URL или #anchor">
            </div>
            <div style="display:flex; gap:16px;">
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ снизу (px)</label>
                <input type="number" class="form-control" id="obuchenie_testing_btn_bottom" value="${banner.btnBottom !== undefined ? banner.btnBottom : 65}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;" oninput="AdminObuchenie.updateTestingLivePreview()">
              </div>
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ слева (px)</label>
                <input type="number" class="form-control" id="obuchenie_testing_btn_left" value="${banner.btnLeft !== undefined ? banner.btnLeft : 60}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;" oninput="AdminObuchenie.updateTestingLivePreview()">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    setImageUploadState('obuchenie_testing_image', banner.image);
    setTimeout(() => {
      AdminObuchenie.updateTestingLivePreview();
      ['title_size', 'title_weight', 'title_italic', 'title_underline'].forEach((prop) => {
        const el = document.getElementById(`obuchenie_testing_${prop}`);
        if (el) {
          el.addEventListener('input', () => AdminObuchenie.updateTestingLivePreview());
          el.addEventListener('change', () => AdminObuchenie.updateTestingLivePreview());
        }
      });
    }, 50);
  }

  function renderObucheniePageAdmin(data) {
    const migrated = getMigratedData(data);
    renderHeroAdmin(migrated);
    renderNavCardsAdmin(migrated);
    renderCourseSearchAdmin(migrated);
    renderCalendarAdmin(migrated);
    renderTestingAdmin(migrated);
  }

  function readImageVal(id) {
    return document.getElementById(`${id}_val`)?.value || '';
  }

  function readColorVal(id, fallback) {
    const raw = document.getElementById(id)?.value?.trim() || '';
    if (/^#[0-9A-Fa-f]{6}$/.test(raw)) return raw.toUpperCase();
    if (/^[0-9A-Fa-f]{6}$/.test(raw)) return `#${raw.toUpperCase()}`;
    return fallback;
  }

  function previewMultilineHtml(text) {
    return String(text ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  function syncColorField(id, value, fromText) {
    const textEl = document.getElementById(id);
    const pickerEl = document.getElementById(`${id}_picker`);
    if (!textEl || !pickerEl) return;
    let normalized = String(value || '').trim();
    if (/^[0-9A-Fa-f]{6}$/.test(normalized)) normalized = `#${normalized}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(normalized)) {
      if (fromText) return;
      normalized = '#000000';
    }
    textEl.value = normalized.toUpperCase();
    pickerEl.value = normalized.toLowerCase();
    setTimeout(() => {
      if (String(id).startsWith('obuchenie_testing_')) {
        window.AdminObuchenie?.updateTestingLivePreview?.();
      } else if (window.AdminHeroSlides?.isHeroBgUploadId(id, 'obuchenie_hero')) {
        const match = id.match(/_bg_(\d+)$/);
        const idx = match ? parseInt(match[1], 10) : 0;
        AdminHeroSlides.applySlidePreviewStyles(idx, obuchenieHeroSlidesConfig());
      }
    }, 0);
  }

  function collectCourseDaysFromForm(courseRegistry) {
    const api = getRegistryApi();
    return api.deriveCourseDaysByMonth?.(courseRegistry || []) || {};
  }

  function collectObucheniePageFromForm(existing) {
    const data = getMigratedData(existing || window.obucheniePageData || {});

    data.heroSlides = window.AdminHeroSlides
      ? AdminHeroSlides.collect('obuchenie_hero', { subtitleUseBottom: true })
      : [];
    const firstSlide = data.heroSlides[0] || {};
    data.hero = {
      ...firstSlide,
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

    data.courseSearch = {
      title: data.courseSearch?.title || 'Поиск курсов',
      cta: data.courseSearch?.cta || 'Оставьте заявку, мы поможем',
      phone: data.courseSearch?.phone || '88001017892',
      phoneDisplay: data.courseSearch?.phoneDisplay || '8 800 101-78-92',
      tags: window.obuchenieSearchTags || data.courseSearch?.tags || [],
      showAllLabel: data.courseSearch?.showAllLabel || 'Показать все',
      blocks: window.obuchenieSearchBlocks || data.courseSearch?.blocks || []
    };

    data.courseRegistry = window.obucheniePageData?.courseRegistry || data.courseRegistry || [];

    data.calendar = {
      promoTitle: document.getElementById('obuchenie_cal_promo_title')?.value ?? data.calendar?.promoTitle ?? '',
      promoTitleColor: readColorVal('obuchenie_cal_promo_title_color', data.calendar?.promoTitleColor || '#FFFFFF'),
      promoImage: readImageVal('obuchenie_cal_promo_image') || data.calendar?.promoImage || '',
      allCoursesLink: document.getElementById('obuchenie_cal_all_link')?.value ?? data.calendar?.allCoursesLink ?? '',
      allCoursesFileName: document.getElementById('obuchenie_cal_all_link_name')?.textContent || '',
      courseDaysByMonth: collectCourseDaysFromForm(data.courseRegistry)
    };

    data.courseCards = [];

    data.testingBanner = {
      title: document.getElementById('obuchenie_testing_title')?.value ?? data.testingBanner?.title ?? '',
      titleColor: readColorVal('obuchenie_testing_title_color', data.testingBanner?.titleColor || '#FFFFFF'),
      titleTop: parseFloat(document.getElementById('obuchenie_testing_title_top')?.value) || 68,
      titleLeft: parseFloat(document.getElementById('obuchenie_testing_title_left')?.value) || 60,
      titleFontSize: document.getElementById('obuchenie_testing_title_size')?.value || '',
      titleFontWeight: document.getElementById('obuchenie_testing_title_weight')?.value || '',
      titleItalic: document.getElementById('obuchenie_testing_title_italic')?.checked || false,
      titleUnderline: document.getElementById('obuchenie_testing_title_underline')?.checked || false,
      btnText: document.getElementById('obuchenie_testing_btn_text')?.value ?? data.testingBanner?.btnText ?? '',
      btnLink: document.getElementById('obuchenie_testing_btn_link')?.value ?? data.testingBanner?.btnLink ?? '#contacts',
      btnBottom: parseFloat(document.getElementById('obuchenie_testing_btn_bottom')?.value) || 65,
      btnLeft: parseFloat(document.getElementById('obuchenie_testing_btn_left')?.value) || 60,
      image: readImageVal('obuchenie_testing_image') || data.testingBanner?.image || ''
    };

    return data;
  }

  function pickImage(uploadId) {
    const imageInput = document.getElementById('imageInput');
    if (imageInput) imageInput.value = '';
    window.cropTarget = { uploadId, aspect: AdminObuchenie.getAspect(uploadId) };
    window.activeAuthorIndex = null;
    window.activeFeatureCardIndex = undefined;
    window.activeAboutImage = false;
    imageInput?.click();
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
    if (uploadId === 'obuchenie_hero_bg' || uploadId?.startsWith('obuchenie_hero_bg_')) return 1520 / 420;
    if (uploadId === 'obuchenie_hero_gavel') return 1;
    if (uploadId === 'obuchenie_cal_promo_image') return 596 / 881;
    if (uploadId === 'obuchenie_testing_image') return 1520 / 435;
    if (uploadId.startsWith('obuchenie_nav_icon_')) return 118 / 149;
    return 16 / 9;
  }

  function getCropSize(uploadId) {
    if (uploadId === 'obuchenie_hero_bg' || uploadId?.startsWith('obuchenie_hero_bg_')) return [1520, 420];
    if (uploadId === 'obuchenie_hero_gavel') return [420, 420];
    if (uploadId === 'obuchenie_cal_promo_image') return [800, 1183];
    if (uploadId === 'obuchenie_testing_image') return [3040, 870];
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
    clearImage,
    updateSearchBlockTitle(bIdx, value) {
      if (window.obuchenieSearchBlocks && window.obuchenieSearchBlocks[bIdx]) {
        window.obuchenieSearchBlocks[bIdx].title = value;
      }
    },
    deleteSearchBlock(bIdx) {
      if (window.obuchenieSearchBlocks) {
        window.obuchenieSearchBlocks.splice(bIdx, 1);
        AdminObuchenie.renderCourseSearchAdmin({ courseSearch: { blocks: window.obuchenieSearchBlocks, tags: window.obuchenieSearchTags }, _isInternalReRender: true });
      }
    },
    addHeroSlide() {
      window.saveObucheniePageStateToMemory?.();
      const page = window.obucheniePageData || {};
      if (!page.heroSlides) page.heroSlides = [];
      if (page.heroSlides.length >= AdminHeroSlides.MAX) {
        alert(`Не более ${AdminHeroSlides.MAX} слайдов`);
        return;
      }
      page.heroSlides.push({ title: '', subtitle: '', background: '' });
      renderObucheniePageAdmin(page);
    },
    removeHeroSlide(i) {
      window.saveObucheniePageStateToMemory?.();
      const page = window.obucheniePageData || {};
      if (!page.heroSlides?.length) return;
      page.heroSlides.splice(i, 1);
      if (!page.heroSlides.length) page.heroSlides.push({ title: '', subtitle: '', background: '' });
      renderObucheniePageAdmin(page);
    },
    addSearchBlock() {
      if (window.obuchenieSearchBlocks && window.obuchenieSearchBlocks.length < 4) {
        window.obuchenieSearchBlocks.push({
          id: 'block_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          title: 'Новый фильтр',
          values: []
        });
        AdminObuchenie.renderCourseSearchAdmin({ courseSearch: { blocks: window.obuchenieSearchBlocks, tags: window.obuchenieSearchTags }, _isInternalReRender: true });
      }
    },
    deleteSearchBlockValue(bIdx, vIdx) {
      if (window.obuchenieSearchBlocks && window.obuchenieSearchBlocks[bIdx]) {
        window.obuchenieSearchBlocks[bIdx].values.splice(vIdx, 1);
        AdminObuchenie.renderCourseSearchAdmin({ courseSearch: { blocks: window.obuchenieSearchBlocks, tags: window.obuchenieSearchTags }, _isInternalReRender: true });
      }
    },
    addSearchBlockValue(bIdx) {
      const input = document.getElementById(`new_val_input_${bIdx}`);
      const val = input ? input.value.trim() : '';
      if (val && window.obuchenieSearchBlocks && window.obuchenieSearchBlocks[bIdx]) {
        if (!window.obuchenieSearchBlocks[bIdx].values.includes(val)) {
          window.obuchenieSearchBlocks[bIdx].values.push(val);
        }
        AdminObuchenie.renderCourseSearchAdmin({ courseSearch: { blocks: window.obuchenieSearchBlocks, tags: window.obuchenieSearchTags }, _isInternalReRender: true });
      }
    },
    toggleTagCheckbox(input) {
      const val = input.value;
      if (!window.obuchenieSearchTags) {
        window.obuchenieSearchTags = [];
      }
      if (input.checked) {
        if (!window.obuchenieSearchTags.includes(val)) {
          window.obuchenieSearchTags.push(val);
        }
      } else {
        const idx = window.obuchenieSearchTags.indexOf(val);
        if (idx !== -1) {
          window.obuchenieSearchTags.splice(idx, 1);
        }
      }
    },

    pickFile(inputId) {
      window.fileUploadTarget = inputId;
      document.getElementById('docFileInput')?.click();
    },
    setFileUploadState(inputId, url, name) {
      const input = document.getElementById(inputId);
      if (input) {
        input.value = url;
      }
      const nameEl = document.getElementById(`${inputId}_name`);
      if (nameEl) {
        nameEl.textContent = name || url.split('/').pop();
        nameEl.style.display = 'inline-block';
      }
    },
    applyCroppedImage,
    pickImage,
    getAspect,
    getCropSize,
    isObuchenieUploadId,
    syncColorField,
    updateTestingLivePreview() {
      const titleEl = document.getElementById('obuchenie_testing_live_title');
      const btnEl = document.getElementById('obuchenie_testing_live_btn');
      const previewEl = document.getElementById('obuchenie_testing_live_preview');
      if (!titleEl || !btnEl || !previewEl) return;

      const titleText = document.getElementById('obuchenie_testing_title')?.value || '';
      const btnText = document.getElementById('obuchenie_testing_btn_text')?.value || 'Пройти тест';
      const titleColor = readColorVal('obuchenie_testing_title_color', '#FFFFFF');
      const bgImage = document.getElementById('obuchenie_testing_image_val')?.value || '';
      const titleTop = parseFloat(document.getElementById('obuchenie_testing_title_top')?.value) || 68;
      const titleLeft = parseFloat(document.getElementById('obuchenie_testing_title_left')?.value) || 60;
      const btnBottom = parseFloat(document.getElementById('obuchenie_testing_btn_bottom')?.value) || 65;
      const btnLeft = parseFloat(document.getElementById('obuchenie_testing_btn_left')?.value) || 60;

      previewEl.style.backgroundImage = bgImage ? `url(${bgImage})` : '';
      previewEl.style.backgroundColor = bgImage ? 'transparent' : '';

      titleEl.innerHTML = previewMultilineHtml(titleText);
      titleEl.style.color = titleColor;
      titleEl.style.top = `calc((${titleTop} / 435) * 100%)`;
      titleEl.style.left = `calc((${titleLeft} / 1520) * 100%)`;
      titleEl.style.maxWidth = `calc(100% - ((${titleLeft} / 1520) * 100%) - 10px)`;

      const titleSize = document.getElementById('obuchenie_testing_title_size')?.value || '';
      const titleWeight = document.getElementById('obuchenie_testing_title_weight')?.value || '';
      const titleItalic = document.getElementById('obuchenie_testing_title_italic')?.checked || false;
      const titleUnderline = document.getElementById('obuchenie_testing_title_underline')?.checked || false;

      if (titleSize) titleEl.style.fontSize = `calc((${titleSize} / 1520) * 100cqw)`;
      else titleEl.style.removeProperty('font-size');
      if (titleWeight) titleEl.style.fontWeight = titleWeight;
      else titleEl.style.removeProperty('font-weight');
      titleEl.style.fontStyle = titleItalic ? 'italic' : '';
      titleEl.style.textDecoration = titleUnderline ? 'underline' : '';

      btnEl.textContent = btnText;
      btnEl.style.bottom = `calc((${btnBottom} / 435) * 100%)`;
      btnEl.style.left = `calc((${btnLeft} / 1520) * 100%)`;
      btnEl.style.top = 'auto';
    },
    updateLivePreview() {
      if (!window.AdminHeroSlides) return;
      const config = obuchenieHeroSlidesConfig();
      const count = document.querySelectorAll(`input[id^="obuchenie_hero_bg_"][id$="_val"]`).length;
      for (let i = 0; i < count; i++) {
        AdminHeroSlides.applySlidePreviewStyles(i, config);
      }
    },
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
    }
  };
})();
