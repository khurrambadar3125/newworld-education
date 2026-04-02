/**
 * pages/progress.jsx — Student Analytics Dashboard
 * ─────────────────────────────────────────────────────────────────
 * Visual progress tracking: mastery overview, topic heat map,
 * accuracy trends, predicted grade, XP, badges, streaks.
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProgressRing from '../components/ProgressRing';
import StreakFlame from '../components/StreakFlame';
import XPBar from '../components/XPBar';
import TopicHeatMap from '../components/TopicHeatMap';
import BadgeGrid from '../components/BadgeGrid';
import SkillTree from '../components/SkillTree';
import BottomNav from '../components/BottomNav';

const SUBJECTS = [
  'Mathematics','Physics','Chemistry','Biology','Economics',
  'Accounting','Computer Science','Pakistan Studies',
];

export default function Progress() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('O Level');
  const [mastery, setMastery] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview'); // overview, mastery, badges

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/todays-plan')
      .then(r => r.json())
      .then(data => { setOverview(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    if (!subject || status !== 'authenticated') return;
    setLoading(true);
    fetch(`/api/study-plan?action=mastery&subject=${encodeURIComponent(subject)}&level=${encodeURIComponent(level)}`)
      .then(r => r.json())
      .then(data => { setMastery(data.mastery || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [subject, level, status]);

  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Sign in to see your progress</h1>
          <button onClick={() => router.push('/login')} style={{ background: '#4F8EF7', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>Sign In</button>
        </div>
      </div>
    );
  }

  // Calculate stats for badges
  const totalAnswered = mastery.reduce((s, m) => s + m.questions_attempted, 0);
  const totalCorrect = mastery.reduce((s, m) => s + m.questions_correct, 0);
  const topicsMastered = mastery.filter(m => m.mastery_level >= 4).length;
  const bestStreak = mastery.reduce((max, m) => Math.max(max, m.best_streak || 0), 0);
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const subjectsStudied = overview?.subjects?.length || 0;

  const badgeStats = {
    totalAnswered, totalCorrect, topicsMastered, bestStreak,
    subjectsStudied, mocksCompleted: 0, perfectMicroTests: 0,
    reviewsCompleted: 0, nightStudy: false, earlyStudy: false,
  };

  // Estimated XP (10 per correct, 3 per wrong, 50 per mastery)
  const totalXP = totalCorrect * 10 + (totalAnswered - totalCorrect) * 3 + topicsMastered * 50;

  return (
    <>
      <Head>
        <title>Progress — NewWorld Education</title>
      </Head>

      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 80px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>

          {/* Header with XP and Streak */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>Your Progress</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', margin: 0 }}>
                {totalAnswered} questions answered, {overallAccuracy}% accuracy
              </p>
            </div>
            <StreakFlame count={bestStreak} size="small" />
          </div>

          {/* XP Bar */}
          <div style={{ marginBottom: 20 }}>
            <XPBar totalXP={totalXP} todayXP={0} />
          </div>

          {/* Overview rings */}
          {overview?.subjects?.length > 0 && (
            <div style={{
              display: 'flex', gap: 16, overflowX: 'auto', padding: '8px 0 16px',
              WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
            }}>
              {overview.subjects.map(s => (
                <div key={`${s.subject}|${s.level}`} onClick={() => { setSubject(s.subject); setLevel(s.level); }}
                  style={{ cursor: 'pointer', flexShrink: 0 }}>
                  <ProgressRing
                    percent={s.masteryPercent || 0}
                    size={70}
                    color={s.masteryPercent >= 60 ? '#4ADE80' : s.masteryPercent >= 30 ? '#EAB308' : '#EF4444'}
                    label={s.subject.split(' ')[0]}
                    sublabel={`${s.level}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
            {['overview', 'mastery', 'badges'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: tab === t ? '#4F8EF7' : 'rgba(255,255,255,.06)',
                  color: tab === t ? '#fff' : 'rgba(255,255,255,.5)',
                  fontWeight: 700, fontSize: 12, textTransform: 'capitalize',
                }}>
                {t}
              </button>
            ))}
          </div>

          {/* Subject selector */}
          {(tab === 'overview' || tab === 'mastery') && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {SUBJECTS.map(s => (
                <button key={s} onClick={() => setSubject(s)}
                  style={{
                    padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: subject === s ? 'rgba(79,142,247,.2)' : 'rgba(255,255,255,.04)',
                    color: subject === s ? '#4F8EF7' : 'rgba(255,255,255,.5)',
                    fontWeight: 600, fontSize: 11,
                  }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {loading && <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,.4)' }}>Loading...</div>}

          {/* Overview Tab */}
          {tab === 'overview' && mastery.length > 0 && !loading && (
            <>
              {/* Summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                {[
                  { label: 'Topics', value: mastery.length, color: '#fff' },
                  { label: 'Mastered', value: topicsMastered, color: '#4ADE80' },
                  { label: 'Accuracy', value: `${overallAccuracy}%`, color: overallAccuracy >= 70 ? '#4ADE80' : '#EAB308' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: 14, textAlign: 'center', border: '1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Topic Heat Map */}
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.4)', letterSpacing: 1, marginBottom: 12 }}>TOPIC ACCURACY</div>
              <TopicHeatMap topics={mastery} />
            </>
          )}

          {/* Mastery Tab */}
          {tab === 'mastery' && mastery.length > 0 && !loading && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.4)', letterSpacing: 1, marginBottom: 8 }}>SKILL TREE</div>
              <SkillTree
                topics={mastery.sort((a, b) => b.mastery_level - a.mastery_level)}
                onTopicClick={(t) => router.push(`/drill?subject=${encodeURIComponent(subject)}&level=${encodeURIComponent(level)}&topic=${encodeURIComponent(t.topic)}`)}
              />
            </>
          )}

          {/* Badges Tab */}
          {tab === 'badges' && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.4)', letterSpacing: 1, marginBottom: 12 }}>
                ACHIEVEMENTS — {Object.values(badgeStats).filter(v => typeof v === 'number' ? v > 0 : v).length} unlocked
              </div>
              <BadgeGrid stats={badgeStats} />
            </>
          )}

          {/* Empty state */}
          {!subject && !loading && tab !== 'badges' && (
            <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,.3)' }}>
              Select a subject to see detailed progress
            </div>
          )}

        </div>
      </div>

      <BottomNav />
    </>
  );
}
