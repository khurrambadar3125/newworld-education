"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { articles, categories } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";

export default function ArticlesPage() {
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filtered =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.categorySlug === selectedCategory);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-surface-900 mb-3">
            {t("articles.all")}
          </h1>
          <p className="text-surface-500 text-lg">
            Explore our collection of expertly written educational articles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedCategory === "all"
                ? "bg-brand-600 text-white"
                : "bg-white text-surface-600 hover:bg-surface-100 border border-surface-200"
            }`}
          >
            {t("search.all")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-brand-600 text-white"
                  : "bg-white text-surface-600 hover:bg-surface-100 border border-surface-200"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-surface-400 text-lg">
              No articles found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
