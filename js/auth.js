/* ==========================================================================
   Authenticatie & autorisatie.

   - Authenticatie via Clerk (ClerkJS-browser-SDK, buildless via CDN). De
     Publishable Key komt uit de Vercel-env (CLERK_PUBLISHABLE_KEY), geserveerd
     via /api/config, of uit window.CLERK_PUBLISHABLE_KEY (js/config.js, lokaal).
   - Autorisatie (rol + toewijzingen) staat in onze eigen Neon-database
     (State.gebruikers / State.toewijzingen). Clerk zegt WIE je bent; de app
     bepaalt WAT je mag.
   - Handhaving gebeurt in de UI: inloggen verplicht, bewerkrechten per rol/WP.

   Rollen: engineer, omgevingsmanager, projectleider, ontwerpleider, manager.
   Volledige rechten (alles bewerken + toewijzen + accountbeheer): ontwerpleider
   en manager. Overige rollen bewerken alleen hun toegewezen werkpakketten.

   Als er geen Clerk-sleutel is geconfigureerd (bijv. lokaal zonder backend)
   draait de app in "devmodus" zonder login, met volledige rechten — zodat je
   niet buitengesloten raakt voordat Clerk is ingesteld.
   ========================================================================== */
'use strict';

const Auth = (() => {
  const ROLLEN = ['engineer', 'omgevingsmanager', 'projectleider', 'ontwerpleider', 'manager'];
  const ROL_LABELS = {
    engineer: 'Engineer',
    omgevingsmanager: 'Omgevingsmanager',
    projectleider: 'Projectleider',
    ontwerpleider: 'Ontwerpleider',
    manager: 'Manager',
  };
  const VOLLEDIG = ['ontwerpleider', 'manager']; // alles bewerken + toewijzen + accountbeheer

  let clerk = null;
  let user = null;
  let devMode = false;
  let ingelogd = false;
  let userId = '__dev__';
  let role = 'manager';

  function laadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.async = true; s.crossOrigin = 'anonymous';
      s.onload = resolve;
      s.onerror = () => reject(new Error('kon script niet laden: ' + src));
      document.head.appendChild(s);
    });
  }

  async function publishableKey() {
    if (window.CLERK_PUBLISHABLE_KEY) return window.CLERK_PUBLISHABLE_KEY;
    try {
      const r = await fetch('/api/config', { headers: { 'cache-control': 'no-cache' } });
      if (r.ok) { const d = await r.json(); return d.clerkPublishableKey || ''; }
    } catch { /* lokaal zonder backend */ }
    return '';
  }

  function devBanner(tekst) {
    document.body.classList.add('auth-dev');
    let b = document.getElementById('authDevBanner');
    if (!b) { b = document.createElement('div'); b.id = 'authDevBanner'; b.className = 'auth-dev-banner'; document.body.appendChild(b); }
    b.textContent = tekst || 'Login niet geconfigureerd — tijdelijk zonder authenticatie (rol: Manager). Stel CLERK_PUBLISHABLE_KEY in om login te activeren.';
  }

  // Initialiseren: laadt Clerk, gate de app achter login. Resolvet pas wanneer
  // er een ingelogde gebruiker is (of in devmodus direct).
  async function init() {
    const pk = await publishableKey();
    if (!pk) { devMode = true; ingelogd = true; role = 'manager'; userId = '__dev__'; devBanner(); return; }
    try {
      await laadScript('https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js');
      clerk = new window.Clerk(pk);
      await clerk.load();
    } catch (e) {
      devMode = true; ingelogd = true; role = 'manager'; userId = '__dev__';
      devBanner('Clerk kon niet laden — tijdelijk zonder login. ' + e.message);
      return;
    }
    if (clerk.user) { user = clerk.user; ingelogd = true; userId = user.id; return; }

    // Niet ingelogd → toon het login-scherm en wacht tot er is ingelogd.
    document.body.classList.add('niet-ingelogd');
    const doel = document.getElementById('clerkSignIn');
    try { clerk.mountSignIn(doel, { afterSignInUrl: '/', afterSignUpUrl: '/' }); } catch (e) { /* ignore */ }
    await new Promise((resolve) => {
      clerk.addListener((res) => {
        if (res && res.user && !ingelogd) { user = res.user; ingelogd = true; userId = res.user.id; resolve(); }
      });
    });
    document.body.classList.remove('niet-ingelogd');
  }

  function montUserButton() {
    if (devMode || !clerk) return;
    const doel = document.getElementById('clerkUserButton');
    if (doel) { try { clerk.mountUserButton(doel, { afterSignOutUrl: '/' }); } catch (e) { /* ignore */ } }
  }

  // Koppel de ingelogde gebruiker aan State.gebruikers en bepaal de rol.
  // Eerste gebruiker (of een e-mail uit HVP_ADMIN_EMAILS) wordt Manager,
  // zodat er altijd iemand kan toewijzen en rollen kan beheren.
  function koppelGebruiker() {
    if (devMode) { role = 'manager'; toonRolBadge(); return; }
    const email = (user.primaryEmailAddress && user.primaryEmailAddress.emailAddress) || '';
    const naam = user.fullName || user.username || email || 'Gebruiker';
    let g = State.gebruikers[userId];
    if (!g) {
      const geenBeheerder = !Object.values(State.gebruikers).some((x) => VOLLEDIG.includes(x.role));
      const adminEmails = (window.HVP_ADMIN_EMAILS || []).map((s) => String(s).toLowerCase());
      const bootstrap = geenBeheerder || adminEmails.includes(email.toLowerCase());
      g = { id: userId, email, naam, role: bootstrap ? 'manager' : 'engineer', sinds: isoDatum(new Date()) };
      State.gebruikers[userId] = g;
      State.bewaar();
    } else if (g.email !== email || g.naam !== naam) {
      g.email = email; g.naam = naam; State.bewaar();
    }
    role = g.role;
    toonRolBadge();
  }

  // Herlees de rol uit State (na een rolwijziging in Accountbeheer).
  function herlaadRol() {
    if (devMode) { role = 'manager'; toonRolBadge(); return; }
    const g = State.gebruikers[userId];
    if (g) role = g.role;
    toonRolBadge();
  }

  function toonRolBadge() {
    const b = document.getElementById('rolBadge');
    if (b) { b.textContent = ROL_LABELS[role] || role; b.dataset.rol = role; }
  }

  function huidigeGebruiker() { return State.gebruikers[userId] || null; }
  function naam() {
    const g = huidigeGebruiker();
    if (g) return g.naam;
    return devMode ? 'Devmodus' : 'Gebruiker';
  }

  const magVolledig = () => devMode || VOLLEDIG.includes(role);
  const magToewijzen = () => magVolledig();
  const magAccounts = () => magVolledig();
  const isToegewezen = (wpId) => (State.toewijzingen[wpId] || []).includes(userId);
  const magWpBewerken = (wpId) => magVolledig() || isToegewezen(wpId);
  const mijnWerkpakketten = () => State.werkpakketten.filter((w) => (State.toewijzingen[w.id] || []).includes(userId));

  return {
    init, montUserButton, koppelGebruiker, herlaadRol, naam, huidigeGebruiker,
    ROLLEN, ROL_LABELS, VOLLEDIG,
    get ingelogd() { return ingelogd; },
    get devMode() { return devMode; },
    get userId() { return userId; },
    get role() { return role; },
    magVolledig, magToewijzen, magAccounts, isToegewezen, magWpBewerken, mijnWerkpakketten,
  };
})();

window.Auth = Auth;
