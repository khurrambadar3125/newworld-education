import Head from 'next/head';

export default function Privacy() {
  return (
    <div style={{minHeight:'100vh',background:'#080C18',color:'#fff',fontFamily:"'Nunito',-apple-system,sans-serif",padding:'40px 20px 80px'}}>
      <Head>
        <title>Privacy Policy — NewWorld Education</title>
        <meta name="description" content="Privacy policy for NewWorld Education. How we collect, use, and protect student and parent data." />
      </Head>
      <div style={{maxWidth:680,margin:'0 auto'}}>
        <h1 style={{fontSize:28,fontWeight:900,marginBottom:24}}>Privacy Policy</h1>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:32}}>Last updated: March 2026</p>

        <div style={{fontSize:15,lineHeight:1.8,color:'rgba(255,255,255,0.75)'}}>
          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>Who We Are</h2>
          <p>NewWorld Education ("NewWorldEdu", "we", "us") operates the website newworld.education. We provide personalised educational tutoring services for students from KG through A Levels, with a focus on Cambridge O Level and A Level curriculum in Pakistan.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>What Data We Collect</h2>
          <p><strong>Account information:</strong> Name, email address, and role (student/parent/teacher) when you register. Google account details if you sign in with Google.</p>
          <p><strong>Learning data:</strong> Chat messages with Starky, quiz responses, essay submissions, session summaries, weak topics, and mistake patterns. This data is used to personalise your learning experience.</p>
          <p><strong>Subscription data:</strong> Email, grade, subject, and preferred study time for daily question subscribers.</p>
          <p><strong>Payment data:</strong> Payments are processed by PayPal. We never see or store your credit card details.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>How We Use Your Data</h2>
          <ul style={{paddingLeft:20}}>
            <li>To provide personalised tutoring adapted to your grade and subject</li>
            <li>To send session reports to parents after each learning session</li>
            <li>To send daily Cambridge exam questions to subscribers</li>
            <li>To track learning progress, weak topics, and areas for improvement</li>
            <li>To improve our educational content and tutoring quality</li>
          </ul>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>Data Storage</h2>
          <p>Your data is stored securely on Vercel (hosting) and Upstash Redis (database). Chat sessions are processed securely by our technology partner. We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>Children's Privacy</h2>
          <p>NewWorldEdu is designed for use by children with parental consent. We collect minimal data from children (name, grade, chat messages for learning purposes). Parents can request deletion of their child's data at any time by emailing us.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>Your Rights</h2>
          <p>You can request access to, correction of, or deletion of your personal data at any time. Email us at <a href="mailto:hello@newworld.education" style={{color:'#4F8EF7'}}>hello@newworld.education</a>.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>Championship Data</h2>
          <p>If you participate in the NewWorld Championship, we collect additional data specifically for running the competition:</p>
          <ul style={{paddingLeft:20}}>
            <li><strong>Competition data:</strong> Referral activity, points, leaderboard position, dispute history, and behaviour events (page visits, share clicks).</li>
            <li><strong>Verification data:</strong> Date of birth (age eligibility check only) and parent email (for under-13 consent).</li>
            <li><strong>Winner data:</strong> Delivery address, phone number, and full name — collected from prize winners only for shipping purposes.</li>
          </ul>
          <p><strong>Retention:</strong> Championship data is retained for the duration of the active season plus 90 days for dispute resolution. Winner delivery information is retained for 12 months for warranty and shipping verification purposes, then automatically deleted.</p>
          <p><strong>Never sold:</strong> Championship data is never sold, rented, or shared with third parties. It is used solely for operating the competition, sending competition-related notifications, and generating anonymised analytics to improve future seasons.</p>
          <p><strong>Automated deletion:</strong> Behaviour tracking data (page visits, share clicks) is automatically purged 30 days after each season ends. You can request immediate deletion of all championship data by emailing <a href="mailto:hello@newworld.education" style={{color:'#4F8EF7'}}>hello@newworld.education</a>.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>Contact</h2>
          <p>NewWorld Education<br/>Email: <a href="mailto:hello@newworld.education" style={{color:'#4F8EF7'}}>hello@newworld.education</a></p>
        </div>
      </div>
    </div>
  );
}
