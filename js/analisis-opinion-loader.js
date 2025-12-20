// js/analisis-opinion-loader.js
// Carga y muestra los artículos de Análisis y Opinión dinámicamente

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.analisis-opinion-container');
    if (!container) return;
    fetch('data/analisis-opinion.json')
        .then(r => r.json())
        .then(items => {
            if (Array.isArray(items) && items.length) {
                container.innerHTML = '';
                items.forEach(article => {
                    const div = document.createElement('div');
                    div.className = 'analisis-opinion-item';
                    div.innerHTML = `
                        <h3>${article.titulo}</h3>
                        <p>${article.resumen}</p>
                        <span class="autor">Por ${article.autor}</span>
                    `;
                    container.appendChild(div);
                });
            }
        });
});
