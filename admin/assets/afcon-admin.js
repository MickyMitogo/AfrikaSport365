/**
 * AfrikaSport365 Admin Panel JavaScript
 * Handles form submissions, data loading, and dynamic field management
 */

(function() {
    'use strict';

    const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.content || '';

    // ======================
    // TAB NAVIGATION
    // ======================
    document.querySelectorAll('.tablink').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('disabled')) return;
            
            const tabId = this.dataset.tab;
            
            // Update buttons
            document.querySelectorAll('.tablink').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update tabs
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.getElementById('tab-' + tabId)?.classList.add('active');
        });
    });

    // ======================
    // AFCON FORM LOGIC
    // ======================
    
    // Load AFCON data
    function loadAfconData() {
        fetch('api/get-afcon.php')
            .then(r => r.json())
            .then(data => {
                if (!data) return;
                
                // Tournament info
                setValue('tournament.name', data.tournament?.name);
                setValue('tournament.subtitle', data.tournament?.subtitle);
                setValue('tournament.logo', data.tournament?.logo);
                
                // Next match
                setValue('nextMatch.teams', data.nextMatch?.teams);
                setValue('nextMatch.date', data.nextMatch?.date);
                setValue('nextMatch.venue', data.nextMatch?.venue);
                setValue('nextMatch.time', data.nextMatch?.time);
                
                // Top scorer
                setValue('topScorer.name', data.topScorer?.name);
                setValue('topScorer.stats', data.topScorer?.stats);
                setValue('topScorer.image', data.topScorer?.image);
                
                // Standings (repeatable)
                if (data.standings && Array.isArray(data.standings)) {
                    const container = document.getElementById('standings-list');
                    container.innerHTML = '';
                    data.standings.forEach((team, index) => {
                        addStandingRow(team.name, team.points);
                    });
                }
            })
            .catch(err => console.error('Failed to load AFCON data:', err));
    }

    // Add standing row
    function addStandingRow(name = '', points = 0) {
        const container = document.getElementById('standings-list');
        const index = container.children.length;
        
        const row = document.createElement('div');
        row.className = 'list-item';
        row.innerHTML = `
            <div style="display:grid;grid-template-columns:2fr 1fr auto;gap:8px;align-items:center">
                <input type="text" name="standings[${index}].name" placeholder="Team Name" value="${name}" required>
                <input type="number" name="standings[${index}].points" placeholder="Points" value="${points}" min="0" max="999" required>
                <button type="button" class="btn-remove" onclick="this.closest('.list-item').remove()">✕</button>
            </div>
        `;
        container.appendChild(row);
    }

    // Add standing button
    document.getElementById('add-standing')?.addEventListener('click', () => addStandingRow());

    // Submit AFCON form
    document.getElementById('form-afcon')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const payload = {
            tournament: {
                name: formData.get('tournament.name') || '',
                subtitle: formData.get('tournament.subtitle') || '',
                logo: formData.get('tournament.logo') || ''
            },
            standings: [],
            nextMatch: {
                teams: formData.get('nextMatch.teams') || '',
                date: formData.get('nextMatch.date') || '',
                venue: formData.get('nextMatch.venue') || '',
                time: formData.get('nextMatch.time') || ''
            },
            topScorer: {
                name: formData.get('topScorer.name') || '',
                stats: formData.get('topScorer.stats') || '',
                image: formData.get('topScorer.image') || ''
            }
        };
        
        // Collect standings
        const container = document.getElementById('standings-list');
        container.querySelectorAll('.list-item').forEach((item, index) => {
            const nameInput = item.querySelector(`input[name="standings[${index}].name"]`);
            const pointsInput = item.querySelector(`input[name="standings[${index}].points"]`);
            
            if (nameInput && nameInput.value) {
                payload.standings.push({
                    name: nameInput.value,
                    points: parseInt(pointsInput?.value || 0, 10)
                });
            }
        });
        
        try {
            const response = await fetch('api/save-afcon.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': CSRF_TOKEN
                },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotice('AFCON data saved successfully!', 'success');
            } else {
                showNotice('Error: ' + (result.message || 'Save failed'), 'error');
            }
        } catch (error) {
            showNotice('Network error: ' + error.message, 'error');
        }
    });

    // ======================
    // HELPER FUNCTIONS
    // ======================
    
    function setValue(name, value) {
        const input = document.querySelector(`[name="${name}"]`);
        if (input && value !== undefined && value !== null) {
            input.value = value;
        }
    }
    
    function showNotice(message, type = 'info') {
        const notice = document.getElementById('notice');
        if (!notice) return;
        
        notice.textContent = message;
        notice.className = 'notice ' + type;
        notice.hidden = false;
        
        setTimeout(() => {
            notice.hidden = true;
        }, 5000);
    }

    // ======================
    // PREVIEW FUNCTIONALITY
    // ======================
    
    document.querySelectorAll('[data-preview]').forEach(btn => {
        btn.addEventListener('click', function() {
            const formId = 'form-' + this.dataset.preview;
            const form = document.getElementById(formId);
            if (!form) return;
            
            const formData = new FormData(form);
            const obj = {};
            
            for (let [key, value] of formData.entries()) {
                setNestedProperty(obj, key, value);
            }
            
            const dialog = document.getElementById('preview-dialog');
            const pre = document.getElementById('preview-json');
            if (dialog && pre) {
                pre.textContent = JSON.stringify(obj, null, 2);
                dialog.showModal?.() || (dialog.style.display = 'block');
            }
        });
    });
    
    document.getElementById('close-preview')?.addEventListener('click', function() {
        const dialog = document.getElementById('preview-dialog');
        dialog.close?.() || (dialog.style.display = 'none');
    });
    
    function setNestedProperty(obj, path, value) {
        const parts = path.split('.');
        let current = obj;
        
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part]) current[part] = {};
            current = current[part];
        }
        
        current[parts[parts.length - 1]] = value;
    }

    // ======================
    // INITIALIZATION
    // ======================
    
    // Load data on page load
    loadAfconData();

    // ======================
    // LATEST NEWS FORM LOGIC
    // ======================

    // Load latest news data
    function loadLatestNews() {
        fetch('api/get-latest-news.php', {
            headers: { 'X-CSRF-Token': CSRF_TOKEN }
        })
        .then(r => r.json())
        .then(data => {
            if (!data || !data.latestNews) return;
            
            const container = document.getElementById('latest-news-list');
            container.innerHTML = '';
            
            data.latestNews.forEach((item, index) => {
                addNewsRow(item, index);
            });
        })
        .catch(err => console.error('Failed to load latest news:', err));
    }

    // Add news row
    function addNewsRow(item = {}, index = null) {
        const container = document.getElementById('latest-news-list');
        const idx = index !== null ? index : container.children.length;
        const row = document.createElement('div');
        row.className = 'list-item';
        row.style.display = 'grid';
        row.style.gap = '10px';
        row.style.padding = '12px';
        row.style.background = 'var(--card)';
        row.style.border = '1px solid var(--border)';
        row.style.borderRadius = '6px';
        row.style.marginBottom = '10px';
        const itemId = item.id || (Date.now() + Math.random());
        row.innerHTML = `
            <input type="hidden" name="news[${idx}].id" value="${itemId}">
            <div style="display:grid;grid-template-columns:1fr 1fr 40px;gap:8px;align-items:center">
                <input type="text" name="news[${idx}].title" placeholder="Title" value="${item.title || ''}" required>
                <input type="text" name="news[${idx}].category" placeholder="Category (e.g., FÚTBOL)" value="${item.category || ''}" required>
                <input type="color" name="news[${idx}].categoryColor" value="${item.categoryColor || '#2563eb'}" title="Category Color" style="width:32px;height:32px;padding:0;border:none;background:none;">
            </div>
            <textarea name="news[${idx}].excerpt" placeholder="Excerpt (brief description)" rows="2" required>${item.excerpt || ''}</textarea>
            <div style="display:grid;grid-template-columns:2fr 1fr;gap:8px">
                <input type="text" name="news[${idx}].image" placeholder="Image URL (e.g., images/photo.jpg)" value="${item.image || ''}" required>
                <input type="text" name="news[${idx}].imageAlt" placeholder="Image alt text" value="${item.imageAlt || ''}">
            </div>
            <div style="display:grid;grid-template-columns:2fr 1fr;gap:8px">
                <input type="text" name="news[${idx}].slug" placeholder="Article slug (URL)" value="${item.slug || ''}" required>
                <input type="number" name="news[${idx}].order" placeholder="Order" value="${item.order || idx + 1}" min="1" style="width:80px">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
                <input type="text" name="news[${idx}].meta.author" placeholder="Author name" value="${item.meta?.author || ''}" required>
                <input type="text" name="news[${idx}].meta.time" placeholder="Time (e.g., Hace 2 horas)" value="${item.meta?.time || ''}" required>
                <input type="number" name="news[${idx}].meta.comments" placeholder="Comments" value="${item.meta?.comments || 0}" min="0" max="9999">
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center">
                <label style="display:flex;align-items:center;gap:6px;margin:0">
                    <input type="checkbox" name="news[${idx}].featured" ${item.featured ? 'checked' : ''}>
                    <span>Featured (large card)</span>
                </label>
                <div style="display:flex;gap:6px">
                  <button type="button" class="btn secondary btn-move-up" title="Move Up" style="padding:6px 10px">▲</button>
                  <button type="button" class="btn secondary btn-move-down" title="Move Down" style="padding:6px 10px">▼</button>
                  <button type="button" class="btn danger btn-remove" style="padding:6px 12px">Remove</button>
                </div>
            </div>
        `;
        row.querySelector('.btn-remove').onclick = function() {
            row.remove();
        };
        row.querySelector('.btn-move-up').onclick = function() {
            if (row.previousElementSibling) {
                container.insertBefore(row, row.previousElementSibling);
                updateNewsOrderInputs();
            }
        };
        row.querySelector('.btn-move-down').onclick = function() {
            if (row.nextElementSibling) {
                container.insertBefore(row.nextElementSibling, row);
                updateNewsOrderInputs();
            }
        };
        container.appendChild(row);
        updateNewsOrderInputs();
    }

    function updateNewsOrderInputs() {
        const container = document.getElementById('latest-news-list');
        Array.from(container.children).forEach((row, i) => {
            const orderInput = row.querySelector('input[name^="news["][name$=".order"]');
            if (orderInput) orderInput.value = i + 1;
        });
    }

    // Add news item button
    document.getElementById('add-news-item')?.addEventListener('click', () => addNewsRow());

    // Submit latest news form
    document.getElementById('form-latest-news')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const newsItems = [];
        const newsMap = {};
        for (let [key, value] of formData.entries()) {
            const match = key.match(/^news\[(\d+)\]\.(.+)$/);
            if (match) {
                const idx = match[1];
                const field = match[2];
                if (!newsMap[idx]) newsMap[idx] = {};
                if (field.includes('.')) {
                    const [parent, child] = field.split('.');
                    if (!newsMap[idx][parent]) newsMap[idx][parent] = {};
                    newsMap[idx][parent][child] = value;
                } else if (field === 'featured') {
                    newsMap[idx][field] = true;
                } else if (field === 'id') {
                    newsMap[idx][field] = parseInt(value) || (Date.now() + parseInt(idx));
                } else if (field === 'order') {
                    newsMap[idx][field] = parseInt(value) || (parseInt(idx) + 1);
                } else {
                    newsMap[idx][field] = value;
                }
            }
        }
        Object.keys(newsMap).forEach(idx => {
            const item = newsMap[idx];
            if (!item.featured) item.featured = false;
            if (!item.order) item.order = parseInt(idx) + 1;
            newsItems.push(item);
        });
        newsItems.sort((a, b) => a.order - b.order);
        const payload = { latestNews: newsItems };
        try {
            const response = await fetch('api/save-latest-news.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': CSRF_TOKEN
                },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.success) {
                showNotice('Latest news saved successfully!', 'success');
            } else {
                showNotice('Error: ' + (result.message || 'Save failed'), 'error');
            }
        } catch (err) {
            showNotice('Network error: ' + err.message, 'error');
        }
    });

    // Preview for latest news
    document.querySelector('[data-preview="latest-news"]')?.addEventListener('click', function() {
        const form = document.getElementById('form-latest-news');
        if (!form) return;
        const formData = new FormData(form);
        const newsMap = {};
        for (let [key, value] of formData.entries()) {
            const match = key.match(/^news\[(\d+)\]\.(.+)$/);
            if (match) {
                const idx = match[1];
                const field = match[2];
                if (!newsMap[idx]) newsMap[idx] = {};
                if (field.includes('.')) {
                    const [parent, child] = field.split('.');
                    if (!newsMap[idx][parent]) newsMap[idx][parent] = {};
                    newsMap[idx][parent][child] = value;
                } else if (field === 'featured') {
                    newsMap[idx][field] = true;
                } else if (field === 'id') {
                    newsMap[idx][field] = parseInt(value) || (Date.now() + parseInt(idx));
                } else if (field === 'order') {
                    newsMap[idx][field] = parseInt(value) || (parseInt(idx) + 1);
                } else {
                    newsMap[idx][field] = value;
                }
            }
        }
        const newsItems = Object.values(newsMap).map(item => {
            if (!item.featured) item.featured = false;
            if (!item.order) item.order = 1;
            return item;
        }).sort((a, b) => a.order - b.order);
        const previewObj = { latestNews: newsItems };
        const dialog = document.getElementById('preview-dialog');
        const pre = document.getElementById('preview-json');
        if (dialog && pre) {
            pre.textContent = JSON.stringify(previewObj, null, 2);
            dialog.showModal?.() || (dialog.style.display = 'block');
        }
    });

    // Load latest news on page load
    if (document.getElementById('form-latest-news')) {
        loadLatestNews();
    }

})();
