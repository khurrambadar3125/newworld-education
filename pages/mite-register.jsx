/**
 * pages/mite-register.jsx — MiTE Student Registration
 */

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';

export default function MiTERegister() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', studentId: '', program: '', semester: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.program) return;
    setLoading(true);

    const profile = {
      name: form.name.trim(),
      studentId: form.studentId.trim(),
      school: 'MiTE University',
      board: 'university',
      curriculum: 'mite',
      grade: `${form.program} - Semester ${form.semester || '1'}`,
      gradeId: 'university',
      program: form.program,
      semester: form.semester || '1',
      phone: form.phone,
      source: 'mite_portal',
      free_access_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      registered_at: new Date().toISOString(),
    };

    localStorage.setItem('nw_user', JSON.stringify(profile));

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: `${form.studentId.trim() || form.name.trim().toLowerCase().replace(/\s+/g, '.')}@mite.student`,
          grade: `${form.program} Sem ${form.semester || '1'}`,
          source: 'mite_portal',
        }),
      });
    } catch {}

    setLoading(false);
    router.push('/mite-portal');
  };

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 40px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 440, margin: '0 auto' },
    input: { width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', color: '#fff', fontSize: 15, outline: 'none', marginBottom: 10, boxSizing: 'border-box' },
  };

  return (
    <>
      <Head>
        <title>Register — MiTE University Portal</title>
        <meta name="description" content="Register for MiTE Entrance Test Prep — create your account and start practicing. Free on NewWorldEdu." />
      </Head>
      <div style={S.page}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', paddingTop: 40, marginBottom: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 8px' }}>MiTE Student Registration</h1>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>14 days free access — all features, all programs</p>
          </div>

          <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '24px 20px' }}>
            <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={S.input} />
            <input type="text" placeholder="Student ID (if enrolled)" value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} style={S.input} />

            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.3)', marginBottom: 6 }}>Program</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {['BBA', 'BSCS'].map(p => (
                <button key={p} onClick={() => setForm(f => ({ ...f, program: p }))}
                  style={{ flex: 1, padding: '12px 0', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700,
                    background: form.program === p ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.03)',
                    border: form.program === p ? '2px solid #4F8EF7' : '1px solid rgba(255,255,255,.06)',
                    color: form.program === p ? '#4F8EF7' : 'rgba(255,255,255,.5)' }}>
                  {p}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <select value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}
                style={{ ...S.input, flex: 1, marginBottom: 0 }}>
                <option value="">Semester</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>

            <input type="tel" placeholder="Phone / WhatsApp (optional)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={S.input} />

            <button onClick={handleRegister} disabled={!form.name || !form.program || loading}
              style={{ width: '100%', padding: 16, borderRadius: 12, border: 'none',
                background: (form.name && form.program) ? GOLD : 'rgba(255,255,255,.06)',
                color: (form.name && form.program) ? '#0a0a0a' : 'rgba(255,255,255,.3)',
                fontSize: 16, fontWeight: 900, cursor: (form.name && form.program) ? 'pointer' : 'default', marginTop: 8 }}>
              {loading ? 'Registering...' : 'Start Learning →'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'rgba(255,255,255,.2)' }}>
            Already registered? Your progress is saved automatically.
          </div>
        </div>
      </div>
      <LegalFooter />
    </>
  );
}
