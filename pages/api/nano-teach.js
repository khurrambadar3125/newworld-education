/**
 * pages/api/nano-teach.js — Bank-first teaching API
 * ─────────────────────────────────────────────────────────────────
 * Returns everything needed for a complete nano teaching session:
 * 1 worked example (with answer) + 1 guided + 3 practice questions
 * Plus: atoms, misconceptions, examiner tips from knowledge bases
 *
 * ZERO Claude API dependency.
 *
 * GET ?subject=Chemistry&topic=Atomic+Structure&level=O+Level
 */

import { fetchQuestions, toClientFormat } from '../../utils/questionBank';
import { getSupabase } from '../../utils/supabase';

// Fuzzy topic match — normalize and compare
function topicMatch(bankTopic, searchTopic) {
  const norm = s => (s || '').toLowerCase().replace(/[&,]/g, ' ').replace(/\s+/g, ' ').trim();
  const a = norm(bankTopic);
  const b = norm(searchTopic);
  return a === b || a.includes(b) || b.includes(a);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const { subject, topic, level = 'O Level' } = req.query;
  if (!subject) return res.status(400).json({ error: 'subject required' });

  try {
    const supabase = getSupabase();

    // Fetch questions for this topic — get enough for teaching set
    let pool = await fetchQuestions({
      subject,
      level,
      topic: topic || undefined,
      limit: 30,
    });

    // Broaden if not enough
    if (pool.length < 5 && topic) {
      const broader = await fetchQuestions({ subject, level, limit: 30 });
      pool = [...pool, ...broader.filter(q => !pool.find(p => p.id === q.id))];
    }

    // Also check Edexcel
    if (pool.length < 5) {
      const edexcel = await fetchQuestions({ subject, level, topic: topic || undefined, curriculum: 'edexcel', limit: 10 });
      pool = [...pool, ...edexcel.filter(q => !pool.find(p => p.id === q.id))];
    }

    if (pool.length === 0) {
      return res.status(200).json({ error: 'No questions available for this topic', questions: [] });
    }

    // Prioritize MCQs (better UX for nano-teach) — move them to front
    pool.sort((a, b) => {
      if (a.type === 'mcq' && b.type !== 'mcq') return -1;
      if (a.type !== 'mcq' && b.type === 'mcq') return 1;
      return 0;
    });

    // Need minimum 2 questions (1 worked + 1 practice). Ideal is 5+.
    if (pool.length < 2) {
      return res.status(200).json({ error: 'Not enough questions for a full lesson. Try another topic.', questions: [] });
    }

    // Sort by difficulty: easy first for worked example
    const sorted = pool.sort((a, b) => {
      const diff = { easy: 0, very_easy: 0, medium: 1, hard: 2, very_hard: 3 };
      return (diff[a.difficulty] || 1) - (diff[b.difficulty] || 1);
    });

    // Pick teaching set: 1 worked + 1 guided + up to 3 practice (flexible)
    const workedExample = sorted[0]; // easiest = worked example
    const guidedQuestion = sorted.length > 2 ? sorted[1] : sorted[0]; // avoid duplicate if only 2
    const practiceStart = sorted.length > 2 ? 2 : 1;
    const practiceQuestions = sorted.slice(practiceStart, practiceStart + 3); // flexible count

    // For worked example: include the FULL answer (this IS the lesson)
    const workedFormatted = {
      ...toClientFormat(workedExample),
      correctAnswer: workedExample.correct_answer,
      markScheme: workedExample.mark_scheme || workedExample.correct_answer,
      options: workedExample.options,
      // Highlight which option is correct
      correctOption: workedExample.type === 'mcq' ? workedExample.correct_answer : undefined,
    };

    // For guided: include hints but NOT the answer
    const guidedFormatted = {
      ...toClientFormat(guidedQuestion),
      hints: [
        workedExample.mark_scheme ? `Mark scheme key phrase: "${(workedExample.mark_scheme || '').slice(0, 100)}"` : null,
        `Remember: the worked example showed ${workedExample.correct_answer}`,
      ].filter(Boolean),
    };

    // For practice: just the questions, no answers
    const practiceFormatted = practiceQuestions.map(q => toClientFormat(q));

    // Find the next topic for progression
    let nextTopic = null;
    if (supabase) {
      const { data: allTopics } = await supabase
        .from('question_bank')
        .select('topic')
        .eq('subject', subject)
        .eq('level', level)
        .not('topic', 'is', null)
        .limit(1000);

      if (allTopics) {
        const uniqueTopics = [...new Set(allTopics.map(t => t.topic).filter(Boolean))];
        const currentIdx = uniqueTopics.findIndex(t => topicMatch(t, topic));
        if (currentIdx >= 0 && currentIdx < uniqueTopics.length - 1) {
          nextTopic = uniqueTopics[currentIdx + 1];
        } else if (uniqueTopics.length > 0) {
          nextTopic = uniqueTopics[0]; // wrap around
        }
      }
    }

    return res.status(200).json({
      subject,
      level,
      topic: topic || 'General',
      workedExample: workedFormatted,
      guidedQuestion: guidedFormatted,
      practiceQuestions: practiceFormatted,
      nextTopic,
      totalInBank: pool.length,
    });
  } catch (err) {
    console.error('[nano-teach] Error:', err.message);
    return res.status(500).json({ error: 'Failed to load teaching content' });
  }
}
