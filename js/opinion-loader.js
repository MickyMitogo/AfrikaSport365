/**
 * AfrikaSport365 - Opinion Dynamic Loader
 * Production-grade system for loading opinion/analysis/interview content dynamically
 */

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        opinionsDataPath: 'data/analisis-opinion.json',
        defaultImage: 'images/placeholder.jpg',
        errorRedirectDelay: 5000
    };

    /**
     * Get URL parameter by name
     * @param {string} name - Parameter name
     * @returns {string|null} Parameter value or null
     */
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    /**
     * Load opinions data from JSON
     * @returns {Promise<Array>} Opinions data array
     */
    async function loadOpinionsData() {
        try {
            const response = await fetch(CONFIG.opinionsDataPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error loading opinions data:', error);
            throw error;
        }
    }

    /**
     * Find opinion by slug
     * @param {Array} opinions - Opinions array
     * @param {string} slug - Opinion slug
     * @returns {Object|null} Opinion object or null
     */
    function findOpinionBySlug(opinions, slug) {
        if (!slug || !Array.isArray(opinions)) return null;

        const lowered = slug.toLowerCase();

        return opinions.find(opinion => {
            if (!opinion) return false;
            const oSlug = (opinion.slug || '').toLowerCase();
            const oId = (opinion.id || '').toLowerCase();

            if (oSlug === lowered || oId === lowered) return true;
            if (oSlug && lowered && (oSlug.includes(lowered) || lowered.includes(oSlug))) return true;
            if (oId && lowered && (oId.includes(lowered) || lowered.includes(oId))) return true;

            return false;
        }) || null;
    }

    /**
     * Create content element based on type
     * @param {Object} block - Content block data
     * @returns {HTMLElement|null} Created element
     */
    function createContentElement(block) {
        switch (block.type) {
            case 'lead':
                const p = document.createElement('p');
                p.className = 'lead-paragraph';
                p.innerHTML = block.text;
                return p;

            case 'paragraph':
                const para = document.createElement('p');
                para.innerHTML = block.text;
                return para;

            case 'heading':
                const h2 = document.createElement('h2');
                h2.textContent = block.text;
                return h2;

            case 'image':
                const figure = document.createElement('figure');
                figure.className = 'article-image';
                const img = document.createElement('img');
                img.src = block.src || CONFIG.defaultImage;
                img.alt = block.caption || 'Image';
                figure.appendChild(img);
                if (block.caption) {
                    const figcaption = document.createElement('figcaption');
                    figcaption.textContent = block.caption;
                    figure.appendChild(figcaption);
                }
                return figure;

            case 'quote':
                const blockquote = document.createElement('blockquote');
                blockquote.className = 'article-quote';

                const quoteText = document.createElement('p');
                quoteText.textContent = block.text;
                blockquote.appendChild(quoteText);

                if (block.author) {
                    const quoteAuthor = document.createElement('div');
                    quoteAuthor.className = 'quote-author';

                    const authorName = document.createElement('div');
                    authorName.className = 'author-name-quote';
                    authorName.textContent = block.author;
                    quoteAuthor.appendChild(authorName);

                    if (block.authorRole) {
                        const authorRole = document.createElement('div');
                        authorRole.className = 'author-role';
                        authorRole.textContent = block.authorRole;
                        quoteAuthor.appendChild(authorRole);
                    }

                    blockquote.appendChild(quoteAuthor);
                }

                return blockquote;

            default:
                return null;
        }
    }

    /**
     * Inject opinion content
     * @param {Object} opinion - Opinion data
     */
    function injectOpinionContent(opinion) {
        try {
            // Update page title and meta
            document.title = `${opinion.titulo} - AfrikaSport365`;

            // Update breadcrumb
            const breadcrumbCategory = document.querySelector('.breadcrumb a:last-of-type');
            if (breadcrumbCategory) {
                breadcrumbCategory.textContent = opinion.categoria || opinion.badge;
            }

            // Hero image
            const heroImage = document.querySelector('.hero-image');
            if (heroImage) {
                heroImage.src = opinion.imagen || CONFIG.defaultImage;
                heroImage.alt = opinion.titulo;
            }

            // Badge
            const badgeText = document.querySelector('.opinion-badge-text');
            if (badgeText) badgeText.textContent = opinion.badge;

            // Title and subtitle
            const titleEl = document.querySelector('.article-title');
            if (titleEl) titleEl.textContent = opinion.titulo;

            const subtitleEl = document.querySelector('.article-subtitle');
            if (subtitleEl) subtitleEl.textContent = opinion.resumen;

            // Author info
            const authorAvatar = document.querySelector('.author-avatar');
            if (authorAvatar) {
                authorAvatar.src = opinion.autorImagen || CONFIG.defaultImage;
                authorAvatar.alt = opinion.autor;
            }

            const authorName = document.querySelector('.author-name');
            if (authorName) authorName.textContent = opinion.autor;

            const dateEl = document.querySelector('.opinion-date');
            if (dateEl) dateEl.textContent = opinion.fechaMostrada || opinion.fecha;

            // Main content
            const contentMain = document.querySelector('.content-main');
            if (contentMain) {
                contentMain.innerHTML = '';
                if (opinion.contenido && Array.isArray(opinion.contenido)) {
                    opinion.contenido.forEach(block => {
                        const el = createContentElement(block);
                        if (el) contentMain.appendChild(el);
                    });
                }
            }

            // Author profile card
            const authorProfileName = document.querySelector('.author-profile-name');
            if (authorProfileName) authorProfileName.textContent = opinion.autor;

            const authorProfilePhoto = document.querySelector('.author-profile-photo img');
            if (authorProfilePhoto) {
                authorProfilePhoto.src = opinion.autorImagen || CONFIG.defaultImage;
                authorProfilePhoto.alt = opinion.autor;
            }

            // Load and inject related opinions
            loadOpinionsData().then(opinions => {
                injectRelatedOpinions(opinions, opinion);
                injectSidebarOpinions(opinions, opinion);
            });

            // Show content
            const articlePage = document.querySelector('.article-page');
            if (articlePage) {
                articlePage.classList.remove('loading');
                articlePage.style.opacity = '1';
            }

            console.log('Opinion loaded successfully:', opinion.slug);

        } catch (error) {
            console.error('Error injecting opinion content:', error);
            showErrorState();
        }
    }

    /**
     * Inject related opinions section
     * @param {Array} opinions - All opinions
     * @param {Object} currentOpinion - Current opinion
     */
    function injectRelatedOpinions(opinions, currentOpinion) {
        const relatedGrid = document.querySelector('.related-grid');
        if (!relatedGrid) return;

        const related = opinions.filter(o => o.id !== currentOpinion.id).slice(0, 3);

        relatedGrid.innerHTML = '';

        related.forEach(opinion => {
            const article = document.createElement('article');
            article.className = 'related-card';
            article.innerHTML = `
                <a href="opinion.html?slug=${opinion.slug}" class="related-image">
                    <img src="${opinion.imagen}" alt="${opinion.titulo}" />
                </a>
                <div class="related-content">
                    <span class="related-category" style="background: ${opinion.badgeColor || '#8b5cf6'}">${opinion.badge}</span>
                    <h3><a href="opinion.html?slug=${opinion.slug}">${opinion.titulo}</a></h3>
                    <p>${opinion.resumen}</p>
                    <div class="related-meta">
                        <span>${opinion.fechaMostrada}</span>
                    </div>
                </div>
            `;
            relatedGrid.appendChild(article);
        });
    }

    /**
     * Inject sidebar related opinions
     * @param {Array} opinions - All opinions
     * @param {Object} currentOpinion - Current opinion
     */
    function injectSidebarOpinions(opinions, currentOpinion) {
        const sidebarList = document.querySelector('.sidebar-news-list');
        if (!sidebarList) return;

        const related = opinions.filter(o => o.id !== currentOpinion.id).slice(0, 3);

        sidebarList.innerHTML = '';

        related.forEach(opinion => {
            const link = document.createElement('a');
            link.className = 'sidebar-news-item';
            link.href = `opinion.html?slug=${opinion.slug}`;
            link.innerHTML = `
                <img src="${opinion.imagen}" alt="${opinion.titulo}" />
                <div>
                    <span class="sidebar-news-cat" style="background: ${opinion.badgeColor || '#8b5cf6'}">${opinion.badge}</span>
                    <h4>${opinion.titulo}</h4>
                </div>
            `;
            sidebarList.appendChild(link);
        });
    }

    /**
     * Show error state
     */
    function showErrorState() {
        const articlePage = document.querySelector('.article-page');
        if (!articlePage) return;

        articlePage.innerHTML = `
            <div class="article-error-state">
                <div class="error-content">
                    <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h1>Artículo no encontrado</h1>
                    <p>Lo sentimos, la opinión o análisis que buscas no está disponible.</p>
                    <div class="error-actions">
                        <a href="index.html" class="btn-primary">Volver al Inicio</a>
                        <button onclick="history.back()" class="btn-secondary">Regresar</button>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => {
            window.location.href = 'index.html';
        }, CONFIG.errorRedirectDelay);
    }

    /**
     * Initialize opinion loader
     */
    async function init() {
        try {
            const slug = getUrlParameter('slug');

            if (!slug) {
                console.error('No opinion slug provided');
                showErrorState();
                return;
            }

            const opinions = await loadOpinionsData();

            if (!opinions || opinions.length === 0) {
                console.error('No opinions data available');
                showErrorState();
                return;
            }

            const opinion = findOpinionBySlug(opinions, slug);

            if (!opinion) {
                console.error('Opinion not found:', slug);
                showErrorState();
                return;
            }

            injectOpinionContent(opinion);

        } catch (error) {
            console.error('Error initializing opinion loader:', error);
            showErrorState();
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
