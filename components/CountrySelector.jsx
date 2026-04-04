/**
 * components/CountrySelector.jsx
 * Country detection, UAE curriculum selector, and footer country flags.
 *
 * Extracted from pages/index.jsx so UAE changes never touch the homepage.
 * PROTECTED: This file is an addition. Nothing existing is affected.
 */

import { useState, useEffect, useCallback } from 'react';

const COUNTRIES = [
  { code: 'PK', flag: '🇵🇰', label: 'Pakistan' },
  { code: 'UAE', flag: '🇦🇪', label: 'UAE' },
];

const UAE_CURRICULA = [
  { id: 'british', flag: '🇬🇧', name: 'British (IGCSE / A Level)', desc: 'Most popular in Dubai — 37% of students', color: '#4F8EF7' },
  { id: 'american', flag: '🇺🇸', name: 'American (AP / Common Core)', desc: 'American curriculum schools', color: '#FF6B6B' },
  { id: 'ib', flag: '🌐', name: 'IB (International Baccalaureate)', desc: 'PYP / MYP / Diploma Programme', color: '#4ECDC4' },
  { id: 'cbse', flag: '🇮🇳', name: 'Indian (CBSE)', desc: 'CBSE curriculum schools', color: '#FF8E53' },
  { id: 'moe', flag: '🇦🇪', name: 'UAE Ministry (MoE)', desc: 'Government school curriculum', color: '#FFC300' },
  { id: 'pakistani', flag: '🇵🇰', name: 'Pakistani curriculum', desc: 'Pakistani curriculum schools in UAE', color: '#A8E063' },
];

/**
 * useCountry — manages country detection, localStorage, cookies, URL override.
 * Returns { userCountry, uaeCurriculum, showUaeCurriculumSelector, setShowUaeCurriculumSelector }
 */
export function useCountry() {
  const [userCountry, setUserCountry] = useState(null);
  const [detectedCountry, setDetectedCountry] = useState(null);
  const [uaeCurriculum, setUaeCurriculum] = useState(null);
  const [showUaeCurriculumSelector, setShowUaeCurriculumSelector] = useState(false);

  const selectCountry = useCallback((country) => {
    setUserCountry(country);
    try {
      localStorage.setItem('user_country', country);
      document.cookie = `newworld_country=${country};max-age=${30 * 86400};path=/;SameSite=Lax`;
      const u = JSON.parse(localStorage.getItem('nw_user') || '{}');
      if (u.email) { u.country = country; localStorage.setItem('nw_user', JSON.stringify(u)); }
    } catch {}
  }, []);

  useEffect(() => {
    // Country detection — URL override > localStorage > auto-detect
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const countryOverride = (urlParams.get('country') || '').toUpperCase();
      if (['PK', 'UAE', 'OTHER'].includes(countryOverride)) {
        selectCountry(countryOverride);
      } else if (localStorage.getItem('user_country')) {
        setUserCountry(localStorage.getItem('user_country'));
      } else {
        // Auto-detect from IP — set silently, no overlay
        fetch('/api/detect-country').then(r => r.json()).then(data => {
          const country = data.country || 'PK';
          setUserCountry(country);
          setDetectedCountry(country);
          localStorage.setItem('user_country', country);
          document.cookie = `newworld_country=${country};max-age=${30 * 86400};path=/;SameSite=Lax`;
        }).catch(() => {
          setUserCountry('PK');
          localStorage.setItem('user_country', 'PK');
        });
      }
    } catch { setUserCountry('PK'); }

    // Load saved UAE curriculum
    try { const c = localStorage.getItem('uae_curriculum'); if (c) setUaeCurriculum(c); } catch {}
  }, [selectCountry]);

  return {
    userCountry,
    detectedCountry,
    uaeCurriculum,
    setUaeCurriculum,
    showUaeCurriculumSelector,
    setShowUaeCurriculumSelector,
    selectCountry,
  };
}

/**
 * UaeCurriculumSelector — full-screen overlay for selecting UAE curriculum.
 */
export function UaeCurriculumSelector({ show, onSelect, onBack }) {
  if (!show) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, background: 'rgba(8,12,24,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Sora',sans-serif", padding: 16, overflowY: 'auto' }}>
      <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>Select your curriculum</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 20px' }}>Which curriculum does your school follow?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {UAE_CURRICULA.map(c => (
            <button key={c.id} onClick={() => {
              try { localStorage.setItem('uae_curriculum', c.id); } catch {}
              onSelect(c.id);
              setTimeout(() => document.getElementById('start-learning')?.scrollIntoView({ behavior: 'smooth' }), 200);
            }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, border: `2px solid ${c.color}30`, background: `${c.color}08`, cursor: 'pointer', fontFamily: "'Sora',sans-serif", width: '100%', textAlign: 'left' }}>
              <span style={{ fontSize: 28 }}>{c.flag}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: c.color }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{c.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <button onClick={onBack} style={{ marginTop: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>← Back</button>
      </div>
    </div>
  );
}

/**
 * FooterCountryFlags — 🇵🇰 🇦🇪 🌍 buttons in footer for switching countries.
 */
export function FooterCountryFlags({ activeCountry }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10, marginBottom: 6 }}>
      {COUNTRIES.map(c => (
        <button key={c.code} onClick={() => {
          localStorage.setItem('user_country', c.code);
          document.cookie = `newworld_country=${c.code};max-age=${30 * 86400};path=/;SameSite=Lax`;
          if (c.code !== 'UAE' && c.code !== 'OTHER') { localStorage.removeItem('uae_curriculum'); }
          window.location.reload();
        }} style={{ background: activeCountry === c.code ? 'rgba(79,142,247,0.15)' : 'rgba(255,255,255,0.04)', border: activeCountry === c.code ? '1.5px solid rgba(79,142,247,0.4)' : '1.5px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, color: activeCountry === c.code ? '#4F8EF7' : 'rgba(255,255,255,0.5)', fontWeight: 700, fontFamily: "'Sora',sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 16 }}>{c.flag}</span>{c.label}
        </button>
      ))}
    </div>
  );
}
