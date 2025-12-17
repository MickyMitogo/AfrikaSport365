# 🔧 TROUBLESHOOTING 403 FORBIDDEN ERROR

## Current Status
❌ Still getting HTTP 403 when accessing `/data/afcon-data.json`

---

## IMMEDIATE FIX - Try These Steps in Order

### Option 1: Upload Simplest .htaccess (RECOMMENDED)

**Upload this file to your server as `/data/.htaccess`:**

```apache
# Simplest possible configuration - allows ALL access
<FilesMatch "\.json$">
  Require all granted
</FilesMatch>
```

This file is ready in your local folder: `data/.htaccess.SIMPLEST`

**Steps:**
1. Rename `data/.htaccess.SIMPLEST` to `data/.htaccess` (replace existing)
2. Upload to server at `/data/.htaccess`
3. Test: https://africasport365.com/data/afcon-data.json (should show JSON)

---

### Option 2: Test Without .htaccess

**Temporarily remove/rename the .htaccess file:**

1. On your server, rename `/data/.htaccess` to `/data/.htaccess.backup`
2. Test: https://africasport365.com/data/afcon-data.json
3. **If this works:** Your .htaccess syntax is incompatible
4. **If still 403:** It's a server-level restriction

---

### Option 3: Check File Permissions

**Via FTP/File Manager:**

1. Right-click `/data/afcon-data.json`
2. Change permissions to: **644** (rw-r--r--)
3. Do the same for:
   - `/data/config.json` → 644
   - `/data/articles.json` → 644
   - `/data/.htaccess` → 644

**Via SSH/Terminal:**
```bash
chmod 644 /home/username/public_html/data/*.json
chmod 644 /home/username/public_html/data/.htaccess
```

---

### Option 4: Add CORS Headers

Some servers block JSON files without CORS headers. Try this `.htaccess`:

```apache
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, HEAD, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type"
</IfModule>

<FilesMatch "\.json$">
  Require all granted
</FilesMatch>
```

---

## TESTING TOOLS

### Test 1: Direct Browser Access

**Open these URLs in your browser:**
- https://africasport365.com/data/config.json
- https://africasport365.com/data/afcon-data.json
- https://africasport365.com/data/articles.json

**Expected:** Should display JSON content
**If 403:** Server is blocking access

---

### Test 2: Use Test Page

**Upload and access:**
https://africasport365.com/test-direct-access.html

This page will:
- ✅ Test direct link access
- ✅ Test Fetch API
- ✅ Test XMLHttpRequest
- ✅ Check server configuration
- ✅ Show detailed error messages

---

### Test 3: Browser Console

Open your homepage and check console:

```javascript
// Paste in browser console:
fetch('/data/config.json')
  .then(r => console.log('Status:', r.status, r.statusText))
  .catch(e => console.error('Error:', e));
```

**Expected:** `Status: 200 OK`
**If 403:** Server blocking request

---

## HOSTINGER-SPECIFIC FIXES

### Fix 1: Check PHP Version

Hostinger may restrict .htaccess directives based on PHP version.

**In Hostinger Control Panel:**
1. Go to **Advanced → Select PHP Version**
2. Change to **PHP 7.4** or **PHP 8.0**
3. Save and test again

---

### Fix 2: Hotlink Protection

Hostinger's hotlink protection may block JSON files.

**In Hostinger Control Panel:**
1. Go to **Advanced → Hotlink Protection**
2. Add to allowed extensions: `json`
3. Save and test

---

### Fix 3: ModSecurity Rules

Hostinger uses ModSecurity which may block JSON access.

**Contact Hostinger Support and ask:**
> "I'm getting HTTP 403 errors when accessing JSON files in my /data/ folder. Can you check if ModSecurity is blocking these requests? The files are: /data/config.json, /data/afcon-data.json, /data/articles.json"

They can whitelist these files in ModSecurity.

---

### Fix 4: Check .htaccess in Parent Directory

**Look for .htaccess in your root directory:**
`/home/username/public_html/.htaccess`

**If it exists, check for these lines:**
```apache
# Bad - blocks JSON:
<FilesMatch "\.json$">
  deny from all
</FilesMatch>

# Good - allows JSON:
<FilesMatch "\.json$">
  allow from all
</FilesMatch>
```

---

## QUICK DIAGNOSIS

### Run This in Browser Console:

```javascript
// Quick diagnostic script
(async function() {
    console.log('=== JSON ACCESS TEST ===');
    
    const files = [
        '/data/config.json',
        '/data/afcon-data.json',
        '/data/articles.json'
    ];
    
    for (const file of files) {
        try {
            const response = await fetch(file);
            console.log(`${file}: ${response.status} ${response.statusText}`);
            console.log('Headers:', [...response.headers.entries()]);
        } catch (error) {
            console.error(`${file}: ${error.message}`);
        }
    }
})();
```

**Copy results and send to me for analysis.**

---

## COMMON CAUSES OF 403

| Cause | How to Check | Solution |
|-------|-------------|----------|
| **File permissions** | Check in FTP: should be 644 | `chmod 644 *.json` |
| **Directory permissions** | /data/ should be 755 | `chmod 755 data/` |
| **.htaccess blocking** | Remove .htaccess temporarily | Use simpler syntax |
| **Parent .htaccess** | Check root .htaccess | Remove blocking rules |
| **ModSecurity** | Check error logs | Contact support |
| **Hotlink protection** | Check Hostinger panel | Add json to allowed |
| **CORS policy** | Check browser console | Add CORS headers |
| **PHP version** | Check Hostinger panel | Change to PHP 7.4+ |

---

## FILE COMPARISON

### Your Current `/data/.htaccess`:
```apache
# Disable directory listing
Options -Indexes

# Allow public read access to JSON files
<FilesMatch "\.json$">
  Require all granted
</FilesMatch>

# Set proper MIME type for JSON files
<IfModule mod_mime.c>
  AddType application/json .json
</IfModule>
```

### Simplest Version (Try This):
```apache
<FilesMatch "\.json$">
  Require all granted
</FilesMatch>
```

### Apache 2.2 Version (If Above Fails):
```apache
<FilesMatch "\.json$">
  Order allow,deny
  Allow from all
</FilesMatch>
```

---

## NEXT STEPS

### Step 1: Quick Test
1. Upload `test-direct-access.html` to your server root
2. Visit: https://africasport365.com/test-direct-access.html
3. Click "Step 1" links - do they show JSON?

### Step 2: If Links Work
- JSON files are accessible
- Problem is in JavaScript code (check CORS)

### Step 3: If Links Show 403
- JSON files are blocked
- Try Option 1 (simplest .htaccess)

### Step 4: If Still 403
- Contact Hostinger support
- Provide them: error logs, .htaccess content, file permissions

---

## EMERGENCY WORKAROUND

If nothing works, use PHP proxy:

**Create `/get-json.php`:**
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$file = $_GET['file'] ?? '';
$allowed = ['config', 'afcon-data', 'articles'];

if (in_array($file, $allowed)) {
    $path = __DIR__ . '/data/' . $file . '.json';
    if (file_exists($path)) {
        echo file_get_contents($path);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'File not found']);
    }
} else {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied']);
}
?>
```

**Then change JavaScript to fetch:**
- `/get-json.php?file=config` instead of `/data/config.json`
- `/get-json.php?file=afcon-data` instead of `/data/afcon-data.json`

---

## SEND ME THIS INFO

To help debug, send me:

1. **Test page results:** Visit test-direct-access.html and screenshot
2. **Direct link test:** Open https://africasport365.com/data/config.json - what do you see?
3. **Console output:** Run the diagnostic script and copy results
4. **Server info:** What PHP version? (check Hostinger panel)
5. **Error log:** Check Hostinger error logs for clues

---

**Priority:** HIGH - This blocks all CMS functionality  
**Status:** Testing fixes in progress
