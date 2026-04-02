/**
 * components/LevelUpAnimation.jsx — Celebration effect on mastery level-up
 */

import { useEffect, useState } from 'react';

const MASTERY_NAMES = ['', 'Recall', 'Apply', 'Analyze', 'Exam Ready', 'Mastered'];
const MASTERY_COLORS = ['', '#EF4444', '#F97316', '#EAB308', '#4ADE80', '#4F8EF7'];
const MASTERY_ICONS = ['', '📖', '⚡', '🔬', '🎯', '👑'];

export default function LevelUpAnimation({ level, topic, show, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => { setVisible(false); onClose?.(); }, 3000);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,.7)', zIndex: 9999,
      animation: 'fadeIn 0.3s ease-out',
    }} onClick={() => { setVisible(false); onClose?.(); }}>
      <div style={{
        background: '#111', borderRadius: 20, padding: '40px 48px',
        textAlign: 'center', border: `2px solid ${MASTERY_COLORS[level] || '#4F8EF7'}`,
        animation: 'scaleIn 0.4s ease-out',
        boxShadow: `0 0 60px ${MASTERY_COLORS[level] || '#4F8EF7'}33`,
      }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{MASTERY_ICONS[level] || '🎉'}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: MASTERY_COLORS[level] || '#4F8EF7', letterSpacing: 2, marginBottom: 8 }}>
          LEVEL UP
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
          {MASTERY_NAMES[level] || 'New Level'}
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,.5)' }}>
          {topic}
        </div>
        {/* Particles */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 20 }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 6, height: 6, borderRadius: 3,
              background: MASTERY_COLORS[level] || '#4F8EF7',
              left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 40}%`,
              top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 40}%`,
              animation: `particle ${1 + Math.random()}s ease-out forwards`,
              animationDelay: `${i * 0.05}s`,
              opacity: 0.7,
            }} />
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes particle { 0% { transform: scale(1) translate(0,0); opacity: 1; } 100% { transform: scale(0) translate(${Math.random()*100-50}px, ${Math.random()*100-50}px); opacity: 0; } }
      `}</style>
    </div>
  );
}
