// Get CSRF token from meta tag
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.content || '';

document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...

    // Save AFCON Settings (kept for backward compatibility, handled by afcon-admin.js)
    const afconForm = document.getElementById('form-afcon');
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

// Site Config and config loading functions removed

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
