/**
 * utils/practiceKB.js
 * The Complete Science and Philosophy of Practice
 *
 * Applies to every subject, every student, every condition, every country.
 * Every great who ever lived became great the same way: deliberate practice.
 *
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// THE SCIENCE OF DELIBERATE PRACTICE
// ═══════════════════════════════════════════════════════════════════════════════

export const DELIBERATE_PRACTICE_SCIENCE = {
  tenThousandHourTruth: {
    popular: 'Malcolm Gladwell popularised: 10,000 hours makes an expert.',
    reality: 'Professor Anders Ericsson (the actual researcher) corrected this his entire life. The rule is NOT "do something for 10,000 hours." The rule IS: "10,000 hours of DELIBERATE practice can lead to mastery." A student who sings badly for 10,000 hours gets better at singing badly. Quality matters infinitely more than quantity.',
    pianoCompetitions: 'For piano competitions at the highest level, Ericsson estimated 25,000 hours of deliberate practice.',
  },

  fiveElements: [
    { name: 'Just beyond your comfort zone', desc: 'Not so hard you fail constantly — not so easy you\'re on autopilot. The sweet spot: challenging enough that you need full concentration. "The edge of ability" — where growth actually happens.' },
    { name: 'Specific goal in every session', desc: 'Not "I\'ll practice for an hour." But: "I will sing this phrase without running out of breath by the end of this session." One specific, measurable target.' },
    { name: 'Immediate feedback', desc: 'You must know immediately whether you did it right or wrong. This is why a teacher accelerates growth. This is why Starky\'s mic evaluation matters — students hear themselves through fresh ears.' },
    { name: 'Full mental engagement', desc: 'Watching TV while practising = zero deliberate practice. Full concentration, every time, even for 15 minutes. No autopilot.' },
    { name: 'Repetition with adjustment', desc: 'Not: repeat until comfortable. But: repeat, notice what went wrong, adjust, repeat again. The adjustment is where learning lives.' },
  ],

  threeTypes: {
    naive: { name: 'Naive Practice', desc: '"I\'ll just sing it again." The most common form. Almost no benefit beyond initial learning. Why most people plateau.' },
    purposeful: { name: 'Purposeful Practice', desc: 'Focused repetition with specific goals. Much better. "I\'ll sing this phrase again and focus specifically on the breath."' },
    deliberate: { name: 'Deliberate Practice', desc: 'Purposeful practice guided by expertise. The gold standard. Fastest route to mastery. Requires a teacher or intelligent feedback system. THIS IS WHAT STARKY PROVIDES.' },
  },

  compoundInterest: 'Einstein called compound interest the eighth wonder of the world. Practice compounds the same way. Day 1: small improvement. Week 1: noticeable. Month 1: real growth. Month 3: plateau broken. Month 6: others notice. Year 1: you cannot believe who you were. Year 3: mastery within reach. Consistency beats intensity. 30 minutes daily beats 3 hours on Sunday.',

  fifteenMinuteRule: 'Research shows 15 focused minutes of deliberate practice produces more growth than 2 hours of unfocused practice. Starky never tells a student they didn\'t practice enough. 15 minutes is a complete victory.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOW THE GREATS ACTUALLY PRACTICED
// ═══════════════════════════════════════════════════════════════════════════════

export const HOW_GREATS_PRACTICED = {
  mehdiHassan: {
    name: 'Mehdi Hassan — The King of Riyaz',
    method: 'Morning: 2-3 hours pure riyaz (scales, sur, alankars). Afternoon: song practice — phrases, not whole songs. Evening: listening to others and his own recordings. Night: reflection on what needed work.',
    quote: '"Riyaz karna wajib hai" — Practice is obligatory. Not optional. Like prayer.',
    lesson: 'Your warm-up is not a formality before the real work. Your warm-up IS the real work. The greats never skip it.',
  },
  lata: {
    name: 'Lata Mangeshkar — Precision Above All',
    method: 'Would stop mid-phrase if a single note was impure. Repeated one line 20, 30, 50 times until perfect.',
    quote: '"Sur pakad lo" — Catch the note. Hold it. Every note deserves your full attention.',
    lesson: 'One phrase done perfectly is worth more than an entire song done adequately.',
  },
  nfak: {
    name: 'Nusrat Fateh Ali Khan — Breath as Foundation',
    method: 'Hours of breathing exercises before a single note was sung. His taans were only possible because his breath could sustain them.',
    quote: '"Jo saans nahi rokta, woh gaana nahi gata" — He who cannot hold his breath cannot sing.',
    lesson: 'Breath first. Always. Every session starts with breath.',
  },
  mozart: {
    name: 'Mozart — The Child Who Practiced More Than Anyone',
    method: 'His father Leopold was the world\'s first systematic musical practice manager. Mozart began deliberate practice at age 3. By his first masterworks, he had already practiced more than most musicians do in a lifetime.',
    lesson: 'His "genius" was 15 years of the most disciplined deliberate practice any child had ever undergone. Start early if you can. But it is never too late — Charles did at 15, Bocelli at 30.',
  },
  beatles: {
    name: 'The Beatles — Hamburg and the 10,000 Hours',
    method: 'Played 8-hour sets, 7 nights a week, in Hamburg nightclubs. For two years. ~1,200 performances before their first hit.',
    quote: 'John Lennon: "We got better and got more confidence. We couldn\'t help it with all the experience playing all night long."',
    lesson: 'There is no substitute for doing the thing. Not reading about it. Not watching videos. DOING IT. Every session with Starky is a Hamburg night.',
  },
  michaelJackson: {
    name: 'Michael Jackson — The Most Deliberate Practitioner',
    method: 'Rehearsed a single dance move for 8 hours. Sang a single phrase 50 times in the studio. Asked to redo takes that were technically perfect because he felt he could do better.',
    quote: '"I\'m never pleased with anything. I\'m a perfectionist — it\'s part of who I am."',
    lesson: 'What looks effortless never was. The moonwalk looks simple because of thousands of repetitions. The performance is the reward for the practice.',
  },
  stevieWonder: {
    name: 'Stevie Wonder — 12 Hours a Day at Age 13',
    method: 'After Motown signed him at 11, practiced 12 hours a day — voluntarily, obsessively, joyfully. Every instrument he encountered, he learned by touch.',
    quote: '"You can\'t base your life on other people\'s expectations."',
    lesson: 'Practice must be intrinsically motivated. The student who practices to please parents will plateau when pressure is removed. The student who loves the music will never stop.',
  },
  casals: {
    name: 'Pablo Casals — Practice Until Death',
    method: 'Greatest cellist of the 20th century. Still practicing 6 hours a day at age 90+.',
    quote: 'When asked why he still practiced: "Because I think I\'m making progress."',
    lesson: 'The most important sentence about practice ever spoken. You never finish learning. You only finish caring.',
  },
  beethoven: {
    name: 'Beethoven — Practicing While Deaf',
    method: 'Lost hearing from age 26. Composed the Ninth Symphony — his greatest work — completely deaf. Felt vibrations through the piano floor. Held a pencil between his teeth against the piano to feel sound.',
    lesson: 'The music is not in the ears. It is in the mind. Practice builds a musical mind that transcends physical limitation.',
  },
  cr7Kobe: {
    name: 'CR7 and Kobe — The Principle Crosses All Domains',
    method: 'Cristiano Ronaldo stays after every training session alone. Free kicks hundreds of times. Kobe Bryant was in the gym at 4am every day.',
    quote: 'Kobe: "The most important thing is to try and inspire people so that they can be great in whatever they want to do."',
    lesson: 'Practice is not what you do because you\'re not good enough yet. Practice is what you do because you understand you can always be better.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// THE RIYAZ PHILOSOPHY — South Asian Deliberate Practice
// ═══════════════════════════════════════════════════════════════════════════════

export const RIYAZ_PHILOSOPHY = {
  name: 'Riyaz (ریاض) — the South Asian classical music tradition of daily practice',
  note: 'Predates Ericsson by centuries. Arrived at the same truth.',
  fiveRules: [
    { rule: 'Every morning — non-negotiable', desc: 'Voice and mind are freshest in morning. Even 15 minutes. The discipline is built in the not-missing.' },
    { rule: 'Mandra saptak first — lower register before upper', desc: 'Always begin in the comfortable lower range. Never start with high notes. Foundation before building higher.' },
    { rule: 'Alankars — patterns before songs', desc: 'Melodic patterns train precision before the emotion of a song clouds the technique. Technique must become automatic before it can serve emotion.' },
    { rule: 'Listen more than you sing', desc: 'The greats listened constantly — to singers in other traditions. A student who does not listen widely is building walls, not windows.' },
    { rule: 'Your guru is your mirror', desc: 'The teacher\'s ear hears what yours cannot. Starky is the accessible guru — not the same as a human teacher, but more consistent, more available, and infinitely patient.' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICE FOR EVERY SUBJECT
// ═══════════════════════════════════════════════════════════════════════════════

export const PRACTICE_ALL_SUBJECTS = {
  mathematics: { analogy: 'Mehdi Hassan\'s riyaz = mathematics daily problem sets', method: 'Not reading about maths — DOING maths. Attempt problems just beyond current level, note where understanding breaks, fix that specific point.' },
  language: { analogy: 'Beatles in Hamburg = language immersion', method: 'Read, speak, write, listen — all four every day. Even 15 minutes in the target language, every day.' },
  exams: { analogy: 'Beethoven composing despite deafness = work with what you have', method: 'Start preparing before you feel ready. Practice papers under exam conditions — time pressure is a skill.' },
  reading: { analogy: 'Lata\'s one phrase perfected = one paragraph deeply understood', method: 'Not: finish the book. Understand every page before moving on.' },
  coding: { analogy: 'MJ\'s 50 takes of one phrase = debug one function until perfect', method: 'Don\'t move on until the current thing works.' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICE FOR SEN
// ═══════════════════════════════════════════════════════════════════════════════

export const PRACTICE_FOR_SEN = {
  adhd: { blocks: '5-minute practice blocks with breaks between', timer: 'A timer is not pressure — it is permission to stop', gamify: 'Streaks, badges, beat your own record', variety: 'Different exercises, same daily habit' },
  autism: { routine: 'Same warm-up. Same structure. Every session. The routine IS the practice.', change: 'Change nothing until the student asks for change.', signal: '"We always start with [X]. That\'s our signal that learning has begun."' },
  dyslexia: { mode: 'Audio-first practice. Record and listen back.', speak: 'Speak problems aloud, not write them.', sessions: 'Short sessions — dyslexic working memory tires faster.', celebrate: 'Celebrate small wins loudly — dyslexic students experience disproportionate failure.' },
  downSyndrome: { frequency: 'Very short sessions. Very frequent. 3 minutes, 5 times a day beats 15 minutes once.', repetition: 'Repetition celebrated, not criticised. "We did that same thing again — and it was better than yesterday."' },
  anxiety: { space: 'Practice in a safe space first. Starky before parents. Build skill in private before any performance pressure.', privacy: '"What happens here stays here. This is just you and me practising."' },
  visionImpairment: { feedback: 'Audio feedback is primary. Starky describes progress in sound terms: "Your voice sounded more centred — the pitch was steadier."' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STARKY'S PRACTICE RESPONSES
// ═══════════════════════════════════════════════════════════════════════════════

export const STARKY_PRACTICE_RESPONSES = {
  notPracticed: 'Welcome back. Shall we pick up where we left off? The skill doesn\'t disappear when you\'re not practicing — it just waits for you to come back.',
  frustrated: 'Mehdi Hassan practiced riyaz every morning for 60 years. Michael Jackson rehearsed the moonwalk for 8 hours. The Beatles played 1,200 shows before their first hit. You have been working on this for {weeks} weeks. You are exactly where you should be.',
  wantToQuit: 'Every single person who ever became great at anything wanted to quit at some point. The difference between those who became great and those who stopped is this: they came back one more time. Can we do one more session today? Just one.',
  breakthrough: 'Do you feel that? That\'s what practice does. You did not do that last week. You can do it this week. Nothing changed except the practice. Now: let\'s practice it again while it\'s fresh.',
  notTalented: 'Ray Charles was told he would never be a musician. He was blind and his mother had just died. Talent is the story we tell after the practice is done. Let\'s start with one small thing today. That\'s all talent is — one small thing, done consistently.',
  streakBroken: 'New streak: Day 1. Let\'s build it again. Missing one day doesn\'t break the habit — coming back does.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICE TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

export const PRACTICE_PROFILE_SCHEMA = {
  practice_sessions_total: 0,
  current_streak_days: 0,
  longest_streak_days: 0,
  last_session_date: null,
  subjects_practiced: {},        // { maths: 12, singing: 8, ... }
  deliberate_practice_ratio: 0,  // 0-1 how focused vs passive
  breakthrough_moments: [],      // [{ date, subject, description }]
  practice_goal: 'daily',        // daily/3x_week/weekend
};

export const STREAK_MESSAGES = {
  3: 'You\'re building a habit. Keep going.',
  7: 'One week streak. This is how the greats did it.',
  14: 'Two weeks. Mehdi Hassan would be proud.',
  30: 'One month of daily practice. You have changed.',
  100: 'This is mastery territory. 100 days.',
};

const PRACTICE_KEY = 'nw_practice_profile';

export function loadPracticeProfile() {
  try { return JSON.parse(localStorage.getItem(PRACTICE_KEY) || 'null'); } catch { return null; }
}

export function savePracticeProfile(profile) {
  try { localStorage.setItem(PRACTICE_KEY, JSON.stringify(profile)); } catch {}
}

/**
 * Track a practice session and update streak
 */
export function trackPracticeStreak(profile, subject) {
  const p = profile || { ...PRACTICE_PROFILE_SCHEMA };
  const today = new Date().toISOString().split('T')[0];
  const lastDate = p.last_session_date?.split('T')[0];

  p.practice_sessions_total += 1;
  if (!p.subjects_practiced[subject]) p.subjects_practiced[subject] = 0;
  p.subjects_practiced[subject] += 1;

  // Streak logic
  if (lastDate === today) {
    // Same day — no streak change
  } else {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastDate === yesterday) {
      p.current_streak_days += 1;
    } else if (lastDate) {
      p.current_streak_days = 1; // streak broken, restart
    } else {
      p.current_streak_days = 1; // first ever session
    }
  }

  if (p.current_streak_days > p.longest_streak_days) {
    p.longest_streak_days = p.current_streak_days;
  }

  p.last_session_date = new Date().toISOString();
  savePracticeProfile(p);
  return p;
}

/**
 * Build a practice session prompt for Starky
 */
export function buildPracticeSession(subject, level, lastTopic) {
  return {
    opening: lastTopic
      ? `Last session we worked on ${lastTopic}. Today we build on that. Ready?`
      : `Let's start with the fundamentals of ${subject}. One thing at a time.`,
    structure: '15-minute focused session. One specific goal. Immediate feedback. Repetition with adjustment.',
    principle: DELIBERATE_PRACTICE_SCIENCE.fiveElements[0].desc,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPT GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get practice philosophy prompt for Starky
 */
export function getPracticePrompt(profile, subject, condition) {
  let prompt = `\nPRACTICE PHILOSOPHY — The science of how greatness is built.\n`;

  prompt += `\nDeliberate practice: ${DELIBERATE_PRACTICE_SCIENCE.fiveElements.map(e => e.name).join('. ')}. Starky transforms naive practice into deliberate practice for every student.`;
  prompt += `\n15-minute rule: 15 focused minutes > 2 hours unfocused.`;

  // Streak awareness
  if (profile?.current_streak_days > 0) {
    const streakMsg = STREAK_MESSAGES[profile.current_streak_days] ||
      (profile.current_streak_days > 30 ? `${profile.current_streak_days} day streak. Extraordinary.` : `${profile.current_streak_days} day streak. Building.`);
    prompt += `\nStudent streak: ${profile.current_streak_days} days. "${streakMsg}"`;
  }

  // Subject-specific analogy
  if (subject && PRACTICE_ALL_SUBJECTS[subject?.toLowerCase()]) {
    const s = PRACTICE_ALL_SUBJECTS[subject.toLowerCase()];
    prompt += `\nSubject analogy: ${s.analogy}. Method: ${s.method}`;
  }

  // SEN adaptation
  if (condition && PRACTICE_FOR_SEN[condition]) {
    const sen = PRACTICE_FOR_SEN[condition];
    prompt += `\nSEN practice: ${Object.values(sen).join('. ')}`;
  }

  // Riyaz for Pakistani/South Asian context
  prompt += `\nRiyaz philosophy: ${RIYAZ_PHILOSOPHY.fiveRules[0].desc} ${RIYAZ_PHILOSOPHY.fiveRules[4].desc}`;

  // Greats for inspiration
  prompt += `\nWhen student is frustrated: "${STARKY_PRACTICE_RESPONSES.frustrated}"`;
  prompt += `\nWhen student wants to quit: "${STARKY_PRACTICE_RESPONSES.wantToQuit}"`;
  prompt += `\nWhen student says "I\'m not talented": "${STARKY_PRACTICE_RESPONSES.notTalented}"`;

  prompt += `\nCasals at 90: "Because I think I\'m making progress." You never finish learning. You only finish caring.`;

  return prompt;
}
