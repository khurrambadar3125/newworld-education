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
        parentEmail: existing.parentEmail || session.user.email,
      };
      localStorage.setItem('nw_user', JSON.stringify(merged));
    } catch {}
  }, [session?.user?.email]);
  return null;
}

// Pages that render their own nav — don't show the shared Nav on these
const PAGES_WITH_OWN_NAV = ['/', '/past-papers', '/special-needs', '/login', '/start', '/nixor', '/challenge', '/mite', '/mite-portal', '/mite-vision', '/mite-prep', '/mite-study', '/mite-papers', '/mite-books', '/mite-faculty', '/mite-progress', '/mite-register'];

// Catch unhandled errors globally — prevent white screen from async failures
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (e) => {
    console.error('[Unhandled Promise]', e.reason);
    e.preventDefault(); // prevent crash
  });
}

// ── Offline detection banner for 3G connections ─────────────────────────────
function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    if (!navigator.onLine) setOffline(true);
    return () => { window.removeEventListener('offline', goOffline); window.removeEventListener('online', goOnline); };
  }, []);
  if (!offline) return null;
  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:99999, background:'#F87171', color:'#fff', textAlign:'center', padding:'10px 16px', fontSize:14, fontWeight:700, fontFamily:"'Sora',sans-serif" }}>
      You're offline — check your internet connection
    </div>
  );
}

// PWA Install Prompt — captures the browser event and shows a custom banner
function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Don't show if already installed or dismissed recently
    try { if (localStorage.getItem('nw_install_dismissed')) return; } catch {}
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); setShowBanner(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') setShowBanner(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setShowBanner(false);
    try { localStorage.setItem('nw_install_dismissed', Date.now().toString()); } catch {}
  };

  if (!showBanner) return null;
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:99998, padding:'16px',
      background:'linear-gradient(135deg,#0D1635,#080C18)', borderTop:'1px solid rgba(79,142,247,0.2)',
      display:'flex', alignItems:'center', gap:12, fontFamily:"'Sora',sans-serif",
      paddingBottom:'max(16px, env(safe-area-inset-bottom))' }}>
      <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#0074c5,#072a49)',
        display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:22, fontWeight:900,
        fontFamily:'Georgia,serif', flexShrink:0 }}>N</div>
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:800, fontSize:14, color:'#fff' }}>Install NewWorldEdu</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>Add to home screen for quick access</div>
      </div>
      <button onClick={handleInstall} style={{ background:'linear-gradient(135deg,#4F8EF7,#6366F1)', color:'#fff',
        border:'none', borderRadius:10, padding:'10px 20px', fontWeight:800, fontSize:13, cursor:'pointer',
        fontFamily:"'Sora',sans-serif" }}>Install</button>
      <button onClick={dismiss} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)',
        fontSize:18, cursor:'pointer', padding:'4px 8px' }}>×</button>
    </div>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const showNav = !PAGES_WITH_OWN_NAV.includes(router.pathname);

  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
          <meta name="theme-color" content="#080C18" />
          <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
          <meta httpEquiv="Pragma" content="no-cache" />
          <meta httpEquiv="Expires" content="0" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="NewWorldEdu" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="format-detection" content="telephone=no" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/favicon.svg" />
          <meta property="og:site_name" content="NewWorld Education" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://www.newworld.education/og-image.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@newworldedu" />
          <link rel="canonical" href={`https://www.newworld.education${router.asPath.split('?')[0]}`} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "NewWorldEdu",
            "alternateName": "NewWorld Education",
            "url": "https://www.newworld.education",
            "logo": "https://www.newworld.education/favicon.svg",
            "description": "AI-powered tutoring platform for Cambridge O Level and A Level students in Pakistan. 30 years of past papers, mark schemes and examiner reports. Available 24/7 in English and Urdu.",
            "address": { "@type": "PostalAddress", "addressLocality": "Karachi", "addressCountry": "PK" },
            "areaServed": { "@type": "Country", "name": "Pakistan" },
            "availableLanguage": ["English", "Urdu", "Sindhi", "Punjabi", "Pashto"],
            "founder": { "@type": "Person", "name": "Khurram Badar" },
            "sameAs": [],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "10 free sessions — no credit card needed"
            }
          })}} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "Is NewWorldEdu free?", "acceptedAnswer": { "@type": "Answer", "text": "Every student gets 10 free sessions with Starky — no credit card needed. After that, plans start from Rs 3,499/month." }},
              { "@type": "Question", "name": "Which Cambridge subjects does Starky cover?", "acceptedAnswer": { "@type": "Answer", "text": "All Cambridge O Level and A Level subjects including Chemistry (9701/5070), Biology (9700/5090), Physics (9702/5054), Mathematics (9709/4024), English Language, Literature, Economics, History, Business, Computer Science, Pakistan Studies, Islamiat, and Urdu." }},
              { "@type": "Question", "name": "Does it work in Urdu?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Students can ask questions and receive answers in English, Urdu, Punjabi, Sindhi, Pashto, Balochi, and Saraiki. Starky auto-detects the language." }},
              { "@type": "Question", "name": "Is it available 24/7?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Starky is available every day including weekends, holidays, and during exam season. Many students study at night — Starky is there at 11pm on a Sunday." }},
              { "@type": "Question", "name": "What is the difference between NewWorldEdu and ChatGPT?", "acceptedAnswer": { "@type": "Answer", "text": "Starky knows Cambridge specifically — every mark scheme, every examiner report, every command word. It teaches the mark scheme, not just the subject. ChatGPT gives general answers; Starky gives Cambridge-examiner-level precision." }},
            ]
          })}} />
        </Head>
        <style jsx global>{`
          /* ── Cross-device compatibility ────────────────────── */
          html, body { overflow-x: hidden; -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
          html { scroll-behavior: smooth; -webkit-tap-highlight-color: transparent; }

          /* iOS safe areas — notched iPhones (X, 11, 12, 13, 14, 15, 16) */
          body { padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);
                 padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right); }

          /* Prevent iOS zoom on input focus */
          input, textarea, select { font-size: 16px !important; }
          @media screen and (max-width: 768px) {
            input, textarea, select { font-size: 16px !important; }
          }

          /* Touch improvements for all mobile/tablet */
          * { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
          button, a, [role="button"] { -webkit-tap-highlight-color: transparent; touch-action: manipulation; cursor: pointer; -webkit-appearance: none; position: relative; user-select: none; -webkit-user-select: none; min-height: 44px; }
          /* iOS Safari — prevents button flicker on active */
          button:active, [role="button"]:active { opacity: 0.85; }
          /* iOS fix: child elements inside buttons must not capture taps — entire button area must be clickable */
          button > *, button > span, button > div, [role="button"] > * { pointer-events: none; }
          /* Exception: inputs and textareas inside buttons (rare but possible) */
          button input, button textarea, button select { pointer-events: auto; }
          * { -webkit-overflow-scrolling: touch; }

          /* Tablet-specific (iPad, Android tablets, Galaxy Tab) */
          @media screen and (min-width: 769px) and (max-width: 1199px) {
            body { font-size: 17px; }
          }

          /* Large screens (TV, 4K monitors, ultrawide) */
          @media screen and (min-width: 1920px) {
            body { font-size: 18px; }
          }
          @media screen and (min-width: 2560px) {
            body { font-size: 20px; max-width: 1800px; margin: 0 auto; }
          }

          /* Reduced motion for accessibility */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
          }

          /* High contrast mode */
          @media (prefers-contrast: high) {
            :root { --text-primary: #ffffff; --text-secondary: #e0e0e0; }
          }

          /* Print — hide interactive elements */
          @media print {
            nav, button, .starky-bubble, footer { display: none !important; }
            body { background: white !important; color: black !important; }
          }
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
          /* Cream theme — optimised for dyslexia */
          [data-theme="cream"] {
            --bg-primary: #FFF8F0;
            --bg-secondary: #FFFAF5;
            --bg-card: rgba(139,90,43,0.06);
            --bg-card-hover: rgba(139,90,43,0.1);
            --border: rgba(139,90,43,0.15);
            --border-accent: rgba(180,120,50,0.35);
            --text-primary: #2C1810;
            --text-secondary: #4A3728;
            --text-muted: #8B6B4A;
            --text-faint: #B89B78;
            --accent: #D4853A;
            --nav-bg: rgba(255,248,240,0.97);
            --input-bg: rgba(139,90,43,0.06);
            --input-border: rgba(139,90,43,0.2);
          }
          [data-theme="cream"] body { background: #FFF8F0 !important; color: #2C1810 !important; }

          /* Global minimum contrast boost for dark theme — prevents unreadable text */
          :root[data-theme="dark"] {
            --text-muted: rgba(255,255,255,0.6);
            --text-faint: rgba(255,255,255,0.4);
          }
          /* Force minimum text opacity on dark backgrounds — accessibility fix */
          @media (prefers-color-scheme: dark) {
            body[style*="background"] *, div[style*="background:#0"] *, div[style*="background: #0"] * {
              --min-text: rgba(255,255,255,0.55);
            }
          }

          /* Dyslexia-friendly font */
          [data-font="dyslexic"], [data-font="dyslexic"] * {
            font-family: 'Open Dyslexic', 'OpenDyslexic', 'Comic Sans MS', sans-serif !important;
            letter-spacing: 0.05em !important;
            word-spacing: 0.12em !important;
          }
          [data-font="dyslexic"] .starky-msg,
          [data-font="dyslexic"] textarea,
          [data-font="dyslexic"] p,
          [data-font="dyslexic"] div {
            line-height: 1.9 !important;
          }

          /* AAC / Large button mode */
          [data-access="aac"] button,
          [data-access="aac"] [role="button"] {
            min-height: 52px !important;
            min-width: 52px !important;
            font-size: 15px !important;
            padding: 12px 18px !important;
          }
          [data-access="aac"] button:focus,
          [data-access="aac"] textarea:focus,
          [data-access="aac"] [tabindex]:focus {
            outline: 4px solid #FFC300 !important;
            outline-offset: 4px !important;
            box-shadow: 0 0 0 8px rgba(255,195,0,0.25) !important;
          }
          [data-access="aac"] textarea {
            font-size: 18px !important;
            min-height: 72px !important;
          }
          [data-access="aac"] .starky-msg {
            font-size: 18px !important;
            padding: 14px 18px !important;
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
        <OfflineBanner />
        <InstallBanner />
        {showNav && <Nav current={router.pathname} />}
        <ErrorBoundary><Component {...pageProps} /></ErrorBoundary>
        {!['/special-needs','/nixor','/challenge','/garageschool','/founding','/founder','/nixordemo','/partner','/monitor'].includes(router.pathname) && !router.pathname.startsWith('/mite') && <StarkyBubble />}
        {!['/special-needs','/music-for-all','/reading-for-all','/arts-for-all','/nixor','/challenge','/garageschool','/founding','/founder','/nixordemo','/partner','/monitor'].includes(router.pathname) && !router.pathname.startsWith('/mite') && <VoiceChatBar />}
      </ThemeProvider>
    </SessionProvider>
  );
}
