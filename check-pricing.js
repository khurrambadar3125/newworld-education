const fs = require('fs');
const f = '/Users/whitestar/newworld-platform/pages/pricing.jsx';
const c = fs.readFileSync(f, 'utf8');
console.log(c.substring(0, 3000));
