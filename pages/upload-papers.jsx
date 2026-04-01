/**
 * pages/upload-papers.jsx — Past Paper Upload & Extraction Tool
 * ─────────────────────────────────────────────────────────────────
 * Admin-only page for uploading Cambridge past paper PDFs.
 * Flow: Upload QP + MS → Extract questions → Review → Approve → Save to bank
 */

import { useState } from 'react';
import Head from 'next/head';

const SUBJECTS = [
  'Accounting','Additional Mathematics','Biology','Business Studies','Chemistry',
  'Commerce','Computer Science','Economics','English Language','Further Mathematics',
  'Geography','History','Islamiyat','Law','Literature in English','Mathematics',
  'Pakistan Studies','Physics','Psychology','Sociology','Statistics','Urdu',
];

export default function UploadPapersPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);

  // Upload state
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('O Level');
  const [paper, setPaper] = useState('');
  const [session, setSession] = useState('');
  const [qpFile, setQpFile] = useState(null);
  const [msFile, setMsFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');

  // Review state
  const [questions, setQuestions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleExtract = async () => {
    if (!qpFile || !msFile || !subject) {
      setError('Please select subject and upload both files');
      return;
    }
    setExtracting(true); setError(''); setQuestions([]); setMeta(null); setSaveResult(null);

    try {
      const [qpBase64, msBase64] = await Promise.all([
        fileToBase64(qpFile),
        fileToBase64(msFile),
      ]);

      const res = await fetch('/api/question-bank/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ qpBase64, msBase64, subject, level, paper, session }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Extraction failed'); return; }

      setQuestions(data.questions || []);
      setMeta(data.meta);
    } catch (err) {
      setError('Extraction failed: ' + err.message);
    } finally {
      setExtracting(false);
    }
  };

  const toggleVerified = (index) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, verified: !q.verified } : q));
  };

  const toggleAll = (value) => {
    setQuestions(prev => prev.map(q => ({ ...q, verified: value })));
  };

  const handleSave = async () => {
    const toSave = questions.filter(q => q.verified);
    if (toSave.length === 0) { setError('No verified questions to save'); return; }

    setSaving(true); setError('');
    try {
      const res = await fetch('/api/question-bank/save-verified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ questions: toSave, subject, level, paper, session }),
      });
      const data = await res.json();
      setSaveResult(data);
    } catch (err) {
      setError('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const s = {
    page: { minHeight:'100vh', background:'#080C18', color:'#fff', fontFamily:"'Inter',sans-serif", padding:'20px' },
    container: { maxWidth:900, margin:'0 auto' },
    card: { background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:14, padding:20, marginBottom:16 },
    label: { fontSize:12, fontWeight:700, color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:6, display:'block' },
    input: { width:'100%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:8, color:'#fff', padding:'10px 14px', fontSize:14, outline:'none', boxSizing:'border-box' },
    select: { width:'100%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:8, color:'#fff', padding:'10px 14px', fontSize:14, outline:'none', boxSizing:'border-box' },
    btn: { background:'linear-gradient(135deg,#4F8EF7,#6366F1)', border:'none', borderRadius:10, padding:'12px 24px', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' },
    btnGhost: { background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:10, padding:'10px 20px', color:'rgba(255,255,255,.6)', fontSize:13, fontWeight:600, cursor:'pointer' },
  };

  if (!authed) {
    return (
      <div style={s.page}>
        <div style={{ ...s.container, maxWidth:400, paddingTop:100, textAlign:'center' }}>
          <h1 style={{ fontSize:24, marginBottom:20 }}>Past Paper Upload</h1>
          <p style={{ color:'rgba(255,255,255,.4)', marginBottom:20 }}>Admin access required</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setAuthed(true)}
            placeholder="Admin password" style={s.input} />
          <button onClick={() => setAuthed(true)} style={{ ...s.btn, marginTop:12, width:'100%' }}>Enter</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head><title>Upload Past Papers | NewWorld Admin</title></Head>
      <div style={s.page}>
        <div style={s.container}>
          <h1 style={{ fontSize:24, marginBottom:4 }}>Past Paper Upload</h1>
          <p style={{ color:'rgba(255,255,255,.4)', fontSize:14, marginBottom:24 }}>
            Upload QP + Mark Scheme → Extract → Review → Save verified questions
          </p>

          {/* ── Upload Section ─────────────────────────── */}
          {!questions.length && (
            <div style={s.card}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                <div>
                  <label style={s.label}>Subject</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} style={s.select}>
                    <option value="">Select subject...</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Level</label>
                  <select value={level} onChange={e => setLevel(e.target.value)} style={s.select}>
                    <option value="O Level">O Level</option>
                    <option value="A Level">A Level</option>
                  </select>
                </div>
                <div>
                  <label style={s.label}>Paper (e.g. 12, 22)</label>
                  <input value={paper} onChange={e => setPaper(e.target.value)} placeholder="e.g. 12" style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Session (e.g. w24, s24)</label>
                  <input value={session} onChange={e => setSession(e.target.value)} placeholder="e.g. w24" style={s.input} />
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                <div>
                  <label style={s.label}>Question Paper (QP) PDF</label>
                  <input type="file" accept=".pdf" onChange={e => setQpFile(e.target.files?.[0])}
                    style={{ ...s.input, padding:'8px 10px' }} />
                  {qpFile && <div style={{ fontSize:12, color:'#4ADE80', marginTop:4 }}>{qpFile.name}</div>}
                </div>
                <div>
                  <label style={s.label}>Mark Scheme (MS) PDF</label>
                  <input type="file" accept=".pdf" onChange={e => setMsFile(e.target.files?.[0])}
                    style={{ ...s.input, padding:'8px 10px' }} />
                  {msFile && <div style={{ fontSize:12, color:'#4ADE80', marginTop:4 }}>{msFile.name}</div>}
                </div>
              </div>

              {error && <p style={{ color:'#F87171', fontSize:13, marginBottom:12 }}>{error}</p>}

              <button onClick={handleExtract} disabled={extracting} style={{ ...s.btn, width:'100%', opacity: extracting ? 0.6 : 1 }}>
                {extracting ? 'Extracting questions... (this takes ~30 seconds)' : 'Extract Questions'}
              </button>
            </div>
          )}

          {/* ── Review Section ─────────────────────────── */}
          {questions.length > 0 && (
            <>
              {meta && (
                <div style={{ ...s.card, display:'flex', gap:20, alignItems:'center', flexWrap:'wrap' }}>
                  <div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', fontWeight:700 }}>EXTRACTED</div>
                    <div style={{ fontSize:24, fontWeight:800, color:'#4F8EF7' }}>{meta.totalQuestions}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', fontWeight:700 }}>VERIFIED</div>
                    <div style={{ fontSize:24, fontWeight:800, color:'#4ADE80' }}>{questions.filter(q => q.verified).length}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', fontWeight:700 }}>UNVERIFIED</div>
                    <div style={{ fontSize:24, fontWeight:800, color:'#FCD34D' }}>{questions.filter(q => !q.verified).length}</div>
                  </div>
                  <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                    <button onClick={() => toggleAll(true)} style={s.btnGhost}>Approve All</button>
                    <button onClick={() => toggleAll(false)} style={s.btnGhost}>Reject All</button>
                  </div>
                </div>
              )}

              <div style={{ marginBottom:16 }}>
                {questions.map((q, i) => (
                  <div key={i} style={{
                    ...s.card,
                    borderLeft: `3px solid ${q.verified ? '#4ADE80' : '#F87171'}`,
                    opacity: q.verified ? 1 : 0.6,
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,.3)', fontWeight:700 }}>
                        Q{q.number} — {q.type?.toUpperCase()} — {q.marks} mark{q.marks > 1 ? 's' : ''} — {q.topic}
                      </div>
                      <button onClick={() => toggleVerified(i)} style={{
                        ...s.btnGhost,
                        padding:'4px 12px',
                        fontSize:11,
                        color: q.verified ? '#4ADE80' : '#F87171',
                        borderColor: q.verified ? 'rgba(74,222,128,.3)' : 'rgba(248,113,113,.3)',
                      }}>
                        {q.verified ? 'Approved' : 'Rejected'}
                      </button>
                    </div>

                    <div style={{ fontSize:14, color:'rgba(255,255,255,.85)', lineHeight:1.7, marginBottom:10 }}>
                      {q.question}
                    </div>

                    {q.options && (
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
                        {Object.entries(q.options).map(([key, val]) => (
                          <div key={key} style={{
                            padding:'6px 10px', borderRadius:6, fontSize:13,
                            background: key === q.correctAnswer ? 'rgba(74,222,128,.12)' : 'rgba(255,255,255,.04)',
                            border: `1px solid ${key === q.correctAnswer ? 'rgba(74,222,128,.3)' : 'rgba(255,255,255,.06)'}`,
                            color: key === q.correctAnswer ? '#4ADE80' : 'rgba(255,255,255,.6)',
                          }}>
                            <strong>{key}.</strong> {val}
                          </div>
                        ))}
                      </div>
                    )}

                    {q.type !== 'mcq' && q.correctAnswer && (
                      <div style={{ fontSize:12, color:'rgba(255,255,255,.5)', background:'rgba(255,255,255,.04)', borderRadius:6, padding:'8px 10px', lineHeight:1.6 }}>
                        <strong style={{ color:'rgba(255,255,255,.3)' }}>MARK SCHEME:</strong> {q.correctAnswer}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {error && <p style={{ color:'#F87171', fontSize:13, marginBottom:12 }}>{error}</p>}

              {saveResult ? (
                <div style={{ ...s.card, background:'rgba(74,222,128,.08)', borderColor:'rgba(74,222,128,.2)' }}>
                  <div style={{ fontSize:18, fontWeight:700, color:'#4ADE80', marginBottom:8 }}>
                    Saved {saveResult.saved} verified questions
                  </div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,.5)' }}>
                    {saveResult.skipped} skipped (unverified) | {saveResult.errors} errors
                  </div>
                  <button onClick={() => { setQuestions([]); setMeta(null); setSaveResult(null); setQpFile(null); setMsFile(null); }}
                    style={{ ...s.btn, marginTop:12 }}>
                    Upload Another Paper
                  </button>
                </div>
              ) : (
                <div style={{ display:'flex', gap:12 }}>
                  <button onClick={handleSave} disabled={saving} style={{ ...s.btn, flex:1, opacity: saving ? 0.6 : 1 }}>
                    {saving ? 'Saving...' : `Save ${questions.filter(q => q.verified).length} Verified Questions to Bank`}
                  </button>
                  <button onClick={() => { setQuestions([]); setMeta(null); }} style={s.btnGhost}>
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
