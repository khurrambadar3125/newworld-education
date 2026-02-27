"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/i18n/context";
import { Clock, ArrowRight } from "lucide-react";
import type { Article } from "@/data/articles";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
}

export default function ArticleCard({
  article,
  variant = "default",
}: ArticleCardProps) {
  const { t } = useI18n();

  if (variant === "featured") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-surface-100"
      >
        <div className="relative h-64 overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-brand-600/90 rounded-full backdrop-blur-sm mb-2">
              {article.category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-surface-900 mb-2 group-hover:text-brand-700 transition-colors line-clamp-2 font-serif">
            {article.title}
          </h3>
          <p className="text-sm text-surface-500 mb-4 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-surface-400">
              <span className="font-medium text-surface-600">
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime} {t("articles.minRead")}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group flex gap-4 items-start p-4 rounded-xl hover:bg-surface-50 transition-colors"
      >
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-surface-900 group-hover:text-brand-700 transition-colors line-clamp-2">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-surface-400">
            <span>{article.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} {t("articles.minRead")}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-surface-100 card-hover"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2.5 py-1 text-xs font-semibold text-white bg-brand-600/90 rounded-full backdrop-blur-sm">
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-surface-400 mb-2.5">
          <span className="px-2 py-0.5 bg-surface-100 rounded text-surface-500 font-medium">
            {article.level}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime} {t("articles.minRead")}
          </span>
        </div>
        <h3 className="text-lg font-bold text-surface-900 mb-2 group-hover:text-brand-700 transition-colors line-clamp-2 font-serif">
          {article.title}
        </h3>
        <p className="text-sm text-surface-500 line-clamp-2 mb-4">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-surface-100">
          <span className="text-xs font-medium text-surface-500">
            {article.author}
          </span>
          <span className="text-xs font-medium text-brand-600 group-hover:text-brand-700 flex items-center gap-1">
            {t("articles.readMore")}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
