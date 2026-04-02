/**
 * components/TopicHeatMap.jsx — Color-coded grid showing accuracy per topic
 */

function getHeatColor(accuracy) {
  if (accuracy === null) return { bg: 'rgba(255,255,255,.04)', text: 'rgba(255,255,255,.2)' };
  if (accuracy >= 80) return { bg: 'rgba(74,222,128,.15)', text: '#4ADE80' };
  if (accuracy >= 60) return { bg: 'rgba(234,179,8,.12)', text: '#EAB308' };
  if (accuracy >= 40) return { bg: 'rgba(249,115,22,.12)', text: '#F97316' };
  return { bg: 'rgba(239,68,68,.12)', text: '#EF4444' };
}

export default function TopicHeatMap({ topics = [] }) {
  if (topics.length === 0) return null;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 6 }}>
        {topics.map(t => {
          const accuracy = t.questions_attempted > 0
            ? Math.round((t.questions_correct / t.questions_attempted) * 100)
            : null;
          const c = getHeatColor(accuracy);

          return (
            <div key={t.topic} style={{
              background: c.bg, borderRadius: 8, padding: '10px 12px',
              border: '1px solid rgba(255,255,255,.05)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.7)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.topic}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.text }}>
                {accuracy !== null ? `${accuracy}%` : '—'}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>
                {t.questions_attempted || 0} attempted
              </div>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'center' }}>
        {[
          { label: 'Weak', color: '#EF4444' },
          { label: 'Developing', color: '#F97316' },
          { label: 'Good', color: '#EAB308' },
          { label: 'Strong', color: '#4ADE80' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
