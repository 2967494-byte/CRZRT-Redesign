/**
 * Редактор страницы «Сопровождение» для admin.html
 */
(function () {
  const DEFAULT_SUPPORT_PAGE = window.SupportContent?.SUPPORT_DEFAULTS || {
    hero: { background: '', title: '', subtitle: '' },
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
        <label>${label}</label>
        <div class="hero-slide-frame hero-slide-frame--empty" data-upload-frame-for="${id}">
          <span class="hero-slide-frame__empty">${sizeLabel}</span>
          <img id="${id}_preview" class="hero-slide-frame__img" src="" alt="">
        </div>
        <div class="hero-slide-upload-actions image-upload-mini" data-upload-id="${id}">
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminSupport.pickImage('${id}')">Загрузить</button>
          <button type="button" class="btn-delete" style="padding:8px 14px;font-size:0.85rem;display:none;" id="${id}_clear" onclick="AdminSupport.clearImage('${id}')">Удалить</button>
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
      ${heroBgUploadShell('support_hero_bg', 'Готовый баннер (~1520×420 px)')}
      <div class="form-group" style="margin-top:20px;">
        <label>Заголовок (Enter — перенос строки)</label>
        <textarea class="form-control" id="support_hero_title" rows="2">${escapeAttr(hero.title)}</textarea>
      </div>
      <div class="form-group">
        <label>Подзаголовок</label>
        <textarea class="form-control" id="support_hero_subtitle" rows="3">${escapeAttr(hero.subtitle)}</textarea>
      </div>`;
    setImageUploadState('support_hero_bg', hero.background);
  }

  function renderNavCardsAdmin(data) {
    const el = document.getElementById('supportNavCardsAdmin');
    if (!el) return;
    const cards = getMigratedData(data).navCards || [];
    el.innerHTML = cards
      .map(
        (card, i) => `
      <div class="admin-subcard" style="margin-bottom:16px;padding:16px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <strong>Карточка ${i + 1}</strong>
        </div>
        ${navIconUploadHtml(`support_nav_icon_${i}`)}
        <div class="form-group">
          <label>Надпись (Enter — перенос)</label>
          <textarea class="form-control" id="support_nav_label_${i}" rows="2">${escapeAttr(card.label)}</textarea>
        </div>
        <div class="form-group">
          <label>Ссылка (якорь или URL)</label>
          <input type="text" class="form-control" id="support_nav_href_${i}" value="${escapeAttr(card.href)}">
        </div>
      </div>`
      )
      .join('');
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
      subtitle: document.getElementById('support_hero_subtitle')?.value ?? data.hero?.subtitle ?? ''
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
