/**
 * Opinions Index Loader
 * Carga opiniones featured en el slider del index desde Firebase
 */

import { getAllNews } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async function () {
    const slider = document.querySelector('.opinions-slider');
    if (!slider) return;

    try {
        const items = await getAllNews('analisis_opinion');
        if (Array.isArray(items) && items.length) {
            // Filter only featured opinions
            const featured = items.filter(op => op.featured === true);

            if (featured.length === 0) return;

            slider.innerHTML = '';

            featured.forEach(opinion => {
                const article = document.createElement('article');
                article.className = 'opinion-index-card';
                article.style.cssText = `
                    background: white;
                    border-radius: 0.5rem;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s, box-shadow 0.3s;
                    display: flex;
                    flex-direction: column;
                `;

                article.addEventListener('mouseenter', function () {
                    this.style.transform = 'translateY(-8px)';
                    this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                });

                article.addEventListener('mouseleave', function () {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                });

                const link = document.createElement('a');
                link.href = `opinion.html?slug=${opinion.slug || opinion.id}`;
                link.style.cssText = 'text-decoration: none; color: inherit; flex: 1; display: flex; flex-direction: column;';

                const imageContainer = document.createElement('div');
                imageContainer.style.cssText = 'position: relative; overflow: hidden; height: 220px;';

                const img = document.createElement('img');
                img.src = opinion.imagen;
                img.alt = opinion.titulo;
                img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
                imageContainer.appendChild(img);

                const badge = document.createElement('span');
                badge.style.cssText = `
                    position: absolute;
                    top: 1rem;
                        right: 1rem;
                        padding: 0.5rem 1rem;
                        background: ${opinion.badgeColor || '#8b5cf6'};
                        color: white;
                        border-radius: 0.375rem;
                        font-size: 0.875rem;
                        font-weight: 600;
                    `;
                badge.textContent = opinion.badge;
                imageContainer.appendChild(badge);

                link.appendChild(imageContainer);

                const info = document.createElement('div');
                info.style.cssText = 'padding: 1.5rem; flex: 1; display: flex; flex-direction: column;';

                const title = document.createElement('h3');
                title.style.cssText = 'font-size: 1.125rem; font-weight: 700; margin-bottom: 0.75rem; color: #1f2937;';
                title.textContent = opinion.titulo;
                info.appendChild(title);

                const resumen = document.createElement('p');
                resumen.style.cssText = 'font-size: 0.95rem; color: #6b7280; margin-bottom: 1rem; flex: 1; line-height: 1.5;';
                resumen.textContent = opinion.resumen;
                info.appendChild(resumen);

                const meta = document.createElement('div');
                meta.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #e5e7eb; font-size: 0.875rem; color: #6b7280;';

                const author = document.createElement('span');
                author.style.fontWeight = '500';
                author.textContent = opinion.autor;
                meta.appendChild(author);

                const fecha = document.createElement('span');
                fecha.style.color = '#9ca3af';
                fecha.textContent = opinion.fechaMostrada || opinion.fecha;
                meta.appendChild(fecha);

                info.appendChild(meta);
                link.appendChild(info);
                article.appendChild(link);
                slider.appendChild(article);
            });

            // Apply grid styling to slider
            slider.style.cssText = `
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                `;
        }
    } catch (error) {
        console.error('Error loading opinions from Firebase:', error);
    }
});
