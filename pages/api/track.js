// pages/api/track.js
// Receives user behaviour events and stores them for analysis
// Storage: Vercel KV (Redis) — zero config on Vercel dashboard

import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const event = req.body;

    // Sanitise — never store anything that could be PII
    const safe = {
      event: event.event,
      device: event.device,
      page: event.page,
      ts: event.ts || new Date().toISOString(),
      // Behavioural data only
      subject: event.subject,
      from: event.from,
      to: event.to,
      messageLength: event.messageLength,
      responseLength: event.responseLength,
      responseTimeMs: event.responseTimeMs,
      secondsOnPage: event.secondsOnPage,
      reachedChat: event.reachedChat,
      errorOccurred: event.errorOccurred,
      errorType: event.errorType,
      messageCount: event.messageCount,
      profile: event.profile,
      starterIndex: event.starterIndex,
      label: event.label,
      destination: event.destination,
    };

    // Build the day key: "events:2026-03-02"
    const day = safe.ts.split("T")[0];
    const key = `events:${day}`;

    // Append to today's list (capped at 2000 events/day)
    const existing = await kv.get(key) || [];
    if (existing.length < 2000) {
      existing.push(safe);
      await kv.set(key, existing, { ex: 60 * 60 * 24 * 30 }); // 30 days TTL
    }

    // Also update running counters for quick stats
    const counterKey = `counters:${day}`;
    const counters = await kv.get(counterKey) || {};
    counters[safe.event] = (counters[safe.event] || 0) + 1;
    if (safe.device) counters[`device:${safe.device}`] = (counters[`device:${safe.device}`] || 0) + 1;
    if (safe.subject) counters[`subject:${safe.subject}`] = (counters[`subject:${safe.subject}`] || 0) + 1;
    await kv.set(counterKey, counters, { ex: 60 * 60 * 24 * 30 });

    res.status(200).json({ ok: true });
  } catch (err) {
    // Silent fail — never break the user experience
    res.status(200).json({ ok: true });
  }
}
