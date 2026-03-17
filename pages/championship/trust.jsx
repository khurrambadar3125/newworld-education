import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function ChampionshipTrust() {
  const [data, setData] = useState(null);
  const [eligibility, setEligibility] = useState({ age: '', city: '', result: null });
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    fetch('/api/championship/join')
      .then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const checkEligibility = () => {
    const age = parseInt(eligibility.age);
    const city = eligibility.city.trim().toLowerCase();
    if (!age || !city) { setEligibility(e => ({ ...e, result: 'fill' })); return; }
    if (age < 5 || age > 18) { setEligibility(e => ({ ...e, result: 'age' })); return; }
    setEligibility(e => ({ ...e, result: 'yes' }));
  };

  const board = data?.leaderboard?.slice(0, 3) || [];
  const count = data?.participantCount || 0;

  const S = {
    page: { minHeight: '100vh', background: '#080C18', color: '#fff', fontFamily: "'Nunito',-apple-system,sans-serif", padding: '40px 20px 80px' },
    container: { maxWidth: 680, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, marginBottom: 16 },
    h1: { fontSize: 28, fontWeight: 900, marginBottom: 8 },
    h2: { fontSize: 20, fontWeight: 800, marginTop: 0, marginBottom: 12, color: '#fff' },
    body: { fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' },
    link: { color: '#4F8EF7' },
    badge: { display: 'inline-block', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 100, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#4ADE80', marginRight: 8 },
    input: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, marginBottom: 8, boxSizing: 'border-box', fontFamily: 'inherit' },
    btn: { background: 'linear-gradient(135deg,#6c63ff,#4F8EF7)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' },
    faqQ: (open) => ({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', fontWeight: 700, fontSize: 15, color: open ? '#FFC300' : '#fff' }),
    faqA: { padding: '8px 0 16px', fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' },
  };

  const faqs = [
    { q: 'Is this competition real?', a: 'Yes. The NewWorld Championship is run by NewWorld Education, a real education company based in Karachi, Pakistan. The founder is Khurram Badar. You can email hello@newworld.education or WhatsApp +92 326 226 6682 right now and a real person will respond. The leaderboard on this page is live data — not a screenshot, not fake. Every referral is verified automatically.' },
    { q: 'Has anyone actually won a prize?', a: data?.config?.season > 1 ? `Yes! Season winners are announced at the end of each season and receive their prizes via courier delivery within Pakistan.` : 'Season 1 is currently live — this is your chance to be the first winner! Prizes are purchased and ready to ship the moment a season ends. We have already allocated the budget.' },
    { q: 'What if I win but do not get my prize?', a: 'When a season ends, winners get an email with a claim link. You submit your address, and we ship via TCS Express, Leopards, or Pakistan Post depending on your city. You will get a shipping confirmation. If there is any issue, email hello@newworld.education or WhatsApp us — we will resolve it. We have a legal obligation under Pakistani law to deliver what we promise.' },
    { q: 'How do I know the leaderboard is not fake?', a: 'The leaderboard is powered by live data from our database. Every referral is verified: the referred person must be a real account, registered for at least 7 days, and must have completed at least 3 learning sessions. You can see your own referral count update in real time. There is no manual editing of the leaderboard — it is fully automated.' },
    { q: 'My parents do not believe this is real.', a: 'We understand! We have created a dedicated page for parents that explains everything: what data we collect, how the competition works, and how to contact us directly. Show them the parent trust page or ask them to WhatsApp us at +92 326 226 6682.' },
    { q: 'What if the competition gets cancelled?', a: 'If a season is cancelled mid-way for any reason, all participants with qualifying referrals receive an equivalent benefit (such as extended free months of NewWorldEdu). This is written in our Terms & Conditions. We have never cancelled a season and have no plans to.' },
  ];

  return (
    <div style={S.page}>
      <Head>
        <title>Is the Championship Real? — NewWorld Education</title>
        <meta name="description" content="Yes, the NewWorld Championship is real. Real prizes, real company, real people in Karachi. Here is the proof." />
      </Head>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔍</div>
          <h1 style={S.h1}>Is This Competition Real?</h1>
          <p style={S.body}>We know it sounds too good to be true. Here is everything you need to see.</p>
        </div>

        {/* Who we are */}
        <div style={S.card}>
          <h2 style={S.h2}>We Are Real People</h2>
          <div style={S.body}>
            <p style={{ margin: '0 0 12px' }}><strong style={{ color: '#fff' }}>Founded by:</strong> Khurram Badar</p>
            <p style={{ margin: '0 0 12px' }}><strong style={{ color: '#fff' }}>Location:</strong> Karachi, Pakistan</p>
            <p style={{ margin: '0 0 12px' }}><strong style={{ color: '#fff' }}>Email:</strong> <a href="mailto:hello@newworld.education" style={S.link}>hello@newworld.education</a></p>
            <p style={{ margin: '0 0 12px' }}><strong style={{ color: '#fff' }}>WhatsApp:</strong> <a href="https://wa.me/923262266682" style={S.link}>+92 326 226 6682</a> — message right now and see</p>
            <p style={{ margin: '0 0 0' }}><strong style={{ color: '#fff' }}>Website:</strong> <a href="https://www.newworld.education" style={S.link}>newworld.education</a></p>
          </div>
        </div>

        {/* Live stats */}
        <div style={S.card}>
          <h2 style={S.h2}>Live Numbers (Not Screenshots)</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ flex: 1, minWidth: 120, background: 'rgba(255,195,0,0.08)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#FFC300' }}>{count}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Participants</div>
            </div>
            <div style={{ flex: 1, minWidth: 120, background: 'rgba(74,222,128,0.08)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#4ADE80' }}>{data?.config?.season || 1}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Current Season</div>
            </div>
            <div style={{ flex: 1, minWidth: 120, background: 'rgba(79,142,247,0.08)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#4F8EF7' }}>{data?.config?.daysLeft || '—'}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Days Left</div>
            </div>
          </div>
          <p style={{ ...S.body, margin: 0, fontSize: 13 }}>These numbers are live from our database. Refresh this page and they update in real time.</p>
        </div>

        {/* Live leaderboard preview */}
        <div style={S.card}>
          <h2 style={S.h2}>Live Leaderboard (Top 3)</h2>
          {board.length === 0 ? (
            <p style={{ ...S.body, textAlign: 'center', margin: 0 }}>No referrals yet — be the first on the board!</p>
          ) : board.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#FFC300', width: 28 }}>#{b.rank}</span>
              <div style={{ flex: 1 }}><span style={{ fontWeight: 700 }}>{b.name}</span> <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{b.school}</span></div>
              <span style={{ fontWeight: 800, color: '#4ADE80' }}>{b.points}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <a href="/championship" style={{ ...S.link, fontSize: 13, fontWeight: 700 }}>View full leaderboard</a>
          </div>
        </div>

        {/* Previous winners */}
        <div style={S.card}>
          <h2 style={S.h2}>Previous Winners</h2>
          {data?.config?.season > 1 ? (
            <p style={S.body}>Winners from previous seasons received their prizes via courier. Check the Championship page for past season results.</p>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🌟</div>
              <p style={{ ...S.body, fontWeight: 700, color: '#FFC300', margin: 0 }}>Season 1 is live — be the first winner!</p>
              <p style={{ ...S.body, fontSize: 13, margin: '8px 0 0' }}>No previous winners yet because this is our very first season. This is your chance to make history.</p>
            </div>
          )}
        </div>

        {/* Prize authenticity */}
        <div style={S.card}>
          <h2 style={S.h2}>Prize Authenticity</h2>
          <div style={S.body}>
            <p style={{ margin: '0 0 12px' }}>All prizes are genuine, brand-new products purchased from authorised retailers in Pakistan.</p>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li>Meta Ray-Ban Gen 2 smart glasses — purchased from official Meta partner</li>
              <li>Apple AirPods — purchased from authorised Apple reseller</li>
              <li>Rs 5,000 mobile credit — loaded directly to your network (Jazz, Zong, Telenor, Ufone)</li>
            </ul>
            <p style={{ margin: '12px 0 0' }}>Prize budget is allocated from NewWorld Education's marketing budget before each season starts. The prizes exist before the competition begins.</p>
          </div>
        </div>

        {/* Eligibility checker */}
        <div style={{ ...S.card, borderColor: 'rgba(108,99,255,0.3)' }}>
          <h2 style={S.h2}>Check Your Eligibility</h2>
          <p style={{ ...S.body, margin: '0 0 16px', fontSize: 14 }}>Enter your age and city to check instantly.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input type="number" placeholder="Your age" value={eligibility.age} onChange={e => setEligibility({ ...eligibility, age: e.target.value, result: null })} style={{ ...S.input, flex: 1, minWidth: 100 }} />
            <input placeholder="Your city" value={eligibility.city} onChange={e => setEligibility({ ...eligibility, city: e.target.value, result: null })} style={{ ...S.input, flex: 1, minWidth: 140 }} />
          </div>
          <button onClick={checkEligibility} style={{ ...S.btn, width: '100%', marginTop: 4 }}>Check Eligibility</button>
          {eligibility.result === 'yes' && (
            <div style={{ marginTop: 12, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 12, padding: '12px 16px', color: '#4ADE80', fontWeight: 700, fontSize: 14 }}>
              You are eligible! You can join the Championship right now.
              <div style={{ marginTop: 8 }}><a href="/championship" style={{ color: '#4ADE80', fontWeight: 800 }}>Join Now</a></div>
            </div>
          )}
          {eligibility.result === 'age' && (
            <div style={{ marginTop: 12, background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 12, padding: '12px 16px', color: '#FF6464', fontWeight: 700, fontSize: 14 }}>
              Sorry, the Championship is open to ages 5-18 only. If you are a parent, your child can participate!
            </div>
          )}
          {eligibility.result === 'fill' && (
            <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Please enter both your age and city.</div>
          )}
        </div>

        {/* FAQ */}
        <div style={S.card}>
          <h2 style={S.h2}>Frequently Asked Questions</h2>
          {faqs.map((faq, i) => (
            <div key={i}>
              <div style={S.faqQ(openFAQ === i)} onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                <span>{faq.q}</span>
                <span style={{ fontSize: 18, marginLeft: 12 }}>{openFAQ === i ? '−' : '+'}</span>
              </div>
              {openFAQ === i && <div style={S.faqA}>{faq.a}</div>}
            </div>
          ))}
        </div>

        {/* Parent CTA */}
        <div style={{ ...S.card, textAlign: 'center', borderColor: 'rgba(255,195,0,0.2)', background: 'rgba(255,195,0,0.04)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>👨‍👩‍👧‍👦</div>
          <h2 style={{ ...S.h2, fontSize: 17 }}>Want Your Parents to See This?</h2>
          <p style={{ ...S.body, margin: '0 0 16px', fontSize: 14 }}>We have a dedicated trust page for parents with all the information they need.</p>
          <a href="/championship/parents" style={{ ...S.btn, display: 'inline-block', textDecoration: 'none', background: 'linear-gradient(135deg,#FFC300,#FF8C00)', color: '#060B20' }}>
            Show Parents Page
          </a>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.8 }}>
          <a href="/championship" style={{ color: 'rgba(255,255,255,0.4)' }}>Championship</a>
          <span style={{ margin: '0 8px' }}>·</span>
          <a href="/championship/terms" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms</a>
          <span style={{ margin: '0 8px' }}>·</span>
          <a href="/privacy" style={{ color: 'rgba(255,255,255,0.4)' }}>Privacy</a>
        </div>
      </div>
    </div>
  );
}
