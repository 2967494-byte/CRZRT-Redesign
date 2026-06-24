/**
 * Контент страницы «Документы» — загрузка из API / localStorage и динамический рендеринг блоков.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'crzrt_knowledge_page_data';
  const CONTENT_PENDING_CLASS = 'knowledge-content-pending';
  const CONTENT_READY_CLASS = 'knowledge-content-ready';

  const PDF_ICON_SVG = `
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" class="knowledge-download-icon-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1.5 1h14.5l6.5 6.5v19.5c0 .828-.672 1.5-1.5 1.5H1.5C.672 28.5 0 27.828 0 27V2C0 1.172.672.5 1.5.5z" fill="#FFF" stroke="#0FAA4B" stroke-width="2"/>
      <path d="M16 1v6h6" stroke="#0FAA4B" stroke-width="2" stroke-linejoin="round"/>
      <rect y="12" width="24" height="10" rx="1" fill="#0FAA4B"/>
      <text x="12" y="20" fill="#FFF" font-family="'Google Sans', 'Inter', sans-serif" font-size="7" font-weight="bold" text-anchor="middle">PDF</text>
    </svg>
  `;

  const ARROW_SVG = `
    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 1L11 11M11 11V3M11 11H3" stroke="#0FAA4B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const DEFAULT_KNOWLEDGE_PAGE = {
    hero: {
      background: '',
      title: 'Документы',
      subtitle: 'Здесь вы найдете все официальные документы для скачивания. Файлы регулярно обновляются.',
      titleColor: '#575B6D',
      subtitleColor: '#FFFFFF',
      titleTop: 122,
      titleLeft: 70,
      subtitleTop: 213,
      subtitleLeft: 70
    },
    blocks: [
      {
        id: 'default_1',
        type: 'header',
        value: 'Основные сведения'
      },
      {
        id: 'default_2',
        type: 'text',
        value: 'Акционерное общество «Центр развития закупок Республики Татарстан» является подведомственной организацией Государственного комитета Республики Татарстан по закупкам.'
      },
      {
        id: 'default_3',
        type: 'file',
        title: 'Устав АО «Центр развития закупок РТ»',
        file: '#',
        fileName: 'ustav_crzrt.pdf'
      }
    ]
  };

  document.documentElement.classList.add(CONTENT_PENDING_CLASS);

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

  function migrateKnowledgePageData(raw) {
    const rawHero = raw?.hero && typeof raw.hero === 'object' ? raw.hero : {};
    const blocks = Array.isArray(raw?.blocks) ? raw.blocks : [...DEFAULT_KNOWLEDGE_PAGE.blocks];

    return {
      hero: {
        background: rawHero.background || '',
        title: rawHero.title || DEFAULT_KNOWLEDGE_PAGE.hero.title,
        subtitle: rawHero.subtitle || DEFAULT_KNOWLEDGE_PAGE.hero.subtitle,
        titleColor: rawHero.titleColor || DEFAULT_KNOWLEDGE_PAGE.hero.titleColor,
        subtitleColor: rawHero.subtitleColor || DEFAULT_KNOWLEDGE_PAGE.hero.subtitleColor,
        titleTop: rawHero.titleTop !== undefined ? parseInt(rawHero.titleTop, 10) : DEFAULT_KNOWLEDGE_PAGE.hero.titleTop,
        titleLeft: rawHero.titleLeft !== undefined ? parseInt(rawHero.titleLeft, 10) : DEFAULT_KNOWLEDGE_PAGE.hero.titleLeft,
        subtitleTop: rawHero.subtitleTop !== undefined ? parseInt(rawHero.subtitleTop, 10) : DEFAULT_KNOWLEDGE_PAGE.hero.subtitleTop,
        subtitleLeft: rawHero.subtitleLeft !== undefined ? parseInt(rawHero.subtitleLeft, 10) : DEFAULT_KNOWLEDGE_PAGE.hero.subtitleLeft
      },
      blocks: blocks.map((b, index) => {
        return {
          id: b.id || `block_${Date.now()}_${index}`,
          type: b.type || 'text',
          value: b.value !== undefined ? String(b.value) : '',
          title: b.title !== undefined ? String(b.title) : '',
          file: b.file !== undefined ? String(b.file) : '',
          fileName: b.fileName !== undefined ? String(b.fileName) : ''
        };
      })
    };
  }

  function markKnowledgeContentReady() {
    document.documentElement.classList.remove(CONTENT_PENDING_CLASS);
    document.documentElement.classList.add(CONTENT_READY_CLASS);
  }

  function loadKnowledgeDataFromLocal() {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) return migrateKnowledgePageData(JSON.parse(local));
    } catch (error) {
      console.warn('Knowledge: localStorage parse error', error);
    }
    return null;
  }

  async function loadKnowledgeDataFromApi() {
    try {
      const resp = await fetch(`api/settings.php?key=${STORAGE_KEY}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data && typeof data === 'object' && Object.keys(data).length) {
          return migrateKnowledgePageData(data);
        }
      }
    } catch (error) {
      console.warn('Knowledge: API unavailable', error);
    }
    return null;
  }

  function renderHero(hero) {
    const banner = document.querySelector('.consulting-hero');
    const titleEl = document.querySelector('.consulting-hero-title');
    const subtitleEl = document.querySelector('.consulting-hero-subtitle');
    const graphicEl = document.querySelector('.consulting-banner__graphic');
    const background = (hero?.background || '').trim();
    const hasCustomBanner = Boolean(background);

    if (titleEl) {
      titleEl.innerHTML = multilineHtml(hero?.title);
      titleEl.style.color = hero?.titleColor || DEFAULT_KNOWLEDGE_PAGE.hero.titleColor;
      if (hero?.titleTop !== undefined) titleEl.style.top = `${hero.titleTop}px`;
      if (hero?.titleLeft !== undefined) titleEl.style.left = `${hero.titleLeft}px`;
    }
    if (subtitleEl) {
      subtitleEl.innerHTML = multilineHtml(hero?.subtitle);
      subtitleEl.style.color = hero?.subtitleColor || DEFAULT_KNOWLEDGE_PAGE.hero.subtitleColor;
      if (hero?.subtitleTop !== undefined) subtitleEl.style.top = `${hero.subtitleTop}px`;
      if (hero?.subtitleLeft !== undefined) subtitleEl.style.left = `${hero.subtitleLeft}px`;
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

  function renderBlocks(blocks) {
    const container = document.getElementById('knowledge-blocks-container');
    if (!container) return;

    container.innerHTML = '';

    blocks.forEach((block) => {
      if (block.type === 'header') {
        const headerEl = document.createElement('h2');
        headerEl.className = 'knowledge-header';
        headerEl.textContent = block.value || '';
        container.appendChild(headerEl);
      } else if (block.type === 'text') {
        const textEl = document.createElement('p');
        textEl.className = 'knowledge-text';
        textEl.textContent = block.value || '';
        container.appendChild(textEl);
      } else if (block.type === 'file') {
        const fileCard = document.createElement('div');
        fileCard.className = 'knowledge-file-card';

        const fileTitle = document.createElement('h3');
        fileTitle.className = 'knowledge-file-title';
        fileTitle.textContent = block.title || 'Документ';

        const downloadLink = document.createElement('a');
        downloadLink.className = 'knowledge-download-btn';
        downloadLink.href = block.file || '#';
        if (block.file && block.file !== '#') {
          downloadLink.setAttribute('download', block.fileName || '');
          downloadLink.setAttribute('target', '_blank');
        }

        downloadLink.innerHTML = `
          <span class="knowledge-download-icon">${PDF_ICON_SVG}</span>
          <span class="knowledge-download-text">скачать</span>
          <span class="knowledge-download-arrow">${ARROW_SVG}</span>
        `;

        fileCard.appendChild(fileTitle);
        fileCard.appendChild(downloadLink);
        container.appendChild(fileCard);
      }
    });
  }

  function renderKnowledgePage(data) {
    renderHero(data.hero);
    renderBlocks(data.blocks);
  }

  async function initKnowledgeContent() {
    try {
      const localData = loadKnowledgeDataFromLocal();
      const initialData = localData || migrateKnowledgePageData(null);
      renderKnowledgePage(initialData);
      markKnowledgeContentReady();

      const apiData = await loadKnowledgeDataFromApi();
      if (apiData) {
        renderKnowledgePage(apiData);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
        } catch (error) {
          console.warn('Knowledge: localStorage update failed', error);
        }
      }
    } catch (error) {
      console.error('Knowledge content init failed', error);
      markKnowledgeContentReady();
    }
  }

  window.KnowledgeContent = {
    STORAGE_KEY,
    DEFAULT_KNOWLEDGE_PAGE,
    migrateKnowledgePageData,
    loadKnowledgeDataFromApi,
    loadKnowledgeDataFromLocal,
    renderKnowledgePage
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKnowledgeContent);
  } else {
    initKnowledgeContent();
  }
})();
