(function () {
  const params = new URLSearchParams(location.search);
  const token = params.get('token') || '';
  const requestCard = document.getElementById('requestCard');
  const resetCard = document.getElementById('resetCard');

  if (token) {
    requestCard.classList.add('hidden');
    resetCard.classList.remove('hidden');
  }

  document.getElementById('requestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('requestStatus');
    status.className = 'status status--info';
    status.textContent = 'Отправка…';
    try {
      const data = await AsmtApi.post('api/auth.php?action=request-reset', {
        email: e.target.email.value.trim(),
      });
      status.className = 'status status--ok';
      status.textContent = data.message || 'Готово';
    } catch (err) {
      status.className = 'status status--error';
      status.textContent = err.message;
    }
  });

  document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('resetStatus');
    const p1 = e.target.password.value;
    const p2 = e.target.password2.value;
    if (p1 !== p2) {
      status.className = 'status status--error';
      status.textContent = 'Пароли не совпадают';
      return;
    }
    status.className = 'status status--info';
    status.textContent = 'Сохранение…';
    try {
      const data = await AsmtApi.post('api/auth.php?action=reset-password', {
        token,
        password: p1,
      });
      status.className = 'status status--ok';
      status.textContent = data.message || 'Пароль обновлён';
      setTimeout(() => { location.href = data.redirect || 'login.html'; }, 1200);
    } catch (err) {
      status.className = 'status status--error';
      status.textContent = err.message;
    }
  });
})();
