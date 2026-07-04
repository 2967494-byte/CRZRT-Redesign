/**
 * Редактор страницы «Новости» для admin.html
 */
(function () {
  'use strict';

  const DEFAULT_NEWS_PAGE = window.NewsContent?.DEFAULT_NEWS_PAGE || {
    hero: {
      background: '', title: 'Новости', subtitle: '',
      titleColor: '#575B6D', titleTop: 122, titleLeft: 70,
      subtitleColor: '#FFFFFF', subtitleTop: 213, subtitleLeft: 70
    },
    items: []
  };

  let wysiwygBound = false;

  function escapeAttr(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function escapeHtml(s) {
    return escapeAttr(s);
  }

  function migrateNewsPageData(raw) {
    if (window.NewsContent?.migrateNewsPageData) {
      return window.NewsContent.migrateNewsPageData(raw);
    }
    return { ...DEFAULT_NEWS_PAGE, ...(raw || {}) };
  }

  function formatDateLabel(iso) {
    if (window.NewsContent?.formatNewsDateDisplay) {
      return window.NewsContent.formatNewsDateDisplay(iso);
    }
    return iso || '—';
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
    if (frame) frame.classList.toggle('hero-slide-frame--empty', !v);
    if (clr) clr.style.display = v ? 'inline-flex' : 'none';

    if (id === 'news_hero_bg') {
      const livePreview = document.getElementById('news_hero_live_preview');
      if (livePreview) {
        livePreview.style.backgroundImage = v
          ? `url('${v}')`
          : 'radial-gradient(32.3% 55.38% at 71.22% 54%, #FFFFFF 0%, #B8FDC6 100%)';
      }
      updateNewsLivePreview();
    }
  }

  function readColorVal(id, fallback) {
    const raw = document.getElementById(id)?.value || fallback || '';
    const normalized = String(raw).trim();
    if (/^#[0-9A-Fa-f]{6}$/i.test(normalized)) return normalized.toUpperCase();
    if (/^[0-9A-Fa-f]{6}$/.test(normalized)) return `#${normalized}`.toUpperCase();
    return fallback || '#575B6D';
  }

  function syncColorField(id, value, fromText) {
    const textEl = document.getElementById(id);
    const pickerEl = document.getElementById(`${id}_picker`);
    if (!textEl || !pickerEl) return;

    let normalized = String(value || '').trim();
    if (/^[0-9A-Fa-f]{6}$/.test(normalized)) normalized = `#${normalized}`;
    if (!/^#[0-9A-Fa-f]{6}$/i.test(normalized)) {
      if (fromText) return;
      normalized = '#000000';
    }

    textEl.value = normalized.toUpperCase();
    pickerEl.value = normalized.toLowerCase();
    updateNewsLivePreview();
  }

  function updateNewsLivePreview() {
    const titleEl = document.getElementById('news_hero_live_title');
    const subtitleEl = document.getElementById('news_hero_live_subtitle');
    const previewEl = document.getElementById('news_hero_live_preview');
    if (!titleEl || !subtitleEl || !previewEl) return;

    const titleText = document.getElementById('news_hero_title')?.value || '';
    const subtitleText = document.getElementById('news_hero_subtitle')?.value || '';
    const titleColor = readColorVal('news_hero_title_color', '#575B6D');
    const subtitleColor = readColorVal('news_hero_subtitle_color', '#FFFFFF');
    const bgImage = document.getElementById('news_hero_bg_val')?.value || '';

    const titleTop = parseFloat(document.getElementById('news_hero_title_top')?.value) || 122;
    const titleLeft = parseFloat(document.getElementById('news_hero_title_left')?.value) || 70;
    const subtitleTop = parseFloat(document.getElementById('news_hero_subtitle_top')?.value) || 213;
    const subtitleLeft = parseFloat(document.getElementById('news_hero_subtitle_left')?.value) || 70;

    previewEl.style.backgroundImage = bgImage
      ? `url('${bgImage.replace(/'/g, "\\'")}')`
      : 'radial-gradient(32.3% 55.38% at 71.22% 54%, #FFFFFF 0%, #B8FDC6 100%)';

    titleEl.textContent = titleText;
    titleEl.style.color = titleColor;
    titleEl.style.top = `calc((${titleTop} / 420) * 100%)`;
    titleEl.style.left = `calc((${titleLeft} / 1520) * 100%)`;
    titleEl.style.maxWidth = `calc(100% - ((${titleLeft} / 1520) * 100%) - 10px)`;
    titleEl.hidden = !titleText.trim();

    const titleSize = document.getElementById('news_hero_title_size')?.value || '';
    const titleWeight = document.getElementById('news_hero_title_weight')?.value || '';
    const titleItalic = document.getElementById('news_hero_title_italic')?.checked || false;
    const titleUnderline = document.getElementById('news_hero_title_underline')?.checked || false;
    if (titleSize) titleEl.style.fontSize = `calc((${titleSize} / 1520) * 100cqw)`; else titleEl.style.removeProperty('font-size');
    if (titleWeight) titleEl.style.fontWeight = titleWeight; else titleEl.style.removeProperty('font-weight');
    titleEl.style.fontStyle = titleItalic ? 'italic' : '';
    titleEl.style.textDecoration = titleUnderline ? 'underline' : '';

    subtitleEl.textContent = subtitleText;
    subtitleEl.style.color = subtitleColor;
    subtitleEl.style.top = `calc((${subtitleTop} / 420) * 100%)`;
    subtitleEl.style.left = `calc((${subtitleLeft} / 1520) * 100%)`;
    subtitleEl.style.maxWidth = `calc(100% - ((${subtitleLeft} / 1520) * 100%) - 10px)`;
    subtitleEl.hidden = !subtitleText.trim();

    const subtitleSize = document.getElementById('news_hero_subtitle_size')?.value || '';
    const subtitleWeight = document.getElementById('news_hero_subtitle_weight')?.value || '';
    const subtitleItalic = document.getElementById('news_hero_subtitle_italic')?.checked || false;
    const subtitleUnderline = document.getElementById('news_hero_subtitle_underline')?.checked || false;
    if (subtitleSize) subtitleEl.style.fontSize = `calc((${subtitleSize} / 1520) * 100cqw)`; else subtitleEl.style.removeProperty('font-size');
    if (subtitleWeight) subtitleEl.style.fontWeight = subtitleWeight; else subtitleEl.style.removeProperty('font-weight');
    subtitleEl.style.fontStyle = subtitleItalic ? 'italic' : '';
    subtitleEl.style.textDecoration = subtitleUnderline ? 'underline' : '';
  }

  function bindNewsHeroPreviewControls() {
    const selectors = [
      '#news_hero_title',
      '#news_hero_subtitle',
      '#news_hero_title_top',
      '#news_hero_title_left',
      '#news_hero_subtitle_top',
      '#news_hero_subtitle_left',
      '#news_hero_title_size',
      '#news_hero_title_weight',
      '#news_hero_subtitle_size',
      '#news_hero_subtitle_weight'
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (el.dataset.newsPreviewBound === 'true') return;
        el.dataset.newsPreviewBound = 'true';
        el.addEventListener('input', updateNewsLivePreview);
        el.addEventListener('change', updateNewsLivePreview);
      });
    });

    ['#news_hero_title_italic', '#news_hero_title_underline', '#news_hero_subtitle_italic', '#news_hero_subtitle_underline']
      .forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          if (el.dataset.newsPreviewBound === 'true') return;
          el.dataset.newsPreviewBound = 'true';
          el.addEventListener('change', updateNewsLivePreview);
        });
      });
  }

  function heroBgUploadShell(id, label, sizeLabel = '1520×420') {
    return `
      <div class="form-group hero-slide-upload-group" style="margin-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <label style="margin-bottom:0;">${label}</label>
          <div class="hero-slide-upload-actions image-upload-mini" data-upload-id="${id}" style="display:flex; gap:8px;">
            <button type="button" class="btn-save" style="padding:6px 12px;font-size:0.8rem;" onclick="AdminNews.pickImage('${id}')">Загрузить</button>
            <button type="button" class="btn-delete" style="padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;" id="${id}_clear" onclick="AdminNews.clearImage('${id}')">Удалить</button>
            <input type="hidden" id="${id}_val" value="">
          </div>
        </div>
        <div class="hero-slide-frame hero-slide-frame--empty" data-upload-frame-for="${id}">
          <span class="hero-slide-frame__empty">${sizeLabel}</span>
          <img id="${id}_preview" class="hero-slide-frame__img" src="" alt="">
        </div>
      </div>`;
  }

  function newsImageUploadShell(id) {
    return `
      <div class="form-group hero-slide-upload-group" style="margin-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <label style="margin-bottom:0;">Фото новости (511×474)</label>
          <div class="hero-slide-upload-actions image-upload-mini" data-upload-id="${id}" style="display:flex; gap:8px;">
            <button type="button" class="btn-save" style="padding:6px 12px;font-size:0.8rem;" onclick="AdminNews.pickImage('${id}')">Загрузить</button>
            <button type="button" class="btn-delete" style="padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;" id="${id}_clear" onclick="AdminNews.clearImage('${id}')">Удалить</button>
            <input type="hidden" id="${id}_val" value="">
          </div>
        </div>
        <div class="hero-slide-frame hero-slide-frame--empty" data-upload-frame-for="${id}">
          <span class="hero-slide-frame__empty">511×474</span>
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
            <input type="checkbox" id="${italicId}" ${italic ? 'checked' : ''} style="display:none;" onchange="this.parentElement.style.background = this.checked ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'; AdminNews.updateNewsLivePreview()">
            I
          </label>
          <label title="Подчеркнутый" style="display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:${underline ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'}; margin-bottom:0; text-decoration:underline; font-weight:bold; user-select:none; font-family:serif;">
            <input type="checkbox" id="${underlineId}" ${underline ? 'checked' : ''} style="display:none;" onchange="this.parentElement.style.background = this.checked ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'; AdminNews.updateNewsLivePreview()">
            U
          </label>
          <input type="color" id="${colorId}_picker" value="${escapeAttr(color)}" style="width:30px; height:30px; padding:0; border:none; border-radius:4px; cursor:pointer; background:transparent; margin-bottom:0;" oninput="AdminNews.syncColorField('${colorId}', this.value)">
          <input type="text" class="form-control" id="${colorId}" value="${escapeAttr(color)}" placeholder="${defaultColor}" style="max-width:90px; padding:4px 8px; font-size:0.85rem; font-family:monospace; margin-bottom:0;" oninput="AdminNews.syncColorField('${colorId}', this.value, true)">
        </div>
      </div>`;
  }

  function renderHeroAdmin(data) {
    const el = document.getElementById('newsHeroAdmin');
    if (!el) return;
    const hero = migrateNewsPageData(data).hero || {};
    el.innerHTML = `
      <div class="obuchenie-hero-grid">
        <div class="obuchenie-hero-banner-col">
          ${heroBgUploadShell('news_hero_bg', 'Готовый баннер (~1520×420 px)')}
          <div style="margin-top:20px;">
            <label style="font-weight:600; display:block; margin-bottom:8px; font-size:0.9rem; color:var(--text-secondary);">Предпросмотр баннера</label>
            <div class="ecp-live-banner-preview" id="news_hero_live_preview">
              <div class="live-banner-title" id="news_hero_live_title">${escapeAttr(hero.title)}</div>
              <div class="live-banner-subtitle" id="news_hero_live_subtitle">${escapeAttr(hero.subtitle)}</div>
            </div>
          </div>
        </div>
        <div class="obuchenie-hero-fields-col" style="display:flex; flex-direction:column; gap:20px;">
          <div class="obuchenie-hero-block" style="border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);">
            ${blockHeaderWithColorHtml('Заголовок', 'news_hero_title_color', hero.titleColor, '#575B6D', hero.titleFontSize, hero.titleFontWeight, hero.titleItalic, hero.titleUnderline)}
            <div class="form-group" style="margin-bottom:0; margin-top:8px;">
              <textarea class="form-control" id="news_hero_title" rows="2" oninput="AdminNews.updateNewsLivePreview()">${escapeAttr(hero.title)}</textarea>
            </div>
            <div style="display:flex; gap:16px; margin-top:12px;">
              <div style="flex:1;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary);">Отступ сверху (px)</label>
                <input type="number" class="form-control" id="news_hero_title_top" value="${hero.titleTop !== undefined ? hero.titleTop : 122}" oninput="AdminNews.updateNewsLivePreview()">
              </div>
              <div style="flex:1;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary);">Отступ слева (px)</label>
                <input type="number" class="form-control" id="news_hero_title_left" value="${hero.titleLeft !== undefined ? hero.titleLeft : 70}" oninput="AdminNews.updateNewsLivePreview()">
              </div>
            </div>
          </div>
          <div class="obuchenie-hero-block" style="border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);">
            ${blockHeaderWithColorHtml('Подзаголовок (необязательно)', 'news_hero_subtitle_color', hero.subtitleColor, '#FFFFFF', hero.subtitleFontSize, hero.subtitleFontWeight, hero.subtitleItalic, hero.subtitleUnderline)}
            <div class="form-group" style="margin-bottom:0; margin-top:8px;">
              <textarea class="form-control" id="news_hero_subtitle" rows="2" placeholder="Необязательно" oninput="AdminNews.updateNewsLivePreview()">${escapeAttr(hero.subtitle)}</textarea>
            </div>
            <div style="display:flex; gap:16px; margin-top:12px;">
              <div style="flex:1;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary);">Отступ сверху (px)</label>
                <input type="number" class="form-control" id="news_hero_subtitle_top" value="${hero.subtitleTop !== undefined ? hero.subtitleTop : 213}" oninput="AdminNews.updateNewsLivePreview()">
              </div>
              <div style="flex:1;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary);">Отступ слева (px)</label>
                <input type="number" class="form-control" id="news_hero_subtitle_left" value="${hero.subtitleLeft !== undefined ? hero.subtitleLeft : 70}" oninput="AdminNews.updateNewsLivePreview()">
              </div>
            </div>
          </div>
        </div>
      </div>`;

    setImageUploadState('news_hero_bg', hero.background);
    bindNewsHeroPreviewControls();
    updateNewsLivePreview();
  }

  function renderItemsAdmin(data) {
    const el = document.getElementById('newsItemsAdmin');
    if (!el) return;
    const items = data.items || [];

    if (!items.length) {
      el.innerHTML = '<p style="color:var(--text-secondary);">Новостей пока нет. Нажмите «Добавить новость».</p>';
      return;
    }

    el.innerHTML = `
      <table class="users-table" style="width:100%;">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Заголовок</th>
            <th style="width:180px;">Действия</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item, i) => `
            <tr>
              <td>${escapeHtml(formatDateLabel(item.date))}</td>
              <td><strong>${escapeHtml(item.title || 'Без заголовка')}</strong></td>
              <td style="white-space:nowrap;">
                <button type="button" class="btn-save" style="padding:4px 10px;font-size:0.8rem;margin-right:4px;" onclick="AdminNews.moveItemUp(${i})" ${i === 0 ? 'disabled' : ''}>▲</button>
                <button type="button" class="btn-save" style="padding:4px 10px;font-size:0.8rem;margin-right:4px;" onclick="AdminNews.moveItemDown(${i})" ${i === items.length - 1 ? 'disabled' : ''}>▼</button>
                <button type="button" class="btn-edit" onclick="AdminNews.openItemModal(${i})">Редактировать</button>
                <button type="button" class="btn-delete" onclick="AdminNews.removeItem(${i})">Удалить</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function bindWysiwyg() {
    if (wysiwygBound) return;
    const editor = document.getElementById('newsFormDescription');
    if (!editor) return;
    wysiwygBound = true;

    const buttons = document.querySelectorAll('#newsWysiwygToolbar .wysiwyg-btn');
    const fontSize = document.getElementById('newsWysiwygFontSize');
    const color = document.getElementById('newsWysiwygColor');

    function updateToolbar() {
      buttons.forEach((btn) => {
        const command = btn.getAttribute('data-command');
        btn.classList.toggle('active', document.queryCommandState(command));
      });
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.execCommand(btn.getAttribute('data-command'), false, null);
        editor.focus();
        updateToolbar();
      });
    });

    fontSize?.addEventListener('change', (e) => {
      document.execCommand('fontSize', false, e.target.value);
      editor.focus();
    });

    color?.addEventListener('input', (e) => {
      document.execCommand('foreColor', false, e.target.value);
      editor.focus();
    });

    editor.addEventListener('keyup', updateToolbar);
    editor.addEventListener('mouseup', updateToolbar);
  }

  function getCurrentImageUploadId() {
    return 'news_item_image';
  }

  function openItemModal(index) {
    window.saveNewsPageStateToMemory?.();
    const data = window.newsPageData || migrateNewsPageData(null);
    const item = index >= 0 ? data.items[index] : null;
    const modal = document.getElementById('newsItemModal');
    const titleEl = document.getElementById('newsItemModalTitle');
    const form = document.getElementById('newsItemForm');
    const editor = document.getElementById('newsFormDescription');

    if (!modal || !form) return;

    document.getElementById('newsFormIndex').value = index >= 0 ? String(index) : '';
    document.getElementById('newsFormId').value = item?.id || '';
    document.getElementById('newsFormTitle').value = item?.title || '';
    document.getElementById('newsFormDate').value = item?.date || '';
    if (editor) editor.innerHTML = item?.text || '';
    setImageUploadState(getCurrentImageUploadId(), item?.image || '');

    if (titleEl) titleEl.textContent = item ? 'Редактировать новость' : 'Добавить новость';
    modal.style.display = 'flex';
    bindWysiwyg();
    document.getElementById('newsFormTitle')?.focus();
  }

  function closeItemModal() {
    const modal = document.getElementById('newsItemModal');
    if (modal) modal.style.display = 'none';
    document.getElementById('newsItemForm')?.reset();
    const editor = document.getElementById('newsFormDescription');
    if (editor) editor.innerHTML = '';
    setImageUploadState(getCurrentImageUploadId(), '');
  }

  function saveItemFromModal(event) {
    event.preventDefault();
    window.saveNewsPageStateToMemory?.();

    const data = window.newsPageData || migrateNewsPageData(null);
    const indexRaw = document.getElementById('newsFormIndex')?.value;
    const index = indexRaw !== '' ? parseInt(indexRaw, 10) : -1;
    const editor = document.getElementById('newsFormDescription');

    const payload = window.NewsContent?.normalizeNewsItem
      ? window.NewsContent.normalizeNewsItem({
          id: document.getElementById('newsFormId')?.value || `news_${Date.now()}`,
          title: document.getElementById('newsFormTitle')?.value || '',
          date: document.getElementById('newsFormDate')?.value || '',
          image: document.getElementById(`${getCurrentImageUploadId()}_val`)?.value || '',
          text: editor?.innerHTML || '',
          active: true
        }, data.items.length)
      : {
          id: document.getElementById('newsFormId')?.value || `news_${Date.now()}`,
          title: document.getElementById('newsFormTitle')?.value?.trim() || '',
          date: document.getElementById('newsFormDate')?.value || '',
          image: document.getElementById(`${getCurrentImageUploadId()}_val`)?.value || '',
          text: editor?.innerHTML || '',
          active: true
        };

    if (index >= 0 && data.items[index]) {
      data.items[index] = { ...data.items[index], ...payload };
    } else {
      data.items.push(payload);
    }

    window.newsPageData = data;
    closeItemModal();
    renderNewsPageAdmin(data);
  }

  function renderNewsPageAdmin(data) {
    const uploadHost = document.getElementById('newsItemImageUpload');
    if (uploadHost && !uploadHost.dataset.ready) {
      uploadHost.innerHTML = newsImageUploadShell('news_item_image');
      uploadHost.dataset.ready = 'true';
    }
    renderHeroAdmin(data);
    renderItemsAdmin(data);
    bindNewsModalEvents();
  }

  function bindNewsModalEvents() {
    const form = document.getElementById('newsItemForm');
    if (form && !form.dataset.bound) {
      form.dataset.bound = 'true';
      form.addEventListener('submit', saveItemFromModal);
      document.getElementById('newsItemModalClose')?.addEventListener('click', closeItemModal);
      document.getElementById('newsItemModalCancel')?.addEventListener('click', closeItemModal);
    }
  }

  function readImageVal(id) {
    return document.getElementById(`${id}_val`)?.value || '';
  }

  function collectNewsPageFromForm(existing) {
    const data = migrateNewsPageData(existing || window.newsPageData || {});
    const hero = data.hero || {};

    data.hero = {
      background: readImageVal('news_hero_bg') || hero.background || '',
      title: document.getElementById('news_hero_title')?.value ?? hero.title ?? '',
      titleColor: document.getElementById('news_hero_title_color')?.value ?? hero.titleColor ?? '#575B6D',
      titleTop: parseInt(document.getElementById('news_hero_title_top')?.value || 122, 10),
      titleLeft: parseInt(document.getElementById('news_hero_title_left')?.value || 70, 10),
      titleFontSize: document.getElementById('news_hero_title_size')?.value || '',
      titleFontWeight: document.getElementById('news_hero_title_weight')?.value || '',
      titleItalic: document.getElementById('news_hero_title_italic')?.checked || false,
      titleUnderline: document.getElementById('news_hero_title_underline')?.checked || false,
      subtitle: document.getElementById('news_hero_subtitle')?.value ?? hero.subtitle ?? '',
      subtitleColor: document.getElementById('news_hero_subtitle_color')?.value ?? hero.subtitleColor ?? '#FFFFFF',
      subtitleTop: parseInt(document.getElementById('news_hero_subtitle_top')?.value || 213, 10),
      subtitleLeft: parseInt(document.getElementById('news_hero_subtitle_left')?.value || 70, 10),
      subtitleFontSize: document.getElementById('news_hero_subtitle_size')?.value || '',
      subtitleFontWeight: document.getElementById('news_hero_subtitle_weight')?.value || '',
      subtitleItalic: document.getElementById('news_hero_subtitle_italic')?.checked || false,
      subtitleUnderline: document.getElementById('news_hero_subtitle_underline')?.checked || false
    };

    data.items = Array.isArray(data.items) ? data.items : [];
    return data;
  }

  function pickImage(uploadId) {
    window.cropTarget = { uploadId, aspect: AdminNews.getAspect(uploadId) };
    document.getElementById('imageInput')?.click();
  }

  function clearImage(uploadId) {
    setImageUploadState(uploadId, '');
  }

  function applyCroppedImage(uploadId, dataUrl) {
    if (uploadId && uploadId.startsWith('news_')) {
      setImageUploadState(uploadId, dataUrl);
    }
  }

  function getAspect(uploadId) {
    if (uploadId === 'news_hero_bg') return 1520 / 420;
    if (uploadId === 'news_item_image') return 511 / 474;
    return 16 / 9;
  }

  function getCropSize(uploadId) {
    if (uploadId === 'news_hero_bg') return [1520, 420];
    if (uploadId === 'news_item_image') return [511, 474];
    return [1200, 675];
  }

  function isNewsUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('news_'));
  }

  window.AdminNews = {
    DEFAULT_NEWS_PAGE,
    migrateNewsPageData,
    renderNewsPageAdmin,
    collectNewsPageFromForm,
    pickImage,
    clearImage,
    applyCroppedImage,
    getAspect,
    getCropSize,
    isNewsUploadId,
    setImageUploadState,
    syncColorField,
    updateNewsLivePreview,
    openItemModal,
    closeItemModal,
    addItem() {
      openItemModal(-1);
    },
    removeItem(i) {
      window.saveNewsPageStateToMemory?.();
      window.newsPageData.items.splice(i, 1);
      renderNewsPageAdmin(window.newsPageData);
    },
    moveItemUp(i) {
      if (i <= 0) return;
      window.saveNewsPageStateToMemory?.();
      const list = window.newsPageData.items;
      [list[i - 1], list[i]] = [list[i], list[i - 1]];
      renderNewsPageAdmin(window.newsPageData);
    },
    moveItemDown(i) {
      const list = window.newsPageData.items;
      if (i >= list.length - 1) return;
      window.saveNewsPageStateToMemory?.();
      [list[i + 1], list[i]] = [list[i], list[i + 1]];
      renderNewsPageAdmin(window.newsPageData);
    }
  };
})();
