/**
 * pages/api/cron/teaching-grow.js — Autonomous Teaching Content Generator
 * ─────────────────────────────────────────────────────────────────
 * Runs daily at 10am PKT (5am UTC). Automatically grows the teaching bank.
 *
 * What it does:
 * 1. Finds questions students get wrong most often (>50% failure rate)
 * 2. Converts them into worked examples (question + answer + mark scheme = lesson)
 * 3. Saves to teaching_bank table
 * 4. The platform gets smarter every day WITHOUT human intervention
 *
 * ZERO Claude API calls. Pure data transformation.
 */

import { getSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  const auth = req.headers['authorization'];
  if (auth !== `Bearer ${process.env.CRON_SECRET}` && auth !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'DB not configured' });

  let generated = 0;

  try {
    // 1. Find hard questions (served 5+ times, <50% correct)
    const { data: hardQuestions } = await supabase
      .from('question_bank')
      .select('id, subject, level, topic, question_text, correct_answer, mark_scheme, options, type, image_url, difficulty')
      .gt('times_served', 5)
      .lt('avg_score', 0.5)
      .not('mark_scheme', 'is', null)
      .limit(50);

    if (hardQuestions?.length) {
      for (const q of hardQuestions) {
        // Check if we already have a teaching entry for this question
        const { data: existing } = await supabase
          .from('teaching_bank')
          .select('id')
          .eq('title', `Worked Example: ${q.question_text?.slice(0, 50)}`)
          .limit(1);

        if (existing?.length) continue; // Already exists

        // Convert to teaching content
        const { error } = await supabase.from('teaching_bank').insert({
          subject: q.subject,
          level: q.level,
          topic: q.topic || 'General',
          content_type: 'worked_example',
          title: `Worked Example: ${q.question_text?.slice(0, 50)}`,
          content: `QUESTION:\n${q.question_text}\n\nCORRECT ANSWER:\n${q.correct_answer}\n\nMARK SCHEME:\n${q.mark_scheme || q.correct_answer}\n\nWHY STUDENTS GET THIS WRONG:\nThis question has a failure rate above 50%. Study the mark scheme carefully — the examiner requires specific language.`,
          steps: JSON.stringify({
            question: q.question_text,
            correctAnswer: q.correct_answer,
            markScheme: q.mark_scheme,
            options: q.options,
            type: q.type,
          }),
          image_url: q.image_url || null,
          source: 'auto_generated',
          curriculum: 'cambridge',
          difficulty: q.difficulty || 'medium',
        });

        if (!error) generated++;
      }
    }

    // 2. Find mark scheme phrases that appear frequently (teaching keywords)
    const { data: markSchemes } = await supabase
      .from('question_bank')
      .select('subject, topic, mark_scheme')
      .not('mark_scheme', 'is', null)
      .limit(500);

    // Extract common phrases per subject
    const subjectPhrases = {};
    if (markSchemes?.length) {
      for (const q of markSchemes) {
        if (!q.mark_scheme) continue;
        const key = q.subject;
        if (!subjectPhrases[key]) subjectPhrases[key] = {};
        // Extract 3-4 word phrases
        const words = q.mark_scheme.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        for (let i = 0; i < words.length - 2; i++) {
          const phrase = `${words[i]} ${words[i+1]} ${words[i+2]}`;
          subjectPhrases[key][phrase] = (subjectPhrases[key][phrase] || 0) + 1;
        }
      }
    }

    // Save top phrases as teaching tips
    for (const [subject, phrases] of Object.entries(subjectPhrases)) {
      const topPhrases = Object.entries(phrases)
        .filter(([, count]) => count >= 5)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      if (topPhrases.length === 0) continue;

      // Check if we already have this
      const { data: existing } = await supabase
        .from('teaching_bank')
        .select('id')
        .eq('subject', subject)
        .eq('content_type', 'key_phrases')
        .limit(1);

      if (existing?.length) {
        // Update existing
        await supabase.from('teaching_bank')
          .update({
            content: `KEY MARK SCHEME PHRASES FOR ${subject.toUpperCase()}:\n\n${topPhrases.map(([p, c]) => `• "${p}" (appears ${c} times)`).join('\n')}`,
            steps: JSON.stringify(topPhrases.map(([phrase, count]) => ({ phrase, count }))),
          })
          .eq('id', existing[0].id);
      } else {
        await supabase.from('teaching_bank').insert({
          subject,
          level: 'O Level',
          topic: 'Examiner Language',
          content_type: 'key_phrases',
          title: `Mark Scheme Key Phrases: ${subject}`,
          content: `KEY MARK SCHEME PHRASES FOR ${subject.toUpperCase()}:\n\n${topPhrases.map(([p, c]) => `• "${p}" (appears ${c} times)`).join('\n')}`,
          steps: JSON.stringify(topPhrases.map(([phrase, count]) => ({ phrase, count }))),
          source: 'auto_generated',
          curriculum: 'cambridge',
        });
        generated++;
      }
    }

    // 3. Count teaching bank
    const { count } = await supabase
      .from('teaching_bank')
      .select('id', { count: 'exact', head: true });

    return res.status(200).json({
      status: 'ok',
      generated,
      teachingBankTotal: count || 0,
      hardQuestionsFound: hardQuestions?.length || 0,
      subjectsWithPhrases: Object.keys(subjectPhrases).length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[teaching-grow] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
