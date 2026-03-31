/**
 * pages/api/weekly-progress.js
 * ─────────────────────────────────────────────────────
 * Weekly Nano progress email — sends every Sunday 8am PKT (3am UTC).
 * Queries Supabase atom_mastery, calculates per-student stats,
 * sends personalised email via Resend.
 *
 * ?test=true — sends only to khurram@newworld.education
 * ─────────────────────────────────────────────────────
 */

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { ATOMS_SUBJECTS, ATOM_COUNTS, getAtomsBySubject } from '../../utils/starkyAtomsKB';
import { withErrorAlert } from '../../utils/errorAlert';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || ''
);

// Cambridge May/June 2026 Zone 4 start
const EXAM_DATE = new Date('2026-04-27T00:00:00+05:00');

function isAuthorised(req) {
  const auth = req.headers['authorization'];
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

function daysUntilExams() {
  const now = new Date();
  const diff = EXAM_DATE - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function firstName(nameOrEmail) {
  if (!nameOrEmail) return 'there';
  if (nameOrEmail.includes('@')) return nameOrEmail.split('@')[0];
  return nameOrEmail.split(' ')[0];
}

function getMotivationalMessage(goalsThisWeek, daysLeft) {
  if (goalsThisWeek === 0) {
    return `No goals this week — and exams are ${daysLeft} days away. Even one goal today makes a difference. Start with 8 minutes.`;
  }
  if (goalsThisWeek < 5) {
    return `Good start this week. Students who master 5+ goals per week improve by one full grade before exam day. You're ${5 - goalsThisWeek} goal${5 - goalsThisWeek !== 1 ? 's' : ''} away from that pace.`;
  }
  return `Outstanding week. You're in the top tier of Nano students. Keep this pace and you will enter the exam room knowing more than you think.`;
}

function findNextRecommendedGoal(masteryMap, mostStudiedSubjectId) {
  // Try most-studied subject first, then all subjects
  const order = mostStudiedSubjectId
    ? [mostStudiedSubjectId, ...ATOMS_SUBJECTS.map(s => s.id).filter(id => id !== mostStudiedSubjectId)]
    : ATOMS_SUBJECTS.map(s => s.id);

  for (const subjectId of order) {
    const atoms = getAtomsBySubject(subjectId);
    // High weight first
    const highWeight = atoms.filter(a => a.examWeight === 'high' && !masteryMap[a.id]);
    if (highWeight.length) {
      const subject = ATOMS_SUBJECTS.find(s => s.id === subjectId);
      return { goal: highWeight[0], subject };
    }
  }
  // Fall back to any unmastered goal
  for (const subjectId of order) {
    const atoms = getAtomsBySubject(subjectId);
    const unmastered = atoms.find(a => !masteryMap[a.id]);
    if (unmastered) {
      const subject = ATOMS_SUBJECTS.find(s => s.id === subjectId);
      return { goal: unmastered, subject };
    }
  }
  return null;
}

// ─── Email HTML builder ─────────────────────────────────────────────────────

function buildStudentEmail({ name, goalsThisWeek, totalMastered, totalGoals, strongestSubject, weakestSubject, daysLeft, projectedGoals, recommended, motivational }) {
  const bgColor = '#0A1628';
  const gold = '#C9A84C';
  const white = '#FAF6EB';
  const dimWhite = 'rgba(250,246,235,0.6)';
  const cardBg = '#111D33';
  const nanoUrl = 'https://www.newworld.education/nano';
  const recommendedUrl = recommended
    ? `https://www.newworld.education/nano?autostart=${encodeURIComponent(recommended.goal.id)}&subject=${encodeURIComponent(recommended.subject?.label || '')}`
    : nanoUrl;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Your Nano Week</title></head>
<body style="margin:0;padding:0;background:${bgColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;">

<!-- Header -->
<div style="text-align:center;padding:24px 0 20px;border-bottom:1px solid rgba(250,246,235,0.08);">
  <span style="font-size:18px;font-weight:900;color:${white};">NewWorldEdu</span>
  <span style="color:${gold};margin-left:6px;">&#9733;</span>
  <span style="display:block;font-size:11px;color:${gold};font-weight:700;letter-spacing:0.1em;margin-top:6px;">STARKY NANO PROGRESS</span>
</div>

<!-- Greeting -->
<div style="padding:28px 0 8px;">
  <div style="font-size:18px;font-weight:700;color:${white};">Hi ${firstName(name)},</div>
  <div style="font-size:14px;color:${dimWhite};margin-top:8px;line-height:1.6;">Here is your Nano progress this week.</div>
</div>

<!-- This Week Card -->
<div style="background:${cardBg};border:1px solid rgba(201,168,76,0.15);border-radius:16px;padding:24px;margin:16px 0;">
  <div style="font-size:10px;font-weight:800;color:${gold};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px;">This Week</div>
  <div style="font-size:32px;font-weight:900;color:${gold};">&#9883;&#65039; ${goalsThisWeek}</div>
  <div style="font-size:13px;color:${dimWhite};margin-bottom:12px;">goal${goalsThisWeek !== 1 ? 's' : ''} mastered</div>
  ${strongestSubject ? `<div style="font-size:13px;color:${white};margin-bottom:4px;">&#128218; Strongest: <strong>${strongestSubject}</strong></div>` : ''}
  ${weakestSubject ? `<div style="font-size:13px;color:${white};">&#9888;&#65039; Needs work: <strong>${weakestSubject}</strong></div>` : ''}
  <div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(250,246,235,0.06);">
    <div style="font-size:10px;font-weight:800;color:rgba(250,246,235,0.35);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Total Journey</div>
    <div style="font-size:15px;font-weight:700;color:${white};">${totalMastered} of ${totalGoals} goals mastered</div>
    <div style="font-size:12px;color:${dimWhite};">across all Cambridge subjects</div>
  </div>
</div>

<!-- Exam Countdown Card -->
<div style="background:${cardBg};border:1px solid rgba(201,168,76,0.15);border-radius:16px;padding:24px;margin:16px 0;">
  <div style="font-size:10px;font-weight:800;color:${gold};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">&#9200; Exam Countdown</div>
  <div style="font-size:28px;font-weight:900;color:${white};">${daysLeft} days</div>
  <div style="font-size:13px;color:${dimWhite};margin-bottom:8px;">until Cambridge exams begin (April 27)</div>
  ${projectedGoals > 0 ? `<div style="font-size:13px;color:${gold};">At your current pace you will master ~${projectedGoals} more goals before exam day.</div>` : ''}
</div>

<!-- Recommended Goal Card -->
${recommended ? `
<div style="background:${cardBg};border:1px solid rgba(201,168,76,0.15);border-radius:16px;padding:24px;margin:16px 0;">
  <div style="font-size:10px;font-weight:800;color:${gold};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">&#127919; Tomorrow's Recommended Goal</div>
  <div style="font-size:12px;font-weight:700;color:${gold};margin-bottom:6px;">${recommended.subject?.icon || ''} ${recommended.subject?.label || ''} — ${recommended.goal.unit || ''}</div>
  <div style="font-size:14px;font-weight:600;color:${white};line-height:1.55;margin-bottom:10px;">"${recommended.goal.atom}"</div>
  <div style="font-size:11px;color:${dimWhite};margin-bottom:14px;">${recommended.goal.examWeight === 'high' ? 'HIGH EXAM WEIGHT' : 'MEDIUM EXAM WEIGHT'} &middot; Estimated time: 8 minutes</div>
  <a href="${recommendedUrl}" style="display:inline-block;background:${gold};color:${bgColor};font-size:14px;font-weight:800;text-decoration:none;padding:12px 28px;border-radius:10px;">Start this goal with Starky &rarr;</a>
</div>
` : ''}

<!-- Motivational Message -->
<div style="padding:20px 0;font-size:14px;color:${dimWhite};line-height:1.7;font-style:italic;">
  ${motivational}
</div>

<!-- CTA Button -->
<div style="text-align:center;padding:16px 0 24px;">
  <a href="${nanoUrl}" style="display:inline-block;background:${gold};color:${bgColor};font-size:16px;font-weight:800;text-decoration:none;padding:14px 36px;border-radius:12px;">Open Starky Nano &rarr;</a>
</div>

<!-- Footer -->
<div style="text-align:center;padding:20px 0;border-top:1px solid rgba(250,246,235,0.06);">
  <a href="https://www.newworld.education" style="font-size:12px;color:${dimWhite};text-decoration:none;">newworld.education</a>
  <span style="color:rgba(250,246,235,0.2);margin:0 8px;">&middot;</span>
  <a href="https://www.newworld.education/subscribe?unsubscribe=true" style="font-size:12px;color:rgba(250,246,235,0.3);text-decoration:none;">Unsubscribe</a>
</div>

</div>
</body></html>`;
}

function buildParentEmail({ childName, goalsThisWeek, totalMastered, totalGoals, subjectCount, daysLeft }) {
  const bgColor = '#0A1628';
  const gold = '#C9A84C';
  const white = '#FAF6EB';
  const dimWhite = 'rgba(250,246,235,0.6)';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${childName}'s Nano Progress</title></head>
<body style="margin:0;padding:0;background:${bgColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;">

<div style="text-align:center;padding:24px 0 20px;border-bottom:1px solid rgba(250,246,235,0.08);">
  <span style="font-size:18px;font-weight:900;color:${white};">NewWorldEdu</span>
  <span style="color:${gold};margin-left:6px;">&#9733;</span>
</div>

<div style="padding:28px 0 20px;font-size:15px;color:${white};line-height:1.8;">
  <p style="margin:0 0 16px;"><strong>${childName}</strong> mastered <strong style="color:${gold};">${goalsThisWeek} Cambridge goal${goalsThisWeek !== 1 ? 's' : ''}</strong> this week using Starky Nano.</p>
  <p style="margin:0 0 16px;color:${dimWhite};">Total progress: <strong style="color:${white};">${totalMastered} of ${totalGoals}</strong> goals mastered across ${subjectCount} subject${subjectCount !== 1 ? 's' : ''}.</p>
  <p style="margin:0 0 16px;color:${dimWhite};">Exams begin in <strong style="color:${gold};">${daysLeft} days</strong>.</p>
</div>

<div style="text-align:center;padding:16px 0 24px;">
  <a href="https://www.newworld.education/our-results" style="display:inline-block;background:${gold};color:${bgColor};font-size:14px;font-weight:800;text-decoration:none;padding:12px 28px;border-radius:10px;">View Full Progress &rarr;</a>
</div>

<div style="text-align:center;padding:20px 0;border-top:1px solid rgba(250,246,235,0.06);">
  <a href="https://www.newworld.education" style="font-size:12px;color:${dimWhite};text-decoration:none;">newworld.education</a>
</div>

</div>
</body></html>`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default withErrorAlert(async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });
  const isTest = req.query.test === 'true';
  if (!isTest && !isAuthorised(req)) return res.status(401).json({ error: 'Unauthorised' });
  const testEmail = 'khurram@newworld.education';

  try {
    // 1. Get all students with mastery records
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const daysLeft = daysUntilExams();
    const totalGoals = ATOM_COUNTS.total;

    // Get distinct student IDs from atom_mastery
    const { data: allRecords, error: fetchErr } = await supabase
      .from('atom_mastery')
      .select('student_id, atom_id, mastery_score, last_seen');

    if (fetchErr) {
      console.error('[weekly-progress] Supabase error:', fetchErr.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!allRecords?.length) {
      return res.status(200).json({ sent: 0, message: 'No students with mastery records' });
    }

    // Group records by student
    const studentMap = {};
    allRecords.forEach(r => {
      if (!studentMap[r.student_id]) studentMap[r.student_id] = [];
      studentMap[r.student_id].push(r);
    });

    const studentIds = isTest ? [testEmail] : Object.keys(studentMap);
    let sent = 0;
    let parentSent = 0;
    const errors = [];

    for (const studentId of studentIds) {
      try {
        const records = studentMap[studentId] || [];
        if (!records.length && !isTest) continue;

        // Build mastery map
        const masteryMap = {};
        records.forEach(r => {
          if (r.mastery_score >= 7) masteryMap[r.atom_id] = r;
        });

        // a. Goals mastered this week
        const goalsThisWeek = records.filter(r =>
          r.mastery_score >= 7 && r.last_seen >= weekAgo
        ).length;

        // b. Total mastered
        const totalMastered = Object.keys(masteryMap).length;

        // c. Strongest subject this week
        const weekSubjectCounts = {};
        records.filter(r => r.mastery_score >= 7 && r.last_seen >= weekAgo).forEach(r => {
          for (const s of ATOMS_SUBJECTS) {
            const sa = getAtomsBySubject(s.id);
            if (sa.some(a => a.id === r.atom_id)) {
              weekSubjectCounts[s.label] = (weekSubjectCounts[s.label] || 0) + 1;
              break;
            }
          }
        });
        let strongestSubject = null;
        let strongestCount = 0;
        Object.entries(weekSubjectCounts).forEach(([label, count]) => {
          if (count > strongestCount) { strongestCount = count; strongestSubject = label; }
        });

        // d. Weakest subject (started but not completed)
        const weakSubjectCounts = {};
        records.filter(r => r.mastery_score >= 1 && r.mastery_score < 7).forEach(r => {
          for (const s of ATOMS_SUBJECTS) {
            const sa = getAtomsBySubject(s.id);
            if (sa.some(a => a.id === r.atom_id)) {
              weakSubjectCounts[s.label] = (weakSubjectCounts[s.label] || 0) + 1;
              break;
            }
          }
        });
        let weakestSubject = null;
        let weakestCount = 0;
        Object.entries(weakSubjectCounts).forEach(([label, count]) => {
          if (count > weakestCount) { weakestCount = count; weakestSubject = label; }
        });

        // e. Projected goals at current pace
        const weeksLeft = Math.max(1, Math.ceil(daysLeft / 7));
        const projectedGoals = goalsThisWeek * weeksLeft;

        // f. Most-studied subject
        const allSubjectCounts = {};
        records.filter(r => r.mastery_score >= 7).forEach(r => {
          for (const s of ATOMS_SUBJECTS) {
            if (getAtomsBySubject(s.id).some(a => a.id === r.atom_id)) {
              allSubjectCounts[s.id] = (allSubjectCounts[s.id] || 0) + 1;
              break;
            }
          }
        });
        let mostStudiedId = null;
        let mostStudiedCount = 0;
        Object.entries(allSubjectCounts).forEach(([id, count]) => {
          if (count > mostStudiedCount) { mostStudiedCount = count; mostStudiedId = id; }
        });

        const recommended = findNextRecommendedGoal(masteryMap, mostStudiedId);
        const motivational = getMotivationalMessage(goalsThisWeek, daysLeft);

        // Get student name from profiles
        let studentName = studentId;
        let parentEmail = null;
        try {
          const { data: profile } = await supabase
            .from('student_preferences')
            .select('preferred_name, parent_email')
            .eq('email', studentId)
            .limit(1);
          if (profile?.[0]?.preferred_name) studentName = profile[0].preferred_name;
          if (profile?.[0]?.parent_email) parentEmail = profile[0].parent_email;
        } catch {}

        // Count subjects with mastery
        const subjectCount = Object.keys(allSubjectCounts).length || 1;

        // Send student email
        const html = buildStudentEmail({
          name: studentName,
          goalsThisWeek,
          totalMastered,
          totalGoals,
          strongestSubject,
          weakestSubject,
          daysLeft,
          projectedGoals,
          recommended,
          motivational,
        });

        await resend.emails.send({
          from: 'Starky ★ <hello@newworld.education>',
          to: isTest ? testEmail : studentId,
          subject: `⚛️ Your Nano week — ${goalsThisWeek} goal${goalsThisWeek !== 1 ? 's' : ''} mastered`,
          html,
        });
        sent++;

        // Send parent email if available
        if (parentEmail && !isTest) {
          const parentHtml = buildParentEmail({
            childName: firstName(studentName),
            goalsThisWeek,
            totalMastered,
            totalGoals,
            subjectCount,
            daysLeft,
          });

          const weekOf = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
          await resend.emails.send({
            from: 'Starky ★ <hello@newworld.education>',
            to: parentEmail,
            subject: `${firstName(studentName)}'s Starky Nano — week of ${weekOf}`,
            html: parentHtml,
          });
          parentSent++;
        }
      } catch (err) {
        console.error(`[weekly-progress] Error for ${studentId}:`, err.message);
        errors.push({ student: studentId, error: err.message });
      }
    }

    console.log(`[weekly-progress] Sent ${sent} student emails, ${parentSent} parent emails. Errors: ${errors.length}`);
    return res.status(200).json({
      sent,
      parentSent,
      errors: errors.length,
      test: isTest,
    });

  } catch (err) {
    console.error('[weekly-progress] Fatal error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});
