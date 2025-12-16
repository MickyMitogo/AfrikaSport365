/**
 * ============================================================================
 * AFRIKASPORT365 - HOMEPAGE CONTENT BINDINGS
 * ============================================================================
 * 
 * PURPOSE:
 * Bind config.json data to homepage DOM elements marked with data-cms-* attributes.
 * Enables admin panel changes to appear immediately on the homepage.
 * 
 * ARCHITECTURE:
 * - Non-invasive: No HTML structure or CSS changes
 * - Uses existing data-cms-field attributes for mapping
 * - Preserves static fallbacks if JSON fails
 * - Production-safe with error handling
 * 
 * ============================================================================
 */

(async function() {
  'use strict';

  // Only run on homepage
  if (!window.ContentLoader) {
    console.warn('[Homepage Bindings] ContentLoader not available');
    return;
  }

  try {
    // Load config data
    const config = await ContentLoader.load('config');
    if (!config) return;

    // === Site Branding ===
    bindField('siteInfo.name', config.siteInfo?.name);
    bindField('siteInfo.tagline', config.siteInfo?.tagline);
    bindImage('siteInfo.logo', config.siteInfo?.logo);

    // === Hero Section ===
    bindField('hero.badge', config.hero?.badge);
    bindField('hero.title', config.hero?.title);
    bindField('hero.excerpt', config.hero?.excerpt);
    bindImage('hero.backgroundImage', config.hero?.backgroundImage);
    bindField('hero.meta.date', config.hero?.meta?.date);
    bindField('hero.meta.author', config.hero?.meta?.author);
    bindField('hero.meta.readTime', config.hero?.meta?.readTime);
    
    // Hero CTA
    const ctaLink = document.querySelector('[data-cms-field="hero.ctaLink"]');
    if (ctaLink && config.hero?.ctaLink) {
      ctaLink.href = config.hero.ctaLink;
    }
    bindField('hero.ctaText', config.hero?.ctaText);

    // === Breaking News Ticker ===
    if (config.breakingNews && Array.isArray(config.breakingNews)) {
      updateBreakingNewsTicker(config.breakingNews);
    }

    // === About Section ===
    bindField('aboutSection.icon', config.aboutSection?.icon);
    bindField('aboutSection.title', config.aboutSection?.title);
    bindField('aboutSection.description', config.aboutSection?.description);

    // About stats (individual fields)
    if (config.aboutSection?.stats && Array.isArray(config.aboutSection.stats)) {
      config.aboutSection.stats.forEach((stat, index) => {
        bindField(`stats.${index}.value`, stat.value);
        bindField(`stats.${index}.label`, stat.label);
      });
    }

    console.log('[Homepage Bindings] Content loaded successfully');

  } catch (error) {
    console.error('[Homepage Bindings] Error loading content:', error);
    // Fail silently - page still displays static content
  }

  /**
   * Bind text content to element with data-cms-field attribute
   * @param {string} field - Field path (e.g., "hero.title")
   * @param {string} value - Value to bind
   */
  function bindField(field, value) {
    if (!value) return;
    const el = document.querySelector(`[data-cms-field="${field}"]`);
    if (el) {
      el.textContent = value;
    }
  }

  /**
   * Bind image src to element with data-cms-field attribute
   * @param {string} field - Field path
   * @param {string} src - Image source URL
   */
  function bindImage(field, src) {
    if (!src) return;
    const el = document.querySelector(`[data-cms-field="${field}"]`);
    if (el && el.tagName === 'IMG') {
      el.src = src;
    }
  }

  /**
   * Update breaking news ticker with fresh data
   * @param {Array<string>} newsItems - Breaking news array
   */
  function updateBreakingNewsTicker(newsItems) {
    const ticker = document.querySelector('.breaking-ticker');
    if (!ticker || newsItems.length === 0) return;

    // Clear existing items
    ticker.innerHTML = '';

    // Add items (duplicate for seamless loop)
    const items = [...newsItems, ...newsItems];
    items.forEach(item => {
      const span = document.createElement('span');
      span.className = 'ticker-item';
      span.textContent = item;
      ticker.appendChild(span);
    });
  }

})();
