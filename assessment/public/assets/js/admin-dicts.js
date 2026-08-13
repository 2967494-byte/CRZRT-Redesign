(function () {
  const els = {
    dictHead: document.getElementById('dictHead'),
    dictBody: document.getElementById('dictBody'),
    dictStatus: document.getElementById('dictStatus'),
    dictFormBox: document.getElementById('dictFormBox'),
    dictFormTitle: document.getElementById('dictFormTitle'),
    dictFormFields: document.getElementById('dictFormFields'),
    formDict: document.getElementById('formDict'),
    btnAddDictItem: document.getElementById('btnAddDictItem'),
    btnCancelDict: document.getElementById('btnCancelDict'),
    btnLogout: document.getElementById('btnLogout'),
  };

  let activeTab = 'regions';
  let currentItems = [];

  function showStatus(msg, type) {
    els.dictStatus.textContent = msg || '';
    els.dictStatus.className = msg ? ('status status--' + (type || 'info')) : 'status';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function loadDictData() {
    showStatus('Загрузка справочника…', 'info');
    els.dictFormBox.classList.add('hidden');
    try {
      const data = await AsmtApi.get(`api/admin-dicts.php?type=${activeTab}`);
      currentItems = data.items || [];
      showStatus('', '');
      renderTable();
    } catch (err) {
      showStatus(err.message, 'error');
    }
  }

  function renderTable() {
    if (activeTab === 'regions') {
      els.dictHead.innerHTML = `
        <tr>
          <th>ID</th>
          <th>Код</th>
          <th>Наименование региона</th>
          <th>Статус</th>
          <th>Действие</th>
        </tr>`;
      els.dictBody.innerHTML = currentItems.map(r => `
        <tr>
          <td>${r.id}</td>
          <td><code>${esc(r.code)}</code></td>
          <td><strong>${esc(r.name)}</strong></td>
          <td>${r.is_active ? '<span class="badge" style="background:var(--green-light); color:var(--green);">Активен</span>' : '<span class="badge" style="background:#fee2e2; color:#dc2626;">Отключен</span>'}</td>
          <td><button type="button" class="btn btn--ghost btn--sm" data-edit-id="${r.id}">Изменить</button></td>
        </tr>
      `).join('');
    } else if (activeTab === 'districts') {
      els.dictHead.innerHTML = `
        <tr>
          <th>ID</th>
          <th>Наименование района / МО</th>
          <th>Город респ. подчинения</th>
          <th>Сортировка</th>
          <th>Статус</th>
          <th>Действие</th>
        </tr>`;
      els.dictBody.innerHTML = currentItems.map(d => `
        <tr>
          <td>${d.id}</td>
          <td><strong>${esc(d.name)}</strong></td>
          <td>${d.is_separate_city ? 'Да' : 'Нет'}</td>
          <td>${d.sort_order}</td>
          <td>${d.is_active ? '<span class="badge" style="background:var(--green-light); color:var(--green);">Активен</span>' : '<span class="badge" style="background:#fee2e2; color:#dc2626;">Отключен</span>'}</td>
          <td><button type="button" class="btn btn--ghost btn--sm" data-edit-id="${d.id}">Изменить</button></td>
        </tr>
      `).join('');
    } else if (activeTab === 'banners') {
      els.dictHead.innerHTML = `
        <tr>
          <th>ID</th>
          <th>Регион</th>
          <th>Заголовок баннера</th>
          <th>Текст / Ссылка</th>
          <th>Статус</th>
          <th>Действие</th>
        </tr>`;
      els.dictBody.innerHTML = currentItems.map(b => `
        <tr>
          <td>${b.id}</td>
          <td><strong>${esc(b.region_name)}</strong></td>
          <td>${esc(b.title)}</td>
          <td>${esc(b.link_url || '—')}</td>
          <td>${b.is_active ? '<span class="badge" style="background:var(--green-light); color:var(--green);">Активен</span>' : '<span class="badge" style="background:#fee2e2; color:#dc2626;">Отключен</span>'}</td>
          <td><button type="button" class="btn btn--ghost btn--sm" data-edit-id="${b.id}">Изменить</button></td>
        </tr>
      `).join('');
    }

    els.dictBody.querySelectorAll('[data-edit-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = currentItems.find(i => Number(i.id) === Number(btn.dataset.editId));
        if (item) openForm(item);
      });
    });
  }

  function openForm(item) {
    els.dictFormBox.classList.remove('hidden');
    els.dictFormTitle.textContent = item ? 'Редактирование записи' : 'Новая запись в справочнике';

    if (activeTab === 'regions') {
      els.dictFormFields.innerHTML = `
        <input type="hidden" id="fieldId" value="${item ? item.id : 0}">
        <div style="display:grid; grid-template-columns:1fr 2fr; gap:14px; margin-bottom:14px;">
          <label class="field">Код региона (например: RT)
            <input type="text" id="fieldCode" value="${item ? esc(item.code) : ''}" required>
          </label>
          <label class="field">Наименование региона
            <input type="text" id="fieldName" value="${item ? esc(item.name) : ''}" required>
          </label>
        </div>
        <label class="checkbox">
          <input type="checkbox" id="fieldIsActive" ${!item || item.is_active ? 'checked' : ''}> Регион активен
        </label>
      `;
    } else if (activeTab === 'districts') {
      els.dictFormFields.innerHTML = `
        <input type="hidden" id="fieldId" value="${item ? item.id : 0}">
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:14px; margin-bottom:14px;">
          <label class="field">Наименование района
            <input type="text" id="fieldName" value="${item ? esc(item.name) : ''}" required>
          </label>
          <label class="field">Порядок сортировки
            <input type="number" id="fieldSort" value="${item ? item.sort_order : 0}">
          </label>
        </div>
        <div style="display:flex; gap:20px; margin-bottom:14px;">
          <label class="checkbox">
            <input type="checkbox" id="fieldIsSeparate" ${item && item.is_separate_city ? 'checked' : ''}> Город республиканского значения
          </label>
          <label class="checkbox">
            <input type="checkbox" id="fieldIsActive" ${!item || item.is_active ? 'checked' : ''}> Активен
          </label>
        </div>
      `;
    }

    els.dictFormBox.scrollIntoView({ behavior: 'smooth' });
  }

  els.formDict.addEventListener('submit', async (e) => {
    e.preventDefault();
    let payload = {};

    if (activeTab === 'regions') {
      payload = {
        type: 'region',
        id: Number(document.getElementById('fieldId').value),
        code: document.getElementById('fieldCode').value.trim(),
        name: document.getElementById('fieldName').value.trim(),
        isActive: document.getElementById('fieldIsActive').checked,
      };
    } else if (activeTab === 'districts') {
      payload = {
        type: 'district',
        id: Number(document.getElementById('fieldId').value),
        name: document.getElementById('fieldName').value.trim(),
        sortOrder: Number(document.getElementById('fieldSort').value),
        isSeparateCity: document.getElementById('fieldIsSeparate').checked,
        isActive: document.getElementById('fieldIsActive').checked,
      };
    }

    try {
      await AsmtApi.post('api/admin-dicts.php', payload);
      showStatus('Запись успешно сохранена', 'ok');
      els.dictFormBox.classList.add('hidden');
      loadDictData();
    } catch (err) {
      showStatus(err.message, 'error');
    }
  });

  document.querySelectorAll('.sub-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeTab = btn.dataset.tab;
      loadDictData();
    });
  });

  els.btnAddDictItem.addEventListener('click', () => openForm(null));
  els.btnCancelDict.addEventListener('click', () => els.dictFormBox.classList.add('hidden'));

  async function boot() {
    try {
      const me = await AsmtApi.get('api/auth.php?action=me');
      if (!me.authenticated || !['superadmin', 'region_admin'].includes(me.user.role)) {
        location.href = 'login.html';
        return;
      }
      loadDictData();
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
