import { useState, useEffect } from 'react';
import Head from 'next/head';

const SUBJECT_CARDS = [
  { id: 'chemistry', label: 'Chemistry', code: '5070', icon: '🧪', color: '#4F8EF7' },
  { id: 'physics', label: 'Physics', code: '5054', icon: '⚡', color: '#FFC300' },
  { id: 'biology', label: 'Biology', code: '5090', icon: '🧬', color: '#4ADE80' },
  { id: 'mathematics', label: 'Mathematics', code: '4024', icon: '📐', color: '#A78BFA' },
  { id: 'economics', label: 'Economics', code: '9708', icon: '📊', color: '#FF6B6B' },
  { id: 'english', label: 'English Language', code: '1123', icon: '📝', color: '#38BDF8' },
];

function ProgressRing({ percent, size = 64, stroke = 5, color = '#4F8EF7' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fill="#fff" fontSize={size * 0.22} fontWeight={900}
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
        {percent}%
      </text>
    </svg>
  );
}

function DifficultyStars({ level }) {
  return (
    <span style={{ fontSize: 10, letterSpacing: 1 }}>
      {'★'.repeat(level)}{'☆'.repeat(5 - level)}
    </span>
  );
}

function WeightTag({ weight }) {
  const colors = { high: '#FF6B6B', medium: '#FFC300', low: 'rgba(255,255,255,0.3)' };
  return (
    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700,
      background: `${colors[weight]}22`, color: colors[weight], border: `1px solid ${colors[weight]}44`,
      textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {weight}
    </span>
  );
}

function MasteryBadge({ status }) {
  if (status === 'mastered') return <span style={{ color: '#4ADE80', fontSize: 14 }}>✅</span>;
  if (status === 'seen') return <span style={{ color: '#FFC300', fontSize: 14 }}>⚠️</span>;
  return <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>○</span>;
}

export default function AtomsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [atoms, setAtoms] = useState([]);
  const [mastery, setMastery] = useState({});
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [filter, setFilter] = useState('all'); // all | weak | exam-critical
  const [loading, setLoading] = useState(false);
  const [totalAtoms, setTotalAtoms] = useState(0);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Load atoms dynamically when subject is selected
  useEffect(() => {
    if (!selectedSubject) return;
    setLoading(true);
    import('../utils/starkyAtomsKB').then(mod => {
      const subjectAtoms = mod.getAtomsBySubject(selectedSubject.id);
      setAtoms(subjectAtoms);
      setTotalAtoms(mod.ATOM_COUNTS ? Object.values(mod.ATOM_COUNTS).reduce((a, b) => a + b, 0) : subjectAtoms.length);
      setLoading(false);
    }).catch(() => {
      setAtoms([]);
      setLoading(false);
    });

    // Load mastery data
    try {
      const email = JSON.parse(localStorage.getItem('nw_user') || '{}').email;
      if (email) {
        fetch(`/api/atoms/track-mastery?email=${encodeURIComponent(email)}&subject=${selectedSubject.id}`)
          .then(r => r.json())
          .then(data => {
            const map = {};
            (data.mastery || []).forEach(m => {
              map[m.atom_id] = { score: m.score, mastered: m.mastered, attempts: m.attempts };
            });
            setMastery(map);
          }).catch(() => {});
      }
    } catch {}
  }, [selectedSubject]);

  // Group atoms by unit
  const unitMap = {};
  atoms.forEach(a => {
    if (!unitMap[a.unit]) unitMap[a.unit] = [];
    unitMap[a.unit].push(a);
  });

  // Apply filter
  const getFilteredAtoms = (unitAtoms) => {
    if (filter === 'weak') return unitAtoms.filter(a => !mastery[a.id]?.mastered && (mastery[a.id]?.score || 0) < 5);
    if (filter === 'exam-critical') return unitAtoms.filter(a => a.examWeight === 'high');
    return unitAtoms;
  };

  const masteredCount = Object.values(mastery).filter(m => m.mastered).length;
  const seenCount = Object.values(mastery).filter(m => !m.mastered && m.attempts > 0).length;
  const masteryPercent = atoms.length > 0 ? Math.round((masteredCount / atoms.length) * 100) : 0;

  const S = {
    page: { minHeight: '100vh', background: '#080C18', fontFamily: "'Sora',-apple-system,sans-serif", color: '#fff' },
    container: { maxWidth: 800, margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 24px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: isMobile ? '16px' : '20px' },
  };

  return (
    <div style={S.page}>
      <Head>
        <title>Starky Atoms — Every knowledge point mapped | NewWorldEdu</title>
        <meta name="description" content="Starky Atoms: every Cambridge O and A Level knowledge point mapped, tracked, and mastered. See exactly what you know and what you don't." />
      </Head>

      <header style={{ padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ textDecoration: 'none', fontWeight: 900, fontSize: 15, color: '#fff' }}>
          NewWorldEdu<span style={{ color: '#4F8EF7' }}>★</span>
        </a>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="/drill" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 700 }}>Drill</a>
          <a href="/student-dashboard" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 700 }}>Dashboard</a>
        </div>
      </header>

      <div style={S.container}>
        {/* ═══ HERO ═══ */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚛️</div>
          <h1 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 900, margin: '0 0 12px', background: 'linear-gradient(135deg,#FFC300,#FF6B6B,#A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Every atom of knowledge. Mapped.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: '0 0 24px', lineHeight: 1.7, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Starky has broken every Cambridge O and A Level subject into individual Atoms of Knowledge — the smallest indivisible units of what you need to know. Track exactly what you've mastered and what still needs work.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 16 : 32 }}>
            {[
              { value: totalAtoms || '1,000+', label: 'Total atoms' },
              { value: SUBJECT_CARDS.length, label: 'Subjects mapped' },
              { value: '~200', label: 'Avg per subject' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#FFC300' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SUBJECT SELECTOR ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
          {SUBJECT_CARDS.map(s => {
            const isSelected = selectedSubject?.id === s.id;
            const subjectMastered = isSelected ? masteredCount : 0;
            const subjectTotal = isSelected ? atoms.length : 0;
            const pct = subjectTotal > 0 ? Math.round((subjectMastered / subjectTotal) * 100) : 0;

            return (
              <button key={s.id} onClick={() => { setSelectedSubject(s); setExpandedUnit(null); setFilter('all'); }}
                style={{ ...S.card, cursor: 'pointer', textAlign: 'center', border: isSelected ? `2px solid ${s.color}` : '1px solid rgba(255,255,255,0.08)', background: isSelected ? `${s.color}11` : undefined, padding: '20px 12px' }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.code}</div>
                {isSelected && subjectTotal > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <ProgressRing percent={pct} size={48} stroke={4} color={s.color} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ═══ ATOM MAP ═══ */}
        {selectedSubject && (
          <>
            {/* My Progress */}
            {atoms.length > 0 && (
              <div style={{ ...S.card, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
                <ProgressRing percent={masteryPercent} size={80} stroke={6} color={selectedSubject.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 4 }}>
                    {masteredCount} of {atoms.length} {selectedSubject.label} Atoms mastered
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                    {seenCount} seen but need work · {atoms.length - masteredCount - seenCount} not yet attempted
                  </div>
                  {Object.keys(unitMap).length > 0 && (() => {
                    // Find weakest unit
                    let weakest = null, weakestScore = Infinity;
                    for (const [unit, uAtoms] of Object.entries(unitMap)) {
                      const score = uAtoms.reduce((s, a) => s + (mastery[a.id]?.score || 0), 0) / uAtoms.length;
                      if (score < weakestScore) { weakestScore = score; weakest = unit; }
                    }
                    return weakest ? (
                      <div style={{ fontSize: 12, color: '#FFC300', marginTop: 6 }}>
                        Weakest cluster: {weakest} — focus here next
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            )}

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[
                { id: 'all', label: 'All atoms' },
                { id: 'weak', label: 'Weakest atoms' },
                { id: 'exam-critical', label: 'Exam-critical' },
              ].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  style={{ padding: '6px 14px', borderRadius: 8, border: filter === f.id ? `1px solid ${selectedSubject.color}` : '1px solid rgba(255,255,255,0.12)', background: filter === f.id ? `${selectedSubject.color}22` : 'transparent', color: filter === f.id ? selectedSubject.color : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                  {f.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)' }}>
                Loading atoms...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(unitMap).map(([unit, unitAtoms]) => {
                  const filtered = getFilteredAtoms(unitAtoms);
                  if (filtered.length === 0 && filter !== 'all') return null;
                  const isExpanded = expandedUnit === unit;
                  const unitMastered = unitAtoms.filter(a => mastery[a.id]?.mastered).length;
                  const unitPct = Math.round((unitMastered / unitAtoms.length) * 100);
                  const allMastered = unitMastered === unitAtoms.length;

                  return (
                    <div key={unit}>
                      <button onClick={() => setExpandedUnit(isExpanded ? null : unit)}
                        style={{ ...S.card, width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>▶</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2 }}>
                            {allMastered && <span style={{ marginRight: 6 }}>🏅</span>}
                            {unit}
                          </div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                            {unitAtoms.length} atoms · {unitMastered} mastered
                          </div>
                        </div>
                        <div style={{ width: 80, height: 6, borderRadius: 100, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 100, background: selectedSubject.color, width: `${unitPct}%`, transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: selectedSubject.color, minWidth: 35, textAlign: 'right' }}>{unitPct}%</span>
                      </button>

                      {isExpanded && (
                        <div style={{ marginLeft: isMobile ? 0 : 20, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {(filter === 'all' ? unitAtoms : filtered).map(a => {
                            const m = mastery[a.id];
                            const status = m?.mastered ? 'mastered' : m?.attempts > 0 ? 'seen' : 'new';
                            return (
                              <a key={a.id} href={`/demo?subject=${encodeURIComponent(selectedSubject.label)}&focus=${encodeURIComponent(a.atom)}`}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, textDecoration: 'none', color: '#fff', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.04)' }}>
                                <MasteryBadge status={status} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {a.atom}
                                  </div>
                                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                                    <DifficultyStars level={a.difficulty} />
                                    <WeightTag weight={a.examWeight} />
                                    {m?.score !== undefined && (
                                      <span style={{ fontSize: 10, color: m.score >= 7 ? '#4ADE80' : m.score >= 4 ? '#FFC300' : '#FF6B6B' }}>
                                        Score: {m.score}/10
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>→</span>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* CTA */}
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <a href={`/demo?subject=${encodeURIComponent(selectedSubject.label)}`}
                style={{ display: 'inline-block', background: `linear-gradient(135deg, ${selectedSubject.color}, #6366F1)`, borderRadius: 14, padding: '14px 32px', color: '#fff', fontWeight: 800, fontSize: 16, textDecoration: 'none' }}>
                Start with your weakest atoms →
              </a>
            </div>
          </>
        )}

        {!selectedSubject && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            Select a subject above to explore its knowledge atoms.
          </div>
        )}
      </div>

      <footer style={{ padding: '20px 16px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>© 2026 NewWorldEdu · newworld.education</div>
      </footer>
    </div>
  );
}
