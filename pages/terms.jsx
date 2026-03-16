import Head from 'next/head';

export default function Terms() {
  return (
    <div style={{minHeight:'100vh',background:'#080C18',color:'#fff',fontFamily:"'Nunito',-apple-system,sans-serif",padding:'40px 20px 80px'}}>
      <Head>
        <title>Terms of Service — NewWorld Education</title>
        <meta name="description" content="Terms of service for NewWorld Education AI tutoring platform." />
      </Head>
      <div style={{maxWidth:680,margin:'0 auto'}}>
        <h1 style={{fontSize:28,fontWeight:900,marginBottom:24}}>Terms of Service</h1>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:32}}>Last updated: March 2026</p>

        <div style={{fontSize:15,lineHeight:1.8,color:'rgba(255,255,255,0.75)'}}>
          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>1. Service Description</h2>
          <p>NewWorld Education provides AI-powered educational tutoring through our platform at newworld.education. Our AI tutor "Starky" assists students with homework help, exam preparation, essay marking, and practice drills for Cambridge O Level, A Level, and Pakistan board examinations.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>2. Acceptable Use</h2>
          <p>Our platform is for educational purposes only. Users must not attempt to use Starky for non-educational purposes, generate harmful content, or misuse the platform. We reserve the right to suspend accounts that violate these terms.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>3. AI Tutoring Disclaimer</h2>
          <p>Starky is an AI tutor, not a human teacher. While we strive for accuracy in all educational content, AI-generated responses may occasionally contain errors. Students should verify critical exam-related information with their teachers or official Cambridge resources.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>4. Subscriptions & Payments</h2>
          <p>Paid subscriptions are billed monthly via PayPal. All plans include a 7-day free trial. You may cancel at any time. Refunds are available within 30 days of purchase if you are unsatisfied with the service.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>5. Child Safety</h2>
          <p>We take child safety seriously. Our platform includes automated detection of distress signals and abuse disclosures, with immediate alerts to parents/guardians. We do not allow any harmful, inappropriate, or non-educational content.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>6. Data & Privacy</h2>
          <p>Your use of our platform is also governed by our <a href="/privacy" style={{color:'#4F8EF7'}}>Privacy Policy</a>. We collect only the data necessary to provide personalised tutoring and parent reports.</p>

          <h2 style={{fontSize:18,fontWeight:800,marginTop:32,marginBottom:8,color:'#fff'}}>7. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:hello@newworld.education" style={{color:'#4F8EF7'}}>hello@newworld.education</a>.</p>
        </div>
      </div>
    </div>
  );
}
