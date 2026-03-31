import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { ATOMS_SUBJECTS, ATOM_COUNTS, getAtomsBySubject } from '../utils/starkyAtomsKB';

/* ───── Progress Ring ───── */
function ProgressRing({ percent, size = 64, stroke = 5, color = '#C9A84C' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fill="#FAF6EB" fontSize={size * 0.24} fontWeight={900}
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
        {percent}%
      </text>
    </svg>
  );
}

/* ───── Nano Page ───── */
export default function NanoPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [selected, setSelected] = useState(null);
  const [atoms, setAtoms] = useState([]);
  const [mastery, setMastery] = useState({});
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [levelFilter, setLevelFilter] = useState('all'); // 'all' | 'O Level' | 'A Level'

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Load atoms when subject selected
  useEffect(() => {
    if (!selected) return;
    setAtoms(getAtomsBySubject(selected.id));
    setExpandedUnit(null);

    try {
      const email = JSON.parse(localStorage.getItem('nw_user') || '{}').email;
      if (email) {
        fetch(`/api/atoms/get-mastery?studentId=${encodeURIComponent(email)}&subject=${selected.id}`)
          .then(r => r.json())
          .then(data => {
            const map = {};
            (data.mastery || []).forEach(m => { map[m.atom_id] = m; });
            setMastery(map);
          }).catch(() => {});
      }
    } catch {}
  }, [selected]);

  // Group atoms by unit
  const unitMap = useMemo(() => {
    const map = {};
    atoms.forEach(a => {
      if (!map[a.unit]) map[a.unit] = [];
      map[a.unit].push(a);
    });
    return map;
  }, [atoms]);

  const masteredCount = Object.values(mastery).filter(m => m.mastery_score >= 8).length;
  const pct = atoms.length > 0 ? Math.round((masteredCount / atoms.length) * 100) : 0;

  // Progress intelligence
  const progressData = useMemo(() => {
    if (!atoms.length) return null;

    // Weakest unit
    let weakestUnit = null;
    let worstPct = 101;
    Object.entries(unitMap).forEach(([unit, unitAtoms]) => {
      const unitMastered = unitAtoms.filter(a => mastery[a.id]?.mastery_score >= 8).length;
      const unitPct = Math.round((unitMastered / unitAtoms.length) * 100);
      if (unitPct < worstPct) { worstPct = unitPct; weakestUnit = unit; }
    });

    // Next recommended goal: first unmastered atom in weakest unit, or first unmastered overall
    let nextGoal = null;
    if (weakestUnit && unitMap[weakestUnit]) {
      nextGoal = unitMap[weakestUnit].find(a => !mastery[a.id] || mastery[a.id].mastery_score < 8);
    }
    if (!nextGoal) {
      nextGoal = atoms.find(a => !mastery[a.id] || mastery[a.id].mastery_score < 8);
    }

    const remaining = atoms.length - masteredCount;
    const estMinutes = remaining * 3; // ~3 min per goal

    return { weakestUnit, worstPct, nextGoal, remaining, estMinutes };
  }, [atoms, mastery, unitMap, masteredCount]);

  // Filtered subjects by level
  const filteredSubjects = levelFilter === 'all'
    ? ATOMS_SUBJECTS
    : ATOMS_SUBJECTS.filter(s => s.level === levelFilter);

  const starkyMessage = (goalText) =>
    `Starky, teach me: ${goalText}. Then test me with a Cambridge exam question and mark my answer.`;

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: "'Sora',-apple-system,sans-serif", color: '#FAF6EB' }}>
      <Head>
        <title>Starky Nano — Learn any Cambridge subject, one goal at a time | NewWorldEdu</title>
        <meta name="description" content="Starky Nano: your personal Cambridge learning journey. Pick a subject, master one goal at a time with Starky as your tutor." />
      </Head>

      <style jsx global>{`
        @keyframes nanoFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .nano-fadein { animation: nanoFadeIn 0.4s ease both; }
        .nano-subject-card { transition: all 0.2s ease; }
        .nano-subject-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .nano-goal-row { transition: all 0.15s ease; }
        .nano-goal-row:hover { background: rgba(201,168,76,0.06) !important; }
        .nano-learn-btn { transition: all 0.2s ease; }
        .nano-learn-btn:hover { background: #C9A84C !important; color: #0A1628 !important; }
      `}</style>

      {/* ═══ HERO ═══ */}
      <div style={{ textAlign: 'center', padding: isMobile ? '48px 20px 36px' : '72px 24px 48px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 100, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: '#C9A84C', marginBottom: 20, letterSpacing: '0.02em' }}>
          STARKY NANO
        </div>
        <h1 style={{ fontSize: isMobile ? 28 : 44, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.15, color: '#FAF6EB' }}>
          Learn any Cambridge subject.{' '}
          <span style={{ background: 'linear-gradient(135deg,#C9A84C,#E8D48B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            One goal at a time.
          </span>
        </h1>
        <p style={{ color: 'rgba(250,246,235,0.55)', fontSize: isMobile ? 15 : 17, margin: '0 0 28px', lineHeight: 1.7, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
          Every Cambridge O and A Level subject broken into single learning goals. Pick one, learn it with Starky, get tested with a real exam question. Repeat until mastery.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 24 : 48 }}>
          {[
            { value: ATOM_COUNTS.total.toLocaleString(), label: 'Learning goals' },
            { value: ATOMS_SUBJECTS.length, label: 'Subjects' },
            { value: '~3 min', label: 'Per goal' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#C9A84C' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: isMobile ? '0 16px 40px' : '0 24px 60px' }}>

        {/* ═══ LEVEL FILTER TABS ═══ */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
          {['all', 'O Level', 'A Level'].map(level => {
            const isActive = levelFilter === level;
            return (
              <button key={level} onClick={() => setLevelFilter(level)}
                style={{ background: isActive ? 'rgba(201,168,76,0.15)' : 'rgba(250,246,235,0.04)', border: isActive ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(250,246,235,0.08)', borderRadius: 100, padding: '8px 20px', color: isActive ? '#C9A84C' : 'rgba(250,246,235,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                {level === 'all' ? 'All Subjects' : level}
              </button>
            );
          })}
        </div>

        {/* ═══ SUBJECT GRID ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 12, marginBottom: 36 }}>
          {filteredSubjects.map(s => {
            const isSelected = selected?.id === s.id;
            return (
              <button key={s.id} onClick={() => setSelected(s)} className="nano-subject-card"
                style={{ background: isSelected ? 'rgba(201,168,76,0.08)' : 'rgba(250,246,235,0.03)', border: isSelected ? '2px solid #C9A84C' : '1px solid rgba(250,246,235,0.06)', borderRadius: 14, padding: isMobile ? '18px 10px' : '22px 14px', cursor: 'pointer', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#FAF6EB', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: 'rgba(250,246,235,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{s.level}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#C9A84C' }}>{s.totalAtoms}</div>
                <div style={{ fontSize: 10, color: 'rgba(250,246,235,0.3)' }}>goals</div>
              </button>
            );
          })}
        </div>

        {/* ═══ NANO JOURNEY (when subject selected) ═══ */}
        {selected && atoms.length > 0 && (
          <div className="nano-fadein">

            {/* ── Progress Intelligence ── */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 24 }}>

              {/* Overall progress card */}
              <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 16, padding: isMobile ? '20px' : '24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                <ProgressRing percent={pct} size={80} stroke={6} color="#C9A84C" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 4, color: '#FAF6EB' }}>
                    {masteredCount} <span style={{ fontWeight: 400, fontSize: 14, color: 'rgba(250,246,235,0.5)' }}>of {atoms.length} goals mastered</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(250,246,235,0.4)', lineHeight: 1.5 }}>
                    {selected.label} {selected.level}
                  </div>
                  {progressData && progressData.remaining > 0 && (
                    <div style={{ fontSize: 12, color: 'rgba(201,168,76,0.7)', marginTop: 4 }}>
                      ~{progressData.estMinutes < 60 ? `${progressData.estMinutes} min` : `${Math.round(progressData.estMinutes / 60)} hrs`} to complete
                    </div>
                  )}
                </div>
              </div>

              {/* Intelligence card */}
              <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 16, padding: isMobile ? '20px' : '24px' }}>
                {progressData && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {progressData.weakestUnit && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(250,246,235,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Weakest Unit</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#FAF6EB' }}>{progressData.weakestUnit}</div>
                        <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.4)' }}>{progressData.worstPct}% mastered</div>
                      </div>
                    )}
                    {progressData.nextGoal && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(250,246,235,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Next Recommended</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#FAF6EB', lineHeight: 1.5 }}>{progressData.nextGoal.atom}</div>
                        <a href={`/demo?subject=${encodeURIComponent(selected.label)}&message=${encodeURIComponent(starkyMessage(progressData.nextGoal.atom))}`}
                          className="nano-learn-btn"
                          style={{ display: 'inline-block', marginTop: 8, fontSize: 12, fontWeight: 700, color: '#C9A84C', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 8, padding: '6px 14px', textDecoration: 'none' }}>
                          Learn this next
                        </a>
                      </div>
                    )}
                  </div>
                )}
                {!progressData && (
                  <div style={{ color: 'rgba(250,246,235,0.4)', fontSize: 14 }}>Select a subject to see your progress</div>
                )}
              </div>
            </div>

            {/* ── Unit-by-unit journey ── */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 14px', color: '#FAF6EB' }}>
                {selected.icon} {selected.label} — Learning Journey
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(unitMap).map(([unit, unitAtoms]) => {
                  const isExpanded = expandedUnit === unit;
                  const unitMastered = unitAtoms.filter(a => mastery[a.id]?.mastery_score >= 8).length;
                  const unitPct = Math.round((unitMastered / unitAtoms.length) * 100);
                  const unitSeen = unitAtoms.filter(a => mastery[a.id]?.times_seen > 0 && mastery[a.id]?.mastery_score < 8).length;

                  return (
                    <div key={unit}>
                      <button onClick={() => setExpandedUnit(isExpanded ? null : unit)}
                        style={{ width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', background: isExpanded ? 'rgba(201,168,76,0.06)' : 'rgba(250,246,235,0.03)', border: isExpanded ? '1px solid rgba(201,168,76,0.2)' : '1px solid rgba(250,246,235,0.06)', borderRadius: 14, padding: isMobile ? '14px' : '16px 20px', transition: 'all 0.2s' }}>
                        <span style={{ fontSize: 14, color: 'rgba(250,246,235,0.4)', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>&#9654;</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: 14, color: '#FAF6EB' }}>{unit}</div>
                          <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.4)', marginTop: 2 }}>
                            {unitAtoms.length} goals &middot; {unitMastered} mastered{unitSeen > 0 ? ` · ${unitSeen} in progress` : ''}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          <div style={{ width: isMobile ? 60 : 100, height: 6, borderRadius: 100, background: 'rgba(250,246,235,0.06)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 100, background: unitPct === 100 ? '#4CC97B' : '#C9A84C', width: `${unitPct}%`, transition: 'width 0.4s ease' }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: unitPct === 100 ? '#4CC97B' : '#C9A84C', minWidth: 35, textAlign: 'right' }}>
                            {unitPct === 100 ? 'Done' : `${unitPct}%`}
                          </span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="nano-fadein" style={{ marginLeft: isMobile ? 0 : 16, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {unitAtoms.map(a => {
                            const m = mastery[a.id];
                            const score = m?.mastery_score || 0;
                            const isMastered = score >= 8;
                            const inProgress = m?.times_seen > 0 && !isMastered;

                            return (
                              <div key={a.id} className="nano-goal-row"
                                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: isMobile ? '12px' : '12px 16px', background: 'rgba(250,246,235,0.02)', borderRadius: 12, border: '1px solid rgba(250,246,235,0.04)' }}>
                                {/* Status indicator */}
                                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0,
                                  background: isMastered ? 'rgba(76,201,123,0.15)' : inProgress ? 'rgba(201,168,76,0.12)' : 'rgba(250,246,235,0.04)',
                                  border: `1px solid ${isMastered ? 'rgba(76,201,123,0.3)' : inProgress ? 'rgba(201,168,76,0.25)' : 'rgba(250,246,235,0.08)'}`,
                                  color: isMastered ? '#4CC97B' : inProgress ? '#C9A84C' : 'rgba(250,246,235,0.25)' }}>
                                  {isMastered ? '\u2713' : inProgress ? '\u25CF' : '\u25CB'}
                                </div>

                                {/* Goal text */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: isMastered ? 'rgba(250,246,235,0.5)' : '#FAF6EB', lineHeight: 1.5, textDecoration: isMastered ? 'line-through' : 'none', textDecorationColor: 'rgba(250,246,235,0.2)' }}>{a.atom}</div>
                                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                                    <span style={{ fontSize: 10, color: 'rgba(201,168,76,0.5)', letterSpacing: 1 }}>
                                      {'\u2605'.repeat(a.difficulty)}{'\u2606'.repeat(5 - a.difficulty)}
                                    </span>
                                    {a.examWeight === 'high' && (
                                      <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', background: 'rgba(255,107,107,0.12)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.2)' }}>
                                        High weight
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Learn with Starky button */}
                                {!isMastered && (
                                  <a href={`/demo?subject=${encodeURIComponent(selected.label)}&message=${encodeURIComponent(starkyMessage(a.atom))}`}
                                    className="nano-learn-btn"
                                    style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 10, padding: isMobile ? '8px 12px' : '8px 16px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                                    Learn with Starky &rarr;
                                  </a>
                                )}
                                {isMastered && (
                                  <span style={{ fontSize: 11, fontWeight: 700, color: '#4CC97B', flexShrink: 0 }}>Mastered</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Mastered goals summary ── */}
            {masteredCount > 0 && (
              <div style={{ background: 'rgba(76,201,123,0.04)', border: '1px solid rgba(76,201,123,0.12)', borderRadius: 16, padding: isMobile ? '20px' : '24px', marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>&#127942;</span>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#4CC97B' }}>
                    {masteredCount} Goal{masteredCount !== 1 ? 's' : ''} Mastered
                  </h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {atoms.filter(a => mastery[a.id]?.mastery_score >= 8).map(a => (
                    <span key={a.id} style={{ fontSize: 11, fontWeight: 600, background: 'rgba(76,201,123,0.1)', border: '1px solid rgba(76,201,123,0.2)', borderRadius: 8, padding: '4px 10px', color: 'rgba(250,246,235,0.7)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.atom.length > 50 ? a.atom.slice(0, 47) + '...' : a.atom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ EMPTY STATE (no subject selected) ═══ */}
        {!selected && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(250,246,235,0.35)', fontSize: 15 }}>
            Pick a subject above to start your learning journey
          </div>
        )}
      </div>

      <footer style={{ padding: '24px 16px', textAlign: 'center', borderTop: '1px solid rgba(250,246,235,0.04)' }}>
        <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.2)' }}>&copy; 2026 NewWorldEdu &middot; newworld.education</div>
      </footer>
    </div>
  );
}
