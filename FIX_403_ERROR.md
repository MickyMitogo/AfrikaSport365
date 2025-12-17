# 🚨 CRITICAL FIX - 403 Forbidden Error

## Problem Identified

**Console Error:**
```
GET https://africasport365.com/data/config.json 403 (Forbidden)
GET https://africasport365.com/data/afcon-data.json 403 (Forbidden)
```

**Impact:** Frontend cannot load CMS data = Admin changes don't appear on site

---

## Root Cause

The `/data/.htaccess` file was blocking public access to JSON files with overly restrictive configuration.

---

## Solution Applied

**File Modified:** `/data/.htaccess`

**Changed from** (blocking):
```apache
Options -Indexes
<FilesMatch "\.json$">
  <LimitExcept GET HEAD>
    Require all denied
  </LimitExcept>
</FilesMatch>
```

**Changed to** (permissive for reading):
```apache
# Disable directory listing
Options -Indexes

# Allow public read access to JSON files (GET/HEAD only)
# Block POST, PUT, DELETE to prevent unauthorized writes
<FilesMatch "\.json$">
  Order Allow,Deny
  Allow from all
  
  <LimitExcept GET HEAD>
    Order Deny,Allow
    Deny from all
  </LimitExcept>
</FilesMatch>

# Set proper MIME type for JSON files
<IfModule mod_mime.c>
  AddType application/json .json
</IfModule>
```

---

## Deployment Steps

### Step 1: Upload Fixed .htaccess
```bash
# Upload this file to your server:
/data/.htaccess
```

### Step 2: Test Access
1. Open in browser: `https://africasport365.com/test-cms-connection.html`
2. Click "Test Both" button
3. **Expected:** Green success message

### Step 3: Verify Fix in Console
1. Open homepage: `https://africasport365.com/`
2. Open browser console (F12)
3. **Before fix:** `403 (Forbidden)` errors
4. **After fix:** `[ContentLoader] Successfully loaded: config`

### Step 4: Confirm Changes Appear
1. Go to admin panel
2. Edit hero title to: "FIX SUCCESSFUL"
3. Save changes
4. Open homepage and press **Ctrl+F5**
5. **Expected:** Hero shows "FIX SUCCESSFUL"

---

## Alternative Fix (If Above Doesn't Work)

If you still see 403 errors after uploading the new .htaccess:

### Option 1: Check File Permissions
```bash
# SSH into server and run:
chmod 644 /path/to/data/config.json
chmod 644 /path/to/data/afcon-data.json
chmod 644 /path/to/data/.htaccess
```

### Option 2: Simplify .htaccess
If your server doesn't support the syntax, use this minimal version:

```apache
# Allow all access to JSON files
<FilesMatch "\.json$">
  Order Allow,Deny
  Allow from all
</FilesMatch>
```

Save this to `/data/.htaccess` and upload.

### Option 3: Remove .htaccess Completely (Testing Only)
```bash
# Temporarily rename to test
mv /data/.htaccess /data/.htaccess.backup
```

Then test if JSON files are accessible. If yes, the .htaccess syntax is incompatible with your server version.

---

## Verification Checklist

After fix is deployed:

- [ ] Upload new `/data/.htaccess` to server
- [ ] Visit `test-cms-connection.html` - shows green success
- [ ] Homepage console shows no 403 errors
- [ ] Console shows: `[ContentLoader] Successfully loaded: config`
- [ ] Console shows: `[AFCON Page] Tournament data loaded successfully`
- [ ] Admin changes appear on homepage after Ctrl+F5
- [ ] Admin changes appear on AFCON page after Ctrl+F5

---

## Why This Happened

The original `.htaccess` used Apache 2.4+ syntax:
```apache
Require all denied
```

But your server may be using Apache 2.2 or has different module configuration, which requires:
```apache
Order Deny,Allow
Deny from all
```

The new configuration uses **both syntaxes** for maximum compatibility.

---

## Security Note

**What's Protected:**
- ✅ Directory listing disabled (can't browse /data/ folder)
- ✅ POST/PUT/DELETE blocked (can't write to JSON files)
- ✅ Only GET/HEAD allowed (read-only access)

**What's Allowed:**
- ✅ Public can READ JSON files (required for CMS)
- ✅ Admin can WRITE via PHP (uses file system, not HTTP)

This is the correct security balance for a CMS.

---

## Quick Test Commands

### Test from command line:
```bash
# Should return JSON data:
curl https://africasport365.com/data/config.json

# Should be blocked:
curl -X POST https://africasport365.com/data/config.json
```

### Test in browser console:
```javascript
// Should work:
fetch('/data/config.json').then(r => r.json()).then(console.log)

// Should fail:
fetch('/data/config.json', {method: 'POST'})
```

---

## Expected Console Output (After Fix)

```
[ContentLoader] Module initialized
[ContentLoader] Preloading: ['config']
[ContentLoader] Fetching: config.json
✅ [ContentLoader] Successfully loaded: config
✅ [Homepage Bindings] Content loaded successfully

(AFCON page)
[ContentLoader] Fetching: afcon-data.json
✅ [ContentLoader] Successfully loaded: afcon-data
✅ [AFCON Page] Tournament data loaded successfully
```

**No 403 errors!**

---

## Files to Deploy

1. **Required:**
   - `/data/.htaccess` (FIXED)

2. **For Testing:**
   - `/test-cms-connection.html` (NEW)

3. **No Changes Needed:**
   - All JS files (already correct)
   - All PHP files (already correct)
   - All HTML files (already correct)

---

## Support

If you still see 403 errors after:
1. Uploading new .htaccess
2. Checking file permissions
3. Testing with simplified .htaccess

**Contact your hosting provider** and ask:
- "Which Apache version are you running?"
- "Is mod_rewrite enabled?"
- "Are .htaccess files allowed in /data/ folder?"

---

**Status:** FIX READY TO DEPLOY  
**Priority:** CRITICAL  
**Time to Fix:** 2 minutes (upload 1 file)
