import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const PLAN_DETAILS = {
  starter: {
    name: 'Starter Plan',
    emoji: '⭐',
    limit: 25,
    color: '#4F8EF7',
    message: 'Starky is ready to help your child from KG to Grade 8!',
  },
  scholar: {
    name: 'Scholar Plan',
    emoji: '🎓',
    limit: 25,
    color: '#7C5CBF',
    message: 'Starky is ready for O-Levels & A-Levels mastery!',
  },
  family: {
    name: 'Family Plan',
    emoji: '👨‍👩‍👧‍👦',
    limit: 25,
    color: '#2BB55A',
    message: 'All your children now have access to Starky!',
  },
  'creative-bundle': {
    name: 'Creative Bundle',
    emoji: '🎨',
    limit: -1, // unlimited for creative subjects
    color: '#FF8C69',
    message: 'Unlimited Music, Arts & Reading sessions unlocked for every age!',
  },
  'special-needs': {
    name: 'Special Needs Plan',
    emoji: '💜',
    limit: -1, // unlimited
    color: '#E05F9A',
    message: 'Starky is fully prepared with unlimited patience and support!',
  },
};

export default function Start() {
  const router = useRouter();
  const { plan, sub } = router.query;
  const [activated, setActivated] = useState(false);

  const planDetails = PLAN_DETAILS[plan] || PLAN_DETAILS.starter;

  useEffect(() => {
    if (!plan || !sub) return;

    // Save plan info to localStorage
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year from now

    const planData = {
      plan: plan,
      subscriptionId: sub,
      activatedAt: new Date().toISOString(),
      expiresAt: expiryDate.toISOString(),
      dailyLimit: planDetails.limit,
    };

    localStorage.setItem('nw_plan', JSON.stringify(planData));
    setActivated(true);
  }, [plan, sub]);

  return (
    <>
      <Head>
        <title>Welcome to NewWorldEdu!</title>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #0A0F1E; font-family: 'Inter', sans-serif; color: #fff;
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
        }

        .container {
          text-align: center; padding: 40px 24px; max-width: 520px; width: 100%;
          animation: fadeUp 0.6s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .success-ring {
          width: 100px; height: 100px; border-radius: 50%;
          border: 3px solid currentColor;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 28px; font-size: 44px;
          animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both;
        }

        @keyframes pop {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        h1 {
          font-family: 'Sora', sans-serif; font-size: 32px; font-weight: 800;
          margin-bottom: 12px; line-height: 1.2;
        }

        .plan-badge {
          display: inline-block; border-radius: 100px;
          padding: 6px 20px; font-size: 14px; font-weight: 600;
          font-family: 'Sora', sans-serif; margin-bottom: 20px;
          border: 1px solid currentColor;
        }

        p {
          font-size: 16px; color: rgba(255,255,255,0.6);
          line-height: 1.7; margin-bottom: 36px;
        }

        .features {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 24px; margin-bottom: 36px; text-align: left;
        }

        .feature-item {
          display: flex; align-items: center; gap: 12px;
          padding: 8px 0; font-size: 14px; color: rgba(255,255,255,0.75);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .feature-item:last-child { border-bottom: none; }
        .feature-item .icon { font-size: 18px; flex-shrink: 0; width: 28px; text-align: center; }

        .btn-primary {
          display: inline-block; padding: 16px 40px; border-radius: 100px;
          font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700;
          text-decoration: none; color: #fff; transition: transform 0.15s, opacity 0.15s;
          cursor: pointer; border: none;
        }
        .btn-primary:hover { transform: scale(1.03); opacity: 0.9; }

        .sub-links { margin-top: 20px; display: flex; gap: 24px; justify-content: center; }
        .sub-links a { color: rgba(255,255,255,0.35); font-size: 13px; text-decoration: none; }
        .sub-links a:hover { color: rgba(255,255,255,0.6); }
      `}</style>

      <div className="container"><div style={{position:"fixed",top:0,left:0,right:0,zIndex:999,background:"rgba(8,12,24,0.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"0 16px",height:"52px",display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:"15px",color:"#fff"}}>NewWorldEdu<span style={{color:"#4F8EF7"}}>★</span></span><a href="/" style={{color:"#fff",fontSize:"13px",fontWeight:800,textDecoration:"none",background:"linear-gradient(135deg,#4F8EF7,#7C5CBF)",borderRadius:"20px",padding:"6px 16px"}}>← Home</a></div><div style={{height:"52px"}} />
        <div
          className="success-ring"
          style={{ color: planDetails.color, borderColor: planDetails.color }}
        >
          {planDetails.emoji}
        </div>

        <h1>You're all set!</h1>

        <div
          className="plan-badge"
          style={{ color: planDetails.color, borderColor: planDetails.color }}
        >
          {planDetails.name} Active
        </div>

        <p>{planDetails.message}</p>

        <div className="features">
          <div className="feature-item">
            <span className="icon">📚</span>
            <span>All subjects covered — Maths, Science, English & more</span>
          </div>
          <div className="feature-item">
            <span className="icon">⏰</span>
            <span>Available 24/7 — whenever your child needs help</span>
          </div>
          <div className="feature-item">
            <span className="icon">📧</span>
            <span>Learning reports sent to your email after each session</span>
          </div>
          <div className="feature-item">
            <span className="icon">
              {planDetails.limit === -1 ? '∞' : '🔢'}
            </span>
            <span>
              {planDetails.limit === -1
                ? 'Unlimited sessions every day'
                : `${planDetails.limit} sessions per day`}
            </span>
          </div>
        </div>

        {plan === 'special-needs' ? (
          <Link href="/special-needs">
            <a
              className="btn-primary"
              style={{ background: `linear-gradient(135deg, ${planDetails.color}, #A855F7)` }}
            >
              Start Learning with Starky ★
            </a>
          </Link>
        ) : (
          <Link href="/">
            <a
              className="btn-primary"
              style={{ background: `linear-gradient(135deg, ${planDetails.color}, #6366F1)` }}
            >
              Start Learning with Starky ★
            </a>
          </Link>
        )}

        <div className="sub-links">
          <Link href="/parent"><a>Parent Dashboard</a></Link>
          <Link href="/pricing"><a>View Plan Details</a></Link>
        </div>
      </div>
    </>
  );
}
