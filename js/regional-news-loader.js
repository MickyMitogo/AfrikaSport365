/**
 * Regional News Loader - Firebase Version
 * Carga y renderiza noticias por región dinámicamente desde Firestore
 */

import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js';

const REGIONAL_NEWS_COLLECTION = 'regional_news';

let allNews = [];
let currentRegion = 'maghreb';

// Cargar datos desde Firebase
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

// Renderizar noticias por región
function renderRegion(region) {
    const container = document.getElementById('nrr-content');
    if (!container) {
        console.warn('⚠️ Contenedor nrr-content no encontrado');
        return;
    }

    console.log('🎨 Renderizando región:', region);
    console.log('📊 Total noticias:', allNews.length);
    console.log('🔍 Noticias de región', region, ':', allNews.filter(item => item.region === region).length);

    const regionNews = allNews.filter(item => item.region === region).slice(0, 2);

    if (regionNews.length === 0) {
        console.warn(`⚠️ No hay noticias para la región: ${region}`);
        container.innerHTML = '<div class="text-sm text-gray-500 py-8">No hay noticias para esta región.</div>';
        return;
    }

    console.log(`✓ Renderizando ${regionNews.length} noticias para ${region}`);
    container.innerHTML = '<div class="nrr-list">' + regionNews.map(item => `
        <article class="nrr-item">
            <div class="nrr-media-container">
                <img src="${item.imagen}" alt="${item.titulo}" class="nrr-media" />
            </div>
            <div class="nrr-text">
                <h3 class="nrr-title">
                    <a href="regional-news-detail.html?slug=${item.slug}" class="news-link">${item.titulo}</a>
                </h3>
                <p class="nrr-lead">${item.resumen || ''}</p>
            </div>
        </article>
    `).join('') + '</div>';

    // Actualizar estado de tabs
    updateTabState(region);
}

// Actualizar estado visual de tabs
function updateTabState(region) {
    document.querySelectorAll('#nrr-tablist [role="tab"]').forEach(btn => {
        const isActive = btn.dataset.region === region;
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.classList.toggle('regional-tab-active', isActive);
    });
}

// Obtener región desde URL
function getRegionFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('region') || 'maghreb';
}

// Inicializar
async function init() {
    await loadRegionalNews();

    // Obtener región desde URL o usar por defecto
    currentRegion = getRegionFromURL();

    const tablist = document.getElementById('nrr-tablist');
    if (!tablist) return;

    // Eventos de tabs
    tablist.addEventListener('click', (e) => {
        const btn = e.target.closest('[role="tab"]');
        if (btn) {
            currentRegion = btn.dataset.region;
            renderRegion(currentRegion);
        }
    });

    // Renderizar región seleccionada
    renderRegion(currentRegion);
}

// Iniciar cuando esté listo el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
