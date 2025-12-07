// Article Dynamic Content Loader
// Loads article content dynamically based on URL parameter

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    dataPath: 'data/articles.json',
    defaultArticleId: 'yann-mike-alogo-victoria-addis-abeba'
  };

  // Get article ID from URL
  function getArticleId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || urlParams.get('slug') || CONFIG.defaultArticleId;
  }

  // Show loading overlay
  function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }
  }

  // Hide loading overlay
  function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  // Load article data
  async function loadArticleData() {
    try {
      showLoading();
      const response = await fetch(CONFIG.dataPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading article data:', error);
      showError('No se pudo cargar el artículo. Por favor, intenta nuevamente.');
      return null;
    }
  }

  // Find article by ID or slug
  function findArticle(data, articleId) {
    return data.articles.find(article => 
      article.id === articleId || article.slug === articleId
    );
  }

  // Update page metadata
  function updateMetadata(article) {
    document.getElementById('page-title').textContent = `${article.title} | AfrikaSport365`;
    document.getElementById('page-description').setAttribute('content', article.subtitle);
    
    // Update breadcrumb
    const breadcrumbCategory = document.getElementById('breadcrumb-category');
    if (breadcrumbCategory) {
      breadcrumbCategory.textContent = article.category;
    }
  }

  // Update hero section
  function updateHero(article) {
    document.getElementById('hero-image').src = article.heroImage;
    document.getElementById('hero-image').alt = article.heroImageAlt;
    document.getElementById('article-category-text').textContent = article.category;
    document.getElementById('article-title').textContent = article.title;
    document.getElementById('article-subtitle').textContent = article.subtitle;
    document.getElementById('author-avatar').src = article.author.avatar;
    document.getElementById('author-name').textContent = article.author.name;
    document.getElementById('article-date').textContent = article.date;
  }

  // Render article content
  function renderContent(content) {
    const contentContainer = document.getElementById('article-content');
    contentContainer.innerHTML = '';

    content.forEach(block => {
      let element;

      switch (block.type) {
        case 'lead-paragraph':
          element = document.createElement('p');
          element.className = 'lead-paragraph';
          element.innerHTML = block.text;
          break;

        case 'paragraph':
          element = document.createElement('p');
          element.innerHTML = block.text;
          break;

        case 'heading':
          element = document.createElement('h2');
          element.textContent = block.text;
          break;

        case 'image':
          element = document.createElement('figure');
          element.className = 'article-image';
          element.innerHTML = `
            <img src="${block.src}" alt="${block.alt}" />
            <figcaption>${block.caption}</figcaption>
          `;
          break;

        case 'quote':
          element = document.createElement('blockquote');
          element.className = 'article-quote';
          element.innerHTML = `
            <div class="quote-icon">"</div>
            <p class="quote-text">${block.text}</p>
            <footer class="quote-author">
              <img src="${block.image}" alt="${block.author}" />
              <div>
                <cite>${block.author}</cite>
                <span>${block.role}</span>
              </div>
            </footer>
          `;
          break;

        case 'gallery':
          element = document.createElement('div');
          element.className = 'article-gallery';
          const galleryHTML = `
            <h3 class="gallery-title">${block.title}</h3>
            <div class="gallery-grid">
              ${block.images.map(img => `
                <div class="gallery-item">
                  <img src="${img.src}" alt="${img.alt}" />
                </div>
              `).join('')}
            </div>
          `;
          element.innerHTML = galleryHTML;
          break;

        case 'timeline':
          element = document.createElement('div');
          element.className = 'article-timeline';
          const timelineHTML = `
            <h3 class="timeline-title">${block.title}</h3>
            <div class="timeline">
              ${block.items.map(item => `
                <div class="timeline-item ${item.final ? 'timeline-item-final' : ''}">
                  <div class="timeline-marker">
                    ${item.marker === 'check' ? `
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ` : item.marker}
                  </div>
                  <div class="timeline-content">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          `;
          element.innerHTML = timelineHTML;
          break;

        default:
          return;
      }

      if (element) {
        contentContainer.appendChild(element);
      }
    });

    // Add tags at the end
    const tagsElement = document.createElement('div');
    tagsElement.className = 'article-tags';
    tagsElement.innerHTML = `
      <span class="tag-label">Etiquetas:</span>
      ${content.tags ? content.tags.map(tag => `<a href="#" class="tag">${tag}</a>`).join('') : ''}
    `;
  }

  // Render athlete profile card
  function renderAthleteCard(profile) {
    if (!profile) return;

    const athleteCard = document.getElementById('athlete-card');
    athleteCard.innerHTML = `
      <div class="card-header">
        <h3>Perfil del Atleta</h3>
      </div>
      <div class="card-body">
        <div class="athlete-photo">
          <img src="${profile.photo}" alt="${profile.name}" />
        </div>
        <h4 class="athlete-name">${profile.name}</h4>
        <div class="athlete-country">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 21h18M12 3v18M5 7h14M5 17h14"></path>
          </svg>
          <span>${profile.country}</span>
        </div>
        <div class="athlete-info">
          ${profile.info.map(item => `
            <div class="info-row">
              <span class="info-label">${item.label}:</span>
              <span class="info-value">${item.value}</span>
            </div>
          `).join('')}
        </div>
        <div class="athlete-achievements">
          <h5>Logros Destacados</h5>
          <ul>
            ${profile.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // Render sidebar latest news
  function renderSidebarNews(latestNews) {
    const sidebarNewsList = document.getElementById('sidebar-news-list');
    sidebarNewsList.innerHTML = latestNews.map(news => `
      <a href="article.html?id=${news.id}" class="sidebar-news-item">
        <img src="${news.image}" alt="${news.title}" />
        <div>
          <span class="sidebar-news-cat">${news.category}</span>
          <h4>${news.title}</h4>
        </div>
      </a>
    `).join('');
  }

  // Render related news
  function renderRelatedNews(article, data) {
    const relatedNewsGrid = document.getElementById('related-news-grid');
    const relatedArticles = data.relatedByCategory[article.category] || [];
    
    relatedNewsGrid.innerHTML = relatedArticles.map(related => `
      <article class="related-card">
        <a href="article.html?id=${related.id}" class="related-image">
          <img src="${related.image}" alt="${related.title}" />
        </a>
        <div class="related-content">
          <span class="related-category">${related.category}</span>
          <h3><a href="article.html?id=${related.id}">${related.title}</a></h3>
          <p>${related.description}</p>
          <div class="related-meta">
            <span>${related.timeAgo}</span>
          </div>
        </div>
      </article>
    `).join('');

    // If not enough related articles, fill with other categories
    if (relatedArticles.length < 4) {
      const otherCategories = Object.keys(data.relatedByCategory).filter(cat => cat !== article.category);
      const additionalArticles = [];
      
      for (const category of otherCategories) {
        additionalArticles.push(...data.relatedByCategory[category]);
        if (relatedArticles.length + additionalArticles.length >= 4) break;
      }

      const needed = 4 - relatedArticles.length;
      additionalArticles.slice(0, needed).forEach(related => {
        relatedNewsGrid.innerHTML += `
          <article class="related-card">
            <a href="article.html?id=${related.id}" class="related-image">
              <img src="${related.image}" alt="${related.title}" />
            </a>
            <div class="related-content">
              <span class="related-category">${related.category}</span>
              <h3><a href="article.html?id=${related.id}">${related.title}</a></h3>
              <p>${related.description}</p>
              <div class="related-meta">
                <span>${related.timeAgo}</span>
              </div>
            </div>
          </article>
        `;
      });
    }
  }

  // Show error message
  function showError(message) {
    const contentContainer = document.getElementById('article-content');
    contentContainer.innerHTML = `
      <div class="error-message" style="padding: 3rem; text-align: center;">
        <h2 style="color: #ef4444; margin-bottom: 1rem;">Error al cargar el artículo</h2>
        <p style="color: #6b7280; margin-bottom: 2rem;">${message}</p>
        <a href="index.html" class="btn-primary" style="display: inline-block; padding: 0.75rem 1.5rem; background: #2563eb; color: white; border-radius: 8px; text-decoration: none;">
          Volver al inicio
        </a>
      </div>
    `;
  }

  // Setup share buttons
  function setupShareButtons(article) {
    const shareButtons = document.querySelectorAll('.share-btn');
    const pageUrl = window.location.href;
    const shareText = `${article.title} - AfrikaSport365`;

    shareButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (this.classList.contains('share-whatsapp')) {
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + pageUrl)}`, '_blank');
        } else if (this.classList.contains('share-twitter')) {
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`, '_blank');
        } else if (this.classList.contains('share-facebook')) {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
        }
      });
    });
  }

  // Main initialization
  async function init() {
    const articleId = getArticleId();
    const data = await loadArticleData();

    if (!data) {
      hideLoading();
      return;
    }

    const article = findArticle(data, articleId);

    if (!article) {
      showError(`No se encontró el artículo con ID: ${articleId}`);
      hideLoading();
      return;
    }

    // Update all sections
    updateMetadata(article);
    updateHero(article);
    renderContent(article.content);
    
    if (article.athleteProfile) {
      renderAthleteCard(article.athleteProfile);
    }
    
    renderSidebarNews(data.latestNews);
    renderRelatedNews(article, data);
    setupShareButtons(article);

    // Add tags
    const contentContainer = document.getElementById('article-content');
    const tagsElement = document.createElement('div');
    tagsElement.className = 'article-tags';
    tagsElement.innerHTML = `
      <span class="tag-label">Etiquetas:</span>
      ${article.tags.map(tag => `<a href="#" class="tag">${tag}</a>`).join('')}
    `;
    contentContainer.appendChild(tagsElement);

    hideLoading();

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
