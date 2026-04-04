#!/usr/bin/env node
/**
 * scripts/auto-download.mjs — Auto-download PDFs from web pages
 * ─────────────────────────────────────────────────────────────────
 * Give it a URL → it finds all PDF links → downloads them all.
 * Built for physicsandmathstutor.com but works on any site.
 *
 * Usage:
 *   node scripts/auto-download.mjs "https://www.physicsandmathstutor.com/maths-revision/solutionbanks/"
 *   node scripts/auto-download.mjs "https://www.physicsandmathstutor.com/past-papers/gcse-physics/edexcel-igcse-paper-1/"
 *
 * It will:
 * 1. Fetch the page
 * 2. Find all links to PDFs (or links to sub-pages with PDFs)
 * 3. Download everything to ~/Downloads/
 * 4. Then you run upload-papers or extract-sat-books to process them
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { basename, join } from 'path';

const DOWNLOADS = join(process.env.HOME, 'Downloads');
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchPage(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function extractLinks(html, baseUrl) {
  const links = [];
  // Match href="..." patterns
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    let href = match[1];
    // Make absolute
    if (href.startsWith('/')) href = new URL(href, baseUrl).href;
    else if (!href.startsWith('http')) href = new URL(href, baseUrl).href;
    links.push(href);
  }
  return links;
}

async function downloadPDF(url, prefix = '') {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, redirect: 'follow' });
    if (!res.ok) return false;

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('pdf') && !url.endsWith('.pdf')) return false;

    const buffer = Buffer.from(await res.arrayBuffer());
    let filename = decodeURIComponent(basename(new URL(url).pathname));
    if (prefix) filename = `${prefix}-${filename}`;
    // Sanitize filename
    filename = filename.replace(/[<>:"/\\|?*]/g, '_');

    const filepath = join(DOWNLOADS, filename);
    if (existsSync(filepath)) {
      console.log(`  SKIP (exists): ${filename}`);
      return false;
    }

    writeFileSync(filepath, buffer);
    console.log(`  ✓ ${filename} (${(buffer.length / 1024).toFixed(0)}KB)`);
    return true;
  } catch (err) {
    console.error(`  ✗ Failed: ${url.slice(0, 80)} — ${err.message}`);
    return false;
  }
}

async function crawlAndDownload(startUrl, depth = 0) {
  console.log(`\nCrawling: ${startUrl}`);
  const html = await fetchPage(startUrl);
  const allLinks = extractLinks(html, startUrl);

  // Find direct PDF links
  const pdfLinks = allLinks.filter(l => l.endsWith('.pdf'));
  // Find sub-page links (same domain, likely content pages)
  const domain = new URL(startUrl).hostname;
  const subPages = allLinks.filter(l => {
    try {
      const u = new URL(l);
      return u.hostname === domain
        && !l.endsWith('.pdf')
        && !l.includes('#')
        && !l.includes('mailto:')
        && !l.includes('javascript:')
        && l !== startUrl
        && l.includes(new URL(startUrl).pathname.split('/').slice(0, -1).join('/'));
    } catch { return false; }
  });

  console.log(`  Found: ${pdfLinks.length} PDFs, ${subPages.length} sub-pages`);

  // Download direct PDFs
  let downloaded = 0;
  for (const pdf of pdfLinks) {
    const ok = await downloadPDF(pdf);
    if (ok) downloaded++;
    await new Promise(r => setTimeout(r, 500)); // Rate limit: 2 per second
  }

  // If no PDFs found and depth allows, crawl sub-pages
  if (depth < 2) {
    const uniqueSubPages = [...new Set(subPages)];
    console.log(`\n  Crawling ${uniqueSubPages.length} sub-pages (depth ${depth + 1})...`);

    for (const subPage of uniqueSubPages) {
      try {
        const subHtml = await fetchPage(subPage);
        const subLinks = extractLinks(subHtml, subPage);
        const subPdfs = subLinks.filter(l => l.endsWith('.pdf'));

        // Extract prefix from sub-page URL for filename context
        const prefix = basename(new URL(subPage).pathname).replace(/-/g, '_');

        for (const pdf of subPdfs) {
          const ok = await downloadPDF(pdf, prefix);
          if (ok) downloaded++;
          await new Promise(r => setTimeout(r, 300));
        }
      } catch (err) {
        console.error(`  Sub-page error: ${err.message.slice(0, 60)}`);
      }
    }
  }

  return downloaded;
}

async function main() {
  const urls = process.argv.slice(2);
  if (urls.length === 0) {
    console.log(`
Auto-Download PDFs from any website

Usage:
  node scripts/auto-download.mjs "URL" ["URL2" "URL3" ...]

Examples:
  node scripts/auto-download.mjs "https://www.physicsandmathstutor.com/maths-revision/solutionbanks/"
  node scripts/auto-download.mjs "https://www.physicsandmathstutor.com/past-papers/gcse-physics/edexcel-igcse-paper-1/"
  node scripts/auto-download.mjs "https://www.sats-papers.co.uk/ks2-sats-papers/"

It crawls the page, finds all PDFs (up to 2 levels deep), and downloads to ~/Downloads/
`);
    process.exit(1);
  }

  let totalDownloaded = 0;
  for (const url of urls) {
    try {
      const count = await crawlAndDownload(url);
      totalDownloaded += count;
    } catch (err) {
      console.error(`Error crawling ${url}: ${err.message}`);
    }
  }

  console.log(`\n=== TOTAL: ${totalDownloaded} PDFs downloaded to ~/Downloads/ ===\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
