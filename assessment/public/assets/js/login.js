(function () {
  const form = document.getElementById('loginForm');
  const status = document.getElementById('formStatus');
  const btnTogglePassword = document.getElementById('btnTogglePassword');
  const passwordInput = document.getElementById('loginPassword') || (form && form.password);

  if (btnTogglePassword && passwordInput) {
    btnTogglePassword.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      btnTogglePassword.classList.toggle('is-visible', isPassword);
      btnTogglePassword.setAttribute('aria-label', isPassword ? 'Скрыть пароль' : 'Показать пароль');
      btnTogglePassword.setAttribute('title', isPassword ? 'Скрыть пароль' : 'Показать пароль');
      passwordInput.focus();
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'status status--info';
    status.textContent = 'Вход…';
    try {
      const data = await AsmtApi.post('api/auth.php?action=login', {
        email: form.email.value.trim(),
        password: form.password.value,
      });
      window.location.href = data.redirect || 'cabinet.html';
    } catch (err) {
      status.className = 'status status--error';
      status.textContent = err.message;
    }
  });
})();
