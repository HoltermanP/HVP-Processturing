# HVP Procesturing — Bouwteamfase Nulelie

Webapplicatie om het bouwteamproces van Nulelie te **besturen**: de fasen en
activiteiten uit het procesdocument gekoppeld aan de planning (werkpakketten en
mijlpalen) uit het engineeringsdashboard.

## Wat het doet

- **Overzicht** — KPI's, faseverdeling en een filterbare tabel van alle
  werkpakketten met de huidige fase (afgeleid van de planning) en de
  voortgang van de activiteiten.
- **Planning** — een tijdlijn (Gantt) per werkpakket, met de fasen gekleurd en
  een "vandaag"-lijn op de peildatum.
- **Werkpakket-detail** — klik op een rij of balk: mijlpaaltijdlijn +
  activiteiten-checklist per fase. Per activiteit een status
  (Niet gestart / Bezig / Gereed / Geblokkeerd / N.v.t.) en een notitie.
- **Activiteiten** — referentiebibliotheek met alle fasen en
  activiteitbeschrijvingen uit *Werkpakketactiviteiten beschrijvingen Nulelie 2.0*.
- **Import / Export** — importeer het volledige planning-CSV en bewaar/herstel
  het werkbestand (voortgang) als JSON.

## Starten

Open `index.html` rechtstreeks in de browser, of start een lokale server
(aanbevolen, zodat opslag/import altijd werken):

```bash
./start.sh           # http://localhost:8080
# of
python3 -m http.server 8080
```

## Data

- De app start met **voorbeelddata** (Spannenburg + Joure, uit de meegeleverde CSV).
- Voor de volledige set (incl. Wolvega, Luinjeberd): ga naar **Import / Export**
  → *Kies CSV-bestand* en selecteer het HVP-dashboard (`;`-gescheiden).
  De importer herkent de kolomkoppen automatisch en negeert lege/sjabloonrijen.
- Voortgang (statussen + notities) wordt automatisch in de browser bewaard
  (`localStorage`). Exporteer regelmatig een JSON-back-up om te delen of veilig te stellen.

## Aanpassen

- Fasen/activiteiten en hun beschrijvingen: `js/activiteiten.js`
- Koppeling fase ↔ planning-mijlpaal: veld `startMijlpaal`/`eindMijlpaal` per fase
- Peildatum ("vandaag"): constante `VANDAAG` in `js/app.js`
- Voorbeelddata: `js/seed.js`

Geen build-stap of dependencies — pure HTML/CSS/JS.
