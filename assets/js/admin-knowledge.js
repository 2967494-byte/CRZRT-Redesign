/**
 * Редактор страницы Документы для admin.html
 */
(function () {
  'use strict';

  const DEFAULT_KNOWLEDGE_PAGE = window.KnowledgeContent?.DEFAULT_KNOWLEDGE_PAGE || {
    hero: {
      background: '', title: '', subtitle: '',
      titleColor: '#575B6D', titleTop: 122, titleLeft: 70,
      subtitleColor: '#FFFFFF', subtitleTop: 213, subtitleLeft: 70
    },
    blocks: []
  };

  function escapeAttr(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function migrateKnowledgePageData(raw) {
    if (window.KnowledgeContent?.migrateKnowledgePageData) {
      return window.KnowledgeContent.migrateKnowledgePageData(raw);
    }
    return { ...DEFAULT_KNOWLEDGE_PAGE, ...(raw || {}) };
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

    if (id === 'knowledge_hero_bg') {
      const livePreview = document.getElementById('knowledge_hero_live_preview');
      if (livePreview) {
        if (v) {
          livePreview.style.backgroundImage = `url('${v}')`;
        } else {
          livePreview.style.backgroundImage = 'radial-gradient(32.3% 55.38% at 71.22% 54%, #FFFFFF 0%, #B8FDC6 100%)';
        }
      }
    }
  }

  function heroBgUploadShell(id, label, sizeLabel = '1520×420') {
    return `
      <div class="form-group hero-slide-upload-group" style="margin-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <label style="margin-bottom:0;">${label}</label>
          <div class="hero-slide-upload-actions image-upload-mini" data-upload-id="${id}" style="display:flex; gap:8px;">
            <button type="button" class="btn-save" style="padding:6px 12px;font-size:0.8rem;" onclick="AdminKnowledge.pickImage('${id}')">Загрузить</button>
            <button type="button" class="btn-delete" style="padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;" id="${id}_clear" onclick="AdminKnowledge.clearImage('${id}')">Удалить</button>
            <input type="hidden" id="${id}_val" value="">
          </div>
        </div>
        <div class="hero-slide-frame hero-slide-frame--empty" data-upload-frame-for="${id}">
          <span class="hero-slide-frame__empty">${sizeLabel}</span>
          <img id="${id}_preview" class="hero-slide-frame__img" src="" alt="">
        </div>
      </div>`;
  }

  function blockHeaderWithColorHtml(title, colorId, value, defaultColor = '#575B6D') {
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

  function setFileUploadState(id, url, name) {
    const val = document.getElementById(id);
    const label = document.getElementById(`${id}_name`);
    if (val) val.value = url || '';
    if (label) {
      label.textContent = name || (url ? url.split('/').pop() : '');
      label.style.display = url ? 'inline' : 'none';
    }
  }

  function fileUploadRow(id, label, value, fileName) {
    const shownName = fileName || (value ? value.split('/').pop() : '');
    return `
      <div class="form-group" style="margin-bottom: 0;">
        <label>${label}</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <input type="text" class="form-control" id="${id}" value="${escapeAttr(value)}" placeholder="Ссылка или uploads/files/..." style="flex:1; margin-bottom:0;">
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminKnowledge.pickFile('${id}')">Загрузить файл</button>
        </div>
        <small id="${id}_name" style="display:${shownName ? 'inline' : 'none'};color:var(--text-secondary);margin-top:6px;display:block;">${escapeAttr(shownName)}</small>
      </div>`;
  }

  function renderHeroAdmin(data) {
    const el = document.getElementById('knowledgeHeroAdmin');
    if (!el) return;
    const hero = migrateKnowledgePageData(data).hero || {};
    el.innerHTML = `
      <div class="obuchenie-hero-grid">
        <!-- Left: Banner upload & Preview -->
        <div class="obuchenie-hero-banner-col">
          ${heroBgUploadShell('knowledge_hero_bg', 'Готовый баннер (~1520×420 px)')}
          
          <div style="margin-top:20px;">
            <label style="font-weight:600; display:block; margin-bottom:8px; font-size:0.9rem; color:var(--text-secondary);">Предпросмотр готового баннера с наложенным текстом</label>
            <div class="ecp-live-banner-preview" id="knowledge_hero_live_preview">
              <div class="live-banner-title" id="knowledge_hero_live_title">${escapeAttr(hero.title)}</div>
              <div class="live-banner-subtitle" id="knowledge_hero_live_subtitle">${escapeAttr(hero.subtitle)}</div>
            </div>
          </div>
        </div>
        
        <!-- Right: Fields -->
        <div class="obuchenie-hero-fields-col" style="display:flex; flex-direction:column; gap:20px;">
          <!-- Block "Заголовок" -->
          <div class="obuchenie-hero-block" style="border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);">
            ${blockHeaderWithColorHtml('Заголовок (Enter — перенос строки)', 'knowledge_hero_title_color', hero.titleColor, '#575B6D')}
            <div class="form-group" style="margin-bottom:0; margin-top:8px;">
              <textarea class="form-control" id="knowledge_hero_title" rows="2" placeholder="Заголовок баннера (Enter — перенос строки)">${escapeAttr(hero.title)}</textarea>
            </div>
            <div style="display:flex; gap:16px; margin-top:12px;">
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ сверху (px)</label>
                <input type="number" class="form-control" id="knowledge_hero_title_top" value="${hero.titleTop !== undefined ? hero.titleTop : 122}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ слева (px)</label>
                <input type="number" class="form-control" id="knowledge_hero_title_left" value="${hero.titleLeft !== undefined ? hero.titleLeft : 70}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
            </div>
          </div>
          
          <!-- Block "Текст" -->
          <div class="obuchenie-hero-block" style="border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);">
            ${blockHeaderWithColorHtml('Текст', 'knowledge_hero_subtitle_color', hero.subtitleColor, '#FFFFFF')}
            <div class="form-group" style="margin-bottom:0; margin-top:8px;">
              <textarea class="form-control" id="knowledge_hero_subtitle" rows="3" placeholder="Описание/текст под заголовком">${escapeAttr(hero.subtitle)}</textarea>
            </div>
            <div style="display:flex; gap:16px; margin-top:12px;">
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ сверху (px)</label>
                <input type="number" class="form-control" id="knowledge_hero_subtitle_top" value="${hero.subtitleTop !== undefined ? hero.subtitleTop : 213}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ слева (px)</label>
                <input type="number" class="form-control" id="knowledge_hero_subtitle_left" value="${hero.subtitleLeft !== undefined ? hero.subtitleLeft : 70}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    ['title', 'subtitle'].forEach(field => {
      const input = document.getElementById(`knowledge_hero_${field}`);
      const color = document.getElementById(`knowledge_hero_${field}_color`);
      const colorPicker = document.getElementById(`knowledge_hero_${field}_color_picker`);
      const top = document.getElementById(`knowledge_hero_${field}_top`);
      const left = document.getElementById(`knowledge_hero_${field}_left`);
      const live = document.getElementById(`knowledge_hero_live_${field}`);

      if (input && live) input.addEventListener('input', e => live.innerText = e.target.value);
      if (color && live) color.addEventListener('input', e => { live.style.color = e.target.value; if (colorPicker) colorPicker.value = e.target.value; });
      if (colorPicker && live) colorPicker.addEventListener('input', e => { live.style.color = e.target.value; if (color) color.value = e.target.value; });
      if (top && live) top.addEventListener('input', e => live.style.top = `${(e.target.value / 420) * 100}%`);
      if (left && live) left.addEventListener('input', e => live.style.left = `${(e.target.value / 1520) * 100}%`);
    });

    setImageUploadState('knowledge_hero_bg', hero.background);
    
    const liveTitle = document.getElementById('knowledge_hero_live_title');
    if (liveTitle) {
      liveTitle.style.color = hero.titleColor || '#575B6D';
      liveTitle.style.top = `${((hero.titleTop !== undefined ? hero.titleTop : 122) / 420) * 100}%`;
      liveTitle.style.left = `${((hero.titleLeft !== undefined ? hero.titleLeft : 70) / 1520) * 100}%`;
    }
    const liveSubtitle = document.getElementById('knowledge_hero_live_subtitle');
    if (liveSubtitle) {
      liveSubtitle.style.color = hero.subtitleColor || '#FFFFFF';
      liveSubtitle.style.top = `${((hero.subtitleTop !== undefined ? hero.subtitleTop : 213) / 420) * 100}%`;
      liveSubtitle.style.left = `${((hero.subtitleLeft !== undefined ? hero.subtitleLeft : 70) / 1520) * 100}%`;
    }
  }

  function renderBlocksAdmin(data) {
    const el = document.getElementById('knowledgeBlocksAdmin');
    if (!el) return;
    const list = data.blocks || [];

    if (list.length === 0) {
      el.innerHTML = `<div style="text-align:center; padding:30px; border:2px dashed var(--card-border); border-radius:12px; color:var(--text-secondary);">Нет добавленных блоков. Нажмите кнопки выше, чтобы добавить заголовок, текст или документ.</div>`;
      return;
    }

    el.innerHTML = list
      .map((block, i) => {
        let blockFields = '';
        let badgeColor = 'var(--text-secondary)';
        let blockLabel = '';

        if (block.type === 'header') {
          blockLabel = 'Заголовок';
          badgeColor = '#00AE4D';
          blockFields = `
            <div class="form-group" style="margin-bottom:0;">
              <label>Текст заголовка</label>
              <input type="text" class="form-control" id="knowledge_block_val_${i}" value="${escapeAttr(block.value)}" placeholder="Например: Основные сведения">
            </div>`;
        } else if (block.type === 'text') {
          blockLabel = 'Текст';
          badgeColor = '#3a86ff';
          blockFields = `
            <div class="form-group" style="margin-bottom:0;">
              <label>Содержимое текста</label>
              <textarea class="form-control" id="knowledge_block_val_${i}" rows="4" placeholder="Введите текстовое описание...">${escapeAttr(block.value)}</textarea>
            </div>`;
        } else if (block.type === 'file') {
          blockLabel = 'Документ (файл)';
          badgeColor = '#f72585';
          blockFields = `
            <div class="form-group" style="margin-bottom:12px;">
              <label>Название документа</label>
              <input type="text" class="form-control" id="knowledge_block_title_${i}" value="${escapeAttr(block.title)}" placeholder="Например: Лицензия на осуществление образовательной деятельности">
            </div>
            ${fileUploadRow(`knowledge_block_file_${i}`, 'Файл документа', block.file || '', block.fileName)}`;
        }

        return `
          <div class="admin-subcard" style="padding:16px;border:1px solid var(--card-border);border-radius:12px;position:relative;background:var(--card-bg);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(0,0,0,0.05); padding-bottom:8px;">
              <span class="block-badge" style="background:${badgeColor}; color:#fff; padding:3px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold;">${blockLabel}</span>
              <div style="display:flex; gap:6px;">
                <button type="button" class="btn-save" style="padding:4px 8px; font-size:0.75rem;" onclick="AdminKnowledge.moveBlockUp(${i})" ${i === 0 ? 'disabled style="opacity:0.3;"' : ''}>▲</button>
                <button type="button" class="btn-save" style="padding:4px 8px; font-size:0.75rem;" onclick="AdminKnowledge.moveBlockDown(${i})" ${i === list.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>▼</button>
                <button type="button" class="btn-delete" style="padding:4px 8px; font-size:0.75rem;" onclick="AdminKnowledge.removeBlock(${i})">×</button>
              </div>
            </div>
            ${blockFields}
          </div>`;
      })
      .join('');
  }

  function renderKnowledgePageAdmin(data) {
    renderHeroAdmin(data);
    renderBlocksAdmin(data);
  }

  function readImageVal(id) {
    return document.getElementById(`${id}_val`)?.value || '';
  }

  function collectKnowledgePageFromForm(existing) {
    const data = migrateKnowledgePageData(existing || window.knowledgePageData || {});
    const hero = data.hero || {};

    data.hero = {
      background: readImageVal('knowledge_hero_bg') || hero.background || '',
      title: document.getElementById('knowledge_hero_title')?.value ?? hero.title ?? '',
      titleColor: document.getElementById('knowledge_hero_title_color')?.value ?? hero.titleColor ?? '#575B6D',
      titleTop: parseInt(document.getElementById('knowledge_hero_title_top')?.value || 122, 10),
      titleLeft: parseInt(document.getElementById('knowledge_hero_title_left')?.value || 70, 10),
      subtitle: document.getElementById('knowledge_hero_subtitle')?.value ?? hero.subtitle ?? '',
      subtitleColor: document.getElementById('knowledge_hero_subtitle_color')?.value ?? hero.subtitleColor ?? '#FFFFFF',
      subtitleTop: parseInt(document.getElementById('knowledge_hero_subtitle_top')?.value || 213, 10),
      subtitleLeft: parseInt(document.getElementById('knowledge_hero_subtitle_left')?.value || 70, 10)
    };

    const blockList = [];
    const elements = document.getElementById('knowledgeBlocksAdmin')?.children || [];
    const currentList = data.blocks || [];

    for (let i = 0; i < elements.length; i++) {
      const orig = currentList[i];
      if (!orig) continue;

      const block = {
        id: orig.id,
        type: orig.type
      };

      if (orig.type === 'header' || orig.type === 'text') {
        block.value = document.getElementById(`knowledge_block_val_${i}`)?.value || '';
      } else if (orig.type === 'file') {
        block.title = document.getElementById(`knowledge_block_title_${i}`)?.value || '';
        block.file = document.getElementById(`knowledge_block_file_${i}`)?.value || '';
        
        const label = document.getElementById(`knowledge_block_file_${i}_name`);
        block.fileName = label ? label.textContent.trim() : (block.file ? block.file.split('/').pop() : '');
      }

      blockList.push(block);
    }

    data.blocks = blockList;
    return data;
  }

  function pickImage(uploadId) {
    window.cropTarget = { uploadId, aspect: AdminKnowledge.getAspect(uploadId) };
    window.activeAuthorIndex = null;
    window.activeFeatureCardIndex = undefined;
    window.activeAboutImage = false;
    document.getElementById('imageInput')?.click();
  }

  function pickFile(inputId) {
    window.fileUploadTarget = inputId;
    document.getElementById('docFileInput')?.click();
  }

  function clearImage(uploadId) {
    setImageUploadState(uploadId, '');
  }

  function applyCroppedImage(uploadId, dataUrl) {
    if (uploadId && uploadId.startsWith('knowledge_')) {
      setImageUploadState(uploadId, dataUrl);
    }
  }

  function getAspect(uploadId) {
    if (uploadId === 'knowledge_hero_bg') return 1520 / 420;
    return 16 / 9;
  }

  function getCropSize(uploadId) {
    if (uploadId === 'knowledge_hero_bg') return [1520, 420];
    return [1200, 675];
  }

  function isKnowledgeUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('knowledge_'));
  }

  window.AdminKnowledge = {
    DEFAULT_KNOWLEDGE_PAGE,
    migrateKnowledgePageData,
    renderKnowledgePageAdmin,
    collectKnowledgePageFromForm,
    pickImage,
    pickFile,
    clearImage,
    applyCroppedImage,
    getAspect,
    getCropSize,
    isKnowledgeUploadId,
    setFileUploadState,
    addHeaderBlock() {
      window.saveKnowledgePageStateToMemory?.();
      window.knowledgePageData.blocks.push({ id: `block_${Date.now()}`, type: 'header', value: '' });
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    addTextBlock() {
      window.saveKnowledgePageStateToMemory?.();
      window.knowledgePageData.blocks.push({ id: `block_${Date.now()}`, type: 'text', value: '' });
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    addFileBlock() {
      window.saveKnowledgePageStateToMemory?.();
      window.knowledgePageData.blocks.push({ id: `block_${Date.now()}`, type: 'file', title: '', file: '', fileName: '' });
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    removeBlock(i) {
      window.saveKnowledgePageStateToMemory?.();
      window.knowledgePageData.blocks.splice(i, 1);
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    moveBlockUp(i) {
      if (i <= 0) return;
      window.saveKnowledgePageStateToMemory?.();
      const list = window.knowledgePageData.blocks;
      const temp = list[i];
      list[i] = list[i - 1];
      list[i - 1] = temp;
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    moveBlockDown(i) {
      const list = window.knowledgePageData.blocks;
      if (i >= list.length - 1) return;
      window.saveKnowledgePageStateToMemory?.();
      const temp = list[i];
      list[i] = list[i + 1];
      list[i + 1] = temp;
      renderKnowledgePageAdmin(window.knowledgePageData);
    }
  };
})();
