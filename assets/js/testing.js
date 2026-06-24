/**
 * Логика тестирования по госзакупкам (100 вопросов, 1 час).
 */
(function () {
  // Словарь правильных ответов. Ключ — ID вопроса (1..100), значение — буква правильного ответа (в верхнем регистре).
  // Пользователь сможет легко изменить эти значения, когда получит точные правильные ответы.
  const CORRECT_ANSWERS = {
    1: 'А', 2: 'В', 3: 'Г', 4: 'В', 5: 'А', 6: 'Д', 7: 'Д', 8: 'В', 9: 'А', 10: 'Г',
    11: 'Г', 12: 'Г', 13: 'Б', 14: 'Б', 15: 'Б', 16: 'А', 17: 'А', 18: 'А', 19: 'А', 20: 'В',
    21: 'А', 22: 'А', 23: 'Б', 24: 'Г', 25: 'Б', 26: 'Г', 27: 'В', 28: 'Г', 29: 'А', 30: 'В',
    31: 'Е', 32: 'Б', 33: 'Г', 34: 'Г', 35: 'Б', 36: 'В', 37: 'Г', 38: 'Г', 39: 'Е', 40: 'Д',
    41: 'А', 42: 'А', 43: 'А', 44: 'А', 45: 'А', 46: 'В', 47: 'В', 48: 'Г', 49: 'А', 50: 'Б',
    51: 'А', 52: 'А', 53: 'А', 54: 'А', 55: 'А', 56: 'А', 57: 'А', 58: 'А', 59: 'А', 60: 'А',
    61: 'А', 62: 'А', 63: 'А', 64: 'А', 65: 'А', 66: 'А', 67: 'А', 68: 'А', 69: 'А', 70: 'А',
    71: 'А', 72: 'А', 73: 'А', 74: 'А', 75: 'А', 76: 'А', 77: 'А', 78: 'А', 79: 'А', 80: 'А',
    81: 'А', 82: 'А', 83: 'А', 84: 'А', 85: 'А', 86: 'А', 87: 'А', 88: 'А', 89: 'А', 90: 'А',
    91: 'А', 92: 'А', 93: 'А', 94: 'А', 95: 'А', 96: 'А', 97: 'А', 98: 'А', 99: 'А', 100: 'А'
  };

  const SESSION_PREFIX = 'crzrt_quiz_';
  const TIME_LIMIT = 600; // 10 минут = 600 секунд

  let questions = [];
  let currentQuestionIndex = 0;
  let answers = {}; // { questionId: chosenLetter }
  let timeLeftSeconds = TIME_LIMIT;
  let timerInterval = null;
  let isQuizActive = false;

  // DOM Elements
  const startScreen = document.getElementById('start-screen');
  const quizScreen = document.getElementById('quiz-screen');
  const resultsScreen = document.getElementById('results-screen');

  const btnStart = document.getElementById('btn-start');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnFinish = document.getElementById('btn-finish');
  const btnRestart = document.getElementById('btn-restart');
  const btnToggleReview = document.getElementById('btn-toggle-review');

  const qProgressLabel = document.getElementById('question-progress-label');
  const qIdTag = document.getElementById('question-id-tag');
  const qText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');

  const timerDisplay = document.getElementById('timer-display');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const answeredCountLabel = document.getElementById('answered-count-label');
  const questionsGridContainer = document.getElementById('questions-grid-container');

  const resTotal = document.getElementById('res-total');
  const resAnswered = document.getElementById('res-answered');
  const resCorrect = document.getElementById('res-correct');
  const resIncorrect = document.getElementById('res-incorrect');
  const resTime = document.getElementById('res-time');
  const reviewPanel = document.getElementById('review-panel');
  const reviewQuestionsContainer = document.getElementById('review-questions-container');

  function init() {
    const allQuestions = window.TEST_QUESTIONS || [];
    if (!allQuestions.length) {
      console.error('Вопросы для тестирования не найдены!');
      return;
    }

    // Восстанавливаем состояние при перезагрузке страницы, если тест активен
    const savedActive = sessionStorage.getItem(`${SESSION_PREFIX}active`);
    if (savedActive === 'true') {
      loadSessionState();
      startQuiz(true); // возобновить
    } else {
      showScreen('start');
    }

    bindEvents();
  }

  function bindEvents() {
    btnStart?.addEventListener('click', () => startQuiz(false));
    btnPrev?.addEventListener('click', showPrevQuestion);
    btnNext?.addEventListener('click', showNextQuestion);
    btnFinish?.addEventListener('click', () => confirmFinishQuiz(false));
    btnRestart?.addEventListener('click', restartQuiz);
    btnToggleReview?.addEventListener('click', toggleReviewPanel);
  }

  function showScreen(screen) {
    startScreen.style.display = screen === 'start' ? 'block' : 'none';
    quizScreen.style.display = screen === 'quiz' ? 'grid' : 'none';
    resultsScreen.style.display = screen === 'results' ? 'block' : 'none';
  }

  function startQuiz(resume = false) {
    isQuizActive = true;
    showScreen('quiz');

    if (!resume) {
      // Выбираем 20 случайных вопросов
      let allQ = [...(window.TEST_QUESTIONS || [])];
      for (let i = allQ.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQ[i], allQ[j]] = [allQ[j], allQ[i]];
      }
      questions = allQ.slice(0, 20);

      currentQuestionIndex = 0;
      answers = {};
      timeLeftSeconds = TIME_LIMIT;
      saveSessionState();
    }

    // Создаем сетку кнопок
    buildQuestionsGrid();
    
    // Отрисовываем первый/текущий вопрос
    renderCurrentQuestion();
    updateProgressBar();

    // Запускаем таймер
    startTimer();
  }

  function loadSessionState() {
    try {
      const savedQIds = sessionStorage.getItem(`${SESSION_PREFIX}question_ids`);
      if (savedQIds !== null) {
        const qIds = JSON.parse(savedQIds);
        const allQ = window.TEST_QUESTIONS || [];
        questions = qIds.map(id => allQ.find(q => q.id === id)).filter(Boolean);
      }

      const idx = sessionStorage.getItem(`${SESSION_PREFIX}current_index`);
      if (idx !== null) currentQuestionIndex = parseInt(idx, 10);

      const savedAnswers = sessionStorage.getItem(`${SESSION_PREFIX}answers`);
      if (savedAnswers !== null) answers = JSON.parse(savedAnswers);

      const savedTime = sessionStorage.getItem(`${SESSION_PREFIX}time_left`);
      if (savedTime !== null) timeLeftSeconds = parseInt(savedTime, 10);
    } catch (e) {
      console.warn('Ошибка загрузки состояния квиза', e);
    }
  }

  function saveSessionState() {
    sessionStorage.setItem(`${SESSION_PREFIX}active`, 'true');
    sessionStorage.setItem(`${SESSION_PREFIX}current_index`, currentQuestionIndex);
    sessionStorage.setItem(`${SESSION_PREFIX}answers`, JSON.stringify(answers));
    sessionStorage.setItem(`${SESSION_PREFIX}time_left`, timeLeftSeconds);
    const questionIds = questions.map(q => q.id);
    sessionStorage.setItem(`${SESSION_PREFIX}question_ids`, JSON.stringify(questionIds));
  }

  function clearSessionState() {
    sessionStorage.removeItem(`${SESSION_PREFIX}active`);
    sessionStorage.removeItem(`${SESSION_PREFIX}current_index`);
    sessionStorage.removeItem(`${SESSION_PREFIX}answers`);
    sessionStorage.removeItem(`${SESSION_PREFIX}time_left`);
    sessionStorage.removeItem(`${SESSION_PREFIX}question_ids`);
  }

  function buildQuestionsGrid() {
    if (!questionsGridContainer) return;
    questionsGridContainer.innerHTML = '';

    for (let i = 0; i < questions.length; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'grid-btn';
      btn.textContent = String(i + 1);
      btn.id = `grid-btn-${i}`;
      btn.addEventListener('click', () => {
        currentQuestionIndex = i;
        renderCurrentQuestion();
        saveSessionState();
      });
      questionsGridContainer.appendChild(btn);
    }
    updateGridVisuals();
  }

  function updateGridVisuals() {
    for (let i = 0; i < questions.length; i++) {
      const btn = document.getElementById(`grid-btn-${i}`);
      if (!btn) continue;

      const qId = questions[i].id;
      const isAnswered = answers[qId] !== undefined;

      btn.className = 'grid-btn';
      if (i === currentQuestionIndex) {
        btn.classList.add('grid-btn--current');
      } else if (isAnswered) {
        btn.classList.add('grid-btn--answered');
      }
    }
  }

  function renderCurrentQuestion() {
    const q = questions[currentQuestionIndex];
    if (!q) return;

    if (qProgressLabel) qProgressLabel.textContent = `Вопрос ${currentQuestionIndex + 1} из ${questions.length}`;
    if (qIdTag) qIdTag.textContent = `ID: ${q.id}`;
    if (qText) qText.textContent = q.text;

    // Очистка и отрисовка вариантов ответов
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      
      q.options.forEach((opt) => {
        const div = document.createElement('div');
        const isSelected = answers[q.id] === opt.letter;
        
        div.className = `quiz-option${isSelected ? ' quiz-option--selected' : ''}`;
        div.innerHTML = `
          <div class="quiz-option__radio">
            <div class="quiz-option__radio-inner"></div>
          </div>
          <div class="quiz-option__text"><strong>${opt.letter})</strong> ${escapeHtml(opt.text)}</div>
        `;

        div.addEventListener('click', () => {
          selectOption(q.id, opt.letter);
        });

        optionsContainer.appendChild(div);
      });
    }

    // Управление кнопками навигации
    if (btnPrev) btnPrev.disabled = currentQuestionIndex === 0;
    if (btnNext) {
      if (currentQuestionIndex === questions.length - 1) {
        btnNext.disabled = true;
      } else {
        btnNext.disabled = false;
      }
    }

    updateGridVisuals();
  }

  function selectOption(qId, letter) {
    answers[qId] = letter;
    saveSessionState();
    renderCurrentQuestion();
    updateProgressBar();
  }

  function updateProgressBar() {
    const answeredCount = Object.keys(answers).length;
    const pct = (answeredCount / questions.length) * 100;
    if (progressBarFill) progressBarFill.style.width = `${pct}%`;
    if (answeredCountLabel) answeredCountLabel.textContent = `Отвечено: ${answeredCount} из ${questions.length}`;
  }

  function showPrevQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderCurrentQuestion();
      saveSessionState();
    }
  }

  function showNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      renderCurrentQuestion();
      saveSessionState();
    }
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      if (timeLeftSeconds > 0) {
        timeLeftSeconds--;
        updateTimerDisplay();
        
        // Каждые 10 секунд пишем в sessionStorage, чтобы не нагружать диск каждую секунду
        if (timeLeftSeconds % 10 === 0) {
          sessionStorage.setItem(`${SESSION_PREFIX}time_left`, timeLeftSeconds);
        }
      } else {
        clearInterval(timerInterval);
        confirmFinishQuiz(true); // таймаут
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    if (!timerDisplay) return;

    const m = Math.floor(timeLeftSeconds / 60);
    const s = timeLeftSeconds % 60;
    const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    
    timerDisplay.textContent = timeStr;

    if (timeLeftSeconds <= 300) { // менее 5 минут
      timerDisplay.classList.add('timer-widget__time--warning');
    } else {
      timerDisplay.classList.remove('timer-widget__time--warning');
    }
  }

  function confirmFinishQuiz(isTimeout = false) {
    if (!isTimeout) {
      const answeredCount = Object.keys(answers).length;
      const unansweredCount = questions.length - answeredCount;
      let msg = 'Вы уверены, что хотите завершить тестирование?';
      
      if (unansweredCount > 0) {
        msg = `У вас осталось ${unansweredCount} неотвеченных вопросов. Вы действительно хотите завершить тестирование?`;
      }

      if (!window.confirm(msg)) return;
    }

    finishQuiz(isTimeout);
  }

  function finishQuiz(isTimeout = false) {
    isQuizActive = false;
    if (timerInterval) clearInterval(timerInterval);

    // Расчёт статистики
    const totalCount = questions.length;
    const answeredCount = Object.keys(answers).length;
    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((q) => {
      const userAns = answers[q.id];
      const correctAns = CORRECT_ANSWERS[q.id];
      if (userAns !== undefined) {
        if (userAns === correctAns) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      } else {
        // не отвечен = неправильно
        incorrectCount++;
      }
    });

    const timeSpentSeconds = TIME_LIMIT - timeLeftSeconds;
    const spentMin = Math.floor(timeSpentSeconds / 60);
    const spentSec = timeSpentSeconds % 60;
    const timeSpentStr = spentMin > 0 ? `${spentMin} мин. ${spentSec} сек.` : `${spentSec} сек.`;

    // Вывод результатов на страницу
    if (resTotal) resTotal.textContent = String(totalCount);
    if (resAnswered) resAnswered.textContent = String(answeredCount);
    if (resCorrect) resCorrect.textContent = String(correctCount);
    if (resIncorrect) resIncorrect.textContent = String(incorrectCount);
    if (resTime) resTime.textContent = timeSpentStr;

    // Генерируем детальный разбор вопросов
    generateDetailedReview();

    // Переключаем экраны
    clearSessionState();
    showScreen('results');
    
    // Скрываем подробный разбор по умолчанию
    if (reviewPanel) reviewPanel.style.display = 'none';
    if (btnToggleReview) btnToggleReview.textContent = 'Показать список ответов';
  }

  function generateDetailedReview() {
    if (!reviewQuestionsContainer) return;
    reviewQuestionsContainer.innerHTML = '';

    questions.forEach((q) => {
      const userAns = answers[q.id];
      const correctAns = CORRECT_ANSWERS[q.id];
      
      let statusClass = 'review-item--incorrect';
      let badgeHtml = '<span class="review-item__badge review-item__badge--incorrect">Неверно</span>';
      
      if (userAns === undefined) {
        statusClass = 'review-item--incorrect';
        badgeHtml = '<span class="review-item__badge review-item__badge--unanswered">Нет ответа</span>';
      } else if (userAns === correctAns) {
        statusClass = 'review-item--correct';
        badgeHtml = '<span class="review-item__badge review-item__badge--correct">Правильно</span>';
      }

      const div = document.createElement('div');
      div.className = `review-item ${statusClass}`;

      let optionsHtml = '';
      q.options.forEach((opt) => {
        let optClass = 'review-option--plain';
        if (opt.letter === correctAns) {
          optClass = 'review-option--correct';
        } else if (opt.letter === userAns && userAns !== correctAns) {
          optClass = 'review-option--incorrect';
        }

        optionsHtml += `
          <div class="review-option ${optClass}">
            <strong>${opt.letter})</strong> ${escapeHtml(opt.text)}
          </div>
        `;
      });

      div.innerHTML = `
        <div class="review-item__header">
          ${badgeHtml}
          <h3 class="review-item__question">${q.id}. ${escapeHtml(q.text)}</h3>
        </div>
        <div class="review-options">
          ${optionsHtml}
        </div>
      `;

      reviewQuestionsContainer.appendChild(div);
    });
  }

  function toggleReviewPanel() {
    if (!reviewPanel) return;
    const isHidden = reviewPanel.style.display === 'none';
    
    if (isHidden) {
      reviewPanel.style.display = 'block';
      if (btnToggleReview) btnToggleReview.textContent = 'Скрыть список ответов';
      reviewPanel.scrollIntoView({ behavior: 'smooth' });
    } else {
      reviewPanel.style.display = 'none';
      if (btnToggleReview) btnToggleReview.textContent = 'Показать список ответов';
    }
  }

  function restartQuiz() {
    if (window.confirm('Вы действительно хотите пройти тест заново? Текущие результаты будут сброшены.')) {
      clearSessionState();
      showScreen('start');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  init();
})();
