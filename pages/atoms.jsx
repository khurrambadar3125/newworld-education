import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ATOMS_SUBJECTS, ATOM_COUNTS, ATOMS_EXPANSION_PLAN, getAtomsBySubject, getAtomsByUnit } from '../utils/starkyAtomsKB';

function ProgressRing({ percent, size = 64, stroke = 5, color = '#C9A84C' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fill="#fff" fontSize={size * 0.22} fontWeight={900}
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
        {percent}%
      </text>
    </svg>
  );
}

export default function AtomsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [selected, setSelected] = useState(null);
  const [atoms, setAtoms] = useState([]);
  const [mastery, setMastery] = useState({});
  const [expandedUnit, setExpandedUnit] = useState(null);

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

    // Load mastery from API
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
  const unitMap = {};
  atoms.forEach(a => {
    if (!unitMap[a.unit]) unitMap[a.unit] = [];
    unitMap[a.unit].push(a);
  });

  const masteredCount = Object.values(mastery).filter(m => m.mastery_score >= 8).length;
  const seenCount = Object.values(mastery).filter(m => m.mastery_score < 8 && m.times_seen > 0).length;
  const pct = atoms.length > 0 ? Math.round((masteredCount / atoms.length) * 100) : 0;

  // Count exam-weighted atoms
  const highWeightCount = atoms.filter(a => a.examWeight === 'high').length;

  const S = {
    page: { minHeight: '100vh', background: '#080C18', fontFamily: "'Sora',-apple-system,sans-serif", color: '#fff' },
    container: { maxWidth: 800, margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 24px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: isMobile ? '16px' : '20px' },
  };

  return (
    <div style={S.page}>
      <Head>
        <title>Starky Atoms — Every Cambridge knowledge point mapped | NewWorldEdu</title>
        <meta name="description" content="Starky Atoms: every Cambridge O and A Level knowledge point mapped, tracked, and mastered." />
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
          <h1 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 900, margin: '0 0 12px', background: 'linear-gradient(135deg,#C9A84C,#E8D48B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Every atom of Cambridge knowledge. Mapped.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: '0 0 24px', lineHeight: 1.7, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto' }}>
            Starky has broken every Cambridge O and A Level subject into individual Atoms of Knowledge — the smallest indivisible units of what you need to know. Track exactly what you've mastered and what still needs work.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 20 : 40 }}>
            {[
              { value: ATOM_COUNTS.total, label: 'Total atoms' },
              { value: ATOMS_SUBJECTS.length, label: 'Subjects mapped' },
              { value: highWeightCount || Math.round(ATOM_COUNTS.total * 0.85), label: 'Exam-weighted' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 900, color: '#C9A84C' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SUBJECT GRID ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
          {ATOMS_SUBJECTS.map(s => {
            const isSelected = selected?.id === s.id;
            return (
              <button key={s.id} onClick={() => setSelected(s)}
                style={{ ...S.card, cursor: 'pointer', textAlign: 'center', border: isSelected ? `2px solid ${s.color}` : '1px solid rgba(255,255,255,0.08)', background: isSelected ? `${s.color}15` : undefined, padding: '24px 12px' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{s.level}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.totalAtoms}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>atoms</div>
              </button>
            );
          })}
        </div>

        {/* ═══ ATOM MAP (when subject selected) ═══ */}
        {selected && atoms.length > 0 && (
          <>
            {/* Progress summary */}
            <div style={{ ...S.card, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
              <ProgressRing percent={pct} size={80} stroke={6} color={selected.color} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 4 }}>
                  {masteredCount} of {atoms.length} atoms mastered
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  {seenCount} seen but need work · {atoms.length - masteredCount - seenCount} not yet attempted
                </div>
              </div>
            </div>

            {/* Unit accordion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {Object.entries(unitMap).map(([unit, unitAtoms]) => {
                const isExpanded = expandedUnit === unit;
                const unitMastered = unitAtoms.filter(a => mastery[a.id]?.mastery_score >= 8).length;
                const unitPct = Math.round((unitMastered / unitAtoms.length) * 100);

                return (
                  <div key={unit}>
                    <button onClick={() => setExpandedUnit(isExpanded ? null : unit)}
                      style={{ ...S.card, width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>▶</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>{unit}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{unitAtoms.length} atoms</div>
                      </div>
                      <div style={{ width: 80, height: 6, borderRadius: 100, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 100, background: selected.color, width: `${unitPct}%`, transition: 'width 0.3s' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: selected.color, minWidth: 35, textAlign: 'right' }}>{unitPct}%</span>
                    </button>

                    {isExpanded && (
                      <div style={{ marginLeft: isMobile ? 0 : 20, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {unitAtoms.map(a => {
                          const m = mastery[a.id];
                          const score = m?.mastery_score || 0;
                          const status = score >= 8 ? '✅' : m?.times_seen > 0 ? '⚠️' : '○';
                          return (
                            <a key={a.id} href={`/demo?subject=${encodeURIComponent(selected.label)}&focus=${encodeURIComponent(a.atom)}`}
                              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, textDecoration: 'none', color: '#fff', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.04)' }}>
                              <span style={{ fontSize: 14, flexShrink: 0 }}>{status}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>{a.atom}</div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                                  <span style={{ fontSize: 10, letterSpacing: 1 }}>{'★'.repeat(a.difficulty)}{'☆'.repeat(5 - a.difficulty)}</span>
                                  <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase',
                                    background: a.examWeight === 'high' ? 'rgba(255,107,107,0.15)' : 'rgba(255,255,255,0.06)',
                                    color: a.examWeight === 'high' ? '#FF6B6B' : 'rgba(255,255,255,0.3)',
                                    border: `1px solid ${a.examWeight === 'high' ? 'rgba(255,107,107,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                                    {a.examWeight}
                                  </span>
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
          </>
        )}

        {/* ═══ EXPANSION ROADMAP ═══ */}
        <div style={{ ...S.card, marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 16px' }}>Expansion Roadmap</h2>
          {ATOMS_EXPANSION_PLAN.map((p, i) => {
            const isLive = i === 0;
            return (
              <div key={p.phase} style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: isLive ? '#C9A84C' : 'rgba(255,255,255,0.15)', marginTop: 4, flexShrink: 0, border: isLive ? '2px solid #E8D48B' : 'none' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: isLive ? '#C9A84C' : 'rgba(255,255,255,0.7)', marginBottom: 2 }}>
                    {p.phase} — {p.atoms.toLocaleString()} atoms
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                    {p.subjects.join(', ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <a href="/demo" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#C9A84C,#E8D48B)', borderRadius: 14, padding: '14px 32px', color: '#080C18', fontWeight: 800, fontSize: 16, textDecoration: 'none' }}>
            Start mastering your atoms →
          </a>
        </div>
      </div>

      <footer style={{ padding: '20px 16px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>© 2026 NewWorldEdu · newworld.education</div>
      </footer>
    </div>
  );
}
