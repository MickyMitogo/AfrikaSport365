// breaking-news-loader.js
// Carga y muestra las breaking news dinámicamente en el ticker desde Firebase

import { getAllNews } from './firebase-config.js';

async function loadBreakingNews() {
    try {
        const ticker = document.getElementById('breaking-ticker');
        if (!ticker) {
            console.warn('[BreakingNewsLoader] Ticker container not found');
            return;
        }

        // Load breaking news from noticias_urgentes collection in Firebase
        const breakingNews = await getAllNews('noticias_urgentes');

        if (!breakingNews || breakingNews.length === 0) {
            console.warn('[BreakingNewsLoader] No breaking news found in Firebase');
            ticker.innerHTML = '<span class="ticker-item">Cargando noticias de última hora...</span>';
            return;
        }

        // Create ticker items from breaking news
        ticker.innerHTML = '';

        // Add each news item twice for seamless loop
        const allItems = breakingNews.concat(breakingNews);
        allItems.forEach(news => {
            const span = document.createElement('span');
            span.className = 'ticker-item';
            span.textContent = news.title;
            ticker.appendChild(span);
        });

        console.log(`[BreakingNewsLoader] Loaded ${breakingNews.length} breaking news items from Firebase`);

    } catch (error) {
        console.error('[BreakingNewsLoader] Error loading breaking news:', error);
        const ticker = document.getElementById('breaking-ticker');
        if (ticker) {
            ticker.innerHTML = '<span class="ticker-item">Error al cargar noticias de última hora</span>';
        }
    }
}

// Load breaking news when DOM is ready
document.addEventListener('DOMContentLoaded', loadBreakingNews);

// Also load on page visibility change (if user returns to tab)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        console.log('[BreakingNewsLoader] Page visible, refreshing breaking news...');
        loadBreakingNews();
    }
});
