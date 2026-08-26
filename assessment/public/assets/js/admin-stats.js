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

    // Modal
    modal: document.getElementById('attemptModal'),
    modalTitle: document.getElementById('modalAttemptTitle'),
    modalSubtitle: document.getElementById('modalAttemptSubtitle'),
    modalContent: document.getElementById('modalAttemptContent'),
    modalFootNote: document.getElementById('modalAttemptFootNote'),
    modalActions: document.getElementById('modalAttemptActions'),
    btnCloseModal: document.getElementById('btnCloseModal'),
  };

  let showIp = false;
  let cachedResults = [];

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

  function formatDt(v) {
    if (!v) return '—';
    return String(v).replace('T', ' ').slice(0, 16);
  }

  function formatSec(sec) {
    const s = Number(sec) || 0;
    if (s < 60) return `${s} сек`;
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m} мин ${rem} сек`;
  }

  function telemetryPill(it) {
    const drops = it.disconnectCount || 0;
    const offSec = it.totalOfflineSeconds || 0;
    const hideSec = it.tabHiddenSeconds || 0;

    if (drops > 0) {
      return `<span class="badge" style="background:#fee2e2; color:#b91c1c; font-weight:700; font-size:0.72rem;" title="Обрывов: ${drops}, оффлайн: ${formatSec(offSec)}">
        ${drops} сбоя (${formatSec(offSec)})
      </span>`;
    }
    if (hideSec > 30) {
      return `<span class="badge" style="background:#fffbeb; color:#b45309; font-weight:700; font-size:0.72rem;" title="Вне вкладки: ${formatSec(hideSec)}">
        Вне вкладки: ${formatSec(hideSec)}
      </span>`;
    }
    return `<span class="badge" style="background:#ecfdf5; color:#047857; font-weight:700; font-size:0.72rem;">
      Стабильно (0 сбоев)
    </span>`;
  }

  // --- RESULTS TABLE ---
  function renderResults(items) {
    cachedResults = items;
    if (!items.length) {
      els.body.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--muted);">Нет данных</td></tr>';
      return;
    }

    els.body.innerHTML = items.map((it) => {
      const u = it.user || {};
      const org = it.organization || {};
      const fio = [u.lastName, u.firstName, u.middleName].filter(Boolean).join(' ') || 'Без имени';
      
      const pct = Math.round(it.percentCorrect || 0);
      const isPassed = pct >= 70;
      const scoreBadge = `<span class="badge" style="background:${isPassed ? '#dcfce7' : '#fee2e2'}; color:${isPassed ? '#15803d' : '#b91c1c'}; font-weight:700;">
        ${it.score} / ${it.totalQuestions} (${pct}%)
      </span>`;

      const modBadge = it.moderationStatus === 'approved'
        ? '<span class="badge" style="background:#dcfce7; color:#15803d; font-size:0.7rem; font-weight:700;">Approved</span>'
        : (it.moderationStatus === 'pending' ? '<span class="badge" style="background:#fef3c7; color:#b45309; font-size:0.7rem; font-weight:700;">Pending</span>' : '');

      return `<tr>
        <td><strong>#${it.id}</strong></td>
        <td>
          <div style="font-weight:700; color:#0f172a; line-height:1.2;">${esc(fio)}</div>
          <div style="font-size:0.75rem; color:var(--muted); margin-top:2px;">${esc(u.email || '')} ${u.phone ? '· ' + esc(u.phone) : ''}</div>
        </td>
        <td>
          <div style="font-weight:600; line-height:1.2; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:210px;" title="${esc(org.name || '—')}">${esc(org.name || '—')}</div>
          <div style="font-size:0.72rem; color:var(--muted); margin-top:2px; display:flex; align-items:center; gap:4px;">
            <span>ИНН: ${esc(org.inn || '—')}</span>
            ${modBadge}
          </div>
        </td>
        <td>
          <div style="font-weight:600; font-size:0.82rem; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:140px;" title="${esc(it.campaign.name || '')}">${esc(it.campaign.name || it.campaign.code)}</div>
        </td>
        <td>
          ${scoreBadge}
        </td>
        <td>
          <div style="font-size:0.78rem; font-weight:600; color:#334155;">${formatDt(it.finishedAt || it.startedAt)}</div>
          <div style="margin-top:2px;">${telemetryPill(it)}</div>
        </td>
        <td style="text-align:right;">
          <div style="display:inline-flex; align-items:center; gap:6px;">
            <button type="button" class="btn-icon-action btn-icon-info" data-view-attempt="${it.id}" title="Подробная информация о попытке" aria-label="Инфо">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </button>
            <a href="complete.html?attemptId=${it.id}" target="_blank" class="btn-icon-action btn-icon-login" title="Открыть билет и разбор ответов" aria-label="Билет">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </a>
          </div>
        </td>
      </tr>`;
    }).join('');

    els.body.querySelectorAll('[data-view-attempt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-view-attempt'));
        const attempt = cachedResults.find((a) => a.id === id);
        if (attempt) openAttemptModal(attempt);
      });
    });
  }

  function openAttemptModal(att) {
    const u = att.user || {};
    const org = att.organization || {};
    const fio = [u.lastName, u.firstName, u.middleName].filter(Boolean).join(' ') || 'Без имени';
    const pct = Math.round(att.percentCorrect || 0);

    els.modalTitle.textContent = `Попытка #${att.id} · ${fio}`;
    els.modalSubtitle.textContent = `${att.campaign.name || att.campaign.code} · ${formatDt(att.finishedAt || att.startedAt)}`;

    const drops = att.disconnectCount || 0;
    const offSec = att.totalOfflineSeconds || 0;
    const hideSec = att.tabHiddenSeconds || 0;
    const durationMin = att.durationSeconds ? Math.round(att.durationSeconds / 60) : 0;

    let eventsHtml = '<span style="color:var(--muted); font-size:0.8rem;">Сбоев соединения не зафиксировано</span>';
    if (att.telemetryLog && att.telemetryLog.length) {
      eventsHtml = att.telemetryLog.map((ev) => `
        <div style="font-size:0.78rem; padding:4px 0; border-bottom:1px dashed #e2e8f0; display:flex; justify-content:space-between;">
          <span><strong>${esc(ev.type)}</strong>: ${esc(ev.detail || '')}</span>
          <span style="color:var(--muted);">${String(ev.ts || '').slice(11, 19)}</span>
        </div>
      `).join('');
    }

    els.modalContent.innerHTML = `
      <div class="modal-grid-2">
        <div class="modal-section">
          <div class="modal-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Участник и организация
          </div>
          <div class="modal-field"><span class="modal-field-label">ФИО:</span><span class="modal-field-val">${esc(fio)}</span></div>
          <div class="modal-field"><span class="modal-field-label">Email:</span><span class="modal-field-val">${esc(u.email || '—')}</span></div>
          <div class="modal-field"><span class="modal-field-label">Телефон:</span><span class="modal-field-val">${esc(u.phone || '—')}</span></div>
          <div class="modal-field"><span class="modal-field-label">Должность:</span><span class="modal-field-val">${esc(u.position || '—')}</span></div>
          <div class="modal-field"><span class="modal-field-label">Организация:</span><span class="modal-field-val">${esc(org.name || '—')}</span></div>
          <div class="modal-field"><span class="modal-field-label">ИНН орг.:</span><span class="modal-field-val">${esc(org.inn || '—')}</span></div>
          <div class="modal-field"><span class="modal-field-label">Модерация:</span><span class="modal-field-val">${esc(att.moderationStatus || '—')}</span></div>
        </div>

        <div class="modal-section">
          <div class="modal-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
            Параметры сессии
          </div>
          <div class="modal-field"><span class="modal-field-label">Статус попытки:</span><span class="modal-field-val">${esc(att.status)}</span></div>
          <div class="modal-field"><span class="modal-field-label">Начало:</span><span class="modal-field-val">${formatDt(att.startedAt)}</span></div>
          <div class="modal-field"><span class="modal-field-label">Завершение:</span><span class="modal-field-val">${formatDt(att.finishedAt)}</span></div>
          <div class="modal-field"><span class="modal-field-label">Длительность:</span><span class="modal-field-val">${formatSec(att.durationSeconds)} (${durationMin} мин)</span></div>
          <div class="modal-field"><span class="modal-field-label">Устройство:</span><span class="modal-field-val">${esc(att.deviceType || 'desktop')}</span></div>
          <div class="modal-field"><span class="modal-field-label">IP адрес:</span><span class="modal-field-val">${esc(att.ipAddress || '—')}</span></div>
          ${att.userAgent ? `<div class="modal-field"><span class="modal-field-label">Браузер:</span><span class="modal-field-val" style="font-size:0.75rem; max-width:200px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" title="${esc(att.userAgent)}">${esc(att.userAgent)}</span></div>` : ''}
        </div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Результаты тестирования
        </div>
        <div class="modal-grid-2">
          <div>
            <div class="modal-field"><span class="modal-field-label">Всего вопросов:</span><span class="modal-field-val">${att.totalQuestions}</span></div>
            <div class="modal-field"><span class="modal-field-label">Отвечено:</span><span class="modal-field-val">${att.answeredCount}</span></div>
            <div class="modal-field"><span class="modal-field-label">Верных ответов:</span><span class="modal-field-val" style="color:var(--green);">${att.correctCount}</span></div>
          </div>
          <div>
            <div class="modal-field"><span class="modal-field-label">Неверных ответов:</span><span class="modal-field-val" style="color:var(--danger);">${att.incorrectCount}</span></div>
            <div class="modal-field"><span class="modal-field-label">Процент правильных:</span><span class="modal-field-val" style="font-size:1.1rem; color:${pct >= 70 ? 'var(--green)' : 'var(--danger)'};">${pct}%</span></div>
            <div class="modal-field"><span class="modal-field-label">Итог:</span><span class="modal-field-val">${pct >= 70 ? '<strong style="color:var(--green);">Зачтено</strong>' : '<strong style="color:var(--danger);">Не зачтено</strong>'}</span></div>
          </div>
        </div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
          Телеметрия интернет-соединения
        </div>
        <div class="modal-grid-2" style="margin-bottom:8px;">
          <div class="modal-field"><span class="modal-field-label">Число обрывов:</span><span class="modal-field-val">${drops}</span></div>
          <div class="modal-field"><span class="modal-field-label">Общее время оффлайн:</span><span class="modal-field-val">${formatSec(offSec)}</span></div>
        </div>
        <div class="modal-field" style="margin-bottom:8px;"><span class="modal-field-label">Время вне активной вкладки:</span><span class="modal-field-val">${formatSec(hideSec)}</span></div>
        <div style="margin-top:8px; border-top:1px solid #e2e8f0; padding-top:8px;">
          <div style="font-weight:600; font-size:0.75rem; color:var(--muted); margin-bottom:4px;">Журнал сетевых событий:</div>
          ${eventsHtml}
        </div>
      </div>
    `;

    els.modalFootNote.textContent = `Попытка зарегистрирована в системе ID #${att.id}`;
    els.modalActions.innerHTML = `
      <a href="complete.html?attemptId=${att.id}" target="_blank" class="btn btn--primary" style="padding:6px 16px; display:inline-flex; align-items:center; gap:6px;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        <span>Открыть билет и разбор ответов</span>
      </a>
    `;

    els.modal.classList.add('is-open');
  }

  function closeModal() {
    if (els.modal) els.modal.classList.remove('is-open');
  }

  if (els.btnCloseModal) els.btnCloseModal.addEventListener('click', closeModal);
  if (els.modal) {
    els.modal.addEventListener('click', (e) => {
      if (e.target === els.modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

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
        els.statsBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--muted);">Нет данных для отчета</td></tr>';
      } else {
        els.statsBody.innerHTML = items.map((it) => `<tr>
          <td><strong style="color:#0f172a;">${esc(it.organization.name)}</strong></td>
          <td><span style="font-family:monospace; color:var(--muted);">${esc(it.organization.inn || '—')}</span></td>
          <td><span class="badge" style="font-size:0.75rem;">${esc(it.campaign.code)}</span></td>
          <td style="text-align:center; font-weight:700;">${it.attempts}</td>
          <td style="text-align:center;"><strong>${it.avgScore}</strong> <small style="color:var(--muted);">(${it.avgPercent}%)</small></td>
          <td style="text-align:center; font-weight:600;">${it.minScore} — ${it.maxScore}</td>
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
        els.qaBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--muted);">Данные аналитики отсутствуют</td></tr>';
      } else {
        els.qaBody.innerHTML = items.map((it) => {
          const ratingClass = it.rating === 'easy' ? 'background:#dcfce7; color:#15803d;'
            : (it.rating === 'hard' ? 'background:#fef3c7; color:#b45309;'
            : (it.rating === 'needs_correction' ? 'background:#fee2e2; color:#b91c1c;' : 'background:#f1f5f9; color:#475569;'));
          return `<tr>
            <td><strong>№${it.externalId}</strong></td>
            <td style="white-space:normal; max-width:400px; line-height:1.3;" title="${esc(it.text)}">${esc(it.text)}</td>
            <td style="text-align:center; font-weight:600;">${it.answered}</td>
            <td style="text-align:center;">
              <strong style="color:${(it.percentCorrect || 0) >= 70 ? 'var(--green)' : 'var(--danger)'};">${it.percentCorrect != null ? it.percentCorrect + '%' : '—'}</strong>
            </td>
            <td style="text-align:center;"><span class="badge" style="${ratingClass} font-weight:700; font-size:0.75rem;">${esc(it.rating)}</span></td>
            <td style="text-align:center; font-weight:600;">${it.formulationsUsed}</td>
          </tr>`;
        }).join('');
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
