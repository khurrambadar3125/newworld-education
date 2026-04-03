/**
 * pages/countdown.jsx  v3
 * All subject dates sourced from:
 * Cambridge Final Exam Timetable June 2026 — Administrative Zone 4
 * Version 1, October 2025
 * https://www.cambridgeinternational.org/Images/745759-june-2026-zone-4-timetable.pdf
 * Dates shown = FIRST PAPER date for each subject.
 */

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import LegalFooter from '../components/LegalFooter';
const TIMETABLE_URL = 'https://www.cambridgeinternational.org/Images/745759-june-2026-zone-4-timetable.pdf';

const OLEVEL_SUBJECTS = [
  { name: 'Islamiyat',              code: '2058', first: new Date('2026-04-24') },
  { name: 'Pakistan Studies',       code: '2059', first: new Date('2026-04-28') },
  { name: 'First Language Urdu',    code: '3247', first: new Date('2026-04-27') },
  { name: 'Second Language Urdu',   code: '3248', first: new Date('2026-04-27') },
  { name: 'English Language',       code: '1123', first: new Date('2026-04-27') },
  { name: 'Chemistry',              code: '5070', first: new Date('2026-04-28') },
  { name: 'Biology',                code: '5090', first: new Date('2026-04-30') },
  { name: 'Mathematics',            code: '4024', first: new Date('2026-04-29') },
  { name: 'Physics',                code: '5054', first: new Date('2026-05-04') },
  { name: 'Literature in English',  code: '2010', first: new Date('2026-05-08') },
  { name: 'History',                code: '2147', first: new Date('2026-05-07') },
  { name: 'Business Studies',       code: '7115', first: new Date('2026-05-11') },
  { name: 'Computer Science',       code: '2210', first: new Date('2026-05-13') },
  { name: 'Sociology',              code: '2251', first: new Date('2026-05-15') },
  { name: 'Additional Mathematics', code: '4037', first: new Date('2026-05-18') },
  { name: 'Accounting',             code: '7707', first: new Date('2026-05-20') },
  { name: 'Economics',              code: '2281', first: new Date('2026-05-22') },
  { name: 'Commerce',               code: '7100', first: new Date('2026-05-28') },
];

const ALEVEL_SUBJECTS = [
  { name: 'English Language',       code: '9093', first: new Date('2026-04-27') },
  { name: 'Thinking Skills',        code: '9694', first: new Date('2026-04-27') },
  { name: 'Psychology',             code: '9990', first: new Date('2026-04-28') },
  { name: 'Mathematics',            code: '9709', first: new Date('2026-04-29') },
  { name: 'Literature in English',  code: '9695', first: new Date('2026-04-29') },
  { name: 'Business',               code: '9609', first: new Date('2026-05-05') },
  { name: 'History',                code: '9489', first: new Date('2026-05-05') },
  { name: 'Economics',              code: '9708', first: new Date('2026-05-06') },
  { name: 'Chemistry (AL)',         code: '9701', first: new Date('2026-05-07') },
  { name: 'Geography',              code: '9696', first: new Date('2026-05-07') },
  { name: 'Further Mathematics',    code: '9231', first: new Date('2026-05-07') },
  { name: 'Biology (AL)',           code: '9700', first: new Date('2026-05-08') },
  { name: 'Computer Science',       code: '9618', first: new Date('2026-05-08') },
  { name: 'Accounting',             code: '9706', first: new Date('2026-05-08') },
  { name: 'Physics (AL)',           code: '9702', first: new Date('2026-05-11') },
  { name: 'Sociology',              code: '9699', first: new Date('2026-05-12') },
  { name: 'Biology (AS)',           code: '9700', first: new Date('2026-05-13') },
  { name: 'Chemistry (AS)',         code: '9701', first: new Date('2026-05-18') },
  { name: 'Physics (AS)',           code: '9702', first: new Date('2026-05-20') },
  { name: 'Law',                    code: '9084', first: new Date('2026-05-22') },
];

const SESSIONS = {
  mj26: { label: 'May/June 2026', start: new Date('2026-04-23T00:00:00'), end: new Date('2026-06-09T23:59:59') },
  on26: { label: 'Oct/Nov 2026',  start: new Date('2026-10-01T00:00:00'), end: new Date('2026-11-13T23:59:59') },
};

const DRILL_SUBJECTS = ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'Economics', 'Computer Science', 'English Language', 'Pakistan Studies'];

function msToCountdown(ms) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const s = Math.floor(ms / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}
function daysUntil(date) { return Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)); }
function urgencyStyle(d) {
  if (d <= 0)  return { text: '#F87171', bg: 'rgba(248,113,113,.12)', border: 'rgba(248,113,113,.3)' };
  if (d <= 7)  return { text: '#F87171', bg: 'rgba(248,113,113,.08)', border: 'rgba(248,113,113,.2)' };
  if (d <= 21) return { text: '#FCD34D', bg: 'rgba(252,211,77,.08)',  border: 'rgba(252,211,77,.2)'  };
  if (d <= 42) return { text: '#A78BFA', bg: 'rgba(167,139,250,.07)', border: 'rgba(167,139,250,.18)' };
  return             { text: '#4ADE80', bg: 'rgba(74,222,128,.07)',  border: 'rgba(74,222,128,.15)' };
}
function pad(n) { return String(n).padStart(2, '0'); }
function fmtDate(d) { return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }

export default function CountdownPage() {
  const [session,     setSession]     = useState('mj26');
  const [level,       setLevel]       = useState('olevel');
  const [mySubjects,  setMySubjects]  = useState([]);
  const [showPicker,  setShowPicker]  = useState(false);
  const [countdown,   setCountdown]   = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [now,         setNow]         = useState(new Date());
  const [userProfile, setUserProfile] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nw_my_subjects');
      if (saved) setMySubjects(JSON.parse(saved));
      const prof = localStorage.getItem('nw_user');
      if (prof) setUserProfile(JSON.parse(prof));
    } catch {}
  }, []);

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const sess = SESSIONS[session];
      const target = n < sess.start ? sess.start : null;
      setNow(n);
      setCountdown(target ? msToCountdown(target - n) : { days: 0, hours: 0, minutes: 0, seconds: 0 });
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, [session]);

  const saveSubjects = (subs) => {
    setMySubjects(subs);
    try { localStorage.setItem('nw_my_subjects', JSON.stringify(subs)); } catch {}
  };
  const toggleSubject = (s) => saveSubjects(mySubjects.includes(s) ? mySubjects.filter(x => x !== s) : [...mySubjects, s]);

  const sess        = SESSIONS[session];
  const examStarted = now >= sess.start && now <= sess.end;
  const examOver    = now > sess.end;
  const firstName   = userProfile?.name?.split(' ')[0];
  const days        = countdown.days;
  const allSubjects = level === 'olevel' ? OLEVEL_SUBJECTS : ALEVEL_SUBJECTS;
  const mySubjectsSorted = allSubjects.filter(s => mySubjects.includes(s.name)).sort((a, b) => a.first - b.first);

  const btnBase = { border: 'none', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', padding: '8px 18px' };

  return (
    <>
      <Head>
        <title>Exam Countdown ★ — NewWorldEdu</title>
        <meta name="description" content="Live countdown to Cambridge O Level and A Level exams June 2026. Zone 4 Pakistan timetable with personalised subject tracking and revision tips." />
        <meta property="og:title" content="Exam Countdown — Cambridge June 2026" />
        <meta property="og:description" content="Live countdown to Cambridge O Level and A Level exams June 2026. Zone 4 Pakistan timetable with personalised subject tracking and revision tips." />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#080C18', color: '#fff', fontFamily: "-apple-system,BlinkMacSystemFont,'Inter',sans-serif", paddingBottom: 80 }}>

        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,.07)', background: 'rgba(8,12,24,.9)', position: 'sticky', top: 0, zIndex: 50, WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}>
          <Link href="/"><a style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 17, color: '#fff', textDecoration: 'none' }}>NewWorldEdu<span style={{ color: '#4F8EF7' }}>★</span></a></Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/drill"><a style={{ fontSize: 12, fontWeight: 700, color: '#4F8EF7', textDecoration: 'none', padding: '6px 12px', borderRadius: 8, background: 'rgba(79,142,247,.1)', border: '1px solid rgba(79,142,247,.2)' }}>📚 Drill</a></Link>
            <Link href="/"><a style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', textDecoration: 'none', padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)' }}>← Home</a></Link>
          </div>
        </nav>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px' }}>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 800, margin: '0 0 4px' }}>
            {firstName ? `${firstName}'s Exam Countdown` : 'Exam Countdown'} ⏱️
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', margin: '0 0 24px' }}>Cambridge Zone 4 · Pakistan · Verified dates from official timetable</p>

          {/* Toggles */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {Object.entries(SESSIONS).map(([key, s]) => (
              <button key={key} onClick={() => setSession(key)} style={{ ...btnBase, background: session === key ? 'linear-gradient(135deg,#4F8EF7,#6366F1)' : 'rgba(255,255,255,.06)', color: session === key ? '#fff' : 'rgba(255,255,255,.5)' }}>{s.label}</button>
            ))}
            <div style={{ width: 1, background: 'rgba(255,255,255,.1)', margin: '0 2px' }} />
            {[['olevel','O Level'],['alevel','A Level']].map(([key, lbl]) => (
              <button key={key} onClick={() => setLevel(key)} style={{ ...btnBase, background: level === key ? 'rgba(167,139,250,.2)' : 'rgba(255,255,255,.06)', color: level === key ? '#A78BFA' : 'rgba(255,255,255,.5)', border: `1px solid ${level === key ? 'rgba(167,139,250,.4)' : 'transparent'}` }}>{lbl}</button>
            ))}
          </div>

          {session === 'on26' && (
            <div style={{ background: 'rgba(252,211,77,.07)', border: '1px solid rgba(252,211,77,.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.6 }}>
              ⚠️ The official Oct/Nov 2026 Zone 4 timetable has not yet been published by Cambridge. Per-subject dates will be added when released.
              <div style={{ textAlign:'center', padding:'20px', marginTop:16 }}>
                <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, marginBottom:16 }}>October/November 2026 dates will be published by Cambridge around March-April 2026.</p>
                <a href="/subscribe" style={{ display:'inline-block', padding:'12px 24px', borderRadius:12, background:'linear-gradient(135deg,#4F8EF7,#6366F1)', color:'#fff', fontWeight:700, fontSize:14, textDecoration:'none' }}>📬 Get notified when dates are released</a>
                <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12, marginTop:12 }}>In the meantime, keep preparing with Starky!</p>
              </div>
            </div>
          )}

          {examOver && (
            <div style={{ textAlign:'center', padding:'24px', background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:16, marginBottom:20 }}>
              <div style={{ fontSize:48, marginBottom:8 }}>🎉</div>
              <h3 style={{ fontSize:20, fontWeight:800, marginBottom:8 }}>June 2026 exams are complete!</h3>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, marginBottom:16 }}>Results will be published in August. Start preparing for October/November session now.</p>
              <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
                <a href="/drill" style={{ padding:'10px 20px', borderRadius:12, background:'rgba(79,142,247,0.15)', border:'1px solid rgba(79,142,247,0.3)', color:'#4F8EF7', fontWeight:700, fontSize:13, textDecoration:'none' }}>🎯 Keep practicing</a>
                <a href="/subscribe" style={{ padding:'10px 20px', borderRadius:12, background:'rgba(168,224,99,0.15)', border:'1px solid rgba(168,224,99,0.3)', color:'#A8E063', fontWeight:700, fontSize:13, textDecoration:'none' }}>📬 Get Oct/Nov dates</a>
              </div>
            </div>
          )}

          {/* Countdown clock */}
          {!examStarted && !examOver && session === 'mj26' && (
            <div style={{ background: 'linear-gradient(135deg,rgba(79,142,247,.12),rgba(99,102,241,.12))', border: '1px solid rgba(79,142,247,.25)', borderRadius: 20, padding: '32px 24px', marginBottom: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 6 }}>May/June 2026 · Zone 4 · Exams begin</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', margin: '24px 0' }}>
                {[{ v: days, l: 'days' }, { v: countdown.hours, l: 'hrs' }, { v: countdown.minutes, l: 'min' }, { v: countdown.seconds, l: 'sec' }].map(({ v, l }) => (
                  <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64 }}>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontSize: l === 'days' ? 56 : 42, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-2px', fontVariantNumeric: 'tabular-nums' }}>{l === 'days' ? v : pad(v)}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontWeight: 700, marginTop: 6, textTransform: 'uppercase', letterSpacing: '.1em' }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.7 }}>
                {days === 0 ? '🔴 Exams start today!'
                  : days <= 7  ? `🔴 ${days} day${days !== 1 ? 's' : ''} left — past papers and mark scheme keywords only.`
                  : days <= 14 ? `🟡 2 weeks — drill your weakest topics every day.`
                  : days <= 30 ? `🟡 ${days} days — past papers daily, review every wrong answer.`
                  : `🟢 ${days} days — one focused hour a day compounds fast.`}
              </div>
            </div>
          )}

          {examStarted && (
            <div style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.3)', borderRadius: 20, padding: '28px 24px', marginBottom: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: '#F87171', marginBottom: 8 }}>Exams are ON</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, marginBottom: 16 }}>Cambridge {sess.label} is running. Last-minute mark scheme practice matters most now.</div>
              <Link href="/drill"><a style={{ display: 'inline-block', background: 'linear-gradient(135deg,#F87171,#EF4444)', color: '#fff', borderRadius: 12, padding: '12px 24px', fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: "'Sora',sans-serif" }}>Drill Past Papers →</a></Link>
            </div>
          )}

          {/* My Subjects */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 800, margin: 0 }}>My Subjects</h2>
              <button onClick={() => setShowPicker(p => !p)} style={{ fontSize: 12, fontWeight: 700, color: '#4F8EF7', background: 'rgba(79,142,247,.1)', border: '1px solid rgba(79,142,247,.2)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {showPicker ? 'Done' : '+ Edit subjects'}
              </button>
            </div>

            {showPicker && (
              <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', margin: '0 0 12px' }}>Showing {level === 'olevel' ? 'O Level' : 'A Level'} — tap to add/remove:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {allSubjects.map(s => {
                    const on = mySubjects.includes(s.name);
                    return (
                      <button key={s.name + s.code} onClick={() => toggleSubject(s.name)}
                        style={{ padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', background: on ? 'rgba(79,142,247,.18)' : 'rgba(255,255,255,.05)', color: on ? '#4F8EF7' : 'rgba(255,255,255,.45)', border: `1px solid ${on ? 'rgba(79,142,247,.4)' : 'rgba(255,255,255,.08)'}` }}>
                        {on ? '✓ ' : ''}{s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {mySubjectsSorted.length === 0 && !showPicker && (
              <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>📋</div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', margin: 0 }}>Tap <strong style={{ color: 'rgba(255,255,255,.6)' }}>+ Edit subjects</strong> to build your personal countdown.</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mySubjectsSorted.map(s => {
                const d = daysUntil(s.first);
                const urg = urgencyStyle(d);
                const canDrill = DRILL_SUBJECTS.some(ds => s.name.startsWith(ds));
                return (
                  <div key={s.name} style={{ background: urg.bg, border: `1px solid ${urg.border}`, borderRadius: 14, padding: '15px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ minWidth: 52, textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: d <= 0 ? 22 : 28, fontWeight: 900, color: urg.text, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{d <= 0 ? '🎯' : d}</div>
                      {d > 0 && <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 2 }}>days</div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 3 }}>{s.name} <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontWeight: 400 }}>({s.code})</span></div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>First paper: {fmtDate(s.first)}</div>
                    </div>
                    {canDrill && (
                      <Link href={`/drill?subject=${encodeURIComponent(s.name.replace(/ \(A[SL]\)/, ''))}`}>
                        <a style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: '#4F8EF7', background: 'rgba(79,142,247,.12)', border: '1px solid rgba(79,142,247,.25)', borderRadius: 8, padding: '7px 12px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Drill →</a>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full timetable */}
          {session === 'mj26' && (
            <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: '20px', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
                <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 800, margin: 0 }}>All {level === 'olevel' ? 'O Level' : 'A Level'} Subjects · May/June 2026</h2>
                <a href={TIMETABLE_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#4F8EF7', textDecoration: 'none', fontWeight: 600 }}>Official PDF ↗</a>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', margin: '0 0 16px', lineHeight: 1.5 }}>
                <strong style={{ color: 'rgba(255,255,255,.5)' }}>First paper date</strong> for each subject. Source: Cambridge Zone 4 Final Timetable, Version 1, Oct 2025. Check the PDF for all paper codes and times.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[...allSubjects].sort((a, b) => a.first - b.first).map((s, i, arr) => {
                  const d = daysUntil(s.first);
                  const urg = urgencyStyle(d);
                  const isMy = mySubjects.includes(s.name);
                  return (
                    <div key={s.name + s.code} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                      <div style={{ width: 40, textAlign: 'right', fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 800, color: urg.text, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{d <= 0 ? '🎯' : `${d}d`}</div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: isMy ? '#fff' : 'rgba(255,255,255,.7)', fontWeight: isMy ? 700 : 400 }}>
                          {isMy && <span style={{ color: '#4F8EF7', marginRight: 4 }}>★</span>}{s.name}
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginLeft: 6 }}>{s.code}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', flexShrink: 0 }}>{fmtDate(s.first)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Source */}
          <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, fontSize: 12, color: 'rgba(255,255,255,.3)', lineHeight: 1.7 }}>
            📋 Dates from the <a href={TIMETABLE_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#4F8EF7' }}>Cambridge Zone 4 Final Timetable, Version 1, October 2025</a>. First paper date shown — some subjects have multiple sittings. Cambridge may publish revisions; verify your specific paper codes and times before your exam.
          </div>

          {/* Study plan */}
          {!examStarted && !examOver && session === 'mj26' && (
            <div style={{ background: 'rgba(167,139,250,.07)', border: '1px solid rgba(167,139,250,.2)', borderRadius: 16, padding: '20px' }}>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 800, margin: '0 0 14px', color: '#A78BFA' }}>📌 What to focus on with {days} days left</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(days > 42 ? [
                  ['rgba(167,139,250,.4)', "Build foundations — use Starky to explain every concept you're unsure about."],
                  ['rgba(167,139,250,.4)', "Drill one topic per subject per day. Spaced repetition does the rest."],
                  ['rgba(167,139,250,.4)', "Don't cram yet — consistency now is worth more than panic later."],
                ] : days > 14 ? [
                  ['rgba(252,211,77,.4)', "Switch to past papers. Every question should come from Drill Mode."],
                  ['rgba(252,211,77,.4)', "For every wrong answer: read the model answer, then drill that topic the next day."],
                  ['rgba(252,211,77,.4)', "Check your first paper date above — that's your real deadline, not April 23."],
                ] : [
                  ['rgba(248,113,113,.5)', "Past papers only. Minimum 2 per subject. Time yourself properly."],
                  ['rgba(248,113,113,.5)', "Focus on Cambridge mark scheme keywords — one missing word can cost a mark."],
                  ['rgba(248,113,113,.5)', "Sleep. Your brain consolidates memory during sleep — don't pull all-nighters."],
                  ['rgba(248,113,113,.5)', "Ask Starky anything specific — definitions, essay openers, last-minute checks."],
                ]).map(([accent, text], i) => (
                  <div key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.7, paddingLeft: 14, borderLeft: `2px solid ${accent}` }}>{text}</div>
                ))}
              </div>
              <Link href="/drill">
                <a style={{ display: 'inline-block', marginTop: 18, background: 'linear-gradient(135deg,#4F8EF7,#6366F1)', color: '#fff', borderRadius: 10, padding: '11px 22px', fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: "'Sora',sans-serif" }}>Start Drilling Now →</a>
              </Link>
            </div>
          )}

        </div>
      </div>
      <LegalFooter />    </>
  );
}
