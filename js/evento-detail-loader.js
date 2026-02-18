/**
 * Evento Detail Loader - Carga evento individual desde Firebase
 */

import { db } from './firebase-config.js';
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/**
 * Get URL parameter by name
 */
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Load and display event details
 */
async function loadEventDetails() {
    try {
        console.log('[EventDetailLoader] Initializing...');

        // Get event ID from URL
        const eventId = getUrlParameter('id');
        console.log('[EventDetailLoader] Loading event:', eventId);

        if (!eventId) {
            showError('Evento no especificado');
            return;
        }

        // Fetch all events from Firebase
        const querySnapshot = await getDocs(collection(db, 'eventos'));
        let event = null;

        querySnapshot.forEach(doc => {
            if (doc.id === eventId) {
                event = {
                    id: doc.id,
                    ...doc.data()
                };
            }
        });

        if (!event) {
            console.warn('[EventDetailLoader] Event not found:', eventId);
            showError('Evento no encontrado');
            return;
        }

        console.log('[EventDetailLoader] Event loaded:', event.title);

        // Populate page with event data
        document.title = event.title + ' | AfrikaSport365';

        const eventTitle = document.getElementById('eventTitle');
        if (eventTitle) eventTitle.textContent = event.title;

        const eventImage = document.getElementById('eventImage');
        if (eventImage) {
            eventImage.src = event.image || 'images/placeholder.jpg';
            eventImage.alt = event.title;
        }

        const eventDate = document.getElementById('eventDate');
        if (eventDate) eventDate.textContent = event.date || 'Fecha no especificada';

        const eventLocation = document.getElementById('eventLocation');
        if (eventLocation) eventLocation.textContent = event.location || 'Ubicación no especificada';

        const eventSport = document.getElementById('eventSport');
        if (eventSport) eventSport.textContent = event.sport || 'Deporte no especificado';

        const eventDescription = document.getElementById('eventDescription');
        if (eventDescription) eventDescription.textContent = event.description || '';

        const eventContent = document.getElementById('eventContent');
        if (eventContent) {
            // Handle both string and array formats
            if (typeof event.content === 'string') {
                eventContent.innerHTML = event.content;
            } else if (Array.isArray(event.content)) {
                const contentHTML = event.content
                    .filter(para => para.trim())
                    .map(para => `<p>${para}</p>`)
                    .join('');
                eventContent.innerHTML = contentHTML;
            }
        }

    } catch (error) {
        console.error('[EventDetailLoader] Error loading event:', error);
        showError('Error cargando el evento');
    }
}

/**
 * Show error message
 */
function showError(message) {
    const contentMain = document.querySelector('.content-main') || document.body;
    contentMain.innerHTML = `
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-2xl font-bold text-red-600">${message}</h1>
            <p class="text-gray-600 mt-4"><a href="eventos.html" class="text-blue-600 underline">← Volver a eventos</a></p>
        </div>
    `;
}

// Load event details when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadEventDetails);
} else {
    loadEventDetails();
}
