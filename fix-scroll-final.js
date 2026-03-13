const fs = require('fs');
const f = '/Users/whitestar/newworld-platform/pages/index.jsx';
let c = fs.readFileSync(f, 'utf8');

// Fix 1: Add id to subject section div
c = c.replace(
  'selectedGrade && (\n          <>\n            <div style={{marginTop:28}}>',
  'selectedGrade && (\n          <>\n            <div id="subject-section" style={{marginTop:28}}>'
);

// Fix 2: Add scroll to grade onClick
c = c.replace(
  'onClick={() => setSelectedGrade(g)}',
  'onClick={() => { setSelectedGrade(g); setTimeout(() => document.getElementById("subject-section")?.scrollIntoView({behavior:"smooth"}), 150); }}'
);

fs.writeFileSync(f, c);

// Verify
console.log('subject-section id added:', c.includes('id="subject-section"'));
console.log('scroll on click added:', c.includes('scrollIntoView({behavior:"smooth"})'));
console.log('\nDone! Now build and deploy.');
