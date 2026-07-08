function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
window.AdminQuiz = {
  quizQuestions: [],
  QUIZ_OPTION_LETTERS: ['Рђ', 'Р‘', 'Р’', 'Р“', 'Р”', 'Р•'],
  QUIZ_CORRECT_ANSWERS: {
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
    20: 'Р’',
    21: 'Рђ',
    22: 'Рђ',
    23: 'Р‘',
    24: 'Р“',
    25: 'Р‘',
    26: 'Р“',
    27: 'Р’',
    28: 'Р“',
    29: 'Рђ',
    30: 'Р’',
    31: 'Р•',
    32: 'Р‘',
    33: 'Р“',
    34: 'Р“',
    35: 'Р‘',
    36: 'Р’',
    37: 'Р“',
    38: 'Р“',
    39: 'Р•',
    40: 'Р”',
    41: 'Рђ',
    42: 'Рђ',
    43: 'Рђ',
    44: 'Рђ',
    45: 'Рђ',
    46: 'Р’',
    47: 'Р’',
    48: 'Р“',
    49: 'Рђ',
    50: 'Р‘',
    51: 'Рђ',
    52: 'Рђ',
    53: 'Рђ',
    54: 'Рђ',
    55: 'Рђ',
    56: 'Рђ',
    57: 'Рђ',
    58: 'Рђ',
    59: 'Рђ',
    60: 'Рђ',
    61: 'Рђ',
    62: 'Рђ',
    63: 'Рђ',
    64: 'Рђ',
    65: 'Рђ',
    66: 'Рђ',
    67: 'Рђ',
    68: 'Рђ',
    69: 'Рђ',
    70: 'Рђ',
    71: 'Рђ',
    72: 'Рђ',
    73: 'Рђ',
    74: 'Рђ',
    75: 'Рђ',
    76: 'Рђ',
    77: 'Рђ',
    78: 'Рђ',
    79: 'Рђ',
    80: 'Рђ',
    81: 'Рђ',
    82: 'Рђ',
    83: 'Рђ',
    84: 'Рђ',
    85: 'Рђ',
    86: 'Рђ',
    87: 'Рђ',
    88: 'Рђ',
    89: 'Рђ',
    90: 'Рђ',
    91: 'Рђ',
    92: 'Рђ',
    93: 'Рђ',
    94: 'Рђ',
    95: 'Рђ',
    96: 'Рђ',
    97: 'Рђ',
    98: 'Рђ',
    99: 'Рђ',
    100: 'Рђ'
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
    letter = String(letter || defaultLetter).trim().toUpperCase();
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
    var correctAnswer = String(raw && raw.correctAnswer || '').trim().toUpperCase();
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
      normalized.correctAnswer = _this2.QUIZ_CORRECT_ANSWERS[normalized.id] || normalized.correctAnswer || 'Рђ';
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
    var html = "\n            <div style=\"margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;\">\n                <h4 style=\"margin: 0; font-size: 1.1rem;\">\u0420\u2019\u0421\u0403\u0420\xB5\u0420\u0456\u0420\u0455 \u0420\u0406\u0420\u0455\u0420\u0457\u0421\u0402\u0420\u0455\u0421\u0403\u0420\u0455\u0420\u0406: <span id=\"quizQuestionsCount\">".concat(this.quizQuestions.length, "</span></h4>\n                <button type=\"button\" class=\"btn-secondary\" onclick=\"AdminQuiz.addQuizQuestion()\">+ \u0420\u201D\u0420\u0455\u0420\xB1\u0420\xB0\u0420\u0406\u0420\u0451\u0421\u201A\u0421\u040A \u0420\u0406\u0420\u0455\u0420\u0457\u0421\u0402\u0420\u0455\u0421\u0403</button>\n            </div>\n            <div id=\"quizQuestionsList\" style=\"display: flex; flex-direction: column; gap: 20px;\"></div>\n        ");
    container.innerHTML = html;
    var listContainer = document.getElementById('quizQuestionsList');
    this.quizQuestions.forEach(function (q, qIndex) {
      var div = document.createElement('div');
      div.className = 'obuchenie-question-item';
      div.style.cssText = 'border: 1px solid var(--card-border); padding: 20px; border-radius: 8px; position: relative; background: #fff;';
      div.dataset.id = q.id || 'q_' + Date.now() + Math.random().toString(36).substr(2, 5);
      var optionsHtml = '';
      var defaultLetters = _this4.QUIZ_OPTION_LETTERS;
      for (var i = 0; i < 4; i++) {
        var opt = _this4.normalizeQuizOption(q.options && q.options[i] ? q.options[i] : null, i);
        var isCorrect = q.correctAnswer === opt.letter;
        optionsHtml += "\n                    <div style=\"display: flex; gap: 10px; align-items: center; margin-bottom: 10px;\">\n                        <span style=\"font-weight: 600; min-width: 25px;\">".concat(opt.letter, ")</span>\n                        <input type=\"hidden\" class=\"q-opt-letter\" value=\"").concat(opt.letter, "\">\n                        <input type=\"text\" class=\"form-control q-opt-text\" value=\"").concat(_this4.escapeHtml(opt.text), "\" placeholder=\"\u0420\u2019\u0420\xB0\u0421\u0402\u0420\u0451\u0420\xB0\u0420\u0405\u0421\u201A \u0420\u0455\u0421\u201A\u0420\u0406\u0420\xB5\u0421\u201A\u0420\xB0\" style=\"flex: 1; margin-bottom: 0;\">\n                        <label style=\"display: flex; align-items: center; gap: 5px; cursor: pointer; margin: 0; min-width: 100px;\">\n                            <input type=\"radio\" name=\"q_correct_").concat(qIndex, "\" value=\"").concat(opt.letter, "\" ").concat(isCorrect ? 'checked' : '', ">\n                            \u0420\u045F\u0421\u0402\u0420\xB0\u0420\u0406\u0420\u0451\u0420\xBB\u0421\u040A\u0420\u0405\u0421\u2039\u0420\u2116\n                        </label>\n                    </div>\n                ");
      }
      div.innerHTML = "\n                <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;\">\n                    <h5 style=\"margin: 0; color: var(--accent-color);\">\u0420\u2019\u0420\u0455\u0420\u0457\u0421\u0402\u0420\u0455\u0421\u0403 ".concat(qIndex + 1, "</h5>\n                    <button type=\"button\" class=\"btn-secondary\" style=\"color: #e53935; border-color: #e53935;\" onclick=\"this.parentElement.parentElement.remove(); AdminQuiz.updateQuizQuestionsCount();\">\u0420\u0408\u0420\u0491\u0420\xB0\u0420\xBB\u0420\u0451\u0421\u201A\u0421\u040A</button>\n                </div>\n                <div class=\"form-group\">\n                    <label>\u0420\u045E\u0420\xB5\u0420\u0454\u0421\u0403\u0421\u201A \u0420\u0406\u0420\u0455\u0420\u0457\u0421\u0402\u0420\u0455\u0421\u0403\u0420\xB0</label>\n                    <textarea class=\"form-control q-text\" style=\"min-height: 80px;\" placeholder=\"\u0420\u2019\u0420\u0406\u0420\xB5\u0420\u0491\u0420\u0451\u0421\u201A\u0420\xB5 \u0421\u201A\u0420\xB5\u0420\u0454\u0421\u0403\u0421\u201A \u0420\u0406\u0420\u0455\u0420\u0457\u0421\u0402\u0420\u0455\u0421\u0403\u0420\xB0\">").concat(_this4.escapeHtml(q.text || ''), "</textarea>\n                </div>\n                <div class=\"options-container\">\n                    <label>\u0420\u2019\u0420\xB0\u0421\u0402\u0420\u0451\u0420\xB0\u0420\u0405\u0421\u201A\u0421\u2039 \u0420\u0455\u0421\u201A\u0420\u0406\u0420\xB5\u0421\u201A\u0420\xB0</label>\n                    ").concat(optionsHtml, "\n                </div>\n            ");
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
      optionsHtml += "\n                <div style=\"display: flex; gap: 10px; align-items: center; margin-bottom: 10px;\">\n                    <span style=\"font-weight: 600; min-width: 25px;\">".concat(defaultLetters[i], ")</span>\n                    <input type=\"hidden\" class=\"q-opt-letter\" value=\"").concat(defaultLetters[i], "\">\n                    <input type=\"text\" class=\"form-control q-opt-text\" value=\"\" placeholder=\"\u0420\u2019\u0420\xB0\u0421\u0402\u0420\u0451\u0420\xB0\u0420\u0405\u0421\u201A \u0420\u0455\u0421\u201A\u0420\u0406\u0420\xB5\u0421\u201A\u0420\xB0\" style=\"flex: 1; margin-bottom: 0;\">\n                    <label style=\"display: flex; align-items: center; gap: 5px; cursor: pointer; margin: 0; min-width: 100px;\">\n                        <input type=\"radio\" name=\"q_correct_").concat(qId, "\" value=\"").concat(defaultLetters[i], "\" ").concat(i === 0 ? 'checked' : '', ">\n                        \u0420\u045F\u0421\u0402\u0420\xB0\u0420\u0406\u0420\u0451\u0420\xBB\u0421\u040A\u0420\u0405\u0421\u2039\u0420\u2116\n                    </label>\n                </div>\n            ");
    }
    var div = document.createElement('div');
    div.className = 'obuchenie-question-item';
    div.style.cssText = 'border: 1px solid var(--card-border); padding: 20px; border-radius: 8px; position: relative; background: #fff; margin-bottom: 20px;';
    div.dataset.id = qId;
    div.innerHTML = "\n            <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;\">\n                <h5 style=\"margin: 0; color: var(--accent-color);\">\u0420\u045C\u0420\u0455\u0420\u0406\u0421\u2039\u0420\u2116 \u0420\u0406\u0420\u0455\u0420\u0457\u0421\u0402\u0420\u0455\u0421\u0403</h5>\n                <button type=\"button\" class=\"btn-secondary\" style=\"color: #e53935; border-color: #e53935;\" onclick=\"this.parentElement.parentElement.remove(); AdminQuiz.updateQuizQuestionsCount();\">\u0420\u0408\u0420\u0491\u0420\xB0\u0420\xBB\u0420\u0451\u0421\u201A\u0421\u040A</button>\n            </div>\n            <div class=\"form-group\">\n                <label>\u0420\u045E\u0420\xB5\u0420\u0454\u0421\u0403\u0421\u201A \u0420\u0406\u0420\u0455\u0420\u0457\u0421\u0402\u0420\u0455\u0421\u0403\u0420\xB0</label>\n                <textarea class=\"form-control q-text\" style=\"min-height: 80px;\" placeholder=\"\u0420\u2019\u0420\u0406\u0420\xB5\u0420\u0491\u0420\u0451\u0421\u201A\u0420\xB5 \u0421\u201A\u0420\xB5\u0420\u0454\u0421\u0403\u0421\u201A \u0420\u0406\u0420\u0455\u0420\u0457\u0421\u0402\u0420\u0455\u0421\u0403\u0420\xB0\"></textarea>\n            </div>\n            <div class=\"options-container\">\n                <label>\u0420\u2019\u0420\xB0\u0421\u0402\u0420\u0451\u0420\xB0\u0420\u0405\u0421\u201A\u0421\u2039 \u0420\u0455\u0421\u201A\u0420\u0406\u0420\xB5\u0421\u201A\u0420\xB0</label>\n                ".concat(optionsHtml, "\n            </div>\n        ");
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
      optRows.forEach(function (row, optIndex) {
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