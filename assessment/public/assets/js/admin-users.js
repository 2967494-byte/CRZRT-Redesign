(function () {
  const els = {
    search: document.getElementById('searchQ'),
    status: document.getElementById('filterStatus'),
    orgStatus: document.getElementById('filterOrgStatus'),
    role: document.getElementById('filterRole'),
    btnReload: document.getElementById('btnReload'),
    tbody: document.getElementById('usersTableBody'),
    countLabel: document.getElementById('userCountLabel'),
    totalVal: document.getElementById('totalCountVal'),
    statusMsg: document.getElementById('usersStatusMsg'),
    btnLogout: document.getElementById('btnLogout'),
  };

  let debounceTimer = null;

  function showMsg(text, type) {
    if (!els.statusMsg) return;
    els.statusMsg.textContent = text || '';
    els.statusMsg.className = text ? ('status status--' + (type || 'info')) : 'status';
  }

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getInitials(lastName, firstName) {
    const l = (lastName || '').trim().charAt(0);
    const f = (firstName || '').trim().charAt(0);
    return (l + f).toUpperCase() || 'УС';
  }

  function orgBadge(status) {
    if (!status) return '<span class="badge" style="background:#f1f5f9; color:#64748b; font-size:0.72rem;">Без организации</span>';
    const map = {
      approved: ['Подтверждена', '#ecfdf5', '#047857', '#a7f3d0'],
      pending: ['Ожидает модерации', '#fffbeb', '#b45309', '#fde68a'],
      rejected: ['Отклонена', '#fff1f2', '#be123c', '#fecdd3'],
      needs_info: ['Уточнение', '#fffbeb', '#b45309', '#fde68a'],
    };
    const c = map[status] || [status, '#f1f5f9', '#64748b', '#e2e8f0'];
    return `<span class="badge" style="background:${c[1]}; color:${c[2]}; border:1px solid ${c[3]}; font-size:0.72rem; font-weight:700;">${c[0]}</span>`;
  }

  function userStatusBadge(status) {
    if (status === 'blocked') {
      return '<span class="badge" style="background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; font-weight:700; font-size:0.72rem;">Заблокирован</span>';
    }
    return '<span class="badge" style="background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; font-weight:700; font-size:0.72rem;">Активен</span>';
  }

  function formatDt(dt) {
    if (!dt) return '—';
    return String(dt).replace('T', ' ').slice(0, 16);
  }

  async function loadUsers() {
    const q = els.search ? els.search.value.trim() : '';
    const status = els.status ? els.status.value : 'all';
    const orgStatus = els.orgStatus ? els.orgStatus.value : 'all';
    const role = els.role ? els.role.value : 'all';

    const params = new URLSearchParams({
      q,
      status,
      orgStatus,
      role,
      limit: '100',
    });

    try {
      const res = await AsmtApi.get('api/admin-users.php?' + params.toString());
      if (!res.success) {
        showMsg(res.error || 'Ошибка загрузки данных', 'error');
        return;
      }

      if (els.totalVal) {
        els.totalVal.textContent = String(res.total || 0);
      }

      renderTable(res.items || [], res.canManage);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        location.href = 'login.html';
        return;
      }
      showMsg(err.message || 'Ошибка соединения с сервером', 'error');
    }
  }

  function renderTable(items, canManage) {
    if (!els.tbody) return;

    if (!items.length) {
      els.tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:45px 20px; color:var(--muted);">
            <div style="font-size:1.2rem; font-weight:700; color:var(--text); margin-bottom:4px;">Пользователи не найдены</div>
            <div style="font-size:0.84rem;">Попробуйте изменить параметры поиска или сбросить фильтры</div>
          </td>
        </tr>
      `;
      return;
    }

    els.tbody.innerHTML = items.map((u) => {
      const fullName = [u.lastName, u.firstName, u.middleName].filter(Boolean).join(' ') || '—';
      const initials = getInitials(u.lastName, u.firstName);
      const org = u.organization;
      const orgName = org ? (org.name || 'Организация') : '—';
      const orgInn = org && org.inn ? `ИНН: ${esc(org.inn)}` : '';
      const orgStatus = org ? org.status : null;
      const isBlocked = u.status === 'blocked';

      return `
        <tr>
          <td class="col-id"><strong style="color:var(--muted); font-size:0.8rem;">#${u.id}</strong></td>
          <td class="col-user">
            <div class="user-cell">
              <div class="user-avatar">${initials}</div>
              <div class="user-info">
                <div class="user-fullname" title="${esc(fullName)}">${esc(fullName)}</div>
                <div class="user-meta">${esc(u.position || 'Специалист')} · <span style="color:#2563eb; font-weight:600;">${esc(u.role)}</span></div>
              </div>
            </div>
          </td>
          <td class="col-contacts">
            <div class="contacts-cell">
              <div class="contacts-email" title="${esc(u.email)}">${esc(u.email)}</div>
              <div class="contacts-sub">${esc(u.phone || '—')}</div>
              <div class="contacts-sub" style="font-size:0.72rem;">${esc(u.regionName || '—')}</div>
            </div>
          </td>
          <td class="col-org">
            <div class="org-cell">
              <div class="org-name" title="${esc(orgName)}">${esc(orgName)}</div>
              <div style="display:flex; align-items:center; gap:8px;">
                ${orgBadge(orgStatus)}
                ${orgInn ? `<span style="font-size:0.72rem; color:var(--muted);">${orgInn}</span>` : ''}
              </div>
            </div>
          </td>
          <td class="col-status">
            ${userStatusBadge(u.status)}
          </td>
          <td class="col-actions">
            <div class="action-group">
              ${!isBlocked ? `
                <button type="button" class="btn-action-impersonate" data-impersonate="${u.id}" data-name="${esc(fullName)}" title="Войти в личный кабинет под этим пользователем">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                  <span>Войти</span>
                </button>
              ` : ''}

              ${canManage ? `
                ${isBlocked ? `
                  <button type="button" class="btn-action-unblock" data-toggle-block="${u.id}" data-blocked="true" title="Разблокировать пользователя">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Разблок.</span>
                  </button>
                ` : `
                  <button type="button" class="btn-action-block" data-toggle-block="${u.id}" data-blocked="false" title="Заблокировать пользователя">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                    <span>Блок</span>
                  </button>
                `}
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach impersonate handlers
    els.tbody.querySelectorAll('[data-impersonate]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const userId = Number(btn.getAttribute('data-impersonate'));
        const userName = btn.getAttribute('data-name') || 'пользователя';

        if (!confirm(`Вы действительно хотите войти в личный кабинет от имени:
${userName}?`)) {
          return;
        }

        btn.disabled = true;
        btn.innerHTML = 'Вход…';

        try {
          const res = await AsmtApi.post('api/admin-users.php', {
            action: 'impersonate',
            userId,
          });

          if (res.success && res.redirect) {
            location.href = res.redirect;
          } else {
            alert(res.error || 'Ошибка входа под пользователем');
            btn.disabled = false;
            btn.innerHTML = 'Войти';
          }
        } catch (err) {
          alert(err.message || 'Ошибка соединения с сервером');
          btn.disabled = false;
          btn.innerHTML = 'Войти';
        }
      });
    });

    // Attach block / unblock handlers
    els.tbody.querySelectorAll('[data-toggle-block]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const userId = Number(btn.getAttribute('data-toggle-block'));
        const isCurrentlyBlocked = btn.getAttribute('data-blocked') === 'true';
        const actionLabel = isCurrentlyBlocked ? 'разблокировать' : 'заблокировать';

        if (!confirm(`Вы действительно хотите ${actionLabel} пользователя #${userId}?`)) {
          return;
        }

        btn.disabled = true;

        try {
          const res = await AsmtApi.post('api/admin-users.php', {
            action: 'toggle-block',
            userId,
          });

          if (res.success) {
            loadUsers();
          } else {
            alert(res.error || 'Не удалось изменить статус пользователя');
            btn.disabled = false;
          }
        } catch (err) {
          alert(err.message || 'Ошибка соединения с сервером');
          btn.disabled = false;
        }
      });
    });
  }

  // Event Listeners
  if (els.search) {
    els.search.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(loadUsers, 300);
    });
  }

  if (els.status) els.status.addEventListener('change', loadUsers);
  if (els.orgStatus) els.orgStatus.addEventListener('change', loadUsers);
  if (els.role) els.role.addEventListener('change', loadUsers);

  if (els.btnReload) {
    els.btnReload.addEventListener('click', () => {
      if (els.search) els.search.value = '';
      if (els.status) els.status.value = 'all';
      if (els.orgStatus) els.orgStatus.value = 'all';
      if (els.role) els.role.value = 'all';
      loadUsers();
    });
  }

  if (els.btnLogout) {
    els.btnLogout.addEventListener('click', async () => {
      await AsmtApi.get('api/auth.php?action=logout');
      location.href = 'login.html';
    });
  }

  loadUsers();
})();
