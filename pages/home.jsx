/**
 * pages/home.jsx — NewWorldEdu Landing Page (Tailwind redesign)
 * ALL sections from original index.jsx, redesigned with Tailwind.
 * Fallback: /index.jsx (original, untouched)
 */

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';
import { useCountry } from '../components/CountrySelector';
import { filterForCountry } from '../utils/subjectCatalog';

const STATS = [
  { value: '50K+', label: 'Verified Questions' },
  { value: '24/7', label: 'AI Tutor' },
  { value: '30+', label: 'Subjects' },
  { value: '16', label: 'Languages' },
];

const LEVELS = [
  { id: 'primary', label: 'KG — Grade 5', ages: '4–10', icon: '🌱' },
  { id: 'middle', label: 'Grade 6 — 8', ages: '10–13', icon: '⚡' },
  { id: 'matric', label: 'Grade 9 — 10', ages: '13–15', icon: '🎯' },
  { id: 'olevel', label: 'O Level', ages: '14–16', icon: '📚' },
  { id: 'alevel', label: 'A Level', ages: '16–18', icon: '🎓' },
];

const SUBJECTS = {
  olevel: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English Language', 'Pakistan Studies', 'Islamiyat', 'Economics', 'Business Studies', 'Accounting', 'Additional Mathematics'],
  alevel: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies', 'Computer Science', 'Psychology', 'Accounting', 'English Language', 'Law', 'Further Mathematics'],
  primary: ['Maths', 'English', 'Urdu', 'Science', 'Islamiat', 'General Knowledge'],
  middle: ['Maths', 'English', 'Urdu', 'Science', 'Pakistan Studies', 'Islamiat', 'Computer'],
  matric: ['Maths', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Pakistan Studies', 'Islamiat', 'Computer Science'],
};

const LEARNING_TOOLS = [
  { icon: '☀️', title: 'Starky Nano', desc: 'Learn one goal at a time. Starky teaches it, tests it, confirms mastery. 2,803 goals across 30 subjects.', href: '/nano', color: 'amber' },
  { icon: '⚡', title: 'Practice Drill', desc: '5 drill modes: Weak Spots, Command Words, Mark Scheme Language, Calculations, Past Paper Style.', href: '/drill', color: 'blue' },
  { icon: '📝', title: 'Starky Mocks', desc: 'Timed mock exams with pre-exam briefing, question guides, and Cambridge examiner-level marking.', href: '/mocks', color: 'violet' },
  { icon: '🎯', title: 'Cambridge Challenge', desc: 'One question. Type your answer. Get marked in real time. See exactly which marks you earned.', href: '/challenge', color: 'emerald' },
];

const WHY_STARKY = [
  { icon: '🎙️', title: 'Voice Enabled', desc: 'Speak to Starky and hear responses out loud' },
  { icon: '📧', title: 'Parent Reports', desc: 'Email after every session with progress & next steps' },
  { icon: '🌍', title: '16 Languages', desc: 'Urdu, Arabic, English, Chinese — auto-detected' },
  { icon: '🎯', title: 'Knows where you lose marks', desc: 'Tracks every mark scheme point you miss — fixes it session by session' },
  { icon: '📅', title: 'Study plan for your exam date', desc: 'Builds a week-by-week plan that fixes your weak spots' },
  { icon: '🔮', title: 'Predicts your weak topics', desc: 'Analyses patterns across students. Tells you before you fail' },
  { icon: '📅', title: 'Knows where you are in the year', desc: 'Switches between foundation, exam prep, and results support automatically' },
];

const PARENT_FEATURES = [
  { icon: '📋', title: 'Set Assignments', desc: 'Tell Starky what your child should study. They see it when they open the app.' },
  { icon: '📊', title: 'Track Progress', desc: 'See weak topics, recent mistakes, and session summaries.' },
  { icon: '💬', title: 'Send Feedback', desc: 'Write a message your child sees on their next session.' },
  { icon: '📧', title: 'Session Reports', desc: 'Email after every session with accuracy, strengths, and weak areas.' },
  { icon: '🎓', title: 'Teach with Starky', desc: 'Ask "How do I teach my daughter osmosis?" and get a step-by-step guide.' },
  { icon: '📱', title: 'Works Remotely', desc: 'You at the office, your child at home. Set assignments and check progress.' },
];

const TEACHER_FEATURES = [
  { icon: '📊', title: 'Student Overview', desc: 'See all students — who is active, who needs attention, who is improving.' },
  { icon: '⚠️', title: 'Weak Topic Alerts', desc: 'Instantly spot which students are struggling and on which topics.' },
  { icon: '❌', title: 'Mistake Tracking', desc: 'See the exact mistakes each student keeps making.' },
  { icon: '📈', title: 'Session Activity', desc: 'Track sessions, last active, current subject, engagement per student.' },
];

const COMPARISON = [
  ['Available', '24/7', '3x per week'],
  ['Subjects', '34+ subjects', '1-2 subjects'],
  ['Cost/month', '$9.99', '$260-415 per subject'],
  ['Questions', '50,000+ verified', 'From memory'],
  ['Progress', 'Real-time tracking', 'Rarely reported'],
  ['Patience', 'Unlimited', 'Human'],
];

const TESTIMONIALS = [
  { stars: 5, text: '"My daughter used to dread Maths. After two weeks with Starky she looks forward to it. The session reports are incredible — I finally know what she\'s learning."', name: 'Fatima A.', loc: 'Parent, Karachi' },
  { stars: 5, text: '"Starky knew exactly what the O Level examiner wants. My son went from C to B in Physics in one month. Absolutely worth it."', name: 'Omar R.', loc: 'Parent, Dubai' },
  { stars: 5, text: '"میری بیٹی اب خود سے Starky سے پڑھتی ہے۔ پہلے ٹیوشن سے بھاگتی تھی۔ اب خود مانگتی ہے۔"', name: 'Nadia K.', loc: 'والدہ، لاہور' },
  { stars: 5, text: '"I was skeptical at first. But the session reports showed me exactly what he learned. After one month, his teacher noticed the improvement."', name: 'Bilal S.', loc: 'Parent, Islamabad' },
];

const FOOTER_LINKS = [
  { href: '/learn', label: '📖 Today\'s Plan' },
  { href: '/become-newton', label: '🍎 Become Newton' },
  { href: '/entrance-tests', label: '🎯 Entrance Tests' },
  { href: '/drill', label: '⚡ Practice Drill' },
  { href: '/mocks', label: '📝 Mock Exams' },
  { href: '/daily-challenge', label: '🏆 Daily Challenge' },
  { href: '/exam-compass', label: '🧭 Exam Compass' },
  { href: '/sat', label: '🎓 SAT Prep' },
  { href: '/past-papers', label: '📚 Past Papers' },
  { href: '/special-needs', label: '💜 Special Needs' },
  { href: '/parent', label: '👨‍👩‍👧 Parents' },
  { href: '/partner', label: '🏫 School Partnerships' },
  { href: '/pricing', label: '💳 Pricing' },
  { href: '/subscribe', label: '📬 Daily Questions' },
];

// Exam countdown
function getExamBanner() {
  const now = new Date();
  const examDate = new Date('2026-04-23');
  const diff = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));
  if (diff > 0 && diff <= 120) {
    const weeks = Math.floor(diff / 7);
    return `📅 Cambridge O & A Level exams start 23 April — ${weeks > 0 ? weeks + ' week' + (weeks > 1 ? 's' : '') : diff + ' days'} away. Every past paper and mark scheme ready.`;
  }
  if (diff <= 0 && diff > -45) return '📝 Cambridge exams in progress. Starky is here for last-minute revision between papers.';
  return null;
}

export default function Home() {
  const router = useRouter();
  const { userCountry, uaeCurriculum } = useCountry();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [examBanner, setExamBanner] = useState(null);

  useEffect(() => { setExamBanner(getExamBanner()); }, []);

  const handleSubjectClick = (subject) => {
    const level = selectedLevel === 'olevel' ? 'O Level' : selectedLevel === 'alevel' ? 'A Level' : 'O Level';
    router.push(`/study?subject=${encodeURIComponent(subject)}&level=${encodeURIComponent(level)}`);
  };

  return (
    <>
      <Head>
        <title>NewWorldEdu — AI-Powered Tutoring for Every Student in Pakistan</title>
        <meta name="description" content="50,000+ verified past paper questions. 30+ Cambridge subjects. AI tutor that speaks 16 languages. From KG to A Level. Free to start." />
      </Head>

      <div className="min-h-screen bg-white font-sans text-gray-900">

        {/* ── NAV ── */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/home"><a className="text-lg font-extrabold text-gray-900">NewWorldEdu <span className="text-blue-600">★</span></a></Link>
            <div className="flex items-center gap-3">
              <Link href="/study"><a className="hidden sm:inline text-sm font-semibold text-gray-500 hover:text-gray-900">Study</a></Link>
              <Link href="/drill"><a className="hidden sm:inline text-sm font-semibold text-gray-500 hover:text-gray-900">Practice</a></Link>
              <Link href="/past-papers"><a className="hidden sm:inline text-sm font-semibold text-gray-500 hover:text-gray-900">Past Papers</a></Link>
              <Link href="/pricing"><a className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition">Start Free</a></Link>
            </div>
          </div>
        </nav>

        {/* ── EXAM BANNER ── */}
        {examBanner && (
          <div className="bg-blue-600 text-white text-center py-2.5 px-4 text-sm font-medium">
            {examBanner}
            <Link href="/exam-compass"><a className="ml-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1 rounded-full transition">Try Starky →</a></Link>
          </div>
        )}

        {/* ── HERO ── */}
        <section className="px-4 pt-16 pb-12 text-center max-w-3xl mx-auto">
          <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-wide">
            CAMBRIDGE O & A LEVEL • KG TO GRADE 10
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-5">
            Every child deserves a<br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">world-class tutor.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
            Better grades in 30 days. 24/7. 16 languages. Every subject.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
            <a href="#select-level" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/25 transition transform hover:scale-[1.02]">
              Meet your personal tutor. Start learning →
            </a>
          </div>
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SELECT YOUR LEVEL ── */}
        <section id="select-level" className="px-4 py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs font-bold text-gray-400 tracking-widest mb-2">STEP 1</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-8">Select your grade</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-2xl mx-auto mb-10">
              {LEVELS.map(l => (
                <button key={l.id} onClick={() => setSelectedLevel(l.id)}
                  className={`p-4 rounded-2xl border-2 transition font-bold text-sm ${
                    selectedLevel === l.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}>
                  <div className="text-2xl mb-1">{l.icon}</div>
                  <div>{l.label}</div>
                  <div className="text-xs text-gray-400 font-normal mt-0.5">{l.ages}</div>
                </button>
              ))}
            </div>
            {selectedLevel && SUBJECTS[selectedLevel] && (
              <div className="mt-6">
                <div className="text-xs font-bold text-gray-400 tracking-widest mb-4">STEP 2 — PICK YOUR SUBJECT</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-w-2xl mx-auto">
                  {filterForCountry(SUBJECTS[selectedLevel], userCountry, uaeCurriculum).map(s => (
                    <button key={s} onClick={() => handleSubjectClick(s)}
                      className="bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-800 font-semibold text-sm py-3 px-4 rounded-xl transition text-left">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── LEARNING TOOLKIT ── */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs font-bold text-gray-400 tracking-widest mb-2">YOUR LEARNING TOOLKIT</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-10">Four ways to master Cambridge — pick one and start</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {LEARNING_TOOLS.map(f => (
                <Link key={f.title} href={f.href}>
                  <a className="group p-6 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-2xl text-left transition">
                    <div className="text-3xl mb-3">{f.icon}</div>
                    <div className="font-bold text-gray-900 mb-1 group-hover:text-blue-700">{f.title}</div>
                    <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY STARKY ── */}
        <section className="px-4 py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs font-bold text-gray-400 tracking-widest mb-2">WHY STARKY</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-10">Built to actually help your child</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WHY_STARKY.map(f => (
                <div key={f.title} className="p-5 bg-white border border-gray-100 rounded-2xl text-left">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="font-bold text-gray-900 mb-1">{f.title}</div>
                  <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE EXAMINER INSIDE THE TUTOR ── */}
        <section className="px-4 py-16">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black mb-4 leading-tight">The examiner inside the tutor.</h2>
            <p className="text-gray-500 leading-relaxed">
              Most tutors teach the subject. Starky teaches the mark scheme. 50,000+ verified questions. Every answer from the official mark scheme. Starky knows exactly what loses marks — and tells you what to write instead. From session one.
            </p>
          </div>
        </section>

        {/* ── CROSS-PLATFORM ── */}
        <section className="px-4 py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-black mb-2">Starky is always with you.</h2>
            <p className="text-gray-500 mb-10">Phone, tablet, or computer — your sessions, your progress, always in sync.</p>
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              {[
                { icon: '📱', label: 'Mobile', desc: 'Most students study on their phone. Built for it.' },
                { icon: '💻', label: 'Desktop', desc: 'Deep study sessions. Full screen, full focus.' },
                { icon: '📟', label: 'Tablet', desc: 'Read, write and learn. Works perfectly on iPad.' },
              ].map(d => (
                <div key={d.label} className="text-center">
                  <div className="text-4xl mb-2">{d.icon}</div>
                  <div className="font-bold mb-1">{d.label}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{d.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-6">No app to download. Open your browser. Start learning.</p>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="px-4 py-16 bg-blue-50/50">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs font-bold text-blue-500 tracking-widest mb-2">HOW STARKY WORKS</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-10">3 Simple Steps</h2>
            <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { n: '1️⃣', title: 'Pick grade & subject', desc: 'KG to A Level. Every Cambridge and Matric subject.' },
                { n: '2️⃣', title: 'Chat or photograph', desc: 'Type your question, send a photo of your homework, or ask to be quizzed.' },
                { n: '3️⃣', title: 'Learn step by step', desc: 'Starky guides you to the answer like a private tutor. Parents get a report.' },
              ].map(s => (
                <div key={s.title} className="text-center p-5">
                  <div className="text-4xl mb-3">{s.n}</div>
                  <div className="font-bold mb-2">{s.title}</div>
                  <div className="text-sm text-gray-500 leading-relaxed">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT MAKES THIS DIFFERENT ── */}
        <section className="px-4 py-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs font-bold text-blue-400 tracking-widest mb-2">WHY THIS ISN'T CHATGPT</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-10">The examiner inside the tutor</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              {[
                { bad: 'Generate answers from training data. May be wrong.', good: '50,000+ verified past paper questions. Every answer checked.', badLabel: 'Other AI tutors', goodLabel: 'NewWorldEdu' },
                { bad: 'Doesn\'t know Cambridge command words. "Describe" and "Explain" treated the same.', good: 'Knows every command word, every mark allocation, every examiner report.', badLabel: 'Generic', goodLabel: 'Cambridge-trained' },
                { bad: 'Available in English. Maybe broken Urdu.', good: 'English, Urdu, Sindhi, Punjabi, Pashto, Arabic — auto-detected.', badLabel: 'English only', goodLabel: '16 languages' },
              ].map((c, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="text-red-400 text-sm font-bold mb-2">✗ {c.badLabel}</div>
                  <div className="text-white/50 text-sm leading-relaxed">{c.bad}</div>
                  <div className="mt-4 text-emerald-400 text-sm font-bold mb-2">✓ {c.goodLabel}</div>
                  <div className="text-white/70 text-sm leading-relaxed">{c.good}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOR PARENTS ── */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs font-bold text-gray-400 tracking-widest mb-2">FOR PARENTS</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-10">Stay involved in your child's education</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {PARENT_FEATURES.map(f => (
                <div key={f.title} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl text-left">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="font-bold text-gray-900 mb-1">{f.title}</div>
                  <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/parent"><a className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-full transition">Open Parent Portal →</a></Link>
              <Link href="/parent?sen=1"><a className="bg-violet-500 hover:bg-violet-600 text-white font-bold px-6 py-3 rounded-full transition">💜 SEN Parent — Register</a></Link>
            </div>
          </div>
        </section>

        {/* ── FOR TEACHERS ── */}
        <section className="px-4 py-16 bg-blue-50/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs font-bold text-blue-500 tracking-widest mb-2">FOR TEACHERS</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-10">See every student's progress in one dashboard</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {TEACHER_FEATURES.map(f => (
                <div key={f.title} className="p-5 bg-white border border-gray-100 rounded-2xl text-left">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="font-bold text-gray-900 mb-1">{f.title}</div>
                  <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/dashboard"><a className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full transition">Open Teacher Dashboard →</a></Link>
              <Link href="/school"><a className="text-gray-500 hover:text-gray-700 text-sm font-semibold">School plans →</a></Link>
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section className="px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <div className="text-xs font-bold text-gray-400 tracking-widest mb-2">WHY PARENTS CHOOSE STARKY</div>
            <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 border-b border-gray-100 bg-gray-50">
                <div className="p-3 text-xs font-bold text-gray-400"></div>
                <div className="p-3 text-xs font-bold text-blue-600 text-center">Starky</div>
                <div className="p-3 text-xs font-bold text-gray-400 text-center">Human Tutor</div>
              </div>
              {COMPARISON.map(([label, starky, tutor], i) => (
                <div key={i} className={`grid grid-cols-3 ${i < COMPARISON.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="p-3 text-sm font-semibold text-gray-600">{label}</div>
                  <div className="p-3 text-sm font-bold text-emerald-600 text-center">{starky}</div>
                  <div className="p-3 text-sm text-gray-400 text-center">{tutor}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="px-4 py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs font-bold text-gray-400 tracking-widest mb-8">WHAT PARENTS SAY</div>
            <div className="grid sm:grid-cols-2 gap-4">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl text-left">
                  <div className="text-amber-400 text-sm mb-2">{'★'.repeat(t.stars)}</div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">{t.text}</p>
                  <div className="text-sm"><strong>{t.name}</strong> <span className="text-gray-400">— {t.loc}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEN SUPPORT ── */}
        <section className="px-4 py-16 text-center">
          <div className="max-w-xl mx-auto">
            <div className="text-4xl mb-4">💜</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-3">Special Needs Support</h2>
            <p className="text-gray-500 mb-6">Dedicated mode for students with autism, ADHD, dyslexia, and Down syndrome — adapted pacing, unlimited patience.</p>
            <Link href="/special-needs"><a className="bg-violet-500 hover:bg-violet-600 text-white font-bold px-6 py-3 rounded-full transition">Learn About SEN Support →</a></Link>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="px-4 py-20 bg-gradient-to-b from-blue-50 to-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to start?</h2>
            <p className="text-gray-500 mb-8">10 free sessions. No credit card. No time limit.</p>
            <a href="#select-level" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-blue-600/25 transition">
              Start Learning — Free →
            </a>
          </div>
        </section>

        {/* ── REFERRAL ── */}
        <section className="px-4 py-8 text-center bg-gradient-to-r from-amber-50 to-orange-50">
          <Link href="/championship"><a className="inline-block bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 font-bold px-6 py-3 rounded-full transition hover:shadow-lg">
            🏆 Refer Friends — Win Meta Ray-Ban + Free Months
          </a></Link>
        </section>

        {/* ── FOOTER ── */}
        <footer className="px-4 py-12 bg-gray-900 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <div className="text-xl font-extrabold mb-2">NewWorldEdu<span className="text-blue-400">★</span></div>
            <div className="text-sm text-white/50 mb-6">Every child deserves a world-class tutor.</div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6">
              {FOOTER_LINKS.map(l => (
                <Link key={l.href} href={l.href}><a className="text-white/40 hover:text-white/70 text-xs transition">{l.label}</a></Link>
              ))}
            </div>
            <div className="flex justify-center gap-4 text-xs text-white/30 mb-4">
              <Link href="/privacy"><a className="hover:text-white/50">Privacy Policy</a></Link>
              <Link href="/terms"><a className="hover:text-white/50">Terms of Service</a></Link>
            </div>
            <div className="text-xs text-white/25">© 2026 NewWorldEdu · khurram@newworld.education</div>
          </div>
        </footer>

      </div>
    </>
  );
}
