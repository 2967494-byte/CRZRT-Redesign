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
        return rightDate.localeCompare(leftDate);
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
          <td class="courses-table__description" title="${escapeHtml(course.description || '')}">${escapeHtml(truncateText(course.description)) || '—'}</td>
          <td>${escapeHtml(course.price || '—')}</td>
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
    els.formDescription.value = course?.description || '';
    els.formPrice.value = course?.price || '';
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
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    const payload = {
      id: els.formId.value || (api.createCourseId ? api.createCourseId() : `course_${Date.now()}`),
      title: els.formTitle.value.trim(),
      format: els.formFormat.value === 'dist' ? 'dist' : 'och',
      dateFrom: els.formDateFrom.value,
      durationDays: Math.max(1, parseInt(els.formDurationDays.value, 10) || 1),
      description: els.formDescription.value.trim(),
      price: els.formPrice.value.trim(),
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

  function bindEvents() {
    $('btnAddCourse')?.addEventListener('click', () => openModal(null));
    $('courseModalClose')?.addEventListener('click', closeModal);
    $('courseModalCancel')?.addEventListener('click', closeModal);
    els.form?.addEventListener('submit', handleFormSubmit);

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
    els.formDescription = $('courseFormDescription');
    els.formPrice = $('courseFormPrice');

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
