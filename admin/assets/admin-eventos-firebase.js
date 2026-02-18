/**
 * ============================================================================
 * ADMIN EVENTOS FIREBASE - Event Management Dashboard
 * ============================================================================
 * 
 * PURPOSE:
 * Complete CMS interface for managing events in Firebase Firestore
 * Supports full CRUD operations with Firebase Storage image uploads
 * 
 * FEATURES:
 * - Create/Edit/Delete events
 * - Multiple image uploads with preview
 * - Auto-increment event IDs
 * - Modal interface with organized sections
 * 
 * DEPENDENCIES:
 * - Firebase SDK (v12.9.0)
 * - firebase-config.js for CRUD helpers
 * 
 * ============================================================================
 */

import {
    db,
    storage,
    getNextNewsId,
    addNews as addNewsDB,
    updateNews as updateNewsDB,
    deleteNews as deleteNewsDB,
    uploadImage,
    addEvent,
    updateEvent,
    deleteEvent
} from '../../js/firebase-config.js';

// Event data storage
let eventData = [];

/**
 * Initialize admin dashboard
 */
async function initEventDashboard() {
    console.log('[EventDashboard] Initializing...');

    // Load initial event data
    await loadEventData('eventos');

    // Add event listeners
    document.addEventListener('click', handleDashboardActions);
}

/**
 * Load events from Firestore
 */
async function loadEventData(tab = 'eventos') {
    try {
        console.log(`[EventDashboard] Loading events from ${tab}...`);
        eventData = await getAllEvents(tab);
        renderEventTable();
    } catch (error) {
        console.error('[EventDashboard] Error loading events:', error);
        showNotification('Error cargando eventos', 'error');
    }
}

/**
 * Get all events from Firestore
 */
async function getAllEvents(collectionName = 'eventos') {
    try {
        const { getDocs, collection } = await import('https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js');
        const querySnapshot = await getDocs(collection(db, collectionName));
        const events = [];

        querySnapshot.forEach(doc => {
            events.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log('[EventDashboard] Found', events.length, 'events');
        return events;
    } catch (error) {
        console.warn('[EventDashboard] Collection may not exist yet or error loading:', error.message);
        return [];
    }
}

/**
 * Handle dashboard actions (Edit, Delete, New)
 */
function handleDashboardActions(e) {
    const target = e.target;

    if (target.classList.contains('btn-edit-event')) {
        const eventId = target.dataset.eventId;
        openEventModal(eventId);
    } else if (target.classList.contains('btn-delete-event')) {
        const eventId = target.dataset.eventId;
        if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            deleteEventHandler(eventId);
        }
    } else if (target.classList.contains('btn-new-event')) {
        openEventModal(null);
    }
}

/**
 * Open event modal for create/edit
 */
async function openEventModal(eventId) {
    const event = eventId ? eventData.find(e => e.id === eventId) : null;

    // Generate ID for new events
    let tempId = eventId;
    if (!tempId) {
        // Find the max ID and increment
        let maxId = 0;
        eventData.forEach(ev => {
            const id = parseInt(ev.id);
            if (!isNaN(id) && id > maxId) maxId = id;
        });
        tempId = String(maxId + 1);
    }

    // Add modal styles if not already added
    addEventModalStyles();

    const modal = document.createElement('div');
    modal.className = 'event-modal-overlay';
    modal.id = 'eventModalOverlay';

    modal.innerHTML = `
        <div class="event-modal-content">
            <div class="modal-header">
                <h2>${eventId ? 'Editar Evento' : 'Nuevo Evento'}</h2>
                <button class="modal-close" onclick="document.getElementById('eventModalOverlay').remove()">×</button>
            </div>
            
            <div class="modal-scroll-container">
                <form id="eventForm" class="event-form" onsubmit="saveEvent(event, '${tempId}')">
                    
                    <!-- SECCIÓN: INFORMACIÓN BÁSICA -->
                    <div class="form-section">
                        <h3 class="form-section-title">📋 Información Básica</h3>
                        
                        <div class="form-group">
                            <label for="title">Título del Evento *</label>
                            <input type="text" id="title" name="title" required 
                                   value="${event?.title || ''}" placeholder="ej: AFCON 2026">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="date">Fecha de Inicio *</label>
                                <input type="text" id="date" name="date" required 
                                       value="${event?.date || ''}" placeholder="ej: 15-30 de Enero 2026">
                            </div>
                            <div class="form-group">
                                <label for="location">Ubicación *</label>
                                <input type="text" id="location" name="location" required 
                                       value="${event?.location || ''}" placeholder="ej: Marruecos">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="sport">Deporte/Categoría *</label>
                            <input type="text" id="sport" name="sport" required 
                                   value="${event?.sport || ''}" placeholder="ej: Fútbol">
                        </div>
                    </div>

                    <!-- SECCIÓN: CONTENIDO VISUAL -->
                    <div class="form-section">
                        <h3 class="form-section-title">🖼️ Contenido Visual</h3>
                        
                        <div class="form-group">
                            <label for="image">Imagen Principal ${eventId ? '' : '*'}</label>
                            <input type="file" id="image" name="image" accept="image/*" ${eventId ? '' : 'required'}>
                            <small>PNG, JPG o WebP. Tamaño recomendado: 800x500px</small>
                            <div id="image-preview" class="image-preview">
                                ${event?.image ? `<img src="${event.image}" alt="preview">` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- SECCIÓN: DESCRIPCIÓN -->
                    <div class="form-section">
                        <h3 class="form-section-title">📝 Descripción</h3>
                        
                        <div class="form-group">
                            <label for="description">Resumen/Extracto *</label>
                            <textarea id="description" name="description" required rows="3" 
                                      placeholder="Resumen corto del evento (1-2 oraciones)...">${event?.description || ''}</textarea>
                        </div>

                        <div class="form-group">
                            <label for="content">Descripción Completa *</label>
                            <textarea id="content" name="content" required rows="6" 
                                      placeholder="Descripción detallada del evento...">${event?.content || ''}</textarea>
                        </div>
                    </div>

                    <!-- SECCIÓN: CONFIGURACIÓN -->
                    <div class="form-section">
                        <h3 class="form-section-title">⚙️ Configuración</h3>
                        
                        <div class="form-group checkbox">
                            <input type="checkbox" id="featured" name="featured" ${event?.featured ? 'checked' : ''}>
                            <label for="featured">Evento Destacado</label>
                        </div>
                    </div>

                    <!-- ACCIONES -->
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="document.getElementById('eventModalOverlay').remove()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">💾 Guardar Evento</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add image preview handler
    const imageInput = modal.querySelector('#image');
    const imagePreview = modal.querySelector('#image-preview');

    if (event?.image) {
        imagePreview.innerHTML = `<img src="${event.image}" alt="Preview">`;
    }

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                imagePreview.innerHTML = `<img src="${evt.target.result}" alt="preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

/**
 * Save event to Firestore
 */
async function saveEvent(e, tempId) {
    e.preventDefault();
    console.log('[EventDashboard] ✅ SAVE FUNCTION TRIGGERED - ID:', tempId);

    try {
        console.log('[EventDashboard] Saving event with ID:', tempId);

        const form = document.getElementById('eventForm');
        if (!form) {
            console.error('[EventDashboard] ❌ Form not found!');
            showNotification('Error: Formulario no encontrado', 'error');
            return;
        }

        const formData = new FormData(form);
        console.log('[EventDashboard] Form data obtained');

        // Handle image upload
        const imageFile = document.getElementById('image').files[0];
        let imageUrl = eventData.find(ev => ev.id === tempId)?.image || '';

        if (imageFile) {
            console.log('[EventDashboard] Uploading image...');
            imageUrl = await uploadImage(imageFile, `eventos/${tempId}/image`);
        }

        // Build event object
        const eventItem = {
            title: formData.get('title'),
            slug: formData.get('title').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
            date: formData.get('date'),
            location: formData.get('location'),
            sport: formData.get('sport'),
            description: formData.get('description'),
            content: formData.get('content'),
            image: imageUrl,
            featured: document.getElementById('featured').checked || false,
            updatedAt: new Date().toISOString()
        };

        // Check if editing or creating
        const isEditing = eventData.some(ev => ev.id === tempId);
        console.log('[EventDashboard] Is editing:', isEditing, '| Event ID:', tempId);

        if (isEditing) {
            // Update existing
            console.log('[EventDashboard] ⏳ Updating event in Firestore:', tempId);
            await updateEvent(tempId, eventItem);
            console.log('[EventDashboard] ✅ UPDATE COMPLETE:', tempId);
        } else {
            // Create new
            console.log('[EventDashboard] ⏳ Creating new event in Firestore:', tempId);
            const { setDoc, doc } = await import('https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js');
            await setDoc(doc(db, 'eventos', tempId), {
                ...eventItem,
                createdAt: new Date().toISOString()
            });
            console.log('[EventDashboard] ✅ CREATE COMPLETE:', tempId);
        }

        // Close modal and reload
        console.log('[EventDashboard] Closing modal and reloading data...');
        document.getElementById('eventModalOverlay').remove();
        await loadEventData('eventos');

        showNotification('✅ Evento guardado correctamente', 'success');
        console.log('[EventDashboard] ✅ Event saved successfully');

    } catch (error) {
        console.error('[EventDashboard] ❌ ERROR SAVING EVENT:', error);
        console.error('[EventDashboard] Error name:', error.name);
        console.error('[EventDashboard] Error message:', error.message);
        console.error('[EventDashboard] Error stack:', error.stack);
        showNotification('❌ Error guardando evento: ' + error.message, 'error');
    }
}

/**
 * Delete event from Firestore
 */
async function deleteEventHandler(eventId) {
    try {
        console.log('[EventDashboard] Deleting event:', eventId);
        await deleteEvent(eventId);
        await loadEventData('eventos');
        showNotification('✅ Evento eliminado correctamente', 'success');
    } catch (error) {
        console.error('[EventDashboard] Error deleting event:', error);
        showNotification('❌ Error eliminando evento', 'error');
    }
}

/**
 * Render events table
 */
function renderEventTable() {
    const container = document.getElementById('eventTableContainer');
    if (!container) {
        console.warn('[EventDashboard] Event table container not found');
        return;
    }

    if (eventData.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500 py-8">No hay eventos registrados. Crea uno nuevo.</td></tr>';
        return;
    }

    let tableHTML = '';

    eventData.forEach(event => {
        tableHTML += `
            <tr>
                <td>${event.title}</td>
                <td>${event.date}</td>
                <td>${event.sport}</td>
                <td>${event.featured ? '⭐ Sí' : '–'}</td>
                <td>
                    <button class="btn-small btn-edit-event" data-event-id="${event.id}">✏️ Editar</button>
                    <button class="btn-small btn-delete-event" data-event-id="${event.id}">🗑️ Eliminar</button>
                </td>
            </tr>
        `;
    });

    container.innerHTML = tableHTML;
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

/**
 * Add event modal styles
 */
function addEventModalStyles() {
    if (document.getElementById('event-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'event-modal-styles';
    style.textContent = `
        .event-modal-overlay {
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

        .event-modal-content {
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

        .event-form {
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
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-secondary:hover {
            background: rgba(102, 126, 234, 0.2);
        }
    `;
    document.head.appendChild(style);
}

// ============================================================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================================
// These functions need to be global for inline event handlers in modal HTML
window.saveEvent = saveEvent;
window.deleteEventHandler = deleteEventHandler;
window.openEventModal = openEventModal;

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', initEventDashboard);
