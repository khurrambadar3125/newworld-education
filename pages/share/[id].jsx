import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SHARE_RENDERERS = {
  drill: ({ data }) => (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:56,marginBottom:12}}>{data.pct >= 80 ? '🏆' : data.pct >= 60 ? '🔥' : '💪'}</div>
      <div style={{fontSize:13,color:'rgba(255,255,255,0.4)',fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:6}}>{data.level} · {data.subject}</div>
      <h1 style={{fontSize:36,fontWeight:900,margin:'0 0 8px'}}>{data.pct}%</h1>
      <div style={{fontSize:16,color:'rgba(255,255,255,0.6)',marginBottom:24}}>{data.correct}/{data.total} correct{data.name ? ` by ${data.name}` : ''}</div>
      {data.weakAreas?.length > 0 && (
        <div style={{background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.25)',borderRadius:14,padding:'14px 18px',marginBottom:20,textAlign:'left'}}>
          <div style={{fontSize:11,fontWeight:800,color:'#F87171',marginBottom:6}}>NEEDS PRACTICE</div>
          {data.weakAreas.map((t,i) => <div key={i} style={{fontSize:14,color:'rgba(255,255,255,0.6)',padding:'2px 0'}}>• {t}</div>)}
        </div>
      )}
      <Link href={`/drill`}><a style={S.cta}>Try This Drill Yourself →</a></Link>
      <div style={{marginTop:12}}><Link href="/"><a style={S.secondary}>Start Learning with Starky ★</a></Link></div>
    </div>
  ),

  essay: ({ data }) => (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:56,marginBottom:12}}>✍️</div>
      <div style={{fontSize:13,color:'rgba(255,255,255,0.4)',letterSpacing:1,textTransform:'uppercase',marginBottom:6}}>{data.level} · {data.subject}</div>
      <div style={{display:'inline-block',background:'rgba(74,222,128,0.15)',border:'1px solid rgba(74,222,128,0.3)',borderRadius:100,padding:'8px 24px',fontSize:28,fontWeight:900,color:'#4ADE80',marginBottom:8}}>{data.grade}</div>
      <div style={{fontSize:15,color:'rgba(255,255,255,0.5)',marginBottom:20}}>{data.band} · {data.score}/{data.maxScore} marks{data.name ? ` — ${data.name}` : ''}</div>
      <Link href="/essay"><a style={S.cta}>Get Your Essay Marked →</a></Link>
    </div>
  ),

  challenge: ({ data }) => (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:56,marginBottom:12}}>⚔️</div>
      <h1 style={{fontSize:24,fontWeight:900,margin:'0 0 8px'}}>Challenge!</h1>
      <div style={{fontSize:16,color:'rgba(255,255,255,0.6)',marginBottom:8}}>{data.name || 'A student'} scored <strong style={{color:'#4ADE80'}}>{data.pct}%</strong> on {data.subject}</div>
      <div style={{fontSize:14,color:'rgba(255,255,255,0.35)',marginBottom:24}}>Topic: {data.topic} · {data.difficulty} · {data.level}</div>
      <Link href={`/drill`}><a style={S.cta}>Accept Challenge — Beat {data.pct}% →</a></Link>
    </div>
  ),

  assignment: ({ data }) => (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:56,marginBottom:12}}>📋</div>
      <div style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:8}}>Assignment from {data.setBy || 'your parent'}</div>
      <div style={{background:'rgba(167,139,250,0.15)',border:'1px solid rgba(167,139,250,0.3)',borderRadius:14,padding:'20px',fontSize:18,fontWeight:700,color:'#fff',marginBottom:24,lineHeight:1.6}}>{data.topic}</div>
      <Link href="/"><a style={S.cta}>Open Starky and Start Studying →</a></Link>
    </div>
  ),

  streak: ({ data }) => (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:56,marginBottom:12}}>🔥</div>
      <h1 style={{fontSize:36,fontWeight:900,margin:'0 0 4px',color:'#FB923C'}}>{data.streak} Day Streak</h1>
      <div style={{fontSize:15,color:'rgba(255,255,255,0.5)',marginBottom:16}}>{data.questions} questions answered{data.name ? ` by ${data.name}` : ''}</div>
      {data.badges?.length > 0 && (
        <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:20}}>
          {data.badges.map((b,i) => <span key={i} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'6px 12px',fontSize:13}}>{b.emoji} {b.label}</span>)}
        </div>
      )}
      <Link href="/drill"><a style={S.cta}>Start Your Own Streak →</a></Link>
    </div>
  ),

  badge: ({ data }) => (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:72,marginBottom:12}}>{data.emoji}</div>
      <h1 style={{fontSize:24,fontWeight:900,margin:'0 0 4px'}}>{data.label}</h1>
      <div style={{fontSize:15,color:'rgba(255,255,255,0.5)',marginBottom:8}}>{data.desc}</div>
      <div style={{fontSize:13,color:'rgba(255,255,255,0.3)',marginBottom:24}}>Earned on NewWorld Education{data.name ? ` by ${data.name}` : ''}</div>
      <Link href="/drill"><a style={S.cta}>Start Earning Badges →</a></Link>
    </div>
  ),

  invite: ({ data }) => (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:56,marginBottom:12}}>★</div>
      <h1 style={{fontSize:24,fontWeight:900,margin:'0 0 8px'}}>You're Invited!</h1>
      <div style={{fontSize:16,color:'rgba(255,255,255,0.6)',marginBottom:8}}>{data.name || 'A friend'} wants you to try NewWorld Education</div>
      <div style={{fontSize:14,color:'rgba(255,255,255,0.35)',marginBottom:24,lineHeight:1.7}}>Free personal tutor for Cambridge O Level & A Level. Every subject, 24/7, with past paper expertise.</div>
      <Link href="/"><a style={S.cta}>Start Learning Free →</a></Link>
    </div>
  ),

  leaderboard: ({ data }) => (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:56,marginBottom:12}}>{data.rank <= 3 ? ['🥇','🥈','🥉'][data.rank-1] : '🏆'}</div>
      <h1 style={{fontSize:24,fontWeight:900,margin:'0 0 4px'}}>#{data.rank} on the Leaderboard</h1>
      <div style={{fontSize:16,color:'rgba(255,255,255,0.6)',marginBottom:24}}>{data.name} · {data.grade} · Score: {data.score}</div>
      <Link href="/leaderboard"><a style={S.cta}>Join the Leaderboard →</a></Link>
    </div>
  ),
};

const S = {
  cta: { display:'block',background:'linear-gradient(135deg,#4F8EF7,#6366F1)',color:'#fff',padding:'16px 32px',borderRadius:100,textDecoration:'none',fontWeight:800,fontSize:16,textAlign:'center' },
  secondary: { color:'rgba(255,255,255,0.5)',fontSize:14,textDecoration:'none' },
};

function getOGData(share) {
  if (!share) return { title: 'NewWorld Education', desc: 'Personal tutor for Cambridge O Level & A Level' };
  const d = share.data;
  switch (share.type) {
    case 'drill': return { title: `${d.pct}% on ${d.subject} Drill`, desc: `${d.correct}/${d.total} correct. Can you beat this?` };
    case 'essay': return { title: `Got ${d.grade} on ${d.subject} Essay`, desc: `${d.band} — ${d.score}/${d.maxScore} marks` };
    case 'challenge': return { title: `Challenge: Beat ${d.pct}% on ${d.subject}`, desc: `${d.topic} · ${d.level}. Accept the challenge!` };
    case 'assignment': return { title: `Study: ${d.topic}`, desc: `Assignment from ${d.setBy || 'a parent'}` };
    case 'streak': return { title: `${d.streak} Day Study Streak!`, desc: `${d.questions} questions answered on NewWorldEdu` };
    case 'badge': return { title: `${d.emoji} ${d.label}`, desc: d.desc };
    case 'invite': return { title: `${d.name || 'A friend'} invited you`, desc: 'Free personal tutor for Cambridge exams' };
    case 'leaderboard': return { title: `#${d.rank} on the Leaderboard`, desc: `${d.name} scored ${d.score} this week` };
    default: return { title: 'NewWorld Education', desc: 'Personal tutor for Cambridge O Level & A Level' };
  }
}

export default function SharePage() {
  const [share, setShare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const id = window.location.pathname.split('/').pop();
    if (!id) { setError(true); setLoading(false); return; }
    fetch(`/api/share?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(true); } else { setShare(data); }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const og = getOGData(share);
  const Renderer = share ? SHARE_RENDERERS[share.type] : null;

  return (
    <>
      <Head>
        <title>{og.title} — NewWorldEdu</title>
        <meta name="description" content={og.desc} />
        <meta property="og:title" content={og.title} />
        <meta property="og:description" content={og.desc} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NewWorld Education" />
        <meta property="og:image" content="https://www.newworld.education/favicon.svg" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={og.title} />
        <meta name="twitter:description" content={og.desc} />
      </Head>
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#060B20,#0D1635)',color:'#fff',fontFamily:"'Nunito',-apple-system,sans-serif",display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <div style={{maxWidth:480,width:'100%'}}>
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:24,padding:'36px 28px'}}>
            {loading && <div style={{textAlign:'center',color:'rgba(255,255,255,0.4)'}}>Loading...</div>}
            {error && (
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:48,marginBottom:12}}>★</div>
                <h1 style={{fontSize:22,fontWeight:900,marginBottom:8}}>Link expired</h1>
                <div style={{color:'rgba(255,255,255,0.5)',marginBottom:24}}>This link is no longer available.</div>
                <Link href="/"><a style={S.cta}>Go to NewWorldEdu →</a></Link>
              </div>
            )}
            {Renderer && <Renderer data={share.data} />}
          </div>
          <div style={{textAlign:'center',marginTop:16}}>
            <Link href="/"><a style={{color:'rgba(255,255,255,0.3)',fontSize:13,textDecoration:'none'}}>★ NewWorld Education — Personal tutor for Cambridge O Level & A Level</a></Link>
          </div>
        </div>
      </div>
    </>
  );
}
