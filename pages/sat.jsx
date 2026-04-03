/**
 * pages/sat.jsx — SAT Prep (Coming Soon placeholder)
 */
import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';

export default function SAT() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Head>
        <title>SAT Prep — NewWorld Education</title>
        <meta name="description" content="SAT preparation with 10,000+ verified practice questions. Coming soon." />
      </Head>
      <div style={{ textAlign: 'center', maxWidth: 500 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎓</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>SAT Prep</h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.5)', marginBottom: 8 }}>10,000+ verified SAT questions from 40+ prep books</p>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.35)', marginBottom: 32 }}>Full SAT prep section launching soon — adaptive practice, score prediction, timed mocks.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/drill" style={{ background: '#4F8EF7', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Practice Drill →</a>
          <a href="/learn" style={{ background: 'rgba(255,255,255,.06)', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '1px solid rgba(255,255,255,.1)' }}>Today's Plan</a>
        </div>
      </div>
      <LegalFooter sat={true} />
    </div>
  );
}
