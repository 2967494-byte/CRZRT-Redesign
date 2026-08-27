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
    netPill: document.getElementById('netStatusPill'),
    netText: document.getElementById('netStatusText'),
  };

  function showStatus(msg, type) {
    if (!els.status) return;
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
        answers = { ...data.answers, ...answers };
      }
    } catch (_e) { /* ignore */ }
  }

  function clearBuffer() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) { /* ignore */ }
  }

  // =========================================================================
  // CONNECTION & TELEMETRY MONITOR
  // =========================================================================
  const ConnectionMonitor = {
    pingIntervalMs: 20000,
    pingTimer: null,
    isOffline: false,
    offlineStart: null,
    hiddenStart: null,
    bufferedEvents: [],

    setNetUI(state, text) {
      if (!els.netPill || !els.netText) return;
      els.netPill.className = 'net-pill net-pill--' + state;
      els.netText.textContent = text;
    },

    start() {
      if (!attemptId) return;

      // Online / Offline events
      window.addEventListener('online', () => this.handleNetworkRestored('online_event'));
      window.addEventListener('offline', () => this.handleNetworkLost('offline_event'));

      // Visibility & Mobile lifecycle
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.hiddenStart = Date.now();
        } else if (document.visibilityState === 'visible') {
          if (this.hiddenStart) {
            const diffSec = Math.round((Date.now() - this.hiddenStart) / 1000);
            if (diffSec >= 3) {
              this.bufferedEvents.push({
                type: 'tab_hidden',
                duration_seconds: diffSec,
                timestamp: new Date().toISOString(),
                detail: `Вкладка свернута / переключение приложения (${diffSec} сек)`,
              });
            }
            this.hiddenStart = null;
          }
          // Immediate ping upon return
          this.ping();
        }
      });

      // Periodic ping
      this.pingTimer = setInterval(() => this.ping(), this.pingIntervalMs);
      this.ping();
    },

    handleNetworkLost(detail) {
      if (!this.isOffline) {
        this.isOffline = true;
        this.offlineStart = Date.now();
        this.setNetUI('offline', 'Связь прервана (ответы в памяти)');
      }
    },

    handleNetworkRestored(detail) {
      if (this.isOffline) {
        const diffSec = this.offlineStart ? Math.max(1, Math.round((Date.now() - this.offlineStart) / 1000)) : 1;
        this.bufferedEvents.push({
          type: 'network_drop',
          duration_seconds: diffSec,
          timestamp: new Date().toISOString(),
          detail: `Обрыв связи: ${diffSec} сек (${detail})`,
        });
        this.isOffline = false;
        this.offlineStart = null;
        this.setNetUI('sync', 'Синхронизация…');
      }
      this.ping();
    },

    async ping() {
      if (!attemptId) return;
      const eventsToSend = [...this.bufferedEvents];

      try {
        const res = await AsmtApi.post('api/attempt-ping.php', {
          attemptId,
          events: eventsToSend,
        });

        if (res && res.success) {
          // Clear sent events
          this.bufferedEvents = this.bufferedEvents.filter((ev) => !eventsToSend.includes(ev));
          
          if (this.isOffline) {
            this.handleNetworkRestored('ping_recovery');
          } else {
            this.setNetUI('online', 'Связь стабильна');
          }

          if (res.isFinished) {
            // Server marked attempt as finished
            clearInterval(this.pingTimer);
            location.href = `complete.html?attemptId=${attemptId}`;
          }
        }
      } catch (err) {
        this.handleNetworkLost('ping_failed');
      }
    },

    getBufferedEvents() {
      // If currently offline, close the interval
      if (this.isOffline && this.offlineStart) {
        const diffSec = Math.max(1, Math.round((Date.now() - this.offlineStart) / 1000));
        this.bufferedEvents.push({
          type: 'network_drop',
          duration_seconds: diffSec,
          timestamp: new Date().toISOString(),
          detail: `Обрыв связи при завершении: ${diffSec} сек`,
        });
      }
      return this.bufferedEvents;
    },

    stop() {
      if (this.pingTimer) clearInterval(this.pingTimer);
    }
  };

  // =========================================================================
  // CORE TEST LOGIC
  // =========================================================================
  function formatTime(totalSec) {
    const s = Math.max(0, Math.floor(totalSec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  }

  function startTimer() {
    if (!expiresAt) return;
    function tick() {
      const remaining = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
      if (els.timer) els.timer.textContent = formatTime(remaining);
      if (remaining <= 0) {
        clearInterval(timerId);
        showStatus('Время вышло! Сохраняем результаты…', 'warning');
        finishAttempt(true);
      }
    }
    tick();
    timerId = setInterval(tick, 1000);
  }

  function renderNav() {
    if (!els.nav) return;
    els.nav.innerHTML = '';
    questions.forEach((q, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const qid = q.id || q.questionId;
      const isCur = (i === index);
      const isAns = Boolean(answers[qid]);

      btn.className = 'nav-dot nav-grid__btn' +
        (isCur ? ' is-current nav-grid__btn--current' : '') +
        (isAns ? ' is-answered nav-grid__btn--answered' : '');

      btn.textContent = String(i + 1);
      btn.addEventListener('click', () => {
        index = i;
        renderQuestion();
      });
      els.nav.appendChild(btn);
    });
  }

  function renderQuestion() {
    const q = questions[index];
    if (!q) return;

    if (els.progress) els.progress.textContent = `Вопрос ${index + 1} из ${questions.length}`;
    if (els.text) els.text.textContent = q.text || '';
    if (els.btnPrev) els.btnPrev.disabled = index === 0;
    if (els.btnNext) els.btnNext.textContent = index === questions.length - 1 ? 'Завершить тест' : 'Далее →';

    const qid = q.id || q.questionId;
    const chosen = answers[qid] || null;
    const cyrMap = ['А', 'Б', 'В', 'Г', 'Д', 'Е'];

    if (els.options) {
      els.options.innerHTML = '';
      (q.options || []).forEach((opt, optIdx) => {
        const displayLetter = cyrMap[optIdx] || opt.letter;
        const isSelected = (chosen === opt.letter);

        const row = document.createElement('label');
        row.className = 'option-card quiz-option' + (isSelected ? ' is-selected quiz-option--selected' : '');
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `q_${qid}`;
        radio.value = opt.letter;
        radio.checked = isSelected;
        radio.style.position = 'absolute';
        radio.style.opacity = '0';
        radio.style.pointerEvents = 'none';

        const onSelect = () => {
          answers[qid] = opt.letter;
          saveBuffer();
          if (attemptId && qid) {
            AsmtApi.post('api/attempt-answer.php', {
              attemptId,
              questionId: qid,
              letter: opt.letter,
            }).catch(() => {});
          }
          renderQuestion();
          renderNav();
        };

        radio.addEventListener('change', onSelect);

        const letterBadge = document.createElement('span');
        letterBadge.className = 'option-card__letter quiz-option__letter';
        letterBadge.textContent = displayLetter;

        const textSpan = document.createElement('span');
        textSpan.className = 'option-card__text quiz-option__text';
        textSpan.textContent = opt.text;

        row.appendChild(radio);
        row.appendChild(letterBadge);
        row.appendChild(textSpan);

        row.addEventListener('click', (e) => {
          if (!radio.checked) {
            radio.checked = true;
            onSelect();
          }
        });

        els.options.appendChild(row);
      });
    }

    renderNav();
  }

  async function finishAttempt(isAuto = false) {
    if (!isAuto) {
      const answeredCount = Object.keys(answers).length;
      const total = questions.length;
      const unans = total - answeredCount;
      let msg = 'Вы уверены, что хотите завершить тест?';
      if (unans > 0) {
        msg = `У вас осталось ${unans} неотвеченных вопросов из ${total}. Завершить тестирование?`;
      }
      if (!confirm(msg)) return;
    }

    clearInterval(timerId);
    ConnectionMonitor.stop();
    showStatus('Сохранение результатов…', 'info');
    if (els.btnFinish) els.btnFinish.disabled = true;

    const finalTelemetry = ConnectionMonitor.getBufferedEvents();

    try {
      const res = await AsmtApi.post('api/attempt-finish.php', {
        attemptId,
        answers,
        telemetryEvents: finalTelemetry,
      });

      clearBuffer();
      try {
        sessionStorage.setItem('asmt_last_result', JSON.stringify({
          attemptId,
          result: res.result || res,
          savedAt: Date.now(),
        }));
      } catch (_e) {}

      location.href = `complete.html?attemptId=${attemptId}`;
    } catch (err) {
      showStatus('Ошибка завершения: ' + (err.message || 'Сбой сети') + '. Повторяем отправку…', 'error');
      if (els.btnFinish) els.btnFinish.disabled = false;
      setTimeout(() => finishAttempt(true), 3000);
    }
  }

  // =========================================================================
  // INIT
  // =========================================================================
  async function init() {
    try {
      const me = await AsmtApi.get('api/auth.php?action=me');
      if (!me.authenticated) {
        location.href = 'login.html';
        return;
      }

      const qParams = new URLSearchParams(location.search);
      const startBody = {};
      if (qParams.get('attemptId')) startBody.attemptId = Number(qParams.get('attemptId'));
      if (qParams.get('campaignId')) startBody.campaignId = Number(qParams.get('campaignId'));

      const res = await AsmtApi.post('api/attempt-start.php', startBody);
      if (!res || !res.success) {
        const errMsg = (res && res.error) ? res.error : 'Не удалось запустить тест';
        showStatus(errMsg, 'error');
        return;
      }

      attemptId = res.attemptId || (res.attempt && res.attempt.id);
      const rawExp = res.expiresAt || (res.attempt && res.attempt.expiresAt);
      expiresAt = rawExp ? new Date(rawExp) : null;
      questions = res.questions || [];

      if (!questions.length) {
        showStatus('В билете нет вопросов. Обратитесь к администратору.', 'error');
        return;
      }

      // Pre-fill answers from server if resuming or if existing answers were saved
      questions.forEach((q) => {
        const qid = q.id || q.questionId;
        if (q.chosen) {
          answers[qid] = q.chosen;
        }
      });

      loadBuffer(attemptId);
      startTimer();
      renderQuestion();

      // Start Connection & Heartbeat telemetry
      ConnectionMonitor.start();

      if (els.btnPrev) {
        els.btnPrev.addEventListener('click', () => {
          if (index > 0) {
            index--;
            renderQuestion();
          }
        });
      }

      if (els.btnNext) {
        els.btnNext.addEventListener('click', () => {
          if (index < questions.length - 1) {
            index++;
            renderQuestion();
          } else {
            finishAttempt(false);
          }
        });
      }

      if (els.btnFinish) {
        els.btnFinish.addEventListener('click', () => finishAttempt(false));
      }

    } catch (err) {
      showStatus(err.message || 'Ошибка загрузки теста', 'error');
    }
  }

  init();
})();
