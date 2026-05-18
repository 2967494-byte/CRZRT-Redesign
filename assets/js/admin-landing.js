/**
 * Редактор главной страницы (лендинг) для admin.html
 */
(function () {
  const MAX_HERO_SLIDES = 8;

  /** Поля и сетка для логотипов партнёров (доли от стороны кадра 0–1) */
  const PARTNER_LOGO_CROP = {
    width: 400,
    height: 400,
    marginX: 0.18,
    marginY: 0.14,
    minZoomRatio: 0.02,
    zoomStep: 0.12
  };

  let partnerCropGuidesEl = null;

  const SERVICE_VARIANTS = [
    { id: 'green', label: 'Зелёная' },
    { id: 'peach', label: 'Персиковая' },
    { id: 'purple', label: 'Фиолетовая' },
    { id: 'blue', label: 'Голубая' }
  ];

  const DEFAULT_LANDING_MAIN = {
    heroSlides: [
      {
        title: 'Надежное тендерное\nсопровождение',
        subtitle: 'Поиск выгодных закупок\nи оценка целесообразности участия',
        background: 'assets/img/hero_section.png'
      }
    ],
    serviceCards: [
      { title: 'Обучение', desc: 'Как зарабатывать на госзакупках и тендерах', link: 'obuchenie.html', variant: 'green', icon: 'assets/img/obuch.png' },
      { title: 'Сопровождение', desc: 'Комплексная помощь экспертов на всех этапах закупок', link: 'consulting.html', variant: 'peach', icon: 'assets/img/sopr.png' },
      { title: 'Юридический консалтинг', desc: 'Профессиональные консультационные услуги по правовым вопросам', link: 'consulting.html', variant: 'purple', icon: 'assets/img/u_k.png' },
      { title: 'ЭТП', desc: 'Электронная торговая площадка', link: 'https://etpzakupki.tatar', variant: 'blue', icon: 'assets/img/etp.png', external: true }
    ],
    promoBanner: {
      title: 'Дистанционный курс\nпо 44 ФЗ для заказчиков',
      date: '2-4 июня 2026 года',
      link: '',
      image: 'assets/img/banner.png'
    },
    partners: [
      { alt: 'Партнер 1', image: 'assets/img/Group 303.png' },
      { alt: 'Партнер 2', image: 'assets/img/Group 302.png' },
      { alt: 'Партнер 3', image: 'assets/img/Group 304.png' },
      { alt: 'Партнер 4', image: 'assets/img/Group 305.png' },
      { alt: 'Партнер 5', image: 'assets/img/TNV.png' }
    ],
    reviews: [
      {
        text: 'В целом Интерфейс понятный, удобный. Если нужны какие-то улучшения, Росэлторг их активно рассматривает. Не всегда, но движения в этом вопросе точно есть.',
        nameLines: ['Сергеев', 'Александр'],
        roleLines: ['Руководитель', 'тендерного отдела']
      },
      {
        text: 'В целом Интерфейс понятный, удобный. Если нужны какие-то улучшения, Росэлторг их активно рассматривает. Не всегда, но движения в этом вопросе точно есть.',
        nameLines: ['Сергеев', 'Александр'],
        roleLines: ['Руководитель', 'тендерного отдела']
      },
      {
        text: 'В целом Интерфейс понятный, удобный. Если нужны какие-то улучшения, Росэлторг их активно рассматривает. Не всегда, но движения в этом вопросе точно есть.',
        nameLines: ['Сергеев', 'Александр'],
        roleLines: ['Руководитель', 'тендерного отдела']
      }
    ],
    consultation: { photos: ['assets/img/mask_group.png'] }
  };

  function escapeAttr(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function migrateMainPageData(raw) {
    if (window.LandingContent?.migrateLandingData) {
      return window.LandingContent.migrateLandingData(raw);
    }
    return { ...DEFAULT_LANDING_MAIN, ...(raw || {}) };
  }

  function imageUploadHtml(id, label, previewSrc) {
    const show = previewSrc ? 'block' : 'none';
    return `
      <div class="form-group" style="margin-bottom:0;">
        <label>${label}</label>
        <div class="image-upload-mini" data-upload-id="${id}">
          <img id="${id}_preview" src="${escapeAttr(previewSrc)}" alt="" style="width:100%;max-height:160px;object-fit:contain;border-radius:8px;display:${show};margin-bottom:8px;background:rgba(0,0,0,0.15);">
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminLanding.pickImage('${id}')">Загрузить</button>
          <button type="button" class="btn-delete" style="padding:8px 14px;margin-left:8px;font-size:0.85rem;${previewSrc ? '' : 'display:none;'}" id="${id}_clear" onclick="AdminLanding.clearImage('${id}')">Удалить</button>
          <input type="hidden" id="${id}_val" value="${escapeAttr(previewSrc)}">
        </div>
        <small style="color:var(--text-secondary);display:block;margin-top:6px;">На сайте цветное фото; в покое — оттенки серого, при наведении — цвет.</small>
      </div>`;
  }

  function partnerImageUploadHtml(id, previewSrc) {
    const show = previewSrc ? 'block' : 'none';
    return `
      <div class="form-group partner-upload-group">
        <label>Логотип</label>
        <div class="image-upload-mini" data-upload-id="${id}">
          <div class="partner-logo-preview" style="--partner-mx:${PARTNER_LOGO_CROP.marginX * 100}%;--partner-my:${PARTNER_LOGO_CROP.marginY * 100}%;">
            <div class="partner-logo-preview__inner">
              <span class="partner-logo-preview__margin partner-logo-preview__margin--left" aria-hidden="true"></span>
              <span class="partner-logo-preview__margin partner-logo-preview__margin--right" aria-hidden="true"></span>
              <span class="partner-logo-preview__margin partner-logo-preview__margin--top" aria-hidden="true"></span>
              <span class="partner-logo-preview__margin partner-logo-preview__margin--bottom" aria-hidden="true"></span>
              <img id="${id}_preview" class="partner-logo-preview__img" src="${escapeAttr(previewSrc)}" alt="" style="display:${show};">
            </div>
          </div>
          <div class="partner-upload-actions">
            <button type="button" class="btn-save" onclick="AdminLanding.pickImage('${id}')">Загрузить</button>
            <button type="button" class="btn-delete" id="${id}_clear" onclick="AdminLanding.clearImage('${id}')" style="${previewSrc ? '' : 'display:none;'}">Удалить</button>
          </div>
          <input type="hidden" id="${id}_val" value="${escapeAttr(previewSrc)}">
        </div>
        <small class="partner-upload-hint">На сайте — цвет; в покое — серый, при наведении — цвет.</small>
      </div>`;
  }

  function renderHeroSlides(container, slides) {
    container.innerHTML = '';
    slides.forEach((slide, i) => {
      container.insertAdjacentHTML(
        'beforeend',
        `<div class="admin-subcard" style="padding:16px;border:1px solid var(--card-border);border-radius:12px;position:relative;">
          <button type="button" class="btn-delete" style="position:absolute;top:10px;right:10px;" onclick="AdminLanding.removeHeroSlide(${i})">×</button>
          <div class="form-group"><label>Заголовок (перенос — Enter)</label>
            <textarea class="form-control" id="m_hero_title_${i}" rows="2">${escapeAttr(slide.title)}</textarea></div>
          <div class="form-group"><label>Подзаголовок</label>
            <textarea class="form-control" id="m_hero_subtitle_${i}" rows="2">${escapeAttr(slide.subtitle)}</textarea></div>
          ${imageUploadHtml(`m_hero_bg_${i}`, 'Фон слайда (как hero_section.png, ~1520×420)', slide.background)}
        </div>`
      );
    });
  }

  function renderServiceCards(container, cards) {
    container.innerHTML = '';
    cards.forEach((card, i) => {
      const opts = SERVICE_VARIANTS.map((v) => `<option value="${v.id}" ${card.variant === v.id ? 'selected' : ''}>${v.label}</option>`).join('');
      container.insertAdjacentHTML(
        'beforeend',
        `<div style="padding:16px;border:1px solid var(--card-border);border-radius:12px;">
          <div class="form-group"><label>Заголовок</label><input type="text" class="form-control" id="m_svc_title_${i}" value="${escapeAttr(card.title)}"></div>
          <div class="form-group"><label>Описание</label><input type="text" class="form-control" id="m_svc_desc_${i}" value="${escapeAttr(card.desc)}"></div>
          <div class="form-group"><label>Ссылка</label><input type="text" class="form-control" id="m_svc_link_${i}" value="${escapeAttr(card.link)}"></div>
          <div class="form-group"><label>Цвет карточки</label><select class="form-control" id="m_svc_variant_${i}">${opts}</select></div>
          ${imageUploadHtml(`m_svc_icon_${i}`, 'Картинка блока', card.icon)}
        </div>`
      );
    });
  }

  function renderPartners(container, partners) {
    container.innerHTML = '';
    partners.forEach((p, i) => {
      container.insertAdjacentHTML(
        'beforeend',
        `<div class="partner-admin-card">
          <button type="button" class="btn-delete partner-admin-card__remove" onclick="AdminLanding.removePartner(${i})" aria-label="Удалить">×</button>
          <div class="form-group"><label>Название (alt)</label><input type="text" class="form-control" id="m_partner_alt_${i}" value="${escapeAttr(p.alt)}"></div>
          ${partnerImageUploadHtml(`m_partner_img_${i}`, p.image)}
        </div>`
      );
    });
  }

  function renderReviews(container, reviews) {
    container.innerHTML = '';
    reviews.forEach((r, i) => {
      container.insertAdjacentHTML(
        'beforeend',
        `<div style="padding:16px;border:1px solid var(--card-border);border-radius:12px;position:relative;">
          <button type="button" class="btn-delete" style="position:absolute;top:10px;right:10px;" onclick="AdminLanding.removeReview(${i})">×</button>
          <div class="form-group"><label>Текст отзыва</label><textarea class="form-control" id="m_rev_text_${i}" rows="3">${escapeAttr(r.text)}</textarea></div>
          <div class="form-group"><label>Имя (строка 1)</label><input type="text" class="form-control" id="m_rev_name1_${i}" value="${escapeAttr(r.nameLines?.[0] || '')}"></div>
          <div class="form-group"><label>Имя (строка 2)</label><input type="text" class="form-control" id="m_rev_name2_${i}" value="${escapeAttr(r.nameLines?.[1] || '')}"></div>
          <div class="form-group"><label>Должность (строка 1)</label><input type="text" class="form-control" id="m_rev_role1_${i}" value="${escapeAttr(r.roleLines?.[0] || '')}"></div>
          <div class="form-group"><label>Должность (строка 2)</label><input type="text" class="form-control" id="m_rev_role2_${i}" value="${escapeAttr(r.roleLines?.[1] || '')}"></div>
        </div>`
      );
    });
  }

  function renderConsultPhotos(container, photos) {
    container.innerHTML = '';
    photos.forEach((src, i) => {
      container.insertAdjacentHTML(
        'beforeend',
        `<div style="padding:16px;border:1px solid var(--card-border);border-radius:12px;position:relative;">
          <button type="button" class="btn-delete" style="position:absolute;top:10px;right:10px;" onclick="AdminLanding.removeConsultPhoto(${i})">×</button>
          ${imageUploadHtml(`m_consult_photo_${i}`, 'Фото (${i + 1})', src)}
          <small style="color:var(--text-secondary);">При обновлении страницы показывается случайное фото из списка.</small>
        </div>`
      );
    });
  }

  function renderMainPageAdmin(mainPageData) {
    const heroEl = document.getElementById('mHeroSlidesAdmin');
    const svcEl = document.getElementById('mServiceCardsAdmin');
    const promo = mainPageData.promoBanner || {};
    document.getElementById('m_promo_title').value = promo.title || '';
    document.getElementById('m_promo_date').value = promo.date || '';
    document.getElementById('m_promo_link').value = promo.link || '';
    const promoPrev = document.getElementById('m_promo_img_preview');
    const promoVal = document.getElementById('m_promo_img_val');
    if (promoPrev && promoVal) {
      promoPrev.src = promo.image || '';
      promoPrev.style.display = promo.image ? 'block' : 'none';
      promoVal.value = promo.image || '';
      const clr = document.getElementById('m_promo_img_clear');
      if (clr) clr.style.display = promo.image ? 'inline-flex' : 'none';
    }

    if (heroEl) renderHeroSlides(heroEl, mainPageData.heroSlides || []);
    if (svcEl) renderServiceCards(svcEl, mainPageData.serviceCards || []);
    renderPartners(document.getElementById('mPartnersAdmin'), mainPageData.partners || []);
    renderReviews(document.getElementById('mReviewsAdmin'), mainPageData.reviews || []);
    renderConsultPhotos(document.getElementById('mConsultPhotosAdmin'), mainPageData.consultation?.photos || []);
  }

  function readImageVal(id) {
    return document.getElementById(`${id}_val`)?.value || '';
  }

  function collectMainPageFromForm(mainPageData) {
    const heroSlides = [];
    const heroCount = document.querySelectorAll('[id^="m_hero_title_"]').length;
    for (let i = 0; i < heroCount; i++) {
      heroSlides.push({
        title: document.getElementById(`m_hero_title_${i}`)?.value || '',
        subtitle: document.getElementById(`m_hero_subtitle_${i}`)?.value || '',
        background: readImageVal(`m_hero_bg_${i}`)
      });
    }

    const serviceCards = [];
    const svcCount = document.querySelectorAll('[id^="m_svc_title_"]').length;
    for (let i = 0; i < svcCount; i++) {
      const link = document.getElementById(`m_svc_link_${i}`)?.value || '#';
      serviceCards.push({
        title: document.getElementById(`m_svc_title_${i}`)?.value || '',
        desc: document.getElementById(`m_svc_desc_${i}`)?.value || '',
        link,
        variant: document.getElementById(`m_svc_variant_${i}`)?.value || 'green',
        icon: readImageVal(`m_svc_icon_${i}`),
        external: /^https?:\/\//i.test(link)
      });
    }

    const partners = [];
    const pCount = document.querySelectorAll('[id^="m_partner_alt_"]').length;
    for (let i = 0; i < pCount; i++) {
      partners.push({
        alt: document.getElementById(`m_partner_alt_${i}`)?.value || '',
        image: readImageVal(`m_partner_img_${i}`)
      });
    }

    const reviews = [];
    const rCount = document.querySelectorAll('[id^="m_rev_text_"]').length;
    for (let i = 0; i < rCount; i++) {
      reviews.push({
        text: document.getElementById(`m_rev_text_${i}`)?.value || '',
        nameLines: [
          document.getElementById(`m_rev_name1_${i}`)?.value || '',
          document.getElementById(`m_rev_name2_${i}`)?.value || ''
        ].filter(Boolean),
        roleLines: [
          document.getElementById(`m_rev_role1_${i}`)?.value || '',
          document.getElementById(`m_rev_role2_${i}`)?.value || ''
        ].filter(Boolean)
      });
    }

    const photos = [];
    for (let i = 0; document.getElementById(`m_consult_photo_${i}_val`); i++) {
      const v = readImageVal(`m_consult_photo_${i}`);
      if (v) photos.push(v);
    }

    mainPageData.heroSlides = heroSlides;
    mainPageData.serviceCards = serviceCards;
    mainPageData.promoBanner = {
      title: document.getElementById('m_promo_title')?.value || '',
      date: document.getElementById('m_promo_date')?.value || '',
      link: document.getElementById('m_promo_link')?.value || '',
      image: readImageVal('m_promo_img')
    };
    mainPageData.partners = partners;
    mainPageData.reviews = reviews;
    mainPageData.consultation = { photos: photos.length ? photos : ['assets/img/mask_group.png'] };
    return mainPageData;
  }

  function pickImage(uploadId) {
    window.cropTarget = { uploadId, aspect: AdminLanding.getAspect(uploadId) };
    window.activeAuthorIndex = null;
    window.activeFeatureCardIndex = undefined;
    window.activeAboutImage = false;
    document.getElementById('imageInput')?.click();
  }

  function clearImage(uploadId) {
    const prev = document.getElementById(`${uploadId}_preview`);
    const val = document.getElementById(`${uploadId}_val`);
    const clr = document.getElementById(`${uploadId}_clear`);
    if (prev) { prev.src = ''; prev.style.display = 'none'; }
    if (val) val.value = '';
    if (clr) clr.style.display = 'none';
  }

  function applyCroppedImage(uploadId, dataUrl) {
    const prev = document.getElementById(`${uploadId}_preview`);
    const val = document.getElementById(`${uploadId}_val`);
    const clr = document.getElementById(`${uploadId}_clear`);
    if (prev) { prev.src = dataUrl; prev.style.display = 'block'; }
    if (val) val.value = dataUrl;
    if (clr) clr.style.display = 'inline-flex';
  }

  function isPartnerUploadId(uploadId) {
    return Boolean(uploadId && uploadId.startsWith('m_partner_img_'));
  }

  function getPartnerGuidesElement() {
    if (partnerCropGuidesEl) return partnerCropGuidesEl;
    const mx = `${PARTNER_LOGO_CROP.marginX * 100}%`;
    const my = `${PARTNER_LOGO_CROP.marginY * 100}%`;
    const el = document.createElement('div');
    el.className = 'partner-crop-guides';
    el.setAttribute('aria-hidden', 'true');
    el.style.setProperty('--partner-mx', mx);
    el.style.setProperty('--partner-my', my);
    el.innerHTML = `
      <span class="partner-crop-guides__zone partner-crop-guides__zone--left"></span>
      <span class="partner-crop-guides__zone partner-crop-guides__zone--right"></span>
      <span class="partner-crop-guides__zone partner-crop-guides__zone--top"></span>
      <span class="partner-crop-guides__zone partner-crop-guides__zone--bottom"></span>
      <span class="partner-crop-guides__safe">
        <span class="partner-crop-guides__line partner-crop-guides__line--v1"></span>
        <span class="partner-crop-guides__line partner-crop-guides__line--v2"></span>
        <span class="partner-crop-guides__line partner-crop-guides__line--h1"></span>
        <span class="partner-crop-guides__line partner-crop-guides__line--h2"></span>
      </span>`;
    partnerCropGuidesEl = el;
    return partnerCropGuidesEl;
  }

  function mountPartnerCropGuides(cropperInstance) {
    const root = cropperInstance?.cropper;
    const viewBox = root?.querySelector('.cropper-view-box');
    if (!viewBox) return;
    const guides = getPartnerGuidesElement();
    if (guides.parentElement !== viewBox) viewBox.appendChild(guides);
  }

  function unmountPartnerCropGuides() {
    if (partnerCropGuidesEl?.parentElement) {
      partnerCropGuidesEl.parentElement.removeChild(partnerCropGuidesEl);
    }
  }

  function setPartnerCropperMode(enabled, wrapperEl) {
    if (wrapperEl) wrapperEl.classList.toggle('cropper-wrapper--partner', Boolean(enabled));
    const hint = document.getElementById('partnerCropHint');
    if (hint) hint.style.display = enabled ? 'block' : 'none';
  }

  function getCropperOptions(uploadId) {
    const base = {
      viewMode: 2,
      dragMode: 'move',
      autoCropArea: 1,
      background: false,
      zoomable: true,
      guides: true,
      center: true,
      highlight: true
    };

    if (!isPartnerUploadId(uploadId)) {
      const aspect = getAspect(uploadId);
      if (!Number.isNaN(aspect)) base.aspectRatio = aspect;
      return base;
    }

    return {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      background: false,
      zoomable: true,
      zoomOnWheel: true,
      wheelZoomRatio: 0.08,
      guides: false,
      center: false,
      highlight: false,
      modal: true,
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
      minContainerWidth: 200,
      minContainerHeight: 200,
      ready() {
        mountPartnerCropGuides(this);
        try {
          this.zoomTo(PARTNER_LOGO_CROP.minZoomRatio + 0.15);
        } catch (e) {
          /* cropper может не поддерживать zoomTo в старых сборках */
        }
      },
      crop() {
        mountPartnerCropGuides(this);
      },
      zoom(event) {
        if (event.detail.ratio < PARTNER_LOGO_CROP.minZoomRatio) {
          event.preventDefault();
        }
      }
    };
  }

  function getCroppedCanvasOptions(uploadId) {
    const [width, height] = getCropSize(uploadId);
    const opts = { width, height, imageSmoothingEnabled: true, imageSmoothingQuality: 'high' };
    if (isPartnerUploadId(uploadId)) {
      opts.fillColor = '#ffffff';
    }
    return opts;
  }

  function getZoomStep(uploadId, direction) {
    if (isPartnerUploadId(uploadId)) {
      return direction < 0 ? -PARTNER_LOGO_CROP.zoomStep : PARTNER_LOGO_CROP.zoomStep;
    }
    return direction < 0 ? -0.1 : 0.1;
  }

  function getAspect(uploadId) {
    if (uploadId.startsWith('m_hero_bg_')) return 1520 / 420;
    if (uploadId === 'm_promo_img') return 1520 / 253;
    if (uploadId.startsWith('m_consult_photo_')) return 396 / 509;
    if (uploadId.startsWith('m_partner_img_')) return 1;
    if (uploadId.startsWith('m_svc_icon_')) return 1;
    return 16 / 9;
  }

  function getCropSize(uploadId) {
    if (uploadId.startsWith('m_hero_bg_')) return [1520, 420];
    if (uploadId === 'm_promo_img') return [1520, 253];
    if (uploadId.startsWith('m_consult_photo_')) return [396, 509];
    if (uploadId.startsWith('m_partner_img_')) return [PARTNER_LOGO_CROP.width, PARTNER_LOGO_CROP.height];
    if (uploadId.startsWith('m_svc_icon_')) return [400, 400];
    return [1200, 675];
  }

  window.AdminLanding = {
    DEFAULT_LANDING_MAIN,
    migrateMainPageData,
    renderMainPageAdmin,
    collectMainPageFromForm,
    pickImage,
    clearImage,
    applyCroppedImage,
    getAspect,
    getCropSize,
    PARTNER_LOGO_CROP,
    isPartnerUploadId,
    getCropperOptions,
    getCroppedCanvasOptions,
    getZoomStep,
    unmountPartnerCropGuides,
    setPartnerCropperMode,
    MAX_HERO_SLIDES,
    addHeroSlide() {
      const main = window.mainPageData;
      window.saveMainPageStateToMemory?.();
      if (!main.heroSlides) main.heroSlides = [];
      if (main.heroSlides.length >= MAX_HERO_SLIDES) {
        alert(`Не более ${MAX_HERO_SLIDES} слайдов`);
        return;
      }
      main.heroSlides.push({ title: '', subtitle: '', background: '' });
      renderMainPageAdmin(main);
    },
    removeHeroSlide(i) {
      const main = window.mainPageData;
      window.saveMainPageStateToMemory?.();
      main.heroSlides.splice(i, 1);
      renderMainPageAdmin(main);
    },
    addPartner() {
      const main = window.mainPageData;
      window.saveMainPageStateToMemory?.();
      if (!main.partners) main.partners = [];
      main.partners.push({ alt: 'Партнёр', image: '' });
      renderMainPageAdmin(main);
    },
    removePartner(i) {
      const main = window.mainPageData;
      window.saveMainPageStateToMemory?.();
      main.partners.splice(i, 1);
      renderMainPageAdmin(main);
    },
    addReview() {
      const main = window.mainPageData;
      window.saveMainPageStateToMemory?.();
      if (!main.reviews) main.reviews = [];
      main.reviews.push({ text: '', nameLines: ['', ''], roleLines: ['', ''] });
      renderMainPageAdmin(main);
    },
    removeReview(i) {
      const main = window.mainPageData;
      window.saveMainPageStateToMemory?.();
      main.reviews.splice(i, 1);
      renderMainPageAdmin(main);
    },
    addConsultPhoto() {
      const main = window.mainPageData;
      window.saveMainPageStateToMemory?.();
      if (!main.consultation) main.consultation = { photos: [] };
      main.consultation.photos.push('');
      renderMainPageAdmin(main);
    },
    removeConsultPhoto(i) {
      const main = window.mainPageData;
      window.saveMainPageStateToMemory?.();
      main.consultation.photos.splice(i, 1);
      renderMainPageAdmin(main);
    }
  };
})();
