(function () {
  const els = {
    campaignsList: document.getElementById('campaignsList'),
    campaignStatus: document.getElementById('campaignStatus'),
    campaignModalBackdrop: document.getElementById('campaignModalBackdrop'),
    formCampaign: document.getElementById('formCampaign'),
    campRegionId: document.getElementById('campRegionId'),
    campStartsAt: document.getElementById('campStartsAt'),
    campEndsAt: document.getElementById('campEndsAt'),
    btnCreateCampaign: document.getElementById('btnCreateCampaign'),
    btnCloseCampModal: document.getElementById('btnCloseCampModal'),
    btnCancelCampForm: document.getElementById('btnCancelCampForm'),
    btnLogout: document.getElementById('btnLogout'),
  };

  let loadedRegions = [];

  function showStatus(msg, type) {
    els.campaignStatus.textContent = msg || '';
    els.campaignStatus.className = msg ? ('status status--' + (type || 'info')) : 'status';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatIsoForInput(dtStr) {
    if (!dtStr) return '';
    const d = new Date(dtStr);
    if (isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function formatDatesText(startsAt, endsAt) {
    if (!startsAt && !endsAt) return 'Не ограничены';
    const fmt = (s) => s ? String(s).replace('T', ' ').slice(0, 16) : '—';
    return `С ${fmt(startsAt)} по ${fmt(endsAt)}`;
  }

  function populateRegionsSelect(selectedId) {
    if (!els.campRegionId) return;
    const options = [
      '<option value="">Все регионы (Общероссийская)</option>',
      ...loadedRegions.map(r => `<option value="${r.id}" ${selectedId && Number(selectedId) === r.id ? 'selected' : ''}>${esc(r.code)} — ${esc(r.name)}</option>`)
    ];
    els.campRegionId.innerHTML = options.join('');
  }

  async function loadCampaigns() {
    showStatus('Загрузка списка кампаний…', 'info');
    try {
      const data = await AsmtApi.get('api/admin-campaigns.php');
      loadedRegions = data.regions || [];
      populateRegionsSelect(null);

      const list = data.campaigns || [];
      showStatus('', '');

      if (!list.length) {
        els.campaignsList.innerHTML = '<div class="lead">Кампании ещё не созданы</div>';
      } else {
        els.campaignsList.innerHTML = list.map((c) => `
          <div class="campaign-card">
            <div class="campaign-card__info">
              <h4>${esc(c.name)} <span class="badge" style="margin-left:8px; font-size:0.75rem;">${esc(c.code)}</span> ${c.isActive ? '<span class="badge" style="background:var(--green-light); color:var(--green); font-size:0.75rem; margin-left:6px;">Активная</span>' : ''}</h4>
              <div class="campaign-card__meta">
                Регион: <strong style="color:var(--green-dark);">${esc(c.regionName)}</strong> · Сроки: <strong>${formatDatesText(c.startsAt, c.endsAt)}</strong> · Вопросов: <strong>${c.questionsPerAttempt}</strong> · Время: <strong>${c.timeLimitMinutes} мин.</strong> · Пул: <strong>${c.poolSize}</strong> · Попыток: <strong>${c.totalAttempts}</strong>
              </div>
            </div>
            <div class="actions" style="margin:0;">
              <button type="button" class="btn btn--ghost btn--sm" data-edit-camp="${c.id}">Редактировать</button>
            </div>
          </div>
        `).join('');

        els.campaignsList.querySelectorAll('[data-edit-camp]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const camp = list.find(c => c.id === Number(btn.dataset.editCamp));
            if (camp) openCampaignForm(camp);
          });
        });
      }
    } catch (err) {
      showStatus(err.message, 'error');
    }
  }

  function openCampaignForm(camp) {
    els.campaignModalBackdrop.classList.remove('hidden');
    document.getElementById('campFormTitle').textContent = camp ? 'Редактирование кампании' : 'Создание новой кампании';
    document.getElementById('campId').value = camp ? camp.id : 0;
    document.getElementById('campCode').value = camp ? camp.code : '';
    document.getElementById('campName').value = camp ? camp.name : '';
    populateRegionsSelect(camp ? camp.regionId : null);
    document.getElementById('campTimeLimit').value = camp ? camp.timeLimitMinutes : 90;
    document.getElementById('campQuestionsPer').value = camp ? camp.questionsPerAttempt : 40;
    document.getElementById('campPoolSize').value = camp ? camp.poolSize : 100;
    document.getElementById('campIsActive').checked = camp ? camp.isActive : true;
    els.campStartsAt.value = camp ? formatIsoForInput(camp.startsAt) : '';
    els.campEndsAt.value = camp ? formatIsoForInput(camp.endsAt) : '';
  }

  function closeCampaignModal() {
    els.campaignModalBackdrop.classList.add('hidden');
  }

  els.formCampaign.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      id: Number(document.getElementById('campId').value),
      code: document.getElementById('campCode').value.trim(),
      name: document.getElementById('campName').value.trim(),
      regionId: els.campRegionId.value !== '' ? Number(els.campRegionId.value) : null,
      timeLimitMinutes: Number(document.getElementById('campTimeLimit').value),
      questionsPerAttempt: Number(document.getElementById('campQuestionsPer').value),
      poolSize: Number(document.getElementById('campPoolSize').value),
      isActive: document.getElementById('campIsActive').checked,
      startsAt: els.campStartsAt.value ? els.campStartsAt.value : null,
      endsAt: els.campEndsAt.value ? els.campEndsAt.value : null,
    };

    try {
      await AsmtApi.post('api/admin-campaigns.php', payload);
      showStatus('Кампания успешно сохранена', 'ok');
      closeCampaignModal();
      loadCampaigns();
    } catch (err) {
      showStatus(err.message, 'error');
    }
  });

  els.btnCreateCampaign.addEventListener('click', () => openCampaignForm(null));
  if (els.btnCloseCampModal) els.btnCloseCampModal.addEventListener('click', closeCampaignModal);
  if (els.btnCancelCampForm) els.btnCancelCampForm.addEventListener('click', closeCampaignModal);

  async function boot() {
    try {
      const me = await AsmtApi.get('api/auth.php?action=me');
      if (!me.authenticated || !['superadmin', 'region_admin'].includes(me.user.role)) {
        location.href = 'login.html';
        return;
      }
      loadCampaigns();
    } catch (err) {
      location.href = 'login.html';
    }
  }

  els.btnLogout.addEventListener('click', async () => {
    await AsmtApi.get('api/auth.php?action=logout');
    location.href = 'login.html';
  });

  boot();
})();
