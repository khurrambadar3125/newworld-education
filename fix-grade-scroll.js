const fs = require('fs');
const f = '/Users/whitestar/newworld-platform/pages/index.jsx';
let c = fs.readFileSync(f, 'utf8');

// Find the grade onClick and show context
const idx = c.indexOf('setSelectedGrade(');
if (idx > -1) {
  console.log('GRADE CLICK CONTEXT:');
  console.log(c.slice(idx - 50, idx + 200));
}

// Find id="start-learning" or the subject section anchor
const subjIdx = c.indexOf('id="start-learning"');
const subjIdx2 = c.indexOf("id='start-learning'");
const subjIdx3 = c.indexOf('id={`start-learning`}');
console.log('\nid="start-learning" found:', subjIdx > -1, subjIdx2 > -1, subjIdx3 > -1);

// Find where subject cards are rendered
const subjectSection = c.match(/selectedGrade\s*&&[\s\S]{0,100}/);
if (subjectSection) console.log('\nSubject render:', subjectSection[0].substring(0,150));
