/**
 * Regional News Loader
 * Carga y renderiza noticias por región dinámicamente
 */

(function () {
    'use strict';

    let allNews = [];
    let currentRegion = 'maghreb';

    // Cargar datos
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

    // Renderizar noticias por región
    function renderRegion(region) {
        const container = document.getElementById('nrr-content');
        if (!container) return;

        const regionNews = allNews.filter(item => item.region === region);

        if (regionNews.length === 0) {
            container.innerHTML = '<div class="text-sm text-gray-500 py-8">No hay noticias para esta región.</div>';
            return;
        }

        container.innerHTML = '<div class="nrr-grid">' + regionNews.map(item => `
            <article class="nrr-article">
                <div class="nrr-media-container">
                    <img src="${item.imagen}" alt="${item.titulo}" class="nrr-media" />
                </div>
                <div class="nrr-text">
                    <h3 class="nrr-title">
                        <a href="regional-news.html?slug=${item.slug}" class="news-link">${item.titulo}</a>
                    </h3>
                    <p class="nrr-lead">${item.resumen}</p>
                    <div class="nrr-meta">
                        <span>${item.fechaMostrada}</span>
                        <span>${item.categoria}</span>
                    </div>
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
})();
