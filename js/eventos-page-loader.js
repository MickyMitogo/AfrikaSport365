/**
 * Eventos Page Loader - Carga TODOS los eventos desde Firebase
 * Usado en eventos.html para mostrar la lista completa de eventos
 */

import { db } from './firebase-config.js';
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let allEvents = [];

async function loadAllEvents() {
    try {
        console.log('[EventosPageLoader] Loading ALL events from Firebase...');

        // Fetch events from Firestore
        const querySnapshot = await getDocs(collection(db, 'eventos'));
        allEvents = [];

        querySnapshot.forEach(doc => {
            allEvents.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log('[EventosPageLoader] Loaded', allEvents.length, 'events');

        // Get the container
        const container = document.querySelector('.events-grid');
        if (!container) {
            console.warn('[EventosPageLoader] Events grid container not found');
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // If no events at all
        if (allEvents.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-8">No hay eventos disponibles en este momento.</div>';
            return;
        }

        // Render ALL events (not filtered by featured)
        allEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';

            eventCard.innerHTML = `
                <div class="event-card-image-wrapper">
                    <img src="${event.image}" alt="${event.title}" class="event-card-image">
                </div>
                <div class="event-card-content">
                    <span class="event-date">${event.date}</span>
                    <h2 class="event-title">${event.title}</h2>
                    <div class="event-meta">
                        <span class="event-meta-item">📍 ${event.location}</span>
                        <span class="event-meta-item">${event.sport}</span>
                    </div>
                    <a href="evento.html?id=${event.id}" class="event-cta">Ver detalles</a>
                </div>
            `;
            container.appendChild(eventCard);
        });

        console.log('[EventosPageLoader] ✅ Loaded', allEvents.length, 'events successfully');

    } catch (error) {
        console.error('[EventosPageLoader] Error loading events:', error);
        const container = document.querySelector('.events-grid');
        if (container) {
            container.innerHTML = '<div class="text-center text-red-500 py-8">❌ Error cargando eventos</div>';
        }
    }
}

// Load all events when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllEvents);
} else {
    loadAllEvents();
}
