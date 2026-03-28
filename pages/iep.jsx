import { useState, useEffect } from "react";
import Head from "next/head";

/**
 * /iep — Individualized Education Program for SEN students
 * Auto-generates from platform session data + parent input.
 * Displays: baseline, goals, accommodations, progress, review schedule.
 */

const GOAL_AREAS = [
  { id: 'literacy', label: '📖 Literacy', examples: ['Read 10 sight words independently', 'Decode CVC words', 'Write own name', 'Read a short paragraph with support'] },
  { id: 'numeracy', label: '🔢 Numeracy', examples: ['Count to 20', 'Add within 10', 'Recognise numbers 1-100', 'Understand place value'] },
  { id: 'communication', label: '💬 Communication', examples: ['Use 3-word sentences', 'Make requests using AAC', 'Answer yes/no questions', 'Maintain a 3-turn conversation'] },
  { id: 'social', label: '🤝 Social Skills', examples: ['Take turns in an activity', 'Follow 2-step instructions', 'Greet familiar people', 'Work alongside a peer for 5 minutes'] },
  { id: 'independence', label: '🌟 Independence', examples: ['Navigate to a familiar app independently', 'Complete a 5-minute task without prompting', 'Choose between two activities', 'Ask for help when stuck'] },
];

const ACCOMMODATION_OPTIONS = [
  { id: 'extra_time', label: 'Extra time for responses', icon: '⏱' },
  { id: 'large_font', label: 'Large font (20px+)', icon: '🔤' },
  { id: 'visual_supports', label: 'Visual supports and numbered steps', icon: '📋' },
  { id: 'simplified_language', label: 'Simplified language', icon: '💬' },
  { id: 'aac_device', label: 'AAC / communication device', icon: '📱' },
  { id: 'text_to_speech', label: 'Text-to-speech for all content', icon: '🔊' },
  { id: 'no_handwriting', label: 'No handwriting — typed/verbal only', icon: '⌨️' },
  { id: 'short_sessions', label: 'Short sessions (5-10 minutes)', icon: '⏲️' },
  { id: 'predictable_structure', label: 'Predictable session structure', icon: '📐' },
  { id: 'sensory_breaks', label: 'Sensory breaks between activities', icon: '🧘' },
  { id: 'one_instruction', label: 'One instruction at a time', icon: '1️⃣' },
  { id: 'choice_based', label: 'Choice-based (tap to select, not type)', icon: '👆' },
];

const IEP_KEY = 'nw_iep';
function loadIEP() { try { return JSON.parse(localStorage.getItem(IEP_KEY) || 'null'); } catch { return null; } }
function saveIEP(d) { try { localStorage.setItem(IEP_KEY, JSON.stringify(d)); } catch {} }

export default function IEPPage() {
  const [user, setUser] = useState(null);
  const [iep, setIep] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [editing, setEditing] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  // Editable fields
  const [goals, setGoals] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [parentNotes, setParentNotes] = useState('');
  const [reviewDate, setReviewDate] = useState('');

  useEffect(() => { const fn = () => setIsMobile(window.innerWidth < 768); fn(); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('nw_user') || '{}');
    setUser(u);

    // Load existing IEP
    const saved = loadIEP();
    if (saved) {
      setIep(saved);
      setGoals(saved.goals || []);
      setAccommodations(saved.accommodations || []);
      setParentNotes(saved.parentNotes || '');
      setReviewDate(saved.reviewDate || '');
    }

    // Load session data for auto-generation
    if (u.email) {
      fetch(`/api/student-memory?email=${encodeURIComponent(u.email)}`)
        .then(r => r.json())
        .then(data => { if (data) setSessionData(data); })
        .catch(() => {});
    }
  }, []);

  const autoGenerate = () => {
    const child = JSON.parse(localStorage.getItem('nw_active_child') || localStorage.getItem('nw_user') || '{}');
    const conditions = child.senConditions || (child.senCondition ? [child.senCondition] : ['unsure']);
    const severity = child.senSeverity || 'unsure';
    const literacy = child.literacyProfile || [];
    const summary = child.functionalSummary || '';

    // Auto-generate goals from functional profile
    const autoGoals = [];
    if (literacy.includes('not_yet_reading_or_writing')) {
      autoGoals.push({ area: 'literacy', goal: 'Recognise 20 sight words from personal vocabulary (name, family, familiar objects)', status: 'not_started', targetDate: getDateInMonths(6) });
      autoGoals.push({ area: 'literacy', goal: 'Match 10 pictures to their corresponding words', status: 'not_started', targetDate: getDateInMonths(3) });
    } else if (literacy.includes('recognises_some_letters_or_words')) {
      autoGoals.push({ area: 'literacy', goal: 'Decode 20 CVC words independently (cat, sun, dog, etc.)', status: 'not_started', targetDate: getDateInMonths(6) });
      autoGoals.push({ area: 'literacy', goal: 'Read a 3-sentence paragraph with support', status: 'not_started', targetDate: getDateInMonths(6) });
    } else if (literacy.includes('reads_with_help')) {
      autoGoals.push({ area: 'literacy', goal: 'Read a short passage independently and answer 3 comprehension questions', status: 'not_started', targetDate: getDateInMonths(6) });
    }
    if (literacy.includes('uses_pictures_or_symbols') || literacy.includes('has_aac_device')) {
      autoGoals.push({ area: 'communication', goal: 'Use communication system to make 5 different requests independently', status: 'not_started', targetDate: getDateInMonths(3) });
    }
    autoGoals.push({ area: 'numeracy', goal: severity === 'severe' ? 'Count objects 1-10 with one-to-one correspondence' : 'Complete age-appropriate numeracy tasks with 70% accuracy', status: 'not_started', targetDate: getDateInMonths(6) });
    autoGoals.push({ area: 'independence', goal: 'Navigate to and start a Starky session independently', status: 'not_started', targetDate: getDateInMonths(1) });

    // Auto-select accommodations from profile
    const autoAccom = [];
    if (severity === 'severe') autoAccom.push('extra_time', 'visual_supports', 'simplified_language', 'short_sessions', 'one_instruction', 'choice_based', 'predictable_structure');
    if (severity === 'moderate') autoAccom.push('extra_time', 'visual_supports', 'simplified_language', 'predictable_structure');
    if (severity === 'mild') autoAccom.push('visual_supports', 'predictable_structure');
    if (literacy.includes('has_aac_device')) autoAccom.push('aac_device', 'choice_based');
    if (conditions.includes('dyslexia')) autoAccom.push('text_to_speech', 'no_handwriting', 'large_font');
    if (conditions.includes('hi')) autoAccom.push('large_font', 'no_handwriting');
    if (conditions.includes('vi')) autoAccom.push('text_to_speech');

    // Build session-informed performance data
    const performance = sessionData ? {
      totalSessions: sessionData.totalSessions || 0,
      strengths: sessionData.knownStrengths || [],
      weakTopics: sessionData.weakTopics || [],
      learningStyle: sessionData.learningStyle || 'unknown',
      effectiveTechniques: sessionData.whatWorkedHistory || [],
      mood: sessionData.lastSessionMood || 'unknown',
    } : null;

    const newIep = {
      studentName: child.name || user?.name || '',
      conditions, severity, literacy, functionalSummary: summary,
      dateCreated: new Date().toISOString().split('T')[0],
      reviewDate: getDateInMonths(3),
      goals: autoGoals,
      accommodations: [...new Set(autoAccom)],
      parentNotes: '',
      performance,
      autoGenerated: true,
    };

    setIep(newIep);
    setGoals(newIep.goals);
    setAccommodations(newIep.accommodations);
    setReviewDate(newIep.reviewDate);
    saveIEP(newIep);
    setEditing(true);
  };

  const saveChanges = () => {
    const updated = { ...iep, goals, accommodations, parentNotes, reviewDate, lastUpdated: new Date().toISOString().split('T')[0] };
    setIep(updated);
    saveIEP(updated);
    setEditing(false);
  };

  const addGoal = (area) => {
    setGoals([...goals, { area, goal: '', status: 'not_started', targetDate: getDateInMonths(3) }]);
  };

  const updateGoal = (idx, field, value) => {
    const updated = [...goals];
    updated[idx] = { ...updated[idx], [field]: value };
    setGoals(updated);
  };

  const toggleAccom = (id) => {
    setAccommodations(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const S = {
    page: { minHeight: "100vh", background: "#080C18", fontFamily: "'Sora',-apple-system,sans-serif", color: "#fff" },
    card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: isMobile ? "16px" : "20px", marginBottom: 16 },
    input: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 14, fontFamily: "'Sora',sans-serif" },
  };

  return (
    <div style={S.page}>
      <Head>
        <title>IEP — Individualized Education Program — NewWorldEdu</title>
        <meta name="description" content="Auto-generated Individualized Education Program for SEN students based on session data and functional profile." />
      </Head>

      <header style={{ padding: isMobile ? "12px 16px" : "14px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/special-needs" style={{ textDecoration: "none", fontWeight: 900, fontSize: 13, color: "#fff" }}>← SEN Section</a>
        <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 15, color: "#4F8EF7" }}>NewWorldEdu★</a>
      </header>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: isMobile ? "24px 16px" : "40px 24px" }}>

        <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 900, margin: "0 0 8px" }}>
          💜 Individualized Education Program
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 24px" }}>
          {iep ? `For ${iep.studentName} · Created ${iep.dateCreated}` : 'Auto-generated from your child\'s sessions with Starky'}
        </p>

        {/* No IEP yet — generate */}
        {!iep && (
          <div style={{ ...S.card, textAlign: "center", padding: "40px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 10px" }}>Generate your child's IEP</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, margin: "0 0 20px" }}>
              Starky will create a personalised education plan based on your child's condition, functional profile, and session data.
              You can edit everything after it's generated.
            </p>
            <button onClick={autoGenerate} style={{ background: "linear-gradient(135deg,#C77DFF,#A78BFA)", color: "#fff", border: "none", borderRadius: 14, padding: "14px 32px", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
              Generate IEP →
            </button>
          </div>
        )}

        {/* IEP Content */}
        {iep && (<>

          {/* Student Profile Summary */}
          <div style={S.card}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginBottom: 10 }}>STUDENT PROFILE</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{iep.studentName}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              <div>Conditions: {iep.conditions?.join(', ')}</div>
              <div>Severity: {iep.severity}</div>
              <div>Functional summary: {iep.functionalSummary || 'Not yet assessed'}</div>
              {iep.performance && (
                <>
                  <div style={{ marginTop: 8, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>Platform data:</div>
                  <div>Sessions completed: {iep.performance.totalSessions}</div>
                  {iep.performance.strengths?.length > 0 && <div>Strengths: {iep.performance.strengths.slice(0, 3).join(', ')}</div>}
                  {iep.performance.weakTopics?.length > 0 && <div>Areas needing support: {iep.performance.weakTopics.slice(0, 3).join(', ')}</div>}
                  {iep.performance.learningStyle !== 'unknown' && <div>Learning style: {iep.performance.learningStyle}</div>}
                  {iep.performance.effectiveTechniques?.length > 0 && <div>What works: {iep.performance.effectiveTechniques.slice(0, 3).join(', ')}</div>}
                </>
              )}
            </div>
          </div>

          {/* Goals */}
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>GOALS</div>
              {!editing && <button onClick={() => setEditing(true)} style={{ background: "none", border: "none", color: "#4F8EF7", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Edit</button>}
            </div>
            {goals.map((g, i) => (
              <div key={i} style={{ marginBottom: 12, padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "#C77DFF", fontWeight: 700, marginBottom: 4 }}>{GOAL_AREAS.find(a => a.id === g.area)?.label || g.area}</div>
                {editing ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <textarea value={g.goal} onChange={e => updateGoal(i, 'goal', e.target.value)} rows={2}
                      style={{ ...S.input, resize: "vertical" }} placeholder="Describe the goal..." />
                    <div style={{ display: "flex", gap: 8 }}>
                      <select value={g.status} onChange={e => updateGoal(i, 'status', e.target.value)}
                        style={{ ...S.input, flex: 1 }}>
                        <option value="not_started">Not started</option>
                        <option value="in_progress">In progress</option>
                        <option value="partially_met">Partially met</option>
                        <option value="met">Met ✓</option>
                      </select>
                      <input type="date" value={g.targetDate} onChange={e => updateGoal(i, 'targetDate', e.target.value)}
                        style={{ ...S.input, flex: 1 }} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{g.goal || 'No goal set'}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                      Status: {g.status?.replace('_', ' ')} · Target: {g.targetDate}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {editing && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {GOAL_AREAS.map(a => (
                  <button key={a.id} onClick={() => addGoal(a.id)}
                    style={{ background: "rgba(199,125,255,0.1)", border: "1px solid rgba(199,125,255,0.2)", borderRadius: 8, padding: "6px 12px", color: "#C77DFF", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
                    + {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accommodations */}
          <div style={S.card}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginBottom: 10 }}>ACCOMMODATIONS</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8 }}>
              {ACCOMMODATION_OPTIONS.map(a => {
                const selected = accommodations.includes(a.id);
                return (
                  <button key={a.id} onClick={() => editing && toggleAccom(a.id)} disabled={!editing}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, border: "none", cursor: editing ? "pointer" : "default", fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 600, textAlign: "left",
                      background: selected ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.02)",
                      color: selected ? "#4ADE80" : "rgba(255,255,255,0.5)",
                      outline: selected ? "1.5px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
                    <span>{selected ? "✓" : a.icon}</span>
                    <span>{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Schedule */}
          <div style={S.card}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginBottom: 10 }}>REVIEW SCHEDULE</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Next review: {editing ? (
                <input type="date" value={reviewDate} onChange={e => setReviewDate(e.target.value)} style={{ ...S.input, display: "inline-block", width: "auto", marginLeft: 8 }} />
              ) : (
                <strong style={{ color: "#FFC300" }}>{reviewDate || 'Not set'}</strong>
              )}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>IEPs should be reviewed every 3 months. Starky will auto-update the performance data before each review.</div>
          </div>

          {/* Parent Notes */}
          <div style={S.card}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginBottom: 10 }}>PARENT NOTES</div>
            {editing ? (
              <textarea value={parentNotes} onChange={e => setParentNotes(e.target.value)} rows={3} placeholder="Add any notes about your child's needs, preferences, or concerns..."
                style={{ ...S.input, resize: "vertical" }} />
            ) : (
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                {parentNotes || 'No notes added yet.'}
              </div>
            )}
          </div>

          {/* Save / Edit buttons */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {editing ? (
              <button onClick={saveChanges} style={{ flex: 1, background: "linear-gradient(135deg,#C77DFF,#A78BFA)", color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
                Save IEP
              </button>
            ) : (
              <>
                <button onClick={() => setEditing(true)} style={{ flex: 1, background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.3)", borderRadius: 14, padding: "14px", color: "#4F8EF7", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
                  Edit IEP
                </button>
                <button onClick={autoGenerate} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
                  Regenerate from data
                </button>
              </>
            )}
          </div>

          {/* Link to SEN section */}
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <a href="/special-needs" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
              Start a session with Starky →
            </a>
          </div>
        </>)}
      </div>

      <footer style={{ padding: "20px 16px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>© 2026 NewWorldEdu · khurram@newworld.education</div>
      </footer>
    </div>
  );
}

function getDateInMonths(months) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}
