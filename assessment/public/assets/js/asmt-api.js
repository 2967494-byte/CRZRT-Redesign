window.AsmtApi = (function () {
  let storedCsrf = '';
  try {
    storedCsrf = sessionStorage.getItem('asmt_csrf_token') || '';
  } catch (_e) {}

  async function request(url, options) {
    const opts = options || {};
    const method = (opts.method || 'GET').toUpperCase();
    const headers = Object.assign({ Accept: 'application/json' }, opts.headers || {});

    // Attach CSRF Token on mutating requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && storedCsrf) {
      headers['X-CSRF-Token'] = storedCsrf;
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
      location.href = 'login.html';
      throw new Error('Сессия безопасности обновлена. Пожалуйста, выполните вход.');
    }

    const data = await res.json().catch(() => ({}));

    // Cache CSRF token if returned in response
    if (data && data.csrfToken) {
      storedCsrf = String(data.csrfToken);
      try {
        sessionStorage.setItem('asmt_csrf_token', storedCsrf);
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
      storedCsrf = String(token || '');
      try {
        sessionStorage.setItem('asmt_csrf_token', storedCsrf);
      } catch (_e) {}
    }
  };
})();
