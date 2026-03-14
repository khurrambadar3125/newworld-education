export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { password } = req.body;
  if (password === process.env.DASHBOARD_ADMIN_PASSWORD) return res.status(200).json({ role: 'admin' });
  if (password === process.env.DASHBOARD_TEACHER_PASSWORD) return res.status(200).json({ role: 'teacher' });
  return res.status(401).json({ error: 'Invalid password' });
}
