import Head from 'next/head';

export default function ChampionshipTerms() {
  const S = {
    page: { minHeight: '100vh', background: '#080C18', color: '#fff', fontFamily: "'Nunito',-apple-system,sans-serif", padding: '40px 20px 80px' },
    container: { maxWidth: 700, margin: '0 auto' },
    h1: { fontSize: 28, fontWeight: 900, marginBottom: 8 },
    updated: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 32 },
    body: { fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' },
    h2: { fontSize: 18, fontWeight: 800, marginTop: 36, marginBottom: 8, color: '#fff' },
    h3: { fontSize: 16, fontWeight: 700, marginTop: 24, marginBottom: 6, color: '#FFC300' },
    link: { color: '#4F8EF7' },
    ul: { paddingLeft: 20 },
    highlight: { background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 14, padding: '20px 24px', margin: '24px 0' },
  };

  return (
    <div style={S.page}>
      <Head>
        <title>Championship Terms & Conditions — NewWorld Education</title>
        <meta name="description" content="Full terms and conditions for the NewWorld Championship referral competition. Free to enter, real prizes, Pakistan residents only." />
      </Head>
      <div style={S.container}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
        <h1 style={S.h1}>Championship Terms & Conditions</h1>
        <p style={S.updated}>Last updated: March 2026 · Version 1.0</p>

        <div style={S.body}>
          <p>These terms govern the NewWorld Championship ("the Competition"), operated by NewWorld Education ("NewWorldEdu", "we", "us"). By joining the Competition, you agree to all terms below.</p>

          <h2 style={S.h2}>1. Eligibility</h2>
          <ul style={S.ul}>
            <li><strong>Residency:</strong> Open to residents of Pakistan only. Prizes can only be delivered within Pakistan.</li>
            <li><strong>Age:</strong> Participants must be aged 5 to 18 years old at the time of joining.</li>
            <li><strong>Parental consent:</strong> Participants under 18 require parental or guardian consent. For participants under 13, a parent consent email is sent automatically and must be approved before participation is fully activated.</li>
            <li><strong>Account:</strong> You must have a registered NewWorldEdu account with a valid email address.</li>
            <li><strong>One account per person:</strong> Each individual may participate with one account only. Multiple accounts for the same person are not permitted.</li>
          </ul>

          <h2 style={S.h2}>2. How It Works</h2>
          <p>The Competition runs in seasons (typically 30 days each). Participants earn points by referring new users to NewWorldEdu. The participants with the most referral points at the end of each season win prizes.</p>

          <h2 style={S.h2}>3. Referral Validity</h2>
          <p>A referral is counted as valid when the referred person meets <strong>both</strong> of the following conditions:</p>
          <ul style={S.ul}>
            <li>The referred person has been registered for at least <strong>7 days</strong></li>
            <li>The referred person has completed at least <strong>3 learning sessions</strong> with Starky</li>
          </ul>
          <p>Both conditions must be met for a referral point to be awarded. Referrals that do not meet both conditions remain pending and may qualify later.</p>

          <h2 style={S.h2}>4. Fraud Policy</h2>
          <ul style={S.ul}>
            <li>Creating fake accounts, bot accounts, or using automated tools to generate referrals is strictly prohibited.</li>
            <li>Referring yourself using different email addresses is prohibited.</li>
            <li>Any participant found to be engaging in fraudulent activity will be <strong>immediately disqualified</strong> from the current and all future seasons.</li>
            <li>NewWorldEdu reserves the right to investigate suspicious referral patterns and to withhold or revoke prizes where fraud is detected.</li>
            <li>All decisions regarding fraud are final.</li>
          </ul>

          <h2 style={S.h2}>5. Tiebreaker Rules</h2>
          <p>If two or more participants have the same number of referral points at the end of a season:</p>
          <ol style={S.ul}>
            <li><strong>First tiebreaker — Timestamp:</strong> The participant who reached that point total first (earliest timestamp) ranks higher.</li>
            <li><strong>Second tiebreaker — Total sessions:</strong> If timestamps are identical, the participant whose referrals have completed more total learning sessions ranks higher.</li>
            <li><strong>If still tied:</strong> Both participants win. Both receive the prize for their tied position.</li>
          </ol>

          <h2 style={S.h2}>6. Prizes</h2>
          <ul style={S.ul}>
            <li>Prizes are announced at the start of each season and displayed on the Championship page.</li>
            <li>Prizes are subject to availability. If a specific prize is unavailable, NewWorldEdu will provide an alternative of equal or greater value.</li>
            <li>Prizes are <strong>non-transferable</strong> and cannot be exchanged for cash.</li>
            <li>Prize delivery is within Pakistan only, via courier (TCS Express, Leopards, Call Courier, or Pakistan Post depending on city). Delivery takes <strong>7 to 14 business days</strong> after address submission.</li>
            <li>Winners must claim their prize within 7 days of the season ending by submitting a valid Pakistani delivery address. Unclaimed prizes after 7 days may be forfeited.</li>
            <li>NewWorldEdu is not responsible for courier delays or damage during transit, but will work with the courier to resolve any issues.</li>
          </ul>

          <h2 style={S.h2}>7. Cancellation & Changes</h2>
          <ul style={S.ul}>
            <li>NewWorldEdu may cancel, modify, or suspend the Competition at any time for any reason, including but not limited to technical issues, fraud, or insufficient participation.</li>
            <li>If a season is cancelled mid-way, all participants with qualifying referrals will receive an equivalent benefit (such as extended free months).</li>
            <li>Season duration, prizes, and rules may change between seasons. Changes take effect from the next season only, never mid-season.</li>
          </ul>

          <h2 style={S.h2}>8. Winner Announcement</h2>
          <ul style={S.ul}>
            <li>Winners are announced on the Championship leaderboard and via email.</li>
            <li>Only the winner's <strong>first name and school</strong> are displayed publicly. Full names and email addresses are never shown.</li>
            <li>Winners may be featured in NewWorldEdu communications (first name and school only) unless they opt out by emailing us.</li>
          </ul>

          <h2 style={S.h2}>9. Privacy & Data</h2>
          <ul style={S.ul}>
            <li>Data collected for the Competition includes: name, email, school, date of birth (for age verification), parent email (for under-13 consent), referral activity, and delivery address (winners only).</li>
            <li>This data is used <strong>solely for the purpose of running the Competition</strong>.</li>
            <li>Your data is <strong>never sold, rented, or shared</strong> with third parties for marketing.</li>
            <li>See our full <a href="/privacy" style={S.link}>Privacy Policy</a> for details on data handling.</li>
          </ul>

          <h2 style={S.h2}>10. Data Deletion</h2>
          <p>You can request deletion of all your championship data at any time by emailing <a href="mailto:hello@newworld.education" style={S.link}>hello@newworld.education</a>. Upon request, we will delete your championship profile, referral history, and any associated data within 14 days. Note: deletion during an active season will remove you from the competition.</p>

          <h2 style={S.h2}>11. PECA 2016 Compliance</h2>
          <p>This Competition complies with the Prevention of Electronic Crimes Act (PECA) 2016 of Pakistan. No participant data is used for unsolicited communications beyond competition-related notifications. All electronic communications include opt-out mechanisms. We maintain appropriate security measures to protect participant data as required under Pakistani law.</p>

          <h2 style={S.h2}>12. Governing Law</h2>
          <p>This Competition is governed by the laws of Pakistan. Any disputes arising from or related to the Competition shall be subject to the exclusive jurisdiction of the courts of Karachi, Sindh, Pakistan.</p>

          <div style={S.highlight}>
            <h3 style={{ ...S.h3, marginTop: 0 }}>This Is Not a Ponzi Scheme, Lottery, or MLM</h3>
            <p style={{ margin: 0 }}>
              We want to be crystal clear about this. The NewWorld Championship is a <strong>free referral competition</strong>. Here is how it works:
            </p>
            <ul style={{ ...S.ul, marginTop: 12 }}>
              <li><strong>No participant pays anything.</strong> The competition is 100% free to enter. There is no entry fee, no subscription required, no hidden cost.</li>
              <li><strong>Prizes are funded by NewWorld Education's operating budget.</strong> We are a real education company that earns revenue from tutoring subscriptions. Prize costs come from our marketing budget — the same way any company runs promotions.</li>
              <li><strong>This is not a pyramid or MLM.</strong> You do not earn money from other people's referrals. There are no "levels" or "downlines". You refer friends, they learn, you earn points. That is it.</li>
              <li><strong>This is not a lottery.</strong> Winners are determined by referral count, not by random chance. It is a competition of effort, not luck.</li>
              <li><strong>No money changes hands between participants.</strong> Ever. For any reason.</li>
            </ul>
            <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              If you have any doubts, email <a href="mailto:hello@newworld.education" style={S.link}>hello@newworld.education</a> or WhatsApp us at <a href="https://wa.me/923262266682" style={S.link}>+92 326 226 6682</a>. We are real people in Karachi, Pakistan.
            </p>
          </div>

          <h2 style={S.h2}>13. Free Entry</h2>
          <p>Entry to the Competition is free. No purchase or subscription is necessary to participate. NewWorldEdu does not charge any fee for joining or participating in the Championship.</p>

          <h2 style={S.h2}>14. Contact</h2>
          <p>
            NewWorld Education<br />
            Karachi, Pakistan<br />
            Email: <a href="mailto:hello@newworld.education" style={S.link}>hello@newworld.education</a><br />
            WhatsApp: <a href="https://wa.me/923262266682" style={S.link}>+92 326 226 6682</a>
          </p>

          <div style={{ textAlign: 'center', marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <a href="/championship" style={{ ...S.link, fontSize: 14, fontWeight: 700 }}>Back to Championship</a>
            <span style={{ margin: '0 12px', color: 'rgba(255,255,255,0.2)' }}>·</span>
            <a href="/privacy" style={{ ...S.link, fontSize: 14, fontWeight: 700 }}>Privacy Policy</a>
            <span style={{ margin: '0 12px', color: 'rgba(255,255,255,0.2)' }}>·</span>
            <a href="/championship/trust" style={{ ...S.link, fontSize: 14, fontWeight: 700 }}>Is This Real?</a>
          </div>
        </div>
      </div>
    </div>
  );
}
