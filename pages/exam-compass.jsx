/**
 * pages/exam-compass.jsx — Exam Compass (Free Feature)
 * ─────────────────────────────────────────────────────────────────
 * Forecasts likely Cambridge exam topics based on past paper patterns.
 * Free for all users — no login required.
 * Replaces PapaCambridge's $25-240 predicted papers.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import LegalFooter from '../components/LegalFooter';
const LEVEL_OPTIONS = ['O Level', 'A Level'];

const SCORE_COLORS = {
  'Very Likely': { bg: 'rgba(239,68,68,.12)', border: 'rgba(239,68,68,.4)', text: '#EF4444', bar: '#EF4444' },
  'Likely': { bg: 'rgba(249,115,22,.12)', border: 'rgba(249,115,22,.4)', text: '#F97316', bar: '#F97316' },
  'Possible': { bg: 'rgba(234,179,8,.1)', border: 'rgba(234,179,8,.3)', text: '#EAB308', bar: '#EAB308' },
  'Less Likely': { bg: 'rgba(255,255,255,.04)', border: 'rgba(255,255,255,.1)', text: 'rgba(255,255,255,.4)', bar: 'rgba(255,255,255,.2)' },
};

const SESSION_NAMES = {
  m: 'Feb/March', s: 'May/June', w: 'Oct/November',
};

function formatSession(s) {
  if (!s) return '—';
  const prefix = s.charAt(0);
  const yr = s.slice(1);
  return `${SESSION_NAMES[prefix] || prefix} 20${yr}`;
}

export default function TopicRadar() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('O Level');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nextSession, setNextSession] = useState('');

  // Load available subjects on mount
  useEffect(() => {
    fetch('/api/exam-compass?action=subjects')
      .then(r => r.json())
      .then(data => {
        setSubjects(data.subjects || []);
        setNextSession(data.nextSession || '');
      })
      .catch(() => {});
  }, []);

  const filteredSubjects = subjects.filter(s => s.level === selectedLevel);

  const loadForecast = async (subject, level) => {
    setLoading(true);
    setForecast(null);
    try {
      const res = await fetch(`/api/exam-compass?subject=${encodeURIComponent(subject)}&level=${encodeURIComponent(level)}`);
      const data = await res.json();
      setForecast(data);
    } catch {
      setForecast({ error: 'Failed to load forecast' });
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Exam Compass — Free Cambridge Exam Topic Forecast | NewWorld Education</title>
        <meta name="description" content="Free topic forecast for Cambridge O Level and A Level exams. See which topics are most likely to appear in your next exam based on past paper pattern analysis." />
      </Head>

      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#4F8EF7', letterSpacing: 2, marginBottom: 8 }}>FREE TOOL</div>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 12px', background: 'linear-gradient(135deg, #4F8EF7, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Exam Compass
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.6)', maxWidth: 500, margin: '0 auto' }}>
              Data-driven topic forecast for Cambridge exams. See which topics are most likely to appear next — based on analysis of {subjects.reduce((a, s) => a + s.questions, 0).toLocaleString()}+ past paper questions.
            </p>
          </div>

          {/* Level selector */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
            {LEVEL_OPTIONS.map(l => (
              <button key={l} onClick={() => { setSelectedLevel(l); setSelectedSubject(''); setForecast(null); }}
                style={{
                  padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: selectedLevel === l ? '#4F8EF7' : 'rgba(255,255,255,.06)',
                  color: selectedLevel === l ? '#fff' : 'rgba(255,255,255,.5)',
                  fontWeight: 700, fontSize: 14,
                }}>
                {l}
              </button>
            ))}
          </div>

          {/* Subject selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
            {filteredSubjects.map(s => (
              <button key={s.subject} onClick={() => { setSelectedSubject(s.subject); loadForecast(s.subject, s.level); }}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: selectedSubject === s.subject ? 'rgba(79,142,247,.2)' : 'rgba(255,255,255,.04)',
                  color: selectedSubject === s.subject ? '#4F8EF7' : 'rgba(255,255,255,.6)',
                  fontWeight: 600, fontSize: 13,
                }}>
                {s.subject} <span style={{ fontSize: 11, opacity: .5 }}>({s.sessions}s)</span>
              </button>
            ))}
            {filteredSubjects.length === 0 && (
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 14 }}>
                {subjects.length === 0 ? 'Loading subjects...' : 'No subjects with enough data for this level yet.'}
              </p>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,.5)' }}>
              Analyzing past paper patterns...
            </div>
          )}

          {/* Forecast results */}
          {forecast && !forecast.error && (
            <div>
              {/* Stats bar */}
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                  { label: 'Target', value: formatSession(forecast.targetSession) },
                  { label: 'Sessions analyzed', value: forecast.sessionsAnalyzed },
                  { label: 'Range', value: forecast.sessionRange?.replace(' — ', ' → ') },
                  { label: 'Questions', value: forecast.dataPoints?.toLocaleString() },
                  { label: 'Topics', value: forecast.topicsTracked },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#4F8EF7' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Forecast list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {forecast.forecast?.map((item, i) => {
                  const colors = SCORE_COLORS[item.label] || SCORE_COLORS['Less Likely'];
                  return (
                    <div key={item.topic} style={{
                      background: colors.bg, border: `1px solid ${colors.border}`,
                      borderRadius: 12, padding: '14px 18px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.3)', minWidth: 24 }}>#{i + 1}</span>
                          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{item.topic}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>{item.label}</span>
                          <span style={{ fontSize: 20, fontWeight: 800, color: colors.text }}>{item.score}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, marginBottom: 6 }}>
                        <div style={{ height: '100%', width: `${item.score}%`, background: colors.bar, borderRadius: 2, transition: 'width .5s' }} />
                      </div>

                      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'rgba(255,255,255,.4)' }}>
                        <span>Last: {formatSession(item.lastSeen)}</span>
                        <span>Gap: {item.gapSessions} sessions</span>
                        <span>Seen in {item.appearances}/{forecast.sessionsAnalyzed} sessions ({item.frequency}%)</span>
                        {item.confidence && <span style={{ color: item.confidence === 'high' ? '#4ADE80' : item.confidence === 'medium' ? '#EAB308' : 'rgba(255,255,255,.3)' }}>
                          {item.confidence} confidence
                        </span>}
                      </div>

                      {/* Practice link */}
                      <a href={`/drill?subject=${encodeURIComponent(forecast.subject)}&level=${encodeURIComponent(forecast.level)}&topic=${encodeURIComponent(item.topic)}`}
                        style={{ display: 'inline-block', marginTop: 8, fontSize: 12, fontWeight: 600, color: '#4F8EF7', textDecoration: 'none' }}>
                        Practice this topic →
                      </a>
                    </div>
                  );
                })}
              </div>

              {/* Disclaimer */}
              <div style={{ marginTop: 24, padding: 16, background: 'rgba(255,255,255,.03)', borderRadius: 10, fontSize: 12, color: 'rgba(255,255,255,.35)', textAlign: 'center' }}>
                Exam Compass analyzes past paper patterns to identify study priorities. It is not a guarantee of what will appear on your exam. Always prepare all topics thoroughly. Data based on {forecast.dataPoints?.toLocaleString()} verified past paper questions.
              </div>
            </div>
          )}

          {/* Error state */}
          {forecast?.error && (
            <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,.4)' }}>
              {forecast.error}
            </div>
          )}

          {/* No selection state */}
          {!selectedSubject && !loading && (
            <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,.3)', fontSize: 14 }}>
              Select a subject above to see the topic forecast
            </div>
          )}
        </div>
      </div>
      <LegalFooter />
    </>
  );
}
