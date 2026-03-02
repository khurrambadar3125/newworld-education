// utils/analytics.js
// Autonomous platform intelligence tracker
// Tracks user behaviour signals without any PII

const ENDPOINT = "/api/track";

// Detect device type
const getDevice = () => {
  if (typeof window === "undefined") return "server";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
};

// Core event sender
const send = async (event, data = {}) => {
  try {
    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        ...data,
        device: getDevice(),
        page: typeof window !== "undefined" ? window.location.pathname : "unknown",
        ts: new Date().toISOString(),
      }),
    });
  } catch {
    // Silent fail — never disrupt user experience
  }
};

// ── PUBLIC API ────────────────────────────────────────────────────────────────

export const track = {
  // User arrives on a page
  pageView: (page) => send("page_view", { page }),

  // User sends a message to Starky
  messageSent: (subject, messageLength, responseTimeMs) =>
    send("message_sent", { subject, messageLength, responseTimeMs }),

  // Starky returns a response
  responseReceived: (subject, responseLength, errorOccurred = false) =>
    send("response_received", { subject, responseLength, errorOccurred }),

  // User switches subject tab
  subjectChanged: (from, to) => send("subject_changed", { from, to }),

  // User taps a starter question instead of typing
  starterUsed: (subject, starterIndex) =>
    send("starter_used", { subject, starterIndex }),

  // User abandons — leaves without sending a message
  sessionAbandoned: (secondsOnPage, reachedChat) =>
    send("session_abandoned", { secondsOnPage, reachedChat }),

  // User sends N messages (session depth)
  sessionDepth: (subject, messageCount) =>
    send("session_depth", { subject, messageCount }),

  // API error returned to user
  apiError: (page, subject, errorType) =>
    send("api_error", { page, subject, errorType }),

  // Limit reached modal shown
  limitReached: (page) => send("limit_reached", { page }),

  // Special needs profile selected
  profileSelected: (profile) => send("profile_selected", { profile }),

  // User copies Starky's response (engaged enough to copy)
  responseCopied: (subject) => send("response_copied", { subject }),

  // CTA button clicked
  ctaClicked: (label, destination) => send("cta_clicked", { label, destination }),

  // Nav link clicked
  navClicked: (label) => send("nav_clicked", { label }),
};

// ── SESSION ABANDONMENT DETECTOR ─────────────────────────────────────────────
// Call this once per page. Fires when user leaves without messaging Starky.
export const initAbandonmentTracking = (hasMessaged = false) => {
  if (typeof window === "undefined") return () => {};

  const arrived = Date.now();
  let messaged = hasMessaged;
  let scrolled = false;

  const onScroll = () => { scrolled = true; };
  window.addEventListener("scroll", onScroll, { once: true });

  const onUnload = () => {
    const seconds = Math.round((Date.now() - arrived) / 1000);
    if (!messaged) {
      track.sessionAbandoned(seconds, scrolled);
    }
  };

  window.addEventListener("beforeunload", onUnload);

  return {
    markMessaged: () => { messaged = true; },
    cleanup: () => {
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("scroll", onScroll);
    },
  };
};
