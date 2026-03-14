import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import ErrorBoundary from "../components/ErrorBoundary";
import StarkyBubble from "../components/StarkyBubble";
import VoiceChatBar from "../components/VoiceChatBar";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        {/* viewport-fit=cover: required for env(safe-area-inset-*) to work on iPhone notch/home bar */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#080C18" />
      </Head>
      <ErrorBoundary><Component {...pageProps} /></ErrorBoundary>
      <StarkyBubble />
      <VoiceChatBar />
    </SessionProvider>
  );
}
