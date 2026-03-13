const fs = require('fs');
const f = '/Users/whitestar/newworld-platform/pages/pricing.jsx';
let c = fs.readFileSync(f, 'utf8');

const newPlan = `{
  id: 'creative-bundle',
  name: 'Creative Bundle',
  emoji: '🎨',
  price: 79.99,
  period: 'month',
  planId: 'P-60C25004ES421424TNGTU3JA',
  color: '#FF8C69',
  highlight: false,
  for: 'Creative learners',
  desc: 'Creative learning unlocked. Music, Arts & Reading — unlimited sessions, every age.',
  features: [
    '1 child',
    'Unlimited Music sessions',
    'Unlimited Arts sessions',
    'Unlimited Reading sessions',
    'All ages KG to A-Level',
    'Level selector per subject',
    '7-day free trial',
  ],
},
`;

// Insert before special-needs plan
const target = "id: 'special-needs'";
if (!c.includes(target)) {
  console.log('ERROR: could not find special-needs plan');
  process.exit(1);
}

c = c.replace(target, newPlan + "  " + target);
fs.writeFileSync(f, c);

// Verify
console.log('creative-bundle added:', c.includes('creative-bundle'));
console.log('Plan ID added:', c.includes('P-60C25004ES421424TNGTU3JA'));
console.log('\nNow build and deploy.');
