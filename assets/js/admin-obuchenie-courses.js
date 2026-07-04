/**
 * Отдельная страница учёта курсов для календаря «Обучение».
 */
(function () {
  const STORAGE_KEY = window.ObuchenieContent?.STORAGE_KEY || 'crzrt_obuchenie_page_data';
  const api = window.ObuchenieContent || {};

  let pageData = null;
  let courses = [];
  let saving = false;
  let datePickerInstance = null;

  const els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDateLabel(iso) {
    if (!iso) return '—';
    const parts = iso.split('-');
    if (parts.length !== 3) return iso;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }

  function formatCourseFormat(format) {
    return format === 'dist' ? 'Заочный' : 'Очный';
  }

  function formatCourseAudience(course) {
    const forIndividuals = course?.forIndividuals !== false;
    const forLegalEntities = course?.forLegalEntities !== false;
    let label = '';
    if (forIndividuals && forLegalEntities) label = 'Физ. и юр.';
    else if (forIndividuals) label = 'Физ. лица';
    else if (forLegalEntities) label = 'Юр. лица';
    else label = '—';

    if (Array.isArray(course?.options) && course.options.length) {
      label += ` (${course.options.join(', ')})`;
    }
    return label;
  }

  function readAudienceFromForm() {
    const options = [];
    const container = document.getElementById('courseFormDynamicOptions');
    if (container) {
      container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
        if (cb.checked) {
          options.push(cb.value);
        }
      });
    }

    return {
      forIndividuals: Boolean(els.formForIndividuals?.checked),
      forLegalEntities: Boolean(els.formForLegalEntities?.checked),
      forCustomers: options.includes('Заказчик'),
      forSuppliers: options.includes('Поставщик'),
      is44fz: options.includes('44-ФЗ'),
      is223fz: options.includes('223-ФЗ'),
      options
    };
  }

  function setAudienceFormError(visible) {
    if (!els.formAudienceError) return;
    els.formAudienceError.hidden = !visible;
    els.formAudienceGroup?.classList.toggle('admin-courses-audience--error', visible);
  }

  function validateAudienceForm() {
    const audience = readAudienceFromForm();
    const valid = audience.forIndividuals || audience.forLegalEntities;
    setAudienceFormError(!valid);
    return valid;
  }

  function syncBitrixFieldsVisibility() {
    const audience = readAudienceFromForm();
    if (els.formBitrixFlGroup) {
      els.formBitrixFlGroup.hidden = !audience.forIndividuals;
    }
    if (els.formBitrixUrGroup) {
      els.formBitrixUrGroup.hidden = !audience.forLegalEntities;
    }
  }

  function stripHtml(html) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  function truncateText(text, max = 120) {
    const value = stripHtml(String(text || '')).trim();
    if (value.length <= max) return value;
    return `${value.slice(0, max - 1)}…`;
  }

  function sortCourses(list) {
    return [...list].sort((left, right) => {
      const leftDate = String(left.dateFrom || '');
      const rightDate = String(right.dateFrom || '');
      if (leftDate && rightDate && leftDate !== rightDate) {
        return leftDate.localeCompare(rightDate);
      }
      if (leftDate && !rightDate) return -1;
      if (!leftDate && rightDate) return 1;
      return String(left.title || '').localeCompare(String(right.title || ''), 'ru');
    });
  }

  function normalizeCourses(list) {
    return api.normalizeCourseRegistry ? api.normalizeCourseRegistry(list) : list;
  }

  function setStatus(message, type) {
    if (!els.status) return;
    els.status.textContent = message || '';
    els.status.dataset.type = type || '';
  }

  async function loadPageData() {
    let raw = null;
    try {
      const response = await fetch(`api/settings.php?key=${encodeURIComponent(STORAGE_KEY)}`);
      if (response.ok) {
        const text = await response.text();
        raw = text ? JSON.parse(text) : null;
      }
    } catch (error) {
      console.warn('Courses admin: API load failed', error);
    }

    if (!raw) {
      try {
        const local = localStorage.getItem(STORAGE_KEY);
        raw = local ? JSON.parse(local) : null;
      } catch (error) {
        console.warn('Courses admin: localStorage load failed', error);
      }
    }

    pageData = api.migrateObucheniePageData ? api.migrateObucheniePageData(raw) : (raw || {});
    courses = normalizeCourses(pageData.courseRegistry || []);
    pageData.courseRegistry = courses;
    syncCalendarDays();
  }

  function syncCalendarDays() {
    if (!pageData.calendar) pageData.calendar = {};
    pageData.calendar.courseDaysByMonth = api.deriveCourseDaysByMonth
      ? api.deriveCourseDaysByMonth(courses)
      : {};
  }

  async function syncCourseLeadToBitrix(course) {
    const response = await fetch('api/bitrix-lead-course.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        title: course.title,
        dateFrom: course.dateFrom,
        dateTo: course.dateTo,
        durationDays: course.durationDays,
        format: course.format,
        price: course.price,
        bitrixCourseElementId: course.bitrixCourseElementId || null
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success || !result.leadId) {
      const details = result.details
        ? (typeof result.details === 'string' ? result.details : JSON.stringify(result.details))
        : '';
      const message = result.error || `HTTP ${response.status}`;
      throw new Error(details ? `${message} (${details})` : message);
    }
    return result;
  }

  async function persistPageData(message) {
    if (saving) return;
    saving = true;
    setStatus('Сохранение…', 'pending');

    syncCalendarDays();
    pageData.courseRegistry = courses;

    try {
      const response = await fetch('api/settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ key: STORAGE_KEY, value: pageData })
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Не удалось сохранить данные');
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pageData));
      setStatus(message || 'Сохранено', 'success');
    } catch (error) {
      console.error(error);
      setStatus(error.message || 'Ошибка сохранения', 'error');
    } finally {
      saving = false;
    }
  }

  function renderTable() {
    const sorted = sortCourses(courses);
    if (!els.tableBody || !els.tableEmpty) return;

    if (!sorted.length) {
      els.tableBody.innerHTML = '';
      els.tableEmpty.hidden = false;
      return;
    }

    els.tableEmpty.hidden = true;
    els.tableBody.innerHTML = sorted
      .map((course) => `
        <tr data-course-id="${escapeHtml(course.id)}">
          <td>${escapeHtml(formatDateLabel(course.dateFrom))}</td>
          <td><strong>${escapeHtml(course.title || 'Без названия')}</strong></td>
          <td>${escapeHtml(formatCourseFormat(course.format))}</td>
          <td>${escapeHtml(String(course.durationDays || 1))}</td>
          <td class="courses-table__description" title="${escapeHtml(stripHtml(typeof course.description === 'string' ? course.description : (course.description?.[0]?.text || '')))}">${escapeHtml(truncateText(typeof course.description === 'string' ? course.description : (course.description?.[0]?.text || ''))) || '—'}</td>
          <td>${escapeHtml(course.price || '—')}</td>
          <td>${escapeHtml(formatCourseAudience(course))}</td>
          <td class="courses-table__actions">
            <button type="button" class="btn-edit" data-action="edit" data-id="${escapeHtml(course.id)}">Редактировать</button>
            <button type="button" class="btn-delete" data-action="delete" data-id="${escapeHtml(course.id)}">Удалить</button>
          </td>
        </tr>`)
      .join('');
  }

  function openModal(course) {
    const isEdit = Boolean(course);
    els.modalTitle.textContent = isEdit ? 'Редактировать курс' : 'Добавить курс';
    els.formId.value = course?.id || '';
    
    if (datePickerInstance) {
      datePickerInstance.setDate(course?.dateFrom || '', false);
    } else {
      els.formDateFrom.value = course?.dateFrom || '';
    }

    els.formTitle.value = course?.title || '';
    els.formFormat.value = course?.format === 'dist' ? 'dist' : 'och';
    els.formDurationDays.value = String(course?.durationDays || 1);
    
    let descHtml = '';
    const desc = course?.description;
    if (Array.isArray(desc)) {
      descHtml = desc.map(b => (b.title ? `<b>${b.title}</b><br>` : '') + b.text).join('<br><br>');
    } else if (typeof desc === 'string') {
      descHtml = desc;
    }
    els.formDescription.innerHTML = descHtml;

    els.formPrice.value = course?.price || '';
    if (els.formBitrixCatalogId) {
      els.formBitrixCatalogId.value = course?.bitrixCourseElementId ? String(course.bitrixCourseElementId) : '';
    }
    els.formForIndividuals.checked = course ? course.forIndividuals !== false : true;
    els.formForLegalEntities.checked = course ? course.forLegalEntities !== false : true;

    // Render dynamic checkboxes
    const dynamicContainer = document.getElementById('courseFormDynamicOptions');
    if (dynamicContainer) {
      dynamicContainer.innerHTML = '';
      const blocks = pageData?.courseSearch?.blocks || [];
      blocks.forEach((block) => {
        if (Array.isArray(block.values)) {
          block.values.forEach((val) => {
            const label = document.createElement('label');
            label.className = 'checkbox-group';
            
            const isChecked = course?.options
              ? course.options.includes(val)
              : (
                  (val === 'Заказчик' && course?.forCustomers) ||
                  (val === 'Поставщик' && course?.forSuppliers) ||
                  (val === '44-ФЗ' && course?.is44fz) ||
                  (val === '223-ФЗ' && course?.is223fz) ||
                  (val === 'Очно' && course?.format === 'och') ||
                  (val === 'Дистанционно' && course?.format === 'dist')
                );

            label.innerHTML = `<input type="checkbox" value="${escapeHtml(val)}" ${isChecked ? 'checked' : ''}> ${escapeHtml(val)}`;
            dynamicContainer.appendChild(label);
          });
        }
      });
    }
    if (els.formBitrixFl) {
      const ref = api.formatBitrixFormRef ? api.formatBitrixFormRef(course?.bitrixFormFl) : '';
      els.formBitrixFl.value = ref;
      updateBitrixDisplay('fl', ref);
    }
    if (els.formBitrixUr) {
      const ref = api.formatBitrixFormRef ? api.formatBitrixFormRef(course?.bitrixFormUr) : '';
      els.formBitrixUr.value = ref;
      updateBitrixDisplay('ur', ref);
    }
    syncBitrixFieldsVisibility();
    setAudienceFormError(false);
    els.modal.style.display = 'flex';
    els.formTitle.focus();
  }

  function closeModal() {
    els.modal.style.display = 'none';
    els.form.reset();
    if (datePickerInstance) {
      datePickerInstance.clear();
    }
    els.formId.value = '';
    if (els.formForIndividuals) els.formForIndividuals.checked = true;
    if (els.formForLegalEntities) els.formForLegalEntities.checked = true;
    const dynamicContainer = document.getElementById('courseFormDynamicOptions');
    if (dynamicContainer) dynamicContainer.innerHTML = '';
    if (els.formBitrixFl) { els.formBitrixFl.value = ''; updateBitrixDisplay('fl', ''); }
    if (els.formBitrixUr) { els.formBitrixUr.value = ''; updateBitrixDisplay('ur', ''); }
    syncBitrixFieldsVisibility();
    setAudienceFormError(false);
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateAudienceForm()) return;

    const audience = readAudienceFromForm();
    let bitrixFormFl = api.normalizeBitrixForm
      ? api.normalizeBitrixForm(els.formBitrixFl?.value)
      : (api.parseBitrixFormRef ? api.parseBitrixFormRef(els.formBitrixFl?.value) : null);
    let bitrixFormUr = api.normalizeBitrixForm
      ? api.normalizeBitrixForm(els.formBitrixUr?.value)
      : (api.parseBitrixFormRef ? api.parseBitrixFormRef(els.formBitrixUr?.value) : null);

    if (els.formBitrixFl?.value?.trim() && !bitrixFormFl) {
      window.alert('Не удалось распознать Bitrix24-форму для физ. лиц. Укажите формат: 1048 / 6zzb7x');
      return;
    }
    if (els.formBitrixUr?.value?.trim() && !bitrixFormUr) {
      window.alert('Не удалось распознать Bitrix24-форму для юр. лиц. Укажите формат: ID / sec');
      return;
    }

    if (api.enrichBitrixFormRef) {
      if (bitrixFormFl) bitrixFormFl = await api.enrichBitrixFormRef(bitrixFormFl);
      if (bitrixFormUr) bitrixFormUr = await api.enrichBitrixFormRef(bitrixFormUr);
    }

    const existingIndex = courses.findIndex((course) => course.id === (els.formId.value || ''));
    const existingLeadId = existingIndex >= 0 ? courses[existingIndex].bitrixLeadId : null;

    const payload = {
      id: els.formId.value || (api.createCourseId ? api.createCourseId() : `course_${Date.now()}`),
      title: els.formTitle.value.trim(),
      format: els.formFormat.value === 'dist' ? 'dist' : 'och',
      dateFrom: els.formDateFrom.value,
      durationDays: Math.max(1, parseInt(els.formDurationDays.value, 10) || 1),
      description: els.formDescription.innerHTML,
      price: els.formPrice.value.trim(),
      bitrixCourseElementId: els.formBitrixCatalogId?.value
        ? parseInt(els.formBitrixCatalogId.value, 10) || null
        : null,
      forIndividuals: audience.forIndividuals,
      forLegalEntities: audience.forLegalEntities,
      forCustomers: audience.forCustomers,
      forSuppliers: audience.forSuppliers,
      is44fz: audience.is44fz,
      is223fz: audience.is223fz,
      bitrixFormFl,
      bitrixFormUr,
      bitrixLeadId: existingLeadId || null,
      speakers: [],
      options: audience.options,
      active: true
    };

    const normalized = api.normalizeCourseRegistryItem
      ? api.normalizeCourseRegistryItem(payload, courses.length)
      : payload;

    const isNew = existingIndex < 0;
    let bitrixSyncNote = '';

    if (existingIndex >= 0) {
      courses[existingIndex] = { ...courses[existingIndex], ...normalized };
    } else {
      courses.push(normalized);
    }

    courses = normalizeCourses(courses);

    const needsBitrixLead = isNew || !normalized.bitrixLeadId;
    if (needsBitrixLead) {
      try {
        const bitrixResult = await syncCourseLeadToBitrix(normalized);
        const courseIndex = courses.findIndex((course) => course.id === normalized.id);
        if (courseIndex >= 0) {
          courses[courseIndex].bitrixLeadId = bitrixResult.leadId;
          if (bitrixResult.catalogElementId) {
            courses[courseIndex].bitrixCourseElementId = bitrixResult.catalogElementId;
          }
        }
        bitrixSyncNote = `, лид Bitrix24 #${bitrixResult.leadId}`;
        if (bitrixResult.catalogElementId) {
          bitrixSyncNote += `, каталог #${bitrixResult.catalogElementId}`;
        }
        if (bitrixResult.catalogWarning) {
          window.alert(
            `Курс сохранён, лид Bitrix24 создан (#${bitrixResult.leadId}), но в каталог курсов Bitrix24 не попал: ${bitrixResult.catalogWarning}. Попросите администратора Bitrix24 выдать webhook права «lists».`
          );
        }
      } catch (syncError) {
        console.error('Bitrix lead sync failed', syncError);
        const errorText = syncError.message || 'неизвестная ошибка';
        window.alert(`Курс сохранён на сайте, но лид в Bitrix24 не создан: ${errorText}`);
        bitrixSyncNote = ', лид Bitrix24 не создан';
      }
    }

    closeModal();
    renderTable();
    const baseMessage = existingIndex >= 0 ? 'Курс обновлён' : 'Курс добавлен';
    await persistPageData(`${baseMessage}${bitrixSyncNote}`);
  }

  async function deleteCourse(courseId) {
    const course = courses.find((item) => item.id === courseId);
    const title = course?.title || 'курс';
    if (!window.confirm(`Удалить «${title}»?`)) return;

    courses = courses.filter((item) => item.id !== courseId);
    renderTable();
    await persistPageData('Курс удалён');
  }

  function updateWysiwygToolbarState() {
    els.wysiwygBtns.forEach(btn => {
      const command = btn.getAttribute('data-command');
      if (document.queryCommandState(command)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function updateBitrixDisplay(type, ref) {
    const valueEl = $(`courseFormBitrix${type === 'fl' ? 'Fl' : 'Ur'}Value`);
    if (!valueEl) return;
    if (ref && ref.trim()) {
      valueEl.textContent = ref;
      valueEl.classList.add('bitrix-field-display__value--set');
    } else {
      valueEl.textContent = 'Не задано';
      valueEl.classList.remove('bitrix-field-display__value--set');
    }
  }

  function bindBitrixPasteModal() {
    const modal = $('bitrixPasteModal');
    const textarea = $('bitrixPasteInput');
    const preview = $('bitrixPastePreview');
    const result = $('bitrixPasteResult');
    const errorEl = $('bitrixPasteError');
    const subtitle = $('bitrixPasteModalSubtitle');
    if (!modal || !textarea) return;

    let currentType = 'fl'; // 'fl' or 'ur'
    let parsedRef = null;

    function parseInput() {
      const val = textarea.value;
      if (!val.trim()) {
        preview.hidden = true;
        errorEl.hidden = true;
        parsedRef = null;
        return;
      }
      parsedRef = api.parseBitrixFormRef ? api.parseBitrixFormRef(val) : null;
      if (parsedRef) {
        const formatted = api.formatBitrixFormRef ? api.formatBitrixFormRef(parsedRef) : `${parsedRef.id} / ${parsedRef.sec}`;
        result.textContent = formatted;
        preview.hidden = false;
        errorEl.hidden = true;
        if (api.fetchBitrixFormMeta) {
          api.fetchBitrixFormMeta(parsedRef.id).then((meta) => {
            if (!meta || textarea.value !== val) return;
            if (meta.captchaEnabled) {
              result.textContent = `${formatted} — капча включена (на сайте откроется форма Bitrix24)`;
            } else if (meta.title) {
              result.textContent = `${formatted} — ${meta.title}`;
            }
          });
        }
      } else {
        preview.hidden = true;
        errorEl.hidden = false;
      }
    }

    function openPasteModal(type) {
      currentType = type;
      parsedRef = null;
      const hiddenInput = $(`courseFormBitrix${type === 'fl' ? 'Fl' : 'Ur'}`);
      const existingVal = hiddenInput?.value || '';
      textarea.value = existingVal;
      subtitle.textContent = type === 'fl' ? 'Физические лица' : 'Юридические лица';
      preview.hidden = true;
      errorEl.hidden = true;
      if (existingVal) parseInput();
      modal.style.display = 'flex';
      setTimeout(() => textarea.focus(), 50);
    }

    function closePasteModal() {
      modal.style.display = 'none';
      textarea.value = '';
      preview.hidden = true;
      errorEl.hidden = true;
      parsedRef = null;
    }

    function savePasteModal() {
      const val = textarea.value.trim();
      if (!val) {
        const hiddenInput = $(`courseFormBitrix${currentType === 'fl' ? 'Fl' : 'Ur'}`);
        if (hiddenInput) hiddenInput.value = '';
        updateBitrixDisplay(currentType, '');
        closePasteModal();
        return;
      }

      const ref = parsedRef || (api.parseBitrixFormRef ? api.parseBitrixFormRef(val) : null);
      if (!ref?.id || !ref?.sec) {
        errorEl.hidden = false;
        preview.hidden = true;
        return;
      }

      const formatted = api.formatBitrixFormRef ? api.formatBitrixFormRef(ref) : `${ref.id} / ${ref.sec}`;
      const hiddenInput = $(`courseFormBitrix${currentType === 'fl' ? 'Fl' : 'Ur'}`);
      if (hiddenInput) hiddenInput.value = formatted;
      updateBitrixDisplay(currentType, formatted);
      closePasteModal();
    }

    textarea.addEventListener('input', parseInput);
    textarea.addEventListener('paste', () => setTimeout(parseInput, 0));

    $('bitrixPasteModalClose')?.addEventListener('click', closePasteModal);
    $('bitrixPasteCancel')?.addEventListener('click', closePasteModal);
    $('bitrixPasteSave')?.addEventListener('click', savePasteModal);
    $('bitrixPasteClear')?.addEventListener('click', () => {
      const hiddenInput = $(`courseFormBitrix${currentType === 'fl' ? 'Fl' : 'Ur'}`);
      if (hiddenInput) hiddenInput.value = '';
      updateBitrixDisplay(currentType, '');
      closePasteModal();
    });

    modal.addEventListener('click', (e) => { if (e.target === modal) closePasteModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.style.display !== 'none') closePasteModal(); });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-bitrix-open]');
      if (!btn) return;
      openPasteModal(btn.getAttribute('data-bitrix-open'));
    });
  }

  function handleBitrixInputBlur(input) {
    // no-op: kept for compatibility, parsing now handled in paste modal
  }

  function bindEvents() {
    $('btnAddCourse')?.addEventListener('click', () => openModal(null));
    $('courseModalClose')?.addEventListener('click', closeModal);
    $('courseModalCancel')?.addEventListener('click', closeModal);
    
    els.wysiwygBtns?.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const command = btn.getAttribute('data-command');
        document.execCommand(command, false, null);
        els.formDescription.focus();
        updateWysiwygToolbarState();
      });
    });

    const wysiwygFontSize = $('wysiwygFontSize');
    const wysiwygColor = $('wysiwygColor');

    if (wysiwygFontSize) {
      wysiwygFontSize.addEventListener('change', (e) => {
        document.execCommand('fontSize', false, e.target.value);
        els.formDescription.focus();
      });
    }

    if (wysiwygColor) {
      wysiwygColor.addEventListener('input', (e) => {
        document.execCommand('foreColor', false, e.target.value);
        els.formDescription.focus();
      });
    }

    els.formDescription?.addEventListener('keyup', updateWysiwygToolbarState);
    els.formDescription?.addEventListener('mouseup', updateWysiwygToolbarState);

    els.form?.addEventListener('submit', handleFormSubmit);
    els.formForIndividuals?.addEventListener('change', () => {
      syncBitrixFieldsVisibility();
      if (readAudienceFromForm().forIndividuals || readAudienceFromForm().forLegalEntities) {
        setAudienceFormError(false);
      }
    });
    els.formForLegalEntities?.addEventListener('change', () => {
      syncBitrixFieldsVisibility();
      if (readAudienceFromForm().forIndividuals || readAudienceFromForm().forLegalEntities) {
        setAudienceFormError(false);
      }
    });

    bindBitrixPasteModal();

    els.tableBody?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const courseId = button.getAttribute('data-id');
      if (!courseId) return;

      if (button.dataset.action === 'edit') {
        const course = courses.find((item) => item.id === courseId);
        if (course) openModal(course);
      }
      if (button.dataset.action === 'delete') {
        deleteCourse(courseId);
      }
    });

    els.modal?.addEventListener('click', (event) => {
      if (event.target === els.modal) closeModal();
    });
  }

  async function checkAuth() {
    const authModal = $('authModal');
    const authEmail = $('authEmail');
    const authPassword = $('authPassword');
    const authError = $('authError');

    try {
      const response = await fetch('api/auth.php?action=check', { credentials: 'same-origin' });
      const data = await response.json();
      if (data.authenticated) {
        authModal.style.display = 'none';
        $('coursesPageRoot').hidden = false;
        await loadPageData();
        renderTable();
        return;
      }
    } catch (error) {
      console.warn('Auth check failed', error);
    }

    authModal.style.display = 'flex';
    authModal.style.opacity = '1';

    $('btnAuthLogin')?.addEventListener('click', async () => {
      const email = authEmail.value.trim();
      const password = authPassword.value;
      try {
        const response = await fetch('api/auth.php?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok && data.success) {
          authError.style.display = 'none';
          await checkAuth();
        } else {
          authError.style.display = 'block';
          authError.textContent = data.error || 'Неверный e-mail или пароль';
        }
      } catch (error) {
        authError.style.display = 'block';
        authError.textContent = 'Ошибка соединения с сервером';
      }
    });
  }

  function initThemeToggle() {
    const toggle = $('theme-toggle-admin');
    if (!toggle) return;
    const iconSun = document.querySelector('.icon-sun');
    const iconMoon = document.querySelector('.icon-moon');

    function updateIcons(isLight) {
      if (iconSun && iconMoon) {
        if (isLight) {
          iconSun.style.display = 'none';
          iconMoon.style.display = 'block';
        } else {
          iconSun.style.display = 'block';
          iconMoon.style.display = 'none';
        }
      }
    }

    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      updateIcons(true);
    } else {
      document.documentElement.removeAttribute('data-theme');
      updateIcons(false);
    }

    toggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        updateIcons(false);
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        updateIcons(true);
      }
    });
  }

  function init() {
    els.root = $('coursesPageRoot');
    els.status = $('coursesSaveStatus');
    els.tableBody = $('coursesTableBody');
    els.tableEmpty = $('coursesTableEmpty');
    els.modal = $('courseModal');
    els.modalTitle = $('courseModalTitle');
    els.form = $('courseForm');
    els.formId = $('courseFormId');
    els.formDateFrom = $('courseFormDateFrom');
    els.formTitle = $('courseFormTitle');
    els.formFormat = $('courseFormFormat');
    els.formDurationDays = $('courseFormDurationDays');
    els.formDescription = $('courseFormDescription');
    els.wysiwygBtns = document.querySelectorAll('.wysiwyg-btn');
    els.formPrice = $('courseFormPrice');
    els.formBitrixCatalogId = $('courseFormBitrixCatalogId');
    els.formForIndividuals = $('courseFormForIndividuals');
    els.formForLegalEntities = $('courseFormForLegalEntities');
    els.formAudienceGroup = $('courseFormAudienceGroup');
    els.formAudienceError = $('courseFormAudienceError');
    els.formBitrixFl = $('courseFormBitrixFl');
    els.formBitrixUr = $('courseFormBitrixUr');
    els.formBitrixFlGroup = $('courseFormBitrixFlGroup');
    els.formBitrixUrGroup = $('courseFormBitrixUrGroup');

    // Initialize flatpickr datepicker
    if (typeof flatpickr !== 'undefined' && els.formDateFrom) {
      datePickerInstance = flatpickr(els.formDateFrom, {
        locale: 'ru',
        dateFormat: 'Y-m-d',
        altInput: true,
        altFormat: 'd.m.Y',
        allowInput: true,
        disableMobile: true
      });
    }

    initThemeToggle();
    bindEvents();
    checkAuth();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
