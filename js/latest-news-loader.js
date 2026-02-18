/**
 * Latest News Dynamic Loader
 * Loads news cards from Firebase and filters featured items for homepage
 */

import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

async function init() {
    try {
        // Cargar desde Firebase Firestore
        const querySnapshot = await getDocs(collection(db, 'noticias'));
        const allNews = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            allNews.push({
                id: doc.id,
                title: data.title || '',
                excerpt: data.excerpt || '',
                category: data.category || '',
                categoryColor: data.categoryColor || '#667eea',
                image: data.image || '',
                imageAlt: data.title || 'Imagen de noticia',
                slug: data.slug || data.id,
                featured: data.featured === true,
                order: data.order || 0,
                meta: {
                    author: data.meta?.author || 'AfrikaSport365',
                    date: data.meta?.date || new Date().toISOString().split('T')[0]
                }
            });
        });

        // Filtrar solo noticias destacadas (featured)
        const featuredNews = allNews.filter(item => item.featured === true);
        renderNewsGrid(featuredNews);
    } catch (error) {
        console.error('Error loading latest news from Firebase:', error);
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
