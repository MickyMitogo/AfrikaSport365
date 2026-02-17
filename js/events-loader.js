/**
 * Events Loader - Carga dinámicamente los eventos featured desde data/eventos.json
 */

let allEvents = [];

async function loadFeaturedEvents() {
    try {
        // Fetch events data
        const response = await fetch('data/eventos.json');
        if (!response.ok) {
            throw new Error(`Failed to load events: ${response.status}`);
        }

        const data = await response.json();
        allEvents = data.eventos || [];

        // Filter only featured events
        const featuredEvents = allEvents.filter(event => event.featured === true);

        // Get the container
        const container = document.querySelector('.events-grid');
        if (!container) return;

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
            container.innerHTML = '<div class="text-center text-gray-500 py-8">No hay eventos destacados en este momento.</div>';
        }

    } catch (error) {
        console.error('Error loading featured events:', error);
    }
}

// Load featured events when page loads
document.addEventListener('DOMContentLoaded', loadFeaturedEvents);
