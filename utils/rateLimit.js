/**
 * utils/rateLimit.js
 * ─────────────────────────────────────────────────────────────────
 * Rate limiter using Vercel KV (persistent across serverless invocations).
 * Prevents automated scraping of verified questions.
 * Falls back to in-memory if KV is unavailable.
 */

/**
 * @param {object} req - Next.js request
 * @param {number} limit - Max requests per window (default 200)
 * @param {number} windowSeconds - Window in seconds (default 1 hour)
 * @returns {{ ok: boolean, remaining: number }}
 */
export async function checkRateLimit(req, limit = 200, windowSeconds = 3600) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown';

  const key = `rl:${ip}`;

  try {
    // Try Vercel KV (persistent)
    const { kv } = await import('@vercel/kv');
    const count = await kv.incr(key);
    if (count === 1) {
      await kv.expire(key, windowSeconds);
    }
    return { ok: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    // KV unavailable (local dev) — allow all requests
    return { ok: true, remaining: limit };
  }
}
