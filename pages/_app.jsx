import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect, createContext, useContext } from "react";
import Head from "next/head";
import ErrorBoundary from "../components/ErrorBoundary";
import StarkyBubble from "../components/StarkyBubble";
import VoiceChatBar from "../components/VoiceChatBar";
import Nav from "../components/Nav";

// ── Theme system ─────────────────────────────────────────────────────────────
export const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nw_theme');
      if (saved === 'light') setTheme('light');
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('nw_theme', next); } catch {}
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Bridges NextAuth (Google OAuth) with the localStorage identity system.
 * When a user signs in via Google, their name+email are synced into nw_user
 * so StarkyBubble, session memory, session limits, and all other features
 * recognise them as the same person.
 */
function AuthBridge() {
  const { data: session } = useSession();
  useEffect(() => {
    if (!session?.user?.email) return;
    try {
      const existing = JSON.parse(localStorage.getItem('nw_user') || '{}');
      // Only update if email is new or missing — don't overwrite user's grade/subject choices
      if (existing.email === session.user.email) return;
      const merged = {
        ...existing,
        name: session.user.name || existing.name,
        email: session.user.email,
        image: session.user.image || existing.image,
        authProvider: 'google',
      };
      localStorage.setItem('nw_user', JSON.stringify(merged));
    } catch {}
  }, [session?.user?.email]);
  return null;
}

// Pages that render their own nav — don't show the shared Nav on these
const PAGES_WITH_OWN_NAV = ['/', '/past-papers', '/special-needs', '/login', '/start'];

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const showNav = !PAGES_WITH_OWN_NAV.includes(router.pathname);

  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
          <meta name="theme-color" content="#080C18" />
          <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
        </Head>
        <style jsx global>{`
          :root, [data-theme="dark"] {
            --bg-primary: #080C18;
            --bg-secondary: #0D1221;
            --bg-card: rgba(255,255,255,0.04);
            --bg-card-hover: rgba(255,255,255,0.08);
            --border: rgba(255,255,255,0.08);
            --border-accent: rgba(79,142,247,0.25);
            --text-primary: #ffffff;
            --text-secondary: rgba(255,255,255,0.75);
            --text-muted: rgba(255,255,255,0.45);
            --text-faint: rgba(255,255,255,0.25);
            --accent: #4F8EF7;
            --nav-bg: rgba(8,12,24,0.96);
            --input-bg: rgba(255,255,255,0.06);
            --input-border: rgba(255,255,255,0.12);
          }
          [data-theme="light"] {
            --bg-primary: #F5F7FA;
            --bg-secondary: #FFFFFF;
            --bg-card: rgba(0,0,0,0.03);
            --bg-card-hover: rgba(0,0,0,0.06);
            --border: rgba(0,0,0,0.1);
            --border-accent: rgba(79,142,247,0.35);
            --text-primary: #1A1A2E;
            --text-secondary: #333355;
            --text-muted: #666688;
            --text-faint: #9999AA;
            --accent: #3B7DE8;
            --nav-bg: rgba(255,255,255,0.97);
            --input-bg: rgba(0,0,0,0.04);
            --input-border: rgba(0,0,0,0.15);
          }
          [data-theme="light"] body {
            background: var(--bg-primary) !important;
            color: var(--text-primary) !important;
          }
          [data-theme="light"] .starky-chat {
            background: var(--bg-secondary) !important;
            border-color: var(--border) !important;
          }
          [data-theme="light"] .starky-chat-head {
            background: linear-gradient(135deg, rgba(79,142,247,0.08), rgba(124,92,191,0.08)) !important;
            border-color: var(--border) !important;
          }
          [data-theme="light"] .starky-messages { background: var(--bg-primary) !important; }
          [data-theme="light"] .starky-msg.assistant {
            background: var(--bg-card) !important;
            border-color: var(--border) !important;
            color: var(--text-primary) !important;
          }
          [data-theme="light"] .starky-msg.user {
            background: linear-gradient(135deg, #4F8EF7, #6366F1) !important;
            color: #fff !important;
          }
          [data-theme="light"] .starky-input {
            background: var(--input-bg) !important;
            border-color: var(--input-border) !important;
            color: var(--text-primary) !important;
          }
          [data-theme="light"] .starky-input::placeholder { color: var(--text-muted) !important; }
          [data-theme="light"] .starky-input-row { border-color: var(--border) !important; }
          [data-theme="light"] .starky-icon-btn {
            background: var(--bg-card) !important;
            color: var(--text-muted) !important;
          }
          [data-theme="light"] .starky-action-btn {
            background: var(--bg-card) !important;
            color: var(--text-muted) !important;
          }
          [data-theme="light"] .starky-close-btn { color: var(--text-muted) !important; }
          [data-theme="light"] .starky-chat-name { color: var(--text-primary) !important; }
          [data-theme="light"] .starky-chat-status { color: #22c55e !important; }
          [data-theme="light"] .starky-fab {
            box-shadow: 0 4px 20px rgba(79,142,247,0.3) !important;
          }
          [data-theme="light"] .nw-nav {
            background: var(--nav-bg) !important;
            border-color: var(--border) !important;
          }
          [data-theme="light"] .nw-nav-logo { color: var(--text-primary) !important; }
          [data-theme="light"] .nw-nav-burger {
            background: var(--bg-card) !important;
            color: var(--text-primary) !important;
          }
          [data-theme="light"] .nw-nav-menu {
            background: rgba(255,255,255,0.98) !important;
          }
          [data-theme="light"] .nw-nav-menu a {
            color: var(--text-secondary) !important;
            border-color: var(--border) !important;
          }

          /* ── Light mode: Global overrides for ALL pages ── */
          /* Body and backgrounds */
          [data-theme="light"] .page,
          [data-theme="light"] [style*="background:#0A0F1E"],
          [data-theme="light"] [style*="background:#080C18"],
          [data-theme="light"] [style*="background: #0A0F1E"],
          [data-theme="light"] [style*="background: #080C18"] {
            background: var(--bg-primary) !important;
            color: var(--text-primary) !important;
          }

          /* Pricing page */
          [data-theme="light"] .plan-card {
            background: #fff !important;
            border-color: rgba(0,0,0,0.1) !important;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          }
          [data-theme="light"] .plan-card.highlight {
            background: #FAFBFF !important;
            border-color: rgba(124,92,191,0.35) !important;
          }
          [data-theme="light"] .plan-name { color: var(--text-primary) !important; }
          [data-theme="light"] .plan-for { color: var(--text-muted) !important; }
          [data-theme="light"] .plan-price .amount { color: var(--text-primary) !important; }
          [data-theme="light"] .plan-price .currency { color: var(--text-secondary) !important; }
          [data-theme="light"] .plan-price .period { color: var(--text-muted) !important; }
          [data-theme="light"] .pkr-price { color: var(--text-muted) !important; }
          [data-theme="light"] .pkr-price span { color: var(--text-secondary) !important; }
          [data-theme="light"] .plan-features li { color: var(--text-secondary) !important; border-color: rgba(0,0,0,0.06) !important; }
          [data-theme="light"] .trial-banner {
            background: rgba(43,181,90,0.08) !important;
            border-color: rgba(43,181,90,0.25) !important;
            color: var(--text-secondary) !important;
          }
          [data-theme="light"] .hero p { color: var(--text-muted) !important; }
          [data-theme="light"] .hero h1 { color: var(--text-primary) !important; }
          [data-theme="light"] .hero-badge { background: rgba(79,142,247,0.08) !important; }
          [data-theme="light"] .back-link { color: var(--text-muted) !important; }
          [data-theme="light"] .faq-item strong { color: var(--text-primary) !important; }
          [data-theme="light"] .faq-item p { color: var(--text-muted) !important; }
          [data-theme="light"] .faq-item { border-color: rgba(0,0,0,0.08) !important; }
          [data-theme="light"] .faq h2 { color: var(--text-primary) !important; }
          [data-theme="light"] .divider p { color: var(--text-muted) !important; }
          [data-theme="light"] .popular-badge { color: #fff !important; }

          /* Generic light overrides for inline-styled pages */
          [data-theme="light"] [style*="color:#fff"],
          [data-theme="light"] [style*="color: #fff"] {
            color: var(--text-primary) !important;
          }
          [data-theme="light"] [style*="rgba(255,255,255,0.04)"],
          [data-theme="light"] [style*="rgba(255,255,255,.04)"] {
            background: rgba(0,0,0,0.03) !important;
          }
          [data-theme="light"] [style*="rgba(255,255,255,0.08)"],
          [data-theme="light"] [style*="rgba(255,255,255,.08)"] {
            border-color: rgba(0,0,0,0.1) !important;
          }

          /* Homepage sections */
          [data-theme="light"] .nav {
            background: rgba(255,255,255,0.97) !important;
            border-color: rgba(0,0,0,0.08) !important;
          }
          [data-theme="light"] .nl { color: var(--text-primary) !important; }
          [data-theme="light"] .nh { background: rgba(0,0,0,0.05) !important; color: var(--text-primary) !important; }
          [data-theme="light"] .dr {
            background: rgba(255,255,255,0.98) !important;
          }
          [data-theme="light"] .dr a {
            color: var(--text-secondary) !important;
            border-color: rgba(0,0,0,0.06) !important;
          }
          [data-theme="light"] .hero { background: none !important; }
          [data-theme="light"] .sec { color: var(--text-primary) !important; }
          [data-theme="light"] .sl { color: var(--text-muted) !important; }
          [data-theme="light"] .st { color: var(--text-primary) !important; }
          [data-theme="light"] .hs { color: var(--text-muted) !important; }
          [data-theme="light"] .foot {
            background: rgba(0,0,0,0.02) !important;
            border-color: rgba(0,0,0,0.06) !important;
          }
          [data-theme="light"] .foot a { color: var(--text-muted) !important; }
          [data-theme="light"] .fl { color: var(--text-primary) !important; }
          [data-theme="light"] .ftag { color: var(--text-muted) !important; }

          /* Drill, essay, countdown, other pages with dark inline styles */
          [data-theme="light"] [style*="minHeight:\"100vh\""],
          [data-theme="light"] [style*="min-height:100vh"],
          [data-theme="light"] [style*="minHeight:'100vh'"] {
            background: var(--bg-primary) !important;
            color: var(--text-primary) !important;
          }
        `}</style>
        <AuthBridge />
        {showNav && <Nav current={router.pathname} />}
        <ErrorBoundary><Component {...pageProps} /></ErrorBoundary>
        {router.pathname !== '/' && <StarkyBubble />}
        {router.pathname !== '/' && <VoiceChatBar />}
      </ThemeProvider>
    </SessionProvider>
  );
}
