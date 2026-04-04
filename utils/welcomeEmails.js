/**
 * utils/welcomeEmails.js — Segmented welcome emails
 * ─────────────────────────────────────────────────────────────────
 * Three versions: parent, student, generic.
 * RULE: ONE email per day per user. No jargon. Straight to action.
 */

/**
 * Parent welcome — shows value for THEIR child
 * Emotional, outcome-focused. No technical jargon.
 */
export function parentWelcomeEmail({ name, childName, grade }) {
  const isYoung = ['KG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'].includes(grade);
  const isOLevel = grade?.includes('O Level') || grade?.includes('IGCSE');
  const isALevel = grade?.includes('A Level');

  const headline = isYoung
    ? `${childName || 'Your child'} can fall in love with learning`
    : isOLevel
    ? `${childName || 'Your child'} can get the grades they deserve`
    : isALevel
    ? `${childName || 'Your child'} has a personal A Level tutor now`
    : `${childName || 'Your child'} just got a world-class tutor`;

  const body = isYoung
    ? `Imagine ${childName || 'your child'} excited to learn — asking for "one more question" at bedtime. That's what happens when learning feels like play. Starky makes Maths feel like magic, Reading feel like adventure, and Science feel like discovery.`
    : isOLevel
    ? `Private tutors charge Rs 5,000-15,000 per hour. Your child now has access to something better — a tutor who has memorised every Cambridge past paper, every mark scheme, and every examiner's expectation. Available 24/7. On their phone.`
    : isALevel
    ? `A Level is hard. The right preparation makes the difference between an offer from a top university and a rejection. Your child now has a tutor that knows every past paper, every mark scheme pattern, and exactly what examiners want to see.`
    : `Every child learns differently. Some need more time. Some need a different explanation. Some just need someone who never gives up on them. That's Starky.`;

  const cta = isYoung
    ? { text: 'Let them try — it\'s free', url: 'https://www.newworld.education' }
    : { text: 'See what they can achieve', url: 'https://www.newworld.education/free-practice-test' };

  return `
<div style="background:#080C18;color:#fff;padding:40px 24px;font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="text-align:center;margin-bottom:24px">
    <div style="font-size:22px;font-weight:900">NewWorldEdu<span style="color:#4F8EF7">★</span></div>
  </div>

  <h1 style="font-size:24px;font-weight:800;text-align:center;margin:0 0 20px;line-height:1.4">${headline}</h1>

  <p style="color:#999;font-size:15px;line-height:1.9;text-align:center;margin:0 0 28px">${body}</p>

  <div style="text-align:center;margin:28px 0">
    <a href="${cta.url}" style="display:inline-block;background:#4F8EF7;color:#fff;padding:16px 36px;border-radius:12px;text-decoration:none;font-weight:800;font-size:16px">${cta.text} →</a>
  </div>

  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin:24px 0;text-align:center">
    <div style="color:#4F8EF7;font-size:13px;font-weight:700;margin-bottom:8px">WHAT YOUR CHILD GETS</div>
    <div style="color:#888;font-size:13px;line-height:2">
      ${isYoung ? '🌟 Fun questions that feel like games<br>🎤 Can speak to Starky in Urdu or English<br>📚 Every subject from Maths to Science<br>💜 Extra gentle support for children with learning differences'
        : '📚 47,000+ real exam questions with mark scheme answers<br>⚡ Practice drill, mock exams, daily challenges<br>🧭 Exam topic forecasting (what\'s likely to come next)<br>📊 Progress tracking — see exactly where they stand'}
    </div>
  </div>

  <div style="text-align:center;margin:20px 0">
    <div style="color:#555;font-size:11px;margin-bottom:8px">SHARE WITH OTHER PARENTS</div>
    <a href="https://wa.me/?text=${encodeURIComponent('I just found this amazing free AI tutor for my kids — 47,000+ exam questions! Check it out: https://www.newworld.education')}" style="display:inline-block;background:#25D366;color:#fff;padding:8px 16px;border-radius:100px;text-decoration:none;font-weight:700;font-size:12px;margin:3px">WhatsApp</a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.newworld.education" style="display:inline-block;background:#1877F2;color:#fff;padding:8px 16px;border-radius:100px;text-decoration:none;font-weight:700;font-size:12px;margin:3px">Facebook</a>
  </div>

  <div style="text-align:center;color:#444;font-size:10px;margin-top:24px;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px">
    NewWorld Education | <a href="https://www.newworld.education" style="color:#4F8EF7;text-decoration:none">newworld.education</a><br>
    <a href="https://www.newworld.education/terms" style="color:#444;text-decoration:none">Terms</a> · <a href="https://www.newworld.education/privacy" style="color:#444;text-decoration:none">Privacy</a>
  </div>
</div>`;
}

/**
 * Student welcome — straight to action, competitive, fun
 * No selling. Just give them something to do RIGHT NOW.
 */
export function studentWelcomeEmail({ name, grade, subject }) {
  return `
<div style="background:#080C18;color:#fff;padding:40px 24px;font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="text-align:center;margin-bottom:24px">
    <div style="font-size:22px;font-weight:900">NewWorldEdu<span style="color:#4F8EF7">★</span></div>
  </div>

  <h1 style="font-size:24px;font-weight:800;text-align:center;margin:0 0 12px">Hey${name ? ` ${name}` : ''}! 👋</h1>
  <p style="color:#999;font-size:16px;text-align:center;margin:0 0 28px">Your AI tutor is ready. Let's see what you've got.</p>

  <div style="text-align:center;margin:28px 0">
    <a href="https://www.newworld.education/daily-challenge" style="display:inline-block;background:#4F8EF7;color:#fff;padding:16px 36px;border-radius:12px;text-decoration:none;font-weight:800;font-size:16px">🏆 Take Today's Challenge</a>
  </div>

  <p style="color:#666;font-size:14px;text-align:center;margin:0 0 24px">5 questions. Same for everyone today. Share your score. Challenge your friends.</p>

  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;text-align:center">
    <div style="color:#888;font-size:13px;line-height:2">
      Also try: <a href="https://www.newworld.education/drill" style="color:#4F8EF7;text-decoration:none">Practice Drill</a> · <a href="https://www.newworld.education/mocks" style="color:#4F8EF7;text-decoration:none">Mock Exams</a> · <a href="https://www.newworld.education/exam-compass" style="color:#4F8EF7;text-decoration:none">Exam Compass</a>
    </div>
  </div>

  <div style="text-align:center;margin:20px 0">
    <div style="color:#555;font-size:11px;margin-bottom:8px">CHALLENGE YOUR FRIENDS</div>
    <a href="https://wa.me/?text=${encodeURIComponent('I just joined NewWorldEdu — free AI tutor! Take the daily challenge: https://www.newworld.education/daily-challenge')}" style="display:inline-block;background:#25D366;color:#fff;padding:8px 16px;border-radius:100px;text-decoration:none;font-weight:700;font-size:12px;margin:3px">WhatsApp</a>
    <a href="https://www.instagram.com" style="display:inline-block;background:linear-gradient(135deg,#833AB4,#FD1D1D,#F77737);color:#fff;padding:8px 16px;border-radius:100px;text-decoration:none;font-weight:700;font-size:12px;margin:3px">Instagram</a>
  </div>

  <div style="text-align:center;color:#444;font-size:10px;margin-top:24px;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px">
    NewWorld Education | <a href="https://www.newworld.education" style="color:#4F8EF7;text-decoration:none">newworld.education</a>
  </div>
</div>`;
}

/**
 * Generic welcome — when we don't know if parent or student
 * Defaults to action-oriented (student-style) with parent context
 */
export function genericWelcomeEmail({ name, grade }) {
  return `
<div style="background:#080C18;color:#fff;padding:40px 24px;font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="text-align:center;margin-bottom:24px">
    <div style="font-size:22px;font-weight:900">NewWorldEdu<span style="color:#4F8EF7">★</span></div>
  </div>

  <h1 style="font-size:24px;font-weight:800;text-align:center;margin:0 0 16px">Welcome to NewWorldEdu! 🎉</h1>
  <p style="color:#999;font-size:15px;text-align:center;line-height:1.8;margin:0 0 28px">
    47,000+ verified exam questions. Cambridge, Edexcel, SAT. Every answer from the official mark scheme. Available 24/7. Free to start.
  </p>

  <div style="text-align:center;margin:28px 0">
    <a href="https://www.newworld.education/daily-challenge" style="display:inline-block;background:#4F8EF7;color:#fff;padding:16px 36px;border-radius:12px;text-decoration:none;font-weight:800;font-size:16px">🏆 Try the Daily Challenge</a>
  </div>

  <div style="display:flex;gap:12px;margin:24px 0;text-align:center">
    <div style="flex:1;background:rgba(255,255,255,0.04);border-radius:10px;padding:16px">
      <div style="font-size:11px;color:#4F8EF7;font-weight:700;margin-bottom:4px">STUDENTS</div>
      <a href="https://www.newworld.education/drill" style="color:#fff;text-decoration:none;font-size:14px;font-weight:700">Start Practising →</a>
    </div>
    <div style="flex:1;background:rgba(255,255,255,0.04);border-radius:10px;padding:16px">
      <div style="font-size:11px;color:#4F8EF7;font-weight:700;margin-bottom:4px">PARENTS</div>
      <a href="https://www.newworld.education/parent" style="color:#fff;text-decoration:none;font-size:14px;font-weight:700">See Your Child's Progress →</a>
    </div>
  </div>

  <div style="text-align:center;margin:20px 0">
    <div style="color:#555;font-size:11px;margin-bottom:8px">TELL A FRIEND</div>
    <a href="https://wa.me/?text=${encodeURIComponent('Free AI tutor with 47,000+ exam questions! https://www.newworld.education')}" style="display:inline-block;background:#25D366;color:#fff;padding:8px 16px;border-radius:100px;text-decoration:none;font-weight:700;font-size:12px;margin:3px">WhatsApp</a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.newworld.education" style="display:inline-block;background:#1877F2;color:#fff;padding:8px 16px;border-radius:100px;text-decoration:none;font-weight:700;font-size:12px;margin:3px">Facebook</a>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://www.newworld.education" style="display:inline-block;background:#0A66C2;color:#fff;padding:8px 16px;border-radius:100px;text-decoration:none;font-weight:700;font-size:12px;margin:3px">LinkedIn</a>
  </div>

  <div style="text-align:center;color:#444;font-size:10px;margin-top:24px;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px">
    NewWorld Education | <a href="https://www.newworld.education" style="color:#4F8EF7;text-decoration:none">newworld.education</a><br>
    <a href="https://www.newworld.education/terms" style="color:#444;text-decoration:none">Terms</a> · <a href="https://www.newworld.education/privacy" style="color:#444;text-decoration:none">Privacy</a>
  </div>
</div>`;
}
