(function () {
  const root = document.getElementById('cabinetRoot');
  const btnTabMain = document.getElementById('btnTabMain');
  const btnTabProfile = document.getElementById('btnTabProfile');
  const headerAdminLink = document.getElementById('headerAdminLink');
  const headerLogoutBtn = document.getElementById('headerLogoutBtn');

  // Region UI elements
  const btnHeaderRegion = document.getElementById('btnHeaderRegion');
  const headerRegionName = document.getElementById('headerRegionName');
  const regionModalBackdrop = document.getElementById('regionModalBackdrop');
  const regionStepConfirm = document.getElementById('regionStepConfirm');
  const regionStepSelect = document.getElementById('regionStepSelect');
  const modalDetectedRegionName = document.getElementById('modalDetectedRegionName');
  const btnConfirmRegionYes = document.getElementById('btnConfirmRegionYes');
  const btnConfirmRegionChange = document.getElementById('btnConfirmRegionChange');
  const btnCloseRegionSelect = document.getElementById('btnCloseRegionSelect');
  const inputRegionSearch = document.getElementById('inputRegionSearch');
  const regionSelectList = document.getElementById('regionSelectList');

  let state = {
    loading: true,
    data: null,
    activeTab: 'main',
    isEditingProfile: false,
  };

  let allRegionsList = [];
  let currentRegionObj = null;

  const ICONS = {
    user: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    building: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
    mail: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    phone: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    map: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 15 22 22 18 22 2 15 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="15" y1="6" x2="15" y2="22"/></svg>`,
    briefcase: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    award: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
    book: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    shieldCheck: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
    checkCircle: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    clock: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    lock: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    play: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    help: `<svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  };

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeStr(str) {
    if (!str) return '';
    return String(str).toLowerCase().replace(/ё/g, 'е').trim();
  }

  /** Приводит ответ cabinet.php к полям, которые ждёт UI. */
  function normalizeCabinetPayload(raw) {
    const org = raw.organization || null;
    const history = raw.attemptsHistory || raw.history || [];
    const banners = raw.regionBanners || raw.banners || [];

    function mapCamp(c) {
      if (!c) return null;
      return {
        id: c.id,
        code: c.code,
        name: c.name,
        questionsPerAttempt: Number(c.questionsPerAttempt ?? c.questions_per_attempt ?? 0),
        timeLimitMinutes: Number(c.timeLimitMinutes ?? c.time_limit_minutes ?? 0),
        startsAt: c.startsAt ?? c.starts_at ?? null,
        endsAt: c.endsAt ?? c.ends_at ?? null,
        canAttempt: c.canAttempt !== false,
        attemptBlockReason: c.attemptBlockReason || null,
        canRequestRetake: !!c.canRequestRetake,
        retakeRequest: c.retakeRequest || null,
        lastResult: c.lastResult || null,
      };
    }

    let activeCampaigns = Array.isArray(raw.activeCampaigns)
      ? raw.activeCampaigns.map(mapCamp).filter(Boolean)
      : [];
    if (!activeCampaigns.length) {
      const one = mapCamp(raw.activeCampaign || raw.campaign || null);
      if (one) {
        one.canAttempt = raw.canAttempt !== false;
        one.attemptBlockReason = raw.attemptBlockReason || null;
        one.canRequestRetake = !!raw.canRequestRetake;
        one.retakeRequest = raw.retakeRequest || null;
        one.lastResult = raw.lastResult || null;
        activeCampaigns = [one];
      }
    }

    const activeCampaign = activeCampaigns[0] || null;

    const attemptsHistory = history.map((a) => ({
      id: a.id,
      status: a.status,
      campaignName: a.campaignName ?? a.campaign_name ?? '',
      campaignCode: a.campaignCode ?? a.campaign_code ?? '',
      startedAt: a.startedAt ?? a.started_at ?? null,
      finishedAt: a.finishedAt ?? a.finished_at ?? null,
      score: Number(a.score ?? 0),
      percentCorrect: Number(a.percentCorrect ?? a.percent_correct ?? 0),
      totalQuestions: Number(a.totalQuestions ?? a.total_questions ?? 0),
      correctCount: Number(a.correctCount ?? a.correct_count ?? 0),
      incorrectCount: Number(a.incorrectCount ?? a.incorrect_count ?? 0),
    }));

    return Object.assign({}, raw, {
      userOrgStatus: raw.userOrgStatus || (org && org.moderationStatus) || null,
      moderatorComment: raw.moderatorComment || (org && org.moderatorComment) || null,
      previousModeratorComment: raw.previousModeratorComment || (org && org.previousModeratorComment) || null,
      isResubmitted: !!(raw.isResubmitted || (org && org.isResubmitted)),
      resubmittedAt: raw.resubmittedAt || (org && org.resubmittedAt) || null,
      regionBanners: banners,
      activeCampaign,
      activeCampaigns,
      attemptsHistory,
      canAttempt: !!(activeCampaign && activeCampaign.canAttempt),
      attemptBlockReason: activeCampaign ? activeCampaign.attemptBlockReason : (raw.attemptBlockReason || null),
      canRequestRetake: !!(activeCampaign && activeCampaign.canRequestRetake),
      retakeRequest: activeCampaign ? activeCampaign.retakeRequest : null,
      lastResult: activeCampaign ? activeCampaign.lastResult : null,
    });
  }

  function getInitials(lastName, firstName) {
    const l = (lastName || '').trim().charAt(0);
    const f = (firstName || '').trim().charAt(0);
    return (l + f).toUpperCase() || 'УС';
  }

  function badge(status, isResubmitted) {
    if (isResubmitted && (status === 'pending' || status === 'needs_info')) {
      return `<span class="badge" style="background:#fef3c7; color:#b45309; font-weight:700;">🔄 На повторной проверке</span>`;
    }
    const map = {
      pending: ['Ожидает проверки', 'pending'],
      approved: ['Утверждено', 'approved'],
      rejected: ['Отклонено', 'rejected'],
      needs_info: ['Требует уточнения', 'pending'],
    };
    const m = map[status] || [status || 'Не указан', 'pending'];
    return `<span class="badge badge--${m[1]}">${ICONS.shieldCheck} ${m[0]}</span>`;
  }

  function formatDt(v) {
    if (!v) return '—';
    return String(v).replace('T', ' ').slice(0, 16);
  }

  function bannersHtml(list) {
    if (!list || !list.length) return '';
    return list.map((b) => {
      let title = b.title || 'Аттестационная кампания';
      let body = b.body || '';
      if (body.includes('в личном кабинете') || body.includes('модерации')) {
        title = 'Аттестационная кампания 2026';
        body = 'Приглашаем специалистов пройти ежегодное профессиональное тестирование для подтверждения квалификации в сфере закупок.';
      }
      const hasLink = b.linkUrl && b.linkUrl !== '/cabinet.html' && b.linkUrl !== 'cabinet.html' && b.linkUrl !== '#';
      return `
        <div class="region-banner">
          <strong>${esc(title)}</strong>
          <p>${esc(body)}</p>
          ${hasLink ? `<a class="btn btn--ghost btn--sm" href="${esc(b.linkUrl)}" target="_blank" rel="noopener">Подробнее</a>` : ''}
        </div>
      `;
    }).join('');
  }

  function cleanName(str) {
    if (!str) return '';
    return String(str)
      .replace(/(индивидуальный|предприниматель|ип)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function renderUserHeroCard(data) {
    const u = data.user;
    const org = data.organization;
    const lName = cleanName(u.lastName);
    const fName = cleanName(u.firstName);
    const mName = cleanName(u.middleName);
    const initials = getInitials(lName, fName);
    const fullName = [lName, fName, mName].filter(Boolean).join(' ') || 'Участник тестирования';
    
    const hierarchyText = org && (org.level1 || org.level2)
      ? [org.level1, org.level2].filter(Boolean).join(' → ')
      : null;

    return `
      <div class="user-hero-card">
        <div class="user-hero-card__main">
          <div class="user-hero-card__avatar">
            <span>${initials}</span>
          </div>
          <div class="user-hero-card__info">
            <h2 class="user-hero-card__name">${fullName}</h2>
            <div class="user-hero-card__role">${esc(u.position || 'Специалист по закупкам')}</div>
            ${hierarchyText ? `
              <div class="user-hero-card__hierarchy">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                <span>${esc(hierarchyText)}</span>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="user-hero-card__details">
          <div class="user-hero-card__detail-item">
            <span class="user-hero-card__detail-label">Организация</span>
            <span class="user-hero-card__detail-val">${esc(cleanName(org?.name) || 'Частное лицо')} ${org?.inn ? `(ИНН: ${esc(org.inn)})` : ''}</span>
          </div>
          <div class="user-hero-card__detail-item">
            <span class="user-hero-card__detail-label">Статус модерации</span>
            <span class="user-hero-card__detail-val">${badge(data.userOrgStatus)}</span>
          </div>
          <div class="user-hero-card__detail-item">
            <span class="user-hero-card__detail-label">Регион</span>
            <span class="user-hero-card__detail-val">${esc(u.regionName || (currentRegionObj ? currentRegionObj.name : 'Республика Татарстан'))}</span>
          </div>
        </div>
      </div>
    `;
  }

  async function loadProfileDistricts(regionId, selectedDistrictId = null) {
    const distSelect = document.getElementById('profDistrictSelect');
    if (!distSelect) return;
    distSelect.innerHTML = '<option value="">Загрузка районов…</option>';
    try {
      const url = regionId ? `api/districts.php?regionId=${encodeURIComponent(regionId)}` : 'api/districts.php';
      const res = await AsmtApi.get(url);
      const items = res.districts || [];
      const hasOther = !selectedDistrictId && !!(state.data?.user?.districtOtherText);
      distSelect.innerHTML = '<option value="">Выберите район / город</option>' +
        items.map(d => `<option value="${esc(d.id)}" ${selectedDistrictId && Number(d.id) === Number(selectedDistrictId) ? 'selected' : ''}>${esc(d.name)}</option>`).join('') +
        `<option value="other" ${hasOther ? 'selected' : ''}>Иное (указать вручную)</option>`;

      const custLevel = document.getElementById('profCustomerLevel');
      const otherWrap = document.getElementById('profDistrictOtherWrap');
      if (otherWrap) {
        const isFed = custLevel && custLevel.value === 'federal';
        const isOther = distSelect.value === 'other';
        otherWrap.classList.toggle('hidden', !(isFed || isOther));
      }
    } catch (e) {
      distSelect.innerHTML = '<option value="">Ошибка загрузки районов</option><option value="other" selected>Иное (указать вручную)</option>';
      const otherWrap = document.getElementById('profDistrictOtherWrap');
      if (otherWrap) otherWrap.classList.remove('hidden');
    }
  }

  function renderModerationAlert(data) {
    const status = data.userOrgStatus;
    const comment = data.moderatorComment || (data.organization && data.organization.moderatorComment) || data.previousModeratorComment || (data.organization && data.organization.previousModeratorComment);
    const isResubmitted = data.isResubmitted || (data.organization && data.organization.isResubmitted);

    if (status === 'rejected' || status === 'needs_info') {
      const isRej = status === 'rejected';
      return `
        <div class="asmt-card" style="background:${isRej ? '#fff5f5' : '#fffbeb'}; border:2px solid ${isRej ? '#fca5a5' : '#fcd34d'}; margin-bottom:20px; padding:18px 22px; border-radius:14px;">
          <div style="display:flex; align-items:flex-start; gap:14px; flex-wrap:wrap;">
            <div style="width:40px; height:40px; border-radius:10px; background:${isRej ? '#fee2e2' : '#fef3c7'}; display:flex; align-items:center; justify-content:center; color:${isRej ? '#dc2626' : '#d97706'}; flex-shrink:0;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div style="flex:1; min-width:240px;">
              <h3 style="margin:0 0 6px; font-size:1.15rem; font-weight:800; color:${isRej ? '#991b1b' : '#92400e'};">
                ${isRej ? 'Заявка на участие отклонена модератором' : 'Требуется исправление данных профиля'}
              </h3>
              ${comment ? `
                <div style="background:#ffffff; border-radius:8px; border:1px solid ${isRej ? '#fecaca' : '#fde68a'}; padding:10px 14px; margin:8px 0; font-size:0.92rem; color:var(--text); box-shadow:0 1px 3px rgba(0,0,0,0.04);">
                  <strong style="color:${isRej ? '#dc2626' : '#d97706'};">Замечание модератора:</strong> «${esc(comment)}»
                </div>
              ` : ''}
              <p style="margin:6px 0 12px; font-size:0.88rem; color:${isRej ? '#991b1b' : '#92400e'};">
                Пожалуйста, скорректируйте данные профиля (например, должность или организацию) и направьте заявку на повторное рассмотрение.
              </p>
              <button type="button" class="btn btn--primary btn--sm" id="btnGoEditProfileFromAlert" style="background:${isRej ? '#dc2626' : '#d97706'}; border-color:${isRej ? '#dc2626' : '#d97706'};">
                ✏️ Исправить данные и отправить повторно
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (isResubmitted && status === 'pending') {
      return `
        <div class="asmt-card" style="background:#f0fdf4; border:1.5px solid #86efac; margin-bottom:20px; padding:16px 20px; border-radius:14px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:36px; height:36px; border-radius:10px; background:#dcfce7; display:flex; align-items:center; justify-content:center; color:#16a34a; flex-shrink:0;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            </div>
            <div>
              <strong style="color:#166534; font-size:0.95rem;">Заявка отправлена на повторную модерацию</strong>
              <div style="color:#15803d; font-size:0.85rem; margin-top:2px;">
                Ваши исправленные данные находятся на проверке у модератора. Доступ к тестированию откроется после подтверждения.
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  function renderProfileTab(data) {
    const u = data.user || {};
    const org = data.organization || {};
    const status = data.userOrgStatus;
    const comment = data.moderatorComment || (org && org.moderatorComment) || data.previousModeratorComment || (org && org.previousModeratorComment);
    const isRejected = status === 'rejected';
    const isNeedsInfo = status === 'needs_info';
    const isResubmitted = data.isResubmitted || (org && org.isResubmitted);
    const isEditing = state.isEditingProfile || isRejected || isNeedsInfo;

    const noticeBanner = (isRejected || isNeedsInfo) ? `
      <div style="background:${isRejected ? '#fff5f5' : '#fffbeb'}; border:1.5px solid ${isRejected ? '#fca5a5' : '#fcd34d'}; border-radius:12px; padding:16px 20px; margin-bottom:20px;">
        <div style="font-weight:800; color:${isRejected ? '#991b1b' : '#92400e'}; font-size:1.05rem; display:flex; align-items:center; gap:8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ${isRejected ? 'Заявка отклонена модератором' : 'Требуется исправление данных профиля'}
        </div>
        ${comment ? `
          <div style="background:#ffffff; border-radius:8px; border:1px solid ${isRejected ? '#fecaca' : '#fde68a'}; padding:10px 14px; margin:10px 0; font-size:0.92rem; color:var(--text); box-shadow:0 1px 3px rgba(0,0,0,0.04);">
            <strong style="color:${isRejected ? '#dc2626' : '#d97706'};">Замечание модератора:</strong> «${esc(comment)}»
          </div>
        ` : ''}
        <p style="margin:6px 0 0; font-size:0.88rem; color:${isRejected ? '#991b1b' : '#92400e'}; line-height:1.4;">
          Внесите необходимые исправления в поля ниже и нажмите кнопку «Сохранить и отправить на повторную модерацию».
        </p>
      </div>
    ` : (isResubmitted && status === 'pending') ? `
      <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:12px; padding:14px 18px; margin-bottom:20px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.2rem;">🔄</span>
          <div>
            <strong style="color:#166534; font-size:0.95rem;">Заявка находится на повторной проверке модератором</strong>
            <div style="color:#15803d; font-size:0.85rem; margin-top:2px;">
              ${comment ? `Предыдущее замечание («${esc(comment)}») отправлено на повторную проверку.` : 'Ваши изменения сохранены и проверяются администратором.'}
            </div>
          </div>
        </div>
      </div>
    ` : '';

    if (isEditing) {
      const isApproved = data.userOrgStatus === 'approved';
      const submitBtnText = isApproved
        ? '💾 Сохранить изменения в профиле'
        : '💾 Сохранить и отправить на повторную модерацию';

      return `
        <div class="asmt-card profile-card" style="max-width: 820px; margin: 0 auto;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid var(--border-light); padding-bottom:12px;">
            <div>
              <h2 style="margin: 0; font-size: 1.3rem; font-weight: 800;">${isApproved ? 'Редактирование данных профиля' : 'Исправление данных и повторная подача'}</h2>
              <p class="lead" style="margin:4px 0 0; font-size:0.85rem; color:var(--muted);">
                ${isApproved ? 'Обновите вашу должность или квалификационные данные' : 'Скорректируйте данные с учётом замечаний модератора'}
              </p>
            </div>
            <div>
              ${badge(data.userOrgStatus, isResubmitted)}
            </div>
          </div>

          ${noticeBanner}

          <form id="formProfileEdit" data-mode="${isApproved ? 'update' : 'resubmit'}">
            <div id="profFormStatus" class="status hidden" style="margin-bottom:14px;"></div>

            <h3 style="margin:0 0 12px; font-size:1.05rem; font-weight:700; color:var(--text);">1. Личные и контактные данные</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px;">
              <label class="field">
                <span class="field__label">ФИО</span>
                <input type="text" value="${esc(cleanName(u.lastName))} ${esc(cleanName(u.firstName))} ${esc(cleanName(u.middleName))}" disabled style="background:#f8fafc; color:var(--muted);">
              </label>
              <label class="field">
                <span class="field__label">Email (Логин)</span>
                <input type="email" value="${esc(u.email)}" disabled style="background:#f8fafc; color:var(--muted);">
              </label>
              <label class="field">
                <span class="field__label">Телефон</span>
                <input type="tel" value="${esc(u.phone || 'Не указан')}" disabled style="background:#f8fafc; color:var(--muted);">
              </label>
              <label class="field">
                <span class="field__label">Занимаемая должность <span class="req">*</span></span>
                <input type="text" id="profPosition" name="position" value="${esc(u.position || '')}" required placeholder="Например: Главный специалист отдела закупок" style="border-color:${isRejected ? '#f87171' : 'var(--border)'}; font-weight:600;">
              </label>
            </div>

            <h3 style="margin:0 0 12px; font-size:1.05rem; font-weight:700; color:var(--text);">2. Организация работодателя</h3>
            ${isApproved ? `
              <div style="background:#f8fafc; border:1px solid var(--border-light); border-radius:10px; padding:12px 16px; margin-bottom:14px; font-size:0.88rem; color:var(--muted);">
                ℹ️ Организация подтверждена модератором. Изменение организации производится по обращению к администратору.
              </div>
            ` : ''}
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px;">
              <label class="field">
                <span class="field__label">ИНН организации <span class="req">*</span></span>
                <input type="text" id="profInn" name="inn" value="${esc(org?.inn || '')}" required pattern="\\d{10}|\\d{12}" placeholder="10 или 12 цифр ИНН" ${isApproved ? 'disabled style="background:#f8fafc; color:var(--muted);"' : ''}>
              </label>
              <label class="field">
                <span class="field__label">Уровень заказчика <span class="req">*</span></span>
                <select id="profCustomerLevel" name="customerLevel" required ${isApproved ? 'disabled style="background:#f8fafc; color:var(--muted);"' : ''}>
                  <option value="state" ${u.customerLevel === 'state' ? 'selected' : ''}>Государственный заказчик</option>
                  <option value="municipal" ${u.customerLevel === 'municipal' ? 'selected' : ''}>Муниципальный заказчик</option>
                  <option value="federal" ${u.customerLevel === 'federal' ? 'selected' : ''}>Федеральный заказчик</option>
                </select>
              </label>
              <label class="field" style="grid-column:1 / -1;">
                <span class="field__label">Наименование организации <span class="req">*</span></span>
                <input type="text" id="profOrgName" name="organizationName" value="${esc(cleanName(org?.name) || '')}" required placeholder="Полное наименование организации" ${isApproved ? 'disabled style="background:#f8fafc; color:var(--muted);"' : ''}>
              </label>
              <label class="field">
                <span class="field__label">Субъект (Регион) РФ <span class="req">*</span></span>
                <select id="profRegionSelect" name="regionId" required ${isApproved ? 'disabled style="background:#f8fafc; color:var(--muted);"' : ''}>
                  ${(allRegionsList || []).map(r => `
                    <option value="${r.id}" ${Number(r.id) === Number(u.regionId) ? 'selected' : ''}>
                      ${esc(r.code)} — ${esc(r.name)}
                    </option>
                  `).join('')}
                </select>
              </label>
              <label class="field">
                <span class="field__label">Муниципальный район / Город</span>
                <select id="profDistrictSelect" name="districtId">
                  <option value="">Загрузка районов…</option>
                </select>
              </label>
              <label class="field ${u.customerLevel === 'federal' || (!u.districtId && u.districtOtherText) ? '' : 'hidden'}" id="profDistrictOtherWrap" style="grid-column:1 / -1;">
                <span class="field__label">Регион / Город (для федерального уровня или иного)</span>
                <input type="text" id="profDistrictOther" name="districtOtherText" value="${esc(u.districtOtherText || '')}" placeholder="Укажите субъект РФ или город">
              </label>
            </div>

            <h3 style="margin:0 0 12px; font-size:1.05rem; font-weight:700; color:var(--text);">3. Квалификационные данные</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:24px;">
              <label class="field">
                <span class="field__label">Опыт работы в закупках</span>
                <select id="profExpLevel" name="experienceLevel">
                  <option value="up_to_1" ${u.experienceLevel === 'up_to_1' ? 'selected' : ''}>до 1 года</option>
                  <option value="1_to_3" ${u.experienceLevel === '1_to_3' ? 'selected' : ''}>от 1 года до 3 лет</option>
                  <option value="more_than_3" ${u.experienceLevel === 'more_than_3' ? 'selected' : ''}>более 3 лет</option>
                </select>
              </label>
              <label class="field">
                <span class="field__label">Уровень образования</span>
                <select id="profEducation" name="education">
                  <option value="высшее" ${u.education === 'высшее' ? 'selected' : ''}>высшее</option>
                  <option value="среднее профессиональное" ${u.education === 'среднее профессиональное' ? 'selected' : ''}>среднее профессиональное</option>
                  <option value="среднее" ${u.education === 'среднее' ? 'selected' : ''}>среднее</option>
                  <option value="послевузовское" ${u.education === 'послевузовское' ? 'selected' : ''}>послевузовское</option>
                </select>
              </label>
              <label class="field" style="grid-column:1 / -1;">
                <span class="field__label">Специальность по диплому</span>
                <input type="text" id="profSpecialty" name="specialty" value="${esc(u.specialty || '')}" placeholder="Юриспруденция / Экономика / Закупки">
              </label>
            </div>

            <div style="display:flex; gap:12px; align-items:center; border-top:1px solid var(--border-light); padding-top:16px;">
              <button type="submit" class="btn btn--primary" id="btnSaveProfile">
                ${submitBtnText}
              </button>
              ${(!isRejected && !isNeedsInfo) ? `
                <button type="button" class="btn btn--ghost" id="btnCancelEditProfile">Отмена</button>
              ` : ''}
            </div>
          </form>
        </div>
      `;
    }

    return `
      <div class="asmt-card profile-card" style="max-width: 800px; margin: 0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid var(--border-light); padding-bottom:12px;">
          <div>
            <h2 style="margin: 0; font-size: 1.3rem; font-weight: 800;">Мой профиль и привязки</h2>
          </div>
          <button type="button" class="btn btn--ghost btn--sm" id="btnStartEditProfile">
            ✏️ Редактировать данные
          </button>
        </div>

        ${noticeBanner}

        <div class="profile-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div><strong>Фамилия:</strong> ${esc(cleanName(u.lastName))}</div>
          <div><strong>Имя:</strong> ${esc(cleanName(u.firstName))}</div>
          <div><strong>Отчество:</strong> ${esc(cleanName(u.middleName))}</div>
          <div><strong>Email:</strong> ${esc(u.email)}</div>
          <div><strong>Телефон:</strong> ${esc(u.phone || 'Не указан')}</div>
          <div><strong>Должность:</strong> <strong style="color:var(--text);">${esc(u.position || '—')}</strong></div>
          <div><strong>Регион:</strong> ${esc(u.regionName || (currentRegionObj ? currentRegionObj.name : 'Республика Татарстан'))}</div>
          <div><strong>Муниципальный район:</strong> ${esc(u.districtName || u.districtOtherText || '—')}</div>
          <div><strong>Опыт в закупках:</strong> ${esc(u.experienceLevel || '—')}</div>
          <div><strong>Образование:</strong> ${esc(u.education || '—')}</div>
          <div><strong>Специальность:</strong> ${esc(u.specialty || '—')}</div>
          <div><strong>Статус пользователя:</strong> <span class="badge badge--approved">Активен</span></div>
        </div>
        <hr style="border:none; border-top:1px solid var(--border-light); margin:20px 0;">
        <h3 style="margin:0 0 12px; font-size:1.1rem;">Организация</h3>
        <p><strong>Наименование:</strong> ${esc(cleanName(org?.name) || 'Частное лицо')}</p>
        <p><strong>ИНН:</strong> ${esc(org?.inn || '—')}</p>
        <p><strong>Уровень заказчика:</strong> ${esc(u.customerLevel || org?.customerLevel || '—')}</p>
        <p><strong>Статус заявки:</strong> ${badge(data.userOrgStatus, isResubmitted)}</p>
      </div>
    `;
  }

  function renderAttemptsHistory(attempts) {
    if (!attempts || !attempts.length) {
      return `<p class="lead" style="margin-top:10px;">Вы ещё не проходили тестирование</p>`;
    }

    const statusLabel = {
      finished: 'Завершено',
      abandoned: 'Завершено (выход)',
      expired: 'Время истекло',
      superseded: 'Архив (пересдача)',
      in_progress: 'В процессе',
    };

    const rows = attempts.map((a) => {
      const isFinished = ['finished', 'abandoned', 'expired', 'superseded'].includes(a.status);
      const pct = Math.round(Number(a.percentCorrect || 0));
      const doneLabel = isFinished
        ? (formatDt(a.finishedAt) || statusLabel[a.status] || a.status)
        : (statusLabel[a.status] || a.status);
      return `
        <tr>
          <td><strong style="color:var(--muted);">#${a.id}</strong></td>
          <td><strong style="color:var(--text);">${esc(a.campaignName)}</strong></td>
          <td>${formatDt(a.startedAt)}</td>
          <td>${doneLabel}</td>
          <td style="text-align:center;"><strong>${a.score}</strong> / ${a.totalQuestions}</td>
          <td style="text-align:center;">
            <span class="badge" style="background:${pct >= 70 ? 'var(--green-light)' : '#fee2e2'}; color:${pct >= 70 ? 'var(--green-dark)' : '#dc2626'}; font-weight:700;">
              ${pct}%
            </span>
          </td>
          <td style="text-align:right;">
            ${isFinished
              ? `<a href="complete.html?attemptId=${a.id}" class="btn btn--ghost btn--sm">Результат</a>`
              : `<span class="lead" style="font-size:0.85rem;margin:0;">—</span>`}
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="admin-table-wrap--full" style="margin-top:16px;">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="width:65px;">ID</th>
              <th>Кампания</th>
              <th style="width:160px;">Дата начала</th>
              <th style="width:160px;">Завершено</th>
              <th style="width:100px; text-align:center;">Баллы</th>
              <th style="width:100px; text-align:center;">Процент</th>
              <th style="width:120px; text-align:right;">Действие</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  function renderCampaignCard(camp) {
    const canStart = !!camp && camp.canAttempt !== false;
    const blockReason = camp.attemptBlockReason || '';
    const canRequestRetake = !!camp.canRequestRetake;
    const retake = camp.retakeRequest;

    let retakeBlock = '';
    if (retake && retake.status === 'pending') {
      retakeBlock = `<p class="lead" style="margin:8px 0 0; color:#b45309;">Запрос на повтор отправлен ${formatDt(retake.createdAt)} и ожидает решения администратора.</p>`;
    } else if (retake && retake.status === 'approved') {
      retakeBlock = `<p class="lead" style="margin:8px 0 0; color:var(--green);">Повторное прохождение одобрено — можно начать тест.</p>`;
    } else if (retake && retake.status === 'rejected') {
      const reasonText = retake.adminComment
        ? `Отклонено. Причина: ${esc(retake.adminComment)}`
        : 'Отклонено';
      retakeBlock = `<p class="lead" style="margin:8px 0 0; color:var(--danger); font-weight:700;">${reasonText}</p>
        <p class="lead" style="margin:4px 0 0; font-size:0.85rem; color:var(--muted);">Повторный запрос по этому тесту недоступен.</p>`;
    } else if (canRequestRetake) {
      retakeBlock = `<button type="button" class="btn btn--ghost" data-retake-campaign="${camp.id}" style="margin-top:10px;">Запросить повторное прохождение</button>`;
    }

    const lastResult = camp.lastResult;
    let resultBlock = '';
    if (lastResult) {
      resultBlock = `
        <div style="margin-top:10px; padding:8px 14px; background:#f8fafc; border-radius:10px; border:1px solid var(--border-light); display:inline-flex; align-items:center; flex-wrap:wrap; gap:10px;">
          <span style="font-size:0.85rem; color:var(--muted); font-weight:600;">Ваш результат:</span>
          <strong style="font-size:0.92rem; color:var(--text);">${lastResult.score} / ${lastResult.totalQuestions} (${lastResult.percentCorrect}%)</strong>
          <span class="badge" style="background:${lastResult.isPassed ? 'var(--green-light)' : '#fee2e2'}; color:${lastResult.isPassed ? 'var(--green-dark)' : '#dc2626'}; font-weight:700;">
            ${lastResult.isPassed ? 'Зачтено' : 'Не зачтено'}
          </span>
          <a href="complete.html?attemptId=${lastResult.attemptId}" class="btn btn--ghost btn--sm" style="margin-left:4px;">Посмотреть результат</a>
        </div>
      `;
    }

    const showBlockReason = !canStart && blockReason
      && (!retake || (retake.status !== 'pending' && retake.status !== 'rejected'))
      && !lastResult;

    return `
      <div style="border:1px solid var(--border); border-radius:14px; padding:20px; background:#fff; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:12px;">
        <div style="flex:1; min-width:220px;">
          <h4 style="margin:0 0 6px; font-size:1.15rem; font-weight:800;">${esc(camp.name)}</h4>
          <p class="lead" style="margin:0; font-size:0.9rem; color:var(--muted);">
            Вопросов: <strong>${camp.questionsPerAttempt}</strong> · Время: <strong>${camp.timeLimitMinutes} мин.</strong>
          </p>
          ${resultBlock}
          ${showBlockReason ? `<p class="lead" style="margin:8px 0 0; color:var(--danger);">${esc(blockReason)}</p>` : ''}
          ${retakeBlock}
        </div>
        ${canStart
          ? `<button type="button" class="btn btn--primary" data-start-campaign="${camp.id}">Пройти тестирование</button>`
          : ''}
      </div>
    `;
  }

  function renderMainTab(data) {
    const camps = data.activeCampaigns || [];
    const campsHtml = camps.length
      ? camps.map(renderCampaignCard).join('')
      : `<p class="lead">В данный момент нет активных кампаний для вашего региона.</p>`;

    return `
      ${renderModerationAlert(data)}
      ${renderUserHeroCard(data)}
      ${bannersHtml(data.regionBanners)}

      <div class="asmt-card" style="margin-top:20px;">
        <h3 style="margin:0 0 12px; font-size:1.2rem; font-weight:800;">Текущие кампании</h3>
        ${campsHtml}
      </div>

      <div class="asmt-card" style="margin-top:20px;">
        <h3 style="margin:0 0 12px; font-size:1.2rem; font-weight:800;">История попыток</h3>
        ${renderAttemptsHistory(data.attemptsHistory)}
      </div>
    `;
  }

  let retakeCampaignId = null;

  function openRetakeModal(campaignId) {
    retakeCampaignId = campaignId || null;
    const backdrop = document.getElementById('retakeModalBackdrop');
    const status = document.getElementById('retakeModalStatus');
    const input = document.getElementById('retakeReasonInput');
    if (!backdrop) return;
    if (status) { status.textContent = ''; status.className = 'status'; }
    if (input) input.value = '';
    backdrop.classList.remove('hidden');
    if (input) setTimeout(() => input.focus(), 50);
  }

  function closeRetakeModal() {
    const backdrop = document.getElementById('retakeModalBackdrop');
    if (backdrop) backdrop.classList.add('hidden');
  }

  async function submitRetakeRequest() {
    const campId = retakeCampaignId
      || (state.data && state.data.activeCampaign && state.data.activeCampaign.id);
    const input = document.getElementById('retakeReasonInput');
    const status = document.getElementById('retakeModalStatus');
    const btn = document.getElementById('btnRetakeSubmit');
    if (!campId || !input) return;
    const reason = (input.value || '').trim();
    if (reason.length < 5) {
      if (status) {
        status.textContent = 'Укажите причину (не менее 5 символов)';
        status.className = 'status status--error';
      }
      return;
    }
    try {
      if (btn) { btn.disabled = true; btn.textContent = 'Отправка…'; }
      await AsmtApi.post('api/retake-request.php', { campaignId: campId, reason });
      closeRetakeModal();
      await loadCabinetData();
    } catch (e) {
      if (status) {
        status.textContent = e.message || 'Не удалось отправить запрос';
        status.className = 'status status--error';
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Отправить'; }
    }
  }

  async function startCampaign(campaignId, btn) {
    try {
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Подготовка теста…';
      }
      const res = await AsmtApi.post('api/attempt-start.php', { campaignId });
      if (res.success && res.attemptId) {
        location.href = `test.html?attemptId=${res.attemptId}`;
      } else {
        alert(res.error || 'Ошибка старта попытки');
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Пройти тестирование';
        }
      }
    } catch (e) {
      alert(e.message);
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Пройти тестирование';
      }
    }
  }

  function bindProfileEvents() {
    const btnStartEdit = document.getElementById('btnStartEditProfile');
    if (btnStartEdit) {
      btnStartEdit.addEventListener('click', () => {
        state.isEditingProfile = true;
        render();
      });
    }

    const btnCancelEdit = document.getElementById('btnCancelEditProfile');
    if (btnCancelEdit) {
      btnCancelEdit.addEventListener('click', () => {
        state.isEditingProfile = false;
        render();
      });
    }

    const distSelect = document.getElementById('profDistrictSelect');
    const custLevel = document.getElementById('profCustomerLevel');
    const otherWrap = document.getElementById('profDistrictOtherWrap');

    function syncDistrictOther() {
      if (!otherWrap) return;
      const isFed = custLevel && custLevel.value === 'federal';
      const isOther = distSelect && distSelect.value === 'other';
      otherWrap.classList.toggle('hidden', !(isFed || isOther));
    }

    if (distSelect) {
      distSelect.addEventListener('change', syncDistrictOther);
    }
    if (custLevel) {
      custLevel.addEventListener('change', syncDistrictOther);
    }

    const regSelect = document.getElementById('profRegionSelect');
    if (regSelect) {
      const currentDistrictId = (state.data && state.data.user && state.data.user.districtId) || null;
      loadProfileDistricts(regSelect.value, currentDistrictId);

      regSelect.addEventListener('change', () => {
        loadProfileDistricts(regSelect.value);
      });
    }

    const form = document.getElementById('formProfileEdit');
    if (form) {
      const isUpdate = form.dataset.mode === 'update';
      const defaultBtnText = isUpdate
        ? '💾 Сохранить изменения в профиле'
        : '💾 Сохранить и отправить на повторную модерацию';

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btnSaveProfile');
        const status = document.getElementById('profFormStatus');
        btn.disabled = true;
        btn.textContent = 'Сохранение…';
        status.classList.remove('hidden');
        status.textContent = 'Отправка данных…';
        status.className = 'status status--info';

        try {
          const selectedDistVal = distSelect ? distSelect.value : '';
          const districtId = (selectedDistVal && selectedDistVal !== 'other') ? Number(selectedDistVal) : null;
          const otherInput = document.getElementById('profDistrictOther');
          const districtOtherText = otherInput ? otherInput.value.trim() : '';

          const payload = {
            action: isUpdate ? 'update_profile' : 'resubmit_profile',
            position: document.getElementById('profPosition').value.trim(),
            experienceLevel: document.getElementById('profExpLevel').value,
            education: document.getElementById('profEducation').value,
            specialty: document.getElementById('profSpecialty').value.trim(),
            districtId,
            districtOtherText,
          };

          if (!isUpdate) {
            payload.inn = document.getElementById('profInn').value.trim();
            payload.organizationName = document.getElementById('profOrgName').value.trim();
            payload.customerLevel = document.getElementById('profCustomerLevel').value;
            payload.regionId = Number(document.getElementById('profRegionSelect').value);
          }

          const res = await AsmtApi.post('api/cabinet.php', payload);
          status.textContent = res.message || (isUpdate ? 'Данные профиля успешно обновлены!' : 'Данные успешно отправлены на повторную модерацию!');
          status.className = 'status status--ok';
          state.isEditingProfile = false;
          setTimeout(() => {
            loadCabinetData();
          }, 1200);
        } catch (err) {
          btn.disabled = false;
          btn.textContent = defaultBtnText;
          status.textContent = err.message || 'Ошибка сохранения';
          status.className = 'status status--error';
        }
      });
    }
  }

  function render() {
    if (state.loading) {
      root.innerHTML = `<div class="asmt-card"><p class="lead">Загрузка личного кабинета…</p></div>`;
      return;
    }

    if (!state.data) {
      root.innerHTML = `<div class="asmt-card"><p class="lead">Ошибка загрузки данных</p></div>`;
      return;
    }

    if (state.activeTab === 'profile') {
      root.innerHTML = renderProfileTab(state.data);
      bindProfileEvents();
    } else {
      let bannerHtml = '';
      if (state.data && state.data.isImpersonating) {
        bannerHtml = `
          <div class="impersonate-bar">
            <div style="display:flex; align-items:center; gap:10px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>Вы вошли в личный кабинет в режиме просмотра от имени: <strong>${esc(cleanName(state.data.user.lastName))} ${esc(cleanName(state.data.user.firstName))}</strong></span>
            </div>
            <button type="button" id="btnStopImpersonation" class="btn-stop">
              ← Вернуться в админку
            </button>
          </div>
        `;
      }
      root.innerHTML = bannerHtml + renderMainTab(state.data);

      const goEdit = document.getElementById('btnGoEditProfileFromAlert');
      if (goEdit) {
        goEdit.addEventListener('click', () => {
          if (btnTabProfile) {
            btnTabProfile.classList.add('is-active');
            if (btnTabMain) btnTabMain.classList.remove('is-active');
          }
          state.activeTab = 'profile';
          state.isEditingProfile = true;
          render();
        });
      }

      const stopBtn = document.getElementById('btnStopImpersonation');
      if (stopBtn) {
        stopBtn.addEventListener('click', async () => {
          stopBtn.disabled = true;
          stopBtn.textContent = 'Возврат…';
          try {
            const res = await AsmtApi.post('api/auth.php?action=stop-impersonation', {});
            if (res.success && res.redirect) {
              location.href = res.redirect;
            } else {
              location.href = 'admin-users.html';
            }
          } catch (err) {
            location.href = 'admin-users.html';
          }
        });
      }

      root.querySelectorAll('[data-start-campaign]').forEach((btn) => {
        btn.addEventListener('click', () => {
          startCampaign(Number(btn.getAttribute('data-start-campaign')), btn);
        });
      });

      root.querySelectorAll('[data-retake-campaign]').forEach((btn) => {
        btn.addEventListener('click', () => {
          openRetakeModal(Number(btn.getAttribute('data-retake-campaign')));
        });
      });
    }
  }

  // --- REGION FUNCTIONALITY ---
  async function loadRegionsPublic() {
    try {
      const data = await AsmtApi.get('api/admin-dicts.php?type=regions_public');
      allRegionsList = data.items || [];
      if (regionStepSelect && !regionStepSelect.classList.contains('hidden')) {
        renderRegionSelectList(allRegionsList);
      }
    } catch (e) {
      console.warn('loadRegionsPublic error', e);
    }
  }

  function updateHeaderRegionUI(regionName) {
    if (headerRegionName) {
      headerRegionName.textContent = 'Регион: ' + (regionName || 'Республика Татарстан');
    }
  }

  async function openRegionModal(step) {
    if (!regionModalBackdrop) return;
    regionModalBackdrop.classList.remove('hidden');
    if (step === 'select') {
      if (regionStepConfirm) regionStepConfirm.classList.add('hidden');
      if (regionStepSelect) regionStepSelect.classList.remove('hidden');
      if (!allRegionsList || !allRegionsList.length) {
        await loadRegionsPublic();
      }
      renderRegionSelectList(allRegionsList);
    } else {
      if (regionStepConfirm) regionStepConfirm.classList.remove('hidden');
      if (regionStepSelect) regionStepSelect.classList.add('hidden');
    }
  }

  function closeRegionModal() {
    if (regionModalBackdrop) regionModalBackdrop.classList.add('hidden');
  }

  function renderRegionSelectList(list) {
    if (!regionSelectList) return;
    if (!list || !list.length) {
      regionSelectList.innerHTML = '<div style="padding:12px; color:var(--muted); text-align:center;">Регионы не найдены</div>';
      return;
    }
    regionSelectList.innerHTML = list.map(r => `
      <div data-reg-id="${r.id}" data-reg-name="${esc(r.name)}" style="padding:9px 12px; border-bottom:1px solid var(--border-light); cursor:pointer; font-size:0.88rem; font-weight:600; color:var(--text); transition:all 0.15s ease; border-radius:6px; margin-bottom:2px;" onmouseover="this.style.background='var(--green-light)'; this.style.color='var(--green-dark)';" onmouseout="this.style.background='transparent'; this.style.color='var(--text)';">
        <strong style="color:var(--green-dark); font-weight:800; min-width:28px; display:inline-block;">${esc(r.code)}</strong> — ${esc(r.name)}
      </div>
    `).join('');

    regionSelectList.querySelectorAll('[data-reg-id]').forEach(item => {
      item.addEventListener('click', async () => {
        const id = Number(item.dataset.regId);
        const name = item.dataset.regName;
        await saveUserRegion(id, name);
      });
    });
  }

  async function saveUserRegion(regionId, regionName) {
    try {
      closeRegionModal();
      sessionStorage.setItem('asmt_region_confirmed', 'true');
      updateHeaderRegionUI(regionName);
      await AsmtApi.post('api/auth.php?action=set-region', { regionId });
      loadCabinetData();
    } catch (e) {
      alert('Ошибка обновления региона: ' + e.message);
    }
  }

  async function loadCabinetData() {
    state.loading = true;
    render();
    try {
      const raw = await AsmtApi.get('api/cabinet.php');
      const data = normalizeCabinetPayload(raw);
      state.data = data;
      state.loading = false;

      const u = data.user;
      if (u) {
        if (u.role && ['superadmin', 'region_admin', 'moderator', 'analyst'].includes(u.role)) {
          if (headerAdminLink) headerAdminLink.classList.remove('hidden');
        }
        
        // Регион
        if (u.regionId && u.regionName) {
          currentRegionObj = { id: u.regionId, name: u.regionName };
          updateHeaderRegionUI(u.regionName);
          if (modalDetectedRegionName) modalDetectedRegionName.textContent = u.regionName;
        } else {
          // Ищем Татарстан по умолчанию
          const tat = (allRegionsList && allRegionsList.find(r => r.code === '16' || (r.name && r.name.includes('Татарстан')))) || { id: 16, name: 'Республика Татарстан' };
          currentRegionObj = tat;
          updateHeaderRegionUI(tat.name);
          if (modalDetectedRegionName) modalDetectedRegionName.textContent = tat.name;
        }

        // Проверяем, нужно ли показать всплывающий вопрос "Ваш регион такой-то?"
        const isConfirmedInSession = sessionStorage.getItem('asmt_region_confirmed');
        if (!isConfirmedInSession && !u.regionId) {
          openRegionModal('confirm');
        }
      }

      render();
    } catch (err) {
      state.loading = false;
      if (err && err.status === 401) {
        location.href = 'login.html';
        return;
      }
      root.innerHTML = `<div class="asmt-card"><p class="lead" style="color:var(--danger);">${esc((err && err.message) || 'Ошибка загрузки данных')}</p></div>`;
    }
  }

  // Region events
  if (btnHeaderRegion) {
    btnHeaderRegion.addEventListener('click', () => {
      openRegionModal('confirm');
    });
  }

  if (btnConfirmRegionYes) {
    btnConfirmRegionYes.addEventListener('click', async () => {
      if (currentRegionObj) {
        await saveUserRegion(currentRegionObj.id, currentRegionObj.name);
      } else {
        closeRegionModal();
      }
    });
  }

  if (btnConfirmRegionChange) {
    btnConfirmRegionChange.addEventListener('click', () => {
      openRegionModal('select');
    });
  }

  if (btnCloseRegionSelect) {
    btnCloseRegionSelect.addEventListener('click', closeRegionModal);
  }

  if (inputRegionSearch) {
    inputRegionSearch.addEventListener('input', (e) => {
      const q = normalizeStr(e.target.value);
      if (!q) {
        renderRegionSelectList(allRegionsList);
      } else {
        const filtered = allRegionsList.filter(r => {
          const n = normalizeStr(r.name);
          const c = normalizeStr(r.code);
          return n.includes(q) || c.includes(q);
        });
        renderRegionSelectList(filtered);
      }
    });
  }

  // Tab switching
  if (btnTabMain) {
    btnTabMain.addEventListener('click', () => {
      btnTabMain.classList.add('is-active');
      btnTabProfile.classList.remove('is-active');
      state.activeTab = 'main';
      render();
    });
  }

  if (btnTabProfile) {
    btnTabProfile.addEventListener('click', () => {
      btnTabProfile.classList.add('is-active');
      btnTabMain.classList.remove('is-active');
      state.activeTab = 'profile';
      render();
    });
  }

  if (headerLogoutBtn) {
    headerLogoutBtn.addEventListener('click', async () => {
      await AsmtApi.get('api/auth.php?action=logout');
      location.href = 'login.html';
    });
  }

  const btnRetakeClose = document.getElementById('btnRetakeClose');
  const btnRetakeCancel = document.getElementById('btnRetakeCancel');
  const btnRetakeSubmit = document.getElementById('btnRetakeSubmit');
  const retakeBackdrop = document.getElementById('retakeModalBackdrop');
  if (btnRetakeClose) btnRetakeClose.addEventListener('click', closeRetakeModal);
  if (btnRetakeCancel) btnRetakeCancel.addEventListener('click', closeRetakeModal);
  if (btnRetakeSubmit) btnRetakeSubmit.addEventListener('click', submitRetakeRequest);
  if (retakeBackdrop) {
    retakeBackdrop.addEventListener('click', (e) => {
      if (e.target === retakeBackdrop) closeRetakeModal();
    });
  }

  async function boot() {
    loadCabinetData();
    loadRegionsPublic();
  }

  boot();
})();
