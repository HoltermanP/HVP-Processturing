/* ==========================================================================
   Activiteiten- en fasemodel van de bouwteamfase "Nulelie"
   Bron: "Werkpakketactiviteiten beschrijvingen Nulelie 2.0"
   Elke fase is gekoppeld aan de mijlpaal-datumkolommen uit de planning-CSV,
   zodat de planning en de inhoudelijke activiteiten samen één proces vormen.
   ========================================================================== */

const FASES = [
  {
    id: '0',
    code: '0.0',
    naam: 'Analysefase',
    kleur: '#6366f1',
    // CSV-mijlpalen die het tijdvenster van deze fase bepalen
    startMijlpaal: 'overdrachtVO',
    eindMijlpaal: 'analyseNaarVO',
    omschrijving:
      'Begint met het ontvangen van projectdocumenten (IV en TOF). Onderscheid tussen het controleren van compleetheid (binnen 5 werkdagen) en het inhoudelijk analyseren. De startnota sluit de fase af en vormt de formele acceptatie om het project te starten.',
    activiteiten: [
      { code: '0.01', naam: 'Ontvangen IV/TOF studie van OG', omschrijving: 'Via VISI ontvangen van IV (investeringsvoorstel) en TOF (Techniek, Omgeving, Financieel) projectdocumentatie van opdrachtgever.' },
      { code: '0.02', naam: 'Stukken controleren op compleetheid', omschrijving: 'Binnen 5 werkdagen vult HVP het intakeformulier in waarop wordt aangegeven of alle stukken volledig en ontvangen zijn.' },
      { code: '0.03', naam: 'Inhoudelijk beoordelen TOF (techniek, omgeving, financieel)', omschrijving: 'Analyseren van de TOF-studie: vaststellen of informatie correct/actueel/volledig is, of uitgangspunten realiseerbaar zijn en het identificeren van risico’s, afwijkingen en restpunten.' },
      { code: '0.04', naam: 'Warme overdracht', omschrijving: 'Ca. 2 weken na ontvangst vindt een warme overdracht met Liander plaats met vragen en toelichting op de ontvangen documenten.' },
      { code: '0.05', naam: 'Acceptatie IV/TOF', omschrijving: 'Formeel accepteren van de IV- en TOV-documenten door ondertekening van een ApD-bouwteamdocument. Pas daarna start het project en kan de VO-fase ingeleid worden.' },
      { code: '0.06', naam: 'Inrichten projectomgeving', omschrijving: 'Inrichten van de systemen (Relatics, Clockwise, M-files, ACC) voor het project.' },
      { code: '0.07', naam: 'Opstellen startnota', omschrijving: 'Startnota legt uitgangspunten, scope, planning, werkpakketten en organisatorische afspraken vast. Sluit de analysefase af en dient als plan van aanpak voor de VO-fase.' },
      { code: '0.08', naam: 'Beoordeling startnota Liander', omschrijving: 'Liander beoordeelt de startnota binnen 2 weken. HVP biedt de startnota aan binnen VISI.' },
    ],
  },
  {
    id: '1',
    code: '1.0',
    naam: 'VO-fase',
    kleur: '#0ea5e9',
    startMijlpaal: 'analyseNaarVO',
    eindMijlpaal: 'startConceptDO',
    omschrijving:
      'Het schetsontwerp wordt overgenomen in een DWG-tekening als basis voor quickscan-bureaustudies. Verder worden het voorlopig ontwerp en de CROW 500 (controle bestaande kabels en leidingen) doorlopen.',
    activiteiten: [
      { code: '1.01', naam: 'Opstellen schetsontwerp', omschrijving: 'Opstellen van een DWG-tekening met daarin het tracé uit het aangeleverde schetsontwerp.' },
      { code: '1.02.01', naam: 'Versturen DWG schetsontwerp t.b.v. Quickscan/Bureaustudies', omschrijving: 'Versturen van DWG-schetsontwerp (incl. PDF en werkpakketverdeling) t.b.v. offerteaanvraag.' },
      { code: '1.02.02', naam: 'Overeenkomen offerte en starten Quickscan/Bureaustudies', omschrijving: 'Op basis van een menulijst wordt een unieke offerte opgesteld voor de bureaustudies van een gebied.' },
      { code: '1.02.03', naam: 'Resultaten Bureaustudie ontvangen', omschrijving: 'Ontvangen resultaten (archeologie, ecologie, OON/NGE, aeriusberekening, milieu en hydrologie) worden in de VO-fase verwerkt.' },
      { code: '1.03.01', naam: 'CROW 500 invullen', omschrijving: 'Toetsen van ontwerp en werkzaamheden aan richtlijn CROW 500 om graafschade te voorkomen en risicovolle locaties te bepalen.' },
      { code: '1.03.02', naam: 'Akkoord ophalen bij Netbeheerders', omschrijving: 'Formeel akkoord verkrijgen van netbeheerders (Gasunie, Defensie, RWS, Vitens e.a.) op het ontwerptracé bij raakvlakken of nabijheid van hun assets.' },
      { code: '1.03.03', naam: 'Duikers inmeten', omschrijving: 'Inmeten van de ligging van relevante duikers om kruisingen en risico’s te bepalen.' },
      { code: '1.03.04', naam: 'Bepalen proefsleuflocaties', omschrijving: 'Identificeren en selecteren van locaties waar proefsleuven nodig zijn ter verificatie van ligging K&L, duikers en CROW-500-risico’s.' },
      { code: '1.04.01', naam: 'Opstellen Verificatieplan', omschrijving: 'Vastleggen welke eisen worden gecontroleerd, op welke wijze, door wie en in welk werkpakket (in Relatics, o.b.v. eisenverificatiedatabase).' },
      { code: '1.04.02', naam: 'Boorlocaties bepalen', omschrijving: 'Selecteren en onderbouwen van boorlocaties voor sleufloze technieken o.b.v. ondergrondse risico’s, duikers/watergangen, te kruisen objecten en eisen.' },
      { code: '1.04.03', naam: 'Kabeltrekplan maken', omschrijving: 'Bepalen van de kabeltrek met beoogde route, haspel- en lierinzet en moflocaties.' },
      { code: '1.04.04', naam: 'Stakeholder inventarisatie', omschrijving: 'Bepalen met welke stakeholders we te maken hebben op het tracé via gegevens bij het kadaster.' },
      { code: '1.04.05', naam: 'Opstellen Voorlopig ontwerp', omschrijving: 'Opstellen van een voorlopig ontwerp op basis van de uitkomsten uit de bureaustudies.' },
    ],
  },
  {
    id: '2',
    code: '2.0',
    naam: 'DO-fase (ApD 00)',
    kleur: '#f59e0b',
    startMijlpaal: 'startConceptDO',
    eindMijlpaal: 'doNaarUO',
    omschrijving:
      'Oplevering van een volledig, maakbaar en verifieerbaar Definitief Ontwerp (DO), geschikt als basis voor vergunningverlening, UO-fase en uitvoeringsvoorbereiding. Het DO is het eindpunt van de ontwerpfase.',
    activiteiten: [
      { code: '2.02.00', naam: 'Inplannen rentmeesters', omschrijving: 'Vroegtijdig aanhaken en inplannen van rentmeesters zodat ZRO’s tijdig worden ondertekend met perceeleigenaren.' },
      { code: '2.01.01', naam: '1e Kennismakingsgesprekken t.b.v. ZRO', omschrijving: 'Toetsen van de bereidheid om mee te werken aan kabellegging op de percelen. Eerste gesprekken altijd met 2 medewerkers (veiligheid).' },
      { code: '2.01.02', naam: 'ZRO-tekening opstellen', omschrijving: 'Opstellen van ZRO-tekening (notarieel, definitieve ligging) en werkstrooktekening (schadeafhandeling/uitvoering), afgestemd met de grondeigenaar.' },
      { code: '2.01.03', naam: 'Vervolggesprekken met grondeigenaren t.b.v. ZRO', omschrijving: 'Gesprekken tot overeenstemming over ZRO en werkstrook. Aantal niet vooraf te voorspellen; afspraken over onderzoeken en schadevergoedingen.' },
      { code: '2.01.04', naam: "ZRO's afronden", omschrijving: 'Ondertekening van ZRO en werkstrookovereenkomst door grondeigenaren, pachter/huurder en rentmeester namens Liander.' },
      { code: '2.02.01', naam: 'Kennismaking bevoegd gezagen', omschrijving: 'Vroegtijdig afstemming met partijen met formele rol in vergunningverlening; draagvlak creëren en inzicht in beleidskaders en vereisten.' },
      { code: '2.02.02', naam: 'Vergunningenanalyse', omschrijving: 'Analyse van aan te vragen vergunningen; bijhouden van het vergunningenregister (vergunningen, meldingen, toestemmingen).' },
      { code: '2.02.03', naam: 'Schouw met bevoegd gezag', omschrijving: 'Doornemen van ontwerpuitgangspunten tijdens een schouw met bevoegde gezagen ter voorbereiding op de vergunningsaanvraag.' },
      { code: '2.02.04', naam: 'Aanvraag omgevingsvergunning', omschrijving: 'Tijdig, volledig en conform regelgeving aanvragen van de omgevingsvergunning (incl. AVOI). Aanvraag via het WOW-portaal.' },
      { code: '2.02.05', naam: 'Aanvraagvergunning Kabels en Leidingen', omschrijving: 'Aanvragen van kabel- en leidingvergunningen (AVOI). Wordt doorgaans in de UO-fase aangevraagd zodra het tracé exact bekend is.' },
      { code: '2.03.01', naam: 'Offerte Conditionerende onderzoeken overeenkomen', omschrijving: 'Bureaustudies vormen uitgangspunt voor het uitvragen van een offerte voor conditionerende onderzoeken.' },
      { code: '2.03.02', naam: 'Conditionerende onderzoeken uitzetten', omschrijving: 'Veldonderzoeken: archeologie, ecologie, aeriusberekening, verfijning hydrologie en OOO. Locatie tracé/boringen is bepalend.' },
      { code: '2.03.03', naam: 'Maken beïnvloedingsberekening', omschrijving: 'Vaststellen of de nieuwe verbinding ondergrondse infrastructuur beïnvloedt (m.n. stalen gasleidingen). Wettelijk verplicht boven 1kV; via DEP of HVE.' },
      { code: '2.03.04', naam: 'Maken belastbaarheidsberekening', omschrijving: 'Vaststellen of een kabel technisch/thermisch veilig belast kan worden binnen normen. Uitgezet bij DEP door het ontwerpteam.' },
      { code: '2.03.05', naam: 'Vervolgonderzoeken', omschrijving: 'Verdiepende onderzoeken bij hotspots/afwijkingen uit de eerste conditionerende onderzoeken, zodat keuzes aantoonbaar en vergunningsgereed zijn.' },
      { code: '2.04.01', naam: 'Schouw met realisatie', omschrijving: 'Toetsen van de maakbaarheid van het DO tijdens een schouw met het realisatieteam.' },
      { code: '2.04.02', naam: 'Boringen uitwerken', omschrijving: 'Uitwerken van alle gegevens voor gestuurde boringen zodat de boorafdeling een volledig en uitvoerbaar boorplan kan opstellen.' },
      { code: '2.04.03', naam: 'Graven proefsleuven', omschrijving: 'Zichtbaar maken van de exacte ligging van ondergrondse K&L en bevestigen van bureau-onderzoek/CROW-500/KLIC. Inclusief proefsleufmelding bij bevoegd gezag.' },
      { code: '2.04.04', naam: 'Verwerken resultaten proefsleuven', omschrijving: 'Verwerken van proefsleufresultaten in het ontwerp om de feitelijke ondergrondse situatie te integreren.' },
      { code: '2.05.01', naam: 'Toestemming OIV-er', omschrijving: 'Formele technische toestemming van de OIV’er op ontwerpkeuzes en uitvoeringsmethodieken (veiligheid, betrouwbaarheid, beheerbaarheid). Beoordeling o.b.v. S-bladen.' },
      { code: '2.06.01', naam: 'DO tekeningen maken', omschrijving: 'Opstellen van een volledig, maakbaar en afgestemd DO incl. verwerking van quickscan, sonderingen, proefsleuven, duikerdata en beïnvloedingsberekeningen.' },
      { code: '2.06.02', naam: 'Opstellen Risicodossier', omschrijving: 'Gestructureerd samenbrengen van risico’s (ontwerp, omgeving, uitvoering); analyse van kans/impact/beheersmaatregelen; actueel houden VO→DO.' },
      { code: '2.06.03', naam: 'Opstellen Verificatierapport', omschrijving: 'Aantonen in hoeverre het ontwerp voldoet aan eisen (OG, regelgeving, bevoegd gezag, S-bladen). Registratie van bevindingen in Relatics.' },
      { code: '2.06.04', naam: 'Opstellen DO-raming', omschrijving: 'Volledig onderbouwde, DO-conforme kostenraming incl. uitvoering, omgeving, boringen en verwerking van risico’s/onzekerheden.' },
      { code: '2.06.05', naam: 'Verkeersplannen opstellen', omschrijving: 'Tijdelijke verkeersmaatregelen (TVM) en verkeerskundige plannen voor veiligheid, doorstroming en bereikbaarheid tijdens werkzaamheden.' },
      { code: '2.06.07', naam: 'Opstellen DO-ontwikkelnota', omschrijving: 'Integraal document met resultaten, risico’s, onderbouwingen en ontwerpkeuzes uit de DO-fase; basis voor interne beoordeling en afstemming met OG.' },
      { code: '2.06.06', naam: 'Interne review en indienen DO-ontwikkelnota', omschrijving: 'Intern reviewen van de DO-ontwikkelnota, reviewresultaat verwerken en indienen bij de opdrachtgever.' },
      { code: '2.06.08', naam: 'Beoordeling en feedback vanuit OG', omschrijving: 'Beoordeling door OG; opmerkingen verwerken. Afsluitbaar nadat alle opmerkingen behandeld zijn en de DO-ontwikkelnota is goedgekeurd.' },
    ],
  },
  {
    id: '3',
    code: '3.0',
    naam: 'UO-fase (ApD 00)',
    kleur: '#10b981',
    startMijlpaal: 'doNaarUO',
    eindMijlpaal: 'eindeUO',
    omschrijving:
      'Opstellen van de UO-nota: een verder uitgewerkte, uitvoeringsgerichte versie van het DO, zonder aanvullende ontwerpstappen die tot de DO-fase behoren. Vormt de basis voor prijsvorming in de contractfase.',
    activiteiten: [
      { code: '3.01.01', naam: 'UO-tekening maken', omschrijving: 'Uitvoeringsontwerptekening die de uitvoerende partij volledig ondersteunt bij realisatie van het werk.' },
      { code: '3.01.02', naam: 'WBS opstellen', omschrijving: 'WBS-lijst die het uitvoeringsontwerp opdeelt in WBS-activiteiten (moflocaties, manteltestlocaties, kruisingen) met unieke objectcodering t.b.v. Appee.' },
      { code: '3.01.03', naam: 'Verificatierapport opstellen', omschrijving: 'Aantonen in hoeverre het UO voldoet aan alle gestelde eisen; registratie van verificatiebevindingen in Relatics.' },
      { code: '3.01.04', naam: 'Bemalingsplan opstellen', omschrijving: 'Plan met bemalingsmethode, berekeningen, vergunningseisen, risicomaatregelen en uitvoeringsaanpak; voldoet aan eisen bevoegd gezag/waterschappen.' },
      { code: '3.01.05', naam: 'Opstellen UO-ontwikkelnota', omschrijving: 'Samenbrengen van uitgangspunten, ontwerpuitwerkingen, restpunten, verificaties en uitvoeringsgerichte keuzes; basis voor prijsvorming in de contractfase.' },
      { code: '3.01.06', naam: 'Opstellen UO-begroting', omschrijving: 'Realistische, getoetste en contractueel bruikbare kosteninschatting van de uitvoeringsfase o.b.v. het definitieve UO.' },
      { code: '3.01.07', naam: 'Interne Review UO', omschrijving: 'Intern reviewen van de UO-ontwikkelnota en het reviewresultaat verwerken.' },
      { code: '3.01.08', naam: 'Beoordeling en feedback vanuit OG', omschrijving: 'Beoordeling door OG; opmerkingen verwerken. Afsluitbaar nadat alle opmerkingen behandeld zijn en de UO-ontwikkelnota is goedgekeurd.' },
    ],
  },
  {
    id: '4',
    code: '4.0',
    naam: 'Contractfase (ApD 00)',
    kleur: '#ef4444',
    startMijlpaal: 'eindeUO',
    eindMijlpaal: 'contractGereed',
    omschrijving:
      'Start nadat de opdrachtgever schriftelijk heeft vastgesteld dat de bouwteamdocumenten voldoen. De contractvormingsprocedure leidt tot een ondertekende Afspraken per Deelproject (Bouw).',
    activiteiten: [
      { code: '4.01', naam: 'Vaststellen start contractfase', omschrijving: 'OG stelt schriftelijk vast dat de bouwteamdocumenten (o.a. UO-nota) voldoen aan de eisen. Hierna start de contractvormingsprocedure formeel.' },
      { code: '4.02', naam: 'Overleg contractuele kernonderdelen', omschrijving: 'Vastleggen van uitgangspunten: risicotoedeling, restwerkzaamheden, staartkosten, betaalschema, aansprakelijkheidslimieten en voorwaarden. Risicodossier wordt herijkt en gealloceerd.' },
      { code: '4.03', naam: 'Uitnodiging tot het doen van een aanbieding', omschrijving: 'Aannemer wordt uitgenodigd o.b.v. contractuele uitgangspunten, risicodossier, inschrijfstaat, aannemingsovereenkomst en model Afspraken per Deelproject (Bouw).' },
      { code: '4.04', naam: 'Opstellen en indienen definitieve aanbieding', omschrijving: 'Definitieve aanbieding: vaste aannemingssom, open begroting met onderbouwing, risico’s/beheersmaatregelen, eventuele stelposten. Geldt als onherroepelijk aanbod.' },
      { code: '4.05', naam: 'Beoordeling door Opdrachtgever', omschrijving: 'OG besluit de aanbieding te accepteren óf exclusieve onderhandelingen te starten.' },
      { code: '4.06', naam: 'Onderhandelingen', omschrijving: 'Exclusieve onderhandelingen, beperkt tot aannemingssom/onderbouwing, risicoverdeling/beheersmaatregelen en aansprakelijkheid/schadevergoedingen.' },
      { code: '4.07', naam: 'Acceptatie en schriftelijk overeenkomen', omschrijving: 'Afspraken per Deelproject (Bouw) worden opgesteld en ondertekend; opdracht tot uitvoering wordt formeel verstrekt.' },
      { code: '4.08', naam: 'Escalatiepad bij geen overeenstemming (optioneel)', omschrijving: 'Bij geen overeenstemming kan advies worden ingewonnen bij een deskundigenpanel.' },
    ],
  },
];

// Volgorde van mijlpalen zoals ze in de planning-CSV staan (voor o.a. de tijdlijn).
const MIJLPALEN = [
  { key: 'overdrachtVO',     label: 'Overdracht VO naar aannemer', csv: 'Overdracht VO naar aannemer' },
  { key: 'analyseNaarVO',    label: 'Overgang Analyse → VO',  csv: 'Overgang van Analyse naar VO' },
  { key: 'startConceptDO',   label: 'Start Concept-DO',            csv: 'Start Concept-DO' },
  { key: 'conceptDO',        label: 'Concept DO',                  csv: 'Concept DO' },
  { key: 'onderzoekGereed',  label: 'Onderzoek gereed',            csv: 'Onderzoek gereed' },
  { key: 'doNaarUO',         label: 'DO naar UO',                  csv: 'DO naar UO' },
  { key: 'eindeUO',          label: 'Einde UO',                    csv: 'Einde UO' },
  { key: 'contractGereed',   label: 'Contractfase gereed',         csv: 'Contract fase gereed' },
  { key: 'werkvoorbGereed',  label: 'Werkvoorbereiding gereed',    csv: 'Werkvoorbereidings-fase gereed' },
  { key: 'uitvoeringGereed', label: 'Uitvoering gereed',           csv: 'Uitvoering gereed' },
  { key: 'klantwens',        label: 'Datum klantwens',             csv: 'Datum Klantwens' },
];

// Standaard-doorlooptijden per activiteit (in werkdagen).
// Deels afgeleid uit het document (0.02 = 5 werkdagen, 0.04/0.08 ≈ 2 weken),
// overige als realistische richtwaarde. Per activiteit aan te passen in de app.
const STANDAARD_DOORLOOPTIJD = {
  '0.01': 3,  '0.02': 5,  '0.03': 10, '0.04': 10, '0.05': 5,  '0.06': 5,  '0.07': 10, '0.08': 10,
  '1.01': 10, '1.02.01': 3, '1.02.02': 10, '1.02.03': 20,
  '1.03.01': 10, '1.03.02': 15, '1.03.03': 5, '1.03.04': 5,
  '1.04.01': 5, '1.04.02': 5, '1.04.03': 5, '1.04.04': 5, '1.04.05': 15,
  '2.02.00': 5, '2.01.01': 15, '2.01.02': 10, '2.01.03': 30, '2.01.04': 10,
  '2.02.01': 10, '2.02.02': 10, '2.02.03': 5, '2.02.04': 20, '2.02.05': 15,
  '2.03.01': 10, '2.03.02': 30, '2.03.03': 15, '2.03.04': 15, '2.03.05': 20,
  '2.04.01': 5, '2.04.02': 10, '2.04.03': 10, '2.04.04': 5, '2.05.01': 10,
  '2.06.01': 20, '2.06.02': 10, '2.06.03': 10, '2.06.04': 10, '2.06.05': 10, '2.06.07': 10, '2.06.06': 10, '2.06.08': 15,
  '3.01.01': 15, '3.01.02': 10, '3.01.03': 10, '3.01.04': 10, '3.01.05': 10, '3.01.06': 10, '3.01.07': 5, '3.01.08': 15,
  '4.01': 3, '4.02': 10, '4.03': 5, '4.04': 15, '4.05': 10, '4.06': 10, '4.07': 5, '4.08': 5,
};
FASES.forEach((f) => f.activiteiten.forEach((a) => { a.dtDefault = STANDAARD_DOORLOOPTIJD[a.code] ?? 5; }));

// Snelle index: activiteitcode -> { fase, activiteit }
const ACTIVITEIT_INDEX = (() => {
  const idx = {};
  FASES.forEach((f) => f.activiteiten.forEach((a) => { idx[a.code] = { fase: f, activiteit: a }; }));
  return idx;
})();

if (typeof window !== 'undefined') {
  window.FASES = FASES;
  window.MIJLPALEN = MIJLPALEN;
  window.ACTIVITEIT_INDEX = ACTIVITEIT_INDEX;
  window.STANDAARD_DOORLOOPTIJD = STANDAARD_DOORLOOPTIJD;
}
