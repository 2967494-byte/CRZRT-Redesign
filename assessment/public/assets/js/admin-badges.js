(function () {
  async function refreshAdminBadges() {
    try {
      if (typeof AsmtApi === 'undefined') return;
      const res = await AsmtApi.get('api/admin-counts.php');
      if (!res || !res.success) return;

      const modCount = Number(res.moderation || 0);
      const reqCount = Number(res.requests || 0);

      document.querySelectorAll('[data-badge="moderation"]').forEach((el) => {
        el.textContent = modCount > 0 ? modCount : '';
        el.setAttribute('data-count', String(modCount));
        if (modCount > 0) {
          el.classList.remove('hidden');
          el.style.display = 'inline-flex';
        } else {
          el.classList.add('hidden');
          el.style.display = 'none';
        }
      });

      document.querySelectorAll('[data-badge="requests"]').forEach((el) => {
        el.textContent = reqCount > 0 ? reqCount : '';
        el.setAttribute('data-count', String(reqCount));
        if (reqCount > 0) {
          el.classList.remove('hidden');
          el.style.display = 'inline-flex';
        } else {
          el.classList.add('hidden');
          el.style.display = 'none';
        }
      });
    } catch (_e) {
      // silent
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refreshAdminBadges);
  } else {
    refreshAdminBadges();
  }

  window.refreshAdminBadges = refreshAdminBadges;
})();
