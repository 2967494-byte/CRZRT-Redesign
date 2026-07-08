function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
* Р›РѕРіРёРєР° С‚РµСЃС‚РёСЂРѕРІР°РЅРёСЏ РїРѕ РіРѕСЃР·Р°РєСѓРїРєР°Рј (100 РІРѕРїСЂРѕСЃРѕРІ, 1 С‡Р°СЃ).
*/
(function () {
  // РџСЂР°РІРёР»СЊРЅС‹Рµ РѕС‚РІРµС‚С‹ С‚РµРїРµСЂСЊ С…СЂР°РЅСЏС‚СЃСЏ РІ СЃРІРѕР№СЃС‚РІРµ correctAnswer РєР°Р¶РґРѕРіРѕ РІРѕРїСЂРѕСЃР°

  var SESSION_PREFIX = 'crzrt_quiz_';
  var TIME_LIMIT = 600; // 10 РјРёРЅСѓС‚ = 600 СЃРµРєСѓРЅРґ

  var ALL_TEST_QUESTIONS = [];
  var questions = [];
  var currentQuestionIndex = 0;
  var answers = {}; // { questionId: chosenLetter }
  var timeLeftSeconds = TIME_LIMIT;
  var timerInterval = null;
  var isQuizActive = false;

  // DOM Elements
  var startScreen = document.getElementById('start-screen');
  var quizScreen = document.getElementById('quiz-screen');
  var resultsScreen = document.getElementById('results-screen');
  var btnStart = document.getElementById('btn-start');
  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');
  var btnFinish = document.getElementById('btn-finish');
  var btnRestart = document.getElementById('btn-restart');
  var btnToggleReview = document.getElementById('btn-toggle-review');
  var qProgressLabel = document.getElementById('question-progress-label');
  var qIdTag = document.getElementById('question-id-tag');
  var qText = document.getElementById('question-text');
  var optionsContainer = document.getElementById('options-container');
  var timerDisplay = document.getElementById('timer-display');
  var progressBarFill = document.getElementById('progress-bar-fill');
  var answeredCountLabel = document.getElementById('answered-count-label');
  var questionsGridContainer = document.getElementById('questions-grid-container');
  var resTotal = document.getElementById('res-total');
  var resAnswered = document.getElementById('res-answered');
  var resCorrect = document.getElementById('res-correct');
  var resIncorrect = document.getElementById('res-incorrect');
  var resTime = document.getElementById('res-time');
  var reviewPanel = document.getElementById('review-panel');
  var reviewQuestionsContainer = document.getElementById('review-questions-container');
  function init() {
    fetch('api/settings.php?key=crzrt_quiz_data').then(function (res) {
      return res.json();
    }).then(function (response) {
      var data = response.data || {};
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          data = {};
        }
      }
      ALL_TEST_QUESTIONS = data.quizQuestions || [];
      if (!ALL_TEST_QUESTIONS.length && window.TEST_QUESTIONS && window.TEST_QUESTIONS.length > 0) {
        var CORRECT_ANSWERS = {
          1: 'Рђ',
          2: 'Р’',
          3: 'Р“',
          4: 'Р’',
          5: 'Рђ',
          6: 'Р”',
          7: 'Р”',
          8: 'Р’',
          9: 'Рђ',
          10: 'Р“',
          11: 'Р“',
          12: 'Р“',
          13: 'Р‘',
          14: 'Р‘',
          15: 'Р‘',
          16: 'Рђ',
          17: 'Рђ',
          18: 'Рђ',
          19: 'Рђ',
          20: 'Р’'
        };
        ALL_TEST_QUESTIONS = window.TEST_QUESTIONS.map(function (q) {
          return {
            id: q.id,
            text: q.text || q.question || '',
            options: q.options || [],
            correctAnswer: CORRECT_ANSWERS[q.id] || 'Рђ'
          };
        });
      }

      // Filter out any corrupted entries just in case
      ALL_TEST_QUESTIONS = ALL_TEST_QUESTIONS.filter(function (q) {
        return q && q.text;
      });
      if (!ALL_TEST_QUESTIONS.length) {
        console.error('Р’РѕРїСЂРѕСЃС‹ РґР»СЏ С‚РµСЃС‚РёСЂРѕРІР°РЅРёСЏ РЅРµ РЅР°Р№РґРµРЅС‹!');
        alert('Р‘Р°Р·Р° РІРѕРїСЂРѕСЃРѕРІ РїСѓСЃС‚Р°. РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂСѓ РЅРµРѕР±С…РѕРґРёРјРѕ РґРѕР±Р°РІРёС‚СЊ РІРѕРїСЂРѕСЃС‹ РІ РїР°РЅРµР»Рё СѓРїСЂР°РІР»РµРЅРёСЏ.');
        return;
      }

      // Р’РѕСЃСЃС‚Р°РЅР°РІР»РёРІР°РµРј СЃРѕСЃС‚РѕСЏРЅРёРµ РїСЂРё РїРµСЂРµР·Р°РіСЂСѓР·РєРµ СЃС‚СЂР°РЅРёС†С‹, РµСЃР»Рё С‚РµСЃС‚ Р°РєС‚РёРІРµРЅ
      var savedActive = sessionStorage.getItem("".concat(SESSION_PREFIX, "active"));
      if (savedActive === 'true') {
        loadSessionState();
        startQuiz(true); // РІРѕР·РѕР±РЅРѕРІРёС‚СЊ
      } else {
        showScreen('start');
      }
      bindEvents();
    }).catch(function (e) {
      console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РґР°РЅРЅС‹С… С‚РµСЃС‚РёСЂРѕРІР°РЅРёСЏ', e);
    });
  }
  function bindEvents() {
    if (btnStart) btnStart.addEventListener('click', function () {
      return startQuiz(false);
    });
    if (btnPrev) btnPrev.addEventListener('click', showPrevQuestion);
    if (btnNext) btnNext.addEventListener('click', showNextQuestion);
    if (btnFinish) btnFinish.addEventListener('click', function () {
      return confirmFinishQuiz(false);
    });
    if (btnRestart) btnRestart.addEventListener('click', restartQuiz);
    if (btnToggleReview) btnToggleReview.addEventListener('click', toggleReviewPanel);
  }
  function showScreen(screen) {
    startScreen.style.display = screen === 'start' ? 'block' : 'none';
    quizScreen.style.display = screen === 'quiz' ? 'grid' : 'none';
    resultsScreen.style.display = screen === 'results' ? 'block' : 'none';
  }
  function startQuiz() {
    var resume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    isQuizActive = true;
    showScreen('quiz');
    if (!resume) {
      // Р’С‹Р±РёСЂР°РµРј 20 СЃР»СѓС‡Р°Р№РЅС‹С… РІРѕРїСЂРѕСЃРѕРІ
      var allQ = _toConsumableArray(ALL_TEST_QUESTIONS);
      for (var i = allQ.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var _ref = [allQ[j], allQ[i]];
        allQ[i] = _ref[0];
        allQ[j] = _ref[1];
      }
      questions = allQ.slice(0, 20);
      currentQuestionIndex = 0;
      answers = {};
      timeLeftSeconds = TIME_LIMIT;
      saveSessionState();
    }

    // РЎРѕР·РґР°РµРј СЃРµС‚РєСѓ РєРЅРѕРїРѕРє
    buildQuestionsGrid();

    // РћС‚СЂРёСЃРѕРІС‹РІР°РµРј РїРµСЂРІС‹Р№/С‚РµРєСѓС‰РёР№ РІРѕРїСЂРѕСЃ
    renderCurrentQuestion();
    updateProgressBar();

    // Р—Р°РїСѓСЃРєР°РµРј С‚Р°Р№РјРµСЂ
    startTimer();
  }
  function loadSessionState() {
    try {
      var savedQIds = sessionStorage.getItem("".concat(SESSION_PREFIX, "question_ids"));
      if (savedQIds !== null) {
        var qIds = JSON.parse(savedQIds);
        var allQ = ALL_TEST_QUESTIONS;
        questions = qIds.map(function (id) {
          return allQ.find(function (q) {
            return q.id === id;
          });
        }).filter(Boolean);
      }
      var idx = sessionStorage.getItem("".concat(SESSION_PREFIX, "current_index"));
      if (idx !== null) currentQuestionIndex = parseInt(idx, 10);
      var savedAnswers = sessionStorage.getItem("".concat(SESSION_PREFIX, "answers"));
      if (savedAnswers !== null) answers = JSON.parse(savedAnswers);
      var savedTime = sessionStorage.getItem("".concat(SESSION_PREFIX, "time_left"));
      if (savedTime !== null) timeLeftSeconds = parseInt(savedTime, 10);
    } catch (e) {
      console.warn('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё СЃРѕСЃС‚РѕСЏРЅРёСЏ РєРІРёР·Р°', e);
    }
  }
  function saveSessionState() {
    sessionStorage.setItem("".concat(SESSION_PREFIX, "active"), 'true');
    sessionStorage.setItem("".concat(SESSION_PREFIX, "current_index"), currentQuestionIndex);
    sessionStorage.setItem("".concat(SESSION_PREFIX, "answers"), JSON.stringify(answers));
    sessionStorage.setItem("".concat(SESSION_PREFIX, "time_left"), timeLeftSeconds);
    var questionIds = questions.map(function (q) {
      return q.id;
    });
    sessionStorage.setItem("".concat(SESSION_PREFIX, "question_ids"), JSON.stringify(questionIds));
  }
  function clearSessionState() {
    sessionStorage.removeItem("".concat(SESSION_PREFIX, "active"));
    sessionStorage.removeItem("".concat(SESSION_PREFIX, "current_index"));
    sessionStorage.removeItem("".concat(SESSION_PREFIX, "answers"));
    sessionStorage.removeItem("".concat(SESSION_PREFIX, "time_left"));
    sessionStorage.removeItem("".concat(SESSION_PREFIX, "question_ids"));
  }
  function buildQuestionsGrid() {
    if (!questionsGridContainer) return;
    questionsGridContainer.innerHTML = '';
    var _loop = function _loop(i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'grid-btn';
      btn.textContent = String(i + 1);
      btn.id = "grid-btn-".concat(i);
      btn.addEventListener('click', function () {
        currentQuestionIndex = i;
        renderCurrentQuestion();
        saveSessionState();
      });
      questionsGridContainer.appendChild(btn);
    };
    for (var i = 0; i < questions.length; i++) {
      _loop(i);
    }
    updateGridVisuals();
  }
  function updateGridVisuals() {
    for (var i = 0; i < questions.length; i++) {
      var btn = document.getElementById("grid-btn-".concat(i));
      if (!btn) continue;
      var qId = questions[i].id;
      var isAnswered = answers[qId] !== undefined;
      btn.className = 'grid-btn';
      if (i === currentQuestionIndex) {
        btn.classList.add('grid-btn--current');
      } else if (isAnswered) {
        btn.classList.add('grid-btn--answered');
      }
    }
  }
  function renderCurrentQuestion() {
    var q = questions[currentQuestionIndex];
    if (!q) return;
    if (qProgressLabel) qProgressLabel.textContent = "\u0420\u2019\u0420\u0455\u0420\u0457\u0421\u0402\u0420\u0455\u0421\u0403 ".concat(currentQuestionIndex + 1, " \u0420\u0451\u0420\xB7 ").concat(questions.length);
    if (qIdTag) qIdTag.textContent = "ID: ".concat(q.id);
    if (qText) qText.textContent = q.text;

    // РћС‡РёСЃС‚РєР° Рё РѕС‚СЂРёСЃРѕРІРєР° РІР°СЂРёР°РЅС‚РѕРІ РѕС‚РІРµС‚РѕРІ
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      q.options.forEach(function (opt) {
        var div = document.createElement('div');
        var isSelected = answers[q.id] === opt.letter;
        div.className = "quiz-option".concat(isSelected ? ' quiz-option--selected' : '');
        div.innerHTML = "\n          <div class=\"quiz-option__radio\">\n            <div class=\"quiz-option__radio-inner\"></div>\n          </div>\n          <div class=\"quiz-option__text\"><strong>".concat(opt.letter, ")</strong> ").concat(escapeHtml(opt.text), "</div>\n        ");
        div.addEventListener('click', function () {
          selectOption(q.id, opt.letter);
        });
        optionsContainer.appendChild(div);
      });
    }

    // РЈРїСЂР°РІР»РµРЅРёРµ РєРЅРѕРїРєР°РјРё РЅР°РІРёРіР°С†РёРё
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
    var answeredCount = Object.keys(answers).length;
    var pct = answeredCount / questions.length * 100;
    if (progressBarFill) progressBarFill.style.width = "".concat(pct, "%");
    if (answeredCountLabel) answeredCountLabel.textContent = "\u0420\u045B\u0421\u201A\u0420\u0406\u0420\xB5\u0421\u2021\u0420\xB5\u0420\u0405\u0420\u0455: ".concat(answeredCount, " \u0420\u0451\u0420\xB7 ").concat(questions.length);
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
    timerInterval = setInterval(function () {
      if (timeLeftSeconds > 0) {
        timeLeftSeconds--;
        updateTimerDisplay();

        // РљР°Р¶РґС‹Рµ 10 СЃРµРєСѓРЅРґ РїРёС€РµРј РІ sessionStorage, С‡С‚РѕР±С‹ РЅРµ РЅР°РіСЂСѓР¶Р°С‚СЊ РґРёСЃРє РєР°Р¶РґСѓСЋ СЃРµРєСѓРЅРґСѓ
        if (timeLeftSeconds % 10 === 0) {
          sessionStorage.setItem("".concat(SESSION_PREFIX, "time_left"), timeLeftSeconds);
        }
      } else {
        clearInterval(timerInterval);
        confirmFinishQuiz(true); // С‚Р°Р№РјР°СѓС‚
      }
    }, 1000);
  }
  function updateTimerDisplay() {
    if (!timerDisplay) return;
    var m = Math.floor(timeLeftSeconds / 60);
    var s = timeLeftSeconds % 60;
    var timeStr = "".concat(String(m).padStart(2, '0'), ":").concat(String(s).padStart(2, '0'));
    timerDisplay.textContent = timeStr;
    if (timeLeftSeconds <= 300) {
      // РјРµРЅРµРµ 5 РјРёРЅСѓС‚
      timerDisplay.classList.add('timer-widget__time--warning');
    } else {
      timerDisplay.classList.remove('timer-widget__time--warning');
    }
  }
  function confirmFinishQuiz() {
    var isTimeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!isTimeout) {
      var answeredCount = Object.keys(answers).length;
      var unansweredCount = questions.length - answeredCount;
      var msg = 'Р’С‹ СѓРІРµСЂРµРЅС‹, С‡С‚Рѕ С…РѕС‚РёС‚Рµ Р·Р°РІРµСЂС€РёС‚СЊ С‚РµСЃС‚РёСЂРѕРІР°РЅРёРµ?';
      if (unansweredCount > 0) {
        msg = "\u0420\u0408 \u0420\u0406\u0420\xB0\u0421\u0403 \u0420\u0455\u0421\u0403\u0421\u201A\u0420\xB0\u0420\xBB\u0420\u0455\u0421\u0403\u0421\u040A ".concat(unansweredCount, " \u0420\u0405\u0420\xB5\u0420\u0455\u0421\u201A\u0420\u0406\u0420\xB5\u0421\u2021\u0420\xB5\u0420\u0405\u0420\u0405\u0421\u2039\u0421\u2026 \u0420\u0406\u0420\u0455\u0420\u0457\u0421\u0402\u0420\u0455\u0421\u0403\u0420\u0455\u0420\u0406. \u0420\u2019\u0421\u2039 \u0420\u0491\u0420\xB5\u0420\u2116\u0421\u0403\u0421\u201A\u0420\u0406\u0420\u0451\u0421\u201A\u0420\xB5\u0420\xBB\u0421\u040A\u0420\u0405\u0420\u0455 \u0421\u2026\u0420\u0455\u0421\u201A\u0420\u0451\u0421\u201A\u0420\xB5 \u0420\xB7\u0420\xB0\u0420\u0406\u0420\xB5\u0421\u0402\u0421\u20AC\u0420\u0451\u0421\u201A\u0421\u040A \u0421\u201A\u0420\xB5\u0421\u0403\u0421\u201A\u0420\u0451\u0421\u0402\u0420\u0455\u0420\u0406\u0420\xB0\u0420\u0405\u0420\u0451\u0420\xB5?");
      }
      if (!window.confirm(msg)) return;
    }
    finishQuiz(isTimeout);
  }
  function finishQuiz() {
    var isTimeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    isQuizActive = false;
    if (timerInterval) clearInterval(timerInterval);

    // Р Р°СЃС‡С‘С‚ СЃС‚Р°С‚РёСЃС‚РёРєРё
    var totalCount = questions.length;
    var answeredCount = Object.keys(answers).length;
    var correctCount = 0;
    var incorrectCount = 0;
    questions.forEach(function (q) {
      var userAns = answers[q.id];
      var correctAns = q.correctAnswer;
      if (userAns !== undefined) {
        if (userAns === correctAns) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      } else {
        // РЅРµ РѕС‚РІРµС‡РµРЅ = РЅРµРїСЂР°РІРёР»СЊРЅРѕ
        incorrectCount++;
      }
    });
    var timeSpentSeconds = TIME_LIMIT - timeLeftSeconds;
    var spentMin = Math.floor(timeSpentSeconds / 60);
    var spentSec = timeSpentSeconds % 60;
    var timeSpentStr = spentMin > 0 ? "".concat(spentMin, " \u0420\u0458\u0420\u0451\u0420\u0405. ").concat(spentSec, " \u0421\u0403\u0420\xB5\u0420\u0454.") : "".concat(spentSec, " \u0421\u0403\u0420\xB5\u0420\u0454.");

    // Р’С‹РІРѕРґ СЂРµР·СѓР»СЊС‚Р°С‚РѕРІ РЅР° СЃС‚СЂР°РЅРёС†Сѓ
    if (resTotal) resTotal.textContent = String(totalCount);
    if (resAnswered) resAnswered.textContent = String(answeredCount);
    if (resCorrect) resCorrect.textContent = String(correctCount);
    if (resIncorrect) resIncorrect.textContent = String(incorrectCount);
    if (resTime) resTime.textContent = timeSpentStr;

    // Р“РµРЅРµСЂРёСЂСѓРµРј РґРµС‚Р°Р»СЊРЅС‹Р№ СЂР°Р·Р±РѕСЂ РІРѕРїСЂРѕСЃРѕРІ
    generateDetailedReview();

    // РџРµСЂРµРєР»СЋС‡Р°РµРј СЌРєСЂР°РЅС‹
    clearSessionState();
    showScreen('results');

    // РЎРєСЂС‹РІР°РµРј РїРѕРґСЂРѕР±РЅС‹Р№ СЂР°Р·Р±РѕСЂ РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ
    if (reviewPanel) reviewPanel.style.display = 'none';
    if (btnToggleReview) btnToggleReview.textContent = 'РџРѕРєР°Р·Р°С‚СЊ СЃРїРёСЃРѕРє РѕС‚РІРµС‚РѕРІ';
  }
  function generateDetailedReview() {
    if (!reviewQuestionsContainer) return;
    reviewQuestionsContainer.innerHTML = '';
    questions.forEach(function (q) {
      var userAns = answers[q.id];
      var correctAns = q.correctAnswer;
      var statusClass = 'review-item--incorrect';
      var badgeHtml = '<span class="review-item__badge review-item__badge--incorrect">РќРµРІРµСЂРЅРѕ</span>';
      if (userAns === undefined) {
        statusClass = 'review-item--incorrect';
        badgeHtml = '<span class="review-item__badge review-item__badge--unanswered">РќРµС‚ РѕС‚РІРµС‚Р°</span>';
      } else if (userAns === correctAns) {
        statusClass = 'review-item--correct';
        badgeHtml = '<span class="review-item__badge review-item__badge--correct">РџСЂР°РІРёР»СЊРЅРѕ</span>';
      }
      var div = document.createElement('div');
      div.className = "review-item ".concat(statusClass);
      var optionsHtml = '';
      q.options.forEach(function (opt) {
        var optClass = 'review-option--plain';
        if (opt.letter === correctAns) {
          optClass = 'review-option--correct';
        } else if (opt.letter === userAns && userAns !== correctAns) {
          optClass = 'review-option--incorrect';
        }
        optionsHtml += "\n          <div class=\"review-option ".concat(optClass, "\">\n            <strong>").concat(opt.letter, ")</strong> ").concat(escapeHtml(opt.text), "\n          </div>\n        ");
      });
      div.innerHTML = "\n        <div class=\"review-item__header\">\n          ".concat(badgeHtml, "\n          <h3 class=\"review-item__question\">").concat(q.id, ". ").concat(escapeHtml(q.text), "</h3>\n        </div>\n        <div class=\"review-options\">\n          ").concat(optionsHtml, "\n        </div>\n      ");
      reviewQuestionsContainer.appendChild(div);
    });
  }
  function toggleReviewPanel() {
    if (!reviewPanel) return;
    var isHidden = reviewPanel.style.display === 'none';
    if (isHidden) {
      reviewPanel.style.display = 'block';
      if (btnToggleReview) btnToggleReview.textContent = 'РЎРєСЂС‹С‚СЊ СЃРїРёСЃРѕРє РѕС‚РІРµС‚РѕРІ';
      reviewPanel.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      reviewPanel.style.display = 'none';
      if (btnToggleReview) btnToggleReview.textContent = 'РџРѕРєР°Р·Р°С‚СЊ СЃРїРёСЃРѕРє РѕС‚РІРµС‚РѕРІ';
    }
  }
  function restartQuiz() {
    if (window.confirm('Р’С‹ РґРµР№СЃС‚РІРёС‚РµР»СЊРЅРѕ С…РѕС‚РёС‚Рµ РїСЂРѕР№С‚Рё С‚РµСЃС‚ Р·Р°РЅРѕРІРѕ? РўРµРєСѓС‰РёРµ СЂРµР·СѓР»СЊС‚Р°С‚С‹ Р±СѓРґСѓС‚ СЃР±СЂРѕС€РµРЅС‹.')) {
      clearSessionState();
      showScreen('start');
    }
  }
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  init();
})();