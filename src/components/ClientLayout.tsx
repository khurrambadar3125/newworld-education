"use client";

import { I18nProvider } from "@/i18n/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <AIChat />
    </I18nProvider>
  );
}
