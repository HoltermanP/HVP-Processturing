/* ==========================================================================
   AI-client — roept de Vercel /api/rapport-functie aan, die de Anthropic-API
   server-side gebruikt (sleutel als environment variable). De rapporttekst
   wordt als stream teruggelezen zodat de gebruiker live meeleest.
   ========================================================================== */
'use strict';

const AI = (() => {
  // Streamt een rapportage. onDelta(volledigeTekst) wordt per stuk aangeroepen.
  async function genereer({ system, prompt, model, onDelta, signal }) {
    let res;
    try {
      res = await fetch('/api/rapport', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ system, prompt, model }),
        signal,
      });
    } catch (e) {
      throw new Error('Kon de rapport-service niet bereiken. Draait de app op Vercel (met ANTHROPIC_API_KEY)?');
    }

    if (!res.ok) {
      let msg = `Rapport-service gaf foutcode ${res.status}`;
      try {
        const j = await res.json();
        if (j && j.error) msg = j.error;
      } catch {}
      if (res.status === 503) msg = 'De Anthropic-sleutel (ANTHROPIC_API_KEY) is niet ingesteld in Vercel.';
      if (res.status === 404) msg = 'De rapport-service is niet beschikbaar. Deze werkt alleen op Vercel, niet via een lokale statische server.';
      throw new Error(msg);
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let vol = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      vol += dec.decode(value, { stream: true });
      if (onDelta) onDelta(vol);
    }
    // De server sluit een voltooid rapport af met een eindmarkering. Ontbreekt
    // die, dan is de stream onderweg afgebroken (tijdslimiet/verbinding) en
    // zou de tekst anders stilletjes midden in een zin eindigen.
    const KLAAR = '<!--EINDE-->';
    if (vol.includes(KLAAR)) {
      vol = vol.replace(KLAAR, '').trimEnd();
    } else if (vol.trim()) {
      vol = vol.trimEnd() + '\n\n> ⚠️ **De rapportage is afgebroken voordat hij klaar was** (tijdslimiet of verbinding). Probeer het opnieuw; lukt het vaker niet, kies dan onder **Beheer → Instellingen** een sneller model (Sonnet of Haiku).';
    }
    return vol;
  }

  return { genereer };
})();

window.AI = AI;
