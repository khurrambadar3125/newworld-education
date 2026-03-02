// utils/emailTemplates.js
const wrap = (content) => `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#0a0a1a;margin:0;padding:20px;font-family:Arial,sans-serif">
<div style="max-width:580px;margin:0 auto">
<div style="text-align:center;padding:28px 20px;background:linear-gradient(135deg,#0d0d2b,#1a1a3e);border-radius:14px 14px 0 0;border-bottom:2px solid #6c63ff">
<div style="font-size:36px">★</div>
<div style="color:#6c63ff;font-size:20px;font-weight:700">NewWorld Education</div>
<div style="color:#8888aa;font-size:13px;margin-top:4px">Every child deserves a world-class tutor</div>
</div>
<div style="background:#111128;padding:28px 22px;border-radius:0 0 14px 14px">${content}</div>
<div style="text-align:center;padding:16px;color:#555570;font-size:12px">★ Starky from NewWorld Education | newworld.education</div>
</div></body></html>`;

export function sessionReportEmail({ parentName, studentName, grade, subject, analysis, isSEN }) {
  return wrap(`
<div style="color:#4ade80;font-size:12px;font-weight:600;letter-spacing:2px;margin-bottom:6px">SESSION COMPLETE</div>
<h1 style="color:#fff;font-size:22px;margin:0 0 4px">${studentName}'s Learning Report</h1>
<div style="color:#8888aa;font-size:13px;margin-bottom:20px">${subject} · Grade ${grade}</div>
<div style="color:#ccccdd;font-size:14px;line-height:1.7;margin-bottom:20px">${analysis.parentSummary || `${studentName} had a great session on ${subject} today.`}</div>
<div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap">
  ${!isSEN ? `<div style="flex:1;min-width:90px;background:#1a1a3e;border-radius:10px;padding:14px;text-align:center"><div style="color:#6c63ff;font-size:24px;font-weight:700">${analysis.accuracyPercent || 75}%</div><div style="color:#8888aa;font-size:11px;margin-top:3px">Accuracy</div></div>` : ''}
  <div style="flex:1;min-width:90px;background:#1a1a3e;border-radius:10px;padding:14px;text-align:center"><div style="color:#6c63ff;font-size:24px;font-weight:700">${analysis.durationMinutes || analysis.focusDurationMinutes || 20}</div><div style="color:#8888aa;font-size:11px;margin-top:3px">Minutes</div></div>
  <div style="flex:1;min-width:90px;background:#1a1a3e;border-radius:10px;padding:14px;text-align:center"><div style="font-size:24px">${analysis.overallMood === 'positive' ? '🌟' : '📈'}</div><div style="color:#8888aa;font-size:11px;margin-top:3px">${analysis.overallMood || 'Good'}</div></div>
</div>
${(analysis.strengths||[]).length ? `<div style="background:#0d2d1a;border:1px solid #4ade8033;border-radius:10px;padding:16px;margin-bottom:12px"><div style="color:#4ade80;font-size:11px;font-weight:600;letter-spacing:1px;margin-bottom:8px">✅ WHAT ${studentName.toUpperCase()} DID WELL</div>${(analysis.strengths||[]).map(s=>`<div style="color:#ccccdd;font-size:13px;padding:3px 0">• ${s}</div>`).join('')}</div>` : ''}
${(analysis.weakAreas||analysis.supportsNeeded||[]).length ? `<div style="background:#2d1a0d;border:1px solid #fbbf2433;border-radius:10px;padding:16px;margin-bottom:12px"><div style="color:#fbbf24;font-size:11px;font-weight:600;letter-spacing:1px;margin-bottom:8px">🎯 AREAS TO STRENGTHEN</div>${(analysis.weakAreas||analysis.supportsNeeded||[]).map(w=>`<div style="color:#ccccdd;font-size:13px;padding:3px 0">• ${w}</div>`).join('')}</div>` : ''}
<div style="background:linear-gradient(135deg,#1a1a3e,#2a1a4e);border-radius:10px;padding:18px;margin-bottom:16px;border-left:3px solid #6c63ff">
  <div style="color:#6c63ff;font-size:11px;font-weight:600;letter-spacing:1px;margin-bottom:8px">★ STARKY'S MESSAGE TO ${studentName.toUpperCase()}</div>
  <div style="color:#e0e0f0;font-size:14px;font-style:italic;line-height:1.6">"${analysis.starkyPersonalMessage || `You did great today, ${studentName}! Keep going. ★`}"</div>
</div>
<div style="background:#0d1a2d;border:1px solid #3b82f633;border-radius:10px;padding:16px">
  <div style="color:#60a5fa;font-size:11px;font-weight:600;letter-spacing:1px;margin-bottom:6px">💡 PARENT TIP</div>
  <div style="color:#ccccdd;font-size:13px;line-height:1.6">Instead of "How much did you study?", try: <strong style="color:#fff">"What was the most interesting thing Starky taught you today?"</strong></div>
</div>`);
}

export function weeklyStudyPlanEmail({ parentName, studentName, grade, plan }) {
  const daysHtml = (plan.days||[]).map(day => `
<div style="margin-bottom:14px">
  <div style="color:#6c63ff;font-size:12px;font-weight:700;letter-spacing:1px;margin-bottom:6px">${day.day.toUpperCase()}</div>
  ${(day.sessions||[]).map(s => `<div style="background:#1a1a3e;border-radius:8px;padding:12px;margin-bottom:6px">
    <div style="color:#fff;font-size:14px;font-weight:600">${s.subject} <span style="color:#6c63ff;font-size:12px;background:#6c63ff22;padding:2px 8px;border-radius:10px;margin-left:6px">${s.duration}</span></div>
    <div style="color:#a0a0cc;font-size:12px;margin-top:4px">📖 ${s.topic}</div>
    <div style="color:#8888aa;font-size:12px;margin-top:2px">💡 ${s.tip}</div>
  </div>`).join('')}
</div>`).join('');

  return wrap(`
<div style="color:#a78bfa;font-size:12px;font-weight:600;letter-spacing:2px;margin-bottom:6px">WEEKLY STUDY PLAN</div>
<h1 style="color:#fff;font-size:22px;margin:0 0 4px">${studentName}'s Week</h1>
<div style="color:#8888aa;font-size:13px;margin-bottom:20px">Grade ${grade} · ${plan.weekOf || ''}</div>
<div style="background:#1a2a1a;border:1px solid #4ade8033;border-radius:10px;padding:16px;margin-bottom:20px">
  <div style="color:#4ade80;font-size:11px;font-weight:600;letter-spacing:1px;margin-bottom:6px">🎯 THIS WEEK'S GOAL</div>
  <div style="color:#e0e0f0;font-size:14px">${plan.weeklyGoal || 'Build consistency and confidence'}</div>
</div>
${daysHtml}
<div style="background:#0d1a2d;border:1px solid #3b82f633;border-radius:10px;padding:16px;margin-top:8px">
  <div style="color:#60a5fa;font-size:11px;font-weight:600;letter-spacing:1px;margin-bottom:6px">💡 PARENT TIP THIS WEEK</div>
  <div style="color:#ccccdd;font-size:13px;line-height:1.6">${plan.parentTip || 'Consistency matters more than duration. 20 focused minutes beats 2 distracted hours.'}</div>
</div>`);
}

export function missedSessionEmail({ parentName, studentName, grade, hoursMissed, lastSubject }) {
  return wrap(`
<div style="color:#fbbf24;font-size:12px;font-weight:600;letter-spacing:2px;margin-bottom:6px">GENTLE REMINDER</div>
<h1 style="color:#fff;font-size:22px;margin:0 0 16px">We miss ${studentName}! ★</h1>
<div style="color:#ccccdd;font-size:14px;line-height:1.7;margin-bottom:20px">It's been ${Math.round(hoursMissed/24)} day(s) since ${studentName} last studied with Starky${lastSubject ? ` (${lastSubject})` : ''}. Life gets busy — totally understandable!</div>
<div style="background:linear-gradient(135deg,#1a1a3e,#2a2a5e);border-radius:12px;padding:22px;margin-bottom:20px;text-align:center">
  <div style="font-size:44px;margin-bottom:10px">★</div>
  <div style="color:#a78bfa;font-size:15px;font-weight:600">Starky is ready when ${studentName} is</div>
  <div style="color:#8888aa;font-size:13px;margin-top:4px">No pressure. No judgment. Just learning.</div>
</div>
<div style="text-align:center">
  <a href="https://newworld.education/demo" style="background:#6c63ff;color:#fff;padding:13px 28px;border-radius:22px;text-decoration:none;font-weight:600;font-size:14px">Continue Learning with Starky →</a>
</div>`);
}

export function examCountdownEmail({ parentName, studentName, grade, subject, daysToExam, examDate }) {
  const color = daysToExam <= 7 ? '#f87171' : daysToExam <= 14 ? '#fbbf24' : '#6c63ff';
  const tip = daysToExam <= 7 ? 'The night before: light review only. A calm child retains more than an anxious one. Trust the preparation.' : daysToExam <= 14 ? 'Ensure good sleep (8+ hours). Sleep consolidates memory more than late-night cramming.' : "At this stage, maintain routine. Don't increase pressure — anxiety blocks recall.";
  return wrap(`
<div style="color:${color};font-size:12px;font-weight:600;letter-spacing:2px;margin-bottom:6px">EXAM COUNTDOWN</div>
<h1 style="color:#fff;font-size:22px;margin:0 0 4px">${daysToExam} Days to ${subject} Exam</h1>
<div style="color:#8888aa;font-size:13px;margin-bottom:20px">${studentName} · Grade ${grade} · ${examDate}</div>
<div style="background:#2a0d0d;border:1px solid ${color}44;border-radius:12px;padding:22px;margin-bottom:20px;text-align:center">
  <div style="color:${color};font-size:56px;font-weight:700;line-height:1">${daysToExam}</div>
  <div style="color:#8888aa;font-size:14px;margin-top:4px">days remaining</div>
</div>
<div style="background:#0d1a0d;border:1px solid #4ade8033;border-radius:10px;padding:16px">
  <div style="color:#4ade80;font-size:11px;font-weight:600;letter-spacing:1px;margin-bottom:6px">💡 YOUR ROLE AS A PARENT RIGHT NOW</div>
  <div style="color:#ccccdd;font-size:13px;line-height:1.6">${tip}</div>
</div>`);
}

export function monthlyProgressEmail({ parentName, studentName, grade, progress, sessionCount }) {
  return wrap(`
<div style="color:#fbbf24;font-size:12px;font-weight:600;letter-spacing:2px;margin-bottom:6px">MONTHLY PROGRESS REPORT</div>
<h1 style="color:#fff;font-size:22px;margin:0 0 4px">${studentName}'s Monthly Report</h1>
<div style="color:#8888aa;font-size:13px;margin-bottom:20px">Grade ${grade} · ${new Date().toLocaleString('default',{month:'long',year:'numeric'})}</div>
<div style="background:linear-gradient(135deg,#1a1a3e,#2a1a4e);border-radius:12px;padding:18px;margin-bottom:20px;text-align:center">
  <div style="color:#a78bfa;font-size:12px;margin-bottom:6px">THIS MONTH IN ONE LINE</div>
  <div style="color:#fff;font-size:16px;font-weight:600">"${progress.headline || `${studentName} had a great month of learning!`}"</div>
</div>
<div style="display:flex;gap:10px;margin-bottom:20px">
  <div style="flex:1;background:#1a1a3e;border-radius:10px;padding:14px;text-align:center"><div style="color:#6c63ff;font-size:24px;font-weight:700">${sessionCount}</div><div style="color:#8888aa;font-size:11px;margin-top:3px">Sessions</div></div>
  <div style="flex:1;background:#1a1a3e;border-radius:10px;padding:14px;text-align:center"><div style="font-size:24px">🏆</div><div style="color:#8888aa;font-size:11px;margin-top:3px">${progress.certificateEarned || 'Achiever'}</div></div>
</div>
${(progress.keyAchievements||[]).length ? `<div style="background:#0d2d1a;border:1px solid #4ade8033;border-radius:10px;padding:16px;margin-bottom:12px"><div style="color:#4ade80;font-size:11px;font-weight:600;letter-spacing:1px;margin-bottom:8px">🌟 KEY ACHIEVEMENTS</div>${(progress.keyAchievements||[]).map(a=>`<div style="color:#ccccdd;font-size:13px;padding:3px 0">★ ${a}</div>`).join('')}</div>` : ''}
<div style="background:#0d1a2d;border:1px solid #3b82f633;border-radius:10px;padding:16px">
  <div style="color:#60a5fa;font-size:11px;font-weight:600;letter-spacing:1px;margin-bottom:6px">💡 NEXT MONTH: PARENT FOCUS</div>
  <div style="color:#ccccdd;font-size:13px;line-height:1.6">${progress.parentCoachingTip || 'Celebrate the habit of showing up to learn — consistency is the most important skill.'}</div>
</div>`);
}
