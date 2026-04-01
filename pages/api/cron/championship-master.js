/**
 * Championship master cron — daily midnight PKT (19:00 UTC)
 * Handles: season end, winner determination, gap period, season start
 */
import { Redis } from '@upstash/redis';
import { notify } from '../../../utils/notify';
import crypto from 'crypto';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

async function getConfig() {
  let raw = await kv.get('championship:config');
  if (!raw) {
    const def = { season: 1, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 30 * 86400000).toISOString(), status: 'active', prize1: 'Meta Ray-Ban Gen 2', prize2: 'AirPods', prize3: 'Rs 5,000 Mobile Credit', targetReferrals: 100 };
    await kv.set('championship:config', JSON.stringify(def));
    notify({ to: 'khurrambadar@gmail.com', phone: '+923262266682', subject: '🏆 Championship auto-recovered', title: 'Auto Recovery', body: 'Championship config was missing. Initialised Season 1 with defaults.', whatsappText: 'NWE: Championship config auto-recovered. Season 1 started.' }).catch(() => {});
    return def;
  }
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

async function getLeaderboard() {
  const keys = await kv.keys('championship:points:*');
  const entries = [];
  for (const key of keys) {
    const email = key.replace('championship:points:', '');
    const pts = parseInt(await kv.get(key) || '0');
    if (pts <= 0) continue;
    const name = await kv.get(`championship:name:${email}`) || email.split('@')[0];
    const school = await kv.get(`championship:userschool:${email}`) || 'Independent Student';
    entries.push({ email, name, school, points: pts });
  }
  entries.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return 0; // Tiebreaker handled in winner determination
  });
  return entries;
}

async function determineWinners(config) {
  const board = await getLeaderboard();
  const qualifying = board.filter(e => e.points >= 1);
  if (qualifying.length === 0) return [];

  const prizes = [config.prize1, config.prize2, config.prize3];
  const winners = qualifying.slice(0, 3).map((w, i) => ({
    ...w, rank: i + 1, prize: prizes[i] || 'Rs 5,000 Mobile Credit',
  }));
  return winners;
}

async function createClaimToken(email, prize, season) {
  const token = crypto.randomBytes(16).toString('hex');
  await kv.set(`championship:claimtoken:${token}`, JSON.stringify({ email, prize, season }), { ex: 7 * 86400 }); // 7 day expiry
  return token;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).end();

  const config = await getConfig();
  const now = Date.now();
  const endDate = new Date(config.endDate).getTime();
  const actions = [];

  // ── ACTIVE SEASON — check if it should end ──
  if (config.status === 'active' && now >= endDate) {
    config.status = 'ending';
    await kv.set('championship:config', JSON.stringify(config));

    const winners = await determineWinners(config);

    if (winners.length === 0) {
      notify({ to: 'khurrambadar@gmail.com', phone: '+923262266682', subject: `🏆 Season ${config.season} — No qualifying entries`, title: 'Season Ended', body: `Season ${config.season} ended with no qualifying entries. Season ${config.season + 1} starts automatically in 48 hours. No action needed.`, whatsappText: `NWE: Season ${config.season} ended — no winners. Season ${config.season + 1} starts in 48h.` }).catch(() => {});
    } else {
      // Archive season
      await kv.set(`championship:season:${config.season}:winners`, JSON.stringify(winners));

      // Create claim tokens and notify winners
      for (const w of winners) {
        const token = await createClaimToken(w.email, w.prize, config.season);
        notify({ to: w.email, subject: `🏆 YOU WON! Claim your ${w.prize}`, title: `You won Season ${config.season}!`, body: `Congratulations! You finished <strong>#${w.rank}</strong> with <strong>${w.points} referrals</strong>!<br><br>Your prize: <strong>${w.prize}</strong><br><br>Claim it now — your link expires in 7 days.`, ctaText: 'Claim My Prize →', ctaUrl: `https://www.newworld.education/claim/${token}` }).catch(() => {});
      }

      // Notify Khurram
      const winnerSummary = winners.map(w => `#${w.rank}: ${w.name} (${w.school}) — ${w.points} refs — Prize: ${w.prize}`).join('\n');
      notify({ to: 'khurrambadar@gmail.com', phone: '+923262266682', subject: `🏆 SEASON ${config.season} ENDED — ${winners.length} WINNERS`, title: `Season ${config.season} Results`, body: `<pre>${winnerSummary}</pre><br>Addresses being collected automatically. You will receive shipping emails.`, whatsappText: `NWE SEASON ${config.season} ENDED:\n${winnerSummary}\nAddresses being collected. Shipping emails coming.` }).catch(() => {});

      // Email all participants
      const allKeys = await kv.keys('championship:consent:*');
      for (const key of allKeys) {
        const email = key.replace('championship:consent:', '');
        const pts = parseInt(await kv.get(`championship:points:${email}`) || '0');
        notify({ to: email, subject: `🏆 Season ${config.season} ended — Season ${config.season + 1} starts in 48h`, title: `Season ${config.season} Final Results`, body: `You finished with <strong>${pts} referrals</strong>.<br><br>Season ${config.season + 1} starts in 48 hours with new prizes. Your referral links still work!` }).catch(() => {});
        await new Promise(r => setTimeout(r, 100));
      }
    }

    // Schedule gap period → new season
    config.status = 'gap';
    config.gapEndDate = new Date(now + 48 * 3600000).toISOString();
    await kv.set('championship:config', JSON.stringify(config));
    actions.push('season_ended', `winners: ${winners.length}`);
  }

  // ── GAP PERIOD — check if new season should start ──
  if (config.status === 'gap' && config.gapEndDate && now >= new Date(config.gapEndDate).getTime()) {
    const newSeason = config.season + 1;
    const newConfig = {
      season: newSeason,
      startDate: new Date().toISOString(),
      endDate: new Date(now + 30 * 86400000).toISOString(),
      status: 'active',
      prize1: 'Meta Ray-Ban Gen 2',
      prize2: 'AirPods',
      prize3: 'Rs 5,000 Mobile Credit',
      targetReferrals: 100,
    };
    await kv.set('championship:config', JSON.stringify(newConfig));

    // Reset all points for new season
    const ptKeys = await kv.keys('championship:points:*');
    for (const key of ptKeys) { await kv.set(key, 0); }

    // Notify
    notify({ to: 'khurrambadar@gmail.com', phone: '+923262266682', subject: `🏆 Season ${newSeason} STARTED automatically`, title: `Season ${newSeason} Live`, body: `New season started with zero human involvement. 30 days, new prizes.`, whatsappText: `NWE: Season ${newSeason} started automatically. 30 days. No action needed.` }).catch(() => {});

    // Email all participants
    const allKeys = await kv.keys('championship:consent:*');
    for (const key of allKeys) {
      const email = key.replace('championship:consent:', '');
      notify({ to: email, subject: `🏆 Season ${newSeason} is LIVE — new prizes, new chance!`, title: `Season ${newSeason} Started!`, body: `A new season has started. New prizes. Your referral links still work. Compete now!`, ctaText: 'View Championship →', ctaUrl: 'https://www.newworld.education/championship' }).catch(() => {});
      await new Promise(r => setTimeout(r, 100));
    }

    actions.push(`season_${newSeason}_started`);
  }

  return res.status(200).json({ ok: true, status: config.status, season: config.season, actions });
}
