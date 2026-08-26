(function () {
  const els = {
    modBody: document.getElementById('modBody'),
    modStatus: document.getElementById('modStatus'),
    modQ: document.getElementById('modQ'),
    modStatusMsg: document.getElementById('modStatusMsg'),
    btnModReload: document.getElementById('btnModReload'),
    btnLogout: document.getElementById('btnLogout'),
    detailModal: document.getElementById('modDetailModal'),
    detailBody: document.getElementById('modDetailBody'),
    detailFooter: document.getElementById('modDetailFooter'),
    detailTitle: document.getElementById('modDetailTitle'),
    btnCloseModDetail: document.getElementById('btnCloseModDetail'),
    btnCloseModDetail2: document.getElementById('btnCloseModDetail2'),
  };

  let canModerate = false;
  let itemsById = {};

  const ICONS = {
    approve: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    needs_info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    reject: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  };

  const STATUS_LABEL = {
    pending: 'На рассмотрении',
    needs_info: 'Требуются данные',
    approved: 'Подтверждена',
    rejected: 'Отклонена',
  };

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

  function formatPhone(raw) {
    const d = String(raw || '').replace(/\D+/g, '');
    if (d.length === 11 && d[0] === '7') {
      return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
    }
    return raw || '—';
  }

  function formatDt(v) {
    if (!v) return '—';
    return String(v).replace('T', ' ').slice(0, 19);
  }

  function fioOf(u) {
    return [u.lastName, u.firstName, u.middleName].filter(Boolean).join(' ');
  }

  function statusBadge(status) {
    const bg = status === 'pending' ? 'var(--amber-light)'
      : status === 'approved' ? '#eefbf3'
      : status === 'rejected' ? '#fff1f1'
      : '#eef3f8';
    const color = status === 'pending' ? 'var(--amber)'
      : status === 'approved' ? '#0c6b34'
      : status === 'rejected' ? '#9b1c1c'
      : 'inherit';
    return `<span class="badge" style="background:${bg}; color:${color};">${esc(STATUS_LABEL[status] || status)}</span>`;
  }

  function actionButtons(id) {
    if (!canModerate) return '<span class="cell-muted">просмотр</span>';
    return `<div class="mod-actions">
      <button type="button" class="btn-icon btn-icon--ok" data-act="approve" data-id="${id}" title="Утвердить" aria-label="Утвердить">${ICONS.approve}</button>
      <button type="button" class="btn-icon btn-icon--warn" data-act="needs_info" data-id="${id}" title="Уточнить" aria-label="Уточнить">${ICONS.needs_info}</button>
      <button type="button" class="btn-icon btn-icon--danger" data-act="reject" data-id="${id}" title="Отклонить" aria-label="Отклонить">${ICONS.reject}</button>
    </div>`;
  }

  function detailField(label, value, full) {
    const v = (value == null || String(value).trim() === '') ? '—' : String(value);
    return `<div class="mod-detail-item${full ? ' mod-detail-item--full' : ''}">
      <span class="mod-detail-item__label">${esc(label)}</span>
      <div class="mod-detail-item__value">${esc(v)}</div>
    </div>`;
  }

  function openDetail(it) {
    const u = it.user || {};
    const o = it.organization || {};
    const hier = [o.level1, o.level2, o.name].filter(Boolean).join(' → ') || '—';
    const district = u.districtOther || u.district || '—';

    els.detailTitle.textContent = `Заявка #${it.id}`;
    els.detailBody.innerHTML = `
      <h3 class="mod-detail-section">Участник</h3>
      <div class="mod-detail-grid">
        ${detailField('ФИО', fioOf(u), true)}
        ${detailField('Email', u.email)}
        ${detailField('Телефон', formatPhone(u.phone))}
        ${detailField('Регион', u.region)}
        ${detailField('Муниципальный район', district)}
        ${detailField('Должность', u.position)}
        ${detailField('Уровень заказчика', u.customerLevel)}
        ${detailField('Стаж / опыт', u.experienceLevel)}
        ${detailField('Образование', u.education)}
        ${detailField('Специальность', u.specialty, true)}
        ${detailField('Согласие ПДн', formatDt(u.consentPdAt))}
        ${detailField('Регистрация', formatDt(u.createdAt))}
      </div>
      <h3 class="mod-detail-section" style="margin-top:18px;">Организация</h3>
      <div class="mod-detail-grid">
        ${detailField('Наименование', o.name, true)}
        ${detailField('ИНН', o.inn)}
        ${detailField('Уровень заказчика (орг.)', o.customerLevel)}
        ${detailField('Статус организации', o.status)}
        ${detailField('Иерархия ведомства', hier, true)}
      </div>
      <h3 class="mod-detail-section" style="margin-top:18px;">Заявка</h3>
      <div class="mod-detail-grid">
        ${detailField('Статус', STATUS_LABEL[it.status] || it.status)}
        ${detailField('Подана', formatDt(it.requestedAt))}
        ${detailField('Модерация', formatDt(it.moderatedAt))}
        ${detailField('Комментарий модератора', it.comment || '—', true)}
      </div>
    `;

    const actionsHtml = canModerate
      ? `<div class="mod-actions" style="margin-right:auto;">
           <button type="button" class="btn-icon btn-icon--ok" data-act="approve" data-id="${it.id}" title="Утвердить" aria-label="Утвердить">${ICONS.approve}</button>
           <button type="button" class="btn-icon btn-icon--warn" data-act="needs_info" data-id="${it.id}" title="Уточнить" aria-label="Уточнить">${ICONS.needs_info}</button>
           <button type="button" class="btn-icon btn-icon--danger" data-act="reject" data-id="${it.id}" title="Отклонить" aria-label="Отклонить">${ICONS.reject}</button>
         </div>`
      : '';
    els.detailFooter.innerHTML = `
      ${actionsHtml}
      <button type="button" class="btn btn--ghost" id="btnCloseModDetail2">Закрыть</button>
    `;
    els.detailFooter.querySelectorAll('button[data-act]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        moderate(Number(btn.dataset.id), btn.dataset.act);
      });
    });
    document.getElementById('btnCloseModDetail2').addEventListener('click', closeDetail);

    els.detailModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeDetail() {
    els.detailModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function renderModeration(items) {
    itemsById = {};
    items.forEach((it) => { itemsById[it.id] = it; });

    if (!items.length) {
      els.modBody.innerHTML = '<tr><td colspan="6">Очередь модерации пуста</td></tr>';
      return;
    }

    els.modBody.innerHTML = items.map((it) => {
      const fio = fioOf(it.user);
      return `<tr class="mod-row" data-id="${it.id}" tabindex="0" title="Открыть карточку заявки">
        <td class="col-id">${it.id}</td>
        <td class="col-user">
          <div class="cell-stack">
            <strong title="${esc(fio)}">${esc(fio)}</strong>
            <span class="cell-muted" title="${esc(it.user.email)}">${esc(it.user.email)}</span>
          </div>
        </td>
        <td class="col-org">
          <div class="cell-stack">
            <strong title="${esc(it.organization.name || '')}">${esc(it.organization.name || '—')}</strong>
            <span class="cell-muted">${it.organization.inn ? 'ИНН ' + esc(it.organization.inn) : '—'}</span>
          </div>
        </td>
        <td class="col-status">${statusBadge(it.status)}</td>
        <td class="col-date cell-muted">${esc(formatDt(it.requestedAt).slice(0, 16))}</td>
        <td class="col-actions">${actionButtons(it.id)}</td>
      </tr>`;
    }).join('');

    els.modBody.querySelectorAll('tr.mod-row').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button[data-act]')) return;
        const it = itemsById[Number(row.dataset.id)];
        if (it) openDetail(it);
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const it = itemsById[Number(row.dataset.id)];
          if (it) openDetail(it);
        }
      });
    });

    els.modBody.querySelectorAll('button[data-act]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        moderate(Number(btn.dataset.id), btn.dataset.act);
      });
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
      closeDetail();
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
  els.btnCloseModDetail.addEventListener('click', closeDetail);
  els.btnCloseModDetail2.addEventListener('click', closeDetail);
  els.detailModal.addEventListener('click', (e) => {
    if (e.target === els.detailModal) closeDetail();
  });

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
