/* ==========================================================================
   Projectenkaart — Perceel 1 (NuLelie)
   SVG-kaart van het perceel (Zuid-Friesland + Noordoostpolder/Urk) in de stijl
   van de NuLelie-perceelkaart: satellietachtig verkaveld landschap met witte
   omranding en 3D-diepte, per projectgebied een marker met blauwe labelchip.
   Markers van projecten die in de planning staan zijn gekleurd en klikbaar:
   één klik opent het project in het Overzicht. Gebieden zonder geladen
   planning staan er grijs op, zodat het perceel compleet blijft.
   ========================================================================== */
(function () {
  'use strict';

  // Posities in het 760×560-assenstelsel van de kaart (schematisch, geen GPS).
  // x/y = voet van de marker (schijf), lx/ly = middelpunt van het naamlabel.
  const LOCATIES = [
    { id: 'akkrum', label: 'Akkrum', x: 398, y: 150, lx: 398, ly: 96 },
    { id: 'luinjeberd', label: 'Luinjeberd/Gersloot/Tjalleberd', x: 382, y: 172, lx: 424, ly: 118, alias: ['Luinjebert', 'Tjallebert'] },
    { id: 'gorredijk', label: 'Gorredijk/Terwispel/Jubbega/Nieuwehorne', x: 496, y: 142, lx: 564, ly: 96 },
    { id: 'oudehaske', label: 'Oudehaske/Ouwsterhaule/Rotstergaast/Vegelinsoord', x: 352, y: 190, lx: 356, ly: 142, alias: ['Rotstergaast', 'Vegelingsoord'] },
    { id: 'joure', label: 'Joure', x: 330, y: 200, lx: 316, ly: 166 },
    { id: 'heerenveen', label: 'Heerenveen', x: 428, y: 196, lx: 446, ly: 170 },
    { id: 'oldeberkoop', label: 'Oldeberkoop', x: 550, y: 202, lx: 538, ly: 172, alias: ['Olderberkoop'] },
    { id: 'spannenburg', label: 'Spannenburg/Woudsend/St. Nicolaasga', x: 252, y: 214, lx: 218, ly: 184 },
    { id: 'wolvega', label: 'Wolvega', x: 468, y: 258, lx: 474, ly: 230 },
    { id: 'lemmeroost', label: 'Lemmer Oost', x: 302, y: 284, lx: 310, ly: 236 },
    { id: 'lemmerlokaal', label: 'Lemmer lokaal', x: 264, y: 282, lx: 240, ly: 258 },
    { id: 'nopno', label: 'Noordoostpolder NO', x: 358, y: 364, lx: 352, ly: 332 },
    { id: 'espel', label: 'Espel', x: 232, y: 404, lx: 226, ly: 376 },
    { id: 'emmeloord', label: 'Emmeloord', x: 306, y: 416, lx: 306, ly: 386 },
    { id: 'urknoord', label: 'Urk Noord', x: 208, y: 442, lx: 202, ly: 414 },
    { id: 'urkzuid', label: 'Urk Zuid', x: 232, y: 464, lx: 236, ly: 438 },
    { id: 'nagele', label: 'Emmeloord/Nagele/Ens', x: 356, y: 490, lx: 362, ly: 460 },
  ];

  // Zuid-Friesland ("Perceel 1") en Noordoostpolder/Urk als hoekpuntenreeksen,
  // nagetekend op de NuLelie-perceelkaart. De randen krijgen hieronder een
  // fijne, deterministische rafeling zodat de kustlijn getraceerd oogt in
  // plaats van gemodelleerd.
  const VLAK_FRIESLAND = [
    [46, 224], [132, 178], [205, 143], [292, 112], [372, 92], [452, 84],
    [560, 78], [612, 80], [648, 92], [664, 128], [645, 170], [649, 215],
    [623, 262], [588, 306], [528, 330], [458, 326], [396, 332], [330, 320],
    [300, 330], [268, 312], [236, 316], [205, 296], [168, 290], [140, 268],
    [118, 272], [96, 250], [52, 248],
  ];
  const VLAK_POLDER = [
    [196, 352], [258, 338], [322, 330], [388, 338], [428, 352], [448, 398],
    [442, 448], [412, 492], [366, 516], [306, 524], [248, 512], [210, 488],
    [186, 478], [172, 458], [182, 448], [172, 434], [176, 398],
  ];

  // Ruwe kustlijn: elke zijde wordt in korte stukken verdeeld die loodrecht een
  // klein, deterministisch bepaald stukje uitwijken. De hoekige hoofdvorm
  // blijft staan (zoals de strakke dijkranden op de perceelkaart), maar de rand
  // krijgt de grillige detaillering van een echte, getraceerde grens.
  function ruw(punten, stap, amp) {
    const hash = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return (s - Math.floor(s)) * 2 - 1; };
    const uit = [];
    let t = 0;
    for (let i = 0; i < punten.length; i++) {
      const a = punten[i], b = punten[(i + 1) % punten.length];
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const len = Math.hypot(dx, dy) || 1;
      const segs = Math.max(1, Math.round(len / stap));
      const nx = -dy / len, ny = dx / len;
      for (let s = 0; s < segs; s++) {
        const f = s / segs;
        const off = s === 0 ? 0 : hash(t) * amp;   // hoekpunten zelf blijven exact
        uit.push(`${(a[0] + dx * f + nx * off).toFixed(1)} ${(a[1] + dy * f + ny * off).toFixed(1)}`);
        t++;
      }
    }
    return `M ${uit.join(' L ')} Z`;
  }
  const PAD_FRIESLAND = ruw(VLAK_FRIESLAND, 17, 3);
  const PAD_POLDER = ruw(VLAK_POLDER, 20, 1.2);   // polderdijken zijn strak

  // Onregelmatig akkermozaïek: een jittered grid geeft per cel een grillige
  // vierhoek (geen twee gelijk), gevuld uit een luchtfoto-achtig kleurenpalet.
  // Dat oogt als een echte satellietfoto in plaats van een herhalend patroon.
  const VELD_PALET = [
    '#5c7c4c', '#6b8a58', '#4c6a40', '#7a9464', '#899458', '#9c9264',
    '#8f8558', '#748a5a', '#4a6640', '#6f8558', '#948360', '#5f7a52',
  ];
  function veldMozaiek(x0, y0, x1, y1, cel, seed) {
    const hash = (i, j, s) => { const v = Math.sin(i * 127.1 + j * 311.7 + s * 74.7 + seed * 5.3) * 43758.5453; return v - Math.floor(v); };
    const cols = Math.ceil((x1 - x0) / cel), rows = Math.ceil((y1 - y0) / cel);
    const punt = (ix, iy) => [
      x0 + ix * cel + (hash(ix, iy, 1) - 0.5) * cel * 0.65,
      y0 + iy * cel + (hash(ix, iy, 2) - 0.5) * cel * 0.65,
    ];
    let out = '';
    for (let ix = 0; ix < cols; ix++) {
      for (let iy = 0; iy < rows; iy++) {
        const p1 = punt(ix, iy), p2 = punt(ix + 1, iy), p3 = punt(ix + 1, iy + 1), p4 = punt(ix, iy + 1);
        const kleur = VELD_PALET[Math.floor(hash(ix, iy, 3) * VELD_PALET.length)];
        const pts = [p1, p2, p3, p4].map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
        out += `<polygon points="${pts}" fill="${kleur}" stroke="#3e5f35" stroke-width=".4" stroke-opacity=".22"/>`;
      }
    }
    return out;
  }

  /* ------------------------- Koppeling met de planning ------------------- */

  function normeer(s) {
    return String(s || '').toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  }
  function labelDelen(label) {
    return String(label).split(/[\/·,]|\sen\s/).map((t) => t.trim()).filter(Boolean);
  }
  // Kleine spellingsverschillen opvangen (Luinjeberd/Luinjebert, Olde-/Olderberkoop).
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    const m = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) m[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return m[a.length][b.length];
  }
  function locScore(projectNaam, loc) {
    const pn = normeer(projectNaam);
    if (!pn) return 0;
    const kandidaten = [loc.label, ...labelDelen(loc.label), ...(loc.alias || [])];
    let best = 0;
    for (const k of kandidaten) {
      const kn = normeer(k);
      if (!kn) continue;
      if (kn === pn) best = Math.max(best, 3);
      else if (Math.min(kn.length, pn.length) >= 5 && (kn.startsWith(pn) || pn.startsWith(kn))) best = Math.max(best, 2);
      else if (Math.min(kn.length, pn.length) >= 6 && lev(kn, pn) <= 2) best = Math.max(best, 2);
    }
    return best;
  }

  // Wijs elk project uit de planning toe aan zijn beste kaartlocatie.
  function bepaalToewijzing() {
    const projecten = [...new Set(State.werkpakketten.map((w) => w.project))];
    const perLoc = {};   // locId -> { project, score }
    for (const p of projecten) {
      let besteLoc = null, besteScore = 0;
      for (const loc of LOCATIES) {
        const sc = locScore(p, loc);
        if (sc > besteScore) { besteScore = sc; besteLoc = loc; }
      }
      if (besteLoc && (!perLoc[besteLoc.id] || perLoc[besteLoc.id].score < besteScore)) {
        perLoc[besteLoc.id] = { project: p, score: besteScore };
      }
    }
    return perLoc;
  }

  /* ------------------------------ Tekenen --------------------------------- */

  const RISK_KLEUR = { rood: '#ef4444', amber: '#f59e0b', groen: '#0e9f6e' };

  function chipBreedte(tekst) { return Math.max(36, Math.round(tekst.length * 5.7) + 16); }

  // Chips blijven strak blauw-wit zoals op de originele perceelkaart; de
  // risicostatus komt terug als kleur van de rand om de schijf, niet als
  // los stipje in de chip, zodat de chip zelf het plaatje blijft volgen.
  function markerSvg(loc, info) {
    const actief = !!info;
    const discVul = actief ? '#b23269' : '#c9cdd2';
    const discRand = actief ? (info.stats.kritiek ? RISK_KLEUR.rood : info.stats.gevaar ? RISK_KLEUR.amber : RISK_KLEUR.groen) : '#40424a';
    const w = chipBreedte(loc.label);
    const chipX = loc.lx - w / 2, chipY = loc.ly - 9, h = 18;
    return `<g class="kx-marker${actief ? '' : ' uit'}" data-loc="${loc.id}" tabindex="0" role="${actief ? 'button' : 'img'}" aria-label="${htmlEsc(loc.label)}${actief ? ' — klik om project te openen' : ' — nog geen planning geladen'}">
      <line class="kx-stem" x1="${loc.x}" y1="${loc.y - 2}" x2="${loc.lx}" y2="${loc.ly + 9}"></line>
      <ellipse class="kx-disc" cx="${loc.x}" cy="${loc.y}" rx="15" ry="6.2" style="fill:${discVul};stroke:${discRand}"></ellipse>
      <rect class="kx-chip" x="${chipX}" y="${chipY}" width="${w}" height="${h}" rx="9"></rect>
      <text class="kx-chip-txt" x="${loc.lx}" y="${loc.ly + 3.5}" text-anchor="middle">${htmlEsc(loc.label)}</text>
    </g>`;
  }

  // Satellietachtige opmaak: verkaveld akkerpatroon (grillig in Friesland,
  // strakke stroken in de polder), bosjes, meren en snelwegen, met een witte
  // omranding, 3D-zijkant en zachte slagschaduw zoals op de NuLelie-kaart.
  function kaartSvg(perLoc) {
    const markers = [...LOCATIES]
      .map((loc) => ({ loc, info: perLoc[loc.id] ? { project: perLoc[loc.id].project, stats: projectStats(perLoc[loc.id].project) } : null }))
      .sort((a, b) => a.loc.ly - b.loc.ly)
      .map((m) => markerSvg(m.loc, m.info)).join('');
    return `<svg viewBox="0 0 760 560" xmlns="http://www.w3.org/2000/svg" aria-label="Projectenkaart Perceel 1">
      <defs>
        <radialGradient id="kxLicht" cx="0.28" cy="0.16" r="1.05">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".14"/>
          <stop offset=".4" stop-color="#ffffff" stop-opacity="0"/>
          <stop offset="1" stop-color="#0c1710" stop-opacity=".26"/>
        </radialGradient>
        <filter id="kxWaas" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="13"/></filter>
        <filter id="kxZacht" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.6"/></filter>
        <filter id="kxKorrel" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="ruis"/>
          <feColorMatrix in="ruis" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.5 0.5 0.5 0 0"/>
        </filter>
        <clipPath id="kxKlem"><path d="${PAD_FRIESLAND}"/><path d="${PAD_POLDER}"/></clipPath>
      </defs>

      <g filter="url(#kxWaas)" transform="translate(11,32)" opacity=".3">
        <path d="${PAD_FRIESLAND}" fill="#122" opacity=".55"/><path d="${PAD_POLDER}" fill="#122" opacity=".55"/>
      </g>
      <g transform="translate(0,14)">
        <path class="kx-land-diepte" d="${PAD_FRIESLAND}"/><path class="kx-land-diepte" d="${PAD_POLDER}"/>
      </g>
      <path class="kx-land" d="${PAD_FRIESLAND}" fill="#5f7d50"/>
      <path class="kx-land" d="${PAD_POLDER}" fill="#5f7d50"/>

      <g clip-path="url(#kxKlem)" pointer-events="none">
        ${veldMozaiek(20, 70, 670, 340, 20, 1)}
        ${veldMozaiek(160, 335, 460, 535, 18, 2)}
        <rect x="0" y="0" width="760" height="560" fill="#33502e" opacity=".2"/>
        <path filter="url(#kxZacht)" d="M 264 246 C 248 240, 234 252, 238 268 C 242 284, 262 296, 288 296 C 314 296, 336 284, 334 266 C 332 250, 310 240, 292 240 C 282 240, 272 242, 264 246 Z" fill="#182c1a" opacity=".92"/>
        <ellipse filter="url(#kxZacht)" cx="452" cy="214" rx="16" ry="7" fill="#324a2e" opacity=".6"/>
        <ellipse filter="url(#kxZacht)" cx="566" cy="224" rx="18" ry="8" fill="#324a2e" opacity=".6"/>
        <ellipse filter="url(#kxZacht)" cx="300" cy="96" rx="13" ry="6" fill="#324a2e" opacity=".55"/>
        <ellipse filter="url(#kxZacht)" cx="424" cy="374" rx="19" ry="8" fill="#324a2e" opacity=".6"/>
        <ellipse filter="url(#kxZacht)" cx="214" cy="508" rx="14" ry="6" fill="#324a2e" opacity=".55"/>
        <ellipse filter="url(#kxZacht)" cx="118" cy="252" rx="16" ry="7" fill="#324a2e" opacity=".55"/>
        <path d="M 180 244 C 260 220, 330 208, 428 196 C 500 188, 560 172, 622 152" fill="none" stroke="#eef0e4" stroke-width="1.3" opacity=".28"/>
        <path d="M 296 302 C 306 276, 318 246, 330 208" fill="none" stroke="#eef0e4" stroke-width="1.1" opacity=".24"/>
        <path d="M 300 320 C 306 336, 310 352, 308 376 C 306 398, 304 408, 306 416 C 308 442, 326 468, 356 490" fill="none" stroke="#eef0e4" stroke-width="1.3" opacity=".28"/>
        <path d="M 306 416 C 260 420, 224 432, 196 448" fill="none" stroke="#eef0e4" stroke-width="1" opacity=".28"/>
        <rect x="0" y="0" width="760" height="560" fill="#000000" filter="url(#kxKorrel)" opacity=".12"/>
      </g>
      <path d="${PAD_FRIESLAND}" fill="url(#kxLicht)" pointer-events="none"/>
      <path d="${PAD_POLDER}" fill="url(#kxLicht)" pointer-events="none"/>

      <text class="kx-perceel" x="416" y="270">Perceel 1</text>
      <text x="600" y="244" font-size="9.5" fill="#ffffff" opacity=".5" transform="rotate(-33 600 244)">impressie — geen exacte geografie</text>
      ${markers}
    </svg>
    <div class="kaart-tip" id="kaartTip"></div>`;
  }

  function tipHtml(loc, info) {
    if (!info) {
      return `<div class="kt-naam">${htmlEsc(loc.label)}</div>
        <div class="kt-regel">Nog geen planning geladen voor dit projectgebied.</div>
        <div class="kt-regel">Importeer de planning via <b>Beheer</b>.</div>`;
    }
    const s = info.stats;
    const chip = s.kritiek ? `<span class="chip rood">${s.kritiek} kritiek</span>`
      : s.gevaar ? `<span class="chip amber">${s.gevaar} risico</span>`
      : '<span class="chip groen">op koers</span>';
    return `<div class="kt-naam">${htmlEsc(info.project)} ${chip}</div>
      <div class="kt-regel"><b>${s.apds.length}</b> APD’s · <b>${s.aantal}</b> werkpakketten</div>
      <div class="kt-regel"><b>${(s.meters / 1000).toLocaleString('nl-NL', { maximumFractionDigits: 1 })}</b> km nieuw tracé · <b>${s.pct}%</b> voortgang</div>
      ${s.volgende ? `<div class="kt-regel">eerstvolgend: <b>${htmlEsc(s.volgende.mijlpaal.label)}</b> · ${fmtDatum(s.volgende.datum)}</div>` : ''}
      <div class="kt-klik">Klik om het project te openen →</div>`;
  }

  function openProject(project) {
    navPush('overzicht');
    State.filters.project = project;
    State.filters.apd = '';
    State.filters.zoek = '';
    const zoek = el('#filterZoek'); if (zoek) zoek.value = '';
    render();
    toonTab('overzicht');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ------------------------------ Render ---------------------------------- */

  window.renderKaart = function (niveau) {
    const card = el('#kaartKaart');
    if (!card) return;
    // De kaart is het vertrekpunt: alleen op het bovenste niveau (alle projecten).
    const toon = niveau === 'projecten';
    card.style.display = toon ? '' : 'none';
    if (!toon) return;

    const perLoc = bepaalToewijzing();
    const wrap = el('#kaartWrap');
    wrap.innerHTML = kaartSvg(perLoc);

    const aantalActief = Object.keys(perLoc).length;
    el('#kaartLegenda').innerHTML = `
      <span class="leg"><i class="rond" style="background:#c81e6d"></i>In de planning — klik om te openen (${aantalActief})</span>
      <span class="leg"><i class="rond" style="background:#c7ccd2"></i>Nog geen planning geladen</span>
      <span class="leg"><i class="ring" style="background:${RISK_KLEUR.groen}"></i>op koers</span>
      <span class="leg"><i class="ring" style="background:${RISK_KLEUR.amber}"></i>risico</span>
      <span class="leg"><i class="ring" style="background:${RISK_KLEUR.rood}"></i>kritiek</span>`;

    const tip = el('#kaartTip');
    els('#kaartWrap .kx-marker').forEach((g) => {
      const loc = LOCATIES.find((l) => l.id === g.dataset.loc);
      const toew = perLoc[loc.id];
      const info = toew ? { project: toew.project, stats: projectStats(toew.project) } : null;

      const openen = () => {
        if (info) openProject(info.project);
        else toast(`Nog geen planning geladen voor ${loc.label} — importeer de planning via Beheer.`);
      };
      g.addEventListener('click', openen);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openen(); } });

      // Labels staan dicht op elkaar; zet de gehover(st)e marker vóór de rest
      // zodat zijn hele naamchip klikbaar blijft, ook als buren eroverheen vallen.
      const naarVoren = () => g.parentNode.appendChild(g);
      g.addEventListener('mouseenter', () => { naarVoren(); tip.innerHTML = tipHtml(loc, info); tip.classList.add('toon'); });
      g.addEventListener('focus', naarVoren);
      g.addEventListener('mousemove', (e) => {
        const r = wrap.getBoundingClientRect();
        const x = Math.min(e.clientX - r.left + 16, r.width - tip.offsetWidth - 8);
        const y = Math.min(e.clientY - r.top + 14, r.height - tip.offsetHeight - 8);
        tip.style.left = `${Math.max(8, x)}px`;
        tip.style.top = `${Math.max(8, y)}px`;
      });
      g.addEventListener('mouseleave', () => tip.classList.remove('toon'));
    });
  };
})();
