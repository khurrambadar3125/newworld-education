/**
 * pages/500.jsx — Custom 500 error page
 */
export default function ServerError() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Sora',sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: '#F97316', margin: '0 0 8px' }}>500</h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,.6)', marginBottom: 24 }}>Something went wrong</p>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.35)', marginBottom: 32 }}>We're working on it. Please try again in a moment.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => window.location.reload()} style={{ background: '#4F8EF7', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>Try Again</button>
          <a href="/" style={{ background: 'rgba(255,255,255,.06)', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '1px solid rgba(255,255,255,.1)' }}>Go Home</a>
        </div>
      </div>
    </div>
  );
}
