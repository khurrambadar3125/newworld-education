/**
 * /api/news-rss — RSS feed for Google News and feed readers
 * Pulls from Supabase news_articles (dynamic) + fallback seed articles
 */

import { getSupabase } from '../../utils/supabase';

const SEED_ARTICLES = [
  { title: 'Cambridge May/June 2026: What Every Pakistani Student Should Know Right Now', date: '2026-03-29', id: 'cambridge-2026-preparation', excerpt: 'The exam window opens in weeks. Here is what the examiner reports tell us.' },
  { title: 'Why Every Child with a Learning Difference Deserves a Tutor Who Understands Their Brain', date: '2026-03-28', id: 'sen-education-pakistan', excerpt: 'In Pakistan, most children with autism, ADHD, or dyslexia have never been formally assessed.' },
  { title: 'The Secret That A* Students Know: It Is Not About Knowledge', date: '2026-03-27', id: 'why-mark-schemes-matter', excerpt: 'The difference between an A and an A* is almost never what the student knows.' },
];

function escapeXml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  let articles = [...SEED_ARTICLES];

  // Fetch latest from Supabase
  try {
    const sb = getSupabase();
    if (sb) {
      const { data } = await sb
        .from('news_articles')
        .select('id, title, date, excerpt, author')
        .eq('published', true)
        .order('date', { ascending: false })
        .limit(50);
      if (data?.length) {
        articles = [...data, ...articles];
      }
    }
  } catch {}

  // Sort by date descending
  articles.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>NewWorld Education</title>
    <link>https://www.newworld.education/news</link>
    <description>Education news, Cambridge exam insights, and learning science for students and parents.</description>
    <language>en</language>
    <copyright>NewWorld Education 2026</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://www.newworld.education/api/news-rss" rel="self" type="application/rss+xml" />
    <image>
      <url>https://www.newworld.education/icons/icon-512.png</url>
      <title>NewWorld Education</title>
      <link>https://www.newworld.education</link>
    </image>
${articles.map(a => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>https://www.newworld.education/news?article=${a.id}</link>
      <description>${escapeXml(a.excerpt)}</description>
      <author>${escapeXml(a.author || 'NewWorld Education')}</author>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">https://www.newworld.education/news?article=${a.id}</guid>
    </item>`).join('\n')}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/rss+xml');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
  res.status(200).send(rss);
}
