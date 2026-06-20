/**
 * Редактор страницы «Юридический консалтинг» для admin.html
 */
(function () {
  const DEFAULT_CONSULTING_PAGE = window.ConsultingContent?.CONSULTING_DEFAULTS || {
    hero: { background: '', graphic: '', title: '', subtitle: '' },
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
    }
    if (clr) clr.style.display = v ? 'inline-flex' : 'none';
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
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminConsultingPage.pickImage('${id}')">Загрузить</button>
          <button type="button" class="btn-delete" style="padding:8px 14px;font-size:0.85rem;display:none;" id="${id}_clear" onclick="AdminConsultingPage.clearImage('${id}')">Удалить</button>
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
      ${heroBgUploadShell('consulting_hero_bg', 'Готовый баннер (~1520×420 px)')}
      ${imageUploadHtml('consulting_hero_graphic', 'Декоративное изображение справа (~420×420)', 'Показывается, если баннер не загружен.')}
      <div class="form-group" style="margin-top:20px;">
        <label>Заголовок (Enter — перенос строки)</label>
        <textarea class="form-control" id="consulting_hero_title" rows="2">${escapeAttr(hero.title)}</textarea>
      </div>
      <div class="form-group">
        <label>Подзаголовок</label>
        <textarea class="form-control" id="consulting_hero_subtitle" rows="3">${escapeAttr(hero.subtitle)}</textarea>
      </div>`;
    setImageUploadState('consulting_hero_bg', hero.background);
    setImageUploadState('consulting_hero_graphic', hero.graphic);
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
        ${imageUploadHtml('consulting_why_side_image', 'Фоновое изображение блока', 'Рекомендуемый размер ~489×763 px (2× Retina: 978×1526) — заливает весь блок.')}
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
      subtitle: document.getElementById('consulting_hero_subtitle')?.value ?? data.hero?.subtitle ?? ''
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

  function getAspect(uploadId) {
    if (uploadId === 'consulting_hero_bg') return 1520 / 420;
    if (uploadId === 'consulting_hero_graphic') return 1;
    if (uploadId === 'consulting_why_photo') return 494 / 329;
    if (uploadId === 'consulting_why_side_image') return 489 / 763;
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
