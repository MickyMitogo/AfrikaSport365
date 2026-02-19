/**
 * Athletes Gallery Loader - Firebase Version
 * Carga todos los atletas dinámicamente en la galería desde Firestore
 */

import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js';

const ATHLETES_COLLECTION = 'athletes';

let allAthletes = [];

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

// Renderizar galería de atletas
function renderAthletesGallery(athletes) {
    const grid = document.querySelector('.athletes-grid');
    const emptyState = document.querySelector('.empty-state');

    if (!grid) {
        console.warn('⚠️ Contenedor .athletes-grid no encontrado');
        return;
    }

    if (!athletes || athletes.length === 0) {
        console.warn('⚠️ No hay atletas para mostrar');
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

    console.log(`✓ Atletas renderizados: ${athletes.length}`);
}

// Inicializar
async function init() {
    try {
        const athletes = await loadAllAthletes();
        renderAthletesGallery(athletes);
    } catch (error) {
        console.error('❌ Error initializing athletes gallery:', error);
    }
}

// Iniciar cuando esté listo el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
