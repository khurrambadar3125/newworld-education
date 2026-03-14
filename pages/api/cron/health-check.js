import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const PAGES = [
  { path: '/',              name: 'Home' },
  { path: '/drill',         name: 'Drill' },
  { path: '/essay',         name: 'Essay' },
  { path: '/countdown',     name: 'Countdown' },
  { path: '/parent',        name: 'Parent Portal' },
  { path: '/special-needs', name: 'Special Needs' },
  { path: '/homework',      name: 'Homework Helper' },
  { path: '/pricing',       name: 'Pricing' },
  { path: '/past-papers',   name: 'Past Papers' },
];

const API_ENDPOINTS = [
  { path: '/api/anthropic',            name: 'Starky API',      method: 'POST', body: { messages: [{ role: 'user', content: 'ping' }] } },
  { path: '/api/cron/daily-question',  name: 'Daily Cron Auth', method: 'POST', expectStatus: 401 },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const auth = req.headers['authorization'];
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ error: 'Unauthorized' });

  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.newworld.education';
  const results = { ok: [], warn: [], fail: [] };
  const start = Date.now();

  // Check all pages
  for (const page of PAGES) {
    try {
      const t0 = Date.now();
      const r = await fetch(`${base}${page.path}`, { 
        headers: { 'User-Agent': 'NWE-HealthBot/1.0' },
        signal: AbortSignal.timeout(10000),
      });
      const ms = Date.now() - t0;
      const status = r.status;

      if (status >= 500) {
        results.fail.push({ name: page.name, path: page.path, status, ms, issue: 'Server error' });
      } else if (status >= 400) {
        results.warn.push({ name: page.name, path: page.path, status, ms, issue: 'Client error' });
      } else if (ms > 5000) {
        results.warn.push({ name: page.name, path: page.path, status, ms, issue: 'Slow response (>5s)' });
      } else {
        results.ok.push({ name: page.name, path: page.path, status, ms });
      }
    } catch (e) {
      results.fail.push({ name: page.name, path: page.path, status: 0, ms: 0, issue: e.message?.substring(0, 80) || 'Timeout/unreachable' });
    }
  }

  // Check API endpoints
  for (const ep of API_ENDPOINTS) {
    try {
      const t0 = Date.now();
      const r = await fetch(`${base}${ep.path}`, {
        method: ep.method || 'GET',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'NWE-HealthBot/1.0' },
        body: ep.body ? JSON.stringify(ep.body) : undefined,
        signal: AbortSignal.timeout(10000),
      });
      const ms = Date.now() - t0;
      const expected = ep.expectStatus || 200;
      if (r.status === expected || (r.status >= 200 && r.status < 500 && !ep.expectStatus)) {
        results.ok.push({ name: ep.name, path: ep.path, status: r.status, ms });
      } else {
        results.warn.push({ name: ep.name, path: ep.path, status: r.status, ms, issue: `Unexpected status` });
      }
    } catch (e) {
      results.fail.push({ name: ep.name, path: ep.path, status: 0, ms: 0, issue: e.message?.substring(0, 80) || 'Failed' });
    }
  }

  const totalMs = Date.now() - start;
  const allOk = results.fail.length === 0 && results.warn.length === 0;
  const pkTime = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });

  const statusIcon = results.fail.length > 0 ? '🔴' : results.warn.length > 0 ? '🟡' : '🟢';
  const statusText = results.fail.length > 0 ? 'ISSUES DETECTED' : results.warn.length > 0 ? 'WARNINGS' : 'ALL SYSTEMS OK';

  const rowStyle = 'padding:8px 12px;border-bottom:1px solid #eee;';
  const makeRows = (items, color) => items.map(i => `
    <tr>
      <td style="${rowStyle}color:${color};font-weight:bold">${i.name}</td>
      <td style="${rowStyle}font-family:monospace;font-size:12px">${i.path}</td>
      <td style="${rowStyle}text-align:center">${i.status || '—'}</td>
      <td style="${rowStyle}text-align:center">${i.ms ? i.ms + 'ms' : '—'}</td>
      <td style="${rowStyle}color:${color}">${i.issue || '✓'}</td>
    </tr>
  `).join('');

  await resend.emails.send({
    from: 'NWE Monitor <alerts@newworld.education>',
    to: 'khurrambadar@gmail.com',
    subject: `${statusIcon} NWE Health Check — ${statusText} — ${pkTime}`,
    html: `
      <div style="font-family:sans-serif;max-width:700px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 4px">NewWorld Education — Health Report</h2>
        <p style="color:#888;margin:0 0 20px;font-size:13px">${pkTime} · Scan took ${totalMs}ms</p>

        <div style="background:${results.fail.length > 0 ? '#fff0f0' : results.warn.length > 0 ? '#fffbe6' : '#f0fff4'};
          border:1px solid ${results.fail.length > 0 ? '#ffcccc' : results.warn.length > 0 ? '#ffe58f' : '#b7eb8f'};
          border-radius:8px;padding:16px;margin-bottom:24px;text-align:center">
          <div style="font-size:32px;margin-bottom:8px">${statusIcon}</div>
          <div style="font-size:18px;font-weight:bold;color:${results.fail.length > 0 ? '#cc0000' : results.warn.length > 0 ? '#d48806' : '#389e0d'}">${statusText}</div>
          <div style="font-size:13px;color:#666;margin-top:4px">
            ✅ ${results.ok.length} OK &nbsp;|&nbsp; ⚠️ ${results.warn.length} Warnings &nbsp;|&nbsp; ❌ ${results.fail.length} Failed
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="${rowStyle}text-align:left">Page/API</th>
              <th style="${rowStyle}text-align:left">Path</th>
              <th style="${rowStyle}text-align:center">Status</th>
              <th style="${rowStyle}text-align:center">Speed</th>
              <th style="${rowStyle}text-align:left">Note</th>
            </tr>
          </thead>
          <tbody>
            ${makeRows(results.fail, '#cc0000')}
            ${makeRows(results.warn, '#d48806')}
            ${makeRows(results.ok,   '#389e0d')}
          </tbody>
        </table>

        ${results.fail.length > 0 ? `
        <div style="margin-top:24px;padding:16px;background:#fff0f0;border:1px solid #ffcccc;border-radius:8px">
          <strong>⚡ Action Required:</strong> The pages marked ❌ above are showing errors to real users right now. 
          Reply to this email or open your terminal and run:
          <br><br>
          <code style="background:#f5f5f5;padding:4px 8px;border-radius:4px">cd /Users/whitestar/newworld-platform && npm run build 2>&1 | tail -20</code>
        </div>` : ''}

        <p style="color:#aaa;font-size:11px;margin-top:24px">
          This report runs automatically every 12 hours · newworld.education autonomous monitoring
        </p>
      </div>
    `,
  });

  return res.status(200).json({ ok: true, results, totalMs });
}
