/**
 * Admin Dashboard Core
 * Handles tabs, notifications, and common utilities
 */

// Tab switching
document.querySelectorAll('.tablink').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('disabled')) return;
    
    const tabId = btn.dataset.tab;
    
    // Update tab buttons
    document.querySelectorAll('.tablink').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) targetTab.classList.add('active');
  });
});

// Notification system
function showNotice(message, type = 'info') {
  const notice = document.getElementById('notice');
  if (!notice) return;
  
  notice.textContent = message;
  notice.className = 'notice';
  
  if (type === 'success') notice.style.background = '#1e4d3a';
  else if (type === 'error') notice.style.background = '#4d1e1e';
  else notice.style.background = '#1e3a4d';
  
  notice.hidden = false;
  
  setTimeout(() => {
    notice.hidden = true;
  }, 5000);
}

// Make showNotice available globally
window.showNotice = showNotice;

// Preview dialog handling
const previewDialog = document.getElementById('preview-dialog');
const previewPre = document.getElementById('preview-json');
const closePreviewBtn = document.getElementById('close-preview');

document.querySelectorAll('[data-preview]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const type = btn.dataset.preview;
    let data = null;
    
    try {
      if (type === 'config') {
        const res = await fetch('api/get-config.php');
        data = await res.json();
      } else if (type === 'afcon') {
        const res = await fetch('api/get-afcon.php');
        data = await res.json();
      } else if (type === 'articles') {
        const res = await fetch('api/get-articles.php');
        data = await res.json();
      }
      
      if (data) {
        previewPre.textContent = JSON.stringify(data, null, 2);
        previewDialog.showModal();
      }
    } catch (err) {
      showNotice('Error loading preview: ' + err.message, 'error');
    }
  });
});

closePreviewBtn?.addEventListener('click', () => {
  previewDialog.close();
});

previewDialog?.addEventListener('click', (e) => {
  if (e.target === previewDialog) {
    previewDialog.close();
  }
});

// Site Config form handling
const formSiteConfig = document.getElementById('form-site-config');
if (formSiteConfig) {
  loadSiteConfig();
  
  formSiteConfig.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formSiteConfig);
    const data = {};
    
    // Build nested object from dot notation
    formData.forEach((value, key) => {
      const keys = key.split('.');
      let current = data;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!current[k]) current[k] = {};
        current = current[k];
      }
      
      current[keys[keys.length - 1]] = value;
    });
    
    try {
      const res = await fetch('api/save-config.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to save');
      
      showNotice('Site config saved successfully!', 'success');
    } catch (err) {
      showNotice('Error: ' + err.message, 'error');
    }
  });
}

async function loadSiteConfig() {
  try {
    const res = await fetch('api/get-config.php');
    const data = await res.json();
    
    if (!data) return;
    
    // Populate form fields using dot notation
    const form = formSiteConfig;
    
    function setFormValue(obj, prefix = '') {
      for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const input = form.querySelector(`[name="${fullKey}"]`);
        
        if (input) {
          input.value = obj[key] || '';
        } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          setFormValue(obj[key], fullKey);
        } else if (Array.isArray(obj[key])) {
          obj[key].forEach((item, index) => {
            if (typeof item === 'object') {
              setFormValue(item, `${fullKey}.${index}`);
            }
          });
        }
      }
    }
    
    setFormValue(data);
  } catch (err) {
    console.error('Error loading site config:', err);
  }
}

// Breaking News form handling
const formBreakingNews = document.getElementById('form-breaking-news');
const breakingList = document.getElementById('breaking-list');
const addBreakingBtn = document.getElementById('add-breaking');

let breakingData = { breakingNews: [] };

if (formBreakingNews) {
  loadBreakingNews();
  
  addBreakingBtn?.addEventListener('click', () => {
    breakingData.breakingNews.push({ text: '', link: '', isActive: true });
    renderBreakingList();
  });
  
  breakingList?.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remove')) {
      const index = parseInt(e.target.dataset.index, 10);
      breakingData.breakingNews.splice(index, 1);
      renderBreakingList();
    }
  });
  
  formBreakingNews.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Collect data from inputs
    const items = breakingList.querySelectorAll('.list-item');
    breakingData.breakingNews = Array.from(items).map(item => ({
      text: item.querySelector('[name="text"]').value,
      link: item.querySelector('[name="link"]').value,
      isActive: item.querySelector('[name="isActive"]').checked
    }));
    
    // Merge with existing config
    try {
      const configRes = await fetch('api/get-config.php');
      const fullConfig = await configRes.json();
      fullConfig.breakingNews = breakingData.breakingNews;
      
      const res = await fetch('api/save-config.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullConfig)
      });
      
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to save');
      
      showNotice('Breaking news saved successfully!', 'success');
    } catch (err) {
      showNotice('Error: ' + err.message, 'error');
    }
  });
}

async function loadBreakingNews() {
  try {
    const res = await fetch('api/get-config.php');
    const data = await res.json();
    breakingData.breakingNews = data.breakingNews || [];
    renderBreakingList();
  } catch (err) {
    console.error('Error loading breaking news:', err);
  }
}

function renderBreakingList() {
  if (!breakingList) return;
  
  breakingList.innerHTML = '';
  
  breakingData.breakingNews.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
      <input type="text" name="text" placeholder="Breaking news text" value="${escapeHtml(item.text)}" required>
      <input type="text" name="link" placeholder="Link URL" value="${escapeHtml(item.link)}">
      <label style="display:flex;align-items:center;gap:6px">
        <input type="checkbox" name="isActive" ${item.isActive ? 'checked' : ''}>
        Active
      </label>
      <button type="button" class="btn btn-remove" data-index="${index}">Remove</button>
    `;
    breakingList.appendChild(div);
  });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
