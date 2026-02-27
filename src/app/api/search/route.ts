import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/data/articles";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || undefined;

  const results = searchArticles(q, category);

  return NextResponse.json({
    query: q,
    category,
    count: results.length,
    results: results.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      categorySlug: a.categorySlug,
      author: a.author,
      date: a.date,
      readTime: a.readTime,
      image: a.image,
      level: a.level,
    })),
  });
}
