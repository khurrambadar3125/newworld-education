import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { ATOMS_SUBJECTS, ATOM_COUNTS, getAtomsBySubject } from '../utils/starkyAtomsKB';
import { SYLLABUS, getTopicsForSubject, getThemesForSubject } from '../utils/syllabusStructure';

/* ───── Progress Ring ───── */
function ProgressRing({ percent, size = 64, stroke = 5, color = '#C9A84C' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fill="#FAF6EB" fontSize={size * 0.24} fontWeight={900}
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
        {percent}%
      </text>
    </svg>
  );
}

/* ───── Difficulty Dots ───── */
function DifficultyDots({ level, max = 5 }) {
  return (
    <span style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(201,168,76,0.6)' }}>
      {Array.from({ length: max }, (_, i) => i < level ? '\u25CF' : '\u25CB').join('')}
    </span>
  );
}

/* ───── Nano Page ───── */
export default function NanoPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [selected, setSelected] = useState(null);
  const [atoms, setAtoms] = useState([]);
  const [mastery, setMastery] = useState({});
  const [unitFilter, setUnitFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  const [allMasteryMap, setAllMasteryMap] = useState({});
  const [allSubjectMastery, setAllSubjectMastery] = useState({});
  const [weeklyGoals, setWeeklyGoals] = useState(0);
  const [strongestSubject, setStrongestSubject] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isFirstNanoSession, setIsFirstNanoSession] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const goalsRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn(); window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Handle autostart URL params (from "Continue to Next Goal" button)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlSubject = params.get('subject');
      const urlAutostart = params.get('autostart');
      const urlAfterGoal = params.get('afterGoal');
      if (urlSubject && urlAutostart === 'next') {
        // Find the subject
        const matchedSubject = ATOMS_SUBJECTS.find(s => s.label.toLowerCase() === urlSubject.toLowerCase());
        if (matchedSubject) {
          setSelected(matchedSubject);
          // After atoms load, find next goal after the completed one
          setTimeout(() => {
            const subjectAtoms = getAtomsBySubject(matchedSubject.id);
            if (urlAfterGoal) {
              const completedIdx = subjectAtoms.findIndex(a => a.id === urlAfterGoal);
              const nextGoal = completedIdx >= 0 ? subjectAtoms[completedIdx + 1] : subjectAtoms[0];
              if (nextGoal) {
                const goalNum = subjectAtoms.indexOf(nextGoal) + 1;
                window.location.href = `/nano-teach?subject=${encodeURIComponent(matchedSubject.label)}&topic=${encodeURIComponent(nextGoal.topic || nextGoal.name || '')}&level=O+Level&goalId=${encodeURIComponent(nextGoal.id)}`;
              }
            }
          }, 300);
        }
      }
    } catch {}
  }, []);

  // Load all mastery data on mount — powers subject cards, momentum, recommendations
  useEffect(() => {
    try {
      const email = JSON.parse(localStorage.getItem('nw_user') || '{}').email;
      if (!email) return;
      setUserEmail(email);
      fetch(`/api/atoms/get-mastery?studentId=${encodeURIComponent(email)}`)
        .then(r => r.json())
        .then(data => {
          const records = data.mastery || [];
          const aMap = {};
          records.forEach(r => { aMap[r.atom_id] = r; });
          setAllMasteryMap(aMap);
          if (records.length === 0 && !localStorage.getItem('nw_nano_welcomed')) {
            setIsFirstNanoSession(true);
            setShowWelcome(true);
          }
          const sMap = {};
          const sMasteredCounts = {};
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
          let wCount = 0;
          ATOMS_SUBJECTS.forEach(s => {
            const sa = getAtomsBySubject(s.id);
            const mastered = sa.filter(a => aMap[a.id]?.mastery_score >= 7).length;
            sMap[s.id] = { mastered, total: sa.length };
            sMasteredCounts[s.id] = mastered;
          });
          records.forEach(r => {
            if (r.mastery_score >= 7 && r.last_seen > weekAgo) wCount++;
          });
          setAllSubjectMastery(sMap);
          setWeeklyGoals(wCount);
          let bestId = null, bestCount = 0;
          Object.entries(sMasteredCounts).forEach(([id, count]) => {
            if (count > bestCount) { bestCount = count; bestId = id; }
          });
          if (bestId && bestCount > 0) {
            const subj = ATOMS_SUBJECTS.find(s => s.id === bestId);
            setStrongestSubject(subj || null);
          }
        }).catch(() => {});
    } catch {}
  }, []);

  // Load atoms when subject selected
  useEffect(() => {
    if (!selected) return;
    setAtoms(getAtomsBySubject(selected.id));
    setUnitFilter('all');

    try {
      const email = JSON.parse(localStorage.getItem('nw_user') || '{}').email;
      if (email) {
        fetch(`/api/atoms/get-mastery?studentId=${encodeURIComponent(email)}&subject=${selected.id}`)
          .then(r => r.json())
          .then(data => {
            const map = {};
            (data.mastery || []).forEach(m => { map[m.atom_id] = m; });
            setMastery(map);
          }).catch(() => {});
      }
    } catch {}
  }, [selected]);

  // Scroll to goals when subject selected
  useEffect(() => {
    if (selected && atoms.length > 0 && goalsRef.current) {
      setTimeout(() => {
        goalsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selected, atoms]);

  // Group atoms by unit
  const unitMap = useMemo(() => {
    const map = {};
    atoms.forEach(a => {
      if (!map[a.unit]) map[a.unit] = [];
      map[a.unit].push(a);
    });
    return map;
  }, [atoms]);

  const units = useMemo(() => Object.keys(unitMap), [unitMap]);

  // Filtered atoms by unit tab
  const filteredAtoms = useMemo(() => {
    if (unitFilter === 'all') return atoms;
    return unitMap[unitFilter] || [];
  }, [atoms, unitFilter, unitMap]);

  const masteredCount = Object.values(mastery).filter(m => m.mastery_score >= 7).length;
  const pct = atoms.length > 0 ? Math.round((masteredCount / atoms.length) * 100) : 0;

  // Progress intelligence
  const progressData = useMemo(() => {
    if (!atoms.length) return null;
    let weakestUnit = null;
    let worstPct = 101;
    Object.entries(unitMap).forEach(([unit, unitAtoms]) => {
      const unitMastered = unitAtoms.filter(a => mastery[a.id]?.mastery_score >= 7).length;
      const unitPct = Math.round((unitMastered / unitAtoms.length) * 100);
      if (unitPct < worstPct) { worstPct = unitPct; weakestUnit = unit; }
    });
    let nextGoal = null;
    if (weakestUnit && unitMap[weakestUnit]) {
      nextGoal = unitMap[weakestUnit].find(a => !mastery[a.id] || mastery[a.id].mastery_score < 7);
    }
    if (!nextGoal) {
      nextGoal = atoms.find(a => !mastery[a.id] || mastery[a.id].mastery_score < 7);
    }
    const remaining = atoms.length - masteredCount;
    const estMinutes = remaining * 8;
    return { weakestUnit, worstPct, nextGoal, remaining, estMinutes };
  }, [atoms, mastery, unitMap, masteredCount]);

  const filteredSubjects = levelFilter === 'all'
    ? ATOMS_SUBJECTS
    : ATOMS_SUBJECTS.filter(s => s.level === levelFilter);

  // Recommended next goal — high weight, lowest difficulty, not mastered
  const recommendedGoal = useMemo(() => {
    if (!userEmail) return null;
    let best = null, bestSubject = null;
    for (const s of ATOMS_SUBJECTS) {
      const sa = getAtomsBySubject(s.id);
      for (const a of sa) {
        if (allMasteryMap[a.id]?.mastery_score >= 7) continue;
        if (!best) { best = a; bestSubject = s; continue; }
        if (a.examWeight === 'high' && best.examWeight !== 'high') { best = a; bestSubject = s; continue; }
        if (a.examWeight !== 'high' && best.examWeight === 'high') continue;
        if (a.difficulty < best.difficulty) { best = a; bestSubject = s; }
      }
    }
    return best ? { goal: best, subject: bestSubject } : null;
  }, [allMasteryMap, userEmail]);

  // Sorted + grouped atoms for unit-based rendering
  const sortedGroupedAtoms = useMemo(() => {
    const target = unitFilter === 'all' ? atoms : (unitMap[unitFilter] || []);
    const groups = {};
    target.forEach(a => { if (!groups[a.unit]) groups[a.unit] = []; groups[a.unit].push(a); });
    return Object.entries(groups).map(([unit, uAtoms]) => ({
      unit,
      atoms: [...uAtoms].sort((a, b) => {
        const sA = mastery[a.id]?.mastery_score || 0;
        const sB = mastery[b.id]?.mastery_score || 0;
        const rankA = sA >= 7 ? 2 : sA >= 1 ? 0 : 1;
        const rankB = sB >= 7 ? 2 : sB >= 1 ? 0 : 1;
        return rankA - rankB;
      }),
    }));
  }, [atoms, unitFilter, unitMap, mastery]);

  const EXAM_DAYS_REMAINING = Math.max(0, Math.ceil((new Date('2026-04-27') - new Date()) / (1000 * 60 * 60 * 24)));

  const getSubjectType = (subject) => {
    const types = {
      science: ['chemistry','physics','biology','combinedscience','humanandsocialbiology','environmentalmanagement','agriculture','marinescience'],
      humanities: ['history','pakistanstudies','sociology','psychology','law','globalperspectives'],
      english: ['english','englishlanguage','literatureinenglish','languageandliteratureinenglish','firstlanguageurdu','secondlanguageurdu','urdu','arabic','french','german','spanish','chinese','hindi'],
      maths: ['mathematics','furthermathematics','additionalmathematics','statistics'],
      business: ['economics','businessstudies','accounting','commerce','travelandtourism'],
      cs: ['computerscience','informationtechnology'],
      religious: ['islamiyat','islamicstudies','islamicreligionandculture','divinity'],
      geo: ['geography'],
    };
    const s = subject.toLowerCase().replace(/[\s&]/g, '');
    for (const [type, subjects] of Object.entries(types)) {
      if (subjects.some(sub => s.includes(sub) || sub.includes(s))) return type;
    }
    return 'general';
  };

  const getSubjectTemplate = (subjectType, goal, goalNumber, subject) => {
    const urgencyNote = EXAM_DAYS_REMAINING <= 30 ? `\nEXAM URGENCY: Cambridge exams begin in ${EXAM_DAYS_REMAINING} days. This is a HIGH WEIGHT goal. Teach with exam focus.` : '';
    const header = `Starky, I am working on Nano Goal ${goalNumber} in ${subject}.\nThe goal: "${goal.atom}"\nGoal ID: ${goal.id} | Difficulty: ${goal.difficulty}/5 | Exam weight: ${goal.examWeight}${urgencyNote}`;

    const templates = {
      science: `${header}\n\nFollow these steps EXACTLY:\n\nSTEP 1 — MISCONCEPTION CHECK\nBefore teaching, ask me ONE question to check if I have any wrong prior knowledge about this topic. Common misconceptions for science include wrong terminology ("killed" not "denatured"), wrong direction, wrong mechanism. If I reveal a misconception, correct it immediately before teaching.\n\nSTEP 2 — TEACH\nExplain the concept in 3-4 sentences. Include: the precise Cambridge definition, the underlying mechanism (WHY it happens), and one real-world example. End with the EXACT mark scheme phrase Cambridge requires. Say explicitly: "Cambridge mark schemes require this exact phrasing: [phrase]"\n\nSTEP 3 — WORKED EXAMPLE\nShow me a complete worked answer to a Cambridge exam question on this topic. Before showing the question, state:\n- The command word and what it demands\n- How many marks it is worth\n- The mark points Cambridge is looking for (listed as bullet points, without giving the actual answer yet)\nThen show the question. Then show a full mark-scheme answer. Say: "This is what a full marks answer looks like. Now you write your own."\n\nSTEP 4 — MY ATTEMPT\nGive me a DIFFERENT Cambridge exam question on the same concept. Tell me:\n- Command word: [word] — this means [demand]\n- Marks: [number]\n- Mark points to hit: [list WITHOUT answers]\nWait for my answer before doing anything else.\n\nSTEP 5 — MARK AND COMPLETE\nMark my answer:\na) Command word compliance — did I answer what was asked?\nb) Mark scheme language — quote any rejected phrase and give the accepted phrase\nc) Examiner report check — flag any mistake Cambridge examiners specifically penalise\nd) Mark points: show each point, tick if I earned it, cross if I missed it, show the exact phrase that earns each missed mark\ne) If I scored 70%+: output exactly "NANO_GOAL_COMPLETE:${goal.id}" then say "Goal ${goalNumber} mastered."\nf) If below 70%: give me ONE specific hint and ask me to try again. Do not complete until I reach 70%.`,

      humanities: `${header}\n\nFollow these steps EXACTLY:\n\nSTEP 1 — CONTEXT AND SIGNIFICANCE\nTeach this concept by answering three questions:\n1. WHAT: What is this fact/event/concept?\n2. WHY IT MATTERED: Why was this significant in its historical/social context?\n3. HOW IT CONNECTS: How does this connect to the bigger themes examiners test?\nEnd with: the exact vocabulary Cambridge examiners expect to see in answers on this topic.\n\nSTEP 2 — ARGUMENT PRACTICE\nGive me a Cambridge-style question that requires an ARGUMENT, not just a description. Before I answer, tell me:\n- Command word: [word] — this demands [what]\n- Marks: [number]\n- What distinguishes a Band 1 answer from a Band 2 answer on this question\n- The 3 argument points that would earn top marks (WITHOUT writing the argument)\n\nSTEP 3 — WORKED EXAMPLE\nShow me a Band 1 paragraph answer to this question. Label each element: [POINT] [EVIDENCE] [EXPLANATION] [LINK]. Say: "This structure earns top marks. Now write your own paragraph."\n\nSTEP 4 — MY ATTEMPT\nAsk me to write my own answer. Wait for my response.\n\nSTEP 5 — MARK AND COMPLETE\nMark against Cambridge band descriptors:\na) Is there a clear argument (not description)?\nb) Is evidence specific and accurate?\nc) Is explanation developed (not just stated)?\nd) For A Level: is there historiography?\ne) Does it reach a conclusion/judgement?\nShow which band my answer falls in and exactly ONE thing to do to reach Band 1.\nIf Band 2 or above: "NANO_GOAL_COMPLETE:${goal.id}" then "Goal ${goalNumber} mastered."\nIf Band 3 or below: one more attempt with hint.`,

      english: `${header}\n\nFollow these steps EXACTLY:\n\nSTEP 1 — TECHNIQUE AND EFFECT\nTeach this language/literature concept:\n1. NAME the technique/skill precisely\n2. SHOW an example of it in a text\n3. EXPLAIN the effect on the reader (this is where marks are earned or lost)\n4. STATE the exact analytical vocabulary Cambridge rewards: words like "conveys", "evokes", "implies", "juxtaposes", "connotes"\n\nSTEP 2 — WORKED ANALYSIS\nShow me a short passage or quotation. Write a model analytical paragraph using PETAL: Point, Evidence, Technique, Analysis, Link. Label each element clearly. Say: "This is what full marks looks like."\n\nSTEP 3 — MY ATTEMPT\nGive me a different short passage/quotation. Ask me to write one analytical paragraph. Remind me: quote must be embedded, technique must be named, effect on reader must be explained — not just identified. Wait for my answer.\n\nSTEP 4 — MARK AND COMPLETE\nCheck:\na) Is the quote embedded (not a block quote)?\nb) Is the technique named precisely?\nc) Is the EFFECT on the reader explained? (Not just what the writer does — what it makes the reader feel/think/understand)\nd) Is the vocabulary precise and academic?\nIf all four: "NANO_GOAL_COMPLETE:${goal.id}" then "Goal ${goalNumber} mastered."\nIf missing any: show exactly which element is missing and ask for a revision.`,

      maths: `${header}\n\nFollow these steps EXACTLY:\n\nSTEP 1 — CONCEPT AND FORMULA\nTeach this mathematical concept:\n1. State the rule/formula/theorem precisely\n2. Explain WHEN to use it (what triggers it in a question)\n3. Show ONE worked example with every step written out explicitly\n4. State Cambridge mark scheme rules: must show all working or marks lost, units required if applicable, significant figures expected\n\nSTEP 2 — COMMON ERRORS\nList the 3 most common errors Cambridge examiners see on this topic. Say: "Students always lose marks here by..."\n\nSTEP 3 — WORKED EXAMPLE\nWork through a complete Cambridge past paper question on this concept. Show: formula first, substitution second, working line by line, final answer with units. Label: "Each line here is a separate mark."\n\nSTEP 4 — MY ATTEMPT\nGive me a similar question with different numbers, same concept. Wait for my answer. Remind me: show all working, include units.\n\nSTEP 5 — MARK AND COMPLETE\nCheck:\na) Is the correct method used?\nb) Is all working shown?\nc) Is arithmetic correct throughout?\nd) Are units correct on the final answer?\ne) Are significant figures appropriate?\nAward method marks even if arithmetic is wrong.\nIf method correct and answer right: "NANO_GOAL_COMPLETE:${goal.id}" then "Goal ${goalNumber} mastered."\nIf method wrong: explain the correct approach and give one more attempt.`,

      business: `${header}\n\nFollow these steps EXACTLY:\n\nSTEP 1 — CONCEPT IN CONTEXT\nTeach this business/economics concept:\n1. Define it precisely (Cambridge definition)\n2. Explain it with a real business example (use a company a student would know)\n3. Explain WHY it matters to a business\n4. State the exact terminology Cambridge examiners expect in answers\n\nSTEP 2 — APPLICATION PRACTICE\nGive me a short business scenario (2-3 lines). Ask me to apply this concept to that scenario. Before I answer, tell me:\n- Command word and what it demands\n- Whether evaluation is required\n- What "applying to context" actually means for marks\n\nSTEP 3 — WORKED EXAMPLE\nShow me a full mark-scheme answer to a Cambridge question on this concept. Label: knowledge mark, application mark, analysis mark, evaluation mark. Say: "This is how marks are distributed."\n\nSTEP 4 — MY ATTEMPT\nGive me a new scenario and question. Wait for my answer.\n\nSTEP 5 — MARK AND COMPLETE\nCheck each Assessment Objective:\nAO1 Knowledge: correct definition/theory?\nAO2 Application: applied to THIS context?\nAO3 Analysis: developed the argument?\nAO4 Evaluation: reached a judgement? (Required for top marks)\nIf AO1+AO2+AO3 present: "NANO_GOAL_COMPLETE:${goal.id}" then "Goal ${goalNumber} mastered."\nIf evaluation missing on a question that requires it: one more attempt with prompt.`,

      general: `${header}\n\nSTEP 1 — MISCONCEPTION CHECK\nAsk me what I already know. Build on it.\n\nSTEP 2 — TEACH\nExplain clearly. Include the Cambridge mark scheme phrase. Give an example.\n\nSTEP 3 — WORKED EXAMPLE\nShow a full mark answer. Label each mark.\n\nSTEP 4 — MY ATTEMPT\nGive me a Cambridge question. Wait.\n\nSTEP 5 — MARK AND COMPLETE\nMark precisely. Correct language errors.\nIf 70%+: "NANO_GOAL_COMPLETE:${goal.id}" then "Goal ${goalNumber} mastered."\nIf below: one more attempt with a hint.`,
    };

    // cs, religious, geo fall back to science or general
    if (subjectType === 'cs') return templates.science;
    if (subjectType === 'religious') return templates.humanities;
    if (subjectType === 'geo') return templates.humanities;
    return templates[subjectType] || templates.general;
  };

  const buildNanoMessage = (goal, goalNumber, subject, isFirst = false) => {
    const subjectType = getSubjectType(subject);
    const template = getSubjectTemplate(subjectType, goal, goalNumber, subject);
    const fastTrack = `\n\nIMPORTANT: If I say "I know this" or "skip teaching" at any point, jump directly to STEP 4 — give me the exam question immediately. Do not re-teach.`;
    const firstPrefix = isFirst ? '[FIRST_NANO_SESSION]\n\n' : '';
    return firstPrefix + template + fastTrack;
  };

  const handleSelectSubject = (s) => {
    setSelected(s);
  };

  const handleBack = () => {
    setSelected(null);
    setAtoms([]);
    setMastery({});
    setUnitFilter('all');
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', fontFamily: "'Sora',-apple-system,sans-serif", color: '#FAF6EB' }}>
      <Head>
        <title>Starky Nano — Learn any Cambridge subject, one goal at a time | NewWorldEdu</title>
        <meta name="description" content="Starky Nano: your personal Cambridge learning journey. Pick a subject, master one goal at a time with Starky as your tutor." />
      </Head>

      <style jsx global>{`
        @keyframes nanoFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .nano-fadein { animation: nanoFadeIn 0.4s ease both; }
        .nano-subject-card { transition: all 0.2s ease; }
        .nano-subject-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .nano-goal-row { transition: all 0.15s ease; min-height: 44px; }
        .nano-goal-row:hover { background: rgba(201,168,76,0.06) !important; }
        .nano-learn-btn { transition: all 0.2s ease; }
        .nano-learn-btn:hover { background: #C9A84C !important; color: #0A1628 !important; }
        .nano-unit-tab { transition: all 0.2s ease; white-space: nowrap; }
        .nano-unit-tab:hover { background: rgba(201,168,76,0.1) !important; }
        .nano-back-btn { transition: all 0.2s ease; }
        .nano-back-btn:hover { color: #C9A84C !important; }
      `}</style>

      {/* ═══ HERO ═══ */}
      <div style={{ textAlign: 'center', padding: isMobile ? '48px 20px 36px' : '72px 24px 48px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 100, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: '#C9A84C', marginBottom: 20, letterSpacing: '0.02em' }}>
          STARKY NANO
        </div>
        <h1 style={{ fontSize: isMobile ? 28 : 44, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.15, color: '#FAF6EB' }}>
          Learn any Cambridge subject.{' '}
          <span style={{ background: 'linear-gradient(135deg,#C9A84C,#E8D48B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            One goal at a time.
          </span>
        </h1>
        <p style={{ color: 'rgba(250,246,235,0.55)', fontSize: isMobile ? 15 : 17, margin: '0 0 28px', lineHeight: 1.7, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
          Every Cambridge subject with exact textbook chapters. Pick a chapter, learn with a worked example, practice with real past paper questions. Master one chapter at a time.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 24 : 48 }}>
          {[
            { value: Object.keys(SYLLABUS).length, label: 'Subjects' },
            { value: Object.values(SYLLABUS).reduce((s, d) => s + d.themes.reduce((t, th) => t + th.sections.length, 0), 0), label: 'Textbook chapters' },
            { value: '50,000+', label: 'Verified questions' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#C9A84C' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ FIRST NANO SESSION WELCOME ═══ */}
      {showWelcome && (
        <div className="nano-fadein" style={{ maxWidth: 600, margin: '0 auto', padding: isMobile ? '0 20px 32px' : '0 24px 40px' }}>
          <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 20, padding: isMobile ? '32px 20px' : '40px 36px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>&#9883;&#65039;</div>
            <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#C9A84C', margin: '0 0 20px', lineHeight: 1.3 }}>Welcome to Starky Nano</h2>
            <p style={{ fontSize: isMobile ? 14 : 16, color: 'rgba(250,246,235,0.7)', lineHeight: 1.8, margin: '0 0 20px', fontStyle: 'italic', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
              &ldquo;Every A* student in Cambridge history mastered the same content you&apos;re about to study. The difference was how deeply they understood each concept &mdash; not how much they covered.&rdquo;
            </p>
            <p style={{ fontSize: isMobile ? 13 : 15, color: 'rgba(250,246,235,0.55)', lineHeight: 1.7, margin: '0 0 12px', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
              Starky Nano breaks every Cambridge subject into individual learning goals. Master one goal at a time. Starky teaches it. Starky tests it. You own it before you move on.
            </p>
            <p style={{ fontSize: isMobile ? 13 : 15, color: '#C9A84C', fontWeight: 700, margin: '0 0 24px' }}>
              Start with one goal today. That&apos;s all it takes to begin.
            </p>
            <button onClick={() => { setShowWelcome(false); localStorage.setItem('nw_nano_welcomed', '1'); }}
              className="nano-learn-btn"
              style={{ fontSize: 16, fontWeight: 700, color: '#0A1628', background: '#C9A84C', border: 'none', borderRadius: 12, padding: '14px 36px', cursor: 'pointer' }}>
              Choose Your First Subject &rarr;
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '0 16px 40px' : '0 24px 60px' }}>

        {/* ═══ MOMENTUM BAR (logged in users) ═══ */}
        {userEmail && (weeklyGoals > 0 || strongestSubject) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, justifyContent: 'center' }}>
            {weeklyGoals > 0 && (
              <div style={{ background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.2)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#FF8C00' }}>
                &#128293; You&apos;ve mastered {weeklyGoals} goal{weeklyGoals !== 1 ? 's' : ''} this week
              </div>
            )}
            {strongestSubject && (
              <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#C9A84C' }}>
                &#9889; Strongest: {strongestSubject.label}
              </div>
            )}
            {strongestSubject && allSubjectMastery[strongestSubject.id] && allSubjectMastery[strongestSubject.id].mastered < allSubjectMastery[strongestSubject.id].total && (
              <div style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#4F8EF7' }}>
                &#128200; {allSubjectMastery[strongestSubject.id].total - allSubjectMastery[strongestSubject.id].mastered} goals to finish {strongestSubject.label}
              </div>
            )}
          </div>
        )}

        {/* ═══ LEVEL FILTER TABS ═══ */}
        <div ref={gridRef} style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
          {['all', 'O Level', 'A Level'].map(level => {
            const isActive = levelFilter === level;
            return (
              <button key={level} onClick={() => setLevelFilter(level)}
                style={{ background: isActive ? 'rgba(201,168,76,0.15)' : 'rgba(250,246,235,0.04)', border: isActive ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(250,246,235,0.08)', borderRadius: 100, padding: '8px 20px', color: isActive ? '#C9A84C' : 'rgba(250,246,235,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                {level === 'all' ? 'All Subjects' : level}
              </button>
            );
          })}
        </div>

        {/* ═══ SUBJECT GRID ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 12, marginBottom: 36 }}>
          {filteredSubjects.map(s => {
            const isSelected = selected?.id === s.id;
            return (
              <button key={s.id} onClick={() => handleSelectSubject(s)} className="nano-subject-card"
                style={{ background: isSelected ? 'rgba(201,168,76,0.08)' : 'rgba(250,246,235,0.03)', border: isSelected ? '2px solid #C9A84C' : '1px solid rgba(250,246,235,0.06)', borderRadius: 14, padding: isMobile ? '18px 10px' : '22px 14px', cursor: 'pointer', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#FAF6EB', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: 'rgba(250,246,235,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{s.level}</div>
                {SYLLABUS[s.label] && <div style={{ fontSize: 9, color: 'rgba(201,168,76,0.5)', fontWeight: 600 }}>{getTopicsForSubject(s.label).length} chapters</div>}
                {(() => {
                  const sm = allSubjectMastery[s.id];
                  const sMastered = sm?.mastered || 0;
                  const sTotal = sm?.total || s.totalAtoms;
                  const sPct = sTotal > 0 ? Math.round((sMastered / sTotal) * 100) : 0;
                  const sRemaining = sTotal - sMastered;
                  const sMinutes = sRemaining * 8;
                  const sTime = sMinutes < 60 ? `~${sMinutes} min` : `~${Math.round(sMinutes / 60)} hrs`;
                  const status = sMastered === 0 ? 'not_started' : sMastered >= sTotal ? 'complete' : 'in_progress';
                  return (
                    <>
                      <ProgressRing percent={sPct} size={40} stroke={3} color={status === 'complete' ? '#4CC97B' : '#C9A84C'} />
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(250,246,235,0.5)', marginTop: 4 }}>{sMastered} of {sTotal}</div>
                      {sRemaining > 0 && <div style={{ fontSize: 10, color: 'rgba(250,246,235,0.25)', marginTop: 2 }}>{sTime} left</div>}
                      <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 800, marginTop: 6, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em',
                        ...(status === 'complete' ? { background: 'rgba(76,201,123,0.15)', color: '#4CC97B', border: '1px solid rgba(76,201,123,0.3)' } : status === 'in_progress' ? { background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' } : { background: 'rgba(250,246,235,0.04)', color: 'rgba(250,246,235,0.3)', border: '1px solid rgba(250,246,235,0.06)' })
                      }}>{status === 'complete' ? '\u2705 Complete' : status === 'in_progress' ? 'In progress' : 'Not started'}</div>
                    </>
                  );
                })()}
              </button>
            );
          })}
        </div>

        {/* ═══ RECOMMENDED NEXT GOAL ═══ */}
        {!selected && recommendedGoal && (
          <div className="nano-fadein" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: isMobile ? '20px' : '24px', marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(250,246,235,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>&#127919; Recommended Next Goal</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#C9A84C', marginBottom: 6 }}>{recommendedGoal.subject.icon} {recommendedGoal.subject.label} — {recommendedGoal.subject.level}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#FAF6EB', lineHeight: 1.55, marginBottom: 10 }}>{recommendedGoal.goal.atom}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
              <DifficultyDots level={recommendedGoal.goal.difficulty} />
              <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' }}>
                {recommendedGoal.goal.examWeight === 'high' ? 'HIGH WEIGHT' : 'MED WEIGHT'}
              </span>
            </div>
            <a href={`/nano-teach?subject=${encodeURIComponent(recommendedGoal.subject.label)}&topic=${encodeURIComponent(recommendedGoal.goal.topic || recommendedGoal.goal.name || '')}&level=O+Level&goalId=${encodeURIComponent(recommendedGoal.goal.id)}`}
              className="nano-learn-btn" style={{ display: 'inline-block', fontSize: 14, fontWeight: 700, color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 10, padding: '10px 24px', textDecoration: 'none' }}>
              Start Learning &rarr;
            </a>
          </div>
        )}

        {/* ═══ GOALS SECTION (when subject selected) ═══ */}
        {selected && atoms.length > 0 && (
          <div ref={goalsRef} className="nano-fadein">

            {/* ── Header with back button ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <button onClick={handleBack} className="nano-back-btn"
                  style={{ background: 'none', border: 'none', color: 'rgba(250,246,235,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '4px 0', marginBottom: 6 }}>
                  &larr; All Subjects
                </button>
                <h2 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 900, margin: 0, color: '#FAF6EB' }}>
                  {selected.icon} {selected.label} — {selected.level}
                </h2>
                <div style={{ fontSize: 13, color: 'rgba(250,246,235,0.4)', marginTop: 4 }}>
                  {SYLLABUS[selected.label] ? `${getTopicsForSubject(selected.label).length} textbook chapters` : `${atoms.length} Nano goals`}
                </div>
              </div>
              <ProgressRing percent={pct} size={64} stroke={5} color="#C9A84C" />
            </div>

            {/* ── Progress Intelligence ── */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 20 }}>
              <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 14, padding: isMobile ? '16px' : '20px' }}>
                <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 4, color: '#FAF6EB' }}>
                  {masteredCount} <span style={{ fontWeight: 400, fontSize: 13, color: 'rgba(250,246,235,0.5)' }}>of {atoms.length} mastered</span>
                </div>
                {progressData && progressData.remaining > 0 && (
                  <div style={{ fontSize: 12, color: 'rgba(201,168,76,0.7)' }}>
                    ~{progressData.estMinutes < 60 ? `${progressData.estMinutes} min` : `${Math.round(progressData.estMinutes / 60)} hrs`} to complete
                  </div>
                )}
              </div>
              <div style={{ background: 'rgba(250,246,235,0.03)', border: '1px solid rgba(250,246,235,0.06)', borderRadius: 14, padding: isMobile ? '16px' : '20px' }}>
                {progressData?.weakestUnit && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(250,246,235,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Weakest Unit</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#FAF6EB' }}>{progressData.weakestUnit}</div>
                    <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.4)' }}>{progressData.worstPct}% mastered</div>
                  </div>
                )}
                {progressData?.nextGoal && (
                  <div style={{ marginTop: progressData.weakestUnit ? 10 : 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(250,246,235,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Next Recommended</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#FAF6EB', lineHeight: 1.5, maxHeight: 36, overflow: 'hidden' }}>{progressData.nextGoal.atom}</div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Unit Filter Tabs ── */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
              <button onClick={() => setUnitFilter('all')} className="nano-unit-tab"
                style={{ background: unitFilter === 'all' ? 'rgba(201,168,76,0.15)' : 'rgba(250,246,235,0.04)', border: unitFilter === 'all' ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(250,246,235,0.06)', borderRadius: 8, padding: '6px 14px', color: unitFilter === 'all' ? '#C9A84C' : 'rgba(250,246,235,0.45)', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                All Units
              </button>
              {units.map(unit => {
                const isActive = unitFilter === unit;
                return (
                  <button key={unit} onClick={() => setUnitFilter(unit)} className="nano-unit-tab"
                    style={{ background: isActive ? 'rgba(201,168,76,0.15)' : 'rgba(250,246,235,0.04)', border: isActive ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(250,246,235,0.06)', borderRadius: 8, padding: '6px 14px', color: isActive ? '#C9A84C' : 'rgba(250,246,235,0.45)', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                    {unit}
                  </button>
                );
              })}
            </div>

            {/* ── Goals List (grouped by unit, sorted by status) ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 28 }}>
              {sortedGroupedAtoms.map(group => {
                const unitAtomsFull = unitMap[group.unit] || [];
                const unitMastered = unitAtomsFull.filter(a => mastery[a.id]?.mastery_score >= 7).length;
                const unitPct = unitAtomsFull.length > 0 ? Math.round((unitMastered / unitAtomsFull.length) * 100) : 0;
                const unitComplete = unitMastered === unitAtomsFull.length && unitAtomsFull.length > 0;
                return (
                  <div key={group.unit} style={{ marginBottom: 12 }}>
                    {/* Unit header */}
                    <div style={{ padding: '14px 18px 10px', borderRadius: '12px 12px 0 0',
                      background: unitComplete ? 'rgba(76,201,123,0.04)' : 'rgba(250,246,235,0.02)',
                      ...(unitComplete ? { boxShadow: '0 0 20px rgba(201,168,76,0.08)' } : {}) }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: unitComplete ? '#4CC97B' : '#FAF6EB' }}>
                          {group.unit} {unitComplete && '\u2705'}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.4)', fontWeight: 600 }}>
                          {unitMastered} of {unitAtomsFull.length} mastered
                        </div>
                      </div>
                      <div style={{ height: 4, background: 'rgba(250,246,235,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${unitPct}%`, background: unitComplete ? '#4CC97B' : '#C9A84C', borderRadius: 2, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                    {/* Goals in this unit */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 }}>
                      {group.atoms.map(a => {
                        const m = mastery[a.id];
                        const score = m?.mastery_score || 0;
                        const isMastered = score >= 7;
                        const inProgress = score >= 1 && score < 7;
                        const goalNum = atoms.indexOf(a) + 1;

                        return (
                          <div key={a.id} className="nano-goal-row"
                            style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 10 : 14, padding: isMobile ? '14px 12px' : '14px 18px', background: 'rgba(250,246,235,0.02)', borderRadius: 12, border: '1px solid rgba(250,246,235,0.04)', flexDirection: isMobile ? 'column' : 'row' }}>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0, width: isMobile ? '100%' : 'auto' }}>
                              <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(250,246,235,0.2)', minWidth: 28, flexShrink: 0, paddingTop: 2 }}>
                                #{goalNum}
                              </div>
                              <div style={{ fontSize: 16, flexShrink: 0, paddingTop: 1 }}>
                                {isMastered ? '\u2705' : inProgress ? '\u26A1' : '\u25CB'}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: isMastered ? 'rgba(250,246,235,0.45)' : '#FAF6EB', lineHeight: 1.55, textDecoration: isMastered ? 'line-through' : 'none', textDecorationColor: 'rgba(250,246,235,0.15)' }}>
                                  {a.atom}
                                </div>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                                  <DifficultyDots level={a.difficulty} />
                                  <span style={{
                                    fontSize: 9, padding: '2px 7px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em',
                                    background: a.examWeight === 'high' ? 'rgba(201,168,76,0.12)' : 'rgba(250,246,235,0.04)',
                                    color: a.examWeight === 'high' ? '#C9A84C' : 'rgba(250,246,235,0.3)',
                                    border: `1px solid ${a.examWeight === 'high' ? 'rgba(201,168,76,0.25)' : 'rgba(250,246,235,0.06)'}`,
                                  }}>
                                    {a.examWeight === 'high' ? 'HIGH' : 'MED'}
                                  </span>
                                  {isMastered && (
                                    <span style={{ fontSize: 10, fontWeight: 700, color: '#4CC97B' }}>Mastered</span>
                                  )}
                                  {inProgress && (
                                    <span style={{ fontSize: 10, fontWeight: 700, color: '#C9A84C' }}>In progress</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {!isMastered && (
                              <a href={`/nano-teach?subject=${encodeURIComponent(selected.label)}&topic=${encodeURIComponent(a.topic || a.name || '')}&level=O+Level&goalId=${encodeURIComponent(a.id)}`}
                                className="nano-learn-btn"
                                style={{
                                  flexShrink: 0, fontSize: 13, fontWeight: 700, color: '#C9A84C',
                                  border: '1px solid rgba(201,168,76,0.3)', borderRadius: 10,
                                  padding: isMobile ? '10px 0' : '9px 18px',
                                  textDecoration: 'none', whiteSpace: 'nowrap', textAlign: 'center',
                                  width: isMobile ? '100%' : 'auto', display: 'block',
                                }}>
                                Learn with Starky &rarr;
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Mastered goals summary ── */}
            {masteredCount > 0 && (
              <div style={{ background: 'rgba(76,201,123,0.04)', border: '1px solid rgba(76,201,123,0.12)', borderRadius: 16, padding: isMobile ? '20px' : '24px', marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>&#127942;</span>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#4CC97B' }}>
                    {masteredCount} Goal{masteredCount !== 1 ? 's' : ''} Mastered
                  </h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {atoms.filter(a => mastery[a.id]?.mastery_score >= 7).map(a => (
                    <span key={a.id} style={{ fontSize: 11, fontWeight: 600, background: 'rgba(76,201,123,0.1)', border: '1px solid rgba(76,201,123,0.2)', borderRadius: 8, padding: '4px 10px', color: 'rgba(250,246,235,0.7)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.atom.length > 50 ? a.atom.slice(0, 47) + '...' : a.atom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ EMPTY STATE ═══ */}
        {!selected && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(250,246,235,0.35)', fontSize: 15 }}>
            Pick a subject above to start your learning journey
          </div>
        )}
      </div>

      <footer style={{ padding: '24px 16px', textAlign: 'center', borderTop: '1px solid rgba(250,246,235,0.04)' }}>
        <div style={{ fontSize: 11, color: 'rgba(250,246,235,0.2)' }}>&copy; 2026 NewWorldEdu &middot; newworld.education</div>
      </footer>
    </div>
  );
}
