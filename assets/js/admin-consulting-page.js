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

  function renderHeroAdmin(data) {
    const el = document.getElementById('consultingPageHeroAdmin');
    if (!el) return;
    const hero = getMigratedData(data).hero || {};
    el.innerHTML = `
      <div class="obuchenie-hero-grid">
        <!-- Left: Banner upload & Preview -->
        <div class="obuchenie-hero-banner-col">
          ${heroBgUploadShell('consulting_hero_bg', 'Готовый баннер (~1520×420 px)')}
          
          <div style="margin-top:20px;">
            <label style="font-weight:600; display:block; margin-bottom:8px; font-size:0.9rem; color:var(--text-secondary);">Предпросмотр готового баннера с наложенным текстом</label>
            <div class="consulting-live-banner-preview" id="consulting_hero_live_preview">
              <div class="live-banner-title" id="consulting_hero_live_title">${escapeAttr(hero.title)}</div>
              <div class="live-banner-subtitle" id="consulting_hero_live_subtitle">${escapeAttr(hero.subtitle)}</div>
            </div>
          </div>
        </div>
        
        <!-- Right: Fields -->
        <div class="obuchenie-hero-fields-col" style="display:flex; flex-direction:column; gap:20px;">
          <!-- Block "Заголовок" -->
          <div class="obuchenie-hero-block" style="border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);">
            ${blockHeaderWithColorHtml('Заголовок (Enter — перенос строки)', 'consulting_hero_title_color', hero.titleColor, '#ffffff', hero.titleFontSize, hero.titleFontWeight, hero.titleItalic, hero.titleUnderline)}
            <div class="form-group" style="margin-bottom:0; margin-top:8px;">
              <textarea class="form-control" id="consulting_hero_title" rows="2" placeholder="Заголовок баннера (Enter — перенос строки)">${escapeAttr(hero.title)}</textarea>
            </div>
            <div style="display:flex; gap:16px; margin-top:12px;">
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ сверху (px)</label>
                <input type="number" class="form-control" id="consulting_hero_title_top" value="${hero.titleTop !== undefined ? hero.titleTop : 122}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ слева (px)</label>
                <input type="number" class="form-control" id="consulting_hero_title_left" value="${hero.titleLeft !== undefined ? hero.titleLeft : 70}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
            </div>
          </div>
          
          <!-- Block "Текст" -->
          <div class="obuchenie-hero-block" style="border: 1px solid var(--card-border); padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.02);">
            ${blockHeaderWithColorHtml('Текст', 'consulting_hero_subtitle_color', hero.subtitleColor, '#ffffff', hero.subtitleFontSize, hero.subtitleFontWeight, hero.subtitleItalic, hero.subtitleUnderline)}
            <div class="form-group" style="margin-bottom:0; margin-top:8px;">
              <textarea class="form-control" id="consulting_hero_subtitle" rows="3" placeholder="Описание/текст под заголовком">${escapeAttr(hero.subtitle)}</textarea>
            </div>
            <div style="display:flex; gap:16px; margin-top:12px;">
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ сверху (px)</label>
                <input type="number" class="form-control" id="consulting_hero_subtitle_top" value="${hero.subtitleTop !== undefined ? hero.subtitleTop : 213}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
              <div style="flex:1; margin-bottom:0;" class="form-group">
                <label style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px;">Отступ слева (px)</label>
                <input type="number" class="form-control" id="consulting_hero_subtitle_left" value="${hero.subtitleLeft !== undefined ? hero.subtitleLeft : 70}" style="padding:6px 10px; font-size:0.85rem; margin-bottom:0;">
              </div>
            </div>
          </div>
        </div>
      </div>`;

    ['title', 'subtitle'].forEach(field => {
        const input = document.getElementById(`consulting_hero_${field}`);
        const color = document.getElementById(`consulting_hero_${field}_color`);
        const colorPicker = document.getElementById(`consulting_hero_${field}_color_picker`);
        const top = document.getElementById(`consulting_hero_${field}_top`);
        const left = document.getElementById(`consulting_hero_${field}_left`);
        const live = document.getElementById(`consulting_hero_live_${field}`);
        const size = document.getElementById(`consulting_hero_${field}_size`);
        const weight = document.getElementById(`consulting_hero_${field}_weight`);
        const italic = document.getElementById(`consulting_hero_${field}_italic`);
        const underline = document.getElementById(`consulting_hero_${field}_underline`);

        if(input && live) input.addEventListener('input', e => live.innerText = e.target.value);
        if(color && live) color.addEventListener('input', e => { live.style.color = e.target.value; if(colorPicker) colorPicker.value = e.target.value; });
        if(colorPicker && live) colorPicker.addEventListener('input', e => { live.style.color = e.target.value; if(color) color.value = e.target.value; });
        if(top && live) top.addEventListener('input', e => live.style.top = `${(e.target.value / 420) * 100}%`);
        if(left && live) left.addEventListener('input', e => live.style.left = `${(e.target.value / 1520) * 100}%`);
        if(size && live) size.addEventListener('input', e => { if(e.target.value) live.style.fontSize = `${e.target.value}px`; else live.style.removeProperty('font-size'); });
        if(weight && live) weight.addEventListener('change', e => { if(e.target.value) live.style.fontWeight = e.target.value; else live.style.removeProperty('font-weight'); });
        if(italic && live) italic.addEventListener('change', e => { if(e.target.checked) live.style.fontStyle = 'italic'; else live.style.removeProperty('font-style'); });
        if(underline && live) underline.addEventListener('change', e => { if(e.target.checked) live.style.textDecoration = 'underline'; else live.style.removeProperty('text-decoration'); });
    });

    setImageUploadState('consulting_hero_bg', hero.background);
    setImageUploadState('consulting_hero_graphic', hero.graphic);
    
    const liveTitle = document.getElementById('consulting_hero_live_title');
    if(liveTitle) {
      liveTitle.style.color = hero.titleColor || '#ffffff';
      liveTitle.style.top = `${((hero.titleTop !== undefined ? hero.titleTop : 122) / 420) * 100}%`;
      liveTitle.style.left = `${((hero.titleLeft !== undefined ? hero.titleLeft : 70) / 1520) * 100}%`;
      if(hero.titleFontSize) liveTitle.style.fontSize = `${hero.titleFontSize}px`;
      if(hero.titleFontWeight) liveTitle.style.fontWeight = hero.titleFontWeight;
      if(hero.titleItalic) liveTitle.style.fontStyle = 'italic';
      if(hero.titleUnderline) liveTitle.style.textDecoration = 'underline';
    }
    const liveSubtitle = document.getElementById('consulting_hero_live_subtitle');
    if(liveSubtitle) {
      liveSubtitle.style.color = hero.subtitleColor || '#ffffff';
      liveSubtitle.style.top = `${((hero.subtitleTop !== undefined ? hero.subtitleTop : 213) / 420) * 100}%`;
      liveSubtitle.style.left = `${((hero.subtitleLeft !== undefined ? hero.subtitleLeft : 70) / 1520) * 100}%`;
      if(hero.subtitleFontSize) liveSubtitle.style.fontSize = `${hero.subtitleFontSize}px`;
      if(hero.subtitleFontWeight) liveSubtitle.style.fontWeight = hero.subtitleFontWeight;
      if(hero.subtitleItalic) liveSubtitle.style.fontStyle = 'italic';
      if(hero.subtitleUnderline) liveSubtitle.style.textDecoration = 'underline';
    }
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

      <div class="admin-card" style="margin:16px 0;padding:16px;background:rgba(255,255,255,0.03);">
        <strong style="display:block;margin-bottom:12px;">Блок 1 — большая карточка слева</strong>
        <div class="form-group">
          <label>Текст</label>
          <textarea class="form-control" id="consulting_why_lead_text" rows="3">${escapeAttr(lead.text)}</textarea>
        </div>
      </div>

      <div class="admin-card" style="margin:16px 0;padding:16px;background:rgba(255,255,255,0.03);">
        <strong style="display:block;margin-bottom:12px;">Блок 2 — фото с подписью</strong>
        ${imageUploadHtml('consulting_why_photo', 'Фото (~494×329)', '')}
        <div class="form-group" style="margin-top:12px;">
          <label>Подпись под фото</label>
          <input type="text" class="form-control" id="consulting_why_photo_caption" value="${escapeAttr(photo.caption)}">
        </div>
      </div>

      <div class="admin-card" style="margin:16px 0;padding:16px;background:rgba(255,255,255,0.03);">
        <strong style="display:block;margin-bottom:12px;">Блок 3 — «Помогаем на протяжении всего пути»</strong>
        <div class="form-group">
          <label>Текст (Enter — перенос строки)</label>
          <textarea class="form-control" id="consulting_why_support_text" rows="3">${escapeAttr(support.text)}</textarea>
        </div>
      </div>

      <div class="admin-card" style="margin:16px 0;padding:16px;background:rgba(255,255,255,0.03);">
        <strong style="display:block;margin-bottom:12px;">Блок 4 — боковая карточка</strong>
        <div class="form-group">
          <label>Текст</label>
          <textarea class="form-control" id="consulting_why_side_text" rows="3">${escapeAttr(side.text)}</textarea>
        </div>
        ${coverUploadShell(
          'consulting_why_side_image',
          'Фоновое изображение блока',
          'Заливает весь боковой блок. Рекомендуемый размер ~489×763 px (2× Retina: 978×1526).',
          489,
          763
        )}
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

  function collectConsultingPageFromForm(existing) {
    const data = getMigratedData(existing || window.consultingPageData || {});

    data.hero = {
      background: readImageVal('consulting_hero_bg') || data.hero?.background || '',
      graphic: readImageVal('consulting_hero_graphic') || data.hero?.graphic || '',
      title: document.getElementById('consulting_hero_title')?.value ?? data.hero?.title ?? '',
      titleColor: document.getElementById('consulting_hero_title_color')?.value ?? data.hero?.titleColor ?? '#ffffff',
      titleTop: parseInt(document.getElementById('consulting_hero_title_top')?.value || 122, 10),
      titleLeft: parseInt(document.getElementById('consulting_hero_title_left')?.value || 70, 10),
      titleFontSize: document.getElementById('consulting_hero_title_size')?.value || '',
      titleFontWeight: document.getElementById('consulting_hero_title_weight')?.value || '',
      titleItalic: document.getElementById('consulting_hero_title_italic')?.checked || false,
      titleUnderline: document.getElementById('consulting_hero_title_underline')?.checked || false,
      subtitle: document.getElementById('consulting_hero_subtitle')?.value ?? data.hero?.subtitle ?? CONSULTING_DEFAULTS.hero.subtitle,
      subtitleColor: document.getElementById('consulting_hero_subtitle_color')?.value ?? data.hero?.subtitleColor ?? '#ffffff',
      subtitleTop: parseInt(document.getElementById('consulting_hero_subtitle_top')?.value || 213, 10),
      subtitleLeft: parseInt(document.getElementById('consulting_hero_subtitle_left')?.value || 70, 10),
      subtitleFontSize: document.getElementById('consulting_hero_subtitle_size')?.value || '',
      subtitleFontWeight: document.getElementById('consulting_hero_subtitle_weight')?.value || '',
      subtitleItalic: document.getElementById('consulting_hero_subtitle_italic')?.checked || false,
      subtitleUnderline: document.getElementById('consulting_hero_subtitle_underline')?.checked || false
    };

    data.competenciesTitle =
      document.getElementById('consulting_competencies_title')?.value ?? data.competenciesTitle ?? '';

    data.competencies = [];
    const compCount = document.querySelectorAll('[id^="consulting_comp_text_"]').length;
    for (let i = 0; i < compCount; i++) {
      data.competencies.push({
        title: document.getElementById(`consulting_comp_text_${i}`)?.value || '',
        icon: readImageVal(`consulting_comp_icon_${i}`) || data.competencies?.[i]?.icon || '',
        link: document.getElementById(`consulting_comp_link_${i}`)?.value || '#competencies'
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
    if (uploadId === 'consulting_hero_bg') return 1520 / 420;
    if (uploadId === 'consulting_hero_graphic') return 1;
    if (uploadId === 'consulting_why_photo') return 494 / 329;
    if (uploadId === 'consulting_why_side_image') return CONSULTING_WHY_SIDE_ASPECT;
    if (uploadId.startsWith('consulting_comp_icon_')) return 109 / 110;
    return 16 / 9;
  }

  function getCropSize(uploadId) {
    if (uploadId === 'consulting_hero_bg') return [1520, 420];
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
    addCompetency() {
      window.saveConsultingPageStateToMemory?.();
      window.consultingPageData.competencies.push({
        title: '',
        icon: '',
        link: '#competencies'
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
