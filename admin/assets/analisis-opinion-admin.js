// analisis-opinion-admin.js
// Maneja el formulario de Análisis y Opinión en el panel admin

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-analisis-opinion');
    const list = document.getElementById('analisis-opinion-list');
    const addBtn = document.getElementById('add-analisis-opinion');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

    if (!form || !list || !addBtn) return;

    // Cargar artículos existentes
    fetch('api/get-analisis-opinion.php')
        .then(r => r.json())
        .then(items => renderList(items));

    // Agregar nuevo artículo
    addBtn.addEventListener('click', function() {
        addItem({ titulo: '', resumen: '', autor: '' });
    });

    // Guardar cambios
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const items = Array.from(list.querySelectorAll('.analisis-opinion-item')).map(item => {
            return {
                titulo: item.querySelector('input[name="titulo"]').value.trim(),
                resumen: item.querySelector('input[name="resumen"]').value.trim(),
                autor: item.querySelector('input[name="autor"]').value.trim()
            };
        }).filter(a => a.titulo && a.resumen && a.autor);
        fetch('api/save-analisis-opinion.php', {
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
                showMessage('Artículos guardados', 'success');
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
        div.className = 'analisis-opinion-item';
        div.innerHTML = `
            <input name="titulo" type="text" placeholder="Título" value="${data.titulo || ''}" required>
            <input name="resumen" type="text" placeholder="Resumen" value="${data.resumen || ''}" required>
            <input name="autor" type="text" placeholder="Autor" value="${data.autor || ''}" required>
            <input name="imagen" type="text" placeholder="URL de imagen (opcional)" value="${data.imagen || ''}">
            <input name="badge" type="text" placeholder="Badge (ej: OPINIÓN)" value="${data.badge || ''}">
            <button type="button" class="btn remove">Eliminar</button>
        `;
        div.querySelector('.remove').addEventListener('click', function() {
            div.remove();
        });
        list.appendChild(div);
    }
});
