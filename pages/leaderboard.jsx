import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const MEDALS = ['🥇', '🥈', '🥉'];
const COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

export default function Leaderboard() {
  const [board, setBoard]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [myScore, setMyScore]   = useState(null);
  const [myRank, setMyRank]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [optedIn, setOptedIn]   = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [weekLabel, setWeekLabel] = useState('');

  useEffect(() => {
    // Get week label
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    setWeekLabel(`${weekStart.toLocaleDateString('en-GB', { day:'numeric', month:'short' })} – ${weekEnd.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}`);

    // Get user profile
    try {
      const saved = localStorage.getItem('nw_user');
      if (saved) {
        const profile = JSON.parse(saved);
        setUserProfile(profile);
        // Check if already opted in this week
        const alreadyIn = localStorage.getItem('nw_leaderboard_week');
        const thisWeek = weekStart.toISOString().split('T')[0];
        if (alreadyIn === thisWeek) setSubmitted(true);
      }
    } catch {}

    // Calculate this user's score from localStorage
    try {
      const sessionsUsed = parseInt(localStorage.getItem('nw_sessions_used') || '0');
      const streakRaw = localStorage.getItem('nw_streak');
      const streak = streakRaw ? JSON.parse(streakRaw)?.current || 0 : 0;
      const score = (sessionsUsed * 10) + (streak * 5);
      setMyScore(score);
    } catch {}

    fetchBoard();
  }, []);

  const fetchBoard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setBoard(data.board || []);

      // Find my rank
      try {
        const saved = localStorage.getItem('nw_user');
        if (saved) {
          const profile = JSON.parse(saved);
          const rank = (data.board || []).findIndex(e => e.name === (profile.name || '').split(' ')[0] && e.grade === profile.grade);
          if (rank !== -1) setMyRank(rank + 1);
        }
      } catch {}
    } catch {}
    setLoading(false);
  };

  const handleOptIn = async () => {
    if (!userProfile || submitting) return;
    setSubmitting(true);
    try {
      const sessionsUsed = parseInt(localStorage.getItem('nw_sessions_used') || '0');
      const streakRaw = localStorage.getItem('nw_streak');
      const streak = streakRaw ? JSON.parse(streakRaw)?.current || 0 : 0;
      const score = (sessionsUsed * 10) + (streak * 5);

      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: (userProfile.name || 'Student').split(' ')[0],
          grade: userProfile.grade || 'Student',
          score,
          sessions: sessionsUsed,
          streak,
        }),
      });

      if (res.ok) {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        localStorage.setItem('nw_leaderboard_week', weekStart.toISOString().split('T')[0]);
        setSubmitted(true);
        setMyScore(score);
        await fetchBoard();
      }
    } catch {}
    setSubmitting(false);
  };

  return (
    <>
      <Head>
        <title>Leaderboard — NewWorldEdu ★</title>
        <meta name="description" content="Weekly student leaderboard on NewWorldEdu. Earn points by studying with Starky, build streaks, and compete with other Cambridge students." />
        <meta property="og:title" content="Student Leaderboard — NewWorldEdu" />
        <meta property="og:description" content="Weekly student leaderboard on NewWorldEdu. Earn points by studying with Starky, build streaks, and compete with other Cambridge students." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080C18;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .row-hover:hover{background:rgba(255,255,255,0.06)!important;transform:translateX(3px);transition:all 0.2s}
      `}</style>

      {/* NAV */}
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(8,12,24,0.97)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'0 16px', height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/" style={{ fontFamily:"'Sora',sans-serif", fontSize:'17px', fontWeight:800, color:'#fff', textDecoration:'none' }}>
          NewWorldEdu<span style={{ color:'#4F8EF7' }}>★</span>
        </a>
        <a href="/" style={{ color:'#fff', fontSize:'13px', fontWeight:700, textDecoration:'none', background:'linear-gradient(135deg,#4F8EF7,#7C5CBF)', borderRadius:'20px', padding:'7px 16px' }}>← Home</a>
      </nav>

      <div style={{ maxWidth:'520px', margin:'0 auto', padding:'32px 16px 80px' }}>

        {/* HEADER */}
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ fontSize:'52px', marginBottom:'12px', animation:'float 3s ease-in-out infinite' }}>🏆</div>
          <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(24px,6vw,36px)', fontWeight:800, marginBottom:'8px' }}>
            Weekly Leaderboard
          </h1>
          <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>
            Top learners this week · {weekLabel}
          </p>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:'rgba(79,142,247,0.1)', border:'1px solid rgba(79,142,247,0.2)', borderRadius:'100px', padding:'5px 14px', fontSize:'12px', color:'#4F8EF7', fontWeight:600, marginTop:'8px' }}>
            🔒 Anonymous — first name + grade only
          </div>
        </div>

        {/* MY SCORE CARD */}
        {userProfile && (
          <div style={{ background:'rgba(79,142,247,0.08)', border:'1px solid rgba(79,142,247,0.2)', borderRadius:'18px', padding:'18px 20px', marginBottom:'20px', animation:'slideUp 0.3s ease-out' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
              <div>
                <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', fontWeight:600, marginBottom:'4px' }}>YOUR SCORE THIS WEEK</div>
                <div style={{ fontSize:'28px', fontFamily:"'Sora',sans-serif", fontWeight:800, color:'#4F8EF7' }}>
                  {myScore || 0} pts
                </div>
                {myRank && <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.5)', marginTop:'3px' }}>Rank #{myRank} on the board</div>}
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', marginBottom:'6px' }}>
                  {submitted ? '✅ On the board' : 'Not on the board yet'}
                </div>
                {!submitted ? (
                  <button onClick={handleOptIn} disabled={submitting} style={{
                    background: submitting ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#4F8EF7,#6366F1)',
                    border:'none', color: submitting ? 'rgba(255,255,255,0.3)' : '#fff',
                    borderRadius:'12px', padding:'10px 20px',
                    fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'14px',
                    cursor: submitting ? 'default' : 'pointer',
                  }}>
                    {submitting ? 'Adding...' : 'Join Board →'}
                  </button>
                ) : (
                  <button onClick={fetchBoard} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.6)', borderRadius:'12px', padding:'10px 16px', fontSize:'13px', cursor:'pointer', fontWeight:600 }}>
                    🔄 Refresh
                  </button>
                )}
              </div>
            </div>
            <div style={{ display:'flex', gap:'16px', marginTop:'14px', paddingTop:'12px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)' }}>
                📚 Score = sessions × 10 + streak days × 5
              </div>
            </div>
          </div>
        )}

        {!userProfile && (
          <div style={{ background:'rgba(255,179,71,0.08)', border:'1px solid rgba(255,179,71,0.2)', borderRadius:'16px', padding:'16px 18px', marginBottom:'20px', textAlign:'center' }}>
            <div style={{ fontSize:'14px', color:'rgba(255,255,255,0.6)', marginBottom:'12px' }}>Start a session with Starky to appear on the leaderboard</div>
            <a href="/#start-learning" style={{ display:'inline-block', background:'linear-gradient(135deg,#4F8EF7,#6366F1)', color:'#fff', borderRadius:'12px', padding:'10px 24px', fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'14px', textDecoration:'none' }}>
              Start Learning →
            </a>
          </div>
        )}

        {/* LEADERBOARD TABLE */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', overflow:'hidden' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'14px', fontWeight:700 }}>Top Learners</div>
            <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.3)' }}>Resets every Monday</div>
          </div>

          {loading ? (
            <div style={{ padding:'40px', textAlign:'center' }}>
              <div style={{ fontSize:'32px', marginBottom:'12px', animation:'float 2s ease-in-out infinite' }}>⏳</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'14px' }}>Loading...</div>
            </div>
          ) : board.length === 0 ? (
            <div style={{ padding:'40px', textAlign:'center' }}>
              <div style={{ fontSize:'40px', marginBottom:'12px' }}>🌱</div>
              <div style={{ fontWeight:700, fontSize:'16px', marginBottom:'8px' }}>No entries yet this week</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px' }}>Be the first to join the leaderboard!</div>
            </div>
          ) : (
            <div>
              {board.map((entry, i) => (
                <div key={i} className="row-hover" style={{
                  display:'flex', alignItems:'center', gap:'14px',
                  padding:'14px 20px',
                  borderBottom: i < board.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  background: i < 3 ? `rgba(${i===0?'255,215,0':i===1?'192,192,192':'205,127,50'},0.05)` : 'transparent',
                  transition:'all 0.2s', cursor:'default',
                }}>
                  {/* Rank */}
                  <div style={{ width:'32px', textAlign:'center', flexShrink:0 }}>
                    {i < 3 ? (
                      <span style={{ fontSize:'22px' }}>{MEDALS[i]}</span>
                    ) : (
                      <span style={{ fontSize:'14px', fontWeight:700, color:'rgba(255,255,255,0.3)' }}>#{i+1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width:'38px', height:'38px', borderRadius:'50%', flexShrink:0,
                    background:`linear-gradient(135deg, ${['#4F8EF7','#A78BFA','#2BB55A','#FF8C69','#FFB347'][i%5]}, ${['#6366F1','#7C5CBF','#4ECDC4','#FF6B6B','#FF8E53'][i%5]})`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:'14px', color:'#fff',
                  }}>
                    {entry.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>

                  {/* Name + grade */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:'15px', color: i < 3 ? COLORS[i] : '#fff' }}>
                      {entry.name}
                    </div>
                    <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', marginTop:'2px' }}>
                      {entry.grade} · {entry.sessions || 0} sessions · {entry.streak || 0} day streak
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:'16px', color: i < 3 ? COLORS[i] : 'rgba(255,255,255,0.7)' }}>
                      {entry.score}
                    </div>
                    <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.25)', marginTop:'1px' }}>pts</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HOW SCORING WORKS */}
        <div style={{ marginTop:'20px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'18px 20px' }}>
          <div style={{ fontWeight:700, fontSize:'14px', marginBottom:'12px' }}>⚡ How scoring works</div>
          {[
            { icon:'📚', label:'Each Starky session', pts:'+10 pts' },
            { icon:'🔥', label:'Each day in your streak', pts:'+5 pts' },
            { icon:'🔄', label:'Resets every Monday', pts:'fresh start' },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ fontSize:'13px', color:'rgba(255,255,255,0.6)' }}>{item.icon} {item.label}</div>
              <div style={{ fontSize:'13px', fontWeight:700, color:'#4F8EF7' }}>{item.pts}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop:'20px', textAlign:'center' }}>
          <a href="/#start-learning" style={{ display:'inline-block', background:'linear-gradient(135deg,#4F8EF7,#6366F1)', color:'#fff', borderRadius:'14px', padding:'14px 32px', fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'16px', textDecoration:'none', boxShadow:'0 8px 28px rgba(79,142,247,0.28)' }}>
            Earn More Points with Starky ★
          </a>
        </div>
      </div>
    </>
  );
}
