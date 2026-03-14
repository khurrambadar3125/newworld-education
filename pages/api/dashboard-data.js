import { getAllSubscribers } from '../../utils/db';
import { getStudentMemory } from '../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
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
    return res.status(500).json({ error: e.message });
  }
}
