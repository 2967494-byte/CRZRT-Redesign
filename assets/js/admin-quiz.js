window.AdminQuiz = {
    quizQuestions: [],

    QUIZ_OPTION_LETTERS: ['А', 'Б', 'В', 'Г', 'Д', 'Е'],

    QUIZ_CORRECT_ANSWERS: {
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
    },

    extractOptionText: function (value) {
        if (value == null) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return String(value);
        if (typeof value === 'object') {
            if (typeof value.text === 'string') return value.text;
            if (typeof value.value === 'string') return value.value;
            if (typeof value.label === 'string') return value.label;
        }
        return '';
    },

    normalizeQuizOption: function (opt, index) {
        const letters = this.QUIZ_OPTION_LETTERS;
        const defaultLetter = letters[index] || String(index + 1);

        if (typeof opt === 'string') {
            return { letter: defaultLetter, text: opt };
        }

        if (!opt || typeof opt !== 'object') {
            return { letter: defaultLetter, text: '' };
        }

        let letter = opt.letter ?? opt.label ?? defaultLetter;
        if (typeof letter === 'number' || /^\d+$/.test(String(letter))) {
            const idx = parseInt(letter, 10);
            letter = letters[idx] || defaultLetter;
        }
        letter = String(letter || defaultLetter).trim().toUpperCase();

        let text = this.extractOptionText(opt.text ?? opt.value ?? opt);
        if (text === '[object Object]') text = '';

        return { letter, text };
    },

    normalizeQuizQuestion: function (raw, index) {
        const letters = this.QUIZ_OPTION_LETTERS;
        const id = raw?.id ?? index + 1;
        const text = String(raw?.text ?? raw?.question ?? '').trim();

        let rawOptions = raw?.options;
        if (rawOptions && !Array.isArray(rawOptions) && typeof rawOptions === 'object') {
            rawOptions = Object.keys(rawOptions)
                .sort((a, b) => Number(a) - Number(b))
                .map((key) => rawOptions[key]);
        }
        if (!Array.isArray(rawOptions)) rawOptions = [];

        const options = [];
        for (let i = 0; i < 4; i++) {
            options.push(this.normalizeQuizOption(rawOptions[i], i));
        }

        let correctAnswer = String(raw?.correctAnswer || '').trim().toUpperCase();
        if (!correctAnswer) {
            correctAnswer = this.QUIZ_CORRECT_ANSWERS[id] || letters[0];
        }

        return { id, text, options, correctAnswer };
    },

    isQuizQuestionsCorrupted: function (questions) {
        if (!Array.isArray(questions) || questions.length === 0) return true;

        const expected = window.TEST_QUESTIONS?.length || 0;
        if (expected > 0 && questions.length < expected) return true;

        const sample = questions.slice(0, 3);
        return sample.some((q) => {
            if (!q || typeof q.text !== 'string' || !q.text.trim()) return true;
            if (!Array.isArray(q.options) || q.options.length === 0) return true;
            return q.options.some((opt) => {
                if (opt == null) return true;
                if (typeof opt === 'string') return false;
                const text = this.extractOptionText(opt.text ?? opt);
                return !text || text === '[object Object]' || typeof opt.text === 'object';
            });
        });
    },

    importDefaultQuizQuestions: function () {
        if (!window.TEST_QUESTIONS || !window.TEST_QUESTIONS.length) return [];
        return window.TEST_QUESTIONS.map((q, index) => {
            const normalized = this.normalizeQuizQuestion(q, index);
            normalized.correctAnswer = this.QUIZ_CORRECT_ANSWERS[normalized.id] || normalized.correctAnswer || 'А';
            return normalized;
        });
    },

    migrateQuizPageData: function (data) {
        let migrated = data || {};
        let questions = Array.isArray(migrated.quizQuestions) ? migrated.quizQuestions : [];

        const shouldImportDefaults = this.isQuizQuestionsCorrupted(questions)
            && window.TEST_QUESTIONS
            && window.TEST_QUESTIONS.length > 0;

        if (shouldImportDefaults) {
            questions = this.importDefaultQuizQuestions();
        } else {
            questions = questions
                .map((q, index) => this.normalizeQuizQuestion(q, index))
                .filter((q) => q.text);
        }

        migrated.quizQuestions = questions;
        this.quizQuestions = questions;
        return migrated;
    },

    renderQuizPageAdmin: function () {
        const container = document.getElementById('testingQuestionsAdminContainer');
        if (!container) return;

        let html = `
            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <h4 style="margin: 0; font-size: 1.1rem;">Всего вопросов: <span id="quizQuestionsCount">${this.quizQuestions.length}</span></h4>
                <button type="button" class="btn-secondary" onclick="AdminQuiz.addQuizQuestion()">+ Добавить вопрос</button>
            </div>
            <div id="quizQuestionsList" style="display: flex; flex-direction: column; gap: 20px;"></div>
        `;
        container.innerHTML = html;

        const listContainer = document.getElementById('quizQuestionsList');

        this.quizQuestions.forEach((q, qIndex) => {
            const div = document.createElement('div');
            div.className = 'obuchenie-question-item';
            div.style.cssText = 'border: 1px solid var(--card-border); padding: 20px; border-radius: 8px; position: relative; background: #fff;';
            div.dataset.id = q.id || ('q_' + Date.now() + Math.random().toString(36).substr(2, 5));

            let optionsHtml = '';
            const defaultLetters = this.QUIZ_OPTION_LETTERS;

            for (let i = 0; i < 4; i++) {
                const opt = this.normalizeQuizOption(q.options && q.options[i] ? q.options[i] : null, i);
                const isCorrect = q.correctAnswer === opt.letter;

                optionsHtml += `
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                        <span style="font-weight: 600; min-width: 25px;">${opt.letter})</span>
                        <input type="hidden" class="q-opt-letter" value="${opt.letter}">
                        <input type="text" class="form-control q-opt-text" value="${this.escapeHtml(opt.text)}" placeholder="Вариант ответа" style="flex: 1; margin-bottom: 0;">
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer; margin: 0; min-width: 100px;">
                            <input type="radio" name="q_correct_${qIndex}" value="${opt.letter}" ${isCorrect ? 'checked' : ''}>
                            Правильный
                        </label>
                    </div>
                `;
            }

            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h5 style="margin: 0; color: var(--accent-color);">Вопрос ${qIndex + 1}</h5>
                    <button type="button" class="btn-secondary" style="color: #e53935; border-color: #e53935;" onclick="this.parentElement.parentElement.remove(); AdminQuiz.updateQuizQuestionsCount();">Удалить</button>
                </div>
                <div class="form-group">
                    <label>Текст вопроса</label>
                    <textarea class="form-control q-text" style="min-height: 80px;" placeholder="Введите текст вопроса">${this.escapeHtml(q.text || '')}</textarea>
                </div>
                <div class="options-container">
                    <label>Варианты ответа</label>
                    ${optionsHtml}
                </div>
            `;
            listContainer.appendChild(div);
        });
    },

    addQuizQuestion: function () {
        const listContainer = document.getElementById('quizQuestionsList');
        if (!listContainer) return;

        const qId = 'q_' + Date.now() + Math.random().toString(36).substr(2, 5);
        const defaultLetters = this.QUIZ_OPTION_LETTERS;
        let optionsHtml = '';

        for (let i = 0; i < 4; i++) {
            optionsHtml += `
                <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                    <span style="font-weight: 600; min-width: 25px;">${defaultLetters[i]})</span>
                    <input type="hidden" class="q-opt-letter" value="${defaultLetters[i]}">
                    <input type="text" class="form-control q-opt-text" value="" placeholder="Вариант ответа" style="flex: 1; margin-bottom: 0;">
                    <label style="display: flex; align-items: center; gap: 5px; cursor: pointer; margin: 0; min-width: 100px;">
                        <input type="radio" name="q_correct_${qId}" value="${defaultLetters[i]}" ${i === 0 ? 'checked' : ''}>
                        Правильный
                    </label>
                </div>
            `;
        }

        const div = document.createElement('div');
        div.className = 'obuchenie-question-item';
        div.style.cssText = 'border: 1px solid var(--card-border); padding: 20px; border-radius: 8px; position: relative; background: #fff; margin-bottom: 20px;';
        div.dataset.id = qId;
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h5 style="margin: 0; color: var(--accent-color);">Новый вопрос</h5>
                <button type="button" class="btn-secondary" style="color: #e53935; border-color: #e53935;" onclick="this.parentElement.parentElement.remove(); AdminQuiz.updateQuizQuestionsCount();">Удалить</button>
            </div>
            <div class="form-group">
                <label>Текст вопроса</label>
                <textarea class="form-control q-text" style="min-height: 80px;" placeholder="Введите текст вопроса"></textarea>
            </div>
            <div class="options-container">
                <label>Варианты ответа</label>
                ${optionsHtml}
            </div>
        `;

        listContainer.insertBefore(div, listContainer.firstChild);
        this.updateQuizQuestionsCount();
    },

    updateQuizQuestionsCount: function () {
        const countSpan = document.getElementById('quizQuestionsCount');
        const listContainer = document.getElementById('quizQuestionsList');
        if (countSpan && listContainer) {
            countSpan.textContent = listContainer.children.length;
        }
    },

    collectQuizPageFromForm: function () {
        const listContainer = document.getElementById('quizQuestionsList');
        if (!listContainer) return { quizQuestions: this.quizQuestions };

        const newQuestions = [];
        const items = listContainer.querySelectorAll('.obuchenie-question-item');

        items.forEach((item, index) => {
            const id = item.dataset.id || String(index + 1);
            const text = item.querySelector('.q-text').value;

            const options = [];
            let correctAnswer = '';

            const optRows = item.querySelectorAll('.options-container > div');
            optRows.forEach((row, optIndex) => {
                const letter = row.querySelector('.q-opt-letter').value;
                const optText = row.querySelector('.q-opt-text').value;
                const radio = row.querySelector('input[type="radio"]');

                options.push({ letter, text: optText });
                if (radio && radio.checked) {
                    correctAnswer = letter;
                }
            });

            newQuestions.push(this.normalizeQuizQuestion({
                id,
                text,
                options,
                correctAnswer
            }, index));
        });

        this.quizQuestions = newQuestions;
        return { quizQuestions: newQuestions };
    },

    escapeHtml: function (unsafe) {
        if (!unsafe) return '';
        return (unsafe || '').toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};
