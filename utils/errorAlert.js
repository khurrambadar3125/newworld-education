/**
 * utils/errorAlert.js — Centralized Error Alerting
 *
 * Catches API failures, cron failures, circuit breaker events,
 * and emails Khurram immediately with deduplication.
 *
 * Usage in any API route:
 *   import { withErrorAlert, reportError } from '../../utils/errorAlert';
 *
 *   // Option 1: Wrap entire handler
 *   export default withErrorAlert(async function handler(req, res) { ... });
 *
 *   // Option 2: Report manually
 *   reportError({ endpoint: '/api/foo', error: err, severity: 'high' });
 */

// In-memory deduplication — prevents email storms
// Key = error fingerprint, Value = timestamp of last email
const recentAlerts = new Map();
const DEDUP_WINDOW = 300000; // 5 minutes — same error won't re-email within this window
const ALERT_EMAIL = 'khurrambadar@gmail.com';

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, ts] of recentAlerts) {
    if (now - ts > DEDUP_WINDOW * 2) recentAlerts.delete(key);
  }
}, 600000);

/**
 * Send an error alert email via Resend.
 * Deduplicates by error fingerprint within 5-minute window.
 */
async function reportError({ endpoint, error, severity = 'high', context = {}, req = null }) {
  const errorMessage = typeof error === 'string' ? error : (error?.message || 'Unknown error');
  const fingerprint = `${endpoint}:${severity}:${errorMessage.slice(0, 100)}`;

  // Deduplication check
  const lastSent = recentAlerts.get(fingerprint);
  if (lastSent && Date.now() - lastSent < DEDUP_WINDOW) return;
  recentAlerts.set(fingerprint, Date.now());

  const pkTime = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
  const method = req?.method || context.method || 'UNKNOWN';
  const userAgent = req?.headers?.['user-agent']?.slice(0, 100) || '';
  const userId = context.userId || req?.body?.userProfile?.email || req?.headers?.['x-forwarded-for'] || '';
  const stack = error?.stack || '';

  const severityColor = severity === 'critical' ? '#cc0000' : severity === 'high' ? '#e65100' : '#d48806';
  const severityIcon = severity === 'critical' ? '🔴' : severity === 'high' ? '🟠' : '🟡';

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Starky Alerts <alerts@newworld.education>',
      to: ALERT_EMAIL,
      subject: `${severityIcon} API Error — ${endpoint} — ${severity.toUpperCase()}`,
      html: `<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0A1628;color:#FAF6EB;">
  <h2 style="color:${severityColor};margin:0 0 16px;">${severityIcon} API Error Alert</h2>
  <table style="width:100%;border-collapse:collapse;font-size:13px;">
    <tr><td style="padding:8px;color:rgba(250,246,235,0.5);width:110px;">Endpoint</td><td style="padding:8px;color:#FAF6EB;font-weight:700;">${endpoint}</td></tr>
    <tr><td style="padding:8px;color:rgba(250,246,235,0.5);">Severity</td><td style="padding:8px;color:${severityColor};font-weight:700;">${severity.toUpperCase()}</td></tr>
    <tr><td style="padding:8px;color:rgba(250,246,235,0.5);">Time (PKT)</td><td style="padding:8px;color:#FAF6EB;">${pkTime}</td></tr>
    <tr><td style="padding:8px;color:rgba(250,246,235,0.5);">Method</td><td style="padding:8px;color:#FAF6EB;">${method}</td></tr>
    <tr><td style="padding:8px;color:rgba(250,246,235,0.5);">Error</td><td style="padding:8px;color:#ff6b6b;font-weight:700;">${errorMessage}</td></tr>
    ${userId ? `<tr><td style="padding:8px;color:rgba(250,246,235,0.5);">User</td><td style="padding:8px;color:#FAF6EB;">${userId}</td></tr>` : ''}
    ${userAgent ? `<tr><td style="padding:8px;color:rgba(250,246,235,0.5);">UA</td><td style="padding:8px;color:rgba(250,246,235,0.4);font-size:11px;">${userAgent}</td></tr>` : ''}
  </table>
  ${stack ? `<div style="margin-top:16px;"><div style="color:rgba(250,246,235,0.5);font-size:11px;margin-bottom:4px;">Stack Trace</div><pre style="background:rgba(250,246,235,0.04);padding:12px;border-radius:8px;font-size:11px;overflow-x:auto;color:rgba(250,246,235,0.6);border:1px solid rgba(250,246,235,0.06);">${stack.slice(0, 1500)}</pre></div>` : ''}
  ${Object.keys(context).length ? `<div style="margin-top:12px;"><div style="color:rgba(250,246,235,0.5);font-size:11px;margin-bottom:4px;">Context</div><pre style="background:rgba(250,246,235,0.04);padding:12px;border-radius:8px;font-size:11px;color:rgba(250,246,235,0.6);border:1px solid rgba(250,246,235,0.06);">${JSON.stringify(context, null, 2).slice(0, 800)}</pre></div>` : ''}
  <p style="color:rgba(250,246,235,0.3);font-size:11px;margin-top:20px;">Automated alert from newworld.education error monitoring</p>
</div>`,
    });
  } catch (emailErr) {
    console.error('[errorAlert] Failed to send alert email:', emailErr.message);
  }
}

/**
 * Report circuit breaker events — fires when Starky API is overwhelmed.
 */
async function reportCircuitBreaker({ failures, cooldownSeconds }) {
  await reportError({
    endpoint: '/api/anthropic (CIRCUIT BREAKER)',
    error: `Circuit breaker OPEN after ${failures} consecutive failures. Cooling down for ${cooldownSeconds}s. All student chat requests are being rejected.`,
    severity: 'critical',
    context: { failures, cooldownSeconds, impact: 'ALL STUDENTS AFFECTED — chat is down' },
  });
}

/**
 * Report cron job failures.
 */
async function reportCronFailure({ cronName, error }) {
  await reportError({
    endpoint: `/api/cron/${cronName}`,
    error,
    severity: 'high',
    context: { type: 'cron_failure', cronName },
  });
}

/**
 * HOC: Wrap any API handler to automatically catch and report unhandled errors.
 * The handler still returns the error to the client — this just adds alerting.
 *
 * Usage:
 *   export default withErrorAlert(async function handler(req, res) { ... });
 */
function withErrorAlert(handler, endpointName) {
  return async function wrappedHandler(req, res) {
    try {
      return await handler(req, res);
    } catch (err) {
      const endpoint = endpointName || req.url?.split('?')[0] || 'unknown';
      console.error(`[${endpoint}] Unhandled error:`, err?.message || err);

      // Report the error (non-blocking — don't let email failure affect response)
      reportError({ endpoint, error: err, severity: 'high', req }).catch(() => {});

      // Return 500 to client if response hasn't been sent yet
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}

module.exports = {
  reportError,
  reportCircuitBreaker,
  reportCronFailure,
  withErrorAlert,
};
