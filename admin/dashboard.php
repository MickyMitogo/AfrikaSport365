<?php include __DIR__ . '/header.php'; ?>

<aside class="sidebar">
  <!-- Site Config tab removed -->
  <button class="tablink" data-tab="hero-about">Hero & Misión</button>
  <button class="tablink" data-tab="breaking-news">Breaking News</button>
  <button class="tablink" data-tab="afcon-data">AFCON Data</button>
  <button class="tablink" data-tab="latest-news">Latest News</button>
  <button class="tablink" data-tab="analisis-opinion">Análisis y Opinión</button>
  <button class="tablink" data-tab="athletes">Perfiles de Atleta</button>
  <button class="tablink" data-tab="multimedia">Multimedia</button>
  <button class="tablink disabled" title="Coming soon">Articles</button>
  <div class="tab" id="tab-multimedia">
    <h2>Gestión de Multimedia</h2>
    <form id="form-multimedia">
      <div id="multimedia-list" class="list"></div>
      <div style="font-size:12px;color:#666;margin-bottom:10px">
        Puedes subir imágenes, videos, enlazar videos de YouTube u otros enlaces externos. Para archivos locales, usa el botón de archivo.
      </div>
      <div class="list-actions">
        <button type="button" class="btn" id="add-multimedia">Añadir Multimedia</button>
      </div>
      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
      </div>
    </form>
  </div>
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
