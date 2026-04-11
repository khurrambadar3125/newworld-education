/**
 * pages/garage-login.jsx — Garage School Student Login
 * ─────────────────────────────────────────────────────────────────
 * Simple registration for Garage School students.
 * No payment required — automatic fee exemption.
 * Saves to localStorage + Supabase (for Shabina's dashboard).
 */

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';
import GarageNav from '../components/GarageNav';

const GOLD = '#C9A84C';

export default function GarageLogin() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  if (typeof window !== 'undefined') {
    try {
      const p = JSON.parse(localStorage.getItem('nw_user') || '{}');
      if (p.name && p.school === 'The Garage School' && !loading) {
        // Already registered — show welcome back
      }
    } catch {}
  }

  const handleRegister = async () => {
    if (!name.trim()) return;
    setLoading(true);

    const profile = {
      name: name.trim(),
      fatherName: fatherName.trim(),
      studentNumber: studentNumber.trim(),
      parentPhone: parentPhone.trim(),
      school: 'The Garage School',
      board: 'sindh',
      curriculum: 'sindh',
      grade: className || 'Class 9',
      gradeId: className === 'Class 10' ? 'grade10' : 'grade9',
      section: section || '',
      source: 'garage_school',
      free_access_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      registered_at: new Date().toISOString(),
    };

    localStorage.setItem('nw_user', JSON.stringify(profile));

    // Save to Supabase so Shabina can see on dashboard
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: `${studentNumber.trim() || name.trim().toLowerCase().replace(/\s+/g, '.')}@garageschool.student`,
          grade: className || 'Class 9',
          subject: section || '',
          source: 'garage_school',
          studyTime: parentPhone.trim(),
        }),
      });
    } catch {}

    setLoading(false);
    router.push('/sindh-board');
  };

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 80px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 440, margin: '0 auto' },
    input: { width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', color: '#fff', fontSize: 16, outline: 'none', marginBottom: 10, boxSizing: 'border-box' },
  };

  return (
    <>
      <Head>
        <title>Student Login — The Garage School | NewWorldEdu</title>
        <meta name="description" content="Garage School Login — access your NewWorldEdu learning portal." />
      </Head>
      <div style={S.page}>
        <div style={S.container}>

          <div style={{ textAlign: 'center', paddingTop: 40, marginBottom: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏫</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 8px' }}>
              The Garage School
            </h1>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 14 }}>
              Apna naam likhein aur study shuru karein
            </p>
            <p style={{ color: GOLD, fontSize: 12, fontWeight: 700, marginTop: 8 }}>
              ★ 30 din FREE access — koi fees nahi
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '24px 20px' }}>

            <input type="text" placeholder="Aap ka naam (Your name)" value={name}
              onChange={e => setName(e.target.value)}
              style={S.input} />

            <input type="text" placeholder="Walid ka naam (Father's name)" value={fatherName}
              onChange={e => setFatherName(e.target.value)}
              style={S.input} />

            <input type="text" placeholder="Student Number" value={studentNumber}
              onChange={e => setStudentNumber(e.target.value)}
              style={S.input} />

            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(c => (
                <button key={c} onClick={() => setClassName(c)}
                  style={{
                    flex: 1, padding: '12px 0', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700,
                    background: className === c ? 'rgba(79,142,247,.15)' : 'rgba(255,255,255,.03)',
                    border: className === c ? '2px solid #4F8EF7' : '1px solid rgba(255,255,255,.06)',
                    color: className === c ? '#4F8EF7' : 'rgba(255,255,255,.5)',
                  }}>
                  {c}
                </button>
              ))}
            </div>

            <input type="text" placeholder="Section" value={section}
              onChange={e => setSection(e.target.value)}
              style={S.input} />

            <input type="tel" placeholder="Parent ka phone number (WhatsApp)" value={parentPhone}
              onChange={e => setParentPhone(e.target.value)}
              style={S.input} />

            <button onClick={handleRegister} disabled={!name.trim() || !studentNumber.trim() || loading}
              style={{
                width: '100%', padding: 16, borderRadius: 12, border: 'none',
                background: (name.trim() && studentNumber.trim()) ? GOLD : 'rgba(255,255,255,.06)',
                color: (name.trim() && studentNumber.trim()) ? '#0a0a0a' : 'rgba(255,255,255,.3)',
                fontSize: 16, fontWeight: 900, cursor: name.trim() ? 'pointer' : 'default',
                marginTop: 8,
              }}>
              {loading ? 'Registering...' : 'Study Shuru Karein →'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,.25)' }}>
            No email required. No payment. Just your name.
          </div>

        </div>
      </div>
      <LegalFooter />
      <GarageNav />
    </>
  );
}
