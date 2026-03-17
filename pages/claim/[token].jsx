import { useState, useEffect } from 'react';
import Head from 'next/head';

const PK_CITIES = ['Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta','Sialkot','Gujranwala','Hyderabad','Bahawalpur','Sargodha','Abbottabad','Mardan','Sukkur','Larkana','Mirpur','Muzaffarabad','Gilgit','Skardu','Chitral','Swat','Other'];

export default function ClaimPage() {
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ fullName: '', address: '', city: '', landmark: '', phone: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = window.location.pathname.split('/').pop();
    fetch(`/api/championship/claim-prize?token=${token}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setClaim(d); })
      .catch(() => setError('Could not load claim details'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.fullName || !form.address || !form.city || !form.phone) { setFormError('All fields except landmark are required'); return; }
    setSubmitting(true);
    const token = window.location.pathname.split('/').pop();
    try {
      const res = await fetch('/api/championship/claim-prize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...form }),
      });
      const data = await res.json();
      if (data.error) { setFormError(data.error); } else { setSubmitted(true); }
    } catch { setFormError('Connection error. Please try again.'); }
    setSubmitting(false);
  };

  const S = { input: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '13px 16px', color: '#fff', fontSize: 15, boxSizing: 'border-box', marginBottom: 10, fontFamily: 'inherit' } };

  return (
    <div style={{ minHeight: '100vh', background: '#080C18', color: '#fff', fontFamily: "'Nunito',-apple-system,sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Head><title>Claim Your Prize — NewWorldEdu</title></Head>
      <div style={{ maxWidth: 480, width: '100%' }}>
        {loading && <div style={{ textAlign: 'center' }}>Loading...</div>}
        {error && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⏰</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Link Expired</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>{error}</p>
          </div>
        )}
        {submitted && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Address Received!</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>Your <strong style={{ color: '#FFC300' }}>{claim?.prize}</strong> will be shipped within 7-14 business days. You will receive a confirmation email when it ships.</p>
          </div>
        )}
        {claim && !submitted && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
              <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 4px' }}>Claim Your Prize!</h1>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#FFC300' }}>{claim.prize}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Season {claim.season}</div>
            </div>
            <form onSubmit={handleSubmit}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>Full Name (as on CNIC/B-Form) *</label>
              <input style={S.input} value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Muhammad Ali Khan" required />
              <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>Complete Address (with house/street number) *</label>
              <textarea style={{ ...S.input, minHeight: 80, resize: 'vertical' }} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="House 14, Street 5, Block B, Gulberg III..." required />
              <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>City *</label>
              <select style={{ ...S.input, appearance: 'none' }} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required>
                <option value="">Select city</option>
                {PK_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>Nearest Landmark</label>
              <input style={S.input} value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })} placeholder="Near Jinnah Hospital / Next to Habib Bank" />
              <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>Phone for Courier *</label>
              <input style={S.input} type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="03xx-xxxxxxx" required />
              {formError && <div style={{ color: '#F87171', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{formError}</div>}
              <button type="submit" disabled={submitting} style={{ width: '100%', background: 'linear-gradient(135deg,#FFC300,#FF8E53)', color: '#060B20', border: 'none', borderRadius: 14, padding: '16px', fontWeight: 900, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8 }}>
                {submitting ? 'Submitting...' : 'Submit Address & Claim Prize →'}
              </button>
            </form>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 12 }}>This link expires in 7 days. Pakistan delivery only.</div>
          </div>
        )}
      </div>
    </div>
  );
}
