"use client";

import { use } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/context";
import {
  getCategoryBySlug,
  getArticlesByCategory,
  categories,
} from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { t } = useI18n();
  const category = getCategoryBySlug(slug);
  const categoryArticles = getArticlesByCategory(slug);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-surface-900 mb-4">
            Category Not Found
          </h1>
          <p className="text-surface-500 mb-6">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Category Header */}
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-brand-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center text-2xl`}
            >
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-surface-900">
                {category.name}
              </h1>
              <p className="text-surface-500 mt-1">{category.description}</p>
            </div>
          </div>

          <p className="text-sm text-surface-400">
            {categoryArticles.length} articles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Sidebar - Other Categories */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-surface-100 p-5 sticky top-24">
              <h3 className="text-sm font-semibold text-surface-900 uppercase tracking-wider mb-4">
                {t("categories.title")}
              </h3>
              <nav className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      cat.slug === slug
                        ? "bg-brand-50 text-brand-700 font-medium"
                        : "text-surface-600 hover:bg-surface-50"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Articles */}
          <div className="lg:col-span-3">
            {categoryArticles.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-8">
                {categoryArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-surface-400 text-lg">
                  No articles in this category yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
