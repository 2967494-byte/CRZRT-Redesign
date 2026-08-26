(function () {
  async function refreshAdminBadges() {
    try {
      if (typeof AsmtApi === 'undefined') return;
      const res = await AsmtApi.get('api/admin-counts.php');
      if (!res || !res.success) return;

      const modCount = Number(res.moderation || 0);
      const reqCount = Number(res.requests || 0);
      const totalCount = modCount + reqCount;

      document.querySelectorAll('[data-badge="moderation"]').forEach((el) => {
        el.textContent = modCount > 0 ? modCount : '';
        el.setAttribute('data-count', String(modCount));
        el.style.display = modCount > 0 ? 'inline-flex' : 'none';
      });

      document.querySelectorAll('[data-badge="requests"]').forEach((el) => {
        el.textContent = reqCount > 0 ? reqCount : '';
        el.setAttribute('data-count', String(reqCount));
        el.style.display = reqCount > 0 ? 'inline-flex' : 'none';
      });

      document.querySelectorAll('[data-badge="total"]').forEach((el) => {
        el.textContent = totalCount > 0 ? totalCount : '';
        el.setAttribute('data-count', String(totalCount));
        el.style.display = totalCount > 0 ? 'inline-flex' : 'none';
      });
    } catch (_e) {
      // silent
    }
  }

  function initBurgerDropdown() {
    const dropdown = document.getElementById('adminNavDropdown');
    const btn = document.getElementById('btnAdminBurger');
    if (!dropdown || !btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('is-open');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('is-open');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      refreshAdminBadges();
      initBurgerDropdown();
    });
  } else {
    refreshAdminBadges();
    initBurgerDropdown();
  }

  window.refreshAdminBadges = refreshAdminBadges;
})();
