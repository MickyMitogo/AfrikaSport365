// Admin Regional News - Firebase CRUD Operations
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
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const REGIONAL_NEWS_COLLECTION = 'regional_news';

let currentRegionalNewsData = [];

// Initialize Module - Main entry point
function initializeRegionalNewsModule() {
    console.log('📋 Inicializando módulo de Noticias Regionales...');
    try {
        // Load regional news data on initialization
        loadRegionalNewsData();

        // Setup auth listener for future updates
        checkAuthStatus();
    } catch (error) {
        console.error('Error durante inicialización:', error);
    }
}

// Run on DOM content loaded or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRegionalNewsModule);
} else {
    // DOM already loaded (e.g., if module loads after initial page load)
    initializeRegionalNewsModule();
}

// Check authentication status
function checkAuthStatus() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('✓ Usuario autenticado:', user.email);
        }
        // Load regional news data regardless of auth status
        loadRegionalNewsData();
    });
}

// Load Regional News Data
async function loadRegionalNewsData() {
    try {
        console.log('📥 Cargando noticias regionales...');
        const tbody = document.getElementById('regional-news-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #a5b4fc;">⏳ Cargando noticias regionales...</td></tr>';
        }

        currentRegionalNewsData = await getAllNews(REGIONAL_NEWS_COLLECTION);
        console.log(`✓ ${currentRegionalNewsData.length} noticias regionales cargadas`, currentRegionalNewsData);
        renderRegionalNewsTable();
    } catch (error) {
        console.error('❌ Error loading regional news:', error);
        const tbody = document.getElementById('regional-news-tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #fca5a5;">❌ Error cargando noticias: ${error.message}</td></tr>`;
        }
        showErrorMessage('Error al cargar noticias regionales: ' + error.message);
    }
}

// Make modal functions globally available
window.editRegionalNews = function (newsId) {
    openRegionalNewsModal(newsId);
};

window.deleteRegionalNews = async function (newsId) {
    if (!confirm('¿Eliminar esta noticia regional? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        await deleteNews(newsId, REGIONAL_NEWS_COLLECTION);
        showSuccessMessage('✅ Noticia eliminada');
        loadRegionalNewsData();
    } catch (error) {
        console.error('Error deleting news:', error);
        showErrorMessage('Error eliminando noticia: ' + error.message);
    }
};

window.closeRegionalNewsModal = function () {
    const modal = document.getElementById('regional-news-modal');
    if (modal) modal.style.display = 'none';
};

window.openRegionalNewsModal = openRegionalNewsModal;

// Render Regional News Table
function renderRegionalNewsTable() {
    const tbody = document.getElementById('regional-news-tbody');
    if (!tbody) return;

    if (currentRegionalNewsData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <div style="color: #d1d5db;">
                        <p style="font-size: 1.1rem; margin-bottom: 1rem;">📭 No hay noticias regionales</p>
                        <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 1rem;">La colección está vacía. Necesitas importar datos primero.</p>
                        <a href="init-regional-news-firebase.html" style="display: inline-block; padding: 0.75rem 1.5rem; background: rgba(167, 139, 250, 0.2); color: #a5b4fc; border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 0.375rem; text-decoration: none; font-weight: 600;">→ Ir a Importar Noticias</a>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = currentRegionalNewsData.map(news => `
        <tr>
            <td style="font-weight: 600; color: #a5b4fc;">${news.id?.substring(0, 8) || 'N/A'}</td>
            <td><strong style="color: #f0f9ff;">${news.titulo || 'Sin título'}</strong></td>
            <td><span style="background: rgba(102, 126, 234, 0.2); color: #a5b4fc; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">${news.regionName || 'N/A'}</span></td>
            <td style="color: #d1d5db;">${news.categoria || 'General'}</td>
            <td style="color: #d1d5db;">${news.autor || 'Sin autor'}</td>
            <td style="font-size: 0.875rem; color: #9ca3af;">${news.fechaMostrada || 'N/A'}</td>
            <td style="display: flex; gap: 0.5rem;">
                <button onclick="editRegionalNews('${news.id}')" style="padding: 0.5rem 1rem; background: rgba(167, 139, 250, 0.2); color: #a5b4fc; border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; transition: all 0.3s;">✎ Editar</button>
                <button onclick="deleteRegionalNews('${news.id}')" style="padding: 0.5rem 1rem; background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; transition: all 0.3s;">✕ Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// Open Regional News Modal
async function openRegionalNewsModal(newsId = null) {
    const modal = document.getElementById('regional-news-modal');
    const formTitle = document.getElementById('regional-news-form-title');
    const form = document.getElementById('regional-news-form');

    let newsItem = null;

    if (newsId) {
        newsItem = currentRegionalNewsData.find(n => n.id === newsId);
        formTitle.textContent = '✎ Editar Noticia Regional';
    } else {
        form.reset();
        formTitle.textContent = '+ Nueva Noticia Regional';
    }

    // Regions
    const regions = [
        { value: 'maghreb', label: 'Mágreb' },
        { value: 'west', label: 'Occidental' },
        { value: 'central', label: 'Central' },
        { value: 'south', label: 'Sur' },
        { value: 'horn', label: 'Cuerno' }
    ];

    // Format date for input
    let formattedDate = new Date().toISOString().split('T')[0];
    if (newsItem && newsItem.fecha) {
        const dateObj = new Date(newsItem.fecha);
        if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toISOString().split('T')[0];
        }
    }

    form.innerHTML = `
        <!-- SECCIÓN: INFORMACIÓN BÁSICA -->
        <div class="form-section">
            <h3 class="form-section-title">Información Básica</h3>
            
            <div class="form-group">
                <label for="rn-titulo">Título *</label>
                <input type="text" id="rn-titulo" name="titulo" value="${newsItem?.titulo || ''}" required placeholder="Título de la noticia">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="rn-region">Región *</label>
                    <select id="rn-region" name="region" required>
                        <option value="">Seleccionar región</option>
                        ${regions.map(r => `<option value="${r.value}" ${newsItem?.region === r.value ? 'selected' : ''}>${r.label}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="rn-categoria">Categoría *</label>
                    <select id="rn-categoria" name="categoria" required>
                        <option value="General" ${newsItem?.categoria === 'General' ? 'selected' : ''}>General</option>
                        <option value="Atletismo" ${newsItem?.categoria === 'Atletismo' ? 'selected' : ''}>Atletismo</option>
                        <option value="Fútbol" ${newsItem?.categoria === 'Fútbol' ? 'selected' : ''}>Fútbol</option>
                        <option value="Infraestructura" ${newsItem?.categoria === 'Infraestructura' ? 'selected' : ''}>Infraestructura</option>
                        <option value="Política Deportiva" ${newsItem?.categoria === 'Política Deportiva' ? 'selected' : ''}>Política Deportiva</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="rn-resumen">Resumen *</label>
                <textarea id="rn-resumen" name="resumen" rows="3" required placeholder="Resumen breve de la noticia">${newsItem?.resumen || ''}</textarea>
            </div>
        </div>

        <!-- SECCIÓN: IMÁGENES -->
        <div class="form-section">
            <h3 class="form-section-title">Imágenes</h3>
            
            <div class="form-group">
                <label for="rn-imagen">Imagen Principal ${newsItem ? '' : '*'}</label>
                <input type="file" id="rn-imagen" name="imagen" accept="image/*" ${newsItem ? '' : 'required'}>
                <div id="rn-imagen-preview" class="image-preview"></div>
            </div>
        </div>

        <!-- SECCIÓN: INFORMACIÓN DE PUBLICACIÓN -->
        <div class="form-section">
            <h3 class="form-section-title">Información de Publicación</h3>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="rn-autor">Autor *</label>
                    <input type="text" id="rn-autor" name="autor" value="${newsItem?.autor || ''}" required placeholder="Nombre del autor">
                </div>
                <div class="form-group">
                    <label for="rn-fecha">Fecha de Publicación *</label>
                    <input type="date" id="rn-fecha" name="fecha" value="${formattedDate}" required>
                </div>
            </div>

            <div class="form-group checkbox" style="display: flex; align-items: center; padding-top: 1.5rem;">
                <input type="checkbox" id="rn-featured" name="featured" ${newsItem?.featured ? 'checked' : ''}>
                <label for="rn-featured" style="margin-bottom: 0; margin-left: 0.5rem;">Destacado</label>
            </div>
        </div>

        <!-- SECCIÓN: CONTENIDO -->
        <div class="form-section">
            <h3 class="form-section-title">Contenido</h3>
            
            <div class="form-group">
                <label for="rn-contenido">Contenido *</label>
                <textarea id="rn-contenido" name="contenido" rows="8" required placeholder="Contenido completo de la noticia">${newsItem?.contenido || ''}</textarea>
            </div>
        </div>

        <!-- BOTONES DE ACCIÓN -->
        <div style="display: flex; gap: 1rem; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(167, 139, 250, 0.1);">
            <button type="submit" style="flex: 1; padding: 0.875rem 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                ${newsItem ? '✓ Actualizar' : '+ Crear'}
            </button>
            <button type="button" onclick="window.closeRegionalNewsModal()" style="flex: 1; padding: 0.875rem 1.5rem; background: rgba(167, 139, 250, 0.1); color: #a5b4fc; border: 1px solid rgba(167, 139, 250, 0.2); border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                Cancelar
            </button>
        </div>
    `;

    // Image preview
    const imagenInput = document.getElementById('rn-imagen');
    const imagenPreview = document.getElementById('rn-imagen-preview');

    if (newsItem?.imagen) {
        imagenPreview.innerHTML = `<img src="${newsItem.imagen}" alt="Preview" style="max-width: 100%; height: auto; border-radius: 0.375rem;">`;
    }

    if (imagenInput) {
        imagenInput.addEventListener('change', function (e) {
            if (e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    imagenPreview.innerHTML = `<img src="${event.target.result}" alt="Preview" style="max-width: 100%; height: auto; border-radius: 0.375rem;">`;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // Form submission
    form.onsubmit = async (e) => {
        e.preventDefault();
        await saveRegionalNews(newsId);
    };

    modal.style.display = 'block';
}

// Save Regional News
async function saveRegionalNews(newsId = null) {
    try {
        const form = document.getElementById('regional-news-form');
        const formData = new FormData(form);

        let imagenUrl = newsId ? currentRegionalNewsData.find(n => n.id === newsId)?.imagen || '' : '';

        const imagenFile = document.getElementById('rn-imagen').files[0];

        if (imagenFile) {
            imagenUrl = await uploadImage(imagenFile, `${REGIONAL_NEWS_COLLECTION}/${newsId || 'new'}/imagen`, REGIONAL_NEWS_COLLECTION);
        }

        // Get region name
        const regionValue = formData.get('region');
        const regionMap = {
            'maghreb': 'Mágreb',
            'west': 'Occidental',
            'central': 'Central',
            'south': 'Sur',
            'horn': 'Cuerno'
        };
        const regionName = regionMap[regionValue] || regionValue;

        const titel = formData.get('titulo');
        const slug = titel.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

        const newsData = {
            titulo: titel,
            slug: slug,
            resumen: formData.get('resumen'),
            contenido: formData.get('contenido'),
            imagen: imagenUrl,
            autor: formData.get('autor'),
            region: regionValue,
            regionName: regionName,
            categoria: formData.get('categoria'),
            featured: document.getElementById('rn-featured').checked,
            fechaMostrada: new Date(formData.get('fecha')).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
            meta: {
                author: formData.get('autor'),
                date: formData.get('fecha')
            }
        };

        if (newsId) {
            await updateNews(newsId, newsData, REGIONAL_NEWS_COLLECTION);
            showSuccessMessage('✅ Noticia regional actualizada');
        } else {
            await addNews(newsData, REGIONAL_NEWS_COLLECTION);
            showSuccessMessage('✅ Noticia regional creada');
        }

        window.closeRegionalNewsModal();
        loadRegionalNewsData();

    } catch (error) {
        console.error('Error saving news:', error);
        showErrorMessage('Error guardando noticia: ' + error.message);
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
    `;
    if (!document.querySelector('style[data-regional-news-styles]')) {
        style.setAttribute('data-regional-news-styles', 'true');
        document.head.appendChild(style);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    addModalStyles();

    // Modal close button
    const modal = document.getElementById('regional-news-modal');
    if (modal) {
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }
});
