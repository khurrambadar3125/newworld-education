/**
 * /api/share — Create and retrieve shareable links.
 * POST: saves share data to KV, returns a short ID
 * GET:  retrieves share data by ID
 */
import { Redis } from '@upstash/redis';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

function generateId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let id = '';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export default async function handler(req, res) {
  // GET — retrieve share data
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id required' });
    try {
      const raw = await kv.get(`share:${id}`);
      if (!raw) return res.status(404).json({ error: 'Link expired or not found' });
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return res.status(200).json(data);
    } catch {
      return res.status(404).json({ error: 'Link not found' });
    }
  }

  // POST — create share link
  if (req.method === 'POST') {
    const { type, data } = req.body;
    if (!type || !data) return res.status(400).json({ error: 'type and data required' });
    const id = generateId();
    try {
      await kv.set(`share:${id}`, JSON.stringify({ type, data, createdAt: new Date().toISOString() }), { ex: 30 * 24 * 60 * 60 }); // 30 day expiry
      const url = `https://www.newworld.education/share/${id}`;
      return res.status(200).json({ id, url });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to create link' });
    }
  }

  return res.status(405).end();
}
