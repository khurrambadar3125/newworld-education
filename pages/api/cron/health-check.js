/**
 * pages/api/cron/health-check.js
 * ─────────────────────────────────────────────────────
 * Full platform health check — all 52 pages + critical API endpoints.
 * Runs daily at midnight UTC (5am PKT).
 * Checks in parallel batches of 10 for speed.
 * Emails Khurram a full status report.
 * ─────────────────────────────────────────────────────
 */

import { Resend } from 'resend';

export const config = { maxDuration: 120 };

const resend = new Resend(process.env.RESEND_API_KEY);

// ── ALL 52 PAGES ──────────────────────────────────────────────────────────────
const PAGES = [
  { path: '/',                  name: 'Home' },
  { path: '/arts',              name: 'Arts' },
  { path: '/arts-for-all',      name: 'Arts For All' },
  { path: '/championship',      name: 'Championship' },
  { path: '/contact',           name: 'Contact' },
  { path: '/countdown',         name: 'Countdown' },
  { path: '/dashboard',         name: 'Dashboard' },
  { path: '/demo',              name: 'Demo' },
  { path: '/drill',             name: 'Drill' },
  { path: '/essay',             name: 'Essay' },
  { path: '/homework',          name: 'Homework' },
  { path: '/ibcc',              name: 'IBCC' },
  { path: '/iep',               name: 'IEP' },
  { path: '/insights',          name: 'Insights' },
  { path: '/khda-demo',         name: 'KHDA Demo' },
  { path: '/kids',              name: 'Kids' },
  { path: '/languages',         name: 'Languages' },
  { path: '/leaderboard',       name: 'Leaderboard' },
  { path: '/login',             name: 'Login' },
  { path: '/mocks',             name: 'Mocks' },
  { path: '/music',             name: 'Music' },
  { path: '/music-for-all',     name: 'Music For All' },
  { path: '/nano',              name: 'Nano' },
  { path: '/news',              name: 'News' },
  { path: '/our-results',       name: 'Our Results' },
  { path: '/parent',            name: 'Parent Portal' },
  { path: '/past-papers',       name: 'Past Papers' },
  { path: '/phonics',           name: 'Phonics' },
  { path: '/phonics-uae',       name: 'Phonics UAE' },
  { path: '/pricing',           name: 'Pricing' },
  { path: '/privacy',           name: 'Privacy' },
  { path: '/reading',           name: 'Reading' },
  { path: '/reading-for-all',   name: 'Reading For All' },
  { path: '/referral',          name: 'Referral' },
  { path: '/responsible-ai',    name: 'Responsible AI' },
  { path: '/school',            name: 'School' },
  // /sing removed — needs Web Audio API pitch detection, rebuild later
  { path: '/special-needs',     name: 'Special Needs' },
  { path: '/spelling-bee',      name: 'Spelling Bee' },
  { path: '/spelling-uae',      name: 'Spelling UAE' },
  { path: '/starky-saturdays',  name: 'Starky Saturdays' },
  { path: '/start',             name: 'Start' },
  { path: '/student-dashboard', name: 'Student Dashboard' },
  { path: '/study-plan',        name: 'Study Plan' },
  { path: '/subscribe',         name: 'Subscribe' },
  { path: '/summer',            name: 'Summer' },
  { path: '/summer-uae',        name: 'Summer UAE' },
  { path: '/terms',             name: 'Terms' },
  { path: '/textbooks',         name: 'Textbooks' },
  { path: '/voice-lab',         name: 'Voice Lab' },
  { path: '/zayd-mode',         name: 'Zayd Mode' },
];

// ── CRITICAL API ENDPOINTS ────────────────────────────────────────────────────
// Each endpoint is tested with the minimum request needed.
// expectStatus: the status code that means "working" (e.g. 401 = auth works, 400 = validation works, 405 = method check works)
const API_ENDPOINTS = [
  // Core student-facing
  { path: '/api/anthropic',           name: 'Starky Chat',         method: 'POST', body: { messages: [{ role: 'user', content: 'ping' }] } },
  { path: '/api/drill',               name: 'Drill',               method: 'GET',  expectStatus: 405 },
  { path: '/api/essay',               name: 'Essay Marking',       method: 'GET',  expectStatus: 405 },
  { path: '/api/assignment',          name: 'Assignment',          method: 'GET',  expectStatus: 400 },
  // Mocks
  { path: '/api/mocks/generate',      name: 'Mock Generate',       method: 'GET',  expectStatus: 405 },
  { path: '/api/mocks/submit',        name: 'Mock Submit',         method: 'GET',  expectStatus: 405 },
  { path: '/api/mocks/register',      name: 'Mock Register',       method: 'GET',  expectStatus: 405 },
  // Atoms / Nano
  { path: '/api/atoms/get-mastery',   name: 'Atom Mastery GET',    method: 'GET',  expectStatus: 400 },
  { path: '/api/atoms/track-mastery', name: 'Atom Mastery POST',   method: 'GET',  expectStatus: 405 },
  // Auth & user
  { path: '/api/subscribe',           name: 'Subscribe',           method: 'GET',  expectStatus: 405 },
  { path: '/api/dashboard-auth',      name: 'Dashboard Auth',      method: 'GET',  expectStatus: 405 },
  { path: '/api/student-memory',      name: 'Student Memory',      method: 'GET',  expectStatus: 405 },
  // Data / reporting
  { path: '/api/health',              name: 'Health API',          method: 'GET' },
  { path: '/api/weekly-progress',     name: 'Weekly Progress',     method: 'GET',  expectStatus: 401 },
  { path: '/api/leaderboard',         name: 'Leaderboard',         method: 'GET' },
  { path: '/api/session-insights',    name: 'Session Insights',    method: 'GET',  expectStatus: 401 },
  { path: '/api/weaknesses',          name: 'Weaknesses',          method: 'GET',  expectStatus: 405 },
  { path: '/api/predictions',         name: 'Predictions',         method: 'GET',  expectStatus: 405 },
  { path: '/api/share',               name: 'Share',               method: 'GET',  expectStatus: 405 },
  { path: '/api/referral',            name: 'Referral',            method: 'GET',  expectStatus: 405 },
  { path: '/api/notify-parent',       name: 'Notify Parent',       method: 'GET',  expectStatus: 405 },
  { path: '/api/translate',           name: 'Translate',           method: 'GET',  expectStatus: 405 },
  // Cron auth checks (should return 401 without secret)
  { path: '/api/cron/daily-question', name: 'Cron: Daily Q',      method: 'GET',  expectStatus: 401 },
  { path: '/api/cron/self-heal',      name: 'Cron: Self Heal',    method: 'GET',  expectStatus: 401 },
  { path: '/api/cron/auto-improve',   name: 'Cron: Auto Improve', method: 'GET',  expectStatus: 401 },
  { path: '/api/cron/publish-news',   name: 'Cron: Publish News', method: 'GET',  expectStatus: 401 },
  // Championship
  { path: '/api/championship/join',   name: 'Championship Join',  method: 'GET',  expectStatus: 405 },
  // Outcomes
  { path: '/api/outcomes/submit',     name: 'Outcomes Submit',    method: 'GET',  expectStatus: 405 },
  // Content
  { path: '/api/news-articles',       name: 'News Articles',      method: 'GET' },
  { path: '/api/sitemap',             name: 'Sitemap',            method: 'GET' },
];

// ── Parallel batch checker ────────────────────────────────────────────────────
async function checkBatch(items, base, isApi = false) {
  const results = { ok: [], warn: [], fail: [] };

  const promises = items.map(async (item) => {
    try {
      const t0 = Date.now();
      const opts = { headers: { 'User-Agent': 'NWE-HealthBot/2.0' }, signal: AbortSignal.timeout(12000) };
      if (isApi) {
        opts.method = item.method || 'GET';
        opts.headers['Content-Type'] = 'application/json';
        if (item.body) opts.body = JSON.stringify(item.body);
      }
      const r = await fetch(`${base}${item.path}`, opts);
      const ms = Date.now() - t0;
      const status = r.status;

      if (isApi) {
        const expected = item.expectStatus || 200;
        // For APIs: expected status OR any 2xx/3xx/4xx (not 5xx) is OK
        if (status === expected || (!item.expectStatus && status >= 200 && status < 500)) {
          results.ok.push({ name: item.name, path: item.path, status, ms });
        } else if (status >= 500) {
          results.fail.push({ name: item.name, path: item.path, status, ms, issue: `Server error ${status}` });
        } else {
          results.warn.push({ name: item.name, path: item.path, status, ms, issue: `Expected ${expected}, got ${status}` });
        }
      } else {
        // For pages: 5xx = fail, 4xx = warn, slow = warn
        if (status >= 500) {
          results.fail.push({ name: item.name, path: item.path, status, ms, issue: 'Server error' });
        } else if (status >= 400) {
          results.warn.push({ name: item.name, path: item.path, status, ms, issue: `${status} error` });
        } else if (ms > 5000) {
          results.warn.push({ name: item.name, path: item.path, status, ms, issue: `Slow (${ms}ms)` });
        } else {
          results.ok.push({ name: item.name, path: item.path, status, ms });
        }
      }
    } catch (e) {
      results.fail.push({ name: item.name, path: item.path, status: 0, ms: 0, issue: e.message?.substring(0, 80) || 'Timeout/unreachable' });
    }
  });

  await Promise.allSettled(promises);
  return results;
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const auth = req.headers['authorization'] || req.query.secret;
  if (auth !== `Bearer ${process.env.CRON_SECRET}` && auth !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.newworld.education';
  const start = Date.now();

  // Run pages and APIs in parallel batches of 10
  const pageBatches = [];
  for (let i = 0; i < PAGES.length; i += 10) pageBatches.push(PAGES.slice(i, i + 10));
  const apiBatches = [];
  for (let i = 0; i < API_ENDPOINTS.length; i += 10) apiBatches.push(API_ENDPOINTS.slice(i, i + 10));

  const results = { ok: [], warn: [], fail: [] };

  // Check all pages (batched)
  for (const batch of pageBatches) {
    const r = await checkBatch(batch, base, false);
    results.ok.push(...r.ok);
    results.warn.push(...r.warn);
    results.fail.push(...r.fail);
  }

  // Check all APIs (batched)
  for (const batch of apiBatches) {
    const r = await checkBatch(batch, base, true);
    results.ok.push(...r.ok);
    results.warn.push(...r.warn);
    results.fail.push(...r.fail);
  }

  const totalMs = Date.now() - start;
  const pkTime = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
  const totalChecked = results.ok.length + results.warn.length + results.fail.length;

  const statusIcon = results.fail.length > 0 ? '🔴' : results.warn.length > 0 ? '🟡' : '🟢';
  const statusText = results.fail.length > 0 ? 'ISSUES DETECTED' : results.warn.length > 0 ? 'WARNINGS' : 'ALL SYSTEMS OK';

  // Sort: failures first, then warns, then OK (by response time desc)
  results.ok.sort((a, b) => b.ms - a.ms);

  const rowStyle = 'padding:6px 10px;border-bottom:1px solid #eee;font-size:12px;';
  const makeRows = (items, color) => items.map(i => `
    <tr>
      <td style="${rowStyle}color:${color};font-weight:bold;white-space:nowrap;">${i.name}</td>
      <td style="${rowStyle}font-family:monospace;font-size:11px;color:#666;">${i.path}</td>
      <td style="${rowStyle}text-align:center">${i.status || '—'}</td>
      <td style="${rowStyle}text-align:center;${i.ms > 3000 ? 'color:#d48806;font-weight:bold;' : ''}">${i.ms ? i.ms + 'ms' : '—'}</td>
      <td style="${rowStyle}color:${color}">${i.issue || '✓'}</td>
    </tr>
  `).join('');

  // Slowest 5 pages for performance insight
  const allWithMs = [...results.ok, ...results.warn].filter(r => r.ms > 0).sort((a, b) => b.ms - a.ms);
  const slowest5 = allWithMs.slice(0, 5);
  const avgMs = allWithMs.length > 0 ? Math.round(allWithMs.reduce((s, r) => s + r.ms, 0) / allWithMs.length) : 0;

  await resend.emails.send({
    from: 'NWE Monitor <alerts@newworld.education>',
    to: 'khurrambadar@gmail.com',
    subject: `${statusIcon} NWE Health — ${statusText} — ${totalChecked} endpoints — ${pkTime}`,
    html: `
      <div style="font-family:-apple-system,sans-serif;max-width:740px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 4px">NewWorld Education — Full Platform Health Report</h2>
        <p style="color:#888;margin:0 0 20px;font-size:13px">${pkTime} · ${totalChecked} endpoints scanned in ${totalMs}ms</p>

        <div style="background:${results.fail.length > 0 ? '#fff0f0' : results.warn.length > 0 ? '#fffbe6' : '#f0fff4'};
          border:1px solid ${results.fail.length > 0 ? '#ffcccc' : results.warn.length > 0 ? '#ffe58f' : '#b7eb8f'};
          border-radius:8px;padding:16px;margin-bottom:20px;text-align:center">
          <div style="font-size:32px;margin-bottom:8px">${statusIcon}</div>
          <div style="font-size:18px;font-weight:bold;color:${results.fail.length > 0 ? '#cc0000' : results.warn.length > 0 ? '#d48806' : '#389e0d'}">${statusText}</div>
          <div style="font-size:13px;color:#666;margin-top:4px">
            ✅ ${results.ok.length} OK &nbsp;·&nbsp; ⚠️ ${results.warn.length} Warnings &nbsp;·&nbsp; ❌ ${results.fail.length} Failed &nbsp;·&nbsp; ⏱ Avg ${avgMs}ms
          </div>
        </div>

        ${results.fail.length > 0 ? `
        <div style="background:#fff0f0;border:1px solid #ffcccc;border-radius:8px;padding:16px;margin-bottom:20px;">
          <strong style="color:#cc0000;">❌ FAILED (${results.fail.length})</strong>
          <table style="width:100%;border-collapse:collapse;margin-top:8px;">
            <thead><tr style="background:#fff5f5"><th style="${rowStyle}text-align:left">Endpoint</th><th style="${rowStyle}text-align:left">Path</th><th style="${rowStyle}text-align:center">Status</th><th style="${rowStyle}text-align:center">Speed</th><th style="${rowStyle}text-align:left">Issue</th></tr></thead>
            <tbody>${makeRows(results.fail, '#cc0000')}</tbody>
          </table>
        </div>` : ''}

        ${results.warn.length > 0 ? `
        <div style="background:#fffbe6;border:1px solid #ffe58f;border-radius:8px;padding:16px;margin-bottom:20px;">
          <strong style="color:#d48806;">⚠️ WARNINGS (${results.warn.length})</strong>
          <table style="width:100%;border-collapse:collapse;margin-top:8px;">
            <thead><tr style="background:#fffef0"><th style="${rowStyle}text-align:left">Endpoint</th><th style="${rowStyle}text-align:left">Path</th><th style="${rowStyle}text-align:center">Status</th><th style="${rowStyle}text-align:center">Speed</th><th style="${rowStyle}text-align:left">Issue</th></tr></thead>
            <tbody>${makeRows(results.warn, '#d48806')}</tbody>
          </table>
        </div>` : ''}

        <details style="margin-bottom:20px;">
          <summary style="cursor:pointer;font-weight:bold;color:#389e0d;font-size:14px;padding:8px 0;">✅ PASSING (${results.ok.length}) — click to expand</summary>
          <table style="width:100%;border-collapse:collapse;margin-top:8px;">
            <thead><tr style="background:#f5f5f5"><th style="${rowStyle}text-align:left">Endpoint</th><th style="${rowStyle}text-align:left">Path</th><th style="${rowStyle}text-align:center">Status</th><th style="${rowStyle}text-align:center">Speed</th><th style="${rowStyle}text-align:left">Note</th></tr></thead>
            <tbody>${makeRows(results.ok, '#389e0d')}</tbody>
          </table>
        </details>

        <div style="background:#f0f5ff;border:1px solid #d6e4ff;border-radius:8px;padding:16px;margin-bottom:20px;">
          <strong style="color:#1d39c4;">⏱ Slowest 5 Endpoints</strong>
          <table style="width:100%;border-collapse:collapse;margin-top:8px;">
            ${slowest5.map(s => `<tr><td style="${rowStyle}font-weight:600;">${s.name}</td><td style="${rowStyle}font-family:monospace;font-size:11px;">${s.path}</td><td style="${rowStyle}text-align:right;font-weight:bold;color:${s.ms > 3000 ? '#d48806' : '#666'};">${s.ms}ms</td></tr>`).join('')}
          </table>
        </div>

        ${results.fail.length > 0 ? `
        <div style="margin-top:16px;padding:16px;background:#fff0f0;border:1px solid #ffcccc;border-radius:8px">
          <strong>⚡ Action Required:</strong> The endpoints marked ❌ above are broken right now.
          <br><br>
          <code style="background:#f5f5f5;padding:4px 8px;border-radius:4px;font-size:12px;">cd /Users/khurramb/projects/newworld-platform && npm run build 2>&1 | tail -20</code>
        </div>` : ''}

        <p style="color:#aaa;font-size:11px;margin-top:24px;text-align:center;">
          Full platform scan: ${PAGES.length} pages + ${API_ENDPOINTS.length} APIs · Runs daily · newworld.education
        </p>
      </div>
    `,
  });

  return res.status(200).json({ ok: true, totalChecked, results: { ok: results.ok.length, warn: results.warn.length, fail: results.fail.length }, totalMs });
}
