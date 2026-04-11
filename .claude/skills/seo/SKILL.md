---
name: seo
description: Audit and fix SEO across all pages — meta tags, Open Graph, structured data, sitemap, robots.txt, canonical URLs, heading hierarchy, page speed signals. Run before launches or to boost search rankings.
allowed-tools: Read Grep Glob Bash(node *) Bash(npx *) Bash(curl *) Bash(wc *)
---

# SEO Audit & Optimization

Comprehensive search engine optimization for newworld.education.

## AUDIT CATEGORIES

### 1. Meta Tags — Every Page
```bash
# Find pages missing <Head> or <title>
for f in pages/*.jsx; do
  name=$(basename "$f" .jsx)
  has_title=$(grep -c '<title>' "$f" || true)
  has_desc=$(grep -c 'meta.*description' "$f" || true)
  if [ "$has_title" -eq 0 ] || [ "$has_desc" -eq 0 ]; then
    echo "MISSING: $name — title:$has_title desc:$has_desc"
  fi
done
```

Every page MUST have:
- `<title>` — unique, 50-60 chars, includes primary keyword + "NewWorldEdu"
- `<meta name="description">` — unique, 150-160 chars, includes CTA
- `<meta name="keywords">` — 5-8 relevant keywords
- `<link rel="canonical">` — self-referencing canonical URL

### 2. Open Graph & Social Sharing
```bash
# Check OG tags across all pages
grep -rn "og:title\|og:description\|og:image\|twitter:card" pages/ --include="*.jsx" | wc -l
grep -rL "og:title" pages/*.jsx
```

Every public page needs:
- `og:title` — same as title or shorter
- `og:description` — same as meta description
- `og:image` — 1200x630px image URL (absolute)
- `og:url` — canonical URL
- `og:type` — "website" or "article"
- `twitter:card` — "summary_large_image"
- `twitter:title`, `twitter:description`, `twitter:image`

### 3. Structured Data (JSON-LD)
```bash
# Check for existing structured data
grep -rn "application/ld+json\|schema.org" pages/ --include="*.jsx"
```

Add JSON-LD for:
- **Organization** — on homepage
  ```json
  { "@type": "Organization", "name": "NewWorldEdu", "url": "https://newworld.education", "logo": "..." }
  ```
- **EducationalOrganization** — on /school, /partner
- **FAQPage** — on pricing, any page with Q&A
- **Course** — on /sat, /study, /become-newton
- **WebApplication** — on homepage
- **BreadcrumbList** — on all nested pages

### 4. Heading Hierarchy
```bash
# Check h1 count per page (should be exactly 1)
for f in pages/*.jsx; do
  name=$(basename "$f" .jsx)
  h1_count=$(grep -c '<h1\|<h1 ' "$f" 2>/dev/null || echo 0)
  if [ "$h1_count" -ne 1 ]; then
    echo "BAD: $name has $h1_count h1 tags (should be 1)"
  fi
done

# Check heading order (h1 → h2 → h3, no skipping)
grep -rn '<h[1-6]' pages/ --include="*.jsx" -o | head -30
```

Rules:
- Exactly 1 `<h1>` per page — contains primary keyword
- `<h2>` for section headings — no skipping from h1 to h3
- `<h3>` for sub-sections within h2 blocks
- No heading tags used purely for styling

### 5. URL & Routing
```bash
# List all page routes
ls pages/*.jsx | sed 's|pages/||;s|.jsx||' | sort

# Check for duplicate content (same content, different URL)
# Check for proper 404 handling
cat pages/404.jsx | head -5
```

Check:
- Clean URLs (no query params for main content)
- No duplicate pages serving same content
- 404 page exists and returns proper status code
- Trailing slashes consistent (Vercel handles this)
- No orphan pages (pages with no internal links pointing to them)

### 6. Sitemap & Robots
```bash
# Check if sitemap exists
curl -s https://newworld.education/sitemap.xml | head -20

# Check robots.txt
curl -s https://newworld.education/robots.txt
```

Verify:
- `sitemap.xml` exists and lists all public pages
- `robots.txt` allows crawling of public pages
- `robots.txt` blocks admin/private pages (/monitor, /garage-admin, /insights)
- Sitemap auto-updates when pages are added
- Sitemap includes `<lastmod>` dates

### 7. Internal Linking
```bash
# Find pages with no internal links pointing to them (orphans)
for page in $(ls pages/*.jsx | sed 's|pages/||;s|.jsx||'); do
  count=$(grep -rn "href=\"/$page\"" pages/ --include="*.jsx" | wc -l)
  if [ "$count" -eq 0 ] && [ "$page" != "_app" ] && [ "$page" != "404" ] && [ "$page" != "500" ]; then
    echo "ORPHAN: /$page — 0 internal links"
  fi
done
```

Check:
- Every public page has at least 2 internal links pointing to it
- Footer contains links to all major sections
- Nav menu covers all key pages
- Related pages cross-link to each other
- Anchor text is descriptive (not "click here")

### 8. Content SEO
```bash
# Check for thin pages (very little text content)
for f in pages/*.jsx; do
  name=$(basename "$f" .jsx)
  lines=$(wc -l < "$f")
  if [ "$lines" -lt 50 ]; then
    echo "THIN: $name — only $lines lines"
  fi
done

# Check for duplicate title tags
grep -rn '<title>' pages/ --include="*.jsx" -o | sort | uniq -c | sort -rn
```

Check:
- No thin content pages (< 300 words of visible text)
- No duplicate titles across pages
- No duplicate meta descriptions
- Primary keyword appears in first 100 words
- Images have alt text (accessibility + SEO)
- Internal links use descriptive anchor text

### 9. Performance SEO Signals
```bash
# Check font loading
grep -rn "fonts.googleapis" pages/ --include="*.jsx" | head -5

# Check for preconnect hints
grep -rn "preconnect" pages/ --include="*.jsx" | head -5

# Check image optimization
grep -rn "next/image" pages/ --include="*.jsx" | wc -l
```

Google ranks on:
- Page speed (use next/image, lazy loading, font swap)
- Mobile-friendliness (responsive design, viewport meta)
- HTTPS (already on Vercel)
- Core Web Vitals (LCP, FID, CLS)

### 10. Google News & Blog SEO
```bash
# Check blog/news pages for article structured data
grep -rn "article\|datePublished\|author" pages/news.jsx
```

For `/news` and blog content:
- Article structured data with datePublished, author
- Proper heading hierarchy within articles
- Meta robots: index,follow
- Submit to Google Publisher Center (reference: reference_google_news memory)

## FIX PRIORITY

1. **Critical** (blocks indexing): Missing titles, no sitemap, robots blocking pages
2. **High** (affects rankings): Missing meta descriptions, no structured data, broken h1 hierarchy
3. **Medium** (improves CTR): Missing OG tags, thin descriptions, no alt text
4. **Low** (nice to have): Internal linking gaps, keyword optimization, breadcrumbs

## REPORT FORMAT
```
SEO AUDIT — 2026-04-11
══════════════════════

META TAGS:       5 issues
  ✗ 12 pages missing meta description
  ✗ 3 pages missing title tag
  ✗ 0 pages have canonical URLs
  ✓ All titles are unique

OPEN GRAPH:      1 issue
  ✗ 0 pages have OG tags (need all public pages)
  ✓ —

STRUCTURED DATA: 1 issue
  ✗ No JSON-LD found on any page
  ✓ —

HEADINGS:        2 issues
  ✗ index.jsx has 3 h1 tags (should be 1)
  ✗ sat.jsx skips from h1 to h3
  ✓ 85 pages have correct h1 count

SITEMAP:         1 issue
  ✗ No sitemap.xml found
  ✓ robots.txt exists

INTERNAL LINKS:  3 issues
  ✗ 8 orphan pages with 0 internal links
  ✓ Footer has 14 links
  ✓ Nav covers all sections

CONTENT:         2 issues
  ✗ 4 thin pages (< 50 lines)
  ✗ 2 duplicate meta descriptions
  ✓ No duplicate titles

PERFORMANCE:     0 issues
  ✓ Fonts use display=swap
  ✓ Preconnect to Google Fonts
  ✓ HTTPS on all pages

TOTAL: 15 issues (2 critical, 4 high, 6 medium, 3 low)
```

## USAGE
```
/seo                          # Full SEO audit
/seo meta                     # Meta tags only
/seo og                       # Open Graph only
/seo structured               # Structured data only
/seo sitemap                  # Sitemap & robots check
/seo links                    # Internal linking audit
/seo fix                      # Audit + auto-fix safe issues
/seo page sat                 # Audit single page
```
