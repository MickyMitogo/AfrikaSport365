// Admin Multimedia - Firebase CRUD Operations
import {
    db,
    auth,
    storage,
    uploadImage,
    getAllNews,
    addNews,
    updateNews,
    deleteNews
} from '../../js/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const MULTIMEDIA_COLLECTION = 'multimedia';

let currentMultimediaData = [];

// Initialize Module - Main entry point
function initializeMultimediaModule() {
    console.log('🎬 Inicializando módulo de Multimedia...');
    try {
        // Load multimedia data on initialization
        loadMultimediaData();

        // Setup auth listener for future updates
        checkAuthStatus();

        // Setup add multimedia button
        const addBtn = document.getElementById('add-multimedia-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => openMultimediaModal(null));
        }
    } catch (error) {
        console.error('Error durante inicialización:', error);
    }
}

// Run on DOM content loaded or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMultimediaModule);
} else {
    // DOM already loaded
    initializeMultimediaModule();
}

// Check authentication status
function checkAuthStatus() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('✓ Usuario autenticado:', user.email);
        }
        // Load multimedia data regardless of auth status
        loadMultimediaData();
    });
}

// Load Multimedia Data
async function loadMultimediaData() {
    try {
        console.log('📥 Cargando multimedia...');
        const tbody = document.getElementById('multimedia-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #a5b4fc;">⏳ Cargando multimedia...</td></tr>';
        }

        currentMultimediaData = await getAllNews(MULTIMEDIA_COLLECTION);
        console.log(`✓ ${currentMultimediaData.length} elementos cargados`, currentMultimediaData);
        renderMultimediaTable();
    } catch (error) {
        console.error('❌ Error loading multimedia:', error);
        const tbody = document.getElementById('multimedia-tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #fca5a5;">❌ Error cargando multimedia: ${error.message}</td></tr>`;
        }
        showErrorMessage('Error al cargar multimedia: ' + error.message);
    }
}

// Make modal functions globally available
window.editMultimedia = function (multimediaId) {
    openMultimediaModal(multimediaId);
};

window.deleteMultimedia = async function (multimediaId) {
    if (!confirm('¿Eliminar este elemento? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        await deleteNews(multimediaId, MULTIMEDIA_COLLECTION);
        showSuccessMessage('✅ Elemento eliminado');
        loadMultimediaData();
    } catch (error) {
        console.error('Error deleting multimedia:', error);
        showErrorMessage('Error eliminando elemento: ' + error.message);
    }
};

window.closeMultimediaModal = function () {
    const modal = document.getElementById('multimedia-modal');
    if (modal) modal.style.display = 'none';
};

window.openMultimediaModal = openMultimediaModal;

window.saveMultimedia = saveMultimedia;

// Render Multimedia Table
function renderMultimediaTable() {
    const tbody = document.getElementById('multimedia-tbody');
    if (!tbody) return;

    if (currentMultimediaData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    <div style="color: #d1d5db;">
                        <p style="font-size: 1.1rem; margin-bottom: 1rem;">📭 No hay multimedia</p>
                        <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 1rem;">La colección está vacía. Necesitas importar datos primero.</p>
                        <a href="init-multimedia-firebase.html" style="display: inline-block; padding: 0.75rem 1.5rem; background: rgba(167, 139, 250, 0.2); color: #a5b4fc; border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 0.375rem; text-decoration: none; font-weight: 600;">→ Ir a Importar Multimedia</a>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = currentMultimediaData.map(item => `
        <tr>
            <td style="font-weight: 600; color: #a5b4fc;">${item.id}</td>
            <td><strong style="color: #f0f9ff;">${item.title || 'Sin título'}</strong></td>
            <td style="color: #d1d5db;"><span style="background: ${item.type === 'video' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(34, 197, 94, 0.15)'}; color: ${item.type === 'video' ? '#93c5fd' : '#86efac'}; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">${item.type === 'video' ? '🎥 Video' : '📸 Imagen'}</span></td>
            <td style="color: #d1d5db;">${item.category || 'General'}</td>
            <td><span style="background: rgba(34, 197, 94, 0.15); color: #86efac; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">${item.featured ? 'Sí' : 'No'}</span></td>
            <td style="display: flex; gap: 0.5rem;">
                <button onclick="editMultimedia('${item.id}')" style="padding: 0.5rem 1rem; background: rgba(167, 139, 250, 0.2); color: #a5b4fc; border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; transition: all 0.3s;">✎ Editar</button>
                <button onclick="deleteMultimedia('${item.id}')" style="padding: 0.5rem 1rem; background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; transition: all 0.3s;">✕ Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// Open Multimedia Modal
function openMultimediaModal(multimediaId) {
    const modal = document.getElementById('multimedia-modal');
    const formTitle = document.getElementById('multimedia-form-title');
    const form = document.getElementById('multimedia-form');

    let item = null;

    if (multimediaId) {
        item = currentMultimediaData.find(m => m.id == multimediaId);
        formTitle.textContent = '✎ Editar Multimedia';
    } else {
        form.reset();
        formTitle.textContent = '+ Nuevo Multimedia';
    }

    const types = ['image', 'video', 'youtube'];
    const categories = ['Fútbol', 'Atletismo', 'Judo', 'Baloncesto', 'Voleibol', 'Eventos', 'Otros'];

    form.innerHTML = `
        <!-- SECCIÓN: INFORMACIÓN BÁSICA -->
        <div class="form-section">
            <h3 class="form-section-title">Información Básica</h3>
            
            <div class="form-group">
                <label for="m-title">Título *</label>
                <input type="text" id="m-title" name="title" value="${item?.title || ''}" required placeholder="Título del multimedia">
            </div>

            <div class="form-group">
                <label for="m-description">Descripción</label>
                <textarea id="m-description" name="description" rows="2" placeholder="Descripción breve">${item?.description || ''}</textarea>
            </div>
        </div>

        <!-- SECCIÓN: TIPO Y FUENTE -->
        <div class="form-section">
            <h3 class="form-section-title">Tipo y Fuente</h3>
            
            <div class="form-group">
                <label for="m-type">Tipo *</label>
                <select id="m-type" name="type" required onchange="updateMultimediaForm()">
                    <option value="">Seleccionar tipo</option>
                    <option value="image" ${item?.type === 'image' ? 'selected' : ''}>📸 Imagen</option>
                    <option value="video" ${item?.type === 'video' ? 'selected' : ''}>🎥 Video (archivo)</option>
                    <option value="youtube" ${item?.type === 'youtube' ? 'selected' : ''}>▶️ YouTube (enlace)</option>
                </select>
            </div>

            <!-- Campo para Imagen o Video archivo -->
            <div id="src-field" style="display: ${item?.type === 'youtube' ? 'none' : 'block'};">
                <div class="form-group">
                    <label for="m-src">${item?.type === 'video' ? 'URL del Video' : 'URL de la Imagen'} *</label>
                    <input type="text" id="m-src" name="src" value="${item?.src || ''}" placeholder="${item?.type === 'video' ? 'URL del archivo de video' : 'URL de la imagen'}">
                </div>
            </div>

            <!-- Campo para YouTube embed link -->
            <div id="youtube-field" style="display: ${item?.type === 'youtube' ? 'block' : 'none'};">
                <div class="form-group">
                    <label for="m-youtube">Enlace de YouTube *</label>
                    <input type="text" id="m-youtube" name="youtube" value="${item?.type === 'youtube' ? item?.src : ''}" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
                </div>
            </div>

            <!-- Campo Thumbnail para videos -->
            <div id="thumbnail-field" style="display: ${item?.type === 'video' || item?.type === 'youtube' ? 'block' : 'none'};">
                <div class="form-group">
                    <label for="m-thumbnail">Thumbnail (URL de la imagen)</label>
                    <input type="text" id="m-thumbnail" name="thumbnail" value="${item?.thumbnail || ''}" placeholder="URL del thumbnail">
                </div>
            </div>

            <div class="form-group">
                <label for="m-alt">Texto Alternativo *</label>
                <input type="text" id="m-alt" name="alt" value="${item?.alt || ''}" required placeholder="Descripción para accesibilidad">
            </div>
        </div>

        <!-- SECCIÓN: METADATA -->
        <div class="form-section">
            <h3 class="form-section-title">Metadata</h3>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="m-category">Categoría *</label>
                    <select id="m-category" name="category" required>
                        <option value="">Seleccionar categoría</option>
                        ${categories.map(c => `<option value="${c}" ${item?.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="m-date">Fecha *</label>
                    <input type="date" id="m-date" name="date" value="${item?.date || new Date().toISOString().split('T')[0]}" required>
                </div>
            </div>

            <div class="form-group checkbox">
                <input type="checkbox" id="m-featured" name="featured" ${item?.featured ? 'checked' : ''}>
                <label for="m-featured">Mostrar como Destacado</label>
            </div>
        </div>

        <button type="button" onclick="saveMultimedia('${item?.id || ''}')" style="padding: 1rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; width: 100%; margin-top: 1rem;">
            ${item ? '💾 Actualizar Multimedia' : '➕ Crear Multimedia'}
        </button>
    `;

    modal.style.display = 'block';
}

// Update form fields based on content type
function updateMultimediaForm() {
    const type = document.getElementById('m-type').value;
    const srcField = document.getElementById('src-field');
    const youtubeField = document.getElementById('youtube-field');
    const thumbnailField = document.getElementById('thumbnail-field');

    // Show/hide fields based on type
    if (type === 'youtube') {
        srcField.style.display = 'none';
        youtubeField.style.display = 'block';
        thumbnailField.style.display = 'block';
    } else if (type === 'video') {
        srcField.style.display = 'block';
        youtubeField.style.display = 'none';
        thumbnailField.style.display = 'block';
        document.querySelector('[for="m-src"]').textContent = 'URL del Video *';
    } else if (type === 'image') {
        srcField.style.display = 'block';
        youtubeField.style.display = 'none';
        thumbnailField.style.display = 'none';
        document.querySelector('[for="m-src"]').textContent = 'URL de la Imagen *';
    }
}

// Save Multimedia
async function saveMultimedia(multimediaId = null) {
    try {
        const form = document.getElementById('multimedia-form');
        const formData = new FormData(form);

        const title = formData.get('title');
        const type = formData.get('type');
        const alt = formData.get('alt');
        const date = formData.get('date');
        const category = formData.get('category');
        const featured = document.getElementById('m-featured').checked;
        const description = formData.get('description') || '';
        const thumbnail = formData.get('thumbnail') || '';

        let src = '';

        // Get src based on type
        if (type === 'youtube') {
            const youtubeUrl = formData.get('youtube');
            if (!youtubeUrl) {
                showErrorMessage('⚠️ Por favor ingresa un enlace de YouTube válido');
                return;
            }
            // Extract video ID from various YouTube URL formats
            let videoId = '';
            if (youtubeUrl.includes('youtube.com/watch?v=')) {
                videoId = youtubeUrl.split('v=')[1]?.split('&')[0];
            } else if (youtubeUrl.includes('youtu.be/')) {
                videoId = youtubeUrl.split('youtu.be/')[1]?.split('?')[0];
            } else if (youtubeUrl.includes('youtube.com/embed/')) {
                videoId = youtubeUrl.split('/embed/')[1]?.split('?')[0];
            }

            if (!videoId) {
                showErrorMessage('⚠️ No se pudo extraer el ID del video de YouTube');
                return;
            }

            src = `https://www.youtube.com/embed/${videoId}`;
        } else {
            src = formData.get('src');
        }

        // Validation
        if (!title || !type || !src || !alt || !date || !category) {
            showErrorMessage('⚠️ Por favor completa todos los campos requeridos');
            return;
        }

        const multimediaData = {
            id: multimediaId ? parseInt(multimediaId) : Date.now(),
            type: type,
            title: title,
            src: src,
            alt: alt,
            date: date,
            category: category,
            featured: featured,
            description: description,
            thumbnail: thumbnail
        };

        if (multimediaId) {
            await updateNews(multimediaId, multimediaData, MULTIMEDIA_COLLECTION);
            showSuccessMessage('✅ Multimedia actualizada');
        } else {
            await addNews(multimediaData, MULTIMEDIA_COLLECTION);
            showSuccessMessage('✅ Multimedia creada');
        }

        window.closeMultimediaModal();
        loadMultimediaData();

    } catch (error) {
        console.error('Error saving multimedia:', error);
        showErrorMessage('Error guardando multimedia: ' + error.message);
    }
}

// Show success message
function showSuccessMessage(message) {
    const messageDiv = document.getElementById('admin-message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.style.background = 'rgba(34, 197, 94, 0.15)';
        messageDiv.style.color = '#86efac';
        messageDiv.style.border = '1px solid rgba(34, 197, 94, 0.3)';
        messageDiv.style.display = 'block';
        setTimeout(() => messageDiv.style.display = 'none', 5000);
    }
}

// Show error message
function showErrorMessage(message) {
    const messageDiv = document.getElementById('admin-message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.style.background = 'rgba(239, 68, 68, 0.15)';
        messageDiv.style.color = '#fca5a5';
        messageDiv.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        messageDiv.style.display = 'block';
        setTimeout(() => messageDiv.style.display = 'none', 5000);
    }
}

// CSS Styles for form
const style = document.createElement('style');
style.textContent = `
    .form-section {
        background: rgba(30, 30, 50, 0.8);
        border: 1px solid rgba(167, 139, 250, 0.2);
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .form-section-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: #a5b4fc;
        margin-bottom: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #c7d2fe;
        font-size: 0.875rem;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
        width: 100%;
        padding: 0.75rem;
        background: rgba(26, 26, 46, 0.8);
        border: 1px solid rgba(167, 139, 250, 0.2);
        border-radius: 0.375rem;
        color: #f0f9ff;
        font-size: 0.9rem;
        font-family: inherit;
        transition: all 0.3s;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        border-color: rgba(167, 139, 250, 0.5);
        background: rgba(26, 26, 46, 1);
        box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1);
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .form-group.checkbox {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0;
    }

    .form-group.checkbox input {
        width: auto;
        margin: 0;
        cursor: pointer;
    }

    .form-group.checkbox label {
        margin: 0;
        cursor: pointer;
    }

    #multimedia-textarea {
        resize: vertical;
    }

    @media (max-width: 600px) {
        .form-row {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);
