/**
 * components/StreakFlame.jsx — Animated streak counter
 */

export default function StreakFlame({ count = 0, size = 'medium' }) {
  const sizes = {
    small: { icon: 20, text: 14, gap: 4 },
    medium: { icon: 32, text: 20, gap: 6 },
    large: { icon: 48, text: 28, gap: 8 },
  };
  const s = sizes[size] || sizes.medium;
  const isActive = count > 0;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: s.gap,
      padding: '6px 12px', borderRadius: 20,
      background: isActive ? 'rgba(249,115,22,.1)' : 'rgba(255,255,255,.04)',
      border: `1px solid ${isActive ? 'rgba(249,115,22,.3)' : 'rgba(255,255,255,.08)'}`,
    }}>
      <span style={{
        fontSize: s.icon,
        filter: isActive ? 'none' : 'grayscale(1) opacity(0.3)',
        animation: isActive && count >= 7 ? 'pulse 1.5s infinite' : 'none',
      }}>
        🔥
      </span>
      <div>
        <div style={{ fontSize: s.text, fontWeight: 800, color: isActive ? '#F97316' : 'rgba(255,255,255,.3)' }}>
          {count}
        </div>
        {size !== 'small' && (
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>
            {count === 0 ? 'No streak' : count === 1 ? 'day' : 'days'}
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
