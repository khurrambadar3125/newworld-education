import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) router.push("/start");
    // Check for OAuth error in query params
    if (router.query.error) {
      setError(router.query.error === 'OAuthAccountNotLinked'
        ? 'This email is already linked to another sign-in method.'
        : 'Sign-in failed. Please try again.');
    }
  }, [session, router.query]);

  return (
    <>
    <Head>
      <title>Sign In — NewWorldEdu</title>
      <meta name="description" content="Sign in to NewWorldEdu with Google to access your learning dashboard, session history, and parent reports." />
      <meta property="og:title" content="Sign In — NewWorldEdu" />
      <meta property="og:description" content="Sign in to NewWorldEdu with Google to access your learning dashboard, session history, and parent reports." />
    </Head>
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #060B20 0%, #0D1635 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Nunito, sans-serif",
    }}>
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:999,background:"rgba(8,12,24,0.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"0 16px",height:"52px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <a href="/" style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"15px",color:"#fff",textDecoration:"none"}}>NewWorldEdu<span style={{color:"#4F8EF7"}}>★</span></a>
        <a href="/" style={{color:"#fff",fontSize:"13px",fontWeight:800,textDecoration:"none",background:"linear-gradient(135deg,#4F8EF7,#7C5CBF)",borderRadius:"20px",padding:"6px 16px"}}>← Home</a>
      </div>
      <div style={{height:"52px"}} />
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: "48px 40px",
        textAlign: "center",
        maxWidth: 400,
        width: "90%",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
        <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 8px" }}>
          NewWorldEdu★
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 36 }}>
          Sign in to access your learning dashboard
        </p>
        {error && (
          <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#F87171', fontSize: 14, fontWeight: 600 }}>
            {error}
          </div>
        )}
        <button
          onClick={() => { setError(''); signIn("google"); }}
          style={{
            width: "100%",
            padding: "14px 24px",
            background: "#fff",
            color: "#1a1a1a",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={20} />
          Continue with Google
        </button>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 24 }}>
          By signing in you agree to our terms of service.
        </p>
      </div>
    </div>
    </>
  );
}
