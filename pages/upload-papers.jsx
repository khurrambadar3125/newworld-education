/**
 * pages/upload-papers.jsx — Past Paper Upload (Fully Automatic)
 * ─────────────────────────────────────────────────────────────────
 * Admin-only. Upload Cambridge PDFs → auto-detect QP vs MS, subject,
 * level, paper, session → extract questions → save verified ones.
 * One button. Zero choices.
 */

import { useState, useRef } from 'react';
import Head from 'next/head';

export default function UploadPapersPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);

  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState(''); // idle, extracting, saving, done, error
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);
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
    if (pdfs.length === 0) { setError('Please upload PDF files'); return; }
    setFiles(pdfs);
    setError('');
    setResult(null);
  };

  const handleUpload = async () => {
    if (files.length < 2) { setError('Upload both the question paper and mark scheme PDFs'); return; }

    setStatus('extracting');
    setProgress('Reading PDFs and extracting questions...');
    setError('');
    setResult(null);

    try {
      // Convert files to base64
      const fileData = await Promise.all(files.map(async (f) => ({
        name: f.name,
        base64: await fileToBase64(f),
      })));

      // Step 1: Extract
      const extractRes = await fetch('/api/question-bank/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ files: fileData }),
      });
      const extractData = await extractRes.json();
      if (!extractRes.ok) { throw new Error(extractData.error || 'Extraction failed'); }

      const verified = (extractData.questions || []).filter(q => q.verified);
      if (verified.length === 0) {
        setStatus('done');
        setResult({ saved: 0, meta: extractData.meta, message: 'No verified questions found in these PDFs' });
        return;
      }

      // Step 2: Auto-save all verified questions
      setStatus('saving');
      setProgress(`Saving ${verified.length} verified questions...`);

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
      if (!saveRes.ok) { throw new Error(saveData.error || 'Save failed'); }

      setStatus('done');
      setResult({ ...saveData, meta: extractData.meta });

    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  const reset = () => {
    setFiles([]);
    setStatus('');
    setProgress('');
    setResult(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const s = {
    page: { minHeight:'100vh', background:'#080C18', color:'#fff', fontFamily:"'Inter',sans-serif", padding:'20px' },
    container: { maxWidth:600, margin:'0 auto' },
    card: { background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:14, padding:24, marginBottom:16 },
    input: { width:'100%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:8, color:'#fff', padding:'10px 14px', fontSize:14, outline:'none', boxSizing:'border-box' },
    btn: { background:'linear-gradient(135deg,#4F8EF7,#6366F1)', border:'none', borderRadius:10, padding:'14px 24px', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%' },
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

  const isProcessing = status === 'extracting' || status === 'saving';

  return (
    <>
      <Head><title>Upload Past Papers | NewWorld Admin</title></Head>
      <div style={s.page}>
        <div style={s.container}>
          <h1 style={{ fontSize:24, marginBottom:4 }}>Past Paper Upload</h1>
          <p style={{ color:'rgba(255,255,255,.4)', fontSize:14, marginBottom:24 }}>
            Drop your Cambridge PDFs — everything else is automatic
          </p>

          {/* ── Drop Zone ─────────────────────────── */}
          {status !== 'done' && (
            <div style={s.card}>
              <div
                onClick={() => !isProcessing && inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                style={{
                  border: `2px dashed ${dragOver ? '#4F8EF7' : files.length >= 2 ? '#4ADE80' : 'rgba(255,255,255,.15)'}`,
                  borderRadius: 12,
                  padding: '40px 20px',
                  textAlign: 'center',
                  cursor: isProcessing ? 'default' : 'pointer',
                  transition: 'border-color .2s',
                  background: dragOver ? 'rgba(79,142,247,.05)' : 'transparent',
                  marginBottom: 16,
                }}
              >
                <input ref={inputRef} type="file" accept=".pdf" multiple
                  onChange={e => handleFiles(e.target.files)}
                  style={{ display:'none' }} />

                {files.length === 0 ? (
                  <>
                    <div style={{ fontSize:32, marginBottom:8 }}>+</div>
                    <div style={{ fontSize:15, color:'rgba(255,255,255,.5)' }}>
                      Drop question paper + mark scheme PDFs here
                    </div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,.25)', marginTop:8 }}>
                      e.g. 0625_w24_qp_12.pdf and 0625_w24_ms_12.pdf
                    </div>
                  </>
                ) : (
                  <div>
                    {files.map((f, i) => (
                      <div key={i} style={{ fontSize:14, color:'#4ADE80', marginBottom:4 }}>
                        {f.name}
                      </div>
                    ))}
                    {files.length < 2 && (
                      <div style={{ fontSize:12, color:'#FCD34D', marginTop:8 }}>
                        Need at least 2 PDFs (question paper + mark scheme)
                      </div>
                    )}
                  </div>
                )}
              </div>

              {error && <p style={{ color:'#F87171', fontSize:13, marginBottom:12 }}>{error}</p>}

              {isProcessing ? (
                <div style={{ textAlign:'center', padding:'12px 0' }}>
                  <div style={{ fontSize:14, color:'#4F8EF7', fontWeight:600 }}>{progress}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.3)', marginTop:6 }}>This takes ~30 seconds</div>
                </div>
              ) : (
                <button onClick={handleUpload} disabled={files.length < 2}
                  style={{ ...s.btn, opacity: files.length < 2 ? 0.4 : 1 }}>
                  Upload & Extract
                </button>
              )}
            </div>
          )}

          {/* ── Result ─────────────────────────── */}
          {status === 'done' && result && (
            <div style={{ ...s.card, background: result.saved > 0 ? 'rgba(74,222,128,.06)' : 'rgba(252,211,77,.06)', borderColor: result.saved > 0 ? 'rgba(74,222,128,.15)' : 'rgba(252,211,77,.15)' }}>
              {result.saved > 0 ? (
                <>
                  <div style={{ fontSize:36, fontWeight:800, color:'#4ADE80', marginBottom:4 }}>
                    {result.saved} questions saved
                  </div>
                  <div style={{ fontSize:14, color:'rgba(255,255,255,.5)', marginBottom:16 }}>
                    {result.meta?.subject} | {result.meta?.level} | Paper {result.meta?.paper} | Session {result.meta?.session}
                  </div>
                  {result.meta?.qpFile && (
                    <div style={{ fontSize:12, color:'rgba(255,255,255,.25)', marginBottom:12 }}>
                      QP: {result.meta.qpFile} | MS: {result.meta.msFile}
                    </div>
                  )}
                  {(result.errors > 0 || result.skipped > 0) && (
                    <div style={{ fontSize:12, color:'rgba(255,255,255,.3)' }}>
                      {result.skipped > 0 && `${result.skipped} unverified skipped`}
                      {result.errors > 0 && ` | ${result.errors} errors`}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize:16, color:'#FCD34D' }}>
                  {result.message || 'No questions could be verified from these PDFs'}
                </div>
              )}

              <button onClick={reset} style={{ ...s.btn, marginTop:20 }}>
                Upload Another Paper
              </button>
            </div>
          )}

          {status === 'error' && (
            <div style={{ ...s.card, borderColor:'rgba(248,113,113,.2)' }}>
              <div style={{ color:'#F87171', fontSize:14, marginBottom:12 }}>{error}</div>
              <button onClick={reset} style={s.btn}>Try Again</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
