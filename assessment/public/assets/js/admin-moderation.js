(function () {
  const els = {
    modBody: document.getElementById('modBody'),
    modStatus: document.getElementById('modStatus'),
    modQ: document.getElementById('modQ'),
    modStatusMsg: document.getElementById('modStatusMsg'),
    btnModReload: document.getElementById('btnModReload'),
    btnLogout: document.getElementById('btnLogout'),
  };

  let canModerate = false;

  function showStatus(msg, type) {
    els.modStatusMsg.textContent = msg || '';
    els.modStatusMsg.className = msg ? ('status status--' + (type || 'info')) : 'status';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

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
        showStatus('Необходимо указать комментарий модератора', 'error');
        return;
      }
    }
    try {
      await AsmtApi.post('api/admin-moderation.php', { id, action, comment });
      showStatus('Статус заявки обновлён', 'ok');
      loadModeration();
    } catch (err) {
      showStatus(err.message, 'error');
    }
  }

  async function loadModeration() {
    showStatus('Загрузка заявок модерации…', 'info');
    try {
      const p = new URLSearchParams();
      p.set('status', els.modStatus.value || 'pending');
      if (els.modQ.value.trim()) p.set('q', els.modQ.value.trim());
      const data = await AsmtApi.get('api/admin-moderation.php?' + p.toString());
      canModerate = Boolean(data.canModerate);
      renderModeration(data.items || []);
      showStatus(`Всего заявок: ${data.total}`, 'ok');
    } catch (err) {
      showStatus(err.message, 'error');
    }
  }

  els.btnModReload.addEventListener('click', loadModeration);
  els.modStatus.addEventListener('change', loadModeration);
  els.modQ.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadModeration(); });

  async function boot() {
    try {
      const me = await AsmtApi.get('api/auth.php?action=me');
      if (!me.authenticated || !['superadmin', 'region_admin', 'moderator', 'analyst'].includes(me.user.role)) {
        location.href = 'login.html';
        return;
      }
      loadModeration();
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
