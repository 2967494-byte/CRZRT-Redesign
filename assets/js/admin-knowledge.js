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

  const expandedAdminGroups = new Set();

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

  function blockHeaderWithColorHtml(title, colorId, value, defaultColor = '#575B6D', fontSize = '', fontWeight = '', italic = false, underline = false) {
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

  function isDescendantPath(ancestorPathStr, pathStr) {
    if (!ancestorPathStr) return false;
    return pathStr === ancestorPathStr || pathStr.startsWith(`${ancestorPathStr}.`);
  }

  function collectGroupTargets(blocks, path = [], excludePathStr = '', options = []) {
    (blocks || []).forEach((block, i) => {
      const currentPath = [...path, i];
      const pathStr = pathToString(currentPath);
      if (block.type === 'group' && pathStr !== excludePathStr && !isDescendantPath(excludePathStr, pathStr)) {
        const prefix = path.length ? `${'— '.repeat(path.length)}` : '';
        options.push({
          pathStr,
          label: `${prefix}${block.value || 'Группа без названия'}`
        });
        collectGroupTargets(block.children || [], currentPath, excludePathStr, options);
      }
    });
    return options;
  }

  function renderMoveToGroupControl(pathStr, blockId) {
    const groupTargets = collectGroupTargets(window.knowledgePageData?.blocks || [], [], pathStr);
    if (!groupTargets.length) return '';

    const selectId = `knowledge_move_target_${blockId}`;
    return `
      <div class="knowledge-move-to-group">
        <select id="${selectId}" class="knowledge-move-to-group__select" title="Выберите группу">
          <option value="">В группу…</option>
          ${groupTargets.map((g) => `<option value="${escapeAttr(g.pathStr)}">${escapeHtml(g.label)}</option>`).join('')}
        </select>
        <button type="button" class="btn-save knowledge-move-to-group__btn" title="Переместить в выбранную группу" onclick="AdminKnowledge.moveBlockToGroup('${pathStr}', document.getElementById('${selectId}').value)">→</button>
      </div>`;
  }

  function escapeHtml(s) {
    return escapeAttr(s);
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
            ${blockHeaderWithColorHtml('Заголовок (Enter — перенос строки)', 'knowledge_hero_title_color', hero.titleColor, '#575B6D', hero.titleFontSize, hero.titleFontWeight, hero.titleItalic, hero.titleUnderline)}
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
            ${blockHeaderWithColorHtml('Текст', 'knowledge_hero_subtitle_color', hero.subtitleColor, '#FFFFFF', hero.subtitleFontSize, hero.subtitleFontWeight, hero.subtitleItalic, hero.subtitleUnderline)}
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
      const size = document.getElementById(`knowledge_hero_${field}_size`);
      const weight = document.getElementById(`knowledge_hero_${field}_weight`);
      const italic = document.getElementById(`knowledge_hero_${field}_italic`);
      const underline = document.getElementById(`knowledge_hero_${field}_underline`);

      if (input && live) input.addEventListener('input', e => live.innerText = e.target.value);
      if (color && live) color.addEventListener('input', e => { live.style.color = e.target.value; if (colorPicker) colorPicker.value = e.target.value; });
      if (colorPicker && live) colorPicker.addEventListener('input', e => { live.style.color = e.target.value; if (color) color.value = e.target.value; });
      if (top && live) top.addEventListener('input', e => live.style.top = `${(e.target.value / 420) * 100}%`);
      if (left && live) left.addEventListener('input', e => live.style.left = `${(e.target.value / 1520) * 100}%`);
      if (size && live) size.addEventListener('input', e => { if (e.target.value) live.style.fontSize = `${e.target.value}px`; else live.style.removeProperty('font-size'); });
      if (weight && live) weight.addEventListener('change', e => { if (e.target.value) live.style.fontWeight = e.target.value; else live.style.removeProperty('font-weight'); });
      if (italic && live) italic.addEventListener('change', e => { if (e.target.checked) live.style.fontStyle = 'italic'; else live.style.removeProperty('font-style'); });
      if (underline && live) underline.addEventListener('change', e => { if (e.target.checked) live.style.textDecoration = 'underline'; else live.style.removeProperty('text-decoration'); });
    });

    setImageUploadState('knowledge_hero_bg', hero.background);
    
    const liveTitle = document.getElementById('knowledge_hero_live_title');
    if (liveTitle) {
      liveTitle.style.color = hero.titleColor || '#575B6D';
      liveTitle.style.top = `${((hero.titleTop !== undefined ? hero.titleTop : 122) / 420) * 100}%`;
      liveTitle.style.left = `${((hero.titleLeft !== undefined ? hero.titleLeft : 70) / 1520) * 100}%`;
      if (hero.titleFontSize) liveTitle.style.fontSize = `${hero.titleFontSize}px`;
      if (hero.titleFontWeight) liveTitle.style.fontWeight = hero.titleFontWeight;
      if (hero.titleItalic) liveTitle.style.fontStyle = 'italic';
      if (hero.titleUnderline) liveTitle.style.textDecoration = 'underline';
    }
    const liveSubtitle = document.getElementById('knowledge_hero_live_subtitle');
    if (liveSubtitle) {
      liveSubtitle.style.color = hero.subtitleColor || '#FFFFFF';
      liveSubtitle.style.top = `${((hero.subtitleTop !== undefined ? hero.subtitleTop : 213) / 420) * 100}%`;
      liveSubtitle.style.left = `${((hero.subtitleLeft !== undefined ? hero.subtitleLeft : 70) / 1520) * 100}%`;
      if (hero.subtitleFontSize) liveSubtitle.style.fontSize = `${hero.subtitleFontSize}px`;
      if (hero.subtitleFontWeight) liveSubtitle.style.fontWeight = hero.subtitleFontWeight;
      if (hero.subtitleItalic) liveSubtitle.style.fontStyle = 'italic';
      if (hero.subtitleUnderline) liveSubtitle.style.textDecoration = 'underline';
    }
  }

  function createKnowledgeBlock(type) {
    const id = `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    if (type === 'group') {
      return { id, type: 'group', value: '', defaultExpanded: false, children: [] };
    }
    if (type === 'file') {
      return { id, type: 'file', title: '', file: '', fileName: '' };
    }
    return { id, type, value: '' };
  }

  function parseBlockPath(pathStr) {
    if (!pathStr && pathStr !== 0) return [];
    return String(pathStr).split('.').map((part) => parseInt(part, 10));
  }

  function pathToString(path) {
    return path.join('.');
  }

  function resolveBlockPath(blocks, path) {
    if (!path.length) return null;
    let list = blocks;
    for (let i = 0; i < path.length - 1; i++) {
      const block = list[path[i]];
      if (!block || block.type !== 'group' || !Array.isArray(block.children)) return null;
      list = block.children;
    }
    const index = path[path.length - 1];
    return { list, index, block: list[index] };
  }

  function collectBlockFromDom(block) {
    const result = { id: block.id, type: block.type };

    if (block.type === 'header' || block.type === 'text' || block.type === 'group') {
      result.value = document.getElementById(`knowledge_block_val_${block.id}`)?.value || '';
    }

    if (block.type === 'group') {
      result.defaultExpanded = document.getElementById(`knowledge_block_expanded_${block.id}`)?.checked || false;
      result.children = (block.children || []).map(collectBlockFromDom);
    }

    if (block.type === 'file') {
      const fileId = `knowledge_block_file_${block.id}`;
      result.title = document.getElementById(`knowledge_block_title_${block.id}`)?.value || '';
      result.file = document.getElementById(fileId)?.value || '';
      const label = document.getElementById(`${fileId}_name`);
      result.fileName = label ? label.textContent.trim() : (result.file ? result.file.split('/').pop() : '');
    }

    return result;
  }

  function renderBlockFields(block) {
    const blockId = block.id;

    if (block.type === 'group') {
      const children = block.children || [];
      const pathStr = block._pathStr || '';
      return `
        <div class="form-group" style="margin-bottom:12px;">
          <label>Название группы</label>
          <input type="text" class="form-control" id="knowledge_block_val_${blockId}" value="${escapeAttr(block.value)}" placeholder="Например: Реквизиты">
        </div>
        <label style="display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px;cursor:pointer;">
          <input type="checkbox" id="knowledge_block_expanded_${blockId}" ${block.defaultExpanded ? 'checked' : ''}>
          Открыта по умолчанию на сайте
        </label>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
          <button type="button" class="btn-save" style="padding:4px 10px;font-size:0.75rem;" onclick="AdminKnowledge.addChildBlock('${pathStr}', 'header')">+ Заголовок</button>
          <button type="button" class="btn-save" style="padding:4px 10px;font-size:0.75rem;" onclick="AdminKnowledge.addChildBlock('${pathStr}', 'text')">+ Текст</button>
          <button type="button" class="btn-save" style="padding:4px 10px;font-size:0.75rem;" onclick="AdminKnowledge.addChildBlock('${pathStr}', 'file')">+ Файл</button>
          <button type="button" class="btn-save" style="padding:4px 10px;font-size:0.75rem;" onclick="AdminKnowledge.addChildBlock('${pathStr}', 'group')">+ Группа</button>
        </div>
        <div class="knowledge-admin-tree-children">
          ${children.length
            ? children.map((child, childIndex) => renderBlockAdminCard(child, [...(block._path || []), childIndex])).join('')
            : '<p style="color:var(--text-secondary);font-size:0.85rem;margin:0;padding:8px 0;">Внутри группы пока нет элементов.</p>'}
        </div>`;
    }

    return '';
  }

  function renderCompactBlockContent(block) {
    const blockId = block.id;

    if (block.type === 'header') {
      return {
        fields: `<input type="text" class="form-control knowledge-inline-field" id="knowledge_block_val_${blockId}" value="${escapeAttr(block.value)}" placeholder="Текст заголовка">`,
        footer: ''
      };
    }

    if (block.type === 'text') {
      return {
        fields: `<textarea class="form-control knowledge-inline-field knowledge-inline-field--textarea" id="knowledge_block_val_${blockId}" rows="2" placeholder="Содержимое текста...">${escapeAttr(block.value)}</textarea>`,
        footer: ''
      };
    }

    if (block.type === 'file') {
      const fileId = `knowledge_block_file_${blockId}`;
      const shownName = block.fileName || (block.file ? block.file.split('/').pop() : '');
      return {
        fields: `
          <input type="text" class="form-control knowledge-inline-field knowledge-inline-field--title" id="knowledge_block_title_${blockId}" value="${escapeAttr(block.title)}" placeholder="Название документа" title="Название документа">
          <input type="text" class="form-control knowledge-inline-field knowledge-inline-field--file" id="${fileId}" value="${escapeAttr(block.file)}" placeholder="Ссылка или uploads/files/..." title="Файл документа">
          <button type="button" class="btn-save knowledge-inline-upload-btn" onclick="AdminKnowledge.pickFile('${fileId}')">Загрузить</button>`,
        footer: `<small id="${fileId}_name" class="knowledge-inline-file-name" style="display:${shownName ? 'block' : 'none'};">${escapeAttr(shownName)}</small>`
      };
    }

    return { fields: '', footer: '' };
  }

  function getBlockMeta(block) {
    if (block.type === 'header') return { label: 'Заголовок', color: '#00AE4D' };
    if (block.type === 'text') return { label: 'Текст', color: '#3a86ff' };
    if (block.type === 'file') return { label: 'Документ', color: '#f72585' };
    if (block.type === 'group') return { label: 'Группа', color: '#8338ec' };
    return { label: block.type, color: 'var(--text-secondary)' };
  }

  function isGroupExpandedInAdmin(blockId) {
    return expandedAdminGroups.has(blockId);
  }

  function renderBlockAdminCard(block, path) {
    const pathStr = pathToString(path);
    const resolved = resolveBlockPath(window.knowledgePageData?.blocks || [], path);
    const siblings = resolved?.list || [];
    const index = resolved?.index ?? 0;
    const canUnnest = path.length > 1;
    const isGroup = block.type === 'group';
    const depth = Math.max(0, path.length - 1);
    const isExpanded = !isGroup || isGroupExpandedInAdmin(block.id);
    const childCount = isGroup ? (block.children || []).length : 0;
    const cardClass = isGroup
      ? `admin-subcard knowledge-admin-block-card knowledge-admin-block-card--group${isExpanded ? '' : ' knowledge-admin-block-card--group-collapsed'}`
      : 'admin-subcard knowledge-admin-block-card';
    const nodeClass = isGroup && depth === 0
      ? 'knowledge-admin-tree-node knowledge-admin-tree-node--group-root'
      : 'knowledge-admin-tree-node';

    block._path = path;
    block._pathStr = pathStr;

    const meta = getBlockMeta(block);
    const upDisabled = index === 0 ? 'disabled' : '';
    const downDisabled = index >= siblings.length - 1 ? 'disabled' : '';
    const controlsHtml = `
      <div class="knowledge-admin-block-card__controls">
        <button type="button" class="btn-save knowledge-block-btn" title="Выше" ${upDisabled} onclick="AdminKnowledge.moveBlockUp('${pathStr}')">▲</button>
        <button type="button" class="btn-save knowledge-block-btn" title="Ниже" ${downDisabled} onclick="AdminKnowledge.moveBlockDown('${pathStr}')">▼</button>
        ${renderMoveToGroupControl(pathStr, block.id)}
        ${canUnnest ? `<button type="button" class="btn-save knowledge-block-btn" title="Вынести из группы" onclick="AdminKnowledge.unnestBlock('${pathStr}')">←</button>` : ''}
        <button type="button" class="btn-delete knowledge-block-btn" title="Удалить" onclick="AdminKnowledge.removeBlock('${pathStr}')">×</button>
      </div>`;

    const headerHtml = isGroup
      ? `
          <div class="knowledge-admin-block-card__header">
            <div class="knowledge-admin-block-card__lead">
              <button type="button" class="knowledge-group-collapse-btn" aria-expanded="${isExpanded ? 'true' : 'false'}" title="${isExpanded ? 'Свернуть группу' : 'Развернуть группу'}" onclick="AdminKnowledge.toggleGroupCollapsed('${block.id}')">${isExpanded ? '▼' : '▶'}</button>
              <span class="block-badge" style="background:${meta.color}; color:#fff; padding:3px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; cursor:pointer; user-select:none;" onclick="AdminKnowledge.toggleGroupCollapsed('${block.id}')">${meta.label}</span>
              ${!isExpanded ? `<span class="knowledge-group-summary">${escapeAttr(block.value || 'Без названия')}</span>` : ''}
              ${!isExpanded ? `<span class="knowledge-group-count">${childCount} эл.</span>` : ''}
            </div>
            ${controlsHtml}
          </div>
          <div class="knowledge-admin-block-card__body"${isExpanded ? '' : ' hidden'}>
            ${renderBlockFields(block)}
          </div>`
      : (() => {
          const compact = renderCompactBlockContent(block);
          return `
          <div class="knowledge-admin-block-card__toolbar knowledge-admin-block-card__toolbar--${block.type}">
            <span class="block-badge" style="background:${meta.color}; color:#fff; padding:3px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold;">${meta.label}</span>
            ${compact.fields}
            ${controlsHtml}
          </div>
          ${compact.footer}`;
        })();

    const cardClassFinal = isGroup
      ? cardClass
      : `admin-subcard knowledge-admin-block-card knowledge-admin-block-card--compact knowledge-admin-block-card--${block.type}`;

    return `
      <div class="${nodeClass}" data-block-path="${pathStr}">
        <div class="${isGroup ? cardClass : cardClassFinal}">
          ${headerHtml}
        </div>
      </div>`;
  }

  function renderBlocksAdmin(data) {
    const el = document.getElementById('knowledgeBlocksAdmin');
    if (!el) return;
    const list = data.blocks || [];

    if (list.length === 0) {
      el.innerHTML = `<div style="text-align:center; padding:30px; border:2px dashed var(--card-border); border-radius:12px; color:var(--text-secondary);">Нет добавленных блоков. Нажмите кнопки выше, чтобы добавить заголовок, текст, группу или документ.</div>`;
      return;
    }

    el.innerHTML = list.map((block, i) => renderBlockAdminCard(block, [i])).join('');
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
      titleFontSize: document.getElementById('knowledge_hero_title_size')?.value || '',
      titleFontWeight: document.getElementById('knowledge_hero_title_weight')?.value || '',
      titleItalic: document.getElementById('knowledge_hero_title_italic')?.checked || false,
      titleUnderline: document.getElementById('knowledge_hero_title_underline')?.checked || false,
      subtitle: document.getElementById('knowledge_hero_subtitle')?.value ?? hero.subtitle ?? '',
      subtitleColor: document.getElementById('knowledge_hero_subtitle_color')?.value ?? hero.subtitleColor ?? '#FFFFFF',
      subtitleTop: parseInt(document.getElementById('knowledge_hero_subtitle_top')?.value || 213, 10),
      subtitleLeft: parseInt(document.getElementById('knowledge_hero_subtitle_left')?.value || 70, 10),
      subtitleFontSize: document.getElementById('knowledge_hero_subtitle_size')?.value || '',
      subtitleFontWeight: document.getElementById('knowledge_hero_subtitle_weight')?.value || '',
      subtitleItalic: document.getElementById('knowledge_hero_subtitle_italic')?.checked || false,
      subtitleUnderline: document.getElementById('knowledge_hero_subtitle_underline')?.checked || false
    };

    data.blocks = (data.blocks || []).map(collectBlockFromDom);
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
      window.knowledgePageData.blocks.push(createKnowledgeBlock('header'));
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    addTextBlock() {
      window.saveKnowledgePageStateToMemory?.();
      window.knowledgePageData.blocks.push(createKnowledgeBlock('text'));
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    addFileBlock() {
      window.saveKnowledgePageStateToMemory?.();
      window.knowledgePageData.blocks.push(createKnowledgeBlock('file'));
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    addGroupBlock() {
      window.saveKnowledgePageStateToMemory?.();
      window.knowledgePageData.blocks.push(createKnowledgeBlock('group'));
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    toggleGroupCollapsed(blockId) {
      window.saveKnowledgePageStateToMemory?.();
      if (expandedAdminGroups.has(blockId)) {
        expandedAdminGroups.delete(blockId);
      } else {
        expandedAdminGroups.add(blockId);
      }
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    addChildBlock(parentPathStr, type) {
      window.saveKnowledgePageStateToMemory?.();
      const path = parseBlockPath(parentPathStr);
      const resolved = resolveBlockPath(window.knowledgePageData.blocks, path);
      if (!resolved?.block || resolved.block.type !== 'group') return;
      if (!Array.isArray(resolved.block.children)) resolved.block.children = [];
      resolved.block.children.push(createKnowledgeBlock(type));
      expandedAdminGroups.add(resolved.block.id);
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    removeBlock(pathStr) {
      window.saveKnowledgePageStateToMemory?.();
      const path = parseBlockPath(pathStr);
      const resolved = resolveBlockPath(window.knowledgePageData.blocks, path);
      if (!resolved) return;
      if (resolved.block?.type === 'group') {
        expandedAdminGroups.delete(resolved.block.id);
      }
      resolved.list.splice(resolved.index, 1);
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    moveBlockUp(pathStr) {
      window.saveKnowledgePageStateToMemory?.();
      const path = parseBlockPath(pathStr);
      const resolved = resolveBlockPath(window.knowledgePageData.blocks, path);
      if (!resolved || resolved.index <= 0) return;
      const { list, index } = resolved;
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    moveBlockDown(pathStr) {
      window.saveKnowledgePageStateToMemory?.();
      const path = parseBlockPath(pathStr);
      const resolved = resolveBlockPath(window.knowledgePageData.blocks, path);
      if (!resolved || resolved.index >= resolved.list.length - 1) return;
      const { list, index } = resolved;
      [list[index + 1], list[index]] = [list[index], list[index + 1]];
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    moveBlockToGroup(blockPathStr, targetGroupPathStr) {
      if (!targetGroupPathStr) return;
      window.saveKnowledgePageStateToMemory?.();
      const blockPath = parseBlockPath(blockPathStr);
      const targetPath = parseBlockPath(targetGroupPathStr);
      const blockResolved = resolveBlockPath(window.knowledgePageData.blocks, blockPath);
      const targetResolved = resolveBlockPath(window.knowledgePageData.blocks, targetPath);
      if (!blockResolved?.block || !targetResolved?.block || targetResolved.block.type !== 'group') return;
      if (isDescendantPath(blockPathStr, targetGroupPathStr)) return;

      const parentPathStr = pathToString(blockPath.slice(0, -1));
      if (parentPathStr === targetGroupPathStr) return;

      const [block] = blockResolved.list.splice(blockResolved.index, 1);
      if (!Array.isArray(targetResolved.block.children)) targetResolved.block.children = [];
      targetResolved.block.children.push(block);
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    nestIntoPreviousGroup(pathStr) {
      window.saveKnowledgePageStateToMemory?.();
      const path = parseBlockPath(pathStr);
      const resolved = resolveBlockPath(window.knowledgePageData.blocks, path);
      if (!resolved || resolved.index <= 0) return;
      const prev = resolved.list[resolved.index - 1];
      if (!prev || prev.type !== 'group') return;
      const [block] = resolved.list.splice(resolved.index, 1);
      if (!Array.isArray(prev.children)) prev.children = [];
      prev.children.push(block);
      renderKnowledgePageAdmin(window.knowledgePageData);
    },
    unnestBlock(pathStr) {
      window.saveKnowledgePageStateToMemory?.();
      const path = parseBlockPath(pathStr);
      if (path.length < 2) return;
      const resolved = resolveBlockPath(window.knowledgePageData.blocks, path);
      if (!resolved) return;
      const parentPath = path.slice(0, -1);
      const parentResolved = resolveBlockPath(window.knowledgePageData.blocks, parentPath);
      if (!parentResolved?.block || parentResolved.block.type !== 'group') return;

      const [block] = resolved.list.splice(resolved.index, 1);

      const containerPath = parentPath.slice(0, -1);
      let containerList;
      let insertAfterIndex;

      if (containerPath.length === 0) {
        containerList = window.knowledgePageData.blocks;
        insertAfterIndex = parentPath[0];
      } else {
        const containerResolved = resolveBlockPath(window.knowledgePageData.blocks, containerPath);
        if (!containerResolved?.block || containerResolved.block.type !== 'group') return;
        containerList = containerResolved.block.children;
        insertAfterIndex = parentPath[parentPath.length - 1];
      }

      containerList.splice(insertAfterIndex + 1, 0, block);
      renderKnowledgePageAdmin(window.knowledgePageData);
    }
  };
})();
