/**
 * Athlete Loader - Firebase Version
 * Carga y renderiza el perfil detallado de un atleta desde Firestore
 */

import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js';

const ATHLETES_COLLECTION = 'athletes';

let allAthletes = [];

// Obtener slug desde URL
function getSlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
}

// Cargar todos los atletas desde Firebase
async function loadAllAthletes() {
    try {
        console.log('📥 Cargando atletas desde Firestore...');
        const snapshot = await getDocs(collection(db, ATHLETES_COLLECTION));
        allAthletes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(`✓ ${allAthletes.length} atletas cargados`);
        return allAthletes;
    } catch (error) {
        console.error('❌ Error loading athletes:', error);
        return [];
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
        return aSlug === lowered;
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
        const breadcrumb = document.querySelector('.athlete-slug-breadcrumb');
        if (breadcrumb) breadcrumb.textContent = athlete.nombre;

        // Profile image
        const profileImage = document.querySelector('.athlete-profile-image');
        if (profileImage) {
            profileImage.src = athlete.imagen || 'images/placeholder.jpg';
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
        injectRelatedAthletes(allAthletes, athlete);

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
        ageElement.textContent = athlete.edad ? athlete.edad + ' años' : '-';
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
        const categoryText = athlete.posicion || athlete.category || '-';
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
    let relatedAthletes = athletes.filter(a =>
        a.featured === true && a.id !== currentAthlete.id
    ).slice(0, 3);

    if (relatedAthletes.length < 3) {
        // If not enough featured athletes, add more
        const additionalAthletes = athletes.filter(a =>
            !relatedAthletes.includes(a) && a.id !== currentAthlete.id
        ).slice(0, 3 - relatedAthletes.length);
        relatedAthletes = [...relatedAthletes, ...additionalAthletes];
    }

    relatedGrid.innerHTML = '';

    if (relatedAthletes.length === 0) {
        relatedGrid.innerHTML = '<p style="color: #6b7280; grid-column: 1 / -1;">No hay atletas relacionados disponibles.</p>';
        return;
    }

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
}

/**
 * Initialize athlete loader
 */
async function init() {
    try {
        // Get athlete slug from URL
        const slug = getSlugFromURL();

        if (!slug) {
            console.error('❌ No athlete slug provided');
            showErrorState();
            return;
        }

        // Load athletes data
        await loadAllAthletes();

        if (!allAthletes || allAthletes.length === 0) {
            console.error('❌ No athletes data available');
            showErrorState();
            return;
        }

        console.log('🔍 Buscando atleta con slug:', slug);
        console.log('📚 Slugs disponibles:', allAthletes.map(a => a.slug));

        // Find athlete by slug
        const athlete = findAthleteBySlug(allAthletes, slug);

        if (!athlete) {
            console.warn('⚠️ Atleta no encontrado para slug:', slug);
            showErrorState();
            return;
        }

        console.log('✓ Atleta encontrado:', athlete.nombre);
        // Inject athlete content
        injectAthleteContent(athlete);

    } catch (error) {
        console.error('❌ Error initializing athlete loader:', error);
        showErrorState();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
