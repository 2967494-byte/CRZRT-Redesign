(function () {
  var STORAGE_KEY = 'crzrt_page_zoom';
  var WINDOW_NAME_PREFIX = 'crzrt_zoom:';
  var DESKTOP_BREAKPOINT = 992;
  var DEFAULT_DESKTOP_ZOOM = 0.8;
  var DEFAULT_MOBILE_ZOOM = 1;
  var MIN_ZOOM = 0.25;
  var MAX_ZOOM = 3;
  function defaultCssZoom() {
    return window.innerWidth >= DESKTOP_BREAKPOINT ? DEFAULT_DESKTOP_ZOOM : DEFAULT_MOBILE_ZOOM;
  }
  function clampZoom(value) {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
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
  function readStoredCssZoom() {
    return readZoomFromUrl() || readZoomFromWindowName() || readZoomFromSession();
  }
  function writeStoredCssZoom(value) {
    var cssZoom = clampZoom(value);
    try {
      window.name = WINDOW_NAME_PREFIX + String(cssZoom);
    } catch (error) {}
    try {
      sessionStorage.setItem(STORAGE_KEY, String(cssZoom));
    } catch (error) {}
  }
  function applyCssZoom(cssZoom) {
    var zoom = clampZoom(cssZoom);
    document.documentElement.style.zoom = String(zoom);
    document.documentElement.style.setProperty('--crzrt-zoom', String(zoom));
    document.documentElement.dataset.crzrtZoom = String(zoom);
    
    var header = document.querySelector('.header');
    if (header) {
      if (zoom !== 1 && window.innerWidth >= DESKTOP_BREAKPOINT) {
        header.style.width = document.body.scrollWidth + 'px';
      } else {
        header.style.width = '100%';
      }
    }
    
    return zoom;
  }
  
  window.addEventListener('resize', function() {
    var header = document.querySelector('.header');
    if (header && currentCssZoom !== 1 && window.innerWidth >= DESKTOP_BREAKPOINT) {
      header.style.width = document.body.scrollWidth + 'px';
    } else if (header) {
      header.style.width = '100%';
    }
  });
  function getCssZoom() {
    var cssZoom = parseFloat(document.documentElement.style.zoom);
    if (Number.isFinite(cssZoom) && cssZoom > 0) {
      return cssZoom;
    }
    return currentCssZoom;
  }
  function setCssZoom(cssZoom) {
    currentCssZoom = applyCssZoom(cssZoom);
    writeStoredCssZoom(currentCssZoom);
    return currentCssZoom;
  }
  var storedCssZoom = readStoredCssZoom();
  var initialCssZoom = storedCssZoom !== null ? storedCssZoom : defaultCssZoom();
  var currentCssZoom = setCssZoom(initialCssZoom);
  function persistZoom() {
    writeStoredCssZoom(getCssZoom());
  }
  function appendZoomParam(href, cssZoom) {
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
    params.set('z', String(clampZoom(cssZoom)));
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
    link.setAttribute('href', appendZoomParam(link.getAttribute('href'), getCssZoom()));
  }
  function prepareAllInternalLinks() {
    document.querySelectorAll('a[href]').forEach(prepareInternalLink);
  }
  window.addEventListener('pagehide', persistZoom);
  window.addEventListener('beforeunload', persistZoom);
  document.addEventListener('keydown', function (event) {
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }
    var cssZoom = getCssZoom();
    var step = 0.1;
    var changed = false;
    if (event.key === '+' || event.key === '=' || event.code === 'NumpadAdd') {
      cssZoom = clampZoom(cssZoom + step);
      changed = true;
    } else if (event.key === '-' || event.code === 'NumpadSubtract') {
      cssZoom = clampZoom(cssZoom - step);
      changed = true;
    } else if (event.key === '0' || event.code === 'Numpad0') {
      cssZoom = defaultCssZoom();
      changed = true;
    }
    if (!changed) {
      return;
    }
    setCssZoom(cssZoom);
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
  document.addEventListener('landingContentReady', prepareAllInternalLinks);
  document.addEventListener('ecpContentReady', prepareAllInternalLinks);
  document.addEventListener('consultingContentReady', prepareAllInternalLinks);
  document.addEventListener('supportContentReady', prepareAllInternalLinks);
  document.addEventListener('obuchenieContentReady', prepareAllInternalLinks);
  document.addEventListener('newsContentReady', prepareAllInternalLinks);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prepareAllInternalLinks);
  } else {
    prepareAllInternalLinks();
  }
  window.CrzrtZoomSync = {
    getCssZoom: getCssZoom,
    setCssZoom: setCssZoom,
    prepareAllInternalLinks: prepareAllInternalLinks,
    appendZoomParam: appendZoomParam
  };
})();