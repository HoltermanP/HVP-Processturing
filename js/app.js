/* ==========================================================================
   HVP Procesturing — besturing van de bouwteamfase Nulelie
   Hiërarchie: Project ▸ APD ▸ Werkpakket. Data via Neon (db.js) met
   localStorage-cache. AI-rapportages via ai.js.
   ========================================================================== */

'use strict';

const STATUSSEN = {
  open:        { label: 'Niet gestart', kleur: '#94a3b8' },
  bezig:       { label: 'Bezig',        kleur: '#0ea5e9' },
  gereed:      { label: 'Gereed',       kleur: '#10b981' },
  geblokkeerd: { label: 'Geblokkeerd',  kleur: '#ef4444' },
  nvt:         { label: 'N.v.t.',       kleur: '#cbd5e1' },
};

const STANDAARD_PEILDATUM = '2026-06-19';
let VANDAAG = new Date(STANDAARD_PEILDATUM);

const HORIZONS = [
  { id: '14',       label: '2 weken',     dagen: 14 },
  { id: '30',       label: '30 dagen',    dagen: 30 },
  { id: '60',       label: '60 dagen',    dagen: 60 },
  { id: '90',       label: '90 dagen',    dagen: 90 },
  { id: 'maand',    label: 'Deze maand' },
  { id: 'kwartaal', label: 'Dit kwartaal' },
];

/* ---------------------------- Datum-helpers ------------------------------ */
function parseDatum(s) {
  if (!s) return null;
  s = String(s).trim();
  let m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  return null;
}
function fmtDatum(d) {
  if (!d) return '—';
  if (typeof d === 'string') d = parseDatum(d);
  if (!d || isNaN(d)) return '—';
  return d.toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' });
}
function isoDatum(d) { return d.toISOString().slice(0, 10); }
function dagenVerschil(a, b) { return Math.round((b - a) / 864e5); }

/* --------------------------- Applicatiestaat ----------------------------- */
const State = {
  werkpakketten: [],
  voortgang: {},
  doorlooptijden: {},
  snapshots: [],
  instellingen: {},
  vergunningen: [],
  risicos: [],
  filters: { project: '', apd: '', engineer: '', fase: '', risico: '', zoek: '' },
  actiefWp: null,
  horizon: '30',
  takenFilter: 'alle',
  vgFilter: 'alle',
  riskCel: null,
  dashScope: 'portfolio',

  async laad() {
    const staat = await DB.laad();
    this.voortgang = staat.voortgang || {};
    this.doorlooptijden = staat.doorlooptijden || {};
    this.snapshots = staat.snapshots || [];
    this.instellingen = staat.instellingen || {};
    this.vergunningen = staat.vergunningen || [];
    this.risicos = staat.risicos || [];
    const verseSeed = !(staat.werkpakketten && staat.werkpakketten.length);
    this.werkpakketten = verseSeed ? (window.SEED_WERKPAKKETTEN || []) : staat.werkpakketten;
    if (this.instellingen.peildatum) {
      const d = parseDatum(this.instellingen.peildatum);
      if (d) VANDAAG = d;
    }
    // Eerste start met voorbeelddata zonder voortgang → realistische voortgang opwekken.
    if (verseSeed && Object.keys(this.voortgang).length === 0 && this.werkpakketten.length) {
      this.voortgang = genereerDemoVoortgang(this.werkpakketten);
      this._moetBewaren = true;
    }
  },
  bewaar() {
    DB.bewaar({
      werkpakketten: this.werkpakketten,
      voortgang: this.voortgang,
      doorlooptijden: this.doorlooptijden,
      snapshots: this.snapshots,
      instellingen: this.instellingen,
      vergunningen: this.vergunningen,
      risicos: this.risicos,
    });
  },
  wpVoortgang(wpId) {
    if (!this.voortgang[wpId]) this.voortgang[wpId] = {};
    return this.voortgang[wpId];
  },
  getDt(code) {
    if (this.doorlooptijden[code] != null && this.doorlooptijden[code] !== '') return +this.doorlooptijden[code];
    return ACTIVITEIT_INDEX[code] ? ACTIVITEIT_INDEX[code].activiteit.dtDefault : 5;
  },
  model() { return this.instellingen.model || 'claude-opus-4-8'; },
};

function apdVan(w) { return (w.apd || '').trim() || '—'; }

/* ----------------------- Afgeleide berekeningen -------------------------- */
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
  for (const s of spans) if (VANDAAG >= s.start && VANDAAG <= s.eind) return { status: 'lopend', fase: s.fase };
  for (const s of spans) if (VANDAAG < s.start) return { status: 'lopend', fase: s.fase };
  return { status: 'lopend', fase: spans[spans.length - 1].fase };
}

function activiteitVoortgang(wp) {
  const v = State.voortgang[wp.id] || {};
  let totaal = 0, klaar = 0, geblokkeerd = 0, bezig = 0;
  FASES.forEach((f) => f.activiteiten.forEach((a) => {
    const st = (v[a.code] && v[a.code].status) || 'open';
    if (st === 'nvt') return;
    totaal++;
    if (st === 'gereed') klaar++;
    if (st === 'geblokkeerd') geblokkeerd++;
    if (st === 'bezig') bezig++;
  }));
  return { totaal, klaar, geblokkeerd, bezig, pct: totaal ? Math.round((klaar / totaal) * 100) : 0 };
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
  if (!a || !b || b <= a) return 0;
  let d = new Date(a), n = 0;
  while (d < b) { if (isWerkdag(d)) n++; d.setDate(d.getDate() + 1); }
  return n;
}
function plusWerkdagen(start, dagen) {
  const d = new Date(start); let toe = 0;
  while (toe < dagen) { d.setDate(d.getDate() + 1); if (isWerkdag(d)) toe++; }
  return d;
}
function minWerkdagen(eind, dagen) {
  const d = new Date(eind); let toe = 0;
  while (toe < dagen) { d.setDate(d.getDate() - 1); if (isWerkdag(d)) toe++; }
  return d;
}

function faseSchema(wp, fase) {
  const start = parseDatum(wp.mijlpalen[fase.startMijlpaal]);
  const eind = parseDatum(wp.mijlpalen[fase.eindMijlpaal]);
  if (!start || !eind) return null;
  const beschikbaar = werkdagenTussen(start, eind);
  let benodigd = 0, cursor = new Date(start);
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

function volgendeMijlpaal(wp) {
  let best = null;
  MIJLPALEN.forEach((m) => {
    const d = parseDatum(wp.mijlpalen[m.key]);
    if (d && d >= VANDAAG && (!best || d < best.datum)) best = { datum: d, mijlpaal: m };
  });
  return best;
}

function signalen(wp) {
  const sig = [];
  const v = State.voortgang[wp.id] || {};
  const hf = huidigeFase(wp);
  const geblok = Object.entries(v).filter(([, o]) => o.status === 'geblokkeerd').map(([c]) => c);
  if (geblok.length) sig.push({ type: 'geblokkeerd', ernst: 3, tekst: `${geblok.length} geblokkeerde activiteit(en)`, codes: geblok });
  FASES.forEach((f) => {
    const eind = parseDatum(wp.mijlpalen[f.eindMijlpaal]);
    if (!eind) return;
    const fv = faseVoortgang(wp, f);
    if (eind < VANDAAG && fv.totaal && fv.pct < 100) {
      const dagen = dagenVerschil(eind, VANDAAG);
      sig.push({ type: 'achterstand', ernst: 3, tekst: `${f.naam} ${dagen}d over einddatum, ${fv.pct}% gereed` });
    }
  });
  if (hf.fase && hf.status === 'lopend') {
    const eind = parseDatum(wp.mijlpalen[hf.fase.eindMijlpaal]);
    const fv = faseVoortgang(wp, hf.fase);
    if (eind) {
      const dagen = dagenVerschil(VANDAAG, eind);
      if (dagen >= 0 && dagen <= 21 && fv.pct < 80)
        sig.push({ type: 'deadline', ernst: 2, tekst: `${hf.fase.naam} deadline over ${dagen}d, ${fv.pct}% gereed` });
      const rem = werkdagenTussen(VANDAAG, eind);
      const nietHaalbaar = hf.fase.activiteiten.filter((a) => {
        const st = (v[a.code] && v[a.code].status) || 'open';
        return st !== 'gereed' && st !== 'nvt' && State.getDt(a.code) > rem;
      });
      if (nietHaalbaar.length)
        sig.push({ type: 'overbelast', ernst: 2, tekst: `${nietHaalbaar.length} activiteit(en) passen qua doorlooptijd niet meer voor de einddatum (${rem} wd resterend)` });
    }
  }
  return sig;
}
function maxErnst(sigs) { return sigs.reduce((m, s) => Math.max(m, s.ernst), 0); }

/* ----------------------- Aggregatie over WP-sets ------------------------- */
function statsVoor(wps) {
  const meters = wps.reduce((s, w) => s + (+w.lengteNieuw || 0), 0);
  let pctSom = 0, kritiek = 0, gevaar = 0, geblok = 0, opKoers = 0;
  const faseTeller = {}; let volgende = null;
  wps.forEach((w) => {
    const av = activiteitVoortgang(w);
    pctSom += av.pct;
    if (av.geblokkeerd) geblok++;
    const e = maxErnst(signalen(w));
    if (e >= 3) kritiek++; else if (e >= 2) gevaar++; else opKoers++;
    const hf = huidigeFase(w);
    const key = hf.status === 'afgerond' ? 'Afgerond' : (hf.fase ? hf.fase.naam : 'Onbekend');
    faseTeller[key] = (faseTeller[key] || 0) + 1;
    const vm = volgendeMijlpaal(w);
    if (vm && (!volgende || vm.datum < volgende.datum)) volgende = vm;
  });
  return {
    wps, aantal: wps.length, meters,
    pct: wps.length ? Math.round(pctSom / wps.length) : 0,
    kritiek, gevaar, geblok, opKoers, faseTeller, volgende,
    engineers: [...new Set(wps.map((w) => w.engineer).filter(Boolean))],
    apds: [...new Set(wps.map(apdVan))],
  };
}
function projectStats(project) { return Object.assign({ project }, statsVoor(State.werkpakketten.filter((w) => w.project === project))); }

/* -------------------------- Filters / selectie --------------------------- */
function gefilterdeWerkpakketten() {
  const f = State.filters;
  const zoek = f.zoek.toLowerCase();
  return State.werkpakketten.filter((wp) => {
    if (f.project && wp.project !== f.project) return false;
    if (f.apd && apdVan(wp) !== f.apd) return false;
    if (f.engineer && wp.engineer !== f.engineer) return false;
    if (f.fase) { const hf = huidigeFase(wp).fase; if (!hf || hf.id !== f.fase) return false; }
    if (f.risico) {
      const e = maxErnst(signalen(wp));
      if (f.risico === 'kritiek' && e < 3) return false;
      if (f.risico === 'gevaar' && e !== 2) return false;
      if (f.risico === 'geblok' && !activiteitVoortgang(wp).geblokkeerd) return false;
      if (f.risico === 'opkoers' && e >= 2) return false;
    }
    if (zoek) {
      const blob = `${wp.project} ${wp.apd} ${wp.wp} ${wp.engineer} ${wp.tracStart} ${wp.tracEind} ${wp.tracdeel}`.toLowerCase();
      if (!blob.includes(zoek)) return false;
    }
    return true;
  });
}

/* ----------------------------- Takenplanning ----------------------------- */
function horizonRange() {
  const h = HORIZONS.find((x) => x.id === State.horizon) || HORIZONS[1];
  const van = new Date(VANDAAG);
  let tot, label;
  if (h.dagen) { tot = new Date(VANDAAG); tot.setDate(tot.getDate() + h.dagen); label = `komende ${h.label}`; }
  else if (h.id === 'maand') { tot = new Date(VANDAAG.getFullYear(), VANDAAG.getMonth() + 1, 0); label = 'rest van deze maand'; }
  else { const q = Math.floor(VANDAAG.getMonth() / 3); tot = new Date(VANDAAG.getFullYear(), q * 3 + 3, 0); label = 'rest van dit kwartaal'; }
  return { van, tot, label };
}

function komendeTaken(wps, tot) {
  const taken = [];
  wps.forEach((w) => {
    const hf = huidigeFase(w);
    const v = State.voortgang[w.id] || {};
    FASES.forEach((f) => {
      const sch = faseSchema(w, f);
      if (!sch) return;
      const faseEind = sch.eind, faseStart = sch.start;
      const overtijdFase = faseEind < VANDAAG;
      if (faseStart > tot) return;            // fase begint na de horizon
      sch.items.forEach((it) => {
        const a = it.activiteit;
        const st = (v[a.code] && v[a.code].status) || 'open';
        if (st === 'gereed' || st === 'nvt') return;
        if (it.start > tot && !overtijdFase) return;   // valt buiten de horizon
        const dt = it.dt;
        const restTotEind = werkdagenTussen(VANDAAG, faseEind);
        const latestStart = minWerkdagen(faseEind, dt);
        const speling = restTotEind - dt;
        let ernst = 1; const flags = [];
        if (st === 'geblokkeerd') { ernst = 3; flags.push('geblokkeerd'); }
        if (overtijdFase) { ernst = 3; if (!flags.includes('kritiek')) flags.push('kritiek'); }
        else if (dt > restTotEind) { ernst = Math.max(ernst, 3); if (!flags.includes('kritiek')) flags.push('kritiek'); }
        else if (VANDAAG > latestStart) { ernst = Math.max(ernst, 2); flags.push('gevaar'); }
        else if (speling <= Math.max(2, Math.ceil(dt * 0.3))) { ernst = Math.max(ernst, 2); flags.push('gevaar'); }
        const isLaatste = f.activiteiten[f.activiteiten.length - 1].code === a.code;
        if (isLaatste && faseEind >= VANDAAG && faseEind <= tot) flags.push('mijlpaal');
        taken.push({
          wp: w, fase: f, activiteit: a, status: st, dt,
          plannedStart: it.start, plannedEind: it.eind, faseEind, latestStart,
          speling, restTotEind, overtijd: overtijdFase, ernst, flags,
          huidig: !!(hf.fase && hf.fase.id === f.id),
        });
      });
    });
  });
  taken.sort((a, b) => b.ernst - a.ernst || a.faseEind - b.faseEind || a.plannedStart - b.plannedStart);
  return taken;
}

/* ----------------------------- Snapshots --------------------------------- */
function legSnapshot() {
  let gereed = 0, totaal = 0;
  const perProject = {};
  State.werkpakketten.forEach((w) => {
    const av = activiteitVoortgang(w);
    gereed += av.klaar; totaal += av.totaal;
    if (!perProject[w.project]) perProject[w.project] = { pctSom: 0, n: 0 };
    perProject[w.project].pctSom += av.pct; perProject[w.project].n++;
  });
  const pp = {};
  Object.entries(perProject).forEach(([p, o]) => { pp[p] = Math.round(o.pctSom / o.n); });
  const snap = {
    datum: isoDatum(VANDAAG),
    gemaakt: new Date().toISOString(),
    gereed, totaal,
    pct: totaal ? Math.round((gereed / totaal) * 100) : 0,
    perProject: pp,
  };
  State.snapshots = State.snapshots.filter((s) => s.datum !== snap.datum);
  State.snapshots.push(snap);
  State.snapshots.sort((a, b) => a.datum.localeCompare(b.datum));
  State.bewaar();
}
function snapshotVoor(datum) {
  let best = null;
  State.snapshots.forEach((s) => { if (s.datum <= datum && (!best || s.datum > best.datum)) best = s; });
  return best;
}

/* ------------- Realistische demo-voortgang (afgeleid van planning) ------- */
function _hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }
function _rng(seed) {
  return function () { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// Genereert plausibele statussen: eerdere fasen gereed, huidige fase deels af
// (mix bezig/geblokkeerd/open), toekomstige fasen open — met variatie per WP.
function genereerVoortgangVoor(wp) {
  const r = _rng(_hash(wp.id));
  const out = {};
  const hf = huidigeFase(wp);
  const afgerond = hf.status === 'afgerond';
  const fIdx = hf.fase ? FASES.findIndex((f) => f.id === hf.fase.id) : -1;
  const bias = r(); // sommige WP's lopen voor, sommige achter
  FASES.forEach((f, i) => {
    let fractie;
    if (afgerond) fractie = 1;
    else if (fIdx < 0) fractie = r() < 0.4 ? 0.2 : 0;
    else if (i < fIdx) fractie = 1;
    else if (i > fIdx) fractie = 0;
    else {
      const sch = faseSchema(wp, f);
      let elapsed = 0.5;
      if (sch) { const tot = werkdagenTussen(sch.start, sch.eind) || 1; elapsed = Math.min(1, Math.max(0, werkdagenTussen(sch.start, VANDAAG) / tot)); }
      fractie = Math.min(1, Math.max(0, elapsed * (0.65 + bias * 0.6)));
    }
    const acts = f.activiteiten;
    const klaar = Math.round(acts.length * fractie);
    acts.forEach((a, j) => {
      let st = 'open';
      if (j < klaar) st = r() < 0.06 ? 'nvt' : 'gereed';
      else if (i === fIdx && !afgerond && j === klaar) { const x = r(); st = x < 0.65 ? 'bezig' : (x < 0.82 ? 'geblokkeerd' : 'open'); }
      else if (i === fIdx && !afgerond && j === klaar + 1 && r() < 0.45) st = 'bezig';
      if (st !== 'open') out[a.code] = { status: st };
    });
  });
  return out;
}
function genereerDemoVoortgang(wps) {
  const out = {};
  wps.forEach((w) => { out[w.id] = genereerVoortgangVoor(w); });
  return out;
}

/* ------------------------------- Helpers --------------------------------- */
const el = (sel) => document.querySelector(sel);
const els = (sel) => Array.from(document.querySelectorAll(sel));
function htmlEsc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function toast(msg, type = '') {
  const t = el('#toast');
  t.className = 'toast toon ' + type;
  t.textContent = msg;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { t.className = 'toast ' + type; }, 2800);
}

/* -------------------------------- Render --------------------------------- */
function render() {
  vulFilters();
  renderOverzicht();
  renderPlanning();
  renderTaken();
  renderVergunningen();
  renderRisicos();
  renderDashboard();
  renderRapportenControls();
  renderActiviteiten();
  renderDoorlooptijden();
  renderInstellingen();
  if (State.actiefWp) renderDetail(State.actiefWp);
}

function vulFilters() {
  const projecten = [...new Set(State.werkpakketten.map((w) => w.project))].sort();
  const engineers = [...new Set(State.werkpakketten.map((w) => w.engineer).filter(Boolean))].sort();
  const apds = [...new Set(State.werkpakketten
    .filter((w) => !State.filters.project || w.project === State.filters.project)
    .map(apdVan))].sort();
  const setOpts = (sel, items, huidig, leeg) => {
    el(sel).innerHTML = `<option value="">${leeg}</option>` +
      items.map((i) => `<option value="${htmlEsc(i)}"${i === huidig ? ' selected' : ''}>${htmlEsc(i)}</option>`).join('');
  };
  setOpts('#filterProject', projecten, State.filters.project, 'Alle projecten');
  setOpts('#filterApd', apds, State.filters.apd, 'Alle APD’s');
  setOpts('#filterEngineer', engineers, State.filters.engineer, 'Alle engineers');
  el('#filterFase').innerHTML = `<option value="">Alle fasen</option>` +
    FASES.map((f) => `<option value="${f.id}"${f.id === State.filters.fase ? ' selected' : ''}>${htmlEsc(f.naam)}</option>`).join('');
  const risicoOpts = [['', 'Alle risico’s'], ['kritiek', 'Alleen kritiek'], ['gevaar', 'Alleen risico'], ['geblok', 'Met geblokkeerde activ.'], ['opkoers', 'Alleen op koers']];
  el('#filterRisico').innerHTML = risicoOpts.map(([v, l]) => `<option value="${v}"${v === State.filters.risico ? ' selected' : ''}>${l}</option>`).join('');
}

/* ----------------------- Overzicht (hiërarchie) -------------------------- */
// Eén niveau omhoog: van werkpakketten → APD's → projecten.
function niveauTerug() {
  if (State.filters.apd) State.filters.apd = '';
  else if (State.filters.project) State.filters.project = '';
  else return; // al op het hoogste niveau
  el('#filterZoek').value = ''; State.filters.zoek = '';
  render();
}

function renderOverzicht() {
  const wps = gefilterdeWerkpakketten();
  const niveau = !State.filters.project ? 'projecten' : (!State.filters.apd ? 'apds' : 'wps');

  const kruimels = [];
  if (niveau !== 'projecten') {
    const terugLabel = State.filters.apd ? '← Terug naar APD’s' : '← Terug naar projecten';
    kruimels.push(`<button class="terug-knop" data-niveau="terug">${terugLabel}</button>`);
  }
  kruimels.push('<button data-niveau="root">Projecten</button>');
  if (State.filters.project) {
    kruimels.push('<span class="scheiding">▸</span>');
    if (niveau === 'apds') kruimels.push(`<span class="huidig">${htmlEsc(State.filters.project)}</span>`);
    else kruimels.push(`<button data-niveau="project">${htmlEsc(State.filters.project)}</button>`);
  }
  if (State.filters.apd) {
    kruimels.push('<span class="scheiding">▸</span>');
    kruimels.push(`<span class="huidig">APD ${htmlEsc(State.filters.apd)}</span>`);
  }
  el('#kruimels').innerHTML = kruimels.join(' ');
  els('#kruimels [data-niveau]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.niveau === 'terug') { niveauTerug(); return; }
    if (b.dataset.niveau === 'root') { State.filters.project = ''; State.filters.apd = ''; }
    if (b.dataset.niveau === 'project') { State.filters.apd = ''; }
    el('#filterZoek').value = ''; State.filters.zoek = ''; render();
  }));

  const s = statsVoor(wps);
  const kt = [
    { val: s.aantal, label: 'Werkpakketten', cls: '', risico: '' },
    { val: niveau === 'projecten' ? [...new Set(wps.map((w) => w.project))].length : s.apds.length, label: niveau === 'projecten' ? 'Projecten' : 'APD’s', cls: 'kpi-paars', risico: '' },
    { val: `${(s.meters/1000).toLocaleString('nl-NL',{maximumFractionDigits:1})}<small> km</small>`, label: 'Nieuw tracé', cls: 'kpi-groen', risico: '' },
    { val: `${s.pct}<small>%</small>`, label: 'Gem. voortgang', cls: '', risico: 'opkoers' },
    { val: s.kritiek, label: 'Kritieke WP’s', cls: 'kpi-rood', risico: 'kritiek' },
    { val: s.gevaar, label: 'WP’s met risico', cls: 'kpi-amber', risico: 'gevaar' },
  ];
  el('#kpis').innerHTML = kt.map((t) => {
    const actief = t.risico && State.filters.risico === t.risico;
    const klik = t.risico ? 'klikbaar' : '';
    return `<div class="kpi ${klik} ${t.cls}${actief ? ' kpi-actief' : ''}"${t.risico ? ` data-risico="${t.risico}" tabindex="0" role="button" title="Filter op deze werkpakketten"` : ''}>
      <div class="kpi-val">${t.val}</div><div class="kpi-label">${t.label}</div>${t.risico ? '<span class="kpi-pijl">›</span>' : ''}</div>`;
  }).join('');
  els('#kpis .kpi[data-risico]').forEach((t) => {
    const zet = () => { State.filters.risico = State.filters.risico === t.dataset.risico ? '' : t.dataset.risico; render(); };
    t.addEventListener('click', zet);
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zet(); } });
  });

  const totaal = wps.length || 1;
  el('#faseTitel').textContent = 'Faseverdeling';
  el('#faseBalk').innerHTML = [...FASES.map((f) => f.naam), 'Afgerond', 'Onbekend']
    .filter((n) => s.faseTeller[n])
    .map((n) => {
      const fase = FASES.find((f) => f.naam === n);
      const kleur = fase ? fase.kleur : (n === 'Afgerond' ? '#475569' : '#cbd5e1');
      const pct = (s.faseTeller[n] / totaal) * 100;
      return `<div class="seg" style="width:${pct}%;background:${kleur}" title="${htmlEsc(n)}: ${s.faseTeller[n]}"></div>`;
    }).join('');
  el('#faseLegenda').innerHTML = [...FASES, { naam: 'Afgerond', kleur: '#475569' }]
    .filter((f) => s.faseTeller[f.naam])
    .map((f) => `<span class="leg"><i style="background:${f.kleur}"></i>${htmlEsc(f.naam)} (${s.faseTeller[f.naam]})</span>`).join('');

  if (niveau === 'projecten') renderProjectenGrid();
  else if (niveau === 'apds') renderApdGrid(State.filters.project);
  else renderWpTabel(wps);

  // Terug-knoppen (kruimelpad + inhoud) activeren
  els('.terug-knop').forEach((b) => b.addEventListener('click', niveauTerug));
}

function renderProjectenGrid() {
  const projecten = [...new Set(gefilterdeWerkpakketten().map((w) => w.project))].sort();
  const html = projecten.map((p) => {
    const s = projectStats(p);
    const totaal = s.aantal || 1;
    const segs = [...FASES, { naam: 'Afgerond', kleur: '#475569' }, { naam: 'Onbekend', kleur: '#cbd5e1' }]
      .filter((f) => s.faseTeller[f.naam])
      .map((f) => `<div class="seg" style="width:${(s.faseTeller[f.naam] / totaal) * 100}%;background:${f.kleur}"></div>`).join('');
    const chip = s.kritiek ? `<span class="chip rood">${s.kritiek} kritiek</span>`
      : s.gevaar ? `<span class="chip amber">${s.gevaar} risico</span>`
      : `<span class="chip groen">op koers</span>`;
    return `<div class="pcard" data-project="${htmlEsc(p)}">
      <div class="pcard-kop"><h3>${htmlEsc(p)}</h3>${chip}</div>
      <div class="pcard-stats">
        <div><strong>${s.apds.length}</strong><span>APD’s</span></div>
        <div><strong>${s.aantal}</strong><span>werkpakketten</span></div>
        <div><strong>${(s.meters/1000).toLocaleString('nl-NL',{maximumFractionDigits:1})}</strong><span>km tracé</span></div>
        <div><strong>${s.pct}%</strong><span>voortgang</span></div>
      </div>
      <div class="fasebalk mini">${segs}</div>
      <div class="pcard-foot">
        <span>${s.engineers.length ? htmlEsc(s.engineers.join(', ')) : '—'}</span>
        <span>${s.volgende ? `eerstvolgend: ${htmlEsc(s.volgende.mijlpaal.label)} · ${fmtDatum(s.volgende.datum)}` : ''}</span>
      </div>
      <button class="pcard-open">Open APD’s →</button>
    </div>`;
  }).join('');
  const leegTxt = (State.filters.risico || State.filters.engineer || State.filters.fase || State.filters.zoek)
    ? 'Geen projecten met werkpakketten die aan de huidige filters voldoen.'
    : 'Nog geen projecten. Importeer een planning of laad voorbeelddata.';
  el('#hierInhoud').innerHTML = `<div class="niveau-balk">Niveau 1 · Projecten</div><div class="projecten-grid">${html || `<div class="leeg">${leegTxt}</div>`}</div>`;
  els('#hierInhoud .pcard').forEach((c) => c.addEventListener('click', () => {
    State.filters.project = c.dataset.project; State.filters.apd = '';
    el('#filterZoek').value = ''; State.filters.zoek = ''; render();
  }));
}

function renderApdGrid(project) {
  const apds = [...new Set(gefilterdeWerkpakketten().map(apdVan))].sort();
  const html = apds.map((apd) => {
    const sub = State.werkpakketten.filter((w) => w.project === project && apdVan(w) === apd);
    const s = statsVoor(sub);
    const totaal = s.aantal || 1;
    const segs = [...FASES, { naam: 'Afgerond', kleur: '#475569' }, { naam: 'Onbekend', kleur: '#cbd5e1' }]
      .filter((f) => s.faseTeller[f.naam])
      .map((f) => `<div class="seg" style="width:${(s.faseTeller[f.naam] / totaal) * 100}%;background:${f.kleur}"></div>`).join('');
    const chip = s.kritiek ? `<span class="chip rood">${s.kritiek} kritiek</span>`
      : s.gevaar ? `<span class="chip amber">${s.gevaar} risico</span>`
      : `<span class="chip groen">op koers</span>`;
    return `<div class="apdcard" data-apd="${htmlEsc(apd)}">
      <div class="apdcard-kop"><div><span class="pad">APD</span><h4>${htmlEsc(apd)}</h4></div>${chip}</div>
      <div class="apdcard-stats">
        <div><strong>${s.aantal}</strong><span>werkpakketten</span></div>
        <div><strong>${(s.meters/1000).toLocaleString('nl-NL',{maximumFractionDigits:1})}</strong><span>km tracé</span></div>
        <div><strong>${s.pct}%</strong><span>voortgang</span></div>
      </div>
      <div class="fasebalk mini">${segs}</div>
      <button class="apdcard-open">Open werkpakketten →</button>
    </div>`;
  }).join('');
  el('#hierInhoud').innerHTML = `<div class="niveau-rij"><button class="terug-knop" data-niveau="terug">← Terug naar projecten</button><span class="niveau-balk">Niveau 2 · APD’s binnen ${htmlEsc(project)}</span></div><div class="apd-grid">${html || '<div class="leeg">Geen APD’s met werkpakketten die aan de huidige filters voldoen.</div>'}</div>`;
  els('#hierInhoud .apdcard').forEach((c) => c.addEventListener('click', () => {
    State.filters.apd = c.dataset.apd; render();
  }));
}

function renderWpTabel(wps) {
  const rows = wps.map((w) => {
    const hf = huidigeFase(w);
    const av = activiteitVoortgang(w);
    const faseNaam = hf.status === 'afgerond' ? 'Afgerond' : (hf.fase ? hf.fase.naam : '—');
    const kleur = hf.fase ? hf.fase.kleur : '#94a3b8';
    const statusBadge = hf.status === 'afgerond' ? '<span class="badge done">Afgerond</span>'
      : hf.status === 'gepland' ? '<span class="badge plan">Gepland</span>'
      : '<span class="badge live">Lopend</span>';
    const ernst = maxErnst(signalen(w));
    const risico = ernst >= 3 ? '<span class="tflag kritiek">kritiek</span>' : ernst >= 2 ? '<span class="tflag gevaar">risico</span>' : '';
    return `<tr data-wp="${htmlEsc(w.id)}" class="rij">
      <td><strong>${htmlEsc(w.wp)}</strong><div class="sub">${htmlEsc(w.tracStart)} → ${htmlEsc(w.tracEind)}</div></td>
      <td>${htmlEsc(w.engineer||'—')}</td>
      <td class="num">${(+w.lengteNieuw||0).toLocaleString('nl-NL')}</td>
      <td><span class="fase-pill" style="--c:${kleur}">${htmlEsc(faseNaam)}</span> ${statusBadge}</td>
      <td>${fmtDatum(w.mijlpalen.doNaarUO)}</td>
      <td><div class="bar"><span style="width:${av.pct}%"></span></div>
        <div class="sub">${av.klaar}/${av.totaal} · ${av.pct}%${av.geblokkeerd?` · <span style="color:#ef4444">${av.geblokkeerd} geblok.</span>`:''}</div></td>
      <td>${risico}</td>
    </tr>`;
  }).join('');
  el('#hierInhoud').innerHTML = `
    <div class="niveau-rij"><button class="terug-knop" data-niveau="terug">← Terug naar APD’s</button><span class="niveau-balk">Niveau 3 · Werkpakketten${State.filters.apd ? ' in APD ' + htmlEsc(State.filters.apd) : ''}</span></div>
    <div class="card">
      <div class="card-kop"><h2>Werkpakketten<span class="tel">${wps.length}</span></h2><span class="hint">Klik op een rij voor de activiteiten-checklist</span></div>
      <div class="tabel-wrap"><table class="tabel">
        <thead><tr><th>Werkpakket</th><th>Engineer</th><th class="num">Meters</th><th>Huidige fase</th><th>DO → UO</th><th>Voortgang</th><th>Risico</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="7" class="leeg">Geen werkpakketten gevonden.</td></tr>'}</tbody>
      </table></div>
    </div>`;
  els('#hierInhoud .rij').forEach((tr) => tr.addEventListener('click', () => openDetail(tr.dataset.wp)));
}

/* ------------------------------- Planning -------------------------------- */
function renderPlanning() {
  const wps = gefilterdeWerkpakketten();
  const container = el('#ganttBody');
  if (!wps.length) { container.innerHTML = '<div class="leeg">Geen werkpakketten.</div>'; el('#ganttAs').innerHTML = ''; return; }
  let min = null, max = null;
  wps.forEach((w) => MIJLPALEN.forEach((m) => {
    const d = parseDatum(w.mijlpalen[m.key]);
    if (d) { if (!min || d < min) min = d; if (!max || d > max) max = d; }
  }));
  if (!min || !max) { container.innerHTML = '<div class="leeg">Geen plandata.</div>'; return; }
  const span = (max - min) || 1;
  const pos = (d) => ((parseDatum(d) - min) / span) * 100;
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
      const ss = w.mijlpalen[f.startMijlpaal], e = w.mijlpalen[f.eindMijlpaal];
      if (!parseDatum(ss) || !parseDatum(e)) return '';
      const left = pos(ss), width = Math.max(pos(e) - pos(ss), 0.4);
      return `<div class="gseg" style="left:${left}%;width:${width}%;background:${f.kleur}" title="${htmlEsc(w.project)} ${htmlEsc(apdVan(w))} ${htmlEsc(w.wp)} — ${htmlEsc(f.naam)}: ${fmtDatum(ss)} → ${fmtDatum(e)}"></div>`;
    }).join('');
    return `<div class="grow" data-wp="${htmlEsc(w.id)}">
      <div class="glabel" title="${htmlEsc(w.project)} · ${htmlEsc(apdVan(w))} · ${htmlEsc(w.wp)}">${htmlEsc(w.project)} · ${htmlEsc(w.wp)}</div>
      <div class="gtrack">${segs}${vandaagLeft != null ? `<div class="vandaag-lijn" style="left:${vandaagLeft}%"></div>` : ''}</div>
    </div>`;
  }).join('');
  els('#ganttBody .grow').forEach((r) => r.addEventListener('click', () => openDetail(r.dataset.wp)));
  el('#ganttLegenda').innerHTML = FASES.map((f) => `<span class="leg"><i style="background:${f.kleur}"></i>${htmlEsc(f.naam)}</span>`).join('');
}

/* -------------------------------- Taken ---------------------------------- */
function renderTaken() {
  el('#horizonKiezer').innerHTML = HORIZONS.map((h) =>
    `<button data-h="${h.id}"${h.id === State.horizon ? ' class="actief"' : ''}>${htmlEsc(h.label)}</button>`).join('');
  els('#horizonKiezer button').forEach((b) => b.addEventListener('click', () => { State.horizon = b.dataset.h; renderTaken(); }));

  const { van, tot, label } = horizonRange();
  const wps = gefilterdeWerkpakketten();
  const taken = komendeTaken(wps, tot);
  const kritiek = taken.filter((t) => t.ernst >= 3);
  const gevaar = taken.filter((t) => t.ernst === 2);
  const gepland = taken.filter((t) => t.ernst === 1);
  const geblok = taken.filter((t) => t.status === 'geblokkeerd');
  let mp = 0;
  wps.forEach((w) => MIJLPALEN.forEach((m) => { const d = parseDatum(w.mijlpalen[m.key]); if (d && d >= van && d <= tot) mp++; }));

  el('#takenPeriode').innerHTML = `Periode: <span style="color:var(--accent)">${fmtDatum(van)} → ${fmtDatum(tot)}</span> <span class="hint">(${label})</span>`;
  const tf = State.takenFilter;
  const statTiles = [
    { tf: 'alle', cls: 'blauw', val: taken.length, label: 'taken in beeld' },
    { tf: 'kritiek', cls: 'rood', val: kritiek.length, label: 'kritiek' },
    { tf: 'gevaar', cls: 'amber', val: gevaar.length, label: 'lopen gevaar' },
    { tf: 'geblok', cls: '', val: geblok.length, label: 'geblokkeerd' },
    { tf: null, cls: 'groen', val: mp, label: 'mijlpalen in periode' },
  ];
  el('#takenStats').innerHTML = statTiles.map((t) => {
    const klik = t.tf ? 'klikbaar' : '';
    const actief = t.tf && tf === t.tf ? ' actief' : '';
    return `<div class="tstat ${t.cls} ${klik}${actief}"${t.tf ? ` data-tf="${t.tf}" tabindex="0" role="button" title="Filter de takenlijst"` : ''}><b>${t.val}</b><span>${t.label}</span></div>`;
  }).join('');
  els('#takenStats .tstat[data-tf]').forEach((t) => {
    const zet = () => { State.takenFilter = State.takenFilter === t.dataset.tf ? 'alle' : t.dataset.tf; renderTaken(); };
    t.addEventListener('click', zet);
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zet(); } });
  });

  const groep = (titel, lijst, vlagKleur, maxItems) => {
    if (!lijst.length) return '';
    const begrensd = maxItems && lijst.length > maxItems;
    const items = (begrensd ? lijst.slice(0, maxItems) : lijst).map(taakKaart).join('');
    const rest = begrensd ? `<div class="hint" style="padding:8px 4px">… en nog ${lijst.length - maxItems} geplande taken (verfijn met de filters of kies een kortere horizon).</div>` : '';
    return `<div class="taakgroep">
      <div class="taakgroep-kop"><span class="vlag" style="background:${vlagKleur}"></span>${titel}<span class="telp">${lijst.length}</span></div>
      ${items}${rest}</div>`;
  };

  let inhoud = '';
  if (tf === 'kritiek') inhoud = groep('Kritieke taken', kritiek, '#ef4444');
  else if (tf === 'gevaar') inhoud = groep('Taken die gevaar lopen', gevaar, '#f59e0b');
  else if (tf === 'geblok') inhoud = groep('Geblokkeerde taken', geblok, '#8b5cf6');
  else inhoud = groep('Kritieke taken', kritiek, '#ef4444') + groep('Taken die gevaar lopen', gevaar, '#f59e0b') + groep('Overige geplande taken', gepland, '#3b82f6', 40);

  const filterBalk = tf !== 'alle'
    ? `<div class="taken-filterbalk">Gefilterd op <strong>${tf === 'kritiek' ? 'kritieke' : tf === 'gevaar' ? 'risicovolle' : 'geblokkeerde'} taken</strong> <button class="terug-knop" id="takenFilterReset">Toon alle taken</button></div>`
    : '';
  el('#takenLijst').innerHTML = filterBalk + (inhoud || '<div class="card"><div class="leeg">Geen taken in deze selectie. 👍</div></div>');

  const reset = el('#takenFilterReset');
  if (reset) reset.addEventListener('click', () => { State.takenFilter = 'alle'; renderTaken(); });
  els('#takenLijst .taak').forEach((t) => t.addEventListener('click', () => openDetail(t.dataset.wp)));
}

function taakKaart(t) {
  const w = t.wp;
  const dagen = dagenVerschil(VANDAAG, t.faseEind);
  const deadlineTxt = t.overtijd
    ? `<span style="color:var(--rood)">${Math.abs(dagen)}d over deadline</span>`
    : `nog <b>${dagen}d</b> tot fase-eind`;
  const vlaggen = t.flags.map((f) => `<span class="tflag ${f}">${f}</span>`).join('');
  const stKleur = STATUSSEN[t.status].kleur;
  return `<div class="taak ernst-${t.ernst}" data-wp="${htmlEsc(w.id)}">
    <div class="taak-hoofd">
      <div class="taak-titel"><span class="tcode">${htmlEsc(t.activiteit.code)}</span>${htmlEsc(t.activiteit.naam)}</div>
      <div class="taak-meta">
        <span>${htmlEsc(w.project)} · ${htmlEsc(apdVan(w))} · <b>${htmlEsc(w.wp)}</b></span>
        <span>${htmlEsc(w.engineer || '—')}</span>
        <span>fase: <b>${htmlEsc(t.fase.naam)}</b></span>
        <span>doorlooptijd: <b>${t.dt} wd</b></span>
        <span>speling: <b style="color:${t.speling < 0 ? 'var(--rood)' : t.speling < 3 ? 'var(--amber)' : 'inherit'}">${t.speling} wd</b></span>
      </div>
    </div>
    <div class="taak-rechts">
      <div class="taak-vlaggen">${vlaggen}<span class="statuschip" style="background:${stKleur}">${STATUSSEN[t.status].label}</span></div>
      <div class="taak-deadline">${deadlineTxt} <em>(${fmtDatum(t.faseEind)})</em></div>
      <div class="hint">uiterlijk starten: ${fmtDatum(t.latestStart)}</div>
    </div>
  </div>`;
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
  el('#detailSub').innerHTML = `APD ${htmlEsc(apdVan(w))} · ${htmlEsc(w.engineer || '—')} · ${htmlEsc(w.tracStart)} → ${htmlEsc(w.tracEind)} · ${(+w.lengteNieuw||0).toLocaleString('nl-NL')} m`;
  const volgende = volgendeMijlpaal(w);
  const mij = MIJLPALEN.filter((m) => parseDatum(w.mijlpalen[m.key])).map((m) => {
    const d = parseDatum(w.mijlpalen[m.key]);
    const verleden = d <= VANDAAG;
    const isNext = volgende && volgende.mijlpaal.key === m.key;
    return `<li class="${verleden ? 'past' : ''}${isNext ? ' next' : ''}"><span class="dot"></span><span class="ml">${htmlEsc(m.label)}</span><span class="md">${fmtDatum(d)}</span></li>`;
  }).join('');
  el('#detailMijlpalen').innerHTML = mij || '<li class="leeg">Geen mijlpaaldata.</li>';
  el('#detailFaseInfo').innerHTML = hf.fase
    ? `Huidige fase volgens planning: <strong style="color:${hf.fase.kleur}">${htmlEsc(hf.fase.naam)}</strong> <span class="badge ${hf.status==='afgerond'?'done':hf.status==='gepland'?'plan':'live'}">${hf.status}</span> · activiteit-voortgang ${av.klaar}/${av.totaal} (${av.pct}%)`
    : 'Geen fase-informatie beschikbaar.';
  el('#detailRegisters').innerHTML = detailRegistersHtml(w);
  bindDetailRegisters(w);
  el('#detailFasen').innerHTML = FASES.map((f) => {
    const fv = faseVoortgang(w, f);
    const open = (hf.fase && hf.fase.id === f.id) ? ' open' : '';
    const items = f.activiteiten.map((a) => {
      const cur = (v[a.code] && v[a.code].status) || 'open';
      const notitie = (v[a.code] && v[a.code].notitie) || '';
      const opts = Object.entries(STATUSSEN).map(([k, o]) => `<option value="${k}"${k === cur ? ' selected' : ''}>${o.label}</option>`).join('');
      return `<div class="act ${cur}">
        <div class="act-top"><span class="act-code">${htmlEsc(a.code)}</span><span class="act-naam">${htmlEsc(a.naam)}</span>
        <select class="act-status" data-wp="${htmlEsc(w.id)}" data-code="${htmlEsc(a.code)}" style="--c:${STATUSSEN[cur].kleur}">${opts}</select></div>
        <div class="act-omschr">${htmlEsc(a.omschrijving)}</div>
        <input class="act-notitie" data-wp="${htmlEsc(w.id)}" data-code="${htmlEsc(a.code)}" placeholder="Notitie / actie…" value="${htmlEsc(notitie)}"></div>`;
    }).join('');
    const sch = faseSchema(w, f);
    const budget = sch ? `<div class="fbudget ${sch.overschrijding ? 'krap' : ''}">Venster ${fmtDatum(sch.start)} → ${fmtDatum(sch.eind)} · <strong>${sch.beschikbaar}</strong> werkdagen beschikbaar · som doorlooptijden <strong>${sch.benodigd}</strong> wd ${sch.overschrijding ? '<span class="waarsch">parallel werk nodig</span>' : '<span class="ok">ruim</span>'}</div>` : '';
    return `<details class="fblock"${open}>
      <summary style="--c:${f.kleur}"><span class="fnaam">${htmlEsc(f.code)} ${htmlEsc(f.naam)}</span>
        <span class="fbar"><span style="width:${fv.pct}%;background:${f.kleur}"></span></span><span class="fpct">${fv.klaar}/${fv.totaal}</span></summary>
      <div class="fomschr">${htmlEsc(f.omschrijving)}</div>${budget}${items}</details>`;
  }).join('');
  els('#detailFasen .act-status').forEach((sl) => sl.addEventListener('change', (e) => {
    const { wp, code } = e.target.dataset;
    State.wpVoortgang(wp)[code] = Object.assign(State.wpVoortgang(wp)[code] || {}, { status: e.target.value });
    State.bewaar(); renderDetail(wp); renderOverzicht(); renderTaken(); renderDashboard();
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
      </tbody></table></section>`).join('');
}

/* --------------------------- Doorlooptijden ------------------------------ */
function renderDoorlooptijden() {
  el('#dtBody').innerHTML = FASES.map((f) => {
    const rows = f.activiteiten.map((a) => {
      const eff = State.getDt(a.code);
      const aangepast = State.doorlooptijden[a.code] != null && State.doorlooptijden[a.code] !== '';
      return `<tr><td class="rc">${htmlEsc(a.code)}</td><td>${htmlEsc(a.naam)}</td>
        <td class="num"><input type="number" min="0" class="dt-inp" data-code="${htmlEsc(a.code)}" value="${eff}"></td>
        <td class="num sub">${a.dtDefault}${aangepast ? ' <span class="aangepast">aangepast</span>' : ''}</td></tr>`;
    }).join('');
    const somDef = f.activiteiten.reduce((s, a) => s + a.dtDefault, 0);
    const somEff = f.activiteiten.reduce((s, a) => s + State.getDt(a.code), 0);
    return `<section class="dt-fase"><h3 style="--c:${f.kleur}">${htmlEsc(f.code)} ${htmlEsc(f.naam)} <span class="dt-som">totaal ${somEff} werkdagen${somEff!==somDef?` (standaard ${somDef})`:''}</span></h3>
      <table class="ref-tabel dt-tabel"><thead><tr><th>Code</th><th>Activiteit</th><th class="num">Doorlooptijd (wd)</th><th class="num">Standaard</th></tr></thead>
      <tbody>${rows}</tbody></table></section>`;
  }).join('');
  els('#dtBody .dt-inp').forEach((inp) => inp.addEventListener('change', (e) => {
    const code = e.target.dataset.code, val = e.target.value.trim();
    if (val === '' || +val === ACTIVITEIT_INDEX[code].activiteit.dtDefault) delete State.doorlooptijden[code];
    else State.doorlooptijden[code] = +val;
    State.bewaar(); renderDoorlooptijden(); renderTaken();
    if (State.actiefWp) renderDetail(State.actiefWp);
  }));
}

/* ---------------------------- Dashboard / KPI ---------------------------- */
function statusMix(set) {
  const t = { open: 0, bezig: 0, gereed: 0, geblokkeerd: 0, nvt: 0 };
  set.forEach((w) => { const v = State.voortgang[w.id] || {}; FASES.forEach((f) => f.activiteiten.forEach((a) => { t[(v[a.code] && v[a.code].status) || 'open']++; })); });
  return t;
}
function voortgangRijHtml(naam, set) {
  const t = statusMix(set);
  const tel = t.open + t.bezig + t.gereed + t.geblokkeerd || 1;
  const pct = Math.round((t.gereed / tel) * 100);
  const seg = (k) => t[k] ? `<span class="stseg" style="width:${(t[k] / tel * 100).toFixed(1)}%;background:${STATUSSEN[k].kleur}" title="${STATUSSEN[k].label}: ${t[k]}"></span>` : '';
  return `<div class="vp-rij">
    <div class="vp-kop"><span class="vp-naam">${htmlEsc(naam)}</span><span class="vp-pct">${pct}%</span></div>
    <div class="statbar">${seg('gereed')}${seg('bezig')}${seg('geblokkeerd')}${seg('open')}</div>
    <div class="vp-meta">${set.length} WP · ${t.gereed} gereed · ${t.bezig} bezig${t.geblokkeerd ? ` · <span style="color:var(--rood)">${t.geblokkeerd} geblokkeerd</span>` : ''}</div>
  </div>`;
}
function dashboardWps() {
  return State.dashScope === 'portfolio' ? State.werkpakketten : State.werkpakketten.filter((w) => w.project === State.dashScope);
}
function renderDashboard() {
  const projecten = [...new Set(State.werkpakketten.map((w) => w.project))].sort();
  if (State.dashScope !== 'portfolio' && !projecten.includes(State.dashScope)) State.dashScope = 'portfolio';
  el('#dashScope').innerHTML = [`<button data-scope="portfolio"${State.dashScope === 'portfolio' ? ' class="actief"' : ''}>Portfolio</button>`]
    .concat(projecten.map((p) => `<button data-scope="${htmlEsc(p)}"${State.dashScope === p ? ' class="actief"' : ''}>${htmlEsc(p)}</button>`)).join('');
  els('#dashScope button').forEach((b) => b.addEventListener('click', () => { State.dashScope = b.dataset.scope; renderDashboard(); }));

  const wps = dashboardWps();
  const s = statsVoor(wps);

  const telling = { open: 0, bezig: 0, gereed: 0, geblokkeerd: 0, nvt: 0 };
  let actGereed = 0, actTotaal = 0;
  wps.forEach((w) => {
    const v = State.voortgang[w.id] || {};
    FASES.forEach((f) => f.activiteiten.forEach((a) => {
      const st = (v[a.code] && v[a.code].status) || 'open';
      telling[st]++;
      if (st !== 'nvt') { actTotaal++; if (st === 'gereed') actGereed++; }
    }));
  });

  const grens30 = new Date(VANDAAG); grens30.setDate(grens30.getDate() + 30);
  let mp30 = 0;
  wps.forEach((w) => MIJLPALEN.forEach((m) => { const d = parseDatum(w.mijlpalen[m.key]); if (d && d >= VANDAAG && d <= grens30) mp30++; }));

  let trend = '';
  if (State.snapshots.length) {
    const vorige = State.snapshots[State.snapshots.length - 1];
    const basis = State.dashScope === 'portfolio' ? vorige.pct : (vorige.perProject[State.dashScope] ?? s.pct);
    const d = s.pct - basis;
    if (d > 0) trend = `<div class="kpi-trend up">▲ +${d}% sinds ${fmtDatum(parseDatum(vorige.datum))}</div>`;
    else if (d < 0) trend = `<div class="kpi-trend down">▼ ${d}% sinds ${fmtDatum(parseDatum(vorige.datum))}</div>`;
    else trend = `<div class="kpi-trend flat">– gelijk sinds ${fmtDatum(parseDatum(vorige.datum))}</div>`;
  }

  const tiles = [
    { val: s.aantal, label: 'Werkpakketten', cls: '', actie: 'overzicht' },
    { val: `${(s.meters/1000).toLocaleString('nl-NL',{maximumFractionDigits:1})}<small> km</small>`, label: 'Nieuw tracé', cls: 'kpi-paars', actie: 'overzicht' },
    { val: `${s.pct}<small>%</small>`, label: 'Gem. voortgang', cls: 'kpi-groen', actie: 'donut', extra: trend },
    { val: `${actGereed}<small>/${actTotaal}</small>`, label: 'Activiteiten gereed', cls: '', actie: 'donut' },
    { val: s.kritiek, label: 'Kritieke werkpakketten', cls: 'kpi-rood', actie: 'kritiek' },
    { val: s.gevaar, label: 'Werkpakketten met risico', cls: 'kpi-amber', actie: 'kritiek' },
    { val: telling.geblokkeerd, label: 'Geblokkeerde activiteiten', cls: 'kpi-rood', actie: 'kritiek' },
    { val: mp30, label: 'Mijlpalen ≤ 30 dagen', cls: '', actie: 'mijlpalen' },
  ];
  el('#dashKpis').innerHTML = tiles.map((t) =>
    `<div class="kpi klikbaar ${t.cls}" data-actie="${t.actie}" tabindex="0" role="button" title="Klik voor details">
      <div class="kpi-val">${t.val}</div><div class="kpi-label">${t.label}</div>${t.extra || ''}<span class="kpi-pijl">›</span></div>`).join('');
  els('#dashKpis .kpi').forEach((t) => {
    t.addEventListener('click', () => kpiActie(t.dataset.actie));
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); kpiActie(t.dataset.actie); } });
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

  const totWp = wps.length || 1;
  el('#dashFaseBalk').innerHTML = [...FASES.map((f) => f.naam), 'Afgerond', 'Onbekend']
    .filter((n) => s.faseTeller[n]).map((n) => {
      const fase = FASES.find((f) => f.naam === n);
      const kleur = fase ? fase.kleur : (n === 'Afgerond' ? '#475569' : '#cbd5e1');
      return `<div class="seg" style="width:${(s.faseTeller[n]/totWp)*100}%;background:${kleur}" title="${htmlEsc(n)}: ${s.faseTeller[n]}"></div>`;
    }).join('');
  el('#dashFaseLegenda').innerHTML = [...FASES, { naam: 'Afgerond', kleur: '#475569' }]
    .filter((f) => s.faseTeller[f.naam]).map((f) => `<span class="leg"><i style="background:${f.kleur}"></i>${htmlEsc(f.naam)} (${s.faseTeller[f.naam]})</span>`).join('');
  el('#dashRisk').innerHTML = `
    <div class="risk-tile" style="background:#f0fdf4"><b style="color:#047857">${s.opKoers}</b><span>op koers</span></div>
    <div class="risk-tile" style="background:#fffbeb"><b style="color:#b45309">${s.gevaar}</b><span>aandacht / risico</span></div>
    <div class="risk-tile" style="background:#fef2f2"><b style="color:#b91c1c">${s.kritiek}</b><span>kritiek</span></div>`;

  const grens = new Date(VANDAAG); grens.setDate(grens.getDate() + 60);
  const komend = [];
  wps.forEach((w) => MIJLPALEN.forEach((m) => { const d = parseDatum(w.mijlpalen[m.key]); if (d && d >= VANDAAG && d <= grens) komend.push({ wp: w, mijlpaal: m, datum: d }); }));
  komend.sort((a, b) => a.datum - b.datum);
  el('#rapKomendTitel').innerHTML = `Naderende mijlpalen <span class="tel">≤ 60 dagen · ${komend.length}</span>`;
  el('#rapKomend').innerHTML = komend.length ? komend.slice(0, 40).map((k) => {
    const dagen = dagenVerschil(VANDAAG, k.datum);
    return `<li data-wp="${htmlEsc(k.wp.id)}"><span class="dl-datum">${fmtDatum(k.datum)} <em>(${dagen}d)</em></span>
      <span class="dl-tekst"><strong>${htmlEsc(k.wp.project)} · ${htmlEsc(k.wp.wp)}</strong> — ${htmlEsc(k.mijlpaal.label)}</span></li>`;
  }).join('') : '<li class="leeg">Geen mijlpalen in de komende 60 dagen.</li>';
  els('#rapKomend li[data-wp]').forEach((li) => li.addEventListener('click', () => openDetail(li.dataset.wp)));

  const projHtml = (State.dashScope === 'portfolio'
    ? [...new Set(wps.map((w) => w.project))].sort().map((p) => ({ naam: p, set: wps.filter((w) => w.project === p) }))
    : [...new Set(wps.map(apdVan))].sort().map((apd) => ({ naam: 'APD ' + apd, set: wps.filter((w) => apdVan(w) === apd) }))
  ).map(({ naam, set }) => voortgangRijHtml(naam, set)).join('');
  el('#rapProjecten').innerHTML = projHtml || '<div class="leeg">—</div>';

  const kritiekLijst = [];
  wps.forEach((w) => { const sg = signalen(w); if (sg.length) kritiekLijst.push({ wp: w, sigs: sg, ernst: maxErnst(sg) }); });
  kritiekLijst.sort((a, b) => b.ernst - a.ernst);
  el('#rapKritiekTitel').innerHTML = `Kritiek &amp; aandacht <span class="tel">${kritiekLijst.length} werkpakketten</span>`;
  el('#rapKritiek').innerHTML = kritiekLijst.length ? kritiekLijst.map((k) =>
    `<li data-wp="${htmlEsc(k.wp.id)}" class="ernst-${k.ernst}"><span class="kr-wp"><strong>${htmlEsc(k.wp.project)} · ${htmlEsc(apdVan(k.wp))} · ${htmlEsc(k.wp.wp)}</strong></span>
      <span class="kr-sigs">${k.sigs.map((sg) => `<span class="sig sig-${sg.type}">${htmlEsc(sg.tekst)}</span>`).join('')}</span></li>`).join('')
    : '<li class="leeg">Geen kritieke punten. 👍</li>';
  els('#rapKritiek li[data-wp]').forEach((li) => li.addEventListener('click', () => openDetail(li.dataset.wp)));

  const engs = {};
  wps.forEach((w) => {
    const e = w.engineer || '—';
    if (!engs[e]) engs[e] = { n: 0, pctSom: 0, bezig: 0 };
    const av = activiteitVoortgang(w);
    engs[e].n++; engs[e].pctSom += av.pct; engs[e].bezig += av.bezig;
  });
  el('#dashEngineers').innerHTML = Object.entries(engs).sort((a, b) => b[1].n - a[1].n).map(([e, o]) => {
    const pct = Math.round(o.pctSom / o.n);
    return `<div class="eng-rij"><span>${htmlEsc(e)}</span><span class="bar wide"><span style="width:${pct}%"></span></span><span class="eng-tel">${o.n} WP · ${o.bezig} bezig</span></div>`;
  }).join('') || '<div class="leeg">—</div>';

  const apdSet = {};
  wps.forEach((w) => { const a = apdVan(w); if (!apdSet[a]) apdSet[a] = []; apdSet[a].push(w); });
  el('#dashApd').innerHTML = Object.entries(apdSet).sort().map(([a, set]) => voortgangRijHtml('APD ' + a, set)).join('') || '<div class="leeg">—</div>';

  renderTrend();
  renderTijdlijn();
}

/* ----------------------- Dashboard: interactie & visuals ----------------- */
function kpiActie(actie) {
  if (actie === 'overzicht') {
    State.filters = { project: State.dashScope === 'portfolio' ? '' : State.dashScope, apd: '', engineer: '', fase: '', zoek: '' };
    el('#filterZoek').value = ''; render(); toonTab('overzicht');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const map = { donut: '#rapStatusDonut', kritiek: '#rapKritiek', mijlpalen: '#rapKomend' };
  if (map[actie]) scrollNaarKaart(map[actie]);
}
function scrollNaarKaart(innerSel) {
  const card = el(innerSel) && el(innerSel).closest('.card');
  if (!card) return;
  card.classList.remove('kaart-flits'); void card.offsetWidth; card.classList.add('kaart-flits');
  if (typeof card.scrollIntoView === 'function') card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Voortgangstrend uit momentopnames (SVG-lijngrafiek).
function renderTrend() {
  const node = el('#dashTrend'); if (!node) return;
  const reeks = State.snapshots
    .map((s) => ({ datum: s.datum, val: State.dashScope === 'portfolio' ? s.pct : (s.perProject[State.dashScope] ?? null) }))
    .filter((p) => p.val != null);
  if (reeks.length < 2) {
    node.innerHTML = `<div class="leeg-visual"><span class="lv-ico">📈</span>Leg minstens twee momentopnames vast (<strong>Beheer → Instellingen</strong>) om de voortgangstrend te zien.${reeks.length ? `<br><span class="hint">Nu ${reeks.length} meetpunt.</span>` : ''}</div>`;
    return;
  }
  node.innerHTML = svgTrend(reeks);
}

function svgTrend(reeks) {
  const W = 620, H = 170, padL = 36, padR = 14, padT = 16, padB = 30;
  const xs = (i) => padL + (i / (reeks.length - 1)) * (W - padL - padR);
  const ys = (v) => padT + (1 - v / 100) * (H - padT - padB);
  const pts = reeks.map((p, i) => [xs(i), ys(p.val)]);
  const lijn = pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
  const vlak = `${padL},${ys(0).toFixed(1)} ${lijn} ${xs(reeks.length - 1).toFixed(1)},${ys(0).toFixed(1)}`;
  const grid = [0, 25, 50, 75, 100].map((v) =>
    `<line x1="${padL}" y1="${ys(v)}" x2="${W - padR}" y2="${ys(v)}" stroke="#e4e9f0" stroke-width="1"/>
     <text x="${padL - 6}" y="${ys(v) + 3}" text-anchor="end" font-size="9" fill="#94a3b8">${v}%</text>`).join('');
  const dots = pts.map((p, i) =>
    `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4" fill="#2563eb" stroke="#fff" stroke-width="1.5"><title>${fmtDatum(parseDatum(reeks[i].datum))}: ${reeks[i].val}%</title></circle>`).join('');
  const idx = [0, Math.floor((reeks.length - 1) / 2), reeks.length - 1].filter((v, i, a) => a.indexOf(v) === i);
  const xlabels = idx.map((i) =>
    `<text x="${xs(i).toFixed(1)}" y="${H - 8}" text-anchor="${i === 0 ? 'start' : i === reeks.length - 1 ? 'end' : 'middle'}" font-size="9" fill="#64748b">${parseDatum(reeks[i].datum).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' })}</text>`).join('');
  const laatste = reeks[reeks.length - 1];
  const lp = pts[pts.length - 1];
  const eindLabel = `<text x="${(lp[0] - 6).toFixed(1)}" y="${(lp[1] - 9).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="#1e3a8a">${laatste.val}%</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Voortgangstrend">
    <defs><linearGradient id="trendvlak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2563eb" stop-opacity="0.22"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></linearGradient></defs>
    ${grid}
    <polygon points="${vlak}" fill="url(#trendvlak)"/>
    <polyline points="${lijn}" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}${eindLabel}${xlabels}
  </svg>`;
}

// Mijlpalen per week (komende 90 dagen) — gestapelde staafgrafiek, kleur per fase.
function renderTijdlijn() {
  const node = el('#dashTijdlijn'); if (!node) return;
  const wps = dashboardWps();
  const eind = new Date(VANDAAG); eind.setDate(eind.getDate() + 91);
  const items = [];
  wps.forEach((w) => MIJLPALEN.forEach((m) => {
    const d = parseDatum(w.mijlpalen[m.key]);
    if (d && d >= VANDAAG && d <= eind) items.push({ m, d });
  }));
  if (!items.length) { node.innerHTML = '<div class="leeg-visual"><span class="lv-ico">🏁</span>Geen mijlpalen in de komende 90 dagen.</div>'; return; }
  node.innerHTML = svgMijlpalenHisto(items, VANDAAG);
}

function svgMijlpalenHisto(items, van) {
  const weken = 13;
  const buckets = Array.from({ length: weken }, () => ({}));
  items.forEach((it) => {
    const wk = Math.min(weken - 1, Math.floor(dagenVerschil(van, it.d) / 7));
    const fase = FASES.find((f) => f.eindMijlpaal === it.m.key);
    const key = fase ? fase.id : 'overig';
    buckets[wk][key] = (buckets[wk][key] || 0) + 1;
  });
  const totals = buckets.map((b) => Object.values(b).reduce((a, c) => a + c, 0));
  const maxT = Math.max(1, ...totals);
  const W = 620, H = 190, padL = 26, padR = 10, padT = 14, padB = 32;
  const bw = (W - padL - padR) / weken;
  const colFor = (id) => { const f = FASES.find((x) => x.id === id); return f ? f.kleur : '#94a3b8'; };
  const naamFor = (id) => { const f = FASES.find((x) => x.id === id); return f ? f.naam : 'Overig'; };
  // y-rasterlijnen
  const stap = Math.max(1, Math.ceil(maxT / 4));
  let grid = '';
  for (let v = 0; v <= maxT; v += stap) {
    const y = (H - padB) - (v / maxT) * (H - padT - padB);
    grid += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="#eef2f7" stroke-width="1"/><text x="${padL - 5}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="9" fill="#94a3b8">${v}</text>`;
  }
  let bars = '';
  buckets.forEach((b, i) => {
    let y = H - padB;
    const x = padL + i * bw + bw * 0.18, w = bw * 0.64;
    const wkStart = new Date(van); wkStart.setDate(wkStart.getDate() + i * 7);
    FASES.map((f) => f.id).forEach((id) => {
      const c = b[id]; if (!c) return;
      const h = (c / maxT) * (H - padT - padB); y -= h;
      bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${colFor(id)}" rx="2"><title>${htmlEsc(naamFor(id))}: ${c} mijlpaal(en) — week van ${fmtDatum(wkStart)}</title></rect>`;
    });
    if (totals[i]) bars += `<text x="${(x + w / 2).toFixed(1)}" y="${(y - 4).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="#334155">${totals[i]}</text>`;
  });
  let xl = '';
  for (let i = 0; i < weken; i += 2) {
    const d = new Date(van); d.setDate(d.getDate() + i * 7);
    xl += `<text x="${(padL + i * bw + bw / 2).toFixed(1)}" y="${H - 10}" text-anchor="middle" font-size="9" fill="#64748b">${d.toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' })}</text>`;
  }
  const as = `<line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" stroke="#cbd5e1" stroke-width="1.5"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Mijlpalen per week">${grid}${as}${bars}${xl}</svg>
    <div class="legenda" style="margin-top:10px">${FASES.map((f) => `<span class="leg"><i style="background:${f.kleur}"></i>${htmlEsc(f.naam)}</span>`).join('')}</div>`;
}

/* ----------------------- Rapporten (AI) — periodes ----------------------- */
function periodeOpties(type) {
  const out = [];
  if (type === 'maand') {
    let d = new Date(VANDAAG.getFullYear(), VANDAAG.getMonth(), 1);
    for (let i = 0; i < 12; i++) {
      const van = new Date(d.getFullYear(), d.getMonth(), 1);
      const tot = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      out.push({ id: isoDatum(van), van, tot, label: van.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' }) });
      d = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    }
  } else {
    let q = Math.floor(VANDAAG.getMonth() / 3), jaar = VANDAAG.getFullYear();
    for (let i = 0; i < 8; i++) {
      const van = new Date(jaar, q * 3, 1);
      const tot = new Date(jaar, q * 3 + 3, 0);
      out.push({ id: `${jaar}-Q${q + 1}`, van, tot, label: `Q${q + 1} ${jaar}` });
      q--; if (q < 0) { q = 3; jaar--; }
    }
  }
  return out;
}

function renderRapportenControls() {
  const type = el('#rapType').value || 'maand';
  const opties = periodeOpties(type);
  el('#rapPeriode').innerHTML = opties.map((o, i) => `<option value="${o.id}"${i === 0 ? ' selected' : ''}>${htmlEsc(o.label)}</option>`).join('');
  const projecten = [...new Set(State.werkpakketten.map((w) => w.project))].sort();
  el('#rapScopeKeuze').innerHTML = `<option value="portfolio">Hele portfolio</option>` +
    projecten.map((p) => `<option value="${htmlEsc(p)}">${htmlEsc(p)}</option>`).join('');
}

/* --------------- Rapport: bereken cijfers (terug- & vooruit) ------------- */
function bouwRapportData(scope, van, tot, label) {
  const wps = scope === 'portfolio' ? State.werkpakketten : State.werkpakketten.filter((w) => w.project === scope);
  const s = statsVoor(wps);

  const telling = { open: 0, bezig: 0, gereed: 0, geblokkeerd: 0, nvt: 0 };
  wps.forEach((w) => { const v = State.voortgang[w.id] || {}; FASES.forEach((f) => f.activiteiten.forEach((a) => { telling[(v[a.code] && v[a.code].status) || 'open']++; })); });

  const mpPeriode = [];
  wps.forEach((w) => MIJLPALEN.forEach((m) => {
    const d = parseDatum(w.mijlpalen[m.key]);
    if (d && d >= van && d <= tot) {
      const fase = FASES.find((f) => f.eindMijlpaal === m.key);
      let status = 'gepland';
      if (d <= VANDAAG) {
        if (fase) { const fv = faseVoortgang(w, fase); status = fv.pct >= 100 ? 'behaald' : `nog ${fv.pct}% gereed`; }
        else status = 'gepasseerd';
      }
      mpPeriode.push({ wp: `${w.project} · ${w.wp}`, mijlpaal: m.label, datum: fmtDatum(d), status });
    }
  }));

  const snapVoor = snapshotVoor(isoDatum(van));
  const snapNa = snapshotVoor(isoDatum(tot < VANDAAG ? tot : VANDAAG));
  let voortgangsDelta = null;
  if (snapVoor && snapNa && snapVoor.datum !== snapNa.datum) {
    const a = scope === 'portfolio' ? snapVoor.pct : (snapVoor.perProject[scope] ?? null);
    const b = scope === 'portfolio' ? snapNa.pct : (snapNa.perProject[scope] ?? null);
    if (a != null && b != null) voortgangsDelta = { vanPct: a, naarPct: b, deltaPct: b - a, vanDatum: snapVoor.datum, naarDatum: snapNa.datum };
  }

  const horizonTot = new Date(Math.max(tot.getTime(), VANDAAG.getTime()));
  horizonTot.setDate(horizonTot.getDate() + 45);
  const mpKomend = [];
  wps.forEach((w) => MIJLPALEN.forEach((m) => {
    const d = parseDatum(w.mijlpalen[m.key]);
    if (d && d > VANDAAG && d <= horizonTot) mpKomend.push({ wp: `${w.project} · ${w.wp}`, mijlpaal: m.label, datum: fmtDatum(d), dagen: dagenVerschil(VANDAAG, d) });
  }));
  mpKomend.sort((a, b) => a.dagen - b.dagen);

  const taken = komendeTaken(wps, horizonTot);
  const kritiek = taken.filter((t) => t.ernst >= 3).slice(0, 25).map((t) => ({
    wp: `${t.wp.project} · ${t.wp.wp}`, activiteit: `${t.activiteit.code} ${t.activiteit.naam}`,
    fase: t.fase.naam, reden: t.overtijd ? 'fase over einddatum' : (t.status === 'geblokkeerd' ? 'geblokkeerd' : 'doorlooptijd past niet meer'),
    faseEind: fmtDatum(t.faseEind),
  }));
  const gevaar = taken.filter((t) => t.ernst === 2).slice(0, 25).map((t) => ({
    wp: `${t.wp.project} · ${t.wp.wp}`, activiteit: `${t.activiteit.code} ${t.activiteit.naam}`, fase: t.fase.naam, spelingWd: t.speling, faseEind: fmtDatum(t.faseEind),
  }));

  const perProject = [...new Set(wps.map((w) => w.project))].sort().map((p) => {
    const ps = statsVoor(wps.filter((w) => w.project === p));
    return { project: p, werkpakketten: ps.aantal, apds: ps.apds.length, voortgang: ps.pct, kritiek: ps.kritiek, risico: ps.gevaar };
  });

  return {
    scope, label, peildatum: fmtDatum(VANDAAG),
    periode: { van: fmtDatum(van), tot: fmtDatum(tot) },
    kerncijfers: { werkpakketten: s.aantal, projecten: [...new Set(wps.map((w) => w.project))].length, apds: s.apds.length, kmNieuwTrace: +(s.meters / 1000).toFixed(1), gemVoortgangPct: s.pct, kritiekeWerkpakketten: s.kritiek, risicoWerkpakketten: s.gevaar, geblokkeerdeActiviteiten: telling.geblokkeerd },
    statusverdelingActiviteiten: telling,
    faseverdeling: s.faseTeller,
    voortgangsontwikkeling: voortgangsDelta,
    terugblik: { mijlpalenInPeriode: mpPeriode },
    vooruitblik: { naderendeMijlpalen: mpKomend.slice(0, 25), kritiekeTaken: kritiek, risicoTaken: gevaar },
    registers: registerRapportData(scope),
    perProject,
  };
}

function rapportPrompt(data) {
  const system = `Je bent een ervaren projectbeheerser/PMO-adviseur bij netbeheerder-aannemer HVP. Je schrijft heldere, zakelijke Nederlandstalige management­rapportages over de bouwteamfase "Nulelie" (engineering van ondergrondse kabelverbindingen). De hiërarchie is Project ▸ APD ▸ Werkpakket.

Schrijf in Markdown. Gebruik UITSLUITEND de aangeleverde cijfers en feiten — verzin geen getallen, namen of mijlpalen. Waar gegevens ontbreken, benoem dat kort. Wees concreet en stuurgericht: benoem waar het goed gaat, waar het risico loopt en wat de komende periode concreet moet gebeuren.

Verplichte structuur:
# <titel met scope en periode>
## Samenvatting   (3-5 kernzinnen voor het management)
## Terugblik afgelopen periode   (mijlpalen die gepland stonden en hun status; voortgangsontwikkeling indien beschikbaar)
## Voortgang & KPI's   (kerncijfers; gebruik een korte Markdown-tabel)
## Risico's & kritieke punten   (kritieke/risicovolle werkpakketten en taken; betrek het risico-register (top-risico's met score) en vergunningen/ZRO die over de besluitdatum zijn)
## Vooruitblik komende periode   (naderende mijlpalen, openstaande vergunningen/ZRO en wat er concreet gedaan moet worden)
## Aanbevelingen   (3-6 puntsgewijze, actiegerichte aanbevelingen)

Houd het bondig maar volledig; vermijd holle frasen en herhaling.`;

  const prompt = `Genereer de ${data.label} voor scope "${data.scope === 'portfolio' ? 'het hele portfolio' : data.scope}".

Peildatum (vandaag): ${data.peildatum}
Rapportageperiode: ${data.periode.van} t/m ${data.periode.tot}

Hieronder de in de applicatie berekende cijfers (JSON). Gebruik deze als enige bron:

${JSON.stringify(data, null, 2)}`;

  return { system, prompt };
}

/* ----------------------- Markdown → HTML (compact) ----------------------- */
function markdownNaarHtml(md) {
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const inline = (s) => esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
  const regels = md.replace(/\r/g, '').split('\n');
  let html = '', i = 0;
  while (i < regels.length) {
    let r = regels[i];
    if (/^\s*$/.test(r)) { i++; continue; }
    if (/^#{1,6}\s/.test(r)) { const n = r.match(/^#+/)[0].length; html += `<h${n}>${inline(r.replace(/^#+\s/, ''))}</h${n}>`; i++; continue; }
    if (/^\s*---+\s*$/.test(r)) { html += '<hr>'; i++; continue; }
    if (/\|/.test(r) && i + 1 < regels.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(regels[i + 1])) {
      const kop = r.split('|').map((c) => c.trim()).filter((c) => c.length);
      i += 2; const body = [];
      while (i < regels.length && /\|/.test(regels[i])) {
        body.push(regels[i].split('|').map((c) => c.trim()).filter((c, idx, arr) => !(idx === 0 && c === '') && !(idx === arr.length - 1 && c === '')));
        i++;
      }
      html += '<table><thead><tr>' + kop.map((c) => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>' +
        body.map((row) => '<tr>' + row.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table>';
      continue;
    }
    if (/^\s*[-*]\s/.test(r)) { html += '<ul>'; while (i < regels.length && /^\s*[-*]\s/.test(regels[i])) { html += `<li>${inline(regels[i].replace(/^\s*[-*]\s/, ''))}</li>`; i++; } html += '</ul>'; continue; }
    if (/^\s*\d+\.\s/.test(r)) { html += '<ol>'; while (i < regels.length && /^\s*\d+\.\s/.test(regels[i])) { html += `<li>${inline(regels[i].replace(/^\s*\d+\.\s/, ''))}</li>`; i++; } html += '</ol>'; continue; }
    let p = r; i++;
    while (i < regels.length && !/^\s*$/.test(regels[i]) && !/^#{1,6}\s/.test(regels[i]) && !/^\s*[-*]\s/.test(regels[i]) && !/\|/.test(regels[i])) { p += ' ' + regels[i]; i++; }
    html += `<p>${inline(p)}</p>`;
  }
  return html;
}

/* ----------------------------- Rapport draaien --------------------------- */
let rapportAbort = null;
async function genereerRapport() {
  const type = el('#rapType').value;
  const periodeId = el('#rapPeriode').value;
  const scope = el('#rapScopeKeuze').value;
  const opties = periodeOpties(type);
  const periode = opties.find((o) => o.id === periodeId) || opties[0];
  const label = (type === 'maand' ? 'maandrapportage' : 'kwartaalrapportage') + ' — ' + periode.label;

  const data = bouwRapportData(scope, periode.van, periode.tot, label);

  el('#rapMetricPreview').innerHTML = [
    ['Werkpakketten', data.kerncijfers.werkpakketten],
    ['Gem. voortgang', data.kerncijfers.gemVoortgangPct + '%'],
    ['Kritieke WP’s', data.kerncijfers.kritiekeWerkpakketten],
    ['Risico WP’s', data.kerncijfers.risicoWerkpakketten],
    ['Mijlpalen in periode', data.terugblik.mijlpalenInPeriode.length],
    ['Mijlpalen vooruit', data.vooruitblik.naderendeMijlpalen.length],
  ].map(([l, v]) => `<div class="mp"><b>${v}</b><span>${l}</span></div>`).join('');

  const knop = el('#rapGenereer');
  const status = el('#rapAiStatus');
  knop.disabled = true;
  status.innerHTML = '<span class="spinner"></span> Rapportage genereren met ' + State.model() + '…';
  el('#rapportUitvoerKaart').style.display = 'block';
  const doc = el('#rapportDoc');
  doc.innerHTML = '<p class="hint">Bezig met schrijven…</p>';

  if (rapportAbort) rapportAbort.abort();
  rapportAbort = new AbortController();
  const { system, prompt } = rapportPrompt(data);
  try {
    const tekst = await AI.genereer({
      system, prompt, model: State.model(), signal: rapportAbort.signal,
      onDelta: (vol) => { doc.innerHTML = markdownNaarHtml(vol); },
    });
    doc.innerHTML = `<div class="rapport-meta">Gegenereerd op ${new Date().toLocaleString('nl-NL')} · model ${State.model()} · scope ${scope === 'portfolio' ? 'hele portfolio' : scope}</div>` + markdownNaarHtml(tekst);
    status.innerHTML = '<span style="color:#047857;font-weight:600">✓ Rapportage gereed.</span>';
    doc._tekst = tekst;
  } catch (e) {
    status.innerHTML = '';
    doc.innerHTML = `<div class="ai-waarsch">⚠️ <div><strong>Kon de rapportage niet genereren.</strong><br>${htmlEsc(e.message)}<br><span class="hint">Stel <code>ANTHROPIC_API_KEY</code> in als environment variable in Vercel. Lokaal (zonder Vercel) is de AI-service niet beschikbaar; de berekende cijfers hierboven werken wel.</span></div></div>`;
  } finally {
    knop.disabled = false;
  }
}

/* ------------------------------ Instellingen ----------------------------- */
function renderInstellingen() {
  const dInput = el('#instPeildatum');
  if (dInput && document.activeElement !== dInput) dInput.value = isoDatum(VANDAAG);
  const mSel = el('#instModel');
  if (mSel) mSel.value = State.model();
  el('#instSnapLijst').innerHTML = State.snapshots.slice().reverse().map((s) =>
    `<li><span>${fmtDatum(parseDatum(s.datum))} — ${s.pct}% gereed (${s.gereed}/${s.totaal})</span><button class="verwijder" data-d="${s.datum}">verwijderen</button></li>`).join('')
    || '<li class="hint">Nog geen momentopnames vastgelegd.</li>';
  els('#instSnapLijst .verwijder').forEach((b) => b.addEventListener('click', () => {
    State.snapshots = State.snapshots.filter((s) => s.datum !== b.dataset.d); State.bewaar(); renderInstellingen(); renderDashboard();
  }));
}

/* ------------------------------ CSV-import ------------------------------- */
function parseCsv(tekst) {
  const rows = []; let row = [], field = '', inQuotes = false;
  for (let i = 0; i < tekst.length; i++) {
    const c = tekst[i];
    if (inQuotes) { if (c === '"') { if (tekst[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; } else field += c; }
    else { if (c === '"') inQuotes = true; else if (c === ';') { row.push(field); field = ''; } else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; } else if (c === '\r') {} else field += c; }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}
function importeerCsv(tekst) {
  const rows = parseCsv(tekst);
  const headerIdx = rows.findIndex((r) => (r[0] || '').trim().toLowerCase() === 'projectnaam');
  if (headerIdx < 0) throw new Error('Kon de kolomkoppen (rij met "Projectnaam") niet vinden.');
  const header = rows[headerIdx].map((h) => h.replace(/\s+/g, ' ').trim());
  const colIdx = (naam) => header.findIndex((h) => h.toLowerCase() === naam.toLowerCase());
  const cProject = colIdx('Projectnaam'), cApd = colIdx('APD Bouwdeel'), cTrac = colIdx('Liander Tracdeel');
  const cWp = header.findIndex((h) => h.toLowerCase().startsWith('werkpakket'));
  const cStart = colIdx('Trac start'), cEind = colIdx('Trac eind'), cEng = colIdx('Engineer');
  const cLen = header.findIndex((h) => h.toLowerCase().startsWith('lengte nieuw'));
  const cMpw = header.findIndex((h) => h.toLowerCase().startsWith('uitvoering meters'));
  const mCols = {}; MIJLPALEN.forEach((m) => { mCols[m.key] = colIdx(m.csv); });
  const nieuwe = [], gezien = new Set();
  for (let r = headerIdx + 1; r < rows.length; r++) {
    const row = rows[r];
    const project = (row[cProject] || '').trim();
    const wp = (cWp >= 0 ? row[cWp] : '').trim();
    if (!project || !wp) continue;
    const engineer = (cEng >= 0 ? row[cEng] : '').trim();
    const heeftEchteDatum = MIJLPALEN.some((m) => { const d = parseDatum(row[mCols[m.key]]); return d && d.getFullYear() > 1901; });
    if (!heeftEchteDatum && !engineer) continue;
    const mij = {};
    MIJLPALEN.forEach((m) => { const raw = (row[mCols[m.key]] || '').trim(); const d = parseDatum(raw); mij[m.key] = (d && d.getFullYear() > 1901) ? raw : ''; });
    const tracStart = (cStart >= 0 ? row[cStart] : '').trim(), tracEind = (cEind >= 0 ? row[cEind] : '').trim();
    let id = `${project}|${wp}|${tracStart}|${tracEind}`, n = 2;
    while (gezien.has(id)) { id = `${project}|${wp}|${tracStart}|${tracEind}#${n++}`; }
    gezien.add(id);
    nieuwe.push({ id, project, apd: (cApd >= 0 ? row[cApd] : '').trim(), tracdeel: (cTrac >= 0 ? row[cTrac] : '').trim(), wp, tracStart, tracEind, engineer, lengteNieuw: parseInt((cLen >= 0 ? row[cLen] : '').replace(/\D/g, '')) || 0, mPerWeek: parseInt((cMpw >= 0 ? row[cMpw] : '').replace(/\D/g, '')) || 0, mijlpalen: mij });
  }
  if (!nieuwe.length) throw new Error('Geen geldige werkpakket-rijen gevonden.');
  return nieuwe;
}

/* ------------------------------ Tabs / UI -------------------------------- */
function toonTab(naam) {
  els('.tab').forEach((t) => t.classList.toggle('actief', t.dataset.tab === naam));
  els('.view').forEach((v) => v.classList.toggle('actief', v.id === 'view-' + naam));
}

function updateDbStatus(s) {
  const node = el('#dbStatus'), txt = el('#dbStatusTekst');
  node.classList.remove('online', 'offline', 'bezig');
  const map = { online: ['online', 'Neon verbonden'], offline: ['offline', 'Offline (cache)'], bezig: ['bezig', 'Synchroniseren…'], lokaal: ['offline', 'Lokaal (geen DB)'] };
  const [cls, label] = map[s] || map.lokaal;
  node.classList.add(cls);
  txt.textContent = label;
}

/* ------------------------------- Init ------------------------------------ */
async function init() {
  DB.onStatus((s) => updateDbStatus(s));
  await State.laad();
  if (State._moetBewaren) { State.bewaar(); State._moetBewaren = false; }
  registersInit();

  els('.tab').forEach((t) => t.addEventListener('click', () => toonTab(t.dataset.tab)));
  el('#detailClose').addEventListener('click', sluitDetail);
  el('#overlay').addEventListener('click', sluitDetail);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { sluitDetail(); return; }
    // Backspace = één niveau terug in het Overzicht (mits niet in een invoerveld of drawer)
    if (e.key === 'Backspace' && !State.actiefWp) {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
      if (!el('#view-overzicht').classList.contains('actief')) return;
      if (State.filters.apd || State.filters.project) { e.preventDefault(); niveauTerug(); }
    }
  });

  el('#filterProject').addEventListener('change', (e) => { State.filters.project = e.target.value; State.filters.apd = ''; render(); });
  el('#filterApd').addEventListener('change', (e) => { State.filters.apd = e.target.value; render(); });
  el('#filterEngineer').addEventListener('change', (e) => { State.filters.engineer = e.target.value; render(); });
  el('#filterFase').addEventListener('change', (e) => { State.filters.fase = e.target.value; render(); });
  el('#filterRisico').addEventListener('change', (e) => { State.filters.risico = e.target.value; render(); });
  el('#filterZoek').addEventListener('input', (e) => { State.filters.zoek = e.target.value; renderOverzicht(); renderPlanning(); renderTaken(); });
  el('#filterReset').addEventListener('click', () => { State.filters = { project: '', apd: '', engineer: '', fase: '', risico: '', zoek: '' }; State.takenFilter = 'alle'; el('#filterZoek').value = ''; render(); });

  el('#rapType').addEventListener('change', renderRapportenControls);
  el('#rapGenereer').addEventListener('click', genereerRapport);
  el('#rapPrint').addEventListener('click', () => window.print());
  el('#rapKopieer').addEventListener('click', () => {
    const t = el('#rapportDoc')._tekst || el('#rapportDoc').innerText;
    navigator.clipboard.writeText(t).then(() => toast('Rapporttekst gekopieerd', 'ok'));
  });

  el('#instPeildatum').addEventListener('change', (e) => {
    const d = parseDatum(e.target.value); if (!d) return;
    VANDAAG = d; State.instellingen.peildatum = e.target.value; State.bewaar();
    el('#peildatum').textContent = fmtDatum(VANDAAG); render();
  });
  el('#instModel').addEventListener('change', (e) => { State.instellingen.model = e.target.value; State.bewaar(); });
  el('#instSnapshot').addEventListener('click', () => { legSnapshot(); renderInstellingen(); renderDashboard(); toast('Momentopname vastgelegd', 'ok'); });

  el('#csvFile').addEventListener('change', (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const wps = importeerCsv(reader.result);
        State.werkpakketten = wps; State.bewaar();
        State.filters = { project: '', apd: '', engineer: '', fase: '', zoek: '' };
        render();
        el('#importMelding').innerHTML = `<span class="ok">${wps.length} werkpakketten geïmporteerd uit "${htmlEsc(file.name)}".</span>`;
        toast(`${wps.length} werkpakketten geïmporteerd`, 'ok');
        toonTab('overzicht');
      } catch (err) { el('#importMelding').innerHTML = `<span class="fout">Import mislukt: ${htmlEsc(err.message)}</span>`; }
    };
    reader.readAsText(file, 'utf-8'); e.target.value = '';
  });
  el('#btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ werkpakketten: State.werkpakketten, voortgang: State.voortgang, doorlooptijden: State.doorlooptijden, snapshots: State.snapshots, vergunningen: State.vergunningen, risicos: State.risicos }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `hvp-processturing-${isoDatum(new Date())}.json`; a.click();
  });
  el('#jsonFile').addEventListener('change', (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.werkpakketten) State.werkpakketten = data.werkpakketten;
        if (data.voortgang) State.voortgang = data.voortgang;
        if (data.doorlooptijden) State.doorlooptijden = data.doorlooptijden;
        if (data.snapshots) State.snapshots = data.snapshots;
        if (data.vergunningen) State.vergunningen = data.vergunningen;
        if (data.risicos) State.risicos = data.risicos;
        State.bewaar(); render();
        el('#importMelding').innerHTML = `<span class="ok">Werkbestand hersteld.</span>`;
        toast('Werkbestand hersteld', 'ok'); toonTab('overzicht');
      } catch (err) { el('#importMelding').innerHTML = `<span class="fout">Kon JSON niet lezen: ${htmlEsc(err.message)}</span>`; }
    };
    reader.readAsText(file, 'utf-8'); e.target.value = '';
  });
  el('#btnSeed').addEventListener('click', () => {
    if (!confirm('Voorbeelddata laden? Huidige werkpakketten worden vervangen. Voortgang blijft bewaard.')) return;
    State.werkpakketten = (window.SEED_WERKPAKKETTEN || []).map((w) => ({ ...w })); State.bewaar(); render(); toonTab('overzicht');
  });
  el('#btnDemo').addEventListener('click', () => {
    if (!confirm('Realistische voorbeeldvoortgang genereren voor alle werkpakketten? Bestaande statussen worden overschreven.')) return;
    State.voortgang = genereerDemoVoortgang(State.werkpakketten); State.bewaar(); render(); toonTab('dashboard');
    toast('Realistische voortgang gegenereerd', 'ok');
  });
  el('#btnWis').addEventListener('click', async () => {
    if (!confirm('ALLE data, voortgang en momentopnames wissen — ook in de database? Dit kan niet ongedaan gemaakt worden.')) return;
    localStorage.removeItem(CACHE_KEY);
    await DB.wisNeon();
    State.werkpakketten = (window.SEED_WERKPAKKETTEN || []).map((w) => ({ ...w }));
    State.voortgang = {}; State.doorlooptijden = {}; State.snapshots = []; State.vergunningen = []; State.risicos = [];
    State.bewaar(); render(); toonTab('overzicht'); toast('Alles gewist', 'ok');
  });

  DB.serverStatus().then((st) => {
    const node = el('#instDbInfo');
    if (node) node.innerHTML = `Database <strong style="color:${st.database ? '#047857' : '#b45309'}">${st.database ? 'gekoppeld' : 'niet ingesteld'}</strong> · AI <strong style="color:${st.ai ? '#047857' : '#b45309'}">${st.ai ? 'beschikbaar' : 'niet ingesteld'}</strong>`;
  });

  el('#peildatum').textContent = fmtDatum(VANDAAG);
  render();
  toonTab('overzicht');
}

document.addEventListener('DOMContentLoaded', init);
