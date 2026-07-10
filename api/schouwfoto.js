// Vercel serverless function — bewaart schouwfoto's als losse records in Neon.
// Foto's zitten bewust NIET in de grote applicatiestaat (api/state.js): één
// foto is al gauw een paar honderd KB, dus die worden per stuk gelezen en
// geschreven. De browser cachet ze lokaal in IndexedDB (js/schouw.js).

import { neon } from '@neondatabase/serverless';

async function ensureTabel(sql) {
  await sql`CREATE TABLE IF NOT EXISTS hvp_fotos (
    id         text PRIMARY KEY,
    data       text NOT NULL,
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
      const { id, ids } = req.query || {};
      if (ids) {
        // Batch: meerdere foto's in één keer (voor rapporten en de fotogrid).
        const lijst = String(ids).split(',').map((s) => s.trim()).filter(Boolean).slice(0, 40);
        const rows = lijst.length ? await sql`SELECT id, data FROM hvp_fotos WHERE id = ANY(${lijst})` : [];
        res.status(200).json({ fotos: rows });
        return;
      }
      if (!id) { res.status(400).json({ error: 'id of ids ontbreekt' }); return; }
      const rows = await sql`SELECT id, data FROM hvp_fotos WHERE id = ${id}`;
      if (!rows.length) { res.status(404).json({ error: 'foto niet gevonden' }); return; }
      res.status(200).json(rows[0]);
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const { id, data } = body;
      if (!id || !data || typeof data !== 'string' || !data.startsWith('data:image/')) {
        res.status(400).json({ error: 'id en data (data-URL van een afbeelding) zijn verplicht' });
        return;
      }
      if (data.length > 3_500_000) { res.status(413).json({ error: 'foto te groot' }); return; }
      await sql`INSERT INTO hvp_fotos (id, data, bijgewerkt)
                VALUES (${id}, ${data}, now())
                ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, bijgewerkt = now()`;
      res.status(200).json({ ok: true, id });
      return;
    }

    if (req.method === 'DELETE') {
      const { id, alles } = req.query || {};
      if (alles === '1') {
        await sql`DELETE FROM hvp_fotos`;
        res.status(200).json({ ok: true, gewist: true });
        return;
      }
      if (!id) { res.status(400).json({ error: 'id ontbreekt' }); return; }
      await sql`DELETE FROM hvp_fotos WHERE id = ${id}`;
      res.status(200).json({ ok: true, id });
      return;
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    res.status(405).json({ error: 'Methode niet toegestaan' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
