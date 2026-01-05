// multimedia-loader.js
// Carga y renderiza la galería multimedia en el index.html

document.addEventListener('DOMContentLoaded', function() {
    const section = document.getElementById('multimedia');
    if (!section) return;
    const grid = section.querySelector('.multimedia-grid') || section;

    fetch('data/multimedia.json')
        .then(r => r.json())
        .then(items => renderGallery(items, grid));
});

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
            overlay = `
                <div class="multimedia-overlay">
                    <span class="multimedia-type">VIDEO</span>
                    <div class="multimedia-play-icon">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                        </svg>
                    </div>
                    <p class="multimedia-caption">${item.title || ''}</p>
                </div>
            `;
            card.innerHTML = `
                <img src="${item.thumbnail || 'images/video1.jpg'}" alt="${item.alt || item.title}" class="multimedia-thumb">
                ${overlay}
            `;
        }
        grid.appendChild(card);
    });
}
