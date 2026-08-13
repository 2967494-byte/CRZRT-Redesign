(function () {
  const els = {
    meta: document.getElementById('adminMeta'),
    body: document.getElementById('resultsBody'),
    status: document.getElementById('status'),
    campaign: document.getElementById('filterCampaign'),
    filterStatus: document.getElementById('filterStatus'),
    from: document.getElementById('filterFrom'),
    to: document.getElementById('filterTo'),
    q: document.getElementById('filterQ'),
    approvedOnly: document.getElementById('filterApprovedOnly'),
    
    modBody: document.getElementById('modBody'),
    modStatus: document.getElementById('modStatus'),
    modQ: document.getElementById('modQ'),
    modStatusMsg: document.getElementById('modStatusMsg'),
    
    statsBody: document.getElementById('statsBody'),
    statsCampaign: document.getElementById('statsCampaign'),
    statsInn: document.getElementById('statsInn'),
    statsStatus: document.getElementById('statsStatus'),
    
    qBankBody: document.getElementById('qBankBody'),
    qBankQ: document.getElementById('qBankQ'),
    qBankStatus: document.getElementById('qBankStatus'),
    qDetail: document.getElementById('qDetail'),
    
    qaBody: document.getElementById('qaBody'),
    qaCampaign: document.getElementById('qaCampaign'),
    qaRating: document.getElementById('qaRating'),
    qaQ: document.getElementById('qaQ'),
    qaStatus: document.getElementById('qaStatus'),
    
    // Campaigns
    campaignsList: document.getElementById('campaignsList'),
    campaignStatus: document.getElementById('campaignStatus'),
    campaignFormBox: document.getElementById('campaignFormBox'),
    formCampaign: document.getElementById('formCampaign'),
    
    // Tiles Badges
    tileQCount: document.getElementById('tileQCount'),
    tileStatsCount: document.getElementById('tileStatsCount'),
    tileCampCount: document.getElementById('tileCampCount'),
    tileModCount: document.getElementById('tileModCount'),
  };

  let showIp = false;
  let canModerate = false;
  let canEditQuestions = false;
  let role = '';

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

  function switchTab(name) {
    // Update main nav buttons
    document.querySelectorAll('.admin-nav-btn').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.tab === name);
    });

    // Hide all panels
    document.querySelectorAll('.panel').forEach((p) => p.classList.add('hidden'));
    
    // Show target panel
    const panel = document.getElementById('panel-' + name);
    if (panel) panel.classList.remove('hidden');

    if (name === 'campaigns') loadCampaigns();
    if (name === 'questions') loadQuestionBank();
    if (name === 'moderation') loadModeration();
    if (name === 'stats') {
      const activeSubtabBtn = document.querySelector('.sub-tab-btn.is-active');
      const subtab = activeSubtabBtn ? activeSubtabBtn.dataset.subtab : 'results';
      switchSubTab(subtab);
    }
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

  // --- CAMPAIGNS ---
  async function loadCampaigns() {
    showStatus(els.campaignStatus, 'Загрузка списка кампаний…', 'info');
    try {
      const data = await AsmtApi.get('api/admin-campaigns.php');
      const list = data.campaigns || [];
      
      const activeCount = list.filter(c => c.isActive).length;
      els.tileCampCount.textContent = activeCount ? `Активно: ${activeCount}` : 'Нет активных';

      if (!list.length) {
        els.campaignsList.innerHTML = '<div class="lead">Кампании ещё не созданы</div>';
      } else {
        els.campaignsList.innerHTML = list.map((c) => `
          <div class="campaign-card">
            <div class="campaign-card__info">
              <h4>${esc(c.name)} <span class="badge" style="margin-left:8px; font-size:0.75rem;">${esc(c.code)}</span> ${c.isActive ? '<span class="badge" style="background:var(--green-light); color:var(--green); font-size:0.75rem;">Активная</span>' : ''}</h4>
              <div class="campaign-card__meta">
                Вопросов в попытке: <strong>${c.questionsPerAttempt}</strong> · Время: <strong>${c.timeLimitMinutes} мин.</strong> · Пул: <strong>${c.poolSize} вопросов</strong> · Всего попыток: <strong>${c.totalAttempts}</strong>
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
      showStatus(els.campaignStatus, '', '');
    } catch (err) {
      showStatus(els.campaignStatus, err.message, 'error');
    }
  }

  function openCampaignForm(camp) {
    els.campaignFormBox.classList.remove('hidden');
    document.getElementById('campFormTitle').textContent = camp ? 'Редактирование кампании' : 'Создание новой кампании';
    document.getElementById('campId').value = camp ? camp.id : 0;
    document.getElementById('campCode').value = camp ? camp.code : '';
    document.getElementById('campName').value = camp ? camp.name : '';
    document.getElementById('campTimeLimit').value = camp ? camp.timeLimitMinutes : 90;
    document.getElementById('campQuestionsPer').value = camp ? camp.questionsPerAttempt : 40;
    document.getElementById('campPoolSize').value = camp ? camp.poolSize : 100;
    document.getElementById('campIsActive').checked = camp ? camp.isActive : true;
    els.campaignFormBox.scrollIntoView({ behavior: 'smooth' });
  }

  els.formCampaign.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      id: Number(document.getElementById('campId').value),
      code: document.getElementById('campCode').value.trim(),
      name: document.getElementById('campName').value.trim(),
      timeLimitMinutes: Number(document.getElementById('campTimeLimit').value),
      questionsPerAttempt: Number(document.getElementById('campQuestionsPer').value),
      poolSize: Number(document.getElementById('campPoolSize').value),
      isActive: document.getElementById('campIsActive').checked,
    };

    try {
      await AsmtApi.post('api/admin-campaigns.php', payload);
      showStatus(els.campaignStatus, 'Кампания успешно сохранена', 'ok');
      els.campaignFormBox.classList.add('hidden');
      loadCampaigns();
    } catch (err) {
      showStatus(els.campaignStatus, err.message, 'error');
    }
  });

  document.getElementById('btnCreateCampaign').addEventListener('click', () => openCampaignForm(null));
  document.getElementById('btnCancelCampForm').addEventListener('click', () => els.campaignFormBox.classList.add('hidden'));

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
      els.tileStatsCount.textContent = `Записей: ${data.total}`;
    } catch (err) {
      showStatus(els.status, err.message, 'error');
    }
  }

  // --- MODERATION ---
  function renderModeration(items) {
    if (!items.length) {
      els.modBody.innerHTML = '<tr><td colspan="7">Очередь модерации пуста</td></tr>';
      return;
    }
    els.modBody.innerHTML = items.map((it) => {
      const fio = [it.user.lastName, it.user.firstName, it.user.middleName].filter(Boolean).join(' ');
      const hier = [it.organization.level1, it.organization.level2].filter(Boolean).join(' → ') || '—';
      const actions = canModerate
        ? `<div class="mod-actions">
             <button type="button" class="btn btn--primary btn--sm" data-act="approve" data-id="${it.id}">Утвердить</button>
             <button type="button" class="btn btn--ghost btn--sm" data-act="needs_info" data-id="${it.id}">Уточнить</button>
             <button type="button" class="btn btn--ghost btn--sm" style="color:var(--danger);" data-act="reject" data-id="${it.id}">Отклонить</button>
           </div>`
        : 'только просмотр';
      return `<tr>
        <td>${it.id}</td>
        <td><strong>${esc(fio)}</strong><br><small style="color:var(--muted);">${esc(it.user.email)}</small></td>
        <td>${esc(it.organization.name || '—')} ${it.organization.inn ? '(' + esc(it.organization.inn) + ')' : ''}</td>
        <td>${esc(hier)}</td>
        <td><span class="badge" style="background:${it.status === 'pending' ? 'var(--amber-light)' : '#eef3f8'}; color:${it.status === 'pending' ? 'var(--amber)' : 'inherit'};">${esc(it.status)}</span></td>
        <td>${(it.requestedAt || '').toString().slice(0, 19)}</td>
        <td>${actions}</td>
      </tr>`;
    }).join('');

    els.modBody.querySelectorAll('button[data-act]').forEach((btn) => {
      btn.addEventListener('click', () => moderate(Number(btn.dataset.id), btn.dataset.act));
    });
  }

  async function moderate(id, action) {
    let comment = '';
    if (action !== 'approve') {
      comment = window.prompt(action === 'reject' ? 'Укажите причину отклонения' : 'Что необходимо уточнить у участника?') || '';
      if (!comment.trim()) {
        showStatus(els.modStatusMsg, 'Необходимо указать комментарий модератора', 'error');
        return;
      }
    }
    try {
      await AsmtApi.post('api/admin-moderation.php', { id, action, comment });
      showStatus(els.modStatusMsg, 'Статус заявки обновлён', 'ok');
      loadModeration();
    } catch (err) {
      showStatus(els.modStatusMsg, err.message, 'error');
    }
  }

  async function loadModeration() {
    showStatus(els.modStatusMsg, 'Загрузка заявок…', 'info');
    try {
      const p = new URLSearchParams();
      p.set('status', els.modStatus.value || 'pending');
      if (els.modQ.value.trim()) p.set('q', els.modQ.value.trim());
      const data = await AsmtApi.get('api/admin-moderation.php?' + p.toString());
      canModerate = Boolean(data.canModerate);
      renderModeration(data.items || []);
      showStatus(els.modStatusMsg, `Всего заявок: ${data.total}`, 'ok');
      els.tileModCount.textContent = `Pending: ${data.total}`;
    } catch (err) {
      showStatus(els.modStatusMsg, err.message, 'error');
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

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --- QUESTION BANK ---
  async function loadQuestionBank() {
    showStatus(els.qBankStatus, 'Загрузка банка вопросов…', 'info');
    els.qDetail.classList.add('hidden');
    try {
      const p = new URLSearchParams();
      if (els.qBankQ.value.trim()) p.set('q', els.qBankQ.value.trim());
      p.set('limit', '100');
      const data = await AsmtApi.get('api/admin-questions.php?' + p.toString());
      canEditQuestions = Boolean(data.canEdit);
      const items = data.items || [];
      els.tileQCount.textContent = `${data.total} вопросов`;

      if (!items.length) {
        els.qBankBody.innerHTML = '<tr><td colspan="5">Вопросы не найдены</td></tr>';
      } else {
        els.qBankBody.innerHTML = items.map((it) => `<tr>
          <td><strong>№${it.externalId}</strong></td>
          <td class="wrap">${esc(it.text)}</td>
          <td><span class="badge" style="background:var(--green-light); color:var(--green); font-weight:700;">${esc(it.correctLetter)}</span></td>
          <td>${it.formulationsCount}</td>
          <td><button type="button" class="btn btn--ghost btn--sm" data-qid="${it.id}">Открыть</button></td>
        </tr>`).join('');

        els.qBankBody.querySelectorAll('button[data-qid]').forEach((btn) => {
          btn.addEventListener('click', () => openQuestion(Number(btn.dataset.qid)));
        });
      }
      showStatus(els.qBankStatus, `Всего вопросов: ${data.total}`, 'ok');
    } catch (err) {
      showStatus(els.qBankStatus, err.message, 'error');
    }
  }

  async function openQuestion(id) {
    try {
      const data = await AsmtApi.get('api/admin-questions.php?id=' + id);
      const q = data.question;
      canEditQuestions = Boolean(data.canEdit);
      const forms = (q.formulations || []).map((f, idx) => `
        <div class="form-item" data-fid="${f.id}">
          <label class="field">Формулировка #${idx + 1} ${f.isActive ? '' : '(отключена)'}
            <textarea data-field="text">${esc(f.text)}</textarea>
          </label>
          <div class="actions" style="margin-top:8px;">
            ${canEditQuestions ? `
              <button type="button" class="btn btn--primary btn--sm" data-save-f="${f.id}">Сохранить</button>
              <button type="button" class="btn btn--ghost btn--sm" style="color:var(--danger);" data-del-f="${f.id}">Отключить</button>
            ` : ''}
          </div>
        </div>
      `).join('');

      els.qDetail.classList.remove('hidden');
      els.qDetail.innerHTML = `
        <h2 style="margin:0 0 8px; font-size:1.2rem;">Редактирование вопроса №${q.externalId}</h2>
        <p class="lead" style="margin-bottom:14px;">Правильный вариант ответа: <span class="badge" style="background:var(--green-light); color:var(--green); font-weight:700; font-size:0.9rem;">${esc(q.correctLetter)}</span></p>
        
        <label class="field" style="margin-bottom:12px;">Базовый текст вопроса
          <textarea id="qBaseText">${esc(q.text)}</textarea>
        </label>

        ${canEditQuestions ? `
          <div class="actions" style="margin-bottom:18px;">
            <button type="button" class="btn btn--primary" id="btnSaveQuestion">Сохранить базовый вопрос</button>
          </div>
        ` : ''}

        <h3 style="margin:18px 0 10px; font-size:1.05rem;">Формулировки вопроса (вариации)</h3>
        ${forms || '<p class="lead">Нет альтернативных формулировок</p>'}

        ${canEditQuestions ? `
          <div class="form-item" style="margin-top:14px;">
            <label class="field">Добавить новую вариацию формулировки
              <textarea id="newFormText" placeholder="Введите текст альтернативной формулировки…"></textarea>
            </label>
            <div class="actions" style="margin-top:8px;">
              <button type="button" class="btn btn--primary btn--sm" id="btnAddForm">+ Добавить формулировку</button>
            </div>
          </div>
        ` : ''}
      `;

      els.qDetail.scrollIntoView({ behavior: 'smooth' });

      if (canEditQuestions) {
        document.getElementById('btnSaveQuestion').addEventListener('click', async () => {
          await AsmtApi.post('api/admin-questions.php', {
            action: 'save-question',
            questionId: q.id,
            text: document.getElementById('qBaseText').value,
            correctLetter: q.correctLetter,
            isActive: q.isActive,
          });
          showStatus(els.qBankStatus, 'Базовый вопрос сохранён', 'ok');
          openQuestion(q.id);
        });

        els.qDetail.querySelectorAll('[data-save-f]').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const wrap = btn.closest('.form-item');
            const text = wrap.querySelector('textarea').value;
            await AsmtApi.post('api/admin-questions.php', {
              action: 'save-formulation',
              questionId: q.id,
              formulationId: Number(btn.dataset.saveF),
              text,
              isActive: true,
            });
            showStatus(els.qBankStatus, 'Формулировка сохранена', 'ok');
            openQuestion(q.id);
          });
        });

        els.qDetail.querySelectorAll('[data-del-f]').forEach((btn) => {
          btn.addEventListener('click', async () => {
            await AsmtApi.post('api/admin-questions.php', {
              action: 'delete-formulation',
              questionId: q.id,
              formulationId: Number(btn.dataset.delF),
            });
            openQuestion(q.id);
            loadQuestionBank();
          });
        });

        document.getElementById('btnAddForm').addEventListener('click', async () => {
          const text = document.getElementById('newFormText').value.trim();
          if (!text) return;
          await AsmtApi.post('api/admin-questions.php', {
            action: 'save-formulation',
            questionId: q.id,
            formulationId: 0,
            text,
            sortOrder: (q.formulations || []).length,
            isActive: true,
          });
          openQuestion(q.id);
          loadQuestionBank();
        });
      }
    } catch (err) {
      showStatus(els.qBankStatus, err.message, 'error');
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

  // --- INITIALIZATION ---
  async function boot() {
    try {
      const me = await AsmtApi.get('api/auth.php?action=me');
      if (!me.authenticated) {
        location.href = 'login.html';
        return;
      }
      role = me.user.role;
      if (!['superadmin', 'region_admin', 'moderator', 'analyst'].includes(role)) {
        location.href = 'cabinet.html';
        return;
      }
      els.meta.textContent = `${me.user.lastName || ''} ${me.user.firstName || ''} · Роль: ${role}`;
      
      // Load initial dashboard stats
      loadCampaigns();
      loadQuestionBank();
      loadModeration();
      loadResults();

      switchTab('campaigns');
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        location.href = 'login.html';
        return;
      }
      showStatus(els.status, err.message, 'error');
    }
  }

  // Event Listeners for Nav Buttons
  document.querySelectorAll('.admin-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.querySelectorAll('.tile-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.targetTab));
  });

  document.querySelectorAll('.sub-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchSubTab(btn.dataset.subtab));
  });

  document.getElementById('btnReload').addEventListener('click', loadResults);
  document.getElementById('btnModReload').addEventListener('click', loadModeration);
  document.getElementById('btnStatsReload').addEventListener('click', loadOrgStats);
  document.getElementById('btnQBankReload').addEventListener('click', loadQuestionBank);
  document.getElementById('btnQaReload').addEventListener('click', loadQuestionAnalytics);

  document.getElementById('btnExport').addEventListener('click', () => {
    const p = new URLSearchParams(qs());
    if (!p.get('status')) p.set('status', 'all');
    window.location.href = 'api/admin-export.php?' + p.toString();
  });

  document.getElementById('btnQaExport').addEventListener('click', () => {
    const p = new URLSearchParams();
    if (els.qaCampaign.value) p.set('campaignId', els.qaCampaign.value);
    if (els.qaRating.value && els.qaRating.value !== 'all') p.set('rating', els.qaRating.value);
    window.location.href = 'api/admin-question-analytics-export.php?' + p.toString();
  });

  document.getElementById('btnLogout').addEventListener('click', async () => {
    await AsmtApi.get('api/auth.php?action=logout');
    location.href = 'login.html';
  });

  if (els.q) els.q.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadResults(); });
  if (els.modQ) els.modQ.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadModeration(); });
  if (els.qBankQ) els.qBankQ.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadQuestionBank(); });
  if (els.qaQ) els.qaQ.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadQuestionAnalytics(); });

  boot();
})();
