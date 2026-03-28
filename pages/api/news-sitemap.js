/**
 * /api/news-sitemap — Google News sitemap
 * Only includes articles from last 2 days (Google News requirement).
 */
import { getSupabase } from '../../utils/supabase';
import { SEO_ARTICLES } from '../../utils/seoArticles';

export default async function handler(req, res) {
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
  const base = 'https://www.newworld.education';

  // Combine Supabase articles + seed SEO articles from last 2 days
  let articles = SEO_ARTICLES.filter(a => a.date >= twoDaysAgo);

  try {
    const sb = getSupabase();
    if (sb) {
      const { data } = await sb.from('news_articles').select('id, title, date').eq('published', true).gte('date', twoDaysAgo).limit(50);
      if (data) articles = [...data.map(a => ({ ...a, id: a.id })), ...articles];
    }
  } catch {}

  const urls = articles.map(a => `  <url>
    <loc>${base}/news#${a.id}</loc>
    <news:news>
      <news:publication>
        <news:name>NewWorldEdu</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${a.date}T08:00:00+05:00</news:publication_date>
      <news:title>${(a.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</news:title>
    </news:news>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=1800');
  res.status(200).send(xml);
}
