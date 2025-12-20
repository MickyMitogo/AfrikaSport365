<?php include __DIR__ . '/header.php'; ?>

<aside class="sidebar">
  <!-- Site Config tab removed -->
  <button class="tablink" data-tab="breaking-news">Breaking News</button>
  <button class="tablink" data-tab="afcon-data">AFCON Data</button>
  <button class="tablink" data-tab="latest-news">Latest News</button>
  <button class="tablink disabled" title="Coming soon">Articles</button>
</aside>

<section class="content">
  <div id="notice" class="notice" hidden></div>

  <!-- Site Config tab and form removed -->

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

  <div class="tab" id="tab-latest-news">
    <h2>Latest News</h2>
    <form id="form-latest-news">
      <p style="font-size:12px;color:#666;margin-bottom:10px">
        Manage the news cards displayed in the "Últimas Noticias" section of the homepage. 
        Mark one article as "featured" to display it as the large card.
      </p>
      
      <div id="latest-news-list" class="list"></div>
      
      <div class="list-actions">
        <button type="button" class="btn" id="add-news-item">Add News Item</button>
      </div>
      
      <div class="actions">
        <button type="button" class="btn" data-preview="latest-news">Preview</button>
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
