(function () {
  const MAX_PRICES = 10;
  const MIN_PRICES = 2;
  const pricesContainer = document.getElementById('support-calc-prices');
  const addBtn = document.getElementById('support-calc-add');
  const runBtn = document.getElementById('support-calc-run');
  const resetBtn = document.getElementById('support-calc-reset');
  const resultX = document.getElementById('support-calc-result-x');
  const resultD = document.getElementById('support-calc-result-d');
  const resultV = document.getElementById('support-calc-result-v');
  const resultNote = document.getElementById('support-calc-result-note');
  const recommendationEl = document.getElementById('support-calc-recommendation');

  if (!pricesContainer || !addBtn) return;

  const RECOMMENDATIONS = {
    optimal: 'Средняя цена оптимальна для определения начальной (максимальной) цены контракта.',
    notRecommended:
      'Средняя цена не рекомендована для определения начальной (максимальной) цены контракта, требуется дополнительное изучение рынка и характеристик предмета закупок.',
    cannotUse:
      'Средняя цена не может быть использована для определения начальной (максимальной) цены контракта',
  };

  const numberFormatter = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const PRICE_INPUT_ALLOWED = /[^\d\s.,]/g;

  function sanitizePriceInputValue(value) {
    return String(value ?? '').replace(PRICE_INPUT_ALLOWED, '');
  }

  function bindPriceInput(input) {
    if (!input || input.dataset.priceBound === '1') return;
    input.dataset.priceBound = '1';

    input.addEventListener('input', () => {
      const sanitized = sanitizePriceInputValue(input.value);
      if (sanitized !== input.value) {
        const pos = input.selectionStart;
        input.value = sanitized;
        if (typeof pos === 'number') {
          input.setSelectionRange(pos, pos);
        }
      }
    });

    input.addEventListener('paste', (event) => {
      event.preventDefault();
      const pasted = sanitizePriceInputValue(event.clipboardData?.getData('text') || '');
      if (!pasted) return;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      input.value = input.value.slice(0, start) + pasted + input.value.slice(end);
      const caret = start + pasted.length;
      input.setSelectionRange(caret, caret);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  function bindAllPriceInputs(root = pricesContainer) {
    root.querySelectorAll('.support-calculator__input').forEach(bindPriceInput);
  }

  function getPriceFields() {
    return pricesContainer.querySelectorAll('.support-calculator__price-field');
  }

  function parsePrice(value) {
    if (value == null) return NaN;
    const normalized = String(value).trim().replace(/\s/g, '').replace(',', '.');
    if (!normalized) return NaN;
    const num = Number(normalized);
    return Number.isFinite(num) && num > 0 ? num : NaN;
  }

  function collectPrices() {
    return Array.from(getPriceFields())
      .map((field) => parsePrice(field.querySelector('.support-calculator__input')?.value))
      .filter((price) => Number.isFinite(price));
  }

  function calculateStats(prices) {
    const n = prices.length;
    if (n < MIN_PRICES) return null;

    const sum = prices.reduce((acc, price) => acc + price, 0);
    const x = sum / n;
    const squaredDiffSum = prices.reduce((acc, price) => acc + (price - x) ** 2, 0);
    const delta = Math.sqrt(squaredDiffSum / (n - 1));
    const v = x === 0 ? 0 : (delta / x) * 100;

    return { x, delta, v, n };
  }

  function excludeMinMax(prices) {
    if (prices.length < 3) return prices.slice();

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    let minRemoved = false;
    let maxRemoved = false;

    return prices.filter((price) => {
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
      return { type: 'rejected', text: RECOMMENDATIONS.cannotUse };
    }
    if (v < 10) {
      return { type: 'optimal', text: RECOMMENDATIONS.optimal };
    }
    return { type: 'warning', text: RECOMMENDATIONS.notRecommended };
  }

  function calculateNmck(prices) {
    const initial = calculateStats(prices);
    if (!initial) {
      return { error: `Для расчёта нужно минимум ${MIN_PRICES} корректные цены` };
    }

    let finalStats = initial;
    let excludedOutliers = false;

    if (initial.v > 33 && prices.length >= 3) {
      const filtered = excludeMinMax(prices);
      const recalculated = calculateStats(filtered);
      if (recalculated) {
        finalStats = recalculated;
        excludedOutliers = true;
      }
    }

    return {
      ...finalStats,
      excludedOutliers,
      variability: getVariabilityLabel(finalStats.v),
      recommendation: getRecommendation(finalStats.v),
    };
  }

  function formatMoney(value) {
    return `${numberFormatter.format(value)} ₽`;
  }

  function formatNumber(value) {
    return numberFormatter.format(value);
  }

  function formatPercent(value) {
    return `${numberFormatter.format(value)}%`;
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
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'support-calculator__price-remove';
    btn.setAttribute('aria-label', 'Очистить поле');
    btn.textContent = '×';
    return btn;
  }

  function createPriceField(index) {
    const field = document.createElement('div');
    field.className = 'support-calculator__price-field';
    field.dataset.priceIndex = String(index);

    const label = document.createElement('label');
    label.className = 'support-calculator__label';
    label.htmlFor = `support-calc-price-${index}`;
    label.textContent = `Цена ${index}`;

    const head = document.createElement('div');
    head.className = 'support-calculator__price-head';
    head.append(label, createRemoveButton());

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'support-calculator__input';
    input.id = `support-calc-price-${index}`;
    input.placeholder = 'Введите сумму';
    input.inputMode = 'decimal';
    input.autocomplete = 'off';
    bindPriceInput(input);

    const row = document.createElement('div');
    row.className = 'support-calculator__price-row';
    row.append(input);

    field.append(head, row);
    return field;
  }

  function renumberFields() {
    getPriceFields().forEach((field, i) => {
      const index = i + 1;
      field.dataset.priceIndex = String(index);

      const label = field.querySelector('.support-calculator__label');
      const input = field.querySelector('.support-calculator__input');

      if (label) {
        label.htmlFor = `support-calc-price-${index}`;
        label.textContent = `Цена ${index}`;
      }
      if (input) input.id = `support-calc-price-${index}`;
    });
  }

  function updateRemoveButtons() {
    const canRemoveField = getPriceFields().length > MIN_PRICES;
    const label = canRemoveField ? 'Удалить цену' : 'Очистить поле';

    getPriceFields().forEach((field) => {
      const btn = field.querySelector('.support-calculator__price-remove');
      if (!btn) return;
      btn.hidden = false;
      btn.setAttribute('aria-label', label);
      btn.title = label;
    });
  }

  function updateAddButton() {
    const atLimit = getPriceFields().length >= MAX_PRICES;
    addBtn.disabled = atLimit;
  }

  function renderResultNote(result) {
    if (resultNote) {
      let noteText = 'Вариация: ' + result.variability + '.';
      if (result.excludedOutliers) {
        noteText = 'Исключены минимальное и максимальное значения (V > 33%). ' + noteText;
      }
      resultNote.textContent = noteText;
      resultNote.hidden = false;
    }

    if (recommendationEl && result.recommendation) {
      recommendationEl.textContent = result.recommendation.text;
      recommendationEl.className =
        'support-calculator__recommendation support-calculator__recommendation--' + result.recommendation.type;
      recommendationEl.hidden = false;
    }
  }

  pricesContainer.addEventListener('click', (event) => {
    const btn = event.target.closest('.support-calculator__price-remove');
    if (!btn) return;

    const field = btn.closest('.support-calculator__price-field');
    if (!field) return;

    if (getPriceFields().length > MIN_PRICES) {
      field.remove();
      renumberFields();
      updateAddButton();
      updateRemoveButtons();
      return;
    }

    const input = field.querySelector('.support-calculator__input');
    if (input) {
      input.value = '';
      input.focus();
    }
  });

  addBtn.addEventListener('click', () => {
    const count = getPriceFields().length;
    if (count >= MAX_PRICES) return;

    const field = createPriceField(count + 1);
    pricesContainer.appendChild(field);
    updateAddButton();
    updateRemoveButtons();
    field.querySelector('input')?.focus();
  });

  runBtn?.addEventListener('click', () => {
    const prices = collectPrices();
    const result = calculateNmck(prices);

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

  resetBtn?.addEventListener('click', () => {
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
