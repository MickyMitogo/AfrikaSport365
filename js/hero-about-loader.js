// js/hero-about-loader.js
// Loads hero and about section data from Firebase and renders them on the homepage

import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js';

(function () {
    'use strict';

    // Load hero data from Firebase
    async function loadHeroFromFirebase() {
        try {
            console.log('📥 Cargando Historia Destacada desde Firebase...');
            const docRef = doc(db, 'hero', 'main');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const heroData = docSnap.data();
                console.log('✓ Historia Destacada cargada:', heroData);
                renderHeroFromFirebase(heroData);
                // Still load about section from JSON if needed
                loadAboutFromJson();
            } else {
                console.warn('⚠️ No existe Historia Destacada en Firebase, usando datos por defecto');
                // Fallback to default data if not found
                loadFromJson();
            }
        } catch (error) {
            console.error('❌ Error loading hero from Firebase:', error);
            // Fallback to JSON
            loadFromJson();
        }
    }

    // Fallback: Load both hero and about from JSON
    function loadFromJson() {
        fetch('data/hero-about.json')
            .then(res => res.json())
            .then(data => {
                renderHero(data.hero);
                renderAbout(data.aboutSection);
            })
            .catch(err => {
                console.error('Error loading hero-about.json:', err);
            });
    }

    // Load only about section from JSON (when hero comes from Firebase)
    function loadAboutFromJson() {
        fetch('data/hero-about.json')
            .then(res => res.json())
            .then(data => {
                renderAbout(data.aboutSection);
            })
            .catch(err => {
                console.error('Error loading about section from JSON:', err);
            });
    }

    // Render hero from Firebase data
    function renderHeroFromFirebase(hero) {
        const bgImg = document.querySelector('.hero-background img[data-cms-field="hero.backgroundImage"]');
        if (bgImg) bgImg.src = hero.backgroundImage || '';

        const card = document.querySelector('.hero-featured-story');
        if (card && hero.backgroundCssImage) {
            card.style.backgroundImage = `url('${hero.backgroundCssImage}')`;
        }

        const badge = document.querySelector('.hero-badge[data-cms-field="hero.badge"]');
        if (badge) badge.textContent = hero.badge || '';

        const title = document.querySelector('.hero-title[data-cms-field="hero.title"]');
        if (title) title.textContent = hero.title || '';

        const excerpt = document.querySelector('.hero-excerpt[data-cms-field="hero.excerpt"]');
        if (excerpt) excerpt.textContent = hero.excerpt || '';

        // Format date from Firebase
        const metaDate = document.querySelector('.hero-meta [data-cms-field="hero.meta.date"]');
        if (metaDate && hero.date) {
            try {
                const dateObj = new Date(hero.date);
                if (!isNaN(dateObj.getTime())) {
                    const formattedDate = dateObj.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    metaDate.textContent = formattedDate;
                } else {
                    metaDate.textContent = hero.date;
                }
            } catch (e) {
                metaDate.textContent = hero.date;
            }
        }

        const metaAuthor = document.querySelector('.hero-meta [data-cms-field="hero.meta.author"]');
        if (metaAuthor) metaAuthor.textContent = hero.author || '';

        const metaRead = document.querySelector('.hero-meta [data-cms-field="hero.meta.readTime"]');
        if (metaRead) metaRead.textContent = hero.readTime ? `${hero.readTime} min` : '';

        const ctaLink = document.querySelector('.hero-cta[data-cms-field="hero.ctaLink"]');
        if (ctaLink && hero.slug) {
            ctaLink.href = `article.html?slug=${hero.slug}`;
        }

        const ctaText = document.querySelector('.hero-cta [data-cms-field="hero.ctaText"]');
        if (ctaText) ctaText.textContent = 'Leer Más';
    }

    function renderHero(hero) {
        const bgImg = document.querySelector('.hero-background img[data-cms-field="hero.backgroundImage"]');
        if (bgImg) bgImg.src = hero.backgroundImage || '';
        // Fondo CSS de la tarjeta
        const card = document.querySelector('.hero-featured-story');
        if (card && hero.backgroundCssImage) {
            card.style.backgroundImage = `url('${hero.backgroundCssImage}')`;
        }
        const badge = document.querySelector('.hero-badge[data-cms-field="hero.badge"]');
        if (badge) badge.textContent = hero.badge || '';
        const title = document.querySelector('.hero-title[data-cms-field="hero.title"]');
        if (title) title.textContent = hero.title || '';
        const excerpt = document.querySelector('.hero-excerpt[data-cms-field="hero.excerpt"]');
        if (excerpt) excerpt.textContent = hero.excerpt || '';
        const metaDate = document.querySelector('.hero-meta [data-cms-field="hero.meta.date"]');
        if (metaDate) metaDate.textContent = hero.meta?.date || '';
        const metaAuthor = document.querySelector('.hero-meta [data-cms-field="hero.meta.author"]');
        if (metaAuthor) metaAuthor.textContent = hero.meta?.author || '';
        const metaRead = document.querySelector('.hero-meta [data-cms-field="hero.meta.readTime"]');
        if (metaRead) metaRead.textContent = hero.meta?.readTime || '';
        const ctaLink = document.querySelector('.hero-cta[data-cms-field="hero.ctaLink"]');
        if (ctaLink) ctaLink.href = hero.ctaLink || '#';
        const ctaText = document.querySelector('.hero-cta [data-cms-field="hero.ctaText"]');
        if (ctaText) ctaText.textContent = hero.ctaText || '';
    }

    function renderAbout(about) {
        const icon = document.querySelector('.about-icon[data-cms-field="aboutSection.icon"]');
        if (icon) icon.textContent = about.icon || '';
        const title = document.querySelector('.about-title[data-cms-field="aboutSection.title"]');
        if (title) title.textContent = about.title || '';
        const desc = document.querySelector('.about-description[data-cms-field="aboutSection.description"]');
        if (desc) desc.textContent = about.description || '';
        // Stats
        const stats = about.stats || [];
        document.querySelectorAll('.about-stat-item').forEach((el, i) => {
            const value = el.querySelector('[data-cms-field^="stats."][data-cms-field$=".value"]');
            const label = el.querySelector('[data-cms-field^="stats."][data-cms-field$=".label"]');
            if (value) value.textContent = stats[i]?.value || '';
            if (label) label.textContent = stats[i]?.label || '';
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeroFromFirebase);
    } else {
        loadHeroFromFirebase();
    }
})();
