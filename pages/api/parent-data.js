import { getStudentMemory } from '../../utils/db';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Require authenticated session — parent must be logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const { parentEmail, childEmail } = req.body;
  if (!parentEmail || !childEmail) {
    return res.status(400).json({ error: 'parentEmail and childEmail required' });
  }

  // Verify the logged-in user IS the parent requesting data
  if (session.user.email.toLowerCase() !== parentEmail.toLowerCase()) {
    return res.status(403).json({ error: 'You can only access data for your own linked children.' });
  }
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
