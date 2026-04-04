/**
 * utils/newtonKB.js — Become Newton Knowledge Base
 * ─────────────────────────────────────────────────────────────────
 * Top 100 Greatest Mathematicians + historical context.
 * Used by: Starky when teaching maths, Become Newton section.
 * Source: fabpedigree.com/james/mathmen.htm
 */

export const MATHEMATICIANS = [
  { rank:1, name:'Isaac Newton', era:'1643-1727', country:'England', contribution:'Invented calculus, laws of motion, universal gravitation. Greatest physicist-mathematician.', quote:'If I have seen further, it is by standing on the shoulders of giants.' },
  { rank:2, name:'Archimedes', era:'287-212 BC', country:'Greece', contribution:'Greatest ancient mathematician. Pi approximation, volume of sphere, principle of lever, buoyancy.', quote:'Give me a lever long enough and I shall move the world.' },
  { rank:3, name:'Carl Friedrich Gauss', era:'1777-1855', country:'Germany', contribution:'Number theory, algebra, statistics, analysis, differential geometry, geodesy, astronomy. Called Prince of Mathematicians.' },
  { rank:4, name:'Leonhard Euler', era:'1707-1783', country:'Switzerland', contribution:'Most prolific mathematician ever. Graph theory, topology, analysis, number theory. e, i, pi relationship.' },
  { rank:5, name:'Bernhard Riemann', era:'1826-1866', country:'Germany', contribution:'Riemannian geometry, Riemann hypothesis, complex analysis. Foundation for Einstein\'s relativity.' },
  { rank:6, name:'David Hilbert', era:'1862-1943', country:'Germany', contribution:'23 unsolved problems that shaped 20th century maths. Functional analysis, invariant theory.' },
  { rank:7, name:'Joseph-Louis Lagrange', era:'1736-1813', country:'Italy/France', contribution:'Analytical mechanics, number theory, algebra. Lagrangian mechanics.' },
  { rank:8, name:'Euclid', era:'~322-275 BC', country:'Greece/Egypt', contribution:'The Elements — textbook for 2000 years. Father of Geometry. Proved infinitely many primes.', quote:'There is no royal road to geometry.' },
  { rank:9, name:'Alexandre Grothendieck', era:'1928-2014', country:'Germany/France', contribution:'Revolutionized algebraic geometry. Most influential mathematician of 20th century.' },
  { rank:10, name:'Gottfried Wilhelm Leibniz', era:'1646-1716', country:'Germany', contribution:'Co-invented calculus (independently of Newton). Binary number system. Symbolic logic.' },
  { rank:14, name:'Srinivasa Ramanujan', era:'1887-1920', country:'India', contribution:'Self-taught genius. Infinite series, number theory, continued fractions. 3900+ results.', quote:'An equation means nothing to me unless it expresses a thought of God.' },
  { rank:15, name:'Pierre de Fermat', era:'1601-1665', country:'France', contribution:'Fermat\'s Last Theorem. Co-founder of probability theory. Number theory pioneer.' },
  { rank:20, name:'Rene Descartes', era:'1596-1650', country:'France', contribution:'Analytic geometry — bridging algebra and geometry. Cartesian coordinates.', quote:'I think, therefore I am.' },
  { rank:24, name:'Pythagoras', era:'~578-505 BC', country:'Greece', contribution:'Pythagorean theorem. Music and mathematics connection. Father of Numbers.', quote:'Number rules the universe.' },
  { rank:25, name:'Al-Khwarizmi', era:'~780-850', country:'Persia/Iraq', contribution:'Father of Algebra. Word "algorithm" from his name. Introduced Hindu decimal system to world.' },
  { rank:32, name:'Fibonacci', era:'~1170-1245', country:'Italy', contribution:'Fibonacci sequence. Introduced Hindu-Arabic numerals to Europe. Liber Abaci.' },
  { rank:35, name:'Pierre-Simon Laplace', era:'1749-1827', country:'France', contribution:'Celestial mechanics, probability theory. Called the Newton of France.' },
  { rank:37, name:'Aryabhata', era:'476-550', country:'India', contribution:'Father of Indian mathematics. Pi approximation 3.1416. Earth rotation. Aryabhata Algorithm.' },
  { rank:44, name:'Bhaskara II', era:'1114-1185', country:'India', contribution:'Greatest Hindu mathematician. Anticipated calculus. Chakravala method. Sine addition identity.' },
  { rank:45, name:'Kurt Godel', era:'1906-1978', country:'Austria/USA', contribution:'Incompleteness theorems — proved mathematics can never be fully complete or consistent.' },
  { rank:49, name:'Alhazen (Ibn al-Haytham)', era:'965-1039', country:'Iraq/Egypt', contribution:'Father of Optics. Father of Scientific Method. Book of Optics most important physics text before Newton.' },
  { rank:51, name:'Blaise Pascal', era:'1623-1662', country:'France', contribution:'Pascal\'s triangle, probability theory, hydraulics. Built first mechanical calculator at age 19.' },
  { rank:71, name:'Albert Einstein', era:'1879-1955', country:'Germany/USA', contribution:'Relativity, E=mc². Greatest applied mathematician of 20th century.' },
  { rank:77, name:'Alan Turing', era:'1912-1954', country:'England', contribution:'Father of computer science. Cracked Enigma code. Turing machine concept.' },
  { rank:81, name:'John Nash', era:'1928-2015', country:'USA', contribution:'Game theory. Nash equilibrium. Nobel Prize in Economics.' },
  { rank:96, name:'Omar Khayyam', era:'1048-1123', country:'Persia', contribution:'Cubic equations, Pascal\'s Triangle (Khayyam\'s Triangle), Binomial Theorem. Poet (Rubaiyat).' },
  { rank:100, name:'Thales', era:'~624-546 BC', country:'Greece', contribution:'Father of Science. First Philosopher. Founded abstract geometry and scientific method.' },
];

// Starky uses these when teaching maths — connects current topic to historical genius
export function getRelevantMathematician(topic) {
  const t = (topic || '').toLowerCase();
  if (t.includes('calculus') || t.includes('differentiation') || t.includes('integration')) return MATHEMATICIANS.find(m => m.name === 'Isaac Newton');
  if (t.includes('geometry') || t.includes('circle') || t.includes('sphere')) return MATHEMATICIANS.find(m => m.name === 'Archimedes');
  if (t.includes('algebra') || t.includes('equation')) return MATHEMATICIANS.find(m => m.rank === 25); // Al-Khwarizmi
  if (t.includes('triangle') || t.includes('pythagoras')) return MATHEMATICIANS.find(m => m.name === 'Pythagoras');
  if (t.includes('probability') || t.includes('statistics')) return MATHEMATICIANS.find(m => m.name === 'Blaise Pascal');
  if (t.includes('number theory') || t.includes('prime')) return MATHEMATICIANS.find(m => m.name === 'Carl Friedrich Gauss');
  if (t.includes('sequence') || t.includes('fibonacci') || t.includes('pattern')) return MATHEMATICIANS.find(m => m.name === 'Fibonacci');
  if (t.includes('graph') || t.includes('topology')) return MATHEMATICIANS.find(m => m.name === 'Leonhard Euler');
  if (t.includes('proof') || t.includes('logic')) return MATHEMATICIANS.find(m => m.name === 'Euclid');
  if (t.includes('computer') || t.includes('algorithm')) return MATHEMATICIANS.find(m => m.name === 'Alan Turing');
  if (t.includes('relativity') || t.includes('physics')) return MATHEMATICIANS.find(m => m.name === 'Albert Einstein');
  if (t.includes('trigonometry') || t.includes('sine') || t.includes('cosine')) return MATHEMATICIANS.find(m => m.rank === 37); // Aryabhata
  return MATHEMATICIANS[Math.floor(Math.random() * MATHEMATICIANS.length)];
}

export const NEWTON_QUOTES = [
  { text: 'If I have seen further, it is by standing on the shoulders of giants.', author: 'Isaac Newton' },
  { text: 'Number rules the universe.', author: 'Pythagoras' },
  { text: 'There is no royal road to geometry.', author: 'Euclid' },
  { text: 'An equation means nothing to me unless it expresses a thought of God.', author: 'Srinivasa Ramanujan' },
  { text: 'Give me a lever long enough and I shall move the world.', author: 'Archimedes' },
  { text: 'I think, therefore I am.', author: 'Rene Descartes' },
  { text: 'Mathematics is the queen of sciences and number theory is the queen of mathematics.', author: 'Carl Friedrich Gauss' },
  { text: 'The book of nature is written in the language of mathematics.', author: 'Galileo Galilei' },
  { text: 'Pure mathematics is the poetry of logical ideas.', author: 'Albert Einstein' },
  { text: 'Do not worry about your difficulties in mathematics. I can assure you mine are still greater.', author: 'Albert Einstein' },
];
