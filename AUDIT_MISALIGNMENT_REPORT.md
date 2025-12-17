# 🔍 CMS-FRONTEND ALIGNMENT AUDIT

**Date**: December 17, 2025  
**Status**: MISALIGNMENTS DETECTED  
**Priority**: HIGH - Production System

---

## 🎯 EXECUTIVE SUMMARY

**Critical Finding**: The admin panel writes data structures that DO NOT match what the frontend expects.

**Impact**: Admin changes to AFCON live matches will **NOT appear** on the live site because:
1. Admin writes flat structure (`teamA`, `teamB`, `scoreA`, `scoreB`)
2. Frontend expects nested structure (`homeTeam.name`, `homeTeam.score`, `awayTeam.name`, `awayTeam.score`)

**Recommendation**: Update admin panel to match existing frontend structure (NOT the other way around).

---

## 📊 DETAILED FINDINGS

### ✅ WORKING CORRECTLY (No Changes Needed)

#### 1. Homepage Config Integration
| Frontend Field | JSON Path | Admin Field | Status |
|---------------|-----------|-------------|---------|
| Site name | `siteInfo.name` | `siteInfo.name` | ✅ ALIGNED |
| Tagline | `siteInfo.tagline` | `siteInfo.tagline` | ✅ ALIGNED |
| Logo | `siteInfo.logo` | `siteInfo.logo` | ✅ ALIGNED |
| Hero badge | `hero.badge` | `hero.badge` | ✅ ALIGNED |
| Hero title | `hero.title` | `hero.title` | ✅ ALIGNED |
| Hero excerpt | `hero.excerpt` | `hero.excerpt` | ✅ ALIGNED |
| Hero background | `hero.backgroundImage` | `hero.backgroundImage` | ✅ ALIGNED |
| Hero CTA text | `hero.ctaText` | `hero.ctaText` | ✅ ALIGNED |
| Hero CTA link | `hero.ctaLink` | `hero.ctaLink` | ✅ ALIGNED |
| Hero meta date | `hero.meta.date` | `hero.meta.date` | ✅ ALIGNED |
| Hero meta author | `hero.meta.author` | `hero.meta.author` | ✅ ALIGNED |
| Hero meta read time | `hero.meta.readTime` | `hero.meta.readTime` | ✅ ALIGNED |
| About icon | `aboutSection.icon` | `aboutSection.icon` | ✅ ALIGNED |
| About title | `aboutSection.title` | `aboutSection.title` | ✅ ALIGNED |
| About description | `aboutSection.description` | `aboutSection.description` | ✅ ALIGNED |
| About stats | `aboutSection.stats[].value/label` | `aboutSection.stats[].value/label` | ✅ ALIGNED |
| Breaking news | `breakingNews[]` | `breakingNews[]` | ✅ ALIGNED |

**Verification**: `homepage-bindings.js` correctly loads and binds all homepage config fields.

---

### ❌ CRITICAL MISALIGNMENT: AFCON Tournament Data

#### Issue 1: Tournament Dates Field Mismatch

**Frontend Expectation** (afcon2026.html line 55):
```html
<span data-cms-field="tournament.displayDates">21 Diciembre 2025 - 18 Enero 2026</span>
```

**JSON Structure** (afcon-data.json):
```json
{
  "tournament": {
    "startDate": "2025-12-21",
    "endDate": "2026-01-18",
    "displayDates": "21 Diciembre 2025 - 18 Enero 2026"
  }
}
```

**Admin Panel** (dashboard.php line 87):
```html
<label>Dates<input name="tournament.dates"></label>
```

**Admin Save Logic** (save-afcon.php line 18):
```php
$out['tournament']['dates'] = str_clean($input['tournament']['dates'] ?? ...);
```

**Problem**:
- Frontend reads: `tournament.displayDates` ✅
- JSON has: `tournament.displayDates` ✅
- Admin writes: `tournament.dates` ❌
- Admin reads: `tournament.dates` ❌

**Result**: Admin edits to tournament dates will **NOT appear** on the live site.

**Fix Required**:
1. Change admin field name from `tournament.dates` to `tournament.displayDates`
2. Update admin.js to use `tournament.displayDates`
3. Update save-afcon.php to write `tournament.displayDates`

---

#### Issue 2: CRITICAL - Live Matches Structure Mismatch

**Frontend Expectation** (afcon-data.json lines 11-35):
```json
{
  "liveMatches": [
    {
      "id": "match-1",
      "status": "live",
      "minute": "73",
      "homeTeam": {
        "name": "Egipto",
        "flag": "images/perfil1.jpg",
        "score": 2
      },
      "awayTeam": {
        "name": "Nigeria",
        "flag": "images/WvUXq95r_400x400.jpg",
        "score": 1
      },
      "venue": "Stade Mohammed V, Casablanca",
      "commentary": [...]
    }
  ]
}
```

**Admin Panel Structure** (dashboard.php lines 93-100):
```html
<input placeholder="Team A" data-f="teamA">
<input placeholder="Team B" data-f="teamB">
<input placeholder="A" data-f="scoreA">
<input placeholder="B" data-f="scoreB">
<select data-f="status">...</select>
```

**Admin Save Logic** (save-afcon.php lines 24-35):
```php
$matches[] = [
  'teamA' => $teamA,
  'teamB' => $teamB,
  'scoreA' => $scoreA,
  'scoreB' => $scoreB,
  'status' => $status
];
```

**JSON Written by Admin** (when saved):
```json
{
  "liveMatches": [
    {
      "teamA": "Egipto",
      "teamB": "Nigeria",
      "scoreA": 2,
      "scoreB": 1,
      "status": "live"
    }
  ]
}
```

**Problem**:
- Frontend expects: `liveMatches[].homeTeam.name`, `liveMatches[].awayTeam.name`
- Admin writes: `liveMatches[].teamA`, `liveMatches[].teamB`
- Frontend expects: `liveMatches[].homeTeam.score`, `liveMatches[].awayTeam.score`
- Admin writes: `liveMatches[].scoreA`, `liveMatches[].scoreB`
- Frontend expects: `liveMatches[].homeTeam.flag`, `liveMatches[].awayTeam.flag`
- Admin provides: **NOTHING** (missing entirely)
- Frontend expects: `liveMatches[].minute`, `liveMatches[].venue`, `liveMatches[].commentary`
- Admin provides: **NOTHING** (missing entirely)

**Impact**: 
- **100% DATA LOSS**: Admin-created matches will NOT render on frontend
- Existing matches in JSON will be **OVERWRITTEN** with incompatible structure
- **BREAKING CHANGE**: First admin save will break the AFCON page

**Fix Required**:
1. Add fields for: `homeTeam.name`, `homeTeam.flag`, `homeTeam.score`
2. Add fields for: `awayTeam.name`, `awayTeam.flag`, `awayTeam.score`
3. Add fields for: `minute`, `venue`, `id`
4. Update admin.js `renderMatches()` to load nested structure
5. Update admin.js `collectMatches()` to build nested structure
6. Update save-afcon.php to write nested structure
7. Remove flat `teamA/teamB/scoreA/scoreB` fields

---

#### Issue 3: Top Scorers Structure Mismatch

**Frontend Expectation** (afcon-data.json lines 120-140):
```json
{
  "topScorers": [
    {
      "rank": 1,
      "name": "Emilio Nsue",
      "country": "Guinea Ecuatorial",
      "flag": "images/download (1).jpeg",
      "team": "Intercity CF",
      "goals": 5,
      "matches": 3
    }
  ]
}
```

**Admin Panel Structure** (dashboard.php lines 106-109):
```html
<input placeholder="Player" data-f="name">
<input placeholder="Goals" data-f="goals">
```

**Admin Save Logic** (save-afcon.php lines 41-49):
```php
$scorers[] = ['name' => $name, 'goals' => $goals];
```

**Problem**:
- Frontend expects: `topScorers[].rank`, `topScorers[].country`, `topScorers[].flag`, `topScorers[].team`, `topScorers[].matches`
- Admin writes: **ONLY** `name` and `goals`
- Missing fields: `rank`, `country`, `flag`, `team`, `matches` (5 out of 7 fields)

**Impact**:
- Top scorers cards on frontend will display **incomplete data**
- Country flags will be **missing**
- Team names will be **missing**
- Ranking will be **missing**

**Fix Required**:
1. Add fields: `country`, `flag`, `team`, `matches`
2. Add auto-ranking based on goals (calculated field)
3. Update admin.js to handle all fields
4. Update save-afcon.php to write complete structure

---

## 🔧 FIXES REQUIRED

### Priority 1: CRITICAL (Blocks Admin from Working)

1. **Fix live matches structure** (admin.js, save-afcon.php, dashboard.php)
   - Change from flat `teamA/teamB` to nested `homeTeam/awayTeam`
   - Add missing fields: `flag`, `venue`, `minute`, `id`
   
2. **Fix tournament dates field** (admin.js, save-afcon.php, dashboard.php)
   - Rename `tournament.dates` → `tournament.displayDates`

### Priority 2: HIGH (Data Incomplete)

3. **Fix top scorers structure** (admin.js, save-afcon.php, dashboard.php)
   - Add missing fields: `country`, `flag`, `team`, `matches`, `rank`

### Priority 3: MEDIUM (Future Enhancement)

4. **Add tournament groups management** (not currently editable in admin)
5. **Add live match commentary** (not currently editable in admin)

---

## 📝 FILES REQUIRING CHANGES

### Admin Panel
- `/admin/dashboard.php` - Update form fields
- `/admin/assets/admin.js` - Fix field collection/rendering
- `/admin/api/save-afcon.php` - Fix JSON structure

### No Frontend Changes Required
- ✅ Frontend is correctly structured
- ✅ JSON structure is correct
- ❌ Admin panel needs to adapt to existing frontend

---

## ✅ VERIFICATION CHECKLIST

After fixes are applied:

- [ ] Admin loads existing match data correctly (nested structure)
- [ ] Admin can edit home team name, flag, score
- [ ] Admin can edit away team name, flag, score
- [ ] Admin can set match status, minute, venue
- [ ] Save writes correct JSON structure
- [ ] Refresh afcon2026.html shows updated data
- [ ] Tournament displayDates updates on frontend
- [ ] Top scorers show complete information

---

## 🚨 CRITICAL WARNING

**DO NOT SAVE AFCON DATA IN CURRENT STATE**

Saving will overwrite existing correct structure with incompatible flat structure, breaking the AFCON page.

**Action Required**: Apply fixes BEFORE using admin panel for AFCON data.

---

**Report Generated**: December 17, 2025  
**Next Step**: Apply minimal fixes to align admin with frontend
