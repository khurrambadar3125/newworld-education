// fix-nav.js
// node /Users/whitestar/newworld-platform/fix-nav.js

const fs = require('fs');
const path = '/Users/whitestar/newworld-platform/pages/index.jsx';
let content = fs.readFileSync(path, 'utf8');

// ── STEP 1: Strip ALL previously injected nav links ──────────────
const junk = [
  '<a href="/music" className="bo">Music</a><a href="/reading" className="bo">Reading</a><a href="/arts" className="bo">Arts</a><a href="/music-for-all" className="bo">Music for All</a><a href="/reading-for-all" className="bo">Reading for All</a><a href="/arts-for-all" className="bo">Arts for All</a>',
  '<a href="/music" className="bo">Music</a><a href="/reading" className="bo">Reading</a><a href="/arts" className="bo">Arts</a>',
  '<a href="/music">Music</a><a href="/reading">Reading</a><a href="/arts">Arts</a>',
  '\n          <a href="/music" className="bo">Music</a>\n          <a href="/reading" className="bo">Reading</a>\n          <a href="/arts" className="bo">Arts</a>\n          <a href="/music-for-all" className="bo">Music for All</a>\n          <a href="/reading-for-all" className="bo">Reading for All</a>\n          <a href="/arts-for-all" className="bo">Arts for All</a>\n',
];
junk.forEach(j => { content = content.split(j).join(''); });
console.log('Cleaned up old injections');

// ── STEP 2: Find the navbar and show context ──────────────────────
// Show lines around "special-needs" to understand nav structure
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('special-needs') || line.includes('pricing') || line.includes('parent') || line.includes('past-papers') || line.includes('textbook')) {
    if (!line.includes('bsen') && !line.includes('//')) {
      console.log(i+1, ':', line.trim().substring(0, 100));
    }
  }
});

// ── STEP 3: Build the exact nav we want ──────────────────────────
// Order: Home | Plans & Pricing | Parents | Past Papers | Textbooks | Arts | Music | Reading
// Find the nav container — look for the nav tag or header nav links
// We'll find the block that has all the current nav links and replace it wholesale

// Find a unique nav anchor — the "past-papers" or "pricing" link in nav context
const navLinkPattern = /<a href="\/pricing"[^>]*>[^<]*<\/a>/;
const navLinkMatch = content.match(navLinkPattern);
if (navLinkMatch) {
  console.log('\nFound pricing link:', navLinkMatch[0]);
}

// Strategy: find the nav element and replace its inner links
// Look for pattern like: <nav ...> ... links ... </nav>
const navMatch = content.match(/<nav([^>]*)>([\s\S]*?)<\/nav>/);
if (navMatch) {
  console.log('\nFound <nav> tag');
  const navAttrs = navMatch[1];
  const navInner = navMatch[2];
  console.log('Nav inner (first 200):', navInner.trim().substring(0, 200));
  
  // Build new nav inner — keep existing styles, replace links
  // Extract className/style from existing nav links to match styling
  const existingLinkMatch = navInner.match(/<a href="[^"]*"([^>]*)>/);
  const linkAttrs = existingLinkMatch ? existingLinkMatch[1] : '';
  console.log('Link attrs:', linkAttrs);
  
  const newLinks = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Plans & Pricing' },
    { href: '/parent', label: 'Parents' },
    { href: '/past-papers', label: 'Past Papers' },
    { href: '/textbooks', label: 'Textbooks' },
    { href: '/arts', label: 'Arts' },
    { href: '/music', label: 'Music' },
    { href: '/reading', label: 'Reading' },
  ].map(l => `<a href="${l.href}"${linkAttrs}>${l.label}</a>`).join('');
  
  const newNav = `<nav${navAttrs}>${newLinks}</nav>`;
  content = content.replace(/<nav([^>]*)>([\s\S]*?)<\/nav>/, newNav);
  console.log('\nReplaced nav successfully');
} else {
  console.log('\nNo <nav> tag found — trying header link replacement');
  
  // Fallback: find and replace the cluster of nav links
  // Look for the group containing pricing + parent + past-papers
  const clusterMatch = content.match(/((?:<a href="\/[^"]*"[^>]*>[^<]*<\/a>\s*){3,})/);
  if (clusterMatch) {
    console.log('Found link cluster:', clusterMatch[0].substring(0, 200));
    
    const existingLink = clusterMatch[0].match(/<a href="[^"]*"([^>]*)>/);
    const attrs = existingLink ? existingLink[1] : '';
    
    const newLinks = [
      { href: '/', label: 'Home' },
      { href: '/pricing', label: 'Plans & Pricing' },
      { href: '/parent', label: 'Parents' },
      { href: '/past-papers', label: 'Past Papers' },
      { href: '/textbooks', label: 'Textbooks' },
      { href: '/arts', label: 'Arts' },
      { href: '/music', label: 'Music' },
      { href: '/reading', label: 'Reading' },
    ].map(l => `<a href="${l.href}"${attrs}>${l.label}</a>`).join('');
    
    content = content.replace(clusterMatch[0], newLinks);
    console.log('Replaced link cluster');
  } else {
    console.log('ERROR: Could not find nav links cluster');
    process.exit(1);
  }
}

fs.writeFileSync(path, content);
console.log('\nindex.jsx saved');
console.log('\nVerify with:');
console.log('grep -n "href" /Users/whitestar/newworld-platform/pages/index.jsx | grep -v "//" | head -20');
console.log('\nThen deploy:');
console.log('cd /Users/whitestar/newworld-platform && npm run build && npx vercel --prod');
