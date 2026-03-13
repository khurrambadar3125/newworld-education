const fs = require('fs');
const c = fs.readFileSync('/Users/whitestar/newworld-platform/pages/index.jsx', 'utf8');

// Show grade click handler
const gradeMatch = c.match(/selectedGrade[\s\S]{0,300}/);
if (gradeMatch) console.log('GRADE HANDLER:\n', gradeMatch[0].substring(0,400));

// Show scroll logic
const scrollMatch = c.match(/scrollIntoView[\s\S]{0,100}/);
if (scrollMatch) console.log('\nSCROLL:\n', scrollMatch[0]);

// Show start-learning section
const anchorMatch = c.match(/start-learning[\s\S]{0,200}/);
if (anchorMatch) console.log('\nANCHOR:\n', anchorMatch[0].substring(0,300));

// Check for duplicate nav entries
const musicCount = (c.match(/Learn Music/g)||[]).length;
const artsCount = (c.match(/Learn Arts/g)||[]).length;
const readCount = (c.match(/Lets READ/g)||[]).length;
console.log('\nDuplicate check — Learn Music:', musicCount, '| Learn Arts:', artsCount, '| Lets READ:', readCount);
