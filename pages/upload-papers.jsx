/**
 * pages/upload-papers.jsx — Bulk Past Paper Upload (Fully Automatic)
 * ─────────────────────────────────────────────────────────────────
 * Admin-only. Dump ALL your Cambridge PDFs → system auto-classifies,
 * pairs QP+MS, extracts questions, saves everything. Zero choices.
 */

import { useState, useRef } from 'react';
import Head from 'next/head';

// Cambridge file types: qp/in = question paper, ms = mark scheme, er/gt/ci/sp/sm/sf = skip
function classifyFile(name) {
  const n = name.toLowerCase();
  if (/_qp[_.\d]/.test(n) || /_in[_.\d]/.test(n)) return 'qp';
  if (/_ms[_.\d]/.test(n)) return 'ms';
  if (/_er[_.\d]/.test(n) || /_gt[_.\d]/.test(n) || /_ci[_.\d]/.test(n) ||
      /_sp[_.\d]/.test(n) || /_sm[_.\d]/.test(n) || /_sf[_.\d]/.test(n)) return 'skip';
  return 'unknown';
}

// Group files into QP+MS pairs by subject code + session + variant
function pairFiles(files) {
  const groups = {};
  const skipped = [];

  for (const f of files) {
    const type = classifyFile(f.name);
    if (type === 'skip') { skipped.push(f.name); continue; }

    // Extract grouping key: code_session_variant e.g. "0625_w24_12"
    const match = f.name.match(/(\d{4})_([smw]\d{2})_(?:qp|ms|in)_?(\d{0,2})/i);
    const key = match ? `${match[1]}_${match[2]}_${match[3] || '0'}` : f.name;

    if (!groups[key]) groups[key] = { qp: null, ms: null, key };
    if (type === 'qp' || type === 'unknown') groups[key].qp = groups[key].qp || f;
    if (type === 'ms') groups[key].ms = f;
  }

  const pairs = Object.values(groups).filter(g => g.qp && g.ms);
  const unpaired = Object.values(groups).filter(g => !g.qp || !g.ms);
  return { pairs, unpaired, skipped };
}

export default function UploadPapersPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);

  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [currentPair, setCurrentPair] = useState('');
  const [results, setResults] = useState([]); // { pair, saved, error }
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleFiles = (fileList) => {
    const pdfs = Array.from(fileList).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (pdfs.length === 0) return;
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      return [...prev, ...pdfs.filter(f => !existing.has(f.name))];
    });
    setError('');
  };

  const removeFile = (name) => {
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  const { pairs, unpaired, skipped } = pairFiles(files);

  const handleUpload = async () => {
    if (pairs.length === 0) { setError('No QP + MS pairs found. Need both question paper and mark scheme.'); return; }

    setProcessing(true);
    setError('');
    setResults([]);

    for (const pair of pairs) {
      const label = `${pair.qp.name} + ${pair.ms.name}`;
      setCurrentPair(label);

      try {
        const [qpB64, msB64] = await Promise.all([fileToBase64(pair.qp), fileToBase64(pair.ms)]);

        // Extract
        const extractRes = await fetch('/api/question-bank/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
          body: JSON.stringify({ files: [{ name: pair.qp.name, base64: qpB64 }, { name: pair.ms.name, base64: msB64 }] }),
        });
        const extractData = await extractRes.json();
        if (!extractRes.ok) throw new Error(extractData.error || 'Extraction failed');

        const verified = (extractData.questions || []).filter(q => q.verified);
        if (verified.length === 0) {
          setResults(prev => [...prev, { pair: label, saved: 0, meta: extractData.meta, error: null }]);
          continue;
        }

        // Save
        const saveRes = await fetch('/api/question-bank/save-verified', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
          body: JSON.stringify({
            questions: verified,
            subject: extractData.meta.subject,
            level: extractData.meta.level,
            paper: extractData.meta.paper,
            session: extractData.meta.session,
          }),
        });
        const saveData = await saveRes.json();
        setResults(prev => [...prev, { pair: label, saved: saveData.saved, meta: extractData.meta, error: null }]);
      } catch (err) {
        setResults(prev => [...prev, { pair: label, saved: 0, meta: null, error: err.message }]);
      }
    }

    setProcessing(false);
    setCurrentPair('');
  };

  const reset = () => {
    setFiles([]);
    setResults([]);
    setError('');
    setCurrentPair('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const s = {
    page: { minHeight:'100vh', background:'#080C18', color:'#fff', fontFamily:"'Inter',sans-serif", padding:'20px' },
    container: { maxWidth:700, margin:'0 auto' },
    card: { background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:14, padding:20, marginBottom:16 },
    input: { width:'100%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:8, color:'#fff', padding:'10px 14px', fontSize:14, outline:'none', boxSizing:'border-box' },
    btn: { background:'linear-gradient(135deg,#4F8EF7,#6366F1)', border:'none', borderRadius:10, padding:'14px 24px', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%' },
    tag: (color) => ({ display:'inline-block', fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:4, background:`${color}15`, color, marginRight:6 }),
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
          <button onClick={() => setAuthed(true)} style={{ ...s.btn, marginTop:12 }}>Enter</button>
        </div>
      </div>
    );
  }

  const totalSaved = results.reduce((sum, r) => sum + (r.saved || 0), 0);
  const done = results.length > 0 && !processing;

  return (
    <>
      <Head><title>Upload Past Papers | NewWorld Admin</title></Head>
      <div style={s.page}>
        <div style={s.container}>
          <h1 style={{ fontSize:24, marginBottom:4 }}>Past Paper Upload</h1>
          <p style={{ color:'rgba(255,255,255,.4)', fontSize:14, marginBottom:24 }}>
            Dump all your Cambridge PDFs — the system pairs and processes them
          </p>

          {/* ── Drop Zone ─────────────────────────── */}
          <div style={s.card}>
            <div
              onClick={() => !processing && inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
              style={{
                border: `2px dashed ${dragOver ? '#4F8EF7' : files.length > 0 ? '#4ADE80' : 'rgba(255,255,255,.15)'}`,
                borderRadius: 12,
                padding: files.length > 0 ? '20px' : '40px 20px',
                textAlign: 'center',
                cursor: processing ? 'default' : 'pointer',
                transition: 'border-color .2s',
                background: dragOver ? 'rgba(79,142,247,.05)' : 'transparent',
              }}
            >
              <input ref={inputRef} type="file" accept=".pdf" multiple
                onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
                style={{ display:'none' }} />

              {files.length === 0 ? (
                <>
                  <div style={{ fontSize:40, marginBottom:8, color:'rgba(255,255,255,.2)' }}>+</div>
                  <div style={{ fontSize:15, color:'rgba(255,255,255,.5)' }}>
                    Drop all Cambridge PDFs here
                  </div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.2)', marginTop:6 }}>
                    QPs, mark schemes, examiner reports — dump everything, we sort it out
                  </div>
                </>
              ) : (
                <div style={{ textAlign:'left' }}>
                  {files.map((f) => {
                    const type = classifyFile(f.name);
                    const colors = { qp:'#4ADE80', ms:'#4F8EF7', skip:'#6B7280', unknown:'#FCD34D' };
                    const labels = { qp:'QP', ms:'MS', skip:'SKIP', unknown:'???' };
                    return (
                      <div key={f.name} style={{ display:'flex', alignItems:'center', padding:'4px 0', fontSize:13 }}>
                        <span style={s.tag(colors[type])}>{labels[type]}</span>
                        <span style={{ color: type === 'skip' ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.7)', flex:1, textDecoration: type === 'skip' ? 'line-through' : 'none' }}>
                          {f.name}
                        </span>
                        {!processing && (
                          <span onClick={(e) => { e.stopPropagation(); removeFile(f.name); }}
                            style={{ color:'rgba(255,255,255,.2)', cursor:'pointer', padding:'0 6px', fontSize:16 }}>x</span>
                        )}
                      </div>
                    );
                  })}
                  {!processing && (
                    <div style={{ fontSize:12, color:'rgba(255,255,255,.2)', marginTop:8, textAlign:'center' }}>
                      Click to add more files
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Pair Summary ─────────────────────────── */}
          {files.length > 0 && !processing && results.length === 0 && (
            <div style={{ ...s.card, display:'flex', gap:20, alignItems:'center', flexWrap:'wrap' }}>
              <div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', fontWeight:700 }}>PAIRS FOUND</div>
                <div style={{ fontSize:28, fontWeight:800, color: pairs.length > 0 ? '#4ADE80' : '#F87171' }}>{pairs.length}</div>
              </div>
              {skipped.length > 0 && (
                <div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', fontWeight:700 }}>SKIPPING</div>
                  <div style={{ fontSize:28, fontWeight:800, color:'#6B7280' }}>{skipped.length}</div>
                </div>
              )}
              {unpaired.length > 0 && (
                <div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.3)', fontWeight:700 }}>UNPAIRED</div>
                  <div style={{ fontSize:28, fontWeight:800, color:'#FCD34D' }}>{unpaired.length}</div>
                </div>
              )}
            </div>
          )}

          {error && <p style={{ color:'#F87171', fontSize:13, marginBottom:12 }}>{error}</p>}

          {/* ── Processing ─────────────────────────── */}
          {processing && (
            <div style={{ ...s.card, textAlign:'center' }}>
              <div style={{ fontSize:14, color:'#4F8EF7', fontWeight:600 }}>
                Processing {results.length + 1} of {pairs.length}...
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.3)', marginTop:4 }}>{currentPair}</div>
              {results.length > 0 && (
                <div style={{ fontSize:12, color:'#4ADE80', marginTop:8 }}>{totalSaved} questions saved so far</div>
              )}
            </div>
          )}

          {/* ── Upload Button ─────────────────────────── */}
          {files.length > 0 && !processing && results.length === 0 && (
            <button onClick={handleUpload} disabled={pairs.length === 0}
              style={{ ...s.btn, opacity: pairs.length === 0 ? 0.4 : 1, marginBottom:16 }}>
              Process {pairs.length} Paper{pairs.length !== 1 ? 's' : ''}
            </button>
          )}

          {/* ── Results ─────────────────────────── */}
          {done && (
            <div style={s.card}>
              <div style={{ fontSize:32, fontWeight:800, color:'#4ADE80', marginBottom:8 }}>
                {totalSaved} questions saved
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.4)', marginBottom:16 }}>
                from {results.length} paper{results.length !== 1 ? 's' : ''}
              </div>

              {results.map((r, i) => (
                <div key={i} style={{ padding:'8px 0', borderTop:'1px solid rgba(255,255,255,.06)', fontSize:13 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ color:'rgba(255,255,255,.5)' }}>
                      {r.meta ? `${r.meta.subject} P${r.meta.paper} ${r.meta.session}` : r.pair}
                    </span>
                    {r.error ? (
                      <span style={{ color:'#F87171' }}>Error</span>
                    ) : (
                      <span style={{ color:'#4ADE80', fontWeight:700 }}>{r.saved} saved</span>
                    )}
                  </div>
                  {r.error && <div style={{ fontSize:11, color:'#F87171', marginTop:2 }}>{r.error}</div>}
                </div>
              ))}

              <button onClick={reset} style={{ ...s.btn, marginTop:16 }}>Upload More Papers</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
