function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var MAX_PRICES = 10;
  var MIN_PRICES = 2;
  var pricesContainer = document.getElementById('support-calc-prices');
  var addBtn = document.getElementById('support-calc-add');
  var runBtn = document.getElementById('support-calc-run');
  var resetBtn = document.getElementById('support-calc-reset');
  var resultX = document.getElementById('support-calc-result-x');
  var resultD = document.getElementById('support-calc-result-d');
  var resultV = document.getElementById('support-calc-result-v');
  var resultNote = document.getElementById('support-calc-result-note');
  var recommendationEl = document.getElementById('support-calc-recommendation');
  if (!pricesContainer || !addBtn) return;
  var RECOMMENDATIONS = {
    optimal: 'Средняя цена оптимальна для определения начальной (максимальной) цены контракта.',
    notRecommended: 'Средняя цена не рекомендована для определения начальной (максимальной) цены контракта, требуется дополнительное изучение рынка и характеристик предмета закупок.',
    cannotUse: 'Средняя цена не может быть использована для определения начальной (максимальной) цены контракта'
  };
  var numberFormatter = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  var PRICE_INPUT_ALLOWED = /[^\d\s.,]/g;
  function sanitizePriceInputValue(value) {
    return String(value !== null && value !== void 0 ? value : '').replace(PRICE_INPUT_ALLOWED, '');
  }
  function bindPriceInput(input) {
    if (!input || input.dataset.priceBound === '1') return;
    input.dataset.priceBound = '1';
    input.addEventListener('input', function () {
      var sanitized = sanitizePriceInputValue(input.value);
      if (sanitized !== input.value) {
        var pos = input.selectionStart;
        input.value = sanitized;
        if (typeof pos === 'number') {
          input.setSelectionRange(pos, pos);
        }
      }
    });
    input.addEventListener('paste', function (event) {
      var _event$clipboardData, _input$selectionStart, _input$selectionEnd;
      event.preventDefault();
      var pasted = sanitizePriceInputValue(((_event$clipboardData = event.clipboardData) === null || _event$clipboardData === void 0 ? void 0 : _event$clipboardData.getData('text')) || '');
      if (!pasted) return;
      var start = (_input$selectionStart = input.selectionStart) !== null && _input$selectionStart !== void 0 ? _input$selectionStart : input.value.length;
      var end = (_input$selectionEnd = input.selectionEnd) !== null && _input$selectionEnd !== void 0 ? _input$selectionEnd : input.value.length;
      input.value = input.value.slice(0, start) + pasted + input.value.slice(end);
      var caret = start + pasted.length;
      input.setSelectionRange(caret, caret);
      input.dispatchEvent(new Event('input', {
        bubbles: true
      }));
    });
  }
  function bindAllPriceInputs() {
    var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : pricesContainer;
    root.querySelectorAll('.support-calculator__input').forEach(bindPriceInput);
  }
  function getPriceFields() {
    return pricesContainer.querySelectorAll('.support-calculator__price-field');
  }
  function parsePrice(value) {
    if (value == null) return NaN;
    var normalized = String(value).trim().replace(/\s/g, '').replace(',', '.');
    if (!normalized) return NaN;
    var num = Number(normalized);
    return Number.isFinite(num) && num > 0 ? num : NaN;
  }
  function collectPrices() {
    return Array.from(getPriceFields()).map(function (field) {
      var _field$querySelector;
      return parsePrice((_field$querySelector = field.querySelector('.support-calculator__input')) === null || _field$querySelector === void 0 ? void 0 : _field$querySelector.value);
    }).filter(function (price) {
      return Number.isFinite(price);
    });
  }
  function calculateStats(prices) {
    var n = prices.length;
    if (n < MIN_PRICES) return null;
    var sum = prices.reduce(function (acc, price) {
      return acc + price;
    }, 0);
    var x = sum / n;
    var squaredDiffSum = prices.reduce(function (acc, price) {
      return acc + Math.pow(price - x, 2);
    }, 0);
    var delta = Math.sqrt(squaredDiffSum / (n - 1));
    var v = x === 0 ? 0 : delta / x * 100;
    return {
      x: x,
      delta: delta,
      v: v,
      n: n
    };
  }
  function excludeMinMax(prices) {
    if (prices.length < 3) return prices.slice();
    var min = Math.min.apply(Math, _toConsumableArray(prices));
    var max = Math.max.apply(Math, _toConsumableArray(prices));
    var minRemoved = false;
    var maxRemoved = false;
    return prices.filter(function (price) {
      if (!minRemoved && price === min) {
        minRemoved = true;
        return false;
      }
      if (!maxRemoved && price === max) {
        maxRemoved = true;
        return false;
      }
      return true;
    });
  }
  function getVariabilityLabel(v) {
    if (v < 10) return 'незначительной';
    if (v <= 20) return 'средней';
    if (v <= 33) return 'значительной';
    return 'неоднородности информации';
  }
  function getRecommendation(v) {
    if (v > 33) {
      return {
        type: 'rejected',
        text: RECOMMENDATIONS.cannotUse
      };
    }
    if (v < 10) {
      return {
        type: 'optimal',
        text: RECOMMENDATIONS.optimal
      };
    }
    return {
      type: 'warning',
      text: RECOMMENDATIONS.notRecommended
    };
  }
  function calculateNmck(prices) {
    var initial = calculateStats(prices);
    if (!initial) {
      return {
        error: "\u0414\u043B\u044F \u0440\u0430\u0441\u0447\u0451\u0442\u0430 \u043D\u0443\u0436\u043D\u043E \u043C\u0438\u043D\u0438\u043C\u0443\u043C ".concat(MIN_PRICES, " \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0435 \u0446\u0435\u043D\u044B")
      };
    }
    var finalStats = initial;
    var excludedOutliers = false;
    if (initial.v > 33 && prices.length >= 3) {
      var filtered = excludeMinMax(prices);
      var recalculated = calculateStats(filtered);
      if (recalculated) {
        finalStats = recalculated;
        excludedOutliers = true;
      }
    }
    return _objectSpread(_objectSpread({}, finalStats), {}, {
      excludedOutliers: excludedOutliers,
      variability: getVariabilityLabel(finalStats.v),
      recommendation: getRecommendation(finalStats.v)
    });
  }
  function formatMoney(value) {
    return "".concat(numberFormatter.format(value), " \u20BD");
  }
  function formatNumber(value) {
    return numberFormatter.format(value);
  }
  function formatPercent(value) {
    return "".concat(numberFormatter.format(value), "%");
  }
  function showError(message) {
    if (resultX) resultX.textContent = message;
    if (resultD) resultD.textContent = '—';
    if (resultV) resultV.textContent = '—';
    if (resultNote) resultNote.hidden = true;
    if (recommendationEl) recommendationEl.hidden = true;
  }
  function resetResults() {
    if (resultX) resultX.textContent = 'Результат';
    if (resultD) resultD.textContent = 'Результат';
    if (resultV) resultV.textContent = 'Результат';
    if (resultNote) {
      resultNote.hidden = true;
      resultNote.textContent = '';
    }
    if (recommendationEl) {
      recommendationEl.hidden = true;
      recommendationEl.textContent = '';
      recommendationEl.className = 'support-calculator__recommendation';
    }
  }
  function createRemoveButton() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'support-calculator__price-remove';
    btn.setAttribute('aria-label', 'Очистить поле');
    btn.textContent = '×';
    return btn;
  }
  function createPriceField(index) {
    var field = document.createElement('div');
    field.className = 'support-calculator__price-field';
    field.dataset.priceIndex = String(index);
    var label = document.createElement('label');
    label.className = 'support-calculator__label';
    label.htmlFor = "support-calc-price-".concat(index);
    label.textContent = "\u0426\u0435\u043D\u0430 ".concat(index);
    var head = document.createElement('div');
    head.className = 'support-calculator__price-head';
    head.append(label, createRemoveButton());
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'support-calculator__input';
    input.id = "support-calc-price-".concat(index);
    input.placeholder = 'Введите сумму';
    input.inputMode = 'decimal';
    input.autocomplete = 'off';
    bindPriceInput(input);
    var row = document.createElement('div');
    row.className = 'support-calculator__price-row';
    row.append(input);
    field.append(head, row);
    return field;
  }
  function renumberFields() {
    getPriceFields().forEach(function (field, i) {
      var index = i + 1;
      field.dataset.priceIndex = String(index);
      var label = field.querySelector('.support-calculator__label');
      var input = field.querySelector('.support-calculator__input');
      if (label) {
        label.htmlFor = "support-calc-price-".concat(index);
        label.textContent = "\u0426\u0435\u043D\u0430 ".concat(index);
      }
      if (input) input.id = "support-calc-price-".concat(index);
    });
  }
  function updateRemoveButtons() {
    var canRemoveField = getPriceFields().length > MIN_PRICES;
    var label = canRemoveField ? 'Удалить цену' : 'Очистить поле';
    getPriceFields().forEach(function (field) {
      var btn = field.querySelector('.support-calculator__price-remove');
      if (!btn) return;
      btn.hidden = false;
      btn.setAttribute('aria-label', label);
      btn.title = label;
    });
  }
  function updateAddButton() {
    var atLimit = getPriceFields().length >= MAX_PRICES;
    addBtn.disabled = atLimit;
  }
  function renderResultNote(result) {
    if (resultNote) {
      var noteText = 'Вариация: ' + result.variability + '.';
      if (result.excludedOutliers) {
        noteText = 'Исключены минимальное и максимальное значения (V > 33%). ' + noteText;
      }
      resultNote.textContent = noteText;
      resultNote.hidden = false;
    }
    if (recommendationEl && result.recommendation) {
      recommendationEl.textContent = result.recommendation.text;
      recommendationEl.className = 'support-calculator__recommendation support-calculator__recommendation--' + result.recommendation.type;
      recommendationEl.hidden = false;
    }
  }
  pricesContainer.addEventListener('click', function (event) {
    var btn = event.target.closest('.support-calculator__price-remove');
    if (!btn) return;
    var field = btn.closest('.support-calculator__price-field');
    if (!field) return;
    if (getPriceFields().length > MIN_PRICES) {
      field.remove();
      renumberFields();
      updateAddButton();
      updateRemoveButtons();
      return;
    }
    var input = field.querySelector('.support-calculator__input');
    if (input) {
      input.value = '';
      input.focus();
    }
  });
  addBtn.addEventListener('click', function () {
    var _field$querySelector2;
    var count = getPriceFields().length;
    if (count >= MAX_PRICES) return;
    var field = createPriceField(count + 1);
    pricesContainer.appendChild(field);
    updateAddButton();
    updateRemoveButtons();
    (_field$querySelector2 = field.querySelector('input')) === null || _field$querySelector2 === void 0 || _field$querySelector2.focus();
  });
  runBtn === null || runBtn === void 0 || runBtn.addEventListener('click', function () {
    var prices = collectPrices();
    var result = calculateNmck(prices);
    if (result.error) {
      showError(result.error);
      return;
    }
    if (resultX) resultX.textContent = formatMoney(result.x);
    if (resultD) resultD.textContent = formatNumber(result.delta);
    if (resultV) resultV.textContent = formatPercent(result.v);
    renderResultNote(result);
  });
  function ensureInitialPriceFields() {
    while (getPriceFields().length < MIN_PRICES) {
      pricesContainer.appendChild(createPriceField(getPriceFields().length + 1));
    }
  }
  resetBtn === null || resetBtn === void 0 || resetBtn.addEventListener('click', function () {
    pricesContainer.innerHTML = '';
    pricesContainer.appendChild(createPriceField(1));
    pricesContainer.appendChild(createPriceField(2));
    bindAllPriceInputs();
    updateAddButton();
    updateRemoveButtons();
    resetResults();
  });
  ensureInitialPriceFields();
  bindAllPriceInputs();
  updateAddButton();
  updateRemoveButtons();
})();