/**
 * Regional News Detail Loader
 * Carga y renderiza el detalle de una noticia específica por slug
 */

(function () {
    'use strict';

    let allNews = [];

    // Obtener slug desde URL
    function getSlugFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('slug');
    }

    // Cargar todas las noticias
    async function loadRegionalNews() {
        try {
            const response = await fetch('data/regional-news.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            allNews = await response.json();
            return allNews;
        } catch (error) {
            console.error('Error loading regional news:', error);
            return [];
        }
    }

    // Renderizar artículo detallado
    function renderArticle(article) {
        if (!article) {
            document.body.innerHTML = '<div class="container mx-auto px-4 py-12"><p class="text-center text-gray-600">Artículo no encontrado.</p></div>';
            return;
        }

        // Hero image
        const heroImage = document.getElementById('article-hero-image');
        heroImage.src = article.imagen;
        heroImage.alt = article.titulo;

        // Title
        document.title = `${article.titulo} | AfrikaSport365`;
        document.getElementById('article-title').textContent = article.titulo;

        // Category and Region badges
        document.getElementById('article-category').textContent = article.categoria;
        document.getElementById('article-region').textContent = article.regionName;

        // Author and Date
        document.getElementById('article-author').textContent = `Por ${article.autor}`;
        document.getElementById('article-date').textContent = article.fechaMostrada;

        // Lead and Content
        document.getElementById('article-lead').textContent = article.resumen;
        document.getElementById('article-content').innerHTML = `<p>${article.contenido.replace(/\n/g, '</p><p>')}</p>`;

        // Cargar noticias relacionadas
        loadRelatedNews(article.region, article.slug);
    }

    // Cargar noticias relacionadas
    function loadRelatedNews(region, currentSlug) {
        const relatedNews = allNews
            .filter(item => item.region === region && item.slug !== currentSlug)
            .slice(0, 3);

        const relatedContainer = document.getElementById('related-news');

        if (relatedNews.length === 0) {
            relatedContainer.innerHTML = '<p class="text-gray-400">No hay noticias relacionadas.</p>';
            return;
        }

        relatedContainer.innerHTML = relatedNews.map(item => `
            <article class="related-card">
                <img src="${item.imagen}" alt="${item.titulo}" />
                <div class="related-card-content">
                    <h3>${item.titulo}</h3>
                    <p>${item.resumen.substring(0, 120)}...</p>
                    <a href="regional-news-detail.html?slug=${item.slug}" class="related-card-link">Leer más →</a>
                </div>
            </article>
        `).join('');
    }

    // Inicializar
    async function init() {
        const slug = getSlugFromURL();

        if (!slug) {
            document.body.innerHTML = '<div class="container mx-auto px-4 py-12"><p class="text-center text-gray-600">Slug no especificado.</p></div>';
            return;
        }

        await loadRegionalNews();
        const article = allNews.find(item => item.slug === slug);
        renderArticle(article);
    }

    // Iniciar cuando esté listo el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
