// Pings Supabase once a day (Vercel cron, see vercel.json) so the free
// project never pauses for inactivity. Uses the public key already in index.html.
const SUPABASE_URL = 'https://aklyycfzcbrssqqccufv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_yEOAU0owlWJ2g1He-2hKDw_7ksY5DL_';

export default async function handler(req, res) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/events?select=id&limit=1`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    res.status(200).json({ ok: r.ok, status: r.status, at: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
