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
          <p>NewWorld Education ("NewWorldEdu", "we", "us") operates the website newworld.education. We provide AI-powered educational tutoring services for students from KG through A Levels, with a focus on Cambridge O Level and A Level curriculum in Pakistan.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>What Data We Collect</h2>
          <p><strong>Account information:</strong> Name, email address, and role (student/parent/teacher) when you register. Google account details if you sign in with Google.</p>
          <p><strong>Learning data:</strong> Chat messages with Starky, quiz responses, essay submissions, session summaries, weak topics, and mistake patterns. This data is used to personalise your learning experience.</p>
          <p><strong>Subscription data:</strong> Email, grade, subject, and preferred study time for daily question subscribers.</p>
          <p><strong>Payment data:</strong> Payments are processed by PayPal. We never see or store your credit card details.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>How We Use Your Data</h2>
          <ul style={{paddingLeft:20}}>
            <li>To provide personalised AI tutoring adapted to your grade and subject</li>
            <li>To send session reports to parents after each learning session</li>
            <li>To send daily Cambridge exam questions to subscribers</li>
            <li>To track learning progress, weak topics, and areas for improvement</li>
            <li>To improve our educational content and AI tutoring quality</li>
          </ul>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>Data Storage</h2>
          <p>Your data is stored securely on Vercel (hosting) and Upstash Redis (database). Chat sessions are processed by Anthropic's Claude AI. We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>Children's Privacy</h2>
          <p>NewWorldEdu is designed for use by children with parental consent. We collect minimal data from children (name, grade, chat messages for learning purposes). Parents can request deletion of their child's data at any time by emailing us.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>Your Rights</h2>
          <p>You can request access to, correction of, or deletion of your personal data at any time. Email us at <a href="mailto:hello@newworld.education" style={{color:'#4F8EF7'}}>hello@newworld.education</a>.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>Contact</h2>
          <p>NewWorld Education<br/>Email: <a href="mailto:hello@newworld.education" style={{color:'#4F8EF7'}}>hello@newworld.education</a></p>
        </div>
      </div>
    </div>
  );
}
