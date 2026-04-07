/**
 * pages/mite-progress.jsx — MiTE Student Progress Dashboard
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';

const GOLD = '#C9A84C';

export default function MiTEProgress() {
  const router = useRouter();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    try { setProfile(JSON.parse(localStorage.getItem('nw_user') || '{}')); } catch {}
  }, []);

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 40px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 600, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '20px 18px', marginBottom: 10 },
  };

  return (
    <>
      <Head><title>My Progress — MiTE University | NewWorldEdu</title></Head>
      <div style={S.page}>
        <div style={S.container}>
          <a href="/mite-portal" style={{ fontSize: 13, color: '#4F8EF7', textDecoration: 'none', fontWeight: 700 }}>← Back to Portal</a>

          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 8 }}>MY PROGRESS</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 4px' }}>
              {profile.name ? `${profile.name.split(' ')[0]}'s Dashboard` : 'Your Dashboard'}
            </h1>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>
              {profile.program || 'MiTE University'} {profile.semester ? `· Semester ${profile.semester}` : ''}
            </div>
          </div>

          {!profile.name && (
            <div style={{ ...S.card, textAlign: 'center', padding: '32px 16px', background: 'rgba(201,168,76,.04)', borderColor: 'rgba(201,168,76,.15)' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🎓</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: GOLD, marginBottom: 8 }}>Register to track your progress</div>
              <button onClick={() => router.push('/mite-register')}
                style={{ background: GOLD, color: '#0a0a0a', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                Register →
              </button>
            </div>
          )}

          {profile.name && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                <div style={S.card}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#4F8EF7' }}>{profile.program || '—'}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Program</div>
                </div>
                <div style={S.card}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#4ADE80' }}>Sem {profile.semester || '1'}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Current</div>
                </div>
                <div style={S.card}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: GOLD }}>90</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Days Trial</div>
                </div>
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginBottom: 10 }}>CONTINUE STUDYING</div>

              <a href="/mite-prep" style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
                <span style={{ fontSize: 24 }}>🎯</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#4F8EF7' }}>Entrance Test Prep</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Practice for {profile.program} admission</div>
                </div>
              </a>

              <a href="/mite-study" style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
                <span style={{ fontSize: 24 }}>📚</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#4ADE80' }}>Course Study</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Semester {profile.semester || '1'} courses</div>
                </div>
              </a>

              <a href="/mite-papers" style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
                <span style={{ fontSize: 24 }}>📝</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: GOLD }}>Past Papers</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>MiTE entrance & semester papers</div>
                </div>
              </a>
            </>
          )}
        </div>
      </div>
      <LegalFooter />
    </>
  );
}
