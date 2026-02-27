"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/context";
import { Locale, localeNames } from "@/i18n/translations";
import { Search, Menu, X, Globe, GraduationCap } from "lucide-react";

export default function Header() {
  const { t, locale, setLocale } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/articles", label: t("nav.articles") },
    { href: "/categories/climate-weather", label: "Climate" },
    { href: "/categories/oceans-marine", label: "Oceans" },
    { href: "/categories/wildlife-conservation", label: "Wildlife" },
    { href: "/categories/sustainability", label: "Sustainability" },
  ];

  return (
    <header className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-brand-950 leading-tight tracking-tight">
                New World
              </div>
              <div className="text-[10px] font-medium text-brand-600 uppercase tracking-[0.2em] leading-tight">
                Education
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-brand-700 rounded-lg hover:bg-brand-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Link
              href="/search"
              className="p-2.5 text-surface-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
              aria-label={t("nav.search")}
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 text-sm text-surface-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-medium uppercase">
                  {locale}
                </span>
              </button>
              {langOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setLangOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-surface-100 py-1 z-20 min-w-[160px]">
                    {(Object.keys(localeNames) as Locale[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLocale(l);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          locale === l
                            ? "bg-brand-50 text-brand-700 font-medium"
                            : "text-surface-600 hover:bg-surface-50"
                        }`}
                      >
                        {localeNames[l]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-surface-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-surface-100 bg-white">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-surface-700 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-surface-700 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors"
            >
              {t("nav.search")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
