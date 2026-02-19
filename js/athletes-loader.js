/**
 * Athletes Loader - Firebase Version
 * Carga y renderiza atletas destacados dinámicamente desde Firestore
 */

import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js';

const ATHLETES_COLLECTION = 'athletes';

let allAthletes = [];

// Cargar atletas destacados desde Firebase
async function loadFeaturedAthletes() {
    try {
        console.log('📥 Cargando atletas destacados desde Firestore...');
        const snapshot = await getDocs(collection(db, ATHLETES_COLLECTION));
        allAthletes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const featuredAthletes = allAthletes.filter(a => a.featured === true);
        console.log(`✓ ${featuredAthletes.length} atletas destacados cargados`);
        return featuredAthletes;
    } catch (error) {
        console.error('❌ Error loading featured athletes:', error);
        return [];
    }
}

// Renderizar atletas en slider
function renderAthletesSlider(athletes) {
    const slider = document.querySelector('.athletes-slider');
    if (!slider) {
        console.warn('⚠️ Contenedor .athletes-slider no encontrado');
        return;
    }

    if (athletes.length === 0) {
        slider.innerHTML = '<p style="text-align: center; color: #6b7280;">No hay atletas destacados disponibles.</p>';
        return;
    }

    slider.innerHTML = '';
    athletes.forEach(athlete => {
        const article = document.createElement('article');
        article.className = 'athlete-card';
        article.innerHTML = `
            <a href="athlete.html?slug=${athlete.slug}" style="text-decoration: none; color: inherit;">
                <div class="athlete-image">
                    <img src="${athlete.imagen}" alt="${athlete.nombre}">
                    <span class="athlete-sport-badge" style="background: ${athlete.badgeColor || '#2563eb'};">${athlete.badge}</span>
                </div>
                <div class="athlete-info">
                    <h3 class="athlete-name">${athlete.nombre}</h3>
                    <p class="athlete-title">${athlete.titulo}</p>
                    <div class="athlete-stats">
                        ${(athlete.stats || []).map(stat => `
                            <div class="stat-item">
                                <span class="stat-value">${stat.valor}</span>
                                <span class="stat-label">${stat.etiqueta}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </a>
        `;
        slider.appendChild(article);
    });
}

// Inicializar
async function init() {
    const featuredAthletes = await loadFeaturedAthletes();
    renderAthletesSlider(featuredAthletes);
}

// Iniciar cuando esté listo el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
