const fs = require('fs');
const f = '/Users/whitestar/newworld-platform/pages/index.jsx';
let c = fs.readFileSync(f, 'utf8');

// ── FIX 1: Remove duplicate links from line ~395 area ──
// The old fix-all.js added Music/Reading/Arts BEFORE Special Needs (line 395)
// AND we also have them at lines 400-403. Remove the first set.
c = c.replace(/<a href="\/music" className="nl">\uD83C\uDFB5 Learn Music<\/a><a href="\/reading" className="nl">\uD83D\uDCDA Lets READ<\/a><a href="\/arts" className="nl">\uD83C\uDFA8 Learn Arts<\/a>(<a href="\/special-needs")/, '$1');

// Check if that pattern worked, try alternate
if (c.includes('Learn Music</a><a href="/reading"')) {
  // Still has duplicates near special-needs, remove them
  c = c.replace(/(<a href="\/music"[^>]*>)[^<]*Learn Music<\/a>(<a href="\/reading"[^>]*>)[^<]*Lets READ<\/a>(<a href="\/arts"[^>]*>)[^<]*Learn Arts<\/a>(<a href="\/special-needs")/, '$4');
  console.log('Removed duplicate block near special-needs');
}

// ── FIX 2: Grade scroll — find the scroll/subject section ──
// Check what happens after grade selection
const scrollIdx = c.indexOf('scrollIntoView');
const subjectIdx = c.indexOf('start-learning');
console.log('scrollIntoView present:', scrollIdx > -1);
console.log('start-learning anchor present:', subjectIdx > -1);

// Check grade click handler
const gradeClick = c.match(/onClick.*grade|selectGrade|setGrade|selectedGrade/g);
console.log('Grade click handlers:', gradeClick ? gradeClick.slice(0,3) : 'NONE FOUND');

fs.writeFileSync(f, c);
console.log('\nDone. Paste this output before building.');
