/**
 * Multimedia Page Loader
 * Carga y renderiza la galería multimedia con soporte para filtros y lightbox
 */

(function () {
  'use strict';

  let allItems = [];
  let filteredItems = [];
  let currentIndex = 0;
  let currentFilter = 'all';

  // Cargar datos
  async function loadMultimediaData() {
    try {
      const response = await fetch('data/multimedia.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      allItems = await response.json();
      updateFilterCounts();
      renderGallery('all');
      return allItems;
    } catch (error) {
      console.error('Error loading multimedia data:', error);
      showError('No se pudo cargar la galería');
      return [];
    }
  }

  // Función para convertir URL de YouTube a embed
  function isYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
  }

  function getYouTubeEmbedUrl(url) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  // Actualizar contador de filtros
  function updateFilterCounts() {
    const counts = {
      all: allItems.length,
      image: allItems.filter(item => item.type === 'image').length,
      video: allItems.filter(item => item.type === 'video').length,
    };

    Object.entries(counts).forEach(([type, count]) => {
      const countEl = document.getElementById(`count-${type}`);
      if (countEl) countEl.textContent = count;
    });
  }

  // Filtrar items
  function filterItems(type) {
    currentFilter = type;
    if (type === 'all') {
      filteredItems = [...allItems];
    } else {
      filteredItems = allItems.filter(item => item.type === type);
    }
    currentIndex = 0;
    renderGallery(type);
  }

  // Renderizar galería
  function renderGallery(type) {
    const gallery = document.getElementById('gallery');
    const emptyState = document.getElementById('empty-state');

    if (!gallery) return;

    const itemsToRender = type === 'all' ? allItems : allItems.filter(item => item.type === type);

    if (itemsToRender.length === 0) {
      gallery.innerHTML = '';
      emptyState.style.display = 'flex';
      return;
    }

    emptyState.style.display = 'none';
    gallery.innerHTML = itemsToRender.map((item, index) => createGalleryCard(item, index)).join('');

    // Agregar event listeners a las tarjetas
    document.querySelectorAll('.multimedia-item').forEach((element, index) => {
      element.addEventListener('click', () => openLightbox(itemsToRender, index));
    });
  }

  // Crear tarjeta de galería
  function createGalleryCard(item, index) {
    const formattedDate = new Date(item.date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let thumbHtml = '';
    let overlay = '';

    if (item.type === 'image') {
      thumbHtml = `<img src="${item.src}" alt="${item.alt}" class="multimedia-thumb" loading="lazy">`;
      overlay = `
        <div class="multimedia-overlay">
          <div class="multimedia-type">🖼️ FOTO</div>
          <p class="multimedia-caption">${item.title}</p>
        </div>
      `;
    } else if (item.type === 'video') {
      const thumbnail = item.thumbnail || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop';
      thumbHtml = `
        <img src="${thumbnail}" alt="${item.alt}" class="multimedia-thumb" loading="lazy">
        <div class="multimedia-play-icon">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
          </svg>
        </div>
      `;
      overlay = `
        <div class="multimedia-overlay">
          <div class="multimedia-type">▶️ VIDEO</div>
          <p class="multimedia-caption">${item.title}</p>
        </div>
      `;
    }

    return `
      <div class="multimedia-item" data-index="${index}">
        ${thumbHtml}
        ${overlay}
        <div class="multimedia-info">
          <h3 class="multimedia-title">${item.title}</h3>
          <div class="multimedia-meta">
            <span class="multimedia-date">📅 ${formattedDate}</span>
            <span class="multimedia-category">${item.category}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Abrir lightbox
  function openLightbox(items, index) {
    filteredItems = items;
    currentIndex = index;
    updateLightbox();
    document.getElementById('multimedia-lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // Cerrar lightbox
  function closeLightbox() {
    document.getElementById('multimedia-lightbox').classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  // Actualizar contenido del lightbox
  function updateLightbox() {
    const item = filteredItems[currentIndex];
    if (!item) return;

    const content = document.getElementById('lightbox-content');
    const info = document.getElementById('lightbox-info');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    const formattedDate = new Date(item.date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Actualizar contenido
    if (item.type === 'image') {
      content.innerHTML = `<img src="${item.src}" alt="${item.alt}">`;
    } else if (item.type === 'video') {
      const embedUrl = isYouTubeUrl(item.src) ? getYouTubeEmbedUrl(item.src) : item.src;
      if (isYouTubeUrl(item.src)) {
        content.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      } else {
        content.innerHTML = `<video controls style="max-width: 100%; max-height: 100%;"><source src="${item.src}"></video>`;
      }
    }

    // Actualizar información
    info.innerHTML = `
      <h3 class="lightbox-title">${item.title}</h3>
      <div class="lightbox-meta">
        <span>📅 ${formattedDate}</span>
        <span>📂 ${item.category}</span>
        <span>${currentIndex + 1} / ${filteredItems.length}</span>
      </div>
    `;

    // Actualizar estado de botones
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === filteredItems.length - 1;
  }

  // Navegación del lightbox
  function prevItem() {
    if (currentIndex > 0) {
      currentIndex--;
      updateLightbox();
    }
  }

  function nextItem() {
    if (currentIndex < filteredItems.length - 1) {
      currentIndex++;
      updateLightbox();
    }
  }

  // Mostrar error
  function showError(message) {
    const gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><p>${message}</p></div>`;
    }
  }

  // Inicializar
  async function init() {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    // Cargar datos
    await loadMultimediaData();

    // Event listeners para filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn-active'));
        btn.classList.add('filter-btn-active');
        const filterType = btn.getAttribute('data-filter');
        filterItems(filterType);
      });
    });

    // Event listeners para lightbox
    const lightbox = document.getElementById('multimedia-lightbox');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevItem);
    nextBtn.addEventListener('click', nextItem);

    // Cerrar lightbox al hacer clic en el overlay
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

    // Navegación con teclas
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevItem();
      if (e.key === 'ArrowRight') nextItem();
    });
  }

  // Iniciar cuando esté listo el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
