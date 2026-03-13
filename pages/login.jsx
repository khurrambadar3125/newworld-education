import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/start");
  }, [session]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #060B20 0%, #0D1635 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Nunito, sans-serif",
    }}>
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
        <button
          onClick={() => signIn("google")}
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
          By signing in you agree to our{" "}
          <a href="/disclaimer" style={{ color: "rgba(255,255,255,0.4)" }}>terms & disclaimer</a>
        </p>
      </div>
    </div>
  );
}
