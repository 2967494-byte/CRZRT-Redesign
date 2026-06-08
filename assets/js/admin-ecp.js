/**
 * Редактор страницы ЭТП для admin.html
 */
(function () {
  const DEFAULT_ECP_PAGE = window.EcpContent?.ECP_DEFAULTS || {
    hero: { background: '' },
    tariffs: [],
    blanks: { patternImage: '', items: [] },
    manual: { bookImage: '', items: [] },
    videos: [],
    support: { title: '', items: [], buttonText: '', buttonLink: '', image: '' }
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
  }

  function heroBgUploadShell(id, label) {
    return `
      <div class="form-group hero-slide-upload-group" style="margin-bottom:0;">
        <label>${label}</label>
        <div class="hero-slide-frame hero-slide-frame--empty" data-upload-frame-for="${id}">
          <span class="hero-slide-frame__empty">1520×420</span>
          <img id="${id}_preview" class="hero-slide-frame__img" src="" alt="">
        </div>
        <div class="hero-slide-upload-actions image-upload-mini" data-upload-id="${id}">
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminEcp.pickImage('${id}')">Загрузить</button>
          <button type="button" class="btn-delete" style="padding:8px 14px;font-size:0.85rem;display:none;" id="${id}_clear" onclick="AdminEcp.clearImage('${id}')">Удалить</button>
          <input type="hidden" id="${id}_val" value="">
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

  function renderHeroAdmin(data) {
    const el = document.getElementById('ecpHeroAdmin');
    if (!el) return;
    const hero = data.hero || {};
    el.innerHTML = heroBgUploadShell('ecp_hero_bg', 'Готовый баннер (~1520×420 px, как на главной)');
    setImageUploadState('ecp_hero_bg', hero.background);
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
    const support = data.support || {};
    const items = support.items || [];
    el.innerHTML = `
      <div class="form-group"><label>Заголовок</label>
        <input type="text" class="form-control" id="ecp_support_title" value="${escapeAttr(support.title)}"></div>
      <div class="form-group"><label>Пункты списка (по одному на строку)</label>
        <textarea class="form-control" id="ecp_support_items" rows="5">${escapeAttr(items.join('\n'))}</textarea></div>
      <div class="form-group"><label>Текст кнопки</label>
        <input type="text" class="form-control" id="ecp_support_btn_text" value="${escapeAttr(support.buttonText)}"></div>
      <div class="form-group"><label>Ссылка кнопки «Узнать подробнее»</label>
        <input type="text" class="form-control" id="ecp_support_btn_link" value="${escapeAttr(support.buttonLink)}" placeholder="#contacts или https://..."></div>
      ${imageUploadHtml('ecp_support_image', 'Изображение баннера (рукопожатие)')}
    `;
    setImageUploadState('ecp_support_image', support.image);
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
    const data = migrateEcpPageData(existing || window.ecpPageData || {});

    data.hero = {
      background: readImageVal('ecp_hero_bg')
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

    const supportItemsRaw = document.getElementById('ecp_support_items')?.value || '';
    data.support = {
      title: document.getElementById('ecp_support_title')?.value || '',
      items: supportItemsRaw.split('\n').map((s) => s.trim()).filter(Boolean),
      buttonText: document.getElementById('ecp_support_btn_text')?.value || '',
      buttonLink: document.getElementById('ecp_support_btn_link')?.value || '#contacts',
      image: readImageVal('ecp_support_image')
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
    if (uploadId === 'ecp_blanks_pattern') return 90 / 107;
    if (uploadId === 'ecp_manual_book') return 396 / 509;
    if (uploadId === 'ecp_support_image') return 887 / 698;
    if (uploadId.startsWith('ecp_video_thumb_')) return 474 / 290;
    return 16 / 9;
  }

  function getCropSize(uploadId) {
    if (uploadId === 'ecp_hero_bg') return [1520, 420];
    if (uploadId === 'ecp_blanks_pattern') return [400, 480];
    if (uploadId === 'ecp_manual_book') return [396, 509];
    if (uploadId === 'ecp_support_image') return [887, 698];
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
