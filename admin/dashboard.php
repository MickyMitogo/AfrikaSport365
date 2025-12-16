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
        <legend>Hero</legend>
        <label>Title<input name="hero.title" required></label>
        <label>Excerpt<textarea name="hero.excerpt" rows="3"></textarea></label>
        <label>Background Image<input name="hero.backgroundImage"></label>
        <label>CTA Label<input name="hero.cta.label"></label>
        <label>CTA URL<input name="hero.cta.url"></label>
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
