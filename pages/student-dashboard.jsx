import { useState, useEffect } from "react";
import Head from "next/head";

// ── Motivational quotes — rotates daily ──────────────────────────
const QUOTES = [
  "Cambridge examiners reward precision. Today, practise it.",
  "One focused session beats three distracted ones.",
  "The A* student studies the mark scheme, not just the topic.",
  "Every past paper question you practise is one fewer surprise in the exam.",
  "The difference between A and A* is the last 15 minutes of preparation.",
  "Starky remembers what you found difficult. Use that.",
  "Exam technique is a skill. Skills improve with practice.",
  "The student who explains can teach. The student who teaches understands.",
  "Your weak spots are your fastest route to more marks.",
  "Consistency beats intensity. Show up today.",
];

function getGreeting(name) {
  const h = new Date().getHours();
  const first = name?.split(' ')[0] || 'there';
  if (h < 12) return `Good morning, ${first}`;
  if (h < 17) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

function getDailyQuote() {
  const day = Math.floor(Date.now() / 86400000);
  return QUOTES[day % QUOTES.length];
}

function daysAgo(dateStr) {
  if (!dateStr) return null;
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  return `${d} days ago`;
}

function getTrafficLight(lastStudied, sessions) {
  if (!lastStudied) return { color: '#FF6B6B', label: 'Not started', emoji: '🔴' };
  const days = Math.floor((Date.now() - new Date(lastStudied).getTime()) / 86400000);
  if (days <= 3 && sessions >= 2) return { color: '#4ADE80', label: 'Strong — keep going', emoji: '🟢' };
  if (days <= 7) return { color: '#FFC300', label: 'Developing — needs attention', emoji: '🟡' };
  return { color: '#FF6B6B', label: 'Weak — priority this week', emoji: '🔴' };
}

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [monthSessions, setMonthSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [weakSpots, setWeakSpots] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('nw_user') || '{}');
      setUser(u);

      // Load session memory for streak/stats
      const mem = JSON.parse(localStorage.getItem(`nw_session_memory_${u.email}`) || '{}');
      setStreak(mem.streak || 0);

      // Load session data from KV via API
      if (u.email) {
        fetch(`/api/student-memory?email=${encodeURIComponent(u.email)}`)
          .then(r => r.json())
          .then(data => {
            if (data) {
              setStreak(data.streak || 0);
              setTotalMinutes(data.totalMinutes || Math.round((data.totalSessions || 0) * 12));
              setWeakSpots((data.recentMistakes || []).slice(0, 5));
              setRecommendations((data.nextGoals || []).slice(0, 3));

              // Build subject health from session history
              const subjectMap = {};
              (data.sessionHistory || []).forEach(s => {
                if (!s.subject) return;
                if (!subjectMap[s.subject]) subjectMap[s.subject] = { name: s.subject, sessions: 0, lastStudied: null, topics: [] };
                subjectMap[s.subject].sessions++;
                if (!subjectMap[s.subject].lastStudied || new Date(s.date) > new Date(subjectMap[s.subject].lastStudied)) {
                  subjectMap[s.subject].lastStudied = s.date;
                }
                if (s.topic && !subjectMap[s.subject].topics.includes(s.topic)) {
                  subjectMap[s.subject].topics.push(s.topic);
                }
              });

              // Also check lastSessionSubject
              if (data.lastSessionSubject && !subjectMap[data.lastSessionSubject]) {
                subjectMap[data.lastSessionSubject] = { name: data.lastSessionSubject, sessions: 1, lastStudied: data.lastSessionDate, topics: [] };
              }

              setSubjects(Object.values(subjectMap).sort((a, b) => (b.sessions || 0) - (a.sessions || 0)));
              setMonthSessions(data.totalSessions || Object.values(subjectMap).reduce((s, v) => s + v.sessions, 0));
            }
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } catch { setLoading(false); }
  }, []);

  const S = {
    page: { minHeight: "100vh", background: "#080C18", fontFamily: "'Sora',-apple-system,sans-serif", color: "#fff" },
    card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: isMobile ? "16px" : "20px" },
  };

  const hasData = subjects.length > 0 || monthSessions > 0;

  return (
    <div style={S.page}>
      <Head>
        <title>My Dashboard — NewWorldEdu</title>
        <meta name="description" content="Track your Cambridge study progress, weak spots, and what to study next." />
      </Head>

      {/* Header */}
      <header style={{ padding: isMobile ? "12px 16px" : "14px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 15, color: "#fff" }}>
          NewWorldEdu<span style={{ color: "#4F8EF7" }}>★</span>
        </a>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/drill" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none", fontWeight: 700 }}>Practice</a>
          <a href="/pricing" style={{ background: "linear-gradient(135deg,#4F8EF7,#6366F1)", borderRadius: 10, padding: "6px 14px", color: "#fff", fontWeight: 800, fontSize: 12, textDecoration: "none" }}>Plans</a>
        </div>
      </header>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: isMobile ? "24px 16px" : "40px 24px" }}>

        {/* ═══ SECTION 1 — Welcome ═══ */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 900, margin: "0 0 8px" }}>
            {getGreeting(user?.name)}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>
            "{getDailyQuote()}"
          </p>
        </div>

        {/* ═══ SECTION 2 — Streak & Stats ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 28 }}>
          {[
            { emoji: "🔥", label: "Day streak", value: streak },
            { emoji: "📚", label: "Sessions this month", value: monthSessions },
            { emoji: "⏱", label: "Study minutes", value: totalMinutes },
          ].map(s => (
            <div key={s.label} style={{ ...S.card, textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: "#4F8EF7" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ═══ EMPTY STATE ═══ */}
        {!loading && !hasData && (
          <div style={{ ...S.card, textAlign: "center", padding: "40px 24px", marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 10px" }}>Your dashboard builds as you learn</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, margin: "0 0 20px", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              Start your first session and Starky will begin tracking your progress, your weak spots, and exactly what to study next.
            </p>
            <a href="/" style={{ display: "inline-block", background: "linear-gradient(135deg,#4F8EF7,#6366F1)", color: "#fff", padding: "14px 32px", borderRadius: 14, fontWeight: 800, fontSize: 16, textDecoration: "none" }}>
              Start your first session →
            </a>
          </div>
        )}

        {/* ═══ SECTION 3 — Subject Health ═══ */}
        {subjects.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 14px" }}>Your subjects</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {subjects.map(s => {
                const tl = getTrafficLight(s.lastStudied, s.sessions);
                return (
                  <div key={s.name} style={S.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>{s.name}</div>
                      <span style={{ fontSize: 11, color: tl.color, fontWeight: 700 }}>{tl.emoji} {tl.label}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                      <span>Last studied: {daysAgo(s.lastStudied) || 'Never'}</span>
                      <span>Sessions: {s.sessions}</span>
                    </div>
                    {s.topics.length > 0 && (
                      <div style={{ marginTop: 6, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                        Topics: {s.topics.slice(-3).join(', ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ SECTION 4 — Weak Spots ═══ */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 14px" }}>Where you are losing marks</h2>
          {weakSpots.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {weakSpots.map((w, i) => (
                <a key={i} href={`/?subject=${encodeURIComponent(w.topic || w.subject || '')}`}
                  style={{ ...S.card, textDecoration: "none", color: "#fff", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <span style={{ color: "#FF6B6B", fontSize: 16 }}>⚠️</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{w.topic || w.subject || 'General'}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{w.description || 'Needs more practice'}</div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ ...S.card, color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.7 }}>
              No weak spots identified yet. Keep studying and Starky will track where you need help.
            </div>
          )}
        </div>

        {/* ═══ SECTION 5 — Recommendations ═══ */}
        {recommendations.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 14px" }}>Starky recommends</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recommendations.map((r, i) => (
                <div key={i} style={S.card}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 10 }}>
                    📖 {typeof r === 'string' ? r : r.goal || r.description || 'Continue practising'}
                  </div>
                  <a href="/" style={{ display: "inline-block", background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.3)", borderRadius: 10, padding: "8px 16px", color: "#4F8EF7", fontWeight: 700, fontSize: 12, textDecoration: "none" }}>
                    Start this session →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SECTION 6 — Recent Sessions ═══ */}
        {subjects.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 14px" }}>Recent sessions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {subjects.slice(0, 5).map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 10 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", minWidth: 70 }}>{daysAgo(s.lastStudied) || '—'}</span>
                  <span style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>{s.name}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.topics.slice(-1)[0] || ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SECTION 7 — Parent Share ═══ */}
        <div style={{ textAlign: "center", padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <a href="/parent" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
            Share this dashboard with a parent →
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: "20px 16px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>© 2026 NewWorldEdu · khurram@newworld.education</div>
      </footer>
    </div>
  );
}
