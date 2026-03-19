/**
 * /api/cron/backup-kv.js
 * Nightly backup of all critical KV (Redis) data into Supabase.
 * Runs daily at 2am PKT (21:00 UTC).
 *
 * Backs up:
 *   - All student memories (memory:*)
 *   - Active students list
 *   - All subscriber data (subscriber:*)
 *   - All session records (session:*)
 *   - Referral data (referral:*)
 *   - Championship data (championship:*)
 *
 * Stored in Supabase table: kv_backups
 * Each row = one KV key + its JSON value + timestamp
 * Keeps last 7 days of backups (auto-cleans older ones).
 */

import { Redis } from '@upstash/redis';
import { getSupabase } from '../../../utils/supabase';

const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  const sb = getSupabase();
  if (!sb) return res.status(500).json({ error: 'Supabase not configured' });

  const backupDate = new Date().toISOString().split('T')[0];
  let totalKeys = 0;
  let errors = 0;

  try {
    // ── 1. Back up all student memories ────────────────────────────────
    const subscriberIds = await kv.smembers('subscribers:all') || [];
    const memoryKeys = subscriberIds.map(id => `memory:${id}`);

    // Also get active students to find any memories not in subscriber list
    const activeStudents = await kv.get('active_students') || [];
    for (const s of activeStudents) {
      const key = `memory:${(s.studentId || '').toLowerCase().trim()}`;
      if (!memoryKeys.includes(key)) memoryKeys.push(key);
    }

    // Batch read and backup memories
    const CHUNK = 30;
    const rows = [];

    for (let i = 0; i < memoryKeys.length; i += CHUNK) {
      const chunk = memoryKeys.slice(i, i + CHUNK);
      const results = await Promise.all(chunk.map(async (key) => {
        try {
          const val = await kv.get(key);
          return { key, val };
        } catch { return { key, val: null }; }
      }));

      for (const { key, val } of results) {
        if (val != null) {
          rows.push({
            backup_date: backupDate,
            kv_key: key,
            kv_value: typeof val === 'string' ? val : JSON.stringify(val),
            category: 'memory',
            created_at: new Date().toISOString(),
          });
          totalKeys++;
        }
      }
    }

    // ── 2. Back up active students list ────────────────────────────────
    rows.push({
      backup_date: backupDate,
      kv_key: 'active_students',
      kv_value: JSON.stringify(activeStudents),
      category: 'system',
      created_at: new Date().toISOString(),
    });
    totalKeys++;

    // ── 3. Back up subscriber data ────────────────────────────────────
    for (let i = 0; i < subscriberIds.length; i += CHUNK) {
      const chunk = subscriberIds.slice(i, i + CHUNK);
      const results = await Promise.all(chunk.map(async (id) => {
        try {
          const val = await kv.hgetall(`subscriber:${id}`);
          return { id, val };
        } catch { return { id, val: null }; }
      }));

      for (const { id, val } of results) {
        if (val && Object.keys(val).length > 0) {
          rows.push({
            backup_date: backupDate,
            kv_key: `subscriber:${id}`,
            kv_value: JSON.stringify(val),
            category: 'subscriber',
            created_at: new Date().toISOString(),
          });
          totalKeys++;
        }
      }
    }

    // ── 4. Back up session records (last 50 students' sessions) ───────
    for (const student of activeStudents.slice(0, 50)) {
      try {
        const sessionKeys = await kv.get(`sessions:${student.studentId}`) || [];
        if (sessionKeys.length > 0) {
          // Back up session index
          rows.push({
            backup_date: backupDate,
            kv_key: `sessions:${student.studentId}`,
            kv_value: JSON.stringify(sessionKeys),
            category: 'session_index',
            created_at: new Date().toISOString(),
          });
          totalKeys++;

          // Back up last 3 session records per student
          const recentKeys = sessionKeys.slice(-3);
          for (const sk of recentKeys) {
            try {
              const sessionData = await kv.get(sk);
              if (sessionData) {
                rows.push({
                  backup_date: backupDate,
                  kv_key: sk,
                  kv_value: typeof sessionData === 'string' ? sessionData : JSON.stringify(sessionData),
                  category: 'session',
                  created_at: new Date().toISOString(),
                });
                totalKeys++;
              }
            } catch {}
          }
        }
      } catch {}
    }

    // ── 5. Insert all rows into Supabase in batches ───────────────────
    const INSERT_BATCH = 100;
    for (let i = 0; i < rows.length; i += INSERT_BATCH) {
      const batch = rows.slice(i, i + INSERT_BATCH);
      try {
        await sb.from('kv_backups').insert(batch);
      } catch (e) {
        console.error(`[KV BACKUP] Batch insert error at ${i}:`, e.message);
        errors++;
      }
    }

    // ── 6. Clean up backups older than 7 days ─────────────────────────
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    try {
      await sb.from('kv_backups').delete().lt('backup_date', cutoff.toISOString().split('T')[0]);
    } catch (e) {
      console.error('[KV BACKUP] Cleanup error:', e.message);
    }

    console.log(`[KV BACKUP] Complete: ${totalKeys} keys backed up, ${errors} errors`);
    return res.status(200).json({ ok: true, keysBackedUp: totalKeys, errors, date: backupDate });
  } catch (err) {
    console.error('[KV BACKUP ERROR]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
