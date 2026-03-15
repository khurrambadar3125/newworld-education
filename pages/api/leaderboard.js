import { kv } from '@vercel/kv';

const getWeekKey = () => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  return `leaderboard:${weekStart.toISOString().split('T')[0]}`;
};

export default async function handler(req, res) {

  // GET — return this week's leaderboard
  if (req.method === 'GET') {
    try {
      const key = getWeekKey();
      const raw = await kv.get(key);
      let board = [];
      try { board = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : []; } catch { board = []; }
      // Sort by score descending, take top 20
      board.sort((a, b) => b.score - a.score);
      return res.status(200).json({ board: board.slice(0, 20) });
    } catch (err) {
      return res.status(200).json({ board: [] });
    }
  }

  // POST — submit a score
  if (req.method === 'POST') {
    const { name, grade, score, sessions, streak } = req.body || {};

    if (!name || score === undefined) {
      return res.status(400).json({ error: 'Name and score required' });
    }

    try {
      const key = getWeekKey();
      const raw = await kv.get(key);
      let board = [];
      try { board = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : []; } catch { board = []; }

      // Update or add entry
      const existing = board.findIndex(e => e.name === name && e.grade === grade);
      const entry = {
        name: name.substring(0, 20), // limit length
        grade: grade || 'Student',
        score: Math.max(0, parseInt(score) || 0),
        sessions: parseInt(sessions) || 0,
        streak: parseInt(streak) || 0,
        updatedAt: new Date().toISOString(),
      };

      if (existing !== -1) {
        board[existing] = entry;
      } else {
        board.push(entry);
      }

      // Save with 8-day TTL (covers the full week + buffer)
      await kv.set(key, JSON.stringify(board), { ex: 8 * 24 * 60 * 60 });

      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save score' });
    }
  }

  return res.status(405).end();
}
