/**
 * Sends a notification to a parent about their child's activity.
 * Used by: drill results, essay results, or any student-initiated share.
 */
import { notify } from '../../utils/notify';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { parentEmail, studentName, type, subject, score, total, weakAreas, grade } = req.body;
  if (!parentEmail || !type) return res.status(400).json({ error: 'parentEmail and type required' });

  try {
    if (type === 'drill') {
      const pct = total > 0 ? Math.round((score / total) * 100) : 0;
      const weak = weakAreas?.length ? `<br><br><strong>Needs practice:</strong> ${weakAreas.join(', ')}` : '';
      await notify({
        to: parentEmail,
        subject: `📊 ${studentName || 'Your child'} completed a ${subject} drill — ${pct}%`,
        title: `${subject} Drill Complete`,
        body: `<strong>${studentName || 'Your child'}</strong> just finished a practice drill.<br><br>
          <div style="display:flex;gap:12px">
            <div style="background:rgba(74,222,128,0.15);border:1px solid rgba(74,222,128,0.3);border-radius:12px;padding:16px;text-align:center;flex:1">
              <div style="font-size:28px;font-weight:800;color:#4ADE80">${pct}%</div>
              <div style="font-size:12px;color:#888">Score</div>
            </div>
            <div style="background:rgba(79,142,247,0.15);border:1px solid rgba(79,142,247,0.3);border-radius:12px;padding:16px;text-align:center;flex:1">
              <div style="font-size:28px;font-weight:800;color:#4F8EF7">${score}/${total}</div>
              <div style="font-size:12px;color:#888">Questions</div>
            </div>
          </div>${weak}`,
        ctaText: 'View Progress →',
        ctaUrl: 'https://www.newworld.education/parent',
      });
    } else if (type === 'essay') {
      await notify({
        to: parentEmail,
        subject: `✍️ ${studentName || 'Your child'} got ${grade} on their ${subject} essay`,
        title: `${subject} Essay Marked`,
        body: `<strong>${studentName || 'Your child'}</strong> submitted a ${subject} essay and received grade <strong style="color:#4ADE80">${grade}</strong>.`,
        ctaText: 'View Progress →',
        ctaUrl: 'https://www.newworld.education/parent',
      });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
