(function () {
  const btn = document.getElementById('btnEsia');
  const hint = document.getElementById('esiaHint');
  if (!btn) return;

  async function refresh() {
    try {
      const res = await fetch('api/esia.php?action=start', { credentials: 'same-origin' });
      const data = await res.json().catch(() => ({}));
      if (data.enabled) {
        btn.disabled = false;
        btn.removeAttribute('title');
        if (hint) hint.textContent = 'Откроется авторизация через Госуслуги (ЕСИА).';
        return;
      }
      btn.disabled = true;
      if (hint && data.error) hint.textContent = data.error;
    } catch (_) {
      btn.disabled = true;
    }
  }

  btn.addEventListener('click', async () => {
    if (btn.disabled) return;
    try {
      await AsmtApi.get('api/esia.php?action=start');
    } catch (err) {
      if (hint) hint.textContent = err.message;
    }
  });

  refresh();
})();
