// breaking-news-loader.js
// Carga y muestra las breaking news dinámicamente en el ticker

document.addEventListener('DOMContentLoaded', function() {
    const ticker = document.querySelector('.breaking-ticker');
    if (!ticker) return;
    fetch('data/breaking-news.json')
        .then(r => r.json())
        .then(items => {
            if (Array.isArray(items) && items.length) {
                ticker.innerHTML = '';
                // Duplicar para loop infinito visual
                const allItems = items.concat(items);
                allItems.forEach(text => {
                    const span = document.createElement('span');
                    span.className = 'ticker-item';
                    span.textContent = text;
                    ticker.appendChild(span);
                });
            }
        });
});
