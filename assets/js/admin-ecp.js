/**
 * Редактор страницы ЭТП для admin.html
 */
(function () {
  const DEFAULT_ECP_PAGE = window.EcpContent?.ECP_DEFAULTS || {
    hero: { 
      background: '', title: '', subtitle: '',
      titleColor: '#ffffff', titleTop: 122, titleLeft: 70,
      subtitleColor: '#ffffff', subtitleTop: 213, subtitleLeft: 70
    },
    tariffs: [],
    blanks: { patternImage: '', items: [] },
    manual: { bookImage: '', items: [] },
    videos: [],
    support: {
      background: '',
      title: '',
      items: [],
      buttonText: '',
      buttonLink: '#contacts'
    }
  };

  function escapeAttr(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function migrateEcpPageData(raw) {
    if (window.EcpContent?.migrateEcpData) {
      return window.EcpContent.migrateEcpData(raw);
    }
    return { ...DEFAULT_ECP_PAGE, ...(raw || {}) };
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

    if (id === 'ecp_hero_bg') {
        const livePreview = document.getElementById('ecp_hero_live_preview');
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
            <button type="button" class="btn-save" style="padding:6px 12px;font-size:0.8rem;" onclick="AdminEcp.pickImage('${id}')">Загрузить</button>
            <button type="button" class="btn-delete" style="padding:6px 12px;font-size:0.8rem;display:none;margin-left:0 !important;" id="${id}_clear" onclick="AdminEcp.clearImage('${id}')">Удалить</button>
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

  function setFileUploadState(id, url, name) {
    const val = document.getElementById(id);
    const label = document.getElementById(`${id}_name`);
    if (val) val.value = url || '';
    if (label) {
      label.textContent = name || (url ? url.split('/').pop() : '');
      label.style.display = url ? 'inline' : 'none';
    }
  }

  function imageUploadHtml(id, label, hint) {
    return `
      <div class="form-group" style="margin-bottom:0;">
        <label>${label}</label>
        ${hint ? `<p style="color:var(--text-secondary);font-size:0.85rem;margin:-4px 0 8px;">${hint}</p>` : ''}
        <div class="image-upload-mini" data-upload-id="${id}">
          <img id="${id}_preview" src="" alt="" style="max-width:220px;max-height:160px;object-fit:contain;border-radius:8px;display:none;margin-bottom:8px;background:rgba(0,0,0,0.15);">
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminEcp.pickImage('${id}')">Загрузить</button>
          <button type="button" class="btn-delete" style="padding:8px 14px;margin-left:8px;font-size:0.85rem;display:none;" id="${id}_clear" onclick="AdminEcp.clearImage('${id}')">Удалить</button>
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
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminEcp.pickFile('${id}')">Загрузить файл</button>
        </div>
        <small id="${id}_name" style="display:${shownName ? 'inline' : 'none'};color:var(--text-secondary);margin-top:6px;">${escapeAttr(shownName)}</small>
      </div>`;
  }

  function getMigratedEcpData(data) {
    if (window.EcpContent?.migrateEcpData) {
      return window.EcpContent.migrateEcpData(data || {});
    }
    return { ...DEFAULT_ECP_PAGE, ...(data || {}) };
  }

  function renderHeroAdmin(data) {
    const el = document.getElementById('ecpHeroAdmin');
    if (!el) return;
    const hero = getMigratedEcpData(data).hero || {};
    el.innerHTML = `
      <div class="obuchenie-hero-grid">
        <!-- Left: Banner upload & Preview -->
        <div class="obuchenie-hero-banner-col">
          ${heroBgUploadShell('ecp_hero_bg', 'Готовый баннер (~1520×420 px)')}
          
          <div style="margin-top:20px;">
            <label style="font-weight:600; display:block; margin-bottom:8px; font-size:0.9rem; color:var(--text-secondary);">Предпросмотр готового баннера с наложенным текстом</label>
            <div class="ecp-live-banner-preview" id="ecp_hero_live_preview">
              <div class="live-banner-title" id="ecp_hero_live_title">${escapeAttr(hero.title)}</div>
              <div class="live-banner-subtitle" id="ecp_hero_live_subtitle">${escapeAttr(hero.subtitle)}</div>
            </div>
          </div>
        </div>
        
        <!-- Right: Fields -->
        <div class="obuchenie-hero-fields-col" style="display:flex; flex-direction:column; gap:20px;">
          <!-- Block "Заголовок" -->
          <div class="obuchenie-hero-block" style="border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);">
            ${blockHeaderWithColorHtml('Заголовок (Enter — перенос строки)', 'ecp_hero_title_color', hero.titleColor, '#ffffff')}
            <div class="form-group" style="margin-bottom:0; margin-top:8px;">
              <textarea class="form-control" id="ecp_hero_title" rows="2" placeholder="Заголовок баннера (Enter — перенос строки)">${escapeAttr(hero.title)}</textarea>
            </div>
            <div style="display:flex; gap:16px; margin-top:12px;">
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ сверху (px)</label>
                <input type="number" class="form-control" id="ecp_hero_title_top" value="${hero.titleTop !== undefined ? hero.titleTop : 122}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ слева (px)</label>
                <input type="number" class="form-control" id="ecp_hero_title_left" value="${hero.titleLeft !== undefined ? hero.titleLeft : 70}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
            </div>
          </div>
          
          <!-- Block "Текст" -->
          <div class="obuchenie-hero-block" style="border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);">
            ${blockHeaderWithColorHtml('Текст', 'ecp_hero_subtitle_color', hero.subtitleColor, '#ffffff')}
            <div class="form-group" style="margin-bottom:0; margin-top:8px;">
              <textarea class="form-control" id="ecp_hero_subtitle" rows="3" placeholder="Описание/текст под заголовком">${escapeAttr(hero.subtitle)}</textarea>
            </div>
            <div style="display:flex; gap:16px; margin-top:12px;">
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ сверху (px)</label>
                <input type="number" class="form-control" id="ecp_hero_subtitle_top" value="${hero.subtitleTop !== undefined ? hero.subtitleTop : 213}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ слева (px)</label>
                <input type="number" class="form-control" id="ecp_hero_subtitle_left" value="${hero.subtitleLeft !== undefined ? hero.subtitleLeft : 70}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    ['title', 'subtitle'].forEach(field => {
        const input = document.getElementById(`ecp_hero_${field}`);
        const color = document.getElementById(`ecp_hero_${field}_color`);
        const colorPicker = document.getElementById(`ecp_hero_${field}_color_picker`);
        const top = document.getElementById(`ecp_hero_${field}_top`);
        const left = document.getElementById(`ecp_hero_${field}_left`);
        const live = document.getElementById(`ecp_hero_live_${field}`);

        if(input && live) input.addEventListener('input', e => live.innerText = e.target.value);
        if(color && live) color.addEventListener('input', e => { live.style.color = e.target.value; if(colorPicker) colorPicker.value = e.target.value; });
        if(colorPicker && live) colorPicker.addEventListener('input', e => { live.style.color = e.target.value; if(color) color.value = e.target.value; });
        if(top && live) top.addEventListener('input', e => live.style.top = `${(e.target.value / 420) * 100}%`);
        if(left && live) left.addEventListener('input', e => live.style.left = `${(e.target.value / 1520) * 100}%`);
    });

    setImageUploadState('ecp_hero_bg', hero.background);
    
    const liveTitle = document.getElementById('ecp_hero_live_title');
    if(liveTitle) {
      liveTitle.style.color = hero.titleColor || '#ffffff';
      liveTitle.style.top = `${((hero.titleTop !== undefined ? hero.titleTop : 122) / 420) * 100}%`;
      liveTitle.style.left = `${((hero.titleLeft !== undefined ? hero.titleLeft : 70) / 1520) * 100}%`;
    }
    const liveSubtitle = document.getElementById('ecp_hero_live_subtitle');
    if(liveSubtitle) {
      liveSubtitle.style.color = hero.subtitleColor || '#ffffff';
      liveSubtitle.style.top = `${((hero.subtitleTop !== undefined ? hero.subtitleTop : 213) / 420) * 100}%`;
      liveSubtitle.style.left = `${((hero.subtitleLeft !== undefined ? hero.subtitleLeft : 70) / 1520) * 100}%`;
    }
  }

  function renderTariffsAdmin(data) {
    const el = document.getElementById('ecpTariffsAdmin');
    if (!el) return;
    const list = data.tariffs || [];
    el.innerHTML = list
      .map(
        (item, i) => `
        <div class="admin-subcard" style="padding:16px;border:1px solid var(--card-border);border-radius:12px;position:relative;margin-bottom:12px;">
          <button type="button" class="btn-delete" style="position:absolute;top:10px;right:10px;" onclick="AdminEcp.removeTariff(${i})">×</button>
          <div class="form-group"><label>Название (Enter — перенос)</label>
            <textarea class="form-control" id="ecp_tariff_text_${i}" rows="2">${escapeAttr(item.text)}</textarea></div>
          ${fileUploadRow(`ecp_tariff_file_${i}`, 'Файл для скачивания', item.file || '', item.fileName)}
        </div>`
      )
      .join('');
  }

  function renderBlanksAdmin(data) {
    const el = document.getElementById('ecpBlanksAdmin');
    if (!el) return;
    const blanks = data.blanks || {};
    const items = blanks.items || [];
    el.innerHTML = `
      ${imageUploadHtml('ecp_blanks_pattern', 'Декоративный паттерн карточек', 'Используется справа в карточках бланков')}
      <div id="ecpBlanksItemsAdmin"></div>
    `;
    setImageUploadState('ecp_blanks_pattern', blanks.patternImage);
    const itemsEl = document.getElementById('ecpBlanksItemsAdmin');
    itemsEl.innerHTML = items
      .map(
        (item, i) => `
        <div class="admin-subcard" style="padding:16px;border:1px solid var(--card-border);border-radius:12px;position:relative;margin-bottom:12px;">
          <button type="button" class="btn-delete" style="position:absolute;top:10px;right:10px;" onclick="AdminEcp.removeBlank(${i})">×</button>
          <div class="form-group"><label>Текст карточки</label>
            <textarea class="form-control" id="ecp_blank_text_${i}" rows="3">${escapeAttr(item.text)}</textarea></div>
          ${fileUploadRow(`ecp_blank_file_${i}`, 'Файл для скачивания', item.file || '', item.fileName)}
        </div>`
      )
      .join('');
  }

  function renderManualAdmin(data) {
    const el = document.getElementById('ecpManualAdmin');
    if (!el) return;
    const manual = data.manual || {};
    const items = manual.items || [];
    el.innerHTML = `
      ${imageUploadHtml('ecp_manual_book', 'Изображение книги справа')}
      <div id="ecpManualItemsAdmin"></div>
    `;
    setImageUploadState('ecp_manual_book', manual.bookImage);
    const itemsEl = document.getElementById('ecpManualItemsAdmin');
    itemsEl.innerHTML = items
      .map(
        (item, i) => `
        <div class="admin-subcard" style="padding:16px;border:1px solid var(--card-border);border-radius:12px;position:relative;margin-bottom:12px;">
          <button type="button" class="btn-delete" style="position:absolute;top:10px;right:10px;" onclick="AdminEcp.removeManualItem(${i})">×</button>
          <div class="form-group"><label>Название документа</label>
            <input type="text" class="form-control" id="ecp_manual_title_${i}" value="${escapeAttr(item.title)}"></div>
          ${fileUploadRow(`ecp_manual_file_${i}`, 'PDF / файл', item.file || '', item.fileName)}
        </div>`
      )
      .join('');
  }

  function resolveAdminVideoPreview(video) {
    if (window.EcpContent?.resolveVideoThumbnail) {
      return window.EcpContent.resolveVideoThumbnail(video) || '';
    }
    return video?.thumbnail || '';
  }

  function renderVideosAdmin(data) {
    const el = document.getElementById('ecpVideosAdmin');
    if (!el) return;
    const list = data.videos || [];
    el.innerHTML = list
      .map((video, i) => {
        const thumb = resolveAdminVideoPreview(video);
        return `
        <div class="admin-subcard" style="padding:16px;border:1px solid var(--card-border);border-radius:12px;position:relative;margin-bottom:12px;">
          <button type="button" class="btn-delete" style="position:absolute;top:10px;right:10px;" onclick="AdminEcp.removeVideo(${i})">×</button>
          <div class="form-group"><label>Ссылка на видео</label>
            <input type="url" class="form-control" id="ecp_video_url_${i}" value="${escapeAttr(video.url)}" placeholder="https://youtube.com/... или https://vk.com/video..."></div>
          <div class="form-group"><label>Описание</label>
            <textarea class="form-control" id="ecp_video_title_${i}" rows="2">${escapeAttr(video.title)}</textarea></div>
          ${imageUploadHtml(`ecp_video_thumb_${i}`, 'Превью (необязательно)', 'Для YouTube, Rutube и VK подставится автоматически')}
          <img id="ecp_video_auto_preview_${i}" src="${escapeAttr(thumb)}" alt="" style="max-width:180px;border-radius:8px;margin-top:8px;${thumb ? '' : 'display:none;'}">
        </div>`;
      })
      .join('');
    list.forEach((video, i) => setImageUploadState(`ecp_video_thumb_${i}`, video.thumbnail || ''));
  }

  function renderSupportAdmin(data) {
    const el = document.getElementById('ecpSupportAdmin');
    if (!el) return;
    const support = getMigratedEcpData(data).support || {};
    const items = Array.isArray(support.items) ? support.items : [];
    el.innerHTML = `
      ${heroBgUploadShell(
        'ecp_support_bg',
        'Фон баннера (~1520×435 px, весь баннер целиком)',
        '1520×435'
      )}
      <div class="form-group" style="margin-top:20px;">
        <label>Заголовок</label>
        <input type="text" class="form-control" id="ecp_support_title" value="${escapeAttr(support.title)}">
      </div>
      <div class="form-group">
        <label>Пункты списка (по одному на строку)</label>
        <textarea class="form-control" id="ecp_support_items" rows="5">${escapeAttr(items.join('\n'))}</textarea>
      </div>
      <div class="form-group">
        <label>Текст кнопки</label>
        <input type="text" class="form-control" id="ecp_support_btn_text" value="${escapeAttr(support.buttonText)}">
      </div>
      <div class="form-group">
        <label>Ссылка кнопки «Узнать подробнее»</label>
        <input type="text" class="form-control" id="ecp_support_btn_link" value="${escapeAttr(support.buttonLink)}" placeholder="#contacts или https://...">
      </div>
    `;
    setImageUploadState('ecp_support_bg', support.background);
  }

  function renderEcpPageAdmin(data) {
    renderHeroAdmin(data);
    renderTariffsAdmin(data);
    renderBlanksAdmin(data);
    renderManualAdmin(data);
    renderVideosAdmin(data);
    renderSupportAdmin(data);
  }

  function readImageVal(id) {
    return document.getElementById(`${id}_val`)?.value || '';
  }

  function collectEcpPageFromForm(existing) {
    const data = getMigratedEcpData(existing || window.ecpPageData || {});
    const existingSupport = data.support || {};

    data.hero = {
      background: readImageVal('ecp_hero_bg') || data.hero?.background || '',
      title: document.getElementById('ecp_hero_title')?.value ?? data.hero?.title ?? '',
      titleColor: document.getElementById('ecp_hero_title_color')?.value ?? data.hero?.titleColor ?? '#ffffff',
      titleTop: parseInt(document.getElementById('ecp_hero_title_top')?.value || 122, 10),
      titleLeft: parseInt(document.getElementById('ecp_hero_title_left')?.value || 70, 10),
      subtitle: document.getElementById('ecp_hero_subtitle')?.value ?? data.hero?.subtitle ?? ECP_DEFAULTS.hero.subtitle,
      subtitleColor: document.getElementById('ecp_hero_subtitle_color')?.value ?? data.hero?.subtitleColor ?? '#ffffff',
      subtitleTop: parseInt(document.getElementById('ecp_hero_subtitle_top')?.value || 213, 10),
      subtitleLeft: parseInt(document.getElementById('ecp_hero_subtitle_left')?.value || 70, 10)
    };

    data.tariffs = [];
    const tariffCount = document.querySelectorAll('[id^="ecp_tariff_text_"]').length;
    for (let i = 0; i < tariffCount; i++) {
      data.tariffs.push({
        text: document.getElementById(`ecp_tariff_text_${i}`)?.value || '',
        file: document.getElementById(`ecp_tariff_file_${i}`)?.value || ''
      });
    }

    data.blanks = {
      patternImage: readImageVal('ecp_blanks_pattern'),
      items: []
    };
    const blankCount = document.querySelectorAll('[id^="ecp_blank_text_"]').length;
    for (let i = 0; i < blankCount; i++) {
      data.blanks.items.push({
        text: document.getElementById(`ecp_blank_text_${i}`)?.value || '',
        file: document.getElementById(`ecp_blank_file_${i}`)?.value || ''
      });
    }

    data.manual = {
      bookImage: readImageVal('ecp_manual_book'),
      items: []
    };
    const manualCount = document.querySelectorAll('[id^="ecp_manual_title_"]').length;
    for (let i = 0; i < manualCount; i++) {
      data.manual.items.push({
        title: document.getElementById(`ecp_manual_title_${i}`)?.value || '',
        file: document.getElementById(`ecp_manual_file_${i}`)?.value || ''
      });
    }

    data.videos = [];
    const videoCount = document.querySelectorAll('[id^="ecp_video_url_"]').length;
    for (let i = 0; i < videoCount; i++) {
      data.videos.push({
        url: document.getElementById(`ecp_video_url_${i}`)?.value || '',
        title: document.getElementById(`ecp_video_title_${i}`)?.value || '',
        thumbnail: readImageVal(`ecp_video_thumb_${i}`)
      });
    }

    const supportItemsRaw = document.getElementById('ecp_support_items')?.value;
    const supportTitle = document.getElementById('ecp_support_title')?.value;
    const supportBtnText = document.getElementById('ecp_support_btn_text')?.value;
    const supportBtnLink = document.getElementById('ecp_support_btn_link')?.value;

    data.support = {
      background: readImageVal('ecp_support_bg') || existingSupport.background || '',
      title: supportTitle != null ? supportTitle : (existingSupport.title || ''),
      items:
        supportItemsRaw != null
          ? supportItemsRaw.split('\n').map((s) => s.trim()).filter(Boolean)
          : (existingSupport.items || []),
      buttonText: supportBtnText != null ? supportBtnText : (existingSupport.buttonText || ''),
      buttonLink: supportBtnLink != null ? supportBtnLink : (existingSupport.buttonLink || '#contacts')
    };

    return data;
  }

  function pickImage(uploadId) {
    window.cropTarget = { uploadId, aspect: AdminEcp.getAspect(uploadId) };
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
    if (uploadId && uploadId.startsWith('ecp_')) {
      setImageUploadState(uploadId, dataUrl);
    }
  }

  function getAspect(uploadId) {
    if (uploadId === 'ecp_hero_bg') return 1520 / 420;
    if (uploadId === 'ecp_support_bg') return 1520 / 435;
    if (uploadId === 'ecp_blanks_pattern') return 90 / 107;
    if (uploadId === 'ecp_manual_book') return 396 / 509;
    if (uploadId.startsWith('ecp_video_thumb_')) return 474 / 290;
    return 16 / 9;
  }

  function getCropSize(uploadId) {
    if (uploadId === 'ecp_hero_bg') return [1520, 420];
    if (uploadId === 'ecp_support_bg') return [1520, 435];
    if (uploadId === 'ecp_blanks_pattern') return [400, 480];
    if (uploadId === 'ecp_manual_book') return [396, 509];
    if (uploadId.startsWith('ecp_video_thumb_')) return [474, 290];
    return [1200, 675];
  }

  function isEcpUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('ecp_'));
  }

  window.AdminEcp = {
    DEFAULT_ECP_PAGE,
    migrateEcpPageData,
    renderEcpPageAdmin,
    collectEcpPageFromForm,
    pickImage,
    pickFile,
    clearImage,
    applyCroppedImage,
    getAspect,
    getCropSize,
    isEcpUploadId,
    setFileUploadState,
    addTariff() {
      window.saveEcpPageStateToMemory?.();
      window.ecpPageData.tariffs.push({ text: '', file: '' });
      renderEcpPageAdmin(window.ecpPageData);
    },
    removeTariff(i) {
      window.saveEcpPageStateToMemory?.();
      window.ecpPageData.tariffs.splice(i, 1);
      renderEcpPageAdmin(window.ecpPageData);
    },
    addBlank() {
      window.saveEcpPageStateToMemory?.();
      if (!window.ecpPageData.blanks) window.ecpPageData.blanks = { patternImage: '', items: [] };
      window.ecpPageData.blanks.items.push({ text: '', file: '' });
      renderEcpPageAdmin(window.ecpPageData);
    },
    removeBlank(i) {
      window.saveEcpPageStateToMemory?.();
      window.ecpPageData.blanks.items.splice(i, 1);
      renderEcpPageAdmin(window.ecpPageData);
    },
    addManualItem() {
      window.saveEcpPageStateToMemory?.();
      if (!window.ecpPageData.manual) window.ecpPageData.manual = { bookImage: '', items: [] };
      window.ecpPageData.manual.items.push({ title: '', file: '' });
      renderEcpPageAdmin(window.ecpPageData);
    },
    removeManualItem(i) {
      window.saveEcpPageStateToMemory?.();
      window.ecpPageData.manual.items.splice(i, 1);
      renderEcpPageAdmin(window.ecpPageData);
    },
    addVideo() {
      window.saveEcpPageStateToMemory?.();
      window.ecpPageData.videos.push({ url: '', title: '', thumbnail: '' });
      renderEcpPageAdmin(window.ecpPageData);
    },
    removeVideo(i) {
      window.saveEcpPageStateToMemory?.();
      window.ecpPageData.videos.splice(i, 1);
      renderEcpPageAdmin(window.ecpPageData);
    }
  };
})();
