/**
 * pages/api/cron/brain-update.js — Starky's Autonomous Intelligence Engine
 * ─────────────────────────────────────────────────────────────────
 * Runs daily. Mines the question bank + student performance data.
 * Builds "Starky Brain" — pattern intelligence stored in Vercel KV.
 * Makes Starky smarter every day from the data it has.
 *
 * Cron: daily at 2am PKT (21:00 UTC previous day)
 *
 * What it learns:
 * 1. Hardest topics per subject (from times_served vs times_correct)
 * 2. Most tested topics (from question frequency)
 * 3. Mark scheme patterns (common phrases in correct_answer)
 * 4. Topic connections (topics that appear in same session)
 * 5. Student struggle patterns (from student_progress table)
 */

import { getSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  const auth = req.headers['authorization'];
  if (auth !== `Bearer ${process.env.CRON_SECRET}` && auth !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  const brain = {};
  const timestamp = new Date().toISOString();

  try {
    // ── 1. HARDEST TOPICS per subject ──────────────────────────
    // Questions with high times_served but low times_correct = hard
    const { data: hardTopics } = await supabase
      .from('question_bank')
      .select('subject, topic, times_served, times_correct')
      .gt('times_served', 5)
      .order('times_served', { ascending: false })
      .limit(1000);

    if (hardTopics?.length) {
      const topicStats = {};
      for (const q of hardTopics) {
        const key = `${q.subject}|${q.topic}`;
        if (!topicStats[key]) topicStats[key] = { subject: q.subject, topic: q.topic, served: 0, correct: 0 };
        topicStats[key].served += q.times_served || 0;
        topicStats[key].correct += q.times_correct || 0;
      }

      // Find hardest per subject
      const bySubject = {};
      for (const stat of Object.values(topicStats)) {
        const accuracy = stat.served > 0 ? stat.correct / stat.served : 1;
        if (!bySubject[stat.subject]) bySubject[stat.subject] = [];
        bySubject[stat.subject].push({ topic: stat.topic, accuracy: Math.round(accuracy * 100), served: stat.served });
      }

      for (const [subject, topics] of Object.entries(bySubject)) {
        const sorted = topics.sort((a, b) => a.accuracy - b.accuracy);
        brain[`hard_topics:${subject}`] = sorted.slice(0, 5).map(t => `${t.topic} (${t.accuracy}% accuracy, ${t.served} attempts)`);
      }
    }

    // ── 2. MOST TESTED TOPICS (question frequency) ──────────────
    const { data: topicCounts } = await supabase
      .from('question_bank')
      .select('subject, topic')
      .eq('source', 'past_paper')
      .not('topic', 'is', null);

    if (topicCounts?.length) {
      const freq = {};
      for (const q of topicCounts) {
        const key = `${q.subject}|${q.topic}`;
        freq[key] = (freq[key] || 0) + 1;
      }

      const bySubject = {};
      for (const [key, count] of Object.entries(freq)) {
        const [subject, topic] = key.split('|');
        if (!bySubject[subject]) bySubject[subject] = [];
        bySubject[subject].push({ topic, count });
      }

      for (const [subject, topics] of Object.entries(bySubject)) {
        const sorted = topics.sort((a, b) => b.count - a.count);
        brain[`frequent_topics:${subject}`] = sorted.slice(0, 10).map(t => `${t.topic} (${t.count} questions)`);
      }
    }

    // ── 3. MARK SCHEME PATTERNS ──────────────────────────────────
    // Extract common phrases from correct answers
    const { data: markSchemes } = await supabase
      .from('question_bank')
      .select('subject, correct_answer, mark_scheme')
      .not('mark_scheme', 'is', null)
      .limit(500);

    if (markSchemes?.length) {
      const phrases = {};
      for (const q of markSchemes) {
        const text = (q.mark_scheme || q.correct_answer || '').toLowerCase();
        // Extract key phrases (2-4 word patterns)
        const words = text.split(/\s+/).filter(w => w.length > 3);
        for (let i = 0; i < words.length - 1; i++) {
          const bigram = `${words[i]} ${words[i + 1]}`;
          const key = `${q.subject}|${bigram}`;
          phrases[key] = (phrases[key] || 0) + 1;
        }
      }

      const bySubject = {};
      for (const [key, count] of Object.entries(phrases)) {
        if (count < 3) continue; // Only keep phrases that appear 3+ times
        const [subject, phrase] = key.split('|');
        if (!bySubject[subject]) bySubject[subject] = [];
        bySubject[subject].push({ phrase, count });
      }

      for (const [subject, items] of Object.entries(bySubject)) {
        const sorted = items.sort((a, b) => b.count - a.count);
        brain[`mark_scheme_phrases:${subject}`] = sorted.slice(0, 10).map(p => `"${p.phrase}" (${p.count}x)`);
      }
    }

    // ── 4. STUDENT STRUGGLE PATTERNS ──────────────────────────────
    const { data: struggles } = await supabase
      .from('student_progress')
      .select('subject, topic, correct')
      .eq('correct', false)
      .limit(1000);

    if (struggles?.length) {
      const wrongByTopic = {};
      for (const s of struggles) {
        const key = `${s.subject}|${s.topic}`;
        wrongByTopic[key] = (wrongByTopic[key] || 0) + 1;
      }

      const sorted = Object.entries(wrongByTopic)
        .map(([key, count]) => ({ key, count, subject: key.split('|')[0], topic: key.split('|')[1] }))
        .sort((a, b) => b.count - a.count);

      brain['student_struggles'] = sorted.slice(0, 20).map(s => `${s.subject}: ${s.topic} (${s.count} wrong answers)`);
    }

    // ── 5. BANK STATS ──────────────────────────────────────────────
    const { count: totalQuestions } = await supabase
      .from('question_bank')
      .select('id', { count: 'exact', head: true });

    const { count: totalDict } = await supabase
      .from('dictionary_bank')
      .select('id', { count: 'exact', head: true });

    brain['bank_stats'] = {
      questions: totalQuestions || 0,
      dictionary: totalDict || 0,
      combined: (totalQuestions || 0) + (totalDict || 0),
      lastUpdated: timestamp,
    };

    // ── SAVE TO VERCEL KV ──────────────────────────────────────────
    let kvSaved = 0;
    try {
      const { kv } = await import('@vercel/kv');
      for (const [key, value] of Object.entries(brain)) {
        await kv.set(`brain:${key}`, JSON.stringify(value));
        kvSaved++;
      }
      await kv.set('brain:last_update', timestamp);
    } catch (kvErr) {
      console.error('[brain-update] KV save failed:', kvErr.message);
    }

    return res.status(200).json({
      status: 'ok',
      timestamp,
      patternsFound: Object.keys(brain).length,
      kvSaved,
      summary: {
        hardTopicSubjects: Object.keys(brain).filter(k => k.startsWith('hard_topics:')).length,
        frequentTopicSubjects: Object.keys(brain).filter(k => k.startsWith('frequent_topics:')).length,
        markSchemePhraseSubjects: Object.keys(brain).filter(k => k.startsWith('mark_scheme_phrases:')).length,
        studentStruggles: brain['student_struggles']?.length || 0,
        bankStats: brain['bank_stats'],
      },
    });
  } catch (err) {
    console.error('[brain-update] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
