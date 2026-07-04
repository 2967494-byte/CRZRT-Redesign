/**
 * Контент страницы «Новости» — загрузка из API / localStorage и отрисовка.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'crzrt_news_page_data';
  const CONTENT_PENDING_CLASS = 'news-content-pending';
  const CONTENT_READY_CLASS = 'news-content-ready';

  const DEFAULT_NEWS_PAGE = {
    hero: {
      background: '',
      title: 'Новости',
      subtitle: '',
      titleColor: '#575B6D',
      subtitleColor: '#FFFFFF',
      titleTop: 122,
      titleLeft: 70,
      subtitleTop: 213,
      subtitleLeft: 70
    },
    items: [
      {
        id: 'news_demo_1',
        image: '',
        title: 'Семинары по госзакупкам прошли в городе Альметьевск Республике Татарстан',
        date: '2026-03-26',
        text: '<p>Применительно к закупкам работ и услуг Минфин разъяснил, по каким признакам товар считается «поставляемым».</p>',
        active: true
      },
      {
        id: 'news_demo_2',
        image: '',
        title: 'Семинары по госзакупкам прошли в городе Альметьевск Республике Татарстан',
        date: '2026-03-24',
        text: '<p>Применительно к закупкам работ и услуг Минфин разъяснил, по каким признакам товар считается «поставляемым».</p>',
        active: true
      }
    ]
  };

  const isNewsPage = document.body.dataset.page === 'news';

  let currentNewsItems = [];
  let currentNewsPage = 1;
  const ITEMS_PER_PAGE = 4;

  if (isNewsPage) {
    document.documentElement.classList.add(CONTENT_PENDING_CLASS);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function multilineHtml(str) {
    return escapeHtml(str || '')
      .split('\n')
      .filter((line, i, arr) => line.length || i < arr.length - 1)
      .join('<br>');
  }

  function parseIsoDate(value) {
    if (!value || typeof value !== 'string') return null;
    const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
  }

  function formatNewsDateDisplay(value) {
    const date = parseIsoDate(value);
    if (!date) return String(value || '').trim();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}.${date.getFullYear()}`;
  }

  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return (tmp.textContent || tmp.innerText || '').trim();
  }

  function excerptFromHtml(html, max = 160) {
    const text = stripHtml(html);
    if (text.length <= max) return text;
    return `${text.slice(0, max - 1).trim()}…`;
  }

  function createNewsId() {
    return `news_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function normalizeNewsItem(raw, index) {
    const dateRaw = String(raw?.date || '').trim();
    const parsed = parseIsoDate(dateRaw);
    return {
      id: String(raw?.id || createNewsId() || `news_${index}`),
      image: String(raw?.image || '').trim(),
      title: String(raw?.title || '').trim(),
      date: parsed ? dateRaw : '',
      text: typeof raw?.text === 'string' ? raw.text : '',
      active: raw?.active !== false
    };
  }

  function migrateNewsPageData(raw) {
    const rawHero = raw?.hero && typeof raw.hero === 'object' ? raw.hero : {};
    const items = Array.isArray(raw?.items)
      ? raw.items.map((item, index) => normalizeNewsItem(item, index))
      : !raw
        ? DEFAULT_NEWS_PAGE.items.map((item) => ({ ...item }))
        : [];

    return {
      hero: {
        background: rawHero.background || '',
        title: rawHero.title || DEFAULT_NEWS_PAGE.hero.title,
        subtitle: rawHero.subtitle || DEFAULT_NEWS_PAGE.hero.subtitle,
        titleColor: rawHero.titleColor || DEFAULT_NEWS_PAGE.hero.titleColor,
        subtitleColor: rawHero.subtitleColor || DEFAULT_NEWS_PAGE.hero.subtitleColor,
        titleTop: rawHero.titleTop !== undefined ? parseInt(rawHero.titleTop, 10) : DEFAULT_NEWS_PAGE.hero.titleTop,
        titleLeft: rawHero.titleLeft !== undefined ? parseInt(rawHero.titleLeft, 10) : DEFAULT_NEWS_PAGE.hero.titleLeft,
        titleFontSize: rawHero.titleFontSize || '',
        titleFontWeight: rawHero.titleFontWeight || '',
        titleItalic: rawHero.titleItalic || false,
        titleUnderline: rawHero.titleUnderline || false,
        subtitleTop: rawHero.subtitleTop !== undefined ? parseInt(rawHero.subtitleTop, 10) : DEFAULT_NEWS_PAGE.hero.subtitleTop,
        subtitleLeft: rawHero.subtitleLeft !== undefined ? parseInt(rawHero.subtitleLeft, 10) : DEFAULT_NEWS_PAGE.hero.subtitleLeft,
        subtitleFontSize: rawHero.subtitleFontSize || '',
        subtitleFontWeight: rawHero.subtitleFontWeight || '',
        subtitleItalic: rawHero.subtitleItalic || false,
        subtitleUnderline: rawHero.subtitleUnderline || false
      },
      items
    };
  }

  function markNewsContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }

  function loadNewsDataFromLocal() {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateNewsPageData(JSON.parse(local));
    } catch (error) {
      console.warn('News: localStorage parse error', error);
    }
    return null;
  }

  async function loadNewsDataFromApi() {
    try {
      const resp = await fetch(`api/settings.php?key=${STORAGE_KEY}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data && typeof data === 'object' && Object.keys(data).length) {
          return migrateNewsPageData(data);
        }
      }
    } catch (error) {
      console.warn('News: API unavailable', error);
    }
    return null;
  }

  function applyTypographyStyles(el, size, weight, italic, underline) {
    if (!el) return;
    if (size) {
      el.style.fontSize = `clamp(calc(${size}px * 0.5), calc(${size}px * (100cqw / 1520)), ${size}px)`;
    } else {
      el.style.removeProperty('font-size');
    }
    if (weight) el.style.fontWeight = weight;
    else el.style.removeProperty('font-weight');
    if (italic) el.style.fontStyle = 'italic';
    else el.style.removeProperty('font-style');
    if (underline) el.style.textDecoration = 'underline';
    else el.style.removeProperty('text-decoration');
  }

  function getActiveNewsItems(items) {
    return (items || []).filter((item) => item && item.active !== false);
  }

  function renderNewsKnowledgeHero(hero) {
    const banner = document.querySelector('.news-knowledge-banner');
    const titleEl = document.querySelector('.news-knowledge-banner__title');
    const subtitleEl = document.querySelector('.news-knowledge-banner__subtitle');
    const graphicEl = document.querySelector('.news-knowledge-banner__graphic');
    if (!banner) return;
    banner.style.containerType = 'inline-size';
    const background = (hero?.background || '').trim();
    const hasCustomBanner = Boolean(background);
    const hasSubtitle = Boolean(String(hero?.subtitle || '').trim());

    if (titleEl) {
      titleEl.innerHTML = multilineHtml(hero?.title);
      titleEl.style.color = hero?.titleColor || DEFAULT_NEWS_PAGE.hero.titleColor;
      if (hero?.titleTop !== undefined) titleEl.style.top = `${hero.titleTop}px`;
      if (hero?.titleLeft !== undefined) {
        titleEl.style.left = `${hero.titleLeft}px`;
        titleEl.style.maxWidth = `calc(100% - ${hero.titleLeft}px - 10px)`;
      }
      applyTypographyStyles(titleEl, hero?.titleFontSize, hero?.titleFontWeight, hero?.titleItalic, hero?.titleUnderline);
    }

    if (subtitleEl) {
      subtitleEl.innerHTML = multilineHtml(hero?.subtitle);
      subtitleEl.style.color = hero?.subtitleColor || DEFAULT_NEWS_PAGE.hero.subtitleColor;
      if (hero?.subtitleTop !== undefined) subtitleEl.style.top = `${hero.subtitleTop}px`;
      if (hero?.subtitleLeft !== undefined) {
        subtitleEl.style.left = `${hero.subtitleLeft}px`;
        subtitleEl.style.maxWidth = `calc(100% - ${hero.subtitleLeft}px - 10px)`;
      }
      applyTypographyStyles(subtitleEl, hero?.subtitleFontSize, hero?.subtitleFontWeight, hero?.subtitleItalic, hero?.subtitleUnderline);
      subtitleEl.hidden = !hasSubtitle;
    }

    if (banner) {
      if (hasCustomBanner) {
        banner.style.backgroundImage = `url('${background.replace(/'/g, "\\'")}')`;
        banner.classList.add('news-knowledge-banner--custom-bg');
      } else {
        banner.style.backgroundImage = '';
        banner.classList.remove('news-knowledge-banner--custom-bg');
      }
    }

    if (graphicEl) graphicEl.classList.add('is-hidden');
  }

  function renderHero(hero) {
    const banner = document.querySelector('.consulting-hero');
    const titleEl = document.querySelector('.consulting-hero-title');
    const subtitleEl = document.querySelector('.consulting-hero-subtitle');
    const graphicEl = document.querySelector('.consulting-banner__graphic');
    const background = (hero?.background || '').trim();
    const hasCustomBanner = Boolean(background);
    const hasSubtitle = Boolean(String(hero?.subtitle || '').trim());

    if (titleEl) {
      titleEl.innerHTML = multilineHtml(hero?.title);
      titleEl.style.color = hero?.titleColor || DEFAULT_NEWS_PAGE.hero.titleColor;
      if (hero?.titleTop !== undefined) titleEl.style.top = `${hero.titleTop}px`;
      if (hero?.titleLeft !== undefined) {
        titleEl.style.left = `${hero.titleLeft}px`;
        titleEl.style.maxWidth = `calc(100% - ${hero.titleLeft}px - 10px)`;
      }
      applyTypographyStyles(titleEl, hero?.titleFontSize, hero?.titleFontWeight, hero?.titleItalic, hero?.titleUnderline);
    }

    if (subtitleEl) {
      subtitleEl.innerHTML = multilineHtml(hero?.subtitle);
      subtitleEl.style.color = hero?.subtitleColor || DEFAULT_NEWS_PAGE.hero.subtitleColor;
      if (hero?.subtitleTop !== undefined) subtitleEl.style.top = `${hero.subtitleTop}px`;
      if (hero?.subtitleLeft !== undefined) {
        subtitleEl.style.left = `${hero.subtitleLeft}px`;
        subtitleEl.style.maxWidth = `calc(100% - ${hero.subtitleLeft}px - 10px)`;
      }
      applyTypographyStyles(subtitleEl, hero?.subtitleFontSize, hero?.subtitleFontWeight, hero?.subtitleItalic, hero?.subtitleUnderline);
      subtitleEl.hidden = !hasSubtitle;
    }

    if (banner) {
      if (hasCustomBanner) {
        banner.style.backgroundImage = `url('${background.replace(/'/g, "\\'")}')`;
        banner.classList.add('consulting-hero--custom-bg');
      } else {
        banner.style.backgroundImage = '';
        banner.classList.remove('consulting-hero--custom-bg');
      }
    }

    if (graphicEl) graphicEl.classList.add('is-hidden');
  }

  function renderNewsList(items) {
    const container = document.getElementById('news-list-container');
    if (!container) return;

    const active = getActiveNewsItems(items);

    if (!active.length) {
      container.innerHTML = '<p class="news-page-empty">Новостей пока нет.</p>';
      return;
    }

    const totalPages = Math.ceil(active.length / ITEMS_PER_PAGE);
    if (currentNewsPage > totalPages) {
      currentNewsPage = totalPages;
    }
    if (currentNewsPage < 1) {
      currentNewsPage = 1;
    }

    const pageItems = active.slice((currentNewsPage - 1) * ITEMS_PER_PAGE, currentNewsPage * ITEMS_PER_PAGE);

    const itemsHtml = pageItems
      .map((item) => {
        const imageHtml = item.image
          ? `<img src="${escapeHtml(item.image)}" alt="" class="news-item__image" width="511" height="474" loading="lazy" decoding="async">`
          : '<div class="news-item__image news-item__image--placeholder" aria-hidden="true"></div>';

        return `<article class="news-item">
          ${imageHtml}
          <div class="news-item__body">
            <time class="news-item__date" datetime="${escapeHtml(item.date)}">${escapeHtml(formatNewsDateDisplay(item.date))}</time>
            <h2 class="news-item__title">${escapeHtml(item.title)}</h2>
            <div class="news-item__text">
              <div class="news-item__text-wrap" id="news_text_wrap_${item.id}" onclick="NewsContent.toggleExpandNews('${item.id}')">
                ${item.text || ''}
              </div>
              <div class="news-item__text-fade" id="news_text_fade_${item.id}" style="display: none;" onclick="NewsContent.toggleExpandNews('${item.id}')"></div>
              <button type="button" class="news-item__more-btn" id="news_more_btn_${item.id}" style="display: none;" onclick="NewsContent.toggleExpandNews('${item.id}')">Читать далее</button>
            </div>
          </div>
        </article>`;
      })
      .join('');

    let paginationHtml = '';
    if (totalPages > 1) {
      const prevDisabled = currentNewsPage === 1 ? 'disabled' : '';
      const nextDisabled = currentNewsPage === totalPages ? 'disabled' : '';

      let buttonsHtml = '';
      for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentNewsPage ? ' news-pagination__btn--active' : '';
        buttonsHtml += `<button type="button" class="news-pagination__btn${activeClass}" onclick="NewsContent.changeNewsPage(${i})">${i}</button>`;
      }

      paginationHtml = `
        <div class="news-pagination">
          <button type="button" class="news-pagination__btn" ${prevDisabled} onclick="NewsContent.changeNewsPage(${currentNewsPage - 1})" aria-label="Предыдущая страница">←</button>
          ${buttonsHtml}
          <button type="button" class="news-pagination__btn" ${nextDisabled} onclick="NewsContent.changeNewsPage(${currentNewsPage + 1})" aria-label="Следующая страница">→</button>
        </div>`;
    }

    container.innerHTML = `<div style="display:flex; flex-direction:column; gap:60px;">${itemsHtml}</div>${paginationHtml}`;

    // After adding HTML to container, check heights to show/hide "Read more" buttons
    pageItems.forEach((item) => {
      const wrapEl = document.getElementById(`news_text_wrap_${item.id}`);
      const fadeEl = document.getElementById(`news_text_fade_${item.id}`);
      const btnEl = document.getElementById(`news_more_btn_${item.id}`);
      if (wrapEl && wrapEl.scrollHeight > 140) {
        if (fadeEl) fadeEl.style.display = 'block';
        if (btnEl) btnEl.style.display = 'inline-block';
      }
    });
  }

  function changeNewsPage(pageNum) {
    currentNewsPage = pageNum;
    renderNewsList(currentNewsItems);

    const listSection = document.querySelector('.news-list-section');
    if (listSection) {
      listSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function toggleExpandNews(id) {
    const wrapEl = document.getElementById(`news_text_wrap_${id}`);
    const fadeEl = document.getElementById(`news_text_fade_${id}`);
    const btnEl = document.getElementById(`news_more_btn_${id}`);
    if (!wrapEl) return;

    if (wrapEl.classList.contains('is-expanded')) {
      // Collapse
      wrapEl.style.maxHeight = wrapEl.scrollHeight + 'px';
      wrapEl.offsetHeight; // force reflow
      wrapEl.classList.remove('is-expanded');
      wrapEl.style.maxHeight = '140px';
      if (fadeEl) {
        fadeEl.style.display = 'block';
        fadeEl.offsetHeight; // force reflow
        fadeEl.style.opacity = '1';
      }
      if (btnEl) btnEl.textContent = 'Читать далее';
    } else {
      // Expand
      wrapEl.classList.add('is-expanded');
      wrapEl.style.maxHeight = wrapEl.scrollHeight + 'px';
      if (fadeEl) {
        fadeEl.style.opacity = '0';
        setTimeout(() => {
          if (wrapEl.classList.contains('is-expanded')) {
            fadeEl.style.display = 'none';
          }
        }, 300);
      }
      if (btnEl) btnEl.textContent = 'Свернуть';
    }
  }

  function renderLandingNewsPreview(items, options) {
    const list = document.getElementById('landingNewsList');
    if (!list) return;

    const limit = options?.limit || 3;
    const active = getActiveNewsItems(items).slice(0, limit);

    list.innerHTML = active
      .map((item) => `<li class="news-list__item">
        <span class="news-date">${escapeHtml(formatNewsDateDisplay(item.date))}</span>
        <p>${escapeHtml(excerptFromHtml(item.text) || item.title)}</p>
      </li>`)
      .join('');

    const allLink = document.getElementById('landingAllNewsLink');
    if (allLink) {
      allLink.href = 'news.html';
      window.CrzrtZoomSync?.prepareInternalLink?.(allLink);
    }
  }

  function renderNewsPage(data) {
    currentNewsItems = data.items || [];
    renderHero(data.hero);
    renderNewsList(currentNewsItems);
  }

  async function initNewsContent() {
    try {
      const localData = loadNewsDataFromLocal();
      const initialData = localData || migrateNewsPageData(null);
      renderNewsPage(initialData);
      markNewsContentReady();

      const apiData = await loadNewsDataFromApi();
      if (apiData) {
        renderNewsPage(apiData);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
        } catch (error) {
          console.warn('News: localStorage update failed', error);
        }
      }

      document.dispatchEvent(new CustomEvent('newsContentReady', { detail: initialData }));
      if (apiData) {
        document.dispatchEvent(new CustomEvent('newsContentReady', { detail: apiData }));
      }
    } catch (error) {
      console.error('News content init failed', error);
      markNewsContentReady();
    }
  }

  window.NewsContent = {
    STORAGE_KEY,
    DEFAULT_NEWS_PAGE,
    migrateNewsPageData,
    normalizeNewsItem,
    loadNewsDataFromApi,
    loadNewsDataFromLocal,
    renderNewsPage,
    renderLandingNewsPreview,
    formatNewsDateDisplay,
    getActiveNewsItems,
    excerptFromHtml,
    changeNewsPage,
    toggleExpandNews
  };

  if (isNewsPage) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNewsContent);
    } else {
      initNewsContent();
    }
  }
})();
