import Head from 'next/head';

/**
 * Reusable SEO component — use on every page.
 * PERMANENT: Every page must have unique title, description, and OG tags.
 */
export default function SEO({
  title = "NewWorldEdu — AI Tutor for Cambridge O Level & A Level | Pakistan",
  description = "Pakistan's first AI tutor for Cambridge O Level and A Level. 30 years of past papers, mark schemes and examiner reports. Available 24/7 in English and Urdu. Start free — no credit card needed.",
  keywords = "AI tutor Pakistan, Cambridge O Level, A Level tutor, online tutor Karachi, Cambridge past papers, mark scheme help",
  url = "https://www.newworld.education",
  image = "https://www.newworld.education/og-image.png",
  type = "website",
  noindex = false,
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="NewWorld Education" />
      <meta property="og:locale" content="en_PK" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Language alternatives */}
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="ur" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
    </Head>
  );
}
