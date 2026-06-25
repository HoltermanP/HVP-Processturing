'use strict';
/* Optionele clientconfiguratie.

   De Clerk Publishable Key komt normaal uit de Vercel-env
   (CLERK_PUBLISHABLE_KEY) en wordt geserveerd via /api/config. Lokaal — zonder
   `vercel dev` — kun je 'm hieronder zetten om toch te kunnen inloggen. Laat
   leeg om de app zonder login te draaien (devmodus, volledige rechten).

   HVP_ADMIN_EMAILS: e-mailadressen die bij eerste login automatisch de rol
   Manager krijgen. Niet verplicht — de állereerste gebruiker wordt sowieso
   Manager, zodat er altijd iemand rollen kan toekennen en kan toewijzen. */
window.CLERK_PUBLISHABLE_KEY = window.CLERK_PUBLISHABLE_KEY || '';
window.HVP_ADMIN_EMAILS = window.HVP_ADMIN_EMAILS || [];
