/**
 * /api/blog-rss — RSS feed for Google News and feed readers
 */
export default async function handler(req, res) {
  // Seed articles — same as in blog.jsx
  const articles = [
    { title: 'Cambridge May/June 2026: What Every Pakistani Student Should Know Right Now', date: '2026-03-29', id: 'cambridge-2026-preparation', excerpt: 'The exam window opens in weeks. Here is what the examiner reports tell us.' },
    { title: 'Why Every Child with a Learning Difference Deserves a Tutor Who Understands Their Brain', date: '2026-03-28', id: 'sen-education-pakistan', excerpt: 'In Pakistan, most children with autism, ADHD, or dyslexia have never been formally assessed.' },
    { title: 'The Secret That A* Students Know: It Is Not About Knowledge', date: '2026-03-27', id: 'why-mark-schemes-matter', excerpt: 'The difference between an A and an A* is almost never what the student knows.' },
  ];

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NewWorld Education Insights</title>
    <link>https://www.newworld.education/blog</link>
    <description>Cambridge exam intelligence, learning science, and education insights from Pakistan.</description>
    <language>en</language>
    <atom:link href="https://www.newworld.education/api/blog-rss" rel="self" type="application/rss+xml" />
${articles.map(a => `    <item>
      <title>${a.title}</title>
      <link>https://www.newworld.education/blog#${a.id}</link>
      <description>${a.excerpt}</description>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <guid>https://www.newworld.education/blog#${a.id}</guid>
    </item>`).join('\n')}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/rss+xml');
  res.status(200).send(rss);
}
