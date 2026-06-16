/**
 * Редактор главной страницы (лендинг) для admin.html
 */
(function () {
  const MAX_HERO_SLIDES = 8;

  /** Макс. длина текста отзыва на карточке лендинга (≈ объём «Все понятно, очень интересно!» ×8 + «Все») */
  const REVIEW_TEXT_MAX_LENGTH = 243;

  /** Поля и сетка для логотипов партнёров (доли от стороны кадра 0–1) */
  const PARTNER_LOGO_CROP = {
    width: 400,
    height: 400,
    marginX: 0.18,
    marginY: 0.14,
    minZoomRatio: 0.001,
    zoomStep: 0.18
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
      { title: 'Сопровождение', desc: 'Комплексная помощь экспертов на всех этапах закупок', link: 'support.html', variant: 'peach', icon: 'assets/img/sopr.png' },
      { title: 'Юридический консалтинг', desc: 'Профессиональные консультационные услуги по правовым вопросам', link: 'consulting.html', variant: 'purple', icon: 'assets/img/u_k.png' },
      { title: 'ЭТП', desc: 'Электронная торговая площадка', link: 'ecp.html', variant: 'blue', icon: 'assets/img/etp.png', external: false }
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
    consultation: { photos: ['assets/img/mask_group.png'] },
    socialLinks: [
      { id: 'max', label: 'Max', href: '#' },
      { id: 'tg', label: 'Телеграм', href: '#' },
      { id: 'vk', label: 'В контакте', href: '#' }
    ]
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

  /** Заполняет превью/hidden без вставки base64 в HTML-разметку (иначе браузер обрезает длинные value/src). */
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
      frame.classList.toggle('consult-photo-frame--empty', !v);
      frame.classList.toggle('hero-slide-frame--empty', !v);
    }
    if (clr) clr.style.display = v ? 'inline-flex' : 'none';
  }

  function consultPhotoUploadShell(id, label, index) {
    return `
      <div class="consult-photo-card__body">
        <div class="consult-photo-card__media">
          <div class="consult-photo-frame consult-photo-frame--empty" data-upload-frame-for="${id}">
            <span class="consult-photo-frame__empty">396×509</span>
            <img id="${id}_preview" class="consult-photo-frame__img" src="" alt="">
          </div>
        </div>
        <div class="consult-photo-card__info">
          <span class="consult-photo-card__title">${label}</span>
          <p class="consult-photo-card__hint">При обновлении страницы на сайте показывается случайное фото из списка.</p>
          <div class="consult-photo-card__actions image-upload-mini" data-upload-id="${id}">
            <button type="button" class="btn-save" onclick="AdminLanding.pickImage('${id}')">Загрузить</button>
            <button type="button" class="btn-delete" onclick="AdminLanding.removeConsultPhoto(${index})">Удалить</button>
            <input type="hidden" id="${id}_val" value="">
          </div>
        </div>
      </div>`;
  }

  function imageUploadHtml(id, label) {
    return `
      <div class="form-group" style="margin-bottom:0;">
        <label>${label}</label>
        <div class="image-upload-mini" data-upload-id="${id}">
          <img id="${id}_preview" src="" alt="" style="max-width:160px;max-height:160px;object-fit:contain;border-radius:8px;display:none;margin-bottom:8px;background:rgba(0,0,0,0.15);">
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminLanding.pickImage('${id}')">Загрузить</button>
          <button type="button" class="btn-delete" style="padding:8px 14px;margin-left:8px;font-size:0.85rem;display:none;" id="${id}_clear" onclick="AdminLanding.clearImage('${id}')">Удалить</button>
          <input type="hidden" id="${id}_val" value="">
        </div>
      </div>`;
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
          <button type="button" class="btn-save" style="padding:8px 14px;font-size:0.85rem;" onclick="AdminLanding.pickImage('${id}')">Загрузить</button>
          <button type="button" class="btn-delete" style="padding:8px 14px;font-size:0.85rem;display:none;" id="${id}_clear" onclick="AdminLanding.clearImage('${id}')">Удалить</button>
          <input type="hidden" id="${id}_val" value="">
        </div>
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
          ${heroBgUploadShell(`m_hero_bg_${i}`, 'Фон слайда (как hero_section.png, ~1520×420)')}
        </div>`
      );
      setImageUploadState(`m_hero_bg_${i}`, slide.background);
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
          ${imageUploadHtml(`m_svc_icon_${i}`, 'Картинка блока')}
        </div>`
      );
      setImageUploadState(`m_svc_icon_${i}`, card.icon);
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

  function truncateReviewText(text) {
    const s = String(text || '');
    return s.length > REVIEW_TEXT_MAX_LENGTH ? s.slice(0, REVIEW_TEXT_MAX_LENGTH) : s;
  }

  function updateReviewTextLimit(textarea) {
    if (!textarea) return;
    const max = REVIEW_TEXT_MAX_LENGTH;
    if (textarea.value.length > max) {
      textarea.value = textarea.value.slice(0, max);
    }
    const counter = textarea.closest('.review-admin-card')?.querySelector('.review-admin-card__counter');
    if (counter) {
      const len = textarea.value.length;
      counter.textContent = `${len} / ${max}`;
      counter.classList.toggle('review-admin-card__counter--limit', len >= max);
    }
  }

  function bindReviewTextLimits(root) {
    if (!root) return;
    root.querySelectorAll('textarea[id^="m_rev_text_"]').forEach((ta) => {
      ta.setAttribute('maxlength', String(REVIEW_TEXT_MAX_LENGTH));
      ta.addEventListener('input', () => updateReviewTextLimit(ta));
      ta.addEventListener('paste', () => {
        requestAnimationFrame(() => updateReviewTextLimit(ta));
      });
      updateReviewTextLimit(ta);
    });
  }

  function renderReviews(container, reviews) {
    container.innerHTML = '';
    reviews.forEach((r, i) => {
      const num = i + 1;
      const reviewText = truncateReviewText(r.text);
      container.insertAdjacentHTML(
        'beforeend',
        `<div class="review-admin-card">
          <div class="review-admin-card__head">
            <span class="review-admin-card__title">Отзыв №${num}</span>
            <button type="button" class="btn-delete review-admin-card__remove" onclick="AdminLanding.removeReview(${i})" aria-label="Удалить отзыв №${num}">×</button>
          </div>
          <div class="form-group review-admin-card__text-field">
            <div class="review-admin-card__label-row">
              <label for="m_rev_text_${i}">Текст</label>
              <span class="review-admin-card__counter" id="m_rev_count_${i}">0 / ${REVIEW_TEXT_MAX_LENGTH}</span>
            </div>
            <textarea class="form-control review-admin-card__textarea" id="m_rev_text_${i}" rows="7" maxlength="${REVIEW_TEXT_MAX_LENGTH}">${escapeAttr(reviewText)}</textarea>
          </div>
          <div class="review-admin-card__meta">
            <div class="form-group">
              <label for="m_rev_name1_${i}">Имя 1</label>
              <input type="text" class="form-control" id="m_rev_name1_${i}" value="${escapeAttr(r.nameLines?.[0] || '')}">
            </div>
            <div class="form-group">
              <label for="m_rev_name2_${i}">Имя 2</label>
              <input type="text" class="form-control" id="m_rev_name2_${i}" value="${escapeAttr(r.nameLines?.[1] || '')}">
            </div>
            <div class="form-group">
              <label for="m_rev_role1_${i}">Должн. 1</label>
              <input type="text" class="form-control" id="m_rev_role1_${i}" value="${escapeAttr(r.roleLines?.[0] || '')}">
            </div>
            <div class="form-group">
              <label for="m_rev_role2_${i}">Должн. 2</label>
              <input type="text" class="form-control" id="m_rev_role2_${i}" value="${escapeAttr(r.roleLines?.[1] || '')}">
            </div>
          </div>
        </div>`
      );
    });
    bindReviewTextLimits(container);
  }

  function renderConsultPhotos(container, photos) {
    container.innerHTML = '';
    const list = Array.isArray(photos) && photos.length ? photos : [''];
    list.forEach((src, i) => {
      const uploadId = `m_consult_photo_${i}`;
      container.insertAdjacentHTML(
        'beforeend',
        `<div class="consult-photo-card">
          ${consultPhotoUploadShell(uploadId, `Фото ${i + 1}`, i)}
        </div>`
      );
      setImageUploadState(uploadId, src);
    });
  }

  function renderSocialLinksAdmin(container, socialLinks) {
    if (!container) return;
    const list = socialLinks && socialLinks.length ? socialLinks : DEFAULT_LANDING_MAIN.socialLinks;
    container.innerHTML = list
      .map((link, i) => {
        const platform = link.id === 'max' ? 'Max' : link.id === 'tg' ? 'Telegram' : 'ВКонтакте';
        return `<div class="admin-social-row" style="display:grid;grid-template-columns:120px 1fr 1fr;gap:12px;align-items:center;margin-bottom:12px;">
          <span style="font-weight:600;">${escapeAttr(platform)}</span>
          <input type="text" class="form-control" id="m_social_label_${i}" value="${escapeAttr(link.label || '')}" placeholder="Подпись">
          <input type="url" class="form-control" id="m_social_href_${i}" value="${escapeAttr(link.href || '')}" placeholder="https://...">
          <input type="hidden" id="m_social_id_${i}" value="${escapeAttr(link.id || '')}">
        </div>`;
      })
      .join('');
  }

  function collectSocialLinksFromForm() {
    const links = [];
    const count = document.querySelectorAll('[id^="m_social_href_"]').length;
    for (let i = 0; i < count; i++) {
      links.push({
        id: document.getElementById(`m_social_id_${i}`)?.value || DEFAULT_LANDING_MAIN.socialLinks[i]?.id || 'max',
        label: document.getElementById(`m_social_label_${i}`)?.value || '',
        href: document.getElementById(`m_social_href_${i}`)?.value || '#'
      });
    }
    return links.length ? links : [...DEFAULT_LANDING_MAIN.socialLinks];
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
    renderSocialLinksAdmin(document.getElementById('mSocialAdmin'), mainPageData.socialLinks || []);
    renderConsultPhotos(document.getElementById('mConsultPhotosAdmin'), mainPageData.consultation?.photos || []);
  }

  function readImageVal(id) {
    return document.getElementById(`${id}_val`)?.value || '';
  }

  function collectConsultationPhotosFromForm() {
    const inputs = Array.from(
      document.querySelectorAll('input[type="hidden"][id^="m_consult_photo_"][id$="_val"]')
    ).sort((a, b) => {
      const indexFromId = (el) => parseInt(el.id.replace('m_consult_photo_', '').replace('_val', ''), 10);
      return indexFromId(a) - indexFromId(b);
    });
    const photos = [];
    inputs.forEach((input) => {
      const v = (input.value || '').trim();
      if (v) photos.push(v);
    });
    return photos;
  }

  function consultationPhotosForSave() {
    const photos = collectConsultationPhotosFromForm();
    return photos.length ? photos : ['assets/img/mask_group.png'];
  }

  function syncConsultPhotoToMemory(uploadId, dataUrl) {
    const match = /^m_consult_photo_(\d+)$/.exec(uploadId || '');
    if (!match || !window.mainPageData) return;
    const index = parseInt(match[1], 10);
    const main = window.mainPageData;
    if (!main.consultation) main.consultation = { photos: [] };
    const photos = Array.isArray(main.consultation.photos) ? [...main.consultation.photos] : [];
    while (photos.length <= index) photos.push('');
    photos[index] = dataUrl;
    main.consultation.photos = photos;
  }

  function clearConsultPhotoInMemory(uploadId) {
    const match = /^m_consult_photo_(\d+)$/.exec(uploadId || '');
    if (!match || !window.mainPageData?.consultation?.photos) return;
    const index = parseInt(match[1], 10);
    const photos = window.mainPageData.consultation.photos;
    if (index >= 0 && index < photos.length) photos[index] = '';
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
        text: truncateReviewText(document.getElementById(`m_rev_text_${i}`)?.value || ''),
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
    mainPageData.socialLinks = collectSocialLinksFromForm();
    mainPageData.consultation = { photos: consultationPhotosForSave() };
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
    if (uploadId?.startsWith('m_consult_photo_')) {
      clearConsultPhotoInMemory(uploadId);
    }
    if (
      uploadId?.startsWith('m_consult_photo_') ||
      uploadId?.startsWith('m_hero_bg_') ||
      uploadId?.startsWith('m_svc_icon_')
    ) {
      setImageUploadState(uploadId, '');
      return;
    }
    const prev = document.getElementById(`${uploadId}_preview`);
    const val = document.getElementById(`${uploadId}_val`);
    const clr = document.getElementById(`${uploadId}_clear`);
    if (prev) { prev.src = ''; prev.style.display = 'none'; }
    if (val) val.value = '';
    if (clr) clr.style.display = 'none';
  }

  function applyCroppedImage(uploadId, dataUrl) {
    if (uploadId?.startsWith('m_consult_photo_')) {
      syncConsultPhotoToMemory(uploadId, dataUrl);
    }
    if (
      uploadId?.startsWith('m_consult_photo_') ||
      uploadId?.startsWith('m_hero_bg_') ||
      uploadId?.startsWith('m_svc_icon_')
    ) {
      setImageUploadState(uploadId, dataUrl);
      return;
    }
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
    const btnFit = document.getElementById('btnPartnerFit');
    if (btnFit) btnFit.style.display = enabled ? 'inline-flex' : 'none';
  }

  /** Вписать логотип в красную сетку (с учётом серых полей) */
  function fitPartnerLogoToSafeZone(cropperInstance) {
    if (!cropperInstance) return;
    const crop = cropperInstance.getCropBoxData();
    const img = cropperInstance.getImageData();
    if (!crop?.width || !img?.naturalWidth) return;

    const safeW = crop.width * (1 - 2 * PARTNER_LOGO_CROP.marginX);
    const safeH = crop.height * (1 - 2 * PARTNER_LOGO_CROP.marginY);
    let targetRatio = Math.min(safeW / img.naturalWidth, safeH / img.naturalHeight) * 0.92;
    targetRatio = Math.max(targetRatio, PARTNER_LOGO_CROP.minZoomRatio);

    cropperInstance.zoomTo(targetRatio);

    const canvas = cropperInstance.getCanvasData();
    cropperInstance.setCanvasData({
      left: crop.left + (crop.width - canvas.width) / 2,
      top: crop.top + (crop.height - canvas.height) / 2
    });
    mountPartnerCropGuides(cropperInstance);
  }

  function partnerZoomBy(cropperInstance, direction) {
    if (!cropperInstance) return;
    const img = cropperInstance.getImageData();
    const factor = direction < 0 ? 0.82 : 1.22;
    let next = (img.ratio || 1) * factor;
    if (direction < 0) {
      next = Math.max(next, PARTNER_LOGO_CROP.minZoomRatio);
    }
    cropperInstance.zoomTo(next);
    mountPartnerCropGuides(cropperInstance);
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
      viewMode: 0,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 0.92,
      background: false,
      zoomable: true,
      zoomOnWheel: true,
      wheelZoomRatio: 0.12,
      guides: false,
      center: true,
      highlight: false,
      modal: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
      ready() {
        const cropper = this;
        mountPartnerCropGuides(cropper);
        setTimeout(() => fitPartnerLogoToSafeZone(cropper), 50);
      },
      crop() {
        mountPartnerCropGuides(this);
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
      return null;
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
    fitPartnerLogoToSafeZone,
    partnerZoomBy,
    REVIEW_TEXT_MAX_LENGTH,
    updateReviewTextLimit,
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
      main.consultation = { photos: collectConsultationPhotosFromForm() };
      main.consultation.photos.push('');
      renderMainPageAdmin(main);
    },
    removeConsultPhoto(i) {
      const main = window.mainPageData;
      window.saveMainPageStateToMemory?.();
      main.consultation.photos.splice(i, 1);
      if (!main.consultation.photos.length) main.consultation.photos.push('');
      renderMainPageAdmin(main);
    }
  };
})();
