// Login attempt rate limiting — max 5 attempts per IP per 15 minutes
const loginAttempts = new Map();
function checkLoginRate(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now - entry.t > 900000) { loginAttempts.set(ip, { t: now, c: 1 }); return true; }
  if (entry.c >= 5) return false;
  entry.c++;
  return true;
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for'] || 'unknown';
  if (!checkLoginRate(ip)) {
    return res.status(429).json({ error: 'Too many login attempts. Please try again in 15 minutes.' });
  }

  const { password } = req.body;
  if (!process.env.DASHBOARD_ADMIN_PASSWORD && !process.env.DASHBOARD_TEACHER_PASSWORD) {
    console.error('[DASHBOARD AUTH] Neither DASHBOARD_ADMIN_PASSWORD nor DASHBOARD_TEACHER_PASSWORD env vars are set');
    return res.status(500).json({ error: 'Dashboard not configured. Contact admin.' });
  }
  if (password && password === process.env.DASHBOARD_ADMIN_PASSWORD) return res.status(200).json({ role: 'admin' });
  if (password && password === process.env.DASHBOARD_TEACHER_PASSWORD) return res.status(200).json({ role: 'teacher' });
  return res.status(401).json({ error: 'Invalid password' });
}
