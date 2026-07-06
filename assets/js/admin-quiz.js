window.AdminQuiz = {
    quizQuestions: [],
    
    migrateQuizPageData: function (data) {
        let migrated = data || {};
        
        // Force migration if data is corrupted (e.g. no questions, or missing text)
        let isCorrupted = false;
        if (!migrated.quizQuestions || !Array.isArray(migrated.quizQuestions) || migrated.quizQuestions.length === 0) {
            isCorrupted = true;
        } else if (migrated.quizQuestions.length > 0 && (!migrated.quizQuestions[0] || typeof migrated.quizQuestions[0].text !== 'string')) {
            isCorrupted = true;
        }

        // Миграция старых данных из testing-questions.js
        if (isCorrupted && window.TEST_QUESTIONS && window.TEST_QUESTIONS.length > 0) {
            const CORRECT_ANSWERS = {
              1: 'А', 2: 'В', 3: 'Г', 4: 'В', 5: 'А', 6: 'Д', 7: 'Д', 8: 'В', 9: 'А', 10: 'Г',
              11: 'Г', 12: 'Г', 13: 'Б', 14: 'Б', 15: 'Б', 16: 'А', 17: 'А', 18: 'А', 19: 'А', 20: 'В'
            };
            migrated.quizQuestions = window.TEST_QUESTIONS.map(q => {
                return {
                    id: q.id || ('q_' + Date.now() + Math.random().toString(36).substr(2, 5)),
                    text: q.text || q.question || '',
                    options: q.options || [],
                    correctAnswer: CORRECT_ANSWERS[q.id] || 'А'
                };
            });
        }
        
        if (!migrated.quizQuestions || !Array.isArray(migrated.quizQuestions)) {
            migrated.quizQuestions = [];
        }
        
        // Filter out any nulls just in case
        migrated.quizQuestions = migrated.quizQuestions.filter(q => q && q.text);
        
        this.quizQuestions = migrated.quizQuestions;
        return migrated;
    },

    renderQuizPageAdmin: function () {
        const container = document.getElementById('testingQuestionsAdminContainer');
        if (!container) return;

        let html = `
            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
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
            // По умолчанию 4 варианта: А, Б, В, Г
            const defaultLetters = ['А', 'Б', 'В', 'Г'];
            
            for (let i = 0; i < 4; i++) {
                const opt = q.options && q.options[i] ? q.options[i] : { letter: defaultLetters[i], text: '' };
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
        
        const qIndex = listContainer.children.length;
        const qId = 'q_' + Date.now() + Math.random().toString(36).substr(2, 5);

        const div = document.createElement('div');
        div.className = 'obuchenie-question-item';
        div.style.cssText = 'border: 1px solid var(--card-border); padding: 20px; border-radius: 8px; position: relative; background: #fff; margin-bottom: 20px;';
        div.dataset.id = qId;

        const defaultLetters = ['А', 'Б', 'В', 'Г'];
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
        
        // Добавляем в начало, чтобы было удобнее
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
        
        items.forEach(item => {
            const id = item.dataset.id;
            const text = item.querySelector('.q-text').value;
            
            const options = [];
            let correctAnswer = '';
            
            const optRows = item.querySelectorAll('.options-container > div');
            optRows.forEach(row => {
                const letter = row.querySelector('.q-opt-letter').value;
                const optText = row.querySelector('.q-opt-text').value;
                const radio = row.querySelector('input[type="radio"]');
                
                options.push({ letter, text: optText });
                if (radio && radio.checked) {
                    correctAnswer = letter;
                }
            });
            
            newQuestions.push({
                id: id,
                text: text,
                options: options,
                correctAnswer: correctAnswer
            });
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
