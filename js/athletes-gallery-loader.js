/**
 * Athletes Gallery Loader
 * Carga todos los atletas dinámicamente en la galería
 */

(function () {
    'use strict';

    /**
     * Load athletes data from JSON
     * @returns {Promise<Array>} Athletes data array
     */
    async function loadAthletesData() {
        try {
            const response = await fetch('data/athletes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error loading athletes data:', error);
            return [];
        }
    }

    /**
     * Inject athletes into gallery grid
     * @param {Array} athletes - Athletes array
     */
    function injectAthletesGallery(athletes) {
        const grid = document.querySelector('.athletes-grid');
        const emptyState = document.querySelector('.empty-state');

        if (!grid) return;

        if (!athletes || athletes.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        grid.innerHTML = '';

        athletes.forEach(athlete => {
            const card = document.createElement('a');
            card.href = `athlete.html?slug=${athlete.slug}`;
            card.className = 'athlete-grid-card';

            // Create image with badge overlay
            const imageContainer = document.createElement('div');
            imageContainer.style.position = 'relative';
            imageContainer.style.overflow = 'hidden';

            const img = document.createElement('img');
            img.src = athlete.imagen || 'images/placeholder.jpg';
            img.alt = athlete.nombre;
            img.className = 'athlete-grid-image';
            imageContainer.appendChild(img);

            const badgeOverlay = document.createElement('span');
            badgeOverlay.className = 'athlete-badge-overlay';
            badgeOverlay.textContent = athlete.badge;
            badgeOverlay.style.background = athlete.badgeColor || '#2563eb';
            imageContainer.appendChild(badgeOverlay);

            card.appendChild(imageContainer);

            // Info section
            const info = document.createElement('div');
            info.className = 'athlete-grid-info';

            const name = document.createElement('h3');
            name.className = 'athlete-grid-name';
            name.textContent = athlete.nombre;
            info.appendChild(name);

            const title = document.createElement('p');
            title.className = 'athlete-grid-title';
            title.textContent = athlete.titulo;
            info.appendChild(title);

            // Stats
            if (athlete.stats && athlete.stats.length > 0) {
                const stats = document.createElement('div');
                stats.className = 'athlete-grid-stats';

                athlete.stats.slice(0, 3).forEach(stat => {
                    const statDiv = document.createElement('div');
                    statDiv.className = 'athlete-grid-stat';

                    const value = document.createElement('span');
                    value.className = 'athlete-grid-stat-value';
                    value.textContent = stat.valor;
                    statDiv.appendChild(value);

                    const label = document.createElement('span');
                    label.className = 'athlete-grid-stat-label';
                    label.textContent = stat.etiqueta;
                    statDiv.appendChild(label);

                    stats.appendChild(statDiv);
                });

                info.appendChild(stats);
            }

            card.appendChild(info);
            grid.appendChild(card);
        });

        // Hide empty state if we have athletes
        if (emptyState && athletes.length > 0) {
            emptyState.style.display = 'none';
        }

        console.log(`Atletas cargados: ${athletes.length}`);
    }

    /**
     * Initialize gallery when DOM is ready
     */
    async function init() {
        try {
            const athletes = await loadAthletesData();
            injectAthletesGallery(athletes);
        } catch (error) {
            console.error('Error initializing athletes gallery:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
