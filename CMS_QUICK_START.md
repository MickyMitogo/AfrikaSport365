# 🚀 CMS QUICK START GUIDE

## For Content Managers (Future)

### What Can You Edit?

#### 1. **Hero Section** (Homepage Featured Story)
- **Location**: Homepage top section
- **Update frequency**: Weekly
- **Fields**:
  - Title
  - Description text
  - Background image
  - Article link
  - Date/Author/Read time

#### 2. **Breaking News Ticker**
- **Location**: Red bar below header
- **Update frequency**: Daily/Hourly
- **Fields**:
  - List of 4-8 news items
  - Auto-scrolls horizontally

#### 3. **About Us / Mission**
- **Location**: Homepage bottom section
- **Update frequency**: Monthly
- **Fields**:
  - Mission statement
  - 3 statistics (readers, sports, coverage)

#### 4. **AFCON Tournament Info**
- **Location**: AFCON page hero
- **Update frequency**: Once per tournament
- **Fields**:
  - Tournament name
  - Host country
  - Start/End dates
  - Official logo

#### 5. **Live Match Scores**
- **Location**: AFCON page live section
- **Update frequency**: Real-time during matches
- **Fields**:
  - Team names
  - Current score
  - Match minute
  - Venue
  - Commentary events

#### 6. **Group Standings**
- **Location**: AFCON page groups section
- **Update frequency**: After each match
- **Fields**:
  - All 6 groups (A-F)
  - Team statistics
  - Points, goals, position

#### 7. **News Articles** ✅ Already Working
- **Location**: Homepage & Article pages
- **Update frequency**: Daily
- **System**: JSON-based, slug routing
- **Status**: Fully functional

---

## For Developers (Phase 2)

### Admin Panel To-Do List

#### Essential Features
- [ ] Login page with authentication
- [ ] Dashboard with content sections
- [ ] Config editor (hero, breaking news, about)
- [ ] AFCON data editor (matches, standings)
- [ ] Image uploader
- [ ] Preview before save
- [ ] Logout function

#### File Structure
```
/admin/
  index.php           → Login page
  dashboard.php       → Main CMS interface
  logout.php          → Session destroy
  /api/
    save-config.php   → Update config.json
    save-afcon.php    → Update afcon-data.json
    upload.php        → Handle image uploads
  /assets/
    admin.css         → Admin panel styles
    admin.js          → Admin panel logic
```

#### PHP Session Setup
```php
<?php
session_start();

// Login check
if (!isset($_SESSION['admin_logged_in'])) {
  header('Location: index.php');
  exit();
}

// User info
$admin_user = $_SESSION['admin_username'];
?>
```

#### JSON Save Example
```php
<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
  http_response_code(401);
  exit('Unauthorized');
}

// Get POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
  http_response_code(400);
  exit('Invalid JSON');
}

// Save to file
$file = '../data/config.json';
$result = file_put_contents(
  $file, 
  json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);

if ($result === false) {
  http_response_code(500);
  exit('Save failed');
}

echo json_encode(['success' => true, 'message' => 'Saved successfully']);
?>
```

#### Frontend Update Script
```javascript
// Load current config
const config = await ContentLoader.load('config', true); // force refresh

// Display in form
document.getElementById('hero-title').value = config.hero.title;
document.getElementById('hero-excerpt').value = config.hero.excerpt;
// ... more fields

// Save handler
async function saveConfig() {
  const updatedConfig = {
    ...config,
    hero: {
      ...config.hero,
      title: document.getElementById('hero-title').value,
      excerpt: document.getElementById('hero-excerpt').value
    }
  };

  const response = await fetch('/admin/api/save-config.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedConfig)
  });

  const result = await response.json();
  alert(result.message);

  // Clear cache to see changes
  ContentLoader.clearCache('config');
}
```

---

## Data Structure Reference

### config.json Structure
```json
{
  "siteInfo": {
    "name": "AfrikaSport365",
    "tagline": "La referencia...",
    "logo": "images/logo.png"
  },
  "hero": {
    "badge": "HISTORIA DESTACADA",
    "title": "...",
    "excerpt": "...",
    "backgroundImage": "images/hero.jpg",
    "ctaText": "Leer Historia Completa",
    "ctaLink": "article.html?slug=..."
  },
  "breakingNews": [
    "News item 1",
    "News item 2"
  ],
  "aboutSection": {
    "icon": "🏆",
    "title": "Nuestra Misión",
    "description": "...",
    "stats": [
      { "value": "500K+", "label": "Lectores" },
      { "value": "15", "label": "Deportes" },
      { "value": "24/7", "label": "Cobertura" }
    ]
  }
}
```

### afcon-data.json Structure
```json
{
  "tournament": {
    "name": "AFCON 2025",
    "fullName": "TotalEnergies Copa...",
    "host": "Marruecos",
    "displayDates": "21 Diciembre 2025 - 18 Enero 2026"
  },
  "liveMatches": [
    {
      "status": "live",
      "minute": "73",
      "homeTeam": { "name": "Egipto", "score": 2 },
      "awayTeam": { "name": "Nigeria", "score": 1 },
      "venue": "Stade Mohammed V"
    }
  ],
  "groups": [
    {
      "id": "a",
      "name": "Grupo A",
      "teams": [
        {
          "position": 1,
          "name": "Marruecos",
          "played": 3,
          "won": 2,
          "points": 7
        }
      ]
    }
  ]
}
```

---

## Testing Checklist

### Before Deploying CMS
- [ ] Test login/logout flow
- [ ] Verify JSON validation
- [ ] Test save functionality
- [ ] Check file permissions
- [ ] Validate uploaded images
- [ ] Test with invalid data
- [ ] Verify preview function
- [ ] Test cache clearing
- [ ] Mobile admin interface
- [ ] Security: SQL injection tests
- [ ] Security: CSRF protection
- [ ] Backup before first save

### After CMS Deployment
- [ ] Train content manager
- [ ] Set up daily backups
- [ ] Monitor error logs
- [ ] Test emergency rollback
- [ ] Document common tasks
- [ ] Create troubleshooting guide

---

## Security Best Practices

### 1. Authentication
- Use strong passwords (12+ characters)
- Consider two-factor authentication
- Session timeout after inactivity
- Secure password storage (hashed)

### 2. File Upload Security
```php
$allowed_types = ['image/jpeg', 'image/png', 'image/webp'];
$max_size = 5 * 1024 * 1024; // 5MB

if (!in_array($_FILES['image']['type'], $allowed_types)) {
  exit('Invalid file type');
}

if ($_FILES['image']['size'] > $max_size) {
  exit('File too large');
}

// Rename uploaded file
$ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
$new_name = uniqid() . '.' . $ext;
move_uploaded_file($_FILES['image']['tmp_name'], '../images/' . $new_name);
```

### 3. Input Validation
```php
// Sanitize text inputs
$title = htmlspecialchars($_POST['title'], ENT_QUOTES, 'UTF-8');

// Validate URLs
if (!filter_var($url, FILTER_VALIDATE_URL)) {
  exit('Invalid URL');
}

// Validate numbers
if (!is_numeric($score)) {
  exit('Invalid score');
}
```

### 4. .htaccess Protection
```apache
# Protect data folder
<Files "*.json">
  Order Deny,Allow
  Deny from all
</Files>

# Protect admin area
<Directory "/admin">
  AuthType Basic
  AuthName "Restricted Area"
  AuthUserFile /path/to/.htpasswd
  Require valid-user
</Directory>
```

---

## Common Tasks

### Update Breaking News
1. Log into admin panel
2. Navigate to "Breaking News" section
3. Add/Edit/Remove news items
4. Click "Save"
5. Verify on homepage (auto-updates)

### Update Match Score
1. Go to "AFCON Live Matches"
2. Select match to update
3. Update home/away scores
4. Add commentary if needed
5. Save changes
6. Score updates immediately on AFCON page

### Change Hero Featured Story
1. Navigate to "Homepage Hero"
2. Update title and description
3. Upload new background image (optional)
4. Update article link slug
5. Preview changes
6. Publish

### Update Group Standings
1. Go to "AFCON Standings"
2. Select group (A-F)
3. Update team statistics
4. Recalculate points if needed
5. Save group
6. Repeat for other groups

---

## Backup & Recovery

### Manual Backup
1. Download current JSON files:
   - `/data/config.json`
   - `/data/afcon-data.json`
   - `/data/articles.json`
2. Save with date: `config-2025-12-16.json`
3. Store safely

### Automated Backup (Cron Job)
```bash
#!/bin/bash
# Daily backup at 2 AM
0 2 * * * cd /path/to/site/data && tar -czf backup-$(date +\%Y\%m\%d).tar.gz *.json
```

### Restore from Backup
1. Stop any active editing
2. Replace current JSON with backup version
3. Clear ContentLoader cache
4. Refresh website
5. Verify content loaded correctly

---

## Troubleshooting

### Problem: Changes not appearing
**Solution**: Clear cache
```javascript
ContentLoader.clearCache();
location.reload();
```

### Problem: JSON syntax error
**Solution**: Validate JSON
1. Copy JSON content
2. Go to https://jsonlint.com
3. Paste and validate
4. Fix syntax errors
5. Save corrected version

### Problem: Image not uploading
**Check**:
- File size under 5MB
- Format: JPG, PNG, or WebP
- Server disk space available
- Upload folder writable (755 permissions)

### Problem: Admin login fails
**Check**:
- Correct username/password
- Session cookies enabled
- PHP session configured
- Server error logs

---

## Contact & Support

### Documentation
- Full Report: `CMS_PREPARATION_REPORT.md`
- Article System: `ARTICLE_SYSTEM_GUIDE.md`

### Code References
- Content Loader: `js/content-loader.js`
- Data Attributes: Search HTML for `data-cms-*`
- JSON Structure: `data/*.json`

---

**Last Updated**: December 16, 2025  
**Version**: 1.0  
**Status**: Preparation Phase Complete
