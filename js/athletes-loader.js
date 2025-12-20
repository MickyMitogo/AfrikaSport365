// athletes-loader.js
// Carga y muestra los perfiles de atletas dinámicamente en el slider

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.athletes-slider');
    if (!slider) return;
    fetch('data/athletes.json')
        .then(r => r.json())
        .then(items => {
            if (Array.isArray(items) && items.length) {
                slider.innerHTML = '';
                items.forEach(atleta => {
                    const article = document.createElement('article');
                    article.className = 'athlete-card';
                    article.innerHTML = `
                        <div class="athlete-image">
                            <img src="${atleta.imagen}" alt="${atleta.imagenAlt || atleta.nombre}">
                            <span class="athlete-sport-badge" style="background: ${atleta.badgeColor || '#2563eb'};">${atleta.badge}</span>
                        </div>
                        <div class="athlete-info">
                            <h3 class="athlete-name">${atleta.nombre}</h3>
                            <p class="athlete-title">${atleta.titulo}</p>
                            <div class="athlete-stats">
                                ${(atleta.stats || []).map(stat => `
                                    <div class="stat-item">
                                        <span class="stat-value">${stat.valor}</span>
                                        <span class="stat-label">${stat.etiqueta}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                    slider.appendChild(article);
                });
            }
        });
});
