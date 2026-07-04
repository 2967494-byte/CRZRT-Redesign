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
    manual: { title: '', bookImage: '', items: [] },
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

    if (id === 'ecp_hero_bg' || id?.startsWith('ecp_hero_bg_')) {
        const idx = id.split('_').pop();
        const livePreview = document.getElementById(`ecp_hero_live_preview_${idx}`);
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

  function compactFileUploadHtml(id, value, fileName, label = 'Файл для скачивания') {
    const shownName = fileName || (value ? value.split('/').pop() : '');
    return `
      <div class="ecp-admin-card__file">
        <label for="${id}">${label}</label>
        <input type="text" class="form-control" id="${id}" value="${escapeAttr(value)}" placeholder="Ссылка или uploads/files/...">
        <button type="button" class="btn-save ecp-admin-card__upload-btn" onclick="AdminEcp.pickFile('${id}')">Загрузить файл</button>
        <small id="${id}_name" class="ecp-admin-card__file-name" style="display:${shownName ? 'block' : 'none'};">${escapeAttr(shownName)}</small>
      </div>`;
  }

  function ecpAdminGridHtml(gridModifier, cardsHtml) {
    return `<div class="ecp-admin-grid ${gridModifier}">${cardsHtml}</div>`;
  }

  function ecpAdminCardHtml(index, removeOnclick, bodyHtml) {
    return `
      <div class="ecp-admin-card">
        <div class="ecp-admin-card__head">
          <span class="ecp-admin-card__num">Карточка ${index + 1}</span>
          <button type="button" class="btn-delete ecp-admin-card__delete" onclick="${removeOnclick}">×</button>
        </div>
        ${bodyHtml}
      </div>`;
  }

  function getMigratedEcpData(data) {
    if (window.EcpContent?.migrateEcpData) {
      return window.EcpContent.migrateEcpData(data || {});
    }
    return { ...DEFAULT_ECP_PAGE, ...(data || {}) };
  }

  function ecpHeroSlidesConfig() {
    return {
      prefix: 'ecp_hero',
      removeHandler: 'AdminEcp.removeHeroSlide',
      pickHandler: 'AdminEcp.pickImage',
      clearHandler: 'AdminEcp.clearImage',
      previewClass: 'ecp-live-banner-preview',
      defaults: { titleColor: '#ffffff', subtitleColor: '#ffffff', titleTop: 122, titleLeft: 70, subtitleTop: 213, subtitleLeft: 70, titleFontSize: 60, subtitleFontSize: 20 }
    };
  }

  function renderHeroAdmin(data) {
    const el = document.getElementById('ecpHeroAdmin');
    if (!el || !window.AdminHeroSlides) return;
    AdminHeroSlides.render(el, getMigratedEcpData(data).heroSlides || [], ecpHeroSlidesConfig(), setImageUploadState);
  }

  function renderTariffsAdmin(data) {
    const el = document.getElementById('ecpTariffsAdmin');
    if (!el) return;
    const list = data.tariffs || [];
    el.innerHTML = ecpAdminGridHtml(
      'ecp-admin-grid--4',
      list
        .map((item, i) =>
          ecpAdminCardHtml(
            i,
            `AdminEcp.removeTariff(${i})`,
            `
          <div class="ecp-admin-card__field">
            <label for="ecp_tariff_text_${i}">Название (Enter — перенос)</label>
            <textarea class="form-control" id="ecp_tariff_text_${i}" rows="2">${escapeAttr(item.text)}</textarea>
          </div>
          ${compactFileUploadHtml(`ecp_tariff_file_${i}`, item.file || '', item.fileName)}`
          )
        )
        .join('')
    );
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
    itemsEl.innerHTML = ecpAdminGridHtml(
      'ecp-admin-grid--4',
      items
        .map((item, i) =>
          ecpAdminCardHtml(
            i,
            `AdminEcp.removeBlank(${i})`,
            `
          <div class="ecp-admin-card__field">
            <label for="ecp_blank_text_${i}">Текст карточки</label>
            <textarea class="form-control" id="ecp_blank_text_${i}" rows="3">${escapeAttr(item.text)}</textarea>
          </div>
          ${compactFileUploadHtml(`ecp_blank_file_${i}`, item.file || '', item.fileName)}`
          )
        )
        .join('')
    );
  }

  function renderManualAdmin(data) {
    const el = document.getElementById('ecpManualAdmin');
    if (!el) return;
    const manual = data.manual || {};
    const items = manual.items || [];
    el.innerHTML = `
      <div class="form-group">
        <label for="ecp_manual_section_title">Заголовок блока (Enter — перенос)</label>
        <textarea class="form-control" id="ecp_manual_section_title" rows="2">${escapeAttr(manual.title)}</textarea>
      </div>
      ${imageUploadHtml('ecp_manual_book', 'Изображение книги справа')}
      <div id="ecpManualItemsAdmin"></div>
    `;
    setImageUploadState('ecp_manual_book', manual.bookImage);
    const itemsEl = document.getElementById('ecpManualItemsAdmin');
    itemsEl.innerHTML = ecpAdminGridHtml(
      'ecp-admin-grid--4',
      items
        .map((item, i) =>
          ecpAdminCardHtml(
            i,
            `AdminEcp.removeManualItem(${i})`,
            `
          <div class="ecp-admin-card__field">
            <label for="ecp_manual_title_${i}">Название документа</label>
            <input type="text" class="form-control" id="ecp_manual_title_${i}" value="${escapeAttr(item.title)}">
          </div>
          ${compactFileUploadHtml(`ecp_manual_file_${i}`, item.file || '', item.fileName, 'PDF / файл')}`
          )
        )
        .join('')
    );
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
    el.innerHTML = ecpAdminGridHtml(
      'ecp-admin-grid--3',
      list
        .map((video, i) => {
          const thumb = resolveAdminVideoPreview(video);
          return ecpAdminCardHtml(
            i,
            `AdminEcp.removeVideo(${i})`,
            `
          <div class="ecp-admin-card__field">
            <label for="ecp_video_url_${i}">Ссылка на видео</label>
            <input type="url" class="form-control" id="ecp_video_url_${i}" value="${escapeAttr(video.url)}" placeholder="https://youtube.com/...">
          </div>
          <div class="ecp-admin-card__field">
            <label for="ecp_video_title_${i}">Описание</label>
            <textarea class="form-control" id="ecp_video_title_${i}" rows="2">${escapeAttr(video.title)}</textarea>
          </div>
          <div class="ecp-admin-card__thumb">
            ${imageUploadHtml(`ecp_video_thumb_${i}`, 'Превью (необязательно)', 'Для YouTube, Rutube и VK подставится автоматически')}
            <img id="ecp_video_auto_preview_${i}" class="ecp-admin-card__auto-preview" src="${escapeAttr(thumb)}" alt="" style="${thumb ? '' : 'display:none;'}">
          </div>`
          );
        })
        .join('')
    );
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

    data.heroSlides = window.AdminHeroSlides ? AdminHeroSlides.collect('ecp_hero') : [];
    data.hero = data.heroSlides[0] || data.hero || {};

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
      title: document.getElementById('ecp_manual_section_title')?.value ?? data.manual?.title ?? '',
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
    if (uploadId === 'ecp_hero_bg' || uploadId?.startsWith('ecp_hero_bg_')) return 1520 / 420;
    if (uploadId === 'ecp_support_bg') return 1520 / 435;
    if (uploadId === 'ecp_blanks_pattern') return 90 / 107;
    if (uploadId === 'ecp_manual_book') return 396 / 509;
    if (uploadId.startsWith('ecp_video_thumb_')) return 474 / 290;
    return 16 / 9;
  }

  function getCropSize(uploadId) {
    if (uploadId === 'ecp_hero_bg' || uploadId?.startsWith('ecp_hero_bg_')) return [1520, 420];
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
    addHeroSlide() {
      window.saveEcpPageStateToMemory?.();
      const page = window.ecpPageData || {};
      if (!page.heroSlides) page.heroSlides = [];
      if (page.heroSlides.length >= AdminHeroSlides.MAX) {
        alert(`Не более ${AdminHeroSlides.MAX} слайдов`);
        return;
      }
      page.heroSlides.push({ title: '', subtitle: '', background: '' });
      renderEcpPageAdmin(page);
    },
    removeHeroSlide(i) {
      window.saveEcpPageStateToMemory?.();
      const page = window.ecpPageData || {};
      if (!page.heroSlides?.length) return;
      page.heroSlides.splice(i, 1);
      if (!page.heroSlides.length) page.heroSlides.push({ title: '', subtitle: '', background: '' });
      renderEcpPageAdmin(page);
    },
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
      if (!window.ecpPageData.manual) window.ecpPageData.manual = { title: '', bookImage: '', items: [] };
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
