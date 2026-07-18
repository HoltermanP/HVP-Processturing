/* ==========================================================================
   Uitvoering — voortgangsregistratie van de realisatie.
   Registreer per werkpakket eenvoudig de gerealiseerde meters en boringen,
   per week of per maand. De registraties (State.realisaties) worden afgezet
   tegen de geplande meters (lengteNieuw uit de planning, eventueel overschreven)
   en geplande boringen (State.uitvoeringPlan, per werkpakket vast te leggen),
   zodat per project en per periode het werkelijk gerealiseerde percentage
   zichtbaar is. Hergebruikt globals uit registers.js: magReg(), nieuwId(),
   wpById(), openModal()/sluitModal(). Laadt daarom ná registers.js.

   Periode-notatie: '2026-W25' (ISO-week) of '2026-07' (maand).
   ========================================================================== */
'use strict';

/* --------------------------- Periode-helpers ------------------------------ */
function uvIsoWeek(d) {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7)); // donderdag bepaalt het ISO-jaar
  const week1 = new Date(t.getFullYear(), 0, 4);
  const week = 1 + Math.round(((t - week1) / 864e5 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return { jaar: t.getFullYear(), week };
}
function uvWeekStr(d) { const { jaar, week } = uvIsoWeek(d); return `${jaar}-W${String(week).padStart(2, '0')}`; }
function uvMaandStr(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; }

// Eerste dag van de periode (maandag van de ISO-week, of de 1e van de maand).
function uvPeriodeStart(p) {
  let m = String(p || '').match(/^(\d{4})-W(\d{1,2})$/);
  if (m) {
    const d = new Date(+m[1], 0, 4); // 4 januari ligt altijd in week 1
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + (+m[2] - 1) * 7);
    return d;
  }
  m = String(p || '').match(/^(\d{4})-(\d{1,2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, 1);
  return null;
}
function uvPeriodeInfo(p) {
  let m = String(p || '').match(/^(\d{4})-W(\d{1,2})$/);
  if (m) {
    const start = uvPeriodeStart(p);
    const eind = new Date(start); eind.setDate(eind.getDate() + 6);
    return { type: 'week', start, label: `Week ${+m[2]} · ${m[1]}`, sub: `${fmtDatumKort(start)} – ${fmtDatumKort(eind)}` };
  }
  const start = uvPeriodeStart(p);
  if (start) return { type: 'maand', start, label: start.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' }), sub: '' };
  return { type: 'onbekend', start: null, label: String(p || '—'), sub: '' };
}
// Maand waarin een periode valt (voor de maandweergave telt een week mee in de
// maand van zijn donderdag, conform de ISO-weekindeling).
function uvMaandVan(p) {
  const info = uvPeriodeInfo(p);
  if (!info.start) return null;
  if (info.type === 'week') { const d = new Date(info.start); d.setDate(d.getDate() + 3); return uvMaandStr(d); }
  return uvMaandStr(info.start);
}
function uvFmt(n) { return (Math.round(+n || 0)).toLocaleString('nl-NL'); }

/* ------------------------------ Plan & scope ------------------------------ */
function uvPlanVoor(wpId) { return (State.uitvoeringPlan || {})[wpId] || {}; }
function uvMetersGepland(w) {
  const pl = uvPlanVoor(w.id);
  return pl.meters != null && pl.meters !== '' ? +pl.meters : (+w.lengteNieuw || 0);
}
function uvBoringenGepland(w) { return +uvPlanVoor(w.id).boringen || 0; }
function uvRealisatiesVoor(wpId) { return (State.realisaties || []).filter((r) => r.wpId === wpId); }

// Werkpakketten binnen de actieve filterselectie (tegels op het Overzicht).
function uvWps() {
  const f = State.filters; const zoek = (f.zoek || '').toLowerCase();
  return State.werkpakketten.filter((w) => {
    if (f.project && w.project !== f.project) return false;
    if (f.apd && apdVan(w) !== f.apd) return false;
    if (f.engineer && w.engineer !== f.engineer) return false;
    if (zoek) {
      const blob = `${w.project} ${apdVan(w)} ${w.wp} ${w.engineer || ''}`.toLowerCase();
      if (!blob.includes(zoek)) return false;
    }
    return true;
  });
}

function uvTotalen(wps) {
  const wpIds = new Set(wps.map((w) => w.id));
  const regs = (State.realisaties || []).filter((r) => wpIds.has(r.wpId));
  const t = {
    regs,
    mGepland: wps.reduce((s, w) => s + uvMetersGepland(w), 0),
    bGepland: wps.reduce((s, w) => s + uvBoringenGepland(w), 0),
    mReal: regs.reduce((s, r) => s + (+r.meters || 0), 0),
    bReal: regs.reduce((s, r) => s + (+r.boringen || 0), 0),
  };
  t.mPct = t.mGepland ? Math.round((t.mReal / t.mGepland) * 100) : null;
  t.bPct = t.bGepland ? Math.round((t.bReal / t.bGepland) * 100) : null;
  return t;
}

/* ------------------------------- Weergave --------------------------------- */
function uvPctCel(real, gepland) {
  if (!gepland) return '<span class="uv-pct dof">—</span>';
  const pct = Math.round((real / gepland) * 100);
  const kleur = pct >= 100 ? 'var(--groen)' : pct > 0 ? 'var(--accent)' : 'var(--line)';
  return `<div class="uv-voortgang" title="${uvFmt(real)} van ${uvFmt(gepland)}">
    <div class="uv-balk"><span style="width:${Math.min(pct, 100)}%;background:${kleur}"></span></div>
    <span class="uv-pct">${pct}%</span>
  </div>`;
}

function renderUitvoering() {
  if (!el('#uvKpis')) return;
  const mag = magReg();
  const wps = uvWps();
  const t = uvTotalen(wps);

  // KPI-tegels: gepland vs. gerealiseerd, met het werkelijke percentage.
  const tiles = [
    { cls: '', val: uvFmt(t.mGepland), label: 'meters gepland' },
    { cls: 'blauw', val: uvFmt(t.mReal), label: 'meters gerealiseerd' },
    { cls: t.mPct != null && t.mPct >= 100 ? 'groen' : 'blauw', val: t.mPct != null ? t.mPct + '%' : '—', label: '% meters gerealiseerd' },
    { cls: '', val: uvFmt(t.bGepland), label: 'boringen gepland' },
    { cls: 'blauw', val: uvFmt(t.bReal), label: 'boringen gerealiseerd' },
    { cls: t.bPct != null && t.bPct >= 100 ? 'groen' : 'blauw', val: t.bPct != null ? t.bPct + '%' : '—', label: '% boringen gerealiseerd' },
  ];
  el('#uvKpis').innerHTML = tiles.map((x) => `<div class="tstat ${x.cls}"><b>${x.val}</b><span>${x.label}</span></div>`).join('');

  const perNiveau = State.filters.project ? uvWpTabel(wps, mag) : uvProjectTabel(wps);
  el('#uvInhoud').innerHTML = perNiveau + uvPeriodeTabel(wps, t) + uvRegistratieTabel(t.regs, mag);

  // Interactie: drill-down, plan bewerken, registreren, weergave wisselen.
  els('#uvInhoud .uv-project').forEach((tr) => tr.addEventListener('click', () => {
    State.filters.project = tr.dataset.project; State.filters.apd = '';
    render();
  }));
  els('#uvInhoud [data-plan]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); openUvPlan(wpById(b.dataset.plan)); }));
  els('#uvInhoud [data-reg]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); openRealisatie(null, b.dataset.reg); }));
  els('#uvInhoud .uv-reg-rij').forEach((tr) => tr.addEventListener('click', () => openRealisatie(realisatieById(tr.dataset.id))));
  els('#uvInhoud #uvWeergave button').forEach((b) => b.addEventListener('click', () => { State.uvWeergave = b.dataset.w; renderUitvoering(); }));
}

// Portfolio-niveau: voortgang per project; klik = inzoomen op de werkpakketten.
function uvProjectTabel(wps) {
  const projecten = [...new Set(wps.map((w) => w.project))].sort();
  const rijen = projecten.map((p) => {
    const pw = wps.filter((w) => w.project === p);
    const pt = uvTotalen(pw);
    return `<tr class="rij uv-project" data-project="${htmlEsc(p)}" title="Klik voor de werkpakketten van dit project">
      <td><strong>${htmlEsc(p)}</strong><div class="sub">${pw.length} werkpakket${pw.length === 1 ? '' : 'ten'}</div></td>
      <td class="num">${uvFmt(pt.mGepland)}</td>
      <td class="num">${uvFmt(pt.mReal)}</td>
      <td>${uvPctCel(pt.mReal, pt.mGepland)}</td>
      <td class="num">${uvFmt(pt.bGepland)}</td>
      <td class="num">${uvFmt(pt.bReal)}</td>
      <td>${uvPctCel(pt.bReal, pt.bGepland)}</td>
    </tr>`;
  }).join('');
  return `<div class="card">
    <div class="card-kop"><h2>Voortgang per project<span class="tel">${projecten.length}</span></h2><span class="hint">gerealiseerd vs. gepland · klik op een project voor de werkpakketten</span></div>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th>Project</th><th class="num">Meters gepland</th><th class="num">Gerealiseerd</th><th>% meters</th><th class="num">Boringen gepland</th><th class="num">Gerealiseerd</th><th>% boringen</th></tr></thead>
      <tbody>${rijen || '<tr><td colspan="7" class="leeg">Geen werkpakketten in deze selectie.</td></tr>'}</tbody>
    </table></div></div>`;
}

// Project-niveau: voortgang per werkpakket, met plan- en registratieknoppen.
function uvWpTabel(wps, mag) {
  const rijen = wps.slice().sort((a, b) => (a.wp || '').localeCompare(b.wp || '')).map((w) => {
    const wt = uvTotalen([w]);
    const pl = uvPlanVoor(w.id);
    const eigenPlan = pl.meters != null && pl.meters !== '';
    const acties = mag
      ? `<button class="mini-knop" data-plan="${htmlEsc(w.id)}" title="Geplande meters en boringen vastleggen">plan</button>
         <button class="mini-knop" data-reg="${htmlEsc(w.id)}" title="Meters en boringen registreren">＋ registratie</button>`
      : '';
    return `<tr class="rij">
      <td><strong>${htmlEsc(w.wp)}</strong><div class="sub">${htmlEsc(apdVan(w))} · ${htmlEsc(w.tracStart || '')} → ${htmlEsc(w.tracEind || '')}</div></td>
      <td class="num">${uvFmt(wt.mGepland)}${eigenPlan ? '<div class="sub" title="Handmatig vastgelegd; wijkt af van de planning">aangepast</div>' : ''}</td>
      <td class="num">${uvFmt(wt.mReal)}</td>
      <td>${uvPctCel(wt.mReal, wt.mGepland)}</td>
      <td class="num">${wt.bGepland ? uvFmt(wt.bGepland) : '—'}</td>
      <td class="num">${uvFmt(wt.bReal)}</td>
      <td>${uvPctCel(wt.bReal, wt.bGepland)}</td>
      <td class="reg-acties">${acties}</td>
    </tr>`;
  }).join('');
  return `<div class="card">
    <div class="card-kop"><h2>Voortgang per werkpakket — ${htmlEsc(State.filters.project)}<span class="tel">${wps.length}</span></h2><span class="hint">geplande meters komen uit de planning · leg geplande boringen vast via “plan”</span></div>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th>Werkpakket</th><th class="num">Meters gepland</th><th class="num">Gerealiseerd</th><th>% meters</th><th class="num">Boringen gepland</th><th class="num">Gerealiseerd</th><th>% boringen</th><th></th></tr></thead>
      <tbody>${rijen || '<tr><td colspan="8" class="leeg">Geen werkpakketten in deze selectie.</td></tr>'}</tbody>
    </table></div></div>`;
}

// Voortgangsrapportage per periode: productie per week/maand met het
// cumulatief gerealiseerde percentage t.o.v. het plan.
function uvPeriodeTabel(wps, t) {
  const weergave = State.uvWeergave || 'week';
  const seg = `<div class="seg-control" id="uvWeergave">
    <button data-w="week" class="${weergave === 'week' ? 'actief' : ''}">Per week</button>
    <button data-w="maand" class="${weergave === 'maand' ? 'actief' : ''}">Per maand</button>
  </div>`;

  // Groepeer de registraties op periode; in de maandweergave vallen
  // weekregistraties in de maand van hun donderdag (ISO-indeling).
  const groepen = new Map();
  t.regs.forEach((r) => {
    const key = weergave === 'maand' ? (uvMaandVan(r.periode) || r.periode) : r.periode;
    const g = groepen.get(key) || { meters: 0, boringen: 0, aantal: 0 };
    g.meters += +r.meters || 0; g.boringen += +r.boringen || 0; g.aantal++;
    groepen.set(key, g);
  });
  const rijen = [...groepen.entries()]
    .map(([p, g]) => ({ p, ...g, info: uvPeriodeInfo(p) }))
    .sort((a, b) => (a.info.start && b.info.start) ? a.info.start - b.info.start : String(a.p).localeCompare(String(b.p)));

  let cumM = 0, cumB = 0;
  const rows = rijen.map((r) => {
    cumM += r.meters; cumB += r.boringen;
    return `<tr>
      <td><strong>${htmlEsc(r.info.label)}</strong>${r.info.sub ? `<div class="sub">${htmlEsc(r.info.sub)}</div>` : ''}</td>
      <td class="num">${uvFmt(r.meters)}</td>
      <td class="num">${uvFmt(r.boringen)}</td>
      <td class="num">${uvFmt(cumM)}</td>
      <td>${uvPctCel(cumM, t.mGepland)}</td>
      <td class="num">${uvFmt(cumB)}</td>
      <td>${uvPctCel(cumB, t.bGepland)}</td>
    </tr>`;
  }).join('');

  const mWeek = wps.reduce((s, w) => s + (+w.mPerWeek || 0), 0);
  const hint = mWeek ? `geplande productiesnelheid in deze selectie: ${uvFmt(mWeek)} m/week (uit de planning)` : 'cumulatief afgezet tegen de geplande hoeveelheden';
  return `<div class="card">
    <div class="card-kop"><h2>Voortgang per periode<span class="tel">${rijen.length}</span></h2><span class="hint">${hint}</span>${seg}</div>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th>Periode</th><th class="num">Meters</th><th class="num">Boringen</th><th class="num">Meters cumulatief</th><th>% van gepland</th><th class="num">Boringen cumulatief</th><th>% van gepland</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="7" class="leeg">Nog geen registraties in deze selectie. Klik op “＋ Registratie”.</td></tr>'}</tbody>
    </table></div></div>`;
}

// Losse registraties, nieuwste bovenaan; klik op een rij om te bewerken.
function uvRegistratieTabel(regs, mag) {
  const rijen = regs.slice().sort((a, b) => {
    const sa = uvPeriodeStart(a.periode), sb = uvPeriodeStart(b.periode);
    return (sb ? sb.getTime() : 0) - (sa ? sa.getTime() : 0);
  }).map((r) => {
    const w = wpById(r.wpId);
    const info = uvPeriodeInfo(r.periode);
    return `<tr class="rij uv-reg-rij" data-id="${htmlEsc(r.id)}">
      <td>${w ? `<strong>${htmlEsc(w.project)}</strong><div class="sub">${htmlEsc(apdVan(w))} · ${htmlEsc(w.wp)}</div>` : '—'}</td>
      <td>${htmlEsc(info.label)}${info.sub ? `<div class="sub">${htmlEsc(info.sub)}</div>` : ''}</td>
      <td class="num">${uvFmt(r.meters)}</td>
      <td class="num">${uvFmt(r.boringen)}</td>
      <td>${htmlEsc(r.notitie || '')}</td>
      <td>${htmlEsc(r.door || '—')}<div class="sub">${r.opgeslagenOp ? fmtDatum(r.opgeslagenOp.slice(0, 10)) : ''}</div></td>
      <td class="reg-acties">${mag ? `<button class="mini-knop" data-bewerk="${htmlEsc(r.id)}">bewerk</button>` : ''}</td>
    </tr>`;
  }).join('');
  return `<div class="card">
    <div class="card-kop"><h2>Registraties<span class="tel">${regs.length}</span></h2><span class="hint">Klik op een rij om te bewerken</span></div>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th>Werkpakket</th><th>Periode</th><th class="num">Meters</th><th class="num">Boringen</th><th>Notitie</th><th>Geregistreerd</th><th></th></tr></thead>
      <tbody>${rijen || '<tr><td colspan="7" class="leeg">Nog geen registraties vastgelegd.</td></tr>'}</tbody>
    </table></div></div>`;
}

function realisatieById(id) { return (State.realisaties || []).find((r) => r.id === id); }

/* --------------------------- Modal: registratie --------------------------- */
function realisatieForm(item, prefillWpId) {
  item = item || {};
  const wpSel = item.wpId || prefillWpId || '';
  const wpOpts = State.werkpakketten.slice().sort((a, b) => (a.project + a.wp).localeCompare(b.project + b.wp))
    .map((w) => `<option value="${htmlEsc(w.id)}"${w.id === wpSel ? ' selected' : ''}>${htmlEsc(w.project)} · ${htmlEsc(apdVan(w))} · ${htmlEsc(w.wp)}</option>`).join('');
  const type = item.periode ? uvPeriodeInfo(item.periode).type : 'week';
  const startDatum = item.periode ? uvPeriodeStart(item.periode) : VANDAAG;
  return `
    <div class="modal-veld"><label>Werkpakket</label><select id="uvWp">${wpOpts}</select></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Registreren per</label><select id="uvType">
        <option value="week"${type === 'week' ? ' selected' : ''}>Week</option>
        <option value="maand"${type === 'maand' ? ' selected' : ''}>Maand</option>
      </select></div>
      <div class="modal-veld"><label>Datum in de periode</label><input id="uvDatum" type="date" value="${isoDatum(startDatum)}">
        <span class="hint" id="uvPeriodeHint"></span></div>
    </div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Gerealiseerde meters</label><input id="uvMeters" type="number" min="0" step="1" value="${item.meters ?? ''}" placeholder="bijv. 850"></div>
      <div class="modal-veld"><label>Gerealiseerde boringen</label><input id="uvBoringen" type="number" min="0" step="1" value="${item.boringen ?? ''}" placeholder="bijv. 2"></div>
    </div>
    <div class="modal-veld"><label>Notitie</label><textarea id="uvNotitie" rows="2" placeholder="Toelichting, bijzonderheden, stagnatie…">${htmlEsc(item.notitie || '')}</textarea></div>
    <div class="modal-foot">
      ${item.id ? '<button class="verwijder-knop" id="uvVerwijder">Verwijderen</button>' : ''}
      <button class="ghost" id="uvAnnuleer">Annuleren</button>
      <button class="primair" id="uvOpslaan">Opslaan</button>
    </div>`;
}

function uvGekozenPeriode() {
  const d = parseDatum(el('#uvDatum').value);
  if (!d) return null;
  return el('#uvType').value === 'maand' ? uvMaandStr(d) : uvWeekStr(d);
}

function openRealisatie(item, prefillWpId) {
  if (!magReg()) { toast('Alleen ontwerpleider/manager kan de voortgang registreren', 'fout'); return; }
  openModal(item ? 'Registratie bewerken' : 'Voortgang registreren', realisatieForm(item, prefillWpId));
  const toonPeriode = () => {
    const p = uvGekozenPeriode();
    const info = p ? uvPeriodeInfo(p) : null;
    el('#uvPeriodeHint').textContent = info ? `→ ${info.label}${info.sub ? ` (${info.sub})` : ''}` : '';
  };
  toonPeriode();
  el('#uvDatum').addEventListener('change', toonPeriode);
  el('#uvType').addEventListener('change', toonPeriode);
  el('#uvOpslaan').addEventListener('click', () => {
    const wpId = el('#uvWp').value;
    const periode = uvGekozenPeriode();
    if (!wpId) { toast('Kies een werkpakket', 'fout'); return; }
    if (!periode) { toast('Kies een geldige datum in de periode', 'fout'); return; }
    const meters = el('#uvMeters').value === '' ? 0 : Math.max(0, +el('#uvMeters').value || 0);
    const boringen = el('#uvBoringen').value === '' ? 0 : Math.max(0, +el('#uvBoringen').value || 0);
    const rec = {
      id: (item && item.id) || nieuwId('uv'),
      wpId, periode, meters, boringen,
      notitie: el('#uvNotitie').value.trim(),
      door: window.Auth && typeof Auth.naam === 'function' ? Auth.naam() : '',
      opgeslagenOp: new Date().toISOString(),
    };
    State.realisaties = (State.realisaties || []).filter((r) => r.id !== rec.id);
    State.realisaties.push(rec);
    State.bewaar(); sluitModal(); renderUitvoering();
    if (typeof renderDashboardUitvoering === 'function') renderDashboardUitvoering();
    toast('Registratie opgeslagen', 'ok');
  });
  el('#uvAnnuleer').addEventListener('click', sluitModal);
  const vw = el('#uvVerwijder');
  if (vw) vw.addEventListener('click', () => {
    if (!confirm('Deze registratie verwijderen?')) return;
    State.realisaties = (State.realisaties || []).filter((r) => r.id !== item.id);
    State.bewaar(); sluitModal(); renderUitvoering();
    toast('Registratie verwijderd', 'ok');
  });
}

/* ------------------------ Modal: plan per werkpakket ---------------------- */
function openUvPlan(wp) {
  if (!wp) return;
  if (!magReg()) { toast('Alleen ontwerpleider/manager kan het uitvoeringsplan bewerken', 'fout'); return; }
  const pl = uvPlanVoor(wp.id);
  openModal(`Uitvoeringsplan — ${wp.project} · ${wp.wp}`, `
    <div class="modal-rij">
      <div class="modal-veld"><label>Geplande meters <span class="hint">(leeg = ${uvFmt(+wp.lengteNieuw || 0)} m uit de planning)</span></label>
        <input id="uvPlanMeters" type="number" min="0" step="1" value="${pl.meters ?? ''}" placeholder="${+wp.lengteNieuw || 0}"></div>
      <div class="modal-veld"><label>Geplande boringen</label>
        <input id="uvPlanBoringen" type="number" min="0" step="1" value="${pl.boringen ?? ''}" placeholder="bijv. 4"></div>
    </div>
    <div class="modal-foot">
      <button class="ghost" id="uvPlanAnnuleer">Annuleren</button>
      <button class="primair" id="uvPlanOpslaan">Opslaan</button>
    </div>`);
  el('#uvPlanOpslaan').addEventListener('click', () => {
    const meters = el('#uvPlanMeters').value;
    const boringen = el('#uvPlanBoringen').value;
    if (!State.uitvoeringPlan) State.uitvoeringPlan = {};
    if (meters === '' && boringen === '') delete State.uitvoeringPlan[wp.id];
    else State.uitvoeringPlan[wp.id] = {
      meters: meters === '' ? null : Math.max(0, +meters || 0),
      boringen: boringen === '' ? null : Math.max(0, +boringen || 0),
    };
    State.bewaar(); sluitModal(); renderUitvoering();
    toast('Uitvoeringsplan opgeslagen', 'ok');
  });
  el('#uvPlanAnnuleer').addEventListener('click', sluitModal);
}

/* --------------------------- Dashboardkaart ------------------------------- */
function renderDashboardUitvoering() {
  const kaart = el('#dashUvKaart'); if (!kaart) return;
  const scope = State.dashScope;
  const wps = scope === 'portfolio' ? State.werkpakketten : State.werkpakketten.filter((w) => w.project === scope);
  const t = uvTotalen(wps);
  if (!t.regs.length && !t.bGepland) { kaart.style.display = 'none'; return; }
  kaart.style.display = '';
  const tiles = [
    { cls: '', val: uvFmt(t.mGepland), label: 'meters gepland' },
    { cls: 'blauw', val: uvFmt(t.mReal), label: 'meters gerealiseerd' },
    { cls: t.mPct != null && t.mPct >= 100 ? 'groen' : 'blauw', val: t.mPct != null ? t.mPct + '%' : '—', label: '% meters' },
    { cls: '', val: uvFmt(t.bGepland), label: 'boringen gepland' },
    { cls: 'blauw', val: uvFmt(t.bReal), label: 'boringen gerealiseerd' },
    { cls: t.bPct != null && t.bPct >= 100 ? 'groen' : 'blauw', val: t.bPct != null ? t.bPct + '%' : '—', label: '% boringen' },
  ];
  el('#dashUv').innerHTML = tiles.map((x) =>
    `<div class="tstat ${x.cls} klikbaar" tabindex="0" role="button" title="Klik voor de voortgangsrapportage uitvoering"><b>${x.val}</b><span>${x.label}</span></div>`).join('');
  els('#dashUv .tstat').forEach((n) => {
    const open = () => {
      State.filters.project = scope === 'portfolio' ? '' : scope;
      renderUitvoering(); toonTab('uitvoering');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    n.addEventListener('click', open);
    n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

/* ------------------------- Samenvatting voor AI --------------------------- */
function uitvoeringRapportData(scope) {
  const wps = scope === 'portfolio' ? State.werkpakketten : State.werkpakketten.filter((w) => w.project === scope);
  const t = uvTotalen(wps);
  if (!t.regs.length && !t.bGepland) return null;
  const perProject = [...new Set(wps.map((w) => w.project))].sort().map((p) => {
    const pt = uvTotalen(wps.filter((w) => w.project === p));
    return { project: p, metersGepland: pt.mGepland, metersGerealiseerd: pt.mReal, pctMeters: pt.mPct, boringenGepland: pt.bGepland, boringenGerealiseerd: pt.bReal, pctBoringen: pt.bPct };
  }).filter((p) => p.metersGerealiseerd || p.boringenGerealiseerd || p.boringenGepland);
  const perPeriode = new Map();
  t.regs.forEach((r) => {
    const g = perPeriode.get(r.periode) || { meters: 0, boringen: 0 };
    g.meters += +r.meters || 0; g.boringen += +r.boringen || 0;
    perPeriode.set(r.periode, g);
  });
  const periodes = [...perPeriode.entries()]
    .map(([p, g]) => ({ p, ...g, start: uvPeriodeStart(p) }))
    .sort((a, b) => (a.start && b.start) ? a.start - b.start : 0)
    .slice(-10)
    .map((r) => ({ periode: uvPeriodeInfo(r.p).label, meters: r.meters, boringen: r.boringen }));
  return {
    metersGepland: t.mGepland, metersGerealiseerd: t.mReal, pctMetersGerealiseerd: t.mPct,
    boringenGepland: t.bGepland, boringenGerealiseerd: t.bReal, pctBoringenGerealiseerd: t.bPct,
    perProject, laatstePeriodes: periodes,
  };
}

/* --------------------------------- Init ----------------------------------- */
function uitvoeringInit() {
  const knop = el('#uvToevoegen');
  if (knop) knop.addEventListener('click', () => openRealisatie(null));
}

if (typeof window !== 'undefined') {
  window.renderUitvoering = renderUitvoering;
  window.renderDashboardUitvoering = renderDashboardUitvoering;
  window.uitvoeringRapportData = uitvoeringRapportData;
  window.uitvoeringInit = uitvoeringInit;
}
