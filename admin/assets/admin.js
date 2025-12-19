// Get CSRF token from meta tag
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.content || '';

document.addEventListener('DOMContentLoaded', function() {
    // Load current configuration
    loadConfig();
    loadAfconData();

    // Save Site Config Settings
    const siteConfigForm = document.getElementById('form-site-config');
    if (siteConfigForm) {
        siteConfigForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            // Build the payload object matching the expected structure
            const payload = {
                siteInfo: {
                    name: formData.get('siteInfo.name') || '',
                    tagline: formData.get('siteInfo.tagline') || '',
                    logo: formData.get('siteInfo.logo') || ''
                },
                hero: {
                    badge: formData.get('hero.badge') || '',
                    title: formData.get('hero.title') || '',
                    excerpt: formData.get('hero.excerpt') || '',
                    backgroundImage: formData.get('hero.backgroundImage') || '',
                    ctaText: formData.get('hero.ctaText') || '',
                    ctaLink: formData.get('hero.ctaLink') || '',
                    meta: {
                        date: formData.get('hero.meta.date') || '',
                        author: formData.get('hero.meta.author') || '',
                        readTime: formData.get('hero.meta.readTime') || ''
                    }
                },
                aboutSection: {
                    icon: formData.get('aboutSection.icon') || '',
                    title: formData.get('aboutSection.title') || '',
                    description: formData.get('aboutSection.description') || '',
                    stats: [
                        {
                            value: formData.get('aboutSection.stats.0.value') || '',
                            label: formData.get('aboutSection.stats.0.label') || ''
                        },
                        {
                            value: formData.get('aboutSection.stats.1.value') || '',
                            label: formData.get('aboutSection.stats.1.label') || ''
                        },
                        {
                            value: formData.get('aboutSection.stats.2.value') || '',
                            label: formData.get('aboutSection.stats.2.label') || ''
                        }
                    ].filter(stat => stat.value && stat.label)
                }
            };
            
            fetch('api/save-config.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': CSRF_TOKEN
                },
                body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    showMessage('Settings saved successfully!', 'success');
                    loadConfig();
                } else {
                    showMessage('Error saving settings: ' + data.message, 'error');
                }
            })
            .catch(error => {
                showMessage('Error: ' + error, 'error');
            });
        });
    }

    // Save AFCON Settings (kept for backward compatibility, handled by afcon-admin.js)
    const afconForm = document.getElementById('afconForm');
    if (afconForm) {
        afconForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            fetch('api/save-afcon.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    showMessage('AFCON settings saved successfully!', 'success');
                } else {
                    showMessage('Error saving settings: ' + data.message, 'error');
                }
            })
            .catch(error => {
                showMessage('Error: ' + error, 'error');
            });
        });
    }
});

function loadConfig() {
    fetch('api/get-config.php', {
        headers: {
            'X-CSRF-Token': CSRF_TOKEN
        }
    })
        .then(response => response.json())
        .then(data => {
            if(data) {
                // Load siteInfo fields
                setValue('siteInfo.name', data.siteInfo?.name);
                setValue('siteInfo.tagline', data.siteInfo?.tagline);
                setValue('siteInfo.logo', data.siteInfo?.logo);
                
                // Load hero fields
                setValue('hero.badge', data.hero?.badge);
                setValue('hero.title', data.hero?.title);
                setValue('hero.excerpt', data.hero?.excerpt);
                setValue('hero.backgroundImage', data.hero?.backgroundImage);
                setValue('hero.ctaText', data.hero?.ctaText);
                setValue('hero.ctaLink', data.hero?.ctaLink);
                setValue('hero.meta.date', data.hero?.meta?.date);
                setValue('hero.meta.author', data.hero?.meta?.author);
                setValue('hero.meta.readTime', data.hero?.meta?.readTime);
                
                // Load aboutSection fields
                setValue('aboutSection.icon', data.aboutSection?.icon);
                setValue('aboutSection.title', data.aboutSection?.title);
                setValue('aboutSection.description', data.aboutSection?.description);
                
                // Load stats
                if (data.aboutSection?.stats && Array.isArray(data.aboutSection.stats)) {
                    data.aboutSection.stats.forEach((stat, index) => {
                        if (index < 3) {
                            setValue(`aboutSection.stats.${index}.value`, stat.value);
                            setValue(`aboutSection.stats.${index}.label`, stat.label);
                        }
                    });
                }
            }
        })
        .catch(error => console.error('Error loading config:', error));
}

function setValue(name, value) {
    const input = document.querySelector(`[name="${name}"]`);
    if (input && value !== undefined && value !== null) {
        input.value = value;
    }
}

function loadAfconData() {
    fetch('api/get-afcon.php')
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                document.getElementById('afconYear').value = data.afcon.year || '';
                document.getElementById('afconHost').value = data.afcon.host_country || '';
                document.getElementById('afconStartDate').value = data.afcon.start_date || '';
                document.getElementById('afconEndDate').value = data.afcon.end_date || '';
                document.getElementById('afconStatus').value = data.afcon.status || 'upcoming';
            }
        })
        .catch(error => console.error('Error loading AFCON data:', error));
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
