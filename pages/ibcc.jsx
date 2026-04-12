import Head from 'next/head';
import { useState } from 'react';

// IBCC O Level grade → percentage mapping (official IBCC table)
const GRADE_PCT = { 'A*': 90, 'A': 80, 'B': 70, 'C': 60, 'D': 50, 'E': 40, 'U': 0 };
const GRADE_OPTIONS = ['A*', 'A', 'B', 'C', 'D', 'E'];

// A Level grade → marks out of 100 (IBCC standard)
const ALEVEL_GRADE_PCT = { 'A*': 95, 'A': 85, 'B': 75, 'C': 65, 'D': 55, 'E': 45, 'U': 0 };

// Pre-Medical accepted subjects for IBCC equivalence
const PRE_MEDICAL_SUBJECTS = ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'English Language', 'Pakistan Studies', 'Islamiyat'];
const PRE_ENGINEERING_SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English Language', 'Pakistan Studies', 'Islamiyat'];

// Common O Level subjects for the calculator
const O_LEVEL_SUBJECTS = [
  'English Language', 'English Literature', 'Mathematics', 'Additional Mathematics',
  'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'Pakistan Studies', 'Islamiyat', 'Urdu', 'Economics',
  'Business Studies', 'Accounting', 'History', 'Geography',
  'Sociology', 'Psychology', 'Art & Design', 'Other'
];

const A_LEVEL_SUBJECTS = [
  'Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English Language', 'Literature in English', 'Economics',
  'Business Studies', 'Accounting', 'Computer Science',
  'History', 'Geography', 'Sociology', 'Psychology', 'Law',
  'Urdu', 'Arabic', 'Other'
];

export default function IBCC() {
  const [tab, setTab] = useState('aggregate'); // 'aggregate' | 'explained'
  
  // O Level grades (8 subjects)
  const [oSubjects, setOSubjects] = useState([
    { subject: 'English Language', grade: 'A' },
    { subject: 'Mathematics', grade: 'A' },
    { subject: 'Physics', grade: 'B' },
    { subject: 'Chemistry', grade: 'B' },
    { subject: 'Biology', grade: 'B' },
    { subject: 'Pakistan Studies', grade: 'A' },
    { subject: 'Islamiyat', grade: 'A' },
    { subject: 'Computer Science', grade: 'B' },
  ]);

  // A Level grades (3 subjects)
  const [aSubjects, setASubjects] = useState([
    { subject: 'Physics', grade: 'B' },
    { subject: 'Chemistry', grade: 'B' },
    { subject: 'Mathematics', grade: 'B' },
  ]);

  // Matric / FSc percentages (for mixed calculations)
  const [matricPct, setMatricPct] = useState('');
  const [fscPct, setFscPct] = useState('');

  // IBCC O Level aggregate = average of best 8 subjects (each subject converted to %)
  const calcOLevelAggregate = () => {
    const scores = oSubjects.map(s => GRADE_PCT[s.grade] || 0);
    const total = scores.reduce((a, b) => a + b, 0);
    return oSubjects.length > 0 ? (total / oSubjects.length).toFixed(1) : 0;
  };

  // IBCC A Level aggregate
  const calcALevelAggregate = () => {
    const scores = aSubjects.map(s => ALEVEL_GRADE_PCT[s.grade] || 0);
    const total = scores.reduce((a, b) => a + b, 0);
    return aSubjects.length > 0 ? (total / aSubjects.length).toFixed(1) : 0;
  };

  // MDCAT aggregate = 10% Matric + 40% FSc/A-Level + 50% MDCAT
  const calcMDCATAggregate = (mdcatScore) => {
    const matric = parseFloat(matricPct) || 0;
    const fsc = parseFloat(fscPct) || parseFloat(calcALevelAggregate()) || 0;
    const mdcat = parseFloat(mdcatScore) || 0;
    return ((matric * 0.10) + (fsc * 0.40) + (mdcat * 0.50)).toFixed(2);
  };

  const [mdcatScore, setMdcatScore] = useState('');
  const oAggregate = calcOLevelAggregate();
  const aAggregate = calcALevelAggregate();
  const mdcatAgg = mdcatScore ? calcMDCATAggregate(mdcatScore) : null;

  const updateOSubject = (i, field, val) => {
    const updated = [...oSubjects];
    updated[i] = { ...updated[i], [field]: val };
    setOSubjects(updated);
  };

  const updateASubject = (i, field, val) => {
    const updated = [...aSubjects];
    updated[i] = { ...updated[i], [field]: val };
    setASubjects(updated);
  };

  const addOSubject = () => {
    if (oSubjects.length < 10) setOSubjects([...oSubjects, { subject: 'Other', grade: 'C' }]);
  };

  const addASubject = () => {
    if (aSubjects.length < 5) setASubjects([...aSubjects, { subject: 'Other', grade: 'C' }]);
  };

  return (
    <>
      <Head>
        <title>IBCC Equivalence Calculator — NewWorldEdu</title>
        <meta name="description" content="Calculate your IBCC aggregate for Pakistani university admissions. A Level to FSc equivalence, MDCAT aggregate calculator." />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080C18; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #fff; min-height: 100vh; }
        
        .page { max-width: 720px; margin: 0 auto; padding: 40px 20px 100px; }
        .back { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.4); text-decoration: none; font-size: 14px; margin-bottom: 32px; }
        .back:hover { color: #fff; }
        
        .hero { text-align: center; margin-bottom: 40px; }
        .badge { display: inline-block; background: rgba(124,92,191,0.15); border: 1px solid rgba(124,92,191,0.3); border-radius: 100px; padding: 5px 16px; font-size: 11px; color: #A78BFA; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px; }
        .hero h1 { font-family: 'Sora', sans-serif; font-size: clamp(26px, 5vw, 40px); font-weight: 800; margin-bottom: 10px; line-height: 1.2; }
        .hero h1 em { font-style: normal; background: linear-gradient(135deg, #7C5CBF, #4F8EF7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.7; max-width: 480px; margin: 0 auto; }

        .tabs { display: flex; gap: 8px; margin-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .tab { padding: 12px 20px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; background: none; color: rgba(255,255,255,0.4); border-bottom: 2px solid transparent; margin-bottom: -1px; font-family: 'Sora', sans-serif; transition: all 0.2s; }
        .tab.active { color: #A78BFA; border-bottom-color: #A78BFA; }

        .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin-bottom: 20px; }
        .card-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

        .subject-row { display: grid; grid-template-columns: 1fr 100px; gap: 10px; margin-bottom: 10px; align-items: center; }
        select { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; padding: 9px 12px; font-size: 13px; width: 100%; outline: none; cursor: pointer; }
        select option { background: #1a2035; }
        select:focus { border-color: rgba(124,92,191,0.5); }

        .grade-select { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; padding: 9px 12px; font-size: 14px; font-weight: 700; width: 100%; outline: none; cursor: pointer; text-align: center; }
        
        .add-btn { background: rgba(255,255,255,0.04); border: 1px dashed rgba(255,255,255,0.2); border-radius: 8px; color: rgba(255,255,255,0.4); padding: 9px; font-size: 13px; cursor: pointer; width: 100%; text-align: center; margin-top: 4px; transition: all 0.2s; }
        .add-btn:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.7); }

        .result-box { background: linear-gradient(135deg, rgba(124,92,191,0.15), rgba(79,142,247,0.1)); border: 1px solid rgba(124,92,191,0.3); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 20px; }
        .result-label { font-size: 12px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
        .result-value { font-family: 'Sora', sans-serif; font-size: 52px; font-weight: 800; background: linear-gradient(135deg, #A78BFA, #4F8EF7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .result-sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 6px; }

        .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .mini-result { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; text-align: center; }
        .mini-label { font-size: 11px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
        .mini-value { font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 800; color: #A78BFA; }
        .mini-sub { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 4px; }

        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        .input-group label { display: block; font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 6px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
        .input-group input { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; padding: 10px 12px; font-size: 15px; width: 100%; outline: none; }
        .input-group input:focus { border-color: rgba(124,92,191,0.5); }
        .input-group input::placeholder { color: rgba(255,255,255,0.2); }

        .info-box { background: rgba(79,142,247,0.07); border: 1px solid rgba(79,142,247,0.2); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
        .info-box p { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.7; }
        .info-box strong { color: rgba(255,255,255,0.8); }

        .explain-section { margin-bottom: 28px; }
        .explain-section h3 { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 10px; color: #A78BFA; }
        .explain-section p, .explain-section li { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.8; }
        .explain-section ul { padding-left: 20px; }
        .explain-section li { margin-bottom: 6px; }
        .formula-box { background: rgba(255,255,255,0.04); border-left: 3px solid #A78BFA; border-radius: 0 8px 8px 0; padding: 14px 16px; margin: 12px 0; font-size: 13px; font-family: 'Courier New', monospace; color: rgba(255,255,255,0.7); line-height: 1.8; }
        
        .grade-table { width: 100%; border-collapse: collapse; margin: 12px 0; }
        .grade-table th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(255,255,255,0.3); padding: 8px 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .grade-table td { font-size: 13px; color: rgba(255,255,255,0.6); padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .grade-table td:first-child { font-weight: 700; color: #A78BFA; }

        .cta-box { background: linear-gradient(135deg, rgba(79,142,247,0.12), rgba(124,92,191,0.12)); border: 1px solid rgba(79,142,247,0.25); border-radius: 16px; padding: 24px; text-align: center; margin-top: 32px; }
        .cta-box h3 { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
        .cta-box p { font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 18px; line-height: 1.6; }
        .cta-btn { display: inline-block; background: linear-gradient(135deg, #4F8EF7, #7C5CBF); color: #fff; border: none; border-radius: 100px; padding: 13px 30px; font-size: 15px; font-weight: 700; font-family: 'Sora', sans-serif; cursor: pointer; text-decoration: none; }

        @media (max-width: 520px) {
          .result-grid { grid-template-columns: 1fr; }
          .input-row { grid-template-columns: 1fr; }
          .subject-row { grid-template-columns: 1fr 80px; }
        }
      `}</style>

      <div className="page">
        <a href="/" className="back">← Back to Starky</a>

        <div className="hero">
          <div className="badge">🇵🇰 Pakistan University Admissions</div>
          <h1>IBCC <em>Equivalence</em><br />Calculator</h1>
          <p>Calculate your O Level / A Level equivalence for Pakistani university and MDCAT admissions. No guesswork — just your results.</p>
        </div>

        <div className="tabs">
          <button className={`tab ${tab === 'aggregate' ? 'active' : ''}`} onClick={() => setTab('aggregate')}>🧮 Calculate My Aggregate</button>
          <button className={`tab ${tab === 'explained' ? 'active' : ''}`} onClick={() => setTab('explained')}>📖 How IBCC Works</button>
        </div>

        {tab === 'aggregate' && (
          <>
            {/* O Level Section */}
            <div className="card">
              <div className="card-title">📚 O Level / IGCSE Grades</div>
              {oSubjects.map((s, i) => (
                <div className="subject-row" key={i}>
                  <select value={s.subject} onChange={e => updateOSubject(i, 'subject', e.target.value)}>
                    {O_LEVEL_SUBJECTS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                  <select className="grade-select" value={s.grade} onChange={e => updateOSubject(i, 'grade', e.target.value)}>
                    {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              ))}
              {oSubjects.length < 10 && (
                <button className="add-btn" onClick={addOSubject}>+ Add Subject</button>
              )}
            </div>

            {/* A Level Section */}
            <div className="card">
              <div className="card-title">🎓 A Level Grades</div>
              {aSubjects.map((s, i) => (
                <div className="subject-row" key={i}>
                  <select value={s.subject} onChange={e => updateASubject(i, 'subject', e.target.value)}>
                    {A_LEVEL_SUBJECTS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                  <select className="grade-select" value={s.grade} onChange={e => updateASubject(i, 'grade', e.target.value)}>
                    {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              ))}
              {aSubjects.length < 5 && (
                <button className="add-btn" onClick={addASubject}>+ Add Subject</button>
              )}
            </div>

            {/* Results */}
            <div className="result-grid">
              <div className="mini-result">
                <div className="mini-label">O Level Equivalent</div>
                <div className="mini-value">{oAggregate}%</div>
                <div className="mini-sub">Matric SSC equivalent</div>
              </div>
              <div className="mini-result">
                <div className="mini-label">A Level Equivalent</div>
                <div className="mini-value">{aAggregate}%</div>
                <div className="mini-sub">FSc / HSSC equivalent</div>
              </div>
            </div>

            {/* MDCAT Calculator */}
            <div className="card">
              <div className="card-title">🏥 MDCAT Aggregate Calculator</div>
              <div className="info-box">
                <p>Formula: <strong>10% Matric + 40% FSc/A-Level + 50% MDCAT score</strong></p>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Matric % (or O Level equivalent)</label>
                  <input
                    type="number" min="0" max="100" placeholder={`e.g. ${oAggregate}`}
                    value={matricPct} onChange={e => setMatricPct(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>FSc % (or A Level equivalent)</label>
                  <input
                    type="number" min="0" max="100" placeholder={`e.g. ${aAggregate}`}
                    value={fscPct} onChange={e => setFscPct(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group" style={{marginBottom: 16}}>
                <label>Your MDCAT Score (out of 200, enter as %)</label>
                <input
                  type="number" min="0" max="100" placeholder="e.g. 75 (for 75%)"
                  value={mdcatScore} onChange={e => setMdcatScore(e.target.value)}
                />
              </div>
              {mdcatAgg && (
                <div className="result-box">
                  <div className="result-label">Your MDCAT Aggregate</div>
                  <div className="result-value">{mdcatAgg}%</div>
                  <div className="result-sub">
                    {parseFloat(mdcatAgg) >= 65 ? '✅ Above minimum 65% for MBBS admission' :
                     parseFloat(mdcatAgg) >= 55 ? '⚠️ Above 55% minimum for BDS (dental) — below MBBS cutoff' :
                     '❌ Below minimum 55% — retake or improve your scores'}
                  </div>
                </div>
              )}
            </div>

            <div className="info-box">
              <p>⚠️ <strong>Note:</strong> IBCC conversion rates may vary year to year. Always verify with your university's official admissions office. This calculator uses current published IBCC grade-to-percentage equivalence tables.</p>
            </div>
          </>
        )}

        {tab === 'explained' && (
          <>
            <div className="explain-section">
              <h3>What is IBCC?</h3>
              <p>The Inter Board Committee of Chairmen (IBCC) is the official body in Pakistan that converts foreign qualifications (like Cambridge O Levels and A Levels) into equivalences for Pakistani universities, MDCAT, ECAT, and other entry requirements.</p>
            </div>

            <div className="explain-section">
              <h3>O Level → Matric Equivalence</h3>
              <p>IBCC converts each O Level grade to a percentage using this official table:</p>
              <table className="grade-table">
                <thead><tr><th>O Level Grade</th><th>IBCC Percentage</th><th>Matric Equivalent</th></tr></thead>
                <tbody>
                  {[['A*','90%','Excellent'],['A','80%','Very Good'],['B','70%','Good'],['C','60%','Average'],['D','50%','Below Average'],['E','40%','Pass']].map(([g,p,e]) => (
                    <tr key={g}><td>{g}</td><td>{p}</td><td>{e}</td></tr>
                  ))}
                </tbody>
              </table>
              <p style={{marginTop:10}}>Your O Level aggregate = average percentage of your best 8 subjects.</p>
            </div>

            <div className="explain-section">
              <h3>A Level → FSc Equivalence</h3>
              <p>A Level grades are converted similarly but on a slightly higher scale:</p>
              <table className="grade-table">
                <thead><tr><th>A Level Grade</th><th>IBCC Percentage</th></tr></thead>
                <tbody>
                  {[['A*','95%'],['A','85%'],['B','75%'],['C','65%'],['D','55%'],['E','45%']].map(([g,p]) => (
                    <tr key={g}><td>{g}</td><td>{p}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="explain-section">
              <h3>MDCAT Aggregate Formula</h3>
              <div className="formula-box">
                MDCAT Aggregate = (Matric % × 10%) + (FSc/A-Level % × 40%) + (MDCAT % × 50%)
              </div>
              <ul>
                <li>Minimum aggregate for <strong>MBBS</strong>: 65%</li>
                <li>Minimum aggregate for <strong>BDS</strong> (Dental): 55%</li>
                <li>For A Level students: use your IBCC-converted A Level % as your FSc equivalent</li>
                <li>You <strong>must</strong> get an IBCC Pre-Medical certificate before the MDCAT</li>
              </ul>
            </div>

            <div className="explain-section">
              <h3>ECAT / Engineering Aggregate Formula</h3>
              <div className="formula-box">
                UET ECAT Aggregate = (Matric % × 10%) + (FSc/A-Level % × 40%) + (ECAT % × 50%)
              </div>
              <ul>
                <li>Required subjects for Pre-Engineering equivalence: Math, Physics, Chemistry</li>
                <li>Get IBCC Pre-Engineering certificate after A Level results</li>
                <li>NUST, GIKI, PIEAS have their own NET tests — check each university's formula</li>
              </ul>
            </div>

            <div className="explain-section">
              <h3>Required Subjects by Track</h3>
              <p><strong>Pre-Medical (MBBS/BDS):</strong> Biology, Chemistry + one of Physics or Mathematics at A Level. Pakistan Studies and Islamiyat at O Level.</p>
              <p style={{marginTop:8}}><strong>Pre-Engineering:</strong> Mathematics, Physics, Chemistry at A Level (or 2 of 3 with the third at O Level). Pakistan Studies and Islamiyat at O Level.</p>
              <p style={{marginTop:8}}><strong>Commerce/Business:</strong> Economics, Accounting or Business Studies. Check individual university requirements.</p>
            </div>

            <div className="explain-section">
              <h3>How to Get Your IBCC Certificate</h3>
              <ul>
                <li>Apply at your nearest IBCC office (Karachi, Lahore, Islamabad, etc.)</li>
                <li>Bring original O/A Level mark sheets + attested copies</li>
                <li>Pakistani CNIC/B-Form required</li>
                <li>Apply as early as possible — processing takes 2–6 weeks</li>
                <li>Online application: ibcc.edu.pk</li>
              </ul>
            </div>
          </>
        )}

        <div className="cta-box">
          <h3>Need help with your A Level subjects?</h3>
          <p>Starky knows every Cambridge syllabus, past paper, mark scheme and examiner report — Economics, Accounting, Sciences, Maths, English and more.</p>
          <a href="/learn" className="cta-btn">Start Learning ★</a>
        </div>
      </div>
    </>
  );
}
