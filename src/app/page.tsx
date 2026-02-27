"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/i18n/context";
import { articles, categories, getFeaturedArticles } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Globe,
  Leaf,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

export default function HomePage() {
  const { t } = useI18n();
  const featuredArticles = getFeaturedArticles();
  const latestArticles = articles.slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="relative hero-gradient overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-medium text-white/90">
                  {t("hero.tagline")}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {t("hero.title")}
              </h1>

              <p className="text-lg text-blue-100 leading-relaxed mb-10 max-w-xl">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-brand-800 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/10"
                >
                  {t("hero.cta")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => {
                    const chatBtn = document.querySelector(
                      '[aria-label="Open AI Assistant"]'
                    ) as HTMLButtonElement;
                    chatBtn?.click();
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/25 hover:bg-white/20 transition-colors"
                >
                  <Brain className="w-4 h-4" />
                  {t("hero.cta2")}
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/15">
                <div>
                  <div className="text-2xl font-bold text-white">18</div>
                  <div className="text-xs text-blue-200">Articles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">6</div>
                  <div className="text-xs text-blue-200">Topics</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white flex items-center gap-1">
                    <Globe className="w-4 h-4 text-emerald-300" /> Planet
                  </div>
                  <div className="text-xs text-blue-200">Earth Focus</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-gold-400" /> AI
                  </div>
                  <div className="text-xs text-blue-200">Powered</div>
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
                  alt="Planet Earth from space"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/30 to-transparent" />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-4 -left-8 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-surface-900">
                    Planet Earth
                  </div>
                  <div className="text-xs text-surface-500">
                    Science-backed content
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 80V40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-3">
              {t("featured.title")}
            </h2>
            <p className="text-surface-500 text-lg">
              {t("featured.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                variant="featured"
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-800 transition-colors"
            >
              {t("common.viewAll")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-3">
              {t("categories.title")}
            </h2>
            <p className="text-surface-500 text-lg">
              {t("categories.subtitle")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group bg-white p-6 rounded-2xl border border-surface-100 hover:border-brand-200 hover:shadow-lg transition-all duration-300 card-hover"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-surface-900 group-hover:text-brand-700 transition-colors mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-surface-500 line-clamp-2 mb-2">
                      {category.description}
                    </p>
                    <span className="text-xs font-medium text-brand-600">
                      {category.articleCount} articles
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-14">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-3">
                {t("latest.title")}
              </h2>
              <p className="text-surface-500 text-lg">
                {t("latest.subtitle")}
              </p>
            </div>
            <Link
              href="/articles"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
            >
              {t("common.viewAll")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-3">
              Why New World Education?
            </h2>
            <p className="text-surface-500 text-lg">
              Understand our planet, protect its future
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Expert Content",
                description:
                  "Articles written by environmental scientists, geographers, and educators with real-world expertise.",
              },
              {
                icon: Brain,
                title: "AI Earth Tutor",
                description:
                  "Ask our AI tutor about climate, wildlife, oceans, or any environmental topic. Instant, clear answers.",
              },
              {
                icon: Leaf,
                title: "Planet Earth Focus",
                description:
                  "From coral reefs to climate change — deep, engaging content covering every aspect of our living planet.",
              },
              {
                icon: Users,
                title: "Multilingual",
                description:
                  "Available in multiple languages to serve students everywhere around the world.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-2xl border border-surface-100 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-brand-50 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-base font-bold text-surface-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)`,
            }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-lg text-blue-100 mb-10 leading-relaxed">
            {t("cta.subtitle")}
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-800 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/10 text-lg"
          >
            {t("cta.button")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
