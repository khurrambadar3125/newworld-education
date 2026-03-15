import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import ErrorBoundary from "../components/ErrorBoundary";
import StarkyBubble from "../components/StarkyBubble";
import VoiceChatBar from "../components/VoiceChatBar";
import Nav from "../components/Nav";

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
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#080C18" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <AuthBridge />
      {showNav && <Nav current={router.pathname} />}
      <ErrorBoundary><Component {...pageProps} /></ErrorBoundary>
      <StarkyBubble />
      <VoiceChatBar />
    </SessionProvider>
  );
}
