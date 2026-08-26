(function () {
  const els = {
    search: document.getElementById('searchQ'),
    status: document.getElementById('filterStatus'),
    orgStatus: document.getElementById('filterOrgStatus'),
    role: document.getElementById('filterRole'),
    btnApply: document.getElementById('btnApply'),
    tbody: document.getElementById('usersTableBody'),
    countLabel: document.getElementById('userCountLabel'),
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

  function orgBadge(status) {
    if (!status) return '<span class="badge" style="background:#f1f5f9; color:#64748b;">Не привязан</span>';
    const map = {
      approved: ['Подтвержден', '#eefbf3', '#0c6b34'],
      pending: ['Ожидает модерации', '#fff7e6', '#b45309'],
      rejected: ['Отклонен', '#fff1f1', '#9b1c1c'],
      needs_info: ['Уточнение', '#fff7e6', '#b45309'],
    };
    const c = map[status] || [status, '#f1f5f9', '#64748b'];
    return `<span class="badge" style="background:${c[1]}; color:${c[2]}; font-weight:700;">${c[0]}</span>`;
  }

  function userStatusBadge(status) {
    if (status === 'blocked') {
      return '<span class="badge" style="background:#fee2e2; color:#dc2626; font-weight:800;">Заблокирован</span>';
    }
    return '<span class="badge" style="background:#dcfce7; color:#15803d; font-weight:700;">Активен</span>';
  }

  function formatDt(dt) {
    if (!dt) return '—';
    return String(dt).replace('T', ' ').slice(0, 16);
  }

  async function loadUsers() {
    showMsg('Загрузка списка пользователей…', 'info');
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
      showMsg('');
      if (!res.success) {
        showMsg(res.error || 'Ошибка загрузки данных', 'error');
        return;
      }

      if (els.countLabel) {
        els.countLabel.textContent = `Найдено: ${res.total}`;
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
          <td colspan="7" style="text-align:center; padding:40px 20px; color:var(--muted);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.8" style="margin-bottom:8px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <strong>Пользователи не найдены</strong>
            <div style="font-size:0.85rem; margin-top:4px;">Попробуйте изменить параметры поиска или фильтры</div>
          </td>
        </tr>
      `;
      return;
    }

    els.tbody.innerHTML = items.map((u) => {
      const fullName = [u.lastName, u.firstName, u.middleName].filter(Boolean).join(' ') || '—';
      const org = u.organization;
      const orgName = org ? (org.name || 'Организация') : '—';
      const orgInn = org && org.inn ? `(ИНН: ${esc(org.inn)})` : '';
      const orgStatus = org ? org.status : null;
      const isBlocked = u.status === 'blocked';

      return `
        <tr>
          <td><strong style="color:var(--muted); font-size:0.8rem;">#${u.id}</strong></td>
          <td>
            <div class="user-name-cell">
              <div class="user-fullname">${esc(fullName)}</div>
              <div class="user-subinfo">${esc(u.position || 'Специалист')} · Роль: <strong>${esc(u.role)}</strong></div>
              <div class="user-subinfo" style="font-size:0.72rem; margin-top:2px;">Регистрация: ${formatDt(u.createdAt)}</div>
            </div>
          </td>
          <td>
            <div style="display:flex; flex-direction:column; gap:2px;">
              <div><strong>${esc(u.email)}</strong></div>
              <div style="color:var(--muted); font-size:0.8rem;">${esc(u.phone || '—')}</div>
              <div style="color:var(--muted); font-size:0.75rem; margin-top:2px;">${esc(u.regionName || '—')} ${u.districtName ? '· ' + esc(u.districtName) : ''}</div>
            </div>
          </td>
          <td>
            <div style="display:flex; flex-direction:column; gap:4px;">
              <div style="font-weight:600; color:var(--text); line-height:1.3;">${esc(orgName)} ${orgInn}</div>
              <div>${orgBadge(orgStatus)}</div>
            </div>
          </td>
          <td>
            ${userStatusBadge(u.status)}
            ${u.lastLoginAt ? `<div style="font-size:0.72rem; color:var(--muted); margin-top:4px;">Вход: ${formatDt(u.lastLoginAt)}</div>` : ''}
          </td>
          <td style="text-align:center;">
            <div style="font-weight:700; color:${u.passedCount > 0 ? 'var(--green)' : 'var(--text)'}; font-size:0.92rem;">
              ${u.passedCount > 0 ? 'Сдал' : (u.attemptsCount > 0 ? 'В процессе' : 'Не сдавал')}
            </div>
            <div style="font-size:0.75rem; color:var(--muted);">Попыток: ${u.attemptsCount}</div>
          </td>
          <td style="text-align:right;">
            <div class="user-actions">
              ${!isBlocked ? `
                <button type="button" class="btn-action-impersonate" data-impersonate="${u.id}" data-name="${esc(fullName)}" title="Войти в личный кабинет под этим пользователем">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                  <span>Войти</span>
                </button>
              ` : ''}

              ${canManage ? `
                ${isBlocked ? `
                  <button type="button" class="btn-action-unblock" data-toggle-block="${u.id}" data-blocked="true" title="Разблокировать пользователя">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Разблок.</span>
                  </button>
                ` : `
                  <button type="button" class="btn-action-block" data-toggle-block="${u.id}" data-blocked="false" title="Заблокировать пользователя">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
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
            alert( (res.error || 'Ошибка входа под пользователем'));
            btn.disabled = false;
            btn.innerHTML = 'Войти';
          }
        } catch (err) {
          alert( (err.message || 'Ошибка соединения с сервером'));
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
            alert( (res.error || 'Не удалось изменить статус пользователя'));
            btn.disabled = false;
          }
        } catch (err) {
          alert( (err.message || 'Ошибка соединения с сервером'));
          btn.disabled = false;
        }
      });
    });
  }

  // Event Listeners
  if (els.btnApply) {
    els.btnApply.addEventListener('click', loadUsers);
  }

  if (els.search) {
    els.search.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(loadUsers, 400);
    });
    els.search.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(debounceTimer);
        loadUsers();
      }
    });
  }

  if (els.status) els.status.addEventListener('change', loadUsers);
  if (els.orgStatus) els.orgStatus.addEventListener('change', loadUsers);
  if (els.role) els.role.addEventListener('change', loadUsers);

  if (els.btnLogout) {
    els.btnLogout.addEventListener('click', async () => {
      await AsmtApi.get('api/auth.php?action=logout');
      location.href = 'login.html';
    });
  }

  loadUsers();
})();
