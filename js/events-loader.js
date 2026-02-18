/**
 * Events Loader - Carga dinámicamente los eventos featured desde Firebase
 */

import { db } from './firebase-config.js';
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let allEvents = [];

async function loadFeaturedEvents() {
    try {
        console.log('[EventsLoader] Loading featured events from Firebase...');

        // Fetch events from Firestore
        const querySnapshot = await getDocs(collection(db, 'eventos'));
        allEvents = [];

        querySnapshot.forEach(doc => {
            allEvents.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log('[EventsLoader] Loaded', allEvents.length, 'total events');
        console.log('[EventsLoader] Events data:', allEvents);

        // Filter only featured events
        const featuredEvents = allEvents.filter(event => event.featured === true);
        console.log('[EventsLoader] Filtered', featuredEvents.length, 'featured events');
        console.log('[EventsLoader] Featured events:', featuredEvents);

        // Get the container
        const container = document.querySelector('.events-grid');
        if (!container) {
            console.warn('[EventsLoader] Events grid container not found');
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Render featured events
        featuredEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <img src="${event.image}" alt="${event.title}" class="event-card-image">
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

        // If no featured events, show a message
        if (featuredEvents.length === 0) {
            console.warn('[EventsLoader] ⚠️ No featured events found! Showing all events instead...');
            container.innerHTML = '';

            // Show all events if none are featured
            allEvents.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';
                eventCard.innerHTML = `
                    <img src="${event.image}" alt="${event.title}" class="event-card-image">
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

            console.log('[EventsLoader] ✅ Showing all', allEvents.length, 'events');
        } else {
            console.log('[EventsLoader] ✅ Showing', featuredEvents.length, 'featured events');
        }

    } catch (error) {
        console.error('[EventsLoader] Error loading featured events:', error);
        console.error('[EventsLoader] Error details:', error.message, error.stack);
        const container = document.querySelector('.events-grid');
        if (container) {
            container.innerHTML = '<div class="text-center text-red-500 py-8">Error cargando eventos</div>';
        }
    }
}

// Load featured events when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFeaturedEvents);
} else {
    loadFeaturedEvents();
}

