// fix-menu.js
// node /Users/whitestar/newworld-platform/fix-menu.js

const fs = require('fs');
const path = '/Users/whitestar/newworld-platform/pages/index.jsx';
let content = fs.readFileSync(path, 'utf8');

// PROBLEM: Two mobile menus exist back to back.
// First menu (broken, no className): Arts, Music, Reading, Special Needs
// Second menu (original): Home, Special Needs, Parent Portal, Plans, Past Papers
//
// FIX: Remove the first broken menu entirely.
// Then replace the second menu's links with the correct full list.

// Step 1: Remove the first broken menu block
// It looks like: {menuOpen && (\n        <div className="nm">\n          <a href="/"...
// followed by Arts/Music/Reading/Special Needs links, then </div>\n      )}
// The second one immediately follows with another {menuOpen && (

// Find and remove the FIRST menuOpen block only
const firstMenuStart = content.indexOf('{menuOpen && (');
const secondMenuStart = content.indexOf('{menuOpen && (', firstMenuStart + 1);

if (firstMenuStart > -1 && secondMenuStart > -1) {
  // Remove everything from first to second menuOpen block
  content = content.slice(0, firstMenuStart) + content.slice(secondMenuStart);
  console.log('Removed duplicate first mobile menu');
} else {
  console.log('Only one menuOpen block found - no duplicate to remove');
}

// Step 2: Replace the remaining mobile menu with correct links
const correctMenu = `{menuOpen && (
        <div className="nm">
          <a href="/" className="nl">Home</a>
          <a href="/pricing" className="nl">Plans & Pricing</a>
          <a href="/parent" className="nl">Parents</a>
          <a href="/past-papers" className="nl">Past Papers</a>
          <a href="/textbooks" className="nl">Textbooks</a>
          <a href="/arts" className="nl">Arts</a>
          <a href="/music" className="nl">Music</a>
          <a href="/reading" className="nl">Reading</a>
          <a href="/special-needs" className="nl">Special Needs</a>
        </div>
      )}`;

content = content.replace(/\{menuOpen\s*&&\s*\(([\s\S]*?)\)\s*\}/, correctMenu);
console.log('Mobile menu replaced with correct links');

// Step 3: Verify nav tag is intact
if (content.includes('className="nl">NewWorldEdu')) {
  console.log('Nav logo: OK');
} else {
  console.log('WARNING: Nav logo may be missing - check manually');
}

if (content.includes('setMenuOpen')) {
  console.log('Hamburger button: OK');
} else {
  console.log('WARNING: Hamburger may be missing');
}

// Show the fixed area
const menuIdx = content.indexOf('{menuOpen && (');
const preview = content.slice(menuIdx, menuIdx + 400);
console.log('\nFixed menu preview:\n', preview);

fs.writeFileSync(path, content);
console.log('\nSaved. Now run:');
console.log('cd /Users/whitestar/newworld-platform && npm run build && npx vercel --prod');
