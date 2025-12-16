# AfrikaSport365 Admin Panel (Phase 2)

- URL: /admin/login.php
- Default user: admin
- Default password: ChangeMe123! (change immediately)

## Change Admin Password

1. Generate a new hash (locally):

```php
<?php echo password_hash('YourNewStrongPassword!', PASSWORD_DEFAULT), "\n"; 
```

Run the snippet with PHP and copy the output.

2. Update the hash in `admin/config.php`:

```php
'admin_password_hash' => 'PASTE_NEW_HASH_HERE',
```

## File Permissions (Hostinger)
- Ensure `/data` is writable by PHP for saves.
- Recommended: `755` for folders, `644` for files.

## Security
- Sessions + CSRF tokens are enforced.
- `/data` denies non-GET methods; public site can still read JSON.
- `config.php` is blocked from direct access.

## Save Endpoints
- `admin/api/save-config.php` → updates `data/config.json`
- `admin/api/save-afcon.php` → updates `data/afcon-data.json`
- Atomic writes with temp file + rename.

## Editable Sections
- Site Config: site name, tagline, logo, hero (title, excerpt, background, CTA)
- Breaking News: list of ticker items
- AFCON: tournament basics, live matches, top scorers

## Notes
- Articles management is reserved for a later phase.
- Public site appearance remains unchanged.
