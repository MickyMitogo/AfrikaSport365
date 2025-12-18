document.addEventListener('DOMContentLoaded', function() {
    // Load current configuration
    loadConfig();
    loadAfconData();

    // Save General Settings
    document.getElementById('generalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        fetch('api/save-config.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                showMessage('Settings saved successfully!', 'success');
            } else {
                showMessage('Error saving settings: ' + data.message, 'error');
            }
        })
        .catch(error => {
            showMessage('Error: ' + error, 'error');
        });
    });

    // Save AFCON Settings
    document.getElementById('afconForm').addEventListener('submit', function(e) {
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
});

function loadConfig() {
    fetch('api/get-config.php')
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                document.getElementById('siteTitle').value = data.config.site_title || '';
                document.getElementById('siteDescription').value = data.config.site_description || '';
                document.getElementById('contactEmail').value = data.config.contact_email || '';
                document.getElementById('analyticsCode').value = data.config.analytics_code || '';
            }
        })
        .catch(error => console.error('Error loading config:', error));
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
