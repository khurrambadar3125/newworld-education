import { kv } from '@vercel/kv';

// In-memory cache — prevents KV read on every page load at 1000 concurrent users
let _boardCache = null;
let _boardCacheTime = 0;
const BOARD_CACHE_TTL = 300000; // 5 minutes

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
      // Return cached leaderboard if fresh (saves KV reads at scale)
      if (_boardCache && Date.now() - _boardCacheTime < BOARD_CACHE_TTL) {
        return res.status(200).json({ board: _boardCache });
      }
      const key = getWeekKey();
      const raw = await kv.get(key);
      let board = [];
      try { board = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : []; } catch { board = []; }
      board.sort((a, b) => b.score - a.score);
      const top = board.slice(0, 20);
      _boardCache = top;
      _boardCacheTime = Date.now();
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return res.status(200).json({ board: top });
    } catch (err) {
      // Return cache even if stale on error
      if (_boardCache) return res.status(200).json({ board: _boardCache });
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

      // Invalidate cache so next GET shows updated board
      _boardCache = null;
      _boardCacheTime = 0;

      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save score' });
    }
  }

  return res.status(405).end();
}
