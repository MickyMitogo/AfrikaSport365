<?php include __DIR__ . '/header.php'; ?>

<style>
/* Enhanced sidebar with sections */
.sidebar {
  width: 260px;
  padding: 16px;
  border-right: 1px solid var(--border);
  background: #0e141b;
  overflow-y: auto;
  max-height: calc(100vh - 60px);
}

.sidebar-section {
  margin-bottom: 24px;
}

.sidebar-section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--muted);
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  padding-left: 4px;
}

.tablink {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  margin-bottom: 6px;
  background: var(--card);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.tablink:hover {
  background: #1a2332;
  border-color: var(--primary);
}

.tablink.active {
  background: #1a2836;
  border-color: var(--primary);
  color: #fff;
}

.tablink .icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.tablink.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Enhanced form layouts */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-row.thirds {
  grid-template-columns: 1fr 1fr 1fr;
}

.dynamic-list {
  display: grid;
  gap: 12px;
}

.dynamic-item {
  background: #0e141b;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px;
  position: relative;
}

.dynamic-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.dynamic-item-title {
  font-weight: 600;
  color: var(--primary);
}

.remove-item-btn {
  background: var(--danger);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.add-item-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 12px;
  width: 100%;
  font-size: 14px;
}

.stat-inputs {
  display: grid;
  gap: 8px;
}

.stat-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 8px;
}
</style>

<aside class="sidebar">
  <!-- Main Content Section -->
  <div class="sidebar-section">
    <div class="sidebar-section-title">Contenido Principal</div>
    <button class="tablink active" data-tab="hero">
      <span class="icon">✨</span>
      <span>Hero / Portada</span>
    </button>
    <button class="tablink" data-tab="breaking-news">
      <span class="icon">📰</span>
      <span>Breaking News</span>
    </button>
    <button class="tablink" data-tab="latest-news">
      <span class="icon">🗞️</span>
      <span>Últimas Noticias</span>
    </button>
    <button class="tablink" data-tab="categories">
      <span class="icon">⚽</span>
      <span>Categorías Deportes</span>
    </button>
    <button class="tablink" data-tab="afcon">
      <span class="icon">🏆</span>
      <span>AFCON Spotlight</span>
    </button>
    <button class="tablink" data-tab="analysis">
      <span class="icon">📝</span>
      <span>Análisis & Opinión</span>
    </button>
    <button class="tablink" data-tab="athletes">
      <span class="icon">👥</span>
      <span>Perfiles Atletas</span>
    </button>
    <button class="tablink" data-tab="multimedia">
      <span class="icon">🎬</span>
      <span>Galería Multimedia</span>
    </button>
    <button class="tablink" data-tab="about">
      <span class="icon">ℹ️</span>
      <span>Sobre Nosotros</span>
    </button>
  </div>

  <!-- Site Structure Section -->
  <div class="sidebar-section">
    <div class="sidebar-section-title">Estructura del Sitio</div>
    <button class="tablink" data-tab="navigation">
      <span class="icon">🔧</span>
      <span>Header & Navegación</span>
    </button>
    <button class="tablink" data-tab="footer">
      <span class="icon">👣</span>
      <span>Footer</span>
    </button>
    <button class="tablink" data-tab="ads">
      <span class="icon">📢</span>
      <span>Anuncios/Banners</span>
    </button>
  </div>

  <!-- Legacy CMS Section -->
  <div class="sidebar-section">
    <div class="sidebar-section-title">Sistema Anterior</div>
    <button class="tablink" data-tab="site-config">
      <span class="icon">⚙️</span>
      <span>Config. General</span>
    </button>
    <button class="tablink" data-tab="afcon-data">
      <span class="icon">📊</span>
      <span>Datos AFCON</span>
    </button>
  </div>
</aside>

<section class="content">
  <div id="notice" class="notice" hidden></div>

  <!-- Hero Tab -->
  <div class="tab active" id="tab-hero">
    <h2>Hero / Portada</h2>
    <p class="hint">Configure la historia destacada que aparece en la parte superior de la página principal.</p>
    <form id="form-hero">
      <fieldset>
        <legend>Contenido Principal</legend>
        <label>
          Badge/Etiqueta
          <input type="text" name="hero.badge" placeholder="HISTORIA DESTACADA" required>
        </label>
        <label>
          Título Principal
          <input type="text" name="hero.title" placeholder="Título de la historia..." required>
        </label>
        <label>
          Extracto/Descripción
          <textarea name="hero.excerpt" rows="4" placeholder="Descripción breve de la historia..." required></textarea>
        </label>
        <label>
          Imagen de Fondo (URL)
          <input type="text" name="hero.backgroundImage" placeholder="images/hero-bg.jpg" required>
        </label>
      </fieldset>

      <fieldset>
        <legend>Call to Action</legend>
        <div class="form-row">
          <label>
            Texto del Botón
            <input type="text" name="hero.ctaText" placeholder="Leer Historia Completa" required>
          </label>
          <label>
            Enlace del Botón
            <input type="text" name="hero.ctaLink" placeholder="article.html?slug=..." required>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Metadatos</legend>
        <div class="form-row thirds">
          <label>
            Fecha
            <input type="text" name="hero.meta.date" placeholder="15 de Enero, 2025">
          </label>
          <label>
            Autor
            <input type="text" name="hero.meta.author" placeholder="Pedro Nguema">
          </label>
          <label>
            Tiempo de Lectura
            <input type="text" name="hero.meta.readTime" placeholder="8 min de lectura">
          </label>
        </div>
      </fieldset>

      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
        <button type="button" class="btn" onclick="loadContent()">Recargar</button>
      </div>
    </form>
  </div>

  <!-- Breaking News Tab -->
  <div class="tab" id="tab-breaking-news">
    <h2>Breaking News</h2>
    <p class="hint">Gestiona las noticias urgentes que aparecen en el ticker superior.</p>
    <form id="form-breaking-news">
      <div id="breaking-list" class="dynamic-list"></div>
      <button type="button" class="add-item-btn" id="add-breaking">+ Agregar Noticia</button>
      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
        <button type="button" class="btn" onclick="loadContent()">Recargar</button>
      </div>
    </form>
  </div>

  <!-- Latest News Tab -->
  <div class="tab" id="tab-latest-news">
    <h2>Últimas Noticias</h2>
    <p class="hint">Configure la sección de noticias principales con un artículo destacado y cuatro artículos en cuadrícula.</p>
    <form id="form-latest-news">
      <fieldset>
        <legend>Encabezado de Sección</legend>
        <div class="form-row">
          <label>
            Título de Sección
            <input type="text" name="latestNews.sectionTitle" placeholder="Últimas Noticias" required>
          </label>
          <label>
            Texto "Ver Todo"
            <input type="text" name="latestNews.viewAllText" placeholder="Ver todas las noticias">
          </label>
        </div>
        <label>
          Enlace "Ver Todo"
          <input type="text" name="latestNews.viewAllLink" placeholder="#">
        </label>
      </fieldset>

      <fieldset>
        <legend>Artículo Destacado (Grande)</legend>
        <div class="form-row">
          <label>
            Slug del Artículo
            <input type="text" name="featured.slug" required>
          </label>
          <label>
            Imagen (URL)
            <input type="text" name="featured.image" required>
          </label>
        </div>
        <div class="form-row">
          <label>
            Categoría
            <input type="text" name="featured.category" placeholder="FÚTBOL" required>
          </label>
          <label>
            Color de Categoría
            <input type="color" name="featured.categoryColor" value="#ef4444">
          </label>
        </div>
        <label>
          Título
          <input type="text" name="featured.title" required>
        </label>
        <label>
          Extracto
          <textarea name="featured.excerpt" rows="2" required></textarea>
        </label>
        <div class="form-row thirds">
          <label>
            Fecha
            <input type="text" name="featured.meta.date" placeholder="Hace 2 horas">
          </label>
          <label>
            Autor
            <input type="text" name="featured.meta.author" placeholder="María Obiang">
          </label>
          <label>
            Comentarios
            <input type="number" name="featured.meta.comments" placeholder="24">
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Artículos en Cuadrícula (4 Artículos)</legend>
        <div id="grid-articles" class="dynamic-list"></div>
        <button type="button" class="add-item-btn" id="add-grid-article">+ Agregar Artículo</button>
      </fieldset>

      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
        <button type="button" class="btn" onclick="loadContent()">Recargar</button>
      </div>
    </form>
  </div>

  <!-- Categories Tab -->
  <div class="tab" id="tab-categories">
    <h2>Categorías de Deportes</h2>
    <p class="hint">Gestiona las tarjetas de categorías deportivas que aparecen en la página principal.</p>
    <form id="form-categories">
      <fieldset>
        <legend>Encabezado de Sección</legend>
        <div class="form-row">
          <label>
            Título de Sección
            <input type="text" name="sportsCategories.sectionTitle" placeholder="Explora por Deporte" required>
          </label>
          <label>
            Texto "Ver Todo"
            <input type="text" name="sportsCategories.viewAllText" placeholder="Ver todos los deportes">
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Categorías (6 Tarjetas)</legend>
        <div id="categories-list" class="dynamic-list"></div>
        <button type="button" class="add-item-btn" id="add-category">+ Agregar Categoría</button>
      </fieldset>

      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
        <button type="button" class="btn" onclick="loadContent()">Recargar</button>
      </div>
    </form>
  </div>

  <!-- AFCON Spotlight Tab -->
  <div class="tab" id="tab-afcon">
    <h2>AFCON 2026 Spotlight</h2>
    <p class="hint">Configure el módulo destacado de AFCON con clasificación, próximo partido y goleador.</p>
    <form id="form-afcon">
      <fieldset>
        <legend>Configuración General</legend>
        <label>
          <input type="checkbox" name="afconSpotlight.enabled" checked>
          Mostrar sección AFCON Spotlight
        </label>
        <div class="form-row">
          <label>
            Logo (URL)
            <input type="text" name="afconSpotlight.logo" placeholder="images/AFCON-2021.webp">
          </label>
          <label>
            Título
            <input type="text" name="afconSpotlight.title" placeholder="Copa Africana de Naciones 2026" required>
          </label>
        </div>
        <label>
          Subtítulo
          <input type="text" name="afconSpotlight.subtitle" placeholder="Guinea Ecuatorial • Junio-Julio 2026">
        </label>
        <div class="form-row">
          <label>
            Texto CTA
            <input type="text" name="afconSpotlight.ctaText" placeholder="Ver Cobertura Completa AFCON 2026">
          </label>
          <label>
            Enlace CTA
            <input type="text" name="afconSpotlight.ctaLink" placeholder="afcon2026.html">
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Clasificación (4 Equipos)</legend>
        <label>
          Título de la Tabla
          <input type="text" name="standings.title" placeholder="Clasificación Grupo A">
        </label>
        <div id="standings-list" class="dynamic-list"></div>
        <button type="button" class="add-item-btn" id="add-standing">+ Agregar Equipo</button>
      </fieldset>

      <fieldset>
        <legend>Próximo Partido</legend>
        <label>
          Título
          <input type="text" name="nextMatch.title" placeholder="Próximo Partido">
        </label>
        <div class="form-row">
          <label>
            Equipo Local
            <input type="text" name="nextMatch.homeTeam" placeholder="Guinea Ecuatorial" required>
          </label>
          <label>
            Equipo Visitante
            <input type="text" name="nextMatch.awayTeam" placeholder="Tanzania" required>
          </label>
        </div>
        <div class="form-row thirds">
          <label>
            Fecha
            <input type="text" name="nextMatch.date" placeholder="28 ENE" required>
          </label>
          <label>
            Hora
            <input type="text" name="nextMatch.time" placeholder="20:00">
          </label>
          <label>
            Estadio
            <input type="text" name="nextMatch.venue" placeholder="Estadio de Bata">
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Máximo Goleador</legend>
        <label>
          Título
          <input type="text" name="topScorer.title" placeholder="Máximo Goleador">
        </label>
        <div class="form-row thirds">
          <label>
            Icono
            <input type="text" name="topScorer.icon" placeholder="⚽" maxlength="2">
          </label>
          <label>
            Nombre
            <input type="text" name="topScorer.name" placeholder="Emilio Nsue" required>
          </label>
          <label>
            Estadísticas
            <input type="text" name="topScorer.stats" placeholder="5 goles en 3 partidos">
          </label>
        </div>
      </fieldset>

      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
        <button type="button" class="btn" onclick="loadContent()">Recargar</button>
      </div>
    </form>
  </div>

  <!-- Analysis Tab -->
  <div class="tab" id="tab-analysis">
    <h2>Análisis & Opinión</h2>
    <p class="hint">Gestiona los artículos de análisis y opinión que aparecen en el sidebar.</p>
    <form id="form-analysis">
      <fieldset>
        <legend>Encabezado de Sección</legend>
        <label>
          Título de Sección
          <input type="text" name="analysisArticles.sectionTitle" placeholder="Análisis y Opinión" required>
        </label>
      </fieldset>

      <fieldset>
        <legend>Artículos (2 Tarjetas)</legend>
        <div id="analysis-list" class="dynamic-list"></div>
        <button type="button" class="add-item-btn" id="add-analysis">+ Agregar Artículo</button>
      </fieldset>

      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
        <button type="button" class="btn" onclick="loadContent()">Recargar</button>
      </div>
    </form>
  </div>

  <!-- Athletes Tab -->
  <div class="tab" id="tab-athletes">
    <h2>Perfiles de Atletas</h2>
    <p class="hint">Gestiona los perfiles de atletas destacados con sus estadísticas.</p>
    <form id="form-athletes">
      <fieldset>
        <legend>Encabezado de Sección</legend>
        <div class="form-row">
          <label>
            Título de Sección
            <input type="text" name="athletes.sectionTitle" placeholder="Perfiles de Atletas" required>
          </label>
          <label>
            Texto "Ver Todo"
            <input type="text" name="athletes.viewAllText" placeholder="Ver todos los atletas">
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Atletas (4 Perfiles)</legend>
        <div id="athletes-list" class="dynamic-list"></div>
        <button type="button" class="add-item-btn" id="add-athlete">+ Agregar Atleta</button>
      </fieldset>

      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
        <button type="button" class="btn" onclick="loadContent()">Recargar</button>
      </div>
    </form>
  </div>

  <!-- Multimedia Tab -->
  <div class="tab" id="tab-multimedia">
    <h2>Galería Multimedia</h2>
    <p class="hint">Gestiona videos y galerías de imágenes destacadas.</p>
    <form id="form-multimedia">
      <fieldset>
        <legend>Encabezado de Sección</legend>
        <div class="form-row">
          <label>
            Título de Sección
            <input type="text" name="multimedia.sectionTitle" placeholder="Galería Multimedia" required>
          </label>
          <label>
            Texto "Ver Todo"
            <input type="text" name="multimedia.viewAllText" placeholder="Ver toda la galería">
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Items Multimedia (6 Items)</legend>
        <div id="multimedia-list" class="dynamic-list"></div>
        <button type="button" class="add-item-btn" id="add-multimedia">+ Agregar Item</button>
      </fieldset>

      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
        <button type="button" class="btn" onclick="loadContent()">Recargar</button>
      </div>
    </form>
  </div>

  <!-- About Tab -->
  <div class="tab" id="tab-about">
    <h2>Sobre Nosotros</h2>
    <p class="hint">Configure la sección "Nuestra Misión" con estadísticas del sitio.</p>
    <form id="form-about">
      <fieldset>
        <legend>Contenido Principal</legend>
        <div class="form-row">
          <label>
            Icono
            <input type="text" name="aboutSection.icon" placeholder="🏆" maxlength="4">
          </label>
          <label>
            Título
            <input type="text" name="aboutSection.title" placeholder="Nuestra Misión" required>
          </label>
        </div>
        <label>
          Descripción
          <textarea name="aboutSection.description" rows="5" required></textarea>
        </label>
      </fieldset>

      <fieldset>
        <legend>Estadísticas (3 Stats)</legend>
        <div id="about-stats" class="stat-inputs"></div>
      </fieldset>

      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
        <button type="button" class="btn" onclick="loadContent()">Recargar</button>
      </div>
    </form>
  </div>

  <!-- Navigation Tab -->
  <div class="tab" id="tab-navigation">
    <h2>Header & Navegación</h2>
    <p class="hint">Configure el menú de navegación principal y los menús desplegables.</p>
    <form id="form-navigation">
      <fieldset>
        <legend>Menú Principal</legend>
        <div id="main-nav" class="dynamic-list"></div>
        <button type="button" class="add-item-btn" id="add-main-nav">+ Agregar Item de Menú</button>
      </fieldset>

      <fieldset>
        <legend>Dropdown: Deportes</legend>
        <div id="deportes-dropdown" class="dynamic-list"></div>
        <button type="button" class="add-item-btn" id="add-deportes">+ Agregar Deporte</button>
      </fieldset>

      <fieldset>
        <legend>Dropdown: Academia del Deporte</legend>
        <div id="academia-dropdown" class="dynamic-list"></div>
        <button type="button" class="add-item-btn" id="add-academia">+ Agregar Item</button>
      </fieldset>

      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
        <button type="button" class="btn" onclick="loadContent()">Recargar</button>
      </div>
    </form>
  </div>

  <!-- Footer Tab -->
  <div class="tab" id="tab-footer">
    <h2>Footer</h2>
    <p class="hint">Configure el pie de página con redes sociales, enlaces y contacto.</p>
    <form id="form-footer">
      <fieldset>
        <legend>Redes Sociales</legend>
        <div class="form-row">
          <label>
            Facebook
            <input type="text" name="footer.social.facebook" placeholder="#">
          </label>
          <label>
            Twitter
            <input type="text" name="footer.social.twitter" placeholder="#">
          </label>
        </div>
        <div class="form-row">
          <label>
            Instagram
            <input type="text" name="footer.social.instagram" placeholder="#">
          </label>
          <label>
            YouTube
            <input type="text" name="footer.social.youtube" placeholder="#">
          </label>
        </div>
        <label>
          LinkedIn
          <input type="text" name="footer.social.linkedin" placeholder="#">
        </label>
      </fieldset>

      <fieldset>
        <legend>Enlaces Rápidos</legend>
        <div id="quick-links" class="dynamic-list"></div>
        <button type="button" class="add-item-btn" id="add-quick-link">+ Agregar Enlace</button>
      </fieldset>

      <fieldset>
        <legend>Enlaces de Deportes</legend>
        <div id="sports-links" class="dynamic-list"></div>
        <button type="button" class="add-item-btn" id="add-sport-link">+ Agregar Enlace</button>
      </fieldset>

      <fieldset>
        <legend>Enlaces de Información</legend>
        <div id="info-links" class="dynamic-list"></div>
        <button type="button" class="add-item-btn" id="add-info-link">+ Agregar Enlace</button>
      </fieldset>

      <fieldset>
        <legend>Enlaces Legales</legend>
        <div id="legal-links" class="dynamic-list"></div>
        <button type="button" class="add-item-btn" id="add-legal-link">+ Agregar Enlace</button>
      </fieldset>

      <fieldset>
        <legend>Copyright</legend>
        <label>
          Texto de Copyright
          <input type="text" name="footer.copyright" placeholder="© 2025 AfrikaSport365. Todos los derechos reservados.">
        </label>
      </fieldset>

      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
        <button type="button" class="btn" onclick="loadContent()">Recargar</button>
      </div>
    </form>
  </div>

  <!-- Ads Tab -->
  <div class="tab" id="tab-ads">
    <h2>Anuncios / Banners</h2>
    <p class="hint">Configure los espacios publicitarios horizontal y lateral.</p>
    <form id="form-ads">
      <fieldset>
        <legend>Banner Horizontal (728x90)</legend>
        <label>
          <input type="checkbox" name="ads.horizontal.enabled" checked>
          Mostrar banner horizontal
        </label>
        <label>
          URL de la Imagen
          <input type="text" name="ads.horizontal.imageUrl" placeholder="images/ad-horizontal.jpg">
        </label>
        <label>
          URL del Enlace
          <input type="text" name="ads.horizontal.linkUrl" placeholder="#">
        </label>
        <label>
          Texto Alternativo
          <input type="text" name="ads.horizontal.altText" placeholder="Espacio Publicitario 728x90">
        </label>
      </fieldset>

      <fieldset>
        <legend>Banner Lateral (300x600)</legend>
        <label>
          <input type="checkbox" name="ads.sidebar.enabled" checked>
          Mostrar banner lateral
        </label>
        <label>
          URL de la Imagen
          <input type="text" name="ads.sidebar.imageUrl" placeholder="images/ad-sidebar.jpg">
        </label>
        <label>
          URL del Enlace
          <input type="text" name="ads.sidebar.linkUrl" placeholder="#">
        </label>
        <label>
          Texto Alternativo
          <input type="text" name="ads.sidebar.altText" placeholder="Espacio Publicitario 300x600">
        </label>
      </fieldset>

      <div class="actions">
        <button type="submit" class="btn primary">Guardar Cambios</button>
        <button type="button" class="btn" onclick="loadContent()">Recargar</button>
      </div>
    </form>
  </div>

  <!-- Legacy Tabs (from old dashboard.php) -->
  <div class="tab" id="tab-site-config">
    <h2>Configuración General (Legacy)</h2>
    <p class="hint">Esta es la configuración anterior. Use las nuevas pestañas para contenido específico.</p>
    <form id="form-site-config">
      <fieldset>
        <legend>Información del Sitio</legend>
        <label>Nombre del Sitio<input name="siteInfo.name" required></label>
        <label>Tagline<input name="siteInfo.tagline"></label>
        <label>Logo URL<input name="siteInfo.logo"></label>
      </fieldset>
      <div class="actions">
        <button type="submit" class="btn primary">Guardar en config.json</button>
      </div>
    </form>
  </div>

  <div class="tab" id="tab-afcon-data">
    <h2>Datos AFCON (Legacy)</h2>
    <p class="hint">Gestión avanzada de datos AFCON. Use la pestaña "AFCON Spotlight" para el contenido de la página principal.</p>
    <form id="form-afcon-data">
      <p>Este tab gestiona afcon-data.json (partidos completos, goleadores, etc.)</p>
      <div class="actions">
        <button type="button" class="btn" onclick="window.location.href='dashboard.php'">Ir al Dashboard Anterior</button>
      </div>
    </form>
  </div>
</section>

<script src="/admin/js/dashboard-enhanced.js"></script>

<?php include __DIR__ . '/footer.php'; ?>
