/**
 * pages/partner.jsx — School Partnership Demo Page
 * ─────────────────────────────────────────────────────────────────
 * Generic version of nixordemo. Any school can see what they get.
 * Free for school, parents upgrade to premium.
 */

import { useState } from 'react';
import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';

const NAVY = '#080C18';
const BLUE = '#4F8EF7';
const GREEN = '#4ADE80';
const GOLD = '#C9A84C';
const DIM = 'rgba(255,255,255,0.4)';

export default function PartnerPage() {
  const [formSent, setFormSent] = useState(false);
  const [school, setSchool] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const s = {
    section: { maxWidth: 1000, margin: '0 auto', padding: '80px 24px' },
    heading: { fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 16 },
    sub: { fontSize: 18, color: DIM, lineHeight: 1.7, marginBottom: 32 },
    card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '28px 24px' },
  };

  return (
    <>
      <Head>
        <title>Partner With Us — NewWorld Education</title>
        <meta name="description" content="Free AI tutoring for your school. 50,000+ verified questions, 30+ subjects, Cambridge and Edexcel. No cost for schools. Parents upgrade for home use." />
        <meta property="og:title" content="School Partnerships — NewWorldEdu" />
        <meta property="og:description" content="Partner with NewWorldEdu. Free 8-week access for your students. AI tutoring for Cambridge, Edexcel, SAT and more." />
      </Head>

      <div style={{ background: NAVY, color: '#fff', fontFamily: "'Inter','Sora',-apple-system,sans-serif", minHeight: '100vh' }}>

        {/* HERO */}
        <div style={{ ...s.section, paddingTop: 100, paddingBottom: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: BLUE, letterSpacing: '0.15em', marginBottom: 24 }}>SCHOOL PARTNERSHIP PROGRAMME</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 20, maxWidth: 800, margin: '0 auto 20px' }}>
            Give your students a <span style={{ color: BLUE }}>world-class AI tutor</span> — at zero cost to your school
          </h1>
          <p style={{ fontSize: 20, color: DIM, maxWidth: 650, margin: '0 auto 40px', lineHeight: 1.7 }}>
            50,000+ verified past paper questions. Cambridge and Edexcel. 30+ subjects. 24/7. In any language. Free for your school.
          </p>
          <a href="#partner-form" style={{ display: 'inline-block', background: BLUE, color: '#fff', fontSize: 16, fontWeight: 800, padding: '16px 40px', borderRadius: 12, textDecoration: 'none' }}>
            Partner With Us — Free
          </a>
        </div>

        {/* STATS */}
        <div style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ ...s.section, padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
            {[
              { n: '50,000+', l: 'Verified questions\nfrom past papers' },
              { n: '30+', l: 'Cambridge + Edexcel\nsubjects covered' },
              { n: '8', l: 'Languages in\ndictionary bank' },
              { n: '24/7', l: 'Available always\nno booking needed' },
            ].map(st => (
              <div key={st.n}>
                <div style={{ fontSize: 36, fontWeight: 900, color: BLUE, marginBottom: 4 }}>{st.n}</div>
                <div style={{ fontSize: 13, color: DIM, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{st.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* COST COMPARISON */}
        <div style={s.section}>
          <h2 style={{ ...s.heading, textAlign: 'center' }}>Your parents are paying <span style={{ color: '#EF4444' }}>$260-415/month</span> for tutors</h2>
          <p style={{ ...s.sub, textAlign: 'center' }}>We offer more — for $9.99/month</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { title: 'Private Tutor', price: '$32-52/hr', items: ['1 subject only', 'Available 2 hrs/week', 'Limited to tutor\'s knowledge', 'No progress tracking', 'No mark scheme access', 'Costs $260-415/month'], bad: true },
              { title: 'Starky (NewWorldEdu)', price: '$9.99/mo', items: ['ALL 30+ subjects', 'Available 24/7', '50,000+ verified questions', 'Real-time progress tracking', 'Every mark scheme memorized', '25-40x cheaper than a tutor'], bad: false },
              { title: 'Free ChatGPT', price: 'Free', items: ['Makes up answers confidently', 'No mark scheme knowledge', 'No exam board awareness', 'No progress tracking', 'Cannot grade accurately', 'Students practice wrong content'], bad: true },
            ].map(col => (
              <div key={col.title} style={{ ...s.card, borderColor: col.bad ? 'rgba(255,255,255,0.06)' : 'rgba(79,142,247,0.3)', background: col.bad ? 'rgba(255,255,255,0.02)' : 'rgba(79,142,247,0.04)' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: col.bad ? DIM : BLUE, marginBottom: 4, textAlign: 'center' }}>{col.title}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: col.bad ? 'rgba(255,255,255,.3)' : GREEN, textAlign: 'center', marginBottom: 16 }}>{col.price}</div>
                {col.items.map((t, i) => (
                  <div key={i} style={{ fontSize: 13, color: col.bad ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)', padding: '8px 0' }}>
                    <span style={{ color: col.bad ? '#EF4444' : GREEN, marginRight: 8 }}>{col.bad ? '✗' : '✓'}</span>{t}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* WHAT YOUR SCHOOL GETS (FREE) */}
        <div style={{ background: 'rgba(79,142,247,0.04)', borderTop: '1px solid rgba(79,142,247,0.1)', borderBottom: '1px solid rgba(79,142,247,0.1)' }}>
          <div style={s.section}>
            <h2 style={{ ...s.heading, textAlign: 'center' }}>What Your School Gets — <span style={{ color: GREEN }}>100% Free</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 32 }}>
              {[
                { icon: '🎯', title: 'Full Student Access', desc: 'Every student gets free access to Starky during school hours. Practice drill, mock exams, challenge mode, nano learning — all 30+ subjects.' },
                { icon: '📊', title: 'School Dashboard', desc: 'Real-time analytics: which topics are weak across your cohort, which students need intervention, class-level performance breakdown.' },
                { icon: '📝', title: 'Homework Integration', desc: 'Teachers assign practice from the verified question bank. Auto-graded. Results visible on the dashboard. No marking required.' },
                { icon: '🧭', title: 'Exam Compass', desc: 'Topic forecasting based on past paper pattern analysis. Help students focus on what\'s most likely to appear next.' },
                { icon: '💜', title: 'SEN Support', desc: 'Students with learning differences get adaptive content, effort-based grading, and condition-specific teaching — built-in, not an add-on.' },
                { icon: '🌍', title: 'Multilingual', desc: 'Students can learn in Urdu, Arabic, Sindhi, Pashto, or any language. Perfect for diverse classrooms.' },
                { icon: '🔒', title: 'Safe & Secure', desc: 'Content protection, jailbreak detection, child safety monitoring. HSTS, CSP, rate limiting. No harmful content ever.' },
                { icon: '📈', title: 'Improvement Reports', desc: 'Monthly reports showing aggregate improvement across subjects. Publishable data for your school\'s marketing.' },
              ].map(f => (
                <div key={f.title} style={s.card}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WHAT PARENTS GET (PREMIUM) */}
        <div style={s.section}>
          <h2 style={{ ...s.heading, textAlign: 'center' }}>What Parents Get — <span style={{ color: GOLD }}>$9.99/month</span></h2>
          <p style={{ ...s.sub, textAlign: 'center' }}>Students use Starky free at school. Parents upgrade for unlimited home use.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { icon: '🏠', title: 'Unlimited Home Access', desc: '24/7 access outside school hours. Evening revision, weekend practice, exam-week cramming.' },
              { icon: '📱', title: 'Progress Dashboard', desc: 'Parents see exactly what their child studied, accuracy by topic, predicted grade, study streaks.' },
              { icon: '📋', title: 'Personalized Study Plan', desc: 'AI generates a week-by-week plan based on exam date and current performance. Adapts in real-time.' },
              { icon: '🔄', title: 'Spaced Repetition', desc: 'Wrong answers automatically re-tested at optimal intervals. The most effective study method known to science.' },
              { icon: '📝', title: 'Full Mock Exams', desc: 'Timed, exam-condition mock papers from verified question bank. Auto-graded with predicted grade.' },
              { icon: '🎓', title: 'SAT Prep', desc: '10,000+ SAT questions for students planning university abroad. Same platform, no extra cost.' },
            ].map(f => (
              <div key={f.title} style={s.card}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div style={s.section}>
            <h2 style={{ ...s.heading, textAlign: 'center' }}>3 Steps to Launch</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 32 }}>
              {[
                { n: '1', title: 'You Sign Up', sub: '5 minutes. No IT setup.', desc: 'Fill out the form below. We create your school\'s access. Nothing to install — opens in any browser on any device.' },
                { n: '2', title: 'Students Start', sub: 'Same day.', desc: 'Share the link with students. They sign in with Google, select their subjects, and start practising with real past paper questions.' },
                { n: '3', title: 'Parents Upgrade', sub: 'Organic growth.', desc: 'Students love it. Parents see results. They upgrade to premium for home access. Your school earns recognition as an innovative institution.' },
              ].map(step => (
                <div key={step.n} style={{ ...s.card, textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: BLUE, color: '#fff', fontSize: 24, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{step.n}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 12, color: BLUE, fontWeight: 700, marginBottom: 12 }}>{step.sub}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PARTNERSHIP FORM */}
        <div id="partner-form" style={s.section}>
          <h2 style={{ ...s.heading, textAlign: 'center' }}>Partner With Us</h2>
          <p style={{ ...s.sub, textAlign: 'center' }}>No cost. No contract. No IT setup. Start this week.</p>

          {formSent ? (
            <div style={{ ...s.card, textAlign: 'center', maxWidth: 500, margin: '0 auto', borderColor: 'rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.04)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: GREEN, marginBottom: 8 }}>Thank you!</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>We'll be in touch within 24 hours to set up your school's access.</div>
            </div>
          ) : (
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
              {[
                { label: 'School Name', value: school, set: setSchool, placeholder: 'e.g., Haque Academy' },
                { label: 'Your Name', value: name, set: setName, placeholder: 'e.g., Dr. Marcia Haque' },
                { label: 'Email', value: email, set: setEmail, placeholder: 'e.g., principal@school.edu' },
                { label: 'Your Role', value: role, set: setRole, placeholder: 'e.g., Principal, Head of Department, IT Coordinator' },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                    style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <button onClick={() => { if (school && name && email) setFormSent(true); }}
                style={{ width: '100%', padding: '16px', background: BLUE, color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', marginTop: 8 }}>
                Start Free Partnership
              </button>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 12 }}>
                No payment required. No contract. Cancel anytime.
              </div>
            </div>
          )}
        </div>

        {/* CONTACT */}
        <div style={{ textAlign: 'center', padding: '40px 24px 20px' }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
            Khurram Badar — <a href="mailto:khurram@newworld.education" style={{ color: BLUE, textDecoration: 'none' }}>khurram@newworld.education</a>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', marginTop: 8 }}>NewWorld Education — Academic excellence, available everywhere</div>
        </div>
      </div>
      <LegalFooter />
    </>
  );
}
