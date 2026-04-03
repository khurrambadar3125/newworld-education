/**
 * pages/404.jsx — Custom 404 page
 */
export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Sora',sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: '#4F8EF7', margin: '0 0 8px' }}>404</h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,.6)', marginBottom: 24 }}>Page not found</p>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.35)', marginBottom: 32 }}>The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" style={{ background: '#4F8EF7', color: '#fff', padding: '12px 32px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Go Home</a>
      </div>
    </div>
  );
}
