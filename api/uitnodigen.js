// Vercel serverless function — nodigt nieuwe gebruikers uit via Clerk
// (Invitations API). Clerk verstuurt zelf de uitnodigingsmail; rol en
// paginarechten reizen mee als public_metadata en worden bij het accepteren
// van de uitnodiging automatisch aan de nieuwe Clerk-gebruiker gehangen (zie
// koppelGebruiker() in js/auth.js, die dit bij eerste login overneemt).
//
// Alleen gebruikers met rol 'manager' of 'ontwerpleider' mogen dit — dat wordt
// hier server-side afgedwongen (in tegenstelling tot de rest van de app, waar
// rechten alleen client-side gelden), omdat dit endpoint echte e-mails
// verstuurt en niet client-side te vertrouwen is.

import { createClerkClient, verifyToken } from '@clerk/backend';
import { neon } from '@neondatabase/serverless';

const ROLLEN = ['engineer', 'omgevingsmanager', 'projectleider', 'ontwerpleider', 'manager'];
const VOLLEDIG = ['ontwerpleider', 'manager'];

async function huidigeGebruiker(req) {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const dbUrl = process.env.DATABASE_URL;
  if (!secretKey || !dbUrl) return { fout: 503, bericht: 'CLERK_SECRET_KEY of DATABASE_URL niet ingesteld' };

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return { fout: 401, bericht: 'Niet ingelogd' };

  let payload;
  try {
    payload = await verifyToken(token, { secretKey });
  } catch {
    return { fout: 401, bericht: 'Sessietoken ongeldig of verlopen' };
  }

  const sql = neon(dbUrl);
  const rows = await sql`SELECT waarde FROM hvp_kv WHERE sleutel = 'gebruikers'`;
  const gebruikers = rows[0] ? rows[0].waarde : {};
  const g = gebruikers[payload.sub];
  if (!g || !VOLLEDIG.includes(g.role)) return { fout: 403, bericht: 'Geen rechten voor accountbeheer' };
  return { userId: payload.sub, rol: g.role, secretKey };
}

export default async function handler(req, res) {
  const ctx = await huidigeGebruiker(req);
  if (ctx.fout) { res.status(ctx.fout).json({ error: ctx.bericht }); return; }
  const clerk = createClerkClient({ secretKey: ctx.secretKey });

  try {
    if (req.method === 'GET') {
      const lijst = await clerk.invitations.getInvitationList({ status: 'pending', limit: 100 });
      const data = (lijst.data || lijst).map((inv) => ({
        id: inv.id,
        email: inv.emailAddress,
        rol: (inv.publicMetadata || {}).rol || '',
        aangemaakt: inv.createdAt ? new Date(inv.createdAt).toISOString() : null,
      }));
      res.status(200).json({ uitnodigingen: data });
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const email = String(body.email || '').trim().toLowerCase();
      const rol = body.rol;
      const paginaRechten = Array.isArray(body.paginaRechten) ? body.paginaRechten : null;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { res.status(400).json({ error: 'Ongeldig e-mailadres' }); return; }
      if (!ROLLEN.includes(rol)) { res.status(400).json({ error: 'Ongeldige rol' }); return; }

      const origin = req.headers.origin || `https://${req.headers.host}`;
      const publicMetadata = paginaRechten && paginaRechten.length ? { rol, paginaRechten } : { rol };

      const inv = await clerk.invitations.createInvitation({
        emailAddress: email,
        publicMetadata,
        notify: true,
        redirectUrl: origin,
      });
      res.status(200).json({ ok: true, id: inv.id });
      return;
    }

    if (req.method === 'DELETE') {
      const id = (req.query && req.query.id) || '';
      if (!id) { res.status(400).json({ error: 'id ontbreekt' }); return; }
      await clerk.invitations.revokeInvitation(id);
      res.status(200).json({ ok: true });
      return;
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    res.status(405).json({ error: 'Methode niet toegestaan' });
  } catch (e) {
    const bericht = (e && e.errors && e.errors[0] && e.errors[0].message) || e.message || 'Onbekende fout';
    res.status(e.status && e.status >= 400 && e.status < 600 ? e.status : 500).json({ error: bericht });
  }
}
