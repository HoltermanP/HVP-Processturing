/* ==========================================================================
   Kritieke pad bewaking — per werkpakket wordt het resterende werk vanaf de
   peildatum doorgerekend en afgezet tegen elke komende mijlpaal. De mijlpaal
   met de mínste speling is het bindende punt: dát is het kritieke pad van het
   werkpakket.

   Rekenmodel (sluit aan op faseSchema, dat binnen een fase "parallel werk
   nodig" signaleert): binnen een fase loopt werk volgens plan deels parallel.
   Het plantempo van een fase = totaal benodigde werkdagen ÷ beschikbare
   werkdagen in het fasevenster (minimaal ×1). De resterende doorlooptijd van
   een fase = openstaand werk ÷ plantempo, maar nooit korter dan de langste
   openstaande stap (één stap is niet te parallelliseren). Fasen schakelen in
   serie en starten niet vóór hun startmijlpaal; opgelopen vertraging telt dus
   door naar alles wat volgt. Na de contractfase rekent de projectie door naar
   werkvoorbereiding, uitvoering (tempo m/week uit de planning) en de datum
   klantwens.

   Drie uitingen:
   1. renderKritiekPad()      — eigen tabblad: project ▸ APD ▸ werkpakket met
                                speling, bindend punt en de keten als tijdbalk.
   2. renderKritiekPadDash()  — dashboardkaart met de grootste knelpunten.
   3. kpMiniChip/kpApdChip/kpBandRegel — ⚡-signalen in de planning.

   Gebruikt globals uit app.js (State, FASES, MIJLPALEN, parseDatum, fmtDatum,
   werkdagenTussen, plusWerkdagen, isAfgehandeld, PROBLEEM_STATUS, VANDAAG,
   el/els, htmlEsc, gefilterdeWerkpakketten, openDetail, toonTab, …).
   Laadt vóór app.js; alle aanroepen gebeuren pas na init.
   ========================================================================== */
'use strict';

// Onder deze speling (werkdagen) geldt een pad als 'krap'.
const KP_KRAP_WD = 5;

const KP_STATUS_INFO = {
  telaat: { label: 'wordt te laat', chip: 'rood' },
  krap:   { label: 'krappe speling', chip: 'amber' },
  koers:  { label: 'op koers', chip: 'groen' },
  klaar:  { label: 'alles gereed', chip: 'groen' },
  onbekend: { label: 'geen plandata', chip: '' },
};

/* --------------------------- Berekening + cache -------------------------- */
// De doorrekening telt dag-voor-dag; binnen één render wordt elk werkpakket
// meermaals opgevraagd (tabblad, dashboard, planningchips) → cache per wp.id.
// De cache leegt bij elke render() én bij elke State.bewaar() (datamutatie),
// zodat ook deel-hertekeningen (bijv. afvinken in de planning) vers rekenen.
const KP_CACHE = new Map();
function kpReset() { KP_CACHE.clear(); }
let kpBewaarGekoppeld = false;
function kpKoppelBewaar() {
  if (kpBewaarGekoppeld || typeof State === 'undefined') return;
  const orig = State.bewaar;
  State.bewaar = function (...args) { KP_CACHE.clear(); return orig.apply(this, args); };
  kpBewaarGekoppeld = true;
}

// Speling in werkdagen tussen verwachte en geplande datum (negatief = te laat).
function kpSpeling(verwacht, gepland) {
  return verwacht <= gepland ? werkdagenTussen(verwacht, gepland) : -werkdagenTussen(gepland, verwacht);
}
function kpMpLabel(key) { const m = MIJLPALEN.find((x) => x.key === key); return m ? m.label : key; }
function kpWd(n) { return `${n > 0 ? '+' : ''}${n} wd`; }
function kpKlasse(spelingWd) { return spelingWd < 0 ? 'telaat' : spelingWd <= KP_KRAP_WD ? 'krap' : 'koers'; }
function kpTempoTxt(tempo) { return `×${tempo.toLocaleString('nl-NL', { maximumFractionDigits: 1 })}`; }

function kritiekPadVoor(wp) {
  kpKoppelBewaar();
  const hit = KP_CACHE.get(wp.id);
  if (hit) return hit;
  const uit = kpBereken(wp);
  KP_CACHE.set(wp.id, uit);
  return uit;
}

function kpBereken(wp) {
  const v = State.voortgang[wp.id] || {};
  const fasen = [];        // resterende fasen, in serie vooruit gepland
  const checks = [];       // bewaking per mijlpaal: gepland vs verwacht
  const geblokkeerd = [];  // activiteitcodes op het pad met blokkade/issue
  let cursor = new Date(VANDAAG);

  FASES.forEach((fase) => {
    const relevant = fase.activiteiten.filter((a) => ((v[a.code] && v[a.code].status) || 'open') !== 'nvt');
    const open = relevant.filter((a) => !isAfgehandeld((v[a.code] && v[a.code].status) || 'open'))
      .map((a) => {
        const st = (v[a.code] && v[a.code].status) || 'open';
        if (PROBLEEM_STATUS.includes(st)) geblokkeerd.push(a.code);
        return { activiteit: a, status: st, dt: State.getDt(a.code) };
      });
    const faseStart = parseDatum(wp.mijlpalen[fase.startMijlpaal]);
    const faseEind = parseDatum(wp.mijlpalen[fase.eindMijlpaal]);

    if (open.length) {
      // Plantempo: hoeveel werk het plan in dit fasevenster parallel wegzet.
      const benodigd = relevant.reduce((s, a) => s + State.getDt(a.code), 0);
      const beschikbaar = faseStart && faseEind ? werkdagenTussen(faseStart, faseEind) : 0;
      const tempo = beschikbaar > 0 && benodigd > 0 ? Math.max(1, benodigd / beschikbaar) : 1;
      const somWd = open.reduce((s, o) => s + o.dt, 0);
      const langsteWd = open.reduce((m, o) => Math.max(m, o.dt), 0);
      const duurWd = Math.max(Math.ceil(somWd / tempo), langsteWd);
      // Een fase begint niet vóór haar startmijlpaal (bijv. de overdracht door
      // de opdrachtgever): eerder klaar zijn levert geen extra speling op,
      // later klaar zijn schuift wél door naar alles wat volgt.
      if (faseStart && faseStart > cursor) cursor = new Date(faseStart);
      const start = new Date(cursor);
      const eind = plusWerkdagen(cursor, duurWd);
      cursor = eind;
      fasen.push({ fase, open, somWd, langsteWd, duurWd, tempo, start, eind });
    }
    // Alleen bewaken zolang er nog werk vóór deze mijlpaal ligt; is alles tot
    // hier afgehandeld, dan is de mijlpaal feitelijk behaald.
    if (faseEind && fasen.length) {
      checks.push({ key: fase.eindMijlpaal, label: kpMpLabel(fase.eindMijlpaal), fase, gepland: faseEind, verwacht: new Date(cursor), fasenTm: fasen.length });
    }
  });

  // Doorwerking voorbij de contractfase: voor werkvoorbereiding en uitvoering
  // bestaan geen processtappen; de duur komt uit de geplande vensters en het
  // uitvoeringstempo (m/week) van het werkpakket zelf.
  const contractGepland = parseDatum(wp.mijlpalen.contractGereed);
  const wvGepland = parseDatum(wp.mijlpalen.werkvoorbGereed);
  const uitvGepland = parseDatum(wp.mijlpalen.uitvoeringGereed);
  const klantwens = parseDatum(wp.mijlpalen.klantwens);
  let wvSeg = null, uitvSeg = null;
  if (fasen.length && (wvGepland || uitvGepland || klantwens)) {
    let c = new Date(cursor);
    if (contractGepland && contractGepland > c) c = new Date(contractGepland); // niet eerder starten dan gepland
    if (wvGepland && contractGepland && wvGepland > contractGepland) {
      const duurWv = werkdagenTussen(contractGepland, wvGepland);
      wvSeg = { naam: 'Werkvoorbereiding', kleur: '#94a3b8', start: new Date(c), eind: plusWerkdagen(c, duurWv) };
      c = new Date(wvSeg.eind);
      checks.push({ key: 'werkvoorbGereed', label: kpMpLabel('werkvoorbGereed'), gepland: wvGepland, verwacht: new Date(wvSeg.eind), fasenTm: fasen.length, afgeleid: true });
      if (wvGepland > c) c = new Date(wvGepland);
    }
    let duurUitv = null, uitvNaam = 'Uitvoering';
    if (+wp.mPerWeek > 0 && +wp.lengteNieuw > 0) {
      duurUitv = Math.ceil(((+wp.lengteNieuw) / (+wp.mPerWeek)) * 5);
      uitvNaam = `Uitvoering (${(+wp.lengteNieuw).toLocaleString('nl-NL')} m à ${(+wp.mPerWeek).toLocaleString('nl-NL')} m/wk)`;
    } else if (wvGepland && uitvGepland && uitvGepland > wvGepland) {
      duurUitv = werkdagenTussen(wvGepland, uitvGepland);
    }
    if (duurUitv != null && (uitvGepland || klantwens)) {
      uitvSeg = { naam: uitvNaam, kleur: '#475569', start: new Date(c), eind: plusWerkdagen(c, duurUitv) };
      if (uitvGepland) checks.push({ key: 'uitvoeringGereed', label: kpMpLabel('uitvoeringGereed'), gepland: uitvGepland, verwacht: new Date(uitvSeg.eind), fasenTm: fasen.length, afgeleid: true });
      if (klantwens) checks.push({ key: 'klantwens', label: kpMpLabel('klantwens'), gepland: klantwens, verwacht: new Date(uitvSeg.eind), fasenTm: fasen.length, afgeleid: true });
    }
  }

  checks.forEach((c) => { c.spelingWd = kpSpeling(c.verwacht, c.gepland); });
  let bindend = null;
  checks.forEach((c) => { if (!bindend || c.spelingWd < bindend.spelingWd) bindend = c; });

  let status;
  if (!fasen.length) status = 'klaar';
  else if (!bindend) status = 'onbekend';
  else status = kpKlasse(bindend.spelingWd);

  return {
    fasen, checks, bindend, geblokkeerd, wvSeg, uitvSeg, status,
    spelingWd: bindend ? bindend.spelingWd : null,
  };
}

// Doorlooptijd en werklast op het pad t/m het bindende punt.
function kpPadSom(kp) {
  const deel = kp.fasen.slice(0, kp.bindend.fasenTm);
  return {
    duurWd: deel.reduce((s, f) => s + f.duurWd, 0),
    somWd: deel.reduce((s, f) => s + f.somWd, 0),
    stappen: deel.reduce((s, f) => s + f.open.length, 0),
  };
}

// Bepalend werkpakket binnen een set: het pad met de minste speling.
function kpVoorSet(wps) {
  const rs = wps.map((w) => ({ w, kp: kritiekPadVoor(w) }));
  const met = rs.filter((r) => r.kp.bindend);
  const bepalend = met.length ? met.reduce((m, r) => (r.kp.spelingWd < m.kp.spelingWd ? r : m)) : null;
  return { rs, met, bepalend };
}

/* ----------------------- Signalen in de planning ------------------------- */
// ⚡-chip achter de werkpakketnaam (alleen bij krap of te laat).
function kpMiniChip(w) {
  const kp = kritiekPadVoor(w);
  if (!kp.bindend || (kp.status !== 'telaat' && kp.status !== 'krap')) return '';
  const titel = `Kritieke pad: ${kpWd(kp.spelingWd)} speling op ${kp.bindend.label} (gepland ${fmtDatum(kp.bindend.gepland)}, verwacht ${fmtDatum(kp.bindend.verwacht)})`;
  return `<span class="kp-chip ${kp.status}" title="${htmlEsc(titel)}">⚡${kpWd(kp.spelingWd)}</span>`;
}

// Chip op de APD-rij: welk werkpakket bepaalt het kritieke pad van de APD.
function kpApdChip(wps) {
  const { bepalend } = kpVoorSet(wps);
  if (!bepalend || (bepalend.kp.status !== 'telaat' && bepalend.kp.status !== 'krap')) return '';
  const kp = bepalend.kp;
  const tip = `Kritieke pad van deze APD loopt via ${bepalend.w.wp}: ${kpWd(kp.spelingWd)} speling op ${kp.bindend.label} (gepland ${fmtDatum(kp.bindend.gepland)}, verwacht ${fmtDatum(kp.bindend.verwacht)})`;
  return `<span class="fchip kp ${kp.status}" title="${htmlEsc(tip)}">⚡ kritieke pad via ${htmlEsc(bepalend.w.wp)} · ${kpWd(kp.spelingWd)}</span>`;
}

// Extra regel in de wp-uitklap (Overzicht & Planning): het bindende punt.
function kpBandRegel(w) {
  const kp = kritiekPadVoor(w);
  if (!kp.bindend) return '';
  const b = kp.bindend;
  const som = kpPadSom(kp);
  const blok = kp.geblokkeerd.length
    ? ` · <span class="waarsch">⛔ ${kp.geblokkeerd.length} stap${kp.geblokkeerd.length === 1 ? '' : 'pen'} op het pad geblokkeerd</span>` : '';
  return `<div class="kp-band ${kpKlasse(kp.spelingWd)}">
    <span class="kp-band-ico">⚡</span>
    <span>Kritieke pad: nog <b>${som.duurWd} wd</b> doorlooptijd (${som.somWd} wd werk, deels parallel) tot <b>${htmlEsc(b.label)}</b> —
      gepland <b>${fmtDatum(b.gepland)}</b>, verwacht <b>${fmtDatum(b.verwacht)}</b>
      · speling <b>${kpWd(kp.spelingWd)}</b>${blok}</span>
  </div>`;
}

/* ------------------------------ Tabblad ---------------------------------- */
let kpFilter = 'alle';
const kpOpen = new Set();

function kpBadge(spelingWd) {
  return `<span class="kp-badge ${kpKlasse(spelingWd)}">${kpWd(spelingWd)}</span>`;
}

// Tijdbalk van vandaag tot het bindende punt: de resterende fasen als
// gekleurde segmenten, ◆ op de geplande mijlpaal, en de speling (groen) of het
// tekort (rood) als zone tussen verwachte en geplande datum.
function kpBalkHtml(kp) {
  const b = kp.bindend;
  const van = VANDAAG;
  const span = (Math.max(+b.gepland, +b.verwacht) - van || 1) * 1.04;   // beetje lucht rechts
  const pos = (d) => Math.max(0, Math.min(100, ((d - van) / span) * 100));
  let html = '';
  // Spelings- of tekortzone eerst, zodat de segmenten eroverheen liggen.
  if (b.spelingWd >= 0) {
    html += `<span class="kp-zone over" style="left:${pos(b.verwacht)}%;width:${Math.max(pos(b.gepland) - pos(b.verwacht), 0)}%" title="Speling: ${kpWd(b.spelingWd)}"></span>`;
  } else {
    html += `<span class="kp-zone tekort" style="left:${pos(b.gepland)}%;width:${Math.max(pos(b.verwacht) - pos(b.gepland), 0)}%" title="Tekort: ${kpWd(b.spelingWd)}"></span>`;
  }
  kp.fasen.slice(0, b.fasenTm).forEach((f) => {
    const titel = `${f.fase.naam}: ${f.open.length} open stap${f.open.length === 1 ? '' : 'pen'} · ${f.somWd} wd werk → ${f.duurWd} wd doorlooptijd (plantempo ${kpTempoTxt(f.tempo)}) · ${fmtDatum(f.start)} → ${fmtDatum(f.eind)}`;
    html += `<span class="kp-seg" style="left:${pos(f.start)}%;width:${Math.max(pos(f.eind) - pos(f.start), 0.5)}%;background:${f.fase.kleur}" title="${htmlEsc(titel)}"></span>`;
  });
  if (b.afgeleid) {
    [kp.wvSeg, kp.uitvSeg].filter(Boolean).forEach((s2) => {
      html += `<span class="kp-seg afgeleid" style="left:${pos(s2.start)}%;width:${Math.max(pos(s2.eind) - pos(s2.start), 0.5)}%;background:${s2.kleur}" title="${htmlEsc(`${s2.naam} · ${fmtDatum(s2.start)} → ${fmtDatum(s2.eind)}`)}"></span>`;
    });
  }
  html += `<span class="kp-mp-marker" style="left:${pos(b.gepland)}%" title="${htmlEsc(`${b.label}: gepland ${fmtDatum(b.gepland)}`)}"></span>`;
  return `<div class="kp-balk">${html}</div>`;
}

function kpWpRij(r) {
  const { w, kp } = r;
  const b = kp.bindend;
  const open = kpOpen.has(w.id);
  const som = kpPadSom(kp);
  return `<div class="kp-rij ${kpKlasse(kp.spelingWd)}${open ? ' open' : ''}" data-kp-wp="${htmlEsc(w.id)}">
    <div class="kp-rij-kop" role="button" tabindex="0" title="Klik voor de mijlpaalbewaking en de opbouw van het pad">
      <span class="kp-chev">${open ? '▾' : '▸'}</span>
      <div class="kp-rij-naam"><b>${htmlEsc(w.wp)}</b><span class="sub">${htmlEsc(w.engineer || '—')}</span></div>
      <div class="kp-balk-wrap">${kpBalkHtml(kp)}</div>
      <div class="kp-rij-meta">
        <span class="kp-mp">◆ ${htmlEsc(b.label)}</span>
        <span class="sub">gepland ${fmtDatumKort(b.gepland)} · verwacht ${fmtDatumKort(b.verwacht)} · nog ${som.duurWd} wd</span>
      </div>
      ${kp.geblokkeerd.length ? `<span class="kp-blok-tel" title="${kp.geblokkeerd.length} stap(pen) op het pad geblokkeerd/issue — de verwachte datums gelden pas zodra die zijn opgelost">⛔ ${kp.geblokkeerd.length}</span>` : ''}
      ${kpBadge(kp.spelingWd)}
    </div>
    ${open ? kpDetailHtml(w, kp) : ''}
  </div>`;
}

function kpDetailHtml(w, kp) {
  const v = State.voortgang[w.id] || {};
  const rijen = kp.checks.map((c) => {
    const bind = kp.bindend === c;
    return `<tr class="${bind ? 'bindend' : ''}">
      <td>${bind ? '⚡ ' : ''}${htmlEsc(c.label)}${c.afgeleid ? ' <span class="hint">(afgeleid)</span>' : ''}</td>
      <td>${fmtDatum(c.gepland)}</td>
      <td>${fmtDatum(c.verwacht)}</td>
      <td>${kpBadge(c.spelingWd)}</td>
    </tr>`;
  }).join('');

  const som = kpPadSom(kp);
  const faseBlok = (f) => {
    const langste = [...f.open].sort((a, b) => b.dt - a.dt).slice(0, 3);
    const geblok = f.open.filter((o) => PROBLEEM_STATUS.includes(o.status));
    const stapRegel = (o, ico) => {
      const st = STATUSSEN[o.status] || STATUSSEN.open;
      return `<div class="kp-stap${PROBLEEM_STATUS.includes(o.status) ? ' blok' : ''}">
        <span class="kp-stap-naam">${ico}<b>${htmlEsc(o.activiteit.code)}</b> ${htmlEsc(o.activiteit.naam)}</span>
        <span class="kp-stap-tijd">${o.dt} wd</span>
        ${o.status !== 'open' ? `<span class="statuschip" style="background:${st.kleur}">${st.label}</span>` : ''}
      </div>`;
    };
    const rest = f.open.length - langste.length - geblok.filter((g) => !langste.includes(g)).length;
    return `<div class="kp-fase" style="--c:${f.fase.kleur}">
      <div class="kp-fase-kop">${htmlEsc(f.fase.naam)}
        <span class="hint">${f.open.length} open stap${f.open.length === 1 ? '' : 'pen'} · ${f.somWd} wd werk → <b>${f.duurWd} wd</b> doorlooptijd (plantempo ${kpTempoTxt(f.tempo)}) · verwacht ${fmtDatumKort(f.start)} → ${fmtDatumKort(f.eind)}</span>
      </div>
      ${langste.map((o) => stapRegel(o, '⏱ ')).join('')}
      ${geblok.filter((g) => !langste.includes(g)).map((o) => stapRegel(o, '⛔ ')).join('')}
      ${rest > 0 ? `<div class="kp-stap meer hint">… en nog ${rest} kortere stappen (zie Werklijst of het werkpakket-detail)</div>` : ''}
    </div>`;
  };
  const afgeleid = kp.bindend.afgeleid
    ? [kp.wvSeg, kp.uitvSeg].filter(Boolean).map((s2) => `<div class="kp-fase afgeleid" style="--c:${s2.kleur}">
        <div class="kp-fase-kop">${htmlEsc(s2.naam)}<span class="hint">afgeleid · verwacht ${fmtDatumKort(s2.start)} → ${fmtDatumKort(s2.eind)}</span></div>
      </div>`).join('')
    : '';
  const blokWaarsch = kp.geblokkeerd.length
    ? `<div class="kp-waarsch">⛔ ${kp.geblokkeerd.length} stap${kp.geblokkeerd.length === 1 ? '' : 'pen'} op dit pad ${kp.geblokkeerd.length === 1 ? 'is' : 'zijn'} geblokkeerd of heeft een issue — de verwachte datums gelden pas zodra dat is opgelost. Los blokkades op het kritieke pad als eerste op.</div>`
    : '';
  return `<div class="kp-detail">
    ${blokWaarsch}
    <div class="kp-detail-grid">
      <div>
        <h4>Mijlpaalbewaking</h4>
        <table class="kp-tabel">
          <thead><tr><th>Mijlpaal</th><th>Gepland</th><th>Verwacht</th><th>Speling</th></tr></thead>
          <tbody>${rijen}</tbody>
        </table>
        <div class="hint">⚡ = bindend punt (minste speling) · afgeleid = doorgerekend met de werkvoorbereidings- en uitvoeringsduur</div>
      </div>
      <div>
        <h4>Opbouw van het pad <span class="hint">${som.stappen} open stappen · ${som.somWd} wd werk → ${som.duurWd} wd doorlooptijd</span></h4>
        <div class="kp-keten">${kp.fasen.slice(0, kp.bindend.fasenTm).map(faseBlok).join('')}${afgeleid}</div>
      </div>
    </div>
    <button class="mini-knop" data-kp-detail="${htmlEsc(w.id)}">Open werkpakket-detail</button>
  </div>`;
}

function renderKritiekPad() {
  const cont = el('#kpInhoud');
  if (!cont) return;
  const wps = gefilterdeWerkpakketten();
  const rs = wps.map((w) => ({ w, kp: kritiekPadVoor(w) }));
  const per = (st) => rs.filter((r) => r.kp.status === st);
  const groepen = { telaat: per('telaat'), krap: per('krap'), koers: per('koers'), klaar: per('klaar'), onbekend: per('onbekend') };
  const met = rs.filter((r) => r.kp.bindend);
  const ergste = met.length ? Math.min(...met.map((r) => r.kp.spelingWd)) : null;

  // KPI-tegels, klikbaar als filter (zelfde patroon als het Taken-scherm).
  const tegels = [
    { f: 'alle', cls: 'blauw', val: rs.length, label: 'werkpakketten in beeld' },
    { f: 'telaat', cls: 'rood', val: groepen.telaat.length, label: 'wordt te laat zonder ingrijpen' },
    { f: 'krap', cls: 'amber', val: groepen.krap.length, label: `krappe speling (≤ ${KP_KRAP_WD} wd)` },
    { f: 'koers', cls: 'groen', val: groepen.koers.length, label: 'op koers' },
    { f: null, cls: ergste != null && ergste < 0 ? 'rood' : 'groen', val: ergste != null ? kpWd(ergste) : '—', label: 'kleinste speling in beeld' },
  ];
  el('#kpKpis').innerHTML = tegels.map((t) => {
    const klik = t.f ? ' klikbaar' : '';
    const actief = t.f && kpFilter === t.f ? ' actief' : '';
    return `<div class="tstat ${t.cls}${klik}${actief}"${t.f ? ` data-kpf="${t.f}" tabindex="0" role="button" title="Filter de lijst"` : ''}><b>${t.val}</b><span>${t.label}</span></div>`;
  }).join('');
  els('#kpKpis .tstat[data-kpf]').forEach((t) => {
    const zet = () => { kpFilter = kpFilter === t.dataset.kpf ? 'alle' : t.dataset.kpf; renderKritiekPad(); };
    t.addEventListener('click', zet);
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zet(); } });
  });

  // 'Alle' toont de bewaakbare paden (te laat → krap → op koers); gereed en
  // zonder plandata worden onderaan samengevat.
  const toon = kpFilter === 'alle'
    ? [...groepen.telaat, ...groepen.krap, ...groepen.koers]
    : (groepen[kpFilter] || []);
  toon.sort((a, b) => a.kp.spelingWd - b.kp.spelingWd || a.w.wp.localeCompare(b.w.wp));

  const projecten = [...new Set(toon.map((r) => r.w.project))].sort();
  let html = projecten.map((p) => {
    const prs = toon.filter((r) => r.w.project === p);
    const bepalend = prs[0]; // reeds gesorteerd op speling
    const info = KP_STATUS_INFO[bepalend.kp.status];
    const chip = `<span class="chip ${info.chip}">${bepalend.kp.status === 'telaat' ? `${kpWd(bepalend.kp.spelingWd)} op ${htmlEsc(bepalend.kp.bindend.label)}` : info.label}</span>`;
    const pad = `<span class="kp-pad-kruimel">kritieke pad: <b>${htmlEsc(p)}</b> ▸ APD <b>${htmlEsc(apdVan(bepalend.w))}</b> ▸ <b>${htmlEsc(bepalend.w.wp)}</b> ▸ ◆ ${htmlEsc(bepalend.kp.bindend.label)}</span>`;
    const apds = [...new Set(prs.map((r) => apdVan(r.w)))].sort();
    const apdHtml = apds.map((apd) => {
      const ars = prs.filter((r) => apdVan(r.w) === apd);
      return `<div class="kp-apd-kop">APD ${htmlEsc(apd)}<span class="hint">· ${ars.length} werkpakket${ars.length === 1 ? '' : 'ten'}</span></div>`
        + ars.map(kpWpRij).join('');
    }).join('');
    return `<div class="card kp-project">
      <div class="card-kop"><h2>${htmlEsc(p)}</h2>${chip}</div>
      ${pad}
      ${apdHtml}
    </div>`;
  }).join('');

  if (kpFilter === 'alle' && (groepen.klaar.length || groepen.onbekend.length)) {
    const delen = [];
    if (groepen.klaar.length) delen.push(`${groepen.klaar.length} werkpakket${groepen.klaar.length === 1 ? '' : 'ten'} volledig gereed 🎉`);
    if (groepen.onbekend.length) delen.push(`${groepen.onbekend.length} zonder mijlpaaldata (niet te bewaken)`);
    html += `<div class="hint" style="padding:6px 4px">${delen.join(' · ')}</div>`;
  }
  cont.innerHTML = html || '<div class="card"><div class="leeg">Geen werkpakketten in deze selectie.</div></div>';

  els('#kpInhoud .kp-rij-kop').forEach((k) => {
    const toggle = () => {
      const id = k.closest('.kp-rij').dataset.kpWp;
      kpOpen.has(id) ? kpOpen.delete(id) : kpOpen.add(id);
      renderKritiekPad();
    };
    k.addEventListener('click', (e) => { if (e.target.closest('button')) return; toggle(); });
    k.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
  els('#kpInhoud [data-kp-detail]').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation(); openDetail(b.dataset.kpDetail);
  }));
}

/* ------------------------------ Dashboard -------------------------------- */
function renderKritiekPadDash() {
  const cont = el('#dashKp');
  if (!cont) return;
  const wps = typeof dashboardWps === 'function' ? dashboardWps() : State.werkpakketten;
  const rs = wps.map((w) => ({ w, kp: kritiekPadVoor(w) }))
    .filter((r) => r.kp.bindend && (r.kp.status === 'telaat' || r.kp.status === 'krap'))
    .sort((a, b) => a.kp.spelingWd - b.kp.spelingWd);
  const titel = el('#dashKpTitel');
  if (titel) titel.innerHTML = `Kritieke pad bewaking <span class="tel">${rs.length} knelpunt${rs.length === 1 ? '' : 'en'}</span>`;
  if (!rs.length) {
    cont.innerHTML = '<div class="leeg">Alle kritieke paden hebben voldoende speling. 👍</div>';
    return;
  }
  const top = rs.slice(0, 8);
  cont.innerHTML = `<div class="kp-dash-lijst">${top.map((r) => `
    <div class="kp-dash-rij" data-wp="${htmlEsc(r.w.id)}" tabindex="0" role="button" title="Open het werkpakket">
      <span class="kp-dash-wp"><strong>${htmlEsc(r.w.project)} · ${htmlEsc(apdVan(r.w))} · ${htmlEsc(r.w.wp)}</strong></span>
      <span class="kp-dash-mp">◆ ${htmlEsc(r.kp.bindend.label)} · gepland ${fmtDatumKort(r.kp.bindend.gepland)} · verwacht ${fmtDatumKort(r.kp.bindend.verwacht)}${r.kp.geblokkeerd.length ? ' · ⛔' : ''}</span>
      ${kpBadge(r.kp.spelingWd)}
    </div>`).join('')}</div>`
    + (rs.length > top.length ? `<div class="hint" style="margin-top:6px">… en nog ${rs.length - top.length} knelpunten.</div>` : '')
    + `<button class="mini-knop" id="dashKpMeer" style="margin-top:10px">Open kritieke pad bewaking →</button>`;
  els('#dashKp .kp-dash-rij').forEach((r) => {
    const doe = () => openDetail(r.dataset.wp);
    r.addEventListener('click', doe);
    r.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doe(); } });
  });
  const meer = el('#dashKpMeer');
  if (meer) meer.addEventListener('click', () => { toonTab('kritiekpad'); window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

if (typeof window !== 'undefined') {
  window.kpReset = kpReset;
  window.kritiekPadVoor = kritiekPadVoor;
  window.kpMiniChip = kpMiniChip;
  window.kpApdChip = kpApdChip;
  window.kpBandRegel = kpBandRegel;
  window.renderKritiekPad = renderKritiekPad;
  window.renderKritiekPadDash = renderKritiekPadDash;
}
