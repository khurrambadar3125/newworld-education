/**
 * pages/api/signals.js
 * Receives batched signals from the client and stores in Supabase.
 */

import { getSupabase } from '../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).end(); }
  }

  const { signals } = body || {};
  if (!signals || !Array.isArray(signals) || signals.length === 0) {
    return res.status(200).json({ ok: true });
  }

  const batch = signals.slice(0, 50);
  const sb = getSupabase();
  if (!sb) return res.status(200).json({ ok: true }); // No Supabase configured — silently skip

  try {
    // Sort signals by type and batch-insert into correct tables
    const messageRows = [];
    const confusionRows = [];
    const drillRows = [];
    const dropoffRows = [];
    const strategyRows = [];

    for (const sig of batch) {
      const base = {
        email: sig.email || 'anonymous',
        created_at: new Date(sig.timestamp || Date.now()).toISOString(),
      };

      if (sig.type === 'message' || sig.type === 'mood' || sig.type === 'satisfaction') {
        messageRows.push({
          ...base,
          signal_type: sig.type,
          subject: sig.subject || null,
          grade: sig.grade || null,
          topic: sig.topic || null,
          language: sig.language || null,
          sentiment: sig.sentiment || null,
          metadata: sig.metadata || {},
        });
      } else if (sig.type === 'confusion') {
        confusionRows.push({
          ...base,
          topic: sig.topic || null,
          grade: sig.grade || null,
          original_question: sig.metadata?.originalQuestion || null,
          starky_response: sig.metadata?.starkyResponse || null,
          confusion_type: sig.metadata?.confusionType || null,
        });
      } else if (sig.type === 'drill') {
        drillRows.push({
          ...base,
          subject: sig.subject || null,
          topic: sig.topic || null,
          score: sig.metadata?.score || 0,
          max_score: sig.metadata?.maxScore || 0,
          time_per_question: sig.metadata?.timePerQuestion || 0,
          hints_used: sig.metadata?.hintsUsed || 0,
          completed: sig.metadata?.completed || false,
        });
      } else if (sig.type === 'dropoff') {
        dropoffRows.push({
          ...base,
          stage: sig.metadata?.stage || sig.type,
          page: sig.metadata?.page || null,
        });
      } else if (sig.type === 'strategy') {
        strategyRows.push({
          ...base,
          subject: sig.subject || null,
          grade: sig.grade || null,
          strategies: sig.metadata?.strategies || [],
          engagement: sig.metadata?.engagement || 'unknown',
          session_number: sig.metadata?.sessionNumber || 1,
          message_index: sig.metadata?.messageIndex || 0,
          starky_preview: sig.metadata?.starkyPreview || null,
          user_preview: sig.metadata?.userPreview || null,
        });
      }
    }

    // Batch insert into Supabase (parallel, each independent so one failure doesn't block others)
    const ops = [];
    if (messageRows.length) ops.push(sb.from('student_signals').insert(messageRows).then(() => {}).catch(() => {}));
    if (confusionRows.length) ops.push(sb.from('confusion_signals').insert(confusionRows).then(() => {}).catch(() => {}));
    if (drillRows.length) ops.push(sb.from('drill_signals').insert(drillRows).then(() => {}).catch(() => {}));
    if (dropoffRows.length) ops.push(sb.from('dropoff_signals').insert(dropoffRows).then(() => {}).catch(() => {}));
    if (strategyRows.length) ops.push(sb.from('strategy_signals').insert(strategyRows).then(() => {}).catch(() => {}));

    await Promise.all(ops);

    return res.status(200).json({ ok: true, stored: batch.length });
  } catch (err) {
    console.error('[SIGNALS API]', err?.message);
    return res.status(200).json({ ok: true }); // Never fail loudly
  }
}
