"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { searchArticles, categories } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import { Search, SlidersHorizontal } from "lucide-react";

function SearchContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const results =
    debouncedQuery || selectedCategory
      ? searchArticles(debouncedQuery || "", selectedCategory || undefined)
      : [];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Search Header */}
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-6">
            {t("search.title")}
          </h1>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              className="w-full pl-12 pr-4 py-4 bg-surface-50 border border-surface-200 rounded-2xl text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-lg"
              autoFocus
            />
          </div>

          {/* Category Filter */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-surface-400" />
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                !selectedCategory
                  ? "bg-brand-600 text-white"
                  : "bg-surface-100 text-surface-600 hover:bg-surface-200"
              }`}
            >
              {t("search.all")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.slug ? "" : cat.slug
                  )
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-brand-600 text-white"
                    : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {(debouncedQuery || selectedCategory) && (
          <p className="text-sm text-surface-500 mb-6">
            {results.length} {t("search.results")}
            {debouncedQuery && (
              <span>
                {" "}
                for &quot;<span className="font-medium text-surface-700">{debouncedQuery}</span>&quot;
              </span>
            )}
          </p>
        )}

        {results.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : debouncedQuery || selectedCategory ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500 text-lg">
              {t("search.noResults")}
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500 text-lg">
              Start typing to search for articles...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
