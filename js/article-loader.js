/**
 * AfrikaSport365 - Article Dynamic Loader
 * Production-grade system for loading articles dynamically
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        articlesDataPath: '../data/articles.json',
        defaultImage: 'images/placeholder.jpg',
        errorRedirectDelay: 5000 // 5 seconds before redirecting on error
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
     * Format date to Spanish locale
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return date.toLocaleDateString('es-ES', options).replace(',', ' •');
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    }

    /**
     * Load articles data from JSON
     * @returns {Promise<Object>} Articles data
     */
    async function loadArticlesData() {
        try {
            const response = await fetch(CONFIG.articlesDataPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading articles data:', error);
            throw error;
        }
    }

    /**
     * Find article by slug
     * @param {Array} articles - Articles array
     * @param {string} slug - Article slug
     * @returns {Object|null} Article object or null
     */
    function findArticleBySlug(articles, slug) {
        return articles.find(article => article.slug === slug) || null;
    }

    /**
     * Inject content into article template
     * @param {Object} article - Article data
     */
    function injectArticleContent(article) {
        try {
            // Update page title and meta
            document.title = `${article.title} - AfrikaSport365`;
            updateMetaTags(article);

            // Update breadcrumb
            updateBreadcrumb(article);

            // Hero section
            const heroImage = document.querySelector('.hero-image-container img');
            if (heroImage) {
                heroImage.src = article.heroImage || CONFIG.defaultImage;
                heroImage.alt = article.title;
            }

            // Category badge
            const categoryBadge = document.querySelector('.article-category span');
            if (categoryBadge) {
                categoryBadge.textContent = article.category;
                categoryBadge.style.backgroundColor = article.categoryColor || '#2563eb';
            }

            // Title and subtitle
            const titleElement = document.querySelector('.article-title');
            if (titleElement) titleElement.textContent = article.title;

            const subtitleElement = document.querySelector('.article-subtitle');
            if (subtitleElement) subtitleElement.textContent = article.subtitle;

            // Author information
            const authorAvatar = document.querySelector('.author-avatar');
            if (authorAvatar) {
                authorAvatar.src = article.authorImage || CONFIG.defaultImage;
                authorAvatar.alt = article.author;
            }

            const authorName = document.querySelector('.author-name');
            if (authorName) authorName.textContent = article.author;

            const articleDate = document.querySelector('.article-date span');
            if (articleDate) articleDate.textContent = article.dateDisplay || formatDate(article.date);

            // Main content
            injectMainContent(article);

            // Tags
            injectTags(article);

            // Show article (remove loading state if exists)
            const articlePage = document.querySelector('.article-page');
            if (articlePage) {
                articlePage.classList.remove('loading');
                articlePage.style.opacity = '1';
            }

            // Log successful load
            console.log('Article loaded successfully:', article.slug);

        } catch (error) {
            console.error('Error injecting article content:', error);
            showErrorState();
        }
    }

    /**
     * Update meta tags for SEO
     * @param {Object} article - Article data
     */
    function updateMetaTags(article) {
        // Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = article.excerpt || article.subtitle;

        // Open Graph tags
        updateOrCreateMetaTag('og:title', article.title);
        updateOrCreateMetaTag('og:description', article.excerpt || article.subtitle);
        updateOrCreateMetaTag('og:image', article.heroImage);
        updateOrCreateMetaTag('og:type', 'article');

        // Twitter Card
        updateOrCreateMetaTag('twitter:card', 'summary_large_image');
        updateOrCreateMetaTag('twitter:title', article.title);
        updateOrCreateMetaTag('twitter:description', article.excerpt || article.subtitle);
        updateOrCreateMetaTag('twitter:image', article.heroImage);
    }

    /**
     * Update or create meta tag
     * @param {string} property - Property or name
     * @param {string} content - Content value
     */
    function updateOrCreateMetaTag(property, content) {
        let meta = document.querySelector(`meta[property="${property}"]`) || 
                   document.querySelector(`meta[name="${property}"]`);
        
        if (!meta) {
            meta = document.createElement('meta');
            if (property.startsWith('og:') || property.startsWith('twitter:')) {
                meta.setAttribute('property', property);
            } else {
                meta.setAttribute('name', property);
            }
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    /**
     * Update breadcrumb with article category
     * @param {Object} article - Article data
     */
    function updateBreadcrumb(article) {
        const breadcrumbCategory = document.querySelector('.breadcrumb a:last-of-type');
        if (breadcrumbCategory) {
            breadcrumbCategory.textContent = article.category;
        }
    }

    /**
     * Inject main article content
     * @param {Object} article - Article data
     */
    function injectMainContent(article) {
        const contentMain = document.querySelector('.content-main');
        if (!contentMain) {
            console.error('Content main container not found');
            return;
        }

        // Clear existing content (keep only structural elements)
        const structuralElements = contentMain.querySelectorAll('.article-share-bar, .article-author-bio');
        contentMain.innerHTML = '';
        
        // Re-add structural elements
        structuralElements.forEach(el => contentMain.appendChild(el));

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'article-content-dynamic';

        // Process each content block
        article.content.forEach((block, index) => {
            const element = createContentElement(block, index, article);
            if (element) {
                contentContainer.appendChild(element);
            }
        });

        // Insert content at the beginning
        contentMain.insertBefore(contentContainer, contentMain.firstChild);

        // Add gallery if exists
        if (article.gallery && article.gallery.length > 0) {
            const galleryElement = createGallery(article.gallery);
            contentContainer.appendChild(galleryElement);
        }

        // Add timeline if exists
        if (article.timeline && article.timeline.length > 0) {
            const timelineElement = createTimeline(article.timeline);
            contentContainer.appendChild(timelineElement);
        }
    }

    /**
     * Create content element based on type
     * @param {Object} block - Content block data
     * @param {number} index - Block index
     * @param {Object} article - Full article data
     * @returns {HTMLElement|null} Created element
     */
    function createContentElement(block, index, article) {
        switch (block.type) {
            case 'lead':
                return createLeadParagraph(block.text);
            
            case 'paragraph':
                return createParagraph(block.text);
            
            case 'heading':
                return createHeading(block.text);
            
            case 'image':
                return createImage(block.src, block.caption);
            
            case 'quote':
                return createQuote(block.text, block.author, block.authorRole, block.authorImage);
            
            default:
                console.warn('Unknown content type:', block.type);
                return null;
        }
    }

    /**
     * Create lead paragraph
     * @param {string} text - Paragraph text
     * @returns {HTMLElement} Paragraph element
     */
    function createLeadParagraph(text) {
        const p = document.createElement('p');
        p.className = 'lead-paragraph';
        p.innerHTML = text;
        return p;
    }

    /**
     * Create regular paragraph
     * @param {string} text - Paragraph text
     * @returns {HTMLElement} Paragraph element
     */
    function createParagraph(text) {
        const p = document.createElement('p');
        p.innerHTML = text;
        return p;
    }

    /**
     * Create heading
     * @param {string} text - Heading text
     * @returns {HTMLElement} Heading element
     */
    function createHeading(text) {
        const h2 = document.createElement('h2');
        h2.textContent = text;
        return h2;
    }

    /**
     * Create article image with caption
     * @param {string} src - Image source
     * @param {string} caption - Image caption
     * @returns {HTMLElement} Figure element
     */
    function createImage(src, caption) {
        const figure = document.createElement('figure');
        figure.className = 'article-image';

        const img = document.createElement('img');
        img.src = src || CONFIG.defaultImage;
        img.alt = caption || 'Article image';
        img.loading = 'lazy';

        figure.appendChild(img);

        if (caption) {
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = caption;
            figure.appendChild(figcaption);
        }

        return figure;
    }

    /**
     * Create blockquote with author
     * @param {string} text - Quote text
     * @param {string} author - Author name
     * @param {string} authorRole - Author role/title
     * @param {string} authorImage - Author image URL
     * @returns {HTMLElement} Blockquote element
     */
    function createQuote(text, author, authorRole, authorImage) {
        const blockquote = document.createElement('blockquote');
        blockquote.className = 'article-quote';

        const quoteIcon = document.createElement('div');
        quoteIcon.className = 'quote-icon';
        quoteIcon.innerHTML = '<svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>';
        blockquote.appendChild(quoteIcon);

        const quoteText = document.createElement('p');
        quoteText.textContent = text;
        blockquote.appendChild(quoteText);

        if (author) {
            const quoteAuthor = document.createElement('div');
            quoteAuthor.className = 'quote-author';

            if (authorImage) {
                const authorImg = document.createElement('img');
                authorImg.src = authorImage;
                authorImg.alt = author;
                quoteAuthor.appendChild(authorImg);
            }

            const authorInfo = document.createElement('div');
            
            const authorName = document.createElement('div');
            authorName.className = 'author-name-quote';
            authorName.textContent = author;
            authorInfo.appendChild(authorName);

            if (authorRole) {
                const authorRoleElem = document.createElement('div');
                authorRoleElem.className = 'author-role';
                authorRoleElem.textContent = authorRole;
                authorInfo.appendChild(authorRoleElem);
            }

            quoteAuthor.appendChild(authorInfo);
            blockquote.appendChild(quoteAuthor);
        }

        return blockquote;
    }

    /**
     * Create image gallery
     * @param {Array} images - Gallery images array
     * @returns {HTMLElement} Gallery element
     */
    function createGallery(images) {
        const section = document.createElement('section');
        section.className = 'article-gallery';

        const title = document.createElement('h3');
        title.textContent = 'Galería de Imágenes';
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'gallery-grid';

        images.forEach(image => {
            const figure = document.createElement('figure');
            
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.caption || 'Gallery image';
            img.loading = 'lazy';
            figure.appendChild(img);

            if (image.caption) {
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = image.caption;
                figure.appendChild(figcaption);
            }

            grid.appendChild(figure);
        });

        section.appendChild(grid);
        return section;
    }

    /**
     * Create timeline
     * @param {Array} events - Timeline events array
     * @returns {HTMLElement} Timeline element
     */
    function createTimeline(events) {
        const section = document.createElement('section');
        section.className = 'article-timeline';

        const title = document.createElement('h3');
        title.textContent = 'Cronología del Combate';
        section.appendChild(title);

        events.forEach(event => {
            const item = document.createElement('div');
            item.className = 'timeline-item';

            const round = document.createElement('div');
            round.className = 'timeline-round';
            round.textContent = event.round;
            item.appendChild(round);

            const content = document.createElement('div');
            content.className = 'timeline-content';

            const eventTitle = document.createElement('h4');
            eventTitle.textContent = event.title;
            content.appendChild(eventTitle);

            const eventDesc = document.createElement('p');
            eventDesc.textContent = event.description;
            content.appendChild(eventDesc);

            item.appendChild(content);
            section.appendChild(item);
        });

        return section;
    }

    /**
     * Inject article tags
     * @param {Object} article - Article data
     */
    function injectTags(article) {
        const tagsContainer = document.querySelector('.article-tags');
        if (!tagsContainer || !article.tags) return;

        // Clear existing tags
        tagsContainer.innerHTML = '<h3>Etiquetas</h3>';

        const tagsList = document.createElement('div');
        tagsList.className = 'tags-list';

        article.tags.forEach(tag => {
            const tagLink = document.createElement('a');
            tagLink.href = `#${tag.toLowerCase().replace(/\s+/g, '-')}`;
            tagLink.className = 'tag';
            tagLink.textContent = tag;
            tagsList.appendChild(tagLink);
        });

        tagsContainer.appendChild(tagsList);
    }

    /**
     * Show error state when article not found
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
                    <p>Lo sentimos, el artículo que buscas no está disponible o ha sido eliminado.</p>
                    <div class="error-actions">
                        <a href="index.html" class="btn-primary">Volver al Inicio</a>
                        <button onclick="history.back()" class="btn-secondary">Regresar</button>
                    </div>
                </div>
            </div>
        `;

        // Auto-redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, CONFIG.errorRedirectDelay);
    }

    /**
     * Initialize article loader
     */
    async function init() {
        try {
            // Get article slug from URL
            const slug = getUrlParameter('slug');
            
            if (!slug) {
                console.error('No article slug provided');
                showErrorState();
                return;
            }

            // Load articles data
            const data = await loadArticlesData();
            
            if (!data || !data.articles || data.articles.length === 0) {
                console.error('No articles data available');
                showErrorState();
                return;
            }

            // Find article by slug
            const article = findArticleBySlug(data.articles, slug);
            
            if (!article) {
                console.error('Article not found:', slug);
                showErrorState();
                return;
            }

            // Inject article content
            injectArticleContent(article);

        } catch (error) {
            console.error('Error initializing article loader:', error);
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
