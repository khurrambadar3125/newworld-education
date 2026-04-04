// utils/dailyQuestionEmail.js
// Beautiful daily question email sent by Starky every morning

const wrap = (content) => `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#0a0a1a;margin:0;padding:20px;font-family:Arial,sans-serif">
<div style="max-width:580px;margin:0 auto">
<div style="text-align:center;padding:28px 20px;background:linear-gradient(135deg,#0d0d2b,#1a1a3e);border-radius:14px 14px 0 0;border-bottom:2px solid #6c63ff">
<div style="font-size:36px">★</div>
<div style="color:#6c63ff;font-size:20px;font-weight:700">NewWorld Education</div>
<div style="color:#8888aa;font-size:13px;margin-top:4px">Your daily question from Starky</div>
</div>
<div style="background:#111128;padding:28px 22px;border-radius:0 0 14px 14px">${content}</div>
<div style="text-align:center;padding:16px;color:#555570;font-size:12px">★ Starky from NewWorld Education | <a href="https://newworld.education" style="color:#6c63ff;text-decoration:none">newworld.education</a></div>
</div></body></html>`;

export function dailyQuestionEmail({
  studentName,
  grade,
  subject,
  question,
  options,       // object like { A: '...', B: '...', C: '...', D: '...' } or null for structured
  questionType,  // 'mcq' | 'structured'
  difficulty,
  answerUrl,     // link to answer + full session
  streakDays = 0,
}) {
  const firstName = studentName?.split(' ')[0] || 'there';
  const greetings = [
    `Good morning, ${firstName}! ☀️`,
    `Rise and shine, ${firstName}! 🌟`,
    `Today's challenge is here, ${firstName}! 🎯`,
    `Start strong today, ${firstName}! 🚀`,
    `Your brain needs this, ${firstName}! 🧠`,
  ];
  const greeting = greetings[new Date().getDay() % greetings.length];

  const difficultyLabel = difficulty === 'easy' ? '🌱 Foundation' : difficulty === 'hard' ? '🔥 Challenge' : '🎯 Exam level';

  const optionsHtml = options && questionType === 'mcq'
    ? Object.entries(options).map(([key, val]) => `
<div style="background:#1a1a3e;border:1px solid rgba(108,99,255,0.2);border-radius:10px;padding:12px 16px;margin-bottom:8px;display:flex;gap:12px;align-items:flex-start">
  <span style="color:#6c63ff;font-weight:800;min-width:20px">${key}.</span>
  <span style="color:#ccccdd;font-size:14px">${val}</span>
</div>`).join('')
    : `<div style="background:#1a1a3e;border:1px dashed rgba(255,255,255,0.1);border-radius:10px;padding:14px 16px;color:#8888aa;font-size:13px;font-style:italic">Write your answer in full sentences. Think about what the examiner wants to see.</div>`;

  const streakBadge = streakDays >= 2
    ? `<div style="display:inline-flex;align-items:center;gap:6px;background:rgba(251,146,60,0.15);border:1px solid rgba(251,146,60,0.3);border-radius:100px;padding:4px 12px;font-size:12px;font-weight:700;color:#fb923c;margin-bottom:16px">🔥 ${streakDays}-day streak — keep it going!</div>`
    : '';

  return wrap(`
${streakBadge}
<div style="color:#a78bfa;font-size:12px;font-weight:600;letter-spacing:2px;margin-bottom:8px">DAILY QUESTION</div>
<h1 style="color:#fff;font-size:20px;margin:0 0 4px;line-height:1.3">${greeting}</h1>
<div style="color:#8888aa;font-size:13px;margin-bottom:20px">${subject} · ${grade} · ${difficultyLabel}</div>

<div style="background:linear-gradient(135deg,rgba(79,142,247,0.1),rgba(99,102,241,0.1));border:1px solid rgba(79,142,247,0.3);border-radius:14px;padding:20px;margin-bottom:20px">
  <div style="color:#60a5fa;font-size:11px;font-weight:700;letter-spacing:1px;margin-bottom:10px">📋 TODAY'S QUESTION</div>
  <div style="color:#e0e0f0;font-size:15px;line-height:1.75">${question}</div>
</div>

${optionsHtml}

<div style="text-align:center;margin:24px 0">
  <a href="${answerUrl}" style="display:inline-block;background:linear-gradient(135deg,#6c63ff,#4F8EF7);color:#fff;padding:14px 32px;border-radius:100px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.02em">
    See Answer + Study with Starky →
  </a>
</div>

<div style="background:#0d1a2d;border:1px solid rgba(59,130,246,0.2);border-radius:10px;padding:14px 16px;margin-top:4px">
  <div style="color:#60a5fa;font-size:11px;font-weight:600;letter-spacing:1px;margin-bottom:4px">💡 WHY THIS QUESTION?</div>
  <div style="color:#8888aa;font-size:13px;line-height:1.6">Starky picked this based on your grade and subject. One question a day, done consistently, is worth more than three hours of cramming the night before an exam.</div>
</div>

<div style="text-align:center;margin:20px 0 8px">
  <div style="color:#555;font-size:11px;margin-bottom:10px">SHARE WITH FRIENDS</div>
  <div>
    <a href="https://wa.me/?text=${encodeURIComponent('📚 Daily study question from NewWorldEdu! Try it:\n\n' + question.slice(0, 100) + '...\n\nhttps://www.newworld.education/subscribe')}" style="display:inline-block;background:#25D366;color:#fff;padding:8px 14px;border-radius:100px;text-decoration:none;font-weight:700;font-size:11px;margin:3px">WhatsApp</a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.newworld.education/daily-challenge" style="display:inline-block;background:#1877F2;color:#fff;padding:8px 14px;border-radius:100px;text-decoration:none;font-weight:700;font-size:11px;margin:3px">Facebook</a>
    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent('📚 Free daily study questions! https://www.newworld.education/daily-challenge')}" style="display:inline-block;background:#1DA1F2;color:#fff;padding:8px 14px;border-radius:100px;text-decoration:none;font-weight:700;font-size:11px;margin:3px">X</a>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://www.newworld.education/daily-challenge" style="display:inline-block;background:#0A66C2;color:#fff;padding:8px 14px;border-radius:100px;text-decoration:none;font-weight:700;font-size:11px;margin:3px">LinkedIn</a>
  </div>
  <div style="margin-top:6px">
    <a href="https://www.newworld.education/daily-challenge" style="display:inline-block;background:linear-gradient(135deg,#833AB4,#FD1D1D,#F77737);color:#fff;padding:8px 14px;border-radius:100px;text-decoration:none;font-weight:700;font-size:11px;margin:3px">Instagram Story</a>
    <a href="https://www.newworld.education/subscribe" style="display:inline-block;background:#4F8EF7;color:#fff;padding:8px 14px;border-radius:100px;text-decoration:none;font-weight:700;font-size:11px;margin:3px">📬 Subscribe Free</a>
  </div>
</div>

<div style="text-align:center;color:#444;font-size:11px;margin-top:10px">
  Forward this email to a friend studying ${subject} — they'll thank you.<br>
  <a href="https://www.newworld.education/daily-challenge" style="color:#4F8EF7">🏆 Today's Daily Challenge</a> — same 5 questions for everyone!
</div>`);
}
