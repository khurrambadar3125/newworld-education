/**
 * /api/mocks/submit — Submit and mark a completed mock exam
 * Uses Claude Haiku to grade answers against Cambridge mark schemes
 */

import { getAnthropicClient } from '/../../utils/anthropicClient';
import { createClient } from '@supabase/supabase-js';
import { withErrorAlert } from '../../../utils/errorAlert';

const client = getAnthropicClient();
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SECRET_KEY || '');

// Cambridge grade boundaries (approximate)
const BOUNDARIES = {
  'O Level': { 'A*': 90, 'A': 80, 'B': 70, 'C': 60, 'D': 50, 'E': 40 },
  'A Level': { 'A*': 90, 'A': 80, 'B': 70, 'C': 60, 'D': 50, 'E': 40 },
};

function getGrade(percentage, level) {
  const bounds = BOUNDARIES[level] || BOUNDARIES['O Level'];
  for (const [grade, min] of Object.entries(bounds)) {
    if (percentage >= min) return grade;
  }
  return 'U';
}

export default withErrorAlert(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { email, subject, grade, answers, questions, duration } = req.body;
  if (!questions?.length || !answers) return res.status(400).json({ error: 'Questions and answers required' });

  try {
    // Grade MCQs automatically
    let totalScore = 0;
    let maxScore = 0;
    const feedback = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const studentAnswer = answers[i] || '';
      maxScore += q.marks || 1;

      if (q.type === 'mcq' && q.correctOption) {
        const correct = studentAnswer === q.correctOption || studentAnswer === q.options?.[['A','B','C','D'].indexOf(q.correctOption)];
        if (correct) totalScore += q.marks || 1;
        feedback.push({
          correct,
          marksAwarded: correct ? (q.marks || 1) : 0,
          marksAvailable: q.marks || 1,
          feedback: correct ? 'Correct.' : `The correct answer is ${q.correctOption}. ${q.markSchemeHint || ''}`,
          examinerTip: q.markSchemeHint || null,
        });
      } else {
        // Use Claude to grade structured answers
        try {
          const gradeResponse = await client.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 300,
            system: `You are a Cambridge ${grade || 'O Level'} examiner marking a ${subject} answer. Be strict but fair. Mark using this exact structure and return ONLY valid JSON.`,
            messages: [{
              role: 'user',
              content: `Question (${q.marks} marks): ${q.question}\nMark scheme hint: ${q.markSchemeHint || 'Use Cambridge standards'}\nStudent answer: ${studentAnswer || '(no answer)'}\n\nMark this answer with:\n1. COMMAND WORD CHECK: What command word was used? Did the student respond correctly to it?\n2. MARK SCHEME LANGUAGE: Did they use accepted Cambridge phrases or imprecise alternatives?\n3. EXAMINER REPORT: Any known examiner-flagged mistake for this topic?\n4. Each mark point: earned or missed, with the exact phrase that earns each missed mark.\n5. Model full-mark answer.\n\nReturn JSON: {"marksAwarded":0-${q.marks},"correct":true/false,"commandWordVerdict":"correct type|wrong type","feedback":"detailed marking with mark points","examinerTip":"specific examiner warning if applicable","modelAnswer":"full mark answer"}`
            }],
          });

          const gradeText = gradeResponse.content?.[0]?.text || '';
          const gradeJson = gradeText.match(/\{[\s\S]*\}/);
          if (gradeJson) {
            const result = JSON.parse(gradeJson[0]);
            totalScore += result.marksAwarded || 0;
            feedback.push({
              correct: result.correct || false,
              marksAwarded: result.marksAwarded || 0,
              marksAvailable: q.marks || 1,
              feedback: result.feedback || '',
              examinerTip: result.examinerTip || null,
              commandWordVerdict: result.commandWordVerdict || null,
              modelAnswer: result.modelAnswer || null,
            });
          } else {
            feedback.push({ correct: false, marksAwarded: 0, marksAvailable: q.marks || 1, feedback: 'Could not grade this answer.', examinerTip: null });
          }
        } catch {
          feedback.push({ correct: false, marksAwarded: 0, marksAvailable: q.marks || 1, feedback: 'Grading error — please review manually.', examinerTip: null });
        }
      }
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const predictedGrade = getGrade(percentage, grade || 'O Level');

    // Save result to Supabase (non-blocking)
    if (email) {
      supabase.from('starky_mocks').update({
        last_mock_subject: subject,
        last_mock_score: totalScore,
        last_mock_max: maxScore,
        last_mock_grade: predictedGrade,
        last_mock_date: new Date().toISOString(),
      }).eq('email', email.toLowerCase().trim()).then(() => {}).catch(() => {});
    }

    return res.status(200).json({
      score: totalScore,
      maxScore,
      percentage,
      grade: predictedGrade,
      feedback,
      duration: duration || 0,
      percentile: null, // Will be calculated once we have cohort data
    });
  } catch (err) {
    console.error('[mocks/submit] Error:', err.message);
    return res.status(500).json({ error: 'Failed to grade mock exam' });
  }
});
