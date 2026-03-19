import { getAllSubscribers } from '../../utils/db';
import { getStudentMemory } from '../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  // Require dashboard password — same auth as dashboard-auth.js
  const authHeader = req.headers.authorization;
  const dashRole = req.headers['x-dash-role'];
  const adminPw = process.env.DASHBOARD_ADMIN_PASSWORD;
  const teacherPw = process.env.DASHBOARD_TEACHER_PASSWORD;
  if (!authHeader || (authHeader !== `Bearer ${adminPw}` && authHeader !== `Bearer ${teacherPw}`)) {
    return res.status(401).json({ error: 'Unauthorized — dashboard login required' });
  }

  try {
    const subscribers = await getAllSubscribers();
    const students = await Promise.all(
      subscribers.map(async s => {
        const memory = await getStudentMemory(s.email);
        return {
          ...s,
          weakTopics: memory?.weakTopics || [],
          recentMistakes: memory?.recentMistakes || [],
          currentSubject: memory?.currentSubject || s.subject || '',
          totalSessions: memory?.totalSessions || 0,
          lastSeen: memory?.lastSeen || s.subscribedAt,
        };
      })
    );
    return res.status(200).json({ students, stats: { total: students.length } });
  } catch (e) {
    console.error('[dashboard-data]', e.message);
    return res.status(500).json({ error: 'Failed to load dashboard data.' });
  }
}
