/* ==========================================================================
   Datalaag — koppelt de app aan de Neon-database via de Vercel /api-functies,
   met localStorage als offline cache.

   - Bij laden: eerst de lokale cache (snel), daarna proberen we Neon. Lukt dat,
     dan winnen de gegevens uit de database en verversen we de cache.
   - Bij opslaan: meteen naar de cache én (ge-debounced) naar Neon.
   - Zonder verbinding (bijv. lokaal via python http.server) blijft alles werken
     op de cache; de statusindicator toont "Lokaal".
   ========================================================================== */
'use strict';

const CACHE_KEY = 'hvp-processturing-v2';

const DB = (() => {
  let status = 'lokaal';            // 'online' | 'offline' | 'lokaal' | 'bezig'
  let statusListeners = [];
  let pushTimer = null;
  let laatsteSync = null;

  function setStatus(s) {
    status = s;
    statusListeners.forEach((fn) => fn(s, laatsteSync));
  }
  function onStatus(fn) { statusListeners.push(fn); fn(status, laatsteSync); }

  function leesCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); }
    catch { return {}; }
  }
  function schrijfCache(obj) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  }

  // Haal de staat op: lokale cache + (indien beschikbaar) Neon.
  async function laad() {
    const cache = leesCache();
    let staat = {
      werkpakketten: cache.werkpakketten || null,
      voortgang: cache.voortgang || {},
      doorlooptijden: cache.doorlooptijden || {},
      snapshots: cache.snapshots || [],
      instellingen: cache.instellingen || {},
    };
    try {
      setStatus('bezig');
      const r = await fetch('/api/state', { headers: { 'cache-control': 'no-cache' } });
      if (r.ok) {
        const d = await r.json();
        if (d && d._gekoppeld) {
          // Database is leidend wanneer er gegevens in staan.
          if (Array.isArray(d.werkpakketten)) staat.werkpakketten = d.werkpakketten;
          if (d.voortgang) staat.voortgang = d.voortgang;
          if (d.doorlooptijden) staat.doorlooptijden = d.doorlooptijden;
          if (Array.isArray(d.snapshots)) staat.snapshots = d.snapshots;
          if (d.instellingen) staat.instellingen = d.instellingen;
          laatsteSync = d._bijgewerkt || new Date().toISOString();
          schrijfCache(staat);
          setStatus('online');
          return staat;
        }
      }
      setStatus(r.status === 503 ? 'lokaal' : 'offline');
    } catch {
      setStatus('lokaal');
    }
    return staat;
  }

  // Schrijf direct naar de cache; push ge-debounced naar Neon.
  function bewaar(staat) {
    schrijfCache(staat);
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => pushNaarNeon(staat), 900);
  }

  async function pushNaarNeon(staat) {
    try {
      setStatus('bezig');
      const r = await fetch('/api/state', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          werkpakketten: staat.werkpakketten,
          voortgang: staat.voortgang,
          doorlooptijden: staat.doorlooptijden,
          snapshots: staat.snapshots,
          instellingen: staat.instellingen,
        }),
      });
      if (r.ok) {
        const d = await r.json();
        laatsteSync = d.bijgewerkt || new Date().toISOString();
        setStatus('online');
        return true;
      }
      setStatus(r.status === 503 ? 'lokaal' : 'offline');
    } catch {
      setStatus('lokaal');
    }
    return false;
  }

  // Forceer een directe sync (bijv. na import of "wissen").
  async function syncNu(staat) {
    if (pushTimer) clearTimeout(pushTimer);
    return pushNaarNeon(staat);
  }

  async function wisNeon() {
    try {
      const r = await fetch('/api/state', { method: 'DELETE' });
      return r.ok;
    } catch { return false; }
  }

  async function serverStatus() {
    try {
      const r = await fetch('/api/status');
      if (r.ok) return await r.json();
    } catch {}
    return { database: false, ai: false };
  }

  return { laad, bewaar, syncNu, wisNeon, onStatus, serverStatus,
    get status() { return status; }, get laatsteSync() { return laatsteSync; } };
})();

window.DB = DB;
