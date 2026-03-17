/**
 * /api/championship/behaviour
 * POST: log a behaviour event
 * GET: get behaviour profile for email
 */
import { Redis } from '@upstash/redis';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

const VALID_EVENTS = [
  'visited_championship',
  'joined',
  'first_referral',
  'share_click',
  'leaderboard_view',
];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'email required' });

    const profile = {};
    for (const event of VALID_EVENTS) {
      const data = await kv.get(`championship:behaviour:${email}:${event}`);
      if (data) {
        profile[event] = typeof data === 'string' ? JSON.parse(data) : data;
      }
    }
    return res.status(200).json({ email, profile });
  }

  if (req.method === 'POST') {
    const { email, event, meta } = req.body;
    if (!email || !event) return res.status(400).json({ error: 'email and event required' });
    if (!VALID_EVENTS.includes(event)) return res.status(400).json({ error: `Invalid event. Valid events: ${VALID_EVENTS.join(', ')}` });

    const key = `championship:behaviour:${email}:${event}`;
    const existing = await kv.get(key);
    const parsed = existing ? (typeof existing === 'string' ? JSON.parse(existing) : existing) : null;

    const now = new Date().toISOString();
    const record = {
      event,
      firstSeen: parsed?.firstSeen || now,
      lastSeen: now,
      count: (parsed?.count || 0) + 1,
      meta: meta || parsed?.meta || null,
    };

    await kv.set(key, JSON.stringify(record));
    return res.status(200).json({ ok: true, record });
  }

  return res.status(405).end();
}
