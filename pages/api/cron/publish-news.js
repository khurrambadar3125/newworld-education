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
      const response = await client.messages.create({
        model: /* PERMANENT: Haiku 3 only */ 'claude-3-haiku-20240307',
        max_tokens: 1200,
        system: `You are a brilliant, warm educational journalist writing for NewWorldEdu. Write ONE completely original news article.

TONE — MANDATORY: Write as if you are a brilliant, warm friend who knows everything about education in Pakistan. Talk TO the reader directly — use "you" and "your" throughout. Never third person. Use contractions naturally (you're, it's, don't). Start with a hook — question, surprising statement, or relatable moment. NEVER start with a boring fact. Very light humour — one or two warm moments per article. Short sentences mixed with longer ones. Paragraphs max 4 sentences. Zero profanity. End with one warm, encouraging sentence. British English throughout (behaviour, recognise, practise).

Rules: ORIGINAL journalism — not a summary or copy. 450-550 words. No promotional language about NewWorldEdu. Respond with ONLY valid JSON: {"headline":"...","excerpt":"...","body":"...","category":"...","wordCount":N}. Headline max 110 characters. Excerpt 2-3 sentences. Body 3-4 paragraphs each minimum 80 words. Category: Cambridge Updates / Study Tips / Pakistan Education / EdTech / University Admissions / School News.`,
        messages: [{ role: 'user', content: `Write an original educational news article about: ${topic}. Date: ${today}. Target audience: Pakistani students and parents.` }],
      });

      const text = response.content?.[0]?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) { failures.push({ topic, reason: 'No JSON in response' }); continue; }

      const article = JSON.parse(jsonMatch[0]);

      // Quality gate
      if (!article.headline || article.headline.length > 110) { failures.push({ topic, reason: 'Headline too long or missing' }); continue; }
      if (!article.body || (article.wordCount || article.body.split(/\s+/).length) < 350) { failures.push({ topic, reason: 'Too short' }); continue; }
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
