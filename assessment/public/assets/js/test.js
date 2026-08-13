(function () {
  const STORAGE_KEY = 'asmt_attempt_buffer';
  let attemptId = null;
  let expiresAt = null;
  let questions = [];
  let index = 0;
  let answers = {};
  let timerId = null;

  const els = {
    timer: document.getElementById('timerDisplay'),
    progress: document.getElementById('progressLabel'),
    text: document.getElementById('questionText'),
    options: document.getElementById('optionsList'),
    nav: document.getElementById('navGrid'),
    status: document.getElementById('testStatus'),
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    btnFinish: document.getElementById('btnFinish'),
  };

  function showStatus(msg, type) {
    els.status.textContent = msg || '';
    els.status.className = msg ? ('status status--' + (type || 'info')) : 'status';
  }

  function saveBuffer() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ attemptId, answers, savedAt: Date.now() }));
    } catch (_e) { /* ignore */ }
  }

  function loadBuffer(id) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data && data.attemptId === id && data.answers) {
        answers = Object.assign({}, data.answers, answers);
      }
    } catch (_e) { /* ignore */ }
  }

  function clearBuffer() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function remainingSeconds() {
    if (!expiresAt) return 0;
    return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function tick() {
    const left = remainingSeconds();
    els.timer.textContent = formatTime(left);
    els.timer.classList.toggle('is-warn', left <= 600 && left > 120);
    els.timer.classList.toggle('is-danger', left <= 120);
    if (left <= 0) {
      clearInterval(timerId);
      finish(true);
    }
  }

  function renderNav() {
    els.nav.innerHTML = questions.map((q, i) => {
      const answered = answers[q.questionId];
      const cls = ['nav-dot'];
      if (i === index) cls.push('is-current');
      if (answered) cls.push('is-answered');
      return `<button type="button" class="${cls.join(' ')}" data-i="${i}">${i + 1}</button>`;
    }).join('');
  }

  function renderQuestion() {
    const q = questions[index];
    if (!q) return;
    els.progress.textContent = `Вопрос ${index + 1} из ${questions.length}`;
    els.text.textContent = q.text;
    const chosen = answers[q.questionId] || q.chosen || '';

    const cyrLetters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З'];
    const letterWeights = { 'А': 1, 'Б': 2, 'В': 3, 'Г': 4, 'Д': 5, 'Е': 6, 'Ж': 7, 'З': 8, 'A': 1, 'B': 2, 'C': 3, 'D': 4 };

    const sortedOpts = (q.options || []).slice().sort((a, b) => {
      const wa = letterWeights[a.letter] || 99;
      const wb = letterWeights[b.letter] || 99;
      return wa - wb;
    });

    els.options.innerHTML = sortedOpts.map((opt, i) => {
      const displayLetter = cyrLetters[i] || opt.letter;
      const selected = chosen === opt.letter ? ' is-selected' : '';
      return `<button type="button" class="option-card${selected}" data-letter="${opt.letter}">
        <span class="option-card__letter">${displayLetter}</span>
        <span>${opt.text}</span>
      </button>`;
    }).join('');

    els.options.querySelectorAll('[data-letter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        choose(btn.dataset.letter);
      });
    });

    els.btnPrev.disabled = index === 0;
    els.btnNext.textContent = index === questions.length - 1 ? 'К итогам' : 'Далее';
    renderNav();
  }

  async function choose(letter) {
    const q = questions[index];
    answers[q.questionId] = letter;
    q.chosen = letter;
    saveBuffer();
    renderQuestion();
    try {
      await AsmtApi.post('api/attempt-answer.php', {
        attemptId,
        questionId: q.questionId,
        letter,
      });
    } catch (err) {
      if (err.payload && err.payload.expired) {
        finish(true);
        return;
      }
      showStatus('Ответ сохранён локально. Сеть: ' + err.message, 'info');
    }
  }

  async function finish(auto) {
    if (finish.busy) return;
    finish.busy = true;
    clearInterval(timerId);
    showStatus(auto ? 'Время истекло, завершаем тест…' : 'Завершение теста…', 'info');
    try {
      const data = await AsmtApi.post('api/attempt-finish.php', { attemptId, answers });
      clearBuffer();
      try {
        sessionStorage.setItem('asmt_last_result', JSON.stringify({
          attemptId,
          result: data.result || {},
          at: Date.now(),
        }));
      } catch (_e) { /* ignore */ }
      window.location.href = 'complete.html?attemptId=' + attemptId;
    } catch (err) {
      finish.busy = false;
      showStatus(err.message, 'error');
    }
  }

  function finishBeacon() {
    if (!attemptId || finish.busy) return;
    finish.busy = true;
    clearInterval(timerId);
    try {
      const body = JSON.stringify({ attemptId, answers });
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon('api/attempt-finish.php', blob);
      } else {
        fetch('api/attempt-finish.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body,
          credentials: 'same-origin',
          keepalive: true,
        });
      }
      clearBuffer();
    } catch (_e) { /* ignore */ }
  }

  async function init() {
    try {
      const me = await AsmtApi.get('api/auth.php?action=me');
      if (!me.authenticated) {
        window.location.href = 'login.html';
        return;
      }
      showStatus('Подготовка билета…', 'info');
      const data = await AsmtApi.post('api/attempt-start.php', {});
      attemptId = data.attemptId;
      expiresAt = data.expiresAt;
      questions = data.questions || [];
      questions.forEach((q) => {
        if (q.chosen) answers[q.questionId] = q.chosen;
      });
      loadBuffer(attemptId);
      showStatus('');
      renderQuestion();
      tick();
      timerId = setInterval(tick, 1000);
    } catch (err) {
      if (err.status === 401) {
        window.location.href = 'login.html';
        return;
      }
      showStatus(err.message, 'error');
    }
  }

  els.options.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-letter]');
    if (!btn) return;
    choose(btn.getAttribute('data-letter'));
  });
  els.nav.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    index = Number(btn.getAttribute('data-i'));
    renderQuestion();
  });
  els.btnPrev.addEventListener('click', () => {
    if (index > 0) { index -= 1; renderQuestion(); }
  });
  els.btnNext.addEventListener('click', () => {
    if (index < questions.length - 1) { index += 1; renderQuestion(); }
    else finish(false);
  });
  els.btnFinish.addEventListener('click', () => {
    const unanswered = questions.filter((q) => !answers[q.questionId]).length;
    const msg = unanswered
      ? `Не отвечено: ${unanswered}. Завершить тест?`
      : 'Завершить тестирование?';
    if (window.confirm(msg)) finish(false);
  });

  window.addEventListener('online', () => {
    // retry flush current answers
    Object.keys(answers).forEach(async (qid) => {
      try {
        await AsmtApi.post('api/attempt-answer.php', {
          attemptId,
          questionId: Number(qid),
          letter: answers[qid],
        });
      } catch (_e) { /* ignore */ }
    });
  });

  window.addEventListener('pagehide', finishBeacon);
  window.addEventListener('beforeunload', finishBeacon);

  init();
})();
