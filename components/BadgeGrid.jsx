/**
 * components/BadgeGrid.jsx — Achievement badges collection
 */

const ALL_BADGES = [
  { id: 'first_question', name: 'First Steps', icon: '👶', desc: 'Answer your first question', condition: (s) => s.totalAnswered >= 1 },
  { id: 'ten_correct', name: 'Getting Started', icon: '📚', desc: '10 correct answers', condition: (s) => s.totalCorrect >= 10 },
  { id: 'fifty_correct', name: 'Knowledge Builder', icon: '🧱', desc: '50 correct answers', condition: (s) => s.totalCorrect >= 50 },
  { id: 'hundred_correct', name: 'Century', icon: '💯', desc: '100 correct answers', condition: (s) => s.totalCorrect >= 100 },
  { id: 'five_hundred', name: 'Scholar', icon: '🎓', desc: '500 correct answers', condition: (s) => s.totalCorrect >= 500 },
  { id: 'thousand', name: 'Expert', icon: '🏆', desc: '1000 correct answers', condition: (s) => s.totalCorrect >= 1000 },
  { id: 'streak_7', name: 'Week Warrior', icon: '🔥', desc: '7-day streak', condition: (s) => s.bestStreak >= 7 },
  { id: 'streak_30', name: 'Monthly Champion', icon: '⚡', desc: '30-day streak', condition: (s) => s.bestStreak >= 30 },
  { id: 'streak_100', name: 'Unstoppable', icon: '💎', desc: '100-day streak', condition: (s) => s.bestStreak >= 100 },
  { id: 'first_mastery', name: 'First Mastery', icon: '🌟', desc: 'Master your first topic', condition: (s) => s.topicsMastered >= 1 },
  { id: 'five_mastery', name: 'Rising Star', icon: '⭐', desc: 'Master 5 topics', condition: (s) => s.topicsMastered >= 5 },
  { id: 'ten_mastery', name: 'Subject Expert', icon: '👑', desc: 'Master 10 topics', condition: (s) => s.topicsMastered >= 10 },
  { id: 'first_mock', name: 'Mock Veteran', icon: '📝', desc: 'Complete your first mock', condition: (s) => s.mocksCompleted >= 1 },
  { id: 'perfect_micro', name: 'Perfect Score', icon: '🎯', desc: '5/5 on a micro-test', condition: (s) => s.perfectMicroTests >= 1 },
  { id: 'review_master', name: 'Review Master', icon: '🔄', desc: 'Complete 50 SR reviews', condition: (s) => s.reviewsCompleted >= 50 },
  { id: 'night_owl', name: 'Night Owl', icon: '🦉', desc: 'Study after 11 PM', condition: (s) => s.nightStudy },
  { id: 'early_bird', name: 'Early Bird', icon: '🐦', desc: 'Study before 7 AM', condition: (s) => s.earlyStudy },
  { id: 'multi_subject', name: 'Well Rounded', icon: '🌍', desc: 'Practice 3+ subjects', condition: (s) => s.subjectsStudied >= 3 },
];

export default function BadgeGrid({ stats = {} }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
      {ALL_BADGES.map(badge => {
        const earned = badge.condition(stats);
        return (
          <div key={badge.id} style={{
            background: earned ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.02)',
            border: `1px solid ${earned ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.04)'}`,
            borderRadius: 12, padding: '14px 8px', textAlign: 'center',
            opacity: earned ? 1 : 0.4,
            transition: 'all .2s',
          }}>
            <div style={{ fontSize: 28, marginBottom: 4, filter: earned ? 'none' : 'grayscale(1)' }}>
              {badge.icon}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: earned ? '#fff' : 'rgba(255,255,255,.3)', marginBottom: 2 }}>
              {badge.name}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)' }}>
              {badge.desc}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { ALL_BADGES };
