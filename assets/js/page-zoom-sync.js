(function () {
  var STORAGE_KEY = 'crzrt_page_zoom';
  var WINDOW_NAME_PREFIX = 'crzrt_zoom:';
  var DESKTOP_BREAKPOINT = 1100;
  var DEFAULT_DESKTOP_ZOOM = 0.8;
  var DEFAULT_MOBILE_ZOOM = 1;
  var MIN_ZOOM = 0.25;
  var MAX_ZOOM = 3;

  function defaultEffectiveZoom() {
    return window.innerWidth >= DESKTOP_BREAKPOINT ? DEFAULT_DESKTOP_ZOOM : DEFAULT_MOBILE_ZOOM;
  }

  function clampZoom(value) {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
  }

  function getViewportScale() {
    return window.visualViewport && window.visualViewport.scale
      ? window.visualViewport.scale
      : 1;
  }

  function parseStoredZoom(raw) {
    var parsed = parseFloat(raw);
    if (Number.isFinite(parsed) && parsed > 0) {
      return clampZoom(parsed);
    }
    return null;
  }

  function readZoomFromUrl() {
    try {
      var params = new URLSearchParams(window.location.search);
      return parseStoredZoom(params.get('z'));
    } catch (error) {}

    return null;
  }

  function readZoomFromWindowName() {
    if (typeof window.name !== 'string' || window.name.indexOf(WINDOW_NAME_PREFIX) !== 0) {
      return null;
    }

    return parseStoredZoom(window.name.slice(WINDOW_NAME_PREFIX.length));
  }

  function readZoomFromSession() {
    try {
      return parseStoredZoom(sessionStorage.getItem(STORAGE_KEY));
    } catch (error) {}

    return null;
  }

  function readStoredEffectiveZoom() {
    return readZoomFromUrl()
      || readZoomFromWindowName()
      || readZoomFromSession();
  }

  function writeStoredEffectiveZoom(value) {
    var effective = clampZoom(value);

    try {
      window.name = WINDOW_NAME_PREFIX + String(effective);
    } catch (error) {}

    try {
      sessionStorage.setItem(STORAGE_KEY, String(effective));
    } catch (error) {}
  }

  function applyCssZoom(cssZoom) {
    var zoom = clampZoom(cssZoom);
    document.documentElement.style.zoom = String(zoom);
    document.documentElement.dataset.crzrtZoom = String(zoom);
    return zoom;
  }

  function getCssZoom() {
    var cssZoom = parseFloat(document.documentElement.style.zoom);
    if (Number.isFinite(cssZoom) && cssZoom > 0) {
      return cssZoom;
    }
    return currentCssZoom;
  }

  function getEffectiveZoom() {
    return clampZoom(getCssZoom() * getViewportScale());
  }

  function setEffectiveZoom(effectiveZoom) {
    currentCssZoom = applyCssZoom(effectiveZoom / getViewportScale());
    writeStoredEffectiveZoom(effectiveZoom);
    return currentCssZoom;
  }

  var storedEffectiveZoom = readStoredEffectiveZoom();
  var initialEffectiveZoom = storedEffectiveZoom !== null
    ? storedEffectiveZoom
    : defaultEffectiveZoom();
  var currentCssZoom = applyCssZoom(initialEffectiveZoom / getViewportScale());
  writeStoredEffectiveZoom(initialEffectiveZoom);

  function persistZoom() {
    writeStoredEffectiveZoom(getEffectiveZoom());
  }

  function appendZoomParam(href, effectiveZoom) {
    if (!href || href.charAt(0) === '#') {
      return href;
    }

    if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) {
      return href;
    }

    var hashIndex = href.indexOf('#');
    var hash = hashIndex >= 0 ? href.slice(hashIndex) : '';
    var base = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
    var queryIndex = base.indexOf('?');
    var path = queryIndex >= 0 ? base.slice(0, queryIndex) : base;
    var params = new URLSearchParams(queryIndex >= 0 ? base.slice(queryIndex + 1) : '');

    params.set('z', String(clampZoom(effectiveZoom)));
    var query = params.toString();

    return path + (query ? '?' + query : '') + hash;
  }

  function isInternalLink(link) {
    if (!link || !link.getAttribute) {
      return false;
    }

    if (link.target && link.target !== '_self') {
      return false;
    }

    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') {
      return false;
    }

    return !/^(https?:|mailto:|tel:|javascript:)/i.test(href);
  }

  function prepareInternalLink(link) {
    if (!isInternalLink(link)) {
      return;
    }

    link.setAttribute('href', appendZoomParam(link.getAttribute('href'), getEffectiveZoom()));
  }

  window.addEventListener('pagehide', persistZoom);
  window.addEventListener('beforeunload', persistZoom);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', persistZoom);
  }

  document.addEventListener('keydown', function (event) {
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }

    var effectiveZoom = getEffectiveZoom();
    var step = 0.1;
    var changed = false;

    if (event.key === '+' || event.key === '=' || event.code === 'NumpadAdd') {
      effectiveZoom = clampZoom(effectiveZoom + step);
      changed = true;
    } else if (event.key === '-' || event.code === 'NumpadSubtract') {
      effectiveZoom = clampZoom(effectiveZoom - step);
      changed = true;
    } else if (event.key === '0' || event.code === 'Numpad0') {
      effectiveZoom = defaultEffectiveZoom();
      changed = true;
    }

    if (!changed) {
      return;
    }

    setEffectiveZoom(effectiveZoom);
    event.preventDefault();
  });

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (!isInternalLink(link)) {
      return;
    }

    prepareInternalLink(link);
    persistZoom();
  }, true);

  function prepareAllInternalLinks() {
    document.querySelectorAll('a[href]').forEach(prepareInternalLink);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prepareAllInternalLinks);
  } else {
    prepareAllInternalLinks();
  }
})();
