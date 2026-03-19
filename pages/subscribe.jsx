import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';

const GRADES = [
  'KG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9', 'O Level', 'AS Level', 'A Level',
];

const SUBJECTS_BY_GRADE = {
  'O Level': ['Mathematics', 'Additional Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language', 'Pakistan Studies', 'Islamiyat', 'Computer Science', 'Economics', 'History', 'Geography', 'Business Studies', 'Accounting', 'Sociology', 'Art & Design'],
  'AS Level': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language', 'Psychology', 'Economics', 'Business Studies', 'Computer Science', 'History', 'Geography', 'Law', 'Accounting'],
  'A Level': ['Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language', 'Psychology', 'Economics', 'Business Studies', 'Computer Science', 'History', 'Geography', 'Law', 'Accounting', 'Sociology'],
  'default': ['Maths', 'English', 'Science', 'Urdu', 'Islamiat', 'General Knowledge', 'Social Studies', 'Computer'],
};

const TIMES = [
  { id: '06:00', label: '6:00 AM', sub: 'Early bird' },
  { id: '07:00', label: '7:00 AM', sub: 'Before school' },
  { id: '14:00', label: '2:00 PM', sub: 'After school' },
  { id: '18:00', label: '6:00 PM', sub: 'Evening' },
  { id: '20:00', label: '8:00 PM', sub: 'Night study' },
];

export default function Subscribe() {
  const [step, setStep]         = useState(1);
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [grade, setGrade]       = useState('');
  const [subject, setSubject]   = useState('');
  const [studyTime, setStudyTime] = useState('');
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState('');

  const subjects = SUBJECTS_BY_GRADE[grade] || SUBJECTS_BY_GRADE['default'];

  const handleSubmit = async () => {
    if (!name || !email || !grade || !subject || !studyTime) {
      setError('Please complete all steps before subscribing.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, grade, subject, studyTime }),
      });
      const data = await res.json();
      if (res.ok) { setDone(true); }
      else { setError(data.error || 'Something went wrong. Please try again.'); }
    } catch {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Subscribe — NewWorldEdu ★</title>
        <meta name="description" content="Get a daily Cambridge question in your inbox. Free." />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080C18;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      `}</style>

      {/* NAV */}
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(8,12,24,0.97)', WebkitBackdropFilter:'blur(12px)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'0 16px', height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/" style={{ fontFamily:"'Sora',sans-serif", fontSize:'17px', fontWeight:800, color:'#fff', textDecoration:'none' }}>
          NewWorldEdu<span style={{ color:'#4F8EF7' }}>★</span>
        </a>
        <a href="/" style={{ color:'#fff', fontSize:'13px', fontWeight:700, textDecoration:'none', background:'linear-gradient(135deg,#4F8EF7,#7C5CBF)', borderRadius:'20px', padding:'7px 16px' }}>← Home</a>
      </nav>

      <div style={{ maxWidth:'520px', margin:'0 auto', padding:'40px 20px 80px' }}>

        {/* DONE STATE */}
        {done ? (
          <div style={{ textAlign:'center', animation:'slideUp 0.4s ease-out' }}>
            <div style={{ fontSize:'64px', marginBottom:'20px', animation:'float 3s ease-in-out infinite' }}>🎉</div>
            <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(24px,6vw,36px)', fontWeight:800, marginBottom:'12px' }}>
              You're in, {name.split(' ')[0]}!
            </h1>
            <p style={{ fontSize:'16px', color:'rgba(255,255,255,0.6)', lineHeight:1.7, marginBottom:'8px' }}>
              Your first <strong style={{ color:'#4F8EF7' }}>{subject}</strong> question lands in your inbox tomorrow at <strong style={{ color:'#4F8EF7' }}>{TIMES.find(t => t.id === studyTime)?.label}</strong>.
            </p>
            <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.4)', marginBottom:'32px' }}>
              Check your spam folder if you don't see it — then mark us as safe.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px', alignItems:'center' }}>
              <a href="/" style={{ display:'block', width:'100%', maxWidth:'320px', background:'linear-gradient(135deg,#4F8EF7,#6366F1)', color:'#fff', borderRadius:'14px', padding:'15px 24px', fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'16px', textDecoration:'none', textAlign:'center' }}>
                Start Learning with Starky →
              </a>
              <a href="/drill" style={{ display:'block', width:'100%', maxWidth:'320px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.75)', borderRadius:'14px', padding:'14px 24px', fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:'15px', textDecoration:'none', textAlign:'center' }}>
                Try a Drill Session →
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div style={{ textAlign:'center', marginBottom:'36px' }}>
              <div style={{ fontSize:'48px', marginBottom:'14px', animation:'float 3.5s ease-in-out infinite' }}>📬</div>
              <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(24px,6vw,38px)', fontWeight:800, lineHeight:1.15, marginBottom:'12px' }}>
                One question.<br /><span style={{ background:'linear-gradient(135deg,#4F8EF7,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Every day.</span>
              </h1>
              <p style={{ fontSize:'16px', color:'rgba(255,255,255,0.55)', lineHeight:1.7, maxWidth:'380px', margin:'0 auto' }}>
                Get a free daily Cambridge-style question in your subject — straight to your inbox. Build the habit. Ace the exam.
              </p>
            </div>

            {/* PROGRESS */}
            <div style={{ display:'flex', gap:'6px', marginBottom:'28px' }}>
              {[1,2,3,4].map(s => (
                <div key={s} style={{ flex:1, height:'4px', borderRadius:'2px', background: step >= s ? 'linear-gradient(135deg,#4F8EF7,#A78BFA)' : 'rgba(255,255,255,0.1)', transition:'all 0.3s' }} />
              ))}
            </div>

            {/* STEP 1 — NAME + EMAIL */}
            {step === 1 && (
              <div style={{ animation:'slideUp 0.3s ease-out' }}>
                <div style={{ fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em', marginBottom:'18px' }}>STEP 1 OF 4 — YOUR DETAILS</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'24px' }}>
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:600, color:'rgba(255,255,255,0.4)', letterSpacing:'0.06em', display:'block', marginBottom:'6px' }}>YOUR NAME</label>
                    <input
                      value={name} onChange={e => setName(e.target.value)}
                      placeholder="e.g. Ahmed or Mrs. Fatima"
                      style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', color:'#fff', padding:'13px 15px', fontSize:'16px', outline:'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:600, color:'rgba(255,255,255,0.4)', letterSpacing:'0.06em', display:'block', marginBottom:'6px' }}>EMAIL ADDRESS</label>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', color:'#fff', padding:'13px 15px', fontSize:'16px', outline:'none' }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => { if (!name.trim() || !email.includes('@')) { setError('Please enter your name and a valid email.'); return; } setError(''); setStep(2); }}
                  style={{ width:'100%', background:'linear-gradient(135deg,#4F8EF7,#6366F1)', border:'none', color:'#fff', borderRadius:'14px', padding:'15px', fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'16px', cursor:'pointer' }}>
                  Continue →
                </button>
              </div>
            )}

            {/* STEP 2 — GRADE */}
            {step === 2 && (
              <div style={{ animation:'slideUp 0.3s ease-out' }}>
                <div style={{ fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em', marginBottom:'18px' }}>STEP 2 OF 4 — YOUR GRADE</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px', marginBottom:'24px' }}>
                  {GRADES.map(g => (
                    <button key={g} onClick={() => { setGrade(g); setSubject(''); }} style={{
                      background: grade===g ? 'rgba(79,142,247,0.15)' : 'rgba(255,255,255,0.04)',
                      border:`2px solid ${grade===g ? '#4F8EF7' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius:'12px', padding:'12px', cursor:'pointer',
                      color: grade===g ? '#4F8EF7' : 'rgba(255,255,255,0.7)',
                      fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'14px', transition:'all 0.15s',
                    }}>{g}</button>
                  ))}
                </div>
                <div style={{ display:'flex', gap:'10px' }}>
                  <button onClick={() => setStep(1)} style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', borderRadius:'14px', padding:'14px', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:'15px' }}>← Back</button>
                  <button onClick={() => { if (!grade) { setError('Please select your grade.'); return; } setError(''); setStep(3); }} style={{ flex:2, background:'linear-gradient(135deg,#4F8EF7,#6366F1)', border:'none', color:'#fff', borderRadius:'14px', padding:'14px', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'16px' }}>Continue →</button>
                </div>
              </div>
            )}

            {/* STEP 3 — SUBJECT */}
            {step === 3 && (
              <div style={{ animation:'slideUp 0.3s ease-out' }}>
                <div style={{ fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em', marginBottom:'18px' }}>STEP 3 OF 4 — YOUR SUBJECT</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'24px' }}>
                  {subjects.map(s => (
                    <button key={s} onClick={() => setSubject(s)} style={{
                      background: subject===s ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)',
                      border:`2px solid ${subject===s ? '#A78BFA' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius:'100px', padding:'9px 18px', cursor:'pointer',
                      color: subject===s ? '#A78BFA' : 'rgba(255,255,255,0.65)',
                      fontWeight:600, fontSize:'13px', transition:'all 0.15s',
                    }}>{s}</button>
                  ))}
                </div>
                <div style={{ display:'flex', gap:'10px' }}>
                  <button onClick={() => setStep(2)} style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', borderRadius:'14px', padding:'14px', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:'15px' }}>← Back</button>
                  <button onClick={() => { if (!subject) { setError('Please select a subject.'); return; } setError(''); setStep(4); }} style={{ flex:2, background:'linear-gradient(135deg,#4F8EF7,#6366F1)', border:'none', color:'#fff', borderRadius:'14px', padding:'14px', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'16px' }}>Continue →</button>
                </div>
              </div>
            )}

            {/* STEP 4 — STUDY TIME */}
            {step === 4 && (
              <div style={{ animation:'slideUp 0.3s ease-out' }}>
                <div style={{ fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em', marginBottom:'8px' }}>STEP 4 OF 4 — YOUR STUDY TIME</div>
                <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.45)', marginBottom:'18px', lineHeight:1.6 }}>
                  When do you want your daily question? Pick a time you'll actually check your email.
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'24px' }}>
                  {TIMES.map(t => (
                    <button key={t.id} onClick={() => setStudyTime(t.id)} style={{
                      background: studyTime===t.id ? 'rgba(79,142,247,0.15)' : 'rgba(255,255,255,0.04)',
                      border:`2px solid ${studyTime===t.id ? '#4F8EF7' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius:'14px', padding:'14px 18px', cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      fontFamily:"'Sora',sans-serif", transition:'all 0.15s',
                    }}>
                      <div style={{ textAlign:'left' }}>
                        <div style={{ fontWeight:700, fontSize:'15px', color: studyTime===t.id ? '#4F8EF7' : '#fff' }}>{t.label}</div>
                        <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', marginTop:'2px' }}>{t.sub}</div>
                      </div>
                      {studyTime===t.id && <span style={{ color:'#4F8EF7', fontSize:'20px' }}>✓</span>}
                    </button>
                  ))}
                </div>

                {error && <div style={{ fontSize:'13px', color:'#ff6b6b', marginBottom:'12px' }}>{error}</div>}

                <div style={{ display:'flex', gap:'10px' }}>
                  <button onClick={() => setStep(3)} style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', borderRadius:'14px', padding:'14px', cursor:'pointer', fontFamily:"'Sora',sans-serif", fontWeight:600, fontSize:'15px' }}>← Back</button>
                  <button onClick={handleSubmit} disabled={loading} style={{ flex:2, background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#4F8EF7,#6366F1)', border:'none', color: loading ? 'rgba(255,255,255,0.3)' : '#fff', borderRadius:'14px', padding:'14px', cursor: loading ? 'default' : 'pointer', fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'16px' }}>
                    {loading ? 'Subscribing...' : 'Subscribe Free →'}
                  </button>
                </div>

                <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.2)', textAlign:'center', marginTop:'12px', lineHeight:1.6 }}>
                  No spam. One email per day. Unsubscribe anytime.
                </p>
              </div>
            )}

            {error && step !== 4 && <div style={{ fontSize:'13px', color:'#ff6b6b', marginTop:'12px' }}>{error}</div>}
          </>
        )}
      </div>
    </>
  );
}
