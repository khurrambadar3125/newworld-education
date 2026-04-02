/**
 * components/XPBar.jsx — Experience points bar with level indicator
 */

const LEVELS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500, 10000, 15000, 20000, 30000, 50000];

function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i]) return { level: i + 1, currentXP: xp - LEVELS[i], nextXP: (LEVELS[i + 1] || LEVELS[i] * 2) - LEVELS[i] };
  }
  return { level: 1, currentXP: xp, nextXP: 100 };
}

export default function XPBar({ totalXP = 0, todayXP = 0, compact = false }) {
  const { level, currentXP, nextXP } = getLevel(totalXP);
  const percent = Math.min((currentXP / nextXP) * 100, 100);

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 14,
          background: 'linear-gradient(135deg, #7C3AED, #4F8EF7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, color: '#fff',
        }}>{level}</div>
        <div style={{ flex: 1, maxWidth: 120 }}>
          <div style={{ height: 4, background: 'rgba(255,255,255,.08)', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${percent}%`, background: 'linear-gradient(90deg, #7C3AED, #4F8EF7)', borderRadius: 2, transition: 'width .5s' }} />
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED' }}>{totalXP} XP</span>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,.03)', borderRadius: 14, padding: 16,
      border: '1px solid rgba(255,255,255,.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 20,
            background: 'linear-gradient(135deg, #7C3AED, #4F8EF7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 800, color: '#fff',
            boxShadow: '0 0 20px rgba(124,58,237,.3)',
          }}>
            {level}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Level {level}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{currentXP} / {nextXP} XP to next level</div>
          </div>
        </div>
        {todayXP > 0 && (
          <div style={{ fontSize: 12, fontWeight: 700, color: '#4ADE80' }}>
            +{todayXP} today
          </div>
        )}
      </div>
      {/* XP bar */}
      <div style={{ height: 8, background: 'rgba(255,255,255,.06)', borderRadius: 4 }}>
        <div style={{
          height: '100%', width: `${percent}%`,
          background: 'linear-gradient(90deg, #7C3AED, #4F8EF7)',
          borderRadius: 4, transition: 'width .8s ease-out',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{totalXP.toLocaleString()} total XP</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>Next: Level {level + 1}</span>
      </div>
    </div>
  );
}
