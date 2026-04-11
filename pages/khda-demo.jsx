import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function KHDADemoPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { const fn = () => setIsMobile(window.innerWidth < 768); fn(); window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn); }, []);
  useEffect(() => { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const startChat = () => {
    setChatStarted(true);
    setMessages([{ role: 'assistant', content: 'Hi! I\'m Starky — your AI tutor. I know every subject across British, IB, American, CBSE, and UAE MoE curricula.\n\nAsk me anything — a maths question, an essay prompt, exam revision help, or just say "quiz me on Chemistry".\n\nNo signup needed. Try me.' }]);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const newMsgs = [...messages, { role: 'user', content: text }];
    setMessages([...newMsgs, { role: 'assistant', content: '...' }]);
    setLoading(true);

    try {
      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
          grade: 'olevel1',
          subject: '',
          userProfile: { country: 'UAE', uaeCurriculum: 'british' },
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullReply = '';
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value, { stream: true }).split('\n')) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try { const d = JSON.parse(line.slice(6)); if (d.text) fullReply += d.text; } catch {}
            }
          }
          setMessages([...newMsgs, { role: 'assistant', content: fullReply || '...' }]);
        }
      }
      if (fullReply) setMessages([...newMsgs, { role: 'assistant', content: fullReply }]);
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'Connection issue — please try again.' }]);
    } finally { setLoading(false); }
  };

  const f = "'Sora',sans-serif";
  const max = { maxWidth: 620, margin: '0 auto' };

  const CURRICULA = [
    { flag: '🇬🇧', name: 'British', sub: 'IGCSE / A Level', color: '#4F8EF7' },
    { flag: '🎓', name: 'IB', sub: 'International Baccalaureate', color: '#4ECDC4' },
    { flag: '🇺🇸', name: 'American', sub: 'AP / SAT / ACT', color: '#FF6B6B' },
    { flag: '🇮🇳', name: 'Indian', sub: 'CBSE', color: '#FF8E53' },
    { flag: '🇦🇪', name: 'UAE MoE', sub: 'Ministry of Education', color: '#FFC300' },
  ];

  const STATS = [
    { n: '44', l: 'Pages' },
    { n: '46', l: 'Knowledge Bases' },
    { n: '5', l: 'Curricula' },
    { n: 'KG–A', l: 'Every Grade' },
    { n: '24/7', l: 'Always On' },
  ];

  return (
    <>
      <Head>
        <title>NewWorldEdu — Demo</title>
        <meta name="description" content="NewWorldEdu — AI tutor for Dubai students. All curricula, all grades, all subjects." />
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#060B20;color:#fff}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        .kd-cta{transition:all 0.2s}.kd-cta:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(79,142,247,0.4)!important}
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#060B20 0%,#0A1628 40%,#060B20 100%)', fontFamily: f }}>

        {/* ═══ SECTION 1 — HERO ═══ */}
        <section style={{ textAlign: 'center', padding: isMobile ? '56px 20px 40px' : '80px 20px 48px', ...max }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>newworld.education</div>

          <h1 style={{ fontSize: 'clamp(30px,7vw,46px)', fontWeight: 900, lineHeight: 1.12, marginBottom: 16 }}>
            NewWorldEdu<br />
            <span style={{ background: 'linear-gradient(135deg,#4F8EF7,#4ECDC4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Built for Dubai.</span>
          </h1>

          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 460, margin: '0 auto 32px' }}>
            The only AI tutor that knows every curriculum taught in Dubai.
          </p>

          {!chatStarted ? (
            <button onClick={startChat} className="kd-cta" style={{ background: 'linear-gradient(135deg,#4F8EF7,#4ECDC4)', color: '#fff', border: 'none', padding: '18px 40px', borderRadius: 100, fontSize: 17, fontWeight: 800, cursor: 'pointer', fontFamily: f, boxShadow: '0 8px 32px rgba(79,142,247,0.3)' }}>
              Try Starky now →
            </button>
          ) : (
            <div style={{ fontSize: 13, color: '#4ADE80', fontWeight: 700 }}>↓ Chat with Starky below</div>
          )}

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 12 }}>No signup needed.</p>
        </section>

        {/* ═══ SECTION 2 — FIVE CURRICULA ═══ */}
        <section style={{ padding: isMobile ? '40px 20px' : '48px 20px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={max}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 10 : 16, flexWrap: 'wrap', marginBottom: 16 }}>
              {CURRICULA.map(c => (
                <div key={c.name} style={{ textAlign: 'center', minWidth: isMobile ? 60 : 80 }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{c.flag}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: c.color }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{c.sub}</div>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Every subject. Every grade. KG to A Level.</p>
          </div>
        </section>

        {/* ═══ SECTION 3 — STUDENTS OF DETERMINATION ═══ */}
        <section style={{ padding: isMobile ? '40px 20px' : '48px 20px' }}>
          <div style={max}>
            <h2 style={{ fontSize: 'clamp(20px,5vw,28px)', fontWeight: 900, textAlign: 'center', marginBottom: 20 }}>Fully inclusive learning for all students.</h2>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: 10 }}>
              {[
                { label: 'Gentle Start Protocol', desc: 'Every SEN session begins with comfort and safety' },
                { label: 'Deaf Mode', desc: 'Visual-first learning, no audio dependency' },
                { label: '12 conditions', desc: 'Autism, ADHD, Dyslexia, Down Syndrome and more' },
                { label: 'Always patient', desc: 'No time limits, no pressure, always available' },
              ].map(f => (
                <div key={f.label} style={{ background: 'rgba(199,125,255,0.05)', border: '1px solid rgba(199,125,255,0.12)', borderRadius: 14, padding: '16px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#C77DFF', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 4 — SUMMER ═══ */}
        <section style={{ padding: '24px 20px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ ...max, textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>UAE Summer 2026 — 5 learning tracks, all curricula covered.</p>
            <a href="/summer-uae" style={{ fontSize: 13, color: '#4F8EF7', textDecoration: 'none', fontWeight: 700 }}>View summer programme →</a>
          </div>
        </section>

        {/* ═══ SECTION 5 — LIVE STARKY CHAT ═══ */}
        <section style={{ padding: isMobile ? '40px 20px' : '48px 20px' }}>
          <div style={max}>
            <h2 style={{ fontSize: 'clamp(20px,5vw,28px)', fontWeight: 900, textAlign: 'center', marginBottom: 20 }}>Try Starky.</h2>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', minHeight: 300 }}>
              {!chatStarted ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                  <button onClick={startChat} className="kd-cta" style={{ background: 'linear-gradient(135deg,#4F8EF7,#4ECDC4)', color: '#fff', border: 'none', padding: '16px 36px', borderRadius: 100, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: f }}>
                    Start a conversation →
                  </button>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div style={{ maxHeight: 400, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {messages.map((m, i) => (
                      <div key={i} style={{ maxWidth: '85%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? 'rgba(79,142,247,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${m.role === 'user' ? 'rgba(79,142,247,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, padding: '10px 14px' }}>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff">$1</strong>').replace(/\n/g, '<br>') }} />
                      </div>
                    ))}
                    {loading && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Starky is thinking...</div>}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
                    <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="Ask Starky anything..."
                      style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: f, outline: 'none' }} />
                    <button onClick={sendMessage} disabled={loading || !input.trim()}
                      style={{ background: '#4F8EF7', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: f, opacity: loading || !input.trim() ? 0.4 : 1 }}>
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {['Quiz me on Biology', 'Explain quadratic equations', 'Help with my English essay', 'What is photosynthesis?'].map(q => (
                <button key={q} onClick={() => { if (!chatStarted) startChat(); setTimeout(() => { setInput(q); }, chatStarted ? 0 : 500); }}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '6px 14px', fontSize: 11, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: f, fontWeight: 600 }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 6 — STATS ═══ */}
        <section style={{ padding: '32px 20px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ ...max, display: 'flex', justifyContent: 'center', gap: isMobile ? 16 : 32, flexWrap: 'wrap' }}>
            {STATS.map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#4F8EF7' }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SECTION 7 — CONTACT ═══ */}
        <section style={{ padding: isMobile ? '48px 20px' : '56px 20px', textAlign: 'center' }}>
          <div style={max}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Get in touch.</h2>
            <a href="mailto:khurram@newworld.education" style={{ fontSize: 16, color: '#4F8EF7', textDecoration: 'none', fontWeight: 700 }}>
              khurram@newworld.education
            </a>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>newworld.education</p>
          </div>
        </section>

        <footer style={{ padding: '16px', textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.12)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          © 2026 NewWorldEdu
        </footer>
      </div>
    </>
  );
}
