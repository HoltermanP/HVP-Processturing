/* ==========================================================================
   Rechten-UI — "Mijn projecten", "Toewijzen" en "Accounts".

   - Mijn projecten: alleen de werkpakketten/projecten/taken waaraan de
     ingelogde gebruiker is toegewezen.
   - Toewijzen (ontwerpleider/manager): gebruikers per werkpakket koppelen.
   - Accounts (ontwerpleider/manager): rollen toekennen aan gebruikers.

   Gebruikt globale functies/State uit app.js + Auth uit auth.js (op runtime
   beschikbaar).
   ========================================================================== */
'use strict';

/* ----------------------------- Mijn projecten ---------------------------- */
function renderMijnProjecten() {
  const cont = el('#mijnInhoud');
  if (!cont) return;
  const kop = el('#mijnKop');
  if (kop) kop.innerHTML = `${htmlEsc(Auth.naam())} · rol <strong>${htmlEsc(Auth.ROL_LABELS[Auth.role] || Auth.role)}</strong>`;

  const mijn = Auth.mijnWerkpakketten();
  if (!mijn.length) {
    cont.innerHTML = `<div class="card"><div class="leeg">Je bent nog niet toegewezen aan werkpakketten.${
      Auth.magToewijzen()
        ? ' Wijs jezelf of anderen toe via het tabblad <strong>Toewijzen</strong>.'
        : ' Vraag je ontwerpleider om toewijzing — je kunt alle projecten wel inzien via de andere tabbladen.'}</div></div>`;
    return;
  }

  const projecten = [...new Set(mijn.map((w) => w.project))].sort();
  const tot = (typeof horizonRange === 'function') ? horizonRange().tot : new Date(VANDAAG.getTime() + 30 * 864e5);
  const taken = komendeTaken(mijn, tot).slice().sort((a, b) => (b.ernst - a.ernst) || (a.plannedStart - b.plannedStart));
  const kritiek = taken.filter((t) => t.ernst >= 3).length;

  const kpis = [
    { val: mijn.length, label: 'mijn werkpakketten', cls: 'blauw' },
    { val: projecten.length, label: 'projecten', cls: '' },
    { val: taken.length, label: 'taken in beeld', cls: 'amber' },
    { val: kritiek, label: 'kritieke taken', cls: 'rood' },
  ];
  const kpiHtml = `<div class="card"><div class="taken-stats">${kpis.map((t) =>
    `<div class="tstat ${t.cls}"><b>${t.val}</b><span>${t.label}</span></div>`).join('')}</div></div>`;

  const projHtml = projecten.map((p) => {
    const set = mijn.filter((w) => w.project === p).sort((a, b) => (apdVan(a) + a.wp).localeCompare(apdVan(b) + b.wp));
    return `<div class="card">
      <div class="card-kop"><h2>${htmlEsc(p)}<span class="tel">${set.length}</span></h2><span class="hint">jouw werkpakketten in dit project</span></div>
      <div class="mijn-grid">${set.map(mijnWpKaart).join('')}</div>
    </div>`;
  }).join('');

  const takenHtml = taken.length ? `<div class="card">
    <div class="card-kop"><h2>Mijn taken — komende periode</h2><span class="hint">uit de fasevensters en doorlooptijden van jouw werkpakketten</span></div>
    <div id="mijnTaken">${taken.slice(0, 20).map(taakKaart).join('')}</div>
  </div>` : '';

  cont.innerHTML = kpiHtml + projHtml + takenHtml;
  els('#mijnInhoud .mijn-wp').forEach((c) => {
    const open = () => openDetail(c.dataset.wp);
    c.addEventListener('click', open);
    c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  els('#mijnTaken .taak[data-wp]').forEach((t) => t.addEventListener('click', () => openDetail(t.dataset.wp)));
  if (typeof bindTaakHulp === 'function') bindTaakHulp('#mijnTaken');
}

function mijnWpKaart(w) {
  const av = activiteitVoortgang(w);
  const hf = huidigeFase(w);
  const sigs = signalen(w);
  const faseLabel = hf.fase ? hf.fase.naam : 'Onbekend';
  const kleur = hf.fase ? hf.fase.kleur : '#cbd5e1';
  return `<div class="mijn-wp" data-wp="${htmlEsc(w.id)}" tabindex="0" role="button">
    <div class="mijn-wp-kop"><strong>${htmlEsc(w.wp)}</strong><span class="sub">APD ${htmlEsc(apdVan(w))} · ${htmlEsc(w.tracStart)} → ${htmlEsc(w.tracEind)}</span></div>
    <div class="mijn-wp-fase" style="--c:${kleur}"><span class="stip" style="background:${kleur}"></span>${htmlEsc(faseLabel)} <span class="badge ${hf.status === 'afgerond' ? 'done' : hf.status === 'gepland' ? 'plan' : 'live'}">${htmlEsc(hf.status)}</span></div>
    <div class="statbar"><span class="stseg" style="width:${av.pct}%;background:var(--groen,#10b981)"></span></div>
    <div class="mijn-wp-meta">${av.klaar}/${av.totaal} activiteiten · ${av.pct}%${sigs.length ? ` · <span style="color:var(--rood,#ef4444)">${sigs.length} signaal(en)</span>` : ''}</div>
  </div>`;
}

/* ------------------------------ Mijn taken -------------------------------- */
// Persoonlijke taaklijst: wat moet IK (het ingelogde account) doen in de
// gekozen periode, gegroepeerd op urgentie zodat direct duidelijk is waar je
// moet beginnen.
const MIJN_HORIZONS = [
  { id: '7',  label: 'Komende week',     dagen: 7 },
  { id: '14', label: 'Komende 14 dagen', dagen: 14 },
  { id: '30', label: 'Komende maand',    dagen: 30 },
];

function renderMijnTaken() {
  const cont = el('#mtInhoud');
  if (!cont) return;
  const kop = el('#mtKop');
  if (kop) kop.innerHTML = `Persoonlijke taaklijst van <strong>${htmlEsc(Auth.naam())}</strong> — berekend uit de werkpakketten waaraan jij bent toegewezen.`;

  const kiezer = el('#mtHorizonKiezer');
  kiezer.innerHTML = MIJN_HORIZONS.map((h) =>
    `<button data-h="${h.id}"${h.id === State.mijnHorizon ? ' class="actief"' : ''}>${htmlEsc(h.label)}</button>`).join('');
  els('#mtHorizonKiezer button').forEach((b) => b.addEventListener('click', () => { State.mijnHorizon = b.dataset.h; renderMijnTaken(); }));

  const mijn = Auth.mijnWerkpakketten();
  if (!mijn.length) {
    cont.innerHTML = `<div class="card"><div class="leeg">Je bent nog niet toegewezen aan werkpakketten, dus er zijn geen persoonlijke taken.${
      Auth.magToewijzen()
        ? ' Wijs jezelf of anderen toe via het tabblad <strong>Toewijzen</strong>.'
        : ' Vraag je ontwerpleider om toewijzing.'}</div></div>`;
    return;
  }

  const h = MIJN_HORIZONS.find((x) => x.id === State.mijnHorizon) || MIJN_HORIZONS[0];
  const van = new Date(VANDAAG);
  const tot = new Date(VANDAAG); tot.setDate(tot.getDate() + h.dagen);
  const taken = komendeTaken(mijn, tot);

  // Urgentie-groepen: direct oppakken → deze week starten → daarna.
  const weekGrens = new Date(VANDAAG); weekGrens.setDate(weekGrens.getDate() + 7);
  const direct = taken.filter((t) => t.ernst >= 3 || t.overtijd || VANDAAG > t.latestStart)
    .sort((a, b) => a.faseEind - b.faseEind);
  const dezeWeek = taken.filter((t) => !direct.includes(t) && (t.plannedStart <= weekGrens || t.latestStart <= weekGrens))
    .sort((a, b) => a.latestStart - b.latestStart);
  const later = taken.filter((t) => !direct.includes(t) && !dezeWeek.includes(t))
    .sort((a, b) => a.plannedStart - b.plannedStart);

  let mp = 0;
  mijn.forEach((w) => MIJLPALEN.forEach((m) => { const d = parseDatum(w.mijlpalen[m.key]); if (d && d >= van && d <= tot) mp++; }));

  const stats = [
    { val: taken.length, label: 'taken in deze periode', cls: 'blauw' },
    { val: direct.length, label: 'direct oppakken', cls: 'rood' },
    { val: dezeWeek.length, label: 'deze week starten', cls: 'amber' },
    { val: mp, label: 'mijlpalen in periode', cls: 'groen' },
  ];
  const statsHtml = `<div class="card">
    <div class="card-kop"><h2>Periode: <span style="color:var(--accent)">${fmtDatum(van)} → ${fmtDatum(tot)}</span> <span class="hint">(${htmlEsc(h.label.toLowerCase())})</span></h2></div>
    <div class="taken-stats">${stats.map((t) => `<div class="tstat ${t.cls}"><b>${t.val}</b><span>${t.label}</span></div>`).join('')}</div>
  </div>`;

  const groep = (titel, lijst, vlagKleur, uitleg) => {
    if (!lijst.length) return '';
    return `<div class="taakgroep">
      <div class="taakgroep-kop"><span class="vlag" style="background:${vlagKleur}"></span>${titel}<span class="hint">${uitleg}</span><span class="telp">${lijst.length}</span></div>
      ${lijst.map(mijnTaakKaart).join('')}</div>`;
  };

  const inhoud =
    groep('Direct oppakken', direct, '#ef4444', 'te laat, geblokkeerd of uiterste startdatum verstreken') +
    groep('Deze week starten', dezeWeek, '#f59e0b', 'gepland of uiterlijk te starten binnen 7 dagen') +
    groep('Daarna in deze periode', later, '#3b82f6', 'volgens de faseplanning');

  cont.innerHTML = statsHtml + (inhoud || '<div class="card"><div class="leeg">Geen taken in deze periode — alles is gereed of gepland na de gekozen horizon. 👍</div></div>');

  els('#mtInhoud .taak[data-wp]').forEach((t) => t.addEventListener('click', () => openDetail(t.dataset.wp)));
  if (typeof bindTaakHulp === 'function') bindTaakHulp('#mtInhoud');
  els('#mtInhoud .taak-gereed').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const { wp, code } = b.dataset;
    if (window.Auth && !Auth.magWpBewerken(wp)) return;
    State.wpVoortgang(wp)[code] = Object.assign(State.wpVoortgang(wp)[code] || {}, { status: 'gereed' });
    State.bewaar();
    toast('Activiteit gereed gemeld', 'ok');
    render();
  }));
}

// Taakkaart voor de persoonlijke lijst: wát moet er gebeuren (activiteit +
// omschrijving), wáár (project/WP), wannéér (uiterste start + deadline) en een
// knop om direct gereed te melden.
function mijnTaakKaart(t) {
  const w = t.wp;
  const dagen = dagenVerschil(VANDAAG, t.faseEind);
  const deadlineTxt = t.overtijd
    ? `<span style="color:var(--rood)">${Math.abs(dagen)}d over deadline</span>`
    : `nog <b>${dagen}d</b> tot fase-eind`;
  const startTxt = VANDAAG > t.latestStart
    ? '<b style="color:var(--rood)">vandaag starten</b>'
    : `uiterlijk starten: <b>${fmtDatum(t.latestStart)}</b>`;
  const vlaggen = t.flags.map((f) => `<span class="tflag ${f}">${f}</span>`).join('');
  const stKleur = STATUSSEN[t.status].kleur;
  const notitie = ((State.voortgang[w.id] || {})[t.activiteit.code] || {}).notitie || '';
  const magBew = !window.Auth || Auth.magWpBewerken(w.id);
  const hulp = (typeof actHulpHtml === 'function') ? actHulpHtml(t.activiteit.code) : '';
  return `<div class="taak ernst-${t.ernst}" data-wp="${htmlEsc(w.id)}">
    <div class="taak-hoofd">
      <div class="taak-titel"><span class="tcode">${htmlEsc(t.activiteit.code)}</span>${htmlEsc(t.activiteit.naam)}</div>
      <div class="taak-omschr">${htmlEsc(t.activiteit.omschrijving)}</div>
      ${notitie ? `<div class="taak-notitie">📝 ${htmlEsc(notitie)}</div>` : ''}
      <div class="taak-meta">
        <span>${htmlEsc(w.project)} · ${htmlEsc(apdVan(w))} · <b>${htmlEsc(w.wp)}</b></span>
        <span>fase: <b>${htmlEsc(t.fase.naam)}</b></span>
        <span>doorlooptijd: <b>${t.dt} wd</b></span>
      </div>
      ${hulp ? `<button class="taak-info-knop" type="button" aria-expanded="false">ℹ︎ Wat houdt deze stap in?</button><div class="taak-hulp">${hulp}</div>` : ''}
    </div>
    <div class="taak-rechts">
      <div class="taak-vlaggen">${vlaggen}<span class="statuschip" style="background:${stKleur}">${STATUSSEN[t.status].label}</span></div>
      <div class="taak-deadline">${deadlineTxt} <em>(${fmtDatum(t.faseEind)})</em></div>
      <div class="hint">${startTxt}</div>
      ${magBew ? `<button class="taak-gereed" data-wp="${htmlEsc(w.id)}" data-code="${htmlEsc(t.activiteit.code)}" title="Zet deze activiteit op Gereed">✓ Meld gereed</button>` : ''}
    </div>
  </div>`;
}

/* -------------------------------- Toewijzen ------------------------------ */
function toewijsZichtbareWps() {
  const f = State.filters; const zoek = (f.zoek || '').toLowerCase();
  return State.werkpakketten.filter((w) => {
    if (f.project && w.project !== f.project) return false;
    if (f.apd && apdVan(w) !== f.apd) return false;
    if (zoek) {
      const blob = `${w.project} ${apdVan(w)} ${w.wp} ${w.engineer || ''}`.toLowerCase();
      if (!blob.includes(zoek)) return false;
    }
    return true;
  });
}

function renderToewijzen() {
  const cont = el('#toewijzenInhoud');
  if (!cont) return;
  if (!Auth.magToewijzen()) { cont.innerHTML = '<div class="card"><div class="leeg">Je hebt geen rechten om toe te wijzen.</div></div>'; return; }

  const users = Object.values(State.gebruikers).sort((a, b) => a.naam.localeCompare(b.naam));
  if (!users.length) {
    cont.innerHTML = '<div class="card"><div class="leeg">Nog geen gebruikers bekend. Gebruikers verschijnen hier zodra ze voor het eerst inloggen.</div></div>';
    return;
  }
  const userNaam = (id) => { const u = State.gebruikers[id]; return u ? u.naam : id; };
  const userRol = (id) => { const u = State.gebruikers[id]; return u ? (Auth.ROL_LABELS[u.role] || u.role) : ''; };

  const wps = toewijsZichtbareWps();
  const projecten = [...new Set(wps.map((w) => w.project))].sort();

  const projHtml = projecten.map((p) => {
    const set = wps.filter((w) => w.project === p).sort((a, b) => (apdVan(a) + a.wp).localeCompare(apdVan(b) + b.wp));
    const rows = set.map((w) => {
      const toegewezen = State.toewijzingen[w.id] || [];
      const chips = toegewezen.length
        ? toegewezen.map((uid) => `<span class="toew-chip">${htmlEsc(userNaam(uid))}<button class="chip-x" data-wp="${htmlEsc(w.id)}" data-uid="${htmlEsc(uid)}" title="Verwijder toewijzing">✕</button></span>`).join('')
        : '<span class="toew-leeg">niemand toegewezen</span>';
      const beschikbaar = users.filter((u) => !toegewezen.includes(u.id));
      const opts = `<option value="">+ toewijzen…</option>` + beschikbaar.map((u) => `<option value="${htmlEsc(u.id)}">${htmlEsc(u.naam)} — ${htmlEsc(Auth.ROL_LABELS[u.role] || u.role)}</option>`).join('');
      return `<tr>
        <td><strong>${htmlEsc(w.wp)}</strong><div class="sub">APD ${htmlEsc(apdVan(w))} · ${htmlEsc(w.engineer || '—')}</div></td>
        <td><div class="toew-chips">${chips}</div></td>
        <td><select class="toew-add" data-wp="${htmlEsc(w.id)}">${opts}</select></td>
      </tr>`;
    }).join('');
    return `<div class="card">
      <div class="card-kop"><h2>${htmlEsc(p)}<span class="tel">${set.length}</span></h2></div>
      <div class="tabel-wrap"><table class="tabel toew-tabel">
        <thead><tr><th>Werkpakket</th><th>Toegewezen gebruikers</th><th>Toevoegen</th></tr></thead>
        <tbody>${rows}</tbody></table></div>
    </div>`;
  }).join('');

  cont.innerHTML = `<div class="card"><p class="sub">Wijs gebruikers toe aan werkpakketten. Een toegewezen gebruiker ziet het werkpakket onder <strong>Mijn projecten</strong> en mag de voortgang ervan bewerken. Gebruik de zoek-/projectfilter bovenaan om de lijst te beperken.</p></div>${projHtml || '<div class="card"><div class="leeg">Geen werkpakketten in deze selectie.</div></div>'}`;

  els('#toewijzenInhoud .toew-add').forEach((sel) => sel.addEventListener('change', (e) => {
    const uid = e.target.value; const wpId = e.target.dataset.wp;
    if (!uid) return;
    const lijst = State.toewijzingen[wpId] || (State.toewijzingen[wpId] = []);
    if (!lijst.includes(uid)) lijst.push(uid);
    State.bewaar();
    renderToewijzen(); renderMijnProjecten(); renderMijnTaken();
    toast(`${userNaam(uid)} toegewezen`, 'ok');
  }));
  els('#toewijzenInhoud .chip-x').forEach((b) => b.addEventListener('click', () => {
    const { wp: wpId, uid } = b.dataset;
    State.toewijzingen[wpId] = (State.toewijzingen[wpId] || []).filter((x) => x !== uid);
    if (!State.toewijzingen[wpId].length) delete State.toewijzingen[wpId];
    State.bewaar();
    renderToewijzen(); renderMijnProjecten(); renderMijnTaken();
    toast('Toewijzing verwijderd', 'ok');
  }));
}

/* -------------------------------- Accounts ------------------------------- */
function renderAccounts() {
  const cont = el('#accountsInhoud');
  if (!cont) return;
  if (!Auth.magAccounts()) { cont.innerHTML = '<div class="card"><div class="leeg">Je hebt geen rechten voor accountbeheer.</div></div>'; return; }

  const users = Object.values(State.gebruikers).sort((a, b) => a.naam.localeCompare(b.naam));
  const aantalWpVan = (uid) => Object.values(State.toewijzingen).filter((l) => l.includes(uid)).length;
  const beheerders = users.filter((u) => Auth.VOLLEDIG.includes(u.role)).length;

  const rows = users.map((u) => {
    const opts = Auth.ROLLEN.map((r) => `<option value="${r}"${r === u.role ? ' selected' : ''}>${Auth.ROL_LABELS[r]}</option>`).join('');
    const ik = u.id === Auth.userId ? ' <span class="acc-ik">jij</span>' : '';
    return `<tr>
      <td><strong>${htmlEsc(u.naam)}</strong>${ik}</td>
      <td class="sub">${htmlEsc(u.email || '—')}</td>
      <td class="num">${aantalWpVan(u.id)}</td>
      <td>${u.sinds ? fmtDatum(u.sinds) : '—'}</td>
      <td><select class="acc-rol" data-uid="${htmlEsc(u.id)}">${opts}</select></td>
    </tr>`;
  }).join('');

  cont.innerHTML = `<div class="card">
    <p class="sub">Ken rollen toe. <strong>Ontwerpleider</strong> en <strong>Manager</strong> mogen alles bewerken, toewijzen en accounts beheren. De overige rollen bewerken alleen hun toegewezen werkpakketten. Gebruikers verschijnen automatisch zodra ze voor het eerst inloggen.</p>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th>Naam</th><th>E-mail</th><th class="num">Toegewezen WP's</th><th>Sinds</th><th>Rol</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5" class="leeg">Nog geen gebruikers bekend.</td></tr>'}</tbody>
    </table></div>
  </div>`;

  els('#accountsInhoud .acc-rol').forEach((sel) => sel.addEventListener('change', (e) => {
    const uid = e.target.dataset.uid; const nieuw = e.target.value;
    const u = State.gebruikers[uid]; if (!u) return;
    // Voorkom dat de laatste beheerder zichzelf wegzet → lock-out.
    if (Auth.VOLLEDIG.includes(u.role) && !Auth.VOLLEDIG.includes(nieuw) && beheerders <= 1) {
      toast('Er moet minstens één ontwerpleider/manager blijven', 'fout');
      renderAccounts();
      return;
    }
    u.role = nieuw;
    State.bewaar();
    if (uid === Auth.userId) { Auth.herlaadRol(); gateUI(); render(); }
    renderAccounts();
    toast(`${u.naam} is nu ${Auth.ROL_LABELS[nieuw]}`, 'ok');
  }));
}

if (typeof window !== 'undefined') {
  window.renderMijnProjecten = renderMijnProjecten;
  window.renderMijnTaken = renderMijnTaken;
  window.renderToewijzen = renderToewijzen;
  window.renderAccounts = renderAccounts;
}
