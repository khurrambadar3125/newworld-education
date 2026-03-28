import Head from "next/head";

export default function EditorialTeam() {
  return (
    <div style={{ minHeight: "100vh", background: "#080C18", fontFamily: "'Sora',sans-serif", color: "#fff" }}>
      <Head>
        <title>Editorial Team — NewWorldEdu</title>
        <meta name="description" content="The NewWorldEdu Editorial Team produces daily educational journalism for students, parents and educators across Pakistan." />
      </Head>
      <header style={{ padding: "14px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 15, color: "#fff" }}>NewWorldEdu<span style={{ color: "#4F8EF7" }}>★</span></a>
        <a href="/news" style={{ color: "#4F8EF7", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>News →</a>
      </header>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 16px" }}>NewWorldEdu Editorial Team</h1>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.9 }}>
          <p>The NewWorldEdu Editorial Team produces daily educational journalism for students, parents and educators across Pakistan.</p>
          <p>Our coverage focuses on Cambridge O and A Level education, Pakistan's school system, EdTech developments, and evidence-based study guidance.</p>
          <p>NewWorldEdu is Pakistan's AI-powered tutoring platform, serving students from KG through A Level. Our editorial team draws on decades of Cambridge exam experience and educational research to inform every article we publish.</p>
          <p><strong>Contact:</strong> <a href="mailto:khurram@newworld.education" style={{ color: "#4F8EF7" }}>khurram@newworld.education</a></p>
          <p><strong>Published from:</strong> Karachi, Pakistan</p>
        </div>
      </div>
    </div>
  );
}
