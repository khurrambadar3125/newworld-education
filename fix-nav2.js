// fix-nav2.js — restores nav + fixes mobile menu
// node /Users/whitestar/newworld-platform/fix-nav2.js

const fs = require('fs');
const path = '/Users/whitestar/newworld-platform/pages/index.jsx';
let content = fs.readFileSync(path, 'utf8');

// STEP 1: Restore the nav tag — script broke it by replacing logo + hamburger
const correctNav = `<nav className="nav">
        <a href="/" className="nl">NewWorldEdu<span>★</span></a>
        <div className="nr">
          <a href="/pricing" className="np">Plans</a>
          <button className="nh" onClick={() => setMenuOpen(o => !o)}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>`;

content = content.replace(/<nav([^>]*)>([\s\S]*?)<\/nav>/, correctNav);
console.log('Nav tag restored (logo + hamburger back)');

// STEP 2: Fix the mobile menu dropdown
// Find what pattern is used for the mobile menu
const hasAndPattern = content.includes('menuOpen &&');
const hasTernary = content.includes('menuOpen ?');

console.log('menuOpen && pattern:', hasAndPattern);
console.log('menuOpen ? pattern:', hasTernary);

// Show all lines with menuOpen
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('menuOpen')) {
    console.log('Line', i+1, ':', line.trim().substring(0, 120));
  }
});

// Extract link className from existing menu links
const existingLink = content.match(/href="\/special-needs"([^>]*)>/);
const linkAttrs = existingLink ? existingLink[1] : '';
console.log('\nExisting link attrs:', linkAttrs);

const newLinks = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Plans & Pricing' },
  { href: '/parent', label: 'Parents' },
  { href: '/past-papers', label: 'Past Papers' },
  { href: '/textbooks', label: 'Textbooks' },
  { href: '/arts', label: 'Arts' },
  { href: '/music', label: 'Music' },
  { href: '/reading', label: 'Reading' },
  { href: '/special-needs', label: 'Special Needs' },
].map(l => `          <a href="${l.href}"${linkAttrs}>${l.label}</a>`).join('\n');

if (hasAndPattern) {
  // Replace {menuOpen && (...)} block
  content = content.replace(
    /\{menuOpen\s*&&\s*\(([\s\S]*?)\)\s*\}/,
    `{menuOpen && (\n        <div className="nm">\n${newLinks}\n        </div>\n      )}`
  );
  console.log('\nReplaced && mobile menu');
} else if (hasTernary) {
  content = content.replace(
    /menuOpen\s*\?\s*\(([\s\S]*?)\)\s*:\s*null/,
    `menuOpen ? (\n        <div className="nm">\n${newLinks}\n        </div>\n      ) : null`
  );
  console.log('\nReplaced ternary mobile menu');
} else {
  console.log('\nERROR: Cannot find mobile menu pattern — check lines above');
}

fs.writeFileSync(path, content);
console.log('\nDone. Now run:');
console.log('cd /Users/whitestar/newworld-platform && npm run build && npx vercel --prod');
