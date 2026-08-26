(function () {
  const form = document.getElementById('registerForm');
  const status = document.getElementById('formStatus');
  const districtSelect = document.getElementById('districtId');
  const districtOtherWrap = document.getElementById('districtOtherWrap');
  const customerLevel = document.getElementById('customerLevel');
  const credsBox = document.getElementById('credsBox');
  const innInput = document.getElementById('innInput');
  const orgName = document.getElementById('organizationName');
  const orgHierarchy = document.getElementById('orgHierarchy');

  // Modal elements
  const modal = document.getElementById('consentModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCancelConsent = document.getElementById('btnCancelConsent');
  const btnAgreePd = document.getElementById('btnAgreePd');
  const btnAgreePrivacy = document.getElementById('btnAgreePrivacy');
  const btnFinalRegister = document.getElementById('btnFinalRegister');
  const cardPd = document.getElementById('consentCardPd');
  const cardPrivacy = document.getElementById('consentCardPrivacy');
  const tsPd = document.getElementById('tsPd');
  const tsPrivacy = document.getElementById('tsPrivacy');

  const phoneInput = document.getElementById('phoneInput') || form.querySelector('input[name="phone"]');

  let lookupTimer = null;
  let fromDirectory = false;
  let consentPdState = false;
  let consentPrivacyState = false;
  let consentPdTime = null;
  let consentPrivacyTime = null;

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = 'status status--' + (type || 'info');
  }

  /** Маска +7 (___) ___-__-__ ; в API уходит как есть, сервер нормализует цифры. */
  function formatPhoneMask(raw) {
    let digits = String(raw || '').replace(/\D+/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (digits.startsWith('7')) digits = digits.slice(1);
    digits = digits.slice(0, 10);

    let out = '+7 (';
    if (digits.length === 0) return out;
    out += digits.slice(0, 3);
    if (digits.length < 3) return out;
    out += ') ' + digits.slice(3, 6);
    if (digits.length < 6) return out;
    out += '-' + digits.slice(6, 8);
    if (digits.length < 8) return out;
    out += '-' + digits.slice(8, 10);
    return out;
  }

  function bindPhoneMask(input) {
    if (!input) return;
    input.value = formatPhoneMask(input.value || '7');

    input.addEventListener('focus', () => {
      if (!input.value || input.value === '+7 (') {
        input.value = '+7 (';
      }
    });

    input.addEventListener('input', () => {
      const prev = input.value;
      const next = formatPhoneMask(prev);
      input.value = next;
      // Курсор в конец — проще и предсказуемее при маске
      try {
        const pos = next.length;
        input.setSelectionRange(pos, pos);
      } catch (_e) { /* ignore */ }
    });

    input.addEventListener('keydown', (e) => {
      // Не даём стереть префикс +7 (
      if ((e.key === 'Backspace' || e.key === 'Delete') && input.selectionStart <= 4 && input.selectionEnd <= 4) {
        e.preventDefault();
      }
    });

    input.addEventListener('blur', () => {
      const digits = (input.value || '').replace(/\D+/g, '');
      if (digits.length <= 1) {
        input.value = '';
      } else if (digits.length !== 11) {
        input.setCustomValidity('Введите номер полностью: +7 (___) ___-__-__');
      } else {
        input.setCustomValidity('');
      }
    });
  }

  bindPhoneMask(phoneInput);

  function renderHierarchy(org) {
    if (!org || !org.hierarchy) {
      orgHierarchy.classList.add('hidden');
      orgHierarchy.innerHTML = '';
      return;
    }
    const h = org.hierarchy;
    const lines = [];
    if (h.level1) lines.push(`<div><span class="org-hierarchy__lvl">Ур. 1</span> ${h.level1.name}</div>`);
    if (h.level2) lines.push(`<div><span class="org-hierarchy__lvl">Ур. 2</span> ${h.level2.name}</div>`);
    lines.push(`<div><span class="org-hierarchy__lvl">Ур. 3</span> ${h.level3.name} · ИНН ${h.level3.inn}</div>`);
    orgHierarchy.innerHTML = '<strong>Найдено в ведомственном справочнике</strong>' + lines.join('');
    orgHierarchy.classList.remove('hidden');
  }

  async function lookupInn() {
    const inn = (innInput.value || '').replace(/\D+/g, '');
    if (inn.length !== 10 && inn.length !== 12) {
      fromDirectory = false;
      orgName.readOnly = false;
      renderHierarchy(null);
      return;
    }
    try {
      const data = await AsmtApi.get('api/org-lookup.php?inn=' + encodeURIComponent(inn));
      if (data.found && data.organization) {
        const src = data.source || 'directory';
        fromDirectory = src === 'directory';
        orgName.value = data.organization.name;
        orgName.readOnly = fromDirectory;
        if (data.organization.customerLevel) {
          customerLevel.value = data.organization.customerLevel;
          syncDistrictUi();
        }
        if (fromDirectory) {
          renderHierarchy(data.organization);
        } else {
          orgHierarchy.classList.remove('hidden');
          const extra = [];
          if (data.organization.inn) extra.push('ИНН ' + data.organization.inn);
          if (data.organization.ogrn) extra.push('ОГРН ' + data.organization.ogrn);
          if (data.organization.address) extra.push(data.organization.address);
          orgHierarchy.innerHTML =
            '<strong>Найдено в ЕГРЮЛ / ЕГРИП</strong>' +
            '<div>' + (data.organization.name || '') + '</div>' +
            (extra.length ? '<div style="margin-top:4px;color:var(--muted);font-size:0.85rem;">' + extra.join(' · ') + '</div>' : '') +
            '<div style="margin-top:6px;font-size:0.85rem;color:var(--muted);">Организации нет в ведомственном справочнике — заявка уйдёт на модерацию.</div>';
        }
      } else {
        fromDirectory = false;
        orgName.readOnly = false;
        renderHierarchy(null);
        orgHierarchy.classList.remove('hidden');
        orgHierarchy.innerHTML = '<strong>ИНН не найден</strong><div>Укажите наименование организации вручную. Заявка уйдёт на модерацию.</div>';
      }
    } catch (e) {
      /* ignore transient lookup errors */
    }
  }

  innInput.addEventListener('input', () => {
    clearTimeout(lookupTimer);
    lookupTimer = setTimeout(lookupInn, 350);
  });
  innInput.addEventListener('blur', lookupInn);

  async function loadDistricts() {
    const data = await AsmtApi.get('api/districts.php');
    districtSelect.innerHTML = '<option value="">Выберите район</option>' +
      data.districts.map((d) => `<option value="${d.id}">${d.name}</option>`).join('');
  }

  function syncDistrictUi() {
    const isFederal = customerLevel.value === 'federal';
    districtOtherWrap.classList.toggle('hidden', !isFederal);
    districtSelect.required = !isFederal;
  }

  customerLevel.addEventListener('change', syncDistrictUi);
  const regRegion = document.getElementById('regRegion');

  async function loadRegions() {
    try {
      const data = await AsmtApi.get('api/admin-dicts.php?type=regions_public');
      const items = data.items || [];
      if (regRegion) {
        regRegion.innerHTML = items.map(r => `
          <option value="${r.id}" ${r.code === '16' || r.name.includes('Татарстан') ? 'selected' : ''}>
            ${r.code} — ${r.name}
          </option>
        `).join('');
      }
    } catch (e) {
      if (regRegion) regRegion.innerHTML = '<option value="">Ошибка загрузки регионов</option>';
    }
  }

  syncDistrictUi();
  loadDistricts().catch((e) => showStatus(e.message, 'error'));
  loadRegions();

  function openModal() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function formatTimeNow() {
    const n = new Date();
    const d = String(n.getDate()).padStart(2, '0');
    const m = String(n.getMonth() + 1).padStart(2, '0');
    const y = n.getFullYear();
    const h = String(n.getHours()).padStart(2, '0');
    const mi = String(n.getMinutes()).padStart(2, '0');
    return `${d}.${m}.${y} в ${h}:${mi}`;
  }

  function updateModalState() {
    if (consentPdState) {
      cardPd.classList.add('is-agreed');
      btnAgreePd.querySelector('.consent-btn-label').textContent = 'Согласие подтверждено';
      tsPd.textContent = `Зафиксировано: ${consentPdTime}`;
      tsPd.classList.remove('hidden');
    } else {
      cardPd.classList.remove('is-agreed');
      btnAgreePd.querySelector('.consent-btn-label').textContent = 'Нажимая кнопку, я подтверждаю согласие';
      tsPd.classList.add('hidden');
    }

    if (consentPrivacyState) {
      cardPrivacy.classList.add('is-agreed');
      btnAgreePrivacy.querySelector('.consent-btn-label').textContent = 'Политика принята';
      tsPrivacy.textContent = `Зафиксировано: ${consentPrivacyTime}`;
      tsPrivacy.classList.remove('hidden');
    } else {
      cardPrivacy.classList.remove('is-agreed');
      btnAgreePrivacy.querySelector('.consent-btn-label').textContent = 'Ознакомлен и принимаю политику';
      tsPrivacy.classList.add('hidden');
    }

    btnFinalRegister.disabled = !(consentPdState && consentPrivacyState);
  }

  btnAgreePd.addEventListener('click', () => {
    consentPdState = !consentPdState;
    if (consentPdState) consentPdTime = formatTimeNow();
    updateModalState();
  });

  btnAgreePrivacy.addEventListener('click', () => {
    consentPrivacyState = !consentPrivacyState;
    if (consentPrivacyState) consentPrivacyTime = formatTimeNow();
    updateModalState();
  });

  btnCloseModal.addEventListener('click', closeModal);
  btnCancelConsent.addEventListener('click', closeModal);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    openModal();
  });

  btnFinalRegister.addEventListener('click', async () => {
    closeModal();
    showStatus('Регистрация участника…', 'info');
    credsBox.classList.add('hidden');

    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    body.consentPd = consentPdState;
    body.consentPrivacy = consentPrivacyState;
    body.consentPdAt = consentPdTime;
    body.consentPrivacyAt = consentPrivacyTime;
    body.fromDirectory = fromDirectory;

    try {
      const data = await AsmtApi.post('api/register.php', body);
      showStatus('Регистрация успешно завершена! Сохраните логин и пароль.', 'ok');
      credsBox.classList.remove('hidden');
      credsBox.innerHTML = `
        <div style="font-size:1.05rem; font-weight:700; margin-bottom:8px;">Ваши реквизиты доступа:</div>
        <div><strong>Логин (Email):</strong> ${data.login}</div>
        <div><strong>Пароль:</strong> ${data.password}</div>
        <div style="font-size:0.85rem; color:#047857; margin-top:8px;">Пароль также продублирован на ваш электронный адрес. Переход в личный кабинет...</div>
      `;
      setTimeout(() => { window.location.href = data.redirect || 'cabinet.html'; }, 3000);
    } catch (err) {
      showStatus(err.message, 'error');
    }
  });
})();
