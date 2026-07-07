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
      { code: '0.05', naam: 'Acceptatie IV/TOF', omschrijving: 'Formeel accepteren van de IV- en TOF-documenten door ondertekening van een ApD-bouwteamdocument. Pas daarna start het project en kan de VO-fase ingeleid worden.' },
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

// Op te leveren producten per activiteit — de standaardteksten. In de app
// (Activiteitenbibliotheek) per activiteit aan te passen; overrides staan in
// State.activiteitInfo en worden met de rest van de staat bewaard.
const OPLEVERINGEN = {
  '0.01': ['Ontvangstregistratie van IV en TOF in VISI'],
  '0.02': ['Ingevuld intakeformulier (binnen 5 werkdagen)', 'Terugmelding aan OG bij ontbrekende stukken'],
  '0.03': ['Beoordelingsnotitie TOF met bevindingen', 'Overzicht van risico’s, afwijkingen en restpunten'],
  '0.04': ['Vragenlijst t.b.v. het overdrachtsoverleg', 'Verslag/actielijst van de warme overdracht'],
  '0.05': ['Ondertekend ApD-bouwteamdocument (acceptatie IV/TOF)'],
  '0.06': ['Ingerichte projectomgeving in Relatics, Clockwise, M-files en ACC', 'Toegang en rechten voor het projectteam'],
  '0.07': ['Startnota met uitgangspunten, scope, planning, werkpakketten en organisatie'],
  '0.08': ['Startnota aangeboden via VISI', 'Door Liander goedgekeurde startnota'],
  '1.01': ['DWG-tekening met het tracé uit het schetsontwerp'],
  '1.02.01': ['Verstuurde DWG + PDF met werkpakketverdeling t.b.v. de offerteaanvraag'],
  '1.02.02': ['Overeengekomen offerte bureaustudies (o.b.v. menulijst)', 'Opdrachtverstrekking / startafspraak studies'],
  '1.02.03': ['Ontvangen rapportages: archeologie, ecologie, OON/NGE, aerius, milieu en hydrologie', 'Resultaten verwerkt in het VO'],
  '1.03.01': ['Ingevulde CROW 500-toets', 'Overzicht van risicovolle graaflocaties'],
  '1.03.02': ['Schriftelijk akkoord van de betrokken netbeheerders op het ontwerptracé'],
  '1.03.03': ['Inmeetgegevens (ligging/diepte) van de relevante duikers'],
  '1.03.04': ['Onderbouwde lijst met proefsleuflocaties'],
  '1.04.01': ['Verificatieplan in Relatics: welke eisen, hoe, door wie en in welk werkpakket'],
  '1.04.02': ['Onderbouwde boorlocaties voor sleufloze technieken'],
  '1.04.03': ['Kabeltrekplan met route, haspel- en lierinzet en moflocaties'],
  '1.04.04': ['Stakeholderoverzicht van het tracé o.b.v. kadastergegevens'],
  '1.04.05': ['Voorlopig ontwerp (VO) met verwerkte bureaustudieresultaten'],
  '2.02.00': ['Planningsafspraken met rentmeesters voor het ZRO-traject'],
  '2.01.01': ['Gespreksverslagen van de kennismakingsgesprekken', 'Beeld van de medewerkingsbereidheid per perceel'],
  '2.01.02': ['ZRO-tekening (notarieel, definitieve ligging)', 'Werkstrooktekening (schadeafhandeling/uitvoering)'],
  '2.01.03': ['Afspraken over onderzoeken en schadevergoedingen', 'Overeenstemming (concept) per grondeigenaar'],
  '2.01.04': ['Ondertekende ZRO en werkstrookovereenkomst per perceel'],
  '2.02.01': ['Verslagen van de kennismakingen met bevoegd gezagen', 'Overzicht van beleidskaders en vereisten'],
  '2.02.02': ['Vergunningenanalyse', 'Actueel vergunningenregister (vergunningen, meldingen, toestemmingen)'],
  '2.02.03': ['Verslag van de schouw met bevoegd gezag, incl. gemaakte afspraken'],
  '2.02.04': ['Ingediende aanvraag omgevingsvergunning via het WOW-portaal (incl. AVOI)'],
  '2.02.05': ['Ingediende aanvraag kabel- en leidingvergunningen (AVOI)'],
  '2.03.01': ['Overeengekomen offerte conditionerende onderzoeken'],
  '2.03.02': ['Uitgezette veldonderzoeken (archeologie, ecologie, aerius, hydrologie, OOO)', 'Onderzoeksrapportages'],
  '2.03.03': ['Beïnvloedingsberekening (via DEP of HVE)'],
  '2.03.04': ['Belastbaarheidsberekening (via DEP)'],
  '2.03.05': ['Rapportages van de vervolgonderzoeken bij hotspots/afwijkingen'],
  '2.04.01': ['Verslag van de maakbaarheidsschouw met het realisatieteam', 'Schouwpunten verwerkt in het DO'],
  '2.04.02': ['Volledig uitgewerkte boorgegevens t.b.v. het boorplan'],
  '2.04.03': ['Proefsleufmelding bij bevoegd gezag', 'Proefsleufresultaten: exacte ligging van K&L'],
  '2.04.04': ['Ontwerp met verwerkte proefsleufresultaten'],
  '2.05.01': ['Formele toestemming van de OIV’er (beoordeling o.b.v. S-bladen)'],
  '2.06.01': ['Complete set DO-tekeningen (maakbaar en afgestemd)'],
  '2.06.02': ['Risicodossier met kans, impact en beheersmaatregelen'],
  '2.06.03': ['Verificatierapport DO (bevindingen geregistreerd in Relatics)'],
  '2.06.04': ['DO-raming incl. uitvoering, omgeving, boringen en risico-opslag'],
  '2.06.05': ['Verkeersplannen / TVM-plannen'],
  '2.06.07': ['DO-ontwikkelnota met resultaten, risico’s, onderbouwingen en ontwerpkeuzes'],
  '2.06.06': ['Verwerkt intern reviewcommentaar', 'Bij de OG ingediende DO-ontwikkelnota'],
  '2.06.08': ['Verwerkte opmerkingen van de OG', 'Goedgekeurde DO-ontwikkelnota'],
  '3.01.01': ['UO-tekening(en) die de uitvoerende partij volledig ondersteunen'],
  '3.01.02': ['WBS-lijst met unieke objectcodering t.b.v. Appee'],
  '3.01.03': ['Verificatierapport UO (bevindingen geregistreerd in Relatics)'],
  '3.01.04': ['Bemalingsplan incl. berekeningen, vergunningseisen en risicomaatregelen'],
  '3.01.05': ['UO-ontwikkelnota (basis voor prijsvorming in de contractfase)'],
  '3.01.06': ['UO-begroting: realistisch, getoetst en contractueel bruikbaar'],
  '3.01.07': ['Verwerkt intern reviewcommentaar op de UO-ontwikkelnota'],
  '3.01.08': ['Verwerkte opmerkingen van de OG', 'Goedgekeurde UO-ontwikkelnota'],
  '4.01': ['Schriftelijke vaststelling van de OG dat de bouwteamdocumenten voldoen'],
  '4.02': ['Vastgelegde contractuele uitgangspunten (risico’s, betaalschema, voorwaarden)', 'Herijkt en gealloceerd risicodossier'],
  '4.03': ['Uitnodiging tot aanbieding incl. inschrijfstaat, aannemingsovereenkomst en model ApD (Bouw)'],
  '4.04': ['Definitieve aanbieding: vaste aannemingssom, open begroting en risico’s/beheersmaatregelen'],
  '4.05': ['Besluit van de OG: acceptatie of start exclusieve onderhandelingen'],
  '4.06': ['Onderhandelingsresultaat over aannemingssom, risicoverdeling en aansprakelijkheid'],
  '4.07': ['Ondertekende Afspraken per Deelproject (Bouw)', 'Formele opdracht tot uitvoering'],
  '4.08': ['Advies van het deskundigenpanel (indien ingeschakeld)'],
};

// Praktische tip/aanpak per activiteit (optioneel, ook aanpasbaar in de app).
const TIPS = {
  '0.01': 'Leg de ontvangstdatum vast: de termijn van 5 werkdagen voor de compleetheidscheck (0.02) start hier.',
  '0.02': 'Gebruik het intakeformulier als checklist en meld ontbrekende stukken direct via VISI, zodat de termijn niet verloopt.',
  '0.03': 'Noteer elk restpunt expliciet — deze komen terug in de warme overdracht en de startnota.',
  '0.04': 'Plan het overleg ca. 2 weken na ontvangst en deel de vragen vooraf met Liander.',
  '0.05': 'Borg dat openstaande restpunten als voorwaarde in het acceptatiedocument staan; pas na ondertekening start het project formeel.',
  '0.07': 'De startnota is het plan van aanpak voor de VO-fase; verwerk de restpunten uit de TOF-beoordeling.',
  '0.08': 'Houd rekening met de beoordelingstermijn van 2 weken bij Liander in de planning.',
  '1.02.02': 'De menulijst bepaalt de scope van de offerte; stem vooraf af welke studies voor dit gebied nodig zijn.',
  '1.02.03': 'Controleer bij ontvangst of alle bestelde studies compleet zijn; hotspots betekenen mogelijk vervolgonderzoek in de DO-fase (2.03.05).',
  '1.03.02': 'Begin vroeg: doorlooptijden bij netbeheerders (Gasunie, Defensie, RWS, Vitens) zijn lang en liggen buiten je invloed.',
  '1.03.04': 'Combineer CROW 500-risicolocaties, duikers en KLIC-data om het aantal proefsleuven te beperken.',
  '1.04.01': 'Gebruik de eisenverificatiedatabase in Relatics als vertrekpunt; wijs elke eis aan een werkpakket toe.',
  '2.02.00': 'Haak rentmeesters zo vroeg mogelijk aan: het ZRO-traject is vaak kritiek voor de doorlooptijd van de DO-fase.',
  '2.01.01': 'Voer eerste gesprekken altijd met 2 medewerkers (veiligheid) en leg de bereidheid per perceel direct vast.',
  '2.01.03': 'Het aantal gesprekken is niet te voorspellen; signaleer stagnatie vroeg bij de omgevingsmanager.',
  '2.02.02': 'Houd het vergunningenregister in de app actueel (tabblad Vergunningen) — dat voedt de signalen op besluitdata.',
  '2.02.04': 'Dien tijdig en volledig in via het WOW-portaal; een onvolledige aanvraag kost een volledige nieuwe beoordelingstermijn.',
  '2.02.05': 'Wordt doorgaans pas in de UO-fase aangevraagd, zodra het tracé exact bekend is.',
  '2.03.02': 'De locatie van tracé en boringen bepaalt de onderzoeksscope; wijzigt het tracé, check dan of onderzoeken opnieuw moeten.',
  '2.03.03': 'Wettelijk verplicht boven 1 kV bij stalen gasleidingen in de buurt; zet de berekening uit via DEP of HVE.',
  '2.04.03': 'Vergeet de proefsleufmelding bij het bevoegd gezag niet vóór het graven.',
  '2.05.01': 'Bereid de S-bladen volledig voor; de OIV’er beoordeelt op veiligheid, betrouwbaarheid en beheerbaarheid.',
  '2.06.02': 'Houd het dossier actueel van VO naar DO; in de contractfase (4.02) wordt het herijkt en gealloceerd.',
  '2.06.07': 'De ontwikkelnota bundelt alle DO-producten; start het schrijven parallel aan de laatste onderzoeken.',
  '3.01.02': 'Deel het UO op in WBS-activiteiten (moflocaties, manteltestlocaties, kruisingen) met unieke objectcodering.',
  '3.01.05': 'De UO-nota is de basis voor prijsvorming: wees expliciet over restpunten en uitvoeringsgerichte keuzes.',
  '4.02': 'Leg risicotoedeling, staartkosten, betaalschema en aansprakelijkheidslimieten vast vóór de uitnodiging tot aanbieding.',
  '4.04': 'De aanbieding geldt als onherroepelijk aanbod; controleer de open begroting en stelposten zorgvuldig.',
  '4.06': 'Onderhandelingen zijn beperkt tot aannemingssom/onderbouwing, risicoverdeling en aansprakelijkheid.',
};

FASES.forEach((f) => f.activiteiten.forEach((a) => {
  a.oplevering = OPLEVERINGEN[a.code] || [];
  a.tip = TIPS[a.code] || '';
}));

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
