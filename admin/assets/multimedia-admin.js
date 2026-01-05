// multimedia-admin.js
// Maneja el formulario de Multimedia en el panel admin

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-multimedia');
    const list = document.getElementById('multimedia-list');
    const addBtn = document.getElementById('add-multimedia');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

    if (!form || !list || !addBtn) return;

    // Cargar multimedia existente
    fetch('api/get-multimedia.php')
        .then(r => r.json())
        .then(items => renderList(items));

    // Agregar nuevo item multimedia
    addBtn.addEventListener('click', function() {
        addItem({ tipo: 'imagen', titulo: '', url: '', archivo: '', descripcion: '' });
    });

    // Guardar cambios
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const items = Array.from(list.querySelectorAll('.multimedia-item')).map(item => {
            return {
                tipo: item.querySelector('select[name="tipo"]').value,
                titulo: item.querySelector('input[name="titulo"]').value.trim(),
                url: item.querySelector('input[name="url"]').value.trim(),
                archivo: item.querySelector('input[name="archivo"]').value.trim(),
                descripcion: item.querySelector('input[name="descripcion"]').value.trim()
            };
        }).filter(a => a.titulo && (a.url || a.archivo));
        fetch('api/save-multimedia.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(items)
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                showMessage('Multimedia guardada', 'success');
            } else {
                showMessage('Error al guardar: ' + data.message, 'error');
            }
        });
    });

    function renderList(items) {
        list.innerHTML = '';
        (items || []).forEach(item => addItem(item));
    }

    function addItem(data) {
        const div = document.createElement('div');
        div.className = 'multimedia-item';
        const idx = list.children.length;
        div.innerHTML = `
            <select name="tipo">
                <option value="imagen" ${data.tipo === 'imagen' ? 'selected' : ''}>Imagen</option>
                <option value="video" ${data.tipo === 'video' ? 'selected' : ''}>Video</option>
                <option value="youtube" ${data.tipo === 'youtube' ? 'selected' : ''}>YouTube</option>
                <option value="otro" ${data.tipo === 'otro' ? 'selected' : ''}>Otro enlace</option>
            </select>
            <input name="titulo" type="text" placeholder="Título" value="${data.titulo || ''}" required>
            <input name="url" type="text" placeholder="URL o enlace (opcional)" value="${data.url || ''}">
            <input name="archivo" type="text" placeholder="Archivo subido (opcional)" value="${data.archivo || ''}" readonly>
            <input type="file" accept="image/*,video/*" style="font-size:12px" id="multimedia-file-upload-${idx}">
            <input name="descripcion" type="text" placeholder="Descripción (opcional)" value="${data.descripcion || ''}">
            <button type="button" class="btn remove">Eliminar</button>
        `;
        div.querySelector('.remove').addEventListener('click', function() {
            div.remove();
        });
        // Lógica de subida de archivo
        const fileInput = div.querySelector(`#multimedia-file-upload-${idx}`);
        const archivoInput = div.querySelector('input[name="archivo"]');
        if (fileInput && archivoInput) {
            fileInput.addEventListener('change', async function() {
                if (!this.files || !this.files[0]) return;
                const formData = new FormData();
                formData.append('file', this.files[0]);
                archivoInput.disabled = true;
                archivoInput.value = 'Subiendo...';
                try {
                    const resp = await fetch('api/save-multimedia-file.php', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await resp.json();
                    if (data.success && data.url) {
                        archivoInput.value = data.url;
                    } else {
                        archivoInput.value = '';
                        alert('Error al subir el archivo: ' + (data.message || 'Error desconocido'));
                    }
                } catch (err) {
                    archivoInput.value = '';
                    alert('Error de red al subir el archivo');
                }
                archivoInput.disabled = false;
            });
        }
        list.appendChild(div);
    }
});
