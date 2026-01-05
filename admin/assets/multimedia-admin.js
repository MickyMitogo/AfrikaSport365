// multimedia-admin.js
// Maneja la galería multimedia en el panel admin

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-multimedia');
    const list = document.getElementById('multimedia-list');
    const addBtn = document.getElementById('add-multimedia');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

    if (!form || !list || !addBtn) return;

    // Cargar elementos multimedia existentes
    fetch('api/get-multimedia.php')
        .then(r => r.json())
        .then(items => renderList(items));

    // Agregar nuevo elemento
    addBtn.addEventListener('click', function() {
        addItem({ type: 'image', title: '', src: '', alt: '', date: '' });
    });

    // Guardar cambios
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const items = Array.from(list.querySelectorAll('.multimedia-item')).map(item => {
            return {
                type: item.querySelector('select[name="type"]').value,
                title: item.querySelector('input[name="title"]').value.trim(),
                src: item.querySelector('input[name="src"]').value.trim(),
                alt: item.querySelector('input[name="alt"]').value.trim(),
                date: item.querySelector('input[name="date"]').value.trim()
            };
        }).filter(a => a.type && a.src);
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
                showMessage('Galería guardada', 'success');
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
            <select name="type">
                <option value="image" ${data.type === 'image' ? 'selected' : ''}>Imagen</option>
                <option value="video" ${data.type === 'video' ? 'selected' : ''}>Video</option>
            </select>
            <input name="title" type="text" placeholder="Título" value="${data.title || ''}">
            <div style="display:flex;flex-direction:column;gap:4px">
                <input name="src" type="text" placeholder="URL o ruta" value="${data.src || ''}" required>
                <input type="file" accept="image/*,video/*" style="font-size:12px" id="multimedia-file-upload-${idx}">
            </div>
            <input name="alt" type="text" placeholder="Texto alternativo" value="${data.alt || ''}">
            <input name="date" type="date" value="${data.date || ''}">
            <button type="button" class="btn remove">Eliminar</button>
        `;
        div.querySelector('.remove').addEventListener('click', function() {
            div.remove();
        });
        // Lógica de subida de archivo
        const fileInput = div.querySelector(`#multimedia-file-upload-${idx}`);
        const srcInput = div.querySelector('input[name="src"]');
        if (fileInput && srcInput) {
            fileInput.addEventListener('change', async function() {
                if (!this.files || !this.files[0]) return;
                const formData = new FormData();
                formData.append('file', this.files[0]);
                srcInput.disabled = true;
                srcInput.value = 'Subiendo...';
                try {
                    const resp = await fetch('api/save-multimedia-file.php', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await resp.json();
                    if (data.success && data.url) {
                        srcInput.value = data.url;
                    } else {
                        srcInput.value = '';
                        alert('Error al subir el archivo: ' + (data.message || 'Error desconocido'));
                    }
                } catch (err) {
                    srcInput.value = '';
                    alert('Error de red al subir el archivo');
                }
                srcInput.disabled = false;
            });
        }
        list.appendChild(div);
    }

    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
});
