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
    if (forIndividuals && forLegalEntities) return 'Физ. и юр.';
    if (forIndividuals) return 'Физ. лица';
    if (forLegalEntities) return 'Юр. лица';
    return '—';
  }

  function readAudienceFromForm() {
    return {
      forIndividuals: Boolean(els.formForIndividuals?.checked),
      forLegalEntities: Boolean(els.formForLegalEntities?.checked)
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

  function truncateText(text, max = 120) {
    const value = String(text || '').trim();
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
          <td class="courses-table__description" title="${escapeHtml(typeof course.description === 'string' ? course.description : (course.description?.[0]?.text || ''))}">${escapeHtml(truncateText(typeof course.description === 'string' ? course.description : (course.description?.[0]?.text || ''))) || '—'}</td>
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
    
    // Handle description blocks
    els.descBlocksContainer.innerHTML = '';
    const desc = course?.description;
    if (Array.isArray(desc)) {
      if (desc.length === 0) addDescBlock('', '');
      else desc.forEach(b => addDescBlock(b.title, b.text));
    } else if (typeof desc === 'string' && desc.trim()) {
      addDescBlock('Описание', desc);
    } else {
      addDescBlock('', '');
    }

    els.formPrice.value = course?.price || '';
    els.formForIndividuals.checked = course ? course.forIndividuals !== false : true;
    els.formForLegalEntities.checked = course ? course.forLegalEntities !== false : true;
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
    setAudienceFormError(false);
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateAudienceForm()) return;

    const audience = readAudienceFromForm();
    
    const descBlocks = Array.from(els.descBlocksContainer.querySelectorAll('.admin-course-desc-block')).map(block => ({
      title: block.querySelector('.desc-title-input').value.trim(),
      text: block.querySelector('.desc-text-input').value.trim()
    })).filter(b => b.title || b.text);

    const payload = {
      id: els.formId.value || (api.createCourseId ? api.createCourseId() : `course_${Date.now()}`),
      title: els.formTitle.value.trim(),
      format: els.formFormat.value === 'dist' ? 'dist' : 'och',
      dateFrom: els.formDateFrom.value,
      durationDays: Math.max(1, parseInt(els.formDurationDays.value, 10) || 1),
      description: descBlocks,
      price: els.formPrice.value.trim(),
      forIndividuals: audience.forIndividuals,
      forLegalEntities: audience.forLegalEntities,
      speakers: [],
      active: true
    };

    const normalized = api.normalizeCourseRegistryItem
      ? api.normalizeCourseRegistryItem(payload, courses.length)
      : payload;

    const existingIndex = courses.findIndex((course) => course.id === normalized.id);
    if (existingIndex >= 0) {
      courses[existingIndex] = { ...courses[existingIndex], ...normalized };
    } else {
      courses.push(normalized);
    }

    courses = normalizeCourses(courses);
    closeModal();
    renderTable();
    await persistPageData(existingIndex >= 0 ? 'Курс обновлён' : 'Курс добавлен');
  }

  async function deleteCourse(courseId) {
    const course = courses.find((item) => item.id === courseId);
    const title = course?.title || 'курс';
    if (!window.confirm(`Удалить «${title}»?`)) return;

    courses = courses.filter((item) => item.id !== courseId);
    renderTable();
    await persistPageData('Курс удалён');
  }

  function addDescBlock(title = '', text = '') {
    if (els.descBlocksContainer.children.length >= 10) {
      alert('Можно добавить не более 10 блоков описания.');
      return;
    }

    const block = document.createElement('div');
    block.className = 'admin-course-desc-block';
    block.innerHTML = `
      <div class="admin-course-desc-block-header">
        <div class="form-group">
          <input type="text" class="form-control desc-title-input" placeholder="Заголовок (например, Описание)" value="${escapeHtml(title)}">
        </div>
        <button type="button" class="btn-desc-remove" aria-label="Удалить блок" title="Удалить блок">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      <div class="form-group" style="margin-bottom: 0;">
        <textarea class="form-control desc-text-input" placeholder="Текст блока" rows="3">${escapeHtml(text)}</textarea>
      </div>
    `;

    block.querySelector('.btn-desc-remove').addEventListener('click', () => {
      block.remove();
      updateAddBlockButtonState();
    });

    els.descBlocksContainer.appendChild(block);
    updateAddBlockButtonState();
  }

  function updateAddBlockButtonState() {
    if (els.descBlocksContainer.children.length >= 10) {
      els.btnAddDescBlock.style.display = 'none';
    } else {
      els.btnAddDescBlock.style.display = 'flex';
    }
  }

  function bindEvents() {
    $('btnAddCourse')?.addEventListener('click', () => openModal(null));
    $('courseModalClose')?.addEventListener('click', closeModal);
    $('courseModalCancel')?.addEventListener('click', closeModal);
    els.btnAddDescBlock?.addEventListener('click', () => addDescBlock('', ''));
    els.form?.addEventListener('submit', handleFormSubmit);
    els.formForIndividuals?.addEventListener('change', () => {
      if (readAudienceFromForm().forIndividuals || readAudienceFromForm().forLegalEntities) {
        setAudienceFormError(false);
      }
    });
    els.formForLegalEntities?.addEventListener('change', () => {
      if (readAudienceFromForm().forIndividuals || readAudienceFromForm().forLegalEntities) {
        setAudienceFormError(false);
      }
    });

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
      const response = await fetch('api/auth.php?action=check');
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
    els.descBlocksContainer = $('courseDescBlocks');
    els.btnAddDescBlock = $('btnAddDescBlock');
    els.formPrice = $('courseFormPrice');
    els.formForIndividuals = $('courseFormForIndividuals');
    els.formForLegalEntities = $('courseFormForLegalEntities');
    els.formAudienceGroup = $('courseFormAudienceGroup');
    els.formAudienceError = $('courseFormAudienceError');

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
