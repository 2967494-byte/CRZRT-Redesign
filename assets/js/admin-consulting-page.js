/**
 * Редактор страницы «Юридический консалтинг» для admin.html
 */
(function () {
  const DEFAULT_CONSULTING_PAGE = window.ConsultingContent?.CONSULTING_DEFAULTS || {
    hero: { 
      background: '', graphic: '', title: '', 
      titleColor: '#ffffff', titleTop: 122, titleLeft: 70,
      subtitle: '', subtitleColor: '#ffffff', subtitleTop: 213, subtitleLeft: 70
    },
    competenciesTitle: 'Компетенции',
    competencies: [],
    whyUs: {
      title: 'Почему мы?',
      lead: { text: '' },
      photo: { image: '', caption: '' },
      support: { text: '' },
      side: { text: '', image: '' }
    }
  };

  function escapeAttr(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function migrateConsultingPageData(raw) {
    if (window.ConsultingContent?.migrateConsultingData) {
      return window.ConsultingContent.migrateConsultingData(raw);
    }
    return { ...DEFAULT_CONSULTING_PAGE, ...(raw || {}) };
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
      frame.classList.toggle('cover-upload-frame--empty', !v);
    }
    if (clr) clr.style.display = v ? 'inline-flex' : 'none';

    if (id === 'consulting_hero_bg') {
        const livePreview = document.getElementById('consulting_hero_live_preview');
        if (livePreview) {
            if (v) {
                livePreview.style.backgroundImage = `url('${v}')`;
            } else {
                livePreview.style.backgroundImage = 'radial-gradient(32.3% 55.38% at 71.22% 54%, #FFFFFF 0%, #B8FDC6 100%)';
            }
        }
    }
  }

  function coverUploadShell(id, label, hint, width, height) {
    const sizeLabel = `${width}×${height}`;
    return `
      <div class="form-group cover-upload-group" style="margin-bottom:0;">
        <label>${label}</label>
        ${hint ? `<p style="color:var(--text-secondary);font-size:0.85rem;margin:-4px 0 8px;">${hint}</p>` : ''}
        <div class="cover-upload-frame cover-upload-frame--empty" data-upload-frame-for="${id}" style="--cover-aspect: ${width} / ${height};">
          <span class="cover-upload-frame__empty">${sizeLabel}</span>
          <img id="${id}_preview" class="cover-upload-frame__img" src="" alt="">
        </div>
        <div class="hero-slide-upload-actions image-upload-mini" data-upload-id="${id}">
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminConsultingPage.pickImage('${id}')">Загрузить</button>
          <button type="button" class="btn-delete" style="padding:8px 14px;font-size:0.85rem;display:none;" id="${id}_clear" onclick="AdminConsultingPage.clearImage('${id}')">Удалить</button>
          <input type="hidden" id="${id}_val" value="">
        </div>
      </div>`;
  }

  function heroBgUploadShell(id, label, sizeLabel = '1520×420') {
    return `
      <div class="form-group hero-slide-upload-group" style="margin-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <label style="margin-bottom:0;">${label}</label>
          <div class="hero-slide-upload-actions image-upload-mini" data-upload-id="${id}" style="display:flex; gap:8px;">
            <button type="button" class="btn-save" style="padding:6px 12px;font-size:0.8rem;" onclick="AdminConsultingPage.pickImage('${id}')">Загрузить</button>
            <button type="button" class="btn-delete" style="padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;" id="${id}_clear" onclick="AdminConsultingPage.clearImage('${id}')">Удалить</button>
            <input type="hidden" id="${id}_val" value="">
          </div>
        </div>
        <div class="hero-slide-frame hero-slide-frame--empty" data-upload-frame-for="${id}">
          <span class="hero-slide-frame__empty">${sizeLabel}</span>
          <img id="${id}_preview" class="hero-slide-frame__img" src="" alt="">
        </div>
      </div>`;
  }

  function blockHeaderWithColorHtml(title, colorId, value, defaultColor = '#ffffff', fontSize = '', fontWeight = '', italic = false, underline = false) {
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
          <input type="color" id="${colorId}_picker" value="${escapeAttr(color)}" style="width:30px; height:30px; padding:0; border:none; border-radius:4px; cursor:pointer; background:transparent; margin-bottom:0;">
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
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminConsultingPage.pickImage('${id}')">Загрузить</button>
          <button type="button" class="btn-delete" style="padding:8px 14px;margin-left:8px;font-size:0.85rem;display:none;" id="${id}_clear" onclick="AdminConsultingPage.clearImage('${id}')">Удалить</button>
          <input type="hidden" id="${id}_val" value="">
        </div>
      </div>`;
  }

  function compactCompIconUploadHtml(id) {
    return `
      <div class="form-group consulting-comp-admin-card__icon">
        <label>Иконка</label>
        <div class="image-upload-mini" data-upload-id="${id}">
          <img id="${id}_preview" class="consulting-comp-admin-card__icon-preview" src="" alt="">
          <div class="consulting-comp-admin-card__icon-actions">
            <button type="button" class="btn-save" onclick="AdminConsultingPage.pickImage('${id}')">Загрузить</button>
            <button type="button" class="btn-delete consulting-comp-admin-card__icon-clear" style="display:none;" id="${id}_clear" onclick="AdminConsultingPage.clearImage('${id}')">×</button>
          </div>
          <input type="hidden" id="${id}_val" value="">
        </div>
      </div>`;
  }

  function getMigratedData(data) {
    return migrateConsultingPageData(data || {});
  }

  function consultingHeroSlidesConfig() {
    return {
      prefix: 'consulting_hero',
      removeHandler: 'AdminConsultingPage.removeHeroSlide',
      pickHandler: 'AdminConsultingPage.pickImage',
      clearHandler: 'AdminConsultingPage.clearImage',
      previewClass: 'consulting-live-banner-preview',
      defaults: { titleColor: '#ffffff', subtitleColor: '#ffffff', titleTop: 122, titleLeft: 70, subtitleTop: 213, subtitleLeft: 70 }
    };
  }

  function renderHeroAdmin(data) {
    const el = document.getElementById('consultingPageHeroAdmin');
    if (!el || !window.AdminHeroSlides) return;
    const migrated = getMigratedData(data);
    AdminHeroSlides.render(el, migrated.heroSlides || [], consultingHeroSlidesConfig(), setImageUploadState);
  }

  function renderCompetenciesAdmin(data) {
    const el = document.getElementById('consultingPageCompetenciesAdmin');
    if (!el) return;
    const migrated = getMigratedData(data);
    const items = migrated.competencies || [];
    el.innerHTML = `
      <div class="form-group">
        <label>Заголовок секции</label>
        <input type="text" class="form-control" id="consulting_competencies_title" value="${escapeAttr(migrated.competenciesTitle)}">
      </div>
      <div id="consultingCompetenciesList" class="consulting-comp-admin-grid">
        ${items
          .map(
            (item, i) => `
          <div class="consulting-comp-admin-card">
            <div class="consulting-comp-admin-card__head">
              <strong>№${i + 1}</strong>
              <button type="button" class="btn-delete consulting-comp-admin-card__remove" onclick="AdminConsultingPage.removeCompetency(${i})" aria-label="Удалить">×</button>
            </div>
            ${compactCompIconUploadHtml(`consulting_comp_icon_${i}`)}
            <div class="form-group consulting-comp-admin-card__text">
              <label>Надпись</label>
              <textarea class="form-control" id="consulting_comp_text_${i}" rows="2">${escapeAttr(item.title)}</textarea>
            </div>
            <div class="form-group consulting-comp-admin-card__link">
              <label>Ссылка</label>
              <input type="text" class="form-control" id="consulting_comp_link_${i}" value="${escapeAttr(item.link || '#competencies')}" placeholder="#competencies">
            </div>
            <div class="form-group" style="margin-top:8px; margin-bottom:0;">
              <button type="button" class="btn-save" style="width: 100%; font-size: 0.85rem; padding: 6px 12px;" onclick="AdminConsultingPage.openDescriptionModal(${i})">Описание</button>
              <textarea id="consulting_comp_desc_${i}" style="display:none;">${escapeAttr(item.description || '')}</textarea>
            </div>
          </div>`
          )
          .join('')}
      </div>`;
    items.forEach((item, i) => setImageUploadState(`consulting_comp_icon_${i}`, item.icon));
  }

  function renderWhyAdmin(data) {
    const el = document.getElementById('consultingPageWhyAdmin');
    if (!el) return;
    const why = getMigratedData(data).whyUs || {};
    const lead = why.lead || {};
    const photo = why.photo || {};
    const support = why.support || {};
    const side = why.side || {};

    el.innerHTML = `
      <div class="form-group">
        <label>Заголовок секции</label>
        <input type="text" class="form-control" id="consulting_why_title" value="${escapeAttr(why.title)}">
      </div>

      <div class="consulting-why-admin-row" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 16px;">
        <div class="admin-card" style="margin:0;padding:16px;background:rgba(255,255,255,0.03); display: flex; flex-direction: column;">
          <strong style="display:block;margin-bottom:12px;">Блок 1 — большая карточка</strong>
          <div class="form-group" style="flex-grow: 1; display: flex; flex-direction: column; margin-bottom: 0;">
            <label>Текст</label>
            <textarea class="form-control" id="consulting_why_lead_text" rows="8" style="flex-grow: 1; resize: vertical;">${escapeAttr(lead.text)}</textarea>
          </div>
        </div>

        <div class="admin-card" style="margin:0;padding:16px;background:rgba(255,255,255,0.03); display: flex; flex-direction: column;">
          <strong style="display:block;margin-bottom:12px;">Блок 2 — фото с подписью</strong>
          <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 12px;">
            ${imageUploadHtml('consulting_why_photo', 'Фото (~494×329)', '')}
            <div class="form-group" style="margin-bottom: 0; margin-top: auto;">
              <label>Подпись под фото</label>
              <input type="text" class="form-control" id="consulting_why_photo_caption" value="${escapeAttr(photo.caption)}" style="margin-bottom: 0;">
            </div>
          </div>
        </div>

        <div class="admin-card" style="margin:0;padding:16px;background:rgba(255,255,255,0.03); display: flex; flex-direction: column;">
          <strong style="display:block;margin-bottom:12px;">Блок 3 — «Помогаем...»</strong>
          <div class="form-group" style="flex-grow: 1; display: flex; flex-direction: column; margin-bottom: 0;">
            <label>Текст (Enter — перенос)</label>
            <textarea class="form-control" id="consulting_why_support_text" rows="8" style="flex-grow: 1; resize: vertical;">${escapeAttr(support.text)}</textarea>
          </div>
        </div>

        <div class="admin-card" style="margin:0;padding:16px;background:rgba(255,255,255,0.03); display: flex; flex-direction: column;">
          <strong style="display:block;margin-bottom:12px;">Блок 4 — боковая карточка</strong>
          <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 12px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label>Текст</label>
              <textarea class="form-control" id="consulting_why_side_text" rows="2">${escapeAttr(side.text)}</textarea>
            </div>
            <div style="margin-top: auto;">
              ${coverUploadShell(
                'consulting_why_side_image',
                'Фоновое изображение',
                '',
                489,
                763
              )}
            </div>
          </div>
        </div>
      </div>`;

    setImageUploadState('consulting_why_photo', photo.image);
    setImageUploadState('consulting_why_side_image', side.image);
  }

  function renderConsultingPageAdmin(data) {
    renderHeroAdmin(data);
    renderCompetenciesAdmin(data);
    renderWhyAdmin(data);
  }

  function readImageVal(id) {
    return document.getElementById(`${id}_val`)?.value || '';
  }

  let activeCompetencyIndex = null;
  let competencyModalInitialized = false;

  function openDescriptionModal(i) {
    activeCompetencyIndex = i;
    const modal = document.getElementById('competencyModal');
    const editor = document.getElementById('competencyFormDescription');
    const textarea = document.getElementById(`consulting_comp_desc_${i}`);
    
    if (modal && editor && textarea) {
      editor.innerHTML = textarea.value || '';
      modal.style.display = 'flex';
      editor.focus();
      updateWysiwygToolbarState();
    }
  }

  function closeDescriptionModal() {
    const modal = document.getElementById('competencyModal');
    if (modal) {
      modal.style.display = 'none';
    }
    activeCompetencyIndex = null;
  }

  function initCompetencyModal() {
    if (competencyModalInitialized) return;
    let modal = document.getElementById('competencyModal');
    if (!modal) {
      console.log('competencyModal not found in DOM, creating dynamically...');
      modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.id = 'competencyModal';
      modal.style.cssText = 'display: none; z-index: 1050;';
      modal.innerHTML = `
        <div class="modal-content admin-courses-modal" style="max-width: 800px; width: 100%;">
            <button type="button" class="btn-modal-close" id="competencyModalClose" aria-label="Закрыть">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <h2 class="modal-title admin-courses-modal__title" id="competencyModalTitle">Описание компетенции</h2>
            <form id="competencyForm" class="admin-courses-modal__form">
                <div class="form-group admin-courses-modal__desc-section">
                    <div class="wysiwyg-container">
                        <div class="wysiwyg-toolbar" id="compWysiwygToolbar">
                            <button type="button" class="wysiwyg-btn" data-command="bold" title="Жирный">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
                            </button>
                            <button type="button" class="wysiwyg-btn" data-command="italic" title="Курсив">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
                            </button>
                            <button type="button" class="wysiwyg-btn" data-command="underline" title="Подчеркнутый">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>
                            </button>
                            <div class="wysiwyg-divider"></div>
                            <button type="button" class="wysiwyg-btn" data-command="justifyLeft" title="По левому краю">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
                            </button>
                            <button type="button" class="wysiwyg-btn" data-command="justifyCenter" title="По центру">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>
                            </button>
                            <button type="button" class="wysiwyg-btn" data-command="justifyRight" title="По правому краю">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
                            </button>
                            <div class="wysiwyg-divider"></div>
                            
                            <div class="wysiwyg-tool-group" title="Размер шрифта">
                                <span class="wysiwyg-tool-label">Размер:</span>
                                <select class="wysiwyg-select" id="compWysiwygFontSize">
                                    <option value="1">1 (Мелкий)</option>
                                    <option value="2">2 (Небольшой)</option>
                                    <option value="3" selected>3 (Обычный)</option>
                                    <option value="4">4 (Средний)</option>
                                    <option value="5">5 (Большой)</option>
                                    <option value="6">6 (Очень большой)</option>
                                    <option value="7">7 (Огромный)</option>
                                </select>
                            </div>

                            <div class="wysiwyg-divider"></div>

                            <div class="wysiwyg-tool-group" title="Цвет текста">
                                <span class="wysiwyg-tool-label">Цвет:</span>
                                <input type="color" id="compWysiwygColor" class="wysiwyg-color-input" value="#1D1D1F">
                            </div>
                        </div>
                        <div class="wysiwyg-editor form-control" id="competencyFormDescription" contenteditable="true" spellcheck="false" style="min-height: 250px;"></div>
                    </div>
                </div>
                <div class="admin-courses-modal__actions" style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px;">
                    <button type="button" class="btn-secondary" id="competencyModalCancel">Отмена</button>
                    <button type="submit" class="btn-save" id="competencyModalSave">Сохранить</button>
                </div>
            </form>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const closeBtn = document.getElementById('competencyModalClose');
    const cancelBtn = document.getElementById('competencyModalCancel');
    const form = document.getElementById('competencyForm');

    if (closeBtn) closeBtn.addEventListener('click', closeDescriptionModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeDescriptionModal);

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const editor = document.getElementById('competencyFormDescription');
        if (activeCompetencyIndex !== null && editor) {
          const textarea = document.getElementById(`consulting_comp_desc_${activeCompetencyIndex}`);
          if (textarea) {
            textarea.value = editor.innerHTML;
            window.saveConsultingPageStateToMemory?.();
          }
        }
        closeDescriptionModal();
      });
    }

    const wysiwygBtns = document.querySelectorAll('#compWysiwygToolbar .wysiwyg-btn');
    wysiwygBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const command = btn.getAttribute('data-command');
        document.execCommand(command, false, null);
        const editor = document.getElementById('competencyFormDescription');
        if (editor) editor.focus();
        updateWysiwygToolbarState();
      });
    });

    const wysiwygFontSize = document.getElementById('compWysiwygFontSize');
    if (wysiwygFontSize) {
      wysiwygFontSize.addEventListener('change', (e) => {
        document.execCommand('fontSize', false, e.target.value);
        const editor = document.getElementById('competencyFormDescription');
        if (editor) editor.focus();
      });
    }

    const wysiwygColor = document.getElementById('compWysiwygColor');
    if (wysiwygColor) {
      wysiwygColor.addEventListener('input', (e) => {
        document.execCommand('foreColor', false, e.target.value);
        const editor = document.getElementById('competencyFormDescription');
        if (editor) editor.focus();
      });
    }

    const editor = document.getElementById('competencyFormDescription');
    if (editor) {
      editor.addEventListener('keyup', updateWysiwygToolbarState);
      editor.addEventListener('mouseup', updateWysiwygToolbarState);
    }

    competencyModalInitialized = true;
  }

  function updateWysiwygToolbarState() {
    const wysiwygBtns = document.querySelectorAll('#compWysiwygToolbar .wysiwyg-btn');
    wysiwygBtns.forEach(btn => {
      const command = btn.getAttribute('data-command');
      if (document.queryCommandState(command)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompetencyModal);
  } else {
    initCompetencyModal();
  }

  function collectConsultingPageFromForm(existing) {
    const data = getMigratedData(existing || window.consultingPageData || {});

    data.heroSlides = window.AdminHeroSlides ? AdminHeroSlides.collect('consulting_hero') : [];
    data.hero = {
      ...(data.heroSlides[0] || {}),
      graphic: readImageVal('consulting_hero_graphic') || data.hero?.graphic || ''
    };

    data.competenciesTitle =
      document.getElementById('consulting_competencies_title')?.value ?? data.competenciesTitle ?? '';

    data.competencies = [];
    const compCount = document.querySelectorAll('[id^="consulting_comp_text_"]').length;
    for (let i = 0; i < compCount; i++) {
      data.competencies.push({
        title: document.getElementById(`consulting_comp_text_${i}`)?.value || '',
        icon: readImageVal(`consulting_comp_icon_${i}`) || data.competencies?.[i]?.icon || '',
        link: document.getElementById(`consulting_comp_link_${i}`)?.value || '#competencies',
        description: document.getElementById(`consulting_comp_desc_${i}`)?.value || ''
      });
    }

    const existingWhy = data.whyUs || {};
    data.whyUs = {
      title: document.getElementById('consulting_why_title')?.value ?? existingWhy.title ?? '',
      lead: {
        text: document.getElementById('consulting_why_lead_text')?.value ?? existingWhy.lead?.text ?? ''
      },
      photo: {
        image: readImageVal('consulting_why_photo') || existingWhy.photo?.image || '',
        caption: document.getElementById('consulting_why_photo_caption')?.value ?? existingWhy.photo?.caption ?? ''
      },
      support: {
        text: document.getElementById('consulting_why_support_text')?.value ?? existingWhy.support?.text ?? ''
      },
      side: {
        text: document.getElementById('consulting_why_side_text')?.value ?? existingWhy.side?.text ?? '',
        image: readImageVal('consulting_why_side_image') || existingWhy.side?.image || ''
      }
    };

    return data;
  }

  function pickImage(uploadId) {
    window.cropTarget = { uploadId, aspect: AdminConsultingPage.getAspect(uploadId) };
    window.activeAuthorIndex = null;
    window.activeFeatureCardIndex = undefined;
    window.activeAboutImage = false;
    document.getElementById('imageInput')?.click();
  }

  function clearImage(uploadId) {
    setImageUploadState(uploadId, '');
  }

  function applyCroppedImage(uploadId, dataUrl) {
    if (uploadId && uploadId.startsWith('consulting_')) {
      setImageUploadState(uploadId, dataUrl);
    }
  }

  const CONSULTING_WHY_SIDE_ASPECT = 489 / 763;

  function getAspect(uploadId) {
    if (uploadId === 'consulting_hero_bg' || uploadId?.startsWith('consulting_hero_bg_')) return 1520 / 420;
    if (uploadId === 'consulting_hero_graphic') return 1;
    if (uploadId === 'consulting_why_photo') return 494 / 329;
    if (uploadId === 'consulting_why_side_image') return CONSULTING_WHY_SIDE_ASPECT;
    if (uploadId.startsWith('consulting_comp_icon_')) return 109 / 110;
    return 16 / 9;
  }

  function getCropSize(uploadId) {
    if (uploadId === 'consulting_hero_bg' || uploadId?.startsWith('consulting_hero_bg_')) return [1520, 420];
    if (uploadId === 'consulting_hero_graphic') return [420, 420];
    if (uploadId === 'consulting_why_photo') return [494, 329];
    if (uploadId === 'consulting_why_side_image') return [978, 1526];
    if (uploadId.startsWith('consulting_comp_icon_')) return [109, 110];
    return [1200, 675];
  }

  function isConsultingUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('consulting_'));
  }

  window.AdminConsultingPage = {
    DEFAULT_CONSULTING_PAGE,
    CONSULTING_WHY_SIDE_ASPECT,
    migrateConsultingPageData,
    renderConsultingPageAdmin,
    collectConsultingPageFromForm,
    pickImage,
    clearImage,
    applyCroppedImage,
    getAspect,
    getCropSize,
    isConsultingUploadId,
    openDescriptionModal,
    closeDescriptionModal,
    addHeroSlide() {
      window.saveConsultingPageStateToMemory?.();
      const page = window.consultingPageData || {};
      if (!page.heroSlides) page.heroSlides = [];
      if (page.heroSlides.length >= AdminHeroSlides.MAX) {
        alert(`Не более ${AdminHeroSlides.MAX} слайдов`);
        return;
      }
      page.heroSlides.push({ title: '', subtitle: '', background: '' });
      renderConsultingPageAdmin(page);
    },
    removeHeroSlide(i) {
      window.saveConsultingPageStateToMemory?.();
      const page = window.consultingPageData || {};
      if (!page.heroSlides?.length) return;
      page.heroSlides.splice(i, 1);
      if (!page.heroSlides.length) page.heroSlides.push({ title: '', subtitle: '', background: '' });
      renderConsultingPageAdmin(page);
    },
    addCompetency() {
      window.saveConsultingPageStateToMemory?.();
      window.consultingPageData.competencies.push({
        title: '',
        icon: '',
        link: '#competencies',
        description: ''
      });
      renderConsultingPageAdmin(window.consultingPageData);
    },
    removeCompetency(index) {
      window.saveConsultingPageStateToMemory?.();
      window.consultingPageData.competencies.splice(index, 1);
      renderConsultingPageAdmin(window.consultingPageData);
    }
  };
})();
