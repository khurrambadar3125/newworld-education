/**
 * pages/api/daily-challenge.js — Wordle-style Daily Challenge
 * ─────────────────────────────────────────────────────────────────
 * Same 5 questions for ALL users every day. Creates shared experience.
 * GET → returns today's 5 questions (same for everyone)
 * POST → submit answers, get score + shareable result string
 *
 * The viral mechanic: everyone answers the same questions.
 * "I got 4/5 today, can you beat me?" → WhatsApp → friend tries → subscribes
 */

import { getSupabase } from '../../utils/supabase';

// Generate a deterministic seed from today's date
function todaySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// Deterministic shuffle using seed (same questions for everyone on same day)
function seededShuffle(arr, seed) {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default async function handler(req, res) {
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'DB not configured' });

  const seed = todaySeed();
  const today = new Date().toISOString().split('T')[0];

  if (req.method === 'GET') {
    // Fetch a pool of MCQ questions and deterministically pick 5
    const { data: pool } = await supabase
      .from('question_bank')
      .select('id, question_text, type, options, topic, subject, difficulty')
      .eq('type', 'mcq')
      .eq('verified', true)
      .not('options', 'is', null)
      .limit(200);

    if (!pool?.length) return res.status(200).json({ questions: [], date: today });

    const shuffled = seededShuffle(pool, seed);
    const selected = shuffled.slice(0, 5).map(q => ({
      id: q.id,
      question: q.question_text,
      options: q.options,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
      // NO correct answer sent
    }));

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json({ questions: selected, date: today, total: 5 });
  }

  if (req.method === 'POST') {
    const { answers } = req.body; // [{ questionId, answer }]
    if (!answers?.length) return res.status(400).json({ error: 'No answers' });

    // Fetch correct answers for submitted questions
    const ids = answers.map(a => a.questionId).filter(Boolean);
    const { data: questions } = await supabase
      .from('question_bank')
      .select('id, correct_answer, subject')
      .in('id', ids);

    const correctMap = {};
    for (const q of (questions || [])) correctMap[q.id] = q.correct_answer;

    let correct = 0;
    const results = answers.map(a => {
      const isCorrect = a.answer?.trim().toUpperCase() === (correctMap[a.questionId] || '').trim().toUpperCase();
      if (isCorrect) correct++;
      return isCorrect;
    });

    // Build shareable string (Wordle-style)
    const emoji = results.map(r => r ? '🟩' : '🟥').join('');
    const shareText = `📚 NewWorldEdu Daily Challenge ${today}\n${emoji} ${correct}/5\n\nCan you beat me? Try free:`;
    const shareUrl = 'https://www.newworld.education/daily-challenge';

    return res.status(200).json({
      correct,
      total: 5,
      results,
      emoji,
      shareText,
      shareUrl,
      whatsappLink: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`,
      tweetLink: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    });
  }

  return res.status(405).json({ error: 'GET or POST only' });
}
