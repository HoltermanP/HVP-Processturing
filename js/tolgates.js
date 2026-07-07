/* ==========================================================================
   Tolgates — formele faseovergangen (T1 t/m T4) per project.

   Datamodel (twee KV-sleutels in Neon, conform het bestaande schema waarin
   projecten namen zijn op werkpakketten — er is bewust géén projecttabel):
   - State.tolgates          definities: { id, naam, faseVoor, faseNa,
                             faseId (planning-fase voor datumafleiding),
                             status: 'bevestigd'|'afgeleid', criteria: [..],
                             volgorde }
   - State.tolgateInstances  per project × tolgate, alleen bewaard zodra er
                             handmatig iets is vastgelegd: { id, tolgateId,
                             project, geplandeDatum, geplandBron
                             ('planning'|'handmatig'), gerealiseerdeDatum,
                             status: 'open'|'in_behandeling'|'gehaald'|'gemist' }.
                             Zonder record geldt de afgeleide standaard: status
                             open en de geplande datum uit de planning (het
                             einde van de bijbehorende fase = de laatste
                             eind-mijlpaal over de werkpakketten van het
                             project). Zo blijft de widget vanzelf in de pas
                             met planningswijzigingen.

   'afgeleid' betekent: deze tolgate is uit het procesdocument afgeleid en nog
   niet gevalideerd tegen Relatics; 'bevestigd' is dat wel.
   ========================================================================== */
'use strict';

/* ------------------------------ Definities ------------------------------- */
// Seed (T1–T4); komt in State.tolgates zodra de staat nog geen tolgates heeft.
const STANDAARD_TOLGATES = [
  {
    id: 'T1', naam: 'T1 — Eind Analysefase', faseVoor: 'Analysefase', faseNa: 'VO-fase',
    faseId: '0', status: 'afgeleid', volgorde: 1,
    criteria: ['Intake compleet', 'TOF-beoordeling afgerond', 'Taakstellend budget vastgesteld'],
  },
  {
    id: 'T2', naam: 'T2 — Eind VO-fase', faseVoor: 'VO-fase', faseNa: 'Onderzoeksfase/Concept-DO',
    faseId: '1', status: 'bevestigd', volgorde: 2,
    criteria: ['Startnota ingediend in VISI'],
  },
  {
    id: 'T3', naam: 'T3 — Eind Definitief DO-fase', faseVoor: 'DO-fase', faseNa: 'UO-fase',
    faseId: '2', status: 'bevestigd', volgorde: 3,
    criteria: ['Ontwikkelnota akkoord OG', 'Gate review DO afgerond'],
  },
  {
    id: 'T4', naam: 'T4 — Eind UO-fase', faseVoor: 'UO-fase', faseNa: 'Realisatiefase',
    faseId: '3', status: 'afgeleid', volgorde: 4,
    criteria: ['UO-tekeningen gereed', 'UO-begroting opgesteld', 'Capaciteitsaanvraag ingediend'],
  },
];

const TOLGATE_INSTANTIE_STATUS = {
  open:            { label: 'Open',           kleur: '#94a3b8' },
  in_behandeling:  { label: 'In behandeling', kleur: '#0ea5e9' },
  gehaald:         { label: 'Gehaald',        kleur: '#10b981' },
  gemist:          { label: 'Gemist',         kleur: '#ef4444' },
};

/* -------------------------------- Helpers -------------------------------- */
function magTolgates() { return !window.Auth || Auth.magVolledig(); }
function tolgateLijst() {
  return (State.tolgates || []).slice().sort((a, b) => (a.volgorde || 0) - (b.volgorde || 0));
}
// Geplande datum uit de planning: het einde van de gekoppelde fase, d.w.z. de
// laatste eind-mijlpaaldatum van die fase over alle werkpakketten van het project.
function tolgateGeplandUitPlanning(project, tolgate) {
  const fase = FASES.find((f) => f.id === tolgate.faseId);
  if (!fase) return '';
  let laatste = null;
  State.werkpakketten.filter((w) => w.project === project).forEach((w) => {
    const d = parseDatum(w.mijlpalen[fase.eindMijlpaal]);
    if (d && (!laatste || d > laatste)) laatste = d;
  });
  return laatste ? isoDatum(laatste) : '';
}
// Instantie voor project × tolgate: bewaard record, aangevuld met afgeleide
// standaardwaarden. Bij bron 'planning' beweegt de geplande datum mee.
function tolgateInstantie(project, tolgate) {
  const bewaard = (State.tolgateInstances || []).find((i) => i.tolgateId === tolgate.id && i.project === project);
  const uitPlanning = tolgateGeplandUitPlanning(project, tolgate);
  if (!bewaard) {
    return { tolgateId: tolgate.id, project, geplandeDatum: uitPlanning, geplandBron: 'planning', gerealiseerdeDatum: '', status: 'open', _bewaard: false };
  }
  const inst = { geplandBron: 'planning', ...bewaard, _bewaard: true };
  if (inst.geplandBron === 'planning') inst.geplandeDatum = uitPlanning || inst.geplandeDatum || '';
  return inst;
}
// Verstreken: geplande datum voorbij zonder realisatie (en niet al gehaald).
function tolgateVerstreken(inst) {
  if (inst.gerealiseerdeDatum || inst.status === 'gehaald') return false;
  const d = parseDatum(inst.geplandeDatum);
  return !!(d && d < VANDAAG);
}

/* --------------------- Dashboard-widget (tijdlijn) ------------------------ */
function tolgateGateHtml(project, tolgate, inst) {
  const st = TOLGATE_INSTANTIE_STATUS[inst.status] || TOLGATE_INSTANTIE_STATUS.open;
  const verstreken = tolgateVerstreken(inst);
  const afgeleid = tolgate.status === 'afgeleid';
  const titel = `${tolgate.naam} · ${tolgate.faseVoor} → ${tolgate.faseNa}\nCriteria:\n- ${tolgate.criteria.join('\n- ')}${afgeleid ? '\n\n▲ Afgeleid uit het procesdocument — nog niet gevalideerd tegen Relatics.' : ''}`;
  return `<div class="tg-gate st-${inst.status}${afgeleid ? ' afgeleid' : ''}${verstreken ? ' verstreken' : ''}"
      data-project="${htmlEsc(project)}" data-tolgate="${htmlEsc(tolgate.id)}" tabindex="0" role="button" title="${htmlEsc(titel)}">
    <div class="tg-kop"><span class="tg-id">${htmlEsc(tolgate.id)}</span>
      ${regBadge(verstreken && inst.status !== 'gemist' ? { label: st.label + ' · verstreken', kleur: '#ef4444' } : st)}</div>
    <div class="tg-overgang">${htmlEsc(tolgate.faseVoor)} → ${htmlEsc(tolgate.faseNa)}</div>
    <div class="tg-datums">
      <span title="Geplande datum${inst.geplandBron === 'planning' ? ' (uit de planning)' : ' (handmatig)'}">◇ ${fmtDatum(inst.geplandeDatum)}${inst.geplandBron === 'handmatig' ? '*' : ''}</span>
      <span class="${inst.gerealiseerdeDatum ? 'tg-real' : ''}" title="Gerealiseerde datum">◆ ${inst.gerealiseerdeDatum ? fmtDatum(inst.gerealiseerdeDatum) : '—'}</span>
    </div>
    ${afgeleid ? '<div class="tg-afgeleid" title="Nog niet gevalideerd tegen Relatics">▲ afgeleid</div>' : ''}
  </div>`;
}

function renderDashboardTolgates() {
  const node = el('#dashTolgates'); if (!node) return;
  const gates = tolgateLijst();
  if (!gates.length) { node.innerHTML = '<div class="leeg">Geen tolgates gedefinieerd.</div>'; return; }
  const projecten = (State.dashScope === 'portfolio'
    ? [...new Set(State.werkpakketten.map((w) => w.project))]
    : [State.dashScope]).sort();
  node.innerHTML = projecten.map((project) => {
    const cellen = gates.map((tg, i) => {
      const inst = tolgateInstantie(project, tg);
      return `${i ? '<div class="tg-pijl">→</div>' : ''}${tolgateGateHtml(project, tg, inst)}`;
    }).join('');
    return `<div class="tg-project"><div class="tg-projectnaam">${htmlEsc(project)}</div><div class="tg-lijn">${cellen}</div></div>`;
  }).join('')
    + `<div class="legenda" style="margin-top:12px">
        ${Object.values(TOLGATE_INSTANTIE_STATUS).map((s) => `<span class="leg"><i style="background:${s.kleur}"></i>${s.label}</span>`).join('')}
        <span class="leg"><i style="background:#fff;border:1.5px dashed var(--amber);border-radius:3px"></i>▲ afgeleid — nog niet gevalideerd tegen Relatics</span>
        <span class="leg">◇ gepland (* = handmatig) · ◆ gerealiseerd</span>
      </div>`;
  els('#dashTolgates .tg-gate').forEach((g) => {
    const open = () => openTolgate(g.dataset.project, g.dataset.tolgate);
    g.addEventListener('click', open);
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

/* --------------------------- Bewerken (modal) ----------------------------- */
function openTolgate(project, tolgateId) {
  const tolgate = (State.tolgates || []).find((t) => t.id === tolgateId);
  if (!tolgate) return;
  const inst = tolgateInstantie(project, tolgate);
  const mag = magTolgates();
  const statusOpts = Object.entries(TOLGATE_INSTANTIE_STATUS).map(([k, o]) =>
    `<option value="${k}"${k === inst.status ? ' selected' : ''}>${o.label}</option>`).join('');
  const criteria = tolgate.criteria.map((c) => `<li>${htmlEsc(c)}</li>`).join('');
  openModal(`${tolgate.naam} · ${project}`, `
    <p class="sub" style="margin:0 0 12px">${htmlEsc(tolgate.faseVoor)} → ${htmlEsc(tolgate.faseNa)}
      ${tolgate.status === 'afgeleid'
        ? ' · <span style="color:var(--amber);font-weight:650">▲ afgeleid — nog niet gevalideerd tegen Relatics</span>'
        : ' · <span style="color:var(--groen);font-weight:650">✓ bevestigd</span>'}</p>
    <div class="modal-veld"><label>Criteria</label><ul class="tg-criteria">${criteria}</ul></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Geplande datum</label>
        <input id="tgGepland" type="date" value="${htmlEsc(inst.geplandeDatum || '')}"${mag ? '' : ' disabled'}>
        <span class="hint">${inst.geplandBron === 'planning' ? 'volgt de planning (einde ' + htmlEsc(tolgate.faseVoor) + '); wijzigen maakt hem handmatig' : 'handmatig vastgelegd'}</span></div>
      <div class="modal-veld"><label>Gerealiseerde datum</label>
        <input id="tgGerealiseerd" type="date" value="${htmlEsc(inst.gerealiseerdeDatum || '')}"${mag ? '' : ' disabled'}></div>
    </div>
    <div class="modal-veld"><label>Status</label><select id="tgStatus"${mag ? '' : ' disabled'}>${statusOpts}</select></div>
    <div class="modal-foot">
      ${inst._bewaard && mag ? '<button class="verwijder-knop" id="tgReset">Terug naar planning</button>' : ''}
      <button class="ghost" id="tgAnnuleer">${mag ? 'Annuleren' : 'Sluiten'}</button>
      ${mag ? '<button class="primair" id="tgOpslaan">Opslaan</button>' : ''}
    </div>`);
  el('#tgAnnuleer').addEventListener('click', sluitModal);
  const opslaan = el('#tgOpslaan');
  if (opslaan) opslaan.addEventListener('click', () => {
    const gepland = el('#tgGepland').value;
    const gerealiseerd = el('#tgGerealiseerd').value;
    let status = el('#tgStatus').value;
    if (gerealiseerd && (status === 'open' || status === 'in_behandeling')) status = 'gehaald';
    const uitPlanning = tolgateGeplandUitPlanning(project, tolgate);
    const rec = {
      id: (inst._bewaard && inst.id) || nieuwId('tgi'),
      tolgateId: tolgate.id, project,
      geplandeDatum: gepland,
      geplandBron: gepland === uitPlanning ? 'planning' : 'handmatig',
      gerealiseerdeDatum: gerealiseerd, status,
    };
    State.tolgateInstances = (State.tolgateInstances || []).filter((i) => !(i.tolgateId === tolgate.id && i.project === project));
    State.tolgateInstances.push(rec);
    State.bewaar(); sluitModal(); renderDashboardTolgates();
    toast(`${tolgate.id} bijgewerkt voor ${project}`, 'ok');
  });
  const reset = el('#tgReset');
  if (reset) reset.addEventListener('click', () => {
    State.tolgateInstances = (State.tolgateInstances || []).filter((i) => !(i.tolgateId === tolgate.id && i.project === project));
    State.bewaar(); sluitModal(); renderDashboardTolgates();
    toast(`${tolgate.id} volgt weer de planning`, 'ok');
  });
}

/* --------------------------------- Export -------------------------------- */
if (typeof window !== 'undefined') {
  window.STANDAARD_TOLGATES = STANDAARD_TOLGATES;
  window.renderDashboardTolgates = renderDashboardTolgates;
}
