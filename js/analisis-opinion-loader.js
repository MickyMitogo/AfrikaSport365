// js/analisis-opinion-loader.js
// Carga y muestra los artículos de Análisis y Opinión dinámicamente

document.addEventListener('DOMContentLoaded', function () {
    // Selecciona el contenedor de la sección "Análisis y Opinión"
    // Busca el h2 con el texto y sube hasta el .news-grid más cercano
    const sectionTitle = Array.from(document.querySelectorAll('.section-title')).find(el => el.textContent.includes('Análisis y Opinión'));
    if (!sectionTitle) return;
    const section = sectionTitle.closest('.section-header').parentElement;
    const container = section.querySelector('.news-grid');
    if (!container) return;
    fetch('data/analisis-opinion.json')
        .then(r => r.json())
        .then(items => {
            if (Array.isArray(items) && items.length) {
                container.innerHTML = '';
                items.forEach(article => {
                    const div = document.createElement('article');
                    div.className = 'news-card';
                    div.innerHTML = `
                        <div class="news-image">
                            <img src="${article.imagen ? article.imagen : 'images/perfil1.jpg'}" alt="Análisis">
                            <span class="news-category-badge" style="background: #6366f1;">${article.badge ? article.badge : 'OPINIÓN'}</span>
                        </div>
                        <div class="news-content">
                            <h3 class="news-title">${article.titulo}</h3>
                            <p class="news-excerpt">${article.resumen}</p>
                            <div class="news-meta"><span>✍️ ${article.autor}</span></div>
                        </div>
                    `;
                    container.appendChild(div);
                });
            }
        });
});
