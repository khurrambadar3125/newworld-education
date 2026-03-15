import { useState, useEffect } from 'react';
import Head from 'next/head';

function useIsPakistan() {
  const [isPK, setIsPK] = useState(false);
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const lang = (navigator.language || '').toLowerCase();
      const southAsianTZ = ['asia/karachi', 'asia/dubai', 'asia/kolkata', 'asia/dhaka', 'asia/colombo'];
      if (southAsianTZ.some(t => tz.toLowerCase().includes(t)) || lang.startsWith('ur') || lang.startsWith('hi')) setIsPK(true);
    } catch {}
  }, []);
  return isPK;
}

const FEATURES = [
  { emoji: '🤖', title: 'AI Tutor for Every Student', desc: 'Starky adapts to each student\'s grade, subject, and learning style — KG through A Levels.' },
  { emoji: '📊', title: 'Teacher Dashboard', desc: 'Track every student\'s weak topics, common mistakes, and session activity in real time.' },
  { emoji: '💜', title: 'Special Needs Support', desc: '140 adaptive teaching profiles for autism, ADHD, dyslexia, Down syndrome, and more.' },
  { emoji: '📧', title: 'Parent Reports', desc: 'Automatic session reports emailed to parents after every learning session.' },
  { emoji: '📚', title: 'Cambridge Exam Prep', desc: '30 years of past paper knowledge. Generates practice questions, marks answers, teaches exam technique.' },
  { emoji: '🎯', title: 'Practice Drills', desc: 'Timed drills with spaced repetition, hints, camera upload, and Cambridge-style grading.' },
];

const PLANS = [
  { name: 'Starter School', students: 'Up to 50 students', priceUSD: '$199/mo', pricePKR: 'Rs 55,300/mo', color: '#4F8EF7', features: ['All subjects KG–Grade 8', 'Teacher dashboard', 'Parent reports', '25 sessions/student/day'] },
  { name: 'Cambridge School', students: 'Up to 200 students', priceUSD: '$499/mo', pricePKR: 'Rs 1,38,700/mo', color: '#7C5CBF', popular: true, features: ['All subjects KG–A Level', 'Teacher dashboard', 'Parent reports', 'Past paper drills', 'Essay marking', 'Unlimited sessions'] },
  { name: 'Enterprise', students: 'Unlimited students', priceUSD: 'Custom', pricePKR: 'Custom', color: '#A8E063', features: ['Everything in Cambridge', 'SEN support', 'Custom branding', 'Dedicated support', 'API access', 'SLA guarantee'] },
];

export default function SchoolPage() {
  const isPK = useIsPakistan();
  const [form, setForm] = useState({ name: '', school: '', city: '', email: '', phone: '', students: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.school || !form.email) { setError('Please fill in your name, school, and email.'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/school-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setSubmitted(true); } else { setError('Something went wrong. Please try again.'); }
    } catch { setError('Connection error. Please try again.'); }
    setSubmitting(false);
  };

  const S = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg, #060B20 0%, #0D1635 60%, #060B20 100%)', color: '#fff', fontFamily: "'Nunito', -apple-system, sans-serif" },
    container: { maxWidth: 900, margin: '0 auto', padding: '40px 20px' },
    input: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '13px 16px', color: '#fff', fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box' },
    btn: { background: 'linear-gradient(135deg, #4F8EF7, #6366F1)', border: 'none', borderRadius: 14, padding: '16px 32px', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', fontFamily: 'inherit' },
  };

  return (
    <div style={S.page}>
      <Head>
        <title>Schools & Institutions — NewWorldEdu</title>
        <meta name="description" content="Partner with NewWorldEdu to bring Starky AI tutoring to your school. KG to A Levels, all subjects, teacher dashboard, parent reports." />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div style={S.container}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏫</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>
            Bring Starky to Your <span style={{ color: '#4F8EF7' }}>School</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
            Every student gets a personal AI tutor. Every teacher gets a real-time dashboard. Every parent gets session reports. From KG to A Levels, in 16 languages.
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 48 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{f.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 10 }}>SCHOOL PLANS</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 6px' }}>Simple pricing, no per-student fees</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>All plans include a 14-day free trial for your school</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 56 }}>
          {PLANS.map(p => (
            <div key={p.name} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${p.popular ? p.color + '55' : 'rgba(255,255,255,0.08)'}`, borderRadius: 20, padding: 28, position: 'relative' }}>
              {p.popular && <div style={{ position: 'absolute', top: -10, right: 16, background: p.color, color: '#060B20', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 100 }}>Most Popular</div>}
              <div style={{ fontWeight: 900, fontSize: 18, color: p.color, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>{p.students}</div>
              <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 16 }}>{isPK ? p.pricePKR : p.priceUSD}</div>
              {p.features.map(f => (
                <div key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', padding: '4px 0', display: 'flex', gap: 8 }}>
                  <span style={{ color: p.color }}>✓</span> {f}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Inquiry Form */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 36, maxWidth: 560, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 6px' }}>Get Started</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Tell us about your school and we'll set you up within 48 hours</p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Thank you!</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                We've received your inquiry and will be in touch within 48 hours. Check your email at <strong style={{ color: '#4F8EF7' }}>{form.email}</strong>.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input style={S.input} placeholder="Your name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input style={S.input} placeholder="School name *" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input style={S.input} placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                <input style={S.input} placeholder="Number of students" value={form.students} onChange={e => setForm({ ...form, students: e.target.value })} />
              </div>
              <input style={S.input} type="email" placeholder="Email address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              <input style={S.input} type="tel" placeholder="Phone number (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <textarea style={{ ...S.input, minHeight: 80, resize: 'vertical' }} placeholder="Anything else you'd like us to know?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              {error && <div style={{ color: '#F87171', fontSize: 13, fontWeight: 600 }}>{error}</div>}
              <button type="submit" style={{ ...S.btn, opacity: submitting ? 0.5 : 1 }} disabled={submitting}>
                {submitting ? 'Sending...' : 'Request a Demo →'}
              </button>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>We'll reply within 48 hours. No spam, no sales calls.</div>
            </form>
          )}
        </div>

        {/* Pakistan schools */}
        <div style={{ textAlign: 'center', marginTop: 48, padding: 24 }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
            Trusted by schools preparing students for Cambridge O/A Levels, BISE Matric/FSc, and MDCAT/ECAT.
            <br />Special rates available for government schools and NGO-run institutions in Pakistan.
          </div>
        </div>
      </div>
    </div>
  );
}
