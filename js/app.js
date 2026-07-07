/* ==========================================================================
   HVP Procesturing — besturing van de bouwteamfase Nulelie
   Hiërarchie: Project ▸ APD ▸ Werkpakket. Data via Neon (db.js) met
   localStorage-cache. AI-rapportages via ai.js.
   ========================================================================== */

'use strict';

const STATUSSEN = {
  open:        { label: 'Niet gestart', kleur: '#94a3b8' },
  bezig:       { label: 'Lopend',       kleur: '#0ea5e9' },
  vertraagd:   { label: 'Vertraagd',    kleur: '#f59e0b' },
  issue:       { label: 'Issue',        kleur: '#dc2626' },
  geblokkeerd: { label: 'Geblokkeerd',  kleur: '#7c3aed' },
  gereed:      { label: 'Gereed',       kleur: '#10b981' },
  nvt:         { label: 'N.v.t.',       kleur: '#cbd5e1' },
};
// Probleemstatussen (tellen als risico/blokkade in signalen en dashboard).
const PROBLEEM_STATUS = ['geblokkeerd', 'issue'];

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
  gebruikers: {},
  toewijzingen: {},
  activiteitInfo: {},
  tsb: { formats: [], projecten: [], instellingen: {} },
  tolgates: [],
  tolgateInstances: [],
  filters: { project: '', apd: '', engineer: '', fase: '', risico: '', zoek: '' },
  actiefWp: null,
  horizon: '30',
  mijnHorizon: '7',
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
    this.gebruikers = staat.gebruikers || {};
    this.toewijzingen = staat.toewijzingen || {};
    this.activiteitInfo = staat.activiteitInfo || {};
    this.tsb = staat.tsb || { formats: [], projecten: [], instellingen: {} };
    // Tolgate-definities: seed T1–T4 zolang er nog geen zijn vastgelegd.
    this.tolgates = (staat.tolgates && staat.tolgates.length)
      ? staat.tolgates
      : JSON.parse(JSON.stringify(window.STANDAARD_TOLGATES || []));
    this.tolgateInstances = staat.tolgateInstances || [];
    const verseSeed = !(staat.werkpakketten && staat.werkpakketten.length);
    this.werkpakketten = verseSeed ? (window.SEED_WERKPAKKETTEN || []) : staat.werkpakketten;
    // Verse start: ook de statussen uit de planning meeladen.
    if (verseSeed && Object.keys(this.voortgang).length === 0 && window.SEED_VOORTGANG) {
      this.voortgang = JSON.parse(JSON.stringify(window.SEED_VOORTGANG));
    }
    if (this.instellingen.peildatum) {
      const d = parseDatum(this.instellingen.peildatum);
      if (d) VANDAAG = d;
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
      gebruikers: this.gebruikers,
      toewijzingen: this.toewijzingen,
      activiteitInfo: this.activiteitInfo,
      tsb: this.tsb,
      tolgates: this.tolgates,
      tolgateInstances: this.tolgateInstances,
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

/* ----------------------- Stapondersteuning (info) ------------------------ */
// Samengevoegde stapinfo: standaardteksten uit activiteiten.js, eventueel
// overschreven via de Activiteitenbibliotheek (State.activiteitInfo).
function actInfo(code) {
  const basis = ACTIVITEIT_INDEX[code] ? ACTIVITEIT_INDEX[code].activiteit : {};
  const over = State.activiteitInfo[code] || {};
  return {
    omschrijving: over.omschrijving ?? basis.omschrijving ?? '',
    oplevering: over.oplevering ?? basis.oplevering ?? [],
    tip: over.tip ?? basis.tip ?? '',
    aangepast: over.omschrijving != null || over.oplevering != null || over.tip != null,
  };
}
// Hulpblok bij een stap: omschrijving, op te leveren producten en tip.
function actHulpHtml(code, { metOmschrijving = true } = {}) {
  const info = actInfo(code);
  const delen = [];
  if (metOmschrijving && info.omschrijving) delen.push(`<div class="act-omschr">${htmlEsc(info.omschrijving)}</div>`);
  if (info.oplevering.length) delen.push(`<div class="act-oplever"><span class="act-oplever-kop">📦 Op te leveren</span><ul>${
    info.oplevering.map((o) => `<li>${htmlEsc(o)}</li>`).join('')}</ul></div>`);
  if (info.tip) delen.push(`<div class="act-tip">💡 ${htmlEsc(info.tip)}</div>`);
  return delen.join('');
}

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
  let totaal = 0, klaar = 0, geblokkeerd = 0, bezig = 0, vertraagd = 0, issue = 0;
  FASES.forEach((f) => f.activiteiten.forEach((a) => {
    const st = (v[a.code] && v[a.code].status) || 'open';
    if (st === 'nvt') return;
    totaal++;
    if (st === 'gereed') klaar++;
    if (st === 'geblokkeerd') geblokkeerd++;
    if (st === 'issue') issue++;
    if (st === 'vertraagd') vertraagd++;
    if (st === 'bezig') bezig++;
  }));
  // 'geblokkeerd' = blokkades én issues (probleemactiviteiten)
  return { totaal, klaar, geblokkeerd: geblokkeerd + issue, geblok: geblokkeerd, issue, vertraagd, bezig, pct: totaal ? Math.round((klaar / totaal) * 100) : 0 };
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
  const geblok = Object.entries(v).filter(([, o]) => PROBLEEM_STATUS.includes(o.status)).map(([c]) => c);
  if (geblok.length) sig.push({ type: 'geblokkeerd', ernst: 3, tekst: `${geblok.length} geblokkeerde activiteit(en) / issue(s)`, codes: geblok });
  const vertr = Object.entries(v).filter(([, o]) => o.status === 'vertraagd').map(([c]) => c);
  if (vertr.length) sig.push({ type: 'vertraagd', ernst: 2, tekst: `${vertr.length} vertraagde activiteit(en)`, codes: vertr });
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
  const boringen = wps.reduce((s, w) => s + (+w.boringen || 0), 0);
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
    wps, aantal: wps.length, meters, boringen,
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
        if (st === 'geblokkeerd' || st === 'issue') { ernst = 3; flags.push(st); }
        else if (st === 'vertraagd') { ernst = Math.max(ernst, 2); flags.push('vertraagd'); }
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
  renderFilterIndicator();
  renderOverzicht();
  renderPlanning();
  renderTaken();
  renderVergunningen();
  renderRisicos();
  if (typeof renderTsb === 'function') renderTsb();
  renderDashboard();
  renderRapportenControls();
  renderActiviteiten();
  renderDoorlooptijden();
  renderInstellingen();
  if (typeof renderMijnProjecten === 'function') renderMijnProjecten();
  if (typeof renderMijnTaken === 'function') renderMijnTaken();
  if (typeof renderToewijzen === 'function') renderToewijzen();
  if (typeof renderAccounts === 'function') renderAccounts();
  if (State.actiefWp) renderDetail(State.actiefWp);
}

// Schakel bewerk-elementen aan/uit op basis van de rol (handhaving in de UI).
function gateUI() {
  const vol = !window.Auth || Auth.magVolledig();
  ['#csvFile', '#jsonFile', '#btnSeed', '#btnWis', '#instSnapshot', '#instPeildatum', '#instModel'].forEach((s) => {
    const n = el(s); if (n) n.disabled = !vol;
  });
  document.querySelectorAll('.filebtn').forEach((l) => l.classList.toggle('uit', !vol));
  ['#vgToevoegen', '#riskToevoegen'].forEach((s) => { const n = el(s); if (n) n.style.display = vol ? '' : 'none'; });
  const setTab = (naam, zicht) => { const t = document.querySelector(`.tab[data-tab="${naam}"]`); if (t) t.style.display = zicht ? '' : 'none'; };
  setTab('toewijzen', !window.Auth || Auth.magToewijzen());
  setTab('accounts', !window.Auth || Auth.magAccounts());
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

const RISICO_LABELS = { kritiek: 'Alleen kritiek', gevaar: 'Alleen risico', geblok: 'Met geblokkeerde activiteiten', opkoers: 'Alleen op koers' };
// Toont op elk scherm welke filters actief zijn, met losse verwijder-knoppen.
function renderFilterIndicator() {
  const f = State.filters;
  const chips = [];
  if (f.project) chips.push(['project', `Project: ${f.project}`]);
  if (f.apd) chips.push(['apd', `APD: ${f.apd}`]);
  if (f.engineer) chips.push(['engineer', `Engineer: ${f.engineer}`]);
  if (f.fase) { const fa = FASES.find((x) => x.id === f.fase); chips.push(['fase', `Fase: ${fa ? fa.naam : f.fase}`]); }
  if (f.risico) chips.push(['risico', RISICO_LABELS[f.risico] || f.risico]);
  if (f.zoek) chips.push(['zoek', `Zoek: "${f.zoek}"`]);
  const node = el('#filterIndicator');
  if (!chips.length) { node.classList.remove('actief'); node.innerHTML = ''; return; }
  node.classList.add('actief');
  node.innerHTML = `<span class="fi-label">🔍 Actief filter:</span>` +
    chips.map(([k, l]) => `<span class="fi-chip" data-k="${k}">${htmlEsc(l)}<button title="Verwijder dit filter" aria-label="Verwijder">×</button></span>`).join('') +
    `<button class="fi-wis">Alle filters wissen</button>`;
  els('#filterIndicator .fi-chip').forEach((c) => c.querySelector('button').addEventListener('click', () => {
    const k = c.dataset.k;
    State.filters[k] = '';
    if (k === 'zoek') el('#filterZoek').value = '';
    if (k === 'project') State.filters.apd = '';
    render();
  }));
  el('#filterIndicator .fi-wis').addEventListener('click', () => {
    State.filters = { project: '', apd: '', engineer: '', fase: '', risico: '', zoek: '' };
    el('#filterZoek').value = ''; render();
  });
}

/* ----------------------- Overzicht (hiërarchie) -------------------------- */
// Eén stap terug: eerst inhoudsfilters wissen, daarna door de hiërarchie omhoog.
function niveauTerug() {
  const f = State.filters;
  if (f.risico || f.engineer || f.fase || f.zoek) {
    f.risico = ''; f.engineer = ''; f.fase = ''; f.zoek = ''; el('#filterZoek').value = '';
    render(); return;
  }
  if (f.apd) f.apd = '';
  else if (f.project) f.project = '';
  else return;
  render();
}

function renderOverzicht() {
  const wps = gefilterdeWerkpakketten();
  const f = State.filters;
  const contentFilter = !!(f.risico || f.engineer || f.fase || f.zoek);
  const niveau = contentFilter ? 'wps' : (!f.project ? 'projecten' : (!f.apd ? 'apds' : 'wps'));

  const kruimels = [];
  if (niveau !== 'projecten' || contentFilter) {
    const terugLabel = contentFilter ? '← Filter wissen' : (f.apd ? '← Terug naar APD’s' : '← Terug naar projecten');
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
  const f = State.filters;
  const contentFilter = !!(f.risico || f.engineer || f.fase || f.zoek);
  const terugLabel = contentFilter ? '← Filter wissen' : '← Terug naar APD’s';
  const balkTekst = f.apd ? `Niveau 3 · Werkpakketten in APD ${htmlEsc(f.apd)}` : 'Gefilterde werkpakketten';
  el('#hierInhoud').innerHTML = `
    <div class="niveau-rij"><button class="terug-knop" data-niveau="terug">${terugLabel}</button><span class="niveau-balk">${balkTekst}</span></div>
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
  const geblok = taken.filter((t) => t.status === 'geblokkeerd' || t.status === 'issue');
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
  bindTaakHulp('#takenLijst');
}

// Klik op "ℹ︎ Wat houdt deze stap in?" klapt de stapondersteuning uit
// zonder de detail-drawer te openen. Ook gebruikt door "Mijn projecten".
function bindTaakHulp(containerSel) {
  els(containerSel + ' .taak-info-knop').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = b.parentElement.querySelector('.taak-hulp').classList.toggle('open');
    b.setAttribute('aria-expanded', open);
  }));
}

function taakKaart(t) {
  const w = t.wp;
  const dagen = dagenVerschil(VANDAAG, t.faseEind);
  const deadlineTxt = t.overtijd
    ? `<span style="color:var(--rood)">${Math.abs(dagen)}d over deadline</span>`
    : `nog <b>${dagen}d</b> tot fase-eind`;
  const vlaggen = t.flags.map((f) => `<span class="tflag ${f}">${f}</span>`).join('');
  const stKleur = STATUSSEN[t.status].kleur;
  const hulp = actHulpHtml(t.activiteit.code);
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
      ${hulp ? `<button class="taak-info-knop" type="button" aria-expanded="false">ℹ︎ Wat houdt deze stap in?</button><div class="taak-hulp">${hulp}</div>` : ''}
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
  const magBew = !window.Auth || Auth.magWpBewerken(w.id);
  renderDetailProces(w, hf, magBew);
  el('#detailKengetallen').innerHTML = `<label class="keng-veld" for="detailBoringen">Aantal boringen
    <input id="detailBoringen" type="number" min="0" step="1" inputmode="numeric" value="${w.boringen != null ? +w.boringen : ''}" placeholder="0"${magBew ? '' : ' disabled'}></label>`;
  const boringenInp = el('#detailBoringen');
  if (boringenInp && magBew) boringenInp.addEventListener('change', (e) => {
    if (window.Auth && !Auth.magWpBewerken(w.id)) return;
    const n = parseInt(e.target.value, 10);
    w.boringen = Number.isFinite(n) && n >= 0 ? n : 0;
    e.target.value = w.boringen;
    State.bewaar(); renderDashboard();
  });
  el('#detailRegisters').innerHTML = (magBew ? '' : leesAlleenBanner(w)) + detailRegistersHtml(w);
  bindDetailRegisters(w);
  const dis = magBew ? '' : ' disabled';
  el('#detailFasen').innerHTML = FASES.map((f) => {
    const fv = faseVoortgang(w, f);
    const open = (hf.fase && hf.fase.id === f.id) ? ' open' : '';
    const items = f.activiteiten.map((a) => {
      const cur = (v[a.code] && v[a.code].status) || 'open';
      const notitie = (v[a.code] && v[a.code].notitie) || '';
      const opts = Object.entries(STATUSSEN).map(([k, o]) => `<option value="${k}"${k === cur ? ' selected' : ''}>${o.label}</option>`).join('');
      return `<div class="act ${cur}" data-act="${htmlEsc(a.code)}">
        <div class="act-top"><input type="checkbox" class="act-check" data-wp="${htmlEsc(w.id)}" data-code="${htmlEsc(a.code)}" title="${cur === 'gereed' ? 'Afgevinkt — klik om terug te zetten' : 'Vink af als gereed'}"${cur === 'gereed' ? ' checked' : ''}${dis}>
        <span class="act-code">${htmlEsc(a.code)}</span><span class="act-naam">${htmlEsc(a.naam)}</span>
        <select class="act-status" data-wp="${htmlEsc(w.id)}" data-code="${htmlEsc(a.code)}" style="--c:${STATUSSEN[cur].kleur}"${dis}>${opts}</select></div>
        ${actHulpHtml(a.code)}
        <input class="act-notitie" data-wp="${htmlEsc(w.id)}" data-code="${htmlEsc(a.code)}" placeholder="Notitie / actie…" value="${htmlEsc(notitie)}"${dis}></div>`;
    }).join('');
    const sch = faseSchema(w, f);
    const budget = sch ? `<div class="fbudget ${sch.overschrijding ? 'krap' : ''}">Venster ${fmtDatum(sch.start)} → ${fmtDatum(sch.eind)} · <strong>${sch.beschikbaar}</strong> werkdagen beschikbaar · som doorlooptijden <strong>${sch.benodigd}</strong> wd ${sch.overschrijding ? '<span class="waarsch">parallel werk nodig</span>' : '<span class="ok">ruim</span>'}</div>` : '';
    return `<details class="fblock" data-fase="${f.id}"${open}>
      <summary style="--c:${f.kleur}"><span class="fnaam">${htmlEsc(f.code)} ${htmlEsc(f.naam)}</span>
        <span class="fbar"><span style="width:${fv.pct}%;background:${f.kleur}"></span></span><span class="fpct">${fv.klaar}/${fv.totaal}</span></summary>
      <div class="fomschr">${htmlEsc(f.omschrijving)}</div>${budget}${items}</details>`;
  }).join('');
  els('#detailFasen .act-status').forEach((sl) => sl.addEventListener('change', (e) => {
    const { wp, code } = e.target.dataset;
    if (window.Auth && !Auth.magWpBewerken(wp)) return;
    State.wpVoortgang(wp)[code] = Object.assign(State.wpVoortgang(wp)[code] || {}, { status: e.target.value });
    State.bewaar(); renderDetail(wp); renderOverzicht(); renderTaken(); renderDashboard();
  }));
  els('#detailFasen .act-check').forEach((c) => c.addEventListener('change', (e) => {
    const { wp, code } = e.target.dataset;
    if (window.Auth && !Auth.magWpBewerken(wp)) return;
    State.wpVoortgang(wp)[code] = Object.assign(State.wpVoortgang(wp)[code] || {}, { status: e.target.checked ? 'gereed' : 'open' });
    State.bewaar(); renderDetail(wp); renderOverzicht(); renderTaken(); renderDashboard();
  }));
  els('#detailFasen .act-notitie').forEach((inp) => inp.addEventListener('change', (e) => {
    const { wp, code } = e.target.dataset;
    if (window.Auth && !Auth.magWpBewerken(wp)) return;
    State.wpVoortgang(wp)[code] = Object.assign(State.wpVoortgang(wp)[code] || {}, { notitie: e.target.value });
    State.bewaar();
  }));
}

/* --------------- Procesoverzicht in het detail (fase-stepper) ------------- */
// De eerstvolgende processtap: eerst een lopende activiteit, anders de eerste
// openstaande stap in de huidige planningsfase, anders de eerste openstaande.
function volgendeStap(w) {
  const v = State.voortgang[w.id] || {};
  const alle = [];
  FASES.forEach((fase) => fase.activiteiten.forEach((activiteit) =>
    alle.push({ fase, activiteit, status: (v[activiteit.code] && v[activiteit.code].status) || 'open' })));
  const staatOpen = (x) => x.status !== 'gereed' && x.status !== 'nvt';
  const bezig = alle.find((x) => x.status === 'bezig');
  if (bezig) return bezig;
  const hf = huidigeFase(w);
  if (hf.fase) {
    const inFase = alle.find((x) => x.fase.id === hf.fase.id && staatOpen(x));
    if (inFase) return inFase;
  }
  return alle.find(staatOpen) || null;
}

function renderDetailProces(w, hf, magBew) {
  const cont = el('#detailProces');
  if (!cont) return;
  const av = activiteitVoortgang(w);
  const stap = volgendeStap(w);

  const stappen = FASES.map((f, i) => {
    const fv = faseVoortgang(w, f);
    const af = fv.totaal > 0 && fv.klaar >= fv.totaal;
    const huidig = !af && hf.fase && hf.fase.id === f.id;
    const cls = af ? 'afgerond' : huidig ? 'huidig' : 'komend';
    return `<button type="button" class="fstap ${cls}" data-fase="${f.id}" style="--c:${f.kleur}"
      title="${htmlEsc(f.naam)}: ${fv.klaar} van ${fv.totaal} stappen gereed — klik om de checklist van deze fase te openen">
      <span class="fstap-dot">${af ? '✓' : i + 1}</span>
      <span class="fstap-naam">${htmlEsc(f.naam)}</span>
      <span class="fstap-tel">${fv.klaar}/${fv.totaal} stappen</span>
      ${huidig ? '<span class="fstap-badge">hier zijn we</span>' : ''}
    </button>`;
  }).join('');

  const vsHtml = stap
    ? `<div class="volgende-stap">
        <button type="button" class="vs-tekst" title="Toon deze stap in de checklist hieronder">
          <span class="vs-label">Volgende stap · ${htmlEsc(stap.fase.naam)}</span>
          <b>${htmlEsc(stap.activiteit.code)} — ${htmlEsc(stap.activiteit.naam)}</b>
        </button>
        ${magBew ? '<button type="button" class="vs-vink">✓ Vink af als gereed</button>' : ''}
      </div>`
    : `<div class="volgende-stap klaar">🎉 Alle processtappen van dit werkpakket zijn afgevinkt (${av.klaar}/${av.totaal}).</div>`;

  cont.innerHTML = `<div class="proces-kaart">
    <div class="proces-kop"><span class="pk-label">Waar staan we in het proces?</span>
      <span class="pk-voortgang"><b>${av.klaar}/${av.totaal}</b> stappen gereed · ${av.pct}%</span></div>
    <div class="proces-voortgangsbalk"><span style="width:${av.pct}%"></span></div>
    <div class="fase-stepper">${stappen}</div>
    ${vsHtml}</div>`;

  // Navigatie: klik op een fase of op de volgende stap → open de checklist daar.
  const gaNaar = (faseId, code) => {
    const blok = el(`#detailFasen .fblock[data-fase="${faseId}"]`);
    if (!blok) return;
    blok.open = true;
    let doel = blok;
    if (code) {
      const act = blok.querySelector(`.act[data-act="${code}"]`);
      if (act) { doel = act; act.classList.add('act-focus'); setTimeout(() => act.classList.remove('act-focus'), 1800); }
    }
    doel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  cont.querySelectorAll('.fstap').forEach((b) => b.addEventListener('click', () => gaNaar(b.dataset.fase)));
  const vsTekst = cont.querySelector('.vs-tekst');
  if (vsTekst && stap) vsTekst.addEventListener('click', () => gaNaar(stap.fase.id, stap.activiteit.code));
  const vsVink = cont.querySelector('.vs-vink');
  if (vsVink && stap) vsVink.addEventListener('click', () => {
    if (window.Auth && !Auth.magWpBewerken(w.id)) return;
    State.wpVoortgang(w.id)[stap.activiteit.code] = Object.assign(State.wpVoortgang(w.id)[stap.activiteit.code] || {}, { status: 'gereed' });
    State.bewaar(); renderDetail(w.id); renderOverzicht(); renderTaken(); renderDashboard();
  });
}

function leesAlleenBanner(w) {
  const toegew = window.Auth && Auth.magToewijzen();
  return `<div class="lees-alleen">🔒 Alleen-lezen — je bent niet toegewezen aan dit werkpakket.${
    toegew ? ' Wijs jezelf toe via <strong>Toewijzen</strong> om te kunnen bewerken.' : ''}</div>`;
}

/* --------------------------- Activiteiten-ref ---------------------------- */
function renderActiviteiten() {
  const magBew = !window.Auth || Auth.magVolledig();
  el('#refBody').innerHTML = FASES.map((f) => `
    <section class="ref-fase">
      <h3 style="--c:${f.kleur}">${htmlEsc(f.code)} ${htmlEsc(f.naam)}</h3>
      <p class="ref-omschr">${htmlEsc(f.omschrijving)}</p>
      <table class="ref-tabel"><tbody>
        ${f.activiteiten.map((a) => {
          const info = actInfo(a.code);
          return `<tr><td class="rc">${htmlEsc(a.code)}</td><td>
            <div class="ref-kop-rij"><strong>${htmlEsc(a.naam)}</strong>${info.aangepast ? '<span class="aangepast">aangepast</span>' : ''}${
              magBew ? `<button class="ref-bewerk" data-code="${htmlEsc(a.code)}" title="Stapinformatie aanpassen">✎ Bewerken</button>` : ''}</div>
            <div class="sub">${htmlEsc(info.omschrijving)}</div>
            ${actHulpHtml(a.code, { metOmschrijving: false })}
          </td></tr>`;
        }).join('')}
      </tbody></table></section>`).join('');
  els('#refBody .ref-bewerk').forEach((b) => b.addEventListener('click', () => openStapInfoModal(b.dataset.code)));
}

// Configuratie van de stapondersteuning: omschrijving, op te leveren en tip
// per activiteit aanpassen. Alleen afwijkingen t.o.v. de standaardteksten
// worden bewaard (in State.activiteitInfo), zodat standaard-updates blijven doorkomen.
function openStapInfoModal(code) {
  if (window.Auth && !Auth.magVolledig()) return;
  const basis = ACTIVITEIT_INDEX[code].activiteit;
  const info = actInfo(code);
  openModal(`${code} · ${basis.naam}`, `
    <p class="hint" style="margin-bottom:14px">Deze teksten ondersteunen het team bij deze stap en verschijnen in de werkpakket-checklist, de takenlijst en de bibliotheek. Aanpassingen worden voor iedereen bewaard.</p>
    <div class="modal-veld"><label>Wat houdt deze stap in?</label><textarea id="siOmschr" rows="3">${htmlEsc(info.omschrijving)}</textarea></div>
    <div class="modal-veld"><label>Op te leveren — één product per regel</label><textarea id="siOplever" rows="4" placeholder="bijv. Ingevuld intakeformulier">${htmlEsc(info.oplevering.join('\n'))}</textarea></div>
    <div class="modal-veld"><label>Tip / aanpak</label><textarea id="siTip" rows="2" placeholder="Praktische hint voor wie deze stap uitvoert…">${htmlEsc(info.tip)}</textarea></div>
    <div class="modal-foot">
      ${info.aangepast ? '<button class="verwijder-knop" id="siStandaard">Standaardtekst herstellen</button>' : ''}
      <button class="ghost" id="siAnnuleer">Annuleren</button>
      <button class="primair" id="siBewaar">Bewaren</button>
    </div>`);
  const naOpslaan = () => {
    State.bewaar(); sluitModal(); renderActiviteiten(); renderTaken();
    if (State.actiefWp) renderDetail(State.actiefWp);
    if (typeof renderMijnProjecten === 'function') renderMijnProjecten();
  };
  el('#siAnnuleer').addEventListener('click', sluitModal);
  const st = el('#siStandaard');
  if (st) st.addEventListener('click', () => {
    delete State.activiteitInfo[code];
    naOpslaan(); toast('Standaardtekst hersteld', 'ok');
  });
  el('#siBewaar').addEventListener('click', () => {
    const omschr = el('#siOmschr').value.trim();
    const oplever = el('#siOplever').value.split('\n').map((r) => r.trim()).filter(Boolean);
    const tip = el('#siTip').value.trim();
    const over = {};
    if (omschr !== (basis.omschrijving || '')) over.omschrijving = omschr;
    if (oplever.join('\n') !== (basis.oplevering || []).join('\n')) over.oplevering = oplever;
    if (tip !== (basis.tip || '')) over.tip = tip;
    if (Object.keys(over).length) State.activiteitInfo[code] = over;
    else delete State.activiteitInfo[code];
    naOpslaan(); toast('Stapinformatie bijgewerkt', 'ok');
  });
}

/* --------------------------- Doorlooptijden ------------------------------ */
function renderDoorlooptijden() {
  el('#dtBody').innerHTML = FASES.map((f) => {
    const rows = f.activiteiten.map((a) => {
      const eff = State.getDt(a.code);
      const aangepast = State.doorlooptijden[a.code] != null && State.doorlooptijden[a.code] !== '';
      const dis = (!window.Auth || Auth.magVolledig()) ? '' : ' disabled';
      return `<tr><td class="rc">${htmlEsc(a.code)}</td><td>${htmlEsc(a.naam)}</td>
        <td class="num"><input type="number" min="0" class="dt-inp" data-code="${htmlEsc(a.code)}" value="${eff}"${dis}></td>
        <td class="num sub">${a.dtDefault}${aangepast ? ' <span class="aangepast">aangepast</span>' : ''}</td></tr>`;
    }).join('');
    const somDef = f.activiteiten.reduce((s, a) => s + a.dtDefault, 0);
    const somEff = f.activiteiten.reduce((s, a) => s + State.getDt(a.code), 0);
    return `<section class="dt-fase"><h3 style="--c:${f.kleur}">${htmlEsc(f.code)} ${htmlEsc(f.naam)} <span class="dt-som">totaal ${somEff} werkdagen${somEff!==somDef?` (standaard ${somDef})`:''}</span></h3>
      <table class="ref-tabel dt-tabel"><thead><tr><th>Code</th><th>Activiteit</th><th class="num">Doorlooptijd (wd)</th><th class="num">Standaard</th></tr></thead>
      <tbody>${rows}</tbody></table></section>`;
  }).join('');
  els('#dtBody .dt-inp').forEach((inp) => inp.addEventListener('change', (e) => {
    if (window.Auth && !Auth.magVolledig()) return;
    const code = e.target.dataset.code, val = e.target.value.trim();
    if (val === '' || +val === ACTIVITEIT_INDEX[code].activiteit.dtDefault) delete State.doorlooptijden[code];
    else State.doorlooptijden[code] = +val;
    State.bewaar(); renderDoorlooptijden(); renderTaken();
    if (State.actiefWp) renderDetail(State.actiefWp);
  }));
}

/* ---------------------------- Dashboard / KPI ---------------------------- */
function leegTelling() { const t = {}; Object.keys(STATUSSEN).forEach((k) => { t[k] = 0; }); return t; }
function statusMix(set) {
  const t = leegTelling();
  set.forEach((w) => { const v = State.voortgang[w.id] || {}; FASES.forEach((f) => f.activiteiten.forEach((a) => { t[(v[a.code] && v[a.code].status) || 'open']++; })); });
  return t;
}
function voortgangRijHtml(naam, set) {
  const t = statusMix(set);
  const tel = (t.open + t.bezig + t.vertraagd + t.issue + t.gereed + t.geblokkeerd) || 1;
  const pct = Math.round((t.gereed / tel) * 100);
  const seg = (k) => t[k] ? `<span class="stseg" style="width:${(t[k] / tel * 100).toFixed(1)}%;background:${STATUSSEN[k].kleur}" title="${STATUSSEN[k].label}: ${t[k]}"></span>` : '';
  const prob = t.geblokkeerd + t.issue;
  return `<div class="vp-rij">
    <div class="vp-kop"><span class="vp-naam">${htmlEsc(naam)}</span><span class="vp-pct">${pct}%</span></div>
    <div class="statbar">${seg('gereed')}${seg('bezig')}${seg('vertraagd')}${seg('issue')}${seg('geblokkeerd')}${seg('open')}</div>
    <div class="vp-meta">${set.length} WP · ${t.gereed} gereed · ${t.bezig} lopend${t.vertraagd ? ` · <span style="color:var(--amber,#f59e0b)">${t.vertraagd} vertraagd</span>` : ''}${prob ? ` · <span style="color:var(--rood)">${prob} geblokkeerd/issue</span>` : ''}</div>
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

  const telling = leegTelling();
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
    { val: s.boringen.toLocaleString('nl-NL'), label: 'Boringen', cls: '', actie: 'overzicht' },
    { val: `${s.pct}<small>%</small>`, label: 'Gem. voortgang', cls: 'kpi-groen', actie: 'overzicht', extra: trend },
    { val: `${actGereed}<small>/${actTotaal}</small>`, label: 'Activiteiten gereed', cls: '', actie: 'overzicht' },
    { val: s.kritiek, label: 'Kritieke werkpakketten', cls: 'kpi-rood', actie: 'kritiek' },
    { val: s.gevaar, label: 'Werkpakketten met risico', cls: 'kpi-amber', actie: 'gevaar' },
    { val: telling.geblokkeerd + telling.issue, label: 'Geblokkeerd / issues', cls: 'kpi-rood', actie: 'geblok' },
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

  // Risico-radar: zelfde deterministische lijsten als in de rapportage.
  const radarHorizon = new Date(VANDAAG); radarHorizon.setDate(radarHorizon.getDate() + 90);
  const radarLijsten = bouwRisicoLijsten(wps, radarHorizon);
  el('#dashRadarTitel').innerHTML = `Risico-radar <span class="tel">${radarLijsten.dreigtTeLaat.length}${radarLijsten.nietGetoond.dreigtTeLaat ? '+' : ''} dreigt · ${radarLijsten.reedsTeLaat.length}${radarLijsten.nietGetoond.reedsTeLaat ? '+' : ''} te laat</span>`;
  el('#dashRadar').innerHTML = risicoRadarHtml(radarLijsten);

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
  if (typeof renderDashboardTsb === 'function') renderDashboardTsb();
  if (typeof renderDashboardTolgates === 'function') renderDashboardTolgates();
}

/* ----------------------- Dashboard: interactie & visuals ----------------- */
// Klik op een dashboard-tegel → navigeer naar het bijbehorende, gefilterde scherm.
function kpiActie(actie) {
  const projectScope = State.dashScope === 'portfolio' ? '' : State.dashScope;
  State.filters = { project: projectScope, apd: '', engineer: '', fase: '', risico: '', zoek: '' };
  el('#filterZoek').value = '';
  let tab = 'overzicht';
  if (actie === 'kritiek') State.filters.risico = 'kritiek';
  else if (actie === 'gevaar') State.filters.risico = 'gevaar';
  else if (actie === 'geblok') { State.takenFilter = 'geblok'; tab = 'taken'; }
  else if (actie === 'mijlpalen') { State.horizon = '30'; tab = 'taken'; }
  render();
  toonTab(tab);
  window.scrollTo({ top: 0, behavior: 'smooth' });
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

/* ----- Risicolijsten: 'dreigt te laat' (vooraf) vs 'reeds te laat' ------- */
// Gedeeld door de rapportage én het dashboard. Levert deterministische lijsten
// op activiteit-niveau, gesorteerd op urgentie, met een cap + 'niet getoond'-teller.
function bouwRisicoLijsten(wps, horizonTot, cap = 50) {
  const taken = komendeTaken(wps, horizonTot);

  // Reeds te laat (achteraf-signaal): fase is over de einddatum, de activiteit is
  // geblokkeerd/issue, of de doorlooptijd past objectief niet meer vóór de einddatum.
  const reedsAlle = taken.filter((t) => t.ernst >= 3).sort((a, b) => a.faseEind - b.faseEind);
  const reedsTeLaat = reedsAlle.slice(0, cap).map((t) => ({
    wp: `${t.wp.project} · ${t.wp.wp}`, activiteit: `${t.activiteit.code} ${t.activiteit.naam}`,
    fase: t.fase.naam,
    reden: t.overtijd ? 'fase over einddatum'
      : (t.status === 'geblokkeerd' || t.status === 'issue') ? t.status
      : 'doorlooptijd past niet meer',
    faseEind: fmtDatum(t.faseEind),
  }));

  // Dreigt te laat (vooraf-signaal): nog haalbaar, MITS nu gestart. De uiterste
  // startdatum (latestStart = einddatum − doorlooptijd) is bereikt of nadert; de
  // speling raakt op. Gesorteerd op meest dringende uiterste startdatum.
  const dreigtAlle = taken.filter((t) => t.ernst === 2).sort((a, b) => a.latestStart - b.latestStart);
  const dreigtTeLaat = dreigtAlle.slice(0, cap).map((t) => ({
    wp: `${t.wp.project} · ${t.wp.wp}`, activiteit: `${t.activiteit.code} ${t.activiteit.naam}`,
    fase: t.fase.naam,
    uiterlijkStarten: fmtDatum(t.latestStart),
    dagenTotUiterste: dagenVerschil(VANDAAG, t.latestStart),
    spelingWd: t.speling,
    faseEind: fmtDatum(t.faseEind),
  }));

  return {
    reedsTeLaat, dreigtTeLaat,
    nietGetoond: {
      reedsTeLaat: Math.max(0, reedsAlle.length - reedsTeLaat.length),
      dreigtTeLaat: Math.max(0, dreigtAlle.length - dreigtTeLaat.length),
    },
  };
}

/* --------------- Rapport: bereken cijfers (terug- & vooruit) ------------- */
function bouwRapportData(scope, van, tot, label) {
  const wps = scope === 'portfolio' ? State.werkpakketten : State.werkpakketten.filter((w) => w.project === scope);
  const s = statsVoor(wps);

  const telling = leegTelling();
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

  const { reedsTeLaat, dreigtTeLaat, nietGetoond } = bouwRisicoLijsten(wps, horizonTot);

  const perProject = [...new Set(wps.map((w) => w.project))].sort().map((p) => {
    const ps = statsVoor(wps.filter((w) => w.project === p));
    return { project: p, werkpakketten: ps.aantal, apds: ps.apds.length, voortgang: ps.pct, kritiek: ps.kritiek, risico: ps.gevaar };
  });

  return {
    scope, label, peildatum: fmtDatum(VANDAAG),
    periode: { van: fmtDatum(van), tot: fmtDatum(tot) },
    kerncijfers: { werkpakketten: s.aantal, projecten: [...new Set(wps.map((w) => w.project))].length, apds: s.apds.length, kmNieuwTrace: +(s.meters / 1000).toFixed(1), gemVoortgangPct: s.pct, kritiekeWerkpakketten: s.kritiek, risicoWerkpakketten: s.gevaar, geblokkeerdeActiviteiten: telling.geblokkeerd + telling.issue, vertraagdeActiviteiten: telling.vertraagd },
    statusverdelingActiviteiten: telling,
    faseverdeling: s.faseTeller,
    voortgangsontwikkeling: voortgangsDelta,
    terugblik: { mijlpalenInPeriode: mpPeriode },
    vooruitblik: { naderendeMijlpalen: mpKomend.slice(0, 25), reedsTeLaat, dreigtTeLaat, nietGetoond },
    registers: registerRapportData(scope),
    tsb: typeof tsbRapportData === 'function' ? tsbRapportData(scope) : null,
    perProject,
  };
}

function rapportPrompt(data) {
  const system = `Je bent een ervaren projectbeheerser/PMO-adviseur bij netbeheerder-aannemer HVP. Je schrijft heldere, zakelijke Nederlandstalige management­rapportages over de bouwteamfase "Nulelie" (engineering van ondergrondse kabelverbindingen). De hiërarchie is Project ▸ APD ▸ Werkpakket.

Schrijf in Markdown. Gebruik UITSLUITEND de aangeleverde cijfers en feiten — verzin geen getallen, namen of mijlpalen. Waar gegevens ontbreken, benoem dat kort. Wees concreet en stuurgericht: benoem waar het goed gaat, waar het risico loopt en wat de komende periode concreet moet gebeuren.

STUUR PROACTIEF, NIET ACHTERAF. De data bevat twee gescheiden risicocategorieën onder "vooruitblik":
- "dreigtTeLaat" = acties die NOG haalbaar zijn, mits ze nu starten. Het veld "uiterlijkStarten" is de uiterste startdatum en "dagenTotUiterste" telt de werk-/kalenderdagen daarheen (negatief = die datum is al gepasseerd, dus acuut). Dit is het BELANGRIJKSTE signaal: hier kan tijdig ingrijpen nog voorkomen dat iets te laat wordt.
- "reedsTeLaat" = acties die al over hun datum zijn of niet meer binnen de doorlooptijd passen. Dit is herstelwerk, geen preventie.
Open de samenvatting met de scherpste "dreigtTeLaat"-punten (waar moet deze week beslist of gestart worden), en behandel "reedsTeLaat" daarna als herstel.

OPMAAK. Het rapport wordt als opgemaakt HTML-document getoond; boven jouw tekst staat al een rapportkop met titel, scope, periode en KPI-tegels. Begin daarom DIRECT met "## Samenvatting" — geen eigen #-titel, geen herhaling van de kerncijfers als losse opsomming. Gebruik nette, compacte Markdown-tabellen waar dat het rapport sterker maakt (kerncijfers, mijlpalen, acties): maximaal ± 8 rijen per tabel, selecteer de belangrijkste en benoem hoeveel er nog meer zijn. Interpreteer en prioriteer: benoem bij de vroegsignalering de 3-6 acties die nu om een besluit of start vragen (met uiterste startdatum) en leg verbanden (opeenstapeling bij één werkpakket, engineer of mijlpaal).

Verplichte structuur:
## Samenvatting   (3-5 kernzinnen; open met het scherpste dreigt-te-laat-signaal)
## Terugblik afgelopen periode   (mijlpalen die gepland stonden en hun status; voortgangsontwikkeling indien beschikbaar)
## Voortgang & KPI's   (kerncijfers; gebruik een korte Markdown-tabel)
## Financiën — TSB, uren & kosten   (ALLEEN als het veld "tsb" in de data gevuld is: begroot versus besteed in uren en euro's per project, opvallende over-/onderschrijdingen (pctBesteedBedrag > 100 = overschrijding) en wat dat betekent voor de sturing; laat deze sectie anders volledig weg)
## Vroegsignalering — dreigt te laat   (acties die nu om een besluit/start vragen vóór hun uiterste startdatum; als tabel met uiterste startdatum en fase-einde, geprioriteerd)
## Reeds te laat & blokkades   (over-datum acties, geblokkeerd/issue; betrek het risico-register (top-risico's met score) en vergunningen/ZRO die over de besluitdatum zijn)
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

/* --------- Deterministische risico-radar (door code, niet door AI) -------- */
// Vaste, complete tabel die altijd boven het AI-rapport verschijnt — ook als de
// AI-service faalt. Scheidt "dreigt te laat" (vooraf, nog te voorkomen) van
// "reeds te laat" (achteraf, herstel).
function risicoRadarHtml(lijsten) {
  const dreigt = lijsten.dreigtTeLaat || [];
  const reeds = lijsten.reedsTeLaat || [];
  const ng = lijsten.nietGetoond || { dreigtTeLaat: 0, reedsTeLaat: 0 };

  const meerRegel = (n) => n > 0 ? `<p class="radar-meer">+ nog ${n} niet getoond (drempel ${50}).</p>` : '';

  const dagChip = (d) => {
    if (d < 0) return `<span class="radar-chip acuut">${Math.abs(d)}d over</span>`;
    if (d <= 5) return `<span class="radar-chip dringend">over ${d}d</span>`;
    return `<span class="radar-chip">over ${d}d</span>`;
  };

  const dreigtTabel = dreigt.length ? `
    <table class="radar-tabel">
      <thead><tr><th>Werkpakket</th><th>Activiteit</th><th>Fase</th><th>Uiterlijk starten</th><th>Speling</th><th>Fase-einde</th></tr></thead>
      <tbody>${dreigt.map((t) => `<tr>
        <td>${htmlEsc(t.wp)}</td>
        <td>${htmlEsc(t.activiteit)}</td>
        <td>${htmlEsc(t.fase)}</td>
        <td><strong>${htmlEsc(t.uiterlijkStarten)}</strong> ${dagChip(t.dagenTotUiterste)}</td>
        <td>${t.spelingWd} wd</td>
        <td>${htmlEsc(t.faseEind)}</td>
      </tr>`).join('')}</tbody>
    </table>${meerRegel(ng.dreigtTeLaat)}`
    : '<p class="radar-leeg">Geen acties die dreigen te laat te worden. 👍</p>';

  const reedsTabel = reeds.length ? `
    <table class="radar-tabel">
      <thead><tr><th>Werkpakket</th><th>Activiteit</th><th>Fase</th><th>Reden</th><th>Fase-einde</th></tr></thead>
      <tbody>${reeds.map((t) => `<tr>
        <td>${htmlEsc(t.wp)}</td>
        <td>${htmlEsc(t.activiteit)}</td>
        <td>${htmlEsc(t.fase)}</td>
        <td>${htmlEsc(t.reden)}</td>
        <td>${htmlEsc(t.faseEind)}</td>
      </tr>`).join('')}</tbody>
    </table>${meerRegel(ng.reedsTeLaat)}`
    : '<p class="radar-leeg">Geen acties die al over hun datum zijn.</p>';

  return `<div class="risico-radar">
    <div class="radar-kop"><h3>🟠 Dreigt te laat <span class="radar-tel">${dreigt.length}${ng.dreigtTeLaat ? '+' : ''}</span></h3>
      <span class="radar-uitleg">Nog haalbaar mits nu gestart — sorteer op uiterste startdatum.</span></div>
    ${dreigtTabel}
    <div class="radar-kop"><h3>🔴 Reeds te laat <span class="radar-tel">${reeds.length}${ng.reedsTeLaat ? '+' : ''}</span></h3>
      <span class="radar-uitleg">Over datum of past niet meer binnen de doorlooptijd — herstel/ingreep nodig.</span></div>
    ${reedsTabel}
  </div>`;
}

/* ------------------- Rapportkop + standalone HTML-export ------------------ */
// Opgemaakte kop boven het rapport: titel, meta en KPI-tegels uit de data.
function rapportKopHtml(data) {
  const scopeNaam = data.scope === 'portfolio' ? 'Hele portfolio' : data.scope;
  const titel = data.label.charAt(0).toUpperCase() + data.label.slice(1);
  const dreigt = data.vooruitblik.dreigtTeLaat.length + (data.vooruitblik.nietGetoond.dreigtTeLaat ? '+' : '');
  const reeds = data.vooruitblik.reedsTeLaat.length + (data.vooruitblik.nietGetoond.reedsTeLaat ? '+' : '');
  const tegel = (val, label, cls = '') => `<div class="rk-kpi ${cls}"><b>${val}</b><span>${htmlEsc(label)}</span></div>`;
  let tegels = [
    tegel(data.kerncijfers.werkpakketten, 'werkpakketten'),
    tegel(data.kerncijfers.gemVoortgangPct + '%', 'gem. voortgang', 'groen'),
    tegel(data.kerncijfers.kritiekeWerkpakketten, 'kritiek', data.kerncijfers.kritiekeWerkpakketten ? 'rood' : ''),
    tegel(dreigt, 'dreigt te laat', 'amber'),
    tegel(reeds, 'reeds te laat', 'rood'),
    tegel(data.terugblik.mijlpalenInPeriode.length, 'mijlpalen in periode'),
  ].join('');
  if (data.tsb && data.tsb.totalen) {
    const fmtK = (n) => '€ ' + Math.round(n).toLocaleString('nl-NL');
    const pct = data.tsb.totalen.begrootBedrag ? Math.round((data.tsb.totalen.totaalBesteed / data.tsb.totalen.begrootBedrag) * 100) : null;
    tegels += tegel(fmtK(data.tsb.totalen.begrootBedrag), 'begroot (TSB)')
      + tegel(fmtK(data.tsb.totalen.totaalBesteed) + (pct != null ? ` · ${pct}%` : ''), 'besteed', pct != null && pct > 100 ? 'rood' : 'groen')
      + tegel(fmtK(data.tsb.totalen.restbudget), 'restbudget', data.tsb.totalen.restbudget < 0 ? 'rood' : '');
  }
  return `<div class="rapport-kop">
      <div class="rk-brand"><div class="rk-logo">HVP</div>
        <div><h1 class="rk-titel">${htmlEsc(titel)}</h1>
        <div class="rk-sub">${htmlEsc(scopeNaam)} · ${htmlEsc(data.periode.van)} t/m ${htmlEsc(data.periode.tot)} · peildatum ${htmlEsc(data.peildatum)}</div></div></div>
      <div class="rk-meta">Procesturing — Bouwteamfase Nulelie<br>gegenereerd ${new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
    </div>
    <div class="rk-kpis">${tegels}</div>`;
}

// Zelfstandig HTML-bestand (inline CSS) — deelbaar per mail/SharePoint.
function rapportStandaloneHtml(titel, inhoudHtml) {
  const css = `
    :root{--accent:#2563eb;--accent-dark:#1e3a8a;--ink:#0f172a;--ink-2:#334155;--sub:#64748b;--line:#e4e9f0;--panel-2:#f8fafc;--groen:#10b981;--amber:#f59e0b;--rood:#ef4444}
    *{box-sizing:border-box}body{margin:0;background:#eef2f7;font-family:"Inter","Segoe UI",system-ui,-apple-system,sans-serif;color:var(--ink-2);font-size:14px;line-height:1.65}
    .vel{max-width:860px;margin:28px auto;background:#fff;border:1px solid var(--line);border-radius:16px;padding:36px 44px;box-shadow:0 6px 24px rgba(15,23,42,.08)}
    .rapport-kop{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;background:linear-gradient(120deg,#172554,#1d4ed8 60%,#2563eb);color:#fff;border-radius:14px;padding:22px 26px;margin-bottom:14px}
    .rk-brand{display:flex;gap:14px;align-items:center}
    .rk-logo{background:linear-gradient(160deg,#fff,#dbeafe);color:#1d4ed8;font-weight:800;width:46px;height:46px;border-radius:12px;display:grid;place-items:center;font-size:15px}
    .rk-titel{margin:0;font-size:21px;font-weight:700;color:#fff;letter-spacing:-.01em}
    .rk-sub{font-size:12.5px;color:#c7d2fe;margin-top:3px}
    .rk-meta{font-size:11.5px;color:#c7d2fe;text-align:right;line-height:1.5}
    .rk-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:9px;margin:0 0 26px}
    .rk-kpi{background:var(--panel-2);border:1px solid var(--line);border-radius:11px;padding:10px 13px}
    .rk-kpi b{display:block;font-size:17px;font-weight:750;color:var(--ink)}
    .rk-kpi span{font-size:10.5px;color:var(--sub);font-weight:600}
    .rk-kpi.groen b{color:#047857}.rk-kpi.amber b{color:#b45309}.rk-kpi.rood b{color:#b91c1c}
    h1{font-size:24px;color:var(--ink);margin:0 0 4px}
    h2{font-size:17px;color:var(--accent-dark);margin:28px 0 10px;padding:0 0 7px;border-bottom:2px solid var(--line);letter-spacing:-.01em}
    h3{font-size:14.5px;color:var(--ink);margin:18px 0 6px}
    p{margin:0 0 12px}ul,ol{margin:0 0 14px;padding-left:22px}li{margin-bottom:5px}
    strong{color:var(--ink);font-weight:650}code{background:#eef2f7;padding:1px 6px;border-radius:6px;font-size:.85em}
    table{width:100%;border-collapse:collapse;margin:0 0 16px;font-size:12.5px}
    th,td{border:1px solid var(--line);padding:7px 10px;text-align:left;vertical-align:top}
    th{background:var(--panel-2);font-weight:650;color:var(--ink)}
    tbody tr:nth-child(even){background:#fbfcfe}
    hr{border:0;border-top:1px solid var(--line);margin:22px 0}
    .rapport-meta{color:var(--sub);font-size:12px;margin-bottom:18px}
    @media print{body{background:#fff}.vel{border:0;box-shadow:none;margin:0;max-width:none;padding:0}
      .rapport-kop{-webkit-print-color-adjust:exact;print-color-adjust:exact}}`;
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${htmlEsc(titel)}</title><style>${css}</style></head><body><div class="vel">${inhoudHtml}</div></body></html>`;
}

function downloadRapportHtml() {
  const doc = el('#rapportDoc');
  if (!doc || !doc.innerHTML.trim()) { toast('Genereer eerst een rapportage', 'fout'); return; }
  const titel = doc._titel || 'rapportage';
  const blob = new Blob([rapportStandaloneHtml(titel, doc.innerHTML)], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${titel.toLowerCase().replace(/[^\w]+/g, '-')}-${isoDatum(new Date())}.html`;
  a.click();
  toast('Rapportage gedownload als HTML', 'ok');
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

  const dreigtTel = data.vooruitblik.dreigtTeLaat.length + (data.vooruitblik.nietGetoond.dreigtTeLaat ? '+' : '');
  const reedsTel = data.vooruitblik.reedsTeLaat.length + (data.vooruitblik.nietGetoond.reedsTeLaat ? '+' : '');
  el('#rapMetricPreview').innerHTML = [
    ['Werkpakketten', data.kerncijfers.werkpakketten],
    ['Gem. voortgang', data.kerncijfers.gemVoortgangPct + '%'],
    ['Dreigt te laat', dreigtTel],
    ['Reeds te laat', reedsTel],
    ['Mijlpalen in periode', data.terugblik.mijlpalenInPeriode.length],
    ['Mijlpalen vooruit', data.vooruitblik.naderendeMijlpalen.length],
  ].map(([l, v]) => `<div class="mp"><b>${v}</b><span>${l}</span></div>`).join('');

  const knop = el('#rapGenereer');
  const status = el('#rapAiStatus');
  knop.disabled = true;
  status.innerHTML = '<span class="spinner"></span> Rapportage genereren met ' + State.model() + '…';
  el('#rapportUitvoerKaart').style.display = 'block';
  const doc = el('#rapportDoc');
  // Opgemaakte rapportkop (titel + KPI-tegels) staat er direct; de AI-tekst
  // streamt daaronder binnen.
  const kop = rapportKopHtml(data);
  doc._titel = `${label} — ${scope === 'portfolio' ? 'portfolio' : scope}`;
  doc.innerHTML = kop + '<p class="hint">Bezig met schrijven…</p>';
  doc.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (rapportAbort) rapportAbort.abort();
  rapportAbort = new AbortController();
  const { system, prompt } = rapportPrompt(data);
  try {
    const tekst = await AI.genereer({
      system, prompt, model: State.model(), signal: rapportAbort.signal,
      onDelta: (vol) => { doc.innerHTML = kop + markdownNaarHtml(vol); },
    });
    doc.innerHTML = kop
      + markdownNaarHtml(tekst)
      + `<div class="rapport-meta" style="margin-top:22px">Gegenereerd op ${new Date().toLocaleString('nl-NL')} · model ${State.model()} · HVP Procesturing</div>`;
    status.innerHTML = '<span style="color:#047857;font-weight:600">✓ Rapportage gereed — download als HTML of print naar PDF.</span>';
    doc._tekst = tekst;
  } catch (e) {
    status.innerHTML = '';
    doc.innerHTML = kop + `<div class="ai-waarsch">⚠️ <div><strong>Kon de rapportage niet genereren.</strong><br>${htmlEsc(e.message)}<br><span class="hint">Stel <code>ANTHROPIC_API_KEY</code> in als environment variable in Vercel. Lokaal (zonder Vercel) is de AI-service niet beschikbaar; de berekende cijfers hierboven werken wel.</span></div></div>`;
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
// CSV-statuscode → app-status. 1=afgerond, 2=lopend, 3=vertraagd, 4=issue, 5=n.v.t.
const CSV_STATUSCODE = { 1: 'gereed', 2: 'bezig', 3: 'vertraagd', 4: 'issue', 5: 'nvt' };
// Bekende afwijkende activiteitcodes in de CSV t.o.v. de app-codes.
const CSV_CODE_ALIAS = { '0.03.01': '1.03.01', '2.03': '2.03.02', '2.05': '2.05.01' };
// Bepaal voor een CSV-kolomkop de bijbehorende app-activiteitcode (of null).
function csvActCode(header) {
  const m = (header || '').match(/^\s*(\d{1,2}(?:\.\d{1,2}){1,2})\b/);
  if (!m) return null;
  const code = m[1];
  if (ACTIVITEIT_INDEX[code]) return code;
  const alt = code.replace(/^0(\d)/, '$1');          // 01.03.02 → 1.03.02
  if (ACTIVITEIT_INDEX[alt]) return alt;
  if (CSV_CODE_ALIAS[code]) return CSV_CODE_ALIAS[code];
  return null;
}
// Vat meerdere CSV-substatussen samen tot één activiteitstatus.
const STATUS_PRIO = { issue: 5, vertraagd: 4, bezig: 3, gereed: 2 };
function vatStatusSamen(lijst) {
  const echt = lijst.filter((s) => s !== 'nvt');
  if (!echt.length) return lijst.length ? 'nvt' : null;
  return echt.reduce((best, s) => ((STATUS_PRIO[s] || 0) > (STATUS_PRIO[best] || 0) ? s : best));
}
function importeerCsv(tekst) {
  const rows = parseCsv(tekst);
  const headerIdx = rows.findIndex((r) => (r[0] || '').trim().toLowerCase() === 'projectnaam');
  if (headerIdx < 0) throw new Error('Kon de kolomkoppen (rij met "Projectnaam") niet vinden.');
  // Normaliseer: diacrieten weg + lege tekens, zodat "Tracé start" ≈ "trac start".
  const n = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ�]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  const header = rows[headerIdx].map((h) => h.replace(/\s+/g, ' ').trim().replace(/:$/, ''));
  const colIdx = (naam) => header.findIndex((h) => n(h) === n(naam));
  const vind = (fn) => header.findIndex((h) => fn(n(h)));
  const cProject = colIdx('Projectnaam'), cApd = colIdx('APD Bouwdeel');
  const cTrac = vind((h) => h.startsWith('liander') || h.includes('tracdeel') || h.includes('tracedeel'));
  const cWp = vind((h) => h.startsWith('werkpakket'));
  const cStart = vind((h) => h.startsWith('trac') && h.includes('start'));
  const cEind = vind((h) => h.startsWith('trac') && h.includes('eind'));
  const cEng = colIdx('Engineer');
  const cLen = vind((h) => h.startsWith('lengte nieuw'));
  const cMpw = vind((h) => h.startsWith('uitvoering meters'));
  const mCols = {}; MIJLPALEN.forEach((m) => { mCols[m.key] = colIdx(m.csv); });
  // Statuskolommen: elke kop met een herkenbare activiteitcode (1..5 als waarde).
  const statusCols = [];
  header.forEach((h, i) => { const code = csvActCode(h); if (code) statusCols.push({ i, code }); });
  const nieuwe = [], voortgang = {}, gezien = new Set();
  let statusGevonden = 0;
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
    // Activiteitstatussen uit de statuskolommen (meerdere kolommen → samengevat per code).
    const perCode = {};
    statusCols.forEach(({ i, code }) => {
      const raw = (row[i] || '').trim();
      if (!/^[1-5]$/.test(raw)) return;
      (perCode[code] = perCode[code] || []).push(CSV_STATUSCODE[+raw]);
    });
    const vg = {};
    Object.entries(perCode).forEach(([code, lijst]) => { const st = vatStatusSamen(lijst); if (st) vg[code] = { status: st }; });
    if (Object.keys(vg).length) { voortgang[id] = vg; statusGevonden++; }
  }
  if (!nieuwe.length) throw new Error('Geen geldige werkpakket-rijen gevonden.');
  return { werkpakketten: nieuwe, voortgang, statusGevonden };
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
  await Auth.init();              // blokkeert tot er is ingelogd (of devmodus)
  Auth.montUserButton();
  DB.onStatus((s) => updateDbStatus(s));
  await State.laad();
  Auth.koppelGebruiker();        // registreer gebruiker + bepaal rol
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
  el('#rapDownload').addEventListener('click', downloadRapportHtml);
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
        const { werkpakketten: wps, voortgang, statusGevonden } = importeerCsv(reader.result);
        State.werkpakketten = wps;
        State.voortgang = voortgang || {};
        State.bewaar();
        State.filters = { project: '', apd: '', engineer: '', fase: '', risico: '', zoek: '' };
        render();
        const statusTxt = statusGevonden ? ` Statussen ingelezen voor ${statusGevonden} werkpakket(ten).` : '';
        el('#importMelding').innerHTML = `<span class="ok">${wps.length} werkpakketten geïmporteerd uit "${htmlEsc(file.name)}".${statusTxt}</span>`;
        toast(`${wps.length} werkpakketten geïmporteerd`, 'ok');
        toonTab('overzicht');
      } catch (err) { el('#importMelding').innerHTML = `<span class="fout">Import mislukt: ${htmlEsc(err.message)}</span>`; }
    };
    reader.readAsText(file, 'utf-8'); e.target.value = '';
  });
  el('#btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ werkpakketten: State.werkpakketten, voortgang: State.voortgang, doorlooptijden: State.doorlooptijden, snapshots: State.snapshots, vergunningen: State.vergunningen, risicos: State.risicos, activiteitInfo: State.activiteitInfo, tsb: State.tsb, tolgates: State.tolgates, tolgateInstances: State.tolgateInstances }, null, 2)], { type: 'application/json' });
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
        if (data.activiteitInfo) State.activiteitInfo = data.activiteitInfo;
        if (data.tsb) State.tsb = data.tsb;
        if (data.tolgates) State.tolgates = data.tolgates;
        if (data.tolgateInstances) State.tolgateInstances = data.tolgateInstances;
        State.bewaar(); render();
        el('#importMelding').innerHTML = `<span class="ok">Werkbestand hersteld.</span>`;
        toast('Werkbestand hersteld', 'ok'); toonTab('overzicht');
      } catch (err) { el('#importMelding').innerHTML = `<span class="fout">Kon JSON niet lezen: ${htmlEsc(err.message)}</span>`; }
    };
    reader.readAsText(file, 'utf-8'); e.target.value = '';
  });
  el('#btnSeed').addEventListener('click', () => {
    if (!confirm('Alle projecten, planning én statussen opnieuw laden uit de engineeringsplanning? Doorlooptijden, vergunningen en risico’s worden gewist.')) return;
    State.werkpakketten = (window.SEED_WERKPAKKETTEN || []).map((w) => ({ ...w }));
    State.voortgang = window.SEED_VOORTGANG ? JSON.parse(JSON.stringify(window.SEED_VOORTGANG)) : {};
    State.doorlooptijden = {}; State.vergunningen = []; State.risicos = [];
    State.filters = { project: '', apd: '', engineer: '', fase: '', risico: '', zoek: '' };
    el('#filterZoek').value = '';
    State.bewaar(); render(); toonTab('overzicht');
    toast('Projecten en statussen herladen uit de planning', 'ok');
  });
  el('#btnWis').addEventListener('click', async () => {
    if (!confirm('ALLE data, voortgang en momentopnames wissen — ook in de database? Dit kan niet ongedaan gemaakt worden.')) return;
    localStorage.removeItem(CACHE_KEY);
    await DB.wisNeon();
    State.werkpakketten = (window.SEED_WERKPAKKETTEN || []).map((w) => ({ ...w }));
    State.voortgang = {}; State.doorlooptijden = {}; State.snapshots = []; State.vergunningen = []; State.risicos = []; State.activiteitInfo = {};
    State.tsb = { formats: [], projecten: [], instellingen: {} };
    State.tolgates = JSON.parse(JSON.stringify(window.STANDAARD_TOLGATES || []));
    State.tolgateInstances = [];
    State.bewaar(); render(); toonTab('overzicht'); toast('Alles gewist', 'ok');
  });

  DB.serverStatus().then((st) => {
    const node = el('#instDbInfo');
    if (node) node.innerHTML = `Database <strong style="color:${st.database ? '#047857' : '#b45309'}">${st.database ? 'gekoppeld' : 'niet ingesteld'}</strong> · AI <strong style="color:${st.ai ? '#047857' : '#b45309'}">${st.ai ? 'beschikbaar' : 'niet ingesteld'}</strong>`;
  });

  gateUI();
  el('#peildatum').textContent = fmtDatum(VANDAAG);
  render();
  toonTab(Auth.magVolledig() ? 'overzicht' : 'mijn');
}

document.addEventListener('DOMContentLoaded', init);
