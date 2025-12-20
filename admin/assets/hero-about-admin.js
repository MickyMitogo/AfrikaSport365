// admin/assets/hero-about-admin.js
// Admin logic for editing hero and about (mission) sections

document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('hero-about-admin-form')) return;

    const form = document.getElementById('hero-about-admin-form');
    const status = document.getElementById('hero-about-admin-status');

    // Load data
    fetch('api/get-hero-about.php')
        .then(res => res.json())
        .then(data => fillForm(data));

    // Save handler
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = collectForm();
        fetch('api/save-hero-about.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resp => {
            status.textContent = resp.success ? 'Guardado correctamente.' : 'Error al guardar.';
        });
    });

    function fillForm(data) {
        // Hero
        form.hero_backgroundImage.value = data.hero.backgroundImage || '';
        form.hero_badge.value = data.hero.badge || '';
        form.hero_title.value = data.hero.title || '';
        form.hero_excerpt.value = data.hero.excerpt || '';
        form.hero_meta_date.value = data.hero.meta?.date || '';
        form.hero_meta_author.value = data.hero.meta?.author || '';
        form.hero_meta_readTime.value = data.hero.meta?.readTime || '';
        form.hero_ctaLink.value = data.hero.ctaLink || '';
        form.hero_ctaText.value = data.hero.ctaText || '';
        // About
        form.about_icon.value = data.aboutSection.icon || '';
        form.about_title.value = data.aboutSection.title || '';
        form.about_description.value = data.aboutSection.description || '';
        // Stats
        const stats = data.aboutSection.stats || [];
        for (let i = 0; i < 3; i++) {
            form[`about_stats_${i}_value`].value = stats[i]?.value || '';
            form[`about_stats_${i}_label`].value = stats[i]?.label || '';
        }
    }

    function collectForm() {
        return {
            hero: {
                backgroundImage: form.hero_backgroundImage.value,
                badge: form.hero_badge.value,
                title: form.hero_title.value,
                excerpt: form.hero_excerpt.value,
                meta: {
                    date: form.hero_meta_date.value,
                    author: form.hero_meta_author.value,
                    readTime: form.hero_meta_readTime.value
                },
                ctaLink: form.hero_ctaLink.value,
                ctaText: form.hero_ctaText.value
            },
            aboutSection: {
                icon: form.about_icon.value,
                title: form.about_title.value,
                description: form.about_description.value,
                stats: [0,1,2].map(i => ({
                    value: form[`about_stats_${i}_value`].value,
                    label: form[`about_stats_${i}_label`].value
                }))
            }
        };
    }
});
