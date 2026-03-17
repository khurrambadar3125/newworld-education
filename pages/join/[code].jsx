import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function JoinPage() {
  const router = useRouter();

  useEffect(() => {
    const code = router.query.code;
    if (!code) return;
    // Save referral code to localStorage
    try { localStorage.setItem('nw_referral_code', code); } catch {}
    // Redirect to homepage
    router.replace('/');
  }, [router.query.code]);

  return (
    <div style={{ minHeight: '100vh', background: '#080C18', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>★</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Welcome to NewWorld Education!</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Redirecting you to sign up...</div>
      </div>
    </div>
  );
}
