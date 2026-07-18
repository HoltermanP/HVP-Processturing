---
name: verify
description: Hoe je deze app lokaal draait en visueel verifieert (statische SPA + dev-server).
---

# NuLelie Procesturing lokaal draaien en verifiëren

- Start: `node dev-server.mjs <poort>` (kies een vrije poort; 3000 en 3111 zijn hier vaak bezet door andere apps — check met `curl` dat je écht deze app krijgt, titel "NuLelie Procesturing").
- Zonder `CLERK_PUBLISHABLE_KEY` draait de app in devmodus (geen login, rol Manager) — ideaal voor verificatie.
- Zonder `npm install` in de projectroot geven `/api/config` en `/api/state` 404/500; de app valt dan terug op localStorage + seed-data. Dat is normaal en geen regressie.
- Browser-verificatie: installeer `playwright-core` in de scratchpad-map en launch met `chromium.launch({ channel: 'chrome' })` (gebruikt de geïnstalleerde Google Chrome, geen browserdownload nodig).
- Nuttige aanknopingspunten in de UI: globale state in `window.State` (o.a. `State.filters`), `render()` hertekent alles; tabs via `.tab[data-tab=...]`, filterchips in `#filterIndicator`, KPI-tegels in `#kpis .kpi[data-actie]`, engineertegels in `#engineerTegels .ftegel`.
