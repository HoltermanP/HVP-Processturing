/* ==========================================================================
   Werklijst — taken afhandelen en voortgang bewaken van grof naar fijn.

   Drie bouwstenen:
   1. volgendeStap(wp): de eerstvolgende niet-afgehandelde stap van een
      werkpakket (fasen in volgorde), met geplande datums uit faseSchema.
   2. wpBlokkades(wp): openstaande conditionering uit de registers
      (onderzoeken, vergunningen, ZRO) afgezet tegen de fase waarvóór die
      gereed moet zijn — zichtbaar als "wacht op …" op taak en overzicht.
   3. renderWerklijst(): trechter project ▸ APD ▸ werkpakket met per niveau
      wat er nog moet gebeuren, en per werkpakket het stappenplan met
      "hier zijn we", de volgende stap voluit en directe afhandelknoppen.

   Weergavestijl bewust zonder activiteitcodes: fasenamen en stappen voluit.
   Gebruikt globals uit app.js (State, FASES, faseSchema, huidigeFase,
   isAfgehandeld, STATUSSEN, el/els, htmlEsc, fmtDatum, toast, …) en de
   registers (vgGroep, zroStatusKey, ZRO_STATUS, OZ_STATUS). Laadt ná die
   bestanden.
   ========================================================================== */
'use strict';

/* --------------------- Bouwsteen 1: volgende stap ------------------------ */
// Eerstvolgende stap die aandacht vraagt: de eerste niet-afgehandelde
// activiteit, fasen in procesvolgorde. Geeft ook de geplande datums terug.
function volgendeStap(wp) {
  const v = State.voortgang[wp.id] || {};
  for (const f of FASES) {
    const sch = faseSchema(wp, f);
    for (const a of f.activiteiten) {
      const st = (v[a.code] && v[a.code].status) || 'open';
      if (st === 'nvt' || isAfgehandeld(st)) continue;
      const item = sch ? sch.items.find((it) => it.activiteit.code === a.code) : null;
      return { fase: f, activiteit: a, status: st, start: item ? item.start : null, eind: item ? item.eind : null, faseEind: sch ? sch.eind : null };
    }
  }
  return null; // alles afgehandeld
}

// Resterende (niet-afgehandelde) stappen per fase, voor de trechtertellingen.
function openStappen(wp) {
  const v = State.voortgang[wp.id] || {};
  const perFase = [];
  let totaalOpen = 0;
  FASES.forEach((f) => {
    const open = f.activiteiten.filter((a) => {
      const st = (v[a.code] && v[a.code].status) || 'open';
      return st !== 'nvt' && !isAfgehandeld(st);
    });
    totaalOpen += open.length;
    perFase.push({ fase: f, open });
  });
  return { perFase, totaalOpen };
}

/* ------------------- Bouwsteen 2: blokkades uit registers ---------------- */
// Welke conditionering moet gereed zijn vóór (het einde van) welke fase.
// Fase-id's: 0 analyse, 1 VO, 2 DO, 3 UO, 4 contract.
const REGISTER_EISEN = [
  { soort: 'onderzoeken', voorFase: '3', eis: 'gereed vóór einde UO-fase' },
  { soort: 'vergunningen', voorFase: '4', eis: 'verleend vóór contract gereed' },
  { soort: 'zro', voorFase: '4', eis: 'getekend vóór contract gereed' },
];

// Openstaande registeritems voor een werkpakket, met urgentie t.o.v. de
// huidige fase: 'hard' = de doelfase loopt al (of is voorbij), 'zacht' = de
// doelfase is de eerstvolgende.
function wpBlokkades(wp) {
  const hf = huidigeFase(wp);
  const faseNr = hf.fase ? Number(hf.fase.id) : -1;
  const uit = [];
  const duw = (soort, label, statusLabel, kleur, overtijd) => {
    const eis = REGISTER_EISEN.find((r) => r.soort === soort);
    const doel = Number(eis.voorFase);
    const urgentie = faseNr >= doel ? 'hard' : faseNr === doel - 1 ? 'zacht' : 'info';
    uit.push({ soort, label, statusLabel, kleur, overtijd, urgentie, eis: eis.eis });
  };
  (State.onderzoeken || []).filter((o) => o.wpId === wp.id).forEach((o) => {
    const st = o.status || 'nodig';
    if (st === 'gereed' || st === 'nvt') return;
    const info = (typeof OZ_STATUS !== 'undefined' && OZ_STATUS[st]) || { label: st, kleur: '#94a3b8' };
    const over = typeof ozOvertijd === 'function' ? ozOvertijd(o) : false;
    duw('onderzoeken', o.omschrijving || 'onderzoek', info.label, info.kleur, over);
  });
  (State.vergunningen || []).filter((x) => x.wpId === wp.id).forEach((x) => {
    const groep = typeof vgGroep === 'function' ? vgGroep(x) : 'open';
    if (groep === 'verleend' || groep === 'overig') return;
    const info = typeof vgStatusInfo === 'function' ? vgStatusInfo(x) : { label: x.status, kleur: '#94a3b8' };
    const over = typeof vgOvertijd === 'function' ? vgOvertijd(x) : false;
    if (x.type === 'zro') duw('zro', `ZRO ${x.bevoegdGezag || x.omschrijving || ''}`.trim(), info.label, info.kleur, over);
    else duw('vergunningen', x.omschrijving || 'vergunning', info.label, info.kleur, over);
  });
  // Hard (houdt de lopende fase op) eerst, dan zacht, dan informatief.
  const rang = { hard: 0, zacht: 1, info: 2 };
  uit.sort((a, b) => rang[a.urgentie] - rang[b.urgentie] || (b.overtijd ? 1 : 0) - (a.overtijd ? 1 : 0));
  return uit;
}

function blokkadeChips(blokkades, max) {
  if (!blokkades.length) return '';
  const toon = max ? blokkades.slice(0, max) : blokkades;
  const chips = toon.map((b) => {
    const rand = b.urgentie === 'hard' ? 'var(--rood)' : b.urgentie === 'zacht' ? 'var(--amber)' : 'var(--line)';
    return `<span class="wl-blok" style="border-color:${rand}" title="${htmlEsc(b.eis)}">${htmlEsc(b.label)} — <em style="color:${b.kleur}">${htmlEsc(b.statusLabel)}${b.overtijd ? ' ⚠' : ''}</em></span>`;
  }).join('');
  const rest = max && blokkades.length > max ? `<span class="wl-blok meer">+ ${blokkades.length - max} meer</span>` : '';
  return `<div class="wl-blokkades"><span class="wl-blok-kop">Wacht op:</span>${chips}${rest}</div>`;
}

/* -------------------- Statusknoppen (direct afhandelen) ------------------ */
function stapKnoppen(wpId, code, status) {
  const magBew = !window.Auth || Auth.magWpBewerken(wpId);
  if (!magBew) return '';
  const knop = (st, label, cls) => `<button class="wl-knop ${cls}${status === st ? ' actief' : ''}" data-wl-status="${st}" data-wp="${htmlEsc(wpId)}" data-code="${htmlEsc(code)}">${label}</button>`;
  return `<div class="wl-knoppen">
    ${knop('bezig', '▶ Bezig', 'bezig')}
    ${knop('gereed', '✓ Gereed', 'gereed')}
    ${knop('geblokkeerd', '⛔ Geblokkeerd', 'geblok')}
  </div>`;
}

function bindStapKnoppen(containerSel, herteken) {
  els(`${containerSel} [data-wl-status]`).forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const { wp, code, wlStatus } = b.dataset;
    if (window.Auth && !Auth.magWpBewerken(wp)) { toast('Je mag dit werkpakket niet bewerken', 'fout'); return; }
    const huidig = (State.wpVoortgang(wp)[code] || {}).status;
    const nieuw = huidig === wlStatus ? 'open' : wlStatus; // nogmaals klikken = terugzetten
    State.wpVoortgang(wp)[code] = Object.assign(State.wpVoortgang(wp)[code] || {}, { status: nieuw });
    State.bewaar();
    toast(nieuw === 'gereed' ? 'Stap gereed — volgende stap staat klaar' : `Status: ${STATUSSEN[nieuw].label}`, 'ok');
    herteken();
  }));
}

/* --------------- "Nu aan de beurt"-kaart (voor Mijn taken) --------------- */
function nuAanDeBeurtKaart(wp) {
  const stap = volgendeStap(wp);
  const blok = wpBlokkades(wp);
  const kop = `<div class="wl-nu-wp"><strong>${htmlEsc(wp.project)}</strong> · ${htmlEsc(apdVan(wp))} · ${htmlEsc(wp.wp)}</div>`;
  if (!stap) {
    return `<div class="wl-nu-kaart klaar" data-wp="${htmlEsc(wp.id)}">${kop}
      <div class="wl-nu-stap">Alle stappen zijn afgehandeld. 🎉</div>${blokkadeChips(blok, 3)}</div>`;
  }
  const info = typeof actInfo === 'function' ? actInfo(stap.activiteit.code) : { omschrijving: stap.activiteit.omschrijving };
  const st = STATUSSEN[stap.status] || STATUSSEN.open;
  const wanneer = stap.eind
    ? (stap.eind < VANDAAG
      ? `<span style="color:var(--rood)">gepland gereed ${fmtDatum(stap.eind)} — over tijd</span>`
      : `gepland: ${fmtDatum(stap.start)} → <b>${fmtDatum(stap.eind)}</b>`)
    : '';
  return `<div class="wl-nu-kaart" data-wp="${htmlEsc(wp.id)}">
    ${kop}
    <div class="wl-nu-fase">Hier zijn we: <strong>${htmlEsc(stap.fase.naam)}</strong> · <span class="statuschip" style="background:${st.kleur}">${st.label}</span></div>
    <div class="wl-nu-stap">${htmlEsc(stap.activiteit.naam)}</div>
    ${info.omschrijving ? `<div class="wl-nu-omschr">${htmlEsc(info.omschrijving)}</div>` : ''}
    <div class="wl-nu-meta">${wanneer}</div>
    ${blokkadeChips(blok, 3)}
    ${stapKnoppen(wp.id, stap.activiteit.code, stap.status)}
  </div>`;
}

// Blok bovenaan "Mijn taken": per toegewezen werkpakket de volgende stap.
function renderNuAanDeBeurt(containerSel, wps, herteken) {
  const cont = el(containerSel);
  if (!cont) return;
  if (!wps.length) { cont.innerHTML = ''; return; }
  cont.innerHTML = `<div class="taakgroep">
    <div class="taakgroep-kop"><span class="vlag" style="background:var(--accent)"></span>Nu aan de beurt
      <span class="hint">per werkpakket de eerstvolgende stap — handel direct af met de knoppen</span>
      <span class="telp">${wps.length}</span></div>
    <div class="wl-nu-raster">${wps.map(nuAanDeBeurtKaart).join('')}</div>
  </div>`;
  bindStapKnoppen(containerSel, herteken);
  els(`${containerSel} .wl-nu-kaart`).forEach((k) => k.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    openDetail(k.dataset.wp);
  }));
}

/* ---------------- Bouwsteen 3: trechter (Werklijst-pagina) --------------- */
// Open/dicht-status van de boom, alleen voor deze sessie.
const wlOpen = new Set();

function wpStoplicht(wp) {
  const blok = wpBlokkades(wp);
  const hardBlok = blok.some((b) => b.urgentie === 'hard');
  const av = activiteitVoortgang(wp);
  const sig = typeof signalen === 'function' ? signalen(wp) : [];
  const ernst = typeof maxErnst === 'function' ? maxErnst(sig) : 0;
  if (av.geblokkeerd || hardBlok || ernst >= 3) return { kleur: 'var(--rood)', tekst: 'aandacht nodig' };
  if (ernst === 2 || blok.some((b) => b.urgentie === 'zacht')) return { kleur: 'var(--amber)', tekst: 'let op' };
  return { kleur: 'var(--groen, #10b981)', tekst: 'op koers' };
}

function renderWerklijst() {
  const cont = el('#wlInhoud');
  if (!cont) return;
  const wps = gefilterdeWerkpakketten();

  // Totalen voor de KPI-balk.
  let openTot = 0, blokHard = 0, klaarWps = 0;
  wps.forEach((w) => {
    openTot += openStappen(w).totaalOpen;
    if (wpBlokkades(w).some((b) => b.urgentie === 'hard')) blokHard++;
    if (!volgendeStap(w)) klaarWps++;
  });
  el('#wlKpis').innerHTML = [
    { val: wps.length, label: 'werkpakketten in beeld', cls: 'blauw' },
    { val: openTot, label: 'stappen nog te doen', cls: '' },
    { val: blokHard, label: 'werkpakketten wachten op conditionering', cls: 'rood' },
    { val: klaarWps, label: 'werkpakketten helemaal gereed', cls: 'groen' },
  ].map((t) => `<div class="tstat ${t.cls}"><b>${t.val}</b><span>${t.label}</span></div>`).join('');

  // Groepeer project ▸ APD ▸ werkpakket.
  const boom = {};
  wps.forEach((w) => {
    const p = w.project, a = apdVan(w);
    (boom[p] = boom[p] || {});
    (boom[p][a] = boom[p][a] || []).push(w);
  });

  const pijl = (open) => `<span class="wl-pijl">${open ? '▾' : '▸'}</span>`;
  const balkje = (klaar, totaal) => {
    const pct = totaal ? Math.round((klaar / totaal) * 100) : 0;
    return `<span class="wl-balk"><span style="width:${pct}%"></span></span><span class="wl-balk-txt">${klaar}/${totaal} stappen</span>`;
  };

  let html = '';
  Object.keys(boom).sort().forEach((p) => {
    const pKey = `p|${p}`;
    const pWps = Object.values(boom[p]).flat();
    let pKlaar = 0, pTotaal = 0, pBlok = 0;
    pWps.forEach((w) => { const av = activiteitVoortgang(w); pKlaar += av.klaar + av.restpunt; pTotaal += av.totaal; if (wpBlokkades(w).some((b) => b.urgentie !== 'info')) pBlok++; });
    const pOpen = wlOpen.has(pKey);
    html += `<div class="wl-rij niveau-p" data-wl-toggle="${htmlEsc(pKey)}">${pijl(pOpen)}<strong>${htmlEsc(p)}</strong>
      <span class="wl-rechts">${pBlok ? `<span class="wl-blok-tel">⛔ ${pBlok} wacht${pBlok === 1 ? '' : 'en'} op conditionering</span>` : ''}${balkje(pKlaar, pTotaal)}</span></div>`;
    if (!pOpen) return;

    Object.keys(boom[p]).sort().forEach((a) => {
      const aKey = `a|${p}|${a}`;
      const aWps = boom[p][a];
      let aKlaar = 0, aTotaal = 0;
      aWps.forEach((w) => { const av = activiteitVoortgang(w); aKlaar += av.klaar + av.restpunt; aTotaal += av.totaal; });
      const aOpen = wlOpen.has(aKey);
      html += `<div class="wl-rij niveau-a" data-wl-toggle="${htmlEsc(aKey)}">${pijl(aOpen)}${htmlEsc(a)}<span class="hint">· ${aWps.length} werkpakket${aWps.length === 1 ? '' : 'ten'}</span>
        <span class="wl-rechts">${balkje(aKlaar, aTotaal)}</span></div>`;
      if (!aOpen) return;

      aWps.sort((x, y) => x.wp.localeCompare(y.wp)).forEach((w) => {
        const wKey = `w|${w.id}`;
        const wOpen = wlOpen.has(wKey);
        const stap = volgendeStap(w);
        const licht = wpStoplicht(w);
        const av = activiteitVoortgang(w);
        const stapTxt = stap
          ? `${htmlEsc(stap.fase.naam)} — <strong>${htmlEsc(stap.activiteit.naam)}</strong>`
          : 'alle stappen afgehandeld 🎉';
        html += `<div class="wl-rij niveau-w" data-wl-toggle="${htmlEsc(wKey)}">${pijl(wOpen)}<b>${htmlEsc(w.wp)}</b>
          <span class="wl-stoplicht" style="background:${licht.kleur}" title="${licht.tekst}"></span>
          <span class="wl-volgende">${stapTxt}</span>
          <span class="wl-rechts">${htmlEsc(w.engineer || '—')} ${balkje(av.klaar + av.restpunt, av.totaal)}</span></div>`;
        if (wOpen) html += `<div class="wl-stappenplan">${stappenplanHtml(w)}</div>`;
      });
    });
  });

  cont.innerHTML = html || '<div class="card"><div class="leeg">Geen werkpakketten in deze selectie.</div></div>';

  els('#wlInhoud [data-wl-toggle]').forEach((r) => r.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    const k = r.dataset.wlToggle;
    wlOpen.has(k) ? wlOpen.delete(k) : wlOpen.add(k);
    renderWerklijst();
  }));
  bindStapKnoppen('#wlInhoud', () => (typeof render === 'function' ? render() : renderWerklijst()));
  els('#wlInhoud [data-wl-detail]').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation(); openDetail(b.dataset.wlDetail);
  }));
}

// Stappenplan van één werkpakket: afgeronde stappen samengevat, de huidige
// stap uitgelicht met knoppen, komende stappen grijs met verwachte datums.
function stappenplanHtml(wp) {
  const v = State.voortgang[wp.id] || {};
  const volgende = volgendeStap(wp);
  const blok = wpBlokkades(wp);
  let html = blokkadeChips(blok);
  FASES.forEach((f) => {
    const sch = faseSchema(wp, f);
    const fv = faseVoortgang(wp, f);
    const isHuidige = volgende && volgende.fase.id === f.id;
    const status = fv.gereed ? '✓ afgerond' : isHuidige ? '⟶ hier zijn we' : (fv.klaar > 0 ? 'deels gedaan' : 'nog te doen');
    html += `<div class="wl-fase ${fv.gereed ? 'af' : ''} ${isHuidige ? 'huidig' : ''}">
      <div class="wl-fase-kop">${htmlEsc(f.naam)} <span class="hint">${status}${fv.totaal ? ` · ${fv.klaar}/${fv.totaal}` : ''}${fv.restpunten ? ` · ⚑ ${fv.restpunten} restpunt${fv.restpunten === 1 ? '' : 'en'}` : ''}${sch ? ` · ${fmtDatum(sch.start)} → ${fmtDatum(sch.eind)}` : ''}</span></div>`;
    if (fv.gereed) { html += '</div>'; return; }
    f.activiteiten.forEach((a) => {
      const st = (v[a.code] && v[a.code].status) || 'open';
      if (st === 'nvt') return;
      const stInfo = STATUSSEN[st];
      const item = sch ? sch.items.find((it) => it.activiteit.code === a.code) : null;
      const isVolgende = volgende && volgende.activiteit.code === a.code;
      const af = isAfgehandeld(st);
      if (af) {
        html += `<div class="wl-stap af"><span class="wl-stap-status" style="color:${stInfo.kleur}">✓</span>${htmlEsc(a.naam)}</div>`;
      } else if (isVolgende) {
        const info = typeof actInfo === 'function' ? actInfo(a.code) : { omschrijving: a.omschrijving };
        html += `<div class="wl-stap nu">
          <div><span class="statuschip" style="background:${stInfo.kleur}">${stInfo.label}</span> <strong>${htmlEsc(a.naam)}</strong>
          ${item ? `<span class="hint"> · gepland ${fmtDatum(item.start)} → ${fmtDatum(item.eind)}</span>` : ''}</div>
          ${info.omschrijving ? `<div class="wl-nu-omschr">${htmlEsc(info.omschrijving)}</div>` : ''}
          ${stapKnoppen(wp.id, a.code, st)}
        </div>`;
      } else {
        html += `<div class="wl-stap straks"><span class="wl-stap-status" style="color:${stInfo.kleur}">○</span>${htmlEsc(a.naam)}${item ? `<span class="hint"> · verwacht ${fmtDatum(item.start)} → ${fmtDatum(item.eind)}</span>` : ''}${st !== 'open' ? ` <span class="statuschip" style="background:${stInfo.kleur}">${stInfo.label}</span>` : ''}</div>`;
      }
    });
    html += '</div>';
  });
  html += `<div style="margin-top:8px"><button class="mini-knop" data-wl-detail="${htmlEsc(wp.id)}">Open volledig detail</button></div>`;
  return html;
}

if (typeof window !== 'undefined') {
  window.volgendeStap = volgendeStap;
  window.wpBlokkades = wpBlokkades;
  window.renderNuAanDeBeurt = renderNuAanDeBeurt;
  window.renderWerklijst = renderWerklijst;
}
