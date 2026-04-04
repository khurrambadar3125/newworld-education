/**
 * components/ShareButtons.jsx — WhatsApp, Twitter, Copy Link sharing
 * ─────────────────────────────────────────────────────────────────
 * Drop into any page after an achievement/score to trigger viral sharing.
 * Usage: <ShareButtons message="I scored 8/10!" url="/drill" />
 */

import { useState } from 'react';

export default function ShareButtons({ message, url, compact = false }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `https://www.newworld.education${url || ''}`;
  const encodedMsg = encodeURIComponent(`${message}\n\n${fullUrl}`);
  const tweetMsg = encodeURIComponent(`${message} ${fullUrl}`);

  const copyLink = () => {
    navigator.clipboard?.writeText(`${message}\n\n${fullUrl}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const btnStyle = (bg) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: compact ? '8px 14px' : '10px 18px',
    borderRadius: 10, border: 'none', cursor: 'pointer',
    fontSize: compact ? 12 : 13, fontWeight: 700,
    background: bg, color: '#fff', textDecoration: 'none',
    WebkitTapHighlightColor: 'transparent',
  });

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
      <a href={`https://wa.me/?text=${encodedMsg}`} target="_blank" rel="noopener noreferrer" style={btnStyle('#25D366')}>
        <span style={{ fontSize: compact ? 14 : 16 }}>💬</span> WhatsApp
      </a>
      <a href={`https://twitter.com/intent/tweet?text=${tweetMsg}`} target="_blank" rel="noopener noreferrer" style={btnStyle('#1DA1F2')}>
        <span style={{ fontSize: compact ? 14 : 16 }}>🐦</span> Tweet
      </a>
      <button onClick={copyLink} style={btnStyle(copied ? '#4ADE80' : 'rgba(255,255,255,.15)')}>
        <span style={{ fontSize: compact ? 14 : 16 }}>{copied ? '✓' : '📋'}</span> {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}

/**
 * ChallengeButton — "Challenge a friend" with pre-filled question
 */
export function ChallengeButton({ subject, topic, score, maxScore }) {
  const msg = `🎯 I just scored ${score}/${maxScore} on ${subject}${topic ? ` (${topic})` : ''} on NewWorldEdu! Can you beat me?`;
  const url = `/free-practice-test?subject=${encodeURIComponent(subject)}&ref=challenge`;

  return (
    <a href={`https://wa.me/?text=${encodeURIComponent(msg + '\n\nTry it free: https://www.newworld.education' + url)}`}
      target="_blank" rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '12px 24px', borderRadius: 12, border: 'none',
        background: 'linear-gradient(135deg, #25D366, #128C7E)',
        color: '#fff', fontSize: 14, fontWeight: 800, textDecoration: 'none',
        cursor: 'pointer',
      }}>
      💬 Challenge a Friend on WhatsApp
    </a>
  );
}

/**
 * StreakShare — share learning streak
 */
export function StreakShare({ streak, subject }) {
  const msg = `🔥 I'm on a ${streak}-day learning streak on NewWorldEdu${subject ? ` studying ${subject}` : ''}! Join me:`;
  return (
    <a href={`https://wa.me/?text=${encodeURIComponent(msg + '\nhttps://www.newworld.education')}`}
      target="_blank" rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 16px', borderRadius: 10, background: 'rgba(249,115,22,.15)',
        border: '1px solid rgba(249,115,22,.3)', color: '#F97316',
        fontSize: 12, fontWeight: 700, textDecoration: 'none', cursor: 'pointer',
      }}>
      🔥 Share Streak
    </a>
  );
}
