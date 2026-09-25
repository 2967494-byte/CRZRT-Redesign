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
    districtsFilterBar: document.getElementById('districtsFilterBar'),
    districtRegionFilter: document.getElementById('districtRegionFilter'),
    districtsCountBadge: document.getElementById('districtsCountBadge'),
  };

  let activeTab = 'regions';
  let currentItems = [];
  let cachedRegions = [];
  let selectedDistrictRegionId = null;

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

  async function loadRegionsList() {
    if (cachedRegions.length > 0) return cachedRegions;
    try {
      const data = await AsmtApi.get('api/admin-dicts.php?type=regions_public');
      cachedRegions = data.items || [];
      if (els.districtRegionFilter) {
        els.districtRegionFilter.innerHTML = cachedRegions.map(r => `
          <option value="${r.id}" data-code="${esc(r.code)}">
            ${esc(r.code)} — ${esc(r.name)}
          </option>
        `).join('');

        // Default to Tatarstan (16) if present
        const tat = cachedRegions.find(r => r.code === '16' || (r.name && r.name.includes('Татарстан')));
        if (tat) {
          els.districtRegionFilter.value = String(tat.id);
          selectedDistrictRegionId = tat.id;
        } else if (cachedRegions.length > 0) {
          els.districtRegionFilter.value = String(cachedRegions[0].id);
          selectedDistrictRegionId = cachedRegions[0].id;
        }
      }
    } catch (e) {
      /* ignore */
    }
    return cachedRegions;
  }

  async function loadDictData() {
    showStatus('Загрузка справочника…', 'info');
    els.dictFormBox.classList.add('hidden');

    if (activeTab === 'districts') {
      if (els.districtsFilterBar) els.districtsFilterBar.classList.remove('hidden');
      await loadRegionsList();
      if (els.districtRegionFilter && els.districtRegionFilter.value) {
        selectedDistrictRegionId = Number(els.districtRegionFilter.value);
      }
    } else {
      if (els.districtsFilterBar) els.districtsFilterBar.classList.add('hidden');
    }

    try {
      let url = `api/admin-dicts.php?type=${activeTab}`;
      if (activeTab === 'districts' && selectedDistrictRegionId) {
        url += `&region_id=${encodeURIComponent(selectedDistrictRegionId)}`;
      }
      const data = await AsmtApi.get(url);
      currentItems = data.items || [];
      showStatus('', '');

      if (activeTab === 'districts' && els.districtsCountBadge) {
        els.districtsCountBadge.textContent = `Записей в регионе: ${currentItems.length}`;
      }
      renderTable();
    } catch (err) {
      showStatus(err.message, 'error');
    }
  }

  if (els.districtRegionFilter) {
    els.districtRegionFilter.addEventListener('change', () => {
      selectedDistrictRegionId = Number(els.districtRegionFilter.value);
      loadDictData();
    });
  }

  function renderTable() {
    if (activeTab === 'regions') {
      els.dictHead.innerHTML = `
        <tr>
          <th>ID</th>
          <th>Код</th>
          <th>Наименование региона</th>
          <th>Районов/Городов</th>
          <th>Статус</th>
          <th>Действие</th>
        </tr>`;
      els.dictBody.innerHTML = currentItems.map(r => `
        <tr>
          <td>${r.id}</td>
          <td><code>${esc(r.code)}</code></td>
          <td><strong>${esc(r.name)}</strong></td>
          <td><span class="badge" style="background:#f1f5f9; color:var(--text); font-weight:600;">${r.districts_count != null ? r.districts_count : '—'}</span></td>
          <td>${r.is_active ? '<span class="badge" style="background:var(--green-light); color:var(--green);">Активен</span>' : '<span class="badge" style="background:#fee2e2; color:#dc2626;">Отключен</span>'}</td>
          <td><button type="button" class="btn btn--ghost btn--sm" data-edit-id="${r.id}">Изменить</button></td>
        </tr>
      `).join('');
    } else if (activeTab === 'districts') {
      els.dictHead.innerHTML = `
        <tr>
          <th>ID</th>
          <th>Наименование района / МО</th>
          <th>Субъект РФ</th>
          <th>Город респ./обл. подчинения</th>
          <th>Сортировка</th>
          <th>Статус</th>
          <th>Действие</th>
        </tr>`;
      els.dictBody.innerHTML = currentItems.map(d => `
        <tr>
          <td>${d.id}</td>
          <td><strong>${esc(d.name)}</strong></td>
          <td><span style="font-size:0.85rem; color:var(--muted);">${esc(d.region_code ? d.region_code + ' — ' + d.region_name : (d.region_id || '—'))}</span></td>
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
          <label class="field">Код региона (например: 16)
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
      const activeRegId = item && item.region_id ? item.region_id : selectedDistrictRegionId;
      const regionOptions = cachedRegions.map(r => `
        <option value="${r.id}" ${Number(r.id) === Number(activeRegId) ? 'selected' : ''}>
          ${esc(r.code)} — ${esc(r.name)}
        </option>
      `).join('');

      els.dictFormFields.innerHTML = `
        <input type="hidden" id="fieldId" value="${item ? item.id : 0}">
        <div style="margin-bottom:14px;">
          <label class="field">Субъект РФ
            <select id="fieldRegionId" required style="padding:8px 10px; border-radius:6px; border:1px solid var(--border); width:100%;">
              ${regionOptions}
            </select>
          </label>
        </div>
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:14px; margin-bottom:14px;">
          <label class="field">Наименование района / МО
            <input type="text" id="fieldName" value="${item ? esc(item.name) : ''}" required>
          </label>
          <label class="field">Порядок сортировки
            <input type="number" id="fieldSort" value="${item ? item.sort_order : 0}">
          </label>
        </div>
        <div style="display:flex; gap:20px; margin-bottom:14px;">
          <label class="checkbox">
            <input type="checkbox" id="fieldIsSeparate" ${item && item.is_separate_city ? 'checked' : ''}> Город республиканского / областного значения
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
      const regSelect = document.getElementById('fieldRegionId');
      payload = {
        type: 'district',
        id: Number(document.getElementById('fieldId').value),
        regionId: regSelect ? Number(regSelect.value) : selectedDistrictRegionId,
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
