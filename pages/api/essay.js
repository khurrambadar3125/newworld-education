/**
 * pages/api/essay.js
 * Cambridge-style essay marking — O Level & A Level
 * 
 * POST { subject, level, question, essay, markScheme? }
 * → { totalScore, maxScore, grade, band, sections[], examinerVerdict, improvements[], modelOpener }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { subject, level, question, essay, markScheme } = req.body;
  if (!subject || !question || !essay)
    return res.status(400).json({ error: 'subject, question, and essay are required' });

  if (essay.trim().split(/\s+/).length < 20)
    return res.status(400).json({ error: 'Essay is too short to mark.' });

  const maxMarks = level === 'alevel' ? 20 : 15;

  const systemPrompt = `You are a senior Cambridge International Examinations examiner for ${subject} (${level === 'alevel' ? 'A Level' : 'O Level'}).
Mark essays exactly as Cambridge examiners do — by band descriptors, not impression.
If the student's essay is in Urdu, provide feedback in Urdu. If the essay is in English, respond in English.
You must return ONLY valid JSON matching the schema given. No preamble, no markdown, no extra text.`;

  const userPrompt = `Mark this student essay using Cambridge band descriptors.

Subject: ${subject}
Level: ${level === 'alevel' ? 'A Level' : 'O Level'}
Question: ${question}
${markScheme ? `Mark Scheme Hints: ${markScheme}\n` : ''}
Max marks: ${maxMarks}

STUDENT ESSAY:
"""
${essay.slice(0, 3000)}
"""

Return ONLY this JSON (no markdown, no text outside JSON):
{
  "totalScore": <number 0-${maxMarks}>,
  "maxScore": ${maxMarks},
  "grade": <"A*"|"A"|"B"|"C"|"D"|"E"|"U">,
  "band": <"Excellent"|"Good"|"Satisfactory"|"Weak"|"Poor">,
  "sections": [
    {
      "criterion": <e.g. "Knowledge & Understanding"|"Analysis"|"Evaluation"|"Communication">,
      "score": <number>,
      "maxScore": <number>,
      "feedback": <1-2 sentence examiner comment>
    }
  ],
  "examinerVerdict": <2-3 sentences as a Cambridge examiner would write on the script>,
  "improvements": [<3-5 specific actionable improvements, each max 20 words>],
  "modelOpener": <one model opening sentence the student could have used, 20-30 words>,
  "keywordsMissing": [<up to 5 Cambridge mark scheme keywords not used by the student>]
}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: /* PERMANENT: Haiku 3 only. Never change without Khurram's approval. */ 'claude-3-haiku-20240307',
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await response.json();
    const raw = data.content?.[0]?.text;
    if (!raw) return res.status(500).json({ error: 'No response from marking engine.' });

    const clean = raw.replace(/```json|```/g, '').trim();
    let result;
    try { result = JSON.parse(clean); } catch (parseErr) {
      console.error('essay.js JSON parse failed:', clean.slice(0, 200));
      return res.status(500).json({ error: 'Marking response was malformed. Please try again.' });
    }
    if (!result.totalScore && result.totalScore !== 0) {
      return res.status(500).json({ error: 'Incomplete marking response. Please try again.' });
    }
    return res.status(200).json(result);

  } catch (err) {
    console.error('essay.js error:', err);
    return res.status(500).json({ error: 'Marking failed. Please try again.' });
  }
}
