export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { password } = req.body;
  if (!process.env.DASHBOARD_ADMIN_PASSWORD && !process.env.DASHBOARD_TEACHER_PASSWORD) {
    console.error('[DASHBOARD AUTH] Neither DASHBOARD_ADMIN_PASSWORD nor DASHBOARD_TEACHER_PASSWORD env vars are set');
    return res.status(500).json({ error: 'Dashboard not configured. Contact admin.' });
  }
  if (password && password === process.env.DASHBOARD_ADMIN_PASSWORD) return res.status(200).json({ role: 'admin' });
  if (password && password === process.env.DASHBOARD_TEACHER_PASSWORD) return res.status(200).json({ role: 'teacher' });
  return res.status(401).json({ error: 'Invalid password' });
}
