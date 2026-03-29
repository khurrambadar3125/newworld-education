/**
 * /api/cron/publish-news
 * Runs daily at 8am PKT (3am UTC). Generates 3 original education articles.
 * PERMANENT: News publishing drives SEO and Google News indexing.
 */

import Anthropic from '@anthropic-ai/sdk';
import { getSupabase } from '../../../utils/supabase';

export const config = { api: { bodyParser: true }, maxDuration: 120 };

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 30000 });

const TOPICS = [
  'Cambridge O Level exam preparation tips for Pakistani students',
  'Cambridge A Level subject study guide and revision strategies',
  'Pakistan education policy and HEC news developments',
  'Evidence-based study techniques for secondary students',
  'University admissions for Pakistani students applying abroad',
  'EdTech developments and digital learning in South Asia',
  'Karachi school education news and updates',
  'Pakistan Higher Education Commission policy updates',
  'Pakistan education statistics and learning outcomes',
  'Parenting strategies for supporting academic achievement',
];

const CATEGORIES = ['Cambridge Updates', 'Study Tips', 'Pakistan Education', 'EdTech', 'University Admissions', 'School News'];

export default async function handler(req, res) {
  const auth = req.headers.authorization || req.query.secret;
  if (auth !== process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const sb = getSupabase();
  const today = new Date().toISOString().split('T')[0];
  const published = [];
  const failures = [];

  // Pick 3 random topics
  const shuffled = [...TOPICS].sort(() => Math.random() - 0.5);
  const todaysTopics = shuffled.slice(0, 3);

  for (const topic of todaysTopics) {
    try {
      // Step 1: Generate article as plain text (Haiku 3 struggles with JSON for long content)
      const response = await client.messages.create({
        model: /* PERMANENT: Haiku 3 only */ 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: `You are a brilliant, warm educational journalist. Write ONE original article for Pakistani students and parents. Talk TO the reader — use "you" and "your". Start with a hook. Use contractions. Light humour. Paragraphs max 4 sentences. British English. 400-500 words. End with one warm, encouraging sentence. No promotional language.

FORMAT — follow this EXACTLY:
HEADLINE: [your headline here, max 110 characters]
CATEGORY: [one of: Cambridge Updates / Study Tips / Pakistan Education / EdTech / University Admissions / School News]
EXCERPT: [2-3 sentence summary]
BODY:
[full article text, 400-500 words, paragraphs separated by blank lines]`,
        messages: [{ role: 'user', content: `Write an original educational article about: ${topic}` }],
      });

      const text = response.content?.[0]?.text || '';
      if (!text || text.length < 200) { failures.push({ topic, reason: 'Response too short' }); continue; }

      // Parse structured plain text
      const headlineMatch = text.match(/HEADLINE:\s*(.+)/i);
      const categoryMatch = text.match(/CATEGORY:\s*(.+)/i);
      const excerptMatch = text.match(/EXCERPT:\s*(.+?)(?=\nBODY:|\n\n)/is);
      const bodyMatch = text.match(/BODY:\s*([\s\S]+)/i);

      if (!headlineMatch || !bodyMatch) { failures.push({ topic, reason: 'Could not parse format' }); continue; }

      const article = {
        headline: headlineMatch[1].trim().slice(0, 110),
        category: (categoryMatch?.[1]?.trim() || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]),
        excerpt: (excerptMatch?.[1]?.trim() || bodyMatch[1].trim().split('\n')[0].slice(0, 200)),
        body: bodyMatch[1].trim(),
        wordCount: bodyMatch[1].trim().split(/\s+/).length,
      };

      // Quality gate
      if (!article.headline || article.headline.length > 110) { failures.push({ topic, reason: 'Headline too long or missing' }); continue; }
      if (!article.body || (article.wordCount || article.body.split(/\s+/).length) < 250) { failures.push({ topic, reason: 'Too short' }); continue; }
      if (!article.excerpt) { failures.push({ topic, reason: 'No excerpt' }); continue; }

      // Check duplicate headlines in last 30 days
      if (sb) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
        const { data: existing } = await sb.from('news_articles').select('title').gte('date', thirtyDaysAgo);
        if (existing?.some(e => e.title === article.headline)) { failures.push({ topic, reason: 'Duplicate headline' }); continue; }
      }

      const wordCount = article.body.split(/\s+/).length;
      const readTime = `${Math.ceil(wordCount / 200)} min read`;

      // Save to Supabase
      if (sb) {
        await sb.from('news_articles').insert({
          title: article.headline,
          excerpt: article.excerpt,
          body: article.body,
          author: 'NewWorldEdu Editorial Team',
          date: today,
          category: article.category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
          read_time: readTime,
          published: true,
        });
      }

      published.push({ headline: article.headline, category: article.category, wordCount });
    } catch (err) {
      failures.push({ topic, reason: err.message });
    }
  }

  // Ping Google sitemap
  try {
    await fetch('https://www.google.com/ping?sitemap=https://www.newworld.education/api/news-sitemap').catch(() => {});
  } catch {}

  return res.status(200).json({
    date: today,
    published: published.length,
    articles: published,
    failures: failures.length,
    failureDetails: failures,
  });
}
