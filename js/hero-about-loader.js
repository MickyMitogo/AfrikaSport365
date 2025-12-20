// js/hero-about-loader.js
// Loads hero and about section data and renders them on the homepage

document.addEventListener('DOMContentLoaded', function () {
    fetch('data/hero-about.json')
        .then(res => res.json())
        .then(data => {
            renderHero(data.hero);
            renderAbout(data.aboutSection);
        });

    function renderHero(hero) {
        const bgImg = document.querySelector('.hero-background img[data-cms-field="hero.backgroundImage"]');
        if (bgImg) bgImg.src = hero.backgroundImage || '';
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
});
