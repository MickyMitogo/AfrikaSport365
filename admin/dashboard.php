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
    <h2>AFCON Data</h2>
    <form id="form-afcon">
      <fieldset>
        <legend>Tournament</legend>
        <label>Name<input name="tournament.name" required></label>
        <label>Full Name<input name="tournament.fullName"></label>
        <label>Host<input name="tournament.host"></label>
        <label>Dates<input name="tournament.dates"></label>
        <label>Logo URL<input name="tournament.logo"></label>
      </fieldset>
      <fieldset>
        <legend>Live Matches</legend>
        <div id="matches-list" class="list"></div>
        <div class="list-actions">
          <button type="button" class="btn" id="add-match">Add Match</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>Top Scorers</legend>
        <div id="scorers-list" class="list"></div>
        <div class="list-actions">
          <button type="button" class="btn" id="add-scorer">Add Scorer</button>
        </div>
      </fieldset>
      <div class="actions">
        <button type="button" class="btn" data-preview="afcon">Preview</button>
        <button type="submit" class="btn primary">Save Changes</button>
      </div>
    </form>
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
