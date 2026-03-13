const fs = require('fs');
const f = '/Users/whitestar/newworld-platform/pages/index.jsx';
let c = fs.readFileSync(f, 'utf8');

// Show existing links first
console.log('BEFORE:');
c.split('\n').forEach((l,i) => {
  if (l.includes('href="/textbooks"') || l.includes('href="/arts"') || l.includes('href="/music"') || l.includes('href="/reading"')) {
    console.log(`  L${i+1}: ${l.trim()}`);
  }
});

// Fix labels - handle both with and without existing emojis
c = c
  .replace(/href="\/textbooks"[^>]*>[^<]*Textbooks/g, 'href="/textbooks" className="nl">📖 Textbooks')
  .replace(/href="\/arts"[^>]*>[^<]*Arts/g, 'href="/arts" className="nl">🎨 Learn Arts')
  .replace(/href="\/music"[^>]*>[^<]*Music/g, 'href="/music" className="nl">🎵 Learn Music')
  .replace(/href="\/reading"[^>]*>[^<]*Reading/g, 'href="/reading" className="nl">📚 Lets READ');

// Also fix the grade selector - find if selectGrade or gradeSelect exists
const hasGrade = c.includes('grade') || c.includes('Grade');
console.log('\nGrade selector present:', hasGrade);

// Show after
console.log('\nAFTER:');
c.split('\n').forEach((l,i) => {
  if (l.includes('href="/textbooks"') || l.includes('href="/arts"') || l.includes('href="/music"') || l.includes('href="/reading"')) {
    console.log(`  L${i+1}: ${l.trim()}`);
  }
});

fs.writeFileSync(f, c);
console.log('\nDone. Now check the grade selector output above.');
console.log('Run: cd /Users/whitestar/newworld-platform && npm run build && npx vercel --prod');
