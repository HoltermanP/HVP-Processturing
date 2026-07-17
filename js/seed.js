'use strict';
/* ==========================================================================
   Seed-data — gegenereerd uit "Dashboard HVP(Overall-Planning).csv"
   (engineeringsplanning, stand juli 2026). Bevat de werkpakketten van
   Spannenburg, Joure, Wolvega en Luinjeberd, plus de activiteitstatussen
   (1=gereed, 2=lopend, 3=vertraagd, 4=issue, 5=n.v.t., 6=restpunt).
   Activiteiten zonder kolom in de CSV staan op n.v.t. zodat ze de
   fase-gereedmelding niet blokkeren.
   Niet met de hand bewerken: opnieuw genereren via Beheer → CSV-import.
   ========================================================================== */
window.SEED_WERKPAKKETTEN = [
 {
  "id": "Spannenburg|WP1|RS Tjerkgaast|DR01",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "Oost",
  "wp": "WP1",
  "tracStart": "RS Tjerkgaast",
  "tracEind": "DR01",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 0,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "5-2-2026",
   "onderzoekGereed": "28-5-2026",
   "doNaarUO": "9-7-2026",
   "eindeUO": "20-8-2026",
   "contractGereed": "15-10-2026",
   "werkvoorbGereed": "10-12-2026",
   "uitvoeringGereed": "10-12-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Spannenburg|WP2|DR01|DR02",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "Oost",
  "wp": "WP2",
  "tracStart": "DR01",
  "tracEind": "DR02",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 2400,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "19-2-2026",
   "onderzoekGereed": "11-6-2026",
   "doNaarUO": "23-7-2026",
   "eindeUO": "3-9-2026",
   "contractGereed": "29-10-2026",
   "werkvoorbGereed": "24-12-2026",
   "uitvoeringGereed": "14-1-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Spannenburg|WP3|DR02|DR03",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "Oost",
  "wp": "WP3",
  "tracStart": "DR02",
  "tracEind": "DR03",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 1300,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "5-3-2026",
   "onderzoekGereed": "25-6-2026",
   "doNaarUO": "6-8-2026",
   "eindeUO": "17-9-2026",
   "contractGereed": "12-11-2026",
   "werkvoorbGereed": "7-1-2027",
   "uitvoeringGereed": "21-1-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Spannenburg|WP4|DR03|DR04",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "Oost",
  "wp": "WP4",
  "tracStart": "DR03",
  "tracEind": "DR04",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 1950,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "19-3-2026",
   "onderzoekGereed": "9-7-2026",
   "doNaarUO": "20-8-2026",
   "eindeUO": "1-10-2026",
   "contractGereed": "26-11-2026",
   "werkvoorbGereed": "21-1-2027",
   "uitvoeringGereed": "4-2-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Spannenburg|WP5|DR04|DR05",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "Oost",
  "wp": "WP5",
  "tracStart": "DR04",
  "tracEind": "DR05",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 2800,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "2-4-2026",
   "onderzoekGereed": "23-7-2026",
   "doNaarUO": "3-9-2026",
   "eindeUO": "15-10-2026",
   "contractGereed": "10-12-2026",
   "werkvoorbGereed": "4-2-2027",
   "uitvoeringGereed": "25-2-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Spannenburg|WP6|DR05|DR06",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "Oost",
  "wp": "WP6",
  "tracStart": "DR05",
  "tracEind": "DR06",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 2025,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "16-4-2026",
   "onderzoekGereed": "6-8-2026",
   "doNaarUO": "17-9-2026",
   "eindeUO": "29-10-2026",
   "contractGereed": "24-12-2026",
   "werkvoorbGereed": "18-2-2027",
   "uitvoeringGereed": "11-3-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Spannenburg|WP7|DR06|DR07",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "Oost",
  "wp": "WP7",
  "tracStart": "DR06",
  "tracEind": "DR07",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 7100,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "30-4-2026",
   "onderzoekGereed": "20-8-2026",
   "doNaarUO": "1-10-2026",
   "eindeUO": "12-11-2026",
   "contractGereed": "7-1-2027",
   "werkvoorbGereed": "4-3-2027",
   "uitvoeringGereed": "29-4-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Spannenburg|WP8|DR07|DR08",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "Oost",
  "wp": "WP8",
  "tracStart": "DR07",
  "tracEind": "DR08",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 2600,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "14-5-2026",
   "onderzoekGereed": "3-9-2026",
   "doNaarUO": "15-10-2026",
   "eindeUO": "26-11-2026",
   "contractGereed": "21-1-2027",
   "werkvoorbGereed": "18-3-2027",
   "uitvoeringGereed": "8-4-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Spannenburg|WP9|DR08|DR09",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "West",
  "wp": "WP9",
  "tracStart": "DR08",
  "tracEind": "DR09",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 1650,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "28-5-2026",
   "onderzoekGereed": "17-9-2026",
   "doNaarUO": "29-10-2026",
   "eindeUO": "10-12-2026",
   "contractGereed": "4-2-2027",
   "werkvoorbGereed": "1-4-2027",
   "uitvoeringGereed": "15-4-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Spannenburg|WP10|DR09|DR10",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "West",
  "wp": "WP10",
  "tracStart": "DR09",
  "tracEind": "DR10",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 2900,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "11-6-2026",
   "onderzoekGereed": "1-10-2026",
   "doNaarUO": "12-11-2026",
   "eindeUO": "24-12-2026",
   "contractGereed": "18-2-2027",
   "werkvoorbGereed": "15-4-2027",
   "uitvoeringGereed": "6-5-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Spannenburg|WP11|DR10|DR11",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "West",
  "wp": "WP11",
  "tracStart": "DR10",
  "tracEind": "DR11",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 6900,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "25-6-2026",
   "onderzoekGereed": "15-10-2026",
   "doNaarUO": "26-11-2026",
   "eindeUO": "7-1-2027",
   "contractGereed": "4-3-2027",
   "werkvoorbGereed": "29-4-2027",
   "uitvoeringGereed": "17-6-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Spannenburg|WP12|DR11|DR12",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "West",
  "wp": "WP12",
  "tracStart": "DR11",
  "tracEind": "DR12",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 5850,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "9-7-2026",
   "onderzoekGereed": "29-10-2026",
   "doNaarUO": "10-12-2026",
   "eindeUO": "21-1-2027",
   "contractGereed": "18-3-2027",
   "werkvoorbGereed": "13-5-2027",
   "uitvoeringGereed": "24-6-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Spannenburg|WP13|DR12|RS Tjerkgaast",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "West",
  "wp": "WP13",
  "tracStart": "DR12",
  "tracEind": "RS Tjerkgaast",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 100,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "23-7-2026",
   "onderzoekGereed": "12-11-2026",
   "doNaarUO": "24-12-2026",
   "eindeUO": "4-2-2027",
   "contractGereed": "1-4-2027",
   "werkvoorbGereed": "27-5-2027",
   "uitvoeringGereed": "3-6-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Spannenburg|WP14|RS Tjerkgaast|DR08",
  "project": "Spannenburg",
  "apd": "Spannenburg",
  "tracdeel": "Verbinding",
  "wp": "WP14",
  "tracStart": "RS Tjerkgaast",
  "tracEind": "DR08",
  "engineer": "Peter Teeninga",
  "lengteNieuw": 6000,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "23-10-2025",
   "analyseNaarVO": "20-11-2025",
   "startConceptDO": "25-12-2025",
   "conceptDO": "6-8-2026",
   "onderzoekGereed": "26-11-2026",
   "doNaarUO": "7-1-2027",
   "eindeUO": "18-2-2027",
   "contractGereed": "15-4-2027",
   "werkvoorbGereed": "10-6-2027",
   "uitvoeringGereed": "22-7-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP1|RS Jou|DR06",
  "project": "Joure",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP1",
  "tracStart": "RS Jou",
  "tracEind": "DR06",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 1100,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "14-7-2026",
   "onderzoekGereed": "3-11-2026",
   "doNaarUO": "15-12-2026",
   "eindeUO": "26-1-2027",
   "contractGereed": "23-3-2027",
   "werkvoorbGereed": "18-5-2027",
   "uitvoeringGereed": "15-6-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP2|DR06|DR04",
  "project": "Joure",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP2",
  "tracStart": "DR06",
  "tracEind": "DR04",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 1200,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "19-5-2026",
   "onderzoekGereed": "8-9-2026",
   "doNaarUO": "20-10-2026",
   "eindeUO": "1-12-2026",
   "contractGereed": "26-1-2027",
   "werkvoorbGereed": "23-3-2027",
   "uitvoeringGereed": "20-4-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP3|DR04|DR05",
  "project": "Joure",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP3",
  "tracStart": "DR04",
  "tracEind": "DR05",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 920,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "30-6-2026",
   "onderzoekGereed": "20-10-2026",
   "doNaarUO": "1-12-2026",
   "eindeUO": "12-1-2027",
   "contractGereed": "9-3-2027",
   "werkvoorbGereed": "4-5-2027",
   "uitvoeringGereed": "1-6-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP4|DR05|DR01",
  "project": "Joure",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP4",
  "tracStart": "DR05",
  "tracEind": "DR01",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 860,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "16-6-2026",
   "onderzoekGereed": "6-10-2026",
   "doNaarUO": "17-11-2026",
   "eindeUO": "29-12-2026",
   "contractGereed": "23-2-2027",
   "werkvoorbGereed": "20-4-2027",
   "uitvoeringGereed": "11-5-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP5|DR01|DR02",
  "project": "Joure",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP5",
  "tracStart": "DR01",
  "tracEind": "DR02",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 1200,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "5-5-2026",
   "onderzoekGereed": "25-8-2026",
   "doNaarUO": "6-10-2026",
   "eindeUO": "17-11-2026",
   "contractGereed": "12-1-2027",
   "werkvoorbGereed": "9-3-2027",
   "uitvoeringGereed": "6-4-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP6|DR02|DR03",
  "project": "Joure",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP6",
  "tracStart": "DR02",
  "tracEind": "DR03",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 1550,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "21-4-2026",
   "onderzoekGereed": "11-8-2026",
   "doNaarUO": "22-9-2026",
   "eindeUO": "3-11-2026",
   "contractGereed": "29-12-2026",
   "werkvoorbGereed": "23-2-2027",
   "uitvoeringGereed": "6-4-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP7|DR03|RS Jou",
  "project": "Joure",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP7",
  "tracStart": "DR03",
  "tracEind": "RS Jou",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 1250,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "7-4-2026",
   "onderzoekGereed": "28-7-2026",
   "doNaarUO": "8-9-2026",
   "eindeUO": "20-10-2026",
   "contractGereed": "15-12-2026",
   "werkvoorbGereed": "9-2-2027",
   "uitvoeringGereed": "16-3-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP8|RS Jou|DR08",
  "project": "Joure",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP8",
  "tracStart": "RS Jou",
  "tracEind": "DR08",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 3000,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "24-3-2026",
   "onderzoekGereed": "14-7-2026",
   "doNaarUO": "25-8-2026",
   "eindeUO": "6-10-2026",
   "contractGereed": "1-12-2026",
   "werkvoorbGereed": "26-1-2027",
   "uitvoeringGereed": "6-4-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP9|DR08|DR09",
  "project": "Joure",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP9",
  "tracStart": "DR08",
  "tracEind": "DR09",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 5000,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "10-3-2026",
   "onderzoekGereed": "30-6-2026",
   "doNaarUO": "11-8-2026",
   "eindeUO": "22-9-2026",
   "contractGereed": "17-11-2026",
   "werkvoorbGereed": "12-1-2027",
   "uitvoeringGereed": "11-5-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP10|DR09|DR10",
  "project": "Joure",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP10",
  "tracStart": "DR09",
  "tracEind": "DR10",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 4150,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "24-2-2026",
   "onderzoekGereed": "16-6-2026",
   "doNaarUO": "28-7-2026",
   "eindeUO": "8-9-2026",
   "contractGereed": "3-11-2026",
   "werkvoorbGereed": "29-12-2026",
   "uitvoeringGereed": "6-4-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP11|DR10|DR07",
  "project": "Joure",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP11",
  "tracStart": "DR10",
  "tracEind": "DR07",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 4800,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "13-1-2026",
   "onderzoekGereed": "5-5-2026",
   "doNaarUO": "16-6-2026",
   "eindeUO": "28-7-2026",
   "contractGereed": "22-9-2026",
   "werkvoorbGereed": "17-11-2026",
   "uitvoeringGereed": "9-3-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP12|DR07|DR11",
  "project": "Joure",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP12",
  "tracStart": "DR07",
  "tracEind": "DR11",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 8100,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "27-1-2026",
   "onderzoekGereed": "19-5-2026",
   "doNaarUO": "30-6-2026",
   "eindeUO": "11-8-2026",
   "contractGereed": "6-10-2026",
   "werkvoorbGereed": "1-12-2026",
   "uitvoeringGereed": "8-6-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP13|DR11|DR12",
  "project": "Joure",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP13",
  "tracStart": "DR11",
  "tracEind": "DR12",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 3450,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "10-2-2026",
   "onderzoekGereed": "2-6-2026",
   "doNaarUO": "14-7-2026",
   "eindeUO": "25-8-2026",
   "contractGereed": "20-10-2026",
   "werkvoorbGereed": "15-12-2026",
   "uitvoeringGereed": "9-3-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Joure|WP14|DR12|RS Jou",
  "project": "Joure",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP14",
  "tracStart": "DR12",
  "tracEind": "RS Jou",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 1650,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "30-9-2025",
   "analyseNaarVO": "28-10-2025",
   "startConceptDO": "2-12-2025",
   "conceptDO": "13-1-2026",
   "onderzoekGereed": "5-5-2026",
   "doNaarUO": "16-6-2026",
   "eindeUO": "28-7-2026",
   "contractGereed": "22-9-2026",
   "werkvoorbGereed": "17-11-2026",
   "uitvoeringGereed": "29-12-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP1-w|OSO1 Wolvega (MSR01???)|MSR02 Stadsburen 16",
  "project": "Wolvega",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP1-w",
  "tracStart": "OSO1 Wolvega (MSR01???)",
  "tracEind": "MSR02 Stadsburen 16",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 3952,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "8-7-2025",
   "onderzoekGereed": "28-10-2025",
   "doNaarUO": "9-12-2025",
   "eindeUO": "20-1-2026",
   "contractGereed": "17-3-2026",
   "werkvoorbGereed": "12-5-2026",
   "uitvoeringGereed": "9-6-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP2-w|MSR02 Stadsburen 16|MSR03 Kooiweg bd Schipsloot MSR",
  "project": "Wolvega",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP2-w",
  "tracStart": "MSR02 Stadsburen 16",
  "tracEind": "MSR03 Kooiweg bd Schipsloot MSR",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 2967,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "27-1-2026",
   "onderzoekGereed": "19-5-2026",
   "doNaarUO": "2-6-2026",
   "eindeUO": "14-7-2026",
   "contractGereed": "8-9-2026",
   "werkvoorbGereed": "3-11-2026",
   "uitvoeringGereed": "24-11-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP3-w|MSR03 Kooiweg bd Schipsloot MSR|MSR04 De Weeren 5 iMSR",
  "project": "Wolvega",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP3-w",
  "tracStart": "MSR03 Kooiweg bd Schipsloot MSR",
  "tracEind": "MSR04 De Weeren 5 iMSR",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 3694,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "27-1-2026",
   "onderzoekGereed": "19-5-2026",
   "doNaarUO": "2-6-2026",
   "eindeUO": "14-7-2026",
   "contractGereed": "8-9-2026",
   "werkvoorbGereed": "3-11-2026",
   "uitvoeringGereed": "1-12-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP4-w|MSR04 De Weeren 5 iMSR|MSR05 Hoofdweg 59",
  "project": "Wolvega",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP4-w",
  "tracStart": "MSR04 De Weeren 5 iMSR",
  "tracEind": "MSR05 Hoofdweg 59",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 2574,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "27-1-2026",
   "onderzoekGereed": "19-5-2026",
   "doNaarUO": "2-6-2026",
   "eindeUO": "14-7-2026",
   "contractGereed": "8-9-2026",
   "werkvoorbGereed": "3-11-2026",
   "uitvoeringGereed": "24-11-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP4-w|MSR05 Hoofdweg 59|MSR06 Kerkeweg 4",
  "project": "Wolvega",
  "apd": "",
  "tracdeel": "",
  "wp": "WP4-w",
  "tracStart": "MSR05 Hoofdweg 59",
  "tracEind": "MSR06 Kerkeweg 4",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 426,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "28-10-2025",
   "onderzoekGereed": "17-2-2026",
   "doNaarUO": "31-3-2026",
   "eindeUO": "12-5-2026",
   "contractGereed": "7-7-2026",
   "werkvoorbGereed": "1-9-2026",
   "uitvoeringGereed": "8-9-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP5-w|MSR06 Kerkeweg 4|MSR07 P Stuyvesantweg 109",
  "project": "Wolvega",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP5-w",
  "tracStart": "MSR06 Kerkeweg 4",
  "tracEind": "MSR07 P Stuyvesantweg 109",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 3181,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "27-1-2026",
   "onderzoekGereed": "19-5-2026",
   "doNaarUO": "2-6-2026",
   "eindeUO": "14-7-2026",
   "contractGereed": "8-9-2026",
   "werkvoorbGereed": "3-11-2026",
   "uitvoeringGereed": "1-12-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP6-w|MSR07 P Stuyvesantweg 109|MSR08 De Meenthe bij 21",
  "project": "Wolvega",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP6-w",
  "tracStart": "MSR07 P Stuyvesantweg 109",
  "tracEind": "MSR08 De Meenthe bij 21",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 2511,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "27-1-2026",
   "onderzoekGereed": "19-5-2026",
   "doNaarUO": "2-6-2026",
   "eindeUO": "14-7-2026",
   "contractGereed": "8-9-2026",
   "werkvoorbGereed": "3-11-2026",
   "uitvoeringGereed": "24-11-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP7-w|MSR08 De Meenthe bij 21|MSR09 Nijksweg 38",
  "project": "Wolvega",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP7-w",
  "tracStart": "MSR08 De Meenthe bij 21",
  "tracEind": "MSR09 Nijksweg 38",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 2810,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "27-1-2026",
   "onderzoekGereed": "19-5-2026",
   "doNaarUO": "2-6-2026",
   "eindeUO": "14-7-2026",
   "contractGereed": "8-9-2026",
   "werkvoorbGereed": "3-11-2026",
   "uitvoeringGereed": "24-11-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP8-w|MSR09 Nijksweg 38|Eindmof",
  "project": "Wolvega",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP8-w",
  "tracStart": "MSR09 Nijksweg 38",
  "tracEind": "Eindmof",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 3297,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "27-1-2026",
   "onderzoekGereed": "19-5-2026",
   "doNaarUO": "2-6-2026",
   "eindeUO": "14-7-2026",
   "contractGereed": "8-9-2026",
   "werkvoorbGereed": "3-11-2026",
   "uitvoeringGereed": "1-12-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP9-w|MSR03 Kooiweg bd Schipsloot|MSR12 Heerenveenseweg 177 MSR",
  "project": "Wolvega",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP9-w",
  "tracStart": "MSR03 Kooiweg bd Schipsloot",
  "tracEind": "MSR12 Heerenveenseweg 177 MSR",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 3573,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "16-12-2025",
   "onderzoekGereed": "7-4-2026",
   "doNaarUO": "19-5-2026",
   "eindeUO": "30-6-2026",
   "contractGereed": "25-8-2026",
   "werkvoorbGereed": "20-10-2026",
   "uitvoeringGereed": "17-11-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP10-w|MSR12 Heerenveenseweg 177 MSR|MSR11 Rijksweg A32-1 AC5",
  "project": "Wolvega",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP10-w",
  "tracStart": "MSR12 Heerenveenseweg 177 MSR",
  "tracEind": "MSR11 Rijksweg A32-1 AC5",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 1007,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "27-1-2026",
   "onderzoekGereed": "19-5-2026",
   "doNaarUO": "2-6-2026",
   "eindeUO": "14-7-2026",
   "contractGereed": "8-9-2026",
   "werkvoorbGereed": "3-11-2026",
   "uitvoeringGereed": "17-11-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP11-o|OSO1 Wolvega (MSR01???)|MSR11 Heerenveenseweg 173 MSR",
  "project": "Wolvega",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP11-o",
  "tracStart": "OSO1 Wolvega (MSR01???)",
  "tracEind": "MSR11 Heerenveenseweg 173 MSR",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 4465,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "12-5-2026",
   "onderzoekGereed": "1-9-2026",
   "doNaarUO": "13-10-2026",
   "eindeUO": "24-11-2026",
   "contractGereed": "19-1-2027",
   "werkvoorbGereed": "16-3-2027",
   "uitvoeringGereed": "20-4-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP12-o|MSR11 Heerenveenseweg 173 MSR|MSR13 Ruskemadeweg 7",
  "project": "Wolvega",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP12-o",
  "tracStart": "MSR11 Heerenveenseweg 173 MSR",
  "tracEind": "MSR13 Ruskemadeweg 7",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 4970,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "27-1-2026",
   "onderzoekGereed": "19-5-2026",
   "doNaarUO": "2-6-2026",
   "eindeUO": "14-7-2026",
   "contractGereed": "8-9-2026",
   "werkvoorbGereed": "3-11-2026",
   "uitvoeringGereed": "8-12-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP13-o|MSR13 Ruskemadeweg 7|MSR14 Stellingenweg 52",
  "project": "Wolvega",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP13-o",
  "tracStart": "MSR13 Ruskemadeweg 7",
  "tracEind": "MSR14 Stellingenweg 52",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 5071,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "7-7-2026",
   "onderzoekGereed": "27-10-2026",
   "doNaarUO": "8-12-2026",
   "eindeUO": "19-1-2027",
   "contractGereed": "16-3-2027",
   "werkvoorbGereed": "11-5-2027",
   "uitvoeringGereed": "22-6-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP13-o|MSR14 Stellingenweg 52|MSR55 Grotekamp 5",
  "project": "Wolvega",
  "apd": "",
  "tracdeel": "",
  "wp": "WP13-o",
  "tracStart": "MSR14 Stellingenweg 52",
  "tracEind": "MSR55 Grotekamp 5",
  "engineer": "Frans Hamelijnck",
  "lengteNieuw": 0,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "4-8-2026",
   "onderzoekGereed": "24-11-2026",
   "doNaarUO": "5-1-2027",
   "eindeUO": "16-2-2027",
   "contractGereed": "13-4-2027",
   "werkvoorbGereed": "8-6-2027",
   "uitvoeringGereed": "8-6-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP14-o|MSR16 Steggerdaweg 90|MSR17 Pepergaweg bij 144",
  "project": "Wolvega",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP14-o",
  "tracStart": "MSR16 Steggerdaweg 90",
  "tracEind": "MSR17 Pepergaweg bij 144",
  "engineer": "Dennis Verkoeijen",
  "lengteNieuw": 1885,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "27-1-2026",
   "onderzoekGereed": "19-5-2026",
   "doNaarUO": "2-6-2026",
   "eindeUO": "14-7-2026",
   "contractGereed": "8-9-2026",
   "werkvoorbGereed": "3-11-2026",
   "uitvoeringGereed": "17-11-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP15-o|MSR17 Pepergaweg bij 144|Pepergaweg 11 eindmof",
  "project": "Wolvega",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP15-o",
  "tracStart": "MSR17 Pepergaweg bij 144",
  "tracEind": "Pepergaweg 11 eindmof",
  "engineer": "Dennis Verkoeijen",
  "lengteNieuw": 2145,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "27-1-2026",
   "onderzoekGereed": "19-5-2026",
   "doNaarUO": "2-6-2026",
   "eindeUO": "14-7-2026",
   "contractGereed": "8-9-2026",
   "werkvoorbGereed": "3-11-2026",
   "uitvoeringGereed": "24-11-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP16-c|OSO1 Wolvega (MSR01???)|MSR25 ad Schipsloot 18 to",
  "project": "Wolvega",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP16-c",
  "tracStart": "OSO1 Wolvega (MSR01???)",
  "tracEind": "MSR25 ad Schipsloot 18 to",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 719,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "30-6-2026",
   "onderzoekGereed": "20-10-2026",
   "doNaarUO": "1-12-2026",
   "eindeUO": "12-1-2027",
   "contractGereed": "9-3-2027",
   "werkvoorbGereed": "4-5-2027",
   "uitvoeringGereed": "25-5-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP17-c|MSR25 ad Schipsloot 18 to|MSR26 Oppers 102 to",
  "project": "Wolvega",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP17-c",
  "tracStart": "MSR25 ad Schipsloot 18 to",
  "tracEind": "MSR26 Oppers 102 to",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 2423,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "30-6-2026",
   "onderzoekGereed": "20-10-2026",
   "doNaarUO": "1-12-2026",
   "eindeUO": "12-1-2027",
   "contractGereed": "9-3-2027",
   "werkvoorbGereed": "4-5-2027",
   "uitvoeringGereed": "6-7-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP17-c|MSR25 AD Schipsloot 18|MSR65 Schuttevaerstraat 30",
  "project": "Wolvega",
  "apd": "",
  "tracdeel": "",
  "wp": "WP17-c",
  "tracStart": "MSR25 AD Schipsloot 18",
  "tracEind": "MSR65 Schuttevaerstraat 30",
  "engineer": "Dennis Verkoeijen",
  "lengteNieuw": 0,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "2-9-2025",
   "onderzoekGereed": "23-12-2025",
   "doNaarUO": "3-2-2026",
   "eindeUO": "17-3-2026",
   "contractGereed": "12-5-2026",
   "werkvoorbGereed": "7-7-2026",
   "uitvoeringGereed": "7-7-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP18-c|MSR26 Oppers 102 to|MSR18 De Meenthe Puccinistraat",
  "project": "Wolvega",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP18-c",
  "tracStart": "MSR26 Oppers 102 to",
  "tracEind": "MSR18 De Meenthe Puccinistraat",
  "engineer": "Robin Slomp",
  "lengteNieuw": 2156,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "30-6-2026",
   "onderzoekGereed": "20-10-2026",
   "doNaarUO": "1-12-2026",
   "eindeUO": "12-1-2027",
   "contractGereed": "9-3-2027",
   "werkvoorbGereed": "4-5-2027",
   "uitvoeringGereed": "29-6-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP19-c|MSR18 De Meenthe Puccinistraat|MSR19 Koolwitje",
  "project": "Wolvega",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP19-c",
  "tracStart": "MSR18 De Meenthe Puccinistraat",
  "tracEind": "MSR19 Koolwitje",
  "engineer": "Lucas van der Cammen",
  "lengteNieuw": 1852,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "23-6-2026",
   "onderzoekGereed": "13-10-2026",
   "doNaarUO": "24-11-2026",
   "eindeUO": "5-1-2027",
   "contractGereed": "2-3-2027",
   "werkvoorbGereed": "27-4-2027",
   "uitvoeringGereed": "15-6-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP20-c|MSR19 Koolwitje|,",
  "project": "Wolvega",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP20-c",
  "tracStart": "MSR19 Koolwitje",
  "tracEind": ",",
  "engineer": "Robin Slomp",
  "lengteNieuw": 891,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "23-6-2026",
   "onderzoekGereed": "13-10-2026",
   "doNaarUO": "24-11-2026",
   "eindeUO": "5-1-2027",
   "contractGereed": "2-3-2027",
   "werkvoorbGereed": "27-4-2027",
   "uitvoeringGereed": "18-5-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP21-c|MSR20 Atlanta ???|OS01 Wolvega (MSR01) ???",
  "project": "Wolvega",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP21-c",
  "tracStart": "MSR20 Atlanta ???",
  "tracEind": "OS01 Wolvega (MSR01) ???",
  "engineer": "Robin Slomp",
  "lengteNieuw": 2401,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "23-6-2026",
   "onderzoekGereed": "13-10-2026",
   "doNaarUO": "24-11-2026",
   "eindeUO": "5-1-2027",
   "contractGereed": "2-3-2027",
   "werkvoorbGereed": "27-4-2027",
   "uitvoeringGereed": "29-6-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP21-c|MSR20 Atlanta ???|MSR30 Stellingerweg Atlanta ???",
  "project": "Wolvega",
  "apd": "",
  "tracdeel": "",
  "wp": "WP21-c",
  "tracStart": "MSR20 Atlanta ???",
  "tracEind": "MSR30 Stellingerweg Atlanta ???",
  "engineer": "Dennis Verkoeijen",
  "lengteNieuw": 0,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "20-1-2026",
   "onderzoekGereed": "12-5-2026",
   "doNaarUO": "23-6-2026",
   "eindeUO": "4-8-2026",
   "contractGereed": "29-9-2026",
   "werkvoorbGereed": "24-11-2026",
   "uitvoeringGereed": "24-11-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP17-c|MSR26 Oppers 102|MSR67 Carbonstraat Hoek Platina",
  "project": "Wolvega",
  "apd": "",
  "tracdeel": "",
  "wp": "WP17-c",
  "tracStart": "MSR26 Oppers 102",
  "tracEind": "MSR67 Carbonstraat Hoek Platina",
  "engineer": "Dennis Verkoeijen",
  "lengteNieuw": 0,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "17-2-2026",
   "onderzoekGereed": "9-6-2026",
   "doNaarUO": "21-7-2026",
   "eindeUO": "1-9-2026",
   "contractGereed": "27-10-2026",
   "werkvoorbGereed": "22-12-2026",
   "uitvoeringGereed": "22-12-2026",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP23-c|MSR69 Oppers 58 Myako BV ???|MSR70 Zilverlaan 77-03 ???",
  "project": "Wolvega",
  "apd": "",
  "tracdeel": "",
  "wp": "WP23-c",
  "tracStart": "MSR69 Oppers 58 Myako BV ???",
  "tracEind": "MSR70 Zilverlaan 77-03 ???",
  "engineer": "Dennis Verkoeijen",
  "lengteNieuw": 0,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "17-3-2026",
   "onderzoekGereed": "7-7-2026",
   "doNaarUO": "18-8-2026",
   "eindeUO": "29-9-2026",
   "contractGereed": "24-11-2026",
   "werkvoorbGereed": "19-1-2027",
   "uitvoeringGereed": "19-1-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Wolvega|WP22-c|OS01 Wolvega ???|MSR84 Hoofdstraat Oost 68-03 ???",
  "project": "Wolvega",
  "apd": "",
  "tracdeel": "",
  "wp": "WP22-c",
  "tracStart": "OS01 Wolvega ???",
  "tracEind": "MSR84 Hoofdstraat Oost 68-03 ???",
  "engineer": "Dennis Verkoeijen",
  "lengteNieuw": 0,
  "mPerWeek": 300,
  "mijlpalen": {
   "overdrachtVO": "8-10-2024",
   "analyseNaarVO": "5-11-2024",
   "startConceptDO": "10-12-2024",
   "conceptDO": "14-4-2026",
   "onderzoekGereed": "4-8-2026",
   "doNaarUO": "15-9-2026",
   "eindeUO": "27-10-2026",
   "contractGereed": "22-12-2026",
   "werkvoorbGereed": "16-2-2027",
   "uitvoeringGereed": "16-2-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Luinjeberd|WP1|AC5|DR-01",
  "project": "Luinjeberd",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP1",
  "tracStart": "AC5",
  "tracEind": "DR-01",
  "engineer": "Gabor Misic",
  "lengteNieuw": 3342,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "12-12-2025",
   "analyseNaarVO": "9-1-2026",
   "startConceptDO": "13-2-2026",
   "conceptDO": "27-3-2026",
   "onderzoekGereed": "17-7-2026",
   "doNaarUO": "28-8-2026",
   "eindeUO": "9-10-2026",
   "contractGereed": "4-12-2026",
   "werkvoorbGereed": "29-1-2027",
   "uitvoeringGereed": "26-2-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Luinjeberd|WP2|DR-01|DR-07",
  "project": "Luinjeberd",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP2",
  "tracStart": "DR-01",
  "tracEind": "DR-07",
  "engineer": "Gabor Misic",
  "lengteNieuw": 4103,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "12-12-2025",
   "analyseNaarVO": "9-1-2026",
   "startConceptDO": "13-2-2026",
   "conceptDO": "27-3-2026",
   "onderzoekGereed": "17-7-2026",
   "doNaarUO": "28-8-2026",
   "eindeUO": "9-10-2026",
   "contractGereed": "4-12-2026",
   "werkvoorbGereed": "29-1-2027",
   "uitvoeringGereed": "5-3-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Luinjeberd|WP3|DR-07|DR-02",
  "project": "Luinjeberd",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP3",
  "tracStart": "DR-07",
  "tracEind": "DR-02",
  "engineer": "Gabor Misic",
  "lengteNieuw": 3951,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "12-12-2025",
   "analyseNaarVO": "9-1-2026",
   "startConceptDO": "13-2-2026",
   "conceptDO": "27-3-2026",
   "onderzoekGereed": "17-7-2026",
   "doNaarUO": "28-8-2026",
   "eindeUO": "9-10-2026",
   "contractGereed": "4-12-2026",
   "werkvoorbGereed": "29-1-2027",
   "uitvoeringGereed": "26-2-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Luinjeberd|WP4|DR-02|MSR 1 001 402",
  "project": "Luinjeberd",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP4",
  "tracStart": "DR-02",
  "tracEind": "MSR 1 001 402",
  "engineer": "Thierry Papenhuijzen",
  "lengteNieuw": 3188,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "12-12-2025",
   "analyseNaarVO": "9-1-2026",
   "startConceptDO": "13-2-2026",
   "conceptDO": "27-3-2026",
   "onderzoekGereed": "17-7-2026",
   "doNaarUO": "28-8-2026",
   "eindeUO": "9-10-2026",
   "contractGereed": "4-12-2026",
   "werkvoorbGereed": "29-1-2027",
   "uitvoeringGereed": "26-2-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Luinjeberd|WP5|MSR 1 001 402|DR-03",
  "project": "Luinjeberd",
  "apd": "APD-1",
  "tracdeel": "",
  "wp": "WP5",
  "tracStart": "MSR 1 001 402",
  "tracEind": "DR-03",
  "engineer": "Thierry Papenhuijzen",
  "lengteNieuw": 3897,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "12-12-2025",
   "analyseNaarVO": "9-1-2026",
   "startConceptDO": "13-2-2026",
   "conceptDO": "27-3-2026",
   "onderzoekGereed": "17-7-2026",
   "doNaarUO": "28-8-2026",
   "eindeUO": "9-10-2026",
   "contractGereed": "4-12-2026",
   "werkvoorbGereed": "29-1-2027",
   "uitvoeringGereed": "26-2-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Luinjeberd|WP6|DR-03|DR-04",
  "project": "Luinjeberd",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP6",
  "tracStart": "DR-03",
  "tracEind": "DR-04",
  "engineer": "Thierry Papenhuijzen",
  "lengteNieuw": 2668,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "12-12-2025",
   "analyseNaarVO": "9-1-2026",
   "startConceptDO": "13-2-2026",
   "conceptDO": "27-3-2026",
   "onderzoekGereed": "17-7-2026",
   "doNaarUO": "28-8-2026",
   "eindeUO": "9-10-2026",
   "contractGereed": "4-12-2026",
   "werkvoorbGereed": "29-1-2027",
   "uitvoeringGereed": "19-2-2027",
   "klantwens": ""
  }
 },
 {
  "id": "Luinjeberd|WP7|DR-04|DR-06",
  "project": "Luinjeberd",
  "apd": "",
  "tracdeel": "VERVALLEN",
  "wp": "WP7",
  "tracStart": "DR-04",
  "tracEind": "DR-06",
  "engineer": "-",
  "lengteNieuw": 0,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "",
   "analyseNaarVO": "",
   "startConceptDO": "",
   "conceptDO": "",
   "onderzoekGereed": "",
   "doNaarUO": "",
   "eindeUO": "",
   "contractGereed": "",
   "werkvoorbGereed": "",
   "uitvoeringGereed": "",
   "klantwens": ""
  }
 },
 {
  "id": "Luinjeberd|WP8|DR-06|DR-05",
  "project": "Luinjeberd",
  "apd": "",
  "tracdeel": "VERVALLEN",
  "wp": "WP8",
  "tracStart": "DR-06",
  "tracEind": "DR-05",
  "engineer": "-",
  "lengteNieuw": 0,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "",
   "analyseNaarVO": "",
   "startConceptDO": "",
   "conceptDO": "",
   "onderzoekGereed": "",
   "doNaarUO": "",
   "eindeUO": "",
   "contractGereed": "",
   "werkvoorbGereed": "",
   "uitvoeringGereed": "",
   "klantwens": ""
  }
 },
 {
  "id": "Luinjeberd|WP9|DR-05|AC5",
  "project": "Luinjeberd",
  "apd": "APD-2",
  "tracdeel": "",
  "wp": "WP9",
  "tracStart": "DR-05",
  "tracEind": "AC5",
  "engineer": "Gabor Misic",
  "lengteNieuw": 2126,
  "mPerWeek": 1000,
  "mijlpalen": {
   "overdrachtVO": "",
   "analyseNaarVO": "",
   "startConceptDO": "",
   "conceptDO": "",
   "onderzoekGereed": "",
   "doNaarUO": "",
   "eindeUO": "",
   "contractGereed": "",
   "werkvoorbGereed": "",
   "uitvoeringGereed": "",
   "klantwens": ""
  }
 }
];

window.SEED_VOORTGANG = {
 "Joure|WP1|RS Jou|DR06": {
  "0.02": {
   "status": "gereed"
  },
  "0.03": {
   "status": "bezig"
  },
  "0.07": {
   "status": "gereed"
  },
  "0.04": {
   "status": "gereed"
  },
  "0.06": {
   "status": "gereed"
  },
  "2.02.01": {
   "status": "gereed"
  },
  "1.04.01": {
   "status": "bezig"
  },
  "1.01": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Joure|WP2|DR06|DR04": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Joure|WP3|DR04|DR05": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Joure|WP4|DR05|DR01": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Joure|WP5|DR01|DR02": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Joure|WP6|DR02|DR03": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Joure|WP7|DR03|RS Jou": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Joure|WP8|RS Jou|DR08": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Joure|WP9|DR08|DR09": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Joure|WP10|DR09|DR10": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "gereed"
  },
  "1.03.01": {
   "status": "bezig"
  },
  "1.03.02": {
   "status": "nvt"
  },
  "1.04.04": {
   "status": "bezig"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "bezig"
  },
  "2.04.02": {
   "status": "bezig"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "issue"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Joure|WP11|DR10|DR07": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "gereed"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Joure|WP12|DR07|DR11": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Joure|WP13|DR11|DR12": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Joure|WP14|DR12|RS Jou": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "gereed"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "nvt"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "nvt"
  },
  "2.01.01": {
   "status": "nvt"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP1-w|OSO1 Wolvega (MSR01???)|MSR02 Stadsburen 16": {
  "0.02": {
   "status": "gereed"
  },
  "0.03": {
   "status": "gereed"
  },
  "0.07": {
   "status": "gereed"
  },
  "0.04": {
   "status": "gereed"
  },
  "0.06": {
   "status": "gereed"
  },
  "2.02.01": {
   "status": "bezig"
  },
  "1.04.01": {
   "status": "gereed"
  },
  "1.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "issue"
  },
  "2.04.02": {
   "status": "bezig"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "bezig"
  },
  "2.03.03": {
   "status": "gereed"
  },
  "2.03.04": {
   "status": "issue"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "2.04.04": {
   "status": "vertraagd"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP2-w|MSR02 Stadsburen 16|MSR03 Kooiweg bd Schipsloot MSR": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "issue"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "nvt"
  },
  "2.01.01": {
   "status": "nvt"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "gereed"
  },
  "2.03.04": {
   "status": "gereed"
  },
  "2.05.01": {
   "status": "gereed"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.01.03": {
   "status": "nvt"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "2.04.04": {
   "status": "issue"
  },
  "2.01.04": {
   "status": "gereed"
  },
  "2.02.00": {
   "status": "gereed"
  },
  "2.06.02": {
   "status": "gereed"
  },
  "2.06.03": {
   "status": "gereed"
  },
  "2.06.05": {
   "status": "gereed"
  },
  "2.06.04": {
   "status": "gereed"
  },
  "2.06.07": {
   "status": "gereed"
  },
  "2.06.06": {
   "status": "gereed"
  },
  "3.01.02": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP3-w|MSR03 Kooiweg bd Schipsloot MSR|MSR04 De Weeren 5 iMSR": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "gereed"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "gereed"
  },
  "2.01.01": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "gereed"
  },
  "2.03.04": {
   "status": "gereed"
  },
  "2.05.01": {
   "status": "gereed"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.01.03": {
   "status": "gereed"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "2.04.04": {
   "status": "gereed"
  },
  "2.01.04": {
   "status": "gereed"
  },
  "2.02.00": {
   "status": "gereed"
  },
  "2.06.02": {
   "status": "gereed"
  },
  "2.06.03": {
   "status": "gereed"
  },
  "2.06.05": {
   "status": "gereed"
  },
  "2.06.04": {
   "status": "gereed"
  },
  "2.06.07": {
   "status": "gereed"
  },
  "2.06.06": {
   "status": "gereed"
  },
  "3.01.02": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP4-w|MSR04 De Weeren 5 iMSR|MSR05 Hoofdweg 59": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "gereed"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "issue"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "gereed"
  },
  "2.01.01": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "gereed"
  },
  "2.03.04": {
   "status": "gereed"
  },
  "2.05.01": {
   "status": "issue"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.01.03": {
   "status": "gereed"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "2.04.04": {
   "status": "gereed"
  },
  "2.01.04": {
   "status": "gereed"
  },
  "2.02.00": {
   "status": "gereed"
  },
  "2.06.02": {
   "status": "gereed"
  },
  "2.06.03": {
   "status": "gereed"
  },
  "2.06.05": {
   "status": "gereed"
  },
  "2.06.04": {
   "status": "gereed"
  },
  "2.06.07": {
   "status": "gereed"
  },
  "2.06.06": {
   "status": "gereed"
  },
  "3.01.02": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP4-w|MSR05 Hoofdweg 59|MSR06 Kerkeweg 4": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.02": {
   "status": "nvt"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "nvt"
  },
  "2.04.02": {
   "status": "bezig"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.03": {
   "status": "nvt"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP5-w|MSR06 Kerkeweg 4|MSR07 P Stuyvesantweg 109": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "issue"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "gereed"
  },
  "2.01.01": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "nvt"
  },
  "2.03.04": {
   "status": "gereed"
  },
  "2.05.01": {
   "status": "gereed"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.01.03": {
   "status": "gereed"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "2.04.04": {
   "status": "bezig"
  },
  "2.01.04": {
   "status": "gereed"
  },
  "2.02.00": {
   "status": "gereed"
  },
  "2.06.02": {
   "status": "gereed"
  },
  "2.06.03": {
   "status": "gereed"
  },
  "2.06.05": {
   "status": "gereed"
  },
  "2.06.04": {
   "status": "gereed"
  },
  "2.06.07": {
   "status": "gereed"
  },
  "2.06.06": {
   "status": "gereed"
  },
  "3.01.02": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP6-w|MSR07 P Stuyvesantweg 109|MSR08 De Meenthe bij 21": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "issue"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "nvt"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "nvt"
  },
  "2.01.01": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "nvt"
  },
  "2.03.04": {
   "status": "gereed"
  },
  "2.05.01": {
   "status": "gereed"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.01.03": {
   "status": "nvt"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "2.04.04": {
   "status": "vertraagd"
  },
  "2.01.04": {
   "status": "gereed"
  },
  "2.02.00": {
   "status": "gereed"
  },
  "2.06.02": {
   "status": "gereed"
  },
  "2.06.03": {
   "status": "gereed"
  },
  "2.06.05": {
   "status": "gereed"
  },
  "2.06.04": {
   "status": "gereed"
  },
  "2.06.07": {
   "status": "gereed"
  },
  "2.06.06": {
   "status": "gereed"
  },
  "3.01.02": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP7-w|MSR08 De Meenthe bij 21|MSR09 Nijksweg 38": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "gereed"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "gereed"
  },
  "2.01.01": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "nvt"
  },
  "2.03.04": {
   "status": "gereed"
  },
  "2.05.01": {
   "status": "gereed"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.01.03": {
   "status": "gereed"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "2.04.04": {
   "status": "bezig"
  },
  "2.01.04": {
   "status": "gereed"
  },
  "2.02.00": {
   "status": "gereed"
  },
  "2.06.02": {
   "status": "gereed"
  },
  "2.06.03": {
   "status": "gereed"
  },
  "2.06.05": {
   "status": "gereed"
  },
  "2.06.04": {
   "status": "gereed"
  },
  "2.06.07": {
   "status": "gereed"
  },
  "2.06.06": {
   "status": "gereed"
  },
  "3.01.02": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP8-w|MSR09 Nijksweg 38|Eindmof": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "gereed"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "nvt"
  },
  "2.01.01": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "gereed"
  },
  "2.03.04": {
   "status": "gereed"
  },
  "2.05.01": {
   "status": "bezig"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.01.03": {
   "status": "nvt"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "2.04.04": {
   "status": "gereed"
  },
  "2.01.04": {
   "status": "gereed"
  },
  "2.02.00": {
   "status": "gereed"
  },
  "2.06.02": {
   "status": "gereed"
  },
  "2.06.03": {
   "status": "gereed"
  },
  "2.06.05": {
   "status": "gereed"
  },
  "2.06.04": {
   "status": "gereed"
  },
  "2.06.07": {
   "status": "gereed"
  },
  "2.06.06": {
   "status": "gereed"
  },
  "3.01.02": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP9-w|MSR03 Kooiweg bd Schipsloot|MSR12 Heerenveenseweg 177 MSR": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "issue"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "bezig"
  },
  "2.01.01": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "gereed"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.01.03": {
   "status": "nvt"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "2.04.04": {
   "status": "vertraagd"
  },
  "2.05.01": {
   "status": "issue"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP10-w|MSR12 Heerenveenseweg 177 MSR|MSR11 Rijksweg A32-1 AC5": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "gereed"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "nvt"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "nvt"
  },
  "2.01.01": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "gereed"
  },
  "2.03.04": {
   "status": "gereed"
  },
  "2.05.01": {
   "status": "gereed"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.01.03": {
   "status": "nvt"
  },
  "2.04.03": {
   "status": "nvt"
  },
  "2.04.04": {
   "status": "gereed"
  },
  "2.01.04": {
   "status": "gereed"
  },
  "2.02.00": {
   "status": "gereed"
  },
  "2.06.02": {
   "status": "gereed"
  },
  "2.06.03": {
   "status": "gereed"
  },
  "2.06.05": {
   "status": "gereed"
  },
  "2.06.04": {
   "status": "gereed"
  },
  "2.06.07": {
   "status": "gereed"
  },
  "2.06.06": {
   "status": "gereed"
  },
  "3.01.02": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP11-o|OSO1 Wolvega (MSR01???)|MSR11 Heerenveenseweg 173 MSR": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "issue"
  },
  "2.04.02": {
   "status": "bezig"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "gereed"
  },
  "2.04.03": {
   "status": "issue"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP12-o|MSR11 Heerenveenseweg 173 MSR|MSR13 Ruskemadeweg 7": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "gereed"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "gereed"
  },
  "2.01.01": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "gereed"
  },
  "2.03.04": {
   "status": "gereed"
  },
  "2.05.01": {
   "status": "gereed"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.01.03": {
   "status": "gereed"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "2.04.04": {
   "status": "gereed"
  },
  "2.01.04": {
   "status": "gereed"
  },
  "2.02.00": {
   "status": "gereed"
  },
  "2.06.02": {
   "status": "gereed"
  },
  "2.06.03": {
   "status": "gereed"
  },
  "2.06.05": {
   "status": "gereed"
  },
  "2.06.04": {
   "status": "gereed"
  },
  "2.06.07": {
   "status": "gereed"
  },
  "2.06.06": {
   "status": "gereed"
  },
  "3.01.02": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP13-o|MSR13 Ruskemadeweg 7|MSR14 Stellingenweg 52": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "bezig"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "vertraagd"
  },
  "2.01.01": {
   "status": "bezig"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "gereed"
  },
  "2.03.04": {
   "status": "nvt"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP13-o|MSR14 Stellingenweg 52|MSR55 Grotekamp 5": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP14-o|MSR16 Steggerdaweg 90|MSR17 Pepergaweg bij 144": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "gereed"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "gereed"
  },
  "2.01.01": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "gereed"
  },
  "2.03.04": {
   "status": "gereed"
  },
  "2.05.01": {
   "status": "vertraagd"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.01.03": {
   "status": "gereed"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "2.04.04": {
   "status": "gereed"
  },
  "2.01.04": {
   "status": "gereed"
  },
  "2.02.00": {
   "status": "gereed"
  },
  "2.06.02": {
   "status": "gereed"
  },
  "2.06.03": {
   "status": "gereed"
  },
  "2.06.05": {
   "status": "gereed"
  },
  "2.06.04": {
   "status": "gereed"
  },
  "2.06.07": {
   "status": "gereed"
  },
  "2.06.06": {
   "status": "gereed"
  },
  "3.01.02": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP15-o|MSR17 Pepergaweg bij 144|Pepergaweg 11 eindmof": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "gereed"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "nvt"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "nvt"
  },
  "2.01.01": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "gereed"
  },
  "2.03.04": {
   "status": "gereed"
  },
  "2.05.01": {
   "status": "vertraagd"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.01.03": {
   "status": "gereed"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "2.04.04": {
   "status": "gereed"
  },
  "2.01.04": {
   "status": "gereed"
  },
  "2.02.00": {
   "status": "gereed"
  },
  "2.06.02": {
   "status": "gereed"
  },
  "2.06.03": {
   "status": "gereed"
  },
  "2.06.05": {
   "status": "gereed"
  },
  "2.06.04": {
   "status": "gereed"
  },
  "2.06.07": {
   "status": "gereed"
  },
  "2.06.06": {
   "status": "gereed"
  },
  "3.01.02": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP16-c|OSO1 Wolvega (MSR01???)|MSR25 ad Schipsloot 18 to": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "bezig"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "nvt"
  },
  "1.03.03": {
   "status": "nvt"
  },
  "2.04.02": {
   "status": "nvt"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "nvt"
  },
  "2.04.03": {
   "status": "issue"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP17-c|MSR25 ad Schipsloot 18 to|MSR26 Oppers 102 to": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "issue"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "nvt"
  },
  "2.04.03": {
   "status": "issue"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP17-c|MSR25 AD Schipsloot 18|MSR65 Schuttevaerstraat 30": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "nvt"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP18-c|MSR26 Oppers 102 to|MSR18 De Meenthe Puccinistraat": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "vertraagd"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "2.03.03": {
   "status": "nvt"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP19-c|MSR18 De Meenthe Puccinistraat|MSR19 Koolwitje": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "bezig"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "bezig"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "bezig"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP20-c|MSR19 Koolwitje|,": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.01": {
   "status": "bezig"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "nvt"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "nvt"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP21-c|MSR20 Atlanta ???|OS01 Wolvega (MSR01) ???": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "bezig"
  },
  "1.04.03": {
   "status": "gereed"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.02": {
   "status": "bezig"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.03.02": {
   "status": "nvt"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP21-c|MSR20 Atlanta ???|MSR30 Stellingerweg Atlanta ???": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP17-c|MSR26 Oppers 102|MSR67 Carbonstraat Hoek Platina": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP23-c|MSR69 Oppers 58 Myako BV ???|MSR70 Zilverlaan 77-03 ???": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Wolvega|WP22-c|OS01 Wolvega ???|MSR84 Hoofdstraat Oost 68-03 ???": {
  "0.02": {
   "status": "nvt"
  },
  "0.03": {
   "status": "nvt"
  },
  "0.07": {
   "status": "nvt"
  },
  "0.04": {
   "status": "nvt"
  },
  "0.06": {
   "status": "nvt"
  },
  "2.02.01": {
   "status": "nvt"
  },
  "1.04.01": {
   "status": "nvt"
  },
  "1.01": {
   "status": "nvt"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Luinjeberd|WP1|AC5|DR-01": {
  "1.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "vertraagd"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "vertraagd"
  },
  "2.02.03": {
   "status": "vertraagd"
  },
  "2.01.02": {
   "status": "bezig"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Luinjeberd|WP2|DR-01|DR-07": {
  "1.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "vertraagd"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "vertraagd"
  },
  "2.02.03": {
   "status": "vertraagd"
  },
  "2.01.02": {
   "status": "bezig"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Luinjeberd|WP3|DR-07|DR-02": {
  "1.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "vertraagd"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "vertraagd"
  },
  "2.02.03": {
   "status": "vertraagd"
  },
  "2.01.02": {
   "status": "bezig"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Luinjeberd|WP4|DR-02|MSR 1 001 402": {
  "1.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "vertraagd"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
  },
  "2.01.02": {
   "status": "bezig"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Luinjeberd|WP5|MSR 1 001 402|DR-03": {
  "1.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "vertraagd"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "vertraagd"
  },
  "2.02.03": {
   "status": "vertraagd"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Luinjeberd|WP6|DR-03|DR-04": {
  "1.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "vertraagd"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "vertraagd"
  },
  "2.02.03": {
   "status": "vertraagd"
  },
  "2.01.02": {
   "status": "gereed"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 },
 "Luinjeberd|WP9|DR-05|AC5": {
  "1.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "gereed"
  },
  "1.04.02": {
   "status": "gereed"
  },
  "1.04.03": {
   "status": "vertraagd"
  },
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "vertraagd"
  },
  "2.02.03": {
   "status": "vertraagd"
  },
  "2.01.02": {
   "status": "bezig"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "0.01": {
   "status": "nvt"
  },
  "0.05": {
   "status": "nvt"
  },
  "0.08": {
   "status": "nvt"
  },
  "1.02.01": {
   "status": "nvt"
  },
  "1.02.02": {
   "status": "nvt"
  },
  "1.02.03": {
   "status": "nvt"
  },
  "1.03.04": {
   "status": "nvt"
  },
  "1.04.05": {
   "status": "nvt"
  },
  "2.02.02": {
   "status": "nvt"
  },
  "2.03.01": {
   "status": "nvt"
  },
  "2.03.05": {
   "status": "nvt"
  },
  "2.06.01": {
   "status": "nvt"
  },
  "3.01.05": {
   "status": "nvt"
  },
  "3.01.07": {
   "status": "nvt"
  },
  "3.01.08": {
   "status": "nvt"
  },
  "4.01": {
   "status": "nvt"
  },
  "4.02": {
   "status": "nvt"
  },
  "4.03": {
   "status": "nvt"
  },
  "4.04": {
   "status": "nvt"
  },
  "4.05": {
   "status": "nvt"
  },
  "4.06": {
   "status": "nvt"
  },
  "4.07": {
   "status": "nvt"
  },
  "4.08": {
   "status": "nvt"
  }
 }
};

/* ==========================================================================
   Onderzoeken — realistische testdata voor het conditionerend-onderzoeksregister.
   Gegenereerd (deterministisch, o.b.v. wp-id + categorie) uit de mijlpaaldata
   van SEED_WERKPAKKETTEN: per werkpakket een plausibele set conditionerende
   onderzoeken (bodem, flora & fauna, Natura 2000/stikstof, archeologie, NGE,
   kabels & leidingen, geotechniek, water, houtopstanden, akoestiek,
   luchtkwaliteit, externe veiligheid, asbest, cultuurhistorie, m.e.r.), met
   status/data afgeleid van de mijlpaal "onderzoekGereed" t.o.v. de
   standaard-peildatum. Wordt bij een lege staat.onderzoeken automatisch
   gekoppeld aan de dan bestaande werkpakketten (zie State.laad in app.js) —
   dus ook na een CSV-herimport met dezelfde wp-id-structuur.
   ========================================================================== */
window.SEED_ONDERZOEKEN = [
  {"id":"oz-seed-1","wpId":"Spannenburg|WP1|RS Tjerkgaast|DR01","categorie":"bodem","status":"gereed","omschrijving":"Actualiserend bodemonderzoek","bureau":"NIPA Milieutechniek","uitgezetOp":"24-11-2025","verwachtOp":"8-5-2026","opgeleverdOp":"11-5-2026","geldigTot":"11-5-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2","wpId":"Spannenburg|WP1|RS Tjerkgaast|DR01","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"12-11-2025","verwachtOp":"22-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3","wpId":"Spannenburg|WP1|RS Tjerkgaast|DR01","categorie":"floraFauna","status":"gereed","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Antea Group","uitgezetOp":"29-11-2025","verwachtOp":"11-5-2026","opgeleverdOp":"14-5-2026","geldigTot":"14-5-2029","vervolgNodig":true,"vervolgToelichting":"Quickscan wijst op mogelijke vaste rust-/verblijfplaats — nader onderzoek en mogelijk ontheffingsaanvraag Wnb nodig.","notitie":""},
  {"id":"oz-seed-4","wpId":"Spannenburg|WP1|RS Tjerkgaast|DR01","categorie":"luchtkwaliteit","status":"uitgezet","omschrijving":"Onderzoek luchtkwaliteit (NIBM-toets)","bureau":"Antea Group","uitgezetOp":"5-12-2025","verwachtOp":"9-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5","wpId":"Spannenburg|WP1|RS Tjerkgaast|DR01","categorie":"mer","status":"loopt","omschrijving":"M.e.r.-beoordeling gehele tracé/APD","bureau":"Sweco Nederland","uitgezetOp":"5-12-2025","verwachtOp":"9-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6","wpId":"Spannenburg|WP2|DR01|DR02","categorie":"bodem","status":"uitgezet","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"NIPA Milieutechniek","uitgezetOp":"10-11-2025","verwachtOp":"5-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7","wpId":"Spannenburg|WP2|DR01|DR02","categorie":"archeologie","status":"gereed","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"Antea Group","uitgezetOp":"1-12-2025","verwachtOp":"27-5-2026","opgeleverdOp":"31-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8","wpId":"Spannenburg|WP2|DR01|DR02","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"15-11-2025","verwachtOp":"18-6-2026","opgeleverdOp":"17-6-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9","wpId":"Spannenburg|WP2|DR01|DR02","categorie":"floraFauna","status":"nodig","omschrijving":"Nader onderzoek beschermde soorten","bureau":"","uitgezetOp":"","verwachtOp":"17-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-a","wpId":"Spannenburg|WP2|DR01|DR02","categorie":"nge","status":"gereed","omschrijving":"Vooronderzoek niet-gesprongen explosieven (CE-bodembelastingkaart)","bureau":"ExploVision","uitgezetOp":"29-11-2025","verwachtOp":"15-6-2026","opgeleverdOp":"12-6-2026","geldigTot":"12-6-2029","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-b","wpId":"Spannenburg|WP3|DR02|DR03","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"Hunneman Milieu-advies","uitgezetOp":"12-11-2025","verwachtOp":"15-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-c","wpId":"Spannenburg|WP3|DR02|DR03","categorie":"archeologie","status":"loopt","omschrijving":"Bureauonderzoek archeologie","bureau":"ADC ArcheoProjecten","uitgezetOp":"25-11-2025","verwachtOp":"14-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-d","wpId":"Spannenburg|WP3|DR02|DR03","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"2-11-2025","verwachtOp":"12-6-2026","opgeleverdOp":"8-6-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-e","wpId":"Spannenburg|WP3|DR02|DR03","categorie":"floraFauna","status":"loopt","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Bureau Waardenburg","uitgezetOp":"13-11-2025","verwachtOp":"12-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-f","wpId":"Spannenburg|WP3|DR02|DR03","categorie":"water","status":"nodig","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"","uitgezetOp":"","verwachtOp":"14-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-g","wpId":"Spannenburg|WP3|DR02|DR03","categorie":"nge","status":"nodig","omschrijving":"Detectieonderzoek NGE","bureau":"","uitgezetOp":"","verwachtOp":"18-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-h","wpId":"Spannenburg|WP3|DR02|DR03","categorie":"cultuurhistorie","status":"loopt","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"5-11-2025","verwachtOp":"23-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-i","wpId":"Spannenburg|WP4|DR03|DR04","categorie":"bodem","status":"loopt","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Tauw","uitgezetOp":"16-11-2025","verwachtOp":"25-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-j","wpId":"Spannenburg|WP4|DR03|DR04","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"15-11-2025","verwachtOp":"23-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-k","wpId":"Spannenburg|WP4|DR03|DR04","categorie":"floraFauna","status":"loopt","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Els & Linde Ecologie","uitgezetOp":"22-11-2025","verwachtOp":"6-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-l","wpId":"Spannenburg|WP4|DR03|DR04","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Antea Group","uitgezetOp":"26-11-2025","verwachtOp":"20-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-m","wpId":"Spannenburg|WP4|DR03|DR04","categorie":"asbest","status":"nodig","omschrijving":"Asbestinventarisatie te amoveren opstallen","bureau":"","uitgezetOp":"","verwachtOp":"1-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-n","wpId":"Spannenburg|WP4|DR03|DR04","categorie":"cultuurhistorie","status":"loopt","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"6-11-2025","verwachtOp":"23-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-o","wpId":"Spannenburg|WP5|DR04|DR05","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"Tauw","uitgezetOp":"9-11-2025","verwachtOp":"4-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-p","wpId":"Spannenburg|WP5|DR04|DR05","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"14-11-2025","verwachtOp":"23-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-q","wpId":"Spannenburg|WP5|DR04|DR05","categorie":"floraFauna","status":"loopt","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Sweco Nederland","uitgezetOp":"18-11-2025","verwachtOp":"16-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-r","wpId":"Spannenburg|WP5|DR04|DR05","categorie":"water","status":"loopt","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Sweco Nederland","uitgezetOp":"9-11-2025","verwachtOp":"3-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-s","wpId":"Spannenburg|WP5|DR04|DR05","categorie":"nge","status":"loopt","omschrijving":"Detectieonderzoek NGE","bureau":"Saricon","uitgezetOp":"12-11-2025","verwachtOp":"23-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-t","wpId":"Spannenburg|WP5|DR04|DR05","categorie":"cultuurhistorie","status":"loopt","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"Antea Group","uitgezetOp":"28-11-2025","verwachtOp":"24-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-u","wpId":"Spannenburg|WP5|DR04|DR05","categorie":"natura2000","status":"loopt","omschrijving":"Voortoets Natura 2000","bureau":"Sweco Nederland","uitgezetOp":"2-11-2025","verwachtOp":"6-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-v","wpId":"Spannenburg|WP6|DR05|DR06","categorie":"bodem","status":"loopt","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Antea Group","uitgezetOp":"16-11-2025","verwachtOp":"22-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-w","wpId":"Spannenburg|WP6|DR05|DR06","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"ADC ArcheoProjecten","uitgezetOp":"21-11-2025","verwachtOp":"17-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-x","wpId":"Spannenburg|WP6|DR05|DR06","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Antea Group","uitgezetOp":"28-11-2025","verwachtOp":"1-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-y","wpId":"Spannenburg|WP6|DR05|DR06","categorie":"floraFauna","status":"loopt","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Bureau Waardenburg","uitgezetOp":"21-11-2025","verwachtOp":"1-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-z","wpId":"Spannenburg|WP6|DR05|DR06","categorie":"houtopstanden","status":"loopt","omschrijving":"Boomeffectanalyse en kapmelding houtopstanden","bureau":"Els & Linde Ecologie","uitgezetOp":"28-11-2025","verwachtOp":"10-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-10","wpId":"Spannenburg|WP6|DR05|DR06","categorie":"akoestiek","status":"loopt","omschrijving":"Trillingsonderzoek nabijgelegen bebouwing","bureau":"DGMR","uitgezetOp":"5-12-2025","verwachtOp":"16-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-11","wpId":"Spannenburg|WP7|DR06|DR07","categorie":"bodem","status":"loopt","omschrijving":"Verkennend bodemonderzoek NEN 5740","bureau":"Hunneman Milieu-advies","uitgezetOp":"3-12-2025","verwachtOp":"16-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-12","wpId":"Spannenburg|WP7|DR06|DR07","categorie":"archeologie","status":"loopt","omschrijving":"Bureauonderzoek archeologie","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"15-11-2025","verwachtOp":"20-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-13","wpId":"Spannenburg|WP7|DR06|DR07","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"1-12-2025","verwachtOp":"7-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-14","wpId":"Spannenburg|WP7|DR06|DR07","categorie":"floraFauna","status":"loopt","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Sweco Nederland","uitgezetOp":"5-11-2025","verwachtOp":"12-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-15","wpId":"Spannenburg|WP7|DR06|DR07","categorie":"geotechniek","status":"loopt","omschrijving":"Sonderingen en grondboringen","bureau":"Inpijn-Blokpoel","uitgezetOp":"21-11-2025","verwachtOp":"20-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-16","wpId":"Spannenburg|WP7|DR06|DR07","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"28-11-2025","verwachtOp":"12-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-17","wpId":"Spannenburg|WP7|DR06|DR07","categorie":"externeVeiligheid","status":"loopt","omschrijving":"Onderzoek externe veiligheid (groepsrisico)","bureau":"Antea Group","uitgezetOp":"2-11-2025","verwachtOp":"20-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-18","wpId":"Spannenburg|WP7|DR06|DR07","categorie":"natura2000","status":"loopt","omschrijving":"Passende beoordeling stikstofdepositie","bureau":"Arcadis Nederland","uitgezetOp":"16-11-2025","verwachtOp":"13-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-19","wpId":"Spannenburg|WP8|DR07|DR08","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"Antea Group","uitgezetOp":"20-11-2025","verwachtOp":"25-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1a","wpId":"Spannenburg|WP8|DR07|DR08","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"ADC ArcheoProjecten","uitgezetOp":"19-11-2025","verwachtOp":"20-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1b","wpId":"Spannenburg|WP8|DR07|DR08","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"3-11-2025","verwachtOp":"20-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1c","wpId":"Spannenburg|WP8|DR07|DR08","categorie":"floraFauna","status":"loopt","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Els & Linde Ecologie","uitgezetOp":"18-11-2025","verwachtOp":"16-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1d","wpId":"Spannenburg|WP8|DR07|DR08","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"20-11-2025","verwachtOp":"7-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1e","wpId":"Spannenburg|WP8|DR07|DR08","categorie":"nge","status":"nodig","omschrijving":"Projectgebonden risicoanalyse NGE","bureau":"","uitgezetOp":"","verwachtOp":"26-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1f","wpId":"Spannenburg|WP8|DR07|DR08","categorie":"akoestiek","status":"loopt","omschrijving":"Akoestisch onderzoek bouwfase (geluid)","bureau":"Peutz","uitgezetOp":"30-11-2025","verwachtOp":"19-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1g","wpId":"Spannenburg|WP9|DR08|DR09","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"Tauw","uitgezetOp":"30-11-2025","verwachtOp":"8-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1h","wpId":"Spannenburg|WP9|DR08|DR09","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"ADC ArcheoProjecten","uitgezetOp":"6-12-2025","verwachtOp":"9-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1i","wpId":"Spannenburg|WP9|DR08|DR09","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Antea Group","uitgezetOp":"4-11-2025","verwachtOp":"18-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1j","wpId":"Spannenburg|WP9|DR08|DR09","categorie":"floraFauna","status":"nodig","omschrijving":"Nader onderzoek beschermde soorten","bureau":"","uitgezetOp":"","verwachtOp":"16-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1k","wpId":"Spannenburg|WP9|DR08|DR09","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Antea Group","uitgezetOp":"6-12-2025","verwachtOp":"21-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1l","wpId":"Spannenburg|WP9|DR08|DR09","categorie":"nge","status":"loopt","omschrijving":"Projectgebonden risicoanalyse NGE","bureau":"Saricon","uitgezetOp":"22-11-2025","verwachtOp":"17-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1m","wpId":"Spannenburg|WP9|DR08|DR09","categorie":"externeVeiligheid","status":"loopt","omschrijving":"Onderzoek externe veiligheid (groepsrisico)","bureau":"AVIV","uitgezetOp":"23-11-2025","verwachtOp":"4-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1n","wpId":"Spannenburg|WP10|DR09|DR10","categorie":"bodem","status":"nodig","omschrijving":"Actualiserend bodemonderzoek","bureau":"","uitgezetOp":"","verwachtOp":"19-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1o","wpId":"Spannenburg|WP10|DR09|DR10","categorie":"archeologie","status":"loopt","omschrijving":"Bureauonderzoek archeologie","bureau":"Antea Group","uitgezetOp":"25-11-2025","verwachtOp":"9-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1p","wpId":"Spannenburg|WP10|DR09|DR10","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Antea Group","uitgezetOp":"4-11-2025","verwachtOp":"25-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1q","wpId":"Spannenburg|WP10|DR09|DR10","categorie":"floraFauna","status":"nodig","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"","uitgezetOp":"","verwachtOp":"26-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1r","wpId":"Spannenburg|WP10|DR09|DR10","categorie":"geotechniek","status":"loopt","omschrijving":"Sonderingen en grondboringen","bureau":"Fugro","uitgezetOp":"23-11-2025","verwachtOp":"29-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1s","wpId":"Spannenburg|WP10|DR09|DR10","categorie":"water","status":"loopt","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"1-12-2025","verwachtOp":"19-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1t","wpId":"Spannenburg|WP10|DR09|DR10","categorie":"nge","status":"loopt","omschrijving":"Detectieonderzoek NGE","bureau":"ExploVision","uitgezetOp":"21-11-2025","verwachtOp":"11-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1u","wpId":"Spannenburg|WP10|DR09|DR10","categorie":"natura2000","status":"loopt","omschrijving":"Stikstofonderzoek AERIUS-berekening","bureau":"Sweco Nederland","uitgezetOp":"14-11-2025","verwachtOp":"29-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1v","wpId":"Spannenburg|WP11|DR10|DR11","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"Sweco Nederland","uitgezetOp":"3-12-2025","verwachtOp":"7-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1w","wpId":"Spannenburg|WP11|DR10|DR11","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"25-11-2025","verwachtOp":"26-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1x","wpId":"Spannenburg|WP11|DR10|DR11","categorie":"floraFauna","status":"loopt","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Bureau Waardenburg","uitgezetOp":"10-11-2025","verwachtOp":"18-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1y","wpId":"Spannenburg|WP11|DR10|DR11","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"28-11-2025","verwachtOp":"13-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-1z","wpId":"Spannenburg|WP11|DR10|DR11","categorie":"houtopstanden","status":"loopt","omschrijving":"Boomeffectanalyse en kapmelding houtopstanden","bureau":"Bureau Waardenburg","uitgezetOp":"2-11-2025","verwachtOp":"26-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-20","wpId":"Spannenburg|WP12|DR11|DR12","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"Antea Group","uitgezetOp":"7-11-2025","verwachtOp":"1-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-21","wpId":"Spannenburg|WP12|DR11|DR12","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"Antea Group","uitgezetOp":"8-11-2025","verwachtOp":"25-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-22","wpId":"Spannenburg|WP12|DR11|DR12","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"30-11-2025","verwachtOp":"4-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-23","wpId":"Spannenburg|WP12|DR11|DR12","categorie":"floraFauna","status":"loopt","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Els & Linde Ecologie","uitgezetOp":"26-11-2025","verwachtOp":"13-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-24","wpId":"Spannenburg|WP12|DR11|DR12","categorie":"geotechniek","status":"loopt","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"Fugro","uitgezetOp":"20-11-2025","verwachtOp":"21-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-25","wpId":"Spannenburg|WP12|DR11|DR12","categorie":"water","status":"loopt","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"3-11-2025","verwachtOp":"11-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-26","wpId":"Spannenburg|WP12|DR11|DR12","categorie":"nge","status":"loopt","omschrijving":"Vooronderzoek niet-gesprongen explosieven (CE-bodembelastingkaart)","bureau":"ExploVision","uitgezetOp":"11-11-2025","verwachtOp":"22-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-27","wpId":"Spannenburg|WP13|DR12|RS Tjerkgaast","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"Sweco Nederland","uitgezetOp":"7-11-2025","verwachtOp":"26-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-28","wpId":"Spannenburg|WP13|DR12|RS Tjerkgaast","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"13-11-2025","verwachtOp":"1-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-29","wpId":"Spannenburg|WP13|DR12|RS Tjerkgaast","categorie":"geotechniek","status":"loopt","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"Wiertsema & Partners","uitgezetOp":"14-11-2025","verwachtOp":"26-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2a","wpId":"Spannenburg|WP14|RS Tjerkgaast|DR08","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"Tauw","uitgezetOp":"8-11-2025","verwachtOp":"22-12-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2b","wpId":"Spannenburg|WP14|RS Tjerkgaast|DR08","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"20-11-2025","verwachtOp":"11-12-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2c","wpId":"Spannenburg|WP14|RS Tjerkgaast|DR08","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"10-11-2025","verwachtOp":"24-12-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2d","wpId":"Spannenburg|WP14|RS Tjerkgaast|DR08","categorie":"floraFauna","status":"loopt","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Els & Linde Ecologie","uitgezetOp":"5-12-2025","verwachtOp":"23-12-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2e","wpId":"Spannenburg|WP14|RS Tjerkgaast|DR08","categorie":"geotechniek","status":"loopt","omschrijving":"Sonderingen en grondboringen","bureau":"Fugro","uitgezetOp":"28-11-2025","verwachtOp":"9-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2f","wpId":"Spannenburg|WP14|RS Tjerkgaast|DR08","categorie":"water","status":"loopt","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Sweco Nederland","uitgezetOp":"2-12-2025","verwachtOp":"13-12-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2g","wpId":"Spannenburg|WP14|RS Tjerkgaast|DR08","categorie":"nge","status":"loopt","omschrijving":"Vooronderzoek niet-gesprongen explosieven (CE-bodembelastingkaart)","bureau":"Saricon","uitgezetOp":"6-12-2025","verwachtOp":"15-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2h","wpId":"Spannenburg|WP14|RS Tjerkgaast|DR08","categorie":"houtopstanden","status":"loopt","omschrijving":"Boomeffectanalyse en kapmelding houtopstanden","bureau":"Bureau Waardenburg","uitgezetOp":"6-11-2025","verwachtOp":"18-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2i","wpId":"Joure|WP1|RS Jou|DR06","categorie":"bodem","status":"loopt","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"NIPA Milieutechniek","uitgezetOp":"21-10-2025","verwachtOp":"10-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2j","wpId":"Joure|WP1|RS Jou|DR06","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"ADC ArcheoProjecten","uitgezetOp":"1-11-2025","verwachtOp":"27-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2k","wpId":"Joure|WP1|RS Jou|DR06","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Antea Group","uitgezetOp":"27-10-2025","verwachtOp":"25-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2l","wpId":"Joure|WP1|RS Jou|DR06","categorie":"floraFauna","status":"loopt","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Antea Group","uitgezetOp":"13-11-2025","verwachtOp":"10-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2m","wpId":"Joure|WP1|RS Jou|DR06","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Antea Group","uitgezetOp":"14-10-2025","verwachtOp":"2-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2n","wpId":"Joure|WP1|RS Jou|DR06","categorie":"mer","status":"loopt","omschrijving":"M.e.r.-beoordeling gehele tracé/APD","bureau":"Antea Group","uitgezetOp":"6-11-2025","verwachtOp":"11-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2o","wpId":"Joure|WP2|DR06|DR04","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"ADC ArcheoProjecten","uitgezetOp":"11-10-2025","verwachtOp":"25-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2p","wpId":"Joure|WP2|DR06|DR04","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"31-10-2025","verwachtOp":"22-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2q","wpId":"Joure|WP2|DR06|DR04","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Sweco Nederland","uitgezetOp":"2-11-2025","verwachtOp":"20-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2r","wpId":"Joure|WP2|DR06|DR04","categorie":"nge","status":"loopt","omschrijving":"Projectgebonden risicoanalyse NGE","bureau":"ExploVision","uitgezetOp":"12-10-2025","verwachtOp":"1-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2s","wpId":"Joure|WP3|DR04|DR05","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"Antea Group","uitgezetOp":"17-10-2025","verwachtOp":"30-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2t","wpId":"Joure|WP3|DR04|DR05","categorie":"archeologie","status":"loopt","omschrijving":"Bureauonderzoek archeologie","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"11-11-2025","verwachtOp":"4-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2u","wpId":"Joure|WP3|DR04|DR05","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"4-11-2025","verwachtOp":"31-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2v","wpId":"Joure|WP3|DR04|DR05","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Sweco Nederland","uitgezetOp":"8-11-2025","verwachtOp":"20-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2w","wpId":"Joure|WP3|DR04|DR05","categorie":"geotechniek","status":"loopt","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"Fugro","uitgezetOp":"28-10-2025","verwachtOp":"7-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2x","wpId":"Joure|WP3|DR04|DR05","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Sweco Nederland","uitgezetOp":"3-11-2025","verwachtOp":"4-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2y","wpId":"Joure|WP3|DR04|DR05","categorie":"nge","status":"loopt","omschrijving":"Detectieonderzoek NGE","bureau":"REASeuro","uitgezetOp":"14-10-2025","verwachtOp":"28-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-2z","wpId":"Joure|WP4|DR05|DR01","categorie":"bodem","status":"loopt","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Hunneman Milieu-advies","uitgezetOp":"16-10-2025","verwachtOp":"19-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-30","wpId":"Joure|WP4|DR05|DR01","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"Antea Group","uitgezetOp":"23-10-2025","verwachtOp":"10-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-31","wpId":"Joure|WP4|DR05|DR01","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"22-10-2025","verwachtOp":"4-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-32","wpId":"Joure|WP4|DR05|DR01","categorie":"floraFauna","status":"loopt","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Antea Group","uitgezetOp":"14-10-2025","verwachtOp":"16-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-33","wpId":"Joure|WP4|DR05|DR01","categorie":"water","status":"loopt","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"14-10-2025","verwachtOp":"19-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-34","wpId":"Joure|WP4|DR05|DR01","categorie":"luchtkwaliteit","status":"loopt","omschrijving":"Onderzoek luchtkwaliteit (NIBM-toets)","bureau":"Antea Group","uitgezetOp":"18-10-2025","verwachtOp":"20-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-35","wpId":"Joure|WP4|DR05|DR01","categorie":"natura2000","status":"loopt","omschrijving":"Passende beoordeling stikstofdepositie","bureau":"Bureau Waardenburg","uitgezetOp":"13-11-2025","verwachtOp":"8-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-36","wpId":"Joure|WP5|DR01|DR02","categorie":"bodem","status":"loopt","omschrijving":"Verkennend bodemonderzoek NEN 5740","bureau":"Antea Group","uitgezetOp":"12-11-2025","verwachtOp":"20-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-37","wpId":"Joure|WP5|DR01|DR02","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"Antea Group","uitgezetOp":"12-10-2025","verwachtOp":"13-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-38","wpId":"Joure|WP5|DR01|DR02","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"11-11-2025","verwachtOp":"20-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-39","wpId":"Joure|WP5|DR01|DR02","categorie":"floraFauna","status":"loopt","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Sweco Nederland","uitgezetOp":"11-11-2025","verwachtOp":"22-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3a","wpId":"Joure|WP5|DR01|DR02","categorie":"asbest","status":"loopt","omschrijving":"Asbestinventarisatie te amoveren opstallen","bureau":"Hunneman Milieu-advies","uitgezetOp":"4-11-2025","verwachtOp":"18-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3b","wpId":"Joure|WP5|DR01|DR02","categorie":"overig","status":"loopt","omschrijving":"Onderzoek grondwaterstanden i.v.m. bemaling","bureau":"Antea Group","uitgezetOp":"11-11-2025","verwachtOp":"16-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3c","wpId":"Joure|WP5|DR01|DR02","categorie":"natura2000","status":"loopt","omschrijving":"Stikstofonderzoek AERIUS-berekening","bureau":"Arcadis Nederland","uitgezetOp":"29-10-2025","verwachtOp":"13-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3d","wpId":"Joure|WP6|DR02|DR03","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"16-10-2025","verwachtOp":"5-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3e","wpId":"Joure|WP6|DR02|DR03","categorie":"kabelsLeidingen","status":"nodig","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"","uitgezetOp":"","verwachtOp":"21-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3f","wpId":"Joure|WP6|DR02|DR03","categorie":"floraFauna","status":"loopt","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Bureau Waardenburg","uitgezetOp":"4-11-2025","verwachtOp":"1-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3g","wpId":"Joure|WP6|DR02|DR03","categorie":"geotechniek","status":"loopt","omschrijving":"Sonderingen en grondboringen","bureau":"Wiertsema & Partners","uitgezetOp":"23-10-2025","verwachtOp":"29-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3h","wpId":"Joure|WP6|DR02|DR03","categorie":"water","status":"loopt","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Antea Group","uitgezetOp":"16-10-2025","verwachtOp":"26-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3i","wpId":"Joure|WP6|DR02|DR03","categorie":"nge","status":"loopt","omschrijving":"Vooronderzoek niet-gesprongen explosieven (CE-bodembelastingkaart)","bureau":"Saricon","uitgezetOp":"14-10-2025","verwachtOp":"28-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3j","wpId":"Joure|WP6|DR02|DR03","categorie":"natura2000","status":"loopt","omschrijving":"Passende beoordeling stikstofdepositie","bureau":"Bureau Waardenburg","uitgezetOp":"7-11-2025","verwachtOp":"24-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3k","wpId":"Joure|WP7|DR03|RS Jou","categorie":"bodem","status":"loopt","omschrijving":"Verkennend bodemonderzoek NEN 5740","bureau":"Antea Group","uitgezetOp":"31-10-2025","verwachtOp":"8-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3l","wpId":"Joure|WP7|DR03|RS Jou","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"Antea Group","uitgezetOp":"5-11-2025","verwachtOp":"28-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3m","wpId":"Joure|WP7|DR03|RS Jou","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Antea Group","uitgezetOp":"13-11-2025","verwachtOp":"25-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3n","wpId":"Joure|WP7|DR03|RS Jou","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Els & Linde Ecologie","uitgezetOp":"11-10-2025","verwachtOp":"17-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3o","wpId":"Joure|WP7|DR03|RS Jou","categorie":"nge","status":"loopt","omschrijving":"Detectieonderzoek NGE","bureau":"ExploVision","uitgezetOp":"26-10-2025","verwachtOp":"12-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3p","wpId":"Joure|WP7|DR03|RS Jou","categorie":"houtopstanden","status":"loopt","omschrijving":"Boomeffectanalyse en kapmelding houtopstanden","bureau":"Bureau Waardenburg","uitgezetOp":"4-11-2025","verwachtOp":"23-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3q","wpId":"Joure|WP7|DR03|RS Jou","categorie":"luchtkwaliteit","status":"loopt","omschrijving":"Onderzoek luchtkwaliteit (NIBM-toets)","bureau":"DGMR","uitgezetOp":"9-11-2025","verwachtOp":"8-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3r","wpId":"Joure|WP7|DR03|RS Jou","categorie":"cultuurhistorie","status":"loopt","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"20-10-2025","verwachtOp":"24-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3s","wpId":"Joure|WP7|DR03|RS Jou","categorie":"natura2000","status":"loopt","omschrijving":"Voortoets Natura 2000","bureau":"Bureau Waardenburg","uitgezetOp":"29-10-2025","verwachtOp":"26-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3t","wpId":"Joure|WP8|RS Jou|DR08","categorie":"bodem","status":"loopt","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Hunneman Milieu-advies","uitgezetOp":"4-11-2025","verwachtOp":"24-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3u","wpId":"Joure|WP8|RS Jou|DR08","categorie":"archeologie","status":"loopt","omschrijving":"Bureauonderzoek archeologie","bureau":"ADC ArcheoProjecten","uitgezetOp":"6-11-2025","verwachtOp":"31-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3v","wpId":"Joure|WP8|RS Jou|DR08","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Antea Group","uitgezetOp":"11-10-2025","verwachtOp":"7-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3w","wpId":"Joure|WP8|RS Jou|DR08","categorie":"floraFauna","status":"loopt","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Bureau Waardenburg","uitgezetOp":"26-10-2025","verwachtOp":"16-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3x","wpId":"Joure|WP8|RS Jou|DR08","categorie":"geotechniek","status":"loopt","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"Inpijn-Blokpoel","uitgezetOp":"11-10-2025","verwachtOp":"11-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3y","wpId":"Joure|WP8|RS Jou|DR08","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"30-10-2025","verwachtOp":"7-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-3z","wpId":"Joure|WP8|RS Jou|DR08","categorie":"natura2000","status":"loopt","omschrijving":"Passende beoordeling stikstofdepositie","bureau":"Arcadis Nederland","uitgezetOp":"5-11-2025","verwachtOp":"29-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-40","wpId":"Joure|WP9|DR08|DR09","categorie":"bodem","status":"loopt","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Antea Group","uitgezetOp":"20-10-2025","verwachtOp":"1-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-41","wpId":"Joure|WP9|DR08|DR09","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"Antea Group","uitgezetOp":"25-10-2025","verwachtOp":"7-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-42","wpId":"Joure|WP9|DR08|DR09","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"16-10-2025","verwachtOp":"25-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-43","wpId":"Joure|WP9|DR08|DR09","categorie":"floraFauna","status":"nodig","omschrijving":"Nader onderzoek beschermde soorten","bureau":"","uitgezetOp":"","verwachtOp":"22-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-44","wpId":"Joure|WP9|DR08|DR09","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Antea Group","uitgezetOp":"24-10-2025","verwachtOp":"8-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-45","wpId":"Joure|WP9|DR08|DR09","categorie":"akoestiek","status":"loopt","omschrijving":"Trillingsonderzoek nabijgelegen bebouwing","bureau":"LBP|SIGHT","uitgezetOp":"25-10-2025","verwachtOp":"4-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-46","wpId":"Joure|WP10|DR09|DR10","categorie":"bodem","status":"nodig","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"","uitgezetOp":"","verwachtOp":"14-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-47","wpId":"Joure|WP10|DR09|DR10","categorie":"archeologie","status":"gereed","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"ADC ArcheoProjecten","uitgezetOp":"25-10-2025","verwachtOp":"14-6-2026","opgeleverdOp":"11-6-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-48","wpId":"Joure|WP10|DR09|DR10","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"4-11-2025","verwachtOp":"25-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-49","wpId":"Joure|WP10|DR09|DR10","categorie":"water","status":"gereed","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Sweco Nederland","uitgezetOp":"4-11-2025","verwachtOp":"3-6-2026","opgeleverdOp":"3-6-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4a","wpId":"Joure|WP10|DR09|DR10","categorie":"nge","status":"loopt","omschrijving":"Projectgebonden risicoanalyse NGE","bureau":"REASeuro","uitgezetOp":"25-10-2025","verwachtOp":"15-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4b","wpId":"Joure|WP11|DR10|DR07","categorie":"bodem","status":"uitgezet","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Antea Group","uitgezetOp":"26-10-2025","verwachtOp":"19-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4c","wpId":"Joure|WP11|DR10|DR07","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"25-10-2025","verwachtOp":"28-4-2026","opgeleverdOp":"24-4-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4d","wpId":"Joure|WP11|DR10|DR07","categorie":"floraFauna","status":"gereed","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Els & Linde Ecologie","uitgezetOp":"21-10-2025","verwachtOp":"24-4-2026","opgeleverdOp":"20-4-2026","geldigTot":"20-4-2029","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4e","wpId":"Joure|WP11|DR10|DR07","categorie":"akoestiek","status":"gereed","omschrijving":"Trillingsonderzoek nabijgelegen bebouwing","bureau":"LBP|SIGHT","uitgezetOp":"10-11-2025","verwachtOp":"16-4-2026","opgeleverdOp":"19-4-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4f","wpId":"Joure|WP11|DR10|DR07","categorie":"externeVeiligheid","status":"gereed","omschrijving":"Onderzoek externe veiligheid (groepsrisico)","bureau":"AVIV","uitgezetOp":"20-10-2025","verwachtOp":"25-4-2026","opgeleverdOp":"20-4-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4g","wpId":"Joure|WP12|DR07|DR11","categorie":"bodem","status":"gereed","omschrijving":"Actualiserend bodemonderzoek","bureau":"NIPA Milieutechniek","uitgezetOp":"3-11-2025","verwachtOp":"22-5-2026","opgeleverdOp":"23-5-2026","geldigTot":"23-5-2028","vervolgNodig":true,"vervolgToelichting":"Verkennend onderzoek toont een overschrijding — nader bodemonderzoek nodig.","notitie":""},
  {"id":"oz-seed-4h","wpId":"Joure|WP12|DR07|DR11","categorie":"archeologie","status":"gereed","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"ADC ArcheoProjecten","uitgezetOp":"24-10-2025","verwachtOp":"14-6-2026","opgeleverdOp":"19-6-2026","geldigTot":"","vervolgNodig":true,"vervolgToelichting":"Bureauonderzoek geeft een hoge verwachting — vervolg met inventariserend veldonderzoek (IVO) nodig.","notitie":""},
  {"id":"oz-seed-4i","wpId":"Joure|WP12|DR07|DR11","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"20-10-2025","verwachtOp":"29-4-2026","opgeleverdOp":"26-4-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4j","wpId":"Joure|WP12|DR07|DR11","categorie":"water","status":"loopt","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Sweco Nederland","uitgezetOp":"28-10-2025","verwachtOp":"13-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4k","wpId":"Joure|WP12|DR07|DR11","categorie":"nge","status":"gereed","omschrijving":"Projectgebonden risicoanalyse NGE","bureau":"REASeuro","uitgezetOp":"2-11-2025","verwachtOp":"15-6-2026","opgeleverdOp":"12-6-2026","geldigTot":"12-6-2029","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4l","wpId":"Joure|WP12|DR07|DR11","categorie":"natura2000","status":"gereed","omschrijving":"Stikstofonderzoek AERIUS-berekening","bureau":"Sweco Nederland","uitgezetOp":"3-11-2025","verwachtOp":"8-6-2026","opgeleverdOp":"14-6-2026","geldigTot":"14-6-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4m","wpId":"Joure|WP13|DR11|DR12","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"Hunneman Milieu-advies","uitgezetOp":"11-10-2025","verwachtOp":"28-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4n","wpId":"Joure|WP13|DR11|DR12","categorie":"archeologie","status":"gereed","omschrijving":"Bureauonderzoek archeologie","bureau":"ADC ArcheoProjecten","uitgezetOp":"6-11-2025","verwachtOp":"20-5-2026","opgeleverdOp":"25-5-2026","geldigTot":"","vervolgNodig":true,"vervolgToelichting":"Bureauonderzoek geeft een hoge verwachting — vervolg met inventariserend veldonderzoek (IVO) nodig.","notitie":""},
  {"id":"oz-seed-4o","wpId":"Joure|WP13|DR11|DR12","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"27-10-2025","verwachtOp":"23-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4p","wpId":"Joure|WP13|DR11|DR12","categorie":"floraFauna","status":"gereed","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Bureau Waardenburg","uitgezetOp":"19-10-2025","verwachtOp":"31-5-2026","opgeleverdOp":"29-5-2026","geldigTot":"29-5-2029","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4q","wpId":"Joure|WP13|DR11|DR12","categorie":"geotechniek","status":"gereed","omschrijving":"Sonderingen en grondboringen","bureau":"Inpijn-Blokpoel","uitgezetOp":"25-10-2025","verwachtOp":"9-6-2026","opgeleverdOp":"15-6-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4r","wpId":"Joure|WP13|DR11|DR12","categorie":"water","status":"gereed","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"25-10-2025","verwachtOp":"3-6-2026","opgeleverdOp":"5-6-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4s","wpId":"Joure|WP13|DR11|DR12","categorie":"nge","status":"nodig","omschrijving":"Vooronderzoek niet-gesprongen explosieven (CE-bodembelastingkaart)","bureau":"","uitgezetOp":"","verwachtOp":"16-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4t","wpId":"Joure|WP13|DR11|DR12","categorie":"akoestiek","status":"gereed","omschrijving":"Akoestisch onderzoek bouwfase (geluid)","bureau":"LBP|SIGHT","uitgezetOp":"20-10-2025","verwachtOp":"28-5-2026","opgeleverdOp":"27-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4u","wpId":"Joure|WP13|DR11|DR12","categorie":"luchtkwaliteit","status":"loopt","omschrijving":"Onderzoek luchtkwaliteit (NIBM-toets)","bureau":"DGMR","uitgezetOp":"19-10-2025","verwachtOp":"25-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4v","wpId":"Joure|WP13|DR11|DR12","categorie":"natura2000","status":"gereed","omschrijving":"Stikstofonderzoek AERIUS-berekening","bureau":"Sweco Nederland","uitgezetOp":"30-10-2025","verwachtOp":"20-5-2026","opgeleverdOp":"26-5-2026","geldigTot":"26-5-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4w","wpId":"Joure|WP14|DR12|RS Jou","categorie":"floraFauna","status":"gereed","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Antea Group","uitgezetOp":"12-11-2025","verwachtOp":"1-6-2026","opgeleverdOp":"4-6-2026","geldigTot":"4-6-2029","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4x","wpId":"Joure|WP14|DR12|RS Jou","categorie":"water","status":"uitgezet","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"9-11-2025","verwachtOp":"27-4-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4y","wpId":"Joure|WP14|DR12|RS Jou","categorie":"luchtkwaliteit","status":"gereed","omschrijving":"Onderzoek luchtkwaliteit (NIBM-toets)","bureau":"DGMR","uitgezetOp":"24-10-2025","verwachtOp":"11-5-2026","opgeleverdOp":"10-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-4z","wpId":"Wolvega|WP1-w|OSO1 Wolvega (MSR01???)|MSR02 Stadsburen 16","categorie":"bodem","status":"gereed","omschrijving":"Actualiserend bodemonderzoek","bureau":"Hunneman Milieu-advies","uitgezetOp":"20-11-2024","verwachtOp":"23-10-2025","opgeleverdOp":"18-10-2025","geldigTot":"18-10-2027","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-50","wpId":"Wolvega|WP1-w|OSO1 Wolvega (MSR01???)|MSR02 Stadsburen 16","categorie":"archeologie","status":"gereed","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"Antea Group","uitgezetOp":"5-11-2024","verwachtOp":"7-11-2025","opgeleverdOp":"9-11-2025","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-51","wpId":"Wolvega|WP1-w|OSO1 Wolvega (MSR01???)|MSR02 Stadsburen 16","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"31-10-2024","verwachtOp":"3-11-2025","opgeleverdOp":"9-11-2025","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-52","wpId":"Wolvega|WP1-w|OSO1 Wolvega (MSR01???)|MSR02 Stadsburen 16","categorie":"floraFauna","status":"gereed","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Els & Linde Ecologie","uitgezetOp":"21-10-2024","verwachtOp":"9-11-2025","opgeleverdOp":"14-11-2025","geldigTot":"14-11-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-53","wpId":"Wolvega|WP1-w|OSO1 Wolvega (MSR01???)|MSR02 Stadsburen 16","categorie":"geotechniek","status":"gereed","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"Fugro","uitgezetOp":"31-10-2024","verwachtOp":"29-10-2025","opgeleverdOp":"27-10-2025","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-54","wpId":"Wolvega|WP1-w|OSO1 Wolvega (MSR01???)|MSR02 Stadsburen 16","categorie":"nge","status":"gereed","omschrijving":"Detectieonderzoek NGE","bureau":"ExploVision","uitgezetOp":"30-10-2024","verwachtOp":"26-11-2025","opgeleverdOp":"2-12-2025","geldigTot":"2-12-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-55","wpId":"Wolvega|WP1-w|OSO1 Wolvega (MSR01???)|MSR02 Stadsburen 16","categorie":"cultuurhistorie","status":"gereed","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"13-11-2024","verwachtOp":"1-11-2025","opgeleverdOp":"1-11-2025","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-56","wpId":"Wolvega|WP1-w|OSO1 Wolvega (MSR01???)|MSR02 Stadsburen 16","categorie":"mer","status":"gereed","omschrijving":"M.e.r.-beoordeling gehele tracé/APD","bureau":"Sweco Nederland","uitgezetOp":"10-11-2024","verwachtOp":"21-11-2025","opgeleverdOp":"17-11-2025","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-57","wpId":"Wolvega|WP2-w|MSR02 Stadsburen 16|MSR03 Kooiweg bd Schipsloot MSR","categorie":"bodem","status":"gereed","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Tauw","uitgezetOp":"17-11-2024","verwachtOp":"9-5-2026","opgeleverdOp":"15-5-2026","geldigTot":"15-5-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-58","wpId":"Wolvega|WP2-w|MSR02 Stadsburen 16|MSR03 Kooiweg bd Schipsloot MSR","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"7-11-2024","verwachtOp":"4-6-2026","opgeleverdOp":"31-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-59","wpId":"Wolvega|WP2-w|MSR02 Stadsburen 16|MSR03 Kooiweg bd Schipsloot MSR","categorie":"floraFauna","status":"uitgezet","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Sweco Nederland","uitgezetOp":"28-10-2024","verwachtOp":"16-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5a","wpId":"Wolvega|WP2-w|MSR02 Stadsburen 16|MSR03 Kooiweg bd Schipsloot MSR","categorie":"water","status":"gereed","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Sweco Nederland","uitgezetOp":"11-11-2024","verwachtOp":"8-5-2026","opgeleverdOp":"5-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5b","wpId":"Wolvega|WP2-w|MSR02 Stadsburen 16|MSR03 Kooiweg bd Schipsloot MSR","categorie":"nge","status":"gereed","omschrijving":"Projectgebonden risicoanalyse NGE","bureau":"Saricon","uitgezetOp":"15-11-2024","verwachtOp":"15-5-2026","opgeleverdOp":"21-5-2026","geldigTot":"21-5-2029","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5c","wpId":"Wolvega|WP2-w|MSR02 Stadsburen 16|MSR03 Kooiweg bd Schipsloot MSR","categorie":"houtopstanden","status":"gereed","omschrijving":"Boomeffectanalyse en kapmelding houtopstanden","bureau":"Bureau Waardenburg","uitgezetOp":"4-11-2024","verwachtOp":"17-6-2026","opgeleverdOp":"13-6-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5d","wpId":"Wolvega|WP3-w|MSR03 Kooiweg bd Schipsloot MSR|MSR04 De Weeren 5 iMSR","categorie":"bodem","status":"uitgezet","omschrijving":"Verkennend bodemonderzoek NEN 5740","bureau":"Sweco Nederland","uitgezetOp":"21-11-2024","verwachtOp":"30-4-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5e","wpId":"Wolvega|WP3-w|MSR03 Kooiweg bd Schipsloot MSR|MSR04 De Weeren 5 iMSR","categorie":"archeologie","status":"gereed","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"22-10-2024","verwachtOp":"16-5-2026","opgeleverdOp":"21-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5f","wpId":"Wolvega|WP3-w|MSR03 Kooiweg bd Schipsloot MSR|MSR04 De Weeren 5 iMSR","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"27-10-2024","verwachtOp":"25-5-2026","opgeleverdOp":"25-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5g","wpId":"Wolvega|WP3-w|MSR03 Kooiweg bd Schipsloot MSR|MSR04 De Weeren 5 iMSR","categorie":"floraFauna","status":"gereed","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Els & Linde Ecologie","uitgezetOp":"24-10-2024","verwachtOp":"17-5-2026","opgeleverdOp":"15-5-2026","geldigTot":"15-5-2029","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5h","wpId":"Wolvega|WP3-w|MSR03 Kooiweg bd Schipsloot MSR|MSR04 De Weeren 5 iMSR","categorie":"geotechniek","status":"loopt","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"Fugro","uitgezetOp":"29-10-2024","verwachtOp":"3-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5i","wpId":"Wolvega|WP3-w|MSR03 Kooiweg bd Schipsloot MSR|MSR04 De Weeren 5 iMSR","categorie":"water","status":"gereed","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"11-11-2024","verwachtOp":"9-5-2026","opgeleverdOp":"8-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5j","wpId":"Wolvega|WP3-w|MSR03 Kooiweg bd Schipsloot MSR|MSR04 De Weeren 5 iMSR","categorie":"nge","status":"loopt","omschrijving":"Vooronderzoek niet-gesprongen explosieven (CE-bodembelastingkaart)","bureau":"ExploVision","uitgezetOp":"30-10-2024","verwachtOp":"16-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5k","wpId":"Wolvega|WP3-w|MSR03 Kooiweg bd Schipsloot MSR|MSR04 De Weeren 5 iMSR","categorie":"akoestiek","status":"gereed","omschrijving":"Trillingsonderzoek nabijgelegen bebouwing","bureau":"DGMR","uitgezetOp":"5-11-2024","verwachtOp":"18-5-2026","opgeleverdOp":"22-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5l","wpId":"Wolvega|WP4-w|MSR04 De Weeren 5 iMSR|MSR05 Hoofdweg 59","categorie":"bodem","status":"gereed","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Sweco Nederland","uitgezetOp":"23-10-2024","verwachtOp":"4-5-2026","opgeleverdOp":"2-5-2026","geldigTot":"2-5-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5m","wpId":"Wolvega|WP4-w|MSR04 De Weeren 5 iMSR|MSR05 Hoofdweg 59","categorie":"archeologie","status":"nodig","omschrijving":"Bureauonderzoek archeologie","bureau":"","uitgezetOp":"","verwachtOp":"1-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5n","wpId":"Wolvega|WP4-w|MSR04 De Weeren 5 iMSR|MSR05 Hoofdweg 59","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"24-10-2024","verwachtOp":"12-6-2026","opgeleverdOp":"7-6-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5o","wpId":"Wolvega|WP4-w|MSR04 De Weeren 5 iMSR|MSR05 Hoofdweg 59","categorie":"floraFauna","status":"gereed","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Els & Linde Ecologie","uitgezetOp":"21-11-2024","verwachtOp":"12-6-2026","opgeleverdOp":"12-6-2026","geldigTot":"12-6-2029","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5p","wpId":"Wolvega|WP4-w|MSR04 De Weeren 5 iMSR|MSR05 Hoofdweg 59","categorie":"geotechniek","status":"gereed","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"Inpijn-Blokpoel","uitgezetOp":"18-11-2024","verwachtOp":"16-5-2026","opgeleverdOp":"22-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5q","wpId":"Wolvega|WP4-w|MSR04 De Weeren 5 iMSR|MSR05 Hoofdweg 59","categorie":"houtopstanden","status":"gereed","omschrijving":"Boomeffectanalyse en kapmelding houtopstanden","bureau":"Bureau Waardenburg","uitgezetOp":"5-11-2024","verwachtOp":"18-5-2026","opgeleverdOp":"20-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5r","wpId":"Wolvega|WP4-w|MSR04 De Weeren 5 iMSR|MSR05 Hoofdweg 59","categorie":"cultuurhistorie","status":"gereed","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"Antea Group","uitgezetOp":"15-11-2024","verwachtOp":"3-6-2026","opgeleverdOp":"7-6-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5s","wpId":"Wolvega|WP4-w|MSR04 De Weeren 5 iMSR|MSR05 Hoofdweg 59","categorie":"overig","status":"gereed","omschrijving":"Trillingsmonitoring nabijgelegen funderingen","bureau":"Antea Group","uitgezetOp":"31-10-2024","verwachtOp":"6-5-2026","opgeleverdOp":"10-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5t","wpId":"Wolvega|WP4-w|MSR04 De Weeren 5 iMSR|MSR05 Hoofdweg 59","categorie":"natura2000","status":"gereed","omschrijving":"Voortoets Natura 2000","bureau":"Sweco Nederland","uitgezetOp":"20-10-2024","verwachtOp":"8-5-2026","opgeleverdOp":"13-5-2026","geldigTot":"13-5-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5u","wpId":"Wolvega|WP4-w|MSR05 Hoofdweg 59|MSR06 Kerkeweg 4","categorie":"bodem","status":"uitgezet","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Hunneman Milieu-advies","uitgezetOp":"28-10-2024","verwachtOp":"31-1-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5v","wpId":"Wolvega|WP4-w|MSR05 Hoofdweg 59|MSR06 Kerkeweg 4","categorie":"archeologie","status":"uitgezet","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"ADC ArcheoProjecten","uitgezetOp":"11-11-2024","verwachtOp":"2-3-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5w","wpId":"Wolvega|WP4-w|MSR05 Hoofdweg 59|MSR06 Kerkeweg 4","categorie":"kabelsLeidingen","status":"nodig","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"","uitgezetOp":"","verwachtOp":"10-3-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5x","wpId":"Wolvega|WP4-w|MSR05 Hoofdweg 59|MSR06 Kerkeweg 4","categorie":"geotechniek","status":"gereed","omschrijving":"Sonderingen en grondboringen","bureau":"Fugro","uitgezetOp":"21-10-2024","verwachtOp":"15-3-2026","opgeleverdOp":"19-3-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5y","wpId":"Wolvega|WP4-w|MSR05 Hoofdweg 59|MSR06 Kerkeweg 4","categorie":"nge","status":"gereed","omschrijving":"Vooronderzoek niet-gesprongen explosieven (CE-bodembelastingkaart)","bureau":"REASeuro","uitgezetOp":"10-11-2024","verwachtOp":"25-2-2026","opgeleverdOp":"26-2-2026","geldigTot":"26-2-2029","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-5z","wpId":"Wolvega|WP4-w|MSR05 Hoofdweg 59|MSR06 Kerkeweg 4","categorie":"akoestiek","status":"loopt","omschrijving":"Akoestisch onderzoek bouwfase (geluid)","bureau":"Peutz","uitgezetOp":"10-11-2024","verwachtOp":"1-3-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-60","wpId":"Wolvega|WP4-w|MSR05 Hoofdweg 59|MSR06 Kerkeweg 4","categorie":"asbest","status":"gereed","omschrijving":"Asbestinventarisatie te amoveren opstallen","bureau":"NIPA Milieutechniek","uitgezetOp":"8-11-2024","verwachtOp":"8-2-2026","opgeleverdOp":"7-2-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-61","wpId":"Wolvega|WP4-w|MSR05 Hoofdweg 59|MSR06 Kerkeweg 4","categorie":"overig","status":"gereed","omschrijving":"Trillingsmonitoring nabijgelegen funderingen","bureau":"Antea Group","uitgezetOp":"2-11-2024","verwachtOp":"10-3-2026","opgeleverdOp":"15-3-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-62","wpId":"Wolvega|WP5-w|MSR06 Kerkeweg 4|MSR07 P Stuyvesantweg 109","categorie":"bodem","status":"gereed","omschrijving":"Actualiserend bodemonderzoek","bureau":"NIPA Milieutechniek","uitgezetOp":"21-11-2024","verwachtOp":"21-5-2026","opgeleverdOp":"27-5-2026","geldigTot":"27-5-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-63","wpId":"Wolvega|WP5-w|MSR06 Kerkeweg 4|MSR07 P Stuyvesantweg 109","categorie":"archeologie","status":"gereed","omschrijving":"Bureauonderzoek archeologie","bureau":"Antea Group","uitgezetOp":"21-11-2024","verwachtOp":"28-5-2026","opgeleverdOp":"25-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-64","wpId":"Wolvega|WP5-w|MSR06 Kerkeweg 4|MSR07 P Stuyvesantweg 109","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"22-10-2024","verwachtOp":"29-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-65","wpId":"Wolvega|WP5-w|MSR06 Kerkeweg 4|MSR07 P Stuyvesantweg 109","categorie":"floraFauna","status":"gereed","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Sweco Nederland","uitgezetOp":"6-11-2024","verwachtOp":"29-5-2026","opgeleverdOp":"28-5-2026","geldigTot":"28-5-2029","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-66","wpId":"Wolvega|WP5-w|MSR06 Kerkeweg 4|MSR07 P Stuyvesantweg 109","categorie":"water","status":"nodig","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"","uitgezetOp":"","verwachtOp":"29-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-67","wpId":"Wolvega|WP5-w|MSR06 Kerkeweg 4|MSR07 P Stuyvesantweg 109","categorie":"houtopstanden","status":"gereed","omschrijving":"Boomeffectanalyse en kapmelding houtopstanden","bureau":"Bureau Waardenburg","uitgezetOp":"18-10-2024","verwachtOp":"26-5-2026","opgeleverdOp":"21-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-68","wpId":"Wolvega|WP5-w|MSR06 Kerkeweg 4|MSR07 P Stuyvesantweg 109","categorie":"natura2000","status":"gereed","omschrijving":"Passende beoordeling stikstofdepositie","bureau":"Bureau Waardenburg","uitgezetOp":"14-11-2024","verwachtOp":"9-5-2026","opgeleverdOp":"6-5-2026","geldigTot":"6-5-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-69","wpId":"Wolvega|WP6-w|MSR07 P Stuyvesantweg 109|MSR08 De Meenthe bij 21","categorie":"archeologie","status":"gereed","omschrijving":"Bureauonderzoek archeologie","bureau":"ADC ArcheoProjecten","uitgezetOp":"10-11-2024","verwachtOp":"20-5-2026","opgeleverdOp":"24-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6a","wpId":"Wolvega|WP6-w|MSR07 P Stuyvesantweg 109|MSR08 De Meenthe bij 21","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"4-11-2024","verwachtOp":"7-5-2026","opgeleverdOp":"10-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6b","wpId":"Wolvega|WP6-w|MSR07 P Stuyvesantweg 109|MSR08 De Meenthe bij 21","categorie":"floraFauna","status":"uitgezet","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Els & Linde Ecologie","uitgezetOp":"21-10-2024","verwachtOp":"3-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6c","wpId":"Wolvega|WP6-w|MSR07 P Stuyvesantweg 109|MSR08 De Meenthe bij 21","categorie":"water","status":"gereed","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"31-10-2024","verwachtOp":"6-5-2026","opgeleverdOp":"5-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6d","wpId":"Wolvega|WP6-w|MSR07 P Stuyvesantweg 109|MSR08 De Meenthe bij 21","categorie":"natura2000","status":"gereed","omschrijving":"Passende beoordeling stikstofdepositie","bureau":"Sweco Nederland","uitgezetOp":"9-11-2024","verwachtOp":"25-5-2026","opgeleverdOp":"30-5-2026","geldigTot":"30-5-2028","vervolgNodig":true,"vervolgToelichting":"AERIUS-berekening toont depositie op een nabijgelegen Natura 2000-gebied — vergunning Wnb / passende beoordeling nodig.","notitie":""},
  {"id":"oz-seed-6e","wpId":"Wolvega|WP7-w|MSR08 De Meenthe bij 21|MSR09 Nijksweg 38","categorie":"bodem","status":"gereed","omschrijving":"Verkennend bodemonderzoek NEN 5740","bureau":"Hunneman Milieu-advies","uitgezetOp":"5-11-2024","verwachtOp":"10-5-2026","opgeleverdOp":"13-5-2026","geldigTot":"13-5-2028","vervolgNodig":true,"vervolgToelichting":"Verkennend onderzoek toont een overschrijding — nader bodemonderzoek nodig.","notitie":""},
  {"id":"oz-seed-6f","wpId":"Wolvega|WP7-w|MSR08 De Meenthe bij 21|MSR09 Nijksweg 38","categorie":"archeologie","status":"gereed","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"14-11-2024","verwachtOp":"4-5-2026","opgeleverdOp":"8-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6g","wpId":"Wolvega|WP7-w|MSR08 De Meenthe bij 21|MSR09 Nijksweg 38","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"25-10-2024","verwachtOp":"30-4-2026","opgeleverdOp":"30-4-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6h","wpId":"Wolvega|WP7-w|MSR08 De Meenthe bij 21|MSR09 Nijksweg 38","categorie":"floraFauna","status":"gereed","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Bureau Waardenburg","uitgezetOp":"4-11-2024","verwachtOp":"16-5-2026","opgeleverdOp":"16-5-2026","geldigTot":"16-5-2029","vervolgNodig":true,"vervolgToelichting":"Quickscan wijst op mogelijke vaste rust-/verblijfplaats — nader onderzoek en mogelijk ontheffingsaanvraag Wnb nodig.","notitie":""},
  {"id":"oz-seed-6i","wpId":"Wolvega|WP7-w|MSR08 De Meenthe bij 21|MSR09 Nijksweg 38","categorie":"geotechniek","status":"nodig","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"","uitgezetOp":"","verwachtOp":"30-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6j","wpId":"Wolvega|WP7-w|MSR08 De Meenthe bij 21|MSR09 Nijksweg 38","categorie":"water","status":"gereed","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Antea Group","uitgezetOp":"5-11-2024","verwachtOp":"16-5-2026","opgeleverdOp":"19-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6k","wpId":"Wolvega|WP7-w|MSR08 De Meenthe bij 21|MSR09 Nijksweg 38","categorie":"houtopstanden","status":"gereed","omschrijving":"Boomeffectanalyse en kapmelding houtopstanden","bureau":"Bureau Waardenburg","uitgezetOp":"7-11-2024","verwachtOp":"21-5-2026","opgeleverdOp":"18-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6l","wpId":"Wolvega|WP7-w|MSR08 De Meenthe bij 21|MSR09 Nijksweg 38","categorie":"cultuurhistorie","status":"gereed","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"Antea Group","uitgezetOp":"4-11-2024","verwachtOp":"2-5-2026","opgeleverdOp":"4-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6m","wpId":"Wolvega|WP7-w|MSR08 De Meenthe bij 21|MSR09 Nijksweg 38","categorie":"natura2000","status":"uitgezet","omschrijving":"Voortoets Natura 2000","bureau":"Sweco Nederland","uitgezetOp":"18-10-2024","verwachtOp":"26-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6n","wpId":"Wolvega|WP8-w|MSR09 Nijksweg 38|Eindmof","categorie":"bodem","status":"uitgezet","omschrijving":"Verkennend bodemonderzoek NEN 5740","bureau":"Sweco Nederland","uitgezetOp":"26-10-2024","verwachtOp":"29-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6o","wpId":"Wolvega|WP8-w|MSR09 Nijksweg 38|Eindmof","categorie":"kabelsLeidingen","status":"nodig","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"","uitgezetOp":"","verwachtOp":"22-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6p","wpId":"Wolvega|WP8-w|MSR09 Nijksweg 38|Eindmof","categorie":"floraFauna","status":"nodig","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"","uitgezetOp":"","verwachtOp":"6-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6q","wpId":"Wolvega|WP8-w|MSR09 Nijksweg 38|Eindmof","categorie":"geotechniek","status":"loopt","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"Inpijn-Blokpoel","uitgezetOp":"6-11-2024","verwachtOp":"15-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6r","wpId":"Wolvega|WP8-w|MSR09 Nijksweg 38|Eindmof","categorie":"water","status":"gereed","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Antea Group","uitgezetOp":"29-10-2024","verwachtOp":"6-6-2026","opgeleverdOp":"11-6-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6s","wpId":"Wolvega|WP8-w|MSR09 Nijksweg 38|Eindmof","categorie":"houtopstanden","status":"gereed","omschrijving":"Boomeffectanalyse en kapmelding houtopstanden","bureau":"Els & Linde Ecologie","uitgezetOp":"28-10-2024","verwachtOp":"6-5-2026","opgeleverdOp":"2-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6t","wpId":"Wolvega|WP8-w|MSR09 Nijksweg 38|Eindmof","categorie":"natura2000","status":"gereed","omschrijving":"Passende beoordeling stikstofdepositie","bureau":"Bureau Waardenburg","uitgezetOp":"18-11-2024","verwachtOp":"5-6-2026","opgeleverdOp":"1-6-2026","geldigTot":"1-6-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6u","wpId":"Wolvega|WP9-w|MSR03 Kooiweg bd Schipsloot|MSR12 Heerenveenseweg 177 MSR","categorie":"bodem","status":"gereed","omschrijving":"Verkennend bodemonderzoek NEN 5740","bureau":"Hunneman Milieu-advies","uitgezetOp":"25-10-2024","verwachtOp":"22-4-2026","opgeleverdOp":"23-4-2026","geldigTot":"23-4-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6v","wpId":"Wolvega|WP9-w|MSR03 Kooiweg bd Schipsloot|MSR12 Heerenveenseweg 177 MSR","categorie":"archeologie","status":"uitgezet","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"18-11-2024","verwachtOp":"28-3-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6w","wpId":"Wolvega|WP9-w|MSR03 Kooiweg bd Schipsloot|MSR12 Heerenveenseweg 177 MSR","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Antea Group","uitgezetOp":"18-11-2024","verwachtOp":"31-3-2026","opgeleverdOp":"26-3-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6x","wpId":"Wolvega|WP9-w|MSR03 Kooiweg bd Schipsloot|MSR12 Heerenveenseweg 177 MSR","categorie":"floraFauna","status":"gereed","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Antea Group","uitgezetOp":"16-11-2024","verwachtOp":"30-4-2026","opgeleverdOp":"30-4-2026","geldigTot":"30-4-2029","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6y","wpId":"Wolvega|WP9-w|MSR03 Kooiweg bd Schipsloot|MSR12 Heerenveenseweg 177 MSR","categorie":"geotechniek","status":"gereed","omschrijving":"Sonderingen en grondboringen","bureau":"Wiertsema & Partners","uitgezetOp":"28-10-2024","verwachtOp":"18-4-2026","opgeleverdOp":"15-4-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-6z","wpId":"Wolvega|WP9-w|MSR03 Kooiweg bd Schipsloot|MSR12 Heerenveenseweg 177 MSR","categorie":"water","status":"gereed","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"19-11-2024","verwachtOp":"12-4-2026","opgeleverdOp":"18-4-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-70","wpId":"Wolvega|WP9-w|MSR03 Kooiweg bd Schipsloot|MSR12 Heerenveenseweg 177 MSR","categorie":"houtopstanden","status":"uitgezet","omschrijving":"Boomeffectanalyse en kapmelding houtopstanden","bureau":"Els & Linde Ecologie","uitgezetOp":"17-11-2024","verwachtOp":"5-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-71","wpId":"Wolvega|WP10-w|MSR12 Heerenveenseweg 177 MSR|MSR11 Rijksweg A32-1 AC5","categorie":"bodem","status":"gereed","omschrijving":"Actualiserend bodemonderzoek","bureau":"NIPA Milieutechniek","uitgezetOp":"5-11-2024","verwachtOp":"8-5-2026","opgeleverdOp":"12-5-2026","geldigTot":"12-5-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-72","wpId":"Wolvega|WP10-w|MSR12 Heerenveenseweg 177 MSR|MSR11 Rijksweg A32-1 AC5","categorie":"archeologie","status":"gereed","omschrijving":"Bureauonderzoek archeologie","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"12-11-2024","verwachtOp":"8-5-2026","opgeleverdOp":"11-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-73","wpId":"Wolvega|WP10-w|MSR12 Heerenveenseweg 177 MSR|MSR11 Rijksweg A32-1 AC5","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Sweco Nederland","uitgezetOp":"2-11-2024","verwachtOp":"4-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-74","wpId":"Wolvega|WP10-w|MSR12 Heerenveenseweg 177 MSR|MSR11 Rijksweg A32-1 AC5","categorie":"asbest","status":"gereed","omschrijving":"Asbestinventarisatie te amoveren opstallen","bureau":"NIPA Milieutechniek","uitgezetOp":"16-11-2024","verwachtOp":"14-5-2026","opgeleverdOp":"20-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-75","wpId":"Wolvega|WP11-o|OSO1 Wolvega (MSR01???)|MSR11 Heerenveenseweg 173 MSR","categorie":"bodem","status":"loopt","omschrijving":"Verkennend bodemonderzoek NEN 5740","bureau":"Antea Group","uitgezetOp":"7-11-2024","verwachtOp":"30-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-76","wpId":"Wolvega|WP11-o|OSO1 Wolvega (MSR01???)|MSR11 Heerenveenseweg 173 MSR","categorie":"archeologie","status":"loopt","omschrijving":"Bureauonderzoek archeologie","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"20-10-2024","verwachtOp":"15-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-77","wpId":"Wolvega|WP11-o|OSO1 Wolvega (MSR01???)|MSR11 Heerenveenseweg 173 MSR","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Antea Group","uitgezetOp":"18-11-2024","verwachtOp":"17-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-78","wpId":"Wolvega|WP11-o|OSO1 Wolvega (MSR01???)|MSR11 Heerenveenseweg 173 MSR","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Antea Group","uitgezetOp":"18-10-2024","verwachtOp":"28-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-79","wpId":"Wolvega|WP11-o|OSO1 Wolvega (MSR01???)|MSR11 Heerenveenseweg 173 MSR","categorie":"water","status":"loopt","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Sweco Nederland","uitgezetOp":"25-10-2024","verwachtOp":"20-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7a","wpId":"Wolvega|WP11-o|OSO1 Wolvega (MSR01???)|MSR11 Heerenveenseweg 173 MSR","categorie":"cultuurhistorie","status":"loopt","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"7-11-2024","verwachtOp":"14-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7b","wpId":"Wolvega|WP11-o|OSO1 Wolvega (MSR01???)|MSR11 Heerenveenseweg 173 MSR","categorie":"overig","status":"loopt","omschrijving":"Onderzoek grondwaterstanden i.v.m. bemaling","bureau":"Antea Group","uitgezetOp":"23-10-2024","verwachtOp":"20-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7c","wpId":"Wolvega|WP12-o|MSR11 Heerenveenseweg 173 MSR|MSR13 Ruskemadeweg 7","categorie":"bodem","status":"gereed","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Sweco Nederland","uitgezetOp":"19-10-2024","verwachtOp":"1-6-2026","opgeleverdOp":"1-6-2026","geldigTot":"1-6-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7d","wpId":"Wolvega|WP12-o|MSR11 Heerenveenseweg 173 MSR|MSR13 Ruskemadeweg 7","categorie":"archeologie","status":"gereed","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"Antea Group","uitgezetOp":"28-10-2024","verwachtOp":"22-5-2026","opgeleverdOp":"26-5-2026","geldigTot":"","vervolgNodig":true,"vervolgToelichting":"Bureauonderzoek geeft een hoge verwachting — vervolg met inventariserend veldonderzoek (IVO) nodig.","notitie":""},
  {"id":"oz-seed-7e","wpId":"Wolvega|WP12-o|MSR11 Heerenveenseweg 173 MSR|MSR13 Ruskemadeweg 7","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"9-11-2024","verwachtOp":"9-6-2026","opgeleverdOp":"5-6-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7f","wpId":"Wolvega|WP12-o|MSR11 Heerenveenseweg 173 MSR|MSR13 Ruskemadeweg 7","categorie":"floraFauna","status":"nodig","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"","uitgezetOp":"","verwachtOp":"27-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7g","wpId":"Wolvega|WP12-o|MSR11 Heerenveenseweg 173 MSR|MSR13 Ruskemadeweg 7","categorie":"geotechniek","status":"gereed","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"Inpijn-Blokpoel","uitgezetOp":"20-10-2024","verwachtOp":"7-5-2026","opgeleverdOp":"5-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7h","wpId":"Wolvega|WP12-o|MSR11 Heerenveenseweg 173 MSR|MSR13 Ruskemadeweg 7","categorie":"externeVeiligheid","status":"gereed","omschrijving":"Onderzoek externe veiligheid (groepsrisico)","bureau":"Antea Group","uitgezetOp":"22-10-2024","verwachtOp":"11-5-2026","opgeleverdOp":"13-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7i","wpId":"Wolvega|WP12-o|MSR11 Heerenveenseweg 173 MSR|MSR13 Ruskemadeweg 7","categorie":"cultuurhistorie","status":"loopt","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"Antea Group","uitgezetOp":"21-10-2024","verwachtOp":"9-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7j","wpId":"Wolvega|WP12-o|MSR11 Heerenveenseweg 173 MSR|MSR13 Ruskemadeweg 7","categorie":"natura2000","status":"nodig","omschrijving":"Passende beoordeling stikstofdepositie","bureau":"","uitgezetOp":"","verwachtOp":"2-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7k","wpId":"Wolvega|WP13-o|MSR13 Ruskemadeweg 7|MSR14 Stellingenweg 52","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"Hunneman Milieu-advies","uitgezetOp":"21-11-2024","verwachtOp":"9-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7l","wpId":"Wolvega|WP13-o|MSR13 Ruskemadeweg 7|MSR14 Stellingenweg 52","categorie":"archeologie","status":"loopt","omschrijving":"Bureauonderzoek archeologie","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"3-11-2024","verwachtOp":"14-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7m","wpId":"Wolvega|WP13-o|MSR13 Ruskemadeweg 7|MSR14 Stellingenweg 52","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"17-11-2024","verwachtOp":"5-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7n","wpId":"Wolvega|WP13-o|MSR13 Ruskemadeweg 7|MSR14 Stellingenweg 52","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Bureau Waardenburg","uitgezetOp":"10-11-2024","verwachtOp":"16-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7o","wpId":"Wolvega|WP13-o|MSR13 Ruskemadeweg 7|MSR14 Stellingenweg 52","categorie":"nge","status":"loopt","omschrijving":"Vooronderzoek niet-gesprongen explosieven (CE-bodembelastingkaart)","bureau":"ExploVision","uitgezetOp":"2-11-2024","verwachtOp":"24-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7p","wpId":"Wolvega|WP13-o|MSR14 Stellingenweg 52|MSR55 Grotekamp 5","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"ADC ArcheoProjecten","uitgezetOp":"20-10-2024","verwachtOp":"17-12-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7q","wpId":"Wolvega|WP13-o|MSR14 Stellingenweg 52|MSR55 Grotekamp 5","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"11-11-2024","verwachtOp":"20-12-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7r","wpId":"Wolvega|WP13-o|MSR14 Stellingenweg 52|MSR55 Grotekamp 5","categorie":"floraFauna","status":"loopt","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Els & Linde Ecologie","uitgezetOp":"21-11-2024","verwachtOp":"17-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7s","wpId":"Wolvega|WP13-o|MSR14 Stellingenweg 52|MSR55 Grotekamp 5","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Antea Group","uitgezetOp":"7-11-2024","verwachtOp":"29-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7t","wpId":"Wolvega|WP13-o|MSR14 Stellingenweg 52|MSR55 Grotekamp 5","categorie":"nge","status":"nodig","omschrijving":"Projectgebonden risicoanalyse NGE","bureau":"","uitgezetOp":"","verwachtOp":"23-12-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7u","wpId":"Wolvega|WP13-o|MSR14 Stellingenweg 52|MSR55 Grotekamp 5","categorie":"akoestiek","status":"loopt","omschrijving":"Trillingsonderzoek nabijgelegen bebouwing","bureau":"DGMR","uitgezetOp":"12-11-2024","verwachtOp":"18-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7v","wpId":"Wolvega|WP13-o|MSR14 Stellingenweg 52|MSR55 Grotekamp 5","categorie":"asbest","status":"loopt","omschrijving":"Asbestinventarisatie te amoveren opstallen","bureau":"NIPA Milieutechniek","uitgezetOp":"16-11-2024","verwachtOp":"16-12-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7w","wpId":"Wolvega|WP14-o|MSR16 Steggerdaweg 90|MSR17 Pepergaweg bij 144","categorie":"bodem","status":"gereed","omschrijving":"Verkennend bodemonderzoek NEN 5740","bureau":"Sweco Nederland","uitgezetOp":"9-11-2024","verwachtOp":"8-6-2026","opgeleverdOp":"5-6-2026","geldigTot":"5-6-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7x","wpId":"Wolvega|WP14-o|MSR16 Steggerdaweg 90|MSR17 Pepergaweg bij 144","categorie":"archeologie","status":"gereed","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"Antea Group","uitgezetOp":"19-11-2024","verwachtOp":"8-5-2026","opgeleverdOp":"3-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7y","wpId":"Wolvega|WP14-o|MSR16 Steggerdaweg 90|MSR17 Pepergaweg bij 144","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"9-11-2024","verwachtOp":"3-6-2026","opgeleverdOp":"7-6-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-7z","wpId":"Wolvega|WP14-o|MSR16 Steggerdaweg 90|MSR17 Pepergaweg bij 144","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Els & Linde Ecologie","uitgezetOp":"15-11-2024","verwachtOp":"11-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-80","wpId":"Wolvega|WP14-o|MSR16 Steggerdaweg 90|MSR17 Pepergaweg bij 144","categorie":"water","status":"gereed","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"15-11-2024","verwachtOp":"15-5-2026","opgeleverdOp":"10-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-81","wpId":"Wolvega|WP14-o|MSR16 Steggerdaweg 90|MSR17 Pepergaweg bij 144","categorie":"asbest","status":"loopt","omschrijving":"Asbestinventarisatie te amoveren opstallen","bureau":"Hunneman Milieu-advies","uitgezetOp":"17-11-2024","verwachtOp":"7-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-82","wpId":"Wolvega|WP15-o|MSR17 Pepergaweg bij 144|Pepergaweg 11 eindmof","categorie":"bodem","status":"uitgezet","omschrijving":"Actualiserend bodemonderzoek","bureau":"Antea Group","uitgezetOp":"14-11-2024","verwachtOp":"1-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-83","wpId":"Wolvega|WP15-o|MSR17 Pepergaweg bij 144|Pepergaweg 11 eindmof","categorie":"archeologie","status":"nodig","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"","uitgezetOp":"","verwachtOp":"9-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-84","wpId":"Wolvega|WP15-o|MSR17 Pepergaweg bij 144|Pepergaweg 11 eindmof","categorie":"kabelsLeidingen","status":"gereed","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Antea Group","uitgezetOp":"26-10-2024","verwachtOp":"26-5-2026","opgeleverdOp":"21-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-85","wpId":"Wolvega|WP15-o|MSR17 Pepergaweg bij 144|Pepergaweg 11 eindmof","categorie":"floraFauna","status":"uitgezet","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Sweco Nederland","uitgezetOp":"2-11-2024","verwachtOp":"15-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-86","wpId":"Wolvega|WP15-o|MSR17 Pepergaweg bij 144|Pepergaweg 11 eindmof","categorie":"externeVeiligheid","status":"uitgezet","omschrijving":"Onderzoek externe veiligheid (groepsrisico)","bureau":"Antea Group","uitgezetOp":"5-11-2024","verwachtOp":"12-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-87","wpId":"Wolvega|WP16-c|OSO1 Wolvega (MSR01???)|MSR25 ad Schipsloot 18 to","categorie":"bodem","status":"loopt","omschrijving":"Verkennend bodemonderzoek NEN 5740","bureau":"Tauw","uitgezetOp":"18-10-2024","verwachtOp":"12-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-88","wpId":"Wolvega|WP16-c|OSO1 Wolvega (MSR01???)|MSR25 ad Schipsloot 18 to","categorie":"archeologie","status":"loopt","omschrijving":"Bureauonderzoek archeologie","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"1-11-2024","verwachtOp":"21-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-89","wpId":"Wolvega|WP16-c|OSO1 Wolvega (MSR01???)|MSR25 ad Schipsloot 18 to","categorie":"floraFauna","status":"loopt","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Sweco Nederland","uitgezetOp":"10-11-2024","verwachtOp":"2-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8a","wpId":"Wolvega|WP16-c|OSO1 Wolvega (MSR01???)|MSR25 ad Schipsloot 18 to","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Sweco Nederland","uitgezetOp":"26-10-2024","verwachtOp":"4-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8b","wpId":"Wolvega|WP16-c|OSO1 Wolvega (MSR01???)|MSR25 ad Schipsloot 18 to","categorie":"nge","status":"loopt","omschrijving":"Projectgebonden risicoanalyse NGE","bureau":"Saricon","uitgezetOp":"25-10-2024","verwachtOp":"20-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8c","wpId":"Wolvega|WP16-c|OSO1 Wolvega (MSR01???)|MSR25 ad Schipsloot 18 to","categorie":"akoestiek","status":"loopt","omschrijving":"Trillingsonderzoek nabijgelegen bebouwing","bureau":"Peutz","uitgezetOp":"20-11-2024","verwachtOp":"19-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8d","wpId":"Wolvega|WP16-c|OSO1 Wolvega (MSR01???)|MSR25 ad Schipsloot 18 to","categorie":"luchtkwaliteit","status":"loopt","omschrijving":"Onderzoek luchtkwaliteit (NIBM-toets)","bureau":"Antea Group","uitgezetOp":"18-11-2024","verwachtOp":"2-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8e","wpId":"Wolvega|WP16-c|OSO1 Wolvega (MSR01???)|MSR25 ad Schipsloot 18 to","categorie":"asbest","status":"loopt","omschrijving":"Asbestinventarisatie te amoveren opstallen","bureau":"Hunneman Milieu-advies","uitgezetOp":"10-11-2024","verwachtOp":"2-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8f","wpId":"Wolvega|WP17-c|MSR25 ad Schipsloot 18 to|MSR26 Oppers 102 to","categorie":"bodem","status":"loopt","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"NIPA Milieutechniek","uitgezetOp":"5-11-2024","verwachtOp":"24-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8g","wpId":"Wolvega|WP17-c|MSR25 ad Schipsloot 18 to|MSR26 Oppers 102 to","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"16-11-2024","verwachtOp":"12-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8h","wpId":"Wolvega|WP17-c|MSR25 ad Schipsloot 18 to|MSR26 Oppers 102 to","categorie":"kabelsLeidingen","status":"nodig","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"","uitgezetOp":"","verwachtOp":"14-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8i","wpId":"Wolvega|WP17-c|MSR25 ad Schipsloot 18 to|MSR26 Oppers 102 to","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Sweco Nederland","uitgezetOp":"20-10-2024","verwachtOp":"12-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8j","wpId":"Wolvega|WP17-c|MSR25 ad Schipsloot 18 to|MSR26 Oppers 102 to","categorie":"geotechniek","status":"loopt","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"Fugro","uitgezetOp":"4-11-2024","verwachtOp":"11-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8k","wpId":"Wolvega|WP17-c|MSR25 ad Schipsloot 18 to|MSR26 Oppers 102 to","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Antea Group","uitgezetOp":"30-10-2024","verwachtOp":"3-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8l","wpId":"Wolvega|WP17-c|MSR25 ad Schipsloot 18 to|MSR26 Oppers 102 to","categorie":"houtopstanden","status":"loopt","omschrijving":"Boomeffectanalyse en kapmelding houtopstanden","bureau":"Bureau Waardenburg","uitgezetOp":"4-11-2024","verwachtOp":"18-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8m","wpId":"Wolvega|WP17-c|MSR25 AD Schipsloot 18|MSR65 Schuttevaerstraat 30","categorie":"bodem","status":"gereed","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Hunneman Milieu-advies","uitgezetOp":"18-11-2024","verwachtOp":"18-12-2025","opgeleverdOp":"21-12-2025","geldigTot":"21-12-2027","vervolgNodig":true,"vervolgToelichting":"Verkennend onderzoek toont een overschrijding — nader bodemonderzoek nodig.","notitie":""},
  {"id":"oz-seed-8n","wpId":"Wolvega|WP17-c|MSR25 AD Schipsloot 18|MSR65 Schuttevaerstraat 30","categorie":"archeologie","status":"gereed","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"Antea Group","uitgezetOp":"7-11-2024","verwachtOp":"17-1-2026","opgeleverdOp":"20-1-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8o","wpId":"Wolvega|WP17-c|MSR25 AD Schipsloot 18|MSR65 Schuttevaerstraat 30","categorie":"kabelsLeidingen","status":"nodig","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"","uitgezetOp":"","verwachtOp":"15-12-2025","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8p","wpId":"Wolvega|WP17-c|MSR25 AD Schipsloot 18|MSR65 Schuttevaerstraat 30","categorie":"floraFauna","status":"gereed","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Sweco Nederland","uitgezetOp":"30-10-2024","verwachtOp":"24-12-2025","opgeleverdOp":"24-12-2025","geldigTot":"24-12-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8q","wpId":"Wolvega|WP17-c|MSR25 AD Schipsloot 18|MSR65 Schuttevaerstraat 30","categorie":"water","status":"uitgezet","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Antea Group","uitgezetOp":"21-11-2024","verwachtOp":"13-1-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8r","wpId":"Wolvega|WP17-c|MSR25 AD Schipsloot 18|MSR65 Schuttevaerstraat 30","categorie":"nge","status":"gereed","omschrijving":"Projectgebonden risicoanalyse NGE","bureau":"REASeuro","uitgezetOp":"1-11-2024","verwachtOp":"12-12-2025","opgeleverdOp":"16-12-2025","geldigTot":"16-12-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8s","wpId":"Wolvega|WP17-c|MSR25 AD Schipsloot 18|MSR65 Schuttevaerstraat 30","categorie":"asbest","status":"gereed","omschrijving":"Asbestinventarisatie te amoveren opstallen","bureau":"NIPA Milieutechniek","uitgezetOp":"22-10-2024","verwachtOp":"11-1-2026","opgeleverdOp":"8-1-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8t","wpId":"Wolvega|WP17-c|MSR25 AD Schipsloot 18|MSR65 Schuttevaerstraat 30","categorie":"cultuurhistorie","status":"gereed","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"21-10-2024","verwachtOp":"4-12-2025","opgeleverdOp":"4-12-2025","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8u","wpId":"Wolvega|WP18-c|MSR26 Oppers 102 to|MSR18 De Meenthe Puccinistraat","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"Hunneman Milieu-advies","uitgezetOp":"1-11-2024","verwachtOp":"17-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8v","wpId":"Wolvega|WP18-c|MSR26 Oppers 102 to|MSR18 De Meenthe Puccinistraat","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"ADC ArcheoProjecten","uitgezetOp":"25-10-2024","verwachtOp":"14-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8w","wpId":"Wolvega|WP18-c|MSR26 Oppers 102 to|MSR18 De Meenthe Puccinistraat","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"13-11-2024","verwachtOp":"8-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8x","wpId":"Wolvega|WP18-c|MSR26 Oppers 102 to|MSR18 De Meenthe Puccinistraat","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Bureau Waardenburg","uitgezetOp":"24-10-2024","verwachtOp":"21-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8y","wpId":"Wolvega|WP18-c|MSR26 Oppers 102 to|MSR18 De Meenthe Puccinistraat","categorie":"water","status":"loopt","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Antea Group","uitgezetOp":"28-10-2024","verwachtOp":"1-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-8z","wpId":"Wolvega|WP18-c|MSR26 Oppers 102 to|MSR18 De Meenthe Puccinistraat","categorie":"houtopstanden","status":"loopt","omschrijving":"Boomeffectanalyse en kapmelding houtopstanden","bureau":"Els & Linde Ecologie","uitgezetOp":"15-11-2024","verwachtOp":"19-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-90","wpId":"Wolvega|WP18-c|MSR26 Oppers 102 to|MSR18 De Meenthe Puccinistraat","categorie":"natura2000","status":"loopt","omschrijving":"Passende beoordeling stikstofdepositie","bureau":"Bureau Waardenburg","uitgezetOp":"9-11-2024","verwachtOp":"18-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-91","wpId":"Wolvega|WP19-c|MSR18 De Meenthe Puccinistraat|MSR19 Koolwitje","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"NIPA Milieutechniek","uitgezetOp":"26-10-2024","verwachtOp":"8-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-92","wpId":"Wolvega|WP19-c|MSR18 De Meenthe Puccinistraat|MSR19 Koolwitje","categorie":"kabelsLeidingen","status":"nodig","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"","uitgezetOp":"","verwachtOp":"3-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-93","wpId":"Wolvega|WP19-c|MSR18 De Meenthe Puccinistraat|MSR19 Koolwitje","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Els & Linde Ecologie","uitgezetOp":"27-10-2024","verwachtOp":"23-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-94","wpId":"Wolvega|WP19-c|MSR18 De Meenthe Puccinistraat|MSR19 Koolwitje","categorie":"geotechniek","status":"loopt","omschrijving":"Sonderingen en grondboringen","bureau":"Fugro","uitgezetOp":"18-10-2024","verwachtOp":"23-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-95","wpId":"Wolvega|WP19-c|MSR18 De Meenthe Puccinistraat|MSR19 Koolwitje","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Sweco Nederland","uitgezetOp":"11-11-2024","verwachtOp":"7-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-96","wpId":"Wolvega|WP19-c|MSR18 De Meenthe Puccinistraat|MSR19 Koolwitje","categorie":"cultuurhistorie","status":"loopt","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"Antea Group","uitgezetOp":"25-10-2024","verwachtOp":"7-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-97","wpId":"Wolvega|WP20-c|MSR19 Koolwitje|,","categorie":"archeologie","status":"loopt","omschrijving":"Bureauonderzoek archeologie","bureau":"Antea Group","uitgezetOp":"3-11-2024","verwachtOp":"2-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-98","wpId":"Wolvega|WP20-c|MSR19 Koolwitje|,","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"Antea Group","uitgezetOp":"6-11-2024","verwachtOp":"16-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-99","wpId":"Wolvega|WP20-c|MSR19 Koolwitje|,","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Sweco Nederland","uitgezetOp":"13-11-2024","verwachtOp":"25-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9a","wpId":"Wolvega|WP20-c|MSR19 Koolwitje|,","categorie":"geotechniek","status":"loopt","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"Fugro","uitgezetOp":"27-10-2024","verwachtOp":"27-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9b","wpId":"Wolvega|WP20-c|MSR19 Koolwitje|,","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Antea Group","uitgezetOp":"8-11-2024","verwachtOp":"28-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9c","wpId":"Wolvega|WP20-c|MSR19 Koolwitje|,","categorie":"nge","status":"loopt","omschrijving":"Detectieonderzoek NGE","bureau":"Saricon","uitgezetOp":"8-11-2024","verwachtOp":"24-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9d","wpId":"Wolvega|WP20-c|MSR19 Koolwitje|,","categorie":"asbest","status":"nodig","omschrijving":"Asbestinventarisatie te amoveren opstallen","bureau":"","uitgezetOp":"","verwachtOp":"26-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9e","wpId":"Wolvega|WP20-c|MSR19 Koolwitje|,","categorie":"cultuurhistorie","status":"loopt","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"Antea Group","uitgezetOp":"16-11-2024","verwachtOp":"23-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9f","wpId":"Wolvega|WP21-c|MSR20 Atlanta ???|OS01 Wolvega (MSR01) ???","categorie":"archeologie","status":"nodig","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"","uitgezetOp":"","verwachtOp":"25-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9g","wpId":"Wolvega|WP21-c|MSR20 Atlanta ???|OS01 Wolvega (MSR01) ???","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"30-10-2024","verwachtOp":"15-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9h","wpId":"Wolvega|WP21-c|MSR20 Atlanta ???|OS01 Wolvega (MSR01) ???","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Bureau Waardenburg","uitgezetOp":"19-10-2024","verwachtOp":"3-11-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9i","wpId":"Wolvega|WP21-c|MSR20 Atlanta ???|OS01 Wolvega (MSR01) ???","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"9-11-2024","verwachtOp":"5-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9j","wpId":"Wolvega|WP21-c|MSR20 Atlanta ???|OS01 Wolvega (MSR01) ???","categorie":"luchtkwaliteit","status":"loopt","omschrijving":"Onderzoek luchtkwaliteit (NIBM-toets)","bureau":"DGMR","uitgezetOp":"9-11-2024","verwachtOp":"26-9-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9k","wpId":"Wolvega|WP21-c|MSR20 Atlanta ???|OS01 Wolvega (MSR01) ???","categorie":"cultuurhistorie","status":"loopt","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"29-10-2024","verwachtOp":"1-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9l","wpId":"Wolvega|WP21-c|MSR20 Atlanta ???|OS01 Wolvega (MSR01) ???","categorie":"natura2000","status":"loopt","omschrijving":"Voortoets Natura 2000","bureau":"Sweco Nederland","uitgezetOp":"23-10-2024","verwachtOp":"10-10-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9m","wpId":"Wolvega|WP21-c|MSR20 Atlanta ???|MSR30 Stellingerweg Atlanta ???","categorie":"bodem","status":"gereed","omschrijving":"Verkennend bodemonderzoek NEN 5740","bureau":"Sweco Nederland","uitgezetOp":"8-11-2024","verwachtOp":"1-6-2026","opgeleverdOp":"27-5-2026","geldigTot":"27-5-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9n","wpId":"Wolvega|WP21-c|MSR20 Atlanta ???|MSR30 Stellingerweg Atlanta ???","categorie":"archeologie","status":"gereed","omschrijving":"Bureauonderzoek archeologie","bureau":"ADC ArcheoProjecten","uitgezetOp":"21-10-2024","verwachtOp":"11-5-2026","opgeleverdOp":"11-5-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9o","wpId":"Wolvega|WP21-c|MSR20 Atlanta ???|MSR30 Stellingerweg Atlanta ???","categorie":"kabelsLeidingen","status":"nodig","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"","uitgezetOp":"","verwachtOp":"26-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9p","wpId":"Wolvega|WP21-c|MSR20 Atlanta ???|MSR30 Stellingerweg Atlanta ???","categorie":"floraFauna","status":"gereed","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Sweco Nederland","uitgezetOp":"28-10-2024","verwachtOp":"3-6-2026","opgeleverdOp":"2-6-2026","geldigTot":"2-6-2029","vervolgNodig":true,"vervolgToelichting":"Quickscan wijst op mogelijke vaste rust-/verblijfplaats — nader onderzoek en mogelijk ontheffingsaanvraag Wnb nodig.","notitie":""},
  {"id":"oz-seed-9q","wpId":"Wolvega|WP21-c|MSR20 Atlanta ???|MSR30 Stellingerweg Atlanta ???","categorie":"water","status":"uitgezet","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Sweco Nederland","uitgezetOp":"21-11-2024","verwachtOp":"12-5-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9r","wpId":"Wolvega|WP21-c|MSR20 Atlanta ???|MSR30 Stellingerweg Atlanta ???","categorie":"natura2000","status":"gereed","omschrijving":"Stikstofonderzoek AERIUS-berekening","bureau":"Arcadis Nederland","uitgezetOp":"26-10-2024","verwachtOp":"13-5-2026","opgeleverdOp":"15-5-2026","geldigTot":"15-5-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9s","wpId":"Wolvega|WP17-c|MSR26 Oppers 102|MSR67 Carbonstraat Hoek Platina","categorie":"bodem","status":"gereed","omschrijving":"Actualiserend bodemonderzoek","bureau":"Tauw","uitgezetOp":"8-11-2024","verwachtOp":"29-5-2026","opgeleverdOp":"27-5-2026","geldigTot":"27-5-2028","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9t","wpId":"Wolvega|WP17-c|MSR26 Oppers 102|MSR67 Carbonstraat Hoek Platina","categorie":"archeologie","status":"loopt","omschrijving":"Bureauonderzoek archeologie","bureau":"Antea Group","uitgezetOp":"18-10-2024","verwachtOp":"26-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9u","wpId":"Wolvega|WP17-c|MSR26 Oppers 102|MSR67 Carbonstraat Hoek Platina","categorie":"kabelsLeidingen","status":"nodig","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"","uitgezetOp":"","verwachtOp":"22-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9v","wpId":"Wolvega|WP17-c|MSR26 Oppers 102|MSR67 Carbonstraat Hoek Platina","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Antea Group","uitgezetOp":"7-11-2024","verwachtOp":"7-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9w","wpId":"Wolvega|WP17-c|MSR26 Oppers 102|MSR67 Carbonstraat Hoek Platina","categorie":"nge","status":"uitgezet","omschrijving":"Vooronderzoek niet-gesprongen explosieven (CE-bodembelastingkaart)","bureau":"REASeuro","uitgezetOp":"30-10-2024","verwachtOp":"2-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9x","wpId":"Wolvega|WP17-c|MSR26 Oppers 102|MSR67 Carbonstraat Hoek Platina","categorie":"akoestiek","status":"gereed","omschrijving":"Akoestisch onderzoek bouwfase (geluid)","bureau":"Peutz","uitgezetOp":"21-11-2024","verwachtOp":"10-6-2026","opgeleverdOp":"12-6-2026","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-9y","wpId":"Wolvega|WP17-c|MSR26 Oppers 102|MSR67 Carbonstraat Hoek Platina","categorie":"natura2000","status":"gereed","omschrijving":"Stikstofonderzoek AERIUS-berekening","bureau":"Bureau Waardenburg","uitgezetOp":"18-11-2024","verwachtOp":"31-5-2026","opgeleverdOp":"30-5-2026","geldigTot":"30-5-2028","vervolgNodig":true,"vervolgToelichting":"AERIUS-berekening toont depositie op een nabijgelegen Natura 2000-gebied — vergunning Wnb / passende beoordeling nodig.","notitie":""},
  {"id":"oz-seed-9z","wpId":"Wolvega|WP23-c|MSR69 Oppers 58 Myako BV ???|MSR70 Zilverlaan 77-03 ???","categorie":"bodem","status":"loopt","omschrijving":"Actualiserend bodemonderzoek","bureau":"Antea Group","uitgezetOp":"20-11-2024","verwachtOp":"24-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-a0","wpId":"Wolvega|WP23-c|MSR69 Oppers 58 Myako BV ???|MSR70 Zilverlaan 77-03 ???","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"ADC ArcheoProjecten","uitgezetOp":"22-10-2024","verwachtOp":"23-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-a1","wpId":"Wolvega|WP23-c|MSR69 Oppers 58 Myako BV ???|MSR70 Zilverlaan 77-03 ???","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"20-11-2024","verwachtOp":"3-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-a2","wpId":"Wolvega|WP23-c|MSR69 Oppers 58 Myako BV ???|MSR70 Zilverlaan 77-03 ???","categorie":"floraFauna","status":"loopt","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Bureau Waardenburg","uitgezetOp":"24-10-2024","verwachtOp":"20-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-a3","wpId":"Wolvega|WP23-c|MSR69 Oppers 58 Myako BV ???|MSR70 Zilverlaan 77-03 ???","categorie":"water","status":"loopt","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Antea Group","uitgezetOp":"28-10-2024","verwachtOp":"9-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-a4","wpId":"Wolvega|WP23-c|MSR69 Oppers 58 Myako BV ???|MSR70 Zilverlaan 77-03 ???","categorie":"houtopstanden","status":"loopt","omschrijving":"Boomeffectanalyse en kapmelding houtopstanden","bureau":"Bureau Waardenburg","uitgezetOp":"18-11-2024","verwachtOp":"22-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-a5","wpId":"Wolvega|WP23-c|MSR69 Oppers 58 Myako BV ???|MSR70 Zilverlaan 77-03 ???","categorie":"externeVeiligheid","status":"loopt","omschrijving":"Onderzoek externe veiligheid (groepsrisico)","bureau":"AVIV","uitgezetOp":"21-11-2024","verwachtOp":"27-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-a6","wpId":"Wolvega|WP22-c|OS01 Wolvega ???|MSR84 Hoofdstraat Oost 68-03 ???","categorie":"bodem","status":"nodig","omschrijving":"Actualiserend bodemonderzoek","bureau":"","uitgezetOp":"","verwachtOp":"9-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-a7","wpId":"Wolvega|WP22-c|OS01 Wolvega ???|MSR84 Hoofdstraat Oost 68-03 ???","categorie":"archeologie","status":"loopt","omschrijving":"Bureauonderzoek archeologie","bureau":"ADC ArcheoProjecten","uitgezetOp":"20-10-2024","verwachtOp":"17-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-a8","wpId":"Wolvega|WP22-c|OS01 Wolvega ???|MSR84 Hoofdstraat Oost 68-03 ???","categorie":"kabelsLeidingen","status":"nodig","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"","uitgezetOp":"","verwachtOp":"31-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-a9","wpId":"Wolvega|WP22-c|OS01 Wolvega ???|MSR84 Hoofdstraat Oost 68-03 ???","categorie":"floraFauna","status":"loopt","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Els & Linde Ecologie","uitgezetOp":"13-11-2024","verwachtOp":"27-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-aa","wpId":"Wolvega|WP22-c|OS01 Wolvega ???|MSR84 Hoofdstraat Oost 68-03 ???","categorie":"nge","status":"loopt","omschrijving":"Vooronderzoek niet-gesprongen explosieven (CE-bodembelastingkaart)","bureau":"ExploVision","uitgezetOp":"25-10-2024","verwachtOp":"23-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ab","wpId":"Wolvega|WP22-c|OS01 Wolvega ???|MSR84 Hoofdstraat Oost 68-03 ???","categorie":"akoestiek","status":"loopt","omschrijving":"Akoestisch onderzoek bouwfase (geluid)","bureau":"DGMR","uitgezetOp":"8-11-2024","verwachtOp":"23-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ac","wpId":"Wolvega|WP22-c|OS01 Wolvega ???|MSR84 Hoofdstraat Oost 68-03 ???","categorie":"cultuurhistorie","status":"loopt","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"Antea Group","uitgezetOp":"20-10-2024","verwachtOp":"18-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ad","wpId":"Wolvega|WP22-c|OS01 Wolvega ???|MSR84 Hoofdstraat Oost 68-03 ???","categorie":"natura2000","status":"loopt","omschrijving":"Stikstofonderzoek AERIUS-berekening","bureau":"Sweco Nederland","uitgezetOp":"15-11-2024","verwachtOp":"17-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ae","wpId":"Luinjeberd|WP1|AC5|DR-01","categorie":"bodem","status":"loopt","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"NIPA Milieutechniek","uitgezetOp":"26-12-2025","verwachtOp":"19-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-af","wpId":"Luinjeberd|WP1|AC5|DR-01","categorie":"archeologie","status":"nodig","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"","uitgezetOp":"","verwachtOp":"14-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ag","wpId":"Luinjeberd|WP1|AC5|DR-01","categorie":"kabelsLeidingen","status":"nodig","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"","uitgezetOp":"","verwachtOp":"1-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ah","wpId":"Luinjeberd|WP1|AC5|DR-01","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Antea Group","uitgezetOp":"6-1-2026","verwachtOp":"11-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ai","wpId":"Luinjeberd|WP1|AC5|DR-01","categorie":"water","status":"loopt","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"2-1-2026","verwachtOp":"2-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-aj","wpId":"Luinjeberd|WP1|AC5|DR-01","categorie":"nge","status":"loopt","omschrijving":"Vooronderzoek niet-gesprongen explosieven (CE-bodembelastingkaart)","bureau":"Saricon","uitgezetOp":"9-1-2026","verwachtOp":"11-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ak","wpId":"Luinjeberd|WP1|AC5|DR-01","categorie":"luchtkwaliteit","status":"loopt","omschrijving":"Onderzoek luchtkwaliteit (NIBM-toets)","bureau":"DGMR","uitgezetOp":"5-1-2026","verwachtOp":"3-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-al","wpId":"Luinjeberd|WP1|AC5|DR-01","categorie":"cultuurhistorie","status":"loopt","omschrijving":"Cultuurhistorische en landschappelijke waardenkaart","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"29-12-2025","verwachtOp":"6-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-am","wpId":"Luinjeberd|WP1|AC5|DR-01","categorie":"natura2000","status":"loopt","omschrijving":"Passende beoordeling stikstofdepositie","bureau":"Sweco Nederland","uitgezetOp":"13-1-2026","verwachtOp":"5-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-an","wpId":"Luinjeberd|WP1|AC5|DR-01","categorie":"mer","status":"loopt","omschrijving":"M.e.r.-beoordeling gehele tracé/APD","bureau":"Sweco Nederland","uitgezetOp":"20-1-2026","verwachtOp":"12-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ao","wpId":"Luinjeberd|WP2|DR-01|DR-07","categorie":"bodem","status":"loopt","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Antea Group","uitgezetOp":"5-1-2026","verwachtOp":"5-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ap","wpId":"Luinjeberd|WP2|DR-01|DR-07","categorie":"archeologie","status":"loopt","omschrijving":"Bureauonderzoek archeologie","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"21-1-2026","verwachtOp":"7-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-aq","wpId":"Luinjeberd|WP2|DR-01|DR-07","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"1-1-2026","verwachtOp":"9-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ar","wpId":"Luinjeberd|WP2|DR-01|DR-07","categorie":"floraFauna","status":"loopt","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Sweco Nederland","uitgezetOp":"23-12-2025","verwachtOp":"22-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-as","wpId":"Luinjeberd|WP2|DR-01|DR-07","categorie":"nge","status":"loopt","omschrijving":"Projectgebonden risicoanalyse NGE","bureau":"REASeuro","uitgezetOp":"11-1-2026","verwachtOp":"29-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-at","wpId":"Luinjeberd|WP2|DR-01|DR-07","categorie":"asbest","status":"loopt","omschrijving":"Asbestinventarisatie te amoveren opstallen","bureau":"NIPA Milieutechniek","uitgezetOp":"9-1-2026","verwachtOp":"17-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-au","wpId":"Luinjeberd|WP2|DR-01|DR-07","categorie":"natura2000","status":"loopt","omschrijving":"Stikstofonderzoek AERIUS-berekening","bureau":"Arcadis Nederland","uitgezetOp":"24-12-2025","verwachtOp":"25-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-av","wpId":"Luinjeberd|WP3|DR-07|DR-02","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"11-1-2026","verwachtOp":"6-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-aw","wpId":"Luinjeberd|WP3|DR-07|DR-02","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Eigen beheer (KLIC-melding Kadaster)","uitgezetOp":"22-1-2026","verwachtOp":"27-6-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ax","wpId":"Luinjeberd|WP3|DR-07|DR-02","categorie":"floraFauna","status":"loopt","omschrijving":"Quickscan flora & fauna (Wet natuurbescherming)","bureau":"Bureau Waardenburg","uitgezetOp":"16-1-2026","verwachtOp":"23-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ay","wpId":"Luinjeberd|WP3|DR-07|DR-02","categorie":"geotechniek","status":"loopt","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"Fugro","uitgezetOp":"16-1-2026","verwachtOp":"21-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-az","wpId":"Luinjeberd|WP4|DR-02|MSR 1 001 402","categorie":"bodem","status":"nodig","omschrijving":"Verkennend bodemonderzoek NEN 5740","bureau":"","uitgezetOp":"","verwachtOp":"9-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-b0","wpId":"Luinjeberd|WP4|DR-02|MSR 1 001 402","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — verkennend","bureau":"ADC ArcheoProjecten","uitgezetOp":"8-1-2026","verwachtOp":"14-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-b1","wpId":"Luinjeberd|WP4|DR-02|MSR 1 001 402","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"22-1-2026","verwachtOp":"6-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-b2","wpId":"Luinjeberd|WP4|DR-02|MSR 1 001 402","categorie":"floraFauna","status":"loopt","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Els & Linde Ecologie","uitgezetOp":"1-1-2026","verwachtOp":"5-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-b3","wpId":"Luinjeberd|WP4|DR-02|MSR 1 001 402","categorie":"geotechniek","status":"loopt","omschrijving":"Geotechnisch advies funderingsadvies mof/put","bureau":"Fugro","uitgezetOp":"15-1-2026","verwachtOp":"4-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-b4","wpId":"Luinjeberd|WP4|DR-02|MSR 1 001 402","categorie":"water","status":"loopt","omschrijving":"Watertoets Wetterskip Fryslân","bureau":"Wetterskip Fryslân (vooroverleg)","uitgezetOp":"23-1-2026","verwachtOp":"31-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-b5","wpId":"Luinjeberd|WP4|DR-02|MSR 1 001 402","categorie":"natura2000","status":"loopt","omschrijving":"Passende beoordeling stikstofdepositie","bureau":"Antea Group","uitgezetOp":"3-1-2026","verwachtOp":"12-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-b6","wpId":"Luinjeberd|WP5|MSR 1 001 402|DR-03","categorie":"bodem","status":"loopt","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Sweco Nederland","uitgezetOp":"19-1-2026","verwachtOp":"13-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-b7","wpId":"Luinjeberd|WP5|MSR 1 001 402|DR-03","categorie":"archeologie","status":"loopt","omschrijving":"Bureauonderzoek archeologie","bureau":"ADC ArcheoProjecten","uitgezetOp":"5-1-2026","verwachtOp":"29-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-b8","wpId":"Luinjeberd|WP5|MSR 1 001 402|DR-03","categorie":"kabelsLeidingen","status":"nodig","omschrijving":"Proefsleuven t.b.v. kabels & leidingen","bureau":"","uitgezetOp":"","verwachtOp":"11-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-b9","wpId":"Luinjeberd|WP5|MSR 1 001 402|DR-03","categorie":"floraFauna","status":"loopt","omschrijving":"Ontheffingsaanvraag Wnb soortenbescherming","bureau":"Sweco Nederland","uitgezetOp":"30-12-2025","verwachtOp":"22-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-ba","wpId":"Luinjeberd|WP5|MSR 1 001 402|DR-03","categorie":"geotechniek","status":"loopt","omschrijving":"Sonderingen en grondboringen","bureau":"Fugro","uitgezetOp":"10-1-2026","verwachtOp":"10-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-bb","wpId":"Luinjeberd|WP5|MSR 1 001 402|DR-03","categorie":"water","status":"loopt","omschrijving":"Waterparagraaf en vergunningcheck","bureau":"Sweco Nederland","uitgezetOp":"22-1-2026","verwachtOp":"12-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-bc","wpId":"Luinjeberd|WP5|MSR 1 001 402|DR-03","categorie":"nge","status":"loopt","omschrijving":"Projectgebonden risicoanalyse NGE","bureau":"ExploVision","uitgezetOp":"25-1-2026","verwachtOp":"3-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-bd","wpId":"Luinjeberd|WP5|MSR 1 001 402|DR-03","categorie":"externeVeiligheid","status":"loopt","omschrijving":"Onderzoek externe veiligheid (groepsrisico)","bureau":"AVIV","uitgezetOp":"21-1-2026","verwachtOp":"15-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-be","wpId":"Luinjeberd|WP6|DR-03|DR-04","categorie":"bodem","status":"loopt","omschrijving":"Verkennend onderzoek asbest in bodem (NEN 5707)","bureau":"Tauw","uitgezetOp":"3-1-2026","verwachtOp":"26-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-bf","wpId":"Luinjeberd|WP6|DR-03|DR-04","categorie":"archeologie","status":"loopt","omschrijving":"Inventariserend veldonderzoek (IVO) — karterend","bureau":"RAAP Archeologisch Adviesbureau","uitgezetOp":"5-1-2026","verwachtOp":"20-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-bg","wpId":"Luinjeberd|WP6|DR-03|DR-04","categorie":"kabelsLeidingen","status":"loopt","omschrijving":"KLIC-melding en opsporing kabels & leidingen","bureau":"Antea Group","uitgezetOp":"1-1-2026","verwachtOp":"3-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-bh","wpId":"Luinjeberd|WP6|DR-03|DR-04","categorie":"floraFauna","status":"loopt","omschrijving":"Nader onderzoek beschermde soorten","bureau":"Els & Linde Ecologie","uitgezetOp":"27-12-2025","verwachtOp":"2-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-bi","wpId":"Luinjeberd|WP6|DR-03|DR-04","categorie":"geotechniek","status":"loopt","omschrijving":"Sonderingen en grondboringen","bureau":"Fugro","uitgezetOp":"16-1-2026","verwachtOp":"13-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-bj","wpId":"Luinjeberd|WP6|DR-03|DR-04","categorie":"nge","status":"loopt","omschrijving":"Detectieonderzoek NGE","bureau":"Saricon","uitgezetOp":"24-1-2026","verwachtOp":"27-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-bk","wpId":"Luinjeberd|WP6|DR-03|DR-04","categorie":"externeVeiligheid","status":"nodig","omschrijving":"Onderzoek externe veiligheid (groepsrisico)","bureau":"","uitgezetOp":"","verwachtOp":"3-8-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""},
  {"id":"oz-seed-bl","wpId":"Luinjeberd|WP6|DR-03|DR-04","categorie":"natura2000","status":"loopt","omschrijving":"Stikstofonderzoek AERIUS-berekening","bureau":"Arcadis Nederland","uitgezetOp":"25-1-2026","verwachtOp":"18-7-2026","opgeleverdOp":"","geldigTot":"","vervolgNodig":false,"vervolgToelichting":"","notitie":""}
];

/* ==========================================================================
   Voorbeeld-ZRO's — realistische zakelijk-recht-dossiers passend bij de
   werkpakketten van SEED_WERKPAKKETTEN: grondeigenaren, kadastrale percelen,
   strookmaten, vergoedingen en de verwervingsflow van eerste contact tot
   notarieel passeren (statussen: benaderen → gesprek → akkoord → concept →
   getekend → gepasseerd, plus gedoogplicht). Wordt bij een leeg ZRO-register
   automatisch gekoppeld aan de dan bestaande werkpakketten (zie State.laad
   in app.js) — dus ook na een CSV-herimport met dezelfde wp-id-structuur.
   ========================================================================== */
window.SEED_ZRO = [
  {"id":"zro-seed-1","wpId":"Spannenburg|WP1|RS Tjerkgaast|DR01","type":"zro","status":"gepasseerd","omschrijving":"Transportleiding — weiland Mts. Hoekstra-Visser","bevoegdGezag":"Mts. Hoekstra-Visser","eigenaarAdres":"Gaestdyk 24, Tjerkgaast","eigenaarContact":"06-23456781","pachter":"","kadastraal":"gem. Langweer, sectie C, nr. 812","soortRecht":"opstal","strookBreedte":5,"lengte":260,"vergoedingRecht":3900,"gewasschade":1150,"grondverwerver":"R. Postma (rentmeester)","notaris":"Notariskantoor De Fryske Marren, Joure","verwachtBesluit":"2026-05-01","datumGetekend":"2026-03-12","datumGepasseerd":"2026-05-08","bijzonderheden":"Drainage na aanleg herstellen; afrastering tijdelijk verplaatsen in overleg.","notitie":"Akte ingeschreven bij het Kadaster; vergoeding uitbetaald.","aangevraagd":""},
  {"id":"zro-seed-2","wpId":"Spannenburg|WP2|DR01|DR02","type":"zro","status":"getekend","omschrijving":"Transportleiding — akkerbouwperceel De Jong","bevoegdGezag":"S. de Jong","eigenaarAdres":"Lemsterweg 7, Sint Nicolaasga","eigenaarContact":"06-34567812","pachter":"","kadastraal":"gem. Langweer, sectie D, nrs. 1041 en 1042","soortRecht":"opstal","strookBreedte":5,"lengte":410,"vergoedingRecht":6150,"gewasschade":"","grondverwerver":"R. Postma (rentmeester)","notaris":"Notariskantoor De Fryske Marren, Joure","verwachtBesluit":"2026-08-15","datumGetekend":"2026-06-02","datumGepasseerd":"","bijzonderheden":"Gewasschade (pootaardappelen) na oogst taxeren volgens LTO-normen.","notitie":"Wacht op passeerafspraak notaris.","aangevraagd":""},
  {"id":"zro-seed-3","wpId":"Spannenburg|WP3|DR02|DR03","type":"zro","status":"concept","omschrijving":"Transportleiding — natuurstrook It Fryske Gea","bevoegdGezag":"It Fryske Gea","eigenaarAdres":"Van Harinxmaweg 17, Olterterp","eigenaarContact":"grondzaken@itfryskegea.nl","pachter":"","kadastraal":"gem. Langweer, sectie E, nr. 233","soortRecht":"erfdienstbaarheid","strookBreedte":4,"lengte":180,"vergoedingRecht":2100,"gewasschade":"","grondverwerver":"A. Kamstra","notaris":"","verwachtBesluit":"2026-06-01","datumGetekend":"","datumGepasseerd":"","bijzonderheden":"Werkzaamheden buiten broedseizoen; ecologische begeleiding verplicht.","notitie":"Concept ligt bij hun juridische afdeling — reactie laat op zich wachten, rappel gestuurd.","aangevraagd":""},
  {"id":"zro-seed-4","wpId":"Spannenburg|WP4|DR03|DR04","type":"zro","status":"gesprek","omschrijving":"Transportleiding — melkveebedrijf Bouma","bevoegdGezag":"Mts. Bouma-Terpstra","eigenaarAdres":"Skarren 3, Sint Nicolaasga","eigenaarContact":"06-45678123","pachter":"","kadastraal":"gem. Langweer, sectie D, nr. 566","soortRecht":"opstal","strookBreedte":5,"lengte":325,"vergoedingRecht":"","gewasschade":"","grondverwerver":"R. Postma (rentmeester)","notaris":"","verwachtBesluit":"2026-10-01","datumGetekend":"","datumGepasseerd":"","bijzonderheden":"","notitie":"Tweede keukentafelgesprek gepland; eigenaar wil garantie over draagkracht bouwweg.","aangevraagd":""},
  {"id":"zro-seed-5","wpId":"Spannenburg|WP5|DR04|DR05","type":"zro","status":"akkoord","omschrijving":"Transportleiding — grasland erven Van der Wal","bevoegdGezag":"Erven J. van der Wal","eigenaarAdres":"p/a Boskranne 11, Sloten","eigenaarContact":"06-56781234","pachter":"G. Dijkstra (grasland)","kadastraal":"gem. Sloten, sectie A, nr. 1187","soortRecht":"opstal","strookBreedte":5,"lengte":290,"vergoedingRecht":4350,"gewasschade":900,"grondverwerver":"A. Kamstra","notaris":"Notariskantoor De Fryske Marren, Joure","verwachtBesluit":"2026-09-15","datumGetekend":"","datumGepasseerd":"","bijzonderheden":"Pachtersverklaring G. Dijkstra vereist vóór tekenen.","notitie":"Mondeling akkoord over vergoeding; concept wordt opgesteld.","aangevraagd":""},
  {"id":"zro-seed-6","wpId":"Spannenburg|WP6|DR05|DR06","type":"zro","status":"gedoog","omschrijving":"Transportleiding — perceel Terra Vastgoed BV","bevoegdGezag":"Terra Vastgoed BV","eigenaarAdres":"Postbus 88, Heerenveen","eigenaarContact":"info@terravastgoed.nl","pachter":"","kadastraal":"gem. Langweer, sectie F, nr. 74","soortRecht":"gedoogplicht","strookBreedte":5,"lengte":140,"vergoedingRecht":"","gewasschade":"","grondverwerver":"R. Postma (rentmeester)","notaris":"","verwachtBesluit":"2026-12-01","datumGetekend":"","datumGepasseerd":"","bijzonderheden":"Minnelijk traject vastgelopen (eigenaar eist koop hele perceel); gedoogplichtprocedure Omgevingswet voorbereid.","notitie":"Dossier bij juridische zaken; zienswijzetermijn loopt.","aangevraagd":""},
  {"id":"zro-seed-7","wpId":"Joure|WP1|RS Jou|DR06","type":"zro","status":"benaderen","omschrijving":"Transportleiding — weiland nabij RS Joure","bevoegdGezag":"Mts. Wierda","eigenaarAdres":"Sewei 2, Joure","eigenaarContact":"","pachter":"","kadastraal":"gem. Joure, sectie B, nr. 421","soortRecht":"opstal","strookBreedte":5,"lengte":220,"vergoedingRecht":"","gewasschade":"","grondverwerver":"A. Kamstra","notaris":"","verwachtBesluit":"2026-11-15","datumGetekend":"","datumGepasseerd":"","bijzonderheden":"","notitie":"Eigenaarsgegevens via Kadaster opgevraagd; eerste brief versturen.","aangevraagd":""},
  {"id":"zro-seed-8","wpId":"Joure|WP2|DR06|DR04","type":"zro","status":"gesprek","omschrijving":"Transportleiding — bermstrook gemeente De Fryske Marren","bevoegdGezag":"Gemeente De Fryske Marren","eigenaarAdres":"Herema State 1, Joure","eigenaarContact":"grondzaken@defryskemarren.nl","pachter":"","kadastraal":"gem. Joure, sectie C, nrs. 88 en 91 (ged.)","soortRecht":"gebruik","strookBreedte":3,"lengte":510,"vergoedingRecht":"","gewasschade":"","grondverwerver":"A. Kamstra","notaris":"","verwachtBesluit":"2026-10-15","datumGetekend":"","datumGepasseerd":"","bijzonderheden":"Combineren met AVOI-vergunning; herstraten conform gemeentelijk handboek.","notitie":"","aangevraagd":""},
  {"id":"zro-seed-9","wpId":"Luinjeberd|WP1|AC5|DR-01","type":"zro","status":"getekend","omschrijving":"Distributieleiding — huiskavel Gebr. Kuipers","bevoegdGezag":"Gebr. Kuipers VOF","eigenaarAdres":"Aengwirderweg 141, Luinjeberd","eigenaarContact":"06-67812345","pachter":"","kadastraal":"gem. Aengwirden, sectie B, nr. 953","soortRecht":"opstal","strookBreedte":4,"lengte":175,"vergoedingRecht":2100,"gewasschade":650,"grondverwerver":"R. Postma (rentmeester)","notaris":"Notaris Mr. H. Steenbeek, Heerenveen","verwachtBesluit":"2026-08-01","datumGetekend":"2026-05-28","datumGepasseerd":"","bijzonderheden":"Inrit tijdens aanleg bereikbaar houden.","notitie":"","aangevraagd":""},
  {"id":"zro-seed-10","wpId":"Wolvega|WP1-w|OSO1 Wolvega (MSR01???)|MSR02 Stadsburen 16","type":"zro","status":"concept","omschrijving":"Distributieleiding — tuinstrook Stadsburen","bevoegdGezag":"Fam. R. Oosterhof","eigenaarAdres":"Stadsburen 14, Wolvega","eigenaarContact":"06-78123456","pachter":"","kadastraal":"gem. Wolvega, sectie A, nr. 2276","soortRecht":"kwalitatief","strookBreedte":2.5,"lengte":60,"vergoedingRecht":750,"gewasschade":"","grondverwerver":"A. Kamstra","notaris":"","verwachtBesluit":"2026-09-01","datumGetekend":"","datumGepasseerd":"","bijzonderheden":"Beukenhaag herplanten na aanleg.","notitie":"Concept per post verstuurd, reactie verwacht.","aangevraagd":""},
];

/* ==========================================================================
   Voorbeeldvergunningen — realistische dossiers passend bij de werkpakketten
   van SEED_WERKPAKKETTEN, naar de praktijk van een leidingtracé onder de
   Omgevingswet: watervergunningen (Wetterskip Fryslân), AVOI/instemmings-
   besluiten, Bal-meldingen (bronnering), flora & fauna, wegbeheerders, spoor
   en netbeheerders — met procedure, zaaknummer, behandelaar, leges en de
   besluitflow tot en met onherroepelijk. Wordt bij een leeg vergunningen-
   register automatisch gekoppeld aan de dan bestaande werkpakketten (zie
   State.laad in app.js).
   ========================================================================== */
window.SEED_VERGUNNINGEN = [
  {"id":"vg-seed-1","wpId":"Spannenburg|WP1|RS Tjerkgaast|DR01","type":"water","status":"verleend","omschrijving":"Kruising hoofdwatergang De Ee (gestuurde boring)","bevoegdGezag":"Wetterskip Fryslân","zaaknummer":"WFN-2026-0412","procedure":"regulier","behandelaar":"J. Douma (omgevingsmanager)","aangevraagd":"2026-03-02","verwachtBesluit":"2026-04-27","datumVerleend":"2026-04-24","datumOnherroepelijk":"","leges":"","voorschriften":"Boorplan uiterlijk 3 weken voor uitvoering indienen; geen werkzaamheden in de kernzone bij hoogwater.","notitie":"Bezwaartermijn loopt tot 5-6; geen zienswijzen ontvangen."},
  {"id":"vg-seed-2","wpId":"Spannenburg|WP1|RS Tjerkgaast|DR01","type":"avoi","status":"aangevraagd","omschrijving":"Instemmingsbesluit tracé in gemeentelijke berm","bevoegdGezag":"Gemeente De Fryske Marren","zaaknummer":"DSO-2026-041233","procedure":"regulier","behandelaar":"J. Douma (omgevingsmanager)","aangevraagd":"2026-05-12","verwachtBesluit":"2026-07-07","datumVerleend":"","datumOnherroepelijk":"","leges":1250,"voorschriften":"","notitie":"Vooroverleg gevoerd; degeneratievergoeding conform AVOI-verordening."},
  {"id":"vg-seed-3","wpId":"Spannenburg|WP2|DR01|DR02","type":"melding","status":"aangevraagd","omschrijving":"Bal-melding bronnering en lozing bronneringswater","bevoegdGezag":"Wetterskip Fryslân","zaaknummer":"WFN-2026-0688","procedure":"melding","behandelaar":"S. Veldman (omgevingsmanager)","aangevraagd":"2026-05-20","verwachtBesluit":"2026-06-17","datumVerleend":"","datumOnherroepelijk":"","leges":"","voorschriften":"","notitie":"Debietberekening meegestuurd; retourbemaling waar mogelijk."},
  {"id":"vg-seed-4","wpId":"Spannenburg|WP3|DR02|DR03","type":"natuur","status":"aanvulling","omschrijving":"Ontheffing flora- en fauna-activiteit (vleermuizen, laanbeplanting)","bevoegdGezag":"Provincie Fryslân","zaaknummer":"PF-FF-2026-118","procedure":"uitgebreid","behandelaar":"S. Veldman (omgevingsmanager)","aangevraagd":"2026-02-10","verwachtBesluit":"2026-08-11","datumVerleend":"","datumOnherroepelijk":"","leges":"","voorschriften":"","notitie":"Aanvullingsverzoek: nader vleermuisonderzoek (zomer- en najaarsronde) aanleveren."},
  {"id":"vg-seed-5","wpId":"Spannenburg|WP4|DR03|DR04","type":"omgevingsvergunning","status":"aangevraagd","omschrijving":"Tijdelijk werkterrein en gronddepot (omgevingsplanactiviteit)","bevoegdGezag":"Gemeente De Fryske Marren","zaaknummer":"DSO-2026-038117","procedure":"regulier","behandelaar":"J. Douma (omgevingsmanager)","aangevraagd":"2026-03-16","verwachtBesluit":"2026-05-11","datumVerleend":"","datumOnherroepelijk":"","leges":2380,"voorschriften":"","notitie":"Beslistermijn verstreken — rappel gestuurd, wethouder geïnformeerd via omgevingstafel."},
  {"id":"vg-seed-6","wpId":"Spannenburg|WP5|DR04|DR05","type":"wegbeheerder","status":"voorbereiding","omschrijving":"Ontheffing kruising provinciale weg N354 (gestuurde boring)","bevoegdGezag":"Provincie Fryslân","zaaknummer":"","procedure":"regulier","behandelaar":"J. Douma (omgevingsmanager)","aangevraagd":"","verwachtBesluit":"","datumVerleend":"","datumOnherroepelijk":"","leges":"","voorschriften":"","notitie":"Boorplan en dwarsprofiel in opstelling; vooroverleg gepland."},
  {"id":"vg-seed-7","wpId":"Spannenburg|WP6|DR05|DR06","type":"natura2000","status":"nvt","omschrijving":"Natura 2000-activiteit — voortoets","bevoegdGezag":"Provincie Fryslân","zaaknummer":"","procedure":"","behandelaar":"S. Veldman (omgevingsmanager)","aangevraagd":"","verwachtBesluit":"","datumVerleend":"","datumOnherroepelijk":"","leges":"","voorschriften":"","notitie":"Voortoets: geen significante effecten (AERIUS-berekening onder drempel) — geen vergunning nodig."},
  {"id":"vg-seed-8","wpId":"Joure|WP1|RS Jou|DR06","type":"water","status":"onherroepelijk","omschrijving":"Kruising watergang en werkzaamheden in beschermingszone kade","bevoegdGezag":"Wetterskip Fryslân","zaaknummer":"WFN-2025-1841","procedure":"regulier","behandelaar":"J. Douma (omgevingsmanager)","aangevraagd":"2025-12-08","verwachtBesluit":"2026-02-02","datumVerleend":"2026-02-02","datumOnherroepelijk":"2026-03-16","leges":"","voorschriften":"Kade na aanleg profileren volgens legger; opnames vooraf en achteraf.","notitie":""},
  {"id":"vg-seed-9","wpId":"Joure|WP2|DR06|DR04","type":"avoi","status":"verleend","omschrijving":"Instemmingsbesluit tracé binnen bebouwde kom Joure","bevoegdGezag":"Gemeente De Fryske Marren","zaaknummer":"DSO-2026-044501","procedure":"regulier","behandelaar":"J. Douma (omgevingsmanager)","aangevraagd":"2026-04-14","verwachtBesluit":"2026-06-09","datumVerleend":"2026-06-05","datumOnherroepelijk":"","leges":1250,"voorschriften":"Herstraten conform handboek openbare ruimte; nachtwerk alleen na aparte melding.","notitie":"Bezwaartermijn loopt t/m 17-7."},
  {"id":"vg-seed-10","wpId":"Joure|WP2|DR06|DR04","type":"verkeersbesluit","status":"nodig","omschrijving":"Tijdelijke verkeersmaatregelen en omleiding Sewei","bevoegdGezag":"Gemeente De Fryske Marren","zaaknummer":"","procedure":"","behandelaar":"","aangevraagd":"","verwachtBesluit":"","datumVerleend":"","datumOnherroepelijk":"","leges":"","voorschriften":"","notitie":"Aanvragen zodra uitvoeringsplanning WP2 vaststaat."},
  {"id":"vg-seed-11","wpId":"Luinjeberd|WP1|AC5|DR-01","type":"avoi","status":"aangevraagd","omschrijving":"Instemmingsbesluit tracé Aengwirderweg","bevoegdGezag":"Gemeente Heerenveen","zaaknummer":"HV-2026-07712","procedure":"regulier","behandelaar":"S. Veldman (omgevingsmanager)","aangevraagd":"2026-06-02","verwachtBesluit":"2026-07-28","datumVerleend":"","datumOnherroepelijk":"","leges":980,"voorschriften":"","notitie":""},
  {"id":"vg-seed-12","wpId":"Luinjeberd|WP2|DR-01|DR-07","type":"kap","status":"verleend","omschrijving":"Kapmelding 6 elzen werkstrook (herplantplicht)","bevoegdGezag":"Gemeente Heerenveen","zaaknummer":"HV-2026-06104","procedure":"melding","behandelaar":"S. Veldman (omgevingsmanager)","aangevraagd":"2026-04-07","verwachtBesluit":"2026-05-05","datumVerleend":"2026-05-01","datumOnherroepelijk":"","leges":"","voorschriften":"Herplant 1:1 binnen plangebied, uiterlijk plantseizoen 2026/2027.","notitie":""},
  {"id":"vg-seed-13","wpId":"Wolvega|WP9-w|MSR03 Kooiweg bd Schipsloot|MSR12 Heerenveenseweg 177 MSR","type":"spoor","status":"voorbereiding","omschrijving":"Kruisingsovereenkomst en vergunning spoorkruising Leeuwarden–Zwolle","bevoegdGezag":"ProRail","zaaknummer":"","procedure":"uitgebreid","behandelaar":"J. Douma (omgevingsmanager)","aangevraagd":"","verwachtBesluit":"","datumVerleend":"","datumOnherroepelijk":"","leges":"","voorschriften":"","notitie":"Intake gehad; boorplan volgens OVS00030 aanleveren, doorlooptijd ProRail ± 6 maanden."},
  {"id":"vg-seed-14","wpId":"Wolvega|WP1-w|OSO1 Wolvega (MSR01???)|MSR02 Stadsburen 16","type":"omgevingsvergunning","status":"ontwerpbesluit","omschrijving":"Omgevingsplanactiviteit — afwijking t.b.v. bovengronds afsluiterhuisje","bevoegdGezag":"Gemeente Weststellingwerf","zaaknummer":"WSW-2026-01388","procedure":"uitgebreid","behandelaar":"S. Veldman (omgevingsmanager)","aangevraagd":"2026-01-19","verwachtBesluit":"2026-07-20","datumVerleend":"","datumOnherroepelijk":"","leges":3140,"voorschriften":"","notitie":"Ontwerpbesluit ter inzage t/m 3-7; nog geen zienswijzen."},
  {"id":"vg-seed-15","wpId":"Wolvega|WP2-w|MSR02 Stadsburen 16|MSR03 Kooiweg bd Schipsloot MSR","type":"toestemming","status":"voorbereiding","omschrijving":"Toestemming Liander parallelligging MS-kabel","bevoegdGezag":"Liander","zaaknummer":"","procedure":"","behandelaar":"J. Douma (omgevingsmanager)","aangevraagd":"","verwachtBesluit":"","datumVerleend":"","datumOnherroepelijk":"","leges":"","voorschriften":"","notitie":"Proefsleuven gepland om exacte ligging te bepalen."},
];
