(() => {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const csrf = () => document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  function showNotice(msg, type='') {
    const n = $('#notice');
    n.textContent = msg; n.hidden = !msg;
    n.className = 'notice' + (type ? ' ' + type : '');
  }

  function switchTab(key) {
    $$('.tablink').forEach(b => b.classList.toggle('active', b.dataset.tab === key));
    $$('.tab').forEach(t => t.classList.toggle('active', t.id === `tab-${key}`));
  }

  async function apiGet(url) {
    const r = await fetch(url, { headers: { 'X-CSRF-Token': csrf() } });
    if (!r.ok) throw new Error('Failed to load');
    return r.json();
  }
  async function apiPost(url, data) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf() },
      body: JSON.stringify(data)
    });
    const json = await r.json().catch(() => ({}));
    if (!r.ok || json.success === false) throw new Error(json.message || 'Save failed');
    return json;
  }

  // Populate forms
  function setValue(form, path, value) {
    const el = form.querySelector(`[name="${CSS.escape(path)}"]`);
    if (el) {
      if (el.tagName === 'TEXTAREA') el.value = value ?? '';
      else el.value = value ?? '';
    }
  }
  function getValue(form, path) {
    const el = form.querySelector(`[name="${CSS.escape(path)}"]`);
    return el ? el.value : '';
  }

  function renderBreaking(list) {
    const wrap = $('#breaking-list');
    wrap.innerHTML = '';
    (list || []).forEach((text, i) => {
      const row = document.createElement('div');
      row.className = 'list-item';
      row.innerHTML = `<input value="${text?.toString().slice(0,140) || ''}" data-index="${i}"><button type="button" class="btn danger" data-remove="${i}">Remove</button>`;
      wrap.appendChild(row);
    });
  }
  function collectBreaking() {
    return $$('#breaking-list input').map(i => i.value).filter(Boolean).slice(0, 20);
  }

  function renderMatches(list) {
    const wrap = $('#matches-list');
    wrap.innerHTML = '';
    (list || []).forEach((m, i) => {
      const row = document.createElement('div');
      row.className = 'list-item match';
      row.innerHTML = `
        <input placeholder="Team A" value="${m.teamA || ''}" data-f="teamA" data-i="${i}">
        <input placeholder="Team B" value="${m.teamB || ''}" data-f="teamB" data-i="${i}">
        <input placeholder="A" value="${m.scoreA ?? ''}" data-f="scoreA" data-i="${i}">
        <input placeholder="B" value="${m.scoreB ?? ''}" data-f="scoreB" data-i="${i}">
        <select data-f="status" data-i="${i}">
          ${['upcoming','live','finished'].map(s => `<option ${m.status===s?'selected':''} value="${s}">${s}</option>`).join('')}
        </select>
        <button type="button" class="btn danger" data-remove-match="${i}">Remove</button>`;
      wrap.appendChild(row);
    });
  }
  function collectMatches() {
    const rows = $$('#matches-list .list-item');
    return rows.map((row, idx) => {
      const get = f => row.querySelector(`[data-f="${f}"][data-i="${idx}"]`);
      return {
        teamA: get('teamA').value.trim(),
        teamB: get('teamB').value.trim(),
        scoreA: Number(get('scoreA').value) || 0,
        scoreB: Number(get('scoreB').value) || 0,
        status: get('status').value
      };
    }).filter(m => m.teamA && m.teamB);
  }

  function renderScorers(list) {
    const wrap = $('#scorers-list');
    wrap.innerHTML = '';
    (list || []).forEach((p, i) => {
      const row = document.createElement('div');
      row.className = 'list-item scorer';
      row.innerHTML = `
        <input placeholder="Player" value="${p.name || ''}" data-f="name" data-i="${i}">
        <input placeholder="Goals" value="${p.goals ?? ''}" data-f="goals" data-i="${i}">
        <button type="button" class="btn danger" data-remove-scorer="${i}">Remove</button>`;
      wrap.appendChild(row);
    });
  }
  function collectScorers() {
    const rows = $$('#scorers-list .list-item');
    return rows.map((row, idx) => {
      const get = f => row.querySelector(`[data-f="${f}"][data-i="${idx}"]`);
      return { name: get('name').value.trim(), goals: Number(get('goals').value) || 0 };
    }).filter(p => p.name);
  }

  async function loadAll() {
    try {
      const [conf, afcon] = await Promise.all([
        apiGet('/admin/api/get-config.php'),
        apiGet('/admin/api/get-afcon.php')
      ]);
      // Site config
      const fs = $('#form-site-config');
      setValue(fs, 'siteInfo.name', conf.siteInfo?.name);
      setValue(fs, 'siteInfo.tagline', conf.siteInfo?.tagline);
      setValue(fs, 'siteInfo.logo', conf.siteInfo?.logo);
      setValue(fs, 'hero.badge', conf.hero?.badge);
      setValue(fs, 'hero.title', conf.hero?.title);
      setValue(fs, 'hero.excerpt', conf.hero?.excerpt);
      setValue(fs, 'hero.backgroundImage', conf.hero?.backgroundImage);
      setValue(fs, 'hero.ctaText', conf.hero?.ctaText);
      setValue(fs, 'hero.ctaLink', conf.hero?.ctaLink);
      setValue(fs, 'hero.meta.date', conf.hero?.meta?.date);
      setValue(fs, 'hero.meta.author', conf.hero?.meta?.author);
      setValue(fs, 'hero.meta.readTime', conf.hero?.meta?.readTime);

      // About section
      setValue(fs, 'aboutSection.icon', conf.aboutSection?.icon);
      setValue(fs, 'aboutSection.title', conf.aboutSection?.title);
      setValue(fs, 'aboutSection.description', conf.aboutSection?.description);
      setValue(fs, 'aboutSection.stats.0.value', conf.aboutSection?.stats?.[0]?.value);
      setValue(fs, 'aboutSection.stats.0.label', conf.aboutSection?.stats?.[0]?.label);
      setValue(fs, 'aboutSection.stats.1.value', conf.aboutSection?.stats?.[1]?.value);
      setValue(fs, 'aboutSection.stats.1.label', conf.aboutSection?.stats?.[1]?.label);
      setValue(fs, 'aboutSection.stats.2.value', conf.aboutSection?.stats?.[2]?.value);
      setValue(fs, 'aboutSection.stats.2.label', conf.aboutSection?.stats?.[2]?.label);

      renderBreaking(conf.breakingNews || []);

      // AFCON
      const fa = $('#form-afcon');
      setValue(fa, 'tournament.name', afcon.tournament?.name);
      setValue(fa, 'tournament.fullName', afcon.tournament?.fullName);
      setValue(fa, 'tournament.host', afcon.tournament?.host);
      setValue(fa, 'tournament.dates', afcon.tournament?.dates);
      setValue(fa, 'tournament.logo', afcon.tournament?.logo);
      renderMatches(afcon.liveMatches || []);
      renderScorers(afcon.topScorers || []);

    } catch (e) {
      showNotice('Failed to load data. Please refresh.', 'error');
    }
  }

  // Tab switching
  $$('.tablink').forEach(btn => btn.addEventListener('click', () => {
    if (btn.classList.contains('disabled')) return;
    switchTab(btn.dataset.tab);
  }));

  // Breaking News actions
  $('#add-breaking')?.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'list-item';
    row.innerHTML = `<input value=""><button type=button class="btn danger" data-remove-new>Remove</button>`;
    $('#breaking-list').appendChild(row);
  });
  $('#breaking-list')?.addEventListener('click', (e) => {
    const t = e.target;
    if (t.matches('[data-remove], [data-remove-new]')) t.closest('.list-item')?.remove();
  });

  // Matches actions
  $('#add-match')?.addEventListener('click', () => {
    const list = $('#matches-list');
    const idx = $$('#matches-list .list-item').length;
    const row = document.createElement('div');
    row.className = 'list-item match';
    row.innerHTML = `
      <input placeholder="Team A" data-f="teamA" data-i="${idx}">
      <input placeholder="Team B" data-f="teamB" data-i="${idx}">
      <input placeholder="A" data-f="scoreA" data-i="${idx}">
      <input placeholder="B" data-f="scoreB" data-i="${idx}">
      <select data-f="status" data-i="${idx}">
        <option value="upcoming">upcoming</option>
        <option value="live">live</option>
        <option value="finished">finished</option>
      </select>
      <button type="button" class="btn danger" data-remove-match="${idx}">Remove</button>`;
    list.appendChild(row);
  });
  $('#matches-list')?.addEventListener('click', (e) => {
    const t = e.target;
    if (t.matches('[data-remove-match]')) t.closest('.list-item')?.remove();
  });

  // Scorers actions
  $('#add-scorer')?.addEventListener('click', () => {
    const list = $('#scorers-list');
    const idx = $$('#scorers-list .list-item').length;
    const row = document.createElement('div');
    row.className = 'list-item scorer';
    row.innerHTML = `
      <input placeholder="Player" data-f="name" data-i="${idx}">
      <input placeholder="Goals" data-f="goals" data-i="${idx}">
      <button type="button" class="btn danger" data-remove-scorer="${idx}">Remove</button>`;
    list.appendChild(row);
  });
  $('#scorers-list')?.addEventListener('click', (e) => {
    const t = e.target;
    if (t.matches('[data-remove-scorer]')) t.closest('.list-item')?.remove();
  });

  // Preview
  function openPreview(data) {
    $('#preview-json').textContent = JSON.stringify(data, null, 2);
    $('#preview-dialog').showModal();
  }
  $('#close-preview')?.addEventListener('click', () => $('#preview-dialog').close());
  $$('[data-preview="config"]').forEach(btn => btn.addEventListener('click', () => {
    const payload = collectConfigPayload();
    openPreview(payload);
  }));
  $$('[data-preview="afcon"]').forEach(btn => btn.addEventListener('click', () => {
    const payload = collectAfconPayload();
    openPreview(payload);
  }));

  function collectConfigPayload() {
    const fs = $('#form-site-config');
    return {
      siteInfo: {
        name: getValue(fs, 'siteInfo.name'),
        tagline: getValue(fs, 'siteInfo.tagline'),
        logo: getValue(fs, 'siteInfo.logo'),
      },
      hero: {
        badge: getValue(fs, 'hero.badge'),
        title: getValue(fs, 'hero.title'),
        excerpt: getValue(fs, 'hero.excerpt'),
        backgroundImage: getValue(fs, 'hero.backgroundImage'),
        ctaText: getValue(fs, 'hero.ctaText'),
        ctaLink: getValue(fs, 'hero.ctaLink'),
        meta: {
          date: getValue(fs, 'hero.meta.date'),
          author: getValue(fs, 'hero.meta.author'),
          readTime: getValue(fs, 'hero.meta.readTime')
        }
      },
      aboutSection: {
        icon: getValue(fs, 'aboutSection.icon'),
        title: getValue(fs, 'aboutSection.title'),
        description: getValue(fs, 'aboutSection.description'),
        stats: [
          {
            value: getValue(fs, 'aboutSection.stats.0.value'),
            label: getValue(fs, 'aboutSection.stats.0.label')
          },
          {
            value: getValue(fs, 'aboutSection.stats.1.value'),
            label: getValue(fs, 'aboutSection.stats.1.label')
          },
          {
            value: getValue(fs, 'aboutSection.stats.2.value'),
            label: getValue(fs, 'aboutSection.stats.2.label')
          }
        ]
      },
      breakingNews: collectBreaking()
    };
  }
  function collectAfconPayload() {
    const fa = $('#form-afcon');
    return {
      tournament: {
        name: getValue(fa, 'tournament.name'),
        fullName: getValue(fa, 'tournament.fullName'),
        host: getValue(fa, 'tournament.host'),
        dates: getValue(fa, 'tournament.dates'),
        logo: getValue(fa, 'tournament.logo'),
      },
      liveMatches: collectMatches(),
      topScorers: collectScorers()
    };
  }

  // Save handlers
  $('#form-site-config')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const payload = collectConfigPayload();
      await apiPost('/admin/api/save-config.php', payload);
      showNotice('Config saved successfully.');
    } catch (err) {
      showNotice(err.message || 'Save failed', 'error');
    }
  });
  $('#form-breaking-news')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const payload = collectConfigPayload();
      await apiPost('/admin/api/save-config.php', payload);
      showNotice('Breaking news saved successfully.');
    } catch (err) {
      showNotice(err.message || 'Save failed', 'error');
    }
  });
  $('#form-afcon')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const payload = collectAfconPayload();
      await apiPost('/admin/api/save-afcon.php', payload);
      showNotice('AFCON data saved successfully.');
    } catch (err) {
      showNotice(err.message || 'Save failed', 'error');
    }
  });

  // Initial state
  switchTab('site-config');
  loadAll();
})();
