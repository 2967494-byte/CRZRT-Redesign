(function () {
  const els = {
    body: document.getElementById('resultsBody'),
    status: document.getElementById('status'),
    campaign: document.getElementById('filterCampaign'),
    filterStatus: document.getElementById('filterStatus'),
    from: document.getElementById('filterFrom'),
    to: document.getElementById('filterTo'),
    q: document.getElementById('filterQ'),
    approvedOnly: document.getElementById('filterApprovedOnly'),
    
    statsBody: document.getElementById('statsBody'),
    statsCampaign: document.getElementById('statsCampaign'),
    statsInn: document.getElementById('statsInn'),
    statsStatus: document.getElementById('statsStatus'),
    
    qaBody: document.getElementById('qaBody'),
    qaCampaign: document.getElementById('qaCampaign'),
    qaRating: document.getElementById('qaRating'),
    qaQ: document.getElementById('qaQ'),
    qaStatus: document.getElementById('qaStatus'),
    
    btnReload: document.getElementById('btnReload'),
    btnExport: document.getElementById('btnExport'),
    btnStatsReload: document.getElementById('btnStatsReload'),
    btnQaReload: document.getElementById('btnQaReload'),
    btnQaExport: document.getElementById('btnQaExport'),
    btnLogout: document.getElementById('btnLogout'),
  };

  let showIp = false;

  function qs() {
    const p = new URLSearchParams();
    if (els.campaign && els.campaign.value) p.set('campaignId', els.campaign.value);
    if (els.filterStatus && els.filterStatus.value) p.set('status', els.filterStatus.value);
    if (els.from && els.from.value) p.set('dateFrom', els.from.value);
    if (els.to && els.to.value) p.set('dateTo', els.to.value);
    if (els.q && els.q.value.trim()) p.set('q', els.q.value.trim());
    if (els.approvedOnly && els.approvedOnly.checked) p.set('approvedOnly', '1');
    return p.toString();
  }

  function showStatus(el, msg, type) {
    if (!el) return;
    el.textContent = msg || '';
    el.className = msg ? ('status status--' + (type || 'info')) : 'status';
  }

  function fillCampaigns(select, list) {
    if (!select) return;
    const cur = select.value;
    select.innerHTML = '<option value="">Все кампании</option>' +
      (list || []).map((c) => `<option value="${c.id}">${c.name} (${c.code})</option>`).join('');
    if (cur) select.value = cur;
  }

  function switchSubTab(subtabName) {
    document.querySelectorAll('.sub-tab-btn').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.subtab === subtabName);
    });

    ['results', 'orgstats', 'qanalytics'].forEach((name) => {
      const el = document.getElementById('subpanel-' + name);
      if (el) el.classList.toggle('hidden', name !== subtabName);
    });

    if (subtabName === 'results') loadResults();
    if (subtabName === 'orgstats') loadOrgStats();
    if (subtabName === 'qanalytics') loadQuestionAnalytics();
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --- RESULTS ---
  function renderResults(items) {
    if (!items.length) {
      els.body.innerHTML = '<tr><td colspan="13">Нет данных</td></tr>';
      return;
    }
    els.body.innerHTML = items.map((it) => {
      const fio = [it.user.lastName, it.user.firstName, it.user.middleName].filter(Boolean).join(' ');
      const ip = showIp ? (it.ipAddress || '—') : '•';
      return `<tr>
        <td>${it.id}</td>
        <td><strong>${esc(fio)}</strong></td>
        <td>${esc(it.user.email)}</td>
        <td>${esc(it.organization.name || '—')} ${it.organization.inn ? '(' + esc(it.organization.inn) + ')' : ''}</td>
        <td><span class="badge">${esc(it.campaign.code)}</span></td>
        <td><span class="badge" style="font-size:0.75rem;">${esc(it.moderationStatus || '—')}</span></td>
        <td><span class="badge" style="background:#eef3f8;">${esc(it.status)}</span></td>
        <td><strong>${it.score}</strong></td>
        <td><strong>${it.percentCorrect}%</strong></td>
        <td><span class="device-pill">${esc(it.deviceType)}</span></td>
        <td>${esc(ip)}</td>
        <td>${(it.startedAt || '').toString().slice(0, 19)}</td>
        <td>${(it.finishedAt || '—').toString().slice(0, 19)}</td>
      </tr>`;
    }).join('');
  }

  async function loadResults() {
    showStatus(els.status, 'Загрузка результатов…', 'info');
    try {
      const data = await AsmtApi.get('api/admin-results.php?' + qs());
      showIp = Boolean(data.showIp);
      fillCampaigns(els.campaign, data.campaigns);
      renderResults(data.items || []);
      showStatus(els.status, `Найдено участников: ${data.total}`, 'ok');
    } catch (err) {
      showStatus(els.status, err.message, 'error');
    }
  }

  // --- ORG STATS ---
  async function loadOrgStats() {
    showStatus(els.statsStatus, 'Загрузка свода по организациям…', 'info');
    try {
      const p = new URLSearchParams();
      if (els.statsCampaign.value) p.set('campaignId', els.statsCampaign.value);
      if (els.statsInn.value.trim()) p.set('inn', els.statsInn.value.trim());
      const data = await AsmtApi.get('api/admin-org-stats.php?' + p.toString());
      fillCampaigns(els.statsCampaign, data.campaigns);
      const items = data.items || [];
      if (!items.length) {
        els.statsBody.innerHTML = '<tr><td colspan="8">Нет данных для отчета</td></tr>';
      } else {
        els.statsBody.innerHTML = items.map((it) => `<tr>
          <td><strong>${esc(it.organization.name)}</strong></td>
          <td>${esc(it.organization.inn || '—')}</td>
          <td><span class="badge">${esc(it.campaign.code)}</span></td>
          <td>${it.attempts}</td>
          <td>${it.avgScore}</td>
          <td><strong>${it.avgPercent}%</strong></td>
          <td>${it.minScore}</td>
          <td>${it.maxScore}</td>
        </tr>`).join('');
      }
      showStatus(els.statsStatus, `Организаций в отчете: ${items.length}`, 'ok');
    } catch (err) {
      showStatus(els.statsStatus, err.message, 'error');
    }
  }

  // --- QUESTION ANALYTICS ---
  async function loadQuestionAnalytics() {
    showStatus(els.qaStatus, 'Формирование аналитики вопросов…', 'info');
    try {
      const p = new URLSearchParams();
      if (els.qaCampaign.value) p.set('campaignId', els.qaCampaign.value);
      if (els.qaRating.value && els.qaRating.value !== 'all') p.set('rating', els.qaRating.value);
      if (els.qaQ.value.trim()) p.set('q', els.qaQ.value.trim());
      const data = await AsmtApi.get('api/admin-question-analytics.php?' + p.toString());
      fillCampaigns(els.qaCampaign, data.campaigns);
      
      const items = data.items || [];
      if (!items.length) {
        els.qaBody.innerHTML = '<tr><td colspan="9">Данные аналитики отсутствуют</td></tr>';
      } else {
        els.qaBody.innerHTML = items.map((it) => `<tr>
          <td><strong>№${it.externalId}</strong></td>
          <td class="wrap" title="${esc(it.text)}">${esc(it.text)}</td>
          <td>${it.answered}</td>
          <td><span style="color:var(--green); font-weight:700;">${it.correct}</span></td>
          <td><span style="color:var(--danger); font-weight:700;">${it.incorrect}</span></td>
          <td>${it.percentCorrect != null ? it.percentCorrect + '%' : '—'}</td>
          <td>${it.failRate != null ? it.failRate + '%' : '—'}</td>
          <td><span class="rating-pill ${it.rating}">${it.rating}</span></td>
          <td>${it.formulationsUsed}</td>
        </tr>`).join('');
      }
      showStatus(els.qaStatus, `Вопросов в аналитике: ${data.total}`, 'ok');
    } catch (err) {
      showStatus(els.qaStatus, err.message, 'error');
    }
  }

  // Listeners
  document.querySelectorAll('.sub-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchSubTab(btn.dataset.subtab));
  });

  els.btnReload.addEventListener('click', loadResults);
  els.btnStatsReload.addEventListener('click', loadOrgStats);
  els.btnQaReload.addEventListener('click', loadQuestionAnalytics);

  els.btnExport.addEventListener('click', () => {
    const p = new URLSearchParams(qs());
    if (!p.get('status')) p.set('status', 'all');
    window.location.href = 'api/admin-export.php?' + p.toString();
  });

  els.btnQaExport.addEventListener('click', () => {
    const p = new URLSearchParams();
    if (els.qaCampaign.value) p.set('campaignId', els.qaCampaign.value);
    if (els.qaRating.value && els.qaRating.value !== 'all') p.set('rating', els.qaRating.value);
    window.location.href = 'api/admin-question-analytics-export.php?' + p.toString();
  });

  if (els.q) els.q.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadResults(); });
  if (els.qaQ) els.qaQ.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadQuestionAnalytics(); });

  async function boot() {
    try {
      const me = await AsmtApi.get('api/auth.php?action=me');
      if (!me.authenticated || !['superadmin', 'region_admin', 'moderator', 'analyst'].includes(me.user.role)) {
        location.href = 'login.html';
        return;
      }
      loadResults();
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
