// fix-all.js
// node /Users/whitestar/newworld-platform/fix-all.js

const fs = require('fs');

// ═══════════════════════════════════════
// FIX 1: Clean up index.jsx nav
// ═══════════════════════════════════════
const indexPath = '/Users/whitestar/newworld-platform/pages/index.jsx';
let index = fs.readFileSync(indexPath, 'utf8');

// Remove ALL previously injected nav links (any combination)
const patterns = [
  '<a href="/music" className="bo">Music</a><a href="/reading" className="bo">Reading</a><a href="/arts" className="bo">Arts</a><a href="/music-for-all" className="bo">Music for All</a><a href="/reading-for-all" className="bo">Reading for All</a><a href="/arts-for-all" className="bo">Arts for All</a>',
  '<a href="/music" className="bo">Music</a><a href="/reading" className="bo">Reading</a><a href="/arts" className="bo">Arts</a>',
  '<a href="/music">Music</a><a href="/reading">Reading</a><a href="/arts">Arts</a>',
  '\n          <a href="/music" className="bo">Music</a>\n          <a href="/reading" className="bo">Reading</a>\n          <a href="/arts" className="bo">Arts</a>\n          <a href="/music-for-all" className="bo">Music for All</a>\n          <a href="/reading-for-all" className="bo">Reading for All</a>\n          <a href="/arts-for-all" className="bo">Arts for All</a>\n',
];
patterns.forEach(p => { index = index.split(p).join(''); });

// Find the navbar - look for a <nav> or header nav links area
// Add Music/Reading/Arts to navbar only - find the nav special-needs link
// The navbar link is a plain <a> without className="bo"
const navPattern = /(<nav[^>]*>[\s\S]*?)(href="\/special-needs")/;
if (navPattern.test(index)) {
  index = index.replace(navPattern, (match, before, href) => {
    return before + 'href="/music">Music</a><a href="/reading">Reading</a><a href="/arts">Arts</a><a ' + href;
  });
  console.log('Added Music/Reading/Arts to navbar');
} else {
  // fallback: find first plain <a href="/special-needs"> not in hero
  const heroEnd = index.indexOf('</section>');
  const afterHero = index.indexOf('href="/special-needs"', heroEnd);
  if (afterHero > -1) {
    const tagStart = index.lastIndexOf('<a ', afterHero);
    index = index.slice(0, tagStart) + '<a href="/music">Music</a><a href="/reading">Reading</a><a href="/arts">Arts</a>' + index.slice(tagStart);
    console.log('Added nav links via fallback');
  } else {
    console.log('WARNING: Could not find navbar location');
  }
}

fs.writeFileSync(indexPath, index);
console.log('index.jsx done');

// ═══════════════════════════════════════
// FIX 2: Add sections to special-needs
// ═══════════════════════════════════════
const snPath = '/Users/whitestar/newworld-platform/pages/special-needs.jsx';
let sn = fs.readFileSync(snPath, 'utf8');

// Remove any previous injection
if (sn.includes('CREATIVE LEARNING SECTIONS')) {
  const start = sn.indexOf('{/* ── CREATIVE LEARNING SECTIONS');
  const end = sn.indexOf('View Plans</a>\n        </div>\n      </div>');
  if (start > -1 && end > -1) {
    sn = sn.slice(0, start) + sn.slice(end + 'View Plans</a>\n        </div>\n      </div>'.length);
    console.log('Removed old injection');
  }
}

const hasMobile = sn.includes('isMobile');
const mob = hasMobile ? 'isMobile' : 'false';

const newBlock = `
      {/* CREATIVE LEARNING SECTIONS */}
      <div style={{marginTop:48,paddingTop:40,borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"inline-block",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 16px",fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:2,marginBottom:12}}>CREATIVE LEARNING</div>
          <h2 style={{fontSize:` + mob + `?20:28,fontWeight:900,margin:"0 0 8px",color:"#fff"}}>Music, Reading <span style={{color:"#C77DFF"}}>&</span> Arts</h2>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",maxWidth:560,margin:"0 auto",lineHeight:1.8}}>Specialist creative learning built for children with autism, ADHD, dyslexia, Down syndrome, cerebral palsy, visual impairment, and complex communication needs.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:` + mob + `?"1fr":"repeat(3,1fr)",gap:14}}>
          {[
            {href:"/music-for-all",emoji:"\uD83C\uDFB5",color:"#FFC300",name:"Music",tag:"Every child is musical",desc:"Music therapy approaches for 7 special needs profiles. Rhythm, instruments, songwriting and listening activities — each adapted to the child."},
            {href:"/reading-for-all",emoji:"\uD83D\uDCD6",color:"#63D2FF",name:"Reading",tag:"Every child deserves a reading life",desc:"Evidence-based reading support across 7 profiles. Voice input so children can speak to Starky. 120+ books with specialist teaching modes."},
            {href:"/arts-for-all",emoji:"\uD83C\uDFA8",color:"#A8E063",name:"Arts",tag:"Every child has something to express",desc:"Adapted visual arts and creative expression. Low-tech and high-tech options. Every activity has an adaptive version for every need."},
          ].map(function(s){return(
            <a key={s.href} href={s.href} style={{textDecoration:"none",display:"block",background:s.color+"0A",border:"2px solid "+s.color+"30",borderRadius:20,padding:20,color:"#fff",transition:"all 0.15s"}}
              onMouseEnter={function(e){e.currentTarget.style.background=s.color+"18";e.currentTarget.style.borderColor=s.color;e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={function(e){e.currentTarget.style.background=s.color+"0A";e.currentTarget.style.borderColor=s.color+"30";e.currentTarget.style.transform="none";}}>
              <div style={{fontSize:36,marginBottom:10}}>{s.emoji}</div>
              <div style={{fontWeight:900,fontSize:18,color:s.color,marginBottom:4}}>{s.name}</div>
              <div style={{fontSize:12,fontStyle:"italic",color:s.color+"BB",marginBottom:10}}>{s.tag}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:14}}>{s.desc}</div>
              <div style={{background:s.color,borderRadius:10,padding:"9px 14px",textAlign:"center",fontWeight:900,fontSize:13,color:"#060B20"}}>Open {s.name} \u2192</div>
            </a>
          );})}
        </div>
        <div style={{background:"rgba(199,125,255,0.06)",border:"1px solid rgba(199,125,255,0.2)",borderRadius:16,padding:"20px 28px",marginTop:16,textAlign:"center"}}>
          <div style={{fontWeight:800,fontSize:14,color:"rgba(255,255,255,0.8)",marginBottom:6}}>All included in the Special Needs Plan \u2014 $149.99/year</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.8,marginBottom:12}}>Full access to Music, Reading, and Arts \u2014 all 7 specialist profiles, 120+ books, evidence-based teaching, and parent guides.</div>
          <a href="/pricing" style={{display:"inline-block",background:"linear-gradient(135deg,#C77DFF,#7B5EA7)",borderRadius:12,padding:"10px 24px",color:"#fff",fontWeight:900,fontSize:13,textDecoration:"none"}}>View Plans</a>
        </div>
      </div>
`;

const lastSec = sn.lastIndexOf('</section>');
if (lastSec > -1) {
  sn = sn.slice(0, lastSec) + newBlock + '\n      ' + sn.slice(lastSec);
  console.log('Injected before last </section>');
} else {
  const lastDiv = sn.lastIndexOf('\n    </div>');
  sn = sn.slice(0, lastDiv) + newBlock + sn.slice(lastDiv);
  console.log('Injected before last </div>');
}

fs.writeFileSync(snPath, sn);
console.log('special-needs.jsx done');
console.log('');
console.log('Now run: cd /Users/whitestar/newworld-platform && npm run build && npx vercel --prod');
