import { Redis } from '@upstash/redis';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

export default async function handler(req, res) {
  // GET — child fetches their assignment
  if (req.method === 'GET') {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'email required' });
    try {
      const key = email.toLowerCase().trim();
      const [rawAssignment, rawFeedback] = await Promise.all([
        kv.get(`assignment:${key}`),
        kv.get(`feedback:${key}`),
      ]);
      const assignment = rawAssignment ? (typeof rawAssignment === 'string' ? JSON.parse(rawAssignment) : rawAssignment) : null;
      const feedback = rawFeedback ? (typeof rawFeedback === 'string' ? JSON.parse(rawFeedback) : rawFeedback) : null;
      // Delete after reading (show once)
      if (assignment) await kv.del(`assignment:${key}`);
      if (feedback) await kv.del(`feedback:${key}`);
      return res.status(200).json({ assignment, feedback });
    } catch (e) {
      return res.status(200).json({ assignment: null, feedback: null });
    }
  }

  // POST — parent sets an assignment for their child
  if (req.method === 'POST') {
    const { childEmail, topic, parentName } = req.body;
    if (!childEmail || !topic) return res.status(400).json({ error: 'childEmail and topic required' });
    try {
      await kv.set(`assignment:${childEmail.toLowerCase().trim()}`, JSON.stringify({
        topic,
        setBy: parentName || 'Your parent',
        setAt: new Date().toISOString(),
      }), { ex: 7 * 24 * 60 * 60 }); // expires in 7 days
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to save assignment' });
    }
  }

  // POST — parent sends feedback after seeing results
  if (req.method === 'PUT') {
    const { childEmail, feedback, parentName } = req.body;
    if (!childEmail || !feedback) return res.status(400).json({ error: 'childEmail and feedback required' });
    try {
      await kv.set(`feedback:${childEmail.toLowerCase().trim()}`, JSON.stringify({
        feedback,
        from: parentName || 'Your parent',
        setAt: new Date().toISOString(),
      }), { ex: 7 * 24 * 60 * 60 });
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to save feedback' });
    }
  }

  return res.status(405).end();
}
