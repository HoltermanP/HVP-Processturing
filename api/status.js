// Lichte statuscheck: zijn de environment variables in Vercel ingesteld?
// Lekt geen waarden, alleen of ze aanwezig zijn.
export default function handler(req, res) {
  res.status(200).json({
    database: Boolean(process.env.DATABASE_URL),
    ai: Boolean(process.env.ANTHROPIC_API_KEY),
  });
}
