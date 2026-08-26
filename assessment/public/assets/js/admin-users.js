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
    
    // Modal elements
    modal: document.getElementById('userDetailModal'),
    modalTitle: document.getElementById('modalUserTitle'),
    modalBody: document.getElementById('modalUserBody'),
    modalLeftAction: document.getElementById('modalUserLeftAction'),
    btnCloseModal: document.getElementById('btnCloseUserModal'),
    btnCloseModal2: document.getElementById('btnCloseUserModal2'),
  };

  let debounceTimer = null;
  let cachedUsers = [];

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
      pending: ['Ожидает проверки', '#fffbeb', '#b45309', '#fde68a'],
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

      cachedUsers = res.items || [];
      renderTable(cachedUsers, res.canManage);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        location.href = 'login.html';
        return;
      }
      showMsg(err.message || 'Ошибка соединения с сервером', 'error');
    }
  }

  function openUserModal(user, canManage) {
    if (!els.modal || !els.modalBody) return;

    const fullName = [user.lastName, user.firstName, user.middleName].filter(Boolean).join(' ') || 'Пользователь';
    const org = user.organization;
    const isBlocked = user.status === 'blocked';

    if (els.modalTitle) {
      els.modalTitle.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span>${esc(fullName)}</span>
          <span style="font-size:0.8rem; font-weight:600; color:var(--muted);">#${user.id}</span>
          ${userStatusBadge(user.status)}
        </div>
      `;
    }

    const hierarchy = org && (org.level1 || org.level2)
      ? [org.level1, org.level2].filter(Boolean).join(' → ')
      : null;

    els.modalBody.innerHTML = `
      <div class="user-modal-grid">
        
        <!-- SECTION 1: Основные данные -->
        <div class="user-modal-section">
          <div class="user-modal-section__title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Учётная запись</span>
          </div>
          <div class="user-modal-item">
            <span class="user-modal-item__label">Email (логин):</span>
            <span class="user-modal-item__value">${esc(user.email)}</span>
          </div>
          <div class="user-modal-item">
            <span class="user-modal-item__label">Телефон:</span>
            <span class="user-modal-item__value">${esc(user.phone || 'Не указан')}</span>
          </div>
          <div class="user-modal-item">
            <span class="user-modal-item__label">Роль в системе:</span>
            <span class="user-modal-item__value" style="color:#2563eb;">${esc(user.role)}</span>
          </div>
          <div class="user-modal-item">
            <span class="user-modal-item__label">Дата регистрации:</span>
            <span class="user-modal-item__value">${formatDt(user.createdAt)}</span>
          </div>
          <div class="user-modal-item">
            <span class="user-modal-item__label">Последний вход:</span>
            <span class="user-modal-item__value">${formatDt(user.lastLoginAt)}</span>
          </div>
        </div>

        <!-- SECTION 2: Профиль и квалификация -->
        <div class="user-modal-section">
          <div class="user-modal-section__title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <span>Профиль и квалификация</span>
          </div>
          <div class="user-modal-item">
            <span class="user-modal-item__label">Должность:</span>
            <span class="user-modal-item__value">${esc(user.position || '—')}</span>
          </div>
          <div class="user-modal-item">
            <span class="user-modal-item__label">Опыт / Стаж работы:</span>
            <span class="user-modal-item__value">${esc(user.experienceLevel || '—')}</span>
          </div>
          <div class="user-modal-item">
            <span class="user-modal-item__label">Образование:</span>
            <span class="user-modal-item__value">${esc(user.education || '—')}</span>
          </div>
          <div class="user-modal-item">
            <span class="user-modal-item__label">Специальность:</span>
            <span class="user-modal-item__value">${esc(user.specialty || '—')}</span>
          </div>
          <div class="user-modal-item">
            <span class="user-modal-item__label">Уровень заказчика:</span>
            <span class="user-modal-item__value">${esc(user.customerLevel || '—')}</span>
          </div>
        </div>

        <!-- SECTION 3: Организация и локация -->
        <div class="user-modal-section user-modal-section--full">
          <div class="user-modal-section__title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 7v14M21 7v14M6 3h12a2 2 0 0 1 2 2v2H4V5a2 2 0 0 1 2-2z"></path></svg>
            <span>Организация и регион</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div class="user-modal-item">
                <span class="user-modal-item__label">Организация:</span>
                <span class="user-modal-item__value">${esc(org?.name || 'Без привязки (частное лицо)')}</span>
              </div>
              <div class="user-modal-item">
                <span class="user-modal-item__label">ИНН организации:</span>
                <span class="user-modal-item__value">${esc(org?.inn || '—')}</span>
              </div>
              ${hierarchy ? `
                <div class="user-modal-item">
                  <span class="user-modal-item__label">Ведомственная иерархия:</span>
                  <span class="user-modal-item__value" style="color:var(--muted); font-size:0.8rem;">${esc(hierarchy)}</span>
                </div>
              ` : ''}
            </div>
            <div>
              <div class="user-modal-item">
                <span class="user-modal-item__label">Статус модерации:</span>
                <div style="margin-top:2px;">${orgBadge(org?.status)}</div>
              </div>
              <div class="user-modal-item">
                <span class="user-modal-item__label">Регион:</span>
                <span class="user-modal-item__value">${esc(user.regionName || '—')}</span>
              </div>
              <div class="user-modal-item">
                <span class="user-modal-item__label">Район / Муниципалитет:</span>
                <span class="user-modal-item__value">${esc(user.districtName || user.districtOther || '—')}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 4: Тестирование и согласия -->
        <div class="user-modal-section user-modal-section--full">
          <div class="user-modal-section__title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            <span>Тестирование и юридические согласия</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <div class="user-modal-item">
                <span class="user-modal-item__label">Всего попыток тестирования:</span>
                <span class="user-modal-item__value">${user.attemptsCount}</span>
              </div>
              <div class="user-modal-item">
                <span class="user-modal-item__label">Успешно сданных тестов (≥70%):</span>
                <span class="user-modal-item__value" style="color:var(--green);">${user.passedCount}</span>
              </div>
            </div>
            <div>
              <div class="user-modal-item">
                <span class="user-modal-item__label">Согласие на обработку ПД:</span>
                <span class="user-modal-item__value">${user.consentPdAt ? `Предоставлено (${formatDt(user.consentPdAt)})` : 'Не зафиксировано'}</span>
              </div>
              <div class="user-modal-item">
                <span class="user-modal-item__label">Согласие с Политикой:</span>
                <span class="user-modal-item__value">${user.consentPrivacyAt ? `Предоставлено (${formatDt(user.consentPrivacyAt)})` : 'Не зафиксировано'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    if (els.modalLeftAction) {
      if (!isBlocked) {
        els.modalLeftAction.innerHTML = `
          <button type="button" class="btn btn--primary" id="btnModalImpersonate" style="display:inline-flex; align-items:center; gap:6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            <span>Войти под пользователем</span>
          </button>
        `;
        document.getElementById('btnModalImpersonate').addEventListener('click', () => {
          doImpersonate(user.id, fullName);
        });
      } else {
        els.modalLeftAction.innerHTML = `<span style="color:var(--danger); font-size:0.85rem; font-weight:700;">Пользователь заблокирован</span>`;
      }
    }

    els.modal.classList.remove('hidden');
  }

  function closeModal() {
    if (els.modal) els.modal.classList.add('hidden');
  }

  async function doImpersonate(userId, userName) {
    if (!confirm(`Вы действительно хотите войти в личный кабинет от имени:
${userName}?`)) {
      return;
    }

    try {
      const res = await AsmtApi.post('api/admin-users.php', {
        action: 'impersonate',
        userId,
      });

      if (res.success && res.redirect) {
        location.href = res.redirect;
      } else {
        alert(res.error || 'Ошибка входа под пользователем');
      }
    } catch (err) {
      alert(err.message || 'Ошибка соединения с сервером');
    }
  }

  async function doToggleBlock(userId, isCurrentlyBlocked) {
    const actionLabel = isCurrentlyBlocked ? 'разблокировать' : 'заблокировать';
    if (!confirm(`Вы действительно хотите ${actionLabel} пользователя #${userId}?`)) {
      return;
    }

    try {
      const res = await AsmtApi.post('api/admin-users.php', {
        action: 'toggle-block',
        userId,
      });

      if (res.success) {
        loadUsers();
        closeModal();
      } else {
        alert(res.error || 'Не удалось изменить статус пользователя');
      }
    } catch (err) {
      alert(err.message || 'Ошибка соединения с сервером');
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
              <!-- Button 1: Info (i) -->
              <button type="button" class="btn-icon-action btn-icon-info" data-view-info="${u.id}" title="Подробная информация о пользователе">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </button>

              <!-- Button 2: Impersonate (Login) -->
              ${!isBlocked ? `
                <button type="button" class="btn-icon-action btn-icon-login" data-impersonate="${u.id}" data-name="${esc(fullName)}" title="Войти в личный кабинет от имени этого пользователя">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                </button>
              ` : ''}

              <!-- Button 3: Block / Unblock -->
              ${canManage ? `
                ${isBlocked ? `
                  <button type="button" class="btn-icon-action btn-icon-success" data-toggle-block="${u.id}" data-blocked="true" title="Разблокировать пользователя">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </button>
                ` : `
                  <button type="button" class="btn-icon-action btn-icon-danger" data-toggle-block="${u.id}" data-blocked="false" title="Заблокировать пользователя">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                  </button>
                `}
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach click handler for Info Modal
    els.tbody.querySelectorAll('[data-view-info]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const userId = Number(btn.getAttribute('data-view-info'));
        const user = cachedUsers.find((x) => x.id === userId);
        if (user) {
          openUserModal(user, canManage);
        }
      });
    });

    // Attach click handler for Impersonate
    els.tbody.querySelectorAll('[data-impersonate]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const userId = Number(btn.getAttribute('data-impersonate'));
        const userName = btn.getAttribute('data-name') || 'пользователя';
        doImpersonate(userId, userName);
      });
    });

    // Attach click handler for Block / Unblock
    els.tbody.querySelectorAll('[data-toggle-block]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const userId = Number(btn.getAttribute('data-toggle-block'));
        const isCurrentlyBlocked = btn.getAttribute('data-blocked') === 'true';
        doToggleBlock(userId, isCurrentlyBlocked);
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

  if (els.btnCloseModal) els.btnCloseModal.addEventListener('click', closeModal);
  if (els.btnCloseModal2) els.btnCloseModal2.addEventListener('click', closeModal);
  if (els.modal) {
    els.modal.addEventListener('click', (e) => {
      if (e.target === els.modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  if (els.btnLogout) {
    els.btnLogout.addEventListener('click', async () => {
      await AsmtApi.get('api/auth.php?action=logout');
      location.href = 'login.html';
    });
  }

  loadUsers();
})();
