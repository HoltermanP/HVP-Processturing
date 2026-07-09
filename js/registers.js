/* ==========================================================================
   Registers — Vergunningen & ZRO.
   Hangen aan werkpakketten en worden via Neon (db.js) bewaard. Gebruikt
   functies/State uit app.js (op runtime beschikbaar). Het risicoregister is
   verwijderd: risico's worden in een ander systeem bijgehouden (de data in
   State.risicos blijft bewaard maar heeft hier geen UI meer).
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

/* -------------------------------- Helpers -------------------------------- */
function magReg() { return !window.Auth || Auth.magVolledig(); }
function nieuwId(prefix) { return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`; }
function wpById(id) { return State.werkpakketten.find((w) => w.id === id); }
function vgLabelType(t) { const m = VG_TYPES.find((x) => x[0] === t); return m ? m[1] : t; }
function regBadge(info) { return `<span class="reg-badge" style="background:${info.kleur}22;color:${info.kleur}">${htmlEsc(info.label)}</span>`; }

function vergunningenVoor(wpId) { return (State.vergunningen || []).filter((v) => v.wpId === wpId); }

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
      const blob = `${wp.project} ${apdVan(wp)} ${wp.wp} ${v.omschrijving} ${v.bevoegdGezag} ${vgLabelType(v.type)}`.toLowerCase();
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
    { tf: 'open', cls: '', val: tel.open, label: 'openstaand' },
    { tf: 'aangevraagd', cls: 'amber', val: tel.aangevraagd, label: 'aangevraagd' },
    { tf: 'verleend', cls: 'groen', val: tel.verleend, label: 'verleend' },
    { tf: 'overtijd', cls: 'rood', val: tel.overtijd, label: 'over besluitdatum' },
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
  const titel = zro ? 'ZRO / zakelijk recht' : 'Vergunningen';
  const gezagKop = zro ? 'Partij / grondeigenaar' : 'Bevoegd gezag';
  const leegTekst = alle.length
    ? (zro ? 'Geen ZRO’s in deze selectie.' : 'Geen vergunningen in deze selectie.')
    : (zro ? 'Nog geen ZRO’s vastgelegd. Klik op “Toevoegen”.' : 'Nog geen vergunningen vastgelegd. Klik op “Toevoegen”.');
  el(inhoudSel).innerHTML = `<div class="card">
    <div class="card-kop"><h2>${titel}<span class="tel">${lijst.length}</span></h2><span class="hint">Klik op een rij om te bewerken</span></div>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th>Werkpakket</th><th>Type / omschrijving</th><th>${gezagKop}</th><th>Status</th><th>Aangevraagd</th><th>Verwacht besluit</th><th></th></tr></thead>
      <tbody>${rows || `<tr><td colspan="7" class="leeg">${leegTekst}</td></tr>`}</tbody>
    </table></div></div>`;
  els(`${inhoudSel} .rij`).forEach((tr) => tr.addEventListener('click', () => openVergunning(vergunningById(tr.dataset.id))));
}
function vergunningById(id) { return (State.vergunningen || []).find((v) => v.id === id); }

function vergunningForm(item, prefillWpId, prefillType) {
  item = item || {};
  const wpSel = item.wpId || prefillWpId || '';
  const typeSel = item.type || prefillType || '';
  const wpOpts = State.werkpakketten.slice().sort((a, b) => (a.project + a.wp).localeCompare(b.project + b.wp))
    .map((w) => `<option value="${htmlEsc(w.id)}"${w.id === wpSel ? ' selected' : ''}>${htmlEsc(w.project)} · ${htmlEsc(apdVan(w))} · ${htmlEsc(w.wp)}</option>`).join('');
  const typeOpts = VG_TYPES.map(([v, l]) => `<option value="${v}"${v === typeSel ? ' selected' : ''}>${l}</option>`).join('');
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

function openVergunning(item, prefillWpId, prefillType) {
  if (!magReg()) { toast('Alleen ontwerpleider/manager kan vergunningen en ZRO’s bewerken', 'fout'); return; }
  const zro = item ? isZro(item) : prefillType === 'zro';
  const naam = zro ? 'ZRO' : 'Vergunning';
  openModal(item ? `${naam} bewerken` : `${naam} toevoegen`, vergunningForm(item, prefillWpId, prefillType));
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
    const st = VG_STATUS[v.status] || VG_STATUS.nodig;
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
  return {
    vergunningen: samenvat(alle.filter((v) => !isZro(v))),
    zro: samenvat(alle.filter(isZro)),
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
