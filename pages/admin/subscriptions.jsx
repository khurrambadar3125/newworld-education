import { useState, useEffect } from "react";
import Head from "next/head";

const SERVICES = [
  { name: 'Vercel', plan: 'Pro', cost: '20.00', billing: '1st', status: 'active', url: 'https://vercel.com/khurrambadar3125s-projects/newworld-platform/settings/billing', notes: 'Hosting + serverless functions + cron jobs' },
  { name: 'Supabase', plan: 'Free', cost: '0.00', billing: '—', status: 'free', url: 'https://supabase.com/dashboard/project/jyccgpmainfceqlhcpgh/settings/billing', notes: 'PostgreSQL + auth. 500MB DB, 1GB storage, 50K monthly active users' },
  { name: 'Upstash (Redis)', plan: 'Pay as you go', cost: '', billing: '', status: 'active', url: 'https://console.upstash.com', notes: 'Vercel KV. Session memory, student data, streaks' },
  { name: 'Anthropic API', plan: 'Pay as you go', cost: '', billing: 'Monthly', status: 'active', url: 'https://console.anthropic.com/settings/billing', notes: 'Claude Haiku 3. ~$0.25/1M input, $1.25/1M output' },
  { name: 'Resend', plan: 'Free', cost: '0.00', billing: '—', status: 'free', url: 'https://resend.com/settings/billing', notes: 'Email. 100 emails/day free tier. Parent reports + daily questions' },
  { name: 'Google OAuth', plan: 'Free', cost: '0.00', billing: '—', status: 'free', url: 'https://console.cloud.google.com/apis/credentials', notes: 'NextAuth Google sign-in. Free forever' },
  { name: 'Cloudways', plan: '', cost: '', billing: '', status: '', url: 'https://platform.cloudways.com/billing', notes: '' },
  { name: 'HeyGen', plan: 'Future', cost: '—', billing: '—', status: 'paused', url: 'https://www.heygen.com', notes: 'AI video generation. Not yet integrated' },
  { name: 'PayPal', plan: 'Business', cost: '0.00', billing: '—', status: 'active', url: 'https://www.paypal.com/billing', notes: 'Payment processing. Per-transaction fees only' },
  { name: 'Domain (newworld.education)', plan: 'Annual', cost: '', billing: '', status: 'active', url: '', notes: 'Domain registration. Check registrar for renewal date' },
];

export default function SubscriptionsPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [services, setServices] = useState(SERVICES);
  const [editing, setEditing] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => { const fn = () => setIsMobile(window.innerWidth < 768); fn(); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);

  // Load any saved overrides
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nw_admin_subs') || 'null');
      if (saved) setServices(saved);
    } catch {}
  }, []);

  const save = (updated) => {
    setServices(updated);
    try { localStorage.setItem('nw_admin_subs', JSON.stringify(updated)); } catch {}
  };

  const updateField = (idx, field, value) => {
    const updated = [...services];
    updated[idx] = { ...updated[idx], [field]: value };
    save(updated);
  };

  const login = () => {
    if (pw === 'Saira0812@') { setAuthed(true); }
    else { alert('Wrong password'); }
  };

  const totalMonthly = services.reduce((sum, s) => sum + (parseFloat(s.cost) || 0), 0);
  const statusColor = { active: '#4ADE80', free: '#63D2FF', paused: 'rgba(255,255,255,0.3)', '': 'rgba(255,255,255,0.2)' };

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#080C18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Sora',sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: 24, marginBottom: 16 }}>Admin Access</h1>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Password" autoFocus
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 16, fontFamily: "'Sora',sans-serif", width: 250 }} />
          <br />
          <button onClick={login} style={{ marginTop: 12, background: 'linear-gradient(135deg,#4F8EF7,#6366F1)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>Enter</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080C18', fontFamily: "'Sora',sans-serif", color: '#fff' }}>
      <Head><title>Subscriptions — Admin</title></Head>

      <header style={{ padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/admin/championship" style={{ textDecoration: 'none', fontWeight: 900, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>← Admin</a>
        <span style={{ fontWeight: 900, fontSize: 15, color: '#fff' }}>Subscriptions Tracker</span>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '20px 12px' : '32px 24px' }}>

        {/* Summary */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 14, padding: '16px 20px', flex: 1, minWidth: 150 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 4 }}>MONTHLY TOTAL</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#4F8EF7' }}>${totalMonthly.toFixed(2)}</div>
          </div>
          <div style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 14, padding: '16px 20px', flex: 1, minWidth: 150 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 4 }}>ACTIVE SERVICES</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#4ADE80' }}>{services.filter(s => s.status === 'active').length}</div>
          </div>
          <div style={{ background: 'rgba(99,210,255,0.08)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 14, padding: '16px 20px', flex: 1, minWidth: 150 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 4 }}>FREE TIER</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#63D2FF' }}>{services.filter(s => s.status === 'free').length}</div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ textAlign: 'left', padding: '10px 8px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 11 }}>Service</th>
                <th style={{ textAlign: 'left', padding: '10px 8px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 11 }}>Plan</th>
                <th style={{ textAlign: 'right', padding: '10px 8px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 11 }}>$/month</th>
                <th style={{ textAlign: 'center', padding: '10px 8px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 11 }}>Billing</th>
                <th style={{ textAlign: 'center', padding: '10px 8px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 11 }}>Status</th>
                <th style={{ textAlign: 'center', padding: '10px 8px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 11 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                    {s.notes && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.notes}</div>}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    {editing === i ? (
                      <input value={s.plan} onChange={e => updateField(i, 'plan', e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '4px 8px', color: '#fff', fontSize: 12, width: 100, fontFamily: "'Sora',sans-serif" }} />
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>{s.plan || '—'}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    {editing === i ? (
                      <input value={s.cost} onChange={e => updateField(i, 'cost', e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '4px 8px', color: '#fff', fontSize: 12, width: 60, textAlign: 'right', fontFamily: "'Sora',sans-serif" }} />
                    ) : (
                      <span style={{ fontWeight: 700, color: parseFloat(s.cost) > 0 ? '#fff' : 'rgba(255,255,255,0.4)' }}>{s.cost ? `$${s.cost}` : '—'}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    {editing === i ? (
                      <input value={s.billing} onChange={e => updateField(i, 'billing', e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '4px 8px', color: '#fff', fontSize: 12, width: 70, textAlign: 'center', fontFamily: "'Sora',sans-serif" }} />
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{s.billing || '—'}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    {editing === i ? (
                      <select value={s.status} onChange={e => updateField(i, 'status', e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '4px 8px', color: '#fff', fontSize: 12, fontFamily: "'Sora',sans-serif" }}>
                        <option value="active">Active</option>
                        <option value="free">Free</option>
                        <option value="paused">Paused</option>
                      </select>
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 700, color: statusColor[s.status] || '#fff', background: (statusColor[s.status] || '#fff') + '15', padding: '3px 10px', borderRadius: 6 }}>
                        {s.status || '—'}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button onClick={() => setEditing(editing === i ? null : i)}
                        style={{ background: 'none', border: 'none', color: editing === i ? '#4ADE80' : 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer', fontFamily: "'Sora',sans-serif", fontWeight: 700 }}>
                        {editing === i ? '✓ Save' : 'Edit'}
                      </button>
                      {s.url && (
                        <a href={s.url} target="_blank" rel="noopener noreferrer"
                          style={{ color: '#4F8EF7', fontSize: 12, textDecoration: 'none', fontWeight: 700 }}>
                          Billing →
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
          Edits saved to this browser only. Last updated: {new Date().toLocaleDateString()}.
        </div>
      </div>
    </div>
  );
}
