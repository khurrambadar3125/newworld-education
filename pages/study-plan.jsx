import { useState, useEffect } from "react";
import Head from "next/head";

const EXAM_WINDOWS = [
  { id: 'mj26', label: 'May/June 2026', start: '2026-04-27', end: '2026-06-12' },
  { id: 'on26', label: 'Oct/Nov 2026', start: '2026-10-05', end: '2026-11-20' },
  { id: 'mj27', label: 'May/June 2027', start: '2027-04-26', end: '2027-06-11' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function daysUntil(dateStr) {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000));
}

function getWeekDates(weekOffset = 0) {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7);
  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

export default function StudyPlanPage() {
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [examWindow, setExamWindow] = useState(null);
  const [weaknesses, setWeaknesses] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [completedDays, setCompletedDays] = useState({});
  const [weekOffset, setWeekOffset] = useState(0);
  const [setupMode, setSetupMode] = useState(false);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('nw_user') || '{}');
      setUser(u);
      const savedExam = localStorage.getItem('nw_exam_window');
      if (savedExam) setExamWindow(JSON.parse(savedExam));
      else setSetupMode(true);
      const saved = JSON.parse(localStorage.getItem('nw_plan_completed') || '{}');
      setCompletedDays(saved);

      if (u.email) {
        fetch(`/api/weaknesses?email=${encodeURIComponent(u.email)}`)
          .then(r => r.json())
          .then(data => {
            if (data.weaknesses) setWeaknesses(data.weaknesses);
          }).catch(() => {});

        fetch(`/api/predictions?email=${encodeURIComponent(u.email)}`)
          .then(r => r.json())
          .then(data => {
            if (data.predictions) setPredictions(data.predictions);
          }).catch(() => {});
      }
    } catch {}
  }, []);

  const selectExam = (ew) => {
    setExamWindow(ew);
    localStorage.setItem('nw_exam_window', JSON.stringify(ew));
    setSetupMode(false);
  };

  const toggleComplete = (date) => {
    const updated = { ...completedDays, [date]: !completedDays[date] };
    setCompletedDays(updated);
    localStorage.setItem('nw_plan_completed', JSON.stringify(updated));
  };

  // Generate study plan from weaknesses + predictions
  const generatePlan = () => {
    const allTopics = [];
    // 60% confirmed weaknesses
    weaknesses.forEach(w => {
      allTopics.push({ subject: w.subject, topic: w.weakness_category?.replace(/_/g, ' '), type: 'weakness', severity: w.severity, desc: w.weakness_description });
    });
    // 30% predictions
    predictions.forEach(p => {
      allTopics.push({ subject: p.subject, topic: p.predicted_weakness?.replace(/_/g, ' '), type: 'predicted', desc: p.recommended_action });
    });
    // 10% general revision
    if (allTopics.length > 0) {
      allTopics.push({ subject: 'Mixed', topic: 'Past paper practice', type: 'revision', desc: 'Mixed subject past paper questions' });
    }
    return allTopics;
  };

  const plan = generatePlan();
  const weekDates = getWeekDates(weekOffset);
  const daysLeft = examWindow ? daysUntil(examWindow.start) : null;
  const totalPrepDays = examWindow ? daysUntil(examWindow.start) : 0;
  const progressPct = examWindow ? Math.min(100, Math.max(0, Math.round(((180 - totalPrepDays) / 180) * 100))) : 0;

  const S = {
    page: { minHeight: "100vh", background: "#080C18", fontFamily: "'Sora',-apple-system,sans-serif", color: "#fff" },
    card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: isMobile ? "14px" : "18px" },
  };

  return (
    <div style={S.page}>
      <Head>
        <title>Study Plan — NewWorldEdu</title>
        <meta name="description" content="Personalised Cambridge study plan built around your exam date and weak spots." />
      </Head>

      <header style={{ padding: isMobile ? "12px 16px" : "14px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/student-dashboard" style={{ textDecoration: "none", fontWeight: 900, fontSize: 13, color: "#fff" }}>← Dashboard</a>
        <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 15, color: "#4F8EF7" }}>NewWorldEdu★</a>
      </header>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: isMobile ? "24px 16px" : "40px 24px" }}>

        {/* Exam Setup */}
        {setupMode && (
          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px" }}>When are your exams?</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 20 }}>Select your Cambridge exam series</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300, margin: "0 auto" }}>
              {EXAM_WINDOWS.map(ew => (
                <button key={ew.id} onClick={() => selectExam(ew)}
                  style={{ ...S.card, border: "2px solid rgba(79,142,247,0.3)", cursor: "pointer", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: "#4F8EF7", textAlign: "center" }}>
                  {ew.label}
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Papers begin {ew.start}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exam Countdown */}
        {examWindow && !setupMode && (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, margin: 0 }}>
                  🎯 {daysLeft} days until exams
                </h1>
                <button onClick={() => setSetupMode(true)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
                  Change
                </button>
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 100, height: 10, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", borderRadius: 100, background: daysLeft < 14 ? "linear-gradient(90deg,#FF6B6B,#FFC300)" : "linear-gradient(90deg,#4F8EF7,#4ADE80)", width: `${progressPct}%` }} />
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                {daysLeft < 14
                  ? "⚠️ Final preparation mode. Starky is focusing on highest-risk topics and past paper technique."
                  : `You are ${progressPct}% through your preparation window. Starky recommends ${Math.min(5, Math.max(3, Math.ceil(weaknesses.length * 1.5)))} sessions this week.`}
              </div>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 14px" }}>
              {weekOffset === 0 ? "This week's plan" : weekOffset > 0 ? `Week ${weekOffset + 1}` : `${Math.abs(weekOffset)} week${Math.abs(weekOffset) > 1 ? 's' : ''} ago`}
            </h2>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button onClick={() => setWeekOffset(w => w - 1)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px 14px", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12, fontFamily: "'Sora',sans-serif" }}>← Prev</button>
              <button onClick={() => setWeekOffset(0)} style={{ background: weekOffset === 0 ? "rgba(79,142,247,0.15)" : "rgba(255,255,255,0.06)", border: weekOffset === 0 ? "1px solid rgba(79,142,247,0.3)" : "none", borderRadius: 8, padding: "6px 14px", color: weekOffset === 0 ? "#4F8EF7" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12, fontFamily: "'Sora',sans-serif" }}>This week</button>
              <button onClick={() => setWeekOffset(w => w + 1)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px 14px", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12, fontFamily: "'Sora',sans-serif" }}>Next →</button>
            </div>

            {/* Weekly plan */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
              {DAYS.map((day, i) => {
                const date = weekDates[i];
                const isWeekend = i >= 5;
                const topicIdx = (weekOffset * 5 + i) % Math.max(1, plan.length);
                const topic = isWeekend ? null : plan[topicIdx];
                const done = completedDays[date];

                return (
                  <div key={day} style={{ ...S.card, opacity: isWeekend ? 0.5 : 1, display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => !isWeekend && toggleComplete(date)}
                      style={{ width: 28, height: 28, borderRadius: 8, border: done ? "none" : "2px solid rgba(255,255,255,0.15)", background: done ? "#4ADE80" : "transparent", color: "#060B20", fontSize: 14, cursor: isWeekend ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {done ? "✓" : ""}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>
                        <span style={{ color: "rgba(255,255,255,0.5)", minWidth: 80, display: "inline-block" }}>{day}</span>
                        {isWeekend ? (
                          <span style={{ color: "rgba(255,255,255,0.3)" }}>Rest</span>
                        ) : topic ? (
                          <>
                            <span>{topic.subject}</span>
                            <span style={{ color: "rgba(255,255,255,0.4)", marginLeft: 8, fontSize: 12 }}>
                              {topic.topic}
                              {topic.type === 'predicted' && <span style={{ color: "#A78BFA", marginLeft: 6 }}>predicted risk</span>}
                              {topic.type === 'revision' && <span style={{ color: "#FFC300", marginLeft: 6 }}>revision</span>}
                            </span>
                          </>
                        ) : (
                          <span style={{ color: "rgba(255,255,255,0.3)" }}>No topic assigned</span>
                        )}
                      </div>
                    </div>
                    {!isWeekend && topic && !done && (
                      <a href={`/demo?subject=${encodeURIComponent(topic.subject)}&focus=${encodeURIComponent(topic.topic)}&from=study-plan`}
                        style={{ fontSize: 11, color: "#4F8EF7", textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}>
                        Start →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Plan stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 28 }}>
              <div style={{ ...S.card, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#FF6B6B" }}>{weaknesses.length}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Confirmed weaknesses</div>
              </div>
              <div style={{ ...S.card, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#A78BFA" }}>{predictions.length}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Predicted risks</div>
              </div>
              <div style={{ ...S.card, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#4ADE80" }}>{Object.values(completedDays).filter(Boolean).length}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Sessions completed</div>
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!examWindow && !setupMode && (
          <div style={{ ...S.card, textAlign: "center", padding: "40px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 10px" }}>Set your exam date</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 20 }}>Starky builds your study plan around your Cambridge exam date.</p>
            <button onClick={() => setSetupMode(true)} style={{ background: "linear-gradient(135deg,#4F8EF7,#6366F1)", color: "#fff", border: "none", borderRadius: 14, padding: "14px 32px", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
              Set your exam date →
            </button>
          </div>
        )}
      </div>

      <footer style={{ padding: "20px 16px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>© 2026 NewWorldEdu · khurram@newworld.education</div>
      </footer>
    </div>
  );
}
