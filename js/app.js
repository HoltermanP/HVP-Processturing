/* ==========================================================================
   HVP Procesturing — besturing van de bouwteamfase Nulelie
   ========================================================================== */

'use strict';

const STORAGE_KEY = 'hvp-processturing-v1';
const STATUSSEN = {
  open:        { label: 'Niet gestart', kleur: '#94a3b8' },
  bezig:       { label: 'Bezig',        kleur: '#0ea5e9' },
  gereed:      { label: 'Gereed',       kleur: '#10b981' },
  geblokkeerd: { label: 'Geblokkeerd',  kleur: '#ef4444' },
  nvt:         { label: 'N.v.t.',       kleur: '#cbd5e1' },
};

const VANDAAG = new Date('2026-06-19'); // huidige peildatum

/* ---------------------------- Datum-helpers ------------------------------ */
function parseDatum(s) {
  if (!s) return null;
  s = String(s).trim();
  let m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);        // dd-mm-yyyy
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);            // yyyy-mm-dd
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  return null;
}
function fmtDatum(d) {
  if (!d) return '—';
  if (typeof d === 'string') d = parseDatum(d);
  if (!d || isNaN(d)) return '—';
  return d.toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* --------------------------- Applicatiestaat ----------------------------- */
const State = {
  werkpakketten: [],   // lijst van WP-objecten
  voortgang: {},       // wpId -> { activiteitcode -> {status, notitie} }
  doorlooptijden: {},  // activiteitcode -> werkdagen (override op standaard)
  filters: { project: '', engineer: '', fase: '', zoek: '' },
  actiefWp: null,

  laad() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      this.voortgang = raw.voortgang || {};
      this.doorlooptijden = raw.doorlooptijden || {};
      this.werkpakketten = (raw.werkpakketten && raw.werkpakketten.length)
        ? raw.werkpakketten
        : (window.SEED_WERKPAKKETTEN || []);
    } catch (e) {
      this.werkpakketten = window.SEED_WERKPAKKETTEN || [];
      this.voortgang = {};
      this.doorlooptijden = {};
    }
  },
  bewaar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      werkpakketten: this.werkpakketten,
      voortgang: this.voortgang,
      doorlooptijden: this.doorlooptijden,
    }));
  },
  wpVoortgang(wpId) {
    if (!this.voortgang[wpId]) this.voortgang[wpId] = {};
    return this.voortgang[wpId];
  },
  // effectieve doorlooptijd (werkdagen): override of standaard uit het model
  getDt(code) {
    if (this.doorlooptijden[code] != null && this.doorlooptijden[code] !== '') return +this.doorlooptijden[code];
    return ACTIVITEIT_INDEX[code] ? ACTIVITEIT_INDEX[code].activiteit.dtDefault : 5;
  },
};

/* ----------------------- Afgeleide berekeningen -------------------------- */
// Bepaal de fase waarin een werkpakket zich op de peildatum bevindt o.b.v. planning.
function huidigeFase(wp) {
  const spans = FASES.map((f) => ({
    fase: f,
    start: parseDatum(wp.mijlpalen[f.startMijlpaal]),
    eind: parseDatum(wp.mijlpalen[f.eindMijlpaal]),
  })).filter((s) => s.start && s.eind);
  if (!spans.length) return { status: 'onbekend', fase: null };

  const eersteStart = spans[0].start;
  const laatsteEind = spans[spans.length - 1].eind;
  if (VANDAAG < eersteStart) return { status: 'gepland', fase: spans[0].fase };
  if (VANDAAG > laatsteEind) return { status: 'afgerond', fase: spans[spans.length - 1].fase };
  for (const s of spans) {
    if (VANDAAG >= s.start && VANDAAG <= s.eind) return { status: 'lopend', fase: s.fase };
  }
  // tussen twee spans (gat) -> pak de eerstvolgende fase
  for (const s of spans) if (VANDAAG < s.start) return { status: 'lopend', fase: s.fase };
  return { status: 'lopend', fase: spans[spans.length - 1].fase };
}

// Voortgang o.b.v. handmatig afgevinkte activiteiten (gereed/n.v.t. tellen mee).
function activiteitVoortgang(wp) {
  const v = State.voortgang[wp.id] || {};
  let totaal = 0, klaar = 0, geblokkeerd = 0;
  FASES.forEach((f) => f.activiteiten.forEach((a) => {
    const st = (v[a.code] && v[a.code].status) || 'open';
    if (st === 'nvt') return;            // telt niet mee in noemer
    totaal++;
    if (st === 'gereed') klaar++;
    if (st === 'geblokkeerd') geblokkeerd++;
  }));
  return { totaal, klaar, geblokkeerd, pct: totaal ? Math.round((klaar / totaal) * 100) : 0 };
}

function faseVoortgang(wp, fase) {
  const v = State.voortgang[wp.id] || {};
  let totaal = 0, klaar = 0;
  fase.activiteiten.forEach((a) => {
    const st = (v[a.code] && v[a.code].status) || 'open';
    if (st === 'nvt') return;
    totaal++;
    if (st === 'gereed') klaar++;
  });
  return { totaal, klaar, pct: totaal ? Math.round((klaar / totaal) * 100) : 0 };
}

/* --------------------- Doorlooptijden / werkdagen ------------------------ */
function isWerkdag(d) { const g = d.getDay(); return g !== 0 && g !== 6; }
function werkdagenTussen(a, b) {
  if (!a || !b) return 0;
  let d = new Date(a), n = 0;
  while (d < b) { if (isWerkdag(d)) n++; d.setDate(d.getDate() + 1); }
  return n;
}
function plusWerkdagen(start, dagen) {
  const d = new Date(start); let toe = 0;
  while (toe < dagen) { d.setDate(d.getDate() + 1); if (isWerkdag(d)) toe++; }
  return d;
}

// Plan de activiteiten van een fase sequentieel binnen het planningsvenster.
// Geeft inzicht of de doorlooptijden binnen de beschikbare tijd passen.
function faseSchema(wp, fase) {
  const start = parseDatum(wp.mijlpalen[fase.startMijlpaal]);
  const eind = parseDatum(wp.mijlpalen[fase.eindMijlpaal]);
  if (!start || !eind) return null;
  const beschikbaar = werkdagenTussen(start, eind);
  let benodigd = 0;
  let cursor = new Date(start);
  const items = fase.activiteiten.map((a) => {
    const dt = State.getDt(a.code);
    benodigd += dt;
    const s = new Date(cursor);
    const e = plusWerkdagen(cursor, dt);
    cursor = e;
    return { activiteit: a, dt, start: s, eind: e };
  });
  return { start, eind, beschikbaar, benodigd, items, overschrijding: benodigd > beschikbaar, eindeBerekend: cursor };
}

// Eerstvolgende mijlpaal (fase-overgang) op of na de peildatum.
function volgendeMijlpaal(wp) {
  let best = null;
  MIJLPALEN.forEach((m) => {
    const d = parseDatum(wp.mijlpalen[m.key]);
    if (d && d >= VANDAAG && (!best || d < best.datum)) best = { datum: d, mijlpaal: m };
  });
  return best;
}

// Signalen / risico's per werkpakket.
function signalen(wp) {
  const sig = [];
  const v = State.voortgang[wp.id] || {};
  const hf = huidigeFase(wp);

  // geblokkeerde activiteiten
  const geblok = Object.entries(v).filter(([, o]) => o.status === 'geblokkeerd').map(([c]) => c);
  if (geblok.length) sig.push({ type: 'geblokkeerd', ernst: 3, tekst: `${geblok.length} geblokkeerde activiteit(en)`, codes: geblok });

  // fasen die volgens planning al voorbij zijn maar niet 100% gereed
  FASES.forEach((f) => {
    const eind = parseDatum(wp.mijlpalen[f.eindMijlpaal]);
    if (!eind) return;
    const fv = faseVoortgang(wp, f);
    if (eind < VANDAAG && fv.totaal && fv.pct < 100) {
      const dagen = Math.round((VANDAAG - eind) / 864e5);
      sig.push({ type: 'achterstand', ernst: 3, tekst: `${f.naam} ${dagen}d over einddatum, ${fv.pct}% gereed` });
    }
  });

  // huidige fase met deadline binnen 21 dagen en < 80% gereed
  if (hf.fase && hf.status === 'lopend') {
    const eind = parseDatum(wp.mijlpalen[hf.fase.eindMijlpaal]);
    const fv = faseVoortgang(wp, hf.fase);
    if (eind) {
      const dagen = Math.round((eind - VANDAAG) / 864e5);
      if (dagen >= 0 && dagen <= 21 && fv.pct < 80)
        sig.push({ type: 'deadline', ernst: 2, tekst: `${hf.fase.naam} deadline over ${dagen}d, ${fv.pct}% gereed` });
    }
    // activiteiten waarvan de doorlooptijd niet meer past tot de fase-einddatum
    if (eind) {
      const rem = werkdagenTussen(VANDAAG, eind);
      const v2 = State.voortgang[wp.id] || {};
      const nietHaalbaar = hf.fase.activiteiten.filter((a) => {
        const st = (v2[a.code] && v2[a.code].status) || 'open';
        return st !== 'gereed' && st !== 'nvt' && State.getDt(a.code) > rem;
      });
      if (nietHaalbaar.length)
        sig.push({ type: 'overbelast', ernst: 2, tekst: `${nietHaalbaar.length} activiteit(en) passen qua doorlooptijd niet meer voor de einddatum (${rem} wd resterend)` });
    }
  }
  return sig;
}

function maxErnst(sigs) { return sigs.reduce((m, s) => Math.max(m, s.ernst), 0); }

/* ---------------------------- Projectniveau ------------------------------ */
function projectStats(project) {
  const wps = State.werkpakketten.filter((w) => w.project === project);
  const meters = wps.reduce((s, w) => s + (+w.lengteNieuw || 0), 0);
  let pctSom = 0, kritiek = 0;
  const faseTeller = {};
  let volgende = null;
  wps.forEach((w) => {
    pctSom += activiteitVoortgang(w).pct;
    const sigs = signalen(w);
    if (maxErnst(sigs) >= 2) kritiek++;
    const hf = huidigeFase(w);
    const key = hf.status === 'afgerond' ? 'Afgerond' : (hf.fase ? hf.fase.naam : 'Onbekend');
    faseTeller[key] = (faseTeller[key] || 0) + 1;
    const vm = volgendeMijlpaal(w);
    if (vm && (!volgende || vm.datum < volgende.datum)) volgende = vm;
  });
  return {
    project, wps, aantal: wps.length, meters,
    pct: wps.length ? Math.round(pctSom / wps.length) : 0,
    kritiek, faseTeller, volgende,
    engineers: [...new Set(wps.map((w) => w.engineer).filter(Boolean))],
  };
}

function gefilterdeWerkpakketten() {
  const f = State.filters;
  const zoek = f.zoek.toLowerCase();
  return State.werkpakketten.filter((wp) => {
    if (f.project && wp.project !== f.project) return false;
    if (f.engineer && wp.engineer !== f.engineer) return false;
    if (f.fase) {
      const hf = huidigeFase(wp).fase;
      if (!hf || hf.id !== f.fase) return false;
    }
    if (zoek) {
      const blob = `${wp.project} ${wp.wp} ${wp.engineer} ${wp.tracStart} ${wp.tracEind} ${wp.apd} ${wp.tracdeel}`.toLowerCase();
      if (!blob.includes(zoek)) return false;
    }
    return true;
  });
}

/* ------------------------------- Helpers --------------------------------- */
const el = (sel) => document.querySelector(sel);
const els = (sel) => Array.from(document.querySelectorAll(sel));
function htmlEsc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* -------------------------------- Render --------------------------------- */
function render() {
  vulFilters();
  renderProjecten();
  renderOverzicht();
  renderPlanning();
  renderRapportage();
  renderActiviteiten();
  renderDoorlooptijden();
  if (State.actiefWp) renderDetail(State.actiefWp);
}

function vulFilters() {
  const projecten = [...new Set(State.werkpakketten.map((w) => w.project))].sort();
  const engineers = [...new Set(State.werkpakketten.map((w) => w.engineer).filter(Boolean))].sort();
  const setOpts = (sel, items, huidig, leeg) => {
    const node = el(sel);
    node.innerHTML = `<option value="">${leeg}</option>` +
      items.map((i) => `<option value="${htmlEsc(i)}"${i === huidig ? ' selected' : ''}>${htmlEsc(i)}</option>`).join('');
  };
  setOpts('#filterProject', projecten, State.filters.project, 'Alle projecten');
  setOpts('#filterEngineer', engineers, State.filters.engineer, 'Alle engineers');
  setOpts('#filterFase', FASES.map((f) => f.id), State.filters.fase, 'Alle fasen');
  // labels voor fase-opties
  el('#filterFase').innerHTML = `<option value="">Alle fasen</option>` +
    FASES.map((f) => `<option value="${f.id}"${f.id === State.filters.fase ? ' selected' : ''}>${htmlEsc(f.naam)}</option>`).join('');
}

function renderOverzicht() {
  const wps = gefilterdeWerkpakketten();

  // KPI's
  const totMeters = wps.reduce((s, w) => s + (+w.lengteNieuw || 0), 0);
  const faseTeller = {};
  let gemPct = 0;
  wps.forEach((w) => {
    const hf = huidigeFase(w);
    const key = hf.status === 'afgerond' ? 'Afgerond' : (hf.fase ? hf.fase.naam : 'Onbekend');
    faseTeller[key] = (faseTeller[key] || 0) + 1;
    gemPct += activiteitVoortgang(w).pct;
  });
  gemPct = wps.length ? Math.round(gemPct / wps.length) : 0;

  el('#kpis').innerHTML = `
    <div class="kpi"><div class="kpi-val">${wps.length}</div><div class="kpi-label">Werkpakketten</div></div>
    <div class="kpi"><div class="kpi-val">${[...new Set(wps.map(w=>w.project))].length}</div><div class="kpi-label">Projecten</div></div>
    <div class="kpi"><div class="kpi-val">${(totMeters/1000).toLocaleString('nl-NL',{maximumFractionDigits:1})}</div><div class="kpi-label">km nieuw tracé</div></div>
    <div class="kpi"><div class="kpi-val">${gemPct}%</div><div class="kpi-label">Gem. activiteit-voortgang</div></div>
  `;

  // Fase-verdeling balk
  const totaal = wps.length || 1;
  const faseChips = [...FASES.map((f) => f.naam), 'Afgerond', 'Onbekend']
    .filter((n) => faseTeller[n])
    .map((n) => {
      const fase = FASES.find((f) => f.naam === n);
      const kleur = fase ? fase.kleur : (n === 'Afgerond' ? '#475569' : '#cbd5e1');
      const pct = Math.round((faseTeller[n] / totaal) * 100);
      return `<div class="seg" style="width:${pct}%;background:${kleur}" title="${htmlEsc(n)}: ${faseTeller[n]}"></div>`;
    }).join('');
  el('#faseBalk').innerHTML = faseChips;
  el('#faseLegenda').innerHTML = [...FASES, { naam: 'Afgerond', kleur: '#475569' }]
    .filter((f) => faseTeller[f.naam])
    .map((f) => `<span class="leg"><i style="background:${f.kleur}"></i>${htmlEsc(f.naam)} (${faseTeller[f.naam]})</span>`).join('');

  // Tabel
  const rows = wps.map((w) => {
    const hf = huidigeFase(w);
    const av = activiteitVoortgang(w);
    const faseNaam = hf.status === 'afgerond' ? 'Afgerond' : (hf.fase ? hf.fase.naam : '—');
    const kleur = hf.fase ? hf.fase.kleur : '#94a3b8';
    const statusBadge = hf.status === 'afgerond'
      ? '<span class="badge done">Afgerond</span>'
      : hf.status === 'gepland'
        ? '<span class="badge plan">Gepland</span>'
        : '<span class="badge live">Lopend</span>';
    return `<tr data-wp="${htmlEsc(w.id)}" class="rij">
      <td><strong>${htmlEsc(w.project)}</strong><div class="sub">${htmlEsc(w.apd||'')}${w.tracdeel?' · '+htmlEsc(w.tracdeel):''}</div></td>
      <td>${htmlEsc(w.wp)}<div class="sub">${htmlEsc(w.tracStart)} → ${htmlEsc(w.tracEind)}</div></td>
      <td>${htmlEsc(w.engineer||'—')}</td>
      <td class="num">${(+w.lengteNieuw||0).toLocaleString('nl-NL')}</td>
      <td><span class="fase-pill" style="--c:${kleur}">${htmlEsc(faseNaam)}</span> ${statusBadge}</td>
      <td>${fmtDatum(w.mijlpalen.doNaarUO)}</td>
      <td>
        <div class="bar"><span style="width:${av.pct}%"></span></div>
        <div class="sub">${av.klaar}/${av.totaal} · ${av.pct}%${av.geblokkeerd?` · <span style="color:#ef4444">${av.geblokkeerd} geblok.</span>`:''}</div>
      </td>
    </tr>`;
  }).join('');
  el('#tabelBody').innerHTML = rows || `<tr><td colspan="7" class="leeg">Geen werkpakketten gevonden.</td></tr>`;
  els('#tabelBody .rij').forEach((tr) => tr.addEventListener('click', () => openDetail(tr.dataset.wp)));
}

/* ------------------------------- Planning -------------------------------- */
function renderPlanning() {
  const wps = gefilterdeWerkpakketten();
  const container = el('#ganttBody');
  if (!wps.length) { container.innerHTML = '<div class="leeg">Geen werkpakketten.</div>'; el('#ganttAs').innerHTML=''; return; }

  // bepaal globale datumgrenzen
  let min = null, max = null;
  wps.forEach((w) => MIJLPALEN.forEach((m) => {
    const d = parseDatum(w.mijlpalen[m.key]);
    if (d) { if (!min || d < min) min = d; if (!max || d > max) max = d; }
  }));
  if (!min || !max) { container.innerHTML = '<div class="leeg">Geen plandata.</div>'; return; }
  const span = (max - min) || 1;
  const pos = (d) => ((parseDatum(d) - min) / span) * 100;

  // tijd-as (maanden)
  const asTicks = [];
  let cur = new Date(min.getFullYear(), min.getMonth(), 1);
  while (cur <= max) {
    asTicks.push({ left: ((cur - min) / span) * 100, label: cur.toLocaleDateString('nl-NL', { month: 'short', year: '2-digit' }) });
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }
  const vandaagLeft = (VANDAAG >= min && VANDAAG <= max) ? ((VANDAAG - min) / span) * 100 : null;
  el('#ganttAs').innerHTML = asTicks.map((t) => `<span class="tick" style="left:${t.left}%">${t.label}</span>`).join('') +
    (vandaagLeft != null ? `<span class="vandaag-as" style="left:${vandaagLeft}%">vandaag</span>` : '');

  container.innerHTML = wps.map((w) => {
    const segs = FASES.map((f) => {
      const s = w.mijlpalen[f.startMijlpaal], e = w.mijlpalen[f.eindMijlpaal];
      if (!parseDatum(s) || !parseDatum(e)) return '';
      const left = pos(s), width = Math.max(pos(e) - pos(s), 0.4);
      return `<div class="gseg" style="left:${left}%;width:${width}%;background:${f.kleur}"
                title="${htmlEsc(w.project)} ${htmlEsc(w.wp)} — ${htmlEsc(f.naam)}: ${fmtDatum(s)} → ${fmtDatum(e)}"></div>`;
    }).join('');
    return `<div class="grow" data-wp="${htmlEsc(w.id)}">
      <div class="glabel" title="${htmlEsc(w.project)} ${htmlEsc(w.wp)}">${htmlEsc(w.project)} · ${htmlEsc(w.wp)}</div>
      <div class="gtrack">${segs}${vandaagLeft != null ? `<div class="vandaag-lijn" style="left:${vandaagLeft}%"></div>` : ''}</div>
    </div>`;
  }).join('');
  els('#ganttBody .grow').forEach((r) => r.addEventListener('click', () => openDetail(r.dataset.wp)));

  // legenda
  el('#ganttLegenda').innerHTML = FASES.map((f) =>
    `<span class="leg"><i style="background:${f.kleur}"></i>${htmlEsc(f.naam)}</span>`).join('');
}

/* ------------------------------- Detail ---------------------------------- */
function openDetail(wpId) {
  State.actiefWp = wpId;
  el('#detailDrawer').classList.add('open');
  el('#overlay').classList.add('show');
  renderDetail(wpId);
}
function sluitDetail() {
  State.actiefWp = null;
  el('#detailDrawer').classList.remove('open');
  el('#overlay').classList.remove('show');
}
function renderDetail(wpId) {
  const w = State.werkpakketten.find((x) => x.id === wpId);
  if (!w) { sluitDetail(); return; }
  const v = State.wpVoortgang(w.id);
  const hf = huidigeFase(w);
  const av = activiteitVoortgang(w);

  el('#detailTitel').textContent = `${w.project} · ${w.wp}`;
  el('#detailSub').innerHTML = `${htmlEsc(w.engineer || '—')} · ${htmlEsc(w.tracStart)} → ${htmlEsc(w.tracEind)} · ${(+w.lengteNieuw||0).toLocaleString('nl-NL')} m`;

  // mijlpaal-tijdlijn
  const mij = MIJLPALEN.filter((m) => parseDatum(w.mijlpalen[m.key])).map((m) => {
    const d = parseDatum(w.mijlpalen[m.key]);
    const verleden = d <= VANDAAG;
    return `<li class="${verleden ? 'past' : ''}"><span class="dot"></span><span class="ml">${htmlEsc(m.label)}</span><span class="md">${fmtDatum(d)}</span></li>`;
  }).join('');
  el('#detailMijlpalen').innerHTML = mij || '<li class="leeg">Geen mijlpaaldata.</li>';

  el('#detailFaseInfo').innerHTML = hf.fase
    ? `Huidige fase volgens planning: <strong style="color:${hf.fase.kleur}">${htmlEsc(hf.fase.naam)}</strong> <span class="badge ${hf.status==='afgerond'?'done':hf.status==='gepland'?'plan':'live'}">${hf.status}</span> · activiteit-voortgang ${av.klaar}/${av.totaal} (${av.pct}%)`
    : 'Geen fase-informatie beschikbaar.';

  // activiteiten-checklist per fase
  el('#detailFasen').innerHTML = FASES.map((f) => {
    const fv = faseVoortgang(w, f);
    const open = (hf.fase && hf.fase.id === f.id) ? ' open' : '';
    const items = f.activiteiten.map((a) => {
      const cur = (v[a.code] && v[a.code].status) || 'open';
      const notitie = (v[a.code] && v[a.code].notitie) || '';
      const opts = Object.entries(STATUSSEN).map(([k, o]) =>
        `<option value="${k}"${k === cur ? ' selected' : ''}>${o.label}</option>`).join('');
      return `<div class="act ${cur}">
        <div class="act-top">
          <span class="act-code">${htmlEsc(a.code)}</span>
          <span class="act-naam">${htmlEsc(a.naam)}</span>
          <select class="act-status" data-wp="${htmlEsc(w.id)}" data-code="${htmlEsc(a.code)}" style="--c:${STATUSSEN[cur].kleur}">${opts}</select>
        </div>
        <div class="act-omschr">${htmlEsc(a.omschrijving)}</div>
        <input class="act-notitie" data-wp="${htmlEsc(w.id)}" data-code="${htmlEsc(a.code)}" placeholder="Notitie / actie…" value="${htmlEsc(notitie)}">
      </div>`;
    }).join('');
    const sch = faseSchema(w, f);
    const budget = sch
      ? `<div class="fbudget ${sch.overschrijding ? 'krap' : ''}">
           Venster ${fmtDatum(sch.start)} → ${fmtDatum(sch.eind)} ·
           <strong>${sch.beschikbaar}</strong> werkdagen beschikbaar ·
           som doorlooptijden <strong>${sch.benodigd}</strong> wd
           ${sch.overschrijding ? '<span class="waarsch">parallel werk nodig</span>' : '<span class="ok">ruim</span>'}
         </div>`
      : '';
    return `<details class="fblock"${open}>
      <summary style="--c:${f.kleur}">
        <span class="fnaam">${htmlEsc(f.code)} ${htmlEsc(f.naam)}</span>
        <span class="fbar"><span style="width:${fv.pct}%;background:${f.kleur}"></span></span>
        <span class="fpct">${fv.klaar}/${fv.totaal}</span>
      </summary>
      <div class="fomschr">${htmlEsc(f.omschrijving)}</div>
      ${budget}
      ${items}
    </details>`;
  }).join('');

  els('#detailFasen .act-status').forEach((s) => s.addEventListener('change', (e) => {
    const { wp, code } = e.target.dataset;
    State.wpVoortgang(wp)[code] = Object.assign(State.wpVoortgang(wp)[code] || {}, { status: e.target.value });
    State.bewaar();
    renderDetail(wp); renderOverzicht();
  }));
  els('#detailFasen .act-notitie').forEach((inp) => inp.addEventListener('change', (e) => {
    const { wp, code } = e.target.dataset;
    State.wpVoortgang(wp)[code] = Object.assign(State.wpVoortgang(wp)[code] || {}, { notitie: e.target.value });
    State.bewaar();
  }));
}

/* --------------------------- Activiteiten-ref ---------------------------- */
function renderActiviteiten() {
  el('#refBody').innerHTML = FASES.map((f) => `
    <section class="ref-fase">
      <h3 style="--c:${f.kleur}">${htmlEsc(f.code)} ${htmlEsc(f.naam)}</h3>
      <p class="ref-omschr">${htmlEsc(f.omschrijving)}</p>
      <table class="ref-tabel"><tbody>
        ${f.activiteiten.map((a) => `<tr><td class="rc">${htmlEsc(a.code)}</td><td><strong>${htmlEsc(a.naam)}</strong><div class="sub">${htmlEsc(a.omschrijving)}</div></td></tr>`).join('')}
      </tbody></table>
    </section>`).join('');
}

/* ----------------------------- Projecten --------------------------------- */
function renderProjecten() {
  const projecten = [...new Set(State.werkpakketten.map((w) => w.project))].sort();
  el('#projectenBody').innerHTML = projecten.map((p) => {
    const s = projectStats(p);
    const totaal = s.aantal || 1;
    const segs = [...FASES, { naam: 'Afgerond', kleur: '#475569' }, { naam: 'Onbekend', kleur: '#cbd5e1' }]
      .filter((f) => s.faseTeller[f.naam])
      .map((f) => `<div class="seg" style="width:${(s.faseTeller[f.naam] / totaal) * 100}%;background:${f.kleur}" title="${htmlEsc(f.naam)}: ${s.faseTeller[f.naam]}"></div>`).join('');
    return `<div class="pcard" data-project="${htmlEsc(p)}">
      <div class="pcard-kop">
        <h3>${htmlEsc(p)}</h3>
        ${s.kritiek ? `<span class="chip rood">${s.kritiek} kritiek</span>` : `<span class="chip groen">op koers</span>`}
      </div>
      <div class="pcard-stats">
        <div><strong>${s.aantal}</strong><span>werkpakketten</span></div>
        <div><strong>${(s.meters/1000).toLocaleString('nl-NL',{maximumFractionDigits:1})}</strong><span>km tracé</span></div>
        <div><strong>${s.pct}%</strong><span>voortgang</span></div>
      </div>
      <div class="fasebalk mini">${segs}</div>
      <div class="pcard-foot">
        <span>${s.engineers.length ? htmlEsc(s.engineers.join(', ')) : '—'}</span>
        <span>${s.volgende ? `eerstvolgend: ${htmlEsc(s.volgende.mijlpaal.label)} · ${fmtDatum(s.volgende.datum)}` : ''}</span>
      </div>
      <button class="pcard-open">Open werkpakketten →</button>
    </div>`;
  }).join('') || '<div class="leeg">Nog geen projecten. Importeer een planning of laad voorbeelddata.</div>';

  els('#projectenBody .pcard').forEach((c) => c.addEventListener('click', () => {
    State.filters = { project: c.dataset.project, engineer: '', fase: '', zoek: '' };
    el('#filterZoek').value = '';
    render();
    toonTab('werkpakketten');
  }));
}

/* ----------------------------- Rapportage -------------------------------- */
function renderRapportage() {
  const wps = gefilterdeWerkpakketten();

  // 1) statusverdeling over alle activiteiten
  const telling = { open: 0, bezig: 0, gereed: 0, geblokkeerd: 0, nvt: 0 };
  wps.forEach((w) => {
    const v = State.voortgang[w.id] || {};
    FASES.forEach((f) => f.activiteiten.forEach((a) => {
      const st = (v[a.code] && v[a.code].status) || 'open';
      telling[st]++;
    }));
  });
  const totAct = Object.values(telling).reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  const stops = Object.entries(telling).filter(([, n]) => n > 0).map(([k, n]) => {
    const van = (acc / totAct) * 100; acc += n; const tot = (acc / totAct) * 100;
    return `${STATUSSEN[k].kleur} ${van}% ${tot}%`;
  }).join(', ');
  el('#rapStatusDonut').style.background = `conic-gradient(${stops || '#e2e8f0 0 100%'})`;
  el('#rapStatusLegenda').innerHTML = Object.entries(telling).map(([k, n]) =>
    `<span class="leg"><i style="background:${STATUSSEN[k].kleur}"></i>${STATUSSEN[k].label}: <strong>${n}</strong></span>`).join('');
  el('#rapStatusKern').innerHTML = `<strong>${Math.round((telling.gereed / totAct) * 100)}%</strong><span>gereed</span>`;

  // 2) komende 30 dagen: mijlpalen (fase-overgangen) als deadlines
  const grens = new Date(VANDAAG); grens.setDate(grens.getDate() + 30);
  const komend = [];
  wps.forEach((w) => MIJLPALEN.forEach((m) => {
    const d = parseDatum(w.mijlpalen[m.key]);
    if (d && d >= VANDAAG && d <= grens) komend.push({ wp: w, mijlpaal: m, datum: d });
  }));
  komend.sort((a, b) => a.datum - b.datum);
  el('#rapKomendTitel').textContent = `Komende 30 dagen — ${komend.length} mijlpaal-deadlines`;
  el('#rapKomend').innerHTML = komend.length ? komend.map((k) => {
    const dagen = Math.round((k.datum - VANDAAG) / 864e5);
    return `<li data-wp="${htmlEsc(k.wp.id)}">
      <span class="dl-datum">${fmtDatum(k.datum)} <em>(${dagen}d)</em></span>
      <span class="dl-tekst"><strong>${htmlEsc(k.wp.project)} · ${htmlEsc(k.wp.wp)}</strong> — ${htmlEsc(k.mijlpaal.label)}</span>
    </li>`;
  }).join('') : '<li class="leeg">Geen mijlpalen in de komende 30 dagen.</li>';
  els('#rapKomend li[data-wp]').forEach((li) => li.addEventListener('click', () => openDetail(li.dataset.wp)));

  // 3) kritieke punten / aandacht
  const kritiek = [];
  wps.forEach((w) => { const sg = signalen(w); if (sg.length) kritiek.push({ wp: w, sigs: sg, ernst: maxErnst(sg) }); });
  kritiek.sort((a, b) => b.ernst - a.ernst);
  el('#rapKritiekTitel').textContent = `Kritiek & aandacht — ${kritiek.length} werkpakketten`;
  el('#rapKritiek').innerHTML = kritiek.length ? kritiek.map((k) =>
    `<li data-wp="${htmlEsc(k.wp.id)}" class="ernst-${k.ernst}">
      <span class="kr-wp"><strong>${htmlEsc(k.wp.project)} · ${htmlEsc(k.wp.wp)}</strong></span>
      <span class="kr-sigs">${k.sigs.map((s) => `<span class="sig sig-${s.type}">${htmlEsc(s.tekst)}</span>`).join('')}</span>
    </li>`).join('') : '<li class="leeg">Geen kritieke punten. 👍</li>';
  els('#rapKritiek li[data-wp]').forEach((li) => li.addEventListener('click', () => openDetail(li.dataset.wp)));

  // 4) voortgang per project (alleen projecten in selectie)
  const projecten = [...new Set(wps.map((w) => w.project))].sort();
  el('#rapProjecten').innerHTML = projecten.map((p) => {
    const pw = wps.filter((w) => w.project === p);
    const pct = Math.round(pw.reduce((s, w) => s + activiteitVoortgang(w).pct, 0) / pw.length);
    return `<div class="rp-rij"><span class="rp-naam">${htmlEsc(p)}</span>
      <span class="bar wide"><span style="width:${pct}%"></span></span><span class="rp-pct">${pct}%</span></div>`;
  }).join('') || '<div class="leeg">—</div>';
}

/* --------------------------- Doorlooptijden ------------------------------ */
function renderDoorlooptijden() {
  el('#dtBody').innerHTML = FASES.map((f) => {
    const rows = f.activiteiten.map((a) => {
      const eff = State.getDt(a.code);
      const aangepast = State.doorlooptijden[a.code] != null && State.doorlooptijden[a.code] !== '';
      return `<tr>
        <td class="rc">${htmlEsc(a.code)}</td>
        <td>${htmlEsc(a.naam)}</td>
        <td class="num"><input type="number" min="0" class="dt-inp" data-code="${htmlEsc(a.code)}" value="${eff}"></td>
        <td class="num sub">${a.dtDefault}${aangepast ? ' <span class="aangepast">aangepast</span>' : ''}</td>
      </tr>`;
    }).join('');
    const somDef = f.activiteiten.reduce((s, a) => s + a.dtDefault, 0);
    const somEff = f.activiteiten.reduce((s, a) => s + State.getDt(a.code), 0);
    return `<section class="dt-fase">
      <h3 style="--c:${f.kleur}">${htmlEsc(f.code)} ${htmlEsc(f.naam)} <span class="dt-som">totaal ${somEff} werkdagen${somEff!==somDef?` (standaard ${somDef})`:''}</span></h3>
      <table class="ref-tabel dt-tabel"><thead><tr><th>Code</th><th>Activiteit</th><th class="num">Doorlooptijd (wd)</th><th class="num">Standaard</th></tr></thead>
      <tbody>${rows}</tbody></table>
    </section>`;
  }).join('');

  els('#dtBody .dt-inp').forEach((inp) => inp.addEventListener('change', (e) => {
    const code = e.target.dataset.code;
    const val = e.target.value.trim();
    if (val === '' || +val === ACTIVITEIT_INDEX[code].activiteit.dtDefault) delete State.doorlooptijden[code];
    else State.doorlooptijden[code] = +val;
    State.bewaar();
    renderDoorlooptijden();
    if (State.actiefWp) renderDetail(State.actiefWp);
    renderRapportage();
  }));
}

/* ------------------------------ CSV-import ------------------------------- */
// Parser voor het ;-gescheiden HVP-dashboard met meervoudige header-rijen.
function parseCsv(tekst) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < tekst.length; i++) {
    const c = tekst[i];
    if (inQuotes) {
      if (c === '"') { if (tekst[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ';') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function importeerCsv(tekst) {
  const rows = parseCsv(tekst);
  // vind de header-rij (begint met "Projectnaam")
  const headerIdx = rows.findIndex((r) => (r[0] || '').trim().toLowerCase() === 'projectnaam');
  if (headerIdx < 0) throw new Error('Kon de kolomkoppen (rij met "Projectnaam") niet vinden.');
  const header = rows[headerIdx].map((h) => h.replace(/\s+/g, ' ').trim());

  const colIdx = (naam) => header.findIndex((h) => h.toLowerCase() === naam.toLowerCase());
  const find = (naam) => { const i = colIdx(naam); return i; };

  const cProject = find('Projectnaam');
  const cApd = find('APD Bouwdeel');
  const cTrac = find('Liander Tracdeel');
  const cWp = header.findIndex((h) => h.toLowerCase().startsWith('werkpakket'));
  const cStart = find('Trac start');
  const cEind = find('Trac eind');
  const cEng = find('Engineer');
  const cLen = header.findIndex((h) => h.toLowerCase().startsWith('lengte nieuw'));
  const cMpw = header.findIndex((h) => h.toLowerCase().startsWith('uitvoering meters'));

  const mCols = {};
  MIJLPALEN.forEach((m) => { mCols[m.key] = colIdx(m.csv); });

  const nieuwe = [];
  const gezien = new Set();
  for (let r = headerIdx + 1; r < rows.length; r++) {
    const row = rows[r];
    const project = (row[cProject] || '').trim();
    const wp = (cWp >= 0 ? row[cWp] : '').trim();
    if (!project || !wp) continue;
    // sla lege/template-rijen (1900/1901-datums) over
    const overdracht = cStart >= 0 ? (row[mCols.overdrachtVO] || '') : '';
    const engineer = (cEng >= 0 ? row[cEng] : '').trim();
    const heeftEchteDatum = MIJLPALEN.some((m) => {
      const d = parseDatum(row[mCols[m.key]]);
      return d && d.getFullYear() > 1901;
    });
    if (!heeftEchteDatum && !engineer) continue;

    const mij = {};
    MIJLPALEN.forEach((m) => {
      const raw = (row[mCols[m.key]] || '').trim();
      const d = parseDatum(raw);
      mij[m.key] = (d && d.getFullYear() > 1901) ? raw : '';
    });

    const tracStart = (cStart >= 0 ? row[cStart] : '').trim();
    const tracEind = (cEind >= 0 ? row[cEind] : '').trim();
    let id = `${project}|${wp}|${tracStart}|${tracEind}`;
    let n = 2; while (gezien.has(id)) { id = `${project}|${wp}|${tracStart}|${tracEind}#${n++}`; }
    gezien.add(id);

    nieuwe.push({
      id, project,
      apd: (cApd >= 0 ? row[cApd] : '').trim(),
      tracdeel: (cTrac >= 0 ? row[cTrac] : '').trim(),
      wp, tracStart, tracEind,
      engineer,
      lengteNieuw: parseInt((cLen >= 0 ? row[cLen] : '').replace(/\D/g, '')) || 0,
      mPerWeek: parseInt((cMpw >= 0 ? row[cMpw] : '').replace(/\D/g, '')) || 0,
      mijlpalen: mij,
    });
  }
  if (!nieuwe.length) throw new Error('Geen geldige werkpakket-rijen gevonden.');
  return nieuwe;
}

/* ------------------------------ Tabs / UI -------------------------------- */
function toonTab(naam) {
  els('.tab').forEach((t) => t.classList.toggle('actief', t.dataset.tab === naam));
  els('.view').forEach((v) => v.classList.toggle('actief', v.id === 'view-' + naam));
}

/* ------------------------------- Init ------------------------------------ */
function init() {
  State.laad();

  // navigatie
  els('.tab').forEach((t) => t.addEventListener('click', () => toonTab(t.dataset.tab)));
  el('#detailClose').addEventListener('click', sluitDetail);
  el('#overlay').addEventListener('click', sluitDetail);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') sluitDetail(); });

  // filters
  el('#filterProject').addEventListener('change', (e) => { State.filters.project = e.target.value; render(); });
  el('#filterEngineer').addEventListener('change', (e) => { State.filters.engineer = e.target.value; render(); });
  el('#filterFase').addEventListener('change', (e) => { State.filters.fase = e.target.value; render(); });
  el('#filterZoek').addEventListener('input', (e) => { State.filters.zoek = e.target.value; renderOverzicht(); renderPlanning(); });
  el('#filterReset').addEventListener('click', () => {
    State.filters = { project: '', engineer: '', fase: '', zoek: '' };
    el('#filterZoek').value = ''; render();
  });

  // import / export
  el('#csvFile').addEventListener('change', (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const wps = importeerCsv(reader.result);
        State.werkpakketten = wps; State.bewaar(); render();
        el('#importMelding').innerHTML = `<span class="ok">${wps.length} werkpakketten geïmporteerd uit "${htmlEsc(file.name)}".</span>`;
        toonTab('projecten');
      } catch (err) {
        el('#importMelding').innerHTML = `<span class="fout">Import mislukt: ${htmlEsc(err.message)}</span>`;
      }
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  });
  el('#btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ werkpakketten: State.werkpakketten, voortgang: State.voortgang }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `hvp-processturing-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  });
  el('#jsonFile').addEventListener('change', (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.werkpakketten) State.werkpakketten = data.werkpakketten;
        if (data.voortgang) State.voortgang = data.voortgang;
        State.bewaar(); render();
        el('#importMelding').innerHTML = `<span class="ok">Werkbestand hersteld.</span>`;
        toonTab('projecten');
      } catch (err) {
        el('#importMelding').innerHTML = `<span class="fout">Kon JSON niet lezen: ${htmlEsc(err.message)}</span>`;
      }
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  });
  el('#btnSeed').addEventListener('click', () => {
    if (!confirm('Voorbeelddata (Spannenburg + Joure) laden? Huidige werkpakketten worden vervangen. Voortgang blijft bewaard.')) return;
    State.werkpakketten = (window.SEED_WERKPAKKETTEN || []).map((w) => ({ ...w }));
    State.bewaar(); render(); toonTab('projecten');
  });
  el('#btnWis').addEventListener('click', () => {
    if (!confirm('ALLE data en voortgang wissen en opnieuw beginnen met voorbeelddata?')) return;
    localStorage.removeItem(STORAGE_KEY);
    State.werkpakketten = (window.SEED_WERKPAKKETTEN || []).map((w) => ({ ...w }));
    State.voortgang = {}; render(); toonTab('projecten');
  });

  el('#peildatum').textContent = fmtDatum(VANDAAG);
  render();
  toonTab('projecten');
}

document.addEventListener('DOMContentLoaded', init);
