/* ==========================================================================
   Registers — Vergunningen & ZRO.
   Hangen aan werkpakketten en worden via Neon (db.js) bewaard. Gebruikt
   functies/State uit app.js (op runtime beschikbaar). Het risicoregister is
   verwijderd: risico's worden in een ander systeem bijgehouden (de data in
   State.risicos blijft bewaard maar heeft hier geen UI meer).
   ========================================================================== */
'use strict';

/* ------------------------------- Constanten ------------------------------ */
// Typen naar activiteit (Omgevingswet). 'zro' blijft bestaan als scheiding
// tussen de Vergunningen- en ZRO-pagina; oude sleutels blijven geldig.
const VG_TYPES = [
  ['omgevingsvergunning', 'Omgevingsvergunning (omgevingsplanactiviteit)'],
  ['water', 'Watervergunning / -melding waterschap'],
  ['avoi', 'AVOI / instemmingsbesluit kabels & leidingen'],
  ['melding', 'Melding Bal (lozing, bronnering, …)'],
  ['natuur', 'Flora- en fauna-activiteit (ontheffing)'],
  ['natura2000', 'Natura 2000-activiteit'],
  ['kap', 'Kap / houtopstanden'],
  ['wegbeheerder', 'Ontheffing wegbeheerder (provincie / RWS)'],
  ['spoor', 'Spoorwegkruising (ProRail)'],
  ['verkeersbesluit', 'Verkeersbesluit / verkeersmaatregelen'],
  ['toestemming', 'Toestemming netbeheerder / derden'],
  ['zro', 'ZRO / zakelijk recht'],
  ['overig', 'Overig'],
];
// Besluitflow. 'groep' koppelt aan de KPI-indeling; 'afgewezen' behoudt zijn
// sleutel (bestaande data) maar heet in de Omgevingswet 'geweigerd'.
const VG_STATUS = {
  nodig:          { label: 'Nodig',               kleur: '#94a3b8', groep: 'open' },
  voorbereiding:  { label: 'In voorbereiding',    kleur: '#0ea5e9', groep: 'open' },
  aangevraagd:    { label: 'Aangevraagd',         kleur: '#f59e0b', groep: 'aangevraagd' },
  aanvulling:     { label: 'Aanvulling gevraagd', kleur: '#f97316', groep: 'aangevraagd' },
  ontwerpbesluit: { label: 'Ontwerpbesluit',      kleur: '#eab308', groep: 'aangevraagd' },
  verleend:       { label: 'Verleend',            kleur: '#22c55e', groep: 'verleend' },
  onherroepelijk: { label: 'Onherroepelijk',      kleur: '#10b981', groep: 'verleend' },
  afgewezen:      { label: 'Geweigerd',           kleur: '#ef4444', groep: 'overig' },
  nvt:            { label: 'N.v.t.',              kleur: '#cbd5e1', groep: 'overig' },
};
const VG_PROCEDURES = [
  ['regulier', 'Regulier (8 weken)', 56],
  ['uitgebreid', 'Uitgebreid (26 weken)', 182],
  ['melding', 'Melding (4 weken)', 28],
];
function vgProcedure(k) { return VG_PROCEDURES.find((p) => p[0] === k) || null; }
// Veelvoorkomende bevoegde gezagen als suggestie bij het vrije invoerveld.
const VG_GEZAGEN = ['Gemeente De Fryske Marren', 'Gemeente Heerenveen', 'Gemeente Weststellingwerf', 'Wetterskip Fryslân', 'Provincie Fryslân', 'Rijkswaterstaat Noord-Nederland', 'ProRail', 'FUMO (omgevingsdienst)', 'Liander', 'Gasunie', 'TenneT'];

// ZRO's volgen een eigen verwervingsflow. 'groep' koppelt elke status aan de
// gedeelde KPI-indeling (open/aangevraagd/verleend/overig) zodat tegels,
// filters en de AI-samenvatting voor beide pagina's hetzelfde werken.
const ZRO_STATUS = {
  benaderen:  { label: 'Te benaderen',            kleur: '#94a3b8', groep: 'open' },
  gesprek:    { label: 'In gesprek',              kleur: '#0ea5e9', groep: 'open' },
  akkoord:    { label: 'Mondeling akkoord',       kleur: '#14b8a6', groep: 'open' },
  concept:    { label: 'Concept verstuurd',       kleur: '#f59e0b', groep: 'aangevraagd' },
  getekend:   { label: 'Getekend',                kleur: '#22c55e', groep: 'verleend' },
  gepasseerd: { label: 'Notarieel gepasseerd',    kleur: '#10b981', groep: 'verleend' },
  gedoog:     { label: 'Gedoogplicht-procedure',  kleur: '#ef4444', groep: 'aangevraagd' },
  nvt:        { label: 'N.v.t.',                  kleur: '#cbd5e1', groep: 'overig' },
};
// Oude ZRO-records gebruikten de vergunningstatussen; map die naar de flow.
const ZRO_LEGACY_STATUS = { nodig: 'benaderen', voorbereiding: 'gesprek', aangevraagd: 'concept', verleend: 'getekend', afgewezen: 'gedoog' };
function zroStatusKey(v) { const s = v.status || 'benaderen'; return ZRO_STATUS[s] ? s : (ZRO_LEGACY_STATUS[s] || 'benaderen'); }

const ZRO_RECHTEN = [
  ['opstal', 'Opstalrecht'],
  ['erfdienstbaarheid', 'Erfdienstbaarheid'],
  ['kwalitatief', 'Kwalitatieve verplichting'],
  ['gebruik', 'Gebruiksovereenkomst'],
  ['gedoogplicht', 'Gedoogplicht (Omgevingswet)'],
  ['koop', 'Aankoop grond'],
];
function zroRechtLabel(k) { const m = ZRO_RECHTEN.find((x) => x[0] === k); return m ? m[1] : (k || '—'); }

/* -------------------------------- Helpers -------------------------------- */
function magReg() { return !window.Auth || Auth.magVolledig(); }
function nieuwId(prefix) { return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`; }
function wpById(id) { return State.werkpakketten.find((w) => w.id === id); }
function vgLabelType(t) { const m = VG_TYPES.find((x) => x[0] === t); return m ? m[1] : t; }
function regBadge(info) { return `<span class="reg-badge" style="background:${info.kleur}22;color:${info.kleur}">${htmlEsc(info.label)}</span>`; }

function vergunningenVoor(wpId) { return (State.vergunningen || []).filter((v) => v.wpId === wpId); }

// Indeling voor filtering/telling van een vergunning of ZRO.
function vgGroep(v) {
  if (isZro(v)) return ZRO_STATUS[zroStatusKey(v)].groep;
  return (VG_STATUS[v.status] || VG_STATUS.nodig).groep;
}
function vgStatusInfo(v) { return isZro(v) ? ZRO_STATUS[zroStatusKey(v)] : (VG_STATUS[v.status] || VG_STATUS.nodig); }
function vgAfgerond(v) { const g = vgGroep(v); return g === 'verleend' || g === 'overig'; }
function vgOvertijd(v) {
  if (vgAfgerond(v)) return false;
  const d = parseDatum(v.verwachtBesluit);
  return d && d < VANDAAG;
}
function vgNaderend(v) {
  if (vgAfgerond(v)) return false;
  const d = parseDatum(v.verwachtBesluit);
  return d && d >= VANDAAG && dagenVerschil(VANDAAG, d) <= 21;
}
function fmtEuro(n) {
  if (n === '' || n == null || isNaN(Number(n))) return '—';
  return '€ ' + Number(n).toLocaleString('nl-NL');
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

/* ======================= VERGUNNINGEN & ZRO ============================= */
// Eén register (State.vergunningen), twee pagina's: records met type 'zro'
// horen bij de ZRO-pagina, alle overige types bij de Vergunningen-pagina.
function isZro(v) { return v.type === 'zro'; }

function vgGefilterd(soort) {
  const f = State.filters; const zoek = (f.zoek || '').toLowerCase();
  return (State.vergunningen || []).map((v) => ({ v, wp: wpById(v.wpId) })).filter(({ v, wp }) => {
    if (!wp) return false;
    if (soort === 'zro' ? !isZro(v) : isZro(v)) return false;
    if (f.project && wp.project !== f.project) return false;
    if (f.apd && apdVan(wp) !== f.apd) return false;
    if (f.engineer && wp.engineer !== f.engineer) return false;
    if (zoek) {
      const blob = `${wp.project} ${apdVan(wp)} ${wp.wp} ${v.omschrijving} ${v.bevoegdGezag} ${vgLabelType(v.type)} ${v.kadastraal || ''} ${v.pachter || ''} ${v.grondverwerver || ''} ${v.notaris || ''} ${v.zaaknummer || ''} ${v.behandelaar || ''}`.toLowerCase();
      if (!blob.includes(zoek)) return false;
    }
    return true;
  });
}

function renderVergunningen() { renderVgPagina('vg'); }
function renderZro() { renderVgPagina('zro'); }

// Gedeelde render voor beide pagina's; 'soort' bepaalt DOM, teksten en data.
function renderVgPagina(soort) {
  const zro = soort === 'zro';
  const kpisSel = zro ? '#zroKpis' : '#vgKpis';
  const inhoudSel = zro ? '#zroInhoud' : '#vgInhoud';
  const filterKey = zro ? 'zroFilter' : 'vgFilter';
  if (!el(kpisSel)) return;
  const filter = State[filterKey] || 'alle';
  const alle = vgGefilterd(soort);
  const tel = {
    totaal: alle.length,
    open: alle.filter(({ v }) => vgGroep(v) === 'open').length,
    aangevraagd: alle.filter(({ v }) => vgGroep(v) === 'aangevraagd').length,
    verleend: alle.filter(({ v }) => vgGroep(v) === 'verleend').length,
    overtijd: alle.filter(({ v }) => vgOvertijd(v)).length,
  };
  const tiles = [
    { tf: 'alle', cls: 'blauw', val: tel.totaal, label: 'totaal' },
    { tf: 'open', cls: '', val: tel.open, label: zro ? 'in gesprek' : 'openstaand' },
    { tf: 'aangevraagd', cls: 'amber', val: tel.aangevraagd, label: zro ? 'concept / procedure' : 'in behandeling' },
    { tf: 'verleend', cls: 'groen', val: tel.verleend, label: zro ? 'getekend / gepasseerd' : 'verleend' },
    { tf: 'overtijd', cls: 'rood', val: tel.overtijd, label: zro ? 'over streefdatum' : 'over beslistermijn' },
  ];
  el(kpisSel).innerHTML = tiles.map((t) =>
    `<div class="tstat ${t.cls} klikbaar${filter === t.tf ? ' actief' : ''}" data-tf="${t.tf}" tabindex="0" role="button"><b>${t.val}</b><span>${t.label}</span></div>`).join('');
  els(`${kpisSel} .tstat[data-tf]`).forEach((t) => {
    const zet = () => { State[filterKey] = (State[filterKey] || 'alle') === t.dataset.tf ? 'alle' : t.dataset.tf; renderVgPagina(soort); };
    t.addEventListener('click', zet);
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zet(); } });
  });

  let lijst = alle.slice();
  if (filter === 'overtijd') lijst = lijst.filter(({ v }) => vgOvertijd(v));
  else if (filter !== 'alle') lijst = lijst.filter(({ v }) => vgGroep(v) === filter);
  lijst.sort((a, b) => (a.wp.project + a.wp.wp).localeCompare(b.wp.project + b.wp.wp));

  const datumCel = (v) => {
    const over = vgOvertijd(v), nad = vgNaderend(v);
    return v.verwachtBesluit ? `<span style="${over ? 'color:var(--rood);font-weight:700' : nad ? 'color:var(--amber);font-weight:600' : ''}">${fmtDatum(v.verwachtBesluit)}${over ? ' ⚠' : nad ? ' •' : ''}</span>` : '—';
  };
  const wpCel = (wp) => `<td><strong>${htmlEsc(wp.project)}</strong><div class="sub">${htmlEsc(apdVan(wp))} · ${htmlEsc(wp.wp)}</div></td>`;
  const actieCel = (v) => `<td class="reg-acties"><button class="mini-knop" data-bewerk="${htmlEsc(v.id)}">bewerk</button></td>`;
  const rows = lijst.map(({ v, wp }) => {
    const st = vgStatusInfo(v);
    if (zro) {
      const b = Number(v.strookBreedte), l = Number(v.lengte);
      const opp = b > 0 && l > 0 ? ` (≈ ${Math.round(b * l).toLocaleString('nl-NL')} m²)` : '';
      const strook = [b > 0 ? `strook ${v.strookBreedte} m` : '', l > 0 ? `${v.lengte} m¹` : ''].filter(Boolean).join(' · ') + opp;
      const bedragen = [];
      if (v.vergoedingRecht !== '' && v.vergoedingRecht != null && !isNaN(Number(v.vergoedingRecht))) bedragen.push(['recht', Number(v.vergoedingRecht)]);
      if (v.gewasschade !== '' && v.gewasschade != null && !isNaN(Number(v.gewasschade))) bedragen.push(['gewas', Number(v.gewasschade)]);
      const totaal = bedragen.reduce((a, [, n]) => a + n, 0);
      const vergoedSub = bedragen.length > 1 ? `<div class="sub">${bedragen.map(([k, n]) => `${k} ${fmtEuro(n)}`).join(' · ')}</div>` : '';
      // Meest relevante mijlpaal: gepasseerd > getekend > streefdatum (met waarschuwing).
      const mijlpaal = v.datumGepasseerd
        ? `${fmtDatum(v.datumGepasseerd)}<div class="sub">notarieel gepasseerd</div>`
        : v.datumGetekend
          ? `${fmtDatum(v.datumGetekend)}<div class="sub">getekend${v.verwachtBesluit ? ' · passeren ' + fmtDatum(v.verwachtBesluit) : ''}</div>`
          : `${datumCel(v)}<div class="sub">${v.verwachtBesluit ? 'streefdatum passeren' : ''}</div>`;
      return `<tr data-id="${htmlEsc(v.id)}" class="rij">
        ${wpCel(wp)}
        <td><strong>${htmlEsc(v.bevoegdGezag || '—')}</strong><div class="sub">${htmlEsc(v.kadastraal || '')}${v.pachter ? (v.kadastraal ? ' · ' : '') + 'pachter: ' + htmlEsc(v.pachter) : ''}</div></td>
        <td>${htmlEsc(zroRechtLabel(v.soortRecht))}<div class="sub">${htmlEsc(strook)}</div></td>
        <td>${regBadge(st)}${v.grondverwerver ? `<div class="sub">via ${htmlEsc(v.grondverwerver)}</div>` : ''}</td>
        <td>${totaal > 0 ? fmtEuro(totaal) : '—'}${vergoedSub}</td>
        <td>${mijlpaal}</td>
        ${actieCel(v)}
      </tr>`;
    }
    const proc = vgProcedure(v.procedure);
    // Meest relevante besluitmijlpaal: onherroepelijk > verleend > beslistermijn.
    const besluit = v.datumOnherroepelijk
      ? `${fmtDatum(v.datumOnherroepelijk)}<div class="sub">onherroepelijk</div>`
      : v.datumVerleend
        ? `${fmtDatum(v.datumVerleend)}<div class="sub">verleend${v.status === 'verleend' ? ' · bezwaartermijn loopt' : ''}</div>`
        : `${datumCel(v)}<div class="sub">${v.verwachtBesluit ? 'beslistermijn' : ''}</div>`;
    return `<tr data-id="${htmlEsc(v.id)}" class="rij">
      ${wpCel(wp)}
      <td>${htmlEsc(vgLabelType(v.type))}<div class="sub">${htmlEsc(v.omschrijving || '')}</div></td>
      <td>${htmlEsc(v.bevoegdGezag || '—')}<div class="sub">${v.zaaknummer ? 'zaak ' + htmlEsc(v.zaaknummer) : ''}</div></td>
      <td>${proc ? htmlEsc(proc[1].split(' (')[0]) : '—'}<div class="sub">${v.aangevraagd ? 'ingediend ' + fmtDatum(v.aangevraagd) : 'nog niet ingediend'}</div></td>
      <td>${regBadge(st)}${v.behandelaar ? `<div class="sub">via ${htmlEsc(v.behandelaar)}</div>` : ''}</td>
      <td>${besluit}</td>
      ${actieCel(v)}
    </tr>`;
  }).join('');
  const titel = zro ? 'ZRO / zakelijk recht' : 'Vergunningen';
  const leegTekst = alle.length
    ? (zro ? 'Geen ZRO’s in deze selectie.' : 'Geen vergunningen in deze selectie.')
    : (zro ? 'Nog geen ZRO’s vastgelegd. Klik op “Toevoegen”.' : 'Nog geen vergunningen vastgelegd. Klik op “Toevoegen”.');
  const koppen = zro
    ? '<th>Werkpakket</th><th>Grondeigenaar / perceel</th><th>Recht / strook</th><th>Status</th><th>Vergoeding</th><th>Mijlpaal</th><th></th>'
    : '<th>Werkpakket</th><th>Vergunning / activiteit</th><th>Bevoegd gezag / zaak</th><th>Procedure</th><th>Status</th><th>Besluit</th><th></th>';
  el(inhoudSel).innerHTML = `<div class="card">
    <div class="card-kop"><h2>${titel}<span class="tel">${lijst.length}</span></h2><span class="hint">Klik op een rij om te bewerken</span></div>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr>${koppen}</tr></thead>
      <tbody>${rows || `<tr><td colspan="7" class="leeg">${leegTekst}</td></tr>`}</tbody>
    </table></div></div>`;
  els(`${inhoudSel} .rij`).forEach((tr) => tr.addEventListener('click', () => openVergunning(vergunningById(tr.dataset.id))));
}
function vergunningById(id) { return (State.vergunningen || []).find((v) => v.id === id); }

function vergunningForm(item, prefillWpId, prefillType) {
  item = item || {};
  const wpSel = item.wpId || prefillWpId || '';
  const typeSel = item.type || prefillType || 'omgevingsvergunning';
  const wpOpts = State.werkpakketten.slice().sort((a, b) => (a.project + a.wp).localeCompare(b.project + b.wp))
    .map((w) => `<option value="${htmlEsc(w.id)}"${w.id === wpSel ? ' selected' : ''}>${htmlEsc(w.project)} · ${htmlEsc(apdVan(w))} · ${htmlEsc(w.wp)}</option>`).join('');
  // ZRO's hebben hun eigen pagina en formulier; hier niet aanbieden.
  const typeOpts = VG_TYPES.filter(([v]) => v !== 'zro').map(([v, l]) => `<option value="${v}"${v === typeSel ? ' selected' : ''}>${l}</option>`).join('');
  const statusOpts = Object.entries(VG_STATUS).map(([k, o]) => `<option value="${k}"${k === (item.status || 'nodig') ? ' selected' : ''}>${o.label}</option>`).join('');
  const procOpts = ['<option value="">—</option>'].concat(VG_PROCEDURES.map(([v, l]) => `<option value="${v}"${v === (item.procedure || '') ? ' selected' : ''}>${l}</option>`)).join('');
  const gezagLijst = `<datalist id="vgGezagLijst">${VG_GEZAGEN.map((g) => `<option value="${htmlEsc(g)}">`).join('')}</datalist>`;
  return `
    <div class="modal-veld"><label>Werkpakket</label><select id="vgWp">${wpOpts}</select></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Type / activiteit</label><select id="vgType">${typeOpts}</select></div>
      <div class="modal-veld"><label>Status</label><select id="vgStatus">${statusOpts}</select></div>
    </div>
    <div class="modal-veld"><label>Omschrijving</label><input id="vgOmschr" value="${htmlEsc(item.omschrijving || '')}" placeholder="bijv. kruising hoofdwatergang De Ee (gestuurde boring)"></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Bevoegd gezag</label><input id="vgGezag" list="vgGezagLijst" value="${htmlEsc(item.bevoegdGezag || '')}" placeholder="bijv. Wetterskip Fryslân">${gezagLijst}</div>
      <div class="modal-veld"><label>Zaaknummer / kenmerk</label><input id="vgZaak" value="${htmlEsc(item.zaaknummer || '')}" placeholder="bijv. DSO-2026-041233"></div>
    </div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Procedure</label><select id="vgProcedure">${procOpts}</select></div>
      <div class="modal-veld"><label>Behandelaar / indiener</label><input id="vgBehandelaar" value="${htmlEsc(item.behandelaar || '')}" placeholder="wie bereidt voor en dient in"></div>
    </div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Ingediend op</label><input id="vgAangevraagd" type="date" value="${htmlEsc(item.aangevraagd || '')}"></div>
      <div class="modal-veld"><label>Beslistermijn / verwacht besluit</label><input id="vgBesluit" type="date" value="${htmlEsc(item.verwachtBesluit || '')}" title="Leeg laten = berekend uit ingediend-datum + procedure"></div>
    </div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Verleend op</label><input id="vgVerleend" type="date" value="${htmlEsc(item.datumVerleend || '')}"></div>
      <div class="modal-veld"><label>Onherroepelijk op</label><input id="vgOnherroepelijk" type="date" value="${htmlEsc(item.datumOnherroepelijk || '')}"></div>
    </div>
    <div class="modal-veld"><label>Leges (€)</label><input id="vgLeges" type="number" min="0" step="1" value="${htmlEsc(item.leges == null ? '' : String(item.leges))}" placeholder="leeg = geen / onbekend"></div>
    <div class="modal-veld"><label>Voorschriften / voorwaarden</label><textarea id="vgVoorschriften" rows="2" placeholder="voorwaarden uit het (ontwerp)besluit die doorwerken in ontwerp of uitvoering…">${htmlEsc(item.voorschriften || '')}</textarea></div>
    <div class="modal-veld"><label>Notitie</label><textarea id="vgNotitie" rows="2" placeholder="toelichting, vooroverleg, restpunten…">${htmlEsc(item.notitie || '')}</textarea></div>
    <div class="modal-foot">
      ${item.id ? '<button class="verwijder-knop" id="vgVerwijder">Verwijderen</button>' : ''}
      <button class="ghost" id="vgAnnuleer">Annuleren</button>
      <button class="primair" id="vgOpslaan">Opslaan</button>
    </div>`;
}

function openVergunning(item, prefillWpId, prefillType) {
  if (!magReg()) { toast('Alleen ontwerpleider/manager kan vergunningen en ZRO’s bewerken', 'fout'); return; }
  const zro = item ? isZro(item) : prefillType === 'zro';
  // ZRO's hebben een eigen, uitgebreider formulier (zro.js).
  if (zro && typeof openZro === 'function') { openZro(item, prefillWpId); return; }
  const naam = zro ? 'ZRO' : 'Vergunning';
  openModal(item ? `${naam} bewerken` : `${naam} toevoegen`, vergunningForm(item, prefillWpId, prefillType));
  el('#vgOpslaan').addEventListener('click', () => {
    const wpId = el('#vgWp').value;
    const omschrijving = el('#vgOmschr').value.trim();
    if (!wpId) { toast('Kies een werkpakket', 'fout'); return; }
    if (!omschrijving) { toast('Vul een omschrijving in', 'fout'); return; }
    const legesVal = el('#vgLeges').value.trim();
    const rec = {
      id: (item && item.id) || nieuwId('vg'),
      wpId, type: el('#vgType').value, status: el('#vgStatus').value,
      omschrijving, bevoegdGezag: el('#vgGezag').value.trim(),
      zaaknummer: el('#vgZaak').value.trim(),
      procedure: el('#vgProcedure').value,
      behandelaar: el('#vgBehandelaar').value.trim(),
      aangevraagd: el('#vgAangevraagd').value, verwachtBesluit: el('#vgBesluit').value,
      datumVerleend: el('#vgVerleend').value,
      datumOnherroepelijk: el('#vgOnherroepelijk').value,
      leges: legesVal === '' ? '' : Number(legesVal),
      voorschriften: el('#vgVoorschriften').value.trim(),
      notitie: el('#vgNotitie').value.trim(),
    };
    // Beslistermijn leeg maar wel ingediend + procedure bekend? Reken de
    // wettelijke termijn uit (8/26/4 weken na indiening).
    const proc = vgProcedure(rec.procedure);
    if (!rec.verwachtBesluit && rec.aangevraagd && proc) {
      const d = parseDatum(rec.aangevraagd);
      if (d) {
        d.setDate(d.getDate() + proc[2]);
        rec.verwachtBesluit = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }
    }
    State.vergunningen = (State.vergunningen || []).filter((v) => v.id !== rec.id);
    State.vergunningen.push(rec);
    State.bewaar(); sluitModal(); renderVergunningen(); renderZro();
    if (State.actiefWp) renderDetail(State.actiefWp);
    toast(isZro(rec) ? 'ZRO opgeslagen' : 'Vergunning opgeslagen', 'ok');
  });
  el('#vgAnnuleer').addEventListener('click', sluitModal);
  const vw = el('#vgVerwijder');
  if (vw) vw.addEventListener('click', () => {
    if (!confirm(zro ? 'Deze ZRO verwijderen?' : 'Deze vergunning verwijderen?')) return;
    State.vergunningen = (State.vergunningen || []).filter((v) => v.id !== item.id);
    State.bewaar(); sluitModal(); renderVergunningen(); renderZro();
    if (State.actiefWp) renderDetail(State.actiefWp);
    toast(zro ? 'ZRO verwijderd' : 'Vergunning verwijderd', 'ok');
  });
}

/* ----------------- Register-overzicht in het WP-detailpaneel ------------- */
function detailRegistersHtml(wp) {
  const rij = (v) => {
    const st = vgStatusInfo(v);
    const waarsch = vgOvertijd(v) ? ' <span style="color:var(--rood)">⚠ over besluitdatum</span>' : vgNaderend(v) ? ' <span style="color:var(--amber)">• nadert</span>' : '';
    return `<li data-vg="${htmlEsc(v.id)}"><span>${htmlEsc(vgLabelType(v.type))}${v.omschrijving ? ' — ' + htmlEsc(v.omschrijving) : ''}${waarsch}</span>${regBadge(st)}</li>`;
  };
  const alle = vergunningenVoor(wp.id);
  const vgs = alle.filter((v) => !isZro(v));
  const zros = alle.filter(isZro);
  const vgRijen = vgs.length ? vgs.map(rij).join('') : '<li class="leeg-mini">Nog geen vergunningen.</li>';
  const zroRijen = zros.length ? zros.map(rij).join('') : '<li class="leeg-mini">Nog geen ZRO’s.</li>';
  const addVg = magReg() ? '<button class="mini-knop" id="drawVgAdd">+ toevoegen</button>' : '';
  const addZro = magReg() ? '<button class="mini-knop" id="drawZroAdd">+ toevoegen</button>' : '';
  return `<div class="reg-blok">
    <div class="reg-kop"><h3>Vergunningen</h3>${addVg}</div>
    <ul class="reg-mini-lijst">${vgRijen}</ul>
    <div class="reg-kop" style="margin-top:12px"><h3>ZRO / zakelijk recht</h3>${addZro}</div>
    <ul class="reg-mini-lijst">${zroRijen}</ul>
  </div>`;
}

function bindDetailRegisters(wp) {
  const add = el('#drawVgAdd'); if (add) add.addEventListener('click', () => openVergunning(null, wp.id));
  const addZro = el('#drawZroAdd'); if (addZro) addZro.addEventListener('click', () => openVergunning(null, wp.id, 'zro'));
  els('#detailRegisters li[data-vg]').forEach((li) => li.addEventListener('click', () => openVergunning(vergunningById(li.dataset.vg))));
}

/* ------------------------- Samenvatting voor AI -------------------------- */
function registerRapportData(scope) {
  const inScope = (wpId) => { const w = wpById(wpId); return w && (scope === 'portfolio' || w.project === scope); };
  const alle = (State.vergunningen || []).filter((v) => inScope(v.wpId));
  const samenvat = (items) => {
    const tel = { totaal: items.length, openstaand: items.filter((v) => vgGroep(v) === 'open').length, aangevraagd: items.filter((v) => vgGroep(v) === 'aangevraagd').length, verleend: items.filter((v) => vgGroep(v) === 'verleend').length };
    const over = items.filter(vgOvertijd).map((v) => { const w = wpById(v.wpId); return { wp: w ? `${w.project} · ${w.wp}` : '', type: vgLabelType(v.type), omschrijving: v.omschrijving, verwachtBesluit: fmtDatum(v.verwachtBesluit) }; });
    return { ...tel, overBesluitdatum: over };
  };
  const zros = alle.filter(isZro);
  const zroSam = samenvat(zros);
  return {
    vergunningen: samenvat(alle.filter((v) => !isZro(v))),
    zro: {
      totaal: zroSam.totaal,
      inGesprek: zroSam.openstaand,
      conceptOfGedoogprocedure: zroSam.aangevraagd,
      getekendOfGepasseerd: zroSam.verleend,
      overStreefdatum: zroSam.overBesluitdatum,
    },
  };
}

/* ------------------------------- Init ------------------------------------ */
function registersInit() {
  el('#vgToevoegen').addEventListener('click', () => openVergunning(null));
  const zroKnop = el('#zroToevoegen');
  if (zroKnop) zroKnop.addEventListener('click', () => openVergunning(null, null, 'zro'));
  el('#modalClose').addEventListener('click', sluitModal);
  el('#modalOverlay').addEventListener('click', sluitModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && el('#modal').classList.contains('open')) sluitModal(); });
}

if (typeof window !== 'undefined') {
  window.renderVergunningen = renderVergunningen;
  window.renderZro = renderZro;
  window.detailRegistersHtml = detailRegistersHtml;
  window.bindDetailRegisters = bindDetailRegisters;
  window.registerRapportData = registerRapportData;
  window.registersInit = registersInit;
}
