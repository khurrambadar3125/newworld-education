/**
 * /api/sitemap — Dynamic sitemap generator
 * Auto-includes all platform pages + blog posts from Supabase.
 * PERMANENT: This sitemap must always be current.
 */
import { getSupabase } from '../../utils/supabase';

const STATIC_PAGES = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/pricing', changefreq: 'monthly', priority: '0.9' },
  { url: '/drill', changefreq: 'weekly', priority: '0.9' },
  { url: '/special-needs', changefreq: 'weekly', priority: '0.9' },
  { url: '/past-papers', changefreq: 'weekly', priority: '0.9' },
  { url: '/summer', changefreq: 'weekly', priority: '0.8' },
  { url: '/news', changefreq: 'daily', priority: '0.8' },
  { url: '/kids', changefreq: 'weekly', priority: '0.8' },
  { url: '/phonics', changefreq: 'weekly', priority: '0.8' },
  { url: '/reading', changefreq: 'weekly', priority: '0.8' },
  { url: '/homework', changefreq: 'weekly', priority: '0.8' },
  { url: '/essay', changefreq: 'weekly', priority: '0.8' },
  { url: '/school', changefreq: 'monthly', priority: '0.8' },
  { url: '/student-dashboard', changefreq: 'daily', priority: '0.7' },
  { url: '/study-plan', changefreq: 'daily', priority: '0.7' },
  { url: '/arts', changefreq: 'weekly', priority: '0.7' },
  { url: '/music', changefreq: 'weekly', priority: '0.7' },
  { url: '/languages', changefreq: 'weekly', priority: '0.7' },
  { url: '/countdown', changefreq: 'daily', priority: '0.7' },
  { url: '/parent', changefreq: 'weekly', priority: '0.7' },
  { url: '/textbooks', changefreq: 'monthly', priority: '0.7' },
  { url: '/leaderboard', changefreq: 'daily', priority: '0.7' },
  { url: '/insights', changefreq: 'daily', priority: '0.7' },
  { url: '/championship', changefreq: 'weekly', priority: '0.7' },
  { url: '/iep', changefreq: 'weekly', priority: '0.7' },
  { url: '/zayd-mode', changefreq: 'weekly', priority: '0.7' },
  { url: '/subscribe', changefreq: 'monthly', priority: '0.6' },
  { url: '/referral', changefreq: 'monthly', priority: '0.6' },
  { url: '/ibcc', changefreq: 'monthly', priority: '0.6' },
  { url: '/spelling-bee', changefreq: 'weekly', priority: '0.6' },
  { url: '/reading-for-all', changefreq: 'weekly', priority: '0.6' },
  { url: '/arts-for-all', changefreq: 'weekly', priority: '0.6' },
  { url: '/music-for-all', changefreq: 'weekly', priority: '0.6' },
  { url: '/demo', changefreq: 'weekly', priority: '0.5' },
  // High priority product/landing pages
  { url: '/sat', changefreq: 'weekly', priority: '0.8' },
  { url: '/study', changefreq: 'weekly', priority: '0.7' },
  { url: '/learn', changefreq: 'weekly', priority: '0.7' },
  { url: '/mocks', changefreq: 'weekly', priority: '0.7' },
  { url: '/nano', changefreq: 'weekly', priority: '0.6' },
  { url: '/become-newton', changefreq: 'weekly', priority: '0.7' },
  { url: '/entrance-tests', changefreq: 'weekly', priority: '0.7' },
  { url: '/exam-compass', changefreq: 'weekly', priority: '0.7' },
  { url: '/daily-challenge', changefreq: 'weekly', priority: '0.6' },
  { url: '/free-practice-test', changefreq: 'weekly', priority: '0.7' },
  { url: '/our-results', changefreq: 'weekly', priority: '0.7' },
  { url: '/contact', changefreq: 'monthly', priority: '0.5' },
  { url: '/partner', changefreq: 'weekly', priority: '0.7' },
  { url: '/founder', changefreq: 'monthly', priority: '0.5' },
  { url: '/skills', changefreq: 'weekly', priority: '0.5' },
  { url: '/voice-lab', changefreq: 'weekly', priority: '0.5' },
  { url: '/challenge', changefreq: 'weekly', priority: '0.6' },
  { url: '/books', changefreq: 'monthly', priority: '0.5' },
  // UAE pages
  { url: '/phonics-uae', changefreq: 'weekly', priority: '0.5' },
  { url: '/spelling-uae', changefreq: 'weekly', priority: '0.5' },
  { url: '/summer-uae', changefreq: 'weekly', priority: '0.5' },
  // Other public pages
  { url: '/bootcamp', changefreq: 'weekly', priority: '0.5' },
  { url: '/bootcamp-sindh', changefreq: 'monthly', priority: '0.4' },
  { url: '/responsible-ai', changefreq: 'monthly', priority: '0.4' },
  { url: '/starky-saturdays', changefreq: 'monthly', priority: '0.4' },
  { url: '/try', changefreq: 'weekly', priority: '0.5' },
  { url: '/privacy', changefreq: 'monthly', priority: '0.3' },
  { url: '/terms', changefreq: 'monthly', priority: '0.3' },
];

export default async function handler(req, res) {
  const today = new Date().toISOString().split('T')[0];
  const base = 'https://www.newworld.education';

  let urls = STATIC_PAGES.map(p => `  <url><loc>${base}${p.url}</loc><lastmod>${today}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`);

  // Add blog/news articles from Supabase
  try {
    const sb = getSupabase();
    if (sb) {
      const { data } = await sb.from('news_articles').select('id, date').eq('published', true).limit(100);
      if (data) {
        data.forEach(a => {
          urls.push(`  <url><loc>${base}/news#${a.id}</loc><lastmod>${a.date || today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
        });
      }
    }
  } catch {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(xml);
}
