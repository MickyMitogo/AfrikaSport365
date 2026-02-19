/**
 * Multimedia Loader - Firebase Version
 * Carga y renderiza multimedia destacada en el index.html
 */

import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js';

const MULTIMEDIA_COLLECTION = 'multimedia';

// Load featured multimedia from Firebase
async function loadFeaturedMultimedia() {
    try {
        console.log('📥 Cargando multimedia destacada desde Firebase...');
        const snapshot = await getDocs(collection(db, MULTIMEDIA_COLLECTION));
        const allItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filter only featured items
        const featuredItems = allItems.filter(item => item.featured === true);
        console.log(`✓ ${featuredItems.length} elementos destacados cargados`);
        return featuredItems;
    } catch (error) {
        console.error('❌ Error loading multimedia:', error);
        return [];
    }
}

// Check if URL is YouTube
function isYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
}

// Convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

// Render gallery
function renderGallery(items, grid) {
    grid.innerHTML = '';
    (items || []).forEach(item => {
        const card = document.createElement('div');
        card.className = 'multimedia-item';
        let overlay = '';

        if (item.type === 'image') {
            overlay = `
                <div class="multimedia-overlay">
                    <span class="multimedia-type" style="background: #10b981;">GALERÍA</span>
                    <p class="multimedia-caption">${item.title || ''}</p>
                </div>
            `;
            card.innerHTML = `
                <img src="${item.src}" alt="${item.alt || item.title}" class="multimedia-thumb">
                ${overlay}
            `;
        } else if (item.type === 'video') {
            if (isYouTubeUrl(item.src)) {
                overlay = `
                    <div class="multimedia-overlay">
                        <span class="multimedia-type">YOUTUBE</span>
                        <p class="multimedia-caption">${item.title || ''}</p>
                    </div>
                `;
                const embedUrl = getYouTubeEmbedUrl(item.src);
                card.innerHTML = `
                    <img src="${item.thumbnail || 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'}" alt="${item.alt || item.title}" class="multimedia-thumb">
                    <a href="${item.src}" target="_blank" class="video-play-btn">▶</a>
                    ${overlay}
                `;
            } else {
                card.innerHTML = `
                    <img src="${item.thumbnail || item.src}" alt="${item.alt || item.title}" class="multimedia-thumb">
                    <a href="${item.src}" target="_blank" class="video-play-btn">▶</a>
                    <div class="multimedia-overlay">
                        <span class="multimedia-type">VIDEO</span>
                        <p class="multimedia-caption">${item.title || ''}</p>
                    </div>
                `;
            }
        }
        grid.appendChild(card);
    });
}

// Initialize on DOM ready
async function init() {
    const section = document.getElementById('multimedia');
    if (!section) return;

    const grid = section.querySelector('.multimedia-grid') || section;
    const items = await loadFeaturedMultimedia();
    renderGallery(items, grid);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

