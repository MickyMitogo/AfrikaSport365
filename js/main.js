/* --- Extracted script: featured athletes tabs --- */
(function(){
  const tablist = document.getElementById('fa-tablist'); if(!tablist) return;
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = { ge: document.getElementById('panel-ge'), africa: document.getElementById('panel-af') };

  function activateTab(key, setFocus = true){
    tabs.forEach(t=>{ const k=t.dataset.key; const selected=(k===key); t.setAttribute('aria-selected', selected? 'true':'false'); t.classList.toggle('text-gray-900', selected); t.classList.toggle('text-gray-600', !selected); if(selected && setFocus) t.focus({preventScroll:true}); });
    Object.keys(panels).forEach(k=>{ const panel=panels[k]; const show=(k===key); if(show){ panel.classList.remove('hidden'); panel.removeAttribute('aria-hidden'); } else { panel.classList.add('hidden'); panel.setAttribute('aria-hidden','true'); } });
  }

  tablist.addEventListener('keydown', (e)=>{
    const active = tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'); let next=active;
    if(e.key==='ArrowRight') next=(active+1)%tabs.length; else if(e.key==='ArrowLeft') next=(active-1+tabs.length)%tabs.length; else if(e.key==='Home') next=0; else if(e.key==='End') next=tabs.length-1; else return;
    e.preventDefault(); const key=tabs[next].dataset.key; activateTab(key,true);
  });

  tabs.forEach(t=>{ t.addEventListener('click', ()=>{ activateTab(t.dataset.key,false); }); t.addEventListener('keyup',(e)=>{ if(e.key==='Enter' || e.key===' ') activateTab(t.dataset.key,false); }); });

  activateTab('ge', false);
})();

/* --- Extracted script: regional news renderer and wiring --- */
// Regional news (Spanish headlines) — two items per region with headline + lead + media
const regionalNews = {
  maghreb: [
    { title: "Argelia gana el campeonato africano de atletismo juvenil", lead: "La selección juvenil celebra su histórica primera medalla de oro, marcando un hito en el deporte del país.", media: "https://images.unsplash.com/photo-1553778562-8121e4c332a7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { title: "Marruecos anuncia plan nacional para mejorar instalaciones deportivas", lead: "Tras recientes fracasos en fútbol, el gobierno apuesta por infraestructura moderna y programas de formación.", media: "https://images.unsplash.com/photo-1761039808115-77b271985e47?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
  ],
  west: [
    { title: "Nigeria logra récord de medallas en los Juegos de África Occidental", lead: "Jóvenes atletas destacan en atletismo y judo, consolidando la posición del país en la región.", media: "https://images.unsplash.com/photo-1480264104733-84fb0b925be3?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { title: "Ghana enfrenta críticas por gestión de la federación de fútbol", lead: "Tras eliminación en eliminatorias internacionales, surgen cuestionamientos sobre la administración deportiva.", media: "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4" }
  ],
  central: [
    { title: "Camerún se posiciona como potencia emergente en voleibol", lead: "Victoria en torneo regional impulsa la reputación del país en competencias continentales.", media: "https://images.unsplash.com/photo-1553778562-8121e4c332a7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { title: "Gabón suspende temporalmente a su federación de fútbol", lead: "Irregularidades financieras provocan intervención temporal y restructuración administrativa.", media: "https://images.unsplash.com/photo-1554244933-d876deb6b2ff?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
  ],
  east: [
    { title: "Kenia domina el maratón internacional", lead: "Atletas jóvenes prometen un futuro olímpico brillante, consolidando la tradición de excelencia en atletismo.", media: "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4" },
    { title: "Uganda invierte en infraestructura deportiva", lead: "Tras fracasos recientes en remo y atletismo, el gobierno prioriza centros de entrenamiento modernos.", media: "https://via.placeholder.com/300x200?text=Uganda+Infraestructura" }
  ],
  southern: [
    { title: "Sudáfrica celebra histórica victoria en rugby femenino", lead: "El equipo nacional vence a rivales africanas, destacando el crecimiento del deporte femenino.", media: "https://images.unsplash.com/photo-1761039808115-77b271985e47?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { title: "Zimbabue sufre derrota inesperada en baloncesto", lead: "La federación nacional planea reformas tras resultados decepcionantes en torneos internacionales.", media: "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4" }
  ],
  horn: [
    { title: "Somalia organiza primer torneo de fútbol juvenil", lead: "Después de años de conflicto, el país genera gran expectativa entre jóvenes deportistas.", media: "https://images.unsplash.com/photo-1761666508300-ba97ce16bab4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { title: "Eritrea destaca en competiciones de ciclismo", lead: "Jóvenes talentos locales logran resultados sobresalientes en eventos regionales.", media: "https://plus.unsplash.com/premium_photo-1722686495487-3f8e3142a81f?q=80&w=524&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
  ]
};

// Render function: two news items side-by-side with media (image or MP4/YouTube)
function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return 'https://www.youtube.com/embed/' + u.searchParams.get('v');
    }
  } catch (e) {}
  return url;
}

function showRegion(region) {
  const container = document.getElementById('nrr-content');
  if (!container) return;
  const list = regionalNews[region] || [];
  if (list.length === 0) {
    container.innerHTML = '<div class="text-sm text-gray-500">No hay noticias para esta región.</div>';
  } else {
    // force two columns so items are side-by-side
    container.innerHTML = '<div class="grid grid-cols-2 gap-4">' + list.map(item => {
      const media = item.media || '';
      let mediaHtml = '';
      if (media.match(/\.mp4(\?|$)/) || media.match(/video/)) {
        mediaHtml = `<video width="300" height="200" controls class="rounded"><source src="${media}" type="video/mp4">Tu navegador no soporta video.</video>`;
      } else if (media.includes('youtube.com') || media.includes('youtu.be')) {
        const embed = toEmbedUrl(media);
        mediaHtml = `<iframe width="300" height="200" src="${embed}" title="video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen class="rounded"></iframe>`;
      } else if (media) {
        mediaHtml = `<a href="#" class="img-link no-hover" aria-label="Abrir imagen"><img src="${media}" alt="" style="width:300px;height:200px;object-fit:cover;" class="rounded" /></a>`;
      }
      return `
        <article class="p-3 border rounded hover:shadow-sm bg-white">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0">${mediaHtml}</div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-sm"><a href="#" class="news-link" aria-label="Leer noticia: ${item.title}">${item.title}</a></h3>
              <p class="text-xs text-gray-600 mt-1">${item.lead}</p>
            </div>
          </div>
        </article>
      `;
    }).join('') + '</div>';
  }

  // Update tab active state (visuals)
  document.querySelectorAll('#nrr-tablist [role="tab"]').forEach(btn => {
    const r = btn.dataset.region;
    const active = (r === region);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
    btn.classList.toggle('bg-blue-600', active);
    btn.classList.toggle('text-white', active);
    btn.classList.toggle('bg-gray-100', !active);
    btn.classList.toggle('text-gray-700', !active);
  });
}

// Wire tab clicks and default region
(function(){
  const tablist = document.getElementById('nrr-tablist');
  if(!tablist) return;
  tablist.addEventListener('click', (e) => {
    const btn = e.target.closest('[role="tab"]');
    if(!btn) return;
    const region = btn.dataset.region;
    showRegion(region);
  });

  // Default region: Maghreb
  document.addEventListener('DOMContentLoaded', ()=> showRegion('maghreb'));
})();

/* --- Extracted script: submenus, sliders and hero carousel --- */
// Accessible submenu for 'Otros Deportes'
(function () {
  const btn = document.getElementById('nav-otros-btn');
  const menu = document.getElementById('nav-otros-menu');
  const container = document.getElementById('nav-otros');
  if (!btn || !menu || !container) return;

  const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));

  function openMenu() {
    btn.setAttribute('aria-expanded', 'true');
    // remove hidden classes and add visible classes
    menu.classList.remove('invisible', 'opacity-0', 'translate-y-2', 'pointer-events-none');
    menu.classList.add('visible', 'opacity-100', 'translate-y-0', 'pointer-events-auto');
  }

  function closeMenu(returnFocus = true) {
    btn.setAttribute('aria-expanded', 'false');
    // remove visible classes and add hidden classes
    menu.classList.remove('visible', 'opacity-100', 'translate-y-0', 'pointer-events-auto');
    menu.classList.add('invisible', 'opacity-0', 'translate-y-2', 'pointer-events-none');
    if (returnFocus) btn.focus();
  }

  // Hover behavior (desktop): mouseenter/mouseleave on container
  container.addEventListener('mouseenter', () => openMenu());
  container.addEventListener('mouseleave', () => closeMenu(false));

  // Click/tap toggles menu (mobile)
  btn.addEventListener('click', (e) => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMenu(); else openMenu();
    e.stopPropagation();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) closeMenu(false);
  });

  // Keyboard handling
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      openMenu();
      items[0]?.focus();
      e.preventDefault();
    } else if (e.key === 'Escape') {
      closeMenu();
    } else if (e.key === 'Enter' || e.key === ' ') {
      // toggle
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) closeMenu(); else { openMenu(); items[0]?.focus(); }
      e.preventDefault();
    }
  });

  // Menu keyboard navigation
  menu.addEventListener('keydown', (e) => {
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      const next = items[(idx + 1) % items.length]; next.focus(); e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      const prev = items[(idx - 1 + items.length) % items.length]; prev.focus(); e.preventDefault();
    } else if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Close menu when focus moves outside
  menu.addEventListener('focusout', (e) => {
    // relatedTarget is the element receiving focus
    const related = e.relatedTarget;
    if (!menu.contains(related) && related !== btn) {
      closeMenu(false);
    }
  });
})();

// Accessible submenu for 'Sports Academy' (same pattern as 'Otros Deportes')
(function () {
  const btn = document.getElementById('nav-academy-btn');
  const menu = document.getElementById('nav-academy-menu');
  const container = document.getElementById('nav-academy');
  if (!btn || !menu || !container) return;

  const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));

  function openMenu() {
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.remove('invisible', 'opacity-0', 'translate-y-2', 'pointer-events-none');
    menu.classList.add('visible', 'opacity-100', 'translate-y-0', 'pointer-events-auto');
  }

  function closeMenu(returnFocus = true) {
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('visible', 'opacity-100', 'translate-y-0', 'pointer-events-auto');
    menu.classList.add('invisible', 'opacity-0', 'translate-y-2', 'pointer-events-none');
    if (returnFocus) btn.focus();
  }

  // Hover behavior (desktop)
  container.addEventListener('mouseenter', () => openMenu());
  container.addEventListener('mouseleave', () => closeMenu(false));

  // Click/tap toggles menu (mobile)
  btn.addEventListener('click', (e) => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMenu(); else openMenu();
    e.stopPropagation();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) closeMenu(false);
  });

  // Keyboard handling
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { openMenu(); items[0]?.focus(); e.preventDefault(); }
    else if (e.key === 'Escape') { closeMenu(); }
    else if (e.key === 'Enter' || e.key === ' ') { const expanded = btn.getAttribute('aria-expanded') === 'true'; if (expanded) closeMenu(); else { openMenu(); items[0]?.focus(); } e.preventDefault(); }
  });

  // Menu keyboard navigation
  menu.addEventListener('keydown', (e) => {
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { const next = items[(idx + 1) % items.length]; next.focus(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { const prev = items[(idx - 1 + items.length) % items.length]; prev.focus(); e.preventDefault(); }
    else if (e.key === 'Escape') { closeMenu(); }
  });

  // Close menu when focus moves outside
  menu.addEventListener('focusout', (e) => {
    const related = e.relatedTarget;
    if (!menu.contains(related) && related !== btn) { closeMenu(false); }
  });
})();

// Results slider: arrows, dragging, snap and optional autoplay
(function () {
  const track = document.getElementById('rs-track');
  const prev = document.getElementById('rs-prev');
  const next = document.getElementById('rs-next');
  if (!track) return;

  const cards = Array.from(track.children);
  let isDown = false, startX, scrollLeft;

  // Drag to scroll (desktop)
  track.addEventListener('pointerdown', (e) => {
    isDown = true;
    track.classList.add('is-dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1; // scroll-fast
    track.scrollLeft = scrollLeft - walk;
  });
  track.addEventListener('pointerup', (e) => { isDown = false; track.classList.remove('is-dragging'); });
  track.addEventListener('pointercancel', () => { isDown = false; track.classList.remove('is-dragging'); });

  // Arrow buttons scroll by one card width
  function cardWidth() {
    if (!cards.length) return 260;
    const style = getComputedStyle(cards[0]);
    const gap = 16; // approx gap
    return Math.round(cards[0].getBoundingClientRect().width + gap);
  }
  if (prev && next) {
    prev.addEventListener('click', () => {
      track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
      track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    });
  }

  // Optional autoplay (subtle)
  let autoInterval = null;
  function startAuto() { stopAuto(); autoInterval = setInterval(() => track.scrollBy({ left: cardWidth(), behavior: 'smooth' }), 6000); }
  function stopAuto() { if (autoInterval) { clearInterval(autoInterval); autoInterval = null; } }
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);
  startAuto();

  // Snap behavior: after scrolling stops, align nearest card
  let isScrolling;
  track.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
      const cw = cardWidth();
      const idx = Math.round(track.scrollLeft / cw);
      track.scrollTo({ left: idx * cw, behavior: 'smooth' });
    }, 150);
  });
})();
(function () {
  const root = document.getElementById('hero-carousel');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.slide'));
  const dots = Array.from(root.querySelectorAll('.hero-dot'));
  const prevBtn = root.querySelector('#hero-prev');
  const nextBtn = root.querySelector('#hero-next');

  let active = 0;
  let interval = null;
  const AUTOPLAY_MS = 5000;

  function update() {
    slides.forEach((s, i) => {
      const x = (i - active) * 100;
      s.style.transform = `translateX(${x}%)`;
    });

    dots.forEach((d, i) => {
      if (i === active) {
        d.classList.remove('bg-white/40');
        d.classList.add('bg-white/60');
      } else {
        d.classList.remove('bg-white/60');
        d.classList.add('bg-white/40');
      }
    });
  }

  function goTo(index) {
    active = (index + slides.length) % slides.length;
    update();
  }

  function next() { goTo(active + 1); }
  function prev() { goTo(active - 1); }

  function startAutoplay() {
    stopAutoplay();
    interval = setInterval(next, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  // Attach events
  dots.forEach(d => d.addEventListener('click', (e) => { goTo(Number(d.dataset.index)); startAutoplay(); }));
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });

  // pause on hover/focus
  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', startAutoplay);

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
    if (e.key === 'ArrowRight') { next(); startAutoplay(); }
  });

  // initial render + autoplay
  update();
  startAutoplay();
})();

/* --- Extracted script: marquee duration adjust --- */
// Adjust marquee speed based on content width for smoother scrolling
(function () {
  const marquee = document.querySelector('.marquee');
  if (!marquee) return;
  const wrapper = marquee.querySelector('.marquee__wrapper');

  function setDuration() {
    // width of one sequence (we duplicated items, so half of scrollWidth)
    const containerWidth = marquee.clientWidth || document.documentElement.clientWidth;
    const oneLoopWidth = wrapper.scrollWidth / 2 || 800;
    // desired speed in pixels per second
    const pxPerSecond = 120; // adjust for faster/slower scrolling
    const duration = Math.max(8, (oneLoopWidth + containerWidth) / pxPerSecond);
    wrapper.style.setProperty('--marquee-duration', duration + 's');
  }

  // init
  setDuration();
  window.addEventListener('resize', () => setDuration());
})();
