(function () {
  const form = document.getElementById('loginForm');
  const status = document.getElementById('formStatus');

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
