/**
 * utils/apiAuth.js — Shared API authentication helpers
 *
 * Provides consistent auth checking across all API endpoints.
 * Three levels:
 *   1. requireStudent(req) — validates student owns this data
 *   2. requireAdmin(req) — validates admin password
 *   3. requireCron(req) — validates cron secret
 */

/**
 * Extract student identity from request.
 * Checks: Authorization header, x-student-email header, or body.email/body.studentId.
 * Returns { email, authenticated } or null.
 */
function getStudentFromRequest(req) {
  // Check Authorization header (Bearer token = email for now, upgrade to JWT later)
  const auth = req.headers['authorization'];
  if (auth?.startsWith('Bearer ')) {
    return { email: auth.slice(7).trim().toLowerCase(), authenticated: true };
  }
  // Check custom header
  const headerEmail = req.headers['x-student-email'];
  if (headerEmail) {
    return { email: headerEmail.trim().toLowerCase(), authenticated: true };
  }
  // Check body
  const bodyEmail = req.body?.email || req.body?.studentId || req.body?.studentEmail;
  if (bodyEmail) {
    return { email: bodyEmail.trim().toLowerCase(), authenticated: false };
  }
  // Check query
  const queryEmail = req.query?.email || req.query?.studentId || req.query?.studentEmail;
  if (queryEmail) {
    return { email: queryEmail.trim().toLowerCase(), authenticated: false };
  }
  return null;
}

/**
 * Validate that the requesting user owns the data they're accessing.
 * For now: checks that the requested studentId matches the authenticated student.
 * Returns { valid, email, error } object.
 */
function validateStudentAccess(req, requestedStudentId) {
  const student = getStudentFromRequest(req);
  if (!student) {
    return { valid: false, email: null, error: 'Student identity required' };
  }

  // If requesting data for a specific student, verify ownership
  if (requestedStudentId) {
    const requested = requestedStudentId.trim().toLowerCase();
    // Allow if: same email, OR admin password provided, OR cron secret provided
    if (student.email === requested || isAdmin(req) || isCron(req)) {
      return { valid: true, email: student.email };
    }
    return { valid: false, email: student.email, error: 'Cannot access other student data' };
  }

  return { valid: true, email: student.email };
}

/**
 * Check if request has admin credentials
 */
function isAdmin(req) {
  const pw = req.headers['x-admin-password'] || req.query?.password;
  return pw && (pw === process.env.DASHBOARD_PASSWORD || pw === process.env.DASHBOARD_ADMIN_PASSWORD);
}

/**
 * Check if request has cron secret
 */
function isCron(req) {
  const auth = req.headers['authorization'] || req.query?.secret;
  return auth === `Bearer ${process.env.CRON_SECRET}` || auth === process.env.CRON_SECRET;
}

/**
 * Rate limiter — per-IP, configurable window and max
 */
const rateLimitMaps = {};
function rateLimit(key, maxPerMinute = 10) {
  if (!rateLimitMaps[key]) rateLimitMaps[key] = new Map();
  const map = rateLimitMaps[key];
  return function checkRate(req) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    const entry = map.get(ip);
    if (!entry || now - entry.start > 60000) {
      map.set(ip, { start: now, count: 1 });
      return true;
    }
    if (entry.count >= maxPerMinute) return false;
    entry.count++;
    return true;
  };
}

// Clean up rate limit maps every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.values(rateLimitMaps).forEach(map => {
    for (const [key, entry] of map) {
      if (now - entry.start > 120000) map.delete(key);
    }
  });
}, 300000);

module.exports = {
  getStudentFromRequest,
  validateStudentAccess,
  isAdmin,
  isCron,
  rateLimit,
};
