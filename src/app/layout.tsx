import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: {
    default: "New World Education | AI Powered Learning from KG to A Levels",
    template: "%s | New World Education",
  },
  description:
    "Discover a new world of learning. Expertly crafted articles, interactive lessons, and AI-powered guidance for students from Kindergarten through Advanced Levels.",
  keywords: [
    "education",
    "learning",
    "AI tutor",
    "global education",
    "O/L",
    "A/L",
    "mathematics",
    "science",
    "English",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
