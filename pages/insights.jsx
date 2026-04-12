/**
 * pages/insights.jsx
 * Public national learning insights — anonymised aggregate data.
 * Shows what Pakistan's students are studying, struggling with, and improving at.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/insights')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>National Learning Insights — NewWorldEdu ★</title>
        <meta name="description" content="Live insights into what Pakistan's students are studying, struggling with, and improving at. Anonymised national learning data from NewWorld Education." />
        <meta property="og:title" content="Pakistan Student Learning Insights — NewWorldEdu" />
        <meta property="og:description" content="What are Pakistan's students studying this week? Live national learning data." />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight:'100vh', background:'#080C18', color:'#fff', fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif" }}>
        <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(8,12,24,0.97)', WebkitBackdropFilter:'blur(12px)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'0 16px', height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/"><a style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:800, color:'#fff', textDecoration:'none' }}>NewWorldEdu<span style={{ color:'#4F8EF7' }}>★</span></a></Link>
          <Link href="/"><a style={{ color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none', background:'linear-gradient(135deg,#4F8EF7,#7C5CBF)', borderRadius:20, padding:'7px 16px' }}>← Home</a></Link>
        </nav>

        <div style={{ maxWidth:560, margin:'0 auto', padding:'40px 20px 80px' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:48, marginBottom:14 }}>📊</div>
            <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(24px,6vw,36px)', fontWeight:800, marginBottom:10 }}>
              National Learning Insights
            </h1>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>
              What are Pakistan's students studying this week? Live anonymised data from NewWorldEdu.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:40, color:'rgba(255,255,255,0.4)' }}>Loading insights...</div>
          ) : !data || !data.totalMessagesThisWeek ? (
            <div style={{ textAlign:'center', padding:40 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🌱</div>
              <p style={{ color:'rgba(255,255,255,0.5)' }}>Insights will appear as students start using the platform. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Stats row */}
              <div style={{ display:'flex', gap:10, marginBottom:20 }}>
                <div style={{ flex:1, background:'rgba(79,142,247,0.08)', border:'1px solid rgba(79,142,247,0.2)', borderRadius:16, padding:'18px 14px', textAlign:'center' }}>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:800, color:'#4F8EF7' }}>{(data.totalMessagesThisWeek || 0).toLocaleString()}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:4 }}>Questions This Week</div>
                </div>
                <div style={{ flex:1, background:'rgba(168,224,99,0.08)', border:'1px solid rgba(168,224,99,0.2)', borderRadius:16, padding:'18px 14px', textAlign:'center' }}>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:800, color:'#A8E063' }}>{(data.activeStudentsThisWeek || 0).toLocaleString()}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:4 }}>Active Students</div>
                </div>
              </div>

              {/* Most confused topics */}
              {data.mostConfusedTopics?.length > 0 && (
                <div style={{ background:'rgba(248,113,113,0.06)', border:'1px solid rgba(248,113,113,0.15)', borderRadius:16, padding:'18px 20px', marginBottom:16 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#F87171', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Most Challenging Topics This Week</div>
                  {data.mostConfusedTopics.map((topic, i) => (
                    <div key={i} style={{ padding:'8px 0', borderBottom: i < data.mostConfusedTopics.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', fontSize:14, color:'rgba(255,255,255,0.7)' }}>
                      {i + 1}. {topic}
                    </div>
                  ))}
                </div>
              )}

              {/* Most active subjects */}
              {data.mostActiveSubjects?.length > 0 && (
                <div style={{ background:'rgba(79,142,247,0.06)', border:'1px solid rgba(79,142,247,0.15)', borderRadius:16, padding:'18px 20px', marginBottom:16 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#4F8EF7', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Most Studied Subjects</div>
                  {data.mostActiveSubjects.map((sub, i) => (
                    <div key={i} style={{ padding:'8px 0', borderBottom: i < data.mostActiveSubjects.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', fontSize:14, color:'rgba(255,255,255,0.7)' }}>
                      {sub}
                    </div>
                  ))}
                </div>
              )}

              {/* Peak time */}
              {data.peakStudyTime && (
                <div style={{ background:'rgba(167,139,250,0.06)', border:'1px solid rgba(167,139,250,0.15)', borderRadius:16, padding:'18px 20px', marginBottom:16 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#A78BFA', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Peak Study Time in Pakistan</div>
                  <div style={{ fontSize:20, fontWeight:800, fontFamily:"'Sora',sans-serif" }}>{data.peakStudyTime}</div>
                </div>
              )}

              <div style={{ textAlign:'center', marginTop:28 }}>
                <Link href="/learn">
                  <a style={{ display:'inline-block', background:'linear-gradient(135deg,#4F8EF7,#6366F1)', color:'#fff', borderRadius:14, padding:'14px 32px', fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:16, textDecoration:'none' }}>
                    Start Learning ★
                  </a>
                </Link>
              </div>

              <p style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.2)', marginTop:20 }}>
                All data is anonymised. No personal information is shown. Updated daily.
                {data.updatedAt && ` Last updated: ${new Date(data.updatedAt).toLocaleDateString('en-GB')}`}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
