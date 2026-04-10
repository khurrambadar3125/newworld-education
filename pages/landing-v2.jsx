import Head from 'next/head';
import { useEffect, useRef } from 'react';

// ─── Color Tokens ───
const C = {
  bg: '#E8E6F2',
  primary: '#505ACD',
  pink: '#FD64B6',
  green: '#3FDA7C',
  yellow: '#FFDF49',
  text: '#1a1a2e',
  white: '#FDFBFD',
};

// ─── Marquee Ticker ───
function MarqueeTicker() {
  const items = [
    '⭐ 89,000+ Verified Cambridge Questions',
    '🚀 Cambridge Exams Start 23 April',
    '💜 SEN Support Available',
    '🌍 16 Languages',
  ];
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div style={{
      background: C.pink,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '10px 0',
      position: 'relative',
    }}>
      <div style={{
        display: 'inline-block',
        animation: 'marquee 30s linear infinite',
      }}>
        {repeated.map((t, i) => (
          <span key={i} style={{
            color: C.white,
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            marginRight: '60px',
            letterSpacing: '0.5px',
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Navbar ───
function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 48px',
      background: 'transparent',
      maxWidth: '1280px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
      }}>
        {['Study', 'Practice', 'Past Papers'].map((item) => (
          <a key={item} href="#" style={{
            color: C.text,
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '15px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
            onMouseEnter={(e) => e.target.style.color = C.primary}
            onMouseLeave={(e) => e.target.style.color = C.text}
          >
            {item}
          </a>
        ))}
      </div>

      <div style={{
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 800,
        fontSize: '22px',
        color: C.primary,
        letterSpacing: '-0.5px',
      }}>
        NewWorldEdu ★
      </div>

      <a href="/start" style={{
        background: C.primary,
        color: C.white,
        fontFamily: '"DM Sans", sans-serif',
        fontWeight: 600,
        fontSize: '15px',
        padding: '10px 28px',
        borderRadius: '50px',
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 2px 8px rgba(80,90,205,0.3)',
      }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(80,90,205,0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(80,90,205,0.3)';
        }}
      >
        Start Free →
      </a>
    </nav>
  );
}

// ─── Floating Shape ───
function FloatingShape({ shape, color, size, top, left, right, delay, animation }) {
  const anims = {
    float: `float ${3 + delay}s ease-in-out infinite`,
    spin: `spin ${8 + delay}s linear infinite`,
    pulse: `pulse ${2 + delay}s ease infinite`,
  };

  return (
    <div style={{
      position: 'absolute',
      top,
      left,
      right,
      fontSize: `${size}px`,
      color,
      animation: anims[animation || 'float'],
      animationDelay: `${delay}s`,
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.55,
      userSelect: 'none',
    }}>
      {shape}
    </div>
  );
}

// ─── Hero Section ───
function HeroSection() {
  const stats = [
    { label: '89K+ Questions', icon: '📚' },
    { label: '24/7 Available', icon: '🕐' },
    { label: '30+ Subjects', icon: '🎯' },
    { label: '16 Languages', icon: '🌍' },
  ];

  return (
    <section style={{
      position: 'relative',
      textAlign: 'center',
      padding: '80px 24px 60px',
      maxWidth: '900px',
      margin: '0 auto',
      overflow: 'visible',
    }}>
      {/* Floating shapes around hero */}
      <FloatingShape shape="★" color={C.green} size={32} top="-10px" left="8%" delay={0} animation="float" />
      <FloatingShape shape="◆" color={C.pink} size={24} top="30px" right="5%" delay={1} animation="spin" />
      <FloatingShape shape="●" color={C.yellow} size={20} top="180px" left="2%" delay={0.5} animation="pulse" />
      <FloatingShape shape="▲" color={C.primary} size={22} top="120px" right="3%" delay={2} animation="float" />
      <FloatingShape shape="★" color={C.pink} size={18} top="280px" left="10%" delay={1.5} animation="spin" />
      <FloatingShape shape="◆" color={C.green} size={28} top="250px" right="8%" delay={0.8} animation="pulse" />

      <h1 className="hero-line hero-line-1" style={{
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 900,
        fontSize: 'clamp(42px, 6vw, 72px)',
        lineHeight: 1.1,
        color: C.text,
        margin: 0,
        letterSpacing: '-1.5px',
      }}>
        Every Child Deserves a
      </h1>
      <h1 className="hero-line hero-line-2" style={{
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 900,
        fontSize: 'clamp(42px, 6vw, 72px)',
        lineHeight: 1.1,
        color: C.primary,
        margin: '0 0 24px 0',
        letterSpacing: '-1.5px',
      }}>
        World-Class Tutor.
      </h1>

      <p className="hero-line hero-line-3" style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '19px',
        color: '#555',
        maxWidth: '560px',
        margin: '0 auto 36px',
        lineHeight: 1.6,
      }}>
        Better grades in 30 days. 24/7. 16 languages. Every subject.
      </p>

      <div className="hero-line hero-line-4" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '48px',
      }}>
        <a href="/start" style={{
          background: C.primary,
          color: C.white,
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 700,
          fontSize: '17px',
          padding: '14px 36px',
          borderRadius: '50px',
          textDecoration: 'none',
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: '0 4px 16px rgba(80,90,205,0.35)',
        }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 8px 28px rgba(80,90,205,0.45)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 16px rgba(80,90,205,0.35)';
          }}
        >
          Meet Starky — Free →
        </a>
        <a href="#about" style={{
          background: 'transparent',
          color: C.primary,
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 700,
          fontSize: '17px',
          padding: '14px 36px',
          borderRadius: '50px',
          textDecoration: 'none',
          border: `2px solid ${C.primary}`,
          transition: 'transform 0.2s, background 0.2s, color 0.2s',
        }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.background = C.primary;
            e.target.style.color = C.white;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.background = 'transparent';
            e.target.style.color = C.primary;
          }}
        >
          See how it works
        </a>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: C.white,
            padding: '10px 22px',
            borderRadius: '50px',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: C.text,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>{s.icon}</span> {s.label}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Partner Trust Row ───
function TrustRow() {
  const schools = ['UJALA Centre', 'Garage School', 'Deaf Reach', 'Nixor College'];

  return (
    <section className="fade-section" style={{
      textAlign: 'center',
      padding: '48px 24px',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '14px',
        fontWeight: 500,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginBottom: '24px',
      }}>
        Trusted by schools in Pakistan & UAE
      </p>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        {schools.map((s) => (
          <div key={s} style={{
            background: C.white,
            padding: '12px 28px',
            borderRadius: '50px',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: C.text,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}>
            {s}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── About Section ───
function AboutSection() {
  const features = [
    {
      icon: '🧠',
      title: 'Learns How You Learn',
      desc: 'Starky adapts to each child\'s pace, strengths, and weak spots — getting smarter every session.',
    },
    {
      icon: '📝',
      title: 'Real Exam Questions',
      desc: '89,000+ verified questions from Cambridge, Edexcel, SAT, and more. No AI-generated filler.',
    },
    {
      icon: '🌍',
      title: 'Any Language, Any Subject',
      desc: 'Study in Urdu, Arabic, Chinese, or 13 other languages. STEM always in English.',
    },
  ];

  return (
    <section id="about" className="fade-section" style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '60px 24px 80px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      alignItems: 'start',
    }}>
      <div style={{
        background: C.primary,
        borderRadius: '24px',
        padding: '48px 40px',
        color: C.white,
      }}>
        <h2 style={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 800,
          fontSize: '32px',
          lineHeight: 1.2,
          margin: '0 0 20px 0',
        }}>
          The examiner inside the tutor.
        </h2>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '16px',
          lineHeight: 1.7,
          opacity: 0.9,
          margin: 0,
        }}>
          Starky doesn't just teach — it thinks like a Cambridge examiner. Every question comes from
          real past papers. Every explanation matches the mark scheme. Every session makes your child
          more exam-ready than the last.
        </p>
        <div style={{
          marginTop: '32px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          {['Cambridge', 'Edexcel', 'SAT', 'SEN'].map((tag) => (
            <span key={tag} style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '6px 18px',
              borderRadius: '50px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px',
              fontWeight: 600,
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {features.map((f) => (
          <div key={f.title}
            className="feature-card"
            style={{
              background: C.white,
              borderRadius: '20px',
              padding: '28px 28px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)';
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
            <h3 style={{
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 800,
              fontSize: '18px',
              color: C.text,
              margin: '0 0 8px 0',
            }}>
              {f.title}
            </h3>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              color: '#666',
              lineHeight: 1.6,
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

// ─── Footer ───
function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '48px 24px',
      background: C.bg,
    }}>
      <p style={{
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 700,
        fontSize: '16px',
        color: C.primary,
        margin: 0,
      }}>
        NewWorldEdu ★ — Every child deserves a world-class tutor
      </p>
      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '13px',
        color: '#999',
        marginTop: '12px',
      }}>
        © {new Date().getFullYear()} NewWorldEdu. All rights reserved.
      </p>
    </footer>
  );
}

// ─── Background Floating Shapes (page-wide) ───
function BackgroundShapes() {
  const shapes = [
    { shape: '★', color: C.green, size: 40, top: '15%', left: '3%', delay: 0, animation: 'float' },
    { shape: '◆', color: C.pink, size: 30, top: '25%', right: '4%', delay: 1.2, animation: 'spin' },
    { shape: '●', color: C.yellow, size: 22, top: '45%', left: '6%', delay: 0.6, animation: 'pulse' },
    { shape: '▲', color: C.primary, size: 26, top: '55%', right: '5%', delay: 2, animation: 'float' },
    { shape: '★', color: C.pink, size: 20, top: '70%', left: '4%', delay: 1.8, animation: 'spin' },
    { shape: '◆', color: C.green, size: 34, top: '80%', right: '6%', delay: 0.3, animation: 'pulse' },
    { shape: '●', color: C.primary, size: 18, top: '35%', left: '92%', delay: 1, animation: 'float' },
    { shape: '▲', color: C.yellow, size: 24, top: '65%', left: '94%', delay: 0.9, animation: 'spin' },
  ];

  return (
    <>
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}
    </>
  );
}

// ─── Main Page ───
export default function LandingV2() {
  const mainRef = useRef(null);

  useEffect(() => {
    // Staggered hero text reveal
    const heroLines = document.querySelectorAll('.hero-line');
    heroLines.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });

    // Scroll-triggered section fade-in
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.15 }
    );

    const sections = document.querySelectorAll('.fade-section');
    sections.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>NewWorldEdu — Every Child Deserves a World-Class Tutor</title>
        <meta name="description" content="89,000+ verified Cambridge questions. 24/7 AI tutor in 16 languages. Better grades in 30 days." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @media (max-width: 768px) {
          #about-grid {
            grid-template-columns: 1fr !important;
          }
          nav {
            padding: 14px 20px !important;
          }
        }
      `}</style>

      <div ref={mainRef} style={{
        background: C.bg,
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <BackgroundShapes />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <MarqueeTicker />
          <Navbar />
          <HeroSection />
          <TrustRow />
          <AboutSection />
          <Footer />
        </div>
      </div>
    </>
  );
}
