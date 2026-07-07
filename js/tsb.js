/* ==========================================================================
   TSB — kostenbegrotingen, gewerkte uren en gemaakte kosten per project.

   Overgenomen uit de losse HVP-TSB-app en geïntegreerd in Procesturing:
   - Formats: rollen + uurtarieven en de structuur fasen ▸ groepen ▸ regelitems.
   - Begrotingen: per project een TSB op basis van een format; hoeveelheden en
     inzet invullen, bedragen/uren/prijs per eenheid worden berekend met
     subtotalen per fase en een eindtotaal.
   - Uren & kosten: gewerkte uren per maand/rol en overige gemaakte kosten,
     handmatig of via CSV-import.
   - Sturing: begroot versus besteed (uren én euro's) per project en per rol.

   Rekenregels (uit het oorspronkelijke begrotingsformat):
     duur[rol]    = inzet[rol] × hoeveelheid
     bedrag[rol]  = duur[rol] × tarief[rol]
     totaalbedrag = som van alle bedragen
     prijs/ehd    = totaalbedrag / (hoeveelheid × prijsfactor)

   Data leeft onder State.tsb = { formats, projecten, instellingen } en wordt
   via db.js in Neon bewaard. Gebruikt globals uit app.js/registers.js
   (State, el/els, htmlEsc, toast, openModal, nieuwId, …) op runtime.
   ========================================================================== */
'use strict';

/* ------------------------------- Constanten ------------------------------ */
// Standaard afleiding eenheid → prijseenheid + factor (bijv. km met prijs /m).
const TSB_EENHEDEN = {
  km:   { prijsEenheid: '/m',    factor: 1000 },
  m:    { prijsEenheid: '/m',    factor: 1 },
  st:   { prijsEenheid: '/st',   factor: 1 },
  keer: { prijsEenheid: '/keer', factor: 1 },
  week: { prijsEenheid: '/week', factor: 1 },
  dag:  { prijsEenheid: '/dag',  factor: 1 },
  uur:  { prijsEenheid: '/uur',  factor: 1 },
};
const TSB_EENHEID_KEUZES = Object.keys(TSB_EENHEDEN);

const TSB_TABS = [
  ['sturing', 'Sturing'],
  ['begrotingen', 'Begrotingen'],
  ['uren', 'Uren & kosten'],
  ['formats', 'Formats'],
];

// Niet-persistente UI-staat van de TSB-module.
const TsbUI = { tab: 'sturing', scope: 'alle', periode: '', begroting: null, format: null, urenProject: '' };

/* -------------------------------- Helpers -------------------------------- */
function tsbData() {
  if (!State.tsb || typeof State.tsb !== 'object') State.tsb = {};
  if (!Array.isArray(State.tsb.formats)) State.tsb.formats = [];
  if (!Array.isArray(State.tsb.projecten)) State.tsb.projecten = [];
  if (!State.tsb.instellingen || typeof State.tsb.instellingen !== 'object') State.tsb.instellingen = {};
  return State.tsb;
}
function magTsb() { return !window.Auth || Auth.magVolledig(); }
// Uren/kosten boeken mag ook door gebruikers die aan een werkpakket van het
// project zijn toegewezen (zij voeren hun eigen uren op).
function magTsbUren(projectNaam) {
  if (magTsb()) return true;
  try { return Auth.mijnWerkpakketten().some((w) => w.project === projectNaam); }
  catch { return false; }
}
function tsbGetal(v) {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(',', '.'));
  return isFinite(n) ? n : 0;
}
function fmtGeld(n, dec = 0) {
  return (tsbGetal(n)).toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function fmtUren(n, dec = 0) {
  return (tsbGetal(n)).toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: dec });
}
function tsbHuidigePeriode() { return isoDatum(VANDAAG).slice(0, 7); }
function tsbPeriodeLabel(p) {
  const d = parseDatum(`${p}-01`);
  return d ? d.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' }) : (p || '—');
}
function tsbProjectById(id) { return tsbData().projecten.find((p) => p.id === id); }
function tsbFormatById(id) { return tsbData().formats.find((f) => f.id === id); }
// Kleur voor bestedingspercentages: groen (<80), amber (80–100), rood (>100).
function tsbBurnKleur(pct) {
  if (pct == null) return 'var(--faint)';
  return pct > 100 ? 'var(--rood)' : pct >= 80 ? 'var(--amber)' : 'var(--groen)';
}

/* --------------------------- Rekenmodule (kern) -------------------------- */
function tsbEenheidInfo(eenheid) {
  return TSB_EENHEDEN[eenheid] || { prijsEenheid: '/' + (eenheid || 'st'), factor: 1 };
}

// Eén regelitem: duur en bedrag per rol, totalen en prijs per eenheid.
function tsbBerekenItem(item, rollen) {
  const hoeveelheid = tsbGetal(item.hoeveelheid);
  const inzet = item.inzet || {};
  const factor = item.prijsFactor != null ? tsbGetal(item.prijsFactor) : tsbEenheidInfo(item.eenheid).factor;
  const duur = {}, bedrag = {};
  let totaalUren = 0, totaalBedrag = 0;
  rollen.forEach((rol) => {
    const d = tsbGetal(inzet[rol.id]) * hoeveelheid;
    const b = d * tsbGetal(rol.tarief);
    duur[rol.id] = d; bedrag[rol.id] = b;
    totaalUren += d; totaalBedrag += b;
  });
  const noemer = hoeveelheid * factor;
  return { hoeveelheid, duur, bedrag, totaalUren, totaalBedrag, prijs: noemer > 0 ? totaalBedrag / noemer : null };
}

// Hele begroting: per groep, subtotaal per fase en eindtotaal.
function tsbBerekenBegroting(doc) {
  const rollen = doc.rollen || [];
  const leegPerRol = () => { const o = {}; rollen.forEach((r) => { o[r.id] = { duur: 0, bedrag: 0 }; }); return o; };
  const totaal = { uren: 0, bedrag: 0, perRol: leegPerRol() };
  const fasen = (doc.fasen || []).map((fase) => {
    const fTot = { id: fase.id, uren: 0, bedrag: 0, perRol: leegPerRol(), groepen: [] };
    (fase.groepen || []).forEach((groep) => {
      const gTot = { id: groep.id, uren: 0, bedrag: 0, perRol: leegPerRol(), items: {} };
      (groep.items || []).forEach((item) => {
        const c = tsbBerekenItem(item, rollen);
        gTot.items[item.id] = c;
        gTot.uren += c.totaalUren; gTot.bedrag += c.totaalBedrag;
        rollen.forEach((r) => { gTot.perRol[r.id].duur += c.duur[r.id]; gTot.perRol[r.id].bedrag += c.bedrag[r.id]; });
      });
      fTot.uren += gTot.uren; fTot.bedrag += gTot.bedrag;
      rollen.forEach((r) => { fTot.perRol[r.id].duur += gTot.perRol[r.id].duur; fTot.perRol[r.id].bedrag += gTot.perRol[r.id].bedrag; });
      fTot.groepen.push(gTot);
    });
    totaal.uren += fTot.uren; totaal.bedrag += fTot.bedrag;
    rollen.forEach((r) => { totaal.perRol[r.id].duur += fTot.perRol[r.id].duur; totaal.perRol[r.id].bedrag += fTot.perRol[r.id].bedrag; });
    return fTot;
  });
  return { fasen, totaal };
}

/* ------------------- Werkelijk: gewerkte uren & kosten ------------------- */
// Cumulatief t/m totPeriode ('JJJJ-MM', leeg = alles). Kosten van uren =
// uren × tarief van de rol in de TSB; daarnaast tellen de overige kosten mee.
function tsbWerkelijk(tp, totPeriode) {
  const rolIndex = {};
  (tp.rollen || []).forEach((r) => { rolIndex[r.id] = r; });
  const w = { uren: 0, urenKosten: 0, overigeKosten: 0, kosten: 0, perRol: {}, perPeriode: {} };
  (tp.uren || []).forEach((u) => {
    if (totPeriode && u.periode > totPeriode) return;
    const rol = rolIndex[u.rolId];
    const uren = tsbGetal(u.uren);
    const kosten = uren * (rol ? tsbGetal(rol.tarief) : 0);
    w.uren += uren; w.urenKosten += kosten;
    const pr = w.perRol[u.rolId] || (w.perRol[u.rolId] = { uren: 0, kosten: 0 });
    pr.uren += uren; pr.kosten += kosten;
    const pp = w.perPeriode[u.periode] || (w.perPeriode[u.periode] = { uren: 0, kosten: 0 });
    pp.uren += uren; pp.kosten += kosten;
  });
  (tp.kosten || []).forEach((k) => {
    if (totPeriode && k.periode > totPeriode) return;
    const b = tsbGetal(k.bedrag);
    w.overigeKosten += b;
    const pp = w.perPeriode[k.periode] || (w.perPeriode[k.periode] = { uren: 0, kosten: 0 });
    pp.kosten += b;
  });
  w.kosten = w.urenKosten + w.overigeKosten;
  return w;
}

function tsbProjectCijfers(tp, totPeriode) {
  const begroting = tsbBerekenBegroting(tp);
  const werkelijk = tsbWerkelijk(tp, totPeriode);
  return {
    begroting, werkelijk,
    pctBedrag: begroting.totaal.bedrag > 0 ? Math.round((werkelijk.kosten / begroting.totaal.bedrag) * 100) : null,
    pctUren: begroting.totaal.uren > 0 ? Math.round((werkelijk.uren / begroting.totaal.uren) * 100) : null,
  };
}

/* ---------------------------- Standaardformat ---------------------------- */
function tsbStandaardFormat() {
  const ROLLEN = [
    ['110010', 'PL/PM', 125], ['110020', 'Ontwerpleider', 115],
    ['110030', 'Senior Engineer', 105], ['110040', 'Medior Engineer', 95],
    ['110050', 'Junior Engineer', 80], ['110060', 'Omgevingsmanager', 105],
    ['110070', 'Tekenaar/Modelleur', 85], ['110080', 'Projectondersteuning', 70],
  ];
  const rollen = ROLLEN.map(([code, naam, tarief]) => ({ id: nieuwId('rol'), code, naam, tarief }));
  const perNaam = {}; rollen.forEach((r) => { perNaam[r.naam] = r.id; });
  const item = (naam, eenheid, inzetPerNaam) => {
    const inzet = {};
    rollen.forEach((r) => { inzet[r.id] = 0; });
    Object.entries(inzetPerNaam).forEach(([naamRol, uren]) => { if (perNaam[naamRol]) inzet[perNaam[naamRol]] = uren; });
    return { id: nieuwId('item'), naam, eenheid, inzet };
  };
  const fase = (code, naam) => ({
    id: nieuwId('fase'), code, naam,
    groepen: [
      { id: nieuwId('grp'), naam: 'Ontwerp & engineering', items: [
        item('Tracéontwerp', 'km', { Ontwerpleider: 2, 'Senior Engineer': 8, 'Medior Engineer': 16, 'Tekenaar/Modelleur': 12 }),
        item('Kruisingen & boringen', 'st', { 'Senior Engineer': 4, 'Medior Engineer': 8 }),
        item('Berekeningen & rapportages', 'st', { 'Senior Engineer': 6, 'Medior Engineer': 10 }),
      ] },
      { id: nieuwId('grp'), naam: 'Omgeving & vergunningen', items: [
        item('Vergunningaanvragen', 'st', { Omgevingsmanager: 10, Projectondersteuning: 2 }),
        item('Stakeholderafstemming', 'week', { Omgevingsmanager: 4 }),
      ] },
      { id: nieuwId('grp'), naam: 'Periodieke acties', items: [
        item('Projectmanagement', 'week', { 'PL/PM': 4, Projectondersteuning: 2 }),
        item('Bouwteamoverleg', 'keer', { 'PL/PM': 2, Ontwerpleider: 2 }),
      ] },
    ],
  });
  const nu = new Date().toISOString();
  return { id: nieuwId('fmt'), naam: 'Standaardformat VO/DO/UO', rollen, fasen: [fase('402010', 'VO'), fase('402020', 'DO'), fase('402030', 'UO')], aangemaakt: nu, bijgewerkt: nu };
}

/* ------------------------------ Hoofd-render ------------------------------ */
function renderTsb() {
  const node = el('#tsbInhoud'); if (!node) return;
  tsbData();
  el('#tsbTabs').innerHTML = TSB_TABS.map(([id, label]) =>
    `<button data-tsbtab="${id}"${TsbUI.tab === id ? ' class="actief"' : ''}>${label}</button>`).join('');
  els('#tsbTabs button').forEach((b) => b.addEventListener('click', () => { TsbUI.tab = b.dataset.tsbtab; renderTsb(); }));
  if (TsbUI.tab === 'sturing') renderTsbSturing(node);
  else if (TsbUI.tab === 'begrotingen') renderTsbBegrotingen(node);
  else if (TsbUI.tab === 'uren') renderTsbUrenKosten(node);
  else renderTsbFormats(node);
  // Houd de TSB-kaart op het hoofddashboard in de pas: tabwissel doet geen
  // volledige render en alle TSB-mutaties komen langs renderTsb.
  renderDashboardTsb();
}

function tsbLeegHtml(tekst, knopId, knopLabel) {
  return `<div class="card"><div class="leeg-visual"><span class="lv-ico">💶</span>${tekst}
    ${knopId ? `<button class="primair" id="${knopId}" style="margin-top:10px">${knopLabel}</button>` : ''}</div></div>`;
}

/* ============================== STURING ================================= */
function renderTsbSturing(node) {
  const d = tsbData();
  const projecten = d.projecten.slice().sort((a, b) => a.projectNaam.localeCompare(b.projectNaam));
  if (!projecten.length) {
    node.innerHTML = tsbLeegHtml('Nog geen TSB’s opgesteld. Maak eerst per project een begroting; daarna zie je hier begroot versus besteed.', 'tsbNaarBegrotingen', 'Naar begrotingen');
    el('#tsbNaarBegrotingen').addEventListener('click', () => { TsbUI.tab = 'begrotingen'; renderTsb(); });
    return;
  }
  if (TsbUI.scope !== 'alle' && !projecten.some((p) => p.id === TsbUI.scope)) TsbUI.scope = 'alle';
  const inScope = TsbUI.scope === 'alle' ? projecten : projecten.filter((p) => p.id === TsbUI.scope);

  const periodes = [...new Set(projecten.flatMap((p) => [
    ...(p.uren || []).map((u) => u.periode), ...(p.kosten || []).map((k) => k.periode),
  ]))].filter(Boolean).sort();
  if (TsbUI.periode && !periodes.includes(TsbUI.periode)) TsbUI.periode = '';

  // Totalen over de scope + cijfers per project.
  const perProject = inScope.map((p) => ({ tp: p, c: tsbProjectCijfers(p, TsbUI.periode || null) }));
  const tot = { begrootUren: 0, begrootBedrag: 0, uren: 0, urenKosten: 0, overigeKosten: 0, kosten: 0 };
  perProject.forEach(({ c }) => {
    tot.begrootUren += c.begroting.totaal.uren; tot.begrootBedrag += c.begroting.totaal.bedrag;
    tot.uren += c.werkelijk.uren; tot.urenKosten += c.werkelijk.urenKosten;
    tot.overigeKosten += c.werkelijk.overigeKosten; tot.kosten += c.werkelijk.kosten;
  });
  const pctBedrag = tot.begrootBedrag > 0 ? Math.round((tot.kosten / tot.begrootBedrag) * 100) : null;
  const pctUren = tot.begrootUren > 0 ? Math.round((tot.uren / tot.begrootUren) * 100) : null;

  const scopeHtml = `<div class="niveau-rij"><div class="seg-control" id="tsbScope">
      <button data-scope="alle"${TsbUI.scope === 'alle' ? ' class="actief"' : ''}>Alle projecten</button>
      ${projecten.map((p) => `<button data-scope="${htmlEsc(p.id)}"${TsbUI.scope === p.id ? ' class="actief"' : ''}>${htmlEsc(p.projectNaam)}</button>`).join('')}
    </div>
    <select id="tsbPeriodeKiezer" title="Werkelijke uren en kosten cumulatief tot en met deze maand">
      <option value="">Besteed: alle periodes</option>
      ${periodes.map((p) => `<option value="${htmlEsc(p)}"${TsbUI.periode === p ? ' selected' : ''}>t/m ${htmlEsc(tsbPeriodeLabel(p))}</option>`).join('')}
    </select></div>`;

  const tiles = [
    { val: `${fmtGeld(tot.begrootBedrag)}`, label: 'Begroot (TSB)', cls: '' },
    { val: `${fmtGeld(tot.kosten)}`, label: `Besteed${pctBedrag != null ? ` · ${pctBedrag}%` : ''}`, cls: pctBedrag != null && pctBedrag > 100 ? 'kpi-rood' : pctBedrag != null && pctBedrag >= 80 ? 'kpi-amber' : 'kpi-groen' },
    { val: `${fmtGeld(tot.begrootBedrag - tot.kosten)}`, label: 'Restbudget', cls: tot.begrootBedrag - tot.kosten < 0 ? 'kpi-rood' : '' },
    { val: `${fmtUren(tot.begrootUren)}<small> uur</small>`, label: 'Begrote uren', cls: 'kpi-paars' },
    { val: `${fmtUren(tot.uren)}<small> uur</small>`, label: `Gewerkte uren${pctUren != null ? ` · ${pctUren}%` : ''}`, cls: pctUren != null && pctUren > 100 ? 'kpi-rood' : '' },
    { val: `${fmtGeld(tot.overigeKosten)}`, label: 'Overige kosten', cls: '' },
  ];
  const kpiHtml = `<div class="kpis">${tiles.map((t) =>
    `<div class="kpi ${t.cls}"><div class="kpi-val">${t.val}</div><div class="kpi-label">${t.label}</div></div>`).join('')}</div>`;

  // Burn-rijen per project (besteed t.o.v. begroot, in euro's).
  const projRijen = perProject.map(({ tp, c }) => {
    const pct = c.pctBedrag;
    const breedte = pct == null ? 0 : Math.min(100, pct);
    return `<div class="tsb-burn" data-tsb="${htmlEsc(tp.id)}" tabindex="0" role="button" title="Klik voor sturing op dit project">
      <div class="vp-kop"><span class="vp-naam">${htmlEsc(tp.projectNaam)}</span>
        <span class="vp-pct" style="color:${tsbBurnKleur(pct)}">${pct != null ? pct + '%' : '—'}</span></div>
      <div class="statbar"><span class="stseg" style="width:${breedte}%;background:${tsbBurnKleur(pct)}"></span></div>
      <div class="vp-meta">${fmtGeld(c.werkelijk.kosten)} besteed van ${fmtGeld(c.begroting.totaal.bedrag)} begroot ·
        ${fmtUren(c.werkelijk.uren)} van ${fmtUren(c.begroting.totaal.uren)} uur${c.werkelijk.overigeKosten ? ` · ${fmtGeld(c.werkelijk.overigeKosten)} overige kosten` : ''}</div>
    </div>`;
  }).join('');

  // Per rol (samengevoegd op rolnaam over de projecten in scope).
  const rollen = {};
  perProject.forEach(({ tp, c }) => {
    (tp.rollen || []).forEach((r) => {
      const key = r.naam || r.code || r.id;
      const o = rollen[key] || (rollen[key] = { naam: key, tarief: tsbGetal(r.tarief), begrootUren: 0, begrootBedrag: 0, uren: 0, kosten: 0 });
      o.tarief = tsbGetal(r.tarief);
      const b = c.begroting.totaal.perRol[r.id];
      if (b) { o.begrootUren += b.duur; o.begrootBedrag += b.bedrag; }
      const w = c.werkelijk.perRol[r.id];
      if (w) { o.uren += w.uren; o.kosten += w.kosten; }
    });
  });
  const rolRijen = Object.values(rollen).filter((r) => r.begrootUren || r.uren)
    .sort((a, b) => b.begrootBedrag - a.begrootBedrag).map((r) => {
      const pct = r.begrootUren > 0 ? Math.round((r.uren / r.begrootUren) * 100) : null;
      return `<tr><td>${htmlEsc(r.naam)}</td><td class="num">${fmtGeld(r.tarief)}/uur</td>
        <td class="num">${fmtUren(r.begrootUren)}</td><td class="num">${fmtUren(r.uren, 1)}</td>
        <td class="num" style="color:${tsbBurnKleur(pct)};font-weight:700">${pct != null ? pct + '%' : '—'}</td>
        <td class="num">${fmtGeld(r.begrootBedrag)}</td><td class="num">${fmtGeld(r.kosten)}</td></tr>`;
    }).join('');

  // Per fase (begroot; werkelijke uren worden niet per fase geregistreerd).
  const fasen = {};
  perProject.forEach(({ tp, c }) => {
    (tp.fasen || []).forEach((f, i) => {
      const key = f.naam || f.code;
      const o = fasen[key] || (fasen[key] = { naam: key, uren: 0, bedrag: 0 });
      const ft = c.begroting.fasen[i];
      if (ft) { o.uren += ft.uren; o.bedrag += ft.bedrag; }
    });
  });
  const faseRijen = Object.values(fasen).map((f) =>
    `<tr><td>${htmlEsc(f.naam)}</td><td class="num">${fmtUren(f.uren)}</td><td class="num">${fmtGeld(f.bedrag)}</td></tr>`).join('');

  // Verloop per maand (uren + kosten inclusief overige kosten).
  const maanden = {};
  perProject.forEach(({ tp }) => {
    const w = tsbWerkelijk(tp, null);
    Object.entries(w.perPeriode).forEach(([p, o]) => {
      const m = maanden[p] || (maanden[p] = { uren: 0, kosten: 0 });
      m.uren += o.uren; m.kosten += o.kosten;
    });
  });
  const maandKeys = Object.keys(maanden).sort();
  const maxKosten = Math.max(1, ...maandKeys.map((m) => maanden[m].kosten));
  const maandHtml = maandKeys.length ? maandKeys.map((m) => `
    <div class="eng-rij"><span>${htmlEsc(tsbPeriodeLabel(m))}</span>
      <span class="bar wide"><span style="width:${Math.round((maanden[m].kosten / maxKosten) * 100)}%"></span></span>
      <span class="eng-tel">${fmtUren(maanden[m].uren, 1)} uur · ${fmtGeld(maanden[m].kosten)}</span></div>`).join('')
    : '<div class="leeg">Nog geen uren of kosten geboekt.</div>';

  node.innerHTML = `${scopeHtml}${kpiHtml}
    <div class="card"><div class="card-kop"><h2>Besteed t.o.v. begroot per project</h2>
      <span class="hint">gewerkte uren × tarief + overige kosten, ${TsbUI.periode ? 'cumulatief t/m ' + htmlEsc(tsbPeriodeLabel(TsbUI.periode)) : 'alle periodes'} · klik voor detail</span></div>
      ${projRijen}</div>
    <div class="grid-2">
      <div class="card"><div class="card-kop"><h2>Begroot vs. werkelijk per rol</h2></div>
        <div class="tabel-wrap"><table class="tabel"><thead><tr><th>Rol</th><th class="num">Tarief</th><th class="num">Begroot (uur)</th><th class="num">Gewerkt (uur)</th><th class="num">%</th><th class="num">Begroot (€)</th><th class="num">Besteed (€)</th></tr></thead>
        <tbody>${rolRijen || '<tr><td colspan="7" class="leeg">Geen rollen met begrote of gewerkte uren.</td></tr>'}</tbody></table></div></div>
      <div class="card"><div class="card-kop"><h2>Begroting per fase</h2><span class="hint">uren worden niet per fase geboekt</span></div>
        <div class="tabel-wrap"><table class="tabel" style="min-width:0"><thead><tr><th>Fase</th><th class="num">Begroot (uur)</th><th class="num">Begroot (€)</th></tr></thead>
        <tbody>${faseRijen || '<tr><td colspan="3" class="leeg">—</td></tr>'}</tbody></table></div>
        <div class="card-kop" style="margin:18px 0 10px"><h2>Besteding per maand</h2></div>
        <div class="minibars">${maandHtml}</div></div>
    </div>`;

  els('#tsbScope button').forEach((b) => b.addEventListener('click', () => { TsbUI.scope = b.dataset.scope; renderTsb(); }));
  el('#tsbPeriodeKiezer').addEventListener('change', (e) => { TsbUI.periode = e.target.value; renderTsb(); });
  els('.tsb-burn[data-tsb]').forEach((n) => {
    const open = () => { TsbUI.scope = n.dataset.tsb; renderTsb(); };
    n.addEventListener('click', open);
    n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

/* ============================ BEGROTINGEN =============================== */
function renderTsbBegrotingen(node) {
  const d = tsbData();
  if (TsbUI.begroting) {
    const tp = tsbProjectById(TsbUI.begroting);
    if (tp) { renderTsbEditor(node, tp); return; }
    TsbUI.begroting = null;
  }
  const knop = magTsb() ? '<button class="primair" id="tsbNieuw"><span class="ico">＋</span> Nieuwe TSB</button>' : '';
  const rows = d.projecten.slice().sort((a, b) => a.projectNaam.localeCompare(b.projectNaam)).map((tp) => {
    const c = tsbProjectCijfers(tp, null);
    return `<tr class="rij" data-tsb="${htmlEsc(tp.id)}">
      <td><strong>${htmlEsc(tp.projectNaam)}</strong><div class="sub">format: ${htmlEsc(tp.formatNaam || '—')}</div></td>
      <td class="num">${fmtUren(c.begroting.totaal.uren)}</td>
      <td class="num">${fmtGeld(c.begroting.totaal.bedrag)}</td>
      <td class="num">${fmtUren(c.werkelijk.uren, 1)}</td>
      <td class="num">${fmtGeld(c.werkelijk.kosten)}</td>
      <td class="num" style="color:${tsbBurnKleur(c.pctBedrag)};font-weight:700">${c.pctBedrag != null ? c.pctBedrag + '%' : '—'}</td>
      <td>${tp.bijgewerkt ? fmtDatum(parseDatum(tp.bijgewerkt.slice(0, 10))) : '—'}</td>
      <td class="reg-acties"><button class="mini-knop">open</button></td>
    </tr>`;
  }).join('');
  node.innerHTML = `<div class="card">
    <div class="card-kop"><h2>TSB per project<span class="tel">${d.projecten.length}</span></h2>${knop}</div>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th>Project</th><th class="num">Begroot (uur)</th><th class="num">Begroot (€)</th><th class="num">Gewerkt (uur)</th><th class="num">Besteed (€)</th><th class="num">% besteed</th><th>Bijgewerkt</th><th></th></tr></thead>
      <tbody>${rows || `<tr><td colspan="8" class="leeg">Nog geen TSB’s. ${magTsb() ? 'Klik op “Nieuwe TSB” om per project een begroting op te stellen.' : 'De ontwerpleider/manager kan per project een TSB opstellen.'}</td></tr>`}</tbody>
    </table></div></div>`;
  const nieuw = el('#tsbNieuw');
  if (nieuw) nieuw.addEventListener('click', openNieuweTsb);
  els('#tsbInhoud .rij[data-tsb]').forEach((tr) => tr.addEventListener('click', () => { TsbUI.begroting = tr.dataset.tsb; renderTsb(); }));
}

function openNieuweTsb() {
  if (!magTsb()) { toast('Alleen ontwerpleider/manager kan TSB’s opstellen', 'fout'); return; }
  const d = tsbData();
  if (!d.formats.length) {
    openModal('Nieuwe TSB', `<p>Er is nog geen format. Een TSB wordt opgesteld op basis van een format (rollen + tarieven en de structuur van fasen, groepen en regelitems).</p>
      <div class="modal-foot"><button class="ghost" id="tsbNfAnnuleer">Annuleren</button>
      <button class="primair" id="tsbNfStandaard">Standaardformat aanmaken</button></div>`);
    el('#tsbNfAnnuleer').addEventListener('click', sluitModal);
    el('#tsbNfStandaard').addEventListener('click', () => {
      d.formats.push(tsbStandaardFormat());
      State.bewaar(); sluitModal(); toast('Standaardformat aangemaakt', 'ok');
      openNieuweTsb();
    });
    return;
  }
  const bestaand = new Set(d.projecten.map((p) => p.projectNaam));
  const projecten = [...new Set(State.werkpakketten.map((w) => w.project))].sort().filter((p) => !bestaand.has(p));
  const projOpts = projecten.map((p) => `<option value="${htmlEsc(p)}">${htmlEsc(p)}</option>`).join('');
  const fmtOpts = d.formats.map((f) => `<option value="${htmlEsc(f.id)}">${htmlEsc(f.naam)}</option>`).join('');
  openModal('Nieuwe TSB', `
    <div class="modal-veld"><label>Project</label>
      <select id="tsbNpProject">${projOpts || '<option value="">— alle projecten hebben al een TSB —</option>'}</select>
      <span class="hint">Per project één TSB; de koppeling loopt via de projectnaam uit de planning.</span></div>
    <div class="modal-veld"><label>Format</label><select id="tsbNpFormat">${fmtOpts}</select></div>
    <div class="modal-foot"><button class="ghost" id="tsbNpAnnuleer">Annuleren</button>
    <button class="primair" id="tsbNpMaak">TSB aanmaken</button></div>`);
  el('#tsbNpAnnuleer').addEventListener('click', sluitModal);
  el('#tsbNpMaak').addEventListener('click', () => {
    const projectNaam = el('#tsbNpProject').value;
    const format = tsbFormatById(el('#tsbNpFormat').value);
    if (!projectNaam) { toast('Kies een project', 'fout'); return; }
    if (!format) { toast('Kies een format', 'fout'); return; }
    const kopie = JSON.parse(JSON.stringify({ rollen: format.rollen || [], fasen: format.fasen || [] }));
    kopie.fasen.forEach((f) => (f.groepen || []).forEach((g) => (g.items || []).forEach((it) => { it.hoeveelheid = 0; })));
    const nu = new Date().toISOString();
    const tp = { id: nieuwId('tsb'), projectNaam, formatId: format.id, formatNaam: format.naam, rollen: kopie.rollen, fasen: kopie.fasen, uren: [], kosten: [], aangemaakt: nu, bijgewerkt: nu };
    d.projecten.push(tp);
    State.bewaar(); sluitModal();
    TsbUI.begroting = tp.id; TsbUI.tab = 'begrotingen';
    renderTsb(); toast(`TSB aangemaakt voor ${projectNaam}`, 'ok');
  });
}

/* ------------------------- Begrotings-editor ----------------------------- */
function renderTsbEditor(node, tp) {
  const mag = magTsb();
  const rollen = tp.rollen || [];
  const ber = tsbBerekenBegroting(tp);
  // Kolommen: regelitem, eenheid, Hv, één per rol, uren, bedrag, prijs/ehd.
  const kolommen = rollen.length + 6;

  const rolKoppen = rollen.map((r) =>
    `<th class="num tsb-rolkop" title="${htmlEsc(r.naam)} · ${fmtGeld(r.tarief)}/uur">${htmlEsc(r.naam)}<span class="sub">uur/ehd</span></th>`).join('');

  let body = '';
  (tp.fasen || []).forEach((fase, fi) => {
    const ft = ber.fasen[fi];
    body += `<tr class="groep-rij tsb-fase-rij"><td colspan="${kolommen - 2}">${htmlEsc(fase.code ? fase.code + ' · ' : '')}${htmlEsc(fase.naam)}</td>
      <td class="num">${fmtUren(ft.uren)}</td><td class="num">${fmtGeld(ft.bedrag)}</td></tr>`;
    (fase.groepen || []).forEach((groep, gi) => {
      const gt = ft.groepen[gi];
      body += `<tr class="tsb-groep-rij"><td colspan="${kolommen - 2}">${htmlEsc(groep.naam)}</td>
        <td class="num">${fmtUren(gt.uren)}</td><td class="num">${fmtGeld(gt.bedrag)}</td></tr>`;
      (groep.items || []).forEach((item) => {
        const c = gt.items[item.id];
        const inzetCellen = rollen.map((r) => {
          const v = tsbGetal((item.inzet || {})[r.id]);
          return `<td class="num">${mag
            ? `<input type="number" min="0" step="any" class="tsb-inp" data-item="${htmlEsc(item.id)}" data-rol="${htmlEsc(r.id)}" value="${v || ''}" title="${htmlEsc(r.naam)}: ${fmtUren(c.duur[r.id], 1)} uur · ${fmtGeld(c.bedrag[r.id])}">`
            : `<span title="${fmtUren(c.duur[r.id], 1)} uur">${v || ''}</span>`}</td>`;
        }).join('');
        const ehdInfo = tsbEenheidInfo(item.eenheid);
        body += `<tr>
          <td class="tsb-item">${htmlEsc(item.naam)}</td>
          <td>${htmlEsc(item.eenheid || '—')}</td>
          <td class="num">${mag
            ? `<input type="number" min="0" step="any" class="tsb-inp" data-hv="${htmlEsc(item.id)}" value="${c.hoeveelheid || ''}">`
            : `${fmtUren(c.hoeveelheid, 2)}`}</td>
          ${inzetCellen}
          <td class="num">${fmtUren(c.totaalUren, 1)}</td>
          <td class="num">${fmtGeld(c.totaalBedrag)}</td>
          <td class="num">${c.prijs != null ? fmtGeld(c.prijs, 2) + '<span class="sub">' + htmlEsc(ehdInfo.prijsEenheid) + '</span>' : '—'}</td>
        </tr>`;
      });
    });
  });
  body += `<tr class="tsb-totaal-rij"><td colspan="${kolommen - 3}">EINDTOTAAL</td>
    <td class="num">${fmtUren(ber.totaal.uren)}</td><td class="num">${fmtGeld(ber.totaal.bedrag)}</td><td></td></tr>`;

  node.innerHTML = `
    <div class="niveau-rij">
      <button class="terug-knop" id="tsbTerug">← Alle TSB's</button>
      <div class="niveau-balk">TSB · ${htmlEsc(tp.projectNaam)}</div>
      <span class="hint">format: ${htmlEsc(tp.formatNaam || '—')}</span>
      <div class="knoppenrij" style="margin-left:auto">
        ${mag ? '<button class="ghost" id="tsbSync" title="Inzet en tarieven opnieuw uit het gekoppelde format overnemen (hoeveelheden blijven staan)">Format opnieuw toepassen</button>' : ''}
        <button class="ghost" id="tsbCsv">Exporteer CSV</button>
        ${mag ? '<button class="gevaar" id="tsbVerwijder">Verwijderen</button>' : ''}
      </div>
    </div>
    <div class="kpis">
      <div class="kpi kpi-paars"><div class="kpi-val">${fmtUren(ber.totaal.uren)}<small> uur</small></div><div class="kpi-label">Begrote uren</div></div>
      <div class="kpi"><div class="kpi-val">${fmtGeld(ber.totaal.bedrag)}</div><div class="kpi-label">Begroot bedrag</div></div>
      ${rollen.length ? `<div class="kpi kpi-groen"><div class="kpi-val">${rollen.length}</div><div class="kpi-label">Rollen in dit format</div></div>` : ''}
    </div>
    ${mag ? '' : '<div class="lees-alleen">Alleen-lezen — de ontwerpleider/manager kan hoeveelheden en inzet bewerken.</div>'}
    <div class="card"><div class="card-kop"><h2>Begrotingsmatrix</h2><span class="hint">Hv = hoeveelheid per regelitem · per rol de inzet in uren per eenheid</span></div>
      <div class="tabel-wrap"><table class="tabel tsb-matrix">
        <thead><tr><th>Regelitem</th><th>Ehd</th><th class="num">Hv</th>${rolKoppen}<th class="num">Uren</th><th class="num">Bedrag</th><th class="num">Prijs/ehd</th></tr></thead>
        <tbody>${body}</tbody>
      </table></div></div>`;

  el('#tsbTerug').addEventListener('click', () => { TsbUI.begroting = null; renderTsb(); });
  el('#tsbCsv').addEventListener('click', () => exporteerTsbCsv(tp));
  const sync = el('#tsbSync');
  if (sync) sync.addEventListener('click', () => {
    const format = tsbFormatById(tp.formatId);
    if (!format) { toast('Het gekoppelde format bestaat niet meer', 'fout'); return; }
    if (!confirm('Inzet en tarieven opnieuw uit het format overnemen? Afwijkende inzet in deze TSB wordt overschreven; hoeveelheden en geboekte uren blijven staan.')) return;
    pasFormatToe(tp, format);
    State.bewaar(); renderTsb(); toast('Format opnieuw toegepast', 'ok');
  });
  const verwijder = el('#tsbVerwijder');
  if (verwijder) verwijder.addEventListener('click', () => {
    if (!confirm(`De TSB van "${tp.projectNaam}" verwijderen, inclusief de geboekte uren en kosten?`)) return;
    const d = tsbData();
    d.projecten = d.projecten.filter((p) => p.id !== tp.id);
    TsbUI.begroting = null;
    State.bewaar(); renderTsb(); toast('TSB verwijderd', 'ok');
  });

  const bijwerken = () => { tp.bijgewerkt = new Date().toISOString(); State.bewaar(); renderTsb(); };
  els('#tsbInhoud input[data-hv]').forEach((inp) => inp.addEventListener('change', () => {
    const item = vindTsbItem(tp, inp.dataset.hv);
    if (item) { item.hoeveelheid = tsbGetal(inp.value); bijwerken(); }
  }));
  els('#tsbInhoud input[data-item][data-rol]').forEach((inp) => inp.addEventListener('change', () => {
    const item = vindTsbItem(tp, inp.dataset.item);
    if (item) { if (!item.inzet) item.inzet = {}; item.inzet[inp.dataset.rol] = tsbGetal(inp.value); bijwerken(); }
  }));
}

function vindTsbItem(doc, itemId) {
  for (const fase of doc.fasen || []) for (const groep of fase.groepen || []) {
    const item = (groep.items || []).find((i) => i.id === itemId);
    if (item) return item;
  }
  return null;
}

// Inzet en tarieven opnieuw uit het format overnemen (koppeling op id;
// hoeveelheden blijven staan, nieuwe rollen uit het format komen erbij).
function pasFormatToe(tp, format) {
  const fmtRollen = format.rollen || [];
  const eigen = {};
  (tp.rollen || []).forEach((r) => { eigen[r.id] = r; });
  fmtRollen.forEach((fr) => {
    if (eigen[fr.id]) Object.assign(eigen[fr.id], { code: fr.code, naam: fr.naam, tarief: fr.tarief });
    else tp.rollen.push(JSON.parse(JSON.stringify(fr)));
  });
  const fmtItems = {};
  (format.fasen || []).forEach((f) => (f.groepen || []).forEach((g) => (g.items || []).forEach((i) => { fmtItems[i.id] = i; })));
  (tp.fasen || []).forEach((f) => (f.groepen || []).forEach((g) => (g.items || []).forEach((i) => {
    const bron = fmtItems[i.id];
    if (bron) { i.inzet = JSON.parse(JSON.stringify(bron.inzet || {})); i.eenheid = bron.eenheid; if (bron.prijsFactor != null) i.prijsFactor = bron.prijsFactor; }
  })));
  tp.formatNaam = format.naam;
  tp.bijgewerkt = new Date().toISOString();
}

// CSV-export van de begroting (;-gescheiden, NL-decimalen — opent in Excel).
function exporteerTsbCsv(tp) {
  const rollen = tp.rollen || [];
  const ber = tsbBerekenBegroting(tp);
  const num = (n, dec = 2) => String(+(tsbGetal(n)).toFixed(dec)).replace('.', ',');
  const kop = ['Fase', 'Groep', 'Regelitem', 'Eenheid', 'Hoeveelheid',
    ...rollen.map((r) => `${r.naam} inzet (uur/ehd)`), ...rollen.map((r) => `${r.naam} uren`),
    'Totaal uren', 'Totaal bedrag', 'Prijs per eenheid'];
  const rijen = [kop];
  (tp.fasen || []).forEach((fase, fi) => {
    (fase.groepen || []).forEach((groep, gi) => {
      (groep.items || []).forEach((item) => {
        const c = ber.fasen[fi].groepen[gi].items[item.id];
        rijen.push([fase.naam, groep.naam, item.naam, item.eenheid || '', num(c.hoeveelheid),
          ...rollen.map((r) => num((item.inzet || {})[r.id] || 0)), ...rollen.map((r) => num(c.duur[r.id])),
          num(c.totaalUren), num(c.totaalBedrag), c.prijs != null ? num(c.prijs) : '']);
      });
    });
    const ft = ber.fasen[fi];
    rijen.push([`SUBTOTAAL ${fase.naam}`, '', '', '', '', ...rollen.map(() => ''), ...rollen.map((r) => num(ft.perRol[r.id].duur)), num(ft.uren), num(ft.bedrag), '']);
  });
  rijen.push(['EINDTOTAAL', '', '', '', '', ...rollen.map(() => ''), ...rollen.map((r) => num(ber.totaal.perRol[r.id].duur)), num(ber.totaal.uren), num(ber.totaal.bedrag), '']);
  const csv = rijen.map((r) => r.map((c) => /[;"\n]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : c).join(';')).join('\r\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `tsb-${tp.projectNaam.replace(/[^\w-]+/g, '_')}-${isoDatum(new Date())}.csv`;
  a.click();
}

/* ============================ UREN & KOSTEN ============================= */
function renderTsbUrenKosten(node) {
  const d = tsbData();
  const projecten = d.projecten.slice().sort((a, b) => a.projectNaam.localeCompare(b.projectNaam));
  if (!projecten.length) {
    node.innerHTML = tsbLeegHtml('Nog geen TSB’s — uren en kosten worden per TSB-project geboekt. Stel eerst een begroting op.', 'tsbNaarBegrotingen2', 'Naar begrotingen');
    el('#tsbNaarBegrotingen2').addEventListener('click', () => { TsbUI.tab = 'begrotingen'; renderTsb(); });
    return;
  }
  if (!TsbUI.urenProject || !projecten.some((p) => p.id === TsbUI.urenProject)) TsbUI.urenProject = projecten[0].id;
  const tp = tsbProjectById(TsbUI.urenProject);
  const mag = magTsbUren(tp.projectNaam);
  const magKosten = magTsb();
  const c = tsbProjectCijfers(tp, null);

  const projOpts = projecten.map((p) => `<option value="${htmlEsc(p.id)}"${p.id === TsbUI.urenProject ? ' selected' : ''}>${htmlEsc(p.projectNaam)}</option>`).join('');
  const rolIndex = {};
  (tp.rollen || []).forEach((r) => { rolIndex[r.id] = r; });

  const urenRijen = (tp.uren || []).slice().sort((a, b) => b.periode.localeCompare(a.periode) || (rolIndex[a.rolId]?.naam || '').localeCompare(rolIndex[b.rolId]?.naam || '')).map((u) => {
    const rol = rolIndex[u.rolId];
    const kosten = tsbGetal(u.uren) * (rol ? tsbGetal(rol.tarief) : 0);
    return `<tr class="rij" data-uur="${htmlEsc(u.id)}">
      <td>${htmlEsc(tsbPeriodeLabel(u.periode))}</td>
      <td>${rol ? htmlEsc(rol.naam) : '<em>onbekende rol</em>'}</td>
      <td class="num">${fmtUren(u.uren, 1)}</td>
      <td class="num">${fmtGeld(kosten)}</td>
      <td>${htmlEsc(u.omschrijving || '')}</td>
      <td class="reg-acties">${mag ? '<button class="mini-knop">bewerk</button>' : ''}</td>
    </tr>`;
  }).join('');

  const kostenRijen = (tp.kosten || []).slice().sort((a, b) => b.periode.localeCompare(a.periode)).map((k) => `
    <tr class="rij" data-kost="${htmlEsc(k.id)}">
      <td>${htmlEsc(tsbPeriodeLabel(k.periode))}</td>
      <td>${htmlEsc(k.omschrijving || '')}</td>
      <td class="num">${fmtGeld(k.bedrag, 2)}</td>
      <td class="reg-acties">${magKosten ? '<button class="mini-knop">bewerk</button>' : ''}</td>
    </tr>`).join('');

  node.innerHTML = `
    <div class="niveau-rij">
      <select id="tsbUrenProject" title="TSB-project">${projOpts}</select>
      <div class="knoppenrij" style="margin-left:auto">
        ${mag ? '<button class="primair" id="tsbUurBoeken"><span class="ico">＋</span> Uren boeken</button>' : ''}
        ${magKosten ? '<button class="ghost" id="tsbKostBoeken">＋ Kosten boeken</button>' : ''}
        ${mag ? '<label class="filebtn">Uren importeren (CSV)<input id="tsbUrenCsv" type="file" accept=".csv,text/csv" hidden></label>' : ''}
      </div>
    </div>
    ${mag ? '<p class="hint" style="margin:-6px 0 14px">CSV-kolommen (;-gescheiden): <code>project;periode;rol;uren;omschrijving</code> — periode als <code>jjjj-mm</code> of datum, rol op naam of code. Rijen voor andere projecten met een TSB worden ook verwerkt.</p>' : ''}
    <div class="card"><div class="taken-stats">
      <div class="tstat blauw"><b>${fmtUren(c.werkelijk.uren, 1)}</b><span>gewerkte uren (begroot ${fmtUren(c.begroting.totaal.uren)})</span></div>
      <div class="tstat"><b>${fmtGeld(c.werkelijk.urenKosten)}</b><span>kosten uit uren</span></div>
      <div class="tstat amber"><b>${fmtGeld(c.werkelijk.overigeKosten)}</b><span>overige kosten</span></div>
      <div class="tstat ${c.pctBedrag != null && c.pctBedrag > 100 ? 'rood' : 'groen'}"><b>${fmtGeld(c.werkelijk.kosten)}</b><span>totaal besteed (${c.pctBedrag != null ? c.pctBedrag + '% van' : 'begroot'} ${fmtGeld(c.begroting.totaal.bedrag)})</span></div>
    </div></div>
    <div class="grid-2">
      <div class="card"><div class="card-kop"><h2>Gewerkte uren<span class="tel">${(tp.uren || []).length}</span></h2><span class="hint">per maand en rol</span></div>
        <div class="tabel-wrap"><table class="tabel" style="min-width:0">
          <thead><tr><th>Periode</th><th>Rol</th><th class="num">Uren</th><th class="num">Kosten</th><th>Omschrijving</th><th></th></tr></thead>
          <tbody>${urenRijen || `<tr><td colspan="6" class="leeg">Nog geen uren geboekt.${mag ? ' Klik op “Uren boeken” of importeer een CSV.' : ''}</td></tr>`}</tbody>
        </table></div></div>
      <div class="card"><div class="card-kop"><h2>Overige kosten<span class="tel">${(tp.kosten || []).length}</span></h2><span class="hint">inhuur, materiaal, leges, …</span></div>
        <div class="tabel-wrap"><table class="tabel" style="min-width:0">
          <thead><tr><th>Periode</th><th>Omschrijving</th><th class="num">Bedrag</th><th></th></tr></thead>
          <tbody>${kostenRijen || '<tr><td colspan="4" class="leeg">Nog geen overige kosten geboekt.</td></tr>'}</tbody>
        </table></div></div>
    </div>`;

  el('#tsbUrenProject').addEventListener('change', (e) => { TsbUI.urenProject = e.target.value; renderTsb(); });
  const uurKnop = el('#tsbUurBoeken');
  if (uurKnop) uurKnop.addEventListener('click', () => openTsbUur(tp, null));
  const kostKnop = el('#tsbKostBoeken');
  if (kostKnop) kostKnop.addEventListener('click', () => openTsbKost(tp, null));
  const csvInput = el('#tsbUrenCsv');
  if (csvInput) csvInput.addEventListener('change', (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => importeerTsbUrenCsv(reader.result);
    reader.readAsText(file, 'utf-8'); e.target.value = '';
  });
  if (mag) els('#tsbInhoud .rij[data-uur]').forEach((tr) => tr.addEventListener('click', () =>
    openTsbUur(tp, (tp.uren || []).find((u) => u.id === tr.dataset.uur))));
  if (magKosten) els('#tsbInhoud .rij[data-kost]').forEach((tr) => tr.addEventListener('click', () =>
    openTsbKost(tp, (tp.kosten || []).find((k) => k.id === tr.dataset.kost))));
}

function openTsbUur(tp, item) {
  if (!magTsbUren(tp.projectNaam)) { toast('Je bent niet aan dit project toegewezen', 'fout'); return; }
  const rolOpts = (tp.rollen || []).map((r) =>
    `<option value="${htmlEsc(r.id)}"${item && item.rolId === r.id ? ' selected' : ''}>${htmlEsc(r.naam)} (${fmtGeld(r.tarief)}/uur)</option>`).join('');
  openModal(item ? 'Uren bewerken' : 'Uren boeken', `
    <div class="modal-rij">
      <div class="modal-veld"><label>Periode (maand)</label><input id="tsbUurPeriode" type="month" value="${htmlEsc(item ? item.periode : tsbHuidigePeriode())}"></div>
      <div class="modal-veld"><label>Rol / functie</label><select id="tsbUurRol">${rolOpts}</select></div>
    </div>
    <div class="modal-veld"><label>Aantal uren</label><input id="tsbUurUren" type="number" min="0" step="any" value="${item ? tsbGetal(item.uren) : ''}" placeholder="bijv. 32"></div>
    <div class="modal-veld"><label>Omschrijving (optioneel)</label><input id="tsbUurOmschr" value="${htmlEsc(item ? item.omschrijving || '' : '')}" placeholder="bijv. tracéontwerp DR03"></div>
    <div class="modal-foot">
      ${item ? '<button class="verwijder-knop" id="tsbUurVerwijder">Verwijderen</button>' : ''}
      <button class="ghost" id="tsbUurAnnuleer">Annuleren</button>
      <button class="primair" id="tsbUurOpslaan">Opslaan</button>
    </div>`);
  el('#tsbUurAnnuleer').addEventListener('click', sluitModal);
  el('#tsbUurOpslaan').addEventListener('click', () => {
    const periode = el('#tsbUurPeriode').value;
    const rolId = el('#tsbUurRol').value;
    const uren = tsbGetal(el('#tsbUurUren').value);
    if (!periode) { toast('Kies een periode', 'fout'); return; }
    if (!rolId) { toast('Kies een rol', 'fout'); return; }
    if (!(uren > 0)) { toast('Vul een aantal uren in', 'fout'); return; }
    const rec = { id: (item && item.id) || nieuwId('uur'), periode, rolId, uren, omschrijving: el('#tsbUurOmschr').value.trim() };
    tp.uren = (tp.uren || []).filter((u) => u.id !== rec.id);
    tp.uren.push(rec);
    tp.bijgewerkt = new Date().toISOString();
    State.bewaar(); sluitModal(); renderTsb(); toast('Uren opgeslagen', 'ok');
  });
  const vw = el('#tsbUurVerwijder');
  if (vw) vw.addEventListener('click', () => {
    if (!confirm('Deze urenboeking verwijderen?')) return;
    tp.uren = (tp.uren || []).filter((u) => u.id !== item.id);
    tp.bijgewerkt = new Date().toISOString();
    State.bewaar(); sluitModal(); renderTsb(); toast('Urenboeking verwijderd', 'ok');
  });
}

function openTsbKost(tp, item) {
  if (!magTsb()) { toast('Alleen ontwerpleider/manager kan kosten boeken', 'fout'); return; }
  openModal(item ? 'Kosten bewerken' : 'Kosten boeken', `
    <div class="modal-rij">
      <div class="modal-veld"><label>Periode (maand)</label><input id="tsbKostPeriode" type="month" value="${htmlEsc(item ? item.periode : tsbHuidigePeriode())}"></div>
      <div class="modal-veld"><label>Bedrag (€)</label><input id="tsbKostBedrag" type="number" min="0" step="any" value="${item ? tsbGetal(item.bedrag) : ''}" placeholder="bijv. 1250"></div>
    </div>
    <div class="modal-veld"><label>Omschrijving</label><input id="tsbKostOmschr" value="${htmlEsc(item ? item.omschrijving || '' : '')}" placeholder="bijv. inhuur landmeter, leges, proefsleuven"></div>
    <div class="modal-foot">
      ${item ? '<button class="verwijder-knop" id="tsbKostVerwijder">Verwijderen</button>' : ''}
      <button class="ghost" id="tsbKostAnnuleer">Annuleren</button>
      <button class="primair" id="tsbKostOpslaan">Opslaan</button>
    </div>`);
  el('#tsbKostAnnuleer').addEventListener('click', sluitModal);
  el('#tsbKostOpslaan').addEventListener('click', () => {
    const periode = el('#tsbKostPeriode').value;
    const bedrag = tsbGetal(el('#tsbKostBedrag').value);
    const omschrijving = el('#tsbKostOmschr').value.trim();
    if (!periode) { toast('Kies een periode', 'fout'); return; }
    if (!(bedrag > 0)) { toast('Vul een bedrag in', 'fout'); return; }
    if (!omschrijving) { toast('Vul een omschrijving in', 'fout'); return; }
    const rec = { id: (item && item.id) || nieuwId('kost'), periode, bedrag, omschrijving };
    tp.kosten = (tp.kosten || []).filter((k) => k.id !== rec.id);
    tp.kosten.push(rec);
    tp.bijgewerkt = new Date().toISOString();
    State.bewaar(); sluitModal(); renderTsb(); toast('Kosten opgeslagen', 'ok');
  });
  const vw = el('#tsbKostVerwijder');
  if (vw) vw.addEventListener('click', () => {
    if (!confirm('Deze kostenboeking verwijderen?')) return;
    tp.kosten = (tp.kosten || []).filter((k) => k.id !== item.id);
    tp.bijgewerkt = new Date().toISOString();
    State.bewaar(); sluitModal(); renderTsb(); toast('Kostenboeking verwijderd', 'ok');
  });
}

// CSV-import van gewerkte uren: project;periode;rol;uren(;omschrijving).
function importeerTsbUrenCsv(tekst) {
  const d = tsbData();
  try {
    const rows = parseCsv(tekst).filter((r) => r.some((c) => (c || '').trim() !== ''));
    if (!rows.length) throw new Error('Leeg bestand.');
    const n = (s) => (s || '').trim().toLowerCase();
    const kop = rows[0].map(n);
    const iProject = kop.findIndex((h) => h.startsWith('project'));
    const iPeriode = kop.findIndex((h) => h.startsWith('periode') || h.startsWith('maand') || h.startsWith('datum'));
    const iRol = kop.findIndex((h) => h.startsWith('rol') || h.startsWith('functie'));
    const iUren = kop.findIndex((h) => h.startsWith('uren') || h === 'uur');
    const iOmschr = kop.findIndex((h) => h.startsWith('omschr'));
    if (iPeriode < 0 || iRol < 0 || iUren < 0) throw new Error('Kolommen "periode", "rol" en "uren" zijn verplicht.');
    const perProjectNaam = {};
    d.projecten.forEach((p) => { perProjectNaam[n(p.projectNaam)] = p; });
    const huidig = tsbProjectById(TsbUI.urenProject);
    let ok = 0; const fouten = [];
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const tp = iProject >= 0 && n(row[iProject]) ? perProjectNaam[n(row[iProject])] : huidig;
      if (!tp) { fouten.push(`rij ${r + 1}: onbekend project "${(row[iProject] || '').trim()}"`); continue; }
      let periode = (row[iPeriode] || '').trim();
      const alsDatum = parseDatum(periode);
      if (alsDatum) periode = isoDatum(alsDatum).slice(0, 7);
      if (!/^\d{4}-\d{2}$/.test(periode)) { fouten.push(`rij ${r + 1}: periode "${(row[iPeriode] || '').trim()}" niet herkend (gebruik jjjj-mm)`); continue; }
      const rolTekst = n(row[iRol]);
      const rol = (tp.rollen || []).find((x) => n(x.naam) === rolTekst || n(x.code) === rolTekst);
      if (!rol) { fouten.push(`rij ${r + 1}: rol "${(row[iRol] || '').trim()}" niet gevonden in de TSB van ${tp.projectNaam}`); continue; }
      const uren = tsbGetal(row[iUren]);
      if (!(uren > 0)) { fouten.push(`rij ${r + 1}: geen geldig aantal uren`); continue; }
      tp.uren = tp.uren || [];
      tp.uren.push({ id: nieuwId('uur'), periode, rolId: rol.id, uren, omschrijving: iOmschr >= 0 ? (row[iOmschr] || '').trim() : '' });
      tp.bijgewerkt = new Date().toISOString();
      ok++;
    }
    if (!ok) throw new Error('Geen geldige rijen.' + (fouten.length ? ' ' + fouten[0] : ''));
    State.bewaar(); renderTsb();
    toast(`${ok} urenboeking(en) geïmporteerd${fouten.length ? ` · ${fouten.length} rij(en) overgeslagen` : ''}`, 'ok');
    if (fouten.length) console.warn('TSB-urenimport, overgeslagen rijen:\n' + fouten.join('\n'));
  } catch (e) {
    toast('Import mislukt: ' + e.message, 'fout');
  }
}

/* ================================ FORMATS =============================== */
function renderTsbFormats(node) {
  const d = tsbData();
  if (TsbUI.format) {
    const f = tsbFormatById(TsbUI.format);
    if (f) { renderTsbFormatEditor(node, f); return; }
    TsbUI.format = null;
  }
  const mag = magTsb();
  const rows = d.formats.map((f) => {
    const items = (f.fasen || []).reduce((s, fase) => s + (fase.groepen || []).reduce((t, g) => t + (g.items || []).length, 0), 0);
    const gebruikt = d.projecten.filter((p) => p.formatId === f.id).length;
    return `<tr class="rij" data-fmt="${htmlEsc(f.id)}">
      <td><strong>${htmlEsc(f.naam)}</strong></td>
      <td class="num">${(f.rollen || []).length}</td>
      <td class="num">${(f.fasen || []).length}</td>
      <td class="num">${items}</td>
      <td class="num">${gebruikt}</td>
      <td>${f.bijgewerkt ? fmtDatum(parseDatum(f.bijgewerkt.slice(0, 10))) : '—'}</td>
      <td class="reg-acties"><button class="mini-knop">open</button></td>
    </tr>`;
  }).join('');
  node.innerHTML = `<div class="card">
    <div class="card-kop"><h2>Formats<span class="tel">${d.formats.length}</span></h2>
      ${mag ? `<div class="knoppenrij"><button class="ghost" id="tsbFmtStandaard">＋ Standaardformat</button>
        <button class="primair" id="tsbFmtNieuw"><span class="ico">＋</span> Nieuw format</button></div>` : ''}</div>
    <p class="sub">Een format is de herbruikbare basis voor TSB's: rollen met uurtarieven en de structuur van fasen, groepen en regelitems met de standaard inzet per eenheid. Wijzigingen in een format werken niet automatisch door in bestaande TSB's; gebruik daar "Format opnieuw toepassen".</p>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th>Format</th><th class="num">Rollen</th><th class="num">Fasen</th><th class="num">Regelitems</th><th class="num">Gebruikt door</th><th>Bijgewerkt</th><th></th></tr></thead>
      <tbody>${rows || `<tr><td colspan="7" class="leeg">Nog geen formats.${mag ? ' Begin met het standaardformat (VO/DO/UO) en pas het aan.' : ''}</td></tr>`}</tbody>
    </table></div></div>`;
  els('#tsbInhoud .rij[data-fmt]').forEach((tr) => tr.addEventListener('click', () => { TsbUI.format = tr.dataset.fmt; renderTsb(); }));
  const std = el('#tsbFmtStandaard');
  if (std) std.addEventListener('click', () => {
    const f = tsbStandaardFormat();
    d.formats.push(f); State.bewaar();
    TsbUI.format = f.id; renderTsb(); toast('Standaardformat aangemaakt', 'ok');
  });
  const nieuw = el('#tsbFmtNieuw');
  if (nieuw) nieuw.addEventListener('click', () => {
    const nu = new Date().toISOString();
    const f = { id: nieuwId('fmt'), naam: 'Nieuw format', rollen: [], fasen: [
      { id: nieuwId('fase'), code: '402010', naam: 'VO', groepen: [] },
      { id: nieuwId('fase'), code: '402020', naam: 'DO', groepen: [] },
      { id: nieuwId('fase'), code: '402030', naam: 'UO', groepen: [] },
    ], aangemaakt: nu, bijgewerkt: nu };
    d.formats.push(f); State.bewaar();
    TsbUI.format = f.id; renderTsb();
  });
}

function renderTsbFormatEditor(node, f) {
  const d = tsbData();
  const mag = magTsb();
  const rollen = f.rollen || [];
  const gebruikt = d.projecten.filter((p) => p.formatId === f.id).length;
  const dis = mag ? '' : ' disabled';

  const rolRijen = rollen.map((r) => `<tr>
    <td><input class="tsb-inp breed" data-rolveld="code" data-rol="${htmlEsc(r.id)}" value="${htmlEsc(r.code || '')}" placeholder="code"${dis}></td>
    <td><input class="tsb-inp breed" data-rolveld="naam" data-rol="${htmlEsc(r.id)}" value="${htmlEsc(r.naam || '')}" placeholder="rol / functie"${dis}></td>
    <td class="num"><input class="tsb-inp" type="number" min="0" step="any" data-rolveld="tarief" data-rol="${htmlEsc(r.id)}" value="${tsbGetal(r.tarief) || ''}"${dis}></td>
    <td class="reg-acties">${mag ? `<button class="mini-knop" data-rolweg="${htmlEsc(r.id)}">verwijder</button>` : ''}</td>
  </tr>`).join('');

  const struktuur = (f.fasen || []).map((fase) => {
    const groepen = (fase.groepen || []).map((groep) => {
      const items = (groep.items || []).map((item) => `<tr>
        <td><input class="tsb-inp breed" data-itemveld="naam" data-item="${htmlEsc(item.id)}" value="${htmlEsc(item.naam || '')}"${dis}></td>
        <td><select class="tsb-inp" data-itemveld="eenheid" data-item="${htmlEsc(item.id)}"${dis}>${TSB_EENHEID_KEUZES.map((e) =>
          `<option value="${e}"${e === item.eenheid ? ' selected' : ''}>${e}</option>`).join('')}</select></td>
        ${rollen.map((r) => `<td class="num"><input class="tsb-inp" type="number" min="0" step="any" data-item="${htmlEsc(item.id)}" data-rol="${htmlEsc(r.id)}" value="${tsbGetal((item.inzet || {})[r.id]) || ''}"${dis}></td>`).join('')}
        <td class="reg-acties">${mag ? `<button class="mini-knop" data-itemweg="${htmlEsc(item.id)}">×</button>` : ''}</td>
      </tr>`).join('');
      return `<div class="tsb-fmt-groep">
        <div class="reg-kop"><input class="tsb-inp breed" data-groepveld="naam" data-groep="${htmlEsc(groep.id)}" value="${htmlEsc(groep.naam || '')}" placeholder="groepsnaam"${dis}>
          ${mag ? `<span class="knoppenrij"><button class="mini-knop" data-itemplus="${htmlEsc(groep.id)}">+ regelitem</button>
          <button class="mini-knop" data-groepweg="${htmlEsc(groep.id)}">verwijder groep</button></span>` : ''}</div>
        <div class="tabel-wrap"><table class="tabel tsb-matrix" style="min-width:0">
          <thead><tr><th>Regelitem</th><th>Ehd</th>${rollen.map((r) => `<th class="num tsb-rolkop" title="${htmlEsc(r.naam)}">${htmlEsc(r.naam)}<span class="sub">uur/ehd</span></th>`).join('')}<th></th></tr></thead>
          <tbody>${items || `<tr><td colspan="${rollen.length + 3}" class="leeg">Nog geen regelitems.</td></tr>`}</tbody>
        </table></div></div>`;
    }).join('');
    return `<div class="card tsb-fmt-fase">
      <div class="card-kop"><h2 style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input class="tsb-inp" style="width:90px" data-faseveld="code" data-fase="${htmlEsc(fase.id)}" value="${htmlEsc(fase.code || '')}" placeholder="code"${dis}>
        <input class="tsb-inp breed" data-faseveld="naam" data-fase="${htmlEsc(fase.id)}" value="${htmlEsc(fase.naam || '')}" placeholder="fasenaam"${dis}></h2>
        ${mag ? `<span class="knoppenrij"><button class="mini-knop" data-groepplus="${htmlEsc(fase.id)}">+ groep</button>
        <button class="mini-knop" data-faseweg="${htmlEsc(fase.id)}">verwijder fase</button></span>` : ''}</div>
      ${groepen || '<p class="hint">Nog geen groepen in deze fase.</p>'}</div>`;
  }).join('');

  node.innerHTML = `
    <div class="niveau-rij">
      <button class="terug-knop" id="tsbFmtTerug">← Alle formats</button>
      <div class="niveau-balk">Format</div>
      <input class="tsb-inp breed" id="tsbFmtNaam" value="${htmlEsc(f.naam)}" style="font-weight:650;min-width:240px"${dis}>
      <span class="hint">${gebruikt ? `gebruikt door ${gebruikt} TSB('s) — wijzigingen werken daar pas door na "Format opnieuw toepassen"` : 'nog niet gebruikt door een TSB'}</span>
      <div class="knoppenrij" style="margin-left:auto">
        ${mag ? '<button class="gevaar" id="tsbFmtVerwijder">Verwijderen</button>' : ''}
      </div>
    </div>
    ${mag ? '' : '<div class="lees-alleen">Alleen-lezen — de ontwerpleider/manager kan formats bewerken.</div>'}
    <div class="card">
      <div class="card-kop"><h2>Rollen &amp; uurtarieven</h2>${mag ? '<button class="mini-knop" id="tsbRolPlus">+ rol</button>' : ''}</div>
      <div class="tabel-wrap"><table class="tabel" style="min-width:0">
        <thead><tr><th>Code</th><th>Rol / functie</th><th class="num">Tarief (€/uur)</th><th></th></tr></thead>
        <tbody>${rolRijen || '<tr><td colspan="4" class="leeg">Nog geen rollen. Voeg eerst rollen met tarieven toe.</td></tr>'}</tbody>
      </table></div></div>
    ${struktuur}
    ${mag ? '<button class="ghost" id="tsbFasePlus">＋ Fase toevoegen</button>' : ''}`;

  el('#tsbFmtTerug').addEventListener('click', () => { TsbUI.format = null; renderTsb(); });
  if (!mag) return;

  const bewaar = () => { f.bijgewerkt = new Date().toISOString(); State.bewaar(); renderTsb(); };
  const vindGroep = (id) => { for (const fase of f.fasen || []) { const g = (fase.groepen || []).find((x) => x.id === id); if (g) return g; } return null; };
  const vindItem = (id) => vindTsbItem(f, id);

  el('#tsbFmtNaam').addEventListener('change', (e) => { f.naam = e.target.value.trim() || f.naam; bewaar(); });
  el('#tsbFmtVerwijder').addEventListener('click', () => {
    const melding = gebruikt
      ? `Dit format wordt gebruikt door ${gebruikt} TSB('s); die behouden hun eigen kopie maar kunnen het format niet meer opnieuw toepassen. Toch verwijderen?`
      : 'Dit format verwijderen?';
    if (!confirm(melding)) return;
    d.formats = d.formats.filter((x) => x.id !== f.id);
    TsbUI.format = null; State.bewaar(); renderTsb(); toast('Format verwijderd', 'ok');
  });

  el('#tsbRolPlus').addEventListener('click', () => {
    const rol = { id: nieuwId('rol'), code: '', naam: 'Nieuwe rol', tarief: 0 };
    f.rollen = f.rollen || []; f.rollen.push(rol);
    (f.fasen || []).forEach((fase) => (fase.groepen || []).forEach((g) => (g.items || []).forEach((i) => { if (!i.inzet) i.inzet = {}; i.inzet[rol.id] = 0; })));
    bewaar();
  });
  els('#tsbInhoud [data-rolweg]').forEach((b) => b.addEventListener('click', () => {
    const rol = rollen.find((r) => r.id === b.dataset.rolweg);
    if (!confirm(`Rol "${rol ? rol.naam : ''}" verwijderen? De inzet van deze rol vervalt in alle regelitems van dit format.`)) return;
    f.rollen = (f.rollen || []).filter((r) => r.id !== b.dataset.rolweg);
    (f.fasen || []).forEach((fase) => (fase.groepen || []).forEach((g) => (g.items || []).forEach((i) => { if (i.inzet) delete i.inzet[b.dataset.rolweg]; })));
    bewaar();
  }));
  els('#tsbInhoud [data-rolveld]').forEach((inp) => inp.addEventListener('change', () => {
    const rol = (f.rollen || []).find((r) => r.id === inp.dataset.rol);
    if (!rol) return;
    rol[inp.dataset.rolveld] = inp.dataset.rolveld === 'tarief' ? tsbGetal(inp.value) : inp.value.trim();
    bewaar();
  }));

  el('#tsbFasePlus').addEventListener('click', () => {
    f.fasen = f.fasen || [];
    f.fasen.push({ id: nieuwId('fase'), code: '', naam: 'Nieuwe fase', groepen: [] });
    bewaar();
  });
  els('#tsbInhoud [data-faseveld]').forEach((inp) => inp.addEventListener('change', () => {
    const fase = (f.fasen || []).find((x) => x.id === inp.dataset.fase);
    if (fase) { fase[inp.dataset.faseveld] = inp.value.trim(); bewaar(); }
  }));
  els('#tsbInhoud [data-faseweg]').forEach((b) => b.addEventListener('click', () => {
    const fase = (f.fasen || []).find((x) => x.id === b.dataset.faseweg);
    if (!confirm(`Fase "${fase ? fase.naam : ''}" met alle groepen en regelitems verwijderen?`)) return;
    f.fasen = (f.fasen || []).filter((x) => x.id !== b.dataset.faseweg);
    bewaar();
  }));
  els('#tsbInhoud [data-groepplus]').forEach((b) => b.addEventListener('click', () => {
    const fase = (f.fasen || []).find((x) => x.id === b.dataset.groepplus);
    if (!fase) return;
    fase.groepen = fase.groepen || [];
    fase.groepen.push({ id: nieuwId('grp'), naam: 'Nieuwe groep', items: [] });
    bewaar();
  }));
  els('#tsbInhoud [data-groepveld]').forEach((inp) => inp.addEventListener('change', () => {
    const g = vindGroep(inp.dataset.groep);
    if (g) { g.naam = inp.value.trim(); bewaar(); }
  }));
  els('#tsbInhoud [data-groepweg]').forEach((b) => b.addEventListener('click', () => {
    const g = vindGroep(b.dataset.groepweg);
    if (!confirm(`Groep "${g ? g.naam : ''}" met alle regelitems verwijderen?`)) return;
    (f.fasen || []).forEach((fase) => { fase.groepen = (fase.groepen || []).filter((x) => x.id !== b.dataset.groepweg); });
    bewaar();
  }));
  els('#tsbInhoud [data-itemplus]').forEach((b) => b.addEventListener('click', () => {
    const g = vindGroep(b.dataset.itemplus);
    if (!g) return;
    const inzet = {}; (f.rollen || []).forEach((r) => { inzet[r.id] = 0; });
    g.items = g.items || [];
    g.items.push({ id: nieuwId('item'), naam: 'Nieuw regelitem', eenheid: 'st', inzet });
    bewaar();
  }));
  els('#tsbInhoud [data-itemveld]').forEach((inp) => inp.addEventListener('change', () => {
    const item = vindItem(inp.dataset.item);
    if (item) { item[inp.dataset.itemveld] = inp.value.trim ? inp.value.trim() : inp.value; bewaar(); }
  }));
  els('#tsbInhoud [data-itemweg]').forEach((b) => b.addEventListener('click', () => {
    (f.fasen || []).forEach((fase) => (fase.groepen || []).forEach((g) => { g.items = (g.items || []).filter((i) => i.id !== b.dataset.itemweg); }));
    bewaar();
  }));
  els('#tsbInhoud input[data-item][data-rol]').forEach((inp) => inp.addEventListener('change', () => {
    const item = vindItem(inp.dataset.item);
    if (item) { if (!item.inzet) item.inzet = {}; item.inzet[inp.dataset.rol] = tsbGetal(inp.value); bewaar(); }
  }));
}

/* --------------- Koppeling planningsfase ↔ TSB-fase (VO/DO/UO) ----------- */
// Volgnummer van een TSB-fase: 0=VO, 1=DO, 2=UO (op naam/code, anders positie).
function tsbFaseVolgnr(fase, positie) {
  const blob = `${fase.naam || ''} ${fase.code || ''}`.toUpperCase();
  if (/\bVO\b|402010/.test(blob)) return 0;
  if (/\bDO\b|402020/.test(blob)) return 1;
  if (/\bUO\b|402030/.test(blob)) return 2;
  return Math.min(positie, 2);
}
// Volgnummer van een planningsfase (Analysefase telt bij VO, Contractfase bij UO).
function planningFaseVolgnr(fase) {
  const naam = (fase && fase.naam || '').toUpperCase();
  if (naam.includes('ANALYSE')) return 0;
  if (naam.includes('VO')) return 0;
  if (naam.includes('DO')) return 1;
  if (naam.includes('UO') || naam.includes('CONTRACT')) return 2;
  return 0;
}
// Dominante planningsfase van een project: waar de meeste werkpakketten zitten.
function tsbDominanteFase(projectNaam) {
  const wps = State.werkpakketten.filter((w) => w.project === projectNaam);
  if (!wps.length || typeof huidigeFase !== 'function') return null;
  const teller = new Map();
  let gereedTotaal = 0, pctSom = 0;
  wps.forEach((w) => {
    const hf = huidigeFase(w);
    if (hf.fase) {
      const key = hf.status === 'afgerond' ? '__afgerond' : hf.fase.id;
      teller.set(key, (teller.get(key) || 0) + 1);
    }
    if (typeof activiteitVoortgang === 'function') { pctSom += activiteitVoortgang(w).pct; gereedTotaal++; }
  });
  if (!teller.size) return null;
  const [topKey] = [...teller.entries()].sort((a, b) => b[1] - a[1])[0];
  const afgerond = topKey === '__afgerond';
  const fase = afgerond ? FASES[FASES.length - 1] : FASES.find((f) => f.id === topKey);
  return {
    fase, afgerond,
    volgnr: afgerond ? 2 : planningFaseVolgnr(fase),
    aantalWps: wps.length,
    voortgangPct: gereedTotaal ? Math.round(pctSom / gereedTotaal) : null,
  };
}

/* ------------- Dashboard: kosten per km tracé (planning ↔ TSB) ----------- */
function renderDashTsbKm(projecten) {
  const node = el('#dashTsbKm'); if (!node) return false;
  const rijen = [];
  const zonderTrace = [];
  projecten.forEach((tp) => {
    const wps = State.werkpakketten.filter((w) => w.project === tp.projectNaam);
    const meters = wps.reduce((s, w) => s + (+w.lengteNieuw || 0), 0);
    if (!meters) { zonderTrace.push(tp.projectNaam); return; }
    const c = tsbProjectCijfers(tp, null);
    const dom = tsbDominanteFase(tp.projectNaam);
    rijen.push({
      naam: tp.projectNaam, km: meters / 1000,
      begrootKm: c.begroting.totaal.bedrag / (meters / 1000),
      besteedKm: c.werkelijk.kosten / (meters / 1000),
      voortgang: dom ? dom.voortgangPct : null,
    });
  });
  if (!rijen.length) {
    node.innerHTML = `<div class="leeg">Geen TSB-projecten met tracémeters in de planning.${zonderTrace.length ? `<br><span class="hint">Zonder koppeling: ${zonderTrace.map(htmlEsc).join(', ')}</span>` : ''}</div>`;
    return true;
  }
  rijen.sort((a, b) => b.begrootKm - a.begrootKm);
  const max = Math.max(...rijen.map((r) => Math.max(r.begrootKm, r.besteedKm)), 1);
  node.innerHTML = rijen.map((r) => `
    <div class="vp-rij">
      <div class="vp-kop"><span class="vp-naam">${htmlEsc(r.naam)} <span class="hint">· ${r.km.toLocaleString('nl-NL', { maximumFractionDigits: 1 })} km</span></span>
        <span class="vp-pct">${fmtGeld(r.begrootKm)}<small style="font-weight:500;color:var(--sub)">/km begroot</small></span></div>
      <div class="statbar" style="height:10px;margin-bottom:4px" title="Begroot per km"><span class="stseg" style="width:${(r.begrootKm / max * 100).toFixed(1)}%;background:var(--accent)"></span></div>
      <div class="statbar" style="height:10px" title="Besteed per km (tot nu toe)"><span class="stseg" style="width:${(r.besteedKm / max * 100).toFixed(1)}%;background:${r.besteedKm > r.begrootKm ? 'var(--rood)' : 'var(--groen)'}"></span></div>
      <div class="vp-meta">besteed tot nu: <strong>${fmtGeld(r.besteedKm)}/km</strong>${r.voortgang != null ? ` · voortgang ${r.voortgang}% — besteed/km loopt op tot het project gereed is` : ''}</div>
    </div>`).join('')
    + `<div class="legenda" style="margin-top:10px"><span class="leg"><i style="background:var(--accent)"></i>begroot per km</span><span class="leg"><i style="background:var(--groen)"></i>besteed per km (tot nu)</span></div>`
    + (zonderTrace.length ? `<p class="hint" style="margin:8px 0 0">Zonder tracékoppeling in de planning: ${zonderTrace.map(htmlEsc).join(', ')}.</p>` : '');
  return true;
}

/* --------- Dashboard: fasebewaking budget (fase ↔ TSB-fasebudget) -------- */
function renderDashTsbFase(projecten) {
  const node = el('#dashTsbFase'); if (!node) return false;
  const rijen = [];
  const zonderKoppeling = [];
  projecten.forEach((tp) => {
    const dom = tsbDominanteFase(tp.projectNaam);
    if (!dom || !dom.fase) { zonderKoppeling.push(tp.projectNaam); return; }
    const c = tsbProjectCijfers(tp, null);
    // Budget beschikbaar t/m de fase waarin het project (dominant) zit.
    let beschikbaar = 0;
    (tp.fasen || []).forEach((f, i) => { if (tsbFaseVolgnr(f, i) <= dom.volgnr) beschikbaar += c.begroting.fasen[i].bedrag; });
    const besteed = c.werkelijk.kosten;
    const pct = beschikbaar > 0 ? Math.round((besteed / beschikbaar) * 100) : null;
    let chip, chipCls;
    if (beschikbaar <= 0) { chip = 'geen fasebudget'; chipCls = ''; }
    else if (besteed > beschikbaar) { chip = `${fmtGeld(besteed - beschikbaar)} over budget t/m fase`; chipCls = 'rood'; }
    else if (pct >= 90) { chip = `nadert fasebudget (${pct}%)`; chipCls = 'amber'; }
    else { chip = `binnen fasebudget (${pct}%)`; chipCls = 'groen'; }
    rijen.push({ tp, dom, beschikbaar, besteed, pct, chip, chipCls });
  });
  if (!rijen.length) {
    node.innerHTML = `<div class="leeg">Geen TSB-projecten met een fase uit de planning.${zonderKoppeling.length ? `<br><span class="hint">Zonder koppeling: ${zonderKoppeling.map(htmlEsc).join(', ')}</span>` : ''}</div>`;
    return true;
  }
  rijen.sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1));
  node.innerHTML = rijen.map((r) => {
    const kleur = r.dom.fase.kleur || 'var(--accent)';
    const breedte = r.pct == null ? 0 : Math.min(100, r.pct);
    return `<div class="tsb-burn" data-tsb="${htmlEsc(r.tp.id)}" tabindex="0" role="button" title="Klik voor TSB-sturing">
      <div class="vp-kop">
        <span class="vp-naam">${htmlEsc(r.tp.projectNaam)}
          <span class="fase-pill" style="--c:${kleur};margin-left:6px;font-size:10.5px;padding:2px 9px">${htmlEsc(r.dom.afgerond ? 'Afgerond' : r.dom.fase.naam)}</span></span>
        <span class="chip ${r.chipCls}">${htmlEsc(r.chip)}</span></div>
      <div class="statbar"><span class="stseg" style="width:${breedte}%;background:${r.chipCls === 'rood' ? 'var(--rood)' : r.chipCls === 'amber' ? 'var(--amber)' : 'var(--groen)'}"></span></div>
      <div class="vp-meta">${fmtGeld(r.besteed)} besteed van ${fmtGeld(r.beschikbaar)} TSB-budget t/m deze fase · totaal begroot ${fmtGeld(tsbBerekenBegroting(r.tp).totaal.bedrag)}${r.dom.voortgangPct != null ? ` · voortgang ${r.dom.voortgangPct}%` : ''}</div>
    </div>`;
  }).join('')
    + (zonderKoppeling.length ? `<p class="hint" style="margin:8px 0 0">Zonder fasekoppeling in de planning: ${zonderKoppeling.map(htmlEsc).join(', ')}.</p>` : '');
  els('#dashTsbFase .tsb-burn').forEach((n) => {
    const open = () => { TsbUI.tab = 'sturing'; TsbUI.scope = n.dataset.tsb; renderTsb(); toonTab('tsb'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    n.addEventListener('click', open);
    n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  return true;
}

/* ----------------------- Dashboard-kaart (hoofdtab) ---------------------- */
function renderDashboardTsb() {
  const kaart = el('#dashTsbKaart'); if (!kaart) return;
  const extra = el('#dashTsbExtra');
  const d = tsbData();
  const scope = State.dashScope;
  const projecten = d.projecten.filter((p) => scope === 'portfolio' || p.projectNaam === scope)
    .sort((a, b) => a.projectNaam.localeCompare(b.projectNaam));
  if (!projecten.length) { kaart.style.display = 'none'; if (extra) extra.style.display = 'none'; return; }
  kaart.style.display = '';
  if (extra) {
    extra.style.display = '';
    renderDashTsbKm(projecten);
    renderDashTsbFase(projecten);
  }
  el('#dashTsb').innerHTML = projecten.map((tp) => {
    const c = tsbProjectCijfers(tp, null);
    const pct = c.pctBedrag;
    return `<div class="tsb-burn" data-tsb="${htmlEsc(tp.id)}" tabindex="0" role="button" title="Klik voor TSB-sturing">
      <div class="vp-kop"><span class="vp-naam">${htmlEsc(tp.projectNaam)}</span>
        <span class="vp-pct" style="color:${tsbBurnKleur(pct)}">${pct != null ? pct + '%' : '—'}</span></div>
      <div class="statbar"><span class="stseg" style="width:${pct == null ? 0 : Math.min(100, pct)}%;background:${tsbBurnKleur(pct)}"></span></div>
      <div class="vp-meta">${fmtGeld(c.werkelijk.kosten)} besteed van ${fmtGeld(c.begroting.totaal.bedrag)} begroot · ${fmtUren(c.werkelijk.uren)} van ${fmtUren(c.begroting.totaal.uren)} uur</div>
    </div>`;
  }).join('');
  els('#dashTsb .tsb-burn').forEach((n) => {
    const open = () => { TsbUI.tab = 'sturing'; TsbUI.scope = n.dataset.tsb; renderTsb(); toonTab('tsb'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    n.addEventListener('click', open);
    n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

/* ------------------------- Samenvatting voor AI -------------------------- */
function tsbRapportData(scope) {
  const d = tsbData();
  const projecten = d.projecten.filter((p) => scope === 'portfolio' || p.projectNaam === scope);
  if (!projecten.length) return null;
  const rond = (n) => Math.round(tsbGetal(n));
  const perProject = projecten.map((tp) => {
    const c = tsbProjectCijfers(tp, null);
    return {
      project: tp.projectNaam,
      begrootUren: rond(c.begroting.totaal.uren), begrootBedrag: rond(c.begroting.totaal.bedrag),
      gewerkteUren: rond(c.werkelijk.uren), kostenUitUren: rond(c.werkelijk.urenKosten),
      overigeKosten: rond(c.werkelijk.overigeKosten), totaalBesteed: rond(c.werkelijk.kosten),
      restbudget: rond(c.begroting.totaal.bedrag - c.werkelijk.kosten),
      pctBesteedBedrag: c.pctBedrag, pctBesteedUren: c.pctUren,
    };
  });
  const som = (k) => perProject.reduce((s, p) => s + (p[k] || 0), 0);
  return {
    toelichting: 'TSB = kostenbegroting per project. Besteed = gewerkte uren × uurtarief + overige kosten (cumulatief).',
    totalen: {
      begrootUren: som('begrootUren'), begrootBedrag: som('begrootBedrag'),
      gewerkteUren: som('gewerkteUren'), totaalBesteed: som('totaalBesteed'),
      restbudget: som('begrootBedrag') - som('totaalBesteed'),
    },
    perProject,
  };
}

/* --------------------------------- Export -------------------------------- */
if (typeof window !== 'undefined') {
  window.renderTsb = renderTsb;
  window.renderDashboardTsb = renderDashboardTsb;
  window.tsbRapportData = tsbRapportData;
}
