/**
 * useSessionLimit.js
 * ─────────────────────────────────────────────────────────────────
 * New World Education — Daily Session Limiter
 *
 * Tracks Starky AI calls per user per day using localStorage.
 * Resets automatically at midnight (local time).
 *
 * LIMITS (configurable below):
 *   FREE_DAILY_LIMIT  = 5 sessions/day   → ~$0.05–0.09/student/day on Haiku
 *
 * Usage:
 *   import { useSessionLimit } from './useSessionLimit';
 *   const { callsUsed, callsLeft, limitReached, recordCall, resetMessage } = useSessionLimit();
 * ─────────────────────────────────────────────────────────────────
 */

const EXEMPT_EMAILS = [
  'myusufkhurram1@gmail.com',
  'dinakhurram1@gmail.com',
  'sairakhurram1@gmail.com',
  'bilalkhan25@gmail.com',
  'khanemaanbilal@gmail.com',
  'khurrambadar@gmail.com',
  'kzafar@gmail.com',
];
export function isExemptEmail(email) {
  return EXEMPT_EMAILS.includes(email?.toLowerCase().trim());
}

import { useState, useEffect, useCallback } from "react";

// PERMANENT: 10 free sessions for all users. No time limit. No credit card.
// After 10 sessions, show upgrade prompt. Partner schools get unlimited via free_access_until date.
const FREE_TOTAL_SESSIONS = 10; // Total free sessions (not daily — lifetime)
const FREE_DAILY_LIMIT = 10; // Daily cap even for free users (generous)
const PAID_DAILY_LIMIT = 999; // Effectively unlimited for paid users
const FREE_TRIAL_DAYS = 365; // No time limit on free sessions — 1 year fallback
export function useSessionLimitBypass(email) { return isExemptEmail(email); }
const STORAGE_KEY      = "nwe_usage"; // localStorage key
const TRIAL_KEY        = "nwe_trial_start"; // when the 7-day trial began

/**
 * Returns today's date string as YYYY-MM-DD (local time)
 * Used as the reset key — data auto-expires when the date changes
 */
const todayKey = () => new Date().toLocaleDateString("en-CA"); // "2026-02-28"

/**
 * Read usage object from localStorage
 * Shape: { date: "2026-02-28", count: 3 }
 */
const readUsage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayKey(), count: 0 };
    const parsed = JSON.parse(raw);
    // If stored date is not today, reset
    if (parsed.date !== todayKey()) return { date: todayKey(), count: 0 };
    return parsed;
  } catch {
    return { date: todayKey(), count: 0 };
  }
};

/**
 * Write usage object to localStorage
 */
const writeUsage = (count) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), count }));
  } catch {
    // localStorage unavailable — fail silently, don't block user
  }
};

/**
 * The hook
 */
/**
 * Check if the user's 7-day free trial is still active.
 * Trial starts the first time they use Starky (recorded in localStorage).
 */
const getTrialStatus = () => {
  try {
    let trialStart = localStorage.getItem(TRIAL_KEY);
    if (!trialStart) {
      // First time — start the trial now
      trialStart = new Date().toISOString();
      localStorage.setItem(TRIAL_KEY, trialStart);
    }
    const start = new Date(trialStart);
    const now = new Date();
    const daysPassed = Math.floor((now - start) / 86400000);
    const daysLeft = Math.max(0, FREE_TRIAL_DAYS - daysPassed);
    const trialActive = daysPassed < FREE_TRIAL_DAYS;
    return { trialActive, daysLeft, daysPassed };
  } catch {
    return { trialActive: true, daysLeft: FREE_TRIAL_DAYS, daysPassed: 0 };
  }
};

/**
 * Check if user has a paid subscription (stored in nw_user after PayPal/JazzCash webhook)
 */
const isPaidUser = () => {
  try {
    const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
    return profile.subscriptionActive === true || profile.plan === 'paid' || profile.plan === 'starter' || profile.plan === 'scholar' || profile.plan === 'family' || profile.plan === 'creative-bundle';
  } catch {
    return false;
  }
};

export const useSessionLimit = (email) => {
  const [callsUsed, setCallsUsed] = useState(0);
  const [isSEN, setIsSEN] = useState(false);
  const [hasReferralReward, setHasReferralReward] = useState(false);
  const [paid, setPaid] = useState(false);
  const [trial, setTrial] = useState({ trialActive: true, daysLeft: FREE_TRIAL_DAYS, daysPassed: 0 });

  useEffect(() => {
    setCallsUsed(readUsage().count);
    setPaid(isPaidUser());
    setTrial(getTrialStatus());
    try {
      const profile = JSON.parse(localStorage.getItem('nw_user') || '{}');
      if (profile.senFlag || profile.isSEN) setIsSEN(true);
      // Check referral rewards — free months or unlimited from KV
      if (profile.email) {
        fetch(`/api/referral?action=profile&email=${encodeURIComponent(profile.email)}`)
          .then(r => r.json())
          .then(d => { if (d.freeMonths > 0 || d.tier?.unlimited) setHasReferralReward(true); })
          .catch(() => {});
      }
    } catch {}
    if (typeof window !== 'undefined' && window.location.pathname.includes('special-needs')) {
      setIsSEN(true);
    }
  }, []);

  const isExempt = isExemptEmail(email) || isSEN || hasReferralReward;
  const dailyLimit = paid ? PAID_DAILY_LIMIT : FREE_DAILY_LIMIT;
  const trialExpired = !trial.trialActive && !paid;

  const callsLeft    = Math.max(0, dailyLimit - callsUsed);
  const limitReached = !isExempt && (trialExpired || callsUsed >= dailyLimit);

  /**
   * Call before each API request.
   * Returns true if the call is allowed, false if limit reached.
   */
  const recordCall = useCallback(() => {
    const current = readUsage().count;
    const limit = isPaidUser() ? PAID_DAILY_LIMIT : FREE_DAILY_LIMIT;
    const trialStatus = getTrialStatus();
    if (!isExempt && (!trialStatus.trialActive && !isPaidUser())) return false;
    if (!isExempt && current >= limit) return false;
    const next = current + 1;
    writeUsage(next);
    setCallsUsed(next);
    return true;
  }, []);

  /**
   * Human-readable message for when limit is reached
   */
  const resetMessage = trialExpired
    ? "Your 7-day free trial has ended. Subscribe to continue learning with Starky — plans start at Rs 3,499/month."
    : paid
    ? "You've used all 25 sessions for today! Come back tomorrow for more."
    : "You've had 5 great sessions with Starky today! Come back tomorrow for more, or subscribe for 25 daily sessions.";

  return {
    callsUsed, callsLeft, limitReached, recordCall, resetMessage,
    FREE_DAILY_LIMIT: dailyLimit,
    trialActive: trial.trialActive,
    trialDaysLeft: trial.daysLeft,
    trialExpired,
    isPaid: paid,
  };
};

/**
 * ─────────────────────────────────────────────────────────────────
 * SessionLimitBanner — drop this component anywhere to show usage
 *
 * Props:
 *   callsUsed   : number
 *   callsLeft   : number
 *   limitReached: boolean
 *   compact     : boolean (optional, defaults false)
 * ─────────────────────────────────────────────────────────────────
 */
export const SessionLimitBanner = ({ callsUsed, callsLeft, limitReached, compact = false, trialDaysLeft, trialActive, isPaid }) => {
  const limit = isPaid ? PAID_DAILY_LIMIT : FREE_DAILY_LIMIT;
  const pct = (callsUsed / limit) * 100;
  const barColor = limitReached ? "#FF6B6B" : callsLeft <= 1 ? "#FFC300" : "#A8E063";

  // Hide counter until last 2 sessions (only show when it matters) — but always show trial info
  if (!limitReached && callsLeft > 2 && !trialActive) return null;

  if (compact) {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        background: limitReached ? "rgba(255,107,107,0.12)" : "rgba(168,224,99,0.1)",
        border: `1px solid ${limitReached ? "rgba(255,107,107,0.3)" : "rgba(168,224,99,0.25)"}`,
        borderRadius: "20px", padding: "5px 14px",
        fontSize: "12px", fontWeight: "700",
        color: limitReached ? "#FF6B6B" : "#A8E063",
        fontFamily: "'Sora', sans-serif",
      }}>
        {limitReached ? "Daily limit reached" : `${callsLeft} sessions left`}
        {trialActive && !isPaid ? ` · ${trialDaysLeft}d trial` : ''}
      </div>
    );
  }

  return (
    <div style={{
      background: limitReached ? "rgba(255,107,107,0.08)" : "rgba(168,224,99,0.07)",
      border: `1px solid ${limitReached ? "rgba(255,107,107,0.25)" : "rgba(168,224,99,0.18)"}`,
      borderRadius: "16px", padding: "14px 18px",
      fontFamily: "'Sora', sans-serif",
    }}>
      {/* Trial badge */}
      {trialActive && !isPaid && (
        <div style={{
          display: 'inline-block', background: 'rgba(79,142,247,0.15)', border: '1px solid rgba(79,142,247,0.3)',
          borderRadius: '20px', padding: '3px 12px', fontSize: '11px', fontWeight: '800',
          color: '#4F8EF7', marginBottom: '10px',
        }}>
          Free trial · {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining
        </div>
      )}
      {isPaid && (
        <div style={{
          display: 'inline-block', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
          borderRadius: '20px', padding: '3px 12px', fontSize: '11px', fontWeight: '800',
          color: '#4ADE80', marginBottom: '10px',
        }}>
          Subscribed
        </div>
      )}

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span style={{ fontSize: "13px", fontWeight: "800", color: limitReached ? "#FF6B6B" : "#A8E063" }}>
          {limitReached ? "Daily sessions used" : "Daily Starky sessions"}
        </span>
        <span style={{ fontSize: "13px", fontWeight: "900", color: barColor }}>
          {callsUsed} / {limit}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "10px", height: "8px", overflow: "hidden", marginBottom: "10px" }}>
        <div style={{
          height: "100%", borderRadius: "10px",
          width: `${Math.min(pct, 100)}%`,
          background: `linear-gradient(90deg, ${barColor}, ${barColor}bb)`,
          transition: "width 0.4s ease",
        }} />
      </div>

      {/* Message */}
      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: "1.55" }}>
        {limitReached
          ? isPaid
            ? "You've used all 25 sessions today! Come back tomorrow."
            : "You've had 5 great sessions today! Subscribe for 25 daily sessions."
          : callsLeft === 1
          ? "Last session for today — make it count!"
          : `${callsLeft} sessions remaining today. Resets at midnight.`
        }
      </div>
    </div>
  );
};

/**
 * ─────────────────────────────────────────────────────────────────
 * LimitReachedModal — full-screen overlay when limit is hit
 * ─────────────────────────────────────────────────────────────────
 */
export const LimitReachedModal = ({ onClose, grade, trialExpired, userCountry }) => {
  const isTrialEnd = trialExpired;
  const isUAE = userCountry === 'UAE';
  const JAZZCASH_WA = 'https://wa.me/923262266682?text=I%20want%20to%20subscribe%20to%20NewWorld%20Education%20via%20JazzCash%20(Rs%203%2C499%2Fmonth)';

  return (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 600,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    fontFamily: "'Sora', sans-serif",
  }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{
      background: "linear-gradient(160deg, #0E1635, #0A1220)",
      border: `1px solid ${isTrialEnd ? 'rgba(79,142,247,0.3)' : 'rgba(255,195,0,0.3)'}`, borderRadius: "32px",
      padding: "40px 28px", width: "100%", maxWidth: "480px", textAlign: "center",
    }}>
      <div style={{ fontSize: "56px", marginBottom: "16px" }}>{isTrialEnd ? '🎓' : '🌟'}</div>
      <h2 style={{ fontWeight: "900", fontSize: "24px", margin: "0 0 10px", color: isTrialEnd ? "#4F8EF7" : "#FFC300" }}>
        {isTrialEnd ? 'Your free trial has ended' : 'Amazing work today!'}
      </h2>
      <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: "1.75", marginBottom: "24px", fontSize: "14px" }}>
        {isTrialEnd
          ? <>Your 7-day free trial is over. Starky remembers everything about {grade ? `your ${grade.label} ` : ''}your learning journey — subscribe to continue where you left off.</>
          : <>You've completed your <strong style={{ color: "#FFC300" }}>daily sessions</strong> for today.
            {grade ? ` That's brilliant dedication for a ${grade.label} student!` : ''}<br/><br/>
            Sessions reset at midnight. Come back tomorrow!</>
        }
      </p>

      {/* Subscription CTA */}
      <div style={{
        background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)',
        borderRadius: '16px', padding: '18px', marginBottom: '20px', textAlign: 'left',
      }}>
        <div style={{ fontSize: '13px', fontWeight: '800', color: '#4F8EF7', marginBottom: '8px' }}>{isUAE ? 'SUBSCRIBE — UNLOCK UNLIMITED SUMMER SESSIONS' : 'SUBSCRIBE — UNLOCK 25 DAILY SESSIONS'}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
          <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>{isUAE ? 'AED 129' : 'Rs 3,499'}</span>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>/month</span>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
          {isUAE ? '25 Starky sessions daily · All 5 curricula · EmSAT prep · Summer Passport · Parent reports' : '25 Starky sessions daily · All subjects · Parent reports · Voice + camera · Session memory'}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {!isUAE && <a href={JAZZCASH_WA} target="_blank" rel="noopener noreferrer" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          background: "linear-gradient(135deg, #B71C1C, #E53935)",
          border: "none", borderRadius: "14px", padding: "15px",
          fontWeight: "900", fontSize: "15px", cursor: "pointer",
          color: "#fff", fontFamily: "'Sora', sans-serif",
          textDecoration: "none",
        }}>
          Pay via JazzCash (WhatsApp) — Rs 3,499
        </a>}
        <a href="/pricing" style={{
          display: "block",
          background: "linear-gradient(135deg, #4F8EF7, #6366F1)",
          border: "none", borderRadius: "14px", padding: "15px",
          fontWeight: "900", fontSize: "15px", cursor: "pointer",
          color: "#fff", fontFamily: "'Sora', sans-serif",
          textDecoration: "none", textAlign: "center",
        }}>
          See All Plans (PayPal)
        </a>
        {!isTrialEnd && (
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "14px", padding: "13px",
            color: "rgba(255,255,255,0.5)", fontSize: "14px",
            cursor: "pointer", fontFamily: "'Sora', sans-serif", fontWeight: "600",
          }}>
            Close — Come back tomorrow
          </button>
        )}
        {isTrialEnd && (
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "14px", padding: "13px",
            color: "rgba(255,255,255,0.5)", fontSize: "14px",
            cursor: "pointer", fontFamily: "'Sora', sans-serif", fontWeight: "600",
          }}>
            Close
          </button>
        )}
      </div>

      <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap', marginTop:12 }}>
        {(isUAE ? [{href:'/languages',label:'🌍 Languages'},{href:'/countdown',label:'⏱️ Countdown'},{href:'/leaderboard',label:'🏆 Leaderboard'},{href:'/summer-uae',label:'☀️ Summer'}] : [{href:'/spelling-bee',label:'🐝 Spelling Bee'},{href:'/languages',label:'🌍 Languages'},{href:'/countdown',label:'⏱️ Countdown'},{href:'/leaderboard',label:'🏆 Leaderboard'}]).map(l => (
          <a key={l.href} href={l.href} style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textDecoration:'none', padding:'4px 10px', borderRadius:20, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>{l.label}</a>
        ))}
      </div>
      <p style={{ fontSize:11, color:'rgba(255,255,255,0.2)', marginTop:8, textAlign:'center' }}>These features are free — no session limit!</p>

      <p style={{ marginTop: "16px", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
        Schools & institutions: contact hello@newworld.education for group pricing
      </p>
    </div>
  </div>
  );
};
