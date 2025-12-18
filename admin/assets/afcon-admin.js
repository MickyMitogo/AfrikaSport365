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
                if (!data || !data.afconSpotlight) return;
                
                const afcon = data.afconSpotlight;
                
                // Basic info
                setValue('afconSpotlight.title', afcon.title);
                setValue('afconSpotlight.subtitle', afcon.subtitle);
                setValue('afconSpotlight.logo', afcon.logo);
                
                // Group
                setValue('afconSpotlight.group.title', afcon.group?.title);
                
                // Next match
                setValue('afconSpotlight.nextMatch.home', afcon.nextMatch?.home);
                setValue('afconSpotlight.nextMatch.away', afcon.nextMatch?.away);
                setValue('afconSpotlight.nextMatch.date', afcon.nextMatch?.date);
                setValue('afconSpotlight.nextMatch.venue', afcon.nextMatch?.venue);
                setValue('afconSpotlight.nextMatch.time', afcon.nextMatch?.time);
                
                // Top scorer
                setValue('afconSpotlight.topScorer.name', afcon.topScorer?.name);
                setValue('afconSpotlight.topScorer.goals', afcon.topScorer?.goals);
                
                // CTA
                setValue('afconSpotlight.ctaText', afcon.ctaText);
                setValue('afconSpotlight.ctaLink', afcon.ctaLink);
                
                // Teams (repeatable)
                if (afcon.group?.teams && Array.isArray(afcon.group.teams)) {
                    const container = document.getElementById('standings-list');
                    container.innerHTML = '';
                    afcon.group.teams.forEach((team, index) => {
                        addStandingRow(team.name, team.points);
                    });
                }
            })
            .catch(err => console.error('Failed to load AFCON data:', err));
    }

    // Add standing row
    function addStandingRow(name = '', points = '') {
        const container = document.getElementById('standings-list');
        const index = container.children.length;
        
        if (index >= 4) {
            alert('Máximo 4 equipos permitidos');
            return;
        }
        
        const row = document.createElement('div');
        row.className = 'list-item';
        row.innerHTML = `
            <div style="display:grid;grid-template-columns:2fr 1fr auto;gap:8px;align-items:center">
                <input type="text" name="afconSpotlight.group.teams[${index}].name" placeholder="Team Name" value="${name}" required>
                <input type="text" name="afconSpotlight.group.teams[${index}].points" placeholder="e.g., 9 pts" value="${points}" required>
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
            afconSpotlight: {
                title: formData.get('afconSpotlight.title') || '',
                subtitle: formData.get('afconSpotlight.subtitle') || '',
                logo: formData.get('afconSpotlight.logo') || '',
                group: {
                    title: formData.get('afconSpotlight.group.title') || '',
                    teams: []
                },
                nextMatch: {
                    home: formData.get('afconSpotlight.nextMatch.home') || '',
                    away: formData.get('afconSpotlight.nextMatch.away') || '',
                    date: formData.get('afconSpotlight.nextMatch.date') || '',
                    venue: formData.get('afconSpotlight.nextMatch.venue') || '',
                    time: formData.get('afconSpotlight.nextMatch.time') || ''
                },
                topScorer: {
                    name: formData.get('afconSpotlight.topScorer.name') || '',
                    goals: formData.get('afconSpotlight.topScorer.goals') || ''
                },
                ctaText: formData.get('afconSpotlight.ctaText') || '',
                ctaLink: formData.get('afconSpotlight.ctaLink') || ''
            }
        };
        
        // Collect teams
        const container = document.getElementById('standings-list');
        container.querySelectorAll('.list-item').forEach((item, index) => {
            const nameInput = item.querySelector(`input[name="afconSpotlight.group.teams[${index}].name"]`);
            const pointsInput = item.querySelector(`input[name="afconSpotlight.group.teams[${index}].points"]`);
            
            if (nameInput && nameInput.value) {
                payload.afconSpotlight.group.teams.push({
                    name: nameInput.value,
                    points: pointsInput?.value || '0 pts'
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
                showNotice('AFCON spotlight saved successfully!', 'success');
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

})();
