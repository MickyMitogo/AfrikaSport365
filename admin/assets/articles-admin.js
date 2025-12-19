/**
 * Articles Management
 * Manages article CRUD operations in the admin dashboard
 */

(() => {
  const form = document.getElementById('form-articles');
  const listContainer = document.getElementById('articles-list');
  const addBtn = document.getElementById('add-article');
  const countSpan = document.getElementById('articles-count');
  
  let articlesData = { articles: [] };
  let articleIdCounter = Date.now();

  // Get CSRF token from meta tag
  function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
  }

  // Load articles from API
  async function loadArticles() {
    try {
      const res = await fetch('api/get-articles.php', {
        headers: {
          'X-CSRF-Token': getCsrfToken()
        }
      });
      if (!res.ok) throw new Error('Failed to load articles');
      articlesData = await res.json();
      if (!articlesData.articles) articlesData.articles = [];
      renderArticles();
      updateCount();
    } catch (err) {
      console.error(err);
      showNotice('Error loading articles: ' + err.message, 'error');
    }
  }

  // Render all articles
  function renderArticles() {
    listContainer.innerHTML = '';
    
    if (articlesData.articles.length === 0) {
      listContainer.innerHTML = '<p style="color:#666;text-align:center;padding:40px">No articles yet. Click "Add New Article" to create one.</p>';
      return;
    }

    articlesData.articles.forEach((article, index) => {
      const card = createArticleCard(article, index);
      listContainer.appendChild(card);
    });
  }

  // Create article card
  function createArticleCard(article, index) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.dataset.index = index;
    
    const heroImage = article.heroImage || 'images/placeholder.jpg';
    const dateDisplay = article.dateDisplay || formatDate(article.date) || 'No date';
    const category = article.category || 'Sin categoría';
    const categoryColor = article.categoryColor || '#666';
    
    card.innerHTML = `
      <div class="article-card-header">
        <img src="../${heroImage}" alt="${escapeHtml(article.title)}" onerror="this.src='../images/placeholder.jpg'">
        <button type="button" class="btn-remove" data-index="${index}" title="Delete article">×</button>
      </div>
      <div class="article-card-body">
        <div class="article-card-meta">
          <span class="article-category" style="background:${categoryColor}">${escapeHtml(category)}</span>
          <span class="article-date">${escapeHtml(dateDisplay)}</span>
        </div>
        <h3 class="article-card-title">${escapeHtml(article.title)}</h3>
        <p class="article-card-excerpt">${escapeHtml(article.excerpt || 'No excerpt').substring(0, 120)}...</p>
        <div class="article-card-footer">
          <span class="article-id">ID: ${escapeHtml(article.id)}</span>
          <button type="button" class="btn btn-edit" data-index="${index}">Edit</button>
        </div>
      </div>
    `;
    
    return card;
  }

  // Add new article
  function addArticle() {
    const newArticle = {
      id: generateUniqueId(),
      slug: '',
      title: 'New Article',
      subtitle: '',
      category: 'Fútbol',
      categoryColor: '#ef4444',
      author: '',
      authorImage: '',
      date: new Date().toISOString(),
      dateDisplay: formatDate(new Date().toISOString()),
      heroImage: 'images/placeholder.jpg',
      excerpt: '',
      content: []
    };
    
    articlesData.articles.unshift(newArticle);
    renderArticles();
    updateCount();
    
    // Open editor for new article
    setTimeout(() => editArticle(0), 100);
  }

  // Edit article
  function editArticle(index) {
    const article = articlesData.articles[index];
    if (!article) return;
    
    const dialog = createEditorDialog(article, index);
    document.body.appendChild(dialog);
    dialog.showModal();
  }

  // Create editor dialog
  function createEditorDialog(article, index) {
    const dialog = document.createElement('dialog');
    dialog.className = 'article-editor-dialog';
    
    const contentPreview = article.content && article.content.length > 0 
      ? `${article.content.length} content blocks` 
      : 'No content blocks';
    
    dialog.innerHTML = `
      <div class="dialog-content article-editor">
        <div class="dialog-header">
          <h3>Edit Article</h3>
          <button type="button" class="btn-close">×</button>
        </div>
        <form class="article-form">
          <div class="form-grid">
            <div class="form-section">
              <h4>Basic Information</h4>
              <label>
                ID <small>(unique identifier)</small>
                <input type="text" name="id" value="${escapeHtml(article.id)}" required>
              </label>
              <label>
                Slug <small>(URL-friendly version)</small>
                <input type="text" name="slug" value="${escapeHtml(article.slug)}" required>
              </label>
              <label>
                Title
                <input type="text" name="title" value="${escapeHtml(article.title)}" required>
              </label>
              <label>
                Subtitle <small>(optional)</small>
                <input type="text" name="subtitle" value="${escapeHtml(article.subtitle || '')}">
              </label>
              <label>
                Excerpt
                <textarea name="excerpt" rows="3" required>${escapeHtml(article.excerpt || '')}</textarea>
              </label>
            </div>
            
            <div class="form-section">
              <h4>Category & Author</h4>
              <label>
                Category
                <input type="text" name="category" value="${escapeHtml(article.category || 'Fútbol')}" required>
              </label>
              <label>
                Category Color
                <input type="color" name="categoryColor" value="${article.categoryColor || '#ef4444'}">
              </label>
              <label>
                Author
                <input type="text" name="author" value="${escapeHtml(article.author || '')}">
              </label>
              <label>
                Author Image URL
                <input type="text" name="authorImage" value="${escapeHtml(article.authorImage || '')}">
              </label>
            </div>
            
            <div class="form-section">
              <h4>Media & Dates</h4>
              <label>
                Hero Image URL
                <input type="text" name="heroImage" value="${escapeHtml(article.heroImage || '')}" required>
              </label>
              <label>
                Date (ISO format)
                <input type="datetime-local" name="date" value="${formatDateTimeLocal(article.date)}" required>
              </label>
              <label>
                Date Display <small>(as shown to users)</small>
                <input type="text" name="dateDisplay" value="${escapeHtml(article.dateDisplay || '')}" placeholder="e.g., 15 de enero, 2025">
              </label>
            </div>
            
            <div class="form-section">
              <h4>Content</h4>
              <div class="content-info">
                <p><strong>Content blocks:</strong> ${contentPreview}</p>
                <p style="color:#666;font-size:12px">
                  Note: Content editing is advanced. Modify content blocks in the JSON preview or edit articles.json directly.
                </p>
              </div>
            </div>
          </div>
          
          <div class="dialog-actions">
            <button type="button" class="btn btn-cancel">Cancel</button>
            <button type="submit" class="btn primary">Save Changes</button>
          </div>
        </form>
      </div>
    `;
    
    // Handle form submission
    const editorForm = dialog.querySelector('.article-form');
    editorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(editorForm);
      
      // Update article with form data
      article.id = formData.get('id').trim();
      article.slug = formData.get('slug').trim();
      article.title = formData.get('title').trim();
      article.subtitle = formData.get('subtitle').trim();
      article.category = formData.get('category').trim();
      article.categoryColor = formData.get('categoryColor');
      article.author = formData.get('author').trim();
      article.authorImage = formData.get('authorImage').trim();
      article.heroImage = formData.get('heroImage').trim();
      article.excerpt = formData.get('excerpt').trim();
      article.dateDisplay = formData.get('dateDisplay').trim();
      
      // Convert datetime-local to ISO
      const dateValue = formData.get('date');
      if (dateValue) {
        article.date = new Date(dateValue).toISOString();
      }
      
      // Check for duplicate ID/slug
      const isDuplicateId = articlesData.articles.some((a, i) => 
        i !== index && a.id === article.id
      );
      const isDuplicateSlug = articlesData.articles.some((a, i) => 
        i !== index && a.slug === article.slug
      );
      
      if (isDuplicateId) {
        alert('Error: Duplicate article ID. Please use a unique ID.');
        return;
      }
      
      if (isDuplicateSlug) {
        alert('Error: Duplicate article slug. Please use a unique slug.');
        return;
      }
      
      renderArticles();
      dialog.close();
      dialog.remove();
      showNotice('Article updated (remember to click "Save All Articles")', 'info');
    });
    
    // Handle close buttons
    dialog.querySelector('.btn-close').addEventListener('click', () => {
      dialog.close();
      dialog.remove();
    });
    
    dialog.querySelector('.btn-cancel').addEventListener('click', () => {
      dialog.close();
      dialog.remove();
    });
    
    return dialog;
  }

  // Delete article
  function deleteArticle(index) {
    const article = articlesData.articles[index];
    if (!article) return;
    
    if (confirm(`Delete article "${article.title}"?\nThis action cannot be undone until you save.`)) {
      articlesData.articles.splice(index, 1);
      renderArticles();
      updateCount();
      showNotice('Article marked for deletion (remember to click "Save All Articles")', 'info');
    }
  }

  // Update article count
  function updateCount() {
    countSpan.textContent = `${articlesData.articles.length} article${articlesData.articles.length !== 1 ? 's' : ''}`;
  }

  // Generate unique ID
  function generateUniqueId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    let baseId = `article-${timestamp}-${random}`;
    
    // Ensure it's unique
    let counter = 0;
    let uniqueId = baseId;
    while (articlesData.articles.some(a => a.id === uniqueId)) {
      counter++;
      uniqueId = `${baseId}-${counter}`;
    }
    
    return uniqueId;
  }

  // Format date for display
  function formatDate(isoDate) {
    if (!isoDate) return '';
    try {
      const date = new Date(isoDate);
      const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                     'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
    } catch {
      return '';
    }
  }

  // Format date for datetime-local input
  function formatDateTimeLocal(isoDate) {
    if (!isoDate) return '';
    try {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  }

  // Escape HTML
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Event listeners
  addBtn?.addEventListener('click', addArticle);

  listContainer?.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit');
    const removeBtn = e.target.closest('.btn-remove');
    
    if (editBtn) {
      const index = parseInt(editBtn.dataset.index, 10);
      editArticle(index);
    }
    
    if (removeBtn) {
      const index = parseInt(removeBtn.dataset.index, 10);
      deleteArticle(index);
    }
  });

  // Form submission
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate no duplicates before saving
    const ids = articlesData.articles.map(a => a.id);
    const slugs = articlesData.articles.map(a => a.slug);
    
    if (new Set(ids).size !== ids.length) {
      showNotice('Error: Duplicate article IDs detected. Please ensure all IDs are unique.', 'error');
      return;
    }
    
    if (new Set(slugs).size !== slugs.length) {
      showNotice('Error: Duplicate article slugs detected. Please ensure all slugs are unique.', 'error');
      return;
    }
    
    try {
      const res = await fetch('api/save-articles.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify(articlesData)
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save');
      }
      
      showNotice('Articles saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      showNotice('Error: ' + err.message, 'error');
    }
  });

  // Initialize
  loadArticles();
})();
