// Vercel serverless function — genereert een management­rapportage met de
// Anthropic-API. De API-sleutel komt uit de environment variable
// ANTHROPIC_API_KEY (in Vercel ingesteld) en blijft dus server-side.
//
// De berekende cijfers worden door de frontend meegestuurd; dit endpoint
// laat het model er een Nederlandstalig rapport van schrijven en streamt de
// tekst terug als platte tekst (zodat de frontend live kan meelezen).

import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Methode niet toegestaan' });
    return;
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(503).json({ error: 'ANTHROPIC_API_KEY niet ingesteld in Vercel' });
    return;
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch {
    res.status(400).json({ error: 'Ongeldige aanvraag' });
    return;
  }

  const { system, prompt, model } = body;
  if (!prompt) {
    res.status(400).json({ error: 'Geen prompt meegestuurd' });
    return;
  }

  const client = new Anthropic({ apiKey: key });

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const stream = client.messages.stream({
      model: model || 'claude-opus-4-8',
      max_tokens: 16000,
      system: system || undefined,
      messages: [{ role: 'user', content: prompt }],
    });

    stream.on('text', (delta) => { res.write(delta); });
    const eind = await stream.finalMessage();
    if (eind.stop_reason === 'max_tokens') {
      res.write('\n\n> ⚠️ Het rapport bereikte de maximale lengte (16.000 tokens) en is mogelijk niet helemaal compleet.');
    }
    // Expliciete eindmarkering: zo kan de frontend een afgebroken stream
    // (bijv. door de Vercel-tijdslimiet) onderscheiden van een voltooid rapport.
    res.write('\n<!--EINDE-->');
    res.end();
  } catch (e) {
    if (!res.headersSent) {
      res.status(500).json({ error: e.message });
    } else {
      res.write('\n\n> ⚠️ Er ging iets mis tijdens het genereren: ' + e.message);
      res.end();
    }
  }
}
