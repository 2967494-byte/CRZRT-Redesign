function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * Отдельная страница учёта курсов для календаря «Обучение».
 */
(function (_window$ObuchenieCont) {
  var STORAGE_KEY = ((_window$ObuchenieCont = window.ObuchenieContent) === null || _window$ObuchenieCont === void 0 ? void 0 : _window$ObuchenieCont.STORAGE_KEY) || 'crzrt_obuchenie_page_data';
  var api = window.ObuchenieContent || {};
  var pageData = null;
  var courses = [];
  var saving = false;
  var datePickerInstance = null;
  var els = {};
  function $(id) {
    return document.getElementById(id);
  }
  function escapeHtml(value) {
    return String(value !== null && value !== void 0 ? value : '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function formatDateLabel(iso) {
    if (!iso) return '—';
    var parts = iso.split('-');
    if (parts.length !== 3) return iso;
    return "".concat(parts[2], ".").concat(parts[1], ".").concat(parts[0]);
  }
  function formatCourseFormat(format) {
    return format === 'dist' ? 'Заочный' : 'Очный';
  }
  function formatCourseAudience(course) {
    var forIndividuals = (course === null || course === void 0 ? void 0 : course.forIndividuals) !== false;
    var forLegalEntities = (course === null || course === void 0 ? void 0 : course.forLegalEntities) !== false;
    var label = '';
    if (forIndividuals && forLegalEntities) label = 'Физ. и юр.';else if (forIndividuals) label = 'Физ. лица';else if (forLegalEntities) label = 'Юр. лица';else label = '—';
    if (Array.isArray(course === null || course === void 0 ? void 0 : course.options) && course.options.length) {
      label += " (".concat(course.options.join(', '), ")");
    }
    return label;
  }
  function readAudienceFromForm() {
    var _els$formForIndividua, _els$formForLegalEnti;
    var options = [];
    var container = document.getElementById('courseFormDynamicOptions');
    if (container) {
      container.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
        if (cb.checked) {
          options.push(cb.value);
        }
      });
    }
    return {
      forIndividuals: Boolean((_els$formForIndividua = els.formForIndividuals) === null || _els$formForIndividua === void 0 ? void 0 : _els$formForIndividua.checked),
      forLegalEntities: Boolean((_els$formForLegalEnti = els.formForLegalEntities) === null || _els$formForLegalEnti === void 0 ? void 0 : _els$formForLegalEnti.checked),
      forCustomers: options.includes('Заказчик'),
      forSuppliers: options.includes('Поставщик'),
      is44fz: options.includes('44-ФЗ'),
      is223fz: options.includes('223-ФЗ'),
      options: options
    };
  }
  function setAudienceFormError(visible) {
    var _els$formAudienceGrou;
    if (!els.formAudienceError) return;
    els.formAudienceError.hidden = !visible;
    (_els$formAudienceGrou = els.formAudienceGroup) === null || _els$formAudienceGrou === void 0 || _els$formAudienceGrou.classList.toggle('admin-courses-audience--error', visible);
  }
  function validateAudienceForm() {
    var audience = readAudienceFromForm();
    var valid = audience.forIndividuals || audience.forLegalEntities;
    setAudienceFormError(!valid);
    return valid;
  }
  function syncBitrixFieldsVisibility() {
    var audience = readAudienceFromForm();
    if (els.formBitrixFlGroup) {
      els.formBitrixFlGroup.hidden = !audience.forIndividuals;
    }
    if (els.formBitrixUrGroup) {
      els.formBitrixUrGroup.hidden = !audience.forLegalEntities;
    }
  }
  function stripHtml(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  function truncateText(text) {
    var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 120;
    var value = stripHtml(String(text || '')).trim();
    if (value.length <= max) return value;
    return "".concat(value.slice(0, max - 1), "\u2026");
  }
  function sortCourses(list) {
    return _toConsumableArray(list).sort(function (left, right) {
      var leftDate = String(left.dateFrom || '');
      var rightDate = String(right.dateFrom || '');
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
  function loadPageData() {
    return _loadPageData.apply(this, arguments);
  }
  function _loadPageData() {
    _loadPageData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var raw, response, text, local, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            raw = null;
            _context.p = 1;
            _context.n = 2;
            return fetch("api/settings.php?key=".concat(encodeURIComponent(STORAGE_KEY)));
          case 2:
            response = _context.v;
            if (!response.ok) {
              _context.n = 4;
              break;
            }
            _context.n = 3;
            return response.text();
          case 3:
            text = _context.v;
            raw = text ? JSON.parse(text) : null;
          case 4:
            _context.n = 6;
            break;
          case 5:
            _context.p = 5;
            _t = _context.v;
            console.warn('Courses admin: API load failed', _t);
          case 6:
            if (!raw) {
              try {
                local = localStorage.getItem(STORAGE_KEY);
                raw = local ? JSON.parse(local) : null;
              } catch (error) {
                console.warn('Courses admin: localStorage load failed', error);
              }
            }
            pageData = api.migrateObucheniePageData ? api.migrateObucheniePageData(raw) : raw || {};
            courses = normalizeCourses(pageData.courseRegistry || []);
            pageData.courseRegistry = courses;
            syncCalendarDays();
          case 7:
            return _context.a(2);
        }
      }, _callee, null, [[1, 5]]);
    }));
    return _loadPageData.apply(this, arguments);
  }
  function syncCalendarDays() {
    if (!pageData.calendar) pageData.calendar = {};
    pageData.calendar.courseDaysByMonth = api.deriveCourseDaysByMonth ? api.deriveCourseDaysByMonth(courses) : {};
  }
  function syncCourseLeadToBitrix(_x) {
    return _syncCourseLeadToBitrix.apply(this, arguments);
  }
  function _syncCourseLeadToBitrix() {
    _syncCourseLeadToBitrix = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(course) {
      var response, result, details, message;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _context2.n = 1;
            return fetch('api/bitrix-lead-course.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
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
          case 1:
            response = _context2.v;
            _context2.n = 2;
            return response.json().catch(function () {
              return {};
            });
          case 2:
            result = _context2.v;
            if (!(!response.ok || !result.success || !result.leadId)) {
              _context2.n = 3;
              break;
            }
            details = result.details ? typeof result.details === 'string' ? result.details : JSON.stringify(result.details) : '';
            message = result.error || "HTTP ".concat(response.status);
            throw new Error(details ? "".concat(message, " (").concat(details, ")") : message);
          case 3:
            return _context2.a(2, result);
        }
      }, _callee2);
    }));
    return _syncCourseLeadToBitrix.apply(this, arguments);
  }
  function persistPageData(_x2) {
    return _persistPageData.apply(this, arguments);
  }
  function _persistPageData() {
    _persistPageData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(message) {
      var response, result, _t2;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            if (!saving) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2);
          case 1:
            saving = true;
            setStatus('Сохранение…', 'pending');
            syncCalendarDays();
            pageData.courseRegistry = courses;
            _context3.p = 2;
            _context3.n = 3;
            return fetch('api/settings.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'same-origin',
              body: JSON.stringify({
                key: STORAGE_KEY,
                value: pageData
              })
            });
          case 3:
            response = _context3.v;
            _context3.n = 4;
            return response.json();
          case 4:
            result = _context3.v;
            if (!(!response.ok || !(result !== null && result !== void 0 && result.success))) {
              _context3.n = 5;
              break;
            }
            throw new Error((result === null || result === void 0 ? void 0 : result.error) || 'Не удалось сохранить данные');
          case 5:
            localStorage.setItem(STORAGE_KEY, JSON.stringify(pageData));
            setStatus(message || 'Сохранено', 'success');
            _context3.n = 7;
            break;
          case 6:
            _context3.p = 6;
            _t2 = _context3.v;
            console.error(_t2);
            setStatus(_t2.message || 'Ошибка сохранения', 'error');
          case 7:
            _context3.p = 7;
            saving = false;
            return _context3.f(7);
          case 8:
            return _context3.a(2);
        }
      }, _callee3, null, [[2, 6, 7, 8]]);
    }));
    return _persistPageData.apply(this, arguments);
  }
  function renderTable() {
    var sorted = sortCourses(courses);
    if (!els.tableBody || !els.tableEmpty) return;
    if (!sorted.length) {
      els.tableBody.innerHTML = '';
      els.tableEmpty.hidden = false;
      return;
    }
    els.tableEmpty.hidden = true;
    els.tableBody.innerHTML = sorted.map(function (course) {
      var _course$description, _course$description2;
      return "\n        <tr data-course-id=\"".concat(escapeHtml(course.id), "\">\n          <td>").concat(escapeHtml(formatDateLabel(course.dateFrom)), "</td>\n          <td><strong>").concat(escapeHtml(course.title || 'Без названия'), "</strong></td>\n          <td>").concat(escapeHtml(formatCourseFormat(course.format)), "</td>\n          <td>").concat(escapeHtml(String(course.durationDays || 1)), "</td>\n          <td class=\"courses-table__description\" title=\"").concat(escapeHtml(stripHtml(typeof course.description === 'string' ? course.description : ((_course$description = course.description) === null || _course$description === void 0 || (_course$description = _course$description[0]) === null || _course$description === void 0 ? void 0 : _course$description.text) || '')), "\">").concat(escapeHtml(truncateText(typeof course.description === 'string' ? course.description : ((_course$description2 = course.description) === null || _course$description2 === void 0 || (_course$description2 = _course$description2[0]) === null || _course$description2 === void 0 ? void 0 : _course$description2.text) || '')) || '—', "</td>\n          <td>").concat(escapeHtml(course.price || '—'), "</td>\n          <td>").concat(escapeHtml(formatCourseAudience(course)), "</td>\n          <td class=\"courses-table__actions\">\n            <button type=\"button\" class=\"btn-edit\" data-action=\"edit\" data-id=\"").concat(escapeHtml(course.id), "\">\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button>\n            <button type=\"button\" class=\"btn-delete\" data-action=\"delete\" data-id=\"").concat(escapeHtml(course.id), "\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button>\n          </td>\n        </tr>");
    }).join('');
  }
  function openModal(course) {
    var isEdit = Boolean(course);
    els.modalTitle.textContent = isEdit ? 'Редактировать курс' : 'Добавить курс';
    els.formId.value = (course === null || course === void 0 ? void 0 : course.id) || '';
    if (datePickerInstance) {
      datePickerInstance.setDate((course === null || course === void 0 ? void 0 : course.dateFrom) || '', false);
    } else {
      els.formDateFrom.value = (course === null || course === void 0 ? void 0 : course.dateFrom) || '';
    }
    els.formTitle.value = (course === null || course === void 0 ? void 0 : course.title) || '';
    els.formFormat.value = (course === null || course === void 0 ? void 0 : course.format) === 'dist' ? 'dist' : 'och';
    els.formDurationDays.value = String((course === null || course === void 0 ? void 0 : course.durationDays) || 1);
    var descHtml = '';
    var desc = course === null || course === void 0 ? void 0 : course.description;
    if (Array.isArray(desc)) {
      descHtml = desc.map(function (b) {
        return (b.title ? "<b>".concat(b.title, "</b><br>") : '') + b.text;
      }).join('<br><br>');
    } else if (typeof desc === 'string') {
      descHtml = desc;
    }
    els.formDescription.innerHTML = descHtml;
    els.formPrice.value = (course === null || course === void 0 ? void 0 : course.price) || '';
    if (els.formBitrixCatalogId) {
      els.formBitrixCatalogId.value = course !== null && course !== void 0 && course.bitrixCourseElementId ? String(course.bitrixCourseElementId) : '';
    }
    els.formForIndividuals.checked = course ? course.forIndividuals !== false : true;
    els.formForLegalEntities.checked = course ? course.forLegalEntities !== false : true;

    // Render dynamic checkboxes
    var dynamicContainer = document.getElementById('courseFormDynamicOptions');
    if (dynamicContainer) {
      var _pageData;
      dynamicContainer.innerHTML = '';
      var blocks = ((_pageData = pageData) === null || _pageData === void 0 || (_pageData = _pageData.courseSearch) === null || _pageData === void 0 ? void 0 : _pageData.blocks) || [];
      blocks.forEach(function (block) {
        if (Array.isArray(block.values)) {
          block.values.forEach(function (val) {
            var label = document.createElement('label');
            label.className = 'checkbox-group';
            var isChecked = course !== null && course !== void 0 && course.options ? course.options.includes(val) : val === 'Заказчик' && (course === null || course === void 0 ? void 0 : course.forCustomers) || val === 'Поставщик' && (course === null || course === void 0 ? void 0 : course.forSuppliers) || val === '44-ФЗ' && (course === null || course === void 0 ? void 0 : course.is44fz) || val === '223-ФЗ' && (course === null || course === void 0 ? void 0 : course.is223fz) || val === 'Очно' && (course === null || course === void 0 ? void 0 : course.format) === 'och' || val === 'Дистанционно' && (course === null || course === void 0 ? void 0 : course.format) === 'dist';
            label.innerHTML = "<input type=\"checkbox\" value=\"".concat(escapeHtml(val), "\" ").concat(isChecked ? 'checked' : '', "> ").concat(escapeHtml(val));
            dynamicContainer.appendChild(label);
          });
        }
      });
    }
    if (els.formBitrixFl) {
      var ref = api.formatBitrixFormRef ? api.formatBitrixFormRef(course === null || course === void 0 ? void 0 : course.bitrixFormFl) : '';
      els.formBitrixFl.value = ref;
      updateBitrixDisplay('fl', ref);
    }
    if (els.formBitrixUr) {
      var _ref = api.formatBitrixFormRef ? api.formatBitrixFormRef(course === null || course === void 0 ? void 0 : course.bitrixFormUr) : '';
      els.formBitrixUr.value = _ref;
      updateBitrixDisplay('ur', _ref);
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
    var dynamicContainer = document.getElementById('courseFormDynamicOptions');
    if (dynamicContainer) dynamicContainer.innerHTML = '';
    if (els.formBitrixFl) {
      els.formBitrixFl.value = '';
      updateBitrixDisplay('fl', '');
    }
    if (els.formBitrixUr) {
      els.formBitrixUr.value = '';
      updateBitrixDisplay('ur', '');
    }
    syncBitrixFieldsVisibility();
    setAudienceFormError(false);
  }
  function handleFormSubmit(_x3) {
    return _handleFormSubmit.apply(this, arguments);
  }
  function _handleFormSubmit() {
    _handleFormSubmit = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(event) {
      var _els$formBitrixFl, _els$formBitrixFl2, _els$formBitrixUr, _els$formBitrixUr2, _els$formBitrixFl3, _els$formBitrixUr3, _els$formBitrixCatalo;
      var audience, bitrixFormFl, bitrixFormUr, existingIndex, existingLeadId, payload, normalized, isNew, bitrixSyncNote, needsBitrixLead, bitrixResult, courseIndex, errorText, baseMessage, _t3;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            event.preventDefault();
            if (validateAudienceForm()) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2);
          case 1:
            audience = readAudienceFromForm();
            bitrixFormFl = api.normalizeBitrixForm ? api.normalizeBitrixForm((_els$formBitrixFl = els.formBitrixFl) === null || _els$formBitrixFl === void 0 ? void 0 : _els$formBitrixFl.value) : api.parseBitrixFormRef ? api.parseBitrixFormRef((_els$formBitrixFl2 = els.formBitrixFl) === null || _els$formBitrixFl2 === void 0 ? void 0 : _els$formBitrixFl2.value) : null;
            bitrixFormUr = api.normalizeBitrixForm ? api.normalizeBitrixForm((_els$formBitrixUr = els.formBitrixUr) === null || _els$formBitrixUr === void 0 ? void 0 : _els$formBitrixUr.value) : api.parseBitrixFormRef ? api.parseBitrixFormRef((_els$formBitrixUr2 = els.formBitrixUr) === null || _els$formBitrixUr2 === void 0 ? void 0 : _els$formBitrixUr2.value) : null;
            if (!((_els$formBitrixFl3 = els.formBitrixFl) !== null && _els$formBitrixFl3 !== void 0 && (_els$formBitrixFl3 = _els$formBitrixFl3.value) !== null && _els$formBitrixFl3 !== void 0 && _els$formBitrixFl3.trim() && !bitrixFormFl)) {
              _context4.n = 2;
              break;
            }
            window.alert('Не удалось распознать Bitrix24-форму для физ. лиц. Укажите формат: 1048 / 6zzb7x');
            return _context4.a(2);
          case 2:
            if (!((_els$formBitrixUr3 = els.formBitrixUr) !== null && _els$formBitrixUr3 !== void 0 && (_els$formBitrixUr3 = _els$formBitrixUr3.value) !== null && _els$formBitrixUr3 !== void 0 && _els$formBitrixUr3.trim() && !bitrixFormUr)) {
              _context4.n = 3;
              break;
            }
            window.alert('Не удалось распознать Bitrix24-форму для юр. лиц. Укажите формат: ID / sec');
            return _context4.a(2);
          case 3:
            if (!api.enrichBitrixFormRef) {
              _context4.n = 7;
              break;
            }
            if (!bitrixFormFl) {
              _context4.n = 5;
              break;
            }
            _context4.n = 4;
            return api.enrichBitrixFormRef(bitrixFormFl);
          case 4:
            bitrixFormFl = _context4.v;
          case 5:
            if (!bitrixFormUr) {
              _context4.n = 7;
              break;
            }
            _context4.n = 6;
            return api.enrichBitrixFormRef(bitrixFormUr);
          case 6:
            bitrixFormUr = _context4.v;
          case 7:
            existingIndex = courses.findIndex(function (course) {
              return course.id === (els.formId.value || '');
            });
            existingLeadId = existingIndex >= 0 ? courses[existingIndex].bitrixLeadId : null;
            payload = {
              id: els.formId.value || (api.createCourseId ? api.createCourseId() : "course_".concat(Date.now())),
              title: els.formTitle.value.trim(),
              format: els.formFormat.value === 'dist' ? 'dist' : 'och',
              dateFrom: els.formDateFrom.value,
              durationDays: Math.max(1, parseInt(els.formDurationDays.value, 10) || 1),
              description: els.formDescription.innerHTML,
              price: els.formPrice.value.trim(),
              bitrixCourseElementId: (_els$formBitrixCatalo = els.formBitrixCatalogId) !== null && _els$formBitrixCatalo !== void 0 && _els$formBitrixCatalo.value ? parseInt(els.formBitrixCatalogId.value, 10) || null : null,
              forIndividuals: audience.forIndividuals,
              forLegalEntities: audience.forLegalEntities,
              forCustomers: audience.forCustomers,
              forSuppliers: audience.forSuppliers,
              is44fz: audience.is44fz,
              is223fz: audience.is223fz,
              bitrixFormFl: bitrixFormFl,
              bitrixFormUr: bitrixFormUr,
              bitrixLeadId: existingLeadId || null,
              speakers: [],
              options: audience.options,
              active: true
            };
            normalized = api.normalizeCourseRegistryItem ? api.normalizeCourseRegistryItem(payload, courses.length) : payload;
            isNew = existingIndex < 0;
            bitrixSyncNote = '';
            if (existingIndex >= 0) {
              courses[existingIndex] = _objectSpread(_objectSpread({}, courses[existingIndex]), normalized);
            } else {
              courses.push(normalized);
            }
            courses = normalizeCourses(courses);
            needsBitrixLead = isNew || !normalized.bitrixLeadId;
            if (!needsBitrixLead) {
              _context4.n = 11;
              break;
            }
            _context4.p = 8;
            _context4.n = 9;
            return syncCourseLeadToBitrix(normalized);
          case 9:
            bitrixResult = _context4.v;
            courseIndex = courses.findIndex(function (course) {
              return course.id === normalized.id;
            });
            if (courseIndex >= 0) {
              courses[courseIndex].bitrixLeadId = bitrixResult.leadId;
              if (bitrixResult.catalogElementId) {
                courses[courseIndex].bitrixCourseElementId = bitrixResult.catalogElementId;
              }
            }
            bitrixSyncNote = ", \u043B\u0438\u0434 Bitrix24 #".concat(bitrixResult.leadId);
            if (bitrixResult.catalogElementId) {
              bitrixSyncNote += ", \u043A\u0430\u0442\u0430\u043B\u043E\u0433 #".concat(bitrixResult.catalogElementId);
            }
            if (bitrixResult.catalogWarning) {
              window.alert("\u041A\u0443\u0440\u0441 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D, \u043B\u0438\u0434 Bitrix24 \u0441\u043E\u0437\u0434\u0430\u043D (#".concat(bitrixResult.leadId, "), \u043D\u043E \u0432 \u043A\u0430\u0442\u0430\u043B\u043E\u0433 \u043A\u0443\u0440\u0441\u043E\u0432 Bitrix24 \u043D\u0435 \u043F\u043E\u043F\u0430\u043B: ").concat(bitrixResult.catalogWarning, ". ") + 'Добавьте курс вручную в товарный каталог Bitrix24 (iblock 24) и укажите ID в поле «ID курса в каталоге Bitrix24», либо проверьте права webhook на catalog.product.add.');
            }
            _context4.n = 11;
            break;
          case 10:
            _context4.p = 10;
            _t3 = _context4.v;
            console.error('Bitrix lead sync failed', _t3);
            errorText = _t3.message || 'неизвестная ошибка';
            window.alert("\u041A\u0443\u0440\u0441 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u043D\u0430 \u0441\u0430\u0439\u0442\u0435, \u043D\u043E \u043B\u0438\u0434 \u0432 Bitrix24 \u043D\u0435 \u0441\u043E\u0437\u0434\u0430\u043D: ".concat(errorText));
            bitrixSyncNote = ', лид Bitrix24 не создан';
          case 11:
            closeModal();
            renderTable();
            baseMessage = existingIndex >= 0 ? 'Курс обновлён' : 'Курс добавлен';
            _context4.n = 12;
            return persistPageData("".concat(baseMessage).concat(bitrixSyncNote));
          case 12:
            return _context4.a(2);
        }
      }, _callee4, null, [[8, 10]]);
    }));
    return _handleFormSubmit.apply(this, arguments);
  }
  function deleteCourse(_x4) {
    return _deleteCourse.apply(this, arguments);
  }
  function _deleteCourse() {
    _deleteCourse = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(courseId) {
      var course, title;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            course = courses.find(function (item) {
              return item.id === courseId;
            });
            title = (course === null || course === void 0 ? void 0 : course.title) || 'курс';
            if (window.confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \xAB".concat(title, "\xBB?"))) {
              _context5.n = 1;
              break;
            }
            return _context5.a(2);
          case 1:
            courses = courses.filter(function (item) {
              return item.id !== courseId;
            });
            renderTable();
            _context5.n = 2;
            return persistPageData('Курс удалён');
          case 2:
            return _context5.a(2);
        }
      }, _callee5);
    }));
    return _deleteCourse.apply(this, arguments);
  }
  function updateWysiwygToolbarState() {
    els.wysiwygBtns.forEach(function (btn) {
      var command = btn.getAttribute('data-command');
      if (document.queryCommandState(command)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  function updateBitrixDisplay(type, ref) {
    var valueEl = $("courseFormBitrix".concat(type === 'fl' ? 'Fl' : 'Ur', "Value"));
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
    var _$, _$2, _$3, _$4;
    var modal = $('bitrixPasteModal');
    var textarea = $('bitrixPasteInput');
    var preview = $('bitrixPastePreview');
    var result = $('bitrixPasteResult');
    var errorEl = $('bitrixPasteError');
    var subtitle = $('bitrixPasteModalSubtitle');
    if (!modal || !textarea) return;
    var currentType = 'fl'; // 'fl' or 'ur'
    var parsedRef = null;
    function parseInput() {
      var val = textarea.value;
      if (!val.trim()) {
        preview.hidden = true;
        errorEl.hidden = true;
        parsedRef = null;
        return;
      }
      parsedRef = api.parseBitrixFormRef ? api.parseBitrixFormRef(val) : null;
      if (parsedRef) {
        var formatted = api.formatBitrixFormRef ? api.formatBitrixFormRef(parsedRef) : "".concat(parsedRef.id, " / ").concat(parsedRef.sec);
        result.textContent = formatted;
        preview.hidden = false;
        errorEl.hidden = true;
        if (api.fetchBitrixFormMeta) {
          api.fetchBitrixFormMeta(parsedRef.id).then(function (meta) {
            if (!meta || textarea.value !== val) return;
            if (meta.captchaEnabled) {
              result.textContent = "".concat(formatted, " \u2014 \u043A\u0430\u043F\u0447\u0430 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0430 (\u043D\u0430 \u0441\u0430\u0439\u0442\u0435 \u043E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u0444\u043E\u0440\u043C\u0430 Bitrix24)");
            } else if (meta.title) {
              result.textContent = "".concat(formatted, " \u2014 ").concat(meta.title);
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
      var hiddenInput = $("courseFormBitrix".concat(type === 'fl' ? 'Fl' : 'Ur'));
      var existingVal = (hiddenInput === null || hiddenInput === void 0 ? void 0 : hiddenInput.value) || '';
      textarea.value = existingVal;
      subtitle.textContent = type === 'fl' ? 'Физические лица' : 'Юридические лица';
      preview.hidden = true;
      errorEl.hidden = true;
      if (existingVal) parseInput();
      modal.style.display = 'flex';
      setTimeout(function () {
        return textarea.focus();
      }, 50);
    }
    function closePasteModal() {
      modal.style.display = 'none';
      textarea.value = '';
      preview.hidden = true;
      errorEl.hidden = true;
      parsedRef = null;
    }
    function savePasteModal() {
      var val = textarea.value.trim();
      if (!val) {
        var _hiddenInput = $("courseFormBitrix".concat(currentType === 'fl' ? 'Fl' : 'Ur'));
        if (_hiddenInput) _hiddenInput.value = '';
        updateBitrixDisplay(currentType, '');
        closePasteModal();
        return;
      }
      var ref = parsedRef || (api.parseBitrixFormRef ? api.parseBitrixFormRef(val) : null);
      if (!(ref !== null && ref !== void 0 && ref.id) || !(ref !== null && ref !== void 0 && ref.sec)) {
        errorEl.hidden = false;
        preview.hidden = true;
        return;
      }
      var formatted = api.formatBitrixFormRef ? api.formatBitrixFormRef(ref) : "".concat(ref.id, " / ").concat(ref.sec);
      var hiddenInput = $("courseFormBitrix".concat(currentType === 'fl' ? 'Fl' : 'Ur'));
      if (hiddenInput) hiddenInput.value = formatted;
      updateBitrixDisplay(currentType, formatted);
      closePasteModal();
    }
    textarea.addEventListener('input', parseInput);
    textarea.addEventListener('paste', function () {
      return setTimeout(parseInput, 0);
    });
    (_$ = $('bitrixPasteModalClose')) === null || _$ === void 0 || _$.addEventListener('click', closePasteModal);
    (_$2 = $('bitrixPasteCancel')) === null || _$2 === void 0 || _$2.addEventListener('click', closePasteModal);
    (_$3 = $('bitrixPasteSave')) === null || _$3 === void 0 || _$3.addEventListener('click', savePasteModal);
    (_$4 = $('bitrixPasteClear')) === null || _$4 === void 0 || _$4.addEventListener('click', function () {
      var hiddenInput = $("courseFormBitrix".concat(currentType === 'fl' ? 'Fl' : 'Ur'));
      if (hiddenInput) hiddenInput.value = '';
      updateBitrixDisplay(currentType, '');
      closePasteModal();
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closePasteModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.style.display !== 'none') closePasteModal();
    });
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-bitrix-open]');
      if (!btn) return;
      openPasteModal(btn.getAttribute('data-bitrix-open'));
    });
  }
  function handleBitrixInputBlur(input) {
    // no-op: kept for compatibility, parsing now handled in paste modal
  }
  function bindEvents() {
    var _$5, _$6, _$7, _els$wysiwygBtns, _els$formDescription, _els$formDescription2, _els$form, _els$formForIndividua2, _els$formForLegalEnti2, _els$tableBody, _els$modal;
    (_$5 = $('btnAddCourse')) === null || _$5 === void 0 || _$5.addEventListener('click', function () {
      return openModal(null);
    });
    (_$6 = $('courseModalClose')) === null || _$6 === void 0 || _$6.addEventListener('click', closeModal);
    (_$7 = $('courseModalCancel')) === null || _$7 === void 0 || _$7.addEventListener('click', closeModal);
    (_els$wysiwygBtns = els.wysiwygBtns) === null || _els$wysiwygBtns === void 0 || _els$wysiwygBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var command = btn.getAttribute('data-command');
        document.execCommand(command, false, null);
        els.formDescription.focus();
        updateWysiwygToolbarState();
      });
    });
    var wysiwygFontSize = $('wysiwygFontSize');
    var wysiwygColor = $('wysiwygColor');
    if (wysiwygFontSize) {
      wysiwygFontSize.addEventListener('change', function (e) {
        document.execCommand('fontSize', false, e.target.value);
        els.formDescription.focus();
      });
    }
    if (wysiwygColor) {
      wysiwygColor.addEventListener('input', function (e) {
        document.execCommand('foreColor', false, e.target.value);
        els.formDescription.focus();
      });
    }
    (_els$formDescription = els.formDescription) === null || _els$formDescription === void 0 || _els$formDescription.addEventListener('keyup', updateWysiwygToolbarState);
    (_els$formDescription2 = els.formDescription) === null || _els$formDescription2 === void 0 || _els$formDescription2.addEventListener('mouseup', updateWysiwygToolbarState);
    (_els$form = els.form) === null || _els$form === void 0 || _els$form.addEventListener('submit', handleFormSubmit);
    (_els$formForIndividua2 = els.formForIndividuals) === null || _els$formForIndividua2 === void 0 || _els$formForIndividua2.addEventListener('change', function () {
      syncBitrixFieldsVisibility();
      if (readAudienceFromForm().forIndividuals || readAudienceFromForm().forLegalEntities) {
        setAudienceFormError(false);
      }
    });
    (_els$formForLegalEnti2 = els.formForLegalEntities) === null || _els$formForLegalEnti2 === void 0 || _els$formForLegalEnti2.addEventListener('change', function () {
      syncBitrixFieldsVisibility();
      if (readAudienceFromForm().forIndividuals || readAudienceFromForm().forLegalEntities) {
        setAudienceFormError(false);
      }
    });
    bindBitrixPasteModal();
    (_els$tableBody = els.tableBody) === null || _els$tableBody === void 0 || _els$tableBody.addEventListener('click', function (event) {
      var button = event.target.closest('[data-action]');
      if (!button) return;
      var courseId = button.getAttribute('data-id');
      if (!courseId) return;
      if (button.dataset.action === 'edit') {
        var course = courses.find(function (item) {
          return item.id === courseId;
        });
        if (course) openModal(course);
      }
      if (button.dataset.action === 'delete') {
        deleteCourse(courseId);
      }
    });
    (_els$modal = els.modal) === null || _els$modal === void 0 || _els$modal.addEventListener('click', function (event) {
      if (event.target === els.modal) closeModal();
    });
  }
  function checkAuth() {
    return _checkAuth.apply(this, arguments);
  }
  function _checkAuth() {
    _checkAuth = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
      var _$8;
      var authModal, authEmail, authPassword, authError, response, data, _t5;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            authModal = $('authModal');
            authEmail = $('authEmail');
            authPassword = $('authPassword');
            authError = $('authError');
            _context7.p = 1;
            _context7.n = 2;
            return fetch('api/auth.php?action=check', {
              credentials: 'same-origin'
            });
          case 2:
            response = _context7.v;
            _context7.n = 3;
            return response.json();
          case 3:
            data = _context7.v;
            if (!data.authenticated) {
              _context7.n = 5;
              break;
            }
            authModal.style.display = 'none';
            $('coursesPageRoot').hidden = false;
            _context7.n = 4;
            return loadPageData();
          case 4:
            renderTable();
            return _context7.a(2);
          case 5:
            _context7.n = 7;
            break;
          case 6:
            _context7.p = 6;
            _t5 = _context7.v;
            console.warn('Auth check failed', _t5);
          case 7:
            authModal.style.display = 'flex';
            authModal.style.opacity = '1';
            (_$8 = $('btnAuthLogin')) === null || _$8 === void 0 || _$8.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
              var email, password, _response, _data, _t4;
              return _regenerator().w(function (_context6) {
                while (1) switch (_context6.p = _context6.n) {
                  case 0:
                    email = authEmail.value.trim();
                    password = authPassword.value;
                    _context6.p = 1;
                    _context6.n = 2;
                    return fetch('api/auth.php?action=login', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      credentials: 'same-origin',
                      body: JSON.stringify({
                        email: email,
                        password: password
                      })
                    });
                  case 2:
                    _response = _context6.v;
                    _context6.n = 3;
                    return _response.json();
                  case 3:
                    _data = _context6.v;
                    if (!(_response.ok && _data.success)) {
                      _context6.n = 5;
                      break;
                    }
                    authError.style.display = 'none';
                    _context6.n = 4;
                    return checkAuth();
                  case 4:
                    _context6.n = 6;
                    break;
                  case 5:
                    authError.style.display = 'block';
                    authError.textContent = _data.error || 'Неверный e-mail или пароль';
                  case 6:
                    _context6.n = 8;
                    break;
                  case 7:
                    _context6.p = 7;
                    _t4 = _context6.v;
                    authError.style.display = 'block';
                    authError.textContent = 'Ошибка соединения с сервером';
                  case 8:
                    return _context6.a(2);
                }
              }, _callee6, null, [[1, 7]]);
            })));
          case 8:
            return _context7.a(2);
        }
      }, _callee7, null, [[1, 6]]);
    }));
    return _checkAuth.apply(this, arguments);
  }
  function initThemeToggle() {
    var toggle = $('theme-toggle-admin');
    if (!toggle) return;
    var iconSun = document.querySelector('.icon-sun');
    var iconMoon = document.querySelector('.icon-moon');
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
    var saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      updateIcons(true);
    } else {
      document.documentElement.removeAttribute('data-theme');
      updateIcons(false);
    }
    toggle.addEventListener('click', function () {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
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