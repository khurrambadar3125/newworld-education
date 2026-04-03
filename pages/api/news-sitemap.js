/**
 * /api/news-sitemap — Google News sitemap
 * Only includes articles from last 2 days (Google News requirement).
 * Publication name must match Google News Publisher Center exactly.
 */
import { getSupabase } from '../../utils/supabase';
import { SEO_ARTICLES } from '../../utils/seoArticles';

function escapeXml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export default async function handler(req, res) {
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
  const base = 'https://www.newworld.education';

  let articles = SEO_ARTICLES.filter(a => a.date >= twoDaysAgo);

  try {
    const sb = getSupabase();
    if (sb) {
      const { data } = await sb
        .from('news_articles')
        .select('id, title, date, category')
        .eq('published', true)
        .gte('date', twoDaysAgo)
        .order('date', { ascending: false })
        .limit(50);
      if (data) articles = [...data, ...articles];
    }
  } catch {}

  const urls = articles.map(a => `  <url>
    <loc>${base}/news?article=${a.id}</loc>
    <news:news>
      <news:publication>
        <news:name>NewWorld Education</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${a.date}T08:00:00+05:00</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
      <news:keywords>${escapeXml(a.category || 'Education')}</news:keywords>
    </news:news>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
  res.status(200).send(xml);
}
