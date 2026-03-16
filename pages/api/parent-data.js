import { getStudentMemory } from '../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { parentEmail, childEmail } = req.body;
  if (!parentEmail || !childEmail) {
    return res.status(400).json({ error: 'parentEmail and childEmail required' });
  }

  // Simple auth: parent must provide their own email + child's email
  // In production, this should verify a parent-child relationship in KV
  try {
    const memory = await getStudentMemory(childEmail);
    if (!memory) {
      return res.status(200).json({
        child: { email: childEmail },
        memory: null,
        message: 'No session data found for this student yet. They need to complete at least one session with Starky.',
      });
    }

    return res.status(200).json({
      child: { email: childEmail },
      memory: {
        weakTopics: memory.weakTopics || [],
        recentMistakes: memory.recentMistakes || [],
        currentSubject: memory.currentSubject || '',
        totalSessions: memory.totalSessions || 0,
        lastSeen: memory.lastSeen || null,
        sessionSummary: memory.sessionSummary || '',
      },
    });
  } catch (err) {
    console.error('[PARENT DATA]', err.message);
    return res.status(500).json({ error: 'Failed to fetch child data' });
  }
}
