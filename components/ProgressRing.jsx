/**
 * components/ProgressRing.jsx — Circular progress indicator
 * Shows mastery percentage with animated ring
 */

export default function ProgressRing({ percent = 0, size = 80, strokeWidth = 6, color = '#4F8EF7', label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={strokeWidth} />
        {/* Progress arc */}
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }} />
        {/* Center text */}
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fontSize: size * 0.25, fontWeight: 800, fill: '#fff' }}>
          {percent}%
        </text>
      </svg>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textAlign: 'center' }}>{label}</div>}
      {sublabel && <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', textAlign: 'center' }}>{sublabel}</div>}
    </div>
  );
}
