/**
 * /api/cron/predictive-analysis
 * Runs nightly at 11pm PKT. Analyses cross-student weakness patterns
 * and generates per-student predictions.
 */

import { getSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  const auth = req.headers.authorization;
  if (auth !== process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const sb = getSupabase();
  if (!sb) return res.status(500).json({ error: 'No Supabase' });

  try {
    // Step 1: Get all weaknesses grouped by student
    const { data: allWeaknesses } = await sb.from('cambridge_weaknesses')
      .select('student_id, subject, weakness_category')
      .eq('resolved', false);

    if (!allWeaknesses?.length) return res.status(200).json({ message: 'No weaknesses to analyse', patterns: 0 });

    // Step 2: Build co-occurrence matrix
    // Group weaknesses by student
    const studentWeaknesses = {};
    allWeaknesses.forEach(w => {
      const key = w.student_id;
      if (!studentWeaknesses[key]) studentWeaknesses[key] = [];
      studentWeaknesses[key].push(`${w.subject}:${w.weakness_category}`);
    });

    // Count co-occurrences
    const coOccurrence = {};
    Object.values(studentWeaknesses).forEach(weaknesses => {
      for (let i = 0; i < weaknesses.length; i++) {
        for (let j = 0; j < weaknesses.length; j++) {
          if (i === j) continue;
          const pair = `${weaknesses[i]}|${weaknesses[j]}`;
          coOccurrence[pair] = (coOccurrence[pair] || 0) + 1;
        }
      }
    });

    // Step 3: Find significant patterns (appearing in 2+ students)
    const totalStudents = Object.keys(studentWeaknesses).length;
    const patterns = [];

    // Count how many students have each weakness
    const weaknessCount = {};
    allWeaknesses.forEach(w => {
      const key = `${w.subject}:${w.weakness_category}`;
      const students = new Set();
      allWeaknesses.filter(x => x.subject === w.subject && x.weakness_category === w.weakness_category)
        .forEach(x => students.add(x.student_id));
      weaknessCount[key] = students.size;
    });

    Object.entries(coOccurrence).forEach(([pair, count]) => {
      if (count < 2) return; // Need at least 2 students
      const [primary, predicted] = pair.split('|');
      const [pSubject, pCategory] = primary.split(':');
      const [predSubject, predCategory] = predicted.split(':');
      const primaryCount = weaknessCount[primary] || 1;
      const rate = Math.round((count / primaryCount) * 100);

      if (rate >= 50) { // Only patterns with 50%+ co-occurrence
        patterns.push({
          subject: pSubject,
          primary_weakness: pCategory,
          predicted_weakness: predCategory,
          predicted_subject: predSubject,
          co_occurrence_rate: rate,
          sample_size: count,
          last_updated: new Date().toISOString(),
        });
      }
    });

    // Step 4: Save patterns to weakness_patterns table
    if (patterns.length) {
      // Clear old patterns
      await sb.from('weakness_patterns').delete().neq('id', 0).catch(() => {});
      // Insert new
      for (const p of patterns) {
        await sb.from('weakness_patterns').insert(p).catch(() => {});
      }
    }

    // Step 5: Generate per-student predictions
    let predictionsGenerated = 0;
    for (const [studentId, weaknesses] of Object.entries(studentWeaknesses)) {
      for (const pattern of patterns) {
        const hasP = weaknesses.includes(`${pattern.subject}:${pattern.primary_weakness}`);
        const hasPredicted = weaknesses.includes(`${pattern.predicted_subject || pattern.subject}:${pattern.predicted_weakness}`);

        if (hasP && !hasPredicted) {
          // Student has the primary but not the predicted — flag it
          const confidence = pattern.co_occurrence_rate >= 80 ? 'high' : pattern.co_occurrence_rate >= 60 ? 'medium' : 'low';
          await sb.from('student_predictions').insert({
            student_id: studentId,
            subject: pattern.predicted_subject || pattern.subject,
            predicted_weakness: pattern.predicted_weakness,
            prediction_confidence: confidence,
            based_on_weakness: pattern.primary_weakness,
            co_occurrence_rate: pattern.co_occurrence_rate,
            recommended_action: `Practise ${pattern.predicted_weakness.replace(/_/g, ' ')} — ${pattern.co_occurrence_rate}% of students with your profile lose marks here.`,
            created_at: new Date().toISOString(),
            actioned: false,
          }).catch(() => {});
          predictionsGenerated++;
        }
      }
    }

    return res.status(200).json({
      students_analysed: totalStudents,
      patterns_found: patterns.length,
      predictions_generated: predictionsGenerated,
      top_patterns: patterns.slice(0, 10),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
