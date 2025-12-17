/**
 * ============================================================================
 * AFRIKASPORT365 - COMPLETE HOMEPAGE BINDINGS
 * ============================================================================
 * 
 * PURPOSE:
 * Bind ALL content from content.json to the homepage DOM
 * Supports both new content.json and legacy config.json
 * 
 * SECTIONS MANAGED:
 * - Site Info (header branding)
 * - Hero Section
 * - Breaking News Ticker
 * - Latest News (featured + grid)
 * - Sports Categories
 * - AFCON Spotlight
 * - Analysis Articles
 * - Athletes Profiles
 * - Multimedia Gallery
 * - About Section
 * - Navigation (header + footer)
 * - Footer
 * - Ads/Banners
 * ============================================================================
 */

(function() {
  'use strict';

  let contentData = null;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  async function init() {
    try {
      console.log('[Homepage Bindings] Initializing...');
      
      // Try loading content.json first (new system), fallback to config.json (legacy)
      try {
        contentData = await ContentLoader.load('content');
        console.log('[Homepage Bindings] Using content.json (new system)');
      } catch (error) {
        console.warn('[Homepage Bindings] content.json not found, falling back to config.json');
        contentData = await ContentLoader.load('config');
      }

      if (!contentData) {
        throw new Error('No content data available');
      }

      // Bind all sections
      bindSiteInfo();
      bindHero();
      bindBreakingNews();
      bindLatestNews();
      bindSportsCategories();
      bindAFCONSpotlight();
      bindAnalysisArticles();
      bindAthletes();
      bindMultimedia();
      bindAboutSection();
      bindAds();

      console.log('[Homepage Bindings] ✅ All content loaded successfully');

    } catch (error) {
      console.error('[Homepage Bindings] ❌ Error loading content:', error);
    }
  }

  /**
   * SECTION 1: Site Info (Header Branding)
   */
  function bindSiteInfo() {
    if (!contentData.siteInfo) return;

    const { name, tagline, logo } = contentData.siteInfo;

    // Logo
    const logoImg = document.querySelector('[data-cms-field="siteInfo.logo"]');
    if (logoImg && logo) {
      logoImg.src = logo;
      logoImg.alt = name + ' Logo';
    }

    // Site name
    const nameEl = document.querySelector('[data-cms-field="siteInfo.name"]');
    if (nameEl && name) {
      nameEl.textContent = name;
    }

    // Tagline
    const taglineEl = document.querySelector('[data-cms-field="siteInfo.tagline"]');
    if (taglineEl && tagline) {
      taglineEl.textContent = tagline;
    }

    console.log('[Homepage Bindings] ✓ Site Info');
  }

  /**
   * SECTION 2: Hero Section
   */
  function bindHero() {
    if (!contentData.hero) return;

    const hero = contentData.hero;

    // Background image
    const bgImg = document.querySelector('[data-cms-field="hero.backgroundImage"]');
    if (bgImg && hero.backgroundImage) {
      bgImg.src = hero.backgroundImage;
    }

    // Badge
    const badge = document.querySelector('[data-cms-field="hero.badge"]');
    if (badge && hero.badge) {
      badge.textContent = hero.badge;
    }

    // Title
    const title = document.querySelector('[data-cms-field="hero.title"]');
    if (title && hero.title) {
      title.textContent = hero.title;
    }

    // Excerpt
    const excerpt = document.querySelector('[data-cms-field="hero.excerpt"]');
    if (excerpt && hero.excerpt) {
      excerpt.textContent = hero.excerpt;
    }

    // Meta data
    if (hero.meta) {
      const dateEl = document.querySelector('[data-cms-field="hero.meta.date"]');
      if (dateEl && hero.meta.date) {
        dateEl.textContent = '📅 ' + hero.meta.date;
      }

      const authorEl = document.querySelector('[data-cms-field="hero.meta.author"]');
      if (authorEl && hero.meta.author) {
        authorEl.textContent = '✍️ ' + hero.meta.author;
      }

      const readTimeEl = document.querySelector('[data-cms-field="hero.meta.readTime"]');
      if (readTimeEl && hero.meta.readTime) {
        readTimeEl.textContent = '⏱️ ' + hero.meta.readTime;
      }
    }

    // CTA button
    const ctaLink = document.querySelector('[data-cms-field="hero.ctaLink"]');
    if (ctaLink && hero.ctaLink) {
      ctaLink.href = hero.ctaLink;
    }

    const ctaText = document.querySelector('[data-cms-field="hero.ctaText"]');
    if (ctaText && hero.ctaText) {
      ctaText.textContent = hero.ctaText;
    }

    console.log('[Homepage Bindings] ✓ Hero Section');
  }

  /**
   * SECTION 3: Breaking News Ticker
   */
  function bindBreakingNews() {
    if (!contentData.breakingNews || !Array.isArray(contentData.breakingNews)) return;

    const ticker = document.querySelector('.breaking-ticker');
    if (!ticker) return;

    // Clear existing content
    ticker.innerHTML = '';

    // Add each news item twice for seamless loop
    const items = contentData.breakingNews;
    [...items, ...items].forEach(text => {
      const span = document.createElement('span');
      span.className = 'ticker-item';
      span.textContent = text;
      ticker.appendChild(span);
    });

    console.log('[Homepage Bindings] ✓ Breaking News Ticker');
  }

  /**
   * SECTION 4: Latest News
   */
  function bindLatestNews() {
    if (!contentData.latestNews) return;

    const latestNews = contentData.latestNews;

    // Section title
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle && latestNews.sectionTitle) {
      sectionTitle.textContent = latestNews.sectionTitle;
    }

    // Featured article (large card)
    if (latestNews.featured) {
      bindFeaturedArticle(latestNews.featured);
    }

    // Grid articles
    if (latestNews.grid && Array.isArray(latestNews.grid)) {
      bindGridArticles(latestNews.grid);
    }

    console.log('[Homepage Bindings] ✓ Latest News');
  }

  function bindFeaturedArticle(article) {
    const card = document.querySelector('.news-card-large');
    if (!card) return;

    // Image
    const img = card.querySelector('.news-image img');
    if (img) {
      img.src = article.image;
      img.alt = article.title;
    }

    // Category badge
    const badge = card.querySelector('.news-category-badge');
    if (badge) {
      badge.textContent = article.category;
      badge.style.background = article.categoryColor;
    }

    // Title and link
    const titleLink = card.querySelector('.news-title a');
    if (titleLink) {
      titleLink.textContent = article.title;
      titleLink.href = `article.html?slug=${article.slug}`;
    }

    // Excerpt
    const excerpt = card.querySelector('.news-excerpt');
    if (excerpt) {
      excerpt.textContent = article.excerpt;
    }

    // Meta
    const metaSpans = card.querySelectorAll('.news-meta span');
    if (metaSpans.length >= 3 && article.meta) {
      metaSpans[0].textContent = '📅 ' + (article.meta.date || '');
      metaSpans[1].textContent = '✍️ ' + (article.meta.author || '');
      if (article.meta.comments) {
        metaSpans[2].textContent = `💬 ${article.meta.comments} comentarios`;
      }
    }

    // Update card slug
    card.dataset.articleSlug = article.slug;
  }

  function bindGridArticles(articles) {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;

    // Get all small news cards (not the large one)
    const smallCards = newsGrid.querySelectorAll('.news-card:not(.news-card-large)');

    articles.forEach((article, index) => {
      if (index >= smallCards.length) return;
      const card = smallCards[index];

      // Image
      const img = card.querySelector('.news-image img');
      if (img) {
        img.src = article.image;
        img.alt = article.title;
      }

      // Category badge
      const badge = card.querySelector('.news-category-badge');
      if (badge) {
        badge.textContent = article.category;
        badge.style.background = article.categoryColor;
      }

      // Title and link
      const titleLink = card.querySelector('.news-title a');
      if (titleLink) {
        titleLink.textContent = article.title;
        titleLink.href = `article.html?slug=${article.slug}`;
      }

      // Excerpt
      const excerpt = card.querySelector('.news-excerpt');
      if (excerpt) {
        excerpt.textContent = article.excerpt;
      }

      // Meta
      const metaSpans = card.querySelectorAll('.news-meta span');
      if (metaSpans.length >= 2 && article.meta) {
        metaSpans[0].textContent = '📅 ' + (article.meta.date || '');
        metaSpans[1].textContent = '✍️ ' + (article.meta.author || '');
      }

      // Update card slug
      card.dataset.articleSlug = article.slug;
    });
  }

  /**
   * SECTION 5: Sports Categories
   */
  function bindSportsCategories() {
    if (!contentData.sportsCategories?.categories) return;

    const grid = document.querySelector('.categories-grid');
    if (!grid) return;

    const categoryCards = grid.querySelectorAll('.category-card');
    const categories = contentData.sportsCategories.categories;

    categories.forEach((cat, index) => {
      if (index >= categoryCards.length) return;
      const card = categoryCards[index];

      // Background image
      const bgImg = card.querySelector('.category-bg img');
      if (bgImg) {
        bgImg.src = cat.image;
        bgImg.alt = cat.name;
      }

      // Icon
      const icon = card.querySelector('.category-icon');
      if (icon) {
        icon.textContent = cat.icon;
      }

      // Name
      const name = card.querySelector('.category-name');
      if (name) {
        name.textContent = cat.name;
      }

      // Count
      const count = card.querySelector('.category-count');
      if (count) {
        count.textContent = `${cat.articleCount} Artículos`;
      }

      // Link
      if (cat.slug) {
        card.href = `#${cat.slug}`;
      }
    });

    console.log('[Homepage Bindings] ✓ Sports Categories');
  }

  /**
   * SECTION 6: AFCON Spotlight
   */
  function bindAFCONSpotlight() {
    if (!contentData.afconSpotlight) return;

    const spotlight = document.querySelector('.afcon-spotlight');
    if (!spotlight) return;

    const afcon = contentData.afconSpotlight;

    // Check if enabled
    if (afcon.enabled === false) {
      spotlight.style.display = 'none';
      return;
    }

    // Logo
    const logo = spotlight.querySelector('.afcon-logo img');
    if (logo && afcon.logo) {
      logo.src = afcon.logo;
    }

    // Title and subtitle
    const title = spotlight.querySelector('.afcon-title');
    if (title && afcon.title) {
      title.textContent = afcon.title;
    }

    const subtitle = spotlight.querySelector('.afcon-subtitle');
    if (subtitle && afcon.subtitle) {
      subtitle.textContent = afcon.subtitle;
    }

    // Standings
    if (afcon.standings?.teams) {
      bindStandings(afcon.standings);
    }

    // Next Match
    if (afcon.nextMatch) {
      bindNextMatch(afcon.nextMatch);
    }

    // Top Scorer
    if (afcon.topScorer) {
      bindTopScorer(afcon.topScorer);
    }

    // CTA button
    const cta = spotlight.querySelector('.afcon-cta');
    if (cta) {
      if (afcon.ctaText) cta.textContent = afcon.ctaText;
      if (afcon.ctaLink) cta.href = afcon.ctaLink;
    }

    console.log('[Homepage Bindings] ✓ AFCON Spotlight');
  }

  function bindStandings(standings) {
    const miniStandings = document.querySelector('.mini-standings');
    if (!miniStandings) return;

    // Clear existing
    miniStandings.innerHTML = '';

    standings.teams.forEach(team => {
      const row = document.createElement('div');
      row.className = 'mini-standings-row';
      row.innerHTML = `
        <span>${team.name}</span>
        <span>${team.points}</span>
      `;
      miniStandings.appendChild(row);
    });
  }

  function bindNextMatch(match) {
    const matchCard = document.querySelectorAll('.afcon-mini-card')[1];
    if (!matchCard) return;

    const matchContent = matchCard.querySelector('[style*="text-align: center"]');
    if (!matchContent) return;

    matchContent.innerHTML = `
      <div style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem;">
        ${match.homeTeam} vs ${match.awayTeam}
      </div>
      <div style="font-size: 2rem; font-weight: 900; color: #fbbf24; margin: 1rem 0;">
        ${match.date}
      </div>
      <div style="font-size: 0.875rem; opacity: 0.9;">
        ${match.venue} • ${match.time}
      </div>
    `;
  }

  function bindTopScorer(scorer) {
    const scorerCard = document.querySelectorAll('.afcon-mini-card')[2];
    if (!scorerCard) return;

    const scorerContent = scorerCard.querySelector('[style*="text-align: center"]');
    if (!scorerContent) return;

    scorerContent.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 0.5rem;">${scorer.icon || '⚽'}</div>
      <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem;">
        ${scorer.name}
      </div>
      <div style="font-size: 0.875rem; opacity: 0.9;">
        ${scorer.stats}
      </div>
    `;
  }

  /**
   * SECTION 7: Analysis & Opinion Articles
   */
  function bindAnalysisArticles() {
    if (!contentData.analysisArticles?.articles) return;

    const analysisSection = document.querySelector('.lg\\:col-span-2 .news-grid');
    if (!analysisSection) return;

    const cards = analysisSection.querySelectorAll('.news-card');
    const articles = contentData.analysisArticles.articles;

    articles.forEach((article, index) => {
      if (index >= cards.length) return;
      const card = cards[index];

      // Image
      const img = card.querySelector('.news-image img');
      if (img) {
        img.src = article.image;
        img.alt = article.title;
      }

      // Category badge
      const badge = card.querySelector('.news-category-badge');
      if (badge) {
        badge.textContent = article.category;
        badge.style.background = article.categoryColor;
      }

      // Title and link
      const titleLink = card.querySelector('.news-title a');
      if (titleLink) {
        titleLink.textContent = article.title;
        titleLink.href = `article.html?slug=${article.slug}`;
      }

      // Excerpt
      const excerpt = card.querySelector('.news-excerpt');
      if (excerpt) {
        excerpt.textContent = article.excerpt;
      }

      // Meta
      const metaSpans = card.querySelectorAll('.news-meta span');
      if (metaSpans.length >= 2 && article.meta) {
        metaSpans[0].textContent = '📅 ' + (article.meta.date || '');
        metaSpans[1].textContent = '✍️ ' + (article.meta.author || '');
      }

      card.dataset.articleSlug = article.slug;
    });

    console.log('[Homepage Bindings] ✓ Analysis Articles');
  }

  /**
   * SECTION 8: Athletes Profiles
   */
  function bindAthletes() {
    if (!contentData.athletes?.profiles) return;

    const slider = document.querySelector('.athletes-slider');
    if (!slider) return;

    const athleteCards = slider.querySelectorAll('.athlete-card');
    const profiles = contentData.athletes.profiles;

    profiles.forEach((athlete, index) => {
      if (index >= athleteCards.length) return;
      const card = athleteCards[index];

      // Image
      const img = card.querySelector('.athlete-image img');
      if (img) {
        img.src = athlete.image;
        img.alt = athlete.name;
      }

      // Sport badge
      const badge = card.querySelector('.athlete-sport-badge');
      if (badge) {
        badge.textContent = athlete.sportBadge;
        badge.style.background = athlete.sportColor;
      }

      // Name
      const name = card.querySelector('.athlete-name');
      if (name) {
        name.textContent = athlete.name;
      }

      // Title/Position
      const title = card.querySelector('.athlete-title');
      if (title) {
        title.textContent = athlete.title;
      }

      // Stats
      if (athlete.stats && Array.isArray(athlete.stats)) {
        const statItems = card.querySelectorAll('.stat-item');
        athlete.stats.forEach((stat, statIndex) => {
          if (statIndex >= statItems.length) return;
          const statItem = statItems[statIndex];

          const value = statItem.querySelector('.stat-value');
          const label = statItem.querySelector('.stat-label');

          if (value) value.textContent = stat.value;
          if (label) label.textContent = stat.label;
        });
      }
    });

    console.log('[Homepage Bindings] ✓ Athletes Profiles');
  }

  /**
   * SECTION 9: Multimedia Gallery
   */
  function bindMultimedia() {
    if (!contentData.multimedia?.items) return;

    const grid = document.querySelector('.multimedia-grid');
    if (!grid) return;

    const multimediaItems = grid.querySelectorAll('.multimedia-item');
    const items = contentData.multimedia.items;

    items.forEach((item, index) => {
      if (index >= multimediaItems.length) return;
      const element = multimediaItems[index];

      // Thumbnail
      const thumb = element.querySelector('.multimedia-thumb');
      if (thumb) {
        thumb.src = item.thumbnail;
        thumb.alt = item.caption;
      }

      // Type badge
      const typeBadge = element.querySelector('.multimedia-type');
      if (typeBadge) {
        typeBadge.textContent = item.type.toUpperCase();
        if (item.type === 'gallery') {
          typeBadge.style.background = '#10b981';
        }
      }

      // Caption
      const caption = element.querySelector('.multimedia-caption');
      if (caption) {
        caption.textContent = item.caption;
      }

      // Link
      if (item.url) {
        element.style.cursor = 'pointer';
        element.onclick = () => window.location.href = item.url;
      }
    });

    console.log('[Homepage Bindings] ✓ Multimedia Gallery');
  }

  /**
   * SECTION 10: About Section
   */
  function bindAboutSection() {
    if (!contentData.aboutSection) return;

    const about = contentData.aboutSection;

    // Icon
    const icon = document.querySelector('[data-cms-field="aboutSection.icon"]');
    if (icon && about.icon) {
      icon.textContent = about.icon;
    }

    // Title
    const title = document.querySelector('[data-cms-field="aboutSection.title"]');
    if (title && about.title) {
      title.textContent = about.title;
    }

    // Description
    const desc = document.querySelector('[data-cms-field="aboutSection.description"]');
    if (desc && about.description) {
      desc.textContent = about.description;
    }

    // Stats
    if (about.stats && Array.isArray(about.stats)) {
      const statContainers = document.querySelectorAll('.about-stats .stat-item');
      about.stats.forEach((stat, index) => {
        if (index >= statContainers.length) return;
        const container = statContainers[index];

        const value = container.querySelector('.stat-value');
        const label = container.querySelector('.stat-label');

        if (value) value.textContent = stat.value;
        if (label) label.textContent = stat.label;
      });
    }

    console.log('[Homepage Bindings] ✓ About Section');
  }

  /**
   * SECTION 11: Ads/Banners
   */
  function bindAds() {
    if (!contentData.ads) return;

    // Horizontal banner
    if (contentData.ads.horizontal) {
      const horizontalBanner = document.querySelector('.ad-banner-horizontal');
      if (horizontalBanner) {
        const ad = contentData.ads.horizontal;
        
        if (ad.enabled === false) {
          horizontalBanner.style.display = 'none';
        } else if (ad.imageUrl) {
          horizontalBanner.innerHTML = `
            <a href="${ad.linkUrl || '#'}" target="_blank">
              <img src="${ad.imageUrl}" alt="${ad.altText || 'Anuncio'}" style="width: 100%; height: auto;">
            </a>
          `;
        }
      }
    }

    // Sidebar banner
    if (contentData.ads.sidebar) {
      const sidebarBanner = document.querySelector('.ad-banner-sidebar');
      if (sidebarBanner) {
        const ad = contentData.ads.sidebar;
        
        if (ad.enabled === false) {
          sidebarBanner.style.display = 'none';
        } else if (ad.imageUrl) {
          sidebarBanner.innerHTML = `
            <a href="${ad.linkUrl || '#'}" target="_blank">
              <img src="${ad.imageUrl}" alt="${ad.altText || 'Anuncio'}" style="width: 100%; height: auto;">
            </a>
          `;
        }
      }
    }

    console.log('[Homepage Bindings] ✓ Ads/Banners');
  }

  // Expose reload function globally
  window.reloadContent = async function() {
    ContentLoader.clearCache('content');
    ContentLoader.clearCache('config');
    await init();
  };

})();
