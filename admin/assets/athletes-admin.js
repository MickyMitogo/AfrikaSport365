// athletes-admin.js
// Maneja el formulario de Perfiles de Atleta en el panel admin

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-athletes');
    const list = document.getElementById('athletes-list');
    const addBtn = document.getElementById('add-athlete');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

    if (!form || !list || !addBtn) return;

    // Cargar atletas existentes
    fetch('api/get-athletes.php')
        .then(r => r.json())
        .then(items => renderList(items));

    // Agregar nuevo atleta
    addBtn.addEventListener('click', function() {
        addItem({ nombre: '', titulo: '', imagen: '', imagenAlt: '', badge: '', badgeColor: '', stats: [] });
    });

    // Guardar cambios
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const items = Array.from(list.querySelectorAll('.athlete-item')).map(item => {
            const stats = Array.from(item.querySelectorAll('.stat-row')).map(row => ({
                valor: row.querySelector('input[name="valor"]').value.trim(),
                etiqueta: row.querySelector('input[name="etiqueta"]').value.trim()
            })).filter(s => s.valor && s.etiqueta);
            return {
                nombre: item.querySelector('input[name="nombre"]').value.trim(),
                titulo: item.querySelector('input[name="titulo"]').value.trim(),
                imagen: item.querySelector('input[name="imagen"]').value.trim(),
                imagenAlt: item.querySelector('input[name="imagenAlt"]').value.trim(),
                badge: item.querySelector('input[name="badge"]').value.trim(),
                badgeColor: item.querySelector('input[name="badgeColor"]').value.trim(),
                stats
            };
        }).filter(a => a.nombre && a.titulo && a.imagen && a.badge);
        fetch('api/save-athletes.php', {
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
                showMessage('Perfiles guardados', 'success');
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
        div.className = 'athlete-item';
        div.style.marginBottom = '24px';
        div.innerHTML = `
            <input name="nombre" type="text" placeholder="Nombre" value="${data.nombre || ''}" required>
            <input name="titulo" type="text" placeholder="Título/Descripción" value="${data.titulo || ''}" required>
            <input name="imagen" type="text" placeholder="URL de imagen" value="${data.imagen || ''}" required>
            <input name="imagenAlt" type="text" placeholder="Texto alternativo imagen" value="${data.imagenAlt || ''}">
            <input name="badge" type="text" placeholder="Badge (deporte)" value="${data.badge || ''}" required>
            <input name="badgeColor" type="text" placeholder="Color badge (ej: #2563eb)" value="${data.badgeColor || ''}">
            <div class="stats-list"></div>
            <button type="button" class="btn" style="margin:8px 0" onclick="this.parentNode.querySelector('.stats-list').appendChild(createStatRow())">Añadir estadística</button>
            <button type="button" class="btn remove" style="margin-left:8px">Eliminar Atleta</button>
        `;
        // Render stats
        const statsList = div.querySelector('.stats-list');
        (data.stats || []).forEach(stat => statsList.appendChild(createStatRow(stat)));
        // Añadir funcionalidad para eliminar atleta
        div.querySelector('.remove').addEventListener('click', function() {
            div.remove();
        });
        list.appendChild(div);
    }

    // Crear fila de estadística
    window.createStatRow = function(stat = {}) {
        const row = document.createElement('div');
        row.className = 'stat-row';
        row.style.display = 'flex';
        row.style.gap = '8px';
        row.style.margin = '4px 0';
        row.innerHTML = `
            <input name="valor" type="text" placeholder="Valor" value="${stat.valor || ''}" style="width:80px" required>
            <input name="etiqueta" type="text" placeholder="Etiqueta" value="${stat.etiqueta || ''}" required>
            <button type="button" class="btn remove-stat">Eliminar</button>
        `;
        row.querySelector('.remove-stat').addEventListener('click', function() {
            row.remove();
        });
        return row;
    }
});
