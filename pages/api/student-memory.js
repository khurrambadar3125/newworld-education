import { saveStudentMemory, getStudentMemory } from '../../utils/db';

export default async function handler(req, res) {
  const { email } = req.method === 'GET' ? req.query : req.body;
  if (!email) return res.status(400).json({ error: 'email required' });

  if (req.method === 'GET') {
    const memory = await getStudentMemory(email);
    return res.status(200).json({ memory });
  }

  if (req.method === 'POST') {
    const { memory } = req.body;
    if (!memory) return res.status(400).json({ error: 'memory required' });
    await saveStudentMemory(email, memory);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).end();
}
