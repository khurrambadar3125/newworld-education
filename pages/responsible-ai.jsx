import Head from 'next/head';
import { RESPONSIBLE_AI_POLICY } from '../utils/responsibleAIPolicy';

export default function ResponsibleAI() {
  const policy = RESPONSIBLE_AI_POLICY;

  const S = {
    page: { minHeight: '100vh', background: '#080C18', fontFamily: "'Sora',-apple-system,sans-serif", color: '#fff' },
    container: { maxWidth: 760, margin: '0 auto', padding: '40px 20px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px', marginBottom: 20 },
  };

  return (
    <div style={S.page}>
      <Head>
        <title>Responsible AI Policy — NewWorldEdu</title>
        <meta name="description" content="NewWorldEdu's Responsible AI Policy: our commitment to validity, fairness, safety, privacy, transparency, and human oversight in AI-powered education." />
      </Head>

      {/* Header */}
      <header style={{ padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ textDecoration: 'none', fontWeight: 900, fontSize: 15, color: '#fff' }}>
          NewWorldEdu<span style={{ color: '#4F8EF7' }}>★</span>
        </a>
        <a href="/demo" style={{ background: 'linear-gradient(135deg,#4F8EF7,#6366F1)', borderRadius: 10, padding: '6px 14px', color: '#fff', fontWeight: 800, fontSize: 12, textDecoration: 'none' }}>
          Try Starky Free
        </a>
      </header>

      <div style={S.container}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 12px', background: 'linear-gradient(135deg,#4F8EF7,#4ADE80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Responsible AI Policy
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0, lineHeight: 1.7, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            NewWorldEdu is built on the principle that AI in education must be safe, fair, accurate, and transparent. These are our commitments.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 12 }}>
            Version {policy.version} · Last updated: {policy.lastUpdated}
          </p>
        </div>

        {/* Principles */}
        {policy.principles.map((p) => (
          <div key={p.id} style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>{p.icon}</span>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>
                  Principle {p.id}: {p.title}
                </h2>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '4px 0 0', lineHeight: 1.6 }}>
                  {p.summary}
                </p>
              </div>
            </div>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {p.detail.map((d, i) => (
                <li key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 4 }}>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Compliance */}
        <div style={S.card}>
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 14px' }}>
            {policy.compliance.title}
          </h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 14px' }}>
            Status: {policy.compliance.status}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {policy.compliance.targets.map((t, i) => (
              <div key={i} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>{t.region} — {t.body}</span>
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 6, fontWeight: 700,
                    background: t.status === 'Active' ? 'rgba(74,222,128,0.15)' : 'rgba(255,195,0,0.15)',
                    color: t.status === 'Active' ? '#4ADE80' : '#FFC300',
                    border: `1px solid ${t.status === 'Active' ? 'rgba(74,222,128,0.3)' : 'rgba(255,195,0,0.3)'}`,
                  }}>
                    {t.status}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{t.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ textAlign: 'center', padding: '30px 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 20 }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px' }}>
            Questions about our AI practices? Contact us at:
          </p>
          <a href={`mailto:${policy.contact.email}`} style={{ color: '#4F8EF7', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
            {policy.contact.email}
          </a>
        </div>
      </div>

      <footer style={{ padding: '20px 16px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>© 2026 NewWorldEdu · newworld.education</div>
      </footer>
    </div>
  );
}
