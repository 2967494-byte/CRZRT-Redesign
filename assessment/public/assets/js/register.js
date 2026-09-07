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
  const consentCheckbox = document.getElementById('consentCheckbox');
  const btnFinalRegister = document.getElementById('btnFinalRegister');

  const phoneInput = document.getElementById('phoneInput') || form.querySelector('input[name="phone"]');

  let lookupTimer = null;
  let fromDirectory = false;
  let consentTime = null;

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
    const agreed = !!consentCheckbox.checked;
    if (agreed && !consentTime) consentTime = formatTimeNow();
    if (!agreed) consentTime = null;
    btnFinalRegister.disabled = !agreed;
  }

  consentCheckbox.addEventListener('change', updateModalState);

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
    if (!consentCheckbox.checked) return;
    closeModal();
    showStatus('Регистрация участника…', 'info');
    credsBox.classList.add('hidden');

    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    body.consentPd = true;
    body.consentPrivacy = true;
    body.consentPdAt = consentTime;
    body.consentPrivacyAt = consentTime;
    body.fromDirectory = fromDirectory;

    try {
      const data = await AsmtApi.post('api/register.php', body);
      showStatus('', 'ok');
      const statusEl = document.getElementById('formStatus');
      if (statusEl) statusEl.classList.add('hidden');

      // Отключаем поля формы, чтобы исключить повторную отправку
      Array.from(form.elements).forEach((el) => { el.disabled = true; });
      const submitActions = form.querySelector('.form-actions');
      if (submitActions) submitActions.style.display = 'none';

      credsBox.classList.remove('hidden');
      credsBox.innerHTML = `
        <div class="creds-box__header">
          <svg class="asmt-ic" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Регистрация успешно завершена!</span>
        </div>

        <div class="creds-box__email-notice">
          <svg class="asmt-ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:2px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <div>
            <strong>Пароль направлен на вашу электронную почту:</strong><br>
            Письмо с паролем отправлено на адрес <u style="font-weight:600;">${data.login}</u>. Не переживайте — реквизиты доступа останутся в вашей почте.
          </div>
        </div>

        <div class="creds-box__grid">
          <div class="creds-box__row">
            <span style="color:#64748b; font-size:0.9rem;">Логин (Email):</span>
            <span style="font-weight:600; color:#0f172a;">${data.login}</span>
          </div>
          <div class="creds-box__row">
            <span style="color:#64748b; font-size:0.9rem;">Пароль для входа:</span>
            <div class="creds-box__row-val">
              <code class="creds-box__code" id="credPassword">${data.password}</code>
              <button type="button" class="creds-box__copy-btn" id="btnCopyPassword" title="Скопировать пароль">
                <svg class="asmt-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span id="copyBtnText">Скопировать</span>
              </button>
            </div>
          </div>
        </div>

        <div style="font-size:0.85rem; color:#64748b; line-height:1.45; margin-bottom:14px;">
          💡 Если письмо не пришло во «Входящие», проверьте папку «Спам» или «Рассылки».
        </div>

        <div class="creds-box__actions">
          <a href="${data.redirect || 'cabinet.html'}" class="btn btn--primary btn--hero" id="btnGoToCabinet" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
            <span>Перейти в личный кабинет</span>
            <svg class="asmt-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      `;

      // Привязка копирования пароля
      const copyBtn = document.getElementById('btnCopyPassword');
      const copyText = document.getElementById('copyBtnText');
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(data.password);
            copyBtn.classList.add('creds-box__copy-btn--copied');
            if (copyText) copyText.textContent = 'Скопировано!';
            setTimeout(() => {
              copyBtn.classList.remove('creds-box__copy-btn--copied');
              if (copyText) copyText.textContent = 'Скопировать';
            }, 2500);
          } catch (_e) {
            const el = document.getElementById('credPassword');
            if (el) {
              const range = document.createRange();
              range.selectNodeContents(el);
              const sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }
        });
      }

      // Плавная прокрутка к блоку реквизитов
      credsBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      showStatus(err.message, 'error');
    }
  });
})();
