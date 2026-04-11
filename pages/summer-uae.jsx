import { useState, useEffect } from "react";
import Head from "next/head";
import { UAE_SUMMER_BADGES } from "../utils/uaeSummerKnowledge";

const PASS_KEY = 'nw_summer_uae_passport';
function loadPassport() { try { return JSON.parse(localStorage.getItem(PASS_KEY) || '{}'); } catch { return {}; } }

const TRACKS = [
  { id:'bridge', emoji:'🚀', name:'Bridge to Next Year', who:'Moving up a grade in September', what:'Get ahead before classmates open their books. Starky teaches next year\'s topics now.', flags:'🇬🇧 🎓 🇺🇸 🇮🇳 🇦🇪', color:'#4F8EF7', cta:'Start bridging →', href:'/#start-learning' },
  { id:'emsat', emoji:'🎯', name:'EmSAT Intensive', who:'Grade 11-12 UAE MoE students', what:'UAEU, AUS, Khalifa, Zayed — all require EmSAT. 25 sessions per subject. University-targeted scores.', scores:[{uni:'UAEU',score:'1250+'},{uni:'AUS',score:'1500+'},{uni:'Khalifa',score:'1400+'}], color:'#4ECDC4', cta:'Prepare for EmSAT →', href:'/drill?context=emsat' },
  { id:'catchup', emoji:'📚', name:'Catch Up', who:'Students who struggled this year', what:'Summer is the best time to fix gaps. No pressure. Your pace. Starky has infinite patience.', color:'#FFC300', cta:'Start catching up →', href:'/#start-learning' },
  { id:'sen', emoji:'💙', name:'Students of Determination', who:'Inclusive summer — all abilities', what:'Fully accessible. Aligned with KHDA\'s inclusive summer programme. Same learning. Your way.', badge:'KHDA Aligned', color:'#C77DFF', cta:'Start learning →', href:'/special-needs' },
  { id:'university', emoji:'🏛️', name:'University Ready', who:'Grade 12 graduates', what:'Results coming in August. EmSAT improvement. Personal statement. University application preparation.', unis:'UAEU, AUS, Khalifa, Zayed, HCT, AUD, UOWD', color:'#FF6B6B', cta:'Prepare for university →', href:'/drill?subject=EmSAT%20English' },
  { id:'headstart', emoji:'🏆', name:'Head Start', who:'Any student — all curricula', what:'Arrive in September already knowing what your teacher is about to teach. First in class to raise your hand.', stat:'Research shows summer learners arrive 3 months ahead in maths', flags:'🇬🇧 🎓 🇺🇸 🇮🇳 🇦🇪', color:'#4ADE80', cta:'Get your head start →', href:'/#start-learning' },
  { id:'reading', emoji:'📖', name:'Summer Reading', who:'All ages — all curricula', what:'Read your IGCSE set texts, IB World Literature, or any book you love. Starky discusses every chapter, builds your analysis skills, and prepares you for English essays before September.', stat:'Summer readers arrive 1.9 months ahead in literacy', flags:'🇬🇧 🎓 🇺🇸 🇮🇳 🇦🇪', color:'#FF8E53', cta:'Start reading with Starky →', href:'/reading' },
];

const CURRICULA = [
  { flag:'🇬🇧', name:'British', sub:'IGCSE / A Level', desc:'37% of Dubai students. Every IGCSE and A Level subject.', color:'#4F8EF7' },
  { flag:'🎓', name:'IB', sub:'International Baccalaureate', desc:'All 6 subject groups. TOK, EE, IA preparation.', color:'#4ECDC4' },
  { flag:'🇺🇸', name:'American', sub:'AP / SAT / ACT', desc:'All AP subjects. SAT and ACT preparation.', color:'#FF6B6B' },
  { flag:'🇮🇳', name:'Indian', sub:'CBSE', desc:'Science, Commerce, Arts streams. JEE and NEET foundation.', color:'#FF8E53' },
  { flag:'🇦🇪', name:'UAE MoE', sub:'Ministry of Education', desc:'All 7 EmSAT subjects. Cycle 1-3, General and Advanced tracks.', color:'#FFC300' },
];

const BADGES = [
  { icon:'☀', name:'Early Riser', desc:'First session before 9am', color:'#FFC300' },
  { icon:'★', name:'Dubai Scholar', desc:'5 sessions complete', color:'#4F8EF7' },
  { icon:'✦', name:'KHDA Champion', desc:'15 sessions complete', color:'#4ECDC4' },
  { icon:'▲', name:'University Ready', desc:'25 sessions complete', color:'#A78BFA' },
  { icon:'◆', name:'Dubai Summer Champion', desc:'40 sessions complete', color:'#FF6B6B' },
  { icon:'♥', name:'Community Spirit', desc:'Completed SoD inclusive track', color:'#C77DFF' },
  { icon:'●', name:'Global Learner', desc:'Studied in 2+ languages', color:'#4ADE80' },
];

export default function SummerUAEPage() {
  const [passport, setPassport] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => { const fn = () => setIsMobile(window.innerWidth < 768); fn(); window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn); }, []);
  useEffect(() => { setPassport(loadPassport()); }, []);

  const totalStamps = passport.stamps?.length || 0;

  const now = new Date();
  const summerStart = new Date(now.getFullYear(), 6, 1); // July 1
  const summerEnd = new Date(now.getFullYear(), 7, 26); // Aug 26
  const isSummerActive = now >= summerStart && now <= summerEnd;
  const daysUntilSummer = !isSummerActive && now < summerStart ? Math.ceil((summerStart - now) / 86400000) : 0;

  const f = "'Sora',sans-serif";
  const max = { maxWidth: 640, margin: '0 auto' };
  const pill = { display:'inline-flex', alignItems:'center', gap:6, background:'rgba(79,142,247,0.12)', border:'1px solid rgba(79,142,247,0.3)', borderRadius:100, padding:'5px 16px', fontSize:11, fontWeight:700, color:'#4F8EF7', letterSpacing:'0.06em', textTransform:'uppercase' };
  const sectionPad = { padding: isMobile ? '48px 20px' : '64px 20px' };
  const heading = (size) => ({ fontSize: `clamp(${size-6}px,5vw,${size}px)`, fontWeight:900, lineHeight:1.15, fontFamily:f });

  return (
    <>
      <Head>
        <title>UAE Summer Programme 2026 — NewWorldEdu</title>
        <meta name="description" content="54 days. 45°C outside. The smartest thing your child can do is stay ahead. British, IB, American, CBSE, UAE MoE — Starky knows every curriculum. 10 free sessions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#060B20;color:#fff}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        .su-track:hover{transform:translateY(-3px)!important;box-shadow:0 12px 40px rgba(0,0,0,0.35)!important}
        .su-curr:hover{transform:translateY(-2px)!important;border-color:rgba(255,255,255,0.2)!important}
        .su-badge:hover{transform:scale(1.05)!important}
        .su-cta{transition:all 0.2s}
        .su-cta:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(79,142,247,0.4)!important}
        .su-step:hover{background:rgba(255,255,255,0.05)!important}
      `}</style>

      <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,#060B20 0%,#0A1628 40%,#060B20 100%)', fontFamily:f }}>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* SECTION 1 — HERO                                                       */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <section style={{ textAlign:'center', padding: isMobile ? '44px 20px 36px' : '72px 20px 48px', ...max }}>
          <div style={pill}>☀️ UAE Summer 2026 — 1 July to 26 August</div>

          <h1 style={{ ...heading(42), margin:'20px 0 0' }}>
            54 days. 45°C outside.
          </h1>
          <h1 style={{ ...heading(36), marginTop:4, background:'linear-gradient(135deg,#4F8EF7,#4ECDC4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            The smartest thing your child can do is stay ahead.
          </h1>

          <p style={{ fontSize:15, color:'rgba(255,255,255,0.5)', lineHeight:1.7, maxWidth:480, margin:'16px auto 28px' }}>
            Starky is the only AI tutor in the UAE that knows every curriculum — British, IB, American, CBSE, and UAE MoE. 10 free sessions. No credit card.
          </p>

          <a href="/#start-learning" className="su-cta" style={{ display:'block', maxWidth:400, margin:'0 auto', background:'linear-gradient(135deg,#4F8EF7,#4ECDC4)', color:'#fff', padding:'18px 32px', borderRadius:100, fontSize:17, fontWeight:800, textDecoration:'none', boxShadow:'0 8px 32px rgba(79,142,247,0.3)', textAlign:'center' }}>
            Start your UAE summer →
          </a>

          {/* Trust signals */}
          <div style={{ display:'flex', justifyContent:'center', gap: isMobile ? 20 : 36, marginTop:24, flexWrap:'wrap' }}>
            {[{e:'🎓',t:'10 free sessions'},{e:'📚',t:'5 curricula'},{e:'🌍',t:'16+ languages'}].map(s=>(
              <div key={s.t} style={{fontSize:13,color:'rgba(255,255,255,0.4)',fontWeight:600}}><span style={{marginRight:4}}>{s.e}</span>{s.t}</div>
            ))}
          </div>

          {daysUntilSummer > 0 && (
            <div style={{ background:'rgba(255,195,0,0.08)', border:'1px solid rgba(255,195,0,0.2)', borderRadius:100, padding:'8px 20px', fontSize:13, color:'#FFC300', fontWeight:700, display:'inline-block', marginTop:20 }}>
              ☀️ Summer starts in {daysUntilSummer} days
            </div>
          )}
          {isSummerActive && (
            <div style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:100, padding:'8px 20px', fontSize:13, color:'#4ADE80', fontWeight:700, display:'inline-block', marginTop:20 }}>
              ☀️ Summer is LIVE — start learning today
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* SECTION 2 — THE PAIN                                                   */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <section style={{ ...sectionPad, background:'rgba(255,255,255,0.015)', borderTop:'1px solid rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
          <div style={max}>
            <h2 style={{ ...heading(28), textAlign:'center', marginBottom:24 }}>
              Every other summer programme in Dubai costs AED 5,000 or more.
            </h2>

            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:12, marginBottom:20 }}>
              {[
                { big:'AED 5,000+', sub:'Average Dubai summer camp fee', color:'#FF6B6B' },
                { big:'8 weeks', sub:'Of learning lost every summer', color:'#FFC300' },
                { big:'45°C', sub:'Too hot to go anywhere', color:'#FF8E53' },
              ].map(c=>(
                <div key={c.big} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'24px 16px', textAlign:'center' }}>
                  <div style={{ fontSize:28, fontWeight:900, color:c.color, marginBottom:4 }}>{c.big}</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>{c.sub}</div>
                </div>
              ))}
            </div>

            <p style={{ textAlign:'center', fontSize:15, color:'rgba(255,255,255,0.55)', fontWeight:600 }}>
              Starky offers <span style={{color:'#4ECDC4',fontWeight:800}}>10 free sessions</span> to start. And it knows your child's curriculum.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* SECTION 3 — 5 SUMMER TRACKS                                            */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <section style={sectionPad}>
          <div style={max}>
            <h2 style={{ ...heading(28), textAlign:'center', marginBottom:6 }}>Choose your summer track.</h2>
            <p style={{ textAlign:'center', fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:28 }}>Every track is personalised to your child's curriculum and grade.</p>

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {TRACKS.map((t,i)=>(
                <a key={t.id} href={t.href} className="su-track" style={{ display:'block', textDecoration:'none', color:'#fff', background:`${t.color}06`, border:`1.5px solid ${t.color}20`, borderRadius:20, padding: isMobile ? '20px 16px' : '24px', transition:'all 0.2s', animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                  <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                    <span style={{ fontSize:30, lineHeight:1, flexShrink:0 }}>{t.emoji}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:900, fontSize:16, color:t.color }}>Track {i+1} — {t.name}</div>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', fontWeight:600, marginTop:2 }}>{t.who}</div>
                      <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.6, margin:'8px 0' }}>{t.what}</p>

                      {t.scores && (
                        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:6 }}>
                          {t.scores.map(s=>(
                            <span key={s.uni} style={{ fontSize:11, fontWeight:700, background:`${t.color}15`, border:`1px solid ${t.color}30`, borderRadius:100, padding:'3px 10px', color:t.color }}>{s.uni}: {s.score}</span>
                          ))}
                        </div>
                      )}
                      {t.flags && <div style={{ fontSize:14, letterSpacing:4, marginBottom:4 }}>{t.flags}</div>}
                      {t.unis && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>{t.unis}</div>}
                      {t.badge && <span style={{ fontSize:11, fontWeight:800, background:'rgba(199,125,255,0.15)', border:'1px solid rgba(199,125,255,0.3)', borderRadius:100, padding:'3px 10px', color:'#C77DFF' }}>{t.badge}</span>}
                      {t.stat && <div style={{ fontSize:11, color:'rgba(74,222,128,0.7)', fontWeight:600, fontStyle:'italic', marginTop:4 }}>{t.stat}</div>}
                    </div>
                  </div>
                  <div style={{ marginTop:12, textAlign:'right' }}>
                    <span style={{ background:t.color, color:'#060B20', padding:'7px 18px', borderRadius:100, fontSize:12, fontWeight:800 }}>{t.cta}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* SECTION 4 — THE 5 CURRICULA                                            */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <section style={{ ...sectionPad, background:'rgba(255,255,255,0.015)', borderTop:'1px solid rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ maxWidth:720, margin:'0 auto' }}>
            <h2 style={{ ...heading(28), textAlign:'center', marginBottom:6 }}>Starky knows your curriculum.</h2>
            <p style={{ textAlign:'center', fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:28 }}>Every subject. Every syllabus. Every exam board.</p>

            <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:8, WebkitOverflowScrolling:'touch', scrollSnapType:'x mandatory' }}>
              {CURRICULA.map(c=>(
                <div key={c.name} className="su-curr" style={{ minWidth: isMobile ? 200 : 0, flex: isMobile ? '0 0 200px' : 1, background:'rgba(255,255,255,0.03)', border:'1.5px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'20px 16px', textAlign:'center', scrollSnapAlign:'start', transition:'all 0.2s' }}>
                  <div style={{ fontSize:32, marginBottom:6 }}>{c.flag}</div>
                  <div style={{ fontWeight:900, fontSize:15, color:c.color }}>{c.name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', fontWeight:600, marginBottom:6 }}>{c.sub}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.5 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* SECTION 5 — SUMMER PASSPORT                                            */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <section style={sectionPad}>
          <div style={{ maxWidth:680, margin:'0 auto' }}>
            <h2 style={{ ...heading(28), textAlign:'center', marginBottom:6 }}>Earn your UAE Summer Passport.</h2>
            <p style={{ textAlign:'center', fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:28 }}>Complete sessions. Earn badges. Build the habit.</p>

            <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:8, WebkitOverflowScrolling:'touch', scrollSnapType:'x mandatory' }}>
              {BADGES.map(b=>{
                const thresholds = { 'Early Riser':1, 'Dubai Scholar':5, 'KHDA Champion':15, 'University Ready':25, 'Dubai Summer Champion':40 };
                const earned = totalStamps >= (thresholds[b.name] || 999);
                return (
                  <div key={b.name} className="su-badge" style={{ minWidth:120, flex:'0 0 120px', background: earned ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.02)', border: earned ? '1.5px solid rgba(74,222,128,0.25)' : '1.5px solid rgba(255,255,255,0.05)', borderRadius:16, padding:'18px 10px', textAlign:'center', scrollSnapAlign:'start', transition:'all 0.2s' }}>
                    <div style={{ fontSize:28, marginBottom:4, color: earned ? b.color : 'rgba(255,255,255,0.15)', fontWeight:900, lineHeight:1 }}>{b.icon}</div>
                    <div style={{ fontSize:12, fontWeight:800, color: earned ? '#4ADE80' : 'rgba(255,255,255,0.3)' }}>{b.name}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:2, lineHeight:1.3 }}>{b.desc}</div>
                  </div>
                );
              })}
            </div>

            {totalStamps > 0 && (
              <div style={{ textAlign:'center', marginTop:16, fontSize:14, fontWeight:800, color:'#4ECDC4' }}>
                🎫 {totalStamps} session{totalStamps !== 1 ? 's' : ''} completed
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* SECTION 6 — HOW IT WORKS                                               */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <section style={{ ...sectionPad, background:'rgba(255,255,255,0.015)', borderTop:'1px solid rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
          <div style={max}>
            <h2 style={{ ...heading(28), textAlign:'center', marginBottom:28 }}>Three steps. That's it.</h2>

            <div style={{ display:'flex', flexDirection: isMobile ? 'column' : 'row', gap:14 }}>
              {[
                { icon:'📱', title:'Open Starky', desc:'No download. No app store. Just newworld.education' },
                { icon:'📚', title:'Tell Starky your curriculum', desc:'British, IB, American, CBSE, or UAE MoE. Starky knows all of them.' },
                { icon:'🚀', title:'Start your summer track', desc:'30 minutes a day. Your child\'s pace. Always.' },
              ].map((s,i)=>(
                <div key={s.title} className="su-step" style={{ flex:1, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'24px 18px', textAlign:'center', transition:'all 0.15s' }}>
                  <div style={{ fontSize:36, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:13, fontWeight:900, color:'#4F8EF7', marginBottom:2 }}>Step {i+1}</div>
                  <div style={{ fontSize:15, fontWeight:800, marginBottom:6 }}>{s.title}</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* SECTION 7 — KHDA TRUST                                                 */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <section style={{ ...sectionPad, background:'rgba(79,142,247,0.04)' }}>
          <div style={max}>
            <h2 style={{ ...heading(28), textAlign:'center', marginBottom:28 }}>Built for Dubai.</h2>

            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:16, marginBottom:20 }}>
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'24px 20px' }}>
                <div style={{ fontWeight:900, fontSize:15, color:'#4F8EF7', marginBottom:8 }}>Aligned with KHDA standards</div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.7 }}>
                  Starky supports all mandatory subjects — Islamic Education, Arabic, MSC, and Social Studies — for every private school student in the UAE.
                </p>
              </div>
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'24px 20px' }}>
                <div style={{ fontWeight:900, fontSize:15, color:'#4ECDC4', marginBottom:8 }}>Supporting KHDA Education 33</div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.7 }}>
                  KHDA's Education 33 strategy promotes lifelong learning and summer enrichment. NewWorldEdu is built around exactly this vision.
                </p>
              </div>
            </div>

            <div style={{ textAlign:'center' }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(79,142,247,0.1)', border:'1px solid rgba(79,142,247,0.25)', borderRadius:100, padding:'6px 18px', fontSize:12, fontWeight:800, color:'#4F8EF7' }}>
                🏛️ KHDA Education 33 Aligned
              </span>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════ */}
        {/* SECTION 8 — FINAL CTA                                                  */}
        {/* ════════════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: isMobile ? '56px 20px 48px' : '80px 20px 64px', textAlign:'center' }}>
          <h2 style={{ ...heading(30), marginBottom:12 }}>54 days. Make them count.</h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.45)', maxWidth:420, margin:'0 auto 28px', lineHeight:1.6 }}>
            Your child's summer starts the moment they open Starky.
          </p>

          <a href="/#start-learning" className="su-cta" style={{ display:'inline-block', background:'linear-gradient(135deg,#4F8EF7,#4ECDC4)', color:'#fff', padding:'18px 40px', borderRadius:100, fontSize:17, fontWeight:800, textDecoration:'none', boxShadow:'0 8px 32px rgba(79,142,247,0.3)' }}>
            Start your UAE summer — 10 sessions free →
          </a>

          <p style={{ fontSize:13, color:'rgba(255,255,255,0.3)', marginTop:16 }}>
            No credit card. No download. No commitment. Just learning.
          </p>

          <div style={{ marginTop:16, fontSize:22, letterSpacing:8 }}>🇬🇧 🎓 🇺🇸 🇮🇳 🇦🇪</div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ padding:'24px 20px', borderTop:'1px solid rgba(255,255,255,0.06)', textAlign:'center', fontSize:12, color:'rgba(255,255,255,0.2)' }}>
          © 2026 NewWorldEdu · newworld.education · Built for Dubai
        </footer>
      </div>
    </>
  );
}
