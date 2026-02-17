/**
 * AfrikaSport365 - Athlete Dynamic Loader
 * Production-grade system for loading athlete profiles dynamically
 */

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        athletesDataPath: 'data/athletes.json',
        defaultImage: 'images/placeholder.jpg',
        errorRedirectDelay: 5000
    };

    /**
     * Get URL parameter by name
     * @param {string} name - Parameter name
     * @returns {string|null} Parameter value or null
     */
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    /**
     * Load athletes data from JSON
     * @returns {Promise<Array>} Athletes data array
     */
    async function loadAthletesData() {
        try {
            const response = await fetch(CONFIG.athletesDataPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error loading athletes data:', error);
            throw error;
        }
    }

    /**
     * Find athlete by slug
     * @param {Array} athletes - Athletes array
     * @param {string} slug - Athlete slug
     * @returns {Object|null} Athlete object or null
     */
    function findAthleteBySlug(athletes, slug) {
        if (!slug || !Array.isArray(athletes)) return null;

        const lowered = slug.toLowerCase();

        return athletes.find(athlete => {
            if (!athlete) return false;
            const aSlug = (athlete.slug || '').toLowerCase();
            const aId = (athlete.id || '').toLowerCase();

            // Exact match against slug or id
            if (aSlug === lowered || aId === lowered) return true;

            // Allow some tolerance for variants
            if (aSlug && lowered && (aSlug.includes(lowered) || lowered.includes(aSlug))) return true;
            if (aId && lowered && (aId.includes(lowered) || lowered.includes(aId))) return true;

            return false;
        }) || null;
    }

    /**
     * Inject athlete profile content
     * @param {Object} athlete - Athlete data
     */
    function injectAthleteContent(athlete) {
        try {
            // Update page title and meta
            document.title = `${athlete.nombre} - AfrikaSport365`;

            // Update breadcrumb
            const breadcrumbCategory = document.querySelector('.breadcrumb a:last-of-type');
            if (breadcrumbCategory) {
                breadcrumbCategory.textContent = athlete.category || athlete.badge;
            }

            // Main athlete profile image
            const profileImage = document.querySelector('.athlete-image-main');
            if (profileImage) {
                profileImage.src = athlete.imagen || CONFIG.defaultImage;
                profileImage.alt = athlete.nombre;
            }

            // Sport badge
            const sportBadge = document.querySelector('.athlete-badge-main');
            if (sportBadge) {
                sportBadge.textContent = athlete.badge;
                sportBadge.style.backgroundColor = athlete.badgeColor || '#2563eb';
            }

            // Athlete name and title
            const nameElement = document.querySelector('.athlete-name-main');
            if (nameElement) nameElement.textContent = athlete.nombre;

            const titleElement = document.querySelector('.athlete-title-main');
            if (titleElement) titleElement.textContent = athlete.titulo;

            // Biography
            const bioText = document.querySelector('.athlete-bio-text');
            if (bioText) bioText.textContent = athlete.bio || athlete.description || '';

            // Personal information
            updatePersonalInfo(athlete);

            // Statistics
            injectStatistics(athlete);

            // Achievements/Logros
            injectAchievements(athlete);

            // Related athletes section
            loadAthletesData().then(athletes => {
                injectRelatedAthletes(athletes, athlete);
            });

            // Show profile (remove loading state if exists)
            const athletePage = document.querySelector('.athlete-page');
            if (athletePage) {
                athletePage.classList.remove('loading');
                athletePage.style.opacity = '1';
            }

            console.log('Athlete profile loaded successfully:', athlete.slug);

        } catch (error) {
            console.error('Error injecting athlete content:', error);
            showErrorState();
        }
    }

    /**
     * Update personal information section
     * @param {Object} athlete - Athlete data
     */
    function updatePersonalInfo(athlete) {
        const ageElement = document.querySelector('.athlete-age');
        if (ageElement) {
            if (athlete.edad) {
                ageElement.textContent = athlete.edad + ' años';
            } else {
                ageElement.textContent = '-';
            }
        }

        const heightElement = document.querySelector('.athlete-height');
        if (heightElement) {
            heightElement.textContent = athlete.altura || '-';
        }

        const locationElement = document.querySelector('.athlete-location');
        if (locationElement) {
            locationElement.textContent = athlete.localidad || '-';
        }

        const categoryElement = document.querySelector('.athlete-category');
        if (categoryElement) {
            const categoryText = athlete.especialidad || athlete.posicion || athlete.category || '-';
            categoryElement.textContent = categoryText;
        }
    }

    /**
     * Inject athlete statistics
     * @param {Object} athlete - Athlete data
     */
    function injectStatistics(athlete) {
        const statsGrid = document.querySelector('.stats-grid');
        if (!statsGrid || !athlete.stats || athlete.stats.length === 0) return;

        statsGrid.innerHTML = '';

        athlete.stats.forEach(stat => {
            const statCard = document.createElement('div');
            statCard.className = 'stat-card';
            statCard.innerHTML = `
                <span class="stat-value">${stat.valor}</span>
                <span class="stat-label">${stat.etiqueta}</span>
            `;
            statsGrid.appendChild(statCard);
        });
    }

    /**
     * Inject athlete achievements/logros
     * @param {Object} athlete - Athlete data
     */
    function injectAchievements(athlete) {
        const logrosList = document.querySelector('.athlete-logros');
        if (!logrosList || !athlete.logros || athlete.logros.length === 0) {
            if (logrosList) {
                logrosList.innerHTML = '<li style="color: #6b7280;">Sin logros registrados</li>';
            }
            return;
        }

        logrosList.innerHTML = '';

        athlete.logros.forEach(logro => {
            const li = document.createElement('li');
            li.textContent = logro;
            logrosList.appendChild(li);
        });
    }

    /**
     * Inject related athletes section
     * @param {Array} athletes - All athletes array
     * @param {Object} currentAthlete - Current athlete being displayed
     */
    function injectRelatedAthletes(athletes, currentAthlete) {
        const relatedGrid = document.querySelector('.related-athletes-grid');
        if (!relatedGrid || !Array.isArray(athletes)) return;

        // Filter featured athletes excluding current athlete
        const relatedAthletes = athletes.filter(a =>
            a.featured === true && a.id !== currentAthlete.id
        ).slice(0, 3);

        if (relatedAthletes.length === 0) {
            // If no featured athletes, show all except current
            relatedAthletes = athletes.filter(a => a.id !== currentAthlete.id).slice(0, 3);
        }

        relatedGrid.innerHTML = '';

        relatedAthletes.forEach(athlete => {
            const card = document.createElement('a');
            card.href = `athlete.html?slug=${athlete.slug}`;
            card.className = 'related-athlete-card';
            card.innerHTML = `
                <img src="${athlete.imagen}" alt="${athlete.nombre}" />
                <div class="related-athlete-info">
                    <div class="related-athlete-name">${athlete.nombre}</div>
                    <div class="related-athlete-sport">${athlete.badge}</div>
                </div>
            `;
            relatedGrid.appendChild(card);
        });
    }

    /**
     * Show error state when athlete not found
     */
    function showErrorState() {
        const athletePage = document.querySelector('.athlete-page');
        if (!athletePage) return;

        athletePage.innerHTML = `
            <div class="athlete-error-state" style="padding: 4rem 2rem; text-align: center;">
                <div class="error-content">
                    <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 4rem; height: 4rem; margin: 0 auto 1rem; color: #ef4444;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h1 style="font-size: 1.875rem; font-weight: 700; margin-bottom: 0.5rem;">Atleta no encontrado</h1>
                    <p style="color: #6b7280; margin-bottom: 1.5rem;">Lo sentimos, el atleta que buscas no está disponible.</p>
                    <div class="error-actions" style="display: flex; gap: 1rem; justify-content: center;">
                        <a href="index.html" class="btn-primary" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border-radius: 0.375rem; text-decoration: none; font-weight: 500;">Volver al Inicio</a>
                        <button onclick="history.back()" class="btn-secondary" style="padding: 0.75rem 1.5rem; background: #e5e7eb; color: #1f2937; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 500;">Regresar</button>
                    </div>
                </div>
            </div>
        `;

        // Auto-redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, CONFIG.errorRedirectDelay);
    }

    /**
     * Initialize athlete loader
     */
    async function init() {
        try {
            // Get athlete slug from URL
            const slug = getUrlParameter('slug');

            if (!slug) {
                console.error('No athlete slug provided');
                showErrorState();
                return;
            }

            // Load athletes data
            const athletes = await loadAthletesData();

            if (!athletes || athletes.length === 0) {
                console.error('No athletes data available');
                showErrorState();
                return;
            }

            // Find athlete by slug
            const athlete = findAthleteBySlug(athletes, slug);

            if (!athlete) {
                console.error('Athlete not found:', slug);
                showErrorState();
                return;
            }

            // Inject athlete content
            injectAthleteContent(athlete);

        } catch (error) {
            console.error('Error initializing athlete loader:', error);
            showErrorState();
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
