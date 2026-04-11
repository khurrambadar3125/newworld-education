import Head from "next/head";

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#080C18", fontFamily: "'Sora',sans-serif", color: "#fff" }}>
      <Head>
        <title>Contact — NewWorldEdu</title>
        <meta name="description" content="Contact NewWorld Education. Email, editorial enquiries, school partnerships." />
        <meta property="og:title" content="Contact NewWorldEdu" />
        <meta property="og:description" content="Get in touch with NewWorldEdu. Email khurram@newworld.education for partnerships, support, or feedback." />
      </Head>
      <header style={{ padding: "14px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 15, color: "#fff" }}>NewWorldEdu<span style={{ color: "#4F8EF7" }}>★</span></a>
        <a href="/news" style={{ color: "#4F8EF7", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>News →</a>
      </header>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 24px" }}>Contact</h1>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.9 }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px", marginBottom: 16 }}>
            <div style={{ fontWeight: 800, marginBottom: 8, color: "#fff" }}>NewWorld Education</div>
            <p style={{ margin: "0 0 8px" }}>Publication: NewWorldEdu</p>
            <p style={{ margin: "0 0 8px" }}>General: <a href="mailto:khurram@newworld.education" style={{ color: "#4F8EF7" }}>khurram@newworld.education</a></p>
            <p style={{ margin: "0 0 8px" }}>Editorial: <a href="mailto:khurram@newworld.education" style={{ color: "#4F8EF7" }}>khurram@newworld.education</a></p>
            <p style={{ margin: "0 0 8px" }}>School partnerships: <a href="mailto:khurram@newworld.education" style={{ color: "#4F8EF7" }}>khurram@newworld.education</a></p>
            <p style={{ margin: "0 0 8px" }}>Location: Karachi, Pakistan</p>
            <p style={{ margin: 0 }}>WhatsApp: <a href="https://wa.me/923262266682" style={{ color: "#4F8EF7" }}>+92 326 226 6682</a></p>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>For student support, open Starky directly at <a href="/demo" style={{ color: "#4F8EF7" }}>newworld.education/demo</a>.</p>
        </div>
      </div>
    </div>
  );
}
