# HVP Procesturing — Bouwteamfase Nulelie

Webapplicatie om het bouwteamproces van Nulelie te **besturen**: de fasen en
activiteiten uit het procesdocument, gekoppeld aan de planning (werkpakketten en
mijlpalen) uit het engineeringsdashboard. Met een takenvooruitblik op basis van
doorlooptijden, een uitgebreid KPI-dashboard en AI-gegenereerde maand- en
kwartaalrapportages.

## Hiërarchie

De applicatie is opgebouwd rond de hiërarchie **Project ▸ APD ▸ Werkpakket**.
Onder *Overzicht* navigeer je via een kruimelpad door deze niveaus:
projecten → APD's binnen een project → werkpakketten binnen een APD.

## Wat het doet

- **Overzicht** — hiërarchische browser (Project ▸ APD ▸ Werkpakket) met KPI's en
  faseverdeling per niveau, en een activiteiten-checklist per werkpakket.
- **Planning** — een tijdlijn (Gantt) per werkpakket met gekleurde fasen en een
  "vandaag"-lijn op de peildatum.
- **Taken** — alles wat de **komende periode** moet gebeuren, berekend uit de
  fasevensters en doorlooptijden. **Kritieke** taken en taken die **gevaar lopen**
  staan bovenaan. De vooruitkijk-**horizon is instelbaar** (2 weken t/m kwartaal).
- **Dashboard** — uitgebreide stuur- en KPI-informatie, te bekijken over het
  **hele portfolio** of **per project**: voortgang, statusverdeling, risico's,
  faseverdeling, naderende mijlpalen, bezetting per engineer en per APD.
- **Rapporten** — genereer een **maand-** of **kwartaalrapportage** met een
  terugblik op de afgelopen periode én een vooruitblik op wat er nog moet
  gebeuren. De cijfers worden in de app berekend; de **Anthropic-API** schrijft
  het verhaal (streaming, in het Nederlands).
- **TSB** — kostenbegrotingen, gewerkte uren en gemaakte kosten per project
  (overgenomen uit de losse HVP-TSB-app):
  - *Formats*: herbruikbare basis met rollen + uurtarieven en de structuur
    fasen ▸ groepen ▸ regelitems (inzet in uren per eenheid). Een
    standaardformat (VO/DO/UO) is met één klik aan te maken.
  - *Begrotingen*: per project een TSB op basis van een format. Vul de
    hoeveelheden (Hv) en eventueel afwijkende inzet in; duur, bedragen en de
    prijs per eenheid worden berekend (duur = inzet × hoeveelheid, bedrag =
    duur × tarief), met subtotalen per fase en een eindtotaal. Export naar CSV
    (opent in Excel).
  - *Uren & kosten*: boek gewerkte uren per maand en rol (ook via CSV-import:
    `project;periode;rol;uren;omschrijving`) en overige gemaakte kosten.
  - *Sturing*: begroot versus besteed (uren én euro's) per project, per rol en
    per maand — met een periode-filter (cumulatief t/m een maand). De
    bestedingsgraad staat ook als kaart op het Dashboard en de cijfers gaan mee
    in de AI-rapportages.
- **Wijzigingen** — wijzigingenregister op de TSB-posten (begroting, uren &
  kosten) per werkpakket: indiener, datum, korte omschrijving, toelichting en
  financiële impact, met statusflow *nieuw → ingediend → goedgekeurd/afgekeurd*
  (afkeuren vereist een toelichting). Geselecteerde wijzigingen bundel je in een
  **VTW** (Verzoek Tot Wijziging): de AI stelt de complete notitie op volgens
  het VTW-format uit **Beheer → Instellingen** (of, zonder format, een eigen
  professioneel standaardformat) en gebruikt daarbij de wijzigingen plus de
  beschikbare projectinformatie. VTW's worden bewaard in een register en zijn
  te downloaden als HTML.
- **Mijn projecten** — alleen de werkpakketten waaraan jij bent toegewezen, met
  je eigen taken voor de komende periode.
- **Activiteiten / Doorlooptijden** — referentiebibliotheek met per stap een
  omschrijving, de **op te leveren producten** en een praktische tip (ook
  zichtbaar in de werkpakket-checklist en de takenlijst), plus instelbare
  doorlooptijden (werkdagen) per activiteit. Ontwerpleider/manager kan de
  stapteksten in de bibliotheek aanpassen; de aanpassingen gelden voor iedereen.
- **Toewijzen** (ontwerpleider/manager) — gebruikers per werkpakket koppelen.
- **Accounts** (ontwerpleider/manager) — rollen toekennen aan gebruikers.
- **Beheer** — CSV-import, JSON-export/herstel, instellingen (peildatum, AI-model)
  en momentopnames voor trends.

## Login & rechten

Authenticatie verloopt via **Clerk** (login, registratie, profiel/wachtwoord).
**Rollen en toewijzingen** staan in de eigen database: Clerk bepaalt *wie* je
bent, de app bepaalt *wat* je mag. De handhaving gebeurt in de UI.

Rollen: **engineer, omgevingsmanager, projectleider, ontwerpleider, manager**.

- **Ontwerpleider** en **manager** mogen alles bewerken, werkpakketten toewijzen
  en accounts/rollen beheren. Ook TSB-formats, begrotingen en kosten zijn aan
  deze rollen voorbehouden; **uren boeken** mag daarnaast door iedereen die aan
  een werkpakket van het betreffende project is toegewezen.
- **Engineer, omgevingsmanager, projectleider** zien álle projecten in de
  tabbladen, maar bewerken alleen de **voortgang van hun toegewezen
  werkpakketten** (de rest is alleen-lezen).
- Toewijzen gebeurt **per werkpakket**; "Mijn projecten" toont automatisch de
  bijbehorende projecten.

De **eerste gebruiker** die inlogt wordt automatisch **manager** (zodat er altijd
iemand kan toewijzen en rollen kan beheren). Extra automatische managers kun je
opgeven via `window.HVP_ADMIN_EMAILS` in `js/config.js`. Nieuwe gebruikers
verschijnen in **Accounts** zodra ze voor het eerst inloggen; standaardrol
*engineer*.

> Zonder `CLERK_PUBLISHABLE_KEY` draait de app in **devmodus**: geen login,
> volledige rechten — handig tijdens lokaal ontwikkelen voordat Clerk is
> ingesteld.

## Architectuur

- **Frontend**: pure HTML/CSS/JS (geen build-stap).
- **Hosting**: Vercel. De serverless functies in `api/` houden de secrets
  server-side via **environment variables**.
  - `api/state.js` — leest/schrijft de volledige staat in **Neon** (Postgres).
  - `api/rapport.js` — genereert rapportages via de **Anthropic-API** (streaming).
  - `api/config.js` — geeft de publieke **Clerk Publishable Key** aan de browser.
  - `api/status.js` — meldt of de env-variabelen zijn ingesteld.
- **Auth**: `js/auth.js` (Clerk-login + rolbepaling) en `js/rechten.js`
  (Mijn projecten, Toewijzen, Accounts). Rollen/toewijzingen worden met de
  overige staat in Neon bewaard.
- **Opslag**: een Neon-database is de bron; **localStorage** dient als offline
  cache, zodat de app blijft werken zonder verbinding en bij herverbinding
  synchroniseert. De verbindingsstatus staat rechtsboven in de balk.

## Deployen op Vercel

1. Maak een **Neon**-database aan en kopieer de *pooled* connectionstring.
2. Maak een **Anthropic**-API-sleutel aan.
3. Importeer dit project in Vercel en zet onder **Settings → Environment
   Variables**:
   - `DATABASE_URL` = de Neon-connectionstring
   - `ANTHROPIC_API_KEY` = de Anthropic-sleutel
   - `CLERK_PUBLISHABLE_KEY` = de Clerk Publishable Key (voor login)
4. Maak een **Clerk**-applicatie (https://dashboard.clerk.com), kies de
   inlogmethoden en kopieer de **Publishable Key** naar de env-variabele
   hierboven. Voeg je productie-URL toe als toegestane origin in Clerk.
5. Deploy. De tabel `hvp_kv` wordt bij het eerste gebruik automatisch aangemaakt
   (zie ook `db/schema.sql`).

Lokaal draaien met de volledige stack (inclusief database en AI):

```bash
npm install
vercel dev    # vraagt om de env-variabelen of leest ze uit .env
```

> Zonder Vercel/Neon kun je de app ook puur statisch openen (bijv. via
> `./start.sh` of `python3 -m http.server`). De app werkt dan op de
> localStorage-cache; de database- en AI-functies zijn dan niet beschikbaar
> (de status toont "Lokaal").

## Data

- De app start met **voorbeelddata** (Spannenburg, Joure, Wolvega, Luinjeberd).
- Volledige set importeren: **Beheer → Kies CSV-bestand** (het HVP-dashboard,
  `;`-gescheiden). De importer herkent de kolomkoppen (incl. *APD Bouwdeel*)
  automatisch en negeert lege/sjabloonrijen.
- Voortgang (statussen + notities), doorlooptijden, instellingen en momentopnames
  worden lokaal én in Neon bewaard.

## Aanpassen

- Fasen/activiteiten en beschrijvingen: `js/activiteiten.js` (standaardteksten,
  incl. op te leveren producten en tips); per activiteit aan te passen in de app
  via **Activiteiten → ✎ Bewerken** (ontwerpleider/manager)
- Koppeling fase ↔ planning-mijlpaal: `startMijlpaal`/`eindMijlpaal` per fase
- Peildatum ("vandaag"): instelbaar onder **Beheer → Instellingen**
- AI-model voor rapportages: idem (standaard Claude Sonnet 5; Opus 4.8 als kwaliteitsoptie)
- Voorbeelddata: `js/seed.js`
