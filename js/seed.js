'use strict';
/* ==========================================================================
   Seed-data — gegenereerd uit "Dashboard HVP CSV.csv" (engineeringsplanning).
   Bevat de werkpakketten van Spannenburg, Joure, Wolvega en Luinjeberd, plus
   de activiteitstatussen (1=gereed, 2=lopend, 3=vertraagd, 4=issue, 5=n.v.t.).
   VERVALLEN-tracdelen en regels zonder planning zijn weggelaten.
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
      "conceptDO": "05-02-2026",
      "onderzoekGereed": "28-05-2026",
      "doNaarUO": "09-07-2026",
      "eindeUO": "20-08-2026",
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
      "conceptDO": "19-02-2026",
      "onderzoekGereed": "11-06-2026",
      "doNaarUO": "23-07-2026",
      "eindeUO": "03-09-2026",
      "contractGereed": "29-10-2026",
      "werkvoorbGereed": "24-12-2026",
      "uitvoeringGereed": "14-01-2027",
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
      "conceptDO": "05-03-2026",
      "onderzoekGereed": "25-06-2026",
      "doNaarUO": "06-08-2026",
      "eindeUO": "17-09-2026",
      "contractGereed": "12-11-2026",
      "werkvoorbGereed": "07-01-2027",
      "uitvoeringGereed": "21-01-2027",
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
      "conceptDO": "19-03-2026",
      "onderzoekGereed": "09-07-2026",
      "doNaarUO": "20-08-2026",
      "eindeUO": "01-10-2026",
      "contractGereed": "26-11-2026",
      "werkvoorbGereed": "21-01-2027",
      "uitvoeringGereed": "04-02-2027",
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
      "conceptDO": "02-04-2026",
      "onderzoekGereed": "23-07-2026",
      "doNaarUO": "03-09-2026",
      "eindeUO": "15-10-2026",
      "contractGereed": "10-12-2026",
      "werkvoorbGereed": "04-02-2027",
      "uitvoeringGereed": "25-02-2027",
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
      "conceptDO": "16-04-2026",
      "onderzoekGereed": "06-08-2026",
      "doNaarUO": "17-09-2026",
      "eindeUO": "29-10-2026",
      "contractGereed": "24-12-2026",
      "werkvoorbGereed": "18-02-2027",
      "uitvoeringGereed": "11-03-2027",
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
      "conceptDO": "30-04-2026",
      "onderzoekGereed": "20-08-2026",
      "doNaarUO": "01-10-2026",
      "eindeUO": "12-11-2026",
      "contractGereed": "07-01-2027",
      "werkvoorbGereed": "04-03-2027",
      "uitvoeringGereed": "29-04-2027",
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
      "conceptDO": "14-05-2026",
      "onderzoekGereed": "03-09-2026",
      "doNaarUO": "15-10-2026",
      "eindeUO": "26-11-2026",
      "contractGereed": "21-01-2027",
      "werkvoorbGereed": "18-03-2027",
      "uitvoeringGereed": "08-04-2027",
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
      "conceptDO": "28-05-2026",
      "onderzoekGereed": "17-09-2026",
      "doNaarUO": "29-10-2026",
      "eindeUO": "10-12-2026",
      "contractGereed": "04-02-2027",
      "werkvoorbGereed": "01-04-2027",
      "uitvoeringGereed": "15-04-2027",
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
      "conceptDO": "11-06-2026",
      "onderzoekGereed": "01-10-2026",
      "doNaarUO": "12-11-2026",
      "eindeUO": "24-12-2026",
      "contractGereed": "18-02-2027",
      "werkvoorbGereed": "15-04-2027",
      "uitvoeringGereed": "06-05-2027",
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
      "conceptDO": "25-06-2026",
      "onderzoekGereed": "15-10-2026",
      "doNaarUO": "26-11-2026",
      "eindeUO": "07-01-2027",
      "contractGereed": "04-03-2027",
      "werkvoorbGereed": "29-04-2027",
      "uitvoeringGereed": "17-06-2027",
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
      "conceptDO": "09-07-2026",
      "onderzoekGereed": "29-10-2026",
      "doNaarUO": "10-12-2026",
      "eindeUO": "21-01-2027",
      "contractGereed": "18-03-2027",
      "werkvoorbGereed": "13-05-2027",
      "uitvoeringGereed": "24-06-2027",
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
      "conceptDO": "23-07-2026",
      "onderzoekGereed": "12-11-2026",
      "doNaarUO": "24-12-2026",
      "eindeUO": "04-02-2027",
      "contractGereed": "01-04-2027",
      "werkvoorbGereed": "27-05-2027",
      "uitvoeringGereed": "03-06-2027",
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
      "conceptDO": "06-08-2026",
      "onderzoekGereed": "26-11-2026",
      "doNaarUO": "07-01-2027",
      "eindeUO": "18-02-2027",
      "contractGereed": "15-04-2027",
      "werkvoorbGereed": "10-06-2027",
      "uitvoeringGereed": "22-07-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "14-07-2026",
      "onderzoekGereed": "03-11-2026",
      "doNaarUO": "15-12-2026",
      "eindeUO": "26-01-2027",
      "contractGereed": "23-03-2027",
      "werkvoorbGereed": "18-05-2027",
      "uitvoeringGereed": "15-06-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "19-05-2026",
      "onderzoekGereed": "08-09-2026",
      "doNaarUO": "20-10-2026",
      "eindeUO": "01-12-2026",
      "contractGereed": "26-01-2027",
      "werkvoorbGereed": "23-03-2027",
      "uitvoeringGereed": "20-04-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "30-06-2026",
      "onderzoekGereed": "20-10-2026",
      "doNaarUO": "01-12-2026",
      "eindeUO": "12-01-2027",
      "contractGereed": "09-03-2027",
      "werkvoorbGereed": "04-05-2027",
      "uitvoeringGereed": "01-06-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "16-06-2026",
      "onderzoekGereed": "06-10-2026",
      "doNaarUO": "17-11-2026",
      "eindeUO": "29-12-2026",
      "contractGereed": "23-02-2027",
      "werkvoorbGereed": "20-04-2027",
      "uitvoeringGereed": "11-05-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "05-05-2026",
      "onderzoekGereed": "25-08-2026",
      "doNaarUO": "06-10-2026",
      "eindeUO": "17-11-2026",
      "contractGereed": "12-01-2027",
      "werkvoorbGereed": "09-03-2027",
      "uitvoeringGereed": "06-04-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "21-04-2026",
      "onderzoekGereed": "11-08-2026",
      "doNaarUO": "22-09-2026",
      "eindeUO": "03-11-2026",
      "contractGereed": "29-12-2026",
      "werkvoorbGereed": "23-02-2027",
      "uitvoeringGereed": "06-04-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "07-04-2026",
      "onderzoekGereed": "28-07-2026",
      "doNaarUO": "08-09-2026",
      "eindeUO": "20-10-2026",
      "contractGereed": "15-12-2026",
      "werkvoorbGereed": "09-02-2027",
      "uitvoeringGereed": "16-03-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "24-03-2026",
      "onderzoekGereed": "14-07-2026",
      "doNaarUO": "25-08-2026",
      "eindeUO": "06-10-2026",
      "contractGereed": "01-12-2026",
      "werkvoorbGereed": "26-01-2027",
      "uitvoeringGereed": "06-04-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "10-03-2026",
      "onderzoekGereed": "30-06-2026",
      "doNaarUO": "11-08-2026",
      "eindeUO": "22-09-2026",
      "contractGereed": "17-11-2026",
      "werkvoorbGereed": "12-01-2027",
      "uitvoeringGereed": "11-05-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "24-02-2026",
      "onderzoekGereed": "16-06-2026",
      "doNaarUO": "28-07-2026",
      "eindeUO": "08-09-2026",
      "contractGereed": "03-11-2026",
      "werkvoorbGereed": "29-12-2026",
      "uitvoeringGereed": "06-04-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "13-01-2026",
      "onderzoekGereed": "05-05-2026",
      "doNaarUO": "16-06-2026",
      "eindeUO": "28-07-2026",
      "contractGereed": "22-09-2026",
      "werkvoorbGereed": "17-11-2026",
      "uitvoeringGereed": "09-03-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "27-01-2026",
      "onderzoekGereed": "19-05-2026",
      "doNaarUO": "30-06-2026",
      "eindeUO": "11-08-2026",
      "contractGereed": "06-10-2026",
      "werkvoorbGereed": "01-12-2026",
      "uitvoeringGereed": "08-06-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "10-02-2026",
      "onderzoekGereed": "02-06-2026",
      "doNaarUO": "14-07-2026",
      "eindeUO": "25-08-2026",
      "contractGereed": "20-10-2026",
      "werkvoorbGereed": "15-12-2026",
      "uitvoeringGereed": "09-03-2027",
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
      "overdrachtVO": "30-09-2025",
      "analyseNaarVO": "28-10-2025",
      "startConceptDO": "02-12-2025",
      "conceptDO": "13-01-2026",
      "onderzoekGereed": "05-05-2026",
      "doNaarUO": "16-06-2026",
      "eindeUO": "28-07-2026",
      "contractGereed": "22-09-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "08-07-2025",
      "onderzoekGereed": "28-10-2025",
      "doNaarUO": "09-12-2025",
      "eindeUO": "20-01-2026",
      "contractGereed": "17-03-2026",
      "werkvoorbGereed": "12-05-2026",
      "uitvoeringGereed": "09-06-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "27-01-2026",
      "onderzoekGereed": "19-05-2026",
      "doNaarUO": "02-06-2026",
      "eindeUO": "14-07-2026",
      "contractGereed": "08-09-2026",
      "werkvoorbGereed": "03-11-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "27-01-2026",
      "onderzoekGereed": "19-05-2026",
      "doNaarUO": "02-06-2026",
      "eindeUO": "14-07-2026",
      "contractGereed": "08-09-2026",
      "werkvoorbGereed": "03-11-2026",
      "uitvoeringGereed": "01-12-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "27-01-2026",
      "onderzoekGereed": "19-05-2026",
      "doNaarUO": "02-06-2026",
      "eindeUO": "14-07-2026",
      "contractGereed": "08-09-2026",
      "werkvoorbGereed": "03-11-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "28-10-2025",
      "onderzoekGereed": "17-02-2026",
      "doNaarUO": "31-03-2026",
      "eindeUO": "12-05-2026",
      "contractGereed": "07-07-2026",
      "werkvoorbGereed": "01-09-2026",
      "uitvoeringGereed": "08-09-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "27-01-2026",
      "onderzoekGereed": "19-05-2026",
      "doNaarUO": "02-06-2026",
      "eindeUO": "14-07-2026",
      "contractGereed": "08-09-2026",
      "werkvoorbGereed": "03-11-2026",
      "uitvoeringGereed": "01-12-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "27-01-2026",
      "onderzoekGereed": "19-05-2026",
      "doNaarUO": "02-06-2026",
      "eindeUO": "14-07-2026",
      "contractGereed": "08-09-2026",
      "werkvoorbGereed": "03-11-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "27-01-2026",
      "onderzoekGereed": "19-05-2026",
      "doNaarUO": "02-06-2026",
      "eindeUO": "14-07-2026",
      "contractGereed": "08-09-2026",
      "werkvoorbGereed": "03-11-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "27-01-2026",
      "onderzoekGereed": "19-05-2026",
      "doNaarUO": "02-06-2026",
      "eindeUO": "14-07-2026",
      "contractGereed": "08-09-2026",
      "werkvoorbGereed": "03-11-2026",
      "uitvoeringGereed": "01-12-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "16-12-2025",
      "onderzoekGereed": "07-04-2026",
      "doNaarUO": "19-05-2026",
      "eindeUO": "30-06-2026",
      "contractGereed": "25-08-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "27-01-2026",
      "onderzoekGereed": "19-05-2026",
      "doNaarUO": "02-06-2026",
      "eindeUO": "14-07-2026",
      "contractGereed": "08-09-2026",
      "werkvoorbGereed": "03-11-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "12-05-2026",
      "onderzoekGereed": "01-09-2026",
      "doNaarUO": "13-10-2026",
      "eindeUO": "24-11-2026",
      "contractGereed": "19-01-2027",
      "werkvoorbGereed": "16-03-2027",
      "uitvoeringGereed": "20-04-2027",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "27-01-2026",
      "onderzoekGereed": "19-05-2026",
      "doNaarUO": "02-06-2026",
      "eindeUO": "14-07-2026",
      "contractGereed": "08-09-2026",
      "werkvoorbGereed": "03-11-2026",
      "uitvoeringGereed": "08-12-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "07-07-2026",
      "onderzoekGereed": "27-10-2026",
      "doNaarUO": "08-12-2026",
      "eindeUO": "19-01-2027",
      "contractGereed": "16-03-2027",
      "werkvoorbGereed": "11-05-2027",
      "uitvoeringGereed": "22-06-2027",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "04-08-2026",
      "onderzoekGereed": "24-11-2026",
      "doNaarUO": "05-01-2027",
      "eindeUO": "16-02-2027",
      "contractGereed": "13-04-2027",
      "werkvoorbGereed": "08-06-2027",
      "uitvoeringGereed": "08-06-2027",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "27-01-2026",
      "onderzoekGereed": "19-05-2026",
      "doNaarUO": "02-06-2026",
      "eindeUO": "14-07-2026",
      "contractGereed": "08-09-2026",
      "werkvoorbGereed": "03-11-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "27-01-2026",
      "onderzoekGereed": "19-05-2026",
      "doNaarUO": "02-06-2026",
      "eindeUO": "14-07-2026",
      "contractGereed": "08-09-2026",
      "werkvoorbGereed": "03-11-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "30-06-2026",
      "onderzoekGereed": "20-10-2026",
      "doNaarUO": "01-12-2026",
      "eindeUO": "12-01-2027",
      "contractGereed": "09-03-2027",
      "werkvoorbGereed": "04-05-2027",
      "uitvoeringGereed": "25-05-2027",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "30-06-2026",
      "onderzoekGereed": "20-10-2026",
      "doNaarUO": "01-12-2026",
      "eindeUO": "12-01-2027",
      "contractGereed": "09-03-2027",
      "werkvoorbGereed": "04-05-2027",
      "uitvoeringGereed": "06-07-2027",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "02-09-2025",
      "onderzoekGereed": "23-12-2025",
      "doNaarUO": "03-02-2026",
      "eindeUO": "17-03-2026",
      "contractGereed": "12-05-2026",
      "werkvoorbGereed": "07-07-2026",
      "uitvoeringGereed": "07-07-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "30-06-2026",
      "onderzoekGereed": "20-10-2026",
      "doNaarUO": "01-12-2026",
      "eindeUO": "12-01-2027",
      "contractGereed": "09-03-2027",
      "werkvoorbGereed": "04-05-2027",
      "uitvoeringGereed": "29-06-2027",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "23-06-2026",
      "onderzoekGereed": "13-10-2026",
      "doNaarUO": "24-11-2026",
      "eindeUO": "05-01-2027",
      "contractGereed": "02-03-2027",
      "werkvoorbGereed": "27-04-2027",
      "uitvoeringGereed": "15-06-2027",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "23-06-2026",
      "onderzoekGereed": "13-10-2026",
      "doNaarUO": "24-11-2026",
      "eindeUO": "05-01-2027",
      "contractGereed": "02-03-2027",
      "werkvoorbGereed": "27-04-2027",
      "uitvoeringGereed": "18-05-2027",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "23-06-2026",
      "onderzoekGereed": "13-10-2026",
      "doNaarUO": "24-11-2026",
      "eindeUO": "05-01-2027",
      "contractGereed": "02-03-2027",
      "werkvoorbGereed": "27-04-2027",
      "uitvoeringGereed": "29-06-2027",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "20-01-2026",
      "onderzoekGereed": "12-05-2026",
      "doNaarUO": "23-06-2026",
      "eindeUO": "04-08-2026",
      "contractGereed": "29-09-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "17-02-2026",
      "onderzoekGereed": "09-06-2026",
      "doNaarUO": "21-07-2026",
      "eindeUO": "01-09-2026",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "17-03-2026",
      "onderzoekGereed": "07-07-2026",
      "doNaarUO": "18-08-2026",
      "eindeUO": "29-09-2026",
      "contractGereed": "24-11-2026",
      "werkvoorbGereed": "19-01-2027",
      "uitvoeringGereed": "19-01-2027",
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
      "overdrachtVO": "08-10-2024",
      "analyseNaarVO": "05-11-2024",
      "startConceptDO": "10-12-2024",
      "conceptDO": "14-04-2026",
      "onderzoekGereed": "04-08-2026",
      "doNaarUO": "15-09-2026",
      "eindeUO": "27-10-2026",
      "contractGereed": "22-12-2026",
      "werkvoorbGereed": "16-02-2027",
      "uitvoeringGereed": "16-02-2027",
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
      "analyseNaarVO": "09-01-2026",
      "startConceptDO": "13-02-2026",
      "conceptDO": "27-03-2026",
      "onderzoekGereed": "17-07-2026",
      "doNaarUO": "28-08-2026",
      "eindeUO": "09-10-2026",
      "contractGereed": "04-12-2026",
      "werkvoorbGereed": "29-01-2027",
      "uitvoeringGereed": "26-02-2027",
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
      "analyseNaarVO": "09-01-2026",
      "startConceptDO": "13-02-2026",
      "conceptDO": "27-03-2026",
      "onderzoekGereed": "17-07-2026",
      "doNaarUO": "28-08-2026",
      "eindeUO": "09-10-2026",
      "contractGereed": "04-12-2026",
      "werkvoorbGereed": "29-01-2027",
      "uitvoeringGereed": "05-03-2027",
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
      "analyseNaarVO": "09-01-2026",
      "startConceptDO": "13-02-2026",
      "conceptDO": "27-03-2026",
      "onderzoekGereed": "17-07-2026",
      "doNaarUO": "28-08-2026",
      "eindeUO": "09-10-2026",
      "contractGereed": "04-12-2026",
      "werkvoorbGereed": "29-01-2027",
      "uitvoeringGereed": "26-02-2027",
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
      "analyseNaarVO": "09-01-2026",
      "startConceptDO": "13-02-2026",
      "conceptDO": "27-03-2026",
      "onderzoekGereed": "17-07-2026",
      "doNaarUO": "28-08-2026",
      "eindeUO": "09-10-2026",
      "contractGereed": "04-12-2026",
      "werkvoorbGereed": "29-01-2027",
      "uitvoeringGereed": "26-02-2027",
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
      "analyseNaarVO": "09-01-2026",
      "startConceptDO": "13-02-2026",
      "conceptDO": "27-03-2026",
      "onderzoekGereed": "17-07-2026",
      "doNaarUO": "28-08-2026",
      "eindeUO": "09-10-2026",
      "contractGereed": "04-12-2026",
      "werkvoorbGereed": "29-01-2027",
      "uitvoeringGereed": "26-02-2027",
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
      "analyseNaarVO": "09-01-2026",
      "startConceptDO": "13-02-2026",
      "conceptDO": "27-03-2026",
      "onderzoekGereed": "17-07-2026",
      "doNaarUO": "28-08-2026",
      "eindeUO": "09-10-2026",
      "contractGereed": "04-12-2026",
      "werkvoorbGereed": "29-01-2027",
      "uitvoeringGereed": "19-02-2027",
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
  "0.01": {
   "status": "gereed"
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
  "0.01": {
   "status": "gereed"
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
  "0.01": {
   "status": "gereed"
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
  "0.01": {
   "status": "gereed"
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
  "0.01": {
   "status": "gereed"
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
  "0.01": {
   "status": "gereed"
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
  "0.01": {
   "status": "gereed"
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
  "0.01": {
   "status": "gereed"
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
  "0.01": {
   "status": "gereed"
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
  "0.01": {
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
  "0.01": {
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
  "1.03.03": {
   "status": "gereed"
  },
  "2.04.01": {
   "status": "gereed"
  },
  "2.02.03": {
   "status": "gereed"
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
  "0.01": {
   "status": "gereed"
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
  "0.01": {
   "status": "gereed"
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
  "0.01": {
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
  "0.01": {
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
   "status": "issue"
  },
  "2.03.04": {
   "status": "issue"
  },
  "2.04.03": {
   "status": "gereed"
  },
  "2.04.04": {
   "status": "vertraagd"
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
  "0.01": {
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
  "2.06.03": {
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
  "0.01": {
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
   "status": "bezig"
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
  "2.06.03": {
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
  "0.01": {
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
   "status": "bezig"
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
  "2.06.03": {
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
  "0.01": {
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
  "0.01": {
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
  "2.06.03": {
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
  "0.01": {
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
  "2.06.03": {
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
  "0.01": {
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
  "2.06.03": {
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
  "0.01": {
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
   "status": "bezig"
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
  "2.06.03": {
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
  "0.01": {
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
   "status": "vertraagd"
  },
  "2.05.01": {
   "status": "issue"
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
  "0.01": {
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
   "status": "bezig"
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
  "2.06.03": {
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
  "0.01": {
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
   "status": "bezig"
  },
  "2.04.03": {
   "status": "issue"
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
  "0.01": {
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
   "status": "bezig"
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
  "2.06.03": {
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
  "0.01": {
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
   "status": "gereed"
  },
  "1.03.03": {
   "status": "issue"
  },
  "2.04.02": {
   "status": "vertraagd"
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
   "status": "bezig"
  },
  "2.04.03": {
   "status": "gereed"
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
  "0.01": {
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
  "0.01": {
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
  "2.06.03": {
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
  "0.01": {
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
   "status": "bezig"
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
  "2.06.03": {
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
  "0.01": {
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
  "0.01": {
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
  "0.01": {
   "status": "nvt"
  },
  "2.03.03": {
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
  "0.01": {
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
  "0.01": {
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
  "0.01": {
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
  "0.01": {
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
  "0.01": {
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
  "0.01": {
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
  "0.01": {
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
  "0.01": {
   "status": "nvt"
  }
 },
 "Luinjeberd|WP1|AC5|DR-01": {
  "0.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "vertraagd"
  },
  "1.04.02": {
   "status": "gereed"
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
  }
 },
 "Luinjeberd|WP2|DR-01|DR-07": {
  "0.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "vertraagd"
  },
  "1.04.02": {
   "status": "gereed"
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
  }
 },
 "Luinjeberd|WP3|DR-07|DR-02": {
  "0.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "vertraagd"
  },
  "1.04.02": {
   "status": "gereed"
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
  }
 },
 "Luinjeberd|WP4|DR-02|MSR 1 001 402": {
  "0.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "vertraagd"
  },
  "1.04.02": {
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
  "2.01.02": {
   "status": "bezig"
  },
  "2.04.03": {
   "status": "gereed"
  }
 },
 "Luinjeberd|WP5|MSR 1 001 402|DR-03": {
  "0.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "vertraagd"
  },
  "1.04.02": {
   "status": "gereed"
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
  }
 },
 "Luinjeberd|WP6|DR-03|DR-04": {
  "0.01": {
   "status": "gereed"
  },
  "1.03.02": {
   "status": "bezig"
  },
  "1.04.04": {
   "status": "vertraagd"
  },
  "1.04.02": {
   "status": "gereed"
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
  }
 }
};
