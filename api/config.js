// Publieke clientconfiguratie. Geeft de Clerk Publishable Key door aan de
// browser. Deze sleutel (pk_...) is publiek en mag in de frontend staan; de
// Secret Key blijft uitsluitend server-side en wordt hier NIET teruggegeven.
export default function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  res.status(200).json({
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
  });
}
