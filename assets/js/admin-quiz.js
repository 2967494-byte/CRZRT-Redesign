function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
window.AdminQuiz = {
  quizQuestions: [],
  QUIZ_OPTION_LETTERS: ['А', 'Б', 'В', 'Г', 'Д', 'Е'],
  QUIZ_CORRECT_ANSWERS: {
    1: 'А',
    2: 'В',
    3: 'Г',
    4: 'В',
    5: 'А',
    6: 'Д',
    7: 'Д',
    8: 'В',
    9: 'А',
    10: 'Г',
    11: 'Г',
    12: 'Г',
    13: 'Б',
    14: 'Б',
    15: 'Б',
    16: 'А',
    17: 'А',
    18: 'А',
    19: 'А',
    20: 'В',
    21: 'А',
    22: 'А',
    23: 'Б',
    24: 'Г',
    25: 'Б',
    26: 'Г',
    27: 'В',
    28: 'Г',
    29: 'А',
    30: 'В',
    31: 'Е',
    32: 'Б',
    33: 'Г',
    34: 'Г',
    35: 'Б',
    36: 'В',
    37: 'Г',
    38: 'Г',
    39: 'Е',
    40: 'Д',
    41: 'А',
    42: 'А',
    43: 'А',
    44: 'А',
    45: 'А',
    46: 'В',
    47: 'В',
    48: 'Г',
    49: 'А',
    50: 'Б',
    51: 'А',
    52: 'А',
    53: 'А',
    54: 'А',
    55: 'А',
    56: 'А',
    57: 'А',
    58: 'А',
    59: 'А',
    60: 'А',
    61: 'А',
    62: 'А',
    63: 'А',
    64: 'А',
    65: 'А',
    66: 'А',
    67: 'А',
    68: 'А',
    69: 'А',
    70: 'А',
    71: 'А',
    72: 'А',
    73: 'А',
    74: 'А',
    75: 'А',
    76: 'А',
    77: 'А',
    78: 'А',
    79: 'А',
    80: 'А',
    81: 'А',
    82: 'А',
    83: 'А',
    84: 'А',
    85: 'А',
    86: 'А',
    87: 'А',
    88: 'А',
    89: 'А',
    90: 'А',
    91: 'А',
    92: 'А',
    93: 'А',
    94: 'А',
    95: 'А',
    96: 'А',
    97: 'А',
    98: 'А',
    99: 'А',
    100: 'А'
  },
  extractOptionText: function extractOptionText(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (_typeof(value) === 'object') {
      if (typeof value.text === 'string') return value.text;
      if (typeof value.value === 'string') return value.value;
      if (typeof value.label === 'string') return value.label;
    }
    return '';
  },
  /** Чинит буквы А–Е, сохранённые с битой кодировкой (UTF-8 как CP1252). */
  fixQuizLetter: function fixQuizLetter(letter) {
    var raw = String(letter || '').trim();
    if (!raw) return '';
    var mojibakeMap = {
      '\u0420\u0452': 'А',
      '\u0420\u2018': 'Б',
      '\u0420\u2019': 'В',
      '\u0420\u201C': 'Г',
      '\u0420\u201D': 'Д',
      '\u0420\u2022': 'Е'
    };
    if (mojibakeMap[raw]) return mojibakeMap[raw];
    var upper = raw.toUpperCase();
    if (this.QUIZ_OPTION_LETTERS.indexOf(upper) !== -1) return upper;
    return upper;
  },
  normalizeQuizOption: function normalizeQuizOption(opt, index) {
    var _ref, _opt$letter, _ref2, _opt$text;
    var letters = this.QUIZ_OPTION_LETTERS;
    var defaultLetter = letters[index] || String(index + 1);
    if (typeof opt === 'string') {
      return {
        letter: defaultLetter,
        text: opt
      };
    }
    if (!opt || _typeof(opt) !== 'object') {
      return {
        letter: defaultLetter,
        text: ''
      };
    }
    var letter = (_ref = (_opt$letter = opt.letter) !== null && _opt$letter !== void 0 ? _opt$letter : opt.label) !== null && _ref !== void 0 ? _ref : defaultLetter;
    if (typeof letter === 'number' || /^\d+$/.test(String(letter))) {
      var idx = parseInt(letter, 10);
      letter = letters[idx] || defaultLetter;
    }
    letter = this.fixQuizLetter(letter || defaultLetter) || defaultLetter;
    var text = this.extractOptionText((_ref2 = (_opt$text = opt.text) !== null && _opt$text !== void 0 ? _opt$text : opt.value) !== null && _ref2 !== void 0 ? _ref2 : opt);
    if (text === '[object Object]') text = '';
    return {
      letter: letter,
      text: text
    };
  },
  normalizeQuizQuestion: function normalizeQuizQuestion(raw, index) {
    var letters = this.QUIZ_OPTION_LETTERS;
    var id = raw && raw.id !== undefined ? raw.id : index + 1;
    var text = String(raw && raw.text ? raw.text : raw && raw.question ? raw.question : '').trim();
    var rawOptions = raw ? raw.options : undefined;
    if (rawOptions && !Array.isArray(rawOptions) && _typeof(rawOptions) === 'object') {
      rawOptions = Object.keys(rawOptions).sort(function (a, b) {
        return Number(a) - Number(b);
      }).map(function (key) {
        return rawOptions[key];
      });
    }
    if (!Array.isArray(rawOptions)) rawOptions = [];
    var options = [];
    for (var i = 0; i < 4; i++) {
      options.push(this.normalizeQuizOption(rawOptions[i], i));
    }
    var correctAnswer = this.fixQuizLetter(raw && raw.correctAnswer || '');
    if (!correctAnswer) {
      correctAnswer = this.QUIZ_CORRECT_ANSWERS[id] || letters[0];
    }
    return {
      id: id,
      text: text,
      options: options,
      correctAnswer: correctAnswer
    };
  },
  isQuizQuestionsCorrupted: function isQuizQuestionsCorrupted(questions) {
    var _this = this;
    if (!Array.isArray(questions) || questions.length === 0) return true;
    var expected = (window.TEST_QUESTIONS ? window.TEST_QUESTIONS.length : 0) || 0;
    if (expected > 0 && questions.length < expected) return true;
    var sample = questions.slice(0, 3);
    return sample.some(function (q) {
      if (!q || typeof q.text !== 'string' || !q.text.trim()) return true;
      if (!Array.isArray(q.options) || q.options.length === 0) return true;
      return q.options.some(function (opt) {
        var _opt$text2;
        if (opt == null) return true;
        if (typeof opt === 'string') return false;
        var text = _this.extractOptionText((_opt$text2 = opt.text) !== null && _opt$text2 !== void 0 ? _opt$text2 : opt);
        return !text || text === '[object Object]' || _typeof(opt.text) === 'object';
      });
    });
  },
  importDefaultQuizQuestions: function importDefaultQuizQuestions() {
    var _this2 = this;
    if (!window.TEST_QUESTIONS || !window.TEST_QUESTIONS.length) return [];
    return window.TEST_QUESTIONS.map(function (q, index) {
      var normalized = _this2.normalizeQuizQuestion(q, index);
      normalized.correctAnswer = _this2.QUIZ_CORRECT_ANSWERS[normalized.id] || normalized.correctAnswer || 'А';
      return normalized;
    });
  },
  migrateQuizPageData: function migrateQuizPageData(data) {
    var _this3 = this;
    var migrated = data || {};
    var questions = Array.isArray(migrated.quizQuestions) ? migrated.quizQuestions : [];
    var shouldImportDefaults = this.isQuizQuestionsCorrupted(questions) && window.TEST_QUESTIONS && window.TEST_QUESTIONS.length > 0;
    if (shouldImportDefaults) {
      questions = this.importDefaultQuizQuestions();
    } else {
      questions = questions.map(function (q, index) {
        return _this3.normalizeQuizQuestion(q, index);
      }).filter(function (q) {
        return q.text;
      });
    }
    migrated.quizQuestions = questions;
    this.quizQuestions = questions;
    return migrated;
  },
  renderQuizPageAdmin: function renderQuizPageAdmin() {
    var _this4 = this;
    var container = document.getElementById('testingQuestionsAdminContainer');
    if (!container) return;
    var html = "\n            <div style=\"margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;\">\n                <h4 style=\"margin: 0; font-size: 1.1rem;\">\u0412\u0441\u0435\u0433\u043e \u0432\u043e\u043f\u0440\u043e\u0441\u043e\u0432: <span id=\"quizQuestionsCount\">".concat(this.quizQuestions.length, "</span></h4>\n                <button type=\"button\" class=\"btn-secondary\" onclick=\"AdminQuiz.addQuizQuestion()\">+ \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432\u043e\u043f\u0440\u043e\u0441</button>\n            </div>\n            <div id=\"quizQuestionsList\" style=\"display: flex; flex-direction: column; gap: 20px;\"></div>\n        ");
    container.innerHTML = html;
    var listContainer = document.getElementById('quizQuestionsList');
    this.quizQuestions.forEach(function (q, qIndex) {
      var div = document.createElement('div');
      div.className = 'obuchenie-question-item';
      div.style.cssText = 'border: 1px solid var(--card-border); padding: 20px; border-radius: 8px; position: relative; background: #fff;';
      div.dataset.id = q.id || 'q_' + Date.now() + Math.random().toString(36).substr(2, 5);
      var optionsHtml = '';
      for (var i = 0; i < 4; i++) {
        var opt = _this4.normalizeQuizOption(q.options && q.options[i] ? q.options[i] : null, i);
        var isCorrect = q.correctAnswer === opt.letter;
        optionsHtml += "\n                    <div style=\"display: flex; gap: 10px; align-items: center; margin-bottom: 10px;\">\n                        <span style=\"font-weight: 600; min-width: 25px;\">".concat(opt.letter, ")</span>\n                        <input type=\"hidden\" class=\"q-opt-letter\" value=\"").concat(opt.letter, "\">\n                        <input type=\"text\" class=\"form-control q-opt-text\" value=\"").concat(_this4.escapeHtml(opt.text), "\" placeholder=\"\u0412\u0430\u0440\u0438\u0430\u043d\u0442 \u043e\u0442\u0432\u0435\u0442\u0430\" style=\"flex: 1; margin-bottom: 0;\">\n                        <label style=\"display: flex; align-items: center; gap: 5px; cursor: pointer; margin: 0; min-width: 100px;\">\n                            <input type=\"radio\" name=\"q_correct_").concat(qIndex, "\" value=\"").concat(opt.letter, "\" ").concat(isCorrect ? 'checked' : '', ">\n                            \u041f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0439\n                        </label>\n                    </div>\n                ");
      }
      div.innerHTML = "\n                <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;\">\n                    <h5 style=\"margin: 0; color: var(--accent-color);\">\u0412\u043e\u043f\u0440\u043e\u0441 ".concat(qIndex + 1, "</h5>\n                    <button type=\"button\" class=\"btn-secondary\" style=\"color: #e53935; border-color: #e53935;\" onclick=\"this.parentElement.parentElement.remove(); AdminQuiz.updateQuizQuestionsCount();\">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button>\n                </div>\n                <div class=\"form-group\">\n                    <label>\u0422\u0435\u043a\u0441\u0442 \u0432\u043e\u043f\u0440\u043e\u0441\u0430</label>\n                    <textarea class=\"form-control q-text\" style=\"min-height: 80px;\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043a\u0441\u0442 \u0432\u043e\u043f\u0440\u043e\u0441\u0430\">").concat(_this4.escapeHtml(q.text || ''), "</textarea>\n                </div>\n                <div class=\"options-container\">\n                    <label>\u0412\u0430\u0440\u0438\u0430\u043d\u0442\u044b \u043e\u0442\u0432\u0435\u0442\u0430</label>\n                    ").concat(optionsHtml, "\n                </div>\n            ");
      listContainer.appendChild(div);
    });
  },
  addQuizQuestion: function addQuizQuestion() {
    var listContainer = document.getElementById('quizQuestionsList');
    if (!listContainer) return;
    var qId = 'q_' + Date.now() + Math.random().toString(36).substr(2, 5);
    var defaultLetters = this.QUIZ_OPTION_LETTERS;
    var optionsHtml = '';
    for (var i = 0; i < 4; i++) {
      optionsHtml += "\n                <div style=\"display: flex; gap: 10px; align-items: center; margin-bottom: 10px;\">\n                    <span style=\"font-weight: 600; min-width: 25px;\">".concat(defaultLetters[i], ")</span>\n                    <input type=\"hidden\" class=\"q-opt-letter\" value=\"").concat(defaultLetters[i], "\">\n                    <input type=\"text\" class=\"form-control q-opt-text\" value=\"\" placeholder=\"\u0412\u0430\u0440\u0438\u0430\u043d\u0442 \u043e\u0442\u0432\u0435\u0442\u0430\" style=\"flex: 1; margin-bottom: 0;\">\n                    <label style=\"display: flex; align-items: center; gap: 5px; cursor: pointer; margin: 0; min-width: 100px;\">\n                        <input type=\"radio\" name=\"q_correct_").concat(qId, "\" value=\"").concat(defaultLetters[i], "\" ").concat(i === 0 ? 'checked' : '', ">\n                        \u041f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0439\n                    </label>\n                </div>\n            ");
    }
    var div = document.createElement('div');
    div.className = 'obuchenie-question-item';
    div.style.cssText = 'border: 1px solid var(--card-border); padding: 20px; border-radius: 8px; position: relative; background: #fff; margin-bottom: 20px;';
    div.dataset.id = qId;
    div.innerHTML = "\n            <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;\">\n                <h5 style=\"margin: 0; color: var(--accent-color);\">\u041d\u043e\u0432\u044b\u0439 \u0432\u043e\u043f\u0440\u043e\u0441</h5>\n                <button type=\"button\" class=\"btn-secondary\" style=\"color: #e53935; border-color: #e53935;\" onclick=\"this.parentElement.parentElement.remove(); AdminQuiz.updateQuizQuestionsCount();\">\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button>\n            </div>\n            <div class=\"form-group\">\n                <label>\u0422\u0435\u043a\u0441\u0442 \u0432\u043e\u043f\u0440\u043e\u0441\u0430</label>\n                <textarea class=\"form-control q-text\" style=\"min-height: 80px;\" placeholder=\"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043a\u0441\u0442 \u0432\u043e\u043f\u0440\u043e\u0441\u0430\"></textarea>\n            </div>\n            <div class=\"options-container\">\n                <label>\u0412\u0430\u0440\u0438\u0430\u043d\u0442\u044b \u043e\u0442\u0432\u0435\u0442\u0430</label>\n                ".concat(optionsHtml, "\n            </div>\n        ");
    listContainer.insertBefore(div, listContainer.firstChild);
    this.updateQuizQuestionsCount();
  },
  updateQuizQuestionsCount: function updateQuizQuestionsCount() {
    var countSpan = document.getElementById('quizQuestionsCount');
    var listContainer = document.getElementById('quizQuestionsList');
    if (countSpan && listContainer) {
      countSpan.textContent = listContainer.children.length;
    }
  },
  collectQuizPageFromForm: function collectQuizPageFromForm() {
    var _this5 = this;
    var listContainer = document.getElementById('quizQuestionsList');
    if (!listContainer) return {
      quizQuestions: this.quizQuestions
    };
    var newQuestions = [];
    var items = listContainer.querySelectorAll('.obuchenie-question-item');
    items.forEach(function (item, index) {
      var id = item.dataset.id || String(index + 1);
      var text = item.querySelector('.q-text').value;
      var options = [];
      var correctAnswer = '';
      var optRows = item.querySelectorAll('.options-container > div');
      optRows.forEach(function (row) {
        var letter = row.querySelector('.q-opt-letter').value;
        var optText = row.querySelector('.q-opt-text').value;
        var radio = row.querySelector('input[type="radio"]');
        options.push({
          letter: letter,
          text: optText
        });
        if (radio && radio.checked) {
          correctAnswer = letter;
        }
      });
      newQuestions.push(_this5.normalizeQuizQuestion({
        id: id,
        text: text,
        options: options,
        correctAnswer: correctAnswer
      }, index));
    });
    this.quizQuestions = newQuestions;
    return {
      quizQuestions: newQuestions
    };
  },
  escapeHtml: function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return (unsafe || '').toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
};
