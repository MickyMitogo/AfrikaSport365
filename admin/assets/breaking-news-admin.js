// breaking-news-admin.js
// Maneja el formulario de Breaking News en el panel admin

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-breaking-news');
    const list = document.getElementById('breaking-list');
    const addBtn = document.getElementById('add-breaking');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

    // Cargar noticias existentes
    fetch('api/get-breaking-news.php')
        .then(r => r.json())
        .then(items => renderList(items));

    // Agregar nueva noticia
    addBtn.addEventListener('click', function() {
        addItem('');
    });

    // Guardar cambios
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const items = Array.from(list.querySelectorAll('input[type="text"]'))
            .map(input => input.value.trim())
            .filter(Boolean);
        fetch('api/save-breaking-news.php', {
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
                showMessage('Breaking news guardadas', 'success');
            } else {
                showMessage('Error al guardar: ' + data.message, 'error');
            }
        })
        .catch(() => showMessage('Error de red', 'error'));
    });

    function renderList(items) {
        list.innerHTML = '';
        (items || []).forEach(addItem);
    }
    function addItem(text) {
        const div = document.createElement('div');
        div.className = 'breaking-item';
        div.innerHTML = `<input type="text" value="${text || ''}" class="breaking-input" style="width:80%"> <button type="button" class="btn btn-danger btn-sm">Eliminar</button>`;
        div.querySelector('button').onclick = function() {
            div.remove();
        };
        list.appendChild(div);
    }
    function showMessage(msg, type) {
        const el = document.createElement('div');
        el.className = 'message ' + type;
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2500);
    }
});
