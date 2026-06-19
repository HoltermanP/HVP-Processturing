-- Neon (Postgres) schema voor HVP Procesturing.
-- De Vercel-functie api/state.js maakt deze tabel automatisch aan; dit bestand
-- is ter referentie / handmatige inrichting.

CREATE TABLE IF NOT EXISTS hvp_kv (
  sleutel    text PRIMARY KEY,        -- 'werkpakketten' | 'voortgang' | 'doorlooptijden' | 'snapshots' | 'instellingen'
  waarde     jsonb NOT NULL,          -- het bijbehorende JSON-document
  bijgewerkt timestamptz NOT NULL DEFAULT now()
);

-- De data wordt als JSON-documenten opgeslagen die de hiërarchie
-- Project ▸ APD ▸ Werkpakket weerspiegelen (elk werkpakket draagt een
-- 'project'- en 'apd'-veld). Voorbeeld van een werkpakket binnen 'werkpakketten':
--   { "id": "...", "project": "Spannenburg", "apd": "Spannenburg",
--     "wp": "WP1", "engineer": "...", "lengteNieuw": 2400,
--     "mijlpalen": { "overdrachtVO": "23-10-2025", ... } }
