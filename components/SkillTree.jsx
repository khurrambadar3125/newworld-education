/**
 * components/SkillTree.jsx — Visual mastery map (Duolingo-style path)
 * Shows topics as connected nodes colored by mastery level
 */

const COLORS = {
  0: { bg: 'rgba(255,255,255,.04)', border: 'rgba(255,255,255,.1)', text: 'rgba(255,255,255,.3)', icon: '○' },
  1: { bg: 'rgba(239,68,68,.1)', border: 'rgba(239,68,68,.4)', text: '#EF4444', icon: '◐' },
  2: { bg: 'rgba(249,115,22,.1)', border: 'rgba(249,115,22,.4)', text: '#F97316', icon: '◑' },
  3: { bg: 'rgba(234,179,8,.1)', border: 'rgba(234,179,8,.4)', text: '#EAB308', icon: '◕' },
  4: { bg: 'rgba(74,222,128,.1)', border: 'rgba(74,222,128,.4)', text: '#4ADE80', icon: '●' },
  5: { bg: 'rgba(79,142,247,.12)', border: 'rgba(79,142,247,.5)', text: '#4F8EF7', icon: '★' },
};

const LEVEL_NAMES = ['Not Started', 'Recall', 'Apply', 'Analyze', 'Exam Ready', 'Mastered'];

export default function SkillTree({ topics = [], onTopicClick }) {
  if (topics.length === 0) return null;

  return (
    <div style={{ position: 'relative', padding: '20px 0' }}>
      {/* Connecting line */}
      <div style={{
        position: 'absolute', left: 28, top: 30, bottom: 30, width: 2,
        background: 'linear-gradient(to bottom, rgba(79,142,247,.3), rgba(255,255,255,.05))',
      }} />

      {topics.map((t, i) => {
        const level = t.mastery_level || 0;
        const c = COLORS[level];
        const accuracy = t.questions_attempted > 0
          ? Math.round((t.questions_correct / t.questions_attempted) * 100) : null;
        const isOffset = i % 2 === 1; // zigzag pattern

        return (
          <div key={t.topic} onClick={() => onTopicClick?.(t)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 16px', marginBottom: 4,
              marginLeft: isOffset ? 24 : 0,
              cursor: 'pointer', borderRadius: 12,
              transition: 'all .15s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.04)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>

            {/* Node */}
            <div style={{
              width: 44, height: 44, borderRadius: 22,
              background: c.bg, border: `2px solid ${c.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, color: c.text, fontWeight: 800,
              flexShrink: 0,
              boxShadow: level >= 4 ? `0 0 12px ${c.border}` : 'none',
            }}>
              {c.icon}
            </div>

            {/* Topic info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: level > 0 ? '#fff' : 'rgba(255,255,255,.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.topic}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: c.text }}>{LEVEL_NAMES[level]}</span>
                {accuracy !== null && (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>{accuracy}% accuracy</span>
                )}
              </div>
              {/* Mini progress bar */}
              <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 2, marginTop: 4, maxWidth: 120 }}>
                <div style={{ height: '100%', width: `${(level / 5) * 100}%`, background: c.text, borderRadius: 2, transition: 'width .5s' }} />
              </div>
            </div>

            {/* Arrow */}
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,.15)' }}>→</span>
          </div>
        );
      })}
    </div>
  );
}
