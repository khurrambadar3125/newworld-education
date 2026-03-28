import { useState, useEffect } from "react";
import Head from "next/head";

/**
 * /blog — Education news and insights
 * Auto-refreshing articles written in NewWorldEdu's signature voice.
 * Designed for Google News indexing: structured data, dates, author, categories.
 */

// Static seed articles — the cron job will generate fresh ones and store in Supabase
const SEED_ARTICLES = [
  {
    id: 'cambridge-2026-preparation',
    title: 'Cambridge May/June 2026: What Every Pakistani Student Should Know Right Now',
    excerpt: 'The exam window opens in weeks. Here is what the examiner reports from the last three years tell us about where marks are won and lost — and what Starky recommends you focus on this week.',
    body: `The Cambridge May/June 2026 exam series begins on 27 April. For students in Pakistan — whether in Karachi, Lahore, Islamabad, or studying from home — this is the moment that matters.\n\nBut here is what most students get wrong about the final weeks: they try to learn new content. The research is clear — and Cambridge examiner reports confirm it year after year — the final six weeks should be about retrieval, not acquisition.\n\nWhat does that mean in practice?\n\nIt means you should not be reading a new chapter of your textbook. You should be testing yourself on the chapters you have already read. It means you should not be copying notes. You should be closing the book and writing down everything you remember — then checking what you missed.\n\nThe science behind this is called the testing effect. Students who test themselves remember significantly more than students who re-read. This is not opinion. This is decades of cognitive science research, confirmed in classroom studies across the world.\n\nCambridge examiners are remarkably consistent in what they report each year. In Chemistry, students lose marks by drawing mechanism arrows from atoms instead of from bonds or lone pairs. In Biology, students write "the enzyme is destroyed" when the mark scheme requires "the enzyme is denatured and its tertiary structure is permanently changed." In Physics, students define acceleration as "change in velocity" and forget to add "per unit time."\n\nThese are not knowledge gaps. These are precision gaps. The student knows the concept but does not express it in the language that earns the mark.\n\nThis is exactly what Starky is built to address. When Starky identifies that a student uses imprecise language — "the reaction speeds up" instead of "the rate of reaction increases because the activation energy is lowered" — it flags it immediately. Not as a correction, but as a mark scheme insight: "Cambridge gives one mark for the observation and one mark for the mechanism. You gave the observation but not the mechanism."\n\nFor Pakistani students specifically, the challenge is compounded by the fact that many study in a language that is not their mother tongue. An O Level student in Karachi may think in Urdu but must write in Cambridge English. The translation gap costs marks — not because the student does not understand, but because the expression does not match what the mark scheme rewards.\n\nStarky bridges this gap. It accepts input in Urdu, Roman Urdu, or English, and teaches the Cambridge-specific phrasing that earns marks. A student who says "reaction tez hoti hai" is guided to "the rate of reaction increases" — not just translated, but taught the examiner's expectation.\n\nWhat should you do this week? Three things.\n\nFirst, take one past paper in your weakest subject. Do it under timed conditions. Then mark it yourself against the mark scheme. The gap between what you wrote and what the mark scheme wanted is your study plan for next week.\n\nSecond, open Starky and ask it to quiz you on your weakest topic. Tell it "quiz me on organic mechanisms" or "test me on the causes of the French Revolution" and let it identify where your precision breaks down.\n\nThird, sleep properly. This is not motivational advice. This is neuroscience. Memory consolidation happens during sleep. A student who studies for four hours and sleeps for eight will outperform a student who studies for eight hours and sleeps for four. Every time.\n\nThe exams are coming. You are more ready than you think. What separates the A* from the A is not more knowledge — it is more precision. And precision is teachable. That is what the next six weeks are for.`,
    author: 'Khurram Badar',
    date: '2026-03-29',
    category: 'Cambridge Exams',
    readTime: '5 min read',
  },
  {
    id: 'sen-education-pakistan',
    title: 'Why Every Child with a Learning Difference Deserves a Tutor Who Understands Their Brain',
    excerpt: 'In Pakistan, most children with autism, ADHD, or dyslexia have never been formally assessed. They are called slow, naughty, or not trying. They are none of these things.',
    body: `There is a boy in Karachi. His name does not matter — his story does, because it is the story of thousands of children across Pakistan.\n\nHe is fourteen years old. He has severe autism. He cannot read or write independently. His school — a good school, a well-meaning school — does not have a SEN department. His teachers do their best with forty students in a class. They cannot give him the ten extra minutes he needs.\n\nHis father brought him to our platform last week. The father could not complete the registration form on his first attempt. Not because he is not intelligent — he is deeply intelligent, deeply caring, deeply worried about his son. But because the form asked for a grade level, and his son does not fit into a grade level.\n\nWe rebuilt the registration that day. We removed the grade question entirely. We replaced it with two questions: how much support does your child need, and what can they do right now?\n\nThe father selected: severe support needs. Not yet reading or writing. Uses pictures and symbols to communicate.\n\nFrom those two answers, Starky knew exactly where to begin. Not with letters. Not with sounds. With images. One image, one word, one tap. The goal of the first session was not teaching. It was trust. The child needed to learn that this screen would not surprise him, would not demand things he could not do, would wait for him.\n\nThis is what the research calls predictive coding. The autistic brain processes the world as raw, unfiltered sensory data — without the predictive buffer that neurotypical brains provide. Every new input demands processing. Every surprise generates cognitive load. A predictable, calm, consistent environment is not just comfortable — it is therapeutic.\n\nStarky provides that environment. Same format every time. Same opening. Same rhythm. No surprises.\n\nIn Pakistan, seventy-seven percent of children are in learning poverty — meaning they cannot read and understand a simple age-appropriate text by age ten. For children with learning differences, the figure is almost certainly higher, though no one has measured it. They are invisible in the data because they are invisible in the system.\n\nNewWorld Education exists to change that. Not with charity. Not with lowered expectations. With the same destination — reading, writing, understanding, participating — reached by a different road.\n\nEvery child with a learning difference is intelligent. Their brain is wired differently. Not less. Differently. What they need is not more effort. They are already working harder than any other student in their classroom. What they need is a different approach.\n\nThat is precisely what Starky provides.`,
    author: 'Khurram Badar',
    date: '2026-03-28',
    category: 'Special Needs',
    readTime: '4 min read',
  },
  {
    id: 'why-mark-schemes-matter',
    title: 'The Secret That A* Students Know: It Is Not About Knowledge — It Is About the Mark Scheme',
    excerpt: 'The difference between an A and an A* is almost never what the student knows. It is how they express what they know in the language Cambridge rewards.',
    body: `Every year, Cambridge publishes examiner reports for every subject, every paper. These reports are freely available. Almost no student reads them.\n\nThis is the single biggest missed opportunity in Cambridge preparation.\n\nThe examiner reports tell you — in the examiners' own words — exactly what students got wrong, exactly what earned full marks, and exactly what the mark scheme was looking for. They are the answer key to the exam you have not yet sat.\n\nHere is what they consistently say, year after year, across subjects:\n\nIn Chemistry, the most common mark lost is on mechanism questions. Students draw curly arrows starting from the wrong place. The arrow must originate from the bond or the lone pair — never from the atom. This single error costs thousands of students one or two marks every year. Multiply that across three chemistry papers and you have lost six marks from a habit that takes ten minutes to fix.\n\nIn Biology, the most common mark lost is on terminology precision. Students write "the enzyme is destroyed by heat" when the mark scheme requires "the enzyme is denatured — the hydrogen bonds maintaining its tertiary structure break, causing the active site to change shape so the substrate can no longer bind." One sentence. But the difference between that sentence and a vague answer is the difference between one mark and three.\n\nIn Physics, students define acceleration as "change in velocity" and lose the mark because the definition requires "per unit time." Three words. One mark. Repeated across every exam series for the last decade.\n\nIn Economics, students draw supply and demand diagrams with unlabelled axes. The diagram is correct — the curves are in the right place, the equilibrium is marked — but without "Price" on the vertical axis and "Quantity" on the horizontal, the examiner cannot award the diagram marks. Labels are marks. Unlabelled diagrams are decoration.\n\nIn English Language, students identify a literary device — "the writer uses a metaphor" — without explaining its effect. The identification alone earns zero marks. The mark scheme requires: name the device, quote it, explain its specific effect in this specific context. Three steps. Miss any one and you lose the mark.\n\nThis is what Starky teaches. Not the subject — the mark scheme.\n\nWhen a student asks Starky to explain osmosis, Starky does not just explain the concept. It gives the mark-scheme answer first — the precise phrase that earns the mark — then explains it, then warns the student about the common error that loses marks, then asks a question to check understanding.\n\nThis is what the world's best private tutors do. They know the exam from inside. They know what earns marks and what does not. They teach the student to express what they know in the language the examiner rewards.\n\nThe difference is that a private tutor in Karachi costs twenty to fifty thousand rupees a month. Starky costs a fraction of that and is available at eleven o'clock on a Sunday night when the student suddenly realises they do not understand the Calvin cycle.\n\nThe exams are coming. The mark schemes are waiting. The question is not whether you know enough. The question is whether you can express what you know in the way Cambridge rewards.\n\nThat is a learnable skill. And Starky teaches it.`,
    author: 'Khurram Badar',
    date: '2026-03-27',
    category: 'Study Tips',
    readTime: '5 min read',
  },
];

export default function BlogPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [articles, setArticles] = useState(SEED_ARTICLES);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn);
  }, []);

  // Try to load fresh articles from Supabase (generated by cron)
  useEffect(() => {
    fetch('/api/blog-articles').then(r => r.json()).then(data => {
      if (data.articles?.length) setArticles([...data.articles, ...SEED_ARTICLES]);
    }).catch(() => {});
  }, []);

  if (selected) {
    return (
      <div style={{ minHeight: "100vh", background: "#080C18", fontFamily: "'Sora',-apple-system,sans-serif", color: "#fff" }}>
        <Head>
          <title>{selected.title} — NewWorldEdu</title>
          <meta name="description" content={selected.excerpt} />
          <meta property="og:title" content={selected.title} />
          <meta property="og:description" content={selected.excerpt} />
          <meta property="og:type" content="article" />
          <meta property="article:published_time" content={selected.date} />
          <meta property="article:author" content={selected.author} />
          <meta property="article:section" content={selected.category} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "NewsArticle",
            "headline": selected.title, "description": selected.excerpt,
            "datePublished": selected.date, "dateModified": selected.date,
            "author": { "@type": "Person", "name": selected.author },
            "publisher": { "@type": "Organization", "name": "NewWorld Education", "url": "https://www.newworld.education" },
            "mainEntityOfPage": `https://www.newworld.education/blog#${selected.id}`,
          })}} />
        </Head>
        <header style={{ padding: "14px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#4F8EF7", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>← Back to articles</button>
          <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 15, color: "#fff" }}>NewWorldEdu<span style={{ color: "#4F8EF7" }}>★</span></a>
        </header>
        <article style={{ maxWidth: 680, margin: "0 auto", padding: isMobile ? "28px 16px" : "48px 24px" }}>
          <div style={{ fontSize: 12, color: "#4F8EF7", fontWeight: 700, marginBottom: 8 }}>{selected.category}</div>
          <h1 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 900, lineHeight: 1.25, margin: "0 0 12px" }}>{selected.title}</h1>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 32 }}>
            <span>{selected.author}</span>
            <span>{selected.date}</span>
            <span>{selected.readTime}</span>
          </div>
          <div style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.9, color: "rgba(255,255,255,0.75)" }}>
            {selected.body.split('\n\n').map((p, i) => (
              <p key={i} style={{ margin: "0 0 20px" }}>{p}</p>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, marginTop: 40, textAlign: "center" }}>
            <a href="/demo" style={{ display: "inline-block", background: "linear-gradient(135deg,#4F8EF7,#6366F1)", color: "#fff", padding: "14px 32px", borderRadius: 14, fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
              Try Starky free →
            </a>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080C18", fontFamily: "'Sora',-apple-system,sans-serif", color: "#fff" }}>
      <Head>
        <title>Education Insights — NewWorldEdu Blog</title>
        <meta name="description" content="Education news, Cambridge exam insights, and learning science — written for Pakistani students and parents." />
        <meta property="og:title" content="Education Insights — NewWorldEdu" />
        <meta property="og:type" content="website" />
        <link rel="alternate" type="application/rss+xml" title="NewWorldEdu Blog" href="/api/blog-rss" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Blog",
          "name": "NewWorld Education Insights",
          "url": "https://www.newworld.education/blog",
          "publisher": { "@type": "Organization", "name": "NewWorld Education" },
          "blogPost": articles.map(a => ({
            "@type": "BlogPosting", "headline": a.title, "datePublished": a.date,
            "author": { "@type": "Person", "name": a.author },
          })),
        })}} />
      </Head>

      <header style={{ padding: "14px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 900, fontSize: 15, color: "#fff" }}>NewWorldEdu<span style={{ color: "#4F8EF7" }}>★</span></a>
        <a href="/pricing" style={{ background: "linear-gradient(135deg,#4F8EF7,#6366F1)", borderRadius: 10, padding: "6px 14px", color: "#fff", fontWeight: 800, fontSize: 12, textDecoration: "none" }}>Plans</a>
      </header>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: isMobile ? "28px 16px" : "48px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 900, margin: "0 0 8px" }}>Education Insights</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, margin: 0 }}>Cambridge exam intelligence, learning science, and what works — from the people building Starky.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {articles.map(a => (
            <button key={a.id} onClick={() => setSelected(a)}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: isMobile ? "20px 16px" : "24px", cursor: "pointer", textAlign: "left", fontFamily: "'Sora',sans-serif", width: "100%" }}>
              <div style={{ fontSize: 11, color: "#4F8EF7", fontWeight: 700, marginBottom: 6 }}>{a.category} · {a.date}</div>
              <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, margin: "0 0 8px", color: "#fff", lineHeight: 1.3 }}>{a.title}</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.7 }}>{a.excerpt}</p>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>{a.author} · {a.readTime}</div>
            </button>
          ))}
        </div>
      </div>

      <footer style={{ padding: "40px 16px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: 48 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>© 2026 NewWorldEdu · khurram@newworld.education</div>
      </footer>
    </div>
  );
}
