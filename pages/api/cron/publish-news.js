/**
 * /api/cron/publish-news
 * Runs daily at 8am PKT (3am UTC). Generates 3 original education articles.
 * PERMANENT: News publishing drives SEO and Google News indexing.
 */

import { getAnthropicClient } from '../../../utils/anthropicClient';
import { getSupabase } from '../../../utils/supabase';

export const config = { api: { bodyParser: true }, maxDuration: 120 };

const client = getAnthropicClient();

// Exam-season topic calendar — final sprint before May/June 2026
const PARENT_ANXIETY = [
  'What Pakistani parents of O Level students should actually do in the last month before Cambridge exams',
  'Your child says they have revised for their O Levels. Have they really? Here is how to tell.',
  'The one thing Pakistani parents do that makes Cambridge exam stress worse — and what to do instead',
  'How to talk to your Pakistani teenager about O Level and A Level exams without starting a fight',
  'Signs your child is more stressed about Cambridge exams than they are letting on',
  'Should you hire a tutor this close to Cambridge O Level exams? An honest answer for Pakistani parents',
  'What a good Cambridge O Level grade actually requires — and what most Pakistani parents do not know',
];
const STUDENT_SURVIVAL = [
  'Four weeks to Cambridge O Levels in Pakistan: the only revision plan that works now',
  'How to tackle a Cambridge past paper when you run out of time in the exam',
  'The Cambridge mark scheme tells you exactly what to write. Here is how Pakistani students should read it.',
  'Why you keep getting B grades when you feel like you deserve A stars in Cambridge O Levels',
  'The night before your Cambridge O Level exam: what to do and what not to do',
  'How to answer evaluate questions in Cambridge exams — most Pakistani students get this wrong',
  'Cambridge Biology O Level in four weeks: what to prioritise and what to skip in Pakistan',
  'A Level Chemistry last-minute guide for Pakistani students: the topics that always come up',
];
const SUBJECT_SPECIFIC = [
  'O Level Mathematics 4024: the five question types that lose Pakistani students the most marks',
  'Cambridge English Language Paper 1: what examiners actually want from Pakistani students',
  'O Level Physics in Pakistan: which topics carry the most marks in the May June 2026 paper',
  'A Level Economics: how to write a proper evaluative conclusion with examples for Cambridge',
  'O Level Pakistan Studies: what to focus on with four weeks left before Cambridge exams',
  'A Level Biology: the Cambridge mark schemes Pakistani students never read and why it costs them A stars',
  'Cambridge Chemistry O Level: the organic reactions that come up every single year in Pakistan',
];
const EMOTIONAL_SUPPORT = [
  'Exam anxiety is real for Pakistani Cambridge students. Here is what actually helps backed by research.',
  'Your O Level grade does not define your future. But here is how to make it count in Pakistan.',
  'Why Pakistani students are harder on themselves than Cambridge actually requires',
  'Sleep food and revision: the boring things that actually move the needle for Cambridge exams in Pakistan',
  'What to do if your Pakistani child says they want to give up on their Cambridge O Level exams',
];

// CTA variants — rotated across daily articles
const CTAS = [
  `\n\n---\n\nIf your child is sitting O Levels or A Levels this May/June, Starky — NewWorldEdu's AI tutor — can work through past papers, explain mark schemes, and pinpoint exactly where marks are being lost.\n\nYour child can try Starky free for 10 sessions, no credit card needed.\n\n[Start learning with Starky →](https://www.newworld.education)`,
  `\n\n---\n\nThe difference between a B and an A* is usually not how much a student studies — it is how they study. Starky, NewWorldEdu's Cambridge AI tutor, builds a personal study plan around your child's actual weak spots.\n\n10 free sessions. No credit card.\n\n[Meet Starky →](https://www.newworld.education)`,
  `\n\n---\n\nAs a parent, the most useful thing you can do right now is give your child access to the right support. NewWorldEdu's Starky is available at 11pm when tutors aren't — patient, Cambridge-trained, and free to try.\n\n[Try Starky free →](https://www.newworld.education)`,
  `\n\n---\n\nOne of the best ways to reduce exam anxiety is to feel genuinely prepared. Starky — NewWorldEdu's AI tutor — works through exactly what your child finds difficult, at whatever hour they need help.\n\n[Start free today →](https://www.newworld.education)`,
];

const CATEGORIES = ['Cambridge Updates', 'Study Tips', 'Pakistan Education', 'Exam Tips', 'School News'];

export default async function handler(req, res) {
  const auth = req.headers.authorization;
  if (auth !== process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const sb = getSupabase();
  const today = new Date().toISOString().split('T')[0];
  const published = [];
  const failures = [];

  // Pick 3 topics: 1 parent anxiety, 1 student/subject, 1 emotional support
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const todaysTopics = [
    pick(PARENT_ANXIETY),
    Math.random() > 0.5 ? pick(STUDENT_SURVIVAL) : pick(SUBJECT_SPECIFIC),
    pick(EMOTIONAL_SUPPORT),
  ];

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

      // Append CTA — rotate variants, never same twice in one day
      const ctaIndex = published.length % CTAS.length;
      const bodyWithCTA = article.body + CTAS[ctaIndex];

      // Save to Supabase
      if (sb) {
        await sb.from('news_articles').insert({
          title: article.headline,
          excerpt: article.excerpt,
          body: bodyWithCTA,
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
