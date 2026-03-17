import Head from 'next/head';

export default function ChampionshipParents() {
  const S = {
    page: { minHeight: '100vh', background: '#080C18', color: '#fff', fontFamily: "'Nunito',-apple-system,sans-serif", padding: '40px 20px 80px' },
    container: { maxWidth: 680, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, marginBottom: 16 },
    h1: { fontSize: 28, fontWeight: 900, marginBottom: 8 },
    h2: { fontSize: 18, fontWeight: 800, marginTop: 0, marginBottom: 12, color: '#fff' },
    body: { fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' },
    link: { color: '#4F8EF7' },
    ul: { paddingLeft: 20 },
  };

  return (
    <div style={S.page}>
      <Head>
        <title>For Parents — NewWorld Championship</title>
        <meta name="description" content="Information for parents about the NewWorld Championship. What it is, how data is protected, and how to contact us." />
      </Head>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>👨‍👩‍👧‍👦</div>
          <h1 style={S.h1}>Information for Parents</h1>
          <p style={S.body}>Your child wants to join the NewWorld Championship. Here is everything you need to know.</p>
        </div>

        <div style={S.card}>
          <h2 style={S.h2}>What Is the NewWorld Championship?</h2>
          <div style={S.body}>
            <p style={{ margin: '0 0 12px' }}>The NewWorld Championship is a <strong style={{ color: '#fff' }}>free referral competition</strong> for students using NewWorld Education, an AI-powered tutoring platform for Pakistani students.</p>
            <p style={{ margin: '0 0 12px' }}>Students earn points by referring classmates and friends to use NewWorldEdu. At the end of each season (30 days), the students with the most referrals win prizes like smart glasses, AirPods, and mobile credit.</p>
            <p style={{ margin: 0 }}>Key facts:</p>
            <ul style={S.ul}>
              <li><strong style={{ color: '#4ADE80' }}>It is completely free.</strong> There is no entry fee, no subscription required, no hidden cost.</li>
              <li>Referred friends must actually use the platform (3 learning sessions in 7 days) for a referral to count — this is not spam.</li>
              <li>It encourages students to share a learning resource with their peers.</li>
              <li>It is not a lottery, MLM, pyramid scheme, or gambling. Winners are determined by effort, not chance.</li>
            </ul>
          </div>
        </div>

        <div style={S.card}>
          <h2 style={S.h2}>What Data Is Collected</h2>
          <div style={S.body}>
            <p style={{ margin: '0 0 12px' }}>We collect the minimum data necessary to run the competition:</p>
            <ul style={S.ul}>
              <li><strong style={{ color: '#fff' }}>Name:</strong> First name only is displayed publicly on the leaderboard</li>
              <li><strong style={{ color: '#fff' }}>Email:</strong> Used for account identification and competition notifications</li>
              <li><strong style={{ color: '#fff' }}>School:</strong> Optional — used for the school leaderboard only</li>
              <li><strong style={{ color: '#fff' }}>Date of birth:</strong> Used solely for age verification (to ensure 5-18 eligibility)</li>
              <li><strong style={{ color: '#fff' }}>Parent email:</strong> For under-13 participants, used to request your consent</li>
              <li><strong style={{ color: '#fff' }}>Delivery address:</strong> Collected from winners only, used solely for prize shipping</li>
            </ul>
          </div>
        </div>

        <div style={S.card}>
          <h2 style={S.h2}>How Privacy Is Protected</h2>
          <div style={S.body}>
            <ul style={S.ul}>
              <li>Your child's data is <strong style={{ color: '#fff' }}>never sold, rented, or shared</strong> with any third party for any purpose</li>
              <li>Only the child's <strong style={{ color: '#fff' }}>first name and school</strong> appear on the public leaderboard — never full names or email addresses</li>
              <li>Championship data is stored securely on Upstash Redis (encrypted at rest) and Vercel (SOC 2 certified hosting)</li>
              <li>You can request deletion of all championship data at any time by emailing us</li>
              <li>Data collected for the competition is used <strong style={{ color: '#fff' }}>only for the competition</strong> — not for marketing, not for advertising, not for any other purpose</li>
              <li>We comply with PECA 2016 (Pakistan's electronic crime prevention law)</li>
            </ul>
          </div>
        </div>

        <div style={S.card}>
          <h2 style={S.h2}>Who Runs This</h2>
          <div style={S.body}>
            <p style={{ margin: '0 0 12px' }}>NewWorld Education is founded by <strong style={{ color: '#fff' }}>Khurram Badar</strong>, based in <strong style={{ color: '#fff' }}>Karachi, Pakistan</strong>.</p>
            <p style={{ margin: '0 0 12px' }}>NewWorldEdu provides AI-powered tutoring for Pakistani students from KG through A Levels, covering Cambridge O/A Level, Matric, and FSc curricula. The Championship is a marketing initiative to help more students discover the platform.</p>
            <p style={{ margin: 0 }}>This is a real company with a real product. You can verify this by visiting <a href="https://www.newworld.education" style={S.link}>newworld.education</a> and trying the tutoring yourself.</p>
          </div>
        </div>

        <div style={S.card}>
          <h2 style={S.h2}>Contact Us Directly</h2>
          <div style={S.body}>
            <p style={{ margin: '0 0 16px' }}>If you have any questions or concerns, reach out directly. A real person will respond.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="mailto:hello@newworld.education" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 12, padding: '12px 16px', color: '#4F8EF7', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                <span style={{ fontSize: 20 }}>📧</span> hello@newworld.education
              </a>
              <a href="https://wa.me/923262266682" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: 12, padding: '12px 16px', color: '#25D366', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                <span style={{ fontSize: 20 }}>💬</span> +92 326 226 6682 (WhatsApp)
              </a>
            </div>
          </div>
        </div>

        <div style={S.card}>
          <h2 style={S.h2}>Legal Documents</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href="/championship/terms" style={{ ...S.link, fontWeight: 700, fontSize: 14 }}>Championship Terms & Conditions</a>
            <a href="/privacy" style={{ ...S.link, fontWeight: 700, fontSize: 14 }}>Privacy Policy</a>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div style={{ ...S.card, textAlign: 'center', borderColor: 'rgba(37,211,102,0.3)', background: 'rgba(37,211,102,0.05)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
          <h2 style={{ ...S.h2, fontSize: 17 }}>Still Have Questions?</h2>
          <p style={{ ...S.body, margin: '0 0 16px', fontSize: 14 }}>WhatsApp us right now. A real person in Karachi will reply.</p>
          <a href="https://wa.me/923262266682?text=Hi%2C%20I%20am%20a%20parent%20and%20have%20questions%20about%20the%20NewWorld%20Championship" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 32px', fontWeight: 800, fontSize: 15, textDecoration: 'none', fontFamily: 'inherit' }}>
            WhatsApp Us Now
          </a>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.8 }}>
          <a href="/championship" style={{ color: 'rgba(255,255,255,0.4)' }}>Championship</a>
          <span style={{ margin: '0 8px' }}>·</span>
          <a href="/championship/trust" style={{ color: 'rgba(255,255,255,0.4)' }}>Is This Real?</a>
          <span style={{ margin: '0 8px' }}>·</span>
          <a href="/championship/terms" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms</a>
        </div>
      </div>
    </div>
  );
}
