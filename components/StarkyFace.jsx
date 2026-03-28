/**
 * StarkyFace — Animated SVG face for voice sessions
 * Three states: talking, thinking, listening
 * Pure CSS animations. No images. No API. Under 5KB.
 * GPU-accelerated via transform animations.
 */

export default function StarkyFace({ state = 'listening', visible = false }) {
  if (!visible) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
      <style>{`
        @keyframes starkyTalk { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.3)} }
        @keyframes starkyThink { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes starkyBlink { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.1)} }
        @keyframes starkyPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
        @media(prefers-reduced-motion:reduce){ .starky-face *{animation:none!important} }
      `}</style>
      <div className="starky-face" style={{ width: 80, height: 80 }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{
          animation: state === 'thinking' ? 'starkyPulse 2s ease-in-out infinite' : 'none',
        }}>
          {/* Face circle */}
          <circle cx="50" cy="50" r="45" fill="#0D1635" stroke="#4F8EF7" strokeWidth="2.5" />

          {/* Star badge */}
          <polygon points="50,12 53,20 62,20 55,25 58,34 50,29 42,34 45,25 38,20 47,20"
            fill="#4F8EF7" opacity="0.3" />

          {/* Left eye */}
          <ellipse cx="36" cy="42" rx="5" ry="6" fill="white" style={{
            animation: state === 'listening' ? 'starkyBlink 4s ease-in-out infinite' : 'none',
            transformOrigin: '36px 42px',
          }} />
          <circle cx="36" cy="42" r="2.5" fill="#4F8EF7" />

          {/* Right eye */}
          <ellipse cx="64" cy="42" rx="5" ry="6" fill="white" style={{
            animation: state === 'listening' ? 'starkyBlink 4s ease-in-out infinite 0.2s' : 'none',
            transformOrigin: '64px 42px',
          }} />
          <circle cx="64" cy="42" r="2.5" fill="#4F8EF7" />

          {/* Mouth — changes by state */}
          {state === 'talking' ? (
            <ellipse cx="50" cy="62" rx="10" ry="6" fill="white" opacity="0.9" style={{
              animation: 'starkyTalk 0.4s ease-in-out infinite',
              transformOrigin: '50px 62px',
            }} />
          ) : state === 'thinking' ? (
            <>
              <line x1="40" y1="62" x2="60" y2="62" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <circle cx="68" cy="58" r="2" fill="white" opacity="0.4" style={{
                animation: 'starkyThink 1.5s ease-in-out infinite',
              }} />
              <circle cx="74" cy="52" r="1.5" fill="white" opacity="0.3" style={{
                animation: 'starkyThink 1.5s ease-in-out infinite 0.3s',
              }} />
            </>
          ) : (
            /* Listening — gentle smile */
            <path d="M 38 60 Q 50 70 62 60" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          )}

          {/* Subtle glow ring when active */}
          {state !== 'listening' && (
            <circle cx="50" cy="50" r="47" fill="none" stroke="#4F8EF7" strokeWidth="1" opacity="0.3" style={{
              animation: 'starkyThink 2s ease-in-out infinite',
            }} />
          )}
        </svg>
      </div>
    </div>
  );
}
