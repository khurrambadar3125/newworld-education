/**
 * /api/cron/self-heal
 * Runs every 6 hours. Checks platform health, fixes common issues,
 * logs errors for Claude Code to review on next session.
 * PERMANENT: The platform must self-monitor and self-heal.
 */

import { getSupabase } from '../../../utils/supabase';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  const auth = req.headers.authorization;
  if (auth !== process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const sb = getSupabase();
  const results = { checks: [], fixes: [], errors: [], timestamp: new Date().toISOString() };

  // ── CHECK 1: Supabase connectivity ──
  try {
    const { data, error } = await sb?.from('platform_insights').select('date').limit(1);
    if (error) throw new Error(error.message);
    results.checks.push({ name: 'Supabase', status: 'ok' });
  } catch (err) {
    results.checks.push({ name: 'Supabase', status: 'error', message: err.message });
    results.errors.push({ type: 'supabase_down', message: err.message, severity: 'critical' });
  }

  // ── CHECK 2: Anthropic API ──
  try {
    const testRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 5, messages: [{ role: 'user', content: 'hi' }] }),
    });
    if (testRes.ok) results.checks.push({ name: 'Anthropic API', status: 'ok' });
    else {
      const errBody = await testRes.text();
      results.checks.push({ name: 'Anthropic API', status: 'error', message: `HTTP ${testRes.status}` });
      results.errors.push({ type: 'anthropic_api', message: `HTTP ${testRes.status}: ${errBody.slice(0, 200)}`, severity: 'critical' });
    }
  } catch (err) {
    results.checks.push({ name: 'Anthropic API', status: 'error', message: err.message });
    results.errors.push({ type: 'anthropic_api', message: err.message, severity: 'critical' });
  }

  // ── CHECK 3: KV (Redis) ──
  try {
    const kvRes = await fetch(`${process.env.KV_REST_API_URL}/get/health_check`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
    });
    if (kvRes.ok) results.checks.push({ name: 'Upstash KV', status: 'ok' });
    else results.checks.push({ name: 'Upstash KV', status: 'warning', message: `HTTP ${kvRes.status}` });
  } catch (err) {
    results.checks.push({ name: 'Upstash KV', status: 'error', message: err.message });
    results.errors.push({ type: 'kv_down', message: err.message, severity: 'high' });
  }

  // ── CHECK 4: News publishing ──
  if (sb) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const { data } = await sb.from('news_articles').select('id').gte('date', yesterday);
      if (!data?.length) {
        results.checks.push({ name: 'News Publishing', status: 'warning', message: 'No articles published in last 24h' });
        // Auto-fix: trigger news publishing
        try {
          const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.newworld.education';
          await fetch(`${base}/api/cron/publish-news`, { headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` } });
          results.fixes.push({ name: 'News Publishing', action: 'Triggered publish-news cron' });
        } catch {}
      } else {
        results.checks.push({ name: 'News Publishing', status: 'ok', message: `${data.length} articles in last 24h` });
      }
    } catch {}
  }

  // ── CHECK 5: Stale data detection ──
  if (sb) {
    try {
      const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();
      const { data } = await sb.from('platform_insights').select('date').order('date', { ascending: false }).limit(1);
      if (data?.[0]?.date) {
        const lastInsight = new Date(data[0].date);
        const daysSince = Math.floor((Date.now() - lastInsight.getTime()) / 86400000);
        if (daysSince > 2) {
          results.checks.push({ name: 'Signal Analysis', status: 'warning', message: `Last insight ${daysSince} days ago` });
          results.errors.push({ type: 'stale_insights', message: `No platform insights for ${daysSince} days`, severity: 'medium' });
        } else {
          results.checks.push({ name: 'Signal Analysis', status: 'ok' });
        }
      }
    } catch {}
  }

  // ── CHECK 6: Content violations ──
  if (sb) {
    try {
      const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
      const { data } = await sb.from('content_violations').select('id, category').gte('timestamp', oneDayAgo);
      if (data?.length) {
        results.checks.push({ name: 'Content Violations', status: 'alert', message: `${data.length} violations in last 24h` });
        results.errors.push({ type: 'content_violations', message: `${data.length} content violations detected`, severity: 'medium', details: data.slice(0, 5) });
      } else {
        results.checks.push({ name: 'Content Violations', status: 'ok' });
      }
    } catch {}
  }

  // ── Save health report to Supabase ──
  if (sb) {
    try {
      await sb.from('platform_insights').insert({
        date: new Date().toISOString().split('T')[0],
        insight_type: 'health_check',
        data: results,
      });
    } catch {}
  }

  // ── Email alert if critical errors — with deduplication ──
  const criticalErrors = results.errors.filter(e => e.severity === 'critical');
  if (criticalErrors.length > 0) {
    // Deduplication: check if same alert was sent in last 60 seconds
    let shouldSend = true;
    const alertKey = criticalErrors.map(e => e.type).sort().join(',');
    try {
      const kvUrl = process.env.KV_REST_API_URL;
      const kvToken = process.env.KV_REST_API_TOKEN;
      if (kvUrl && kvToken) {
        const lastRes = await fetch(`${kvUrl}/get/last_error_alert`, { headers: { Authorization: `Bearer ${kvToken}` } });
        const lastData = await lastRes.json();
        if (lastData?.result) {
          const last = JSON.parse(lastData.result);
          if (last.key === alertKey && Date.now() - last.timestamp < 60000) {
            shouldSend = false; // Duplicate — skip
          }
        }
        // Save current alert
        await fetch(`${kvUrl}/set/last_error_alert/${encodeURIComponent(JSON.stringify({ key: alertKey, timestamp: Date.now() }))}`, {
          method: 'POST', headers: { Authorization: `Bearer ${kvToken}` },
        });
      }
    } catch {}

    if (shouldSend) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Starky ★ <hello@newworld.education>',
          to: 'khurrambadar@gmail.com',
          subject: `⚠️ NewWorldEdu — ${criticalErrors.length} critical error${criticalErrors.length > 1 ? 's' : ''}`,
          html: `<h2>Platform Health Alert</h2>
<p>Time: ${results.timestamp}</p>
<h3>Critical Errors:</h3>
<ul>${criticalErrors.map(e => `<li><strong>${e.type}</strong>: ${e.message}</li>`).join('')}</ul>
<h3>All Checks:</h3>
<ul>${results.checks.map(c => `<li>${c.status === 'ok' ? '✅' : '❌'} ${c.name}: ${c.status} ${c.message || ''}</li>`).join('')}</ul>
<h3>Auto-Fixes Applied:</h3>
<ul>${results.fixes.length ? results.fixes.map(f => `<li>🔧 ${f.name}: ${f.action}</li>`).join('') : '<li>None needed</li>'}</ul>`,
        });
      } catch {}
    }
  }

  return res.status(200).json(results);
}
