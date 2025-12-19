<?php include __DIR__ . '/header.php'; ?>

<aside class="sidebar">
  <button class="tablink active" data-tab="site-config">Site Config</button>
  <button class="tablink" data-tab="breaking-news">Breaking News</button>
  <button class="tablink" data-tab="afcon-data">AFCON Data</button>
  <button class="tablink disabled" title="Coming soon">Articles</button>
</aside>

<section class="content">
  <div id="notice" class="notice" hidden></div>

  <div class="tab active" id="tab-site-config">
    <h2>Site Config</h2>
    <form id="form-site-config">
      <fieldset>
        <legend>Branding</legend>
        <label>Site Name<input name="siteInfo.name" required></label>
        <label>Tagline<input name="siteInfo.tagline"></label>
        <label>Logo URL<input name="siteInfo.logo"></label>
      </fieldset>
      <fieldset>
        <legend>Hero (Featured Story)</legend>
        <label>Badge<input name="hero.badge" placeholder="e.g., HISTORIA DESTACADA"></label>
        <label>Title<input name="hero.title" required></label>
        <label>Excerpt<textarea name="hero.excerpt" rows="3"></textarea></label>
        <label>Background Image URL<input name="hero.backgroundImage"></label>
        <label>CTA Text<input name="hero.ctaText" placeholder="e.g., Leer Historia Completa"></label>
        <label>CTA Link<input name="hero.ctaLink" placeholder="article.html?slug=..."></label>
        <label>Date<input name="hero.meta.date" placeholder="e.g., 15 de Enero, 2025"></label>
        <label>Author<input name="hero.meta.author" placeholder="e.g., Pedro Nguema"></label>
        <label>Read Time<input name="hero.meta.readTime" placeholder="e.g., 8 min de lectura"></label>
      </fieldset>
      <fieldset>
        <legend>About / Mission Section</legend>
        <label>Icon (emoji)<input name="aboutSection.icon" placeholder="e.g., 🏆" maxlength="4"></label>
        <label>Title<input name="aboutSection.title" placeholder="e.g., Nuestra Misión"></label>
        <label>Description<textarea name="aboutSection.description" rows="4" placeholder="Mission statement text..."></textarea></label>
        <div style="margin-top:10px">
          <strong>Statistics</strong>
          <div style="display:grid;gap:8px;margin-top:8px">
            <div style="display:grid;grid-template-columns:1fr 2fr;gap:8px">
              <input name="aboutSection.stats.0.value" placeholder="Value (e.g., 500K+)">
              <input name="aboutSection.stats.0.label" placeholder="Label (e.g., Lectores Mensuales)">
            </div>
            <div style="display:grid;grid-template-columns:1fr 2fr;gap:8px">
              <input name="aboutSection.stats.1.value" placeholder="Value (e.g., 15)">
              <input name="aboutSection.stats.1.label" placeholder="Label (e.g., Deportes Cubiertos)">
            </div>
            <div style="display:grid;grid-template-columns:1fr 2fr;gap:8px">
              <input name="aboutSection.stats.2.value" placeholder="Value (e.g., 24/7)">
              <input name="aboutSection.stats.2.label" placeholder="Label (e.g., Cobertura en Vivo)">
            </div>
          </div>
        </div>
      </fieldset>
      <div class="actions">
        <button type="button" class="btn" data-preview="config">Preview</button>
        <button type="submit" class="btn primary">Save Changes</button>
      </div>
    </form>
  </div>

  <div class="tab" id="tab-breaking-news">
    <h2>Breaking News</h2>
    <form id="form-breaking-news">
      <div id="breaking-list" class="list"></div>
      <div class="list-actions">
        <button type="button" class="btn" id="add-breaking">Add Item</button>
      </div>
      <div class="actions">
        <button type="button" class="btn" data-preview="config">Preview</button>
        <button type="submit" class="btn primary">Save Changes</button>
      </div>
    </form>
  </div>

  <div class="tab" id="tab-afcon-data">
    <h2>AFCON Spotlight</h2>
    <form id="form-afcon">
      <fieldset>
        <legend>Tournament Info</legend>
        <label>Name<input name="tournament.name" placeholder="e.g., Copa Africana de Naciones 2026" required></label>
        <label>Subtitle<input name="tournament.subtitle" placeholder="e.g., Guinea Ecuatorial • Junio-Julio 2026"></label>
        <label>Logo URL<input name="tournament.logo" placeholder="images/AFCON-2021.webp"></label>
      </fieldset>
      
      <fieldset>
        <legend>Group Standings</legend>
        <p style="font-size:12px;color:#666;margin-bottom:10px">Enter team name and points. Display order will follow the order entered.</p>
        <div id="standings-list" class="list"></div>
        <div class="list-actions">
          <button type="button" class="btn" id="add-standing">Add Team</button>
        </div>
      </fieldset>
      
      <fieldset>
        <legend>Next Match</legend>
        <label>Teams<input name="nextMatch.teams" placeholder="e.g., Guinea Ecuatorial vs Tanzania" required></label>
        <label>Date Display<input name="nextMatch.date" placeholder="e.g., 28 ENE" required></label>
        <label>Venue<input name="nextMatch.venue" placeholder="e.g., Estadio de Bata"></label>
        <label>Time<input name="nextMatch.time" placeholder="e.g., 20:00"></label>
      </fieldset>
      
      <fieldset>
        <legend>Top Scorer</legend>
        <label>Player Name<input name="topScorer.name" placeholder="e.g., Emilio Nsue" required></label>
        <label>Stats<input name="topScorer.stats" placeholder="e.g., 5 goles en 3 partidos" required></label>
        <label>Player Image URL (optional)<input name="topScorer.image" placeholder="Leave empty for default ball icon"></label>
      </fieldset>
      
      <div class="actions">
        <button type="button" class="btn" data-preview="afcon">Preview</button>
        <button type="submit" class="btn primary">Save Changes</button>
      </div>
    </form>
  </div>

  <div class="tab" id="tab-articles">
    <h2>Articles (Coming Soon)</h2>
    <p>Article management interface will be added here.</p>
  </div>
</section>

<dialog id="preview-dialog">
  <div class="dialog-content">
    <h3>Preview</h3>
    <pre id="preview-json"></pre>
    <div class="actions"><button class="btn" id="close-preview">Close</button></div>
  </div>
</dialog>

<?php include __DIR__ . '/footer.php'; ?>
