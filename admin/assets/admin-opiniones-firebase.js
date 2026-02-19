// Admin Opinion & Analysis Management Script - Firebase Version
import {
    db, auth, storage,
    addNews as addOpinionDB,
    updateNews as updateOpinionDB,
    deleteNews as deleteOpinionDB,
    getAllNews,
    uploadImage,
    onAuthChange
} from '../../js/firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let currentUser = null;
let opinionData = [];

const OPINION_COLLECTION = 'analisis_opinion';

// Initialize
function initializeOpinionModule() {
    console.log('Initializing opinion module...');
    try {
        setupAddOpinionButton();
        console.log('Add button setup complete');

        // Load opinions data for the first time
        loadOpinionData();

        // Also setup auth listener for future updates
        checkAuthStatus();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// Run on DOM content loaded or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOpinionModule);
} else {
    // DOM already loaded
    initializeOpinionModule();
}

// Check authentication status
function checkAuthStatus() {
    onAuthChange(async (user) => {
        if (user) {
            currentUser = user;
        }
        // Load opinions regardless of auth status
        loadOpinionData();
    });
}

// Load opinion data from Firestore
async function loadOpinionData() {
    try {
        console.log('Loading opinion data from collection:', OPINION_COLLECTION);
        opinionData = await getAllNews(OPINION_COLLECTION);
        console.log('Loaded opinions:', opinionData.length);
        renderOpinionTable();
    } catch (error) {
        console.error('Error loading opinion data:', error);
        // Only show notification if DOM is ready
        if (document.body) {
            showErrorMessage('Error al cargar los artículos: ' + error.message);
        }
    }
}

// Render opinion table
function renderOpinionTable() {
    const tbody = document.getElementById('opinion-table-body');
    console.log('Rendering opinion table. tbody found:', !!tbody);
    console.log('Opinion data count:', opinionData.length);

    if (!tbody) {
        console.warn('opinion-table-body element not found');
        return;
    }

    tbody.innerHTML = '';

    if (opinionData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-message">No hay artículos de opinión</td></tr>';
        return;
    }

    opinionData.forEach(opinion => {
        const row = document.createElement('tr');
        const featured = opinion.featured ? 'Sí' : 'No';
        const featuredClass = opinion.featured ? '' : 'no';
        const opinionId = String(opinion.id || '').substring(0, 8) || 'N/A';

        row.innerHTML = `
            <td>${opinionId}...</td>
            <td>
                <div style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${opinion.titulo}
                </div>
            </td>
            <td>${opinion.autor || '-'}</td>
            <td>${opinion.meta?.date || '-'}</td>
            <td><span class="featured-badge ${featuredClass}">${featured}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="window.editOpinion('${opinion.id}')">Editar</button>
                    <button class="btn-delete" onclick="window.deleteOpinion('${opinion.id}')">Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Setup add opinion button
function setupAddOpinionButton() {
    const addBtn = document.getElementById('add-opinion-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            openOpinionModal(null);
        });
    }
}

// Open opinion modal
async function openOpinionModal(opinionId) {
    let opinionItem = null;

    if (opinionId !== null) {
        try {
            const docRef = doc(db, OPINION_COLLECTION, String(opinionId));
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                opinionItem = { id: docSnap.id, ...docSnap.data() };
            }
        } catch (error) {
            console.error('Error loading opinion item:', error);
        }
    }

    const modal = document.createElement('div');
    modal.className = 'news-modal-overlay';
    modal.id = 'opinion-modal';

    const formattedDate = formatDateToISO(opinionItem?.meta?.date || '');

    modal.innerHTML = `
        <div class="news-modal-content">
            <div class="modal-header">
                <h2>${opinionItem ? 'Editar Artículo' : 'Nuevo Artículo de Opinión'}</h2>
                <button class="modal-close" onclick="window.closeOpinionModal()">×</button>
            </div>

            <div class="modal-scroll-container">
                <form id="opinion-form" class="news-form">
                    <!-- SECCIÓN: INFORMACIÓN BÁSICA -->
                    <div class="form-section">
                        <h3 class="form-section-title">Información Básica</h3>
                        
                        <div class="form-group">
                            <label for="op-titulo">Título *</label>
                            <input type="text" id="op-titulo" name="titulo" value="${opinionItem?.titulo || ''}" required>
                        </div>

                        <div class="form-group">
                            <label for="op-resumen">Resumen *</label>
                            <textarea id="op-resumen" name="resumen" rows="3" required>${opinionItem?.resumen || ''}</textarea>
                        </div>
                    </div>

                    <!-- SECCIÓN: IMÁGENES -->
                    <div class="form-section">
                        <h3 class="form-section-title">Imágenes</h3>
                        
                        <div class="form-group">
                            <label for="op-imagen">Imagen Principal del Artículo ${opinionItem ? '' : '*'}</label>
                            <input type="file" id="op-imagen" name="imagen" accept="image/*" ${opinionItem ? '' : 'required'}>
                            <div id="op-imagen-preview" class="image-preview"></div>
                        </div>

                        <div class="form-group">
                            <label for="op-autorImagen">Foto del Autor ${opinionItem ? '' : '*'}</label>
                            <input type="file" id="op-autorImagen" name="autorImagen" accept="image/*" ${opinionItem ? '' : 'required'}>
                            <div id="op-autorImagen-preview" class="image-preview"></div>
                        </div>
                    </div>

                    <!-- SECCIÓN: INFORMACIÓN DE PUBLICACIÓN -->
                    <div class="form-section">
                        <h3 class="form-section-title">Información de Publicación</h3>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="op-autor">Autor *</label>
                                <input type="text" id="op-autor" name="autor" value="${opinionItem?.autor || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="op-badge">Tipo/Badge *</label>
                                <select id="op-badge" name="badge" required>
                                    <option value="OPINIÓN" ${opinionItem?.badge === 'OPINIÓN' ? 'selected' : ''}>OPINIÓN</option>
                                    <option value="ENTREVISTA" ${opinionItem?.badge === 'ENTREVISTA' ? 'selected' : ''}>ENTREVISTA</option>
                                    <option value="ANÁLISIS" ${opinionItem?.badge === 'ANÁLISIS' ? 'selected' : ''}>ANÁLISIS</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="op-autorBio">Biografía del Autor</label>
                            <textarea id="op-autorBio" name="autorBio" rows="3" placeholder="Información breve sobre el autor y su experiencia en el área...">${opinionItem?.autorBio || ''}</textarea>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="op-fecha">Fecha de Publicación *</label>
                                <input type="date" id="op-fecha" name="fecha" value="${formattedDate}" required>
                            </div>
                            <div class="form-group checkbox" style="display: flex; align-items: center; padding-top: 1.5rem;">
                                <input type="checkbox" id="op-featured" name="featured" ${opinionItem?.featured ? 'checked' : ''}>
                                <label for="op-featured" style="margin-bottom: 0; margin-left: 0.5rem;">Destacado</label>
                            </div>
                        </div>
                    </div>

                    <!-- SECCIÓN: CONTENIDO -->
                    <div class="form-section">
                        <h3 class="form-section-title">Contenido del Artículo</h3>
                        
                        <div class="form-group">
                            <label for="op-contenido">Contenido (Texto enriquecido)</label>
                            <textarea id="op-contenido" name="contenido" rows="10" placeholder="Contenido completo del artículo...">${opinionItem?.contenido || ''}</textarea>
                            <small style="color: #a5b4fc; margin-top: 0.5rem; display: block;">Puedes usar HTML básico para formatear (p, strong, em, h2, h3, blockquote, etc.)</small>
                        </div>
                    </div>

                    <!-- ACCIONES -->
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="window.closeOpinionModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar Artículo</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const form = document.getElementById('opinion-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveOpinion(opinionItem?.id || null);
    });

    // Image preview for article image
    const imagenInput = document.getElementById('op-imagen');
    const imagenPreview = document.getElementById('op-imagen-preview');

    if (opinionItem?.imagen) {
        imagenPreview.innerHTML = `<img src="${opinionItem.imagen}" alt="Preview">`;
    }

    imagenInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagenPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Image preview for author image
    const autorImagenInput = document.getElementById('op-autorImagen');
    const autorImagenPreview = document.getElementById('op-autorImagen-preview');

    if (opinionItem?.autorImagen) {
        autorImagenPreview.innerHTML = `<img src="${opinionItem.autorImagen}" alt="Preview">`;
    }

    autorImagenInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                autorImagenPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    addModalStyles();
}

// Close opinion modal
window.closeOpinionModal = function () {
    const modal = document.getElementById('opinion-modal');
    if (modal) {
        modal.remove();
    }
};

// Save opinion (create or update)
async function saveOpinion(opinionId) {
    try {
        const form = document.getElementById('opinion-form');
        const formData = new FormData(form);

        let imagenUrl = opinionId ? (await getAllNews(OPINION_COLLECTION)).find(o => o.id === opinionId)?.imagen || '' : '';
        let autorImagenUrl = opinionId ? (await getAllNews(OPINION_COLLECTION)).find(o => o.id === opinionId)?.autorImagen || '' : '';

        const imagenFile = document.getElementById('op-imagen').files[0];
        const autorImagenFile = document.getElementById('op-autorImagen').files[0];

        if (imagenFile) {
            imagenUrl = await uploadImage(imagenFile, `${OPINION_COLLECTION}/${opinionId || 'new'}/imagen`, OPINION_COLLECTION);
        }

        if (autorImagenFile) {
            autorImagenUrl = await uploadImage(autorImagenFile, `${OPINION_COLLECTION}/${opinionId || 'new'}/autorImagen`, OPINION_COLLECTION);
        }

        const titel = formData.get('titulo');
        const slug = titel.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

        const opinionData = {
            titulo: titel,
            slug: slug,
            resumen: formData.get('resumen'),
            contenido: formData.get('contenido'),
            imagen: imagenUrl,
            autorImagen: autorImagenUrl,
            autor: formData.get('autor'),
            autorBio: formData.get('autorBio'),
            badge: formData.get('badge'),
            featured: document.getElementById('op-featured').checked,
            meta: {
                author: formData.get('autor'),
                date: formData.get('fecha')
            }
        };

        if (opinionId) {
            await updateOpinionDB(opinionId, opinionData, OPINION_COLLECTION);
            showSuccessMessage('✅ Artículo actualizado');
        } else {
            await addOpinionDB(opinionData, OPINION_COLLECTION);
            showSuccessMessage('✅ Artículo creado');
        }

        window.closeOpinionModal();
        loadOpinionData();

    } catch (error) {
        console.error('Error saving opinion:', error);
        showErrorMessage('Error guardando artículo: ' + error.message);
    }
}

// Global functions
window.editOpinion = function (opinionId) {
    openOpinionModal(opinionId);
};

window.deleteOpinion = async function (opinionId) {
    if (!confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        await deleteOpinionDB(String(opinionId), OPINION_COLLECTION);
        showSuccessMessage('Artículo eliminado');
        loadOpinionData();
    } catch (error) {
        console.error('Error deleting opinion:', error);
        showErrorMessage('Error al eliminar el artículo: ' + error.message);
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

// Helper function to format date
function formatDateToISO(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    const date = new Date(dateString);
    if (isNaN(date)) return new Date().toISOString().split('T')[0];
    return date.toISOString().split('T')[0];
}

// Add modal styles
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .news-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding-top: 2rem;
            z-index: 2000;
            overflow-y: auto;
        }

        .news-modal-content {
            background: #1a1a2e;
            border: 1px solid rgba(167, 139, 250, 0.2);
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            color: #f0f9ff;
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
        }

        .modal-scroll-container {
            overflow-y: auto;
            padding: 1.5rem;
            flex: 1;
        }

        .news-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .form-section {
            background: rgba(167, 139, 250, 0.05);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(167, 139, 250, 0.1);
        }

        .form-section-title {
            font-size: 1rem;
            font-weight: 600;
            color: #a5b4fc;
            margin-bottom: 1rem;
            margin-top: 0;
        }

        .form-group {
            margin-bottom: 1rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #e0e7ff;
            font-weight: 500;
        }

        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group input[type="date"],
        .form-group input[type="color"],
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            background: #2d2d44;
            border: 1px solid rgba(167, 139, 250, 0.2);
            border-radius: 6px;
            color: #f0f9ff;
            font-family: inherit;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            padding-top: 1rem;
            border-top: 1px solid rgba(167, 139, 250, 0.1);
        }

        .btn {
            padding: 0.75rem 1rem;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-weight: 600;
        }

        .btn-primary {
            background: #667eea;
            color: white;
        }

        .btn-secondary {
            background: #4b5563;
            color: white;
        }

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
    if (!document.querySelector('style[data-modal-styles]')) {
        style.setAttribute('data-modal-styles', 'true');
        document.head.appendChild(style);
    }
}
