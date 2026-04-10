/**
 * pages/home.jsx — NewWorldEdu Landing Page (Tailwind redesign)
 * Clean, modern, light-friendly. Fallback: /index.jsx (original)
 */

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';

const STATS = [
  { value: '50K+', label: 'Verified Questions' },
  { value: '24/7', label: 'AI Tutor' },
  { value: '30+', label: 'Subjects' },
  { value: '16', label: 'Languages' },
];

const LEVELS = [
  { id: 'primary', label: 'KG — Grade 5', ages: '4–10', icon: '🌱', color: 'emerald' },
  { id: 'middle', label: 'Grade 6 — 8', ages: '10–13', icon: '⚡', color: 'amber' },
  { id: 'matric', label: 'Grade 9 — 10', ages: '13–15', icon: '🎯', color: 'orange' },
  { id: 'olevel', label: 'O Level', ages: '14–16', icon: '📚', color: 'blue' },
  { id: 'alevel', label: 'A Level', ages: '16–18', icon: '🎓', color: 'violet' },
];

const SUBJECTS = {
  olevel: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English Language', 'Pakistan Studies', 'Islamiyat', 'Economics', 'Business Studies', 'Accounting', 'Additional Mathematics'],
  alevel: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies', 'Computer Science', 'Psychology', 'Accounting', 'English Language', 'Law', 'Further Mathematics'],
  primary: ['Maths', 'English', 'Urdu', 'Science', 'Islamiat', 'General Knowledge'],
  middle: ['Maths', 'English', 'Urdu', 'Science', 'Pakistan Studies', 'Islamiat', 'Computer'],
  matric: ['Maths', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Pakistan Studies', 'Islamiat', 'Computer Science'],
};

const FEATURES = [
  { icon: '📚', title: 'Study Path', desc: 'Structured modules for every subject. Follow the path, master every topic.', href: '/study' },
  { icon: '⚡', title: 'Practice Drill', desc: 'Verified past paper questions. Timed. Graded. No AI guessing.', href: '/drill' },
  { icon: '🧭', title: 'Exam Compass', desc: 'Topic prediction from 30 years of past papers. Know what\'s coming.', href: '/exam-compass' },
  { icon: '🏆', title: 'Daily Challenge', desc: 'One question a day. Compete with students across Pakistan.', href: '/daily-challenge' },
];

const FOR_PARENTS = [
  { icon: '📊', title: 'Progress Tracking', desc: 'See exactly what your child is studying and where they struggle.' },
  { icon: '💜', title: 'SEN Support', desc: 'Built for 12 learning differences. Dyslexia, ADHD, autism, hearing impairment.' },
  { icon: '🌍', title: '16 Languages', desc: 'English, Urdu, Sindhi, Punjabi, Pashto, Arabic — auto-detected.' },
  { icon: '🔒', title: 'Safe & Private', desc: 'No ads. No data selling. Content-filtered. Islamic values respected.' },
];

export default function Home() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    try { setProfile(JSON.parse(localStorage.getItem('nw_user') || 'null')); } catch {}
  }, []);

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
              <Link href="/pricing"><a className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition">Start Free</a></Link>
            </div>
          </div>
        </nav>

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
            50,000+ verified past paper questions. Not AI-generated — real exam content from Cambridge, Matric, and entrance tests. Available 24/7 in 16 languages.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
            <a href="#select-level" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/25 transition transform hover:scale-[1.02]">
              Start Learning — Free →
            </a>
            <Link href="/pricing"><a className="text-gray-500 font-semibold text-sm hover:text-gray-700">View plans →</a></Link>
          </div>

          {/* Stats */}
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
            <h2 className="text-2xl sm:text-3xl font-black mb-8">What are you studying?</h2>

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

            {/* Subject grid */}
            {selectedLevel && SUBJECTS[selectedLevel] && (
              <div className="mt-6">
                <div className="text-xs font-bold text-gray-400 tracking-widest mb-4">STEP 2 — PICK YOUR SUBJECT</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-w-2xl mx-auto">
                  {SUBJECTS[selectedLevel].map(s => (
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

        {/* ── FOUR WAYS TO LEARN ── */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs font-bold text-gray-400 tracking-widest mb-2">THE PLATFORM</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-10">Four ways to master your subject</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURES.map(f => (
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

        {/* ── WHAT MAKES THIS DIFFERENT ── */}
        <section className="px-4 py-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs font-bold text-blue-400 tracking-widest mb-2">WHY THIS ISN'T CHATGPT</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-10">The examiner inside the tutor</h2>

            <div className="grid sm:grid-cols-3 gap-6 text-left">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-red-400 text-sm font-bold mb-2">✗ Other AI tutors</div>
                <div className="text-white/50 text-sm leading-relaxed">Generate answers from training data. May be wrong. No mark scheme awareness.</div>
                <div className="mt-4 text-emerald-400 text-sm font-bold mb-2">✓ NewWorldEdu</div>
                <div className="text-white/70 text-sm leading-relaxed">50,000+ verified past paper questions. Every answer checked against real mark schemes.</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-red-400 text-sm font-bold mb-2">✗ Generic</div>
                <div className="text-white/50 text-sm leading-relaxed">Doesn't know Cambridge command words. "Describe" and "Explain" treated the same.</div>
                <div className="mt-4 text-emerald-400 text-sm font-bold mb-2">✓ Cambridge-trained</div>
                <div className="text-white/70 text-sm leading-relaxed">Knows every command word, every mark allocation, every examiner report pattern from 30 years.</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-red-400 text-sm font-bold mb-2">✗ English only</div>
                <div className="text-white/50 text-sm leading-relaxed">Available in English. Maybe broken Urdu.</div>
                <div className="mt-4 text-emerald-400 text-sm font-bold mb-2">✓ 16 languages</div>
                <div className="text-white/70 text-sm leading-relaxed">English, Urdu, Sindhi, Punjabi, Pashto, Arabic — auto-detected. STEM always in English.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOR PARENTS ── */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs font-bold text-gray-400 tracking-widest mb-2">FOR PARENTS</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-10">Built to actually help your child</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FOR_PARENTS.map(f => (
                <div key={f.title} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl text-left">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="font-bold text-gray-900 mb-1">{f.title}</div>
                  <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-4 py-20 bg-gradient-to-b from-blue-50 to-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Ready to start?
            </h2>
            <p className="text-gray-500 mb-8">10 free sessions. No credit card. No time limit.</p>
            <a href="#select-level" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-blue-600/25 transition">
              Start Learning — Free →
            </a>
            <div className="mt-6 text-sm text-gray-400">
              Built by <Link href="/founder"><a className="text-gray-500 hover:text-gray-700 font-medium">Khurram Badar</a></Link> · newworld.education
            </div>
          </div>
        </section>

      </div>
      <LegalFooter />
    </>
  );
}
