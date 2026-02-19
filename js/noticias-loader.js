/**
 * Noticias Loader - Carga dinámicamente todas las noticias desde Firebase
 */

import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let allNews = [];
let filteredNews = [];
let currentPage = 1;
const itemsPerPage = 12;
let currentFilter = 'todos';

// Función para normalizar texto (remover acentos)
function normalizeText(text) {
    if (!text) return '';
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

// Mapeo de categorías para normalizar
const categoryMap = {
    'futbol': ['FUTBOL', 'FUTBOLA', 'FUTBOLBOL'],
    'atletismo': ['ATLETISMO'],
    'judo': ['JUDO'],
    'baloncesto': ['BALONCESTO'],
    'ciclismo': ['CICLISMO'],
    'tenis': ['TENIS'],
    'rugby': ['RUGBY'],
    'boxeo': ['BOXEO']
};

// Categorías conocidas para determinar si algo es "Otros"
const knownCategories = new Set();
Object.values(categoryMap).forEach(cats => cats.forEach(cat => knownCategories.add(cat)));

async function loadAllNews() {
    try {
        // Cargar desde Firebase Firestore
        const querySnapshot = await getDocs(collection(db, 'noticias'));
        allNews = [];

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
                meta: {
                    author: data.meta?.author || 'AfrikaSport365',
                    date: data.meta?.date || new Date().toISOString().split('T')[0]
                }
            });
        });

        // Ordenar por fecha descendente
        allNews.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));

    } catch (error) {
        console.error('Error loading news from Firebase:', error);
        showNoNewsMessage();
    }
}

function filterNews(sport) {
    currentPage = 1;
    currentFilter = sport;

    // Actualizar estado de botones
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(sport) ||
            (sport === 'todos' && btn.textContent.includes('Todos'))) {
            btn.classList.add('active');
        }
    });

    // Filtrar noticias
    if (sport === 'todos') {
        filteredNews = [...allNews];
    } else if (sport === 'otros') {
        // Mostrar noticias que no estén en ninguna categoría conocida
        filteredNews = allNews.filter(news => {
            const normalizedCategory = normalizeText(news.category);
            return !Array.from(knownCategories).some(cat => normalizedCategory === cat || normalizedCategory.includes(cat));
        });
    } else {
        const sportCategories = categoryMap[sport] || [];
        filteredNews = allNews.filter(news => {
            const normalizedCategory = normalizeText(news.category);
            return sportCategories.some(cat => normalizedCategory === cat || normalizedCategory.includes(cat));
        });
    }

    // Mostrar noticias
    displayNews();
}

function displayNews() {
    const grid = document.getElementById('allNewsGrid');
    const noMessage = document.getElementById('noNewsMessage');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    // Limpiar grid
    grid.innerHTML = '';

    // Mostrar mensaje si no hay noticias
    if (filteredNews.length === 0) {
        grid.style.display = 'none';
        noMessage.style.display = 'block';
        loadMoreBtn.style.display = 'none';
        return;
    }

    grid.style.display = 'grid';
    noMessage.style.display = 'none';

    // Calcular número de elementos a mostrar
    const itemsToShow = currentPage * itemsPerPage;
    const newsToDisplay = filteredNews.slice(0, itemsToShow);

    // Crear tarjetas de noticias
    newsToDisplay.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.setAttribute('data-slug', news.slug);
        newsCard.style.cursor = 'pointer';
        newsCard.innerHTML = `
            <div style="border-radius: 8px; overflow: hidden; height: 100%; display: flex; flex-direction: column; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease; transform: scale(1); hover: scale(1.02);">
                <div style="position: relative; overflow: hidden; height: 200px;">
                    <img src="${news.image}" alt="${news.imageAlt}" style="width: 100%; height: 100%; object-fit: cover;">
                    <span style="position: absolute; top: 12px; right: 12px; background: ${news.categoryColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                        ${news.category}
                    </span>
                </div>
                <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column;">
                    <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.4; color: #1f2937;">
                        ${news.title}
                    </h3>
                    <p style="color: #6b7280; font-size: 0.95rem; margin-bottom: 1rem; flex: 1; line-height: 1.5;">
                        ${news.excerpt}
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #e5e7eb; font-size: 0.85rem; color: #9ca3af;">
                        <span>${news.meta.date}</span>
                        <span>${news.meta.author}</span>
                    </div>
                </div>
            </div>
        `;
        newsCard.addEventListener('click', () => {
            window.location.href = `article.html?slug=${news.slug}`;
        });
        grid.appendChild(newsCard);
    });

    // Mostrar/ocultar botón "Cargar más"
    if (itemsToShow < filteredNews.length) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

function loadMore() {
    currentPage++;
    displayNews();

    // Scroll suave hacia las nuevas noticias
    setTimeout(() => {
        const grid = document.getElementById('allNewsGrid');
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    // Primero cargar los datos
    await loadAllNews();

    // Luego chequear si hay un filtro en URL
    const urlParams = new URLSearchParams(window.location.search);
    const sportFilter = urlParams.get('filter') || 'todos'; // Mostrar todas por defecto
    filterNews(sportFilter);
});

// Expose functions to global scope so onclick handlers work
window.filterNews = filterNews;
window.loadMore = loadMore;
