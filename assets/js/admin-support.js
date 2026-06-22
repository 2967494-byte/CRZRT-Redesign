/**
 * Редактор страницы «Сопровождение» для admin.html
 */
(function () {
  const DEFAULT_SUPPORT_PAGE = window.SupportContent?.SUPPORT_DEFAULTS || {
    hero: { 
      background: '', 
      title: '', titleColor: '#ffffff', titleTop: 122, titleLeft: 70,
      subtitle: '', subtitleColor: '#ffffff', subtitleTop: 213, subtitleLeft: 70 
    },
    navCards: [],
    customers: { title: '', services: [], checklist: { title: '', items: [] } },
    calculator: { title: '', image: '' },
    suppliers: { title: '', services: [], checklist: { title: '', items: [] } }
  };

  function escapeAttr(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function migrateSupportPageData(raw) {
    if (window.SupportContent?.migrateSupportPageData) {
      return window.SupportContent.migrateSupportPageData(raw);
    }
    return { ...DEFAULT_SUPPORT_PAGE, ...(raw || {}) };
  }

  function getMigratedData(data) {
    return migrateSupportPageData(data || {});
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

    if (id === 'support_hero_bg') {
        const livePreview = document.getElementById('support_hero_live_preview');
        if (livePreview) {
            if (v) {
                livePreview.style.backgroundImage = `url('${v}')`;
            } else {
                livePreview.style.backgroundImage = 'radial-gradient(32.3% 55.38% at 71.22% 54%, #FFFFFF 0%, #B8FDC6 100%)';
            }
        }
    }
  }

  function setFileUploadState(id, url, name) {
    const val = document.getElementById(id);
    const label = document.getElementById(`${id}_name`);
    if (val) val.value = url || '';
    if (label) {
      label.textContent = name || (url ? url.split('/').pop() : '');
      label.style.display = url ? 'inline' : 'none';
    }
  }

  function heroBgUploadShell(id, label, sizeLabel = '1520×420') {
    return `
      <div class="form-group hero-slide-upload-group" style="margin-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <label style="margin-bottom:0;">${label}</label>
          <div class="hero-slide-upload-actions image-upload-mini" data-upload-id="${id}" style="display:flex; gap:8px;">
            <button type="button" class="btn-save" style="padding:6px 12px;font-size:0.8rem;" onclick="AdminSupport.pickImage('${id}')">Загрузить</button>
            <button type="button" class="btn-delete" style="padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;" id="${id}_clear" onclick="AdminSupport.clearImage('${id}')">Удалить</button>
            <input type="hidden" id="${id}_val" value="">
          </div>
        </div>
        <div class="hero-slide-frame hero-slide-frame--empty" data-upload-frame-for="${id}">
          <span class="hero-slide-frame__empty">${sizeLabel}</span>
          <img id="${id}_preview" class="hero-slide-frame__img" src="" alt="">
        </div>
      </div>`;
  }

  function blockHeaderWithColorHtml(title, colorId, value, defaultColor = '#ffffff') {
    const color = /^#[0-9A-Fa-f]{6}$/.test(value || '') ? value : defaultColor;
    return `
      <div class="obuchenie-block-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:600; font-size:0.95rem; color:var(--text-secondary);">${title}</span>
        <div style="display:flex; gap:8px; align-items:center;">
          <input type="color" id="${colorId}_picker" value="${escapeAttr(color)}" style="width:30px; height:30px; padding:0; border:none; border-radius:4px; cursor:pointer; background:transparent;">
          <input type="text" class="form-control" id="${colorId}" value="${escapeAttr(color)}" placeholder="${defaultColor}" style="max-width:90px; padding:4px 8px; font-size:0.85rem; font-family:monospace; margin-bottom:0;">
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
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminSupport.pickImage('${id}')">Загрузить</button>
          <button type="button" class="btn-delete" style="padding:8px 14px;margin-left:8px;font-size:0.85rem;display:none;" id="${id}_clear" onclick="AdminSupport.clearImage('${id}')">Удалить</button>
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
            <button type="button" class="btn-save" onclick="AdminSupport.pickImage('${id}')">Загрузить</button>
            <button type="button" class="btn-delete consulting-comp-admin-card__icon-clear" style="display:none;" id="${id}_clear" onclick="AdminSupport.clearImage('${id}')">×</button>
          </div>
          <input type="hidden" id="${id}_val" value="">
        </div>
      </div>`;
  }

  function fileUploadRow(id, label, value, fileName) {
    const shownName = fileName || (value ? value.split('/').pop() : '');
    return `
      <div class="form-group">
        <label>${label}</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <input type="text" class="form-control" id="${id}" value="${escapeAttr(value)}" placeholder="Ссылка или uploads/files/...">
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminSupport.pickFile('${id}')">Загрузить файл</button>
        </div>
        <small id="${id}_name" style="display:${shownName ? 'inline' : 'none'};color:var(--text-secondary);margin-top:6px;">${escapeAttr(shownName)}</small>
      </div>`;
  }

  function renderHeroAdmin(data) {
    const el = document.getElementById('supportHeroAdmin');
    if (!el) return;
    const hero = getMigratedData(data).hero || {};
    el.innerHTML = `
      <div class="obuchenie-hero-grid">
        <!-- Left: Banner upload & Preview -->
        <div class="obuchenie-hero-banner-col">
          ${heroBgUploadShell('support_hero_bg', 'Готовый баннер (~1520×420 px)')}
          
          <div style="margin-top:20px;">
            <label style="font-weight:600; display:block; margin-bottom:8px; font-size:0.9rem; color:var(--text-secondary);">Предпросмотр готового баннера с наложенным текстом</label>
            <div class="support-live-banner-preview" id="support_hero_live_preview">
              <div class="live-banner-title" id="support_hero_live_title">${escapeAttr(hero.title)}</div>
              <div class="live-banner-subtitle" id="support_hero_live_subtitle">${escapeAttr(hero.subtitle)}</div>
            </div>
          </div>
        </div>
        
        <!-- Right: Fields -->
        <div class="obuchenie-hero-fields-col" style="display:flex; flex-direction:column; gap:20px;">
          <!-- Block "Заголовок" -->
          <div class="obuchenie-hero-block" style="border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);">
            ${blockHeaderWithColorHtml('Заголовок (Enter — перенос строки)', 'support_hero_title_color', hero.titleColor, '#ffffff')}
            <div class="form-group" style="margin-bottom:0; margin-top:8px;">
              <textarea class="form-control" id="support_hero_title" rows="2" placeholder="Заголовок баннера (Enter — перенос строки)">${escapeAttr(hero.title)}</textarea>
            </div>
            <div style="display:flex; gap:16px; margin-top:12px;">
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ сверху (px)</label>
                <input type="number" class="form-control" id="support_hero_title_top" value="${hero.titleTop !== undefined ? hero.titleTop : 122}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ слева (px)</label>
                <input type="number" class="form-control" id="support_hero_title_left" value="${hero.titleLeft !== undefined ? hero.titleLeft : 70}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
            </div>
          </div>
          
          <!-- Block "Текст" -->
          <div class="obuchenie-hero-block" style="border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);">
            ${blockHeaderWithColorHtml('Текст', 'support_hero_subtitle_color', hero.subtitleColor, '#ffffff')}
            <div class="form-group" style="margin-bottom:0; margin-top:8px;">
              <textarea class="form-control" id="support_hero_subtitle" rows="3" placeholder="Описание/текст под заголовком">${escapeAttr(hero.subtitle)}</textarea>
            </div>
            <div style="display:flex; gap:16px; margin-top:12px;">
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ сверху (px)</label>
                <input type="number" class="form-control" id="support_hero_subtitle_top" value="${hero.subtitleTop !== undefined ? hero.subtitleTop : 213}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ слева (px)</label>
                <input type="number" class="form-control" id="support_hero_subtitle_left" value="${hero.subtitleLeft !== undefined ? hero.subtitleLeft : 70}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
            </div>
          </div>
        </div>
      </div>`;

    ['title', 'subtitle'].forEach(field => {
        const input = document.getElementById(`support_hero_${field}`);
        const color = document.getElementById(`support_hero_${field}_color`);
        const colorPicker = document.getElementById(`support_hero_${field}_color_picker`);
        const top = document.getElementById(`support_hero_${field}_top`);
        const left = document.getElementById(`support_hero_${field}_left`);
        const live = document.getElementById(`support_hero_live_${field}`);

        if(input && live) input.addEventListener('input', e => live.innerText = e.target.value);
        if(color && live) color.addEventListener('input', e => { live.style.color = e.target.value; if(colorPicker) colorPicker.value = e.target.value; });
        if(colorPicker && live) colorPicker.addEventListener('input', e => { live.style.color = e.target.value; if(color) color.value = e.target.value; });
        if(top && live) top.addEventListener('input', e => live.style.top = `${(e.target.value / 420) * 100}%`);
        if(left && live) left.addEventListener('input', e => live.style.left = `${(e.target.value / 1520) * 100}%`);
    });

    setImageUploadState('support_hero_bg', hero.background);
    
    const liveTitle = document.getElementById('support_hero_live_title');
    if(liveTitle) {
      liveTitle.style.color = hero.titleColor || '#ffffff';
      liveTitle.style.top = `${((hero.titleTop !== undefined ? hero.titleTop : 122) / 420) * 100}%`;
      liveTitle.style.left = `${((hero.titleLeft !== undefined ? hero.titleLeft : 70) / 1520) * 100}%`;
    }
    const liveSubtitle = document.getElementById('support_hero_live_subtitle');
    if(liveSubtitle) {
      liveSubtitle.style.color = hero.subtitleColor || '#ffffff';
      liveSubtitle.style.top = `${((hero.subtitleTop !== undefined ? hero.subtitleTop : 213) / 420) * 100}%`;
      liveSubtitle.style.left = `${((hero.subtitleLeft !== undefined ? hero.subtitleLeft : 70) / 1520) * 100}%`;
    }
  }

  function navCardAdminHtml(card, i) {
    return `
      <div class="consulting-comp-admin-card">
        <div class="consulting-comp-admin-card__head">
          <strong>Карточка ${i + 1}</strong>
        </div>
        ${navIconUploadHtml(`support_nav_icon_${i}`)}
        <div class="form-group consulting-comp-admin-card__text">
          <label>Надпись (Enter — перенос)</label>
          <textarea class="form-control" id="support_nav_label_${i}" rows="2">${escapeAttr(card.label)}</textarea>
        </div>
        <div class="form-group consulting-comp-admin-card__link">
          <label>Ссылка (якорь или URL)</label>
          <input type="text" class="form-control" id="support_nav_href_${i}" value="${escapeAttr(card.href)}">
        </div>
      </div>`;
  }

  function renderNavCardsAdmin(data) {
    const el = document.getElementById('supportNavCardsAdmin');
    if (!el) return;
    const cards = getMigratedData(data).navCards || [];
    el.innerHTML = `<div class="admin-nav-cards-grid admin-nav-cards-grid--3">${cards.map((card, i) => navCardAdminHtml(card, i)).join('')}</div>`;
    cards.forEach((card, i) => setImageUploadState(`support_nav_icon_${i}`, card.icon));
  }

  function serviceCardHtml(prefix, item, i) {
    return `
      <div class="admin-subcard" style="margin-bottom:16px;padding:16px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <strong>Услуга ${i + 1}</strong>
          <button type="button" class="btn-delete" style="padding:6px 12px;font-size:0.8rem;" onclick="AdminSupport.removeService('${prefix}', ${i})">Удалить</button>
        </div>
        <div class="form-group">
          <label>Название (Enter — перенос)</label>
          <textarea class="form-control" id="support_${prefix}_svc_title_${i}" rows="2">${escapeAttr(item.title)}</textarea>
        </div>
        <div class="form-group">
          <label>Цена</label>
          <input type="text" class="form-control" id="support_${prefix}_svc_price_${i}" value="${escapeAttr(item.price)}">
        </div>
        <div class="form-group">
          <label>Текст кнопки</label>
          <input type="text" class="form-control" id="support_${prefix}_svc_btn_text_${i}" value="${escapeAttr(item.btnText)}">
        </div>
        <div class="form-group">
          <label>Ссылка кнопки</label>
          <input type="text" class="form-control" id="support_${prefix}_svc_btn_link_${i}" value="${escapeAttr(item.btnLink)}">
        </div>
        <div class="form-group">
          <label>Ссылка «подробнее»</label>
          <input type="text" class="form-control" id="support_${prefix}_svc_more_${i}" value="${escapeAttr(item.moreLink)}">
        </div>
      </div>`;
  }

  function checklistItemHtml(prefix, item, i) {
    const lines = Array.isArray(item.lines) ? item.lines.join('\n') : '';
    return `
      <div class="admin-subcard" style="margin-bottom:16px;padding:16px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <strong>Чек-лист ${i + 1}</strong>
          <button type="button" class="btn-delete" style="padding:6px 12px;font-size:0.8rem;" onclick="AdminSupport.removeChecklistItem('${prefix}', ${i})">Удалить</button>
        </div>
        <div class="form-group">
          <label>Текст (каждая строка — отдельная линия на карточке)</label>
          <textarea class="form-control" id="support_${prefix}_check_lines_${i}" rows="3">${escapeAttr(lines)}</textarea>
        </div>
        ${fileUploadRow(`support_${prefix}_check_file_${i}`, 'Файл для скачивания', item.file || '', item.fileName)}
      </div>`;
  }

  function renderAudienceAdmin(prefix, containerId, section) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const data = section || { title: '', services: [], checklist: { title: '', items: [] } };
    const services = data.services || [];
    const checklist = data.checklist || { title: '', items: [] };
    const items = checklist.items || [];

    el.innerHTML = `
      <div class="form-group">
        <label>Заголовок секции</label>
        <input type="text" class="form-control" id="support_${prefix}_title" value="${escapeAttr(data.title)}">
      </div>
      <h4 style="margin:24px 0 12px;font-size:0.95rem;">Карточки услуг</h4>
      ${services.map((item, i) => serviceCardHtml(prefix, item, i)).join('')}
      <h4 style="margin:24px 0 12px;font-size:0.95rem;">Чек-листы</h4>
      <div class="form-group">
        <label>Заголовок блока чек-листов (Enter — перенос)</label>
        <textarea class="form-control" id="support_${prefix}_check_title" rows="2">${escapeAttr(checklist.title)}</textarea>
      </div>
      ${items.map((item, i) => checklistItemHtml(prefix, item, i)).join('')}`;
  }

  function renderCalculatorAdmin(data) {
    const el = document.getElementById('supportCalculatorAdmin');
    if (!el) return;
    const calc = getMigratedData(data).calculator || {};
    el.innerHTML = `
      <div class="form-group">
        <label>Заголовок в правом блоке</label>
        <textarea class="form-control" id="support_calc_title" rows="4">${escapeAttr(calc.title)}</textarea>
      </div>
      ${imageUploadHtml('support_calc_image', 'Фоновое изображение (необязательно)', 'Если загружено — заменит градиент в оранжевом блоке справа от калькулятора.')}
    `;
    setImageUploadState('support_calc_image', calc.image);
  }

  function renderSupportPageAdmin(data) {
    const migrated = getMigratedData(data);
    renderHeroAdmin(migrated);
    renderNavCardsAdmin(migrated);
    renderAudienceAdmin('customers', 'supportCustomersAdmin', migrated.customers);
    renderCalculatorAdmin(migrated);
    renderAudienceAdmin('suppliers', 'supportSuppliersAdmin', migrated.suppliers);
  }

  function readImageVal(id) {
    return document.getElementById(`${id}_val`)?.value || '';
  }

  function collectAudienceSection(prefix, existing) {
    const services = [];
    const svcCount = document.querySelectorAll(`[id^="support_${prefix}_svc_title_"]`).length;
    for (let i = 0; i < svcCount; i++) {
      services.push({
        title: document.getElementById(`support_${prefix}_svc_title_${i}`)?.value || '',
        price: document.getElementById(`support_${prefix}_svc_price_${i}`)?.value || '',
        btnText: document.getElementById(`support_${prefix}_svc_btn_text_${i}`)?.value || '',
        btnLink: document.getElementById(`support_${prefix}_svc_btn_link_${i}`)?.value || '',
        moreLink: document.getElementById(`support_${prefix}_svc_more_${i}`)?.value || ''
      });
    }

    const checklistItems = [];
    const checkCount = document.querySelectorAll(`[id^="support_${prefix}_check_lines_"]`).length;
    for (let i = 0; i < checkCount; i++) {
      const linesRaw = document.getElementById(`support_${prefix}_check_lines_${i}`)?.value || '';
      const fileInput = document.getElementById(`support_${prefix}_check_file_${i}`);
      checklistItems.push({
        lines: linesRaw.split('\n').map((line) => line.trim()).filter(Boolean),
        file: fileInput?.value || '',
        fileName: document.getElementById(`support_${prefix}_check_file_${i}_name`)?.textContent || ''
      });
    }

    return {
      title: document.getElementById(`support_${prefix}_title`)?.value ?? existing?.title ?? '',
      services,
      checklist: {
        title: document.getElementById(`support_${prefix}_check_title`)?.value ?? existing?.checklist?.title ?? '',
        items: checklistItems
      }
    };
  }

  function collectSupportPageFromForm(existing) {
    const data = getMigratedData(existing || window.supportPageData || {});

    data.hero = {
      background: readImageVal('support_hero_bg') || data.hero?.background || '',
      title: document.getElementById('support_hero_title')?.value ?? data.hero?.title ?? '',
      titleColor: document.getElementById('support_hero_title_color')?.value ?? data.hero?.titleColor ?? '#ffffff',
      titleTop: parseInt(document.getElementById('support_hero_title_top')?.value || 122, 10),
      titleLeft: parseInt(document.getElementById('support_hero_title_left')?.value || 70, 10),
      subtitle: document.getElementById('support_hero_subtitle')?.value ?? data.hero?.subtitle ?? SUPPORT_DEFAULTS.hero.subtitle,
      subtitleColor: document.getElementById('support_hero_subtitle_color')?.value ?? data.hero?.subtitleColor ?? '#ffffff',
      subtitleTop: parseInt(document.getElementById('support_hero_subtitle_top')?.value || 213, 10),
      subtitleLeft: parseInt(document.getElementById('support_hero_subtitle_left')?.value || 70, 10)
    };

    data.navCards = [];
    const navCount = document.querySelectorAll('[id^="support_nav_label_"]').length;
    for (let i = 0; i < navCount; i++) {
      data.navCards.push({
        label: document.getElementById(`support_nav_label_${i}`)?.value || '',
        href: document.getElementById(`support_nav_href_${i}`)?.value || '#',
        icon: readImageVal(`support_nav_icon_${i}`) || data.navCards?.[i]?.icon || ''
      });
    }

    data.customers = collectAudienceSection('customers', data.customers);
    data.suppliers = collectAudienceSection('suppliers', data.suppliers);

    data.calculator = {
      title: document.getElementById('support_calc_title')?.value ?? data.calculator?.title ?? '',
      image: readImageVal('support_calc_image') || data.calculator?.image || ''
    };

    return data;
  }

  function pickImage(uploadId) {
    window.cropTarget = { uploadId, aspect: AdminSupport.getAspect(uploadId) };
    window.activeAuthorIndex = null;
    window.activeFeatureCardIndex = undefined;
    window.activeAboutImage = false;
    document.getElementById('imageInput')?.click();
  }

  function clearImage(uploadId) {
    setImageUploadState(uploadId, '');
  }

  function pickFile(inputId) {
    window.fileUploadTarget = inputId;
    document.getElementById('docFileInput')?.click();
  }

  function applyCroppedImage(uploadId, dataUrl) {
    if (uploadId && uploadId.startsWith('support_')) {
      setImageUploadState(uploadId, dataUrl);
    }
  }

  function getAspect(uploadId) {
    if (uploadId === 'support_hero_bg') return 1520 / 420;
    if (uploadId === 'support_calc_image') return 845 / 845;
    if (uploadId.startsWith('support_nav_icon_')) return 122 / 154;
    return 16 / 9;
  }

  function getCropSize(uploadId) {
    if (uploadId === 'support_hero_bg') return [1520, 420];
    if (uploadId === 'support_calc_image') return [845, 845];
    if (uploadId.startsWith('support_nav_icon_')) return [122, 154];
    return [1200, 675];
  }

  function isSupportUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('support_'));
  }

  function isSupportFileInputId(inputId) {
    return Boolean(inputId && inputId.startsWith('support_') && inputId.includes('_check_file_'));
  }

  window.AdminSupport = {
    DEFAULT_SUPPORT_PAGE,
    migrateSupportPageData,
    renderSupportPageAdmin,
    collectSupportPageFromForm,
    setImageUploadState,
    setFileUploadState,
    pickImage,
    clearImage,
    pickFile,
    applyCroppedImage,
    getAspect,
    getCropSize,
    isSupportUploadId,
    isSupportFileInputId,
    addService(prefix) {
      window.saveSupportPageStateToMemory?.();
      const key = prefix === 'customers' ? 'customers' : 'suppliers';
      window.supportPageData[key].services.push({
        title: '',
        price: 'от 10 000 руб.',
        btnText: 'Оставить заявку',
        btnLink: '#contacts',
        moreLink: '#'
      });
      renderSupportPageAdmin(window.supportPageData);
    },
    removeService(prefix, index) {
      window.saveSupportPageStateToMemory?.();
      const key = prefix === 'customers' ? 'customers' : 'suppliers';
      window.supportPageData[key].services.splice(index, 1);
      renderSupportPageAdmin(window.supportPageData);
    },
    addChecklistItem(prefix) {
      window.saveSupportPageStateToMemory?.();
      const key = prefix === 'customers' ? 'customers' : 'suppliers';
      window.supportPageData[key].checklist.items.push({ lines: [''], file: '' });
      renderSupportPageAdmin(window.supportPageData);
    },
    removeChecklistItem(prefix, index) {
      window.saveSupportPageStateToMemory?.();
      const key = prefix === 'customers' ? 'customers' : 'suppliers';
      window.supportPageData[key].checklist.items.splice(index, 1);
      renderSupportPageAdmin(window.supportPageData);
    }
  };
})();
