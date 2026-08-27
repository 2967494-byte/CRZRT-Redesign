(function () {
  const els = {
    search: document.getElementById('searchQ'),
    type: document.getElementById('filterType'),
    status: document.getElementById('filterStatus'),
    perPage: document.getElementById('filterPerPage'),
    btnReload: document.getElementById('btnReload'),
    tbody: document.getElementById('mailTableBody'),
    statusMsg: document.getElementById('mailStatusMsg'),
    statSent: document.getElementById('statSent'),
    statPending: document.getElementById('statPending'),
    statFailed: document.getElementById('statFailed'),
    pagInfo: document.getElementById('paginationInfo'),
    pagControls: document.getElementById('paginationControls'),
    btnLogout: document.getElementById('btnLogout'),
  };

  let page = 1;
  let debounceTimer = null;

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showMsg(text, type) {
    if (!els.statusMsg) return;
    els.statusMsg.textContent = text || '';
    els.statusMsg.className = text ? ('status status--' + (type || 'info')) : 'status';
  }

  const TYPE_LABELS = {
    registration: ['Регистрация', '#eff6ff', '#1d4ed8', '#bfdbfe'],
    password_reset: ['Восстановление пароля', '#fef3c7', '#b45309', '#fde68a'],
    test: ['Тестовое', '#f1f5f9', '#475569', '#e2e8f0'],
    other: ['Прочее', '#f1f5f9', '#64748b', '#e2e8f0'],
  };

  const STATUS_LABELS = {
    sent: ['Доставлено', '#ecfdf5', '#047857', '#a7f3d0'],
    new: ['В очереди', '#fffbeb', '#b45309', '#fde68a'],
    processing: ['Повтор', '#fffbeb', '#b45309', '#fde68a'],
    failed: ['Ошибка', '#fff1f2', '#be123c', '#fecdd3'],
  };

  function badge(map, key) {
    const c = map[key] || [key || '—', '#f1f5f9', '#64748b', '#e2e8f0'];
    return `<span class="badge" style="background:${c[1]}; color:${c[2]}; border:1px solid ${c[3]}; font-size:0.72rem; font-weight:700; white-space:nowrap;">${esc(c[0])}</span>`;
  }

  function formatDt(value) {
    if (!value) return '—';
    const d = new Date(String(value).replace(' ', 'T'));
    if (isNaN(d.getTime())) return esc(value);
    return d.toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  function renderPagination(data) {
    const total = data.total || 0;
    const totalPages = data.totalPages || 1;
    const perPage = data.perPage || 25;
    const current = data.page || 1;

    if (total === 0) {
      els.pagInfo.textContent = 'Писем не найдено';
      els.pagControls.innerHTML = '';
      return;
    }

    const from = (current - 1) * perPage + 1;
    const to = Math.min(total, current * perPage);
    els.pagInfo.textContent = `Показано ${from}–${to} из ${total}`;

    const pages = [];
    const push = (p) => { if (!pages.includes(p) && p >= 1 && p <= totalPages) pages.push(p); };
    push(1);
    for (let p = current - 1; p <= current + 1; p++) push(p);
    push(totalPages);
    pages.sort((a, b) => a - b);

    let html = `<button type="button" class="page-btn" data-page="${current - 1}" ${current <= 1 ? 'disabled' : ''} title="Предыдущая">‹</button>`;
    let prev = 0;
    pages.forEach((p) => {
      if (prev && p - prev > 1) html += '<span class="page-dots">…</span>';
      html += `<button type="button" class="page-btn ${p === current ? 'is-active' : ''}" data-page="${p}" ${p === current ? 'disabled' : ''}>${p}</button>`;
      prev = p;
    });
    html += `<button type="button" class="page-btn" data-page="${current + 1}" ${current >= totalPages ? 'disabled' : ''} title="Следующая">›</button>`;
    els.pagControls.innerHTML = html;

    els.pagControls.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = Number(btn.getAttribute('data-page'));
        if (!target || target === current) return;
        page = target;
        load();
      });
    });
  }

  async function load() {
    const params = new URLSearchParams({
      page: String(page),
      perPage: els.perPage.value,
      type: els.type.value,
      status: els.status.value,
    });
    const q = (els.search.value || '').trim();
    if (q) params.set('q', q);

    try {
      const data = await AsmtApi.get('api/admin-mail.php?' + params.toString());
      if (!data.success) {
        showMsg(data.error || 'Не удалось загрузить журнал писем', 'error');
        return;
      }
      if (data.typeSupported === false) {
        showMsg('Тип письма не определяется: выполните php scripts/auto_migrate.php на сервере', 'warning');
      } else {
        showMsg('');
      }
      page = data.page || 1;

      els.statSent.textContent = data.stats.sent;
      els.statPending.textContent = data.stats.pending;
      els.statFailed.textContent = data.stats.failed;

      if (!data.items.length) {
        els.tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px; color:var(--muted);">Писем по заданным условиям нет</td></tr>';
      } else {
        els.tbody.innerHTML = data.items.map((m) => `
          <tr>
            <td class="col-id" style="color:var(--muted); font-size:0.78rem;">${m.id}</td>
            <td class="col-to">
              <div class="cell-stack">
                <span class="cell-main">${esc(m.to)}</span>
                ${m.attempts > 1 ? `<span class="cell-sub">Попыток отправки: ${m.attempts}</span>` : ''}
              </div>
            </td>
            <td class="col-type">${badge(TYPE_LABELS, m.type)}</td>
            <td class="col-subject">
              <div class="cell-stack">
                <span class="cell-main" style="font-weight:500;" title="${esc(m.subject)}">${esc(m.subject)}</span>
                ${m.lastError ? `<span class="cell-sub" style="color:#be123c;" title="${esc(m.lastError)}">${esc(m.lastError)}</span>` : ''}
              </div>
            </td>
            <td class="col-status">${badge(STATUS_LABELS, m.status)}</td>
            <td class="col-time">
              <div class="cell-stack">
                <span class="cell-main" style="font-weight:500;">${formatDt(m.sentAt || m.createdAt)}</span>
                ${m.sentAt ? '' : '<span class="cell-sub">ещё не отправлено</span>'}
              </div>
            </td>
          </tr>
        `).join('');
      }

      renderPagination(data);
    } catch (e) {
      if (e && (e.status === 401 || e.status === 403)) {
        location.href = 'login.html';
        return;
      }
      showMsg((e && e.message) ? ('Ошибка загрузки журнала писем: ' + e.message) : 'Ошибка загрузки журнала писем', 'error');
      els.tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px; color:var(--muted);">Данные не загружены</td></tr>';
    }
  }

  function reloadFromFirstPage() {
    page = 1;
    load();
  }

  els.search.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(reloadFromFirstPage, 350);
  });
  els.type.addEventListener('change', reloadFromFirstPage);
  els.status.addEventListener('change', reloadFromFirstPage);
  els.perPage.addEventListener('change', reloadFromFirstPage);
  els.btnReload.addEventListener('click', reloadFromFirstPage);

  if (els.btnLogout) {
    els.btnLogout.addEventListener('click', async () => {
      try { await AsmtApi.get('api/auth.php?action=logout'); } catch (e) {}
      location.href = 'login.html';
    });
  }

  load();
})();
