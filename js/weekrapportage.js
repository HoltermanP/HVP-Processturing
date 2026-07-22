/* ==========================================================================
   Voortgangsrapportage per project — weekregistratie van de uitvoering.
   Volgt het Excel/CSV-sjabloon "Voortgangsrapportage <project> werkpakketten":
   per week gepland vs. gerealiseerd (boringen + kabels trekken in meters),
   schademeldingen per instantie en omgevingssignalen (klachten/complimenten).

   Twee registratieroutes die naast elkaar werken:
   1. direct in de app (modal per project + week);
   2. upload van een bijgewerkt sjabloon (CSV, puntkomma) — overschrijft
      alleen de weken die in het bestand staan, de rest blijft ongemoeid.
   Download levert hetzelfde sjabloon met de huidige data (rondje sluiten:
   downloaden → in Excel bijwerken → weer uploaden).

   Data: State.weekrapporten = [{ id, project, jaar, week, geplandMeters,
   geplandBoringen, realMeters, realBoringen, schade:{key:aantal},
   klachtenNieuw, klachtenAf, complimenten, notitie, door, opgeslagenOp }]
   — één record per project + jaar + week.
   Hergebruikt magReg()/nieuwId()/openModal()/sluitModal() uit registers.js en
   de weekhelpers uit voortgang.js. Laadt daarom ná die bestanden.
   ========================================================================== */
'use strict';

/* --------------------------- Vaste lijsten -------------------------------- */
const WR_SCHADE = [
  { key: 'overig', label: 'Overig' },
  { key: 'vitens', label: 'Vitens' },
  { key: 'lianderGas', label: 'Liander (gas)' },
  { key: 'lianderElektra', label: 'Liander (elektra)' },
  { key: 'lianderOv', label: 'Liander (OV)' },
  { key: 'gemeente', label: 'Gemeente' },
  { key: 'ziggo', label: 'Ziggo' },
  { key: 'kpn', label: 'KPN' },
  { key: 'eurofiber', label: 'Eurofiber' },
  { key: 'deltaFiber', label: 'DELTA Fiber' },
  { key: 'weesleiding', label: 'Overig (weesleiding)' },
];

let wrProjectKeuze = ''; // geselecteerd project in de rapportagekaart

/* ------------------------------ Helpers ----------------------------------- */
function wrProjecten() { return [...new Set(State.werkpakketten.map((w) => w.project))].sort(); }
function wrProject() {
  const alle = wrProjecten();
  if (wrProjectKeuze && alle.includes(wrProjectKeuze)) return wrProjectKeuze;
  if (State.filters.project && alle.includes(State.filters.project)) return State.filters.project;
  return alle[0] || '';
}
function wrRecords(project) {
  return (State.weekrapporten || []).filter((r) => r.project === project)
    .slice().sort((a, b) => (a.jaar * 100 + a.week) - (b.jaar * 100 + b.week));
}
function wrRecord(project, jaar, week) {
  return (State.weekrapporten || []).find((r) => r.project === project && +r.jaar === +jaar && +r.week === +week);
}
function wrSchadeTotaal(r) { return WR_SCHADE.reduce((s, c) => s + (+((r.schade || {})[c.key]) || 0), 0); }
function wrWeekLabel(r) { return `wk ${r.week} · ${r.jaar}`; }
// Maandag van een ISO-week (voor de datumhint in de modal).
function wrWeekStart(jaar, week) {
  const d = new Date(+jaar, 0, 4);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + (+week - 1) * 7);
  return d;
}
// NL-getalnotatie uit het sjabloon: "1.103" = 1103, komma is decimaalteken.
function wrNum(s) {
  const t = String(s == null ? '' : s).trim();
  if (!t) return 0;
  return +t.replace(/\./g, '').replace(',', '.') || 0;
}
function wrCsvGetal(n) { return n ? (+n).toLocaleString('nl-NL') : ''; }

/* ------------------------------ Weergave ---------------------------------- */
function renderWeekrapportage() {
  const cont = el('#wrInhoud'); if (!cont) return;
  const mag = magReg();
  const project = wrProject();
  const alle = wrProjecten();
  const recs = wrRecords(project);

  const opts = alle.map((p) => `<option value="${htmlEsc(p)}"${p === project ? ' selected' : ''}>${htmlEsc(p)}</option>`).join('');
  const acties = mag ? `
      <button class="primair" id="wrToevoegen">＋ Week registreren</button>
      <label class="filebtn" title="Bijgewerkt sjabloon uploaden (CSV met puntkomma's, zoals de download)">⬆ Sjabloon uploaden<input type="file" id="wrUpload" accept=".csv,text/csv" hidden></label>` : '';
  const wisKnop = mag && recs.length
    ? `<button class="gevaar" id="wrWissen" title="Alle weekrapportages van dit project verwijderen (bijv. na een verkeerde upload)">🗑 Wissen</button>` : '';

  // Totalen voor de KPI-regel.
  const t = recs.reduce((s, r) => {
    s.gm += +r.geplandMeters || 0; s.gb += +r.geplandBoringen || 0;
    s.rm += +r.realMeters || 0; s.rb += +r.realBoringen || 0;
    s.schade += wrSchadeTotaal(r);
    s.kNieuw += +r.klachtenNieuw || 0; s.kAf += +r.klachtenAf || 0; s.compl += +r.complimenten || 0;
    return s;
  }, { gm: 0, gb: 0, rm: 0, rb: 0, schade: 0, kNieuw: 0, kAf: 0, compl: 0 });
  // Voortgang t.o.v. het plan t/m de laatste week met realisatie ("op schema?"),
  // niet t.o.v. het totale plan inclusief alle toekomstige weken.
  let cumPlanLoop = 0, geplandTmNu = 0, heeftReal = false;
  recs.forEach((r) => {
    cumPlanLoop += +r.geplandMeters || 0;
    if ((+r.realMeters || 0) > 0 || (+r.realBoringen || 0) > 0) { geplandTmNu = cumPlanLoop; heeftReal = true; }
  });
  const mPct = heeftReal && geplandTmNu ? Math.round((t.rm / geplandTmNu) * 100) : null;
  const kOpen = Math.max(0, t.kNieuw - t.kAf);
  const kpis = [
    { cls: '', val: uvFmt(t.gm), label: 'meters gepland (totaal)' },
    { cls: 'blauw', val: uvFmt(t.rm), label: 'meters gerealiseerd' },
    { cls: mPct != null && mPct >= 100 ? 'groen' : 'blauw', val: mPct != null ? mPct + '%' : '—', label: '% van gepland t/m nu' },
    { cls: '', val: uvFmt(t.gb), label: 'boringen gepland' },
    { cls: 'blauw', val: uvFmt(t.rb), label: 'boringen gerealiseerd' },
    { cls: t.schade ? 'rood' : 'groen', val: t.schade, label: 'schademeldingen' },
    { cls: kOpen ? 'amber' : 'groen', val: kOpen, label: 'openstaande klachten' },
  ].map((x) => `<div class="tstat ${x.cls}"><b>${x.val}</b><span>${x.label}</span></div>`).join('');

  // Weektabel: cumulatief gerealiseerd afgezet tegen het cumulatief geplande
  // t/m dezelfde week (zoals de cumulatief-rijen in het Excel-sjabloon).
  let cum = 0, cumPlan = 0;
  const rijen = recs.map((r) => {
    cum += +r.realMeters || 0;
    cumPlan += +r.geplandMeters || 0;
    const schade = wrSchadeTotaal(r);
    const klacht = (+r.klachtenNieuw || 0) || (+r.klachtenAf || 0)
      ? `${+r.klachtenNieuw || 0} nieuw${(+r.klachtenAf || 0) ? ` · ${+r.klachtenAf} af` : ''}` : '—';
    return `<tr class="rij wr-rij" data-id="${htmlEsc(r.id)}" title="Klik om deze week te bewerken">
      <td><strong>${wrWeekLabel(r)}</strong><div class="sub">${fmtDatumKort(wrWeekStart(r.jaar, r.week))}</div></td>
      <td class="num">${uvFmt(r.geplandMeters)}</td>
      <td class="num">${uvFmt(r.realMeters)}</td>
      <td class="num">${uvFmt(cum)}</td>
      <td>${uvPctCel(cum, cumPlan)}</td>
      <td class="num">${r.geplandBoringen ? uvFmt(r.geplandBoringen) : '—'}</td>
      <td class="num">${r.realBoringen ? uvFmt(r.realBoringen) : '—'}</td>
      <td class="num">${schade ? `<span class="kp-badge telaat">${schade}</span>` : '—'}</td>
      <td>${klacht}</td>
      <td>${htmlEsc(r.notitie || '')}</td>
    </tr>`;
  }).join('');

  cont.innerHTML = `<div class="card">
    <div class="card-kop">
      <h2>Voortgangsrapportage per week<span class="tel">${recs.length ? recs.length + ' weken' : ''}</span></h2>
      <div class="knoppenrij">
        <select id="wrProject" class="tsb-inp" style="min-width:150px" title="Project">${opts}</select>
        ${acties}
        <button class="ghost" id="wrDownload" title="Huidige data als CSV-sjabloon downloaden (in Excel bij te werken en weer te uploaden)">⬇ Sjabloon</button>
        ${wisKnop}
      </div>
    </div>
    <div class="taken-stats" style="margin-bottom:14px">${kpis}</div>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th>Week</th><th class="num">Gepland m</th><th class="num">Gerealiseerd m</th><th class="num">Cumulatief m</th><th>% van plan t/m die week</th><th class="num">Boringen gepland</th><th class="num">Gerealiseerd</th><th class="num">Schade</th><th>Klachten</th><th>Notitie</th></tr></thead>
      <tbody>${rijen || `<tr><td colspan="10" class="leeg">Nog geen weekrapportages voor ${htmlEsc(project || 'dit project')}. Registreer een week of upload het ingevulde sjabloon.</td></tr>`}</tbody>
    </table></div>
    <p class="hint" style="margin:10px 2px 0">Beide routes werken naast elkaar: een upload overschrijft alleen de weken die in het bestand staan (notities blijven bewaard); handmatige registraties blijven staan.</p>
  </div>`;

  const sel = el('#wrProject');
  if (sel) sel.addEventListener('change', () => { wrProjectKeuze = sel.value; renderWeekrapportage(); });
  const knop = el('#wrToevoegen');
  if (knop) knop.addEventListener('click', () => openWeekrapport(null, project));
  els('#wrInhoud .wr-rij').forEach((tr) => tr.addEventListener('click', () => {
    const r = (State.weekrapporten || []).find((x) => x.id === tr.dataset.id);
    if (r) { if (mag) openWeekrapport(r, r.project); }
  }));
  const upload = el('#wrUpload');
  if (upload) upload.addEventListener('change', (e) => wrLeesUpload(e, project));
  const dl = el('#wrDownload');
  if (dl) dl.addEventListener('click', () => wrDownloadCsv(project));
  const wis = el('#wrWissen');
  if (wis) wis.addEventListener('click', () => {
    const n = wrRecords(project).length;
    if (!confirm(`Alle ${n} weekrapportages voor ${project} verwijderen? Dit maakt zowel geüploade als handmatig geregistreerde weken ongedaan.`)) return;
    State.weekrapporten = (State.weekrapporten || []).filter((r) => r.project !== project);
    State.bewaar(); renderWeekrapportage();
    toast(`Weekrapportage van ${project} gewist`, 'ok');
  });
}

/* ----------------------- Optie 1: registratie in de app ------------------- */
function openWeekrapport(item, project) {
  if (!magReg()) { toast('Alleen ontwerpleider/manager kan de weekrapportage bijwerken', 'fout'); return; }
  item = item || {};
  const start = item.jaar ? wrWeekStart(item.jaar, item.week) : VANDAAG;
  const schadeVelden = WR_SCHADE.map((c) => `
      <div class="modal-veld"><label>${htmlEsc(c.label)}</label>
        <input id="wrS_${c.key}" type="number" min="0" step="1" value="${(item.schade || {})[c.key] ?? ''}" placeholder="0"></div>`).join('');
  openModal(item.id ? `Weekrapportage bewerken — ${htmlEsc(project)}` : `Week registreren — ${htmlEsc(project)}`, `
    <div class="modal-veld"><label>Week <span class="hint">(kies een datum in de week)</span></label>
      <input id="wrDatum" type="date" value="${isoDatum(start)}"><span class="hint" id="wrWeekHint"></span></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Gepland — kabels trekken (m)</label><input id="wrGm" type="number" min="0" step="1" value="${item.geplandMeters ?? ''}" placeholder="bijv. 1103"></div>
      <div class="modal-veld"><label>Gepland — boringen</label><input id="wrGb" type="number" min="0" step="1" value="${item.geplandBoringen ?? ''}" placeholder="bijv. 5"></div>
    </div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Gerealiseerd — kabels trekken (m)</label><input id="wrRm" type="number" min="0" step="1" value="${item.realMeters ?? ''}" placeholder="bijv. 1025"></div>
      <div class="modal-veld"><label>Gerealiseerd — boringen</label><input id="wrRb" type="number" min="0" step="1" value="${item.realBoringen ?? ''}" placeholder="bijv. 3"></div>
    </div>
    <details ${wrSchadeTotaal(item) ? 'open' : ''}><summary style="cursor:pointer;font-weight:650;margin:4px 0 10px">Schaderapportage per instantie</summary>
      <div class="modal-rij" style="grid-template-columns:1fr 1fr 1fr">${schadeVelden}</div>
    </details>
    <div class="modal-rij" style="grid-template-columns:1fr 1fr 1fr">
      <div class="modal-veld"><label>Nieuwe klachten</label><input id="wrKn" type="number" min="0" step="1" value="${item.klachtenNieuw ?? ''}" placeholder="0"></div>
      <div class="modal-veld"><label>Afgehandelde klachten</label><input id="wrKa" type="number" min="0" step="1" value="${item.klachtenAf ?? ''}" placeholder="0"></div>
      <div class="modal-veld"><label>Complimenten</label><input id="wrCo" type="number" min="0" step="1" value="${item.complimenten ?? ''}" placeholder="0"></div>
    </div>
    <div class="modal-veld"><label>Notitie</label><textarea id="wrNotitie" rows="2" placeholder="Bijzonderheden deze week…">${htmlEsc(item.notitie || '')}</textarea></div>
    <div class="modal-foot">
      ${item.id ? '<button class="verwijder-knop" id="wrVerwijder">Verwijderen</button>' : ''}
      <button class="ghost" id="wrAnnuleer">Annuleren</button>
      <button class="primair" id="wrOpslaan">Opslaan</button>
    </div>`);

  // Valt de gekozen datum in een week die al geregistreerd is (bijv. via een
  // upload)? Laad die waarden dan in het formulier zodat opslaan de week
  // bijwerkt in plaats van te weigeren; alleen lege velden worden ingevuld.
  const weekHint = () => {
    const d = parseDatum(el('#wrDatum').value);
    const w = d ? uvIsoWeek(d) : null;
    const bestaand = w ? wrRecord(project, w.jaar, w.week) : null;
    el('#wrWeekHint').textContent = w
      ? `→ week ${w.week} · ${w.jaar}${bestaand && bestaand.id !== item.id ? ' — bestaat al, wordt bijgewerkt' : ''}`
      : '';
    if (bestaand && bestaand.id !== item.id) {
      const vul = (id, waarde) => { const n = el('#' + id); if (n && n.value === '' && waarde) n.value = waarde; };
      vul('wrGm', bestaand.geplandMeters); vul('wrGb', bestaand.geplandBoringen);
      vul('wrRm', bestaand.realMeters); vul('wrRb', bestaand.realBoringen);
      WR_SCHADE.forEach((c) => vul('wrS_' + c.key, (bestaand.schade || {})[c.key]));
      vul('wrKn', bestaand.klachtenNieuw); vul('wrKa', bestaand.klachtenAf); vul('wrCo', bestaand.complimenten);
      const nt = el('#wrNotitie'); if (nt && !nt.value && bestaand.notitie) nt.value = bestaand.notitie;
    }
  };
  weekHint();
  el('#wrDatum').addEventListener('change', weekHint);

  el('#wrOpslaan').addEventListener('click', () => {
    const d = parseDatum(el('#wrDatum').value);
    if (!d) { toast('Kies een geldige datum in de week', 'fout'); return; }
    const { jaar, week } = uvIsoWeek(d);
    const getal = (id) => { const v = el('#' + id).value; return v === '' ? 0 : Math.max(0, +v || 0); };
    const schade = {};
    WR_SCHADE.forEach((c) => { const v = getal('wrS_' + c.key); if (v) schade[c.key] = v; });
    // Bestaat de week al (bijv. via een upload)? Dan wordt dat record bijgewerkt.
    const bestaand = wrRecord(project, jaar, week);
    const rec = {
      id: item.id || (bestaand ? bestaand.id : nieuwId('wr')),
      project, jaar, week,
      geplandMeters: getal('wrGm'), geplandBoringen: getal('wrGb'),
      realMeters: getal('wrRm'), realBoringen: getal('wrRb'),
      schade,
      klachtenNieuw: getal('wrKn'), klachtenAf: getal('wrKa'), complimenten: getal('wrCo'),
      notitie: el('#wrNotitie').value.trim(),
      door: window.Auth && typeof Auth.naam === 'function' ? Auth.naam() : '',
      opgeslagenOp: new Date().toISOString(),
    };
    State.weekrapporten = (State.weekrapporten || []).filter((r) => r.id !== rec.id);
    State.weekrapporten.push(rec);
    State.bewaar(); sluitModal(); renderWeekrapportage();
    toast(`Weekrapportage week ${week} opgeslagen`, 'ok');
  });
  el('#wrAnnuleer').addEventListener('click', sluitModal);
  const vw = el('#wrVerwijder');
  if (vw) vw.addEventListener('click', () => {
    if (!confirm('Deze weekrapportage verwijderen?')) return;
    State.weekrapporten = (State.weekrapporten || []).filter((r) => r.id !== item.id);
    State.bewaar(); sluitModal(); renderWeekrapportage();
    toast('Weekrapportage verwijderd', 'ok');
  });
}

/* --------------------- Optie 2: sjabloon-upload (CSV) --------------------- */
function wrLeesUpload(e, project) {
  const file = e.target.files && e.target.files[0];
  e.target.value = '';
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const { weken, jaarBasis } = wrParseCsv(String(reader.result || ''));
      if (!weken.size) throw new Error('Geen weekdata gevonden — is dit het sjabloon "Voortgangsrapportage" (CSV met puntkomma\'s)?');
      const aantal = wrVerwerkImport(project, weken);
      State.bewaar(); renderWeekrapportage();
      toast(`${aantal} weken bijgewerkt voor ${project} (vanaf ${jaarBasis})`, 'ok');
    } catch (err) {
      toast(`Upload mislukt: ${err.message}`, 'fout');
    }
  };
  reader.readAsText(file);
}

// Parseert het sjabloon: puntkomma-CSV, weekkoppen in rij "…;Week;21;22;…",
// jaartal in de eerste rij, secties (Gepland/Gerealiseerd/Schaderapportage/
// Omgeving) in kolom A, reekslabels in kolom C. Cumulatief-rijen en de
// totaalrij worden genegeerd (die rekent de app zelf uit).
function wrParseCsv(tekst) {
  const rijen = tekst.replace(/^﻿/, '').replace(/^ï»¿/, '').split(/\r?\n/).map((r) => r.split(';'));
  const norm = (s) => String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();

  // Jaartal: eerste cel met een jaartal in de eerste rijen vóór de weekrij.
  let jaarBasis = null;
  const weekRijIdx = rijen.findIndex((r) => norm(r[2]) === 'week');
  if (weekRijIdx < 0) throw new Error('Weekkopregel niet gevonden (kolom C met "Week")');
  for (let i = 0; i < weekRijIdx; i++) {
    const kandidaat = rijen[i].find((c) => /^(19|20)\d{2}$/.test(String(c).trim()));
    if (kandidaat) { jaarBasis = +kandidaat; break; }
  }
  if (!jaarBasis) jaarBasis = VANDAAG.getFullYear();

  // Weekkolommen: kolomindex → {jaar, week}; jaar telt op zodra het weeknummer daalt.
  const weekVanKolom = new Map();
  let jaar = jaarBasis, vorige = 0;
  rijen[weekRijIdx].forEach((cel, idx) => {
    if (idx < 3) return;
    const w = parseInt(String(cel).trim(), 10);
    if (!w || w < 1 || w > 53) return;
    if (vorige && w < vorige) jaar++;
    vorige = w;
    weekVanKolom.set(idx, { jaar, week: w });
  });

  const schadeVanLabel = new Map(WR_SCHADE.map((c) => [norm(c.label), c.key]));
  const veldVanLabel = new Map([
    ['gepland boringen', 'geplandBoringen'],
    ['gepland kabels trekken', 'geplandMeters'],
    ['gerealiseerd boringen', 'realBoringen'],
    ['gerealiseerd kabels trekken', 'realMeters'],
    ['nieuwe klachten', 'klachtenNieuw'],
    ['afgehandelde klachten', 'klachtenAf'],
    ['complimenten', 'complimenten'],
  ]);

  const weken = new Map(); // 'jaar-week' → {jaar, week, velden…, schade:{}}
  const zet = (kolomIdx, toepassen) => {
    const wk = weekVanKolom.get(kolomIdx); if (!wk) return;
    const sleutel = `${wk.jaar}-${wk.week}`;
    if (!weken.has(sleutel)) weken.set(sleutel, { jaar: wk.jaar, week: wk.week, schade: {} });
    toepassen(weken.get(sleutel));
  };

  let sectie = '';
  rijen.forEach((r, i) => {
    if (i <= weekRijIdx) return;
    if (String(r[0] || '').trim()) sectie = norm(r[0]);
    const label = norm(r[2]);
    if (!label || label.includes('cumulatief') || label === 'schademeldingen totaal') return;

    let veld = veldVanLabel.get(label);
    let schadeKey = null;
    if (!veld && sectie === 'schaderapportage') schadeKey = schadeVanLabel.get(label);
    if (!veld && !schadeKey) return;

    r.forEach((cel, idx) => {
      if (idx < 3) return;
      const v = wrNum(cel);
      if (!String(cel).trim()) return;
      zet(idx, (rec) => {
        if (veld) rec[veld] = v;
        else if (v) rec.schade[schadeKey] = v;
      });
    });
  });
  return { weken, jaarBasis };
}

// Upsert op veldniveau: alleen cellen die in het bestand zijn ingevuld
// overschrijven bestaande waarden — een lege cel laat een eerdere (bijv.
// handmatige) registratie staan. Notities en registrant blijven bewaard.
const WR_VELDEN = ['geplandMeters', 'geplandBoringen', 'realMeters', 'realBoringen', 'klachtenNieuw', 'klachtenAf', 'complimenten'];
function wrVerwerkImport(project, weken) {
  let aantal = 0;
  weken.forEach((data) => {
    const heeftData = WR_VELDEN.some((k) => data[k] !== undefined) || Object.keys(data.schade).length;
    if (!heeftData) return;
    const bestaand = wrRecord(project, data.jaar, data.week);
    const rec = {
      id: bestaand ? bestaand.id : nieuwId('wr'),
      project, jaar: data.jaar, week: data.week,
      ...Object.fromEntries(WR_VELDEN.map((k) => [k, data[k] !== undefined ? (+data[k] || 0) : (bestaand ? +bestaand[k] || 0 : 0)])),
      schade: { ...(bestaand ? bestaand.schade : {}), ...data.schade },
      notitie: bestaand ? bestaand.notitie : '',
      door: window.Auth && typeof Auth.naam === 'function' ? Auth.naam() : '',
      opgeslagenOp: new Date().toISOString(),
    };
    State.weekrapporten = (State.weekrapporten || []).filter((r) => r.id !== rec.id);
    State.weekrapporten.push(rec);
    aantal++;
  });
  return aantal;
}

/* ------------------- Sjabloon-download (zelfde CSV-layout) ---------------- */
function wrDownloadCsv(project) {
  const recs = wrRecords(project);
  // Weekreeks: van de eerste t/m de laatste geregistreerde week, gaten opgevuld;
  // zonder data: de komende 12 weken vanaf nu (leeg sjabloon om in te vullen).
  let reeks = [];
  if (recs.length) {
    let { jaar, week } = recs[0];
    const eind = recs[recs.length - 1];
    while (jaar < eind.jaar || (jaar === eind.jaar && week <= eind.week)) {
      reeks.push({ jaar, week });
      week++;
      const maxWeek = uvIsoWeek(new Date(jaar, 11, 28)).week; // 52 of 53
      if (week > maxWeek) { week = 1; jaar++; }
    }
  } else {
    let { jaar, week } = uvIsoWeek(VANDAAG);
    for (let i = 0; i < 12; i++) {
      reeks.push({ jaar, week });
      week++;
      const maxWeek = uvIsoWeek(new Date(jaar, 11, 28)).week;
      if (week > maxWeek) { week = 1; jaar++; }
    }
  }
  const perWeek = new Map(recs.map((r) => [`${r.jaar}-${r.week}`, r]));
  const cel = (fn) => reeks.map((w) => { const r = perWeek.get(`${w.jaar}-${w.week}`); return r ? fn(r) : ''; });
  const rij = (a, b, c, cellen) => [a, b, c, ...cellen].join(';');
  const som = (fn) => recs.reduce((s, r) => s + (+fn(r) || 0), 0);
  const cumulatief = (fn) => { let c = 0; return reeks.map((w) => { const r = perWeek.get(`${w.jaar}-${w.week}`); if (r) c += +fn(r) || 0; return wrCsvGetal(c); }); };

  const regels = [
    rij('', '', reeks[0].jaar, `Voortgangsrapportage ${project} — gegenereerd door NuLelie Procesturing`),
    rij('', '', 'Week', reeks.map((w) => w.week)),
    rij('', 'Totalen', '', reeks.map(() => '')),
    rij('Gepland', wrCsvGetal(som((r) => r.geplandBoringen)) || '0', 'Gepland boringen', cel((r) => wrCsvGetal(r.geplandBoringen))),
    rij('', wrCsvGetal(som((r) => r.geplandMeters)) || '0', 'Gepland kabels trekken', cel((r) => wrCsvGetal(r.geplandMeters))),
    rij('', '', 'Gepland boringen cumulatief', cumulatief((r) => r.geplandBoringen)),
    rij('', '', 'Gepland kabels cumulatief', cumulatief((r) => r.geplandMeters)),
    rij('', '', '', reeks.map(() => '')),
    rij('Gerealiseerd', wrCsvGetal(som((r) => r.realBoringen)) || '0', 'Gerealiseerd boringen', cel((r) => wrCsvGetal(r.realBoringen))),
    rij('', wrCsvGetal(som((r) => r.realMeters)) || '0', 'Gerealiseerd kabels trekken', cel((r) => wrCsvGetal(r.realMeters))),
    rij('', '', 'Gerealiseerd boringen cumulatief', cumulatief((r) => r.realBoringen)),
    rij('', '', 'Gerealiseerd kabels cumulatief', cumulatief((r) => r.realMeters)),
    rij('', '', '', reeks.map(() => '')),
    ...WR_SCHADE.map((c, i) => rij(
      i === 0 ? 'Schaderapportage' : '',
      wrCsvGetal(som((r) => (r.schade || {})[c.key])) || '0',
      c.label,
      cel((r) => wrCsvGetal((r.schade || {})[c.key])),
    )),
    rij('', wrCsvGetal(som(wrSchadeTotaal)) || '0', 'Schademeldingen totaal', reeks.map((w) => { const r = perWeek.get(`${w.jaar}-${w.week}`); return r ? wrSchadeTotaal(r) : ''; })),
    rij('', '', '', reeks.map(() => '')),
    rij('Omgeving', wrCsvGetal(som((r) => r.klachtenNieuw)) || '0', 'Nieuwe klachten', cel((r) => wrCsvGetal(r.klachtenNieuw))),
    rij('', wrCsvGetal(som((r) => r.klachtenAf)) || '0', 'Afgehandelde klachten', cel((r) => wrCsvGetal(r.klachtenAf))),
    rij('', wrCsvGetal(som((r) => r.complimenten)) || '0', 'Complimenten', cel((r) => wrCsvGetal(r.complimenten))),
  ];
  const blob = new Blob(['﻿' + regels.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Voortgangsrapportage ${project} werkpakketten.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ------------------------- Samenvatting voor AI --------------------------- */
function weekrapportageRapportData(scope) {
  const projecten = scope === 'portfolio' ? wrProjecten() : [scope];
  const alle = projecten.flatMap((p) => wrRecords(p));
  if (!alle.length) return null;
  const som = (fn) => alle.reduce((s, r) => s + (+fn(r) || 0), 0);
  return {
    weken: alle.length,
    metersGepland: som((r) => r.geplandMeters),
    metersGerealiseerd: som((r) => r.realMeters),
    boringenGepland: som((r) => r.geplandBoringen),
    boringenGerealiseerd: som((r) => r.realBoringen),
    schademeldingen: som(wrSchadeTotaal),
    klachtenNieuw: som((r) => r.klachtenNieuw),
    klachtenAfgehandeld: som((r) => r.klachtenAf),
    complimenten: som((r) => r.complimenten),
  };
}

if (typeof window !== 'undefined') {
  window.renderWeekrapportage = renderWeekrapportage;
  window.weekrapportageRapportData = weekrapportageRapportData;
}
