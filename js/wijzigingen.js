/* ==========================================================================
   Wijzigingenregister & VTW's (Verzoek Tot Wijziging).

   - Een wijziging hangt aan een werkpakket en betreft één van de posten uit
     de TSB: een begrotingspost (regelitem), uren of kosten. Vastgelegd worden
     indiener, datum, korte omschrijving, uitgebreide toelichting en de
     financiële impact (uren en/of bedrag).
   - Status: nieuw → ingediend → goedgekeurd/afgekeurd. Bij afkeuren hoort een
     toelichting.
   - Geselecteerde wijzigingen worden gebundeld in een VTW: een notitie volgens
     het format uit Beheer → Instellingen (State.instellingen.vtwFormat); is er
     geen format, dan hanteert de AI zelf een professioneel VTW-format. De AI
     schrijft de hele VTW op basis van de wijzigingen plus de beschikbare
     projectinformatie (voortgang, fase, TSB-cijfers).

   Data: State.wijzigingen (array) en State.vtws (array), gesynchroniseerd via
   db.js/Neon. Gebruikt globals uit app.js/registers.js/tsb.js op runtime.
   ========================================================================== */
'use strict';

/* ------------------------------- Constanten ------------------------------ */
const WZ_STATUS = {
  nieuw:       { label: 'Nieuw',       kleur: '#94a3b8' },
  ingediend:   { label: 'Ingediend',   kleur: '#0ea5e9' },
  goedgekeurd: { label: 'Goedgekeurd', kleur: '#10b981' },
  afgekeurd:   { label: 'Afgekeurd',   kleur: '#ef4444' },
};
const WZ_POSTEN = [
  ['begroting', 'TSB-begrotingspost'],
  ['uren', 'Uren'],
  ['kosten', 'Kosten'],
];

// Niet-persistente UI-staat.
const WzUI = { filter: 'alle', selectie: new Set(), vtwOpen: null };

/* -------------------------------- Helpers -------------------------------- */
function wzPostLabel(p) { const m = WZ_POSTEN.find((x) => x[0] === p); return m ? m[1] : p; }
function wzById(id) { return (State.wijzigingen || []).find((w) => w.id === id); }
function vtwById(id) { return (State.vtws || []).find((v) => v.id === id); }
function magWzBeheren() { return !window.Auth || Auth.magVolledig(); }
function magWzBewerken(wz) {
  if (magWzBeheren()) return true;
  // Indieners mogen hun eigen wijziging bewerken zolang die niet is beoordeeld.
  return Auth.magWpBewerken(wz.wpId) && (wz.status === 'nieuw' || wz.status === 'ingediend');
}
function wzGeld(n) { return (Number(n) || 0).toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }); }
// TSB-project (begroting) bij een planningsproject, indien aanwezig.
function wzTsbProject(projectNaam) {
  const d = State.tsb || {};
  return (d.projecten || []).find((p) => p.projectNaam === projectNaam) || null;
}
// Regelitems van een TSB-project als platte lijst voor de koppel-select.
function wzTsbItems(tp) {
  const uit = [];
  (tp && tp.fasen || []).forEach((f) => (f.groepen || []).forEach((g) => (g.items || []).forEach((i) => {
    uit.push({ id: i.id, label: `${f.naam} · ${g.naam} · ${i.naam}` });
  })));
  return uit;
}
function wzTsbItemLabel(wz) {
  if (!wz.tsbItemId) return '';
  const wp = wpById(wz.wpId);
  const tp = wp ? wzTsbProject(wp.project) : null;
  const item = wzTsbItems(tp).find((i) => i.id === wz.tsbItemId);
  return item ? item.label : '';
}
function wzImpactHtml(wz) {
  const delen = [];
  if (wz.uren) delen.push(`${(+wz.uren).toLocaleString('nl-NL')} uur`);
  if (wz.bedrag) delen.push(wzGeld(wz.bedrag));
  return delen.length ? delen.join(' · ') : '—';
}

/* ------------------------------- Overzicht ------------------------------- */
function wzGefilterd() {
  const f = State.filters; const zoek = (f.zoek || '').toLowerCase();
  return (State.wijzigingen || []).map((wz) => ({ wz, wp: wpById(wz.wpId) })).filter(({ wz, wp }) => {
    if (!wp) return false;
    if (f.project && wp.project !== f.project) return false;
    if (f.apd && apdVan(wp) !== f.apd) return false;
    if (f.engineer && wp.engineer !== f.engineer) return false;
    if (zoek) {
      const blob = `${wp.project} ${apdVan(wp)} ${wp.wp} ${wz.omschrijving} ${wz.toelichting} ${wz.ingediendDoor}`.toLowerCase();
      if (!blob.includes(zoek)) return false;
    }
    return true;
  });
}

function renderWijzigingen() {
  if (!el('#wzKpis')) return;
  const alle = wzGefilterd();
  // Opruimen: selectie kan verouderde id's bevatten.
  WzUI.selectie.forEach((id) => { if (!wzById(id)) WzUI.selectie.delete(id); });

  const tel = { totaal: alle.length };
  Object.keys(WZ_STATUS).forEach((s) => { tel[s] = alle.filter(({ wz }) => wz.status === s).length; });
  const tiles = [
    { tf: 'alle', cls: 'blauw', val: tel.totaal, label: 'totaal' },
    { tf: 'nieuw', cls: '', val: tel.nieuw, label: 'nieuw' },
    { tf: 'ingediend', cls: 'amber', val: tel.ingediend, label: 'ingediend' },
    { tf: 'goedgekeurd', cls: 'groen', val: tel.goedgekeurd, label: 'goedgekeurd' },
    { tf: 'afgekeurd', cls: 'rood', val: tel.afgekeurd, label: 'afgekeurd' },
  ];
  el('#wzKpis').innerHTML = tiles.map((t) =>
    `<div class="tstat ${t.cls} klikbaar${WzUI.filter === t.tf ? ' actief' : ''}" data-tf="${t.tf}" tabindex="0" role="button"><b>${t.val}</b><span>${t.label}</span></div>`).join('');
  els('#wzKpis .tstat[data-tf]').forEach((t) => {
    const zet = () => { WzUI.filter = WzUI.filter === t.dataset.tf ? 'alle' : t.dataset.tf; renderWijzigingen(); };
    t.addEventListener('click', zet);
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zet(); } });
  });

  let lijst = alle.slice();
  if (WzUI.filter !== 'alle') lijst = lijst.filter(({ wz }) => wz.status === WzUI.filter);
  lijst.sort((a, b) => (b.wz.datum || '').localeCompare(a.wz.datum || ''));

  const rows = lijst.map(({ wz, wp }) => {
    const st = WZ_STATUS[wz.status] || WZ_STATUS.nieuw;
    const vtw = wz.vtwId ? vtwById(wz.vtwId) : null;
    const item = wzTsbItemLabel(wz);
    return `<tr data-id="${htmlEsc(wz.id)}" class="rij">
      <td class="wz-sel"><input type="checkbox" data-sel="${htmlEsc(wz.id)}"${WzUI.selectie.has(wz.id) ? ' checked' : ''} title="Selecteer voor VTW"></td>
      <td>${fmtDatum(parseDatum(wz.datum))}</td>
      <td><strong>${htmlEsc(wp.project)}</strong><div class="sub">${htmlEsc(apdVan(wp))} · ${htmlEsc(wp.wp)}</div></td>
      <td>${htmlEsc(wzPostLabel(wz.post))}${item ? `<div class="sub">${htmlEsc(item)}</div>` : ''}</td>
      <td><div style="max-width:320px">${htmlEsc(wz.omschrijving || '')}</div>${wz.status === 'afgekeurd' && wz.afkeurToelichting ? `<div class="sub" style="color:var(--rood)">Afkeur: ${htmlEsc(wz.afkeurToelichting)}</div>` : ''}</td>
      <td class="num">${wzImpactHtml(wz)}</td>
      <td>${htmlEsc(wz.ingediendDoor || '—')}</td>
      <td>${regBadge(st)}${vtw ? `<div class="sub">${htmlEsc(vtw.nummer)}</div>` : ''}</td>
      <td class="reg-acties"><button class="mini-knop" data-bewerk="${htmlEsc(wz.id)}">bewerk</button></td>
    </tr>`;
  }).join('');

  const selTel = WzUI.selectie.size;
  el('#wzInhoud').innerHTML = `<div class="card">
    <div class="card-kop"><h2>Wijzigingenregister<span class="tel">${lijst.length}</span></h2>
      <div class="knoppenrij">
        ${selTel ? `<span class="hint">${selTel} geselecteerd</span>` : '<span class="hint">Vink wijzigingen aan om een VTW te maken</span>'}
        <button class="primair" id="wzVtwMaken"${selTel ? '' : ' disabled'}>✦ VTW maken (${selTel})</button>
      </div></div>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th></th><th>Datum</th><th>Werkpakket</th><th>Post</th><th>Omschrijving</th><th class="num">Impact</th><th>Ingediend door</th><th>Status</th><th></th></tr></thead>
      <tbody>${rows || `<tr><td colspan="9" class="leeg">${alle.length ? 'Geen wijzigingen in deze selectie.' : 'Nog geen wijzigingen geregistreerd. Klik op “Toevoegen”.'}</td></tr>`}</tbody>
    </table></div></div>`;

  els('#wzInhoud .rij').forEach((tr) => tr.addEventListener('click', (e) => {
    if (e.target.closest('[data-sel]')) return;   // checkbox klikt niet door naar de modal
    openWijziging(wzById(tr.dataset.id));
  }));
  els('#wzInhoud [data-sel]').forEach((cb) => cb.addEventListener('change', () => {
    if (cb.checked) WzUI.selectie.add(cb.dataset.sel); else WzUI.selectie.delete(cb.dataset.sel);
    renderWijzigingen();
  }));
  const vtwKnop = el('#wzVtwMaken');
  if (vtwKnop) vtwKnop.addEventListener('click', openVtwModal);

  renderVtwLijst();
  // VTW-format in Beheer meevullen (bewerken alleen voor ontwerpleider/manager).
  const ta = el('#instVtwFormat');
  if (ta && document.activeElement !== ta) ta.value = State.instellingen.vtwFormat || '';
}

/* ----------------------- Wijziging toevoegen/bewerken -------------------- */
function wzForm(item) {
  item = item || {};
  const wpSel = item.wpId || '';
  const wpOpts = State.werkpakketten.slice().sort((a, b) => (a.project + a.wp).localeCompare(b.project + b.wp))
    .map((w) => `<option value="${htmlEsc(w.id)}"${w.id === wpSel ? ' selected' : ''}>${htmlEsc(w.project)} · ${htmlEsc(apdVan(w))} · ${htmlEsc(w.wp)}</option>`).join('');
  const postOpts = WZ_POSTEN.map(([v, l]) => `<option value="${v}"${v === (item.post || 'begroting') ? ' selected' : ''}>${l}</option>`).join('');
  // Statuskeuzes: beoordelen (goed-/afkeuren) is aan ontwerpleider/manager.
  const statussen = magWzBeheren() ? Object.keys(WZ_STATUS) : ['nieuw', 'ingediend'];
  const statusOpts = statussen.map((k) => `<option value="${k}"${k === (item.status || 'nieuw') ? ' selected' : ''}>${WZ_STATUS[k].label}</option>`).join('');
  return `
    <div class="modal-veld"><label>Werkpakket</label><select id="wzWp">${wpOpts}</select></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Post (uit de TSB)</label><select id="wzPost">${postOpts}</select></div>
      <div class="modal-veld"><label>TSB-begrotingspost (optioneel)</label><select id="wzTsbItem"><option value="">—</option></select></div>
    </div>
    <div class="modal-veld"><label>Korte omschrijving</label><input id="wzOmschr" value="${htmlEsc(item.omschrijving || '')}" placeholder="bijv. Extra boring t.h.v. duiker DR04"></div>
    <div class="modal-veld"><label>Toelichting</label><textarea id="wzToelichting" rows="4" placeholder="Aanleiding, scope en gevolgen van de wijziging…">${htmlEsc(item.toelichting || '')}</textarea></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Impact — uren (optioneel)</label><input id="wzUren" type="number" step="any" value="${item.uren ?? ''}" placeholder="bijv. 24"></div>
      <div class="modal-veld"><label>Impact — bedrag € (optioneel)</label><input id="wzBedrag" type="number" step="any" value="${item.bedrag ?? ''}" placeholder="bijv. 8500"></div>
    </div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Ingediend door</label><input id="wzDoor" value="${htmlEsc(item.ingediendDoor || (window.Auth ? Auth.naam() : ''))}"></div>
      <div class="modal-veld"><label>Datum</label><input id="wzDatum" type="date" value="${htmlEsc(item.datum || isoDatum(new Date()))}"></div>
    </div>
    <div class="modal-veld"><label>Status</label><select id="wzStatus">${statusOpts}</select></div>
    <div class="modal-veld" id="wzAfkeurVeld" style="display:none">
      <label>Toelichting bij afkeuring</label>
      <textarea id="wzAfkeur" rows="2" placeholder="Waarom wordt deze wijziging afgekeurd?">${htmlEsc(item.afkeurToelichting || '')}</textarea>
    </div>
    <div class="modal-foot">
      ${item.id && magWzBeheren() ? '<button class="verwijder-knop" id="wzVerwijder">Verwijderen</button>' : ''}
      <button class="ghost" id="wzAnnuleer">Annuleren</button>
      <button class="primair" id="wzOpslaan">Opslaan</button>
    </div>`;
}

// Vul de regelitem-select op basis van het gekozen werkpakket + post.
function wzVulTsbItems(huidigItemId) {
  const wp = wpById(el('#wzWp').value);
  const post = el('#wzPost').value;
  const sel = el('#wzTsbItem');
  const tp = wp ? wzTsbProject(wp.project) : null;
  if (post !== 'begroting' || !tp) {
    sel.innerHTML = `<option value="">${post !== 'begroting' ? '— n.v.t. —' : '— geen TSB voor dit project —'}</option>`;
    sel.disabled = true;
    return;
  }
  sel.disabled = false;
  sel.innerHTML = '<option value="">— kies begrotingspost —</option>' + wzTsbItems(tp)
    .map((i) => `<option value="${htmlEsc(i.id)}"${i.id === huidigItemId ? ' selected' : ''}>${htmlEsc(i.label)}</option>`).join('');
}

function openWijziging(item) {
  if (item && !magWzBewerken(item)) { toast('Je kunt deze wijziging niet bewerken (al beoordeeld of niet toegewezen)', 'fout'); return; }
  if (!item && window.Auth && !Auth.magVolledig() && !Auth.mijnWerkpakketten().length) {
    toast('Je bent aan geen enkel werkpakket toegewezen', 'fout'); return;
  }
  openModal(item ? `Wijziging bewerken` : 'Wijziging registreren', wzForm(item));
  wzVulTsbItems(item && item.tsbItemId);
  const toonAfkeur = () => { el('#wzAfkeurVeld').style.display = el('#wzStatus').value === 'afgekeurd' ? '' : 'none'; };
  toonAfkeur();
  el('#wzStatus').addEventListener('change', toonAfkeur);
  el('#wzWp').addEventListener('change', () => wzVulTsbItems(null));
  el('#wzPost').addEventListener('change', () => wzVulTsbItems(null));

  el('#wzOpslaan').addEventListener('click', () => {
    const wpId = el('#wzWp').value;
    const omschrijving = el('#wzOmschr').value.trim();
    const status = el('#wzStatus').value;
    const afkeur = el('#wzAfkeur') ? el('#wzAfkeur').value.trim() : '';
    if (!wpId) { toast('Kies een werkpakket', 'fout'); return; }
    if (!omschrijving) { toast('Vul een korte omschrijving in', 'fout'); return; }
    if (status === 'afgekeurd' && !afkeur) { toast('Vul een toelichting bij de afkeuring in', 'fout'); el('#wzAfkeur').focus(); return; }
    const rec = {
      id: (item && item.id) || nieuwId('wz'),
      wpId,
      post: el('#wzPost').value,
      tsbItemId: el('#wzTsbItem').disabled ? null : (el('#wzTsbItem').value || null),
      omschrijving,
      toelichting: el('#wzToelichting').value.trim(),
      uren: el('#wzUren').value === '' ? null : +String(el('#wzUren').value).replace(',', '.'),
      bedrag: el('#wzBedrag').value === '' ? null : +String(el('#wzBedrag').value).replace(',', '.'),
      ingediendDoor: el('#wzDoor').value.trim() || (window.Auth ? Auth.naam() : ''),
      datum: el('#wzDatum').value || isoDatum(new Date()),
      status,
      afkeurToelichting: status === 'afgekeurd' ? afkeur : '',
      vtwId: (item && item.vtwId) || null,
    };
    State.wijzigingen = (State.wijzigingen || []).filter((w) => w.id !== rec.id);
    State.wijzigingen.push(rec);
    State.bewaar(); sluitModal(); renderWijzigingen();
    toast('Wijziging opgeslagen', 'ok');
  });
  el('#wzAnnuleer').addEventListener('click', sluitModal);
  const vw = el('#wzVerwijder');
  if (vw) vw.addEventListener('click', () => {
    if (!confirm('Deze wijziging verwijderen?')) return;
    State.wijzigingen = (State.wijzigingen || []).filter((w) => w.id !== item.id);
    WzUI.selectie.delete(item.id);
    State.bewaar(); sluitModal(); renderWijzigingen();
    toast('Wijziging verwijderd', 'ok');
  });
}

/* ------------------------------ VTW maken -------------------------------- */
function vtwNummer() { return `VTW-${String((State.vtws || []).length + 1).padStart(3, '0')}`; }

// Alle beschikbare projectinformatie voor de AI: de wijzigingen zelf plus
// voortgang/fase en TSB-cijfers van de betrokken projecten.
function vtwData(wijzigingen) {
  const perWijziging = wijzigingen.map((wz) => {
    const wp = wpById(wz.wpId);
    return {
      werkpakket: wp ? `${wp.project} · ${apdVan(wp)} · ${wp.wp}` : wz.wpId,
      project: wp ? wp.project : '',
      post: wzPostLabel(wz.post),
      begrotingspost: wzTsbItemLabel(wz) || null,
      omschrijving: wz.omschrijving,
      toelichting: wz.toelichting,
      impactUren: wz.uren, impactBedrag: wz.bedrag,
      ingediendDoor: wz.ingediendDoor, datum: wz.datum,
      status: (WZ_STATUS[wz.status] || {}).label,
      afkeurToelichting: wz.afkeurToelichting || null,
    };
  });
  const projecten = [...new Set(perWijziging.map((w) => w.project).filter(Boolean))];
  const projectInfo = projecten.map((p) => {
    const s = typeof projectStats === 'function' ? projectStats(p) : null;
    const info = { project: p };
    if (s) Object.assign(info, { werkpakketten: s.aantal, gemVoortgangPct: s.pct, kritiek: s.kritiek, faseVerdeling: s.faseTeller });
    if (typeof tsbRapportData === 'function') { const t = tsbRapportData(p); if (t) info.tsb = t; }
    return info;
  });
  return {
    nummer: vtwNummer(),
    datum: fmtDatum(VANDAAG),
    opgesteldDoor: window.Auth ? Auth.naam() : '',
    totaalImpact: {
      uren: perWijziging.reduce((s, w) => s + (+w.impactUren || 0), 0),
      bedrag: perWijziging.reduce((s, w) => s + (+w.impactBedrag || 0), 0),
    },
    wijzigingen: perWijziging,
    projectInformatie: projectInfo,
  };
}

function vtwPrompt(data, titel, format) {
  const formatBlok = format
    ? `FORMAT. In het beheerscherm is het volgende VTW-format vastgelegd. Volg dit format exact — zelfde koppen, zelfde volgorde, zelfde onderdelen:\n\n${format}`
    : `FORMAT. Er is geen VTW-format vastgelegd in het beheerscherm. Hanteer daarom zelf een professioneel standaardformat voor een VTW, met ten minste: kenmerk & titel, aanleiding, omschrijving van de wijziging(en), consequenties voor kosten (met een compacte tabel), consequenties voor planning en kwaliteit, en een besluitvormings-/ondertekenblok (opdrachtgever en opdrachtnemer).`;
  const system = `Je bent een ervaren contractmanager/projectbeheerser bij netbeheerder-aannemer HVP. Je stelt een VTW (Verzoek Tot Wijziging) op richting de opdrachtgever voor de bouwteamfase "Nulelie". Schrijf zakelijk, helder Nederlands, in Markdown.

${formatBlok}

Gebruik UITSLUITEND de aangeleverde gegevens — verzin geen bedragen, uren, namen of data. Neem elke wijziging herkenbaar op met omschrijving, onderbouwing (toelichting) en financiële impact, en sluit af met de totale impact. Gebruik de projectinformatie (voortgang, fase, TSB-cijfers) om de context en urgentie te onderbouwen. Begin direct met de inhoud (geen inleidende zin over de opdracht).`;
  const prompt = `Stel ${data.nummer} op met als titel "${titel}".

Hieronder de geselecteerde wijzigingen en de beschikbare projectinformatie (JSON). Dit is de enige bron:

${JSON.stringify(data, null, 2)}`;
  return { system, prompt };
}

function openVtwModal() {
  if (!magWzBeheren()) { toast('Alleen ontwerpleider/manager kan een VTW opstellen', 'fout'); return; }
  const geselecteerd = [...WzUI.selectie].map(wzById).filter(Boolean);
  if (!geselecteerd.length) { toast('Selecteer eerst één of meer wijzigingen', 'fout'); return; }
  const alInVtw = geselecteerd.filter((w) => w.vtwId);
  const format = (State.instellingen.vtwFormat || '').trim();
  const regels = geselecteerd.map((wz) => {
    const wp = wpById(wz.wpId);
    return `<li>${htmlEsc(wp ? `${wp.project} · ${wp.wp}` : '')} — ${htmlEsc(wz.omschrijving)} <span class="hint">(${wzImpactHtml(wz)})</span></li>`;
  }).join('');
  openModal('VTW opstellen', `
    <div class="modal-veld"><label>Titel</label><input id="vtwTitel" placeholder="bijv. Meerwerk boringen tracé Wolvega" value=""></div>
    <div class="modal-veld"><label>Geselecteerde wijzigingen (${geselecteerd.length})</label>
      <ul class="tg-criteria">${regels}</ul>
      ${alInVtw.length ? `<span class="hint" style="color:var(--amber)">Let op: ${alInVtw.length} wijziging(en) zit(ten) al in een eerdere VTW.</span>` : ''}</div>
    <p class="sub">Format: ${format ? 'het VTW-format uit Beheer → Instellingen wordt gevolgd.' : '<strong>geen format vastgelegd</strong> — de AI hanteert zelf een professioneel VTW-format. Een eigen format kun je vastleggen onder Beheer → Instellingen.'}
      · Model: ${htmlEsc(State.model())}</p>
    <div class="modal-foot">
      <button class="ghost" id="vtwAnnuleer">Annuleren</button>
      <button class="primair" id="vtwGenereer">✦ Genereer VTW</button>
    </div>`);
  el('#vtwAnnuleer').addEventListener('click', sluitModal);
  el('#vtwGenereer').addEventListener('click', () => {
    const titel = el('#vtwTitel').value.trim() || `Wijzigingen ${fmtDatum(VANDAAG)}`;
    sluitModal();
    genereerVtw(geselecteerd, titel, format);
  });
}

let vtwAbort = null;
async function genereerVtw(wijzigingen, titel, format) {
  const data = vtwData(wijzigingen);
  const kaart = el('#vtwUitvoerKaart');
  const doc = el('#vtwDoc');
  const status = el('#vtwStatus');
  kaart.style.display = 'block';
  doc.innerHTML = '<p class="hint">Bezig met schrijven…</p>';
  status.innerHTML = `<span class="spinner"></span> ${htmlEsc(data.nummer)} genereren met ${htmlEsc(State.model())}…`;
  doc._titel = `${data.nummer} — ${titel}`;
  kaart.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (vtwAbort) vtwAbort.abort();
  vtwAbort = new AbortController();
  const { system, prompt } = vtwPrompt(data, titel, format);
  try {
    const tekst = await AI.genereer({
      system, prompt, model: State.model(), signal: vtwAbort.signal,
      onDelta: (vol) => { doc.innerHTML = markdownNaarHtml(vol); },
    });
    const vtw = {
      id: nieuwId('vtw'),
      nummer: data.nummer, titel,
      datum: isoDatum(new Date()),
      gemaaktDoor: window.Auth ? Auth.naam() : '',
      wijzigingIds: wijzigingen.map((w) => w.id),
      formatBron: format ? 'beheer' : 'ai',
      model: State.model(),
      tekst,
    };
    State.vtws = State.vtws || [];
    State.vtws.push(vtw);
    // Wijzigingen koppelen aan de VTW; nieuwe wijzigingen gelden nu als ingediend.
    wijzigingen.forEach((w) => {
      w.vtwId = vtw.id;
      if (w.status === 'nieuw') w.status = 'ingediend';
    });
    WzUI.selectie.clear();
    WzUI.vtwOpen = vtw.id;
    State.bewaar();
    toonVtw(vtw);
    status.innerHTML = '<span style="color:#047857;font-weight:600">✓ VTW gereed en opgeslagen in het register.</span>';
    renderWijzigingen();
    toast(`${vtw.nummer} opgesteld`, 'ok');
  } catch (e) {
    status.innerHTML = '';
    doc.innerHTML = `<div class="ai-waarsch">⚠️ <div><strong>Kon de VTW niet genereren.</strong><br>${htmlEsc(e.message)}<br><span class="hint">De AI-service vereist <code>ANTHROPIC_API_KEY</code> (op Vercel). De geselecteerde wijzigingen blijven bewaard.</span></div></div>`;
  }
}

function toonVtw(vtw) {
  const kaart = el('#vtwUitvoerKaart');
  const doc = el('#vtwDoc');
  WzUI.vtwOpen = vtw.id;
  kaart.style.display = 'block';
  doc._titel = `${vtw.nummer} — ${vtw.titel}`;
  doc._tekst = vtw.tekst;
  doc.innerHTML = markdownNaarHtml(vtw.tekst)
    + `<div class="rapport-meta" style="margin-top:22px">${htmlEsc(vtw.nummer)} · opgesteld ${fmtDatum(parseDatum(vtw.datum))} door ${htmlEsc(vtw.gemaaktDoor || '—')} · format: ${vtw.formatBron === 'beheer' ? 'beheerscherm' : 'AI'} · model ${htmlEsc(vtw.model || '')}</div>`;
}

function renderVtwLijst() {
  const node = el('#vtwLijst'); if (!node) return;
  const vtws = (State.vtws || []).slice().sort((a, b) => (b.datum || '').localeCompare(a.datum || ''));
  const rows = vtws.map((v) => `<tr class="rij" data-vtw="${htmlEsc(v.id)}">
    <td><strong>${htmlEsc(v.nummer)}</strong></td>
    <td>${htmlEsc(v.titel)}</td>
    <td>${fmtDatum(parseDatum(v.datum))}</td>
    <td class="num">${(v.wijzigingIds || []).length}</td>
    <td>${htmlEsc(v.gemaaktDoor || '—')}</td>
    <td>${v.formatBron === 'beheer' ? 'beheerscherm' : 'AI'}</td>
    <td class="reg-acties">${magWzBeheren() ? `<button class="mini-knop" data-vtwweg="${htmlEsc(v.id)}">verwijder</button>` : ''}</td>
  </tr>`).join('');
  node.innerHTML = `<div class="card">
    <div class="card-kop"><h2>VTW's<span class="tel">${vtws.length}</span></h2><span class="hint">Klik op een rij om de VTW te bekijken</span></div>
    <div class="tabel-wrap"><table class="tabel" style="min-width:0">
      <thead><tr><th>Nummer</th><th>Titel</th><th>Datum</th><th class="num">Wijzigingen</th><th>Opgesteld door</th><th>Format</th><th></th></tr></thead>
      <tbody>${rows || '<tr><td colspan="7" class="leeg">Nog geen VTW’s opgesteld. Selecteer wijzigingen en klik op “VTW maken”.</td></tr>'}</tbody>
    </table></div></div>`;
  els('#vtwLijst .rij').forEach((tr) => tr.addEventListener('click', (e) => {
    if (e.target.closest('[data-vtwweg]')) return;
    const vtw = vtwById(tr.dataset.vtw);
    if (vtw) { toonVtw(vtw); el('#vtwUitvoerKaart').scrollIntoView({ behavior: 'smooth' }); }
  }));
  els('#vtwLijst [data-vtwweg]').forEach((b) => b.addEventListener('click', () => {
    const vtw = vtwById(b.dataset.vtwweg);
    if (!confirm(`${vtw ? vtw.nummer : 'Deze VTW'} verwijderen? De gekoppelde wijzigingen blijven bestaan.`)) return;
    State.vtws = (State.vtws || []).filter((v) => v.id !== b.dataset.vtwweg);
    (State.wijzigingen || []).forEach((w) => { if (w.vtwId === b.dataset.vtwweg) w.vtwId = null; });
    if (WzUI.vtwOpen === b.dataset.vtwweg) { WzUI.vtwOpen = null; el('#vtwUitvoerKaart').style.display = 'none'; }
    State.bewaar(); renderWijzigingen(); toast('VTW verwijderd', 'ok');
  }));
}

function downloadVtwHtml() {
  const doc = el('#vtwDoc');
  if (!doc || !doc.innerHTML.trim()) { toast('Geen VTW om te downloaden', 'fout'); return; }
  const titel = doc._titel || 'vtw';
  const blob = new Blob([rapportStandaloneHtml(titel, doc.innerHTML)], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${titel.toLowerCase().replace(/[^\w]+/g, '-')}.html`;
  a.click();
  toast('VTW gedownload als HTML', 'ok');
}

/* --------------------------------- Init ---------------------------------- */
function wijzigingenInit() {
  const add = el('#wzToevoegen');
  if (add) add.addEventListener('click', () => openWijziging(null));
  const dl = el('#vtwDownload');
  if (dl) dl.addEventListener('click', downloadVtwHtml);
  const kopieer = el('#vtwKopieer');
  if (kopieer) kopieer.addEventListener('click', () => {
    const t = el('#vtwDoc')._tekst || el('#vtwDoc').innerText;
    navigator.clipboard.writeText(t).then(() => toast('VTW-tekst gekopieerd', 'ok'));
  });
  const ta = el('#instVtwFormat');
  if (ta) ta.addEventListener('change', () => {
    State.instellingen.vtwFormat = ta.value;
    State.bewaar();
    toast('VTW-format opgeslagen', 'ok');
  });
}

/* --------------------------------- Export -------------------------------- */
if (typeof window !== 'undefined') {
  window.renderWijzigingen = renderWijzigingen;
  window.wijzigingenInit = wijzigingenInit;
}
