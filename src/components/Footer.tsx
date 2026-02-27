"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/context";
import { GraduationCap, Globe, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-surface-950 text-surface-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white leading-tight">
                  New World
                </div>
                <div className="text-[10px] font-medium text-brand-400 uppercase tracking-[0.2em] leading-tight">
                  Education
                </div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-surface-400 mb-6">
              {t("footer.description")}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-brand-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-brand-600 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-brand-600 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: t("nav.home") },
                { href: "/articles", label: t("nav.articles") },
                { href: "/search", label: t("nav.search") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-surface-400 hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              {t("footer.subjects")}
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/categories/climate-weather", label: "Climate & Weather" },
                { href: "/categories/oceans-marine", label: "Oceans & Marine Life" },
                { href: "/categories/forests-biodiversity", label: "Forests & Biodiversity" },
                { href: "/categories/earth-science", label: "Earth Science & Geology" },
                { href: "/categories/wildlife-conservation", label: "Wildlife & Conservation" },
                { href: "/categories/sustainability", label: "Sustainability & Green Living" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-surface-400 hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              {t("footer.connect")}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" />
                <span className="text-sm text-surface-400">
                  hello@newworldeducation.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" />
                <span className="text-sm text-surface-400">
                  Serving students worldwide
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-500">
            &copy; {new Date().getFullYear()} New World Education.{" "}
            {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs text-surface-500 hover:text-surface-300 transition-colors"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="#"
              className="text-xs text-surface-500 hover:text-surface-300 transition-colors"
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
