/**
 * AfrikaSport365 - Enhanced Dashboard JavaScript
 * Manages all 12 tabs with dynamic content editing
 */

(function() {
  'use strict';

  let contentData = null;

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupTabSwitching();
    loadContent();
    setupFormSubmissions();
    setupDynamicLists();
  }

  /**
   * Tab Switching Logic
   */
  function setupTabSwitching() {
    const tabLinks = document.querySelectorAll('.tablink');
    tabLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (link.classList.contains('disabled')) return;
        
        // Remove active from all
        document.querySelectorAll('.tablink').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        
        // Add active to clicked
        link.classList.add('active');
        const tabId = 'tab-' + link.dataset.tab;
        document.getElementById(tabId)?.classList.add('active');
      });
    });
  }

  /**
   * Load content.json data
   */
  async function loadContent() {
    try {
      const response = await fetch('/data/content.json?' + Date.now());
      if (!response.ok) throw new Error('Failed to load content');
      
      contentData = await response.json();
      populateAllForms();
      showNotice('Contenido cargado correctamente', 'success');
    } catch (error) {
      console.error('Error loading content:', error);
      showNotice('Error cargando contenido: ' + error.message, 'error');
    }
  }

  /**
   * Populate all forms with loaded data
   */
  function populateAllForms() {
    if (!contentData) return;

    // Hero form
    populateForm('form-hero', contentData);
    
    // Breaking News
    populateBreakingNews();
    
    // Latest News
    populateLatestNews();
    
    // Categories
    populateCategories();
    
    // AFCON Spotlight
    populateAFCON();
    
    // Analysis
    populateAnalysis();
    
    // Athletes
    populateAthletes();
    
    // Multimedia
    populateMultimedia();
    
    // About
    populateAbout();
    
    // Navigation
    populateNavigation();
    
    // Footer
    populateFooter();
    
    // Ads
    populateForm('form-ads', contentData);
    
    // Legacy
    populateForm('form-site-config', contentData);
  }

  /**
   * Generic form population using dot notation
   */
  function populateForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form) return;

    const inputs = form.querySelectorAll('[name]');
    inputs.forEach(input => {
      const value = getNestedValue(data, input.name);
      if (value !== undefined) {
        if (input.type === 'checkbox') {
          input.checked = !!value;
        } else {
          input.value = value;
        }
      }
    });
  }

  /**
   * Get nested object value by dot notation path
   */
  function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  /**
   * Set nested object value by dot notation path
   */
  function setNestedValue(obj, path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((acc, part) => {
      if (!acc[part]) acc[part] = {};
      return acc[part];
    }, obj);
    target[last] = value;
  }

  /**
   * Breaking News - Dynamic List
   */
  function populateBreakingNews() {
    const container = document.getElementById('breaking-list');
    if (!container || !contentData.breakingNews) return;

    container.innerHTML = '';
    contentData.breakingNews.forEach((item, index) => {
      const div = createBreakingNewsItem(item, index);
      container.appendChild(div);
    });
  }

  function createBreakingNewsItem(text = '', index) {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Noticia #${index + 1}</span>
        <button type="button" class="remove-item-btn" onclick="removeBreakingNews(${index})">Eliminar</button>
      </div>
      <label>
        Texto de la Noticia
        <input type="text" name="breaking-${index}" value="${escapeHtml(text)}" required>
      </label>
    `;
    return div;
  }

  window.removeBreakingNews = function(index) {
    if (!contentData.breakingNews) return;
    contentData.breakingNews.splice(index, 1);
    populateBreakingNews();
  };

  document.getElementById('add-breaking')?.addEventListener('click', () => {
    if (!contentData.breakingNews) contentData.breakingNews = [];
    contentData.breakingNews.push('Nueva noticia urgente');
    populateBreakingNews();
  });

  /**
   * Latest News - Featured + Grid
   */
  function populateLatestNews() {
    const form = document.getElementById('form-latest-news');
    if (!form || !contentData.latestNews) return;

    // Populate section headers
    populateForm('form-latest-news', contentData);

    // Populate featured article
    if (contentData.latestNews.featured) {
      const featured = contentData.latestNews.featured;
      form.querySelector('[name="featured.slug"]').value = featured.slug || '';
      form.querySelector('[name="featured.image"]').value = featured.image || '';
      form.querySelector('[name="featured.category"]').value = featured.category || '';
      form.querySelector('[name="featured.categoryColor"]').value = featured.categoryColor || '#ef4444';
      form.querySelector('[name="featured.title"]').value = featured.title || '';
      form.querySelector('[name="featured.excerpt"]').value = featured.excerpt || '';
      form.querySelector('[name="featured.meta.date"]').value = featured.meta?.date || '';
      form.querySelector('[name="featured.meta.author"]').value = featured.meta?.author || '';
      form.querySelector('[name="featured.meta.comments"]').value = featured.meta?.comments || '';
    }

    // Populate grid articles
    const container = document.getElementById('grid-articles');
    if (!container) return;

    container.innerHTML = '';
    if (contentData.latestNews.grid) {
      contentData.latestNews.grid.forEach((article, index) => {
        const div = createGridArticleItem(article, index);
        container.appendChild(div);
      });
    }
  }

  function createGridArticleItem(article = {}, index) {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Artículo #${index + 1}</span>
        <button type="button" class="remove-item-btn" onclick="removeGridArticle(${index})">Eliminar</button>
      </div>
      <div class="form-row">
        <label>
          Slug
          <input type="text" name="grid-${index}-slug" value="${escapeHtml(article.slug || '')}" required>
        </label>
        <label>
          Imagen URL
          <input type="text" name="grid-${index}-image" value="${escapeHtml(article.image || '')}" required>
        </label>
      </div>
      <div class="form-row">
        <label>
          Categoría
          <input type="text" name="grid-${index}-category" value="${escapeHtml(article.category || '')}" required>
        </label>
        <label>
          Color
          <input type="color" name="grid-${index}-categoryColor" value="${article.categoryColor || '#ef4444'}">
        </label>
      </div>
      <label>
        Título
        <input type="text" name="grid-${index}-title" value="${escapeHtml(article.title || '')}" required>
      </label>
      <label>
        Extracto
        <textarea name="grid-${index}-excerpt" rows="2" required>${escapeHtml(article.excerpt || '')}</textarea>
      </label>
      <div class="form-row">
        <label>
          Fecha
          <input type="text" name="grid-${index}-date" value="${escapeHtml(article.meta?.date || '')}">
        </label>
        <label>
          Autor
          <input type="text" name="grid-${index}-author" value="${escapeHtml(article.meta?.author || '')}">
        </label>
      </div>
    `;
    return div;
  }

  window.removeGridArticle = function(index) {
    if (!contentData.latestNews?.grid) return;
    contentData.latestNews.grid.splice(index, 1);
    populateLatestNews();
  };

  document.getElementById('add-grid-article')?.addEventListener('click', () => {
    if (!contentData.latestNews) contentData.latestNews = {};
    if (!contentData.latestNews.grid) contentData.latestNews.grid = [];
    contentData.latestNews.grid.push({
      slug: '',
      image: '',
      category: '',
      categoryColor: '#ef4444',
      title: '',
      excerpt: '',
      meta: { date: '', author: '' }
    });
    populateLatestNews();
  });

  /**
   * Categories - Sports Categories
   */
  function populateCategories() {
    const form = document.getElementById('form-categories');
    if (!form || !contentData.sportsCategories) return;

    populateForm('form-categories', contentData);

    const container = document.getElementById('categories-list');
    if (!container) return;

    container.innerHTML = '';
    if (contentData.sportsCategories.categories) {
      contentData.sportsCategories.categories.forEach((cat, index) => {
        const div = createCategoryItem(cat, index);
        container.appendChild(div);
      });
    }
  }

  function createCategoryItem(cat = {}, index) {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">${escapeHtml(cat.name || 'Categoría')} #${index + 1}</span>
        <button type="button" class="remove-item-btn" onclick="removeCategory(${index})">Eliminar</button>
      </div>
      <div class="form-row">
        <label>
          Nombre
          <input type="text" name="cat-${index}-name" value="${escapeHtml(cat.name || '')}" required>
        </label>
        <label>
          Icono (emoji)
          <input type="text" name="cat-${index}-icon" value="${escapeHtml(cat.icon || '')}" maxlength="4">
        </label>
      </div>
      <label>
        Imagen URL
        <input type="text" name="cat-${index}-image" value="${escapeHtml(cat.image || '')}" required>
      </label>
      <div class="form-row thirds">
        <label>
          Slug
          <input type="text" name="cat-${index}-slug" value="${escapeHtml(cat.slug || '')}" required>
        </label>
        <label>
          # Artículos
          <input type="number" name="cat-${index}-articleCount" value="${cat.articleCount || 0}" min="0">
        </label>
        <label>
          Color
          <input type="color" name="cat-${index}-color" value="${cat.color || '#ef4444'}">
        </label>
      </div>
    `;
    return div;
  }

  window.removeCategory = function(index) {
    if (!contentData.sportsCategories?.categories) return;
    contentData.sportsCategories.categories.splice(index, 1);
    populateCategories();
  };

  document.getElementById('add-category')?.addEventListener('click', () => {
    if (!contentData.sportsCategories) contentData.sportsCategories = {};
    if (!contentData.sportsCategories.categories) contentData.sportsCategories.categories = [];
    contentData.sportsCategories.categories.push({
      name: '',
      icon: '',
      image: '',
      slug: '',
      articleCount: 0,
      color: '#ef4444'
    });
    populateCategories();
  });

  /**
   * AFCON Spotlight
   */
  function populateAFCON() {
    const form = document.getElementById('form-afcon');
    if (!form || !contentData.afconSpotlight) return;

    populateForm('form-afcon', contentData);

    // Populate standings
    const container = document.getElementById('standings-list');
    if (!container) return;

    container.innerHTML = '';
    if (contentData.afconSpotlight.standings?.teams) {
      contentData.afconSpotlight.standings.teams.forEach((team, index) => {
        const div = createStandingItem(team, index);
        container.appendChild(div);
      });
    }
  }

  function createStandingItem(team = {}, index) {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Posición #${index + 1}</span>
        <button type="button" class="remove-item-btn" onclick="removeStanding(${index})">Eliminar</button>
      </div>
      <div class="form-row">
        <label>
          Equipo
          <input type="text" name="standing-${index}-name" value="${escapeHtml(team.name || '')}" required>
        </label>
        <label>
          Puntos
          <input type="text" name="standing-${index}-points" value="${escapeHtml(team.points || '')}" required>
        </label>
      </div>
    `;
    return div;
  }

  window.removeStanding = function(index) {
    if (!contentData.afconSpotlight?.standings?.teams) return;
    contentData.afconSpotlight.standings.teams.splice(index, 1);
    populateAFCON();
  };

  document.getElementById('add-standing')?.addEventListener('click', () => {
    if (!contentData.afconSpotlight) contentData.afconSpotlight = {};
    if (!contentData.afconSpotlight.standings) contentData.afconSpotlight.standings = {};
    if (!contentData.afconSpotlight.standings.teams) contentData.afconSpotlight.standings.teams = [];
    contentData.afconSpotlight.standings.teams.push({ name: '', points: '' });
    populateAFCON();
  });

  /**
   * Analysis Articles
   */
  function populateAnalysis() {
    const form = document.getElementById('form-analysis');
    if (!form || !contentData.analysisArticles) return;

    populateForm('form-analysis', contentData);

    const container = document.getElementById('analysis-list');
    if (!container) return;

    container.innerHTML = '';
    if (contentData.analysisArticles.articles) {
      contentData.analysisArticles.articles.forEach((article, index) => {
        const div = createAnalysisItem(article, index);
        container.appendChild(div);
      });
    }
  }

  function createAnalysisItem(article = {}, index) {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Artículo #${index + 1}</span>
        <button type="button" class="remove-item-btn" onclick="removeAnalysis(${index})">Eliminar</button>
      </div>
      <div class="form-row">
        <label>
          Slug
          <input type="text" name="analysis-${index}-slug" value="${escapeHtml(article.slug || '')}" required>
        </label>
        <label>
          Imagen URL
          <input type="text" name="analysis-${index}-image" value="${escapeHtml(article.image || '')}" required>
        </label>
      </div>
      <div class="form-row">
        <label>
          Categoría
          <input type="text" name="analysis-${index}-category" value="${escapeHtml(article.category || '')}" required>
        </label>
        <label>
          Color
          <input type="color" name="analysis-${index}-categoryColor" value="${article.categoryColor || '#6366f1'}">
        </label>
      </div>
      <label>
        Título
        <input type="text" name="analysis-${index}-title" value="${escapeHtml(article.title || '')}" required>
      </label>
      <label>
        Extracto
        <textarea name="analysis-${index}-excerpt" rows="2" required>${escapeHtml(article.excerpt || '')}</textarea>
      </label>
      <div class="form-row">
        <label>
          Fecha
          <input type="text" name="analysis-${index}-date" value="${escapeHtml(article.meta?.date || '')}">
        </label>
        <label>
          Autor
          <input type="text" name="analysis-${index}-author" value="${escapeHtml(article.meta?.author || '')}">
        </label>
      </div>
    `;
    return div;
  }

  window.removeAnalysis = function(index) {
    if (!contentData.analysisArticles?.articles) return;
    contentData.analysisArticles.articles.splice(index, 1);
    populateAnalysis();
  };

  document.getElementById('add-analysis')?.addEventListener('click', () => {
    if (!contentData.analysisArticles) contentData.analysisArticles = {};
    if (!contentData.analysisArticles.articles) contentData.analysisArticles.articles = [];
    contentData.analysisArticles.articles.push({
      slug: '',
      image: '',
      category: '',
      categoryColor: '#6366f1',
      title: '',
      excerpt: '',
      meta: { date: '', author: '' }
    });
    populateAnalysis();
  });

  /**
   * Athletes
   */
  function populateAthletes() {
    const form = document.getElementById('form-athletes');
    if (!form || !contentData.athletes) return;

    populateForm('form-athletes', contentData);

    const container = document.getElementById('athletes-list');
    if (!container) return;

    container.innerHTML = '';
    if (contentData.athletes.profiles) {
      contentData.athletes.profiles.forEach((athlete, index) => {
        const div = createAthleteItem(athlete, index);
        container.appendChild(div);
      });
    }
  }

  function createAthleteItem(athlete = {}, index) {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    const stats = athlete.stats || [{}, {}, {}];
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">${escapeHtml(athlete.name || 'Atleta')} #${index + 1}</span>
        <button type="button" class="remove-item-btn" onclick="removeAthlete(${index})">Eliminar</button>
      </div>
      <div class="form-row">
        <label>
          Nombre
          <input type="text" name="athlete-${index}-name" value="${escapeHtml(athlete.name || '')}" required>
        </label>
        <label>
          Imagen URL
          <input type="text" name="athlete-${index}-image" value="${escapeHtml(athlete.image || '')}" required>
        </label>
      </div>
      <div class="form-row">
        <label>
          Deporte
          <input type="text" name="athlete-${index}-sport" value="${escapeHtml(athlete.sport || '')}" required>
        </label>
        <label>
          Badge
          <input type="text" name="athlete-${index}-sportBadge" value="${escapeHtml(athlete.sportBadge || '')}" required>
        </label>
      </div>
      <div class="form-row">
        <label>
          Color del Badge
          <input type="color" name="athlete-${index}-sportColor" value="${athlete.sportColor || '#ef4444'}">
        </label>
        <label>
          Título/Posición
          <input type="text" name="athlete-${index}-title" value="${escapeHtml(athlete.title || '')}" required>
        </label>
      </div>
      <fieldset style="margin-top: 10px;">
        <legend>Estadísticas (3 stats)</legend>
        <div class="stat-inputs">
          <div class="stat-row">
            <input type="text" name="athlete-${index}-stat0-value" placeholder="Valor" value="${escapeHtml(stats[0]?.value || '')}">
            <input type="text" name="athlete-${index}-stat0-label" placeholder="Etiqueta" value="${escapeHtml(stats[0]?.label || '')}">
          </div>
          <div class="stat-row">
            <input type="text" name="athlete-${index}-stat1-value" placeholder="Valor" value="${escapeHtml(stats[1]?.value || '')}">
            <input type="text" name="athlete-${index}-stat1-label" placeholder="Etiqueta" value="${escapeHtml(stats[1]?.label || '')}">
          </div>
          <div class="stat-row">
            <input type="text" name="athlete-${index}-stat2-value" placeholder="Valor" value="${escapeHtml(stats[2]?.value || '')}">
            <input type="text" name="athlete-${index}-stat2-label" placeholder="Etiqueta" value="${escapeHtml(stats[2]?.label || '')}">
          </div>
        </div>
      </fieldset>
    `;
    return div;
  }

  window.removeAthlete = function(index) {
    if (!contentData.athletes?.profiles) return;
    contentData.athletes.profiles.splice(index, 1);
    populateAthletes();
  };

  document.getElementById('add-athlete')?.addEventListener('click', () => {
    if (!contentData.athletes) contentData.athletes = {};
    if (!contentData.athletes.profiles) contentData.athletes.profiles = [];
    contentData.athletes.profiles.push({
      name: '',
      image: '',
      sport: '',
      sportBadge: '',
      sportColor: '#ef4444',
      title: '',
      stats: [
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' }
      ]
    });
    populateAthletes();
  });

  /**
   * Multimedia
   */
  function populateMultimedia() {
    const form = document.getElementById('form-multimedia');
    if (!form || !contentData.multimedia) return;

    populateForm('form-multimedia', contentData);

    const container = document.getElementById('multimedia-list');
    if (!container) return;

    container.innerHTML = '';
    if (contentData.multimedia.items) {
      contentData.multimedia.items.forEach((item, index) => {
        const div = createMultimediaItem(item, index);
        container.appendChild(div);
      });
    }
  }

  function createMultimediaItem(item = {}, index) {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Item #${index + 1}</span>
        <button type="button" class="remove-item-btn" onclick="removeMultimedia(${index})">Eliminar</button>
      </div>
      <div class="form-row">
        <label>
          Tipo
          <select name="multimedia-${index}-type" required>
            <option value="video" ${item.type === 'video' ? 'selected' : ''}>Video</option>
            <option value="gallery" ${item.type === 'gallery' ? 'selected' : ''}>Galería</option>
          </select>
        </label>
        <label>
          Thumbnail URL
          <input type="text" name="multimedia-${index}-thumbnail" value="${escapeHtml(item.thumbnail || '')}" required>
        </label>
      </div>
      <label>
        Caption
        <input type="text" name="multimedia-${index}-caption" value="${escapeHtml(item.caption || '')}" required>
      </label>
      <label>
        URL del Contenido
        <input type="text" name="multimedia-${index}-url" value="${escapeHtml(item.url || '')}" required>
      </label>
    `;
    return div;
  }

  window.removeMultimedia = function(index) {
    if (!contentData.multimedia?.items) return;
    contentData.multimedia.items.splice(index, 1);
    populateMultimedia();
  };

  document.getElementById('add-multimedia')?.addEventListener('click', () => {
    if (!contentData.multimedia) contentData.multimedia = {};
    if (!contentData.multimedia.items) contentData.multimedia.items = [];
    contentData.multimedia.items.push({
      type: 'video',
      thumbnail: '',
      caption: '',
      url: ''
    });
    populateMultimedia();
  });

  /**
   * About Section
   */
  function populateAbout() {
    const form = document.getElementById('form-about');
    if (!form || !contentData.aboutSection) return;

    populateForm('form-about', contentData);

    const container = document.getElementById('about-stats');
    if (!container) return;

    container.innerHTML = '';
    const stats = contentData.aboutSection.stats || [{}, {}, {}];
    stats.forEach((stat, index) => {
      const div = document.createElement('div');
      div.className = 'stat-row';
      div.innerHTML = `
        <input type="text" name="aboutSection.stats.${index}.value" placeholder="Valor" value="${escapeHtml(stat.value || '')}" required>
        <input type="text" name="aboutSection.stats.${index}.label" placeholder="Etiqueta" value="${escapeHtml(stat.label || '')}" required>
      `;
      container.appendChild(div);
    });
  }

  /**
   * Navigation
   */
  function populateNavigation() {
    const form = document.getElementById('form-navigation');
    if (!form || !contentData.navigation) return;

    // Main nav
    populateSimpleList('main-nav', contentData.navigation.main, 'nav');
    
    // Dropdowns
    populateSimpleList('deportes-dropdown', contentData.navigation.deportesDropdown, 'deporte');
    populateSimpleList('academia-dropdown', contentData.navigation.academiaDropdown, 'academia');
  }

  function populateSimpleList(containerId, items, prefix) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    if (items) {
      items.forEach((item, index) => {
        const div = createSimpleLinkItem(item, index, prefix);
        container.appendChild(div);
      });
    }
  }

  function createSimpleLinkItem(item = {}, index, prefix) {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Item #${index + 1}</span>
        <button type="button" class="remove-item-btn" onclick="removeSimpleLink('${prefix}', ${index})">Eliminar</button>
      </div>
      <div class="form-row">
        <label>
          Etiqueta
          <input type="text" name="${prefix}-${index}-label" value="${escapeHtml(item.label || '')}" required>
        </label>
        <label>
          Enlace (href)
          <input type="text" name="${prefix}-${index}-href" value="${escapeHtml(item.href || '')}" required>
        </label>
      </div>
    `;
    return div;
  }

  window.removeSimpleLink = function(prefix, index) {
    let array;
    if (prefix === 'nav') array = contentData.navigation?.main;
    else if (prefix === 'deporte') array = contentData.navigation?.deportesDropdown;
    else if (prefix === 'academia') array = contentData.navigation?.academiaDropdown;
    else if (prefix === 'quick') array = contentData.footer?.quickLinks;
    else if (prefix === 'sport') array = contentData.footer?.sportsLinks;
    else if (prefix === 'info') array = contentData.footer?.infoLinks;
    else if (prefix === 'legal') array = contentData.footer?.legalLinks;
    
    if (array) {
      array.splice(index, 1);
      if (prefix === 'nav' || prefix === 'deporte' || prefix === 'academia') {
        populateNavigation();
      } else {
        populateFooter();
      }
    }
  };

  // Add event listeners for navigation
  document.getElementById('add-main-nav')?.addEventListener('click', () => {
    if (!contentData.navigation) contentData.navigation = {};
    if (!contentData.navigation.main) contentData.navigation.main = [];
    contentData.navigation.main.push({ label: '', href: '' });
    populateNavigation();
  });

  document.getElementById('add-deportes')?.addEventListener('click', () => {
    if (!contentData.navigation) contentData.navigation = {};
    if (!contentData.navigation.deportesDropdown) contentData.navigation.deportesDropdown = [];
    contentData.navigation.deportesDropdown.push({ label: '', href: '' });
    populateNavigation();
  });

  document.getElementById('add-academia')?.addEventListener('click', () => {
    if (!contentData.navigation) contentData.navigation = {};
    if (!contentData.navigation.academiaDropdown) contentData.navigation.academiaDropdown = [];
    contentData.navigation.academiaDropdown.push({ label: '', href: '' });
    populateNavigation();
  });

  /**
   * Footer
   */
  function populateFooter() {
    const form = document.getElementById('form-footer');
    if (!form || !contentData.footer) return;

    populateForm('form-footer', contentData);

    populateSimpleList('quick-links', contentData.footer.quickLinks, 'quick');
    populateSimpleList('sports-links', contentData.footer.sportsLinks, 'sport');
    populateSimpleList('info-links', contentData.footer.infoLinks, 'info');
    populateSimpleList('legal-links', contentData.footer.legalLinks, 'legal');
  }

  // Add event listeners for footer
  document.getElementById('add-quick-link')?.addEventListener('click', () => {
    if (!contentData.footer) contentData.footer = {};
    if (!contentData.footer.quickLinks) contentData.footer.quickLinks = [];
    contentData.footer.quickLinks.push({ label: '', href: '' });
    populateFooter();
  });

  document.getElementById('add-sport-link')?.addEventListener('click', () => {
    if (!contentData.footer) contentData.footer = {};
    if (!contentData.footer.sportsLinks) contentData.footer.sportsLinks = [];
    contentData.footer.sportsLinks.push({ label: '', href: '' });
    populateFooter();
  });

  document.getElementById('add-info-link')?.addEventListener('click', () => {
    if (!contentData.footer) contentData.footer = {};
    if (!contentData.footer.infoLinks) contentData.footer.infoLinks = [];
    contentData.footer.infoLinks.push({ label: '', href: '' });
    populateFooter();
  });

  document.getElementById('add-legal-link')?.addEventListener('click', () => {
    if (!contentData.footer) contentData.footer = {};
    if (!contentData.footer.legalLinks) contentData.footer.legalLinks = [];
    contentData.footer.legalLinks.push({ label: '', href: '' });
    populateFooter();
  });

  /**
   * Form Submissions
   */
  function setupFormSubmissions() {
    // Hero
    document.getElementById('form-hero')?.addEventListener('submit', (e) => {
      e.preventDefault();
      collectFormData('form-hero', 'hero');
    });

    // Breaking News
    document.getElementById('form-breaking-news')?.addEventListener('submit', (e) => {
      e.preventDefault();
      collectBreakingNews();
    });

    // Latest News
    document.getElementById('form-latest-news')?.addEventListener('submit', (e) => {
      e.preventDefault();
      collectLatestNews();
    });

    // Categories
    document.getElementById('form-categories')?.addEventListener('submit', (e) => {
      e.preventDefault();
      collectCategories();
    });

    // AFCON
    document.getElementById('form-afcon')?.addEventListener('submit', (e) => {
      e.preventDefault();
      collectAFCON();
    });

    // Analysis
    document.getElementById('form-analysis')?.addEventListener('submit', (e) => {
      e.preventDefault();
      collectAnalysis();
    });

    // Athletes
    document.getElementById('form-athletes')?.addEventListener('submit', (e) => {
      e.preventDefault();
      collectAthletes();
    });

    // Multimedia
    document.getElementById('form-multimedia')?.addEventListener('submit', (e) => {
      e.preventDefault();
      collectMultimedia();
    });

    // About
    document.getElementById('form-about')?.addEventListener('submit', (e) => {
      e.preventDefault();
      collectFormData('form-about', 'aboutSection');
    });

    // Navigation
    document.getElementById('form-navigation')?.addEventListener('submit', (e) => {
      e.preventDefault();
      collectNavigation();
    });

    // Footer
    document.getElementById('form-footer')?.addEventListener('submit', (e) => {
      e.preventDefault();
      collectFooter();
    });

    // Ads
    document.getElementById('form-ads')?.addEventListener('submit', (e) => {
      e.preventDefault();
      collectFormData('form-ads', 'ads');
    });

    // Legacy forms
    document.getElementById('form-site-config')?.addEventListener('submit', (e) => {
      e.preventDefault();
      collectFormData('form-site-config', 'siteInfo');
    });
  }

  /**
   * Generic form data collection
   */
  function collectFormData(formId, section) {
    const form = document.getElementById(formId);
    if (!form) return;

    const formData = new FormData(form);
    const data = {};

    for (const [name, value] of formData.entries()) {
      setNestedValue(data, name, value);
    }

    // Merge into contentData
    if (section) {
      contentData[section] = { ...contentData[section], ...data[section] };
    } else {
      contentData = { ...contentData, ...data };
    }

    saveContent();
  }

  /**
   * Collect Breaking News
   */
  function collectBreakingNews() {
    const form = document.getElementById('form-breaking-news');
    if (!form) return;

    const inputs = form.querySelectorAll('[name^="breaking-"]');
    const items = [];
    inputs.forEach(input => {
      if (input.value.trim()) {
        items.push(input.value.trim());
      }
    });

    contentData.breakingNews = items;
    saveContent();
  }

  /**
   * Collect Latest News
   */
  function collectLatestNews() {
    const form = document.getElementById('form-latest-news');
    if (!form) return;

    // Section headers
    contentData.latestNews = contentData.latestNews || {};
    contentData.latestNews.sectionTitle = form.querySelector('[name="latestNews.sectionTitle"]')?.value || '';
    contentData.latestNews.viewAllText = form.querySelector('[name="latestNews.viewAllText"]')?.value || '';
    contentData.latestNews.viewAllLink = form.querySelector('[name="latestNews.viewAllLink"]')?.value || '';

    // Featured article
    contentData.latestNews.featured = {
      slug: form.querySelector('[name="featured.slug"]')?.value || '',
      image: form.querySelector('[name="featured.image"]')?.value || '',
      category: form.querySelector('[name="featured.category"]')?.value || '',
      categoryColor: form.querySelector('[name="featured.categoryColor"]')?.value || '#ef4444',
      title: form.querySelector('[name="featured.title"]')?.value || '',
      excerpt: form.querySelector('[name="featured.excerpt"]')?.value || '',
      meta: {
        date: form.querySelector('[name="featured.meta.date"]')?.value || '',
        author: form.querySelector('[name="featured.meta.author"]')?.value || '',
        comments: parseInt(form.querySelector('[name="featured.meta.comments"]')?.value) || 0
      }
    };

    // Grid articles
    const gridArticles = [];
    let index = 0;
    while (form.querySelector(`[name="grid-${index}-slug"]`)) {
      gridArticles.push({
        slug: form.querySelector(`[name="grid-${index}-slug"]`)?.value || '',
        image: form.querySelector(`[name="grid-${index}-image"]`)?.value || '',
        category: form.querySelector(`[name="grid-${index}-category"]`)?.value || '',
        categoryColor: form.querySelector(`[name="grid-${index}-categoryColor"]`)?.value || '#ef4444',
        title: form.querySelector(`[name="grid-${index}-title"]`)?.value || '',
        excerpt: form.querySelector(`[name="grid-${index}-excerpt"]`)?.value || '',
        meta: {
          date: form.querySelector(`[name="grid-${index}-date"]`)?.value || '',
          author: form.querySelector(`[name="grid-${index}-author"]`)?.value || ''
        }
      });
      index++;
    }
    contentData.latestNews.grid = gridArticles;

    saveContent();
  }

  /**
   * Collect Categories
   */
  function collectCategories() {
    const form = document.getElementById('form-categories');
    if (!form) return;

    contentData.sportsCategories = contentData.sportsCategories || {};
    contentData.sportsCategories.sectionTitle = form.querySelector('[name="sportsCategories.sectionTitle"]')?.value || '';
    contentData.sportsCategories.viewAllText = form.querySelector('[name="sportsCategories.viewAllText"]')?.value || '';

    const categories = [];
    let index = 0;
    while (form.querySelector(`[name="cat-${index}-name"]`)) {
      categories.push({
        name: form.querySelector(`[name="cat-${index}-name"]`)?.value || '',
        icon: form.querySelector(`[name="cat-${index}-icon"]`)?.value || '',
        image: form.querySelector(`[name="cat-${index}-image"]`)?.value || '',
        slug: form.querySelector(`[name="cat-${index}-slug"]`)?.value || '',
        articleCount: parseInt(form.querySelector(`[name="cat-${index}-articleCount"]`)?.value) || 0,
        color: form.querySelector(`[name="cat-${index}-color"]`)?.value || '#ef4444'
      });
      index++;
    }
    contentData.sportsCategories.categories = categories;

    saveContent();
  }

  /**
   * Collect AFCON Spotlight
   */
  function collectAFCON() {
    const form = document.getElementById('form-afcon');
    if (!form) return;

    contentData.afconSpotlight = contentData.afconSpotlight || {};
    contentData.afconSpotlight.enabled = form.querySelector('[name="afconSpotlight.enabled"]')?.checked || false;
    contentData.afconSpotlight.logo = form.querySelector('[name="afconSpotlight.logo"]')?.value || '';
    contentData.afconSpotlight.title = form.querySelector('[name="afconSpotlight.title"]')?.value || '';
    contentData.afconSpotlight.subtitle = form.querySelector('[name="afconSpotlight.subtitle"]')?.value || '';
    contentData.afconSpotlight.ctaText = form.querySelector('[name="afconSpotlight.ctaText"]')?.value || '';
    contentData.afconSpotlight.ctaLink = form.querySelector('[name="afconSpotlight.ctaLink"]')?.value || '';

    // Standings
    contentData.afconSpotlight.standings = { title: form.querySelector('[name="standings.title"]')?.value || '', teams: [] };
    let index = 0;
    while (form.querySelector(`[name="standing-${index}-name"]`)) {
      contentData.afconSpotlight.standings.teams.push({
        name: form.querySelector(`[name="standing-${index}-name"]`)?.value || '',
        points: form.querySelector(`[name="standing-${index}-points"]`)?.value || ''
      });
      index++;
    }

    // Next Match
    contentData.afconSpotlight.nextMatch = {
      title: form.querySelector('[name="nextMatch.title"]')?.value || '',
      homeTeam: form.querySelector('[name="nextMatch.homeTeam"]')?.value || '',
      awayTeam: form.querySelector('[name="nextMatch.awayTeam"]')?.value || '',
      date: form.querySelector('[name="nextMatch.date"]')?.value || '',
      time: form.querySelector('[name="nextMatch.time"]')?.value || '',
      venue: form.querySelector('[name="nextMatch.venue"]')?.value || ''
    };

    // Top Scorer
    contentData.afconSpotlight.topScorer = {
      title: form.querySelector('[name="topScorer.title"]')?.value || '',
      icon: form.querySelector('[name="topScorer.icon"]')?.value || '',
      name: form.querySelector('[name="topScorer.name"]')?.value || '',
      stats: form.querySelector('[name="topScorer.stats"]')?.value || ''
    };

    saveContent();
  }

  /**
   * Collect Analysis
   */
  function collectAnalysis() {
    const form = document.getElementById('form-analysis');
    if (!form) return;

    contentData.analysisArticles = contentData.analysisArticles || {};
    contentData.analysisArticles.sectionTitle = form.querySelector('[name="analysisArticles.sectionTitle"]')?.value || '';

    const articles = [];
    let index = 0;
    while (form.querySelector(`[name="analysis-${index}-slug"]`)) {
      articles.push({
        slug: form.querySelector(`[name="analysis-${index}-slug"]`)?.value || '',
        image: form.querySelector(`[name="analysis-${index}-image"]`)?.value || '',
        category: form.querySelector(`[name="analysis-${index}-category"]`)?.value || '',
        categoryColor: form.querySelector(`[name="analysis-${index}-categoryColor"]`)?.value || '#6366f1',
        title: form.querySelector(`[name="analysis-${index}-title"]`)?.value || '',
        excerpt: form.querySelector(`[name="analysis-${index}-excerpt"]`)?.value || '',
        meta: {
          date: form.querySelector(`[name="analysis-${index}-date"]`)?.value || '',
          author: form.querySelector(`[name="analysis-${index}-author"]`)?.value || ''
        }
      });
      index++;
    }
    contentData.analysisArticles.articles = articles;

    saveContent();
  }

  /**
   * Collect Athletes
   */
  function collectAthletes() {
    const form = document.getElementById('form-athletes');
    if (!form) return;

    contentData.athletes = contentData.athletes || {};
    contentData.athletes.sectionTitle = form.querySelector('[name="athletes.sectionTitle"]')?.value || '';
    contentData.athletes.viewAllText = form.querySelector('[name="athletes.viewAllText"]')?.value || '';

    const profiles = [];
    let index = 0;
    while (form.querySelector(`[name="athlete-${index}-name"]`)) {
      profiles.push({
        name: form.querySelector(`[name="athlete-${index}-name"]`)?.value || '',
        image: form.querySelector(`[name="athlete-${index}-image"]`)?.value || '',
        sport: form.querySelector(`[name="athlete-${index}-sport"]`)?.value || '',
        sportBadge: form.querySelector(`[name="athlete-${index}-sportBadge"]`)?.value || '',
        sportColor: form.querySelector(`[name="athlete-${index}-sportColor"]`)?.value || '#ef4444',
        title: form.querySelector(`[name="athlete-${index}-title"]`)?.value || '',
        stats: [
          {
            value: form.querySelector(`[name="athlete-${index}-stat0-value"]`)?.value || '',
            label: form.querySelector(`[name="athlete-${index}-stat0-label"]`)?.value || ''
          },
          {
            value: form.querySelector(`[name="athlete-${index}-stat1-value"]`)?.value || '',
            label: form.querySelector(`[name="athlete-${index}-stat1-label"]`)?.value || ''
          },
          {
            value: form.querySelector(`[name="athlete-${index}-stat2-value"]`)?.value || '',
            label: form.querySelector(`[name="athlete-${index}-stat2-label"]`)?.value || ''
          }
        ]
      });
      index++;
    }
    contentData.athletes.profiles = profiles;

    saveContent();
  }

  /**
   * Collect Multimedia
   */
  function collectMultimedia() {
    const form = document.getElementById('form-multimedia');
    if (!form) return;

    contentData.multimedia = contentData.multimedia || {};
    contentData.multimedia.sectionTitle = form.querySelector('[name="multimedia.sectionTitle"]')?.value || '';
    contentData.multimedia.viewAllText = form.querySelector('[name="multimedia.viewAllText"]')?.value || '';

    const items = [];
    let index = 0;
    while (form.querySelector(`[name="multimedia-${index}-type"]`)) {
      items.push({
        type: form.querySelector(`[name="multimedia-${index}-type"]`)?.value || 'video',
        thumbnail: form.querySelector(`[name="multimedia-${index}-thumbnail"]`)?.value || '',
        caption: form.querySelector(`[name="multimedia-${index}-caption"]`)?.value || '',
        url: form.querySelector(`[name="multimedia-${index}-url"]`)?.value || ''
      });
      index++;
    }
    contentData.multimedia.items = items;

    saveContent();
  }

  /**
   * Collect Navigation
   */
  function collectNavigation() {
    const form = document.getElementById('form-navigation');
    if (!form) return;

    contentData.navigation = contentData.navigation || {};

    // Main nav
    contentData.navigation.main = [];
    let index = 0;
    while (form.querySelector(`[name="nav-${index}-label"]`)) {
      contentData.navigation.main.push({
        label: form.querySelector(`[name="nav-${index}-label"]`)?.value || '',
        href: form.querySelector(`[name="nav-${index}-href"]`)?.value || ''
      });
      index++;
    }

    // Deportes dropdown
    contentData.navigation.deportesDropdown = [];
    index = 0;
    while (form.querySelector(`[name="deporte-${index}-label"]`)) {
      contentData.navigation.deportesDropdown.push({
        label: form.querySelector(`[name="deporte-${index}-label"]`)?.value || '',
        href: form.querySelector(`[name="deporte-${index}-href"]`)?.value || ''
      });
      index++;
    }

    // Academia dropdown
    contentData.navigation.academiaDropdown = [];
    index = 0;
    while (form.querySelector(`[name="academia-${index}-label"]`)) {
      contentData.navigation.academiaDropdown.push({
        label: form.querySelector(`[name="academia-${index}-label"]`)?.value || '',
        href: form.querySelector(`[name="academia-${index}-href"]`)?.value || ''
      });
      index++;
    }

    saveContent();
  }

  /**
   * Collect Footer
   */
  function collectFooter() {
    const form = document.getElementById('form-footer');
    if (!form) return;

    contentData.footer = contentData.footer || {};

    // Social
    contentData.footer.social = {
      facebook: form.querySelector('[name="footer.social.facebook"]')?.value || '',
      twitter: form.querySelector('[name="footer.social.twitter"]')?.value || '',
      instagram: form.querySelector('[name="footer.social.instagram"]')?.value || '',
      youtube: form.querySelector('[name="footer.social.youtube"]')?.value || '',
      linkedin: form.querySelector('[name="footer.social.linkedin"]')?.value || ''
    };

    // Quick Links
    contentData.footer.quickLinks = [];
    let index = 0;
    while (form.querySelector(`[name="quick-${index}-label"]`)) {
      contentData.footer.quickLinks.push({
        label: form.querySelector(`[name="quick-${index}-label"]`)?.value || '',
        href: form.querySelector(`[name="quick-${index}-href"]`)?.value || ''
      });
      index++;
    }

    // Sports Links
    contentData.footer.sportsLinks = [];
    index = 0;
    while (form.querySelector(`[name="sport-${index}-label"]`)) {
      contentData.footer.sportsLinks.push({
        label: form.querySelector(`[name="sport-${index}-label"]`)?.value || '',
        href: form.querySelector(`[name="sport-${index}-href"]`)?.value || ''
      });
      index++;
    }

    // Info Links
    contentData.footer.infoLinks = [];
    index = 0;
    while (form.querySelector(`[name="info-${index}-label"]`)) {
      contentData.footer.infoLinks.push({
        label: form.querySelector(`[name="info-${index}-label"]`)?.value || '',
        href: form.querySelector(`[name="info-${index}-href"]`)?.value || ''
      });
      index++;
    }

    // Legal Links
    contentData.footer.legalLinks = [];
    index = 0;
    while (form.querySelector(`[name="legal-${index}-label"]`)) {
      contentData.footer.legalLinks.push({
        label: form.querySelector(`[name="legal-${index}-label"]`)?.value || '',
        href: form.querySelector(`[name="legal-${index}-href"]`)?.value || ''
      });
      index++;
    }

    // Copyright
    contentData.footer.copyright = form.querySelector('[name="footer.copyright"]')?.value || '';

    saveContent();
  }

  /**
   * Save content to server
   */
  async function saveContent() {
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

      // Update timestamp
      contentData.lastUpdated = new Date().toISOString();

      const response = await fetch('/admin/api/save-content.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify(contentData)
      });

      const result = await response.json();

      if (result.success) {
        showNotice('✅ Contenido guardado correctamente', 'success');
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      showNotice('❌ Error guardando contenido: ' + error.message, 'error');
    }
  }

  /**
   * Dynamic list setup
   */
  function setupDynamicLists() {
    // Already set up via event listeners above
  }

  /**
   * Show notice message
   */
  function showNotice(message, type = 'info') {
    const notice = document.getElementById('notice');
    if (!notice) return;

    notice.textContent = message;
    notice.className = 'notice ' + (type === 'error' ? 'alert error' : '');
    notice.hidden = false;

    setTimeout(() => {
      notice.hidden = true;
    }, 5000);
  }

  /**
   * Escape HTML
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Make loadContent available globally for reload buttons
  window.loadContent = loadContent;

})();
