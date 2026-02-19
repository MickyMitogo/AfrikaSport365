/**
 * Admin Historia Destacada - Firebase Version
 * Manage hero/featured story for homepage
 */

import { db, uploadImage } from '../../js/firebase-config.js';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js';

const HERO_COLLECTION = 'hero';
const HERO_DOC_ID = 'main'; // Single document for hero

let currentHero = null;

// Initialize module
async function initializeHistoriaModule() {
    console.log('[HistoriaDestacada] Module initialized');
    loadHistoriaData();
}

// Load historia data from Firebase
async function loadHistoriaData() {
    try {
        console.log('📥 Cargando Historia Destacada desde Firebase...');
        const docRef = doc(db, HERO_COLLECTION, HERO_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            currentHero = { id: docSnap.id, ...docSnap.data() };
            console.log('✓ Historia Destacada cargada:', currentHero);
            renderHistoriaCard();
        } else {
            console.warn('⚠️ No existe Historia Destacada');
            currentHero = null;
            renderHistoriaCard();
        }
    } catch (error) {
        console.error('❌ Error loading historia:', error);
    }
}

// Render historia card in dashboard
function renderHistoriaCard() {
    const container = document.getElementById('historia-container');
    if (!container) return;

    if (!currentHero) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No hay Historia Destacada configurada</p>
                <button onclick="window.openHistoriaModal()" class="btn btn-primary">Crear Historia Destacada</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="historia-card">
            <div class="historia-preview">
                <img src="${currentHero.backgroundImage || 'images/placeholder.jpg'}" alt="Historia" />
                <div class="historia-info">
                    <span class="historia-badge">${currentHero.badge || 'General'}</span>
                    <h3>${currentHero.title || 'Sin título'}</h3>
                    <p>${(currentHero.excerpt || 'Sin descripción').substring(0, 100)}...</p>
                </div>
            </div>
            <div class="historia-actions">
                <button onclick="window.editHistoria()" class="btn btn-secondary">✏️ Editar</button>
                <button onclick="window.deleteHistoria()" class="btn btn-danger">🗑️ Eliminar</button>
            </div>
        </div>
    `;
}

// Open historia modal
async function openHistoriaModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'historia-modal';

    const formattedDate = currentHero?.date
        ? new Date(currentHero.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${currentHero ? 'Editar Historia Destacada' : 'Crear Historia Destacada'}</h2>
                <button class="modal-close" onclick="window.closeHistoriaModal()">×</button>
            </div>

            <div class="modal-scroll-container">
                <form id="historia-form" class="form-standard">
                    <!-- SECCIÓN: INFORMACIÓN BÁSICA -->
                    <div class="form-section">
                        <h3 class="form-section-title">Información Básica</h3>
                        
                        <div class="form-group">
                            <label for="h-badge">Etiqueta (ej: Boxeo)</label>
                            <input type="text" id="h-badge" name="badge" value="${currentHero?.badge || ''}" placeholder="Categoría o deporte">
                        </div>

                        <div class="form-group">
                            <label for="h-title">Título Destacado *</label>
                            <input type="text" id="h-title" name="title" value="${currentHero?.title || ''}" required placeholder="Título principal del hero">
                        </div>

                        <div class="form-group">
                            <label for="h-excerpt">Descripción Corta *</label>
                            <textarea id="h-excerpt" name="excerpt" rows="3" required placeholder="Descripción breve que aparece en el hero">${currentHero?.excerpt || ''}</textarea>
                        </div>
                    </div>

                    <!-- SECCIÓN: IMÁGENES -->
                    <div class="form-section">
                        <h3 class="form-section-title">Imágenes</h3>
                        
                        <div class="form-group">
                            <label for="h-bgImage">Imagen de Fondo *</label>
                            <input type="file" id="h-bgImage" name="backgroundImage" accept="image/*">
                            <div id="h-bgImage-preview" class="image-preview">
                                ${currentHero?.backgroundImage ? `<img src="${currentHero.backgroundImage}" alt="Preview">` : ''}
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="h-bgCss">Imagen CSS (alternativa)</label>
                            <input type="file" id="h-bgCss" name="backgroundCssImage" accept="image/*">
                            <div id="h-bgCss-preview" class="image-preview">
                                ${currentHero?.backgroundCssImage ? `<img src="${currentHero.backgroundCssImage}" alt="Preview">` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- SECCIÓN: METADATA -->
                    <div class="form-section">
                        <h3 class="form-section-title">Metadata</h3>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="h-author">Autor</label>
                                <input type="text" id="h-author" name="author" value="${currentHero?.author || ''}" placeholder="Nombre del autor">
                            </div>
                            <div class="form-group">
                                <label for="h-date">Fecha de Publicación</label>
                                <input type="date" id="h-date" name="date" value="${formattedDate}">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="h-readTime">Tiempo de Lectura (minutos)</label>
                            <input type="number" id="h-readTime" name="readTime" value="${currentHero?.readTime || 5}" placeholder="8">
                        </div>

                        <div class="form-group">
                            <label for="h-slug">Slug del Artículo *</label>
                            <input type="text" id="h-slug" name="slug" value="${currentHero?.slug || ''}" required placeholder="noticias-importante-article">
                        </div>
                    </div>

                    <!-- BOTONES -->
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="window.closeHistoriaModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar Historia Destacada</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const form = document.getElementById('historia-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveHistoria();
    });

    // Image preview - Background Image
    const bgImageInput = document.getElementById('h-bgImage');
    const bgImagePreview = document.getElementById('h-bgImage-preview');

    bgImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                bgImagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Image preview - CSS Background Image
    const bgCssInput = document.getElementById('h-bgCss');
    const bgCssPreview = document.getElementById('h-bgCss-preview');

    bgCssInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                bgCssPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Close historia modal
function closeHistoriaModal() {
    const modal = document.getElementById('historia-modal');
    if (modal) modal.remove();
}

// Save historia
async function saveHistoria() {
    try {
        const form = document.getElementById('historia-form');
        const formData = new FormData(form);

        const title = formData.get('title');
        const excerpt = formData.get('excerpt');
        const slug = formData.get('slug');

        if (!title || !excerpt || !slug) {
            alert('⚠️ Por favor completa los campos requeridos: Título, Descripción y Slug');
            return;
        }

        const historiaData = {
            badge: formData.get('badge') || '',
            title: title,
            excerpt: excerpt,
            author: formData.get('author') || 'AfrikaSport365',
            date: formData.get('date') || new Date().toISOString().split('T')[0],
            readTime: parseInt(formData.get('readTime')) || 5,
            slug: slug,
            backgroundImage: currentHero?.backgroundImage || '',
            backgroundCssImage: currentHero?.backgroundCssImage || ''
        };

        // Handle background image upload
        const bgImageFile = document.getElementById('h-bgImage').files[0];
        if (bgImageFile) {
            try {
                const bgImageUrl = await uploadImage(bgImageFile, `${HERO_COLLECTION}/background-image`, HERO_COLLECTION);
                historiaData.backgroundImage = bgImageUrl;
            } catch (error) {
                console.error('Error uploading background image:', error);
                alert('Error al subir la imagen de fondo');
                return;
            }
        }

        // Handle CSS background image upload
        const bgCssFile = document.getElementById('h-bgCss').files[0];
        if (bgCssFile) {
            try {
                const bgCssUrl = await uploadImage(bgCssFile, `${HERO_COLLECTION}/background-css`, HERO_COLLECTION);
                historiaData.backgroundCssImage = bgCssUrl;
            } catch (error) {
                console.error('Error uploading CSS background image:', error);
                alert('Error al subir la imagen CSS');
                return;
            }
        }

        // Save to Firestore (single document)
        const docRef = doc(db, HERO_COLLECTION, HERO_DOC_ID);
        await setDoc(docRef, historiaData, { merge: true });

        alert('✅ Historia Destacada guardada');
        closeHistoriaModal();
        loadHistoriaData();

    } catch (error) {
        console.error('Error saving historia:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// Delete historia
async function deleteHistoria() {
    if (!confirm('¿Eliminar Historia Destacada? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        const docRef = doc(db, HERO_COLLECTION, HERO_DOC_ID);
        await deleteDoc(docRef);
        alert('✅ Historia Destacada eliminada');
        loadHistoriaData();
    } catch (error) {
        console.error('Error deleting historia:', error);
        alert('Error al eliminar: ' + error.message);
    }
}

// Global functions
window.openHistoriaModal = openHistoriaModal;
window.closeHistoriaModal = closeHistoriaModal;
window.editHistoria = openHistoriaModal;
window.deleteHistoria = deleteHistoria;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHistoriaModule);
} else {
    initializeHistoriaModule();
}

// Export
export { initializeHistoriaModule, loadHistoriaData };
