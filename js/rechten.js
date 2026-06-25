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
    renderToewijzen(); renderMijnProjecten();
    toast(`${userNaam(uid)} toegewezen`, 'ok');
  }));
  els('#toewijzenInhoud .chip-x').forEach((b) => b.addEventListener('click', () => {
    const { wp: wpId, uid } = b.dataset;
    State.toewijzingen[wpId] = (State.toewijzingen[wpId] || []).filter((x) => x !== uid);
    if (!State.toewijzingen[wpId].length) delete State.toewijzingen[wpId];
    State.bewaar();
    renderToewijzen(); renderMijnProjecten();
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
  window.renderToewijzen = renderToewijzen;
  window.renderAccounts = renderAccounts;
}
