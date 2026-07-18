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
