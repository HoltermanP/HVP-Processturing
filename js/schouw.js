/* ==========================================================================
   Schouwen — situatie ter plaatse bekijken, beoordelen en vastleggen.

   - Een schouw hangt aan een APD binnen een project en kan in elke fase
     worden uitgevoerd. Eén schouw bestaat uit meerdere DELEN: je rijdt naar
     een locatie, maakt daar foto's en aantekeningen, en rijdt door naar de
     volgende — zo wordt een heel tracé geschouwd.
   - Uitvoering gebeurt op een smartphone: foto's (camera) zijn de
     belangrijkste input, aangevuld met gesproken tekst (Web Speech API) en
     geschreven notities. Bij elk deel wordt de GPS-locatie vastgelegd.
   - Elke schouw is om te zetten in een mooi opgemaakt rapport (HTML in de
     app) dat ook te downloaden is als PDF, Word en HTML — inclusief foto's.
     Optioneel schrijft de AI bevindingen & aanbevelingen voor ontwerp en
     realisatie.

   Data: State.schouwen (metadata, gesynchroniseerd via db.js/Neon). Foto's
   zijn te groot voor de staat en staan apart: lokaal in IndexedDB en op de
   server per stuk via /api/schouwfoto (tabel hvp_fotos).
   Gebruikt globals uit app.js/registers.js op runtime.
   ========================================================================== */
'use strict';

/* ----------------------------- Foto-opslag ------------------------------- */
// IndexedDB als lokale cache/bron + synchronisatie per foto naar Neon.
// Records: { id, data (dataURL), pending (1 = nog niet naar de server) }.
const SchouwFotos = (() => {
  const DB_NAAM = 'hvp-schouw-fotos';
  const STORE = 'fotos';
  let dbBelofte = null;

  function open() {
    if (dbBelofte) return dbBelofte;
    dbBelofte = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAAM, 1);
      req.onupgradeneeded = () => { req.result.createObjectStore(STORE, { keyPath: 'id' }); };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbBelofte;
  }
  async function tx(modus, werk) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const t = db.transaction(STORE, modus);
      const uit = werk(t.objectStore(STORE));
      t.oncomplete = () => resolve(uit && 'result' in uit ? uit.result : undefined);
      t.onerror = () => reject(t.error);
    });
  }
  const idbZet = (rec) => tx('readwrite', (s) => s.put(rec));
  const idbHaal = (id) => tx('readonly', (s) => s.get(id));
  const idbWis = (id) => tx('readwrite', (s) => s.delete(id));
  const idbLeeg = () => tx('readwrite', (s) => s.clear());
  const idbAlle = () => tx('readonly', (s) => s.getAll());

  async function upload(id, data) {
    try {
      const r = await fetch('/api/schouwfoto', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, data }),
      });
      if (r.ok) { await idbZet({ id, data, pending: 0 }); return true; }
    } catch { /* offline of lokaal — blijft pending */ }
    return false;
  }

  // Foto opslaan: eerst lokaal (altijd), daarna (poging tot) server.
  async function zet(id, data) {
    await idbZet({ id, data, pending: 1 });
    upload(id, data);
  }

  // Foto ophalen: lokaal → anders van de server (en dan lokaal cachen).
  async function haal(id) {
    try {
      const rec = await idbHaal(id);
      if (rec && rec.data) return rec.data;
    } catch { /* IndexedDB niet beschikbaar */ }
    try {
      const r = await fetch(`/api/schouwfoto?id=${encodeURIComponent(id)}`);
      if (r.ok) {
        const d = await r.json();
        if (d && d.data) { idbZet({ id, data: d.data, pending: 0 }).catch(() => {}); return d.data; }
      }
    } catch { /* offline */ }
    return null;
  }

  // Meerdere foto's tegelijk (rapporten, fotogrid): lokaal wat kan, de rest
  // in batches van de server. Levert een Map id → dataURL (of null).
  async function haalVeel(ids) {
    const uit = new Map();
    const missend = [];
    for (const id of ids) {
      let rec = null;
      try { rec = await idbHaal(id); } catch { /* geen IDB */ }
      if (rec && rec.data) uit.set(id, rec.data); else missend.push(id);
    }
    for (let i = 0; i < missend.length; i += 25) {
      const batch = missend.slice(i, i + 25);
      try {
        const r = await fetch(`/api/schouwfoto?ids=${encodeURIComponent(batch.join(','))}`);
        if (r.ok) {
          const d = await r.json();
          for (const f of (d.fotos || [])) {
            uit.set(f.id, f.data);
            idbZet({ id: f.id, data: f.data, pending: 0 }).catch(() => {});
          }
        }
      } catch { /* offline */ }
    }
    ids.forEach((id) => { if (!uit.has(id)) uit.set(id, null); });
    return uit;
  }

  async function verwijder(id) {
    try { await idbWis(id); } catch { /* ok */ }
    try { await fetch(`/api/schouwfoto?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); } catch { /* offline */ }
  }
  async function wisAlles() {
    try { await idbLeeg(); } catch { /* ok */ }
    try { await fetch('/api/schouwfoto?alles=1', { method: 'DELETE' }); } catch { /* offline */ }
  }

  // Nog niet geüploade foto's alsnog naar de server (bij start / herverbinden).
  async function syncAchterstand() {
    let alle = [];
    try { alle = await idbAlle(); } catch { return; }
    for (const rec of alle) if (rec.pending) await upload(rec.id, rec.data);
  }

  return { zet, haal, haalVeel, verwijder, wisAlles, syncAchterstand };
})();

/* ------------------------------ Constanten ------------------------------- */
const SCH_STATUS = {
  lopend:   { label: 'Lopend',   kleur: '#0ea5e9' },
  afgerond: { label: 'Afgerond', kleur: '#10b981' },
};

// Niet-persistente UI-staat.
const SchUI = {
  open: null,          // schouw-id in de editor (null = lijstweergave)
  filter: 'alle',      // KPI-filter op de lijst
  rapportVoor: null,   // schouw-id waarvoor het rapport in beeld staat
  opname: null,        // { deelId, recognition, basis } tijdens spraakopname
};

/* -------------------------------- Helpers -------------------------------- */
function schById(id) { return (State.schouwen || []).find((s) => s.id === id); }
function schMagBewerken() { return true; }  // schouwen is veldwerk: iedere ingelogde gebruiker
function schMagVerwijderen(sch) {
  if (!window.Auth || Auth.magVolledig()) return true;
  return sch.doorId && sch.doorId === Auth.userId;
}
function schFotoTeller(sch) { return (sch.delen || []).reduce((n, d) => n + (d.fotos || []).length, 0); }
function schAlleFotoIds(sch) { return (sch.delen || []).flatMap((d) => (d.fotos || []).map((f) => f.id)); }
function schFaseLabel(faseId) {
  const f = (window.FASES || []).find((x) => x.id === faseId);
  return f ? f.naam : (faseId || '—');
}
function schProjecten() { return [...new Set(State.werkpakketten.map((w) => w.project))].sort(); }
function schApdsVoor(project) {
  return [...new Set(State.werkpakketten.filter((w) => w.project === project).map(apdVan))].sort();
}
function schCoord(deel) {
  if (deel.lat == null || deel.lon == null) return null;
  return `${(+deel.lat).toFixed(5)}, ${(+deel.lon).toFixed(5)}`;
}
function schKaartUrl(deel) { return `https://www.google.com/maps?q=${deel.lat},${deel.lon}`; }
function schTijd(iso) {
  const d = iso ? new Date(iso) : null;
  if (!d || isNaN(d)) return '';
  return d.toLocaleString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function schBestandsnaam(sch) {
  return `schouw-${(sch.project + '-' + sch.apd + '-' + (sch.titel || sch.datum)).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')   // accenten behouden als kale letter (tracé → trace)
    .replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')}`;
}

/* ------------------------- Foto's comprimeren ---------------------------- */
// Camera-foto's zijn 3–10 MB; voor opslag en rapporten is ±1400 px ruim
// voldoende. Compressie gebeurt client-side via canvas (JPEG).
async function schComprimeerFoto(file, maxKant = 1400, kwaliteit = 0.72) {
  let bron, breedte, hoogte, opruimen = null;
  try {
    bron = await createImageBitmap(file, { imageOrientation: 'from-image' });
    breedte = bron.width; hoogte = bron.height;
  } catch {
    // Terugval: via een <img> (moderne browsers passen EXIF-rotatie zelf toe).
    bron = await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('kon foto niet lezen')); };
      img.src = url;
      opruimen = () => URL.revokeObjectURL(url);
    });
    breedte = bron.naturalWidth; hoogte = bron.naturalHeight;
  }
  const schaal = Math.min(1, maxKant / Math.max(breedte, hoogte));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(breedte * schaal));
  canvas.height = Math.max(1, Math.round(hoogte * schaal));
  canvas.getContext('2d').drawImage(bron, 0, 0, canvas.width, canvas.height);
  if (bron.close) bron.close();
  if (opruimen) opruimen();
  return canvas.toDataURL('image/jpeg', kwaliteit);
}

/* ------------------------------ GPS-locatie ------------------------------ */
function schVraagLocatie() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('Locatiebepaling wordt niet ondersteund op dit apparaat')); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, nauwkeurigheid: Math.round(pos.coords.accuracy) }),
      (err) => reject(new Error(err.code === 1 ? 'Geen toestemming voor locatie — sta locatietoegang toe in de browser' : 'Locatie kon niet worden bepaald')),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 15000 }
    );
  });
}

/* ---------------------------- Spraak (dicteren) --------------------------- */
function schSpraakBeschikbaar() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); }

function schStopOpname() {
  if (!SchUI.opname) return;
  try { SchUI.opname.recognition.stop(); } catch { /* al gestopt */ }
  SchUI.opname = null;
  els('.sch-mic.opname').forEach((b) => { b.classList.remove('opname'); b.innerHTML = '🎤 Inspreken'; });
}

function schStartOpname(sch, deel, knop, veld) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SR();
  rec.lang = 'nl-NL';
  rec.continuous = true;
  rec.interimResults = true;
  const basis = deel.dictaat ? deel.dictaat.replace(/\s+$/, '') + ' ' : '';
  SchUI.opname = { deelId: deel.id, recognition: rec, basis };
  knop.classList.add('opname');
  knop.innerHTML = '⏺ Opname… tik om te stoppen';

  let definitief = '';
  rec.onresult = (e) => {
    let interim = '';
    definitief = '';
    for (let i = 0; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) definitief += r[0].transcript + ' ';
      else interim += r[0].transcript;
    }
    veld.value = (basis + definitief + interim).trim();
    deel.dictaat = (basis + definitief).trim();
  };
  rec.onerror = (e) => {
    schStopOpname();
    if (e.error === 'not-allowed') toast('Geen toestemming voor de microfoon', 'fout');
    else if (e.error !== 'aborted' && e.error !== 'no-speech') toast('Spraakherkenning gaf een fout: ' + e.error, 'fout');
    State.bewaar();
  };
  rec.onend = () => {
    // Opname beëindigd (door gebruiker, stilte of systeem): tekst bewaren.
    if (SchUI.opname && SchUI.opname.recognition === rec) SchUI.opname = null;
    knop.classList.remove('opname');
    knop.innerHTML = '🎤 Inspreken';
    deel.dictaat = veld.value.trim();
    State.bewaar();
  };
  try { rec.start(); } catch { schStopOpname(); }
}

/* ================================ LIJST =================================== */
function schGefilterd() {
  const f = State.filters; const zoek = (f.zoek || '').toLowerCase();
  return (State.schouwen || []).filter((s) => {
    if (f.project && s.project !== f.project) return false;
    if (f.apd && s.apd !== f.apd) return false;
    if (zoek) {
      const blob = `${s.project} ${s.apd} ${s.titel} ${s.door} ${schFaseLabel(s.fase)} ${(s.delen || []).map((d) => `${d.titel} ${d.dictaat} ${d.notitie}`).join(' ')}`.toLowerCase();
      if (!blob.includes(zoek)) return false;
    }
    return true;
  });
}

function renderSchouwen() {
  if (!el('#schKpis')) return;
  // Editor open → alleen de editor tonen (lijst blijft verborgen).
  if (SchUI.open && schById(SchUI.open)) { renderSchouwEditor(schById(SchUI.open)); return; }
  SchUI.open = null;
  el('#schEditor').style.display = 'none';
  el('#schKpis').parentElement.style.display = '';
  el('#schInhoud').style.display = '';

  const alle = schGefilterd();
  const tel = {
    totaal: alle.length,
    lopend: alle.filter((s) => s.status !== 'afgerond').length,
    afgerond: alle.filter((s) => s.status === 'afgerond').length,
    delen: alle.reduce((n, s) => n + (s.delen || []).length, 0),
    fotos: alle.reduce((n, s) => n + schFotoTeller(s), 0),
  };
  const tiles = [
    { tf: 'alle', cls: 'blauw', val: tel.totaal, label: 'schouwen' },
    { tf: 'lopend', cls: 'amber', val: tel.lopend, label: 'lopend' },
    { tf: 'afgerond', cls: 'groen', val: tel.afgerond, label: 'afgerond' },
    { tf: '_delen', cls: '', val: tel.delen, label: 'geschouwde locaties' },
    { tf: '_fotos', cls: '', val: tel.fotos, label: "foto's" },
  ];
  el('#schKpis').innerHTML = tiles.map((t) => {
    const klik = t.tf.startsWith('_') ? '' : ' klikbaar' + (SchUI.filter === t.tf ? ' actief' : '');
    return `<div class="tstat ${t.cls}${klik}" data-tf="${t.tf}" ${t.tf.startsWith('_') ? '' : 'tabindex="0" role="button"'}><b>${t.val}</b><span>${t.label}</span></div>`;
  }).join('');
  els('#schKpis .tstat.klikbaar').forEach((t) => {
    const zet = () => { SchUI.filter = SchUI.filter === t.dataset.tf ? 'alle' : t.dataset.tf; renderSchouwen(); };
    t.addEventListener('click', zet);
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zet(); } });
  });

  let lijst = alle.slice();
  if (SchUI.filter === 'lopend') lijst = lijst.filter((s) => s.status !== 'afgerond');
  else if (SchUI.filter === 'afgerond') lijst = lijst.filter((s) => s.status === 'afgerond');
  lijst.sort((a, b) => (b.datum || '').localeCompare(a.datum || ''));

  const rows = lijst.map((s) => {
    const st = SCH_STATUS[s.status] || SCH_STATUS.lopend;
    return `<tr class="rij" data-id="${htmlEsc(s.id)}">
      <td>${fmtDatum(parseDatum(s.datum))}</td>
      <td><strong>${htmlEsc(s.project)}</strong><div class="sub">${htmlEsc(s.apd)}</div></td>
      <td>${htmlEsc(s.titel || '—')}${s.aanleiding ? `<div class="sub">${htmlEsc(s.aanleiding.slice(0, 90))}${s.aanleiding.length > 90 ? '…' : ''}</div>` : ''}</td>
      <td>${htmlEsc(schFaseLabel(s.fase))}</td>
      <td class="num">${(s.delen || []).length}</td>
      <td class="num">${schFotoTeller(s)}</td>
      <td>${htmlEsc(s.door || '—')}</td>
      <td>${regBadge(st)}</td>
      <td class="reg-acties"><button class="mini-knop" data-rap="${htmlEsc(s.id)}">rapport</button></td>
    </tr>`;
  }).join('');

  el('#schInhoud').innerHTML = `<div class="card">
    <div class="card-kop"><h2>Schouwen<span class="tel">${lijst.length}</span></h2><span class="hint">Klik op een rij om de schouw te openen of verder te schouwen</span></div>
    <div class="tabel-wrap"><table class="tabel">
      <thead><tr><th>Datum</th><th>Project · APD</th><th>Titel</th><th>Fase</th><th class="num">Delen</th><th class="num">Foto's</th><th>Uitgevoerd door</th><th>Status</th><th></th></tr></thead>
      <tbody>${rows || `<tr><td colspan="9" class="leeg">${(State.schouwen || []).length ? 'Geen schouwen in deze selectie.' : 'Nog geen schouwen vastgelegd. Klik op “Nieuwe schouw” om ter plaatse te beginnen.'}</td></tr>`}</tbody>
    </table></div></div>`;

  els('#schInhoud .rij').forEach((tr) => tr.addEventListener('click', (e) => {
    if (e.target.closest('[data-rap]')) return;
    openSchouwEditor(tr.dataset.id);
  }));
  els('#schInhoud [data-rap]').forEach((b) => b.addEventListener('click', () => {
    const sch = schById(b.dataset.rap);
    if (sch) toonSchouwRapport(sch, { scroll: true });
  }));
}

/* --------------------------- Nieuwe schouw ------------------------------- */
function openNieuweSchouw() {
  if (!State.werkpakketten.length) { toast('Er zijn nog geen projecten — importeer eerst de planning', 'fout'); return; }
  const projecten = schProjecten();
  const eerste = State.filters.project || projecten[0];
  const projOpts = projecten.map((p) => `<option value="${htmlEsc(p)}"${p === eerste ? ' selected' : ''}>${htmlEsc(p)}</option>`).join('');
  const faseOpts = ['<option value="">—</option>'].concat((window.FASES || []).map((f) => `<option value="${htmlEsc(f.id)}">${htmlEsc(f.naam)}</option>`)).join('');
  openModal('Nieuwe schouw', `
    <div class="modal-rij">
      <div class="modal-veld"><label>Project</label><select id="schNwProject">${projOpts}</select></div>
      <div class="modal-veld"><label>APD</label><select id="schNwApd"></select></div>
    </div>
    <div class="modal-veld"><label>Titel / doel van de schouw</label><input id="schNwTitel" placeholder="bijv. Tracéschouw kruising N354"></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Fase waarin geschouwd wordt</label><select id="schNwFase">${faseOpts}</select>
        <span class="hint">Een schouw kan in álle fasen worden gedaan.</span></div>
      <div class="modal-veld"><label>Datum</label><input id="schNwDatum" type="date" value="${isoDatum(new Date())}"></div>
    </div>
    <div class="modal-veld"><label>Uitgevoerd door</label><input id="schNwDoor" value="${htmlEsc(window.Auth ? Auth.naam() : '')}"></div>
    <div class="modal-veld"><label>Aanleiding / opdracht (optioneel)</label><textarea id="schNwAanleiding" rows="2" placeholder="Waarom wordt er geschouwd? Waar moet op gelet worden?"></textarea></div>
    <div class="modal-foot">
      <button class="ghost" id="schNwAnnuleer">Annuleren</button>
      <button class="primair" id="schNwStart">⌖ Start schouw</button>
    </div>`);
  const vulApds = () => {
    const apds = schApdsVoor(el('#schNwProject').value);
    el('#schNwApd').innerHTML = apds.map((a) => `<option value="${htmlEsc(a)}">${htmlEsc(a)}</option>`).join('');
    if (State.filters.apd && apds.includes(State.filters.apd)) el('#schNwApd').value = State.filters.apd;
  };
  vulApds();
  el('#schNwProject').addEventListener('change', vulApds);
  el('#schNwAnnuleer').addEventListener('click', sluitModal);
  el('#schNwStart').addEventListener('click', () => {
    const sch = {
      id: nieuwId('sch'),
      project: el('#schNwProject').value,
      apd: el('#schNwApd').value,
      titel: el('#schNwTitel').value.trim(),
      fase: el('#schNwFase').value,
      datum: el('#schNwDatum').value || isoDatum(new Date()),
      door: el('#schNwDoor').value.trim() || (window.Auth ? Auth.naam() : ''),
      doorId: window.Auth ? Auth.userId : null,
      status: 'lopend',
      aanleiding: el('#schNwAanleiding').value.trim(),
      delen: [],
      rapport: null,
    };
    if (!sch.apd) { toast('Kies een APD', 'fout'); return; }
    State.schouwen = State.schouwen || [];
    State.schouwen.push(sch);
    State.bewaar();
    sluitModal();
    openSchouwEditor(sch.id);
    // Meteen het eerste deel klaarzetten: ter plaatse direct kunnen fotograferen.
    schNieuwDeel(sch);
    toast('Schouw gestart — leg de eerste locatie vast', 'ok');
  });
}

/* ================================ EDITOR ================================== */
function openSchouwEditor(id) {
  SchUI.open = id;
  SchUI.rapportVoor = null;
  el('#schRapportKaart').style.display = 'none';
  const sch = schById(id);
  if (sch) renderSchouwEditor(sch);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function sluitSchouwEditor() {
  schStopOpname();
  SchUI.open = null;
  renderSchouwen();
}

function schNieuwDeel(sch) {
  const deel = {
    id: nieuwId('schd'),
    titel: '',
    lat: null, lon: null, nauwkeurigheid: null,
    tijd: new Date().toISOString(),
    fotos: [],
    dictaat: '',
    notitie: '',
  };
  sch.delen.push(deel);
  State.bewaar();
  renderSchouwEditor(sch);
  // Locatie direct proberen vast te leggen — dat is per deel de bedoeling.
  schLegLocatieVast(sch, deel, { stil: true });
}

function schLegLocatieVast(sch, deel, { stil = false } = {}) {
  const node = el(`.sch-deel[data-deel="${deel.id}"] .sch-loc-info`);
  if (node) node.innerHTML = '<span class="spinner"></span> locatie bepalen…';
  schVraagLocatie().then((loc) => {
    deel.lat = loc.lat; deel.lon = loc.lon; deel.nauwkeurigheid = loc.nauwkeurigheid;
    if (!deel.tijd) deel.tijd = new Date().toISOString();
    State.bewaar();
    const n2 = el(`.sch-deel[data-deel="${deel.id}"] .sch-loc-info`);
    if (n2) n2.innerHTML = schLocatieHtml(deel);
    if (!stil) toast('Locatie vastgelegd', 'ok');
  }).catch((e) => {
    const n2 = el(`.sch-deel[data-deel="${deel.id}"] .sch-loc-info`);
    if (n2) n2.innerHTML = schLocatieHtml(deel);
    if (!stil) toast(e.message, 'fout');
  });
}

function schLocatieHtml(deel) {
  const c = schCoord(deel);
  if (!c) return '<span class="hint">nog geen locatie vastgelegd</span>';
  return `◉ <a href="${htmlEsc(schKaartUrl(deel))}" target="_blank" rel="noopener">${htmlEsc(c)}</a>${deel.nauwkeurigheid ? ` <span class="hint">(±${deel.nauwkeurigheid} m)</span>` : ''}`;
}

function renderSchouwEditor(sch) {
  el('#schKpis').parentElement.style.display = 'none';
  el('#schInhoud').style.display = 'none';
  const editor = el('#schEditor');
  editor.style.display = '';

  const faseOpts = ['<option value="">—</option>'].concat((window.FASES || []).map((f) =>
    `<option value="${htmlEsc(f.id)}"${f.id === sch.fase ? ' selected' : ''}>${htmlEsc(f.naam)}</option>`)).join('');
  const apdOpts = schApdsVoor(sch.project).map((a) => `<option value="${htmlEsc(a)}"${a === sch.apd ? ' selected' : ''}>${htmlEsc(a)}</option>`).join('');
  const projOpts = schProjecten().map((p) => `<option value="${htmlEsc(p)}"${p === sch.project ? ' selected' : ''}>${htmlEsc(p)}</option>`).join('');
  const st = SCH_STATUS[sch.status] || SCH_STATUS.lopend;

  const delenHtml = (sch.delen || []).map((deel, i) => schDeelHtml(deel, i)).join('')
    || '<p class="leeg" style="padding:14px">Nog geen locaties. Tik op “Nieuwe locatie” zodra je ter plaatse bent.</p>';

  editor.innerHTML = `<div class="card sch-editor">
    <div class="sch-editor-kop">
      <button class="ghost" id="schTerug">← Alle schouwen</button>
      <div class="knoppenrij">
        <button class="ghost" id="schStatusToggle">${sch.status === 'afgerond' ? '↺ Heropen schouw' : '✓ Schouw afronden'}</button>
        <button class="primair" id="schRapportMaak">📄 Rapport maken</button>
      </div>
    </div>
    <div class="sch-kop-info">
      <h2>${htmlEsc(sch.titel || 'Schouw')} ${regBadge(st)}</h2>
      <p class="sub">${htmlEsc(sch.project)} · ${htmlEsc(sch.apd)} · ${fmtDatum(parseDatum(sch.datum))} · ${htmlEsc(sch.door || '')}</p>
    </div>
    <div class="sch-meta-grid">
      <div class="modal-veld"><label>Titel / doel</label><input data-schveld="titel" value="${htmlEsc(sch.titel || '')}" placeholder="bijv. Tracéschouw kruising N354"></div>
      <div class="modal-veld"><label>Project</label><select data-schveld="project">${projOpts}</select></div>
      <div class="modal-veld"><label>APD</label><select data-schveld="apd">${apdOpts}</select></div>
      <div class="modal-veld"><label>Fase</label><select data-schveld="fase">${faseOpts}</select></div>
      <div class="modal-veld"><label>Datum</label><input data-schveld="datum" type="date" value="${htmlEsc(sch.datum || '')}"></div>
      <div class="modal-veld"><label>Uitgevoerd door</label><input data-schveld="door" value="${htmlEsc(sch.door || '')}"></div>
    </div>
    <div class="modal-veld"><label>Aanleiding / opdracht</label><textarea data-schveld="aanleiding" rows="2" placeholder="Waarom wordt er geschouwd? Waar moet op gelet worden?">${htmlEsc(sch.aanleiding || '')}</textarea></div>

    <div id="schDelen">${delenHtml}</div>

    <button class="sch-groteknop" id="schDeelAdd">⌖ Nieuwe locatie <span class="hint" style="color:inherit;opacity:.8">— rijd naar het volgende punt en leg het vast</span></button>

    <div class="sch-editor-foot">
      ${schMagVerwijderen(sch) ? '<button class="verwijder-knop" id="schVerwijder">Schouw verwijderen</button>' : '<span></span>'}
      <span class="hint">Alles wordt automatisch opgeslagen${DB.status === 'online' ? ' en gesynchroniseerd' : ' (lokaal — synchroniseert zodra er verbinding is)'}.</span>
    </div>
  </div>`;

  bindSchouwEditor(sch);
}

function schDeelHtml(deel, i) {
  const fotos = (deel.fotos || []).map((f) => `
    <figure class="sch-thumb" data-foto="${htmlEsc(f.id)}" title="Tik om te bekijken of een bijschrift toe te voegen">
      <img alt="${htmlEsc(f.bijschrift || 'schouwfoto')}" data-fotoimg="${htmlEsc(f.id)}">
      <figcaption>${htmlEsc(f.bijschrift || '')}</figcaption>
    </figure>`).join('');
  return `<div class="sch-deel" data-deel="${htmlEsc(deel.id)}">
    <div class="sch-deel-kop">
      <span class="sch-deel-nr">${i + 1}</span>
      <input class="sch-deel-titel" data-deelveld="titel" value="${htmlEsc(deel.titel || '')}" placeholder="Locatienaam, bijv. Duiker DR04 / kruising Hoofdweg">
      <button class="mini-knop" data-deelweg="${htmlEsc(deel.id)}" title="Dit deel verwijderen">✕</button>
    </div>
    <div class="sch-loc">
      <span class="sch-loc-info">${schLocatieHtml(deel)}</span>
      <span class="hint">${schTijd(deel.tijd)}</span>
      <button class="mini-knop" data-loc="${htmlEsc(deel.id)}">⌖ ${schCoord(deel) ? 'locatie opnieuw' : 'locatie vastleggen'}</button>
    </div>
    <div class="sch-fotos">
      ${fotos}
      <label class="sch-foto-add" title="Foto's maken of kiezen">📷<span>foto</span>
        <input type="file" accept="image/*" capture="environment" multiple hidden data-fotoadd="${htmlEsc(deel.id)}">
      </label>
    </div>
    <div class="modal-veld">
      <label class="sch-dictaat-label">Gesproken toelichting
        ${schSpraakBeschikbaar() ? `<button class="mini-knop sch-mic" data-spraak="${htmlEsc(deel.id)}">🎤 Inspreken</button>` : '<span class="hint">geen spraakherkenning in deze browser — gebruik de microfoontoets van het toetsenbord</span>'}
      </label>
      <textarea data-deelveld="dictaat" rows="3" placeholder="Spreek je bevindingen in of typ ze hier…">${htmlEsc(deel.dictaat || '')}</textarea>
    </div>
    <div class="modal-veld">
      <label>Notities / beoordeling</label>
      <textarea data-deelveld="notitie" rows="2" placeholder="Beoordeling van de situatie, maten, obstakels, afspraken…">${htmlEsc(deel.notitie || '')}</textarea>
    </div>
  </div>`;
}

function bindSchouwEditor(sch) {
  el('#schTerug').addEventListener('click', sluitSchouwEditor);
  el('#schStatusToggle').addEventListener('click', () => {
    sch.status = sch.status === 'afgerond' ? 'lopend' : 'afgerond';
    State.bewaar(); renderSchouwEditor(sch);
    toast(sch.status === 'afgerond' ? 'Schouw afgerond' : 'Schouw heropend', 'ok');
  });
  el('#schRapportMaak').addEventListener('click', () => {
    sch.rapport = Object.assign({}, sch.rapport, {
      gemaakt: new Date().toISOString(),
      door: window.Auth ? Auth.naam() : '',
    });
    State.bewaar();
    toonSchouwRapport(sch, { scroll: true });
  });
  el('#schDeelAdd').addEventListener('click', () => schNieuwDeel(sch));
  const weg = el('#schVerwijder');
  if (weg) weg.addEventListener('click', () => {
    if (!confirm('Deze schouw én alle bijbehorende foto’s verwijderen? Dit kan niet ongedaan gemaakt worden.')) return;
    schAlleFotoIds(sch).forEach((id) => SchouwFotos.verwijder(id));
    State.schouwen = (State.schouwen || []).filter((s) => s.id !== sch.id);
    State.bewaar();
    sluitSchouwEditor();
    toast('Schouw verwijderd', 'ok');
  });

  // Kopvelden van de schouw.
  els('#schEditor [data-schveld]').forEach((n) => n.addEventListener('change', () => {
    const veld = n.dataset.schveld;
    sch[veld] = n.value.trim ? n.value.trim() : n.value;
    if (veld === 'project') {
      const apds = schApdsVoor(sch.project);
      if (!apds.includes(sch.apd)) sch.apd = apds[0] || '';
      State.bewaar(); renderSchouwEditor(sch); return;
    }
    State.bewaar();
  }));

  // Velden en acties per deel.
  els('#schEditor .sch-deel').forEach((kaart) => {
    const deel = (sch.delen || []).find((d) => d.id === kaart.dataset.deel);
    if (!deel) return;
    kaart.querySelectorAll('[data-deelveld]').forEach((n) => n.addEventListener('change', () => {
      deel[n.dataset.deelveld] = n.value.trim();
      State.bewaar();
    }));
    const locKnop = kaart.querySelector('[data-loc]');
    if (locKnop) locKnop.addEventListener('click', () => schLegLocatieVast(sch, deel));
    const wegKnop = kaart.querySelector('[data-deelweg]');
    if (wegKnop) wegKnop.addEventListener('click', () => {
      if (!confirm(`Deel ${(sch.delen || []).indexOf(deel) + 1} met ${(deel.fotos || []).length} foto's verwijderen?`)) return;
      (deel.fotos || []).forEach((f) => SchouwFotos.verwijder(f.id));
      sch.delen = sch.delen.filter((d) => d.id !== deel.id);
      State.bewaar(); renderSchouwEditor(sch);
    });
    const fotoAdd = kaart.querySelector('[data-fotoadd]');
    if (fotoAdd) fotoAdd.addEventListener('change', async (e) => {
      const files = [...(e.target.files || [])];
      e.target.value = '';
      if (!files.length) return;
      toast(`${files.length} foto${files.length > 1 ? "'s" : ''} verwerken…`);
      for (const file of files) {
        try {
          const data = await schComprimeerFoto(file);
          const foto = { id: nieuwId('schf'), bijschrift: '', tijd: new Date().toISOString() };
          await SchouwFotos.zet(foto.id, data);
          deel.fotos = deel.fotos || [];
          deel.fotos.push(foto);
        } catch { toast('Eén foto kon niet worden gelezen', 'fout'); }
      }
      State.bewaar();
      renderSchouwEditor(sch);
      toast('Foto’s toegevoegd', 'ok');
    });
    const mic = kaart.querySelector('[data-spraak]');
    if (mic) mic.addEventListener('click', () => {
      const veld = kaart.querySelector('[data-deelveld="dictaat"]');
      if (SchUI.opname && SchUI.opname.deelId === deel.id) { schStopOpname(); return; }
      schStopOpname();
      schStartOpname(sch, deel, mic, veld);
    });
    kaart.querySelectorAll('.sch-thumb').forEach((fig) => fig.addEventListener('click', () => {
      const foto = (deel.fotos || []).find((f) => f.id === fig.dataset.foto);
      if (foto) openSchouwFotoModal(sch, deel, foto);
    }));
  });

  schLaadThumbs('#schEditor');
}

// Thumbnails asynchroon inladen vanuit de fotostore.
async function schLaadThumbs(containerSel) {
  const imgs = els(`${containerSel} img[data-fotoimg]`);
  for (const img of imgs) {
    const data = await SchouwFotos.haal(img.dataset.fotoimg);
    if (data) img.src = data;
    else img.closest('.sch-thumb')?.classList.add('leeg');
  }
}

/* --------------------------- Foto bekijken/bewerken ----------------------- */
function openSchouwFotoModal(sch, deel, foto) {
  openModal('Foto', `
    <div class="sch-foto-groot"><img id="schFotoGroot" alt="schouwfoto"></div>
    <div class="modal-veld"><label>Bijschrift</label><input id="schFotoBijschrift" value="${htmlEsc(foto.bijschrift || '')}" placeholder="bijv. Bestaande duiker, doorsnede ± 800 mm"></div>
    <p class="hint">${schTijd(foto.tijd)}${schCoord(deel) ? ` · locatie deel: ${htmlEsc(schCoord(deel))}` : ''}</p>
    <div class="modal-foot">
      <button class="verwijder-knop" id="schFotoWeg">Verwijderen</button>
      <button class="ghost" id="schFotoAnnuleer">Sluiten</button>
      <button class="primair" id="schFotoOpslaan">Opslaan</button>
    </div>`);
  SchouwFotos.haal(foto.id).then((data) => { const img = el('#schFotoGroot'); if (img && data) img.src = data; });
  el('#schFotoAnnuleer').addEventListener('click', sluitModal);
  el('#schFotoOpslaan').addEventListener('click', () => {
    foto.bijschrift = el('#schFotoBijschrift').value.trim();
    State.bewaar(); sluitModal(); renderSchouwEditor(sch);
  });
  el('#schFotoWeg').addEventListener('click', () => {
    if (!confirm('Deze foto verwijderen?')) return;
    SchouwFotos.verwijder(foto.id);
    deel.fotos = (deel.fotos || []).filter((f) => f.id !== foto.id);
    State.bewaar(); sluitModal(); renderSchouwEditor(sch);
    toast('Foto verwijderd', 'ok');
  });
}

/* ================================ RAPPORT ================================= */
// Deterministisch, mooi opgemaakt rapport uit de schouwdata; foto's komen als
// data-URL's uit de fotostore. De AI kan optioneel bevindingen & aanbevelingen
// toevoegen (sch.rapport.samenvatting, Markdown).
function schRapportInhoudHtml(sch, fotoMap) {
  const st = SCH_STATUS[sch.status] || SCH_STATUS.lopend;
  const tegel = (val, label, cls = '') => `<div class="rk-kpi ${cls}"><b>${val}</b><span>${htmlEsc(label)}</span></div>`;
  const kop = `<div class="rapport-kop">
      <div class="rk-brand"><div class="rk-logo">HVP</div>
        <div><h1 class="rk-titel">Schouwrapport — ${htmlEsc(sch.titel || sch.apd)}</h1>
        <div class="rk-sub">${htmlEsc(sch.project)} · ${htmlEsc(sch.apd)}${sch.fase ? ' · ' + htmlEsc(schFaseLabel(sch.fase)) : ''} · ${fmtDatum(parseDatum(sch.datum))}</div></div></div>
      <div class="rk-meta">Procesturing — Bouwteamfase Nulelie<br>uitgevoerd door ${htmlEsc(sch.door || '—')} · status ${htmlEsc(st.label)}</div>
    </div>
    <div class="rk-kpis">
      ${tegel((sch.delen || []).length, 'geschouwde locaties')}
      ${tegel(schFotoTeller(sch), "foto's")}
      ${tegel(htmlEsc(schFaseLabel(sch.fase) || '—'), 'fase')}
      ${tegel(htmlEsc(st.label), 'status', sch.status === 'afgerond' ? 'groen' : 'amber')}
    </div>`;

  const aanleiding = sch.aanleiding
    ? `<h2>Aanleiding &amp; opdracht</h2><p>${htmlEsc(sch.aanleiding)}</p>` : '';

  const samenvatting = sch.rapport && sch.rapport.samenvatting
    ? `<h2>Bevindingen &amp; aanbevelingen</h2><div class="sch-rap-ai">${markdownNaarHtml(sch.rapport.samenvatting)}</div>` : '';

  const delen = (sch.delen || []).map((deel, i) => {
    const c = schCoord(deel);
    const locatie = c
      ? `◉ <a href="${htmlEsc(schKaartUrl(deel))}">${htmlEsc(c)}</a>${deel.nauwkeurigheid ? ` (±${deel.nauwkeurigheid} m)` : ''}`
      : 'locatie niet vastgelegd';
    const teksten = [
      deel.dictaat ? `<p><strong>Toelichting (ingesproken):</strong> ${htmlEsc(deel.dictaat)}</p>` : '',
      deel.notitie ? `<p><strong>Notities:</strong> ${htmlEsc(deel.notitie)}</p>` : '',
    ].join('');
    const fotos = (deel.fotos || []).map((f) => {
      const data = fotoMap ? fotoMap.get(f.id) : null;
      const img = data
        ? `<img src="${data}" alt="${htmlEsc(f.bijschrift || 'schouwfoto')}">`
        : '<div class="sch-rap-fotoleeg">foto niet beschikbaar op dit apparaat</div>';
      return `<figure class="sch-rap-foto">${img}${f.bijschrift ? `<figcaption>${htmlEsc(f.bijschrift)}</figcaption>` : ''}</figure>`;
    }).join('');
    return `<section class="sch-rap-deel">
      <h2>Deel ${i + 1}${deel.titel ? ' — ' + htmlEsc(deel.titel) : ''}</h2>
      <p class="sch-rap-meta">${locatie} · ${htmlEsc(schTijd(deel.tijd) || '')}</p>
      ${teksten || '<p class="sch-rap-leegtekst">Geen tekstuele toelichting bij dit deel.</p>'}
      ${fotos ? `<div class="sch-rap-fotos">${fotos}</div>` : ''}
    </section>`;
  }).join('') || '<p>Deze schouw bevat nog geen vastgelegde locaties.</p>';

  const meta = sch.rapport && sch.rapport.gemaakt
    ? `<div class="rapport-meta" style="margin-top:22px">Rapport opgesteld ${schTijd(sch.rapport.gemaakt)} door ${htmlEsc(sch.rapport.door || '—')}${sch.rapport.samenvatting ? ` · bevindingen door AI (${htmlEsc(sch.rapport.model || '')})` : ''} · bron: schouwregistratie in HVP Procesturing</div>`
    : '';

  return kop + aanleiding + samenvatting + delen + meta;
}

// CSS-aanvulling voor schouwrapporten (in-app én standalone/PDF).
const SCH_RAP_CSS = `
  .sch-rap-deel{page-break-inside:avoid;border-top:1px solid #e4e9f0;margin-top:6px}
  .sch-rap-meta{color:#64748b;font-size:12.5px;margin:-4px 0 10px}
  .sch-rap-fotos{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;margin:6px 0 18px}
  .sch-rap-foto{margin:0;page-break-inside:avoid}
  .sch-rap-foto img{width:100%;border-radius:10px;border:1px solid #e4e9f0;display:block}
  .sch-rap-foto figcaption{font-size:11.5px;color:#64748b;margin-top:5px;line-height:1.45}
  .sch-rap-fotoleeg{background:#f1f5f9;border:1px dashed #cbd5e1;border-radius:10px;padding:26px 10px;text-align:center;color:#94a3b8;font-size:12px}
  .sch-rap-leegtekst{color:#94a3b8;font-style:italic}
  @media print{.sch-rap-fotos{grid-template-columns:repeat(2,1fr)}}`;

function schStandaloneHtml(sch, inhoudHtml) {
  // Hergebruik van de bestaande rapport-CSS + schouwspecifieke aanvulling.
  const basis = rapportStandaloneHtml(`Schouwrapport — ${sch.titel || sch.apd}`, inhoudHtml);
  return basis.replace('</style>', SCH_RAP_CSS + '</style>');
}

// Rapport in de app tonen (en bewaren dat het gemaakt is).
async function toonSchouwRapport(sch, { scroll = false } = {}) {
  SchUI.rapportVoor = sch.id;
  const kaart = el('#schRapportKaart');
  const doc = el('#schRapDoc');
  kaart.style.display = 'block';
  el('#schRapportTitel').textContent = `Schouwrapport — ${sch.titel || sch.apd}`;
  doc.innerHTML = '<p class="hint"><span class="spinner"></span> rapport samenstellen…</p>';
  if (scroll) kaart.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const aiKnop = el('#schRapAi');
  if (aiKnop) aiKnop.textContent = sch.rapport && sch.rapport.samenvatting ? '✦ Bevindingen opnieuw (AI)' : '✦ Bevindingen door AI';
  const fotoMap = await SchouwFotos.haalVeel(schAlleFotoIds(sch));
  // Tegen race met een tweede klik: alleen tonen als dit nog het actieve rapport is.
  if (SchUI.rapportVoor !== sch.id) return;
  doc.innerHTML = schRapportInhoudHtml(sch, fotoMap);
  doc._schouwId = sch.id;
}

/* --------------------- AI: bevindingen & aanbevelingen -------------------- */
function schAiData(sch) {
  return {
    project: sch.project, apd: sch.apd, titel: sch.titel,
    fase: schFaseLabel(sch.fase), datum: sch.datum, uitgevoerdDoor: sch.door,
    aanleiding: sch.aanleiding || null,
    delen: (sch.delen || []).map((d, i) => ({
      deel: i + 1, locatienaam: d.titel || null,
      coordinaten: schCoord(d), tijdstip: d.tijd,
      ingesprokenToelichting: d.dictaat || null,
      notities: d.notitie || null,
      fotobijschriften: (d.fotos || []).map((f) => f.bijschrift).filter(Boolean),
      aantalFotos: (d.fotos || []).length,
    })),
  };
}

let schAiAbort = null;
async function genereerSchouwAi(sch) {
  const status = el('#schRapStatus');
  status.innerHTML = `<span class="spinner"></span> Bevindingen schrijven met ${htmlEsc(State.model())}…`;
  if (schAiAbort) schAiAbort.abort();
  schAiAbort = new AbortController();
  const system = `Je bent een ervaren ontwerpleider bij netbeheerder-aannemer HVP, bouwteamfase "Nulelie" (drinkwatertransportleidingen). Een collega heeft ter plaatse een schouw uitgevoerd langs een tracé en per locatie foto's, ingesproken toelichting en notities vastgelegd. Schrijf op basis daarvan het onderdeel "Bevindingen & aanbevelingen" van het schouwrapport, in zakelijk en helder Nederlands, als Markdown met deze structuur:

## Samenvatting
## Bevindingen per locatie
## Aandachtspunten voor het ontwerp
## Aandachtspunten voor de realisatie

Gebruik UITSLUITEND de aangeleverde gegevens — verzin geen waarnemingen, maten of locaties. Verwijs naar de delen als "deel 1", "deel 2" enz. (met de locatienaam als die er is). Wees concreet over wat de waarnemingen betekenen voor het verdere ontwerp en de uitvoering. Begin direct met de inhoud.`;
  const prompt = `Hieronder de vastgelegde schouwgegevens (JSON). Dit is de enige bron:\n\n${JSON.stringify(schAiData(sch), null, 2)}`;
  try {
    const tekst = await AI.genereer({
      system, prompt, model: State.model(), signal: schAiAbort.signal,
      onDelta: () => {},
    });
    sch.rapport = Object.assign({}, sch.rapport, {
      samenvatting: tekst,
      gemaakt: new Date().toISOString(),
      door: window.Auth ? Auth.naam() : '',
      model: State.model(),
    });
    State.bewaar();
    status.innerHTML = '<span style="color:#047857;font-weight:600">✓ Bevindingen toegevoegd aan het rapport.</span>';
    toonSchouwRapport(sch);
  } catch (e) {
    status.innerHTML = `<div class="ai-waarsch">⚠️ <div><strong>Kon de bevindingen niet genereren.</strong><br>${htmlEsc(e.message)}<br><span class="hint">Het rapport zelf blijft gewoon beschikbaar; de AI-service vereist <code>ANTHROPIC_API_KEY</code> (op Vercel).</span></div></div>`;
  }
}

/* ------------------------------- Downloads -------------------------------- */
function schRapportSchouw() {
  const sch = SchUI.rapportVoor ? schById(SchUI.rapportVoor) : null;
  if (!sch) toast('Maak eerst een rapport (open een schouw → “Rapport maken”)', 'fout');
  return sch;
}

async function downloadSchouwHtml() {
  const sch = schRapportSchouw(); if (!sch) return;
  const fotoMap = await SchouwFotos.haalVeel(schAlleFotoIds(sch));
  const blob = new Blob([schStandaloneHtml(sch, schRapportInhoudHtml(sch, fotoMap))], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${schBestandsnaam(sch)}.html`;
  a.click();
  toast('Rapport gedownload als HTML', 'ok');
}

// --- Word: MHT-bestand (multipart met ingesloten foto's), opent in Word. ---
function schWordHtml(sch, fotoNamen) {
  // Bewust eenvoudige, Word-vriendelijke opmaak (inline stijlen, geen grid).
  const st = SCH_STATUS[sch.status] || SCH_STATUS.lopend;
  const h2 = 'font-family:Calibri,Arial,sans-serif;font-size:15pt;color:#23506c;border-bottom:1px solid #b6cddd;padding-bottom:4px;margin:24pt 0 8pt';
  const p = 'font-family:Calibri,Arial,sans-serif;font-size:10.5pt;color:#1f2937;margin:0 0 8pt';
  const klein = 'font-family:Calibri,Arial,sans-serif;font-size:8.5pt;color:#64748b;margin:0 0 6pt';
  let n = 0;
  const delen = (sch.delen || []).map((deel, i) => {
    const c = schCoord(deel);
    const fotos = (deel.fotos || []).map((f) => {
      const naam = fotoNamen.get(f.id);
      if (!naam) return '';
      return `<p style="${p};margin-top:10pt"><img src="${naam}" width="440" alt=""></p>` +
        (f.bijschrift ? `<p style="${klein}">${htmlEsc(f.bijschrift)}</p>` : '');
    }).join('');
    return `<h2 style="${h2}">Deel ${i + 1}${deel.titel ? ' — ' + htmlEsc(deel.titel) : ''}</h2>
      <p style="${klein}">${c ? `Locatie: ${htmlEsc(c)}${deel.nauwkeurigheid ? ` (±${deel.nauwkeurigheid} m)` : ''} · ` : ''}${htmlEsc(schTijd(deel.tijd) || '')}</p>
      ${deel.dictaat ? `<p style="${p}"><b>Toelichting (ingesproken):</b> ${htmlEsc(deel.dictaat)}</p>` : ''}
      ${deel.notitie ? `<p style="${p}"><b>Notities:</b> ${htmlEsc(deel.notitie)}</p>` : ''}
      ${fotos}`;
  }).join('');
  const samenvatting = sch.rapport && sch.rapport.samenvatting
    ? `<h2 style="${h2}">Bevindingen &amp; aanbevelingen</h2><div style="${p}">${markdownNaarHtml(sch.rapport.samenvatting)}</div>` : '';
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Schouwrapport</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>@page{size:A4;margin:2cm} table,td{border-collapse:collapse}</style></head>
<body>
<h1 style="font-family:Calibri,Arial,sans-serif;font-size:20pt;color:#14304a;margin:0 0 4pt">Schouwrapport — ${htmlEsc(sch.titel || sch.apd)}</h1>
<p style="${klein};font-size:10pt">${htmlEsc(sch.project)} · ${htmlEsc(sch.apd)}${sch.fase ? ' · ' + htmlEsc(schFaseLabel(sch.fase)) : ''} · ${fmtDatum(parseDatum(sch.datum))} · uitgevoerd door ${htmlEsc(sch.door || '—')} · status ${htmlEsc(st.label)}</p>
<p style="${klein}">HVP Procesturing — Bouwteamfase Nulelie · ${(sch.delen || []).length} locaties · ${schFotoTeller(sch)} foto's</p>
${sch.aanleiding ? `<h2 style="${h2}">Aanleiding &amp; opdracht</h2><p style="${p}">${htmlEsc(sch.aanleiding)}</p>` : ''}
${samenvatting}
${delen}
<p style="${klein};margin-top:18pt">Rapport opgesteld ${schTijd((sch.rapport && sch.rapport.gemaakt) || new Date().toISOString())} · bron: schouwregistratie in HVP Procesturing</p>
</body></html>`;
}

async function downloadSchouwWord() {
  const sch = schRapportSchouw(); if (!sch) return;
  toast('Word-document samenstellen…');
  const fotoMap = await SchouwFotos.haalVeel(schAlleFotoIds(sch));
  const grens = '----=_HvpSchouwGrens_0001';
  const fotoNamen = new Map();
  const delenMime = [];
  let n = 0;
  for (const [id, data] of fotoMap) {
    if (!data) continue;
    const m = data.match(/^data:(image\/[\w+.-]+);base64,(.*)$/s);
    if (!m) continue;
    const naam = `foto${++n}.jpg`;
    fotoNamen.set(id, naam);
    const b64 = m[2].replace(/(.{76})/g, '$1\r\n');
    delenMime.push(`--${grens}\r\nContent-Type: ${m[1]}\r\nContent-Transfer-Encoding: base64\r\nContent-Location: ${naam}\r\n\r\n${b64}\r\n`);
  }
  const html = schWordHtml(sch, fotoNamen);
  const htmlB64 = btoa(unescape(encodeURIComponent(html))).replace(/(.{76})/g, '$1\r\n');
  const mht = `MIME-Version: 1.0\r\nContent-Type: multipart/related; type="text/html"; boundary="${grens}"\r\n\r\n` +
    `--${grens}\r\nContent-Type: text/html; charset="utf-8"\r\nContent-Transfer-Encoding: base64\r\nContent-Location: rapport.htm\r\n\r\n${htmlB64}\r\n` +
    delenMime.join('') + `--${grens}--\r\n`;
  const blob = new Blob([mht], { type: 'application/msword' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${schBestandsnaam(sch)}.doc`;
  a.click();
  toast('Rapport gedownload als Word-document', 'ok');
}

// --- PDF: via html2pdf (CDN, lazy geladen); terugval op de printdialoog. ---
let schHtml2pdfBelofte = null;
function schLaadHtml2pdf() {
  if (window.html2pdf) return Promise.resolve();
  if (schHtml2pdfBelofte) return schHtml2pdfBelofte;
  schHtml2pdfBelofte = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    s.onload = resolve;
    s.onerror = () => { schHtml2pdfBelofte = null; reject(new Error('kon html2pdf niet laden')); };
    document.head.appendChild(s);
  });
  return schHtml2pdfBelofte;
}

async function downloadSchouwPdf() {
  const sch = schRapportSchouw(); if (!sch) return;
  const status = el('#schRapStatus');
  status.innerHTML = '<span class="spinner"></span> PDF samenstellen — dit kan bij veel foto’s even duren…';
  const fotoMap = await SchouwFotos.haalVeel(schAlleFotoIds(sch));
  const inhoud = schRapportInhoudHtml(sch, fotoMap);
  try {
    await schLaadHtml2pdf();
    // String-modus: html2pdf beheert zelf een correct gepositioneerde
    // rendercontainer (een eigen off-screen div geeft verschoven/lege pagina's).
    const standalone = schStandaloneHtml(sch, inhoud);
    const cssTekst = (standalone.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '';
    const bronHtml = `<style>${cssTekst.replace(/body\{[^}]*\}/, '')}
      /* PDF: foto's in hoogte begrenzen zodat ze niet over een paginagrens knippen */
      .sch-rap-foto img{max-height:330px;width:auto;max-width:100%;display:block;margin:0 auto}
      </style>` +
      `<div class="vel" style="margin:0;max-width:none;border:0;box-shadow:none;border-radius:0;padding:26px 30px">${inhoud}</div>`;
    await window.html2pdf().set({
      margin: [8, 8, 10, 8],
      filename: `${schBestandsnaam(sch)}.pdf`,
      image: { type: 'jpeg', quality: 0.9 },
      html2canvas: { scale: 2, useCORS: true, logging: false, scrollX: 0, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    }).from(bronHtml, 'string').save();
    status.innerHTML = '';
    toast('Rapport gedownload als PDF', 'ok');
  } catch {
    // Terugval: printvenster — "Opslaan als PDF" werkt op elk apparaat.
    status.innerHTML = '';
    const w = window.open('', '_blank');
    if (!w) { toast('Sta pop-ups toe om de PDF te maken', 'fout'); return; }
    w.document.write(schStandaloneHtml(sch, inhoud).replace('</body>', '<script>window.onload=()=>setTimeout(()=>window.print(),400)<\/script></body>'));
    w.document.close();
    toast('Kies “Opslaan als PDF” in het printvenster', 'ok');
  }
}

/* ------------------- Samenvatting voor de AI-rapportages ------------------ */
function schouwRapportData(scope) {
  const lijst = (State.schouwen || []).filter((s) => scope === 'portfolio' || s.project === scope);
  if (!lijst.length) return null;
  return {
    toelichting: 'Schouwen: de situatie ter plaatse is bekeken en beoordeeld; input voor ontwerp en realisatie.',
    totaal: lijst.length,
    lopend: lijst.filter((s) => s.status !== 'afgerond').length,
    afgerond: lijst.filter((s) => s.status === 'afgerond').length,
    recent: lijst.slice().sort((a, b) => (b.datum || '').localeCompare(a.datum || '')).slice(0, 8)
      .map((s) => ({
        datum: s.datum, project: s.project, apd: s.apd, titel: s.titel,
        fase: schFaseLabel(s.fase), locaties: (s.delen || []).length,
        fotos: schFotoTeller(s), status: (SCH_STATUS[s.status] || {}).label,
      })),
  };
}

/* --------------------------------- Init ----------------------------------- */
function schouwInit() {
  const add = el('#schToevoegen');
  if (add) add.addEventListener('click', openNieuweSchouw);
  const pdf = el('#schRapPdf');
  if (pdf) pdf.addEventListener('click', downloadSchouwPdf);
  const word = el('#schRapWord');
  if (word) word.addEventListener('click', downloadSchouwWord);
  const html = el('#schRapHtml');
  if (html) html.addEventListener('click', downloadSchouwHtml);
  const ai = el('#schRapAi');
  if (ai) ai.addEventListener('click', () => { const sch = schRapportSchouw(); if (sch) genereerSchouwAi(sch); });
  // Nog niet gesynchroniseerde foto's alsnog uploaden (na offline veldwerk).
  SchouwFotos.syncAchterstand();
  DB.onStatus((s) => { if (s === 'online') SchouwFotos.syncAchterstand(); });
}

/* --------------------------------- Export --------------------------------- */
if (typeof window !== 'undefined') {
  window.SchouwFotos = SchouwFotos;
  window.renderSchouwen = renderSchouwen;
  window.schouwRapportData = schouwRapportData;
  window.schouwInit = schouwInit;
}
