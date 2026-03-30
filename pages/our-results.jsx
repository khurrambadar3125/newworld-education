import Head from 'next/head';
import { useState } from 'react';
import { getOutcomeDisplayText, GRADE_POINTS } from '../utils/outcomeTrackingKB';

export default function OurResults() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ email: '', subject: '', gradeBefore: '', gradeAfter: '' });

  // For now, show pre-results messaging — will be populated after August 2026
  const display = getOutcomeDisplayText(null);

  const S = {
    page: { minHeight: '100vh', background: '#080C18', fontFamily: "'Sora',-apple-system,sans-serif", color: '#fff' },
    container: { maxWidth: 700, margin: '0 auto', padding: '40px 20px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px', marginBottom: 20 },
    input: { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 14, fontFamily: "'Sora',sans-serif", outline: 'none', marginBottom: 12, boxSizing: 'border-box' },
    btn: { background: 'linear-gradient(135deg,#4F8EF7,#6366F1)', border: 'none', borderRadius: 12, padding: '14px 28px', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: "'Sora',sans-serif", width: '100%' },
  };

  const handleSubmit = async () => {
    try {
      await fetch('/api/outcomes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {}
  };

  return (
    <div style={S.page}>
      <Head>
        <title>Our Results — NewWorldEdu</title>
        <meta name="description" content="Real student outcomes from NewWorldEdu. See how Starky helps Cambridge students improve their grades." />
      </Head>

      <header style={{ padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ textDecoration: 'none', fontWeight: 900, fontSize: 15, color: '#fff' }}>
          NewWorldEdu<span style={{ color: '#4F8EF7' }}>★</span>
        </a>
        <a href="/demo" style={{ background: 'linear-gradient(135deg,#4F8EF7,#6366F1)', borderRadius: 10, padding: '6px 14px', color: '#fff', fontWeight: 800, fontSize: 12, textDecoration: 'none' }}>
          Try Starky Free
        </a>
      </header>

      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 12px', background: 'linear-gradient(135deg,#4ADE80,#4F8EF7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {display.headline}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0, lineHeight: 1.7 }}>
            {display.subheadline}
          </p>
        </div>

        {/* Stats cards — will populate after results */}
        {display.stats.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
            {display.stats.map((s, i) => (
              <div key={i} style={{ ...S.card, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: s.highlight ? '#4ADE80' : '#4F8EF7', marginBottom: 4 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        <div style={S.card}>
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 16px' }}>Timeline</h2>
          {[
            { date: 'March 2026', event: 'Platform launched — first students onboarded', done: true },
            { date: 'April 2026', event: 'Starky Mocks — free mock exams for all registered students', done: false },
            { date: 'May-June 2026', event: 'Cambridge exam series — students sit real exams', done: false },
            { date: 'August 2026', event: 'Results day — students share grades, outcomes published here', done: false },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.done ? '#4ADE80' : 'rgba(255,255,255,0.2)', marginTop: 5, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: t.done ? '#4ADE80' : 'rgba(255,255,255,0.7)' }}>{t.date}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{t.event}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit results form */}
        <div style={S.card}>
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 8px' }}>Got your results?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 16px' }}>
            Share your Cambridge result and claim your Starky Certificate.
          </p>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#4ADE80' }}>Thank you! Your result has been recorded.</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 8 }}>Your certificate will be emailed to you.</p>
            </div>
          ) : (
            <>
              <input style={S.input} placeholder="Your email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input style={S.input} placeholder="Subject (e.g. Chemistry)" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <select style={{ ...S.input, flex: 1 }} value={form.gradeBefore} onChange={e => setForm({ ...form, gradeBefore: e.target.value })}>
                  <option value="">Grade before Starky</option>
                  {['A*', 'A', 'B', 'C', 'D', 'E', 'U'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <select style={{ ...S.input, flex: 1 }} value={form.gradeAfter} onChange={e => setForm({ ...form, gradeAfter: e.target.value })}>
                  <option value="">Grade after (result)</option>
                  {['A*', 'A', 'B', 'C', 'D', 'E', 'U'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <button onClick={handleSubmit} style={S.btn}>Submit result</button>
            </>
          )}
        </div>

        {/* Partner schools */}
        <div style={{ ...S.card, background: 'rgba(167,139,250,0.04)', border: '1px solid rgba(167,139,250,0.15)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 8px' }}>Partner Schools</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 14px' }}>
            These schools receive monthly automated reports on student engagement and outcomes.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['UJALA', 'Garage School', 'Deaf Reach'].map(s => (
              <span key={s} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', fontSize: 13, fontWeight: 700, color: '#A78BFA' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ padding: '20px 16px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>© 2026 NewWorldEdu · newworld.education</div>
      </footer>
    </div>
  );
}
