/**
 * utils/getKnowledgeForTopic.js
 * ─────────────────────────────────────────────────────────────────
 * Searches the global knowledge base for topics relevant to the
 * student's message and returns formatted context for injection
 * into Starky's system prompt.
 *
 * Usage:
 *   import { getKnowledgeForTopic } from './getKnowledgeForTopic';
 *   const extra = getKnowledgeForTopic(message, subject);
 *   // Returns a string to append to the system prompt, or ''
 */

import KNOWLEDGE_BASE from './globalKnowledgeBase';

/**
 * Find the best matching topic(s) for a student's message.
 * Uses keyword matching against topic names and knowledge base keywords.
 *
 * @param {string} message — the student's message
 * @param {string} [subject] — optional subject context (e.g. "Chemistry")
 * @returns {string} — formatted knowledge block to inject into prompt, or ''
 */
export async function getKnowledgeForTopic(message, subject) {
  if (!message || message.length < 3) return '';
  const msg = message.toLowerCase();

  const matches = [];

  // Search subjects — prioritise the current subject if provided
  const subjectsToSearch = subject
    ? [subject, ...Object.keys(KNOWLEDGE_BASE).filter(s => s !== subject)]
    : Object.keys(KNOWLEDGE_BASE);

  for (const subj of subjectsToSearch) {
    const topics = KNOWLEDGE_BASE[subj];
    if (!topics) continue;

    for (const [topicName, data] of Object.entries(topics)) {
      let score = 0;

      // Match topic name
      const topicLower = topicName.toLowerCase();
      if (msg.includes(topicLower)) score += 10;

      // Match individual words from topic name (2+ chars)
      const topicWords = topicLower.split(/[\s&,()]+/).filter(w => w.length > 2);
      for (const word of topicWords) {
        if (msg.includes(word)) score += 3;
      }

      // Match keywords from knowledge base
      if (data.keywords) {
        for (const kw of data.keywords) {
          if (msg.includes(kw.toLowerCase())) score += 4;
        }
      }

      // Boost if subject matches current subject
      if (subject && subj.toLowerCase() === subject.toLowerCase()) score += 5;

      if (score >= 6) {
        matches.push({ subject: subj, topic: topicName, data, score });
      }
    }
  }

  if (matches.length === 0) return '';

  // Sort by score, take top 2
  matches.sort((a, b) => b.score - a.score);
  const top = matches.slice(0, 2);

  // Format for injection into system prompt
  const blocks = top.map(m => {
    const lines = [];
    lines.push(`TOPIC KNOWLEDGE — ${m.subject}: ${m.topic}`);

    if (m.data.misconceptions?.length) {
      lines.push('COMMON MISCONCEPTIONS (students get these wrong — correct them gently):');
      m.data.misconceptions.forEach(mc => lines.push(`  • ${mc}`));
    }

    if (m.data.examinerTips?.length) {
      lines.push('EXAMINER TIPS (what Cambridge examiners want to see):');
      m.data.examinerTips.forEach(tip => lines.push(`  • ${tip}`));
    }

    if (m.data.keywords?.length) {
      lines.push(`KEY WORDS for full marks: ${m.data.keywords.join(', ')}`);
    }

    if (m.data.mistakes?.length) {
      lines.push('TYPICAL STUDENT MISTAKES (watch for these):');
      m.data.mistakes.forEach(err => lines.push(`  • ${err}`));
    }

    return lines.join('\n');
  });

  let result = '\n\n' + blocks.join('\n\n');

  // Inject brain data from Vercel KV (autonomous intelligence)
  try {
    const { kv } = await import('@vercel/kv');
    const hardTopics = await kv.get(`brain:hard_topics:${subject}`);
    const phrases = await kv.get(`brain:mark_scheme_phrases:${subject}`);
    if (hardTopics) {
      const parsed = typeof hardTopics === 'string' ? JSON.parse(hardTopics) : hardTopics;
      if (Array.isArray(parsed) && parsed.length > 0) {
        result += '\n\nSTARKY BRAIN — HARD TOPICS (students struggle with these):\n' + parsed.slice(0, 3).map(t => `  • ${t}`).join('\n');
      }
    }
    if (phrases) {
      const parsed = typeof phrases === 'string' ? JSON.parse(phrases) : phrases;
      if (Array.isArray(parsed) && parsed.length > 0) {
        result += '\n\nSTARKY BRAIN — KEY MARK SCHEME PHRASES:\n' + parsed.slice(0, 5).map(p => `  • ${p}`).join('\n');
      }
    }
  } catch {} // KV not available in dev — silent fail

  return result;
}
