(function () {
  const els = {
    body: document.getElementById('reqBody'),
    status: document.getElementById('reqStatus'),
    statusMsg: document.getElementById('reqStatusMsg'),
    btnReload: document.getElementById('btnReqReload'),
    btnLogout: document.getElementById('btnLogout'),
  };

  let canModerate = false;

  const statusLabel = {
    pending: 'На рассмотрении',
    approved: 'Одобрен',
    rejected: 'Отклонён',
    used: 'Использован',
  };

  function showStatus(msg, type) {
    els.statusMsg.textContent = msg || '';
    els.statusMsg.className = msg ? ('status status--' + (type || 'info')) : 'status';
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
    return String(v).replace('T', ' ').slice(0, 19);
  }

  function render(items) {
    if (!items.length) {
      els.body.innerHTML = '<tr><td colspan="8">Запросов нет</td></tr>';
      return;
    }
    els.body.innerHTML = items.map((it) => {
      const u = it.user || {};
      const fio = [u.lastName, u.firstName, u.middleName].filter(Boolean).join(' ');
      const score = it.attemptId != null
        ? `#${it.attemptId} · ${it.attemptScore ?? 0}/${it.attemptTotal ?? '—'} (${Math.round(it.attemptPercent || 0)}%)`
        : '—';
      const badgeBg = it.status === 'pending' ? 'var(--amber-light)'
        : it.status === 'approved' ? 'var(--green-light)'
        : '#eef3f8';
      const badgeColor = it.status === 'pending' ? 'var(--amber)'
        : it.status === 'approved' ? 'var(--green)'
        : 'inherit';
      const actions = (canModerate && it.status === 'pending')
        ? `<div class="req-actions">
             <button type="button" class="btn btn--primary btn--sm" data-act="approve" data-id="${it.id}">Одобрить</button>
             <button type="button" class="btn btn--ghost btn--sm" style="color:var(--danger);" data-act="reject" data-id="${it.id}">Отклонить</button>
           </div>`
        : (it.adminComment ? esc(it.adminComment) : '—');
      return `<tr>
        <td>#${it.id}</td>
        <td><strong>${esc(fio)}</strong><br><small style="color:var(--muted);">${esc(u.email || '')}</small></td>
        <td>${esc(it.campaignName)}</td>
        <td>${esc(score)}</td>
        <td class="req-reason">${esc(it.reason)}</td>
        <td>${formatDt(it.createdAt)}</td>
        <td><span class="badge" style="background:${badgeBg}; color:${badgeColor};">${esc(statusLabel[it.status] || it.status)}</span></td>
        <td>${actions}</td>
      </tr>`;
    }).join('');
  }

  async function load() {
    showStatus('Загрузка…', 'info');
    try {
      const status = els.status.value || 'pending';
      const data = await AsmtApi.get('api/admin-retake-requests.php?status=' + encodeURIComponent(status));
      canModerate = !!data.canModerate;
      render(data.items || []);
      showStatus('Всего: ' + (data.total || 0), 'info');
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        location.href = 'login.html';
        return;
      }
      showStatus(err.message || 'Ошибка загрузки', 'error');
      els.body.innerHTML = '<tr><td colspan="8">Ошибка загрузки</td></tr>';
    }
  }

  async function decide(id, action) {
    let comment = '';
    if (action === 'reject') {
      const entered = window.prompt('Причина отклонения (будет показана участнику). Можно оставить пустым:');
      if (entered === null) return;
      comment = String(entered).trim();
    }
    try {
      await AsmtApi.post('api/admin-retake-requests.php', { id, action, comment });
      showStatus(action === 'approve' ? 'Запрос одобрен' : 'Запрос отклонён', 'info');
      await load();
    } catch (err) {
      showStatus(err.message || 'Ошибка', 'error');
    }
  }

  els.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    decide(Number(btn.getAttribute('data-id')), btn.getAttribute('data-act'));
  });

  els.status.addEventListener('change', load);
  els.btnReload.addEventListener('click', load);
  els.btnLogout.addEventListener('click', async () => {
    await AsmtApi.get('api/auth.php?action=logout');
    location.href = 'login.html';
  });

  (async function boot() {
    try {
      const me = await AsmtApi.get('api/auth.php?action=me');
      if (!me.authenticated || !['superadmin', 'region_admin', 'moderator', 'analyst'].includes(me.user.role)) {
        location.href = 'login.html';
        return;
      }
    } catch (_e) {
      location.href = 'login.html';
      return;
    }
    load();
  })();
})();
