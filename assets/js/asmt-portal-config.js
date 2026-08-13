/**
 * Assessment entry points from main portal login modal.
 * Production default: https://test.zakupki.tatar
 * Local override when portal is opened from localhost.
 */
(function () {
  var host = (window.location && window.location.hostname) || '';
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '';
  var base = isLocal ? 'http://localhost:8080' : 'https://test.zakupki.tatar';

  window.ASMT_PORTAL = {
    baseUrl: base,
    loginUrl: base.replace(/\/$/, '') + '/login.html',
    registerUrl: base.replace(/\/$/, '') + '/register.html',
  };

  function apply() {
    var login = document.getElementById('asmtLoginLink');
    var reg = document.getElementById('asmtRegisterLink');
    if (login) login.href = window.ASMT_PORTAL.loginUrl;
    if (reg) reg.href = window.ASMT_PORTAL.registerUrl;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
