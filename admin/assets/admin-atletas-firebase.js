// Admin Athletes - Firebase CRUD Operations
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

const ATHLETES_COLLECTION = 'athletes';

let currentAthletesData = [];

// Initialize Module - Main entry point
function initializeAthletesModule() {
    console.log('⚽ Inicializando módulo de Atletas...');
    try {
        // Load athletes data on initialization
        loadAthletesData();

        // Setup auth listener for future updates
        checkAuthStatus();
    } catch (error) {
        console.error('Error durante inicialización:', error);
    }
}

// Run on DOM content loaded or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAthletesModule);
} else {
    // DOM already loaded
    initializeAthletesModule();
}

// Check authentication status
function checkAuthStatus() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('✓ Usuario autenticado:', user.email);
        }
        // Load athletes data regardless of auth status
        loadAthletesData();
    });
}

// Load Athletes Data
async function loadAthletesData() {
    try {
        console.log('📥 Cargando atletas...');
        const tbody = document.getElementById('athletes-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #a5b4fc;">⏳ Cargando atletas...</td></tr>';
        }

        currentAthletesData = await getAllNews(ATHLETES_COLLECTION);
        console.log(`✓ ${currentAthletesData.length} atletas cargados`, currentAthletesData);
        renderAthletesTable();
    } catch (error) {
        console.error('❌ Error loading athletes:', error);
        const tbody = document.getElementById('athletes-tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #fca5a5;">❌ Error cargando atletas: ${error.message}</td></tr>`;
        }
        showErrorMessage('Error al cargar atletas: ' + error.message);
    }
}

// Make modal functions globally available
window.editAthlete = function (athleteId) {
    openAthleteModal(athleteId);
};

window.deleteAthlete = async function (athleteId) {
    if (!confirm('¿Eliminar este atleta? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        await deleteNews(athleteId, ATHLETES_COLLECTION);
        showSuccessMessage('✅ Atleta eliminado');
        loadAthletesData();
    } catch (error) {
        console.error('Error deleting athlete:', error);
        showErrorMessage('Error eliminando atleta: ' + error.message);
    }
};

window.closeAthleteModal = function () {
    const modal = document.getElementById('athletes-modal');
    if (modal) modal.style.display = 'none';
};

window.openAthleteModal = openAthleteModal;

window.saveAthlete = saveAthlete;

// Add stats field dynamically
window.addStatField = function () {
    const container = document.getElementById('a-stats-container');
    const index = container.children.length;
    const statDiv = document.createElement('div');
    statDiv.style.display = 'grid';
    statDiv.style.gridTemplateColumns = '1fr 1fr auto';
    statDiv.style.gap = '0.5rem';
    statDiv.style.alignItems = 'flex-end';
    statDiv.innerHTML = `
        <input type="text" class="stat-label" placeholder="Etiqueta (ej: Goles)" style="padding: 0.5rem; background: rgba(26, 26, 46, 0.8); border: 1px solid rgba(167, 139, 250, 0.2); border-radius: 0.375rem; color: #f0f9ff; font-size: 0.875rem;">
        <input type="text" class="stat-value" placeholder="Valor (ej: 45)" style="padding: 0.5rem; background: rgba(26, 26, 46, 0.8); border: 1px solid rgba(167, 139, 250, 0.2); border-radius: 0.375rem; color: #f0f9ff; font-size: 0.875rem;">
        <button type="button" class="remove-stat" onclick="removeStatField(${index})" style="padding: 0.5rem 0.75rem; background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem;">✕</button>
    `;
    container.appendChild(statDiv);
};

// Remove stats field dynamically
window.removeStatField = function (index) {
    const container = document.getElementById('a-stats-container');
    if (container.children[index]) {
        container.children[index].remove();
    }
};

// Render Athletes Table
function renderAthletesTable() {
    const tbody = document.getElementById('athletes-tbody');
    if (!tbody) return;

    if (currentAthletesData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <div style="color: #d1d5db;">
                        <p style="font-size: 1.1rem; margin-bottom: 1rem;">📭 No hay atletas</p>
                        <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 1rem;">La colección está vacía. Necesitas importar datos primero.</p>
                        <a href="init-athletes-firebase.html" style="display: inline-block; padding: 0.75rem 1.5rem; background: rgba(167, 139, 250, 0.2); color: #a5b4fc; border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 0.375rem; text-decoration: none; font-weight: 600;">→ Ir a Importar Atletas</a>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = currentAthletesData.map(athlete => `
        <tr>
            <td style="font-weight: 600; color: #a5b4fc;">${athlete.id?.substring(0, 8) || 'N/A'}</td>
            <td><strong style="color: #f0f9ff;">${athlete.nombre || 'Sin nombre'}</strong></td>
            <td style="color: #d1d5db;">${athlete.posicion || 'N/A'}</td>
            <td style="color: #d1d5db;">${athlete.category || 'General'}</td>
            <td style="color: #d1d5db;">${athlete.edad || '-'}</td>
            <td><span style="background: rgba(34, 197, 94, 0.15); color: #86efac; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">${athlete.featured ? 'Sí' : 'No'}</span></td>
            <td style="display: flex; gap: 0.5rem;">
                <button onclick="editAthlete('${athlete.id}')" style="padding: 0.5rem 1rem; background: rgba(167, 139, 250, 0.2); color: #a5b4fc; border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; transition: all 0.3s;">✎ Editar</button>
                <button onclick="deleteAthlete('${athlete.id}')" style="padding: 0.5rem 1rem; background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; transition: all 0.3s;">✕ Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// Open Athlete Modal
async function openAthleteModal(athleteId = null) {
    const modal = document.getElementById('athletes-modal');
    const formTitle = document.getElementById('athletes-form-title');
    const form = document.getElementById('athletes-form');

    let athlete = null;

    if (athleteId) {
        athlete = currentAthletesData.find(a => a.id === athleteId);
        formTitle.textContent = '✎ Editar Atleta';
    } else {
        form.reset();
        formTitle.textContent = '+ Nuevo Atleta';
    }

    const categories = ['Fútbol', 'Atletismo', 'Judo', 'Baloncesto', 'Voleibol', 'Ciclismo', 'Rugby', 'Otros'];

    form.innerHTML = `
        <!-- SECCIÓN: INFORMACIÓN BÁSICA -->
        <div class="form-section">
            <h3 class="form-section-title">Información Básica</h3>
            
            <div class="form-group">
                <label for="a-nombre">Nombre Completo *</label>
                <input type="text" id="a-nombre" name="nombre" value="${athlete?.nombre || ''}" required placeholder="Nombre del atleta">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="a-titulo">Título *</label>
                    <input type="text" id="a-titulo" name="titulo" value="${athlete?.titulo || ''}" required placeholder="Ej: Delantero • Capitán">
                </div>
                <div class="form-group">
                    <label for="a-localidad">Localidad *</label>
                    <input type="text" id="a-localidad" name="localidad" value="${athlete?.localidad || ''}" required placeholder="Ciudad, País">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="a-edad">Edad *</label>
                    <input type="number" id="a-edad" name="edad" value="${athlete?.edad || ''}" min="0" required placeholder="Edad">
                </div>
                <div class="form-group">
                    <label for="a-altura">Altura *</label>
                    <input type="text" id="a-altura" name="altura" value="${athlete?.altura || ''}" required placeholder="Ej: 1.83m">
                </div>
            </div>
        </div>

        <!-- SECCIÓN: DETALLES DEPORTIVOS -->
        <div class="form-section">
            <h3 class="form-section-title">Detalles Deportivos</h3>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="a-posicion">Posición/Especialidad *</label>
                    <input type="text" id="a-posicion" name="posicion" value="${athlete?.posicion || ''}" required placeholder="Ej: Delantero, Velocista">
                </div>
                <div class="form-group">
                    <label for="a-dorsal">Dorsal</label>
                    <input type="number" id="a-dorsal" name="dorsal" value="${athlete?.dorsal || ''}" placeholder="Número de dorsal">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="a-badge">Badge *</label>
                    <input type="text" id="a-badge" name="badge" value="${athlete?.badge || ''}" required placeholder="Ej: FÚTBOL">
                </div>
                <div class="form-group">
                    <label for="a-category">Categoría *</label>
                    <select id="a-category" name="category" required>
                        <option value="">Seleccionar categoría</option>
                        ${categories.map(c => `<option value="${c}" ${athlete?.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>

        <!-- SECCIÓN: IMAGEN Y VISIBILIDAD -->
        <div class="form-section">
            <h3 class="form-section-title">Imagen y Visibilidad</h3>
            
            <div class="form-group">
                <label for="a-imagen">Imagen de Perfil ${athlete ? '' : '*'}</label>
                <input type="file" id="a-imagen" name="imagen" accept="image/*" ${athlete ? '' : 'required'}>
                <div id="a-imagen-preview" class="image-preview"></div>
            </div>

            <div class="form-group checkbox">
                <input type="checkbox" id="a-featured" name="featured" ${athlete?.featured ? 'checked' : ''}>
                <label for="a-featured">Mostrar como Destacado</label>
            </div>
        </div>

        <!-- SECCIÓN: BIOGRAFÍA Y ESTADÍSTICAS -->
        <div class="form-section">
            <h3 class="form-section-title">Biografía y Estadísticas</h3>
            
            <div class="form-group">
                <label for="a-description">Descripción Breve *</label>
                <textarea id="a-description" name="description" rows="2" required placeholder="Resumen corto del atleta">${athlete?.description || ''}</textarea>
            </div>

            <div class="form-group">
                <label for="a-bio">Biografía Completa *</label>
                <textarea id="a-bio" name="bio" rows="4" required placeholder="Biografía detallada">${athlete?.bio || ''}</textarea>
            </div>

            <div class="form-group">
                <label for="a-logros">Logros (uno por línea)</label>
                <textarea id="a-logros" name="logros" rows="3" placeholder="Campeón Nacional 2023&#10;Medalla de Plata AFCON&#10;etc...">${athlete?.logros?.join('\n') || ''}</textarea>
            </div>

            <div class="form-group">
                <label>Estadísticas</label>
                <div id="a-stats-container" style="display: flex; flex-direction: column; gap: 0.75rem;">
                    ${athlete?.stats?.map((stat, idx) => `
                        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 0.5rem; align-items: flex-end;">
                            <input type="text" class="stat-label" value="${stat.etiqueta || ''}" placeholder="Etiqueta (ej: Goles)" style="padding: 0.5rem; background: rgba(26, 26, 46, 0.8); border: 1px solid rgba(167, 139, 250, 0.2); border-radius: 0.375rem; color: #f0f9ff; font-size: 0.875rem;">
                            <input type="text" class="stat-value" value="${stat.valor || ''}" placeholder="Valor (ej: 45)" style="padding: 0.5rem; background: rgba(26, 26, 46, 0.8); border: 1px solid rgba(167, 139, 250, 0.2); border-radius: 0.375rem; color: #f0f9ff; font-size: 0.875rem;">
                            <button type="button" class="remove-stat" onclick="removeStatField(${idx})" style="padding: 0.5rem 0.75rem; background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem;">✕</button>
                        </div>
                    `) || ''}
                </div>
                <button type="button" onclick="addStatField()" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: rgba(167, 139, 250, 0.15); color: #a5b4fc; border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem;">+ Agregar Estadística</button>
            </div>
        </div>

        <button type="button" onclick="saveAthlete('${athlete?.id || ''}')" style="padding: 1rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; width: 100%; margin-top: 1rem;">
            ${athlete ? '💾 Actualizar Atleta' : '➕ Crear Atleta'}
        </button>
    `;

    if (athlete?.imagen) {
        const previewDiv = document.getElementById('a-imagen-preview');
        previewDiv.innerHTML = `<img src="${athlete.imagen}" alt="${athlete.nombre}">`;
    }

    modal.style.display = 'block';
}

// Save Athlete
async function saveAthlete(athleteId = null) {
    try {
        const form = document.getElementById('athletes-form');
        const formData = new FormData(form);

        let imagenUrl = athleteId ? currentAthletesData.find(a => a.id === athleteId)?.imagen || '' : '';

        const imagenFile = document.getElementById('a-imagen').files[0];

        if (imagenFile) {
            imagenUrl = await uploadImage(imagenFile, `${ATHLETES_COLLECTION}/${athleteId || 'new'}/imagen`, ATHLETES_COLLECTION);
        }

        const nombre = formData.get('nombre');
        const slug = nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

        const logrosText = formData.get('logros') || '';
        const logros = logrosText.split('\n').filter(l => l.trim());

        // Capture statistics from dynamic fields
        const statsContainer = document.getElementById('a-stats-container');
        const stats = [];
        if (statsContainer) {
            statsContainer.querySelectorAll('div').forEach(statDiv => {
                const labelInput = statDiv.querySelector('.stat-label');
                const valueInput = statDiv.querySelector('.stat-value');
                if (labelInput && valueInput && labelInput.value && valueInput.value) {
                    stats.push({
                        etiqueta: labelInput.value.trim(),
                        valor: valueInput.value.trim()
                    });
                }
            });
        }

        const athleteData = {
            nombre: nombre,
            slug: slug,
            titulo: formData.get('titulo'),
            localidad: formData.get('localidad'),
            edad: parseInt(formData.get('edad')) || 0,
            altura: formData.get('altura'),
            posicion: formData.get('posicion'),
            dorsal: formData.get('dorsal') ? parseInt(formData.get('dorsal')) : '',
            imagen: imagenUrl,
            badge: formData.get('badge'),
            badgeColor: '#667eea',
            featured: document.getElementById('a-featured').checked,
            category: formData.get('category'),
            description: formData.get('description'),
            bio: formData.get('bio'),
            logros: logros,
            stats: stats
        };

        if (athleteId) {
            await updateNews(athleteId, athleteData, ATHLETES_COLLECTION);
            showSuccessMessage('✅ Atleta actualizado');
        } else {
            await addNews(athleteData, ATHLETES_COLLECTION);
            showSuccessMessage('✅ Atleta creado');
        }

        window.closeAthleteModal();
        loadAthletesData();

    } catch (error) {
        console.error('Error saving athlete:', error);
        showErrorMessage('Error guardando atleta: ' + error.message);
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
        setTimeout(() => messageDiv.style.display = 'none', 3000);
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
        setTimeout(() => messageDiv.style.display = 'none', 3000);
    }
}

// Add modal styles if not already present
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .form-section {
            background: rgba(167, 139, 250, 0.05);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(167, 139, 250, 0.1);
            margin-bottom: 1rem;
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
            font-size: 0.95rem;
        }

        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group input[type="date"],
        .form-group input[type="file"],
        .form-group input[type="number"],
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            background: #2d2d44;
            border: 1px solid rgba(167, 139, 250, 0.2);
            border-radius: 6px;
            color: #f0f9ff;
            font-family: inherit;
            font-size: 0.95rem;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #a5b4fc;
            box-shadow: 0 0 0 3px rgba(165, 180, 252, 0.1);
        }

        .form-group textarea {
            resize: vertical;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .image-preview {
            padding: 1rem;
            border: 2px dashed rgba(167, 139, 250, 0.3);
            border-radius: 6px;
            text-align: center;
            margin-top: 0.5rem;
            background: rgba(45, 45, 68, 0.5);
        }

        .image-preview img {
            max-width: 100%;
            max-height: 200px;
            border-radius: 4px;
        }

        .form-group.checkbox {
            display: flex;
            align-items: center;
        }

        .form-group.checkbox input[type="checkbox"] {
            width: auto;
            margin-right: 0.5rem;
        }

        .form-group.checkbox label {
            margin-bottom: 0;
        }
    `;
    if (!document.querySelector('style[data-athletes-styles]')) {
        style.setAttribute('data-athletes-styles', 'true');
        document.head.appendChild(style);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    addModalStyles();

    // Modal close button
    const modal = document.getElementById('athletes-modal');
    if (modal) {
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }
});
