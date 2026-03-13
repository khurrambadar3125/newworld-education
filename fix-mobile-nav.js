const fs = require('fs');
const f = '/Users/whitestar/newworld-platform/pages/index.jsx';
let c = fs.readFileSync(f, 'utf8');

// Find the closing </div> that ends the mobile menu (right after past-papers)
// and insert new links before it
const oldText = '<a href="/past-papers">';
const idx = c.indexOf(oldText);
if (idx === -1) { console.log('ERROR: past-papers not found'); process.exit(1); }

// Find the </div> after past-papers
const closeDiv = c.indexOf('</div>', idx);
if (closeDiv === -1) { console.log('ERROR: closing div not found'); process.exit(1); }

const newLinks = '\n            <a href="/textbooks">Textbooks</a>\n            <a href="/arts">Arts</a>\n            <a href="/music">Music</a>\n            <a href="/reading">Reading</a>';

c = c.slice(0, closeDiv) + newLinks + '\n          ' + c.slice(closeDiv);
fs.writeFileSync(f, c);
console.log('Done - added Textbooks, Arts, Music, Reading to mobile menu');
