(function () {
    'use strict';

    const GALLERY_SELECTOR = '#gallery';
    const DATA_PATH = 'data/multimedia.json';

    function isYouTube(url) { return /youtube.com|youtu.be/.test(url); }
    function getYouTubeEmbed(url) { const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/); return m ? `https://www.youtube.com/embed/${m[1]}` : url; }

    async function loadData() {
        try { const r = await fetch(DATA_PATH); if (!r.ok) throw new Error(r.status); return await r.json(); } catch (e) { console.error('Error loading multimedia.json', e); return []; }
    }

    function createCard(item) {
        const card = document.createElement('article'); card.className = 'gallery-card';
        const mediaWrap = document.createElement('div');
        if (item.type === 'image') {
            const img = document.createElement('img'); img.src = item.src; img.alt = item.alt || item.title || ''; img.className = 'gallery-thumb'; mediaWrap.appendChild(img);
            img.addEventListener('click', () => openLightbox('image', item));
        } else if (item.type === 'video') {
            if (isYouTube(item.src)) {
                const thumb = document.createElement('img'); thumb.src = item.thumbnail || 'images/perfil2.jpg'; thumb.alt = item.title || ''; thumb.className = 'gallery-thumb'; mediaWrap.appendChild(thumb);
                thumb.addEventListener('click', () => openLightbox('youtube', item));
            } else {
                const thumb = document.createElement('img'); thumb.src = item.thumbnail || 'images/perfil2.jpg'; thumb.alt = item.title || ''; thumb.className = 'gallery-thumb'; mediaWrap.appendChild(thumb);
                thumb.addEventListener('click', () => openLightbox('video', item));
            }
        }
        const meta = document.createElement('div'); meta.className = 'gallery-meta'; meta.innerHTML = `<h3 style="font-weight:700">${item.title || ''}</h3><div style="color:#6b7280;font-size:0.95rem">${item.date || ''} • ${item.category || ''}</div>`;
        card.appendChild(mediaWrap); card.appendChild(meta);
        return card;
    }

    function openLightbox(kind, item) {
        const lb = document.getElementById('as-lightbox'); const content = document.getElementById('as-lightbox-content');
        content.innerHTML = '';
        if (kind === 'image') {
            const img = document.createElement('img'); img.src = item.src; img.alt = item.alt || item.title || ''; content.appendChild(img);
        } else if (kind === 'youtube') {
            const iframe = document.createElement('iframe'); iframe.src = getYouTubeEmbed(item.src); iframe.width = '960'; iframe.height = '540'; iframe.setAttribute('frameborder', '0'); iframe.setAttribute('allow', 'autoplay; encrypted-media'); iframe.setAttribute('allowfullscreen', ''); content.appendChild(iframe);
        } else if (kind === 'video') {
            const video = document.createElement('video'); video.controls = true; video.src = item.src; video.style.width = '100%'; video.style.height = '100%'; content.appendChild(video);
            video.play().catch(() => { });
        }
        lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() { const lb = document.getElementById('as-lightbox'); lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); const content = document.getElementById('as-lightbox-content'); content.innerHTML = ''; }

    document.addEventListener('DOMContentLoaded', async function () {
        const container = document.querySelector(GALLERY_SELECTOR); if (!container) return;
        const items = await loadData(); container.innerHTML = '';
        if (!items || items.length === 0) { container.innerHTML = '<div class="text-gray-500 py-12">No hay elementos en la galería.</div>'; return; }
        items.forEach(it => container.appendChild(createCard(it)));

        // Lightbox events
        const closeBtn = document.getElementById('as-lightbox-close'); if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        document.getElementById('as-lightbox').addEventListener('click', (e) => { if (e.target.id === 'as-lightbox') closeLightbox(); });
    });
})();
