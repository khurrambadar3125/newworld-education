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

import { useState, useEffect, useCallback } from "react";

const FREE_DAILY_LIMIT = 25;           // max Starky API calls per day
const STORAGE_KEY      = "nwe_usage"; // localStorage key

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
export const useSessionLimit = () => {
  const [callsUsed, setCallsUsed] = useState(0);

  useEffect(() => {
    setCallsUsed(readUsage().count);
  }, []);

  const callsLeft    = Math.max(0, FREE_DAILY_LIMIT - callsUsed);
  const limitReached = callsUsed >= FREE_DAILY_LIMIT;

  /**
   * Call before each API request.
   * Returns true if the call is allowed, false if limit reached.
   */
  const recordCall = useCallback(() => {
    const current = readUsage().count;
    if (current >= FREE_DAILY_LIMIT) return false;
    const next = current + 1;
    writeUsage(next);
    setCallsUsed(next);
    return true;
  }, []);

  /**
   * Human-readable message for when limit is reached
   */
  const resetMessage =
    "You've had 5 great sessions with Starky today! 🌟 Come back tomorrow for more. " +
    "Your progress is saved and your next challenge is waiting.";

  return { callsUsed, callsLeft, limitReached, recordCall, resetMessage, FREE_DAILY_LIMIT };
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
export const SessionLimitBanner = ({ callsUsed, callsLeft, limitReached, compact = false }) => {
  const pct = (callsUsed / FREE_DAILY_LIMIT) * 100;
  const barColor = limitReached ? "#FF6B6B" : callsLeft <= 1 ? "#FFC300" : "#A8E063";

  if (compact) {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        background: limitReached ? "rgba(255,107,107,0.12)" : "rgba(168,224,99,0.1)",
        border: `1px solid ${limitReached ? "rgba(255,107,107,0.3)" : "rgba(168,224,99,0.25)"}`,
        borderRadius: "20px", padding: "5px 14px",
        fontSize: "12px", fontWeight: "700",
        color: limitReached ? "#FF6B6B" : "#A8E063",
        fontFamily: "'Nunito', sans-serif",
      }}>
        {limitReached ? "⚠️ Daily limit reached" : `⚡ ${callsLeft} sessions left today`}
      </div>
    );
  }

  return (
    <div style={{
      background: limitReached ? "rgba(255,107,107,0.08)" : "rgba(168,224,99,0.07)",
      border: `1px solid ${limitReached ? "rgba(255,107,107,0.25)" : "rgba(168,224,99,0.18)"}`,
      borderRadius: "16px", padding: "14px 18px",
      fontFamily: "'Nunito', sans-serif",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span style={{ fontSize: "13px", fontWeight: "800", color: limitReached ? "#FF6B6B" : "#A8E063" }}>
          {limitReached ? "⚠️ Daily sessions used" : "⚡ Daily Starky sessions"}
        </span>
        <span style={{ fontSize: "13px", fontWeight: "900", color: barColor }}>
          {callsUsed} / {FREE_DAILY_LIMIT}
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
          ? "You've had 5 great sessions today! 🌟 Come back tomorrow — your next challenge is waiting."
          : callsLeft === 1
          ? "Last session for today — make it count! 🎯 More tomorrow."
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
export const LimitReachedModal = ({ onClose, grade }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 600,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    fontFamily: "'Nunito', sans-serif",
  }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{
      background: "linear-gradient(160deg, #0E1635, #0A1220)",
      border: "1px solid rgba(255,195,0,0.3)", borderRadius: "32px",
      padding: "48px", width: "100%", maxWidth: "480px", textAlign: "center",
    }}>
      <div style={{ fontSize: "64px", marginBottom: "20px" }}>🌟</div>
      <h2 style={{ fontWeight: "900", fontSize: "26px", margin: "0 0 12px", color: "#FFC300" }}>
        Amazing work today!
      </h2>
      <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: "1.75", marginBottom: "28px", fontSize: "15px" }}>
        You've completed your <strong style={{ color: "#FFC300" }}>5 Starky sessions</strong> for today.
        That's brilliant dedication{grade ? ` for a ${grade.label} student` : ""}! 🎉<br/><br/>
        Your sessions reset at midnight. Come back tomorrow — Starky has a new challenge waiting just for you.
      </p>

      {/* Dots showing 5/5 */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "28px" }}>
        {Array.from({ length: FREE_DAILY_LIMIT }, (_, i) => (
          <div key={i} style={{
            width: "16px", height: "16px", borderRadius: "50%",
            background: "linear-gradient(135deg, #FFC300, #FF8E53)",
            boxShadow: "0 0 10px rgba(255,195,0,0.4)",
          }} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={onClose} style={{
          background: "linear-gradient(135deg, #63D2FF, #4ECDC4)",
          border: "none", borderRadius: "14px", padding: "15px",
          fontWeight: "900", fontSize: "15px", cursor: "pointer",
          color: "#060B20", fontFamily: "'Nunito', sans-serif",
        }}>
          See My Learning Report 📧
        </button>
        <button onClick={onClose} style={{
          background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "14px", padding: "13px",
          color: "rgba(255,255,255,0.5)", fontSize: "14px",
          cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: "600",
        }}>
          Close
        </button>
      </div>

      <p style={{ marginTop: "18px", fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
        Want unlimited sessions? Ask your school or institution to partner with New World Education.
      </p>
    </div>
  </div>
);
