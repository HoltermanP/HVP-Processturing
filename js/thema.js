/* ==========================================================================
   Thema-schakelaar — licht / gedimd / donker.
   De keuze staat als data-theme op <html> (licht = geen attribuut) en wordt
   bewaard in localStorage; index.html zet het attribuut al vóór de eerste
   paint zodat er geen lichtflits is.
   ========================================================================== */
(function () {
  const SLEUTEL = 'nulelie-thema';
  const wortel = document.documentElement;

  function huidig() {
    return wortel.getAttribute('data-theme') || 'light';
  }

  function markeer(thema) {
    document.querySelectorAll('#themaKeuze button').forEach((knop) => {
      knop.classList.toggle('actief', knop.dataset.thema === thema);
    });
  }

  function zet(thema) {
    if (thema === 'light') wortel.removeAttribute('data-theme');
    else wortel.setAttribute('data-theme', thema);
    try { localStorage.setItem(SLEUTEL, thema); } catch (e) { /* privémodus */ }
    markeer(thema);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#themaKeuze button').forEach((knop) => {
      knop.addEventListener('click', () => zet(knop.dataset.thema));
    });
    markeer(huidig());
  });
})();

/* Zijbalk: mobiel in-/uitklappen en de paginatitel in de topbar laten
   meelopen met de actieve tab (ook bij programmatische tabwissels). */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const zijbalk = document.getElementById('zijbalk');
    const schaduw = document.getElementById('zbSchaduw');
    const toggle = document.getElementById('zbToggle');
    const titel = document.getElementById('topbarTitel');
    if (!zijbalk) return;

    const sluit = () => { zijbalk.classList.remove('open'); schaduw.classList.remove('toon'); };
    if (toggle) toggle.addEventListener('click', () => {
      zijbalk.classList.toggle('open');
      schaduw.classList.toggle('toon', zijbalk.classList.contains('open'));
    });
    if (schaduw) schaduw.addEventListener('click', sluit);

    const tabs = [...document.querySelectorAll('.zb-nav .tab')];
    const tabLabel = (t) => [...t.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent).join('').trim();
    const titelSync = () => {
      const actief = document.querySelector('.tab.actief');
      if (actief && titel) titel.textContent = tabLabel(actief) || 'Perceel 1';
    };
    const mo = new MutationObserver(titelSync);
    tabs.forEach((t) => {
      mo.observe(t, { attributes: true, attributeFilter: ['class'] });
      t.addEventListener('click', sluit);
    });
    titelSync();
  });
})();
