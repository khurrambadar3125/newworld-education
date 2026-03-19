import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    emoji: '⭐',
    price: 29.99,
    pricePKR: 3499,
    period: 'month',
    planId: 'P-94P5336054823460NNGS5MIY',
    color: '#4F8EF7',
    highlight: false,
    for: 'KG to Grade 8',
    features: [
      '1 child',
      'KG to Grade 8',
      '25 sessions per day',
      'All subjects covered',
      'Learn 9 languages',
      'Spelling Bee games',
      'Interactive exercises',
      'Parent email reports',
      '7-day free trial',
    ],
  },
  {
    id: 'scholar',
    name: 'Scholar',
    emoji: '🎓',
    price: 39.99,
    pricePKR: 5499,
    period: 'month',
    planId: 'P-8FYS0096MF117684FNGS5QKA',
    color: '#7C5CBF',
    highlight: true,
    for: 'O & A-Levels',
    features: [
      '1 child',
      'O-Levels & A-Levels',
      '25 sessions per day',
      'Exam-focused tutoring',
      'Learn 9 languages',
      'Spelling Bee games',
      'Parent email reports',
      '7-day free trial',
    ],
  },
  {
    id: 'family',
    name: 'Family',
    emoji: '👨‍👩‍👧‍👦',
    price: 69.99,
    pricePKR: 7499,
    period: 'month',
    planId: 'P-0PS81623HP313672PNGS5SWA',
    color: '#2BB55A',
    highlight: false,
    for: 'Up to 4 children',
    features: [
      'Up to 4 children',
      'Any grade KG–A-Level',
      '25 sessions per day per child',
      'All subjects covered',
      'Learn 9 languages',
      'Spelling Bee games',
      'Interactive exercises',
      'Parent email reports',
      '7-day free trial',
    ],
  },
  {
  id: 'creative-bundle',
  name: 'Creative Bundle',
  emoji: '🎨',
  price: 79.99,
  pricePKR: 6499,
  period: 'month',
  planId: 'P-60C25004ES421424TNGTU3JA',
  color: '#FF8C69',
  highlight: false,
  for: 'Creative learners',
  desc: 'Creative learning unlocked. Music, Arts & Reading — unlimited sessions, every age.',
  features: [
    '1 child',
    'Unlimited Music sessions',
    'Unlimited Arts sessions',
    'Unlimited Reading sessions',
    'Learn 9 languages',
    'Spelling Bee games',
    'All ages KG to A-Level',
    '7-day free trial',
  ],
},
  {
    id: 'languages',
    name: 'Languages',
    emoji: '🌍',
    price: 12.99,
    pricePKR: 3499,
    period: 'month',
    planId: '',
    color: '#4F8EF7',
    highlight: false,
    for: 'Language Learners',
    features: [
      '9 languages to learn',
      '1,000+ words & phrases',
      'Pronunciation practice',
      'Mother tongue support',
      'Audio-first for young kids',
      'Hearts & XP system',
      '7-day free trial',
    ],
  },
  {
    id: 'spelling-bee',
    name: 'Spelling Bee',
    emoji: '🐝',
    price: 12.99,
    pricePKR: 3499,
    period: 'month',
    planId: '',
    color: '#F59E0B',
    highlight: false,
    for: 'KG to Grade 6',
    features: [
      '4 game modes',
      '210+ words, 7 grades',
      'TTS pronunciation',
      'XP, streaks & stars',
      'Spaced repetition',
      'Keyboard support',
      '7-day free trial',
    ],
  },
  {
  id: 'special-needs',
    name: 'Special Needs',
    emoji: '💜',
    price: 149,
    pricePKR: 5499,
    period: 'month',
    planId: 'P-4C972623LC808300XNGS5XDY',
    color: '#E05F9A',
    highlight: false,
    for: 'SEN Students',
    features: [
      '1 child',
      'SEN-trained AI tutor',
      'Unlimited sessions per day',
      'Adaptive learning pace',
      'Interactive SEN exercises',
      'Learn 9 languages',
      'Spelling Bee games',
      'Detailed parent reports',
      '7-day free trial',
    ],
  },
];

// Detect if user is likely in Pakistan/South Asia using timezone + locale
function useIsPakistan() {
  const [isPK, setIsPK] = useState(false);
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const lang = (navigator.language || '').toLowerCase();
      // Pakistan (Asia/Karachi), UAE (Asia/Dubai), India, Bangladesh, Sri Lanka
      const southAsianTZ = ['asia/karachi', 'asia/dubai', 'asia/kolkata', 'asia/dhaka', 'asia/colombo'];
      if (southAsianTZ.some(t => tz.toLowerCase().includes(t)) || lang.startsWith('ur') || lang.startsWith('hi') || lang.startsWith('ar')) {
        setIsPK(true);
      }
    } catch {}
  }, []);
  return isPK;
}

const USD_TO_PKR = 278;

export default function Pricing() {
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const isPK = useIsPakistan();

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) return;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.onload = () => setPaypalReady(true);
    script.onerror = () => setPaypalReady('failed');
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch {} };
  }, []);

  useEffect(() => {
    if (!paypalReady) return;

    PLANS.forEach((plan) => {
      if (window.paypal) {
        window.paypal.Buttons({
          style: {
            shape: 'pill',
            color: 'blue',
            layout: 'vertical',
            label: 'subscribe',
          },
          createSubscription: (data, actions) => {
            return actions.subscription.create({ plan_id: plan.planId });
          },
          onApprove: (data) => {
            router.push(`/start?plan=${plan.id}&sub=${data.subscriptionID}`);
          },
          onError: (err) => {
            console.error('PayPal error:', err);
            alert('Payment failed. Please try again.');
          },
        }).render(`#paypal-button-${plan.id}`);
      }
    });
  }, [paypalReady]);

  return (
    <>
      <Head>
        <title>Plans & Pricing — NewWorldEdu</title>
        <meta name="description" content="Choose your NewWorldEdu plan. AI-powered tutoring from KG to A-Levels." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0F1E; font-family: 'Inter', sans-serif; color: #fff; min-height: 100vh; }

        .page { padding: 60px 20px 100px; max-width: 1100px; margin: 0 auto; }

        .back-link {
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.5); text-decoration: none; font-size: 14px;
          margin-bottom: 48px; transition: color 0.2s;
        }
        .back-link:hover { color: #fff; }

        .hero { text-align: center; margin-bottom: 64px; }
        .hero-badge {
          display: inline-block; background: rgba(79,142,247,0.15);
          border: 1px solid rgba(79,142,247,0.3); border-radius: 100px;
          padding: 6px 18px; font-size: 13px; color: #4F8EF7;
          font-family: 'Sora', sans-serif; margin-bottom: 20px; letter-spacing: 0.05em;
        }
        .hero h1 {
          font-family: 'Sora', sans-serif; font-size: clamp(36px, 5vw, 58px);
          font-weight: 800; line-height: 1.15; margin-bottom: 16px;
        }
        .hero h1 span { background: linear-gradient(135deg, #4F8EF7, #A78BFA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 17px; color: rgba(255,255,255,0.55); max-width: 480px; margin: 0 auto; line-height: 1.7; }

        .trial-banner {
          background: linear-gradient(135deg, rgba(43,181,90,0.15), rgba(43,181,90,0.05));
          border: 1px solid rgba(43,181,90,0.3); border-radius: 12px;
          padding: 14px 24px; text-align: center; margin-bottom: 48px;
          font-size: 15px; color: rgba(255,255,255,0.8);
        }
        .trial-banner strong { color: #2BB55A; }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .plan-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 32px 28px;
          position: relative; transition: transform 0.2s, border-color 0.2s;
        }
        .plan-card:hover { transform: translateY(-4px); }
        .plan-card.highlight {
          background: rgba(255,255,255,0.07);
          border-color: rgba(124,92,191,0.5);
        }

        .popular-badge {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, #7C5CBF, #A78BFA);
          border-radius: 100px; padding: 4px 16px;
          font-size: 11px; font-family: 'Sora', sans-serif; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap;
        }

        .plan-emoji { font-size: 32px; margin-bottom: 12px; display: block; }

        .plan-for {
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 6px; opacity: 0.6;
        }

        .plan-name {
          font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 700;
          margin-bottom: 16px;
        }

        .plan-price {
          display: flex; align-items: baseline; gap: 4px; margin-bottom: 6px;
        }
        .plan-price .amount {
          font-family: 'Sora', sans-serif; font-size: 42px; font-weight: 800;
        }
        .plan-price .currency { font-size: 20px; font-weight: 600; opacity: 0.7; margin-top: 4px; }
        .plan-price .period { font-size: 14px; opacity: 0.5; }
        .pkr-price {
          font-size: 12px; color: rgba(255,255,255,0.35); margin-bottom: 18px; letter-spacing: 0.02em;
        }
        .pkr-price span { color: rgba(255,255,255,0.55); font-weight: 600; }

        .plan-features { list-style: none; margin-bottom: 28px; }
        .plan-features li {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 14px; color: rgba(255,255,255,0.7);
          padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .plan-features li:last-child { border-bottom: none; }
        .plan-features li::before {
          content: '✓'; color: #2BB55A; font-weight: 700; flex-shrink: 0; font-size: 13px; margin-top: 1px;
        }

        .paypal-container { min-height: 50px; }

        .divider { text-align: center; margin: 64px 0 32px; }
        .divider p { color: rgba(255,255,255,0.3); font-size: 14px; }

        .faq { max-width: 640px; margin: 0 auto; }
        .faq h2 { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 24px; text-align: center; }
        .faq-item { margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.07); padding-bottom: 16px; }
        .faq-item p { font-size: 13px; color: rgba(255,255,255,0.4); }
        .faq-item strong { display: block; font-size: 15px; color: rgba(255,255,255,0.85); margin-bottom: 6px; font-family: 'Sora', sans-serif; }

        @media (max-width: 600px) {
          .plans-grid { grid-template-columns: 1fr; }
          .plan-card { padding: 22px 16px; }
        }
      `}</style>

      <div className="page">
        <a href="/" className="back-link">← Back to Starky</a>

        <div className="hero">
          <div className="hero-badge">★ Powered by Claude AI</div>
          <h1>Unlock <span>Unlimited Learning</span><br />for Your Child</h1>
          <p>Expert AI tutoring from KG through A-Levels. Personalised, affordable, available 24/7.</p>
        </div>

        <div className="trial-banner">
          🎁 <strong>All plans include a 7-day free trial.</strong> Cancel anytime, no questions asked.
        </div>

        <div className="plans-grid">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`plan-card ${plan.highlight ? 'highlight' : ''}`}>
              {plan.highlight && <div className="popular-badge">Most Popular</div>}
              <span className="plan-emoji">{plan.emoji}</span>
              <div className="plan-for">{plan.for}</div>
              <div className="plan-name">{plan.name}</div>
              {isPK ? (
                <>
                  <div className="plan-price">
                    <span className="currency" style={{fontSize:'60%'}}>Rs</span>
                    <span className="amount">{(plan.pricePKR || Math.round(plan.price * USD_TO_PKR)).toLocaleString()}</span>
                    <span className="period">/mo</span>
                  </div>
                  <div className="pkr-price">≈ ${plan.price % 1 === 0 ? plan.price : plan.price.toFixed(2)}/month</div>
                </>
              ) : (
                <>
                  <div className="plan-price">
                    <span className="currency">$</span>
                    <span className="amount">{plan.price % 1 === 0 ? plan.price : plan.price.toFixed(2)}</span>
                    <span className="period">/mo</span>
                  </div>
                  <div className="pkr-price">≈ <span>PKR {Math.round(plan.price * USD_TO_PKR).toLocaleString()}</span>/month</div>
                </>
              )}
              <ul className="plan-features">
                {plan.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>

              {/* PRIMARY CTA: JazzCash WhatsApp — for Pakistan users */}
              <a
                href={`https://wa.me/923262266682?text=${encodeURIComponent(`Hi, I want to subscribe to the NewWorldEdu ${plan.name} Plan (Rs ${plan.pricePKR?.toLocaleString()}/month). Please activate my account.\n\nName: \nEmail: \nChild's Grade: `)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#fff', border: 'none', borderRadius: 14, padding: '16px 20px',
                  fontSize: 16, fontWeight: 800, textDecoration: 'none', width: '100%',
                  fontFamily: "'Sora', sans-serif",
                  boxShadow: '0 6px 24px rgba(37,211,102,0.3)',
                  marginBottom: 6,
                }}>
                <span style={{ fontSize: 22 }}>💬</span>
                Subscribe via WhatsApp — Rs {plan.pricePKR?.toLocaleString()}/mo
              </a>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: 2, marginBottom: 16 }}>JazzCash / EasyPaisa / Bank Transfer — instant activation via WhatsApp</div>

              {/* SECONDARY: PayPal — for overseas/international users */}
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Or pay with PayPal (international)</div>
              <div className="paypal-container" id={`paypal-button-${plan.id}`}>
                {!paypalReady && (
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
                    Loading PayPal...
                  </div>
                )}
                {paypalReady === 'failed' && (
                  <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#F87171', textAlign: 'center' }}>
                    PayPal unavailable — use WhatsApp above
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="divider"><p>Questions? Email us at hello@newworld.education</p></div>

        <div className="faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <strong>How does the free trial work?</strong>
            <p>You get 7 full days free with any plan. We won't charge you until the trial ends. Cancel any time before then with no charge.</p>
          </div>
          <div className="faq-item">
            <strong>What subjects does Starky cover?</strong>
            <p>All core subjects including Maths, Sciences, English, History, Geography, and more — aligned to the curriculum for your child's grade.</p>
          </div>
          <div className="faq-item">
            <strong>Can I switch plans later?</strong>
            <p>Yes, you can upgrade or downgrade your plan at any time from your parent dashboard.</p>
          </div>
          <div className="faq-item">
            <strong>Is my payment secure?</strong>
            <p>Yes. All payments are processed securely by PayPal. We never store your card details.</p>
          </div>
        </div>
      </div>
    </>
  );
}
