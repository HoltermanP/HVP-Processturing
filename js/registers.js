/* ==========================================================================
   Registers — Vergunningen & ZRO en het Risico-register.
   Beide hangen aan werkpakketten (vergunningen) c.q. project/werkpakket
   (risico's) en worden via Neon (db.js) bewaard. Gebruikt functies/State uit
   app.js (op runtime beschikbaar).
   ========================================================================== */
'use strict';

/* ------------------------------- Constanten ------------------------------ */
const VG_TYPES = [
  ['omgevingsvergunning', 'Omgevingsvergunning'],
  ['avoi', 'Vergunning Kabels & Leidingen (AVOI)'],
  ['zro', 'ZRO / zakelijk recht'],
  ['melding', 'Melding'],
  ['toestemming', 'Toestemming netbeheerder'],
  ['overig', 'Overig'],
];
const VG_STATUS = {
  nodig:         { label: 'Nodig',           kleur: '#94a3b8' },
  voorbereiding: { label: 'In voorbereiding', kleur: '#0ea5e9' },
  aangevraagd:   { label: 'Aangevraagd',     kleur: '#f59e0b' },
  verleend:      { label: 'Verleend',        kleur: '#10b981' },
  afgewezen:     { label: 'Afgewezen',       kleur: '#ef4444' },
  nvt:           { label: 'N.v.t.',          kleur: '#cbd5e1' },
};
const RISK_CAT = [
  ['ontwerp', 'Ontwerp'], ['omgeving', 'Omgeving'], ['vergunning', 'Vergunning'],
  ['grond', 'Grondverwerving / ZRO'], ['techniek', 'Techniek'], ['uitvoering', 'Uitvoering'],
  ['planning', 'Planning'], ['overig', 'Overig'],
];
const RISK_STATUS = {
  open:     { label: 'Open',     kleur: '#ef4444' },
  beheerst: { label: 'Beheerst', kleur: '#f59e0b' },
  gesloten: { label: 'Gesloten', kleur: '#10b981' },
};
const SCHAAL = { 1: 'Zeer laag', 2: 'Laag', 3: 'Middel', 4: 'Hoog', 5: 'Zeer hoog' };

/* -------------------------------- Helpers -------------------------------- */
function nieuwId(prefix) { return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`; }
function wpById(id) { return State.werkpakketten.find((w) => w.id === id); }
function vgLabelType(t) { const m = VG_TYPES.find((x) => x[0] === t); return m ? m[1] : t; }
function riskScoreKleur(score) { return score >= 15 ? '#ef4444' : score >= 10 ? '#f59e0b' : score >= 5 ? '#eab308' : '#10b981'; }
function regBadge(info) { return `<span class="reg-badge" style="background:${info.kleur}22;color:${info.kleur}">${htmlEsc(info.label)}</span>`; }

function vergunningenVoor(wpId) { return (State.vergunningen || []).filter((v) => v.wpId === wpId); }
function risicosVoor(wpId) { return (State.risicos || []).filter((r) => r.wpId === wpId); }

// Indeling voor filtering/telling van een vergunning.
function vgGroep(v) {
  if (v.status === 'nodig' || v.status === 'voorbereiding') return 'open';
  if (v.status === 'aangevraagd') return 'aangevraagd';
  if (v.status === 'verleend') return 'verleend';
  return 'overig';
}
function vgOvertijd(v) {
  if (v.status === 'verleend' || v.status === 'afgewezen' || v.status === 'nvt') return false;
  const d = parseDatum(v.verwachtBesluit);
  return d && d < VANDAAG;
}
function vgNaderend(v) {
  if (v.status === 'verleend' || v.status === 'afgewezen' || v.status === 'nvt') return false;
  const d = parseDatum(v.verwachtBesluit);
  return d && d >= VANDAAG && dagenVerschil(VANDAAG, d) <= 21;
}

/* ------------------------------ Modal-basis ------------------------------ */
function openModal(titel, html) {
  el('#modalTitel').textContent = titel;
  el('#modalBody').innerHTML = html;
  el('#modalOverlay').classList.add('show');
  el('#modal').classList.add('open');
}
function sluitModal() {
  el('#modalOverlay').classList.remove('show');
  el('#modal').classList.remove('open');
}

/* ============================ VERGUNNINGEN ============================== */
function vgGefilterd() {
  const f = State.filters; const zoek = (f.zoek || '').toLowerCase();
  return (State.vergunningen || []).map((v) => ({ v, wp: wpById(v.wpId) })).filter(({ v, wp }) => {
    if (!wp) return false;
    if (f.project && wp.project !== f.project) return false;
    if (f.apd && apdVan(wp) !== f.apd) return false;
    if (f.engineer && wp.engineer !== f.engineer) return false;
    if (zoek) {
      const blob = `${wp.project} ${apdVan(wp)} ${wp.wp} ${v.omschrijving} ${v.bevoegdGezag} ${vgLabelType(v.type)}`.toLowerCase();
      if (!blob.includes(zoek)) return false;
    }
    return true;
  });
}

function renderVergunningen() {
  if (!el('#vgKpis')) return;
  const filter = State.vgFilter || 'alle';
  const alle = vgGefilterd();
  const tel = {
    totaal: alle.length,
    open: alle.filter(({ v }) => vgGroep(v) === 'open').length,
    aangevraagd: alle.filter(({ v }) => vgGroep(v) === 'aangevraagd').length,
    verleend: alle.filter(({ v }) => vgGroep(v) === 'verleend').length,
    overtijd: alle.filter(({ v }) => vgOvertijd(v)).length,
  };
  const tiles = [
    { tf: 'alle', cls: 'blauw', val: tel.totaal, label: 'totaal' },
    { tf: 'open', cls: '', val: tel.open, label: 'openstaand' },
    { tf: 'aangevraagd', cls: 'amber', val: tel.aangevraagd, label: 'aangevraagd' },
    { tf: 'verleend', cls: 'groen', val: tel.verleend, label: 'verleend' },
    { tf: 'overtijd', cls: 'rood', val: tel.overtijd, label: 'over besluitdatum' },
  ];
  el('#vgKpis').innerHTML = tiles.map((t) =>
    `<div class="tstat ${t.cls} klikbaar${filter === t.tf ? ' actief' : ''}" data-tf="${t.tf}" tabindex="0" role="button"><b>${t.val}</b><span>${t.label}</span></div>`).join('');
  els('#vgKpis .tstat[data-tf]').forEach((t) => {
    const zet = () => { State.vgFilter = (State.vgFilter || 'alle') === t.dataset.tf ? 'alle' : t.dataset.tf; renderVergunningen(); };
    t.addEventListener('click', zet);
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zet(); } });
  });

  let lijst = alle.slice();
  if (filter === 'overtijd') lijst = lijst.filter(({ v }) => vgOvertijd(v));
  else if (filter !== 'alle') lijst = lijst.filter(({ v }) => vgGroep(v) === filter);
  lijst.sort((a, b) => (a.wp.project + a.wp.wp).localeCompare(b.wp.project + b.wp.wp));

  const rows = lijst.map(({ v, wp }) => {
    const st = VG_STATUS[v.status] || VG_STATUS.nodig;
    const over = vgOvertijd(v), nad = vgNaderend(v);
    const besluit = v.verwachtBesluit ? `<span style="${over ? 'color:var(--rood);font-weight:700' : nad ? 'color:var(--amber);font-weight:600' : ''}">${fmtDatum(v.verwachtBesluit)}${over ? ' ⚠' : nad ? ' •' : ''}</span>` : '—';
    return `<tr data-id="${htmlEsc(v.id)}" class="rij">
      <td><strong>${htmlEsc(wp.project)}</strong><div class="sub">${htmlEsc(apdVan(wp))} · ${htmlEsc(wp.wp)}</div></td>
      <td>${htmlEsc(vgLabelType(v.type))}<div class="sub">${htmlEsc(v.omschrijving || '')}</div></td>
      <td>${htmlEsc(v.bevoegdGezag || '—')}</td>
      <td>${regBadge(st)}</td>
      <td>${v.aangevraagd ? fmtDatum(v.aangevraagd) : '—'}</td>
      <td>${besluit}</td>
      <td class="reg-acties"><button class="mini-knop" data-bewerk="${htmlEsc(v.id)}">bewerk</button></td>
    </tr>`;
  }).join('');
  el('#vgInhoud').innerHTML = `<div class="card">
    <div class="card-kop"><h2>Vergunningen &amp; ZRO<span class="tel">${lijst.length}</span></h2><span class="hint">Klik op een rij om te bewerken</span></div>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th>Werkpakket</th><th>Type / omschrijving</th><th>Bevoegd gezag</th><th>Status</th><th>Aangevraagd</th><th>Verwacht besluit</th><th></th></tr></thead>
      <tbody>${rows || `<tr><td colspan="7" class="leeg">${alle.length ? 'Geen vergunningen in deze selectie.' : 'Nog geen vergunningen vastgelegd. Klik op “Toevoegen”.'}</td></tr>`}</tbody>
    </table></div></div>`;
  els('#vgInhoud .rij').forEach((tr) => tr.addEventListener('click', () => openVergunning(vergunningById(tr.dataset.id))));
}
function vergunningById(id) { return (State.vergunningen || []).find((v) => v.id === id); }

function vergunningForm(item, prefillWpId) {
  item = item || {};
  const wpSel = item.wpId || prefillWpId || '';
  const wpOpts = State.werkpakketten.slice().sort((a, b) => (a.project + a.wp).localeCompare(b.project + b.wp))
    .map((w) => `<option value="${htmlEsc(w.id)}"${w.id === wpSel ? ' selected' : ''}>${htmlEsc(w.project)} · ${htmlEsc(apdVan(w))} · ${htmlEsc(w.wp)}</option>`).join('');
  const typeOpts = VG_TYPES.map(([v, l]) => `<option value="${v}"${v === item.type ? ' selected' : ''}>${l}</option>`).join('');
  const statusOpts = Object.entries(VG_STATUS).map(([k, o]) => `<option value="${k}"${k === (item.status || 'nodig') ? ' selected' : ''}>${o.label}</option>`).join('');
  return `
    <div class="modal-veld"><label>Werkpakket</label><select id="vgWp">${wpOpts}</select></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Type</label><select id="vgType">${typeOpts}</select></div>
      <div class="modal-veld"><label>Status</label><select id="vgStatus">${statusOpts}</select></div>
    </div>
    <div class="modal-veld"><label>Omschrijving</label><input id="vgOmschr" value="${htmlEsc(item.omschrijving || '')}" placeholder="bijv. Omgevingsvergunning gemeente De Fryske Marren"></div>
    <div class="modal-veld"><label>Bevoegd gezag / partij</label><input id="vgGezag" value="${htmlEsc(item.bevoegdGezag || '')}" placeholder="bijv. gemeente, provincie, waterschap, grondeigenaar"></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Aangevraagd op</label><input id="vgAangevraagd" type="date" value="${htmlEsc(item.aangevraagd || '')}"></div>
      <div class="modal-veld"><label>Verwacht / verleend besluit</label><input id="vgBesluit" type="date" value="${htmlEsc(item.verwachtBesluit || '')}"></div>
    </div>
    <div class="modal-veld"><label>Notitie</label><textarea id="vgNotitie" rows="2" placeholder="Toelichting, voorwaarden, restpunten…">${htmlEsc(item.notitie || '')}</textarea></div>
    <div class="modal-foot">
      ${item.id ? '<button class="verwijder-knop" id="vgVerwijder">Verwijderen</button>' : ''}
      <button class="ghost" id="vgAnnuleer">Annuleren</button>
      <button class="primair" id="vgOpslaan">Opslaan</button>
    </div>`;
}

function openVergunning(item, prefillWpId) {
  openModal(item ? 'Vergunning / ZRO bewerken' : 'Vergunning / ZRO toevoegen', vergunningForm(item, prefillWpId));
  el('#vgOpslaan').addEventListener('click', () => {
    const wpId = el('#vgWp').value;
    const omschrijving = el('#vgOmschr').value.trim();
    if (!wpId) { toast('Kies een werkpakket', 'fout'); return; }
    if (!omschrijving) { toast('Vul een omschrijving in', 'fout'); return; }
    const rec = {
      id: (item && item.id) || nieuwId('vg'),
      wpId, type: el('#vgType').value, status: el('#vgStatus').value,
      omschrijving, bevoegdGezag: el('#vgGezag').value.trim(),
      aangevraagd: el('#vgAangevraagd').value, verwachtBesluit: el('#vgBesluit').value,
      notitie: el('#vgNotitie').value.trim(),
    };
    State.vergunningen = (State.vergunningen || []).filter((v) => v.id !== rec.id);
    State.vergunningen.push(rec);
    State.bewaar(); sluitModal(); renderVergunningen();
    if (State.actiefWp) renderDetail(State.actiefWp);
    toast('Vergunning opgeslagen', 'ok');
  });
  el('#vgAnnuleer').addEventListener('click', sluitModal);
  const vw = el('#vgVerwijder');
  if (vw) vw.addEventListener('click', () => {
    if (!confirm('Deze vergunning verwijderen?')) return;
    State.vergunningen = (State.vergunningen || []).filter((v) => v.id !== item.id);
    State.bewaar(); sluitModal(); renderVergunningen();
    if (State.actiefWp) renderDetail(State.actiefWp);
    toast('Vergunning verwijderd', 'ok');
  });
}

/* ============================== RISICO'S =============================== */
function riskGefilterd() {
  const f = State.filters; const zoek = (f.zoek || '').toLowerCase();
  return (State.risicos || []).filter((r) => {
    if (f.project && r.project !== f.project) return false;
    if (f.apd && r.wpId) { const w = wpById(r.wpId); if (w && apdVan(w) !== f.apd) return false; }
    if (State.riskCel) { if (r.kans !== State.riskCel.kans || r.impact !== State.riskCel.impact) return false; }
    if (zoek) {
      const blob = `${r.project} ${r.omschrijving} ${r.maatregel} ${r.eigenaar} ${r.categorie}`.toLowerCase();
      if (!blob.includes(zoek)) return false;
    }
    return true;
  });
}

function renderRisicos() {
  if (!el('#riskKpis')) return;
  // Matrix telt op basis van project/zoek-filter (niet op de cel-filter zelf).
  const f = State.filters; const zoek = (f.zoek || '').toLowerCase();
  const basis = (State.risicos || []).filter((r) => {
    if (f.project && r.project !== f.project) return false;
    if (zoek) return `${r.project} ${r.omschrijving} ${r.maatregel} ${r.eigenaar}`.toLowerCase().includes(zoek);
    return true;
  });
  renderRiskMatrix(basis);

  const lijst = riskGefilterd();
  const hoog = basis.filter((r) => r.kans * r.impact >= 15).length;
  const open = basis.filter((r) => r.status === 'open').length;
  const beheerst = basis.filter((r) => r.status === 'beheerst').length;
  const tiles = [
    { val: basis.length, cls: 'blauw', label: 'risico’s totaal' },
    { val: hoog, cls: 'rood', label: 'hoog (score ≥ 15)' },
    { val: open, cls: 'amber', label: 'open' },
    { val: beheerst, cls: 'groen', label: 'beheerst' },
  ];
  el('#riskKpis').innerHTML = tiles.map((t) => `<div class="tstat ${t.cls}"><b>${t.val}</b><span>${t.label}</span></div>`).join('');

  const celBalk = State.riskCel
    ? `<div class="taken-filterbalk">Gefilterd op kans <strong>${State.riskCel.kans}</strong> × impact <strong>${State.riskCel.impact}</strong> <button class="terug-knop" id="riskCelReset">Toon alle</button></div>`
    : '';
  lijst.sort((a, b) => (b.kans * b.impact) - (a.kans * a.impact));
  const rows = lijst.map((r) => {
    const score = r.kans * r.impact; const kl = riskScoreKleur(score);
    const wp = r.wpId ? wpById(r.wpId) : null;
    const st = RISK_STATUS[r.status] || RISK_STATUS.open;
    return `<tr data-id="${htmlEsc(r.id)}" class="rij">
      <td><strong>${htmlEsc(r.project)}</strong>${wp ? `<div class="sub">${htmlEsc(apdVan(wp))} · ${htmlEsc(wp.wp)}</div>` : '<div class="sub">projectniveau</div>'}</td>
      <td>${htmlEsc((RISK_CAT.find((c) => c[0] === r.categorie) || ['', r.categorie])[1])}</td>
      <td><div style="max-width:340px">${htmlEsc(r.omschrijving || '')}</div>${r.maatregel ? `<div class="sub">Maatregel: ${htmlEsc(r.maatregel)}</div>` : ''}</td>
      <td class="num">${r.kans}</td><td class="num">${r.impact}</td>
      <td class="num"><span class="reg-score" style="background:${kl}">${score}</span></td>
      <td>${htmlEsc(r.eigenaar || '—')}</td>
      <td>${regBadge(st)}</td>
      <td class="reg-acties"><button class="mini-knop" data-bewerk="${htmlEsc(r.id)}">bewerk</button></td>
    </tr>`;
  }).join('');
  el('#riskInhoud').innerHTML = `${celBalk}<div class="card">
    <div class="card-kop"><h2>Risico's<span class="tel">${lijst.length}</span></h2><span class="hint">Klik op een rij om te bewerken</span></div>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th>Project / WP</th><th>Categorie</th><th>Risico &amp; maatregel</th><th class="num">Kans</th><th class="num">Impact</th><th class="num">Score</th><th>Eigenaar</th><th>Status</th><th></th></tr></thead>
      <tbody>${rows || `<tr><td colspan="9" class="leeg">${basis.length ? 'Geen risico’s in deze selectie.' : 'Nog geen risico’s vastgelegd. Klik op “Toevoegen”.'}</td></tr>`}</tbody>
    </table></div></div>`;
  const reset = el('#riskCelReset');
  if (reset) reset.addEventListener('click', () => { State.riskCel = null; renderRisicos(); });
  els('#riskInhoud .rij').forEach((tr) => tr.addEventListener('click', () => openRisico(risicoById(tr.dataset.id))));
}
function risicoById(id) { return (State.risicos || []).find((r) => r.id === id); }

function renderRiskMatrix(risks) {
  const cnt = {};
  risks.forEach((r) => { const k = `${r.kans}-${r.impact}`; cnt[k] = (cnt[k] || 0) + 1; });
  let html = '<div class="risk-matrix">';
  html += '<div class="rm-hoek"></div>';
  for (let im = 1; im <= 5; im++) html += `<div class="rm-as">${im}</div>`;
  for (let ka = 5; ka >= 1; ka--) {
    html += `<div class="rm-as">${ka}</div>`;
    for (let im = 1; im <= 5; im++) {
      const score = ka * im; const c = cnt[`${ka}-${im}`] || 0;
      const actief = State.riskCel && State.riskCel.kans === ka && State.riskCel.impact === im;
      html += `<div class="rm-cel${actief ? ' actief' : ''}" data-kans="${ka}" data-impact="${im}" style="background:${riskScoreKleur(score)}${c ? '' : '33'}" title="Kans ${ka} × Impact ${im} = ${score} · ${c} risico('s)">${c || ''}</div>`;
    }
  }
  html += '</div><div class="rm-labels"><span>← impact →</span><span>↑ kans ↑</span></div>';
  el('#riskMatrix').innerHTML = html;
  els('#riskMatrix .rm-cel').forEach((cel) => cel.addEventListener('click', () => {
    const ka = +cel.dataset.kans, im = +cel.dataset.impact;
    State.riskCel = (State.riskCel && State.riskCel.kans === ka && State.riskCel.impact === im) ? null : { kans: ka, impact: im };
    renderRisicos();
  }));
}

function risicoForm(item, prefillWpId, prefillProject) {
  item = item || {};
  const projecten = [...new Set(State.werkpakketten.map((w) => w.project))].sort();
  const huidigProject = item.project || prefillProject || (prefillWpId && wpById(prefillWpId) ? wpById(prefillWpId).project : '') || projecten[0] || '';
  const projOpts = projecten.map((p) => `<option value="${htmlEsc(p)}"${p === huidigProject ? ' selected' : ''}>${htmlEsc(p)}</option>`).join('');
  const wpInProject = State.werkpakketten.filter((w) => w.project === huidigProject);
  const wpOpts = `<option value="">— projectniveau —</option>` + wpInProject.map((w) => `<option value="${htmlEsc(w.id)}"${w.id === (item.wpId || prefillWpId) ? ' selected' : ''}>${htmlEsc(apdVan(w))} · ${htmlEsc(w.wp)}</option>`).join('');
  const catOpts = RISK_CAT.map(([v, l]) => `<option value="${v}"${v === (item.categorie || 'ontwerp') ? ' selected' : ''}>${l}</option>`).join('');
  const statusOpts = Object.entries(RISK_STATUS).map(([k, o]) => `<option value="${k}"${k === (item.status || 'open') ? ' selected' : ''}>${o.label}</option>`).join('');
  const schaalOpts = (sel) => [1, 2, 3, 4, 5].map((n) => `<option value="${n}"${n === sel ? ' selected' : ''}>${n} — ${SCHAAL[n]}</option>`).join('');
  return `
    <div class="modal-rij">
      <div class="modal-veld"><label>Project</label><select id="rkProject">${projOpts}</select></div>
      <div class="modal-veld"><label>Werkpakket (optioneel)</label><select id="rkWp">${wpOpts}</select></div>
    </div>
    <div class="modal-veld"><label>Risico-omschrijving</label><textarea id="rkOmschr" rows="2" placeholder="Wat kan er misgaan en met welk gevolg?">${htmlEsc(item.omschrijving || '')}</textarea></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Categorie</label><select id="rkCat">${catOpts}</select></div>
      <div class="modal-veld"><label>Status</label><select id="rkStatus">${statusOpts}</select></div>
    </div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Kans</label><select id="rkKans">${schaalOpts(item.kans || 3)}</select></div>
      <div class="modal-veld"><label>Impact</label><select id="rkImpact">${schaalOpts(item.impact || 3)}</select></div>
    </div>
    <div class="modal-veld"><label>Beheersmaatregel</label><textarea id="rkMaatregel" rows="2" placeholder="Hoe beperken we kans of impact?">${htmlEsc(item.maatregel || '')}</textarea></div>
    <div class="modal-veld"><label>Eigenaar</label><input id="rkEigenaar" value="${htmlEsc(item.eigenaar || '')}" placeholder="Wie bewaakt dit risico?"></div>
    <div class="modal-foot">
      ${item.id ? '<button class="verwijder-knop" id="rkVerwijder">Verwijderen</button>' : ''}
      <button class="ghost" id="rkAnnuleer">Annuleren</button>
      <button class="primair" id="rkOpslaan">Opslaan</button>
    </div>`;
}

function openRisico(item, prefillWpId, prefillProject) {
  openModal(item ? 'Risico bewerken' : 'Risico toevoegen', risicoForm(item, prefillWpId, prefillProject));
  // werkpakket-keuze meebewegen met project
  el('#rkProject').addEventListener('change', () => {
    const p = el('#rkProject').value;
    const opts = `<option value="">— projectniveau —</option>` + State.werkpakketten.filter((w) => w.project === p)
      .map((w) => `<option value="${htmlEsc(w.id)}">${htmlEsc(apdVan(w))} · ${htmlEsc(w.wp)}</option>`).join('');
    el('#rkWp').innerHTML = opts;
  });
  el('#rkOpslaan').addEventListener('click', () => {
    const omschrijving = el('#rkOmschr').value.trim();
    if (!omschrijving) { toast('Vul een omschrijving in', 'fout'); return; }
    const rec = {
      id: (item && item.id) || nieuwId('rk'),
      project: el('#rkProject').value, wpId: el('#rkWp').value || null,
      omschrijving, categorie: el('#rkCat').value, status: el('#rkStatus').value,
      kans: +el('#rkKans').value, impact: +el('#rkImpact').value,
      maatregel: el('#rkMaatregel').value.trim(), eigenaar: el('#rkEigenaar').value.trim(),
    };
    State.risicos = (State.risicos || []).filter((r) => r.id !== rec.id);
    State.risicos.push(rec);
    State.bewaar(); sluitModal(); renderRisicos();
    if (State.actiefWp) renderDetail(State.actiefWp);
    toast('Risico opgeslagen', 'ok');
  });
  el('#rkAnnuleer').addEventListener('click', sluitModal);
  const vw = el('#rkVerwijder');
  if (vw) vw.addEventListener('click', () => {
    if (!confirm('Dit risico verwijderen?')) return;
    State.risicos = (State.risicos || []).filter((r) => r.id !== item.id);
    State.bewaar(); sluitModal(); renderRisicos();
    if (State.actiefWp) renderDetail(State.actiefWp);
    toast('Risico verwijderd', 'ok');
  });
}

/* ----------------- Register-overzicht in het WP-detailpaneel ------------- */
function detailRegistersHtml(wp) {
  const vgs = vergunningenVoor(wp.id);
  const rks = risicosVoor(wp.id);
  const vgRijen = vgs.length ? vgs.map((v) => {
    const st = VG_STATUS[v.status] || VG_STATUS.nodig;
    const waarsch = vgOvertijd(v) ? ' <span style="color:var(--rood)">⚠ over besluitdatum</span>' : vgNaderend(v) ? ' <span style="color:var(--amber)">• nadert</span>' : '';
    return `<li data-vg="${htmlEsc(v.id)}"><span>${htmlEsc(vgLabelType(v.type))}${v.omschrijving ? ' — ' + htmlEsc(v.omschrijving) : ''}${waarsch}</span>${regBadge(st)}</li>`;
  }).join('') : '<li class="leeg-mini">Nog geen vergunningen.</li>';
  const rkRijen = rks.length ? rks.map((r) => {
    const score = r.kans * r.impact;
    return `<li data-rk="${htmlEsc(r.id)}"><span>${htmlEsc(r.omschrijving || '')}</span><span class="reg-score" style="background:${riskScoreKleur(score)}">${score}</span></li>`;
  }).join('') : '<li class="leeg-mini">Nog geen risico’s.</li>';
  return `<div class="reg-blok">
    <div class="reg-kop"><h3>Vergunningen &amp; ZRO</h3><button class="mini-knop" id="drawVgAdd">+ toevoegen</button></div>
    <ul class="reg-mini-lijst">${vgRijen}</ul>
    <div class="reg-kop" style="margin-top:12px"><h3>Risico's</h3><button class="mini-knop" id="drawRkAdd">+ toevoegen</button></div>
    <ul class="reg-mini-lijst">${rkRijen}</ul>
  </div>`;
}

function bindDetailRegisters(wp) {
  const add = el('#drawVgAdd'); if (add) add.addEventListener('click', () => openVergunning(null, wp.id));
  const addr = el('#drawRkAdd'); if (addr) addr.addEventListener('click', () => openRisico(null, wp.id, wp.project));
  els('#detailRegisters li[data-vg]').forEach((li) => li.addEventListener('click', () => openVergunning(vergunningById(li.dataset.vg))));
  els('#detailRegisters li[data-rk]').forEach((li) => li.addEventListener('click', () => openRisico(risicoById(li.dataset.rk))));
}

/* ------------------------- Samenvatting voor AI -------------------------- */
function registerRapportData(scope) {
  const inScope = (wpId) => { const w = wpById(wpId); return w && (scope === 'portfolio' || w.project === scope); };
  const vgs = (State.vergunningen || []).filter((v) => inScope(v.wpId));
  const rks = (State.risicos || []).filter((r) => scope === 'portfolio' || r.project === scope);
  const vgTel = { totaal: vgs.length, openstaand: vgs.filter((v) => vgGroep(v) === 'open').length, aangevraagd: vgs.filter((v) => vgGroep(v) === 'aangevraagd').length, verleend: vgs.filter((v) => vgGroep(v) === 'verleend').length };
  const vgOver = vgs.filter(vgOvertijd).map((v) => { const w = wpById(v.wpId); return { wp: w ? `${w.project} · ${w.wp}` : '', type: vgLabelType(v.type), omschrijving: v.omschrijving, verwachtBesluit: fmtDatum(v.verwachtBesluit) }; });
  const topRisks = rks.slice().sort((a, b) => (b.kans * b.impact) - (a.kans * a.impact)).slice(0, 8).map((r) => ({ project: r.project, omschrijving: r.omschrijving, score: r.kans * r.impact, status: (RISK_STATUS[r.status] || {}).label, eigenaar: r.eigenaar, maatregel: r.maatregel }));
  return {
    vergunningen: { ...vgTel, overBesluitdatum: vgOver },
    risicos: { totaal: rks.length, hoog: rks.filter((r) => r.kans * r.impact >= 15).length, open: rks.filter((r) => r.status === 'open').length, top: topRisks },
  };
}

/* ------------------------------- Init ------------------------------------ */
function registersInit() {
  el('#vgToevoegen').addEventListener('click', () => openVergunning(null));
  el('#riskToevoegen').addEventListener('click', () => openRisico(null));
  el('#modalClose').addEventListener('click', sluitModal);
  el('#modalOverlay').addEventListener('click', sluitModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && el('#modal').classList.contains('open')) sluitModal(); });
}

if (typeof window !== 'undefined') {
  window.renderVergunningen = renderVergunningen;
  window.renderRisicos = renderRisicos;
  window.detailRegistersHtml = detailRegistersHtml;
  window.bindDetailRegisters = bindDetailRegisters;
  window.registerRapportData = registerRapportData;
  window.registersInit = registersInit;
}
