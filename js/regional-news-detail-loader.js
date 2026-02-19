/**
 * Regional News Detail Loader - Firebase Version
 * Carga y renderiza el detalle de una noticia específica por slug desde Firestore
 */

import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js';

const REGIONAL_NEWS_COLLECTION = 'regional_news';

let allNews = [];

// Obtener slug desde URL
function getSlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
}

// Cargar todas las noticias desde Firebase
async function loadRegionalNews() {
    try {
        console.log('📥 Cargando noticias regionales desde Firestore...');
        console.log('📍 Collection name:', REGIONAL_NEWS_COLLECTION);
        const snapshot = await getDocs(collection(db, REGIONAL_NEWS_COLLECTION));
        allNews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(`✓ ${allNews.length} noticias regionales cargadas`);
        console.log('📋 Datos cargados:', allNews);

        if (allNews.length === 0) {
            console.warn('⚠️ No hay noticias en la colección');
        }

        return allNews;
    } catch (error) {
        console.error('❌ Error loading regional news:', error);
        console.error('Error details:', error.message);
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
    document.getElementById('article-category').textContent = article.categoria || 'General';
    document.getElementById('article-region').textContent = article.regionName || 'Región';

    // Author and Date
    document.getElementById('article-author').textContent = `Por ${article.autor || 'Autor desconocido'}`;
    document.getElementById('article-date').textContent = article.fechaMostrada || new Date(article.fecha).toLocaleDateString('es-ES');

    // Lead and Content
    document.getElementById('article-lead').textContent = article.resumen || '';
    document.getElementById('article-content').innerHTML = `<p>${(article.contenido || '').replace(/\n/g, '</p><p>')}</p>`;

    // Cargar noticias relacionadas
    loadRelatedNews(article.region, article.slug);
}

// Cargar noticias relacionadas de la misma región
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
                <p>${(item.resumen || '').substring(0, 120)}...</p>
                <a href="regional-news-detail.html?slug=${item.slug}" class="related-card-link">Leer más →</a>
            </div>
        </article>
    `).join('');
}

// Inicializar
async function init() {
    const slug = getSlugFromURL();
    console.log('🔍 Buscando slug desde URL:', slug);

    if (!slug) {
        document.body.innerHTML = '<div class="container mx-auto px-4 py-12"><p class="text-center text-gray-600">Slug no especificado.</p></div>';
        return;
    }

    await loadRegionalNews();
    console.log('🔎 Buscando artículo con slug:', slug);
    console.log('📚 Slugs disponibles:', allNews.map(n => n.slug));

    const article = allNews.find(item => item.slug === slug);

    if (!article) {
        console.warn('⚠️ Artículo no encontrado para slug:', slug);
        console.log('📊 Total noticias cargadas:', allNews.length);
    } else {
        console.log('✓ Artículo encontrado:', article.titulo);
    }

    renderArticle(article);
}

// Iniciar cuando esté listo el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
