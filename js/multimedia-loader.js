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
        card.className = 'multimedia-card';
        if (item.type === 'image') {
            card.innerHTML = `
                <img src="${item.src}" alt="${item.alt || item.title}" class="multimedia-thumb">
                <div class="multimedia-title">${item.title || ''}</div>
                <div class="multimedia-date">${item.date || ''}</div>
            `;
        } else if (item.type === 'video') {
            card.innerHTML = `
                <video src="${item.src}" controls class="multimedia-thumb"></video>
                <div class="multimedia-title">${item.title || ''}</div>
                <div class="multimedia-date">${item.date || ''}</div>
            `;
        }
        grid.appendChild(card);
    });
}
