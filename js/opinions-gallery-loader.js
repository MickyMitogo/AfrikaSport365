/**
 * Opinions Gallery Loader
 * Carga todas las opiniones, análisis y entrevistas dinámicamente en la galería
 */

import { getAllNews } from './firebase-config.js';

'use strict';

/**
 * Load opinions data from Firebase Firestore
 * @returns {Promise<Array>} Opinions data array
 */
async function loadOpinionsData() {
    try {
        const opinions = await getAllNews('analisis_opinion');
        return Array.isArray(opinions) ? opinions : [];
    } catch (error) {
        console.error('Error loading opinions data from Firebase:', error);
        return [];
    }
}

/**
 * Inject opinions into gallery grid
 * @param {Array} opinions - Opinions array
 */
function injectOpinionsGallery(opinions) {
    const grid = document.querySelector('.opinions-grid');
    const emptyState = document.querySelector('.empty-state');

    if (!grid) return;

    if (!opinions || opinions.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    grid.innerHTML = '';

    opinions.forEach(opinion => {
        const card = document.createElement('a');
        card.href = `opinion.html?slug=${opinion.slug || opinion.id}`;
        card.className = 'opinion-card';

        // Image container with badge
        const imageContainer = document.createElement('div');
        imageContainer.style.position = 'relative';
        imageContainer.style.overflow = 'hidden';

        const img = document.createElement('img');
        img.src = opinion.imagen || 'images/placeholder.jpg';
        img.alt = opinion.titulo;
        img.className = 'opinion-image';
        imageContainer.appendChild(img);

        const badgeOverlay = document.createElement('span');
        badgeOverlay.className = 'opinion-badge-overlay';
        badgeOverlay.textContent = opinion.badge;
        badgeOverlay.style.background = opinion.badgeColor || '#8b5cf6';
        imageContainer.appendChild(badgeOverlay);

        card.appendChild(imageContainer);

        // Info section
        const info = document.createElement('div');
        info.className = 'opinion-info';

        const title = document.createElement('h3');
        title.className = 'opinion-title';
        title.textContent = opinion.titulo;
        info.appendChild(title);

        const resumen = document.createElement('p');
        resumen.className = 'opinion-resumen';
        resumen.textContent = opinion.resumen;
        info.appendChild(resumen);

        // Meta section
        const meta = document.createElement('div');
        meta.className = 'opinion-meta';

        const author = document.createElement('span');
        author.className = 'opinion-author';
        author.textContent = opinion.autor;
        meta.appendChild(author);

        const fecha = document.createElement('span');
        fecha.className = 'opinion-fecha';
        fecha.textContent = opinion.fechaMostrada || opinion.fecha || opinion.meta?.date;
        meta.appendChild(fecha);

        info.appendChild(meta);
        card.appendChild(info);
        grid.appendChild(card);
    });

    // Hide empty state if we have opinions
    if (emptyState && opinions.length > 0) {
        emptyState.style.display = 'none';
    }

    console.log(`Opiniones cargadas: ${opinions.length}`);
}

/**
 * Initialize gallery when DOM is ready
 */
async function init() {
    try {
        const opinions = await loadOpinionsData();
        injectOpinionsGallery(opinions);
    } catch (error) {
        console.error('Error initializing opinions gallery:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
