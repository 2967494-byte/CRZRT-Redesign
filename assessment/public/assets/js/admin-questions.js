(function () {
  const els = {
    qBankBody: document.getElementById('qBankBody'),
    qBankQ: document.getElementById('qBankQ'),
    qBankStatus: document.getElementById('qBankStatus'),
    qDetail: document.getElementById('qDetail'),
    qModalBackdrop: document.getElementById('qModalBackdrop'),
    qModalTitle: document.getElementById('qModalTitle'),
    qModalDifficulty: document.getElementById('qModalDifficulty'),
    btnCloseQModal: document.getElementById('btnCloseQModal'),
    btnQBankReload: document.getElementById('btnQBankReload'),
    btnCreateQuestion: document.getElementById('btnCreateQuestion'),
    btnLogout: document.getElementById('btnLogout'),
  };

  let canEditQuestions = false;

  function showStatus(msg, type) {
    els.qBankStatus.textContent = msg || '';
    els.qBankStatus.className = msg ? ('status status--' + (type || 'info')) : 'status';
  }

  function closeModal() {
    els.qModalBackdrop.classList.add('hidden');
  }

  function openModal() {
    els.qModalBackdrop.classList.remove('hidden');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function loadQuestionBank() {
    showStatus('Загрузка банка вопросов…', 'info');
    closeModal();
    try {
      const p = new URLSearchParams();
      if (els.qBankQ.value.trim()) p.set('q', els.qBankQ.value.trim());
      p.set('limit', '200');
      const data = await AsmtApi.get('api/admin-questions.php?' + p.toString());
      canEditQuestions = Boolean(data.canEdit);
      const items = data.items || [];

      if (!items.length) {
        els.qBankBody.innerHTML = '<tr><td colspan="6">Вопросы не найдены</td></tr>';
      } else {
        els.qBankBody.innerHTML = items.map((it) => `<tr>
          <td><strong>№${it.externalId}</strong>${it.isActive ? '' : '<br><span class="badge" style="background:#f1f5f9; color:#64748b; font-weight:700; font-size:0.7rem;">Скрыт</span>'}</td>
          <td class="wrap">${esc(it.text)}</td>
          <td>${it.difficulty != null ? `<span class="badge" style="background:#eef6ff; color:#2563eb; font-weight:700;">${it.difficulty}/10</span>` : '<span style="color:var(--muted);">—</span>'}</td>
          <td><span class="badge" style="background:var(--green-light); color:var(--green); font-weight:700;">${esc(it.correctLetter)}</span></td>
          <td>${it.formulationsCount}</td>
          <td>
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
              <button type="button" class="btn btn--ghost btn--sm" data-qid="${it.id}">Открыть</button>
              ${canEditQuestions ? (it.isActive
                ? `<button type="button" class="btn btn--ghost btn--sm" style="color:var(--danger);" data-hide-q="${it.id}" title="Скрыть вопрос: он перестанет попадать в новые тесты">Скрыть</button>`
                : `<button type="button" class="btn btn--ghost btn--sm" data-show-q="${it.id}" title="Вернуть вопрос в тесты">Показать</button>`) : ''}
            </div>
          </td>
        </tr>`).join('');

        els.qBankBody.querySelectorAll('button[data-qid]').forEach((btn) => {
          btn.addEventListener('click', () => openQuestion(Number(btn.dataset.qid)));
        });

        els.qBankBody.querySelectorAll('button[data-hide-q]').forEach((btn) => {
          btn.addEventListener('click', () => setQuestionHidden(Number(btn.dataset.hideQ), true));
        });

        els.qBankBody.querySelectorAll('button[data-show-q]').forEach((btn) => {
          btn.addEventListener('click', () => setQuestionHidden(Number(btn.dataset.showQ), false));
        });
      }
      showStatus(`Всего вопросов: ${data.total}`, 'ok');
    } catch (err) {
      showStatus(err.message, 'error');
    }
  }

  async function setQuestionHidden(id, hidden) {
    try {
      const res = await AsmtApi.post('api/admin-questions.php', {
        action: 'toggle-question-visibility',
        questionId: id,
        hidden,
      });
      closeModal();
      await loadQuestionBank();
      showStatus(res.message || (hidden ? 'Вопрос скрыт' : 'Вопрос показан'), hidden ? 'warning' : 'ok');
    } catch (err) {
      showStatus(err.message, 'error');
    }
  }

  // Банк вопросов размечен кириллическими буквами (А, Б, В, Г) — латиница ломает
  // сопоставление с correct_letter и ответами участников.
  const DEFAULT_LETTERS = ['А', 'Б', 'В', 'Г'];

  function renderOptionsEditor(optionMap, correctLetter, readOnly, letters) {
    const list = (letters && letters.length) ? letters : DEFAULT_LETTERS;
    const correct = (correctLetter || list[0] || '').toUpperCase();
    return list.map((letter) => {
      const text = optionMap[letter] || '';
      const isCorrect = correct === letter.toUpperCase();
      return `
        <div style="border:1px solid var(--border); border-radius:10px; padding:12px; margin-bottom:10px; background:${isCorrect ? 'var(--green-light)' : '#fff'};">
          <div style="display:flex; align-items:center; margin-bottom:6px;">
            <label style="font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px;">
              <input type="radio" name="correctLetterRadio" value="${letter}" ${isCorrect ? 'checked' : ''} ${readOnly ? 'disabled' : ''}>
              Вариант ${letter}
            </label>
          </div>
          <textarea data-option-letter="${letter}" rows="2" style="width:100%; border:1px solid var(--border); border-radius:8px; padding:8px; font-size:0.9rem;" ${readOnly ? 'readonly' : ''}>${esc(text)}</textarea>
        </div>
      `;
    }).join('');
  }

  function setupOptionsListeners() {
    const radios = els.qDetail.querySelectorAll('input[name="correctLetterRadio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        radios.forEach(r => {
          const card = r.closest('div[style*="border"]');
          if (card) {
            card.style.background = r.checked ? 'var(--green-light)' : '#fff';
          }
        });
      });
    });
  }

  function openNewQuestion() {
    els.qModalTitle.textContent = 'Новый вопрос';
    els.qModalDifficulty.value = '';
    els.qModalDifficulty.disabled = !canEditQuestions;

    const optionsHtml = renderOptionsEditor({}, DEFAULT_LETTERS[0], !canEditQuestions, DEFAULT_LETTERS);

    els.qDetail.innerHTML = `
      <div style="margin-bottom:16px;">
        <label class="field" style="margin-bottom:14px; font-weight:700;">Базовый текст вопроса
          <textarea id="qBaseText" rows="3" placeholder="Введите текст нового вопроса…"></textarea>
        </label>
      </div>

      <h4 style="margin:18px 0 10px; font-size:1.05rem; font-weight:700;">Варианты ответов и выбор правильного</h4>
      <div id="optionsContainer" style="margin-bottom:16px;">
        ${optionsHtml}
      </div>

      ${canEditQuestions ? `
        <div class="actions" style="margin-bottom:24px;">
          <button type="button" class="btn btn--primary" id="btnSaveQuestion">Создать вопрос</button>
        </div>
      ` : ''}
    `;

    openModal();
    setupOptionsListeners();

    if (canEditQuestions) {
      document.getElementById('btnSaveQuestion').addEventListener('click', async () => {
        const selectedRadio = els.qDetail.querySelector('input[name="correctLetterRadio"]:checked');
        const correctLetter = selectedRadio ? selectedRadio.value : DEFAULT_LETTERS[0];
        const text = document.getElementById('qBaseText').value.trim();
        const difficulty = els.qModalDifficulty.value !== '' ? els.qModalDifficulty.value : null;

        const options = [];
        els.qDetail.querySelectorAll('textarea[data-option-letter]').forEach(ta => {
          options.push({
            letter: ta.dataset.optionLetter,
            text: ta.value.trim()
          });
        });

        try {
          const res = await AsmtApi.post('api/admin-questions.php', {
            action: 'save-question',
            questionId: 0,
            text,
            correctLetter,
            difficulty,
            options,
            isActive: true,
          });
          showStatus('Новый вопрос успешно добавлен!', 'ok');
          loadQuestionBank();
        } catch (err) {
          showStatus(err.message, 'error');
        }
      });
    }
  }

  async function openQuestion(id) {
    try {
      const data = await AsmtApi.get('api/admin-questions.php?id=' + id);
      const q = data.question;
      canEditQuestions = Boolean(data.canEdit);

      els.qModalTitle.textContent = `Вопрос №${q.externalId}` + (q.isActive ? '' : ' — скрыт');
      els.qModalDifficulty.value = q.difficulty != null ? String(q.difficulty) : '';
      els.qModalDifficulty.disabled = !canEditQuestions;

      const rawOptions = (q.options || []).slice().sort((a, b) => a.sortOrder - b.sortOrder);
      const optionMap = {};
      const letters = [];
      rawOptions.forEach(o => {
        const letter = String(o.letter || '').toUpperCase();
        if (!letter) return;
        optionMap[letter] = o.text;
        if (!letters.includes(letter)) letters.push(letter);
      });
      DEFAULT_LETTERS.forEach((letter) => {
        if (letters.length < DEFAULT_LETTERS.length && !letters.includes(letter)) letters.push(letter);
      });

      const optionsHtml = renderOptionsEditor(optionMap, q.correctLetter, !canEditQuestions, letters);

      // Альтернативные формулировки
      const forms = (q.formulations || []).map((f, idx) => `
        <div class="form-item" data-fid="${f.id}">
          <label class="field">Формулировка #${idx + 1} ${f.isActive ? '' : '(отключена)'}
            <textarea data-field="text">${esc(f.text)}</textarea>
          </label>
          <div class="actions" style="margin-top:8px;">
            ${canEditQuestions ? `
              <button type="button" class="btn btn--primary btn--sm" data-save-f="${f.id}">Сохранить</button>
              <button type="button" class="btn btn--ghost btn--sm" style="color:var(--danger);" data-del-f="${f.id}">Отключить</button>
            ` : ''}
          </div>
        </div>
      `).join('');

      els.qDetail.innerHTML = `
        <div style="margin-bottom:16px;">
          <label class="field" style="margin-bottom:14px; font-weight:700;">Базовый текст вопроса
            <textarea id="qBaseText" rows="3">${esc(q.text)}</textarea>
          </label>
        </div>

        <h4 style="margin:18px 0 10px; font-size:1.05rem; font-weight:700;">Варианты ответов и выбор правильного</h4>
        <div id="optionsContainer" style="margin-bottom:16px;">
          ${optionsHtml}
        </div>

        ${canEditQuestions ? `
          <div class="actions" style="margin-bottom:24px; display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn btn--primary" id="btnSaveQuestion">Сохранить вопрос и ответы</button>
            ${q.isActive
              ? '<button type="button" class="btn btn--ghost" style="color:var(--danger);" id="btnToggleVisibility">Скрыть вопрос</button>'
              : '<button type="button" class="btn btn--ghost" id="btnToggleVisibility">Показать вопрос</button>'}
          </div>
          ${q.isActive ? '' : '<p class="lead" style="margin:-12px 0 20px; color:var(--muted);">Вопрос скрыт и не попадает в новые тесты. Ранее выданные попытки и результаты сохранены.</p>'}
        ` : ''}

        <hr style="border:none; border-top:1px solid var(--border-light); margin:24px 0;">

        <h4 style="margin:20px 0 12px; font-size:1.05rem; font-weight:700;">Вариации формулировок вопроса</h4>
        ${forms || '<p class="lead">Нет альтернативных формулировок</p>'}

        ${canEditQuestions ? `
          <div class="form-item" style="margin-top:16px; border-bottom:none;">
            <label class="field">Добавить новую вариацию формулировки
              <textarea id="newFormText" placeholder="Введите текст альтернативной формулировки…"></textarea>
            </label>
            <div class="actions" style="margin-top:10px;">
              <button type="button" class="btn btn--primary btn--sm" id="btnAddForm">+ Добавить формулировку</button>
            </div>
          </div>
        ` : ''}
      `;

      openModal();
      setupOptionsListeners();

      if (canEditQuestions) {
        document.getElementById('btnSaveQuestion').addEventListener('click', async () => {
          const selectedRadio = els.qDetail.querySelector('input[name="correctLetterRadio"]:checked');
          const correctLetter = selectedRadio ? selectedRadio.value : (q.correctLetter || letters[0]);
          const text = document.getElementById('qBaseText').value.trim();
          const difficulty = els.qModalDifficulty.value !== '' ? els.qModalDifficulty.value : null;

          const options = [];
          els.qDetail.querySelectorAll('textarea[data-option-letter]').forEach(ta => {
            options.push({
              letter: ta.dataset.optionLetter,
              text: ta.value.trim()
            });
          });

          try {
            await AsmtApi.post('api/admin-questions.php', {
              action: 'save-question',
              questionId: q.id,
              text,
              correctLetter,
              difficulty,
              options,
              isActive: q.isActive,
            });
            showStatus('Вопрос, сложность, ответы и эталон успешно сохранены', 'ok');
            loadQuestionBank();
          } catch (err) {
            showStatus(err.message, 'error');
          }
        });

        document.getElementById('btnToggleVisibility').addEventListener('click', () => {
          setQuestionHidden(q.id, q.isActive);
        });

        els.qDetail.querySelectorAll('[data-save-f]').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const wrap = btn.closest('.form-item');
            const text = wrap.querySelector('textarea').value;
            await AsmtApi.post('api/admin-questions.php', {
              action: 'save-formulation',
              questionId: q.id,
              formulationId: Number(btn.dataset.saveF),
              text,
              isActive: true,
            });
            showStatus('Формулировка сохранена', 'ok');
            openQuestion(q.id);
          });
        });

        els.qDetail.querySelectorAll('[data-del-f]').forEach((btn) => {
          btn.addEventListener('click', async () => {
            await AsmtApi.post('api/admin-questions.php', {
              action: 'delete-formulation',
              questionId: q.id,
              formulationId: Number(btn.dataset.delF),
            });
            openQuestion(q.id);
            loadQuestionBank();
          });
        });

        document.getElementById('btnAddForm').addEventListener('click', async () => {
          const text = document.getElementById('newFormText').value.trim();
          if (!text) return;
          await AsmtApi.post('api/admin-questions.php', {
            action: 'save-formulation',
            questionId: q.id,
            formulationId: 0,
            text,
            sortOrder: (q.formulations || []).length,
            isActive: true,
          });
          openQuestion(q.id);
          loadQuestionBank();
        });
      }
    } catch (err) {
      showStatus(err.message, 'error');
    }
  }

  // Modal events
  els.btnCloseQModal.addEventListener('click', closeModal);
  els.qModalBackdrop.addEventListener('click', (e) => {
    if (e.target === els.qModalBackdrop) closeModal();
  });

  els.btnQBankReload.addEventListener('click', loadQuestionBank);
  if (els.btnCreateQuestion) {
    els.btnCreateQuestion.addEventListener('click', openNewQuestion);
  }
  els.qBankQ.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadQuestionBank(); });

  async function boot() {
    try {
      const me = await AsmtApi.get('api/auth.php?action=me');
      if (!me.authenticated || !['superadmin', 'region_admin', 'moderator', 'analyst'].includes(me.user.role)) {
        location.href = 'login.html';
        return;
      }
      loadQuestionBank();
    } catch (err) {
      location.href = 'login.html';
    }
  }

  els.btnLogout.addEventListener('click', async () => {
    await AsmtApi.get('api/auth.php?action=logout');
    location.href = 'login.html';
  });

  boot();
})();
