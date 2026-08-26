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
    if (!els.statusMsg) return;
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
    return String(v).replace('T', ' ').slice(0, 16);
  }

  function formatSec(sec) {
    const s = Number(sec) || 0;
    if (s < 60) return `${s} сек`;
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m} мин ${rem} сек`;
  }

  function telemetryBadge(it) {
    if (!it.attemptId) return '<span style="color:var(--muted); font-size:0.75rem;">—</span>';
    
    const drops = it.disconnectCount || 0;
    const offSec = it.totalOfflineSeconds || 0;
    const hideSec = it.tabHiddenSeconds || 0;

    if (drops > 0) {
      return `
        <div style="display:flex; flex-direction:column; gap:2px;">
          <span class="badge" style="background:#fee2e2; color:#b91c1c; font-weight:700; font-size:0.72rem;">
             ${drops} обрыв(а) (${formatSec(offSec)})
          </span>
          ${hideSec > 5 ? `<span style="font-size:0.7rem; color:var(--muted);">Вне вкладки: ${formatSec(hideSec)}</span>` : ''}
        </div>
      `;
    }

    if (hideSec > 30) {
      return `
        <div style="display:flex; flex-direction:column; gap:2px;">
          <span class="badge" style="background:#fffbeb; color:#b45309; font-weight:700; font-size:0.72rem;">
             Без обрывов сети
          </span>
          <span style="font-size:0.7rem; color:#b45309; font-weight:600;">Вне вкладки: ${formatSec(hideSec)}</span>
        </div>
      `;
    }

    return `
      <span class="badge" style="background:#ecfdf5; color:#047857; font-weight:700; font-size:0.72rem;">
         Стабильно (0 сбоев)
      </span>
    `;
  }

  function render(items) {
    if (!items.length) {
      els.body.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--muted);">Запросов нет</td></tr>';
      return;
    }

    els.body.innerHTML = items.map((it) => {
      const u = it.user || {};
      const fio = [u.lastName, u.firstName, u.middleName].filter(Boolean).join(' ');
      const score = it.attemptId != null
        ? `<a href="complete.html?attemptId=${it.attemptId}" target="_blank" style="font-weight:700; color:#2563eb; text-decoration:underline;" title="Открыть билет и разбор ответов">#${it.attemptId} · ${it.attemptScore ?? 0}/${it.attemptTotal ?? '—'} (${Math.round(it.attemptPercent || 0)}%)</a>`
        : '—';
      const badgeBg = it.status === 'pending' ? 'var(--amber-light)'
        : it.status === 'approved' ? 'var(--green-light)'
        : '#eef3f8';
      const badgeColor = it.status === 'pending' ? 'var(--amber)'
        : it.status === 'approved' ? 'var(--green)'
        : 'inherit';
      
      let actionsHtml = '';
      if (canModerate && it.status === 'pending') {
        actionsHtml = `
          <div class="req-actions-group">
            <button type="button" class="btn-icon-action btn-icon-success" data-act="approve" data-id="${it.id}" title="Одобрить запрос на пересдачу" aria-label="Одобрить">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
            <button type="button" class="btn-icon-action btn-icon-danger" data-act="reject" data-id="${it.id}" title="Отклонить запрос" aria-label="Отклонить">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        `;
      } else if (it.adminComment) {
        actionsHtml = `<span style="font-size:0.8rem; color:var(--muted);">${esc(it.adminComment)}</span>`;
      } else {
        actionsHtml = '<span style="color:var(--muted);">—</span>';
      }

      return `<tr>
        <td><strong>#${it.id}</strong></td>
        <td><strong>${esc(fio)}</strong><br><small style="color:var(--muted);">${esc(u.email || '')}</small></td>
        <td>${esc(it.campaignName)}</td>
        <td>${score}</td>
        <td>${telemetryBadge(it)}</td>
        <td class="req-reason" style="max-width:220px; font-size:0.84rem;">${esc(it.reason)}</td>
        <td>${formatDt(it.createdAt)}</td>
        <td><span class="badge" style="background:${badgeBg}; color:${badgeColor}; font-weight:700;">${esc(statusLabel[it.status] || it.status)}</span></td>
        <td>${actionsHtml}</td>
      </tr>`;
    }).join('');

    els.body.querySelectorAll('[data-act]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.getAttribute('data-id'));
        const act = btn.getAttribute('data-act');
        const actName = act === 'approve' ? 'одобрить' : 'отклонить';

        const comment = prompt(`Укажите комментарий администратора (необязательно) перед тем как ${actName} запрос:`, '') ?? null;
        if (comment === null) return;

        btn.disabled = true;
        try {
          const res = await AsmtApi.post('api/admin-retake-requests.php', {
            id,
            action: act,
            comment: comment.trim(),
          });
          if (res.success) {
            showStatus(res.message || 'Запрос обработан', 'success');
            load();
            if (window.refreshAdminBadges) window.refreshAdminBadges();
          } else {
            showStatus(res.error || 'Ошибка', 'error');
            btn.disabled = false;
          }
        } catch (e) {
          showStatus(e.message || 'Ошибка сети', 'error');
          btn.disabled = false;
        }
      });
    });
  }

  async function load() {
    const st = els.status ? els.status.value : 'pending';
    try {
      const res = await AsmtApi.get('api/admin-retake-requests.php?status=' + encodeURIComponent(st));
      if (!res.success) {
        showStatus(res.error || 'Ошибка загрузки', 'error');
        return;
      }
      canModerate = !!res.canModerate;
      render(res.items || []);
    } catch (e) {
      if (e.status === 401 || e.status === 403) {
        location.href = 'login.html';
        return;
      }
      showStatus(e.message || 'Ошибка сети', 'error');
    }
  }

  if (els.status) els.status.addEventListener('change', load);
  if (els.btnReload) els.btnReload.addEventListener('click', load);

  if (els.btnLogout) {
    els.btnLogout.addEventListener('click', async () => {
      await AsmtApi.get('api/auth.php?action=logout');
      location.href = 'login.html';
    });
  }

  load();
})();
