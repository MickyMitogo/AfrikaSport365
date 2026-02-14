<?php include __DIR__ . '/header.php'; ?>

<aside class="sidebar">
<<<<<<< HEAD
  <button class="tablink active" data-tab="site-config">Site Config</button>
  <button class="tablink" data-tab="breaking-news">Breaking News</button>
  <button class="tablink" data-tab="afcon-data">AFCON Data</button>
=======
  <!-- Site Config tab removed -->
  <button class="tablink" data-tab="hero-about">Hero & Misión</button>
  <button class="tablink" data-tab="breaking-news">Breaking News</button>
  <button class="tablink" data-tab="afcon-data">AFCON Data</button>
  <button class="tablink" data-tab="latest-news">Latest News</button>
  <button class="tablink" data-tab="analisis-opinion">Análisis y Opinión</button>
  <button class="tablink" data-tab="athletes">Perfiles de Atleta</button>
>>>>>>> dc026b561452f8a1f5585dcf51fceb27166a4d08
  <button class="tablink disabled" title="Coming soon">Articles</button>
</aside>

<section class="content">
    <div class="tab" id="tab-athletes">
      <h2>Perfiles de Atleta</h2>
      <form id="form-athletes">
        <div id="athletes-list" class="list"></div>
        <div class="list-actions">
          <button type="button" class="btn" id="add-athlete">Añadir Atleta</button>
        </div>
        <div class="actions">
          <button type="button" class="btn" data-preview="athletes">Preview</button>
          <button type="submit" class="btn primary">Guardar Cambios</button>
        </div>
      </form>
    </div>

  <div class="tab" id="tab-hero-about">
    <h2>Hero & Nuestra Misión</h2>
    <form id="hero-about-admin-form">
      <fieldset>
        <legend>Hero Section</legend>
        <label>Fondo (URL imagen)
          <input name="hero_backgroundImage" type="text" placeholder="URL de la imagen de fondo">
        </label>
        <label>Fondo CSS (URL imagen)
          <input name="hero_backgroundCssImage" type="text" placeholder="URL para el fondo CSS de la tarjeta">
        </label>
        <label>Badge
          <input name="hero_badge" type="text" placeholder="Texto del badge">
        </label>
        <label>Título
          <input name="hero_title" type="text" placeholder="Título principal">
        </label>
        <label>Resumen
          <textarea name="hero_excerpt" placeholder="Resumen corto"></textarea>
        </label>
        <label>Fecha
          <input name="hero_meta_date" type="text" placeholder="Fecha (ej: 15 de Enero, 2025)">
        </label>
        <label>Autor
          <input name="hero_meta_author" type="text" placeholder="Autor">
        </label>
        <label>Tiempo de lectura
          <input name="hero_meta_readTime" type="text" placeholder="Ej: 8 min de lectura">
        </label>
        <label>Enlace CTA
          <input name="hero_ctaLink" type="text" placeholder="URL del botón CTA">
        </label>
        <label>Texto CTA
          <input name="hero_ctaText" type="text" placeholder="Texto del botón CTA">
        </label>
      </fieldset>
      <fieldset>
        <legend>Nuestra Misión</legend>
        <label>Icono
          <input name="about_icon" type="text" placeholder="Emoji o icono">
        </label>
        <label>Título
          <input name="about_title" type="text" placeholder="Título de la sección">
        </label>
        <label>Descripción
          <textarea name="about_description" placeholder="Descripción de la misión"></textarea>
        </label>
        <div style="margin-top:10px;font-weight:bold">Estadísticas</div>
        <div class="about-stats-fields">
          <label>Valor 1<input name="about_stats_0_value" type="text" placeholder="Ej: 500K+" /></label>
          <label>Etiqueta 1<input name="about_stats_0_label" type="text" placeholder="Ej: Lectores Mensuales" /></label>
          <label>Valor 2<input name="about_stats_1_value" type="text" placeholder="Ej: 15" /></label>
          <label>Etiqueta 2<input name="about_stats_1_label" type="text" placeholder="Ej: Deportes Cubiertos" /></label>
          <label>Valor 3<input name="about_stats_2_value" type="text" placeholder="Ej: 24/7" /></label>
          <label>Etiqueta 3<input name="about_stats_2_label" type="text" placeholder="Ej: Cobertura en Vivo" /></label>
        </div>
      </fieldset>
      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
      </div>
      <div id="hero-about-admin-status" style="margin-top:10px;color:green"></div>
    </form>
  </div>
  <div id="notice" class="notice" hidden></div>

<<<<<<< HEAD
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
=======
  <!-- Site Config tab and form removed -->

  <div class="tab" id="tab-analisis-opinion">
    <h2>Análisis y Opinión</h2>
    <form id="form-analisis-opinion">
      <div id="analisis-opinion-list" class="list"></div>
      <div style="font-size:12px;color:#666;margin-bottom:10px">
        Cada artículo puede tener una imagen (URL) y un badge (texto, ej: OPINIÓN, ENTREVISTA).
      </div>
      <div class="list-actions">
        <button type="button" class="btn" id="add-analisis-opinion">Añadir Artículo</button>
      </div>
      <div class="actions">
        <button type="button" class="btn" data-preview="analisis-opinion">Preview</button>
        <button type="submit" class="btn primary">Guardar Cambios</button>
>>>>>>> dc026b561452f8a1f5585dcf51fceb27166a4d08
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
<<<<<<< HEAD
    <h2>AFCON Data</h2>
    <form id="form-afcon">
      <fieldset>
        <legend>Tournament</legend>
        <label>Name<input name="tournament.name" required></label>
        <label>Full Name<input name="tournament.fullName"></label>
        <label>Host<input name="tournament.host"></label>
        <label>Display Dates<input name="tournament.displayDates" placeholder="e.g., 21 Diciembre 2025 - 18 Enero 2026"></label>
        <label>Logo URL<input name="tournament.logo"></label>
      </fieldset>
      <fieldset>
        <legend>Live Matches</legend>
        <p style="font-size:12px;color:#666;margin-bottom:10px">Each match requires: home/away team names, flags (image URLs), scores, status, and venue.</p>
        <div id="matches-list" class="list"></div>
        <div class="list-actions">
          <button type="button" class="btn" id="add-match">Add Match</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>Top Scorers</legend>
        <p style="font-size:12px;color:#666;margin-bottom:10px">Players will be auto-ranked by goals. Provide name, country, flag URL, team, goals, and matches played.</p>
        <div id="scorers-list" class="list"></div>
        <div class="list-actions">
          <button type="button" class="btn" id="add-scorer">Add Scorer</button>
        </div>
      </fieldset>
=======
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
      
>>>>>>> dc026b561452f8a1f5585dcf51fceb27166a4d08
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

  <section id="admin-multimedia" class="admin-section">
    <h2>Galería Multimedia</h2>
    <form id="form-multimedia">
        <div id="multimedia-list"></div>
        <button type="button" id="add-multimedia" class="btn">Añadir elemento</button>
        <button type="submit" class="btn btn-primary">Guardar galería</button>
    </form>
  </section>
  <script src="assets/multimedia-admin.js"></script>
</section>

<dialog id="preview-dialog">
  <div class="dialog-content">
    <h3>Preview</h3>
    <pre id="preview-json"></pre>
    <div class="actions"><button class="btn" id="close-preview">Close</button></div>
  </div>
</dialog>

<?php include __DIR__ . '/footer.php'; ?>
