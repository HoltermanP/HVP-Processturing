-- Neon (Postgres) schema voor HVP Procesturing.
-- De Vercel-functie api/state.js maakt deze tabel automatisch aan; dit bestand
-- is ter referentie / handmatige inrichting.

CREATE TABLE IF NOT EXISTS hvp_kv (
  sleutel    text PRIMARY KEY,        -- 'werkpakketten' | 'voortgang' | 'doorlooptijden' | 'snapshots' | 'instellingen'
  waarde     jsonb NOT NULL,          -- het bijbehorende JSON-document
  bijgewerkt timestamptz NOT NULL DEFAULT now()
);

-- Schouwfoto's staan apart (te groot voor de applicatiestaat): één rij per
-- foto, beheerd door api/schouwfoto.js. 'data' is een JPEG als data-URL; de
-- schouw zelf (metadata, delen, locaties) staat onder de sleutel 'schouwen'
-- in hvp_kv en verwijst naar deze foto-id's.
CREATE TABLE IF NOT EXISTS hvp_fotos (
  id         text PRIMARY KEY,
  data       text NOT NULL,
  bijgewerkt timestamptz NOT NULL DEFAULT now()
);

-- De data wordt als JSON-documenten opgeslagen die de hiërarchie
-- Project ▸ APD ▸ Werkpakket weerspiegelen (elk werkpakket draagt een
-- 'project'- en 'apd'-veld). Voorbeeld van een werkpakket binnen 'werkpakketten':
--   { "id": "...", "project": "Spannenburg", "apd": "Spannenburg",
--     "wp": "WP1", "engineer": "...", "lengteNieuw": 2400,
--     "mijlpalen": { "overdrachtVO": "23-10-2025", ... } }
