import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// ─── Color Tokens ───
const C = {
  bg: '#E8E6F2',
  primary: '#505ACD',
  pink: '#FD64B6',
  green: '#3FDA7C',
  yellow: '#FFDF49',
  text: '#1a1a2e',
  white: '#FDFBFD',
  cardBg: '#ffffff',
};

// ─── CSS Keyframes & Global Overrides (injected once) ───
const GLOBAL_CSS = `
  @keyframes marqueeScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes floatShape {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes spinShape {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes pulseShape {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroReveal {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.5); }
    to { opacity: 1; transform: scale(1); }
  }

  /* Override dark theme for this page */
  .landing-v2-root, .landing-v2-root * {
    color-scheme: light !important;
  }
  .landing-v2-root {
    background: ${C.bg} !important;
    color: ${C.text} !important;
  }

  .fade-in-section {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .fade-in-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-word {
    display: inline-block;
    opacity: 0;
    transform: translateY(30px);
    animation: heroReveal 0.6s ease forwards;
  }

  .card-hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px) !important;
    box-shadow: 0 12px 40px rgba(80,90,205,0.15) !important;
  }

  .btn-primary {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .btn-primary:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 10px 30px rgba(80,90,205,0.4);
  }
  .btn-outline {
    transition: all 0.25s ease;
  }
  .btn-outline:hover {
    background: ${C.primary} !important;
    color: ${C.white} !important;
    transform: translateY(-3px);
    border-color: ${C.primary} !important;
  }

  .subject-pill {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .subject-pill:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }

  .marquee-track {
    display: inline-flex;
    animation: marqueeScroll 40s linear infinite;
    will-change: transform;
  }

  .gradient-text {
    background: linear-gradient(135deg, ${C.primary}, ${C.pink}, ${C.green});
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 4s ease infinite;
  }

  @media (max-width: 768px) {
    .grid-2col { grid-template-columns: 1fr !important; }
    .grid-3col { grid-template-columns: 1fr !important; }
    .grid-4col { grid-template-columns: 1fr 1fr !important; }
    .hero-title { font-size: 36px !important; }
    .nav-links { display: none !important; }
    .section-padding { padding: 48px 20px !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
  }
`;

// ─── Intersection Observer Hook ───
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.fade-in-section').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

// ─── Animated Counter ───
function AnimatedNumber({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Floating Shape ───
function FloatingShape({ shape, color, size, top, left, right, bottom, delay = 0, anim = 'floatShape' }) {
  return (
    <div style={{
      position: 'absolute',
      top, left, right, bottom,
      fontSize: `${size}px`,
      color,
      animation: `${anim} ${anim === 'spinShape' ? 8 + delay : 3 + delay}s ${anim === 'spinShape' ? 'linear' : 'ease-in-out'} infinite`,
      animationDelay: `${delay}s`,
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.45,
      userSelect: 'none',
    }}>
      {shape}
    </div>
  );
}

// ─── 1. MARQUEE TICKER ───
function MarqueeTicker() {
  const items = [
    '⭐ 89,000+ Verified Questions',
    '🚀 Cambridge Exams Start 23 April',
    '💜 SEN Support Available',
    '🌍 16 Languages',
    '📚 30+ Subjects',
    '🎯 PhD-Level Exam Prep',
    '🧠 AI That Learns How You Learn',
    '🏫 Trusted by Schools in 2 Countries',
  ];
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div style={{
      background: C.pink,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '11px 0',
      position: 'relative',
      zIndex: 10,
    }}>
      <div className="marquee-track">
        {repeated.map((t, i) => (
          <span key={i} style={{
            color: C.white,
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            marginRight: '48px',
            letterSpacing: '0.3px',
            flexShrink: 0,
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── 2. NAVBAR ───
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 48px',
      background: scrolled ? 'rgba(232,230,242,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
      maxWidth: '100%',
    }}>
      <div className="nav-links" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '28px',
      }}>
        {[
          { label: 'Study', href: '/study' },
          { label: 'Practice', href: '/drill' },
          { label: 'Past Papers', href: '/past-papers' },
          { label: 'SAT Prep', href: '/sat' },
        ].map((item) => (
          <Link key={item.label} href={item.href} style={{
            color: C.text,
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}>
            {item.label}
          </Link>
        ))}
      </div>

      <Link href="/" style={{
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 900,
        fontSize: '22px',
        color: C.primary,
        letterSpacing: '-0.5px',
        textDecoration: 'none',
      }}>
        NewWorldEdu ★
      </Link>

      <Link href="/start" className="btn-primary" style={{
        background: C.primary,
        color: C.white,
        fontFamily: '"DM Sans", sans-serif',
        fontWeight: 600,
        fontSize: '14px',
        padding: '10px 26px',
        borderRadius: '50px',
        textDecoration: 'none',
        boxShadow: '0 2px 12px rgba(80,90,205,0.3)',
      }}>
        Start Free →
      </Link>
    </nav>
  );
}

// ─── 3. HERO ───
function HeroSection() {
  const words1 = ['Every', 'Child', 'Deserves', 'a'];
  const words2 = ['World-Class', 'Tutor.'];

  return (
    <section style={{
      position: 'relative',
      textAlign: 'center',
      padding: '100px 24px 70px',
      maxWidth: '960px',
      margin: '0 auto',
      overflow: 'visible',
    }}>
      {/* Floating shapes */}
      <FloatingShape shape="★" color={C.green} size={36} top="-20px" left="6%" delay={0} />
      <FloatingShape shape="◆" color={C.pink} size={26} top="20px" right="4%" delay={1} anim="spinShape" />
      <FloatingShape shape="●" color={C.yellow} size={22} top="200px" left="1%" delay={0.5} anim="pulseShape" />
      <FloatingShape shape="▲" color={C.primary} size={24} top="140px" right="2%" delay={2} />
      <FloatingShape shape="★" color={C.yellow} size={18} top="300px" left="8%" delay={1.5} anim="spinShape" />
      <FloatingShape shape="◆" color={C.green} size={30} top="260px" right="7%" delay={0.8} anim="pulseShape" />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(40px, 6.5vw, 74px)',
          lineHeight: 1.08,
          color: C.text,
          margin: '0 0 4px 0',
          letterSpacing: '-2px',
        }} className="hero-title">
          {words1.map((word, i) => (
            <span key={i} className="hero-word" style={{ animationDelay: `${i * 0.1}s`, marginRight: '14px' }}>
              {word}
            </span>
          ))}
        </h1>
        <h1 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(40px, 6.5vw, 74px)',
          lineHeight: 1.08,
          margin: '0 0 28px 0',
          letterSpacing: '-2px',
        }} className="hero-title gradient-text">
          {words2.map((word, i) => (
            <span key={i} className="hero-word" style={{ animationDelay: `${(words1.length + i) * 0.1}s`, marginRight: '14px' }}>
              {word}
            </span>
          ))}
        </h1>

        <p className="hero-word" style={{
          animationDelay: '0.7s',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '19px',
          color: '#666',
          maxWidth: '520px',
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          Better grades in 30 days. 24/7 AI tutor. 16 languages. Every subject from KG to A Level.
        </p>

        <div className="hero-word" style={{
          animationDelay: '0.85s',
          display: 'flex',
          justifyContent: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          marginBottom: '50px',
        }}>
          <Link href="/start" className="btn-primary" style={{
            background: C.primary,
            color: C.white,
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: '17px',
            padding: '16px 38px',
            borderRadius: '50px',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(80,90,205,0.35)',
            display: 'inline-block',
          }}>
            Meet Starky — Free →
          </Link>
          <a href="#how-it-works" className="btn-outline" style={{
            background: 'transparent',
            color: C.primary,
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: '17px',
            padding: '16px 38px',
            borderRadius: '50px',
            textDecoration: 'none',
            border: `2px solid ${C.primary}`,
            display: 'inline-block',
          }}>
            See how it works
          </a>
        </div>

        {/* Stat pills */}
        <div className="hero-word" style={{
          animationDelay: '1s',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          {[
            { icon: '📚', label: '89K+ Questions' },
            { icon: '🕐', label: '24/7 Available' },
            { icon: '🎯', label: '30+ Subjects' },
            { icon: '🌍', label: '16 Languages' },
            { icon: '🏫', label: 'KG to A Level' },
          ].map((s) => (
            <div key={s.label} style={{
              background: C.white,
              padding: '9px 20px',
              borderRadius: '50px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: C.text,
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>{s.icon}</span> {s.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 4. TRUST ROW ───
function TrustRow() {
  return (
    <section className="fade-in-section" style={{
      textAlign: 'center',
      padding: '40px 24px 50px',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '12px',
        fontWeight: 600,
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        marginBottom: '20px',
      }}>
        Trusted by schools in Pakistan & UAE
      </p>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '14px',
        flexWrap: 'wrap',
      }}>
        {['UJALA Centre', 'Garage School', 'Deaf Reach', 'Nixor College'].map((s) => (
          <div key={s} style={{
            background: C.white,
            padding: '10px 24px',
            borderRadius: '50px',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            color: C.text,
            boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}>
            {s}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 5. BIG STATS ───
function StatsSection() {
  return (
    <section className="fade-in-section section-padding" style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '60px 24px',
    }}>
      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
      }}>
        {[
          { number: 89359, suffix: '+', label: 'Verified Questions', color: C.primary, icon: '📚' },
          { number: 425, suffix: 'K+', label: 'Total Learning Items', color: C.pink, icon: '🧠' },
          { number: 376, suffix: 'K+', label: 'Dictionary Words', color: C.green, icon: '📖' },
          { number: 16, suffix: '', label: 'Languages Supported', color: C.yellow, icon: '🌍' },
        ].map((stat) => (
          <div key={stat.label} className="card-hover" style={{
            background: C.white,
            borderRadius: '20px',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{stat.icon}</div>
            <div style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 900,
              fontSize: '38px',
              color: stat.color,
              letterSpacing: '-1px',
            }}>
              <AnimatedNumber target={stat.number} suffix={stat.suffix} />
            </div>
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#888',
              marginTop: '4px',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 6. HOW IT WORKS ───
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Pick your level',
      desc: 'KG, Primary, O Level, A Level, SAT — we cover every stage from age 4 to university entrance.',
      color: C.green,
    },
    {
      num: '02',
      title: 'Starky teaches you',
      desc: 'Our AI tutor adapts to how you learn. It remembers your strengths, weak spots, and what worked before.',
      color: C.pink,
    },
    {
      num: '03',
      title: 'Practice real questions',
      desc: '89,000+ verified questions from Cambridge, Edexcel, SAT past papers. No AI-generated filler.',
      color: C.primary,
    },
    {
      num: '04',
      title: 'Track your progress',
      desc: 'Spaced repetition, mastery tracking, grade predictions, and daily study plans — all automatic.',
      color: C.yellow,
    },
  ];

  return (
    <section id="how-it-works" className="fade-in-section section-padding" style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '70px 24px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          color: C.pink,
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginBottom: '12px',
        }}>
          How it works
        </p>
        <h2 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900,
          fontSize: '40px',
          color: C.text,
          letterSpacing: '-1px',
          margin: 0,
        }}>
          From zero to exam-ready
        </h2>
      </div>

      <div className="grid-4col" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
      }}>
        {steps.map((step) => (
          <div key={step.num} className="card-hover" style={{
            background: C.white,
            borderRadius: '20px',
            padding: '32px 24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 900,
              fontSize: '48px',
              color: step.color,
              opacity: 0.15,
              position: 'absolute',
              top: '12px',
              right: '16px',
              lineHeight: 1,
            }}>
              {step.num}
            </div>
            <div style={{
              width: '40px',
              height: '4px',
              background: step.color,
              borderRadius: '2px',
              marginBottom: '20px',
            }} />
            <h3 style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 800,
              fontSize: '19px',
              color: C.text,
              margin: '0 0 10px 0',
            }}>
              {step.title}
            </h3>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              color: '#777',
              lineHeight: 1.6,
              margin: 0,
            }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 7. ABOUT / EXAMINER CARD ───
function AboutSection() {
  const features = [
    {
      icon: '🧠',
      title: 'Learns How You Learn',
      desc: 'Starky remembers what worked, what didn\'t, and what to try next — getting smarter every session.',
    },
    {
      icon: '📝',
      title: 'Real Exam Questions Only',
      desc: '89,000+ verified questions from Cambridge, Edexcel, SAT. Zero AI-generated content.',
    },
    {
      icon: '🌍',
      title: 'Any Language, Any Subject',
      desc: 'Study in Urdu, Arabic, Chinese, or 13 other languages. STEM always in English.',
    },
    {
      icon: '📊',
      title: 'Exam Compass',
      desc: 'AI analyses past paper patterns to predict which topics are most likely to appear.',
    },
  ];

  return (
    <section className="fade-in-section section-padding" style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '60px 24px 80px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
      alignItems: 'start',
    }} className2="grid-2col">
      <div style={{
        background: `linear-gradient(135deg, ${C.primary}, #6366f1)`,
        borderRadius: '24px',
        padding: '48px 36px',
        color: C.white,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />

        <h2 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900,
          fontSize: '34px',
          lineHeight: 1.15,
          margin: '0 0 20px 0',
          position: 'relative',
        }}>
          The examiner inside the tutor.
        </h2>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '15px',
          lineHeight: 1.75,
          opacity: 0.92,
          margin: '0 0 28px 0',
          position: 'relative',
        }}>
          Starky doesn't just teach — it thinks like a Cambridge examiner. Every question comes from
          real past papers. Every explanation matches the mark scheme. Every session makes your child
          more exam-ready than the last.
        </p>
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          position: 'relative',
        }}>
          {['Cambridge', 'Edexcel', 'SAT', 'SEN', 'MiTE'].map((tag) => (
            <span key={tag} style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '6px 18px',
              borderRadius: '50px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid-2col" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}>
        {features.map((f) => (
          <div key={f.title} className="card-hover" style={{
            background: C.white,
            borderRadius: '18px',
            padding: '24px 20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{f.icon}</div>
            <h3 style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 800,
              fontSize: '16px',
              color: C.text,
              margin: '0 0 6px 0',
            }}>
              {f.title}
            </h3>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px',
              color: '#777',
              lineHeight: 1.55,
              margin: 0,
            }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 8. SUBJECTS GRID ───
function SubjectsSection() {
  const subjects = [
    { name: 'Mathematics', emoji: '📐', color: '#E8F0FE' },
    { name: 'Physics', emoji: '⚡', color: '#FFF3E0' },
    { name: 'Chemistry', emoji: '🧪', color: '#E8F5E9' },
    { name: 'Biology', emoji: '🧬', color: '#FCE4EC' },
    { name: 'English', emoji: '📝', color: '#E3F2FD' },
    { name: 'Computer Science', emoji: '💻', color: '#F3E5F5' },
    { name: 'Urdu', emoji: '📖', color: '#FFF8E1' },
    { name: 'Economics', emoji: '📊', color: '#E0F7FA' },
    { name: 'Pakistan Studies', emoji: '🇵🇰', color: '#E8F5E9' },
    { name: 'Islamiyat', emoji: '☪️', color: '#FFF3E0' },
    { name: 'Business Studies', emoji: '💼', color: '#F1F8E9' },
    { name: 'Accounting', emoji: '🧮', color: '#FBE9E7' },
    { name: 'SAT Prep', emoji: '🎯', color: '#EDE7F6' },
    { name: 'SEN / SEND', emoji: '💜', color: '#F3E5F5' },
    { name: 'Arabic', emoji: '🌙', color: '#E0F2F1' },
    { name: '+ 20 more', emoji: '✨', color: '#FFFDE7' },
  ];

  return (
    <section className="fade-in-section section-padding" style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '60px 24px 70px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          color: C.green,
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginBottom: '12px',
        }}>
          What we cover
        </p>
        <h2 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900,
          fontSize: '40px',
          color: C.text,
          letterSpacing: '-1px',
          margin: 0,
        }}>
          Every subject. Every board.
        </h2>
      </div>

      <div className="grid-4col" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
      }}>
        {subjects.map((s) => (
          <div key={s.name} className="subject-pill" style={{
            background: s.color,
            borderRadius: '14px',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'default',
          }}>
            <span style={{ fontSize: '22px' }}>{s.emoji}</span>
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: C.text,
            }}>
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 9. TESTIMONIAL / WHY PARENTS SECTION ───
function WhyParentsLoveIt() {
  const reasons = [
    {
      quote: '"My daughter went from C to A* in Chemistry in 3 months."',
      detail: 'Real Cambridge past paper questions with examiner-style mark schemes.',
      tag: 'O Level Parent',
      color: C.pink,
    },
    {
      quote: '"He actually asks to study now. Starky made it fun."',
      detail: 'Adaptive difficulty, streaks, and gentle encouragement keep kids engaged.',
      tag: 'KG Parent',
      color: C.green,
    },
    {
      quote: '"Finally, SEN support that actually understands my child."',
      detail: 'PhD-level special needs module with engagement model and effort grading.',
      tag: 'SEN Parent',
      color: C.primary,
    },
  ];

  return (
    <section className="fade-in-section section-padding" style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '60px 24px 80px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          color: C.primary,
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginBottom: '12px',
        }}>
          Why families choose us
        </p>
        <h2 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900,
          fontSize: '40px',
          color: C.text,
          letterSpacing: '-1px',
          margin: 0,
        }}>
          Better than a £40/hr tutor.
        </h2>
      </div>

      <div className="grid-3col" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
      }}>
        {reasons.map((r) => (
          <div key={r.tag} className="card-hover" style={{
            background: C.white,
            borderRadius: '20px',
            padding: '32px 28px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            borderTop: `4px solid ${r.color}`,
          }}>
            <p style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: C.text,
              lineHeight: 1.4,
              margin: '0 0 14px 0',
              fontStyle: 'italic',
            }}>
              {r.quote}
            </p>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              color: '#777',
              lineHeight: 1.6,
              margin: '0 0 18px 0',
            }}>
              {r.detail}
            </p>
            <span style={{
              background: `${r.color}20`,
              color: r.color,
              padding: '5px 14px',
              borderRadius: '50px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '12px',
              fontWeight: 700,
            }}>
              {r.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 10. GRADE COVERAGE ───
function GradeCoverage() {
  const levels = [
    { level: 'KG', age: '4–5', icon: '🌱', color: '#A8E063' },
    { level: 'Primary', age: '5–10', icon: '⭐', color: '#FFC300' },
    { level: 'Middle', age: '10–13', icon: '🚀', color: '#FF8C69' },
    { level: 'Matric', age: '13–15', icon: '📋', color: '#F06292' },
    { level: 'O Level', age: '14–16', icon: '📚', color: C.primary },
    { level: 'A Level', age: '16–18', icon: '🎓', color: '#7C4DFF' },
    { level: 'SAT', age: '16+', icon: '🎯', color: C.pink },
    { level: 'SEN', age: 'All ages', icon: '💜', color: '#AB47BC' },
  ];

  return (
    <section className="fade-in-section section-padding" style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '60px 24px 70px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          color: '#FFA726',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginBottom: '12px',
        }}>
          Complete coverage
        </p>
        <h2 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900,
          fontSize: '40px',
          color: C.text,
          letterSpacing: '-1px',
          margin: 0,
        }}>
          KG to A Level. One platform.
        </h2>
      </div>

      <div className="grid-4col" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px',
      }}>
        {levels.map((l) => (
          <div key={l.level} className="card-hover" style={{
            background: C.white,
            borderRadius: '16px',
            padding: '24px 20px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            borderBottom: `3px solid ${l.color}`,
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{l.icon}</div>
            <div style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 800,
              fontSize: '18px',
              color: C.text,
            }}>
              {l.level}
            </div>
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px',
              color: '#999',
              marginTop: '4px',
            }}>
              Ages {l.age}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 11. CTA BANNER ───
function CTABanner() {
  return (
    <section className="fade-in-section section-padding" style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '40px 24px 80px',
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${C.primary}, #6366f1, ${C.pink})`,
        backgroundSize: '200% 200%',
        animation: 'gradientShift 6s ease infinite',
        borderRadius: '28px',
        padding: '64px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative shapes */}
        <div style={{ position: 'absolute', top: '20px', left: '40px', fontSize: '40px', opacity: 0.15, color: C.white }}>★</div>
        <div style={{ position: 'absolute', bottom: '20px', right: '40px', fontSize: '50px', opacity: 0.1, color: C.white }}>◆</div>
        <div style={{ position: 'absolute', top: '50%', left: '10%', fontSize: '30px', opacity: 0.1, color: C.white }}>●</div>

        <h2 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 900,
          fontSize: '38px',
          color: C.white,
          margin: '0 0 16px 0',
          letterSpacing: '-1px',
          position: 'relative',
        }}>
          Ready to see the difference?
        </h2>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '17px',
          color: 'rgba(255,255,255,0.9)',
          maxWidth: '480px',
          margin: '0 auto 32px',
          lineHeight: 1.6,
          position: 'relative',
        }}>
          Join thousands of students across Pakistan and UAE. Start free — no credit card needed.
        </p>
        <Link href="/start" className="btn-primary" style={{
          background: C.white,
          color: C.primary,
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 700,
          fontSize: '17px',
          padding: '16px 42px',
          borderRadius: '50px',
          textDecoration: 'none',
          display: 'inline-block',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          Start Learning — Free →
        </Link>
      </div>
    </section>
  );
}

// ─── 12. FOOTER ───
function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '40px 24px',
      background: C.bg,
      borderTop: '1px solid rgba(0,0,0,0.06)',
    }}>
      <div style={{
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 800,
        fontSize: '20px',
        color: C.primary,
        marginBottom: '16px',
      }}>
        NewWorldEdu ★
      </div>
      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '14px',
        color: '#888',
        margin: '0 0 20px 0',
      }}>
        Every child deserves a world-class tutor.
      </p>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'wrap',
        marginBottom: '20px',
      }}>
        {[
          { label: 'Study', href: '/study' },
          { label: 'Practice', href: '/drill' },
          { label: 'Past Papers', href: '/past-papers' },
          { label: 'SAT', href: '/sat' },
          { label: 'SEN', href: '/special-needs' },
          { label: 'Languages', href: '/languages' },
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' },
        ].map((link) => (
          <Link key={link.label} href={link.href} style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            color: '#999',
            textDecoration: 'none',
          }}>
            {link.label}
          </Link>
        ))}
      </div>
      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '12px',
        color: '#bbb',
      }}>
        © {new Date().getFullYear()} NewWorldEdu. All rights reserved.
      </p>
    </footer>
  );
}

// ─── Background Floating Shapes ───
function BackgroundShapes() {
  const shapes = [
    { shape: '★', color: C.green, size: 44, top: '12%', left: '2%', delay: 0 },
    { shape: '◆', color: C.pink, size: 32, top: '22%', right: '3%', delay: 1.2, anim: 'spinShape' },
    { shape: '●', color: C.yellow, size: 24, top: '38%', left: '4%', delay: 0.6, anim: 'pulseShape' },
    { shape: '▲', color: C.primary, size: 28, top: '48%', right: '4%', delay: 2 },
    { shape: '★', color: C.pink, size: 22, top: '58%', left: '3%', delay: 1.8, anim: 'spinShape' },
    { shape: '◆', color: C.green, size: 36, top: '68%', right: '5%', delay: 0.3, anim: 'pulseShape' },
    { shape: '●', color: C.primary, size: 20, top: '78%', left: '5%', delay: 1 },
    { shape: '▲', color: C.yellow, size: 26, top: '88%', right: '3%', delay: 0.9, anim: 'spinShape' },
  ];

  return (
    <>
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}
    </>
  );
}

// ─── MAIN PAGE ───
export default function LandingV2() {
  useScrollReveal();

  return (
    <div className="landing-v2-root" style={{
      background: C.bg,
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Head>
        <title>NewWorldEdu — Every Child Deserves a World-Class Tutor</title>
        <meta name="description" content="89,000+ verified Cambridge questions. 24/7 AI tutor in 16 languages. Better grades in 30 days. KG to A Level." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <BackgroundShapes />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <MarqueeTicker />
        <Navbar />
        <HeroSection />
        <TrustRow />
        <StatsSection />
        <HowItWorks />
        <AboutSection />
        <SubjectsSection />
        <GradeCoverage />
        <WhyParentsLoveIt />
        <CTABanner />
        <Footer />
      </div>
    </div>
  );
}
