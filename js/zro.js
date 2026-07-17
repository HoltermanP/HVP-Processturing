/* ==========================================================================
   ZRO — zakelijk recht overeenkomsten (grondzaken).
   Uitgebreid formulier bovenop het gedeelde register in registers.js
   (State.vergunningen, type 'zro') plus een concept-generator die een
   volledige concept-overeenkomst opstelt uit de vastgelegde gegevens,
   optioneel verfijnd met AI via de bestaande rapport-service.
   Hergebruikt globals uit registers.js (magReg, nieuwId, wpById, openModal,
   sluitModal, ZRO_STATUS, zroStatusKey, ZRO_RECHTEN, zroRechtLabel, fmtEuro)
   en app.js (el, els, htmlEsc, fmtDatum, toast, State, apdVan, AI).
   Laadt daarom ná registers.js.
   ========================================================================== */
'use strict';

let zroAiAbort = null;

/* ------------------------------- Formulier ------------------------------- */
function zroForm(item, prefillWpId) {
  item = item || {};
  const wpSel = item.wpId || prefillWpId || '';
  const wpOpts = State.werkpakketten.slice().sort((a, b) => (a.project + a.wp).localeCompare(b.project + b.wp))
    .map((w) => `<option value="${htmlEsc(w.id)}"${w.id === wpSel ? ' selected' : ''}>${htmlEsc(w.project)} · ${htmlEsc(apdVan(w))} · ${htmlEsc(w.wp)}</option>`).join('');
  const statusSel = item.id ? zroStatusKey(item) : 'benaderen';
  const statusOpts = Object.entries(ZRO_STATUS).map(([k, o]) => `<option value="${k}"${k === statusSel ? ' selected' : ''}>${o.label}</option>`).join('');
  const rechtOpts = ZRO_RECHTEN.map(([v, l]) => `<option value="${v}"${v === (item.soortRecht || 'opstal') ? ' selected' : ''}>${l}</option>`).join('');
  const val = (k) => htmlEsc(item[k] == null ? '' : String(item[k]));
  return `
    <div class="modal-veld"><label>Werkpakket</label><select id="zroWp">${wpOpts}</select></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Status</label><select id="zroStatus">${statusOpts}</select></div>
      <div class="modal-veld"><label>Soort recht</label><select id="zroRecht">${rechtOpts}</select></div>
    </div>
    <div class="modal-veld"><label>Omschrijving</label><input id="zroOmschr" value="${val('omschrijving')}" placeholder="bijv. Transportleiding — kruising perceel Mts. Jansma"></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Grondeigenaar / rechthebbende</label><input id="zroEigenaar" value="${val('bevoegdGezag')}" placeholder="bijv. Maatschap Jansma-de Boer"></div>
      <div class="modal-veld"><label>Adres / woonplaats</label><input id="zroEigAdres" value="${val('eigenaarAdres')}" placeholder="bijv. Hoofdweg 12, Tjerkgaast"></div>
    </div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Contact (tel / e-mail)</label><input id="zroEigContact" value="${val('eigenaarContact')}"></div>
      <div class="modal-veld"><label>Pachter / gebruiker</label><input id="zroPachter" value="${val('pachter')}" placeholder="leeg = geen (aparte verklaring nodig)"></div>
    </div>
    <div class="modal-veld"><label>Kadastrale aanduiding</label><input id="zroKadastraal" value="${val('kadastraal')}" placeholder="bijv. gem. Doniawerstal, sectie B, nr. 1234 (meerdere percelen: kommagescheiden)"></div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Strookbreedte (m)</label><input id="zroStrook" type="number" min="0" step="0.5" value="${val('strookBreedte')}" placeholder="bijv. 5"></div>
      <div class="modal-veld"><label>Lengte op perceel (m¹)</label><input id="zroLengte" type="number" min="0" step="1" value="${val('lengte')}" placeholder="bijv. 240"></div>
    </div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Vergoeding zakelijk recht (€)</label><input id="zroVergoeding" type="number" min="0" step="1" value="${val('vergoedingRecht')}"></div>
      <div class="modal-veld"><label>Gewas- / structuurschade (€)</label><input id="zroGewas" type="number" min="0" step="1" value="${val('gewasschade')}" placeholder="leeg = op basis van taxatie"></div>
    </div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Grondverwerver / rentmeester</label><input id="zroVerwerver" value="${val('grondverwerver')}"></div>
      <div class="modal-veld"><label>Notaris</label><input id="zroNotaris" value="${val('notaris')}" placeholder="leeg = nader te bepalen"></div>
    </div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Streefdatum passeren</label><input id="zroStreef" type="date" value="${val('verwachtBesluit')}"></div>
      <div class="modal-veld"><label>Getekend op</label><input id="zroGetekend" type="date" value="${val('datumGetekend')}"></div>
    </div>
    <div class="modal-rij">
      <div class="modal-veld"><label>Notarieel gepasseerd op</label><input id="zroGepasseerd" type="date" value="${val('datumGepasseerd')}"></div>
      <div class="modal-veld"></div>
    </div>
    <div class="modal-veld"><label>Bijzondere voorwaarden</label><textarea id="zroBijzonder" rows="2" placeholder="bijv. drainage herstellen, dekking min. 1,20 m, toegang uitsluitend via de Hoofdweg…">${val('bijzonderheden')}</textarea></div>
    <div class="modal-veld"><label>Notitie / logboek</label><textarea id="zroNotitie" rows="2" placeholder="contactmomenten, afspraken, restpunten…">${val('notitie')}</textarea></div>
    <div class="modal-foot">
      ${item.id ? '<button class="verwijder-knop" id="zroVerwijder">Verwijderen</button>' : ''}
      <button class="ghost" id="zroAnnuleer">Annuleren</button>
      <button class="ghost" id="zroConcept" title="Stelt een concept-overeenkomst op uit deze gegevens">📄 Concept-ZRO</button>
      <button class="primair" id="zroOpslaan">Opslaan</button>
    </div>`;
}

function openZro(item, prefillWpId) {
  if (!magReg()) { toast('Alleen ontwerpleider/manager kan ZRO’s bewerken', 'fout'); return; }
  openModal(item ? 'ZRO bewerken' : 'ZRO toevoegen', zroForm(item, prefillWpId));

  const leesForm = () => {
    const wpId = el('#zroWp').value;
    const omschrijving = el('#zroOmschr').value.trim();
    if (!wpId) { toast('Kies een werkpakket', 'fout'); return null; }
    if (!omschrijving) { toast('Vul een omschrijving in', 'fout'); return null; }
    const num = (sel) => { const v = el(sel).value.trim(); return v === '' ? '' : Number(v); };
    return {
      id: (item && item.id) || nieuwId('vg'),
      wpId, type: 'zro',
      status: el('#zroStatus').value,
      omschrijving,
      bevoegdGezag: el('#zroEigenaar').value.trim(),
      eigenaarAdres: el('#zroEigAdres').value.trim(),
      eigenaarContact: el('#zroEigContact').value.trim(),
      pachter: el('#zroPachter').value.trim(),
      kadastraal: el('#zroKadastraal').value.trim(),
      soortRecht: el('#zroRecht').value,
      strookBreedte: num('#zroStrook'),
      lengte: num('#zroLengte'),
      vergoedingRecht: num('#zroVergoeding'),
      gewasschade: num('#zroGewas'),
      grondverwerver: el('#zroVerwerver').value.trim(),
      notaris: el('#zroNotaris').value.trim(),
      verwachtBesluit: el('#zroStreef').value,
      datumGetekend: el('#zroGetekend').value,
      datumGepasseerd: el('#zroGepasseerd').value,
      bijzonderheden: el('#zroBijzonder').value.trim(),
      notitie: el('#zroNotitie').value.trim(),
      aangevraagd: (item && item.aangevraagd) || '',
    };
  };
  const bewaarRec = (rec) => {
    State.vergunningen = (State.vergunningen || []).filter((v) => v.id !== rec.id);
    State.vergunningen.push(rec);
    State.bewaar(); renderVergunningen(); renderZro();
    if (State.actiefWp) renderDetail(State.actiefWp);
  };

  el('#zroOpslaan').addEventListener('click', () => {
    const rec = leesForm(); if (!rec) return;
    bewaarRec(rec); sluitModal(); toast('ZRO opgeslagen', 'ok');
  });
  el('#zroConcept').addEventListener('click', () => {
    const rec = leesForm(); if (!rec) return;
    bewaarRec(rec); item = rec;
    openConceptZro(rec);
  });
  el('#zroAnnuleer').addEventListener('click', sluitModal);
  const vw = el('#zroVerwijder');
  if (vw) vw.addEventListener('click', () => {
    if (!confirm('Deze ZRO verwijderen?')) return;
    State.vergunningen = (State.vergunningen || []).filter((v) => v.id !== item.id);
    State.bewaar(); sluitModal(); renderVergunningen(); renderZro();
    if (State.actiefWp) renderDetail(State.actiefWp);
    toast('ZRO verwijderd', 'ok');
  });
}

/* --------------------------- Concept-generator --------------------------- */
// Ontbrekende gegevens worden [tussen blokhaken] gezet zodat direct zichtbaar
// is wat er nog ingevuld of uitgezocht moet worden.
function zroConceptTekst(rec) {
  const wp = wpById(rec.wpId);
  const p = (v, hint) => (v === '' || v == null ? `[${hint}]` : String(v));
  const projectStr = wp ? `${wp.project} · ${apdVan(wp)} · ${wp.wp}` : '[project / werkpakket]';
  const eigenaar = p(rec.bevoegdGezag, 'naam grondeigenaar');
  const kad = p(rec.kadastraal, 'kadastrale gemeente, sectie en nummer');
  const breedte = p(rec.strookBreedte, 'breedte');
  const lengte = p(rec.lengte, 'lengte');
  const opp = rec.strookBreedte && rec.lengte ? ` (circa ${(rec.strookBreedte * rec.lengte).toLocaleString('nl-NL')} m²)` : '';
  const rechtLabel = zroRechtLabel(rec.soortRecht).toLowerCase();
  const vergoeding = rec.vergoedingRecht !== '' && rec.vergoedingRecht != null
    ? `${fmtEuro(rec.vergoedingRecht)} (zegge: [bedrag voluit])` : '[bedrag] conform de geldende vergoedingssystematiek';
  const gewas = rec.gewasschade !== '' && rec.gewasschade != null
    ? `een vergoeding van ${fmtEuro(rec.gewasschade)}`
    : 'een vergoeding op basis van taxatie volgens de gangbare normen (o.a. LTO-gewasschadenormen)';
  const pachterBepaling = rec.pachter
    ? `Het perceel is in gebruik bij ${rec.pachter}. Rechthebbende staat ervoor in dat deze gebruiker/pachter door middel van een afzonderlijke gebruikersverklaring met de inhoud van deze overeenkomst instemt; eventuele gewasschade van de gebruiker wordt rechtstreeks met de gebruiker afgerekend.`
    : 'Rechthebbende verklaart dat het perceel niet bij derden in gebruik of verpacht is. Blijkt dit anders te zijn, dan draagt Rechthebbende er zorg voor dat de gebruiker alsnog schriftelijk instemt.';

  return `CONCEPT — ZAKELIJK RECHT OVEREENKOMST (${zroRechtLabel(rec.soortRecht)})
${rec.omschrijving}
Project: ${projectStr}

DE ONDERGETEKENDEN

1. [Naam leidingbeheerder / opdrachtgever], statutair gevestigd te [plaats],
   ten deze rechtsgeldig vertegenwoordigd door [naam en functie],
   hierna te noemen: "Opdrachtgever";

2. ${eigenaar}, ${rec.eigenaarAdres ? `wonende/gevestigd te ${rec.eigenaarAdres}` : 'wonende/gevestigd te [adres en woonplaats]'},
   hierna te noemen: "Rechthebbende";
${rec.eigenaarContact ? `   (contact: ${rec.eigenaarContact})\n` : ''}
NEMEN IN AANMERKING:

a. dat Opdrachtgever in het kader van het project "${wp ? wp.project : '[project]'}" (${projectStr}) een leiding
   met toebehoren wenst aan te leggen, te hebben, te houden, te inspecteren, te onderhouden,
   te vernieuwen en zo nodig te verwijderen;
b. dat het tracé van deze leiding het perceel van Rechthebbende kruist, kadastraal bekend
   ${kad}, hierna: "het Perceel";
c. dat partijen de voorwaarden waaronder dit plaatsvindt in deze overeenkomst wensen vast
   te leggen, vooruitlopend op de notariële vestiging van het zakelijk recht;

EN KOMEN OVEREEN ALS VOLGT:

Artikel 1 — Vestiging zakelijk recht
1.1  Rechthebbende verleent aan Opdrachtgever een ${rechtLabel}, inhoudende het recht om in,
     op en boven het Perceel de leiding met toebehoren aan te leggen, te hebben, te houden,
     te gebruiken, te inspecteren, te onderhouden, te vernieuwen en te verwijderen.
1.2  Het recht wordt gevestigd bij notariële akte en ingeschreven in de openbare registers
     van het Kadaster. Tot het moment van passeren geldt deze overeenkomst tussen partijen
     als bindende titel voor die vestiging.

Artikel 2 — Belemmerde strook
2.1  Het recht wordt uitgeoefend binnen een strook met een breedte van ${breedte} meter
     (de "belemmerde strook"), gelegen over een lengte van circa ${lengte} meter over het
     Perceel${opp}, zoals indicatief weergegeven op de aan deze overeenkomst te hechten
     situatietekening [bijlage 1].
2.2  De leiding wordt aangelegd met een gronddekking conform het ontwerp, doch ten minste
     [1,00] meter, tenzij op de situatietekening anders is aangegeven.

Artikel 3 — Vergoedingen
3.1  Opdrachtgever betaalt aan Rechthebbende een eenmalige vergoeding voor de vestiging
     van het zakelijk recht van ${vergoeding}.
3.2  Voor gewas-, structuur- en overige bodemschade als gevolg van de aanleg ontvangt
     Rechthebbende (dan wel de gebruiker) ${gewas}.
3.3  Betaling vindt plaats binnen 30 dagen na het notarieel passeren van de akte,
     respectievelijk na vaststelling van de schade.

Artikel 4 — Verplichtingen Opdrachtgever
4.1  Opdrachtgever voert de werkzaamheden zorgvuldig uit en herstelt het Perceel na
     afronding zoveel mogelijk in de oorspronkelijke staat, waaronder de aanwezige
     drainage, verhardingen en afrasteringen.
4.2  Opdrachtgever kondigt (onderhouds)werkzaamheden — spoedeisende situaties uitgezonderd —
     ten minste [5] werkdagen van tevoren aan bij Rechthebbende.
4.3  Schade die bij de uitoefening van het recht ontstaat, wordt door Opdrachtgever
     vergoed dan wel hersteld.

Artikel 5 — Verplichtingen Rechthebbende
5.1  Rechthebbende zal binnen de belemmerde strook zonder voorafgaande schriftelijke
     toestemming van Opdrachtgever geen bouwwerken oprichten, geen diepwortelende beplanting
     aanbrengen, geen ontgrondingen of ophogingen uitvoeren en geen gesloten verharding
     aanbrengen.
5.2  Rechthebbende verleent Opdrachtgever en door deze ingeschakelde derden toegang tot de
     belemmerde strook voor zover dat voor de uitoefening van het recht nodig is.

Artikel 6 — Gebruiker / pachter
6.1  ${pachterBepaling}

Artikel 7 — Notariële vestiging en kosten
7.1  De akte wordt gepasseerd ten overstaan van ${p(rec.notaris, 'notaris nader te bepalen')},
     ${rec.verwachtBesluit ? `met als streefdatum ${fmtDatum(rec.verwachtBesluit)}` : 'op een nader te bepalen datum'}.
7.2  De kosten van de akte, de inschrijving in het Kadaster en eventuele overige kosten
     van vestiging komen voor rekening van Opdrachtgever.

Artikel 8 — Bijzondere bepalingen
8.1  ${rec.bijzonderheden || 'Geen.'}

Artikel 9 — Slotbepalingen
9.1  Op deze overeenkomst is Nederlands recht van toepassing.
9.2  Deze overeenkomst bindt ook rechtsopvolgers van Rechthebbende; bij vervreemding van
     het Perceel vóór het passeren van de akte bedingt Rechthebbende dat de verkrijger de
     verplichtingen uit deze overeenkomst overneemt.
9.3  Geschillen worden voorgelegd aan de bevoegde rechter van de rechtbank [arrondissement].

ALDUS OVEREENGEKOMEN EN IN TWEEVOUD ONDERTEKEND

Opdrachtgever:                                Rechthebbende:

________________________                      ________________________
[naam, functie]                               ${eigenaar}
Plaats: ______________                        Plaats: ______________
Datum:  ______________                        Datum:  ______________

--------------------------------------------------------------------------
Automatisch opgesteld concept (HVP Procesturing${rec.grondverwerver ? ` · grondverwerver: ${rec.grondverwerver}` : ''}).
Ter voorbereiding — geen juridisch advies. Laat de definitieve tekst opstellen
of toetsen door de notaris dan wel jurist grondzaken.`;
}

function openConceptZro(rec) {
  if (zroAiAbort) { zroAiAbort.abort(); zroAiAbort = null; }
  const tekst = zroConceptTekst(rec);
  openModal(`Concept-ZRO — ${rec.omschrijving}`, `
    <div class="zro-toolbar">
      <button class="ghost" id="zcTerug">← Bewerken</button>
      <span class="spacer"></span>
      <button class="ghost" id="zcAi" title="Laat AI het concept aanscherpen op basis van de vastgelegde gegevens">✨ Verfijn met AI</button>
      <button class="ghost" id="zcKopieer">Kopieer</button>
      <button class="ghost" id="zcWord">Download (Word)</button>
      <button class="ghost" id="zcPrint">Print</button>
    </div>
    <div id="zcStatus" class="hint" style="margin:6px 2px"></div>
    <div id="zcDoc" class="zro-doc" contenteditable="true" spellcheck="false"></div>
    <p class="hint" style="margin-top:8px">De tekst is direct bewerkbaar. Onderdelen [tussen blokhaken] moeten nog ingevuld of uitgezocht worden.</p>`);
  const doc = el('#zcDoc');
  doc.textContent = tekst;

  el('#zcTerug').addEventListener('click', () => { if (zroAiAbort) { zroAiAbort.abort(); zroAiAbort = null; } openZro(rec); });
  el('#zcKopieer').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(doc.innerText); toast('Concept gekopieerd', 'ok'); }
    catch { toast('Kopiëren lukte niet', 'fout'); }
  });
  const alsHtml = () => `<html><head><meta charset="utf-8"><title>${htmlEsc(rec.omschrijving)}</title></head>
    <body><div style="white-space:pre-wrap;font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.45">${htmlEsc(doc.innerText)}</div></body></html>`;
  el('#zcWord').addEventListener('click', () => {
    const blob = new Blob(['﻿' + alsHtml()], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Concept-ZRO — ${(rec.omschrijving || rec.bevoegdGezag || 'zonder titel').replace(/[\\/:*?"<>|]/g, '-')}.doc`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  });
  el('#zcPrint').addEventListener('click', () => {
    const w = window.open('', '_blank');
    if (!w) { toast('Pop-up geblokkeerd — sta pop-ups toe om te printen', 'fout'); return; }
    w.document.write(alsHtml());
    w.document.close();
    w.focus(); w.print();
  });
  el('#zcAi').addEventListener('click', async () => {
    const knop = el('#zcAi'), status = el('#zcStatus');
    knop.disabled = true;
    status.innerHTML = `<span class="spinner"></span> Concept aanscherpen met ${State.model()}…`;
    zroAiAbort = new AbortController();
    const wp = wpById(rec.wpId);
    const system = 'Je bent een Nederlandse jurist grondzaken bij een leidingbeheerder. Je stelt concept-zakelijk-recht-overeenkomsten (opstalrecht en aanverwante rechten) op voor het leggen van leidingen in percelen van derden. Je schrijft zorgvuldig, zakelijk Nederlands en verzint geen feiten: gegevens die ontbreken laat je als [placeholder tussen blokhaken] staan.';
    const prompt = `Hieronder staan de vastgelegde gegevens van een ZRO en een automatisch opgesteld concept.
Verbeter en vervolledig het concept tot een goed lopende, consistente concept-overeenkomst:
- verwerk alle gegevens op de juiste plek en schrap bepalingen die evident niet van toepassing zijn;
- behoud [placeholders] voor alles wat niet uit de gegevens blijkt (verzin niets);
- behoud de slotwaarschuwing dat dit een concept is dat juridisch getoetst moet worden;
- geef uitsluitend de overeenkomsttekst terug, als platte tekst zonder markdown-opmaak.

GEGEVENS (JSON):
${JSON.stringify({ ...rec, project: wp ? { project: wp.project, apd: apdVan(wp), werkpakket: wp.wp } : null }, null, 2)}

HUIDIG CONCEPT:
${doc.innerText}`;
    try {
      const uit = await AI.genereer({
        system, prompt, model: State.model(), signal: zroAiAbort.signal,
        onDelta: (vol) => { doc.textContent = vol; },
      });
      doc.textContent = uit;
      status.innerHTML = '<span style="color:#047857;font-weight:600">✓ Aangescherpt — lees na, vul de [placeholders] in en laat het juridisch toetsen.</span>';
    } catch (e) {
      if (e.name !== 'AbortError') status.innerHTML = `<span style="color:var(--rood)">⚠️ ${htmlEsc(e.message)}</span>`;
    } finally {
      knop.disabled = false;
      zroAiAbort = null;
    }
  });
}

if (typeof window !== 'undefined') {
  window.openZro = openZro;
  window.openConceptZro = openConceptZro;
}
