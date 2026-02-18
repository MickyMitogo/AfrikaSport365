// Admin News Management Script - Firebase Version
import {
    db, auth, storage,
    addNews as addNewsDB,
    updateNews as updateNewsDB,
    deleteNews as deleteNewsDB,
    getAllNews,
    uploadImage,
    onAuthChange
} from '../../js/firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let currentTab = 'all-news';
let newsData = [];
let currentUser = null;

const collectionMap = {
    'all-news': 'noticias',
    'latest-news': 'noticias_ultimas',
    'regional-news': 'noticias_regionales',
    'analisis-opinion': 'analisis_opinion',
    'ultima-hora': 'noticias_urgentes'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupTabListeners();
    setupNavSectionListeners();
    setupAddNewsButton();
    setupUltimaHoraButton();
    loadAllNews();
});

// Check authentication status
function checkAuthStatus() {
    onAuthChange(async (user) => {
        if (user) {
            currentUser = user;
            loadNewsData('all-news');
        } else {
            // User not authenticated - redirect to login
            // window.location.href = 'admin-login.html';
        }
    });
}

// Load all-news dynamically and render in 4-column grid
async function loadAllNews() {
    try {
        const news = await getAllNews(collectionMap['all-news']);
        const newsContainer = document.getElementById('news-grid');
        newsContainer.innerHTML = ''; // Clear existing content

        news.forEach(item => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            newsCard.innerHTML = `
                <div class="news-image" style="background-image: url('${item.image}');"></div>
                <div class="news-content">
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-excerpt">${item.excerpt}</p>
                    <div class="news-meta">
                        <span class="news-category" style="background-color: ${item.categoryColor};">${item.category}</span>
                        <span class="news-date">${item.meta?.date || new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            `;
            newsContainer.appendChild(newsCard);
        });
    } catch (error) {
        console.error('Error loading all-news:', error);
    }
}

// Setup tab listeners
function setupTabListeners() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Change current tab and load data
            currentTab = btn.dataset.tab;
            loadNewsData(currentTab);
        });
    });
}

// Setup nav section listeners (for Última Hora section)
function setupNavSectionListeners() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            if (section === 'ultima-hora') {
                // Load Última Hora data after a small delay to ensure DOM is updated
                setTimeout(() => {
                    renderUltimaHoraTable();
                }, 100);
            }
        });
    });
}

// Load news data from Firestore
async function loadNewsData(tab) {
    try {
        const collectionName = collectionMap[tab];
        newsData = await getAllNews(collectionName);
        renderNewsTable();
    } catch (error) {
        console.error('Error loading news data:', error);
        showErrorMessage('Error al cargar las noticias');
    }
}

// Render news table
function renderNewsTable() {
    const tbody = document.getElementById('news-table-body');
    tbody.innerHTML = '';

    if (newsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-message">No hay noticias en esta categoría</td></tr>';
        return;
    }

    newsData.forEach(news => {
        const row = document.createElement('tr');
        const featured = news.featured ? 'Sí' : 'No';
        const featuredClass = news.featured ? '' : 'no';
        const newsId = String(news.id || '').substring(0, 8) || 'N/A';

        row.innerHTML = `
            <td>${newsId}...</td>
            <td>
                <div style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${news.title}
                </div>
            </td>
            <td>${news.category || '-'}</td>
            <td>${news.meta?.author || '-'}</td>
            <td>${news.meta?.date || '-'}</td>
            <td><span class="featured-badge ${featuredClass}">${featured}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="window.editNews('${news.id}')">Editar</button>
                    <button class="btn-delete" onclick="window.deleteNews('${news.id}')">Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render Última Hora table
async function renderUltimaHoraTable() {
    const tbody = document.getElementById('ultima-hora-table-body');
    if (!tbody) return;

    try {
        const ultimaHoraNews = await getAllNews(collectionMap['ultima-hora']);

        if (ultimaHoraNews.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="loading-message">No hay noticias de última hora</td></tr>';
            return;
        }

        tbody.innerHTML = ultimaHoraNews.map(news => `
            <tr>
                <td>${String(news.id || '').substring(0, 8)}...</td>
                <td>
                    <div style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${news.title}
                    </div>
                </td>
                <td>${news.meta?.date || 'N/A'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="window.editUltimaHora('${news.id}')">Editar</button>
                        <button class="btn-delete" onclick="window.deleteUltimaHora('${news.id}')">Eliminar</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error rendering última hora table:', error);
        tbody.innerHTML = '<tr><td colspan="4" class="loading-message">Error al cargar noticias</td></tr>';
    }
}

// Setup add news button
function setupAddNewsButton() {
    const addBtn = document.getElementById('add-news-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            openNewsModal(null); // Open regular news modal
        });
    }
}

// Setup Última Hora button
function setupUltimaHoraButton() {
    const addBtn = document.getElementById('add-ultima-hora-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            openUltimaHoraModal(null); // Open última hora modal
        });
    }
}

// Open news modal
async function openNewsModal(newsId) {
    let newsItem = null;

    if (newsId !== null) {
        // First try to find in newsData array
        newsItem = newsData.find(n => String(n.id) === String(newsId));

        // If not found, load directly from Firebase
        if (!newsItem) {
            try {
                const collectionName = collectionMap[currentTab];
                const docRef = doc(db, collectionName, String(newsId || ''));
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    newsItem = { id: docSnap.id, ...docSnap.data() };
                }
            } catch (error) {
                console.error('Error loading news item:', error);
            }
        }
    }

    const modal = document.createElement('div');
    modal.className = 'news-modal-overlay';
    modal.id = 'news-modal';

    const formattedDate = formatDateToISO(newsItem?.meta?.date || '');

    modal.innerHTML = `
        <div class="news-modal-content">
            <div class="modal-header">
                <h2>${newsItem ? 'Editar Noticia' : 'Nueva Noticia'}</h2>
                <button class="modal-close" onclick="window.closeNewsModal()">×</button>
            </div>

            <div class="modal-scroll-container">
                <form id="news-form" class="news-form">
                    <!-- SECCIÓN: INFORMACIÓN BÁSICA -->
                    <div class="form-section">
                        <h3 class="form-section-title">Información Básica</h3>
                        
                        <div class="form-group">
                            <label for="title">Título *</label>
                            <input type="text" id="title" name="title" value="${newsItem?.title || ''}" required>
                        </div>

                        <div class="form-group">
                            <label for="excerpt">Descripción Corta *</label>
                            <textarea id="excerpt" name="excerpt" rows="3" required>${newsItem?.excerpt || ''}</textarea>
                        </div>

                        <div class="form-group">
                            <label for="subtitle">Subtítulo (para article.html)</label>
                            <textarea id="subtitle" name="subtitle" rows="2" placeholder="Subtítulo del artículo...">${newsItem?.subtitle || ''}</textarea>
                        </div>
                    </div>

                    <!-- SECCIÓN: CONTENIDO VISUAL -->
                    <div class="form-section">
                        <h3 class="form-section-title">Contenido Visual</h3>
                        
                        <div class="form-group">
                            <label for="image">Imagen Principal ${newsItem ? '' : '*'}</label>
                            <input type="file" id="image" name="image" accept="image/*" ${newsItem ? '' : 'required'}>
                            <div id="image-preview" class="image-preview"></div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="category">Categoría *</label>
                                <input type="text" id="category" name="category" value="${newsItem?.category || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="categoryColor">Color Categoría</label>
                                <input type="color" id="categoryColor" name="categoryColor" value="${newsItem?.categoryColor || '#667eea'}">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="authorImage">Foto del Autor</label>
                            <input type="file" id="authorImage" name="authorImage" accept="image/*">
                            <div id="authorImage-preview" class="image-preview"></div>
                        </div>
                    </div>

                    <!-- SECCIÓN: CONTENIDO COMPLETO -->
                    <div class="form-section">
                        <h3 class="form-section-title">Artículo Completo</h3>
                        
                        <div class="form-group">
                            <label for="content">Contenido (HTML/Markdown)</label>
                            <textarea id="content" name="content" rows="8" placeholder="Contenido detallado del artículo...">${newsItem?.content || ''}</textarea>
                        </div>
                    </div>

                    <!-- SECCIÓN: INFORMACIÓN DE PUBLICACIÓN -->
                    <div class="form-section">
                        <h3 class="form-section-title">Información de Publicación</h3>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="author">Autor *</label>
                                <input type="text" id="author" name="author" value="${newsItem?.meta?.author || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="date">Fecha de Publicación *</label>
                                <input type="date" id="date" name="date" value="${formattedDate}" required>
                            </div>
                        </div>

                        <div class="form-group checkbox">
                            <input type="checkbox" id="featured" name="featured" ${newsItem?.featured ? 'checked' : ''}>
                            <label for="featured">Destacada</label>
                        </div>
                    </div>

                    <!-- SECCIÓN: ELEMENTOS ADICIONALES -->
                    <div class="form-section">
                        <h3 class="form-section-title">Elementos Adicionales</h3>
                        
                        <div class="form-group">
                            <label for="tags">Etiquetas (separadas por comas)</label>
                            <input type="text" id="tags" name="tags" value="${newsItem?.tags?.join(', ') || ''}" placeholder="tag1, tag2, tag3">
                        </div>

                        <div class="form-group">
                            <label for="gallery">Galería de Imágenes (Selecciona múltiples)</label>
                            <input type="file" id="gallery" name="gallery" accept="image/*" multiple>
                            <div id="gallery-preview" class="gallery-preview"></div>
                        </div>

                        <div class="form-group">
                            <label for="timeline">Cronología (JSON) - Opcional</label>
                            <textarea id="timeline" name="timeline" rows="4" placeholder='[{"title":"Evento 1","description":"Descripción"}]'>${newsItem?.timeline ? JSON.stringify(newsItem.timeline) : ''}</textarea>
                            <small style="color: #999;">Formato: Array de objetos con "title" y "description"</small>
                        </div>
                    </div>

                    <!-- ACCIONES -->
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="window.closeNewsModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar Noticia</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const form = document.getElementById('news-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveNews(newsItem?.id || null);
    });

    // Add image preview functionality
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('image-preview');

    if (newsItem?.image) {
        imagePreview.innerHTML = `<img src="${newsItem.image}" alt="Preview">`;
    }

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Author image preview
    const authorImageInput = document.getElementById('authorImage');
    const authorImagePreview = document.getElementById('authorImage-preview');

    if (newsItem?.authorImage) {
        authorImagePreview.innerHTML = `<img src="${newsItem.authorImage}" alt="Foto autor">`;
        authorImagePreview.style.display = 'block';
    }

    authorImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                authorImagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                authorImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Gallery preview
    const galleryInput = document.getElementById('gallery');
    const galleryPreview = document.getElementById('gallery-preview');

    if (newsItem?.gallery && newsItem.gallery.length > 0) {
        galleryPreview.innerHTML = newsItem.gallery.map(img => `<div class="gallery-thumb"><img src="${img}" alt="Galería"></div>`).join('');
    }

    galleryInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            galleryPreview.innerHTML = '';
            for (let file of files) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const thumb = document.createElement('div');
                    thumb.className = 'gallery-thumb';
                    thumb.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                    galleryPreview.appendChild(thumb);
                };
                reader.readAsDataURL(file);
            }
        }
    });

    addModalStyles();
}

// Close news modal
function closeNewsModal() {
    const modal = document.getElementById('news-modal');
    if (modal) {
        modal.remove();
    }
}

// Open Última Hora modal
async function openUltimaHoraModal(newsId) {
    let newsItem = null;

    if (newsId !== null) {
        try {
            const docRef = doc(db, 'noticias_urgentes', String(newsId));
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                newsItem = { id: docSnap.id, ...docSnap.data() };
            }
        } catch (error) {
            console.error('Error loading última hora item:', error);
        }
    }

    const modal = document.createElement('div');
    modal.className = 'news-modal-overlay';
    modal.id = 'ultima-hora-modal';

    const formattedDate = formatDateToISO(newsItem?.meta?.date || '');

    modal.innerHTML = `
        <div class="news-modal-content">
            <div class="modal-header">
                <h2>${newsItem ? 'Editar Noticia de Última Hora' : 'Nueva Noticia de Última Hora'}</h2>
                <button class="modal-close" onclick="window.closeUltimaHoraModal()">×</button>
            </div>

            <div class="modal-scroll-container">
                <form id="ultima-hora-form" class="news-form">
                    <!-- SECCIÓN: INFORMACIÓN BÁSICA -->
                    <div class="form-section">
                        <h3 class="form-section-title">Noticia de Última Hora</h3>
                        
                        <div class="form-group">
                            <label for="uh-title">Texto de la Noticia *</label>
                            <textarea id="uh-title" name="title" rows="3" placeholder="Escribe la noticia que aparecerá en el ticker..." required>${newsItem?.title || ''}</textarea>
                        </div>
                    </div>

                    <!-- SECCIÓN: INFORMACIÓN DE PUBLICACIÓN -->
                    <div class="form-section">
                        <h3 class="form-section-title">Información de Publicación</h3>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="uh-author">Autor *</label>
                                <input type="text" id="uh-author" name="author" value="${newsItem?.meta?.author || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="uh-date">Fecha *</label>
                                <input type="date" id="uh-date" name="date" value="${formattedDate}" required>
                            </div>
                        </div>
                    </div>

                    <!-- ACCIONES -->
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="window.closeUltimaHoraModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar Noticia</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const form = document.getElementById('ultima-hora-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveUltimaHora(newsItem?.id || null);
    });

    addModalStyles();
}

// Close Última Hora modal
window.closeUltimaHoraModal = function () {
    const modal = document.getElementById('ultima-hora-modal');
    if (modal) {
        modal.remove();
    }
};

// Save Última Hora news (create or update)
async function saveUltimaHora(newsId) {
    try {
        const form = document.getElementById('ultima-hora-form');
        const formData = new FormData(form);

        const newsData = {
            title: formData.get('title'),
            excerpt: formData.get('title'), // excerpt same as title
            image: '',
            category: 'ÚLTIMA HORA',
            categoryColor: '#ef4444',
            meta: {
                author: formData.get('author'),
                date: formData.get('date')
            },
            featured: false
        };

        if (newsId) {
            await updateNewsDB(newsId, newsData, 'noticias_urgentes');
            showSuccessMessage('✅ Noticia de última hora actualizada');
        } else {
            const newRes = await addNewsDB(newsData, 'noticias_urgentes');
            showSuccessMessage('✅ Noticia de última hora creada');
        }

        window.closeUltimaHoraModal();
        renderUltimaHoraTable();

    } catch (error) {
        console.error('Error saving última hora news:', error);
        showErrorMessage('Error guardando noticia: ' + error.message);
    }
}

// Save news (create or update)
async function saveNews(newsId) {
    console.log('saveNews called with newsId:', newsId);

    const form = document.getElementById('news-form');
    const formData = new FormData(form);
    const imageFile = document.getElementById('image').files[0];
    const authorImageFile = document.getElementById('authorImage').files[0];
    const galleryFiles = document.getElementById('gallery').files;

    console.log('Form data:', { imageFile, authorImageFile, galleryFiles });

    try {
        // Procesar tags
        const tagsInput = formData.get('tags') || '';
        const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        // Generar slug automáticamente del título
        const title = formData.get('title');
        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

        // Procesar timeline (JSON)
        let timeline = [];
        try {
            const timelineInput = formData.get('timeline')?.trim();
            if (timelineInput) {
                timeline = JSON.parse(timelineInput);
            }
        } catch (error) {
            console.warn('Timeline parse error, using empty array');
        }

        const newsItem = {
            title: title,
            slug: slug,
            excerpt: formData.get('excerpt'),
            subtitle: formData.get('subtitle') || '',
            category: formData.get('category'),
            categoryColor: formData.get('categoryColor'),
            featured: formData.get('featured') ? true : false,
            content: formData.get('content') || '',
            authorImage: newsId ? (newsData.find(n => n.id === newsId)?.authorImage || '') : '',
            tags: tags,
            gallery: [],
            timeline: timeline,
            meta: {
                author: formData.get('author'),
                date: formData.get('date')
            },
            image: newsId ? (newsData.find(n => n.id === newsId)?.image || '') : ''
        };

        // Handle main image upload
        if (imageFile) {
            const tempId = newsId || Date.now().toString();
            try {
                const imageUrl = await uploadImage(imageFile, tempId);
                newsItem.image = imageUrl;
            } catch (error) {
                console.error('Error uploading image:', error);
                showErrorMessage('Error al subir la imagen principal');
                return;
            }
        } else if (!newsId) {
            showErrorMessage('Por favor selecciona una imagen principal');
            return;
        }

        // Handle author image upload
        if (authorImageFile) {
            try {
                const tempId = newsId || Date.now().toString();
                const authorImageUrl = await uploadImage(authorImageFile, `${tempId}/author`);
                newsItem.authorImage = authorImageUrl;
            } catch (error) {
                console.error('Error uploading author image:', error);
                showErrorMessage('Error al subir la foto del autor');
                return;
            }
        }

        // Handle gallery uploads (múltiples imágenes)
        if (galleryFiles && galleryFiles.length > 0) {
            const tempId = newsId || Date.now().toString();
            try {
                for (let i = 0; i < galleryFiles.length; i++) {
                    const file = galleryFiles[i];
                    const galleryUrl = await uploadImage(file, `${tempId}/gallery/${i}`);
                    newsItem.gallery.push(galleryUrl);
                }
            } catch (error) {
                console.error('Error uploading gallery images:', error);
                showErrorMessage('Error al subir imágenes de galería');
                return;
            }
        }

        // Save to Firestore
        const collectionName = collectionMap[currentTab];

        if (newsId) {
            // Update existing
            await updateNewsDB(String(newsId), newsItem, collectionName);
            showSuccessMessage('Noticia actualizada');
        } else {
            // Create new
            const newId = await addNewsDB(newsItem, collectionName);
            newsId = newId; // Update newsId for modal close
            showSuccessMessage('Noticia creada');
        }

        closeNewsModal();
        loadNewsData(currentTab); // Reload table
        loadAllNews(); // Update grid too

    } catch (error) {
        console.error('Error saving news:', error);
        showErrorMessage('Error al guardar la noticia: ' + error.message);
    }
}

// Delete news
async function deleteNews(newsId) {
    if (!confirm('¿Eliminar esta noticia? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        const collectionName = collectionMap[currentTab];
        await deleteNewsDB(String(newsId), collectionName);
        loadNewsData(currentTab);
        showSuccessMessage('Noticia eliminada');
    } catch (error) {
        console.error('Error deleting news:', error);
        showErrorMessage('Error al eliminar la noticia: ' + error.message);
    }
}

// Helper function to format date
function formatDateToISO(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    const date = new Date(dateString);
    if (isNaN(date)) return new Date().toISOString().split('T')[0];
    return date.toISOString().split('T')[0];
}

// Define global functions
window.editNews = function (newsId) {
    openNewsModal(newsId);
};

window.closeNewsModal = function () {
    closeNewsModal();
};

window.deleteNews = function (newsId) {
    deleteNews(newsId);
};

window.editUltimaHora = function (newsId) {
    openUltimaHoraModal(newsId);
};

window.deleteUltimaHora = async function (newsId) {
    if (!confirm('¿Eliminar esta noticia de última hora? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        await deleteNewsDB(String(newsId), 'noticias_urgentes');
        showSuccessMessage('Noticia eliminada');
        renderUltimaHoraTable();
    } catch (error) {
        console.error('Error deleting última hora news:', error);
        showErrorMessage('Error al eliminar la noticia: ' + error.message);
    }
};

// Show success message
function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add animation styles
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animationStyle);

// Add modal styles
function addModalStyles() {
    if (document.getElementById('modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .news-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        .news-modal-content {
            background: #1a1f3a;
            border: 1px solid rgba(167, 139, 250, 0.2);
            border-radius: 12px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.3s ease;
            display: flex;
            flex-direction: column;
        }

        .modal-scroll-container {
            overflow-y: auto;
            flex: 1;
        }

        @keyframes slideUp {
            from {
                transform: translateY(40px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid rgba(167, 139, 250, 0.1);
        }

        .modal-header h2 {
            margin: 0;
            color: #f0f9ff;
        }

        .modal-close {
            background: none;
            border: none;
            color: #a5b4fc;
            font-size: 2rem;
            cursor: pointer;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-close:hover {
            color: #f0f9ff;
        }

        .news-form {
            padding: 1.5rem;
        }

        .form-section {
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid rgba(167, 139, 250, 0.1);
        }

        .form-section:last-of-type {
            border-bottom: none;
        }

        .form-section-title {
            margin: 0 0 1rem 0;
            padding-bottom: 0.75rem;
            color: #667eea;
            font-size: 1rem;
            font-weight: 600;
            border-bottom: 2px solid rgba(102, 126, 234, 0.3);
        }

        .form-group {
            margin-bottom: 1rem;
        }

        .form-group.checkbox {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #f0f9ff;
            font-weight: 500;
            font-size: 0.9rem;
        }

        .form-group.checkbox label {
            display: inline;
            margin: 0;
        }

        .form-group input[type="text"],
        .form-group input[type="date"],
        .form-group input[type="number"],
        .form-group input[type="color"],
        .form-group input[type="url"],
        .form-group input[type="file"],
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid rgba(167, 139, 250, 0.2);
            border-radius: 6px;
            color: #f0f9ff;
            font-family: inherit;
        }

        .form-group input[type="text"]:focus,
        .form-group input[type="date"]:focus,
        .form-group input[type="number"]:focus,
        .form-group input[type="color"]:focus,
        .form-group input[type="url"]:focus,
        .form-group input[type="file"]:focus,
        .form-group input[type="file"][multiple]:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group small {
            display: block;
            margin-top: 0.5rem;
            font-size: 0.85rem;
        }

        .form-group textarea {
            resize: vertical;
            min-height: 80px;
        }

        .form-group input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #667eea;
        }

        .form-group input[type="color"] {
            height: 45px !important;
            padding: 3px !important;
            cursor: pointer;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .image-preview {
            margin-top: 0.75rem;
            max-width: 100%;
            border-radius: 6px;
            overflow: hidden;
        }

        .image-preview img {
            width: 100%;
            max-height: 200px;
            object-fit: cover;
        }

        .gallery-preview {
            margin-top: 0.75rem;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 0.75rem;
        }

        .gallery-thumb {
            border-radius: 6px;
            overflow: hidden;
            aspect-ratio: 1 / 1;
            border: 1px solid rgba(167, 139, 250, 0.2);
        }

        .gallery-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .form-group input[type="file"]::file-selector-button {
            background: rgba(102, 126, 234, 0.2);
            border: 1px solid rgba(102, 126, 234, 0.3);
            color: #a5b4fc;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 0.5rem;
            font-weight: 500;
        }

        .form-group input[type="file"]::file-selector-button:hover {
            background: rgba(102, 126, 234, 0.3);
            color: #f0f9ff;
        }

        .modal-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(167, 139, 250, 0.1);
        }

        .modal-actions button {
            flex: 1;
        }

        .btn-secondary {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
            border: 1px solid rgba(102, 126, 234, 0.3);
        }
    `;
    document.head.appendChild(style);
}

// ============================================================================
// BREAKING NEWS (NOTICIAS DE ÚLTIMA HORA)

