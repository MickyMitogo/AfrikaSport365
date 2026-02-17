/**
 * Latest News Dynamic Loader
 * Loads news cards from data/all-news.json and filters featured items for homepage
 */

(function () {
    'use strict';

    const DATA_PATH = 'data/all-news.json';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    async function init() {
        try {
            const response = await fetch(DATA_PATH);
            if (!response.ok) {
                console.warn('Latest news data not found, using static HTML');
                return;
            }

            const data = await response.json();
            if (!data.news || !Array.isArray(data.news)) {
                console.warn('Invalid news data structure');
                return;
            }

            // Filtrar solo noticias destacadas (featured)
            const featuredNews = data.news.filter(item => item.featured === true);
            renderNewsGrid(featuredNews);
        } catch (error) {
            console.error('Error loading latest news:', error);
        }
    }

    function renderNewsGrid(newsItems) {
        const newsGrid = document.querySelector('.news-grid');
        if (!newsGrid) return;

        // Clear existing content
        newsGrid.innerHTML = '';

        // Sort by order
        const sortedNews = newsItems.sort((a, b) => a.order - b.order);

        sortedNews.forEach((item, index) => {
            const card = createNewsCard(item, index === 0);
            newsGrid.appendChild(card);
        });
    }

    function createNewsCard(item, isLarge) {
        const article = document.createElement('article');
        article.className = isLarge ? 'news-card news-card-large' : 'news-card';
        article.setAttribute('data-article-slug', item.slug);

        article.innerHTML = `
            <div class="news-image">
                <img src="${item.image}" alt="${item.imageAlt || item.title}">
                <span class="news-category-badge" style="background: ${item.categoryColor};">${item.category}</span>
            </div>
            <div class="news-content">
                <h3 class="news-title">
                    <a href="article.html?slug=${item.slug}">${item.title}</a>
                </h3>
                <p class="news-excerpt">${item.excerpt}</p>
                <div class="news-meta">
                    <span>📅 ${item.meta.date}</span>
                    <span>✍️ ${item.meta.author}</span>
                </div>
            </div>
        `;

        return article;
    }
})();
