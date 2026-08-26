window.AsmtApi = (function () {
  function getCsrfToken() {
    const match = document.cookie.match(/(?:^|; )asmt_csrf_token=([^;]*)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    try {
      return sessionStorage.getItem('asmt_csrf_token') || '';
    } catch (_) {
      return '';
    }
  }

  async function request(url, options) {
    const opts = options || {};
    const method = (opts.method || 'GET').toUpperCase();
    const headers = Object.assign({ Accept: 'application/json' }, opts.headers || {});

    // Attach CSRF Token on mutating requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const csrf = getCsrfToken();
      if (csrf) {
        headers['X-CSRF-Token'] = csrf;
      }
    }

    if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(opts.body);
    }

    const res = await fetch(url, Object.assign({ credentials: 'same-origin' }, opts, { headers }));
    
    // Handle 419 CSRF mismatch
    if (res.status === 419) {
      try {
        sessionStorage.removeItem('asmt_csrf_token');
      } catch (_e) {}
      // Refresh page to sync CSRF token cookie seamlessly
      setTimeout(() => {
        window.location.reload();
      }, 500);
      throw new Error('Токен безопасности обновлен. Страница перезагружается...');
    }

    const data = await res.json().catch(() => ({}));

    // Cache CSRF token if returned in response
    if (data && data.csrfToken) {
      try {
        sessionStorage.setItem('asmt_csrf_token', String(data.csrfToken));
      } catch (_e) {}
    }

    if (!res.ok || data.success === false) {
      const err = new Error(data.error || ('HTTP ' + res.status));
      err.status = res.status;
      err.payload = data;
      throw err;
    }
    return data;
  }

  return {
    get: (url) => request(url),
    post: (url, body) => request(url, { method: 'POST', body }),
    setCsrf: (token) => {
      try {
        sessionStorage.setItem('asmt_csrf_token', String(token || ''));
      } catch (_e) {}
    }
  };
})();
