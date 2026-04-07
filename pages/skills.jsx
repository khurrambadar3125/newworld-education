/**
 * pages/skills.jsx — From Classroom to Income
 * ─────────────────────────────────────────────────────────────────
 * Vocational skills for Garage School students and all Pakistani youth.
 * Three tracks: Freelancing, Employment, Trades.
 * Nano-lesson format. Urdu/English. Zero cost.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LegalFooter from '../components/LegalFooter';
import GarageNav from '../components/GarageNav';

const GOLD = '#C9A84C';

const TRACKS = [
  {
    id: 'freelance', name: 'Freelancing', icon: '💰', color: '#4ADE80', duration: '8 weeks',
    tagline: 'Apna kaam. Apni marzi. Ghar se kamaiye.',
    earning: 'PKR 20,000 — 50,000/month',
    desc: 'Learn Canva, set up Fiverr, start earning from home. No degree needed. Just a phone and internet.',
    modules: [
      { id: 'f1', name: 'Digital Literacy', lessons: ['Computer Basics', 'Typing Speed (English)', 'Typing Speed (Urdu)', 'Google Account Setup', 'File Management', 'Internet Safety'], weeks: '1-2', icon: '🖥️' },
      { id: 'f2', name: 'Canva Design Mastery', lessons: ['Canva — Pehla Design Banayein', 'Social Media Posts & Stories', 'Logo Design & Branding', 'YouTube Thumbnails', 'Business Cards & Flyers', 'Portfolio Banayein — Behance Profile'], weeks: '3-4', icon: '🎨' },
      { id: 'f3', name: 'Fiverr Setup & First Gig', lessons: ['Creating Your Fiverr Account', 'Writing a Winning Profile', 'Your First Gig — Pricing Right', 'Gig Photos & Description', 'How to Get First 5 Reviews', 'Client Communication'], weeks: '5-6', icon: '🌐' },
      { id: 'f4', name: 'WordPress & Shopify — Websites Banayein', lessons: ['WordPress Kya Hai — Pehli Website', 'Theme Install Karna', 'Pages Aur Posts Banana', 'Elementor Se Design Karna', 'Shopify Store Setup', 'Client Ko Website Deliver Karna (PKR 30-80K per site)'], weeks: '7-10', icon: '🌐' },
      { id: 'f5', name: 'Level Up — PKR 50K+', lessons: ['Social Media Management', 'Video Editing (CapCut)', 'Data Entry Techniques', 'Virtual Assistant Basics', 'Managing Multiple Clients', 'Scaling to PKR 50K+'], weeks: '11-12', icon: '🚀' },
    ],
  },
  {
    id: 'employment', name: 'Employment Ready', icon: '💼', color: '#4F8EF7', duration: '12 weeks',
    tagline: 'Job-ready skills. Call centres, offices, customer service.',
    earning: 'PKR 25,000 — 40,000/month',
    desc: 'English communication, MS Office, customer service — everything employers in Karachi want.',
    modules: [
      { id: 'e1', name: 'English Communication', lessons: ['Greetings & Self-Introduction', 'Phone Conversations', 'Common Phrases for Work', 'Email Writing Basics', 'Formal vs Informal English', 'Practice with Starky (Voice)'], weeks: '1-4', icon: '🗣️' },
      { id: 'e2', name: 'MS Office / Google Workspace', lessons: ['Google Docs — Writing Documents', 'Google Sheets — Data & Formulas', 'Google Slides — Presentations', 'Excel Basics for Data Entry', 'Email Etiquette', 'File Organization'], weeks: '5-8', icon: '📊' },
      { id: 'e3', name: 'Customer Service & Call Centre', lessons: ['What Call Centres Expect', 'Script Reading Practice', 'Handling Angry Customers', 'Sales Basics', 'Interview Preparation', 'Your CV / Resume'], weeks: '9-12', icon: '📞' },
    ],
  },
  {
    id: 'trades', name: 'Trade Skills', icon: '🔧', color: '#F97316', duration: '3-6 months',
    tagline: 'Haath ka hunar. Har jagah kaam milega.',
    earning: 'PKR 25,000 — 80,000/month',
    desc: 'Mobile repair, electrical, AC technician — hands-on skills with partner institutes in Karachi.',
    modules: [
      { id: 't1', name: 'Mobile Phone Repair', lessons: ['How Phones Work — Components', 'Screen Replacement Basics', 'Battery & Charging Issues', 'Software Troubleshooting', 'Tools You Need (PKR 3-5K)', 'Setting Up Your Repair Business'], weeks: 'Partner: Hunar Foundation', icon: '📱', partner: true },
      { id: 't2', name: 'Electrical & Solar', lessons: ['Safety First — Electrical Safety', 'Basic Wiring & Circuits', 'Domestic Wiring', 'Solar Panel Basics', 'Installation & Maintenance', 'Starting Your Business'], weeks: 'Partner: STEVTA', icon: '⚡', partner: true },
      { id: 't3', name: 'AC & Refrigeration', lessons: ['How AC Works', 'Common Faults & Diagnosis', 'Gas Filling & Servicing', 'Installation Procedures', 'Karachi Market — Peak Season', 'PKR 80K+ in Summer'], weeks: 'Partner: NAVTTC', icon: '❄️', partner: true },
    ],
  },
];

const FOUNDATION = {
  name: 'Foundation — Start Here', icon: '📚', color: GOLD, duration: '2 weeks',
  lessons: [
    { name: 'Computer Basics', desc: 'Turn on, navigate, type — from zero', icon: '🖥️' },
    { name: 'Typing Practice', desc: 'English 40 WPM target — gamified', icon: '⌨️' },
    { name: 'JazzCash / Easypaisa Setup', desc: 'Digital payments — receive freelance income', icon: '💳' },
    { name: 'Budgeting & Saving', desc: '50/30/20 rule — manage your first income', icon: '💰' },
    { name: 'Internet Safety', desc: 'Passwords, scams, privacy — stay safe online', icon: '🔒' },
    { name: 'Your Digital Identity', desc: 'Email, LinkedIn basics, professional profile', icon: '👤' },
  ],
};

export default function SkillsPage() {
  const router = useRouter();
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => { if (typeof window !== 'undefined') setIsMobile(window.innerWidth < 768); }, []);

  const S = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px 16px 80px', fontFamily: "'Sora',-apple-system,sans-serif" },
    container: { maxWidth: 640, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '18px 16px', marginBottom: 10 },
  };

  return (
    <>
      <Head>
        <title>Skills — From Classroom to Income | NewWorldEdu</title>
        <meta name="description" content="Learn freelancing, digital skills, and trades. Earn PKR 20,000-80,000/month. Free. In Urdu and English. For Pakistani youth." />
      </Head>
      <div style={S.page}>
        <div style={S.container}>

          {/* Back */}
          {selectedTrack ? (
            <button onClick={() => { setSelectedTrack(null); setExpandedModule(null); }} style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}>← All Tracks</button>
          ) : (
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#4F8EF7', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}>← Back</button>
          )}

          {/* Hero */}
          {!selectedTrack && (
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, marginBottom: 8 }}>SKILLS FOR LIFE</div>
              <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px' }}>
                Padhai ke saath <span style={{ color: GOLD }}>kamai bhi.</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 14, lineHeight: 1.6 }}>
                Freelancing, jobs, ya trade — choose your path. 8 weeks mein pehli income.
              </p>
            </div>
          )}

          {/* Foundation — always visible on main page */}
          {!selectedTrack && (
            <div style={{ ...S.card, background: 'rgba(201,168,76,.04)', borderColor: 'rgba(201,168,76,.15)', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{FOUNDATION.icon}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: GOLD }}>{FOUNDATION.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{FOUNDATION.duration} · Sab ke liye zaroori hai</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {FOUNDATION.lessons.map(l => (
                  <div key={l.name} style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#FAF6EB' }}>{l.icon} {l.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{l.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Track Selection */}
          {!selectedTrack && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1, marginBottom: 10 }}>CHOOSE YOUR PATH</div>
              {TRACKS.map(track => (
                <button key={track.id} onClick={() => setSelectedTrack(track)}
                  style={{ ...S.card, width: '100%', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: 14, alignItems: 'flex-start', borderColor: `${track.color}22` }}
                  onMouseOver={e => e.currentTarget.style.borderColor = track.color}
                  onMouseOut={e => e.currentTarget.style.borderColor = `${track.color}22`}>
                  <span style={{ fontSize: 32, flexShrink: 0 }}>{track.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: track.color }}>{track.name}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginBottom: 4 }}>{track.tagline}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'rgba(255,255,255,.35)' }}>
                      <span>⏱ {track.duration}</span>
                      <span style={{ color: track.color, fontWeight: 700 }}>💰 {track.earning}</span>
                    </div>
                  </div>
                </button>
              ))}

              {/* Partners */}
              <div style={{ ...S.card, textAlign: 'center', marginTop: 16, background: 'rgba(255,255,255,.02)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.25)', letterSpacing: 1, marginBottom: 8 }}>TRAINING PARTNERS</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['DigiSkills.pk', 'Hunar Foundation', 'STEVTA', 'NAVTTC', 'freeCodeCamp'].map(p => (
                    <span key={p} style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,.06)', color: 'rgba(255,255,255,.3)' }}>{p}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Track Detail */}
          {selectedTrack && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <span style={{ fontSize: 40 }}>{selectedTrack.icon}</span>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: selectedTrack.color, margin: '8px 0 4px' }}>{selectedTrack.name}</h2>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>{selectedTrack.tagline}</div>
                <div style={{ display: 'inline-block', marginTop: 8, padding: '6px 16px', borderRadius: 100, background: `${selectedTrack.color}15`, border: `1px solid ${selectedTrack.color}30`, fontSize: 13, fontWeight: 700, color: selectedTrack.color }}>
                  💰 {selectedTrack.earning}
                </div>
              </div>

              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, textAlign: 'center', marginBottom: 24 }}>
                {selectedTrack.desc}
              </p>

              {selectedTrack.modules.map(mod => (
                <div key={mod.id} style={{ marginBottom: 8 }}>
                  <button onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                    style={{ ...S.card, width: '100%', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 0,
                      borderColor: expandedModule === mod.id ? `${selectedTrack.color}40` : 'rgba(255,255,255,.1)',
                      background: expandedModule === mod.id ? `${selectedTrack.color}06` : 'rgba(255,255,255,.05)' }}>
                    <span style={{ fontSize: 24 }}>{mod.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#FAF6EB' }}>{mod.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>
                        {mod.partner ? mod.weeks : `Weeks ${mod.weeks}`} · {mod.lessons.length} lessons
                      </div>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,.2)' }}>{expandedModule === mod.id ? '▾' : '▸'}</span>
                  </button>

                  {expandedModule === mod.id && (
                    <div style={{ padding: '8px 0 8px 52px' }}>
                      {mod.lessons.map((lesson, i) => (
                        <a key={i}
                          href={mod.partner ? undefined : `/?message=${encodeURIComponent(`Mujhe "${lesson}" seekhna hai (${mod.name} — ${selectedTrack.name} track). Please mujhe Urdu mein step by step samjhayein. Bilkul basics se shuru karein. Asan alfaaz mein. Examples ke saath.`)}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 4, borderRadius: 10, textDecoration: 'none',
                            background: mod.partner ? 'rgba(255,255,255,.02)' : 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.04)', cursor: mod.partner ? 'default' : 'pointer' }}
                          onMouseOver={e => { if (!mod.partner) e.currentTarget.style.borderColor = selectedTrack.color; }}
                          onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.04)'}>
                          <div style={{ width: 24, height: 24, borderRadius: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', flexShrink: 0 }}>
                            {i + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#FAF6EB' }}>{lesson}</div>
                          </div>
                          {!mod.partner && <span style={{ fontSize: 11, color: selectedTrack.color, fontWeight: 700 }}>Learn →</span>}
                          {mod.partner && <span style={{ fontSize: 10, color: 'rgba(255,255,255,.2)' }}>Hands-on</span>}
                        </a>
                      ))}
                      {mod.partner && (
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', padding: '8px 12px', fontStyle: 'italic' }}>
                          Hands-on training at {mod.weeks}. Theory available on platform.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Ask Starky */}
              <a href={`/?message=${encodeURIComponent(`Main ${selectedTrack.name} seekhna chahta/chahti hoon. Main Karachi ka Matric student hoon. Mujhe Urdu mein bataiye — pehle kya seekhoon?`)}`}
                style={{ display: 'block', ...S.card, textDecoration: 'none', textAlign: 'center', marginTop: 16, background: 'rgba(201,168,76,.04)', borderColor: 'rgba(201,168,76,.15)' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: GOLD }}>Confused? Ask Starky</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Starky will help you choose the right skill based on your interests</div>
              </a>
            </>
          )}

        </div>
      </div>
      <LegalFooter />
      <GarageNav />
    </>
  );
}
