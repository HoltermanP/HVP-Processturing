/* ==========================================================================
   Onderzoeken — register voor conditionerende (bureau-)onderzoeken.
   Zelfde opzet als registers.js (vergunningen/ZRO): hangt aan werkpakketten en
   wordt via Neon (db.js) bewaard. Doel: per project/APD/werkpakket bijhouden
   wat er is uitgezet aan onderzoek (Natura 2000, bodem, flora & fauna,
   archeologie, NGE, kabels & leidingen, geotechniek, water, houtopstanden,
   akoestiek, luchtkwaliteit, externe veiligheid, asbest, cultuurhistorie,
   m.e.r., overig), wanneer en wanneer het terug wordt verwacht, en of er
   vervolgonderzoek nodig is of de geldigheid verloopt.
   Hergebruikt globals uit registers.js: magReg(), nieuwId(), wpById(),
   openModal()/sluitModal(). Laadt daarom ná registers.js.
   ========================================================================== */
'use strict';

/* ------------------------------- Constanten ------------------------------ */
const OZ_CATS = [
  ['bodem', 'Bodemonderzoek'],
  ['floraFauna', 'Flora & fauna (Wnb soorten)'],
  ['natura2000', 'Natura 2000 / stikstof (AERIUS)'],
  ['archeologie', 'Archeologie'],
  ['nge', 'Niet-gesprongen explosieven'],
  ['kabelsLeidingen', 'Kabels & leidingen (KLIC)'],
  ['geotechniek', 'Geotechnisch onderzoek'],
  ['water', 'Watertoets / waterparagraaf'],
  ['houtopstanden', 'Houtopstanden (kapmelding)'],
  ['akoestiek', 'Akoestiek (geluid & trillingen)'],
  ['luchtkwaliteit', 'Luchtkwaliteit'],
  ['externeVeiligheid', 'Externe veiligheid'],
  ['asbest', 'Asbest'],
  ['cultuurhistorie', 'Cultuurhistorie & landschap'],
  ['mer', 'M.e.r.-(beoordeling)'],
  ['overig', 'Overig onderzoek'],
];
const OZ_STATUS = {
  nodig:    { label: 'Nog uit te zetten', kleur: '#94a3b8' },
  uitgezet: { label: 'Uitgezet',          kleur: '#0ea5e9' },
  loopt:    { label: 'In uitvoering',     kleur: '#f59e0b' },
  gereed:   { label: 'Gereed',            kleur: '#10b981' },
  nvt:      { label: 'N.v.t.',            kleur: '#cbd5e1' },
};

/* -------------------------------- Helpers -------------------------------- */
function ozLabelCat(c) { const m = OZ_CATS.find((x) => x[0] === c); return m ? m[1] : c; }
function onderzoekenVoor(wpId) { return (State.onderzoeken || []).filter((o) => o.wpId === wpId); }

// Indeling voor filtering/telling.
function ozGroep(o) {
  if (o.status === 'nodig') return 'nodig';
  if (o.status === 'uitgezet' || o.status === 'loopt') return 'lopend';
  if (o.status === 'gereed') return 'gereed';
  return 'overig';
}
function ozOvertijd(o) {
  if (o.status === 'gereed' || o.status === 'nvt') return false;
  const d = parseDatum(o.verwachtOp);
  return d && d < VANDAAG;
}
function ozNaderend(o) {
  if (o.status === 'gereed' || o.status === 'nvt') return false;
  const d = parseDatum(o.verwachtOp);
  return d && d >= VANDAAG && dagenVerschil(VANDAAG, d) <= 21;
}
function ozGeldigheidVerlopen(o) {
  const d = parseDatum(o.geldigTot);
  return d && d < VANDAAG;
}
function ozGeldigheidNaderend(o) {
  const d = parseDatum(o.geldigTot);
  return d && d >= VANDAAG && dagenVerschil(VANDAAG, d) <= 90;
}

/* ------------------------------ Overzichtspagina -------------------------- */
function ozGefilterd() {
  const f = State.filters; const zoek = (f.zoek || '').toLowerCase();
  return (State.onderzoeken || []).map((o) => ({ o, wp: wpById(o.wpId) })).filter(({ o, wp }) => {
    if (!wp) return false;
    if (f.project && wp.project !== f.project) return false;
    if (f.apd && apdVan(wp) !== f.apd) return false;
    if (f.engineer && wp.engineer !== f.engineer) return false;
    if (State.ozCatFilter && o.categorie !== State.ozCatFilter) return false;
    if (zoek) {
      const blob = `${wp.project} ${apdVan(wp)} ${wp.wp} ${o.omschrijving} ${o.bureau} ${ozLabelCat(o.categorie)}`.toLowerCase();
      if (!blob.includes(zoek)) return false;
    }
    return true;
  });
}

function renderOnderzoeken() {
  if (!el('#ozKpis')) return;
  const filter = State.ozFilter || 'alle';
  const alle = ozGefilterd();
  const tel = {
    totaal: alle.length,
    nodig: alle.filter(({ o }) => ozGroep(o) === 'nodig').length,
    lopend: alle.filter(({ o }) => ozGroep(o) === 'lopend').length,
    gereed: alle.filter(({ o }) => ozGroep(o) === 'gereed').length,
    overtijd: alle.filter(({ o }) => ozOvertijd(o)).length,
    vervolg: alle.filter(({ o }) => o.vervolgNodig).length,
  };
  const tiles = [
    { tf: 'alle', cls: 'blauw', val: tel.totaal, label: 'totaal' },
    { tf: 'nodig', cls: '', val: tel.nodig, label: 'nog uit te zetten' },
    { tf: 'lopend', cls: 'amber', val: tel.lopend, label: 'uitgezet / loopt' },
    { tf: 'gereed', cls: 'groen', val: tel.gereed, label: 'gereed' },
    { tf: 'overtijd', cls: 'rood', val: tel.overtijd, label: 'over verwachte datum' },
    { tf: 'vervolg', cls: 'amber', val: tel.vervolg, label: 'vervolgonderzoek nodig' },
  ];
  el('#ozKpis').innerHTML = tiles.map((t) =>
    `<div class="tstat ${t.cls} klikbaar${filter === t.tf ? ' actief' : ''}" data-tf="${t.tf}" tabindex="0" role="button"><b>${t.val}</b><span>${t.label}</span></div>`).join('');
  els('#ozKpis .tstat[data-tf]').forEach((t) => {
    const zet = () => { State.ozFilter = (State.ozFilter || 'alle') === t.dataset.tf ? 'alle' : t.dataset.tf; renderOnderzoeken(); };
    t.addEventListener('click', zet);
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zet(); } });
  });

  // Categorie-overzicht: per type onderzoek totaal/open, klikbaar als filter.
  const catTel = OZ_CATS.map(([key, label]) => {
    const items = alle.filter(({ o }) => o.categorie === key);
    const open = items.filter(({ o }) => ozGroep(o) !== 'gereed' && o.status !== 'nvt').length;
    return { key, label, totaal: items.length, open };
  }).filter((c) => c.totaal > 0);
  el('#ozCatGrid').innerHTML = catTel.length ? catTel.map((c) =>
    `<div class="oz-cat klikbaar${State.ozCatFilter === c.key ? ' actief' : ''}" data-cat="${c.key}" tabindex="0" role="button">
      <span class="oz-cat-label">${htmlEsc(c.label)}</span>
      <span class="oz-cat-tel">${c.open ? `<strong>${c.open}</strong> open · ` : ''}${c.totaal} totaal</span>
    </div>`).join('') : '<div class="leeg-mini">Nog geen onderzoeken vastgelegd.</div>';
  els('#ozCatGrid .oz-cat[data-cat]').forEach((c) => {
    c.addEventListener('click', () => { State.ozCatFilter = State.ozCatFilter === c.dataset.cat ? '' : c.dataset.cat; renderOnderzoeken(); });
    c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); } });
  });

  let lijst = alle.slice();
  if (filter === 'overtijd') lijst = lijst.filter(({ o }) => ozOvertijd(o));
  else if (filter === 'vervolg') lijst = lijst.filter(({ o }) => o.vervolgNodig);
  else if (filter !== 'alle') lijst = lijst.filter(({ o }) => ozGroep(o) === filter);
  lijst.sort((a, b) => (a.wp.project + a.wp.wp).localeCompare(b.wp.project + b.wp.wp));

  const rows = lijst.map(({ o, wp }) => {
    const st = OZ_STATUS[o.status] || OZ_STATUS.nodig;
    const over = ozOvertijd(o), nad = ozNaderend(o);
    const verwacht = o.status === 'gereed'
      ? (o.opgeleverdOp ? fmtDatum(o.opgeleverdOp) : '—')
      : (o.verwachtOp ? `<span style="${over ? 'color:var(--rood);font-weight:700' : nad ? 'color:var(--amber);font-weight:600' : ''}">${fmtDatum(o.verwachtOp)}${over ? ' ⚠' : nad ? ' •' : ''}</span>` : '—');
    const badges = [
      o.vervolgNodig ? '<span class="reg-badge" style="background:#f59e0b22;color:#b45309">vervolg nodig</span>' : '',
      ozGeldigheidVerlopen(o) ? '<span class="reg-badge" style="background:#ef444422;color:#b91c1c">geldigheid verlopen</span>' : (ozGeldigheidNaderend(o) ? '<span class="reg-badge" style="background:#f59e0b22;color:#b45309">geldig tot ' + fmtDatum(o.geldigTot) + '</span>' : ''),
    ].filter(Boolean).join(' ');
    return `<tr data-id="${htmlEsc(o.id)}" class="rij">
      <td><strong>${htmlEsc(wp.project)}</strong><div class="sub">${htmlEsc(apdVan(wp))} · ${htmlEsc(wp.wp)}</div></td>
      <td>${htmlEsc(ozLabelCat(o.categorie))}<div class="sub">${htmlEsc(o.omschrijving || '')}</div></td>
      <td>${htmlEsc(o.bureau || '—')}</td>
      <td>${regBadge(st)}${badges ? '<div style="margin-top:4px">' + badges + '</div>' : ''}</td>
      <td>${o.uitgezetOp ? fmtDatum(o.uitgezetOp) : '—'}</td>
      <td>${verwacht}</td>
      <td class="reg-acties"><button class="mini-knop" data-bewerk="${htmlEsc(o.id)}">bewerk</button></td>
    </tr>`;
  }).join('');
  const leegTekst = alle.length ? 'Geen onderzoeken in deze selectie.' : 'Nog geen onderzoeken vastgelegd. Klik op “Toevoegen”.';
  el('#ozInhoud').innerHTML = `<div class="card">
    <div class="card-kop"><h2>Onderzoeken<span class="tel">${lijst.length}</span></h2><span class="hint">Klik op een rij om te bewerken</span></div>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th>Werkpakket</th><th>Categorie / omschrijving</th><th>Bureau</th><th>Status</th><th>Uitgezet</th><th>Verwacht / opgeleverd</th><th></th></tr></thead>
      <tbody>${rows || `<tr><td colspan="7" class="leeg">${leegTekst}</td></tr>`}</tbody>
    </table></div></div>`;
  els('#ozInhoud .rij').forEach((tr) => tr.addEventListener('click', () => openOnderzoek(onderzoekById(tr.dataset.id))));
}
function onderzoekById(id) { return (State.onderzoeken || []).find((o) => o.id === id); }

/* --------------------------------- Modal ---------------------------------- */
function onderzoekForm(item, prefillWpId, prefillCat) {
  item = item || {};
  const wpSel = item.wpId || prefillWpId || '';
  const catSel = item.categorie || prefillCat || '';
  const wpOpts = State.werkpakketten.slice().sort((a, b) => (a.project + a.wp).localeCompare(b.project + b.wp))
    .map((w) => `<option value="${htmlEsc(w.id)}"${w.id === wpSel ? ' selected' : ''}>${htmlEsc(w.project)} · ${htmlEsc(apdVan(w))} · ${htmlEsc(w.wp)}</option>`).join('');
  const catOpts = OZ_CATS.map(([v, l]) => `<option value="${v}"${v === catSel ? ' selected' : ''}>${l}</option>`).join('');
  const statusOpts = Object.entries(OZ_STATUS).map(([k, o]) => `<option value="${k}"${k === (item.status || 'nodig') ? ' selected' : ''}>${o.label}</option>`).join('');
  return `
    <div class="modal-veld"><label>Werkpakket</label><select id="ozWp">${wpOpts}</select></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Categorie</label><select id="ozCat">${catOpts}</select></div>
      <div class="modal-veld"><label>Status</label><select id="ozStatus">${statusOpts}</select></div>
    </div>
    <div class="modal-veld"><label>Omschrijving</label><input id="ozOmschr" value="${htmlEsc(item.omschrijving || '')}" placeholder="bijv. Verkennend bodemonderzoek NEN 5740"></div>
    <div class="modal-veld"><label>Adviesbureau / uitvoerder</label><input id="ozBureau" value="${htmlEsc(item.bureau || '')}" placeholder="bijv. naam adviesbureau"></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Uitgezet op</label><input id="ozUitgezet" type="date" value="${htmlEsc(item.uitgezetOp || '')}"></div>
      <div class="modal-veld"><label>Verwacht terug</label><input id="ozVerwacht" type="date" value="${htmlEsc(item.verwachtOp || '')}"></div>
    </div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Opgeleverd op</label><input id="ozOpgeleverd" type="date" value="${htmlEsc(item.opgeleverdOp || '')}"></div>
      <div class="modal-veld"><label>Geldig tot <span class="hint">(optioneel)</span></label><input id="ozGeldigTot" type="date" value="${htmlEsc(item.geldigTot || '')}"></div>
    </div>
    <div class="modal-veld"><label><input id="ozVervolg" type="checkbox" ${item.vervolgNodig ? 'checked' : ''}> Vervolgonderzoek / ontheffing nodig</label></div>
    <div class="modal-veld" id="ozVervolgToelichtingVeld" style="${item.vervolgNodig ? '' : 'display:none'}"><label>Toelichting vervolgonderzoek</label><textarea id="ozVervolgToelichting" rows="2" placeholder="Wat is er nodig en waarom?">${htmlEsc(item.vervolgToelichting || '')}</textarea></div>
    <div class="modal-veld"><label>Notitie</label><textarea id="ozNotitie" rows="2" placeholder="Toelichting, bevindingen, restpunten…">${htmlEsc(item.notitie || '')}</textarea></div>
    <div class="modal-foot">
      ${item.id ? '<button class="verwijder-knop" id="ozVerwijder">Verwijderen</button>' : ''}
      <button class="ghost" id="ozAnnuleer">Annuleren</button>
      <button class="primair" id="ozOpslaan">Opslaan</button>
    </div>`;
}

function openOnderzoek(item, prefillWpId, prefillCat) {
  if (!magReg()) { toast('Alleen ontwerpleider/manager kan onderzoeken bewerken', 'fout'); return; }
  openModal(item ? 'Onderzoek bewerken' : 'Onderzoek toevoegen', onderzoekForm(item, prefillWpId, prefillCat));
  const vervolgCk = el('#ozVervolg'), vervolgVeld = el('#ozVervolgToelichtingVeld');
  vervolgCk.addEventListener('change', () => { vervolgVeld.style.display = vervolgCk.checked ? '' : 'none'; });
  el('#ozOpslaan').addEventListener('click', () => {
    const wpId = el('#ozWp').value;
    const omschrijving = el('#ozOmschr').value.trim();
    if (!wpId) { toast('Kies een werkpakket', 'fout'); return; }
    if (!omschrijving) { toast('Vul een omschrijving in', 'fout'); return; }
    const rec = {
      id: (item && item.id) || nieuwId('oz'),
      wpId, categorie: el('#ozCat').value, status: el('#ozStatus').value,
      omschrijving, bureau: el('#ozBureau').value.trim(),
      uitgezetOp: el('#ozUitgezet').value, verwachtOp: el('#ozVerwacht').value,
      opgeleverdOp: el('#ozOpgeleverd').value, geldigTot: el('#ozGeldigTot').value,
      vervolgNodig: vervolgCk.checked, vervolgToelichting: el('#ozVervolgToelichting').value.trim(),
      notitie: el('#ozNotitie').value.trim(),
    };
    State.onderzoeken = (State.onderzoeken || []).filter((o) => o.id !== rec.id);
    State.onderzoeken.push(rec);
    State.bewaar(); sluitModal(); renderOnderzoeken();
    if (State.actiefWp) renderDetail(State.actiefWp);
    toast('Onderzoek opgeslagen', 'ok');
  });
  el('#ozAnnuleer').addEventListener('click', sluitModal);
  const vw = el('#ozVerwijder');
  if (vw) vw.addEventListener('click', () => {
    if (!confirm('Dit onderzoek verwijderen?')) return;
    State.onderzoeken = (State.onderzoeken || []).filter((o) => o.id !== item.id);
    State.bewaar(); sluitModal(); renderOnderzoeken();
    if (State.actiefWp) renderDetail(State.actiefWp);
    toast('Onderzoek verwijderd', 'ok');
  });
}

/* ----------------- Register-overzicht in het WP-detailpaneel ------------- */
function detailOnderzoekenHtml(wp) {
  const rij = (o) => {
    const st = OZ_STATUS[o.status] || OZ_STATUS.nodig;
    const waarsch = ozOvertijd(o) ? ' <span style="color:var(--rood)">⚠ over verwachte datum</span>' : ozNaderend(o) ? ' <span style="color:var(--amber)">• nadert</span>' : o.vervolgNodig ? ' <span style="color:var(--amber)">• vervolg nodig</span>' : '';
    return `<li data-oz="${htmlEsc(o.id)}"><span>${htmlEsc(ozLabelCat(o.categorie))}${o.omschrijving ? ' — ' + htmlEsc(o.omschrijving) : ''}${waarsch}</span>${regBadge(st)}</li>`;
  };
  const items = onderzoekenVoor(wp.id).sort((a, b) => ozLabelCat(a.categorie).localeCompare(ozLabelCat(b.categorie)));
  const rijen = items.length ? items.map(rij).join('') : '<li class="leeg-mini">Nog geen onderzoeken.</li>';
  const add = magReg() ? '<button class="mini-knop" id="drawOzAdd">+ toevoegen</button>' : '';
  return `<div class="reg-blok">
    <div class="reg-kop"><h3>Onderzoeken</h3>${add}</div>
    <ul class="reg-mini-lijst">${rijen}</ul>
  </div>`;
}

function bindDetailOnderzoeken(wp) {
  const add = el('#drawOzAdd'); if (add) add.addEventListener('click', () => openOnderzoek(null, wp.id));
  els('#detailOnderzoeken li[data-oz]').forEach((li) => li.addEventListener('click', () => openOnderzoek(onderzoekById(li.dataset.oz))));
}

/* --------------------- Dashboardkaart: conditionerend onderzoek ---------- */
function onderzoekenInScope(scope) {
  const inScope = (wpId) => { const w = wpById(wpId); return w && (scope === 'portfolio' || w.project === scope); };
  return (State.onderzoeken || []).filter((o) => inScope(o.wpId));
}

function renderDashboardOnderzoeken() {
  const kaart = el('#dashOzKaart'); if (!kaart) return;
  const lijst = onderzoekenInScope(State.dashScope);
  if (!lijst.length) { kaart.style.display = 'none'; return; }
  kaart.style.display = '';
  const tel = {
    nodig: lijst.filter((o) => ozGroep(o) === 'nodig').length,
    lopend: lijst.filter((o) => ozGroep(o) === 'lopend').length,
    gereed: lijst.filter((o) => ozGroep(o) === 'gereed').length,
    overtijd: lijst.filter(ozOvertijd).length,
    vervolg: lijst.filter((o) => o.vervolgNodig).length,
  };
  const tiles = [
    { tf: 'nodig', cls: '', val: tel.nodig, label: 'nog uit te zetten' },
    { tf: 'lopend', cls: 'amber', val: tel.lopend, label: 'uitgezet / loopt' },
    { tf: 'gereed', cls: 'groen', val: tel.gereed, label: 'gereed' },
    { tf: 'overtijd', cls: 'rood', val: tel.overtijd, label: 'over verwachte datum' },
    { tf: 'vervolg', cls: 'amber', val: tel.vervolg, label: 'vervolgonderzoek nodig' },
  ];
  el('#dashOz').innerHTML = tiles.map((t) =>
    `<div class="tstat ${t.cls} klikbaar" data-tf="${t.tf}" tabindex="0" role="button" title="Klik voor het onderzoeksregister"><b>${t.val}</b><span>${t.label}</span></div>`).join('');
  els('#dashOz .tstat').forEach((t) => {
    const open = () => {
      State.ozFilter = t.dataset.tf;
      State.filters.project = State.dashScope === 'portfolio' ? '' : State.dashScope;
      renderOnderzoeken(); toonTab('onderzoeken');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    t.addEventListener('click', open);
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

/* ------------------------- Samenvatting voor AI -------------------------- */
function onderzoekenRapportData(scope) {
  const alle = onderzoekenInScope(scope);
  if (!alle.length) return null;
  const perCat = OZ_CATS.map(([key, label]) => {
    const items = alle.filter((o) => o.categorie === key);
    if (!items.length) return null;
    return {
      categorie: label,
      totaal: items.length,
      nogUitTeZetten: items.filter((o) => ozGroep(o) === 'nodig').length,
      lopend: items.filter((o) => ozGroep(o) === 'lopend').length,
      gereed: items.filter((o) => ozGroep(o) === 'gereed').length,
    };
  }).filter(Boolean);
  const overTijd = alle.filter(ozOvertijd).map((o) => { const w = wpById(o.wpId); return { wp: w ? `${w.project} · ${w.wp}` : '', categorie: ozLabelCat(o.categorie), omschrijving: o.omschrijving, verwachtOp: fmtDatum(o.verwachtOp), bureau: o.bureau }; });
  const vervolgNodig = alle.filter((o) => o.vervolgNodig).map((o) => { const w = wpById(o.wpId); return { wp: w ? `${w.project} · ${w.wp}` : '', categorie: ozLabelCat(o.categorie), toelichting: o.vervolgToelichting }; });
  const geldigheidVerloopt = alle.filter((o) => ozGeldigheidVerlopen(o) || ozGeldigheidNaderend(o)).map((o) => { const w = wpById(o.wpId); return { wp: w ? `${w.project} · ${w.wp}` : '', categorie: ozLabelCat(o.categorie), geldigTot: fmtDatum(o.geldigTot), status: ozGeldigheidVerlopen(o) ? 'verlopen' : 'naderend' }; });
  return { totaal: alle.length, perCategorie: perCat, overVerwachteDatum: overTijd, vervolgonderzoekNodig: vervolgNodig, geldigheidVerlooptOfVerlopen: geldigheidVerloopt };
}

/* ------------------------------- Init ------------------------------------ */
function onderzoekenInit() {
  const knop = el('#ozToevoegen');
  if (knop) knop.addEventListener('click', () => openOnderzoek(null));
}

if (typeof window !== 'undefined') {
  window.renderOnderzoeken = renderOnderzoeken;
  window.detailOnderzoekenHtml = detailOnderzoekenHtml;
  window.bindDetailOnderzoeken = bindDetailOnderzoeken;
  window.renderDashboardOnderzoeken = renderDashboardOnderzoeken;
  window.onderzoekenRapportData = onderzoekenRapportData;
  window.onderzoekenInit = onderzoekenInit;
}
