import Head from 'next/head';

/**
 * Reusable SEO component — use on every page.
 * PERMANENT: Every page must have unique title, description, and OG tags.
 *
 * Country-aware: pass `country="UAE"` or `country="PK"` to override defaults
 * with locale-appropriate keywords and og:locale. If omitted, neutral
 * international defaults (en_US) are used so shared pages don't leak a
 * Pakistan brand to UAE/global audiences.
 */

const COUNTRY_PRESETS = {
  UAE: {
    keywords:
      "AI tutor UAE, AI tutor Dubai, Cambridge O Level UAE, A Level tutor Dubai, IGCSE tutor, online tutor UAE, SAT prep Dubai, American curriculum UAE, IB tutor",
    ogLocale: "en_AE",
  },
  PK: {
    keywords:
      "AI tutor Pakistan, Cambridge O Level, A Level tutor, online tutor Karachi, Cambridge past papers, mark scheme help",
    ogLocale: "en_PK",
  },
};

const NEUTRAL_KEYWORDS =
  "AI tutor, Cambridge O Level, A Level tutor, personal tutor, online tutor, exam preparation, SAT prep, IB, American curriculum";
const NEUTRAL_OG_LOCALE = "en_US";

export default function SEO({
  title = "NewWorldEdu — AI Tutor for Cambridge O Level & A Level",
  description = "Personal AI tutor for every child — 24/7, 16 languages, every subject. Cambridge O Level and A Level, past papers, mark schemes and examiner reports. Start free — no credit card needed.",
  keywords,
  url = "https://www.newworld.education",
  image = "https://www.newworld.education/og-image.png",
  type = "website",
  noindex = false,
  country = null,
}) {
  const preset = country && COUNTRY_PRESETS[country];
  const resolvedKeywords = keywords ?? (preset ? preset.keywords : NEUTRAL_KEYWORDS);
  const ogLocale = preset ? preset.ogLocale : NEUTRAL_OG_LOCALE;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={resolvedKeywords} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="NewWorld Education" />
      <meta property="og:locale" content={ogLocale} />

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
