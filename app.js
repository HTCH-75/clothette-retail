// ─── STATE ────────────────────────────────────────────────────────────────────
let currentUser = null;
let currentBrand = null;
let currentPage = null;

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  const user = USERS[email];
  if (!user) { alert('Email introuvable'); return; }
  currentUser = { email, ...user };
  currentBrand = user.role === 'brand' ? user.brand : Object.keys(BRANDS)[0];
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  renderNav();
  renderSidebar();
  navigateTo('overview');
}

function doLogout() {
  currentUser = null; currentBrand = null; currentPage = null;
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

function setDemo(role) {
  if (role === 'admin') {
    document.getElementById('loginEmail').value = 'admin@clothette.com';
    document.getElementById('loginPass').value = 'admin123';
  } else {
    document.getElementById('loginEmail').value = 'lesdeux@clothette.com';
    document.getElementById('loginPass').value = 'lesdeux123';
  }
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function renderNav() {
  const brand = BRANDS[currentBrand];
  document.getElementById('navRole').textContent = currentUser.role === 'admin' ? 'Administrateur' : 'Marque';
  document.getElementById('navAvatar').textContent = currentUser.initials;
  document.getElementById('navBrandBadge').textContent = currentUser.role === 'admin' ? '' : currentUser.name;
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function renderSidebar() {
  const isAdmin = currentUser.role === 'admin';
  let html = '';

  if (isAdmin) {
    html += `<div class="sidebar-section">Marques</div>`;
    Object.values(BRANDS).forEach(b => {
      html += `<div class="sidebar-brand-item ${currentBrand === b.id ? 'active' : ''}" onclick="switchBrand('${b.id}')">
        <div style="width:8px;height:8px;border-radius:50%;background:${b.color};flex-shrink:0"></div>
        ${b.name}
      </div>`;
    });
    html += `<div style="height:0.5px;background:var(--border);margin:.5rem 1.25rem"></div>`;
  }

  const navItems = [
    { id:'overview',   label:'Vue d\'ensemble', icon:iconGrid() },
    { id:'stocks',     label:'Stocks',           icon:iconBox() },
    { id:'depot',      label:'Dépôt de fichiers',icon:iconUpload() },
    { id:'catalogue',  label:'Catalogue',        icon:iconList() },
    { id:'historique', label:'Historique imports',icon:iconClock() },
  ];

  html += `<div class="sidebar-section">Navigation</div>`;
  navItems.forEach(item => {
    html += `<div class="sidebar-item ${currentPage === item.id ? 'active' : ''}" onclick="navigateTo('${item.id}')">
      ${item.icon} ${item.label}
    </div>`;
  });

  document.getElementById('sidebar').innerHTML = html;
}

function switchBrand(brandId) {
  currentBrand = brandId;
  renderSidebar();
  navigateTo('overview');
}

// ─── ROUTER ───────────────────────────────────────────────────────────────────
function navigateTo(page) {
  currentPage = page;
  renderSidebar();
  const main = document.getElementById('mainContent');
  switch(page) {
    case 'overview':   main.innerHTML = renderOverview(); break;
    case 'stocks':     main.innerHTML = renderStocks(); break;
    case 'depot':      main.innerHTML = renderDepot(); break;
    case 'catalogue':  main.innerHTML = renderCatalogue(); break;
    case 'historique': main.innerHTML = renderHistorique(); break;
    default: main.innerHTML = '<p>Page introuvable</p>';
  }
  bindEvents(page);
}

// ─── OVERVIEW PAGE ────────────────────────────────────────────────────────────
function renderOverview() {
  const brand = BRANDS[currentBrand];
  const s = SALES_SUMMARY[currentBrand];
  const stocks = STOCKS[currentBrand] || [];
  const missing = MISSING_REFS[currentBrand] || [];
  const ruptures = stocks.filter(r => (r.glh + r.glce) === 0).length;
  const critiques = stocks.filter(r => (r.glh + r.glce) > 0 && (r.glh + r.glce) < r.min).length;
  const maxDay = Math.max(...s.byDay.map(d => d.val));
  const maxRef = s.topRefs[0]?.qty || 1;

  return `
  <div class="page-header">
    <div class="page-title">Bonjour, ${brand.name} 👋</div>
    <div class="page-sub">Semaine du ${s.week}</div>
  </div>

  <div class="metric-row">
    <div class="metric"><div class="metric-label">Ventes semaine</div><div class="metric-value" style="color:var(--success)">${s.total}</div></div>
    <div class="metric"><div class="metric-label">Retours</div><div class="metric-value" style="color:var(--danger)">${s.returns}</div></div>
    <div class="metric"><div class="metric-label">CA TTC</div><div class="metric-value" style="color:var(--info)">${s.ca.toLocaleString('fr-FR')} €</div></div>
    <div class="metric"><div class="metric-label">Sell-through</div><div class="metric-value">${s.sellThrough}%</div></div>
    <div class="metric"><div class="metric-label">Ruptures</div><div class="metric-value" style="color:var(--danger)">${ruptures}</div></div>
    <div class="metric"><div class="metric-label">Critiques</div><div class="metric-value" style="color:var(--warning)">${critiques}</div></div>
  </div>

  ${missing.length > 0 ? `
  <div class="alert-banner" style="background:var(--warning-bg);border:0.5px solid #EF9F27;color:var(--warning)">
    <strong>${missing.length} référence(s) introuvable(s)</strong> dans le catalogue — 
    <span style="cursor:pointer;text-decoration:underline" onclick="navigateTo('catalogue')">Résoudre dans le catalogue</span>
  </div>` : ''}

  <div class="grid2">
    <div class="card">
      <div class="card-title">Ventes par jour</div>
      <div style="display:flex;align-items:flex-end;gap:6px;height:80px;margin-bottom:6px">
        ${s.byDay.map(d => {
          const pct = Math.round((d.val / maxDay) * 100);
          const isWE = d.label.startsWith('Sa') || d.label.startsWith('Di');
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
            <div style="font-size:10px;color:var(--muted)">${d.val}</div>
            <div style="width:100%;height:${pct}%;border-radius:3px 3px 0 0;background:${isWE ? brand.color : '#B5D4F4'}"></div>
          </div>`;
        }).join('')}
      </div>
      <div style="display:flex;gap:6px">
        ${s.byDay.map(d => `<div style="flex:1;text-align:center;font-size:10px;color:var(--muted)">${d.label.slice(0,2)}</div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-title">Par point de vente</div>
      ${Object.entries(s.byStore).map(([store, qty]) => {
        const pct = Math.round((qty / s.total) * 100);
        return `<div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
            <span>${STORES[store]?.label || store}</span>
            <span style="font-weight:500">${qty} <span style="color:var(--muted);font-weight:400">(${pct}%)</span></span>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${brand.color}"></div></div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <div class="card">
    <div class="card-title">Top ${s.topRefs.length} références</div>
    ${s.topRefs.map((r, i) => `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <div style="font-size:12px;color:var(--muted);min-width:16px">${i+1}.</div>
        <div style="min-width:140px;font-size:12px;font-family:monospace">${r.ref}</div>
        <div style="flex:1;height:5px;background:var(--border);border-radius:3px;overflow:hidden">
          <div style="width:${Math.round(r.qty/maxRef*100)}%;height:100%;background:${brand.color};border-radius:3px"></div>
        </div>
        <div style="font-size:12px;font-weight:500;min-width:20px;text-align:right">${r.qty}</div>
      </div>
    `).join('')}
  </div>`;
}

// ─── STOCKS PAGE ──────────────────────────────────────────────────────────────
function renderStocks() {
  const brand = BRANDS[currentBrand];
  const stocks = STOCKS[currentBrand] || [];
  const hasGLCE = brand.stores.includes('GLCE');

  return `
  <div class="page-header">
    <div class="page-title">Stocks — ${brand.name}</div>
    <div class="page-sub">Vue en temps réel · ${brand.stores.map(s => STORES[s].label).join(' + ')}</div>
  </div>
  <div class="search-bar">
    <input class="search-input" id="stockSearch" placeholder="Rechercher une référence ou un article..." oninput="filterStocksTable(this.value)">
    <select class="filter-select" id="stockCatFilter" onchange="filterStocksTable(document.getElementById('stockSearch').value)">
      <option value="">Toutes catégories</option>
      ${[...new Set(stocks.map(s => s.cat))].map(c => `<option>${c}</option>`).join('')}
    </select>
    <select class="filter-select" id="stockStatusFilter" onchange="filterStocksTable(document.getElementById('stockSearch').value)">
      <option value="">Tous les statuts</option>
      <option value="ok">En stock</option>
      <option value="warn">Critique</option>
      <option value="danger">Rupture</option>
    </select>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr>
        <th style="width:20%">Référence</th>
        <th style="width:25%">Article</th>
        <th style="width:8%">Taille</th>
        <th style="width:10%">Catégorie</th>
        <th style="width:12%">Stock GLH</th>
        ${hasGLCE ? `<th style="width:12%">Stock GLCE</th>` : ''}
        <th style="width:13%">Statut</th>
      </tr></thead>
      <tbody id="stocksTableBody">${renderStocksRows(stocks, hasGLCE)}</tbody>
    </table>
  </div>`;
}

function renderStocksRows(data, hasGLCE) {
  if (!data.length) return `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:2rem">Aucun résultat</td></tr>`;
  return data.map(r => {
    const total = r.glh + (hasGLCE ? r.glce : 0);
    const status = total === 0 ? 'danger' : total < r.min ? 'warn' : 'ok';
    const statusLabel = status === 'ok' ? 'En stock' : status === 'warn' ? 'Critique' : 'Rupture';
    const glhColor = r.glh === 0 ? 'var(--danger)' : r.glh < r.min ? 'var(--warning)' : 'var(--ink)';
    const glceColor = r.glce === 0 ? 'var(--danger)' : r.glce < r.min ? 'var(--warning)' : 'var(--ink)';
    return `<tr>
      <td class="mono">${r.ref}</td>
      <td style="color:var(--muted)">${r.style}</td>
      <td>${r.size}</td>
      <td><span class="badge badge-accent" style="font-size:10px">${r.cat}</span></td>
      <td style="font-weight:500;color:${glhColor}">${r.glh}</td>
      ${hasGLCE ? `<td style="font-weight:500;color:${glceColor}">${r.glce}</td>` : ''}
      <td><span class="badge badge-${status}">${statusLabel}</span></td>
    </tr>`;
  }).join('');
}

function filterStocksTable(search) {
  const brand = BRANDS[currentBrand];
  const hasGLCE = brand.stores.includes('GLCE');
  const cat = document.getElementById('stockCatFilter')?.value || '';
  const statusF = document.getElementById('stockStatusFilter')?.value || '';
  let data = STOCKS[currentBrand] || [];
  if (search) data = data.filter(r => r.ref.toLowerCase().includes(search.toLowerCase()) || r.style.toLowerCase().includes(search.toLowerCase()));
  if (cat) data = data.filter(r => r.cat === cat);
  if (statusF) {
    data = data.filter(r => {
      const total = r.glh + (hasGLCE ? r.glce : 0);
      const status = total === 0 ? 'danger' : total < r.min ? 'warn' : 'ok';
      return status === statusF;
    });
  }
  const tbody = document.getElementById('stocksTableBody');
  if (tbody) tbody.innerHTML = renderStocksRows(data, hasGLCE);
}

// ─── DEPOT PAGE ───────────────────────────────────────────────────────────────
function renderDepot() {
  const brand = BRANDS[currentBrand];
  const history = IMPORT_HISTORY[currentBrand] || [];
  return `
  <div class="page-header">
    <div class="page-title">Dépôt de fichiers</div>
    <div class="page-sub">Déposez vos fichiers — traitement automatique</div>
  </div>
  <div class="grid2">
    <div>
      <div class="section-label" style="margin-top:0">Fichier de ventes hebdomadaire</div>
      <div class="drop-zone-sm" id="dropVentes" onclick="document.getElementById('inputVentes').click()">
        ${iconUploadLg()}
        <div style="font-size:13px;font-weight:500;margin-bottom:3px">Glisser ou cliquer</div>
        <div style="font-size:12px;color:var(--muted)">Export ticketing GL · .xls / .xlsx</div>
        <input type="file" id="inputVentes" accept=".xls,.xlsx" style="display:none">
      </div>
    </div>
    <div>
      <div class="section-label" style="margin-top:0">Bon de livraison réassort</div>
      <div class="drop-zone-sm" id="dropReassort" onclick="document.getElementById('inputReassort').click()">
        ${iconUploadLg()}
        <div style="font-size:13px;font-weight:500;margin-bottom:3px">Glisser ou cliquer</div>
        <div style="font-size:12px;color:var(--muted)">Delivery Note B2B · .xls / .xlsx</div>
        <input type="file" id="inputReassort" accept=".xls,.xlsx" style="display:none">
      </div>
    </div>
  </div>
  <div id="uploadFeedback"></div>
  <div class="section-label">Fichiers déposés récemment</div>
  <div class="card card-flush">
    ${history.map(h => `
    <div class="file-row" style="padding:.75rem 1.25rem">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="file-icon ${h.type === 'reassort' ? '' : ''}" style="background:${h.type === 'ventes' ? 'var(--info-bg)' : 'var(--accent-light)'};color:${h.type === 'ventes' ? 'var(--info)' : 'var(--accent-text)'}">XLS</div>
        <div>
          <div style="font-size:13px;font-weight:500">${h.file}</div>
          <div style="font-size:11px;color:var(--muted)">${h.date} · ${h.lines} lignes · <span class="badge badge-${h.type === 'ventes' ? 'info' : 'accent'}" style="font-size:10px">${h.type}</span></div>
        </div>
      </div>
      <span class="badge badge-${h.status === 'ok' ? 'ok' : 'warn'}">${h.status === 'ok' ? 'importé' : 'partiel'}</span>
    </div>`).join('')}
  </div>`;
}

// ─── CATALOGUE PAGE ───────────────────────────────────────────────────────────
function renderCatalogue() {
  const brand = BRANDS[currentBrand];
  const missing = MISSING_REFS[currentBrand] || [];
  const stocks = STOCKS[currentBrand] || [];
  return `
  <div class="page-header">
    <div class="page-title">Catalogue produits</div>
    <div class="page-sub">${stocks.length} références actives · mise à jour le 16 janv. 2026</div>
  </div>
  <div class="section-label" style="margin-top:0">Collections actives</div>
  <div class="collection-card collection-active">
    <div>
      <div style="font-size:13px;font-weight:500">AW25 — Automne Hiver 2025</div>
      <div style="font-size:12px;color:var(--muted)">2 847 références · chargé le 16 janv. 2026</div>
    </div>
    <span class="badge badge-ok">actif</span>
  </div>
  <div class="collection-card">
    <div>
      <div style="font-size:13px;font-weight:500">SS26 — Printemps Été 2026</div>
      <div style="font-size:12px;color:var(--muted)">1 048 références · chargé le 16 janv. 2026</div>
    </div>
    <span class="badge badge-info">nouveau</span>
  </div>

  <div class="section-label">Mettre à jour le catalogue</div>
  <div class="drop-zone" id="dropCatalogue" onclick="document.getElementById('inputCatalogue').click()">
    ${iconUploadLg()}
    <div style="font-size:14px;font-weight:500;margin-bottom:.3rem">Glissez le catalogue de la nouvelle collection</div>
    <div style="font-size:12px;color:var(--muted)">Format .xlsx · colonnes : Season, Style no., Style, Color, Color Code, Size, Category, EAN</div>
    <input type="file" id="inputCatalogue" accept=".xlsx,.xls" style="display:none">
  </div>
  <div id="catFeedback"></div>

  ${missing.length > 0 ? `
  <div class="section-label">Références introuvables (${missing.length})</div>
  <div class="table-wrap">
    <table>
      <thead><tr>
        <th style="width:30%">Référence</th>
        <th style="width:30%">Article</th>
        <th style="width:25%">Couleur / Taille</th>
        <th style="width:8%">Qté</th>
        <th style="width:7%">Action</th>
      </tr></thead>
      <tbody>
        ${missing.map((r, i) => `<tr>
          <td class="mono">${r.ref}</td>
          <td style="color:var(--muted)">${r.style}</td>
          <td style="color:var(--muted);font-size:12px">${r.colorSize}</td>
          <td style="font-weight:500">${r.qty}</td>
          <td><button class="btn btn-sm" onclick="resolveRef(${i})">Résoudre</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>` : `
  <div class="alert-banner" style="background:var(--success-bg);border:0.5px solid #97C459;color:var(--success);margin-top:1rem">
    Toutes les références sont à jour dans le catalogue ✓
  </div>`}`;
}

// ─── HISTORIQUE PAGE ──────────────────────────────────────────────────────────
function renderHistorique() {
  const brand = BRANDS[currentBrand];
  const history = IMPORT_HISTORY[currentBrand] || [];
  return `
  <div class="page-header">
    <div class="page-title">Historique des imports</div>
    <div class="page-sub">${history.length} imports enregistrés</div>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr>
        <th style="width:32%">Fichier</th>
        <th style="width:13%">Type</th>
        <th style="width:18%">Date</th>
        <th style="width:10%">Lignes</th>
        <th style="width:13%">Statut</th>
        <th style="width:14%">Détail</th>
      </tr></thead>
      <tbody>
        ${history.map(h => `<tr>
          <td style="font-size:12px">${h.file}</td>
          <td><span class="badge badge-${h.type === 'ventes' ? 'info' : 'accent'}">${h.type}</span></td>
          <td style="color:var(--muted);font-size:12px">${h.date}</td>
          <td>${h.lines}</td>
          <td><span class="badge badge-${h.status === 'ok' ? 'ok' : 'warn'}">${h.status === 'ok' ? 'OK' : 'Partiel'}</span></td>
          <td><button class="btn btn-sm" onclick="alert('Détail disponible après déploiement avec base de données')">Voir</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
function bindEvents(page) {
  if (page === 'depot') {
    const inputV = document.getElementById('inputVentes');
    const inputR = document.getElementById('inputReassort');
    if (inputV) inputV.addEventListener('change', e => showUploadFeedback(e.target.files[0], 'ventes'));
    if (inputR) inputR.addEventListener('change', e => showUploadFeedback(e.target.files[0], 'reassort'));
    setupDrop('dropVentes', f => showUploadFeedback(f, 'ventes'));
    setupDrop('dropReassort', f => showUploadFeedback(f, 'reassort'));
  }
  if (page === 'catalogue') {
    const inputC = document.getElementById('inputCatalogue');
    if (inputC) inputC.addEventListener('change', e => showCatFeedback(e.target.files[0]));
    setupDrop('dropCatalogue', f => showCatFeedback(f));
  }
}

function setupDrop(id, cb) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('dragover'); });
  el.addEventListener('dragleave', () => el.classList.remove('dragover'));
  el.addEventListener('drop', e => { e.preventDefault(); el.classList.remove('dragover'); if (e.dataTransfer.files[0]) cb(e.dataTransfer.files[0]); });
}

function showUploadFeedback(file, type) {
  if (!file) return;
  const fb = document.getElementById('uploadFeedback');
  fb.innerHTML = `<div class="alert-banner" style="background:var(--success-bg);border:0.5px solid #97C459;color:var(--success);margin-top:.5rem">
    <strong>Fichier reçu : ${file.name}</strong><br>
    <span style="font-size:12px">Le fichier de ${type} est en cours de traitement. Les stocks seront mis à jour automatiquement.</span>
  </div>`;
}

function showCatFeedback(file) {
  if (!file) return;
  const fb = document.getElementById('catFeedback');
  fb.innerHTML = `<div class="alert-banner" style="background:var(--success-bg);border:0.5px solid #97C459;color:var(--success);margin-top:.75rem">
    <strong>Catalogue mis à jour : ${file.name}</strong><br>
    <span style="font-size:12px">Les nouvelles références ont été ajoutées. Les références introuvables seront résolues automatiquement si elles figurent dans ce catalogue.</span>
  </div>`;
}

function resolveRef(i) {
  const missing = MISSING_REFS[currentBrand];
  if (missing && missing[i]) {
    missing.splice(i, 1);
    navigateTo('catalogue');
  }
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
function iconGrid()   { return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>`; }
function iconBox()    { return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="4" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M4 4V3a3 3 0 016 0v1" stroke="currentColor" stroke-width="1.2"/></svg>`; }
function iconUpload() { return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 4l3-3 3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`; }
function iconList()   { return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M4 5h6M4 7h6M4 9h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`; }
function iconClock()  { return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M7 4v3l2 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`; }
function iconUploadLg() { return `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" style="margin:0 auto 8px;display:block;opacity:.35"><rect x="2" y="2" width="24" height="24" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M14 18V10M10 14l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
