"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/i18n/context";
import { getArticleBySlug, articles } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Tag,
  User,
} from "lucide-react";

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { t } = useI18n();
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-surface-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-surface-500 mb-6">
            The article you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = articles
    .filter(
      (a) => a.categorySlug === article.categorySlug && a.slug !== article.slug
    )
    .slice(0, 3);

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[320px] max-h-[500px]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("articles.all")}
          </Link>
        </div>

        {/* Article meta on hero */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                href={`/categories/${article.categorySlug}`}
                className="inline-block px-3 py-1 text-xs font-semibold text-white bg-brand-600/80 backdrop-blur-sm rounded-full hover:bg-brand-600 transition-colors"
              >
                {article.category}
              </Link>
              <span className="px-3 py-1 text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm rounded-full">
                {article.level}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Meta bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-surface-100">
          <div className="flex flex-wrap items-center gap-5 text-sm text-surface-500">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {article.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {article.readTime} {t("articles.minRead")}
            </span>
          </div>
          <button
            onClick={shareArticle}
            className="p-2 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            aria-label="Share article"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Excerpt */}
        <div className="py-8 border-b border-surface-100">
          <p className="text-xl text-surface-600 leading-relaxed italic font-serif">
            {article.excerpt}
          </p>
        </div>

        {/* Content */}
        <article className="article-content py-10">
          {article.content.split("\n").map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return null;

            // Headers
            if (trimmed.startsWith("## ")) {
              return (
                <h2 key={i}>
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }
            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={i}>
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }

            // Blockquotes
            if (trimmed.startsWith("> ")) {
              return (
                <blockquote key={i}>
                  {trimmed.replace("> ", "")}
                </blockquote>
              );
            }

            // List items
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
              return (
                <li key={i} className="ml-6 list-disc text-surface-700 mb-1">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: trimmed
                        .replace(/^[-*] /, "")
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="font-semibold text-surface-900">$1</strong>'
                        )
                        .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                    }}
                  />
                </li>
              );
            }

            // Numbered list items
            if (/^\d+\.\s/.test(trimmed)) {
              return (
                <li
                  key={i}
                  className="ml-6 list-decimal text-surface-700 mb-1"
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: trimmed
                        .replace(/^\d+\.\s/, "")
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="font-semibold text-surface-900">$1</strong>'
                        )
                        .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                    }}
                  />
                </li>
              );
            }

            // Code blocks
            if (trimmed.startsWith("```")) {
              return null;
            }

            // Table headers
            if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
              if (trimmed.includes("---")) return null;
              const cells = trimmed
                .split("|")
                .filter((c) => c.trim())
                .map((c) => c.trim());
              const isHeader =
                i + 1 < article.content.split("\n").length &&
                article.content.split("\n")[i + 1]?.includes("---");
              return (
                <tr key={i}>
                  {cells.map((cell, j) =>
                    isHeader ? (
                      <th key={j}>{cell}</th>
                    ) : (
                      <td key={j}>{cell}</td>
                    )
                  )}
                </tr>
              );
            }

            // Paragraphs
            return (
              <p
                key={i}
                dangerouslySetInnerHTML={{
                  __html: trimmed
                    .replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="font-semibold text-surface-900">$1</strong>'
                    )
                    .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    .replace(
                      /`(.*?)`/g,
                      '<code class="bg-surface-100 text-brand-700 px-2 py-0.5 rounded text-sm font-mono">$1</code>'
                    ),
                }}
              />
            );
          })}
        </article>

        {/* Tags */}
        <div className="py-6 border-t border-surface-100">
          <div className="flex items-center gap-3 flex-wrap">
            <Tag className="w-4 h-4 text-surface-400" />
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 text-xs font-medium bg-surface-100 text-surface-600 rounded-full hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-surface-50 py-16 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-surface-900 mb-8">
              {t("articles.related")}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
