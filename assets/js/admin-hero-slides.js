/**
 * Админка: до 8 слайдов баннера (как на главной).
 */
(function () {
  const MAX = window.HeroSlides?.MAX_HERO_SLIDES || 8;

  function escapeAttr(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function blockHeaderWithColorHtml(title, colorId, colorValue, defaultColor, fontSize, fontWeight, italic, underline) {
    const color = /^#[0-9A-Fa-f]{6}$/.test(colorValue || '') ? colorValue : defaultColor;
    const sizeId = colorId.replace('_color', '_size');
    const weightId = colorId.replace('_color', '_weight');
    const italicId = colorId.replace('_color', '_italic');
    const underlineId = colorId.replace('_color', '_underline');
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <span style="font-weight:600; font-size:0.95rem;">${title}</span>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <input type="number" id="${sizeId}" value="${escapeAttr(fontSize)}" placeholder="px" title="Размер шрифта" style="width:55px; height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; text-align:center; margin-bottom:0;">
          <select id="${weightId}" title="Толщина шрифта" style="height:30px; padding:4px 6px; font-size:0.85rem; border:1px solid var(--card-border); border-radius:4px; background:rgba(0,0,0,0.1); color:inherit; cursor:pointer; margin-bottom:0;">
            <option value="" ${!fontWeight ? 'selected' : ''}>Толщина</option>
            <option value="300" ${fontWeight === '300' ? 'selected' : ''}>Тонкий</option>
            <option value="500" ${fontWeight === '500' ? 'selected' : ''}>Средний</option>
            <option value="700" ${fontWeight === '700' ? 'selected' : ''}>Толстый</option>
          </select>
          <label title="Курсив" style="display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:${italic ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'}; margin-bottom:0; font-style:italic; font-weight:bold; user-select:none; font-family:serif;">
            <input type="checkbox" id="${italicId}" ${italic ? 'checked' : ''} style="display:none;">
            I
          </label>
          <label title="Подчеркнутый" style="display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--card-border); border-radius:4px; cursor:pointer; background:${underline ? 'rgba(15,170,75,0.2)' : 'rgba(0,0,0,0.1)'}; margin-bottom:0; text-decoration:underline; font-weight:bold; user-select:none; font-family:serif;">
            <input type="checkbox" id="${underlineId}" ${underline ? 'checked' : ''} style="display:none;">
            U
          </label>
          <input type="color" id="${colorId}_picker" value="${escapeAttr(color)}" style="width:30px; height:30px; padding:0; border:none; border-radius:4px; cursor:pointer; background:transparent; margin-bottom:0;">
          <input type="text" class="form-control" id="${colorId}" value="${escapeAttr(colorValue || '')}" placeholder="${defaultColor}" style="max-width:90px; padding:4px 8px; font-size:0.85rem; font-family:monospace; margin-bottom:0;">
        </div>
      </div>`;
  }

  function heroBgUploadShell(id, label, pickHandler, clearHandler) {
    return `
      <div class="form-group hero-slide-upload-group" style="margin-bottom:0;">
        <label>${label}</label>
        <div class="hero-slide-frame hero-slide-frame--empty" data-upload-frame-for="${id}">
          <span class="hero-slide-frame__empty">пропорции 1520×420</span>
          <img id="${id}_preview" class="hero-slide-frame__img" src="" alt="">
        </div>
        <div class="hero-slide-upload-actions image-upload-mini" data-upload-id="${id}">
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="${pickHandler}('${id}')">Загрузить</button>
          <button type="button" class="btn-delete" style="padding:8px 14px;font-size:0.85rem;display:none;" id="${id}_clear" onclick="${clearHandler}('${id}')">Удалить</button>
          <input type="hidden" id="${id}_val" value="">
        </div>
      </div>`;
  }

  function slideHtml(slide, i, config) {
    const {
      prefix,
      removeHandler,
      pickHandler,
      clearHandler,
      subtitleUseBottom,
      defaults
    } = config;
    const d = defaults || {};
    const titleTop = slide.titleTop !== undefined ? slide.titleTop : d.titleTop ?? 122;
    const titleLeft = slide.titleLeft !== undefined ? slide.titleLeft : d.titleLeft ?? 70;
    const subtitleOffsetLabel = subtitleUseBottom ? 'Отступ снизу (px)' : 'Отступ сверху (px)';
    const subtitleOffsetId = subtitleUseBottom ? `${prefix}_subtitle_bottom_${i}` : `${prefix}_subtitle_top_${i}`;
    const subtitleOffsetVal = subtitleUseBottom
      ? (slide.subtitleBottom !== undefined ? slide.subtitleBottom : d.subtitleBottom ?? 40)
      : (slide.subtitleTop !== undefined ? slide.subtitleTop : d.subtitleTop ?? 213);
    const subtitleLeft = slide.subtitleLeft !== undefined ? slide.subtitleLeft : d.subtitleLeft ?? 70;
    const titleColorDefault = d.titleColor || '#ffffff';
    const subtitleColorDefault = d.subtitleColor || '#ffffff';
    const previewClass = config.previewClass || 'landing-live-banner-preview';

    return `
      <div class="admin-subcard" style="padding:16px;border:1px solid var(--card-border);border-radius:12px;position:relative;margin-bottom:20px;">
        <button type="button" class="btn-delete" style="position:absolute;top:10px;right:10px;z-index:2;" onclick="${removeHandler}(${i})">×</button>
        <div class="obuchenie-block-header"><strong>Слайд ${i + 1}</strong></div>
        <div class="obuchenie-hero-grid" style="margin-top:15px;">
          <div class="obuchenie-hero-banner-col">
            ${heroBgUploadShell(`${prefix}_bg_${i}`, 'Фон слайда (пропорции ~1520×420)', pickHandler, clearHandler)}
            <div style="margin-top:20px;">
              <label style="font-weight:600;display:block;margin-bottom:8px;font-size:0.9rem;color:var(--text-secondary);">Предпросмотр</label>
              <div class="${previewClass}" id="${prefix}_live_preview_${i}">
                <div class="live-banner-title">${escapeAttr(slide.title)}</div>
                <div class="live-banner-subtitle">${escapeAttr(slide.subtitle)}</div>
              </div>
            </div>
          </div>
          <div class="obuchenie-hero-fields-col" style="display:flex;flex-direction:column;gap:20px;">
            <div class="obuchenie-hero-block" style="border:1px solid var(--card-border);padding:15px;border-radius:8px;background:rgba(255,255,255,0.02);">
              ${blockHeaderWithColorHtml('Заголовок (Enter — перенос строки)', `${prefix}_title_color_${i}`, slide.titleColor, titleColorDefault, slide.titleFontSize, slide.titleFontWeight, slide.titleItalic, slide.titleUnderline)}
              <div class="form-group" style="margin-bottom:0;margin-top:8px;">
                <textarea class="form-control" id="${prefix}_title_${i}" rows="2" placeholder="Заголовок баннера">${escapeAttr(slide.title)}</textarea>
              </div>
              <div style="display:flex;gap:16px;margin-top:12px;">
                <div style="flex:1;margin-bottom:0;" class="form-group">
                  <label style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;">Отступ сверху (px)</label>
                  <input type="number" class="form-control" id="${prefix}_title_top_${i}" value="${titleTop}" style="padding:6px 10px;font-size:0.85rem;margin-bottom:0;">
                </div>
                <div style="flex:1;margin-bottom:0;" class="form-group">
                  <label style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;">Отступ слева (px)</label>
                  <input type="number" class="form-control" id="${prefix}_title_left_${i}" value="${titleLeft}" style="padding:6px 10px;font-size:0.85rem;margin-bottom:0;">
                </div>
              </div>
            </div>
            <div class="obuchenie-hero-block" style="border:1px solid var(--card-border);padding:15px;border-radius:8px;background:rgba(255,255,255,0.02);">
              ${blockHeaderWithColorHtml('Текст', `${prefix}_subtitle_color_${i}`, slide.subtitleColor, subtitleColorDefault, slide.subtitleFontSize, slide.subtitleFontWeight, slide.subtitleItalic, slide.subtitleUnderline)}
              <div class="form-group" style="margin-bottom:0;margin-top:8px;">
                <textarea class="form-control" id="${prefix}_subtitle_${i}" rows="3" placeholder="Описание/текст под заголовком">${escapeAttr(slide.subtitle)}</textarea>
              </div>
              <div style="display:flex;gap:16px;margin-top:12px;">
                <div style="flex:1;margin-bottom:0;" class="form-group">
                  <label style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;">${subtitleOffsetLabel}</label>
                  <input type="number" class="form-control" id="${subtitleOffsetId}" value="${subtitleOffsetVal}" style="padding:6px 10px;font-size:0.85rem;margin-bottom:0;">
                </div>
                <div style="flex:1;margin-bottom:0;" class="form-group">
                  <label style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px;">Отступ слева (px)</label>
                  <input type="number" class="form-control" id="${prefix}_subtitle_left_${i}" value="${subtitleLeft}" style="padding:6px 10px;font-size:0.85rem;margin-bottom:0;">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function readImageVal(id) {
    return document.getElementById(`${id}_val`)?.value || '';
  }

  function collect(prefix, options) {
    const { subtitleUseBottom = false } = options || {};
    const slides = [];
    const count = document.querySelectorAll(`[id^="${prefix}_bg_"][type="hidden"]`).length;
    for (let i = 0; i < count; i++) {
      const slide = {
        title: document.getElementById(`${prefix}_title_${i}`)?.value || '',
        titleColor: document.getElementById(`${prefix}_title_color_${i}`)?.value || '',
        titleTop: parseInt(document.getElementById(`${prefix}_title_top_${i}`)?.value || '122', 10),
        titleLeft: parseInt(document.getElementById(`${prefix}_title_left_${i}`)?.value || '70', 10),
        titleFontSize: document.getElementById(`${prefix}_title_size_${i}`)?.value || '',
        titleFontWeight: document.getElementById(`${prefix}_title_weight_${i}`)?.value || '',
        titleItalic: document.getElementById(`${prefix}_title_italic_${i}`)?.checked || false,
        titleUnderline: document.getElementById(`${prefix}_title_underline_${i}`)?.checked || false,
        subtitle: document.getElementById(`${prefix}_subtitle_${i}`)?.value || '',
        subtitleColor: document.getElementById(`${prefix}_subtitle_color_${i}`)?.value || '',
        subtitleLeft: parseInt(document.getElementById(`${prefix}_subtitle_left_${i}`)?.value || '70', 10),
        subtitleFontSize: document.getElementById(`${prefix}_subtitle_size_${i}`)?.value || '',
        subtitleFontWeight: document.getElementById(`${prefix}_subtitle_weight_${i}`)?.value || '',
        subtitleItalic: document.getElementById(`${prefix}_subtitle_italic_${i}`)?.checked || false,
        subtitleUnderline: document.getElementById(`${prefix}_subtitle_underline_${i}`)?.checked || false,
        background: readImageVal(`${prefix}_bg_${i}`)
      };
      if (subtitleUseBottom) {
        slide.subtitleBottom = parseInt(document.getElementById(`${prefix}_subtitle_bottom_${i}`)?.value || '40', 10);
      } else {
        slide.subtitleTop = parseInt(document.getElementById(`${prefix}_subtitle_top_${i}`)?.value || '213', 10);
      }
      slides.push(slide);
    }
    return slides;
  }

  function render(container, slides, config, setImageUploadState) {
    if (!container) return;
    container.innerHTML = '';
    (slides || []).forEach((slide, i) => {
      container.insertAdjacentHTML('beforeend', slideHtml(slide, i, config));
      if (typeof setImageUploadState === 'function') {
        setImageUploadState(`${config.prefix}_bg_${i}`, slide.background || '');
        const preview = document.getElementById(`${config.prefix}_live_preview_${i}`);
        if (preview && slide.background) {
          preview.style.backgroundImage = `url('${slide.background}')`;
        }
      }
    });
  }

  function isHeroBgUploadId(uploadId, prefix) {
    return Boolean(uploadId && uploadId.startsWith(`${prefix}_bg_`));
  }

  window.AdminHeroSlides = {
    MAX,
    render,
    collect,
    isHeroBgUploadId,
    readImageVal
  };
})();
