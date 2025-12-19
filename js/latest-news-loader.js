/**
 * Latest News Dynamic Loader
 * Loads news cards from data/latest-news.json and renders them in the homepage
 */

(function() {
    'use strict';

    const DATA_PATH = 'data/latest-news.json';
    
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
            if (!data.latestNews || !Array.isArray(data.latestNews)) {
                console.warn('Invalid latest news data structure');
                return;
            }
            
            renderNewsGrid(data.latestNews);
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
        
        sortedNews.forEach(item => {
            const card = createNewsCard(item);
            newsGrid.appendChild(card);
        });
    }
    
    function createNewsCard(item) {
        const article = document.createElement('article');
        article.className = item.featured ? 'news-card news-card-large' : 'news-card';
        article.setAttribute('data-article-slug', item.slug);
        
        const commentsHTML = item.meta.comments > 0 
            ? `<span>💬 ${item.meta.comments} comentarios</span>` 
            : '';
        
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
                    <span>📅 ${item.meta.time}</span>
                    <span>✍️ ${item.meta.author}</span>
                    ${commentsHTML}
                </div>
            </div>
        `;
        
        return article;
    }
})();
