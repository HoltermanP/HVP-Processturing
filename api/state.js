// Vercel serverless function — leest/schrijft de volledige applicatiestaat
// in een Neon (Postgres) database. De connectionstring komt uit de
// environment variable DATABASE_URL (in Vercel ingesteld).
//
// Opslagmodel: een eenvoudige key/value-tabel met JSONB-waarden. Elke sleutel
// (werkpakketten, voortgang, doorlooptijden, snapshots, instellingen) is één rij.

import { neon } from '@neondatabase/serverless';

const SLEUTELS = ['werkpakketten', 'voortgang', 'doorlooptijden', 'snapshots', 'instellingen', 'vergunningen', 'risicos', 'gebruikers', 'toewijzingen'];

async function ensureTabel(sql) {
  await sql`CREATE TABLE IF NOT EXISTS hvp_kv (
    sleutel    text PRIMARY KEY,
    waarde     jsonb NOT NULL,
    bijgewerkt timestamptz NOT NULL DEFAULT now()
  )`;
}

export default async function handler(req, res) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    res.status(503).json({ error: 'DATABASE_URL niet ingesteld', gekoppeld: false });
    return;
  }

  let sql;
  try {
    sql = neon(url);
    await ensureTabel(sql);
  } catch (e) {
    res.status(500).json({ error: 'Databaseverbinding mislukt: ' + e.message });
    return;
  }

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT sleutel, waarde, bijgewerkt FROM hvp_kv`;
      const out = { _gekoppeld: true, _bijgewerkt: null };
      let laatste = null;
      for (const r of rows) {
        out[r.sleutel] = r.waarde;
        if (!laatste || new Date(r.bijgewerkt) > new Date(laatste)) laatste = r.bijgewerkt;
      }
      out._bijgewerkt = laatste;
      res.status(200).json(out);
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      let n = 0;
      for (const sleutel of SLEUTELS) {
        if (body[sleutel] === undefined) continue;
        const waarde = JSON.stringify(body[sleutel]);
        await sql`INSERT INTO hvp_kv (sleutel, waarde, bijgewerkt)
                  VALUES (${sleutel}, ${waarde}::jsonb, now())
                  ON CONFLICT (sleutel) DO UPDATE
                    SET waarde = EXCLUDED.waarde, bijgewerkt = now()`;
        n++;
      }
      res.status(200).json({ ok: true, opgeslagen: n, bijgewerkt: new Date().toISOString() });
      return;
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM hvp_kv`;
      res.status(200).json({ ok: true, gewist: true });
      return;
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    res.status(405).json({ error: 'Methode niet toegestaan' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
